import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, History, Loader2, RefreshCw, ShieldCheck, Send } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'
import type { Student } from '../../types'

type CardStatus = 'proposed' | 'approved' | 'rejected' | 'in_progress' | 'completed'
interface FeedbackCard {
  id: string
  studentId: string
  summary?: string
  status?: CardStatus
  reviewNotes?: string
  nextReview?: string
  actions?: string[]
  recommendation?: string
  history?: Array<{ at: string; by: string; action: string; note: string }>
  updatedAt?: string
}
interface CardsResponse {
  feedbackCards: FeedbackCard[]
}
interface ClassesResponse {
  classes: Array<{ id: string; students: Student[] }>
}
interface UpdateResponse {
  ok: boolean
  card: FeedbackCard
}

function messageOf(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div
      className={`rounded-card border-2 p-4 text-sm font-bold ${
        error
          ? 'border-[#E03131]/30 bg-[#E03131]/10 text-[#E03131]'
          : 'border-line bg-surface-muted text-muted'
      }`}
    >
      {children}
    </div>
  )
}

export default function FeedbackCards() {
  const { t } = useTranslation()
  const [cards, setCards] = useState<FeedbackCard[]>([])
  const [nameById, setNameById] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [nextReview, setNextReview] = useState('')
  const [actions, setActions] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [successId, setSuccessId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.all([
      apiGet<CardsResponse>('/teacher/feedback-cards'),
      apiGet<ClassesResponse>('/teacher/classes'),
    ])
      .then(([cardData, classData]) => {
        if (!active) return
        setCards(cardData.feedbackCards || [])
        const names: Record<string, string> = {}
        ;(classData.classes || []).forEach((cls) =>
          (cls.students || []).forEach((student) => {
            names[student.id] = student.name
          }),
        )
        setNameById(names)
      })
      .catch((err: unknown) => {
        if (active) {
          setError(messageOf(err, t('loadError', { defaultValue: 'تعذّر تحميل بطاقات التغذية الراجعة.' })))
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  const selected = cards.find((card) => card.id === selectedId) || null
  const selectCard = (card: FeedbackCard) => {
    setSelectedId(card.id)
    setNotes(card.reviewNotes || '')
    setNextReview(card.nextReview || '')
    setActions((card.actions || []).join('\n'))
    setFormError(null)
    setServerError(null)
    setSuccessId(null)
  }

  const statusLabel = (status?: CardStatus) => {
    if (status === 'approved') return t('enumApproved', { defaultValue: 'معتمدة' })
    if (status === 'rejected') return t('enumRejected', { defaultValue: 'مرفوضة' })
    if (status === 'in_progress') return t('enumInProgress', { defaultValue: 'قيد التنفيذ' })
    if (status === 'completed') return t('enumCompleted', { defaultValue: 'مكتملة' })
    return t('enumProposed', { defaultValue: 'مقترحة' })
  }

  const update = async (status: CardStatus) => {
    if (!selected) return
    setFormError(null)
    setServerError(null)
    setSuccessId(null)
    if (!notes.trim()) {
      setFormError(t('reviewNotesRequired', { defaultValue: 'أضف ملاحظة المراجعة قبل المتابعة.' }))
      return
    }
    setSaving(true)
    try {
      const actionList = actions
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
      await apiPost<UpdateResponse, Record<string, unknown>>('/teacher/feedback-cards/update', {
        id: selected.id,
        status,
        reviewNotes: notes.trim(),
        nextReview: nextReview || undefined,
        actions: actionList,
      })
      setSuccessId(selected.id)
      setReloadKey((key) => key + 1)
    } catch (err: unknown) {
      setServerError(messageOf(err, t('saveError', { defaultValue: 'تعذّر تحديث البطاقة.' })))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('feedbackCardsTitle', { defaultValue: 'بطاقات التغذية الراجعة' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('feedbackCardsHint', { defaultValue: 'مراجعة المقترحات واعتمادها ضمن نطاق فصولك.' })}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-3 py-1.5 text-xs font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          {t('humanReview', { defaultValue: 'مراجعة بشرية مطلوبة' })}
        </span>
      </section>

      <div className="rounded-card border-2 border-gold-300 bg-gold-50 p-4 text-xs font-bold text-gold-800 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-300">
        {t('advisoryNotice', {
          defaultValue:
            'التوصيات مبنية على أدلة ونموذج كفايات مرجعي، وتتطلب مراجعة واعتمادًا بشريًا قبل العمل بها.',
        })}
      </div>

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('loading', { defaultValue: 'جارٍ التحميل…' })}
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
            {t('retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : cards.length === 0 ? (
        <Notice>{t('noCards', { defaultValue: 'لا توجد بطاقات ضمن نطاقك حاليًا.' })}</Notice>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <ul className="space-y-2">
            {cards.map((card) => (
              <li key={card.id}>
                <button
                  type="button"
                  onClick={() => selectCard(card)}
                  className={`w-full rounded-card border-2 p-4 text-start transition ${
                    selectedId === card.id
                      ? 'border-brand-400 bg-brand-50 dark:bg-brand-400/10'
                      : 'border-line bg-surface hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-extrabold">
                      {nameById[card.studentId] || card.studentId}
                    </span>
                    <span className="shrink-0 rounded-full bg-brand-100 px-2 py-1 text-[10px] font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                      {statusLabel(card.status)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold text-muted">
                    {card.summary || card.recommendation || '—'}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          <section className="card-school p-5">
            {selected ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-black">
                    {nameById[selected.studentId] || selected.studentId}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="rounded-card border-2 border-line px-3 py-1.5 text-xs font-black text-muted"
                  >
                    {t('close', { defaultValue: 'إغلاق' })}
                  </button>
                </div>
                <p className="mt-2 text-xs font-semibold text-muted">
                  {selected.summary || selected.recommendation || '—'}
                </p>
                <div className="mt-4 grid gap-2">
                  <textarea
                    aria-label={t('reviewNotes', { defaultValue: 'ملاحظات المراجعة' })}
                    className="input-school min-h-20"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder={t('reviewNotesPlaceholder', { defaultValue: 'ملاحظات المراجعة…' })}
                  />
                  <input
                    aria-label={t('nextReview', { defaultValue: 'موعد المراجعة التالية' })}
                    type="date"
                    className="input-school"
                    value={nextReview}
                    onChange={(event) => setNextReview(event.target.value)}
                  />
                  <textarea
                    aria-label={t('actions', { defaultValue: 'الإجراءات (سطر لكل إجراء)' })}
                    className="input-school min-h-20"
                    value={actions}
                    onChange={(event) => setActions(event.target.value)}
                    placeholder={t('actionsPlaceholder', { defaultValue: 'إجراء مقترح لكل سطر' })}
                  />
                </div>
                {formError ? (
                  <div className="mt-3">
                    <Notice error>{formError}</Notice>
                  </div>
                ) : null}
                {serverError ? (
                  <div className="mt-3">
                    <Notice error>{serverError}</Notice>
                  </div>
                ) : null}
                {successId === selected.id ? (
                  <p className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {t('saved', { defaultValue: 'تم الحفظ بنجاح.' })}
                  </p>
                ) : null}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void update('proposed')}
                    disabled={saving}
                    className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {t('propose', { defaultValue: 'اقتراح' })}
                  </button>
                  <button
                    type="button"
                    onClick={() => void update('approved')}
                    disabled={saving}
                    className="btn-chunky btn-chunky--primary btn-chunky--sm"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    )}
                    {t('approve', { defaultValue: 'اعتماد' })}
                  </button>
                </div>

                {selected.history && selected.history.length ? (
                  <div className="mt-5 border-t-2 border-line pt-4">
                    <h3 className="flex items-center gap-2 text-sm font-black">
                      <History className="h-4 w-4" aria-hidden="true" />
                      {t('history', { defaultValue: 'سجل المراجعة' })}
                    </h3>
                    <ol className="mt-2 space-y-2">
                      {selected.history.map((item, index) => (
                        <li key={`${item.at}-${index}`} className="rounded-card bg-surface-muted p-2 text-[11px] font-semibold">
                          <span className="font-black">{item.action}</span>
                          <span className="text-muted"> · {item.at}</span>
                          {item.note ? <p className="mt-1 text-muted">{item.note}</p> : null}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </>
            ) : (
              <Notice>{t('selectCard', { defaultValue: 'اختر بطاقة لعرض تفاصيلها وسجلها.' })}</Notice>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
