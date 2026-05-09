export const normalizeCompany = (company) => {
    // Trim whitespace, lowercase, collapse multiple spaces, remove trailing punctuation
    const legalSuffix = /[,.]?\s*(inc\.?|llc\.?|ltd\.?|corp\.?|co\.?|plc\.?|gmbh\.?|s\.a\.?)\.?$/i;
    return company
        .trim()
        .toLowerCase()
        .replace(legalSuffix, "") // remove suffixes
        .replace(/[,\.\s]+$/, "") // remove trailing punctuation and spaces
        .replace(/\s+/g, " ") // collapse duplicate spaces
        .trim();
};
export const normalizeLevel = (level) => {
    return level.trim().toUpperCase().replace(/\s+/g, "");
};
export const computeTotalCompensation = (baseSalary, bonus = 0, stock = 0) => {
    return baseSalary + bonus + stock;
};
export const calculateMedian = (values) => {
    if (values.length === 0)
        return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
    }
    return sorted[mid] ?? 0;
};
export const computeConfidenceScore = (input) => {
    let score = 0.5; // Base
    if (input.bonus !== undefined && input.bonus > 0)
        score += 0.2;
    else
        score -= 0.1; // Missing or zero optional field
    if (input.stock !== undefined && input.stock > 0)
        score += 0.2;
    else
        score -= 0.1; // Missing or zero optional field
    if (input.experienceYears !== undefined)
        score += 0.1;
    else
        score -= 0.1; // Missing optional field
    // Clamp between 0 and 1
    return Math.max(0, Math.min(1, score));
};
export const buildFilterQuery = (query) => {
    const where = {};
    if (query.company) {
        where.company = {
            contains: normalizeCompany(query.company),
            mode: "insensitive",
        };
    }
    if (query.role) {
        where.role = {
            contains: query.role.trim(),
            mode: "insensitive",
        };
    }
    if (query.location) {
        where.location = {
            contains: query.location.trim(),
            mode: "insensitive",
        };
    }
    if (query.level) {
        const levelVal = query.level.trim();
        where.OR = [
            { level: normalizeLevel(levelVal) },
            { levelStandardized: levelVal },
        ];
    }
    if (query.currency) {
        where.currency = query.currency.trim();
    }
    if (query.compensationPeriod) {
        where.compensationPeriod = query.compensationPeriod.trim();
    }
    return where;
};
export const getLevelScore = (standardized) => {
    const scores = {
        Junior: 1,
        Mid: 2,
        Senior: 3,
        Staff: 4,
    };
    return scores[standardized] || 0;
};
export const calculatePercentile = (value, allValues) => {
    if (allValues.length === 0)
        return 0;
    // Use a more standard percentile formula: (number of values below + 0.5) / n * 100
    const below = allValues.filter((v) => v < value).length;
    const same = allValues.filter((v) => v === value).length;
    return Math.round(((below + same / 2) / allValues.length) * 100);
};
export const calculatePercentileValue = (values, percentile) => {
    if (values.length === 0)
        return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    if (lower === upper)
        return sorted[lower] ?? 0;
    return (sorted[lower] ?? 0) * (1 - weight) + (sorted[upper] ?? 0) * weight;
};
export const getLevelStrength = (standardized, percentile) => {
    let prefix = "Mid";
    if (percentile < 25)
        prefix = "Low";
    else if (percentile > 75)
        prefix = "Strong";
    else if (percentile > 90)
        prefix = "Elite";
    return `${prefix} ${standardized}`;
};
const BACKEND_CURRENCY_RATES = {
    USD: 1,
    EUR: 1.08,
    GBP: 1.27,
    INR: 0.012,
    CHF: 1.12,
    CAD: 0.73,
    AUD: 0.66,
    SGD: 0.74,
    JPY: 0.0067,
    CNY: 0.14,
    NGN: 0.00065,
    ZAR: 0.053,
    AED: 0.27,
    SAR: 0.27,
    RUB: 0.011,
};
export const normalizeCompensation = (salary) => {
    const period = (salary.compensationPeriod || "YEARLY").toUpperCase();
    const periodMultiplier = period === "MONTHLY" ? 12 : 1;
    const currency = salary.currency || "USD";
    const fxRate = BACKEND_CURRENCY_RATES[currency] || 1;
    // STEP 1 & 2: Normalize Time and Compute Total Annual (Raw Currency)
    const annualBase = (salary.baseSalary || 0) * periodMultiplier;
    const annualBonus = (salary.bonus || 0) * periodMultiplier;
    const annualStock = (salary.stock || 0) * periodMultiplier;
    const totalAnnual = annualBase + annualBonus + annualStock;
    // STEP 3: Convert to USD
    const totalUSD = totalAnnual * fxRate;
    return {
        totalAnnual,
        totalUSD,
        currencyUsed: currency,
        periodNormalized: "YEARLY",
    };
};
export const enrichSalary = (salary, peerSalaries) => {
    const normalizedSelf = normalizeCompensation(salary);
    // Peer percentiles must use normalized USD values for global accuracy
    const peerUSDValues = peerSalaries.map(s => normalizeCompensation(s).totalUSD);
    const percentileRank = calculatePercentile(normalizedSelf.totalUSD, peerUSDValues);
    const levelScore = getLevelScore(salary.levelStandardized);
    const levelStrength = getLevelStrength(salary.levelStandardized, percentileRank);
    return {
        ...salary,
        ...normalizedSelf,
        levelScore,
        percentileRank,
        levelStrength,
    };
};
// Deprecated in favor of normalizeCompensation
export const normalizeToUSD = normalizeCompensation;
//# sourceMappingURL=salary.utils.js.map