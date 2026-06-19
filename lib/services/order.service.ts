import { createBrowserClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { CreateOrder, UpdateOrderStatus } from '@/lib/validations/order.schema';

type OrderRow = Database['public']['Tables']['orders']['Row'];

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) supabaseClient = createBrowserClient();
  return supabaseClient;
}

export const orderService = {
  async getAll(): Promise<OrderRow[]> {
    console.log('[orderService.getAll] executing query...');
    const { data, error } = await getSupabaseClient()
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    console.log('[orderService.getAll] query complete. error?', error);
    if (error) throw error;
    return data || [];
  },

  async create(orderData: CreateOrder): Promise<OrderRow> {
    const { data, error } = await getSupabaseClient()
      .from('orders')
      .insert(orderData as any)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, statusData: UpdateOrderStatus): Promise<OrderRow> {
    const { data, error } = await getSupabaseClient()
      .from('orders')
      // @ts-ignore
      .update(statusData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
