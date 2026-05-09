import * as yup from "yup";
import { CURRENCY_RATES } from "@/lib/currencyRates";
import currencies from "@/app/data/currency.json";

type Currency = {
  code: string;
  name: string;
  symbol: string;
};

const currencyCodes = currencies.map((c: Currency) => c.code);
export const salarySchema = yup.object({
  company: yup.string().required("Company is required"),
  role: yup.string().required("Role is required"),
  level: yup.string().required("Level is required"),
  location: yup.string().required("Location is required"),
  experienceYears: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .required("Required"),

  // These are the raw inputs from the user
  rawBaseSalary: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .required("Required"),
  rawBonus: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .default(0),
  rawStock: yup
    .number()
    .typeError("Must be a number")
    .min(0, "Cannot be negative")
    .default(0),

  currency: yup.string().oneOf(currencyCodes).default("USD"),
  payFrequency: yup.string().oneOf(["monthly", "annual"]).default("annual"),
});

export type SalaryFormData = yup.InferType<typeof salarySchema>;

// Helper to normalize the data before sending to backend
export const normalizeSalaryData = (data: SalaryFormData) => {
  return {
    company: data.company,
    role: data.role,
    level: data.level,
    location: data.location,
    experienceYears: data.experienceYears,
    baseSalary: data.rawBaseSalary,
    bonus: data.rawBonus || 0,
    stock: data.rawStock || 0,
    currency: data.currency,
    compensationPeriod: data.payFrequency === "monthly" ? "MONTHLY" : "YEARLY",
  };
};
