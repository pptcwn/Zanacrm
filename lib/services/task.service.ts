import { createBrowserClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import { CreateTask, UpdateTask } from '@/lib/validations/task.schema';

type TaskRow = Database['public']['Tables']['tasks']['Row'];

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;
function getSupabaseClient() {
  if (!supabaseClient) supabaseClient = createBrowserClient();
  return supabaseClient;
}

export const taskService = {
  async getAll(): Promise<TaskRow[]> {
    const { data, error } = await getSupabaseClient()
      .from('tasks')
      .select('*')
      .order('position', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(taskData: CreateTask): Promise<TaskRow> {
    const { data, error } = await getSupabaseClient()
      .from('tasks')
      .insert(taskData as any)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, taskData: UpdateTask): Promise<TaskRow> {
    const { data, error } = await getSupabaseClient()
      .from('tasks')
      // @ts-ignore
      .update(taskData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};
