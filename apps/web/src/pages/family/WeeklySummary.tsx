import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  Clock3,
  Loader2,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { apiGet } from '../../lib/api'

interface Child { id: string; name: string; level?: string; class?: string }
interface ChildrenResponse { children: Child[] }

interface SubjectTime { name: string; minutes: number }
interface ClassroomAttendance {
  present: number
  late: number
  absent: number
  total: number
  percent: number
  note: string
}
interface PlatformTime {
  minutes: number
  sessions: number
  subjects: SubjectTime[]
  note: string
}
interface HomeworkItem { id: string; title: string; dueDate: string; status: string }
interface Homework { due: number; submitted: number; overdue: number; items: HomeworkItem[] }
interface Practice { attempts: number; averageScore: number; note: string }
interface Summary {
  student: { id: string; name: string; level: string; class: string }
  week: { start: string; end: string }
  privacy: string
  advisory: boolean
  classroomAttendance: ClassroomAttendance
  platformTime: PlatformTime
  homework: Homework
  practice: Practice
  highlights: string[]
  conversationStarters: string[]
}
interface SummaryResponse { summary: Summary }

type Status = 'idle' | 'loading' | 'ready' | 'error'

function formatDate(value?: string): string {
  return value ? value.slice(0, 10) : '—'
}

export default function WeeklySummary() {
  const { t } = useTranslation()
  const loadError = t('wsLoadError', {
    defaultValue: 'تعذّر تحميل الملخّص الأسبوعي. حاول مرة أخرى.',
  })

  const [children, setChildren] = useState<Child[]>([])
  const [listStatus, setListStatus] = useState<Status>('loading')
  const [listError, setListError] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [summary, setSummary] = useState<Summary | null>(null)
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
          current && kids.some((kid) => kid.id === current) ? current : kids[0]?.id ?? null,
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
      setSummary(null)
      setDetailStatus('idle')
      return
    }

    const controller = new AbortController()
    let cancelled = false
    setDetailStatus('loading')
    setDetailError('')

    apiGet<SummaryResponse>('/parent/weekly-summary', {
      params: { studentId: selectedId },
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        setSummary(data.summary ?? null)
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

  const homeworkStatusLabel = (value: string): string => {
    if (value === 'submitted') return t('wsSubmitted', { defaultValue: 'تم تسليمه' })
    if (value === 'overdue') return t('wsOverdue', { defaultValue: 'متأخّر' })
    return t('wsDue', { defaultValue: 'مستحق' })
  }

  const selectedChild = children.find((kid) => kid.id === selectedId)

  return (
    <div className="space-y-5 animate-slide">
      <section className="relative overflow-hidden rounded-card-lg border-2 border-brand-500/20 bg-brand-500 p-6 text-white shadow-card sm:p-8">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black tracking-wide text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
              {t('wsBadge', { defaultValue: 'ملخّص أسبوعي · استرشادي' })}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black sm:text-3xl">
              {t('wsTitle', { defaultValue: 'الملخّص الأسبوعي للعائلة' })}
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/80">
              {t('wsHint', {
                defaultValue: 'مقارنة واضحة بين حضور الصفّ ووقت المنصة، مع أبرز الواجبات والتدريبات.',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={retry}
            disabled={listStatus === 'loading' || detailStatus === 'loading'}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm shrink-0"
            aria-label={t('wsRefresh', { defaultValue: 'تحديث' })}
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('wsRefresh', { defaultValue: 'تحديث' })}</span>
          </button>
        </div>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('wsPrivacyNote', {
          defaultValue:
            'هذا الملخّص يستخدم بيانات محدودة من مصادر منفصلة، ويخضع لمراجعة بشرية؛ لا يُستخدم كسجل رسمي أو درجة في بطاقة التقدير.',
        })}
      </div>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-xs font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('wsAdvisory', {
          defaultValue:
            'المؤشرات استرشادية فقط وتتطلب اعتمادًا بشريًا؛ لا تُعدّ قرارًا تربويًا أو تقييمًا رسميًا.',
        })}
      </div>

      <section className="card-school p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-[180px] flex-1">
            <label htmlFor="ws-child" className="text-[11px] font-black text-muted">
              {t('wsSelectChild', { defaultValue: 'اختر الطالب' })}
            </label>
            <select
              id="ws-child"
              value={selectedId ?? ''}
              onChange={(event) => setSelectedId(event.target.value || null)}
              className="input-school mt-1 w-full text-start"
            >
              {children.map((kid) => (
                <option key={kid.id} value={kid.id}>
                  {kid.name}
                </option>
              ))}
            </select>
          </div>
          {summary ? (
            <div className="flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-[11px] font-black text-brand-800 dark:text-brand-200">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {t('wsWeek', { defaultValue: 'الأسبوع' })}: {formatDate(summary.week.start)} —{' '}
              {formatDate(summary.week.end)}
            </div>
          ) : null}
        </div>
        {selectedChild ? (
          <p className="mt-2 text-xs font-bold text-muted">
            {selectedChild.level || selectedChild.class
              ? [
                  selectedChild.level
                    ? `${t('enumLevel', { defaultValue: 'المستوى' })}: ${selectedChild.level}`
                    : '',
                  selectedChild.class
                    ? `${t('enumClass', { defaultValue: 'الفصل' })}: ${selectedChild.class}`
                    : '',
                ]
                  .filter(Boolean)
                  .join(' • ')
              : '—'}
          </p>
        ) : null}
      </section>

      {listStatus === 'loading' ? (
        <div className="flex items-center gap-2 rounded-card border-2 border-line bg-surface p-5 text-sm font-bold text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t('wsLoading', { defaultValue: 'جارٍ التحميل...' })}
        </div>
      ) : null}

      {listStatus === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="text-sm font-bold text-[#E03131]">{listError}</p>
          <button type="button" onClick={retry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('wsRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : null}

      {listStatus === 'ready' && children.length === 0 ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('wsNoHomework', { defaultValue: 'لا توجد بيانات أسبوعية لأبناء هذا الحساب.' })}
        </p>
      ) : null}

      {selectedId && detailStatus === 'loading' ? (
        <div className="flex items-center gap-2 rounded-card border-2 border-line bg-surface p-5 text-sm font-bold text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t('wsLoading', { defaultValue: 'جارٍ التحميل...' })}
        </div>
      ) : null}

      {selectedId && detailStatus === 'error' ? (
        <div className="flex flex-col items-start gap-3 rounded-card border-2 border-[#E03131]/30 bg-[#E03131]/5 p-5">
          <p className="text-sm font-bold text-[#E03131]">{detailError}</p>
          <button type="button" onClick={retry} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('wsRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : null}

      {selectedId && detailStatus === 'ready' && !summary ? (
        <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-6 text-center text-sm font-semibold text-muted">
          {t('wsNoHighlights', { defaultValue: 'لا يتوفر ملخّص لهذا الأسبوع بعد.' })}
        </p>
      ) : null}

      {selectedId && detailStatus === 'ready' && summary ? (
        <div className="space-y-5">
          {summary.privacy ? (
            <p className="rounded-card border-2 border-line bg-surface-muted p-3 text-[11px] font-semibold text-muted">
              {summary.privacy}
            </p>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card-school p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <CalendarDays className="h-5 w-5 text-brand-600" aria-hidden="true" />
                {t('wsAttendance', { defaultValue: 'حضور الصفّ' })}
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  { label: t('wsPresent', { defaultValue: 'حاضر' }), value: summary.classroomAttendance.present },
                  { label: t('wsLate', { defaultValue: 'متأخّر' }), value: summary.classroomAttendance.late },
                  { label: t('wsAbsent', { defaultValue: 'غائب' }), value: summary.classroomAttendance.absent },
                  { label: t('wsTotal', { defaultValue: 'الإجمالي' }), value: summary.classroomAttendance.total },
                ].map((item) => (
                  <div key={item.label} className="rounded-card border-2 border-line bg-surface-muted p-3">
                    <p className="text-[11px] font-bold text-muted">{item.label}</p>
                    <p className="mt-1 font-display text-xl font-black">{item.value}</p>
                  </div>
                ))}
                <div className="rounded-card border-2 border-brand-300 bg-brand-soft p-3">
                  <p className="text-[11px] font-bold text-brand-800 dark:text-brand-200">
                    {t('wsRate', { defaultValue: 'نسبة الحضور' })}
                  </p>
                  <p className="mt-1 font-display text-xl font-black text-brand-700 dark:text-brand-300">
                    {summary.classroomAttendance.percent}%
                  </p>
                </div>
              </div>
              {summary.classroomAttendance.note ? (
                <p className="mt-3 rounded-card bg-surface-muted p-3 text-[11px] font-semibold text-muted">
                  {t('wsAttendanceNote', { defaultValue: 'ملاحظة الحضور' })}: {summary.classroomAttendance.note}
                </p>
              ) : null}
            </section>

            <section className="card-school p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <Clock3 className="h-5 w-5 text-brand-600" aria-hidden="true" />
                {t('wsPlatform', { defaultValue: 'وقت المنصة' })}
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                  <p className="text-[11px] font-bold text-muted">
                    {t('wsMinutes', { defaultValue: 'الدقائق' })}
                  </p>
                  <p className="mt-1 font-display text-xl font-black">{summary.platformTime.minutes}</p>
                </div>
                <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                  <p className="text-[11px] font-bold text-muted">
                    {t('wsSessions', { defaultValue: 'الجلسات' })}
                  </p>
                  <p className="mt-1 font-display text-xl font-black">{summary.platformTime.sessions}</p>
                </div>
              </div>
              <h3 className="mt-4 text-xs font-black">
                {t('wsSubjects', { defaultValue: 'الوقت حسب المادة' })}
              </h3>
              {summary.platformTime.subjects.length === 0 ? (
                <p className="mt-2 text-[11px] font-semibold text-muted">
                  {t('wsNoHomework', { defaultValue: 'لا توجد بيانات للمواد هذا الأسبوع.' })}
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {summary.platformTime.subjects.map((subject, index) => (
                    <li key={`${subject.name}-${index}`} className="flex items-center justify-between gap-2 rounded-card border-2 border-line bg-surface p-2.5 text-xs font-bold">
                      <span>{subject.name}</span>
                      <span className="text-brand-700 dark:text-brand-300">
                        {subject.minutes} {t('wsMinutes', { defaultValue: 'دقيقة' })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {summary.platformTime.note ? (
                <p className="mt-3 rounded-card bg-surface-muted p-3 text-[11px] font-semibold text-muted">
                  {t('wsPlatformNote', { defaultValue: 'ملاحظة المنصة' })}: {summary.platformTime.note}
                </p>
              ) : null}
              <p className="mt-3 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-[11px] font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
                {t('wsSeparation', {
                  defaultValue:
                    'هذا وقت اختياري على المنصة ولا يمثّل حضور الصفّ؛ تُبقى المصادر منفصلة تمامًا.',
                })}
              </p>
            </section>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card-school p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <ClipboardList className="h-5 w-5 text-brand-600" aria-hidden="true" />
                {t('wsHomework', { defaultValue: 'الواجبات المنزلية' })}
              </h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: t('wsDue', { defaultValue: 'مستحق' }), value: summary.homework.due },
                  { label: t('wsSubmitted', { defaultValue: 'تم تسليمه' }), value: summary.homework.submitted },
                  { label: t('wsOverdue', { defaultValue: 'متأخّر' }), value: summary.homework.overdue },
                ].map((item) => (
                  <div key={item.label} className="rounded-card border-2 border-line bg-surface-muted p-3 text-center">
                    <p className="text-[11px] font-bold text-muted">{item.label}</p>
                    <p className="mt-1 font-display text-xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>
              {summary.homework.items.length === 0 ? (
                <p className="mt-3 rounded-card border-2 border-dashed border-line bg-surface-muted p-5 text-center text-sm font-semibold text-muted">
                  {t('wsNoHomework', { defaultValue: 'لا توجد واجبات هذا الأسبوع.' })}
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {summary.homework.items.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-card border-2 border-line bg-surface p-3">
                      <div>
                        <p className="text-xs font-black">{item.title}</p>
                        <p className="mt-1 text-[11px] font-semibold text-muted">
                          {formatDate(item.dueDate)}
                        </p>
                      </div>
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                        {homeworkStatusLabel(item.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card-school p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <Target className="h-5 w-5 text-brand-600" aria-hidden="true" />
                {t('wsPractice', { defaultValue: 'التدريب' })}
              </h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-card border-2 border-line bg-surface-muted p-3">
                  <p className="text-[11px] font-bold text-muted">
                    {t('wsAttempts', { defaultValue: 'المحاولات' })}
                  </p>
                  <p className="mt-1 font-display text-xl font-black">{summary.practice.attempts}</p>
                </div>
                <div className="rounded-card border-2 border-brand-300 bg-brand-soft p-3">
                  <p className="text-[11px] font-bold text-brand-800 dark:text-brand-200">
                    {t('wsAverage', { defaultValue: 'متوسط الدرجة' })}
                  </p>
                  <p className="mt-1 font-display text-xl font-black text-brand-700 dark:text-brand-300">
                    {summary.practice.averageScore}%
                  </p>
                </div>
              </div>
              <p className="mt-3 rounded-card bg-surface-muted p-3 text-[11px] font-semibold text-muted">
                {t('wsPracticeNote', { defaultValue: 'ملاحظة التدريب' })}: {summary.practice.note}
              </p>
              <p className="mt-3 rounded-card border-2 border-gold-400/30 bg-gold-50 p-3 text-[11px] font-bold text-gold-900 dark:bg-gold-400/10 dark:text-gold-200">
                {t('wsAdvisory', {
                  defaultValue:
                    'نتائج التدريب استرشادية ولا تُدرج في بطاقة التقدير الرسمية.',
                })}
              </p>
            </section>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="card-school p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <BookOpenCheck className="h-5 w-5 text-brand-600" aria-hidden="true" />
                {t('wsHighlights', { defaultValue: 'أبرز ما في الأسبوع' })}
              </h2>
              {summary.highlights.length === 0 ? (
                <p className="mt-3 rounded-card border-2 border-dashed border-line bg-surface-muted p-5 text-center text-sm font-semibold text-muted">
                  {t('wsNoHighlights', { defaultValue: 'لا توجد أبرز أحداث هذا الأسبوع.' })}
                </p>
              ) : (
                <ul className="mt-3 list-disc space-y-1 pe-5 text-xs font-semibold text-muted">
                  {summary.highlights.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              )}
            </section>

            <section className="card-school p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-black">
                <MessageCircle className="h-5 w-5 text-brand-600" aria-hidden="true" />
                {t('wsConversation', { defaultValue: 'مبادرات للحديث مع طفلك' })}
              </h2>
              {summary.conversationStarters.length === 0 ? (
                <p className="mt-3 rounded-card border-2 border-dashed border-line bg-surface-muted p-5 text-center text-sm font-semibold text-muted">
                  {t('wsNoConversation', { defaultValue: 'لا توجد مقترحات للحديث هذا الأسبوع.' })}
                </p>
              ) : (
                <ul className="mt-3 list-disc space-y-1 pe-5 text-xs font-semibold text-muted">
                  {summary.conversationStarters.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              )}
            </section>
          </div>
        </div>
      ) : null}
    </div>
  )
}
