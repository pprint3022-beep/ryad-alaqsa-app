/**
 * Single-question multiple-choice widget with instant explanation, a streak
 * counter and star icons. No correctness marker is rendered before answering,
 * and every visible string comes from the parent (safe for all four locales).
 */
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, Flame, Star, X } from 'lucide-react'

export interface QuizOption {
  id: string
  label: string
}

export interface QuickQuizProps {
  question: string
  options: readonly QuizOption[]
  correctId: string
  explanation: string
  onAnswered: (correct: boolean) => void
  /** Called when the learner acknowledges the explanation. */
  onComplete?: () => void
  /** Label shown next to the streak number, e.g. "Streak". */
  streakLabel: string
  /** Label for the Continue button shown after answering. */
  continueLabel: string
  /** Optional screen-reader text marking the correct option after answering. */
  correctLabel?: string
  /** Optional screen-reader text marking a wrong selection after answering. */
  incorrectLabel?: string
  dir?: 'rtl' | 'ltr'
  className?: string
}

const MAX_STARS = 5

export default function QuickQuiz({
  question,
  options,
  correctId,
  explanation,
  onAnswered,
  onComplete,
  streakLabel,
  continueLabel,
  correctLabel,
  incorrectLabel,
  dir,
  className = '',
}: QuickQuizProps) {
  const [answeredId, setAnsweredId] = useState<string | null>(null)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [streak, setStreak] = useState(0)
  const answeredOnce = useRef(false)
  const continueRef = useRef<HTMLButtonElement | null>(null)

  const answered = answeredId !== null

  // The parent may reuse this instance for the next question.
  useEffect(() => {
    answeredOnce.current = false
    setAnsweredId(null)
    setAnsweredCorrectly(false)
  }, [question, correctId])

  useEffect(() => {
    if (answered) continueRef.current?.focus()
  }, [answered])

  const choose = (id: string) => {
    if (answeredOnce.current) return
    answeredOnce.current = true
    const correct = id === correctId
    setAnsweredId(id)
    setAnsweredCorrectly(correct)
    setStreak((value) => (correct ? value + 1 : 0))
    onAnswered(correct)
  }

  const starCount = Math.min(streak, MAX_STARS)

  return (
    <section dir={dir} className={`rounded-card-lg border-2 border-line bg-surface p-4 shadow-card sm:p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gold-100 px-3 py-1.5 text-[11px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-200">
          <Flame className="h-4 w-4 shrink-0 text-gold-600" aria-hidden="true" />
          <span>{streakLabel}</span>
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-surface px-1.5 text-xs text-content">{streak}</span>
        </span>
        <div className="flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: MAX_STARS }, (_, index) => {
            const step = index + 1
            return (
              <Star
                key={step}
                className={`h-5 w-5 ${step <= starCount ? 'fill-gold-400 text-gold-500' : 'text-line'}`}
              />
            )
          })}
        </div>
      </div>

      <h2 className="mt-4 text-base font-black leading-snug text-content sm:text-lg">{question}</h2>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = answeredId === option.id
          const isCorrect = answered && option.id === correctId
          const isWrongPick = answered && isSelected && !isCorrect

          // Before answering every option shares the exact same neutral tone;
          // `correctId` is never exposed via a class or data attribute.
          const tone = !answered
            ? 'border-line bg-surface text-content hover:border-brand-300 hover:bg-surface-muted'
            : isCorrect
              ? 'border-brand-500 bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-100'
              : isWrongPick
                ? 'border-[#E03131] bg-[#FFEBEB] text-[#C92A2A] dark:bg-[#E03131]/20 dark:text-[#FFA8A8]'
                : 'border-line bg-surface-muted text-muted opacity-70'

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => choose(option.id)}
              disabled={answered}
              aria-pressed={isSelected}
              className={`flex min-h-[56px] w-full items-center justify-between gap-3 rounded-card border-2 px-4 py-3 text-start text-sm font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 active:scale-[0.98] disabled:cursor-default ${tone}`}
            >
              <span className="min-w-0 flex-1">{option.label}</span>
              {isCorrect ? <Check className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" /> : null}
              {isWrongPick ? <X className="h-5 w-5 shrink-0" aria-hidden="true" /> : null}
            </button>
          )
        })}
      </div>

      {answered ? (
        <div className="mt-4 animate-pop rounded-card border-2 border-brand-300 bg-brand-50 p-4 dark:bg-brand-500/10">
          <div className="flex items-start gap-3">
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white ${answeredCorrectly ? 'bg-brand-500' : 'bg-[#E03131]'}`}
              aria-hidden="true"
            >
              {answeredCorrectly ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </span>
            <p role="status" className="min-w-0 flex-1 text-sm font-bold leading-relaxed text-content">
              {explanation}
              {answeredCorrectly
                ? correctLabel
                  ? <span className="sr-only"> {correctLabel}</span>
                  : null
                : incorrectLabel
                  ? <span className="sr-only"> {incorrectLabel}</span>
                  : null}
            </p>
          </div>
          <button
            ref={continueRef}
            type="button"
            onClick={() => onComplete?.()}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-brand-500 px-5 py-2 text-sm font-black text-white shadow-chunky-sm transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 active:scale-95"
          >
            <span>{continueLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  )
}
