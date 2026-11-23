import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const LANGUAGES = [
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'amz', label: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', dir: 'ltr' },
] as const

export type Language = (typeof LANGUAGES)[number]['code']

const STORAGE_KEY = 'ryad-language'

function isLanguage(value: string | null): value is Language {
  return LANGUAGES.some((language) => language.code === value)
}

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'ar'
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isLanguage(stored) ? stored : 'ar'
  } catch {
    return 'ar'
  }
}

function applyDocumentLanguage(language: string): void {
  if (typeof document === 'undefined') {
    return
  }

  const normalized = isLanguage(language) ? language : 'ar'
  document.documentElement.lang = normalized
  document.documentElement.dir = normalized === 'ar' ? 'rtl' : 'ltr'
}

type LocaleModule = { default: Record<string, string> }

/**
 * Locale catalogues are large (~2,000 keys each). Loading all four on first
 * paint put them in the entry bundle; instead we load only the active language
 * before render and fetch the others on demand when the user switches.
 */
const LOCALE_LOADERS: Record<Language, () => Promise<LocaleModule>> = {
  ar: () => import('./locales/ar'),
  fr: () => import('./locales/fr'),
  en: () => import('./locales/en'),
  amz: () => import('./locales/amz'),
}

const loaded = new Set<Language>()
let initPromise: Promise<void> | null = null

/** Initialise i18next with only the active language. Call once before render. */
export function initI18n(): Promise<void> {
  if (initPromise) return initPromise
  initPromise = (async () => {
    const initial = readStoredLanguage()
    applyDocumentLanguage(initial)
    const module = await LOCALE_LOADERS[initial]()
    loaded.add(initial)
    await i18n.use(initReactI18next).init({
      resources: { [initial]: { translation: module.default } },
      lng: initial,
      fallbackLng: initial,
      supportedLngs: LANGUAGES.map((language) => language.code),
      partialBundledLanguages: true,
      keySeparator: false,
      nsSeparator: false,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
  })()
  return initPromise
}

/**
 * Switch language only after its catalogue is in the resource store, so
 * i18next resolves the new language immediately (dates, RTL and read-aloud
 * voices all rely on `resolvedLanguage`).
 */
export async function changeLanguage(language: Language): Promise<void> {
  if (!isLanguage(language)) return
  if (!loaded.has(language)) {
    try {
      const module = await LOCALE_LOADERS[language]()
      i18n.addResourceBundle(language, 'translation', module.default, true, true)
      loaded.add(language)
    } catch {
      // A missing chunk must not leave the UI stuck on the old language.
      return
    }
  }
  await i18n.changeLanguage(language)
}

i18n.on('languageChanged', (language) => {
  applyDocumentLanguage(language)

  try {
    window.localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Storage can be unavailable in private mode; switching still works.
  }
})

export default i18n
