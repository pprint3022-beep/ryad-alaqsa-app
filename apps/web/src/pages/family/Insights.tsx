import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, RefreshCw, ShieldCheck, Sparkles, Target } from 'lucide-react'
import { apiGet } from '../../lib/api'
import { useAuthStore } from '../../store/auth'
import type { UserScope } from '../../types'

interface Competency { skill?: string; subject?: string; mastery?: number; status?: string }
interface Talent {
  domain?: string; talent?: string; level?: string; evidence?: string[]; program?: string
}
interface Exercise { skill?: string; subject?: string; exercise?: string; frequency?: string }
interface InsightActivity { id?: string; name?: string; category?: string; schedule?: string }
interface LearningPath { focus?: string; reassessDate?: string; nextSteps?: string[]; type?: string }
interface SummaryReport { headline?: string; keyPoints?: string[]; nextActions?: string[] }
interface Insights {
  student?: { id: string; name: string }; level?: string; classification?: string
  summaryReport?: SummaryReport; strengths?: Competency[]; gaps?: Competency[]
  talents?: Talent[]; learningPath?: LearningPath | null; suggestedExercises?: Exercise[]
  recommendedActivities?: InsightActivity[]; feedback?: string[]
  detailedReport?: { methodology?: string }
}
interface InsightsResponse { insights: Insights }

type Status = 'idle' | 'loading' | 'ready' | 'error'

function childIdsFromScope(scope: UserScope | undefined): string[] {
  const children = (scope as { children?: unknown } | undefined)?.children
  return Array.isArray(children) ? children.filter((id): id is string => typeof id === 'string') : []
}

function TagList({ items, tone }: { items?: Array<string | undefined>; tone: string }) {
  const values = (items ?? []).filter((item): item is string => Boolean(item))
  if (values.length === 0) return <p className="text-xs font-semibold text-muted">—</p>
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {values.map((value, index) => (
        <span key={`${value}-${index}`} className={`rounded-full px-3 py-1 text-[11px] font-black ${tone}`}>
          {value}
        </span>
      ))}
    </div>
  )
}

export default function Insights() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const loadError = t('loadError', { defaultValue: 'تعذّر تحميل البيانات. حاول مرة أخرى.' })

  const isParent = user?.role === 'parent'
  const isStudent = user?.role === 'student'
  const studentId = isParent ? childIdsFromScope(user?.scope)[0] : undefined
  const endpoint = isParent ? '/parent/child-insights' : '/student/insights'
  const canLoad = isParent ? Boolean(studentId) : isStudent

  const [insights, setInsights] = useState<Insights | null>(null)
  const [status, setStatus] = useState<Status>(canLoad ? 'loading' : 'idle')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  useEffect(() => {
    if (!canLoad) {
      setInsights(null)
      setStatus('idle')
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setStatus('loading')
    setError('')

    apiGet<InsightsResponse>(endpoint, {
      params: isParent && studentId ? { studentId } : undefined,
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        setInsights(data.insights ?? null)
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
  }, [canLoad, endpoint, isParent, studentId, reloadKey, loadError])

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('insights', { defaultValue: 'رؤى التعلّم' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('insightsTitle', { defaultValue: 'صورة تعلّمية شاملة' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              {t('insightsHint', { defaultValue: 'تحليل متعدد المؤشرات يساعد على متابعة التقدّم وتوجيه الدعم.' })}
            </p>
          </div>
          {canLoad ? (
            <button type="button" onClick={retry} disabled={status === 'loading'} className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0" aria-label={t('refresh', { defaultValue: 'تحديث' })}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('advisoryOnly', { defaultValue: 'هذه مؤشرات استرشادية مبنية على أدلة، وتتطلب مراجعة واعتمادًا بشريًا قبل اتخاذ أي قرار تربوي.' })}
      </div>

      {!canLoad ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('noLinkedStudent', { defaultValue: 'لا يوجد طالب مرتبط بهذا الحساب لعرض الرؤى.' })}
        </p>
      ) : null}

      {status === 'loading' ? (
        <div className="flex items-center gap-2 rounded-card border-2 border-line bg-surface p-5 text-sm font-bold text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t('loading', { defaultValue: 'جارٍ التحميل...' })}
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="text-sm font-bold text-[#E03131]">{error}</p>
          <button type="button" onClick={retry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : null}

      {status === 'ready' && !insights ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('noData', { defaultValue: 'لا توجد رؤى متاحة حاليًا.' })}
        </p>
      ) : null}

      {status === 'ready' && insights ? (
        <div className="space-y-4">
          <section className="card-school p-5">
            <p className="text-xs font-extrabold text-muted">
              {t('classification', { defaultValue: 'التصنيف العام' })}
            </p>
            <h2 className="mt-1 font-display text-xl font-black">
              {insights.summaryReport?.headline ?? insights.classification ?? t('underReview', { defaultValue: 'قيد المراجعة' })}
            </h2>
            {insights.student?.name ? (
              <p className="mt-1 text-xs font-semibold text-muted">{insights.student.name}</p>
            ) : null}
            <TagList
              items={insights.summaryReport?.keyPoints}
              tone="bg-brand-100 text-brand-800 dark:bg-brand-400/15 dark:text-brand-200"
            />
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card-school p-5">
              <h3 className="text-sm font-black">
                {t('strengths', { defaultValue: 'نقاط القوة' })}
              </h3>
              <TagList
                items={(insights.strengths ?? []).map((item) => item.skill)}
                tone="bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-200"
              />
              <h3 className="mt-4 text-sm font-black">
                {t('gaps', { defaultValue: 'فجوات التعلم' })}
              </h3>
              <TagList
                items={(insights.gaps ?? []).map((item) => item.skill)}
                tone="bg-[#E03131]/10 text-[#E03131]"
              />
            </section>

            <section className="card-school p-5">
              <h3 className="flex items-center gap-2 text-sm font-black">
                <Target className="h-4 w-4 text-brand-600" aria-hidden="true" />
                {t('talents', { defaultValue: 'المواهب المكتشفة' })}
              </h3>
              {(insights.talents ?? []).length === 0 ? (
                <p className="mt-2 text-xs font-semibold text-muted">
                  {t('noData', { defaultValue: 'لا توجد بيانات.' })}
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {(insights.talents ?? []).map((item, index) => (
                    <li key={`${item.talent}-${index}`} className="rounded-card border-2 border-line bg-surface p-3">
                      <p className="text-xs font-black">{item.talent ?? item.domain}</p>
                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {[item.domain, item.program].filter(Boolean).join(' • ')}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {insights.learningPath ? (
            <section className="card-school p-5">
              <h3 className="text-sm font-black">
                {t('learningPath', { defaultValue: 'مسار التعلم' })}
              </h3>
              <p className="mt-2 text-xs font-semibold text-muted">
                {insights.learningPath.focus ?? t('noData', { defaultValue: 'لا توجد بيانات.' })}
              </p>
              {insights.learningPath.reassessDate ? (
                <p className="mt-2 inline-flex rounded-full bg-gold-100 px-3 py-1 text-[11px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-200">
                  {t('reassessmentDate', { defaultValue: 'إعادة التقييم' })}: {insights.learningPath.reassessDate}
                </p>
              ) : null}
              <TagList
                items={insights.learningPath.nextSteps}
                tone="bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300"
              />
            </section>
          ) : null}

          {(insights.suggestedExercises ?? []).length > 0 ? (
            <section className="card-school p-5">
              <h3 className="text-sm font-black">
                {t('suggestedExercises', { defaultValue: 'تمارين مقترحة' })}
              </h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {(insights.suggestedExercises ?? []).map((item, index) => (
                  <li key={`${item.exercise}-${index}`} className="rounded-card border-2 border-line bg-surface p-3">
                    <p className="text-xs font-black">{item.exercise}</p>
                    <p className="mt-1 text-[11px] font-semibold text-muted">
                      {[item.subject, item.frequency].filter(Boolean).join(' • ')}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {(insights.recommendedActivities?.length ?? 0) > 0 || (insights.summaryReport?.nextActions?.length ?? 0) > 0 ? (
            <section className="card-school p-5">
              <h3 className="text-sm font-black">
                {t('recommendations', { defaultValue: 'التوصيات المقترحة' })}
              </h3>
              <TagList
                items={[
                  ...(insights.summaryReport?.nextActions ?? []),
                  ...(insights.recommendedActivities ?? []).map((item) => item.name),
                ]}
                tone="bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300"
              />
            </section>
          ) : null}

          {(insights.feedback ?? []).length > 0 ? (
            <section className="card-school p-5">
              <h3 className="text-sm font-black">
                {t('notes', { defaultValue: 'ملاحظات' })}
              </h3>
              <ul className="mt-2 list-disc space-y-1 pe-5 text-xs font-semibold text-muted">
                {(insights.feedback ?? []).map((note, index) => <li key={index}>{note}</li>)}
              </ul>
              {insights.detailedReport?.methodology ? (
                <p className="mt-3 rounded-card bg-surface-muted p-3 text-[11px] font-semibold text-muted">
                  {insights.detailedReport.methodology}
                </p>
              ) : null}
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
