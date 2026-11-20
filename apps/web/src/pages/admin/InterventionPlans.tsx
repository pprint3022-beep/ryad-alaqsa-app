import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Filter,
  History,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react'
import { apiGet, extractApiError } from '../../lib/api'
import { useAuthStore } from '../../store/auth'

type RiskLevel = 'high' | 'medium' | 'low'
type PlanStatus = 'active' | 'reviewed' | 'closed'
type StatusFilter = 'all' | PlanStatus

interface PlanSource {
  warningId: string
  level: RiskLevel
  factors: string[]
  recommendedAction: string
  advisory: true
}

interface PlanWeek {
  id: string
  week: string
  actions: string[]
  reviewNotes: string
  progress: number
  reviewedAt: string
  reviewedBy: string
}

interface PlanHistoryEntry {
  at: string
  by: string
  action: string
  details: string
}

interface Plan {
  id: string
  studentId: string
  studentName: string
  className: string
  classId: string
  source: PlanSource | null
  goal: string
  indicator: string
  baseline: number
  target: number
  current: number
  unit: string
  ownerId: string
  ownerRole: string
  status: PlanStatus
  createdAt: string
  nextReview: string
  closedAt: string | null
  weeks: PlanWeek[]
  history: PlanHistoryEntry[]
}

interface PlanSummary {
  total: number
  active: number
  reviewed: number
  closed: number
  dueReviews: number
  byLevel: { high: number; medium: number; low: number }
}

interface PlansResponse {
  plans: Plan[]
  summary: PlanSummary
}

interface StudentOption {
  id: string
  name: string
  className?: string
}

const STATUSES: PlanStatus[] = ['active', 'reviewed', 'closed']

const EMPTY_SUMMARY: PlanSummary = {
  total: 0,
  active: 0,
  reviewed: 0,
  closed: 0,
  dueReviews: 0,
  byLevel: { high: 0, medium: 0, low: 0 },
}

const BADGE =
  'rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function resolveLocale(language?: string): string {
  if (language === 'ar') return 'ar-MA'
  if (language === 'amz') return 'fr'
  return language || 'ar-MA'
}

function formatDate(value: string | null | undefined, locale: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function unitSymbol(unit: string): string {
  if (unit === '%') return '%'
  if (unit === 'minutes') return 'min'
  if (unit === 'days') return 'd'
  return ''
}

function formatValue(value: number, unit: string): string {
  const numeric = Number.isFinite(Number(value)) ? Number(value) : 0
  const rounded = Number.isInteger(numeric) ? numeric : Math.round(numeric * 10) / 10
  const symbol = unitSymbol(unit)
  if (!symbol) return `${rounded}`
  return symbol === '%' ? `${rounded}%` : `${rounded} ${symbol}`
}

function progressOf(plan: Plan): number {
  const baseline = Number(plan.baseline) || 0
  const target = Number(plan.target) || 0
  const current = Number(plan.current) || 0
  if (plan.unit === '%') return clamp(current, 0, 100)
  if (target === baseline) return current >= target ? 100 : 0
  return clamp(((current - baseline) / (target - baseline)) * 100, 0, 100)
}

function statusKey(status: string): string {
  if (status === 'reviewed') return 'ipStatusReviewed'
  if (status === 'closed') return 'ipStatusClosed'
  return 'ipStatusActive'
}

function statusDefault(status: string): string {
  if (status === 'reviewed') return 'تمت مراجعتها'
  if (status === 'closed') return 'مغلقة'
  return 'نشطة'
}

function statusBadgeClass(status: string): string {
  if (status === 'active') {
    return 'bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
  }
  if (status === 'reviewed') {
    return 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
  }
  return 'bg-surface-muted text-muted'
}

function levelKey(level: string): string {
  if (level === 'high') return 'levelHigh'
  if (level === 'medium') return 'levelMedium'
  return 'levelLow'
}

function levelDefault(level: string): string {
  if (level === 'high') return 'مرتفع'
  if (level === 'medium') return 'متوسط'
  return 'منخفض'
}

const INDICATOR_KEY: Record<string, string> = {
  attendance: 'enumAttendance',
  homework: 'enumHomework',
  mood: 'enumMood',
  practice: 'enumPractice',
  engagement: 'enumEngagement',
}

const INDICATOR_DEFAULT: Record<string, string> = {
  attendance: 'حضور القسم',
  homework: 'الواجبات',
  mood: 'المزاج',
  practice: 'التدريب',
  engagement: 'زمن المنصة',
}

const ACTION_KEY: Record<string, string> = {
  created: 'enumCreated',
  updated: 'enumUpdated',
  submitted: 'enumSubmitted',
  published: 'enumPublished',
  closed: 'enumClosed',
  weekly_review: 'enumWeeklyReview',
  read: 'enumRead',
  decide: 'enumDecided',
  decided: 'enumDecided',
  reply: 'enumReply',
}

const ACTION_DEFAULT: Record<string, string> = {
  created: 'أُنشئ',
  updated: 'حُدّث',
  submitted: 'أُرسل',
  published: 'منشورة',
  closed: 'مغلقة',
  weekly_review: 'مراجعة أسبوعية',
  read: 'قراءة',
  decide: 'قرار',
  decided: 'قرار',
  reply: 'رد',
}

const ROLE_KEY: Record<string, string> = {
  teacher: 'enumTeacher',
  director: 'enumDirector',
  deputy: 'enumDeputy',
  supervisor: 'enumSupervisor',
  clerk: 'enumClerk',
  admin: 'enumAdmin',
  parent: 'enumParent',
}

const ROLE_DEFAULT: Record<string, string> = {
  teacher: 'المعلم',
  director: 'المدير',
  deputy: 'النائب',
  supervisor: 'المشرف',
  clerk: 'الموظف',
  admin: 'الإدارة',
  parent: 'ولي الأمر',
}

function normalizedKey(value: string, map: Record<string, string>): string {
  return map[String(value ?? '').toLowerCase()] ?? 'enumOther'
}

function normalizedDefault(value: string, map: Record<string, string>): string {
  return map[String(value ?? '').toLowerCase()] ?? value
}

function levelBadgeClass(level: string): string {
  if (level === 'high') {
    return 'rounded-full bg-[#E03131]/10 px-2 py-0.5 text-[10px] font-black text-[#b42318] dark:bg-[#E03131]/15 dark:text-[#ff8787]'
  }
  if (level === 'medium') {
    return 'rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
  }
  return BADGE
}

function Kpi({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <article className="card-school p-4">
      <p className="text-xs font-extrabold text-muted">{label}</p>
      <p className={`mt-2 font-display text-2xl font-black leading-none tabular-nums ${tone}`}>
        {value}
      </p>
    </article>
  )
}

function PlanCard({
  plan,
  open,
  locale,
  onToggle,
}: {
  plan: Plan
  open: boolean
  locale: string
  onToggle: () => void
}) {
  const { t } = useTranslation()
  const weeks = plan.weeks ?? []
  const history = plan.history ?? []
  const source = plan.source ?? null
  const progress = progressOf(plan)

  return (
    <article className="card-school overflow-hidden">
      <div className="p-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-2 text-start"
        >
          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <UserRound className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span className="truncate text-sm font-extrabold text-content">
                {plan.studentName || plan.studentId}
              </span>
            </span>
            <span className="mt-1 block truncate text-[11px] font-semibold text-muted">
              {[plan.className, plan.classId].filter(Boolean).join(' · ') || '—'}
            </span>
          </span>
          <span className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
            {source ? (
              <span className={levelBadgeClass(source.level)}>
                {t(levelKey(source.level), { defaultValue: levelDefault(source.level) })}
              </span>
            ) : null}
            <span className={`${BADGE} ${statusBadgeClass(plan.status)}`}>
              {t(statusKey(plan.status), { defaultValue: statusDefault(plan.status) })}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </span>
        </button>

        <div className="mt-3 rounded-card border-2 border-line bg-surface-muted p-2.5">
          <p className="text-[10px] font-black text-muted">
            {t('ipGoalLabel', { defaultValue: 'الهدف القابل للقياس' })}
          </p>
          <p className="mt-1 break-words text-xs font-extrabold text-content">{plan.goal || '—'}</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-card border-2 border-line bg-surface p-2.5">
            <p className="text-[10px] font-black text-muted">
              {t('ipIndicatorLabel', { defaultValue: 'المؤشر' })}
            </p>
            <p className="mt-1 break-words text-[11px] font-extrabold text-content">
              {plan.indicator
                ? t(normalizedKey(plan.indicator, INDICATOR_KEY), {
                    defaultValue: normalizedDefault(plan.indicator, INDICATOR_DEFAULT),
                  })
                : '—'}
            </p>
          </div>
          <div className="rounded-card border-2 border-line bg-surface p-2.5">
            <p className="text-[10px] font-black text-muted">
              {t('ipOwnerLabel', { defaultValue: 'المسؤول' })}
            </p>
            <p className="mt-1 break-words text-[11px] font-extrabold text-content">
              {[
                plan.ownerRole
                  ? t(normalizedKey(plan.ownerRole, ROLE_KEY), {
                      defaultValue: normalizedDefault(plan.ownerRole, ROLE_DEFAULT),
                    })
                  : '',
                plan.ownerId ? `${t('enumId', { defaultValue: 'المعرّف' })}: ${plan.ownerId}` : '',
              ].filter(Boolean).join(' · ') || '—'}
            </p>
          </div>
          <div className="rounded-card border-2 border-line bg-surface p-2.5">
            <p className="text-[10px] font-black text-muted">
              {t('ipNextReviewLabel', { defaultValue: 'الموعد التالي للمراجعة' })}
            </p>
            <p className="mt-1 text-[11px] font-extrabold text-content">
              {formatDate(plan.nextReview, locale)}
            </p>
          </div>
          <div className="rounded-card border-2 border-line bg-surface p-2.5">
            <p className="text-[10px] font-black text-muted">
              {t('ipSourceLabel', { defaultValue: 'السياق الاسترشادي' })}
            </p>
            <p className="mt-1">
              {source ? (
                <span className={levelBadgeClass(source.level)}>
                  {t(levelKey(source.level), { defaultValue: levelDefault(source.level) })}
                </span>
              ) : (
                <span className="text-[11px] font-extrabold text-muted">—</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-card border-2 border-line bg-surface-muted p-2.5 text-center">
            <p className="text-[10px] font-black text-muted">
              {t('ipBaselineLabel', { defaultValue: 'خط الأساس' })}
            </p>
            <p className="mt-1 font-display text-lg font-black tabular-nums text-content">
              {formatValue(plan.baseline, plan.unit)}
            </p>
          </div>
          <div className="rounded-card border-2 border-line bg-surface-muted p-2.5 text-center">
            <p className="text-[10px] font-black text-muted">
              {t('ipTargetLabel', { defaultValue: 'الهدف' })}
            </p>
            <p className="mt-1 font-display text-lg font-black tabular-nums text-content">
              {formatValue(plan.target, plan.unit)}
            </p>
          </div>
          <div className="rounded-card border-2 border-brand-300 bg-brand-soft p-2.5 text-center dark:border-brand-400/30 dark:bg-brand-400/10">
            <p className="text-[10px] font-black text-brand-800 dark:text-brand-200">
              {t('ipCurrentLabel', { defaultValue: 'القيمة الحالية' })}
            </p>
            <p className="mt-1 font-display text-lg font-black tabular-nums text-brand-700 dark:text-brand-300">
              {formatValue(plan.current, plan.unit)}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
            <span className="flex items-center gap-1.5 text-muted">
              <Target className="h-3.5 w-3.5" aria-hidden="true" />
              {t('ipProgress', { defaultValue: 'نسبة التقدّم' })}
            </span>
            <span className="tabular-nums text-brand-700 dark:text-brand-300">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="font-black">
            {t('ipNextReviewLabel', { defaultValue: 'الموعد التالي للمراجعة' })}:
          </span>
          {formatDate(plan.nextReview, locale)}
        </p>
      </div>

      {open ? (
        <div className="space-y-4 border-t-2 border-line bg-surface-muted/40 p-4 text-xs">
          {source ? (
            <div className="rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[11px] font-black">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  {t('ipSourceLabel', { defaultValue: 'السياق الاسترشادي' })}
                </p>
                <span className={levelBadgeClass(source.level)}>
                  {t(levelKey(source.level), { defaultValue: levelDefault(source.level) })}
                </span>
              </div>
              {source.factors?.length ? (
                <div className="mt-2">
                  <p className="text-[10px] font-black">
                    {t('ipFactors', { defaultValue: 'العوامل' })}
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {source.factors.map((factor, index) => (
                      <li
                        key={`${factor}-${index}`}
                        className="rounded-full border-2 border-line bg-surface/70 px-2 py-0.5 text-[10px] font-bold text-content"
                      >
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-2">
                <p className="text-[10px] font-black">
                  {t('ipRecommended', { defaultValue: 'إجراء مقترح (استرشادي)' })}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold">
                  {source.recommendedAction || '—'}
                </p>
              </div>
            </div>
          ) : null}

          <div>
            <h4 className="flex items-center gap-2 text-xs font-black text-content">
              <CalendarDays className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {t('ipWeeks', { defaultValue: 'المراجعات الأسبوعية' })}
              <span className="text-[11px] font-bold text-muted">({weeks.length})</span>
            </h4>
            {weeks.length ? (
              <ol className="mt-2 space-y-2">
                {weeks.map((week, index) => (
                  <li
                    key={`${week.id}-${index}`}
                    className="rounded-card border-2 border-line bg-surface p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-brand-700 dark:text-brand-300">
                        {t('ipWeekLabel', { defaultValue: 'الأسبوع' })} {week.week} ·{' '}
                        {formatDate(week.reviewedAt, locale)}
                      </span>
                      <span className={BADGE}>{Math.round(Number(week.progress) || 0)}%</span>
                    </div>
                    {week.actions?.length ? (
                      <div className="mt-2">
                        <p className="text-[10px] font-black text-muted">
                          {t('ipWeekActions', { defaultValue: 'الإجراءات' })}
                        </p>
                        <ul className="mt-1 list-disc space-y-0.5 ps-4 text-[11px] font-semibold leading-relaxed text-content">
                          {week.actions.map((action, actionIndex) => (
                            <li key={`${action}-${actionIndex}`}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {week.reviewNotes ? (
                      <p className="mt-2 text-[11px] font-semibold leading-relaxed text-muted">
                        <span className="font-black">
                          {t('ipReviewNotes', { defaultValue: 'ملاحظات المراجعة' })}:
                        </span>{' '}
                        {week.reviewNotes}
                      </p>
                    ) : null}
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-card bg-surface-muted px-2 py-1 text-[10px] font-bold">
                      <span className="text-muted">
                        {t('ipReviewProgress', { defaultValue: 'التقدّم (0-100)' })}
                      </span>
                      <span className="tabular-nums text-brand-700 dark:text-brand-300">
                        {Math.round(Number(week.progress) || 0)}%
                      </span>
                    </div>
                    {week.reviewedBy ? (
                      <p className="mt-1 text-[10px] font-semibold text-muted">
                        {week.reviewedBy}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 rounded-card border-2 border-dashed border-line bg-surface p-3 text-[11px] font-semibold text-muted">
                {t('ipNoWeeks', { defaultValue: 'لا توجد مراجعات أسبوعية بعد.' })}
              </p>
            )}
          </div>

          <div className="border-t-2 border-line pt-3">
            <h4 className="flex items-center gap-2 text-xs font-black text-content">
              <History className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {t('ipAuditing', { defaultValue: 'سجل التغييرات' })}
            </h4>
            {history.length ? (
              <ol className="mt-2 space-y-2">
                {history.map((entry, index) => (
                  <li
                    key={`${entry.at}-${index}`}
                    className="rounded-card border-2 border-line bg-surface p-2.5 text-[11px] font-semibold"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-black text-content">
                        {entry.action
                          ? t(normalizedKey(entry.action, ACTION_KEY), {
                              defaultValue: normalizedDefault(entry.action, ACTION_DEFAULT),
                            })
                          : '—'}
                      </span>
                      <span className="text-[10px] font-semibold text-muted">
                        {formatDate(entry.at, locale)}
                      </span>
                    </div>
                    <p className="mt-1 text-[10px] font-semibold text-muted">{entry.by || '—'}</p>
                    {entry.details ? (
                      <p className="mt-1 leading-relaxed text-muted">{entry.details}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 rounded-card border-2 border-dashed border-line bg-surface p-3 text-[11px] font-semibold text-muted">
                {t('ipNoAudit', { defaultValue: 'لا توجد تغييرات مسجّلة.' })}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </article>
  )
}

export default function InterventionPlans() {
  const { t, i18n } = useTranslation()
  const role = useAuthStore((state) => state.user?.role)
  const locale = resolveLocale(i18n.resolvedLanguage)

  const [plans, setPlans] = useState<Plan[]>([])
  const [summary, setSummary] = useState<PlanSummary>(EMPTY_SUMMARY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [studentId, setStudentId] = useState('')
  const [studentDirectory, setStudentDirectory] = useState<Record<string, StudentOption>>({})
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setError('')

    const params: Record<string, string> = {}
    if (statusFilter !== 'all') params.status = statusFilter
    if (studentId) params.studentId = studentId

    apiGet<PlansResponse>('/admin/intervention-plans', {
      params,
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        const rows = Array.isArray(data.plans) ? data.plans : []
        setPlans(rows)

        const incoming = data.summary
        setSummary({
          total: Number(incoming?.total) || 0,
          active: Number(incoming?.active) || 0,
          reviewed: Number(incoming?.reviewed) || 0,
          closed: Number(incoming?.closed) || 0,
          dueReviews: Number(incoming?.dueReviews) || 0,
          byLevel: {
            high: Number(incoming?.byLevel?.high) || 0,
            medium: Number(incoming?.byLevel?.medium) || 0,
            low: Number(incoming?.byLevel?.low) || 0,
          },
        })

        setStudentDirectory((current) => {
          const next = { ...current }
          rows.forEach((plan) => {
            if (!plan.studentId) return
            next[plan.studentId] = {
              id: plan.studentId,
              name: plan.studentName || plan.studentId,
              className: plan.className || undefined,
            }
          })
          return next
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(
          extractApiError(err)?.message ||
            t('ipAdminLoadError', {
              defaultValue: 'تعذّر تحميل لوحة الإشراف. يرجى المحاولة مرة أخرى.',
            }),
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, statusFilter, studentId, t])

  const students = useMemo(
    () =>
      Object.values(studentDirectory).sort((a, b) => a.name.localeCompare(b.name, locale)),
    [studentDirectory, locale],
  )

  const number = (value: number): string =>
    new Intl.NumberFormat(locale).format(Number.isFinite(value) ? value : 0)

  const toggle = (id: string) => {
    setOpenIds((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('ipPlans', { defaultValue: 'خطط التدخل' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('ipAdminTitle', { defaultValue: 'إشراف خطط التدخل' })}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-white/80">
              {t('ipAdminHint', {
                defaultValue:
                  'نظرة شاملة على خطط التدخل التي يصيغها المعلمون، مع مؤشرات المتابعة والمراجعات المستحقة.',
              })}
            </p>
            {role ? (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black text-white/90">
                <ClipboardList className="h-3 w-3" aria-hidden="true" />
                <span>{t(normalizedKey(role, ROLE_KEY), { defaultValue: normalizedDefault(role, ROLE_DEFAULT) })}</span>
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={loading}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
            aria-label={t('ipRefresh', { defaultValue: 'تحديث' })}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{t('ipRefresh', { defaultValue: 'تحديث' })}</span>
          </button>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-card border-2 border-gold-300 bg-gold-50 p-4 text-xs font-bold text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck
          className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 dark:text-gold-300"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-black">{t('ipAdvisory', { defaultValue: 'تنبيه استرشادي' })}</p>
          <p className="mt-1 leading-relaxed">
            {t('ipAdvisoryNote', {
              defaultValue:
                'إشارات الإنذار المبكر استرشادية فقط. كل خطة وإجراء يكتبه المعلم بقرار بشري موثّق، ولا يتخذ النظام أي قرار آلي.',
            })}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('ipAdminLoading', { defaultValue: 'جارٍ تحميل لوحة الإشراف...' })}
        </div>
      ) : error ? (
        <div className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
          <p
            role="alert"
            className="flex items-start gap-2 text-sm font-bold text-[#b42318] dark:text-[#ff8787]"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('ipRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : (
        <>
          <section
            aria-label={t('ipPlans', { defaultValue: 'خطط التدخل' })}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            <Kpi
              label={t('ipTotalPlans', { defaultValue: 'إجمالي الخطط' })}
              value={number(summary.total)}
              tone="text-content"
            />
            <Kpi
              label={t('ipActivePlans', { defaultValue: 'خطط نشطة' })}
              value={number(summary.active)}
              tone="text-brand-700 dark:text-brand-300"
            />
            <Kpi
              label={t('ipReviewedPlans', { defaultValue: 'خطط تمت مراجعتها' })}
              value={number(summary.reviewed)}
              tone="text-gold-700 dark:text-gold-300"
            />
            <Kpi
              label={t('ipClosedPlans', { defaultValue: 'خطط مغلقة' })}
              value={number(summary.closed)}
              tone="text-muted"
            />
            <Kpi
              label={t('ipDueReviews', { defaultValue: 'مراجعات مستحقة' })}
              value={number(summary.dueReviews)}
              tone="text-[#b42318] dark:text-[#ff8787]"
            />
          </section>

          <section className="card-school p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-sm font-black">
                <AlertTriangle className="h-4 w-4 text-gold-600" aria-hidden="true" />
                {t('ipByLevel', { defaultValue: 'حسب مستوى الخطورة' })}
              </h2>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-card border-2 border-line bg-surface-muted p-2.5 text-center">
                <p className="text-[10px] font-black text-muted">
                  {t('levelHigh', { defaultValue: 'مرتفع' })}
                </p>
                <p className="mt-1 font-display text-xl font-black tabular-nums text-[#b42318] dark:text-[#ff8787]">
                  {number(summary.byLevel.high)}
                </p>
              </div>
              <div className="rounded-card border-2 border-line bg-surface-muted p-2.5 text-center">
                <p className="text-[10px] font-black text-muted">
                  {t('levelMedium', { defaultValue: 'متوسط' })}
                </p>
                <p className="mt-1 font-display text-xl font-black tabular-nums text-gold-700 dark:text-gold-300">
                  {number(summary.byLevel.medium)}
                </p>
              </div>
              <div className="rounded-card border-2 border-line bg-surface-muted p-2.5 text-center">
                <p className="text-[10px] font-black text-muted">
                  {t('levelLow', { defaultValue: 'منخفض' })}
                </p>
                <p className="mt-1 font-display text-xl font-black tabular-nums text-brand-700 dark:text-brand-300">
                  {number(summary.byLevel.low)}
                </p>
              </div>
            </div>
          </section>

          <section className="card-school p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-black">
              <Filter className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {t('ipPlans', { defaultValue: 'خطط التدخل' })}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              <select
                aria-label={t('ipPlans', { defaultValue: 'خطط التدخل' })}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="input-school text-sm"
              >
                <option value="all">{t('ipPlans', { defaultValue: 'خطط التدخل' })}</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {t(statusKey(status), { defaultValue: statusDefault(status) })}
                  </option>
                ))}
              </select>
              <select
                aria-label={t('ipPlans', { defaultValue: 'خطط التدخل' })}
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                className="input-school text-sm"
              >
                <option value="">{t('ipPlans', { defaultValue: 'خطط التدخل' })}</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {[student.name, student.className].filter(Boolean).join(' · ')}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-display text-lg font-black text-content">
              <Target className="h-5 w-5 text-brand-600" aria-hidden="true" />
              {t('ipPlans', { defaultValue: 'خطط التدخل' })}
              <span className="text-xs font-bold text-muted">({number(plans.length)})</span>
            </h2>
            {plans.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    open={Boolean(openIds[plan.id])}
                    locale={locale}
                    onToggle={() => toggle(plan.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-card border-2 border-dashed border-line bg-surface-muted p-8 text-center text-sm font-bold text-muted">
                {t('ipNoPlansAdmin', { defaultValue: 'لا توجد خطط تدخل لعرضها.' })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
