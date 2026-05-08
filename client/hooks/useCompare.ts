import { useState, useCallback } from "react";
import api from "@/lib/api";

interface ComparisonResult {
  salary1: any;
  salary2: any;
  difference: {
    totalCompensation: number;
    level1: { raw: string; standardized: string };
    level2: { raw: string; standardized: string };
  };
}

export const useCompare = () => {
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = useCallback(async (id1: string, id2: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/compare", {
        params: { id1, id2 }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to compare salaries");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, compare };
};
