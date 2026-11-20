import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Clock3, Loader2, RefreshCw, Sparkles } from 'lucide-react'
import { apiGet } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import type { UserScope } from '../../types'

interface Activity {
  id: string; name?: string; category?: string; type?: string
  audience?: string; schedule?: string; outreach?: boolean
}
interface Enrollment { id?: string; activityId?: string; enrolledAt?: string; status?: string }
interface ChildAlert { id?: string; level?: string; type?: string; message?: string; date?: string }
interface DueItem { id?: string; type?: string; due?: string; message?: string }
interface ActivitiesResponse { activities: Activity[]; enrolled: Enrollment[]; studentName?: string }
interface NotificationsResponse { alerts: ChildAlert[]; due: DueItem[]; total?: number }

type Status = 'loading' | 'ready' | 'error'

function childIdsFromScope(scope: UserScope | undefined): string[] {
  const children = (scope as { children?: unknown } | undefined)?.children
  return Array.isArray(children) ? children.filter((id): id is string => typeof id === 'string') : []
}

function resolveLocale(language?: string): string {
  const base = (language ?? 'ar').split('-')[0]
  if (base === 'ar') return 'ar-MA'
  if (base === 'fr' || base === 'amz') return 'fr-FR'
  if (base === 'en') return 'en-GB'
  return 'ar-MA'
}

function shortDate(value?: string, locale = 'ar-MA'): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date)
}

export default function Activities() {
  const { t, i18n } = useTranslation()
  const locale = resolveLocale(i18n.resolvedLanguage ?? i18n.language)
  const user = useAuthStore((state) => state.user)
  const loadError = t('loadError', { defaultValue: 'تعذّر تحميل البيانات. حاول مرة أخرى.' })

  const activityTypeLabel = (value?: string) => {
    if (!value) return ''
    const normalized = value.trim().toLowerCase()
    if (normalized === 'club' || value === 'نادي') {
      return t('enumClub', { defaultValue: 'نادي' })
    }
    if (['activity', 'trip', 'نشاط', 'رحلة'].includes(normalized)) {
      return t('enumActivity', { defaultValue: 'نشاط' })
    }
    return t('enumOther', { defaultValue: 'أخرى' })
  }

  const studentId = childIdsFromScope(user?.scope)[0]

  const [activities, setActivities] = useState<Activity[]>([])
  const [enrolledIds, setEnrolledIds] = useState<string[]>([])
  const [alerts, setAlerts] = useState<ChildAlert[]>([])
  const [due, setDue] = useState<DueItem[]>([])
  const [status, setStatus] = useState<Status>(studentId ? 'loading' : 'ready')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  useEffect(() => {
    if (!studentId) {
      setActivities([])
      setEnrolledIds([])
      setAlerts([])
      setDue([])
      setStatus('ready')
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setStatus('loading')
    setError('')

    Promise.all([
      apiGet<ActivitiesResponse>('/parent/child-activities', {
        params: { studentId },
        signal: controller.signal,
      }),
      apiGet<NotificationsResponse>('/parent/notifications', { signal: controller.signal }),
    ])
      .then(([activityData, notificationData]) => {
        if (cancelled) return
        setActivities(Array.isArray(activityData.activities) ? activityData.activities : [])
        setEnrolledIds(
          (Array.isArray(activityData.enrolled) ? activityData.enrolled : [])
            .map((entry) => entry.activityId)
            .filter((id): id is string => typeof id === 'string'),
        )
        setAlerts(Array.isArray(notificationData.alerts) ? notificationData.alerts : [])
        setDue(Array.isArray(notificationData.due) ? notificationData.due : [])
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
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <CalendarDays className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('activitiesBadge', { defaultValue: 'الأنشطة والمواعيد' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('activitiesTitle', { defaultValue: 'أنشطة طفلك القادمة' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              {t('activitiesHint', { defaultValue: 'نظرة على الأنشطة المتاحة والمواعيد المستحقة.' })}
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

      {studentId && status === 'ready' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="card-school p-5">
            <h2 className="flex items-center gap-2 text-sm font-black">
              <Sparkles className="h-4 w-4 text-gold-600" aria-hidden="true" />
              {t('availableActivities', { defaultValue: 'الأنشطة المتاحة' })}
            </h2>
            {activities.length === 0 ? (
              <p className="mt-3 text-xs font-semibold text-muted">
                {t('noActivities', { defaultValue: 'لا توجد أنشطة متاحة حاليًا.' })}
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {activities.map((activity) => {
                  const isEnrolled = enrolledIds.includes(activity.id)
                  return (
                    <li key={activity.id} className="rounded-card border-2 border-line bg-surface p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-black">{activity.name ?? activity.id}</p>
                        {isEnrolled ? (
                          <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-200">
                            {t('enrolled', { defaultValue: 'مسجّل' })}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {activity.category ? (
                          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-bold text-muted">
                            {activity.category}
                          </span>
                        ) : null}
                        {activity.schedule ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted">
                            <Clock3 className="h-3 w-3" aria-hidden="true" />
                            {activity.schedule}
                          </span>
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="card-school p-5">
            <h2 className="flex items-center gap-2 text-sm font-black">
              <CalendarDays className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {t('upcoming', { defaultValue: 'المواعيد القادمة' })}
            </h2>
            {due.length === 0 && alerts.length === 0 ? (
              <p className="mt-3 text-xs font-semibold text-muted">
                {t('noUpcoming', { defaultValue: 'لا توجد مواعيد أو تنبيهات حاليًا.' })}
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {due.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="flex items-center gap-3 rounded-card border-2 border-line bg-surface p-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-100 px-1 text-center text-[10px] font-black leading-tight text-gold-800 dark:bg-gold-400/15 dark:text-gold-200">
                      {shortDate(item.due, locale)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-black">{item.message ?? t('review', { defaultValue: 'مراجعة' })}</p>
                      <p className="text-[10px] font-semibold text-muted">
                        {activityTypeLabel(item.type)}
                      </p>
                    </div>
                  </li>
                ))}
                {alerts.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="flex items-center gap-3 rounded-card border-2 border-line bg-surface p-3">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${item.level === 'high' ? 'bg-[#E03131]' : 'bg-gold-500'}`} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-xs font-black">{item.message}</p>
                      <p className="text-[10px] font-semibold text-muted">
                        {[item.date, activityTypeLabel(item.type)].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}
