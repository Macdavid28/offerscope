import { z } from "zod";
export declare const ingestSalarySchema: z.ZodObject<{
    company: z.ZodString;
    role: z.ZodString;
    level: z.ZodString;
    location: z.ZodString;
    baseSalary: z.ZodNumber;
    experienceYears: z.ZodNumber;
    bonus: z.ZodDefault<z.ZodNumber>;
    stock: z.ZodDefault<z.ZodNumber>;
    currency: z.ZodDefault<z.ZodString>;
    compensationPeriod: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type IngestSalaryInput = z.infer<typeof ingestSalarySchema>;
//# sourceMappingURL=salary.schema.d.ts.map