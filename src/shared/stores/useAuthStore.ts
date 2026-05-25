import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Company } from '../../modules/auth/domain/entities/User';

interface AuthState {
  user: User | null;
  company: Company | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (user: User, company: Company, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      company: null,
      token: null,
      refreshToken: null,
      setAuth: (user, company, token, refreshToken) => set({ user, company, token, refreshToken }),
      logout: () => set({ user: null, company: null, token: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage', // only user data and token in localStorage, though it's recommended to use httpOnly cookies
      // We persist in localStorage for now as a fallback since httpOnly is backend-dependent.
    }
  )
);
