import { createBrowserClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { SendMessage } from '@/lib/validations/message.schema';

type ConversationRow = Database['public']['Tables']['conversations']['Row'];
type MessageRow = Database['public']['Tables']['messages']['Row'];

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) supabaseClient = createBrowserClient();
  return supabaseClient;
}

export const chatService = {
  async getConversations(): Promise<ConversationRow[]> {
    const { data, error } = await getSupabaseClient()
      .from('conversations')
      .select('*, customers(*)')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getMessages(conversationId: string): Promise<MessageRow[]> {
    const { data, error } = await getSupabaseClient()
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async sendMessage(messageData: SendMessage): Promise<MessageRow> {
    const { data, error } = await getSupabaseClient()
      .from('messages')
      .insert(messageData as any)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
