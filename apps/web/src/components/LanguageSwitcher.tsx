import { ChevronDown, Globe2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ChangeEvent } from 'react'
import { LANGUAGES, type Language } from '../i18n'

interface LanguageSwitcherProps {
  className?: string
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation()
  const current = LANGUAGES.find((language) => language.code === i18n.resolvedLanguage) ?? LANGUAGES[0]

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value as Language)
  }

  return (
    <div className={`relative inline-flex items-center ${className}`.trim()}>
      <Globe2
        className="pointer-events-none absolute start-3 h-4 w-4 text-brand-600 dark:text-brand-400"
        aria-hidden="true"
      />
      <select
        value={current.code}
        onChange={handleChange}
        aria-label={t('chooseLanguage')}
        title={t('chooseLanguage')}
        className="w-full appearance-none rounded-full border-2 border-line bg-surface py-2 ps-9 pe-9 text-sm font-extrabold text-content transition hover:border-brand-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code} lang={language.code} dir={language.dir}>
            {language.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-3 h-4 w-4 text-muted"
        aria-hidden="true"
      />
    </div>
  )
}
