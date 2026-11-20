import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

type Cycle = 'cycle1' | 'cycle2'
type EntryStatus = 'draft' | 'submitted' | 'approved'

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

interface TestItem {
  id?: string
  label: string
  score: number
  coefficient: number
}

interface GradeEntry {
  id: string
  studentId: string
  classId?: string
  cycle: Cycle
  subjectId: string
  subjectName?: string
  term?: string
  tests: TestItem[]
  participationScore: number
  subjectCoefficient: number
  enteredBy?: string
  enteredAt?: string
  status: EntryStatus
  approvedBy?: string | null
  approvedAt?: string | null
}

interface EntriesResponse {
  entries: GradeEntry[]
  meta?: { cycles?: string[]; statuses?: string[] }
}

interface TestDraft {
  label: string
  score: string
  coefficient: string
}

interface Draft {
  studentId: string
  cycle: Cycle
  subjectId: string
  tests: TestDraft[]
  participationScore: string
  subjectCoefficient: string
}

interface StudentOption {
  id: string
  name: string
}

interface SavePayload {
  studentId: string
  cycle: Cycle
  subjectId: string
  tests: Array<{ label: string; score: number; coefficient: number }>
  participationScore: number
  subjectCoefficient: number
}

interface Derived {
  subjectAverage?: number
  mention?: unknown
}

interface SaveResponse {
  entry: GradeEntry
  derived?: Derived
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

function mentionFor(average: number, bands: MentionBand[], locale: string): string {
  const list = Array.isArray(bands) ? bands : []
  for (const band of list) {
    const min = num(band?.min)
    const max = num(band?.max)
    const key = typeof band?.key === 'string' ? band.key : ''
    if (min !== null && max !== null && average >= min && average <= max) {
      return mentionLabel(key, locale)
    }
  }
  return '—'
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function computeSubjectAverage(tests: TestItem[], participation: number, policy: Policy): number {
  const scale = policy?.scale || 20
  let weighted = 0
  let weight = 0
  for (const test of tests) {
    const score = num(test?.score) ?? 0
    const coefficient = num(test?.coefficient) ?? 0
    weighted += score * coefficient
    weight += coefficient
  }
  const participationWeight = num(policy?.participationWeight) ?? 0
  if (participationWeight > 0) {
    weighted += participation * participationWeight
    weight += participationWeight
  }
  if (weight <= 0) return 0
  return clamp(weighted / weight, 0, scale)
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

function extractStudentOptions(payload: unknown): StudentOption[] {
  const candidates: unknown[] = []
  if (Array.isArray(payload)) {
    candidates.push(...payload)
  } else if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>
    for (const key of ['students', 'items', 'rows', 'list', 'data', 'attendance']) {
      if (Array.isArray(obj[key])) candidates.push(...(obj[key] as unknown[]))
    }
  }
  const options: StudentOption[] = []
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue
    const obj = candidate as Record<string, unknown>
    const idValue = pick(obj, 'studentId', 'id')
    const nameValue = pick(obj, 'studentName', 'name', 'fullName')
    const id = typeof idValue === 'string' ? idValue.trim() : ''
    if (!id) continue
    options.push({
      id,
      name: typeof nameValue === 'string' && nameValue.trim() ? nameValue.trim() : id,
    })
  }
  return options
}

function uniqueStudents(list: StudentOption[]): StudentOption[] {
  const map = new Map<string, string>()
  for (const student of list) map.set(student.id, student.name)
  return Array.from(map, ([id, name]) => ({ id, name }))
}

async function fetchStudents(signal: AbortSignal): Promise<StudentOption[]> {
  try {
    const direct = await apiGet<unknown>('/teacher/students', { signal })
    const list = extractStudentOptions(direct)
    if (list.length) return uniqueStudents(list)
  } catch {
    /* optional endpoint — keep looking */
  }

  try {
    const classData = await apiGet<{ classes?: Array<{ id: string }> }>('/teacher/classes', { signal })
    const classes = Array.isArray(classData.classes) ? classData.classes : []
    const collected: StudentOption[] = []
    for (const schoolClass of classes.slice(0, 10)) {
      if (!schoolClass?.id) continue
      for (const url of ['/teacher/class-students', '/teacher/attendance']) {
        try {
          const payload = await apiGet<unknown>(url, { params: { classId: schoolClass.id }, signal })
          collected.push(...extractStudentOptions(payload))
        } catch {
          /* optional endpoint — keep looking */
        }
      }
    }
    if (collected.length) return uniqueStudents(collected)
  } catch {
    /* optional endpoint */
  }

  return []
}

function emptyDraft(subjects: Subject[], policy: Policy): Draft {
  const subjectId = subjects[0]?.id ?? ''
  return {
    studentId: '',
    cycle: 'cycle1',
    subjectId,
    tests: [{ label: '', score: '', coefficient: '1' }],
    participationScore: '',
    subjectCoefficient: String(subjectId ? (policy?.subjectCoefficients?.[subjectId] ?? 1) : 1),
  }
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

function AdvisoryBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

export default function GradesEntry() {
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage ?? 'ar'
  const scale = 20

  const advisory = t('grTAdvisory', {
    defaultValue: 'النتائج استرشادية في انتظار الاعتماد البشري؛ النتائج الرسمية تصدر عن الإدارة.',
  })
  const loadError = t('grTLoadError', { defaultValue: 'تعذّر تحميل بيانات الدرجات.' })

  const number = (value: number | null | undefined): string =>
    value === null || value === undefined || !Number.isFinite(value)
      ? '—'
      : new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)

  const formatDate = (value?: string): string => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
    } catch {
      return value
    }
  }

  const [policy, setPolicy] = useState<Policy | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [entries, setEntries] = useState<GradeEntry[]>([])
  const [students, setStudents] = useState<StudentOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [draft, setDraft] = useState<Draft>(() => emptyDraft([], { scale: 20, participationWeight: 0 } as Policy))
  const [formError, setFormError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [lastAverage, setLastAverage] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [computeStudentId, setComputeStudentId] = useState('')
  const [computeCycle, setComputeCycle] = useState<Cycle>('cycle1')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [computing, setComputing] = useState(false)
  const [computeError, setComputeError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      apiGet<ConfigResponse>('/teacher/grades/config', { signal: controller.signal }),
      apiGet<EntriesResponse>('/teacher/grades/entries', { signal: controller.signal }),
    ])
      .then(([config, data]) => {
        if (cancelled) return
        const nextPolicy = config.policy
        const listSubjects = Array.isArray(config.subjects) ? config.subjects : []
        const listEntries = Array.isArray(data.entries) ? data.entries : []
        setPolicy(nextPolicy)
        setSubjects(listSubjects)
        setEntries(listEntries)
        setDraft((current) => {
          const subjectId = listSubjects.some((item) => item.id === current.subjectId)
            ? current.subjectId
            : (listSubjects[0]?.id ?? current.subjectId)
          return {
            ...current,
            studentId: current.studentId || listEntries[0]?.studentId || '',
            subjectId,
            subjectCoefficient:
              current.subjectCoefficient ||
              String(subjectId ? (nextPolicy?.subjectCoefficients?.[subjectId] ?? 1) : 1),
          }
        })
        setComputeStudentId((current) => current || listEntries[0]?.studentId || '')
      })
      .catch((err: unknown) => {
        if (!cancelled && !controller.signal.aborted) setError(messageOf(err, loadError))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    fetchStudents(controller.signal)
      .then((list) => {
        if (!cancelled) setStudents(list)
      })
      .catch(() => {
        /* students are optional */
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, loadError])

  const studentOptions = useMemo(() => {
    const map = new Map<string, string>()
    for (const student of students) map.set(student.id, student.name)
    for (const entry of entries) {
      if (entry.studentId && !map.has(entry.studentId)) map.set(entry.studentId, entry.studentId)
    }
    if (draft.studentId && !map.has(draft.studentId)) map.set(draft.studentId, draft.studentId)
    if (computeStudentId && !map.has(computeStudentId)) {
      map.set(computeStudentId, computeStudentId)
    }
    return Array.from(map, ([id, name]) => ({ id, name }))
  }, [students, entries, draft.studentId, computeStudentId])

  const studentName = (id: string): string =>
    studentOptions.find((student) => student.id === id)?.name ?? id

  const activePolicy: Policy = policy ?? { scale: 20, participationWeight: 0 } as Policy
  const activeScale = num(activePolicy.scale) ?? 20
  const effectiveScale = loading ? scale : activeScale

  const resetForm = () => {
    setDraft(emptyDraft(subjects, activePolicy))
    setFormError(null)
    setSaveError(null)
    setSaved(false)
    setLastAverage(null)
  }

  const handleSubjectChange = (subjectId: string) => {
    setDraft((current) => ({
      ...current,
      subjectId,
      subjectCoefficient: String(subjectId ? (activePolicy.subjectCoefficients?.[subjectId] ?? 1) : 1),
    }))
  }

  const handleSave = async () => {
    setFormError(null)
    setSaveError(null)
    setSaved(false)
    setLastAverage(null)

    const studentId = draft.studentId.trim()
    if (!studentId || !draft.subjectId.trim()) {
      setFormError(t('grTRequired', { defaultValue: 'يرجى إكمال الحقول المطلوبة والتحقق من الدرجات.' }))
      return
    }

    const tests = draft.tests.map((test) => ({
      label: test.label.trim(),
      score: Number(test.score),
      coefficient: Number(test.coefficient),
    }))
    if (
      tests.length === 0 ||
      tests.some((test) => !Number.isFinite(test.score) || test.score < 0 || test.score > effectiveScale) ||
      tests.some((test) => !Number.isFinite(test.coefficient) || test.coefficient <= 0)
    ) {
      setFormError(t('grTRequired', { defaultValue: 'يرجى إكمال الحقول المطلوبة والتحقق من الدرجات.' }))
      return
    }

    const participationScore = Number(draft.participationScore || 0)
    if (
      !Number.isFinite(participationScore) ||
      participationScore < 0 ||
      participationScore > effectiveScale
    ) {
      setFormError(t('grTRequired', { defaultValue: 'يرجى إكمال الحقول المطلوبة والتحقق من الدرجات.' }))
      return
    }

    const subjectCoefficient = Number(draft.subjectCoefficient)
    if (!Number.isFinite(subjectCoefficient) || subjectCoefficient <= 0) {
      setFormError(t('grTRequired', { defaultValue: 'يرجى إكمال الحقول المطلوبة والتحقق من الدرجات.' }))
      return
    }

    const payload: SavePayload = {
      studentId,
      cycle: draft.cycle,
      subjectId: draft.subjectId.trim(),
      tests,
      participationScore,
      subjectCoefficient,
    }

    setSaving(true)
    try {
      const response = await apiPost<SaveResponse, SavePayload>('/teacher/grades/entries', payload)
      setEntries((current) => [response.entry, ...current])
      if (!studentOptions.some((option) => option.id === studentId)) {
        setStudents((current) => [...current, { id: studentId, name: studentId }])
      }
      const derivedAverage = num(response.derived?.subjectAverage)
      setLastAverage(
        derivedAverage ??
          computeSubjectAverage(
            tests.map((test, index) => ({ ...test, id: String(index) })),
            participationScore,
            activePolicy,
          ),
      )
      setSaved(true)
      setDraft((current) => ({
        ...current,
        tests: [{ label: '', score: '', coefficient: '1' }],
        participationScore: '',
      }))
    } catch (err: unknown) {
      setSaveError(messageOf(err, t('grTSaveFailed', { defaultValue: 'تعذّر حفظ الدرجة.' })))
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitEntry = async (entry: GradeEntry) => {
    setSubmitError(null)
    setSubmittedId(null)
    setSubmittingId(entry.id)
    try {
      const response = await apiPost<{ entry: GradeEntry }, { id: string }>(
        '/teacher/grades/entries/submit',
        { id: entry.id },
      )
      setEntries((current) => current.map((item) => (item.id === entry.id ? response.entry : item)))
      setSubmittedId(entry.id)
    } catch (err: unknown) {
      setSubmitError(messageOf(err, t('grTSaveFailed', { defaultValue: 'تعذّر حفظ الدرجة.' })))
    } finally {
      setSubmittingId(null)
    }
  }

  const handleCompute = async () => {
    const studentId = computeStudentId.trim()
    if (!studentId) {
      setComputeError(t('grTRequired', { defaultValue: 'يرجى إكمال الحقول المطلوبة والتحقق من الدرجات.' }))
      return
    }
    setComputing(true)
    setResult(null)
    setComputeError(null)
    try {
      const response = await apiPost<{ result: Record<string, unknown> }, { studentId: string; cycle: Cycle }>(
        '/teacher/grades/compute',
        { studentId, cycle: computeCycle },
      )
      setResult(response.result ?? null)
    } catch (err: unknown) {
      setComputeError(messageOf(err, loadError))
    } finally {
      setComputing(false)
    }
  }

  const cycleLabel = (cycle: Cycle): string =>
    cycle === 'cycle2'
      ? t('grTCycle2', { defaultValue: 'الدورة الثانية' })
      : t('grTCycle1', { defaultValue: 'الدورة الأولى' })

  const statusBadge = (status: EntryStatus): string => {
    if (status === 'approved') {
      return 'rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700'
    }
    if (status === 'submitted') {
      return 'rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800'
    }
    return 'rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-black text-muted'
  }

  const statusLabel = (status: EntryStatus): string => {
    if (status === 'approved') return t('grTApproved', { defaultValue: 'معتمد' })
    if (status === 'submitted') return t('grTSubmittedStatus', { defaultValue: 'مُرسل' })
    return t('grTDraft', { defaultValue: 'مسودة' })
  }

  const resultCycle1 = result ? readAverage(pick(result, 'cycle1', 'firstCycle', 'term1')) : null
  const resultCycle2 = result ? readAverage(pick(result, 'cycle2', 'secondCycle', 'term2')) : null
  const resultAnnual = result ? readAverage(pick(result, 'annualAverage', 'annual', 'average', 'yearAverage')) : null

  const resultDecision = (() => {
    if (!result) return null
    const passed = pick(result, 'passed', 'success')
    if (typeof passed === 'boolean') return passed ? 'success' : 'fail'
    const decisionValue = pick(result, 'decision', 'result', 'status')
    if (typeof decisionValue === 'string') {
      const value = decisionValue.toLowerCase()
      if (value.includes('succ') || value.includes('pass') || value === 'réussi' || value === 'reussi') {
        return 'success'
      }
      if (value.includes('fail') || value.includes('échec') || value === 'echec') return 'fail'
    }
    if (resultAnnual !== null) {
      return resultAnnual >= (num(activePolicy.successThreshold) ?? 10) ? 'success' : 'fail'
    }
    return null
  })()

  const failingSubjects = (() => {
    if (!result) return [] as string[]
    const raw = pick(result, 'failingSubjects', 'failedSubjects', 'failures')
    if (!Array.isArray(raw)) return [] as string[]
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
  })()

  const resultMention = result
    ? pick(result, 'mention', 'appreciation') !== undefined
      ? mentionFrom(pick(result, 'mention', 'appreciation'), locale)
      : resultAnnual !== null
        ? mentionFor(resultAnnual, activePolicy.mentionBands ?? [], locale)
        : '—'
    : '—'

  const resultBreakdown = (() => {
    if (!result) return [] as Array<{ key: string; name: string; average: number | null; coefficient: number | null; mention: string }>
    const raw = pick(result, 'subjectAverages', 'subjects', 'subjectResults', 'breakdown')
    if (!Array.isArray(raw)) return [] as Array<{ key: string; name: string; average: number | null; coefficient: number | null; mention: string }>
    return raw.map((item, index) => {
      const obj = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
      const nameValue = pick(obj, 'subjectName', 'name', 'subject', 'subjectId')
      const name = typeof nameValue === 'string' && nameValue ? nameValue : '—'
      return {
        key: `${name}-${index}`,
        name,
        average: readAverage(pick(obj, 'average', 'subjectAverage', 'averageScore', 'score', 'value')),
        coefficient: num(pick(obj, 'coefficient', 'weight')),
        mention: mentionFrom(pick(obj, 'mention'), locale),
      }
    })
  })()

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('grTTitle', { defaultValue: 'إدخال الدرجات' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('grTHint', {
              defaultValue: 'أدخل درجات الاختبارات والمشاركة لكل مادة، واطّلع على المتوسطات المحسوبة آليًا.',
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          disabled={loading}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          )}
          {t('grTRefresh', { defaultValue: 'تحديث' })}
        </button>
      </section>

      <AdvisoryBanner>{advisory}</AdvisoryBanner>

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('grTLoading', { defaultValue: 'جارٍ التحميل…' })}
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
            {t('grTRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <section className="card-school p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-black">
              <BookOpen className="h-5 w-5 text-brand-600" aria-hidden="true" />
              {t('grTPolicy', { defaultValue: 'سياسة التقييم' })}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                <p className="text-[11px] font-extrabold text-muted">
                  {t('grTScale', { defaultValue: 'المقياس' })}
                </p>
                <p className="mt-1 font-display text-xl font-black text-content">
                  {number(activePolicy.scale)}
                </p>
              </div>
              <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                <p className="text-[11px] font-extrabold text-muted">
                  {t('grTThreshold', { defaultValue: 'عتبة النجاح' })}
                </p>
                <p className="mt-1 font-display text-xl font-black text-content">
                  {number(activePolicy.successThreshold)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <h3 className="text-xs font-black text-content">
                  {t('grTMention', { defaultValue: 'التقدير' })}
                </h3>
                <div className="mt-2 overflow-x-auto rounded-card border-2 border-line bg-surface">
                  <table className="w-full">
                    <thead className="bg-surface-muted">
                      <tr>
                        <th scope="col" className={TH}>{t('grTScale', { defaultValue: 'المقياس' })}</th>
                        <th scope="col" className={TH}>{t('grTMention', { defaultValue: 'التقدير' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activePolicy.mentionBands ?? []).length === 0 ? (
                        <tr>
                          <td colSpan={2} className={`${TD} text-center text-muted`}>—</td>
                        </tr>
                      ) : (
                        (activePolicy.mentionBands ?? []).map((band, index) => (
                          <tr key={`${band.key}-${index}`} className="border-t-2 border-line">
                            <td className={TD}>
                              {number(num(band.min))} – {number(num(band.max))}
                            </td>
                            <td className={TD}>
                              {mentionLabel(band.key, locale)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-black text-content">
                  {t('grTSubjects', { defaultValue: 'المواد' })} —{' '}
                  {t('grTCoefficients', { defaultValue: 'المعاملات' })}
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {subjects.length === 0 ? (
                    <li className="text-xs font-semibold text-muted">—</li>
                  ) : (
                    subjects.map((subject) => (
                      <li
                        key={subject.id}
                        className="flex items-center justify-between gap-2 rounded-card border-2 border-line bg-surface px-3 py-2"
                      >
                        <span className="truncate text-xs font-extrabold text-content">
                          {subject.name || subject.id}
                        </span>
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black">
                          {number(activePolicy.subjectCoefficients?.[subject.id] ?? 1)}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {activePolicy.note ? (
              <p className="mt-4 text-[11px] font-semibold text-muted">{activePolicy.note}</p>
            ) : null}
            <p className="mt-3 rounded-card bg-surface-muted p-3 text-[11px] font-semibold leading-relaxed text-muted">
              {t('grTExplainFormula', {
                defaultValue:
                  'تُحسب درجة المادة كمتوسط مرجّح للاختبارات وفق معاملاتها، مع إدراج درجة المشاركة بوزنها، ثم يُرجّح متوسط كل مادة بمعاملها لحساب متوسط الدورة. يُرجّح متوسطا الدورتين بحسب أوزانهما لإنتاج المعدل السنوي، وتُمنح الإشارة بحسب نطاق المعدل، ويكون النجاح عند بلوغ عتبة النجاح. النتائج استرشادية.',
              })}
            </p>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card-school p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg font-black">
                  {t('grTNewEntry', { defaultValue: 'إدخال جديد' })}
                </h2>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('grTCancel', { defaultValue: 'إلغاء' })}
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[11px] font-extrabold text-muted" htmlFor="grt-student">
                    {t('grTStudent', { defaultValue: 'التلميذ' })}
                  </label>
                  <input
                    id="grt-student"
                    list="grt-students-list"
                    className="input-school"
                    value={draft.studentId}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, studentId: event.target.value }))
                    }
                    placeholder={t('grTStudent', { defaultValue: 'التلميذ' })}
                  />
                  <datalist id="grt-students-list">
                    {studentOptions.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-extrabold text-muted" htmlFor="grt-cycle">
                    {t('grTCycle', { defaultValue: 'الدورة' })}
                  </label>
                  <select
                    id="grt-cycle"
                    className="input-school"
                    value={draft.cycle}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, cycle: event.target.value as Cycle }))
                    }
                  >
                    <option value="cycle1">{t('grTCycle1', { defaultValue: 'الدورة الأولى' })}</option>
                    <option value="cycle2">{t('grTCycle2', { defaultValue: 'الدورة الثانية' })}</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-extrabold text-muted" htmlFor="grt-subject">
                    {t('grTSubject', { defaultValue: 'المادة' })}
                  </label>
                  <select
                    id="grt-subject"
                    className="input-school"
                    value={draft.subjectId}
                    onChange={(event) => handleSubjectChange(event.target.value)}
                  >
                    <option value="">{t('grTSubject', { defaultValue: 'المادة' })}</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name || subject.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 border-t-2 border-line pt-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black">
                    {t('grTTests', { defaultValue: 'الاختبارات' })}
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        tests: [...current.tests, { label: '', score: '', coefficient: '1' }],
                      }))
                    }
                    className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('grTAddTest', { defaultValue: 'إضافة اختبار' })}
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {draft.tests.map((test, index) => (
                    <div
                      key={index}
                      className="rounded-card border-2 border-line bg-surface-muted p-2"
                    >
                      <div className="grid gap-2 sm:grid-cols-3">
                        <input
                          aria-label={`${t('grTTestLabel', { defaultValue: 'عنوان الاختبار' })} ${index + 1}`}
                          className="input-school"
                          value={test.label}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              tests: current.tests.map((item, i) =>
                                i === index ? { ...item, label: event.target.value } : item,
                              ),
                            }))
                          }
                          placeholder={t('grTTestLabel', { defaultValue: 'عنوان الاختبار' })}
                        />
                        <input
                          aria-label={`${t('grTTestScore', { defaultValue: 'الدرجة' })} ${index + 1}`}
                          type="number"
                          min={0}
                          max={effectiveScale}
                          className="input-school"
                          value={test.score}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              tests: current.tests.map((item, i) =>
                                i === index ? { ...item, score: event.target.value } : item,
                              ),
                            }))
                          }
                          placeholder={t('grTTestScore', { defaultValue: 'الدرجة' })}
                        />
                        <div className="flex items-center gap-1">
                          <input
                            aria-label={`${t('grTTestCoef', { defaultValue: 'المعامل' })} ${index + 1}`}
                            type="number"
                            min={0}
                            step="0.5"
                            className="input-school"
                            value={test.coefficient}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                tests: current.tests.map((item, i) =>
                                  i === index ? { ...item, coefficient: event.target.value } : item,
                                ),
                              }))
                            }
                            placeholder={t('grTTestCoef', { defaultValue: 'المعامل' })}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                tests: current.tests.filter((_, i) => i !== index),
                              }))
                            }
                            aria-label={t('grTRemoveTest', { defaultValue: 'إزالة اختبار' })}
                            title={t('grTRemoveTest', { defaultValue: 'إزالة اختبار' })}
                            className="shrink-0 rounded-lg p-1.5 text-[#E03131] transition hover:bg-[#E03131]/10"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-extrabold text-muted" htmlFor="grt-participation">
                    {t('grTParticipation', { defaultValue: 'المشاركة' })}
                  </label>
                  <input
                    id="grt-participation"
                    type="number"
                    min={0}
                    max={effectiveScale}
                    className="input-school"
                    value={draft.participationScore}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, participationScore: event.target.value }))
                    }
                    placeholder={t('grTParticipation', { defaultValue: 'المشاركة' })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-extrabold text-muted" htmlFor="grt-coefficient">
                    {t('grTSubjectCoefficient', { defaultValue: 'معامل المادة' })}
                  </label>
                  <input
                    id="grt-coefficient"
                    type="number"
                    min={0}
                    step="0.5"
                    className="input-school"
                    value={draft.subjectCoefficient}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, subjectCoefficient: event.target.value }))
                    }
                  />
                </div>
              </div>

              {formError ? (
                <div className="mt-3">
                  <Notice error>{formError}</Notice>
                </div>
              ) : null}
              {saveError ? (
                <div className="mt-3">
                  <Notice error>{saveError}</Notice>
                </div>
              ) : null}
              {saved ? (
                <p className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {t('grTSaved', { defaultValue: 'تم الحفظ بنجاح.' })}
                  {lastAverage !== null ? ` · ${t('grTAverage', { defaultValue: 'المتوسط' })}: ${number(lastAverage)}` : ''}
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="btn-chunky btn-chunky--primary btn-chunky--sm mt-4 w-full"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ClipboardList className="h-4 w-4" aria-hidden="true" />
                )}
                {t('grTSave', { defaultValue: 'حفظ' })}
              </button>
            </section>

            <section className="card-school p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <ClipboardList className="h-5 w-5 text-brand-600" aria-hidden="true" />
                {t('grTEntries', { defaultValue: 'الدرجات المسجلة' })}
                <span className="text-xs font-bold text-muted">({entries.length})</span>
              </h2>

              {submitError ? (
                <div className="mt-3">
                  <Notice error>{submitError}</Notice>
                </div>
              ) : null}

              {entries.length === 0 ? (
                <div className="mt-4">
                  <Notice>{t('grTNoEntries', { defaultValue: 'لا توجد درجات مسجلة بعد.' })}</Notice>
                </div>
              ) : (
                <ul className="mt-4 space-y-2">
                  {entries.map((entry) => {
                    const average = computeSubjectAverage(
                      Array.isArray(entry.tests) ? entry.tests : [],
                      num(entry.participationScore) ?? 0,
                      activePolicy,
                    )
                    return (
                      <li
                        key={entry.id}
                        className="rounded-card border-2 border-line bg-surface p-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="truncate text-xs font-black text-content">
                            {studentName(entry.studentId)} ·{' '}
                            {entry.subjectName ||
                              subjects.find((subject) => subject.id === entry.subjectId)?.name ||
                              entry.subjectId}
                          </span>
                          <span className={statusBadge(entry.status)}>{statusLabel(entry.status)}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted">
                          <span className="rounded-full bg-surface-muted px-2 py-0.5">
                            {cycleLabel(entry.cycle)}
                          </span>
                          <span>
                            {t('grTAverage', { defaultValue: 'المتوسط' })}:{' '}
                            <b className="text-content">{number(average)}</b>
                          </span>
                          <span>
                            {t('grTMention', { defaultValue: 'التقدير' })}:{' '}
                            <b className="text-content">
                              {mentionFor(average, activePolicy.mentionBands ?? [], locale)}
                            </b>
                          </span>
                          {entry.enteredAt ? (
                            <span>{formatDate(entry.enteredAt)}</span>
                          ) : null}
                        </div>
                        {entry.status === 'draft' ? (
                          <button
                            type="button"
                            onClick={() => void handleSubmitEntry(entry)}
                            disabled={submittingId === entry.id}
                            className="btn-chunky btn-chunky--secondary btn-chunky--sm mt-3"
                          >
                            {submittingId === entry.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <Send className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                            {t('grTSubmit', { defaultValue: 'إرسال للاعتماد' })}
                          </button>
                        ) : null}
                        {submittedId === entry.id ? (
                          <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-brand-700 dark:text-brand-300">
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            {t('grTSubmitted', { defaultValue: 'تم إرسال الإدخال للاعتماد.' })}
                          </p>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          </div>

          <section className="card-school p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-black">
              <Calculator className="h-5 w-5 text-brand-600" aria-hidden="true" />
              {t('grTCompute', { defaultValue: 'حساب النتيجة' })}
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[11px] font-extrabold text-muted" htmlFor="grt-compute-student">
                  {t('grTStudent', { defaultValue: 'التلميذ' })}
                </label>
                <input
                  id="grt-compute-student"
                  list="grt-students-list"
                  className="input-school"
                  value={computeStudentId}
                  onChange={(event) => setComputeStudentId(event.target.value)}
                  placeholder={t('grTStudent', { defaultValue: 'التلميذ' })}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-extrabold text-muted" htmlFor="grt-compute-cycle">
                  {t('grTCycle', { defaultValue: 'الدورة' })}
                </label>
                <select
                  id="grt-compute-cycle"
                  className="input-school"
                  value={computeCycle}
                  onChange={(event) => setComputeCycle(event.target.value as Cycle)}
                >
                  <option value="cycle1">{t('grTCycle1', { defaultValue: 'الدورة الأولى' })}</option>
                  <option value="cycle2">{t('grTCycle2', { defaultValue: 'الدورة الثانية' })}</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => void handleCompute()}
                  disabled={computing}
                  className="btn-chunky btn-chunky--primary btn-chunky--sm w-full"
                >
                  {computing ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Calculator className="h-4 w-4" aria-hidden="true" />
                  )}
                  {t('grTCompute', { defaultValue: 'حساب النتيجة' })}
                </button>
              </div>
            </div>

            {computeError ? (
              <div className="mt-3">
                <Notice error>{computeError}</Notice>
              </div>
            ) : null}

            {result ? (
              <div className="mt-4 space-y-3">
                <h3 className="text-sm font-black">
                  {t('grTResult', { defaultValue: 'النتيجة المحسوبة' })}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                    <p className="text-[11px] font-extrabold text-muted">
                      {t('grTCycle1', { defaultValue: 'الدورة الأولى' })}
                    </p>
                    <p className="mt-1 font-display text-lg font-black text-content">
                      {number(resultCycle1)}
                    </p>
                  </div>
                  <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                    <p className="text-[11px] font-extrabold text-muted">
                      {t('grTCycle2', { defaultValue: 'الدورة الثانية' })}
                    </p>
                    <p className="mt-1 font-display text-lg font-black text-content">
                      {number(resultCycle2)}
                    </p>
                  </div>
                  <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                    <p className="text-[11px] font-extrabold text-muted">
                      {t('grTAnnual', { defaultValue: 'المعدل السنوي' })}
                    </p>
                    <p className="mt-1 font-display text-lg font-black text-content">
                      {number(resultAnnual)}
                    </p>
                  </div>
                  <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                    <p className="text-[11px] font-extrabold text-muted">
                      {t('grTMention', { defaultValue: 'التقدير' })}
                    </p>
                    <p className="mt-1 font-display text-lg font-black text-content">{resultMention}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {resultDecision ? (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        resultDecision === 'success'
                          ? 'bg-brand-soft text-brand-700'
                          : 'bg-[#E03131]/10 text-[#E03131]'
                      }`}
                    >
                      {resultDecision === 'success'
                        ? t('grTSuccess', { defaultValue: 'ناجح' })
                        : t('grTFail', { defaultValue: 'راسب' })}
                    </span>
                  ) : null}
                </div>

                {failingSubjects.length ? (
                  <div className="rounded-card border-2 border-line bg-surface p-3">
                    <p className="text-xs font-black">
                      {t('grTFailingSubjects', { defaultValue: 'المواد غير الناجحة' })}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {failingSubjects.map((name, index) => (
                        <span
                          key={`${name}-${index}`}
                          className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {resultBreakdown.length ? (
                  <div className="overflow-x-auto rounded-card border-2 border-line bg-surface">
                    <table className="w-full">
                      <thead className="bg-surface-muted">
                        <tr>
                          <th scope="col" className={TH}>{t('grTSubject', { defaultValue: 'المادة' })}</th>
                          <th scope="col" className={TH}>{t('grTAverage', { defaultValue: 'المتوسط' })}</th>
                          <th scope="col" className={TH}>{t('grTCoefficients', { defaultValue: 'المعاملات' })}</th>
                          <th scope="col" className={TH}>{t('grTMention', { defaultValue: 'التقدير' })}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultBreakdown.map((item) => (
                          <tr key={item.key} className="border-t-2 border-line">
                            <td className={TD}>{item.name}</td>
                            <td className={TD}>{number(item.average)}</td>
                            <td className={TD}>{number(item.coefficient)}</td>
                            <td className={TD}>{item.mention}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}

                <AdvisoryBanner>{advisory}</AdvisoryBanner>
              </div>
            ) : null}
          </section>
        </div>
      )}
    </div>
  )
}
