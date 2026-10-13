# Brief: Egyptian Arabic versions of the 8 articles (2026-10-13)

Owner request: "let's add translation for the 8 articles". Arabic pages live in `Articles/ar/<slug>.html`.
They were generated from the English pages: paths already have the extra `../`, `<html lang="ar-EG" dir="rtl">`,
canonical/og:url/hreflang, the IBM Plex Sans Arabic font link, and a "Read in English" link are in place.
Everything still reads in English. The job is to translate the text in place.

## What to translate (Arabic page only)
- `<title>`, `meta description`, `og:title`, `og:description`. Title pattern: `<Arabic title> - هشام أبو العلا`.
- Every visible text node in `<body>`: nav, header, meta line, subtitle, hero overlay, Listen box, headings,
  paragraphs, lists, captions, figure text, table text (not code), quotes, callouts, prev/next nav, footer.
- Text attributes people meet: `alt`, `aria-label`, `title`.

## What not to touch
- Tags, classes, ids, attributes other than the text ones above, `href`/`src` values, `<style>`, `<script>`.
  The element structure must stay identical to the English page (the checker enforces this).
- Code, commands, file names, URLs, model and product names (Claude, Claude Code, Voicebox, VibeVoice, ElevenLabs,
  Mac Studio M4 Max, Raspberry Pi...), anything inside `<code>`, `<pre>`, `<kbd>`.
- The "Read in English" link (`class="lang-switch"`) stays in English.
- Existing Arabic text in the English page (for example Arabic narration lines) stays as it is.
- The English pages, `audio/`, CSS and JS. Other team members own those.

## Register and wording
Follow `.claude/agents/arabic-lead.md`. In short:
- Egyptian Arabic as Hisham would write it to a friend who is an engineer: clear, warm, not slangy, not MSA news-speak.
  Prefer: دلوقتي، عايز، إزاي، كده، بتاع، اللي، مش، هنا، كمان. First person is Hisham; masculine forms (owner confirmed).
- Keep the technical terms engineers say in English, in Latin script, with "الـ" where natural: الـ AGC، الـ DSP،
  الـ prompt، الـ GPU، 5G، OFDM، LLM. Don't invent Arabic coinages for them.
- Western digits (2025، 10+، 2,200+). Units stay Latin (GB, dB, MHz, ms).
- Hyphenated Latin terms that could break across lines: use U+2011 (front‑end, on‑device).
- Adapt idioms; don't translate word by word. Keep every fact, number, name and claim exactly. Add nothing,
  drop nothing, no new claims, no softening, no marketing.
- Dates: "23 أغسطس 2025". Read time: "10 دقايق قراية". Author: "هشام أبو العلا".

## Fixed strings (use exactly, so every page matches)
- `&larr; Back to Portfolio` → `&rarr; رجوع للموقع`
- Appearance → المظهر · Auto → تلقائي · Dark → غامق · Light → فاتح · Contrast → تباين عالي
- `&larr; Previous Article` → `&rarr; المقال اللي فات`
- `Next Article &rarr;` → `المقال الجاي &larr;`
- Listen to this article → اسمع المقال · Narrated in my own voice → بصوتي
- Footer "Crafted with care and attention to detail." → "معمول بحب واهتمام بالتفاصيل."

## Article titles (h1, `<title>`, og:title, and every prev/next `nav-title` that points to it)
| slug | English | Arabic |
|---|---|---|
| journey | My Journey | رحلتي |
| building-wirelesshub | Building WirelessHub with Claude | بناء WirelessHub مع Claude |
| building-wireless101 | Building Wireless 101 | بناء Wireless 101 |
| building-islamic-kids | Building an (Interactive) Islamic Kids Website | بناء موقع إسلامي تفاعلي للأطفال |
| building-ai-server | Building a Personal AI Engine | بناء محرك AI شخصي |
| local-voice-generation | Generating Voice from Text Using Local Models | توليد الصوت من النص بموديلات محلية |
| bedtime-stories | Bedtime Stories for a Three-Month-Old | حواديت قبل النوم لطفل عنده تلات شهور |
| two-nails-two-assistants | Two Nails, Two Assistants | مسمارين ومساعدين |

## Done means
`python3 claudeteam/tools/ar_parity.py <slug>` prints OK for each of your articles (same body structure and
links as English, no English sentence of 6+ words left outside code). Then read the Arabic top to bottom once
more against the English, paragraph by paragraph, for meaning and numbers.
