import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, MessageSquareText, RefreshCw, Send, ShieldCheck } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

interface Governance {
  requiresApproval?: boolean
  approvedBy?: string | null
  approvedAt?: string | null
  consent?: string
}
interface Communication {
  id: string
  studentId?: string
  channel?: string
  status?: string
  notes?: string
  draftId?: string
  governance?: Governance
  sentAt?: string
  updatedAt?: string
}
interface Draft {
  id: string
  body?: string
}
interface CommunicationsResponse {
  communications: Communication[]
  drafts: Draft[]
}
interface UpdateResponse {
  ok: boolean
  communication: Communication
}
interface SendResponse {
  ok: boolean
  communication: Communication
  delivery: { ok?: boolean; provider?: string; messageId?: string; simulated?: boolean }
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

export default function Communications() {
  const { t } = useTranslation()

  const statusLabel = (value?: string) => {
    if (value === 'draft') return t('enumDraft', { defaultValue: 'مسودة' })
    if (value === 'approved') return t('enumApproved', { defaultValue: 'معتمدة' })
    if (value === 'sent') return t('enumSent', { defaultValue: 'مُرسلة' })
    if (value === 'cancelled') return t('enumCancelled', { defaultValue: 'ملغاة' })
    return t('enumOther', { defaultValue: 'أخرى' })
  }
  const channelLabel = (value?: string) => {
    if (value === 'whatsapp') return t('enumWhatsapp', { defaultValue: 'واتساب' })
    if (value === 'sms') return t('enumSms', { defaultValue: 'رسالة قصيرة' })
    if (value === 'email') return t('enumEmail', { defaultValue: 'بريد إلكتروني' })
    if (value === 'in_app') return t('enumInApp', { defaultValue: 'داخل التطبيق' })
    return t('enumOther', { defaultValue: 'أخرى' })
  }

  const [items, setItems] = useState<Communication[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [recipient, setRecipient] = useState('')
  const [body, setBody] = useState('')
  const [notes, setNotes] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    apiGet<CommunicationsResponse>('/teacher/communications')
      .then((data) => {
        if (!active) return
        setItems(data.communications || [])
        setDrafts(data.drafts || [])
      })
      .catch((err: unknown) => {
        if (active) {
          setError(messageOf(err, t('loadError', { defaultValue: 'تعذّر تحميل المراسلات.' })))
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

  const selected = items.find((item) => item.id === selectedId) || null
  const draftBody = drafts.find((draft) => draft.id === selected?.draftId)?.body || ''
  const select = (item: Communication) => {
    setSelectedId(item.id)
    setBody(item.notes || draftBody)
    setNotes(item.notes || '')
    setRecipient('')
    setActionError(null)
    setActionSuccess(null)
  }

  const runAction = async (kind: 'approved' | 'sent' | 'cancelled') => {
    if (!selected) return
    setActionError(null)
    setActionSuccess(null)
    setBusy(true)
    try {
      let simulated = false
      if (kind === 'sent') {
        const result = await apiPost<SendResponse, Record<string, string>>(
          '/teacher/communications/send',
          {
            id: selected.id,
            recipientAddress: recipient.trim(),
            body: body.trim(),
          },
        )
        simulated = Boolean(result?.delivery?.simulated)
      } else {
        await apiPost<UpdateResponse, Record<string, string>>('/teacher/communications/update', {
          id: selected.id,
          status: kind,
          notes: notes.trim(),
        })
      }
      setActionSuccess(
        kind === 'sent'
          ? simulated
            ? t('simulatedSendNotice', {
                defaultValue: 'محاكاة فقط — لم تُرسل رسالة فعلية. أضف مزوّد إرسال حقيقياً قبل الاعتماد.',
              })
            : t('sentSuccess', { defaultValue: 'تم إرسال المراسلة.' })
          : t('updateSuccess', { defaultValue: 'تم تحديث الحالة.' }),
      )
      setReloadKey((key) => key + 1)
    } catch (err: unknown) {
      setActionError(messageOf(err, t('actionError', { defaultValue: 'تعذّر تنفيذ الإجراء.' })))
    } finally {
      setBusy(false)
    }
  }

  const approvalState = (item: Communication) => {
    if (item.governance?.approvedBy) return t('approved', { defaultValue: 'معتمدة' })
    if (item.governance?.requiresApproval) return t('requiresApproval', { defaultValue: 'تتطلب اعتمادًا' })
    return t('notRequired', { defaultValue: 'لا تتطلب اعتمادًا' })
  }
  const consentState = (item: Communication) => {
    const consent = item.governance?.consent
    if (consent === 'granted') return t('enumGranted', { defaultValue: 'ممنوحة' })
    if (consent === 'declined') return t('enumDeclined', { defaultValue: 'مرفوضة' })
    if (consent === 'pending') return t('enumPending', { defaultValue: 'قيد الانتظار' })
    return t('enumPending', { defaultValue: 'قيد الانتظار' })
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('communicationsTitle', { defaultValue: 'المراسلات والاعتماد' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('communicationsHint', { defaultValue: 'مراجعة الحوكمة والموافقة قبل أي إرسال.' })}
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
          <MessageSquareText className="h-5 w-5" aria-hidden="true" />
        </span>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-4 text-xs font-bold text-gold-800 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-300">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {t('governanceNotice', {
            defaultValue: 'الإرسال مقيد بالاعتماد وموافقة ولي الأمر؛ أي محاولة مخالفة تُعرض رسالة الخادم هنا.',
          })}
        </span>
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
      ) : items.length === 0 ? (
        <Notice>{t('noCommunications', { defaultValue: 'لا توجد مراسلات ضمن نطاقك حاليًا.' })}</Notice>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => select(item)}
                  className={`w-full rounded-card border-2 p-4 text-start transition ${
                    selectedId === item.id
                      ? 'border-brand-400 bg-brand-50 dark:bg-brand-400/10'
                      : 'border-line bg-surface hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-extrabold">
                      {t('enumStudent', { defaultValue: 'التلميذ' })} ·{' '}
                      {t('enumId', { defaultValue: 'المعرّف' })}: {item.studentId || item.id}
                    </span>
                    <span className="shrink-0 rounded-full bg-surface-muted px-2 py-1 text-[10px] font-black text-muted">
                      {statusLabel(item.status || 'draft')}
                    </span>
                  </div>
                  <p className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold">
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                      {approvalState(item)}
                    </span>
                    <span className="rounded-full bg-gold-100 px-2 py-0.5 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                      {consentState(item)}
                    </span>
                  </p>
                </button>
              </li>
            ))}
          </ul>

          <section className="card-school p-5">
            {selected ? (
              <>
                <h2 className="font-display text-lg font-black">
                  {t('enumId', { defaultValue: 'المعرّف' })}: {selected.id}
                </h2>
                <p className="mt-1 text-xs font-semibold text-muted">
                  {selected.channel ? channelLabel(selected.channel) : '—'} ·{' '}
                  {t('status', { defaultValue: 'الحالة' })}: {statusLabel(selected.status || 'draft')}
                </p>
                <div className="mt-3 grid gap-2 rounded-card border-2 border-line bg-surface-muted p-3 text-[11px] font-bold">
                  <p>
                    {t('approval', { defaultValue: 'الاعتماد' })}: {approvalState(selected)}
                    {selected.governance?.approvedAt ? ` (${selected.governance.approvedAt})` : ''}
                  </p>
                  <p>
                    {t('guardianConsent', { defaultValue: 'موافقة ولي الأمر' })}: {consentState(selected)}
                  </p>
                  {selected.sentAt ? (
                    <p>
                      {t('sentAt', { defaultValue: 'تاريخ الإرسال' })}: {selected.sentAt}
                    </p>
                  ) : null}
                </div>
                <div className="mt-4 grid gap-2">
                  <label className="text-xs font-black text-muted" htmlFor="comm-recipient">
                    {t('recipient', { defaultValue: 'المستلم' })}
                  </label>
                  <input
                    id="comm-recipient"
                    className="input-school"
                    value={recipient}
                    placeholder={t('recipientPlaceholder', { defaultValue: 'عنوان ولي الأمر أو رقمه' })}
                    onChange={(event) => setRecipient(event.target.value)}
                  />
                  <label className="mt-1 text-xs font-black text-muted" htmlFor="comm-body">
                    {t('messageBody', { defaultValue: 'نص الرسالة' })}
                  </label>
                  <textarea
                    id="comm-body"
                    className="input-school min-h-24"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                  />
                  <label className="mt-1 text-xs font-black text-muted" htmlFor="comm-notes">
                    {t('notes', { defaultValue: 'ملاحظات' })}
                  </label>
                  <textarea
                    id="comm-notes"
                    className="input-school min-h-16"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </div>
                {actionError ? (
                  <div className="mt-3">
                    <Notice error>{actionError}</Notice>
                  </div>
                ) : null}
                {actionSuccess ? (
                  <p className="mt-3 text-xs font-bold text-brand-700 dark:text-brand-300">
                    {actionSuccess}
                  </p>
                ) : null}
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => void runAction('approved')}
                    disabled={busy}
                    className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                  >
                    {t('approve', { defaultValue: 'اعتماد' })}
                  </button>
                  <button
                    type="button"
                    onClick={() => void runAction('sent')}
                    disabled={busy}
                    className="btn-chunky btn-chunky--primary btn-chunky--sm"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="h-4 w-4" aria-hidden="true" />
                    )}
                    {t('send', { defaultValue: 'إرسال' })}
                  </button>
                  <button
                    type="button"
                    onClick={() => void runAction('cancelled')}
                    disabled={busy}
                    className="btn-chunky btn-chunky--ghost btn-chunky--sm"
                  >
                    {t('cancel', { defaultValue: 'إلغاء' })}
                  </button>
                </div>
              </>
            ) : (
              <Notice>{t('selectCommunication', { defaultValue: 'اختر مراسلة لعرض تفاصيلها.' })}</Notice>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
