import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarCheck2, CheckCircle2, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'
import type { Student } from '../../types'

type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused'
const STATUSES: AttendanceStatus[] = ['present', 'late', 'absent', 'excused']

interface TeacherClass {
  id: string
  name?: string
  level?: string
  students: Student[]
}
interface ClassesResponse {
  classes: TeacherClass[]
}
interface AttendanceRecord {
  id?: string
  studentId: string
  date: string
  status: AttendanceStatus
  note?: string | null
}
interface AttendanceResponse {
  attendance: AttendanceRecord[]
}
interface BulkResult {
  studentId: string
  ok: boolean
  error?: string
  attendanceId?: string
  status?: AttendanceStatus
}
interface BulkResponse {
  results: BulkResult[]
  total: number
  success: number
}
interface Entry {
  studentId: string
  date: string
  status: AttendanceStatus
  note: string
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

export default function Attendance() {
  const { t } = useTranslation()
  const today = () => new Date().toISOString().slice(0, 10)

  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(today)
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [results, setResults] = useState<BulkResult[] | null>(null)
  const [registerReloadKey, setRegisterReloadKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(null)
    apiGet<ClassesResponse>('/teacher/classes')
      .then((data) => {
        if (!active) return
        const list = data.classes || []
        setClasses(list)
        if (list.length) setClassId((current) => current || list[0].id)
      })
      .catch((err: unknown) => {
        if (active) {
          setLoadError(messageOf(err, t('loadError', { defaultValue: 'تعذّر تحميل الفصول.' })))
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
    if (!classId) return
    let active = true
    setRegisterLoading(true)
    setRegisterError(null)
    setResults(null)
    apiGet<AttendanceResponse>('/teacher/attendance', { params: { classId, date } })
      .then((data) => {
        if (!active) return
        const nextStatus: Record<string, AttendanceStatus> = {}
        const nextNote: Record<string, string> = {}
        ;(data.attendance || []).forEach((record) => {
          nextStatus[record.studentId] = record.status
          nextNote[record.studentId] = record.note || ''
        })
        setStatuses(nextStatus)
        setNotes(nextNote)
      })
      .catch((err: unknown) => {
        if (active) {
          setRegisterError(messageOf(err, t('registerError', { defaultValue: 'تعذّر تحميل سجل الحضور.' })))
        }
      })
      .finally(() => {
        if (active) setRegisterLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, date, registerReloadKey])

  const students = classes.find((cls) => cls.id === classId)?.students || []
  const statusLabel = (status: AttendanceStatus) => {
    if (status === 'present') return t('enumPresent', { defaultValue: 'حاضر' })
    if (status === 'late') return t('enumLate', { defaultValue: 'متأخر' })
    if (status === 'absent') return t('enumAbsent', { defaultValue: 'غائب' })
    return t('enumExcused', { defaultValue: 'مبرر' })
  }

  const handleSave = async () => {
    setSaveError(null)
    setResults(null)
    if (!students.length) {
      setSaveError(t('noStudentsToSave', { defaultValue: 'لا يوجد تلاميذ في الفصل المحدد.' }))
      return
    }
    const entries: Entry[] = students.map((student) => ({
      studentId: student.id,
      date,
      status: statuses[student.id] || 'present',
      note: (notes[student.id] || '').trim(),
    }))
    setSaving(true)
    try {
      const response = await apiPost<BulkResponse, { entries: Entry[] }>('/teacher/attendance', { entries })
      setResults(response.results || [])
    } catch (err: unknown) {
      setSaveError(messageOf(err, t('saveError', { defaultValue: 'تعذّر حفظ سجل الحضور.' })))
    } finally {
      setSaving(false)
    }
  }

  const nameOf = (id: string) => students.find((student) => student.id === id)?.name || id

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('attendanceTitle', { defaultValue: 'سجل الحضور اليومي' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('attendanceHint', { defaultValue: 'سجّل الحضور دفعة واحدة لتلاميذ فصلك.' })}
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300">
          <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
        </span>
      </section>

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('loading', { defaultValue: 'جارٍ التحميل…' })}
        </div>
      ) : loadError ? (
        <div className="space-y-3">
          <Notice error>{loadError}</Notice>
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
        <>
          <section className="card-school grid gap-4 p-5 sm:grid-cols-2">
            <div>
              <label className="text-xs font-black text-muted" htmlFor="attendance-class">
                {t('chooseClass', { defaultValue: 'الفصل' })}
              </label>
              <select
                id="attendance-class"
                className="input-school mt-2"
                value={classId}
                onChange={(event) => setClassId(event.target.value)}
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name || cls.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-muted" htmlFor="attendance-date">
                {t('date', { defaultValue: 'التاريخ' })}
              </label>
              <input
                id="attendance-date"
                type="date"
                className="input-school mt-2"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
          </section>

          <section className="card-school p-5">
            <h2 className="font-display text-lg font-black">
              {t('dailyRegister', { defaultValue: 'السجل اليومي' })}
              <span className="ms-2 text-xs font-bold text-muted">({date})</span>
            </h2>
            {registerLoading ? (
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-muted">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {t('loading', { defaultValue: 'جارٍ التحميل…' })}
              </div>
            ) : registerError ? (
              <div className="mt-4 space-y-3">
                <Notice error>{registerError}</Notice>
                <button
                  type="button"
                  onClick={() => setRegisterReloadKey((key) => key + 1)}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  {t('retry', { defaultValue: 'إعادة المحاولة' })}
                </button>
              </div>
            ) : students.length === 0 ? (
              <div className="mt-4">
                <Notice>{t('noStudents', { defaultValue: 'لا تلاميذ في هذا الفصل.' })}</Notice>
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {students.map((student) => {
                  const status = statuses[student.id] || 'present'
                  return (
                    <li
                      key={student.id}
                      className="rounded-card border-2 border-line bg-surface p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="text-sm font-extrabold">{student.name}</span>
                        <select
                          aria-label={`${student.name} — ${t('status', { defaultValue: 'الحالة' })}`}
                          className="input-school w-auto min-w-32 py-2 text-sm"
                          value={status}
                          onChange={(event) =>
                            setStatuses((current) => ({
                              ...current,
                              [student.id]: event.target.value as AttendanceStatus,
                            }))
                          }
                        >
                          {STATUSES.map((option) => (
                            <option key={option} value={option}>
                              {statusLabel(option)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        aria-label={`${student.name} — ${t('note', { defaultValue: 'ملاحظة' })}`}
                        className="input-school mt-2 py-2 text-sm"
                        value={notes[student.id] || ''}
                        onChange={(event) =>
                          setNotes((current) => ({ ...current, [student.id]: event.target.value }))
                        }
                        placeholder={t('notePlaceholder', { defaultValue: 'ملاحظة اختيارية…' })}
                      />
                    </li>
                  )
                })}
              </ul>
            )}

            {saveError ? (
              <div className="mt-4">
                <Notice error>{saveError}</Notice>
              </div>
            ) : null}

            {results ? (
              <div className="mt-4 rounded-card border-2 border-line bg-surface-muted p-4">
                <p className="text-sm font-black">
                  {t('saveResults', { defaultValue: 'نتيجة الحفظ' })}:{' '}
                  {results.filter((item) => item.ok).length}/{results.length}
                </p>
                <ul className="mt-2 space-y-1">
                  {results.map((item) => (
                    <li key={item.studentId} className="flex items-center gap-2 text-xs font-bold">
                      {item.ok ? (
                        <CheckCircle2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-4 w-4 text-[#E03131]" aria-hidden="true" />
                      )}
                      <span>{nameOf(item.studentId)}</span>
                      {!item.ok ? (
                        <span className="text-[#E03131]">— {item.error || 'forbidden'}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {students.length ? (
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="btn-chunky btn-chunky--primary mt-4 w-full sm:w-auto"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                )}
                {t('saveAttendance', { defaultValue: 'حفظ السجل' })}
              </button>
            ) : null}
          </section>
        </>
      )}
    </div>
  )
}
