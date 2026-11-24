import { asset } from '../lib/asset'

/**
 * Authentic vocabulary and dialogue drawn from free Moroccan Amazigh courses.
 * Sources are documented in docs/review/amazigh-sources.md â€” nothing here is
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
  { tz: 'â´°âµ£âµ“âµچ', audio: asset(''), latin: 'Azul', ar: 'ظ…ط±ط­ط¨ظ‹ط§', emoji: 'ًں‘‹', category: 'greetings' },
  { tz: 'âµœâ´°âµڈâµژâµژâµ‰âµ”âµœ', audio: asset(''), latin: 'Tanmmirt', ar: 'ط´ظƒط±ظ‹ط§', emoji: 'ًں™ڈ', category: 'greetings' },
  { tz: 'âµ‰â´±â´±â´°', audio: asset(''), latin: 'ibba', ar: 'ط£ط¨', emoji: 'ًں‘¨', category: 'family' },
  { tz: 'âµ‰âµژâµژâ´°', audio: asset(''), latin: 'imma', ar: 'ط£ظ…', emoji: 'ًں‘©', category: 'family' },
  { tz: 'â´³âµژâ´°', audio: asset(''), latin: 'gma', ar: 'ط£ط®', emoji: 'ًں‘¦', category: 'family' },
  { tz: 'âµ“âµچâµœâµژâ´°', audio: asset(''), latin: 'ultma', ar: 'ط£ط®طھ', emoji: 'ًں‘§', category: 'family' },
  { tz: 'â´°âµژâµ¢â´°', audio: asset(''), latin: 'amya', ar: 'طµظپط±', emoji: '0ï¸ڈâƒ£', category: 'numbers' },
  { tz: 'âµ¢â´°âµڈ', audio: asset(''), latin: 'yan', ar: 'ظˆط§ط­ط¯', emoji: '1ï¸ڈâƒ£', category: 'numbers' },
  { tz: 'âµ™âµ‰âµڈ', audio: asset(''), latin: 'sin', ar: 'ط§ط«ظ†ط§ظ†', emoji: '2ï¸ڈâƒ£', category: 'numbers' },
  { tz: 'â´½âµ•â´°â´¹', audio: asset(''), latin: 'kل¹›aل¸چ', ar: 'ط«ظ„ط§ط«ط©', emoji: '3ï¸ڈâƒ£', category: 'numbers' },
  { tz: 'â´½â´½âµ“âµ¥', audio: asset(''), latin: 'kkuل؛“', ar: 'ط£ط±ط¨ط¹ط©', emoji: '4ï¸ڈâƒ£', category: 'numbers' },
  { tz: 'âµ™âµژâµژâµ“âµ™', audio: asset(''), latin: 'smmus', ar: 'ط®ظ…ط³ط©', emoji: '5ï¸ڈâƒ£', category: 'numbers' },
  { tz: 'â´°âµ–âµ”âµ“âµژ', audio: asset(''), latin: 'aة£rum', ar: 'ط®ط¨ط²', emoji: 'ًںچ‍', category: 'food' },
  { tz: 'â´°âµژâ´°âµڈ', audio: asset(''), latin: 'aman', ar: 'ظ…ط§ط،', emoji: 'ًں’§', category: 'food' },
  { tz: 'â´°â´½âµ™âµ“âµژ', audio: asset(''), latin: 'aksum', ar: 'ظ„ط­ظ…', emoji: 'ًں¥©', category: 'food' },
  { tz: 'âµœâ´°â´³âµچâ´°âµ¢âµœ', audio: asset(''), latin: 'taglayt', ar: 'ط¨ظٹط¶ط©', emoji: 'ًں¥ڑ', category: 'food' },
  { tz: 'âµœâ´°â´¼âµ“â´½âµœ', audio: asset(''), latin: 'tafukt', ar: 'ط´ظ…ط³', emoji: 'âک€ï¸ڈ', category: 'world' },
  { tz: 'â´°âµ¢âµ¢âµ“âµ”', audio: asset(''), latin: 'ayyur', ar: 'ظ‚ظ…ط±', emoji: 'ًںŒ™', category: 'world' },
  { tz: 'âµ‰â´³âµڈâµڈâ´°', audio: asset(''), latin: 'ignna', ar: 'ط³ظ…ط§ط،', emoji: 'âکپï¸ڈ', category: 'world' },
  { tz: 'â´°â´·âµ”â´°âµ”', audio: asset(''), latin: 'adrar', ar: 'ط¬ط¨ظ„', emoji: 'â›°ï¸ڈ', category: 'world' },
  { tz: 'âµ‰âµچâµچ', audio: asset(''), latin: 'ill', ar: 'ط¨ط­ط±', emoji: 'ًںŒٹ', category: 'world' },
  { tz: 'âµڈâ´½â´½', audio: asset(''), latin: 'nkk', ar: 'ط£ظ†ط§', emoji: 'ًں™‹', category: 'people' },
  { tz: 'â´°âµ™âµچâµژâ´°â´·', audio: asset(''), latin: 'aslmad', ar: 'ط£ط³طھط§ط°', emoji: 'ًں‘¨â€چًںڈ«', category: 'people' },
  { tz: 'â´°âµژâµ™â´³âµڈâ´°â´¼', audio: asset(''), latin: 'amsgnaf', ar: 'ط·ط¨ظٹط¨', emoji: 'ًں‘¨â€چâڑ•ï¸ڈ', category: 'people' },
  { tz: 'âµœâµ“âµڈâµڈâµ“âµڈâµœ', audio: asset(''), latin: 'tunnunt', ar: 'ط±ظٹط§ط¶ط©', emoji: 'âڑ½', category: 'people' },
]

export const CATEGORIES: Array<{ id: DictWord['category']; labelAr: string; emoji: string }> = [
  { id: 'greetings', labelAr: 'ط§ظ„طھط­ظٹط©', emoji: 'ًں‘‹' },
  { id: 'family', labelAr: 'ط§ظ„ط¹ط§ط¦ظ„ط©', emoji: 'ًں‘¨â€چًں‘©â€چًں‘§' },
  { id: 'numbers', labelAr: 'ط§ظ„ط£ط¹ط¯ط§ط¯', emoji: 'ًں”¢' },
  { id: 'food', labelAr: 'ط§ظ„ط·ط¹ط§ظ…', emoji: 'ًںچ‍' },
  { id: 'world', labelAr: 'ط§ظ„ط¹ط§ظ„ظ…', emoji: 'ًںŒچ' },
  { id: 'people', labelAr: 'ط§ظ„ظ†ط§ط³', emoji: 'ًں™‹' },
]

export interface StoryPage {
  tz: string
  ar: string
  who: string
  image: string
}

/** A1 dialogue (First Encounters) from Tamazight For All, used as a reader. */
export const STORY_PAGES: StoryPage[] = [
  { tz: 'â´°âµ£âµ“âµچ!', ar: 'ظ…ط±ط­ط¨ظ‹ط§!', who: 'âµ‰â´·âµ‰âµ”', image: asset('') },
  { tz: 'â´°âµ£âµ“âµچطŒ âµژâ´°âµڈâµژâ´½ âµœâ´³âµ‰â´·طں', ar: 'ظ…ط±ط­ط¨ظ‹ط§طŒ ظƒظٹظپ ط­ط§ظ„ظƒطں', who: 'âµœâ´°âµ£âµ‰âµ”âµ‰', image: asset('') },
  { tz: 'â´¼âµٹâµٹâµ‰âµٹâµ–. âµڈâ´½â´½ âµ‰âµ™âµژ âµ‰âµڈâµ“ âµ‰â´·âµ‰âµ”.', ar: 'ط£ظ†ط§ ط¨ط®ظٹط±. ط§ط³ظ…ظٹ ط¥ظٹط¯ظٹط±.', who: 'âµ‰â´·âµ‰âµ”', image: asset('') },
  { tz: 'âµڈâ´½â´½ â´³âµ‰âµ– âµœâ´°âµ£âµ‰âµ”âµ‰.', ar: 'ط£ظ†ط§ طھط§ط²ظٹط±ظٹ.', who: 'âµœâ´°âµ£âµ‰âµ”âµ‰', image: asset('') },
  { tz: 'âµژâ´° âµœâµ™â´½â´°âµ”â´·طں', ar: 'ظ…ط§ط°ط§ طھظپط¹ظ„ظٹظ†طں', who: 'âµ‰â´·âµ‰âµ”', image: asset('') },
  { tz: 'âµڈâ´½â´½ â´³âµ‰âµ– âµœâ´°âµڈâµچâµژâ´°â´·âµœ. âµ‰ â´½âµ¢âµ¢طں', ar: 'ط£ظ†ط§ ط·ط§ظ„ط¨ط©. ظˆط£ظ†طھطں', who: 'âµœâ´°âµ£âµ‰âµ”âµ‰', image: asset('') },
  { tz: 'âµ“âµچâ´° âµڈâ´½â´½طŒ â´³âµ‰âµ– â´°âµڈâµچâµژâ´°â´·.', ar: 'ظˆط£ظ†ط§ ط£ظٹط¶ظ‹ط§طŒ ط£ظ†ط§ ط·ط§ظ„ط¨.', who: 'âµ‰â´·âµ‰âµ”', image: asset('') },
]

export const DAILY_TASKS = [
  { id: 'listen', emoji: 'ًںژ§', ar: 'ط§ط³طھظ…ط¹ ط¥ظ„ظ‰ ط¯ط±ط³ ط§ظ„ظٹظˆظ…' },
  { id: 'words', emoji: 'ًںƒڈ', ar: 'ط±ط§ط¬ط¹ 5 ظƒظ„ظ…ط§طھ' },
  { id: 'write', emoji: 'âœچï¸ڈ', ar: 'طھطھط¨ظ‘ط¹ ط­ط±ظپظ‹ط§ ظˆط§ط­ط¯ظ‹ط§' },
]
