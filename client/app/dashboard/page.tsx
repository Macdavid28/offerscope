"use client";

import { useEffect } from "react";
import { FilterBar } from "@/components/FilterBar";
import { SalaryTable } from "@/components/SalaryTable";
import { useSalaries } from "@/hooks/useSalaries";

export default function DashboardPage() {
  const { fetchSalaries } = useSalaries();

  useEffect(() => {
    fetchSalaries();
  }, [fetchSalaries]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Compensation Dashboard</h1>
        <p className="text-muted-foreground">
          Explore and filter real-time compensation data across various companies and roles.
        </p>
      </div>
      
      <FilterBar />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Salary Listings</h2>
        <SalaryTable />
      </div>
    </div>
  );
}
