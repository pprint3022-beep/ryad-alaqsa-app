import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  FileText,
  History,
  Layers,
  Loader2,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'
import { useAuthStore } from '../../store/auth'

type PlanStatus = 'draft' | 'in_review' | 'published'
type StatusFilter = 'all' | PlanStatus
type ExportFormat = 'csv' | 'json'
type ReviewDecision = 'published' | 'draft'

interface PlanActivity {
  id: string
  title: string
  type: string
  description: string
  durationMinutes: number
}

interface PlanDifferentiation {
  id: string
  group: string
  need: string
  strategy: string
}

interface PlanResource {
  id: string
  title: string
  type: string
  reference: string
}

interface PlanHistoryEntry {
  at: string
  by: string
  action: string
  details?: string
}

interface LessonPlan {
  id: string
  curriculumId: string
  levelId: string
  levelName: string
  subjectId: string
  subjectName: string
  unit: string
  lessonTitle: string
  term: string
  status: PlanStatus
  objectives: string[]
  activities: PlanActivity[]
  differentiation: PlanDifferentiation[]
  resources: PlanResource[]
  competencyIds: string[]
  ownerId: string
  ownerRole: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  reviewedBy: string | null
  history: PlanHistoryEntry[]
}

interface PlanSummary {
  total: number
  draft: number
  in_review: number
  published: number
}

interface PlansResponse {
  plans: LessonPlan[]
  summary?: PlanSummary
}

interface CurriculumOption {
  id: string
  name: string
}

interface CurriculumResponse {
  items?: unknown[]
  levels: CurriculumOption[]
  subjects: CurriculumOption[]
  terms: string[]
}

interface CurriculumMeta {
  levels: CurriculumOption[]
  subjects: CurriculumOption[]
  terms: string[]
}

interface ReviewBody {
  id: string
  decision: ReviewDecision
  note?: string
}

interface ReviewResponse {
  plan: LessonPlan
}

interface ToastState {
  message: string
  tone: 'success' | 'error'
}

const EMPTY_SUMMARY: PlanSummary = { total: 0, draft: 0, in_review: 0, published: 0 }
const EMPTY_META: CurriculumMeta = { levels: [], subjects: [], terms: [] }
const REVIEWER_ROLES = new Set<string>(['director', 'deputy', 'admin'])
const DASH = '—'
const LABEL = 'mb-1 block text-[11px] font-extrabold text-muted'

function resolveLocale(language?: string): string {
  if (language === 'ar') return 'ar-MA'
  if (language === 'amz') return 'fr'
  return language || 'ar-MA'
}

function formatDate(value: string | null | undefined, locale: string): string {
  if (!value) return DASH
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(value: string | null | undefined, locale: string): string {
  if (!value) return DASH
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function statusLabel(
  status: PlanStatus,
  t: ReturnType<typeof useTranslation>['t'],
): string {
  if (status === 'published') {
    return t('lePublished', { defaultValue: 'منشور' })
  }
  if (status === 'in_review') {
    return t('leReview', { defaultValue: 'قيد المراجعة' })
  }
  return t('leDraft', { defaultValue: 'مسودة' })
}

function statusBadgeClass(status: PlanStatus): string {
  const base = 'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black'
  if (status === 'published') {
    return `${base} bg-brand-soft text-brand-700 dark:text-brand-300`
  }
  if (status === 'in_review') {
    return `${base} bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300`
  }
  return `${base} bg-surface-muted text-muted`
}

const ACTIVITY_TYPE_KEY: Record<string, string> = {
  practice: 'enumPractice',
  exploration: 'enumExploration',
  assessment: 'enumAssessment',
  game: 'enumGame',
}

const ACTIVITY_TYPE_DEFAULT: Record<string, string> = {
  practice: 'التدريب',
  exploration: 'استكشاف',
  assessment: 'تقويم',
  game: 'لعبة',
}

const GROUP_KEY: Record<string, string> = {
  support: 'enumSupport',
  enrichment: 'enumEnrichment',
  all: 'enumAll',
}

const GROUP_DEFAULT: Record<string, string> = {
  support: 'دعم',
  enrichment: 'إثراء',
  all: 'الجميع',
}

const RESOURCE_TYPE_KEY: Record<string, string> = {
  link: 'enumLink',
  file: 'enumFile',
  library: 'enumLibrary',
  material: 'enumMaterial',
}

const RESOURCE_TYPE_DEFAULT: Record<string, string> = {
  link: 'رابط',
  file: 'ملف',
  library: 'مكتبة',
  material: 'وسيلة',
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

function enumKey(value: string, map: Record<string, string>): string {
  return map[String(value ?? '').toLowerCase()] ?? 'enumOther'
}

function enumDefault(value: string, map: Record<string, string>): string {
  return map[String(value ?? '').toLowerCase()] ?? value
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-card border-2 border-line bg-surface-muted p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-black text-brand-700 dark:text-brand-300">
        {value}
      </p>
    </div>
  )
}

function SectionTitle({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <h4 className="mb-2 flex items-center gap-1.5 text-xs font-black text-content">
      <Icon className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
      {label}
    </h4>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border-2 border-line bg-surface p-2.5">
      <p className="text-[10px] font-black text-muted">{label}</p>
      <p className="mt-1 break-words text-[11px] font-extrabold text-content">{value}</p>
    </div>
  )
}

interface PlanCardProps {
  plan: LessonPlan
  open: boolean
  onToggle: (id: string) => void
  note: string
  onNoteChange: (id: string, value: string) => void
  onReview: (plan: LessonPlan, decision: ReviewDecision) => void
  reviewing: boolean
  canReview: boolean
  locale: string
}

function PlanCard({
  plan,
  open,
  onToggle,
  note,
  onNoteChange,
  onReview,
  reviewing,
  canReview,
  locale,
}: PlanCardProps) {
  const { t } = useTranslation()
  const isReview = plan.status === 'in_review'
  const metaLine = [plan.levelName, plan.subjectName, plan.unit, plan.term]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="card-school flex flex-col overflow-hidden">
      <div className="flex-1 p-4">
        <button
          type="button"
          onClick={() => onToggle(plan.id)}
          aria-expanded={open}
          className="flex w-full items-start justify-between gap-2 text-start"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold text-content">
              {plan.lessonTitle || DASH}
            </span>
            <span className="mt-1 block truncate text-[11px] font-semibold text-muted">
              {metaLine || DASH}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <span className={statusBadgeClass(plan.status)}>
              {statusLabel(plan.status, t)}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </span>
        </button>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-muted">
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-1">
            <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {plan.ownerId ? (
                <>
                  {t('enumId', { defaultValue: 'المعرّف' })}: <span dir="ltr">{plan.ownerId}</span>
                </>
              ) : DASH}
            </span>
          </span>
          {plan.ownerRole ? (
            <span className="rounded-full bg-brand-soft px-2 py-1 text-brand-700 dark:text-brand-300">
              {t(enumKey(plan.ownerRole, ROLE_KEY), {
                defaultValue: enumDefault(plan.ownerRole, ROLE_DEFAULT),
              })}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(plan.createdAt, locale)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-1">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(plan.updatedAt, locale)}
          </span>
        </div>
      </div>

      {open ? (
        <div className="space-y-4 border-t-2 border-line bg-surface-muted/40 p-4">
          <div className="grid gap-2 sm:grid-cols-3">
            <Field label={t('lrLevel', { defaultValue: 'المستوى' })} value={plan.levelName || DASH} />
            <Field label={t('lrSubject', { defaultValue: 'المادة' })} value={plan.subjectName || DASH} />
            <Field label={t('lrTerm', { defaultValue: 'الفصل الدراسي' })} value={plan.term || DASH} />
          </div>

          <div>
            <SectionTitle
              icon={BookOpen}
              label={t('leObjectivesLabel', { defaultValue: 'الأهداف' })}
            />
            {plan.objectives?.length ? (
              <ul className="list-disc space-y-1 ps-6 text-[11px] font-semibold leading-relaxed">
                {plan.objectives.map((objective, index) => (
                  <li key={`${objective}-${index}`}>{objective}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] font-semibold text-muted">{DASH}</p>
            )}
          </div>

          <div>
            <SectionTitle
              icon={ClipboardList}
              label={t('leActivitiesLabel', { defaultValue: 'الأنشطة' })}
            />
            {plan.activities?.length ? (
              <ul className="space-y-2">
                {plan.activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="rounded-card border-2 border-line bg-surface p-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-black text-content">
                        {activity.title || DASH}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-black text-muted">
                          {t('leType', { defaultValue: 'النوع' })}:{' '}
                          <span>
                            {activity.type
                              ? t(enumKey(activity.type, ACTIVITY_TYPE_KEY), {
                                  defaultValue: enumDefault(activity.type, ACTIVITY_TYPE_DEFAULT),
                                })
                              : DASH}
                          </span>
                        </span>
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                          {activity.durationMinutes ?? 0} {t('leDuration', { defaultValue: 'دقيقة' })}
                        </span>
                      </div>
                    </div>
                    {activity.description ? (
                      <p className="mt-1 text-[11px] font-semibold leading-relaxed text-muted">
                        {activity.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] font-semibold text-muted">{DASH}</p>
            )}
          </div>

          <div>
            <SectionTitle
              icon={UserRound}
              label={t('leDifferentiationLabel', { defaultValue: 'التمايز' })}
            />
            {plan.differentiation?.length ? (
              <div className="space-y-2">
                {plan.differentiation.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-card border-2 border-line bg-surface p-2.5 text-[11px] font-semibold"
                  >
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 font-black text-brand-700 dark:text-brand-300">
                        {t('leGroup', { defaultValue: 'المجموعة' })}: {item.group ? t(enumKey(item.group, GROUP_KEY), { defaultValue: enumDefault(item.group, GROUP_DEFAULT) }) : DASH}
                      </span>
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted">
                        {t('leNeed', { defaultValue: 'الحاجة' })}: {item.need || DASH}
                      </span>
                    </div>
                    <p className="mt-1.5 leading-relaxed text-content">
                      {t('leStrategy', { defaultValue: 'الاستراتيجية' })}: {item.strategy || DASH}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] font-semibold text-muted">{DASH}</p>
            )}
          </div>

          <div>
            <SectionTitle
              icon={FileText}
              label={t('leResourcesLabel', { defaultValue: 'الموارد' })}
            />
            {plan.resources?.length ? (
              <ul className="space-y-1.5">
                {plan.resources.map((resource) => (
                  <li
                    key={resource.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-card border-2 border-line bg-surface p-2 text-[11px]"
                  >
                    <span className="font-black text-content">{resource.title || DASH}</span>
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 font-bold text-muted">
                        {t('leType', { defaultValue: 'النوع' })}:{' '}
                        <span>
                          {resource.type
                            ? t(enumKey(resource.type, RESOURCE_TYPE_KEY), {
                                defaultValue: enumDefault(resource.type, RESOURCE_TYPE_DEFAULT),
                              })
                            : DASH}
                        </span>
                      </span>
                      <span className="font-mono text-muted" dir="ltr">
                        {resource.reference || DASH}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] font-semibold text-muted">{DASH}</p>
            )}
          </div>

          <div className="border-t-2 border-line pt-3">
            <SectionTitle icon={History} label={t('leHistory', { defaultValue: 'سجل التغييرات' })} />
            {plan.history?.length ? (
              <ol className="space-y-2">
                {plan.history.map((entry, index) => (
                  <li
                    key={`${entry.at}-${index}`}
                    className="rounded-card border-2 border-line bg-surface p-2 text-[11px] font-semibold"
                  >
                    <span className="font-black">
                      {entry.action
                        ? t(enumKey(entry.action, ACTION_KEY), {
                            defaultValue: enumDefault(entry.action, ACTION_DEFAULT),
                          })
                        : DASH}
                    </span>
                    <span className="text-muted">
                      {' '}· {entry.by || DASH} · {formatDateTime(entry.at, locale)}
                    </span>
                    {entry.details ? (
                      <p className="mt-1 text-muted">{entry.details}</p>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-[11px] font-semibold text-muted">
                {t('leNoHistory', { defaultValue: 'لا يوجد سجل تغييرات.' })}
              </p>
            )}
          </div>

          {isReview && canReview ? (
            <div className="space-y-3 rounded-card border-2 border-brand-300 bg-surface p-3">
              <label className={LABEL} htmlFor={`lr-note-${plan.id}`}>
                {t('lrReviewNote', { defaultValue: 'ملاحظة المراجعة' })}
              </label>
              <textarea
                id={`lr-note-${plan.id}`}
                rows={3}
                disabled={reviewing}
                className="input-school text-sm"
                value={note}
                onChange={(event) => onNoteChange(plan.id, event.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={reviewing}
                  onClick={() => onReview(plan, 'published')}
                  className="btn-chunky btn-chunky--primary btn-chunky--sm"
                >
                  {reviewing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {t('lrPublish', { defaultValue: 'نشر الخطة' })}
                </button>
                <button
                  type="button"
                  disabled={reviewing}
                  onClick={() => onReview(plan, 'draft')}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  {reviewing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {t('lrReturn', { defaultValue: 'إعادة إلى المسودة' })}
                </button>
              </div>
            </div>
          ) : (
            <p className="rounded-card border-2 border-dashed border-line bg-surface-muted px-3 py-2 text-[11px] font-bold text-muted">
              {isReview
                ? t('lrNoDecision', { defaultValue: 'المراجعة للقراءة فقط حسب صلاحيتك.' })
                : t('lrNoDecision', { defaultValue: 'لا يوجد قرار مراجعة مطلوب لهذه الخطة.' })}
            </p>
          )}
        </div>
      ) : null}
    </article>
  )
}

export default function LessonReview() {
  const { t, i18n } = useTranslation()
  const token = useAuthStore((state) => state.token)
  const role = useAuthStore((state) => state.user?.role)
  const canReview = role ? REVIEWER_ROLES.has(role) : true
  const locale = resolveLocale(i18n.resolvedLanguage)

  const [plans, setPlans] = useState<LessonPlan[]>([])
  const [summary, setSummary] = useState<PlanSummary>(EMPTY_SUMMARY)
  const [meta, setMeta] = useState<CurriculumMeta>(EMPTY_META)
  const [levelId, setLevelId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [term, setTerm] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [format, setFormat] = useState<ExportFormat>('csv')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setError('')

    const params: Record<string, string> = {}
    if (levelId) params.levelId = levelId
    if (subjectId) params.subjectId = subjectId
    if (term) params.term = term
    if (status !== 'all') params.status = status

    Promise.all([
      apiGet<CurriculumResponse>('/admin/curriculum', { signal: controller.signal }),
      apiGet<PlansResponse>('/admin/lesson-plans', { params, signal: controller.signal }),
    ])
      .then(([metaData, planData]) => {
        if (cancelled) return
        setMeta({
          levels: Array.isArray(metaData.levels) ? metaData.levels : [],
          subjects: Array.isArray(metaData.subjects) ? metaData.subjects : [],
          terms: Array.isArray(metaData.terms) ? metaData.terms : [],
        })
        setPlans(Array.isArray(planData.plans) ? planData.plans : [])
        const incoming = planData.summary
        setSummary({
          total: Number(incoming?.total) || 0,
          draft: Number(incoming?.draft) || 0,
          in_review: Number(incoming?.in_review) || 0,
          published: Number(incoming?.published) || 0,
        })
      })
      .catch((err: unknown) => {
        if (cancelled || controller.signal.aborted) return
        setError(
          extractApiError(err)?.message ||
            t('lrLoadError', {
              defaultValue: 'تعذّر تحميل خطط الدروس. حاول مجددًا.',
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
  }, [levelId, subjectId, term, status, reloadKey, t])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const levelOptions = useMemo(
    () =>
      levelId && !meta.levels.some((option) => option.id === levelId)
        ? [...meta.levels, { id: levelId, name: levelId }]
        : meta.levels,
    [meta.levels, levelId],
  )

  const subjectOptions = useMemo(
    () =>
      subjectId && !meta.subjects.some((option) => option.id === subjectId)
        ? [...meta.subjects, { id: subjectId, name: subjectId }]
        : meta.subjects,
    [meta.subjects, subjectId],
  )

  const termOptions = useMemo(
    () => (term && !meta.terms.includes(term) ? [term, ...meta.terms] : meta.terms),
    [meta.terms, term],
  )

  const number = (value: number): string =>
    new Intl.NumberFormat(locale).format(Number.isFinite(value) ? value : 0)

  const toggle = (id: string) => {
    setOpenIds((current) => ({ ...current, [id]: !current[id] }))
  }

  const setNote = (id: string, value: string) => {
    setNotes((current) => ({ ...current, [id]: value }))
  }

  async function handleExport() {
    if (exporting) return
    setExporting(true)
    setToast(null)
    try {
      const search = new URLSearchParams()
      search.set('format', format)
      if (levelId) search.set('levelId', levelId)
      if (subjectId) search.set('subjectId', subjectId)
      if (term) search.set('term', term)
      if (status !== 'all') search.set('status', status)

      const response = await fetch(`/api/admin/lesson-plans/export?${search.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!response.ok) throw new Error(`export_failed_${response.status}`)

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = format === 'csv' ? 'lesson-plans.csv' : 'lesson-plans.json'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)

      setToast({
        tone: 'success',
        message: t('lrExported', { defaultValue: 'تم تصدير الحزمة بنجاح.' }),
      })
    } catch (err: unknown) {
      setToast({
        tone: 'error',
        message:
          extractApiError(err)?.message ||
          t('lrExportFailed', { defaultValue: 'تعذّر تصدير الحزمة. حاول مجددًا.' }),
      })
    } finally {
      setExporting(false)
    }
  }

  async function submitReview(plan: LessonPlan, decision: ReviewDecision) {
    if (reviewingId) return
    setReviewingId(plan.id)
    setToast(null)
    const note = (notes[plan.id] ?? '').trim()
    const body: ReviewBody = { id: plan.id, decision, ...(note ? { note } : {}) }

    try {
      await apiPost<ReviewResponse, ReviewBody>('/admin/lesson-plans/review', body)
      setNotes((current) => {
        const next = { ...current }
        delete next[plan.id]
        return next
      })
      setToast({
        tone: 'success',
        message: t('lrReviewed', { defaultValue: 'تم تسجيل قرار المراجعة.' }),
      })
      setReloadKey((key) => key + 1)
    } catch (err: unknown) {
      const apiError = extractApiError(err)
      const message =
        apiError?.error === 'invalid_transition'
          ? t('lrReviewFailed', {
              defaultValue: 'تعذّر اتخاذ القرار؛ الخطة لم تعد قيد المراجعة.',
            })
          : apiError?.message ||
            t('lrReviewFailed', { defaultValue: 'تعذّر تسجيل قرار المراجعة. حاول مجددًا.' })
      setToast({ tone: 'error', message })
    } finally {
      setReviewingId(null)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-black sm:text-3xl">
                {t('lrTitle', { defaultValue: 'مراجعة خطط الدروس' })}
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-relaxed text-white/80">
                {t('lrHint', {
                  defaultValue:
                    'مراجعة خطط الدروس التي يعدّها المعلمون، واعتمادها أو إعادتها إلى المسودة، وتصدير حزمة منها.',
                })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={loading}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {t('lrRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      </section>

      <div className="flex items-start gap-3 rounded-card border-2 border-gold-300 bg-gold-50 p-4 text-xs font-bold leading-relaxed text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck
          className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 dark:text-gold-300"
          aria-hidden="true"
        />
        <span>
          {t('lrAdvisory', {
            defaultValue:
              'المراجعة بشرية بالكامل؛ لا ينشر النظام أي خطة آليًا، وكل قرار موثّق في سجل التدقيق باسم المراجع.',
          })}
        </span>
      </div>

      {toast ? (
        <p
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className={`rounded-card border-2 p-3 text-xs font-bold ${
            toast.tone === 'error'
              ? 'border-[#E03131]/40 bg-[#E03131]/10 text-[#b42318] dark:text-[#ff8787]'
              : 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-200'
          }`}
        >
          {toast.message}
        </p>
      ) : null}

      <section aria-label={t('lrTotal', { defaultValue: 'الإجمالي' })} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Layers}
          label={t('lrTotal', { defaultValue: 'الإجمالي' })}
          value={number(summary.total)}
        />
        <StatCard
          icon={FileText}
          label={t('lrDraft', { defaultValue: 'مسودة' })}
          value={number(summary.draft)}
        />
        <StatCard
          icon={ClipboardList}
          label={t('lrInReview', { defaultValue: 'قيد المراجعة' })}
          value={number(summary.in_review)}
        />
        <StatCard
          icon={CheckCircle2}
          label={t('lrPublished', { defaultValue: 'منشور' })}
          value={number(summary.published)}
        />
      </section>

      <section className="card-school p-4 sm:p-5" aria-label={t('lrStatus', { defaultValue: 'الحالة' })}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className={LABEL}>{t('lrLevel', { defaultValue: 'المستوى' })}</span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={levelId}
              onChange={(event) => setLevelId(event.target.value)}
            >
              <option value="">{t('lrLevel', { defaultValue: 'المستوى' })}</option>
              {levelOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={LABEL}>{t('lrSubject', { defaultValue: 'المادة' })}</span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
            >
              <option value="">{t('lrSubject', { defaultValue: 'المادة' })}</option>
              {subjectOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={LABEL}>{t('lrTerm', { defaultValue: 'الفصل الدراسي' })}</span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            >
              <option value="">{t('lrTerm', { defaultValue: 'الفصل الدراسي' })}</option>
              {termOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={LABEL}>{t('lrStatus', { defaultValue: 'الحالة' })}</span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
            >
              <option value="all">{t('lrStatus', { defaultValue: 'الحالة' })}</option>
              <option value="draft">{t('leDraft', { defaultValue: 'مسودة' })}</option>
              <option value="in_review">{t('leReview', { defaultValue: 'قيد المراجعة' })}</option>
              <option value="published">{t('lePublished', { defaultValue: 'منشور' })}</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3 border-t-2 border-line pt-4">
          <label className="block">
            <span className={LABEL}>{t('lrFormat', { defaultValue: 'صيغة التصدير' })}</span>
            <select
              className="input-school w-auto min-w-[8rem] py-2.5 text-sm font-bold"
              value={format}
              onChange={(event) => setFormat(event.target.value as ExportFormat)}
            >
              <option value="csv">{t('lrCsv', { defaultValue: 'CSV' })}</option>
              <option value="json">{t('lrJson', { defaultValue: 'JSON' })}</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={exporting}
            className="btn-chunky btn-chunky--primary btn-chunky--sm"
          >
            {exporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {t('lrExport', { defaultValue: 'تصدير الحزمة' })}
          </button>
        </div>
      </section>

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('lrLoading', { defaultValue: 'جارٍ تحميل خطط الدروس…' })}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="card-school flex flex-wrap items-center justify-between gap-3 border-[#E03131]/40 p-5"
        >
          <p className="flex items-start gap-2 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('lrRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : (
        <section aria-label={t('lrPlans', { defaultValue: 'خطط الدروس' })}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-base font-black">
              {t('lrPlans', { defaultValue: 'خطط الدروس' })}
            </h2>
            <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-black text-brand-700 dark:text-brand-300">
              {number(plans.length)}
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="rounded-card border-2 border-dashed border-line bg-surface-muted p-8 text-center text-sm font-bold text-muted">
              {t('lrNoPlans', { defaultValue: 'لا توجد خطط دروس مطابقة حاليًا.' })}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  open={Boolean(openIds[plan.id])}
                  onToggle={toggle}
                  note={notes[plan.id] ?? ''}
                  onNoteChange={setNote}
                  onReview={(item, decision) => void submitReview(item, decision)}
                  reviewing={reviewingId === plan.id}
                  canReview={canReview}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
