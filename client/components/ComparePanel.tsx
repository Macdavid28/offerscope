"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, getCurrencySymbol } from "@/lib/utils";
import { AlertTriangle, TrendingUp, Trophy } from "lucide-react";

interface ComparePanelProps {
  salary1: any;
  salary2: any;
  difference: any;
  normalized?: {
    salary1: { totalAnnual: number; totalUSD: number; currencyUsed: string };
    salary2: { totalAnnual: number; totalUSD: number; currencyUsed: string };
  };
  comparison?: {
    winner: "salary1" | "salary2";
    differenceUSD: number;
    differencePercentage: number;
    reasoning: string;
  };
}

const SalaryCard = ({
  salary,
  isHigher,
  normalizedData,
}: {
  salary: any;
  isHigher: boolean;
  normalizedData?: { totalAnnual: number; totalUSD: number; currencyUsed: string };
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
            {getCurrencySymbol(salary.currency)}
            {salary.baseSalary.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-dashed">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            Bonus + Stock
          </span>
          <span className="font-bold">
            {getCurrencySymbol(salary.currency)}
            {(salary.bonus + salary.stock).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t pt-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
              Raw Total
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tighter">
                {getCurrencySymbol(salary.currency)}
                {salary.totalCompensation.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                / {salary.compensationPeriod.toLowerCase().replace("ly", "")}
              </span>
            </div>
          </div>
        </div>

        {normalizedData && (
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
              Global Annualized (USD)
            </p>
            <p className="text-3xl font-black tracking-tighter text-primary">
              ${Math.round(normalizedData.totalUSD).toLocaleString()}
            </p>
            <p className="text-[9px] font-bold text-primary/60 uppercase mt-1">
              Normalized for comparison
            </p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const ComparePanel = ({
  salary1,
  salary2,
  difference,
  normalized,
  comparison,
}: ComparePanelProps) => {
  // Use backend's intelligence if available, fallback to legacy raw comparison
  const isS1Higher = comparison ? comparison.winner === "salary1" : salary1.totalCompensation > salary2.totalCompensation;
  const percentDiff = comparison ? comparison.differencePercentage : difference.compDifferencePercentage;
  const reasoning = comparison ? comparison.reasoning : difference.levelGapInsight;

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <SalaryCard 
          salary={salary1} 
          isHigher={isS1Higher} 
          normalizedData={normalized?.salary1}
        />
        <div className="flex items-center justify-center relative">
          <div className="h-14 w-14 rounded-full bg-background border-4 border-muted flex items-center justify-center font-black text-xl shadow-xl z-20">
            VS
          </div>
          <div className="hidden lg:block absolute h-full w-[2px] bg-gradient-to-b from-transparent via-muted to-transparent" />
        </div>
        <SalaryCard 
          salary={salary2} 
          isHigher={!isS1Higher} 
          normalizedData={normalized?.salary2}
        />
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <Card className="relative bg-card border-none shadow-2xl overflow-hidden rounded-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
            <div className="flex flex-col items-center">
              <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Global Intelligence Analysis
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black tracking-tighter text-foreground">
                  {comparison ? `$${Math.round(comparison.differenceUSD).toLocaleString()}` : `${getCurrencySymbol(salary1.currency)}${difference.totalCompensation.toLocaleString()}`}
                </span>
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-lg font-black">+{percentDiff}%</span>
                </div>
              </div>
            </div>

            <p className="text-xl font-medium text-muted-foreground max-w-2xl leading-relaxed">
              {reasoning}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
