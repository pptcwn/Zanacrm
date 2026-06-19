import { create } from 'zustand';
import { Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: { id: string; email: string } | null;
  profile: ProfileRow | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: { id: string; email: string } | null) => void;
  setProfile: (profile: ProfileRow | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  logout: () => set({ user: null, profile: null, isLoading: false }),
}));
