import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarCheck2, GraduationCap, Loader2, RefreshCw, ShieldCheck, UserRound } from 'lucide-react'
import { apiGet } from '../../lib/api'

interface Attendance {
  total: number
  present: number
  rate: number
}

interface Grade {
  subject: string
  score: number
  scale: number
  term: string
}

interface Assignment {
  id: string
  title: string
  subject?: string
  dueDate?: string
  status: string
  grade: number | null
  feedback?: string | null
}

interface StudentReport {
  student: { id: string; name: string }
  level?: string
  class?: string
  attendance: Attendance
  grades: Grade[]
  average: string | null
  assignments: Assignment[]
  guidance: string[]
  privacy: string
}

interface ProfileResponse {
  report: StudentReport
}

type Status = 'loading' | 'ready' | 'error'

export default function StudentProfile() {
  const { t } = useTranslation()
  const loadError = t('loadError', { defaultValue: 'تعذّر تحميل البيانات. حاول مرة أخرى.' })

  const [report, setReport] = useState<StudentReport | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => setReloadKey((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setStatus('loading')
    setError('')

    apiGet<ProfileResponse>('/student/profile', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        setReport(data.report ?? null)
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
  }, [reloadKey, loadError])

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <UserRound className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('profileBadge', { defaultValue: 'ملفي الشخصي' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {report?.student?.name ?? t('profileTitle', { defaultValue: 'الملف التربوي' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              {t('profileHint', { defaultValue: 'بياناتك المصرّح لك بالاطلاع عليها.' })}
            </p>
          </div>
          <button type="button" onClick={retry} disabled={status === 'loading'} className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0" aria-label={t('refresh', { defaultValue: 'تحديث' })}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-line bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('profilePrivacy', { defaultValue: 'الخصوصية: تظهر بياناتك ضمن نطاقك فقط، ولا تُعرض لجهات أخرى دون صلاحية.' })}
      </div>

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

      {status === 'ready' && !report ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('noData', { defaultValue: 'لا توجد بيانات ملف متاحة.' })}
        </p>
      ) : null}

      {status === 'ready' && report ? (
        <div className="space-y-4">
          <section className="grid gap-3 sm:grid-cols-3">
            <div className="card-school p-4">
              <p className="text-[11px] font-bold text-muted">{t('studentId', { defaultValue: 'رقم الطالب' })}</p>
              <p className="mt-1 font-mono text-sm font-black" dir="ltr">{report.student.id}</p>
            </div>
            <div className="card-school p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-muted">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                {t('level', { defaultValue: 'المستوى' })}
              </p>
              <p className="mt-1 text-sm font-black">{report.level ?? '—'}</p>
            </div>
            <div className="card-school p-4">
              <p className="text-[11px] font-bold text-muted">{t('class', { defaultValue: 'القسم' })}</p>
              <p className="mt-1 text-sm font-black">{report.class ?? '—'}</p>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="card-school p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-muted">
                <CalendarCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t('attendance', { defaultValue: 'الحضور' })}
              </p>
              <p className="mt-1 font-display text-2xl font-black">{report.attendance.rate}%</p>
              <p className="text-[11px] font-semibold text-muted">
                {report.attendance.present}/{report.attendance.total}
              </p>
            </div>
            <div className="card-school p-4">
              <p className="text-[11px] font-bold text-muted">{t('average', { defaultValue: 'المعدل' })}</p>
              <p className="mt-1 font-display text-2xl font-black">{report.average ?? '—'}</p>
            </div>
          </section>

          <section className="card-school p-5">
            <h2 className="text-sm font-black">{t('grades', { defaultValue: 'الدرجات' })}</h2>
            {report.grades.length === 0 ? (
              <p className="mt-3 text-xs font-semibold text-muted">
                {t('noData', { defaultValue: 'لا توجد بيانات.' })}
              </p>
            ) : (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {report.grades.map((grade, index) => (
                  <li key={`${grade.subject}-${index}`} className="flex items-center justify-between rounded-card border-2 border-line bg-surface p-3 text-xs font-bold">
                    <span>{grade.subject}</span>
                    <span className="text-brand-700 dark:text-brand-300">{grade.score}/{grade.scale}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {report.guidance.length > 0 ? (
            <section className="card-school p-5">
              <h2 className="text-sm font-black">{t('guidance', { defaultValue: 'توجيهات تربوية' })}</h2>
              <ul className="mt-2 list-disc space-y-1 pe-5 text-xs font-semibold text-muted">
                {report.guidance.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </section>
          ) : null}

          <p className="rounded-card bg-surface-muted p-3 text-[11px] font-semibold text-muted">
            {report.privacy}
          </p>
        </div>
      ) : null}
    </div>
  )
}
