import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight, Check, Printer, RotateCcw, Sparkles } from 'lucide-react'
import {
  CATEGORIES,
  DAILY_TASKS,
  DICTIONARY,
  STORY_PAGES,
  type DictWord,
} from '../../data/amzExtraContent'
import { TOPICS } from '../../data/amzTopicMap'

const DAILY_KEY = 'ryad-amz-daily'
const SRS_KEY = 'ryad-amz-srs'
const PORTFOLIO_KEY = 'ryad-amz-portfolio'

function readJSON<T>(key: string, fallback: T): T {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || 'null')
    return stored ?? fallback
  } catch {
    return fallback
  }
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

interface PortfolioItem {
  type: 'draw' | 'voice'
  data: string
  label: string
  time: number
}

export default function AmazighExtras() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'dictionary' | 'games' | 'stories' | 'portfolio'>('dictionary')
  const [category, setCategory] = useState<DictWord['category'] | 'all'>('all')
  const [daily, setDaily] = useState<string[]>(() => readJSON<string[]>(DAILY_KEY, []))
  const [boxes, setBoxes] = useState<Record<string, number>>(() => readJSON<Record<string, number>>(SRS_KEY, {}))
  const [flip, setFlip] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => readJSON<PortfolioItem[]>(PORTFOLIO_KEY, []))

  useEffect(() => { localStorage.setItem(DAILY_KEY, JSON.stringify(daily)) }, [daily])
  useEffect(() => { localStorage.setItem(SRS_KEY, JSON.stringify(boxes)) }, [boxes])
  useEffect(() => {
    const refresh = () => setPortfolio(readJSON<PortfolioItem[]>(PORTFOLIO_KEY, []))
    window.addEventListener('ryad-amz-portfolio', refresh)
    return () => window.removeEventListener('ryad-amz-portfolio', refresh)
  }, [])

  const words = useMemo(() => category === 'all' ? DICTIONARY : DICTIONARY.filter((w) => w.category === category), [category])
  const reviewWords = useMemo(() => shuffle(DICTIONARY.filter((w) => (boxes[w.tz] || 0) < 3)).slice(0, 5), [boxes])
  const review = reviewWords[reviewIndex % Math.max(reviewWords.length, 1)]

  const tabs = [
    { id: 'dictionary' as const, emoji: '🃏', ar: 'قاموسي وخطتي' },
    { id: 'games' as const, emoji: '🎮', ar: 'ألعاب' },
    { id: 'stories' as const, emoji: '📖', ar: 'قصص مصوّرة' },
    { id: 'portfolio' as const, emoji: '🎒', ar: 'دفتري وأوراقي' },
  ]

  const toggleDaily = (id: string) => setDaily((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id])
  const grade = (known: boolean) => {
    if (!review) return
    setBoxes((current) => ({ ...current, [review.tz]: known ? Math.min(3, (current[review.tz] || 0) + 1) : 0 }))
    setFlip(false)
    setReviewIndex((value) => value + 1)
  }

  return (
    <section className="card-school p-5" aria-labelledby="amz-extras-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="amz-extras-title" className="font-display text-lg font-black">
          <Sparkles className="me-1 inline h-4 w-4 text-gold-500" aria-hidden="true" />
          {t('amzExtrasTitle', { defaultValue: 'أنشطة إضافية ممتعة' })}
        </h2>
        <p className="text-[10px] font-black text-muted">
          {t('amzSourcesCredit', { defaultValue: 'مفردات وحوار من دورات أمازيغية مجانية — داخل المنصة' })}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`min-h-12 rounded-2xl border-2 px-2 text-xs font-black outline-none transition focus-visible:ring-4 focus-visible:ring-brand-300 ${
              tab === item.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-line bg-surface text-content hover:border-brand-300'
            }`}
          >
            <span className="me-1" aria-hidden="true">{item.emoji}</span>{item.ar}
          </button>
        ))}
      </div>

      {tab === 'dictionary' ? (
        <div className="mt-4">
          <div className="rounded-card border-4 border-brand-200 bg-brand-50 p-4 dark:bg-brand-400/10">
            <h3 className="text-sm font-black text-brand-800 dark:text-brand-200">
              {t('amzDailyTitle', { defaultValue: 'خطتي لليوم — 10 دقائق' })}
            </h3>
            <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {DAILY_TASKS.map((task) => {
                const done = daily.includes(task.id)
                return (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => toggleDaily(task.id)}
                      aria-pressed={done}
                      className={`flex min-h-12 w-full items-center gap-2 rounded-xl border-2 px-3 text-[11px] font-black outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500 ${done ? 'border-brand-500 bg-surface text-brand-800 dark:text-brand-200' : 'border-line bg-surface text-muted'}`}
                    >
                      <span aria-hidden="true">{task.emoji}</span>{task.ar}
                      {done ? <Check className="ms-auto h-4 w-4 text-brand-500" aria-hidden="true" /> : null}
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className="mt-2 text-[10px] font-bold text-muted">
              {t('amzDailyDone', { done: daily.length, total: DAILY_TASKS.length, defaultValue: 'أنجزت {{done}} من {{total}}' })}
            </p>
          </div>

          <div className="mt-4 rounded-card border-4 border-gold-200 bg-gold-50 p-4 dark:bg-gold-400/10">
            <h3 className="text-sm font-black text-gold-900 dark:text-gold-200">
              {t('amzReviewTitle', { defaultValue: 'كرّر الكلمات' })}
            </h3>
            <p className="mt-1 text-[11px] font-semibold text-muted">
              {t('amzReviewHint', { defaultValue: 'كل كلمة تعرفها تنتقل لمستوى أعلى، وتعود الكلمات الصعبة للتكرار.' })}
            </p>
            {review ? (
              <div className="mt-3 rounded-card border-2 border-line bg-surface p-4 text-center">
                <p className="text-4xl" aria-hidden="true">{review.emoji}</p>
                <p className="mt-2 font-display text-2xl font-black" lang="zgh" dir="ltr">{review.tz}</p>
                <p className="text-[11px] font-bold text-muted">{review.latin}</p>
                {flip ? (
                  <p className="mt-2 text-sm font-black text-content">{review.ar}</p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setFlip(true)}
                    className="mt-2 min-h-11 rounded-xl bg-brand-500 px-4 text-xs font-black text-white outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
                  >
                    {t('amzShowMeaning', { defaultValue: 'اعرض المعنى' })}
                  </button>
                )}
                {flip ? (
                  <div className="mt-3 flex justify-center gap-2">
                    <button type="button" onClick={() => grade(false)} className="min-h-11 rounded-xl border-2 border-gold-400 bg-gold-50 px-4 text-xs font-black text-gold-900">
                      {t('amzStudyAgain', { defaultValue: 'أدرسها مرة أخرى' })}
                    </button>
                    <button type="button" onClick={() => grade(true)} className="min-h-11 rounded-xl bg-brand-500 px-4 text-xs font-black text-white">
                      {t('amzIKnow', { defaultValue: 'أعرفها' })}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mt-4 rounded-card border-2 border-line bg-surface p-4">
            <h3 className="text-sm font-black">{t('amzTopicMapTitle', { defaultValue: 'خريطة المنهج — 48 درساً' })}</h3>
            <p className="mt-1 text-[10px] font-semibold text-muted">
              {t('amzTopicMapHint', { defaultValue: 'المواضيع التي يدرّسها منهج «أوال ن إمازيغن»، رُتّبت لكم داخل المنصة.' })}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <li key={topic.tz} className="rounded-full border-2 border-brand-200 bg-brand-50 px-3 py-1.5 text-[10px] font-black text-brand-800 dark:bg-brand-400/10 dark:text-brand-200">
                  <span className="me-1" aria-hidden="true">{topic.emoji}</span>{topic.ar}
                  <span className="mt-0.5 block font-display text-[9px] font-bold text-muted" lang="zgh" dir="ltr">{topic.tz}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="mt-4 text-sm font-black">{t('amzDictionaryTitle', { defaultValue: 'قاموس الصور' })}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={() => setCategory('all')} aria-pressed={category === 'all'} className="min-h-11 rounded-full border-2 border-line bg-surface px-3 text-[11px] font-black outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              {t('amzAllWords', { defaultValue: 'كل الكلمات' })}
            </button>
            {CATEGORIES.map((item) => (
              <button key={item.id} type="button" onClick={() => setCategory(item.id)} aria-pressed={category === item.id} className="min-h-11 rounded-full border-2 border-line bg-surface px-3 text-[11px] font-black outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                <span className="me-1" aria-hidden="true">{item.emoji}</span>{item.labelAr}
              </button>
            ))}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {words.map((word) => (
              <li key={word.tz} className="rounded-card border-2 border-line bg-surface p-3 text-center">
                <p className="text-3xl" aria-hidden="true">{word.emoji}</p>
                <p className="mt-1 font-display text-sm font-black" lang="zgh" dir="ltr">{word.tz}</p>
                <p className="text-[10px] font-bold text-muted">{word.latin}</p>
                <p className="mt-1 text-[11px] font-black text-content">{word.ar}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === 'games' ? <Games /> : null}
      {tab === 'stories' ? <StoryReader /> : null}

      {tab === 'portfolio' ? (
        <div className="mt-4">
          <div className="rounded-card border-2 border-line bg-surface p-4">
            <h3 className="text-sm font-black">{t('amzPortfolioTitle', { defaultValue: 'دفترّي' })}</h3>
            <p className="mt-1 text-[11px] font-semibold text-muted">
              {t('amzPortfolioHint', { defaultValue: 'هنا تظهر رسوماتك وتسجيلاتك التي حفظتها من الدروس.' })}
            </p>
            {portfolio.length ? (
              <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {portfolio.map((item, index) => (
                  <li key={`${item.time}-${index}`} className="rounded-card border-2 border-line bg-surface p-3">
                    <p className="text-[11px] font-black text-content">{item.label}</p>
                    {item.type === 'draw' ? <img src={item.data} alt={item.label} className="mt-2 h-24 w-full rounded-xl object-contain" /> : <audio controls src={item.data} className="mt-2 w-full" />}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-xs font-semibold text-muted">{t('amzPortfolioEmpty', { defaultValue: 'لم تحفظ شيئاً بعد.' })}</p>}
          </div>

          <div className="mt-4 rounded-card border-2 border-line bg-surface p-4">
            <h3 className="text-sm font-black">{t('amzWorksheetsTitle', { defaultValue: 'أوراق عمل للطباعة' })}</h3>
            <button type="button" onClick={() => window.print()} className="mt-3 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-500 px-4 text-xs font-black text-white outline-none focus-visible:ring-4 focus-visible:ring-brand-300">
              <Printer className="h-4 w-4" aria-hidden="true" />
              {t('amzPrint', { defaultValue: 'اطبع الورقة' })}
            </button>
            <div className="mt-3 hidden space-y-4 print:block">
              <h1 className="text-xl font-black">ⵜⴰⵎⴰⵣⵉⵖⵜ — أوراق عمل</h1>
              <p className="font-bold">١) تتبّع الحروف:</p>
              <div className="grid grid-cols-4 gap-4 text-6xl text-gray-300">
                {['ⴰ', 'ⴱ', 'ⵉ', 'ⵎ', 'ⵓ', 'ⵜ', 'ⴽ', 'ⵍ'].map((letter) => <span key={letter}>{letter}</span>)}
              </div>
              <p className="font-bold">٢) اربط الكلمة بمعناها:</p>
              <ul className="space-y-1">
                {DICTIONARY.slice(0, 8).map((word) => <li key={word.tz}>{word.tz} — {word.latin} — ____________</li>)}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function Games() {
  const { t } = useTranslation()
  const [game, setGame] = useState<'memory' | 'builder' | 'hunt'>('memory')

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'memory' as const, ar: 'لعبة الذاكرة', emoji: '🃏' },
          { id: 'builder' as const, ar: 'ركّب الكلمة', emoji: '🧩' },
          { id: 'hunt' as const, ar: 'اصطد الحرف', emoji: '🎯' },
        ].map((item) => (
          <button key={item.id} type="button" onClick={() => setGame(item.id)} aria-pressed={game === item.id} className="min-h-12 rounded-xl border-2 border-line bg-surface px-3 text-xs font-black outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            <span className="me-1" aria-hidden="true">{item.emoji}</span>{item.ar}
          </button>
        ))}
      </div>
      {game === 'memory' ? <MemoryGame /> : null}
      {game === 'builder' ? <BuilderGame /> : null}
      {game === 'hunt' ? <HuntGame /> : null}
      <p className="mt-3 text-[10px] font-bold text-muted">
        {t('amzGamesHint', { defaultValue: 'ألعاب قصيرة بلا نقاط أو منافسة — الهدف التكرار والمرح.' })}
      </p>
    </div>
  )
}

function MemoryGame() {
  const { t } = useTranslation()
  const [deck, setDeck] = useState(() => makeDeck())
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])

  const flip = (index: number) => {
    const card = deck[index]
    if (open.includes(index) || matched.includes(card.id)) return
    const next = [...open, index]
    setOpen(next)
    if (next.length === 2) {
      const [a, b] = next.map((i) => deck[i])
      if (a.id === b.id) setMatched((current) => [...current, a.id])
      window.setTimeout(() => setOpen([]), 700)
    }
  }

  const restart = () => { setDeck(makeDeck()); setOpen([]); setMatched([]) }

  return (
    <div className="mt-3 rounded-card border-2 border-line bg-surface p-4">
      <p className="text-sm font-black">{t('amzMemoryTitle', { defaultValue: 'اعثر على أزواج الكلمة ومعناها' })}</p>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {deck.map((card, index) => {
          const revealed = open.includes(index) || matched.includes(card.id)
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => flip(index)}
                aria-label={revealed ? card.text : t('amzHiddenCard', { defaultValue: 'بطاقة مقلوبة' })}
                className={`grid min-h-16 w-full place-items-center rounded-xl border-2 px-1 text-center outline-none transition focus-visible:ring-2 focus-visible:ring-brand-500 ${revealed ? 'border-brand-400 bg-brand-50 text-xs font-black text-content' : 'border-line bg-surface-muted text-lg'}`}
              >
                {revealed ? card.text : '❓'}
              </button>
            </li>
          )
        })}
      </ul>
      {matched.length === 6 ? <p className="mt-3 text-sm font-black text-brand-700">{t('amzWellDone', { defaultValue: 'أحسنت! أكملت اللعبة.' })}</p> : null}
      <button type="button" onClick={restart} className="mt-3 min-h-11 rounded-xl border-2 border-brand-300 bg-surface px-4 text-xs font-black text-brand-700 outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
        <RotateCcw className="me-1 inline h-3.5 w-3.5" aria-hidden="true" />
        {t('amzPlayAgain', { defaultValue: 'العب مرة أخرى' })}
      </button>
    </div>
  )
}

function makeDeck() {
  const selected = shuffle(DICTIONARY).slice(0, 6)
  return shuffle(selected.flatMap((word) => [
    { id: word.tz, text: word.tz },
    { id: word.tz, text: `${word.emoji} ${word.ar}` },
  ]))
}

function BuilderGame() {
  const { t } = useTranslation()
  const [word, setWord] = useState(() => shuffle(DICTIONARY.filter((w) => w.tz.length >= 4))[0])
  const [tiles, setTiles] = useState<string[]>([])
  const [built, setBuilt] = useState<string[]>([])
  const [done, setDone] = useState(false)

  const reset = () => {
    const next = shuffle(DICTIONARY.filter((w) => w.tz.length >= 4))[0]
    setWord(next)
    setTiles(shuffle([...next.tz]))
    setBuilt([])
    setDone(false)
  }

  useEffect(() => { setTiles(shuffle([...word.tz])); setBuilt([]); setDone(false) }, [word])

  const pick = (index: number) => {
    if (done) return
    const nextBuilt = [...built, tiles[index]]
    setBuilt(nextBuilt)
    setTiles((current) => current.filter((_, i) => i !== index))
    if (nextBuilt.join('') === word.tz) setDone(true)
  }

  return (
    <div className="mt-3 rounded-card border-2 border-line bg-surface p-4">
      <p className="text-sm font-black">{t('amzBuilderTitle', { defaultValue: 'رتّب الحروف لتكتب الكلمة' })}</p>
      <p className="mt-1 text-xs font-bold text-muted">{word.emoji} {word.ar}</p>
      <div className="mt-3 min-h-14 rounded-card border-2 border-dashed border-brand-300 bg-brand-50 p-2 text-center font-display text-2xl font-black" lang="zgh" dir="ltr">
        {built.join('') || '…'}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tiles.map((tile, index) => (
          <button key={`${tile}-${index}`} type="button" onClick={() => pick(index)} className="grid h-12 w-12 place-items-center rounded-xl border-2 border-line bg-surface font-display text-xl font-black outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            {tile}
          </button>
        ))}
      </div>
      {done ? <p className="mt-3 text-sm font-black text-brand-700">{t('amzWellDone', { defaultValue: 'أحسنت! أكملت اللعبة.' })}</p> : null}
      <button type="button" onClick={reset} className="mt-3 min-h-11 rounded-xl border-2 border-brand-300 bg-surface px-4 text-xs font-black text-brand-700">
        {t('amzAnotherWord', { defaultValue: 'كلمة أخرى' })}
      </button>
    </div>
  )
}

function HuntGame() {
  const { t } = useTranslation()
  const [word, setWord] = useState(() => DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)])
  const [letter, setLetter] = useState(() => {
    const chars = [...DICTIONARY[0].tz]
    return chars[Math.floor(Math.random() * chars.length)]
  })
  const [picked, setPicked] = useState<string | null>(null)

  const next = () => {
    const nextWord = DICTIONARY[Math.floor(Math.random() * DICTIONARY.length)]
    setWord(nextWord)
    const chars = [...nextWord.tz]
    setLetter(chars[Math.floor(Math.random() * chars.length)])
    setPicked(null)
  }

  const options = useMemo(() => shuffle([letter, ...shuffle([...DICTIONARY[5].tz]).filter((c) => c !== letter).slice(0, 2)]), [letter])

  return (
    <div className="mt-3 rounded-card border-2 border-line bg-surface p-4">
      <p className="text-sm font-black">{t('amzHuntTitle', { defaultValue: 'ابحث عن الحرف داخل الكلمة' })}</p>
      <p className="mt-2 font-display text-3xl font-black" lang="zgh" dir="ltr">{word.tz}</p>
      <p className="mt-1 text-xs font-bold text-muted">{t('amzHuntQuestion', { defaultValue: 'أين تجد الحرف؟' })} <span className="font-display text-lg font-black text-brand-700">{letter}</span></p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option, index) => (
          <button
            key={`${option}-${index}`}
            type="button"
            onClick={() => setPicked(option)}
            aria-pressed={picked === option}
            className={`grid h-14 w-14 place-items-center rounded-xl border-4 font-display text-2xl font-black outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${picked === option ? (option === letter ? 'border-brand-500 bg-brand-50' : 'border-gold-400 bg-gold-50') : 'border-line bg-surface'}`}
          >
            {option}
          </button>
        ))}
      </div>
      {picked ? <p className="mt-2 text-xs font-black" aria-live="polite">{picked === letter ? t('amzWellDone', { defaultValue: 'أحسنت! أكملت اللعبة.' }) : t('amzTryAgain', { defaultValue: 'حاول مرة أخرى.' })}</p> : null}
      <button type="button" onClick={next} className="mt-3 min-h-11 rounded-xl border-2 border-brand-300 bg-surface px-4 text-xs font-black text-brand-700">
        {t('amzAnotherWord', { defaultValue: 'كلمة أخرى' })}
      </button>
    </div>
  )
}

function StoryReader() {
  const { t } = useTranslation()
  const [page, setPage] = useState(0)
  const current = STORY_PAGES[page]
  return (
    <div className="mt-4 rounded-card border-4 border-gold-200 bg-gold-50 p-4 dark:bg-gold-400/10">
      <h3 className="text-sm font-black text-gold-900 dark:text-gold-200">{t('amzStoryTitle', { defaultValue: 'قصة: لقاء أول' })}</h3>
      <img src={current.image} alt="" className="mt-3 h-44 w-full rounded-card border-2 border-line object-cover" />
      <p className="mt-3 text-[10px] font-black text-muted">{current.who}</p>
      <p className="mt-1 font-display text-xl font-black text-content" lang="zgh" dir="ltr">{current.tz}</p>
      <p className="mt-1 text-sm font-bold text-muted">{current.ar}</p>
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {STORY_PAGES.map((_, index) => <span key={index} className={`h-2.5 w-2.5 rounded-full ${index === page ? 'bg-gold-500' : 'bg-gold-200'}`} />)}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0} className="inline-flex min-h-12 items-center gap-1 rounded-xl border-2 border-line bg-surface px-3 text-xs font-black disabled:opacity-40">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('amzPrevPage', { defaultValue: 'الصفحة السابقة' })}
        </button>
        <span className="text-[11px] font-black text-muted">{page + 1} / {STORY_PAGES.length}</span>
        <button type="button" onClick={() => setPage((value) => Math.min(STORY_PAGES.length - 1, value + 1))} disabled={page === STORY_PAGES.length - 1} className="inline-flex min-h-12 items-center gap-1 rounded-xl bg-brand-500 px-3 text-xs font-black text-white disabled:opacity-40">
          {t('amzNextPage', { defaultValue: 'الصفحة التالية' })}<ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
