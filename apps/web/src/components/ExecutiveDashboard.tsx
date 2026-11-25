import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarCheck2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import Sparkline from './ux/Sparkline'

/* ------------------------------------------------------------------ */
/* Response shapes for the institution-wide admin endpoints.           */
/* All fields optional so a degraded/partial backend still renders.    */
/* ------------------------------------------------------------------ */

export interface AdminOverviewData {
  attendanceRate?: number
  studentsPresent?: number
  teachers?: number
  levels?: Array<{ name?: string; classes?: number }>
  auditCount?: number
  feedbackPending?: number
  activeCases?: number
  reassessmentDue?: number
  competencyRefs?: number
  withGaps?: number
  gifted?: number
  activeInterventions?: number
  outreachActivities?: number
  publications?: number
}

export interface AdminPerformanceData {
  byLevel?: Array<{ level?: string; students?: number; average?: string | number | null }>
}

export interface AdminWarningData {
  total?: number
  warnings?: Array<{ risk?: string; level?: string; urgency?: string }>
}

export interface SystemStatsData {
  stats?: {
    users?: number
    students?: number
    classes?: number
    competencies?: number
    competencyReferences?: number
    evidence?: number
    agentRuns?: number
    auditLogs?: number
    interventions?: number
    activities?: number
    feedbackCards?: number
    cases?: number
  }
  retentionPolicy?: unknown
}

export interface ImpactReportData {
  report?: {
    generatedAt?: string
    period?: string
    summary?: {
      totalStudents?: number
      totalFeedbackCards?: number
      approvedCards?: number
      inProgressCards?: number
      completedCards?: number
      activeCases?: number
      activeInterventions?: number
      outreachActivities?: number
      publications?: number
    }
    reassessmentDue?: unknown[]
    impactLog?: unknown[]
    trends?: TrendRow[]
  }
}

export interface AnonymizedData {
  anonymized?: {
    count?: number
    avgMastery?: number
    gapRate?: number
    giftedRate?: number
    anonymized?: boolean
    minGroupSize?: number
  } | null
  trends?: TrendRow[]
  policy?: { minGroupSize?: number; note?: string }
}

export interface LearningAnalyticsData {
  summary?: {
    students?: number
    withGaps?: number
    gifted?: number
    activeInterventions?: number
    alerts?: number
  }
  insights?: unknown[]
  activities?: unknown[]
}

export interface ImpactData {
  impact?: {
    interventions?: { active?: number; total?: number }
    feedbackCards?: { proposed?: number; approved?: number; inProgress?: number; completed?: number }
    cases?: { active?: number; total?: number }
    outreach?: { activities?: number; publications?: number }
    reassessmentDue?: unknown[]
  }
}

export interface AdminEngagementData {
  students?: Array<{
    studentId?: string
    name?: string
    engagement?: number | { todayMinutes?: number; totalMinutes?: number; minutes?: number }
    assignments?: number
    lessons?: number
  }>
  note?: string
}

export interface InterventionPlansData {
  plans?: unknown[]
  summary?: {
    total?: number
    active?: number
    reviewed?: number
    closed?: number
    dueReviews?: number
    byLevel?: { high?: number; medium?: number; low?: number }
  }
}

export interface LessonPlansData {
  plans?: unknown[]
  summary?: { total?: number; draft?: number; in_review?: number; published?: number }
}

export interface ThreadsData {
  threads?: unknown[]
  summary?: { total?: number; open?: number; closed?: number }
  /** Optional — only present when the backend exposes pending parent requests. */
  pendingRequests?: number
}

export interface GradesResultsData {
  results?: unknown[]
  summary?: { total?: number; success?: number; fail?: number; byClass?: unknown }
}

export interface TrendRow {
  period?: string
  students?: number
  withGaps?: number
  feedbackCards?: number
  interventions?: number
  activities?: number
  publications?: number
}

export interface ExecutiveData {
  overview: AdminOverviewData | null
  performance: AdminPerformanceData | null
  warnings: AdminWarningData | null
  systemStats: SystemStatsData | null
  impactReport: ImpactReportData | null
  anonymized: AnonymizedData | null
  learningAnalytics: LearningAnalyticsData | null
  impact: ImpactData | null
  engagement: AdminEngagementData | null
  interventionPlans: InterventionPlansData | null
  lessonPlans: LessonPlansData | null
  threads: ThreadsData | null
  gradesResults: GradesResultsData | null
  consentGranted?: number
}

const EMPTY_EXEC: ExecutiveData = {
  overview: null,
  performance: null,
  warnings: null,
  systemStats: null,
  impactReport: null,
  anonymized: null,
  learningAnalytics: null,
  impact: null,
  engagement: null,
  interventionPlans: null,
  lessonPlans: null,
  threads: null,
  gradesResults: null,
  consentGranted: undefined,
}

export { EMPTY_EXEC }

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

interface MiniStat {
  key: string
  label: string
  value: string
  hint: string
  icon: LucideIcon
  tone: string
  bar: string
  progress: number
  demo?: boolean
}

interface Props {
  data: ExecutiveData
  loading: boolean
  error: boolean
  locale: string
}

function cap(value: number | undefined, max: number): number {
  if (value === undefined || !Number.isFinite(value) || max <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)))
}

export default function ExecutiveDashboard({ data, loading, error, locale }: Props) {
  const { t } = useTranslation()

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) =>
    new Intl.NumberFormat(locale, options).format(value)

  const num = (value?: number | string | null): number | undefined => {
    if (value === undefined || value === null || value === '') return undefined
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  const asNum = (value?: number | string | null) => {
    const parsed = num(value)
    return parsed === undefined ? '—' : formatNumber(parsed)
  }
  const asRatio = (value?: number | string | null) => {
    const parsed = num(value)
    if (parsed === undefined) return '—'
    const ratio = Math.abs(parsed) <= 1 ? parsed : parsed / 100
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      maximumFractionDigits: 1,
    }).format(ratio)
  }
  const asScore = (value?: number | string | null) => {
    const parsed = num(value)
    return parsed === undefined
      ? '—'
      : formatNumber(parsed, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  }

  const {
    overview,
    performance,
    warnings,
    systemStats,
    impactReport,
    anonymized,
    learningAnalytics,
    impact,
    engagement,
    interventionPlans,
    lessonPlans,
    threads,
    gradesResults,
    consentGranted,
  } = data

  /* -- institution indicators ------------------------------------- */
  const stats = systemStats?.stats
  const classTotal =
    stats?.classes ?? overview?.levels?.reduce((sum, level) => sum + (level.classes ?? 0), 0)
  const gradeSummary = gradesResults?.summary
  const passRate =
    gradeSummary && num(gradeSummary.success) !== undefined && num(gradeSummary.fail) !== undefined
      ? ((num(gradeSummary.success) ?? 0) /
          Math.max(1, (num(gradeSummary.success) ?? 0) + (num(gradeSummary.fail) ?? 0))) *
        100
      : undefined
  const averages = (performance?.byLevel ?? [])
    .map((row) => num(row.average))
    .filter((value): value is number => value !== undefined)
  const avgScore = averages.length
    ? averages.reduce((sum, value) => sum + value, 0) / averages.length
    : undefined

  const miniStats: MiniStat[] = [
    {
      key: 'students',
      label: t('exStudents', { defaultValue: 'التلاميذ المسجّلون' }),
      value: asNum(overview?.studentsPresent ?? stats?.students ?? impactReport?.report?.summary?.totalStudents),
      hint: t('exStudentsHint', { defaultValue: 'الإجمالي على مستوى المؤسسة' }),
      icon: Users, tone: TONES.brand, bar: BARS.brand,
      progress: cap(num(overview?.studentsPresent ?? stats?.students), 600),
    },
    {
      key: 'classes',
      label: t('exClasses', { defaultValue: 'الأقسام' }),
      value: asNum(classTotal),
      hint: t('exClassesHint', { defaultValue: 'الأقسام والمستويات الدراسية' }),
      icon: BookOpenCheck, tone: TONES.brandSoft, bar: BARS.brandSoft,
      progress: cap(num(classTotal), 80),
    },
    {
      key: 'teachers',
      label: t('exTeachers', { defaultValue: 'الأساتذة' }),
      value: asNum(overview?.teachers),
      hint: t('exTeachersHint', { defaultValue: 'الطاقم التدريسي' }),
      icon: GraduationCap, tone: TONES.gold, bar: BARS.gold,
      progress: cap(num(overview?.teachers), 60),
    },
    {
      key: 'passRate',
      label: t('exPassRate', { defaultValue: 'نسبة النجاح' }),
      value: asRatio(passRate),
      hint: t('exPassRateHint', { defaultValue: 'من نتائج الدرجات إن توفّرت' }),
      icon: TrendingUp, tone: TONES.goldSoft, bar: BARS.goldSoft,
      progress: cap(passRate, 100),
    },
    {
      key: 'attendance',
      label: t('exAttendance', { defaultValue: 'حضور القسم' }),
      value: asRatio(overview?.attendanceRate),
      hint: t('exDemoIndicator', { defaultValue: 'مؤشر تجريبي — ليس رقمًا رسميًا' }),
      icon: CalendarCheck2, tone: TONES.gold, bar: BARS.gold,
      progress: cap(overview?.attendanceRate, 100),
      demo: true,
    },
    {
      key: 'average',
      label: t('exAverage', { defaultValue: 'المعدل العام' }),
      value: asScore(avgScore),
      hint: t('exAverageHint', { defaultValue: 'متوسط درجات المستويات' }),
      icon: TrendingUp, tone: TONES.goldSoft, bar: BARS.goldSoft,
      progress: cap(avgScore, 20),
    },
    {
      key: 'gaps',
      label: t('exWithGaps', { defaultValue: 'تلاميذ بحاجة دعم' }),
      value: asNum(overview?.withGaps ?? learningAnalytics?.summary?.withGaps),
      hint: t('exWithGapsHint', { defaultValue: 'فجوات تعلّمية — استشاري' }),
      icon: ShieldCheck, tone: TONES.brandSoft, bar: BARS.brandSoft,
      progress: cap(num(overview?.withGaps ?? learningAnalytics?.summary?.withGaps), num(overview?.studentsPresent ?? stats?.students) ?? 600),
    },
    {
      key: 'gifted',
      label: t('exGifted', { defaultValue: 'الموهوبون' }),
      value: asNum(overview?.gifted ?? learningAnalytics?.summary?.gifted),
      hint: t('exGiftedHint', { defaultValue: 'مؤشرات استشارية' }),
      icon: Sparkles, tone: TONES.gold, bar: BARS.gold,
      progress: cap(num(overview?.gifted ?? learningAnalytics?.summary?.gifted), 100),
    },
    {
      key: 'interventions',
      label: t('exInterventions', { defaultValue: 'تدخلات نشطة' }),
      value: asNum(overview?.activeInterventions ?? impact?.impact?.interventions?.active ?? learningAnalytics?.summary?.activeInterventions),
      hint: t('exInterventionsHint', { defaultValue: 'خطط دعم جارية' }),
      icon: ClipboardCheck, tone: TONES.brand, bar: BARS.brand,
      progress: cap(num(overview?.activeInterventions ?? impact?.impact?.interventions?.active), 100),
    },
    {
      key: 'cases',
      label: t('exCases', { defaultValue: 'حالات مفتوحة' }),
      value: asNum(overview?.activeCases ?? impact?.impact?.cases?.active),
      hint: t('exCasesHint', { defaultValue: 'حالات تحت المتابعة' }),
      icon: FileCheck2, tone: TONES.goldSoft, bar: BARS.goldSoft,
      progress: cap(num(overview?.activeCases ?? impact?.impact?.cases?.active), 50),
    },
    {
      key: 'feedback',
      label: t('exFeedbackPending', { defaultValue: 'بطاقات بانتظار المراجعة' }),
      value: asNum(overview?.feedbackPending),
      hint: t('exFeedbackHint', { defaultValue: 'تحتاج اعتمادًا بشريًا' }),
      icon: ClipboardCheck, tone: TONES.brandSoft, bar: BARS.brandSoft,
      progress: cap(num(overview?.feedbackPending), 100),
    },
    {
      key: 'reassess',
      label: t('exReassessDue', { defaultValue: 'إعادة تقييم مستحقة' }),
      value: asNum(overview?.reassessmentDue ?? impact?.impact?.reassessmentDue?.length ?? impactReport?.report?.reassessmentDue?.length),
      hint: t('exDue', { defaultValue: 'مستحقّة هذه الفترة' }),
      icon: CalendarCheck2, tone: TONES.gold, bar: BARS.gold,
      progress: cap(num(overview?.reassessmentDue), 100),
    },
    {
      key: 'audit',
      label: t('exAudit', { defaultValue: 'نشاط التدقيق' }),
      value: asNum(stats?.auditLogs ?? overview?.auditCount),
      hint: t('exAuditHint', { defaultValue: 'سجلّ العمليات الموثّقة' }),
      icon: Activity, tone: TONES.brand, bar: BARS.brand,
      progress: cap(num(stats?.auditLogs ?? overview?.auditCount), 1000),
    },
  ]

  /* -- mastery health --------------------------------------------- */
  const anon = anonymized?.anonymized
  const policyNote = anonymized?.policy?.note

  /* -- levels ------------------------------------------------------ */
  const levels = performance?.byLevel ?? []

  /* -- pipeline ---------------------------------------------------- */
  const feedbackCards = impact?.impact?.feedbackCards
  const planSummary = interventionPlans?.summary
  const riskCounts = { high: 0, medium: 0, low: 0 }
  for (const warning of warnings?.warnings ?? []) {
    const risk = String(warning.risk ?? warning.level ?? '').toLowerCase()
    if (risk.includes('high') || risk.includes('مرتفع') || risk === 'h') riskCounts.high += 1
    else if (risk.includes('med') || risk.includes('متوسط') || risk === 'm') riskCounts.medium += 1
    else if (risk.includes('low') || risk.includes('منخفض') || risk === 'l') riskCounts.low += 1
  }

  /* -- parallel learning ------------------------------------------ */
  const engagementStudents = engagement?.students ?? []
  const minutesOf = (value: NonNullable<AdminEngagementData['students']>[number]['engagement']) => {
    if (typeof value === 'number') return value
    return value?.todayMinutes ?? value?.totalMinutes ?? value?.minutes ?? 0
  }
  const minutesList = engagementStudents.map((student) => minutesOf(student.engagement))
  const activeStudents = engagementStudents.filter(
    (student, index) =>
      minutesList[index] > 0 || (student.lessons ?? 0) > 0 || (student.assignments ?? 0) > 0,
  ).length
  const avgMinutes = minutesList.length
    ? Math.round(minutesList.reduce((sum, minutes) => sum + minutes, 0) / minutesList.length)
    : 0
  const lessonsCompleted = engagementStudents.reduce(
    (sum, student) => sum + (student.lessons ?? 0),
    0,
  )

  /* -- governance -------------------------------------------------- */
  const lessonSummary = lessonPlans?.summary
  const threadSummary = threads?.summary

  /* -- trends ------------------------------------------------------ */
  const trendRows = impactReport?.report?.trends?.length
    ? impactReport.report.trends
    : anonymized?.trends ?? []

  // Only numeric, finite values from the real table feed the sparklines.
  const seriesValues = (key: 'students' | 'withGaps' | 'feedbackCards') =>
    trendRows.map((row) => {
      const value = row[key]
      return typeof value === 'number' && Number.isFinite(value) ? value : undefined
    })

  const advisory = t('exAdvisory', { defaultValue: 'مؤشرات استشارية — بمراجعة بشرية' })

  return (
    <div className="space-y-5">
      <section className="card-school p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-black">{t('exTitle', { defaultValue: 'لوحة المؤشرات التنفيذية' })}</h2>
            <p className="mt-1 text-xs font-semibold text-muted">
              {t('exHint', { defaultValue: 'نظرة مؤسسية شاملة تعتمد على بيانات الخدمات المتاحة.' })}
            </p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        {loading ? (
          <p className="mt-3 text-[11px] font-semibold text-muted">
            {t('exLoadingMore', { defaultValue: 'جارٍ تحميل مؤشرات المؤسسة...' })}
          </p>
        ) : null}
        {error ? (
          <p className="mt-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-3 text-[11px] font-bold text-[#E03131]">
            {t('exLoadMoreError', { defaultValue: 'تعذّر تحميل بعض مؤشرات المؤسسة؛ تُعرض البيانات المتاحة فقط.' })}
          </p>
        ) : null}
      </section>

      {/* 1. Institution indicators */}
      <section className="card-school p-5">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-brand-600" aria-hidden="true" />
          <h3 className="font-display text-base font-black">{t('exInstitution', { defaultValue: 'مؤشرات المؤسسة' })}</h3>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {miniStats.map(({ key, label, value, hint, icon: Icon, tone, bar, progress, demo }) => (
            <article key={key} className="rounded-card border-2 border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-extrabold text-muted">{label}</p>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tone}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-2 truncate font-display text-2xl font-black leading-none">{value}</p>
              {demo ? (
                <span className="mt-2 inline-flex rounded-full bg-gold-100 px-2 py-0.5 text-[9px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                  {t('exDemoIndicator', { defaultValue: 'مؤشر تجريبي' })}
                </span>
              ) : null}
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                <div className={`h-full rounded-full ${bar}`} style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-[10px] font-semibold leading-relaxed text-muted">{hint}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* 2. Mastery health */}
        <section className="card-school p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-600" aria-hidden="true" />
              <h3 className="font-display text-base font-black">{t('exMastery', { defaultValue: 'صحة التحصيل' })}</h3>
            </div>
            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[9px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
              {advisory}
            </span>
          </div>
          {anon ? (
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-card bg-surface-muted p-3 text-center">
                <p className="text-[10px] font-bold text-muted">{t('exAvgMastery', { defaultValue: 'متوسط التمكّن' })}</p>
                <p className="mt-1 font-display text-xl font-black">{asRatio(anon.avgMastery)}</p>
              </div>
              <div className="rounded-card bg-surface-muted p-3 text-center">
                <p className="text-[10px] font-bold text-muted">{t('exGapRate', { defaultValue: 'نسبة الفجوات' })}</p>
                <p className="mt-1 font-display text-xl font-black">{asRatio(anon.gapRate)}</p>
              </div>
              <div className="rounded-card bg-surface-muted p-3 text-center">
                <p className="text-[10px] font-bold text-muted">{t('exGiftedRate', { defaultValue: 'نسبة الموهوبين' })}</p>
                <p className="mt-1 font-display text-xl font-black">{asRatio(anon.giftedRate)}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-card border-2 border-line bg-surface-muted p-3 text-[11px] font-semibold text-muted">
              <ShieldCheck className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
              {t('exSuppressed', {
                defaultValue: policyNote ?? 'لا تظهر بيانات مجمّعة لصغر حجم المجموعة حسب سياسة الخصوصية.',
              })}
            </p>
          )}
          {policyNote ? (
            <p className="mt-3 text-[10px] font-semibold leading-relaxed text-muted">{policyNote}</p>
          ) : null}
        </section>

        {/* 3. Performance by level */}
        <section className="card-school p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gold-600" aria-hidden="true" />
            <h3 className="font-display text-base font-black">{t('exLevels', { defaultValue: 'توزيع المستويات' })}</h3>
          </div>
          {levels.length === 0 ? (
            <p className="mt-4 text-[11px] font-semibold text-muted">{t('exNoData', { defaultValue: 'لا توجد بيانات متاحة' })}</p>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-[9px] font-black uppercase text-muted">
                <span>{t('exLevel', { defaultValue: 'المستوى' })}</span>
                <span>{t('exCount', { defaultValue: 'العدد' })}</span>
                <span>{t('exAvgScore', { defaultValue: 'المعدل' })}</span>
              </div>
              {levels.map((row, index) => {
                const average = num(row.average)
                return (
                  <div key={`${row.level ?? 'level'}-${index}`}>
                    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 text-[11px] font-bold">
                      <span className="truncate">{row.level ?? '—'}</span>
                      <span className="text-muted">{asNum(row.students)}</span>
                      <span className="font-display font-black">{asScore(average)}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${cap(average, 20)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* 4. Intervention & card pipeline */}
      <section className="card-school p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
            <h3 className="font-display text-base font-black">{t('exPipeline', { defaultValue: 'حالة التدخلات والبطاقات' })}</h3>
          </div>
          <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[9px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
            {advisory}
          </span>
        </div>
        <p className="mt-3 text-[11px] font-extrabold text-muted">{t('exFeedback', { defaultValue: 'بطاقات التغذية الراجعة' })}</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { key: 'proposed', label: t('exProposed', { defaultValue: 'مقترحة' }), value: feedbackCards?.proposed, icon: FileCheck2, tone: TONES.goldSoft },
            { key: 'approved', label: t('exApproved', { defaultValue: 'معتمدة' }), value: feedbackCards?.approved, icon: ClipboardCheck, tone: TONES.brandSoft },
            { key: 'inProgress', label: t('exInProgress', { defaultValue: 'قيد الإنجاز' }), value: feedbackCards?.inProgress, icon: Clock3, tone: TONES.brand },
            { key: 'completed', label: t('exCompleted', { defaultValue: 'مكتملة' }), value: feedbackCards?.completed, icon: ClipboardCheck, tone: TONES.gold },
          ].map((tile) => (
            <div key={tile.key} className="flex items-center gap-2 rounded-card bg-surface-muted p-3">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tile.tone}`}>
                <tile.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-muted">{tile.label}</p>
                <p className="font-display text-lg font-black leading-none">{asNum(tile.value)}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] font-extrabold text-muted">{t('exInterventions', { defaultValue: 'خطط التدخل والحالات' })}</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {[
            { key: 'cases', label: t('exCases', { defaultValue: 'حالات نشطة' }), value: impact?.impact?.cases?.active, icon: FileCheck2 },
            { key: 'active', label: t('exActive', { defaultValue: 'نشطة' }), value: planSummary?.active, icon: Activity },
            { key: 'review', label: t('exReview', { defaultValue: 'تمت مراجعتها' }), value: planSummary?.reviewed, icon: ClipboardCheck },
            { key: 'closed', label: t('exClosed', { defaultValue: 'مغلقة' }), value: planSummary?.closed, icon: ClipboardCheck },
            { key: 'due', label: t('exDue', { defaultValue: 'مراجعات مستحقة' }), value: planSummary?.dueReviews, icon: CalendarCheck2 },
            { key: 'totalPlans', label: t('exCount', { defaultValue: 'الإجمالي' }), value: planSummary?.total, icon: BarChart3 },
          ].map((tile) => (
            <div key={tile.key} className="rounded-card border-2 border-line bg-surface p-3 text-center">
              <tile.icon className="mx-auto h-4 w-4 text-brand-600" aria-hidden="true" />
              <p className="mt-1 font-display text-lg font-black leading-none">{asNum(tile.value)}</p>
              <p className="mt-1 text-[10px] font-bold text-muted">{tile.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 dark:bg-gold-400/10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-gold-900 dark:text-gold-200">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {t('exRiskHigh', { defaultValue: 'مخاطر عالية' })}: {asNum(riskCounts.high)}
            </span>
            <span className="text-[10px] font-black text-gold-900 dark:text-gold-200">
              {t('exRiskMedium', { defaultValue: 'متوسطة' })}: {asNum(riskCounts.medium)}
            </span>
            <span className="text-[10px] font-black text-gold-900 dark:text-gold-200">
              {t('exRiskLow', { defaultValue: 'منخفضة' })}: {asNum(riskCounts.low)}
            </span>
          </div>
          {riskCounts.high > 0 ? (
            <p className="mt-2 text-[10px] font-bold text-[#E03131]">
              <AlertTriangle className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
              {t('exAdvisory', { defaultValue: 'تحتاج مؤشرات المخاطر تحقق المعلّم قبل أي إجراء.' })}
            </p>
          ) : null}
        </div>
      </section>

      {/* 5. Parallel learning */}
      <section className="card-school p-5">
        <div className="flex items-center gap-2">
          <Clock3 className="h-5 w-5 text-gold-600" aria-hidden="true" />
          <h3 className="font-display text-base font-black">{t('exParallel', { defaultValue: 'التعلّم الموازي' })}</h3>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-card bg-surface-muted p-4">
            <p className="text-[10px] font-bold text-muted">{t('exActiveStudents', { defaultValue: 'تلاميذ نشطون' })}</p>
            <p className="mt-1 font-display text-2xl font-black">{asNum(activeStudents)}</p>
          </div>
          <div className="rounded-card bg-surface-muted p-4">
            <p className="text-[10px] font-bold text-muted">{t('exMinutes', { defaultValue: 'متوسط الدقائق' })}</p>
            <p className="mt-1 font-display text-2xl font-black">{asNum(avgMinutes)}</p>
          </div>
          <div className="rounded-card bg-surface-muted p-4">
            <p className="text-[10px] font-bold text-muted">{t('exLessons', { defaultValue: 'دروس مكتملة' })}</p>
            <p className="mt-1 font-display text-2xl font-black">{asNum(lessonsCompleted)}</p>
          </div>
        </div>
        <p className="mt-3 rounded-card border-2 border-line bg-surface p-3 text-[11px] font-semibold text-muted">
          <BookOpenCheck className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
          {t('exSeparationNote', {
            defaultValue: 'زمن المنصة والواجبات منفصلان تمامًا عن حضور القسم ولا يُستخدمان بديلًا عنه.',
          })}
        </p>
      </section>

      {/* 6. Governance & privacy */}
      <section className="card-school p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-brand-600" aria-hidden="true" />
            <h3 className="font-display text-base font-black">{t('exGovernance', { defaultValue: 'الحوكمة والخصوصية' })}</h3>
          </div>
          <Link
            to="/admin/governance"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-[10px] font-black text-brand-700 transition hover:bg-brand-200 dark:bg-brand-400/15 dark:text-brand-300"
          >
            {t('exGovernance', { defaultValue: 'الحوكمة' })}
            <ArrowRight className="h-3 w-3 directional-icon" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-card border-2 border-line bg-surface p-3">
            <UsersRound className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <p className="mt-1 font-display text-lg font-black leading-none">{asNum(threads?.pendingRequests)}</p>
            <p className="mt-1 text-[10px] font-bold text-muted">{t('exPendingRequests', { defaultValue: 'طلبات أولياء الأمور' })}</p>
          </div>
          <div className="rounded-card border-2 border-line bg-surface p-3">
            <ShieldCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <p className="mt-1 font-display text-lg font-black leading-none">{asNum(consentGranted)}</p>
            <p className="mt-1 text-[10px] font-bold text-muted">{t('exConsent', { defaultValue: 'موافقة التواصل' })}</p>
          </div>
          <div className="rounded-card border-2 border-line bg-surface p-3">
            <BookOpenCheck className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <p className="mt-1 font-display text-lg font-black leading-none">{asNum(lessonSummary?.published)}</p>
            <p className="mt-1 text-[10px] font-bold text-muted">{t('exPublished', { defaultValue: 'دروس منشورة' })}</p>
          </div>
          <div className="rounded-card border-2 border-line bg-surface p-3">
            <Clock3 className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <p className="mt-1 font-display text-lg font-black leading-none">{asNum(lessonSummary?.draft)}</p>
            <p className="mt-1 text-[10px] font-bold text-muted">{t('exDraft', { defaultValue: 'مسوّدات' })}</p>
          </div>
          <div className="rounded-card border-2 border-line bg-surface p-3">
            <UsersRound className="h-4 w-4 text-brand-600" aria-hidden="true" />
            <p className="mt-1 font-display text-lg font-black leading-none">{asNum(threadSummary?.open)}</p>
            <p className="mt-1 text-[10px] font-bold text-muted">{t('exThreads', { defaultValue: 'نقاشات' })} — {t('exOpen', { defaultValue: 'مفتوحة' })}</p>
          </div>
        </div>
      </section>

      {/* 7. Trends */}
      <section className="card-school p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gold-600" aria-hidden="true" />
          <h3 className="font-display text-base font-black">{t('exTrends', { defaultValue: 'الاتجاهات' })}</h3>
        </div>
        {trendRows.length === 0 ? (
          <p className="mt-4 text-[11px] font-semibold text-muted">{t('exNoData', { defaultValue: 'لا توجد بيانات متاحة' })}</p>
        ) : (
          <>
          <div className="mt-4 grid gap-3 rounded-card border-2 border-line bg-surface-muted/40 p-4 sm:grid-cols-3">
            {([
              { key: 'students' as const, label: t('exStudents', { defaultValue: 'التلاميذ' }), tone: 'brand' as const },
              { key: 'withGaps' as const, label: t('exWithGaps', { defaultValue: 'الفجوات' }), tone: 'gold' as const },
              { key: 'feedbackCards' as const, label: t('exFeedback', { defaultValue: 'البطاقات' }), tone: 'brand' as const },
            ]).map((series) => (
              <div key={series.key}>
                <p className="text-[10px] font-black text-muted">{series.label}</p>
                <Sparkline
                  values={seriesValues(series.key)}
                  label={`${series.label} — ${t('exTrends', { defaultValue: 'الاتجاهات' })}`}
                  tone={series.tone}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] font-semibold text-muted">
            {t('exTrendVisualHint', {
              defaultValue: 'خطوط مبنية على قيم الجدول الفعلي؛ استرشادية وليست تنبؤًا.',
            })}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-start text-[11px]">
              <thead>
                <tr className="border-b-2 border-line text-muted">
                  <th className="p-2 text-start font-black">{t('exMonth', { defaultValue: 'الفترة' })}</th>
                  <th className="p-2 text-start font-black">{t('exStudents', { defaultValue: 'التلاميذ' })}</th>
                  <th className="p-2 text-start font-black">{t('exWithGaps', { defaultValue: 'الفجوات' })}</th>
                  <th className="p-2 text-start font-black">{t('exFeedback', { defaultValue: 'البطاقات' })}</th>
                  <th className="p-2 text-start font-black">{t('exInterventions', { defaultValue: 'التدخلات' })}</th>
                </tr>
              </thead>
              <tbody>
                {trendRows.map((row, index) => (
                  <tr key={`${row.period ?? 'period'}-${index}`} className="border-b border-line/60">
                    <td className="p-2 font-extrabold">{row.period ?? '—'}</td>
                    <td className="p-2">{asNum(row.students)}</td>
                    <td className="p-2">{asNum(row.withGaps)}</td>
                    <td className="p-2">{asNum(row.feedbackCards)}</td>
                    <td className="p-2">{asNum(row.interventions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </section>

      <p className="rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-[11px] font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
        {t('exAdvisory', {
          defaultValue:
            'كل المؤشرات استشارية ولا تُتخذ قرارات بشأن التلاميذ دون مراجعة واعتماد بشري. تُجمّع البيانات الحساسة ضمن حدود الخصوصية ولا تُعرض دون حدّ المجموعة المسموح.',
        })}
      </p>
    </div>
  )
}
