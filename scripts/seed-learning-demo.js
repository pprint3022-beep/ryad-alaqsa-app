/**
 * Enrich the prototype JSON store with realistic learning-space demo data.
 *
 * - Assigns each curriculum unit to one of three school terms (idempotent).
 * - Adds 14 days of platform-time events and lesson progress for a few students.
 * - Marks two class assignments as submitted.
 *
 * Run once: node scripts/seed-learning-demo.js
 */
const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'backend', 'data.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))
const TERMS = ['الفصل 1', 'الفصل 2', 'الفصل 3']
const now = new Date()
let addedEvents = 0
let addedProgress = 0
let assignedTerms = 0

// 1) Term mapping: keep existing terms, otherwise distribute units of each
// level+subject evenly across the three terms in curriculum order.
const groups = new Map()
for (const item of db.curriculum || []) {
  if (item.term) continue
  const key = `${item.levelId}|${item.subjectId}`
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(item)
}
for (const items of groups.values()) {
  items.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }))
  items.forEach((item, index) => {
    item.term = TERMS[Math.min(2, Math.floor((index * 3) / items.length))]
    assignedTerms += 1
  })
}

// 2) Platform engagement for representative students of the demo classes.
db.studentEngagement = db.studentEngagement || []
const targetStudents = [
  { id: 's_sara', minutes: [30, 42, 25, 38, 45, 20, 35, 40, 28, 32, 44, 26, 36, 30] },
  { id: 's_adam', minutes: [18, 22, 15, 24, 20, 12, 18, 26, 20, 16, 24, 18, 21, 19] },
  { id: 's_yassine', minutes: [12, 0, 15, 18, 0, 14, 16, 10, 18, 0, 12, 15, 17, 14] },
]
const subjectPairs = [
  ['sub_math', 'الرياضيات'],
  ['sub_ar', 'اللغة العربية'],
  ['sub_fr', 'اللغة الفرنسية'],
]
const alreadySeeded = db.demoLearningSeed === 'v1'
for (let s = 0; !alreadySeeded && s < targetStudents.length; s += 1) {
  const student = targetStudents[s]
  if (!(db.students || []).some((row) => row.id === student.id)) continue
  for (let day = 13; day >= 0; day -= 1) {
    const total = student.minutes[13 - day] || 0
    if (!total) continue
    const chunks = total > 30 ? 3 : 2
    for (let part = 0; part < chunks; part += 1) {
      const seconds = Math.round((total * 60) / chunks)
      const at = new Date(now.getTime() - day * 86400000 - part * 3600000)
      const pair = subjectPairs[(day + part + s) % subjectPairs.length]
      db.studentEngagement.push({
        id: `eng_demo_${student.id}_${day}_${part}`,
        studentId: student.id,
        at: at.toISOString(),
        seconds,
        activity: part === 0 ? 'lesson' : part === 1 ? 'assignment' : 'reading',
        subjectId: pair[0],
        subject: pair[1],
        refId: null,
        source: 'demo',
      })
      addedEvents += 1
    }
  }
}

// 3) Interactive lesson progress for the demo student (s_sara, grade 4).
db.lessonProgress = db.lessonProgress || []
if (!alreadySeeded) {
  const levelUnits = (db.curriculum || []).filter((item) => item.levelId === 'l_p4')
  const picks = levelUnits.slice(0, 5)
  picks.forEach((unit, unitIndex) => {
    const subject = (db.subjects || []).find((row) => row.id === unit.subjectId)
    ;(unit.lessons || []).slice(0, 2).forEach((lesson, lessonIndex) => {
      const id = `${unit.id}:${lessonIndex}`
      if (db.lessonProgress.some((row) => row.studentId === 's_sara' && row.lessonId === id)) return
      const score = Math.min(0.95, 0.6 + ((unitIndex + lessonIndex) % 4) * 0.1)
      const at = new Date(now.getTime() - ((unitIndex * 2 + lessonIndex) % 12) * 86400000).toISOString()
      db.lessonProgress.push({
        id: `lp_demo_${unit.id}_${lessonIndex}`,
        studentId: 's_sara',
        subjectId: unit.subjectId,
        subject: subject?.name || unit.subjectId,
        unitId: unit.id,
        unit: unit.unit,
        lessonId: id,
        lesson,
        score,
        completed: true,
        attempts: 1 + (lessonIndex % 2),
        xp: Math.round(10 + 20 * score + 10),
        at,
        updatedAt: at,
      })
      addedProgress += 1
    })
  })
}

// 4) A couple of submitted assignments for the demo student's class.
db.submissions = db.submissions || []
const sara = (db.students || []).find((row) => row.id === 's_sara')
if (sara && !alreadySeeded) {
  const classAssignments = (db.assignments || []).filter((row) => row.classId === sara.classId).slice(0, 2)
  classAssignments.forEach((assignment, index) => {
    if (db.submissions.some((row) => row.assignmentId === assignment.id && row.studentId === sara.id)) return
    db.submissions.push({
      id: `sb_demo_${assignment.id}`,
      assignmentId: assignment.id,
      studentId: sara.id,
      status: index === 0 ? 'graded' : 'submitted',
      grade: index === 0 ? 16 : null,
      feedback: index === 0 ? 'عمل منظم، واصل التمرن على التعبير الكتابي.' : null,
      submittedAt: new Date(now.getTime() - (index + 1) * 86400000).toISOString(),
    })
  })
}

db.demoLearningSeed = 'v1'
fs.writeFileSync(file, JSON.stringify(db, null, 2))
console.log(JSON.stringify({ assignedTerms, addedEvents, addedProgress, totalEngagement: db.studentEngagement.length, progressRows: db.lessonProgress.length, submissions: db.submissions.length }, null, 1))
