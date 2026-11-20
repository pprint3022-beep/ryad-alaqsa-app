import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Activity,
  AlertTriangle,
  HeartPulse,
  Loader2,
  RefreshCw,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { apiGet } from '../../lib/api'

interface ScopedStudent {
  id?: string
  name?: string
  studentId?: string
}
interface ClassItem {
  id?: string
  name?: string
  level?: string
  students?: ScopedStudent[]
}
interface ClassesResponse {
  classes: ClassItem[]
}
interface Checkin {
  id?: string
  studentId?: string
  mood?: number
  energy?: number
  stress?: number
  notes?: string
  checkedAt?: string
  checkedBy?: string
}
interface HistoryResponse {
  history: Checkin[]
  total?: number
}
interface Pair {
  id?: string
  mentorId?: string
  menteeId?: string
  subject?: string
  status?: string
  createdAt?: string
}
interface PairsResponse {
  pairs: Pair[]
}
interface StudentOption {
  id: string
  name: string
}

const TH = 'px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'px-3 py-2 text-[11px] font-semibold'
const TABLE_BOX = 'overflow-x-auto rounded-card border-2 border-line bg-surface'

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div
      className={`rounded-card border-2 p-4 text-xs font-bold leading-relaxed ${
        error
          ? 'border-[#E03131]/30 bg-[#E03131]/10 text-[#E03131] dark:text-[#ff8787]'
          : 'border-brand-300 bg-brand-soft text-brand-800 dark:border-brand-400/30 dark:text-brand-200'
      }`}
    >
      {children}
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-4 text-xs font-semibold text-muted">
      {text}
    </p>
  )
}

function Meter({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(0, Math.min(5, value))
  return (
    <div className="min-w-[92px]">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-black text-muted">{label}</span>
        <span className="text-[11px] font-black">{clamped}/5</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${(clamped / 5) * 100}%` }} />
      </div>
    </div>
  )
}

export default function Wellbeing() {
  const { t, i18n } = useTranslation()
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [options, setOptions] = useState<StudentOption[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [pairs, setPairs] = useState<Pair[]>([])
  const [history, setHistory] = useState<Checkin[]>([])
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)

  const locale =
    i18n.resolvedLanguage === 'ar'
      ? 'ar-MA'
      : i18n.resolvedLanguage === 'amz'
        ? 'fr'
        : (i18n.resolvedLanguage ?? 'ar-MA')

  const formatDate = (value?: string) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      apiGet<ClassesResponse>('/teacher/classes'),
      apiGet<PairsResponse>('/mentoring/pairs'),
    ])
      .then(([classData, pairData]) => {
        if (cancelled) return
        const scoped = classData.classes ?? []
        const students: StudentOption[] = scoped.flatMap((item) =>
          (item.students ?? []).map((student) => ({
            id: student.id ?? student.studentId ?? '',
            name: student.name ?? student.id ?? student.studentId ?? '—',
          })),
        )
        setClasses(scoped)
        setPairs(pairData.pairs ?? [])
        setOptions(students)
        setSelectedStudentId((previous) =>
          students.some((student) => student.id === previous)
            ? previous
            : (students[0]?.id ?? ''),
        )
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('teacher.wellbeingLoadError', { defaultValue: 'تعذّر تحميل بيانات الرفاه.' }))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reload, t])

  useEffect(() => {
    if (!selectedStudentId) {
      setHistory([])
      return
    }
    let cancelled = false
    setHistoryLoading(true)
    apiGet<HistoryResponse>(
      `/wellbeing/history?studentId=${encodeURIComponent(selectedStudentId)}`,
    )
      .then((response) => {
        if (!cancelled) setHistory(response.history ?? [])
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('teacher.wellbeingLoadError', { defaultValue: 'تعذّر تحميل بيانات الرفاه.' }))
        }
      })
      .finally(() => {
        if (!cancelled) setHistoryLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedStudentId, reload, t])

  const selectedName = options.find((student) => student.id === selectedStudentId)?.name ?? '—'

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-2xl font-black">
            {t('teacher.wellbeingTitle', { defaultValue: 'الرفاه والتوجيه' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('teacher.wellbeingHint', {
              defaultValue: 'سجل المزاج والطاقة والتوتر والتوجيه الأقراني ضمن نطاق فصولك.',
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReload((value) => value + 1)}
          disabled={loading || historyLoading}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm"
        >
          {loading || historyLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {t('refresh', { defaultValue: 'تحديث' })}
        </button>
      </section>

      <Notice>
        <span className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t('teacher.wellbeingPrivacy', {
              defaultValue:
                'الخصوصية: تظهر بيانات الرفاه ضمن نطاق فصولك فقط، ولا تُستخدم لاتخاذ قرارات نهائية دون مراجعة بشرية.',
            })}
          </span>
        </span>
      </Notice>

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-4 text-sm font-bold text-[#b42318] dark:text-[#ff8787]"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {error}
          </span>
          <button
            type="button"
            onClick={() => setReload((value) => value + 1)}
            className="btn-chunky btn-chunky--danger btn-chunky--sm"
          >
            {t('retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('teacher.wellbeingLoading', { defaultValue: 'جارٍ تحميل بيانات الرفاه…' })}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <section className="card-school p-5">
            <label htmlFor="wellbeing-student" className="flex items-center gap-2 text-xs font-black">
              <UsersRound className="h-4 w-4 text-brand-600" aria-hidden="true" />
              {t('teacher.wellbeingChooseStudent', { defaultValue: 'التلميذ' })}
            </label>
            {options.length ? (
              <select
                id="wellbeing-student"
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                className="mt-2 w-full rounded-card border-2 border-line bg-surface p-2 text-sm font-bold"
              >
                {options.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="mt-2">
                <Empty
                  text={t('teacher.wellbeingNoStudents', {
                    defaultValue: 'لا توجد تلاميذ ضمن نطاقك حاليًا.',
                  })}
                />
              </div>
            )}
            <p className="mt-2 text-[11px] font-semibold text-muted">
              {t('teacher.wellbeingScopedClasses', { defaultValue: 'الفصول ضمن نطاقك' })}:{' '}
              {classes.length}
            </p>
          </section>

          <section className="card-school p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <HeartPulse className="h-5 w-5 text-brand-600" aria-hidden="true" />
                {t('teacher.wellbeingHistory', { defaultValue: 'سجل الرفاه' })}
              </h2>
              {historyLoading ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-muted">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  {t('loading', { defaultValue: 'جارٍ التحميل…' })}
                </span>
              ) : (
                <span className="text-[11px] font-bold text-muted">{selectedName}</span>
              )}
            </div>
            {history.length ? (
              <div className="mt-4">
                <div className={TABLE_BOX}>
                  <table className="w-full">
                    <thead className="bg-surface-muted">
                      <tr>
                        <th className={TH}>{t('teacher.wellbeingDate', { defaultValue: 'التاريخ' })}</th>
                        <th className={TH}>{t('teacher.wellbeingMood', { defaultValue: 'المزاج' })}</th>
                        <th className={TH}>{t('teacher.wellbeingEnergy', { defaultValue: 'الطاقة' })}</th>
                        <th className={TH}>{t('teacher.wellbeingStress', { defaultValue: 'التوتر' })}</th>
                        <th className={TH}>{t('teacher.wellbeingNotes', { defaultValue: 'ملاحظات' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((checkin, index) => (
                        <tr
                          key={checkin.id ?? `${checkin.checkedAt ?? ''}-${index}`}
                          className="border-t-2 border-line"
                        >
                          <td className={TD}>{formatDate(checkin.checkedAt)}</td>
                          <td className={TD}>
                            <Meter label={t('teacher.wellbeingMood', { defaultValue: 'المزاج' })} value={checkin.mood ?? 0} />
                          </td>
                          <td className={TD}>
                            <Meter label={t('teacher.wellbeingEnergy', { defaultValue: 'الطاقة' })} value={checkin.energy ?? 0} />
                          </td>
                          <td className={TD}>
                            <Meter label={t('teacher.wellbeingStress', { defaultValue: 'التوتر' })} value={checkin.stress ?? 0} />
                          </td>
                          <td className={TD}>{checkin.notes ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Empty
                  text={t('teacher.wellbeingNoHistory', {
                    defaultValue: 'لا توجد تسجيلات رفاه لهذا التلميذ.',
                  })}
                />
              </div>
            )}
          </section>

          <section className="card-school p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-black">
              <Activity className="h-5 w-5 text-gold-600" aria-hidden="true" />
              {t('teacher.wellbeingMentoringPairs', { defaultValue: 'أزواج التوجيه الأقراني' })}
              <span className="text-xs font-bold text-muted">({pairs.length})</span>
            </h2>
            {pairs.length ? (
              <ul className="mt-4 space-y-2">
                {pairs.map((pair, index) => (
                  <li
                    key={pair.id ?? index}
                    className="rounded-card border-2 border-line bg-surface p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-extrabold">
                        {pair.mentorId ?? '—'} → {pair.menteeId ?? '—'}
                      </span>
                      <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                        {pair.status ?? '—'}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-muted">
                      {t('teacher.wellbeingSubject', { defaultValue: 'المادة' })}: {pair.subject ?? '—'}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-muted">
                      {t('teacher.wellbeingDate', { defaultValue: 'التاريخ' })}:{' '}
                      {formatDate(pair.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <Empty text={t('teacher.wellbeingNoPairs', { defaultValue: 'لا توجد أزواج توجيه حاليًا.' })} />
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  )
}
