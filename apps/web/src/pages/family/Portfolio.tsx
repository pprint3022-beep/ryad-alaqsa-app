import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Award, Briefcase, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { apiGet } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import type { UserScope } from '../../types'

interface Work {
  id: string; title?: string; subject?: string; grade?: number | null
  feedback?: string | null; status?: string
}
interface Talent { id?: string; domain?: string; talent?: string; level?: string; evidence?: string[] }
interface Activity { id: string; name?: string; category?: string }
interface PortfolioResponse { student?: string; works: Work[]; talents: Talent[]; activities: Activity[] }
interface FeaturedWork {
  id: string; title?: string; student?: string; subject?: string; level?: string
  grade?: number; feedback?: string; featured?: boolean
}
interface Publication { id: string; title?: string; type?: string; date?: string; impact?: string }
interface ShowcaseResponse {
  featured: FeaturedWork[]; studentWork: FeaturedWork[]; publications: Publication[]; total?: number
}

type Status = 'loading' | 'ready' | 'error'

function scopeId(user: { role?: string; scope?: UserScope } | null): string | undefined {
  if (user?.role === 'parent') {
    const children = (user.scope as { children?: unknown } | undefined)?.children
    if (Array.isArray(children)) {
      const first = children.find((id): id is string => typeof id === 'string')
      if (first) return first
    }
  }
  const studentId = (user?.scope as { studentId?: unknown } | undefined)?.studentId
  return typeof studentId === 'string' ? studentId : undefined
}

export default function Portfolio() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const loadError = t('loadError', { defaultValue: 'تعذّر تحميل البيانات. حاول مرة أخرى.' })

  const studentId = scopeId(user)

  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null)
  const [featured, setFeatured] = useState<FeaturedWork[]>([])
  const [publications, setPublications] = useState<Publication[]>([])
  const [status, setStatus] = useState<Status>(studentId ? 'loading' : 'ready')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  useEffect(() => {
    if (!studentId) {
      setPortfolio(null)
      setFeatured([])
      setPublications([])
      setStatus('ready')
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setStatus('loading')
    setError('')

    Promise.all([
      apiGet<PortfolioResponse>('/showcase/portfolio', {
        params: { studentId },
        signal: controller.signal,
      }),
      apiGet<ShowcaseResponse>('/showcase', { signal: controller.signal }),
    ])
      .then(([portfolioData, showcaseData]) => {
        if (cancelled) return
        setPortfolio(portfolioData)
        setFeatured(Array.isArray(showcaseData.featured) ? showcaseData.featured : [])
        setPublications(Array.isArray(showcaseData.publications) ? showcaseData.publications : [])
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
  }, [studentId, reloadKey, loadError])

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-gold-400/30 bg-gold-400 p-6 text-ink shadow-chunky-gold sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-20" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-1 text-[10px] font-black tracking-wide">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              {t('portfolioBadge', { defaultValue: 'معرض الأعمال' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('portfolioTitle', { defaultValue: 'ملف الإنجازات' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-ink/70">
              {portfolio?.student
                ? `${t('student', { defaultValue: 'الطالب' })}: ${portfolio.student}`
                : t('portfolioHint', { defaultValue: 'أعمال ومواهب وإسهامات موثّقة.' })}
            </p>
          </div>
          {studentId ? (
            <button type="button" onClick={retry} disabled={status === 'loading'} className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0" aria-label={t('refresh', { defaultValue: 'تحديث' })}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </section>

      {!studentId ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('noLinkedStudent', { defaultValue: 'لا يوجد طالب مرتبط بهذا الحساب.' })}
        </p>
      ) : null}

      {studentId && status === 'loading' ? (
        <div className="flex items-center gap-2 rounded-card border-2 border-line bg-surface p-5 text-sm font-bold text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t('loading', { defaultValue: 'جارٍ التحميل...' })}
        </div>
      ) : null}

      {studentId && status === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="text-sm font-bold text-[#E03131]">{error}</p>
          <button type="button" onClick={retry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : null}

      {studentId && status === 'ready' && portfolio ? (
        <div className="space-y-4">
          <section className="card-school p-5">
            <h2 className="text-sm font-black">{t('works', { defaultValue: 'الأعمال' })}</h2>
            {portfolio.works.length === 0 ? (
              <p className="mt-3 text-xs font-semibold text-muted">
                {t('noWorks', { defaultValue: 'لا توجد أعمال مسجّلة بعد.' })}
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {portfolio.works.map((work) => (
                  <li key={work.id} className="rounded-card border-2 border-line bg-surface p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-black">{work.title ?? work.id}</p>
                      {typeof work.grade === 'number' ? (
                        <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-200">
                          {work.grade}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-muted">
                      {[work.subject, work.status].filter(Boolean).join(' • ')}
                    </p>
                    {work.feedback ? (
                      <p className="mt-2 rounded-card bg-surface-muted p-2 text-[11px] font-semibold text-muted">
                        {work.feedback}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card-school p-5">
              <h2 className="flex items-center gap-2 text-sm font-black">
                <Award className="h-4 w-4 text-gold-600" aria-hidden="true" />
                {t('talents', { defaultValue: 'المواهب' })}
              </h2>
              {portfolio.talents.length === 0 ? (
                <p className="mt-3 text-xs font-semibold text-muted">
                  {t('noData', { defaultValue: 'لا توجد بيانات.' })}
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {portfolio.talents.map((item, index) => (
                    <li key={item.id ?? `${item.talent}-${index}`} className="rounded-card border-2 border-line bg-surface p-3">
                      <p className="text-xs font-black">{item.talent ?? item.domain}</p>
                      {item.evidence && item.evidence.length > 0 ? (
                        <p className="mt-1 text-[11px] font-semibold text-muted">
                          {item.evidence.join(' • ')}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card-school p-5">
              <h2 className="flex items-center gap-2 text-sm font-black">
                <Sparkles className="h-4 w-4 text-brand-600" aria-hidden="true" />
                {t('featuredWork', { defaultValue: 'أعمال مميزة' })}
              </h2>
              {featured.length === 0 ? (
                <p className="mt-3 text-xs font-semibold text-muted">
                  {t('noFeatured', { defaultValue: 'لا توجد أعمال مميزة حاليًا.' })}
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {featured.slice(0, 5).map((item) => (
                    <li key={item.id} className="rounded-card border-2 border-line bg-surface p-3">
                      <p className="text-xs font-black">{item.title ?? item.id}</p>
                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {[item.student, item.subject, item.level].filter(Boolean).join(' • ')}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {publications.length > 0 ? (
            <section className="card-school p-5">
              <h2 className="text-sm font-black">{t('schoolPublications', { defaultValue: 'إصدارات المدرسة' })}</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {publications.slice(0, 6).map((item) => (
                  <li key={item.id} className="rounded-card border-2 border-line bg-surface-muted p-3">
                    <p className="text-xs font-black">{item.title ?? item.id}</p>
                    <p className="mt-1 text-[11px] font-semibold text-muted">
                      {[item.type, item.date].filter(Boolean).join(' • ')}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
