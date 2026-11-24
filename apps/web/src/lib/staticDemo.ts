import {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { LoginResponse, Role, User } from '../types'

/**
 * GitHub Pages serves a static build: there is no Fastify API behind it.
 * When VITE_STATIC_DEMO=true this adapter answers requests locally from a
 * bundled, password-free snapshot of backend/data.json so every section has
 * real demo content and all read-only features work without a server.
 */
export const STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === 'true'

type AnyRecord = Record<string, any>

interface DemoUser {
  id: string
  name: string
  email: string
  role: Role
  portal: User['portal']
  scope?: User['scope']
}

interface DemoDb extends AnyRecord {
  users: DemoUser[]
}

let demoDbPromise: Promise<DemoDb> | null = null

async function loadDemoDb(): Promise<DemoDb> {
  if (demoDbPromise) return demoDbPromise
  demoDbPromise = (async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}demo-data.json`, { cache: 'force-cache' })
      if (!res.ok) throw new Error(String(res.status))
      return (await res.json()) as DemoDb
    } catch {
      // Keep retrying: a failed first load must not be cached forever.
      demoDbPromise = null
      return { users: [] } as DemoDb
    }
  })()
  return demoDbPromise
}

function toUser(user: DemoUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    portal: user.portal,
    scope: user.scope ?? { type: 'demo', mode: 'static' },
  }
}

function bodyOf(data: unknown): AnyRecord {
  if (typeof data === 'string') {
    try {
      const parsed: unknown = JSON.parse(data)
      return parsed && typeof parsed === 'object' ? (parsed as AnyRecord) : {}
    } catch {
      return {}
    }
  }
  return data && typeof data === 'object' ? (data as AnyRecord) : {}
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

function list(db: DemoDb, key: string): unknown[] {
  const value = db[key]
  return Array.isArray(value) ? value : []
}

/** Real demo collections for the read-only pages, with familiar aliases. */
function demoPayload(db: DemoDb): AnyRecord {
  const students = list(db, 'students')
  const classes = list(db, 'classes')
  const users = list(db, 'users')
  const curriculum = list(db, 'curriculum')
  const grades = list(db, 'gradeEntries')
  const threads = list(db, 'messageThreads')
  const timetable = list(db, 'timetable')

  return {
    ok: true,
    status: 'ok',
    total: students.length,
    // Collections
    users,
    students,
    children: students,
    classes,
    subjects: list(db, 'subjects'),
    curriculum,
    items: curriculum,
    levels: list(db, 'levels'),
    terms: ['Term 1', 'Term 2', 'Term 3'],
    contentSamples: list(db, 'contentSamples'),
    attendance: list(db, 'attendance'),
    assignments: list(db, 'assignments'),
    submissions: list(db, 'submissions'),
    grades,
    gradeEntries: grades,
    entries: grades,
    staff: list(db, 'staff'),
    goals: list(db, 'goals'),
    competencies: list(db, 'competencies'),
    competencyReferences: list(db, 'competencyReferences'),
    talents: list(db, 'talents'),
    activities: list(db, 'activities'),
    alerts: list(db, 'alerts'),
    cases: list(db, 'cases'),
    feedbackCards: list(db, 'feedbackCards'),
    communications: list(db, 'communications'),
    messageThreads: threads,
    threads,
    lessonPlans: list(db, 'lessonPlans'),
    lessonContents: list(db, 'lessonContents'),
    questionBank: list(db, 'questionBank'),
    questions: list(db, 'questionBank'),
    assessments: list(db, 'assessments'),
    formativeAssessments: list(db, 'formativeAssessments'),
    assessmentAttempts: list(db, 'assessmentAttempts'),
    timetable,
    slots: timetable,
    interventions: list(db, 'interventions'),
    interventionPlans: list(db, 'interventionPlans'),
    parentRequests: list(db, 'parentRequests'),
    auditLogs: list(db, 'auditLogs'),
    agentRuns: list(db, 'agentRuns'),
    publications: list(db, 'publications'),
    partners: list(db, 'partnerships'),
    // Aggregate-friendly values for dashboards
    studentsPresent: students.length,
    teachers: users.filter((user) => (user as DemoUser).role === 'teacher').length,
    attendanceRate: 92,
    withGaps: 0,
    warnings: { total: list(db, 'alerts').length, warnings: list(db, 'alerts') },
    experiments: { experiments: [] },
    overview: { studentsPresent: students.length, teachers: users.length, attendanceRate: 92, withGaps: 0 },
    summary: { todayMinutes: 45, streakDays: 6 },
    progress: { totalXp: 240, completed: 12 },
    insights: { learningPath: { nextSteps: [] } },
    engagement: { students: list(db, 'studentEngagement') },
    dashboard: { children: students },
  }
}

export async function staticDemoAdapter(
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> {
  const url = config.url ?? ''
  const method = (config.method ?? 'get').toLowerCase()
  const db = await loadDemoDb()

  if (url.includes('/auth/login')) {
    if (method !== 'post') deny(config)
    const body = bodyOf(config.data)
    const login = String(body.login ?? body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '')

    // Password check is demo-only; the bundled snapshot has no real hashes.
    if (password !== '1234') deny(config)
    const account = db.users.find((user) => String(user.email).toLowerCase() === login)
    if (!account) deny(config)

    const user = toUser(account)
    const result: LoginResponse = {
      token: `demo.${user.role}`,
      accessToken: `demo.${user.role}`,
      refreshToken: `demo-refresh.${user.role}`,
      expiresIn: 86_400,
      user,
      security: { httpsRecommended: false },
    }
    return respond(config, result)
  }

  if (url.includes('/auth/me')) {
    const authorization = config.headers?.get?.('Authorization') ?? ''
    const role = String(authorization).match(/demo\.([a-z]+)/)?.[1] ?? 'student'
    const account = db.users.find((user) => user.role === role) ?? db.users[0]
    if (!account) deny(config)
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

  if (method !== 'get') {
    // Demo writes are accepted in-session but not persisted to the snapshot.
    const body = bodyOf(config.data)
    return respond(config, { ok: true, ...body })
  }

  return respond(config, demoPayload(db))
}
