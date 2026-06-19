import { create } from 'zustand';
import { Database } from '@/types/database.types';
import { customerService } from '@/lib/services/customer.service';
import { createBrowserClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type CustomerRow = Database['public']['Tables']['customers']['Row'];

interface CustomerState {
  customers: CustomerRow[];
  isLoading: boolean;
  error: string | null;
  subscription: RealtimeChannel | null;
  setCustomers: (customers: CustomerRow[]) => void;
  addCustomer: (customer: CustomerRow) => void;
  updateCustomer: (id: string, data: Partial<CustomerRow>) => void;
  removeCustomer: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchCustomers: () => Promise<void>;
  subscribeToCustomers: () => void;
  unsubscribeFromCustomers: () => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  isLoading: false,
  error: null,
  subscription: null,
  setCustomers: (customers) => set({ customers }),
  addCustomer: (customer) => set((state) => ({ customers: [customer, ...state.customers] })),
  updateCustomer: (id, data) => set((state) => ({
    customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c))
  })),
  removeCustomer: (id) => set((state) => ({
    customers: state.customers.filter((c) => c.id !== id),
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  fetchCustomers: async () => {
    set({ isLoading: true, error: null });
    try {
      const customers = await customerService.getAll();
      set({ customers, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching customers:", error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  subscribeToCustomers: () => {
    const state = get();
    if (state.subscription) return;
    
    const supabase = createBrowserClient();
    const channel = supabase
      .channel('public:customers')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'customers' },
        (payload) => get().addCustomer(payload.new as CustomerRow)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'customers' },
        (payload) => get().updateCustomer(payload.new.id, payload.new as Partial<CustomerRow>)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'customers' },
        (payload) => get().removeCustomer(payload.old.id as string)
      )
      .subscribe();
      
    set({ subscription: channel });
  },
  
  unsubscribeFromCustomers: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
      set({ subscription: null });
    }
  }
}));
