import { create } from "zustand";

interface UIState {
  isSubmitModalOpen: boolean;
  selectedCompany: string | null;
  notifications: { id: string; message: string; type: "success" | "error" | "info" }[];
  
  setSubmitModalOpen: (open: boolean) => void;
  setSelectedCompany: (company: string | null) => void;
  addNotification: (message: string, type: UIState["notifications"][0]["type"]) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSubmitModalOpen: false,
  selectedCompany: null,
  notifications: [],
  
  setSubmitModalOpen: (open) => set({ isSubmitModalOpen: open }),
  setSelectedCompany: (company) => set({ selectedCompany: company }),
  addNotification: (message, type) => set((state) => ({
    notifications: [...state.notifications, { id: Math.random().toString(36).substr(2, 9), message, type }]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
}));
