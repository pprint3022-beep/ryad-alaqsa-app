import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Award,
  BookOpen,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flame,
  Gamepad2,
  Lightbulb,
  ListChecks,
  Loader2,
  Play,
  RefreshCw,
  RotateCcw,
  Route,
  Search,
  Sparkles,
  Star,
  Target,
  Trophy,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { apiGet, apiPost } from '../../lib/api'
import SpeakButton from '../../components/SpeakButton'
import { MatchPairsGame, QuickQuiz, StarProgress } from '../../components/interactive'
import { VoiceHelper } from '../../components/ux'
import type { SpeakLocale } from '../../lib/speech'
import { questionsFor, type PracticeQuestion } from './learningContent'

interface Competency {
  skill?: string
  subject?: string
  mastery?: number
  targetMastery?: number
  status?: string
}
interface Exercise {
  skill?: string
  subject?: string
  exercise?: string
  frequency?: string
}
interface LearningPathInfo {
  focus?: string
  reassessDate?: string
  nextSteps?: string[]
}
interface Insights {
  classification?: string
  learningPath?: LearningPathInfo | null
  gaps?: Competency[]
  strengths?: Competency[]
  competencies?: Competency[]
  talents?: Array<{ domain?: string; skill?: string; evidence?: string }>
  suggestedExercises?: Exercise[]
  summaryReport?: { headline?: string; keyPoints?: string[] }
}
interface CurriculumItem {
  id: string
  unit?: string
  subject?: string
  subjectId?: string
  lessons?: string[]
  status?: string
  language?: string
  term?: string
}
interface Subject {
  id: string
  name: string
  category?: string
}
interface ContentSample {
  levelName?: string
  languages?: string[]
  totalUnits?: number
}
interface Assignment {
  id: string
  title?: string
  subject?: string
  dueDate?: string | null
  status?: string
  grade?: number | null
  feedback?: string | null
  submittedAt?: string | null
}
interface EngagementSummary {
  totalMinutes?: number
  todayMinutes?: number
  streakDays?: number
  sessions?: number
  lastActive?: string | null
  bySubjectMinutes?: Record<string, number>
  dailyMinutes?: Array<{ date: string; minutes: number }>
  note?: string
}
interface LessonRow {
  lessonId?: string
  subject?: string
  unit?: string
  lesson?: string
  score?: number
  completed?: boolean
  attempts?: number
  xp?: number
  updatedAt?: string
}
interface ProgressSummary {
  completed?: number
  totalXp?: number
  averageScore?: number
  rows?: LessonRow[]
}
interface EngagementResponse { summary: EngagementSummary; events?: unknown[] }
interface AssignmentsResponse { assignments: Assignment[] }
interface ProgressResponse { progress: ProgressSummary }

type Status = 'loading' | 'ready' | 'error'
type TabKey = 'overview' | 'lessons' | 'assignments' | 'assessment' | 'parallel' | 'library'
type QuizMode = 'lesson' | 'assessment'

interface LessonSelection {
  subjectId?: string
  subject?: string
  unitId?: string
  unit?: string
  lessonId: string
  lesson: string
}
interface QuizState {
  mode: QuizMode
  index: number
  selected: number | null
  correct: number
  hearts: number
  finished: boolean
  xp: number
  score: number
}
interface SubjectStat {
  id: string
  name: string
  units: number
  lessons: number
  mastery: number
  focus: boolean
}
interface ProgressPost {
  ok: boolean
  summary: ProgressSummary
}
interface LessonSection {
  id?: string
  heading?: string
  body?: string
  icon?: string
  mediaType?: string
  mediaUrl?: string
  durationMin?: number
}
interface LessonKeyTerm {
  term?: string
  definition?: string
}
interface LessonWorkedExample {
  id?: string
  prompt?: string
  steps?: string[]
  answer?: string
}
interface LessonContentTranslation {
  title?: string
  intro?: string
  sections?: LessonSection[]
  keyTerms?: LessonKeyTerm[]
  workedExamples?: LessonWorkedExample[]
}
interface LessonContent {
  id?: string
  lessonId?: string
  title?: string
  intro?: string
  sections?: LessonSection[]
  keyTerms?: LessonKeyTerm[]
  workedExamples?: LessonWorkedExample[]
  translations?: Record<string, LessonContentTranslation>
  estimatedMinutes?: number
  difficulty?: string
  status?: string
  hasQuiz?: boolean
}

/** Arabic is the base text; scientific lessons also carry fr/en versions. */
function localizeContent(content: LessonContent, lang: 'ar' | 'fr' | 'en'): LessonContent {
  const tr = lang === 'ar' ? undefined : content.translations?.[lang]
  if (!tr) return content
  return {
    ...content,
    title: tr.title || content.title,
    intro: tr.intro || content.intro,
    sections: tr.sections?.length ? tr.sections : content.sections,
    keyTerms: tr.keyTerms?.length ? tr.keyTerms : content.keyTerms,
    workedExamples: tr.workedExamples?.length ? tr.workedExamples : content.workedExamples,
  }
}
interface RemoteQuestion {
  id?: string
  prompt?: string
  options?: string[]
  skill?: string
  difficulty?: string
}
interface DisplayQuestion {
  prompt: string
  options: string[]
  answer?: number
  explanation?: string
  lang?: SpeakLocale
}
interface ResumeState {
  index: number
  hearts: number
  correct: number
  count: number
}

const resumeStorageKey = (lessonId: string) => `ryad-lesson-resume-${lessonId}`

function readResume(lessonId: string): ResumeState | null {
  try {
    const raw = window.localStorage.getItem(resumeStorageKey(lessonId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ResumeState>
    if (
      typeof parsed.index !== 'number' || !Number.isFinite(parsed.index) || parsed.index < 0 ||
      typeof parsed.hearts !== 'number' || parsed.hearts < 1 || parsed.hearts > 3 ||
      typeof parsed.correct !== 'number' || !Number.isFinite(parsed.correct) || parsed.correct < 0 ||
      typeof parsed.count !== 'number' || parsed.count < 1 || parsed.index >= parsed.count
    ) {
      window.localStorage.removeItem(resumeStorageKey(lessonId))
      return null
    }
    return {
      index: parsed.index,
      hearts: parsed.hearts,
      correct: parsed.correct,
      count: parsed.count,
    }
  } catch {
    return null
  }
}

function writeResume(lessonId: string, state: QuizState, count: number): void {
  try {
    window.localStorage.setItem(resumeStorageKey(lessonId), JSON.stringify({
      index: state.index,
      hearts: state.hearts,
      correct: state.correct,
      count,
    }))
  } catch {
    // Storage may be unavailable; resume is best-effort only.
  }
}

function clearResume(lessonId: string): void {
  try {
    window.localStorage.removeItem(resumeStorageKey(lessonId))
  } catch {
    // Ignore storage failures.
  }
}

const TABS: ReadonlyArray<{ key: TabKey; labelKey: string; label: string; icon: LucideIcon }> = [
  { key: 'overview', labelKey: 'lpTabOverview', label: 'نظرة عامة', icon: Route },
  { key: 'lessons', labelKey: 'lpTabLessons', label: 'الدروس التفاعلية', icon: BookOpen },
  { key: 'assignments', labelKey: 'lpTabAssignments', label: 'واجباتي', icon: ListChecks },
  { key: 'assessment', labelKey: 'lpTabAssessment', label: 'تقييم سريع', icon: Target },
  { key: 'parallel', labelKey: 'lpTabParallel', label: 'التعلّم الموازي', icon: Sparkles },
  { key: 'library', labelKey: 'lpTabLibrary', label: 'مكتبتي', icon: BookOpenCheck },
]

function seedFrom(text: string): number {
  let value = 0
  for (let index = 0; index < text.length; index += 1) value = (value + text.charCodeAt(index)) % 997
  return value
}

function percent(value?: number): string {
  if (value === undefined || !Number.isFinite(value)) return '0%'
  return `${Math.round(value * 100)}%`
}

/**
 * A stable colour for each subject area. The same colours are used in the unit
 * list and in the lesson player, so a child can recognise the subject before
 * reading its name. Purely decorative — the name is always written in text.
 */
function subjectTone(subject?: string): { dot: string; pill: string } {
  const value = (subject ?? '').toLowerCase()
  if (/رياض|math|حساب/.test(value)) {
    return {
      dot: 'bg-sky-500',
      pill: 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300',
    }
  }
  if (/علوم|science|phys|بيولوج|كيمياء/.test(value)) {
    return {
      dot: 'bg-emerald-500',
      pill: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300',
    }
  }
  if (/لغة|عربي|فرنس|إنجلي|فرانس|franç|english|arabic/.test(value)) {
    return {
      dot: 'bg-gold-500',
      pill: 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300',
    }
  }
  if (/تاريخ|جغراف|تاريخي/.test(value)) {
    return {
      dot: 'bg-purple-500',
      pill: 'bg-purple-100 text-purple-800 dark:bg-purple-400/15 dark:text-purple-300',
    }
  }
  return {
    dot: 'bg-brand-500',
    pill: 'bg-brand-100 text-brand-800 dark:bg-brand-400/15 dark:text-brand-300',
  }
}

export default function LearningPath() {
  const { t, i18n } = useTranslation()
  const speakLocale: SpeakLocale = (['ar', 'fr', 'en', 'amz'].includes(i18n.resolvedLanguage || i18n.language)
    ? (i18n.resolvedLanguage || i18n.language)
    : 'ar') as SpeakLocale
  const contentLang: 'ar' | 'fr' | 'en' = speakLocale === 'fr' || speakLocale === 'en' ? speakLocale : 'ar'

  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [insights, setInsights] = useState<Insights | null>(null)
  const [units, setUnits] = useState<CurriculumItem[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [level, setLevel] = useState('')
  const [samples, setSamples] = useState<ContentSample[]>([])
  const [terms, setTerms] = useState<string[]>([])
  const [libraryTerm, setLibraryTerm] = useState('')
  const [engagement, setEngagement] = useState<EngagementSummary>({})
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [progress, setProgress] = useState<ProgressSummary>({})

  const [tab, setTab] = useState<TabKey>('overview')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [search, setSearch] = useState('')
  const [openUnit, setOpenUnit] = useState<string | null>(null)
  const [lesson, setLesson] = useState<LessonSelection | null>(null)
  const [quiz, setQuiz] = useState<QuizState | null>(null)
  const [toast, setToast] = useState('')
  const [rawContent, setRawContent] = useState<LessonContent | null>(null)
  const content = useMemo(() => (rawContent ? localizeContent(rawContent, contentLang) : null), [rawContent, contentLang])
  const [remoteQuestions, setRemoteQuestions] = useState<RemoteQuestion[]>([])
  const [showContent, setShowContent] = useState(false)
  const [resumeAvailable, setResumeAvailable] = useState(false)
  const [practiceMatched, setPracticeMatched] = useState(false)
  const [practiceAnswered, setPracticeAnswered] = useState(false)
  const [practiceRead, setPracticeRead] = useState(false)
  const lessonFetchController = useRef<AbortController | null>(null)

  // A new lesson starts a fresh play corner: no leftover matches or streaks.
  useEffect(() => {
    setPracticeMatched(false)
    setPracticeAnswered(false)
    setPracticeRead(false)
  }, [rawContent?.id])

  const activityRef = useRef<{ activity: string; subject?: string; subjectId?: string; refId?: string }>({
    activity: 'reading',
  })

  const loadError = t('loadError', { defaultValue: 'تعذّر تحميل البيانات. حاول مرة أخرى.' })
  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setStatus('loading')
    setError('')

    Promise.all([
      apiGet<{ insights: Insights }>('/student/insights', { signal: controller.signal }),
      apiGet<{ level?: string; items: CurriculumItem[]; subjects?: Subject[] }>('/student/curriculum', {
        signal: controller.signal,
      }),
      apiGet<{ level?: string; items: CurriculumItem[]; terms?: string[]; contentSamples?: ContentSample[] }>('/student/content', {
        signal: controller.signal,
      }),
      apiGet<EngagementResponse>('/student/engagement', { signal: controller.signal }),
      apiGet<AssignmentsResponse>('/student/assignments', { signal: controller.signal }),
      apiGet<ProgressResponse>('/student/lessons/progress', { signal: controller.signal }),
    ])
      .then(([insightData, curriculumData, contentData, engagementData, assignmentData, progressData]) => {
        if (cancelled) return
        setInsights(insightData.insights ?? null)
        setUnits(contentData.items?.length ? contentData.items : curriculumData.items ?? [])
        setSubjects(curriculumData.subjects ?? [])
        setLevel(contentData.level ?? curriculumData.level ?? '')
        setSamples(contentData.contentSamples ?? [])
        setTerms(contentData.terms ?? [])
        setEngagement(engagementData.summary ?? {})
        setAssignments(assignmentData.assignments ?? [])
        setProgress(progressData.progress ?? {})
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) {
          setError(loadError)
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, loadError])

  // Heartbeats measure time inside the parallel learning space only.
  useEffect(() => {
    if (status !== 'ready') return
    let last = Date.now()

    const send = (seconds: number) => {
      const context = activityRef.current
      void apiPost<{ ok: boolean; summary: EngagementSummary }>('/student/engagement', {
        seconds: Math.min(90, Math.max(1, seconds)),
        activity: context.activity,
        subject: context.subject,
        subjectId: context.subjectId,
        refId: context.refId,
      })
        .then((response) => setEngagement(response.summary ?? {}))
        .catch(() => undefined)
    }

    const tick = () => {
      if (document.visibilityState !== 'visible') {
        last = Date.now()
        return
      }
      const elapsed = Math.round((Date.now() - last) / 1000)
      last = Date.now()
      if (elapsed >= 20) send(elapsed)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const elapsed = Math.round((Date.now() - last) / 1000)
        if (elapsed >= 5) send(elapsed)
      }
      last = Date.now()
    }

    const timer = window.setInterval(tick, 30000)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibility)
      const elapsed = Math.round((Date.now() - last) / 1000)
      if (elapsed >= 5) send(elapsed)
    }
  }, [status])

  useEffect(() => {
    activityRef.current = {
      activity: quiz
        ? showContent && content
          ? 'reading'
          : quiz.mode === 'assessment'
            ? 'assessment'
            : 'lesson'
        : tab === 'assignments'
          ? 'assignment'
          : 'reading',
      subject: lesson?.subject ?? (subjectFilter || undefined),
      subjectId: lesson?.subjectId,
      refId: lesson?.lessonId,
    }
  }, [quiz, lesson, subjectFilter, tab, showContent, content])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const progressByLesson = useMemo(() => {
    const map = new Map<string, LessonRow>()
    for (const row of progress.rows ?? []) {
      if (row.lessonId) map.set(row.lessonId, row)
    }
    return map
  }, [progress])

  const gapSubjects = useMemo(() => {
    const names = new Set<string>()
    for (const gap of insights?.gaps ?? []) if (gap.subject) names.add(gap.subject)
    return [...names]
  }, [insights])

  const subjectStats = useMemo<SubjectStat[]>(() => {
    const map = new Map<string, SubjectStat>()
    for (const subject of subjects) {
      map.set(subject.name, { id: subject.id, name: subject.name, units: 0, lessons: 0, mastery: 0, focus: false })
    }
    for (const item of units) {
      const name = item.subject || t('otherSubject', { defaultValue: 'مواد أخرى' })
      const stat = map.get(name) ?? { id: item.subjectId ?? name, name, units: 0, lessons: 0, mastery: 0, focus: false }
      stat.units += 1
      stat.lessons += item.lessons?.length ?? 0
      map.set(name, stat)
    }
    const masteryTotals = new Map<string, { sum: number; count: number }>()
    for (const competency of insights?.competencies ?? []) {
      if (!competency.subject || typeof competency.mastery !== 'number') continue
      const current = masteryTotals.get(competency.subject) ?? { sum: 0, count: 0 }
      current.sum += competency.mastery
      current.count += 1
      masteryTotals.set(competency.subject, current)
    }
    for (const [name, stat] of map) {
      const total = masteryTotals.get(name)
      stat.mastery = total && total.count ? total.sum / total.count : 0
      stat.focus = gapSubjects.includes(name)
    }
    if (gapSubjects.length === 0) {
      const lowest = [...map.values()].filter((item) => item.mastery > 0).sort((a, b) => a.mastery - b.mastery).slice(0, 3)
      lowest.forEach((item) => { item.focus = true })
    }
    return [...map.values()].sort((a, b) => Number(b.focus) - Number(a.focus) || b.mastery - a.mastery)
  }, [subjects, units, insights, gapSubjects, t])

  const focusStats = subjectStats.filter((item) => item.focus).slice(0, 4)
  const enrichmentStats = subjectStats.filter((item) => !item.focus).slice(0, 6)
  const completedAssignments = assignments.filter((item) => item.status === 'submitted' || item.status === 'graded').length
  const overallMastery = subjectStats.length
    ? subjectStats.reduce((sum, item) => sum + item.mastery, 0) / subjectStats.filter((item) => item.mastery > 0).length || 0
    : 0

  const filteredUnits = useMemo(() => {
    const query = search.trim().toLowerCase()
    return units.filter((item) => {
      if (subjectFilter && item.subject !== subjectFilter) return false
      if (!query) return true
      return [item.unit, item.subject, ...(item.lessons ?? [])].filter(Boolean).join(' ').toLowerCase().includes(query)
    })
  }, [units, subjectFilter, search])

  const activeLibraryTerm = libraryTerm || terms[0] || ''
  const libraryUnits = useMemo(
    () => filteredUnits.filter((item) => !activeLibraryTerm || (item.term ?? terms[0]) === activeLibraryTerm),
    [filteredUnits, activeLibraryTerm, terms],
  )

  const termPlan = useMemo(
    () =>
      terms.map((term) => {
        const termUnits = units.filter((item) => (item.term ?? terms[0]) === term)
        const lessons = termUnits.reduce((sum, item) => sum + (item.lessons?.length ?? 0), 0)
        const done = termUnits.reduce(
          (sum, item) =>
            sum +
            (item.lessons ?? []).filter((_, index) => progressByLesson.get(`${item.id}:${index}`)?.completed).length,
          0,
        )
        return { term, units: termUnits.length, lessons, done }
      }),
    [units, terms, progressByLesson],
  )

  // Server-provided lesson questions carry no correctIndex, so they are shown
  // as advisory practice. Only the offline bank is graded locally.
  const isGraded = remoteQuestions.length === 0

  const questions = useMemo<DisplayQuestion[]>(() => {
    if (remoteQuestions.length > 0) {
      return remoteQuestions.map((item) => ({
        prompt: item.prompt || '',
        options: Array.isArray(item.options) ? item.options : [],
      }))
    }
    const offline: PracticeQuestion[] = lesson ? questionsFor(lesson.subject, seedFrom(lesson.lessonId)) : []
    return offline.map((item) => ({
      prompt: item.prompt,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation,
      lang: item.lang,
    }))
  }, [lesson, remoteQuestions])

  // Play corner: term matching and one locally graded question, all strings
  // supplied by i18n so the same widgets serve ar/fr/en/amz learners.
  const matchPairs = (content?.keyTerms || [])
    .filter((term) => term.term && term.definition)
    .slice(0, 3)
    .map((term, index) => ({ id: `term-${index}`, left: term.term || '', right: term.definition || '' }))
  const practiceQuestion = isGraded && questions[0]?.answer !== undefined ? questions[0] : null
  const playSteps = 1 + (matchPairs.length ? 1 : 0) + (practiceQuestion ? 1 : 0)
  const playStep = 1 + (practiceRead ? 1 : 0) + (practiceMatched ? 1 : 0) + (practiceAnswered ? 1 : 0)
  const widgetDir: 'rtl' | 'ltr' = contentLang === 'ar' ? 'rtl' : 'ltr'

  const startQuiz = (selection: LessonSelection, mode: QuizMode = 'lesson') => {
    setLesson(selection)
    lessonFetchController.current?.abort()
    const controller = new AbortController()
    lessonFetchController.current = controller

    setRawContent(null)
    setRemoteQuestions([])
    setShowContent(false)

    const resume = readResume(selection.lessonId)
    setResumeAvailable(Boolean(resume))
    setQuiz({
      mode,
      index: resume?.index ?? 0,
      selected: null,
      correct: resume?.correct ?? 0,
      hearts: resume?.hearts ?? 3,
      finished: false,
      xp: 0,
      score: 0,
    })

    const lessonId = encodeURIComponent(selection.lessonId)
    void Promise.all([
      apiGet<{ content: LessonContent }>(`/student/lesson-contents/view?id=${lessonId}`, {
        signal: controller.signal,
      }).catch(() => null),
      apiGet<{ questions: RemoteQuestion[] }>(`/student/lesson-contents/questions?lessonId=${lessonId}`, {
        signal: controller.signal,
      }).catch(() => null),
    ]).then(([viewData, questionsData]) => {
      if (controller.signal.aborted) return
      const nextContent = viewData?.content ?? null
      if (
        nextContent &&
        (nextContent.sections?.length || nextContent.intro || nextContent.keyTerms?.length || nextContent.workedExamples?.length)
      ) {
        setRawContent(nextContent)
        setShowContent(true)
      }
      const remote = questionsData?.questions
      setRemoteQuestions(Array.isArray(remote) ? remote : [])
    })
  }

  const chooseAnswer = (index: number) => {
    if (!quiz || quiz.selected !== null || quiz.finished || quiz.hearts <= 0) return
    const isCorrect = isGraded ? index === questions[quiz.index]?.answer : true
    const hearts = quiz.hearts - (isGraded && !isCorrect ? 1 : 0)
    const next: QuizState = {
      ...quiz,
      selected: index,
      correct: quiz.correct + (isCorrect ? 1 : 0),
      hearts,
    }
    setQuiz(next)
    if (lesson) {
      if (hearts <= 0) clearResume(lesson.lessonId)
      else writeResume(lesson.lessonId, next, questions.length)
    }
  }

  const advanceQuiz = () => {
    if (!quiz || !lesson || quiz.selected === null) return
    if (quiz.index < questions.length - 1) {
      const next = { ...quiz, index: quiz.index + 1, selected: null }
      setQuiz(next)
      writeResume(lesson.lessonId, next, questions.length)
      return
    }
    const score = questions.length ? quiz.correct / questions.length : 0
    const xp = Math.round(10 + 20 * score + 10)
    setQuiz({ ...quiz, finished: true, score, xp })
    clearResume(lesson.lessonId)
    setResumeAvailable(false)
    void apiPost<ProgressPost>('/student/lessons/progress', {
      subjectId: lesson.subjectId,
      subject: lesson.subject,
      unitId: lesson.unitId,
      unit: lesson.unit,
      lessonId: lesson.lessonId,
      lesson: lesson.lesson,
      score,
      completed: score >= 0.6,
    })
      .then((response) => {
        setProgress(response.summary ?? {})
        setToast(t('lpProgressSaved', { defaultValue: 'تم حفظ تقدّمك في الدرس.' }))
      })
      .catch(() => setToast(t('lpProgressOffline', { defaultValue: 'تعذّر حفظ التقدّم؛ سيُعاد عند عودة الاتصال.' })))
  }

  const restartQuiz = () => {
    if (!quiz) return
    if (lesson) clearResume(lesson.lessonId)
    setResumeAvailable(false)
    setQuiz({ ...quiz, index: 0, selected: null, correct: 0, hearts: 3, finished: false, xp: 0, score: 0 })
  }

  const markRead = () => {
    const lessonId = lesson?.lessonId
    setPracticeRead(true)
    setShowContent(false)
    if (!lessonId) return
    void apiPost<{ ok: boolean; readAt?: string }>('/student/lesson-contents/view', { lessonId })
      .then(() => setToast(t('lpReadSaved', { defaultValue: 'تم حفظ قراءتك.' })))
      .catch(() => undefined)
  }

  const submitAssignment = (assignment: Assignment) => {
    void apiPost<{ ok: boolean; assignments: Assignment[] }>(`/student/assignments/${assignment.id}/submit`, {})
      .then((response) => {
        setAssignments(response.assignments ?? assignments.map((item) =>
          item.id === assignment.id ? { ...item, status: 'submitted', submittedAt: new Date().toISOString() } : item,
        ))
        setToast(t('lpAssignmentSubmitted', { defaultValue: 'تم تسليم الواجب.' }))
      })
      .catch(() => setToast(t('lpAssignmentFailed', { defaultValue: 'تعذّر تسليم الواجب. حاول مجددًا.' })))
  }

  const closeQuiz = () => {
    lessonFetchController.current?.abort()
    setQuiz(null)
    setLesson(null)
    setRawContent(null)
    setRemoteQuestions([])
    setShowContent(false)
    setResumeAvailable(false)
  }

  const statsCards: ReadonlyArray<{ label: string; value: string; icon: LucideIcon; tone: string; hint: string }> = [
    {
      label: t('lpXp', { defaultValue: 'نقاط التعلّم' }),
      value: String(progress.totalXp ?? 0),
      icon: Zap,
      tone: 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300',
      hint: t('lpXpHint', { defaultValue: 'تُكتسب من الدروس والتقييمات' }),
    },
    {
      label: t('lpStreak', { defaultValue: 'سلسلة الأيام' }),
      value: String(engagement.streakDays ?? 0),
      icon: Flame,
      tone: 'bg-[#FF4B4B]/10 text-[#E03131]',
      hint: t('lpStreakHint', { defaultValue: 'أيام متتالية داخل الفضاء الموازي' }),
    },
    {
      label: t('lpTodayTime', { defaultValue: 'وقتك اليوم' }),
      value: `${engagement.todayMinutes ?? 0} ${t('lpMinutes', { defaultValue: 'دقيقة' })}`,
      icon: Clock3,
      tone: 'bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300',
      hint: t('lpTimeHint', { defaultValue: 'منفصل عن حضور القسم' }),
    },
    {
      label: t('lpAssignmentsDone', { defaultValue: 'واجبات منجزة' }),
      value: `${completedAssignments}/${assignments.length}`,
      icon: ListChecks,
      tone: 'bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300',
      hint: t('lpAssignmentsHint', { defaultValue: 'من واجبات فصلك' }),
    },
  ]

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
              <Gamepad2 className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('lpBadge', { defaultValue: 'فضاء التعلّم التفاعلي' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('lpTitle', { defaultValue: 'تعلّمك، خطتك، إنجازاتك' })}
            </h1>
            <p className="mt-2 max-w-xl text-sm font-semibold text-white/85">
              {t('lpSubtitle', {
                defaultValue: 'دروس تفاعلية من نفس مناهجك، مع تقييم فوري ومسار إثرائي موازٍ ومتابعة لوقتك وواجباتك.',
              })}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1.5 text-[11px] font-black text-ink shadow-chunky-gold">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              {level || t('lpNoLevel', { defaultValue: 'مستواك الدراسي' })}
            </span>
            <button
              type="button"
              onClick={retry}
              disabled={status === 'loading'}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-black text-white transition hover:bg-white/25"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} aria-hidden="true" />
              {t('refresh', { defaultValue: 'تحديث' })}
            </button>
          </div>
        </div>
      </section>

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

      {status === 'ready' ? (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statsCards.map(({ label, value, icon: Icon, tone, hint }) => (
              <article key={label} className="card-school p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-extrabold text-muted">{label}</p>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${tone}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-2 font-display text-2xl font-black leading-none">{value}</p>
                <p className="mt-2 text-[10px] font-semibold text-muted">{hint}</p>
              </article>
            ))}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-card border-2 border-line bg-surface px-4 py-2">
            <nav aria-label={t('lpSections', { defaultValue: 'أقسام مسار التعلّم' })} className="flex flex-wrap gap-1">
              {TABS.map(({ key, labelKey, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-current={tab === key ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-black transition ${
                    tab === key
                      ? 'bg-brand-500 text-white shadow-chunky-sm'
                      : 'text-muted hover:bg-surface-muted hover:text-content'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {t(labelKey, { defaultValue: label })}
                </button>
              ))}
            </nav>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {engagement.note ?? t('lpTimeHint', { defaultValue: 'زمن المنصة منفصل عن حضور القسم' })}
            </p>
          </div>

          {toast ? (
            <p role="status" className="rounded-card border-2 border-brand-300 bg-brand-50 px-4 py-2 text-xs font-bold text-brand-800 dark:bg-brand-400/10 dark:text-brand-200">
              {toast}
            </p>
          ) : null}

          {/* ---------------------------- overview ---------------------------- */}
          {tab === 'overview' ? (
            <div className="space-y-4">
              <section className="card-school p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black text-brand-700 dark:text-brand-300">
                      {t('lpMastery', { defaultValue: 'إتقانك العام' })}
                    </p>
                    <p className="mt-1 text-2xl font-black">{percent(overallMastery)}</p>
                  </div>
                  <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-bold text-muted">
                    {insights?.classification ?? t('lpUnderReview', { defaultValue: 'قيد المراجعة التربوية' })}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: percent(overallMastery) }} />
                </div>
              </section>

              {focusStats.length > 0 ? (
                <section className="rounded-card-lg border-2 border-gold-400/40 bg-gold-400 p-5 text-ink shadow-chunky-gold">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5" aria-hidden="true" />
                    <h2 className="text-sm font-black">
                      {t('lpFocusTitle', { defaultValue: 'المواد التي تحتاج تركيزك الآن' })}
                    </h2>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-ink/75">
                    {insights?.learningPath?.focus ?? t('lpFocusHint', { defaultValue: 'بناءً على نتائج التقييم والتغذية الراجعة، بمراجعة المعلّم.' })}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {focusStats.map((stat) => (
                      <button
                        key={stat.id}
                        type="button"
                        onClick={() => {
                          setSubjectFilter(stat.name)
                          setTab('lessons')
                        }}
                        className="flex items-center justify-between gap-2 rounded-card bg-surface/85 px-3 py-2 text-start transition hover:bg-surface"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-black">{stat.name}</span>
                          <span className="block text-[10px] font-bold text-muted">
                            {stat.units} {t('unitsShort', { defaultValue: 'وحدة' })} · {percent(stat.mastery)}
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="card-school p-5">
                <h2 className="text-sm font-black">{t('lpSubjectsTitle', { defaultValue: 'كل موادك' })}</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {subjectStats.map((stat) => (
                    <button
                      key={stat.id}
                      type="button"
                      onClick={() => {
                        setSubjectFilter(stat.name)
                        setTab('lessons')
                      }}
                      className="rounded-card border-2 border-line bg-surface p-3 text-start transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-xs font-black">{stat.name}</p>
                        {stat.focus ? (
                          <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[9px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                            {t('lpFocusTag', { defaultValue: 'تركيز' })}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[10px] font-bold text-muted">
                        {stat.lessons} {t('lpLessonsShort', { defaultValue: 'درس تفاعلي' })}
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                        <div className="h-full rounded-full bg-brand-400" style={{ width: percent(stat.mastery) }} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {termPlan.length > 0 ? (
                <section className="card-school p-5">
                  <h2 className="text-sm font-black">{t('lpTermPlanTitle', { defaultValue: 'خطتك الفصلية' })}</h2>
                  <p className="mt-1 text-[11px] font-semibold text-muted">
                    {t('lpTermPlanHint', { defaultValue: 'توزيع وحدات منهاجك على الفصول الدراسية، مع تقدّمك في كل فصل.' })}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {termPlan.map((plan) => {
                      const rate = plan.lessons ? plan.done / plan.lessons : 0
                      return (
                        <article key={plan.term} className="rounded-card border-2 border-line bg-surface p-3">
                          <p className="text-xs font-black">{plan.term}</p>
                          <p className="mt-1 text-[10px] font-bold text-muted">
                            {plan.units} {t('unitsShort', { defaultValue: 'وحدة' })} · {plan.done}/{plan.lessons}{' '}
                            {t('lpLessonsShort', { defaultValue: 'درس' })}
                          </p>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                            <div className="h-full rounded-full bg-brand-400" style={{ width: percent(rate) }} />
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              ) : null}

              {insights?.learningPath?.nextSteps?.length ? (
                <section className="card-school p-5">
                  <h3 className="text-sm font-black">{t('nextSteps', { defaultValue: 'الخطوات التالية' })}</h3>
                  <ol className="mt-2 list-decimal space-y-1 pe-5 text-xs font-semibold text-muted">
                    {insights.learningPath.nextSteps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}
                  </ol>
                  {insights.learningPath.reassessDate ? (
                    <p className="mt-3 text-[11px] font-bold text-brand-700 dark:text-brand-300">
                      {t('reassessmentDate', { defaultValue: 'إعادة التقييم' })}: {insights.learningPath.reassessDate}
                    </p>
                  ) : null}
                </section>
              ) : null}
            </div>
          ) : null}

          {/* ---------------------------- lessons ---------------------------- */}
          {tab === 'lessons' ? (
            <div className="space-y-3">
              <section className="card-school p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-card border-2 border-line bg-surface px-3 py-2">
                    <Search className="h-4 w-4 text-muted" aria-hidden="true" />
                    <span className="sr-only">{t('search', { defaultValue: 'بحث' })}</span>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t('lpSearchLessons', { defaultValue: 'ابحث عن درس أو وحدة...' })}
                      className="w-full bg-transparent text-xs font-bold outline-none placeholder:text-muted"
                    />
                  </label>
                  <select
                    value={subjectFilter}
                    onChange={(event) => setSubjectFilter(event.target.value)}
                    aria-label={t('subjects', { defaultValue: 'المواد' })}
                    className="rounded-card border-2 border-line bg-surface px-3 py-2 text-xs font-bold"
                  >
                    <option value="">{t('lpAllSubjects', { defaultValue: 'كل المواد' })}</option>
                    {subjectStats.map((stat) => (
                      <option key={stat.id} value={stat.name}>{stat.name}</option>
                    ))}
                  </select>
                </div>
              </section>

              {filteredUnits.length === 0 ? (
                <p className="rounded-card border-2 border-line bg-surface p-5 text-xs font-bold text-muted">
                  {t('noData', { defaultValue: 'لا توجد دروس مطابقة.' })}
                </p>
              ) : null}

              {filteredUnits.map((item) => {
                const unitKey = item.id
                const isOpen = openUnit === unitKey
                const lessons = item.lessons ?? []
                return (
                  <section key={item.id} className="card-school overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenUnit(isOpen ? null : unitKey)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-3 p-4 text-start"
                    >
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${subjectTone(item.subject).dot}`}
                            aria-hidden="true"
                          />
                          <span className="block truncate text-sm font-black">{item.unit ?? item.id}</span>
                        </span>
                        <span className="mt-1 block text-[11px] font-bold text-muted">
                          {[item.subject, item.language].filter(Boolean).join(' • ')} · {lessons.length} {t('lpLessonsShort', { defaultValue: 'دروس' })}
                        </span>
                      </span>
                      {isOpen ? <ChevronLeft className="h-4 w-4 text-muted" aria-hidden="true" /> : <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />}
                    </button>
                    {isOpen ? (
                      <ul className="border-t-2 border-line bg-surface-muted/50 p-3">
                        {lessons.length === 0 ? (
                          <li className="p-2 text-[11px] font-semibold text-muted">{t('noData', { defaultValue: 'لا توجد دروس في هذه الوحدة.' })}</li>
                        ) : null}
                        {lessons.map((lessonName, index) => {
                          const id = `${item.id}:${index}`
                          const done = progressByLesson.get(id)
                          return (
                            <li key={id} className="flex items-center justify-between gap-3 rounded-card border-2 border-line bg-surface px-3 py-2">
                              <div className="flex min-w-0 items-center gap-2">
                                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${done?.completed ? 'bg-brand-100 text-brand-700' : 'bg-surface-muted text-muted'}`}>
                                  {done?.completed ? <Check className="h-4 w-4" aria-hidden="true" /> : <BookOpen className="h-4 w-4" aria-hidden="true" />}
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-xs font-black">{lessonName}</span>
                                  <span className="block text-[10px] font-bold text-muted">
                                    {done ? `${percent(done.score)} · ${done.xp ?? 0} XP` : t('lpNotStarted', { defaultValue: 'لم تبدأ بعد' })}
                                  </span>
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => startQuiz({
                                  subjectId: item.subjectId,
                                  subject: item.subject,
                                  unitId: item.id,
                                  unit: item.unit,
                                  lessonId: id,
                                  lesson: lessonName,
                                })}
                                className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
                              >
                                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                                {t('lpStart', { defaultValue: 'ابدأ' })}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    ) : null}
                  </section>
                )
              })}
            </div>
          ) : null}

          {/* --------------------------- assignments -------------------------- */}
          {tab === 'assignments' ? (
            <section className="card-school p-5">
              <h2 className="text-sm font-black">{t('lpAssignmentsTitle', { defaultValue: 'واجبات فصلك' })}</h2>
              <p className="mt-1 text-[11px] font-semibold text-muted">
                {t('lpAssignmentsHint2', { defaultValue: 'حالة التسليم هنا خاصة بالفضاء الموازي، ولا تُحتسب ضمن حضور القسم.' })}
              </p>
              {assignments.length === 0 ? (
                <p className="mt-4 text-xs font-bold text-muted">{t('noData', { defaultValue: 'لا توجد واجبات حاليًا.' })}</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {assignments.map((item) => {
                    const done = item.status === 'submitted' || item.status === 'graded'
                    return (
                      <li key={item.id} className="rounded-card border-2 border-line bg-surface p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-black">{item.title ?? item.id}</p>
                            <p className="mt-1 text-[11px] font-semibold text-muted">
                              {[item.subject, item.dueDate].filter(Boolean).join(' • ')}
                            </p>
                            {item.feedback ? (
                              <p className="mt-1 text-[11px] font-semibold text-brand-700 dark:text-brand-300">{item.feedback}</p>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${done ? 'bg-brand-100 text-brand-700' : 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'}`}>
                              {done ? t('lpSubmitted', { defaultValue: 'مُسلَّم' }) : t('lpPending', { defaultValue: 'قيد الانتظار' })}
                            </span>
                            {!done ? (
                              <button type="button" onClick={() => submitAssignment(item)} className="btn-chunky btn-chunky--sm">
                                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                {t('lpSubmit', { defaultValue: 'تسليم' })}
                              </button>
                            ) : null}
                          </div>
                        </div>
                        {typeof item.grade === 'number' ? (
                          <p className="mt-2 text-[11px] font-black text-gold-700 dark:text-gold-300">
                            {t('grade', { defaultValue: 'الدرجة' })}: {item.grade}
                          </p>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          ) : null}

          {/* ---------------------------- assessment -------------------------- */}
          {tab === 'assessment' ? (
            <section className="grid gap-4 lg:grid-cols-2">
              <div className="card-school p-5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-3 text-base font-black">{t('lpAssessmentTitle', { defaultValue: 'تقييم سريع' })}</h2>
                <p className="mt-2 text-xs font-semibold text-muted">
                  {t('lpAssessmentHint', { defaultValue: 'أسئلة قصيرة من مادة التركيز تساعدك على معرفة ما أتقنته وما يحتاج مراجعة.' })}
                </p>
                <div className="mt-4 rounded-card border-2 border-line bg-surface-muted p-3 text-[11px] font-bold text-muted">
                  {t('lpAssessmentNote', { defaultValue: 'النتيجة استرشادية للتعلّم فقط، ولا تُستخدم كدرجة رسمية دون مراجعة المعلّم.' })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const target = focusStats[0] ?? subjectStats[0]
                    const firstUnit = units.find((item) => !target || item.subject === target.name)
                    startQuiz({
                      subjectId: target?.id ?? firstUnit?.subjectId,
                      subject: target?.name ?? firstUnit?.subject,
                      unitId: firstUnit?.id,
                      unit: firstUnit?.unit,
                      lessonId: `assessment:${target?.id ?? 'general'}`,
                      lesson: t('lpAssessmentTitle', { defaultValue: 'تقييم سريع' }),
                    }, 'assessment')
                  }}
                  className="btn-chunky mt-4"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  {t('lpStartAssessment', { defaultValue: 'ابدأ التقييم' })}
                </button>
              </div>
              <div className="card-school p-5">
                <h3 className="text-sm font-black">{t('lpLastResults', { defaultValue: 'آخر نتائجك' })}</h3>
                {(progress.rows ?? []).length === 0 ? (
                  <p className="mt-3 text-xs font-bold text-muted">{t('noData', { defaultValue: 'لا توجد نتائج بعد.' })}</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {(progress.rows ?? []).slice(-5).reverse().map((row) => (
                      <li key={row.lessonId} className="flex items-center justify-between gap-2 rounded-card border-2 border-line bg-surface px-3 py-2">
                        <span className="min-w-0 truncate text-xs font-black">{row.lesson ?? row.lessonId}</span>
                        <span className="shrink-0 text-[11px] font-black text-brand-700 dark:text-brand-300">{percent(row.score)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ) : null}

          {/* ----------------------------- parallel --------------------------- */}
          {tab === 'parallel' ? (
            <div className="space-y-4">
              <section className="rounded-card-lg border-2 border-brand-300 bg-brand-50 p-5 dark:bg-brand-400/10">
                <div className="flex items-center gap-2 text-brand-800 dark:text-brand-200">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  <h2 className="text-sm font-black">{t('lpParallelTitle', { defaultValue: 'مسار إثرائي موازٍ' })}</h2>
                </div>
                <p className="mt-2 text-xs font-semibold text-brand-900/80 dark:text-brand-100/80">
                  {t('lpParallelHint', { defaultValue: 'بالإضافة إلى دروس فصلك، استكشف مواد أخرى تناسب مواهبك واهتماماتك. هذا التعلّم موازٍ ولا يُغني عن المنهج الرسمي.' })}
                </p>
              </section>

              {insights?.talents?.length ? (
                <section className="card-school p-5">
                  <h3 className="text-sm font-black">{t('lpTalentSignals', { defaultValue: 'إشارات مواهبك' })}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {insights.talents.map((talent, index) => (
                      <span key={`${talent.domain ?? 'talent'}-${index}`} className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[11px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                        <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                        {talent.domain ?? talent.skill ?? t('lpTalent', { defaultValue: 'موهبة' })}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {enrichmentStats.map((stat) => {
                  const unit = units.find((item) => item.subject === stat.name)
                  const lessonName = unit?.lessons?.[0] ?? t('lpExploratoryLesson', { defaultValue: 'درس استكشافي' })
                  return (
                    <article key={stat.id} className="card-school flex flex-col p-4">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                        <Star className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <h3 className="mt-3 text-xs font-black">{stat.name}</h3>
                      <p className="mt-1 text-[11px] font-bold text-muted">
                        {stat.units} {t('unitsShort', { defaultValue: 'وحدة' })} · {stat.lessons} {t('lpLessonsShort', { defaultValue: 'درس' })}
                      </p>
                      <button
                        type="button"
                        onClick={() => startQuiz({
                          subjectId: stat.id,
                          subject: stat.name,
                          unitId: unit?.id,
                          unit: unit?.unit,
                          lessonId: unit ? `${unit.id}:0` : `enrich:${stat.id}`,
                          lesson: lessonName,
                        })}
                        className="btn-chunky btn-chunky--secondary btn-chunky--sm mt-auto w-full"
                      >
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        {t('lpExplore', { defaultValue: 'استكشف' })}
                      </button>
                    </article>
                  )
                })}
              </section>
            </div>
          ) : null}

          {/* ----------------------------- library ---------------------------- */}
          {tab === 'library' ? (
            <section className="card-school p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-black">{t('lpLibraryTitle', { defaultValue: 'مكتبة المناهج والدروس' })}</h2>
                <span className="text-[11px] font-bold text-muted">
                  {libraryUnits.length} {t('unitsShort', { defaultValue: 'وحدة' })}
                </span>
              </div>
              {terms.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {terms.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setLibraryTerm(term)}
                      aria-pressed={activeLibraryTerm === term}
                      className={`rounded-full px-3 py-1 text-[11px] font-black transition ${
                        activeLibraryTerm === term
                          ? 'bg-brand-500 text-white shadow-chunky-sm'
                          : 'bg-surface-muted text-muted hover:text-content'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              ) : null}
              {samples.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {samples.map((sample, index) => (
                    <span key={`${sample.levelName}-${index}`} className="rounded-full bg-surface-muted px-3 py-1 text-[10px] font-black text-muted">
                      {sample.levelName}
                      {typeof sample.totalUnits === 'number' ? ` · ${sample.totalUnits}` : ''}
                    </span>
                  ))}
                </div>
              ) : null}
              <ul className="mt-4 space-y-2">
                {libraryUnits.map((item) => (
                  <li key={item.id} className="rounded-card border-2 border-line bg-surface p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-black">{item.unit ?? item.id}</p>
                        <p className="mt-1 text-[11px] font-bold text-muted">
                          {[item.subject, item.language].filter(Boolean).join(' • ')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const first = item.lessons?.[0] ?? item.unit ?? item.id
                          startQuiz({
                            subjectId: item.subjectId,
                            subject: item.subject,
                            unitId: item.id,
                            unit: item.unit,
                            lessonId: `${item.id}:0`,
                            lesson: first,
                          })
                        }}
                        className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                      >
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                        {t('lpOpen', { defaultValue: 'افتح' })}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}

      {/* --------------------------- lesson player --------------------------- */}
      {quiz && lesson ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-3 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={lesson.lesson}>
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-card-lg border-2 border-line bg-surface shadow-2xl animate-slide">
            <div className="flex items-start justify-between gap-3 border-b-2 border-line bg-brand-500 p-4 text-white">
              <img
                src={`${import.meta.env.BASE_URL}mascot-sun.svg`}
                alt=""
                aria-hidden="true"
                className="h-14 w-14 shrink-0 drop-shadow-md"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wide text-white/80">
                  {quiz.mode === 'assessment' ? t('lpAssessmentTitle', { defaultValue: 'تقييم سريع' }) : t('lpInteractiveLesson', { defaultValue: 'درس تفاعلي' })}
                </p>
                <h2 className="mt-1 truncate font-display text-lg font-black">{lesson.lesson}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-white/80">
                  {lesson.subject ? (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${subjectTone(lesson.subject).pill}`}>
                      {lesson.subject}
                    </span>
                  ) : null}
                  <span className="truncate">{lesson.unit}</span>
                </p>
                {content?.translations ? (
                  <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black">
                    <span aria-hidden="true">🌐</span>
                    <span className="opacity-80">{t('lpContentLanguage', { defaultValue: 'لغة المحتوى' })}:</span>
                    {contentLang === 'fr'
                      ? t('langFrench', { defaultValue: 'Français' })
                      : contentLang === 'en'
                        ? t('langEnglish', { defaultValue: 'English' })
                        : t('langArabic', { defaultValue: 'العربية' })}
                  </p>
                ) : null}
              </div>
              <button type="button" onClick={closeQuiz} aria-label={t('closeMenu', { defaultValue: 'إغلاق' })} className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/15 text-white transition hover:bg-white/25">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {content ? (
              <div className="flex gap-2 border-b-2 border-line bg-surface-muted px-4 py-2" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={showContent}
                  onClick={() => setShowContent(true)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-black transition ${
                    showContent ? 'bg-brand-500 text-white shadow-chunky-sm' : 'text-muted hover:text-content'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('lpReadStep', { defaultValue: 'المحتوى' })}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={!showContent}
                  onClick={() => setShowContent(false)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-black transition ${
                    !showContent ? 'bg-brand-500 text-white shadow-chunky-sm' : 'text-muted hover:text-content'
                  }`}
                >
                  <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('lpQuizStep', { defaultValue: 'الاختبار' })}
                </button>
              </div>
            ) : null}

            {showContent && content ? (
              <div className="space-y-4 p-4 sm:p-5">
                {content.intro ? (
                  <div className="flex items-start gap-3 rounded-card-lg border-2 border-brand-200 bg-brand-50 p-3 dark:bg-brand-400/10">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-xl shadow-chunky-sm dark:bg-surface" aria-hidden="true">🚀</span>
                    <p className="flex-1 text-xs font-bold leading-relaxed text-content">{content.intro}</p>
                    <SpeakButton text={content.intro} locale={speakLocale} contentLocale={contentLang} size="lg" />
                  </div>
                ) : null}
                <VoiceHelper />
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-black text-muted">
                  <div className="flex flex-wrap gap-2">
                    {typeof content.estimatedMinutes === 'number' && content.estimatedMinutes > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1">
                        <Clock3 className="h-3 w-3" aria-hidden="true" />
                        {content.estimatedMinutes} {t('lpMinutes', { defaultValue: 'دقيقة' })}
                      </span>
                    ) : null}
                    {content.difficulty ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1">
                        <Star className="h-3 w-3 text-gold-500" aria-hidden="true" />
                        {t(`lpLevel_${content.difficulty}`, { defaultValue: content.difficulty })}
                      </span>
                    ) : null}
                  </div>
                  <span className="inline-flex items-center gap-1" aria-label={t('lpSectionsCount', { defaultValue: 'عدد الأقسام' })}>
                    <BookOpen className="h-3 w-3" aria-hidden="true" />
                    {content.sections?.length ?? 0} {t('lpSections', { defaultValue: 'أقسام' })}
                  </span>
                </div>
                {content.sections?.length ? (
                  <div className="space-y-3">
                    {content.sections.map((section, sectionIndex) => (
                      <article
                        key={section.id ?? sectionIndex}
                        className={`relative overflow-hidden rounded-card-lg border-2 p-4 shadow-chunky-sm transition hover:-translate-y-0.5 ${
                          sectionIndex % 2 === 0
                            ? 'border-brand-200 bg-brand-50/70 dark:bg-brand-400/10'
                            : 'border-gold-200 bg-gold-50/70 dark:bg-gold-400/10'
                        }`}
                      >
                        <span className="absolute -start-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-white/70 text-[11px] font-black text-brand-700 shadow-sm dark:bg-surface/70">
                          {sectionIndex + 1}
                        </span>
                        <div className="flex items-start gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-chunky-sm dark:bg-surface" aria-hidden="true">
                            {section.icon || '📚'}
                          </span>
                          <div className="min-w-0 flex-1">
                            {section.heading ? <h3 className="text-sm font-black text-content">{section.heading}</h3> : null}
                            {section.body ? (
                              <p className="mt-1.5 whitespace-pre-line text-xs font-semibold leading-relaxed text-muted">{section.body}</p>
                            ) : null}
                          </div>
                          <SpeakButton
                            text={[section.heading, section.body].filter(Boolean).join('. ')}
                            locale={speakLocale}
                            contentLocale={contentLang}
                            size="md"
                            label={t('speakSection', { defaultValue: 'استمع إلى هذا القسم' })}
                          />
                        </div>
                        {section.mediaType === 'image' && section.mediaUrl ? (
                          <img
                            src={section.mediaUrl}
                            alt={section.heading ?? ''}
                            className="mt-3 aspect-video w-full rounded-card border-2 border-line bg-surface object-contain"
                            loading="lazy"
                          />
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-card border-2 border-line bg-surface p-3 text-xs font-bold text-muted">
                    {t('lpNoContent', { defaultValue: 'لا يوجد محتوى متاح لهذا الدرس.' })}
                  </p>
                )}
                {content.keyTerms?.length ? (
                  <section className="rounded-card-lg border-2 border-line bg-surface-muted p-4">
                    <h3 className="flex items-center gap-2 text-sm font-black">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-lg dark:bg-surface" aria-hidden="true">🔑</span>
                      <BookOpenCheck className="hidden h-4 w-4" aria-hidden="true" />
                      {t('lpKeyTerms', { defaultValue: 'المصطلحات الأساسية' })}
                    </h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {content.keyTerms.map((term, termIndex) => (
                        <li key={termIndex} className="flex items-start gap-2 rounded-card border-2 border-line bg-surface p-3">
                          <div className="min-w-0 flex-1 text-[11px] font-semibold leading-relaxed">
                            <span className="font-black text-brand-700">{term.term}</span>
                            {term.definition ? <span className="text-muted"> — {term.definition}</span> : null}
                          </div>
                          <SpeakButton
                            text={[term.term, term.definition].filter(Boolean).join('. ')}
                            locale={speakLocale}
                            contentLocale={contentLang}
                            size="md"
                            label={t('speakTerm', { defaultValue: 'استمع إلى المصطلح' })}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                {content.workedExamples?.length ? (
                  <section className="space-y-2">
                    <h3 className="flex items-center gap-2 text-sm font-black">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gold-100 text-lg dark:bg-gold-400/10" aria-hidden="true">💡</span>
                      <Lightbulb className="hidden h-4 w-4" aria-hidden="true" />
                      {t('lpWorkedExamples', { defaultValue: 'أمثلة محلولة' })}
                    </h3>
                    {content.workedExamples.map((example, exampleIndex) => (
                      <article key={example.id ?? exampleIndex} className="card-school border-gold-200 bg-gold-50/60 p-4 dark:bg-gold-400/10">
                        <div className="flex items-start gap-2">
                          {example.prompt ? <p className="flex-1 text-xs font-black leading-relaxed">{example.prompt}</p> : null}
                          <SpeakButton
                            text={[example.prompt, ...(example.steps || []), example.answer].filter(Boolean).join('. ')}
                            locale={speakLocale}
                            contentLocale={contentLang}
                            size="md"
                            label={t('speakExample', { defaultValue: 'استمع إلى المثال' })}
                          />
                        </div>
                        {example.steps?.length ? (
                          <ol className="mt-3 space-y-2">
                            {example.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-center gap-2 rounded-card bg-surface px-3 py-2 text-[11px] font-semibold leading-relaxed text-muted">
                                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500 text-[10px] font-black text-white">{stepIndex + 1}</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        ) : null}
                        {example.answer ? (
                          <p className="mt-3 rounded-card border-2 border-brand-300 bg-surface p-2 text-center text-sm font-black text-brand-700">
                            {t('lpSolution', { defaultValue: 'الحل' })}: {example.answer}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </section>
                ) : null}
              <section
                className="space-y-3 rounded-card-lg border-2 border-brand-200 bg-white p-4 shadow-card dark:bg-surface sm:p-5"
                aria-label={t('lpInteractiveTitle', { defaultValue: 'تدرّب والعب' })}
              >
                <h3 className="flex items-center gap-2 text-sm font-black text-content">
                  <img
                    src={`${import.meta.env.BASE_URL}illustrations/mascot-thinking.svg`}
                    alt=""
                    className="h-9 w-9"
                    aria-hidden="true"
                  />
                  <Gamepad2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  {t('lpInteractiveTitle', { defaultValue: 'تدرّب والعب' })}
                </h3>
                <StarProgress
                  total={playSteps}
                  current={playStep}
                  dir={widgetDir}
                  labels={{
                    track: t('lpProgressTrack', { defaultValue: 'تقدّم الدرس' }),
                    star: (step) => t('lpProgressStep', { defaultValue: 'الخطوة {{step}}', step }),
                    current: t('lpProgressHere', { defaultValue: 'أنت هنا' }),
                    reward: t('lpProgressReward', { defaultValue: 'أحسنت! أكملت الدرس' }),
                  }}
                />
                {matchPairs.length >= 2 ? (
                  <MatchPairsGame
                    pairs={matchPairs}
                    dir={widgetDir}
                    labels={{
                      title: t('lpMatchTitle', { defaultValue: 'طابق المصطلح بتعريفه' }),
                      left: t('lpTerm', { defaultValue: 'المصطلح' }),
                      right: t('lpDefinition', { defaultValue: 'التعريف' }),
                      moves: t('lpMoves', { defaultValue: 'المحاولات' }),
                      replay: t('lpReplay', { defaultValue: 'إعادة' }),
                    }}
                    feedback={{
                      correct: t('lpMatchCorrect', { defaultValue: 'أحسنت، مطابقة صحيحة!' }),
                      wrong: t('lpMatchWrong', { defaultValue: 'حاول مرة أخرى' }),
                    }}
                    doneMessage={t('lpMatchDone', { defaultValue: 'رائع! أكملت جميع الأزواج' })}
                    onComplete={() => setPracticeMatched(true)}
                  />
                ) : null}
                {practiceQuestion ? (
                  <div>
                    <h4 className="mb-2 text-xs font-black text-content">
                      {t('lpQuickPractice', { defaultValue: 'تطبيق سريع' })}
                    </h4>
                    <QuickQuiz
                      question={practiceQuestion.prompt}
                      options={practiceQuestion.options.map((option, index) => ({ id: String(index), label: option }))}
                      correctId={String(practiceQuestion.answer)}
                      explanation={practiceQuestion.explanation || ''}
                      dir={widgetDir}
                      streakLabel={t('lpStreak', { defaultValue: 'سلسلة' })}
                      continueLabel={t('lpContinue', { defaultValue: 'متابعة' })}
                      correctLabel={t('lpCorrect', { defaultValue: 'إجابة صحيحة' })}
                      incorrectLabel={t('lpIncorrect', { defaultValue: 'إجابة غير صحيحة' })}
                      onAnswered={() => setPracticeAnswered(true)}
                    />
                  </div>
                ) : null}
                <img
                  src={`${import.meta.env.BASE_URL}illustrations/${
                    playStep > playSteps ? 'mascot-celebrate' : 'mascot-thinking'
                  }.svg`}
                  alt={playStep > playSteps ? t('lpProgressReward', { defaultValue: 'أحسنت! أكملت الدرس' }) : ''}
                  className={`mx-auto ${playStep > playSteps ? 'h-20 w-20' : 'h-16 w-16'}`}
                  aria-hidden={playStep <= playSteps}
                />
              </section>
                <button type="button" onClick={markRead} className="btn-chunky w-full py-3 text-sm">
                  <span aria-hidden="true">🎉</span>
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  {t('lpMarkRead', { defaultValue: 'تمت القراءة' })}
                </button>
              </div>
            ) : null}

            {!showContent && !content && questions.length > 0 && !quiz.finished ? (
              <p className="mx-5 mt-3 rounded-card border-2 border-line bg-surface-muted p-2 text-[10px] font-semibold leading-relaxed text-muted">
                {t('lpContentFallback', { defaultValue: 'سيتم استخدام تمرين تدريبي متاح دون اتصال.' })}
              </p>
            ) : null}

            {!showContent && resumeAvailable && !quiz.finished && quiz.hearts > 0 ? (
              <div className="mx-5 mt-3 flex flex-wrap items-center justify-between gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-3 dark:bg-gold-400/10">
                <p className="text-[11px] font-black text-gold-900 dark:text-gold-200">
                  {t('lpResumePrompt', { defaultValue: 'لديك تقدّم محفوظ في هذا الدرس.' })}
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setResumeAvailable(false)} className="btn-chunky btn-chunky--sm">
                    {t('lpResume', { defaultValue: 'متابعة' })}
                  </button>
                  <button type="button" onClick={restartQuiz} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
                    {t('lpRestart', { defaultValue: 'إعادة' })}
                  </button>
                </div>
              </div>
            ) : null}

            {!showContent && !quiz.finished && quiz.hearts > 0 && questions.length > 0 ? (
              <div className="p-5">
                <div className="flex items-center justify-between gap-3 text-[11px] font-black text-muted">
                  <span>
                    {t('lpQuestion', { defaultValue: 'السؤال' })} {quiz.index + 1} / {questions.length}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#E03131]">
                    <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                    {quiz.hearts}
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-brand-500 transition-all"
                    style={{ width: `${((quiz.index + (quiz.selected !== null ? 1 : 0)) / questions.length) * 100}%` }}
                  />
                </div>
                <div className="mt-5 flex items-start gap-3">
                  <h3 className="flex-1 text-base font-black leading-relaxed">{questions[quiz.index]?.prompt}</h3>
                  <SpeakButton
                    text={questions[quiz.index]?.prompt}
                    locale={speakLocale}
                    contentLocale={questions[quiz.index]?.lang}
                    label={t('speakQuestion', { defaultValue: 'استمع إلى السؤال' })}
                    size="md"
                  />
                </div>
                <div className="mt-4 grid gap-2">
                  {questions[quiz.index]?.options.map((option, index) => {
                    const isSelected = quiz.selected === index
                    const isAnswer = isGraded && quiz.selected !== null && index === questions[quiz.index]?.answer
                    const isWrong = isGraded && isSelected && !isAnswer
                    return (
                      <button
                        key={`${option}-${index}`}
                        type="button"
                        disabled={quiz.selected !== null}
                        onClick={() => chooseAnswer(index)}
                        className={`flex items-center justify-between gap-3 rounded-card border-2 px-4 py-3 text-start text-xs font-black transition ${
                          isAnswer
                            ? 'border-brand-500 bg-brand-50 text-brand-800 dark:bg-brand-400/10 dark:text-brand-200'
                            : isWrong
                              ? 'border-[#E03131]/50 bg-[#E03131]/5 text-[#E03131]'
                              : 'border-line bg-surface hover:border-brand-300'
                        }`}
                      >
                        <span>{option}</span>
                        {isAnswer ? <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
                        {isWrong ? <X className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
                      </button>
                    )
                  })}
                </div>
                {quiz.selected !== null ? (
                  <div className="mt-4 rounded-card border-2 border-line bg-surface-muted p-3">
                    {isGraded && questions[quiz.index]?.explanation ? (
                      <p className="text-[11px] font-bold leading-relaxed text-muted">
                        {questions[quiz.index].explanation}
                      </p>
                    ) : (
                      <p className="text-[11px] font-bold leading-relaxed text-muted">
                        {t('lpAssessmentNote', { defaultValue: 'النتيجة استرشادية للتعلّم فقط، ولا تُستخدم كدرجة رسمية دون مراجعة المعلّم.' })}
                      </p>
                    )}
                    <button type="button" onClick={advanceQuiz} className="btn-chunky mt-3 w-full">
                      {quiz.index < questions.length - 1
                        ? t('lpNext', { defaultValue: 'السؤال التالي' })
                        : t('lpFinish', { defaultValue: 'إنهاء الدرس' })}
                      <ArrowRight className="h-4 w-4 directional-icon" aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            {!showContent && quiz.hearts <= 0 && !quiz.finished ? (
              <div className="p-6 text-center">
                <RotateCcw className="mx-auto h-8 w-8 text-gold-600" aria-hidden="true" />
                <h3 className="mt-3 text-sm font-black">{t('lpTryAgain', { defaultValue: 'لنحاول من جديد' })}</h3>
                <p className="mt-1 text-[11px] font-semibold text-muted">{t('lpTryAgainHint', { defaultValue: 'لا بأس، كل محاولة تعلّمك شيئًا جديدًا.' })}</p>
                <button type="button" onClick={restartQuiz} className="btn-chunky mt-4">{t('lpRetryLesson', { defaultValue: 'إعادة الدرس' })}</button>
              </div>
            ) : null}

            {!showContent && quiz.finished ? (
              <div className="p-6 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300">
                  <Award className="h-8 w-8" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-black">{t('lpWellDone', { defaultValue: 'أحسنت!' })}</h3>
                <p className="mt-1 text-xs font-bold text-muted">
                  {t('lpResult', { defaultValue: 'أجبت بشكل صحيح عن {{correct}} من {{total}} أسئلة.' , correct: quiz.correct, total: questions.length })}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                    <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                    +{quiz.xp} XP
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1.5 text-xs font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    {percent(quiz.score)}
                  </span>
                </div>
                <button type="button" onClick={closeQuiz} className="btn-chunky mt-5 w-full">
                  {t('lpBackToPath', { defaultValue: 'العودة إلى مساري' })}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
