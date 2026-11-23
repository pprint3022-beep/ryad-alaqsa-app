/**
 * Authentic vocabulary and dialogue drawn from free Moroccan Amazigh courses.
 * Sources are documented in docs/review/amazigh-sources.md — nothing here is
 * loaded from an external site at runtime.
 */

export interface DictWord {
  tz: string
  audio: string
  latin: string
  ar: string
  emoji: string
  category: 'greetings' | 'family' | 'numbers' | 'food' | 'world' | 'people'
}

export const DICTIONARY: DictWord[] = [
  { tz: 'ⴰⵣⵓⵍ', audio: '/audio/amz-words/w01.wav', latin: 'Azul', ar: 'مرحبًا', emoji: '👋', category: 'greetings' },
  { tz: 'ⵜⴰⵏⵎⵎⵉⵔⵜ', audio: '/audio/amz-words/w02.wav', latin: 'Tanmmirt', ar: 'شكرًا', emoji: '🙏', category: 'greetings' },
  { tz: 'ⵉⴱⴱⴰ', audio: '/audio/amz-words/w03.wav', latin: 'ibba', ar: 'أب', emoji: '👨', category: 'family' },
  { tz: 'ⵉⵎⵎⴰ', audio: '/audio/amz-words/w04.wav', latin: 'imma', ar: 'أم', emoji: '👩', category: 'family' },
  { tz: 'ⴳⵎⴰ', audio: '/audio/amz-words/w05.wav', latin: 'gma', ar: 'أخ', emoji: '👦', category: 'family' },
  { tz: 'ⵓⵍⵜⵎⴰ', audio: '/audio/amz-words/w06.wav', latin: 'ultma', ar: 'أخت', emoji: '👧', category: 'family' },
  { tz: 'ⴰⵎⵢⴰ', audio: '/audio/amz-words/w07.wav', latin: 'amya', ar: 'صفر', emoji: '0️⃣', category: 'numbers' },
  { tz: 'ⵢⴰⵏ', audio: '/audio/amz-words/w08.wav', latin: 'yan', ar: 'واحد', emoji: '1️⃣', category: 'numbers' },
  { tz: 'ⵙⵉⵏ', audio: '/audio/amz-words/w09.wav', latin: 'sin', ar: 'اثنان', emoji: '2️⃣', category: 'numbers' },
  { tz: 'ⴽⵕⴰⴹ', audio: '/audio/amz-words/w10.wav', latin: 'kṛaḍ', ar: 'ثلاثة', emoji: '3️⃣', category: 'numbers' },
  { tz: 'ⴽⴽⵓⵥ', audio: '/audio/amz-words/w11.wav', latin: 'kkuẓ', ar: 'أربعة', emoji: '4️⃣', category: 'numbers' },
  { tz: 'ⵙⵎⵎⵓⵙ', audio: '/audio/amz-words/w12.wav', latin: 'smmus', ar: 'خمسة', emoji: '5️⃣', category: 'numbers' },
  { tz: 'ⴰⵖⵔⵓⵎ', audio: '/audio/amz-words/w13.wav', latin: 'aɣrum', ar: 'خبز', emoji: '🍞', category: 'food' },
  { tz: 'ⴰⵎⴰⵏ', audio: '/audio/amz-words/w14.wav', latin: 'aman', ar: 'ماء', emoji: '💧', category: 'food' },
  { tz: 'ⴰⴽⵙⵓⵎ', audio: '/audio/amz-words/w15.wav', latin: 'aksum', ar: 'لحم', emoji: '🥩', category: 'food' },
  { tz: 'ⵜⴰⴳⵍⴰⵢⵜ', audio: '/audio/amz-words/w16.wav', latin: 'taglayt', ar: 'بيضة', emoji: '🥚', category: 'food' },
  { tz: 'ⵜⴰⴼⵓⴽⵜ', audio: '/audio/amz-words/w17.wav', latin: 'tafukt', ar: 'شمس', emoji: '☀️', category: 'world' },
  { tz: 'ⴰⵢⵢⵓⵔ', audio: '/audio/amz-words/w18.wav', latin: 'ayyur', ar: 'قمر', emoji: '🌙', category: 'world' },
  { tz: 'ⵉⴳⵏⵏⴰ', audio: '/audio/amz-words/w19.wav', latin: 'ignna', ar: 'سماء', emoji: '☁️', category: 'world' },
  { tz: 'ⴰⴷⵔⴰⵔ', audio: '/audio/amz-words/w20.wav', latin: 'adrar', ar: 'جبل', emoji: '⛰️', category: 'world' },
  { tz: 'ⵉⵍⵍ', audio: '/audio/amz-words/w21.wav', latin: 'ill', ar: 'بحر', emoji: '🌊', category: 'world' },
  { tz: 'ⵏⴽⴽ', audio: '/audio/amz-words/w22.wav', latin: 'nkk', ar: 'أنا', emoji: '🙋', category: 'people' },
  { tz: 'ⴰⵙⵍⵎⴰⴷ', audio: '/audio/amz-words/w23.wav', latin: 'aslmad', ar: 'أستاذ', emoji: '👨‍🏫', category: 'people' },
  { tz: 'ⴰⵎⵙⴳⵏⴰⴼ', audio: '/audio/amz-words/w24.wav', latin: 'amsgnaf', ar: 'طبيب', emoji: '👨‍⚕️', category: 'people' },
  { tz: 'ⵜⵓⵏⵏⵓⵏⵜ', audio: '/audio/amz-words/w25.wav', latin: 'tunnunt', ar: 'رياضة', emoji: '⚽', category: 'people' },
]

export const CATEGORIES: Array<{ id: DictWord['category']; labelAr: string; emoji: string }> = [
  { id: 'greetings', labelAr: 'التحية', emoji: '👋' },
  { id: 'family', labelAr: 'العائلة', emoji: '👨‍👩‍👧' },
  { id: 'numbers', labelAr: 'الأعداد', emoji: '🔢' },
  { id: 'food', labelAr: 'الطعام', emoji: '🍞' },
  { id: 'world', labelAr: 'العالم', emoji: '🌍' },
  { id: 'people', labelAr: 'الناس', emoji: '🙋' },
]

export interface StoryPage {
  tz: string
  ar: string
  who: string
  image: string
}

/** A1 dialogue (First Encounters) from Tamazight For All, used as a reader. */
export const STORY_PAGES: StoryPage[] = [
  { tz: 'ⴰⵣⵓⵍ!', ar: 'مرحبًا!', who: 'ⵉⴷⵉⵔ', image: '/images/amz-real/greetings.jpg' },
  { tz: 'ⴰⵣⵓⵍ، ⵎⴰⵏⵎⴽ ⵜⴳⵉⴷ؟', ar: 'مرحبًا، كيف حالك؟', who: 'ⵜⴰⵣⵉⵔⵉ', image: '/images/amz-real/greetings.jpg' },
  { tz: 'ⴼⵊⵊⵉⵊⵖ. ⵏⴽⴽ ⵉⵙⵎ ⵉⵏⵓ ⵉⴷⵉⵔ.', ar: 'أنا بخير. اسمي إيدير.', who: 'ⵉⴷⵉⵔ', image: '/images/amz-real/school.jpg' },
  { tz: 'ⵏⴽⴽ ⴳⵉⵖ ⵜⴰⵣⵉⵔⵉ.', ar: 'أنا تازيري.', who: 'ⵜⴰⵣⵉⵔⵉ', image: '/images/amz-real/family.jpg' },
  { tz: 'ⵎⴰ ⵜⵙⴽⴰⵔⴷ؟', ar: 'ماذا تفعلين؟', who: 'ⵉⴷⵉⵔ', image: '/images/amz-real/school.jpg' },
  { tz: 'ⵏⴽⴽ ⴳⵉⵖ ⵜⴰⵏⵍⵎⴰⴷⵜ. ⵉ ⴽⵢⵢ؟', ar: 'أنا طالبة. وأنت؟', who: 'ⵜⴰⵣⵉⵔⵉ', image: '/images/amz-real/school.jpg' },
  { tz: 'ⵓⵍⴰ ⵏⴽⴽ، ⴳⵉⵖ ⴰⵏⵍⵎⴰⴷ.', ar: 'وأنا أيضًا، أنا طالب.', who: 'ⵉⴷⵉⵔ', image: '/images/amz-real/school.jpg' },
]

export const DAILY_TASKS = [
  { id: 'listen', emoji: '🎧', ar: 'استمع إلى درس اليوم' },
  { id: 'words', emoji: '🃏', ar: 'راجع 5 كلمات' },
  { id: 'write', emoji: '✍️', ar: 'تتبّع حرفًا واحدًا' },
]
