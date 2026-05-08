"use client";

import { cn } from "@/lib/utils";

interface CompanyStatsCardProps {
  company: string;
  median: number;
  levels: Record<string, number>;
  total: number;
}

const levelColors: Record<string, string> = {
  Junior: "bg-blue-500",
  Mid: "bg-green-500",
  Senior: "bg-orange-500",
  Staff: "bg-purple-500",
  Unknown: "bg-slate-400",
};

export const CompanyStatsCard = ({ company, median, levels, total }: CompanyStatsCardProps) => {
  return (
    <div className="w-full rounded-3xl border-none shadow-xl bg-gradient-to-br from-card to-muted/30 overflow-hidden relative p-8">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <h1 className="text-9xl font-black uppercase tracking-tighter select-none">{company}</h1>
      </div>
      
      <div className="relative z-10 pb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-1 bg-primary rounded-full" />
          <h2 className="text-3xl font-black tracking-tight capitalize text-card-foreground">{company} Intelligence</h2>
        </div>
      </div>
      
      <div className="relative z-10 space-y-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Median Total Comp</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-primary">
                  ${median.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">USD</span>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 w-fit">
              <p className="text-sm font-medium text-primary">
                Analyzed across <span className="font-black">{total}</span> verified data points
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Level Distribution</p>
            <div className="space-y-5">
              {["Junior", "Mid", "Senior", "Staff"].map((level) => {
                const count = levels[level] || 0;
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                
                return (
                  <div key={level} className="space-y-2 group">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-black uppercase tracking-wider">{level}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">{count} entries</span>
                        <span className={cn("text-sm font-black", levelColors[level]?.replace('bg-', 'text-'))}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary/50 h-3 rounded-full overflow-hidden border border-muted">
                      <div 
                        className={cn("h-full transition-all duration-1000 ease-out shadow-sm", levelColors[level] || levelColors.Unknown)} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
