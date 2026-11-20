import { useEffect, useId, useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle, BookOpen, ChevronDown, ChevronUp, Clock, Copy, Download, Eye, EyeOff,
  FileJson, GraduationCap, Layers3, Lightbulb, ListChecks, Plus, Send, ShieldCheck,
  Sparkles, Trash2, type LucideIcon,
} from 'lucide-react'

/* ---------------------------------- Types --------------------------------- */
type ContentLanguage = 'ar' | 'fr' | 'en' | 'amz'
type MediaType = 'text' | 'image'
type NoticeTone = 'info' | 'error' | 'success'

interface LessonSection {
  id: string; heading: string; body: string; emoji: string; mediaType: MediaType; diagram: string
}
interface WorkedExample { id: string; prompt: string; steps: string[]; answer: string }
interface LearningOutcome { id: string; code: string; ar: string; fr: string; en: string }
interface QuizQuestion {
  id: string; prompt: string; options: string[]; correctIndex: number; explanation: string
}
interface LessonDraft {
  title: string; level: string; subject: string; duration: number; language: ContentLanguage
  intro: string; sections: LessonSection[]; examples: WorkedExample[]
  outcomes: LearningOutcome[]; questions: QuizQuestion[]; submittedAt: string | null
}

const STORAGE_KEY = 'ryad-lesson-studio-draft'
const LANGUAGES: readonly ContentLanguage[] = ['ar', 'fr', 'en', 'amz']

const DIAGRAMS = [
  { path: '/illustrations/diagrams/diagram-fractions.svg', key: 'studioDiagramFractions', ar: 'الكسور' },
  { path: '/illustrations/diagrams/diagram-french-alphabet.svg', key: 'studioDiagramFrenchAlphabet', ar: 'الأبجدية الفرنسية' },
  { path: '/illustrations/diagrams/diagram-colors.svg', key: 'studioDiagramColors', ar: 'الألوان' },
  { path: '/illustrations/diagrams/diagram-place-value.svg', key: 'studioDiagramPlaceValue', ar: 'القيمة المكانية للأعداد' },
  { path: '/illustrations/diagrams/diagram-family.svg', key: 'studioDiagramFamily', ar: 'العائلة' },
  { path: '/illustrations/diagrams/diagram-animals.svg', key: 'studioDiagramAnimals', ar: 'الحيوانات' },
  { path: '/illustrations/diagrams/diagram-states-of-matter.svg', key: 'studioDiagramStatesOfMatter', ar: 'حالات المادة' },
  { path: '/illustrations/diagrams/diagram-five-senses.svg', key: 'studioDiagramFiveSenses', ar: 'الحواس الخمس' },
  { path: '/illustrations/diagrams/diagram-seasons.svg', key: 'studioDiagramSeasons', ar: 'الفصول' },
  { path: '/illustrations/diagrams/diagram-body.svg', key: 'studioDiagramBody', ar: 'جسم الإنسان' },
  { path: '/illustrations/diagrams/diagram-multiplication.svg', key: 'studioDiagramMultiplication', ar: 'الضرب' },
  { path: '/illustrations/diagrams/diagram-shapes.svg', key: 'studioDiagramShapes', ar: 'الأشكال الهندسية' },
  { path: '/illustrations/diagrams/diagram-prayer.svg', key: 'studioDiagramPrayer', ar: 'الصلاة' },
  { path: '/illustrations/diagrams/diagram-morocco-map.svg', key: 'studioDiagramMoroccoMap', ar: 'خريطة المغرب' },
] as const

const LEVELS = [
  { value: 'تمهيدي', key: 'studioLevelPreschool', ar: 'تمهيدي' },
  { value: 'الأول', key: 'studioLevelOne', ar: 'الأول' },
  { value: 'الثاني', key: 'studioLevelTwo', ar: 'الثاني' },
  { value: 'الثالث', key: 'studioLevelThree', ar: 'الثالث' },
  { value: 'الرابع', key: 'studioLevelFour', ar: 'الرابع' },
  { value: 'الخامس', key: 'studioLevelFive', ar: 'الخامس' },
  { value: 'السادس', key: 'studioLevelSix', ar: 'السادس' },
] as const

const SUBJECTS = [
  { value: 'الرياضيات', key: 'studioSubjectMath', ar: 'الرياضيات' },
  { value: 'اللغة العربية', key: 'studioSubjectArabic', ar: 'اللغة العربية' },
  { value: 'اللغة الفرنسية', key: 'studioSubjectFrench', ar: 'اللغة الفرنسية' },
  { value: 'اللغة الإنجليزية', key: 'studioSubjectEnglish', ar: 'اللغة الإنجليزية' },
  { value: 'العلوم', key: 'studioSubjectScience', ar: 'العلوم' },
  { value: 'التربية الإسلامية', key: 'studioSubjectIslamic', ar: 'التربية الإسلامية' },
  { value: 'الجغرافيا', key: 'studioSubjectGeography', ar: 'الجغرافيا' },
  { value: 'التربية الفنية', key: 'studioSubjectArt', ar: 'التربية الفنية' },
] as const

const LANGUAGE_LABELS = [
  { value: 'ar' as const, key: 'studioLangAr', ar: 'العربية' },
  { value: 'fr' as const, key: 'studioLangFr', ar: 'الفرنسية' },
  { value: 'en' as const, key: 'studioLangEn', ar: 'الإنجليزية' },
  { value: 'amz' as const, key: 'studioLangAmz', ar: 'الأمازيغية' },
] as const

interface OutcomePreset {
  id: string; labelKey: string; labelDefault: string; codeKey: string; codeDefault: string
  arKey: string; arDefault: string; frKey: string; frDefault: string; enKey: string; enDefault: string
}

const OUTCOME_PRESETS: readonly OutcomePreset[] = [
  { id: 'num-100', labelKey: 'studioPresetNumbers', labelDefault: 'الأعداد حتى 100', codeKey: 'studioPresetNumbersCode', codeDefault: 'NUM-1.1',
    arKey: 'studioPresetNumbersAr', arDefault: 'يعدّ الأعداد حتى 100 ويقرأها ويكتبها كتابة صحيحة.', frKey: 'studioPresetNumbersFr', frDefault: 'Compte jusqu’à 100, lit et écrit les nombres correctement.', enKey: 'studioPresetNumbersEn', enDefault: 'Counts to 100 and reads and writes numbers correctly.' },
  { id: 'add-sub', labelKey: 'studioPresetOperations', labelDefault: 'الجمع والطرح داخل 100', codeKey: 'studioPresetOperationsCode', codeDefault: 'NUM-2.1',
    arKey: 'studioPresetOperationsAr', arDefault: 'يحلّ مسائل الجمع والطرح داخل العدد 100 ويعلل إجابته.', frKey: 'studioPresetOperationsFr', frDefault: 'Résout des additions et des soustractions jusqu’à 100 et justifie sa réponse.', enKey: 'studioPresetOperationsEn', enDefault: 'Solves addition and subtraction problems within 100 and explains the answer.' },
  { id: 'ar-reading', labelKey: 'studioPresetReading', labelDefault: 'القراءة العربية والفهم', codeKey: 'studioPresetReadingCode', codeDefault: 'ARA-1.2',
    arKey: 'studioPresetReadingAr', arDefault: 'يقرأ نصًا قصيرًا بطلاقة ويجيب عن أسئلة فهمه.', frKey: 'studioPresetReadingFr', frDefault: 'Lit un court texte avec aisance et répond aux questions de compréhension.', enKey: 'studioPresetReadingEn', enDefault: 'Reads a short text fluently and answers comprehension questions.' },
  { id: 'fr-alphabet', labelKey: 'studioPresetFrench', labelDefault: 'الأبجدية الفرنسية', codeKey: 'studioPresetFrenchCode', codeDefault: 'FRA-1.1',
    arKey: 'studioPresetFrenchAr', arDefault: 'يتعرّف على حروف الأبجدية الفرنسية وينطقها نطقًا صحيحًا.', frKey: 'studioPresetFrenchFr', frDefault: 'Reconnaît les lettres de l’alphabet français et les prononce correctement.', enKey: 'studioPresetFrenchEn', enDefault: 'Recognizes the letters of the French alphabet and pronounces them correctly.' },
  { id: 'shapes', labelKey: 'studioPresetShapes', labelDefault: 'الأشكال الهندسية', codeKey: 'studioPresetShapesCode', codeDefault: 'GEO-1.1',
    arKey: 'studioPresetShapesAr', arDefault: 'يسمّي الأشكال الهندسية الأساسية ويصف خصائصها.', frKey: 'studioPresetShapesFr', frDefault: 'Nomme les figures géométriques de base et décrit leurs propriétés.', enKey: 'studioPresetShapesEn', enDefault: 'Names basic geometric shapes and describes their properties.' },
  { id: 'islam', labelKey: 'studioPresetPillars', labelDefault: 'أركان الإسلام', codeKey: 'studioPresetPillarsCode', codeDefault: 'ISR-1.1',
    arKey: 'studioPresetPillarsAr', arDefault: 'يذكر أركان الإسلام الخمسة ويشرح معناها بإيجاز.', frKey: 'studioPresetPillarsFr', frDefault: 'Énonce les cinq piliers de l’islam et en explique brièvement le sens.', enKey: 'studioPresetPillarsEn', enDefault: 'States the five pillars of Islam and briefly explains their meaning.' },
]

/* -------------------------------- Utilities ------------------------------- */
function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}
function isLanguage(value: unknown): value is ContentLanguage {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value)
}
function scriptDir(text: string): 'rtl' | 'ltr' {
  return /[\u0600-\u06FF\u0750-\u077F\u2D30-\u2D7F]/.test(text) ? 'rtl' : 'ltr'
}
function formatTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ar-MA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
}
function moveItem<T>(items: T[], index: number, delta: number): T[] {
  const target = index + delta
  if (target < 0 || target >= items.length) return items
  const next = [...items]
  const [moved] = next.splice(index, 1)
  next.splice(target, 0, moved)
  return next
}
function createEmptyDraft(): LessonDraft {
  return {
    title: '', level: '', subject: '', duration: 30, language: 'ar', intro: '',
    sections: [], examples: [], outcomes: [], questions: [], submittedAt: null,
  }
}
function normalizeDraft(raw: unknown): { draft: LessonDraft; lastSavedAt: string | null } {
  if (!isRecord(raw)) throw new Error('invalid draft')
  const parseList = (value: unknown, name: string): Record<string, unknown>[] => {
    if (!Array.isArray(value)) throw new Error(`invalid ${name}`)
    return value.map((item) => {
      if (!isRecord(item)) throw new Error(`invalid ${name} item`)
      return item
    })
  }
  const sections: LessonSection[] = parseList(raw.sections, 'sections').map((item) => {
    const diagram = str(item.diagram)
    return {
      id: str(item.id) || makeId(), heading: str(item.heading), body: str(item.body), emoji: str(item.emoji),
      mediaType: item.mediaType === 'image' ? 'image' : 'text',
      diagram: DIAGRAMS.some((entry) => entry.path === diagram) ? diagram : '',
    }
  })
  const examples: WorkedExample[] = parseList(raw.examples, 'examples').map((item) => {
    const steps = Array.isArray(item.steps) ? item.steps.filter((step): step is string => typeof step === 'string') : []
    while (steps.length < 2) steps.push('')
    return { id: str(item.id) || makeId(), prompt: str(item.prompt), steps, answer: str(item.answer) }
  })
  const outcomes: LearningOutcome[] = parseList(raw.outcomes, 'outcomes').map((item) => ({
    id: str(item.id) || makeId(), code: str(item.code), ar: str(item.ar), fr: str(item.fr), en: str(item.en),
  }))
  const questions: QuizQuestion[] = parseList(raw.questions, 'questions').map((item) => {
    const optionsRaw = Array.isArray(item.options) ? item.options : []
    const correct = typeof item.correctIndex === 'number' && Number.isInteger(item.correctIndex) ? item.correctIndex : 0
    return {
      id: str(item.id) || makeId(), prompt: str(item.prompt),
      options: [0, 1, 2, 3].map((index) => str(optionsRaw[index])),
      correctIndex: Math.min(3, Math.max(0, correct)), explanation: str(item.explanation),
    }
  })
  const duration = typeof raw.duration === 'number' && Number.isFinite(raw.duration) ? Math.max(0, Math.round(raw.duration)) : 30
  return {
    draft: {
      title: str(raw.title), level: str(raw.level), subject: str(raw.subject), duration,
      language: isLanguage(raw.language) ? raw.language : 'ar', intro: str(raw.intro),
      sections, examples, outcomes, questions,
      submittedAt: typeof raw.submittedAt === 'string' ? raw.submittedAt : null,
    },
    lastSavedAt: typeof raw.lastSavedAt === 'string' ? raw.lastSavedAt : null,
  }
}
function loadInitial(): { draft: LessonDraft; lastSavedAt: string | null } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { draft: createEmptyDraft(), lastSavedAt: null }
    return normalizeDraft(JSON.parse(raw) as unknown)
  } catch {
    return { draft: createEmptyDraft(), lastSavedAt: null }
  }
}

/* ------------------------------ Shared pieces ----------------------------- */
function Notice({ tone = 'info', children }: { tone?: NoticeTone; children: ReactNode }) {
  const style = tone === 'error'
    ? 'border-[#E03131]/40 bg-[#E03131]/10 text-[#b42318] dark:text-[#ff8787]'
    : tone === 'success'
      ? 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-400/30 dark:bg-brand-400/10 dark:text-brand-200'
      : 'border-dashed border-line bg-surface-muted text-muted'
  return <div role={tone === 'error' ? 'alert' : 'status'} className={`rounded-card border-2 p-3 text-xs font-bold ${style}`}>{children}</div>
}
function Field({ id, label, children, className = '' }: { id: string; label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-[11px] font-extrabold text-muted">{label}</label>
      {children}
    </div>
  )
}
function EditorCard({ icon: Icon, title, count, actions, children }: {
  icon: LucideIcon; title: string; count?: number; actions?: ReactNode; children: ReactNode
}) {
  return (
    <section className="card-school p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-line pb-3">
        <h2 className="flex items-center gap-2 text-sm font-black sm:text-base">
          <span className="flex h-8 w-8 items-center justify-center rounded-card bg-brand-soft text-brand-700 dark:text-brand-300">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          {title}
          {typeof count === 'number' ? <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-black text-muted">{count}</span> : null}
        </h2>
        {actions}
      </div>
      {children}
    </section>
  )
}
function SmallButton({ label, onClick, disabled, tone = 'secondary', children }: {
  label: string; onClick: () => void; disabled?: boolean
  tone?: 'secondary' | 'danger' | 'primary' | 'gold'; children: ReactNode
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
      className={`btn-chunky btn-chunky--sm btn-chunky--${tone} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2`}>
      {children}
    </button>
  )
}

/* ------------------------------- Live preview ----------------------------- */
function PreviewPanel({ draft }: { draft: LessonDraft }) {
  const { t } = useTranslation()
  const dir: 'rtl' | 'ltr' = draft.language === 'fr' || draft.language === 'en' ? 'ltr' : 'rtl'
  const hasBody = draft.sections.length + draft.examples.length + draft.outcomes.length + draft.questions.length > 0
  return (
    <section className="card-school p-4 sm:p-5" aria-label={t('studioPreviewTitle', { defaultValue: 'معاينة الدرس' })}>
      <h2 className="font-display text-base font-black">{t('studioPreviewTitle', { defaultValue: 'معاينة الدرس' })}</h2>
      <div dir={dir} className="mt-4 rounded-card-lg border-2 border-line bg-canvas p-4 sm:p-6">
        <header className="border-b-2 border-line pb-4">
          <h3 className="font-display text-2xl font-black">
            {draft.title || t('studioUntitledLesson', { defaultValue: 'درس بلا عنوان' })}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-black text-muted">
            {draft.level ? <span className="rounded-full bg-brand-soft px-2 py-1 text-brand-700 dark:text-brand-300">{draft.level}</span> : null}
            {draft.subject ? <span className="rounded-full bg-surface-muted px-2 py-1">{draft.subject}</span> : null}
            <span className="rounded-full bg-surface-muted px-2 py-1">{draft.duration} {t('studioMinutes', { defaultValue: 'دقيقة' })}</span>
          </div>
          {draft.intro ? (
            <>
              <h4 className="mt-4 text-xs font-black text-muted">{t('studioPreviewIntro', { defaultValue: 'المقدمة' })}</h4>
              <p className="mt-1 whitespace-pre-line text-sm font-semibold leading-relaxed">{draft.intro}</p>
            </>
          ) : null}
        </header>
        {!hasBody ? <div className="mt-4"><Notice>{t('studioPreviewEmpty', { defaultValue: 'أضف محتوى لرؤية المعاينة.' })}</Notice></div> : null}

        {draft.sections.length ? (
          <div className="mt-5 space-y-4">
            <h4 className="text-xs font-black text-muted">{t('studioPreviewSections', { defaultValue: 'مقاطع الدرس' })}</h4>
            {draft.sections.map((section, index) => (
              <article key={section.id} className="rounded-card border-2 border-line bg-surface p-4">
                <h5 className="flex items-center gap-2 text-sm font-black">
                  <span aria-hidden="true">{section.emoji || '📘'}</span>
                  <span>{section.heading || t('studioSectionNumber', { defaultValue: 'القسم رقم {{n}}', n: index + 1 })}</span>
                </h5>
                {section.mediaType === 'image' && section.diagram ? (
                  <img src={section.diagram} alt={t('studioDiagramAlt', { defaultValue: 'معاينة الرسم التوضيحي' })}
                    className="mt-3 aspect-video w-full rounded-card border-2 border-line bg-surface-muted object-contain" />
                ) : null}
                {section.body ? <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-relaxed text-muted">{section.body}</p> : null}
              </article>
            ))}
          </div>
        ) : null}

        {draft.examples.length ? (
          <div className="mt-5 space-y-4">
            <h4 className="text-xs font-black text-muted">{t('studioPreviewExamples', { defaultValue: 'أمثلة الشرح' })}</h4>
            {draft.examples.map((example, index) => (
              <article key={example.id} className="rounded-card border-2 border-line bg-surface p-4">
                <h5 className="text-sm font-black">{t('studioExampleNumber', { defaultValue: 'المثال رقم {{n}}', n: index + 1 })}: {example.prompt}</h5>
                <p className="mt-2 text-[11px] font-black text-muted">{t('studioPreviewSteps', { defaultValue: 'خطوات الحل' })}</p>
                <ol className="mt-2 list-decimal space-y-1.5 ps-6">
                  {example.steps.map((step, stepIndex) => <li key={stepIndex} className="text-xs font-semibold leading-relaxed">{step}</li>)}
                </ol>
                {example.answer ? (
                  <p className="mt-3 rounded-card bg-brand-soft p-2 text-xs font-black text-brand-800 dark:text-brand-200">
                    {t('studioPreviewAnswer', { defaultValue: 'الإجابة' })}: {example.answer}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}

        {draft.outcomes.length ? (
          <div className="mt-5">
            <h4 className="text-xs font-black text-muted">{t('studioPreviewOutcomes', { defaultValue: 'مخرجات التعلّم' })}</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {draft.outcomes.map((outcome) => (
                <li key={outcome.id} className="rounded-card border-2 border-line bg-surface p-2 text-[11px] font-bold">
                  {outcome.code ? <span className="me-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">{outcome.code}</span> : null}
                  <span className="flex flex-wrap gap-x-2 pt-1">
                    {outcome.ar ? <span dir={scriptDir(outcome.ar)}>{outcome.ar}</span> : null}
                    {outcome.fr ? <span dir={scriptDir(outcome.fr)} className="text-muted">{outcome.fr}</span> : null}
                    {outcome.en ? <span dir={scriptDir(outcome.en)} className="text-muted">{outcome.en}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {draft.questions.length ? (
          <div className="mt-5 space-y-4">
            <h4 className="text-xs font-black text-muted">{t('studioPreviewQuiz', { defaultValue: 'أسئلة التقويم' })}</h4>
            {draft.questions.map((question, index) => (
              <article key={question.id} className="rounded-card border-2 border-line bg-surface p-4">
                <p className="text-sm font-black">{index + 1}. {question.prompt || t('studioUntitledQuestion', { defaultValue: 'سؤال بلا نص' })}</p>
                <ul className="mt-2 space-y-1.5">
                  {question.options.map((option, optionIndex) => (
                    <li key={optionIndex} dir={scriptDir(option)}
                      className={`rounded-card border-2 px-3 py-2 text-xs font-bold ${optionIndex === question.correctIndex
                        ? 'border-brand-500 bg-brand-soft text-brand-800 dark:text-brand-200'
                        : 'border-line bg-surface-muted text-muted'}`}>
                      {String.fromCharCode(65 + optionIndex)}. {option}
                      {optionIndex === question.correctIndex ? (
                        <span className="ms-2 text-[10px] font-black">✓ {t('studioPreviewCorrect', { defaultValue: 'الإجابة الصحيحة' })}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {question.explanation ? (
                  <p className="mt-3 text-[11px] font-semibold leading-relaxed text-muted">
                    {t('studioPreviewExplanation', { defaultValue: 'الشرح' })}: {question.explanation}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* ---------------------------------- Page ---------------------------------- */
export default function LessonStudio() {
  const { t } = useTranslation()
  const uid = useId().replace(/:/g, '')
  const initial = useMemo(loadInitial, [])
  const [draft, setDraft] = useState<LessonDraft>(initial.draft)
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(initial.lastSavedAt)
  const [showPreview, setShowPreview] = useState(false)
  const [presetId, setPresetId] = useState('')
  const [notice, setNotice] = useState<{ tone: NoticeTone; text: string } | null>(null)
  const emptySections = useMemo(
    () => draft.sections.filter((section) => !section.heading.trim() && !section.body.trim()).length,
    [draft.sections],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedAt = new Date().toISOString()
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...draft, lastSavedAt: savedAt }))
        setLastSavedAt(savedAt)
      } catch { /* Storage may be unavailable; editing still works in memory. */ }
    }, 700)
    return () => window.clearTimeout(timer)
  }, [draft])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 6000)
    return () => window.clearTimeout(timer)
  }, [notice])

  function notify(tone: NoticeTone, text: string) { setNotice({ tone, text }) }
  function patchDraft(patch: Partial<LessonDraft>) { setDraft((previous) => ({ ...previous, ...patch })) }
  function addSection() {
    setDraft((previous) => ({ ...previous, sections: [...previous.sections, {
      id: makeId(), heading: '', body: '', emoji: '📘', mediaType: 'text', diagram: '',
    }] }))
  }
  function patchSection(id: string, patch: Partial<LessonSection>) {
    setDraft((previous) => ({ ...previous, sections: previous.sections.map((section) => section.id === id ? { ...section, ...patch } : section) }))
  }
  function addExample() {
    setDraft((previous) => ({ ...previous, examples: [...previous.examples, {
      id: makeId(), prompt: '', steps: ['', ''], answer: '',
    }] }))
  }
  function patchExample(id: string, patch: Partial<WorkedExample>) {
    setDraft((previous) => ({ ...previous, examples: previous.examples.map((example) => example.id === id ? { ...example, ...patch } : example) }))
  }
  function patchStep(id: string, index: number, value: string) {
    setDraft((previous) => ({ ...previous, examples: previous.examples.map((example) => example.id === id
      ? { ...example, steps: example.steps.map((step, i) => i === index ? value : step) } : example) }))
  }
  function patchOutcome(id: string, patch: Partial<LearningOutcome>) {
    setDraft((previous) => ({ ...previous, outcomes: previous.outcomes.map((outcome) => outcome.id === id ? { ...outcome, ...patch } : outcome) }))
  }
  function addOutcome() {
    setDraft((previous) => ({ ...previous, outcomes: [...previous.outcomes, { id: makeId(), code: '', ar: '', fr: '', en: '' }] }))
  }
  function applyPreset() {
    const preset = OUTCOME_PRESETS.find((item) => item.id === presetId)
    if (!preset) return
    setDraft((previous) => ({ ...previous, outcomes: [...previous.outcomes, {
      id: makeId(), code: t(preset.codeKey, { defaultValue: preset.codeDefault }),
      ar: t(preset.arKey, { defaultValue: preset.arDefault }),
      fr: t(preset.frKey, { defaultValue: preset.frDefault }),
      en: t(preset.enKey, { defaultValue: preset.enDefault }),
    }] }))
    setPresetId('')
  }
  function addQuestion() {
    setDraft((previous) => ({ ...previous, questions: [...previous.questions, {
      id: makeId(), prompt: '', options: ['', '', '', ''], correctIndex: 0, explanation: '',
    }] }))
  }
  function patchQuestion(id: string, patch: Partial<QuizQuestion>) {
    setDraft((previous) => ({ ...previous, questions: previous.questions.map((question) => question.id === id ? { ...question, ...patch } : question) }))
  }
  function patchOption(id: string, index: number, value: string) {
    setDraft((previous) => ({ ...previous, questions: previous.questions.map((question) => question.id === id
      ? { ...question, options: question.options.map((option, i) => i === index ? value : option) } : question) }))
  }
  function removeFrom(key: 'sections' | 'examples' | 'outcomes' | 'questions', id: string) {
    setDraft((previous) => {
      if (key === 'sections') return { ...previous, sections: previous.sections.filter((item) => item.id !== id) }
      if (key === 'examples') return { ...previous, examples: previous.examples.filter((item) => item.id !== id) }
      if (key === 'outcomes') return { ...previous, outcomes: previous.outcomes.filter((item) => item.id !== id) }
      return { ...previous, questions: previous.questions.filter((item) => item.id !== id) }
    })
  }
  function getPayload() {
    return { ...draft, lastSavedAt, exportedAt: new Date().toISOString() }
  }
  function handleExport() {
    try {
      const blob = new Blob([JSON.stringify(getPayload(), null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'ryad-lesson-studio-draft.json'
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      notify('success', t('studioExportSuccess', { defaultValue: 'تم تنزيل ملف المسودة.' }))
    } catch {
      notify('error', t('studioExportFailed', { defaultValue: 'تعذّر تصدير المسودة.' }))
    }
  }
  function fallbackCopy(text: string) {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const copied = document.execCommand('copy')
    area.remove()
    if (!copied) throw new Error('copy failed')
  }
  async function handleCopy() {
    const text = JSON.stringify(getPayload(), null, 2)
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
      else fallbackCopy(text)
      notify('success', t('studioCopySuccess', { defaultValue: 'تم نسخ JSON إلى الحافظة.' }))
    } catch {
      try {
        fallbackCopy(text)
        notify('success', t('studioCopySuccess', { defaultValue: 'تم نسخ JSON إلى الحافظة.' }))
      } catch {
        notify('error', t('studioCopyFailed', { defaultValue: 'تعذّر نسخ JSON. استخدم زر التصدير بدلًا من ذلك.' }))
      }
    }
  }
  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const parsed: unknown = JSON.parse(await file.text())
      const imported = normalizeDraft(parsed)
      setDraft(imported.draft)
      setLastSavedAt(imported.lastSavedAt)
      notify('success', t('studioImportSuccess', { defaultValue: 'تم استيراد المسودة بنجاح.' }))
    } catch {
      notify('error', t('studioImportInvalid', { defaultValue: 'تعذّر استيراد الملف: JSON غير صالح أو بنية غير متطابقة.' }))
    }
  }
  function handleSubmit() {
    const submittedAt = new Date().toISOString()
    const next = { ...draft, submittedAt }
    setDraft(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, lastSavedAt: submittedAt }))
      setLastSavedAt(submittedAt)
    } catch { /* Autosave effect still keeps the marker in memory. */ }
    notify('success', t('studioSubmitted', { defaultValue: 'تم تسجيل طلب المراجعة. يجب أن يراجع فريق بشري الدرس قبل نشره.' }))
  }

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-black sm:text-2xl">{t('studioTitle', { defaultValue: 'استوديو تأليف الدروس' })}</h1>
          <p className="mt-2 flex max-w-3xl items-start gap-1.5 text-[11px] font-semibold leading-relaxed text-muted">
            <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
            <span>{t('studioSubtitle', { defaultValue: 'صمّم درسًا تفاعليًا بمقاطع وأمثلة وأسئلة تقويم، ثم أرسله للمراجعة البشرية قبل النشر.' })}</span>
          </p>
        </div>
        <button type="button" onClick={() => setShowPreview((value) => !value)} aria-pressed={showPreview}
          className="btn-chunky btn-chunky--gold btn-chunky--sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
          {showPreview ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
          {showPreview ? t('studioHidePreview', { defaultValue: 'إخفاء المعاينة' }) : t('studioPreview', { defaultValue: 'معاينة حيّة' })}
        </button>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-4 text-xs font-bold text-gold-800 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-300">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{t('studioAdvisory', { defaultValue: 'كل المحتوى من تأليف المعلم ويُراجَع من قبل فريق بشري قبل النشر؛ لا تُتخذ أي قرارات آلية.' })}</span>
      </div>
      {notice ? <Notice tone={notice.tone}>{notice.text}</Notice> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <EditorCard icon={BookOpen} title={t('studioLessonHeader', { defaultValue: 'معلومات الدرس' })}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field id={`${uid}-title`} label={t('studioTitleLabel', { defaultValue: 'عنوان الدرس' })} className="sm:col-span-2 lg:col-span-3">
                <input id={`${uid}-title`} className="input-school py-2.5 text-sm font-bold" value={draft.title}
                  onChange={(event) => patchDraft({ title: event.target.value })}
                  placeholder={t('studioTitleLabel', { defaultValue: 'عنوان الدرس' })} />
              </Field>
              <Field id={`${uid}-level`} label={t('studioLevel', { defaultValue: 'المستوى' })}>
                <select id={`${uid}-level`} className="input-school py-2.5 text-sm font-bold" value={draft.level}
                  onChange={(event) => patchDraft({ level: event.target.value })}>
                  <option value="">{t('studioChoose', { defaultValue: 'اختر…' })}</option>
                  {LEVELS.map((level) => <option key={level.value} value={level.value}>{t(level.key, { defaultValue: level.ar })}</option>)}
                </select>
              </Field>
              <Field id={`${uid}-subject`} label={t('studioSubject', { defaultValue: 'المادة' })}>
                <select id={`${uid}-subject`} className="input-school py-2.5 text-sm font-bold" value={draft.subject}
                  onChange={(event) => patchDraft({ subject: event.target.value })}>
                  <option value="">{t('studioChoose', { defaultValue: 'اختر…' })}</option>
                  {SUBJECTS.map((subject) => <option key={subject.value} value={subject.value}>{t(subject.key, { defaultValue: subject.ar })}</option>)}
                </select>
              </Field>
              <Field id={`${uid}-duration`} label={t('studioDuration', { defaultValue: 'المدة (بالدقائق)' })}>
                <input id={`${uid}-duration`} type="number" min={0} className="input-school py-2.5 text-sm font-bold"
                  value={draft.duration} onChange={(event) => patchDraft({ duration: Number(event.target.value) || 0 })} />
              </Field>
              <Field id={`${uid}-language`} label={t('studioLanguage', { defaultValue: 'لغة محتوى الدرس' })} className="sm:col-span-2">
                <select id={`${uid}-language`} className="input-school py-2.5 text-sm font-bold" value={draft.language}
                  onChange={(event) => patchDraft({ language: event.target.value as ContentLanguage })}>
                  {LANGUAGE_LABELS.map((language) => <option key={language.value} value={language.value}>{t(language.key, { defaultValue: language.ar })}</option>)}
                </select>
              </Field>
              <Field id={`${uid}-intro`} label={t('studioIntro', { defaultValue: 'مقدمة قصيرة' })} className="sm:col-span-2 lg:col-span-3">
                <textarea id={`${uid}-intro`} rows={3} className="input-school text-sm font-semibold" value={draft.intro}
                  onChange={(event) => patchDraft({ intro: event.target.value })} />
              </Field>
            </div>
          </EditorCard>

          <EditorCard icon={Layers3} title={t('studioSections', { defaultValue: 'أقسام الدرس' })} count={draft.sections.length}
            actions={
              <SmallButton label={t('studioAddSection', { defaultValue: 'إضافة قسم' })} onClick={addSection}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />{t('studioAddSection', { defaultValue: 'إضافة قسم' })}
              </SmallButton>
            }>
            {draft.sections.length === 0 ? (
              <Notice>{t('studioNoSections', { defaultValue: 'لا توجد أقسام بعد. أضف قسمًا للبدء.' })}</Notice>
            ) : (
              <div className="space-y-3">
                {draft.sections.map((section, index) => {
                  const key = `${uid}-section-${section.id}`
                  return (
                    <div key={section.id} className="rounded-card border-2 border-line bg-surface-muted p-3">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-black">{t('studioSectionNumber', { defaultValue: 'القسم رقم {{n}}', n: index + 1 })}</span>
                        <div className="flex flex-wrap gap-1">
                          <SmallButton label={t('studioMoveUp', { defaultValue: 'نقل القسم إلى الأعلى' })}
                            onClick={() => patchDraft({ sections: moveItem(draft.sections, index, -1) })} disabled={index === 0}>
                            <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                          </SmallButton>
                          <SmallButton label={t('studioMoveDown', { defaultValue: 'نقل القسم إلى الأسفل' })}
                            onClick={() => patchDraft({ sections: moveItem(draft.sections, index, 1) })} disabled={index === draft.sections.length - 1}>
                            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                          </SmallButton>
                          <SmallButton tone="danger" label={t('studioRemoveSection', { defaultValue: 'إزالة القسم' })}
                            onClick={() => removeFrom('sections', section.id)}>
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </SmallButton>
                        </div>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[6rem_minmax(0,1fr)]">
                        <Field id={`${key}-emoji`} label={t('studioSectionEmoji', { defaultValue: 'رمز القسم' })}>
                          <input id={`${key}-emoji`} className="input-school py-2 text-center text-xl" maxLength={4}
                            value={section.emoji} onChange={(event) => patchSection(section.id, { emoji: event.target.value })} />
                        </Field>
                        <Field id={`${key}-heading`} label={t('studioSectionHeading', { defaultValue: 'عنوان القسم' })}>
                          <input id={`${key}-heading`} className="input-school py-2 text-sm font-bold" value={section.heading}
                            onChange={(event) => patchSection(section.id, { heading: event.target.value })} />
                        </Field>
                      </div>
                      <Field id={`${key}-body`} label={t('studioSectionBody', { defaultValue: 'نص القسم' })} className="mt-2">
                        <textarea id={`${key}-body`} rows={3} className="input-school text-sm font-semibold" value={section.body}
                          onChange={(event) => patchSection(section.id, { body: event.target.value })} />
                      </Field>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <Field id={`${key}-media`} label={t('studioMediaType', { defaultValue: 'نوع الوسيط' })}>
                          <select id={`${key}-media`} className="input-school py-2 text-sm font-bold" value={section.mediaType}
                            onChange={(event) => patchSection(section.id, {
                              mediaType: event.target.value as MediaType,
                              diagram: event.target.value === 'image' ? section.diagram : '',
                            })}>
                            <option value="text">{t('studioMediaText', { defaultValue: 'نص' })}</option>
                            <option value="image">{t('studioMediaImage', { defaultValue: 'صورة' })}</option>
                          </select>
                        </Field>
                        <Field id={`${key}-diagram`} label={t('studioDiagram', { defaultValue: 'الرسم التوضيحي' })}>
                          <select id={`${key}-diagram`} className="input-school py-2 text-sm font-bold" value={section.diagram}
                            disabled={section.mediaType !== 'image'}
                            onChange={(event) => patchSection(section.id, { diagram: event.target.value })}>
                            <option value="">{t('studioDiagramNone', { defaultValue: 'بدون رسم' })}</option>
                            {DIAGRAMS.map((diagram) => <option key={diagram.path} value={diagram.path}>{t(diagram.key, { defaultValue: diagram.ar })}</option>)}
                          </select>
                        </Field>
                      </div>
                      {section.mediaType === 'image' ? (
                        section.diagram ? (
                          <img src={section.diagram} alt={t('studioDiagramAlt', { defaultValue: 'معاينة الرسم التوضيحي' })}
                            className="mt-3 aspect-video w-full rounded-card border-2 border-line bg-surface-muted object-contain" />
                        ) : (
                          <div className="mt-3"><Notice>{t('studioNoDiagram', { defaultValue: 'لم يُختر رسم توضيحي بعد.' })}</Notice></div>
                        )
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )}
          </EditorCard>

          <EditorCard icon={Lightbulb} title={t('studioExamples', { defaultValue: 'أمثلة الشرح' })} count={draft.examples.length}
            actions={
              <SmallButton label={t('studioAddExample', { defaultValue: 'إضافة مثال' })} onClick={addExample}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />{t('studioAddExample', { defaultValue: 'إضافة مثال' })}
              </SmallButton>
            }>
            {draft.examples.length === 0 ? (
              <Notice>{t('studioNoExamples', { defaultValue: 'لا توجد أمثلة شرح بعد.' })}</Notice>
            ) : (
              <div className="space-y-3">
                {draft.examples.map((example, index) => {
                  const key = `${uid}-example-${example.id}`
                  return (
                    <div key={example.id} className="rounded-card border-2 border-line bg-surface-muted p-3">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-black">{t('studioExampleNumber', { defaultValue: 'المثال رقم {{n}}', n: index + 1 })}</span>
                        <SmallButton tone="danger" label={t('studioRemoveExample', { defaultValue: 'إزالة المثال' })}
                          onClick={() => removeFrom('examples', example.id)}>
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </SmallButton>
                      </div>
                      <Field id={`${key}-prompt`} label={t('studioExamplePrompt', { defaultValue: 'سؤال المثال' })}>
                        <input id={`${key}-prompt`} className="input-school py-2 text-sm font-bold" value={example.prompt}
                          onChange={(event) => patchExample(example.id, { prompt: event.target.value })} />
                      </Field>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] font-black text-muted">{t('studioExampleSteps', { defaultValue: 'خطوات الحل (مرتّبة)' })}</p>
                        <SmallButton label={t('studioAddStep', { defaultValue: 'إضافة خطوة' })}
                          onClick={() => patchExample(example.id, { steps: [...example.steps, ''] })}>
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />{t('studioAddStep', { defaultValue: 'إضافة خطوة' })}
                        </SmallButton>
                      </div>
                      <ol className="mt-2 space-y-2">
                        {example.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>
                            <Field id={`${key}-step-${stepIndex}`} label={t('studioStepNumber', { defaultValue: 'الخطوة {{n}}', n: stepIndex + 1 })}>
                              <div className="flex items-center gap-2">
                                <input id={`${key}-step-${stepIndex}`} className="input-school py-2 text-sm font-semibold" value={step}
                                  onChange={(event) => patchStep(example.id, stepIndex, event.target.value)} />
                                <SmallButton tone="danger" label={t('studioRemoveStep', { defaultValue: 'إزالة الخطوة' })}
                                  disabled={example.steps.length <= 2}
                                  onClick={() => patchExample(example.id, { steps: example.steps.filter((_, i) => i !== stepIndex) })}>
                                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                </SmallButton>
                              </div>
                            </Field>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-2 text-[10px] font-bold text-muted">
                        {t('studioMinSteps', { defaultValue: 'يجب أن يحتوي المثال على خطوتين على الأقل.' })}
                      </p>
                      <Field id={`${key}-answer`} label={t('studioExampleAnswer', { defaultValue: 'الإجابة النهائية' })} className="mt-3">
                        <input id={`${key}-answer`} className="input-school py-2 text-sm font-bold" value={example.answer}
                          onChange={(event) => patchExample(example.id, { answer: event.target.value })} />
                      </Field>
                    </div>
                  )
                })}
              </div>
            )}
          </EditorCard>

          <EditorCard icon={GraduationCap} title={t('studioOutcomes', { defaultValue: 'مخرجات التعلّم' })} count={draft.outcomes.length}
            actions={
              <SmallButton label={t('studioAddOutcome', { defaultValue: 'إضافة مخرج' })} onClick={addOutcome}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />{t('studioAddOutcome', { defaultValue: 'إضافة مخرج' })}
              </SmallButton>
            }>
            <div className="mb-3 flex flex-wrap items-end gap-2 rounded-card border-2 border-dashed border-line bg-surface-muted p-3">
              <Field id={`${uid}-preset`} label={t('studioPresetPicker', { defaultValue: 'أنماط جاهزة لمدارس المغرب الابتدائية' })} className="min-w-52 flex-1">
                <select id={`${uid}-preset`} className="input-school py-2 text-sm font-bold" value={presetId}
                  onChange={(event) => setPresetId(event.target.value)}>
                  <option value="">{t('studioChoose', { defaultValue: 'اختر…' })}</option>
                  {OUTCOME_PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{t(preset.labelKey, { defaultValue: preset.labelDefault })}</option>)}
                </select>
              </Field>
              <SmallButton tone="primary" label={t('studioApplyPreset', { defaultValue: 'تطبيق النمط' })} onClick={applyPreset} disabled={!presetId}>
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />{t('studioApplyPreset', { defaultValue: 'تطبيق النمط' })}
              </SmallButton>
            </div>
            {draft.outcomes.length === 0 ? (
              <Notice>{t('studioNoOutcomes', { defaultValue: 'لا توجد مخرجات بعد.' })}</Notice>
            ) : (
              <div className="space-y-3">
                {draft.outcomes.map((outcome, index) => {
                  const key = `${uid}-outcome-${outcome.id}`
                  return (
                    <div key={outcome.id} className="rounded-card border-2 border-line bg-surface-muted p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-xs font-black">{t('studioOutcomeNumber', { defaultValue: 'المخرج رقم {{n}}', n: index + 1 })}</span>
                        <SmallButton tone="danger" label={t('studioRemoveOutcome', { defaultValue: 'إزالة المخرج' })}
                          onClick={() => removeFrom('outcomes', outcome.id)}>
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </SmallButton>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Field id={`${key}-code`} label={t('studioOutcomeCode', { defaultValue: 'رمز المخرج' })}>
                          <input id={`${key}-code`} className="input-school py-2 text-sm font-bold" value={outcome.code}
                            onChange={(event) => patchOutcome(outcome.id, { code: event.target.value })} />
                        </Field>
                        <Field id={`${key}-ar`} label={t('studioOutcomeAr', { defaultValue: 'النص العربي' })}>
                          <input id={`${key}-ar`} dir="rtl" className="input-school py-2 text-sm font-semibold" value={outcome.ar}
                            onChange={(event) => patchOutcome(outcome.id, { ar: event.target.value })} />
                        </Field>
                        <Field id={`${key}-fr`} label={t('studioOutcomeFr', { defaultValue: 'النص الفرنسي' })}>
                          <input id={`${key}-fr`} dir="ltr" className="input-school py-2 text-sm font-semibold" value={outcome.fr}
                            onChange={(event) => patchOutcome(outcome.id, { fr: event.target.value })} />
                        </Field>
                        <Field id={`${key}-en`} label={t('studioOutcomeEn', { defaultValue: 'النص الإنجليزي' })}>
                          <input id={`${key}-en`} dir="ltr" className="input-school py-2 text-sm font-semibold" value={outcome.en}
                            onChange={(event) => patchOutcome(outcome.id, { en: event.target.value })} />
                        </Field>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </EditorCard>

          <EditorCard icon={ListChecks} title={t('studioQuiz', { defaultValue: 'أسئلة التقويم' })} count={draft.questions.length}
            actions={
              <SmallButton label={t('studioAddQuestion', { defaultValue: 'إضافة سؤال' })} onClick={addQuestion}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />{t('studioAddQuestion', { defaultValue: 'إضافة سؤال' })}
              </SmallButton>
            }>
            {draft.questions.length === 0 ? (
              <Notice>{t('studioNoQuestions', { defaultValue: 'لا توجد أسئلة بعد.' })}</Notice>
            ) : (
              <div className="space-y-3">
                {draft.questions.map((question, index) => {
                  const key = `${uid}-question-${question.id}`
                  return (
                    <div key={question.id} className="rounded-card border-2 border-line bg-surface-muted p-3">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-black">{t('studioQuestionNumber', { defaultValue: 'السؤال رقم {{n}}', n: index + 1 })}</span>
                        <SmallButton tone="danger" label={t('studioRemoveQuestion', { defaultValue: 'إزالة السؤال' })}
                          onClick={() => removeFrom('questions', question.id)}>
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </SmallButton>
                      </div>
                      <Field id={`${key}-prompt`} label={t('studioQuestionPrompt', { defaultValue: 'نص السؤال' })}>
                        <input id={`${key}-prompt`} className="input-school py-2 text-sm font-bold" value={question.prompt}
                          onChange={(event) => patchQuestion(question.id, { prompt: event.target.value })} />
                      </Field>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {question.options.map((option, optionIndex) => (
                          <Field key={optionIndex} id={`${key}-option-${optionIndex}`}
                            label={t('studioOption', { defaultValue: 'الخيار {{n}}', n: optionIndex + 1 })}>
                            <input id={`${key}-option-${optionIndex}`} className="input-school py-2 text-sm font-semibold" value={option}
                              onChange={(event) => patchOption(question.id, optionIndex, event.target.value)} />
                          </Field>
                        ))}
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <Field id={`${key}-correct`} label={t('studioCorrectOption', { defaultValue: 'الإجابة الصحيحة' })}>
                          <select id={`${key}-correct`} className="input-school py-2 text-sm font-bold" value={question.correctIndex}
                            onChange={(event) => patchQuestion(question.id, { correctIndex: Number(event.target.value) })}>
                            {[0, 1, 2, 3].map((optionIndex) => (
                              <option key={optionIndex} value={optionIndex}>{t('studioOption', { defaultValue: 'الخيار {{n}}', n: optionIndex + 1 })}</option>
                            ))}
                          </select>
                        </Field>
                        <p className="self-end text-[10px] font-bold text-muted">
                          {t('studioCorrectOptionHelp', { defaultValue: 'اختر رقم الخيار الصحيح.' })}
                        </p>
                      </div>
                      <Field id={`${key}-explanation`} label={t('studioExplanation', { defaultValue: 'شرح الإجابة' })} className="mt-2">
                        <textarea id={`${key}-explanation`} rows={2} className="input-school text-sm font-semibold" value={question.explanation}
                          onChange={(event) => patchQuestion(question.id, { explanation: event.target.value })} />
                      </Field>
                    </div>
                  )
                })}
              </div>
            )}
          </EditorCard>
        </div>

        <aside className="space-y-4">
          <EditorCard icon={FileJson} title={t('studioJsonTools', { defaultValue: 'الملف والمشاركة' })}>
            <div className="space-y-2">
              <button type="button" onClick={handleExport}
                className="btn-chunky btn-chunky--primary btn-chunky--sm w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
                <Download className="h-3.5 w-3.5" aria-hidden="true" />{t('studioExport', { defaultValue: 'تصدير JSON' })}
              </button>
              <button type="button" onClick={() => void handleCopy()}
                className="btn-chunky btn-chunky--secondary btn-chunky--sm w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />{t('studioCopyJson', { defaultValue: 'نسخ JSON' })}
              </button>
              <Field id={`${uid}-import`} label={t('studioImport', { defaultValue: 'استيراد JSON' })} className="pt-2">
                <input id={`${uid}-import`} type="file" accept="application/json,.json"
                  onChange={(event) => void handleImport(event)}
                  aria-label={t('studioImport', { defaultValue: 'استيراد JSON' })}
                  className="block w-full text-[11px] font-semibold text-muted file:me-2 file:rounded-card file:border-2 file:border-line file:bg-surface file:px-3 file:py-2 file:text-xs file:font-black file:text-content" />
              </Field>
              <p className="text-[10px] font-semibold leading-relaxed text-muted">
                {t('studioImportHint', { defaultValue: 'اختر ملف JSON متوافقًا لاستبدال المسودة الحالية.' })}
              </p>
            </div>
          </EditorCard>
          <EditorCard icon={Send} title={t('studioReview', { defaultValue: 'المراجعة والنشر' })}>
            <p className="text-[11px] font-semibold leading-relaxed text-muted">
              {t('studioSubmitNotice', { defaultValue: 'الإرسال لا ينشر الدرس؛ المراجعة البشرية مطلوبة قبل النشر.' })}
            </p>
            <button type="button" onClick={handleSubmit} disabled={!!draft.submittedAt}
              className="btn-chunky btn-chunky--gold btn-chunky--sm mt-3 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2">
              <Send className="h-3.5 w-3.5" aria-hidden="true" />{t('studioSubmit', { defaultValue: 'إرسال للمراجعة' })}
            </button>
            {draft.submittedAt ? (
              <div className="mt-3"><Notice tone="success">{t('studioAlreadySubmitted', { defaultValue: 'أُرسلت هذه المسودة للمراجعة بالفعل.' })}</Notice></div>
            ) : null}
          </EditorCard>
        </aside>
      </div>

      {showPreview ? <PreviewPanel draft={draft} /> : null}

      <section className="card-school flex flex-wrap items-center gap-x-4 gap-y-2 p-4"
        aria-label={t('studioStatusBar', { defaultValue: 'حالة المسودة' })}>
        <span className="flex items-center gap-1.5 text-[11px] font-black text-content">
          <Clock className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          {t('studioStatusBar', { defaultValue: 'حالة المسودة' })}
        </span>
        <span className="text-[11px] font-bold text-muted">
          {lastSavedAt ? t('studioLastSaved', { defaultValue: 'آخر حفظ: {{time}}', time: formatTime(lastSavedAt) })
            : t('studioNeverSaved', { defaultValue: 'لم تُحفظ بعد' })}
        </span>
        <span className="text-[11px] font-bold text-muted">{t('studioSectionsCount', { defaultValue: 'الأقسام: {{n}}', n: draft.sections.length })}</span>
        <span className="text-[11px] font-bold text-muted">{t('studioExamplesCount', { defaultValue: 'أمثلة الشرح: {{n}}', n: draft.examples.length })}</span>
        <span className="text-[11px] font-bold text-muted">{t('studioQuestionsCount', { defaultValue: 'أسئلة التقويم: {{n}}', n: draft.questions.length })}</span>
        {draft.submittedAt ? (
          <span className="rounded-full bg-gold-100 px-2 py-1 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
            {t('studioSubmittedBadge', { defaultValue: 'قيد المراجعة' })}
          </span>
        ) : null}
        {emptySections > 0 ? (
          <span className="flex items-center gap-1.5 text-[11px] font-black text-[#b42318] dark:text-[#ff8787]">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            {t('studioEmptySectionWarning', { defaultValue: 'تنبيه: هناك قسم فارغ. أكمل عنوانه ونصه قبل الإرسال.' })}
          </span>
        ) : null}
      </section>
    </div>
  )
}
