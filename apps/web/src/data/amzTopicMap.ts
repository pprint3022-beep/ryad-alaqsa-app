/** Topics from the 48-lesson "Awal n Imazighen" curriculum we studied. */
export interface Topic {
  tz: string
  ar: string
  emoji: string
}

export const TOPICS: Topic[] = [
  { tz: 'ⵉⵙⴽⴽⵉⵍⵏ ⵏ ⵜⴼⵉⵏⴰⵖ', ar: 'حروف تيفيناغ', emoji: '🔤' },
  { tz: 'ⵉⵎⴹⴰⵏ', ar: 'الأعداد 0–10', emoji: '🔢' },
  { tz: 'ⴰⵢⵜ ⵜⴰⵡⵊⴰ', ar: 'أفراد العائلة', emoji: '👨‍👩‍👧' },
  { tz: 'ⴰⵣⵎⵣ', ar: 'الزمن', emoji: '⏰' },
  { tz: 'ⵜⴼⴽⴽⴰ ⵏ ⵓⴼⴳⴰⵏ', ar: 'جسم الإنسان', emoji: '🧍' },
  { tz: 'ⵉⵙⵙⴳⴷⴰⵍ ⴷ ⵉⵢⵢⵔⵏ', ar: 'أيام الأسبوع والشهور', emoji: '📅' },
  { tz: 'ⵉⵍⵎⴰⵎ', ar: 'الملابس', emoji: '👕' },
  { tz: 'ⵉⴳⵓⵎⵎⴰ', ar: 'الفواكه', emoji: '🍎' },
  { tz: 'ⵉⴽⵯⵍⴰⵏ', ar: 'الألوان', emoji: '🎨' },
  { tz: 'ⵉⵎⵉⵔⵏ ⵏ ⵓⵙⴳⴳⵯⴰⵙ', ar: 'فصول السنة', emoji: '🍂' },
  { tz: 'ⵉⵎⵓⴷⴰⵔ', ar: 'الحيوانات', emoji: '🐄' },
  { tz: 'ⴰⵎⴰⴹⴰⵍ', ar: 'معجم العالم', emoji: '🌍' },
  { tz: 'ⴰⵏⵣⵡⵉ', ar: 'المناخ والجو', emoji: '☀️' },
  { tz: 'ⵉⵖⵔⵎ', ar: 'المدينة', emoji: '🏙️' },
  { tz: 'ⴰⴷⵡⵡⴰⵔ', ar: 'القرية', emoji: '🏡' },
  { tz: 'ⵜⴰⴷⴰⵡⵙⴰ', ar: 'الصحة', emoji: '🩺' },
  { tz: 'ⴰⵙⵍⵎⴷ', ar: 'التعليم والدراسة', emoji: '🎒' },
  { tz: 'ⴰⵙⵇⵙⵉ', ar: 'أدوات الاستفهام', emoji: '❓' },
]
