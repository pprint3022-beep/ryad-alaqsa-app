/**
 * v6 full-curriculum coverage generator.
 *
 * Expands the compact unit specs authored in `v6-content-A.js` … `v6-content-H.js`
 * into seed-ready lesson contents, aligned fr/en variants, question-bank items
 * and measurable outcomes. Every declared curriculum lesson slot
 * (`${curriculumId}:${index}`) receives a specific, non-generic topic.
 *
 * The generator never writes to the store; `seed-lesson-content-demo.js` owns
 * ids at the store level, timestamps, publication metadata and the seed guard.
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..', '..')
const db = JSON.parse(fs.readFileSync(path.join(root, 'backend', 'data.json'), 'utf8'))
const subjects = new Map((db.subjects || []).map((s) => [s.id, s.name]))
const levels = new Map((db.levels || []).map((l) => [l.id, l.name]))

const specs = {}
for (const letter of 'ABCDEFGH') {
  const mod = require(`./v6-content-${letter}`)
  for (const [unitId, unit] of Object.entries(mod.units || {})) specs[unitId] = unit
}

const ICON_RULES = [
  [/كس|مقام|بسط|fraction|numérat|dénominat|numerator|denominator|رقم|عدد|حساب|math/i, '🧮'],
  [/ضرب|multiplication|110?[×x]|جدول/i, '✖️'],
  [/هندس|شكل|مستطيل|مربع|مثلث|géométr|forme|shape/i, '📐'],
  [/قراء|نص|حروف|ألف|باء|lettres|lecture|reading|grammaire|grammar|texte|text/i, '📖'],
  [/كتابة|تعبير|expression|écriture|writing|جملة|phrase|sentence/i, '✍️'],
  [/فكرة|أفكار|كلمات|idée|idea|فهم|compréhension|comprehension/i, '💡'],
  [/تاريخ|زمن|خريطة|جغراف|المغرب|Maroc|Morocco|carte|map/i, '🗺️'],
  [/علوم|علم|تجربة|مادة|طاقة|نبات|حيوان|science|expérience|experiment|matter|energy/i, '🔬'],
  [/صلاة|وضوء|زكاة|صوم|حج|إسلام|قرآن|prayer|prière|islami/i, '🕌'],
  [/صحة|جسم|عضو|حواس|غذاء|رياضة|حركة|santé|health|sport|corps|body/i, '💪'],
  [/فن|رسم|تلوين|موسيقى|زخرفة|art|dessin|music/i, '🎨'],
  [/أسرة|عائلة|عائلي|famille|family|صداقة|تعاون|coopération/i, '🤝'],
  [/لون|ألوان|couleur|colour|color/i, '🎨'],
  [/طقس|فصل|shams|شمس|مطر| seasons|saison/i, '🌦️'],
  [/عدد|قيمة|مكان|place value|value|قيمة مكانية/i, '🔢'],
]
function iconFor(heading) {
  for (const [re, icon] of ICON_RULES) if (re.test(heading || '')) return icon
  return '📚'
}

const DIFFICULTY_BY_LEVEL = {
  l_pre: 'easy', l_p1: 'easy', l_p2: 'easy', l_p3: 'medium',
  l_p4: 'medium', l_p5: 'medium', l_p6: 'hard',
}
const DIFFICULTY_BY_INDEX = ['easy', 'medium', 'medium', 'hard']
const TRILINGUAL = new Set(['sub_math', 'sub_sci'])
const CREATED_AT = '2026-11-20T09:00:00Z'

const lessonContents = []
const translations = {}
const questions = []
const outcomes = []
const titleByLessonId = {}
let outcomeSeq = 200

function levelCode(levelId) {
  return String(levelId || '').replace(/^l_/, '')
}

for (const curriculum of db.curriculum) {
  const spec = specs[curriculum.id]
  if (!spec || !Array.isArray(spec.lessons)) continue
  for (let index = 0; index < curriculum.lessons.length; index++) {
    const lesson = spec.lessons[index]
    if (!lesson) continue
    const lessonId = `${curriculum.id}:${index}`
    const contentId = `lc_v6_${curriculum.id}_${index}`
    titleByLessonId[lessonId] = lesson.t

    // Shared backbone interleaves with lesson-specific material so every
    // lesson has six teaching steps and no two siblings read the same.
    const sectionPlan = [
      spec.shared.sections[0], lesson.sections[0],
      spec.shared.sections[1], lesson.sections[1],
      spec.shared.sections[2], spec.shared.sections[3],
    ]
    const diagram = spec.shared.diagram || ''
    const sections = sectionPlan.map((entry, sectionIndex) => ({
      id: `${contentId}_s${sectionIndex + 1}`,
      heading: entry[0],
      body: entry[1],
      icon: iconFor(entry[0]),
      mediaType: diagram && sectionIndex === 0 ? 'image' : 'text',
      mediaUrl: diagram && sectionIndex === 0 ? `/illustrations/diagrams/${diagram}` : '',
      durationMin: sectionIndex === 0 ? 3 : 2,
    }))
    const keyTerms = spec.shared.vocab.map(([term, definition]) => ({ term, definition }))
    const workedExamples = lesson.examples.map((example, exampleIndex) => ({
      id: `${contentId}_we${exampleIndex + 1}`,
      prompt: example[0],
      steps: example[1],
      answer: example[2],
    }))

    const quizQuestionIds = []
    lesson.questions.forEach((question, questionIndex) => {
      const questionId = `q_v6_${curriculum.id}_${index}_${questionIndex}`
      quizQuestionIds.push(questionId)
      questions.push({
        id: questionId,
        levelId: curriculum.levelId,
        subjectId: curriculum.subjectId,
        term: curriculum.term || 'الفصل 1',
        difficulty: DIFFICULTY_BY_INDEX[questionIndex] || DIFFICULTY_BY_LEVEL[curriculum.levelId] || 'medium',
        prompt: question[0],
        options: question[1],
        correctIndex: question[2],
        skill: curriculum.unit,
        explanation: question[3],
        status: 'active',
        createdAt: CREATED_AT,
        createdBy: 'u_t1',
      })
    })

    const content = {
      id: contentId,
      lessonId,
      curriculumId: curriculum.id,
      levelId: curriculum.levelId,
      subjectId: curriculum.subjectId,
      subject: subjects.get(curriculum.subjectId) || curriculum.subjectId,
      levelName: levels.get(curriculum.levelId) || curriculum.levelId,
      title: lesson.t,
      intro: lesson.intro,
      sections,
      keyTerms,
      workedExamples,
      quizQuestionIds,
      estimatedMinutes: 6 + sections.length * 2,
      difficulty: DIFFICULTY_BY_LEVEL[curriculum.levelId] || 'medium',
      prerequisites: index > 0 ? [`${curriculum.id}:${index - 1}`] : [],
      status: 'published',
    }

    if (TRILINGUAL.has(curriculum.subjectId) && lesson.tr) {
      translations[contentId] = {}
      for (const lang of ['fr', 'en']) {
        const variant = lesson.tr[lang]
        if (!variant) continue
        translations[contentId][lang] = {
          title: variant.t,
          intro: variant.intro,
          sections: variant.sections.map((entry, sectionIndex) => ({
            id: sections[sectionIndex].id,
            heading: entry[0],
            body: entry[1],
            icon: sections[sectionIndex].icon,
            mediaType: sections[sectionIndex].mediaType,
            mediaUrl: sections[sectionIndex].mediaUrl,
            durationMin: sections[sectionIndex].durationMin,
          })),
          keyTerms: variant.vocab.map(([term, definition]) => ({ term, definition })),
          workedExamples: variant.examples.map((example, exampleIndex) => ({
            id: workedExamples[exampleIndex].id,
            prompt: example[0],
            steps: example[1],
            answer: example[2],
          })),
        }
      }
    }

    // Measurable outcomes are added for scientific subjects where the unit
    // specs carry reviewed trilingual outcome statements.
    if (TRILINGUAL.has(curriculum.subjectId) && spec.shared.outcomeTr) {
      const offset = index % 2
      content.learningOutcomes = [0, 1].map((pick) => {
        const i = offset + pick
        const code = `LO-l_${levelCode(curriculum.levelId)}-sub_${curriculum.subjectId.replace(/^sub_/, '')}-${++outcomeSeq}`
        const outcome = {
          code,
          textAr: spec.shared.outcomes[i],
          textFr: spec.shared.outcomeTr.fr[i],
          textEn: spec.shared.outcomeTr.en[i],
        }
        outcomes.push({
          code,
          levelId: curriculum.levelId,
          subjectId: curriculum.subjectId,
          textAr: outcome.textAr,
          textFr: outcome.textFr,
          textEn: outcome.textEn,
        })
        return outcome
      })
    }

    lessonContents.push(content)
  }
}

module.exports = { lessonContents, translations, questions, outcomes, titleByLessonId }
