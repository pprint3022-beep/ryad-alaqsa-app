import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDownUp, FolderOpen, Loader2, Plus, RefreshCw } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'
import type { Student } from '../../types'

interface TimelineEntry {
  term?: string
  date?: string
  event: string
  by?: string
  type?: string
}
interface CaseFile {
  id: string
  studentId: string
  status?: string
  focus?: string
  nextReview?: string
  updatedAt?: string
  timeline?: TimelineEntry[]
}
interface CasesResponse {
  cases: CaseFile[]
}
interface ClassesResponse {
  classes: Array<{ id: string; students: Student[] }>
}
interface TimelineInput {
  id: string
  term: string
  date: string
  event: string
  type: string
}
interface TimelineResponse {
  ok: boolean
  case: CaseFile
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

export default function Cases() {
  const { t } = useTranslation()
  const [cases, setCases] = useState<CaseFile[]>([])
  const [nameById, setNameById] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newestFirst, setNewestFirst] = useState(true)
  const [term, setTerm] = useState(t('enumTerm1', { defaultValue: 'الفصل 1' }))
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [event, setEvent] = useState('')
  const [type, setType] = useState('note')
  const [formError, setFormError] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.all([
      apiGet<CasesResponse>('/teacher/cases'),
      apiGet<ClassesResponse>('/teacher/classes'),
    ])
      .then(([caseData, classData]) => {
        if (!active) return
        setCases(caseData.cases || [])
        const names: Record<string, string> = {}
        ;(classData.classes || []).forEach((cls) =>
          (cls.students || []).forEach((student) => {
            names[student.id] = student.name
          }),
        )
        setNameById(names)
      })
      .catch((err: unknown) => {
        if (active) {
          setError(messageOf(err, t('loadError', { defaultValue: 'تعذّر تحميل الحالات.' })))
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

  const selected = cases.find((item) => item.id === selectedId) || null
  const timeline = selected ? [...(selected.timeline || [])] : []
  timeline.sort((a, b) => {
    const diff = (a.date || '').localeCompare(b.date || '')
    return newestFirst ? -diff : diff
  })

  const appendEvent = async () => {
    if (!selected) return
    setFormError(null)
    setServerError(null)
    setSuccess(false)
    if (!event.trim()) {
      setFormError(t('eventRequired', { defaultValue: 'أدخل نص الحدث قبل الإضافة.' }))
      return
    }
    const payload: TimelineInput = {
      id: selected.id,
      term: term.trim() || t('enumTerm1', { defaultValue: 'الفصل 1' }),
      date,
      event: event.trim(),
      type: type.trim() || 'note',
    }
    setSaving(true)
    try {
      const response = await apiPost<TimelineResponse, TimelineInput>('/teacher/cases/timeline', payload)
      const updated = response.case
      setCases((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setEvent('')
      setSuccess(true)
    } catch (err: unknown) {
      setServerError(messageOf(err, t('saveError', { defaultValue: 'تعذّر إضافة الحدث.' })))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('casesTitle', { defaultValue: 'الحالات والخط الزمني' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('casesHint', { defaultValue: 'متابعة الحالات ضمن نطاق فصولك وإضافة أحداث جديدة.' })}
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300">
          <FolderOpen className="h-5 w-5" aria-hidden="true" />
        </span>
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
      ) : cases.length === 0 ? (
        <Notice>{t('noCases', { defaultValue: 'لا توجد حالات ضمن نطاقك حاليًا.' })}</Notice>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <ul className="space-y-2 lg:col-span-1">
            {cases.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id)
                    setFormError(null)
                    setServerError(null)
                    setSuccess(false)
                  }}
                  className={`w-full rounded-card border-2 p-4 text-start transition ${
                    selectedId === item.id
                      ? 'border-brand-400 bg-brand-50 dark:bg-brand-400/10'
                      : 'border-line bg-surface hover:border-brand-300'
                  }`}
                >
                  <span className="block truncate text-sm font-extrabold">
                    {nameById[item.studentId] || item.studentId}
                  </span>
                  <span className="mt-1 block text-[11px] font-semibold text-muted">
                    {item.focus || '—'} · {item.status || '—'}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <section className="card-school p-5 lg:col-span-2">
            {selected ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-black">
                    {nameById[selected.studentId] || selected.studentId}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setNewestFirst((value) => !value)}
                    className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                  >
                    <ArrowDownUp className="h-4 w-4" aria-hidden="true" />
                    {newestFirst
                      ? t('newestFirst', { defaultValue: 'الأحدث أولًا' })
                      : t('oldestFirst', { defaultValue: 'الأقدم أولًا' })}
                  </button>
                </div>
                <p className="mt-1 text-xs font-semibold text-muted">
                  {selected.focus || '—'}
                  {selected.nextReview ? ` · ${t('nextReview', { defaultValue: 'مراجعة' })}: ${selected.nextReview}` : ''}
                </p>

                <div className="mt-4 border-t-2 border-line pt-4">
                  <h3 className="text-sm font-black">{t('timeline', { defaultValue: 'الخط الزمني' })}</h3>
                  {timeline.length ? (
                    <ol className="mt-3 space-y-2">
                      {timeline.map((entry, index) => (
                        <li
                          key={`${entry.date || ''}-${index}`}
                          className="rounded-card border-2 border-line bg-surface-muted p-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-black text-brand-700 dark:text-brand-300">
                              {entry.term || '—'} · {entry.date || '—'}
                            </span>
                            <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                              {entry.type || 'note'}
                            </span>
                          </div>
                          <p className="mt-1 text-sm font-semibold">{entry.event}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="mt-3">
                      <Notice>{t('noTimeline', { defaultValue: 'لا توجد أحداث مسجلة بعد.' })}</Notice>
                    </div>
                  )}
                </div>

                <div className="mt-5 border-t-2 border-line pt-4">
                  <h3 className="text-sm font-black">{t('appendEvent', { defaultValue: 'إضافة حدث' })}</h3>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input
                      aria-label={t('term', { defaultValue: 'الفصل' })}
                      className="input-school"
                      value={term}
                      onChange={(event) => setTerm(event.target.value)}
                    />
                    <input
                      aria-label={t('date', { defaultValue: 'التاريخ' })}
                      type="date"
                      className="input-school"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                    <input
                      aria-label={t('eventType', { defaultValue: 'نوع الحدث' })}
                      className="input-school sm:col-span-2"
                      value={type}
                      onChange={(event) => setType(event.target.value)}
                      placeholder={t('eventTypePlaceholder', { defaultValue: 'note' })}
                    />
                    <textarea
                      aria-label={t('event', { defaultValue: 'الحدث' })}
                      className="input-school min-h-20 sm:col-span-2"
                      value={event}
                      onChange={(event) => setEvent(event.target.value)}
                      placeholder={t('eventPlaceholder', { defaultValue: 'وصف الحدث…' })}
                    />
                  </div>
                  {formError ? (
                    <div className="mt-3">
                      <Notice error>{formError}</Notice>
                    </div>
                  ) : null}
                  {serverError ? (
                    <div className="mt-3">
                      <Notice error>{serverError}</Notice>
                    </div>
                  ) : null}
                  {success ? (
                    <p className="mt-3 text-xs font-bold text-brand-700 dark:text-brand-300">
                      {t('saved', { defaultValue: 'تم الحفظ بنجاح.' })}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void appendEvent()}
                    disabled={saving}
                    className="btn-chunky btn-chunky--primary btn-chunky--sm mt-4 w-full"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    )}
                    {t('add', { defaultValue: 'إضافة' })}
                  </button>
                </div>
              </>
            ) : (
              <Notice>{t('selectCase', { defaultValue: 'اختر حالة لعرض خطها الزمني.' })}</Notice>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
