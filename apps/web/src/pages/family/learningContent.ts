/**
 * Interactive practice content for the parallel learning space.
 *
 * Lessons and units themselves come from the curriculum API. This file only
 * supplies short, teacher-reviewable practice items so that each lesson can be
 * played as a motivating exercise. It is deliberately authored content, not
 * generated student data; extend or replace it with a question-bank API later.
 */
import type { SpeakLocale } from '../../lib/speech'

export interface PracticeQuestion {
  prompt: string
  options: string[]
  answer: number
  explanation: string
  /** Language of the prompt when it is not Arabic; keeps read-aloud voices correct. */
  lang?: SpeakLocale
}

const BANK: Record<string, PracticeQuestion[]> = {
  الرياضيات: [
    {
      prompt: 'ما ناتج 1/2 + 1/4؟',
      options: ['3/4', '2/6', '1/6', '1/2'],
      answer: 0,
      explanation: 'نوحّد المقامات: 2/4 + 1/4 = 3/4.',
    },
    {
      prompt: 'كم يساوي 7 × 8؟',
      options: ['54', '56', '64', '48'],
      answer: 1,
      explanation: '7 × 8 = 56. يمكنك التفكير فيها كـ 7 × (10 − 2) = 70 − 14 = 56.',
    },
    {
      prompt: 'أيّ الكسور أكبر؟',
      options: ['1/3', '1/2', '1/5', '1/4'],
      answer: 1,
      explanation: 'عند تساوي البسط، الكسر الأصغر مقامًا هو الأكبر: 1/2.',
    },
  ],
  'اللغة العربية': [
    {
      prompt: 'ما نوع الجملة: «يقرأُ الطالبُ الكتابَ»؟',
      options: ['جملة اسمية', 'جملة فعلية', 'جملة شرطية', 'جملة استفهامية'],
      answer: 1,
      explanation: 'بدأت بفعل (يقرأ)، فهي جملة فعلية.',
    },
    {
      prompt: 'اختر المرادف الصحيح لكلمة «سعيد»:',
      options: ['حزين', 'مسرور', 'غاضب', 'متعب'],
      answer: 1,
      explanation: 'مسرور تعني سعيد.',
    },
    {
      prompt: 'كم عدد حروف كلمة «المدرسة» دون أداة التعريف؟',
      options: ['4', '5', '6', '7'],
      answer: 1,
      explanation: 'الكلمة دون «ال» هي «مدرسة»: م د ر س ة = 5 حروف.',
    },
  ],
  'اللغة الفرنسية': [
    {
      prompt: 'Comment dit-on «الكتاب» بالفرنسية ؟',
      options: ['livre', 'maison', 'école', 'stylo'],
      answer: 0,
      explanation: '«كتاب» = livre.',
      lang: 'fr',
    },
    {
      prompt: 'Quel est le pluriel de «chat» ?',
      options: ['chats', 'chattes', 'chatons', 'chatet'],
      answer: 0,
      explanation: 'On ajoute la lettre s : chat → chats.',
      lang: 'fr',
    },
    {
      prompt: 'Je ___ étudiant.',
      options: ['est', 'suis', 'es', 'sont'],
      answer: 1,
      explanation: 'Le verbe être se conjugue avec Je : je suis.',
      lang: 'fr',
    },
  ],
  'اللغة الإنجليزية': [
    {
      prompt: 'What is the plural of “book”?',
      options: ['bookes', 'books', 'bookies', 'book'],
      answer: 1,
      explanation: 'Most nouns add -s: book → books.',
      lang: 'en',
    },
    {
      prompt: 'Choose the correct verb: She ___ to school.',
      options: ['go', 'goes', 'going', 'gone'],
      answer: 1,
      explanation: 'With she/he/it in the present simple, add -es: goes.',
      lang: 'en',
    },
    {
      prompt: '“Big” means:',
      options: ['صغير', 'كبير', 'سريع', 'بطيء'],
      answer: 1,
      explanation: '“Big” means large in size — كبير.',
      lang: 'en',
    },
  ],
  'التربية الإسلامية': [
    {
      prompt: 'كم عدد أركان الإسلام؟',
      options: ['4', '5', '6', '3'],
      answer: 1,
      explanation: 'أركان الإسلام خمسة: الشهادتان، الصلاة، الزكاة، الصوم، الحج.',
    },
    {
      prompt: 'ما أول وقت من أوقات الصلاة؟',
      options: ['الفجر', 'الظهر', 'العصر', 'المغرب'],
      answer: 0,
      explanation: 'أول الأوقات هو الفجر.',
    },
  ],
  'النشاط العلمي': [
    {
      prompt: 'أيّ الكائنات تحتاج الماء للبقاء؟',
      options: ['النبات فقط', 'الحيوان فقط', 'كل الكائنات الحية', 'الجمادات'],
      answer: 2,
      explanation: 'جميع الكائنات الحية تحتاج الماء.',
    },
    {
      prompt: 'ما حالة الماء عند 0°مئوية؟',
      options: ['غاز', 'سائل', 'صلب (ثلج)', 'مجهول'],
      answer: 2,
      explanation: 'عند 0°م يتجمد الماء ويصبح ثلجًا.',
    },
  ],
  'التاريخ والجغرافيا': [
    {
      prompt: 'ما عاصمة المغرب؟',
      options: ['الدار البيضاء', 'مراكش', 'الرباط', 'فاس'],
      answer: 2,
      explanation: 'الرباط هي العاصمة الإدارية للمملكة.',
    },
    {
      prompt: 'أيّ بحر يطلّ عليه المغرب من جهة الشمال؟',
      options: ['البحر الأبيض المتوسط', 'البحر الأحمر', 'المحيط الهندي', 'بحر الشمال'],
      answer: 0,
      explanation: 'يطل المغرب على البحر الأبيض المتوسط شمالًا والمحيط الأطلسي غربًا.',
    },
  ],
  الثقافة: [
    {
      prompt: 'أيّ وسيلة فنّية تعتمد على الرسم والألوان؟',
      options: ['الموسيقى', 'الرسم', 'الرقص', 'المسرح'],
      answer: 1,
      explanation: 'الرسم فن بصري يعتمد على الخطوط والألوان.',
    },
  ],
  'أنشطة فنية': [
    {
      prompt: 'أيّ لونين يعطيان اللون الأخضر عند مزجهما؟',
      options: ['أحمر + أصفر', 'أزرق + أصفر', 'أحمر + أزرق', 'أبيض + أسود'],
      answer: 1,
      explanation: 'الأزرق والأصفر يعطيان الأخضر.',
    },
  ],
  'تربية بدنية': [
    {
      prompt: 'كم دقيقة يُنصح بها للنشاط البدني اليومي للأطفال؟',
      options: ['10 دقائق', '30 دقيقة', '60 دقيقة', 'ساعتان'],
      answer: 2,
      explanation: 'التوصية الشائعة هي نحو 60 دقيقة نشاطًا يوميًا.',
    },
  ],
}

const GENERIC: PracticeQuestion[] = [
  {
    prompt: 'أيّ العبارات تساعد على التعلّم الفعّال؟',
    options: [
      'قراءة الدرس ثم تلخيصه بأسلوبي',
      'الانتظار حتى اليوم الأخير',
      'تكرار النص دون فهم',
      'تجنّب الأسئلة',
    ],
    answer: 0,
    explanation: 'التلخيص بأسلوبك يساعد على فهم الدرس وتذكّره.',
  },
  {
    prompt: 'ماذا نفعل عندما لا نفهم فكرة في الدرس؟',
    options: [
      'نتخطّاها تمامًا',
      'نسأل المعلّم أو زميلًا ونحاول مثالًا آخر',
      'نتوقف عن التعلّم',
      'نحفظ الإجابة فقط',
    ],
    answer: 1,
    explanation: 'السؤال ومحاولة مثال جديد من أفضل طرق التغلّب على الصعوبة.',
  },
  {
    prompt: 'ما فائدة مراجعة الدرس في اليوم التالي؟',
    options: ['لا فائدة', 'تثبيت المعلومات', 'إطالة الوقت فقط', 'تغيير المادة'],
    answer: 1,
    explanation: 'المراجعة المبكّرة تثبّت المعلومات في الذاكرة.',
  },
]

/** Returns a stable slice of practice questions for a curriculum subject. */
export function questionsFor(subject?: string | null, seed = 0): PracticeQuestion[] {
  const source = (subject && BANK[subject]) || GENERIC
  if (source.length <= 3) return source
  const start = Math.abs(seed) % source.length
  return [0, 1, 2].map((offset) => source[(start + offset) % source.length])
}

/** Arabic subject-name keys used by the curriculum mapped to central i18n keys. */
const SUBJECT_KEY_MAP: Readonly<Record<string, string>> = {
  الرياضيات: 'subjectMath',
  'اللغة العربية': 'subjectArabic',
  'اللغة الفرنسية': 'subjectFrench',
  'اللغة الإنجليزية': 'subjectEnglish',
  'اللغة الأمازيغية': 'subjectTamazight',
  'التربية الإسلامية': 'subjectIslamic',
  'النشاط العلمي': 'subjectScience',
  'التاريخ والجغرافيا': 'subjectHistoryGeo',
  الثقافة: 'subjectCulture',
  'أنشطة فنية': 'subjectArts',
  'تربية بدنية': 'subjectSport',
}

/**
 * Translates an Arabic subject-name key into the centrally managed i18n label.
 * Unknown keys fall back to the original text so nothing is lost offline.
 */
export function translateSubjectKey(
  key: string,
  t: (k: string, o?: any) => string,
): string {
  const i18nKey = SUBJECT_KEY_MAP[key]
  if (!i18nKey) return key
  try {
    return t(i18nKey, { defaultValue: key }) || key
  } catch {
    return key
  }
}
