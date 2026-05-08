"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCompanyStats } from "@/hooks/useCompanyStats";
import { CompanyStatsCard } from "@/components/CompanyStatsCard";
import { SalaryTable } from "@/components/SalaryTable";
import { Button } from "@/components/ui/button";
import { 
  MoveLeft, 
  LayoutDashboard, 
  Building2, 
  TrendingUp, 
  Target, 
  Users, 
  Award,
  AlertCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function CompanyAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const companyName = params.name as string;
  
  // Custom hook for data fetching
  const { stats, isLoading, error, fetchStats } = useCompanyStats(companyName);

  useEffect(() => {
    fetchStats(1);
  }, [fetchStats, companyName]);

  // Compute most common level
  const mostCommonLevel = useMemo(() => {
    if (!stats?.levels) return "N/A";
    const sortedLevels = Object.entries(stats.levels).sort((a, b) => b[1] - a[1]);
    return sortedLevels[0]?.[0] || "N/A";
  }, [stats]);

  // Loading State (Skeletons)
  if (isLoading && !stats) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-48" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <Skeleton className="h-[500px] w-full rounded-3xl" />
      </div>
    );
  }

  // Error State
  if (error || (!isLoading && !stats)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-card border rounded-3xl p-12 max-w-md w-full text-center shadow-2xl space-y-6">
            <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                <AlertCircle className="h-10 w-10" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black italic tracking-tight">Intelligence Not Found</h2>
                <p className="text-muted-foreground">We couldn't retrieve any compensation data for <span className="text-primary font-bold">{companyName}</span> at this time.</p>
            </div>
            <Button asChild className="w-full rounded-2xl h-14 font-bold text-lg shadow-xl shadow-primary/20">
                <Link href="/dashboard">
                    <MoveLeft className="h-5 w-5 mr-2" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      {/* A. Company Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-xl h-12 w-12 bg-card border border-white/5 hover:bg-muted shadow-sm transition-transform active:scale-95"
          >
            <MoveLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3 text-primary" />
                <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                    Corporate Analytics
                </h1>
            </div>
            <p className="text-4xl font-black tracking-tighter capitalize">{stats.company}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
            <Button asChild variant="outline" className="rounded-2xl h-12 px-6 font-bold gap-2 bg-card/50 border-white/5 backdrop-blur-sm shadow-sm hover:scale-[1.02] transition-transform">
                <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Feed
                </Link>
            </Button>
            <Button asChild className="rounded-2xl h-12 px-8 font-bold gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                <Link href="/submit">
                    <TrendingUp className="h-4 w-4" />
                    Contribute
                </Link>
            </Button>
        </div>
      </div>

      {/* B. Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
            title="Median Compensation" 
            value={`$${stats.median.toLocaleString()}`} 
            label="USD / Year"
            icon={<Target className="h-5 w-5" />}
            color="text-primary"
        />
        <MetricCard 
            title="Total Entries" 
            value={stats.meta.total.toString()} 
            label="Verified Records"
            icon={<Users className="h-5 w-5" />}
            color="text-blue-500"
        />
        <MetricCard 
            title="Most Common Level" 
            value={mostCommonLevel} 
            label="Seniority Distribution"
            icon={<Award className="h-5 w-5" />}
            color="text-purple-500"
        />
      </div>

      {/* C. Level Distribution Section */}
      <div className="animate-in zoom-in-95 duration-500 delay-150">
        <CompanyStatsCard 
            company={stats.company}
            median={stats.median}
            levels={stats.levels}
            total={stats.meta.total}
        />
      </div>

      {/* D. Salary Listings Table */}
      <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-primary rounded-full" />
                <h2 className="text-2xl font-black tracking-tight">Intelligence Stream</h2>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Showing Page</p>
                <p className="text-sm font-bold text-primary">{stats.meta.page} of {stats.meta.totalPages}</p>
            </div>
        </div>
        
        <div className="bg-card/40 backdrop-blur-sm rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
            <SalaryTable 
                customSalaries={stats.salaries}
                customLoading={isLoading}
                customTotalPages={stats.meta.totalPages}
                customCurrentPage={stats.meta.page}
                onPageChange={fetchStats}
                hidePagination={stats.meta.totalPages <= 1} // Rule 4D
            />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, label, icon, color }: { title: string, value: string, label: string, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-card border border-white/5 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className={cn("absolute -top-2 -right-2 h-16 w-16 opacity-5 group-hover:scale-150 transition-transform duration-500", color)}>
                {icon}
            </div>
            <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <span className={cn("p-2 rounded-lg bg-muted/50", color)}>{icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{title}</span>
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
                </div>
            </div>
        </div>
    )
}
