import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarCheck2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  GraduationCap,
  Loader2,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import Logo from '../components/Logo'
import {
  AchievementRail,
  InsightStrip,
  MetricCard,
  type Achievement,
} from '../components/ux'
import ExecutiveDashboard, {
  EMPTY_EXEC,
  type AdminOverviewData,
  type AdminPerformanceData,
  type AdminWarningData,
  type SystemStatsData,
  type ImpactReportData,
  type AnonymizedData,
  type LearningAnalyticsData,
  type ImpactData,
  type AdminEngagementData,
  type InterventionPlansData,
  type LessonPlansData,
  type ThreadsData,
  type GradesResultsData,
  type ExecutiveData,
} from '../components/ExecutiveDashboard'
import { apiGet } from '../lib/api'
import { useAuthStore } from '../store/auth'
import type { HealthResponse } from '../types'

type HealthState = 'checking' | 'connected' | 'offline'

interface StatCardData {
  label: string
  value: string
  hint: string
  icon: LucideIcon
  tone: string
  bar: string
  progress: number
}

interface FocusItem {
  key: string
  label: string
  value: string
  hint: string
  to: string
  icon: LucideIcon
  tone: string
}

interface QuickLink {
  key: string
  labelKey: string
  labelDefault: string
  to: string
  icon: LucideIcon
  tone: string
}

interface AgentActivity {
  id?: string
  agent?: string
  summary?: string
  status?: string
  at?: string
}

interface LiveStats {
  students?: number
  teachers?: number
  attendance?: number
  average?: number
  activeToday?: number
  reviewCards?: number
  warnings?: number
  experiments?: number
  gaps?: number
  xp?: number
  streak?: number
  minutes?: number
  lessons?: number
  units?: number
  nextSteps?: string[]
  focusNames?: string[]
}

interface CardsResponse {
  feedbackCards?: Array<{ status?: string }>
}
interface WarningsResponse {
  total?: number
  warnings?: unknown[]
}
interface ExperimentsResponse {
  experiments?: string[]
}
interface AssistantResponse {
  agentRuns?: AgentActivity[]
}
interface ClassesResponse {
  classes?: Array<{ students?: unknown[] }>
}
interface EngagementResponse {
  students?: Array<{ engagement?: { todayMinutes?: number } }>
}
interface DashboardChild {
  id?: string
  name?: string
  attendance?: { rate?: number }
  average?: string | number | null
  gaps?: number
}
interface ParentDashboardResponse {
  children?: DashboardChild[]
}
interface ContentResponse {
  items?: unknown[]
}
interface ProgressResponse {
  progress?: { completed?: number; totalXp?: number }
}
interface EngagementSummaryResponse {
  summary?: { todayMinutes?: number; streakDays?: number }
}
interface InsightsResponse {
  insights?: { learningPath?: { nextSteps?: string[] } }
}

const TONES = {
  brand: 'bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300',
  brandSoft: 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400',
  gold: 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300',
  goldSoft: 'bg-gold-50 text-gold-600 dark:bg-gold-500/10 dark:text-gold-400',
} as const

const BARS = {
  brand: 'bg-brand-500',
  brandSoft: 'bg-brand-400',
  gold: 'bg-gold-500',
  goldSoft: 'bg-gold-400',
} as const

const BASE_LINKS: ReadonlyArray<QuickLink> = [
  { key: 'students', labelKey: 'students', labelDefault: 'التلاميذ', to: '', icon: GraduationCap, tone: TONES.brand },
  { key: 'teachers', labelKey: 'teachers', labelDefault: 'الأساتذة', to: '', icon: BookOpenCheck, tone: TONES.brandSoft },
  { key: 'parents', labelKey: 'parents', labelDefault: 'الأسر', to: '', icon: UsersRound, tone: TONES.gold },
  { key: 'reports', labelKey: 'reports', labelDefault: 'التقارير', to: '', icon: BarChart3, tone: TONES.goldSoft },
]

const EXTRA_LINKS: Record<string, ReadonlyArray<QuickLink>> = {
  director: [
    { key: 'cards', labelKey: 'dashCards', labelDefault: 'مراجعة البطاقات', to: '/admin/cards-center', icon: FileCheck2, tone: TONES.gold },
    { key: 'labs', labelKey: 'dashLabs', labelDefault: 'مختبر التحليلات', to: '/admin/experiments', icon: Activity, tone: TONES.brandSoft },
    { key: 'curriculum', labelKey: 'dashCurriculum', labelDefault: 'المنهج', to: '/admin/curriculum', icon: BookOpenCheck, tone: TONES.goldSoft },
  ],
  deputy: [
    { key: 'cards', labelKey: 'dashCards', labelDefault: 'مراجعة البطاقات', to: '/admin/cards-center', icon: FileCheck2, tone: TONES.gold },
    { key: 'labs', labelKey: 'dashLabs', labelDefault: 'مختبر التحليلات', to: '/admin/experiments', icon: Activity, tone: TONES.brandSoft },
  ],
  admin: [
    { key: 'cards', labelKey: 'dashCards', labelDefault: 'مراجعة البطاقات', to: '/admin/cards-center', icon: FileCheck2, tone: TONES.gold },
    { key: 'labs', labelKey: 'dashLabs', labelDefault: 'مختبر التحليلات', to: '/admin/experiments', icon: Activity, tone: TONES.brandSoft },
  ],
  supervisor: [
    { key: 'cards', labelKey: 'dashCards', labelDefault: 'مراجعة البطاقات', to: '/admin/cards-center', icon: FileCheck2, tone: TONES.gold },
  ],
  teacher: [
    { key: 'cards', labelKey: 'dashCards', labelDefault: 'بطاقات التغذية الراجعة', to: '/teacher/feedback-cards', icon: FileCheck2, tone: TONES.gold },
    { key: 'engagement', labelKey: 'dashEngagement', labelDefault: 'التعلّم الموازي', to: '/teacher/engagement', icon: Activity, tone: TONES.brandSoft },
    { key: 'curriculum', labelKey: 'dashCurriculum', labelDefault: 'المنهج', to: '/teacher/curriculum', icon: BookOpenCheck, tone: TONES.goldSoft },
  ],
  parent: [
    { key: 'report', labelKey: 'dashReport', labelDefault: 'بطاقة التقييم', to: '/parent/report-card', icon: FileCheck2, tone: TONES.gold },
    { key: 'insights', labelKey: 'insights', labelDefault: 'الرؤى', to: '/parent/insights', icon: Sparkles, tone: TONES.brandSoft },
  ],
  student: [
    { key: 'path', labelKey: 'dashPath', labelDefault: 'مساري التعلمي', to: '/student/path', icon: Route, tone: TONES.gold },
    { key: 'report', labelKey: 'dashReport', labelDefault: 'بطاقتي', to: '/student/report-card', icon: FileCheck2, tone: TONES.brandSoft },
  ],
}

const LINK_TARGETS: Record<string, Record<string, string>> = {
  director: { students: '/admin/people', teachers: '/admin/people', parents: '/admin/people', reports: '/admin/report-cards' },
  deputy: { students: '/admin/people', teachers: '/admin/people', parents: '/admin/people', reports: '/admin/report-cards' },
  supervisor: { students: '/admin/people', teachers: '/admin/people', parents: '/admin/people', reports: '/admin/report-cards' },
  clerk: { students: '/admin/people', teachers: '/admin/people', parents: '/admin/people', reports: '/admin/report-cards' },
  admin: { students: '/admin/people', teachers: '/admin/people', parents: '/admin/people', reports: '/admin/report-cards' },
  teacher: { students: '/teacher/classes', teachers: '/teacher/classes', parents: '/teacher/communications', reports: '/teacher/grades' },
  parent: { students: '/parent/children', teachers: '/parent/messages', parents: '/parent/children', reports: '/parent/insights' },
  student: { students: '/student/profile', teachers: '/student/path', parents: '/student/portfolio', reports: '/student/insights' },
}

function settled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

function cap(value: number | undefined, max: number): number {
  if (value === undefined || !Number.isFinite(value) || max <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)))
}

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const portal = useAuthStore((state) => state.portal)

  const [exec, setExec] = useState<ExecutiveData>(EMPTY_EXEC)
  const [execLoading, setExecLoading] = useState(portal === 'admin_portal')
  const [execError, setExecError] = useState(false)

  const [health, setHealth] = useState<HealthState>('checking')
  const [healthData, setHealthData] = useState<HealthResponse | null>(null)
  const [scopedError, setScopedError] = useState(false)
  const [live, setLive] = useState<LiveStats>({})
  const [activity, setActivity] = useState<AgentActivity[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const language = i18n.resolvedLanguage ?? 'ar'
  const locale = language === 'amz' ? 'fr' : language === 'ar' ? 'ar-MA' : language
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(locale, options).format(value)

  const role = user?.role ?? ''
  const firstName = user?.name.trim().split(/\s+/)[0] ?? ''
  const greeting = firstName ? t('welcome', { name: firstName }) : t('welcomeBack')
  const today = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const checkApi = useCallback(async () => {
    setHealth('checking')
    setHealthData(null)
    try {
      const data = await apiGet<HealthResponse>('/health')
      setHealth('connected')
      setHealthData(data)
    } catch {
      setHealth('offline')
    }
  }, [])

  useEffect(() => {
    void checkApi()
  }, [checkApi, refreshKey])

  useEffect(() => {
    let active = true
    setActivity([])
    setScopedError(false)

    async function load() {
      try {
        if (portal === 'admin_portal') {
          setExecLoading(true)
          setExecError(false)
          const [
            overviewR, performanceR, warningR, experimentsR, cardsR, assistantR,
            systemStatsR, impactReportR, anonymizedR, learningAnalyticsR, impactR,
            engagementR, interventionPlansR, lessonPlansR, threadsR, gradesR, communicationsR,
          ] = await Promise.allSettled([
            apiGet<AdminOverviewData>('/admin/overview'),
            apiGet<AdminPerformanceData>('/admin/performance'),
            apiGet<AdminWarningData>('/admin/ml/early-warning'),
            apiGet<ExperimentsResponse>('/admin/ml/experiment'),
            apiGet<CardsResponse>('/admin/feedback-cards'),
            apiGet<AssistantResponse>('/admin/smart-assistant'),
            apiGet<SystemStatsData>('/admin/system-stats'),
            apiGet<ImpactReportData>('/admin/impact-report'),
            apiGet<AnonymizedData>('/admin/analytics/anonymized'),
            apiGet<LearningAnalyticsData>('/admin/learning-analytics'),
            apiGet<ImpactData>('/admin/impact'),
            apiGet<AdminEngagementData>('/admin/engagement'),
            apiGet<InterventionPlansData>('/admin/intervention-plans'),
            apiGet<LessonPlansData>('/admin/lesson-plans'),
            apiGet<ThreadsData>('/admin/threads'),
            apiGet<GradesResultsData>('/admin/grades/results'),
            apiGet<{ communications: Array<{ governance?: { consent?: string } }> }>(
              '/admin/communications',
            ),
          ])
          if (!active) return
          const overview = settled(overviewR)
          const performance = settled(performanceR)
          const warnings = settled(warningR)
          const experiments = settled(experimentsR)
          const cards = settled(cardsR)
          const assistant = settled(assistantR)
          const averages = (performance?.byLevel ?? [])
            .map((row) => Number(row.average))
            .filter((value) => Number.isFinite(value))
          setLive({
            students: overview?.studentsPresent,
            teachers: overview?.teachers,
            attendance: overview?.attendanceRate === undefined ? undefined : overview.attendanceRate / 100,
            average: averages.length ? averages.reduce((sum, value) => sum + value, 0) / averages.length : undefined,
            reviewCards: (cards?.feedbackCards ?? []).filter((card) => card.status === 'proposed').length,
            warnings: warnings?.total ?? warnings?.warnings?.length,
            experiments: experiments?.experiments?.length,
            gaps: overview?.withGaps,
          })
          const systemStats = settled(systemStatsR)
          const impactReport = settled(impactReportR)
          const communications = settled(communicationsR)
          const consentGranted = (communications?.communications ?? []).filter(
            (item) => item.governance?.consent === 'granted',
          ).length
          setExec({
            overview,
            performance,
            warnings,
            systemStats,
            impactReport,
            anonymized: settled(anonymizedR),
            learningAnalytics: settled(learningAnalyticsR),
            impact: settled(impactR),
            engagement: settled(engagementR),
            interventionPlans: settled(interventionPlansR),
            lessonPlans: settled(lessonPlansR),
            threads: settled(threadsR),
            gradesResults: settled(gradesR),
            consentGranted,
          })
          setExecError(!overview && !systemStats && !impactReport)
          setExecLoading(false)
          setActivity((assistant?.agentRuns ?? []).slice(0, 3))
          return
        }

        if (role === 'teacher') {
          const [classesR, cardsR, warningR, engagementR] = await Promise.allSettled([
            apiGet<ClassesResponse>('/teacher/classes'),
            apiGet<CardsResponse>('/teacher/feedback-cards'),
            apiGet<WarningsResponse>('/teacher/ml/early-warning'),
            apiGet<EngagementResponse>('/teacher/engagement'),
          ])
          if (!active) return
          const classes = settled(classesR)?.classes ?? []
          const cards = settled(cardsR)?.feedbackCards ?? []
          const warnings = settled(warningR)
          const engagement = settled(engagementR)
          setLive({
            students: classes.reduce((sum, item) => sum + (item.students?.length ?? 0), 0),
            teachers: classes.length,
            activeToday: (engagement?.students ?? []).filter(
              (row) => (row.engagement?.todayMinutes ?? 0) > 0,
            ).length,
            reviewCards: cards.filter((card) => card.status === 'proposed').length,
            warnings: warnings?.total ?? warnings?.warnings?.length,
          })
          return
        }

        if (role === 'parent') {
          const [dashboardR] = await Promise.allSettled([apiGet<ParentDashboardResponse>('/parent/dashboard')])
          const dashboard = settled(dashboardR)
          const children = dashboard?.children ?? []
          const child = children[0]
          if (!active) return
          setLive({
            students: children.length,
            attendance: child?.attendance?.rate === undefined ? undefined : child.attendance.rate / 100,
            average: child?.average === undefined || child?.average === null ? undefined : Number(child.average),
            gaps: child?.gaps,
            focusNames: children.map((item) => item.name).filter((name): name is string => Boolean(name)),
          })
          return
        }

        if (role === 'student') {
          const [contentR, engagementR, progressR, insightsR] = await Promise.allSettled([
            apiGet<ContentResponse>('/student/content'),
            apiGet<EngagementSummaryResponse>('/student/engagement'),
            apiGet<ProgressResponse>('/student/lessons/progress'),
            apiGet<InsightsResponse>('/student/insights'),
          ])
          if (!active) return
          const content = settled(contentR)
          const engagement = settled(engagementR)
          const progress = settled(progressR)
          const insights = settled(insightsR)
          setLive({
            xp: progress?.progress?.totalXp,
            lessons: progress?.progress?.completed,
            units: content?.items?.length,
            minutes: engagement?.summary?.todayMinutes,
            streak: engagement?.summary?.streakDays,
            nextSteps: insights?.insights?.learningPath?.nextSteps ?? [],
          })
        }
      } catch {
        // Keep the dashboard usable with placeholders, but tell the user why.
        if (active) setScopedError(true)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [portal, role, refreshKey])

  const asText = (value: number | undefined, suffix = '') =>
    value === undefined ? '—' : `${formatNumber(value)}${suffix}`
  const asPercent = (value: number | undefined) =>
    value === undefined
      ? '—'
      : new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(value)
  const asScore = (value: number | undefined) =>
    value === undefined ? '—' : formatNumber(value, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const asDate = (value: string | undefined) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
  }

  const stats = useMemo<StatCardData[]>(() => {
    if (portal === 'admin_portal') {
      return [
        { label: t('students'), value: asText(live.students), hint: t('statStudentsHint'), icon: Users, tone: TONES.brand, bar: BARS.brand, progress: cap(live.students, 600) },
        { label: t('teachers'), value: asText(live.teachers), hint: t('statTeachersHint'), icon: GraduationCap, tone: TONES.brandSoft, bar: BARS.brandSoft, progress: cap(live.teachers, 40) },
        { label: t('attendance'), value: asPercent(live.attendance), hint: t('statAttendanceHint'), icon: CalendarCheck2, tone: TONES.gold, bar: BARS.gold, progress: cap(live.attendance === undefined ? undefined : live.attendance * 100, 100) },
        { label: t('averageScore'), value: asScore(live.average), hint: t('statAverageHint'), icon: TrendingUp, tone: TONES.goldSoft, bar: BARS.goldSoft, progress: cap(live.average, 20) },
      ]
    }
    if (role === 'teacher') {
      return [
        { label: t('students'), value: asText(live.students), hint: t('dashTeacherStudentsHint', { defaultValue: 'في فصولك المُحددة' }), icon: Users, tone: TONES.brand, bar: BARS.brand, progress: cap(live.students, 120) },
        { label: t('classes'), value: asText(live.teachers), hint: t('dashTeacherClassesHint', { defaultValue: 'فصولك هذا العام' }), icon: BookOpenCheck, tone: TONES.brandSoft, bar: BARS.brandSoft, progress: cap(live.teachers, 10) },
        { label: t('dashActiveToday'), value: asText(live.activeToday), hint: t('dashActiveHint', { defaultValue: 'داخل فضاء التعلّم الموازي' }), icon: Activity, tone: TONES.gold, bar: BARS.gold, progress: cap(live.activeToday, live.students ?? 0) },
        { label: t('dashCardsReview'), value: asText(live.reviewCards), hint: t('dashCardsHint', { defaultValue: 'بطاقات مقترحة بانتظار رأيك' }), icon: ClipboardCheck, tone: TONES.goldSoft, bar: BARS.goldSoft, progress: cap(live.reviewCards, 20) },
      ]
    }
    if (role === 'parent') {
      return [
        { label: t('children'), value: asText(live.students), hint: t('dashChildrenHint', { defaultValue: 'أبناؤك المسجّلون' }), icon: UsersRound, tone: TONES.brand, bar: BARS.brand, progress: cap(live.students, 6) },
        { label: t('attendance'), value: asPercent(live.attendance), hint: t('statAttendanceHint'), icon: CalendarCheck2, tone: TONES.gold, bar: BARS.gold, progress: cap(live.attendance === undefined ? undefined : live.attendance * 100, 100) },
        { label: t('averageScore'), value: asScore(live.average), hint: t('statAverageHint'), icon: TrendingUp, tone: TONES.goldSoft, bar: BARS.goldSoft, progress: cap(live.average, 20) },
        { label: t('gaps'), value: asText(live.gaps), hint: t('dashGapsHint', { defaultValue: 'نقاط تحتاج دعمًا — استشارية' }), icon: ShieldCheck, tone: TONES.brandSoft, bar: BARS.brandSoft, progress: cap(live.gaps, 10) },
      ]
    }
    return [
      { label: t('dashXp'), value: asText(live.xp), hint: t('dashXpHint', { defaultValue: 'نقاط اكتسبتها من الدروس' }), icon: Sparkles, tone: TONES.gold, bar: BARS.gold, progress: cap(live.xp, 600) },
      { label: t('dashStreak'), value: asText(live.streak, ' ' + t('parEngDay', { defaultValue: 'يوم' })), hint: t('dashStreakHint', { defaultValue: 'داخل الفضاء الموازي' }), icon: CalendarCheck2, tone: TONES.goldSoft, bar: BARS.goldSoft, progress: cap(live.streak, 14) },
      { label: t('dashMinutesToday'), value: asText(live.minutes, ' ' + t('parEngMinutes', { defaultValue: 'دقيقة' })), hint: t('dashMinutesHint', { defaultValue: 'منفصل عن حضور القسم' }), icon: Clock3, tone: TONES.brand, bar: BARS.brand, progress: cap(live.minutes, 120) },
      { label: t('dashLessonsDone'), value: asText(live.lessons), hint: t('dashLessonsHint', { defaultValue: 'من دروس مسارك التفاعلي' }), icon: BookOpenCheck, tone: TONES.brandSoft, bar: BARS.brandSoft, progress: cap(live.lessons, live.units ?? 0) },
    ]
  }, [live, portal, role, t, locale])

  const focus = useMemo<FocusItem[]>(() => {
    const open = t('dashOpen', { defaultValue: 'افتح' })
    if (portal === 'admin_portal') {
      return [
        { key: 'cards', label: t('dashCardsReview'), value: asText(live.reviewCards), hint: t('dashFocusCardsHint', { defaultValue: 'راجع البطاقات المقترحة قبل مشاركتها' }), to: '/admin/cards-center', icon: FileCheck2, tone: TONES.gold },
        { key: 'warnings', label: t('dashEarlyWarnings'), value: asText(live.warnings), hint: t('dashFocusWarningsHint', { defaultValue: 'مؤشرات استشارية تحتاج تحقق المعلّم' }), to: '/admin/experiments', icon: ShieldCheck, tone: TONES.brandSoft },
        { key: 'labs', label: t('dashLabs'), value: asText(live.experiments), hint: t('dashFocusLabsHint', { defaultValue: 'تجارب قيد العرض — التعيينات مؤقتة' }), to: '/admin/experiments', icon: Activity, tone: TONES.brand },
        { key: 'report', label: t('dashReportCards'), value: open, hint: t('dashFocusReportHint', { defaultValue: 'درجات وكفايات وحضور في بطاقة واحدة' }), to: '/admin/report-cards', icon: BarChart3, tone: TONES.goldSoft },
      ]
    }
    if (role === 'teacher') {
      return [
        { key: 'cards', label: t('dashCardsReview'), value: asText(live.reviewCards), hint: t('dashFocusCardsHint', { defaultValue: 'راجع البطاقات المقترحة قبل مشاركتها' }), to: '/teacher/feedback-cards', icon: FileCheck2, tone: TONES.gold },
        { key: 'warnings', label: t('dashEarlyWarnings'), value: asText(live.warnings), hint: t('dashFocusWarningsHint', { defaultValue: 'مؤشرات استشارية تحتاج تحقق المعلّم' }), to: '/teacher/alerts', icon: ShieldCheck, tone: TONES.brandSoft },
        { key: 'engagement', label: t('dashActiveToday'), value: asText(live.activeToday), hint: t('dashActiveHint', { defaultValue: 'داخل فضاء التعلّم الموازي' }), to: '/teacher/engagement', icon: Activity, tone: TONES.brand },
        { key: 'curriculum', label: t('dashCurriculum'), value: open, hint: t('dashFocusCurriculumHint', { defaultValue: 'خطط الدروس حسب الفصل والمادة' }), to: '/teacher/curriculum', icon: BookOpenCheck, tone: TONES.goldSoft },
      ]
    }
    if (role === 'parent') {
      const name = live.focusNames?.[0] ?? ''
      return [
        { key: 'report', label: t('dashReport'), value: open, hint: t('dashFocusChildHint', { defaultValue: 'تابع تقدّم {{name}} هذا الفصل', name }), to: '/parent/report-card', icon: FileCheck2, tone: TONES.gold },
        { key: 'insights', label: t('insights'), value: asText(live.gaps), hint: t('dashFocusGapsHint', { defaultValue: 'مجالات تحتاج دعمًا' }), to: '/parent/insights', icon: Sparkles, tone: TONES.brandSoft },
        { key: 'engagement', label: t('dashEngagement'), value: open, hint: t('dashFocusPlatformHint', { defaultValue: 'الواجبات وزمن المنصة منفصلان عن الحضور' }), to: '/parent/children', icon: Activity, tone: TONES.brand },
        { key: 'messages', label: t('messages'), value: open, hint: t('dashFocusMessagesHint', { defaultValue: 'تواصل مع المعلّم بشأن الخطة' }), to: '/parent/messages', icon: UsersRound, tone: TONES.goldSoft },
      ]
    }
    const next = live.nextSteps?.[0] ?? t('dashFocusPathHint', { defaultValue: 'واصل دروسك حسب خطتك الفصلية' })
    return [
      { key: 'path', label: t('dashPath'), value: open, hint: next, to: '/student/path', icon: Route, tone: TONES.gold },
      { key: 'lessons', label: t('dashLessonsDone'), value: asText(live.lessons), hint: t('dashFocusLessonsHint', { defaultValue: 'دروس تفاعلية من منهاجك' }), to: '/student/path', icon: BookOpenCheck, tone: TONES.brandSoft },
      { key: 'minutes', label: t('dashMinutesToday'), value: asText(live.minutes, ' ' + t('parEngMinutes', { defaultValue: 'دقيقة' })), hint: t('dashMinutesHint', { defaultValue: 'منفصل عن حضور القسم' }), to: '/student/path', icon: Clock3, tone: TONES.brand },
      { key: 'report', label: t('dashReport'), value: open, hint: t('dashFocusReportHintStudent', { defaultValue: 'نتائجك وملاحظات المعلّم المعتمدة' }), to: '/student/report-card', icon: FileCheck2, tone: TONES.goldSoft },
    ]
  }, [live, portal, role, t, locale])

  const quickLinks = useMemo(() => {
    const extras = EXTRA_LINKS[role] ?? []
    return [...BASE_LINKS, ...extras].map((link) => ({
      ...link,
      to: link.to || LINK_TARGETS[role]?.[link.key] || '/',
    }))
  }, [role])

  // Milestones are derived from real dashboard values only. They recognise a
  // completed action, never a ranking between children, teachers or schools.
  const achievements = useMemo<Achievement[]>(() => {
    const badges: Achievement[] = [
      {
        key: 'data',
        label: t('uxBadgeData', { defaultValue: 'بيانات جاهزة' }),
        hint: t('uxBadgeDataHint', { defaultValue: 'المؤشرات الرئيسية متاحة الآن' }),
        icon: BarChart3,
        earned: live.students !== undefined || live.xp !== undefined,
      },
      {
        key: 'progress',
        label: t('uxBadgeProgress', { defaultValue: 'خطوة مُنجَزة' }),
        hint: t('uxBadgeProgressHint', { defaultValue: 'نشاط مسجّل في لوحة البيانات' }),
        icon: Sparkles,
        earned:
          (live.lessons ?? 0) > 0 ||
          (live.activeToday ?? 0) > 0 ||
          (live.streak ?? 0) > 0 ||
          (live.students ?? 0) > 0,
      },
    ]
    if (portal === 'admin_portal' || role === 'teacher') {
      badges.push({
        key: 'inbox',
        label: t('uxBadgeInbox', { defaultValue: 'صندوق مُراجَع' }),
        hint: t('uxBadgeInboxHint', { defaultValue: 'لا بطاقات مقترحة بانتظارك' }),
        icon: ClipboardCheck,
        earned: live.reviewCards === 0,
      })
    }
    return badges
  }, [live, portal, role, t])

  const infoLabel = t('uxInfoLabel', { defaultValue: 'ماذا يعني هذا المؤشر؟' })
  const genericExplain = t('uxExplainGeneric', {
    defaultValue:
      'مؤشر استرشادي من بيانات النموذج؛ راجع الصفحة المخصّصة للتفاصيل، ولا يُتخذ قرار دون مراجعة بشرية.',
  })

  const databaseStatus =
    healthData?.database === 'connected'
      ? t('databaseConnected')
      : healthData?.database === 'disconnected'
        ? t('databaseDisconnected')
        : null

  const healthLabel =
    health === 'connected' ? t('apiConnected') : health === 'checking' ? t('apiChecking') : t('apiOffline')
  const healthDot =
    health === 'connected' ? 'bg-brand-500' : health === 'checking' ? 'animate-pulse bg-gold-500' : 'bg-[#E03131]'

  const refresh = useCallback(() => setRefreshKey((value) => value + 1), [])

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 ux-zellij opacity-40" aria-hidden="true" />
        <div className="absolute -end-16 -top-20 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('overview')}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black leading-tight text-balance sm:text-3xl">
              {greeting}
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/80">{today}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                {t('dashAdvisoryShort', { defaultValue: 'القرارات بمراجعة بشرية' })}
              </span>
              {(portal === 'admin_portal' || role === 'teacher' || role === 'student' || role === 'parent') ? (
                <button
                  type="button"
                  onClick={refresh}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black transition hover:bg-white/25"
                >
                  <RefreshCw className="h-3 w-3" aria-hidden="true" />
                  {t('dashRefreshData', { defaultValue: 'تحديث البيانات' })}
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-start sm:self-center">
            <div className="hidden rounded-card-lg bg-white p-2 shadow-lg sm:block">
              <Logo size={64} />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1.5 text-[11px] font-black text-ink shadow-chunky-gold">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {t('demo')}
            </span>
          </div>
        </div>
      </section>

      {scopedError ? (
        <div
          role="status"
          className="rounded-card border-2 border-gold-300/60 bg-gold-50 px-4 py-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200"
        >
          {t('dashPartialData', {
            defaultValue: 'بعض بيانات اللوحة غير متاحة حالياً؛ القيم الناقصة تظهر كشرطة. لا تُتخذ قرارات نهائية بناءً على هذه البيانات.',
          })}
        </div>
      ) : null}

      <section aria-label={t('overview')} className="ux-enter grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, hint, icon: Icon, tone, bar, progress }) => (
          <MetricCard
            key={label}
            label={label}
            value={value}
            hint={hint}
            explain={`${hint} — ${genericExplain}`}
            infoLabel={infoLabel}
            icon={Icon}
            tone={tone}
            bar={bar}
            progress={progress}
          />
        ))}
      </section>

      <InsightStrip
        title={t('uxInsightTitle', { defaultValue: 'اقرأ لوحتك في 10 ثوانٍ' })}
        subtitle={t('uxInsightHint', { defaultValue: 'إشارات سريعة تحدّد خطوتك التالية.' })}
        priorityLabel={t('uxPriority', { defaultValue: 'الأولوية' })}
        advisory={t('dashAdvisory', {
          defaultValue:
            'مخرجات التحليلات والبطاقات استشارية؛ لا تُتخذ قرارات بشأن التلاميذ دون مراجعة واعتماد بشري، وزمن المنصة منفصل عن حضور القسم.',
        })}
        items={focus.map(({ key, label, value, hint, to, icon, tone }) => ({
          key,
          label,
          value,
          hint,
          to,
          icon,
          tone,
        }))}
      />

      <AchievementRail
        title={t('uxAchievements', { defaultValue: 'محطاتك' })}
        subtitle={t('uxAchievementsHint', { defaultValue: 'إنجازات مرتبطة بعملك، دون ترتيب أو منافسة.' })}
        earnedLabel={t('uxEarned', { defaultValue: 'مُحقق' })}
        pendingLabel={t('uxPending', { defaultValue: 'قيد التقدّم' })}
        badges={achievements}
      />

      {portal === 'admin_portal' ? (
        <ExecutiveDashboard data={exec} loading={execLoading} error={execError} locale={locale} />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card-school p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black">{t('quickLinks')}</h2>
              <p className="mt-1 text-xs font-semibold text-muted">{t('quickLinksHint')}</p>
            </div>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {quickLinks.map(({ key, labelKey, labelDefault, to, icon: Icon, tone }) => (
              <Link
                key={key}
                to={to}
                className="group flex items-center gap-3 rounded-card border-2 border-line bg-surface p-3 text-start transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex-1 truncate text-sm font-extrabold">{t(labelKey, { defaultValue: labelDefault })}</span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted transition group-hover:text-brand-600 directional-icon"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {portal === 'admin_portal' && activity.length > 0 ? (
            <section className="card-school p-5">
              <h2 className="text-sm font-black">{t('dashRecentActivity', { defaultValue: 'آخر نشاط الوكلاء' })}</h2>
              <ul className="mt-3 space-y-2">
                {activity.map((item, index) => (
                  <li
                    key={item.id ?? index}
                    className="rounded-card border-2 border-line bg-surface p-2.5 text-[11px] font-semibold text-muted"
                  >
                    <span className="font-black text-content">{item.agent ?? '—'}</span>
                    <p className="mt-0.5 line-clamp-2">{item.summary ?? '—'}</p>
                    {item.at ? (
                      <p className="mt-1 font-mono text-[10px]">
                        {asDate(item.at)}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="card-school flex flex-1 flex-col p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-700 dark:text-brand-300">
                  <Activity className="h-4 w-4" aria-hidden="true" />
                </span>
                <h2 className="text-sm font-black">{t('healthCheck')}</h2>
              </div>
              <span
                aria-live="polite"
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wide text-muted"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${healthDot}`} aria-hidden="true" />
                {healthLabel}
              </span>
            </div>

            <div className="mt-4 flex-1 rounded-card border-2 border-line bg-surface-muted p-3">
              <p className="font-mono text-[11px] font-bold text-content">GET /api/health</p>
              {health === 'checking' ? (
                <div className="mt-3 space-y-2" aria-hidden="true">
                  <div className="h-2 w-3/4 animate-pulse rounded-full bg-line" />
                  <div className="h-2 w-1/2 animate-pulse rounded-full bg-line" />
                </div>
              ) : null}
              {health === 'connected' && databaseStatus ? (
                <p className="mt-2 text-[11px] font-semibold text-muted">
                  {t('healthDatabase', { status: databaseStatus })}
                </p>
              ) : null}
              {health === 'offline' ? (
                <p className="mt-2 text-[11px] font-semibold text-muted">{t('apiOffline')}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => void checkApi()}
              disabled={health === 'checking'}
              className="btn-chunky btn-chunky--secondary btn-chunky--sm mt-4 w-full"
            >
              {health === 'checking' ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {t('healthRetry')}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
