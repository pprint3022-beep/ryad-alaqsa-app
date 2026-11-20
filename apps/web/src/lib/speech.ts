/**
 * Multilingual read-aloud helper for the child-friendly learning experience.
 *
 * - Tamazight (amz): uses authentic recorded Tifinagh voice clips generated from
 *   the Tamazight VITS TTS space, served from /audio/amz/*.wav.
 * - Other languages: uses the browser SpeechSynthesis API with a locale-specific
 *   voice (ar-MA, fr-FR, en-GB). Falls back silently when unsupported.
 *
 * Arabic and Tifinagh text is never handed to an unrelated default voice
 * (normally English). If no suitable voice is installed, playback stays silent.
 * All speech is optional and user-triggered; nothing is auto-played.
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

/** Authentic Tifinagh recordings (text as authored in the lesson content). */
const AMZ_CLIPS: Record<string, string> = {
  'ⴰⵣⵓⵍ': 'azul',
  'ⴰⵣⵓⵍ ⴼⵍⵍⴰⵡⵏ': 'azul-fellawen',
  'ⵜⴰⵎⴰⵣⵉⵖⵜ': 'tamazight',
  'ⵜⵉⴼⵉⵏⴰⵖ': 'tifinagh',
  'ⵉⵏⵍⵎⴰⴷⴰⵏ': 'inelmaden',
  'ⵓⵙⵍⵎⴰⴷ': 'uslmad',
  'ⵜⴰⵎⴰⵣⵉⵔⵜ': 'tamazirt',
  'ⴰⵙⴷⴰⵙ': 'asdas',
  'ⵜⴰⵎⴰⵡⴰⵏⵜ': 'tamawant',
  'ⵜⵉⴷⴰⵢⵏⵉⵏ': 'tidyannin',
  'ⴰⵙⴷⵔⵓⵙ': 'asdurus',
  'ⴰⵙⵎⵉⵍ': 'asmil',
  'ⵜⴰⵏⴰⵣⵣⴰ': 'tanazza',
  'ⴰⵎⵏⴰⵡ': 'amnaw',
  'ⵜⴰⵔⵔⴰⵃⵜ': 'tarract',
  'ⴰⵙⵓⴼⵖ': 'asufagh',
  'ⵢⴰⵏ': 'yan',
  'ⵙⵉⵏ': 'sin',
  'ⴽⵔⴰⴹ': 'kradd',
  'ⴽⴽⵓⵣ': 'kkoz',
  'ⵙⵎⵎⵓⵙ': 'smmus',
  'ⵙⵍⵎⴰⴷ': 'slemad',
  'ⵙⵓⴼ': 'suf',
  'ⴰⵔⴰⵏ': 'aran',
  'ⵖⵔ': 'gher',
  'ⴰⵙⵙ': 'ass',
  'ⴰⵙⴳⴰⵙ': 'asgas',
  'ⵉⵎⴰⵍⴰⵢⵏ': 'immalayn',
  'ⴰⵙⴷⵔⵓⵙ ⴰⵎⴰⵢⵏⵓⵜ': 'lesson-new',
  'ⵉⵏⵍⵎⴰⴷⴰⵏ ⵙⵙⵍⵎⴰⴷⴰⵏ': 'students-learn',
}

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

/** Returns the recorded clip URL for an exact Tamazight phrase, if available. */
export function amzClipFor(text: string): string | null {
  const id = AMZ_CLIPS[normalize(text)]
  return id ? `${import.meta.env.BASE_URL}audio/amz/${id}.wav` : null
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

async function browserSpeak(text: string, locale: SpeakLocale): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  synth.cancel()
  const voices = await getVoices(synth)
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = BROWSER_LANG[locale] || 'en-GB'
  utter.rate = 0.9
  utter.pitch = 1.05
  const byPrefix = (prefix: string) => voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
  let match = voices.find((v) => v.lang.toLowerCase() === utter.lang.toLowerCase())
    || byPrefix(locale === 'amz' ? 'zgh' : locale)

  const needsArabic = ARABIC_SCRIPT.test(text)
  const needsTifinagh = TIFINAGH_SCRIPT.test(text)
  if (!match && needsTifinagh) match = byPrefix('zgh') || byPrefix('ar')
  else if (!match && needsArabic) match = byPrefix('ar')
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

/**
 * Read `text` aloud. Resolves when playback finishes (or immediately when the
 * browser has no speech support), so callers can animate a speaking state.
 */
export async function speakText(text: string, locale: SpeakLocale): Promise<void> {
  const clean = normalize(text)
  if (!clean) return
  stopAudio()
  if (locale === 'amz') {
    const clip = amzClipFor(clean)
    if (clip) {
      return new Promise((resolve) => {
        const audio = new Audio(clip)
        activeAudio = audio
        const clear = () => { if (activeAudio === audio) activeAudio = null }
        const fallback = () => { clear(); void browserSpeak(clean, locale).then(resolve) }
        audio.onended = () => { clear(); resolve() }
        audio.onerror = fallback
        void audio.play().catch(fallback)
      })
    }
  }
  await browserSpeak(clean, locale)
}

export function stopSpeaking() {
  stopAudio()
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
}
