# hishamabuella.com

Personal website and engineering blog of Hisham Abuella — cellular systems engineer
(5G baseband, RF digital front-end, signal processing, machine learning).

Live at **https://www.hishamabuella.com** (GitHub Pages, deployed from `main`).

## Pages

- `index.html` — the reader gateway ("Tune in"): a radio-tuner front page where each reader
  type is a 5G band. Four tracks plus "Open the full site"; with no choice in 30 seconds it
  opens the full site (any click, tap, key or real scroll stops the countdown). It remembers
  the last track and offers "continue" without redirecting.
- `home.html` — the full site: background, expertise, selected work, writing, contact
- `tracks/` — the four reader tracks, each English + Egyptian Arabic (`?lang=ar`) with its own
  phone layout: `recruiter.html` (catalogue, n71), `engineer.html` (constellation, n78),
  `vibe.html` (terminal, n257), `learner.html` (journal, n260). Shared assets in
  `tracks/assets/` (`i18n.js`, `theme.js`, `ident.css`, `ident.js`, `bio.jpg`)
- `cv.html` — CV, deliberately a plain white document and print-ready
- `Articles/` — eight long-form posts, each with an optional narrated version;
  `Articles/ar/` holds their Egyptian Arabic pages
- `projects/presentation-skill/` — slide-deck demos (`template.html`, `claude101.html`)
- `different_designs/` — explorations only (mockups, logo concepts, older pages), not linked from the live site
- `Pictures/`, `audio/` — media; `audio/articles/` holds the article narration

## Design system

Structure and colour are separated, so a page picks a look by swapping one file.

```
css/base.css          layout and components; holds no colour values
css/themes/*.css      midnight (default), daylight, contrast — tokens only
css/article.css       article pages, built on those tokens
css/cv.css            CV; overrides the tokens to stay white in any appearance
css/skins/*.css       catalogue, constellation, terminal, journal: article skins matching the four tracks
css/skins/reader-bar.css   the track chip + Auto/Light/Dark pill on skinned articles
js/appearance.js      appearance switcher + scroll reveals, shared by all pages
js/reader-bar.js      builds the reader bar on articles that have a skin
js/signal-field.js    the animated noise-and-signal backdrop
js/listen.js          shows an article's "Listen" player once its narration exists
```

To theme a new page: link `base.css`, the three theme files and any page stylesheet,
copy the inline pre-paint snippet from `home.html` (it applies the stored appearance
before first paint so nothing flashes), then add `appearance.js` and `signal-field.js`.
Themes must only define tokens — putting layout in a theme is what makes these systems
fight each other.

**Auto is the default appearance.** The switch offers Auto, Dark (Midnight), Light (Daylight)
and Contrast; the stored value is the visitor's preference and `data-appearance` the resolved
theme. Auto follows the system light/dark setting and keeps following it.

The preference is shared with the tracks: tracks store `reader-theme` (auto/light/dark), the
site stores `appearance` (auto/midnight/daylight/contrast), and each writes both. Tracks have
their own palettes and styles (`tracks/assets/`); they do not use `base.css`. The "Back to
Portfolio" link on articles and the CV back button go to `home.html`.

**Typefaces are tokens** (`--font-body`, `--font-mono` in `base.css`), so a skin can swap them.

**Article skins.** An article takes the look of the reader track the visitor came from:
`?via=recruiter|engineer|vibe|learner` (or the track remembered in `reader-path`) sets
`data-skin="catalogue|constellation|terminal|journal"`, loads only that skin's fonts, and adds the reader
bar. `?via=site` clears it. Skins restyle Midnight and Daylight; Contrast always wins. With no
track, articles look exactly as before.

The decks under `projects/presentation-skill/` are self-contained and keep their own
copy of the palette, since they are exported and shared as single files.

## Brand

The logo is the bilingual ligature: a teal serif H crossed by one amber Arabic stroke, chosen
2026-10-13 from a set of concepts generated locally with Draw Things. Colours: teal `#013C44`, amber `#B86803`, cream `#F6F2E0`.

```
brand/mark.png               the mark alone, cut from the concept, transparent background
favicon.ico                  16/32/48 px, at the site root where browsers look by default
brand/favicon-16/32/48.png   the mark on a cream rounded tile, so it reads on dark tabs too
brand/apple-touch-icon.png   180 px home-screen icon
brand/icon-512.png           512 px icon (upscaled from a ~330 px source; re-render the concept
                             larger if a sharper big icon is ever needed)
brand/logo-horizontal-*.png  mark + "Hisham Abuella" + هشام أبو العلا, light and dark
brand/og-image.png           1200x630 share image, set as og:image on the site pages
```

Names are always set in real type (Manrope, IBM Plex Sans Arabic), never generated: image
models garble Arabic. The amber stroke is drawn as a flourish; it reads closer to ح than ه.
Every page links the favicon set; the decks and bedtime books under `projects/` keep their own
icons because they are shared as standalone files.

## Articles

Each article is a self-contained page in `Articles/`, built on `css/article.css`.
Copy the newest one as a starting point, then:

1. Add a row to the Writing list in `home.html` (move the `New` flag to it).
2. Link it from the previous article's `article-nav` "Next" slot, and point its own
   "Previous" back.
3. Keep personal details out of text and photos: no policy or account numbers, no
   email addresses, no GPS metadata in images (re-encode them; `sips` alone keeps EXIF).
4. Write a narration transcript (below). The page already has the player markup if it
   was copied from an existing article.
5. Add its Egyptian Arabic page, `Articles/ar/<slug>.html`: copy the English page, add one
   `../` to every relative path, set `<html lang="ar-EG" dir="rtl">`, point canonical/og:url
   at the `ar/` address, add the IBM Plex Sans Arabic font, swap the `.lang-switch` link to
   "Read in English", and translate the text only (brief and fixed strings:
   `claudeteam/briefs/article-translation-2026-10-13.md`). Both pages carry `hreflang` en/ar/
   x-default. `python3 claudeteam/tools/ar_parity.py <slug>` must print OK. When an English
   article changes, change its Arabic page in the same commit.

## Article narration

Every article can be listened to in my own cloned voice, generated with ElevenLabs.

```
audio/articles/source/<slug>.json   spoken transcript, one entry per section (source of truth)
audio/articles/<slug>.mp3           the joined narration the page plays
audio/articles/build.sh             lint, generate, QA and join, one article at a time
../article-audio/<slug>/            per-section clips, kept outside the repo
```

The player is a `.listen` block under the article header with
`data-src="../audio/articles/<slug>.mp3"`. `js/listen.js` checks for the file and keeps
the player hidden until it exists, so an article can ship before its audio does.

```sh
./audio/articles/build.sh <slug>   # one article
./audio/articles/build.sh next     # the newest article without audio
./audio/articles/build.sh all      # every missing one, newest first; stops at the first failure
```

The script uses voice `pusofH2Ro5Ny4RH6qBEO` (Hisham, cloned) on `eleven_v4` with
stability 0.5 and similarity 0.8, the recipe used for the bedtime books, and prints the
quota before and after. It needs `ELEVENLABS_API_KEY` in `~/.zshrc` and the tools in
`~/Work/Elevenlabs-voice/` (`generate.js`, `lint-transcript.js`, `qa-audio.py`).

Transcripts are written for the ear, not copied from the page:

- numbers, units and symbols spelled out; tables and lists turned into sentences
- no URLs, code or markup; say "the link is in the article" instead
- names respelled where needed: `Abu ella`, `aitch ay eye` for H_AI, `Kwen` for Qwen
- one to two emotion tags per section (`[warmly]`, `[curious]`, `[sighs]`, `[laughs]`…),
  placed where a person would naturally change tone; more than that sounds performed
- sentences under about 200 characters; `<break time="0.5s" />` after section titles

Run `node ~/Work/Elevenlabs-voice/lint-transcript.js audio/articles/source/<slug>.json`
after any edit. Warnings for `AI` and `PC` are expected; the model reads them correctly.

Cost: ElevenLabs bills `eleven_v4` at roughly an eighth of the script length on this
account (the Two Nails article, 6,881 characters, needed 840 credits). All eight
articles come to about 6,200 credits. After editing a transcript, regenerate only the
changed section: delete its clip in `../article-audio/<slug>/` and rerun the script.

## Development

Static HTML, CSS and JS with no build step:

```sh
python3 -m http.server
```

Browsers cache `css/` and `js/` aggressively — hard-reload after editing them, or the
page will keep rendering the previous stylesheet.
