---
name: new-article
description: Add a new article to hishamabuella.com end to end, or update an existing one - the English page, its Egyptian Arabic page, illustrations (local Draw Things), English narration (local cloned voice) and Arabic narration, and every place the article is linked (home, ar/home, the tracks, prev/next nav). Use when the owner says "new article", "write up X as an article", "add an article about…", or changes an article's text and needs the Arabic, audio and links to follow.
---

# New article on hishamabuella.com

CLAUDE.md "Site strategy (current)" and its content rules win over anything here. The README
sections "Articles" and "Article narration" hold the details this skill points to.

**Facts come from the owner.** Ask for what happened, dates, numbers, links and screenshots;
never invent them. Personal details (account or policy numbers, emails, GPS in photos) stay out.

## 0. Agree the basics (ask once, in one message)

- slug (kebab-case, e.g. `tv-calendar`), title, one-line subtitle, month and year
- the story: notes, a draft, or a chat log to shape
- images: owner photos/screenshots to use, and whether to make an illustration
- narration now or later (English is local and free; Arabic uses ElevenLabs credits)

## 1. English page: `Articles/<slug>.html`

Copy the newest article (`ls -t Articles/*.html | head -1`) and replace content only. Keep:
canonical + `og:url` (`https://www.hishamabuella.com/Articles/<slug>.html`), `hreflang`
en/ar/x-default, the logo + Back menu header, `.lang-switch` to `ar/<slug>.html`, the hidden
`.listen` block with `data-src="../audio/articles/<slug>.mp3"`, prev/next `article-nav`, the
shared scripts with their current `?v=` tags (table in CLAUDE.md), and GoatCounter.
Voice: first person, plain, a build log a learner can follow; "I love creating UIs with Claude"
fits; Wireless 101 stays low-key; internal Apple numbers never appear in articles.

## 2. Images: `Articles/img/<slug>-*.jpg`

- **Illustrations**: use the `draw-things` skill (goes through the RAM gate; one image model at
  a time). House style so far: editorial illustration, `z_image_turbo`, **no text in the image**
  (models garble words, Arabic worst of all), hero 1536x768, section images about 1440 wide.
- **Owner photos/screenshots**: crop out anything personal.
- Every image: re-encode to JPEG with no metadata (`sips` alone keeps EXIF; re-encode, e.g.
  with Pillow, without exif), target 40-100 KB, `width`/`height` attributes, `loading="lazy"`
  below the fold, alt text that describes it, translated on the Arabic page.
- Markup: `<figure class="art hero">` under the header for the hero, `<figure class="shot">`
  or `.art` in the body (copy from an article that has them, e.g. `tv-calendar.html`).

## 3. Arabic page: `Articles/ar/<slug>.html`

Use the `egyptian-arabic` skill. Copy the English page, add one `../` to every relative path,
`<html lang="ar-EG" dir="rtl">`, canonical/`og:url` at `/Articles/ar/<slug>.html`, the IBM Plex
Sans Arabic font, `.lang-switch` to "Read in English", `data-src` to
`../../audio/articles/ar/<slug>.mp3`; translate text and alt only. Brief:
`claudeteam/briefs/article-translation-2026-10-13.md`.
`python3 claudeteam/tools/ar_parity.py <slug>` and `python3 claudeteam/tools/ar_style.py` must pass.

## 4. Link it everywhere (both languages)

| Where | What |
| --- | --- |
| `home.html` Writing list | new `writing-row` at the top; move the `New` flag to it |
| `ar/home.html` Writing list | the same row in Arabic, linking `../Articles/ar/<slug>.html`; move the `جديد` flag |
| neighbour articles | previous article's "Next" → this one; this one's "Previous" → it (EN and AR pages) |
| `tracks/vibe.html` | build-log entry (and the "Built" table if it is a thing built), the JS list near the end (`['<slug>', 'English title', 'Arabic title', 'YYYY-MM']`), Arabic strings in the `i18n-ar` block |
| `tracks/learner.html` | a journal `entry` with `?via=learner`, EN text + Arabic key |
| other tracks | only if the article fits them (engineer: research; recruiter: rarely) |

Track links carry `?via=<track>`; new `data-i18n` keys need their Arabic in that page's
`i18n-ar` block.

## 5. Narration

**English (local, free).** Write `audio/articles/source/<slug>.json` for the ear (README
"Article narration": spell out numbers and symbols, no URLs or code, `Abu ella`, one or two
emotion tags per section, sentences under ~200 characters). Shape:
`{"title": "...", "language": "en", "slides": [{"id": "s00", "title": "Intro", "transcript": "..."}]}`.
Lint: `node ~/Work/Elevenlabs-voice/lint-transcript.js audio/articles/source/<slug>.json`.
It is a local voice model: `ram-gate status` must show >= 25% free and no other image/voice
model running (user-level CLAUDE.md). Then:

```sh
cd ~/Work/Whisper-audio/bakeoff
uv run narrate.py article ~/Work/personal_website/home/audio/articles/source/<slug>.json
cp ~/Work/Whisper-audio/site-audio/articles/<slug>.mp3 ~/Work/personal_website/home/audio/articles/
```

Free the memory afterwards (`ram-gate cleanup --voicebox` if it used Voicebox). On a text
change later, update the transcript and re-render only changed sections (`--only s02 s03`).

**Arabic (ElevenLabs, costs credits: ask the owner first).** Transcript in
`audio/articles/source/ar/<slug>.json`, then `./audio/articles/build.sh <slug>`, then add the
slug to `audio/articles/ar/available.json` (the player stays hidden until it is listed).

## 6. Check, then hand over

```sh
python3 claudeteam/tools/build_sitemap.py      # adds both pages to sitemap.xml
python3 claudeteam/tools/site_check.py
python3 claudeteam/tools/ar_parity.py <slug>
uv run claudeteam/tools/regression_test.py      # every page, 390/1440, light/dark, behaviour
```

Open both pages in a browser at 390px and 1440px, light and dark, and once with
`?via=vibe` and `?via=learner`: the skin, the Back menu, the images and the player. Read the
English and Arabic side by side for meaning. Commit when the owner asks; push only after the
owner has reviewed. Commit message: `Article: <title>, English and Egyptian Arabic`.
