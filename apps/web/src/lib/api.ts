import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { ApiError, RefreshResponse } from '../types'
import { STATIC_DEMO, staticDemoAdapter } from './staticDemo'

const rawApiUrl = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:3001'
const apiOrigin = rawApiUrl.replace(/\/+$/, '')

/** Full API origin + prefix, e.g. http://localhost:3001/api. */
export const API_BASE_URL = STATIC_DEMO ? '/api' : `${apiOrigin}/api`

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Static hosting has no API server; answer demo requests locally instead.
  adapter: STATIC_DEMO ? staticDemoAdapter : undefined,
})

interface AuthBridge {
  getToken: () => string | null
  getRefreshToken: () => string | null
  updateTokens: (tokens: { token: string; refreshToken: string }) => void
  logout: () => void
}

let authBridge: AuthBridge | null = null

/**
 * Keeps the axios layer independent from the zustand store while still giving
 * interceptors access to the live session. Called once by `store/auth.ts`.
 */
export function bindApiAuth(bridge: AuthBridge): void {
  authBridge = bridge
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

api.interceptors.request.use((config) => {
  const token = authBridge?.getToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

let refreshInFlight: Promise<string> | null = null

async function requestNewAccessToken(): Promise<string> {
  const refreshToken = authBridge?.getRefreshToken()
  if (!refreshToken) {
    throw new Error('missing_refresh_token')
  }

  // Use bare axios here: the refresh call must never re-enter our interceptors.
  const { data } = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      timeout: 15_000,
      headers: { 'Content-Type': 'application/json' },
      ...(STATIC_DEMO ? { adapter: staticDemoAdapter } : {}),
    },
  )

  const token = data.accessToken ?? data.token
  if (!token) {
    throw new Error('invalid_refresh_response')
  }

  authBridge?.updateTokens({ token, refreshToken: data.refreshToken })
  return token
}

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }

    const original = error.config as RetriableRequestConfig | undefined
    const status = error.response?.status
    const url = original?.url ?? ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh')

    if (status !== 401 || !original || original._retry || isAuthEndpoint) {
      return Promise.reject(error)
    }

    if (!authBridge?.getRefreshToken()) {
      authBridge?.logout()
      return Promise.reject(error)
    }

    original._retry = true

    try {
      if (!refreshInFlight) {
        refreshInFlight = requestNewAccessToken().finally(() => {
          refreshInFlight = null
        })
      }

      const token = await refreshInFlight
      original.headers = AxiosHeaders.from(original.headers)
      original.headers.set('Authorization', `Bearer ${token}`)
      return await api(original)
    } catch (refreshError) {
      authBridge?.logout()
      return Promise.reject(refreshError)
    }
  },
)

function isApiErrorPayload(value: unknown): value is Omit<ApiError, 'status'> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as { error: unknown }).error === 'string'
  )
}

/** Normalizes any axios failure into the flat error shape the UI understands. */
export function extractApiError(error: unknown): ApiError | null {
  if (!axios.isAxiosError(error)) {
    return null
  }

  const status = error.response?.status
  const payload = error.response?.data

  if (isApiErrorPayload(payload)) {
    return { ...payload, status }
  }

  return {
    error: status ? 'request_failed' : 'network_error',
    status,
  }
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await api.get<T>(url, config)
  return response.data
}

export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await api.post<TResponse>(url, body, config)
  return response.data
}
