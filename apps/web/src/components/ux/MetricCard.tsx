import type { LucideIcon } from 'lucide-react'
import InfoHint from './InfoHint'

/**
 * A metric tile that answers three questions at a glance:
 * what the number is, what it means, and how far it is from a healthy range.
 * The explanatory popover is what makes institutional dashboards understandable
 * without requiring the reader to know how the indicator is calculated.
 */
export interface MetricCardProps {
  label: string
  value: string
  hint: string
  explain: string
  infoLabel: string
  icon: LucideIcon
  tone: string
  bar: string
  progress: number
}

export default function MetricCard({
  label,
  value,
  hint,
  explain,
  infoLabel,
  icon: Icon,
  tone,
  bar,
  progress,
}: MetricCardProps) {
  return (
    <article className="card-school card-school--interactive relative overflow-hidden p-5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400 via-gold-400 to-brand-400 opacity-70"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-extrabold text-muted">{label}</p>
            <InfoHint label={infoLabel} text={explain} />
          </div>
          <p className="mt-2 truncate font-display text-3xl font-black leading-none">{value}</p>
        </div>
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted"
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.max(0, Math.min(100, progress))}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={`h-full rounded-full transition-[width] duration-500 ${bar}`} style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-[11px] font-semibold text-muted">{hint}</p>
    </article>
  )
}
