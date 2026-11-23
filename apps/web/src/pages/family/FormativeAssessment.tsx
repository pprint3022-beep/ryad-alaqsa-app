import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Info,
  ListChecks,
  Loader2,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  X,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'
import SpeakButton from '../../components/SpeakButton'
import type { SpeakLocale } from '../../lib/speech'

interface StudentFormative {
  id: string
  title: string
  subject: string
  term: string
  questionCount: number
  attemptsCount: number
  bestScore: number | null
  lastAttemptAt: string | null
}

interface TakeQuestion {
  id: string
  prompt: string
  options: string[]
  skill: string
  difficulty: 'easy' | 'medium' | 'hard'
}

interface FeedbackItem {
  questionId: string
  correct: boolean
  selectedText: string
  correctText: string
  explanation: string
}

interface Attempt {
  id: string
  score: number
  correct: number
  total: number
  feedback: FeedbackItem[]
  completedAt: string
  attemptNumber?: number
  durationSeconds?: number
  late?: boolean
  advisory?: boolean
}

interface SubmitBody {
  answers: Record<string, number>
  durationSeconds?: number
}

interface ListResponse {
  assessments: StudentFormative[]
}

interface TakeAssessment {
  id: string
  title: string
  subject: string
  term: string
}

interface TakeResponse {
  assessment: TakeAssessment
  questions: TakeQuestion[]
  timeLimitSeconds?: number
  startedAt?: string
  serverNow?: string
}

interface ActiveTake {
  assessment: TakeAssessment
  questions: TakeQuestion[]
  timeLimitSeconds: number
  startedAt: string
  serverNow: string
}

interface SubmitResponse {
  attempt: Attempt
  bestScore: number
}

type View = 'list' | 'taking' | 'result'
type LoadStatus = 'loading' | 'ready' | 'error'

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asText(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function normalizeAssessment(raw: unknown): StudentFormative {
  const item = asRecord(raw)
  return {
    id: asText(item.id),
    title: asText(item.title),
    subject: asText(item.subject),
    term: asText(item.term),
    questionCount: asNumber(item.questionCount),
    attemptsCount: asNumber(item.attemptsCount),
    bestScore:
      typeof item.bestScore === 'number' && Number.isFinite(item.bestScore)
        ? item.bestScore
        : null,
    lastAttemptAt: typeof item.lastAttemptAt === 'string' ? item.lastAttemptAt : null,
  }
}

function normalizeQuestion(raw: unknown): TakeQuestion {
  const item = asRecord(raw)
  const difficulty = item.difficulty
  return {
    id: asText(item.id),
    prompt: asText(item.prompt),
    options: asArray(item.options).map(asText),
    skill: asText(item.skill),
    difficulty:
      difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard'
        ? difficulty
        : 'easy',
  }
}

function normalizeFeedback(raw: unknown): FeedbackItem {
  const item = asRecord(raw)
  return {
    questionId: asText(item.questionId),
    correct: item.correct === true,
    selectedText: asText(item.selectedText),
    correctText: asText(item.correctText),
    explanation: asText(item.explanation),
  }
}

function normalizeAttempt(raw: unknown): Attempt {
  const item = asRecord(raw)
  return {
    id: asText(item.id),
    score: asNumber(item.score),
    correct: asNumber(item.correct),
    total: asNumber(item.total),
    feedback: asArray(item.feedback).map(normalizeFeedback),
    completedAt: asText(item.completedAt),
    attemptNumber:
      typeof item.attemptNumber === 'number' && Number.isFinite(item.attemptNumber)
        ? item.attemptNumber
        : undefined,
    durationSeconds:
      typeof item.durationSeconds === 'number' && Number.isFinite(item.durationSeconds)
        ? item.durationSeconds
        : undefined,
    late: item.late === true,
    advisory: item.advisory === true,
  }
}

function normalizeTakeAssessment(raw: unknown): TakeAssessment {
  const item = asRecord(raw)
  return {
    id: asText(item.id),
    title: asText(item.title),
    subject: asText(item.subject),
    term: asText(item.term),
  }
}

function normalizeTake(raw: TakeResponse): ActiveTake {
  const item = asRecord(raw)
  return {
    assessment: normalizeTakeAssessment(item.assessment),
    questions: asArray(item.questions).map(normalizeQuestion),
    timeLimitSeconds: asNumber(item.timeLimitSeconds),
    startedAt: asText(item.startedAt),
    serverNow: asText(item.serverNow),
  }
}

function normalizeSubmit(raw: SubmitResponse): SubmitResponse {
  const item = asRecord(raw)
  return { attempt: normalizeAttempt(item.attempt), bestScore: asNumber(item.bestScore) }
}

function toPercent(value: number): number {
  if (!Number.isFinite(value)) return 0
  if (value >= 0 && value <= 1) return Math.round(value * 100)
  if (value > 1 && value <= 100) return Math.round(value)
  return 0
}

function percentText(value: number): string {
  return `${toPercent(value)}%`
}

function formatDate(value: string, locale: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return ''
  }
}

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0))
  const minutes = Math.floor(safe / 60).toString().padStart(2, '0')
  const seconds = (safe % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

export default function FormativeAssessment() {
  const { t, i18n } = useTranslation()
  // Assessment questions are curriculum content (ar/fr/en); Amazigh has its
  // own dedicated section, so an amz UI language must not select its voice.
  const speakLocale: SpeakLocale = (['ar', 'fr', 'en'].includes(i18n.resolvedLanguage || i18n.language)
    ? (i18n.resolvedLanguage || i18n.language)
    : 'ar') as SpeakLocale

  const [view, setView] = useState<View>('list')
  const [reloadKey, setReloadKey] = useState(0)
  const [listStatus, setListStatus] = useState<LoadStatus>('loading')
  const [listError, setListError] = useState('')
  const [assessments, setAssessments] = useState<StudentFormative[]>([])

  const [termFilter, setTermFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')

  const [activeId, setActiveId] = useState('')
  const [active, setActive] = useState<ActiveTake | null>(null)
  const [takeStatus, setTakeStatus] = useState<LoadStatus>('loading')
  const [takeError, setTakeError] = useState('')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [result, setResult] = useState<SubmitResponse | null>(null)
  const [history, setHistory] = useState<Record<string, Attempt[]>>({})
  const [remaining, setRemaining] = useState(0)
  const [timeUp, setTimeUp] = useState(false)

  const takeController = useRef<AbortController | null>(null)
  const deadlineRef = useRef<number | null>(null)
  const clientStartedRef = useRef(0)
  const autoSubmittedRef = useRef(false)
  const submitRef = useRef<(force?: boolean) => Promise<void>>(async () => undefined)

  const rawLocale = i18n.resolvedLanguage ?? i18n.language ?? 'ar'
  const locale = rawLocale.startsWith('ar') ? 'ar-MA' : rawLocale

  const describeError = useCallback(
    (error: unknown, fallback: string) => {
      const apiError = extractApiError(error)
      if (apiError?.message) return apiError.message
      if (apiError?.error) {
        return t('faErrorDetail', {
          defaultValue: 'تعذّر الطلب ({{code}}).',
          code: apiError.error,
        })
      }
      return fallback
    },
    [t],
  )

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setListStatus('loading')
    setListError('')

    apiGet<ListResponse>('/student/formative-assessments', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        const rows = asArray(asRecord(data).assessments).map(normalizeAssessment)
        setAssessments(rows)
        setListStatus('ready')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setListError(
          describeError(
            error,
            t('faErrorLoad', { defaultValue: 'تعذّر تحميل التقييمات. حاول مرة أخرى.' }),
          ),
        )
        setListStatus('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, t, describeError])

  useEffect(
    () => () => {
      takeController.current?.abort()
    },
    [],
  )

  const terms = useMemo(
    () => [...new Set(assessments.map((item) => item.term).filter(Boolean))],
    [assessments],
  )
  const subjects = useMemo(
    () => [...new Set(assessments.map((item) => item.subject).filter(Boolean))],
    [assessments],
  )
  const filteredAssessments = useMemo(
    () =>
      assessments.filter((item) => {
        if (termFilter && item.term !== termFilter) return false
        if (subjectFilter && item.subject !== subjectFilter) return false
        return true
      }),
    [assessments, termFilter, subjectFilter],
  )

  const questions = active?.questions ?? []
  const question = questions[currentIndex] ?? null
  const answeredCount = questions.filter((item) => answers[item.id] !== undefined).length
  const allAnswered = questions.length > 0 && answeredCount === questions.length
  const feedback = result?.attempt.feedback ?? []
  const sessionHistory = active ? history[active.assessment.id] ?? [] : []
  const attemptsCountForActive =
    assessments.find((item) => item.id === active?.assessment.id)?.attemptsCount ??
    sessionHistory.length

  const difficultyLabel = (difficulty: TakeQuestion['difficulty']): string => {
    if (difficulty === 'medium') return t('faDifficultyMedium', { defaultValue: 'متوسط' })
    if (difficulty === 'hard') return t('faDifficultyHard', { defaultValue: 'صعب' })
    return t('faDifficultyEasy', { defaultValue: 'سهل' })
  }

  const refreshList = () => setReloadKey((value) => value + 1)

  const goToList = () => {
    takeController.current?.abort()
    deadlineRef.current = null
    setRemaining(0)
    setTimeUp(false)
    autoSubmittedRef.current = false
    setView('list')
    setActive(null)
    setActiveId('')
    setResult(null)
    setSubmitting(false)
    setSubmitError('')
    refreshList()
  }

  const startAssessment = (id: string) => {
    takeController.current?.abort()
    const controller = new AbortController()
    takeController.current = controller

    setActiveId(id)
    setActive(null)
    setAnswers({})
    setCurrentIndex(0)
    setResult(null)
    setSubmitError('')
    setSubmitting(false)
    setTakeStatus('loading')
    setTakeError('')
    deadlineRef.current = null
    setRemaining(0)
    setTimeUp(false)
    autoSubmittedRef.current = false
    setView('taking')

    apiGet<TakeResponse>(`/student/formative-assessments/${id}`, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return
        const normalized = normalizeTake(data)
        clientStartedRef.current = Date.now()
        setActive(normalized)
        if (normalized.timeLimitSeconds > 0) {
          const serverStart = normalized.startedAt ? Date.parse(normalized.startedAt) : Number.NaN
          const start = Number.isFinite(serverStart) ? serverStart : clientStartedRef.current
          const deadline = start + normalized.timeLimitSeconds * 1000
          deadlineRef.current = deadline
          setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
        } else {
          deadlineRef.current = null
          setRemaining(0)
        }
        setTakeStatus('ready')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setTakeError(
          describeError(
            error,
            t('faTakeError', { defaultValue: 'تعذّر تحميل التقييم. حاول مرة أخرى.' }),
          ),
        )
        setTakeStatus('error')
      })
  }

  const tryAgain = () => {
    setAnswers({})
    setCurrentIndex(0)
    setResult(null)
    setSubmitError('')
    setSubmitting(false)
    setTakeStatus('ready')
    clientStartedRef.current = Date.now()
    autoSubmittedRef.current = false
    setTimeUp(false)
    if (active && active.timeLimitSeconds > 0) {
      const deadline = clientStartedRef.current + active.timeLimitSeconds * 1000
      deadlineRef.current = deadline
      setRemaining(active.timeLimitSeconds)
    } else {
      deadlineRef.current = null
      setRemaining(0)
    }
    setView('taking')
  }

  const chooseAnswer = (questionId: string, optionIndex: number) => {
    if (submitting) return
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }))
  }

  const submitAnswers = useCallback(async (force = false) => {
    if (!active || submitting || questions.length === 0 || (!force && !allAnswered)) return
    setSubmitting(true)
    setSubmitError('')
    const durationSeconds = clientStartedRef.current
      ? Math.max(0, Math.round((Date.now() - clientStartedRef.current) / 1000))
      : 0
    try {
      const data = await apiPost<SubmitResponse, SubmitBody>(
        `/student/formative-assessments/${active.assessment.id}/submit`,
        { answers, durationSeconds },
      )
      const response = normalizeSubmit(data)
      const id = active.assessment.id

      setHistory((current) => ({
        ...current,
        [id]: [...(current[id] ?? []), response.attempt],
      }))
      setAssessments((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                attemptsCount: item.attemptsCount + 1,
                bestScore: Math.max(item.bestScore ?? 0, response.bestScore),
                lastAttemptAt: response.attempt.completedAt || item.lastAttemptAt,
              }
            : item,
        ),
      )
      setResult(response)
      setView('result')
    } catch (error: unknown) {
      setSubmitError(
        describeError(
          error,
          t('faSubmitError', { defaultValue: 'تعذّر إرسال إجاباتك. حاول مرة أخرى.' }),
        ),
      )
    } finally {
      setSubmitting(false)
      deadlineRef.current = null
    }
  }, [active, submitting, questions, allAnswered, answers, t, describeError])

  // Kept in a ref so the 1s timer can call the latest submit handler without
  // re-subscribing on every answer keystroke.
  useEffect(() => {
    submitRef.current = (force = false) => submitAnswers(force)
  }, [submitAnswers])

  useEffect(() => {
    if (view !== 'taking' || !active || deadlineRef.current === null) return
    const timer = window.setInterval(() => {
      const deadline = deadlineRef.current
      if (deadline === null) return
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        window.clearInterval(timer)
        // Guard ensures the auto-submit path fires exactly once.
        if (!autoSubmittedRef.current) {
          autoSubmittedRef.current = true
          setTimeUp(true)
          void submitRef.current(true)
        }
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [view, active])

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div
          className="absolute -end-16 -top-24 h-64 w-64 rounded-full bg-gold-400/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('faBadge', { defaultValue: 'تقييم تفاعلي' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('faTitle', { defaultValue: 'التقييمات التكوينية' })}
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold text-white/85">
              {t('faSubtitle', {
                defaultValue: 'اختبارات قصيرة تساعدك على معرفة ما أتقنته وما يحتاج إلى مراجعة.',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={refreshList}
            disabled={listStatus === 'loading' || submitting}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-black text-white transition hover:bg-white/25"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${listStatus === 'loading' ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            {t('faRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      </section>

      <section className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 px-5 py-3 text-xs font-bold leading-relaxed text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {t('faAdvisory', {
            defaultValue:
              'هذه الفحوص القصيرة تساعدك على التعلّم. هي تدريب فقط — لا تؤثر في بطاقة تقديرك، ويمكنك إعادة المحاولة.',
          })}
        </span>
      </section>

      {/* ------------------------------ list view ----------------------------- */}
      {view === 'list' ? (
        <>
          <section aria-label={t('faFilters', { defaultValue: 'تصفية التقييمات' })} className="card-school p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[160px] flex-1">
                <label htmlFor="fa-term-filter" className="text-[11px] font-black text-muted">
                  {t('faFilterTerm', { defaultValue: 'الفصل الدراسي' })}
                </label>
                <select
                  id="fa-term-filter"
                  value={termFilter}
                  onChange={(event) => setTermFilter(event.target.value)}
                  className="input-school mt-1 text-start"
                >
                  <option value="">{t('faAllTerms', { defaultValue: 'كل الفصول' })}</option>
                  {terms.map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-[160px] flex-1">
                <label htmlFor="fa-subject-filter" className="text-[11px] font-black text-muted">
                  {t('faFilterSubject', { defaultValue: 'المادة' })}
                </label>
                <select
                  id="fa-subject-filter"
                  value={subjectFilter}
                  onChange={(event) => setSubjectFilter(event.target.value)}
                  className="input-school mt-1 text-start"
                >
                  <option value="">{t('faAllSubjects', { defaultValue: 'كل المواد' })}</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-black">
              <ClipboardList className="h-4 w-4 text-brand-700 dark:text-brand-300" aria-hidden="true" />
              {t('faAvailable', { defaultValue: 'اختباراتك المتاحة' })}
            </h2>
            <span className="rounded-full border-2 border-gold-300 bg-gold-50 px-2.5 py-1 text-[10px] font-black text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
              {t('faAdvisoryBadge', { defaultValue: 'تدريبي · لا يُحتسب في بطاقة التقدير' })}
            </span>
          </div>

          {listStatus === 'loading' ? (
            <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              {t('faLoading', { defaultValue: 'جارٍ التحميل...' })}
            </div>
          ) : null}

          {listStatus === 'error' ? (
            <div className="card-school space-y-3 p-5">
              <p role="alert" className="text-sm font-bold text-[#b42318]">
                {listError}
              </p>
              <button
                type="button"
                onClick={refreshList}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                {t('faRetry', { defaultValue: 'إعادة المحاولة' })}
              </button>
            </div>
          ) : null}

          {listStatus === 'ready' && assessments.length === 0 ? (
            <div className="card-school p-8 text-center text-xs font-bold text-muted">
              {t('faEmpty', { defaultValue: 'لا توجد تقييمات متاحة حاليًا.' })}
            </div>
          ) : null}

          {listStatus === 'ready' && assessments.length > 0 && filteredAssessments.length === 0 ? (
            <div className="card-school p-8 text-center text-xs font-bold text-muted">
              {t('faNoMatches', { defaultValue: 'لا توجد تقييمات تطابق التصفية.' })}
            </div>
          ) : null}

          {listStatus === 'ready' && filteredAssessments.length > 0 ? (
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredAssessments.map((item) => {
                const attempts = item.attemptsCount
                const lastDate = formatDate(item.lastAttemptAt ?? '', locale)
                return (
                  <article key={item.id || item.title} className="card-school flex flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                        <Target className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[9px] font-black text-muted">
                        {t('faAdvisoryBadge', { defaultValue: 'تدريبي · لا يُحتسب في بطاقة التقدير' })}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-black">
                      {item.title || t('faUntitled', { defaultValue: 'تقييم بدون عنوان' })}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold text-muted">
                      {item.subject || t('faUnspecified', { defaultValue: 'غير محدد' })} •{' '}
                      {item.term || t('faUnspecified', { defaultValue: 'غير محدد' })}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-bold">
                      <span>{t('faQuestionsCount', { n: item.questionCount, defaultValue: '{{n}} سؤال' })}</span>
                      <span>{t('faAttemptsCount', { n: attempts, defaultValue: '{{n}} محاولة' })}</span>
                      <span className="col-span-2 inline-flex items-center gap-1.5 text-gold-700 dark:text-gold-300">
                        <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                        {t('faBestScore', {
                          score: percentText(item.bestScore ?? 0),
                          defaultValue: 'أفضل نتيجة: {{score}}',
                        })}
                      </span>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                      {lastDate
                        ? t('faLastAttempt', { date: lastDate, defaultValue: 'آخر محاولة: {{date}}' })
                        : t('faNoAttempts', { defaultValue: 'لم تبدأ بعد' })}
                    </p>
                    <button
                      type="button"
                      onClick={() => startAssessment(item.id)}
                      className="btn-chunky btn-chunky--secondary btn-chunky--sm mt-auto w-full"
                    >
                      {attempts > 0 ? (
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {attempts > 0
                        ? t('faRetryAction', { defaultValue: 'أعد المحاولة' })
                        : t('faStart', { defaultValue: 'ابدأ' })}
                    </button>
                  </article>
                )
              })}
            </section>
          ) : null}
        </>
      ) : null}

      {/* ----------------------------- taking view ---------------------------- */}
      {view === 'taking' ? (
        active ? (
          <section className="card-school overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-line bg-brand-50 px-4 py-3 dark:bg-brand-400/10">
              <div className="min-w-0">
                <p className="text-[10px] font-black text-brand-700 dark:text-brand-300">
                  {t('faTitle', { defaultValue: 'التقييمات التكوينية' })}
                </p>
                <h2 className="truncate text-sm font-black">
                  {active.assessment.title || t('faUntitled', { defaultValue: 'تقييم بدون عنوان' })}
                </h2>
                <p className="text-[11px] font-bold text-muted">
                  {active.assessment.subject || t('faUnspecified', { defaultValue: 'غير محدد' })} •{' '}
                  {active.assessment.term || t('faUnspecified', { defaultValue: 'غير محدد' })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {active.timeLimitSeconds > 0 ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[10px] font-black text-muted">
                      {t('faTimeLimit', {
                        time: formatClock(active.timeLimitSeconds),
                        defaultValue: 'الحد الزمني: {{time}}',
                      })}
                    </span>
                    <span
                      aria-live="polite"
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black tabular-nums ${
                        remaining <= 10
                          ? 'bg-[#E03131]/10 text-[#b42318]'
                          : 'bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
                      }`}
                    >
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('faTimer', { defaultValue: 'الوقت المتبقي' })}: {formatClock(remaining)}
                    </span>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={goToList}
                  disabled={submitting}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5 directional-icon" aria-hidden="true" />
                  {t('faBackToList', { defaultValue: 'العودة إلى القائمة' })}
                </button>
              </div>
            </div>

            <div className="p-5">
              {timeUp ? (
                <div role="status" className="mb-4 rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-[11px] font-black text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
                  {t('faTimeUp', { defaultValue: 'انتهى الوقت.' })}{' '}
                  {t('faAutoSubmit', { defaultValue: 'جارٍ إرسال إجاباتك تلقائيًا.' })}
                </div>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-brand-700 dark:text-brand-300">
                  <Target className="h-4 w-4" aria-hidden="true" />
                  {t('faQuestionOf', {
                    current: currentIndex + 1,
                    total: questions.length,
                    defaultValue: 'السؤال {{current}} من {{total}}',
                  })}
                </span>
                <span className="text-[11px] font-bold text-muted">
                  {answeredCount}/{questions.length} {t('faAnswered', { defaultValue: 'مُجابة' })}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{
                    width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`,
                  }}
                />
              </div>

              <fieldset className="mt-5" disabled={submitting}>
                <legend className="flex w-full items-start gap-3 text-sm font-black leading-relaxed">
                  <span className="flex-1">
                    {question?.prompt || t('faNoPrompt', { defaultValue: 'لا يوجد نص للسؤال.' })}
                  </span>
                  <SpeakButton
                    text={question?.prompt}
                    locale={speakLocale}
                    label={t('speakQuestion', { defaultValue: 'استمع إلى السؤال' })}
                    size="md"
                  />
                </legend>
                {question?.skill ? (
                  <p className="mt-1 text-[11px] font-bold text-muted">
                    {t('faSkill', { defaultValue: 'المهارة' })}: {question.skill} •{' '}
                    {difficultyLabel(question.difficulty)}
                  </p>
                ) : null}
                <div className="mt-4 grid gap-2">
                  {(question?.options ?? []).map((option, index) => {
                    const inputId = `fa-option-${question?.id ?? currentIndex}-${index}`
                    const checked = question ? answers[question.id] === index : false
                    return (
                      <label
                        key={inputId}
                        htmlFor={inputId}
                        className={`flex items-center gap-3 rounded-card border-2 px-4 py-3 text-xs font-bold transition ${
                          checked
                            ? 'border-brand-500 bg-brand-50 text-brand-800 dark:bg-brand-400/10 dark:text-brand-200'
                            : 'border-line bg-surface hover:border-brand-300'
                        }`}
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name={`fa-question-${question?.id ?? currentIndex}`}
                          value={index}
                          checked={checked}
                          onChange={() => question && chooseAnswer(question.id, index)}
                          className="h-4 w-4 shrink-0 accent-brand-500"
                        />
                        <span>
                          {option || t('faUnspecified', { defaultValue: 'غير محدد' })}
                        </span>
                        {checked ? (
                          <CheckCircle2 className="ms-auto h-4 w-4 shrink-0" aria-hidden="true" />
                        ) : null}
                      </label>
                    )
                  })}
                  {(question?.options.length ?? 0) === 0 ? (
                    <p className="rounded-card border-2 border-line bg-surface-muted p-3 text-xs font-bold text-muted">
                      {t('faNoOptions', { defaultValue: 'لا توجد خيارات متاحة لهذا السؤال.' })}
                    </p>
                  ) : null}
                </div>
              </fieldset>

              <div className="mt-6 rounded-card border-2 border-line bg-surface-muted p-3">
                <p className="flex items-center gap-1.5 text-[11px] font-black">
                  <ListChecks className="h-4 w-4" aria-hidden="true" />
                  {t('faAnswerPalette', { defaultValue: 'خريطة الإجابات' })}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {questions.map((item, index) => {
                    const answered = answers[item.id] !== undefined
                    const isCurrent = index === currentIndex
                    return (
                      <button
                        key={item.id || index}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        disabled={submitting}
                        aria-current={isCurrent ? 'step' : undefined}
                        aria-label={t('faPaletteItem', {
                          n: index + 1,
                          status: answered
                            ? t('faAnswered', { defaultValue: 'مُجابة' })
                            : t('faUnanswered', { defaultValue: 'غير مُجابة' }),
                          defaultValue: 'السؤال {{n}}: {{status}}',
                        })}
                        className={`grid h-8 w-8 place-items-center rounded-lg border-2 text-[11px] font-black transition ${
                          isCurrent
                            ? 'border-brand-500 bg-brand-500 text-white'
                            : answered
                              ? 'border-brand-300 bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
                              : 'border-line bg-surface text-muted'
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-bold text-muted">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-300" aria-hidden="true" />
                    {t('faAnswered', { defaultValue: 'مُجابة' })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span
                      className="h-3 w-3 rounded-full border-2 border-line bg-surface"
                      aria-hidden="true"
                    />
                    {t('faUnanswered', { defaultValue: 'غير مُجابة' })}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                  disabled={currentIndex === 0 || submitting}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  <ArrowLeft className="h-3.5 w-3.5 directional-icon" aria-hidden="true" />
                  {t('faPrevious', { defaultValue: 'السؤال السابق' })}
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  {!allAnswered ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted">
                      <Info className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('faSubmitHint', { defaultValue: 'أجب عن جميع الأسئلة قبل الإرسال.' })}
                    </span>
                  ) : null}
                  {currentIndex < questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentIndex((value) => Math.min(questions.length - 1, value + 1))
                      }
                      disabled={submitting}
                      className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                    >
                      {t('faNext', { defaultValue: 'السؤال التالي' })}
                      <ArrowRight className="h-3.5 w-3.5 directional-icon" aria-hidden="true" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void submitAnswers()}
                    disabled={!allAnswered || submitting}
                    className="btn-chunky btn-chunky--sm"
                  >
                    {submitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {submitting
                      ? t('faSubmitting', { defaultValue: 'جارٍ الإرسال...' })
                      : t('faSubmit', { defaultValue: 'إرسال الإجابات' })}
                  </button>
                </div>
              </div>

              {submitError ? (
                <p role="alert" className="mt-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-3 text-xs font-bold text-[#b42318]">
                  {submitError}
                </p>
              ) : null}
            </div>
          </section>
        ) : takeStatus === 'error' ? (
          <div className="card-school space-y-3 p-5">
            <p role="alert" className="text-sm font-bold text-[#b42318]">
              {takeError}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => startAssessment(activeId)}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                {t('faRetry', { defaultValue: 'إعادة المحاولة' })}
              </button>
              <button type="button" onClick={goToList} className="btn-chunky btn-chunky--sm">
                <ArrowLeft className="h-3.5 w-3.5 directional-icon" aria-hidden="true" />
                {t('faBackToList', { defaultValue: 'العودة إلى القائمة' })}
              </button>
            </div>
          </div>
        ) : (
          <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            {t('faTakeLoading', { defaultValue: 'جارٍ تجهيز الأسئلة...' })}
          </div>
        )
      ) : null}

      {/* ----------------------------- result view ---------------------------- */}
      {view === 'result' && active && result ? (
        <div className="space-y-4">
          <section aria-label={t('faResultSummary', { defaultValue: 'ملخص النتيجة' })} className="card-school p-5 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300">
              <Award className="h-8 w-8" aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-lg font-black">
              {t('faResultTitle', { defaultValue: 'نتيجتك' })}
            </h2>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border-2 border-gold-300 bg-gold-50 px-3 py-1 text-[10px] font-black text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {t('faAdvisoryBadge', { defaultValue: 'تدريبي · لا يُحتسب في بطاقة التقدير' })}
            </span>
            <p className="mt-3 font-display text-3xl font-black text-brand-700 dark:text-brand-300">
              {percentText(result.attempt.score)}
            </p>
            <p className="mt-1 text-xs font-bold text-muted">
              {t('faCorrectOf', {
                correct: result.attempt.correct,
                total: result.attempt.total,
                defaultValue: 'أجبت بشكل صحيح عن {{correct}} من {{total}}',
              })}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[11px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              {t('faBestScore', {
                score: percentText(result.bestScore),
                defaultValue: 'أفضل نتيجة: {{score}}',
              })}
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
              {typeof result.attempt.attemptNumber === 'number' ? (
                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-black text-muted">
                  {t('faAttemptNumber', {
                    n: result.attempt.attemptNumber,
                    defaultValue: 'المحاولة {{n}}',
                  })}
                </span>
              ) : null}
              {result.attempt.late ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('faLate', { defaultValue: 'متأخر' })}
                </span>
              ) : null}
              {typeof result.attempt.durationSeconds === 'number' ? (
                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-black text-muted">
                  {t('faDuration', {
                    time: formatClock(result.attempt.durationSeconds),
                    defaultValue: 'مدة المحاولة: {{time}}',
                  })}
                </span>
              ) : null}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={tryAgain} className="btn-chunky btn-chunky--sm">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                {t('faTryAgain', { defaultValue: 'حاول مجددًا' })}
              </button>
              <button
                type="button"
                onClick={goToList}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <ArrowLeft className="h-3.5 w-3.5 directional-icon" aria-hidden="true" />
                {t('faBackToList', { defaultValue: 'العودة إلى القائمة' })}
              </button>
            </div>
          </section>

          <section className="card-school p-5">
            <h3 className="flex items-center gap-2 text-sm font-black">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              {t('faFeedbackTitle', { defaultValue: 'التغذية الراجعة لكل سؤال' })}
            </h3>
            {feedback.length === 0 ? (
              <p className="mt-3 text-xs font-bold text-muted">
                {t('faNoFeedback', { defaultValue: 'لا توجد تغذية راجعة مفصّلة لهذه المحاولة.' })}
              </p>
            ) : (
              <ul aria-label={t('faFeedbackList', { defaultValue: 'قائمة التغذية الراجعة' })} className="mt-3 space-y-2">
                {feedback.map((item, index) => {
                  const related = questions.find((entry) => entry.id === item.questionId)
                  const chosen = related ? answers[related.id] : undefined
                  // Prefer the option text returned by the API: the local answer
                  // map may already have been cleared when the result is shown.
                  const chosenText =
                    item.selectedText ||
                    (related && chosen !== undefined ? related.options[chosen] : undefined)
                  return (
                    <li
                      key={item.questionId || index}
                      className={`rounded-card border-2 p-3 ${
                        item.correct
                          ? 'border-brand-300 bg-brand-50 dark:bg-brand-400/10'
                          : 'border-[#E03131]/30 bg-[#E03131]/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-black leading-relaxed">
                          {related?.prompt || t('faNoPrompt', { defaultValue: 'لا يوجد نص للسؤال.' })}
                        </p>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                            item.correct
                              ? 'bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
                              : 'bg-[#E03131]/10 text-[#b42318]'
                          }`}
                        >
                          {item.correct ? (
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          {item.correct
                            ? t('faCorrect', { defaultValue: 'صحيح' })
                            : t('faIncorrect', { defaultValue: 'غير صحيح' })}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] font-bold">
                        {t('faYourAnswer', {
                          answer:
                            chosenText || t('faNoAnswer', { defaultValue: 'لم تُجب' }),
                          defaultValue: 'إجابتك: {{answer}}',
                        })}
                      </p>
                      <p className="mt-1 text-[11px] font-bold text-brand-800 dark:text-brand-200">
                        {t('faCorrectAnswer', {
                          answer:
                            item.correctText ||
                            t('faUnspecified', { defaultValue: 'غير محدد' }),
                          defaultValue: 'الإجابة الصحيحة: {{answer}}',
                        })}
                      </p>
                      {item.explanation ? (
                        <p className="mt-2 border-t-2 border-line pt-2 text-[11px] font-semibold leading-relaxed text-muted">
                          <span className="font-black text-content">
                            {t('faExplanation', { defaultValue: 'التوضيح' })}:
                          </span>{' '}
                          {item.explanation}
                        </p>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="card-school p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-black">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {t('faAttemptHistory', { defaultValue: 'محاولاتك في هذه الجلسة' })}
              </h3>
              <span className="text-[11px] font-bold text-muted">
                {t('faAttemptsSoFar', {
                  n: attemptsCountForActive,
                  defaultValue: 'عدد محاولاتك: {{n}}',
                })}
              </span>
            </div>
            {sessionHistory.length === 0 ? (
              <p className="mt-3 text-xs font-bold text-muted">
                {t('faNoHistory', { defaultValue: 'لا توجد محاولات مسجلة في هذه الجلسة بعد.' })}
              </p>
            ) : (
              <ol className="mt-3 space-y-2">
                {sessionHistory.map((attempt, index) => {
                  const date = formatDate(attempt.completedAt, locale)
                  return (
                    <li
                      key={attempt.id || index}
                      className="flex items-center justify-between gap-2 rounded-card border-2 border-line bg-surface px-3 py-2"
                    >
                      <span className="text-xs font-black">
                        {t('faAttemptNumber', { n: index + 1, defaultValue: 'المحاولة {{n}}' })}
                      </span>
                      <span className="flex items-center gap-2 text-[11px] font-bold text-muted">
                        {date ? <span>{date}</span> : null}
                        <span className="font-black tabular-nums text-brand-700 dark:text-brand-300">
                          {percentText(attempt.score)}
                        </span>
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
