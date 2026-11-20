/**
 * Enrich the prototype JSON store with a demonstrative question bank,
 * formative assessments and advisory student attempts.
 *
 * - 7 questions across grade 4 maths/French, grade 2 maths and pre-school Arabic.
 * - 3 formative assessments (2 published, 1 draft).
 * - 3 completed attempts for the demo student s_sara, used by the item-analysis view.
 *
 * Idempotent: guarded by `demoAssessmentSeed`.
 *
 * Run once: node scripts/seed-assessment-demo.js
 */
const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'backend', 'data.json')
const db = JSON.parse(fs.readFileSync(file, 'utf8'))

const at = (day, hour) => `2026-11-${day}T${hour}:00:00Z`

const questions = [
  { id: 'qb_demo1', levelId: 'l_p4', subjectId: 'sub_math', term: 'الفصل 1', difficulty: 'easy', prompt: 'كم يساوي 3/4 + 1/4؟', options: ['1', '4/8', '1/2', '2'], correctIndex: 0, skill: 'الكسور', explanation: '3/4 + 1/4 = 4/4 = 1' },
  { id: 'qb_demo2', levelId: 'l_p4', subjectId: 'sub_math', term: 'الفصل 1', difficulty: 'medium', prompt: 'أي عدد يقبل القسمة على 3؟', options: ['14', '21', '25', '28'], correctIndex: 1, skill: 'القسمة', explanation: '21 = 3 × 7' },
  { id: 'qb_demo3', levelId: 'l_p4', subjectId: 'sub_math', term: 'الفصل 1', difficulty: 'hard', prompt: 'ما العامل المشترك الأكبر لـ 12 و 18؟', options: ['2', '3', '6', '9'], correctIndex: 2, skill: 'الكسور', explanation: 'العامل المشترك الأكبر هو 6' },
  { id: 'qb_demo4', levelId: 'l_p4', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'easy', prompt: 'Quel est le pluriel de « chat » ?', options: ['chats', 'chattes', 'chat', 'chatses'], correctIndex: 0, skill: 'الجمع', explanation: 'Le pluriel de chat est chats.' },
  { id: 'qb_demo5', levelId: 'l_p4', subjectId: 'sub_fr', term: 'الفصل 1', difficulty: 'medium', prompt: 'Choisissez le verbe correct : Je ... à l’école.', options: ['aller', 'vais', 'allons', 'allez'], correctIndex: 1, skill: 'التصريف', explanation: 'Je vais à l’école.' },
  { id: 'qb_demo6', levelId: 'l_p2', subjectId: 'sub_math', term: 'الفصل 1', difficulty: 'easy', prompt: '7 + 5 = ؟', options: ['11', '12', '13', '10'], correctIndex: 1, skill: 'الجمع', explanation: '7 + 5 = 12' },
  { id: 'qb_demo7', levelId: 'l_pre', subjectId: 'sub_ar', term: 'الفصل 1', difficulty: 'easy', prompt: 'أي حرف يبدأ به اسم «تفاحة»؟', options: ['ت', 'ث', 'ب', 'ط'], correctIndex: 0, skill: 'القراءة', explanation: 'تفاحة تبدأ بحرف التاء.' },
].map((q) => ({ ...q, status: 'active', createdAt: at('15', '09'), createdBy: 'u_t1' }))

const formatives = [
  { id: 'fa_demo1', title: 'مراجعة الكسور والقسمة', levelId: 'l_p4', subjectId: 'sub_math', term: 'الفصل 1', questionIds: ['qb_demo1', 'qb_demo2', 'qb_demo3'], status: 'published' },
  { id: 'fa_demo2', title: 'الفرنسية: الجمع والتصريف', levelId: 'l_p4', subjectId: 'sub_fr', term: 'الفصل 1', questionIds: ['qb_demo4', 'qb_demo5'], status: 'published' },
  { id: 'fa_demo3', title: 'تقييم تمهيدي — الحروف', levelId: 'l_pre', subjectId: 'sub_ar', term: 'الفصل 1', questionIds: ['qb_demo7'], status: 'draft' },
].map((f) => ({ ...f, createdAt: at('16', '10'), createdBy: 'u_t1' }))

const attempts = [
  { id: 'att_demo1', assessmentId: 'fa_demo1', studentId: 's_sara', answers: { qb_demo1: 1, qb_demo2: 1, qb_demo3: 0 }, score: 1 / 3, correct: 1, total: 3, completedAt: at('17', '08') },
  { id: 'att_demo2', assessmentId: 'fa_demo1', studentId: 's_sara', answers: { qb_demo1: 0, qb_demo2: 1, qb_demo3: 2 }, score: 1, correct: 3, total: 3, completedAt: at('18', '08') },
  { id: 'att_demo3', assessmentId: 'fa_demo2', studentId: 's_sara', answers: { qb_demo4: 0, qb_demo5: 2 }, score: 0.5, correct: 1, total: 2, completedAt: at('18', '09') },
]
for (const a of attempts) {
  const f = formatives.find((x) => x.id === a.assessmentId)
  a.feedback = f.questionIds.map((qid) => {
    const q = questions.find((x) => x.id === qid)
    return { questionId: qid, correct: a.answers[qid] === q.correctIndex, correctText: q.options[q.correctIndex], explanation: q.explanation }
  })
}

if (db.demoAssessmentSeed === 'v1') {
  console.log('assessment demo data already seeded')
} else {
  db.questionBank = questions
  db.formativeAssessments = formatives
  db.assessmentAttempts = attempts
  db.demoAssessmentSeed = 'v1'
  fs.writeFileSync(file, JSON.stringify(db, null, 2) + '\n', 'utf8')
  console.log(`seeded ${questions.length} questions, ${formatives.length} assessments, ${attempts.length} attempts`)
}
