#!/usr/bin/env node
/**
 * Expand the authentic Tamazight (Tachelhit) audio library.
 *
 * Uses the public Tamazight-NLP VITS TTS space (the same source as the 30
 * existing clips) through its Gradio HTTP API, then copies the generated WAVs
 * into apps/web/public/audio/amz/ and registers them in manifest.json.
 *
 * Source texts are taken ONLY from Tifinagh strings already authored in the
 * app's Amazigh locale (apps/web/src/i18n/locales/amz.ts). We do not invent
 * Amazigh text. Clip meanings are copied from the i18n catalogue when the key
 * exists there, so the UI can show a translation alongside every clip.
 *
 * Usage:
 *   node scripts/generate-amz-audio.js --dry-run
 *   node scripts/generate-amz-audio.js --limit=50
 */
'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ROOT = path.resolve(__dirname, '..')
const AMZ_DIR = path.join(ROOT, 'apps', 'web', 'public', 'audio', 'amz')
const MANIFEST_PATH = path.join(AMZ_DIR, 'manifest.json')
const AMZ_LOCALE = path.join(ROOT, 'apps', 'web', 'src', 'i18n', 'locales', 'amz.ts')
const I18N_CATALOGUE = path.join(ROOT, 'docs', 'review', 'i18n-translations.json')

const API = process.env.AMZ_TTS_BASE_URL || 'https://tamazight-nlp-tts.hf.space'
const ENDPOINT = `${API}/gradio_api/call/predict`
const VARIANT = process.env.AMZ_TTS_VARIANT || 'shi'
const SPEAKER = process.env.AMZ_TTS_SPEAKER || 'yan'
const TIFINAGH = /[\u2D30-\u2D7F]/
const LATIN = /[A-Za-z]/

const argv = new Set(process.argv.slice(2))
const DRY_RUN = argv.has('--dry-run')
const limitArg = [...argv].find((a) => a.startsWith('--limit='))
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : 60

function normalize(text) {
  return String(text || '')
    .trim()
    .replace(/…/g, '.')
    .replace(/[^\u2D30-\u2D7F0-9 !,.:?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hash(text) {
  return crypto.createHash('sha1').update(text).digest('hex').slice(0, 12)
}

function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
}

/** Parse key/value pairs out of the simple Amazigh locale object. */
function parseLocale(source) {
  const entries = []
  const valueRe = /(['"])((?:\\.|(?!\1)[^\\])*)\1/g
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z0-9_.-]+))\s*:\s*(.*?)\s*,?\s*$/)
    if (!match) continue
    const key = match[1] || match[2] || match[3]
    const rest = match[4] || ''
    const valueMatch = valueRe.exec(rest)
    valueRe.lastIndex = 0
    if (valueMatch) entries.push({ key, value: valueMatch[2].replace(/\\'/g, "'") })
  }
  return entries
}

function candidates(manifest) {
  const source = fs.readFileSync(AMZ_LOCALE, 'utf8')
  const catalogue = JSON.parse(fs.readFileSync(I18N_CATALOGUE, 'utf8'))
  const existing = new Set(Object.values(manifest.items || {}).map((item) => normalize(item.text)))
  const seen = new Set()
  const result = []
  for (const { key, value } of parseLocale(source)) {
    if (!TIFINAGH.test(value) || LATIN.test(value) || value.includes('{{')) continue
    const text = normalize(value)
    if (text.length < 2 || text.length > 90 || existing.has(text) || seen.has(text)) continue
    seen.add(text)
    const translation = catalogue[key] || {}
    result.push({
      id: `ui-${hash(text)}`,
      text,
      key,
      meaning: {
        ar: translation.ar || '',
        fr: translation.fr || '',
        en: translation.en || '',
      },
    })
  }
  return result.sort((a, b) => a.text.length - b.text.length).slice(0, LIMIT)
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${await res.text()}`)
  return res.json()
}

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

/** Ask the Gradio API for one clip and return its audio bytes. */
async function synthesize(text) {
  const data = [text, VARIANT, SPEAKER, false, null, 'freevc24']
  const { event_id: eventId } = await postJson(ENDPOINT, { data })
  if (!eventId) throw new Error('no event id returned')

  let payload = null
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const res = await fetch(`${API}/gradio_api/call/predict/${eventId}`)
    const body = await res.text()
    const dataLine = body.split(/\r?\n/).find((line) => line.startsWith('data: '))
    if (dataLine) {
      try {
        payload = JSON.parse(dataLine.slice(6))
        break
      } catch {
        // streamed partial data; keep polling
      }
    }
    if (body.includes('event: error')) throw new Error(body.slice(0, 300))
    await new Promise((resolve) => setTimeout(resolve, 700))
  }
  if (!payload) throw new Error('timed out waiting for audio')

  const file = Array.isArray(payload) ? payload[0] : payload
  const filePath = file && (file.path || file.url)
  if (!filePath) throw new Error('no audio returned')
  // The public file route lives at /gradio_api/file=..., not /g/gradio_api/file=...
  const downloadUrl = `${API}/gradio_api/file=${filePath.replace(/^\/g/, '')}`
  const audioRes = await fetch(downloadUrl)
  if (!audioRes.ok) throw new Error(`audio download HTTP ${audioRes.status}`)
  return Buffer.from(await audioRes.arrayBuffer())
}

async function main() {
  const manifest = loadManifest()
  const todo = candidates(manifest)
  console.log(`Amazigh TTS source: ${API} (${VARIANT}/${SPEAKER})`)
  console.log(`Available Tifinagh texts: ${todo.length}, existing clips: ${Object.keys(manifest.items).length}`)

  if (DRY_RUN) {
    for (const item of todo.slice(0, 20)) console.log(`  ${item.text} — ${item.meaning.ar || item.key}`)
    return
  }

  let added = 0
  let failed = 0
  for (const item of todo) {
    try {
      const audio = await synthesize(item.text)
      if (audio.length < 1000) throw new Error(`suspiciously small audio (${audio.length} bytes)`)
      const file = `${item.id}.wav`
      fs.writeFileSync(path.join(AMZ_DIR, file), audio)
      manifest.items[item.id] = {
        text: item.text,
        file,
        bytes: audio.length,
        key: item.key,
        meaning: item.meaning,
      }
      saveManifest(manifest)
      added += 1
      console.log(`[${added}/${todo.length}] ${item.text} -> ${file} (${audio.length} bytes)`)
    } catch (err) {
      failed += 1
      console.warn(`SKIP ${item.text}: ${err.message}`)
    }
  }
  console.log(`Done: added ${added}, failed ${failed}, total ${Object.keys(manifest.items).length}`)
}

main().catch((err) => {
  console.error(err.message || err)
  process.exitCode = 1
})
