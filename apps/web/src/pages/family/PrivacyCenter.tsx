import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2,
  FileLock2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

interface Child { id: string; name: string; level?: string; class?: string }
interface ChildrenResponse { children: Child[] }

type RequestStatus = 'pending' | 'approved' | 'declined' | 'acknowledged'
type RequestType = 'consent' | 'acknowledgement' | 'privacy'
type Decision = 'approved' | 'declined' | 'acknowledged'

interface ParentRequest {
  id: string
  studentId: string
  studentName?: string
  type: RequestType
  entityType?: string
  entityId?: string
  title?: string
  summary?: string
  status: RequestStatus
  requestedAt?: string
  decidedAt?: string
  decidedBy?: string
  decisionNote?: string
  advisory?: boolean
}
interface RequestsResponse { requests: ParentRequest[] }
interface DecideResponse { request: ParentRequest }
interface DecideBody { id: string; decision: Decision; note?: string }

interface Preferences {
  allowAnalytics: boolean
  allowCommunications: boolean
  language: string
  updatedAt: string | null
  updatedBy: string | null
}
interface Policy {
  auditDays: number
  draftsDays: number
  sessionsDays: number
  communicationsDays: number
  anonymizeAnalyticsAfterDays: number
}
interface Source {
  key: string
  label: string
  purpose: string
  retentionDays: number | null
  separate: boolean
}
interface AuditEntry {
  id: string
  action: string
  entityType: string
  entityId: string
  at: string
}
interface PrivacyData {
  preferences: Preferences
  policy: Policy
  sources: Source[]
  audit: AuditEntry[]
}
interface PreferencesBody {
  allowAnalytics?: boolean
  allowCommunications?: boolean
  language?: string
}
interface PreferencesResponse { preferences: Preferences }

type Status = 'idle' | 'loading' | 'ready' | 'error'
type RequestTab = 'pending' | 'history'

const LANGUAGE_CODES = ['ar', 'fr', 'en', 'amz'] as const

const LANGUAGE_KEYS: Record<string, string> = {
  ar: 'enumAr',
  fr: 'enumFr',
  en: 'enumEn',
  amz: 'enumAmz',
}
const LANGUAGE_DEFAULTS: Record<string, string> = {
  ar: 'العربية',
  fr: 'الفرنسية',
  en: 'الإنجليزية',
  amz: 'الأمازيغية',
}

const ENTITY_KEYS: Record<string, string> = {
  consent: 'enumConsent',
  acknowledgement: 'enumAcknowledgement',
  privacy: 'enumPrivacy',
  communication: 'enumCommunication',
  feedback_card: 'enumFeedbackCard',
  privacy_policy: 'enumPrivacyPolicy',
  parent_request: 'enumParentRequest',
  message_thread: 'enumMessageThread',
  lesson_plan: 'enumLessonPlan',
}
const ENTITY_DEFAULTS: Record<string, string> = {
  consent: 'موافقة',
  acknowledgement: 'إقرار',
  privacy: 'خصوصية',
  communication: 'مراسلة',
  feedback_card: 'بطاقة تغذية راجعة',
  privacy_policy: 'سياسة الخصوصية',
  parent_request: 'طلب ولي الأمر',
  message_thread: 'محادثة',
  lesson_plan: 'خطة درس',
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
  created: 'أُنشئ',
  updated: 'حُدّث',
  submitted: 'أُرسل',
  published: 'نُشر',
  closed: 'أُغلق',
  weekly_review: 'مراجعة أسبوعية',
  read: 'مقروء',
  decide: 'قرار',
  reply: 'رد',
}

function formatDate(value?: string): string {
  return value ? value.slice(0, 10) : '—'
}

export default function PrivacyCenter() {
  const { t } = useTranslation()
  const loadError = t('pcLoadError', {
    defaultValue: 'تعذّر تحميل بيانات الخصوصية والطلبات. حاول مرة أخرى.',
  })

  const [children, setChildren] = useState<Child[]>([])
  const [listStatus, setListStatus] = useState<Status>('loading')
  const [listError, setListError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [requests, setRequests] = useState<ParentRequest[]>([])
  const [privacy, setPrivacy] = useState<PrivacyData | null>(null)
  const [detailStatus, setDetailStatus] = useState<Status>('idle')
  const [detailError, setDetailError] = useState('')
  const [tab, setTab] = useState<RequestTab>('pending')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [actionNotice, setActionNotice] = useState('')
  const [actionError, setActionError] = useState('')

  const [allowAnalytics, setAllowAnalytics] = useState(false)
  const [allowCommunications, setAllowCommunications] = useState(false)
  const [language, setLanguage] = useState<string>('ar')
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [prefsNotice, setPrefsNotice] = useState('')
  const [prefsError, setPrefsError] = useState('')

  const [reloadKey, setReloadKey] = useState(0)
  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setListStatus('loading')
    setListError('')

    apiGet<ChildrenResponse>('/parent/children', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        const kids = Array.isArray(data.children) ? data.children : []
        setChildren(kids)
        setSelectedId((current) =>
          current && kids.some((kid) => kid.id === current) ? current : kids[0]?.id ?? null,
        )
        setListStatus('ready')
      })
      .catch(() => {
        if (!cancelled) {
          setListError(loadError)
          setListStatus('error')
        }
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, loadError])

  useEffect(() => {
    if (!selectedId) {
      setRequests([])
      setPrivacy(null)
      setDetailStatus('idle')
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setDetailStatus('loading')
    setDetailError('')

    Promise.all([
      apiGet<RequestsResponse>('/parent/requests', {
        params: { studentId: selectedId },
        signal: controller.signal,
      }),
      apiGet<PrivacyData>('/parent/privacy', {
        params: { studentId: selectedId },
        signal: controller.signal,
      }),
    ])
      .then(([requestData, privacyData]) => {
        if (cancelled) return
        setRequests(Array.isArray(requestData.requests) ? requestData.requests : [])
        setPrivacy(privacyData ?? null)
        const prefs = privacyData?.preferences
        if (prefs) {
          setAllowAnalytics(Boolean(prefs.allowAnalytics))
          setAllowCommunications(Boolean(prefs.allowCommunications))
          setLanguage(prefs.language || 'ar')
        }
        setDetailStatus('ready')
      })
      .catch(() => {
        if (!cancelled) {
          setDetailError(loadError)
          setDetailStatus('error')
        }
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [selectedId, reloadKey, loadError])

  const statusLabel = (value: RequestStatus): string => {
    if (value === 'approved') return t('pcApproved', { defaultValue: 'موافق عليه' })
    if (value === 'declined') return t('pcDeclined', { defaultValue: 'مرفوض' })
    if (value === 'acknowledged') return t('pcAcknowledged', { defaultValue: 'إقرار بالاطلاع' })
    return t('pcPending', { defaultValue: 'قيد الانتظار' })
  }

  const typeLabel = (value: RequestType): string => {
    if (value === 'consent') return t('pcConsent', { defaultValue: 'طلب موافقة' })
    if (value === 'acknowledgement') return t('pcAcknowledgement', { defaultValue: 'إقرار' })
    return t('pcPrivacyRequest', { defaultValue: 'طلب خصوصية' })
  }

  const decide = async (request: ParentRequest, decision: Decision) => {
    setSubmittingId(request.id)
    setActionNotice('')
    setActionError('')
    try {
      const note = (notes[request.id] ?? '').trim()
      const data = await apiPost<DecideResponse, DecideBody>('/parent/requests/decide', {
        id: request.id,
        decision,
        note: note || undefined,
      })
      const updated = data.request
      setRequests((current) => current.map((item) => (item.id === request.id ? updated : item)))
      setNotes((current) => {
        const next = { ...current }
        delete next[request.id]
        return next
      })
      setActionNotice(t('pcDecisionSaved', { defaultValue: 'تم حفظ القرار بنجاح.' }))
    } catch (error) {
      setActionError(
        extractApiError(error)?.message ||
          t('pcActionFailed', { defaultValue: 'تعذّر حفظ القرار. حاول مرة أخرى.' }),
      )
    } finally {
      setSubmittingId(null)
    }
  }

  const savePreferences = async () => {
    setSavingPrefs(true)
    setPrefsNotice('')
    setPrefsError('')
    try {
      const data = await apiPost<PreferencesResponse, PreferencesBody>(
        '/parent/privacy/preferences',
        { allowAnalytics, allowCommunications, language },
      )
      setPrivacy((current) => (current ? { ...current, preferences: data.preferences } : current))
      setPrefsNotice(t('pcPrefsSaved', { defaultValue: 'تم حفظ تفضيلات الخصوصية بنجاح.' }))
    } catch (error) {
      setPrefsError(
        extractApiError(error)?.message ||
          t('pcActionFailed', { defaultValue: 'تعذّر حفظ التفضيلات. حاول مرة أخرى.' }),
      )
    } finally {
      setSavingPrefs(false)
    }
  }

  const pendingRequests = requests.filter((request) => request.status === 'pending')
  const decidedRequests = requests.filter((request) => request.status !== 'pending')
  const selectedChild = children.find((kid) => kid.id === selectedId)

  const renderRequest = (request: ParentRequest) => {
    const isPending = request.status === 'pending'
    const busy = submittingId === request.id
    return (
      <article key={request.id} className="rounded-card border-2 border-line bg-surface p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
            {typeLabel(request.type)}
          </span>
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-black text-muted">
            {statusLabel(request.status)}
          </span>
          {request.advisory ? (
            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-200">
              <ShieldCheck className="me-1 inline h-3 w-3" aria-hidden="true" />
              {t('pcBadge', { defaultValue: 'مراجعة بشرية · استرشادي' })}
            </span>
          ) : null}
        </div>

        <h4 className="mt-3 font-display text-base font-black">
          {request.title ?? `${t('enumId', { defaultValue: 'المعرّف' })}: ${request.id}`}
        </h4>
        {request.summary ? (
          <p className="mt-1 text-xs font-semibold leading-relaxed text-muted">{request.summary}</p>
        ) : null}
        <p className="mt-2 text-[11px] font-bold text-muted">
          {t('pcRequested', { defaultValue: 'تاريخ الطلب' })}: {formatDate(request.requestedAt)}
        </p>

        {isPending ? (
          <div className="mt-3 space-y-3">
            <textarea
              value={notes[request.id] ?? ''}
              onChange={(event) =>
                setNotes((current) => ({ ...current, [request.id]: event.target.value }))
              }
              rows={2}
              disabled={busy}
              aria-label={t('pcNotePlaceholder', { defaultValue: 'ملاحظة اختيارية على القرار...' })}
              placeholder={t('pcNotePlaceholder', { defaultValue: 'ملاحظة اختيارية على القرار...' })}
              className="input-school w-full text-start"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => decide(request, 'approved')}
                className="btn-chunky btn-chunky--sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t('pcApprove', { defaultValue: 'موافقة' })}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => decide(request, 'declined')}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                {t('pcDecline', { defaultValue: 'رفض' })}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => decide(request, 'acknowledged')}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                {t('pcAcknowledge', { defaultValue: 'إقرار بالاطلاع' })}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-1 rounded-card bg-surface-muted p-3 text-[11px] font-semibold text-muted">
            <p>
              {t('pcDecided', { defaultValue: 'تاريخ القرار' })}: {formatDate(request.decidedAt)}
            </p>
            {request.decidedBy ? (
              <p>
                {t('pcDecisionBy', { defaultValue: 'جهة القرار' })}: {request.decidedBy}
              </p>
            ) : null}
            {request.decisionNote ? (
              <p>
                {t('pcDecisionNote', { defaultValue: 'ملاحظة القرار' })}: {request.decisionNote}
              </p>
            ) : null}
          </div>
        )}
      </article>
    )
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('pcBadge', { defaultValue: 'مراجعة بشرية · استرشادي' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('pcTitle', { defaultValue: 'مركز الموافقات والخصوصية' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              {t('pcHint', {
                defaultValue: 'راجع طلبات أبنائك، سجّل قرارك، وأدر تفضيلات الخصوصية بمراجعة بشرية كاملة.',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={retry}
            disabled={listStatus === 'loading' || detailStatus === 'loading'}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
            aria-label={t('pcRefresh', { defaultValue: 'تحديث' })}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('pcRefresh', { defaultValue: 'تحديث' })}</span>
          </button>
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('pcAdvisory', {
          defaultValue:
            'جميع المخرجات استرشادية فقط، وتخضع لمراجعة واعتماد بشري؛ ولا تُعدّ قرارًا رسميًا أو درجةً في بطاقة التقدير دون موافقة ولي الأمر.',
        })}
      </div>

      <section className="card-school p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[180px] flex-1">
            <label htmlFor="pc-child" className="text-[11px] font-black text-muted">
              {t('pcSelectChild', { defaultValue: 'اختر الطالب' })}
            </label>
            <select
              id="pc-child"
              value={selectedId ?? ''}
              onChange={(event) => setSelectedId(event.target.value || null)}
              className="input-school mt-1 w-full text-start"
            >
              {children.map((kid) => (
                <option key={kid.id} value={kid.id}>
                  {kid.name}
                </option>
              ))}
            </select>
          </div>
          {selectedChild ? (
            <p className="pb-2 text-xs font-bold text-muted">
              {selectedChild.level || selectedChild.class
                ? [
                    selectedChild.level
                      ? `${t('enumLevel', { defaultValue: 'المستوى' })}: ${selectedChild.level}`
                      : '',
                    selectedChild.class
                      ? `${t('enumClass', { defaultValue: 'الفصل' })}: ${selectedChild.class}`
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' • ')
                : '—'}
            </p>
          ) : null}
        </div>
      </section>

      {listStatus === 'loading' ? (
        <div className="flex items-center gap-2 rounded-card border-2 border-line bg-surface p-5 text-sm font-bold text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t('pcLoading', { defaultValue: 'جارٍ التحميل...' })}
        </div>
      ) : null}

      {listStatus === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="text-sm font-bold text-[#E03131]">{listError}</p>
          <button type="button" onClick={retry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('pcRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : null}

      {listStatus === 'ready' && children.length === 0 ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('pcNoRequests', { defaultValue: 'لا توجد طلبات مرتبطة بأبناء هذا الحساب.' })}
        </p>
      ) : null}

      {selectedId && detailStatus === 'loading' ? (
        <div className="flex items-center gap-2 rounded-card border-2 border-line bg-surface p-5 text-sm font-bold text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t('pcLoading', { defaultValue: 'جارٍ التحميل...' })}
        </div>
      ) : null}

      {selectedId && detailStatus === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="text-sm font-bold text-[#E03131]">{detailError}</p>
          <button type="button" onClick={retry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('pcRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : null}

      {selectedId && detailStatus === 'ready' && privacy && requests ? (
        <div className="space-y-5">
          <section className="card-school p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <FileLock2 className="h-5 w-5 text-brand-600" aria-hidden="true" />
                {t('pcRequestsTitle', { defaultValue: 'طلبات الموافقة والخصوصية' })}
              </h2>
              <div className="flex gap-2 rounded-full bg-surface-muted p-1">
                <button
                  type="button"
                  onClick={() => setTab('pending')}
                  aria-pressed={tab === 'pending'}
                  className={`rounded-full px-3 py-1 text-[11px] font-black transition ${
                    tab === 'pending'
                      ? 'bg-brand-500 text-white'
                      : 'text-muted'
                  }`}
                >
                  {t('pcPending', { defaultValue: 'قيد الانتظار' })}
                </button>
                <button
                  type="button"
                  onClick={() => setTab('history')}
                  aria-pressed={tab === 'history'}
                  className={`rounded-full px-3 py-1 text-[11px] font-black transition ${
                    tab === 'history'
                      ? 'bg-brand-500 text-white'
                      : 'text-muted'
                  }`}
                >
                  {t('pcHistoryTitle', { defaultValue: 'سجل القرارات' })}
                </button>
              </div>
            </div>

            {actionNotice ? (
              <p role="status" className="mt-3 rounded-card border-2 border-brand-300 bg-brand-soft p-3 text-xs font-bold text-brand-800 dark:text-brand-200">
                {actionNotice}
              </p>
            ) : null}
            {actionError ? (
              <p role="alert" className="mt-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-3 text-xs font-bold text-[#E03131]">
                {actionError}
              </p>
            ) : null}

            <div className="mt-4 space-y-3">
              {tab === 'pending' ? (
                pendingRequests.length === 0 ? (
                  <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
                    {t('pcNoRequests', { defaultValue: 'لا توجد طلبات بانتظار مراجعتك.' })}
                  </p>
                ) : (
                  pendingRequests.map(renderRequest)
                )
              ) : decidedRequests.length === 0 ? (
                <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
                  {t('pcNoHistory', { defaultValue: 'لا توجد قرارات سابقة بعد.' })}
                </p>
              ) : (
                decidedRequests.map(renderRequest)
              )}
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card-school p-5">
              <h2 className="font-display text-lg font-black">
                {t('pcPolicyTitle', { defaultValue: 'سياسة الاحتفاظ بالبيانات' })}
              </h2>
              <p className="mt-1 text-xs font-bold text-muted">
                {t('pcRetention', { defaultValue: 'مدد الاحتفاظ بالأيام' })}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  { label: t('pcAuditDays', { defaultValue: 'سجلات التدقيق' }), value: privacy.policy.auditDays },
                  { label: t('pcDraftsDays', { defaultValue: 'المسودّات' }), value: privacy.policy.draftsDays },
                  { label: t('pcSessionsDays', { defaultValue: 'جلسات المنصة' }), value: privacy.policy.sessionsDays },
                  { label: t('pcCommsDays', { defaultValue: 'المراسلات' }), value: privacy.policy.communicationsDays },
                  { label: t('pcAnonymizeDays', { defaultValue: 'إخفاء التحليلات بعد' }), value: privacy.policy.anonymizeAnalyticsAfterDays },
                ].map((item) => (
                  <div key={item.label} className="rounded-card border-2 border-line bg-surface-muted p-3">
                    <dt className="text-[11px] font-bold text-muted">{item.label}</dt>
                    <dd className="mt-1 font-display text-xl font-black text-brand-700 dark:text-brand-300">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="card-school p-5">
              <h2 className="font-display text-lg font-black">
                {t('pcSourcesTitle', { defaultValue: 'مصادر البيانات' })}
              </h2>
              {privacy.sources.length === 0 ? (
                <p className="mt-3 text-xs font-semibold text-muted">
                  {t('pcNoRequests', { defaultValue: 'لا توجد مصادر بيانات مسجّلة.' })}
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {privacy.sources.map((source) => (
                    <li key={source.key} className="rounded-card border-2 border-line bg-surface p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-black">{source.label}</p>
                        {source.separate ? (
                          <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                            {t('pcSeparationNote', {
                              defaultValue: 'مصدر منفصل — لا يُدمج في القرار الرسمي',
                            })}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-muted">{source.purpose}</p>
                      <p className="mt-1 text-[11px] font-bold text-muted">
                        {t('pcRetention', { defaultValue: 'مدة الاحتفاظ' })}: {source.retentionDays ?? '—'}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 rounded-card bg-gold-50 p-3 text-[11px] font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
                {t('pcSeparationNote', {
                  defaultValue: 'مصدر منفصل — لا يُدمج في القرار الرسمي',
                })}
              </p>
            </section>
          </div>

          <section className="card-school p-5">
            <h2 className="font-display text-lg font-black">
              {t('pcPrefsTitle', { defaultValue: 'تفضيلات الخصوصية' })}
            </h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 rounded-card border-2 border-line bg-surface p-3 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={allowAnalytics}
                  onChange={(event) => setAllowAnalytics(event.target.checked)}
                  className="h-4 w-4 accent-brand-600"
                />
                {t('pcAllowAnalytics', { defaultValue: 'السماح بتحليلات الاستخدام' })}
              </label>
              <label className="flex items-center gap-3 rounded-card border-2 border-line bg-surface p-3 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={allowCommunications}
                  onChange={(event) => setAllowCommunications(event.target.checked)}
                  className="h-4 w-4 accent-brand-600"
                />
                {t('pcAllowCommunications', { defaultValue: 'السماح بالمراسلات' })}
              </label>
              <div>
                <label htmlFor="pc-language" className="text-[11px] font-black text-muted">
                  {t('pcPreferredLanguage', { defaultValue: 'اللغة المفضّلة' })}
                </label>
                <select
                  id="pc-language"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="input-school mt-1 w-full text-start"
                >
                  {LANGUAGE_CODES.map((code) => (
                    <option key={code} value={code}>
                      {t(LANGUAGE_KEYS[code], { defaultValue: LANGUAGE_DEFAULTS[code] })}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={savePreferences}
                disabled={savingPrefs}
                className="btn-chunky btn-chunky--sm"
              >
                {savingPrefs ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {t('pcSavePrefs', { defaultValue: 'حفظ التفضيلات' })}
              </button>
              {prefsNotice ? (
                <p role="status" className="rounded-card border-2 border-brand-300 bg-brand-soft p-3 text-xs font-bold text-brand-800 dark:text-brand-200">
                  {prefsNotice}
                </p>
              ) : null}
              {prefsError ? (
                <p role="alert" className="rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-3 text-xs font-bold text-[#E03131]">
                  {prefsError}
                </p>
              ) : null}
            </div>
          </section>

          <section className="card-school p-5">
            <h2 className="font-display text-lg font-black">
              {t('pcAuditTitle', { defaultValue: 'سجل التدقيق' })}
            </h2>
            {privacy.audit.length === 0 ? (
              <p className="mt-3 rounded-card border-2 border-dashed border-line bg-surface-muted p-5 text-center text-sm font-semibold text-muted">
                {t('pcNoAudit', { defaultValue: 'لا توجد أحداث تدقيق حديثة.' })}
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {privacy.audit.map((entry) => (
                  <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 rounded-card border-2 border-line bg-surface p-3 text-[11px] font-semibold">
                    <span className="font-black">
                      {t(ACTION_KEYS[entry.action] || 'enumOther', {
                        defaultValue: ACTION_DEFAULTS[entry.action] || 'أخرى',
                      })}
                    </span>
                    <span className="text-muted">
                      {[
                        t(ENTITY_KEYS[entry.entityType] || 'enumOther', {
                          defaultValue: ENTITY_DEFAULTS[entry.entityType] || 'أخرى',
                        }),
                        `${t('enumId', { defaultValue: 'المعرّف' })}: ${entry.entityId}`,
                        formatDate(entry.at),
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
