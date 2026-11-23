import { useTranslation } from 'react-i18next'
import { BookAudio } from 'lucide-react'
import SpeakButton from '../SpeakButton'

export interface VoiceReading {
  /** Speech locale / voice to use for this reading. */
  locale: 'ar' | 'fr' | 'en'
  /** Visible language label. */
  label: string
  /** Full lesson text to read aloud (intro + sections + terms/examples). */
  text: string
}

interface VoiceHelperProps {
  /** Lesson readings in the available curriculum languages (ar/fr/en). */
  readings?: VoiceReading[]
}

/**
 * Lesson read-aloud helper.
 *
 * Reads the actual lesson explanation (intro, sections, terms and examples)
 * with a suitable browser voice. Amazigh is intentionally NOT part of this
 * shared lesson player: it lives in its own dedicated section with recorded
 * Tifinagh clips, so no lesson text is ever spoken with an unrelated voice.
 */
export default function VoiceHelper({ readings = [] }: VoiceHelperProps) {
  const { t } = useTranslation()
  const available = readings.filter((reading) => reading.text.trim().length > 0)
  if (available.length === 0) return null

  return (
    <section
      className="rounded-card-lg border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-gold-50 p-4 dark:from-brand-400/10 dark:to-gold-400/10"
      aria-label={t('voiceLessonTitle', { defaultValue: 'المساعد الصوتي للدرس' })}
    >
      <div className="flex items-start gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500 text-white shadow-chunky-sm" aria-hidden="true">
          <BookAudio className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-black">
            {t('voiceLessonTitle', { defaultValue: 'المساعد الصوتي للدرس' })}
          </h3>
          <p className="mt-1 text-[10px] font-semibold leading-relaxed text-muted">
            {t('voiceLessonHint', {
              defaultValue: 'اضغط زر الاستماع لسماع شرح الدرس بالعربية أو الفرنسية أو الإنجليزية. لا يُقرأ أي نص بصوت غير مناسب.',
            })}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-2 text-[10px] font-black text-brand-700 dark:text-brand-300">
          {t('voiceReadLesson', { defaultValue: 'استمع إلى شرح الدرس' })}
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {available.map((reading) => (
            <li
              key={reading.locale}
              className="flex items-center gap-2 rounded-card border-2 border-line bg-surface p-2"
            >
              <SpeakButton
                text={reading.text}
                locale={reading.locale}
                contentLocale={reading.locale}
                size="lg"
                label={`${t('voiceReadLesson', { defaultValue: 'استمع إلى شرح الدرس' })} — ${reading.label}`}
              />
              <span className="min-w-0 text-[11px] font-black text-content">{reading.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
