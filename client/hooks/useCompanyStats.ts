import { useState, useCallback } from "react";
import api from "@/lib/api";

interface CompanyStats {
  company: string;
  median: number;
  levels: Record<string, number>;
  salaries: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const useCompanyStats = (companyName: string) => {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (page = 1) => {
    if (!companyName) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/stats/${companyName}`, {
        params: { page, limit: 10 }
      });
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch company stats");
    } finally {
      setIsLoading(false);
    }
  }, [companyName]);

  return { stats, isLoading, error, fetchStats };
};
