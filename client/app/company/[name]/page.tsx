"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCompanyStats } from "@/hooks/useCompanyStats";
import { CompanyStatsCard } from "@/components/CompanyStatsCard";
import { SalaryTable } from "@/components/SalaryTable";
import { Button } from "@/components/ui/button";
import { MoveLeft, LayoutDashboard, Building2, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyPage() {
  const params = useParams();
  const router = useRouter();
  const companyName = params.name as string;
  const { stats, isLoading, fetchStats } = useCompanyStats(companyName);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading && !stats) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto">
        <div className="h-12 w-48 bg-muted animate-pulse rounded-xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!stats) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <Building2 className="h-16 w-16 text-muted mb-4" />
        <h2 className="text-2xl font-black italic">Data Redacted</h2>
        <p className="text-muted-foreground mt-2">No intelligence found for <span className="text-primary font-bold">{companyName}</span></p>
        <Button asChild className="mt-8 rounded-2xl h-12 px-8">
            <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-xl h-12 w-12 bg-card border hover:bg-muted shadow-sm"
          >
            <MoveLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                    Intelligence Profile
                </h1>
            </div>
            <p className="text-3xl font-black tracking-tight capitalize">{companyName}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
            <Button asChild variant="outline" className="rounded-2xl h-12 px-6 font-bold gap-2 bg-card/50 border-white/5 backdrop-blur-sm shadow-sm hover:scale-[1.02] transition-transform">
                <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Global Feed
                </Link>
            </Button>
            <Button asChild className="rounded-2xl h-12 px-8 font-bold gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                <Link href="/submit">
                    <TrendingUp className="h-4 w-4" />
                    Add Your Data
                </Link>
            </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="animate-in zoom-in-95 duration-500 delay-150">
        <CompanyStatsCard 
            company={stats.company}
            median={stats.median}
            levels={stats.levels}
            total={stats.meta.total}
        />
      </div>

      {/* Feed Section */}
      <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-primary rounded-full" />
                <h2 className="text-2xl font-black tracking-tight">Verified Submissions</h2>
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stats.meta.total} Records Found</p>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden">
            <SalaryTable 
                customSalaries={stats.salaries}
                customLoading={isLoading}
                customTotalPages={stats.meta.totalPages}
                customCurrentPage={stats.meta.page}
                onPageChange={fetchStats}
            />
        </div>
      </div>
    </div>
  );
}
