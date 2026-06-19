import { create } from 'zustand';
import { Database } from '@/types/database.types';
import { orderService } from '@/lib/services/order.service';
import { createBrowserClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type OrderRow = Database['public']['Tables']['orders']['Row'];

interface OrderState {
  orders: OrderRow[];
  isLoading: boolean;
  error: string | null;
  subscription: RealtimeChannel | null;
  setOrders: (orders: OrderRow[]) => void;
  addOrder: (order: OrderRow) => void;
  updateOrder: (id: string, data: Partial<OrderRow>) => void;
  removeOrder: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchOrders: () => Promise<void>;
  subscribeToOrders: () => void;
  unsubscribeFromOrders: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  subscription: null,
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrder: (id, data) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, ...data } : o))
  })),
  removeOrder: (id) => set((state) => ({
    orders: state.orders.filter((o) => o.id !== id),
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  fetchOrders: async () => {
    console.log('[fetchOrders] STARTING...');
    set({ isLoading: true, error: null });
    try {
      console.log('[fetchOrders] Calling orderService.getAll()...');
      const orders = await orderService.getAll();
      console.log('[fetchOrders] SUCCESS:', orders.length, 'orders fetched');
      set({ orders, isLoading: false });
    } catch (error: any) {
      console.error("[fetchOrders] Error fetching orders:", error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  subscribeToOrders: () => {
    const state = get();
    if (state.subscription) return;
    
    const supabase = createBrowserClient();
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => get().addOrder(payload.new as OrderRow)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => get().updateOrder(payload.new.id, payload.new as Partial<OrderRow>)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'orders' },
        (payload) => get().removeOrder(payload.old.id as string)
      )
      .subscribe();
      
    set({ subscription: channel });
  },
  
  unsubscribeFromOrders: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
      set({ subscription: null });
    }
  }
}));
