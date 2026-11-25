import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, RefreshCw, Send, ShieldCheck, AlertTriangle } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

interface Governance {
  requiresApproval?: boolean
  consent?: string
  approvedBy?: string | null
  approvedAt?: string
}

interface Delivery {
  ok?: boolean
  provider?: string
  messageId?: string
  to?: string
  preview?: string
  simulated?: boolean
}

interface Communication {
  id: string
  studentId?: string
  type?: string
  channel?: string
  status: string
  draftId?: string
  by?: string
  at?: string
  notes?: string
  governance?: Governance
  sentAt?: string
  sentBy?: string
  delivery?: Delivery
  updatedAt?: string
}

interface UpdateBody {
  id: string
  status?: string
  consent?: string
  notes?: string
}

interface SendBody {
  id: string
  recipientAddress?: string
  body?: string
}

const STATUS_KEY: Record<string, string> = {
  draft: 'enumDraft',
  approved: 'enumApproved',
  sent: 'enumSent',
  cancelled: 'enumCancelled',
}

const STATUS_DEFAULT: Record<string, string> = {
  draft: 'مسودة',
  approved: 'معتمدة',
  sent: 'مُرسَلة',
  cancelled: 'ملغاة',
}

const CONSENT_KEY: Record<string, string> = {
  granted: 'enumGranted',
  pending: 'enumPending',
  declined: 'enumDeclined',
  denied: 'enumDeclined',
}

const CONSENT_DEFAULT: Record<string, string> = {
  granted: 'ممنوحة',
  pending: 'معلقة',
  declined: 'مرفوضة',
  denied: 'مرفوضة',
}

const BADGE = 'inline-flex rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300'
const LABEL = 'mb-1 block text-[11px] font-extrabold text-muted'

function failureMessage(error: unknown, fallback: string): string {
  return extractApiError(error)?.message ?? fallback
}

export default function Communications() {
  const { t } = useTranslation()
  const statusLabel = (value: string) => t(STATUS_KEY[value] ?? 'enumOther', { defaultValue: STATUS_DEFAULT[value] ?? value })
  const consentLabel = (value: string) => t(CONSENT_KEY[value] ?? 'enumOther', { defaultValue: CONSENT_DEFAULT[value] ?? value })
  const [items, setItems] = useState<Communication[]>([])
  const [drafts, setDrafts] = useState<unknown[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [recipient, setRecipient] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [reload, setReload] = useState(0)

  const fetchData = useCallback(async () => {
    const response = await apiGet<{ communications: Communication[]; drafts: unknown[] }>('/admin/communications')
    return { items: response.communications ?? [], drafts: response.drafts ?? [] }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void fetchData().then((result) => {
      if (cancelled) return
      setItems(result.items)
      setDrafts(result.drafts)
      setLoading(false)
    }).catch((err: unknown) => {
      if (cancelled) return
      setError(failureMessage(err, t('admin.errorLoad', { defaultValue: 'تعذّر تحميل المراسلات.' })))
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [fetchData, reload, t])

  const current = items.find((item) => item.id === selected) ?? null

  /** Mirrors backend `canSend` so blocked actions are never offered to the user. */
  function blockReason(item: Communication): string | null {
    const governance = item.governance ?? {}
    if (governance.requiresApproval && !governance.approvedBy) {
      return t('admin.requiresApproval', { defaultValue: 'يتطلب اعتمادًا قبل الإرسال.' })
    }
    if (governance.consent === 'pending' && item.type === 'parent_message') {
      return t('admin.consentPending', { defaultValue: 'موافقة ولي الأمر معلقة.' })
    }
    if (item.status === 'sent' || item.status === 'cancelled') {
      return t('admin.alreadyFinal', { defaultValue: 'تمت هذه المراسلة بالفعل.' })
    }
    return null
  }

  async function update(body: UpdateBody, successKey: string, arabic: string) {
    if (!current) return
    setBusy(true)
    setActionError(null)
    setNotice(null)
    try {
      await apiPost<{ ok: boolean; communication: Communication }, UpdateBody>('/admin/communications/update', body)
      setNotice(t(successKey, { defaultValue: arabic }))
      setReload((n) => n + 1)
    } catch (err) {
      setActionError(failureMessage(err, t('admin.actionFailed', { defaultValue: 'تعذّر تنفيذ الإجراء.' })))
    } finally {
      setBusy(false)
    }
  }

  async function send() {
    if (!current) return
    setBusy(true)
    setActionError(null)
    setNotice(null)
    try {
      const body: SendBody = {
        id: current.id,
        recipientAddress: recipient.trim() || undefined,
        body: bodyText.trim() || undefined,
      }
      const response = await apiPost<{ ok: boolean; delivery: Delivery }, SendBody>('/admin/communications/send', body)
      setNotice(
        response.delivery?.simulated
          ? t('simulatedSendNotice', {
              defaultValue: 'محاكاة فقط — لم تُرسل رسالة فعلية. أضف مزوّد إرسال حقيقياً قبل الاعتماد.',
            })
          : t('admin.sentOk', { defaultValue: 'تم الإرسال بنجاح.' }) + ` · ${response.delivery?.provider ?? ''}`,
      )
      setRecipient('')
      setBodyText('')
      setReload((n) => n + 1)
    } catch (err) {
      setActionError(failureMessage(err, t('admin.sendFailed', { defaultValue: 'تعذّر الإرسال.' })))
    } finally {
      setBusy(false)
    }
  }

  const reason = current ? blockReason(current) : null

  return (
    <div className="space-y-5 animate-slide">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">{t('admin.communicationsTitle', { defaultValue: 'المراسلات والحوكمة' })}</h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('admin.communicationsHint', { defaultValue: 'لا تُرسل أي مراسلة قبل استكمال الاعتماد وموافقة ولي الأمر.' })}
          </p>
        </div>
        <button type="button" onClick={() => setReload((n) => n + 1)} disabled={loading} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {t('admin.refresh', { defaultValue: 'تحديث' })}
        </button>
      </div>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-xs font-bold text-gold-800 dark:bg-gold-400/10 dark:text-gold-300">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{t('admin.commGovernance', { defaultValue: 'تخضع المراسلات لبوابة الحوكمة: اعتماد صريح من جهة مخولة، وموافقة ولي الأمر، وتسجيل في سجل التدقيق.' })}</span>
      </div>

      {error ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-4 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
          <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{error}</span>
          <button type="button" onClick={() => setReload((n) => n + 1)} className="btn-chunky btn-chunky--danger btn-chunky--sm">{t('admin.retry', { defaultValue: 'إعادة المحاولة' })}</button>
        </div>
      ) : null}

      {actionError ? <div role="alert" className="rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-3 text-xs font-bold text-[#b42318] dark:text-[#ff8787]">{actionError}</div> : null}
      {notice ? <div role="status" className="rounded-card border-2 border-brand-300 bg-brand-soft p-3 text-xs font-bold text-brand-800 dark:text-brand-200">{notice}</div> : null}

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted"><Loader2 className="h-5 w-5 animate-spin" />{t('admin.loading', { defaultValue: 'جارٍ التحميل…' })}</div>
      ) : !items.length ? (
        <div className="card-school p-10 text-center text-sm font-semibold text-muted">{t('admin.noData', { defaultValue: 'لا توجد مراسلات.' })}</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <section className="card-school p-4">
            <h2 className="mb-2 text-sm font-black">{t('admin.communicationList', { defaultValue: 'قائمة المراسلات' })}</h2>
            <div className="max-h-[70vh] space-y-2 overflow-y-auto">
              {items.map((item) => {
                const blocked = blockReason(item)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setSelected(item.id); setRecipient(''); setBodyText(''); setActionError(null); setNotice(null) }}
                    className={`w-full rounded-card border-2 p-3 text-start transition ${selected === item.id ? 'border-brand-500 bg-brand-soft' : 'border-line bg-surface hover:border-brand-300'}`}
                  >
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-extrabold">{item.studentId ?? item.id}</span>
                      <span className={BADGE}>{statusLabel(item.status)}</span>
                    </span>
                    <span className="mt-1 block text-[10px] font-semibold text-muted">
                      {item.channel ?? '—'} · {item.type ?? '—'} · {item.governance?.consent ? consentLabel(item.governance.consent) : '—'}
                    </span>
                    {blocked ? <span className="mt-1 block text-[10px] font-bold text-[#b42318] dark:text-[#ff8787]">{blocked}</span> : null}
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-[10px] font-semibold text-muted">
              {t('admin.draftsCount', { defaultValue: 'المسودات المرتبطة' })}: {drafts.length}
            </p>
          </section>

          <section className="card-school p-5">
            <h2 className="mb-3 text-sm font-black">{t('admin.communicationDetails', { defaultValue: 'تفاصيل المراسلة' })}</h2>
            {!current ? (
              <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-xs font-semibold text-muted">
                {t('admin.selectCommunication', { defaultValue: 'اختر مراسلة لعرض حالتها وإجراءاتها.' })}
              </p>
            ) : (
              <div className="space-y-4">
                <dl className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                  <div className="rounded-card bg-surface-muted p-2"><dt className="text-muted">{t('admin.status', { defaultValue: 'الحالة' })}</dt><dd className="font-black">{statusLabel(current.status)}</dd></div>
                  <div className="rounded-card bg-surface-muted p-2"><dt className="text-muted">{t('admin.channel', { defaultValue: 'القناة' })}</dt><dd className="font-black">{current.channel ?? '—'}</dd></div>
                  <div className="rounded-card bg-surface-muted p-2"><dt className="text-muted">{t('admin.consent', { defaultValue: 'الموافقة' })}</dt><dd className="font-black">{current.governance?.consent ? consentLabel(current.governance.consent) : '—'}</dd></div>
                  <div className="rounded-card bg-surface-muted p-2"><dt className="text-muted">{t('admin.approvedBy', { defaultValue: 'اعتمد بواسطة' })}</dt><dd className="font-black">{current.governance?.approvedBy ?? '—'}</dd></div>
                </dl>

                {current.governance?.requiresApproval && !current.governance.approvedBy ? (
                  <button
                    type="button"
                    disabled={busy || current.status === 'sent' || current.status === 'cancelled'}
                    onClick={() => void update({ id: current.id, status: 'approved' }, 'adminApprovedOk', 'تم الاعتماد.')}
                    className="btn-chunky btn-chunky--primary btn-chunky--sm"
                  >
                    {t('admin.approve', { defaultValue: 'اعتماد المراسلة' })}
                  </button>
                ) : null}

                <button
                  type="button"
                  disabled={busy || current.governance?.consent === 'granted' || current.status === 'sent' || current.status === 'cancelled'}
                  onClick={() => void update({ id: current.id, consent: 'granted' }, 'adminConsentOk', 'تم تسجيل موافقة ولي الأمر.')}
                  className="btn-chunky btn-chunky--gold btn-chunky--sm"
                >
                  {t('admin.grantConsent', { defaultValue: 'تسجيل الموافقة' })}
                </button>

                <div className="border-t-2 border-line pt-3">
                  <label className={LABEL} htmlFor="recipient">{t('admin.recipient', { defaultValue: 'عنوان المستلم (اختياري)' })}</label>
                  <input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="input-school text-sm" />
                  <label className={`${LABEL} mt-3`} htmlFor="message-body">{t('admin.messageBody', { defaultValue: 'نص الرسالة (اختياري)' })}</label>
                  <textarea id="message-body" rows={3} value={bodyText} onChange={(e) => setBodyText(e.target.value)} className="input-school text-sm" />
                  <button type="button" disabled={busy || reason !== null} onClick={() => void send()} className="btn-chunky btn-chunky--primary btn-chunky--sm mt-3">
                    <Send className="h-3.5 w-3.5" />
                    {t('admin.send', { defaultValue: 'إرسال' })}
                  </button>
                  {reason ? <p className="mt-2 text-[11px] font-bold text-[#b42318] dark:text-[#ff8787]">{reason}</p> : null}
                </div>

                {current.delivery ? (
                  <div className="rounded-card border-2 border-line bg-surface-muted p-3 text-[11px] font-semibold">
                    <p className="font-black">
                      {t('admin.delivery', { defaultValue: 'نتيجة الإرسال' })}
                      {current.delivery.simulated ? (
                        <span className="ms-2 inline-flex rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-900 dark:bg-gold-400/15 dark:text-gold-200">
                          {t('simulatedBadge', { defaultValue: 'محاكاة' })}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-muted">{current.delivery.provider ?? '—'} · {current.delivery.messageId ?? '—'}</p>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
