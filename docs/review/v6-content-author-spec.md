# v6 curriculum content authoring spec (internal)

Goal: replace the current 52-lesson / ~2-question prototype content with **complete coverage of every declared curriculum lesson** (`backend/data.json` → `curriculum[].lessons[]`, 96 units / 380 slots) and materially deeper, non-repetitive lessons.

## Source of truth

- Each agent owns `scripts/curriculum-content/v6-manifest-<A..H>.json`.
- Agent output file: `scripts/curriculum-content/v6-content-<A..H>.js` (CommonJS, `module.exports = { units: { ... } }`).
- The generator `scripts/curriculum-content/v6-coverage.js` (written by the integrator) expands these compact specs into `lessonContents`, `translations`, `questions`, `outcomes`, and updates curriculum lesson titles.

## Compact unit spec

```js
module.exports = {
  units: {
    'cur_l_p5_sub_math': {
      shared: {
        sections: [ ['heading', 'body'], ... 4 ],        // common conceptual backbone
        vocab: [ ['term', 'definition'], ... 6 ],
        outcomes: [ 'measurable outcome 1', ... 4 ],
        diagram: 'diagram-fractions.svg'                  // or '' when none fits
      },
      lessons: [                                          // exactly 4, in manifest order
        {
          t: 'الكسور العشرية',                            // meaningful title (never "درس 1")
          intro: '...',                                   // 1-2 sentences, age-appropriate
          sections: [ ['heading','body'], ... 2 ],        // lesson-specific, NOT repeated
          examples: [ ['prompt', ['step1','step2','step3'], 'answer'], ... 2 ],
          questions: [                                    // exactly 4, unique to this lesson
            ['prompt', ['correct','wrong1','wrong2','wrong3'], 0, 'teaching explanation'],
            ... 4
          ],
          tr: {                                           // REQUIRED only for sub_math / sub_sci
            fr: { t, intro, sections:[...6], vocab:[...6], examples:[...2] },
            en: { t, intro, sections:[...6], vocab:[...6], examples:[...2] }
          }
        }, ... 4
      ]
    }
  }
}
```

Section order in a generated lesson: `shared.sections[0]`, `lesson.sections[0]`, `shared.sections[1]`, `lesson.sections[1]`, `shared.sections[2]`, `shared.sections[3]`. Therefore `tr.fr.sections` / `tr.en.sections` MUST contain exactly 6 entries in that same order. `vocab` in translations must align with `shared.vocab` (6 entries). `examples` in translations align with `lesson.examples` (2 entries).

## Content language

| `subjectId` | Base language |
|---|---|
| `sub_math`, `sub_sci`, `sub_ar`, `sub_isl`, `sub_histgeo`, `sub_cul`, `sub_art`, `sub_sport` | Arabic (full Arabic script, short sentences) |
| `sub_fr` | French |
| `sub_en` | English |
| `sub_amz` | French base with authentic Amazigh/Tifinagh terms where relevant (never claim machine translation is certified) |
| `sub_es`, `sub_de`, `sub_it` | Target language, simple A1–A2 sentences |

`tr` (full fr/en) is mandatory **only** for `sub_math` and `sub_sci`, per the scientific-subjects requirement. For other subjects the native target language is the learning content; do not add `tr`.

## Quality rules (non-negotiable)

1. **Real curriculum topics.** Use the unit name and level to choose age-appropriate topics. Replace generic declared titles such as «درس 1», «Leçon 1», «Lesson 1» with specific curriculum topics. Keep the 4 lesson slots in a coherent sequence (concept → practice → application → assessment/review).
2. **Depth.** Each lesson = 6 sections (2–3 sentences each), 2 fully worked examples with numbered reasoning steps, 3 key terms, 4 questions, 2 measurable outcomes. Arabic primary: concrete Moroccan contexts (dirham, souk, olive tree, atlas, Ramadan, school, family, weather). No abstract filler.
3. **No repetition.** Across the 4 lessons of a unit, every section heading, example prompt, question prompt, and option set must be different. Across levels, revisit a theme only with a higher cognitive demand (pre: name → p3: explain → p6: analyse/solve multi-step).
4. **Questions teach.** Vary the demand: recall, concept discrimination, application, and short problem/explanation. All 4 options plausible; distractors must not be jokes. `correctIndex` is 0-based. `explanation` must state *why*, not just repeat the answer.
5. **Safety & governance.** Formative/advisory only; never mention official grades. No political claims. Morocco map references must use `diagram-morocco-map.svg` with the official contiguous convention; do not invent borders or disclaimers.
6. **Diagram list (only these filenames):** `diagram-fractions.svg`, `diagram-shapes.svg`, `diagram-place-value.svg`, `diagram-multiplication.svg`, `diagram-states-of-matter.svg`, `diagram-five-senses.svg`, `diagram-animals.svg`, `diagram-body.svg`, `diagram-family.svg`, `diagram-colors.svg`, `diagram-seasons.svg`, `diagram-prayer.svg`, `diagram-french-alphabet.svg`, `diagram-morocco-map.svg`. Use `''` when none genuinely fits. Referenced diagrams must be meaningful for at least one section.
7. **Valid JS.** Escape apostrophes/backticks correctly. Use ASCII quotes for JS strings; Unicode text is fine inside strings. No trailing commas that break older parsers (Node 20+ tolerates them, but keep clean). No `require()` besides `module.exports`.

## Integration contract

- Do **not** edit `backend/data.json`, the seed script, `index.js`, tests, or docs.
- Do **not** create question ids; the generator assigns stable ids from curriculum id + lesson index + question index.
- Return only a short confirmation listing the file written, unit count, and lesson count.
