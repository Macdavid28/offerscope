import { z } from "zod";

export const ingestSalarySchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  role: z.string().trim().min(1, "Role is required"),
  level: z.string().trim().min(1, "Level is required"),
  location: z.string().trim().min(1, "Location is required"),

  baseSalary: z.number().min(0, "Base salary cannot be negative"),
  experienceYears: z.number().min(0, "Experience years cannot be negative"),

  bonus: z.number().min(0, "Bonus cannot be negative").default(0),
  stock: z.number().min(0, "Stock cannot be negative").default(0),

  currency: z.string().trim().default("USD"),
  compensationPeriod: z.string().trim().default("YEARLY"),
});

export type IngestSalaryInput = z.infer<typeof ingestSalarySchema>;
