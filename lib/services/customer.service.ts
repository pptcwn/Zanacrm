import { createBrowserClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { CreateCustomer, UpdateCustomer } from '@/lib/validations/customer.schema';

type CustomerRow = Database['public']['Tables']['customers']['Row'];

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) supabaseClient = createBrowserClient();
  return supabaseClient;
}

export const customerService = {
  async getAll(): Promise<CustomerRow[]> {
    const { data, error } = await getSupabaseClient()
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(customerData: CreateCustomer): Promise<CustomerRow> {
    const { data, error } = await getSupabaseClient()
      .from('customers')
      .insert(customerData as any)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, customerData: UpdateCustomer): Promise<CustomerRow> {
    const { data, error } = await getSupabaseClient()
      .from('customers')
      // @ts-ignore
      .update(customerData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
