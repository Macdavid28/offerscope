import { create } from "zustand";

interface Salary {
  id: string;
  company: string;
  role: string;
  level: string;
  levelStandardized: string;
  location: string;
  experienceYears: number;
  baseSalary: number;
  bonus: number;
  stock: number;
  totalCompensation: number;
  confidenceScore: number;
  currency: string;
  compensationPeriod: string;
  createdAt: string;
}

interface SalaryState {
  salaries: Salary[];
  isLoading: boolean;
  isInitialLoading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
  
  // Filters
  filters: {
    company?: string;
    role?: string;
    level?: string;
    location?: string;
  };
  
  // Comparison
  selectedForComparison: string[];
  
  // Actions
  setSalaries: (salaries: Salary[], append?: boolean) => void;
  setLoading: (loading: boolean) => void;
  setInitialLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SalaryState["filters"]>) => void;
  setPagination: (meta: { total: number; page: number; limit: number; totalPages: number }) => void;
  setCurrentPage: (page: number) => void;
  toggleComparison: (id: string) => void;
  clearComparison: () => void;
  reset: () => void;
  resetLoading: () => void;
}

export const useSalaryStore = create<SalaryState>((set) => ({
  salaries: [],
  isLoading: false,
  isInitialLoading: false,
  error: null,
  
  currentPage: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  hasMore: false,
  
  filters: {},
  
  selectedForComparison: [],
  
  setSalaries: (salaries, append = false) => set((state) => ({
    salaries: append ? [...state.salaries, ...salaries] : salaries,
    hasMore: state.currentPage < state.totalPages
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setInitialLoading: (loading) => set({ isInitialLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    currentPage: 1 // Reset pagination when filters change
  })),
  
  setPagination: (meta) => set((state) => ({
    total: meta.total,
    currentPage: meta.page,
    limit: meta.limit,
    totalPages: meta.totalPages,
    hasMore: meta.page < meta.totalPages
  })),

  setCurrentPage: (page) => set({ currentPage: page }),
  
  toggleComparison: (id) => set((state) => {
    const isSelected = state.selectedForComparison.includes(id);
    if (isSelected) {
      return { selectedForComparison: state.selectedForComparison.filter((i) => i !== id) };
    }
    if (state.selectedForComparison.length >= 2) {
      return { selectedForComparison: [state.selectedForComparison[1], id] };
    }
    return { selectedForComparison: [...state.selectedForComparison, id] };
  }),
  
  clearComparison: () => set({ selectedForComparison: [] }),
  
  reset: () => set({
    salaries: [],
    currentPage: 1,
    filters: {},
    selectedForComparison: [],
    error: null,
    isLoading: false,
    isInitialLoading: false
  }),

  resetLoading: () => set({ isLoading: false, isInitialLoading: false }),
}));
