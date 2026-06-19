import { create } from 'zustand'

interface AuthState {
  user: { id: string; email: string; role: string } | null
  setUser: (user: { id: string; email: string; role: string } | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
