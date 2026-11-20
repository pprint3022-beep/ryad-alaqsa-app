import { useEffect, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  GraduationCap,
  RotateCcw,
  X,
} from 'lucide-react'

interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface TrainingModule {
  id: string
  title: string
  duration: string
  points: string[]
  task: string
  questions: QuizQuestion[]
}

interface TrainingState {
  checked: Record<string, boolean>
  answers: Record<string, number>
  correct: Record<string, boolean>
  completed: Record<string, boolean>
  finishedAt: string | null
}

const STORAGE_KEY = 'ryad-teacher-training'

const EMPTY_STATE: TrainingState = {
  checked: {},
  answers: {},
  correct: {},
  completed: {},
  finishedAt: null,
}

function asBoolMap(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const out: Record<string, boolean> = {}
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === 'boolean') out[key] = entry
  }
  return out
}

function asNumberMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const out: Record<string, number> = {}
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === 'number' && Number.isFinite(entry)) out[key] = entry
  }
  return out
}

function loadState(): TrainingState {
  if (typeof window === 'undefined') return EMPTY_STATE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw) as Partial<TrainingState>
    return {
      checked: asBoolMap(parsed.checked),
      answers: asNumberMap(parsed.answers),
      correct: asBoolMap(parsed.correct),
      completed: asBoolMap(parsed.completed),
      finishedAt: typeof parsed.finishedAt === 'string' ? parsed.finishedAt : null,
    }
  } catch {
    return EMPTY_STATE
  }
}

function pointKey(moduleId: string, index: number): string {
  return `${moduleId}-p${index}`
}

function questionKey(moduleId: string, index: number): string {
  return `${moduleId}-q${index}`
}

interface ModuleCardProps {
  module: TrainingModule
  index: number
  expanded: boolean
  onToggle: () => void
  checked: Record<string, boolean>
  answers: Record<string, number>
  correct: Record<string, boolean>
  completed: boolean
  onCheck: (moduleId: string, pointIndex: number, value: boolean) => void
  onAnswer: (moduleId: string, questionIndex: number, optionIndex: number, isCorrect: boolean) => void
  onRetry: (moduleId: string, questionIndex: number) => void
  onComplete: (moduleId: string) => void
}

function ModuleCard({
  module,
  index,
  expanded,
  onToggle,
  checked,
  answers,
  correct,
  completed,
  onCheck,
  onAnswer,
  onRetry,
  onComplete,
}: ModuleCardProps) {
  const { t } = useTranslation()
  const panelId = useId()

  const allPointsTicked = module.points.every((_, pi) => checked[pointKey(module.id, pi)] === true)
  const allQuestionsAnswered = module.questions.every(
    (_, qi) => answers[questionKey(module.id, qi)] !== undefined,
  )
  const ready = allPointsTicked && allQuestionsAnswered
  const wrongCount = module.questions.filter((_, qi) => {
    const key = questionKey(module.id, qi)
    return answers[key] !== undefined && correct[key] !== true
  }).length

  const hint = !ready
    ? t('trainingNotReadyHint', { defaultValue: 'أكمل جميع نقاط التعلم وأجب عن كل أسئلة الوحدة لتفعيل الإتمام.' })
    : wrongCount > 0
      ? t('trainingWrongAnswersHint', { defaultValue: 'أجبت عن كل شيء، لكن هناك إجابات تحتاج مراجعة؛ راجع الشرح ثم أعد المحاولة.' })
      : t('trainingReadyHint', { defaultValue: 'أنت جاهز لتسجيل إتمام هذه الوحدة.' })

  return (
    <li className="rounded-card border-2 border-line bg-surface p-4 print:break-inside-avoid">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={`${t('trainingExpandModule', { defaultValue: 'توسيع أو طي الوحدة' })}: ${module.title}`}
          className="flex min-w-0 flex-1 items-start gap-3 rounded-card text-start transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 font-display text-sm font-black text-white shadow-chunky-sm"
          >
            {index + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="font-display text-sm font-black text-content sm:text-base">
                {module.title}
              </span>
              {completed ? (
                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-black text-brand-700 dark:text-brand-300">
                  {t('trainingCompleted', { defaultValue: 'مكتملة' })}
                </span>
              ) : null}
            </span>
            <span className="mt-1 block text-[10px] font-bold text-muted">{module.duration}</span>
          </span>
          <ChevronDown
            className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        id={panelId}
        className={expanded ? 'mt-3 border-t-2 border-line pt-3' : 'mt-3 hidden border-t-2 border-line pt-3 print:block'}
      >
        <section aria-label={t('trainingLearningPoints', { defaultValue: 'نقاط التعلّم' })}>
          <h3 className="text-xs font-black text-content">
            {t('trainingLearningPoints', { defaultValue: 'نقاط التعلّم' })}
          </h3>
          <ul className="mt-2 space-y-2">
            {module.points.map((point, pi) => {
              const key = pointKey(module.id, pi)
              return (
                <li key={key}>
                  <label className="flex cursor-pointer items-start gap-2 rounded-card border-2 border-line bg-surface-muted p-2 text-xs font-bold leading-relaxed text-content transition hover:border-brand-300 focus-within:outline-none focus-within:ring-4 focus-within:ring-brand-300">
                    <input
                      type="checkbox"
                      checked={checked[key] === true}
                      onChange={(event) => onCheck(module.id, pi, event.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
                    />
                    <span>{point}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="mt-4 rounded-card border-2 border-gold-300 bg-gold-50 p-3 dark:border-gold-400/30 dark:bg-gold-400/10">
          <h3 className="flex items-center gap-1.5 text-xs font-black text-gold-800 dark:text-gold-200">
            <ClipboardList className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {t('trainingTaskLabel', { defaultValue: 'تطبيق عملي' })}
          </h3>
          <p className="mt-1 text-[11px] font-semibold leading-relaxed text-gold-800 dark:text-gold-200">
            {module.task}
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-xs font-black text-content">
            {t('trainingKnowledgeCheck', { defaultValue: 'اختبار المعرفة' })}
          </h3>
          <div className="mt-2 space-y-3">
            {module.questions.map((question, qi) => {
              const key = questionKey(module.id, qi)
              const selected = answers[key]
              const answered = selected !== undefined
              const answeredCorrectly = answered && correct[key] === true
              return (
                <fieldset key={question.id} className="rounded-card border-2 border-line bg-surface p-3">
                  <legend className="px-1 text-xs font-black text-content">{question.prompt}</legend>
                  <div className="mt-2 grid gap-2 sm:grid-cols-3">
                    {question.options.map((option, oi) => {
                      const isCorrect = oi === question.correctIndex
                      const isSelected = selected === oi
                      const tone = !answered
                        ? 'border-line bg-surface text-content hover:border-brand-300 hover:bg-surface-muted'
                        : isCorrect
                          ? 'border-brand-500 bg-brand-100 text-brand-800 dark:bg-brand-500/20 dark:text-brand-100'
                          : isSelected
                            ? 'border-[#E03131] bg-[#FFEBEB] text-[#C92A2A] dark:bg-[#E03131]/20 dark:text-[#ff8787]'
                            : 'border-line bg-surface-muted text-muted opacity-70'
                      return (
                        <label
                          key={oi}
                          className={`flex min-h-[52px] cursor-pointer items-center gap-2 rounded-card border-2 px-3 py-2 text-[11px] font-bold leading-snug transition focus-within:outline-none focus-within:ring-4 focus-within:ring-brand-300 ${tone}`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={isSelected}
                            onChange={() => onAnswer(module.id, qi, oi, isCorrect)}
                            className="h-4 w-4 shrink-0 accent-brand-600"
                          />
                          <span className="min-w-0 flex-1">{option}</span>
                          {answered && isCorrect ? (
                            <Check className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                          ) : null}
                          {answered && isSelected && !isCorrect ? (
                            <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                          ) : null}
                        </label>
                      )
                    })}
                  </div>
                  {answered ? (
                    <div
                      role="status"
                      className="mt-2 rounded-card bg-surface-muted p-2"
                    >
                      <p
                        className={`text-[11px] font-black ${
                          answeredCorrectly
                            ? 'text-brand-700 dark:text-brand-300'
                            : 'text-[#C92A2A] dark:text-[#ff8787]'
                        }`}
                      >
                        {answeredCorrectly
                          ? t('trainingCorrect', { defaultValue: 'إجابة صحيحة، أحسنت!' })
                          : t('trainingIncorrect', { defaultValue: 'ليست الإجابة الصحيحة، تعلّم من الشرح وأعد المحاولة.' })}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold leading-relaxed text-muted">
                        {question.explanation}
                      </p>
                      {!answeredCorrectly ? (
                        <button
                          type="button"
                          onClick={() => onRetry(module.id, qi)}
                          aria-label={`${t('trainingRetry', { defaultValue: 'إعادة المحاولة' })}: ${question.prompt}`}
                          className="btn-chunky btn-chunky--secondary btn-chunky--sm mt-2"
                        >
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                          {t('trainingRetry', { defaultValue: 'إعادة المحاولة' })}
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-2 text-[10px] font-semibold text-muted">
                      {t('trainingSelectAnswer', { defaultValue: 'اختر إجابة واحدة لعرض التغذية الراجعة فورًا.' })}
                    </p>
                  )}
                </fieldset>
              )
            })}
          </div>
        </section>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-2 border-line pt-3">
          <p className="text-[10px] font-bold text-muted">{hint}</p>
          <button
            type="button"
            onClick={() => onComplete(module.id)}
            disabled={!ready || completed}
            aria-label={`${t('trainingMarkComplete', { defaultValue: 'تسجيل إتمام الوحدة' })}: ${module.title}`}
            className="btn-chunky btn-chunky--primary btn-chunky--sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {completed ? (
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {completed
              ? t('trainingCompleted', { defaultValue: 'مكتملة' })
              : t('trainingMarkComplete', { defaultValue: 'تسجيل إتمام الوحدة' })}
          </button>
        </div>
      </div>
    </li>
  )
}

export default function TeacherTraining() {
  const { t, i18n } = useTranslation()
  const [state, setState] = useState<TrainingState>(loadState)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const modules = useMemo<TrainingModule[]>(
    () => [
      {
        id: 'm1',
        title: t('trainingM1Title', { defaultValue: 'الهوية المؤسسية والألوان' }),
        duration: t('trainingM1Duration', { defaultValue: 'نحو 8 دقائق' }),
        points: [
          t('trainingM1P1', { defaultValue: 'شعار المعهد يجمع شمسًا وأشعةً وأطفالًا وعشبًا أخضر؛ يرمز إلى الدفء والنمو والجذور.' }),
          t('trainingM1P2', { defaultValue: 'الأخضر هو اللون الأساسي، مع الأصفر للشمس ولمسات داكنة مكمّلة؛ لا نستعير ألوان علامات تعليمية أجنبية.' }),
          t('trainingM1P3', { defaultValue: 'نستخدم الاسم «معهد الرياض الأقصى» في الواجهات، والحروف I·R·A بنقاط بينية في الشارات فقط.' }),
          t('trainingM1P4', { defaultValue: 'يبقى الشعار والاسم واضحين بتباين كافٍ على الخلفيات الفاتحة والداكنة.' }),
        ],
        task: t('trainingM1Task', { defaultValue: 'افتح واجهة المعلم وتفحّص الشعار: تأكد من وجود الأشعة والأطفال والعشب الأخضر، وصحّح أي اسم أو لون غريب إلى هوية المعهد وحدها.' }),
        questions: [
          {
            id: 'm1-q1',
            prompt: t('trainingM1Q1', { defaultValue: 'أي عنصر ليس جزءًا من الهوية البصرية للمعهد؟' }),
            options: [
              t('trainingM1Q1A', { defaultValue: 'الشمس والأشعة والأطفال والعشب الأخضر' }),
              t('trainingM1Q1B', { defaultValue: 'شعار دبّ أزرق لعلامة تعليمية أجنبية' }),
              t('trainingM1Q1C', { defaultValue: 'الحروف I·R·A في الشارة' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM1Q1Exp', { defaultValue: 'هوية المعهد تقوم على الشمس والأشعة والأطفال والعشب الأخضر، مع I·R·A في الشارة؛ لا تُستخدم شعارات علامات أخرى.' }),
          },
          {
            id: 'm1-q2',
            prompt: t('trainingM1Q2', { defaultValue: 'ما الاختيار الصحيح لألوان درس جديد؟' }),
            options: [
              t('trainingM1Q2A', { defaultValue: 'أخضر المعهد أساسًا مع لمسة صفراء للشمس' }),
              t('trainingM1Q2B', { defaultValue: 'نسخ ألوان تطبيق أجنبي مشهور' }),
              t('trainingM1Q2C', { defaultValue: 'تغيير الشعار حسب كل مادة' }),
            ],
            correctIndex: 0,
            explanation: t('trainingM1Q2Exp', { defaultValue: 'الاتساق البصري جزء من الهوية: نعتمد أخضر المعهد ولمسة الشمس الصفراء، ولا نستعير هوية علامات تجارية أخرى.' }),
          },
        ],
      },
      {
        id: 'm2',
        title: t('trainingM2Title', { defaultValue: 'اللغات الأربع واتجاه النص' }),
        duration: t('trainingM2Duration', { defaultValue: 'نحو 12 دقيقة' }),
        points: [
          t('trainingM2P1', { defaultValue: 'الواجهة متاحة بالعربية والفرنسية والإنجليزية والأمازيغية: ar / fr / en / amz.' }),
          t('trainingM2P2', { defaultValue: 'نضبط اتجاه النص بحسب لغته: العربية RTL، والفرنسية والإنجليزية LTR، ولا نخلط الاتجاهين داخل العنصر الواحد.' }),
          t('trainingM2P3', { defaultValue: 'نترجم كل شيء: العناوين، والحالات مثل «قيد المراجعة»، وأسماء الوحدات والمواد، والأزرار، ونصوص المساعدة.' }),
          t('trainingM2P4', { defaultValue: 'لا نترك سلاسل تقنية أو كلمات إنجليزية ظاهرة؛ كل نص يمرّ بمفتاح ترجمة مع نص عربي بديل.' }),
        ],
        task: t('trainingM2Task', { defaultValue: 'بدّل اللغة إلى الفرنسية ثم الإنجليزية، وافتح قائمة خطط الدروس: تحقق من انعكاس الاتجاه وترجمة الحالات والوحدات والأزرار، ثم عد إلى العربية.' }),
        questions: [
          {
            id: 'm2-q1',
            prompt: t('trainingM2Q1', { defaultValue: 'ماذا يعني «نترجم كل شيء» في واجهة المعلم؟' }),
            options: [
              t('trainingM2Q1A', { defaultValue: 'العناوين فقط' }),
              t('trainingM2Q1B', { defaultValue: 'العناوين والحالات والوحدات والأزرار ونصوص المساعدة' }),
              t('trainingM2Q1C', { defaultValue: 'القوائم فقط لأن الباقي تقني' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM2Q1Exp', { defaultValue: 'كل ما يراه المستخدم يُترجم: حالات مثل «مسودة» و«قيد المراجعة»، وأسماء الوحدات والمواد، والأزرار والنصوص المساعدة.' }),
          },
          {
            id: 'm2-q2',
            prompt: t('trainingM2Q2', { defaultValue: 'كيف نعرض نصًا عربيًا داخل صفحة إنجليزية؟' }),
            options: [
              t('trainingM2Q2A', { defaultValue: 'يبقى LTR لأن الصفحة إنجليزية' }),
              t('trainingM2Q2B', { defaultValue: 'تُضبط RTL للعنصر العربي وحده' }),
              t('trainingM2Q2C', { defaultValue: 'يُكتب النص بالحروف اللاتينية' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM2Q2Exp', { defaultValue: 'الاتجاه يُضبط بحسب لغة النص: العربية RTL والإنجليزية LTR؛ لا نحذف النص ولا نبدّل حروفه.' }),
          },
        ],
      },
      {
        id: 'm3',
        title: t('trainingM3Title', { defaultValue: 'تأليف درس تفاعلي' }),
        duration: t('trainingM3Duration', { defaultValue: 'نحو 15 دقيقة' }),
        points: [
          t('trainingM3P1', { defaultValue: 'يبدأ الدرس بنتائج تعلّم واضحة وقابلة للملاحظة، لا بعبارات عامة غامضة.' }),
          t('trainingM3P2', { defaultValue: 'نقسّم المحتوى إلى أقسام قصيرة، ونضع في كل قسم مثالًا محلولًا يشرح الخطوات لا الإجابة النهائية فقط.' }),
          t('trainingM3P3', { defaultValue: 'نرفق رسومًا توضيحية بسيطة تخدم الفكرة، مع نص بديل يصف الرسم لمن لا يراه.' }),
          t('trainingM3P4', { defaultValue: 'كل نشاط تفاعلي يخدم نتيجة تعلّم محددة، ويمكن إعادة محاولته دون عقاب.' }),
        ],
        task: t('trainingM3Task', { defaultValue: 'أنشئ مسودة درس من قسمين: اكتب نتيجتَي تعلّم، ومثالًا محلولًا لكل قسم، ثم أضف مخططًا مبسطًا وصفه بكلمات في الحقل البديل.' }),
        questions: [
          {
            id: 'm3-q1',
            prompt: t('trainingM3Q1', { defaultValue: 'ما الذي يجعل نتيجة التعلّم جيدة؟' }),
            options: [
              t('trainingM3Q1A', { defaultValue: '«يفهم الطالب الدرس»' }),
              t('trainingM3Q1B', { defaultValue: '«يميّز الطالب بين نمطين ويبرّر اختياره»' }),
              t('trainingM3Q1C', { defaultValue: 'عنوان الدرس أو رقم الصفحة' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM3Q1Exp', { defaultValue: 'نتيجة التعلّم تُصاغ بفعل يمكن ملاحظته وتقويمه؛ العبارات العامة لا توجّه التأليف ولا التقييم.' }),
          },
          {
            id: 'm3-q2',
            prompt: t('trainingM3Q2', { defaultValue: 'لماذا نضيف نصًا بديلًا للرسم التوضيحي؟' }),
            options: [
              t('trainingM3Q2A', { defaultValue: 'لأن الصور ممنوعة في الدروس' }),
              t('trainingM3Q2B', { defaultValue: 'لزيادة عدد الكلمات في الدرس' }),
              t('trainingM3Q2C', { defaultValue: 'ليفهم القارئ المعنى حتى دون رؤية الرسم' }),
            ],
            correctIndex: 2,
            explanation: t('trainingM3Q2Exp', { defaultValue: 'النص البديل جزء من الوصول العادل: يصف الرسم لقارئ الشاشة ويُبقي المعنى متاحًا للجميع.' }),
          },
        ],
      },
      {
        id: 'm4',
        title: t('trainingM4Title', { defaultValue: 'التقييم التكويني والإنصاف' }),
        duration: t('trainingM4Duration', { defaultValue: 'نحو 10 دقائق' }),
        points: [
          t('trainingM4P1', { defaultValue: 'التقييم التكويني توجيهي فقط: يقدّم تغذية راجعة وتلميحات، ولا يُنتج درجات رسمية.' }),
          t('trainingM4P2', { defaultValue: 'الدرجات الرسمية وشهادات المستوى تُعتمد من المعلم أو الإدارة بعد مراجعة بشرية.' }),
          t('trainingM4P3', { defaultValue: 'نوفّر السؤال بلغاته الأربع بصيغة متكافئة، حتى لا يُحاسب المتعلّم على اللغة بدل الفكرة.' }),
          t('trainingM4P4', { defaultValue: 'نراجع الأسئلة للتحقق من خلوّها من التحيز الثقافي أو اللغوي، ونمنح وقت دعم إضافي عند الحاجة.' }),
        ],
        task: t('trainingM4Task', { defaultValue: 'راجع سؤالًا في بنك الأسئلة: احذف أي أثر لدرجة نهائية، وأضف شرحًا يعلّم دون إعطاء الإجابة، وتأكد من تكافؤ النسختين العربية والفرنسية.' }),
        questions: [
          {
            id: 'm4-q1',
            prompt: t('trainingM4Q1', { defaultValue: 'ما دور نتيجة التقييم التكويني الآلي؟' }),
            options: [
              t('trainingM4Q1A', { defaultValue: 'تُسجَّل درجة نهائية في بطاقة التلميذ' }),
              t('trainingM4Q1B', { defaultValue: 'تبقى توصية توجيهية يراجعها المعلم' }),
              t('trainingM4Q1C', { defaultValue: 'تُغني عن مراجعة المعلم تمامًا' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM4Q1Exp', { defaultValue: 'التقييم التكويني استشاري: يوجّه التعلّم ولا يُصدر درجة رسمية، والقرار النهائي قرار بشري.' }),
          },
          {
            id: 'm4-q2',
            prompt: t('trainingM4Q2', { defaultValue: 'أي ممارسة تُعدّ أكثر إنصافًا؟' }),
            options: [
              t('trainingM4Q2A', { defaultValue: 'سؤال عربي واحد للجميع' }),
              t('trainingM4Q2B', { defaultValue: 'نسخ متكافئة بأربع لغات مع مراجعة التحيز ووقت دعم' }),
              t('trainingM4Q2C', { defaultValue: 'اعتبار أسرع إجابة دليلًا على التفوق' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM4Q2Exp', { defaultValue: 'الإنصاف يعني تكافؤ فرص الفهم: لغات متاحة ومراجعة للتحيز ودعم عند الحاجة، لا سرعة الإجابة.' }),
          },
        ],
      },
      {
        id: 'm5',
        title: t('trainingM5Title', { defaultValue: 'الخصوصية والتدقيق والصلاحيات' }),
        duration: t('trainingM5Duration', { defaultValue: 'نحو 14 دقيقة' }),
        points: [
          t('trainingM5P1', { defaultValue: 'نطبّق k-anonymity: لا تُعرض مجموعة إحصائية إلا إذا ضمّت حدًّا أدنى من التلاميذ (k)، وإلا تُجمَع.' }),
          t('trainingM5P2', { defaultValue: 'كل تغيير مهم يُسجَّل في سجلّ التدقيق: من قام به ومتى وماذا تغيّر، ولا يُحذف السجل.' }),
          t('trainingM5P3', { defaultValue: 'الصلاحيات مرتبطة بالنطاق (RBAC + scope): المعلم يرى صفّه فقط، وبوابة الأهل منفصلة تمامًا عن بوابة المعلمين.' }),
          t('trainingM5P4', { defaultValue: 'حضور التلميذ في القسم ليس وقت دخوله إلى المنصة؛ لا نستبدل أحدهما بالآخر في التقارير.' }),
        ],
        task: t('trainingM5Task', { defaultValue: 'افتح لوحة التحليلات وتأكد أن الأرقام مجمّعة وفق k، ثم استعرض سجل التدقيق لآخر تعديل، وجرّب فتح رابط بوابة الأهل من حساب المعلم.' }),
        questions: [
          {
            id: 'm5-q1',
            prompt: t('trainingM5Q1', { defaultValue: 'ماذا تعني k-anonymity في لوحات المعلم؟' }),
            options: [
              t('trainingM5Q1A', { defaultValue: 'إخفاء أسماء المعلمين فقط' }),
              t('trainingM5Q1B', { defaultValue: 'ألا تُعرض مجموعة إلا إن ضمّت حدًّا أدنى من التلاميذ (k)' }),
              t('trainingM5Q1C', { defaultValue: 'حذف سجل التدقيق أسبوعيًا' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM5Q1Exp', { defaultValue: 'k-anonymity تمنع التعرف على تلميذ بعينه عبر مجموعات صغيرة؛ لا نعرض إلا تجميعات كافية الحجم.' }),
          },
          {
            id: 'm5-q2',
            prompt: t('trainingM5Q2', { defaultValue: 'أي عبارة صحيحة عن الحضور ووقت المنصة؟' }),
            options: [
              t('trainingM5Q2A', { defaultValue: 'الحضور الصفّي ووقت المنصة مصدران منفصلان' }),
              t('trainingM5Q2B', { defaultValue: 'وقت المنصة هو نفسه الحضور الصفّي' }),
              t('trainingM5Q2C', { defaultValue: 'إذا غاب التلميذ يُحذف وقته من المنصة' }),
            ],
            correctIndex: 0,
            explanation: t('trainingM5Q2Exp', { defaultValue: 'مصدران مختلفان: حضور الصف يرصده المعلم، ومدة استخدام المنصة تُقاس من المنصة؛ لا يُخلط بينهما.' }),
          },
          {
            id: 'm5-q3',
            prompt: t('trainingM5Q3', { defaultValue: 'لماذا نفصل بوابة المعلمين عن بوابة الأهل؟' }),
            options: [
              t('trainingM5Q3A', { defaultValue: 'لاختلاف ألوان التصميم فقط' }),
              t('trainingM5Q3B', { defaultValue: 'لأن لكل بوابة دورًا ونطاق وصول مستقلين' }),
              t('trainingM5Q3C', { defaultValue: 'لأن البوابتين تستخدمان لغتين مختلفتين' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM5Q3Exp', { defaultValue: 'الفصل جزء من RBAC: كل مستخدم يصل إلى ما يسمح به دوره ونطاقه، ولا تمنح بوابة الأهل صلاحيات المعلم.' }),
          },
        ],
      },
      {
        id: 'm6',
        title: t('trainingM6Title', { defaultValue: 'الصوت متعدد اللغات والمراجعة البشرية' }),
        duration: t('trainingM6Duration', { defaultValue: 'نحو 11 دقيقة' }),
        points: [
          t('trainingM6P1', { defaultValue: 'أصوات المتصفح تُضبط حسب اللغة: ar-SA للعربية، وfr-FR للفرنسية، وen-GB للإنجليزية، ولا يعمل الصوت تلقائيًا أبدًا.' }),
          t('trainingM6P2', { defaultValue: 'الأمازيغية تستخدم مقاطع WAV أصيلة بالتفيناغ من مجلد audio/amz، لا صوت متصفح عام.' }),
          t('trainingM6P3', { defaultValue: 'لا نترك العربية أو التفيناغ تُقرأ بصوت افتراضي غير ذي صلة؛ إن لم يتوفر صوت مناسب يبقى التشغيل صامتًا.' }),
          t('trainingM6P4', { defaultValue: 'المراجعة البشرية إلزامية قبل اعتماد أي ملف صوتي: نستمع للتأكد من النطق والمعنى.' }),
          t('trainingM6P5', { defaultValue: 'قاعدة «نقرة واحدة = نطق واحد»: الضغطة تنتج نطقًا واضحًا واحدًا، والضغط التالي يوقفه أو يعيده بلا تراكم.' }),
        ],
        task: t('trainingM6Task', { defaultValue: 'استمع إلى كلمة عربية وأخرى بالتفيناغ في درسك، وتحقق من أن كل لغة تستخدم صوتها الخاص، ثم دوّن ملاحظة مراجعة بشرية قبل اعتماد المقطع.' }),
        questions: [
          {
            id: 'm6-q1',
            prompt: t('trainingM6Q1', { defaultValue: 'ماذا يحدث عند غياب صوت عربي مناسب في المتصفح؟' }),
            options: [
              t('trainingM6Q1A', { defaultValue: 'يُقرأ النص بصوت إنجليزي افتراضي' }),
              t('trainingM6Q1B', { defaultValue: 'يبقى الصوت صامتًا بدل استخدام صوت غير ذي صلة' }),
              t('trainingM6Q1C', { defaultValue: 'تُترجم الكلمة تلقائيًا إلى الفرنسية' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM6Q1Exp', { defaultValue: 'القاعدة: لا صوت أفضل من صوت خاطئ؛ إذا لم يوجد صوت عربي أو تفيناغي مناسب لا نُشغّل صوتًا آخر.' }),
          },
          {
            id: 'm6-q2',
            prompt: t('trainingM6Q2', { defaultValue: 'كيف نوفّر نطق الأمازيغية؟' }),
            options: [
              t('trainingM6Q2A', { defaultValue: 'بمقاطع WAV أصيلة بالتفيناغ مع مراجعة بشرية' }),
              t('trainingM6Q2B', { defaultValue: 'بصوت المتصفح الافتراضي' }),
              t('trainingM6Q2C', { defaultValue: 'بزيادة سرعة الصوت العربي' }),
            ],
            correctIndex: 0,
            explanation: t('trainingM6Q2Exp', { defaultValue: 'للتفيناغ تسجيلات أصيلة محفوظة في المستودع، وتُراجَع بشريًا قبل اعتمادها في الدروس.' }),
          },
          {
            id: 'm6-q3',
            prompt: t('trainingM6Q3', { defaultValue: 'ما المقصود بـ«نقرة واحدة = نطق واحد»؟' }),
            options: [
              t('trainingM6Q3A', { defaultValue: 'كل نقرة تضيف صوتًا فوق السابق' }),
              t('trainingM6Q3B', { defaultValue: 'الضغطة تنتج نطقًا واحدًا، والضغط التالي يوقفه أو يعيده' }),
              t('trainingM6Q3C', { defaultValue: 'يبدأ الصوت تلقائيًا عند فتح الصفحة' }),
            ],
            correctIndex: 1,
            explanation: t('trainingM6Q3Exp', { defaultValue: 'التشغيل ناتج عن فعل المستخدم ومحدود به؛ منع التراكم يحفظ وضوح النطق ويحترم قاعدة عدم التشغيل التلقائي.' }),
          },
        ],
      },
    ],
    [t],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* التخزين قد يكون معطلاً؛ لا نُوقف التعلّم بسببه. */
    }
  }, [state])

  const completedCount = modules.filter((module) => state.completed[module.id] === true).length
  const allComplete = completedCount === modules.length

  useEffect(() => {
    if (!allComplete || state.finishedAt) return
    setState((previous) => ({ ...previous, finishedAt: new Date().toISOString() }))
  }, [allComplete, state.finishedAt])

  function handleCheck(moduleId: string, pointIndex: number, value: boolean) {
    const key = pointKey(moduleId, pointIndex)
    setState((previous) => ({
      ...previous,
      checked: { ...previous.checked, [key]: value },
    }))
  }

  function handleAnswer(moduleId: string, questionIndex: number, optionIndex: number, isCorrect: boolean) {
    const key = questionKey(moduleId, questionIndex)
    setState((previous) => ({
      ...previous,
      answers: { ...previous.answers, [key]: optionIndex },
      correct: { ...previous.correct, [key]: isCorrect },
    }))
  }

  function handleRetry(moduleId: string, questionIndex: number) {
    const key = questionKey(moduleId, questionIndex)
    setState((previous) => {
      const answers = { ...previous.answers }
      const correct = { ...previous.correct }
      delete answers[key]
      delete correct[key]
      return { ...previous, answers, correct }
    })
  }

  function handleComplete(moduleId: string) {
    setState((previous) => ({
      ...previous,
      completed: { ...previous.completed, [moduleId]: true },
    }))
  }

  let dateText = ''
  if (state.finishedAt) {
    const date = new Date(state.finishedAt)
    if (!Number.isNaN(date.getTime())) {
      dateText = new Intl.DateTimeFormat(i18n.resolvedLanguage || 'ar-MA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date)
    }
  }

  return (
    <div className="space-y-5 animate-slide print:space-y-3">
      <section className="card-school p-5 print:border-0 print:shadow-none">
        <div className="flex flex-wrap items-start gap-3">
          <GraduationCap className="mt-1 h-6 w-6 shrink-0 text-brand-600" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-xl font-black sm:text-2xl">
              {t('trainingTitle', { defaultValue: 'برنامج تأهيل المعلمين' })}
            </h1>
            <p className="mt-2 max-w-3xl text-[11px] font-semibold leading-relaxed text-muted">
              {t('trainingSubtitle', { defaultValue: 'ست وحدات قصيرة لتوحيد ممارسات الهوية واللغة والتأليف والتقييم والخصوصية والصوت في معهد الرياض الأقصى.' })}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-black text-content">
              {t('trainingProgressLabel', { defaultValue: 'تقدّم البرنامج' })}
            </p>
            <p className="text-[11px] font-bold text-muted">
              {t('trainingProgressCount', {
                defaultValue: '{{done}} من {{total}} وحدة مكتملة',
                done: completedCount,
                total: modules.length,
              })}
            </p>
          </div>
          <div
            role="progressbar"
            aria-label={t('trainingProgressLabel', { defaultValue: 'تقدّم البرنامج' })}
            aria-valuemin={0}
            aria-valuemax={modules.length}
            aria-valuenow={completedCount}
            className="mt-2 h-3 w-full overflow-hidden rounded-full bg-surface-muted"
          >
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${(completedCount / modules.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {allComplete ? (
        <section
          role="status"
          className="flex flex-wrap items-start gap-3 rounded-card border-2 border-gold-300 bg-gold-50 p-5 dark:border-gold-400/30 dark:bg-gold-400/10"
        >
          <Award className="mt-0.5 h-8 w-8 shrink-0 text-gold-600" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="font-display text-lg font-black text-gold-800 dark:text-gold-200">
              {t('trainingCertificateTitle', { defaultValue: 'شهادة إتمام برنامج تأهيل المعلمين' })}
            </h2>
            <p className="mt-1 text-xs font-bold leading-relaxed text-gold-800 dark:text-gold-200">
              {t('trainingCertificateBody', { defaultValue: 'أتمّ المعلم الوحدات الست بنجاح، والتزم بمعايير الهوية واللغة والتأليف والتقييم والخصوصية والصوت.' })}
            </p>
            <p className="mt-2 text-[11px] font-black text-gold-800 dark:text-gold-200">
              {t('trainingCertificateDate', { defaultValue: 'تاريخ الإتمام: {{date}}', date: dateText })}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-gold-800 dark:text-gold-200">
              {t('trainingCertificateFoot', { defaultValue: 'معهد الرياض الأقصى — توثيق داخلي' })}
            </p>
          </div>
        </section>
      ) : null}

      <section aria-label={t('trainingModulesLabel', { defaultValue: 'وحدات التدريب' })}>
        <h2 className="mb-3 font-display text-base font-black">
          {t('trainingModulesLabel', { defaultValue: 'وحدات التدريب' })}
        </h2>
        <ul className="space-y-3">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              expanded={expandedId === module.id}
              onToggle={() => setExpandedId((current) => (current === module.id ? null : module.id))}
              checked={state.checked}
              answers={state.answers}
              correct={state.correct}
              completed={state.completed[module.id] === true}
              onCheck={handleCheck}
              onAnswer={handleAnswer}
              onRetry={handleRetry}
              onComplete={handleComplete}
            />
          ))}
        </ul>
      </section>

      <section className="card-school p-4 sm:p-5" aria-label={t('trainingDocsTitle', { defaultValue: 'الوثائق المرجعية' })}>
        <h2 className="font-display text-base font-black">
          {t('trainingDocsTitle', { defaultValue: 'الوثائق المرجعية' })}
        </h2>
        <p className="mt-1 text-[11px] font-semibold text-muted">
          {t('trainingDocsNote', { defaultValue: 'توجد هذه الوثائق في مستودع المشروع، ويرجع إليها المعلم عند المراجعة.' })}
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            t('trainingDocReview', { defaultValue: 'وثيقة المراجعة العامة' }),
            t('trainingDocI18n', { defaultValue: 'كتالوج الترجمة (i18n)' }),
            t('trainingDocCurriculum', { defaultValue: 'وحدات المنهج' }),
            t('trainingDocTests', { defaultValue: 'مجموعات الاختبارات' }),
          ].map((doc, index) => (
            <li
              key={index}
              className="flex items-center gap-2 rounded-card border-2 border-line bg-surface-muted p-3 text-xs font-bold text-content"
            >
              <FileText className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
