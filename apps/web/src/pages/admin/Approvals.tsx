import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCheck, ClipboardCheck, Loader2, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

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
  priority?: string
  summary: string
  recommendations?: string[]
  evidenceIds?: string[]
  nextReview?: string
  status: string
  assignee?: string
  reviewNotes?: string
  history?: CardHistoryEntry[]
  updatedAt?: string
  updatedBy?: string
}

interface TimelineEntry {
  term?: string
  date?: string
  event: string
  by?: string
  type?: string
}

interface CaseFile {
  id: string
  studentId: string
  status: string
  ownerRole?: string
  ownerId?: string
  focus?: string
  openedAt?: string
  nextReview?: string
  timeline?: TimelineEntry[]
  updatedAt?: string
}

interface CardUpdateBody {
  id: string
  status?: string
  reviewNotes?: string
}

interface CaseUpdateBody {
  id: string
  status?: string
  focus?: string
  ownerRole?: string
  nextReview?: string
}

interface TimelineBody {
  id: string
  term?: string
  date?: string
  event: string
  type?: string
}

type Selection = { kind: 'card' | 'case'; id: string } | null

const CARD_STATUSES = ['proposed', 'approved', 'rejected', 'in_progress', 'completed'] as const
const CASE_STATUSES = ['active', 'monitoring', 'resolved', 'closed'] as const

const STATUS_KEY: Record<string, string> = {
  proposed: 'enumProposed',
  approved: 'enumApproved',
  rejected: 'enumRejected',
  in_progress: 'enumInProgress',
  completed: 'enumCompleted',
  active: 'enumActive',
  monitoring: 'enumMonitoring',
  resolved: 'enumResolved',
  closed: 'enumClosed',
}

const STATUS_DEFAULT: Record<string, string> = {
  proposed: 'مقترح',
  approved: 'معتمد',
  rejected: 'مرفوض',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتمل',
  active: 'نشط',
  monitoring: 'تحت المتابعة',
  resolved: 'محسوم',
  closed: 'مغلق',
}

const BADGE = 'inline-flex rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300'
const ROW = 'w-full border-b-2 border-line px-3 py-2.5 text-start text-xs font-bold transition hover:bg-surface-muted'
const LABEL = 'mb-1 block text-[11px] font-extrabold text-muted'

function statusKey(value: string): string {
  return STATUS_KEY[value] ?? 'enumOther'
}

function statusDefault(value: string): string {
  return STATUS_DEFAULT[value] ?? value
}

function failureMessage(error: unknown, fallback: string): string {
  return extractApiError(error)?.message ?? fallback
}

export default function Approvals() {
  const { t } = useTranslation()
  const statusLabel = (value: string) => t(statusKey(value), { defaultValue: statusDefault(value) })
  const [cards, setCards] = useState<FeedbackCard[]>([])
  const [cases, setCases] = useState<CaseFile[]>([])
  const [selection, setSelection] = useState<Selection>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [reviewNote, setReviewNote] = useState('')
  const [eventText, setEventText] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [caseStatus, setCaseStatus] = useState('active')
  const [caseFocus, setCaseFocus] = useState('')
  const [caseOwnerRole, setCaseOwnerRole] = useState('')
  const [caseNextReview, setCaseNextReview] = useState('')
  const [reload, setReload] = useState(0)

  const fetchData = useCallback(async () => {
    const [cardEnvelope, caseEnvelope] = await Promise.all([
      apiGet<{ feedbackCards: FeedbackCard[] }>('/admin/feedback-cards'),
      apiGet<{ cases: CaseFile[] }>('/admin/cases'),
    ])
    return { cards: cardEnvelope.feedbackCards ?? [], cases: caseEnvelope.cases ?? [] }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void fetchData().then((result) => {
      if (cancelled) return
      setCards(result.cards)
      setCases(result.cases)
      setLoading(false)
    }).catch((err: unknown) => {
      if (cancelled) return
      setError(failureMessage(err, t('admin.errorLoad', { defaultValue: 'تعذّر تحميل بيانات الاعتماد.' })))
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [fetchData, reload, t])

  const selectedCard = selection?.kind === 'card' ? cards.find((c) => c.id === selection.id) ?? null : null
  const selectedCase = selection?.kind === 'case' ? cases.find((c) => c.id === selection.id) ?? null : null

  function pickCard(card: FeedbackCard) {
    setSelection({ kind: 'card', id: card.id })
    setReviewNote(card.reviewNotes ?? '')
    setActionError(null)
  }

  function pickCase(item: CaseFile) {
    setSelection({ kind: 'case', id: item.id })
    setCaseStatus(item.status)
    setCaseFocus(item.focus ?? '')
    setCaseOwnerRole(item.ownerRole ?? '')
    setCaseNextReview(item.nextReview ?? '')
    setEventText('')
    setEventDate('')
    setActionError(null)
  }

  async function updateCard(status: string) {
    if (!selectedCard) return
    setBusy(true)
    setActionError(null)
    try {
      const body: CardUpdateBody = { id: selectedCard.id, status, reviewNotes: reviewNote }
      await apiPost<{ ok: boolean; card: FeedbackCard }, CardUpdateBody>('/admin/feedback-cards/update', body)
      setReload((n) => n + 1)
    } catch (err) {
      setActionError(failureMessage(err, t('admin.actionFailed', { defaultValue: 'تعذّر تنفيذ الإجراء.' })))
    } finally {
      setBusy(false)
    }
  }

  async function updateCase() {
    if (!selectedCase) return
    setBusy(true)
    setActionError(null)
    try {
      const body: CaseUpdateBody = {
        id: selectedCase.id,
        status: caseStatus,
        focus: caseFocus,
        ownerRole: caseOwnerRole,
        nextReview: caseNextReview,
      }
      await apiPost<{ ok: boolean; case: CaseFile }, CaseUpdateBody>('/admin/cases/update', body)
      setReload((n) => n + 1)
    } catch (err) {
      setActionError(failureMessage(err, t('admin.actionFailed', { defaultValue: 'تعذّر تنفيذ الإجراء.' })))
    } finally {
      setBusy(false)
    }
  }

  async function addTimeline() {
    if (!selectedCase || !eventText.trim()) return
    setBusy(true)
    setActionError(null)
    try {
      const body: TimelineBody = { id: selectedCase.id, event: eventText.trim(), term: t('enumTerm1', { defaultValue: 'الفصل 1' }), date: eventDate || undefined, type: 'note' }
      await apiPost<{ ok: boolean; case: CaseFile }, TimelineBody>('/admin/cases/timeline', body)
      setEventText('')
      setReload((n) => n + 1)
    } catch (err) {
      setActionError(failureMessage(err, t('admin.actionFailed', { defaultValue: 'تعذّر تنفيذ الإجراء.' })))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">{t('admin.approvalsTitle', { defaultValue: 'مراجعة البطاقات والحالات واعتمادها' })}</h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('admin.approvalsHint', { defaultValue: 'تتطلب التوصيات مراجعة واعتمادًا بشريًا قبل اعتمادها أو إغلاق الحالة.' })}
          </p>
        </div>
        <button type="button" onClick={() => setReload((n) => n + 1)} disabled={loading} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {t('admin.refresh', { defaultValue: 'تحديث' })}
        </button>
      </div>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-xs font-bold text-gold-800 dark:bg-gold-400/10 dark:text-gold-300">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{t('admin.humanReview', { defaultValue: 'مراجعة بشرية مطلوبة: كل تغيير في الحالة يُسجَّل باسمك في سجل التدقيق ولا يُعتبر نهائيًا إلا بعد الاعتماد.' })}</span>
      </div>

      {error ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-4 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
          <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{error}</span>
          <button type="button" onClick={() => setReload((n) => n + 1)} className="btn-chunky btn-chunky--danger btn-chunky--sm">{t('admin.retry', { defaultValue: 'إعادة المحاولة' })}</button>
        </div>
      ) : null}

      {actionError ? (
        <div role="alert" className="rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-3 text-xs font-bold text-[#b42318] dark:text-[#ff8787]">{actionError}</div>
      ) : null}

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted"><Loader2 className="h-5 w-5 animate-spin" />{t('admin.loading', { defaultValue: 'جارٍ التحميل…' })}</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <section className="card-school p-4">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-black"><ClipboardCheck className="h-4 w-4 text-brand-600" />{t('admin.feedbackCards', { defaultValue: 'بطاقات التغذية الراجعة' })}</h2>
              {cards.length ? (
                <div className="max-h-80 overflow-y-auto rounded-card border-2 border-line">
                  {cards.map((card) => (
                    <button key={card.id} type="button" onClick={() => pickCard(card)} className={ROW}>
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="truncate">{card.summary}</span>
                        <span className={BADGE}>{statusLabel(card.status)}</span>
                      </span>
                      <span className="mt-1 block text-[10px] font-semibold text-muted">{card.studentId} · {card.priority ?? '—'}</span>
                    </button>
                  ))}
                </div>
              ) : <p className="text-xs font-semibold text-muted">{t('admin.noData', { defaultValue: 'لا توجد بيانات.' })}</p>}
            </section>

            <section className="card-school p-4">
              <h2 className="mb-2 flex items-center gap-2 text-sm font-black"><CheckCheck className="h-4 w-4 text-gold-600" />{t('admin.cases', { defaultValue: 'الحالات' })}</h2>
              {cases.length ? (
                <div className="max-h-80 overflow-y-auto rounded-card border-2 border-line">
                  {cases.map((item) => (
                    <button key={item.id} type="button" onClick={() => pickCase(item)} className={ROW}>
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="truncate">{item.focus || item.id}</span>
                        <span className={BADGE}>{statusLabel(item.status)}</span>
                      </span>
                      <span className="mt-1 block text-[10px] font-semibold text-muted">{item.studentId} · {item.nextReview ?? '—'}</span>
                    </button>
                  ))}
                </div>
              ) : <p className="text-xs font-semibold text-muted">{t('admin.noData', { defaultValue: 'لا توجد بيانات.' })}</p>}
            </section>
          </div>

          <section className="card-school p-5">
            <h2 className="mb-3 text-sm font-black">{t('admin.details', { defaultValue: 'لوحة التفاصيل' })}</h2>
            {!selectedCard && !selectedCase ? (
              <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-xs font-semibold text-muted">
                {t('admin.selectItem', { defaultValue: 'اختر بطاقة أو حالة لعرض تفاصيلها وسجلها.' })}
              </p>
            ) : null}

            {selectedCard ? (
              <div className="space-y-4">
                <p className="text-sm font-extrabold">{selectedCard.summary}</p>
                <p className="text-[11px] font-semibold text-muted">{selectedCard.studentId} · {selectedCard.agent ?? '—'} · {statusLabel(selectedCard.status)}</p>
                {selectedCard.recommendations?.length ? (
                  <ul className="list-disc space-y-1 rounded-card bg-surface-muted p-3 text-[11px] font-semibold ps-8">
                    {selectedCard.recommendations.map((rec) => <li key={rec}>{rec}</li>)}
                  </ul>
                ) : null}
                <div>
                  <label className={LABEL} htmlFor="review-note">{t('admin.reviewNotes', { defaultValue: 'ملاحظات المراجعة' })}</label>
                  <textarea id="review-note" rows={3} value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} className="input-school text-sm" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {CARD_STATUSES.map((status) => (
                    <button key={status} type="button" disabled={busy || selectedCard.status === status} onClick={() => void updateCard(status)} className={`btn-chunky btn-chunky--sm ${status === 'rejected' ? 'btn-chunky--danger' : 'btn-chunky--primary'}`}>
                      {statusLabel(status)}
                    </button>
                  ))}
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-black">{t('admin.history', { defaultValue: 'السجل' })}</h3>
                  {selectedCard.history?.length ? (
                    <ol className="space-y-2">
                      {selectedCard.history.map((entry, index) => (
                        <li key={`${entry.at}-${index}`} className="rounded-card border-2 border-line bg-surface-muted p-2 text-[11px] font-semibold">
                          <span className="font-black">{entry.action}</span> · {entry.by} · {entry.at}
                          {entry.note ? <p className="mt-1 text-muted">{entry.note}</p> : null}
                        </li>
                      ))}
                    </ol>
                  ) : <p className="text-[11px] font-semibold text-muted">{t('admin.noData', { defaultValue: 'لا توجد بيانات.' })}</p>}
                </div>
              </div>
            ) : null}

            {selectedCase ? (
              <div className="space-y-4">
                <p className="text-sm font-extrabold">{selectedCase.focus || selectedCase.id}</p>
                <p className="text-[11px] font-semibold text-muted">{selectedCase.studentId} · {statusLabel(selectedCase.status)}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={LABEL} htmlFor="case-status">{t('admin.status', { defaultValue: 'الحالة' })}</label>
                    <select id="case-status" value={caseStatus} onChange={(e) => setCaseStatus(e.target.value)} className="input-school text-sm">
                      {CASE_STATUSES.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LABEL} htmlFor="case-owner">{t('admin.ownerRole', { defaultValue: 'الدور المسؤول' })}</label>
                    <input id="case-owner" value={caseOwnerRole} onChange={(e) => setCaseOwnerRole(e.target.value)} className="input-school text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL} htmlFor="case-focus">{t('admin.focus', { defaultValue: 'محور المتابعة' })}</label>
                    <input id="case-focus" value={caseFocus} onChange={(e) => setCaseFocus(e.target.value)} className="input-school text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL} htmlFor="case-review">{t('admin.nextReview', { defaultValue: 'موعد المراجعة التالية' })}</label>
                    <input id="case-review" type="date" value={caseNextReview} onChange={(e) => setCaseNextReview(e.target.value)} className="input-school text-sm" />
                  </div>
                </div>
                <button type="button" disabled={busy} onClick={() => void updateCase()} className="btn-chunky btn-chunky--primary btn-chunky--sm">
                  {t('admin.saveCase', { defaultValue: 'حفظ تحديث الحالة' })}
                </button>
                <div className="border-t-2 border-line pt-3">
                  <h3 className="mb-2 text-xs font-black">{t('admin.timeline', { defaultValue: 'الخط الزمني' })}</h3>
                  <ol className="space-y-2">
                    {(selectedCase.timeline ?? []).map((entry, index) => (
                      <li key={`${entry.date}-${index}`} className="rounded-card border-2 border-line bg-surface-muted p-2 text-[11px] font-semibold">
                        <span className="font-black">{entry.date ?? '—'}</span> · {entry.event} · {entry.by ?? '—'}
                      </li>
                    ))}
                    {!selectedCase.timeline?.length ? <li className="text-[11px] font-semibold text-muted">{t('admin.noData', { defaultValue: 'لا توجد بيانات.' })}</li> : null}
                  </ol>
                  <div className="mt-3 space-y-2">
                    <input value={eventText} onChange={(e) => setEventText(e.target.value)} placeholder={t('admin.eventPlaceholder', { defaultValue: 'حدث جديد في متابعة الحالة' })} className="input-school text-sm" />
                    <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="input-school text-sm" />
                    <button type="button" disabled={busy || !eventText.trim()} onClick={() => void addTimeline()} className="btn-chunky btn-chunky--gold btn-chunky--sm">
                      {t('admin.addEvent', { defaultValue: 'إضافة حدث' })}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      )}
    </div>
  )
}
