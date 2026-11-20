/**
 * Static quality gates for the v6 full-curriculum content specs.
 * Run: node scripts/validate-v6-content.js
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const db = JSON.parse(fs.readFileSync(path.join(root, 'backend', 'data.json'), 'utf8'))
const letters = 'ABCDEFGH'.split('')
const diagrams = new Set([
  'diagram-fractions.svg', 'diagram-shapes.svg', 'diagram-place-value.svg',
  'diagram-multiplication.svg', 'diagram-states-of-matter.svg', 'diagram-five-senses.svg',
  'diagram-animals.svg', 'diagram-body.svg', 'diagram-family.svg', 'diagram-colors.svg',
  'diagram-seasons.svg', 'diagram-prayer.svg', 'diagram-french-alphabet.svg',
  'diagram-morocco-map.svg',
])
const errors = []
const units = {}
for (const letter of letters) {
  const file = path.join(root, 'scripts', 'curriculum-content', `v6-content-${letter}.js`)
  const mod = require(file)
  if (!mod.units || typeof mod.units !== 'object') { errors.push(`${letter}: no units map`); continue }
  for (const [id, unit] of Object.entries(mod.units)) {
    if (units[id]) errors.push(`${letter}: duplicate unit ${id} (also in ${units[id]})`)
    units[id] = letter
    const declared = db.curriculum.find((c) => c.id === id)
    if (!declared) { errors.push(`${id}: unknown curriculum id`); continue }
    if (!unit.shared || !Array.isArray(unit.shared.sections) || unit.shared.sections.length !== 4) errors.push(`${id}: shared.sections must have 4 entries`)
    if (!Array.isArray(unit.shared?.vocab) || unit.shared.vocab.length !== 6) errors.push(`${id}: shared.vocab must have 6 entries`)
    if (!Array.isArray(unit.shared?.outcomes) || unit.shared.outcomes.length !== 4) errors.push(`${id}: shared.outcomes must have 4 entries`)
    if (unit.shared?.diagram && !diagrams.has(unit.shared.diagram)) errors.push(`${id}: unknown diagram ${unit.shared.diagram}`)
    if (!Array.isArray(unit.lessons) || unit.lessons.length !== declared.lessons.length) {
      errors.push(`${id}: expected ${declared.lessons.length} lessons, got ${unit.lessons?.length}`)
      continue
    }
    const headings = new Set()
    const questionPrompts = new Set()
    const examplePrompts = new Set()
    for (const s of unit.shared.sections || []) if (s[0]) headings.add(s[0])
    for (let i = 0; i < unit.lessons.length; i++) {
      const l = unit.lessons[i]
      const tag = `${id}:${i}`
      if (typeof l.t !== 'string' || l.t.trim().length < 4) errors.push(`${tag}: weak title`)
      if (/^(درس|Leçon|Lesson|Lektion|الوحدة)\s*\d+$/i.test(l.t?.trim() || '')) errors.push(`${tag}: generic title "${l.t}"`)
      if (typeof l.intro !== 'string' || l.intro.trim().length < 40) errors.push(`${tag}: intro too short`)
      if (!Array.isArray(l.sections) || l.sections.length !== 2) errors.push(`${tag}: sections must have 2 entries`)
      for (const s of l.sections || []) {
        if (!Array.isArray(s) || s.length !== 2 || !s[0] || !s[1] || s[1].length < 60) errors.push(`${tag}: weak section`)
        if (s[0] && headings.has(s[0])) errors.push(`${tag}: repeated heading "${s[0]}"`)
        if (s[0]) headings.add(s[0])
      }
      if (!Array.isArray(l.examples) || l.examples.length !== 2) errors.push(`${tag}: examples must have 2 entries`)
      for (const e of l.examples || []) {
        if (!Array.isArray(e) || e.length !== 3 || !e[0] || !e[2]) errors.push(`${tag}: weak example`)
        if (e[0] && examplePrompts.has(e[0])) errors.push(`${tag}: repeated example prompt`)
        if (e[0]) examplePrompts.add(e[0])
        if (!Array.isArray(e[1]) || e[1].length < 2 || e[1].some((x) => !x)) errors.push(`${tag}: example needs at least 2 non-empty steps`)
      }
      if (!Array.isArray(l.questions) || l.questions.length !== 4) errors.push(`${tag}: questions must have 4 entries`)
      for (const q of l.questions || []) {
        if (!Array.isArray(q) || q.length !== 4) { errors.push(`${tag}: malformed question`); continue }
        const [prompt, options, correctIndex, explanation] = q
        if (!prompt || prompt.length < 10) errors.push(`${tag}: weak question prompt`)
        if (questionPrompts.has(prompt)) errors.push(`${tag}: repeated question prompt`)
        questionPrompts.add(prompt)
        if (!Array.isArray(options) || options.length !== 4 || options.some((o) => !o)) errors.push(`${tag}: question needs 4 options`)
        if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) errors.push(`${tag}: bad correctIndex`)
        if (!explanation || explanation.length < 20) errors.push(`${tag}: weak explanation`)
      }
      if (['sub_math', 'sub_sci'].includes(declared.subjectId)) {
        if (!l.tr || !l.tr.fr || !l.tr.en) { errors.push(`${tag}: scientific lesson needs fr/en translations`); continue }
        for (const lang of ['fr', 'en']) {
          const tr = l.tr[lang]
          if (!tr.t || !tr.intro || !Array.isArray(tr.sections) || tr.sections.length !== 6 || !Array.isArray(tr.vocab) || tr.vocab.length !== 6 || !Array.isArray(tr.examples) || tr.examples.length !== 2) {
            errors.push(`${tag}: ${lang} translation shape mismatch`)
          }
          if ((tr.sections || []).some((s) => !Array.isArray(s) || !s[0] || !s[1])) errors.push(`${tag}: ${lang} section translation incomplete`)
        }
      }
    }
  }
}

for (const c of db.curriculum) if (!units[c.id]) errors.push(`missing unit ${c.id}`)
const lessonCount = Object.values(units).reduce((n, letter) => n + 0, 0)
const totalLessons = Object.entries(units).reduce((n, [id]) => n + (db.curriculum.find((c) => c.id === id)?.lessons.length || 0), 0)
console.log(`v6 validation: ${Object.keys(units).length} units, ${totalLessons} lessons, ${errors.length} problems`)
const byKind = {}
for (const e of errors) { const k = e.replace(/^.*?: /, '').replace(/"[^"]*"/g, '"…"'); byKind[k] = (byKind[k] || 0) + 1 }
console.log(byKind)
for (const e of errors.slice(0, 80)) console.log(' -', e)
if (errors.length > 80) console.log(` ... and ${errors.length - 80} more`)
process.exit(errors.length ? 1 : 0)
