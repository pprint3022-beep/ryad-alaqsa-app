import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, RefreshCw, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

interface AuditLog {
  id: string
  actorId?: string | null
  role?: string | null
  action: string
  entityType: string
  entityId?: string
  details?: Record<string, unknown>
  at: string
}

interface RetentionPolicy {
  auditDays?: number
  draftsDays?: number
  sessionsDays?: number
  communicationsDays?: number
  anonymizeAnalyticsAfterDays?: number
  [key: string]: number | undefined
}

interface Retention {
  retentionPolicy: RetentionPolicy
  storageType: string
  note: string
}

interface Integration {
  id: string
  name: string
  description?: string
}

interface ExperimentResult {
  id: string
  description?: string
  variants: string[]
  summary: Record<string, { count: number; mean: number; min: number; max: number }>
  totalAssignments: number
}

interface SystemStats {
  stats: Record<string, number>
  retentionPolicy?: RetentionPolicy | null
}

interface ApplyResponse {
  ok: boolean
  policy: RetentionPolicy
  removed: { audit: number; sessions: number }
}

interface GovernanceData {
  logs: AuditLog[] | null
  retention: Retention | null
  integrations: Integration[] | null
  experiments: string[] | null
  stats: SystemStats | null
}

const EMPTY: GovernanceData = { logs: null, retention: null, integrations: null, experiments: null, stats: null }

const TH = 'px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'px-3 py-2 text-[11px] font-semibold'
const BOX = 'overflow-x-auto rounded-card border-2 border-line bg-surface'

type EnumPair = readonly [string, string]

const POLICY_MAP: Record<string, EnumPair> = {
  auditdays: ['enumAuditDays', 'سجلات التدقيق'],
  draftsdays: ['enumDraftsDays', 'المسودات'],
  sessionsdays: ['enumSessionsDays', 'الجلسات'],
  communicationsdays: ['enumCommsDays', 'المراسلات'],
  anonymizeanalyticsafterdays: ['enumAnonymizeDays', 'إخفاء هوية التحليلات'],
}

const STAT_MAP: Record<string, EnumPair> = {
  users: ['enumStatUsers', 'المستخدمون'],
  students: ['enumStatStudents', 'التلاميذ'],
  classes: ['enumStatClasses', 'الأقسام'],
  competencies: ['enumStatCompetencies', 'الكفايات'],
  evidence: ['enumStatEvidence', 'الأدلة'],
  agentruns: ['enumStatAgentRuns', 'تشغيل الوكلاء'],
  auditlogs: ['enumStatAuditLogs', 'سجل التدقيق'],
  interventions: ['enumStatInterventions', 'التدخلات'],
  activities: ['enumStatActivities', 'الأنشطة'],
  feedbackcards: ['enumStatFeedbackCards', 'بطاقات التغذية الراجعة'],
  cases: ['enumStatCases', 'الحالات'],
}

const ROLE_MAP: Record<string, EnumPair> = {
  teacher: ['enumTeacher', 'المعلم'],
  director: ['enumDirector', 'المدير'],
  deputy: ['enumDeputy', 'النائب'],
  supervisor: ['enumSupervisor', 'المشرف'],
  clerk: ['enumClerk', 'الموظف'],
  admin: ['enumAdmin', 'الإدارة'],
  parent: ['enumParent', 'ولي الأمر'],
}

const ACTION_MAP: Record<string, EnumPair> = {
  created: ['enumCreated', 'أُنشئ'],
  updated: ['enumUpdated', 'حُدّث'],
  submitted: ['enumSubmitted', 'أُرسل'],
  published: ['enumPublished', 'منشورة'],
  closed: ['enumClosed', 'مغلق'],
  weekly_review: ['enumWeeklyReview', 'مراجعة أسبوعية'],
  read: ['enumRead', 'قراءة'],
  decide: ['enumDecided', 'قرار'],
  decided: ['enumDecided', 'قرار'],
  reply: ['enumReply', 'رد'],
  approved: ['enumApproved', 'معتمد'],
  sent: ['enumSent', 'مُرسَلة'],
  communication_created: ['enumCreated', 'أُنشئ'],
  communication_sent: ['enumSent', 'مُرسَلة'],
  feedback_card_status_changed: ['enumUpdated', 'حُدّث'],
  case_status_changed: ['enumUpdated', 'حُدّث'],
  status_changed: ['enumUpdated', 'حُدّث'],
  case_timeline_added: ['enumCreated', 'أُنشئ'],
  attendance_recorded: ['enumCreated', 'أُنشئ'],
  grades_recorded: ['enumCreated', 'أُنشئ'],
}

const ENTITY_MAP: Record<string, EnumPair> = {
  student: ['enumStudent', 'تلميذ'],
  students: ['enumStudent', 'تلميذ'],
  class: ['enumClass', 'قسم'],
  classes: ['enumClass', 'قسم'],
  activity: ['enumActivity', 'نشاط'],
  activities: ['enumActivity', 'نشاط'],
  library: ['enumLibrary', 'مكتبة'],
  case: ['enumCase', 'حالة'],
  cases: ['enumCase', 'حالة'],
  feedbackcard: ['enumFeedbackCard', 'بطاقة تغذية راجعة'],
  feedback_card: ['enumFeedbackCard', 'بطاقة تغذية راجعة'],
  communication: ['enumCommunication', 'مراسلة'],
  communications: ['enumCommunication', 'مراسلة'],
  lessonplan: ['enumLessonPlan', 'خطة درس'],
  lesson_plan: ['enumLessonPlan', 'خطة درس'],
  consent: ['enumConsent', 'موافقة'],
  acknowledgement: ['enumAcknowledgement', 'إقرار'],
  privacy: ['enumPrivacy', 'خصوصية'],
  privacypolicy: ['enumPrivacyPolicy', 'سياسة الخصوصية'],
  privacy_policy: ['enumPrivacyPolicy', 'سياسة الخصوصية'],
  parentrequest: ['enumParentRequest', 'طلب ولي الأمر'],
  parent_request: ['enumParentRequest', 'طلب ولي الأمر'],
  messagethread: ['enumMessageThread', 'سلسلة رسائل'],
  message_thread: ['enumMessageThread', 'سلسلة رسائل'],
  attendance: ['enumAttendance', 'حضور القسم'],
}

async function soft<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request
  } catch {
    return null
  }
}

function failureMessage(error: unknown, fallback: string): string {
  return extractApiError(error)?.message ?? fallback
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card-school p-5">
      <h2 className="mb-3 text-sm font-black">{title}</h2>
      {children}
    </section>
  )
}

export default function Governance() {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<GovernanceData>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)
  const [experimentId, setExperimentId] = useState('')
  const [experimentResult, setExperimentResult] = useState<ExperimentResult | null>(null)
  const [experimentLoading, setExperimentLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [applying, setApplying] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [applySummary, setApplySummary] = useState<ApplyResponse | null>(null)

  const locale = i18n.resolvedLanguage === 'ar' ? 'ar-MA' : i18n.resolvedLanguage ?? 'ar-MA'
  const number = (value: number) => new Intl.NumberFormat(locale).format(value)

  const fetchData = useCallback(async (): Promise<GovernanceData> => {
    const [logs, retention, integrations, experiments, stats] = await Promise.all([
      soft(apiGet<{ logs: AuditLog[] }>('/admin/audit-logs')).then((r) => r?.logs ?? null),
      soft(apiGet<Retention>('/admin/retention')),
      soft(apiGet<{ integrations: Integration[] }>('/admin/integrations')).then((r) => r?.integrations ?? null),
      soft(apiGet<{ experiments: string[] }>('/admin/ml/experiment')).then((r) => r?.experiments ?? null),
      soft(apiGet<SystemStats>('/admin/system-stats')),
    ])
    return { logs, retention, integrations, experiments, stats }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void fetchData().then((result) => {
      if (cancelled) return
      setData(result)
      if (!result.stats) {
        setError(t('admin.errorLoad', { defaultValue: 'تعذّر تحميل بيانات الحوكمة.' }))
      }
      setExperimentId((current) => current || (result.experiments?.[0] ?? ''))
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [fetchData, reload, t])

  useEffect(() => {
    if (!experimentId) {
      setExperimentResult(null)
      return
    }
    let cancelled = false
    setExperimentLoading(true)
    apiGet<{ results: ExperimentResult | null }>(`/admin/ml/experiment?id=${encodeURIComponent(experimentId)}`)
      .then((response) => { if (!cancelled) setExperimentResult(response.results ?? null) })
      .catch(() => { if (!cancelled) setExperimentResult(null) })
      .finally(() => { if (!cancelled) setExperimentLoading(false) })
    return () => { cancelled = true }
  }, [experimentId, reload])

  async function applyRetention() {
    setApplying(true)
    setActionError(null)
    setApplySummary(null)
    try {
      const response = await apiPost<ApplyResponse, undefined>('/admin/retention/apply')
      setApplySummary(response)
      setConfirming(false)
      setReload((n) => n + 1)
    } catch (err) {
      setActionError(failureMessage(err, t('admin.actionFailed', { defaultValue: 'تعذّر تطبيق سياسة الاحتفاظ.' })))
    } finally {
      setApplying(false)
    }
  }

  const { logs, retention, integrations, experiments, stats } = data
  const unavailable = t('admin.unavailable', { defaultValue: 'البيانات غير متاحة لهذا الحساب.' })
  const noData = t('admin.noData', { defaultValue: 'لا توجد بيانات.' })
  const enumText = (
    value: string,
    map: Record<string, EnumPair>,
    fallback: EnumPair = ['enumOther', 'أخرى'],
  ): string => {
    const raw = String(value ?? '')
    const pair = map[raw] ?? map[raw.toLowerCase()] ?? fallback
    return t(pair[0], { defaultValue: pair[1] })
  }

  return (
    <div className="space-y-5 animate-slide">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">{t('admin.governanceTitle', { defaultValue: 'الحوكمة والامتثال' })}</h1>
          <p className="mt-1 text-xs font-semibold text-muted">{t('admin.governanceHint', { defaultValue: 'سجل التدقيق، سياسة الاحتفاظ، التكاملات، وتجارب التحليل.' })}</p>
        </div>
        <button type="button" onClick={() => setReload((n) => n + 1)} disabled={loading} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {t('admin.refresh', { defaultValue: 'تحديث' })}
        </button>
      </div>

      {error ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-4 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
          <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{error}</span>
          <button type="button" onClick={() => setReload((n) => n + 1)} className="btn-chunky btn-chunky--danger btn-chunky--sm">{t('admin.retry', { defaultValue: 'إعادة المحاولة' })}</button>
        </div>
      ) : null}

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted"><Loader2 className="h-5 w-5 animate-spin" />{t('admin.loading', { defaultValue: 'جارٍ التحميل…' })}</div>
      ) : (
        <>
          {stats?.stats ? (
            <section aria-label={t('admin.systemStats', { defaultValue: 'إحصاءات النظام' })} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {Object.entries(stats.stats).map(([key, value]) => (
                <article key={key} className="card-school p-4">
                  <p className="truncate text-[11px] font-extrabold text-muted">{enumText(key, STAT_MAP)}</p>
                  <p className="mt-2 font-display text-2xl font-black leading-none text-brand-700 dark:text-brand-300">{number(value)}</p>
                </article>
              ))}
            </section>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title={t('admin.retentionPolicy', { defaultValue: 'سياسة الاحتفاظ بالبيانات' })}>
              {retention ? (
                <>
                  <p className="mb-3 rounded-card bg-surface-muted p-3 text-[11px] font-semibold leading-relaxed text-muted">{retention.note}</p>
                  <p className="mb-2 text-[11px] font-bold text-brand-700 dark:text-brand-300">{t('admin.storageType', { defaultValue: 'نوع التخزين' })}: {retention.storageType}</p>
                  <div className={BOX}>
                    <table className="w-full">
                      <thead className="bg-surface-muted"><tr>
                        <th className={TH}>{t('admin.policy', { defaultValue: 'السياسة' })}</th>
                        <th className={TH}>{t('admin.days', { defaultValue: 'الأيام' })}</th>
                      </tr></thead>
                      <tbody>
                        {Object.entries(retention.retentionPolicy ?? {}).map(([key, value]) => (
                          <tr key={key} className="border-t-2 border-line">
                            <td className={TD}>{enumText(key, POLICY_MAP)}</td>
                            <td className={TD}>{value === undefined ? '—' : number(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!confirming ? (
                    <button type="button" onClick={() => { setConfirming(true); setActionError(null) }} className="btn-chunky btn-chunky--danger btn-chunky--sm mt-3">
                      <Trash2 className="h-3.5 w-3.5" />{t('admin.applyRetention', { defaultValue: 'تطبيق السياسة وحذف المنتهي' })}
                    </button>
                  ) : (
                    <div role="alertdialog" className="mt-3 rounded-card border-2 border-[#E03131] bg-[#E03131]/10 p-3">
                      <p className="flex items-start gap-2 text-xs font-bold text-[#b42318] dark:text-[#ff8787]">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        {t('admin.confirmRetention', { defaultValue: 'سيتم حذف السجلات والجلسات المنتهية نهائيًا. هذا الإجراء لا يمكن التراجع عنه.' })}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" disabled={applying} onClick={() => void applyRetention()} className="btn-chunky btn-chunky--danger btn-chunky--sm">
                          {applying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                          {t('admin.confirmApply', { defaultValue: 'تأكيد التطبيق' })}
                        </button>
                        <button type="button" disabled={applying} onClick={() => setConfirming(false)} className="btn-chunky btn-chunky--secondary btn-chunky--sm">{t('admin.cancel', { defaultValue: 'إلغاء' })}</button>
                      </div>
                    </div>
                  )}
                  {actionError ? <p role="alert" className="mt-3 rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-3 text-xs font-bold text-[#b42318] dark:text-[#ff8787]">{actionError}</p> : null}
                  {applySummary ? (
                    <p role="status" className="mt-3 rounded-card border-2 border-brand-300 bg-brand-soft p-3 text-xs font-bold text-brand-800 dark:text-brand-200">
                      {t('admin.removedSummary', { defaultValue: 'تم حذف {{audit}} سجل تدقيق و{{sessions}} جلسة.', audit: applySummary.removed.audit, sessions: applySummary.removed.sessions })}
                    </p>
                  ) : null}
                </>
              ) : <p className="text-xs font-semibold text-muted">{unavailable}</p>}
            </Panel>

            <Panel title={t('admin.integrations', { defaultValue: 'التكاملات المؤسسية' })}>
              {integrations?.length ? (
                <ul className="space-y-2">
                  {integrations.map((item) => (
                    <li key={item.id} className="rounded-card border-2 border-line bg-surface-muted p-3">
                      <p className="text-xs font-extrabold">{item.name}</p>
                      <p className="mt-1 text-[11px] font-semibold text-muted">{item.description ?? '—'}</p>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-xs font-semibold text-muted">{integrations ? noData : unavailable}</p>}
            </Panel>
          </div>

          <Panel title={t('admin.auditTrail', { defaultValue: 'سجل التدقيق' })}>
            {logs?.length ? (
              <div className={`${BOX} max-h-96`}>
                <table className="w-full">
                  <thead className="bg-surface-muted"><tr>
                    <th className={TH}>{t('admin.at', { defaultValue: 'الوقت' })}</th>
                    <th className={TH}>{t('admin.actor', { defaultValue: 'المستخدم' })}</th>
                    <th className={TH}>{t('admin.action', { defaultValue: 'الإجراء' })}</th>
                    <th className={TH}>{t('admin.entity', { defaultValue: 'الكيان' })}</th>
                    <th className={TH}>{t('admin.details', { defaultValue: 'تفاصيل' })}</th>
                  </tr></thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-t-2 border-line">
                        <td className={TD}>{log.at}</td>
                        <td className={TD}>{t('enumId', { defaultValue: 'المعرّف' })}: {log.actorId ?? '—'}{log.role ? ` (${enumText(log.role, ROLE_MAP)})` : ''}</td>
                        <td className={TD}>{enumText(log.action, ACTION_MAP)}</td>
                        <td className={TD}>{enumText(log.entityType, ENTITY_MAP)}{log.entityId ? ` / ${t('enumId', { defaultValue: 'المعرّف' })}: ${log.entityId}` : ''}</td>
                        <td className={TD}>{log.details ? JSON.stringify(log.details) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-xs font-semibold text-muted">{logs ? noData : unavailable}</p>}
          </Panel>

          <Panel title={t('admin.experiments', { defaultValue: 'تجارب التحليل (A/B)' })}>
            {experiments?.length ? (
              <>
                <select value={experimentId} onChange={(e) => setExperimentId(e.target.value)} className="input-school mb-3 max-w-sm text-sm">
                  {experiments.map((id) => <option key={id} value={id}>{id}</option>)}
                </select>
                {experimentLoading ? (
                  <p className="flex items-center gap-2 text-xs font-semibold text-muted"><Loader2 className="h-4 w-4 animate-spin" />{t('admin.loading', { defaultValue: 'جارٍ التحميل…' })}</p>
                ) : experimentResult ? (
                  <div className={BOX}>
                    <table className="w-full">
                      <thead className="bg-surface-muted"><tr>
                        <th className={TH}>{t('admin.variant', { defaultValue: 'النسخة' })}</th>
                        <th className={TH}>{t('admin.count', { defaultValue: 'العدد' })}</th>
                        <th className={TH}>{t('admin.mean', { defaultValue: 'المتوسط' })}</th>
                        <th className={TH}>{t('admin.min', { defaultValue: 'الأدنى' })}</th>
                        <th className={TH}>{t('admin.max', { defaultValue: 'الأعلى' })}</th>
                      </tr></thead>
                      <tbody>
                        {Object.entries(experimentResult.summary ?? {}).map(([variant, summary]) => (
                          <tr key={variant} className="border-t-2 border-line">
                            <td className={TD}>{variant}</td>
                            <td className={TD}>{number(summary.count)}</td>
                            <td className={TD}>{number(summary.mean)}</td>
                            <td className={TD}>{number(summary.min)}</td>
                            <td className={TD}>{number(summary.max)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-muted">{t('admin.noExperimentData', { defaultValue: 'لا توجد نتائج مسجلة لهذه التجربة.' })}</p>
                )}
              </>
            ) : <p className="text-xs font-semibold text-muted">{experiments ? noData : unavailable}</p>}
          </Panel>
        </>
      )}
    </div>
  )
}
