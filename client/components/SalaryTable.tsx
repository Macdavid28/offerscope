"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSalaryStore } from "@/store/salaryStore";
import { useSalaries } from "@/hooks/useSalaries";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", className)}>
    {children}
  </span>
);

export const SalaryTable = () => {
  const { 
    salaries, 
    isLoading, 
    isInitialLoading,
    totalPages, 
    currentPage, 
    toggleComparison, 
    selectedForComparison 
  } = useSalaryStore();
  const { goToPage } = useSalaries();

  // Highlight highest TC
  const maxTC = salaries.length > 0 ? Math.max(...salaries.map(s => s.totalCompensation)) : 0;

  if (isInitialLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <th key={i} className="px-4 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-bold">Company</th>
                <th className="px-4 py-3 text-left font-bold">Role & Level</th>
                <th className="px-4 py-3 text-left font-bold">Location</th>
                <th className="px-4 py-3 text-center font-bold">Confidence</th>
                <th className="px-4 py-3 text-right font-bold">Total Compensation</th>
                <th className="px-4 py-3 text-center font-bold">Compare</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No compensation data found.
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => {
                  const isHighest = salary.totalCompensation === maxTC && maxTC > 0;
                  return (
                    <tr 
                      key={salary.id} 
                      className={cn(
                        "group transition-colors hover:bg-muted/30",
                        isHighest && "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary"
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="font-bold text-foreground capitalize">{salary.company}</div>
                        <div className="text-xs text-muted-foreground">{new Date(salary.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{salary.role}</span>
                          <div className="flex gap-2">
                            <Badge className="bg-secondary/50 text-secondary-foreground border-none">
                              {salary.levelStandardized}
                            </Badge>
                            {salary.experienceYears > 10 && (
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                Expert
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground italic">{salary.location}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full transition-all",
                                salary.confidenceScore > 0.7 ? "bg-green-500" : 
                                salary.confidenceScore > 0.4 ? "bg-yellow-500" : "bg-red-500"
                              )}
                              style={{ width: `${salary.confidenceScore * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {Math.round(salary.confidenceScore * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-lg font-black tracking-tight",
                            isHighest ? "text-primary" : "text-foreground"
                          )}>
                            {salary.currency === 'INR' ? '₹' : salary.currency === 'EUR' ? '€' : salary.currency === 'GBP' ? '£' : '$'}
                            {salary.totalCompensation.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">
                            Per {salary.compensationPeriod.toLowerCase().replace('ly', '')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Button
                          variant={selectedForComparison.includes(salary.id) ? "default" : "outline"}
                          size="sm"
                          className="rounded-full font-bold h-8"
                          onClick={() => toggleComparison(salary.id)}
                        >
                          {selectedForComparison.includes(salary.id) ? "Selected" : "Compare"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2 px-2">
          <div className="text-sm text-muted-foreground">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = currentPage;
                if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                
                if (pageNum <= 0 || pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    disabled={isLoading}
                    className="h-8 w-8 p-0 text-xs font-bold"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {isLoading && !isInitialLoading && (
        <div className="flex justify-center py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
            <div className="h-2 w-2 rounded-full bg-primary" />
            Refreshing data...
          </div>
        </div>
      )}
    </div>
  );
};
