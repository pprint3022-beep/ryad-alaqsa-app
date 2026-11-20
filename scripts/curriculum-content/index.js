/**
 * v4–v6 curriculum enrichment for the prototype JSON store.
 *
 * Collects the additional Moroccan-primary lessons produced by the content
 * agents (French lower/upper-primary lessons, Arabic/science/islam/history
 * lessons with French and English variants, v5 outcome-linked lessons, and
 * the v6 full-curriculum coverage set) into one module so
 * `seed-lesson-content-demo.js` has a single integration point. It also
 * collects the measurable learning-outcome catalogue.
 *
 * Each source module is allowed to contribute:
 *   - lessonContents: base (Arabic or French) lesson objects
 *   - translations:   { [contentId]: { fr, en } } aligned to the base
 *   - questions:      advisory question-bank items
 *   - outcomes:       measurable learning-outcome records
 *
 * The seed script owns ids, timestamps, icons, media inheritance and guard
 * bumps. This file only merges — it never writes to the store.
 */
const modules = [
  require('./fr-lessons-lower'),
  require('./fr-lessons-upper'),
  require('./ar-subjects-lessons'),
  require('./v5-outcomes-lessons'),
  require('./v5-outcome-catalog'),
  require('./v6-coverage'),
]

const lessonContents = []
const translations = {}
const questions = []
const outcomes = []
const titleByLessonId = {}

for (const mod of modules) {
  for (const content of mod.lessonContents || []) lessonContents.push(content)
  Object.assign(translations, mod.translations || {})
  for (const question of mod.questions || []) questions.push(question)
  for (const outcome of mod.outcomes || []) outcomes.push(outcome)
  Object.assign(titleByLessonId, mod.titleByLessonId || {})
}

module.exports = { lessonContents, translations, questions, outcomes, titleByLessonId }
