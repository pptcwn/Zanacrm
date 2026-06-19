import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database.types'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/lib/supabase/env'

let browserClient: ReturnType<typeof createSupabaseBrowserClient<Database>> | null = null;

export function createBrowserClient() {
  if (browserClient) return browserClient;
  
  browserClient = createSupabaseBrowserClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey()
  );
  
  return browserClient;
}

