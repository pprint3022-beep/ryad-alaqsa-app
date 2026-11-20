/**
 * Enrich the prototype JSON store with a demonstrative weekly school timetable.
 *
 * - 21 slots across the demo classes c_p4a, c_p2b and c_pre_a.
 * - Moroccan school week (الأحد..الخميس), periods 1..6 and the three school terms.
 * - Timetable slots carry no dates: the period map defines the fixed clock time.
 *   Attendance links are classroom attendance only, never platform engagement.
 *
 * Idempotent: guarded by `demoTimetableSeed`.
 *
 * Run once: node scripts/seed-timetable-demo.js
 */
const fs = require('fs')
const os = require('os')
const path = require('path')

const file = path.join(__dirname, '..', 'backend', 'data.json')
const backupFile = path.join(process.env.TEMP || os.tmpdir(), 'ryad-data-seeded-backup.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))

const rows = [
  // c_p4a — grade 4 (أ)
  ['ts_demo_p4a_01', 'c_p4a', 'الأحد', 1, 'sub_math', 'قاعة 1', 'الفصل 1'],
  ['ts_demo_p4a_02', 'c_p4a', 'الأحد', 3, 'sub_ar', 'قاعة 1', 'الفصل 1'],
  ['ts_demo_p4a_03', 'c_p4a', 'الإثنين', 2, 'sub_fr', 'قاعة 1', 'الفصل 1'],
  ['ts_demo_p4a_04', 'c_p4a', 'الإثنين', 5, 'sub_sci', 'مختبر', 'الفصل 2'],
  ['ts_demo_p4a_05', 'c_p4a', 'الثلاثاء', 1, 'sub_math', 'قاعة 1', 'الفصل 2'],
  ['ts_demo_p4a_06', 'c_p4a', 'الأربعاء', 4, 'sub_histgeo', 'قاعة 1', 'الفصل 2'],
  ['ts_demo_p4a_07', 'c_p4a', 'الخميس', 2, 'sub_isl', 'قاعة 1', 'الفصل 3'],
  ['ts_demo_p4a_08', 'c_p4a', 'الخميس', 6, 'sub_sport', 'ملعب', 'الفصل 3'],
  // c_p2b — grade 2 (ب)
  ['ts_demo_p2b_01', 'c_p2b', 'الأحد', 2, 'sub_math', 'قاعة 2', 'الفصل 1'],
  ['ts_demo_p2b_02', 'c_p2b', 'الإثنين', 1, 'sub_ar', 'قاعة 2', 'الفصل 1'],
  ['ts_demo_p2b_03', 'c_p2b', 'الإثنين', 4, 'sub_fr', 'قاعة 2', 'الفصل 1'],
  ['ts_demo_p2b_04', 'c_p2b', 'الثلاثاء', 3, 'sub_sci', 'مختبر', 'الفصل 2'],
  ['ts_demo_p2b_05', 'c_p2b', 'الأربعاء', 2, 'sub_math', 'قاعة 2', 'الفصل 2'],
  ['ts_demo_p2b_06', 'c_p2b', 'الأربعاء', 5, 'sub_art', 'قاعة فنون', 'الفصل 3'],
  ['ts_demo_p2b_07', 'c_p2b', 'الخميس', 1, 'sub_isl', 'قاعة 2', 'الفصل 3'],
  // c_pre_a — pre-school (أ)
  ['ts_demo_pre_01', 'c_pre_a', 'الأحد', 1, 'sub_ar', 'روضة أ', 'الفصل 1'],
  ['ts_demo_pre_02', 'c_pre_a', 'الأحد', 4, 'sub_art', 'قاعة فنون', 'الفصل 1'],
  ['ts_demo_pre_03', 'c_pre_a', 'الإثنين', 2, 'sub_math', 'روضة أ', 'الفصل 1'],
  ['ts_demo_pre_04', 'c_pre_a', 'الثلاثاء', 1, 'sub_fr', 'روضة أ', 'الفصل 2'],
  ['ts_demo_pre_05', 'c_pre_a', 'الأربعاء', 3, 'sub_sport', 'ملعب', 'الفصل 2'],
  ['ts_demo_pre_06', 'c_pre_a', 'الخميس', 2, 'sub_isl', 'روضة أ', 'الفصل 3'],
]

const timetable = rows.map(([id, classId, day, period, subjectId, room, term]) => ({
  id,
  classId,
  day,
  period,
  subjectId,
  teacherId: 'u_t1',
  room,
  term,
}))

function writeStore() {
  const json = JSON.stringify(db, null, 2)
  fs.writeFileSync(file, json, 'utf8')
  if (fs.existsSync(backupFile)) {
    fs.writeFileSync(backupFile, json, 'utf8')
    console.log(`synced seeded backup: ${backupFile}`)
  }
}

if (db.demoTimetableSeed === 'v1') {
  console.log('timetable demo data already seeded')
} else {
  db.timetable = timetable
  db.demoTimetableSeed = 'v1'
  writeStore()
  console.log(`seeded ${timetable.length} timetable slots across ${new Set(timetable.map((slot) => slot.classId)).size} classes`)
}
