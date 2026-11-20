import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { apiGet, apiPost, bindApiAuth } from '../lib/api'
import type { LoginCredentials, LoginResponse, Portal, User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  portal: Portal
  isLoggingIn: boolean

  login: (login: string, password: string, portal: Portal) => Promise<void>
  logout: () => void
  hydrate: () => Promise<void>
  updateTokens: (tokens: { token: string; refreshToken: string }) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      portal: 'admin_portal',
      isLoggingIn: false,

      login: async (loginValue, password, portal) => {
        set({ isLoggingIn: true })
        try {
          const credentials: LoginCredentials = {
            login: loginValue,
            password,
            portal,
          }
          const data = await apiPost<LoginResponse, LoginCredentials>(
            '/auth/login',
            credentials,
          )
          const token = data.accessToken ?? data.token

          set({
            user: data.user,
            token,
            refreshToken: data.refreshToken,
            portal: data.user.portal,
            isLoggingIn: false,
          })
        } catch (error) {
          set({ isLoggingIn: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isLoggingIn: false,
        })
      },

      hydrate: async () => {
        if (!get().token) {
          return
        }

        try {
          const { user } = await apiGet<{ user: User }>('/auth/me')
          set({ user, portal: user.portal })
        } catch {
          // A 401 is handled by the API interceptor (refresh, then logout).
          // Network errors keep the cached session available for offline use.
        }
      },

      updateTokens: ({ token, refreshToken }) => {
        set({ token, refreshToken })
      },
    }),
    {
      name: 'ryad-auth',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        portal: state.portal,
      }),
    },
  ),
)

// Give the axios interceptors access to the live session without a circular import.
bindApiAuth({
  getToken: () => useAuthStore.getState().token,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  updateTokens: ({ token, refreshToken }) => {
    useAuthStore.getState().updateTokens({ token, refreshToken })
  },
  logout: () => {
    useAuthStore.getState().logout()
  },
})
