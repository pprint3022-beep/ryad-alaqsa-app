/**
 * Multilingual read-aloud helper for the child-friendly learning experience.
 *
 * Audio source priority:
 * 1. Authentic/curated recorded clips (Amazigh exact phrases in /audio/amz/,
 *    and any pre-generated "natural AI voice" clips listed in /audio/tts/manifest.json).
 *    This enables "copy into the app" audio built with external TTS services.
 * 2. Browser SpeechSynthesis with a locale-matching voice (preferring natural/
 *    neural voices when installed).
 *
 * Arabic and Tifinagh text is never handed to an unrelated default voice.
 * If no suitable voice or clip exists, playback stays silent. All speech is
 * optional and user-triggered; nothing is auto-played.
 */

export type SpeakLocale = 'ar' | 'fr' | 'en' | 'amz'

const BROWSER_LANG: Record<SpeakLocale, string> = {
  ar: 'ar-MA',
  fr: 'fr-FR',
  en: 'en-GB',
  amz: 'zgh',
}

const ARABIC_SCRIPT = /[\u0600-\u06FF]/
const TIFINAGH_SCRIPT = /[\u2D30-\u2D7F]/

/** A curated authentic Amazigh clip listed in /audio/amz/manifest.json. */
export interface AmzClip {
  text: string
  file: string
  bytes?: number
  key?: string
  meaning?: { ar?: string; fr?: string; en?: string }
}

type AmzManifest = { items?: Record<string, AmzClip> }
let amzManifest: AmzManifest | null = null
let amzManifestPromise: Promise<AmzManifest> | null = null

/**
 * Pre-generated natural-voice audio bundled into the app (e.g. produced with
 * an external TTS service and copied into /audio/tts/). Maps a stable key
 * "<locale>\n<normalized text>" to a filename inside /audio/tts/.
 */
type TtsManifest = Record<string, string>
let ttsManifest: TtsManifest | null = null
let ttsManifestPromise: Promise<TtsManifest> | null = null

let activeAudio: HTMLAudioElement | null = null

function stopAudio() {
  if (!activeAudio) return
  const audio = activeAudio
  activeAudio = null
  audio.onended = null
  audio.onerror = null
  audio.pause()
}

function normalize(text: string) {
  return text.trim().replace(/\s+/g, ' ')
}

/** Stable key for bundled TTS lookup. */
function ttsKey(text: string, locale: SpeakLocale): string {
  return `${locale}\n${normalize(text)}`
}

async function loadTtsManifest(): Promise<TtsManifest> {
  if (ttsManifest) return ttsManifest
  if (ttsManifestPromise) return ttsManifestPromise
  ttsManifestPromise = (async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}audio/tts/manifest.json`, { cache: 'force-cache' })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as unknown
      ttsManifest = data && typeof data === 'object' && !Array.isArray(data) ? (data as TtsManifest) : {}
      return ttsManifest
    } catch {
      // Do not cache a failed fetch: copied-in audio may appear later.
      return {} as TtsManifest
    } finally {
      ttsManifestPromise = null
    }
  })()
  return ttsManifestPromise
}

/** Returns a bundled pre-generated audio URL for this text/locale, if available. */
export async function ttsClipFor(text: string, locale: SpeakLocale): Promise<string | null> {
  const manifest = await loadTtsManifest()
  const file = manifest[ttsKey(text, locale)]
  return typeof file === 'string' && file ? `${import.meta.env.BASE_URL}audio/tts/${file}` : null
}

/**
 * Pick the voice locale from the text itself so a French or English voice is
 * never asked to read Arabic script (and vice versa). Tifinagh keeps `amz`,
 * where exact phrases use the authentic recordings and other text falls back.
 */
export function detectLocale(text: string, fallback: SpeakLocale): SpeakLocale {
  if (TIFINAGH_SCRIPT.test(text)) return 'amz'
  if (ARABIC_SCRIPT.test(text)) return 'ar'
  return fallback
}

async function loadAmzManifest(): Promise<AmzManifest> {
  if (amzManifest) return amzManifest
  if (amzManifestPromise) return amzManifestPromise
  amzManifestPromise = (async () => {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}audio/amz/manifest.json`, { cache: 'force-cache' })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as AmzManifest
      amzManifest = data && typeof data === 'object' ? data : {}
      return amzManifest
    } catch {
      // Keep retrying rather than caching an empty manifest forever.
      return {} as AmzManifest
    } finally {
      amzManifestPromise = null
    }
  })()
  return amzManifestPromise
}

/** All authentic Amazigh clips currently bundled in the app. */
export async function listAmzClips(): Promise<AmzClip[]> {
  const manifest = await loadAmzManifest()
  const items = Object.values(manifest.items || {})
  return items
    .filter((item) => item && typeof item.text === 'string' && typeof item.file === 'string')
    .sort((a, b) => a.text.localeCompare(b.text, 'tzm'))
}

/** Returns the recorded clip URL for an exact Tamazight phrase, if available. */
export async function amzClipFor(text: string): Promise<string | null> {
  const clean = normalize(text)
  const items = Object.values((await loadAmzManifest()).items || {})
  const match = items.find((item) => normalize(item.text) === clean)
  return match ? `${import.meta.env.BASE_URL}audio/amz/${match.file}` : null
}

/** Chromium may return an empty voice list on first load; wait for voiceschanged. */
function getVoices(synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const existing = synth.getVoices()
  if (existing.length) return Promise.resolve(existing)
  return new Promise((resolve) => {
    let settled = false
    let timer = 0
    const finish = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      synth.removeEventListener('voiceschanged', finish)
      resolve(synth.getVoices())
    }
    synth.addEventListener('voiceschanged', finish)
    timer = window.setTimeout(finish, 500)
  })
}

function pickVoice(voices: SpeechSynthesisVoice[], prefixes: string[], targetLang: string): SpeechSynthesisVoice | undefined {
  const matches = voices.filter((v) => prefixes.some((p) => v.lang.toLowerCase().startsWith(p)))
  if (!matches.length) return undefined
  const score = (v: SpeechSynthesisVoice): number => {
    const name = v.name.toLowerCase()
    const lang = v.lang.toLowerCase()
    let s = 0
    if (lang === targetLang.toLowerCase()) s += 10
    if (/natural|neural|online|premium|enhanced/.test(name)) s += 5
    if (v.localService === false) s += 1
    return s
  }
  return matches.sort((a, b) => score(b) - score(a))[0]
}

async function browserSpeak(text: string, locale: SpeakLocale): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const voices = await getVoices(synth)
  const utter = new SpeechSynthesisUtterance(text)
  const targetLang = BROWSER_LANG[locale] || 'en-GB'
  utter.lang = targetLang
  utter.rate = 0.9
  utter.pitch = 1.05

  const needsArabic = ARABIC_SCRIPT.test(text)
  const needsTifinagh = TIFINAGH_SCRIPT.test(text)

  let match: SpeechSynthesisVoice | undefined
  if (needsTifinagh) {
    match = pickVoice(voices, ['zgh'], 'zgh')
  } else if (needsArabic) {
    match = pickVoice(voices, ['ar'], targetLang)
  } else if (locale === 'amz') {
    match = pickVoice(voices, ['zgh', 'ar'], targetLang)
  } else {
    match = pickVoice(voices, [locale], targetLang)
  }

  // Never let Arabic or Tifinagh be read by an unrelated default voice.
  if (!match && (needsArabic || needsTifinagh)) return
  if (match) {
    utter.voice = match
    utter.lang = match.lang
  }

  await new Promise<void>((resolve) => {
    let timer = 0
    const done = () => {
      if (timer) window.clearTimeout(timer)
      resolve()
    }
    utter.onend = done
    utter.onerror = done
    synth.speak(utter)
    timer = window.setTimeout(done, Math.max(2500, text.length * 130))
  })
}

function playAudioUrl(url: string, onFail: () => Promise<void>): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(url)
    activeAudio = audio
    const clear = () => { if (activeAudio === audio) activeAudio = null }
    const fallback = () => { clear(); void onFail().then(resolve) }
    audio.onended = () => { clear(); resolve() }
    audio.onerror = fallback
    void audio.play().catch(fallback)
  })
}

/**
 * Read `text` aloud. Prefers bundled pre-generated natural-voice audio (copied
 * into the app) when available, then falls back to browser speech. Resolves
 * when playback finishes so callers can animate a speaking state.
 */
export async function speakText(text: string, locale: SpeakLocale): Promise<void> {
  const clean = normalize(text)
  if (!clean) return
  stopAudio()

  // 1) Authentic Amazigh exact-phrase recordings ONLY. If a phrase has no
  // bundled recording, stay silent rather than let an unrelated voice read it.
  if (locale === 'amz') {
    const amz = await amzClipFor(clean)
    if (!amz) return
    return playAudioUrl(amz, () => Promise.resolve())
  }

  // 2) Pre-generated/bundled natural AI voice audio (external TTS copied in)
  const tts = await ttsClipFor(clean, locale)
  if (tts) {
    return playAudioUrl(tts, () => browserSpeak(clean, locale))
  }

  // 3) Browser voice (prefers natural/neural when installed)
  await browserSpeak(clean, locale)
}

export function stopSpeaking() {
  stopAudio()
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
}
