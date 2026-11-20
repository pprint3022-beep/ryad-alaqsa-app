import { Award, Check, Circle, type LucideIcon } from 'lucide-react'

/**
 * Non-competitive milestones for staff and families. Badges celebrate a
 * completed professional action — never a ranking of children or colleagues.
 * `earned` is derived from real dashboard data by the calling page.
 */
export interface Achievement {
  key: string
  label: string
  hint: string
  icon: LucideIcon
  earned: boolean
}

export interface AchievementRailProps {
  title: string
  subtitle: string
  earnedLabel: string
  pendingLabel: string
  badges: Achievement[]
}

export default function AchievementRail({
  title,
  subtitle,
  earnedLabel,
  pendingLabel,
  badges,
}: AchievementRailProps) {
  const earned = badges.filter((badge) => badge.earned).length
  if (badges.length === 0) return null

  return (
    <section className="card-school p-5" aria-label={title}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-700 dark:text-brand-300">
            <Award className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-base font-black">{title}</h2>
            <p className="mt-0.5 text-[11px] font-semibold text-muted">{subtitle}</p>
          </div>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-[10px] font-black text-brand-700 dark:text-brand-300">
          {earned} / {badges.length}
        </span>
      </div>

      <ul className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {badges.map((badge) => (
          <li
            key={badge.key}
            className={`flex min-w-[170px] flex-1 items-center gap-2 rounded-card border-2 p-3 transition ${
              badge.earned
                ? 'border-gold-400 bg-gold-50 dark:bg-gold-400/10'
                : 'border-line bg-surface-muted/50'
            }`}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                badge.earned
                  ? 'bg-gold-400 text-ink shadow-chunky-gold'
                  : 'bg-surface text-muted'
              }`}
            >
              {badge.earned ? (
                <badge.icon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Circle className="h-4 w-4" aria-hidden="true" />
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11px] font-black">{badge.label}</span>
              <span className="mt-0.5 block text-[9px] font-semibold leading-snug text-muted">{badge.hint}</span>
              <span className={`mt-1 inline-flex items-center gap-1 text-[9px] font-black ${badge.earned ? 'text-gold-700 dark:text-gold-300' : 'text-muted'}`}>
                {badge.earned ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
                {badge.earned ? earnedLabel : pendingLabel}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
