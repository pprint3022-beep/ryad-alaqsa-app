/**
 * Enrich the prototype JSON store with real, published lesson content and a
 * small set of extra question-bank items so every lesson can be practised.
 *
 * - v4: ~40 lessonContents keyed to real curriculum lesson ids
 *   (`${curriculumId}:${index}`), including French lower/upper-primary lessons
 *   and Arabic/science/islam/history lessons with fr/en variants. Every base
 *   section can carry an instructive SVG diagram (`mediaType:'image'`).
 * - v5: 12 additional outcome-linked lessons plus a measurable learning-
 *   outcome catalogue (trilingual) stored as `learningOutcomes`.
 * - v6: full curriculum coverage — every declared unit lesson slot gets a
 *   specific topic, six teaching sections, two worked examples, four unique
 *   advisory questions and (for scientific subjects) aligned fr/en variants.
 * - active question-bank items with known-correct answers.
 * - A 15-minute time limit added to two already-published formative assessments.
 * - Every seeded lesson is `status:'published'` and reviewed by the director.
 *
 * Governance: this is demonstration content only. Quizzes stay advisory, no
 * correctIndex is ever exposed by the student APIs, and nothing writes official
 * grades. Scope is enforced by the API layer (student level / teacher levels).
 *
 * Idempotent: guarded by `demoLessonContentSeed`. Running it a second time
 * prints "already seeded" and makes no changes.
 *
 * Run once: node scripts/seed-lesson-content-demo.js
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const lessonTranslations = require('./lesson-content-translations')
const curriculumEnrichment = require('./curriculum-content')

const file = path.join(__dirname, '..', 'backend', 'data.json')
const backupFile = path.join(process.env.TEMP || os.tmpdir(), 'ryad-data-seeded-backup.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))

const createdAt = '2026-11-19T09:00:00Z'
const publishedAt = '2026-11-19T10:00:00Z'
const publishedBy = 'u_dir'

// Real curriculum lesson ids: `${curriculumId}:${index}` (see data.json → curriculum).
const lessonContents = [
  {
    id: 'lc_demo_cur1_0', lessonId: 'cur1:0', curriculumId: 'cur1', levelId: 'l_p4', subjectId: 'sub_math', subject: 'الرياضيات',
    title: 'مفهوم الكسر', intro: 'نتعرف في هذا الدرس على الكسر كجزء من كلٍّ و على طريقتَي قراءته وكتابته.',
    sections: [
      { id: 'sec_lc1_a', heading: 'ماذا الكسر؟', body: 'الكسر يعبّر عن جزء من وحدة مقسّمة إلى أجزاء متساوية. نكتبه بعددين: البسط فوق والمقام تحت، فمثلاً 3/5 يعني ثلاثة أجزاء من خمسة.', mediaType: 'text', mediaUrl: '', durationMin: 4 },
      { id: 'sec_lc1_b', heading: 'قراءة الكسر', body: 'نقرأ 3/5 هكذا: «ثلاثة أخماس». البسط (3) يخبرنا بعدد الأجزاء المأخوذة، والمقام (5) يخبرنا عدد الأجزاء المتساوية في الوحدة.', mediaType: 'text', mediaUrl: '', durationMin: 3 },
    ],
    keyTerms: [
      { term: 'كسر', definition: 'عدد يدل على جزء أو أجزاء من وحدة قُسِّمت إلى أجزاء متساوية.' },
      { term: 'البسط والمقام', definition: 'البسط هو العدد الأعلى ويُعدّ الأجزاء المأخوذة، والمقام هو العدد الأسفل ويُعدّ أجزاء الوحدة.' },
    ],
    workedExamples: [
      { id: 'we_lc1_a', prompt: 'قسّم دائرة إلى 4 أجزاء متساوية ولوّن 3 منها. ما الكسر الذي يمثّل الجزء الملوّن؟', steps: ['نعدّ أجزاء الدائرة كلها: 4 · المقام = 4', 'نعدّ الأجزاء الملوّنة: 3 · البسط = 3', 'نكتب الكسر: 3/4'], answer: '3/4' },
    ],
    quizQuestionIds: ['qb_content_1', 'qb_demo1'], estimatedMinutes: 12, difficulty: 'easy',
    prerequisites: [], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_cur1_1', lessonId: 'cur1:1', curriculumId: 'cur1', levelId: 'l_p4', subjectId: 'sub_math', subject: 'الرياضيات',
    title: 'مقارنة الكسور', intro: 'نتعلّم كيف نقارن كسرين لهما المقام نفسه أو مقامات مختلفة.',
    sections: [
      { id: 'sec_lc2_a', heading: 'نفس المقام', body: 'إذا كان الكسران متساويين في المقام نقارن البسطين فقط: الأكبر بسطًا هو الأكبر قيمةً، فمثلاً 3/7 أكبر من 2/7.', mediaType: 'text', mediaUrl: '', durationMin: 3 },
      { id: 'sec_lc2_b', heading: 'مقامات مختلفة', body: 'نوحّد المقامين أولاً بمضاعفة مناسبة ثم نقارن البسطين. يمكن أيضاً استخدام خط الأعداد لتمثيل كل كسر.', mediaType: 'image', mediaUrl: '', durationMin: 4 },
    ],
    keyTerms: [
      { term: 'مقام مشترك', definition: 'مضاعف مشترك للمقامين نستخدمه لتحويل الكسرين إلى كسرين متساويين في المقام.' },
    ],
    workedExamples: [
      { id: 'we_lc2_a', prompt: 'قارن 1/2 و 1/4.', steps: ['نوحّد المقام: 1/2 = 2/4', 'نقارن: 2/4 أكبر من 1/4', 'إذن 1/2 أكبر من 1/4'], answer: '1/2 > 1/4' },
    ],
    quizQuestionIds: ['qb_content_2', 'qb_demo2', 'qb_demo3'], estimatedMinutes: 15, difficulty: 'medium',
    prerequisites: ['cur1:0'], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_cur2_0', lessonId: 'cur2:0', curriculumId: 'cur2', levelId: 'l_p4', subjectId: 'sub_ar', subject: 'اللغة العربية',
    title: 'نص قرائي', intro: 'نقرأ نصاً قصيراً ونحدّد فكرته الرئيسة والأفكار الفرعية فيه.',
    sections: [
      { id: 'sec_lc3_a', heading: 'القراءة المتمهلة', body: 'نقرأ النص مرّة لفهم معناه العام، ثم مرّة ثانية لتحديد الكلمات المفتاحية وربط الجمل ببعضها.', mediaType: 'text', mediaUrl: '', durationMin: 5 },
      { id: 'sec_lc3_b', heading: 'الفكرة الرئيسة', body: 'الفكرة الرئيسة هي المعنى الذي يدور حوله النص كله، وغالباً نجدها في الجملة الأولى أو الأخيرة.', mediaType: 'text', mediaUrl: '', durationMin: 4 },
    ],
    keyTerms: [
      { term: 'الفكرة الرئيسة', definition: 'المعنى الأساسي الذي يعبر عنه النص بأكمله.' },
      { term: 'الفكرة الفرعية', definition: 'تفصيل أو مثال يخدم الفكرة الرئيسة ويوضّحها.' },
    ],
    workedExamples: [
      { id: 'we_lc3_a', prompt: 'نص: «يستيقظ سامي مبكراً، يذّر أسنانه، ثم يذهب إلى المدرسة.» ما الفكرة الرئيسة؟', steps: ['نقرأ الجمل كلها', 'نلاحظ أنها كلها عن صباح سامي', 'نلخّص: استعداد سامي لذهابه إلى المدرسة'], answer: 'استعداد سامي صباحاً للذهاب إلى المدرسة' },
    ],
    quizQuestionIds: ['qb_content_3'], estimatedMinutes: 14, difficulty: 'easy',
    prerequisites: [], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_cur2_1', lessonId: 'cur2:1', curriculumId: 'cur2', levelId: 'l_p4', subjectId: 'sub_ar', subject: 'اللغة العربية',
    title: 'استخراج الأفكار', intro: 'نتدرب على استخراج الأفكار من فقرة وترتيبها في خريطة ذهنية.',
    sections: [
      { id: 'sec_lc4_a', heading: 'تحديد الكلمات المفتاحية', body: 'نضع خطاً تحت الكلمات التي تتكرر أو تحمل المعنى الأساسي، فهي دليلنا إلى أفكار الفقرة.', mediaType: 'text', mediaUrl: '', durationMin: 4 },
      { id: 'sec_lc4_b', heading: 'تنظيم الأفكار', body: 'نكتب الفكرة الرئيسة في الوسط، ثم نفرّع منها الأفكار الفرعية والأمثلة في خريطة ذهنية.', mediaType: 'image', mediaUrl: '', durationMin: 4 },
    ],
    keyTerms: [{ term: 'خريطة ذهنية', definition: 'رسم يوضّح الفكرة الرئيسة والأفكار المتفرّعة عنها.' }],
    workedExamples: [],
    quizQuestionIds: [], estimatedMinutes: 10, difficulty: 'medium',
    prerequisites: ['cur2:0'], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_p2math_0', lessonId: 'cur_l_p2_sub_math:0', curriculumId: 'cur_l_p2_sub_math', levelId: 'l_p2', subjectId: 'sub_math', subject: 'الرياضيات',
    title: 'الأعداد حتى 1000', intro: 'نقرأ الأعداد حتى 1000 ونكتبها ونقارنها.',
    sections: [
      { id: 'sec_lc5_a', heading: 'قراءة الأعداد', body: 'العدد 345 يُقرأ «ثلاثمئة وخمسة وأربعون»: 3 مئات و 4 عشرات و 5 آحاد.', mediaType: 'text', mediaUrl: '', durationMin: 4 },
    ],
    keyTerms: [{ term: 'القيمة المكانية', definition: 'قيمة الرقم بحسب مكانه: آحاد، عشرات، مئات.' }],
    workedExamples: [
      { id: 'we_lc5_a', prompt: 'ما العدد الذي يتكوّن من 4 مئات و 2 عشرات و 7 آحاد؟', steps: ['4 مئات = 400', '2 عشرات = 20', '7 آحاد = 7', 'المجموع = 427'], answer: '427' },
    ],
    quizQuestionIds: ['qb_demo6'], estimatedMinutes: 11, difficulty: 'easy',
    prerequisites: [], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_p2math_1', lessonId: 'cur_l_p2_sub_math:1', curriculumId: 'cur_l_p2_sub_math', levelId: 'l_p2', subjectId: 'sub_math', subject: 'الرياضيات',
    title: 'الضرب', intro: 'نفهم الضرب كجمع متكرر ونتدرب على جدول الضرب.',
    sections: [
      { id: 'sec_lc6_a', heading: 'الضرب جمع متكرر', body: '3 × 4 تعني ثلاث مرات أربعة، أي 4 + 4 + 4 = 12. العلامة × تختصر الجمع المتكرر.', mediaType: 'text', mediaUrl: '', durationMin: 5 },
    ],
    keyTerms: [{ term: 'الضرب', definition: 'عملية حسابية تختصر جمع العدد نفسه عدّة مرات.' }],
    workedExamples: [
      { id: 'we_lc6_a', prompt: 'كم يساوي 6 × 3؟', steps: ['نجمع 3 ست مرات: 3+3+3+3+3+3', 'الناتج = 18'], answer: '18' },
    ],
    quizQuestionIds: ['qb_content_4', 'qb_demo6'], estimatedMinutes: 13, difficulty: 'medium',
    prerequisites: ['cur_l_p2_sub_math:0'], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_pre_sci_0', lessonId: 'cur4:0', curriculumId: 'cur4', levelId: 'l_pre', subjectId: 'sub_sci', subject: 'النشاط العلمي',
    title: 'الحواس', intro: 'نتعرّف على الحواس الخمس ووظيفة كل واحدة منها.',
    sections: [
      { id: 'sec_lc7_a', heading: 'حواسنا الخمس', body: 'نرى بالعين، ونسمع بالأذن، ونشمّ بالأنف، ونتذوّق باللسان، ونلمس بالجلد. كل حاسّة تخبرنا عن شيء مختلف.', mediaType: 'image', mediaUrl: '', durationMin: 4 },
    ],
    keyTerms: [{ term: 'الحاسّة', definition: 'عضو يساعدنا على معرفة ما يحدث من حولنا.' }],
    workedExamples: [
      { id: 'we_lc7_a', prompt: 'أي حاسّة نستخدم لرؤية لون التفاحة؟', steps: ['اللون يُرى', 'الرؤية وظيفتها العين (البصر)'], answer: 'البصر' },
    ],
    quizQuestionIds: ['qb_content_5'], estimatedMinutes: 10, difficulty: 'easy',
    prerequisites: [], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_pre_ar_0', lessonId: 'cur5:0', curriculumId: 'cur5', levelId: 'l_pre', subjectId: 'sub_ar', subject: 'اللغة العربية',
    title: 'درس 1 — حروف الهجاء', intro: 'نتعلّم بعض حروف الهجاء ونلفظها ونكتبها.',
    sections: [
      { id: 'sec_lc8_a', heading: 'نتعلّم الحروف', body: 'الحرف هو أصغر وحدة في الكلمة. نتعلّم اليوم حروف: أ، ب، ت، ث ونلفظ كل حرف على حدة.', mediaType: 'text', mediaUrl: '', durationMin: 4 },
    ],
    keyTerms: [{ term: 'الحرف', definition: 'أصغر وحدة كتابية تتكوّن منها الكلمات.' }],
    workedExamples: [],
    quizQuestionIds: ['qb_demo7'], estimatedMinutes: 9, difficulty: 'easy',
    prerequisites: [], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_p2_fr_0', lessonId: 'cur3:0', curriculumId: 'cur3', levelId: 'l_p2', subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
    title: 'Alphabet', intro: 'Découvrons les lettres de l’alphabet français et leurs sons.',
    sections: [
      { id: 'sec_lc9_a', heading: 'Les lettres', body: 'L’alphabet français compte 26 lettres. Chaque lettre a un nom et un son : A, B, C, D…', mediaType: 'text', mediaUrl: '', durationMin: 4 },
    ],
    keyTerms: [{ term: 'une lettre', definition: 'Le plus petit élément écrit d’un mot.' }],
    workedExamples: [],
    quizQuestionIds: ['qb_content_8'], estimatedMinutes: 10, difficulty: 'easy',
    prerequisites: [], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_p4_isl_0', lessonId: 'cur_l_p4_sub_isl:0', curriculumId: 'cur_l_p4_sub_isl', levelId: 'l_p4', subjectId: 'sub_isl', subject: 'التربية الإسلامية',
    title: 'الزكاة', intro: 'نتعلّم ما الزكاة ولماذا فُرضت في الإسلام.',
    sections: [
      { id: 'sec_lc10_a', heading: 'ما الزكاة؟', body: 'الزكاة عبادة مالية فُرضت على المسلمين، يُخرجون منها جزءاً من أموالهم إلى الفقراء والمحتاجين، فتطهّر المال وتقوي روابط المجتمع.', mediaType: 'text', mediaUrl: '', durationMin: 5 },
    ],
    keyTerms: [{ term: 'الزكاة', definition: 'عبادة مالية بإخراج جزء محدد من المال إلى مستحقيها.' }],
    workedExamples: [],
    quizQuestionIds: ['qb_content_6'], estimatedMinutes: 11, difficulty: 'medium',
    prerequisites: [], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_p4_sci_0', lessonId: 'cur_l_p4_sub_sci:0', curriculumId: 'cur_l_p4_sub_sci', levelId: 'l_p4', subjectId: 'sub_sci', subject: 'النشاط العلمي',
    title: 'المواد', intro: 'نميّز بين المواد الصلبة والسائلة والغازية من حولنا.',
    sections: [
      { id: 'sec_lc11_a', heading: 'حالات المادة', body: 'المادة قد تكون صلبة كالحجر، أو سائلة كالماء، أو غازية كالهواء. لكل حالة شكل وخصائص مختلفة.', mediaType: 'image', mediaUrl: '', durationMin: 5 },
    ],
    keyTerms: [{ term: 'المادة', definition: 'كل ما له كتلة ويشغل حيّزاً.' }],
    workedExamples: [
      { id: 'we_lc11_a', prompt: 'أيّ هذه المواد صلبة: الماء، الحجر، الهواء؟', steps: ['الماء سائل', 'الهواء غاز', 'الحجر له شكل ثابت إذن هو صلب'], answer: 'الحجر' },
    ],
    quizQuestionIds: ['qb_content_7'], estimatedMinutes: 12, difficulty: 'easy',
    prerequisites: [], status: 'published', createdAt, publishedAt, publishedBy,
  },
  {
    id: 'lc_demo_p4_fr_0', lessonId: 'cur_l_p4_sub_fr:0', curriculumId: 'cur_l_p4_sub_fr', levelId: 'l_p4', subjectId: 'sub_fr', subject: 'اللغة الفرنسية',
    title: 'Texte', intro: 'Lisons un court texte et répondons à des questions de compréhension.',
    sections: [
      { id: 'sec_lc12_a', heading: 'Comprendre un texte', body: 'Pour comprendre un texte, on lit lentement, on repère les mots-clés et on cherche l’idée principale de chaque paragraphe.', mediaType: 'text', mediaUrl: '', durationMin: 5 },
    ],
    keyTerms: [{ term: 'l’idée principale', definition: 'Le sens essentiel que le texte veut transmettre.' }],
    workedExamples: [],
    quizQuestionIds: ['qb_demo4', 'qb_demo5'], estimatedMinutes: 13, difficulty: 'medium',
    prerequisites: [], status: 'published', createdAt, publishedAt, publishedBy,
  },
]

/**
 * v2 enrichment: three distinct, non-repetitive sections per lesson
 * (real-life use, a method/rule, and a short "try it yourself" task) plus
 * playful emoji icons, so the player feels like a children's learning game.
 * Kept here (not only in data.json) so a clean reseed reproduces 52 sections.
 */
const EXTRA_SECTIONS = {
  lc_demo_cur1_0: [
    { heading: 'الكسر حولنا', icon: '🍞', body: 'قسّمت أمينة شطيرة إلى نصفين فأعطت أختها نصفها: 1/2. ولو قسّمتها إلى أربعة أجزاء فلكل واحد 1/4. ربع الساعة يساوي 15 دقيقة.' },
    { heading: 'خطوات كتابة الكسر', icon: '✏️', body: '١) عُدّ كل الأجزاء المتساوية واكتبها تحت الخط (المقام).\n٢) عُدّ الأجزاء التي أخذتها واكتبها فوق الخط (البسط).\n٣) اكتب الخط الفاصل بينهما.' },
    { heading: 'جرّب بنفسك', icon: '🎨', body: 'دائرة مقسّمة إلى 8 أجزاء متساوية، لوّنتَ منها 3 أجزاء. ما الكسر الذي لوّنته؟ (الجواب: 3/8)' },
  ],
  lc_demo_cur1_1: [
    { heading: 'قارن بالصورة', icon: '📏', body: 'ارسم مستطيلين متساويين: قسّم الأول إلى جزأين والثاني إلى أربعة، ولوّن 1/2 و1/4. سترى أن نصف المستطيل أكبر من ربعه، فـ 1/2 > 1/4.' },
    { heading: 'قاعدة سريعة', icon: '⚡', body: 'عند تساوي البسطين، فالأصغر مقامًا هو الأكبر قيمةً: 1/3 أكبر من 1/6 لأن الثلث أكبر من السدس.' },
    { heading: 'جرّب بنفسك', icon: '🎯', body: 'رتّب من الأصغر إلى الأكبر: 1/6 ، 1/3 ، 1/2. (الجواب: 1/6 < 1/3 < 1/2)' },
  ],
  lc_demo_cur2_0: [
    { heading: 'قبل القراءة', icon: '👀', body: 'انظر إلى العنوان والصورة، وتوقّع عمّن أو عمّا سيتحدث النص. التوقّع قبل القراءة يساعدك على الفهم.' },
    { heading: 'أسئلة الفهم', icon: '❓', body: 'بعد القراءة اسأل نفسك: مَن؟ ماذا؟ أين؟ متى؟ لماذا؟ أجب بجمل قصيرة، وعد إلى النص حين تحتاج إلى دليل.' },
    { heading: 'جرّب بنفسك', icon: '🌳', body: 'اقرأ: «في الصباح ذهبت سارة إلى الحديقة مع أخيها، ولعبت بالكرة تحت الشجرة.» أين لعبت سارة؟ (الجواب: تحت الشجرة في الحديقة)' },
  ],
  lc_demo_cur2_1: [
    { heading: 'كلمات الربط', icon: '🔗', body: 'كلمات مثل «أولًا» و«ثم» و«لذلك» و«لأن» تدل على ترتيب الأفكار وعلاقتها بعضها ببعض؛ انتبه لها أثناء القراءة.' },
    { heading: 'من الفكرة إلى المثال', icon: '📝', body: 'بعد أن تكتب الفكرة الرئيسة، ابحث في النص عن مثال أو تفصيل يوضّحها،ضعه تحتها مباشرة في الخريطة.' },
    { heading: 'جرّب بنفسك', icon: '🧼', body: 'في نص عن النظافة، اذكر فكرة فرعية تدعم «النظافة تحمينا من المرض». (مثال: غسل اليدين قبل الأكل)' },
  ],
  lc_demo_p2math_0: [
    { heading: 'أيّهما أكبر؟', icon: '🔢', body: 'قارن المئات أولًا، فإن تساوت قارن العشرات، فإن تساوت قارن الآحاد. لذلك 410 أكبر من 399 رغم أن 9 أكبر من 1.' },
    { heading: 'العدّ بالقفزات', icon: '⏭️', body: 'تدرّب على العدّ بـ 10: 290، 300، 310، 320... وبـ 100: 700، 800، 900، 1000.' },
    { heading: 'جرّب بنفسك', icon: '🎯', body: 'ما العدد الذي يأتي مباشرة بعد 699؟ وما العدد الذي قبله؟ (الجواب: 700 و 698)' },
  ],
  lc_demo_p2math_1: [
    { heading: 'مجموعات متساوية', icon: '🍎', body: 'لديك 4 أكياس، في كل كيس 3 تفاحات. كل كيس مجموعة متساوية، وعدد التفاحات = 4 × 3 = 12.' },
    { heading: 'حساب أسهل', icon: '⚡', body: 'ابدأ بحفظ 1× و2× و5× و10×؛ فمثلًا 5 × 7 هو نصف 10 × 7، أي 35.' },
    { heading: 'جرّب بنفسك', icon: '🧮', body: 'كم تفاحة في 5 أكياس، في كل كيس 3 تفاحات؟ (الجواب: 5 × 3 = 15)' },
  ],
  lc_demo_pre_sci_0: [
    { heading: 'كيف نحمي حواسنا؟', icon: '🛡️', body: 'لا ننظر إلى الشمس مباشرة، ولا نضع أشياء حادّة في الأذن، ونغسل أيدينا قبل الأكل لنحافظ على حواسنا سليمة.' },
    { heading: 'تجربة صغيرة', icon: '🍎', body: 'غمض عينيك واطلب من صديق أن يناولك تفاحة؛ ستعرفها بالشمّ واللمس والتذوّق دون أن تراها.' },
    { heading: 'جرّب بنفسك', icon: '🌸', body: 'أيّ حاسّة تستخدم لتعرف أن الورد عَطِر؟ (الجواب: حاسّة الشمّ)' },
  ],
  lc_demo_pre_ar_0: [
    { heading: 'للحرف شكل وصوت', icon: '🔤', body: 'للحرف شكل نكتبه وصوت نلفظه. الحرف «ب» نكتبه هكذا، ونقول «بَ»؛ ونضع فوقه ضمّة أو تحته فتحة لتغيير صوته.' },
    { heading: 'حروف جديدة', icon: '✍️', body: 'نتعلّم اليوم الحروف: ج، ح، خ. نلفظ كل حرف بوضوح، ثم نكتبه ثلاث مرات في دفترنا.' },
    { heading: 'جرّب بنفسك', icon: '🚪', body: 'كوّن كلمة من الحروف: ب + ا + ب. (الجواب: باب)' },
  ],
  lc_demo_p2_fr_0: [
    { heading: 'Les sons des lettres', icon: '🔤', body: 'Chaque lettre a un son : A comme «arbre», B comme «ballon», C comme «camion». Écoute le son avant de l’écrire.' },
    { heading: 'Les lettres ensemble', icon: '🧩', body: 'Quand on réunit deux lettres, elles forment une syllabe. Par exemple «au» se prononce comme «o» dans «eau».' },
    { heading: 'Essaie', icon: '🏠', body: 'Quelle lettre commence «maison» ? Et «soleil» ? (Réponse : m et s)' },
  ],
  lc_demo_p4_isl_0: [
    { heading: 'الزكاة والصدقة', icon: '⚖️', body: 'الزكاة عبادة مفروضة بمقدار محدّد، أمّا الصدقة فتطوّع بلا حدّ، وكلتاهما تقرّب العبد من الله.' },
    { heading: 'أثر الزكاة', icon: '🤝', body: 'تجعل صاحب المال شاكرًا لله، وتسدّ حاجة المحتاج، فيصبح المجتمع متكافلًا متحابًّا.' },
    { heading: 'جرّب بنفسك', icon: '💡', body: 'اذكر موقفًا يمكنك فيه مساعدة فقير بجزء من مصروفك اليومي.' },
  ],
  lc_demo_p4_sci_0: [
    { heading: 'خصائص كل حالة', icon: '🧊', body: 'الماء سائل يأخذ شكل الكوب، والحجر صلب يحفظ شكله، والهواء غاز يملأ الغرفة كلها.' },
    { heading: 'تغيّر الحالة', icon: '🌡️', body: 'إذا سخّنا الماء صار بخارًا، وإذا برّدناه صار ثلجًا. الحرارة هي التي تغيّر حالة المادة.' },
    { heading: 'جرّب بنفسك', icon: '💧', body: 'ضع مكعب ثلج في كوب وانتظر قليلًا؛ ماذا يحدث؟ (الجواب: يذوب ويصير ماءً سائلًا)' },
  ],
  lc_demo_p4_fr_0: [
    { heading: 'Avant de lire', icon: '👀', body: 'Regarde le titre et les images : devine de quoi parle le texte avant de commencer la lecture.' },
    { heading: 'Les mots de liaison', icon: '🔗', body: 'Les mots «d’abord», «puis», «enfin» et «parce que» montrent l’ordre des idées et leur raison.' },
    { heading: 'Essaie', icon: '🎒', body: 'Lis : «Ce matin, Léa va à l’école avec son frère. Elle porte un sac bleu.» Où va Léa ? (Réponse : à l’école)' },
  ],
}

const ICON_BY_HEADING = [
  [/كس|مقام|بسط/, '🧮'], [/قراء|نص|حروف|lettres|sons/i, '📖'],
  [/فكرة|أفكار|كلمات|idée/i, '💡'], [/عدد|مئات|ضرب|collect|مجموعات/i, '🔢'],
  [/حواس|حاسّة/, '👁️'], [/زكاة/, '🤲'], [/مادة|حالة/, '🧪'],
  [/Comprendre|texte/i, '📖'], [/القراءة المتمهلة/, '📖'],
]
function iconFor(heading) {
  for (const [re, icon] of ICON_BY_HEADING) if (re.test(heading || '')) return icon
  return '📚'
}
// Two overlap cases fixed explicitly so icons never repeat within one lesson.
const ICON_OVERRIDES = {
  lc_demo_cur1_1: { 'مقامات مختلفة': '📐' },
  lc_demo_cur2_1: { 'تنظيم الأفكار': '🗺️' },
}
function enrichSections(list) {
  for (const c of list) {
    c.sections = c.sections || []
    for (const s of c.sections) {
      s.icon = ICON_OVERRIDES[c.id]?.[s.heading] || s.icon || iconFor(s.heading)
      if (s.mediaType === undefined) s.mediaType = 'text'
    }
    for (const extra of (EXTRA_SECTIONS[c.id] || [])) {
      if (c.sections.some((s) => s.heading === extra.heading)) continue
      c.sections.push({
        id: `${c.id}_sec_${c.sections.length + 1}`,
        heading: extra.heading,
        body: extra.body,
        icon: extra.icon,
        mediaType: 'text',
        mediaUrl: '',
        durationMin: 2,
      })
    }

    // Scientific lessons are available in Arabic (base), French and English.
    // Icons, ids and media metadata are inherited from the base sections so
    // the three versions remain structurally identical for the player.
    const variants = lessonTranslations[c.id]
    if (variants) {
      c.translations = {}
      for (const [lang, tr] of Object.entries(variants)) {
        c.translations[lang] = {
          title: tr.title,
          intro: tr.intro,
          sections: tr.sections.map((s, i) => ({
            ...s,
            id: c.sections[i]?.id || `${c.id}_${lang}_sec_${i + 1}`,
            icon: c.sections[i]?.icon || '📚',
            mediaType: c.sections[i]?.mediaType || 'text',
            mediaUrl: c.sections[i]?.mediaUrl || '',
            durationMin: c.sections[i]?.durationMin || 2,
          })),
          keyTerms: tr.keyTerms.map((k) => ({ term: k.term, definition: k.definition })),
          workedExamples: tr.workedExamples.map((w, i) => ({
            ...w,
            id: c.workedExamples[i]?.id || `${c.id}_${lang}_we_${i + 1}`,
          })),
        }
      }
    }
  }
  return list
}

// Extra active questions so each lesson has enough items to practise.
const newQuestions = [
  { id: 'qb_content_1', levelId: 'l_p4', subjectId: 'sub_math', term: 'الفصل 1', difficulty: 'easy', prompt: 'ما هو البسط في الكسر 3/5؟', options: ['3', '5', '8', '2'], correctIndex: 0, skill: 'الكسور', explanation: 'البسط هو العدد الأعلى في الكسر، وهو هنا 3.' },
  { id: 'qb_content_2', levelId: 'l_p4', subjectId: 'sub_math', term: 'الفصل 1', difficulty: 'easy', prompt: 'أيّ كسر أكبر: 1/2 أم 1/4؟', options: ['1/2', '1/4', 'متساويان', 'لا يمكن المقارنة'], correctIndex: 0, skill: 'مقارنة الكسور', explanation: '1/2 = 2/4 وهو أكبر من 1/4.' },
  { id: 'qb_content_3', levelId: 'l_p4', subjectId: 'sub_ar', term: 'الفصل 1', difficulty: 'medium', prompt: 'ما المقصود بالفكرة الرئيسة في النص؟', options: ['أول كلمة فيه', 'المعنى الأساسي الذي يدور حوله النص', 'عدد جمل النص', 'اسم الكاتب'], correctIndex: 1, skill: 'فهم المقروء', explanation: 'الفكرة الرئيسة هي المعنى الأساسي الذي يعبّر عنه النص كله.' },
  { id: 'qb_content_4', levelId: 'l_p2', subjectId: 'sub_math', term: 'الفصل 1', difficulty: 'easy', prompt: 'كم يساوي 6 × 3؟', options: ['18', '9', '24', '12'], correctIndex: 0, skill: 'الضرب', explanation: '6 × 3 = 18.' },
  { id: 'qb_content_5', levelId: 'l_pre', subjectId: 'sub_sci', term: 'الفصل 1', difficulty: 'easy', prompt: 'أيّ حاسّة نستخدمها لرؤية الألوان؟', options: ['البصر', 'السمع', 'اللمس', 'الذوق'], correctIndex: 0, skill: 'الحواس', explanation: 'رؤية الألوان وظيفة العين، أي حاسّة البصر.' },
  { id: 'qb_content_6', levelId: 'l_p4', subjectId: 'sub_isl', term: 'الفصل 1', difficulty: 'medium', prompt: 'ما الزكاة؟', options: ['عبادة مالية تُخرج إلى مستحقيها', 'نوع من الصلاة', 'صيام تطوعي', 'زيارة الأقارب'], correctIndex: 0, skill: 'العبادات', explanation: 'الزكاة عبادة مالية يُخرج فيها جزء من المال إلى الفقراء والمحتاجين.' },
  { id: 'qb_content_7', levelId: 'l_p4', subjectId: 'sub_sci', term: 'الفصل 1', difficulty: 'easy', prompt: 'أيّ مادة مما يلي صلبة؟', options: ['الماء', 'الحجر', 'الهواء', 'الحليب'], correctIndex: 1, skill: 'حالات المادة', explanation: 'الحجر مادة صلبة، أما الماء والحليب فسائلان والهواء غاز.' },
  { id: 'qb_content_8', levelId: 'l_p2', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'easy', prompt: 'Quelle est la couleur du ciel ?', options: ['Bleu', 'Rouge', 'Vert', 'Jaune'], correctIndex: 0, skill: 'Les couleurs', explanation: 'Le ciel est bleu.' },
].map((q) => ({ ...q, status: 'active', createdAt, createdBy: 'u_t1' }))

function writeStore() {
  const json = JSON.stringify(db, null, 2) + '\n'
  fs.writeFileSync(file, json, 'utf8')
  if (fs.existsSync(backupFile)) {
    fs.writeFileSync(backupFile, json, 'utf8')
    console.log(`synced seeded backup: ${backupFile}`)
  }
}

// v4 enrichment: register the new lessons' fr/en variants in the central map
// BEFORE enrichment, so `enrichSections` can inherit each section's id, icon
// and media metadata from the base text (required for the illustrated diagrams
// and the language badge to work in every language).
Object.assign(lessonTranslations, curriculumEnrichment.translations)

if (db.demoLessonContentSeed === 'v6') {
  console.log('lesson content demo data already seeded (v6)')
} else {
  db.lessonContents = enrichSections(lessonContents)

  // Add the extra questions, skipping any id that already exists (defensive).
  db.questionBank = db.questionBank || []
  const existingIds = new Set(db.questionBank.map((q) => q.id))
  let addedQuestions = 0
  for (const q of newQuestions) {
    if (!existingIds.has(q.id)) { db.questionBank.push(q); addedQuestions++ }
  }

  // Add a 15-minute advisory time limit to two published assessments, but only
  // where the field is missing so a re-run/manual edit is never overwritten.
  let timeLimited = 0
  for (const f of (db.formativeAssessments || [])) {
    if (f.id === 'fa_demo1' || f.id === 'fa_demo2') {
      if (f.timeLimitSeconds === undefined) { f.timeLimitSeconds = 900; timeLimited++ }
    }
  }

  // v4/v5: append the additional curriculum lessons (French lower/upper
  // primary, Arabic/science/islam/history and v5 outcome-linked lessons).
  // Idempotent by content id so a re-run on an older store can never duplicate
  // a lesson.
  const existingContentIds = new Set(db.lessonContents.map((c) => c.id))
  const coveredLessonIds = new Set(db.lessonContents.map((c) => c.lessonId))
  const addedV6LessonIds = new Set()
  let addedContents = 0
  for (const content of enrichSections(curriculumEnrichment.lessonContents)) {
    if (existingContentIds.has(content.id)) continue
    // v6 is authoritative for coverage: never create a second content record
    // for a lesson slot that v4/v5 already teaches.
    if (String(content.id).startsWith('lc_v6_') && coveredLessonIds.has(content.lessonId)) continue
    content.createdAt = createdAt
    content.publishedAt = publishedAt
    content.publishedBy = publishedBy
    db.lessonContents.push(content)
    existingContentIds.add(content.id)
    coveredLessonIds.add(content.lessonId)
    if (String(content.id).startsWith('lc_v6_')) addedV6LessonIds.add(content.lessonId)
    addedContents++
  }

  const existingQuestionIds = new Set(db.questionBank.map((q) => q.id))
  let addedCurriculumQuestions = 0
  for (const q of curriculumEnrichment.questions) {
    if (existingQuestionIds.has(q.id)) continue
    // Skip practice items belonging to a v6 lesson whose content was skipped.
    const v6Match = /^q_v6_(.+)_(\d+)_(\d+)$/.exec(q.id)
    if (v6Match && !addedV6LessonIds.has(`${v6Match[1]}:${v6Match[2]}`)) continue
    db.questionBank.push({ ...q, status: 'active', createdAt, createdBy: 'u_t1' })
    existingQuestionIds.add(q.id)
    addedCurriculumQuestions++
  }

  // v6: replace generic placeholder lesson names ("درس 1", "Leçon 1", …)
  // with the concrete topic actually taught in each slot. Legacy v4/v5
  // content keeps its curated title so the curriculum and player agree.
  let renamedLessons = 0
  const legacyTitleByLessonId = new Map(
    (db.lessonContents || [])
      .filter((c) => !String(c.id).startsWith('lc_v6_'))
      .map((c) => [c.lessonId, c.title]),
  )
  for (const unit of db.curriculum || []) {
    unit.lessons = (unit.lessons || []).map((oldTitle, index) => {
      const lessonId = `${unit.id}:${index}`
      const next = legacyTitleByLessonId.get(lessonId)
        || curriculumEnrichment.titleByLessonId?.[lessonId]
        || oldTitle
      if (next !== oldTitle) renamedLessons++
      return next
    })
  }

  // v5: measurable, trilingual learning outcomes. Idempotent by code.
  db.learningOutcomes = db.learningOutcomes || []
  const existingOutcomeCodes = new Set(db.learningOutcomes.map((o) => o.code))
  let addedOutcomes = 0
  for (const outcome of curriculumEnrichment.outcomes || []) {
    if (existingOutcomeCodes.has(outcome.code)) continue
    db.learningOutcomes.push(outcome)
    existingOutcomeCodes.add(outcome.code)
    addedOutcomes++
  }

  db.demoLessonContentSeed = 'v6'
  writeStore()
  const sectionCount = db.lessonContents.reduce((n, c) => n + (c.sections?.length || 0), 0)
  const translated = db.lessonContents.filter((c) => c.translations && c.translations.fr && c.translations.en).length
  const illustrated = db.lessonContents.filter((c) => (c.sections || []).some((s) => s.mediaType === 'image' && s.mediaUrl)).length
  const covered = new Set(db.lessonContents.map((c) => c.lessonId)).size
  const declared = (db.curriculum || []).reduce((n, c) => n + (c.lessons || []).length, 0)
  console.log(`seeded ${db.lessonContents.length} lesson contents (${sectionCount} sections, ${translated} trilingual, ${illustrated} illustrated), ${covered}/${declared} curriculum slots, +${addedContents} enrichment lessons, ${addedQuestions + addedCurriculumQuestions} questions, ${addedOutcomes} learning outcomes, ${renamedLessons} renamed lessons, ${timeLimited} assessment time limits`)
}
