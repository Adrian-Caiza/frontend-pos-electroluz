import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthToken } from '../../modules/auth/domain/entities/User';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (user: User, tokens: AuthToken) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      setAuth: (user, tokens) => set({ user, token: tokens.token, refreshToken: tokens.refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage', // only user data and token in localStorage, though it's recommended to use httpOnly cookies
      // We persist in localStorage for now as a fallback since httpOnly is backend-dependent.
    }
  )
);
