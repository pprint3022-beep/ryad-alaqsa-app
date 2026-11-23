import { useEffect, useRef, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { detectLocale, speakText, stopSpeaking, type SpeakLocale } from '../lib/speech'

interface SpeakButtonProps {
  text?: string
  locale: SpeakLocale
  /** Language of the text itself when it differs from the interface language. */
  contentLocale?: SpeakLocale
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Child-friendly, accessible read-aloud button. Never auto-plays. */
export default function SpeakButton({
  text,
  locale,
  contentLocale,
  label,
  size = 'sm',
  className = '',
}: SpeakButtonProps) {
  const { t } = useTranslation()
  const [speaking, setSpeaking] = useState(false)
  const mounted = useRef(true)
  const inFlight = useRef(false)
  const effectiveLocale = detectLocale(text || '', contentLocale ?? locale)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; stopSpeaking() }
  }, [])

  if (!text) return null

  const onSpeak = async () => {
    if (inFlight.current) {
      stopSpeaking()
      inFlight.current = false
      if (mounted.current) setSpeaking(false)
      return
    }
    inFlight.current = true
    if (mounted.current) setSpeaking(true)
    try {
      await speakText(text, effectiveLocale)
    } finally {
      inFlight.current = false
      if (mounted.current) setSpeaking(false)
    }
  }

  // `lg` is the child-facing target: a large touch area with a visible focus
  // ring. All sizes remain real buttons, so keyboard activation always works.
  const dim =
    size === 'lg' ? 'h-12 w-12' : size === 'md' ? 'h-10 w-10' : 'h-7 w-7'
  const icon = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-3.5 w-3.5'

  return (
    <button
      type="button"
      onClick={onSpeak}
      aria-label={label || t('speakLabel', { defaultValue: 'استمع إلى النطق' })}
      aria-pressed={speaking}
      aria-busy={speaking}
      title={label || t('speakLabel', { defaultValue: 'استمع إلى النطق' })}
      className={`inline-grid ${dim} shrink-0 place-items-center rounded-full border-2 transition active:scale-95 focus-visible:ring-4 focus-visible:ring-brand-300 ${
        speaking
          ? 'border-brand-600 bg-brand-500 text-white shadow-chunky-sm animate-pulse'
          : 'border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-400/10 dark:text-brand-200'
      } ${className}`}
    >
      <Volume2 className={icon} aria-hidden="true" />
    </button>
  )
}
