import { create } from 'zustand';
import { Database } from '@/types/database.types';
import { CreateFinanceEntry, UpdateFinanceEntry } from '@/lib/validations/finance.schema';
import { financeService, DashboardSummary } from '@/lib/services/finance.service';

type FinanceRow = Database['public']['Tables']['finance_entries']['Row'];

interface RevenueTrend {
  dailyRevenue: { date: string, revenue: number }[];
  channelDistribution: { channel: string, value: number }[];
}

interface FinanceState {
  entries: FinanceRow[];
  dashboardSummary: DashboardSummary | null;
  revenueTrend: RevenueTrend | null;
  isLoading: boolean;
  isSummaryLoading: boolean;
  error: string | null;

  fetchEntries: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchRevenueTrend: () => Promise<void>;
  addEntry: (data: CreateFinanceEntry) => Promise<void>;
  updateEntry: (id: string, data: UpdateFinanceEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  
  // Optimistic updates for real-time
  setEntries: (entries: FinanceRow[]) => void;
  updateEntryInState: (id: string, updated: Partial<FinanceRow>) => void;
  removeEntryFromState: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  entries: [],
  dashboardSummary: null,
  revenueTrend: null,
  isLoading: false,
  isSummaryLoading: false,
  error: null,

  fetchEntries: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await financeService.getAll();
      set({ entries: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchSummary: async () => {
    set({ isSummaryLoading: true, error: null });
    try {
      const summary = await financeService.getDashboardSummary();
      set({ dashboardSummary: summary, isSummaryLoading: false });
    } catch (error: any) {
      set({ error: error.message, isSummaryLoading: false });
    }
  },

  fetchRevenueTrend: async () => {
    try {
      const trend = await financeService.getRevenueTrend();
      set({ revenueTrend: trend });
    } catch (error: any) {
      console.error("Failed to fetch revenue trend", error);
    }
  },

  addEntry: async (data: CreateFinanceEntry) => {
    set({ isLoading: true, error: null });
    try {
      const newEntry = await financeService.create(data);
      set((state) => ({ 
        entries: [newEntry, ...state.entries],
        isLoading: false 
      }));
      get().fetchSummary(); // Refresh summary when finance changes
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateEntry: async (id: string, data: UpdateFinanceEntry) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await financeService.update(id, data);
      set((state) => ({
        entries: state.entries.map((entry) => (entry.id === id ? updated : entry)),
        isLoading: false
      }));
      get().fetchSummary();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteEntry: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await financeService.delete(id);
      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
        isLoading: false
      }));
      get().fetchSummary();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  setEntries: (entries) => set({ entries }),
  
  updateEntryInState: (id, updated) => set((state) => ({
    entries: state.entries.map(e => e.id === id ? { ...e, ...updated } : e)
  })),

  removeEntryFromState: (id) => set((state) => ({
    entries: state.entries.filter(e => e.id !== id)
  }))
}));
