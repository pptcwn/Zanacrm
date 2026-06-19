import { createBrowserClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';

type TemplateRow = Database['public']['Tables']['quick_reply_templates']['Row'];

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) supabaseClient = createBrowserClient();
  return supabaseClient;
}

export const quickReplyService = {
  async getAll(): Promise<TemplateRow[]> {
    const { data, error } = await getSupabaseClient()
      .from('quick_reply_templates')
      .select('*')
      .order('shortcut', { ascending: true });
    if (error) throw error;
    return data || [];
  }
};
