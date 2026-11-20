import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react'
import { apiGet } from '../../lib/api'

interface Trend {
  period: string
  students: number
  withGaps: number
  feedbackCards: number
  interventions: number
  activities: number
  publications: number
}

interface Overview {
  attendanceRate?: number
  studentsPresent: number
  levels: Array<{ name: string; classes: number }>
  auditCount: number
  feedbackPending: number
  activeCases: number
  reassessmentDue: number
  competencyRefs: number
  withGaps: number
  gifted: number
  activeInterventions: number
  outreachActivities: number
  publications: number
}

interface Performance {
  byLevel: Array<{ level: string; students: number; average: string | null }>
}

interface LearningAnalytics {
  summary: {
    students: number
    withGaps: number
    gifted: number
    activeInterventions: number
    alerts: number
  }
  insights: unknown[]
  activities: unknown[]
}

interface ImpactReport {
  generatedAt?: string
  period?: string
  summary: {
    totalStudents: number
    totalFeedbackCards: number
    approvedCards: number
    inProgressCards: number
    completedCards: number
    activeCases: number
    activeInterventions: number
    outreachActivities: number
    publications: number
  }
  reassessmentDue: Array<{ type: string; studentId: string; id?: string; due?: string }>
  impactLog: Array<{
    studentId: string
    indicator: string
    baseline: number
    target: number
    current: number
    progress: number
  }>
  trends: Trend[]
}

interface AnonymizedAggregate {
  count: number
  avgMastery: number
  gapRate: number
  giftedRate: number
  anonymized: boolean
  minGroupSize: number
}

interface Anonymized {
  anonymized: AnonymizedAggregate | null
  trends: Trend[]
  policy: { minGroupSize: number; note: string }
}

interface Finance {
  finance: {
    currency?: string
    monthly: Array<{ month: string; income: number; expenses: number; salaries: number }>
    categories?: unknown
  }
  salaries: { total: number; count: number }
}

interface Strategy {
  strategy: {
    vision?: string
    pillars?: string[]
    initiatives?: Array<{ title: string; progress: number; owner?: string }>
  }
  goals: unknown
  competitors: unknown
  partnerships: unknown
}

interface ReportsData {
  overview: Overview | null
  performance: Performance | null
  learning: LearningAnalytics | null
  impact: ImpactReport | null
  anonymized: Anonymized | null
  finance: Finance | null
  strategy: Strategy | null
}

const EMPTY_DATA: ReportsData = {
  overview: null,
  performance: null,
  learning: null,
  impact: null,
  anonymized: null,
  finance: null,
  strategy: null,
}

const TH = 'px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'px-3 py-2 text-[11px] font-semibold'
const TABLE_BOX = 'overflow-x-auto rounded-card border-2 border-line bg-surface'

type EnumPair = readonly [string, string]

const INDICATOR_MAP: Record<string, EnumPair> = {
  attendance: ['enumAttendance', 'حضور القسم'],
  homework: ['enumHomework', 'الواجبات'],
  mood: ['enumMood', 'المزاج'],
  practice: ['enumPractice', 'التدريب'],
  engagement: ['enumEngagement', 'زمن المنصة'],
}

const TYPE_MAP: Record<string, EnumPair> = {
  feedbackcard: ['enumFeedbackCard', 'بطاقة تغذية راجعة'],
  feedback_card: ['enumFeedbackCard', 'بطاقة تغذية راجعة'],
  case: ['enumCase', 'حالة'],
  activity: ['enumActivity', 'نشاط'],
  student: ['enumStudent', 'تلميذ'],
  communication: ['enumCommunication', 'مراسلة'],
  lessonplan: ['enumLessonPlan', 'خطة درس'],
  lesson_plan: ['enumLessonPlan', 'خطة درس'],
}

async function soft<T>(request: Promise<T>): Promise<T | null> {
  try {
    return await request
  } catch {
    return null
  }
}

function Kpi({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone: string }) {
  return (
    <article className="card-school p-4">
      <p className="text-xs font-extrabold text-muted">{label}</p>
      <p className={`mt-2 font-display text-2xl font-black leading-none ${tone}`}>{value}</p>
      {hint ? <p className="mt-2 text-[11px] font-semibold text-muted">{hint}</p> : null}
    </article>
  )
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card-school p-5">
      <h2 className="mb-3 text-sm font-black">{title}</h2>
      {children}
    </section>
  )
}

export default function Reports() {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<ReportsData>(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)

  const locale = i18n.resolvedLanguage === 'ar' ? 'ar-MA' : i18n.resolvedLanguage ?? 'ar-MA'
  const number = (value: number) => new Intl.NumberFormat(locale).format(value)

  const fetchAll = useCallback(async (): Promise<ReportsData> => {
    const [overview, performance, learning, impactEnvelope, anonymized, finance, strategy] = await Promise.all([
      soft(apiGet<Overview>('/admin/overview')),
      soft(apiGet<Performance>('/admin/performance')),
      soft(apiGet<LearningAnalytics>('/admin/learning-analytics')),
      soft(apiGet<{ report: ImpactReport }>('/admin/impact-report')),
      soft(apiGet<Anonymized>('/admin/analytics/anonymized')),
      soft(apiGet<Finance>('/admin/finance')),
      soft(apiGet<Strategy>('/admin/strategy')),
    ])
    return {
      overview,
      performance,
      learning,
      impact: impactEnvelope?.report ?? null,
      anonymized,
      finance,
      strategy,
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void fetchAll().then((result) => {
      if (cancelled) return
      if (!result.overview) {
        setError(t('admin.errorLoad', { defaultValue: 'تعذّر تحميل بيانات التقارير.' }))
      }
      setData(result)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [fetchAll, reload, t])

  const { overview, performance, learning, impact, anonymized, finance, strategy } = data
  const unavailable = t('admin.unavailable', { defaultValue: 'البيانات غير متاحة لهذا الحساب.' })
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
          <h1 className="font-display text-2xl font-black">
            {t('admin.reportsTitle', { defaultValue: 'التقارير والتحليلات' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('admin.reportsHint', { defaultValue: 'مؤشرات التشغيل والأثر والتحليلات المجمّعة من الخادم.' })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReload((n) => n + 1)}
          disabled={loading}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {t('admin.refresh', { defaultValue: 'تحديث' })}
        </button>
      </div>

      {error ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-4 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
          <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{error}</span>
          <button type="button" onClick={() => setReload((n) => n + 1)} className="btn-chunky btn-chunky--danger btn-chunky--sm">
            {t('admin.retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          {t('admin.loading', { defaultValue: 'جارٍ تحميل التقارير…' })}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <section aria-label={t('admin.kpis', { defaultValue: 'مؤشرات الأداء' })} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label={t('admin.studentsPresent', { defaultValue: 'التلاميذ المسجلون' })} value={number(overview?.studentsPresent ?? impact?.summary.totalStudents ?? 0)} tone="text-brand-700 dark:text-brand-300" />
            <Kpi label={t('admin.withGaps', { defaultValue: 'حالات الفجوات' })} value={number(overview?.withGaps ?? learning?.summary.withGaps ?? 0)} tone="text-gold-700 dark:text-gold-300" />
            <Kpi label={t('admin.gifted', { defaultValue: 'الموهوبون' })} value={number(overview?.gifted ?? learning?.summary.gifted ?? 0)} tone="text-brand-600 dark:text-brand-400" />
            <Kpi label={t('admin.activeInterventions', { defaultValue: 'التدخلات النشطة' })} value={number(overview?.activeInterventions ?? impact?.summary.activeInterventions ?? 0)} tone="text-gold-600 dark:text-gold-400" />
            <Kpi label={t('admin.feedbackPending', { defaultValue: 'بطاقات بانتظار المراجعة' })} value={number(overview?.feedbackPending ?? impact?.summary.totalFeedbackCards ?? 0)} tone="text-brand-700 dark:text-brand-300" />
            <Kpi label={t('admin.activeCases', { defaultValue: 'الحالات النشطة' })} value={number(overview?.activeCases ?? impact?.summary.activeCases ?? 0)} tone="text-gold-700 dark:text-gold-300" />
            <Kpi label={t('admin.reassessmentDue', { defaultValue: 'إعادة تقييم مستحقة' })} value={number(overview?.reassessmentDue ?? impact?.reassessmentDue.length ?? 0)} tone="text-[#E03131] dark:text-[#ff8787]" />
            <Kpi label={t('admin.auditCount', { defaultValue: 'سجلات التدقيق' })} value={number(overview?.auditCount ?? 0)} tone="text-muted" />
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title={t('admin.performanceByLevel', { defaultValue: 'الأداء حسب المستوى' })}>
              {performance?.byLevel.length ? (
                <div className={TABLE_BOX}>
                  <table className="w-full">
                    <thead className="bg-surface-muted"><tr>
                      <th className={TH}>{t('admin.level', { defaultValue: 'المستوى' })}</th>
                      <th className={TH}>{t('admin.students', { defaultValue: 'التلاميذ' })}</th>
                      <th className={TH}>{t('admin.average', { defaultValue: 'المعدل' })}</th>
                    </tr></thead>
                    <tbody>
                      {performance.byLevel.map((row) => (
                        <tr key={row.level} className="border-t-2 border-line">
                          <td className={TD}>{t('enumLevel', { defaultValue: 'المستوى' })}: {row.level}</td>
                          <td className={TD}>{number(row.students)}</td>
                          <td className={TD}>{row.average ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-xs font-semibold text-muted">{unavailable}</p>}
            </Panel>

            <Panel title={t('admin.impactSummary', { defaultValue: 'ملخص الأثر' })}>
              {impact ? (
                <>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-brand-700 dark:text-brand-300">{impact.period ?? '—'}</span>
                    <span className="text-[11px] font-semibold text-muted">{impact.generatedAt ?? ''}</span>
                  </div>
                  <div className={TABLE_BOX}>
                    <table className="w-full">
                      <thead className="bg-surface-muted"><tr>
                        <th className={TH}>{t('admin.indicator', { defaultValue: 'المؤشر' })}</th>
                        <th className={TH}>{t('admin.baseline', { defaultValue: 'الأساس' })}</th>
                        <th className={TH}>{t('admin.current', { defaultValue: 'الحالي' })}</th>
                        <th className={TH}>{t('admin.target', { defaultValue: 'الهدف' })}</th>
                        <th className={TH}>{t('admin.progress', { defaultValue: 'التقدم' })}</th>
                      </tr></thead>
                      <tbody>
                        {impact.impactLog.length ? impact.impactLog.map((row, index) => (
                          <tr key={`${row.studentId}-${row.indicator}-${index}`} className="border-t-2 border-line">
                            <td className={TD}>{enumText(row.indicator, INDICATOR_MAP)}</td>
                            <td className={TD}>{number(row.baseline)}</td>
                            <td className={TD}>{number(row.current)}</td>
                            <td className={TD}>{number(row.target)}</td>
                            <td className={TD}>{number(row.progress)}%</td>
                          </tr>
                        )) : (
                          <tr><td colSpan={5} className={TD}>{t('admin.noData', { defaultValue: 'لا توجد بيانات.' })}</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : <p className="text-xs font-semibold text-muted">{unavailable}</p>}
            </Panel>
          </div>

          <Panel title={t('admin.trends', { defaultValue: 'الاتجاهات الزمنية' })}>
            {(impact?.trends ?? anonymized?.trends ?? []).length ? (
              <div className={TABLE_BOX}>
                <table className="w-full">
                  <thead className="bg-surface-muted"><tr>
                    <th className={TH}>{t('admin.period', { defaultValue: 'الفترة' })}</th>
                    <th className={TH}>{t('admin.students', { defaultValue: 'التلاميذ' })}</th>
                    <th className={TH}>{t('admin.withGaps', { defaultValue: 'الفجوات' })}</th>
                    <th className={TH}>{t('admin.cards', { defaultValue: 'البطاقات' })}</th>
                    <th className={TH}>{t('admin.interventions', { defaultValue: 'التدخلات' })}</th>
                  </tr></thead>
                  <tbody>
                    {(impact?.trends ?? anonymized?.trends ?? []).map((row) => (
                      <tr key={row.period} className="border-t-2 border-line">
                        <td className={TD}>{row.period}</td>
                        <td className={TD}>{number(row.students)}</td>
                        <td className={TD}>{number(row.withGaps)}</td>
                        <td className={TD}>{number(row.feedbackCards)}</td>
                        <td className={TD}>{number(row.interventions)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-xs font-semibold text-muted">{t('admin.noData', { defaultValue: 'لا توجد بيانات.' })}</p>}
          </Panel>

          <Panel title={t('admin.anonymizedAnalytics', { defaultValue: 'التحليلات المجمّعة مجهولة الهوية' })}>
            {anonymized ? (
              <>
                <div className="mb-3 flex items-start gap-2 rounded-card bg-brand-soft p-3 text-xs font-bold text-brand-800 dark:text-brand-200">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{anonymized.policy.note}</span>
                </div>
                {anonymized.anonymized ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Kpi label={t('admin.groupSize', { defaultValue: 'حجم المجموعة' })} value={number(anonymized.anonymized.count)} tone="text-brand-700 dark:text-brand-300" />
                    <Kpi label={t('admin.avgMastery', { defaultValue: 'متوسط الإتقان' })} value={number(anonymized.anonymized.avgMastery)} tone="text-gold-700 dark:text-gold-300" />
                    <Kpi label={t('admin.gapRate', { defaultValue: 'نسبة الفجوات' })} value={`${number(anonymized.anonymized.gapRate)}%`} tone="text-[#E03131] dark:text-[#ff8787]" />
                    <Kpi label={t('admin.giftedRate', { defaultValue: 'نسبة الموهوبين' })} value={`${number(anonymized.anonymized.giftedRate)}%`} tone="text-brand-600 dark:text-brand-400" />
                  </div>
                ) : (
                  <p className="rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-xs font-bold text-gold-800 dark:bg-gold-400/10 dark:text-gold-300">
                    {t('admin.suppressed', { defaultValue: 'تم كتم التجميع لأن عدد أفراده أقل من الحد الأدنى (k≥3).' })}
                  </p>
                )}
              </>
            ) : <p className="text-xs font-semibold text-muted">{unavailable}</p>}
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title={t('admin.finance', { defaultValue: 'المالية' })}>
              {finance?.finance.monthly.length ? (
                <>
                  <p className="mb-2 text-[11px] font-semibold text-muted">
                    {t('admin.salaryTotal', { defaultValue: 'إجمالي الأجور' })}: {number(finance.salaries.total)} ({number(finance.salaries.count)})
                  </p>
                  <div className={TABLE_BOX}>
                    <table className="w-full">
                      <thead className="bg-surface-muted"><tr>
                        <th className={TH}>{t('admin.month', { defaultValue: 'الشهر' })}</th>
                        <th className={TH}>{t('admin.income', { defaultValue: 'الإيرادات' })}</th>
                        <th className={TH}>{t('admin.expenses', { defaultValue: 'المصاريف' })}</th>
                        <th className={TH}>{t('admin.salaries', { defaultValue: 'الأجور' })}</th>
                      </tr></thead>
                      <tbody>
                        {finance.finance.monthly.map((row) => (
                          <tr key={row.month} className="border-t-2 border-line">
                            <td className={TD}>{row.month}</td>
                            <td className={TD}>{number(row.income)}</td>
                            <td className={TD}>{number(row.expenses)}</td>
                            <td className={TD}>{number(row.salaries)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : <p className="text-xs font-semibold text-muted">{unavailable}</p>}
            </Panel>

            <Panel title={t('admin.strategy', { defaultValue: 'الاستراتيجية' })}>
              {strategy?.strategy.vision || strategy?.strategy.initiatives?.length ? (
                <>
                  {strategy.strategy.vision ? (
                    <p className="mb-3 text-xs font-bold leading-relaxed text-content">{strategy.strategy.vision}</p>
                  ) : null}
                  <div className="space-y-2">
                    {(strategy.strategy.initiatives ?? []).map((item) => (
                      <div key={item.title} className="rounded-card border-2 border-line bg-surface-muted p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-extrabold">{item.title}</span>
                          <span className="text-[11px] font-black text-brand-700 dark:text-brand-300">{item.progress}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-brand-500" style={{ width: `${item.progress}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-xs font-semibold text-muted">{unavailable}</p>}
            </Panel>
          </div>

          {impact?.reassessmentDue.length ? (
            <Panel title={t('admin.reassessmentDueList', { defaultValue: 'إعادة التقييم المستحقة' })}>
              <div className={TABLE_BOX}>
                <table className="w-full">
                  <thead className="bg-surface-muted"><tr>
                    <th className={TH}>{t('admin.type', { defaultValue: 'النوع' })}</th>
                    <th className={TH}>{t('admin.student', { defaultValue: 'التلميذ' })}</th>
                    <th className={TH}>{t('admin.dueDate', { defaultValue: 'الموعد' })}</th>
                  </tr></thead>
                  <tbody>
                    {impact.reassessmentDue.map((row, index) => (
                      <tr key={`${row.type}-${row.id ?? row.studentId}-${index}`} className="border-t-2 border-line">
                        <td className={TD}>{enumText(row.type, TYPE_MAP)}</td>
                        <td className={TD}>{row.studentId}</td>
                        <td className={TD}>{row.due ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
