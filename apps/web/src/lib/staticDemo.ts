import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { LoginResponse, Portal, Role, User } from '../types'

/**
 * GitHub Pages serves a static build: there is no Fastify API behind it.
 * When VITE_STATIC_DEMO=true the axios adapter below answers the few requests
 * the UI needs locally, so visitors can log in with the published demo
 * accounts and explore the curriculum (including Amazigh) without a backend.
 */
export const STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === 'true'

interface DemoAccount {
  email: string
  name: string
  role: Role
  portal: Portal
}

const ACCOUNTS: readonly DemoAccount[] = [
  { email: 'director@ryad.ma', name: 'مدير رياض الأقصى', role: 'director', portal: 'admin_portal' },
  { email: 'teacher@ryad.ma', name: 'معلمة رياض الأقصى', role: 'teacher', portal: 'private' },
  { email: 'parent@ryad.ma', name: 'ولي أمر', role: 'parent', portal: 'private' },
  { email: 'student@ryad.ma', name: 'طالب رياض الأقصى', role: 'student', portal: 'private' },
]

function toUser(account: DemoAccount): User {
  return {
    id: `demo-${account.role}`,
    name: account.name,
    email: account.email,
    role: account.role,
    portal: account.portal,
    scope: { type: 'demo', mode: 'static' },
  }
}

function bodyOf(data: unknown): Record<string, unknown> {
  if (typeof data === 'string') {
    try {
      const parsed: unknown = JSON.parse(data)
      return parsed && typeof parsed === 'object'
        ? (parsed as Record<string, unknown>)
        : {}
    } catch {
      return {}
    }
  }
  return data && typeof data === 'object' ? (data as Record<string, unknown>) : {}
}

function respond<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Unauthorized',
    headers: {},
    config,
  }
}

function deny(config: InternalAxiosRequestConfig, errorCode = 'invalid_credentials'): never {
  throw new AxiosError(
    errorCode,
    'ERR_BAD_REQUEST',
    config,
    undefined,
    respond(config, { error: errorCode }, 401),
  )
}

/** Empty but structurally familiar payloads for pages that query a backend. */
function demoPayload(): Record<string, unknown> {
  return {
    ok: true,
    items: [],
    children: [],
    students: [],
    classes: [],
    subjects: [],
    terms: [],
    contentSamples: [],
    notifications: [],
    assignments: [],
    messages: [],
    threads: [],
    feedbackCards: [],
    warnings: [],
    experiments: [],
    requests: [],
    records: [],
    level: '1',
    total: 0,
    summary: { todayMinutes: 0, streakDays: 0 },
    progress: { totalXp: 0, completed: 0 },
    insights: { learningPath: { nextSteps: [] } },
    overview: {},
    engagement: {},
    dashboard: {},
  }
}

export async function staticDemoAdapter(
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> {
  const url = config.url ?? ''
  const method = (config.method ?? 'get').toLowerCase()

  if (url.includes('/auth/login')) {
    if (method !== 'post') deny(config)
    const body = bodyOf(config.data)
    const login = String(body.login ?? body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')
    const portal = body.portal as Portal | undefined
    const account = ACCOUNTS.find((item) => item.email.toLowerCase() === login)

    if (!account || password !== '1234' || (portal && portal !== account.portal)) {
      deny(config)
    }

    const user = toUser(account)
    const result: LoginResponse = {
      token: `demo.${account.role}`,
      accessToken: `demo.${account.role}`,
      refreshToken: `demo-refresh.${account.role}`,
      expiresIn: 86_400,
      user,
      security: { httpsRecommended: false },
    }
    return respond(config, result)
  }

  if (url.includes('/auth/me')) {
    const authorization = config.headers?.get?.('Authorization') ?? ''
    const role = String(authorization).match(/demo\.([a-z]+)/)?.[1] ?? 'student'
    const account = ACCOUNTS.find((item) => item.role === role) ?? ACCOUNTS[3]
    return respond(config, { user: toUser(account) })
  }

  if (url.includes('/auth/refresh')) {
    return respond(config, {
      token: 'demo.student',
      accessToken: 'demo.student',
      refreshToken: 'demo-refresh.student',
      expiresIn: 86_400,
    })
  }

  if (url.includes('/health')) {
    return respond(config, {
      status: 'ok',
      database: 'static-demo',
      timestamp: new Date().toISOString(),
    })
  }

  return respond(config, demoPayload())
}
