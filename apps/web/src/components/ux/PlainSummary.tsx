import { ArrowDown, ShieldCheck, Sparkles } from 'lucide-react'

/**
 * A plain-language summary placed at the TOP of an institutional report.
 * Every value is supplied by the calling page from real report data; the
 * component never computes or assumes a figure. The advisory line keeps the
 * official "human review" boundary visible in the printable version too.
 */
export interface SummaryHighlight {
  label: string
  value: string
}

export interface PlainSummaryProps {
  badge: string
  title: string
  sentence: string
  highlights: SummaryHighlight[]
  advisory: string
  detailsLabel: string
  detailsHref: string
}

export default function PlainSummary({
  badge,
  title,
  sentence,
  highlights,
  advisory,
  detailsLabel,
  detailsHref,
}: PlainSummaryProps) {
  return (
    <section className="card-school relative overflow-hidden p-5" aria-label={title}>
      <div className="ux-zellij absolute inset-x-0 top-0 h-16 bg-brand-600" aria-hidden="true" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-3 py-1 text-[10px] font-black text-ink shadow-chunky-gold">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {badge}
          </span>
          <a
            href={detailsHref}
            className="inline-flex items-center gap-1 rounded-full border-2 border-line bg-surface px-3 py-1 text-[10px] font-black text-brand-700 transition hover:border-brand-300 dark:text-brand-300"
          >
            <ArrowDown className="h-3.5 w-3.5 directional-icon" aria-hidden="true" />
            {detailsLabel}
          </a>
        </div>

        <h2 className="mt-3 font-display text-lg font-black">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm font-bold leading-loose text-content">{sentence}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {highlights.map((item) => (
            <li
              key={item.label}
              className="rounded-card border-2 border-line bg-surface-muted/60 px-3 py-2"
            >
              <span className="block text-[9px] font-black text-muted">{item.label}</span>
              <span className="mt-0.5 block font-display text-base font-black">{item.value}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 flex items-start gap-2 border-t-2 border-line pt-3 text-[10px] font-bold leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
          {advisory}
        </p>
      </div>
    </section>
  )
}
