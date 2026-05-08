"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCompanyStats } from "@/hooks/useCompanyStats";
import { CompanyStatsCard } from "@/components/CompanyStatsCard";
import { SalaryTable } from "@/components/SalaryTable";
import { useSalaryStore } from "@/store/salaryStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const CompanyStatsSkeleton = () => (
  <Card className="w-full border-none shadow-xl bg-card overflow-hidden">
    <div className="p-8 space-y-12">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-64 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-16 w-64 rounded-2xl" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-4 w-32 rounded" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

export default function CompanyPage() {
  const params = useParams();
  const companyName = params.name as string;
  const { stats, isLoading, error, fetchStats } = useCompanyStats(companyName);
  const { setSalaries, setPagination, setInitialLoading } = useSalaryStore();

  useEffect(() => {
    setInitialLoading(true);
    fetchStats();
  }, [fetchStats, setInitialLoading]);

  useEffect(() => {
    if (stats) {
      setSalaries(stats.salaries);
      setPagination(stats.meta);
      setInitialLoading(false);
    }
  }, [stats, setSalaries, setPagination, setInitialLoading]);

  if (isLoading && !stats) {
    return (
      <div className="space-y-12 max-w-7xl mx-auto px-4">
        <div className="h-10 w-24 bg-muted rounded-full animate-pulse mt-12" />
        <CompanyStatsSkeleton />
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || (!stats && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <ChevronLeft className="h-10 w-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">
            Intelligence Not Found
          </h2>
          <p className="text-muted-foreground max-w-md">
            {error || `We don't have enough data for "${companyName}" yet.`}
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-full px-8">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Global Feed
      </Link>

      <CompanyStatsCard
        company={stats!.company}
        median={stats!.median}
        levels={stats!.levels}
        total={stats!.meta.total}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight">
            Verified Records
          </h2>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {stats!.meta.total} Entries Found
          </span>
        </div>
        <SalaryTable />
      </div>
    </div>
  );
}
