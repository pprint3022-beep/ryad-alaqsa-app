/**
 * Enrich the prototype JSON store with demonstrative measurable intervention plans.
 *
 * - Every plan, goal, action and review note is human-authored Arabic text.
 * - `source` only records advisory early-warning context (level, factors,
 *   recommendedAction) and is never used as plan content or a decision.
 * - Weekly reviews follow one rule: `week` is the Monday (UTC) of the review week.
 * - Demo teacher u_t1 scope is c_p4a, c_p2b and c_pre_a; one extra plan sits
 *   outside that scope so the admin (global, read-only) view differs from the
 *   teacher view.
 *
 * Idempotent: guarded by `demoInterventionPlansSeed`.
 *
 * Run once: node scripts/seed-intervention-plans-demo.js
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

const file = path.join(__dirname, '..', 'backend', 'data.json')
const backupFile = path.join(process.env.TEMP || os.tmpdir(), 'ryad-data-seeded-backup.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))

const plans = [
  {
    id: 'ip_demo_sara_attendance',
    studentId: 's_sara',
    classId: 'c_p4a',
    source: {
      warningId: 'ew_demo_sara',
      level: 'high',
      factors: ['حضور غير منتظم', 'تأخر متكرر في الصباح'],
      recommendedAction: 'تفعيل خطة دعم مبكرة + تواصل مع الأسرة + متابعة أسبوعية',
      advisory: true,
    },
    goal: 'رفع نسبة الحضور الأسبوعي لسارة من 40% إلى 80% خلال ستة أسابيع',
    indicator: 'attendance',
    baseline: 40,
    target: 80,
    current: 60,
    unit: '%',
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    status: 'active',
    createdAt: '2026-11-02T08:00:00Z',
    nextReview: '2026-11-18',
    closedAt: null,
    weeks: [
      {
        id: 'ipw_demo_sara_01',
        week: '2026-11-09',
        actions: ['اتصال هاتفي بولي الأمر وتوثيق الاتفاق', 'متابعة تسجيل الحضور يوميًا'],
        reviewNotes: 'تحسّن أولي: حضور ثلاثة أيام من خمسة',
        progress: 35,
        reviewedAt: '2026-11-12T10:00:00Z',
        reviewedBy: 'u_t1',
      },
      {
        id: 'ipw_demo_sara_02',
        week: '2026-11-16',
        actions: ['تذكير صباحي عبر ولي الأمر', 'جلسة قصيرة عند أول غياب'],
        reviewNotes: 'حضور أربعة أيام من خمسة، استجابة أفضل',
        progress: 50,
        reviewedAt: '2026-11-19T09:30:00Z',
        reviewedBy: 'u_t1',
      },
    ],
    history: [
      { at: '2026-11-02T08:00:00Z', by: 'u_t1', action: 'created', details: 'خطة تدخل يدوية أنشأها المعلم' },
      { at: '2026-11-12T10:00:00Z', by: 'u_t1', action: 'weekly_review', details: 'مراجعة أسبوعية: تقدم 35%' },
      { at: '2026-11-19T09:30:00Z', by: 'u_t1', action: 'weekly_review', details: 'مراجعة أسبوعية: تقدم 50%' },
    ],
  },
  {
    id: 'ip_demo_adam_homework',
    studentId: 's_adam',
    classId: 'c_p4a',
    source: {
      warningId: 'ew_demo_adam',
      level: 'medium',
      factors: ['معدل درجات منخفض', '2 تقييم تحت العتبة'],
      recommendedAction: 'متابعة مكثفة + تمارين تكييفية',
      advisory: true,
    },
    goal: 'رفع نسبة إنجاز الواجبات المنزلية لآدم من 50% إلى 85% خلال أربعة أسابيع',
    indicator: 'homework',
    baseline: 50,
    target: 85,
    current: 71,
    unit: '%',
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    status: 'reviewed',
    createdAt: '2026-11-09T08:15:00Z',
    nextReview: '2026-11-25',
    closedAt: null,
    weeks: [
      {
        id: 'ipw_demo_adam_01',
        week: '2026-11-16',
        actions: ['دفتر متابعة يومي للواجبات', 'تعزيز رمزي عند إنجاز ثلاثة أيام متتالية'],
        reviewNotes: 'إنجاز ستة واجبات من عشرة، تحسّن واضح',
        progress: 60,
        reviewedAt: '2026-11-18T14:00:00Z',
        reviewedBy: 'u_t1',
      },
    ],
    history: [
      { at: '2026-11-09T08:15:00Z', by: 'u_t1', action: 'created', details: 'خطة تدخل يدوية أنشأها المعلم' },
      { at: '2026-11-18T14:00:00Z', by: 'u_t1', action: 'weekly_review', details: 'مراجعة أسبوعية: تقدم 60%' },
    ],
  },
  {
    id: 'ip_demo_zayd_reading',
    studentId: 's_stu4',
    classId: 'c_p2b',
    source: null,
    goal: 'تحسين دقة القراءة الجهرية لزيد من 45% إلى 75% خلال خمسة أسابيع',
    indicator: 'practice',
    baseline: 45,
    target: 75,
    current: 75,
    unit: '%',
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    status: 'closed',
    createdAt: '2026-10-26T09:00:00Z',
    nextReview: '2026-11-16',
    closedAt: '2026-11-13T11:00:00Z',
    weeks: [
      {
        id: 'ipw_demo_zayd_01',
        week: '2026-11-02',
        actions: ['قراءة عشر دقائق يوميًا مع ولي الأمر', 'تسجيل صوتي أسبوعي للمقارنة'],
        reviewNotes: 'دقة القراءة تحسّنت إلى منتصف الطريق',
        progress: 55,
        reviewedAt: '2026-11-05T09:00:00Z',
        reviewedBy: 'u_t1',
      },
      {
        id: 'ipw_demo_zayd_02',
        week: '2026-11-09',
        actions: ['نصوص قصيرة متدرجة الصعوبة', 'مراجعة فردية قبل الحصة'],
        reviewNotes: 'بلغ الهدف: قراءة سليمة لنص كامل دون تردد',
        progress: 100,
        reviewedAt: '2026-11-12T09:00:00Z',
        reviewedBy: 'u_t1',
      },
    ],
    history: [
      { at: '2026-10-26T09:00:00Z', by: 'u_t1', action: 'created', details: 'خطة تدخل يدوية أنشأها المعلم' },
      { at: '2026-11-05T09:00:00Z', by: 'u_t1', action: 'weekly_review', details: 'مراجعة أسبوعية: تقدم 55%' },
      { at: '2026-11-12T09:00:00Z', by: 'u_t1', action: 'weekly_review', details: 'مراجعة أسبوعية: تقدم 100%' },
      { at: '2026-11-13T11:00:00Z', by: 'u_t1', action: 'closed', details: 'إغلاق الخطة بعد بلوغ الهدف' },
    ],
  },
  {
    id: 'ip_demo_stu5_mood',
    studentId: 's_stu5',
    classId: 'c_p2b',
    source: {
      warningId: null,
      level: 'medium',
      factors: ['حضور غير منتظم', '1 تقييم تحت العتبة'],
      recommendedAction: 'متابعة مكثفة + تمارين تكييفية',
      advisory: true,
    },
    goal: 'رفع مؤشر الرضا والانخراط الصفي لآدم من 35% إلى 70% عبر أنشطة صفية قصيرة',
    indicator: 'mood',
    baseline: 35,
    target: 70,
    current: 43.75,
    unit: '%',
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    status: 'active',
    createdAt: '2026-11-11T07:45:00Z',
    nextReview: '2026-11-26',
    closedAt: null,
    weeks: [
      {
        id: 'ipw_demo_stu5_01',
        week: '2026-11-16',
        actions: ['بطاقة مزاج صباحية', 'مهمة قيادة صغيرة داخل المجموعة'],
        reviewNotes: 'مشاركة أفضل في الأنشطة الجماعية',
        progress: 25,
        reviewedAt: '2026-11-17T10:30:00Z',
        reviewedBy: 'u_t1',
      },
    ],
    history: [
      { at: '2026-11-11T07:45:00Z', by: 'u_t1', action: 'created', details: 'خطة تدخل يدوية أنشأها المعلم' },
      { at: '2026-11-17T10:30:00Z', by: 'u_t1', action: 'weekly_review', details: 'مراجعة أسبوعية: تقدم 25%' },
    ],
  },
  {
    id: 'ip_demo_yassine_engagement',
    studentId: 's_yassine',
    classId: 'c_pre_a',
    source: null,
    goal: 'زيادة مشاركة ياسين التطوعية في الأنشطة الصفية من 3 إلى 10 مرات أسبوعيًا',
    indicator: 'engagement',
    baseline: 3,
    target: 10,
    current: 6.5,
    unit: 'count',
    ownerId: 'u_t1',
    ownerRole: 'teacher',
    status: 'active',
    createdAt: '2026-11-10T08:30:00Z',
    nextReview: '2026-11-27',
    closedAt: null,
    weeks: [
      {
        id: 'ipw_demo_yassine_01',
        week: '2026-11-16',
        actions: ['دور ثابت في النشاط الصباحي', 'تشجيع المشاركة اليدوية'],
        reviewNotes: 'شارك ست مرات هذا الأسبوع',
        progress: 50,
        reviewedAt: '2026-11-18T11:00:00Z',
        reviewedBy: 'u_t1',
      },
    ],
    history: [
      { at: '2026-11-10T08:30:00Z', by: 'u_t1', action: 'created', details: 'خطة تدخل يدوية أنشأها المعلم' },
      { at: '2026-11-18T11:00:00Z', by: 'u_t1', action: 'weekly_review', details: 'مراجعة أسبوعية: تقدم 50%' },
    ],
  },
  {
    // Outside u_t1's classes: visible to admins only (global read-only view).
    id: 'ip_demo_stu6_attendance',
    studentId: 's_stu6',
    classId: 'c_p6b',
    source: {
      warningId: 'ew_demo_stu6',
      level: 'low',
      factors: ['غياب متقطع'],
      recommendedAction: 'متابعة دورية مع ولي الأمر',
      advisory: true,
    },
    goal: 'الحفاظ على نسبة حضور أنس فوق 90% خلال أربعة أسابيع',
    indicator: 'attendance',
    baseline: 70,
    target: 90,
    current: 77,
    unit: '%',
    ownerId: 'u_t2',
    ownerRole: 'teacher',
    status: 'active',
    createdAt: '2026-11-12T09:15:00Z',
    nextReview: '2026-11-30',
    closedAt: null,
    weeks: [
      {
        id: 'ipw_demo_stu6_01',
        week: '2026-11-16',
        actions: ['متابعة يومية للحضور', 'تواصل أسبوعي مع ولي الأمر'],
        reviewNotes: 'حضور كامل هذا الأسبوع',
        progress: 35,
        reviewedAt: '2026-11-19T08:00:00Z',
        reviewedBy: 'u_t2',
      },
    ],
    history: [
      { at: '2026-11-12T09:15:00Z', by: 'u_t2', action: 'created', details: 'خطة تدخل يدوية أنشأها المعلم' },
      { at: '2026-11-19T08:00:00Z', by: 'u_t2', action: 'weekly_review', details: 'مراجعة أسبوعية: تقدم 35%' },
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

if (db.demoInterventionPlansSeed === 'v1') {
  console.log('intervention plans demo data already seeded')
} else {
  db.interventionPlans = plans
  db.demoInterventionPlansSeed = 'v1'
  writeStore()
  console.log(`seeded ${plans.length} intervention plans across ${new Set(plans.map((plan) => plan.classId)).size} classes`)
}
