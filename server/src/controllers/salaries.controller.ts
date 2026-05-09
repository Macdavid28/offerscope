import type { Request, Response } from "express";
import { standardizedLevel } from "../utils/level.util.ts";
import { prisma } from "../../lib/prisma.ts";
import { AppError } from "../errors/AppError.ts";
import {
  computeConfidenceScore,
  computeTotalCompensation,
  normalizeCompany,
  normalizeLevel,
  buildFilterQuery,
  enrichSalary,
  calculatePercentileValue,
  normalizeCompensation,
  getLevelScore,
} from "../utils/salary.utils.ts";
import { ingestSalarySchema } from "../schemas/salary.schema.ts";

export const ingestSalary = async (
  req: Request,
  res: Response,
): Promise<any> => {
  // Validate using Zod
  const validatedData = ingestSalarySchema.parse(req.body);

  const {
    company,
    role,
    level,
    location,
    baseSalary,
    bonus,
    stock,
    experienceYears,
    currency,
    compensationPeriod,
  } = validatedData;

  // Normalization
  const normalizedCompany = normalizeCompany(company);
  const normalizedLevel = normalizeLevel(level);

  // Logic
  const totalCompensation = computeTotalCompensation(baseSalary, bonus, stock);
  let confidenceScore = computeConfidenceScore({
    baseSalary,
    bonus,
    stock,
    experienceYears,
  });
  const levelStandardized = standardizedLevel(level);

  const similarEntries = await prisma.salary.findMany({
    where: {
      company: normalizedCompany,
      role,
      level: normalizedLevel,
      levelStandardized: levelStandardized,
      location,
    },
  });

  // reduce confidence score if similar entries are more than 5
  if (similarEntries.length >= 5) {
    confidenceScore = Math.max(0, confidenceScore - 0.1);
  }

  // DB Storage
  const newSalary = await prisma.salary.create({
    data: {
      company: normalizedCompany,
      role,
      level: normalizedLevel,
      levelStandardized: levelStandardized,
      location,
      experienceYears,
      baseSalary,
      bonus,
      stock,
      totalCompensation,
      confidenceScore,
      currency,
      compensationPeriod,
    },
  });

  return res.status(201).json({
    success: true,
    id: newSalary.id,
  });
};

export const getSalaries = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const where = buildFilterQuery(req.query);

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;

  const [salaries, total] = await Promise.all([
    prisma.salary.findMany({
      where,
      orderBy: { totalCompensation: "desc" },
      skip,
      take: limit,
    }),
    prisma.salary.count({ where }),
  ]);

  // Bulk fetch peer data for enrichment to avoid N+1
  const companyLevelPairs = Array.from(
    new Set(salaries.map((s) => `${s.company}|${s.levelStandardized}`)),
  ).map((pair) => {
    const [company, levelStandardized] = pair.split("|");
    return { company, levelStandardized };
  });

  const peerData = await prisma.salary.findMany({
    where: {
      OR: companyLevelPairs.map((pair) => ({
        company: pair.company,
        levelStandardized: pair.levelStandardized,
      })),
    },
    select: { company: true, levelStandardized: true, totalCompensation: true },
  });

  const enrichedSalaries = salaries.map((salary) => {
    const peers = peerData.filter(
      (p) =>
        p.company === salary.company &&
        p.levelStandardized === salary.levelStandardized,
    );
    return enrichSalary(salary, peers);
  });

  return res.status(200).json({
    data: enrichedSalaries,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getCompanyStats = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { company } = req.params;
  if (!company) {
    throw new AppError(400, "Company parameter is required");
  }

  const normalizedCompany = normalizeCompany(company as string);

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
  const skip = (page - 1) * limit;

  // We fetch all for stats calculation, but return paginated results for the list
  const [allSalaries, paginatedSalaries] = await Promise.all([
    prisma.salary.findMany({
      where: { company: normalizedCompany },
    }),
    prisma.salary.findMany({
      where: { company: normalizedCompany },
      orderBy: { totalCompensation: "desc" },
      skip,
      take: limit,
    }),
  ]);

  if (allSalaries.length === 0) {
    throw new AppError(404, "Company not found or no salaries available");
  }

  const total = allSalaries.length;
  // Use normalized USD values for global median/percentile accuracy
  const totalUSDComps = allSalaries.map(
    (s) => normalizeCompensation(s).totalUSD,
  );
  const medianUSD = calculatePercentileValue(totalUSDComps, 50);
  const p75USD = calculatePercentileValue(totalUSDComps, 75);
  const p90USD = calculatePercentileValue(totalUSDComps, 90);

  const levels = allSalaries.reduce((acc: Record<string, any>, curr) => {
    if (!acc[curr.levelStandardized]) {
      acc[curr.levelStandardized] = { count: 0, usdSalaries: [] };
    }
    acc[curr.levelStandardized].count++;
    acc[curr.levelStandardized].usdSalaries.push(
      normalizeCompensation(curr).totalUSD,
    );
    return acc;
  }, {});

  // Add stats per level (using normalized USD)
  const levelStats = Object.keys(levels).reduce((acc: any, key) => {
    const usdComps = levels[key].usdSalaries;
    acc[key] = {
      count: levels[key].count,
      p50: calculatePercentileValue(usdComps, 50),
      p75: calculatePercentileValue(usdComps, 75),
      p90: calculatePercentileValue(usdComps, 90),
      currencyUsed: "USD",
    };
    return acc;
  }, {});

  const enrichedPaginated = paginatedSalaries.map((s) => {
    const peers = allSalaries.filter(
      (p) => p.levelStandardized === s.levelStandardized,
    );
    return enrichSalary(s, peers);
  });

  return res.status(200).json({
    company: normalizedCompany,
    stats: {
      median: medianUSD,
      p75: p75USD,
      p90: p90USD,
      total,
      currencyUsed: "USD",
    },
    levels: levelStats,
    salaries: enrichedPaginated,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

// salary comparison between two salaries
export const compareSalaries = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { id1, id2 } = req.query;
  if (!id1 || !id2 || typeof id1 !== "string" || typeof id2 !== "string") {
    throw new AppError(400, "id1 and id2 query parameters are required");
  }

  const [salary1, salary2] = await Promise.all([
    prisma.salary.findUnique({ where: { id: id1 as string } }),
    prisma.salary.findUnique({ where: { id: id2 as string } }),
  ]);

  if (!salary1 || !salary2) {
    throw new AppError(404, "One or both salaries not found");
  }

  // Fetch peers for both
  const [peers1, peers2] = await Promise.all([
    prisma.salary.findMany({
      where: {
        company: salary1.company,
        levelStandardized: salary1.levelStandardized,
      },
    }),
    prisma.salary.findMany({
      where: {
        company: salary2.company,
        levelStandardized: salary2.levelStandardized,
      },
    }),
  ]);

  const enriched1 = enrichSalary(salary1, peers1);
  const enriched2 = enrichSalary(salary2, peers2);

  // STEP 1-3: Normalize both salaries using the central pipeline
  const norm1 = normalizeCompensation(salary1);
  const norm2 = normalizeCompensation(salary2);

  // Decision Logic
  const winner = norm1.totalUSD > norm2.totalUSD ? "salary1" : "salary2";
  const diffUSD = Math.abs(norm1.totalUSD - norm2.totalUSD);
  const minUSD = Math.min(norm1.totalUSD, norm2.totalUSD);
  const diffPercent = minUSD > 0 ? Math.round((diffUSD / minUSD) * 100) : 0;

  const winnerSalary = winner === "salary1" ? salary1 : salary2;
  const loserSalary = winner === "salary1" ? salary2 : salary1;
  const reasoning = `${winnerSalary.company} offers a mathematically superior package with an annualized value of $${Math.round(Math.max(norm1.totalUSD, norm2.totalUSD)).toLocaleString()} USD, which is ${diffPercent}% higher than ${loserSalary.company}.`;

  const comparison = {
    salary1: enriched1,
    salary2: enriched2,

    normalized: {
      salary1: {
        totalAnnual: norm1.totalAnnual,
        totalUSD: norm1.totalUSD,
        currencyUsed: norm1.currencyUsed,
      },
      salary2: {
        totalAnnual: norm2.totalAnnual,
        totalUSD: norm2.totalUSD,
        currencyUsed: norm2.currencyUsed,
      },
    },

    comparison: {
      winner,
      differenceUSD: diffUSD,
      differencePercentage: diffPercent,
      reasoning,
    },

    // Backward compatibility for existing UI
    difference: {
      totalCompensation: diffUSD,
      compDifferencePercentage: diffPercent,
      levelGapInsight: reasoning,
      winner: winner === "salary1" ? salary1.id : salary2.id,
      level1: {
        raw: salary1.level,
        standardized: salary1.levelStandardized,
        score: enriched1.levelScore,
        strength: enriched1.levelStrength,
      },
      level2: {
        raw: salary2.level,
        standardized: salary2.levelStandardized,
        score: enriched2.levelScore,
        strength: enriched2.levelStrength,
      },
    },
  };

  return res.status(200).json(comparison);
};

export const getCompanies = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const companies = await prisma.salary.findMany({
    select: { company: true },
    distinct: ["company"],
    orderBy: { company: "asc" },
  });
  return res.status(200).json(companies.map((c) => c.company));
};
