import { useCallback } from "react";
import api from "@/lib/api";
import { useSalaryStore } from "@/store/salaryStore";

export const useSalaries = () => {
  const { 
    setSalaries, 
    setLoading, 
    setInitialLoading,
    setError, 
    setPagination, 
    filters, 
    currentPage, 
    limit 
  } = useSalaryStore();

  const fetchSalaries = useCallback(async (pageToFetch?: number, append = false) => {
    const isInitial = !append && (!pageToFetch || pageToFetch === 1);
    
    if (isInitial) setInitialLoading(true);
    setLoading(true);
    setError(null);
    
    try {
      const targetPage = pageToFetch || (append ? currentPage + 1 : 1);
      const params = {
        ...filters,
        page: targetPage,
        limit,
      };

      const response = await api.get("/salaries", { params });
      const { data, meta } = response.data;

      setSalaries(data, append);
      setPagination(meta);
    } catch (err: any) {
      setError(err.normalizedMessage || "Failed to fetch salaries");
    } finally {
      setLoading(false);
      if (isInitial) setInitialLoading(false);
    }
  }, [filters, currentPage, limit, setSalaries, setLoading, setInitialLoading, setError, setPagination]);

  const loadMore = () => {
    fetchSalaries(currentPage + 1, true);
  };

  const goToPage = (page: number) => {
    fetchSalaries(page, false);
  };

  return { fetchSalaries, loadMore, goToPage };
};
