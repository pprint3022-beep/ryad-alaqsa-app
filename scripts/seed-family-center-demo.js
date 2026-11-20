/**
 * Enrich the prototype JSON store with a demonstrative family approval &
 * privacy center for the demo parent u_p1 (children s_sara and s_yassine).
 *
 * - 6 parent requests: 3 pending (consent/acknowledgement/privacy) and 3
 *   decided (decision history with decidedAt/decidedBy/decisionNote).
 * - Advisory only: every row carries `advisory: true`; the parent decides.
 * - Parent preferences for u_p1 (analytics, communications, language).
 *
 * Idempotent: guarded by `demoFamilyCenterSeed`.
 *
 * Run once: node scripts/seed-family-center-demo.js
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

const file = path.join(__dirname, '..', 'backend', 'data.json')
const backupFile = path.join(process.env.TEMP || os.tmpdir(), 'ryad-data-seeded-backup.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))

const parentRequests = [
  {
    id: 'pr_demo_consent_com6',
    studentId: 's_sara',
    type: 'consent',
    entityType: 'communication',
    entityId: 'com6',
    title: 'موافقة على مراسلة تربويّة',
    summary: 'طلب موافقة على إرسال مراسلة تربويّة مرتبطة بسارة بعد مراجعة المعلّم.',
    status: 'pending',
    requestedAt: '2026-11-15T09:00:00Z',
    decidedAt: null,
    decidedBy: null,
    decisionNote: '',
    advisory: true,
  },
  {
    id: 'pr_demo_ack_fc2',
    studentId: 's_sara',
    type: 'acknowledgement',
    entityType: 'feedback_card',
    entityId: 'fc2',
    title: 'الاطّلاع على بطاقة التغذية الراجعة',
    summary: 'بطاقة استرشادية تخصّ التميّز العلمي وتعبير سارة الشفهي بالفرنسية.',
    status: 'pending',
    requestedAt: '2026-11-16T10:30:00Z',
    decidedAt: null,
    decidedBy: null,
    decisionNote: '',
    advisory: true,
  },
  {
    id: 'pr_demo_privacy_sara',
    studentId: 's_sara',
    type: 'privacy',
    entityType: 'privacy_policy',
    entityId: 'policy_v1',
    title: 'مراجعة سياسة الخصوصية',
    summary: 'مراجعة مصادر بيانات سارة: حضور القسم، زمن المنصة، التقييمات والمراسلات.',
    status: 'pending',
    requestedAt: '2026-11-17T08:15:00Z',
    decidedAt: null,
    decidedBy: null,
    decisionNote: '',
    advisory: true,
  },
  {
    id: 'pr_demo_consent_yassine',
    studentId: 's_yassine',
    type: 'consent',
    entityType: 'communication',
    entityId: 'com2',
    title: 'موافقة سابقة على تواصل تربوي',
    summary: 'سجلّ موافقة سابقة مرتبط بولي الأمر، استرشادي ويخضع لقرار المعلّم.',
    status: 'approved',
    requestedAt: '2026-11-11T09:00:00Z',
    decidedAt: '2026-11-12T14:20:00Z',
    decidedBy: 'u_p1',
    decisionNote: 'وافقت على التواصل التربوي بعد مراجعة المحتوى.',
    advisory: true,
  },
  {
    id: 'pr_demo_ack_yassine',
    studentId: 's_yassine',
    type: 'acknowledgement',
    entityType: 'feedback_card',
    entityId: 'fc_yassine_demo',
    title: 'الاطّلاع على ملاحظات ياسين',
    summary: 'ملاحظات استرشادية حول مشاركة ياسين في الأنشطة الفنية.',
    status: 'acknowledged',
    requestedAt: '2026-11-12T08:00:00Z',
    decidedAt: '2026-11-13T11:05:00Z',
    decidedBy: 'u_p1',
    decisionNote: 'اطّلعت على الملاحظات وناقشتها مع ياسين.',
    advisory: true,
  },
  {
    id: 'pr_demo_privacy_yassine',
    studentId: 's_yassine',
    type: 'privacy',
    entityType: 'privacy_policy',
    entityId: 'policy_v1',
    title: 'قرار خصوصية سابق',
    summary: 'قرار سابق بشأن مشاركة بيانات ياسين في التحليلات.',
    status: 'declined',
    requestedAt: '2026-11-13T10:00:00Z',
    decidedAt: '2026-11-14T16:40:00Z',
    decidedBy: 'u_p1',
    decisionNote: 'لا أوافق على مشاركة البيانات لأغراض التحليل.',
    advisory: true,
  },
]

const parentPreferences = {
  'u_p1': {
    allowAnalytics: true,
    allowCommunications: true,
    language: 'ar',
    updatedAt: '2026-11-10T08:00:00Z',
    updatedBy: 'u_p1',
  },
}

function writeStore() {
  const json = JSON.stringify(db, null, 2)
  fs.writeFileSync(file, json, 'utf8')
  if (fs.existsSync(backupFile)) {
    fs.writeFileSync(backupFile, json, 'utf8')
    console.log(`synced seeded backup: ${backupFile}`)
  }
}

if (db.demoFamilyCenterSeed === 'v1') {
  console.log('family center demo data already seeded')
} else {
  db.parentRequests = parentRequests
  db.parentPreferences = parentPreferences
  db.demoFamilyCenterSeed = 'v1'
  writeStore()
  console.log(`seeded ${parentRequests.length} parent requests across ${[...new Set(parentRequests.map((row) => row.studentId))].length} children and preferences for ${Object.keys(parentPreferences).length} parent`)
}
