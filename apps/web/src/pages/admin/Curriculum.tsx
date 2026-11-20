import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  LibraryBig,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

type CurriculumStatus = 'published' | 'draft'

interface CurriculumLevel {
  id: string
  name: string
}

interface CurriculumSubject {
  id: string
  name: string
}

interface CurriculumItem {
  id: string
  levelId: string
  level: string
  subjectId: string
  subject: string
  unit: string
  lessons: string[]
  term: string
  status: CurriculumStatus
}

interface CurriculumResponse {
  items: CurriculumItem[]
  levels: CurriculumLevel[]
  subjects: CurriculumSubject[]
  terms: string[]
}

interface CurriculumMeta {
  levels: CurriculumLevel[]
  subjects: CurriculumSubject[]
  terms: string[]
}

interface CurriculumUpdateBody {
  id: string
  term?: string
  status?: CurriculumStatus
}

interface CurriculumUpdateResponse {
  ok: boolean
  item: CurriculumItem
}

interface SubjectGroup {
  id: string
  name: string
  units: CurriculumItem[]
}

interface ToastState {
  message: string
  tone: 'success' | 'error'
}

const EMPTY_META: CurriculumMeta = { levels: [], subjects: [], terms: [] }

function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u064B-\u0655\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .trim()
}

function subjectKey(item: CurriculumItem): string {
  return item.subjectId || item.subject || 'unknown'
}

function statusBadgeClass(published: boolean): string {
  return published
    ? 'rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-300'
    : 'rounded-full bg-gold-100 px-2.5 py-0.5 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
}

function failureMessage(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-4 text-xs font-semibold text-muted">
      {children}
    </p>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-card border-2 border-line bg-surface-muted p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-black text-brand-700 dark:text-brand-300">
        {value}
      </p>
    </div>
  )
}

function UnitRow({
  item,
  saving,
  terms,
  onUpdate,
}: {
  item: CurriculumItem
  saving: Record<string, boolean>
  terms: string[]
  onUpdate: (item: CurriculumItem, patch: { term?: string; status?: CurriculumStatus }) => void
}) {
  const { t } = useTranslation()
  const busy = saving[item.id] === true
  const published = item.status === 'published'
  const selectId = `cur-unit-term-${item.id}`
  const termOptions = item.term && !terms.includes(item.term) ? [...terms, item.term] : terms

  return (
    <li
      aria-busy={busy}
      className="rounded-card border-2 border-line bg-surface p-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-content">{item.unit || '—'}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            {item.lessons.length} {t('curLessons', { defaultValue: 'دروس' })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={selectId}>
            {t('curTerm', { defaultValue: 'الفصل الدراسي' })}
          </label>
          <select
            id={selectId}
            className="input-school w-auto min-w-[7rem] px-3 py-2 text-xs font-bold"
            value={item.term}
            disabled={busy || termOptions.length === 0}
            onChange={(event) => onUpdate(item, { term: event.target.value })}
            aria-label={t('curTerm', { defaultValue: 'الفصل الدراسي' })}
          >
            {termOptions.length === 0 || !termOptions.includes(item.term) ? (
              <option value="">—</option>
            ) : null}
            {termOptions.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
          <span className={statusBadgeClass(published)} title={t('curStatus', { defaultValue: 'الحالة' })}>
            {published
              ? t('curPublished', { defaultValue: 'منشور' })
              : t('curDraft', { defaultValue: 'مسودة' })}
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              onUpdate(item, { status: published ? 'draft' : 'published' })
            }
            className={`btn-chunky btn-chunky--sm ${
              published ? 'btn-chunky--secondary' : 'btn-chunky--primary'
            }`}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : published ? (
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {published
              ? t('curUnpublish', { defaultValue: 'إلغاء النشر' })
              : t('curPublish', { defaultValue: 'نشر' })}
          </button>
        </div>
      </div>
    </li>
  )
}

function SubjectSection({
  group,
  saving,
  terms,
  onUpdate,
}: {
  group: SubjectGroup
  saving: Record<string, boolean>
  terms: string[]
  onUpdate: (item: CurriculumItem, patch: { term?: string; status?: CurriculumStatus }) => void
}) {
  const { t } = useTranslation()
  const lessonCount = group.units.reduce((sum, item) => sum + item.lessons.length, 0)

  return (
    <section className="card-school overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-line bg-surface-muted px-4 py-3">
        <h2 className="text-sm font-black text-content">{group.name}</h2>
        <p className="text-[11px] font-bold text-muted">
          {group.units.length} {t('curUnits', { defaultValue: 'وحدات' })} · {lessonCount}{' '}
          {t('curLessons', { defaultValue: 'دروس' })}
        </p>
      </header>
      <div className="p-4">
        {group.units.length ? (
          <ul className="space-y-2">
            {group.units.map((item) => (
              <UnitRow
                key={item.id}
                item={item}
                saving={saving}
                terms={terms}
                onUpdate={onUpdate}
              />
            ))}
          </ul>
        ) : (
          <p className="rounded-card border-2 border-dashed border-line bg-surface-muted px-3 py-3 text-[11px] font-semibold text-muted">
            {t('curNoUnits', {
              defaultValue: 'لا توجد وحدات لهذه المادة في هذا الفصل.',
            })}
          </p>
        )}
      </div>
    </section>
  )
}

export default function Curriculum() {
  const { t } = useTranslation()
  const [items, setItems] = useState<CurriculumItem[]>([])
  const [meta, setMeta] = useState<CurriculumMeta>(EMPTY_META)
  const [levelId, setLevelId] = useState('')
  const [term, setTerm] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [toast, setToast] = useState<ToastState | null>(null)
  const savingRef = useRef<Set<string>>(new Set())

  const activeLevelId = levelId || meta.levels[0]?.id || ''
  const activeTerm = term || meta.terms[0] || ''

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setError(null)

    apiGet<CurriculumResponse>('/admin/curriculum', {
      params: { levelId: activeLevelId, term: activeTerm },
      signal: controller.signal,
    })
      .then((data) => {
        if (cancelled) return
        setItems(Array.isArray(data.items) ? data.items : [])
        setMeta({
          levels: Array.isArray(data.levels) ? data.levels : [],
          subjects: Array.isArray(data.subjects) ? data.subjects : [],
          terms: Array.isArray(data.terms) ? data.terms : [],
        })
      })
      .catch((err: unknown) => {
        if (cancelled || controller.signal.aborted) return
        setError(
          failureMessage(
            err,
            t('curLoadError', { defaultValue: 'تعذّر تحميل المنهج. حاول مجددًا.' }),
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
  }, [activeLevelId, activeTerm, reloadKey, t])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const visibleItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (!activeLevelId || item.levelId === activeLevelId) &&
          (!activeTerm || item.term === activeTerm),
      ),
    [items, activeLevelId, activeTerm],
  )

  const levelOptions = useMemo(() => {
    if (!activeLevelId || meta.levels.some((level) => level.id === activeLevelId)) {
      return meta.levels
    }
    return [...meta.levels, { id: activeLevelId, name: activeLevelId }]
  }, [meta.levels, activeLevelId])

  const termOptions = useMemo(() => {
    if (!activeTerm || meta.terms.includes(activeTerm)) return meta.terms
    return [...meta.terms, activeTerm]
  }, [meta.terms, activeTerm])

  const subjectOptions = useMemo(() => {
    if (meta.subjects.length) return meta.subjects
    const map = new Map<string, string>()
    for (const item of visibleItems) {
      const key = subjectKey(item)
      if (!map.has(key)) map.set(key, item.subject || item.subjectId || key)
    }
    return [...map.entries()].map(([id, name]) => ({ id, name }))
  }, [meta.subjects, visibleItems])

  const stats = useMemo(() => {
    const total = visibleItems.length
    const published = visibleItems.filter((item) => item.status === 'published').length
    const drafts = visibleItems.filter((item) => item.status === 'draft').length
    const lessons = visibleItems.reduce((sum, item) => sum + item.lessons.length, 0)
    const covered = new Set(visibleItems.map(subjectKey)).size
    const totalSubjects = subjectOptions.length || covered
    const percent = total === 0 ? 0 : Math.round((published / total) * 100)
    return { total, published, drafts, lessons, covered, totalSubjects, percent }
  }, [visibleItems, subjectOptions])

  const groups = useMemo(() => {
    const map = new Map<string, SubjectGroup>()
    for (const subject of subjectOptions) {
      map.set(subject.id, { id: subject.id, name: subject.name, units: [] })
    }
    for (const item of visibleItems) {
      const key = subjectKey(item)
      const group = map.get(key)
      if (group) {
        group.units.push(item)
      } else {
        map.set(key, {
          id: key,
          name: item.subject || item.subjectId || key,
          units: [item],
        })
      }
    }

    const base = [...map.values()]
    const filtered = subjectFilter ? base.filter((group) => group.id === subjectFilter) : base
    const query = normalizeSearch(search)
    if (!query) return filtered

    return filtered
      .map((group) => {
        const subjectMatches = normalizeSearch(group.name).includes(query)
        const units = subjectMatches
          ? group.units
          : group.units.filter(
              (item) =>
                normalizeSearch(item.unit).includes(query) ||
                item.lessons.some((lesson) => normalizeSearch(lesson).includes(query)),
            )
        return { ...group, units }
      })
      .filter((group) => group.units.length > 0 || normalizeSearch(group.name).includes(query))
  }, [subjectOptions, visibleItems, subjectFilter, search])

  async function saveItem(
    item: CurriculumItem,
    patch: { term?: string; status?: CurriculumStatus },
  ) {
    if (savingRef.current.has(item.id)) return
    savingRef.current.add(item.id)
    const body: CurriculumUpdateBody = { id: item.id, ...patch }

    setSaving((prev) => ({ ...prev, [item.id]: true }))
    setItems((prev) =>
      prev.map((row) => (row.id === item.id ? { ...row, ...patch } : row)),
    )
    setToast(null)

    try {
      const result = await apiPost<CurriculumUpdateResponse, CurriculumUpdateBody>(
        '/admin/curriculum/update',
        body,
      )
      if (result.item && result.item.id === item.id) {
        setItems((prev) =>
          prev.map((row) => (row.id === item.id ? result.item : row)),
        )
      }
      setToast({
        message: t('curSaved', { defaultValue: 'تم حفظ التغيير.' }),
        tone: 'success',
      })
    } catch (err: unknown) {
      setItems((prev) => prev.map((row) => (row.id === item.id ? item : row)))
      setToast({
        message: failureMessage(
          err,
          t('curSaveFailed', {
            defaultValue: 'تعذّر حفظ التغيير. أُعيدت الحالة السابقة.',
          }),
        ),
        tone: 'error',
      })
    } finally {
      savingRef.current.delete(item.id)
      setSaving((prev) => {
        const next = { ...prev }
        delete next[item.id]
        return next
      })
    }
  }

  function handleUpdate(
    item: CurriculumItem,
    patch: { term?: string; status?: CurriculumStatus },
  ) {
    void saveItem(item, patch)
  }

  const activeTermLabel = activeTerm || '—'

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('curTitle', { defaultValue: 'المنهج الدراسي: النطاق والتسلسل' })}
          </h1>
          <p className="mt-2 flex max-w-3xl items-start gap-1.5 text-[11px] font-semibold leading-relaxed text-muted">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
            <span>
              {t('curSubtitle', {
                defaultValue:
                  'المحتوى مستمد من المنهج الرسمي. تُسجَّل كل تغييرات الفصل والنشر في سجل التدقيق.',
              })}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          disabled={loading}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {t('curRefresh', { defaultValue: 'تحديث' })}
        </button>
      </section>

      <section className="card-school p-4 sm:p-5" aria-label={t('curTitle', { defaultValue: 'المنهج الدراسي: النطاق والتسلسل' })}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('curLevel', { defaultValue: 'المستوى' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={activeLevelId}
              disabled={levelOptions.length === 0}
              onChange={(event) => {
                setLevelId(event.target.value)
                setSubjectFilter('')
              }}
            >
              {levelOptions.length === 0 ? <option value="">—</option> : null}
              {levelOptions.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('curTerm', { defaultValue: 'الفصل الدراسي' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={activeTerm}
              disabled={termOptions.length === 0}
              onChange={(event) => setTerm(event.target.value)}
            >
              {termOptions.length === 0 ? <option value="">—</option> : null}
              {termOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('curSubject', { defaultValue: 'المادة' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              <option value="">
                {t('curAllSubjects', { defaultValue: 'كل المواد' })}
              </option>
              {subjectOptions.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('curSearch', { defaultValue: 'بحث في الوحدات والدروس' })}
            </span>
            <span className="relative block">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                className="input-school ps-10 py-2.5 text-sm"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('curSearch', { defaultValue: 'بحث في الوحدات والدروس' })}
              />
            </span>
          </label>
        </div>
      </section>

      {toast ? (
        <p
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className={`rounded-card border-2 p-3 text-xs font-bold ${
            toast.tone === 'error'
              ? 'border-[#E03131]/40 bg-[#E03131]/10 text-[#b42318] dark:text-[#ff8787]'
              : 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-200'
          }`}
        >
          {toast.message}
        </p>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="card-school flex flex-wrap items-center justify-between gap-3 border-[#E03131]/40 p-5"
        >
          <p className="flex items-start gap-2 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-chunky btn-chunky--danger btn-chunky--sm"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('curRetry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('curLoading', { defaultValue: 'جارٍ تحميل المنهج…' })}
        </div>
      ) : (
        <>
          <section className="card-school p-5" aria-label={t('curCoverage', { defaultValue: 'تغطية الفصل' })}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-black">
                {t('curCoverage', { defaultValue: 'تغطية الفصل' })}
              </h2>
              <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-black text-brand-700 dark:text-brand-300">
                {activeTermLabel}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              <StatCard
                icon={BookOpen}
                label={t('curUnits', { defaultValue: 'وحدات' })}
                value={String(stats.total)}
              />
              <StatCard
                icon={CheckCircle2}
                label={t('curPublished', { defaultValue: 'منشور' })}
                value={String(stats.published)}
              />
              <StatCard
                icon={FileText}
                label={t('curDraft', { defaultValue: 'مسودة' })}
                value={String(stats.drafts)}
              />
              <StatCard
                icon={LibraryBig}
                label={t('curLessons', { defaultValue: 'دروس' })}
                value={String(stats.lessons)}
              />
              <StatCard
                icon={GraduationCap}
                label={t('curSubjectsCovered', { defaultValue: 'المواد المغطاة' })}
                value={`${stats.covered} / ${stats.totalSubjects}`}
              />
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-muted">
                <span>{activeTermLabel}</span>
                <span>
                  {stats.percent}% · {stats.published} / {stats.total}{' '}
                  {t('curUnits', { defaultValue: 'وحدات' })}
                </span>
              </div>
              <div
                className="mt-2 h-3 overflow-hidden rounded-full bg-surface-muted"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={stats.percent}
                aria-label={t('curCoverage', { defaultValue: 'تغطية الفصل' })}
              >
                <div
                  className="h-full rounded-full bg-brand-500 transition-[width] duration-300"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </div>
          </section>

          {groups.length ? (
            <div className="space-y-4">
              {groups.map((group) => (
                <SubjectSection
                  key={group.id}
                  group={group}
                  saving={saving}
                  terms={termOptions}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          ) : (
            <Notice>
              {normalizeSearch(search) || subjectFilter
                ? t('curNoMatch', {
                    defaultValue: 'لا توجد نتائج مطابقة للبحث أو التصفية.',
                  })
                : t('curEmpty', {
                    defaultValue: 'لا توجد وحدات منهجية لهذا المستوى في هذا الفصل.',
                  })}
            </Notice>
          )}
        </>
      )}
    </div>
  )
}
