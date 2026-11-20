import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  Archive,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileQuestion,
  Loader2,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

type Difficulty = 'easy' | 'medium' | 'hard'
type QuestionStatus = 'active' | 'archived'
type FormativeStatus = 'draft' | 'published'

interface Meta {
  id: string
  name: string
}

interface Question {
  id: string
  levelId: string
  level: string
  subjectId: string
  subject: string
  term: string
  difficulty: Difficulty
  prompt: string
  options: string[]
  correctIndex: number
  skill: string
  explanation: string
  status: QuestionStatus
  createdAt: string
  createdBy: string
}

interface NewQuestion {
  levelId: string
  subjectId: string
  term: string
  difficulty: Difficulty
  prompt: string
  options: string[]
  correctIndex: number
  skill: string
  explanation: string
}

interface Formative {
  id: string
  title: string
  levelId: string
  level: string
  subjectId: string
  subject: string
  term: string
  questionIds: string[]
  status: FormativeStatus
  createdAt: string
  attemptsCount: number
}

interface NewFormative {
  title: string
  levelId: string
  subjectId: string
  term: string
  questionIds: string[]
  status: FormativeStatus
}

interface AnalysisItem {
  questionId: string
  prompt: string
  attempts: number
  correct: number
  difficultyPct: number
  discriminationPct: number
}

interface BankResponse {
  questions: Question[]
  subjects: Meta[]
  levels: Meta[]
  terms: string[]
}

interface AssessmentsResponse {
  assessments: Formative[]
  questions: Question[]
}

interface AnalysisResponse {
  assessment: Formative
  attempts: number
  items: AnalysisItem[]
}

interface QuestionDraft {
  levelId: string
  subjectId: string
  term: string
  difficulty: Difficulty
  prompt: string
  options: string[]
  correctIndex: number | null
  skill: string
  explanation: string
}

interface AssessmentDraft {
  title: string
  levelId: string
  subjectId: string
  term: string
  questionIds: string[]
  status: FormativeStatus
}

interface ToastState {
  message: string
  tone: 'success' | 'error'
}

interface AnalysisState {
  id: string | null
  loading: boolean
  error: string
  data: AnalysisResponse | null
}

const LABEL = 'mb-1 block text-[11px] font-extrabold text-muted'
const CHIP = 'inline-flex items-center rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-black text-muted'
const BADGE_BASE = 'shrink-0 rounded-full px-2 py-1 text-[10px] font-black'
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

function emptyQuestionDraft(): QuestionDraft {
  return {
    levelId: '',
    subjectId: '',
    term: '',
    difficulty: 'medium',
    prompt: '',
    options: ['', ''],
    correctIndex: null,
    skill: '',
    explanation: '',
  }
}

function emptyAssessmentDraft(): AssessmentDraft {
  return { title: '', levelId: '', subjectId: '', term: '', questionIds: [], status: 'draft' }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

function asNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((entry) => asString(entry)).filter((entry) => entry.length > 0)
}

function normalizeDifficulty(value: unknown): Difficulty {
  const normalized = asString(value).trim().toLowerCase()
  return normalized === 'easy' || normalized === 'medium' || normalized === 'hard'
    ? normalized
    : 'medium'
}

function normalizeQuestionStatus(value: unknown): QuestionStatus {
  return asString(value).trim().toLowerCase() === 'archived' ? 'archived' : 'active'
}

function normalizeFormativeStatus(value: unknown): FormativeStatus {
  return asString(value).trim().toLowerCase() === 'published' ? 'published' : 'draft'
}

function normalizeMeta(value: unknown): Meta[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  const result: Meta[] = []
  for (const entry of value) {
    const raw = isRecord(entry) ? entry : {}
    const id = asString(raw.id).trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    result.push({ id, name: asString(raw.name) || id })
  }
  return result
}

function normalizeTerms(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((entry) => asString(entry).trim()).filter((entry) => entry.length > 0)
}

function normalizeQuestion(value: unknown): Question {
  const raw = isRecord(value) ? value : {}
  const options = asStringArray(raw.options)
  const rawIndex = Math.trunc(asNumber(raw.correctIndex))
  const correctIndex = options.length
    ? Math.min(Math.max(rawIndex, 0), options.length - 1)
    : 0
  return {
    id: asString(raw.id),
    levelId: asString(raw.levelId),
    level: asString(raw.level),
    subjectId: asString(raw.subjectId),
    subject: asString(raw.subject),
    term: asString(raw.term),
    difficulty: normalizeDifficulty(raw.difficulty),
    prompt: asString(raw.prompt),
    options,
    correctIndex,
    skill: asString(raw.skill),
    explanation: asString(raw.explanation),
    status: normalizeQuestionStatus(raw.status),
    createdAt: asString(raw.createdAt),
    createdBy: asString(raw.createdBy),
  }
}

function normalizeFormative(value: unknown): Formative {
  const raw = isRecord(value) ? value : {}
  return {
    id: asString(raw.id),
    title: asString(raw.title),
    levelId: asString(raw.levelId),
    level: asString(raw.level),
    subjectId: asString(raw.subjectId),
    subject: asString(raw.subject),
    term: asString(raw.term),
    questionIds: asStringArray(raw.questionIds),
    status: normalizeFormativeStatus(raw.status),
    createdAt: asString(raw.createdAt),
    attemptsCount: Math.max(0, Math.trunc(asNumber(raw.attemptsCount))),
  }
}

function normalizeAnalysisItem(value: unknown): AnalysisItem {
  const raw = isRecord(value) ? value : {}
  return {
    questionId: asString(raw.questionId),
    prompt: asString(raw.prompt),
    attempts: Math.max(0, Math.trunc(asNumber(raw.attempts))),
    correct: Math.max(0, Math.trunc(asNumber(raw.correct))),
    difficultyPct: asNumber(raw.difficultyPct),
    discriminationPct: asNumber(raw.discriminationPct),
  }
}

function normalizeAnalysis(value: unknown): AnalysisResponse {
  const raw = isRecord(value) ? value : {}
  return {
    assessment: normalizeFormative(raw.assessment),
    attempts: Math.max(0, Math.trunc(asNumber(raw.attempts))),
    items: Array.isArray(raw.items) ? raw.items.map((item) => normalizeAnalysisItem(item)) : [],
  }
}

function mergeMeta(primary: Meta[], fallback: Meta[]): Meta[] {
  const result: Meta[] = []
  const seen = new Set<string>()
  for (const entry of [...primary, ...fallback]) {
    const id = asString(entry?.id).trim()
    if (!id || seen.has(id)) continue
    seen.add(id)
    result.push({ id, name: asString(entry?.name) || id })
  }
  return result
}

function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u0655\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .trim()
}

function difficultyBadgeClass(value: Difficulty): string {
  switch (value) {
    case 'easy':
      return 'bg-brand-soft text-brand-700 dark:bg-brand-400/10 dark:text-brand-300'
    case 'hard':
      return 'bg-[#E03131]/10 text-[#b42318] dark:bg-[#E03131]/15 dark:text-[#ff8787]'
    default:
      return 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
  }
}

function questionStatusBadgeClass(status: QuestionStatus): string {
  return status === 'active'
    ? 'bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
    : 'bg-surface-muted text-muted'
}

function formativeStatusBadgeClass(status: FormativeStatus): string {
  return status === 'published'
    ? 'bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
    : 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
}

function failureMessage(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-5 text-center text-xs font-bold text-muted">
      {children}
    </p>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <article className="card-school p-4 shadow-card">
      <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-black leading-none text-brand-700 dark:text-brand-300">
        {value}
      </p>
    </article>
  )
}

export default function AssessmentBank() {
  const { t } = useTranslation()

  const [questions, setQuestions] = useState<Question[]>([])
  const [bankMeta, setBankMeta] = useState<{ subjects: Meta[]; levels: Meta[]; terms: string[] }>({
    subjects: [],
    levels: [],
    terms: [],
  })
  const [bankLoading, setBankLoading] = useState(true)
  const [bankError, setBankError] = useState('')
  const [bankReloadKey, setBankReloadKey] = useState(0)

  const [assessments, setAssessments] = useState<Formative[]>([])
  const [assessmentQuestions, setAssessmentQuestions] = useState<Question[]>([])
  const [assessmentsLoading, setAssessmentsLoading] = useState(true)
  const [assessmentsError, setAssessmentsError] = useState('')
  const [assessmentsReloadKey, setAssessmentsReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [termFilter, setTermFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | ''>('')
  const [includeArchived, setIncludeArchived] = useState(false)

  const [questionDraft, setQuestionDraft] = useState<QuestionDraft>(emptyQuestionDraft)
  const [savingQuestion, setSavingQuestion] = useState(false)
  const [savingQuestionId, setSavingQuestionId] = useState<string | null>(null)

  const [assessmentDraft, setAssessmentDraft] = useState<AssessmentDraft>(emptyAssessmentDraft)
  const [savingAssessment, setSavingAssessment] = useState(false)
  const [savingAssessmentId, setSavingAssessmentId] = useState<string | null>(null)

  const [toast, setToast] = useState<ToastState | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisState>({
    id: null,
    loading: false,
    error: '',
    data: null,
  })
  const analysisController = useRef<AbortController | null>(null)

  const dash = t('qbDash', { defaultValue: '—' })

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setBankLoading(true)
    setBankError('')

    apiGet<BankResponse>('/teacher/question-bank', {
      params: { subjectId: '', levelId: '', term: '', difficulty: '', search: '' },
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        const raw: unknown = data
        const record = isRecord(raw) ? raw : {}
        setQuestions(
          Array.isArray(record.questions)
            ? record.questions.map((question) => normalizeQuestion(question))
            : [],
        )
        setBankMeta({
          subjects: normalizeMeta(record.subjects),
          levels: normalizeMeta(record.levels),
          terms: normalizeTerms(record.terms),
        })
      })
      .catch((error: unknown) => {
        if (cancelled || controller.signal.aborted) return
        setBankError(
          failureMessage(
            error,
            t('qbBankError', { defaultValue: 'تعذّر تحميل الأسئلة. حاول مجددًا.' }),
          ),
        )
      })
      .finally(() => {
        if (!cancelled) setBankLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [bankReloadKey, t])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setAssessmentsLoading(true)
    setAssessmentsError('')

    apiGet<AssessmentsResponse>('/teacher/formative-assessments', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        const raw: unknown = data
        const record = isRecord(raw) ? raw : {}
        setAssessments(
          Array.isArray(record.assessments)
            ? record.assessments.map((assessment) => normalizeFormative(assessment))
            : [],
        )
        setAssessmentQuestions(
          Array.isArray(record.questions)
            ? record.questions.map((question) => normalizeQuestion(question))
            : [],
        )
      })
      .catch((error: unknown) => {
        if (cancelled || controller.signal.aborted) return
        setAssessmentsError(
          failureMessage(
            error,
            t('qbAssessmentsError', { defaultValue: 'تعذّر تحميل التقويمات. حاول مجددًا.' }),
          ),
        )
      })
      .finally(() => {
        if (!cancelled) setAssessmentsLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [assessmentsReloadKey, t])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    return () => {
      analysisController.current?.abort()
    }
  }, [])

  const subjectOptions = useMemo(
    () =>
      mergeMeta(
        bankMeta.subjects,
        questions.map((question) => ({ id: question.subjectId, name: question.subject })),
      ),
    [bankMeta.subjects, questions],
  )

  const levelOptions = useMemo(
    () =>
      mergeMeta(
        bankMeta.levels,
        questions.map((question) => ({ id: question.levelId, name: question.level })),
      ),
    [bankMeta.levels, questions],
  )

  const termOptions = useMemo(() => {
    const terms = [...bankMeta.terms]
    for (const question of questions) {
      if (question.term && !terms.includes(question.term)) terms.push(question.term)
    }
    return terms
  }, [bankMeta.terms, questions])

  const stats = useMemo(
    () => ({
      total: questions.length,
      active: questions.filter((question) => question.status === 'active').length,
      assessments: assessments.length,
      published: assessments.filter((assessment) => assessment.status === 'published').length,
    }),
    [questions, assessments],
  )

  const filteredQuestions = useMemo(() => {
    const query = normalizeSearch(search)
    return questions.filter((question) => {
      if (!includeArchived && question.status === 'archived') return false
      if (subjectFilter && question.subjectId !== subjectFilter) return false
      if (levelFilter && question.levelId !== levelFilter) return false
      if (termFilter && question.term !== termFilter) return false
      if (difficultyFilter && question.difficulty !== difficultyFilter) return false
      if (!query) return true
      return (
        normalizeSearch(question.prompt).includes(query) ||
        normalizeSearch(question.skill).includes(query) ||
        normalizeSearch(question.subject).includes(query) ||
        normalizeSearch(question.level).includes(query) ||
        question.options.some((option) => normalizeSearch(option).includes(query))
      )
    })
  }, [questions, includeArchived, subjectFilter, levelFilter, termFilter, difficultyFilter, search])

  const selectableQuestions = useMemo(() => {
    const pool = questions.length ? questions : assessmentQuestions
    const byId = new Map<string, Question>()
    for (const question of pool) {
      if (question.id && question.status === 'active') byId.set(question.id, question)
    }
    return [...byId.values()]
  }, [questions, assessmentQuestions])

  const difficultyLabel = (value: Difficulty): string => {
    switch (value) {
      case 'easy':
        return t('qbDifficultyEasy', { defaultValue: 'سهل' })
      case 'medium':
        return t('qbDifficultyMedium', { defaultValue: 'متوسط' })
      default:
        return t('qbDifficultyHard', { defaultValue: 'صعب' })
    }
  }

  const reloadAll = () => {
    setBankReloadKey((key) => key + 1)
    setAssessmentsReloadKey((key) => key + 1)
  }

  const setQuestionField = <K extends keyof QuestionDraft>(field: K, value: QuestionDraft[K]) => {
    setQuestionDraft((current) => ({ ...current, [field]: value }))
  }

  const setAssessmentField = <K extends keyof AssessmentDraft>(field: K, value: AssessmentDraft[K]) => {
    setAssessmentDraft((current) => ({ ...current, [field]: value }))
  }

  const toggleSelectedQuestion = (id: string) => {
    setAssessmentDraft((current) => ({
      ...current,
      questionIds: current.questionIds.includes(id)
        ? current.questionIds.filter((questionId) => questionId !== id)
        : [...current.questionIds, id],
    }))
  }

  const toggleQuestionStatus = async (question: Question): Promise<void> => {
    if (savingQuestionId || !question.id) return
    const nextStatus: QuestionStatus = question.status === 'archived' ? 'active' : 'archived'
    setSavingQuestionId(question.id)
    setToast(null)
    try {
      const response = await apiPost<
        { question: Question },
        { id: string; status: QuestionStatus }
      >('/teacher/question-bank/update', { id: question.id, status: nextStatus })
      const updated = normalizeQuestion(response?.question)
      if (updated.id) {
        setQuestions((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        setBankReloadKey((key) => key + 1)
      }
      setToast({
        tone: 'success',
        message: t('qbQuestionStatusUpdated', { defaultValue: 'تم تحديث حالة السؤال.' }),
      })
    } catch (error: unknown) {
      setToast({
        tone: 'error',
        message: failureMessage(
          error,
          t('qbActionFailed', { defaultValue: 'تعذّر إكمال العملية. حاول مجددًا.' }),
        ),
      })
    } finally {
      setSavingQuestionId(null)
    }
  }

  const submitQuestion = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (savingQuestion) return
    setToast(null)

    const prompt = questionDraft.prompt.trim()
    if (!prompt) {
      setToast({
        tone: 'error',
        message: t('qbValidationPrompt', { defaultValue: 'يرجى كتابة نص السؤال.' }),
      })
      return
    }

    const indexedOptions = questionDraft.options
      .map((option, index) => ({ value: option.trim(), index }))
      .filter((entry) => entry.value.length > 0)
    if (indexedOptions.length < 2) {
      setToast({
        tone: 'error',
        message: t('qbValidationOptions', { defaultValue: 'يرجى إدخال خيارين غير فارغين على الأقل.' }),
      })
      return
    }

    const correctEntry = indexedOptions.find((entry) => entry.index === questionDraft.correctIndex)
    if (!correctEntry) {
      setToast({
        tone: 'error',
        message: t('qbValidationCorrect', { defaultValue: 'يرجى تحديد الخيار الصحيح.' }),
      })
      return
    }

    if (!questionDraft.levelId || !questionDraft.subjectId || !questionDraft.term) {
      setToast({
        tone: 'error',
        message: t('qbValidationMeta', { defaultValue: 'يرجى اختيار المستوى والمادة والفصل.' }),
      })
      return
    }

    const body: NewQuestion = {
      levelId: questionDraft.levelId,
      subjectId: questionDraft.subjectId,
      term: questionDraft.term,
      difficulty: questionDraft.difficulty,
      prompt,
      options: indexedOptions.map((entry) => entry.value),
      correctIndex: indexedOptions.indexOf(correctEntry),
      skill: questionDraft.skill.trim(),
      explanation: questionDraft.explanation.trim(),
    }

    setSavingQuestion(true)
    try {
      const response = await apiPost<{ question: Question }, NewQuestion>('/teacher/question-bank', body)
      const created = normalizeQuestion(response?.question)
      if (created.id) {
        setQuestions((current) => [created, ...current.filter((item) => item.id !== created.id)])
      }
      setQuestionDraft(emptyQuestionDraft())
      setToast({
        tone: 'success',
        message: t('qbQuestionCreated', { defaultValue: 'تم إنشاء السؤال وإضافته إلى البنك.' }),
      })
      setBankReloadKey((key) => key + 1)
    } catch (error: unknown) {
      setToast({
        tone: 'error',
        message: failureMessage(
          error,
          t('qbActionFailed', { defaultValue: 'تعذّر إكمال العملية. حاول مجددًا.' }),
        ),
      })
    } finally {
      setSavingQuestion(false)
    }
  }

  const toggleAssessmentStatus = async (assessment: Formative): Promise<void> => {
    if (savingAssessmentId || !assessment.id) return
    const nextStatus: FormativeStatus = assessment.status === 'published' ? 'draft' : 'published'
    setSavingAssessmentId(assessment.id)
    setToast(null)
    try {
      const response = await apiPost<
        { assessment: Formative },
        { id: string; status: FormativeStatus }
      >('/teacher/formative-assessments/update', { id: assessment.id, status: nextStatus })
      const updated = normalizeFormative(response?.assessment)
      if (updated.id) {
        setAssessments((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        )
      } else {
        setAssessmentsReloadKey((key) => key + 1)
      }
      setToast({
        tone: 'success',
        message: t('qbAssessmentStatusUpdated', { defaultValue: 'تم تحديث حالة التقويم.' }),
      })
    } catch (error: unknown) {
      setToast({
        tone: 'error',
        message: failureMessage(
          error,
          t('qbActionFailed', { defaultValue: 'تعذّر إكمال العملية. حاول مجددًا.' }),
        ),
      })
    } finally {
      setSavingAssessmentId(null)
    }
  }

  const submitAssessment = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (savingAssessment) return
    setToast(null)

    const title = assessmentDraft.title.trim()
    if (!title) {
      setToast({
        tone: 'error',
        message: t('qbValidationTitle', { defaultValue: 'يرجى كتابة عنوان التقويم.' }),
      })
      return
    }
    if (!assessmentDraft.levelId || !assessmentDraft.subjectId || !assessmentDraft.term) {
      setToast({
        tone: 'error',
        message: t('qbValidationMeta', { defaultValue: 'يرجى اختيار المستوى والمادة والفصل.' }),
      })
      return
    }
    if (!assessmentDraft.questionIds.length) {
      setToast({
        tone: 'error',
        message: t('qbValidationQuestions', { defaultValue: 'يرجى اختيار سؤال واحد على الأقل.' }),
      })
      return
    }

    const body: NewFormative = {
      title,
      levelId: assessmentDraft.levelId,
      subjectId: assessmentDraft.subjectId,
      term: assessmentDraft.term,
      questionIds: [...assessmentDraft.questionIds],
      status: assessmentDraft.status,
    }

    setSavingAssessment(true)
    try {
      const response = await apiPost<{ assessment: Formative }, NewFormative>(
        '/teacher/formative-assessments',
        body,
      )
      const created = normalizeFormative(response?.assessment)
      if (created.id) {
        setAssessments((current) => [created, ...current.filter((item) => item.id !== created.id)])
      }
      setAssessmentDraft(emptyAssessmentDraft())
      setToast({
        tone: 'success',
        message: t('qbAssessmentCreated', { defaultValue: 'تم إنشاء التقويم.' }),
      })
      setAssessmentsReloadKey((key) => key + 1)
    } catch (error: unknown) {
      setToast({
        tone: 'error',
        message: failureMessage(
          error,
          t('qbActionFailed', { defaultValue: 'تعذّر إكمال العملية. حاول مجددًا.' }),
        ),
      })
    } finally {
      setSavingAssessment(false)
    }
  }

  const openAnalysis = async (assessment: Formative): Promise<void> => {
    if (!assessment.id) return
    if (analysis.id === assessment.id && analysis.data && !analysis.loading) {
      setAnalysis({ id: null, loading: false, error: '', data: null })
      return
    }

    analysisController.current?.abort()
    const controller = new AbortController()
    analysisController.current = controller
    setAnalysis({ id: assessment.id, loading: true, error: '', data: null })

    try {
      const data = await apiGet<AnalysisResponse>(
        `/teacher/formative-assessments/${encodeURIComponent(assessment.id)}/analysis`,
        { signal: controller.signal },
      )
      if (controller.signal.aborted) return
      setAnalysis({ id: assessment.id, loading: false, error: '', data: normalizeAnalysis(data) })
    } catch (error: unknown) {
      if (controller.signal.aborted) return
      setAnalysis({
        id: assessment.id,
        loading: false,
        error: failureMessage(
          error,
          t('qbAnalysisError', { defaultValue: 'تعذّر تحميل التحليل. حاول مجددًا.' }),
        ),
        data: null,
      })
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-xl font-black sm:text-2xl">
                {t('qbTitle', { defaultValue: 'بنك الأسئلة والتقويمات التكوينية' })}
              </h1>
              <p className="mt-1 text-xs font-semibold leading-relaxed text-muted">
                {t('qbSubtitle', {
                  defaultValue:
                    'أنشئ بنك أسئلة منظّمًا، وصمّم تقويمات قصيرة أثناء التعلّم، وراجع تحليل نتائجها.',
                })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={reloadAll}
            disabled={bankLoading || assessmentsLoading}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm ms-auto shrink-0"
          >
            {bankLoading || assessmentsLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {t('qbRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-xs font-bold leading-relaxed text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t('qbAdvisory', {
              defaultValue:
                'التقويم التكويني يدعم التعلّم؛ نتائجه استرشادية ولا تُغني عن حكم المعلّم أو التقرير الدراسي الرسمي.',
            })}
          </span>
        </div>
      </section>

      {toast ? (
        <p
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className={`rounded-card border-2 p-3 text-xs font-bold ${
            toast.tone === 'error'
              ? 'border-[#E03131]/40 bg-[#E03131]/10 text-[#b42318] dark:text-[#ff8787]'
              : 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-200'
          }`}
        >
          {toast.message}
        </p>
      ) : null}

      <section
        aria-label={t('qbStatsLabel', { defaultValue: 'مؤشرات بنك الأسئلة' })}
        className="space-y-3"
      >
        {bankLoading || assessmentsLoading ? (
          <div className="card-school flex items-center justify-center gap-2 p-8 text-sm font-bold text-muted">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            {t('qbLoading', { defaultValue: 'جارٍ تحميل البيانات…' })}
          </div>
        ) : bankError || assessmentsError ? (
          <div
            role="alert"
            className="card-school flex flex-wrap items-center justify-between gap-3 border-[#E03131]/40 p-5"
          >
            <p className="flex items-start gap-2 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {bankError || assessmentsError}
            </p>
            <button type="button" onClick={reloadAll} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              {t('qbRetry', { defaultValue: 'إعادة المحاولة' })}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={FileQuestion}
              label={t('qbTotalQuestions', { defaultValue: 'إجمالي الأسئلة' })}
              value={String(stats.total)}
            />
            <StatCard
              icon={CheckCircle2}
              label={t('qbActiveQuestions', { defaultValue: 'الأسئلة النشطة' })}
              value={String(stats.active)}
            />
            <StatCard
              icon={ClipboardList}
              label={t('qbAssessments', { defaultValue: 'التقويمات' })}
              value={String(stats.assessments)}
            />
            <StatCard
              icon={BarChart3}
              label={t('qbPublishedAssessments', { defaultValue: 'التقويمات المنشورة' })}
              value={String(stats.published)}
            />
          </div>
        )}
      </section>

      <section className="space-y-4" aria-label={t('qbBankTitle', { defaultValue: 'بنك الأسئلة' })}>
        <header className="card-school flex flex-wrap items-center justify-between gap-2 p-4">
          <div>
            <h2 className="font-display text-base font-black">
              {t('qbBankTitle', { defaultValue: 'بنك الأسئلة' })}
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-muted">
              {t('qbBankHint', {
                defaultValue: 'أضف الأسئلة وراجعها قبل اختيارها في التقويمات التكوينية.',
              })}
            </p>
          </div>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-black text-brand-700 dark:bg-brand-400/10 dark:text-brand-300">
            {filteredQuestions.length} {t('qbQuestions', { defaultValue: 'سؤال' })}
          </span>
        </header>

        <div className="card-school p-4" aria-label={t('qbFilters', { defaultValue: 'عوامل التصفية' })}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className={LABEL} htmlFor="qb-search">
                {t('qbSearch', { defaultValue: 'بحث في نصوص الأسئلة والمهارات' })}
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="qb-search"
                  type="search"
                  className="input-school ps-10 text-sm"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={LABEL} htmlFor="qb-filter-subject">
                {t('qbSubject', { defaultValue: 'المادة' })}
              </label>
              <select
                id="qb-filter-subject"
                className="input-school text-sm"
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
              >
                <option value="">{t('qbAllSubjects', { defaultValue: 'كل المواد' })}</option>
                {subjectOptions.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL} htmlFor="qb-filter-level">
                {t('qbLevel', { defaultValue: 'المستوى' })}
              </label>
              <select
                id="qb-filter-level"
                className="input-school text-sm"
                value={levelFilter}
                onChange={(event) => setLevelFilter(event.target.value)}
              >
                <option value="">{t('qbAllLevels', { defaultValue: 'كل المستويات' })}</option>
                {levelOptions.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL} htmlFor="qb-filter-term">
                {t('qbTerm', { defaultValue: 'الفصل الدراسي' })}
              </label>
              <select
                id="qb-filter-term"
                className="input-school text-sm"
                value={termFilter}
                onChange={(event) => setTermFilter(event.target.value)}
              >
                <option value="">{t('qbAllTerms', { defaultValue: 'كل الفصول' })}</option>
                {termOptions.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={LABEL} htmlFor="qb-filter-difficulty">
                {t('qbDifficulty', { defaultValue: 'الصعوبة' })}
              </label>
              <select
                id="qb-filter-difficulty"
                className="input-school text-sm"
                value={difficultyFilter}
                onChange={(event) => setDifficultyFilter(event.target.value as Difficulty | '')}
              >
                <option value="">
                  {t('qbAllDifficulties', { defaultValue: 'كل درجات الصعوبة' })}
                </option>
                {DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficultyLabel(difficulty)}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-end gap-2 pb-2.5 text-[11px] font-extrabold text-muted">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-line accent-brand-600"
                checked={includeArchived}
                onChange={(event) => setIncludeArchived(event.target.checked)}
              />
              {t('qbIncludeArchived', { defaultValue: 'تضمين الأسئلة المؤرشفة' })}
            </label>
          </div>
        </div>

        {bankLoading ? (
          <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            {t('qbBankLoading', { defaultValue: 'جارٍ تحميل الأسئلة…' })}
          </div>
        ) : bankError ? (
          <div
            role="alert"
            className="card-school flex flex-wrap items-center justify-between gap-3 border-[#E03131]/40 p-5"
          >
            <p className="flex items-start gap-2 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {bankError}
            </p>
            <button
              type="button"
              onClick={() => setBankReloadKey((key) => key + 1)}
              className="btn-chunky btn-chunky--secondary btn-chunky--sm"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              {t('qbRetry', { defaultValue: 'إعادة المحاولة' })}
            </button>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <Notice>
            {questions.length === 0
              ? t('qbNoQuestions', { defaultValue: 'لا توجد أسئلة في البنك بعد. أضف سؤالًا جديدًا للبدء.' })
              : t('qbNoMatch', { defaultValue: 'لا توجد أسئلة تطابق عوامل التصفية.' })}
          </Notice>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredQuestions.map((question) => {
              const saving = savingQuestionId === question.id
              return (
                <article key={question.id} className="card-school flex flex-col p-4">
                  <p className="text-sm font-extrabold leading-relaxed text-content">
                    {question.prompt || dash}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className={CHIP}>{question.subject || dash}</span>
                    <span className={CHIP}>{question.level || dash}</span>
                    <span className={CHIP}>{question.term || dash}</span>
                    <span className={`${BADGE_BASE} ${difficultyBadgeClass(question.difficulty)}`}>
                      {difficultyLabel(question.difficulty)}
                    </span>
                    <span className={`${BADGE_BASE} ${questionStatusBadgeClass(question.status)}`}>
                      {question.status === 'active'
                        ? t('qbActive', { defaultValue: 'نشط' })
                        : t('qbArchived', { defaultValue: 'مؤرشف' })}
                    </span>
                  </div>

                  <div className="mt-3 rounded-card border-2 border-line bg-surface-muted p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-black text-brand-700 dark:text-brand-300">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('qbCorrectAnswer', { defaultValue: 'الإجابة الصحيحة' })}
                    </p>
                    <p className="mt-1.5 break-words text-xs font-extrabold text-content">
                      {question.options[question.correctIndex] || dash}
                    </p>
                  </div>

                  <dl className="mt-3 grid gap-2 text-[11px] font-bold">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <dt className="text-muted">
                        {t('qbOptionCount', {
                          count: question.options.length,
                          defaultValue: 'عدد الخيارات: {{count}}',
                        })}
                      </dt>
                      <dd className="text-muted">
                        {t('qbSkill', { defaultValue: 'المهارة' })}
                      </dd>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <dt className="sr-only">{t('qbSkill', { defaultValue: 'المهارة' })}</dt>
                      <dd className="break-words text-content">{question.skill || dash}</dd>
                    </div>
                  </dl>
                  {question.explanation ? (
                    <p className="mt-2 rounded-card bg-surface-muted p-2 text-[11px] font-semibold leading-relaxed text-muted">
                      <span className="block font-black text-content">
                        {t('qbExplanation', { defaultValue: 'التفسير' })}
                      </span>
                      <span>{question.explanation}</span>
                    </p>
                  ) : null}

                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => void toggleQuestionStatus(question)}
                      disabled={savingQuestionId !== null}
                      className="btn-chunky btn-chunky--secondary btn-chunky--sm w-full"
                    >
                      {saving ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      ) : question.status === 'archived' ? (
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {saving
                        ? t('qbSaving', { defaultValue: 'جارٍ الحفظ…' })
                        : question.status === 'archived'
                          ? t('qbReactivate', { defaultValue: 'إعادة تفعيل' })
                          : t('qbArchive', { defaultValue: 'أرشفة' })}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <form
          onSubmit={(event) => void submitQuestion(event)}
          className="card-school space-y-4 p-4 sm:p-5"
          aria-label={t('qbNewQuestion', { defaultValue: 'سؤال جديد' })}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-black">
                {t('qbNewQuestion', { defaultValue: 'سؤال جديد' })}
              </h3>
              <p className="mt-1 text-[11px] font-semibold text-muted">
                {t('qbNewQuestionHint', {
                  defaultValue: 'أضف سؤالًا إلى البنك ليسهل اختياره في التقويمات القصيرة.',
                })}
              </p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
              <FileQuestion className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className={LABEL} htmlFor="qb-new-level">
                {t('qbLevel', { defaultValue: 'المستوى' })}
              </label>
              <select
                id="qb-new-level"
                className="input-school text-sm"
                value={questionDraft.levelId}
                onChange={(event) => setQuestionField('levelId', event.target.value)}
                disabled={savingQuestion}
              >
                <option value="">{t('qbChooseLevel', { defaultValue: 'اختر المستوى' })}</option>
                {levelOptions.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="qb-new-subject">
                {t('qbSubject', { defaultValue: 'المادة' })}
              </label>
              <select
                id="qb-new-subject"
                className="input-school text-sm"
                value={questionDraft.subjectId}
                onChange={(event) => setQuestionField('subjectId', event.target.value)}
                disabled={savingQuestion}
              >
                <option value="">{t('qbChooseSubject', { defaultValue: 'اختر المادة' })}</option>
                {subjectOptions.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="qb-new-term">
                {t('qbTerm', { defaultValue: 'الفصل الدراسي' })}
              </label>
              <select
                id="qb-new-term"
                className="input-school text-sm"
                value={questionDraft.term}
                onChange={(event) => setQuestionField('term', event.target.value)}
                disabled={savingQuestion}
              >
                <option value="">{t('qbChooseTerm', { defaultValue: 'اختر الفصل' })}</option>
                {termOptions.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="qb-new-difficulty">
                {t('qbDifficulty', { defaultValue: 'الصعوبة' })}
              </label>
              <select
                id="qb-new-difficulty"
                className="input-school text-sm"
                value={questionDraft.difficulty}
                onChange={(event) => setQuestionField('difficulty', normalizeDifficulty(event.target.value))}
                disabled={savingQuestion}
              >
                {DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficultyLabel(difficulty)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={LABEL} htmlFor="qb-new-prompt">
              {t('qbPrompt', { defaultValue: 'نص السؤال' })}
            </label>
            <textarea
              id="qb-new-prompt"
              rows={3}
              className="input-school text-sm"
              value={questionDraft.prompt}
              onChange={(event) => setQuestionField('prompt', event.target.value)}
              placeholder={t('qbPromptPlaceholder', { defaultValue: 'اكتب نص السؤال هنا…' })}
              disabled={savingQuestion}
            />
          </div>

          <div className="rounded-card border-2 border-line bg-surface-muted/40 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-black">
                {t('qbOptions', { defaultValue: 'خيارات الإجابة' })}
              </span>
              <button
                type="button"
                onClick={() => setQuestionField('options', [...questionDraft.options, ''])}
                disabled={questionDraft.options.length >= 6 || savingQuestion}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                {t('qbAddOption', { defaultValue: 'إضافة خيار' })}
              </button>
            </div>
            <div className="space-y-2">
              {questionDraft.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    id={`qb-correct-${index}`}
                    type="radio"
                    name="qb-correct-option"
                    className="h-4 w-4 shrink-0 accent-brand-600"
                    checked={questionDraft.correctIndex === index}
                    onChange={() => setQuestionField('correctIndex', index)}
                    disabled={savingQuestion}
                    aria-label={t('qbCorrectOptionLabel', {
                      number: index + 1,
                      defaultValue: 'تحديد الخيار {{number}} كإجابة صحيحة',
                    })}
                  />
                  <input
                    id={`qb-option-${index}`}
                    type="text"
                    className="input-school flex-1 text-sm"
                    value={option}
                    onChange={(event) => {
                      const next = [...questionDraft.options]
                      next[index] = event.target.value
                      setQuestionField('options', next)
                    }}
                    disabled={savingQuestion}
                    aria-label={t('qbOptionLabel', {
                      number: index + 1,
                      defaultValue: 'الخيار {{number}}',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = questionDraft.options.filter((_, optionIndex) => optionIndex !== index)
                      let nextCorrect = questionDraft.correctIndex
                      if (nextCorrect === index) nextCorrect = null
                      else if (nextCorrect !== null && nextCorrect > index) nextCorrect -= 1
                      setQuestionDraft((current) => ({
                        ...current,
                        options: next,
                        correctIndex: nextCorrect,
                      }))
                    }}
                    disabled={questionDraft.options.length <= 2 || savingQuestion}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-card border-2 border-line bg-surface text-muted transition hover:border-[#E03131]/50 hover:text-[#b42318] disabled:opacity-40"
                    aria-label={t('qbRemoveOption', { defaultValue: 'إزالة الخيار' })}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] font-bold leading-relaxed text-muted">
              {t('qbCorrectHint', {
                defaultValue: 'استخدم زر الإجابة الصحيحة لتحديد الخيار الصحيح.',
              })}{' '}
              {t('qbOptionRange', { defaultValue: 'يمكنك إدخال خيارين إلى ستة خيارات.' })}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={LABEL} htmlFor="qb-new-skill">
                {t('qbSkillOptional', { defaultValue: 'المهارة (اختياري)' })}
              </label>
              <input
                id="qb-new-skill"
                type="text"
                className="input-school text-sm"
                value={questionDraft.skill}
                onChange={(event) => setQuestionField('skill', event.target.value)}
                disabled={savingQuestion}
              />
            </div>
            <div>
              <label className={LABEL} htmlFor="qb-new-explanation">
                {t('qbExplanationOptional', { defaultValue: 'التفسير (اختياري)' })}
              </label>
              <input
                id="qb-new-explanation"
                type="text"
                className="input-school text-sm"
                value={questionDraft.explanation}
                onChange={(event) => setQuestionField('explanation', event.target.value)}
                disabled={savingQuestion}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingQuestion}
            className="btn-chunky btn-chunky--primary btn-chunky--sm"
          >
            {savingQuestion ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {savingQuestion
              ? t('qbCreating', { defaultValue: 'جارٍ الإنشاء…' })
              : t('qbCreateQuestion', { defaultValue: 'إنشاء السؤال' })}
          </button>
        </form>
      </section>

      <section
        className="space-y-4"
        aria-label={t('qbAssessmentsTitle', { defaultValue: 'التقويمات التكوينية' })}
      >
        <header className="card-school flex flex-wrap items-center justify-between gap-2 p-4">
          <div>
            <h2 className="font-display text-base font-black">
              {t('qbAssessmentsTitle', { defaultValue: 'التقويمات التكوينية' })}
            </h2>
            <p className="mt-1 text-[11px] font-semibold text-muted">
              {t('qbAssessmentsHint', {
                defaultValue: 'أنشئ تقويمًا قصيرًا من أسئلة البنك، ثم انشره أو أوقف نشره في أي وقت.',
              })}
            </p>
          </div>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-black text-brand-700 dark:bg-brand-400/10 dark:text-brand-300">
            {assessments.length} {t('qbAssessments', { defaultValue: 'التقويمات' })}
          </span>
        </header>

        {assessmentsLoading ? (
          <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            {t('qbAssessmentsLoading', { defaultValue: 'جارٍ تحميل التقويمات…' })}
          </div>
        ) : assessmentsError ? (
          <div
            role="alert"
            className="card-school flex flex-wrap items-center justify-between gap-3 border-[#E03131]/40 p-5"
          >
            <p className="flex items-start gap-2 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {assessmentsError}
            </p>
            <button
              type="button"
              onClick={() => setAssessmentsReloadKey((key) => key + 1)}
              className="btn-chunky btn-chunky--secondary btn-chunky--sm"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              {t('qbRetry', { defaultValue: 'إعادة المحاولة' })}
            </button>
          </div>
        ) : assessments.length === 0 ? (
          <Notice>
            {t('qbNoAssessments', {
              defaultValue: 'لا توجد تقويمات تكوينية بعد. أنشئ تقويمًا جديدًا للبدء.',
            })}
          </Notice>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {assessments.map((assessment) => {
              const analysisOpen = analysis.id === assessment.id
              const published = assessment.status === 'published'
              const saving = savingAssessmentId === assessment.id
              return (
                <article key={assessment.id} className="card-school overflow-hidden">
                  <div className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-extrabold text-content">
                          {assessment.title || dash}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className={CHIP}>{assessment.subject || dash}</span>
                          <span className={CHIP}>{assessment.level || dash}</span>
                          <span className={CHIP}>{assessment.term || dash}</span>
                          <span className={`${BADGE_BASE} ${formativeStatusBadgeClass(assessment.status)}`}>
                            {published
                              ? t('qbPublished', { defaultValue: 'منشور' })
                              : t('qbDraft', { defaultValue: 'مسودة' })}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-black text-muted">
                        {t('qbAttempts', {
                          count: assessment.attemptsCount,
                          defaultValue: '{{count}} محاولة',
                        })}
                      </span>
                    </div>
                    <p className="mt-3 text-[11px] font-bold text-muted">
                      {t('qbQuestionsCount', {
                        count: assessment.questionIds.length,
                        defaultValue: '{{count}} سؤال',
                      })}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void toggleAssessmentStatus(assessment)}
                        disabled={savingAssessmentId !== null}
                        className={`btn-chunky btn-chunky--sm ${
                          published ? 'btn-chunky--secondary' : 'btn-chunky--primary'
                        }`}
                      >
                        {saving ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                        ) : published ? (
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Send className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {saving
                          ? t('qbSaving', { defaultValue: 'جارٍ الحفظ…' })
                          : published
                            ? t('qbUnpublish', { defaultValue: 'إلغاء النشر' })
                            : t('qbPublish', { defaultValue: 'نشر' })}
                      </button>
                      <button
                        type="button"
                        onClick={() => void openAnalysis(assessment)}
                        aria-expanded={analysisOpen}
                        className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                      >
                        <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                        {analysisOpen
                          ? t('qbHideAnalysis', { defaultValue: 'إخفاء التحليل' })
                          : t('qbViewAnalysis', { defaultValue: 'عرض التحليل' })}
                      </button>
                    </div>
                  </div>

                  {analysisOpen ? (
                    <div className="border-t-2 border-line bg-surface-muted/40 p-4">
                      <div className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-2.5 text-[11px] font-bold leading-relaxed text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>
                          {t('qbAdvisory', {
                            defaultValue:
                              'التقويم التكويني يدعم التعلّم؛ نتائجه استرشادية ولا تُغني عن حكم المعلّم أو التقرير الدراسي الرسمي.',
                          })}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <h4 className="flex items-center gap-1.5 text-xs font-black">
                          <BarChart3 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                          {t('qbAnalysisTitle', { defaultValue: 'تحليل مفردات التقويم' })}
                        </h4>
                        {analysis.data ? (
                          <span className="text-[11px] font-bold text-muted">
                            {t('qbAnalysisAttempts', {
                              count: analysis.data.attempts,
                              defaultValue: 'إجمالي المحاولات: {{count}}',
                            })}
                          </span>
                        ) : null}
                      </div>

                      {analysis.loading ? (
                        <div className="mt-3 flex items-center justify-center gap-2 rounded-card border-2 border-dashed border-line p-6 text-xs font-bold text-muted">
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          {t('qbAnalysisLoading', { defaultValue: 'جارٍ تحميل التحليل…' })}
                        </div>
                      ) : analysis.error ? (
                        <div
                          role="alert"
                          className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-card border-2 border-[#E03131]/40 p-3"
                        >
                          <p className="flex items-start gap-2 text-xs font-bold text-[#b42318] dark:text-[#ff8787]">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            {analysis.error}
                          </p>
                          <button
                            type="button"
                            onClick={() => void openAnalysis(assessment)}
                            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                          >
                            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                            {t('qbRetry', { defaultValue: 'إعادة المحاولة' })}
                          </button>
                        </div>
                      ) : !analysis.data || analysis.data.items.length === 0 ? (
                        <div className="mt-3">
                          <Notice>
                            {t('qbAnalysisEmpty', {
                              defaultValue: 'لا توجد بيانات تحليل متاحة لهذا التقويم بعد.',
                            })}
                          </Notice>
                        </div>
                      ) : (
                        <div className="mt-3 overflow-x-auto rounded-card border-2 border-line bg-surface">
                          <table className="w-full min-w-[640px] text-start text-[11px] font-bold">
                            <caption className="sr-only">
                              {t('qbAnalysisTitle', { defaultValue: 'تحليل مفردات التقويم' })}
                            </caption>
                            <thead className="bg-surface-muted text-muted">
                              <tr>
                                <th scope="col" className="px-3 py-2 text-start">
                                  {t('qbQuestionColumn', { defaultValue: 'السؤال' })}
                                </th>
                                <th scope="col" className="px-3 py-2 text-start">
                                  {t('qbAttemptsColumn', { defaultValue: 'المحاولات' })}
                                </th>
                                <th scope="col" className="px-3 py-2 text-start">
                                  {t('qbCorrectColumn', { defaultValue: 'الإجابات الصحيحة' })}
                                </th>
                                <th scope="col" className="px-3 py-2 text-start">
                                  {t('qbDifficultyColumn', { defaultValue: 'معامل الصعوبة' })}
                                </th>
                                <th scope="col" className="px-3 py-2 text-start">
                                  {t('qbDiscriminationColumn', { defaultValue: 'معامل التمييز' })}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {analysis.data.items.map((item, index) => (
                                <tr key={`${item.questionId}-${index}`} className="border-t-2 border-line">
                                  <td className="px-3 py-2 text-content">{item.prompt || dash}</td>
                                  <td className="px-3 py-2 text-content">{item.attempts}</td>
                                  <td className="px-3 py-2 text-content">{item.correct}</td>
                                  <td className="px-3 py-2 text-content">
                                    {item.difficultyPct}
                                    {t('qbPercent', { defaultValue: '%' })}
                                  </td>
                                  <td className="px-3 py-2 text-content">
                                    {item.discriminationPct}
                                    {t('qbPercent', { defaultValue: '%' })}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}

        <form
          onSubmit={(event) => void submitAssessment(event)}
          className="card-school space-y-4 p-4 sm:p-5"
          aria-label={t('qbNewAssessment', { defaultValue: 'تقويم جديد' })}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-black">
                {t('qbNewAssessment', { defaultValue: 'تقويم جديد' })}
              </h3>
              <p className="mt-1 text-[11px] font-semibold text-muted">
                {t('qbNewAssessmentHint', {
                  defaultValue: 'اختر الأسئلة التي ستُستخدم في هذا التقويم القصير.',
                })}
              </p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="sm:col-span-2">
              <label className={LABEL} htmlFor="qb-new-assessment-title">
                {t('qbAssessmentTitle', { defaultValue: 'عنوان التقويم' })}
              </label>
              <input
                id="qb-new-assessment-title"
                type="text"
                className="input-school text-sm"
                value={assessmentDraft.title}
                onChange={(event) => setAssessmentField('title', event.target.value)}
                placeholder={t('qbAssessmentTitlePlaceholder', {
                  defaultValue: 'اكتب عنوان التقويم…',
                })}
                disabled={savingAssessment}
              />
            </div>
            <div>
              <label className={LABEL} htmlFor="qb-new-assessment-level">
                {t('qbLevel', { defaultValue: 'المستوى' })}
              </label>
              <select
                id="qb-new-assessment-level"
                className="input-school text-sm"
                value={assessmentDraft.levelId}
                onChange={(event) => setAssessmentField('levelId', event.target.value)}
                disabled={savingAssessment}
              >
                <option value="">{t('qbChooseLevel', { defaultValue: 'اختر المستوى' })}</option>
                {levelOptions.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="qb-new-assessment-subject">
                {t('qbSubject', { defaultValue: 'المادة' })}
              </label>
              <select
                id="qb-new-assessment-subject"
                className="input-school text-sm"
                value={assessmentDraft.subjectId}
                onChange={(event) => setAssessmentField('subjectId', event.target.value)}
                disabled={savingAssessment}
              >
                <option value="">{t('qbChooseSubject', { defaultValue: 'اختر المادة' })}</option>
                {subjectOptions.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="qb-new-assessment-term">
                {t('qbTerm', { defaultValue: 'الفصل الدراسي' })}
              </label>
              <select
                id="qb-new-assessment-term"
                className="input-school text-sm"
                value={assessmentDraft.term}
                onChange={(event) => setAssessmentField('term', event.target.value)}
                disabled={savingAssessment}
              >
                <option value="">{t('qbChooseTerm', { defaultValue: 'اختر الفصل' })}</option>
                {termOptions.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL} htmlFor="qb-new-assessment-status">
                {t('qbSaveAs', { defaultValue: 'الحالة عند الإنشاء' })}
              </label>
              <select
                id="qb-new-assessment-status"
                className="input-school text-sm"
                value={assessmentDraft.status}
                onChange={(event) => setAssessmentField('status', normalizeFormativeStatus(event.target.value))}
                disabled={savingAssessment}
              >
                <option value="draft">{t('qbDraft', { defaultValue: 'مسودة' })}</option>
                <option value="published">{t('qbPublished', { defaultValue: 'منشور' })}</option>
              </select>
            </div>
          </div>

          <fieldset disabled={savingAssessment} className="rounded-card border-2 border-line p-3">
            <legend className="px-1 text-[11px] font-black">
              {t('qbSelectQuestions', { defaultValue: 'اختر الأسئلة' })}
            </legend>
            <p className="mb-2 text-[10px] font-bold text-muted">
              {t('qbSelectedCount', {
                count: assessmentDraft.questionIds.length,
                defaultValue: 'تم اختيار {{count}} سؤال',
              })}
            </p>
            {selectableQuestions.length === 0 ? (
              <p className="text-[11px] font-semibold text-muted">
                {t('qbNoActiveQuestions', {
                  defaultValue: 'لا توجد أسئلة نشطة متاحة لاختيارها.',
                })}
              </p>
            ) : (
              <div className="grid max-h-64 gap-2 overflow-y-auto sm:grid-cols-2">
                {selectableQuestions.map((question, index) => (
                  <label
                    key={question.id}
                    htmlFor={`qb-select-${index}`}
                    className="flex cursor-pointer items-start gap-2 rounded-card border-2 border-line bg-surface p-2 text-[11px] font-bold text-content"
                  >
                    <input
                      id={`qb-select-${index}`}
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
                      checked={assessmentDraft.questionIds.includes(question.id)}
                      onChange={() => toggleSelectedQuestion(question.id)}
                    />
                    <span className="min-w-0 line-clamp-2">{question.prompt || dash}</span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <button
            type="submit"
            disabled={savingAssessment}
            className="btn-chunky btn-chunky--primary btn-chunky--sm"
          >
            {savingAssessment ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {savingAssessment
              ? t('qbCreatingAssessment', { defaultValue: 'جارٍ إنشاء التقويم…' })
              : t('qbCreate', { defaultValue: 'إنشاء' })}
          </button>
        </form>
      </section>
    </div>
  )
}
