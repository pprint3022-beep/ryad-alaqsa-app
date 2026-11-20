import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  History,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'
import { useAuthStore } from '../../store/auth'

type RiskLevel = 'high' | 'medium' | 'low'
type PlanStatus = 'active' | 'reviewed' | 'closed'

const UNIT_OPTIONS = [
  { value: '%', display: '%', key: 'enumPercentUnit' },
  { value: 'minutes', display: 'min', key: 'enumMinutesUnit' },
  { value: 'days', display: 'd', key: 'enumDaysUnit' },
  { value: 'count', display: '#', key: 'enumCountUnit' },
] as const

type Unit = (typeof UNIT_OPTIONS)[number]['value']

interface WarningItem {
  id?: string
  studentId: string
  studentName: string
  className: string
  risk: number
  level: RiskLevel
  factors: string[]
  recommendedAction: string
  urgency: string
  existingPlanId: string | null
}

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
  studentName?: string
  className?: string
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

interface WarningsResponse {
  warnings: WarningItem[]
  total?: number
}

interface PlansResponse {
  plans: Plan[]
  meta?: { statuses: string[]; indicators: string[] }
}

interface PlanResponse {
  plan: Plan
}

interface CreatePlanBody {
  studentId: string
  goal: string
  indicator: string
  baseline: number
  target: number
  unit: string
  nextReview: string
  actions: string[]
  sourceWarningId?: string
}

interface WeekBody {
  id: string
  actions: string[]
  reviewNotes: string
  progress: number
  nextReview?: string
}

interface UpdateBody {
  id: string
  status?: PlanStatus
  target?: number
  nextReview?: string
  reviewNotes?: string
}

const BADGE =
  'rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300'

const INDICATOR_KEYS: Record<string, string> = {
  attendance: 'enumAttendance',
  homework: 'enumHomework',
  mood: 'enumMood',
  practice: 'enumPractice',
  engagement: 'enumEngagement',
}

const INDICATOR_DEFAULTS: Record<string, string> = {
  attendance: 'حضور القسم',
  homework: 'الواجبات',
  mood: 'المزاج والرفاه',
  practice: 'التدريب والتقويمات',
  engagement: 'زمن المنصة',
}

const ROLE_KEYS: Record<string, string> = {
  teacher: 'enumTeacher',
  director: 'enumDirector',
  deputy: 'enumDeputy',
  supervisor: 'enumSupervisor',
  clerk: 'enumClerk',
  admin: 'enumAdmin',
  parent: 'enumParent',
  student: 'enumStudent',
}

const ROLE_DEFAULTS: Record<string, string> = {
  teacher: 'المعلم',
  director: 'المدير',
  deputy: 'نائب المدير',
  supervisor: 'المشرف',
  clerk: 'الكاتب',
  admin: 'المسؤول',
  parent: 'ولي الأمر',
  student: 'التلميذ',
}

const ACTION_KEYS: Record<string, string> = {
  created: 'enumCreated',
  updated: 'enumUpdated',
  submitted: 'enumSubmitted',
  published: 'enumPublished',
  closed: 'enumClosed',
  weekly_review: 'enumWeeklyReview',
  read: 'enumRead',
  decide: 'enumDecided',
  reply: 'enumReply',
}

const ACTION_DEFAULTS: Record<string, string> = {
  created: 'أُنشئت',
  updated: 'حُدّثت',
  submitted: 'أُرسلت',
  published: 'نُشرت',
  closed: 'أُغلقت',
  weekly_review: 'مراجعة أسبوعية',
  read: 'مقروءة',
  decide: 'قرار',
  reply: 'رد',
}

function messageOf(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

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

function riskPercent(risk: number): number {
  return Math.round(clamp(Number(risk) || 0, 0, 1) * 100)
}

type TFunc = ReturnType<typeof useTranslation>['t']

function unitSymbol(t: TFunc, unit: string): string {
  if (unit === '%') return t('enumPercentUnit', { defaultValue: '%' })
  if (unit === 'minutes') return t('enumMinutesUnit', { defaultValue: 'min' })
  if (unit === 'days') return t('enumDaysUnit', { defaultValue: 'd' })
  if (unit === 'count') return t('enumCountUnit', { defaultValue: '#' })
  return ''
}

function formatValue(t: TFunc, value: number, unit: string): string {
  const numeric = Number.isFinite(Number(value)) ? Number(value) : 0
  const rounded = Number.isInteger(numeric) ? numeric : Math.round(numeric * 10) / 10
  const symbol = unitSymbol(t, unit)
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

function levelBadgeClass(level: string): string {
  if (level === 'high') {
    return 'rounded-full bg-[#E03131]/10 px-2 py-0.5 text-[10px] font-black text-[#E03131] dark:text-[#ff8787]'
  }
  if (level === 'medium') {
    return 'rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
  }
  return BADGE
}

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div
      className={`rounded-card border-2 p-4 text-sm font-bold ${
        error
          ? 'border-[#E03131]/30 bg-[#E03131]/10 text-[#E03131] dark:text-[#ff8787]'
          : 'border-line bg-surface-muted text-muted'
      }`}
    >
      {children}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-4 text-xs font-semibold text-muted">
      {text}
    </p>
  )
}

interface PlanCardProps {
  plan: Plan
  canManage: boolean
  onChanged: () => void
}

function PlanCard({ plan, canManage, onChanged }: PlanCardProps) {
  const { t, i18n } = useTranslation()
  const locale = resolveLocale(i18n.resolvedLanguage)

  const [weekActions, setWeekActions] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')
  const [reviewProgress, setReviewProgress] = useState(String(Math.round(Number(plan.current) || 0)))
  const [nextReview, setNextReview] = useState('')
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [savingReview, setSavingReview] = useState(false)

  const [closingOpen, setClosingOpen] = useState(false)
  const [closeNotes, setCloseNotes] = useState('')
  const [closeError, setCloseError] = useState<string | null>(null)
  const [closeSuccess, setCloseSuccess] = useState(false)
  const [closing, setClosing] = useState(false)

  const closed = plan.status === 'closed'
  const progress = progressOf(plan)
  const weeks = plan.weeks ?? []
  const source = plan.source ?? null
  const indicatorKey = INDICATOR_KEYS[plan.indicator]

  const addReview = async () => {
    setReviewError(null)
    setReviewSuccess(false)
    const notes = reviewNotes.trim()
    const progressValue = Number(reviewProgress)
    if (
      !notes ||
      reviewProgress.trim() === '' ||
      !Number.isFinite(progressValue) ||
      progressValue < 0 ||
      progressValue > 100
    ) {
      setReviewError(t('ipRequiredFields', { defaultValue: 'يرجى تعبئة الحقول المطلوبة.' }))
      return
    }

    const actionList = weekActions
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    setSavingReview(true)
    try {
      await apiPost<PlanResponse, WeekBody>('/teacher/intervention-plans/week', {
        id: plan.id,
        actions: actionList,
        reviewNotes: notes,
        progress: progressValue,
        ...(nextReview ? { nextReview } : {}),
      })
      setWeekActions('')
      setReviewNotes('')
      setNextReview('')
      setReviewProgress(String(progressValue))
      setReviewSuccess(true)
      onChanged()
    } catch (err: unknown) {
      setReviewError(
        messageOf(
          err,
          t('ipReviewFailed', {
            defaultValue: 'تعذّر تسجيل المراجعة. يرجى المحاولة مرة أخرى.',
          }),
        ),
      )
    } finally {
      setSavingReview(false)
    }
  }

  const closePlan = async () => {
    setCloseError(null)
    setCloseSuccess(false)
    const notes = closeNotes.trim()
    if (!notes) {
      setCloseError(t('ipRequiredFields', { defaultValue: 'يرجى تعبئة الحقول المطلوبة.' }))
      return
    }

    setClosing(true)
    try {
      await apiPost<PlanResponse, UpdateBody>('/teacher/intervention-plans/update', {
        id: plan.id,
        status: 'closed',
        reviewNotes: notes,
      })
      setCloseNotes('')
      setClosingOpen(false)
      setCloseSuccess(true)
      onChanged()
    } catch (err: unknown) {
      setCloseError(
        messageOf(
          err,
          t('ipCloseFailed', { defaultValue: 'تعذّر إغلاق الخطة.' }),
        ),
      )
    } finally {
      setClosing(false)
    }
  }

  return (
    <article className="card-school p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-black text-content">
            {plan.studentName || plan.studentId}
          </h3>
          <p className="mt-0.5 text-[11px] font-semibold text-muted">
            {[plan.className, plan.classId].filter(Boolean).join(' · ') || '—'}
          </p>
        </div>
        <span className={closed ? 'rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-black text-muted' : BADGE}>
          {t(statusKey(plan.status), { defaultValue: statusDefault(plan.status) })}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-card border-2 border-line bg-surface-muted p-3 sm:col-span-2">
          <p className="text-[10px] font-black text-muted">{t('ipGoalLabel', { defaultValue: 'الهدف القابل للقياس' })}</p>
          <p className="mt-1 text-sm font-extrabold text-content">{plan.goal || '—'}</p>
        </div>
        <div className="rounded-card border-2 border-line bg-surface p-3">
          <p className="text-[10px] font-black text-muted">
            {t('ipIndicatorLabel', { defaultValue: 'المؤشر' })}
          </p>
          <p className="mt-1 text-xs font-bold text-content">
            {indicatorKey
              ? t(indicatorKey, { defaultValue: INDICATOR_DEFAULTS[plan.indicator] || plan.indicator })
              : plan.indicator || '—'}
          </p>
        </div>
        <div className="rounded-card border-2 border-line bg-surface p-3">
          <p className="text-[10px] font-black text-muted">
            {t('ipOwnerLabel', { defaultValue: 'المسؤول' })}
          </p>
          <p className="mt-1 text-xs font-bold text-content">
            {t(ROLE_KEYS[plan.ownerRole] || 'enumTeacher', {
              defaultValue: ROLE_DEFAULTS[plan.ownerRole] || 'المعلم',
            })}{' '}
            · {t('enumId', { defaultValue: 'المعرّف' })}: {plan.ownerId || '—'}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-card border-2 border-line bg-surface-muted p-3 text-center">
          <p className="text-[10px] font-black text-muted">
            {t('ipBaselineLabel', { defaultValue: 'خط الأساس' })}
          </p>
          <p className="mt-1 font-display text-lg font-black text-content">
            {formatValue(t, plan.baseline, plan.unit)}
          </p>
        </div>
        <div className="rounded-card border-2 border-line bg-surface-muted p-3 text-center">
          <p className="text-[10px] font-black text-muted">
            {t('ipTargetLabel', { defaultValue: 'الهدف' })}
          </p>
          <p className="mt-1 font-display text-lg font-black text-content">
            {formatValue(t, plan.target, plan.unit)}
          </p>
        </div>
        <div className="rounded-card border-2 border-brand-300 bg-brand-soft p-3 text-center">
          <p className="text-[10px] font-black text-brand-800 dark:text-brand-200">
            {t('ipCurrentLabel', { defaultValue: 'القيمة الحالية' })}
          </p>
          <p className="mt-1 font-display text-lg font-black text-brand-700 dark:text-brand-300">
            {formatValue(t, plan.current, plan.unit)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
          <span className="flex items-center gap-1.5 text-muted">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            {t('ipProgress', { defaultValue: 'نسبة التقدّم' })}
          </span>
          <span className="text-brand-700 dark:text-brand-300">{Math.round(progress)}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="font-black">{t('ipNextReviewLabel', { defaultValue: 'الموعد التالي للمراجعة' })}:</span>
        {formatDate(plan.nextReview, locale)}
      </p>

      {source ? (
        <div className="mt-4 rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
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
              <p className="text-[10px] font-black">{t('ipFactors', { defaultValue: 'العوامل' })}</p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {source.factors.map((factor, index) => (
                  <li
                    key={`${factor}-${index}`}
                    className="rounded-full border border-line bg-surface/70 px-2 py-0.5 text-[10px] font-bold text-content"
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
            <p className="mt-0.5 text-[11px] font-semibold">{source.recommendedAction || '—'}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-5 border-t-2 border-line pt-4">
        <h4 className="flex items-center gap-2 text-sm font-black text-content">
          <CalendarDays className="h-4 w-4 text-brand-600" aria-hidden="true" />
          {t('ipWeeks', { defaultValue: 'المراجعات الأسبوعية' })}
          <span className="text-[11px] font-bold text-muted">({weeks.length})</span>
        </h4>
        {weeks.length ? (
          <ol className="mt-2 space-y-2">
            {weeks.map((week, index) => (
              <li
                key={`${week.id}-${index}`}
                className="rounded-card border-2 border-line bg-surface-muted p-3"
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
                    <ul className="mt-1 list-disc space-y-0.5 ps-4 text-[11px] font-semibold text-content">
                      {week.actions.map((action, actionIndex) => (
                        <li key={`${action}-${actionIndex}`}>{action}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {week.reviewNotes ? (
                  <p className="mt-2 text-[11px] font-semibold text-muted">
                    <span className="font-black">
                      {t('ipReviewNotes', { defaultValue: 'ملاحظات المراجعة' })}:
                    </span>{' '}
                    {week.reviewNotes}
                  </p>
                ) : null}
                {week.reviewedBy ? (
                  <p className="mt-1 text-[10px] font-semibold text-muted">{week.reviewedBy}</p>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-2">
            <Empty text={t('ipNoWeeks', { defaultValue: 'لا توجد مراجعات أسبوعية بعد.' })} />
          </div>
        )}
      </div>

      {!closed && canManage ? (
        <div className="mt-4 rounded-card border-2 border-brand-300 bg-brand-soft/60 p-3 dark:border-brand-400/30 dark:bg-brand-400/10">
          <h4 className="flex items-center gap-2 text-sm font-black text-content">
            <Plus className="h-4 w-4 text-brand-600" aria-hidden="true" />
            {t('ipAddReview', { defaultValue: 'إضافة مراجعة أسبوعية' })}
          </h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="block text-[11px] font-black text-muted sm:col-span-2">
              {t('ipWeekActions', { defaultValue: 'الإجراءات' })}
              <textarea
                className="input-school mt-1 min-h-16"
                value={weekActions}
                onChange={(event) => setWeekActions(event.target.value)}
                placeholder={t('ipWeekActions', { defaultValue: 'الإجراءات' })}
              />
            </label>
            <label className="block text-[11px] font-black text-muted sm:col-span-2">
              {t('ipReviewNotes', { defaultValue: 'ملاحظات المراجعة' })}
              <textarea
                className="input-school mt-1 min-h-16"
                value={reviewNotes}
                onChange={(event) => setReviewNotes(event.target.value)}
                placeholder={t('ipReviewNotes', { defaultValue: 'ملاحظات المراجعة' })}
              />
            </label>
            <label className="block text-[11px] font-black text-muted">
              {t('ipReviewProgress', { defaultValue: 'التقدّم (0-100)' })}
              <input
                type="number"
                min={0}
                max={100}
                className="input-school mt-1"
                value={reviewProgress}
                onChange={(event) => setReviewProgress(event.target.value)}
              />
            </label>
            <label className="block text-[11px] font-black text-muted">
              {t('ipNextReview', { defaultValue: 'الموعد التالي للمراجعة' })}
              <input
                type="date"
                className="input-school mt-1"
                value={nextReview}
                onChange={(event) => setNextReview(event.target.value)}
              />
            </label>
          </div>
          {reviewError ? (
            <div className="mt-3">
              <Notice error>{reviewError}</Notice>
            </div>
          ) : null}
          {reviewSuccess ? (
            <p className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {t('ipReviewAdded', { defaultValue: 'تم تسجيل المراجعة الأسبوعية.' })}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => void addReview()}
            disabled={savingReview}
            className="btn-chunky btn-chunky--primary btn-chunky--sm mt-3 w-full"
          >
            {savingReview ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Plus className="h-4 w-4" aria-hidden="true" />
            )}
            {t('ipAddReview', { defaultValue: 'إضافة مراجعة أسبوعية' })}
          </button>
        </div>
      ) : null}

      {!closed && canManage ? (
        <div className="mt-3">
          {!closingOpen ? (
            <button
              type="button"
              onClick={() => {
                setClosingOpen(true)
                setCloseError(null)
                setCloseSuccess(false)
              }}
              className="btn-chunky btn-chunky--danger btn-chunky--sm w-full"
            >
              {t('ipClosePlan', { defaultValue: 'إغلاق الخطة' })}
            </button>
          ) : (
            <div className="rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-3">
              <label className="block text-[11px] font-black text-[#b42318] dark:text-[#ff8787]">
                {t('ipCloseNotes', { defaultValue: 'ملاحظات الإغلاق' })}
                <textarea
                  className="input-school mt-1 min-h-16"
                  value={closeNotes}
                  onChange={(event) => setCloseNotes(event.target.value)}
                  placeholder={t('ipCloseNotes', { defaultValue: 'ملاحظات الإغلاق' })}
                />
              </label>
              {closeError ? (
                <div className="mt-2">
                  <Notice error>{closeError}</Notice>
                </div>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void closePlan()}
                  disabled={closing}
                  className="btn-chunky btn-chunky--danger btn-chunky--sm"
                >
                  {closing ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : null}
                  {t('ipClosePlan', { defaultValue: 'إغلاق الخطة' })}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClosingOpen(false)
                    setCloseError(null)
                    setCloseNotes('')
                  }}
                  disabled={closing}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  {t('ipCancel', { defaultValue: 'إلغاء' })}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {closeSuccess ? (
        <p className="mt-2 flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {t('ipClosed', { defaultValue: 'تم إغلاق الخطة.' })}
        </p>
      ) : null}
    </article>
  )
}

export default function InterventionPlans() {
  const { t, i18n } = useTranslation()
  const locale = resolveLocale(i18n.resolvedLanguage)
  const user = useAuthStore((state) => state.user)
  const canManage = !user || user.role === 'teacher'

  const [warnings, setWarnings] = useState<WarningItem[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const loadedOnce = useRef(false)

  const [studentId, setStudentId] = useState('')
  const [goal, setGoal] = useState('')
  const [indicator, setIndicator] = useState('attendance')
  const [baseline, setBaseline] = useState('')
  const [target, setTarget] = useState('')
  const [unit, setUnit] = useState<Unit>('%')
  const [nextReview, setNextReview] = useState('')
  const [actions, setActions] = useState('')
  const [sourceWarningId, setSourceWarningId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    if (loadedOnce.current) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    Promise.all([
      apiGet<WarningsResponse>('/teacher/intervention-plans/warnings', {
        signal: controller.signal,
      }),
      apiGet<PlansResponse>('/teacher/intervention-plans', {
        signal: controller.signal,
      }),
    ])
      .then(([warningData, planData]) => {
        if (cancelled) return
        setWarnings(warningData.warnings ?? [])
        setPlans(planData.plans ?? [])
        loadedOnce.current = true
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            messageOf(
              err,
              t('ipLoadError', {
                defaultValue: 'تعذّر تحميل الخطط. يرجى المحاولة مرة أخرى.',
              }),
            ),
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
          setRefreshing(false)
        }
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, t])

  const studentOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string; className?: string }>()
    warnings.forEach((warning) => {
      if (warning.studentId && !map.has(warning.studentId)) {
        map.set(warning.studentId, {
          id: warning.studentId,
          name: warning.studentName || warning.studentId,
          className: warning.className,
        })
      }
    })
    plans.forEach((plan) => {
      if (plan.studentId && !map.has(plan.studentId)) {
        map.set(plan.studentId, {
          id: plan.studentId,
          name: plan.studentName || plan.studentId,
          className: plan.className,
        })
      }
    })
    return Array.from(map.values())
  }, [warnings, plans])

  const auditEntries = useMemo(() => {
    return plans
      .flatMap((plan) =>
        (plan.history ?? []).map((entry, index) => ({
          key: `${plan.id}-${index}-${entry.at}`,
          student: plan.studentName || plan.studentId,
          ...entry,
        })),
      )
      .sort((a, b) => (b.at || '').localeCompare(a.at || ''))
  }, [plans])

  const sourceWarning = sourceWarningId
    ? warnings.find(
        (warning) => warning.studentId === studentId || warning.id === sourceWarningId,
      ) ?? null
    : null

  const resetForm = () => {
    setStudentId('')
    setGoal('')
    setIndicator('attendance')
    setBaseline('')
    setTarget('')
    setUnit('%')
    setNextReview('')
    setActions('')
    setSourceWarningId(null)
    setFormError(null)
  }

  const startFromWarning = (warning: WarningItem) => {
    setStudentId(warning.studentId)
    setSourceWarningId(warning.id || warning.studentId)
    setFormError(null)
    setFormSuccess(false)
    document.getElementById('ip-create')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const cancelForm = () => {
    resetForm()
    setFormSuccess(false)
  }

  const createPlan = async () => {
    setFormError(null)
    setFormSuccess(false)

    const baselineValue = Number(baseline)
    const targetValue = Number(target)
    const missing =
      !studentId ||
      !goal.trim() ||
      !indicator ||
      baseline.trim() === '' ||
      target.trim() === '' ||
      !unit ||
      !nextReview ||
      !Number.isFinite(baselineValue) ||
      !Number.isFinite(targetValue)

    if (missing) {
      setFormError(t('ipRequiredFields', { defaultValue: 'يرجى تعبئة الحقول المطلوبة.' }))
      return
    }

    const actionList = actions
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    setSubmitting(true)
    try {
      await apiPost<PlanResponse, CreatePlanBody>('/teacher/intervention-plans', {
        studentId,
        goal: goal.trim(),
        indicator,
        baseline: baselineValue,
        target: targetValue,
        unit,
        nextReview,
        actions: actionList,
        ...(sourceWarningId ? { sourceWarningId } : {}),
      })
      setFormSuccess(true)
      resetForm()
      setReloadKey((key) => key + 1)
    } catch (err: unknown) {
      setFormError(
        messageOf(
          err,
          t('ipCreateFailed', {
            defaultValue: 'تعذّر إنشاء الخطة. يرجى المحاولة مرة أخرى.',
          }),
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('ipBadge', { defaultValue: 'مراجعة أسبوعية' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('ipTitle', { defaultValue: 'خطط التدخل القابلة للقياس' })}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-white/80">
              {t('ipHint', {
                defaultValue:
                  'خطط تدخل يصيغها المعلم بنفسه، بأهداف قابلة للقياس ومتابعة أسبوعية موثّقة.',
              })}
            </p>
            {user?.role ? (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black text-white/90">
                <ClipboardList className="h-3 w-3" aria-hidden="true" />
                {t(ROLE_KEYS[user.role] || 'enumTeacher', {
                  defaultValue: ROLE_DEFAULTS[user.role] || 'المعلم',
                })}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={loading || refreshing}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
            aria-label={t('ipRefresh', { defaultValue: 'تحديث' })}
          >
            {loading || refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">{t('ipRefresh', { defaultValue: 'تحديث' })}</span>
          </button>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-card border-2 border-gold-300 bg-gold-50 p-4 text-xs font-bold text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden="true" />
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
          {t('ipLoading', { defaultValue: 'جارٍ تحميل الخطط...' })}
        </div>
      ) : error ? (
        <div className="space-y-3">
          <Notice error>{error}</Notice>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t('ipRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : (
        <>
          <section className="card-school p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-black text-content">
                  <AlertTriangle className="h-5 w-5 text-gold-600" aria-hidden="true" />
                  {t('ipWarnings', { defaultValue: 'سياق الإنذار المبكر' })}
                  <span className="text-xs font-bold text-muted">({warnings.length})</span>
                </h2>
                <p className="mt-1 text-xs font-semibold text-muted">
                  {t('ipWarningsHint', {
                    defaultValue:
                      'إشارات استرشادية من التحليلات؛ استخدمها كسياق عند صياغة خطة تدخل بشرية.',
                  })}
                </p>
              </div>
            </div>
            {warnings.length ? (
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {warnings.map((warning, index) => (
                  <li
                    key={`${warning.studentId}-${index}`}
                    className="rounded-card border-2 border-gold-200 bg-gold-50/60 p-4 dark:border-gold-400/20 dark:bg-gold-400/5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-extrabold text-content">
                          {warning.studentName || warning.studentId}
                        </p>
                        {warning.className ? (
                          <p className="text-[11px] font-semibold text-muted">{warning.className}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={levelBadgeClass(warning.level)}>
                          {t(levelKey(warning.level), {
                            defaultValue: levelDefault(warning.level),
                          })}
                        </span>
                        <span className="rounded-full bg-[#E03131]/10 px-2 py-0.5 text-[10px] font-black text-[#E03131] dark:text-[#ff8787]">
                          {t('ipRisk', { defaultValue: 'مستوى الخطر' })} {riskPercent(warning.risk)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10px] font-black text-muted">
                        {t('ipFactors', { defaultValue: 'العوامل' })}
                      </p>
                      {warning.factors?.length ? (
                        <ul className="mt-1 flex flex-wrap gap-1.5">
                          {warning.factors.map((factor, factorIndex) => (
                            <li
                              key={`${factor}-${factorIndex}`}
                              className="rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] font-bold text-content"
                            >
                              {factor}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-1 text-[11px] font-semibold text-muted">—</p>
                      )}
                    </div>
                    <div className="mt-3 rounded-card border border-gold-300/60 bg-surface/70 p-2.5 dark:bg-surface/10">
                      <p className="text-[10px] font-black text-gold-800 dark:text-gold-300">
                        {t('ipRecommended', { defaultValue: 'إجراء مقترح (استرشادي)' })}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-content">
                        {warning.recommendedAction || '—'}
                      </p>
                    </div>
                    {canManage ? (
                      <button
                        type="button"
                        onClick={() => startFromWarning(warning)}
                        className="btn-chunky btn-chunky--gold btn-chunky--sm mt-3 w-full"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        {t('ipCreateFromWarning', { defaultValue: 'إنشاء خطة من هذا السياق' })}
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <Empty text={t('ipNoWarnings', { defaultValue: 'لا توجد إشارات إنذار مبكر حاليًا.' })} />
              </div>
            )}
          </section>

          {canManage ? (
            <section id="ip-create" className="card-school p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 font-display text-lg font-black text-content">
                  <ClipboardList className="h-5 w-5 text-brand-600" aria-hidden="true" />
                  {t('ipCreateTitle', { defaultValue: 'خطة تدخل جديدة' })}
                </h2>
                {sourceWarningId ? (
                  <span className={BADGE}>
                    {t('ipSourceLabel', { defaultValue: 'السياق الاسترشادي' })}
                  </span>
                ) : null}
              </div>

              {sourceWarning ? (
                <div className="mt-3 rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5 text-[11px] font-black">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      {t('ipSourceLabel', { defaultValue: 'السياق الاسترشادي' })}
                    </p>
                    <span className={levelBadgeClass(sourceWarning.level)}>
                      {t(levelKey(sourceWarning.level), {
                        defaultValue: levelDefault(sourceWarning.level),
                      })}
                    </span>
                  </div>
                  {sourceWarning.factors?.length ? (
                    <div className="mt-2">
                      <p className="text-[10px] font-black">
                        {t('ipFactors', { defaultValue: 'العوامل' })}
                      </p>
                      <ul className="mt-1 flex flex-wrap gap-1.5">
                        {sourceWarning.factors.map((factor, factorIndex) => (
                          <li
                            key={`${factor}-${factorIndex}`}
                            className="rounded-full border border-line bg-surface/70 px-2 py-0.5 text-[10px] font-bold text-content"
                          >
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <p className="mt-2 text-[10px] font-black">
                    {t('ipRecommended', { defaultValue: 'إجراء مقترح (استرشادي)' })}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold">
                    {sourceWarning.recommendedAction || '—'}
                  </p>
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="block text-[11px] font-black text-muted md:col-span-2">
                  {t('ipSelectStudent', { defaultValue: 'اختر التلميذ' })}
                  <select
                    className="input-school mt-1"
                    value={studentId}
                    onChange={(event) => setStudentId(event.target.value)}
                  >
                    <option value="">{t('ipSelectStudent', { defaultValue: 'اختر التلميذ' })}</option>
                    {studentOptions.map((student) => (
                      <option key={student.id} value={student.id}>
                        {[student.name, student.className].filter(Boolean).join(' · ')}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-[11px] font-black text-muted md:col-span-2">
                  {t('ipGoal', { defaultValue: 'الهدف القابل للقياس' })}
                  <input
                    type="text"
                    className="input-school mt-1"
                    value={goal}
                    onChange={(event) => setGoal(event.target.value)}
                  />
                </label>

                <label className="block text-[11px] font-black text-muted">
                  {t('ipIndicator', { defaultValue: 'المؤشر' })}
                  <select
                    className="input-school mt-1"
                    value={indicator}
                    onChange={(event) => setIndicator(event.target.value)}
                  >
                    {Object.entries(INDICATOR_KEYS).map(([value, key]) => (
                      <option key={value} value={value}>
                        {t(key, { defaultValue: INDICATOR_DEFAULTS[value] })}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-[11px] font-black text-muted">
                  {t('ipUnit', { defaultValue: 'الوحدة' })}
                  <select
                    className="input-school mt-1"
                    value={unit}
                    onChange={(event) => setUnit(event.target.value as Unit)}
                  >
                    {UNIT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.key, { defaultValue: option.display })}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-[11px] font-black text-muted">
                  {t('ipBaseline', { defaultValue: 'خط الأساس' })}
                  <input
                    type="number"
                    className="input-school mt-1"
                    value={baseline}
                    onChange={(event) => setBaseline(event.target.value)}
                  />
                </label>

                <label className="block text-[11px] font-black text-muted">
                  {t('ipTarget', { defaultValue: 'الهدف' })}
                  <input
                    type="number"
                    className="input-school mt-1"
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                  />
                </label>

                <label className="block text-[11px] font-black text-muted md:col-span-2">
                  {t('ipNextReview', { defaultValue: 'الموعد التالي للمراجعة' })}
                  <input
                    type="date"
                    className="input-school mt-1"
                    value={nextReview}
                    onChange={(event) => setNextReview(event.target.value)}
                  />
                </label>

                <label className="block text-[11px] font-black text-muted md:col-span-2">
                  {t('ipActions', { defaultValue: 'الإجراءات (سطر لكل إجراء)' })}
                  <textarea
                    className="input-school mt-1 min-h-24"
                    value={actions}
                    onChange={(event) => setActions(event.target.value)}
                    placeholder={t('ipActions', { defaultValue: 'الإجراءات (سطر لكل إجراء)' })}
                  />
                </label>
              </div>

              {formError ? (
                <div className="mt-3">
                  <Notice error>{formError}</Notice>
                </div>
              ) : null}
              {formSuccess ? (
                <p className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {t('ipCreated', { defaultValue: 'تم إنشاء الخطة بنجاح.' })}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void createPlan()}
                  disabled={submitting}
                  className="btn-chunky btn-chunky--primary btn-chunky--sm"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  )}
                  {t('ipCreateSubmit', { defaultValue: 'إنشاء الخطة' })}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  disabled={submitting}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  {t('ipCancel', { defaultValue: 'إلغاء' })}
                </button>
              </div>
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-display text-xl font-black text-content">
              <Target className="h-5 w-5 text-brand-600" aria-hidden="true" />
              {t('ipPlans', { defaultValue: 'خطط التدخل' })}
              <span className="text-xs font-bold text-muted">({plans.length})</span>
            </h2>
            {plans.length ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    canManage={canManage}
                    onChanged={() => setReloadKey((key) => key + 1)}
                  />
                ))}
              </div>
            ) : (
              <Empty text={t('ipNoPlans', { defaultValue: 'لا توجد خطط تدخل بعد.' })} />
            )}
          </section>

          <section className="card-school p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-black text-content">
              <History className="h-5 w-5 text-brand-600" aria-hidden="true" />
              {t('ipAuditing', { defaultValue: 'سجل التغييرات' })}
            </h2>
            {auditEntries.length ? (
              <ol className="mt-4 space-y-2">
                {auditEntries.map((entry) => (
                  <li key={entry.key} className="rounded-card border-2 border-line bg-surface-muted p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black text-content">
                        {entry.action
                          ? t(ACTION_KEYS[entry.action] || 'enumOther', {
                              defaultValue: ACTION_DEFAULTS[entry.action] || 'أخرى',
                            })
                          : '—'}
                      </span>
                      <span className="text-[10px] font-semibold text-muted">
                        {formatDate(entry.at, locale)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-bold text-brand-700 dark:text-brand-300">
                      {entry.student}
                    </p>
                    {entry.by ? (
                      <p className="text-[10px] font-semibold text-muted">{entry.by}</p>
                    ) : null}
                    {entry.details ? (
                      <p className="mt-1 text-[11px] font-semibold text-muted">{entry.details}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-4">
                <Empty text={t('ipNoAudit', { defaultValue: 'لا توجد تغييرات مسجّلة.' })} />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
