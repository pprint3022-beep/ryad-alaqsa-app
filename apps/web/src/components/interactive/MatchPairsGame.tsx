/**
 * Child-friendly tap-to-match game: pick one item from each column to test a
 * pair. Correct pairs stay green, wrong pairs shake and clear. Every visible
 * string is supplied by the parent, so the widget is language-agnostic/RTL-safe.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Check, RotateCcw, Trophy, X } from 'lucide-react'

export interface MatchPair {
  /** Shared id: the same id on both sides makes a correct match. */
  id: string
  /** Prompt-side content (term, word, question, emoji, icon…). */
  left: ReactNode
  /** Answer-side content (definition, translation, emoji, icon…). */
  right: ReactNode
  /** Accessible name for the prompt item; use when `left` is not plain text. */
  leftLabel?: string
  /** Accessible name for the answer item; use when `right` is not plain text. */
  rightLabel?: string
}

export interface MatchPairsLabels {
  /** Optional heading shown above the board. */
  title?: string
  /** Header for the prompt column. */
  left: string
  /** Header for the answer column. */
  right: string
  /** Label for the move counter (the number is rendered beside it). */
  moves: string
  /** When provided, a reset button with this label is shown. */
  replay?: string
}

export interface MatchPairsFeedback {
  /** Announced when a correct pair is matched. */
  correct: string
  /** Announced when a wrong pair is chosen. */
  wrong: string
}

export interface MatchPairsGameProps {
  pairs: readonly MatchPair[]
  labels: MatchPairsLabels
  feedback: MatchPairsFeedback
  /** Celebratory message shown once every pair is matched. */
  doneMessage: string
  /** Fired once, when the last pair is matched. */
  onComplete?: () => void
  dir?: 'rtl' | 'ltr'
  className?: string
}

type Side = 'left' | 'right'
type Notice = { kind: 'correct' | 'wrong'; text: string }

export default function MatchPairsGame({
  pairs,
  labels,
  feedback,
  doneMessage,
  onComplete,
  dir,
  className = '',
}: MatchPairsGameProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matched, setMatched] = useState<ReadonlySet<string>>(() => new Set<string>())
  const [moves, setMoves] = useState(0)
  const [shaking, setShaking] = useState<{ left: string; right: string } | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const timer = useRef<number | null>(null)
  const celebrated = useRef(false)

  const done = pairs.length > 0 && matched.size === pairs.length

  const schedule = (ms: number, fn: () => void) => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(fn, ms)
  }

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
  }, [])

  useEffect(() => {
    if (done && !celebrated.current) {
      celebrated.current = true
      onComplete?.()
    }
  }, [done, onComplete])

  const pick = (side: Side, id: string) => {
    if (done || shaking || matched.has(id)) return

    if (side === 'left' ? selectedLeft === id : selectedRight === id) {
      if (side === 'left') setSelectedLeft(null)
      else setSelectedRight(null)
      return
    }

    const nextLeft = side === 'left' ? id : selectedLeft
    const nextRight = side === 'right' ? id : selectedRight
    if (side === 'left') setSelectedLeft(id)
    else setSelectedRight(id)

    if (!nextLeft || !nextRight) return

    setMoves((value) => value + 1)
    if (nextLeft === nextRight) {
      setMatched((previous) => {
        const next = new Set(previous)
        next.add(nextLeft)
        return next
      })
      setSelectedLeft(null)
      setSelectedRight(null)
      setNotice({ kind: 'correct', text: feedback.correct })
      schedule(1600, () => setNotice(null))
    } else {
      setShaking({ left: nextLeft, right: nextRight })
      setNotice({ kind: 'wrong', text: feedback.wrong })
      schedule(650, () => {
        setShaking(null)
        setSelectedLeft(null)
        setSelectedRight(null)
        setNotice(null)
      })
    }
  }

  const reset = () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = null
    celebrated.current = false
    setSelectedLeft(null)
    setSelectedRight(null)
    setMatched(new Set<string>())
    setMoves(0)
    setShaking(null)
    setNotice(null)
  }

  const renderItem = (side: Side, pair: MatchPair, index: number) => {
    const content = side === 'left' ? pair.left : pair.right
    const explicitLabel = side === 'left' ? pair.leftLabel : pair.rightLabel
    const fallbackLabel = `${side === 'left' ? labels.left : labels.right} ${index + 1}`
    const accessibleLabel = explicitLabel ?? (typeof content === 'string' ? content : fallbackLabel)

    const isMatched = matched.has(pair.id)
    const isSelected = side === 'left' ? selectedLeft === pair.id : selectedRight === pair.id
    const isWrong = shaking !== null && shaking[side] === pair.id

    const tone = isMatched
      ? 'border-brand-500 bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-100'
      : isWrong
        ? 'animate-shake border-[#E03131] bg-[#FFEBEB] text-[#C92A2A] dark:bg-[#E03131]/20 dark:text-[#FFA8A8]'
        : isSelected
          ? 'border-brand-500 bg-brand-50 text-brand-800 shadow-chunky-sm ring-2 ring-brand-300 dark:bg-brand-500/15 dark:text-brand-100'
          : 'border-line bg-surface text-content hover:border-brand-300 hover:bg-surface-muted'

    return (
      <button
        key={`${side}-${pair.id}`}
        type="button"
        onClick={() => pick(side, pair.id)}
        disabled={isMatched || done}
        aria-pressed={isSelected}
        aria-label={accessibleLabel}
        className={`flex min-h-[56px] w-full items-center justify-between gap-3 rounded-card border-2 px-4 py-3 text-start text-sm font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 active:scale-[0.98] disabled:cursor-default ${tone}`}
      >
        <span className="min-w-0 flex-1">{content}</span>
        {isMatched ? <Check className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" /> : null}
        {isWrong ? <X className="h-5 w-5 shrink-0" aria-hidden="true" /> : null}
      </button>
    )
  }

  return (
    <section dir={dir} className={`rounded-card-lg border-2 border-line bg-surface p-4 shadow-card sm:p-5 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {labels.title ? <h2 className="text-sm font-black text-content">{labels.title}</h2> : <span />}
        <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1.5 text-[11px] font-black text-muted">
          {labels.moves}
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand-500 px-1.5 text-xs text-white">{moves}</span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-3">
          <p className="text-center text-[11px] font-black uppercase tracking-wide text-muted">{labels.left}</p>
          {pairs.map((pair, index) => renderItem('left', pair, index))}
        </div>
        <div className="space-y-3">
          <p className="text-center text-[11px] font-black uppercase tracking-wide text-muted">{labels.right}</p>
          {pairs.map((pair, index) => renderItem('right', pair, index))}
        </div>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`min-h-[24px] pt-3 text-center text-xs font-black ${notice?.kind === 'wrong' ? 'text-[#C92A2A] dark:text-[#FFA8A8]' : 'text-brand-700 dark:text-brand-300'}`}
      >
        {notice ? notice.text : null}
      </p>

      {done ? (
        <div className="mt-3 flex animate-pop items-center gap-3 rounded-card border-2 border-gold-300 bg-gold-100 p-4 text-ink shadow-chunky-gold dark:bg-gold-400/15 dark:text-gold-100">
          <Trophy className="h-7 w-7 shrink-0 text-gold-600" aria-hidden="true" />
          <p className="text-sm font-black">{doneMessage}</p>
        </div>
      ) : null}

      {labels.replay ? (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-line bg-surface px-4 py-2 text-xs font-black text-muted transition hover:border-brand-300 hover:text-content focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {labels.replay}
          </button>
        </div>
      ) : null}
    </section>
  )
}
