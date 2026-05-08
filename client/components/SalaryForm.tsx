"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  salarySchema,
  SalaryFormData,
  normalizeSalaryData,
} from "@/schemas/salarySchema";
import api from "@/lib/api";
import { useState } from "react";
import { useUIStore } from "@/store/uiStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import currencies from "@/app/data/currency.json";
interface Currency {
  code: string;
  name: string;
  symbol: string;
}
export const SalaryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string } | null>(null);
  const { addNotification } = useUIStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    watch,
  } = useForm<SalaryFormData>({
    resolver: yupResolver(salarySchema),
    defaultValues: {
      rawBaseSalary: 0,
      rawBonus: 0,
      rawStock: 0,
      currency: "USD",
      payFrequency: "annual",
      experienceYears: 0,
    },
  });

  const onSubmit = async (data: SalaryFormData) => {
    setIsSubmitting(true);
    try {
      const normalizedData = normalizeSalaryData(data);
      const response = await api.post("/ingest-salary", normalizedData);
      setResult(response.data);
      addNotification("Compensation data securely stored", "success");
      reset();
    } catch (error: any) {
      const message = error.normalizedMessage || "Submission failed";
      addNotification(message, "error");

      if (error.response?.status === 400 && error.response.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          const fieldMap: Record<string, keyof SalaryFormData> = {
            company: "company",
            role: "role",
            level: "level",
            location: "location",
            baseSalary: "rawBaseSalary",
            experienceYears: "experienceYears",
          };

          const formField = fieldMap[err.field];
          if (formField) {
            setError(formField, { message: err.message });
          }
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "flex h-12 w-full rounded-xl bg-muted/30 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all border-none";
  const labelClasses =
    "text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1 block";
  const errorClasses = "text-[10px] font-bold text-destructive mt-1";

  if (result) {
    return (
      <Card className="border-none shadow-2xl bg-gradient-to-br from-primary/5 to-card overflow-hidden">
        <CardContent className="p-12 flex flex-col items-center text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">
              Data Ingested!
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Your compensation details have been anonymously added to the
              intelligence pool.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-background/50 border border-muted font-mono text-xs">
            ID: {result.id}
          </div>
          <Button
            onClick={() => setResult(null)}
            className="rounded-full px-8 font-bold h-12 shadow-lg shadow-primary/20"
          >
            Submit Another Entry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            General Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Company</label>
            <input
              {...register("company")}
              placeholder="e.g. Google"
              className={cn(
                inputClasses,
                errors.company && "ring-2 ring-destructive/20",
              )}
            />
            {errors.company && (
              <p className={errorClasses}>{errors.company.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Role</label>
            <input
              {...register("role")}
              placeholder="e.g. Software Engineer"
              className={cn(
                inputClasses,
                errors.role && "ring-2 ring-destructive/20",
              )}
            />
            {errors.role && (
              <p className={errorClasses}>{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Level (Raw)</label>
            <input
              {...register("level")}
              placeholder="e.g. L4 or Senior"
              className={cn(
                inputClasses,
                errors.level && "ring-2 ring-destructive/20",
              )}
            />
            {errors.level && (
              <p className={errorClasses}>{errors.level.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Location</label>
            <input
              {...register("location")}
              placeholder="e.g. Mountain View, CA"
              className={cn(
                inputClasses,
                errors.location && "ring-2 ring-destructive/20",
              )}
            />
            {errors.location && (
              <p className={errorClasses}>{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Years of Experience</label>
            <input
              type="number"
              {...register("experienceYears", { valueAsNumber: true })}
              className={cn(
                inputClasses,
                errors.experienceYears && "ring-2 ring-destructive/20",
              )}
            />
            {errors.experienceYears && (
              <p className={errorClasses}>{errors.experienceYears.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-dashed">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-2 w-2 text-primary" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            Compensation Structure
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Currency</label>
            <select
              {...register("currency")}
              className={cn(
                inputClasses,
                "appearance-none bg-no-repeat bg-right pr-10",
              )}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Length 19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundSize: "1.5rem",
                backgroundPosition: "calc(100% - 1rem) center",
              }}
            >
              {currencies.map((currency: Currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className={errorClasses}>{errors.currency.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Pay Period</label>
            <select
              {...register("payFrequency")}
              className={cn(
                inputClasses,
                "appearance-none bg-no-repeat bg-right pr-10",
              )}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                backgroundSize: "1.5rem",
                backgroundPosition: "calc(100% - 1rem) center",
              }}
            >
              <option value="annual">Annual</option>
              <option value="monthly">Monthly</option>
            </select>
            {errors.payFrequency && (
              <p className={errorClasses}>{errors.payFrequency.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-1">
            <label className={labelClasses}>Base Salary</label>
            <input
              type="number"
              {...register("rawBaseSalary", { valueAsNumber: true })}
              className={cn(
                inputClasses,
                "font-mono",
                errors.rawBaseSalary && "ring-2 ring-destructive/20",
              )}
            />
            {errors.rawBaseSalary && (
              <p className={errorClasses}>{errors.rawBaseSalary.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Annual Bonus</label>
            <input
              type="number"
              {...register("rawBonus", { valueAsNumber: true })}
              className={cn(
                inputClasses,
                "font-mono",
                errors.rawBonus && "ring-2 ring-destructive/20",
              )}
            />
            {errors.rawBonus && (
              <p className={errorClasses}>{errors.rawBonus.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Annual Stock (RSUs)</label>
            <input
              type="number"
              {...register("rawStock", { valueAsNumber: true })}
              className={cn(
                inputClasses,
                "font-mono",
                errors.rawStock && "ring-2 ring-destructive/20",
              )}
            />
            {errors.rawStock && (
              <p className={errorClasses}>{errors.rawStock.message}</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full h-14 rounded-2xl text-lg font-black tracking-tight shadow-xl transition-all duration-300 flex items-center justify-center gap-2",
          isSubmitting
            ? "bg-primary/50 cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:scale-[1.01] active:scale-[0.99] shadow-primary/20",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Ingesting Data...
          </>
        ) : (
          "Submit Compensation Data"
        )}
      </button>
    </form>
  );
};
