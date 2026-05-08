export const normalizeCompany = (company: string): string => {
  // Trim whitespace, lowercase, collapse multiple spaces, remove trailing punctuation
  const legalSuffix =
    /[,.]?\s*(inc\.?|llc\.?|ltd\.?|corp\.?|co\.?|plc\.?|gmbh\.?|s\.a\.?)\.?$/i;
  
  return company
    .trim()
    .toLowerCase()
    .replace(legalSuffix, "") // remove suffixes
    .replace(/[,\.\s]+$/, "") // remove trailing punctuation and spaces
    .replace(/\s+/g, " ") // collapse duplicate spaces
    .trim();
};

export const normalizeLevel = (level: string): string => {
  return level.trim().toUpperCase().replace(/\s+/g, "");
};

export const computeTotalCompensation = (
  baseSalary: number,
  bonus: number = 0,
  stock: number = 0
): number => {
  return baseSalary + bonus + stock;
};

export const calculateMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
  }
  return sorted[mid] ?? 0;
};

export const computeConfidenceScore = (input: {
  baseSalary: number;
  bonus?: number;
  stock?: number;
  experienceYears?: number;
}): number => {
  let score = 0.5; // Base

  if (input.bonus !== undefined && input.bonus > 0) score += 0.2;
  else score -= 0.1; // Missing or zero optional field

  if (input.stock !== undefined && input.stock > 0) score += 0.2;
  else score -= 0.1; // Missing or zero optional field

  if (input.experienceYears !== undefined) score += 0.1;
  else score -= 0.1; // Missing optional field

  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, score));
};

export const buildFilterQuery = (query: any) => {
  const where: any = {};
  if (query.company) where.company = normalizeCompany(query.company as string);
  if (query.role) where.role = (query.role as string).trim();
  if (query.level) where.level = normalizeLevel(query.level as string);
  if (query.location) where.location = (query.location as string).trim();
  if (query.currency) where.currency = (query.currency as string).trim();
  if (query.compensationPeriod) where.compensationPeriod = (query.compensationPeriod as string).trim();
  return where;
};
