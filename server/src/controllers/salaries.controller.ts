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
  calculateMedian,
  enrichSalary,
  calculatePercentileValue,
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
  const totalComps = allSalaries.map((s) => s.totalCompensation);
  const median = calculatePercentileValue(totalComps, 50);
  const p75 = calculatePercentileValue(totalComps, 75);
  const p90 = calculatePercentileValue(totalComps, 90);

  const levels = allSalaries.reduce((acc: Record<string, any>, curr) => {
    if (!acc[curr.levelStandardized]) {
      acc[curr.levelStandardized] = { count: 0, salaries: [] };
    }
    acc[curr.levelStandardized].count++;
    acc[curr.levelStandardized].salaries.push(curr.totalCompensation);
    return acc;
  }, {});

  // Add stats per level
  const levelStats = Object.keys(levels).reduce((acc: any, key) => {
    const comps = levels[key].salaries;
    acc[key] = {
      count: levels[key].count,
      p50: calculatePercentileValue(comps, 50),
      p75: calculatePercentileValue(comps, 75),
      p90: calculatePercentileValue(comps, 90),
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
      median,
      p75,
      p90,
      total,
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

  const diffTC = enriched1.totalCompensation - enriched2.totalCompensation;
  const compDifferencePercentage =
    Math.round(
      (Math.abs(diffTC) /
        Math.min(enriched1.totalCompensation, enriched2.totalCompensation)) *
        100,
    ) || 0;

  // Decision Intelligence Logic
  const score1 = enriched1.totalCompensation * (enriched1.percentileRank / 100);
  const score2 = enriched2.totalCompensation * (enriched2.percentileRank / 100);

  const winner = enriched1.totalCompensation > enriched2.totalCompensation ? enriched1.id : enriched2.id;
  
  let levelGapInsight = "Equivalent Level Strength";
  const levelDiff = enriched1.levelScore - enriched2.levelScore;
  
  if (levelDiff > 0) {
    levelGapInsight = `${enriched1.company} offer is for a higher standardized level`;
  } else if (levelDiff < 0) {
    levelGapInsight = `${enriched2.company} offer is for a higher standardized level`;
  } else {
    // Same level, compare strength
    if (enriched1.percentileRank > enriched2.percentileRank + 15) {
      levelGapInsight = `Stronger offer from ${enriched1.company} at equivalent level`;
    } else if (enriched2.percentileRank > enriched1.percentileRank + 15) {
      levelGapInsight = `Stronger offer from ${enriched2.company} at equivalent level`;
    }
  }

  const comparison = {
    salary1: enriched1,
    salary2: enriched2,
    difference: {
      totalCompensation: Math.abs(diffTC),
      compDifferencePercentage,
      levelGapInsight,
      winner,
      level1: {
        raw: salary1.level,
        standardized: salary1.levelStandardized,
        score: enriched1.levelScore,
        strength: enriched1.levelStrength
      },
      level2: {
        raw: salary2.level,
        standardized: salary2.levelStandardized,
        score: enriched2.levelScore,
        strength: enriched2.levelStrength
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
