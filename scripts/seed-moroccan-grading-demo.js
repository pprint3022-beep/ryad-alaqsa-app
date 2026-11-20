/**
 * Enrich the prototype JSON store with a demonstrative Moroccan primary
 * grading dataset (الدورة الأولى / الدورة الثانية).
 *
 * - 16 grade entries across demo students s_sara, s_yassine, s_adam and a few
 *   c_p2b students (all inside teacher u_t1's scope).
 * - Two cycles (cycle1/cycle2), several subjects, and a mix of
 *   draft / submitted / approved statuses with valid ISO timestamps.
 * - Top-level `gradingPolicy` copied from backend/grading.js so schools can see
 *   the exact configurable policy the API will use.
 *
 * Idempotent: guarded by `demoGradingSeed` ('v1'). Writes data.json AND the
 * shared seeded backup in %TEMP%. A second run prints "already seeded".
 *
 * Run once: node scripts/seed-moroccan-grading-demo.js
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const { DEFAULT_GRADING_POLICY } = require('../backend/grading')

const file = path.join(__dirname, '..', 'backend', 'data.json')
const backupFile = path.join(process.env.TEMP || os.tmpdir(), 'ryad-data-seeded-backup.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))

const YEAR = '2025-2026'
const ENTERED_BY = 'u_t1'

/** Helper: build one entry with two tests (الفرض 1 / الفرض 2). */
function entry(id, studentId, classId, cycle, subjectId, t1, t2, participationScore,
  subjectCoefficient, status, approvedBy, enteredAt, approvedAt) {
  return {
    id: `gr_demo_${id}`,
    studentId,
    classId,
    term: cycle === 'cycle2' ? 'الفصل 2' : 'الفصل 1',
    cycle,
    year: YEAR,
    subjectId,
    tests: [
      { id: 't1', label: 'الفرض 1', score: t1, coefficient: 1 },
      { id: 't2', label: 'الفرض 2', score: t2, coefficient: 1 },
    ],
    participationScore,
    subjectCoefficient,
    enteredBy: ENTERED_BY,
    enteredAt,
    status,
    approvedBy: approvedBy || null,
    approvedAt: approvedAt || null,
  }
}

const gradeEntries = [
  // --- سارة بنعلي (c_p4a) ---
  entry('sara_math_c1', 's_sara', 'c_p4a', 'cycle1', 'sub_math', 14, 12, 16, 4,
    'approved', 'u_dir', '2025-10-12T08:15:00.000Z', '2025-10-14T10:30:00.000Z'),
  entry('sara_ar_c1', 's_sara', 'c_p4a', 'cycle1', 'sub_ar', 16, 15, 17, 4,
    'approved', 'u_dir', '2025-10-12T08:20:00.000Z', '2025-10-14T10:32:00.000Z'),
  entry('sara_fr_c1', 's_sara', 'c_p4a', 'cycle1', 'sub_fr', 11, 13, 12, 4,
    'submitted', null, '2025-10-13T09:05:00.000Z'),
  entry('sara_math_c2', 's_sara', 'c_p4a', 'cycle2', 'sub_math', 15, 16, 17, 4,
    'submitted', null, '2026-03-11T08:15:00.000Z'),
  entry('sara_ar_c2', 's_sara', 'c_p4a', 'cycle2', 'sub_ar', 17, 18, 18, 4,
    'draft', null, '2026-03-12T11:45:00.000Z'),
  entry('sara_sci_c2', 's_sara', 'c_p4a', 'cycle2', 'sub_sci', 13, 14, 15, 2,
    'approved', 'u_dir', '2026-03-11T09:40:00.000Z', '2026-03-15T12:00:00.000Z'),

  // --- آدم المرابط (c_p4a) ---
  entry('adam_math_c1', 's_adam', 'c_p4a', 'cycle1', 'sub_math', 9, 11, 10, 4,
    'submitted', null, '2025-10-13T10:00:00.000Z'),
  entry('adam_isl_c1', 's_adam', 'c_p4a', 'cycle1', 'sub_isl', 12, 13, 14, 2,
    'approved', 'u_dir', '2025-10-12T10:10:00.000Z', '2025-10-14T10:40:00.000Z'),
  entry('adam_math_c2', 's_adam', 'c_p4a', 'cycle2', 'sub_math', 12, 13, 14, 4,
    'draft', null, '2026-03-12T09:20:00.000Z'),
  entry('adam_fr_c2', 's_adam', 'c_p4a', 'cycle2', 'sub_fr', 10, 12, 11, 4,
    'submitted', null, '2026-03-11T10:05:00.000Z'),

  // --- ياسين بنعلي (c_pre_a) ---
  entry('yassine_ar_c1', 's_yassine', 'c_pre_a', 'cycle1', 'sub_ar', 15, 16, 16, 4,
    'approved', 'u_dir', '2025-10-14T08:30:00.000Z', '2025-10-16T09:00:00.000Z'),
  entry('yassine_math_c2', 's_yassine', 'c_pre_a', 'cycle2', 'sub_math', 14, 15, 15, 4,
    'submitted', null, '2026-03-13T08:45:00.000Z'),

  // --- a few other c_p2b students (within u_t1 scope) ---
  entry('stu4_math_c1', 's_stu4', 'c_p2b', 'cycle1', 'sub_math', 8, 10, 9, 4,
    'approved', 'u_dir', '2025-10-15T11:00:00.000Z', '2025-10-17T09:15:00.000Z'),
  entry('stu4_ar_c2', 's_stu4', 'c_p2b', 'cycle2', 'sub_ar', 11, 12, 12, 4,
    'draft', null, '2026-03-14T11:30:00.000Z'),
  entry('stu8_math_c1', 's_stu8', 'c_p2b', 'cycle1', 'sub_math', 16, 17, 18, 4,
    'submitted', null, '2025-10-16T09:10:00.000Z'),
  entry('stu8_isl_c2', 's_stu8', 'c_p2b', 'cycle2', 'sub_isl', 15, 16, 16, 2,
    'approved', 'u_dir', '2026-03-15T10:20:00.000Z', '2026-03-17T08:50:00.000Z'),
]

function writeStore() {
  const json = JSON.stringify(db, null, 2)
  fs.writeFileSync(file, json, 'utf8')
  // Always maintain the shared seeded backup (create it if it does not exist).
  fs.writeFileSync(backupFile, json, 'utf8')
  console.log(`synced seeded backup: ${backupFile}`)
}

if (db.demoGradingSeed === 'v1') {
  console.log('grading demo data already seeded')
} else {
  // Deep copy so the stored policy is independent of the module export.
  db.gradingPolicy = JSON.parse(JSON.stringify(DEFAULT_GRADING_POLICY))
  db.gradeEntries = gradeEntries
  db.demoGradingSeed = 'v1'
  writeStore()
  console.log(`seeded ${gradeEntries.length} grade entries across ${new Set(gradeEntries.map((e) => e.studentId)).size} students, ${new Set(gradeEntries.map((e) => e.cycle)).size} cycles`)
}
