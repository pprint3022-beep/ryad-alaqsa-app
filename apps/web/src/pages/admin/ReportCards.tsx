import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  Clock,
  Clock3,
  Flame,
  GraduationCap,
  Loader2,
  MessageSquare,
  Printer,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
} from 'lucide-react'
import { apiGet } from '../../lib/api'
import { PlainSummary } from '../../components/ux'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'
type SubjectStatus = 'mastered' | 'in_progress' | 'gap' | 'unknown'

interface AdminStudent {
  id: string
  name: string
  level?: string
  class?: string
  levelId?: string
  classId?: string
}

interface ReportSubject {
  subject: string
  score: number | null
  scale: number | null
  competencyMastery: number | null
  status: SubjectStatus
}

interface ReportComment {
  summary: string
  agent?: string
  at?: string
  /** Optional defence-in-depth fields: the API only returns approved comments. */
  approved?: boolean
  shared?: boolean
  visible?: boolean
  pending?: boolean
  status?: string
}

interface ReportAttendance {
  rate: number | null
  present: number
  absent: number
  late: number
  total: number
}

interface ReportEngagement {
  totalMinutes: number
  todayMinutes: number
  streakDays: number
}

interface ReportLessons {
  completed: number
  totalXp: number
}

interface ReportAssignments {
  done: number
  total: number
}

interface ReportCard {
  student: { id: string; name: string; level?: string; class?: string }
  term: string
  terms: string[]
  subjects: ReportSubject[]
  average: number | null
  attendance: ReportAttendance
  engagement: ReportEngagement | null
  lessons: ReportLessons | null
  assignments: ReportAssignments
  comments: ReportComment[]
  note: string
  advisory: boolean
}

interface StudentsResponse {
  students: AdminStudent[]
}

interface ReportCardResponse {
  reportCard: ReportCard | null
}

const DEFAULT_TERM = 'الفصل 1'

/** Any explicit status must be an approved one; unknown statuses are never shown. */
const APPROVED_COMMENT_STATUSES = new Set([
  'approved',
  'published',
  'shared',
  'visible',
  'accepted',
])

const STATUS_TONES: Record<SubjectStatus, string> = {
  mastered: 'bg-brand-100 text-brand-800 dark:bg-brand-400/15 dark:text-brand-300',
  in_progress: 'bg-gold-100 text-gold-800 dark:bg-gold-400/15 dark:text-gold-200',
  gap: 'bg-[#E03131]/10 text-[#E03131] dark:text-[#ff8787]',
  unknown: 'bg-surface-muted text-muted',
}

const TH = 'px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'px-3 py-2 text-[11px] font-semibold text-content'

function shareableComments(comments: ReportComment[]): ReportComment[] {
  const list = Array.isArray(comments) ? comments : []
  return list.filter((comment) => {
    if (!comment || typeof comment.summary !== 'string' || !comment.summary.trim()) return false
    if (comment.approved === false || comment.shared === false) return false
    if (comment.visible === false || comment.pending === true) return false
    const status = typeof comment.status === 'string' ? comment.status.toLowerCase() : ''
    return !status || APPROVED_COMMENT_STATUSES.has(status)
  })
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode
  label: string
  value: string
  hint?: ReactNode
}) {
  return (
    <article className="rounded-card border-2 border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-extrabold text-muted">{label}</p>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-400/10 dark:text-brand-300">
          {icon}
        </span>
      </div>
      <p className="mt-2 font-display text-xl font-black leading-tight text-content">{value}</p>
      {hint ? <div className="mt-2 text-[11px] font-semibold text-muted">{hint}</div> : null}
    </article>
  )
}

export default function ReportCards() {
  const { t, i18n } = useTranslation()
  const loadError = t('rcLoadError', {
    defaultValue: 'تعذّر تحميل بطاقة التقرير. حاول مرة أخرى.',
  })

  const locale = i18n.resolvedLanguage ?? 'ar'
  const number = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)

  const [students, setStudents] = useState<AdminStudent[]>([])
  const [studentsStatus, setStudentsStatus] = useState<LoadStatus>('loading')
  const [studentsError, setStudentsError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('')

  const [term, setTerm] = useState(DEFAULT_TERM)
  const [terms, setTerms] = useState<string[]>([DEFAULT_TERM])

  const [report, setReport] = useState<ReportCard | null>(null)
  const [reportStatus, setReportStatus] = useState<LoadStatus>('idle')
  const [reportError, setReportError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const retry = useCallback(() => setReloadKey((value) => value + 1), [])
  const handlePrint = useCallback(() => window.print(), [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setStudentsStatus('loading')
    setStudentsError('')

    apiGet<StudentsResponse>('/admin/students', { signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data.students) ? data.students : []
        setStudents(list)
        setSelectedId((current) =>
          current && list.some((student) => student.id === current)
            ? current
            : list[0]?.id ?? '',
        )
        setStudentsStatus('ready')
      })
      .catch(() => {
        if (cancelled || controller.signal.aborted) return
        setStudents([])
        setStudentsError(loadError)
        setStudentsStatus('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [reloadKey, loadError])

  useEffect(() => {
    if (!selectedId || studentsStatus !== 'ready') {
      setReport(null)
      setReportStatus('idle')
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setReport(null)
    setReportStatus('loading')
    setReportError('')

    apiGet<ReportCardResponse>('/admin/report-card', {
      params: { studentId: selectedId, term },
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        const card = data.reportCard ?? null
        setReport(card)
        setReportStatus('ready')

        if (card) {
          const remoteTerms = Array.isArray(card.terms)
            ? card.terms.filter((item) => typeof item === 'string' && item.trim())
            : []
          setTerms((current) =>
            Array.from(
              new Set([...remoteTerms, card.term, ...current].filter((item) => item.trim())),
            ),
          )
        }
      })
      .catch(() => {
        if (cancelled || controller.signal.aborted) return
        setReportError(loadError)
        setReportStatus('error')
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [selectedId, term, reloadKey, studentsStatus, loadError])

  const visibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return students
    return students.filter((student) =>
      [student.name, student.level, student.class]
        .filter((value): value is string => typeof value === 'string')
        .some((value) => value.toLowerCase().includes(query)),
    )
  }, [students, search])

  const selectedStudent = students.find((student) => student.id === selectedId)

  const termOptions = useMemo(
    () => Array.from(new Set([term, ...terms].filter((item) => item.trim()))),
    [term, terms],
  )

  const formatMastery = (value: number | null): string => {
    if (value === null || !Number.isFinite(value)) return '—'
    const percent = value <= 1 ? value * 100 : value
    return `${number(Math.round(Math.min(100, Math.max(0, percent))))}%`
  }

  const statusLabel = (status: SubjectStatus): string => {
    switch (status) {
      case 'mastered':
        return t('rcStatusMastered', { defaultValue: 'متقن' })
      case 'in_progress':
        return t('rcStatusInProgress', { defaultValue: 'قيد التقدم' })
      case 'gap':
        return t('rcStatusGap', { defaultValue: 'فجوة' })
      default:
        return t('rcStatusUnknown', { defaultValue: 'غير محدد' })
    }
  }

  const comments = report ? shareableComments(report.comments) : []
  const subjects = report?.subjects ?? []
  const masteredCount = subjects.filter((item) => item.status === 'mastered').length
  const gapCount = subjects.filter((item) => item.status === 'gap').length
  const reportSummary = report
    ? t('rcSummarySentence', {
        average: report.average === null ? '—' : number(report.average),
        attendance:
          report.attendance.rate === null
            ? '—'
            : `${number(Math.round(report.attendance.rate))}%`,
        mastered: number(masteredCount),
        total: number(subjects.length),
        gaps: number(gapCount),
        defaultValue:
          'المعدل {{average}} والحضور {{attendance}}؛ أتقن التلميذ {{mastered}} من {{total}} مادة، ويحتاج متابعة في {{gaps}} مادة.',
      })
    : ''

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8 print:hidden">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
              <GraduationCap className="h-6 w-6 text-gold-300" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-black sm:text-3xl">
                {t('rcTitle', { defaultValue: 'بطاقات التقارير الفصلية' })}
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold text-white/80">
                {t('rcSubtitle', {
                  defaultValue: 'درجات وكفايات وحضور وتفاعل في بطاقة واحدة لكل فصل دراسي.',
                })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={retry}
            disabled={studentsStatus === 'loading' || reportStatus === 'loading'}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
          >
            {studentsStatus === 'loading' || reportStatus === 'loading' ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            )}
            {t('rcRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      </section>

      <section className="card-school p-4 sm:p-5 print:hidden">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label
              htmlFor="rc-admin-term"
              className="mb-1 block text-[11px] font-extrabold text-muted"
            >
              {t('rcTerm', { defaultValue: 'الفصل الدراسي' })}
            </label>
            <select
              id="rc-admin-term"
              className="input-school"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            >
              {termOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="rc-admin-student"
              className="mb-1 block text-[11px] font-extrabold text-muted"
            >
              {t('rcStudent', { defaultValue: 'التلميذ' })}
            </label>
            <select
              id="rc-admin-student"
              className="input-school"
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              disabled={studentsStatus !== 'ready' || students.length === 0}
            >
              <option value="">{t('rcSelectStudent', { defaultValue: 'اختر تلميذًا' })}</option>
              {selectedStudent && !visibleStudents.some((student) => student.id === selectedStudent.id) ? (
                <option value={selectedStudent.id}>{selectedStudent.name}</option>
              ) : null}
              {visibleStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                  {[student.level, student.class].filter(Boolean).length
                    ? ` — ${[student.level, student.class].filter(Boolean).join(' • ')}`
                    : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="rc-admin-search"
              className="mb-1 block text-[11px] font-extrabold text-muted"
            >
              {t('rcSearch', { defaultValue: 'بحث عن تلميذ' })}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="rc-admin-search"
                type="search"
                className="input-school ps-10"
                placeholder={t('rcSearch', { defaultValue: 'بحث عن تلميذ' })}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                disabled={studentsStatus !== 'ready' || students.length === 0}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t-2 border-line pt-4">
          <button
            type="button"
            onClick={handlePrint}
            disabled={!report}
            className="btn-chunky btn-chunky--primary btn-chunky--sm"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            {t('rcPrint', { defaultValue: 'طباعة' })}
          </button>
          <p className="max-w-xl text-[11px] font-semibold text-muted">
            {t('rcPreviewOnly', {
              defaultValue: 'الطباعة معاينة فقط، ولا تُعتمد النتائج قبل المراجعة والاعتماد البشري.',
            })}
          </p>
        </div>
      </section>

      {studentsStatus === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-[#E03131]">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {studentsError || loadError}
          </p>
          <button
            type="button"
            onClick={retry}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('rcRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : null}

      {studentsStatus === 'ready' && students.length === 0 ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('rcNoData', { defaultValue: 'لا توجد بيانات لعرضها.' })}
        </p>
      ) : null}

      {reportStatus === 'loading' ? (
        <div
          className="card-school space-y-4 p-5"
          role="status"
          aria-live="polite"
          aria-label={t('rcTitle', { defaultValue: 'بطاقات التقارير الفصلية' })}
        >
          <div className="h-5 w-1/3 animate-pulse rounded-full bg-line" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[0, 1, 2, 3, 4].map((key) => (
              <div key={key} className="h-24 animate-pulse rounded-card bg-surface-muted" />
            ))}
          </div>
          <div className="h-40 animate-pulse rounded-card bg-surface-muted" />
        </div>
      ) : null}

      {reportStatus === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-[#E03131]">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {reportError || loadError}
          </p>
          <button
            type="button"
            onClick={retry}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('rcRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : null}

      {reportStatus === 'ready' && !report ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('rcNoData', { defaultValue: 'لا توجد بيانات لعرضها.' })}
        </p>
      ) : null}

      {reportStatus === 'ready' && report ? (
        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {t('rcPreviewOnly', {
                defaultValue:
                  'الطباعة معاينة فقط، ولا تُعتمد النتائج قبل المراجعة والاعتماد البشري.',
              })}
            </span>
          </div>

          <PlainSummary
            badge={t('uxSummaryBadge', { defaultValue: 'ملخّص في 10 ثوانٍ' })}
            title={t('uxSummaryTitle', { defaultValue: 'القراءة السريعة' })}
            sentence={reportSummary}
            advisory={t('uxSummaryAdvisory', {
              defaultValue:
                'مؤشرات استرشادية من بيانات النموذج؛ زمن المنصة منفصل عن الحضور، ولا تُتخذ قرارات دون مراجعة بشرية.',
            })}
            detailsLabel={t('uxSummaryDetails', { defaultValue: 'عرض التفاصيل' })}
            detailsHref="#rc-subject-details"
            highlights={[
              {
                label: t('rcAverage', { defaultValue: 'المعدل' }),
                value: report.average === null ? '—' : number(report.average),
              },
              {
                label: t('rcAttendance', { defaultValue: 'الحضور' }),
                value:
                  report.attendance.rate === null
                    ? '—'
                    : `${number(Math.round(report.attendance.rate))}%`,
              },
              {
                label: t('rcStatusMastered', { defaultValue: 'متقن' }),
                value: number(masteredCount),
              },
              {
                label: t('rcStatusGap', { defaultValue: 'فجوة' }),
                value: number(gapCount),
              },
            ]}
          />

          <section className="card-school p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                  <GraduationCap className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold text-muted">
                    {t('rcStudent', { defaultValue: 'التلميذ' })}
                  </p>
                  <h2 className="truncate font-display text-xl font-black text-content">
                    {report.student.name}
                  </h2>
                  <p className="mt-0.5 text-xs font-semibold text-muted">
                    {[report.student.level, report.student.class].filter(Boolean).join(' • ') ||
                      '—'}
                  </p>
                </div>
              </div>
              <div className="rounded-card border-2 border-line bg-surface-muted px-4 py-2">
                <p className="text-[10px] font-extrabold text-muted">
                  {t('rcTerm', { defaultValue: 'الفصل الدراسي' })}
                </p>
                <p className="mt-0.5 text-sm font-black text-content">{report.term}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              icon={<GraduationCap className="h-4 w-4" aria-hidden="true" />}
              label={t('rcAverage', { defaultValue: 'المعدل' })}
              value={report.average === null ? '—' : number(report.average)}
            />
            <StatCard
              icon={<CalendarCheck2 className="h-4 w-4" aria-hidden="true" />}
              label={t('rcAttendance', { defaultValue: 'الحضور' })}
              value={
                report.attendance.rate === null
                  ? '—'
                  : `${number(Math.round(report.attendance.rate))}%`
              }
              hint={
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                    {number(report.attendance.present)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <UserX className="h-3.5 w-3.5 text-[#E03131]" aria-hidden="true" />
                    {number(report.attendance.absent)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
                    {number(report.attendance.late)}
                  </span>
                  <span className="text-muted">/ {number(report.attendance.total)}</span>
                </div>
              }
            />
            <StatCard
              icon={<Clock3 className="h-4 w-4" aria-hidden="true" />}
              label={t('rcPlatformTime', { defaultValue: 'وقت المنصة' })}
              value={
                report.engagement
                  ? `${number(report.engagement.totalMinutes)} ${t('rcMinutes', { defaultValue: 'دقيقة' })}`
                  : '—'
              }
              hint={
                report.engagement ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                      {number(report.engagement.todayMinutes)}{' '}
                      {t('rcMinutes', { defaultValue: 'دقيقة' })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
                      {number(report.engagement.streakDays)}
                    </span>
                  </div>
                ) : null
              }
            />
            <StatCard
              icon={<BookOpen className="h-4 w-4" aria-hidden="true" />}
              label={t('rcLessons', { defaultValue: 'الدروس المكتملة' })}
              value={report.lessons ? number(report.lessons.completed) : '—'}
              hint={
                report.lessons
                  ? `${number(report.lessons.totalXp)} ${t('rcXp', { defaultValue: 'نقطة خبرة' })}`
                  : null
              }
            />
            <StatCard
              icon={<ClipboardList className="h-4 w-4" aria-hidden="true" />}
              label={t('rcAssignments', { defaultValue: 'الواجبات' })}
              value={
                report.assignments.total > 0
                  ? `${number(report.assignments.done)} / ${number(report.assignments.total)}`
                  : '—'
              }
              hint={
                report.assignments.total > 0
                  ? `${number(
                      Math.round(
                        (report.assignments.done / report.assignments.total) * 100,
                      ),
                    )}%`
                  : null
              }
            />
          </div>

          <section id="rc-subject-details" className="card-school scroll-mt-24 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-black text-content">
              <ClipboardList className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {t('rcSubject', { defaultValue: 'المادة' })}
            </h2>
            <div className="overflow-x-auto rounded-card border-2 border-line bg-surface">
              <table className="w-full" aria-label={t('rcTitle', { defaultValue: 'بطاقات التقارير الفصلية' })}>
                <thead className="bg-surface-muted">
                  <tr>
                    <th scope="col" className={TH}>
                      {t('rcSubject', { defaultValue: 'المادة' })}
                    </th>
                    <th scope="col" className={TH}>
                      {t('rcScore', { defaultValue: 'الدرجة' })}
                    </th>
                    <th scope="col" className={TH}>
                      {t('rcMastery', { defaultValue: 'الإتقان' })}
                    </th>
                    <th scope="col" className={TH}>
                      {t('rcStatus', { defaultValue: 'الحالة' })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className={`${TD} text-center text-muted`}>
                        {t('rcNoData', { defaultValue: 'لا توجد بيانات لعرضها.' })}
                      </td>
                    </tr>
                  ) : (
                    subjects.map((subject, index) => (
                      <tr
                        key={`${subject.subject}-${index}`}
                        className="border-t-2 border-line"
                      >
                        <td className={TD}>{subject.subject}</td>
                        <td className={TD}>
                          {subject.score === null
                            ? '—'
                            : `${number(subject.score)}${
                                subject.scale === null ? '' : ` / ${number(subject.scale)}`
                              }`}
                        </td>
                        <td className={TD}>{formatMastery(subject.competencyMastery)}</td>
                        <td className={TD}>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black ${
                              STATUS_TONES[subject.status] ?? STATUS_TONES.unknown
                            }`}
                          >
                            {statusLabel(subject.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card-school p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-black text-content">
              <MessageSquare className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {t('rcComments', { defaultValue: 'ملاحظات المعلم' })}
            </h2>
            {comments.length === 0 ? (
              <p className="text-xs font-semibold text-muted">
                {t('rcNoComments', {
                  defaultValue: 'لا توجد ملاحظات معتمدة للمشاركة.',
                })}
              </p>
            ) : (
              <ul className="space-y-2">
                {comments.map((comment, index) => (
                  <li
                    key={`${comment.at ?? 'comment'}-${index}`}
                    className="rounded-card border-2 border-line bg-surface-muted p-3"
                  >
                    <p className="whitespace-pre-line text-xs font-semibold leading-relaxed text-content">
                      {comment.summary}
                    </p>
                    {comment.agent || comment.at ? (
                      <p className="mt-1 text-[10px] font-bold text-muted">
                        {[comment.agent, comment.at].filter(Boolean).join(' • ')}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card-school p-5">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-black text-content">
              <ShieldCheck className="h-4 w-4 text-gold-600" aria-hidden="true" />
              {t('rcNote', { defaultValue: 'ملاحظة التقرير' })}
            </h2>
            <p className="whitespace-pre-line text-xs font-semibold leading-relaxed text-muted">
              {report.note || '—'}
            </p>
          </section>
        </div>
      ) : null}
    </div>
  )
}
