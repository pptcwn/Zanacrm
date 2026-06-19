import { createBrowserClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { CreateProduct, AdjustStock, UpdateProduct } from '@/lib/validations/product.schema';

type ProductRow = Database['public']['Tables']['products']['Row'];

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) supabaseClient = createBrowserClient();
  return supabaseClient;
}

export const productService = {
  async getAll(): Promise<ProductRow[]> {
    const { data, error } = await getSupabaseClient()
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(productData: CreateProduct): Promise<ProductRow> {
    const { data, error } = await getSupabaseClient()
      .from('products')
      .insert(productData as any)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, productData: UpdateProduct): Promise<ProductRow> {
    const { data, error } = await getSupabaseClient()
      .from('products')
      // @ts-ignore
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async adjustStock(stockData: AdjustStock): Promise<void> {
    const client = getSupabaseClient();
    const { data: product, error: fetchError } = await client
      .from('products')
      .select('stock_quantity')
      .eq('id', stockData.product_id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // @ts-ignore
    const newStock = product.stock_quantity + stockData.adjustment;
    
    const { error: updateError } = await client
      .from('products')
      // @ts-ignore
      .update({ stock_quantity: newStock })
      .eq('id', stockData.product_id);
      
    if (updateError) throw updateError;
  }
};
