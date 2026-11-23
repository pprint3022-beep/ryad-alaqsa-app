import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2,
  Loader2,
  MessageCircle,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

interface Governance {
  requiresApproval: boolean
  consent: string
  initiator: string
}

interface ThreadMessage {
  id: string
  from: string
  fromRole: 'parent' | 'teacher'
  body: string
  at: string
}

interface Thread {
  id: string
  studentId: string
  studentName: string
  className: string
  classId: string
  caseId: string | null
  cardId: string | null
  caseFocus: string
  cardSummary: string
  subject: string
  status: 'open' | 'closed'
  createdAt: string
  createdBy: string
  createdByRole: string
  lastActivityAt: string
  communicationId: string
  governance: Governance
  messages: ThreadMessage[]
}

interface ThreadsResponse {
  threads: Thread[]
  meta: { statuses: string[] }
}

interface ThreadMutationResponse {
  thread: Thread
}

interface ReplyBody {
  id: string
  body: string
}

interface CloseBody {
  id: string
}

function messageOf(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div
      className={`rounded-card border-2 p-3 text-xs font-bold ${
        error
          ? 'border-[#E03131]/30 bg-[#E03131]/10 text-[#E03131]'
          : 'border-line bg-surface-muted text-muted'
      }`}
    >
      {children}
    </div>
  )
}

export default function Threads() {
  const { t, i18n } = useTranslation()

  const loadError = t('thTeacherLoadError', { defaultValue: 'تعذّر تحميل المحادثات. يرجى المحاولة مرة أخرى.' })
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  const [studentFilter, setStudentFilter] = useState('all')
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [replyError, setReplyError] = useState<Record<string, string>>({})
  const [replySuccess, setReplySuccess] = useState<Record<string, boolean>>({})
  const [closingId, setClosingId] = useState<string | null>(null)
  const [closeError, setCloseError] = useState<Record<string, string>>({})
  const [closeSuccess, setCloseSuccess] = useState<Record<string, boolean>>({})

  const locale =
    i18n.resolvedLanguage === 'ar'
      ? 'ar-MA'
      : i18n.resolvedLanguage === 'amz'
        ? 'fr'
        : (i18n.resolvedLanguage ?? 'ar-MA')

  const formatDate = (value?: string): string => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setError(null)

    apiGet<ThreadsResponse>('/teacher/threads', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        setThreads(Array.isArray(data.threads) ? data.threads : [])
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(messageOf(err, loadError))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, loadError])

  const students = Array.from(
    new Map(
      threads.map((thread) => [thread.studentId, { id: thread.studentId, name: thread.studentName }]),
    ).values(),
  )
  const visibleThreads =
    studentFilter === 'all'
      ? threads
      : threads.filter((thread) => thread.studentId === studentFilter)
  const openCount = visibleThreads.filter((thread) => thread.status === 'open').length
  const closedCount = visibleThreads.filter((thread) => thread.status === 'closed').length

  const sendReply = async (thread: Thread): Promise<void> => {
    const body = (replyDrafts[thread.id] || '').trim()
    if (!body) return
    setReplyingId(thread.id)
    setReplyError((current) => ({ ...current, [thread.id]: '' }))
    setReplySuccess((current) => ({ ...current, [thread.id]: false }))
    try {
      const response = await apiPost<ThreadMutationResponse, ReplyBody>('/teacher/threads/reply', {
        id: thread.id,
        body,
      })
      setThreads((current) =>
        current.map((item) => (item.id === response.thread.id ? response.thread : item)),
      )
      setReplyDrafts((current) => ({ ...current, [thread.id]: '' }))
      setReplySuccess((current) => ({ ...current, [thread.id]: true }))
    } catch (err: unknown) {
      const parsed = extractApiError(err)
      if (parsed?.error === 'governance') {
        const prefix = t('thGovernanceBlocked', { defaultValue: 'لم يُسمح بإرسال الرد بسبب قواعد الحكامة أو الخصوصية: ' })
        setReplyError((current) => ({
          ...current,
          [thread.id]: parsed.message ? `${prefix} — ${parsed.message}` : prefix,
        }))
      } else {
        const fallback = t('thReplyFailed', { defaultValue: 'تعذّر إرسال الرد. يرجى المحاولة مرة أخرى.' })
        setReplyError((current) => ({
          ...current,
          [thread.id]: parsed?.message ? `${fallback} — ${parsed.message}` : fallback,
        }))
      }
    } finally {
      setReplyingId(null)
    }
  }

  const closeThread = async (thread: Thread): Promise<void> => {
    setClosingId(thread.id)
    setCloseError((current) => ({ ...current, [thread.id]: '' }))
    setCloseSuccess((current) => ({ ...current, [thread.id]: false }))
    try {
      const response = await apiPost<ThreadMutationResponse, CloseBody>('/teacher/threads/close', {
        id: thread.id,
      })
      setThreads((current) =>
        current.map((item) => (item.id === response.thread.id ? response.thread : item)),
      )
      setCloseSuccess((current) => ({ ...current, [thread.id]: true }))
    } catch (err: unknown) {
      const fallback = t('thCloseFailed', { defaultValue: 'تعذّر إغلاق المحادثة.' })
      const detail = messageOf(err, '')
      setCloseError((current) => ({
        ...current,
        [thread.id]: detail ? `${fallback} — ${detail}` : fallback,
      }))
    } finally {
      setClosingId(null)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-black sm:text-3xl">
              {t('thTeacherTitle', { defaultValue: 'محادثات الأسر' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              {t('thTeacherHint', { defaultValue: 'محادثات الطلاب ضمن نطاق فصولك، مرتبطة بالحالة أو البطاقة.' })}
            </p>
          </div>
          <button
            type="button"
            onClick={retry}
            disabled={loading}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
            aria-label={t('thTeacherRefresh', { defaultValue: 'تحديث' })}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('thTeacherRefresh', { defaultValue: 'تحديث' })}</span>
          </button>
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="text-start">{t('thAdvisory', { defaultValue: 'المراسلات مكتوبة بأيدٍ بشرية وموثّقة بالتدقيق؛ لا يوجد رد آلي، وتخضع إجابات المعلم لموافقة الخصوصية.' })}</span>
      </div>

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('thTeacherLoading', { defaultValue: 'جارٍ تحميل المحادثات...' })}
        </div>
      ) : error ? (
        <div className="space-y-3">
          <Notice error>{error}</Notice>
          <button
            type="button"
            onClick={retry}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t('thTeacherRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : (
        <>
          <section className="card-school p-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-[180px] flex-1">
                <label htmlFor="th-student" className="text-[11px] font-black text-muted">
                  {t('thTeacherSelectChild', { defaultValue: 'تصفية حسب التلميذ' })}
                </label>
                <select
                  id="th-student"
                  value={studentFilter}
                  onChange={(event) => setStudentFilter(event.target.value || 'all')}
                  className="input-school mt-1 w-full text-start"
                >
                  <option value="all">{t('thTeacherSelectChild', { defaultValue: 'تصفية حسب التلميذ' })}</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                  {t('thTeacherOpenCount', { defaultValue: 'محادثات مفتوحة' })} · {openCount}
                </span>
                <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-black text-muted">
                  {t('thTeacherClosedCount', { defaultValue: 'محادثات مغلقة' })} · {closedCount}
                </span>
              </div>
            </div>
          </section>

          <section className="space-y-4" aria-label={t('thTeacherThreads', { defaultValue: 'محادثات الطلاب' })}>
            <h2 className="font-display text-lg font-black">
              {t('thTeacherThreads', { defaultValue: 'محادثات الطلاب' })}
            </h2>

            {visibleThreads.length === 0 ? (
              <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
                {t('thTeacherNoThreads', { defaultValue: 'لا توجد محادثات ضمن نطاقك.' })}
              </p>
            ) : (
              <div className="grid gap-4">
                {visibleThreads.map((thread) => (
                  <article
                    key={thread.id}
                    className="card-school rounded-card border-2 border-line bg-surface p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-black text-content">
                          {thread.subject}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-muted">
                          {thread.studentName} · {thread.className}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                          thread.status === 'open'
                            ? 'bg-brand-soft text-brand-700 dark:text-brand-300'
                            : 'bg-surface-muted text-muted'
                        }`}
                      >
                        {thread.status === 'open'
                          ? t('thOpen', { defaultValue: 'مفتوحة' })
                          : t('thClosed', { defaultValue: 'مغلقة' })}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-muted">
                      {thread.caseId ? (
                        <span className="rounded-card bg-surface-muted px-2 py-1 text-start">
                          <span className="font-black text-content">
                            {t('thLinkedCase', { defaultValue: 'الحالة المرتبطة' })}:
                          </span>{' '}
                          {thread.caseFocus}
                        </span>
                      ) : null}
                      {thread.cardId ? (
                        <span className="rounded-card bg-surface-muted px-2 py-1 text-start">
                          <span className="font-black text-content">
                            {t('thLinkedCard', { defaultValue: 'البطاقة المرتبطة' })}:
                          </span>{' '}
                          {thread.cardSummary}
                        </span>
                      ) : null}
                      {!thread.caseId && !thread.cardId ? (
                        <span className="rounded-card bg-surface-muted px-2 py-1">
                          {t('thNoLink', { defaultValue: 'بدون رابط' })}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-card bg-surface-muted px-3 py-2 text-[11px] font-semibold text-muted">
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                        {t('thGovernance', { defaultValue: 'الحكامة' })}
                      </span>
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                        {thread.governance?.consent === 'granted'
                          ? t('enumGranted', { defaultValue: 'ممنوحة' })
                          : thread.governance?.consent === 'declined'
                            ? t('enumDeclined', { defaultValue: 'مرفوضة' })
                            : t('enumPending', { defaultValue: 'قيد الانتظار' })}
                      </span>
                      <span className="text-start">
                        {thread.governance?.initiator === 'teacher'
                          ? t('enumTeacher', { defaultValue: 'المعلم' })
                          : thread.governance?.initiator === 'parent'
                            ? t('enumParent', { defaultValue: 'ولي الأمر' })
                            : (thread.governance?.initiator ?? '—')}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-semibold text-muted">
                      <span>{formatDate(thread.createdAt)}</span>
                      <span>{formatDate(thread.lastActivityAt)}</span>
                    </div>

                    <div className="mt-4 border-t-2 border-line pt-4">
                      <h4 className="flex items-center gap-2 text-sm font-black">
                        <MessageCircle className="h-4 w-4 text-brand-600" aria-hidden="true" />
                        {t('thMessages', { defaultValue: 'الرسائل' })}
                      </h4>

                      {thread.messages?.length ? (
                        <ul className="mt-3 space-y-2 ps-1">
                          {thread.messages.map((message) => (
                            <li
                              key={message.id}
                              className="rounded-card border-2 border-line bg-surface-muted p-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                                    message.fromRole === 'teacher'
                                      ? 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
                                      : 'bg-brand-soft text-brand-700 dark:text-brand-300'
                                  }`}
                                >
                                  {message.fromRole === 'teacher'
                                    ? t('thFromTeacher', { defaultValue: 'المعلم' })
                                    : t('thFromParent', { defaultValue: 'ولي الأمر' })}
                                </span>
                                <span className="text-[10px] font-bold text-muted">
                                  {formatDate(message.at)}
                                </span>
                              </div>
                              <p className="mt-2 text-start text-sm font-semibold text-content">
                                {message.body}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 rounded-card bg-surface-muted p-3 text-center text-xs font-semibold text-muted">
                          {t('thNoMessages', { defaultValue: 'لا توجد رسائل بعد.' })}
                        </p>
                      )}
                    </div>

                    {thread.status === 'open' ? (
                      <div className="mt-4 space-y-3 border-t-2 border-line pt-4">
                        <textarea
                          aria-label={t('thReplyPlaceholder', { defaultValue: 'اكتب ردّك هنا...' })}
                          className="input-school min-h-20 w-full text-start"
                          value={replyDrafts[thread.id] || ''}
                          onChange={(event) =>
                            setReplyDrafts((current) => ({
                              ...current,
                              [thread.id]: event.target.value,
                            }))
                          }
                          placeholder={t('thReplyPlaceholder', { defaultValue: 'اكتب ردّك هنا...' })}
                        />

                        {replyError[thread.id] ? (
                          <Notice error>{replyError[thread.id]}</Notice>
                        ) : null}
                        {replySuccess[thread.id] ? (
                          <p className="flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            {t('thSent', { defaultValue: 'تم إرسال الرد.' })}
                          </p>
                        ) : null}
                        {closeError[thread.id] ? (
                          <Notice error>{closeError[thread.id]}</Notice>
                        ) : null}
                        {closeSuccess[thread.id] ? (
                          <p className="flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            {t('thClosedDone', { defaultValue: 'تم إغلاق المحادثة.' })}
                          </p>
                        ) : null}

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => void sendReply(thread)}
                            disabled={replyingId === thread.id || closingId === thread.id}
                            className="btn-chunky btn-chunky--primary btn-chunky--sm"
                          >
                            {replyingId === thread.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : (
                              <Send className="h-4 w-4" aria-hidden="true" />
                            )}
                            {t('thSend', { defaultValue: 'إرسال الرد' })}
                          </button>
                          <button
                            type="button"
                            onClick={() => void closeThread(thread)}
                            disabled={replyingId === thread.id || closingId === thread.id}
                            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                          >
                            {closingId === thread.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            ) : null}
                            {t('thClose', { defaultValue: 'إغلاق المحادثة' })}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
