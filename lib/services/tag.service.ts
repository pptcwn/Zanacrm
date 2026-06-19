import { createBrowserClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient<Database> | null = null;
function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) supabaseClient = createBrowserClient() as unknown as SupabaseClient<Database>;
  return supabaseClient;
}

export const tagService = {
  async getTags() {
    const { data, error } = await getSupabaseClient()
      .from('tags')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getCustomerTags(customerId: string) {
    const { data, error } = await getSupabaseClient()
      .from('customer_tags')
      .select('tag_id, tags(*)')
      .eq('customer_id', customerId);
    if (error) throw error;
    return (data || []).map((item: any) => item.tags);
  },

  async addCustomerTag(customerId: string, tagId: string) {
    const { data, error } = await getSupabaseClient()
      .from('customer_tags')
      // @ts-ignore
      .insert({ customer_id: customerId, tag_id: tagId })
      .select();
    if (error) throw error;
    return data;
  },

  async removeCustomerTag(customerId: string, tagId: string) {
    const { error } = await getSupabaseClient()
      .from('customer_tags')
      .delete()
      .eq('customer_id', customerId)
      .eq('tag_id', tagId);
    if (error) throw error;
  }
};