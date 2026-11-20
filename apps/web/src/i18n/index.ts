import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import amz from './locales/amz'
import ar from './locales/ar'
import en from './locales/en'
import fr from './locales/fr'

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

const initialLanguage = readStoredLanguage()
applyDocumentLanguage(initialLanguage)

void i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    fr: { translation: fr },
    en: { translation: en },
    amz: { translation: amz },
  },
  lng: initialLanguage,
  fallbackLng: 'fr',
  supportedLngs: LANGUAGES.map((language) => language.code),
  keySeparator: false,
  nsSeparator: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

i18n.on('languageChanged', (language) => {
  applyDocumentLanguage(language)

  try {
    window.localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Storage can be unavailable in private mode; switching still works.
  }
})

export default i18n
