"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSalaryStore } from "@/store/salaryStore";
import { useState, useEffect } from "react";
import { Search, RotateCcw, Filter } from "lucide-react";

export const FilterBar = () => {
  const { filters, setFilters, reset } = useSalaryStore();
  
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync local filters with store (e.g. if reset externally)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearch = () => {
    setFilters(localFilters);
    // fetchSalaries() is NOT needed here because the DashboardPage 
    // listens to changes in the fetchSalaries function reference 
    // (which depends on filters) via its useEffect.
  };

  const handleReset = () => {
    reset();
    setLocalFilters({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-6 bg-card rounded-3xl border shadow-xl space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Intelligence Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Organization</label>
            <Input
                placeholder="e.g. Google"
                name="company"
                value={localFilters.company || ""}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
            />
        </div>
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Job Role</label>
            <Input
                placeholder="e.g. Software Engineer"
                name="role"
                value={localFilters.role || ""}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
            />
        </div>
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Seniority Level</label>
            <Input
                placeholder="e.g. Senior"
                name="level"
                value={localFilters.level || ""}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
            />
        </div>
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Geography</label>
            <Input
                placeholder="e.g. Remote"
                name="location"
                value={localFilters.location || ""}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="rounded-xl border-muted bg-muted/30 focus:bg-background transition-all"
            />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button onClick={handleReset} variant="ghost" className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button onClick={handleSearch} className="rounded-xl px-8 font-bold gap-2 shadow-lg shadow-primary/20">
          <Search className="h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
};
