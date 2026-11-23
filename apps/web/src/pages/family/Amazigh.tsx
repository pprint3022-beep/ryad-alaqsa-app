import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Check, Mic, Sparkles, Volume2 } from 'lucide-react'
import {
  LESSONS,
  STAGES,
  formatDuration,
  lessonsForStage,
  type Lesson,
  type Stage,
} from '../../data/amzCurriculum'
import AmazighExtras from './AmazighExtras'
import AmazighWordCards from './AmazighWordCards'

const PROGRESS_KEY = 'ryad-amz-full-progress'

interface LessonPortfolioItem {
  type: 'draw' | 'voice'
  data: string
  label: string
  time: number
}

function savePortfolio(item: LessonPortfolioItem) {
  try {
    const list = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([item, ...list].slice(0, 12)))
    window.dispatchEvent(new Event('ryad-amz-portfolio'))
  } catch {
    // Storage may be full or blocked — the activity still works.
  }
}

interface RecordingPracticeProps {
  lesson: Lesson
}

function RecordingPractice({ lesson }: RecordingPracticeProps) {
  const { t } = useTranslation()
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const chunks = useRef<Blob[]>([])
  const lastBlob = useRef<Blob | null>(null)

  useEffect(() => {
    return () => {
      if (recorder.current?.state === 'recording') recorder.current.stop()
      stream.current?.getTracks().forEach((track) => track.stop())
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [])

  const start = async () => {
    setError(false)
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.current = media
      chunks.current = []
      const next = new MediaRecorder(media)
      next.ondataavailable = (event) => { if (event.data.size > 0) chunks.current.push(event.data) }
      next.onstop = () => {
        const blob = new Blob(chunks.current, { type: next.mimeType || 'audio/webm' })
        lastBlob.current = blob
        if (audioUrl) URL.revokeObjectURL(audioUrl)
        setAudioUrl(URL.createObjectURL(blob))
        media.getTracks().forEach((track) => track.stop())
      }
      recorder.current = next
      next.start()
      setRecording(true)
    } catch {
      setError(true)
    }
  }

  const stop = () => {
    if (recorder.current && recorder.current.state !== 'inactive') recorder.current.stop()
    setRecording(false)
  }

  return (
    <div className="mt-4 rounded-card border-2 border-gold-200 bg-gold-50 p-4 dark:bg-gold-400/10">
      <h4 className="text-sm font-black text-gold-900 dark:text-gold-200">
        {t('amzSpeakTitle', { defaultValue: 'Speak' })}
      </h4>
      <p className="mt-1 text-[11px] font-semibold leading-relaxed text-muted">
        {t('amzSpeakHint', { defaultValue: 'Listen and record' })}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={recording ? stop : start}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl px-5 text-sm font-black text-white outline-none hover:bg-brand-50 focus-visible:ring-4 focus-visible:ring-brand-300"
        >
          <Mic className="h-4 w-4" aria-hidden="true" />
          {recording
            ? t('amzStop', { defaultValue: 'Stop' })
            : t('amzRecord', { defaultValue: 'Record' })}
        </button>
        {recording ? (
          <span className="text-xs font-black text-gold-800 dark:text-gold-200">
            {t('amzRecording', { defaultValue: 'Recording...' })}
          </span>
        ) : null}
        {error ? (
          <span className="text-xs font-black text-gold-900" role="alert">
            {t('amzMicError', { defaultValue: 'Mic error' })}
          </span>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-[10px] font-black text-brand-700 dark:text-brand-300">
            {t('amzTeachersVoice', { defaultValue: 'Teacher voice' })}
          </p>
          <audio controls preload="none" src={lesson.audio} className="w-full" aria-label={t('amzTeachersVoice', { defaultValue: 'Teacher voice' })} />
        </div>
        {audioUrl ? (
          <div>
            <p className="mb-1 text-[10px] font-black text-gold-800 dark:text-gold-200">
              {t('amzYourVoice', { defaultValue: 'Your voice' })}
            </p>
            <audio controls src={audioUrl} className="w-full" aria-label={t('amzYourVoice', { defaultValue: 'Your voice' })} />
            <button
              type="button"
              onClick={() => {
                const blob = lastBlob.current
                if (!blob) return
                const reader = new FileReader()
                reader.onload = () =>
                  savePortfolio({
                    type: 'voice',
                    data: String(reader.result),
                    label: t('amzMyVoice', { defaultValue: 'My voice' }) + ' — ' + lesson.titleAr,
                    time: Date.now(),
                  })
                reader.readAsDataURL(blob)
              }}
              className="mt-2 min-h-11 rounded-xl bg-gold-400 px-4 text-[11px] font-black text-white outline-none focus-visible:ring-4 focus-visible:ring-gold-300"
            >
              {t('amzSavePortfolio', { defaultValue: 'Save' })}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

interface LetterTracingProps {
  letters: string[]
}

function LetterTracing({ letters }: LetterTracingProps) {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)
  const size = useRef({ width: 280, height: 220 })

  const setup = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    size.current = { width: rect.width, height: rect.height }
    canvas.width = Math.max(1, Math.round(rect.width * dpr))
    canvas.height = Math.max(1, Math.round(rect.height * dpr))
    const context = canvas.getContext('2d')
    if (!context) return
    context.scale(dpr, dpr)
    context.lineWidth = 12
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = '#0f766e'
  }

  useEffect(() => {
    setup()
  }, [active])

  const point = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const onDown = (event: any) => {
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drawing.current = true
    const { x, y } = point(event)
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + 0.1, y + 0.1)
    context.stroke()
  }

  const onMove = (event: any) => {
    if (!drawing.current) return
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    const { x, y } = point(event)
    context.lineTo(x, y)
    context.stroke()
  }

  const onUp = () => {
    drawing.current = false
  }

  const clear = () => {
    const context = canvasRef.current?.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, size.current.width, size.current.height)
  }

  return (
    <div className="mt-4 rounded-card border-4 border-brand-200 bg-brand-50 p-4 dark:bg-brand-400/10">
      <h3 className="text-sm font-black text-brand-800 dark:text-brand-200">
        {t('amzWritingTitle', { defaultValue: 'Writing' })}
      </h3>
      <p className="mt-1 text-[11px] font-semibold leading-relaxed text-muted">
        {t('amzWritingHint', { defaultValue: 'Trace the letter' })}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {letters.map((letter, index) => (
          <button
            key={letter}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            className="grid h-14 w-14 place-items-center rounded-2xl border-4 border-line bg-surface font-display text-2xl font-black text-content outline-none hover:border-brand-300 focus-visible:ring-4 focus-visible:ring-brand-300"
          >
            {letter}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-start gap-4">
        <div className="relative h-56 w-72 max-w-full overflow-hidden rounded-card border-4 border-dashed border-brand-300 bg-white">
          <span
            className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[170px] font-black leading-none"
            style={{ color: 'transparent', WebkitTextStroke: '3px rgba(15,118,110,.45)' }}
            lang="zgh"
            dir="ltr"
            aria-hidden="true"
          >
            {letters[active]}
          </span>
          <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-emerald-200" aria-hidden="true" />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            aria-label={t('amzWritingCanvas', { defaultValue: 'Canvas' })}
          />
        </div>
        <div className="flex-1">
          <ol className="list-inside list-decimal space-y-1 text-[11px] font-semibold leading-relaxed text-muted">
            <li>{t('amzWritingStep1', { defaultValue: 'Step 1' })}</li>
            <li>{t('amzWritingStep2', { defaultValue: 'Step 2' })}</li>
            <li>{t('amzWritingStep3', { defaultValue: 'Step 3' })}</li>
          </ol>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clear}
              className="min-h-12 rounded-2xl border-2 border-brand-300 bg-surface px-4 text-xs font-black text-brand-700 outline-none hover:bg-brand-50 focus-visible:ring-4 focus-visible:ring-brand-300 dark:text-brand-300"
            >
              {t('amzWritingClear', { defaultValue: 'Clear' })}
            </button>
            <button
              type="button"
              onClick={() => {
                const canvas = canvasRef.current
                if (!canvas) return
                savePortfolio({
                  type: 'draw',
                  data: canvas.toDataURL('image/png'),
                  label: t('amzWritingSaved', { defaultValue: 'Saved' }) + ' — ' + letters[active],
                  time: Date.now(),
                })
              }}
              className="min-h-12 rounded-2xl bg-gold-400 px-4 text-xs font-black text-white outline-none hover:bg-gold-500 focus-visible:ring-4 focus-visible:ring-gold-300"
            >
              {t('amzSavePortfolio', { defaultValue: 'Save' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface LessonPlayerProps {
  lesson: Lesson
  completed: boolean
  onBack: () => void
  onComplete: () => void
  onNext: () => void
}

function LessonPlayer({
  lesson,
  completed,
  onBack,
  onComplete,
  onNext,
}: LessonPlayerProps) {
  const { t } = useTranslation()
  const [tab] = useState<'lesson' | 'practice' | 'speak'>('lesson')
  const [answers, setAnswers] = useState<Record<number, number>>({})

  return (
    <div className="space-y-4 animate-slide motion-reduce:animate-none">
      <section className="card-school p-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-line bg-surface px-3 py-2 text-xs font-black text-content outline-none hover:border-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          {t('amzLessonBack', { defaultValue: 'Back' })}
        </button>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[10px] font-black text-gold-900 dark:bg-gold-400/15 dark:text-gold-200">
              <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
              {t('amzHumanLesson', { defaultValue: 'Human lesson' })}
            </p>
            <h2 className="font-display text-xl font-black text-content">
              {lesson.titleAr}
            </h2>
            <p className="mt-1 font-display text-base font-black text-brand-700 dark:text-brand-300" lang="zgh" dir="ltr">
              {lesson.titleTz}
            </p>
          </div>
          <span className="rounded-full bg-surface-muted px-3 py-1 text-[10px] font-black text-muted">
            {formatDuration(lesson.seconds)}
          </span>
        </div>
      </section>

      {tab === 'lesson' ? (
        <section className="card-school p-5">
          <div className="relative">
            <img
              src={lesson.image}
              alt={lesson.titleAr}
              className="h-48 w-full rounded-card border-2 border-line object-cover"
            />
            <span className="absolute bottom-2 start-2 rounded-full bg-surface/90 px-2 py-1 text-[9px] font-black text-content shadow-sm">
              {t('amzRealPhoto', { defaultValue: 'Real photo' })}
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-content">
            {lesson.intro}
          </p>
          <div className="mt-4 rounded-card border-2 border-brand-200 bg-brand-50 p-4 dark:bg-brand-400/10">
            <h3 className="text-sm font-black text-brand-800 dark:text-brand-200">
              {t('amzListenHuman', { defaultValue: 'Listen' })}
            </h3>
            <p className="mt-1 text-[11px] font-semibold text-muted">
              {t('amzListenHumanHint', { defaultValue: 'Human audio bundled' })}
            </p>
            <audio controls preload="none" src={lesson.audio} className="mt-3 w-full" aria-label={lesson.titleAr} />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-black text-content">
              {t('amzHowTitle', { defaultValue: 'How to learn' })}
            </h3>
            <ol className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { emoji: '🎧', ar: t('amzHowStep1', { defaultValue: 'Listen twice' }) },
                { emoji: '👀', ar: t('amzHowStep2', { defaultValue: 'Look and speak' }) },
                { emoji: '🗣️', ar: t('amzHowStep3', { defaultValue: 'Repeat and exercise' }) },
              ].map((step, index) => (
                <li key={step.ar} className="rounded-card border-2 border-line bg-surface p-3">
                  <span className="text-2xl" aria-hidden="true">{step.emoji}</span>
                  <p className="mt-1 text-[11px] font-black text-content">
                    <span className="text-brand-600">{index + 1} — </span>{step.ar}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-black text-content">
              {t('amzObjectives', { defaultValue: 'Objectives' })}
            </h3>
            <ul className="mt-2 space-y-1.5">
              {lesson.objectives.map((objective) => (
                <li key={objective} className="flex items-start gap-2 text-xs font-semibold text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-black text-content">
              {t('amzKeyTerms', { defaultValue: 'Key terms' })}
            </h3>
            <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {lesson.terms.map((term) => (
                <li key={term.tz} className="flex items-center gap-3 rounded-card border-2 border-line bg-surface p-2.5">
                  <span className="font-display text-base font-black" lang="zgh" dir="ltr">
                    {term.tz}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-black text-content">
                      {term.ar}
                    </span>
                    {term.latin ? (
                      <span className="block text-[10px] font-bold text-muted">
                        {term.latin}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 rounded-card border-2 border-gold-200 bg-gold-50 p-4 dark:bg-gold-400/10">
            <h3 className="text-sm font-black text-gold-900 dark:text-gold-200">
              {t('amzExplanation', { defaultValue: 'Explanation' })}
            </h3>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-content">
              {lesson.explanation}
            </p>
          </div>
          {lesson.letters ? <LetterTracing letters={lesson.letters} /> : null}
        </section>
      ) : null}

      {tab === 'practice' ? (
        <section className="card-school p-5">
          <h3 className="text-sm font-black text-content">
            {t('amzTabExercises', { defaultValue: 'Exercises' })}
          </h3>
          <p className="mt-1 text-[11px] font-semibold text-muted">
            {t('amzPracticeHint', { defaultValue: 'No scores' })}
          </p>
          <ol className="mt-4 space-y-4">
            {lesson.questions.map((question, index) => {
              const chosen = answers[index]
              const answered = typeof chosen === 'number'
              const isCorrect = answered && chosen === question.answer
              return (
                <li key={question.q} className="rounded-card border-2 border-line bg-surface p-4">
                  <p className="text-sm font-black text-content">
                    {t('amzQuestionNumber', { n: index + 1, defaultValue: 'Question {{n}}' })} — {question.q}
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setAnswers((current) => ({ ...current, [index]: optionIndex }))
                        }
                        aria-pressed={chosen === optionIndex}
                        className="min-h-12 rounded-card border-2 px-3 py-2 text-xs font-black outline-none focus-visible:ring-2 focus-visible:ring-brand-500 border-brand-500 bg-brand-50 text-brand-800 dark:bg-brand-400/15 dark:text-brand-200 border-gold-400 bg-gold-50 text-gold-900 dark:bg-gold-400/10 dark:text-gold-200 border-line bg-surface text-content hover:border-brand-300"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {answered ? (
                    <p className="mt-2 text-xs font-black {isCorrect ? 'text-brand-700 dark:text-brand-300' : 'text-gold-800 dark:text-gold-200'}">
                      {isCorrect
                        ? t('amzCorrectAnswer', { defaultValue: 'Correct!' })
                        : t('amzWrongAnswer', { defaultValue: 'Wrong try again' })}
                      <span className="mt-1 block font-semibold text-muted">
                        {t('amzWhy', { defaultValue: 'Why?' })} {question.why}
                      </span>
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ol>
        </section>
      ) : null}

      {tab === 'speak' ? (
        <section className="card-school p-5">
          <h3 className="text-sm font-black text-content">
            {t('amzSpeakTitle', { defaultValue: 'Speak' })}
          </h3>
          <RecordingPractice lesson={lesson} />
        </section>
      ) : null}

      <section className="card-school flex flex-wrap items-center gap-3 p-4">
        <button
          type="button"
          onClick={onComplete}
          disabled={completed}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-500 px-5 text-sm font-black text-white outline-none hover:bg-brand-600 disabled:bg-surface-muted disabled:text-muted focus-visible:ring-4 focus-visible:ring-brand-300"
        >
          {completed ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          )}
          {completed ? t('amzLessonFinished', { defaultValue: 'Finished' }) : t('amzFinishLesson', { defaultValue: 'Done' })}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl border-2 border-brand-300 bg-surface px-5 text-sm font-black text-brand-700 outline-none hover:bg-brand-50 focus-visible:ring-4 focus-visible:ring-brand-300 dark:text-brand-300"
        >
          {t('amzNextLesson', { defaultValue: 'Next' })}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  )
}

export default function Amazigh() {
  const { t } = useTranslation()
  const [openLessonId, setOpenLessonId] = useState<string | null>(null)
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '[]')
      return Array.isArray(stored)
        ? stored.filter((id): id is string => typeof id === 'string')
        : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed))
    } catch {
      // Storage may be unavailable; the course still works for this visit.
    }
  }, [completed])

  const openLesson = LESSONS.find((lesson) => lesson.id === openLessonId) || null
  const currentIndex = openLesson
    ? LESSONS.findIndex((lesson) => lesson.id === openLesson.id)
    : -1
  const nextLesson = LESSONS[Math.min(currentIndex + 1, LESSONS.length - 1)]

  const complete = (id: string) => {
    setCompleted((current) => (current.includes(id) ? current : [...current, id]))
  }

  if (openLesson) {
    return (
      <LessonPlayer
        lesson={openLesson}
        completed={completed.includes(openLesson.id)}
        onBack={() => setOpenLessonId(null)}
        onComplete={() => complete(openLesson.id)}
        onNext={() => setOpenLessonId(nextLesson.id)}
      />
    )
  }

  return (
    <div className="space-y-5 animate-slide motion-reduce:animate-none">
      <section className="card-school overflow-hidden p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[10px] font-black text-gold-900 dark:bg-gold-400/15 dark:text-gold-200">
              <Sparkles className="h-3.5 w-3.5 motion-safe:animate-bounce" aria-hidden="true" />
              {t('amzFullEyebrow', { defaultValue: 'Full course' })}
            </p>
            <h1 className="font-display text-3xl font-black sm:text-4xl" lang="zgh" dir="ltr">
              ⵜⴰⵎⴰⵣⵉⵖⵜ
            </h1>
            <p className="mt-1 text-sm font-black text-brand-700 dark:text-brand-300">
              {t('amzTitle', { defaultValue: 'Amazigh' })}
            </p>
            <p className="mt-3 max-w-3xl text-xs font-semibold leading-relaxed text-muted">
              {t('amzFullSubtitle', {
                defaultValue:
                  'Graded path inside the platform: we start with letters and reading, then stories and weather, and end with a short dialogue. Every lesson has a real teacher voice, explanation, exercises and pronunciation training.',
              })}
            </p>
          </div>
          <Link
            to="/student/path"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand-300 bg-surface px-4 py-2 text-xs font-black text-brand-700 outline-none hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-brand-300"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            {t('amzBack', { defaultValue: 'Back to path' })}
          </Link>
        </div>
        <div className="mt-4 rounded-card border-2 border-brand-200 bg-brand-50 p-3 dark:bg-brand-400/10">
          <p className="text-xs font-black text-brand-800 dark:text-brand-200" aria-live="polite">
            {t('amzProgressOverall', {
              done: completed.length,
              total: LESSONS.length,
              defaultValue: 'Completed {{done}} of {{total}} lessons',
            })}
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${completed.length / LESSONS.length * 100}%` }}
            />
          </div>
          <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black text-muted">
            <Volume2 className="h-3 w-3" aria-hidden="true" />
            {t('amzCredit', { defaultValue: 'Human audio from reference lessons, bundled locally with no external player.' })}
          </p>
        </div>
      </section>

      <AmazighWordCards />

      {STAGES.map((stage, stageIndex) => {
        const stageLessons = lessonsForStage(stage.id as Stage)
        const stageDone = stageLessons.filter((lesson) => completed.includes(lesson.id)).length
        return (
          <section key={stage.id} aria-labelledby={`amz-stage-${stage.id}`}>
            <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
              <h2 id={`amz-stage-${stage.id}`} className="font-display text-lg font-black">
                <span className="me-2" aria-hidden="true">{stage.emoji}</span>
                {t(stage.titleKey, { defaultValue: stage.titleKey })}
              </h2>
              <p className="text-[10px] font-black text-muted">
                {t('amzLessonCount', {
                  done: stageDone,
                  total: stageLessons.length,
                  defaultValue: '{{done}} / {{total}} lessons',
                })}
              </p>
            </div>
            <p className="mb-3 text-[11px] font-semibold text-muted">
              {stage.desc}
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stageLessons.map((lesson) => {
                const done = completed.includes(lesson.id)
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      onClick={() => setOpenLessonId(lesson.id)}
                      className="flex min-h-32 w-full flex-col items-start rounded-card border-4 border-line bg-surface p-3 text-start outline-none hover:border-brand-300 focus-visible:ring-4 focus-visible:ring-brand-300"
                    >
                      <img
                        src={lesson.image}
                        alt=""
                        loading="lazy"
                        className="mb-2 h-24 w-full rounded-xl border-2 border-line object-cover"
                      />
                      <span className="flex w-full items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-gold-800 dark:text-gold-300">
                          {t('amzLessonNumber', { n: stageIndex + 1, defaultValue: 'Phase {{n}}' })}
                        </span>
                        {done ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-500 px-2 py-0.5 text-[9px] font-black text-white">
                            <Check className="h-3 w-3" aria-hidden="true" />
                            {t('amzLessonDone', { defaultValue: 'Done' })}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-2 text-sm font-black text-content">
                        {lesson.titleAr}
                      </span>
                      <span className="mt-1 font-display text-xs font-black text-brand-700 dark:text-brand-300" lang="zgh" dir="ltr">
                        {lesson.titleTz}
                      </span>
                      <span className="mt-auto pt-2 text-[10px] font-bold text-muted">
                        {formatDuration(lesson.seconds)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <AmazighExtras />
    </div>
  )
}