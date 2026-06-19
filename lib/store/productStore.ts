import { create } from 'zustand';
import { Database } from '@/types/database.types';
import { productService } from '@/lib/services/product.service';
import { createBrowserClient } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type ProductRow = Database['public']['Tables']['products']['Row'];

interface ProductState {
  products: ProductRow[];
  isLoading: boolean;
  error: string | null;
  subscription: RealtimeChannel | null;
  setProducts: (products: ProductRow[]) => void;
  addProduct: (product: ProductRow) => void;
  updateProduct: (id: string, data: Partial<ProductRow>) => void;
  removeProduct: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProducts: () => Promise<void>;
  subscribeToProducts: () => void;
  unsubscribeFromProducts: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  subscription: null,
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
  updateProduct: (id, data) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p))
  })),
  removeProduct: (id) => set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await productService.getAll();
      set({ products, isLoading: false });
    } catch (error: any) {
      console.error("Error fetching products:", error);
      set({ error: error.message, isLoading: false });
    }
  },
  
  subscribeToProducts: () => {
    const state = get();
    if (state.subscription) return;
    
    const supabase = createBrowserClient();
    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'products' },
        (payload) => get().addProduct(payload.new as ProductRow)
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => get().updateProduct(payload.new.id, payload.new as Partial<ProductRow>)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'products' },
        (payload) => get().removeProduct(payload.old.id as string)
      )
      .subscribe();
      
    set({ subscription: channel });
  },
  
  unsubscribeFromProducts: () => {
    const { subscription } = get();
    if (subscription) {
      subscription.unsubscribe();
      set({ subscription: null });
    }
  }
}));
