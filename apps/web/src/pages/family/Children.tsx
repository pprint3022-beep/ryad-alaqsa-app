import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarCheck2, ClipboardList, Loader2, RefreshCw, Users } from 'lucide-react'
import { apiGet } from '../../lib/api'

interface Child {
  id: string; name: string; level?: string; class?: string
}
interface Attendance { total: number; present: number; rate: number }
interface Grade { subject: string; score: number; scale: number; term: string }
interface Assignment {
  id: string; title: string; subject?: string; dueDate?: string
  status: string; grade: number | null; feedback?: string | null
}
interface StudentReport {
  student: { id: string; name: string }; level?: string; class?: string
  attendance: Attendance; grades: Grade[]; average: string | null
  assignments: Assignment[]; guidance: string[]; privacy: string
}
interface Assessment {
  id: string; refSkill?: string; subject?: string; type?: string
  score: number; date?: string; term?: string; notes?: string
}
interface ChildrenResponse { children: Child[] }
interface ReportResponse { report: StudentReport }
interface AssessmentsResponse { assessments: Assessment[] }

type Status = 'idle' | 'loading' | 'ready' | 'error'

export default function Children() {
  const { t } = useTranslation()
  const loadError = t('loadError', { defaultValue: 'تعذّر تحميل البيانات. حاول مرة أخرى.' })

  const [children, setChildren] = useState<Child[]>([])
  const [listStatus, setListStatus] = useState<Status>('loading')
  const [listError, setListError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [report, setReport] = useState<StudentReport | null>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [detailStatus, setDetailStatus] = useState<Status>('idle')
  const [detailError, setDetailError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setListStatus('loading')
    setListError('')

    apiGet<ChildrenResponse>('/parent/children', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        const kids = Array.isArray(data.children) ? data.children : []
        setChildren(kids)
        setSelectedId((current) =>
          current && kids.some((kid) => kid.id === current)
            ? current
            : kids[0]?.id ?? null,
        )
        setListStatus('ready')
      })
      .catch(() => {
        if (!cancelled) {
          setListError(loadError)
          setListStatus('error')
        }
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, loadError])

  useEffect(() => {
    if (!selectedId) {
      setReport(null)
      setAssessments([])
      setDetailStatus('idle')
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setDetailStatus('loading')
    setDetailError('')

    Promise.all([
      apiGet<ReportResponse>('/parent/child-report', {
        params: { studentId: selectedId },
        signal: controller.signal,
      }),
      apiGet<AssessmentsResponse>('/parent/child-assessments', {
        params: { studentId: selectedId },
        signal: controller.signal,
      }),
    ])
      .then(([reportData, assessmentData]) => {
        if (cancelled) return
        setReport(reportData.report ?? null)
        setAssessments(
          Array.isArray(assessmentData.assessments) ? assessmentData.assessments : [],
        )
        setDetailStatus('ready')
      })
      .catch(() => {
        if (!cancelled) {
          setDetailError(loadError)
          setDetailStatus('error')
        }
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [selectedId, reloadKey, loadError])

  const selectedChild = children.find((kid) => kid.id === selectedId)

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <Users className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('myChildren', { defaultValue: 'أبنائي' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('childrenTitle', { defaultValue: 'متابعة أبنائي' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              {t('childrenHint', { defaultValue: 'اختر طفلك لعرض ملفه وتقاريره المصرّح بها.' })}
            </p>
          </div>
          <button
            type="button"
            onClick={retry}
            disabled={listStatus === 'loading'}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
            aria-label={t('refresh', { defaultValue: 'تحديث' })}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {listStatus === 'loading' ? (
        <div className="grid gap-3 sm:grid-cols-2" aria-hidden="true">
          {[0, 1].map((key) => (
            <div key={key} className="card-school space-y-3 p-5">
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-line" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-line" />
            </div>
          ))}
        </div>
      ) : null}

      {listStatus === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="text-sm font-bold text-[#E03131]">{listError}</p>
          <button type="button" onClick={retry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : null}

      {listStatus === 'ready' && children.length === 0 ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('noChildren', { defaultValue: 'لا توجد بيانات أبناء مرتبطة بهذا الحساب.' })}
        </p>
      ) : null}

      {listStatus === 'ready' && children.length > 0 ? (
        <section aria-label={t('myChildren', { defaultValue: 'أبنائي' })} className="grid gap-3 sm:grid-cols-2">
          {children.map((kid) => {
            const active = kid.id === selectedId
            return (
              <button
                key={kid.id}
                type="button"
                onClick={() => setSelectedId(kid.id)}
                aria-pressed={active}
                className={`rounded-card border-2 p-4 text-start transition hover:-translate-y-0.5 hover:shadow-card ${
                  active
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-400/10'
                    : 'border-line bg-surface'
                }`}
              >
                <p className="font-display text-lg font-black">{kid.name}</p>
                <p className="mt-1 text-xs font-semibold text-muted">
                  {[kid.level, kid.class].filter(Boolean).join(' • ')}
                </p>
              </button>
            )
          })}
        </section>
      ) : null}

      {selectedChild ? (
        <section className="card-school p-5">
          <h2 className="text-lg font-black">
            {t('childFile', { defaultValue: 'ملف' })}: {selectedChild.name}
          </h2>

          {detailStatus === 'loading' ? (
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-muted">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t('loading', { defaultValue: 'جارٍ التحميل...' })}
            </div>
          ) : null}

          {detailStatus === 'error' ? (
            <div className="mt-4 flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-4">
              <p className="text-sm font-bold text-[#E03131]">{detailError}</p>
              <button type="button" onClick={retry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                {t('retry', { defaultValue: 'إعادة المحاولة' })}
              </button>
            </div>
          ) : null}

          {detailStatus === 'ready' && report ? (
            <div className="mt-4 space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                  <p className="text-[11px] font-bold text-muted">
                    {t('attendance', { defaultValue: 'الحضور' })}
                  </p>
                  <p className="mt-1 font-display text-2xl font-black">{report.attendance.rate}%</p>
                  <p className="text-[11px] font-semibold text-muted">
                    {report.attendance.present}/{report.attendance.total}
                  </p>
                </div>
                <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                  <p className="text-[11px] font-bold text-muted">
                    {t('average', { defaultValue: 'المعدل' })}
                  </p>
                  <p className="mt-1 font-display text-2xl font-black">{report.average ?? '—'}</p>
                </div>
                <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                  <p className="text-[11px] font-bold text-muted">
                    {t('level', { defaultValue: 'المستوى' })}
                  </p>
                  <p className="mt-1 text-sm font-black">{report.level ?? '—'}</p>
                  <p className="text-[11px] font-semibold text-muted">{report.class ?? ''}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-black">
                  <CalendarCheck2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  {t('grades', { defaultValue: 'الدرجات' })}
                </h3>
                {report.grades.length === 0 ? (
                  <p className="text-xs font-semibold text-muted">
                    {t('noData', { defaultValue: 'لا توجد بيانات.' })}
                  </p>
                ) : (
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {report.grades.map((grade, index) => (
                      <li key={`${grade.subject}-${index}`} className="flex items-center justify-between rounded-card border-2 border-line bg-surface p-3 text-xs font-bold">
                        <span>{grade.subject}</span>
                        <span className="text-brand-700 dark:text-brand-300">{grade.score}/{grade.scale}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {report.guidance.length > 0 ? (
                <div className="rounded-card bg-gold-50 p-4 dark:bg-gold-400/10">
                  <h3 className="text-sm font-black">
                    {t('guidance', { defaultValue: 'توجيهات تربوية' })}
                  </h3>
                  <ul className="mt-2 list-disc space-y-1 pe-5 text-xs font-semibold text-muted">
                    {report.guidance.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </div>
              ) : null}

              <div>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-black">
                  <ClipboardList className="h-4 w-4 text-brand-600" aria-hidden="true" />
                  {t('assessments', { defaultValue: 'التقييمات' })}
                </h3>
                {assessments.length === 0 ? (
                  <p className="text-xs font-semibold text-muted">
                    {t('noData', { defaultValue: 'لا توجد بيانات.' })}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {assessments.map((item) => (
                      <li key={item.id} className="rounded-card border-2 border-line bg-surface p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black">{item.refSkill ?? item.subject ?? item.id}</span>
                          <span className="text-xs font-black text-brand-700 dark:text-brand-300">
                            {Math.round(item.score * 100)}%
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] font-semibold text-muted">
                          {[item.type, item.date, item.notes].filter(Boolean).join(' • ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="rounded-card bg-surface-muted p-3 text-[11px] font-semibold text-muted">
                {report.privacy}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
