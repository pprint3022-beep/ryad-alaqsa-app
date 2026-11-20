import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronDown,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { apiGet, extractApiError } from '../../lib/api'
import { PlainSummary } from '../../components/ux'

interface EngagementSummary {
  totalMinutes: number
  todayMinutes: number
  streakDays: number
  sessions: number
  lastActive: string | null
  bySubjectMinutes: Record<string, number>
  dailyMinutes: Array<{ date: string; minutes: number }>
  note?: string
}

interface AssignmentRow {
  id: string
  title?: string
  subject?: string
  dueDate?: string | null
  status: string
  grade?: number | null
  submittedAt?: string | null
}

interface LessonRow {
  lessonId: string
  subject?: string
  unit?: string
  lesson?: string
  score?: number
  completed?: boolean
  xp?: number
}

interface LessonSummary {
  completed: number
  totalXp: number
  averageScore: number
  rows: LessonRow[]
}

interface StudentEngagement {
  studentId: string
  name: string
  engagement: EngagementSummary
  assignments: AssignmentRow[]
  lessons: LessonSummary
}

interface EngagementResponse {
  students: StudentEngagement[]
  note?: string
}

interface TeacherClass {
  id: string
  name?: string
  level?: string
}

interface ClassesResponse {
  classes: TeacherClass[]
}

const TH = 'whitespace-nowrap px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'whitespace-nowrap px-3 py-2 text-[11px] font-semibold tabular-nums'
const TD_TODAY =
  'whitespace-nowrap px-3 py-2 text-[11px] font-black tabular-nums text-brand-700 dark:text-brand-300'

const NOTICE_TONES = {
  info: 'border-brand-300 bg-brand-soft text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-200',
  warning:
    'border-gold-300 bg-gold-50 text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200',
  error:
    'border-[#E03131]/40 bg-[#E03131]/10 text-[#b42318] dark:border-[#E03131]/50 dark:text-[#ff8787]',
  empty: 'border-line bg-surface-muted text-muted',
} as const

const DONE_STATUSES = new Set([
  'done',
  'submitted',
  'completed',
  'complete',
  'graded',
  'late',
])

const STATUS_KEYS: Record<string, string> = {
  done: 'enumCompleted',
  submitted: 'enumSubmitted',
  graded: 'parEngStatusGraded',
  completed: 'enumCompleted',
  complete: 'enumCompleted',
  late: 'enumLate',
  missing: 'parEngStatusMissing',
  pending: 'enumPending',
  in_progress: 'enumInProgress',
}

const STATUS_DEFAULTS: Record<string, string> = {
  enumCompleted: 'مكتمل',
  enumSubmitted: 'مُرسل',
  enumLate: 'متأخر',
  enumPending: 'قيد الانتظار',
  enumInProgress: 'قيد الإنجاز',
  parEngStatusGraded: 'مصحّح',
  parEngStatusMissing: 'غير منجز',
}

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, '_')
}

function isAssignmentDone(assignment: AssignmentRow): boolean {
  return Boolean(assignment.submittedAt) || DONE_STATUSES.has(normalizeStatus(assignment.status))
}

function statusTone(status: string): string {
  const normalized = normalizeStatus(status)
  if (normalized === 'late' || normalized === 'pending' || normalized === 'in_progress') {
    return 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
  }
  if (DONE_STATUSES.has(normalized)) {
    return 'bg-brand-soft text-brand-800 dark:bg-brand-400/15 dark:text-brand-200'
  }
  if (normalized === 'missing' || normalized === 'overdue') {
    return 'bg-[#E03131]/10 text-[#b42318] dark:bg-[#E03131]/20 dark:text-[#ff8787]'
  }
  return 'bg-surface-muted text-muted'
}

function parseDate(value: string): Date | null {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDateTime(value: string | null, locale: string): string | null {
  if (!value) return null
  const date = parseDate(value)
  if (!date) return value
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatDateOnly(value: string, locale: string): string {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  const date = parseDate(dateOnly ? `${value}T00:00:00Z` : value)
  if (!date) return value
  return new Intl.DateTimeFormat(
    locale,
    dateOnly ? { dateStyle: 'medium', timeZone: 'UTC' } : { dateStyle: 'medium' },
  ).format(date)
}

function scorePercent(score: number | undefined): number | null {
  if (typeof score !== 'number' || Number.isNaN(score)) return null
  const percent = score <= 1 ? score * 100 : score
  return Math.max(0, Math.min(100, Math.round(percent)))
}

function Notice({
  children,
  tone = 'info',
}: {
  children: ReactNode
  tone?: keyof typeof NOTICE_TONES
}) {
  return (
    <div
      className={`rounded-card border-2 p-4 text-sm font-bold leading-relaxed ${NOTICE_TONES[tone]}`}
    >
      {children}
    </div>
  )
}

function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone: string
}) {
  return (
    <article className="card-school p-4">
      <p className="text-xs font-extrabold text-muted">{label}</p>
      <p className={`mt-2 font-display text-2xl font-black leading-none ${tone}`}>{value}</p>
      {hint ? <p className="mt-2 text-[11px] font-semibold text-muted">{hint}</p> : null}
    </article>
  )
}

export default function Engagement() {
  const { t, i18n } = useTranslation()

  const [students, setStudents] = useState<StudentEngagement[]>([])
  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [classId, setClassId] = useState('')
  const [classesLoading, setClassesLoading] = useState(true)
  const [classesError, setClassesError] = useState('')
  const [serverNote, setServerNote] = useState('')
  const [query, setQuery] = useState('')
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const rawLocale = i18n.resolvedLanguage ?? i18n.language ?? 'ar'
  const locale = rawLocale.startsWith('ar') ? 'ar-MA' : rawLocale
  const numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 })
  const number = (value: number) => numberFormat.format(value)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setClassesLoading(true)
    setClassesError('')

    apiGet<ClassesResponse>('/teacher/classes', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        setClasses(Array.isArray(data.classes) ? data.classes : [])
        setClassesLoading(false)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setClassesError(
          extractApiError(error)?.message ||
            t('parEngClassesError', { defaultValue: 'تعذّر تحميل قائمة الفصول.' }),
        )
        setClassesLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, t])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setLoadError('')
    setServerNote('')

    apiGet<EngagementResponse>('/teacher/engagement', {
      params: classId ? { classId } : undefined,
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        setStudents(Array.isArray(data.students) ? data.students : [])
        setServerNote(typeof data.note === 'string' ? data.note : '')
        setLoading(false)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setLoadError(
          extractApiError(error)?.message ||
            t('parEngLoadError', { defaultValue: 'تعذّر تحميل بيانات المتابعة. حاول مرة أخرى.' }),
        )
        setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [classId, reloadKey, t])

  const statusLabel = (status: string) => {
    const key = STATUS_KEYS[normalizeStatus(status)]
    if (!key) return t('enumOther', { defaultValue: 'أخرى' })
    return t(key, { defaultValue: STATUS_DEFAULTS[key] ?? 'أخرى' })
  }

  const term = query.trim().toLowerCase()
  const filtered = term
    ? students.filter((student) => student.name.toLowerCase().includes(term))
    : students

  const activeToday = students.filter((student) => student.engagement.todayMinutes > 0).length
  const minutesToday = students.reduce((sum, student) => sum + student.engagement.todayMinutes, 0)
  const averageToday = students.length ? Math.round(minutesToday / students.length) : 0
  const lessonsCompleted = students.reduce((sum, student) => sum + student.lessons.completed, 0)
  const totalXp = students.reduce((sum, student) => sum + student.lessons.totalXp, 0)
  const assignmentsTotal = students.reduce((sum, student) => sum + student.assignments.length, 0)
  const assignmentsDone = students.reduce(
    (sum, student) => sum + student.assignments.filter(isAssignmentDone).length,
    0,
  )
  const completion = assignmentsTotal
    ? Math.round((assignmentsDone / assignmentsTotal) * 100)
    : 0

  const toggleRow = (studentId: string) => {
    setOpenRows((current) => ({ ...current, [studentId]: !current[studentId] }))
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-start justify-between gap-3 p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
            <Clock3 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-xl font-black sm:text-2xl">
              {t('parEngTitle', { defaultValue: 'فضاء التعلّم الموازي' })}
            </h1>
            <p className="mt-1 text-xs font-semibold text-muted">
              {t('parEngHint', {
                defaultValue:
                  'متابعة وقت التعلّم على المنصّة والواجبات وتقدّم الدروس التفاعلية لكل تلميذ.',
              })}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          disabled={loading}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {t('parEngRefresh', { defaultValue: 'تحديث' })}
        </button>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-xs font-bold leading-relaxed text-gold-900 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {t('parEngSeparateNote', {
            defaultValue:
              'وقت المنصّة يُقاس داخل الفضاء الموازي للتعلّم فقط، ولا يُعدّ بديلاً عن حضور التلاميذ في الفصل.',
          })}
        </span>
      </div>

      <section
        aria-label={t('parEngFilters', { defaultValue: 'أدوات التصفية' })}
        className="card-school grid gap-4 p-4 sm:grid-cols-2"
      >
        <div>
          <label
            htmlFor="par-eng-class"
            className="flex items-center gap-1.5 text-xs font-black text-muted"
          >
            {t('parEngClass', { defaultValue: 'الفصل' })}
            {classesLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            ) : null}
          </label>
          <select
            id="par-eng-class"
            value={classId}
            onChange={(event) => setClassId(event.target.value)}
            disabled={classesLoading || Boolean(classesError)}
            className="input-school mt-2"
          >
            <option value="">{t('parEngAllClasses', { defaultValue: 'كل الفصول' })}</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name || cls.id}
              </option>
            ))}
          </select>
          {classesError ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-bold text-[#b42318] dark:text-[#ff8787]">
                {classesError}
              </p>
              <button
                type="button"
                onClick={() => setReloadKey((key) => key + 1)}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <RefreshCw className="h-3 w-3" aria-hidden="true" />
                {t('parEngRetry', { defaultValue: 'إعادة المحاولة' })}
              </button>
            </div>
          ) : null}
        </div>
        <div>
          <label htmlFor="par-eng-search" className="text-xs font-black text-muted">
            {t('parEngSearch', { defaultValue: 'البحث' })}
          </label>
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id="par-eng-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('parEngSearchPlaceholder', { defaultValue: 'ابحث باسم التلميذ…' })}
              className="input-school ps-10"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('parEngLoading', { defaultValue: 'جارٍ تحميل بيانات المتابعة…' })}
        </div>
      ) : loadError ? (
        <div className="space-y-3">
          <Notice tone="error">{loadError}</Notice>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('parEngRetry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : students.length === 0 ? (
        <Notice tone="empty">
          {t('parEngNoData', { defaultValue: 'لا توجد بيانات متابعة متاحة حاليًا.' })}
        </Notice>
      ) : (
        <>
          <PlainSummary
            badge={t('uxSummaryBadge', { defaultValue: 'ملخّص في 10 ثوانٍ' })}
            title={t('uxSummaryTitle', { defaultValue: 'القراءة السريعة' })}
            sentence={t('parEngSummarySentence', {
              active: number(activeToday),
              students: number(students.length),
              average: number(averageToday),
              lessons: number(lessonsCompleted),
              completion: assignmentsTotal ? `${number(completion)}%` : '—',
              defaultValue:
                '{{active}} من {{students}} تلميذًا نشطون اليوم، بمتوسط {{average}} دقيقة، وأنجزوا {{lessons}} درسًا؛ نسبة إنجاز الواجبات {{completion}}.',
            })}
            advisory={t('uxSummaryAdvisory', {
              defaultValue:
                'مؤشرات استرشادية من بيانات النموذج؛ زمن المنصة منفصل عن الحضور، ولا تُتخذ قرارات دون مراجعة بشرية.',
            })}
            detailsLabel={t('uxSummaryDetails', { defaultValue: 'عرض التفاصيل' })}
            detailsHref="#par-eng-table"
            highlights={[
              {
                label: t('parEngActiveToday', { defaultValue: 'نشطون اليوم' }),
                value: number(activeToday),
              },
              {
                label: t('parEngAvgToday', { defaultValue: 'متوسط دقائق اليوم' }),
                value: number(averageToday),
              },
              {
                label: t('parEngCompleted', { defaultValue: 'دروس مكتملة' }),
                value: number(lessonsCompleted),
              },
              {
                label: t('parEngAssignments', { defaultValue: 'الواجبات' }),
                value: assignmentsTotal ? `${number(completion)}%` : '—',
              },
            ]}
          />

          <section
            aria-label={t('parEngKpis', { defaultValue: 'مؤشرات المتابعة' })}
            className="grid grid-cols-2 gap-3 lg:grid-cols-4"
          >
            <Kpi
              label={t('parEngActiveToday', { defaultValue: 'نشطون اليوم' })}
              value={number(activeToday)}
              hint={t('parEngStudentsCount', {
                total: number(students.length),
                defaultValue: 'من أصل {{total}} تلميذًا',
              })}
              tone="text-brand-700 dark:text-brand-300"
            />
            <Kpi
              label={t('parEngAvgToday', { defaultValue: 'متوسط دقائق اليوم' })}
              value={number(averageToday)}
              hint={t('parEngMinutes', { defaultValue: 'دقيقة' })}
              tone="text-gold-700 dark:text-gold-300"
            />
            <Kpi
              label={t('parEngCompleted', { defaultValue: 'دروس مكتملة' })}
              value={number(lessonsCompleted)}
              hint={`${number(totalXp)} ${t('parEngXp', { defaultValue: 'نقاط الخبرة' })}`}
              tone="text-brand-600 dark:text-brand-400"
            />
            <Kpi
              label={t('parEngAssignments', { defaultValue: 'الواجبات' })}
              value={assignmentsTotal ? `${number(completion)}%` : '—'}
              hint={`${t('parEngDoneRatio', { defaultValue: 'المنجز' })}: ${number(
                assignmentsDone,
              )}/${number(assignmentsTotal)}`}
              tone="text-gold-600 dark:text-gold-400"
            />
          </section>

          {serverNote ? (
            <div className="rounded-card border-2 border-line bg-surface-muted p-3 text-xs font-bold leading-relaxed text-muted">
              <span className="font-black text-content">
                {t('parEngNote', { defaultValue: 'ملاحظة' })}:
              </span>{' '}
              {serverNote}
            </div>
          ) : null}

          {filtered.length === 0 ? (
            <Notice tone="empty">
              {t('parEngNoMatches', { defaultValue: 'لا يوجد تلميذ يطابق اسم البحث.' })}
            </Notice>
          ) : (
            <div id="par-eng-table" className="card-school scroll-mt-24 overflow-hidden">
              <div className="overflow-x-auto">
                <table
                  aria-label={t('parEngTableLabel', { defaultValue: 'جدول متابعة التعلّم الموازي' })}
                  className="w-full min-w-[900px]"
                >
                  <thead className="bg-surface-muted">
                    <tr>
                      <th className={TH}>{t('parEngStudent', { defaultValue: 'التلميذ' })}</th>
                      <th className={TH}>{t('parEngToday', { defaultValue: 'دقائق اليوم' })}</th>
                      <th className={TH}>{t('parEngTotalTime', { defaultValue: 'الوقت الإجمالي' })}</th>
                      <th className={TH}>{t('parEngStreak', { defaultValue: 'السلسلة' })}</th>
                      <th className={TH}>{t('parEngLessons', { defaultValue: 'الدروس' })}</th>
                      <th className={TH}>{t('parEngXp', { defaultValue: 'نقاط الخبرة' })}</th>
                      <th className={TH}>{t('parEngAssignments', { defaultValue: 'الواجبات' })}</th>
                      <th className={TH}>{t('parEngLastActive', { defaultValue: 'آخر نشاط' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((student) => {
                      const open = Boolean(openRows[student.studentId])
                      const detailsId = `par-eng-details-${student.studentId}`
                      const subjects = Object.entries(student.engagement.bySubjectMinutes ?? {})
                        .filter(([, minutes]) => typeof minutes === 'number')
                        .sort((a, b) => b[1] - a[1])
                      const subjectMax = subjects.reduce(
                        (max, [, minutes]) => Math.max(max, minutes),
                        0,
                      ) || 1
                      const doneAssignments = student.assignments.filter(isAssignmentDone).length
                      const lastActive = formatDateTime(student.engagement.lastActive, locale)
                      const averageScore = scorePercent(student.lessons.averageScore)
                      const lessonRows = (student.lessons.rows ?? []).slice(0, 5)
                      const studentNote = student.engagement.note?.trim()

                      return (
                        <Fragment key={student.studentId}>
                          <tr
                            className={`border-t-2 border-line align-top transition-colors ${
                              open
                                ? 'bg-brand-soft/50 dark:bg-brand-400/5'
                                : 'hover:bg-surface-muted/60'
                            }`}
                          >
                            <td className={TD}>
                              <button
                                type="button"
                                onClick={() => toggleRow(student.studentId)}
                                aria-expanded={open}
                                aria-controls={open ? detailsId : undefined}
                                aria-label={`${
                                  open
                                    ? t('parEngHideDetails', { defaultValue: 'إخفاء التفاصيل' })
                                    : t('parEngShowDetails', { defaultValue: 'عرض التفاصيل' })
                                } — ${student.name}`}
                                className="flex w-full min-w-40 items-center justify-between gap-2 text-start"
                              >
                                <span className="font-extrabold text-content">{student.name}</span>
                                <ChevronDown
                                  className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                                    open ? 'rotate-180' : ''
                                  }`}
                                  aria-hidden="true"
                                />
                              </button>
                            </td>
                            <td className={TD_TODAY}>{number(student.engagement.todayMinutes)}</td>
                            <td className={TD}>{number(student.engagement.totalMinutes)}</td>
                            <td className={TD}>
                              {number(student.engagement.streakDays)}{' '}
                              {t('parEngDay', { defaultValue: 'يوم' })}
                            </td>
                            <td className={TD}>{number(student.lessons.completed)}</td>
                            <td className={TD}>{number(student.lessons.totalXp)}</td>
                            <td className={TD}>
                              {number(doneAssignments)}/{number(student.assignments.length)}
                            </td>
                            <td className={TD}>
                              {lastActive ?? (
                                <span className="text-muted">
                                  {t('parEngNeverActive', { defaultValue: 'لم يسجّل نشاطًا بعد' })}
                                </span>
                              )}
                            </td>
                          </tr>
                          {open ? (
                            <tr className="border-t-2 border-line bg-surface-muted/70">
                              <td colSpan={8} id={detailsId} className="px-4 py-4">
                                {studentNote ? (
                                  <p className="mb-3 rounded-card border-2 border-line bg-surface p-2.5 text-[11px] font-bold leading-relaxed text-muted">
                                    {studentNote}
                                  </p>
                                ) : null}
                                <div className="grid gap-4 lg:grid-cols-3">
                                  <section className="rounded-card border-2 border-line bg-surface p-3">
                                    <h3 className="text-xs font-black">
                                      {t('parEngSubjectTime', { defaultValue: 'الوقت حسب المادة' })}
                                    </h3>
                                    {subjects.length ? (
                                      <ul className="mt-3 space-y-2.5">
                                        {subjects.map(([subject, minutes]) => {
                                          const width = minutes > 0
                                            ? Math.max(2, Math.round((minutes / subjectMax) * 100))
                                            : 0
                                          return (
                                            <li key={subject}>
                                              <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                                                <span className="truncate">{subject}</span>
                                                <span className="shrink-0 text-muted">
                                                  {number(minutes)}{' '}
                                                  {t('parEngMinutes', { defaultValue: 'دقيقة' })}
                                                </span>
                                              </div>
                                              <div className="mt-1 h-2 overflow-hidden rounded-full bg-line">
                                                <div
                                                  className="h-full rounded-full bg-brand-500"
                                                  style={{ width: `${width}%` }}
                                                />
                                              </div>
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    ) : (
                                      <p className="mt-2 text-[11px] font-semibold text-muted">
                                        {t('parEngNoSubjects', {
                                          defaultValue: 'لا توجد دقائق مسجّلة حسب المادة.',
                                        })}
                                      </p>
                                    )}
                                  </section>

                                  <section className="rounded-card border-2 border-line bg-surface p-3">
                                    <div className="flex items-center justify-between gap-2">
                                      <h3 className="text-xs font-black">
                                        {t('parEngRecentLessons', {
                                          defaultValue: 'آخر الدروس التفاعلية',
                                        })}
                                      </h3>
                                      <span className="text-[10px] font-bold text-muted">
                                        {t('parEngScore', { defaultValue: 'النتيجة' })}:{' '}
                                        {averageScore !== null ? `${averageScore}%` : '—'}
                                      </span>
                                    </div>
                                    {lessonRows.length ? (
                                      <ul className="mt-3 space-y-2">
                                        {lessonRows.map((lesson, index) => {
                                          const score = scorePercent(lesson.score)
                                          return (
                                            <li
                                              key={`${lesson.lessonId}-${index}`}
                                              className="rounded-xl border-2 border-line bg-surface-muted/60 p-2"
                                            >
                                              <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                  <p className="truncate text-[11px] font-extrabold">
                                                    {lesson.lesson || lesson.unit || lesson.lessonId}
                                                  </p>
                                                  <p className="mt-0.5 text-[10px] font-semibold text-muted">
                                                    {[lesson.subject, lesson.unit]
                                                      .filter(Boolean)
                                                      .join(' · ') || lesson.lessonId}
                                                  </p>
                                                </div>
                                                <div className="shrink-0 text-end">
                                                  <p className="text-[11px] font-black">
                                                    {score !== null ? `${number(score)}%` : '—'}
                                                  </p>
                                                  <p
                                                    className={`text-[10px] font-bold ${
                                                      lesson.completed
                                                        ? 'text-brand-700 dark:text-brand-300'
                                                        : 'text-muted'
                                                    }`}
                                                  >
                                                    {lesson.completed
                                                      ? t('parEngLessonCompleted', {
                                                          defaultValue: 'مكتمل',
                                                        })
                                                      : t('parEngLessonInProgress', {
                                                          defaultValue: 'قيد الإنجاز',
                                                        })}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                                                <div
                                                  className={`h-full rounded-full ${
                                                    lesson.completed ? 'bg-brand-500' : 'bg-gold-400'
                                                  }`}
                                                  style={{ width: `${score ?? 0}%` }}
                                                />
                                              </div>
                                              {typeof lesson.xp === 'number' ? (
                                                <p className="mt-1 text-[10px] font-semibold text-muted">
                                                  {number(lesson.xp)}{' '}
                                                  {t('parEngXp', { defaultValue: 'نقاط الخبرة' })}
                                                </p>
                                              ) : null}
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    ) : (
                                      <p className="mt-2 text-[11px] font-semibold text-muted">
                                        {t('parEngNoLessons', {
                                          defaultValue: 'لا توجد دروس تفاعلية بعد.',
                                        })}
                                      </p>
                                    )}
                                  </section>

                                  <section className="rounded-card border-2 border-line bg-surface p-3">
                                    <div className="flex items-center justify-between gap-2">
                                      <h3 className="text-xs font-black">
                                        {t('parEngAssignmentStatus', {
                                          defaultValue: 'حالة الواجبات',
                                        })}
                                      </h3>
                                      <span className="text-[10px] font-bold text-muted">
                                        {number(doneAssignments)}/{number(student.assignments.length)}
                                      </span>
                                    </div>
                                    {student.assignments.length ? (
                                      <ul className="mt-3 space-y-2">
                                        {student.assignments.map((assignment) => (
                                          <li
                                            key={assignment.id}
                                            className="rounded-xl border-2 border-line bg-surface-muted/60 p-2"
                                          >
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                              <div className="min-w-0">
                                                <p className="truncate text-[11px] font-extrabold">
                                                  {assignment.title || assignment.id}
                                                </p>
                                                <p className="mt-0.5 text-[10px] font-semibold text-muted">
                                                  {assignment.subject}
                                                  {assignment.subject && assignment.dueDate
                                                    ? ' · '
                                                    : null}
                                                  {assignment.dueDate
                                                    ? `${t('parEngDue', {
                                                        defaultValue: 'الاستحقاق',
                                                      })}: ${formatDateOnly(
                                                        assignment.dueDate,
                                                        locale,
                                                      )}`
                                                    : null}
                                                </p>
                                              </div>
                                              <span
                                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${statusTone(
                                                  assignment.status,
                                                )}`}
                                              >
                                                {statusLabel(assignment.status)}
                                              </span>
                                            </div>
                                            {assignment.grade != null ||
                                            assignment.submittedAt ? (
                                              <p className="mt-1.5 text-[10px] font-semibold text-muted">
                                                {assignment.grade != null
                                                  ? `${t('parEngGrade', {
                                                      defaultValue: 'النقطة',
                                                    })}: ${number(assignment.grade)}`
                                                  : null}
                                                {assignment.grade != null &&
                                                assignment.submittedAt
                                                  ? ' · '
                                                  : null}
                                                {assignment.submittedAt
                                                  ? `${t('parEngSubmitted', {
                                                      defaultValue: 'أُرسل في',
                                                    })}: ${formatDateTime(
                                                      assignment.submittedAt,
                                                      locale,
                                                    )}`
                                                  : null}
                                              </p>
                                            ) : null}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="mt-2 text-[11px] font-semibold text-muted">
                                        {t('parEngNoAssignments', {
                                          defaultValue: 'لا توجد واجبات مرتبطة.',
                                        })}
                                      </p>
                                    )}
                                  </section>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
