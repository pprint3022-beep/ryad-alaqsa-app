import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CalendarDays,
  CheckCircle2,
  Inbox,
  Info,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

interface ChildAlert {
  id?: string
  studentId?: string
  level?: string
  type?: string
  message?: string
  date?: string
}

interface DueItem {
  id?: string
  type?: string
  message?: string
  due?: string
}

interface NotificationsResponse {
  alerts: ChildAlert[]
  due: DueItem[]
  total?: number
}

interface EngagementEntry {
  id?: string
  action?: string
  at?: string
  studentId?: string
}

interface EngagementResponse {
  entries?: EngagementEntry[]
  log?: EngagementEntry[]
}

type Status = 'loading' | 'ready' | 'error'

function resolveLocale(language?: string): string {
  const base = (language ?? 'ar').split('-')[0]
  if (base === 'ar') return 'ar-MA'
  if (base === 'fr' || base === 'amz') return 'fr-FR'
  if (base === 'en') return 'en-GB'
  return 'ar-MA'
}

function shortDate(value?: string, locale = 'ar-MA'): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date)
}

/* ------------------------------------------------------------------ */
/* Threads (two-way conversations)                                      */
/* ------------------------------------------------------------------ */

interface ThreadChild {
  id: string
  name: string
  level?: string
  class?: string
}

interface ChildrenResponse {
  children: ThreadChild[]
}

interface ThreadMessage {
  id?: string
  from?: string
  fromRole: 'parent' | 'teacher'
  body: string
  at?: string
}

interface ThreadGovernance {
  requiresApproval?: boolean
  consent?: string
  initiator?: string
}

interface Thread {
  id: string
  studentId?: string
  studentName?: string
  className?: string
  classId?: string
  caseId: string | null
  cardId: string | null
  caseFocus?: string
  cardSummary?: string
  subject: string
  status: 'open' | 'closed'
  createdAt?: string
  createdBy?: string
  createdByRole?: string
  lastActivityAt?: string
  communicationId?: string
  governance?: ThreadGovernance
  messages: ThreadMessage[]
}

interface ThreadsResponse {
  threads: Thread[]
  meta?: { statuses?: string[] }
}

function localizedDate(value?: string, language?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(resolveLocale(language), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default function Messages() {
  const { t, i18n } = useTranslation()
  const resolvedLanguage = i18n.resolvedLanguage ?? i18n.language
  const locale = resolveLocale(resolvedLanguage)
  const loadError = t('loadError', { defaultValue: 'تعذّر تحميل البيانات. حاول مرة أخرى.' })

  const [alerts, setAlerts] = useState<ChildAlert[]>([])
  const [due, setDue] = useState<DueItem[]>([])
  const [engagementCount, setEngagementCount] = useState(0)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setStatus('loading')
    setError('')

    void (async () => {
      const [notificationResult, engagementResult] = await Promise.allSettled([
        apiGet<NotificationsResponse>('/parent/notifications', { signal: controller.signal }),
        apiGet<EngagementResponse>('/parent/engagement', { signal: controller.signal }),
      ])

      if (cancelled) return

      if (notificationResult.status === 'fulfilled') {
        const data = notificationResult.value
        setAlerts(Array.isArray(data.alerts) ? data.alerts : [])
        setDue(Array.isArray(data.due) ? data.due : [])
        setStatus('ready')
      } else {
        setError(loadError)
        setStatus('error')
      }

      if (engagementResult.status === 'fulfilled') {
        const data = engagementResult.value
        const entries = Array.isArray(data.entries)
          ? data.entries
          : Array.isArray(data.log)
            ? data.log
            : []
        setEngagementCount(entries.length)
      }
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, loadError])

  const totalItems = alerts.length + due.length

  /* -------------------- Threads state & labels -------------------- */

  const thTitle = t('thTitle', { defaultValue: 'المحادثات' })
  const thHint = t('thHint', { defaultValue: 'محادثات ثنائية الاتجاه مرتبطة بحالة الطالب أو بطاقة الملاحظات.' })
  const thRefresh = t('thRefresh', { defaultValue: 'تحديث المحادثات' })
  const thAdvisory = t('thAdvisory', { defaultValue: 'هذه المحادثات بشرية فقط وتخضع للتدقيق؛ لا يتم إرسال أي رد آلي.' })
  const thLoading = t('thLoading', { defaultValue: 'جارٍ تحميل المحادثات...' })
  const thLoadError = t('thLoadError', { defaultValue: 'تعذّر تحميل المحادثات. حاول مرة أخرى.' })
  const thSelectChild = t('thSelectChild', { defaultValue: 'اختر الابن' })
  const thNewThread = t('thNewThread', { defaultValue: 'فتح محادثة جديدة' })
  const thCase = t('thCase', { defaultValue: 'معرّف الحالة (اختياري)' })
  const thCard = t('thCard', { defaultValue: 'معرّف البطاقة (اختياري)' })
  const thSubject = t('thSubject', { defaultValue: 'الموضوع' })
  const thBody = t('thBody', { defaultValue: 'الرسالة' })
  const thCreate = t('thCreate', { defaultValue: 'إنشاء المحادثة' })
  const thCreated = t('thCreated', { defaultValue: 'تم إنشاء المحادثة بنجاح.' })
  const thCreateFailed = t('thCreateFailed', { defaultValue: 'تعذّر إنشاء المحادثة. حاول مرة أخرى.' })
  const thRequired = t('thRequired', { defaultValue: 'الموضوع والرسالة مطلوبان.' })
  const thCancel = t('thCancel', { defaultValue: 'إلغاء' })
  const thThreads = t('thThreads', { defaultValue: 'قائمة المحادثات' })
  const thNoThreads = t('thNoThreads', { defaultValue: 'لا توجد محادثات لهذا الابن.' })
  const thOpen = t('thOpen', { defaultValue: 'مفتوحة' })
  const thClosed = t('thClosed', { defaultValue: 'مغلقة' })
  const thLinkedCase = t('thLinkedCase', { defaultValue: 'الحالة المرتبطة' })
  const thLinkedCard = t('thLinkedCard', { defaultValue: 'البطاقة المرتبطة' })
  const thNoLink = t('thNoLink', { defaultValue: 'لا يوجد رابط بحالة أو بطاقة' })
  const thMessages = t('thMessages', { defaultValue: 'الرسائل' })
  const thNoMessages = t('thNoMessages', { defaultValue: 'لا توجد رسائل بعد.' })
  const thFromParent = t('thFromParent', { defaultValue: 'من ولي الأمر' })
  const thFromTeacher = t('thFromTeacher', { defaultValue: 'من المعلّم' })
  const thReplyPlaceholder = t('thReplyPlaceholder', { defaultValue: 'اكتب ردّك هنا...' })
  const thSend = t('thSend', { defaultValue: 'إرسال' })
  const thSent = t('thSent', { defaultValue: 'تم إرسال الرد بنجاح.' })
  const thReplyFailed = t('thReplyFailed', { defaultValue: 'تعذّر إرسال الرد. حاول مرة أخرى.' })
  const thClose = t('thClose', { defaultValue: 'إغلاق المحادثة' })
  const thClosedDone = t('thClosedDone', { defaultValue: 'تم إغلاق المحادثة.' })
  const thCloseFailed = t('thCloseFailed', { defaultValue: 'تعذّر إغلاق المحادثة. حاول مرة أخرى.' })
  const thGovernance = t('thGovernance', { defaultValue: 'ملاحظة الحوكمة: الرسائل بشرية وتخضع للتدقيق.' })
  const thConsentGranted = t('thConsentGranted', { defaultValue: 'تم منح الموافقة' })

  const [children, setChildren] = useState<ThreadChild[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [thStatus, setThStatus] = useState<Status>('loading')
  const [thError, setThError] = useState('')
  const [thReloadKey, setThReloadKey] = useState(0)

  const [formCaseId, setFormCaseId] = useState('')
  const [formCardId, setFormCardId] = useState('')
  const [formSubject, setFormSubject] = useState('')
  const [formBody, setFormBody] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formNotice, setFormNotice] = useState('')
  const [formError, setFormError] = useState('')

  const [replyBodies, setReplyBodies] = useState<Record<string, string>>({})
  const [replySubmittingId, setReplySubmittingId] = useState<string | null>(null)
  const [replyNotices, setReplyNotices] = useState<Record<string, string>>({})
  const [replyErrors, setReplyErrors] = useState<Record<string, string>>({})

  const [closeSubmittingId, setCloseSubmittingId] = useState<string | null>(null)
  const [closeNotice, setCloseNotice] = useState('')
  const [closeError, setCloseError] = useState('')

  const thRetry = useCallback(() => setThReloadKey((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setThStatus('loading')
    setThError('')

    void (async () => {
      const [childrenResult, threadsResult] = await Promise.allSettled([
        apiGet<ChildrenResponse>('/parent/children', { signal: controller.signal }),
        selectedStudentId
          ? apiGet<ThreadsResponse>('/parent/threads', {
              signal: controller.signal,
              params: { studentId: selectedStudentId },
            })
          : Promise.resolve(null),
      ])

      if (cancelled) return

      if (childrenResult.status === 'fulfilled') {
        const list = Array.isArray(childrenResult.value.children) ? childrenResult.value.children : []
        setChildren(list)
        setSelectedStudentId((current) => {
          if (current && list.some((child) => child.id === current)) return current
          return list[0]?.id ?? null
        })
      }

      if (threadsResult.status === 'fulfilled') {
        const data = threadsResult.value
        setThreads(data && Array.isArray(data.threads) ? data.threads : [])
        setThStatus('ready')
      } else {
        setThError(thLoadError)
        setThStatus('error')
      }
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [thReloadKey, selectedStudentId, thLoadError])

  const resetForm = () => {
    setFormCaseId('')
    setFormCardId('')
    setFormSubject('')
    setFormBody('')
    setFormNotice('')
    setFormError('')
  }

  const createThread = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormNotice('')
    setFormError('')

    if (!formSubject.trim() || !formBody.trim() || !selectedStudentId) {
      setFormError(thRequired)
      return
    }

    setFormSubmitting(true)
    try {
      await apiPost<{ thread: Thread }>('/parent/threads', {
        studentId: selectedStudentId,
        ...(formCaseId.trim() ? { caseId: formCaseId.trim() } : {}),
        ...(formCardId.trim() ? { cardId: formCardId.trim() } : {}),
        subject: formSubject.trim(),
        body: formBody.trim(),
      })
      setFormNotice(thCreated)
      resetForm()
      setThReloadKey((value) => value + 1)
    } catch (requestError) {
      setFormError(extractApiError(requestError)?.message || thCreateFailed)
    } finally {
      setFormSubmitting(false)
    }
  }

  const replyToThread = async (id: string) => {
    const body = (replyBodies[id] ?? '').trim()
    if (!body) {
      setReplyErrors((current) => ({ ...current, [id]: thRequired }))
      return
    }

    setReplySubmittingId(id)
    setReplyNotices((current) => ({ ...current, [id]: '' }))
    setReplyErrors((current) => ({ ...current, [id]: '' }))
    try {
      await apiPost<{ thread: Thread }>('/parent/threads/reply', { id, body })
      setReplyNotices((current) => ({ ...current, [id]: thSent }))
      setReplyBodies((current) => ({ ...current, [id]: '' }))
      setThReloadKey((value) => value + 1)
    } catch (requestError) {
      setReplyErrors((current) => ({
        ...current,
        [id]: extractApiError(requestError)?.message || thReplyFailed,
      }))
    } finally {
      setReplySubmittingId(null)
    }
  }

  const closeThread = async (id: string) => {
    if (!window.confirm(thClose)) return
    setCloseSubmittingId(id)
    setCloseNotice('')
    setCloseError('')
    try {
      await apiPost<{ thread: Thread }>('/parent/threads/close', { id })
      setCloseNotice(thClosedDone)
      setThReloadKey((value) => value + 1)
    } catch (requestError) {
      setCloseError(extractApiError(requestError)?.message || thCloseFailed)
    } finally {
      setCloseSubmittingId(null)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <Inbox className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('messagesBadge', { defaultValue: 'صندوق الرسائل' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('messagesTitle', { defaultValue: 'المراسلات والتنبيهات' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              {t('messagesHint', { defaultValue: 'رسائل وتنبيهات موجهة لولي الأمر بخصوص أبنائه.' })}
            </p>
          </div>
          <button type="button" onClick={retry} disabled={status === 'loading'} className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0" aria-label={t('refresh', { defaultValue: 'تحديث' })}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-line bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('readOnly', { defaultValue: 'هذا الصندوق للقراءة فقط؛ لا تتوفر إمكانية إرسال رسائل من هذه الواجهة.' })}
      </div>

      {status === 'loading' ? (
        <div className="flex items-center gap-2 rounded-card border-2 border-line bg-surface p-5 text-sm font-bold text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t('loading', { defaultValue: 'جارٍ التحميل...' })}
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="text-sm font-bold text-[#E03131]">{error}</p>
          <button type="button" onClick={retry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : null}

      {status === 'ready' && totalItems === 0 ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('noMessages', { defaultValue: 'لا توجد رسائل أو تنبيهات حاليًا.' })}
        </p>
      ) : null}

      {status === 'ready' && totalItems > 0 ? (
        <section className="card-school overflow-hidden" aria-label={t('inbox', { defaultValue: 'الوارد' })}>
          <div className="flex items-center justify-between border-b-2 border-line px-5 py-3">
            <h2 className="text-sm font-black">{t('inbox', { defaultValue: 'الوارد' })}</h2>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-[10px] font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-200">
              {t('messageCount', { count: totalItems, defaultValue: '{{count}} عنصر' })}
            </span>
          </div>

          <ul className="divide-y divide-line">
            {alerts.map((item, index) => (
              <li key={`${item.id}-${index}`} className="flex items-start gap-3 px-5 py-4">
                <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.level === 'high' ? 'bg-[#E03131]' : 'bg-gold-500'}`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-black">
                      {item.type === 'talent'
                        ? t('talentNotice', { defaultValue: 'تنبيه موهبة' })
                        : t('schoolNotice', { defaultValue: 'إشعار مدرسي' })}
                    </p>
                    <span className="text-[10px] font-bold text-muted">{shortDate(item.date, locale)}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-muted">{item.message}</p>
                </div>
              </li>
            ))}

            {due.map((item, index) => (
              <li key={`${item.id}-${index}`} className="flex items-start gap-3 px-5 py-4">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-black">
                      {item.type === 'reassessment'
                        ? t('reassessmentNotice', { defaultValue: 'إعادة تقييم مسار التعلم' })
                        : t('reminderNotice', { defaultValue: 'تذكير بمراجعة' })}
                    </p>
                    <span className="text-[10px] font-bold text-muted">{shortDate(item.due, locale)}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-muted">
                    {item.message ?? t('review', { defaultValue: 'مراجعة مستحقة' })}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {engagementCount > 0 ? (
            <p className="border-t-2 border-line bg-surface-muted px-5 py-3 text-[11px] font-semibold text-muted">
              {t('engagementCount', { count: engagementCount, defaultValue: 'سجل التفاعل: {{count}} عملية' })}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* ==================== Two-way threads ==================== */}
      <section className="card-school overflow-hidden" aria-label={thTitle}>
        <div className="flex items-start justify-between gap-3 border-b-2 border-line bg-surface-muted px-5 py-4">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 font-display text-lg font-black text-content">
              <MessageCircle className="h-5 w-5 text-brand-600 dark:text-brand-300" aria-hidden="true" />
              {thTitle}
            </h2>
            <p className="mt-1 text-xs font-semibold text-muted">{thHint}</p>
          </div>
          <button
            type="button"
            onClick={thRetry}
            disabled={thStatus === 'loading'}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
            aria-label={thRefresh}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-start gap-2 border-b-2 border-line bg-brand-50 p-3 text-xs font-bold text-brand-900 dark:bg-brand-400/10 dark:text-brand-200">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="text-start">{thAdvisory}</p>
        </div>

        <div className="space-y-5 p-5">
          {/* Child selector */}
          <label className="block text-xs font-black text-content">
            {thSelectChild}
            <select
              className="input-school mt-1 w-full text-start"
              value={selectedStudentId ?? ''}
              onChange={(event) => {
                setSelectedStudentId(event.target.value || null)
                setCloseNotice('')
                setCloseError('')
              }}
              disabled={children.length === 0}
            >
              {children.length === 0 ? (
                <option value="">—</option>
              ) : (
                children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))
              )}
            </select>
          </label>

          {/* New thread form */}
          <form onSubmit={createThread} className="space-y-3 rounded-card border-2 border-line bg-surface-muted p-4">
            <h3 className="font-display text-sm font-black text-content">{thNewThread}</h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-black text-content">
                {thCase}
                <input
                  type="text"
                  className="input-school mt-1 w-full text-start"
                  value={formCaseId}
                  onChange={(event) => setFormCaseId(event.target.value)}
                />
              </label>
              <label className="block text-xs font-black text-content">
                {thCard}
                <input
                  type="text"
                  className="input-school mt-1 w-full text-start"
                  value={formCardId}
                  onChange={(event) => setFormCardId(event.target.value)}
                />
              </label>
            </div>

            <label className="block text-xs font-black text-content">
              {thSubject}
              <input
                type="text"
                className="input-school mt-1 w-full text-start"
                value={formSubject}
                onChange={(event) => setFormSubject(event.target.value)}
              />
            </label>

            <label className="block text-xs font-black text-content">
              {thBody}
              <textarea
                className="input-school mt-1 w-full text-start"
                rows={4}
                value={formBody}
                onChange={(event) => setFormBody(event.target.value)}
              />
            </label>

            {formNotice ? (
              <p className="flex items-center gap-1.5 text-xs font-bold text-[#2B8A3E]">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {formNotice}
              </p>
            ) : null}
            {formError ? (
              <p className="text-xs font-bold text-[#E03131]">{formError}</p>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="submit"
                className="btn-chunky btn-chunky--sm"
                disabled={formSubmitting || !selectedStudentId || thStatus === 'loading'}
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                {thCreate}
              </button>
              <button type="button" onClick={resetForm} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
                {thCancel}
              </button>
            </div>
          </form>

          {/* Threads list */}
          <div>
            <h3 className="font-display text-sm font-black text-content">{thThreads}</h3>

            {closeNotice ? (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#2B8A3E]">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {closeNotice}
              </p>
            ) : null}
            {closeError ? <p className="mt-2 text-xs font-bold text-[#E03131]">{closeError}</p> : null}

            {thStatus === 'loading' ? (
              <div className="mt-3 flex items-center gap-2 rounded-card border-2 border-line bg-surface p-5 text-sm font-bold text-muted">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {thLoading}
              </div>
            ) : null}

            {thStatus === 'error' ? (
              <div className="mt-3 flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
                <p className="text-sm font-bold text-[#E03131]">{thError}</p>
                <button type="button" onClick={thRetry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  {thRefresh}
                </button>
              </div>
            ) : null}

            {thStatus === 'ready' && threads.length === 0 ? (
              <p className="mt-3 rounded-card border-2 border-dashed border-line bg-surface p-6 text-center text-sm font-semibold text-muted">
                {thNoThreads}
              </p>
            ) : null}

            {thStatus === 'ready' && threads.length > 0 ? (
              <div className="mt-3 space-y-3">
                {threads.map((thread) => {
                  const isOpen = thread.status === 'open'
                  const consentGranted = String(thread.governance?.consent ?? '').toLowerCase() === 'granted'
                  const messages = Array.isArray(thread.messages) ? thread.messages : []

                  return (
                    <article key={thread.id} className="rounded-card border-2 border-line bg-surface p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-display text-sm font-black text-content">{thread.subject}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted">
                              <CalendarDays className="h-3 w-3" aria-hidden="true" />
                              {localizedDate(thread.createdAt, resolvedLanguage)}
                            </span>
                            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                              {isOpen ? thOpen : thClosed}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1 text-xs font-semibold text-muted">
                        {thread.caseId ? (
                          <p className="text-start">
                            <span className="font-black text-content">{thLinkedCase}:</span>{' '}
                            {thread.caseFocus ||
                              (thread.caseId
                                ? `${t('enumId', { defaultValue: 'المعرّف' })}: ${thread.caseId}`
                                : '—')}
                          </p>
                        ) : null}
                        {thread.cardId ? (
                          <p className="text-start">
                            <span className="font-black text-content">{thLinkedCard}:</span>{' '}
                            {thread.cardSummary ||
                              (thread.cardId
                                ? `${t('enumId', { defaultValue: 'المعرّف' })}: ${thread.cardId}`
                                : '—')}
                          </p>
                        ) : null}
                        {!thread.caseId && !thread.cardId ? (
                          <p className="text-start">{thNoLink}</p>
                        ) : null}
                      </div>

                      <p className="mt-2 flex items-start gap-1.5 text-[11px] font-semibold text-muted">
                        <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="text-start">
                          {thGovernance}
                          {consentGranted ? ` — ${thConsentGranted}` : ''}
                        </span>
                      </p>

                      <div className="mt-3 border-t-2 border-line pt-3">
                        <p className="text-xs font-black text-content">{thMessages}</p>
                        {messages.length === 0 ? (
                          <p className="mt-1 text-xs font-semibold text-muted">{thNoMessages}</p>
                        ) : (
                          <ul className="mt-2 space-y-2">
                            {messages.map((message, index) => (
                              <li key={`${message.id}-${index}`} className="rounded-card bg-surface-muted p-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                                    {message.fromRole === 'parent' ? thFromParent : thFromTeacher}
                                  </span>
                                  <span className="text-[10px] font-bold text-muted">
                                    {localizedDate(message.at, resolvedLanguage)}
                                  </span>
                                </div>
                                <p className="mt-1.5 whitespace-pre-wrap text-start text-xs font-semibold text-content">
                                  {message.body}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {isOpen ? (
                        <div className="mt-3 space-y-2 border-t-2 border-line pt-3">
                          <textarea
                            className="input-school w-full text-start"
                            rows={3}
                            placeholder={thReplyPlaceholder}
                            value={replyBodies[thread.id] ?? ''}
                            onChange={(event) =>
                              setReplyBodies((current) => ({ ...current, [thread.id]: event.target.value }))
                            }
                            disabled={replySubmittingId === thread.id}
                          />
                          {replyNotices[thread.id] ? (
                            <p className="flex items-center gap-1.5 text-xs font-bold text-[#2B8A3E]">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                              {replyNotices[thread.id]}
                            </p>
                          ) : null}
                          {replyErrors[thread.id] ? (
                            <p className="text-xs font-bold text-[#E03131]">{replyErrors[thread.id]}</p>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              className="btn-chunky btn-chunky--sm"
                              onClick={() => replyToThread(thread.id)}
                              disabled={replySubmittingId === thread.id || closeSubmittingId === thread.id}
                            >
                              <Send className="h-3.5 w-3.5" aria-hidden="true" />
                              {thSend}
                            </button>
                            <button
                              type="button"
                              className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                              onClick={() => closeThread(thread.id)}
                              disabled={replySubmittingId === thread.id || closeSubmittingId === thread.id}
                            >
                              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                              {thClose}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-3 flex items-center gap-1.5 border-t-2 border-line pt-3 text-xs font-bold text-muted">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {thClosed}
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
