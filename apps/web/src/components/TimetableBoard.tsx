import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../lib/api'

type TimetableEndpoint =
  | '/admin/timetable'
  | '/teacher/timetable'
  | '/student/timetable'
  | '/parent/timetable'

interface TimetableBoardProps {
  endpoint: TimetableEndpoint
  titleKey: string
  hintKey: string
  manage?: boolean
  childPicker?: boolean
}

interface SlotAttendance {
  view: 'class' | 'student'
  total: number
  present: number
  late: number
  absent: number
  rate: number
}

interface SlotAssignment {
  id: string
  title: string
  dueDate: string
  status: string
  submissionStatus: string
}

interface Slot {
  id: string
  classId: string
  className: string
  levelId: string
  levelName: string
  day: string
  period: number
  time: string
  subjectId: string
  subject: string
  teacherId: string
  teacher: string
  room: string
  term: string
  links: {
    attendance: SlotAttendance
    assignments: SlotAssignment[]
  }
}

interface TimetableMeta {
  days: string[]
  periods: Array<{ period: number; time: string }>
  classes: Array<{ id: string; name: string }>
  subjects: Array<{ id: string; name: string }>
  scope: 'global' | 'teacher' | 'student' | 'parent'
}

interface TimetableResponse {
  slots: Slot[]
  meta: TimetableMeta
}

interface CreateSlotBody {
  classId: string
  day: string
  period: number
  subjectId: string
  teacherId?: string
  room?: string
  term?: string
}

interface CreateSlotResponse {
  slot: Slot
}

interface RemoveSlotBody {
  id: string
  remove: true
}

interface RemoveSlotResponse {
  removed?: boolean
  slot?: Slot
}

interface NoticeState {
  tone: 'success' | 'error'
  message: string
}

interface SlotFormState {
  classId: string
  day: string
  period: string
  subjectId: string
  teacherId: string
  room: string
}

const TH = 'whitespace-nowrap px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'whitespace-nowrap px-3 py-2 text-[11px] font-semibold tabular-nums'
const EMPTY_META: TimetableMeta = { days: [], periods: [], classes: [], subjects: [], scope: 'global' }
const EMPTY_FORM: SlotFormState = {
  classId: '',
  day: '',
  period: '',
  subjectId: '',
  teacherId: '',
  room: '',
}

function failureMessage(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

function isSubmitted(value: string): boolean {
  const normalized = value.trim().toLowerCase()
  return ['submitted', 'done', 'graded', 'complete', 'completed'].includes(normalized)
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr className="border-b-2 border-line last:border-0">
      <th scope="row" className={`${TH} w-32 align-top`}>
        {label}
      </th>
      <td className={`${TD} whitespace-normal text-content`}>{children}</td>
    </tr>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card border-2 border-line bg-surface-muted p-2">
      <p className="text-[10px] font-black text-muted">{label}</p>
      <p className="mt-1 font-display text-base font-black text-brand-700 dark:text-brand-300">
        {value}
      </p>
    </div>
  )
}

export default function TimetableBoard(props: TimetableBoardProps) {
  const { endpoint, titleKey, hintKey, manage = false } = props
  const { t } = useTranslation()

  const defaultTerms = useMemo(
    () => [
      t('enumTerm1', { defaultValue: 'الفصل 1' }),
      t('enumTerm2', { defaultValue: 'الفصل 2' }),
      t('enumTerm3', { defaultValue: 'الفصل 3' }),
    ],
    [t],
  )

  const assignmentStatusLabel = (value: string) => {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'submitted') return t('enumSubmitted', { defaultValue: 'مُرسل' })
    if (normalized === 'done' || normalized === 'completed') {
      return t('enumCompleted', { defaultValue: 'مكتمل' })
    }
    if (normalized === 'open') return t('enumOpen', { defaultValue: 'مفتوح' })
    return t('enumOther', { defaultValue: 'أخرى' })
  }

  const [slots, setSlots] = useState<Slot[]>([])
  const [meta, setMeta] = useState<TimetableMeta>(EMPTY_META)
  const [classId, setClassId] = useState('')
  const [day, setDay] = useState('')
  const [term, setTerm] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<SlotFormState>(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [creating, setCreating] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [notice, setNotice] = useState<NoticeState | null>(null)

  const params = useMemo(() => {
    const query: Record<string, string> = {}
    if (classId) query.classId = classId
    if (day) query.day = day
    if (term) query.term = term
    return query
  }, [classId, day, term])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setError(null)

    apiGet<TimetableResponse>(endpoint, { params, signal: controller.signal })
      .then((data) => {
        if (cancelled) return
        setSlots(Array.isArray(data.slots) ? data.slots : [])
        const incoming = data.meta
        setMeta({
          days: Array.isArray(incoming?.days) ? incoming.days : [],
          periods: Array.isArray(incoming?.periods) ? incoming.periods : [],
          classes: Array.isArray(incoming?.classes) ? incoming.classes : [],
          subjects: Array.isArray(incoming?.subjects) ? incoming.subjects : [],
          scope: incoming?.scope || 'global',
        })
      })
      .catch((err: unknown) => {
        if (cancelled || controller.signal.aborted) return
        setError(
          failureMessage(
            err,
            t('ttLoadError', { defaultValue: 'تعذّر تحميل الجدول الدراسي. حاول مجددًا.' }),
          ),
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [endpoint, params, reloadKey, t])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 4500)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    if (form.classId || meta.classes.length === 0) return
    setForm((current) => ({ ...current, classId: meta.classes[0].id }))
  }, [meta.classes, form.classId])

  const periods = useMemo(
    () =>
      meta.periods.length
        ? meta.periods
        : Array.from({ length: 6 }, (_, index) => ({ period: index + 1, time: '' })),
    [meta.periods],
  )

  const termOptions = useMemo(() => {
    const derived = slots.map((slot) => slot.term).filter((value): value is string => Boolean(value))
    const base = derived.length ? [...new Set(derived)] : defaultTerms
    return term && !base.includes(term) ? [...base, term] : base
  }, [slots, term, defaultTerms])

  const teacherOptions = useMemo(() => {
    const map = new Map<string, string>()
    slots.forEach((slot) => {
      if (slot.teacherId) map.set(slot.teacherId, slot.teacher || slot.teacherId)
    })
    return [...map.entries()].map(([id, name]) => ({ id, name }))
  }, [slots])

  const subjectOptions = useMemo(() => {
    const map = new Map<string, string>()
    slots.forEach((slot) => {
      if (slot.subjectId) map.set(slot.subjectId, slot.subject || slot.subjectId)
    })
    meta.subjects.forEach((item) => map.set(item.id, item.name || item.id))
    return [...map.entries()].map(([id, name]) => ({ id, name }))
  }, [slots, meta.subjects])

  const slotByCell = useMemo(() => {
    const map = new Map<string, Slot>()
    slots.forEach((slot) => {
      const key = `${slot.day}|${slot.period}`
      if (!map.has(key)) map.set(key, slot)
    })
    return map
  }, [slots])

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedId) ?? null,
    [slots, selectedId],
  )
  const attendance = selectedSlot?.links?.attendance ?? null
  const assignments = useMemo(
    () => (Array.isArray(selectedSlot?.links?.assignments) ? selectedSlot.links.assignments : []),
    [selectedSlot],
  )

  function handleRefresh() {
    setReloadKey((key) => key + 1)
  }

  function handleFormChange(field: keyof SlotFormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleCreate() {
    if (!form.classId || !form.day || !form.period || !form.subjectId.trim()) {
      setNotice({
        tone: 'error',
        message: t('ttValidation', { defaultValue: 'يرجى إكمال الحقول المطلوبة قبل الإضافة.' }),
      })
      return
    }
    const period = Number(form.period)
    if (!Number.isFinite(period) || period <= 0) {
      setNotice({
        tone: 'error',
        message: t('ttValidation', { defaultValue: 'يرجى إكمال الحقول المطلوبة قبل الإضافة.' }),
      })
      return
    }

    const body: CreateSlotBody = {
      classId: form.classId,
      day: form.day,
      period,
      subjectId: form.subjectId.trim(),
    }
    if (form.teacherId) body.teacherId = form.teacherId
    if (form.room.trim()) body.room = form.room.trim()
    if (term) body.term = term

    setCreating(true)
    setNotice(null)
    try {
      const result = await apiPost<CreateSlotResponse, CreateSlotBody>(endpoint, body)
      setNotice({
        tone: 'success',
        message: t('ttCreateSuccess', { defaultValue: 'تمت إضافة الحصة بنجاح.' }),
      })
      setForm((current) => ({
        ...current,
        day: '',
        period: '',
        subjectId: '',
        teacherId: '',
        room: '',
      }))
      if (result?.slot?.id) setSelectedId(result.slot.id)
      setReloadKey((key) => key + 1)
    } catch (err: unknown) {
      setNotice({
        tone: 'error',
        message: failureMessage(
          err,
          t('ttActionFailed', { defaultValue: 'تعذّر تنفيذ الإجراء. حاول مجددًا.' }),
        ),
      })
    } finally {
      setCreating(false)
    }
  }

  function handleRemove(slot: Slot) {
    if (!window.confirm(t('ttRemoveConfirm', { defaultValue: 'هل تريد حذف هذه الحصة؟' }))) {
      return
    }
    void removeSlot(slot)
  }

  async function removeSlot(slot: Slot) {
    setRemoving(true)
    setNotice(null)
    try {
      await apiPost<RemoveSlotResponse, RemoveSlotBody>(`${endpoint}/update`, {
        id: slot.id,
        remove: true,
      })
      setSelectedId(null)
      setNotice({
        tone: 'success',
        message: t('ttRemoved', { defaultValue: 'تم حذف الحصة.' }),
      })
      setReloadKey((key) => key + 1)
    } catch (err: unknown) {
      setNotice({
        tone: 'error',
        message: failureMessage(
          err,
          t('ttActionFailed', { defaultValue: 'تعذّر تنفيذ الإجراء. حاول مجددًا.' }),
        ),
      })
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t(titleKey, { defaultValue: 'الجدول' })}
          </h1>
          <p className="mt-2 max-w-3xl text-xs font-semibold leading-relaxed text-muted">
            {t(hintKey, { defaultValue: 'جدول الدروس والأنشطة' })}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1 text-[10px] font-black text-muted">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {t('ttScopeNote', { defaultValue: 'يُعرض الجدول وفق صلاحيات حسابك.' })}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {t('ttRefresh', { defaultValue: 'تحديث' })}
        </button>
      </section>

      {notice ? (
        <p
          role={notice.tone === 'error' ? 'alert' : 'status'}
          className={`rounded-card border-2 p-3 text-xs font-bold ${
            notice.tone === 'error'
              ? 'border-[#E03131]/40 bg-[#E03131]/10 text-[#b42318] dark:text-[#ff8787]'
              : 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-200'
          }`}
        >
          {notice.message}
        </p>
      ) : null}

      {manage ? (
        <section className="card-school p-5" aria-label={t('ttManageTitle', { defaultValue: 'إدارة الجدول' })}>
          <h2 className="mb-3 font-display text-base font-black">
            {t('ttManageTitle', { defaultValue: 'إدارة الجدول' })}
          </h2>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void handleCreate()
            }}
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          >
            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold text-muted">
                {t('ttClass', { defaultValue: 'الفصل' })}
              </span>
              <select
                className="input-school py-2.5 text-sm font-bold"
                value={form.classId}
                onChange={(event) => handleFormChange('classId', event.target.value)}
              >
                <option value="">{t('ttAllClasses', { defaultValue: 'كل الفصول' })}</option>
                {meta.classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold text-muted">
                {t('ttDay', { defaultValue: 'اليوم' })}
              </span>
              <select
                className="input-school py-2.5 text-sm font-bold"
                value={form.day}
                onChange={(event) => handleFormChange('day', event.target.value)}
              >
                <option value="">{t('ttSelectDay', { defaultValue: 'اختر اليوم' })}</option>
                {meta.days.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold text-muted">
                {t('ttPeriod', { defaultValue: 'الحصة' })}
              </span>
              <select
                className="input-school py-2.5 text-sm font-bold"
                value={form.period}
                onChange={(event) => handleFormChange('period', event.target.value)}
              >
                <option value="">{t('ttSelectPeriod', { defaultValue: 'اختر الحصة' })}</option>
                {periods.map((item) => (
                  <option key={item.period} value={item.period}>
                    {item.period} {item.time ? `— ${item.time}` : ''}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold text-muted">
                {t('ttSelectSubject', { defaultValue: 'اختر المادة' })}
              </span>
              <select
                className="input-school py-2.5 text-sm font-bold"
                value={form.subjectId}
                onChange={(event) => handleFormChange('subjectId', event.target.value)}
              >
                <option value="">{t('ttSelectSubject', { defaultValue: 'اختر المادة' })}</option>
                {subjectOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold text-muted">
                {t('ttSelectTeacher', { defaultValue: 'اختر المعلّم (اختياري)' })}
              </span>
              <select
                className="input-school py-2.5 text-sm font-bold"
                value={form.teacherId}
                onChange={(event) => handleFormChange('teacherId', event.target.value)}
              >
                <option value="">{t('ttSelectTeacher', { defaultValue: 'اختر المعلّم (اختياري)' })}</option>
                {teacherOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold text-muted">
                {t('ttRoom', { defaultValue: 'القاعة' })}
              </span>
              <input
                type="text"
                className="input-school py-2.5 text-sm font-bold"
                value={form.room}
                onChange={(event) => handleFormChange('room', event.target.value)}
                placeholder={t('ttRoom', { defaultValue: 'القاعة' })}
              />
            </label>

            <div className="flex items-end sm:col-span-2 xl:col-span-3">
              <button
                type="submit"
                disabled={creating}
                className="btn-chunky btn-chunky--primary btn-chunky--sm"
              >
                {creating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {creating
                  ? t('ttCreating', { defaultValue: 'جارٍ الإضافة…' })
                  : t('ttCreateSlot', { defaultValue: 'إضافة حصة' })}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="card-school p-4 sm:p-5" aria-label={t('ttFilters', { defaultValue: 'التصفية' })}>
        <h2 className="mb-3 font-display text-sm font-black">
          {t('ttFilters', { defaultValue: 'التصفية' })}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('ttClass', { defaultValue: 'الفصل' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
            >
              <option value="">{t('ttAllClasses', { defaultValue: 'كل الفصول' })}</option>
              {meta.classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('ttDay', { defaultValue: 'اليوم' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={day}
              onChange={(event) => setDay(event.target.value)}
            >
              <option value="">{t('ttAllDays', { defaultValue: 'كل الأيام' })}</option>
              {meta.days.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('ttTerm', { defaultValue: 'الفصل الدراسي' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            >
              <option value="">{t('ttAllTerms', { defaultValue: 'كل الفصول' })}</option>
              {termOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {error ? (
        <div
          role="alert"
          className="card-school flex flex-wrap items-center justify-between gap-3 border-[#E03131]/40 p-5"
        >
          <p className="text-sm font-bold text-[#b42318] dark:text-[#ff8787]">{error}</p>
          <button
            type="button"
            onClick={handleRefresh}
            className="btn-chunky btn-chunky--danger btn-chunky--sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('ttRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('ttLoading', { defaultValue: 'جارٍ تحميل الجدول…' })}
        </div>
      ) : (
        <>
          <section className="card-school overflow-hidden" aria-label={t('ttWeek', { defaultValue: 'الأسبوع' })}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-line bg-surface-muted px-4 py-3">
              <h2 className="font-display text-sm font-black">
                {t('ttWeek', { defaultValue: 'الأسبوع' })}
              </h2>
              <p className="text-[11px] font-bold text-muted">
                {meta.days.length} {t('ttDay', { defaultValue: 'اليوم' })} · {periods.length}{' '}
                {t('ttPeriod', { defaultValue: 'الحصة' })}
              </p>
            </div>
            {slots.length === 0 ? (
              <p className="border-b-2 border-line p-6 text-center text-xs font-semibold text-muted">
                {t('ttNoSlots', { defaultValue: 'لا توجد حصص في الجدول لهذا النطاق.' })}
              </p>
            ) : null}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="bg-surface-muted">
                    <th scope="col" className={`${TH} border-b-2 border-line`}>
                      {t('ttPeriod', { defaultValue: 'الحصة' })}
                    </th>
                    {meta.days.map((item) => (
                      <th key={item} scope="col" className={`${TH} border-b-2 border-line`}>
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((period) => (
                    <tr key={period.period} className="border-b-2 border-line last:border-0">
                      <th scope="row" className={`${TH} align-top`}>
                        <span className="block">{period.period}</span>
                        <span className="mt-1 block text-[10px] font-bold text-muted">
                          {period.time}
                        </span>
                      </th>
                      {meta.days.map((item) => {
                        const slot = slotByCell.get(`${item}|${period.period}`)
                        return (
                          <td key={item} className="align-top p-1.5">
                            {slot ? (
                              <button
                                type="button"
                                onClick={() => setSelectedId(slot.id)}
                                aria-pressed={selectedId === slot.id}
                                aria-label={`${t('ttSlot', { defaultValue: 'حصة' })}: ${slot.subject} — ${slot.day} — ${t('ttPeriod', { defaultValue: 'الحصة' })} ${slot.period}`}
                                className={`w-full rounded-card border-2 p-2 text-start transition hover:-translate-y-0.5 hover:shadow-card ${
                                  selectedId === slot.id
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-400/10'
                                    : 'border-line bg-surface'
                                }`}
                              >
                                <span className="block truncate text-[11px] font-black text-content">
                                  {slot.subject}
                                </span>
                                <span className="mt-1 block text-[10px] font-bold text-muted">
                                  {slot.time || period.time}
                                </span>
                                <span className="mt-1.5 flex flex-wrap gap-1">
                                  {slot.teacher ? (
                                    <span
                                      title={t('ttTeacher', { defaultValue: 'المعلّم' })}
                                      className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[9px] font-black text-brand-700 dark:text-brand-300"
                                    >
                                      {slot.teacher}
                                    </span>
                                  ) : null}
                                  {slot.room ? (
                                    <span
                                      title={t('ttRoom', { defaultValue: 'القاعة' })}
                                      className="rounded-full bg-gold-100 px-1.5 py-0.5 text-[9px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300"
                                    >
                                      {slot.room}
                                    </span>
                                  ) : null}
                                </span>
                              </button>
                            ) : (
                              <span className="block px-3 py-2 text-center text-[11px] font-bold text-muted">
                                {t('ttEmptyCell', { defaultValue: '—' })}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card-school p-5" aria-label={t('ttDetails', { defaultValue: 'التفاصيل' })}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line pb-3">
              <h2 className="font-display text-base font-black">
                {t('ttDetails', { defaultValue: 'التفاصيل' })}
              </h2>
              {manage && selectedSlot ? (
                <button
                  type="button"
                  onClick={() => handleRemove(selectedSlot)}
                  disabled={removing}
                  className="btn-chunky btn-chunky--danger btn-chunky--sm"
                >
                  {removing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {t('ttRemove', { defaultValue: 'حذف' })}
                </button>
              ) : null}
            </div>

            {selectedSlot ? (
              <div className="mt-4 grid gap-5 lg:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-xs font-black text-muted">
                    {t('ttSlot', { defaultValue: 'حصة' })}
                  </h3>
                  <table className="w-full">
                    <tbody>
                      <DetailField label={t('ttClass', { defaultValue: 'الفصل' })}>
                        <span className="font-black">{selectedSlot.className}</span>
                        {selectedSlot.levelName ? (
                          <span className="ms-2 text-[10px] font-bold text-muted">
                            {selectedSlot.levelName}
                          </span>
                        ) : null}
                      </DetailField>
                      <DetailField label={t('ttSubject', { defaultValue: 'المادة' })}>
                        {selectedSlot.subject}
                      </DetailField>
                      <DetailField label={t('ttTeacher', { defaultValue: 'المعلّم' })}>
                        {selectedSlot.teacher || '—'}
                      </DetailField>
                      <DetailField label={t('ttRoom', { defaultValue: 'القاعة' })}>
                        {selectedSlot.room || '—'}
                      </DetailField>
                      <DetailField label={t('ttDay', { defaultValue: 'اليوم' })}>
                        {selectedSlot.day}
                      </DetailField>
                      <DetailField label={t('ttPeriod', { defaultValue: 'الحصة' })}>
                        {selectedSlot.period}
                      </DetailField>
                      <DetailField label={t('ttTime', { defaultValue: 'الوقت' })}>
                        {selectedSlot.time}
                      </DetailField>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="mb-2 flex flex-wrap items-center gap-2 text-xs font-black text-muted">
                      {t('ttAttendance', { defaultValue: 'الحضور' })}
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[9px] font-black">
                        {attendance?.view === 'class'
                          ? t('ttClassView', { defaultValue: 'حضور الفصل' })
                          : t('ttStudentView', { defaultValue: 'حضور التلميذ' })}
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-3">
                      <MiniStat
                        label={t('ttPresent', { defaultValue: 'حاضر' })}
                        value={attendance?.present ?? 0}
                      />
                      <MiniStat
                        label={t('ttLate', { defaultValue: 'متأخر' })}
                        value={attendance?.late ?? 0}
                      />
                      <MiniStat
                        label={t('ttAbsent', { defaultValue: 'غائب' })}
                        value={attendance?.absent ?? 0}
                      />
                      <MiniStat
                        label={t('ttTotal', { defaultValue: 'الإجمالي' })}
                        value={attendance?.total ?? 0}
                      />
                      <MiniStat
                        label={t('ttRate', { defaultValue: 'النسبة' })}
                        value={`${Math.round((attendance?.rate ?? 0) * 100)}%`}
                      />
                    </div>
                    <p className="mt-2 rounded-card bg-surface-muted p-2 text-[10px] font-semibold leading-relaxed text-muted">
                      {t('ttAdvisory', {
                        defaultValue:
                          'حضور القسم مسجّل داخل الصف، وهو منفصل عن مدة استخدام المنصة على الإنترنت.',
                      })}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-xs font-black text-muted">
                      {t('ttAssignments', { defaultValue: 'الواجبات' })}
                      <span className="ms-2 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                        {assignments.length}
                      </span>
                    </h3>
                    {assignments.length ? (
                      <ul className="space-y-2">
                        {assignments.map((assignment) => (
                          <li
                            key={assignment.id}
                            className="rounded-card border-2 border-line bg-surface-muted p-3"
                          >
                            <p className="text-xs font-black text-content">{assignment.title}</p>
                            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-muted">
                              <span>
                                {t('ttDue', { defaultValue: 'موعد التسليم' })}: {assignment.dueDate}
                              </span>
                              <span>{assignmentStatusLabel(assignment.status)}</span>
                              <span title={assignmentStatusLabel(assignment.submissionStatus)}>
                                {isSubmitted(assignment.submissionStatus)
                                  ? t('ttSubmitted', { defaultValue: 'مُرسل' })
                                  : t('ttNotSubmitted', { defaultValue: 'غير مُرسل' })}
                              </span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-3 text-[11px] font-semibold text-muted">
                        {t('ttNoAssignments', { defaultValue: 'لا توجد واجبات لهذه الحصة.' })}
                      </p>
                    )}
                    <p className="mt-2 text-[10px] font-semibold text-muted">
                      {t('ttOpenHomework', { defaultValue: 'يمكن فتح الواجبات من ملف المادة.' })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-card border-2 border-dashed border-line bg-surface-muted p-5 text-center text-xs font-semibold text-muted">
                {t('ttSelectSlot', { defaultValue: 'اختر حصة من الجدول لعرض تفاصيلها.' })}
              </p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
