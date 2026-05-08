"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSalaryStore } from "@/store/salaryStore";
import { useSalaries } from "@/hooks/useSalaries";
import { useState } from "react";

export const FilterBar = () => {
  const { filters, setFilters } = useSalaryStore();
  const { fetchSalaries } = useSalaries();
  
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearch = () => {
    setFilters(localFilters);
    fetchSalaries();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({
      ...localFilters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border shadow-sm">
      <Input
        placeholder="Company"
        name="company"
        value={localFilters.company || ""}
        onChange={handleChange}
        className="max-w-[200px]"
      />
      <Input
        placeholder="Role"
        name="role"
        value={localFilters.role || ""}
        onChange={handleChange}
        className="max-w-[200px]"
      />
      <Input
        placeholder="Level"
        name="level"
        value={localFilters.level || ""}
        onChange={handleChange}
        className="max-w-[200px]"
      />
      <Input
        placeholder="Location"
        name="location"
        value={localFilters.location || ""}
        onChange={handleChange}
        className="max-w-[200px]"
      />
      <Button onClick={handleSearch} variant="default">
        Filter
      </Button>
    </div>
  );
};
