export declare const normalizeCompany: (company: string) => string;
export declare const normalizeLevel: (level: string) => string;
export declare const computeTotalCompensation: (baseSalary: number, bonus?: number, stock?: number) => number;
export declare const calculateMedian: (values: number[]) => number;
export declare const computeConfidenceScore: (input: {
    baseSalary: number;
    bonus?: number;
    stock?: number;
    experienceYears?: number;
}) => number;
export declare const buildFilterQuery: (query: any) => any;
export declare const getLevelScore: (standardized: string) => number;
export declare const calculatePercentile: (value: number, allValues: number[]) => number;
export declare const calculatePercentileValue: (values: number[], percentile: number) => number;
export declare const getLevelStrength: (standardized: string, percentile: number) => string;
export declare const normalizeCompensation: (salary: any) => {
    totalAnnual: number;
    totalUSD: number;
    currencyUsed: any;
    periodNormalized: string;
};
export declare const enrichSalary: (salary: any, peerSalaries: any[]) => any;
export declare const normalizeToUSD: (salary: any) => {
    totalAnnual: number;
    totalUSD: number;
    currencyUsed: any;
    periodNormalized: string;
};
//# sourceMappingURL=salary.utils.d.ts.map