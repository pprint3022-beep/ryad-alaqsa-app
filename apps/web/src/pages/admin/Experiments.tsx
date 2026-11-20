import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  BrainCircuit,
  ChevronDown,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

interface ExperimentSummary {
  count: number
  mean: number
  min: number
  max: number
}

interface ExperimentResult {
  id: string
  description: string
  variants: string[]
  summary: Record<string, ExperimentSummary>
  totalAssignments: number
}

interface ExperimentsResponse {
  experiments: string[]
}

interface ExperimentResultsResponse {
  results: ExperimentResult | null
}

interface AssignmentBody {
  userId: string
  experimentId?: string
}

interface AssignmentResponse {
  ok: true
  experimentId: string
  userId: string
  variant: string
  source: 'memory'
  persisted: false
}

interface EarlyWarning {
  studentId: string
  studentName: string
  risk: number
  level: string
  factors: string[]
  recommendedAction: string
  urgency: string
}

interface EarlyWarningResponse {
  warnings: EarlyWarning[]
  total: number
}

interface GapPrediction {
  id: string
  name: string
  risk: number
  level: string
  factors: string[]
  features: Record<string, number | boolean>
}

interface GapPredictionResponse {
  predictions: GapPrediction[]
}

const TH = 'whitespace-nowrap px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'whitespace-nowrap px-3 py-2 text-[11px] font-semibold tabular-nums'

const NOTICE_TONES = {
  info: 'border-brand-300 bg-brand-soft text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-200',
  warning:
    'border-gold-300 bg-gold-50 text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200',
  error:
    'border-[#E03131]/40 bg-[#E03131]/10 text-[#b42318] dark:border-[#E03131]/50 dark:text-[#ff8787]',
  empty: 'border-line bg-surface-muted text-muted',
} as const

function Notice({
  children,
  tone = 'info',
}: {
  children: ReactNode
  tone?: keyof typeof NOTICE_TONES
}) {
  return (
    <div
      className={`rounded-card border-2 p-3 text-xs font-bold leading-relaxed ${NOTICE_TONES[tone]}`}
    >
      {children}
    </div>
  )
}

function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone: string
}) {
  return (
    <article className="card-school p-4">
      <p className="text-xs font-extrabold text-muted">{label}</p>
      <p className={`mt-2 font-display text-2xl font-black leading-none tabular-nums ${tone}`}>
        {value}
      </p>
      {hint ? <p className="mt-2 text-[11px] font-semibold text-muted">{hint}</p> : null}
    </article>
  )
}

function PanelHeader({
  icon,
  title,
  advisory,
}: {
  icon: ReactNode
  title: string
  advisory: string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-line pb-3">
      <h2 className="flex items-center gap-2 text-sm font-black">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-soft text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
          {icon}
        </span>
        {title}
      </h2>
      <span className="rounded-full border-2 border-gold-300 bg-gold-50 px-2.5 py-1 text-[10px] font-black text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
        {advisory}
      </span>
    </div>
  )
}

function normalizeLevel(level: string): string {
  return level.trim().toLowerCase()
}

export default function Experiments() {
  const { t, i18n } = useTranslation()

  const [experiments, setExperiments] = useState<string[]>([])
  const [resultsByExperiment, setResultsByExperiment] = useState<Record<string, ExperimentResult>>(
    {},
  )
  const [experimentsLoading, setExperimentsLoading] = useState(true)
  const [experimentsError, setExperimentsError] = useState('')

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedResult, setSelectedResult] = useState<ExperimentResult | null>(null)
  const [selectedLoading, setSelectedLoading] = useState(false)
  const [selectedError, setSelectedError] = useState('')

  const [warnings, setWarnings] = useState<EarlyWarning[]>([])
  const [warningTotal, setWarningTotal] = useState(0)
  const [warningsLoading, setWarningsLoading] = useState(true)
  const [warningsError, setWarningsError] = useState('')
  const [warningLevel, setWarningLevel] = useState('all')
  const [warningQuery, setWarningQuery] = useState('')

  const [predictions, setPredictions] = useState<GapPrediction[]>([])
  const [predictionsLoading, setPredictionsLoading] = useState(true)
  const [predictionsError, setPredictionsError] = useState('')
  const [predictionQuery, setPredictionQuery] = useState('')
  const [openFeatures, setOpenFeatures] = useState<Record<string, boolean>>({})

  const [assignExperimentId, setAssignExperimentId] = useState('')
  const [assignUserId, setAssignUserId] = useState('')
  const [assignmentResult, setAssignmentResult] = useState<AssignmentResponse | null>(null)
  const [assignmentLoading, setAssignmentLoading] = useState(false)
  const [assignmentError, setAssignmentError] = useState('')
  const assignmentController = useRef<AbortController | null>(null)

  const [reloadKey, setReloadKey] = useState(0)

  const rawLocale = i18n.resolvedLanguage ?? i18n.language ?? 'ar'
  const locale = rawLocale.startsWith('ar') ? 'ar-MA' : rawLocale
  const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 })
  const number = (value: number) => numberFormat.format(value)

  const describeError = useCallback(
    (error: unknown, fallback: string) => {
      const apiError = extractApiError(error)
      if (apiError?.message) return apiError.message
      if (apiError?.error) {
        return t('labErrorDetail', { defaultValue: 'تعذّر الطلب ({{code}}).', code: apiError.error })
      }
      return fallback
    },
    [t],
  )

  const advisoryBadge = t('labAdvisoryBadge', {
    defaultValue: 'استرشادي · يتطلب مراجعة بشرية',
  })

  const riskPercent = (value: number): number => {
    if (!Number.isFinite(value)) return 0
    const scaled = value >= 0 && value <= 1 ? value * 100 : value
    return Math.max(0, Math.min(100, Math.round(scaled)))
  }

  const metricDisplay = (value: number): string => {
    if (!Number.isFinite(value)) return '—'
    return value >= 0 && value <= 1
      ? `${number(value)} (${number(Math.round(value * 100))}%)`
      : number(value)
  }

  const levelLabel = (level: string): string => {
    const normalized = normalizeLevel(level)
    if (normalized === 'high') return t('labHigh', { defaultValue: 'مرتفع' })
    if (normalized === 'medium') return t('labMedium', { defaultValue: 'متوسط' })
    if (normalized === 'low') return t('labLow', { defaultValue: 'منخفض' })
    return level
  }

  const levelTone = (level: string): { badge: string; bar: string } => {
    const normalized = normalizeLevel(level)
    if (normalized === 'high') {
      return {
        badge:
          'bg-[#E03131]/10 text-[#b42318] dark:bg-[#E03131]/20 dark:text-[#ff8787]',
        bar: 'bg-[#E03131]',
      }
    }
    if (normalized === 'medium') {
      return {
        badge: 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300',
        bar: 'bg-gold-400',
      }
    }
    return {
      badge: 'bg-brand-soft text-brand-800 dark:bg-brand-400/15 dark:text-brand-200',
      bar: 'bg-brand-500',
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setExperimentsLoading(true)
    setExperimentsError('')

    const load = async () => {
      const data = await apiGet<ExperimentsResponse>('/admin/ml/experiment', {
        signal: controller.signal,
      })
      if (cancelled) return
      const ids = Array.isArray(data.experiments) ? data.experiments : []
      setExperiments(ids)
      setSelectedId((current) => (current && ids.includes(current) ? current : ids[0] ?? null))
      setAssignExperimentId((current) =>
        current && ids.includes(current) ? current : ids[0] ?? '',
      )

      const entries = await Promise.all(
        ids.map(async (id) => {
          const response = await apiGet<ExperimentResultsResponse>('/admin/ml/experiment', {
            params: { id },
            signal: controller.signal,
          })
          return [id, response.results] as const
        }),
      )
      if (cancelled) return
      const collected: Record<string, ExperimentResult> = {}
      for (const [id, result] of entries) {
        if (result) collected[id] = result
      }
      setResultsByExperiment(collected)
      setExperimentsLoading(false)
    }

    void load().catch((error: unknown) => {
      if (cancelled) return
      setExperimentsError(
        describeError(
          error,
          t('labLoadError', { defaultValue: 'تعذّر تحميل بيانات المختبر. حاول مرة أخرى.' }),
        ),
      )
      setExperimentsLoading(false)
    })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, t, describeError])

  useEffect(() => {
    if (!selectedId) {
      setSelectedResult(null)
      setSelectedLoading(false)
      setSelectedError('')
      return
    }
    const controller = new AbortController()
    let cancelled = false
    setSelectedLoading(true)
    setSelectedError('')

    apiGet<ExperimentResultsResponse>('/admin/ml/experiment', {
      params: { id: selectedId },
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        setSelectedResult(data.results ?? null)
        setSelectedLoading(false)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setSelectedError(
          describeError(
            error,
            t('labLoadError', { defaultValue: 'تعذّر تحميل بيانات المختبر. حاول مرة أخرى.' }),
          ),
        )
        setSelectedLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [selectedId, reloadKey, t, describeError])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setWarningsLoading(true)
    setWarningsError('')

    apiGet<EarlyWarningResponse>('/admin/ml/early-warning', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        const rows = Array.isArray(data.warnings) ? data.warnings : []
        setWarnings(rows)
        setWarningTotal(typeof data.total === 'number' ? data.total : rows.length)
        setWarningsLoading(false)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setWarningsError(
          describeError(
            error,
            t('labLoadError', { defaultValue: 'تعذّر تحميل بيانات المختبر. حاول مرة أخرى.' }),
          ),
        )
        setWarningsLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, t, describeError])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setPredictionsLoading(true)
    setPredictionsError('')

    apiGet<GapPredictionResponse>('/admin/ml/gap-prediction', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        setPredictions(Array.isArray(data.predictions) ? data.predictions : [])
        setPredictionsLoading(false)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setPredictionsError(
          describeError(
            error,
            t('labLoadError', { defaultValue: 'تعذّر تحميل بيانات المختبر. حاول مرة أخرى.' }),
          ),
        )
        setPredictionsLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, t, describeError])

  useEffect(
    () => () => {
      assignmentController.current?.abort()
    },
    [],
  )

  const runAssignment = async (mode: 'read' | 'assign') => {
    const userId = assignUserId.trim()
    if (!userId || !assignExperimentId || assignmentLoading) return

    assignmentController.current?.abort()
    const controller = new AbortController()
    assignmentController.current = controller
    let cancelled = false
    setAssignmentLoading(true)
    setAssignmentError('')
    setAssignmentResult(null)

    try {
      const response =
        mode === 'read'
          ? await apiGet<AssignmentResponse>('/admin/ml/experiment/assignment', {
              params: { userId, experimentId: assignExperimentId },
              signal: controller.signal,
            })
          : await apiPost<AssignmentResponse, AssignmentBody>(
              '/admin/ml/experiment/assign',
              { userId, experimentId: assignExperimentId },
              { signal: controller.signal },
            )
      if (cancelled || controller.signal.aborted) return
      setAssignmentResult(response)
    } catch (error: unknown) {
      if (cancelled || controller.signal.aborted) return
      setAssignmentError(
        describeError(
          error,
          t('labAssignmentError', { defaultValue: 'تعذّر تنفيذ عملية التخصيص.' }),
        ),
      )
    } finally {
      if (!cancelled && !controller.signal.aborted) setAssignmentLoading(false)
    }
  }

  const totalAssignments = Object.values(resultsByExperiment).reduce(
    (sum, result) =>
      sum + (Number.isFinite(result.totalAssignments) ? result.totalAssignments : 0),
    0,
  )

  const warningTerm = warningQuery.trim().toLowerCase()
  const filteredWarnings = warnings.filter((warning) => {
    const matchesLevel = warningLevel === 'all' || normalizeLevel(warning.level) === warningLevel
    const matchesName = !warningTerm || warning.studentName.toLowerCase().includes(warningTerm)
    return matchesLevel && matchesName
  })

  const predictionTerm = predictionQuery.trim().toLowerCase()
  const filteredPredictions = predictions.filter(
    (prediction) => !predictionTerm || prediction.name.toLowerCase().includes(predictionTerm),
  )

  const isRefreshing =
    experimentsLoading || warningsLoading || predictionsLoading

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school overflow-hidden p-0 shadow-card">
        <div className="bg-brand-600 bg-dots px-5 py-4 text-white dark:bg-brand-700">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15">
                <BrainCircuit className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <h1 className="font-display text-xl font-black sm:text-2xl">
                  {t('labTitle', { defaultValue: 'مختبر التحليلات والتجارب' })}
                </h1>
                <p className="mt-1 max-w-3xl text-xs font-semibold leading-relaxed text-white/85">
                  {t('labSubtitle', {
                    defaultValue:
                      'أدوات تحليلية استرشادية للمراجعة فقط؛ التخصيصات محفوظة في الذاكرة وتختفي عند إعادة التشغيل، ولا تُعتمد إلا بعد موافقة الباحث.',
                  })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              disabled={isRefreshing}
              className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
            >
              {isRefreshing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {t('labRefresh', { defaultValue: 'تحديث' })}
            </button>
          </div>
        </div>
        <div className="flex items-start gap-2 border-t-2 border-line bg-gold-50 px-5 py-3 text-xs font-bold leading-relaxed text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t('labAdvisory', {
              defaultValue:
                'مخرجات النماذج استرشادية ولا تُعدّ قرارًا؛ تتطلب مراجعة بشرية وموافقة الباحث قبل أي إجراء.',
            })}
          </span>
        </div>
      </section>

      <section
        aria-label={t('labExperiments', { defaultValue: 'التجارب' })}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        <Kpi
          label={t('labExperiments', { defaultValue: 'التجارب' })}
          value={experimentsLoading ? '—' : number(experiments.length)}
          tone="text-brand-700 dark:text-brand-300"
        />
        <Kpi
          label={t('labAssignments', { defaultValue: 'التخصيصات' })}
          value={experimentsLoading ? '—' : number(totalAssignments)}
          hint={t('labAdvisoryBadge', { defaultValue: 'استرشادي · يتطلب مراجعة بشرية' })}
          tone="text-gold-700 dark:text-gold-300"
        />
        <Kpi
          label={t('labWarnings', { defaultValue: 'التنبيهات المبكرة' })}
          value={warningsLoading ? '—' : number(warningTotal)}
          tone="text-[#b42318] dark:text-[#ff8787]"
        />
      </section>

      {experimentsError || warningsError || predictionsError ? (
        <div className="space-y-3">
          {experimentsError ? <Notice tone="error">{experimentsError}</Notice> : null}
          {warningsError ? <Notice tone="error">{warningsError}</Notice> : null}
          {predictionsError ? <Notice tone="error">{predictionsError}</Notice> : null}
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={isRefreshing}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('labRetry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : null}

      {experimentsLoading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('labLoading', { defaultValue: 'جارٍ التحميل…' })}
        </div>
      ) : (
        <>
          <section aria-label={t('labExperiments', { defaultValue: 'التجارب' })} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-black">{t('labExperiments', { defaultValue: 'التجارب' })}</h2>
              <span className="text-[11px] font-semibold text-muted">{advisoryBadge}</span>
            </div>
            {experiments.length === 0 ? (
              <Notice tone="empty">
                {t('labNoExperiments', { defaultValue: 'لا توجد تجارب مسجّلة حاليًا.' })}
              </Notice>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {experiments.map((id) => {
                  const result = resultsByExperiment[id]
                  const selected = selectedId === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedId(id)}
                      aria-pressed={selected}
                      className={`card-school card-school--interactive p-4 text-start ${
                        selected ? 'border-brand-500 ring-4 ring-brand-500/10' : ''
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="font-mono text-xs font-black text-brand-700 dark:text-brand-300">
                          {id}
                        </span>
                        {selected ? (
                          <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-800 dark:bg-brand-400/15 dark:text-brand-200">
                            {t('labSelected', { defaultValue: 'محدّدة' })}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 min-h-8 text-xs font-semibold leading-relaxed text-muted">
                        {result?.description ||
                          t('labDescription', { defaultValue: 'لا يوجد وصف متاح.' })}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-black text-muted">
                          {t('labVariants', { defaultValue: 'المتغيرات' })}:
                        </span>
                        {(result?.variants ?? []).map((variant) => (
                          <span
                            key={variant}
                            className="rounded-full border-2 border-line bg-surface-muted px-2 py-0.5 text-[10px] font-extrabold text-content"
                          >
                            {variant}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-[11px] font-bold text-muted">
                        {t('labAssignments', { defaultValue: 'التخصيصات' })}:{' '}
                        <span className="font-black tabular-nums text-content">
                          {result ? number(result.totalAssignments) : '—'}
                        </span>
                      </p>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          <section className="card-school space-y-3 p-4">
            <PanelHeader
              icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
              title={t('labExperimentResults', { defaultValue: 'نتائج التجربة' })}
              advisory={advisoryBadge}
            />
            {selectedId ? (
              <p className="text-xs font-bold text-muted">
                <span className="font-mono font-black text-content">{selectedId}</span>
                {selectedResult?.description ? ` — ${selectedResult.description}` : ''}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-muted">
              <span>
                {t('labVariants', { defaultValue: 'المتغيرات' })}:{' '}
                <span className="text-content">
                  {(selectedResult?.variants ?? []).join(' · ') || '—'}
                </span>
              </span>
              <span>
                {t('labAssignments', { defaultValue: 'التخصيصات' })}:{' '}
                <span className="tabular-nums text-content">
                  {selectedResult ? number(selectedResult.totalAssignments) : '—'}
                </span>
              </span>
            </div>
            {selectedLoading ? (
              <div className="flex items-center justify-center gap-2 p-8 text-sm font-bold text-muted">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                {t('labLoading', { defaultValue: 'جارٍ التحميل…' })}
              </div>
            ) : selectedError ? (
              <div className="space-y-3">
                <Notice tone="error">{selectedError}</Notice>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('labRetry', { defaultValue: 'إعادة المحاولة' })}
                </button>
              </div>
            ) : !selectedResult ? (
              <Notice tone="empty">
                {t('labNotFound', { defaultValue: 'لم يتم العثور على هذه التجربة.' })}
              </Notice>
            ) : Object.keys(selectedResult.summary ?? {}).length === 0 ? (
              <Notice tone="empty">
                {t('labNoResults', { defaultValue: 'لا توجد نتائج مسجّلة بعد.' })}
              </Notice>
            ) : (
              <div className="overflow-x-auto">
                <table
                  aria-label={t('labExperimentResults', { defaultValue: 'نتائج التجربة' })}
                  className="w-full min-w-[560px]"
                >
                  <thead className="bg-surface-muted">
                    <tr>
                      <th className={TH}>{t('labVariants', { defaultValue: 'المتغيرات' })}</th>
                      <th className={TH}>{t('labCount', { defaultValue: 'عدد النتائج' })}</th>
                      <th className={TH}>{t('labMean', { defaultValue: 'المتوسط' })}</th>
                      <th className={TH}>{t('labMin', { defaultValue: 'الأدنى' })}</th>
                      <th className={TH}>{t('labMax', { defaultValue: 'الأعلى' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedResult.summary ?? {})
                      .sort((a, b) => b[1].count - a[1].count)
                      .map(([variant, stats]) => (
                        <tr key={variant} className="border-t-2 border-line align-top">
                          <td className="px-3 py-2 text-[11px] font-black text-content">
                            {variant}
                          </td>
                          <td className={TD}>{number(stats.count)}</td>
                          <td className="px-3 py-2 text-[11px] font-black tabular-nums text-brand-700 dark:text-brand-300">
                            {metricDisplay(stats.mean)}
                          </td>
                          <td className={TD}>{metricDisplay(stats.min)}</td>
                          <td className={TD}>{metricDisplay(stats.max)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card-school space-y-4 p-4">
            <PanelHeader
              icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
              title={t('labAssignmentTool', { defaultValue: 'أداة التخصيص' })}
              advisory={advisoryBadge}
            />
            <div className="grid gap-3 lg:grid-cols-2">
              <div>
                <label htmlFor="lab-assign-experiment" className="text-xs font-black text-muted">
                  {t('labExperiments', { defaultValue: 'التجارب' })}
                </label>
                <select
                  id="lab-assign-experiment"
                  value={assignExperimentId}
                  onChange={(event) => setAssignExperimentId(event.target.value)}
                  className="input-school mt-2 text-start"
                  disabled={experiments.length === 0}
                >
                  {experiments.length === 0 ? (
                    <option value="">
                      {t('labSelect', { defaultValue: 'اختر…' })}
                    </option>
                  ) : (
                    experiments.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="lab-assign-user" className="text-xs font-black text-muted">
                  {t('labUserId', { defaultValue: 'معرّف المستخدم' })}
                </label>
                <input
                  id="lab-assign-user"
                  type="text"
                  dir="ltr"
                  autoComplete="off"
                  value={assignUserId}
                  onChange={(event) => setAssignUserId(event.target.value)}
                  placeholder={t('labUserIdPlaceholder', {
                    defaultValue: 'مثال: u_t1 أو director أو u_p1',
                  })}
                  className="input-school mt-2 text-start"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void runAssignment('read')}
                disabled={assignmentLoading || !assignExperimentId || !assignUserId.trim()}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                {assignmentLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {t('labReadAssignment', { defaultValue: 'قراءة التخصيص' })}
              </button>
              <button
                type="button"
                onClick={() => void runAssignment('assign')}
                disabled={assignmentLoading || !assignExperimentId || !assignUserId.trim()}
                className="btn-chunky btn-chunky--sm"
              >
                {assignmentLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {t('labAssignVariant', { defaultValue: 'تخصيص متغير' })}
              </button>
            </div>
            {assignmentLoading ? (
              <p className="flex items-center gap-2 text-xs font-bold text-muted">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {t('labLoading', { defaultValue: 'جارٍ التحميل…' })}
              </p>
            ) : null}
            {assignmentError ? <Notice tone="error">{assignmentError}</Notice> : null}
            {assignmentResult ? (
              <div className="space-y-2 rounded-card border-2 border-brand-300 bg-brand-soft p-3 dark:border-brand-400/30 dark:bg-brand-400/10">
                <p className="text-xs font-black text-brand-800 dark:text-brand-200">
                  {t('labAssigned', { defaultValue: 'المتغير المُخصَّص' })}:{' '}
                  <span className="font-mono" dir="ltr">
                    {assignmentResult.variant}
                  </span>
                </p>
                <p className="text-[11px] font-semibold text-muted">
                  {assignmentResult.experimentId} · <span dir="ltr">{assignmentResult.userId}</span>
                </p>
                <Notice tone="warning">
                  {t('labEphemeral', {
                    defaultValue:
                      'هذا التخصيص مؤقت في الذاكرة فقط، غير محفوظ في قاعدة البيانات، ويُفقد عند إعادة تشغيل الخادم.',
                  })}
                </Notice>
              </div>
            ) : null}
          </section>

          <section className="card-school space-y-4 p-4">
            <PanelHeader
              icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
              title={t('labEarlyWarning', { defaultValue: 'الإنذار المبكر' })}
              advisory={advisoryBadge}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="lab-warning-search" className="text-xs font-black text-muted">
                  {t('labSearch', { defaultValue: 'البحث' })}
                </label>
                <div className="relative mt-2">
                  <Search
                    className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="lab-warning-search"
                    type="search"
                    value={warningQuery}
                    onChange={(event) => setWarningQuery(event.target.value)}
                    placeholder={t('labSearchNamePlaceholder', {
                      defaultValue: 'ابحث باسم التلميذ…',
                    })}
                    className="input-school ps-10 text-start"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lab-warning-level" className="text-xs font-black text-muted">
                  {t('labLevelFilter', { defaultValue: 'تصفية المستوى' })}
                </label>
                <select
                  id="lab-warning-level"
                  value={warningLevel}
                  onChange={(event) => setWarningLevel(event.target.value)}
                  className="input-school mt-2 text-start"
                >
                  <option value="all">
                    {t('labAllLevels', { defaultValue: 'كل المستويات' })}
                  </option>
                  <option value="low">{t('labLow', { defaultValue: 'منخفض' })}</option>
                  <option value="medium">{t('labMedium', { defaultValue: 'متوسط' })}</option>
                  <option value="high">{t('labHigh', { defaultValue: 'مرتفع' })}</option>
                </select>
              </div>
            </div>
            {warningsLoading ? (
              <div className="flex items-center justify-center gap-2 p-8 text-sm font-bold text-muted">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                {t('labLoading', { defaultValue: 'جارٍ التحميل…' })}
              </div>
            ) : warningsError ? (
              <div className="space-y-3">
                <Notice tone="error">{warningsError}</Notice>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('labRetry', { defaultValue: 'إعادة المحاولة' })}
                </button>
              </div>
            ) : warnings.length === 0 ? (
              <Notice tone="empty">
                {t('labEmpty', { defaultValue: 'لا توجد بيانات لعرضها.' })}
              </Notice>
            ) : filteredWarnings.length === 0 ? (
              <Notice tone="empty">
                {t('labNoMatches', { defaultValue: 'لا توجد نتائج تطابق البحث.' })}
              </Notice>
            ) : (
              <ul className="space-y-3">
                {filteredWarnings.map((warning, index) => {
                  const percent = riskPercent(warning.risk)
                  const tone = levelTone(warning.level)
                  return (
                    <Fragment key={`${warning.studentId}-${index}`}>
                      <li className="rounded-card border-2 border-line bg-surface-muted/60 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                            <span className="text-xs font-black text-content">
                              {warning.studentName}
                            </span>
                          </div>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-muted">
                              {t('labLevel', { defaultValue: 'المستوى' })}:
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${tone.badge}`}
                            >
                              {levelLabel(warning.level)}
                            </span>
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                            <span className="text-muted">{t('labRisk', { defaultValue: 'نسبة الخطورة' })}</span>
                            <span className="tabular-nums text-content">{percent}%</span>
                          </div>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-line">
                            <div
                              className={`h-full rounded-full ${tone.bar}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-black text-muted">
                            {t('labFactors', { defaultValue: 'العوامل' })}:
                          </span>
                          {warning.factors.length === 0 ? (
                            <span className="text-[10px] font-semibold text-muted">—</span>
                          ) : (
                            warning.factors.map((factor, factorIndex) => (
                              <span
                                key={`${factor}-${factorIndex}`}
                                className="rounded-full border-2 border-line bg-surface px-2 py-0.5 text-[10px] font-bold text-content"
                              >
                                {factor}
                              </span>
                            ))
                          )}
                        </div>
                        <p className="mt-2 text-[11px] font-bold leading-relaxed text-muted">
                          <span className="font-black text-content">
                            {t('labAction', { defaultValue: 'الإجراء الموصى به' })}:
                          </span>{' '}
                          {warning.recommendedAction}
                        </p>
                        <p className="mt-1 text-[11px] font-bold text-muted">
                          <span className="font-black text-content">
                            {t('labUrgency', { defaultValue: 'درجة الاستعجال' })}:
                          </span>{' '}
                          {warning.urgency === 'عاجل'
                            ? t('enumUrgent', { defaultValue: 'عاجل' })
                            : warning.urgency === 'متابعة'
                              ? t('enumFollowUp', { defaultValue: 'متابعة' })
                              : warning.urgency}
                        </p>
                      </li>
                    </Fragment>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="card-school space-y-4 p-4">
            <PanelHeader
              icon={<BrainCircuit className="h-4 w-4" aria-hidden="true" />}
              title={t('labGapPrediction', { defaultValue: 'التنبؤ بفجوة التعلّم' })}
              advisory={advisoryBadge}
            />
            <div className="max-w-xl">
              <label htmlFor="lab-prediction-search" className="text-xs font-black text-muted">
                {t('labSearch', { defaultValue: 'البحث' })}
              </label>
              <div className="relative mt-2">
                <Search
                  className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="lab-prediction-search"
                  type="search"
                  value={predictionQuery}
                  onChange={(event) => setPredictionQuery(event.target.value)}
                  placeholder={t('labSearchNamePlaceholder', {
                    defaultValue: 'ابحث باسم التلميذ…',
                  })}
                  className="input-school ps-10 text-start"
                />
              </div>
            </div>
            {predictionsLoading ? (
              <div className="flex items-center justify-center gap-2 p-8 text-sm font-bold text-muted">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                {t('labLoading', { defaultValue: 'جارٍ التحميل…' })}
              </div>
            ) : predictionsError ? (
              <div className="space-y-3">
                <Notice tone="error">{predictionsError}</Notice>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('labRetry', { defaultValue: 'إعادة المحاولة' })}
                </button>
              </div>
            ) : predictions.length === 0 ? (
              <Notice tone="empty">
                {t('labEmpty', { defaultValue: 'لا توجد بيانات لعرضها.' })}
              </Notice>
            ) : filteredPredictions.length === 0 ? (
              <Notice tone="empty">
                {t('labNoMatches', { defaultValue: 'لا توجد نتائج تطابق البحث.' })}
              </Notice>
            ) : (
              <ul className="space-y-3">
                {filteredPredictions.map((prediction, index) => {
                  const percent = riskPercent(prediction.risk)
                  const tone = levelTone(prediction.level)
                  const featuresId = `lab-features-${prediction.id || index}`
                  const open = Boolean(openFeatures[prediction.id])
                  const featureEntries = Object.entries(prediction.features ?? {})
                  return (
                    <li
                      key={`${prediction.id}-${index}`}
                      className="rounded-card border-2 border-line bg-surface-muted/60 p-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="text-xs font-black text-content">{prediction.name}</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-black tabular-nums text-content">
                            {t('labRisk', { defaultValue: 'نسبة الخطورة' })}: {percent}%
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-muted">
                              {t('labLevel', { defaultValue: 'المستوى' })}:
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-black ${tone.badge}`}
                            >
                              {levelLabel(prediction.level)}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                        <div
                          className={`h-full rounded-full ${tone.bar}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-black text-muted">
                          {t('labFactors', { defaultValue: 'العوامل' })}:
                        </span>
                        {prediction.factors.slice(0, 3).length === 0 ? (
                          <span className="text-[10px] font-semibold text-muted">—</span>
                        ) : (
                          prediction.factors.slice(0, 3).map((factor, factorIndex) => (
                            <span
                              key={`${factor}-${factorIndex}`}
                              className="rounded-full border-2 border-line bg-surface px-2 py-0.5 text-[10px] font-bold text-content"
                            >
                              {factor}
                            </span>
                          ))
                        )}
                      </div>
                      <div className="mt-3 border-t-2 border-line pt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenFeatures((current) => ({
                              ...current,
                              [prediction.id]: !current[prediction.id],
                            }))
                          }
                          aria-expanded={open}
                          aria-controls={featuresId}
                          className="flex w-full items-center justify-between gap-2 text-start text-[11px] font-black text-brand-700 dark:text-brand-300"
                        >
                          {t('labFeatures', { defaultValue: 'الخصائص' })}
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                        {open ? (
                          <div id={featuresId} className="mt-2 grid gap-1.5 sm:grid-cols-2">
                            {featureEntries.length === 0 ? (
                              <p className="text-[10px] font-semibold text-muted">—</p>
                            ) : (
                              featureEntries.map(([name, value]) => (
                                <div
                                  key={name}
                                  className="flex items-center justify-between gap-2 rounded-xl border-2 border-line bg-surface px-2.5 py-1.5 text-[10px] font-bold"
                                >
                                  <span className="font-mono text-muted" dir="ltr">
                                    {name}
                                  </span>
                                  <span className="tabular-nums text-content" dir="ltr">
                                    {typeof value === 'boolean'
                                      ? value
                                        ? t('labYes', { defaultValue: 'نعم' })
                                        : t('labNo', { defaultValue: 'لا' })
                                      : number(value)}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
