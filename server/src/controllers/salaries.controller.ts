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

  return res.status(200).json({
    data: salaries,
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
  const median = totalComps.length > 0 ? calculateMedian(totalComps) : 0;

  const levels = allSalaries.reduce((acc: Record<string, number>, curr) => {
    acc[curr.levelStandardized] = (acc[curr.levelStandardized] || 0) + 1;
    return acc;
  }, {});

  return res.status(200).json({
    company: normalizedCompany,
    median,
    levels,
    salaries: paginatedSalaries,
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

  const comparison = {
    salary1,
    salary2,
    difference: {
      totalCompensation: Math.abs(
        salary1.totalCompensation - salary2.totalCompensation,
      ),
      level1: {
        raw: salary1.level,
        standardized: salary1.levelStandardized,
      },
      level2: {
        raw: salary2.level,
        standardized: salary2.levelStandardized,
      },
    },
  };

  return res.status(200).json(comparison);
};
