import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Check, Mic, Sparkles, Volume2 } from 'lucide-react'
import { CATEGORIES, DICTIONARY, type DictWord } from '../../data/amzExtraContent'

/** Redesigned first experience: one photo, one word, its real recorded voice. */
export default function AmazighWordCards() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<DictWord['category'] | 'all'>('all')
  const [index, setIndex] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [recording, setRecording] = useState(false)
  const [childUrl, setChildUrl] = useState<string | null>(null)
  const [micError, setMicError] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const chunks = useRef<Blob[]>([])

  const list = category === 'all' ? DICTIONARY : DICTIONARY.filter((word) => word.category === category)
  const word = list[Math.min(index, list.length - 1)]

  useEffect(() => { setIndex(0); setChildUrl(null) }, [category])
  useEffect(() => () => {
    audio.current?.pause()
    if (recorder.current?.state === 'recording') recorder.current.stop()
    stream.current?.getTracks().forEach((track) => track.stop())
    if (childUrl) URL.revokeObjectURL(childUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const play = () => {
    if (!word) return
    if (!audio.current) audio.current = new Audio(word.audio)
    else { audio.current.pause(); audio.current.src = word.audio }
    audio.current.onended = () => setSpeaking(false)
    setSpeaking(true)
    void audio.current.play().catch(() => setSpeaking(false))
  }

  const startRecording = async () => {
    setMicError(false)
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.current = media
      chunks.current = []
      const next = new MediaRecorder(media)
      next.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data) }
      next.onstop = () => {
        if (childUrl) URL.revokeObjectURL(childUrl)
        setChildUrl(URL.createObjectURL(new Blob(chunks.current, { type: next.mimeType || 'audio/webm' })))
        media.getTracks().forEach((track) => track.stop())
      }
      recorder.current = next
      next.start()
      setRecording(true)
    } catch { setMicError(true) }
  }

  const stopRecording = () => {
    if (recorder.current && recorder.current.state !== 'inactive') recorder.current.stop()
    setRecording(false)
  }

  if (!word) return null

  return (
    <section className="card-school p-5" aria-labelledby="amz-cards-title">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[10px] font-black text-gold-900 dark:bg-gold-400/15 dark:text-gold-200">
            <Sparkles className="h-3.5 w-3.5 motion-safe:animate-bounce" aria-hidden="true" />
            {t('amzCardsEyebrow', { defaultValue: 'ابدأ هنا — تعلّم بالصورة والصوت' })}
          </p>
          <h2 id="amz-cards-title" className="font-display text-lg font-black">
            {t('amzCardsTitle', { defaultValue: 'بطاقات الكلمات' })}
          </h2>
          <p className="mt-1 text-[11px] font-semibold text-muted">
            {t('amzCardsHint', { defaultValue: 'صورة حقيقية، كلمة أمازيغية، وصوتها المسجّل. اضغط واستمع ثم قلّد.' })}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="tablist">
        <button type="button" role="tab" aria-selected={category === 'all'} onClick={() => setCategory('all')} className="min-h-11 rounded-full border-2 border-line bg-surface px-3 text-[11px] font-black outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
          {t('amzAllWords', { defaultValue: 'كل الكلمات' })}
        </button>
        {CATEGORIES.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={category === item.id} onClick={() => setCategory(item.id)} className="min-h-11 rounded-full border-2 border-line bg-surface px-3 text-[11px] font-black outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            <span className="me-1" aria-hidden="true">{item.emoji}</span>{item.labelAr}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-card border-4 border-brand-200 bg-surface">
          <img src={`/images/amz-real/${category === 'all' ? word.category : category}.jpg`} alt={word.ar} className="h-64 w-full object-cover sm:h-80" onError={(event) => { event.currentTarget.src = `/images/amz-real/${word.category}.jpg` }} />
          <span className="absolute bottom-2 start-2 rounded-full bg-surface/90 px-2 py-1 text-[9px] font-black text-content">
            {t('amzRealPhoto', { defaultValue: 'صورة حقيقية توضيحية' })}
          </span>
        </div>

        <div className="flex flex-col justify-center rounded-card border-4 border-gold-200 bg-gold-50 p-5 dark:bg-gold-400/10">
          <p className="text-5xl" aria-hidden="true">{word.emoji}</p>
          <p className="mt-2 font-display text-4xl font-black text-content sm:text-5xl" lang="zgh" dir="ltr">{word.tz}</p>
          <p className="mt-1 text-sm font-black text-muted">{word.latin}</p>
          <p className="mt-2 text-xl font-black text-brand-700 dark:text-brand-300">{word.ar}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={play}
              aria-pressed={speaking}
              className={`inline-flex min-h-16 items-center gap-3 rounded-2xl px-6 text-sm font-black text-white outline-none transition active:scale-95 focus-visible:ring-4 focus-visible:ring-brand-300 ${speaking ? 'bg-gold-500 motion-safe:animate-pulse' : 'bg-brand-500 hover:bg-brand-600'}`}
            >
              <Volume2 className="h-6 w-6" aria-hidden="true" />
              {t('amzPlayWord', { defaultValue: 'استمع إلى الكلمة' })}
            </button>
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              className={`inline-flex min-h-16 items-center gap-3 rounded-2xl px-5 text-sm font-black text-white outline-none transition active:scale-95 focus-visible:ring-4 focus-visible:ring-gold-300 ${recording ? 'bg-gold-600' : 'border-2 border-gold-400 bg-surface text-gold-800 dark:text-gold-200'}`}
            >
              <Mic className="h-5 w-5" aria-hidden="true" />
              {recording ? t('amzStop', { defaultValue: 'إيقاف التسجيل' }) : t('amzRepeatWord', { defaultValue: 'قلّد بصوتك' })}
            </button>
            {recording ? <span className="text-xs font-black text-gold-800">{t('amzRecording', { defaultValue: 'جارٍ التسجيل…' })}</span> : null}
            {micError ? <span className="text-xs font-black text-gold-900" role="alert">{t('amzMicError', { defaultValue: 'تعذّر الوصول إلى الميكروفون.' })}</span> : null}
          </div>
          {childUrl ? (
            <div className="mt-3">
              <p className="mb-1 text-[10px] font-black text-gold-800 dark:text-gold-200">{t('amzYourVoice', { defaultValue: 'صوتك' })}</p>
              <audio controls src={childUrl} className="w-full" />
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-2">
            <button type="button" onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0} className="inline-flex min-h-12 items-center gap-1 rounded-xl border-2 border-line bg-surface px-3 text-xs font-black disabled:opacity-40">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('amzPrev', { defaultValue: 'السابق' })}
            </button>
            <div className="flex gap-1" aria-hidden="true">
              {list.map((item, i) => <span key={item.tz} className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-brand-500' : 'bg-surface-muted'}`} />)}
            </div>
            <button type="button" onClick={() => { setIndex((value) => Math.min(list.length - 1, value + 1)); setChildUrl(null) }} disabled={index === list.length - 1} className="inline-flex min-h-12 items-center gap-1 rounded-xl bg-brand-500 px-3 text-xs font-black text-white disabled:opacity-40">
              {t('amzNextWord', { defaultValue: 'الكلمة التالية' })}<ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-muted">
            <Check className="h-3 w-3" aria-hidden="true" />
            {t('amzNoScores', { defaultValue: 'لا درجات ولا منافسة — تعلّم بالتكرار.' })}
          </p>
        </div>
      </div>
    </section>
  )
}
