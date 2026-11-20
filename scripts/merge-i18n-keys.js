/**
 * Merge docs/review/i18n-translations.json into the four locale files.
 * Idempotent: existing keys are left untouched.
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const locales = path.join(root, 'apps', 'web', 'src', 'i18n', 'locales')
const translations = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'review', 'i18n-translations.json'), 'utf8'))
const codes = ['ar', 'fr', 'en', 'amz']

for (const code of codes) {
  const file = path.join(locales, `${code}.ts`)
  let text = fs.readFileSync(file, 'utf8')
  const additions = []
  for (const [key, values] of Object.entries(translations)) {
    const value = values[code]
    if (typeof value !== 'string' || !value.trim()) continue
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (new RegExp(`^\\s{2}(?:'${escaped}'|${escaped}):`, 'm').test(text)) continue
    const literal = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    additions.push(`  ${key}: '${literal}',`)
  }
  if (additions.length) {
    const closing = text.lastIndexOf('\n}')
    text = text.slice(0, closing) + '\n' + additions.join('\n') + text.slice(closing)
    fs.writeFileSync(file, text)
  }
  console.log(`${code}: added ${additions.length}`)
}

const counts = {}
for (const code of codes) {
  const text = fs.readFileSync(path.join(locales, `${code}.ts`), 'utf8')
  counts[code] = (text.match(/^\s{2}(?:'[^']+'|[A-Za-z0-9_]+):/gm) || []).length
}
console.log('key counts', counts)
const allEqual = Object.values(counts).every((value) => value === counts.ar)
console.log(allEqual ? 'PARITY OK' : 'PARITY MISMATCH')
