import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { GraduationCap, Loader2, RefreshCw, Search, Users } from 'lucide-react'
import { apiGet, extractApiError } from '../../lib/api'
import type { Student } from '../../types'

interface TeacherClass {
  id: string
  name?: string
  level?: string
  levelId?: string
  students: Student[]
}
interface ClassesResponse {
  classes: TeacherClass[]
}
interface SearchResult {
  type: string
  id: string
  title: string
  subtitle: string
  relevance: number
}
interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}
interface GradeRow {
  subject: string
  score: number
  scale: number
  term: string
}
interface AssignmentRow {
  id: string
  title: string
  subject?: string
  dueDate?: string
  status: string
  grade?: number | null
  feedback?: string | null
}
interface StudentReport {
  student: { id: string; name: string }
  level?: string
  class?: string
  attendance: { total: number; present: number; rate: number }
  grades: GradeRow[]
  average: string | null
  assignments: AssignmentRow[]
  guidance: string[]
  privacy: string
}
interface ReportResponse {
  report: StudentReport
}

function messageOf(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div
      className={`rounded-card border-2 p-4 text-sm font-bold ${
        error
          ? 'border-[#E03131]/30 bg-[#E03131]/10 text-[#E03131]'
          : 'border-line bg-surface-muted text-muted'
      }`}
    >
      {children}
    </div>
  )
}

export default function Classes() {
  const { t } = useTranslation()
  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [report, setReport] = useState<StudentReport | null>(null)
  const [reportLoading, setReportLoading] = useState(false)
  const [reportError, setReportError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    apiGet<ClassesResponse>('/teacher/classes')
      .then((data) => {
        if (active) setClasses(data.classes || [])
      })
      .catch((err: unknown) => {
        if (active) {
          setError(messageOf(err, t('loadError', { defaultValue: 'تعذّر تحميل الفصول. حاول مجددًا.' })))
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearching(false)
      setSearchError(null)
      return
    }
    let active = true
    setSearching(true)
    setSearchError(null)
    const timer = window.setTimeout(() => {
      apiGet<SearchResponse>('/teacher/search', { params: { q } })
        .then((data) => {
          if (active) setResults(data.results || [])
        })
        .catch((err: unknown) => {
          if (active) {
            setSearchError(messageOf(err, t('searchError', { defaultValue: 'تعذّر إكمال البحث.' })))
          }
        })
        .finally(() => {
          if (active) setSearching(false)
        })
    }, 300)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (!selectedId) {
      setReport(null)
      return
    }
    let active = true
    setReportLoading(true)
    setReportError(null)
    apiGet<ReportResponse>('/teacher/student-report', { params: { studentId: selectedId } })
      .then((data) => {
        if (active) setReport(data.report)
      })
      .catch((err: unknown) => {
        if (active) {
          setReportError(messageOf(err, t('reportError', { defaultValue: 'تعذّر تحميل تقرير التلميذ.' })))
        }
      })
      .finally(() => {
        if (active) setReportLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const studentCount = classes.reduce((sum, cls) => sum + (cls.students?.length || 0), 0)

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('teacherClassesTitle', { defaultValue: 'فصلي الدراسية' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('teacherClassesHint', { defaultValue: 'الفصول والتلاميذ ضمن نطاقك فقط.' })}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
          <Users className="h-4 w-4" aria-hidden="true" />
          {studentCount} {t('students', { defaultValue: 'تلميذ' })}
        </span>
      </section>

      <section className="card-school p-5">
        <label className="flex items-center gap-2 text-sm font-black" htmlFor="teacher-search">
          <Search className="h-4 w-4 text-brand-600" aria-hidden="true" />
          {t('scopedSearch', { defaultValue: 'بحث مقيّد بنطاق الفصول' })}
        </label>
        <input
          id="teacher-search"
          className="input-school mt-3"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder', { defaultValue: 'ابحث باسم التلميذ أو رقمه…' })}
        />
        {searching ? (
          <p className="mt-3 flex items-center gap-2 text-xs font-bold text-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {t('searching', { defaultValue: 'جارٍ البحث…' })}
          </p>
        ) : null}
        {searchError ? (
          <div className="mt-3">
            <Notice error>{searchError}</Notice>
          </div>
        ) : null}
        {!searching && query.trim().length >= 2 ? (
          results.length ? (
            <ul className="mt-3 divide-y divide-line rounded-card border-2 border-line bg-surface">
              {results.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  {item.type === 'student' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(item.id)
                        setReport(null)
                      }}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start transition hover:bg-brand-50 dark:hover:bg-brand-400/10"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-extrabold">{item.title}</span>
                        <span className="block truncate text-[11px] font-semibold text-muted">
                          {item.subtitle || item.id}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-gold-100 px-2 py-1 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                        {t('student', { defaultValue: 'تلميذ' })}
                      </span>
                    </button>
                  ) : (
                    <div className="px-4 py-3">
                      <span className="block truncate text-sm font-extrabold">{item.title}</span>
                      <span className="block truncate text-[11px] font-semibold text-muted">
                        {item.subtitle || item.id}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3">
              <Notice>{t('noSearchResults', { defaultValue: 'لا توجد نتائج مطابقة داخل نطاقك.' })}</Notice>
            </div>
          )
        ) : null}
      </section>

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('loading', { defaultValue: 'جارٍ التحميل…' })}
        </div>
      ) : error ? (
        <div className="space-y-3">
          <Notice error>{error}</Notice>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t('retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : classes.length === 0 ? (
        <Notice>{t('noClasses', { defaultValue: 'لا توجد فصول مخصصة لك حاليًا.' })}</Notice>
      ) : (
        <section
          aria-label={t('teacherClassesTitle', { defaultValue: 'فصلي الدراسية' })}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {classes.map((cls) => (
            <article key={cls.id} className="card-school card-school--interactive p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-black">{cls.name || cls.id}</h2>
                  <p className="mt-1 text-xs font-semibold text-muted">{cls.level || '—'}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300">
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4 border-t-2 border-line pt-3">
                {(cls.students || []).length ? (
                  <ul className="space-y-1.5">
                    {cls.students.map((student) => (
                      <li key={student.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(student.id)
                            setReport(null)
                          }}
                          className={`flex w-full items-center justify-between gap-2 rounded-card border-2 px-3 py-2 text-start text-sm font-bold transition hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-400/10 ${
                            selectedId === student.id
                              ? 'border-brand-400 bg-brand-50 dark:bg-brand-400/10'
                              : 'border-line bg-surface'
                          }`}
                        >
                          <span className="truncate">{student.name}</span>
                          <span className="shrink-0 text-[11px] font-black text-brand-600">
                            {t('viewReport', { defaultValue: 'التقرير' })}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs font-semibold text-muted">
                    {t('noStudents', { defaultValue: 'لا تلاميذ في هذا الفصل.' })}
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedId ? (
        <section className="card-school p-5" aria-live="polite">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-black">
              {t('studentReport', { defaultValue: 'تقرير التلميذ' })}
            </h2>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="rounded-card border-2 border-line px-3 py-1.5 text-xs font-black text-muted transition hover:border-brand-300"
            >
              {t('close', { defaultValue: 'إغلاق' })}
            </button>
          </div>
          {reportLoading ? (
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-muted">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {t('loading', { defaultValue: 'جارٍ التحميل…' })}
            </div>
          ) : reportError ? (
            <div className="mt-4">
              <Notice error>{reportError}</Notice>
            </div>
          ) : report ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-card border-2 border-line bg-surface-muted p-4">
                <p className="text-sm font-black">{report.student.name}</p>
                <p className="mt-1 text-xs font-semibold text-muted">
                  {[report.level, report.class].filter(Boolean).join(' · ') || '—'}
                </p>
                <p className="mt-3 text-xs font-bold text-content">
                  {t('attendanceRate', { defaultValue: 'نسبة الحضور' })}: {report.attendance.rate}%
                  <span className="font-semibold text-muted"> ({report.attendance.present}/{report.attendance.total})</span>
                </p>
                <p className="mt-1 text-xs font-bold text-content">
                  {t('averageScore', { defaultValue: 'المعدل' })}: {report.average ?? '—'}
                </p>
              </div>
              <div className="rounded-card border-2 border-line bg-surface-muted p-4">
                <p className="text-xs font-black text-muted">
                  {t('guidance', { defaultValue: 'توجيهات' })}
                </p>
                <ul className="mt-2 list-disc space-y-1 pe-5 text-xs font-semibold">
                  {report.guidance.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[11px] font-semibold text-muted">{report.privacy}</p>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
