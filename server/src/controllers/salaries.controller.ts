import type { Request, Response } from "express";
import { standardizedLevel } from "../utils/level.util.ts";
import { prisma } from "../../lib/prisma.ts";
import {
  computeConfidenceScore,
  computeTotalCompensation,
  normalizeCompany,
  normalizeLevel,
  buildFilterQuery,
  calculateMedian,
} from "../utils/salary.utils.ts";

export const ingestSalary = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const {
    company,
    role,
    level,
    location,
    baseSalary,
    bonus,
    stock,
    experienceYears,
  } = req.body;

  try {
    // Strict Validation
    if (!company || typeof company !== "string" || company.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid company" });
    }
    if (!role || typeof role !== "string" || role.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid role" });
    }
    if (!level || typeof level !== "string" || level.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid level" });
    }
    if (!location || typeof location !== "string" || location.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid location" });
    }
    if (
      typeof baseSalary !== "number" ||
      isNaN(baseSalary) ||
      !isFinite(baseSalary) ||
      baseSalary < 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing or invalid baseSalary" });
    }
    if (
      typeof experienceYears !== "number" ||
      isNaN(experienceYears) ||
      !isFinite(experienceYears) ||
      experienceYears < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid experienceYears",
      });
    }

    const safeBonus =
      typeof bonus === "number" &&
      !isNaN(bonus) &&
      isFinite(bonus) &&
      bonus >= 0
        ? bonus
        : 0;
    const safeStock =
      typeof stock === "number" &&
      !isNaN(stock) &&
      isFinite(stock) &&
      stock >= 0
        ? stock
        : 0;

    // Reject explicitly negative numbers (though defaults cover missing)
    if (
      bonus !== undefined &&
      (typeof bonus !== "number" ||
        isNaN(bonus) ||
        bonus < 0 ||
        !isFinite(bonus))
    ) {
      return res.status(400).json({ success: false, message: "Invalid bonus" });
    }
    if (
      stock !== undefined &&
      (typeof stock !== "number" ||
        isNaN(stock) ||
        stock < 0 ||
        !isFinite(stock))
    ) {
      return res.status(400).json({ success: false, message: "Invalid stock" });
    }

    // Normalization
    const normalizedCompany = normalizeCompany(company);
    const normalizedLevel = normalizeLevel(level);

    // Logic
    const totalCompensation = computeTotalCompensation(
      baseSalary,
      safeBonus,
      safeStock,
    );
    let confidenceScore = computeConfidenceScore({
      baseSalary,
      bonus: safeBonus,
      stock: safeStock,
      experienceYears,
    });
    const levelStandardized = standardizedLevel(level);
    const similarEntries = await prisma.salary.findMany({
      where: {
        company: normalizedCompany,
        role: role.trim(),
        level: normalizedLevel,
        levelStandardized: levelStandardized,
        location: location.trim(),
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
        role: role.trim(),
        level: normalizedLevel,
        levelStandardized: levelStandardized,
        location: location.trim(),
        experienceYears,
        baseSalary,
        bonus: safeBonus,
        stock: safeStock,
        totalCompensation,
        confidenceScore,
      },
    });

    return res.status(201).json({
      success: true,
      id: newSalary.id,
    });
  } catch (error) {
    console.error("Error ingesting salary:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSalaries = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const where = buildFilterQuery(req.query);
    const salaries = await prisma.salary.findMany({
      where,
      orderBy: { totalCompensation: "desc" },
    });
    return res.status(200).json(salaries);
  } catch (error) {
    console.error("Error fetching salaries:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCompanyStats = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { company } = req.params;
    if (!company) {
      return res
        .status(400)
        .json({ success: false, message: "Company parameter is required" });
    }

    const normalizedCompany = normalizeCompany(company as string);

    const salaries = await prisma.salary.findMany({
      where: { company: normalizedCompany },
      orderBy: { totalCompensation: "desc" },
    });

    if (salaries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found or no salaries available",
      });
    }

    const totalComps = salaries.map((s) => s.totalCompensation);
    const median = totalComps.length > 0 ? calculateMedian(totalComps) : 0;

    const levels = salaries.reduce((acc: Record<string, number>, curr) => {
      acc[curr.levelStandardized] = (acc[curr.levelStandardized] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({
      company: normalizedCompany,
      median,
      levels,
      salaries,
    });
  } catch (error) {
    console.error("Error fetching company stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// salary comparison between two salaries
export const compareSalaries = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id1, id2 } = req.query;
    if (!id1 || !id2 || typeof id1 !== "string" || typeof id2 !== "string") {
      return res.status(400).json({
        success: false,
        message: "id1 and id2 query parameters are required",
      });
    }

    const [salary1, salary2] = await Promise.all([
      prisma.salary.findUnique({ where: { id: id1 as string } }),
      prisma.salary.findUnique({ where: { id: id2 as string } }),
    ]);

    if (!salary1 || !salary2) {
      return res
        .status(404)
        .json({ success: false, message: "One or both salaries not found" });
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
  } catch (error: any) {
    console.error("Error comparing salaries:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
