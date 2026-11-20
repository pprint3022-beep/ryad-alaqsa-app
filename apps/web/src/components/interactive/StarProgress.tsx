/**
 * Compact star progress track: completed steps are filled, the active step is
 * highlighted, and an optional reward badge appears once every step is done.
 * `current` is 1-based; pass `total + 1` to mark the journey complete.
 */
import { Star, Trophy } from 'lucide-react'

export interface StarProgressLabels {
  /** Accessible name for the whole track. */
  track: string
  /** Accessible name for one star; receives its 1-based step number. */
  star?: (step: number) => string
  /** Optional caption shown under the active star, e.g. "You are here". */
  current?: string
  /** Optional reward badge text shown after the final step. */
  reward?: string
}

export interface StarProgressProps {
  /** Number of steps in the journey. */
  total: number
  /** 1-based index of the active step; `total + 1` means all steps are done. */
  current: number
  labels: StarProgressLabels
  /** When provided, stars become buttons that report the clicked step. */
  onStarClick?: (step: number) => void
  dir?: 'rtl' | 'ltr'
  className?: string
}

export default function StarProgress({
  total,
  current,
  labels,
  onStarClick,
  dir,
  className = '',
}: StarProgressProps) {
  const safeTotal = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0
  const active = Number.isFinite(current) ? Math.max(0, Math.floor(current)) : 0
  if (safeTotal === 0) return null

  const steps = Array.from({ length: safeTotal }, (_, index) => index + 1)
  const complete = active > safeTotal
  const filledWidth = `${(Math.min(active, safeTotal) / safeTotal) * 100}%`

  return (
    <section dir={dir} className={`rounded-card-lg border-2 border-line bg-surface px-4 py-3 shadow-card sm:px-5 ${className}`}>
      <div className="relative flex items-center justify-center gap-2 py-2 sm:gap-3">
        <div className="pointer-events-none absolute start-0 end-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-surface-muted" aria-hidden="true">
          <div className="h-full rounded-full bg-brand-400 transition-all" style={{ width: filledWidth }} />
        </div>

        {steps.map((step) => {
          const isDone = step < active
          const isCurrent = step === active
          const accessibleLabel = labels.star?.(step) ?? `${labels.track} ${step}`

          const tone = isDone
            ? 'border-brand-500 bg-brand-100 text-brand-600 shadow-chunky-sm'
            : isCurrent
              ? 'scale-110 border-gold-400 bg-gold-100 text-gold-600 ring-4 ring-gold-200 shadow-chunky-gold'
              : 'border-line bg-surface text-muted'

          const visual = (
            <Star className={`h-6 w-6 ${isDone || isCurrent ? 'fill-current' : ''}`} aria-hidden="true" />
          )

          return onStarClick ? (
            <button
              key={step}
              type="button"
              onClick={() => onStarClick(step)}
              aria-label={accessibleLabel}
              aria-current={isCurrent ? 'step' : undefined}
              className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300 active:scale-95 ${tone}`}
            >
              {visual}
            </button>
          ) : (
            <span
              key={step}
              role="img"
              aria-label={accessibleLabel}
              aria-current={isCurrent ? 'step' : undefined}
              className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 ${tone}`}
            >
              {visual}
            </span>
          )
        })}
      </div>

      {!complete && labels.current ? (
        <p className="mt-1 text-center text-[11px] font-black text-gold-700 dark:text-gold-300" aria-live="polite">
          {labels.current}
        </p>
      ) : null}

      {complete && labels.reward ? (
        <div className="mt-3 flex animate-pop justify-center">
          <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-gold-300 bg-gold-100 px-4 py-2 text-sm font-black text-gold-800 shadow-chunky-gold dark:bg-gold-400/15 dark:text-gold-200">
            <Trophy className="h-5 w-5 shrink-0" aria-hidden="true" />
            {labels.reward}
          </span>
        </div>
      ) : null}
    </section>
  )
}
