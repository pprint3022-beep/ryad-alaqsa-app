#!/usr/bin/env node
/**
 * Generate natural-voice audio from lesson/text content using an external TTS
 * service, then copy the resulting files into the app bundle:
 *   apps/web/public/audio/tts/<file>
 * and register them in apps/web/public/audio/tts/manifest.json so speech.ts
 * plays them in-app (no runtime dependency on the external service).
 *
 * This is a scaffold: configure PROVIDER / API credentials and implement the
 * provider's synthesize() call for the service you choose (Azure, Google Cloud
 * TTS, ElevenLabs, OpenAI TTS, etc.). Amazon Polly, Coqui, Piper and other
 * engines can also be used as long as they output audio files.
 *
 * Usage (example):
 *   node scripts/generate-tts-audio.js --provider=openai --lang=ar,fr,en
 *
 * Environment variables (set the ones your provider needs):
 *   TTS_PROVIDER, OPENAI_API_KEY, AZURE_SPEECH_KEY, AZURE_SPEECH_REGION,
 *   GOOGLE_API_KEY, ELEVENLABS_API_KEY, etc.
 *
 * Manifest key format (must match speech.ts): "<locale>\n<normalized text>"
 * where normalized text = text.trim().replace(/\s+/g, ' ')
 */
'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'apps', 'web', 'public', 'audio', 'tts')
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json')

function normalize(text) {
  return String(text || '').trim().replace(/\s+/g, ' ')
}

function keyFor(locale, text) {
  return `${locale}\n${normalize(text)}`
}

function hashKey(key) {
  return crypto.createHash('sha1').update(key).digest('hex').slice(0, 16)
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  } catch {
    return {}
  }
}

function saveManifest(manifest) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
}

/**
 * IMPLEMENT THIS for your chosen external TTS service.
 * Should return a Buffer (audio bytes, e.g. mp3/wav/ogg).
 *
 * @param {{ text: string, locale: 'ar'|'fr'|'en'|'amz', voice?: string }} opts
 * @returns {Promise<Buffer>}
 */
async function synthesize(opts) {
  const provider = process.env.TTS_PROVIDER || 'none'
  throw new Error(
    `No TTS provider configured (TTS_PROVIDER=${provider}). ` +
      'Edit scripts/generate-tts-audio.js and implement synthesize() for your service, ' +
      'or supply pre-generated audio files and update manifest.json directly.',
  )
}

/**
 * Generate and register one clip. Skips if already present in manifest and file exists.
 */
async function ensureClip(locale, text, ext = 'mp3') {
  const key = keyFor(locale, text)
  const manifest = loadManifest()
  if (manifest[key] && fs.existsSync(path.join(OUT_DIR, manifest[key]))) {
    return { skipped: true, file: manifest[key] }
  }
  const audio = await synthesize({ text: normalize(text), locale })
  const file = `${locale}-${hashKey(key)}.${ext}`
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, file), audio)
  manifest[key] = file
  saveManifest(manifest)
  return { skipped: false, file }
}

async function main() {
  console.log('TTS bundle output:', OUT_DIR)
  console.log('Manifest:', MANIFEST_PATH)
  console.log('')
  console.log('Configure an external TTS provider (set TTS_PROVIDER and credentials)')
  console.log('and implement synthesize() in this script, then call ensureClip(locale, text)')
  console.log('for each lesson segment you want to bundle into the app.')
  console.log('')
  console.log('Example (pseudo):')
  console.log("  await ensureClip('ar', 'مرحبًا بكم في درس اليوم')")
  console.log("  await ensureClip('fr', 'Bienvenue dans la leçon')")
  console.log('')
  console.log('After generation, the app plays these files automatically via speech.ts.')

  // Uncomment and adapt once synthesize() is implemented for your provider:
  // await ensureClip('ar', 'مرحبًا بكم في درس اليوم')
}

main().catch((err) => {
  console.error(err.message || err)
  process.exitCode = 1
})
