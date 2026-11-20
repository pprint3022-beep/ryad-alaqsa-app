import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, RefreshCw, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { apiGet } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import type { UserScope } from '../../types'

interface Talent {
  id?: string
  studentId?: string
  domain?: string
  talent?: string
  level?: string
  evidence?: string[]
  program?: string
}

interface TalentsResponse {
  talents: Talent[]
}

type Status = 'loading' | 'ready' | 'error'

function childIdsFromScope(scope: UserScope | undefined): string[] {
  const children = (scope as { children?: unknown } | undefined)?.children
  return Array.isArray(children) ? children.filter((id): id is string => typeof id === 'string') : []
}

export default function Talents() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const loadError = t('loadError', { defaultValue: 'تعذّر تحميل البيانات. حاول مرة أخرى.' })

  const studentId = childIdsFromScope(user?.scope)[0]

  const [talents, setTalents] = useState<Talent[]>([])
  const [status, setStatus] = useState<Status>(studentId ? 'loading' : 'ready')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  useEffect(() => {
    if (!studentId) {
      setTalents([])
      setStatus('ready')
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setStatus('loading')
    setError('')

    apiGet<TalentsResponse>('/parent/child-talents', {
      params: { studentId },
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        setTalents(Array.isArray(data.talents) ? data.talents : [])
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

  const levelLabels: Record<string, string> = {
    gifted: t('giftedLevel', { defaultValue: 'موهبة بارزة' }),
    promising: t('promisingLevel', { defaultValue: 'موهبة واعدة' }),
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-gold-400/30 bg-gold-400 p-6 text-ink shadow-chunky-gold sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-20" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-ink/10 px-3 py-1 text-[10px] font-black tracking-wide">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              {t('talentsBadge', { defaultValue: 'اكتشاف المواهب' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('talentsTitle', { defaultValue: 'مواهب طفلك' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-ink/70">
              {t('talentsHint', { defaultValue: 'مؤشرات تميز موثّقة بالأدلة، تهدف إلى تنمية نقاط القوة.' })}
            </p>
          </div>
          {studentId ? (
            <button type="button" onClick={retry} disabled={status === 'loading'} className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0" aria-label={t('refresh', { defaultValue: 'تحديث' })}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('talentsAdvisory', { defaultValue: 'مؤشرات المواهب استرشادية وتحتاج إلى حوار مع المعلمين واعتماد بشري قبل بناء مسار إثرائي.' })}
      </div>

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

      {studentId && status === 'ready' && talents.length === 0 ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('noTalents', { defaultValue: 'لم تُسجّل مؤشرات موهبة لهذا الطالب بعد.' })}
        </p>
      ) : null}

      {studentId && status === 'ready' && talents.length > 0 ? (
        <section aria-label={t('talents', { defaultValue: 'المواهب' })} className="grid gap-3 md:grid-cols-2">
          {talents.map((item, index) => {
            const evidence = Array.isArray(item.evidence)
              ? item.evidence.filter((entry): entry is string => typeof entry === 'string')
              : []
            return (
              <article key={item.id ?? `${item.talent}-${index}`} className="card-school card-school--interactive p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-gold-700 dark:text-gold-300">
                      {item.domain ?? t('generalDomain', { defaultValue: 'مجال عام' })}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-black">{item.talent ?? '—'}</h2>
                  </div>
                  {item.level ? (
                    <span className="shrink-0 rounded-full bg-gold-100 px-3 py-1 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-200">
                      {levelLabels[item.level] ?? item.level}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4">
                  <h3 className="flex items-center gap-2 text-xs font-black">
                    <Sparkles className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    {t('evidence', { defaultValue: 'الأدلة' })}
                  </h3>
                  {evidence.length === 0 ? (
                    <p className="mt-1 text-xs font-semibold text-muted">
                      {t('noData', { defaultValue: 'لا توجد بيانات.' })}
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-1">
                      {evidence.map((entry, entryIndex) => (
                        <li key={`${entry}-${entryIndex}`} className="flex items-start gap-2 text-xs font-semibold text-muted">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                          {entry}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {item.program ? (
                  <p className="mt-4 rounded-card border-2 border-line bg-surface-muted p-3 text-[11px] font-bold">
                    <span className="text-muted">{t('suggestedProgram', { defaultValue: 'البرنامج المقترح' })}: </span>
                    {item.program}
                  </p>
                ) : null}
              </article>
            )
          })}
        </section>
      ) : null}
    </div>
  )
}
