import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  Bot,
  CalendarDays,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  History,
  Loader2,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

type CardStatus = 'proposed' | 'approved' | 'rejected' | 'in_progress' | 'completed'
type StatusFilter = 'all' | CardStatus
type PriorityFilter = 'all' | 'high' | 'medium' | 'low'

interface CardHistoryEntry {
  at: string
  by: string
  action: string
  note?: string
}

interface FeedbackCard {
  id: string
  studentId: string
  agent?: string
  term?: string
  year?: string | number
  date?: string
  priority?: string
  summary?: string
  evidenceIds?: string[]
  recommendations?: string[]
  resources?: string[]
  nextReview?: string
  status: CardStatus
  assignee?: string
  reviewNotes?: string
  actions?: string[]
  history?: CardHistoryEntry[]
  updatedAt?: string
}

interface AdminStudent {
  id: string
  name: string
  levelId?: string
  classId?: string
  level?: string
  class?: string
}

interface CardsResponse {
  feedbackCards: FeedbackCard[]
}

interface StudentsResponse {
  students: AdminStudent[]
}

interface UpdateBody {
  id: string
  status?: CardStatus
  reviewNotes?: string
  assignee?: string
  nextReview?: string
  actions?: string[]
}

interface UpdateResponse {
  ok: boolean
  card: FeedbackCard
}

interface Draft {
  reviewNotes: string
  assignee: string
  nextReview: string
  actions: string
}

interface ToastState {
  message: string
  tone: 'success' | 'error'
}

const STATUSES: CardStatus[] = ['proposed', 'approved', 'rejected', 'in_progress', 'completed']
const PRIORITIES: Array<Exclude<PriorityFilter, 'all'>> = ['high', 'medium', 'low']

/** Human-review workflow. Only transitions the lead contract allows are offered. */
const NEXT_STATUSES: Record<CardStatus, CardStatus[]> = {
  proposed: ['approved', 'rejected', 'in_progress'],
  approved: ['in_progress', 'rejected'],
  rejected: [],
  in_progress: ['completed', 'rejected'],
  completed: [],
}

const LABEL = 'mb-1 block text-[11px] font-extrabold text-muted'
const CHIP = 'inline-flex items-center rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-black text-muted'
const BADGE_BASE = 'shrink-0 rounded-full px-2 py-1 text-[10px] font-black'

function parseActions(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function initialDraft(card: FeedbackCard): Draft {
  return {
    reviewNotes: card.reviewNotes ?? '',
    assignee: card.assignee ?? '',
    nextReview: card.nextReview ?? '',
    actions: (card.actions ?? []).join('\n'),
  }
}

function statusBadgeClass(status: CardStatus): string {
  switch (status) {
    case 'approved':
      return 'bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
    case 'in_progress':
      return 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
    case 'completed':
      return 'bg-brand-soft text-brand-800 dark:bg-brand-400/10 dark:text-brand-200'
    case 'rejected':
      return 'bg-[#E03131]/10 text-[#b42318] dark:bg-[#E03131]/15 dark:text-[#ff8787]'
    default:
      return 'bg-surface-muted text-muted'
  }
}

function priorityBadgeClass(priority?: string): string {
  switch ((priority ?? '').trim().toLowerCase()) {
    case 'high':
      return 'bg-[#E03131]/10 text-[#b42318] dark:bg-[#E03131]/15 dark:text-[#ff8787]'
    case 'medium':
      return 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
    case 'low':
      return 'bg-brand-soft text-brand-700 dark:bg-brand-400/10 dark:text-brand-300'
    default:
      return 'bg-surface-muted text-muted'
  }
}

function transitionAppearance(target: CardStatus): {
  key: string
  fallback: string
  icon: LucideIcon
  tone: string
} {
  switch (target) {
    case 'approved':
      return {
        key: 'chubApprove',
        fallback: 'اعتماد',
        icon: CheckCircle2,
        tone: 'btn-chunky--primary',
      }
    case 'rejected':
      return { key: 'chubReject', fallback: 'رفض', icon: XCircle, tone: 'btn-chunky--danger' }
    case 'in_progress':
      return { key: 'chubStart', fallback: 'بدء التنفيذ', icon: Play, tone: 'btn-chunky--gold' }
    case 'completed':
      return { key: 'chubComplete', fallback: 'إكمال', icon: CheckCheck, tone: 'btn-chunky--primary' }
    default:
      return { key: 'chubSave', fallback: 'حفظ', icon: CheckCircle2, tone: 'btn-chunky--secondary' }
  }
}

function Kpi({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone: string }) {
  return (
    <article className="card-school p-4 shadow-card">
      <p className="text-xs font-extrabold text-muted">{label}</p>
      <p className={`mt-2 font-display text-2xl font-black leading-none ${tone}`}>{value}</p>
      {hint ? <p className="mt-2 text-[11px] font-semibold text-muted">{hint}</p> : null}
    </article>
  )
}

function Meta({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-card border-2 border-line bg-surface p-2.5">
      <p className="flex items-center gap-1 text-[10px] font-black text-muted">
        {icon}
        {label}
      </p>
      <p className="mt-1 break-words text-[11px] font-extrabold text-content">{value}</p>
    </div>
  )
}

function ChipList({ label, items, empty }: { label: string; items: string[]; empty: string }) {
  return (
    <div>
      <h4 className="mb-1.5 text-[11px] font-black text-muted">{label}</h4>
      {items.length ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className={CHIP}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11px] font-semibold text-muted">{empty}</p>
      )}
    </div>
  )
}

export default function CardsCenter() {
  const { t } = useTranslation()

  const [cards, setCards] = useState<FeedbackCard[]>([])
  const [nameById, setNameById] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [query, setQuery] = useState('')

  const [openIds, setOpenIds] = useState<Record<string, boolean>>({})
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)

  const dash = t('chubNone', { defaultValue: '—' })

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setLoadError('')

    Promise.all([
      apiGet<CardsResponse>('/admin/feedback-cards', { signal: controller.signal }),
      apiGet<StudentsResponse>('/admin/students', { signal: controller.signal }),
    ])
      .then(([cardData, studentData]) => {
        if (cancelled) return
        setCards(Array.isArray(cardData.feedbackCards) ? cardData.feedbackCards : [])
        const names: Record<string, string> = {}
        ;(Array.isArray(studentData.students) ? studentData.students : []).forEach((student) => {
          names[student.id] = student.name
        })
        setNameById(names)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setLoadError(
          extractApiError(error)?.message ||
            t('chubLoadError', { defaultValue: 'تعذّر تحميل البطاقات. حاول مرة أخرى.' }),
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, t])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const counts = useMemo(
    () => ({
      total: cards.length,
      proposed: cards.filter((card) => card.status === 'proposed').length,
      approved: cards.filter((card) => card.status === 'approved').length,
      inProgress: cards.filter((card) => card.status === 'in_progress').length,
      closed: cards.filter(
        (card) => card.status === 'completed' || card.status === 'rejected',
      ).length,
    }),
    [cards],
  )

  const agents = useMemo(
    () =>
      Array.from(
        new Set(
          cards
            .map((card) => card.agent?.trim())
            .filter((agent): agent is string => Boolean(agent)),
        ),
      ).sort((a, b) => a.localeCompare(b, 'ar')),
    [cards],
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return cards.filter((card) => {
      if (statusFilter !== 'all' && card.status !== statusFilter) return false
      if (priorityFilter !== 'all' && (card.priority ?? '').trim().toLowerCase() !== priorityFilter) {
        return false
      }
      if (agentFilter !== 'all' && card.agent !== agentFilter) return false
      if (!term) return true
      const studentName = nameById[card.studentId] ?? card.studentId
      return (
        studentName.toLowerCase().includes(term) || (card.summary ?? '').toLowerCase().includes(term)
      )
    })
  }, [cards, nameById, statusFilter, priorityFilter, agentFilter, query])

  const statusLabel = (status: string): string => {
    switch (status) {
      case 'proposed':
        return t('chubProposed', { defaultValue: 'مقترح' })
      case 'approved':
        return t('chubApproved', { defaultValue: 'معتمد' })
      case 'rejected':
        return t('chubRejected', { defaultValue: 'مرفوض' })
      case 'in_progress':
        return t('chubInProgress', { defaultValue: 'قيد التنفيذ' })
      case 'completed':
        return t('chubCompleted', { defaultValue: 'مكتمل' })
      default:
        return t('chubStatusValue', { value: status, defaultValue: '{{value}}' })
    }
  }

  const priorityLabel = (priority?: string): string => {
    switch ((priority ?? '').trim().toLowerCase()) {
      case 'high':
        return t('chubHigh', { defaultValue: 'مرتفعة' })
      case 'medium':
        return t('chubMedium', { defaultValue: 'متوسطة' })
      case 'low':
        return t('chubLow', { defaultValue: 'منخفضة' })
      default:
        return dash
    }
  }

  const saveErrorText = (error: unknown): string => {
    const apiError = extractApiError(error)
    if (apiError?.error === 'invalid_transition') {
      return t('chubInvalidTransition', {
        defaultValue: 'هذا التغيير غير مسموح به للحالة الحالية.',
      })
    }
    return (
      apiError?.message || t('chubFailed', { defaultValue: 'تعذّر حفظ التغيير. حاول مرة أخرى.' })
    )
  }

  const draftFor = (card: FeedbackCard): Draft => drafts[card.id] ?? initialDraft(card)

  const setField = (card: FeedbackCard, field: keyof Draft, value: string) => {
    setDrafts((current) => ({
      ...current,
      [card.id]: { ...(current[card.id] ?? initialDraft(card)), [field]: value },
    }))
  }

  const toggleCard = (id: string) => {
    setOpenIds((current) => ({ ...current, [id]: !current[id] }))
  }

  /** Optimistic update with a full rollback and a localized toast on failure. */
  const commit = async (card: FeedbackCard, status?: CardStatus) => {
    if (savingId) return
    const draft = draftFor(card)
    const body: UpdateBody = {
      id: card.id,
      reviewNotes: draft.reviewNotes,
      assignee: draft.assignee || undefined,
      nextReview: draft.nextReview || undefined,
      actions: parseActions(draft.actions),
      ...(status ? { status } : {}),
    }
    const snapshot = cards
    setCards((current) =>
      current.map((item) =>
        item.id === card.id
          ? {
              ...item,
              status: status ?? item.status,
              reviewNotes: draft.reviewNotes,
              assignee: draft.assignee || undefined,
              nextReview: draft.nextReview || undefined,
              actions: parseActions(draft.actions),
            }
          : item,
      ),
    )
    setSavingId(card.id)
    setToast(null)
    try {
      const response = await apiPost<UpdateResponse, UpdateBody>('/admin/feedback-cards/update', body)
      setCards((current) =>
        current.map((item) => (item.id === card.id ? { ...item, ...response.card } : item)),
      )
      setToast({
        tone: 'success',
        message: t('chubSaved', { defaultValue: 'تم حفظ المراجعة وتسجيلها في سجل التدقيق.' }),
      })
    } catch (error: unknown) {
      setCards(snapshot)
      setToast({ tone: 'error', message: saveErrorText(error) })
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-start justify-between gap-3 p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-xl font-black sm:text-2xl">
              {t('chubTitle', { defaultValue: 'مركز مراجعة البطاقات' })}
            </h1>
            <p className="mt-1 text-xs font-semibold text-muted">
              {t('chubSubtitle', {
                defaultValue:
                  'مراجعة بطاقات التغذية الراجعة والتنبيهات والتدخلات قبل إتاحتها للأسر.',
              })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          disabled={loading}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm ms-auto shrink-0"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {t('chubRefresh', { defaultValue: 'تحديث' })}
        </button>
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-xs font-bold leading-relaxed text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t('chubAdvisory', {
              defaultValue:
                'بطاقات الذكاء الاصطناعي مقترحات استرشادية فقط، ولا تُعرض على الأسر قبل المراجعة والاعتماد البشري.',
            })}
          </span>
        </div>
        <div className="flex items-start gap-2 rounded-card border-2 border-brand-300 bg-brand-soft p-3 text-xs font-bold leading-relaxed text-brand-900 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-200">
          <History className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t('chubHumanReview', {
              defaultValue: 'كل تغيير في الحالة يُسجَّل في سجل التدقيق باسم المراجع المسؤول.',
            })}
          </span>
        </div>
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

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('chubLoading', { defaultValue: 'جارٍ تحميل بطاقات المراجعة…' })}
        </div>
      ) : loadError ? (
        <div
          role="alert"
          className="card-school flex flex-wrap items-center justify-between gap-3 border-[#E03131]/40 p-5"
        >
          <p className="flex items-start gap-2 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {loadError}
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('chubRetry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : (
        <>
          <section
            aria-label={t('chubKpis', { defaultValue: 'مؤشرات مراجعة البطاقات' })}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          >
            <Kpi
              label={t('chubTotal', { defaultValue: 'الإجمالي' })}
              value={String(counts.total)}
              tone="text-content"
            />
            <Kpi
              label={t('chubProposed', { defaultValue: 'مقترح' })}
              value={String(counts.proposed)}
              tone="text-gold-700 dark:text-gold-300"
            />
            <Kpi
              label={t('chubApproved', { defaultValue: 'معتمد' })}
              value={String(counts.approved)}
              tone="text-brand-700 dark:text-brand-300"
            />
            <Kpi
              label={t('chubInProgress', { defaultValue: 'قيد التنفيذ' })}
              value={String(counts.inProgress)}
              tone="text-brand-600 dark:text-brand-400"
            />
            <Kpi
              label={t('chubClosed', { defaultValue: 'مكتمل/مرفوض' })}
              value={String(counts.closed)}
              tone="text-muted"
            />
          </section>

          <section aria-label={t('chubFilters', { defaultValue: 'أدوات التصفية' })} className="card-school p-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className={LABEL} htmlFor="chub-status-filter">
                  {t('chubAllStatuses', { defaultValue: 'كل الحالات' })}
                </label>
                <select
                  id="chub-status-filter"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="input-school text-sm"
                >
                  <option value="all">{t('chubAllStatuses', { defaultValue: 'كل الحالات' })}</option>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {statusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL} htmlFor="chub-priority-filter">
                  {t('chubPriority', { defaultValue: 'الأولوية' })}
                </label>
                <select
                  id="chub-priority-filter"
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value as PriorityFilter)}
                  className="input-school text-sm"
                >
                  <option value="all">
                    {t('chubAllPriorities', { defaultValue: 'كل الأولويات' })}
                  </option>
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priorityLabel(priority)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL} htmlFor="chub-agent-filter">
                  {t('chubAgent', { defaultValue: 'الوكيل' })}
                </label>
                <select
                  id="chub-agent-filter"
                  value={agentFilter}
                  onChange={(event) => setAgentFilter(event.target.value)}
                  className="input-school text-sm"
                >
                  <option value="all">{t('chubAllAgents', { defaultValue: 'كل الوكلاء' })}</option>
                  {agents.map((agent) => (
                    <option key={agent} value={agent}>
                      {agent}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL} htmlFor="chub-search">
                  {t('chubSearch', { defaultValue: 'بحث بالاسم أو الملخّص' })}
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="chub-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="input-school ps-10 text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {cards.length === 0 ? (
            <div className="rounded-card border-2 border-dashed border-line bg-surface-muted p-8 text-center text-sm font-bold text-muted">
              {t('chubNoCards', { defaultValue: 'لا توجد بطاقات متاحة للمراجعة حاليًا.' })}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-card border-2 border-dashed border-line bg-surface-muted p-8 text-center text-sm font-bold text-muted">
              {t('chubNoMatch', { defaultValue: 'لا توجد بطاقات تطابق عوامل التصفية.' })}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((card) => {
                const open = Boolean(openIds[card.id])
                const draft = draftFor(card)
                const saving = savingId === card.id
                const studentName = nameById[card.studentId] ?? card.studentId
                const termParts = [
                  card.term ?? '',
                  card.year != null ? String(card.year) : '',
                  card.date ?? '',
                ].filter(Boolean)
                const termText = termParts.join(' · ')
                const transitions = NEXT_STATUSES[card.status] ?? []

                return (
                  <article
                    key={card.id}
                    className={`card-school flex flex-col overflow-hidden ${open ? '' : 'card-school--interactive'}`}
                  >
                    <div className="flex-1 p-4">
                      <button
                        type="button"
                        onClick={() => toggleCard(card.id)}
                        aria-expanded={open}
                        className="flex w-full items-start justify-between gap-2 text-start"
                      >
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5">
                            <UserRound className="h-4 w-4 shrink-0 text-brand-600 me-0.5" aria-hidden="true" />
                            <span className="truncate text-sm font-extrabold text-content">
                              {studentName}
                            </span>
                          </span>
                          <span className="mt-1 block truncate text-[11px] font-semibold text-muted">
                            {termText || dash}
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                          <span className={`${BADGE_BASE} ${priorityBadgeClass(card.priority)}`}>
                            {priorityLabel(card.priority)}
                          </span>
                          <span className={`${BADGE_BASE} ${statusBadgeClass(card.status)}`}>
                            {statusLabel(card.status)}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                          />
                        </span>
                      </button>

                      <p className="mt-3 line-clamp-3 text-xs font-semibold leading-relaxed text-muted">
                        {card.summary || dash}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold text-muted">
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-1">
                          <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                          {card.agent || dash}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleCard(card.id)}
                        className="mt-3 text-[11px] font-black text-brand-700 dark:text-brand-300"
                      >
                        {open
                          ? t('chubHide', { defaultValue: 'إخفاء التفاصيل' })
                          : t('chubDetails', { defaultValue: 'عرض التفاصيل' })}
                      </button>
                    </div>

                    {open ? (
                      <div className="space-y-4 border-t-2 border-line bg-surface-muted/40 p-4 text-xs">
                        <div className="grid gap-2 sm:grid-cols-2">
                          <Meta
                            icon={<UserRound className="h-3 w-3" aria-hidden="true" />}
                            label={t('chubStudent', { defaultValue: 'التلميذ' })}
                            value={studentName}
                          />
                          <Meta
                            icon={<Bot className="h-3 w-3" aria-hidden="true" />}
                            label={t('chubAgent', { defaultValue: 'الوكيل' })}
                            value={card.agent || dash}
                          />
                          <Meta
                            icon={<CalendarDays className="h-3 w-3" aria-hidden="true" />}
                            label={t('chubTerm', { defaultValue: 'الفصل/التاريخ' })}
                            value={termText || dash}
                          />
                          <Meta
                            label={t('chubNextReview', { defaultValue: 'موعد المراجعة التالية' })}
                            value={card.nextReview || dash}
                          />
                          <Meta
                            label={t('chubAssignee', { defaultValue: 'المكلَّف بالمتابعة' })}
                            value={card.assignee || dash}
                          />
                          <Meta
                            label={t('chubSummary', { defaultValue: 'الملخّص' })}
                            value={card.summary || dash}
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <ChipList
                            label={t('chubEvidence', { defaultValue: 'معرّفات الأدلة' })}
                            items={card.evidenceIds ?? []}
                            empty={dash}
                          />
                          <ChipList
                            label={t('chubResources', { defaultValue: 'الموارد' })}
                            items={card.resources ?? []}
                            empty={dash}
                          />
                        </div>

                        <div>
                          <h4 className="mb-1.5 text-[11px] font-black text-muted">
                            {t('chubRecommendations', { defaultValue: 'التوصيات' })}
                          </h4>
                          {card.recommendations?.length ? (
                            <ul className="list-disc space-y-1 ps-6 text-[11px] font-semibold leading-relaxed">
                              {card.recommendations.map((recommendation, index) => (
                                <li key={`${recommendation}-${index}`}>{recommendation}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[11px] font-semibold text-muted">{dash}</p>
                          )}
                        </div>

                        <div className="border-t-2 border-line pt-3">
                          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-black">
                            <History className="h-4 w-4 text-brand-600" aria-hidden="true" />
                            {t('chubHistory', { defaultValue: 'سجل المراجعة' })}
                          </h4>
                          {card.history?.length ? (
                            <ol className="space-y-2">
                              {card.history.map((entry, index) => (
                                <li
                                  key={`${entry.at}-${index}`}
                                  className="rounded-card border-2 border-line bg-surface p-2 text-[11px] font-semibold"
                                >
                                  <span className="font-black">{entry.action}</span>
                                  <span className="text-muted"> · {entry.by} · {entry.at}</span>
                                  {entry.note ? (
                                    <p className="mt-1 text-muted">{entry.note}</p>
                                  ) : null}
                                </li>
                              ))}
                            </ol>
                          ) : (
                            <p className="text-[11px] font-semibold text-muted">{dash}</p>
                          )}
                        </div>

                        <div className="space-y-3 rounded-card border-2 border-line bg-surface p-3">
                          <h4 className="text-xs font-black">
                            {t('chubReview', { defaultValue: 'نموذج المراجعة البشرية' })}
                          </h4>
                          <div>
                            <label className={LABEL} htmlFor={`chub-notes-${card.id}`}>
                              {t('chubReviewNotes', { defaultValue: 'ملاحظات المراجعة' })}
                            </label>
                            <textarea
                              id={`chub-notes-${card.id}`}
                              rows={3}
                              className="input-school text-sm"
                              value={draft.reviewNotes}
                              onChange={(event) => setField(card, 'reviewNotes', event.target.value)}
                              disabled={saving}
                            />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className={LABEL} htmlFor={`chub-next-${card.id}`}>
                                {t('chubNextReview', { defaultValue: 'موعد المراجعة التالية' })}
                              </label>
                              <input
                                id={`chub-next-${card.id}`}
                                type="date"
                                className="input-school text-sm"
                                value={draft.nextReview}
                                onChange={(event) => setField(card, 'nextReview', event.target.value)}
                                disabled={saving}
                              />
                            </div>
                            <div>
                              <label className={LABEL} htmlFor={`chub-assignee-${card.id}`}>
                                {t('chubAssignee', { defaultValue: 'المكلَّف بالمتابعة' })}
                              </label>
                              <input
                                id={`chub-assignee-${card.id}`}
                                className="input-school text-sm"
                                value={draft.assignee}
                                onChange={(event) => setField(card, 'assignee', event.target.value)}
                                disabled={saving}
                              />
                            </div>
                          </div>
                          <div>
                            <label className={LABEL} htmlFor={`chub-actions-${card.id}`}>
                              {t('chubActions', { defaultValue: 'الإجراءات (سطر لكل إجراء)' })}
                            </label>
                            <textarea
                              id={`chub-actions-${card.id}`}
                              rows={2}
                              className="input-school text-sm"
                              value={draft.actions}
                              onChange={(event) => setField(card, 'actions', event.target.value)}
                              placeholder={t('chubActionsHint', {
                                defaultValue: 'اكتب إجراءً واحدًا في كل سطر',
                              })}
                              disabled={saving}
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => void commit(card)}
                              disabled={saving}
                              className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                            >
                              {saving ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                              ) : null}
                              {t('chubSave', { defaultValue: 'حفظ المراجعة' })}
                            </button>
                            {transitions.map((target) => {
                              const appearance = transitionAppearance(target)
                              const Icon = appearance.icon
                              return (
                                <button
                                  key={target}
                                  type="button"
                                  onClick={() => void commit(card, target)}
                                  disabled={saving}
                                  className={`btn-chunky btn-chunky--sm ${appearance.tone}`}
                                >
                                  {saving ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                                  ) : (
                                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                  )}
                                  {t(appearance.key, { defaultValue: appearance.fallback })}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
