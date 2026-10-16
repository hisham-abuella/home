---
name: egyptian-arabic
description: Write, translate or review the Egyptian Arabic side of hishamabuella.com (ar/home.html, Articles/ar/, the ?lang=ar text in index.html and tracks/, the -ar slide decks). Use for any new or changed Arabic text, for an English change that needs its Arabic partner, and before shipping. Keeps English technical words in Latin script and checks meaning, grammar and consistency.
---

# Egyptian Arabic on hishamabuella.com

The Arabic pages should sound like an engineer from Cairo talking, not like a translation.
English and Arabic ship together; CLAUDE.md "Site strategy (current)" wins over anything here.

## Fast workflow

1. **Write or change the English first**, then the Arabic in the same edit.
2. **Translate whole paragraphs, not words.** Read the English paragraph, then say it the way you
   would explain it to a colleague in Cairo. Keep every fact, number and link; drop nothing.
3. **Run the checks** (seconds, no browser):
   ```
   python3 claudeteam/tools/ar_style.py     # Latin tech words, و spacing, الـ, gender, MSA forms
   python3 claudeteam/tools/ar_parity.py    # same structure and links as the English page
   ```
4. **Read the pair side by side** for meaning (the checks cannot catch a wrong word). A quick
   way: extract the text of `<p>`, `<h*>`, `<li>`, `<td>`, `alt` and `aria-label` from both pages
   in order and read them line by line; `ar_parity` already guarantees the lines align.
5. Narration: if the article has a spoken transcript in `audio/articles/source/` (or `ar/`),
   update it too. **Transcripts are the one exception to rule 1 below**: spoken text may spell
   words in Arabic letters if that helps the voice pronounce them.

## Rule 1: English technical words stay English, in Latin script

Never transliterate a technical term into Arabic letters.

| Write | Not |
|---|---|
| model, models | موديل، موديلات |
| code, script, server, hardware, software | كود، سكريبت، سيرفر، هاردوير، سوفتوير |
| slide(s), theme(s), layout, skill | سلايد، ثيم، ليه آوت، سكيل |
| Claude, Apple, Keynote, PowerPoint, JavaScript | كلود، أبل، كي نوت، باور بوينت، جافاسكريبت |
| timer, click, offline, online, dark mode, podcast | تايمر، كليك، أوفلاين، أونلاين، دارك مود، بودكاست |
| data, folder, chat, module, filter(s), modem | داتا، فولدر، شات، موديول، فلاتر، مودم |

Keep in Arabic:
- **Everyday words** that are ordinary Egyptian: موبايل، إيميل، لينك، فيديو، إنترنت/نت، كاميرا،
  كورس، لابتوب، تابلت، ويب، كاوتش.
- **Real Arabic terms** the site already uses: معالجة الإشارات، تقدير القناة، الاستشعار بالضوء
  المرئي، الاتصالات اللاسلكية، الجبر الخطي. Do not swap these for English.
- **Non-technical uses** of a technical-looking word: "موديل الكاوتش" (a tyre model) stays Arabic.

### Attaching Arabic particles to a Latin word

| Meaning | Write | Not |
|---|---|---|
| the X | الـ model | الموديل، ال model |
| for the X | للـ model | لالـ model، لـ الـ model |
| with/in the X | بالـ model | بـ الـ model |
| with X / for X | بـ Claude، لـ Studio | بClaude |
| and X | وClaude، وCSS، و<strong>M</strong> | و Claude |
| the X of Y | الـ vision model | موديل الـ vision، model الـ vision |

"الـ" goes only before Latin words, never before an Arabic one ("الـ محرك" is wrong).
Adjectives stay Arabic and follow the noun: "models محلية"، "model محلي".

## Rule 2: Egyptian, not Modern Standard

بشتغل، عايز، دلوقتي، إزاي، ببلاش، اقرا، ابعتلي، قراية (not قراءة)، دوس (for click/tap in UI text).
Keep the owner's voice: first person, short sentences, light humour where the English has it.

## Rule 3: grammar Arabic does not forgive

- **Number and gender agreement.** كتاب is masculine: "ستة كتب"، "الكتب الستة"، never "ست كتب".
  3 to 10 take a plural ("5 دقايق"), 11 and up a singular ("12 دقيقة"، "30 ثانية").
  Two of something is the dual: "ثانيتين"، "كتابين".
- **Adjectives agree**: "كتب مقوّاة"، "قطة مخططة".
- **Taa marbuta** at the end of feminine words: متمددة، not متمدده.
- **Western digits** (10، 580+, 2026) next to Latin terms.

## Rule 4: meaning traps found in review (October 2026)

| English | Wrong | Right | Why |
|---|---|---|---|
| detect (vital signs) | يكتشف، اكتشاف | يرصد، رصد | اكتشاف means discover |
| kept everything after | ساب كل اللي بعد | احتفظ بكل اللي بعد | ساب reads as "dropped" |
| captions (speech to text) | ترجمة مكتوبة | كلامك مكتوب على الشاشة | ترجمة means translation |
| Work status | (any) | الإقامة is fine | describe what is meant, not the words |

When an English word has two senses, choose the Arabic for the sense in **this** sentence,
then reread the Arabic alone and ask: would a reader who never saw the English get the same fact?

## Rule 5: one name, everywhere

The same thing has the same Arabic name on every page: in the article title, the home Writing
list, all four tracks (cards, journal entries, vibe terminal `log`), prev/next links and `og:title`.
Current titles to copy exactly:

- حواديت قبل النوم لطفل عنده تلات شهور · توليد الصوت من النص بـ models محلية
- بناء Wireless 101 · بناء محرك AI شخصي · بناء WirelessHub مع Claude
- بناء موقع إسلامي تفاعلي للأطفال · مسمارين ومساعدين · ملف HTML واحد، Keynote كامل
- رحلتي من القاهرة لكاليفورنيا · سوسو القطة (the book) · مدوّنة (blog, not بلوج)
- People: هشام أبو العلا؛ أحمد الشافعي (Ahmed Elshafie) at first mention.

Where the English deliberately uses a short label (the vibe terminal `log`, "Islamic kids
website" on the vibe card), the Arabic uses the matching short label; otherwise copy the title.

Before renaming anything, `grep -rn` the old Arabic name across `ar/ Articles/ar/ index.html tracks/
projects/` and change every copy.

## Rule 6: the English is a source too

A translation pass is a good moment to catch English problems. Fix them in both languages:
facts that disagree between pages (years of experience, counts), titles that differ from the real
product, and claims the content rules forbid (CLAUDE.md "Content rules").

## Ideas to make the next pass faster

- Translate a new page in one go from the finished English, then run both checks before reading.
- Keep the glossary in Rule 1 and the titles in Rule 5 current; when you decide a new term,
  add it here and to `TRANSLIT` in `claudeteam/tools/ar_style.py` so the checker enforces it.
- For a large edit, hand the side-by-side read to the `arabic-lead` agent, and let
  `ar_style.py` handle the mechanical checks.
- When a rule keeps catching the same mistake, add a check for it to `ar_style.py` instead of
  relying on memory.
