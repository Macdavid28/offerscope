"use client";

import { useEffect } from "react";
import { useSalaryStore } from "@/store/salaryStore";
import { useCompare } from "@/hooks/useCompare";
import { ComparePanel } from "@/components/ComparePanel";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const { selectedForComparison, clearComparison } = useSalaryStore();
  const { result, isLoading, error, compare } = useCompare();

  useEffect(() => {
    if (selectedForComparison.length === 2) {
      compare(selectedForComparison[0], selectedForComparison[1]);
    }
  }, [selectedForComparison, compare]);

  if (selectedForComparison.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-3xl">⚖️</div>
        <h2 className="text-2xl font-bold">Select Items to Compare</h2>
        <p className="text-muted-foreground max-w-md">
          Go to the dashboard and select two salary records to see a side-by-side comparison of their compensation packages.
        </p>
        <Link 
          href="/dashboard" 
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Salary Comparison</h1>
          <p className="text-muted-foreground">Analyzing the delta between two compensation packages.</p>
        </div>
        <Button variant="outline" onClick={clearComparison}>Clear Selection</Button>
      </div>

      {error ? (
        <div className="p-10 text-center text-destructive bg-destructive/10 rounded-lg">
          {error}
        </div>
      ) : result && (
        <ComparePanel 
          salary1={result.salary1} 
          salary2={result.salary2} 
          difference={result.difference} 
        />
      )}
    </div>
  );
}
