/**
 * Extract i18n keys used by the app that are missing from ar.ts.
 * Emits docs/review/i18n-missing-keys.json with the Arabic default values.
 */
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const src = path.join(root, 'apps', 'web', 'src')
const arFile = path.join(src, 'i18n', 'locales', 'ar.ts')
const ar = fs.readFileSync(arFile, 'utf8')

const files = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.tsx?$/.test(entry.name) && !full.includes(`${path.sep}i18n${path.sep}`)) files.push(full)
  }
}
walk(src)

// `defaultValue` is not always the first option (e.g. `t('key', { count, defaultValue })`),
// so find the call first and then look for its defaultValue within the same options object.
const callPattern = /t\(\s*'([A-Za-z0-9_.]+)'\s*,\s*\{/g
const defaultValuePattern = /^defaultValue:\s*'((?:\\'|[^'])*)'/
const missing = new Map()
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8')
  let match
  while ((match = callPattern.exec(text))) {
    // Scan the options object with depth + string tracking. Only a
    // `defaultValue` at depth 1 belongs to this call; nested t() calls or
    // interpolation placeholders must not supply its default text.
    const open = match.index + match[0].length - 1
    let depth = 0
    let quote = ''
    let inEscape = false
    let def = null
    for (let i = open; i < text.length && !def; i += 1) {
      const ch = text[i]
      if (quote) {
        if (inEscape) inEscape = false
        else if (ch === '\\') inEscape = true
        else if (ch === quote) quote = ''
        continue
      }
      if (ch === "'" || ch === '"' || ch === '`') {
        quote = ch
        continue
      }
      if (ch === '{') depth += 1
      else if (ch === '}') {
        depth -= 1
        if (depth === 0) break
      } else if (depth === 1 && ch === 'd') {
        def = defaultValuePattern.exec(text.slice(i, i + 200))
      }
    }
    if (!def) continue
    const key = match[1]
    const value = def[1].replace(/\\'/g, "'")
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (new RegExp(`^\\s{2}(?:'${escaped}'|${escaped}):`, 'm').test(ar)) continue
    if (!missing.has(key)) missing.set(key, value)
  }
}

const out = {}
for (const [key, value] of [...missing.entries()].sort(([a], [b]) => a.localeCompare(b))) out[key] = value
const target = path.join(root, 'docs', 'review', 'i18n-missing-keys.json')
fs.mkdirSync(path.dirname(target), { recursive: true })
fs.writeFileSync(target, JSON.stringify(out, null, 2))
console.log(`scanned ${files.length} files; missing ${Object.keys(out).length} keys -> ${target}`)
console.log(Object.keys(out).join('\n'))
