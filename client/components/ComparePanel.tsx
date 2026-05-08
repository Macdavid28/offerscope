"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, TrendingUp, Trophy } from "lucide-react";

interface ComparePanelProps {
  salary1: any;
  salary2: any;
  difference: {
    totalCompensation: number;
    level1: { raw: string; standardized: string };
    level2: { raw: string; standardized: string };
  };
}

export const ComparePanel = ({
  salary1,
  salary2,
  difference,
}: ComparePanelProps) => {
  const isS1Higher = salary1.totalCompensation > salary2.totalCompensation;
  const minTC = Math.min(salary1.totalCompensation, salary2.totalCompensation);
  const percentDiff =
    minTC > 0 ? Math.round((difference.totalCompensation / minTC) * 100) : 0;

  const currencyMismatch = salary1.currency !== salary2.currency;
  const periodMismatch =
    salary1.compensationPeriod !== salary2.compensationPeriod;

  const SalaryCard = ({
    salary,
    isHigher,
  }: {
    salary: any;
    isHigher: boolean;
  }) => (
    <Card
      className={cn(
        "flex-1 relative overflow-hidden transition-all duration-500",
        isHigher
          ? "border-primary ring-2 ring-primary/20 shadow-2xl scale-[1.02] z-10"
          : "opacity-80 grayscale-[0.2]",
      )}
    >
      {isHigher && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl font-black text-xs uppercase tracking-widest flex items-center gap-1 shadow-lg">
          <Trophy className="h-3 w-3" /> Best Offer
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex flex-col">
          <CardTitle className="text-3xl font-black tracking-tighter capitalize">
            {salary.company}
          </CardTitle>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            {salary.role}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-muted/50 border border-muted">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
              Level
            </p>
            <p className="font-bold text-sm">
              {salary.level} ({salary.levelStandardized})
            </p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50 border border-muted">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
              Location
            </p>
            <p className="font-bold text-sm truncate">{salary.location}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-dashed">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              Base Salary
            </span>
            <span className="font-bold">
              {salary.currency === "INR" ? "₹" : "$"}
              {salary.baseSalary.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-dashed">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              Bonus + Stock
            </span>
            <span className="font-bold">
              {salary.currency === "INR" ? "₹" : "$"}
              {(salary.bonus + salary.stock).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            Total Compensation
          </p>
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "text-4xl font-black tracking-tighter",
                isHigher ? "text-primary" : "text-foreground",
              )}
            >
              {salary.currency === "INR" ? "₹" : "$"}
              {salary.totalCompensation.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              / {salary.compensationPeriod.toLowerCase().replace("ly", "")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-10">
      {(currencyMismatch || periodMismatch) && (
        <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-2xl text-orange-800 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div className="text-sm font-bold uppercase tracking-tight">
            Comparison Mismatch:
            {currencyMismatch && ` ${salary1.currency} vs ${salary2.currency}`}
            {currencyMismatch && periodMismatch && " | "}
            {periodMismatch &&
              ` ${salary1.compensationPeriod} vs ${salary2.compensationPeriod}`}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 relative">
        <SalaryCard salary={salary1} isHigher={isS1Higher} />
        <div className="flex items-center justify-center relative">
          <div className="h-14 w-14 rounded-full bg-background border-4 border-muted flex items-center justify-center font-black text-xl shadow-xl z-20">
            VS
          </div>
          <div className="hidden lg:block absolute h-full w-[2px] bg-gradient-to-b from-transparent via-muted to-transparent" />
        </div>
        <SalaryCard salary={salary2} isHigher={!isS1Higher} />
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <Card className="relative bg-card border-none shadow-2xl overflow-hidden rounded-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
            <div className="flex flex-col items-center">
              <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Compensation Delta
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-foreground">
                  ${difference.totalCompensation.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-lg font-black">+{percentDiff}%</span>
                </div>
              </div>
            </div>

            <p className="text-xl font-medium text-muted-foreground max-w-2xl leading-relaxed">
              <span className="font-black text-foreground capitalize">
                {isS1Higher ? salary1.company : salary2.company}
              </span>{" "}
              offers a significantly higher package, with a{" "}
              <span className="text-primary font-black">
                {percentDiff}% increase
              </span>{" "}
              compared to {isS1Higher ? salary2.company : salary1.company}.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
