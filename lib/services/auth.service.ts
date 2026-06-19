import { createBrowserClient } from '@/lib/supabase/client'
import { LoginCredentials } from '@/lib/validations/auth.schema'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient()
  }
  return supabaseClient
}

export function resetAuthServiceClientForTests() {
  supabaseClient = null
}

export const authService = {
  async getSession() {
    const { data, error } = await getSupabaseClient().auth.getSession()
    if (error) throw error
    return data.session
  },

  async getUserProfile(userId: string) {
    const { data, error } = await getSupabaseClient()
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) return null
    return data
  },

  async signIn(credentials: LoginCredentials) {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await getSupabaseClient().auth.signOut()
    if (error) throw error
  },
  
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return getSupabaseClient().auth.onAuthStateChange(callback)
  }
}
