export type Role =
  | 'director'
  | 'deputy'
  | 'supervisor'
  | 'clerk'
  | 'admin'
  | 'teacher'
  | 'parent'
  | 'student'

/** The prototype backend uses these two portal identifiers. */
export type Portal = 'admin_portal' | 'private'

export interface UserScope {
  type?: string
  [key: string]: unknown
}

export interface User {
  id: string
  name: string
  role: Role
  portal: Portal
  scope?: UserScope
  email?: string
  phone?: string
}

export interface Student {
  id: string
  name: string
  levelId: string
  classId: string
  guardianId?: string | null
  profile?: Record<string, unknown>
}

export interface LoginCredentials {
  login: string
  password: string
  portal: Portal
}

export interface LoginResponse {
  /** Prototype API returns both `token` and `accessToken`. */
  token: string
  accessToken?: string
  refreshToken: string
  expiresIn?: number
  user: User
  security?: {
    httpsRecommended?: boolean
  }
}

export interface RefreshResponse {
  token?: string
  accessToken?: string
  refreshToken: string
  expiresIn?: number
}

export interface ApiError {
  error: string
  message?: string
  status?: number
  retryAfter?: number
}

export interface HealthResponse {
  status: string
  database?: string
  timestamp?: string
}
