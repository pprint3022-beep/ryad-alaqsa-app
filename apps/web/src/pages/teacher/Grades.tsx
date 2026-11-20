import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, ClipboardList, Loader2, RefreshCw, Trash2, XCircle } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'
import type { Student } from '../../types'

interface TeacherClass {
  id: string
  name?: string
  students: Student[]
}
interface ClassesResponse {
  classes: TeacherClass[]
}
interface Assessment {
  id: string
  studentId: string
  title?: string
  subjectId?: string
  date?: string
  score?: number
  notes?: string
  createdAt?: string
}
interface AssessmentsResponse {
  assessments: Assessment[]
}
interface GradeDraft {
  studentId: string
  subjectId: string
  score: string
  scale: string
  term: string
}
interface GradeEntry {
  studentId: string
  subjectId: string
  score: number
  scale: number
  term: string
}
interface BulkResult {
  studentId: string
  ok: boolean
  error?: string
  gradeId?: string
}
interface BulkResponse {
  results: BulkResult[]
  total: number
  success: number
}
interface AssessmentInput {
  studentId: string
  title: string
  subjectId: string
  date: string
  notes: string
}

const emptyGrade = (term: string): GradeDraft => ({ studentId: '', subjectId: '', score: '', scale: '20', term })

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

export default function Grades() {
  const { t } = useTranslation()
  const defaultTerm = t('enumTerm1', { defaultValue: 'الفصل 1' })
  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [assessment, setAssessment] = useState<AssessmentInput>({
    studentId: '',
    title: '',
    subjectId: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [assessmentFormError, setAssessmentFormError] = useState<string | null>(null)
  const [assessmentServerError, setAssessmentServerError] = useState<string | null>(null)
  const [savingAssessment, setSavingAssessment] = useState(false)
  const [assessmentCreated, setAssessmentCreated] = useState(false)

  const [draft, setDraft] = useState<GradeDraft>(() => emptyGrade(defaultTerm))
  const [entries, setEntries] = useState<GradeDraft[]>([])
  const [bulkFormError, setBulkFormError] = useState<string | null>(null)
  const [bulkServerError, setBulkServerError] = useState<string | null>(null)
  const [savingBulk, setSavingBulk] = useState(false)
  const [bulkResults, setBulkResults] = useState<BulkResult[] | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.all([
      apiGet<ClassesResponse>('/teacher/classes'),
      apiGet<AssessmentsResponse>('/teacher/assessments'),
    ])
      .then(([classData, assessmentData]) => {
        if (!active) return
        const list = classData.classes || []
        setClasses(list)
        const allStudents = list.flatMap((cls) => cls.students || [])
        setAssessments(assessmentData.assessments || [])
        setAssessment((current) =>
          current.studentId || !allStudents.length ? current : { ...current, studentId: allStudents[0].id },
        )
        setDraft((current) =>
          current.studentId || !allStudents.length ? current : { ...current, studentId: allStudents[0].id },
        )
      })
      .catch((err: unknown) => {
        if (active) {
          setError(messageOf(err, t('loadError', { defaultValue: 'تعذّر تحميل بيانات التقييمات.' })))
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

  const students = classes.flatMap((cls) => cls.students || [])
  const nameOf = (id: string) => students.find((student) => student.id === id)?.name || id

  const handleCreateAssessment = async () => {
    setAssessmentFormError(null)
    setAssessmentServerError(null)
    setAssessmentCreated(false)
    if (!assessment.studentId || !assessment.title.trim() || !assessment.subjectId.trim()) {
      setAssessmentFormError(t('assessmentRequired', { defaultValue: 'اختر تلميذًا وأدخل عنوانًا ومادة.' }))
      return
    }
    setSavingAssessment(true)
    try {
      await apiPost<{ assessment: Assessment }, AssessmentInput>('/teacher/assessments', assessment)
      setAssessmentCreated(true)
      setAssessment((current) => ({ ...current, title: '', notes: '' }))
      setReloadKey((key) => key + 1)
    } catch (err: unknown) {
      setAssessmentServerError(messageOf(err, t('saveError', { defaultValue: 'تعذّر حفظ التقييم.' })))
    } finally {
      setSavingAssessment(false)
    }
  }

  const handleAddEntry = () => {
    setBulkFormError(null)
    const score = Number(draft.score)
    const scale = Number(draft.scale)
    if (!draft.studentId || !draft.subjectId.trim() || !draft.term.trim()) {
      setBulkFormError(t('gradeRequired', { defaultValue: 'أكمل التلميذ والمادة والفصل.' }))
      return
    }
    if (!Number.isFinite(score) || !Number.isFinite(scale) || scale <= 0 || score < 0 || score > scale) {
      setBulkFormError(t('gradeInvalid', { defaultValue: 'الدرجة يجب أن تكون بين 0 والمقياس.' }))
      return
    }
    setEntries((current) => [...current, draft])
    setDraft((current) => ({ ...emptyGrade(defaultTerm), studentId: current.studentId }))
  }

  const handleSubmitGrades = async () => {
    setBulkFormError(null)
    setBulkServerError(null)
    setBulkResults(null)
    if (!entries.length) {
      setBulkFormError(t('noEntries', { defaultValue: 'أضف درجة واحدة على الأقل قبل الحفظ.' }))
      return
    }
    const payload: GradeEntry[] = entries.map((entry) => ({
      studentId: entry.studentId,
      subjectId: entry.subjectId.trim(),
      score: Number(entry.score),
      scale: Number(entry.scale),
      term: entry.term.trim(),
    }))
    setSavingBulk(true)
    try {
      const response = await apiPost<BulkResponse, { entries: GradeEntry[] }>('/teacher/grades/bulk', {
        entries: payload,
      })
      setBulkResults(response.results || [])
      if (response.success === response.total) setEntries([])
    } catch (err: unknown) {
      setBulkServerError(messageOf(err, t('saveError', { defaultValue: 'تعذّر حفظ الدرجات.' })))
    } finally {
      setSavingBulk(false)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('gradesTitle', { defaultValue: 'التقييمات والدرجات' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('gradesHint', { defaultValue: 'تقييمات ودرجات تلاميذ فصلك ضمن نطاقك.' })}
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
          <ClipboardList className="h-5 w-5" aria-hidden="true" />
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
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="card-school p-5">
            <h2 className="font-display text-lg font-black">
              {t('assessments', { defaultValue: 'التقييمات' })}
              <span className="ms-2 text-xs font-bold text-muted">({assessments.length})</span>
            </h2>
            {assessments.length ? (
              <ul className="mt-4 space-y-2">
                {assessments.map((item) => (
                  <li key={item.id} className="rounded-card border-2 border-line bg-surface p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-extrabold">{item.title || item.id}</span>
                      <span className="shrink-0 rounded-full bg-gold-100 px-2 py-1 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                        {item.date || '—'}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-muted">
                      {nameOf(item.studentId)} · {item.subjectId || '—'}
                      {typeof item.score === 'number' ? ` · ${item.score}` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <Notice>{t('noAssessments', { defaultValue: 'لا تقييمات مسجلة بعد.' })}</Notice>
              </div>
            )}

            <div className="mt-5 border-t-2 border-line pt-4">
              <h3 className="text-sm font-black">
                {t('newAssessment', { defaultValue: 'تقييم جديد' })}
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <select
                  aria-label={t('student', { defaultValue: 'تلميذ' })}
                  className="input-school"
                  value={assessment.studentId}
                  onChange={(event) =>
                    setAssessment((current) => ({ ...current, studentId: event.target.value }))
                  }
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={t('title', { defaultValue: 'العنوان' })}
                  className="input-school"
                  value={assessment.title}
                  onChange={(event) =>
                    setAssessment((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder={t('assessmentTitlePlaceholder', { defaultValue: 'عنوان التقييم' })}
                />
                <input
                  aria-label={t('subject', { defaultValue: 'المادة' })}
                  className="input-school"
                  value={assessment.subjectId}
                  onChange={(event) =>
                    setAssessment((current) => ({ ...current, subjectId: event.target.value }))
                  }
                  placeholder={t('subjectPlaceholder', { defaultValue: 'المادة' })}
                />
                <input
                  aria-label={t('date', { defaultValue: 'التاريخ' })}
                  type="date"
                  className="input-school"
                  value={assessment.date}
                  onChange={(event) =>
                    setAssessment((current) => ({ ...current, date: event.target.value }))
                  }
                />
              </div>
              {assessmentFormError ? (
                <div className="mt-3">
                  <Notice error>{assessmentFormError}</Notice>
                </div>
              ) : null}
              {assessmentServerError ? (
                <div className="mt-3">
                  <Notice error>{assessmentServerError}</Notice>
                </div>
              ) : null}
              {assessmentCreated ? (
                <p className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-700 dark:text-brand-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {t('saved', { defaultValue: 'تم الحفظ بنجاح.' })}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => void handleCreateAssessment()}
                disabled={savingAssessment}
                className="btn-chunky btn-chunky--primary btn-chunky--sm mt-4 w-full"
              >
                {savingAssessment ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                {t('saveAssessment', { defaultValue: 'حفظ التقييم' })}
              </button>
            </div>
          </section>

          <section className="card-school p-5">
            <h2 className="font-display text-lg font-black">
              {t('bulkGrading', { defaultValue: 'إدخال الدرجات دفعة واحدة' })}
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <select
                aria-label={t('student', { defaultValue: 'تلميذ' })}
                className="input-school"
                value={draft.studentId}
                onChange={(event) => setDraft((current) => ({ ...current, studentId: event.target.value }))}
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <input
                aria-label={t('subject', { defaultValue: 'المادة' })}
                className="input-school"
                value={draft.subjectId}
                onChange={(event) => setDraft((current) => ({ ...current, subjectId: event.target.value }))}
                placeholder={t('subjectPlaceholder', { defaultValue: 'المادة' })}
              />
              <input
                aria-label={t('score', { defaultValue: 'الدرجة' })}
                type="number"
                className="input-school"
                value={draft.score}
                onChange={(event) => setDraft((current) => ({ ...current, score: event.target.value }))}
                placeholder={t('score', { defaultValue: 'الدرجة' })}
              />
              <input
                aria-label={t('scale', { defaultValue: 'المقياس' })}
                type="number"
                className="input-school"
                value={draft.scale}
                onChange={(event) => setDraft((current) => ({ ...current, scale: event.target.value }))}
              />
              <input
                aria-label={t('term', { defaultValue: 'الفصل' })}
                className="input-school sm:col-span-2"
                value={draft.term}
                onChange={(event) => setDraft((current) => ({ ...current, term: event.target.value }))}
              />
            </div>
            <button
              type="button"
              onClick={handleAddEntry}
              className="btn-chunky btn-chunky--secondary btn-chunky--sm mt-3 w-full"
            >
              {t('addGrade', { defaultValue: 'إضافة درجة للقائمة' })}
            </button>

            {entries.length ? (
              <ul className="mt-4 space-y-2">
                {entries.map((entry, index) => (
                  <li
                    key={`${entry.studentId}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-card border-2 border-line bg-surface p-2 text-xs font-bold"
                  >
                    <span className="truncate">
                      {nameOf(entry.studentId)} · {entry.subjectId} · {entry.score}/{entry.scale}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEntries((current) => current.filter((_, i) => i !== index))}
                      aria-label={t('remove', { defaultValue: 'إزالة' })}
                      className="shrink-0 rounded-lg p-1 text-[#E03131] transition hover:bg-[#E03131]/10"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {bulkFormError ? (
              <div className="mt-3">
                <Notice error>{bulkFormError}</Notice>
              </div>
            ) : null}
            {bulkServerError ? (
              <div className="mt-3">
                <Notice error>{bulkServerError}</Notice>
              </div>
            ) : null}
            {bulkResults ? (
              <div className="mt-3 rounded-card border-2 border-line bg-surface-muted p-3">
                <p className="text-xs font-black">
                  {t('saveResults', { defaultValue: 'نتيجة الحفظ' })}:{' '}
                  {bulkResults.filter((item) => item.ok).length}/{bulkResults.length}
                </p>
                <ul className="mt-1 space-y-1">
                  {bulkResults.map((item) => (
                    <li key={item.studentId} className="flex items-center gap-1 text-[11px] font-bold">
                      {item.ok ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-[#E03131]" aria-hidden="true" />
                      )}
                      {nameOf(item.studentId)}
                      {!item.ok ? <span className="text-[#E03131]">— {item.error}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void handleSubmitGrades()}
              disabled={savingBulk}
              className="btn-chunky btn-chunky--gold btn-chunky--sm mt-4 w-full"
            >
              {savingBulk ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              {t('saveGrades', { defaultValue: 'حفظ الدرجات' })}
            </button>
          </section>
        </div>
      )}
    </div>
  )
}
