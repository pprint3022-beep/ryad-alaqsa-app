/**
 * Enrich the prototype JSON store with demonstrative structured lesson plans.
 *
 * - 6 plans layered on existing curriculum units (cur1, cur_l_p4_sub_sci, ...).
 * - Levels l_p4, l_p2 and l_pre — the levels covered by teacher u_t1's classes
 *   (c_p4a, c_p2b, c_pre_a) — so every seeded plan is inside that teacher's scope.
 * - 2 published (with publishedAt + reviewedBy), 1 in_review and 3 draft.
 * - Every timestamp is built with Date#toISOString so it is a valid ISO value.
 *
 * Idempotent: guarded by `demoLessonEditorSeed`.
 *
 * Run once: node scripts/seed-lesson-editor-demo.js
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

const file = path.join(__dirname, '..', 'backend', 'data.json')
const backupFile = path.join(process.env.TEMP || os.tmpdir(), 'ryad-data-seeded-backup.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))

const iso = (value) => new Date(value).toISOString()

const lessonPlans = [
  {
    id: 'lp_demo_p4_math_pub',
    curriculumId: 'cur1',
    levelId: 'l_p4',
    subjectId: 'sub_math',
    unit: 'الكسور',
    lessonTitle: 'مفهوم الكسر',
    term: 'الفصل 1',
    status: 'published',
    objectives: [
      'يتعرف المتعلم على الكسر كجزء من كل مقسّم إلى أجزاء متساوية',
      'يمثّل الكسور البسيطة (1/2، 1/3، 1/4) بصريًا ويسمّيها',
    ],
    activities: [
      { id: 'act_demo_p4m_1', title: 'عرض الكسور بالأشكال', type: 'exploration', description: 'تقسيم أشكال إلى أجزاء متساوية وتمييز الجزء من الكل', durationMinutes: 15 },
      { id: 'act_demo_p4m_2', title: 'تمارين تطبيقية', type: 'practice', description: 'تحديد الكسور من رسومات ومسائل قصيرة', durationMinutes: 20 },
      { id: 'act_demo_p4m_3', title: 'تقييم قصير', type: 'assessment', description: 'ثلاثة أسئلة قصيرة حول مفهوم الكسر', durationMinutes: 10 },
    ],
    differentiation: [
      { id: 'diff_demo_p4m_1', group: 'support', need: 'صعوبة في ربط الجزء بالكل', strategy: 'استخدام مجسمات وألوان مع إشراف فردي' },
      { id: 'diff_demo_p4m_2', group: 'enrichment', need: 'إتقان المفهوم مبكرًا', strategy: 'مسائل مقارنة كسور ذات مقامات مختلفة' },
    ],
    resources: [
      { id: 'res_demo_p4m_1', title: 'بطاقات الكسور المصوّرة', type: 'material', reference: 'مكتبة الوسائل — بطاقات الكسور 1/2 و1/3 و1/4' },
      { id: 'res_demo_p4m_2', title: 'درس الكسور التفاعلي', type: 'library', reference: 'مكتبة المحتوى — وحدة الكسور / الرابع ابتدائي' },
    ],
    competencyIds: ['cr_الرابع_ابتدائي_6'],
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    createdAt: iso('2026-11-10T08:00:00Z'),
    updatedAt: iso('2026-11-12T10:30:00Z'),
    publishedAt: iso('2026-11-12T10:35:00Z'),
    reviewedBy: 'u_dir',
    history: [
      { at: iso('2026-11-10T08:00:00Z'), by: 'u_t1', action: 'created', details: 'خطة درس أنشأها المعلم' },
      { at: iso('2026-11-11T08:00:00Z'), by: 'u_t1', action: 'submitted', details: 'إرسال الخطة للمراجعة' },
      { at: iso('2026-11-12T10:35:00Z'), by: 'u_dir', action: 'published', details: 'اعتماد الخطة ونشرها' },
    ],
  },
  {
    id: 'lp_demo_p4_sci_pub',
    curriculumId: 'cur_l_p4_sub_sci',
    levelId: 'l_p4',
    subjectId: 'sub_sci',
    unit: 'العلوم والتجارب',
    lessonTitle: 'المواد والطاقة',
    term: 'الفصل 1',
    status: 'published',
    objectives: [
      'يميّز المتعلم بين المواد الصلبة والسائلة والغازية',
      'يذكر أمثلة على تحوّل الطاقة في حياته اليومية',
    ],
    activities: [
      { id: 'act_demo_p4s_1', title: 'تجربة تصنيف المواد', type: 'exploration', description: 'تصنيف عيّنات حسب حالتها وتسجيل الملاحظات', durationMinutes: 25 },
      { id: 'act_demo_p4s_2', title: 'لعبة المطابقة', type: 'game', description: 'مطابقة صور المواد بحالاتها في جماعات صغيرة', durationMinutes: 15 },
    ],
    differentiation: [
      { id: 'diff_demo_p4s_1', group: 'all', need: 'تعميم المفهوم على أمثلة متنوعة', strategy: 'خريطة مفاهيم جماعية تُكمل في نهاية الحصة' },
    ],
    resources: [
      { id: 'res_demo_p4s_1', title: 'فيديو تحوّل الطاقة', type: 'link', reference: 'https://example.org/media/energy-transformation' },
      { id: 'res_demo_p4s_2', title: 'دليل التجربة', type: 'file', reference: 'experiments/matter-states.pdf' },
    ],
    competencyIds: ['cr_الرابع_ابتدائي_8'],
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    createdAt: iso('2026-11-08T09:00:00Z'),
    updatedAt: iso('2026-11-11T14:00:00Z'),
    publishedAt: iso('2026-11-11T14:20:00Z'),
    reviewedBy: 'u_dir',
    history: [
      { at: iso('2026-11-08T09:00:00Z'), by: 'u_t1', action: 'created', details: 'خطة درس أنشأها المعلم' },
      { at: iso('2026-11-10T07:30:00Z'), by: 'u_t1', action: 'submitted', details: 'إرسال الخطة للمراجعة' },
      { at: iso('2026-11-11T14:20:00Z'), by: 'u_dir', action: 'published', details: 'اعتماد الخطة ونشرها' },
    ],
  },
  {
    id: 'lp_demo_p2_ar_review',
    curriculumId: 'cur_l_p2_sub_ar',
    levelId: 'l_p2',
    subjectId: 'sub_ar',
    unit: 'القراءة والفهم',
    lessonTitle: 'نص قرائي قصير',
    term: 'الفصل 1',
    status: 'in_review',
    objectives: [
      'يقرأ المتعلم نصًا قصيرًا قراءة سليمة',
      'يستخرج الأفكار الرئيسية من النص',
    ],
    activities: [
      { id: 'act_demo_p2a_1', title: 'قراءة موجهة', type: 'exploration', description: 'قراءة النص مع تحديد الكلمات الجديدة', durationMinutes: 15 },
      { id: 'act_demo_p2a_2', title: 'أسئلة الفهم', type: 'assessment', description: 'إجابات قصيرة عن أفكار النص', durationMinutes: 15 },
    ],
    differentiation: [
      { id: 'diff_demo_p2a_1', group: 'support', need: 'صعوبة في فهم المفردات', strategy: 'قاموس مصوّر ومجموعة قراءة مع المعلّم' },
    ],
    resources: [
      { id: 'res_demo_p2a_1', title: 'النص القرائي', type: 'library', reference: 'مكتبة المحتوى — نصوص الثاني ابتدائي' },
    ],
    competencyIds: ['cr_الثاني_ابتدائي_1'],
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    createdAt: iso('2026-11-15T08:15:00Z'),
    updatedAt: iso('2026-11-16T09:00:00Z'),
    publishedAt: null,
    reviewedBy: null,
    history: [
      { at: iso('2026-11-15T08:15:00Z'), by: 'u_t1', action: 'created', details: 'خطة درس أنشأها المعلم' },
      { at: iso('2026-11-16T09:05:00Z'), by: 'u_t1', action: 'submitted', details: 'إرسال الخطة للمراجعة' },
    ],
  },
  {
    id: 'lp_demo_p2_math_draft',
    curriculumId: 'cur_l_p2_sub_math',
    levelId: 'l_p2',
    subjectId: 'sub_math',
    unit: 'الأعداد والعمليات',
    lessonTitle: 'الضرب في العدد 5',
    term: 'الفصل 1',
    status: 'draft',
    objectives: [
      'يحسب المتعلم نواتج الضرب في العدد 5',
      'يحل مسائل قصيرة تتضمن الضرب في 5',
    ],
    activities: [
      { id: 'act_demo_p2m_1', title: 'جدول الضرب في 5', type: 'practice', description: 'إكمال جدول الضرب في العدد 5', durationMinutes: 20 },
      { id: 'act_demo_p2m_2', title: 'لعبة الرميات', type: 'game', description: 'ألعاب جماعية لتكرار نواتج الضرب في 5', durationMinutes: 15 },
    ],
    differentiation: [
      { id: 'diff_demo_p2m_1', group: 'support', need: 'بطء في استرجاع نواتج الضرب', strategy: 'عدّ متسلسل ووسائل مساعدة حتى الإتقان' },
    ],
    resources: [
      { id: 'res_demo_p2m_1', title: 'جدول الضرب المصوّر', type: 'material', reference: 'مكتبة الوسائل — جدول الضرب حتى 10' },
    ],
    competencyIds: ['cr_الثاني_ابتدائي_6'],
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    createdAt: iso('2026-11-17T11:00:00Z'),
    updatedAt: iso('2026-11-17T11:00:00Z'),
    publishedAt: null,
    reviewedBy: null,
    history: [
      { at: iso('2026-11-17T11:00:00Z'), by: 'u_t1', action: 'created', details: 'خطة درس أنشأها المعلم' },
    ],
  },
  {
    id: 'lp_demo_pre_sci_draft',
    curriculumId: 'cur_l_pre_sub_sci',
    levelId: 'l_pre',
    subjectId: 'sub_sci',
    unit: 'اكتشاف المحيط',
    lessonTitle: 'الحواس الخمس',
    term: 'الفصل 1',
    status: 'draft',
    objectives: [
      'يسمّي المتعلم الحواس الخمس ووظيفة كل حاسّة',
      'يستخدم حواسه لاستكشاف أشياء مألوفة',
    ],
    activities: [
      { id: 'act_demo_pres_1', title: 'استكشاف بالحواس', type: 'exploration', description: 'ملاحظة أشياء مألوفة باللمس والشم والذوق', durationMinutes: 20 },
      { id: 'act_demo_pres_2', title: 'لعبة الحواس', type: 'game', description: 'تمييز أصوات وأشكال ضمن لعبة جماعية', durationMinutes: 15 },
    ],
    differentiation: [
      { id: 'diff_demo_pres_1', group: 'all', need: 'تنمية الملاحظة الحسّية', strategy: 'محطات قصيرة بإشراف المعلّمة بالتناوب' },
    ],
    resources: [
      { id: 'res_demo_pres_1', title: 'صور الحواس', type: 'material', reference: 'مكتبة الوسائل — بطاقات الحواس الخمس' },
    ],
    competencyIds: ['cr_تمهيدي_4'],
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    createdAt: iso('2026-11-18T08:30:00Z'),
    updatedAt: iso('2026-11-18T08:30:00Z'),
    publishedAt: null,
    reviewedBy: null,
    history: [
      { at: iso('2026-11-18T08:30:00Z'), by: 'u_t1', action: 'created', details: 'خطة درس أنشأها المعلم' },
    ],
  },
  {
    id: 'lp_demo_p4_fr_draft',
    curriculumId: 'cur_l_p4_sub_fr',
    levelId: 'l_p4',
    subjectId: 'sub_fr',
    unit: 'Lecture et expression',
    lessonTitle: 'Texte et compréhension',
    term: 'الفصل 1',
    status: 'draft',
    objectives: [
      "L'apprenant lit un court texte en français",
      "L'apprenant identifie les idées principales du texte",
    ],
    activities: [
      { id: 'act_demo_p4f_1', title: 'Lecture guidée', type: 'exploration', description: 'Lecture du texte et repérage des mots nouveaux', durationMinutes: 15 },
      { id: 'act_demo_p4f_2', title: 'Exercices de compréhension', type: 'practice', description: 'Réponses courtes sur le contenu du texte', durationMinutes: 20 },
    ],
    differentiation: [
      { id: 'diff_demo_p4f_1', group: 'enrichment', need: 'Maîtrise rapide du vocabulaire', strategy: 'Production d\'un court paragraphe personnel' },
    ],
    resources: [
      { id: 'res_demo_p4f_1', title: 'Texte imprimé', type: 'library', reference: 'مكتبة المحتوى — نصوص الرابع ابتدائي / الفرنسية' },
    ],
    competencyIds: ['cr_الرابع_ابتدائي_3'],
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    createdAt: iso('2026-11-19T07:45:00Z'),
    updatedAt: iso('2026-11-19T07:45:00Z'),
    publishedAt: null,
    reviewedBy: null,
    history: [
      { at: iso('2026-11-19T07:45:00Z'), by: 'u_t1', action: 'created', details: 'خطة درس أنشأها المعلم' },
    ],
  },
]

function writeStore() {
  const json = JSON.stringify(db, null, 2)
  fs.writeFileSync(file, json, 'utf8')
  if (fs.existsSync(backupFile)) {
    fs.writeFileSync(backupFile, json, 'utf8')
    console.log(`synced seeded backup: ${backupFile}`)
  }
}

if (db.demoLessonEditorSeed === 'v1') {
  console.log('lesson editor demo data already seeded')
} else {
  db.lessonPlans = lessonPlans
  db.demoLessonEditorSeed = 'v1'
  writeStore()
  console.log(`seeded ${lessonPlans.length} lesson plans across ${new Set(lessonPlans.map((plan) => plan.levelId)).size} levels`)
}
