import { useTranslation } from 'react-i18next'
import { Volume2 } from 'lucide-react'
import SpeakButton from '../SpeakButton'
import type { SpeakLocale } from '../../lib/speech'

/**
 * The four-language listening corner. Each large button is a real, labelled
 * button so it works with a keyboard and a screen reader. The Amazigh button
 * uses an authentic recorded Tifinagh phrase; other languages use a matching
 * browser voice, never an unrelated default voice.
 */
const OPTIONS: Array<{ locale: SpeakLocale; phrase: string; labelKey: string; fallback: string }> = [
  { locale: 'ar', phrase: 'مرحبًا، لنبدأ التعلّم', labelKey: 'langArabic', fallback: 'العربية' },
  { locale: 'fr', phrase: 'Bonjour, commençons à apprendre', labelKey: 'langFrench', fallback: 'الفرنسية' },
  { locale: 'en', phrase: 'Hello, let us start learning', labelKey: 'langEnglish', fallback: 'الإنجليزية' },
  { locale: 'amz', phrase: 'ⴰⵣⵓⵍ', labelKey: 'langAmazigh', fallback: 'الأمازيغية' },
]

export default function VoiceHelper() {
  const { t } = useTranslation()
  const speakLabel = t('speakLabel', { defaultValue: 'استمع إلى النطق' })

  return (
    <section
      className="rounded-card-lg border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-gold-50 p-4 dark:from-brand-400/10 dark:to-gold-400/10"
      aria-label={t('voiceHelperTitle', { defaultValue: 'المساعد الصوتي — أربع لغات' })}
    >
      <div className="flex items-start gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500 text-white shadow-chunky-sm" aria-hidden="true">
          <Volume2 className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-black">
            {t('voiceHelperTitle', { defaultValue: 'المساعد الصوتي — أربع لغات' })}
          </h3>
          <p className="mt-1 text-[10px] font-semibold leading-relaxed text-muted">
            {t('voiceHelperHint', {
              defaultValue:
                'اختر لغة ثم اضغط زر الاستماع الكبير. الأمازيغية تستخدم المقاطع المسجّلة المتاحة، ولا يعمل الصوت إلا عند طلبك.',
            })}
          </p>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {OPTIONS.map((option) => {
          const label = t(option.labelKey, { defaultValue: option.fallback })
          return (
            <li key={option.locale} className="flex flex-col items-center gap-1.5 rounded-card border-2 border-line bg-surface p-2">
              <SpeakButton
                text={option.phrase}
                locale={option.locale}
                contentLocale={option.locale}
                size="lg"
                label={`${speakLabel} — ${label}`}
              />
              <span className="text-center text-[10px] font-black text-content">{label}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
