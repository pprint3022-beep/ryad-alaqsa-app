import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileText,
  GraduationCap,
  History,
  Loader2,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  type LucideIcon,
} from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type PlanStatus = 'draft' | 'in_review' | 'published'

interface IdName {
  id: string
  name: string
}

interface PlanActivity {
  id?: string
  title: string
  type: string
  description: string
  durationMinutes: number
}

interface PlanDifferentiation {
  id?: string
  group: string
  need: string
  strategy: string
}

interface PlanResource {
  id?: string
  title: string
  type: string
  reference: string
}

interface PlanHistoryEntry {
  at: string
  by: string
  action: string
  details?: string
}

interface Plan {
  id: string
  curriculumId: string
  levelId: string
  levelName: string
  subjectId: string
  subjectName: string
  unit: string
  lessonTitle: string
  term: string
  status: PlanStatus
  objectives: string[]
  activities: PlanActivity[]
  differentiation: PlanDifferentiation[]
  resources: PlanResource[]
  competencyIds: string[]
  ownerId: string
  ownerRole: string
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
  reviewedBy?: string | null
  history: PlanHistoryEntry[]
}

interface PlansResponse {
  plans: Plan[]
  meta: { statuses: string[]; terms: string[] }
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
  status: string
}

interface CurriculumResponse {
  items: CurriculumItem[]
  terms: string[]
  subjects: IdName[]
  levels: IdName[]
}

interface PlanEnvelope {
  plan: Plan
}

interface ActivityDraft {
  title: string
  type: string
  description: string
  durationMinutes: string
}

interface DifferentiationDraft {
  group: string
  need: string
  strategy: string
}

interface ResourceDraft {
  title: string
  type: string
  reference: string
}

interface CreatePlanBody {
  curriculumId: string
  lessonTitle: string
  term: string
  objectives: string[]
  activities: Array<{
    title: string
    type: string
    description: string
    durationMinutes: number
  }>
  differentiation: Array<{ group: string; need: string; strategy: string }>
  resources: Array<{ title: string; type: string; reference: string }>
}

interface UpdatePlanBody {
  id: string
  lessonTitle?: string
  objectives?: string[]
  resources?: Array<{ title: string; type: string; reference: string }>
}

type ToastTone = 'success' | 'error'
type Notify = (message: string, tone: ToastTone) => void

const ACTIVITY_TYPES = ['practice', 'exploration', 'assessment', 'game']
const DIFF_GROUPS = ['support', 'enrichment', 'all']
const RESOURCE_TYPES = ['link', 'file', 'library', 'material']

/* -------------------------------------------------------------------------- */
/*  Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function failureMessage(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

function resolveLocale(language?: string): string {
  if (!language) return 'ar-MA'
  if (language === 'ar') return 'ar-MA'
  if (language === 'amz') return 'fr'
  return language
}

function formatDate(value: string | null | undefined, locale: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatCount(value: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(Number.isFinite(value) ? value : 0)
}

function emptyActivity(): ActivityDraft {
  return { title: '', type: 'practice', description: '', durationMinutes: '' }
}

function emptyDifferentiation(): DifferentiationDraft {
  return { group: 'all', need: '', strategy: '' }
}

function emptyResource(): ResourceDraft {
  return { title: '', type: 'link', reference: '' }
}

/* -------------------------------------------------------------------------- */
/*  Small shared pieces                                                        */
/* -------------------------------------------------------------------------- */

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div
      className={`rounded-card border-2 p-4 text-xs font-bold ${
        error
          ? 'border-[#E03131]/30 bg-[#E03131]/10 text-[#b42318] dark:text-[#ff8787]'
          : 'border-dashed border-line bg-surface-muted text-muted'
      }`}
    >
      {children}
    </div>
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

function statusBadgeClass(status: PlanStatus): string {
  if (status === 'published') {
    return 'rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300'
  }
  if (status === 'in_review') {
    return 'rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300'
  }
  return 'rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-black text-muted'
}

/* -------------------------------------------------------------------------- */
/*  New plan form                                                              */
/* -------------------------------------------------------------------------- */

function NewPlanForm({
  items,
  terms,
  notify,
  onCreated,
}: {
  items: CurriculumItem[]
  terms: string[]
  notify: Notify
  onCreated: () => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [curriculumId, setCurriculumId] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')
  const [term, setTerm] = useState(terms[0] || '')
  const [objectivesText, setObjectivesText] = useState('')
  const [activities, setActivities] = useState<ActivityDraft[]>([emptyActivity()])
  const [differentiation, setDifferentiation] = useState<DifferentiationDraft[]>([
    emptyDifferentiation(),
  ])
  const [resources, setResources] = useState<ResourceDraft[]>([emptyResource()])
  const [formError, setFormError] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const selectedItem = items.find((item) => item.id === curriculumId)
  const lessonOptions = selectedItem?.lessons ?? []
  const termOptions = Array.from(new Set([...terms, ...(selectedItem?.term ? [selectedItem.term] : [])]))

  const objectives = objectivesText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  function activityTypeLabel(value: string): string {
    if (value === 'practice') return t('leActPractice', { defaultValue: 'تدريب' })
    if (value === 'exploration') return t('leActExploration', { defaultValue: 'استكشاف' })
    if (value === 'assessment') return t('leActAssessment', { defaultValue: 'تقويم' })
    return t('leActGame', { defaultValue: 'لعبة' })
  }

  function diffGroupLabel(value: string): string {
    if (value === 'support') return t('leDiffSupport', { defaultValue: 'دعم' })
    if (value === 'enrichment') return t('leDiffEnrichment', { defaultValue: 'إثراء' })
    return t('leDiffAll', { defaultValue: 'الجميع' })
  }

  function resourceTypeLabel(value: string): string {
    if (value === 'link') return t('leResLink', { defaultValue: 'رابط' })
    if (value === 'file') return t('leResFile', { defaultValue: 'ملف' })
    if (value === 'library') return t('leResLibrary', { defaultValue: 'مكتبة' })
    return t('leResMaterial', { defaultValue: 'مادة' })
  }

  function resetForm() {
    setCurriculumId('')
    setLessonTitle('')
    setTerm(terms[0] || '')
    setObjectivesText('')
    setActivities([emptyActivity()])
    setDifferentiation([emptyDifferentiation()])
    setResources([emptyResource()])
    setFormError(null)
    setCreateError(null)
  }

  function patchActivity(index: number, patch: Partial<ActivityDraft>) {
    setActivities((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  function patchDifferentiation(index: number, patch: Partial<DifferentiationDraft>) {
    setDifferentiation((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    )
  }

  function patchResource(index: number, patch: Partial<ResourceDraft>) {
    setResources((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  async function handleCreate() {
    setFormError(null)
    setCreateError(null)
    if (!curriculumId || !lessonTitle.trim() || !term || objectives.length === 0) {
      setFormError(t('leRequired', { defaultValue: 'يرجى تعبئة الحقول المطلوبة.' }))
      return
    }

    const body: CreatePlanBody = {
      curriculumId,
      lessonTitle: lessonTitle.trim(),
      term,
      objectives,
      activities: activities
        .filter((row) => row.title.trim() || row.description.trim())
        .map((row) => ({
          title: row.title.trim(),
          type: row.type,
          description: row.description.trim(),
          durationMinutes: Number(row.durationMinutes) || 0,
        })),
      differentiation: differentiation
        .filter((row) => row.need.trim() || row.strategy.trim())
        .map((row) => ({
          group: row.group,
          need: row.need.trim(),
          strategy: row.strategy.trim(),
        })),
      resources: resources
        .filter((row) => row.title.trim() || row.reference.trim())
        .map((row) => ({
          title: row.title.trim(),
          type: row.type,
          reference: row.reference.trim(),
        })),
    }

    setSaving(true)
    try {
      await apiPost<PlanEnvelope, CreatePlanBody>('/teacher/lesson-plans', body)
      notify(t('leCreated', { defaultValue: 'تم إنشاء الخطة بنجاح.' }), 'success')
      resetForm()
      setOpen(false)
      onCreated()
    } catch (err: unknown) {
      const detail = failureMessage(
        err,
        t('leCreateFailed', { defaultValue: 'تعذّر إنشاء الخطة.' }),
      )
      setCreateError(
        `${t('leCreateFailed', { defaultValue: 'تعذّر إنشاء الخطة.' })}${
          detail ? ` — ${detail}` : ''
        }`,
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="card-school p-4 sm:p-5 print:hidden" aria-label={t('leNewPlan', { defaultValue: 'خطة درس جديدة' })}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-base font-black">
            {t('leNewPlan', { defaultValue: 'خطة درس جديدة' })}
          </h2>
          <p className="mt-1 text-[11px] font-semibold text-muted">
            {t('leHint', {
              defaultValue: 'خططك مكتوبة بخط اليد وتراجع قبل النشر؛ لا تُتخذ قرارات آلية.',
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="btn-chunky btn-chunky--primary btn-chunky--sm"
        >
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 rotate-180" aria-hidden="true" />
          ) : (
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {open
            ? t('leCancel', { defaultValue: 'إلغاء' })
            : t('leNewPlan', { defaultValue: 'خطة درس جديدة' })}
        </button>
      </div>

      {open ? (
        <div className="mt-4 space-y-4 border-t-2 border-line pt-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold text-muted">
                {t('leCurriculum', { defaultValue: 'المنهج' })}
              </span>
              <select
                className="input-school py-2.5 text-sm font-bold"
                value={curriculumId}
                onChange={(event) => {
                  const id = event.target.value
                  setCurriculumId(id)
                  setLessonTitle('')
                  const item = items.find((row) => row.id === id)
                  if (item?.term) setTerm(item.term)
                }}
              >
                <option value="">—</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.unit} — {item.subject} (
                    {t('enumLevel', { defaultValue: 'المستوى' })}: {item.level})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold text-muted">
                {t('leLessonTitle', { defaultValue: 'عنوان الدرس' })}
              </span>
              {lessonOptions.length ? (
                <select
                  className="input-school py-2.5 text-sm font-bold"
                  value={lessonTitle}
                  onChange={(event) => setLessonTitle(event.target.value)}
                >
                  <option value="">—</option>
                  {lessonOptions.map((lesson, index) => (
                    <option key={`${lesson}-${index}`} value={lesson}>
                      {lesson}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="input-school py-2.5 text-sm font-bold"
                  value={lessonTitle}
                  onChange={(event) => setLessonTitle(event.target.value)}
                  placeholder={t('leLessonTitle', { defaultValue: 'عنوان الدرس' })}
                />
              )}
            </label>

            <label className="block">
              <span className="mb-1 block text-[11px] font-extrabold text-muted">
                {t('leTerm', { defaultValue: 'الفصل الدراسي' })}
              </span>
              <select
                className="input-school py-2.5 text-sm font-bold"
                value={term}
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
          </div>

          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('leObjectives', { defaultValue: 'الأهداف (سطر لكل هدف)' })}
            </span>
            <textarea
              className="input-school min-h-20"
              value={objectivesText}
              onChange={(event) => setObjectivesText(event.target.value)}
              placeholder={t('leObjectives', { defaultValue: 'الأهداف (سطر لكل هدف)' })}
            />
          </label>

          {/* Activities */}
          <div className="rounded-card border-2 border-line bg-surface-muted p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-xs font-black text-content">
                {t('leActivitiesLabel', { defaultValue: 'الأنشطة' })}
              </h3>
              <button
                type="button"
                onClick={() => setActivities((prev) => [...prev, emptyActivity()])}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                {t('leAddActivity', { defaultValue: 'إضافة نشاط' })}
              </button>
            </div>
            <div className="space-y-3">
              {activities.map((row, index) => (
                <div
                  key={`activity-${index}`}
                  className="rounded-card border-2 border-line bg-surface p-3"
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-extrabold text-muted">
                        {t('leActTitle', { defaultValue: 'عنوان النشاط' })}
                      </span>
                      <input
                        className="input-school py-2 text-sm"
                        value={row.title}
                        onChange={(event) => patchActivity(index, { title: event.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-extrabold text-muted">
                        {t('leActType', { defaultValue: 'نوع النشاط' })}
                      </span>
                      <select
                        className="input-school py-2 text-sm font-bold"
                        value={row.type}
                        onChange={(event) => patchActivity(index, { type: event.target.value })}
                      >
                        {ACTIVITY_TYPES.map((value) => (
                          <option key={value} value={value}>
                            {activityTypeLabel(value)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="mt-2 block">
                    <span className="mb-1 block text-[11px] font-extrabold text-muted">
                      {t('leActDesc', { defaultValue: 'وصف النشاط' })}
                    </span>
                    <textarea
                      className="input-school min-h-16"
                      value={row.description}
                      onChange={(event) => patchActivity(index, { description: event.target.value })}
                    />
                  </label>
                  <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-extrabold text-muted">
                        {t('leActDuration', { defaultValue: 'المدة (بالدقائق)' })}
                      </span>
                      <input
                        type="number"
                        min={0}
                        className="input-school w-28 py-2 text-sm"
                        value={row.durationMinutes}
                        onChange={(event) =>
                          patchActivity(index, { durationMinutes: event.target.value })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setActivities((prev) => prev.filter((_, i) => i !== index))
                      }
                      disabled={activities.length === 1}
                      className="btn-chunky btn-chunky--danger btn-chunky--sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('leRemove', { defaultValue: 'إزالة' })}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Differentiation */}
          <div className="rounded-card border-2 border-line bg-surface-muted p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-xs font-black text-content">
                {t('leDifferentiationLabel', { defaultValue: 'التمايز' })}
              </h3>
              <button
                type="button"
                onClick={() =>
                  setDifferentiation((prev) => [...prev, emptyDifferentiation()])
                }
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                {t('leAddDifferentiation', { defaultValue: 'إضافة تمايز' })}
              </button>
            </div>
            <div className="space-y-3">
              {differentiation.map((row, index) => (
                <div
                  key={`diff-${index}`}
                  className="rounded-card border-2 border-line bg-surface p-3"
                >
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-extrabold text-muted">
                      {t('leDiffGroup', { defaultValue: 'المجموعة' })}
                    </span>
                    <select
                      className="input-school py-2 text-sm font-bold"
                      value={row.group}
                      onChange={(event) =>
                        patchDifferentiation(index, { group: event.target.value })
                      }
                    >
                      {DIFF_GROUPS.map((value) => (
                        <option key={value} value={value}>
                          {diffGroupLabel(value)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-extrabold text-muted">
                        {t('leDiffNeed', { defaultValue: 'الحاجة' })}
                      </span>
                      <input
                        className="input-school py-2 text-sm"
                        value={row.need}
                        onChange={(event) =>
                          patchDifferentiation(index, { need: event.target.value })
                        }
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-extrabold text-muted">
                        {t('leDiffStrategy', { defaultValue: 'استراتيجية التمايز' })}
                      </span>
                      <input
                        className="input-school py-2 text-sm"
                        value={row.strategy}
                        onChange={(event) =>
                          patchDifferentiation(index, { strategy: event.target.value })
                        }
                      />
                    </label>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setDifferentiation((prev) => prev.filter((_, i) => i !== index))
                      }
                      disabled={differentiation.length === 1}
                      className="btn-chunky btn-chunky--danger btn-chunky--sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('leRemove', { defaultValue: 'إزالة' })}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="rounded-card border-2 border-line bg-surface-muted p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-xs font-black text-content">
                {t('leResourcesLabel', { defaultValue: 'الموارد' })}
              </h3>
              <button
                type="button"
                onClick={() => setResources((prev) => [...prev, emptyResource()])}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                {t('leAddResource', { defaultValue: 'إضافة مورد' })}
              </button>
            </div>
            <div className="space-y-3">
              {resources.map((row, index) => (
                <div
                  key={`resource-${index}`}
                  className="rounded-card border-2 border-line bg-surface p-3"
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-extrabold text-muted">
                        {t('leResTitle', { defaultValue: 'عنوان المورد' })}
                      </span>
                      <input
                        className="input-school py-2 text-sm"
                        value={row.title}
                        onChange={(event) => patchResource(index, { title: event.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-extrabold text-muted">
                        {t('leResType', { defaultValue: 'نوع المورد' })}
                      </span>
                      <select
                        className="input-school py-2 text-sm font-bold"
                        value={row.type}
                        onChange={(event) => patchResource(index, { type: event.target.value })}
                      >
                        {RESOURCE_TYPES.map((value) => (
                          <option key={value} value={value}>
                            {resourceTypeLabel(value)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="mt-2 block">
                    <span className="mb-1 block text-[11px] font-extrabold text-muted">
                      {t('leResReference', { defaultValue: 'المرجع' })}
                    </span>
                    <input
                      className="input-school py-2 text-sm"
                      value={row.reference}
                      onChange={(event) =>
                        patchResource(index, { reference: event.target.value })
                      }
                    />
                  </label>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setResources((prev) => prev.filter((_, i) => i !== index))
                      }
                      disabled={resources.length === 1}
                      className="btn-chunky btn-chunky--danger btn-chunky--sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('leRemove', { defaultValue: 'إزالة' })}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {formError ? (
            <div>
              <Notice error>{formError}</Notice>
            </div>
          ) : null}
          {createError ? (
            <div>
              <Notice error>{createError}</Notice>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={saving}
              className="btn-chunky btn-chunky--primary btn-chunky--sm"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {t('leCreate', { defaultValue: 'إنشاء الخطة' })}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                resetForm()
              }}
              className="btn-chunky btn-chunky--secondary btn-chunky--sm"
            >
              {t('leCancel', { defaultValue: 'إلغاء' })}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Plan card                                                                  */
/* -------------------------------------------------------------------------- */

function PlanCard({
  plan,
  locale,
  notify,
  onChanged,
}: {
  plan: Plan
  locale: string
  notify: Notify
  onChanged: () => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [editTitle, setEditTitle] = useState(plan.lessonTitle || '')
  const [editObjectives, setEditObjectives] = useState((plan.objectives || []).join('\n'))
  const [editReference, setEditReference] = useState(plan.resources?.[0]?.reference || '')
  const [editError, setEditError] = useState<string | null>(null)
  const panelId = useId()

  const objectives = Array.isArray(plan.objectives) ? plan.objectives : []
  const activities = Array.isArray(plan.activities) ? plan.activities : []
  const differentiation = Array.isArray(plan.differentiation) ? plan.differentiation : []
  const resources = Array.isArray(plan.resources) ? plan.resources : []
  const history = Array.isArray(plan.history) ? plan.history : []

  function activityTypeLabel(value: string): string {
    if (value === 'practice') return t('leActPractice', { defaultValue: 'تدريب' })
    if (value === 'exploration') return t('leActExploration', { defaultValue: 'استكشاف' })
    if (value === 'assessment') return t('leActAssessment', { defaultValue: 'تقويم' })
    return t('leActGame', { defaultValue: 'لعبة' })
  }

  function diffGroupLabel(value: string): string {
    if (value === 'support') return t('leDiffSupport', { defaultValue: 'دعم' })
    if (value === 'enrichment') return t('leDiffEnrichment', { defaultValue: 'إثراء' })
    return t('leDiffAll', { defaultValue: 'الجميع' })
  }

  function resourceTypeLabel(value: string): string {
    if (value === 'link') return t('leResLink', { defaultValue: 'رابط' })
    if (value === 'file') return t('leResFile', { defaultValue: 'ملف' })
    if (value === 'library') return t('leResLibrary', { defaultValue: 'مكتبة' })
    return t('leResMaterial', { defaultValue: 'مادة' })
  }

  function statusLabel(): string {
    if (plan.status === 'draft') return t('leDraft', { defaultValue: 'مسودة' })
    if (plan.status === 'in_review') return t('leReview', { defaultValue: 'قيد المراجعة' })
    return t('lePublished', { defaultValue: 'منشورة' })
  }

  async function handleSubmit() {
    setBusy(true)
    try {
      await apiPost<PlanEnvelope, { id: string }>('/teacher/lesson-plans/submit', {
        id: plan.id,
      })
      notify(t('leSubmitted', { defaultValue: 'تم إرسال الخطة للمراجعة.' }), 'success')
      onChanged()
    } catch (err: unknown) {
      notify(failureMessage(err, t('leCreateFailed', { defaultValue: 'تعذّر إرسال الخطة.' })), 'error')
    } finally {
      setBusy(false)
    }
  }

  async function handleUpdate() {
    setEditError(null)
    const parsedObjectives = editObjectives
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (!editTitle.trim() || parsedObjectives.length === 0) {
      setEditError(t('leRequired', { defaultValue: 'يرجى تعبئة الحقول المطلوبة.' }))
      return
    }

    const nextResources = resources.length
      ? resources.map((row, index) => ({
          title: row.title,
          type: row.type,
          reference: index === 0 ? editReference.trim() : row.reference,
        }))
      : [{ title: editTitle.trim(), type: 'link', reference: editReference.trim() }]

    const body: UpdatePlanBody = {
      id: plan.id,
      lessonTitle: editTitle.trim(),
      objectives: parsedObjectives,
      resources: nextResources,
    }

    setBusy(true)
    try {
      await apiPost<PlanEnvelope, UpdatePlanBody>('/teacher/lesson-plans/update', body)
      notify(t('leUpdated', { defaultValue: 'تم تحديث الخطة.' }), 'success')
      setEditing(false)
      onChanged()
    } catch (err: unknown) {
      const detail = failureMessage(err, '')
      setEditError(
        `${t('leCreateFailed', { defaultValue: 'تعذّر تحديث الخطة.' })}${
          detail ? ` — ${detail}` : ''
        }`,
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className="rounded-card border-2 border-line bg-surface p-4 print:break-inside-avoid">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="min-w-0 flex-1 text-start"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-extrabold text-content">
              {plan.lessonTitle || '—'}
            </span>
            <span className={statusBadgeClass(plan.status)} title={t('leStatus', { defaultValue: 'الحالة' })}>
              {statusLabel()}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-bold text-muted">
            <span className="rounded-full bg-surface-muted px-2 py-0.5">
              {plan.levelName ||
                (plan.levelId
                  ? `${t('enumId', { defaultValue: 'المعرّف' })}: ${plan.levelId}`
                  : '—')}
            </span>
            <span className="rounded-full bg-surface-muted px-2 py-0.5">
              {plan.subjectName ||
                (plan.subjectId
                  ? `${t('enumId', { defaultValue: 'المعرّف' })}: ${plan.subjectId}`
                  : '—')}
            </span>
            <span className="rounded-full bg-surface-muted px-2 py-0.5">{plan.unit || '—'}</span>
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand-700 dark:text-brand-300">
              {plan.term || '—'}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-muted">
            <span>
              <BookOpen className="me-1 inline h-3 w-3" aria-hidden="true" />
              {formatCount(objectives.length, locale)} {t('leObjectivesLabel', { defaultValue: 'الأهداف' })}
            </span>
            <span>
              <FileText className="me-1 inline h-3 w-3" aria-hidden="true" />
              {formatCount(activities.length, locale)} {t('leActivitiesLabel', { defaultValue: 'الأنشطة' })}
            </span>
            <span>
              {t('enumTeacher', { defaultValue: 'المعلم' })} ·{' '}
              {t('enumId', { defaultValue: 'المعرّف' })}: {plan.ownerId || '—'}
            </span>
            <span>{formatDate(plan.createdAt, locale)}</span>
            <span>{formatDate(plan.updatedAt, locale)}</span>
          </div>
        </button>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {plan.status === 'draft' ? (
            <>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={busy}
                className="btn-chunky btn-chunky--primary btn-chunky--sm"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                {t('leSubmit', { defaultValue: 'إرسال للمراجعة' })}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(true)
                  setEditing((value) => !value)
                }}
                disabled={busy}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                {t('leEdit', { defaultValue: 'تعديل' })}
              </button>
            </>
          ) : null}
          {plan.status === 'in_review' ? (
            <span className="rounded-full bg-gold-100 px-2 py-1 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
              {t('leAwaitingReview', { defaultValue: 'الخطة قيد المراجعة ولا يمكن تعديلها.' })}
            </span>
          ) : null}
          {plan.status === 'published' ? (
            <span className="rounded-full bg-surface-muted px-2 py-1 text-[10px] font-black text-muted">
              {t('leImmutable', { defaultValue: 'لا يمكن تعديل خطة منشورة.' })}
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            {t('lePrint', { defaultValue: 'طباعة' })}
          </button>
          <ChevronDown
            className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        id={panelId}
        className={open ? 'mt-3 border-t-2 border-line pt-3' : 'mt-3 hidden border-t-2 border-line pt-3 print:block'}
      >
        {editing && plan.status === 'draft' ? (
          <div className="mb-4 rounded-card border-2 border-line bg-surface-muted p-3 print:hidden">
            <div className="grid gap-2">
              <label className="block">
                <span className="mb-1 block text-[11px] font-extrabold text-muted">
                  {t('leLessonTitle', { defaultValue: 'عنوان الدرس' })}
                </span>
                <input
                  className="input-school py-2 text-sm"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-extrabold text-muted">
                  {t('leObjectives', { defaultValue: 'الأهداف (سطر لكل هدف)' })}
                </span>
                <textarea
                  className="input-school min-h-20"
                  value={editObjectives}
                  onChange={(event) => setEditObjectives(event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[11px] font-extrabold text-muted">
                  {t('leResReference', { defaultValue: 'المرجع' })}
                </span>
                <input
                  className="input-school py-2 text-sm"
                  value={editReference}
                  onChange={(event) => setEditReference(event.target.value)}
                />
              </label>
            </div>
            {editError ? (
              <div className="mt-3">
                <Notice error>{editError}</Notice>
              </div>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleUpdate()}
                disabled={busy}
                className="btn-chunky btn-chunky--primary btn-chunky--sm"
              >
                {busy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {t('leEdit', { defaultValue: 'تعديل' })}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm"
              >
                {t('leCancel', { defaultValue: 'إلغاء' })}
              </button>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <section>
            <h4 className="text-xs font-black text-content">
              {t('leObjectivesLabel', { defaultValue: 'الأهداف' })} ({formatCount(objectives.length, locale)})
            </h4>
            {objectives.length ? (
              <ul className="mt-2 list-disc space-y-1 ps-5 text-xs font-semibold leading-relaxed text-content">
                {objectives.map((objective, index) => (
                  <li key={`objective-${index}`}>{objective}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs font-semibold text-muted">—</p>
            )}
          </section>

          <section>
            <h4 className="text-xs font-black text-content">
              {t('leActivitiesLabel', { defaultValue: 'الأنشطة' })} ({formatCount(activities.length, locale)})
            </h4>
            {activities.length ? (
              <ul className="mt-2 space-y-2">
                {activities.map((activity, index) => (
                  <li
                    key={activity.id || `activity-${index}`}
                    className="rounded-card bg-surface-muted p-2 text-xs font-semibold"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-content">{activity.title || '—'}</span>
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                        {activityTypeLabel(activity.type)}
                      </span>
                      <span className="text-muted">
                        {t('leDuration', { defaultValue: 'المدة' })}:{' '}
                        {formatCount(activity.durationMinutes || 0, locale)}
                      </span>
                    </div>
                    {activity.description ? (
                      <p className="mt-1 text-muted">{activity.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs font-semibold text-muted">—</p>
            )}
          </section>

          <section>
            <h4 className="text-xs font-black text-content">
              {t('leDifferentiationLabel', { defaultValue: 'التمايز' })} (
              {formatCount(differentiation.length, locale)})
            </h4>
            {differentiation.length ? (
              <ul className="mt-2 space-y-2">
                {differentiation.map((row, index) => (
                  <li
                    key={row.id || `diff-${index}`}
                    className="rounded-card bg-surface-muted p-2 text-xs font-semibold"
                  >
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                      {diffGroupLabel(row.group)}
                    </span>
                    <p className="mt-1 text-muted">
                      <span className="font-black text-content">
                        {t('leNeed', { defaultValue: 'الحاجة' })}:{' '}
                      </span>
                      {row.need || '—'}
                    </p>
                    <p className="mt-1 text-muted">
                      <span className="font-black text-content">
                        {t('leStrategy', { defaultValue: 'الاستراتيجية' })}:{' '}
                      </span>
                      {row.strategy || '—'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs font-semibold text-muted">—</p>
            )}
          </section>

          <section>
            <h4 className="text-xs font-black text-content">
              {t('leResourcesLabel', { defaultValue: 'الموارد' })} ({formatCount(resources.length, locale)})
            </h4>
            {resources.length ? (
              <ul className="mt-2 space-y-2">
                {resources.map((row, index) => (
                  <li
                    key={row.id || `resource-${index}`}
                    className="rounded-card bg-surface-muted p-2 text-xs font-semibold"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-content">{row.title || '—'}</span>
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                        {resourceTypeLabel(row.type)}
                      </span>
                    </div>
                    <p className="mt-1 break-words text-muted" dir="auto">
                      {row.reference || '—'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs font-semibold text-muted">—</p>
            )}
          </section>
        </div>

        <div className="mt-4 border-t-2 border-line pt-3">
          <h4 className="flex items-center gap-1.5 text-xs font-black text-content">
            <History className="h-3.5 w-3.5" aria-hidden="true" />
            {t('leHistory', { defaultValue: 'سجل التغييرات' })}
          </h4>
          {history.length ? (
            <ol className="mt-2 space-y-2">
              {history.map((entry, index) => (
                <li
                  key={`${entry.at}-${index}`}
                  className="rounded-card bg-surface-muted p-2 text-[11px] font-semibold"
                >
                  <span className="font-black text-content">{entry.action}</span>
                  <span className="text-muted">
                    {' '}
                    · {entry.by || '—'} · {formatDate(entry.at, locale)}
                  </span>
                  {entry.details ? <p className="mt-1 text-muted">{entry.details}</p> : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-xs font-semibold text-muted">
              {t('leNoHistory', { defaultValue: 'لا يوجد سجل تغييرات.' })}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function LessonEditor() {
  const { t, i18n } = useTranslation()
  const locale = resolveLocale(i18n.resolvedLanguage ?? i18n.language)

  const [plans, setPlans] = useState<Plan[]>([])
  const [statuses, setStatuses] = useState<string[]>([])
  const [items, setItems] = useState<CurriculumItem[]>([])
  const [levels, setLevels] = useState<IdName[]>([])
  const [subjects, setSubjects] = useState<IdName[]>([])
  const [currTerms, setCurrTerms] = useState<string[]>([])
  const [planTerms, setPlanTerms] = useState<string[]>([])

  const [levelFilter, setLevelFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [termFilter, setTermFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    setError(null)

    const params: Record<string, string> = {}
    if (levelFilter) params.levelId = levelFilter
    if (subjectFilter) params.subjectId = subjectFilter
    if (termFilter) params.term = termFilter
    if (statusFilter) params.status = statusFilter

    Promise.all([
      apiGet<PlansResponse>('/teacher/lesson-plans', {
        params,
        signal: controller.signal,
      }),
      apiGet<CurriculumResponse>('/teacher/curriculum', { signal: controller.signal }),
    ])
      .then(([planData, curriculumData]) => {
        if (cancelled) return
        setPlans(Array.isArray(planData.plans) ? planData.plans : [])
        setStatuses(
          Array.isArray(planData.meta?.statuses) ? planData.meta.statuses : [],
        )
        setPlanTerms(Array.isArray(planData.meta?.terms) ? planData.meta.terms : [])
        setItems(Array.isArray(curriculumData.items) ? curriculumData.items : [])
        setLevels(Array.isArray(curriculumData.levels) ? curriculumData.levels : [])
        setSubjects(Array.isArray(curriculumData.subjects) ? curriculumData.subjects : [])
        setCurrTerms(Array.isArray(curriculumData.terms) ? curriculumData.terms : [])
      })
      .catch((err: unknown) => {
        if (cancelled || controller.signal.aborted) return
        setError(
          failureMessage(
            err,
            t('leLoadError', { defaultValue: 'تعذّر تحميل خطط الدروس. حاول مجددًا.' }),
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
  }, [levelFilter, subjectFilter, termFilter, statusFilter, reloadKey, t])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const notify: Notify = (message, tone) => setToast({ message, tone })
  const onChanged = () => setReloadKey((key) => key + 1)

  const termOptions = Array.from(new Set([...currTerms, ...planTerms]))
  const stats = useMemo(
    () => ({
      draft: plans.filter((plan) => plan.status === 'draft').length,
      review: plans.filter((plan) => plan.status === 'in_review').length,
      published: plans.filter((plan) => plan.status === 'published').length,
    }),
    [plans],
  )

  function statusLabel(value: string): string {
    if (value === 'draft') return t('leDraft', { defaultValue: 'مسودة' })
    if (value === 'in_review') return t('leReview', { defaultValue: 'قيد المراجعة' })
    if (value === 'published') return t('lePublished', { defaultValue: 'منشورة' })
    return value
  }

  return (
    <div className="space-y-5 animate-slide print:space-y-3">
      <section className="card-school flex flex-wrap items-start justify-between gap-3 p-5 print:border-0 print:shadow-none">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('leTitle', { defaultValue: 'خطط الدروس' })}
          </h1>
          <p className="mt-2 flex max-w-3xl items-start gap-1.5 text-[11px] font-semibold leading-relaxed text-muted">
            <GraduationCap
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600"
              aria-hidden="true"
            />
            <span>{t('leHint', { defaultValue: 'أنشئ خطط دروس منظمة للأهداف والأنشطة والتمايز والموارد.' })}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onChanged}
          disabled={loading}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm print:hidden"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {t('leRefresh', { defaultValue: 'تحديث' })}
        </button>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-4 text-xs font-bold text-gold-800 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-300">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {t('leAdvisory', {
            defaultValue:
              'كل المحتوى من تأليف المعلم، ويُراجَع قبل النشر؛ لا تُتخذ أي قرارات آلية.',
          })}
        </span>
      </div>

      {toast ? (
        <p
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className={`rounded-card border-2 p-3 text-xs font-bold ${
            toast.tone === 'error'
              ? 'border-[#E03131]/40 bg-[#E03131]/10 text-[#b42318] dark:text-[#ff8787]'
              : 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-200'
          }`}
        >
          <CheckCircle2 className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
          {toast.message}
        </p>
      ) : null}

      <section className="card-school p-4 sm:p-5 print:hidden" aria-label={t('lePlans', { defaultValue: 'خطط الدروس' })}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('leLevel', { defaultValue: 'المستوى' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={levelFilter}
              onChange={(event) => setLevelFilter(event.target.value)}
            >
              <option value="">—</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('leSubject', { defaultValue: 'المادة' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              <option value="">—</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('leTerm', { defaultValue: 'الفصل الدراسي' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={termFilter}
              onChange={(event) => setTermFilter(event.target.value)}
            >
              <option value="">—</option>
              {termOptions.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-extrabold text-muted">
              {t('leStatus', { defaultValue: 'الحالة' })}
            </span>
            <select
              className="input-school py-2.5 text-sm font-bold"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">—</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
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
          <p className="flex items-start gap-2 text-sm font-bold text-[#b42318] dark:text-[#ff8787]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
          <button
            type="button"
            onClick={onChanged}
            className="btn-chunky btn-chunky--danger btn-chunky--sm print:hidden"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {t('leRefresh', { defaultValue: 'تحديث' })}
          </button>
        </div>
      ) : loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('leLoading', { defaultValue: 'جارٍ تحميل خطط الدروس…' })}
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3" aria-label={t('lePlans', { defaultValue: 'خطط الدروس' })}>
            <StatCard
              icon={FileText}
              label={t('leDraftCount', { defaultValue: 'مسودات' })}
              value={formatCount(stats.draft, locale)}
            />
            <StatCard
              icon={History}
              label={t('leReviewCount', { defaultValue: 'قيد المراجعة' })}
              value={formatCount(stats.review, locale)}
            />
            <StatCard
              icon={CheckCircle2}
              label={t('lePublishedCount', { defaultValue: 'منشورة' })}
              value={formatCount(stats.published, locale)}
            />
          </section>

          <NewPlanForm items={items} terms={termOptions} notify={notify} onCreated={onChanged} />

          <section className="space-y-3" aria-label={t('lePlans', { defaultValue: 'خطط الدروس' })}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-black">
                {t('lePlans', { defaultValue: 'خطط الدروس' })} (
                {formatCount(plans.length, locale)})
              </h2>
              <div className="flex flex-wrap items-center gap-2 print:hidden">
                <span className="text-[10px] font-bold text-muted">
                  {t('leExportHint', { defaultValue: 'التصدير متاح للإدارة فقط.' })}
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-chunky btn-chunky--secondary btn-chunky--sm"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  {t('lePrint', { defaultValue: 'طباعة' })}
                </button>
              </div>
            </div>

            {plans.length ? (
              <ul className="space-y-3">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    locale={locale}
                    notify={notify}
                    onChanged={onChanged}
                  />
                ))}
              </ul>
            ) : (
              <Notice>{t('leNoPlans', { defaultValue: 'لا توجد خطط دروس مطابقة.' })}</Notice>
            )}
          </section>
        </>
      )}
    </div>
  )
}
