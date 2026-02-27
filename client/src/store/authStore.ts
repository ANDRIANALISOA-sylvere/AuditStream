import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logout as apiLogout } from '../api/auth';
import { Role, type AuthStore, type User } from '@/types/auth.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user: User | null) => 
        set({ 
          user, 
          isAuthenticated: !!user 
        }),

      setToken: (token: string | null) => 
        set({ token }),

      setLoading: (isLoading: boolean) => 
        set({ isLoading }),

      setError: (error: string | null) => 
        set({ error }),

      login: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: async () => {
        try {
          await apiLogout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

export const useUserRole = () => useAuthStore((state) => state.user?.role);
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === Role.ADMIN);
export const useUsername = () => useAuthStore((state) => state.user?.username);