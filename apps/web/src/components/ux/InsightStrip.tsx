import { Link } from 'react-router-dom'
import { ArrowRight, ListChecks, ShieldCheck, type LucideIcon } from 'lucide-react'

/**
 * "Read your dashboard in 10 seconds": a small, prioritized set of next
 * actions instead of a wall of numbers. Every item links to the page where
 * the underlying data can be reviewed by a human.
 */
export interface InsightItem {
  key: string
  label: string
  value: string
  hint: string
  to: string
  icon: LucideIcon
  tone: string
}

export interface InsightStripProps {
  title: string
  subtitle: string
  priorityLabel: string
  advisory: string
  items: InsightItem[]
}

export default function InsightStrip({
  title,
  subtitle,
  priorityLabel,
  advisory,
  items,
}: InsightStripProps) {
  const top = items.slice(0, 4)
  if (top.length === 0) return null

  return (
    <section className="card-school overflow-hidden" aria-label={title}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line bg-surface-muted/60 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-400 text-ink shadow-chunky-gold">
            <ListChecks className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-base font-black">{title}</h2>
            <p className="mt-0.5 text-[11px] font-semibold text-muted">{subtitle}</p>
          </div>
        </div>
        <span className="rounded-full bg-surface px-3 py-1 text-[10px] font-black text-brand-700 dark:text-brand-300">
          {priorityLabel}
        </span>
      </div>

      <div className="ux-enter grid gap-2 p-5 sm:grid-cols-2 xl:grid-cols-4">
        {top.map((item, index) => (
          <Link
            key={item.key}
            to={item.to}
            className="group flex flex-col rounded-card border-2 border-line bg-surface p-3 text-start transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
          >
            <div className="flex items-center gap-2">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${item.tone}`}>
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[11px] font-extrabold text-muted">{item.label}</span>
              {index === 0 ? (
                <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[9px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                  {priorityLabel}
                </span>
              ) : null}
              <ArrowRight
                className="h-3.5 w-3.5 shrink-0 text-muted transition group-hover:text-brand-600 directional-icon"
                aria-hidden="true"
              />
            </div>
            <p className="mt-3 font-display text-xl font-black leading-none">{item.value}</p>
            <p className="mt-2 text-[10px] font-semibold leading-relaxed text-muted">{item.hint}</p>
          </Link>
        ))}
      </div>

      <p className="border-t-2 border-line/70 bg-gold-50/70 px-5 py-3 text-[10px] font-bold leading-relaxed text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
        {advisory}
      </p>
    </section>
  )
}
