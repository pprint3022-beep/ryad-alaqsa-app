import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  GraduationCap,
  Loader2,
  Printer,
  RefreshCw,
  Save,
  ShieldCheck,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'
import { PlainSummary } from '../../components/ux'

type Cycle = 'cycle1' | 'cycle2'
type CycleFilter = 'all' | Cycle

interface MentionBand {
  min: number
  max: number
  key: string
}

interface Policy {
  scale: number
  successThreshold: number
  mentionBands: MentionBand[]
  subjectCoefficients: Record<string, number>
  defaultTestsPerCycle?: number
  participationWeight: number
  cycleWeights?: { cycle1: number; cycle2: number }
  sixthGradeWeights?: { continuous: number; localExam: number; regionalExam: number }
  sixthGradeMinSuccess?: number
  note?: string
}

interface Subject {
  id: string
  name: string
}

interface ConfigResponse {
  policy: Policy
  subjects: Subject[]
}

interface ResultRow {
  studentId: string
  studentName?: string
  className?: string
  classId?: string
  levelName?: string
  cycle1?: unknown
  cycle2?: unknown
  annualAverage?: number | null
  mention?: unknown
  decision?: string
  failingSubjects?: unknown
  advisory?: boolean
}

interface ByClass {
  classId?: string
  className?: string
  average?: number | null
  success?: number
  fail?: number
}

interface Summary {
  total?: number
  success?: number
  fail?: number
  byClass?: ByClass[]
}

interface ResultsResponse {
  results: ResultRow[]
  summary: Summary
}

interface ExportSubject {
  name?: string
  average?: number | null
  coefficient?: number | null
  mention?: unknown
}

interface ExportStudent {
  name?: string
  studentId?: string
  subjects?: ExportSubject[]
  cycleAverage?: number | null
  mention?: unknown
  decision?: string
}

interface ExportClass {
  name?: string
  classId?: string
  students?: ExportStudent[]
}

interface ReportData {
  institution?: { name?: string; address?: string; phone?: string }
  year?: string | number
  cycle?: string
  classes?: ExportClass[]
  policy?: Policy
  generatedAt?: string
  advisory?: boolean
  note?: string
}

interface PendingEntry {
  id: string
  studentId?: string
  studentName?: string
  subjectId?: string
  subjectName?: string
  cycle?: Cycle
  enteredAt?: string
  status?: string
}

const TH = 'px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'px-3 py-2 text-[11px] font-semibold text-content'

const MENTION_AR: Record<string, string> = {
  excellent: 'ممتاز',
  outstanding: 'ممتاز',
  veryGood: 'جيد جدًا',
  very_good: 'جيد جدًا',
  'very-good': 'جيد جدًا',
  good: 'جيد',
  fairlyGood: 'جيد إلى حد ما',
  fairly_good: 'جيد إلى حد ما',
  average: 'متوسط',
  acceptable: 'مقبول',
  passing: 'مقبول',
  pass: 'مقبول',
  weak: 'ضعيف',
  fail: 'راسب',
  failing: 'راسب',
}

function num(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value)
  }
  return null
}

function pick(obj: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key]
  }
  return undefined
}

function humanize(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function mentionLabel(key: string, locale: string): string {
  if (!key) return '—'
  if (/[\u0600-\u06FF]/.test(key)) return key
  if (locale.startsWith('ar')) return MENTION_AR[key] ?? humanize(key)
  return humanize(key)
}

function mentionFrom(value: unknown, locale: string): string {
  if (typeof value === 'string') return mentionLabel(value, locale)
  if (value && typeof value === 'object') {
    const key = pick(value as Record<string, unknown>, 'key', 'label', 'name', 'mention')
    if (typeof key === 'string') return mentionLabel(key, locale)
  }
  return '—'
}

function readAverage(value: unknown): number | null {
  const direct = num(value)
  if (direct !== null) return direct
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    for (const key of ['average', 'averageScore', 'value', 'score', 'moyenne', 'result']) {
      const found = num(obj[key])
      if (found !== null) return found
    }
  }
  return null
}

function messageOf(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

function extractPending(payload: unknown): PendingEntry[] {
  let candidates: unknown[] = []
  if (Array.isArray(payload)) {
    candidates = payload
  } else if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    for (const key of ['entries', 'items', 'rows', 'data', 'list']) {
      if (Array.isArray(obj[key])) candidates = obj[key] as unknown[]
    }
  }
  const list: PendingEntry[] = []
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue
    const obj = candidate as Record<string, unknown>
    const idValue = pick(obj, 'id', 'entryId')
    if (typeof idValue !== 'string' || !idValue.trim()) continue
    const cycleValue = pick(obj, 'cycle')
    list.push({
      id: idValue.trim(),
      studentId: typeof pick(obj, 'studentId') === 'string' ? String(pick(obj, 'studentId')) : undefined,
      studentName: typeof pick(obj, 'studentName') === 'string' ? String(pick(obj, 'studentName')) : undefined,
      subjectId: typeof pick(obj, 'subjectId') === 'string' ? String(pick(obj, 'subjectId')) : undefined,
      subjectName: typeof pick(obj, 'subjectName') === 'string' ? String(pick(obj, 'subjectName')) : undefined,
      cycle: cycleValue === 'cycle1' || cycleValue === 'cycle2' ? cycleValue : undefined,
      enteredAt: typeof pick(obj, 'enteredAt') === 'string' ? String(pick(obj, 'enteredAt')) : undefined,
      status: typeof pick(obj, 'status') === 'string' ? String(pick(obj, 'status')) : undefined,
    })
  }
  return list
}

const PRINT_STYLES = `
  @media print {
    body * { visibility: hidden !important; }
    .print-report, .print-report * { visibility: visible !important; }
    .print-report {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      border: none !important;
      box-shadow: none !important;
    }
    .no-print, nav, aside, header, footer, .sidebar, .navbar { display: none !important; }
    @page { margin: 12mm; }
  }
`

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

function AdvisoryBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <article className="rounded-card border-2 border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-extrabold text-muted">{label}</p>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300">
          {icon}
        </span>
      </div>
      <p className="mt-2 font-display text-xl font-black leading-tight text-content">{value}</p>
    </article>
  )
}

export default function GradeResults() {
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage ?? 'ar'

  const advisory = t('grAAdvisory', {
    defaultValue: 'النتائج استرشادية في انتظار الاعتماد البشري؛ النتائج الرسمية تصدر عن الإدارة.',
  })
  const loadError = t('grALoadError', { defaultValue: 'تعذّر تحميل النتائج.' })

  const number = (value: number | null | undefined): string =>
    value === null || value === undefined || !Number.isFinite(value)
      ? '—'
      : new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)

  const formatDate = (value?: string | number): string => {
    if (value === undefined || value === null || value === '') return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
    } catch {
      return String(value)
    }
  }

  const [policy, setPolicy] = useState<Policy | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [coeffDraft, setCoeffDraft] = useState<Record<string, string>>({})
  const [savingPolicy, setSavingPolicy] = useState(false)

  const [results, setResults] = useState<ResultRow[]>([])
  const [summary, setSummary] = useState<Summary>({})
  const [report, setReport] = useState<ReportData | null>(null)
  const [loadingResults, setLoadingResults] = useState(true)
  const [resultsError, setResultsError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [classFilter, setClassFilter] = useState('')
  const [cycleFilter, setCycleFilter] = useState<CycleFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [pending, setPending] = useState<PendingEntry[]>([])
  const [pendingAvailable, setPendingAvailable] = useState(false)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [approvedId, setApprovedId] = useState<string | null>(null)
  const [approvalError, setApprovalError] = useState<string | null>(null)

  const [exportMessage, setExportMessage] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    apiGet<ConfigResponse>('/admin/grades/config', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        const nextPolicy = data.policy
        setPolicy(nextPolicy)
        setSubjects(Array.isArray(data.subjects) ? data.subjects : [])
        const coefficients: Record<string, string> = {}
        for (const [subjectId, value] of Object.entries(nextPolicy?.subjectCoefficients ?? {})) {
          coefficients[subjectId] = String(value)
        }
        setCoeffDraft(coefficients)
      })
      .catch(() => {
        /* policy page is optional for the results view */
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoadingResults(true)
    setResultsError(null)

    const params: Record<string, string> = {}
    if (classFilter) params.classId = classFilter
    if (cycleFilter !== 'all') params.cycle = cycleFilter

    apiGet<ResultsResponse>('/admin/grades/results', { params, signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        setResults(Array.isArray(data.results) ? data.results : [])
        setSummary(data.summary ?? {})
      })
      .catch((err: unknown) => {
        if (!cancelled && !controller.signal.aborted) setResultsError(messageOf(err, loadError))
      })
      .finally(() => {
        if (!cancelled) setLoadingResults(false)
      })

    apiGet<ReportData>('/admin/grades/export', {
      params: { ...params, format: 'pdf-data' },
      signal: controller.signal,
    })
      .then((data) => {
        if (!cancelled) setReport(data ?? null)
      })
      .catch(() => {
        if (!cancelled) setReport(null)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, classFilter, cycleFilter, loadError])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    apiGet<unknown>('/admin/grades/entries', {
      params: { status: 'submitted' },
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        setPending(extractPending(data))
        setPendingAvailable(true)
      })
      .catch(() => {
        if (!cancelled) setPendingAvailable(false)
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey])

  const activePolicy: Policy = policy ?? {
    scale: 20,
    successThreshold: 10,
    mentionBands: [],
    subjectCoefficients: {},
    participationWeight: 0,
  }
  const threshold = num(activePolicy.successThreshold) ?? 10

  const cycleLabel = (cycle: unknown): string => {
    if (cycle === 'cycle1' || cycle === 'all-cycle1') {
      return t('grTCycle1', { defaultValue: 'الدورة الأولى' })
    }
    if (cycle === 'cycle2') return t('grTCycle2', { defaultValue: 'الدورة الثانية' })
    return typeof cycle === 'string' && cycle ? cycle : '—'
  }

  const decisionOf = (row: ResultRow): 'success' | 'fail' | null => {
    const obj = row as unknown as Record<string, unknown>
    const passed = pick(obj, 'passed', 'success')
    if (typeof passed === 'boolean') return passed ? 'success' : 'fail'
    const decisionValue = pick(obj, 'decision', 'result', 'status')
    if (typeof decisionValue === 'string') {
      const value = decisionValue.toLowerCase()
      if (value.includes('succ') || value.includes('pass') || value === 'réussi' || value === 'reussi') {
        return 'success'
      }
      if (value.includes('fail') || value.includes('échec') || value === 'echec') return 'fail'
    }
    const average = readAverage(pick(obj, 'annualAverage', 'annual', 'average'))
    if (average !== null) return average >= threshold ? 'success' : 'fail'
    return null
  }

  const decisionBadgeClass = (decision: 'success' | 'fail' | null): string =>
    decision === 'success'
      ? 'rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700'
      : 'rounded-full bg-[#E03131]/10 px-2 py-0.5 text-[10px] font-black text-[#E03131]'

  const decisionText = (decision: 'success' | 'fail' | null): string =>
    decision === 'success'
      ? t('grTSuccess', { defaultValue: 'ناجح' })
      : t('grTFail', { defaultValue: 'راسب' })

  const failingList = (row: ResultRow): string[] => {
    const raw = row.failingSubjects
    if (!Array.isArray(raw)) return []
    return raw
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object') {
          const value = pick(
            item as Record<string, unknown>,
            'name',
            'subjectName',
            'subject',
            'label',
          )
          return typeof value === 'string' ? value : ''
        }
        return ''
      })
      .filter((item) => item !== '')
  }

  const classOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const row of summary.byClass ?? []) {
      if (row.classId) map.set(row.classId, row.className || row.classId)
    }
    for (const row of results) {
      if (row.classId) {
        if (!map.has(row.classId)) map.set(row.classId, row.className || row.classId)
      } else if (row.className) {
        const matched = (summary.byClass ?? []).find((item) => item.className === row.className)
        const id = matched?.classId || row.className
        if (!map.has(id)) map.set(id, row.className)
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [summary, results])

  const subjectMap = useMemo(() => {
    const map = new Map<string, ExportSubject[]>()
    for (const schoolClass of report?.classes ?? []) {
      for (const student of schoolClass.students ?? []) {
        const key = student.studentId || student.name
        if (key && Array.isArray(student.subjects)) map.set(key, student.subjects)
      }
    }
    return map
  }, [report])

  const subjectsFor = (row: ResultRow): ExportSubject[] =>
    subjectMap.get(row.studentId) ?? (row.studentName ? subjectMap.get(row.studentName) ?? [] : [])

  const stats = useMemo(() => {
    const total = num(summary.total) ?? results.length
    const success =
      num(summary.success) ?? results.filter((row) => decisionOf(row) === 'success').length
    const fail = num(summary.fail) ?? results.filter((row) => decisionOf(row) === 'fail').length
    const rate = total > 0 ? Math.round((success / total) * 100) : 0
    return { total, success, fail, rate }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary, results, threshold])

  const handleSaveCoefficients = async () => {
    if (!policy) return
    setSavingPolicy(true)
    const coefficients: Record<string, number> = { ...(policy.subjectCoefficients ?? {}) }
    for (const [subjectId, value] of Object.entries(coeffDraft)) {
      const parsed = num(value)
      if (parsed !== null && parsed > 0) coefficients[subjectId] = parsed
    }
    try {
      const response = await apiPost<{ policy: Policy }, { policy: Policy }>('/admin/grades/config', {
        policy: { ...policy, subjectCoefficients: coefficients },
      })
      setPolicy(response.policy)
      setCoeffDraft(() => {
        const next: Record<string, string> = {}
        for (const [subjectId, value] of Object.entries(response.policy.subjectCoefficients ?? {})) {
          next[subjectId] = String(value)
        }
        return next
      })
    } catch {
      setApprovalError(messageOf(loadError, loadError))
    } finally {
      setSavingPolicy(false)
    }
  }

  const handleApprove = async (entry: PendingEntry) => {
    setApprovalError(null)
    setApprovedId(null)
    setApprovingId(entry.id)
    try {
      await apiPost<{ entry: unknown }, { id: string }>('/admin/grades/approve', { id: entry.id })
      setPending((current) => current.filter((item) => item.id !== entry.id))
      setApprovedId(entry.id)
      setReloadKey((key) => key + 1)
    } catch (err: unknown) {
      setApprovalError(messageOf(err, loadError))
    } finally {
      setApprovingId(null)
    }
  }

  const handleDownload = () => {
    const payload = report ?? { results, summary, advisory: true }
    setExportMessage(null)
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `grade-results-${cycleFilter}-${classFilter || 'all'}.json`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      setExportMessage(t('grAExported', { defaultValue: 'تم تجهيز التقرير.' }))
    } catch {
      setExportMessage(t('grAExportFailed', { defaultValue: 'تعذّر تجهيز التقرير.' }))
    }
  }

  const handlePrint = () => window.print()

  return (
    <div className="space-y-5 animate-slide">
      <style>{PRINT_STYLES}</style>

      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5 no-print">
        <div>
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('grATitle', { defaultValue: 'نتائج الدرجات' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('grAHint', {
              defaultValue: 'مراجعة نتائج التلاميذ حسب القسم والدورة، وطباعة تقرير جاهز.',
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          disabled={loadingResults}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm"
        >
          {loadingResults ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          )}
          {t('grARefresh', { defaultValue: 'تحديث' })}
        </button>
      </section>

      <div className="no-print">
        <AdvisoryBanner>{advisory}</AdvisoryBanner>
      </div>

      {loadingResults ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted no-print">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('grALoading', { defaultValue: 'جارٍ التحميل…' })}
        </div>
      ) : resultsError ? (
        <div className="space-y-3 no-print">
          <Notice error>{resultsError}</Notice>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t('grARefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="no-print">
            <PlainSummary
              badge={t('uxSummaryBadge', { defaultValue: 'ملخّص في 10 ثوانٍ' })}
              title={t('uxSummaryTitle', { defaultValue: 'القراءة السريعة' })}
              sentence={t('grASummarySentence', {
                total: new Intl.NumberFormat(locale).format(stats.total),
                success: new Intl.NumberFormat(locale).format(stats.success),
                fail: new Intl.NumberFormat(locale).format(stats.fail),
                rate: `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(stats.rate)}%`,
                defaultValue:
                  '{{total}} تلميذًا، نجح {{success}} ورسب {{fail}} بمعدل نجاح {{rate}} حسب القواعد المعتمدة.',
              })}
              advisory={t('uxSummaryAdvisory', {
                defaultValue:
                  'مؤشرات استرشادية من بيانات النموذج؛ زمن المنصة منفصل عن الحضور، ولا تُتخذ قرارات دون مراجعة بشرية.',
              })}
              detailsLabel={t('uxSummaryDetails', { defaultValue: 'عرض التفاصيل' })}
              detailsHref="#gra-results-details"
              highlights={[
                {
                  label: t('grATotal', { defaultValue: 'الإجمالي' }),
                  value: new Intl.NumberFormat(locale).format(stats.total),
                },
                {
                  label: t('grASuccess', { defaultValue: 'الناجحون' }),
                  value: new Intl.NumberFormat(locale).format(stats.success),
                },
                {
                  label: t('grAFail', { defaultValue: 'الراسلون' }),
                  value: new Intl.NumberFormat(locale).format(stats.fail),
                },
                {
                  label: t('grASuccessRate', { defaultValue: 'نسبة النجاح' }),
                  value: `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(stats.rate)}%`,
                },
              ]}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 no-print">
            <StatCard
              icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}
              label={t('grATotal', { defaultValue: 'الإجمالي' })}
              value={new Intl.NumberFormat(locale).format(stats.total)}
            />
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
              label={t('grASuccess', { defaultValue: 'الناجحون' })}
              value={new Intl.NumberFormat(locale).format(stats.success)}
            />
            <StatCard
              icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
              label={t('grAFail', { defaultValue: 'الراسلون' })}
              value={new Intl.NumberFormat(locale).format(stats.fail)}
            />
            <StatCard
              icon={<GraduationCap className="h-4 w-4" aria-hidden="true" />}
              label={t('grASuccessRate', { defaultValue: 'نسبة النجاح' })}
              value={`${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(stats.rate)}%`}
            />
          </div>

          <section className="card-school p-4 sm:p-5 no-print">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-extrabold text-muted" htmlFor="gra-class">
                  {t('grAClass', { defaultValue: 'القسم' })}
                </label>
                <select
                  id="gra-class"
                  className="input-school"
                  value={classFilter}
                  onChange={(event) => {
                    setClassFilter(event.target.value)
                    setExpandedId(null)
                  }}
                >
                  <option value="">{t('grAClass', { defaultValue: 'القسم' })}</option>
                  {classOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-extrabold text-muted" htmlFor="gra-cycle">
                  {t('grACycle', { defaultValue: 'الدورة' })}
                </label>
                <select
                  id="gra-cycle"
                  className="input-school"
                  value={cycleFilter}
                  onChange={(event) => {
                    setCycleFilter(event.target.value as CycleFilter)
                    setExpandedId(null)
                  }}
                >
                  <option value="all">{t('grACycle', { defaultValue: 'الدورة' })}</option>
                  <option value="cycle1">{t('grTCycle1', { defaultValue: 'الدورة الأولى' })}</option>
                  <option value="cycle2">{t('grTCycle2', { defaultValue: 'الدورة الثانية' })}</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t-2 border-line pt-4">
              <button
                type="button"
                onClick={handlePrint}
                disabled={!report}
                className="btn-chunky btn-chunky--primary btn-chunky--sm"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                {t('grAPrint', { defaultValue: 'طباعة' })}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t('grADownload', { defaultValue: 'تنزيل JSON' })}
              </button>
              {exportMessage ? <span className="text-[11px] font-bold text-muted">{exportMessage}</span> : null}
            </div>
          </section>

          <section className="card-school p-4 sm:p-5 no-print">
            <h2 className="font-display text-lg font-black">
              {t('grAByClass', { defaultValue: 'حسب القسم' })}
            </h2>
            {(summary.byClass ?? []).length === 0 ? (
              <div className="mt-3">
                <Notice>{t('grANoResults', { defaultValue: 'لا توجد نتائج لعرضها.' })}</Notice>
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-card border-2 border-line bg-surface">
                <table className="w-full">
                  <thead className="bg-surface-muted">
                    <tr>
                      <th scope="col" className={TH}>{t('grAClass', { defaultValue: 'القسم' })}</th>
                      <th scope="col" className={TH}>{t('grAStudents', { defaultValue: 'التلاميذ' })}</th>
                      <th scope="col" className={TH}>{t('grAAverage', { defaultValue: 'المتوسط' })}</th>
                      <th scope="col" className={TH}>{t('grASuccess', { defaultValue: 'الناجحون' })}</th>
                      <th scope="col" className={TH}>{t('grAFail', { defaultValue: 'الراسلون' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(summary.byClass ?? []).map((row, index) => (
                      <tr key={`${row.classId ?? row.className ?? 'class'}-${index}`} className="border-t-2 border-line">
                        <td className={TD}>{row.className || row.classId || '—'}</td>
                        <td className={TD}>{new Intl.NumberFormat(locale).format((num(row.success) ?? 0) + (num(row.fail) ?? 0))}</td>
                        <td className={TD}>{number(readAverage(row.average))}</td>
                        <td className={TD}>{number(num(row.success))}</td>
                        <td className={TD}>{number(num(row.fail))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section id="gra-results-details" className="card-school scroll-mt-24 p-4 sm:p-5 no-print">
            <h2 className="flex items-center gap-2 font-display text-lg font-black">
              <ClipboardList className="h-5 w-5 text-brand-600" aria-hidden="true" />
              {t('grAResults', { defaultValue: 'النتائج' })}
              <span className="text-xs font-bold text-muted">({results.length})</span>
            </h2>

            {results.length === 0 ? (
              <div className="mt-3">
                <Notice>{t('grANoResults', { defaultValue: 'لا توجد نتائج لعرضها.' })}</Notice>
              </div>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-card border-2 border-line bg-surface">
                <table className="w-full" aria-label={t('grAResults', { defaultValue: 'النتائج' })}>
                  <thead className="bg-surface-muted">
                    <tr>
                      <th scope="col" className={TH}>{t('grAStudents', { defaultValue: 'التلاميذ' })}</th>
                      <th scope="col" className={TH}>{t('grAClass', { defaultValue: 'القسم' })}</th>
                      <th scope="col" className={TH}>{t('grTCycle1', { defaultValue: 'الدورة الأولى' })}</th>
                      <th scope="col" className={TH}>{t('grTCycle2', { defaultValue: 'الدورة الثانية' })}</th>
                      <th scope="col" className={TH}>{t('grTAnnual', { defaultValue: 'المعدل السنوي' })}</th>
                      <th scope="col" className={TH}>{t('grAMention', { defaultValue: 'التقدير' })}</th>
                      <th scope="col" className={TH}>{t('grTDecision', { defaultValue: 'القرار' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, index) => {
                      const rowId = `${row.studentId}-${index}`
                      const rowSubjects = subjectsFor(row)
                      const failing = failingList(row)
                      const decision = decisionOf(row)
                      const expanded = expandedId === rowId
                      return (
                        <Fragment key={rowId}>
                          <tr
                            className="cursor-pointer border-t-2 border-line transition hover:bg-surface-muted"
                            onClick={() => setExpandedId(expanded ? null : rowId)}
                          >
                            <td className={TD}>
                              <span className="inline-flex items-center gap-1 font-black text-content">
                                <ChevronDown
                                  className={`h-3.5 w-3.5 shrink-0 text-muted transition ${expanded ? 'rotate-180' : ''}`}
                                  aria-hidden="true"
                                />
                                {row.studentName || row.studentId}
                              </span>
                            </td>
                            <td className={TD}>{row.className || row.levelName || '—'}</td>
                            <td className={TD}>{number(readAverage(row.cycle1))}</td>
                            <td className={TD}>{number(readAverage(row.cycle2))}</td>
                            <td className={TD}>{number(readAverage(row.annualAverage))}</td>
                            <td className={TD}>{mentionFrom(row.mention, locale)}</td>
                            <td className={TD}>
                              <span className={decisionBadgeClass(decision)}>{decisionText(decision)}</span>
                            </td>
                          </tr>
                          {expanded ? (
                            <tr className="border-t-2 border-line bg-surface-muted">
                              <td colSpan={7} className="px-3 py-3">
                                {failing.length ? (
                                  <p className="mb-2 text-[11px] font-bold">
                                    <span className="text-muted">
                                      {t('grTFailingSubjects', { defaultValue: 'المواد غير الناجحة' })}:{' '}
                                    </span>
                                    <span className="text-[#E03131]">{failing.join('، ')}</span>
                                  </p>
                                ) : null}
                                {rowSubjects.length === 0 ? (
                                  <p className="text-[11px] font-semibold text-muted">
                                    {t('grANoResults', { defaultValue: 'لا توجد نتائج لعرضها.' })}
                                  </p>
                                ) : (
                                  <div className="overflow-x-auto rounded-card border-2 border-line bg-surface">
                                    <table className="w-full">
                                      <thead className="bg-surface-muted">
                                        <tr>
                                          <th scope="col" className={TH}>{t('grTSubject', { defaultValue: 'المادة' })}</th>
                                          <th scope="col" className={TH}>{t('grAAverage', { defaultValue: 'المتوسط' })}</th>
                                          <th scope="col" className={TH}>{t('grTCoefficients', { defaultValue: 'المعاملات' })}</th>
                                          <th scope="col" className={TH}>{t('grAMention', { defaultValue: 'التقدير' })}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {rowSubjects.map((subject, subjectIndex) => (
                                          <tr
                                            key={`${subject.name ?? 'subject'}-${subjectIndex}`}
                                            className="border-t-2 border-line"
                                          >
                                            <td className={TD}>{subject.name || '—'}</td>
                                            <td className={TD}>{number(readAverage(subject.average))}</td>
                                            <td className={TD}>{number(num(subject.coefficient))}</td>
                                            <td className={TD}>{mentionFrom(subject.mention, locale)}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {pendingAvailable ? (
            <section className="card-school p-4 sm:p-5 no-print">
              <h2 className="font-display text-lg font-black">
                {t('grAApproval', { defaultValue: 'اعتماد الدرجات' })}
                <span className="ms-2 text-xs font-bold text-muted">
                  {t('grAPending', { defaultValue: 'في انتظار الاعتماد' })} ({pending.length})
                </span>
              </h2>
              {approvalError ? (
                <div className="mt-3">
                  <Notice error>{approvalError}</Notice>
                </div>
              ) : null}
              {approvedId ? (
                <p className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {t('grAApproved', { defaultValue: 'تم الاعتماد' })}
                </p>
              ) : null}
              {pending.length === 0 ? (
                <div className="mt-3">
                  <Notice>{t('grANoResults', { defaultValue: 'لا توجد نتائج لعرضها.' })}</Notice>
                </div>
              ) : (
                <ul className="mt-3 space-y-2">
                  {pending.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-card border-2 border-line bg-surface p-3"
                    >
                      <div className="min-w-0 text-xs font-bold text-content">
                        <span className="font-black">
                          {entry.studentName || entry.studentId || entry.id}
                        </span>
                        <span className="text-muted">
                          {' · '}
                          {entry.subjectName || entry.subjectId || '—'}
                          {entry.cycle ? ` · ${cycleLabel(entry.cycle)}` : ''}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleApprove(entry)}
                        disabled={approvingId === entry.id}
                        className="btn-chunky btn-chunky--primary btn-chunky--sm"
                      >
                        {approvingId === entry.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        ) : (
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {t('grAApprove', { defaultValue: 'اعتماد' })}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}

          <section className="card-school p-4 sm:p-5 no-print">
            <h2 className="font-display text-lg font-black">
              {t('grAPolicy', { defaultValue: 'سياسة التقييم' })}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-muted">
              <span className="rounded-full bg-surface-muted px-2 py-0.5">
                {t('grTScale', { defaultValue: 'المقياس' })}: {number(activePolicy.scale)}
              </span>
              <span className="rounded-full bg-surface-muted px-2 py-0.5">
                {t('grTThreshold', { defaultValue: 'عتبة النجاح' })}: {number(activePolicy.successThreshold)}
              </span>
            </div>
            {subjects.length ? (
              <div className="mt-3 overflow-x-auto rounded-card border-2 border-line bg-surface">
                <table className="w-full">
                  <thead className="bg-surface-muted">
                    <tr>
                      <th scope="col" className={TH}>{t('grTSubjects', { defaultValue: 'المواد' })}</th>
                      <th scope="col" className={TH}>{t('grTCoefficients', { defaultValue: 'المعاملات' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.id} className="border-t-2 border-line">
                        <td className={TD}>{subject.name || subject.id}</td>
                        <td className={TD}>
                          <input
                            aria-label={`${t('grTCoefficients', { defaultValue: 'المعاملات' })} — ${subject.name || subject.id}`}
                            type="number"
                            min={0}
                            step="0.5"
                            className="input-school w-24"
                            value={coeffDraft[subject.id] ?? String(activePolicy.subjectCoefficients?.[subject.id] ?? 1)}
                            onChange={(event) =>
                              setCoeffDraft((current) => ({
                                ...current,
                                [subject.id]: event.target.value,
                              }))
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSaveCoefficients()}
                disabled={savingPolicy || !policy}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                {savingPolicy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {t('grAPolicy', { defaultValue: 'سياسة التقييم' })}
              </button>
              <p className="text-[11px] font-semibold leading-relaxed text-muted">
                {t('grTExplainFormula', {
                  defaultValue:
                    'تُحسب درجة المادة كمتوسط مرجّح للاختبارات وفق معاملاتها، مع إدراج درجة المشاركة بوزنها، ثم يُرجّح متوسط كل مادة بمعاملها لحساب متوسط الدورة. يُرجّح متوسطا الدورتين بحسب أوزانهما لإنتاج المعدل السنوي، وتُمنح الإشارة بحسب نطاق المعدل، ويكون النجاح عند بلوغ عتبة النجاح. النتائج استرشادية.',
                })}
              </p>
            </div>
          </section>
        </div>
      )}

      <section className="print-report rounded-card border-2 border-line bg-surface p-5" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {/* Official institutional header — matches the paper bulletin of Institut Ryad Al Aqsa */}
        <div className="border-b-2 border-line pb-3 text-center">
          <p className="text-[12px] font-black text-content">{t('bulKingdom', { defaultValue: 'المملكة المغربية' })}</p>
          <p className="mt-0.5 text-[11px] font-bold text-content">
            {t('bulMinistry', { defaultValue: 'وزارة التربية الوطنية والتعليم الأولي والرياضة' })}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-muted">
            {t('bulDirectorate', { defaultValue: 'المديرية الإقليمية للتعليم' })}
          </p>
          <p className="mt-1 text-[11px] font-extrabold text-content">
            {t('bulEstablishment', { defaultValue: 'المؤسسة' })}: {report?.institution?.name || 'رياض الأقصى'}
          </p>
          <h2 className="mt-2 font-display text-base font-black text-content">
            {t('bulBulletin', { defaultValue: 'نتيجة الدورة' })} —{' '}
            {String(report?.cycle || '').includes('2') || report?.cycle === 'cycle2'
              ? t('bulCycle2', { defaultValue: 'الدورة الثانية' })
              : t('bulCycle1', { defaultValue: 'الدورة الأولى' })}
          </h2>
        </div>

        <div className="mt-3 grid gap-1 text-[11px] font-bold text-content sm:grid-cols-2">
          <p>
            {t('bulSchoolYear', { defaultValue: 'السنة الدراسية' })}: {report?.year ?? '—'}
          </p>
          <p>
            {t('grAGenerated', { defaultValue: 'تاريخ الإصدار' })}: {formatDate(report?.generatedAt)}
          </p>
          <p>
            {t('bulGradeScale', { defaultValue: 'من /10' })}
          </p>
          <p className="text-muted">
            {t('bulAdvisoryNote', { defaultValue: 'هذه النتيجة مسوّدة استرشادية تخضع لمصادقة الإدارة.' })}
          </p>
        </div>

        {report?.classes && report.classes.length > 0 ? (
          report.classes.map((schoolClass, classIndex) => (
            <div key={`${schoolClass.classId ?? schoolClass.name ?? 'class'}-${classIndex}`} className="mt-4">
              <h3 className="font-display text-sm font-black text-content">
                {t('grAClass', { defaultValue: 'القسم' })}: {schoolClass.name || schoolClass.classId || '—'}
              </h3>
              {(schoolClass.students ?? []).length === 0 ? (
                <p className="mt-2 text-[11px] font-semibold text-muted">
                  {t('grANoResults', { defaultValue: 'لا توجد نتائج لعرضها.' })}
                </p>
              ) : (
                (() => {
                  const students = schoolClass.students ?? []
                  const effectif = students.length
                  const ranked = students
                    .map((s) => ({ s, avg: readAverage(s.cycleAverage) ?? 0 }))
                    .sort((a, b) => b.avg - a.avg)
                  const rankById = new Map<string, number>()
                  ranked.forEach((row, i) => {
                    if (row.s.studentId) rankById.set(row.s.studentId, i + 1)
                  })
                  return students.map((student, studentIndex) => {
                    const subjects = student.subjects ?? []
                    const total = subjects.reduce((sum, s) => {
                      const c = num(s.coefficient) ?? 0
                      const a = readAverage(s.average) ?? 0
                      return sum + c * a
                    }, 0)
                    const rank = student.studentId
                      ? rankById.get(student.studentId)
                      : studentIndex + 1
                    const isFail = (student.decision ?? '').toLowerCase().includes('fail')
                    return (
                      <div
                        key={`${student.studentId ?? student.name ?? 'student'}-${studentIndex}`}
                        className="mt-4 break-inside-avoid rounded-card border-2 border-line bg-surface p-3"
                      >
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
                          <span className="text-xs font-black text-content">
                            {t('bulStudentName', { defaultValue: 'اسم التلميذ' })}: {student.name || student.studentId || '—'}
                          </span>
                          <span className="text-[11px] font-bold text-muted">
                            {t('bulDivision', { defaultValue: 'القسم' })}: {schoolClass.name || schoolClass.classId || '—'}
                            {' · '}
                            {t('bulStudentsCount', { defaultValue: 'عدد التلاميذ' })}: {effectif}
                          </span>
                        </div>
                        <div className="overflow-x-auto rounded-card border-2 border-line bg-surface">
                          <table className="w-full">
                            <thead className="bg-surface-muted">
                              <tr>
                                <th scope="col" className={TH}>{t('bulSubject', { defaultValue: 'المادة' })}</th>
                                <th scope="col" className={TH}>{t('bulGrade', { defaultValue: 'النقطة' })}</th>
                                <th scope="col" className={TH}>{t('bulCoefficient', { defaultValue: 'المعامل' })}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subjects.length === 0 ? (
                                <tr>
                                  <td colSpan={3} className={`${TD} text-center text-muted`}>
                                    {t('grANoResults', { defaultValue: 'لا توجد نتائج لعرضها.' })}
                                  </td>
                                </tr>
                              ) : (
                                <>
                                  <tr className="bg-brand-soft">
                                    <td colSpan={3} className={TD}>
                                      {t('bulGroup1', { defaultValue: 'المجموعة الأولى' })}
                                    </td>
                                  </tr>
                                  {subjects.slice(0, Math.ceil(subjects.length / 2)).map((subject, i) => (
                                    <tr key={`g1-${subject.name ?? 'subject'}-${i}`} className="border-t-2 border-line">
                                      <td className={TD}>{subject.name || '—'}</td>
                                      <td className={TD}>{number(readAverage(subject.average))}</td>
                                      <td className={TD}>{number(num(subject.coefficient))}</td>
                                    </tr>
                                  ))}
                                  <tr className="bg-brand-soft">
                                    <td colSpan={3} className={TD}>
                                      {t('bulGroup2', { defaultValue: 'المجموعة الثانية' })}
                                    </td>
                                  </tr>
                                  {subjects.slice(Math.ceil(subjects.length / 2)).map((subject, i) => (
                                    <tr key={`g2-${subject.name ?? 'subject'}-${i}`} className="border-t-2 border-line">
                                      <td className={TD}>{subject.name || '—'}</td>
                                      <td className={TD}>{number(readAverage(subject.average))}</td>
                                      <td className={TD}>{number(num(subject.coefficient))}</td>
                                    </tr>
                                  ))}
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-2 grid gap-1 text-[11px] font-bold text-content sm:grid-cols-2">
                          <p>{t('bulTotal', { defaultValue: 'مجموع النقاط' })}: {number(total)}</p>
                          <p>{t('bulAverage', { defaultValue: 'المعدل' })}: {number(readAverage(student.cycleAverage))}</p>
                          <p>{t('bulRank', { defaultValue: 'ترتيب التلميذ' })}: {rank ?? '—'} / {effectif}</p>
                          <p>
                            {t('bulDecision', { defaultValue: 'القرار' })}:{' '}
                            {subjects.length === 0 || student.cycleAverage == null ? (
                              <span className="text-muted">—</span>
                            ) : (
                              <span className={isFail ? 'text-[#E03131]' : 'text-brand-700'}>
                                {isFail
                                  ? t('bulFail', { defaultValue: 'رسوب' })
                                  : t('bulSuccess', { defaultValue: 'نجاح' })}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-4 border-t border-line pt-2 text-[10px] font-bold text-muted">
                          <span>{t('bulHeadmaster', { defaultValue: 'مدير المؤسسة' })}</span>
                          <span className="grid h-16 w-28 place-items-center rounded-full border-2 border-dashed border-line text-center">
                            {t('bulStamp', { defaultValue: 'ختم المؤسسة' })}
                          </span>
                        </div>
                      </div>
                    )
                  })
                })()
              )}
            </div>
          ))
        ) : (
          <p className="mt-4 rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
            {t('grANoResults', { defaultValue: 'لا توجد نتائج لعرضها.' })}
          </p>
        )}

        <AdvisoryBanner>
          {report?.note ? `${advisory} ${report.note}` : advisory}
        </AdvisoryBanner>
      </section>
    </div>
  )
}
