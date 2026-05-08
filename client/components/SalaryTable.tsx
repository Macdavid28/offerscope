import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSalaryStore } from "@/store/salaryStore";
import { useSalaries } from "@/hooks/useSalaries";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, Briefcase, MapPin, DollarSign, Info } from "lucide-react";

interface Salary {
  id: string;
  company: string;
  role: string;
  level: string;
  levelStandardized: string;
  location: string;
  experienceYears: number;
  baseSalary: number;
  bonus: number;
  stock: number;
  totalCompensation: number;
  confidenceScore: number;
  currency: string;
  compensationPeriod: string;
  createdAt: string;
}

const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
      className,
    )}
  >
    {children}
  </span>
);

interface SalaryTableProps {
  customSalaries?: Salary[];
  customLoading?: boolean;
  customTotalPages?: number;
  customCurrentPage?: number;
  onPageChange?: (page: number) => void;
  hidePagination?: boolean;
}

export const SalaryTable = ({
  customSalaries,
  customLoading,
  customTotalPages,
  customCurrentPage,
  onPageChange,
  hidePagination = false,
}: SalaryTableProps = {}) => {
  const router = useRouter();
  const {
    salaries: storeSalaries,
    isLoading: storeLoading,
    isInitialLoading,
    totalPages: storeTotalPages,
    currentPage: storeCurrentPage,
    toggleComparison,
    selectedForComparison,
    clearComparison,
  } = useSalaryStore();

  const { goToPage: storeGoToPage } = useSalaries();
  
  const salaries = customSalaries ?? storeSalaries;
  const isLoading = customLoading ?? storeLoading;
  const totalPages = customTotalPages ?? storeTotalPages;
  const currentPage = customCurrentPage ?? storeCurrentPage;
  const goToPage = onPageChange ?? storeGoToPage;

  const [viewingSalary, setViewingSalary] = useState<Salary | null>(null);

  // Auto-redirect removed per user request
  // useEffect(() => {
  //   if (selectedForComparison.length === 2) {
  //     router.push("/compare");
  //   }
  // }, [selectedForComparison, router]);

  const maxTC =
    salaries.length > 0
      ? Math.max(...salaries.map((s) => s.totalCompensation))
      : 0;

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
                <th className="px-4 py-3 text-right font-bold">
                  Total Compensation
                </th>
                <th className="px-4 py-3 text-center font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {salaries.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No compensation data found.
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => {
                  const isHighest =
                    salary.totalCompensation === maxTC && maxTC > 0;
                  return (
                    <tr
                      key={salary.id}
                      className={cn(
                        "group transition-colors hover:bg-muted/30",
                        isHighest &&
                          "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary",
                      )}
                    >
                      <td className="px-4 py-4">
                        <Link 
                          href={`/company/${salary.company.toLowerCase()}`}
                          className="font-bold text-foreground capitalize hover:text-primary hover:underline transition-colors block"
                        >
                          {salary.company}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {new Date(salary.createdAt).toLocaleDateString()}
                        </div>
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
                      <td className="px-4 py-4 text-muted-foreground">
                        {salary.location}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full transition-all",
                                salary.confidenceScore > 0.7
                                  ? "bg-green-500"
                                  : salary.confidenceScore > 0.4
                                    ? "bg-yellow-500"
                                    : "bg-red-500",
                              )}
                              style={{
                                width: `${salary.confidenceScore * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {Math.round(salary.confidenceScore * 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              "text-lg font-black tracking-tight",
                              isHighest ? "text-primary" : "text-foreground",
                            )}
                          >
                            {salary.currency === "INR"
                              ? "₹"
                              : salary.currency === "EUR"
                                ? "€"
                                : salary.currency === "GBP"
                                  ? "£"
                                  : "$"}
                            {salary.totalCompensation.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">
                            Per{" "}
                            {salary.compensationPeriod
                              .toLowerCase()
                              .replace("ly", "")}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingSalary(salary)}
                            className="h-8 text-xs font-bold rounded-full hover:bg-primary/10 hover:text-primary"
                          >
                            Details
                          </Button>
                          <Button
                            variant={
                              selectedForComparison.includes(salary.id)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="rounded-full font-bold h-8"
                            onClick={() => toggleComparison(salary.id)}
                          >
                            {selectedForComparison.includes(salary.id)
                              ? "Selected"
                              : "Compare"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && !hidePagination && (
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
                else if (currentPage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
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

      {/* Details Modal */}
      {viewingSalary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card rounded-3xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="p-6 border-b bg-muted/30 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight capitalize">{viewingSalary.company}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Compensation Breakdown</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setViewingSalary(null)} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Role & Level</span>
                  </div>
                  <p className="font-bold">{viewingSalary.role}</p>
                  <Badge className="bg-secondary/50 border-none">{viewingSalary.level} ({viewingSalary.levelStandardized})</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Location</span>
                  </div>
                  <p className="font-bold">{viewingSalary.location}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-dashed">
                <div className="flex justify-between items-center p-3 rounded-xl bg-muted/20">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Base Salary</span>
                  <span className="font-mono font-bold">{viewingSalary.currency} {viewingSalary.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-muted/20">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Annual Bonus</span>
                  <span className="font-mono font-bold">{viewingSalary.currency} {viewingSalary.bonus.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-muted/20">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Annual Stock (RSUs)</span>
                  <span className="font-mono font-bold">{viewingSalary.currency} {viewingSalary.stock.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-xl bg-primary/5 border border-primary/10 mt-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span className="text-sm font-black uppercase tracking-widest text-primary">Total Comp</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black tracking-tighter text-primary">
                      {viewingSalary.currency} {viewingSalary.totalCompensation.toLocaleString()}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Per {viewingSalary.compensationPeriod.toLowerCase().replace('ly', '')}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1 rounded-2xl h-12 font-bold" 
                  onClick={() => {
                    toggleComparison(viewingSalary.id);
                    setViewingSalary(null);
                  }}
                  variant={selectedForComparison.includes(viewingSalary.id) ? "secondary" : "default"}
                >
                  {selectedForComparison.includes(viewingSalary.id) ? "Remove from Compare" : "Add to Comparison"}
                </Button>
                <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold" onClick={() => setViewingSalary(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Floating Compare Bar */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-zinc-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-xl bg-opacity-95">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Intelligence Pool</span>
              <span className="text-sm font-black italic">{selectedForComparison.length}/2 Records Selected</span>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearComparison}
                className="text-xs font-bold hover:bg-white/5 h-10 rounded-xl px-4"
              >
                Reset
              </Button>
              <Button 
                disabled={selectedForComparison.length < 2}
                onClick={() => router.push("/compare")}
                className={cn(
                  "font-black rounded-xl h-12 px-8 transition-all duration-300 shadow-xl",
                  selectedForComparison.length < 2 
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                    : "bg-primary text-primary-foreground hover:scale-[1.05] active:scale-[0.95] shadow-primary/20"
                )}
              >
                {selectedForComparison.length < 2 ? "Select 1 More" : "Compare Selected"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
