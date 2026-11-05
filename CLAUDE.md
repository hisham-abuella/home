# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Site strategy (current)

This is the source of truth. If anything else in the repo disagrees, this wins.

**Repository.** Personal site of Hisham Abuella, https://www.hishamabuella.com/ (GitHub Pages,
custom domain in `CNAME`). Vanilla HTML, CSS and JS, no build step. Always maintain the existing style.

**Front page.** `index.html` is the reader gateway ("Tune in"): a radio-tuner metaphor, each
reader type a 5G band. Four tracks plus "Open the full site". If nothing is chosen in 30 seconds
it opens the full site; any click, tap, key or real scroll stops the countdown. It remembers the
last track and offers "continue" without auto-redirecting.

**Full site.** `home.html` is the old homepage, kept as is, with its appearances Auto (default,
follows the system), Dark (Midnight), Light (Daylight) and Contrast. The `cv.html` back button
goes to `home.html`; articles have a "Back" menu (four tracks plus the full website). The CV stays a plain white,
print-ready page (only addition: "Copy CV text").

**Tracks** live in `tracks/`; shared assets in `tracks/assets/` (`i18n.js`, `theme.js`,
`ident.css`, `ident.js`, `mascot.js`, `mascot-buddy.js`, the `mascot/` sprite sheets, `bio.jpg`):
- `recruiter.html`: catalogue UI (aluminium plus one orange). One-screen dossier, experience, CV,
  copy email. n71, 600 MHz.
- `engineer.html`: constellation UI (16-QAM diagram, gold on deep blue). Research, papers, patent,
  stack. n78, 3.5 GHz.
- `vibe.html`: terminal UI (shell plus typeset README). Things built with Claude, workflow and
  stack, build logs. n257, 28 GHz.
- `learner.html`: journal on green engineering paper. What I learned, the build-log journal,
  resources. n260, 39 GHz.

Every track has: English plus Egyptian Arabic (`?lang=ar`); Auto/Light/Dark with both palettes;
its own phone layout (docked bars in thumb reach); the identity block (mini Hisham, name, "Muslim |
Cellular Systems Engineer", California USA, copy email, View CV, LinkedIn/GitHub/Scholar/
Instagram/Facebook); and it stores `localStorage['reader-path']`.

**Articles take the track's look.** `?via=recruiter|engineer|vibe|learner`, or the stored track,
sets a skin (catalogue, constellation, terminal, journal in `css/skins/`) plus the reader bar
(`js/reader-bar.js`, `css/skins/reader-bar.css`): track chip and the same Auto/Light/Dark pill.
`?via=site` clears it. No track means articles look exactly as before. Contrast is never skinned.
Opening `home.html` also clears the stored track, so articles opened from the full site keep its
look. Articles show only Auto/Light/Dark (Contrast appears only while it is the stored choice).
Each article's header has the logo (to the front page) and a "Back" menu: the four tracks and
the full website, in the article's language.

**The full site is bilingual too.** `ar/home.html` is the Egyptian Arabic `home.html` (RTL, same
structure and links; its Writing list opens the Arabic articles). The two link each other from
the top bar ("عربي" / "English"). The Arabic gateway's "Open the full site" and countdown, and the
Arabic articles' "Back → الموقع كامل", open `ar/home.html`. `ar_parity.py home` checks the pair.
The CV is the one page that stays English only.

**Articles are bilingual.** Every article has an Egyptian Arabic page at `Articles/ar/<slug>.html`
(RTL, same structure, links and images; text translated only). Each page links the other
(`.lang-switch`) and both carry `hreflang`. A track in Arabic opens the Arabic articles, and the
reader bar speaks Arabic there. An English article change and its Arabic change ship together;
`python3 claudeteam/tools/ar_parity.py` checks structure and leftover English. Arabic narration
goes in `audio/articles/ar/<slug>.mp3` (the player stays hidden until it exists).

**Theme preference is shared.** Tracks store `reader-theme` (auto/light/dark); the site stores
`appearance` (auto/midnight/daylight/contrast). Each writes both.

**Brand.** The bilingual ligature logo (teal H plus amber Arabic stroke) in `brand/`, with
`favicon.ico` at the root. Names are always set in real type, never generated (image models
garble Arabic). See README "Brand".

**Content rules.**
- A personal site whose heart is articles about vibe coding and the learning journey.
  Self-descriptions include "I love creating UIs with Claude".
- Wireless 101 stays low-key.
- The 2,500+ downloads and the 25,000+ visits (6,700+ unique visitors) are internal Apple versions: never next to a public
  link, never in a "Built" list.
- One U.S. patent, and it is the ViLDAR work (vehicle speed estimation, detection and ranging
  with visible light). The vital-signs work has publications but no patent.
- No invented facts. Sources: `cv.html`, `home.html`, the articles.
- English and Egyptian Arabic change together.
- Every page carries a canonical link and `og:url` on www.hishamabuella.com; the gateway and the
  tracks also carry `hreflang` en / ar (`?lang=ar`) / x-default. Screen-reader labels change
  language too (`data-i18n-aria`, `data-i18n-alt`).
- When a shared script's behaviour changes, bump its `?v=` tag in every page that loads it, so
  no browser pairs new HTML with an old cached script.
- Every change is checked on phone (390px) and laptop (1440px), light and dark; contrast at
  least 4.5:1 for body text; no horizontal scroll; reduced motion respected.

**Mini Hisham (the mascot).** The drawn mascot replaces the photo everywhere a face appears: the
gateway intro and identity block, and every track's hero and identity block. Markup:
`<button type="button" class="mascot" data-mascot="…/tracks/assets/mascot/hisham" aria-label="Boop mini Hisham" data-i18n-aria="mascotMe"></button>`
(the Arabic `mascotMe` lives in each page's Arabic block); size it with CSS on the slot. The
floating buddy (`mascot-buddy.js`) appears on the full site, tracks and articles. **Black and
white:** add class `mono` to one mascot, or `data-mascot-tone="mono"` on `<html>` for a page
drawn in black and white (the vibe track has it, so its buddy is mono too); Contrast and print
go mono on their own. `tracks/assets/bio.jpg` stays only as the schema.org `image`.

**Workflow.** Commit when asked; push only after the owner has reviewed.

## Maintaining the site

Run these before every commit; all must pass:

```sh
python3 claudeteam/tools/site_check.py       # links, anchors, assets, canonical/og:url, hreflang, alt, ?v= consistency
python3 claudeteam/tools/build_sitemap.py --check   # sitemap.xml lists every indexable page
python3 claudeteam/tools/ar_parity.py        # every article: EN/AR structure and leftover English
python3 claudeteam/tools/ar_parity.py home   # home.html vs ar/home.html
python3 claudeteam/tools/ar_style.py         # Arabic style rules
```

Before every push, run the regression test (about 3 minutes; `--quick` for about 1):

```sh
uv run claudeteam/tools/regression_test.py
```

It runs the checks above, loads every live page at 390px and 1440px in light and dark
(JS errors, failed requests, horizontal scroll, broken images, text contrast of 4.5:1, or 3:1
for large text; text on images and gradients is skipped), and tests the behaviour listed
below. Add a check to it whenever a new behaviour ships.

To add or change an article, use the `new-article` skill (`.claude/skills/new-article/`): page,
Arabic page, illustrations, narration, links in every list, checks.

For a visual pass by eye (`python3 -m http.server 8765`, Playwright MCP or the qa-lead agent):
the gateway, `home.html`, `ar/home.html`, the four tracks (EN and `?lang=ar`), a few articles
(EN, AR, and `?via=<track>`), at 390px and 1440px, light and dark. Look for console errors,
failed requests (GoatCounter and the not-yet-recorded `audio/articles/ar/*.mp3` are expected),
horizontal overflow and contrast. Behaviour worth re-testing after JS changes: the gateway's
30-second countdown (and that a key press stops it), "Continue …" after a track visit,
`reader-path` set by tracks and cleared by `home.html`, the article skins, the Back menu, and the
"Listen" player (shown only when the mp3 exists).

**Search engines.** `sitemap.xml` is generated from the pages' own canonical and `hreflang`
tags: after adding, moving or removing a page run `python3 claudeteam/tools/build_sitemap.py`
and commit the result. A page with `<meta name="robots" content="noindex">` or no
self-canonical is left out. `robots.txt` keeps `different_designs/`, `claudeteam/` and
`.claude/` out of search and points to the sitemap. `llms.txt` is a hand-written Markdown
summary for AI assistants (who Hisham is, the pages, every article with one line); add each
new article to it, with no internal Apple numbers. `build_sitemap.py --check` fails if one is
missing.

**Shared files and their current `?v=` tags.** When one changes, bump its tag in every page that
loads it (`grep -rl 'mascot.js?v=4' --include='*.html' .` finds them); `site_check.py` flags a
page left on an old tag.

| File | Tag | Loaded by |
| --- | --- | --- |
| `css/base.css`, `js/appearance.js` | v4, v3 | home, ar/home, articles |
| `css/article.css`, `js/reader-bar.js`, `js/listen.js` | v2, v3, v2 | articles |
| `css/cv.css` | v4 | cv.html |
| `tracks/assets/ident.css`, `ident.js`, `i18n.js` | v3, v2, v2 | gateway, tracks |
| `tracks/assets/mascot.js`, `mascot-buddy.js` | v4, v6 | gateway (mascot only), home, tracks, articles |
| `js/vendor/hairline.js` | v1 | gateway only |

**Adding an article.** Write `Articles/<slug>.html` from an existing one (canonical, `og:url`,
`hreflang` en/ar, `.lang-switch`, Back menu, hidden `.listen` with `data-src`, the shared scripts
with their current tags, GoatCounter). Write `Articles/ar/<slug>.html` with the same structure
(egyptian-arabic skill). Add both to the Writing lists in `home.html` and `ar/home.html`, and to
the prev/next nav of the neighbours. Add the spoken transcript in `audio/articles/source/`.
Run the checks above.

**Known gotchas.**
- Shell: zsh treats a word starting with `=` as a command (`echo ====` fails and stops the line).
- Decks under `projects/presentation-skill/` jump to slides by `data-id` (`#start`, `#live-ui`),
  not by element `id`.
- The 404 page uses root-absolute links (GitHub Pages serves it at any path).
- Hairline figures (MIT, vendored unchanged in `js/vendor/hairline.js`) are used **only** on the
  gateway's four station cards (cabinet, dish, terminal, loupe), laptop only, lit in the station
  colour. Keep it that way: don't spread them to other pages. Reference:
  `different_designs/icons/hairline-mockups.html`.

## Project Structure

- `index.html` - the reader gateway ("Tune in")
- `home.html` - the full site (the former homepage), with the Auto/Dark/Light/Contrast appearances
- `ar/home.html` - the full site in Egyptian Arabic
- `tracks/` - the four reader tracks (`recruiter`, `engineer`, `vibe`, `learner`) and `tracks/assets/`
- `cv.html` - plain white print-ready CV
- `404.html` - "No signal" page, English and Egyptian Arabic side by side (root-absolute links)
- `Articles/` - long-form posts; `Articles/ar/` their Egyptian Arabic pages; `audio/articles/` holds
  their narration
- `css/` - `base.css` (layout, no colour), `themes/*.css` (tokens), `article.css`, `cv.css`,
  `skins/` (catalogue, constellation, terminal, journal, reader-bar)
- `js/` - `appearance.js`, `reader-bar.js`, `listen.js`, `back-menu.js`, `signal-field.js`,
  `motion.js`; `js/vendor/` holds third-party code copied in unchanged (only `hairline.js`)
- `brand/`, `favicon.ico` - logo, share image, favicons
- `sitemap.xml` (generated), `robots.txt`, `llms.txt` (summary for AI assistants), `CNAME`
- `projects/` - `bedtime-stories/` (narrated bilingual books), `local-model-performance/`
  (model comparison, decks and paper), `presentation-skill/` (slide-deck demos)
- `different_designs/` - explorations only (mockups, logo concepts, older designs), not linked
  from the live site; the chosen directions now live in `tracks/`
- `claudeteam/`, `.claude/agents/` - the design team

## Architecture

All pages are static HTML with:
- CSS custom properties for theming; themes hold tokens only, `base.css` holds layout
- Vanilla JavaScript, no CDN and no npm at runtime; the one third-party library is copied into
  `js/vendor/`
- Mobile-first responsive layout (Grid, Flexbox)
- Tracks are self-contained pages built on `tracks/assets/`; articles reuse the site's tokens
  and add a skin on top

### Key Design Patterns

1. **CSS variables for theming**: pages pick a look by swapping token files or skins.
2. **Progressive enhancement**: base content works without JavaScript.
3. **Mobile-first**: every page has its own phone layout, not a squeezed laptop one.
4. **Shared preferences**: language via `?lang=ar`, theme via `reader-theme` / `appearance`,
   track via `reader-path`.

### Full site (`home.html`) features

- Appearances Auto (default), Midnight, Daylight and Contrast (`js/appearance.js`,
  `css/themes/`), set before first paint so there is no flash
- Intersection Observer scroll reveals (`js/motion.js`), the signal-field backdrop
  (`js/signal-field.js`), floating navbar with backdrop blur

### `different_designs/`

Exploration material only: `mockups/` (five homepage directions), `logo/` (concepts and
Arabic overlays), `icons/` (Hairline figure mockups), `landing-skill/` (gateway and 404 drafts),
and the older `light_v1`, `light_v2` and `dark_version2` pages. Nothing here is live.

## Articles and Narration (current conventions)

`README.md` is the up-to-date guide to the live site. In short:

- Articles live in `Articles/`, use `css/article.css` and the shared theme files, and
  are linked from the Writing list in `home.html` and from each other's prev/next nav.
- Every article has a hidden `.listen` player shown by `js/listen.js` once
  `audio/articles/<slug>.mp3` exists.
- English narration is rendered locally in Hisham's cloned voice (Fish S2-Pro) by
  `~/Work/Whisper-audio/bakeoff/narrate.py` from the transcripts in `audio/articles/source/`
  (`--only sNN` for changed sections), then copied into `audio/articles/`. It is a local model:
  follow the RAM-gate rules in the user-level CLAUDE.md. `audio/articles/build.sh` (ElevenLabs)
  is for Arabic narration only. When an article's text changes, update its transcript too and
  regenerate only the sections that changed.
- Keep personal details (account or policy numbers, emails, photo GPS data) out of
  articles and images.

## Design Team

A team of design subagents lives in `.claude/agents/` (creative-director, visual-designer,
frontend-lead, interaction-designer, ux-writer, arabic-lead, brand-designer, audience-advocate,
qa-lead). `claudeteam/README.md` describes the roster and the one-lead working pattern. All of
them work to "Site strategy (current)" above: the gateway, `home.html`, the four tracks, the
article skins and the content rules. Explorations live in `different_designs/` (mockups, logo
concepts); they are reference, not the plan.

## Local development and deploy

- Serve the repo root: `python3 -m http.server 8765`, then open http://127.0.0.1:8765/ (some
  features, such as the narration check and module scripts, need http, not `file://`).
- GitHub Pages deploys `main` automatically; there is no build. Commit when asked, push only
  after the owner has reviewed.
- Target: current Chrome, Safari and Firefox, desktop and phone. The pages use Grid, custom
  properties, `color-mix()`, backdrop-filter and ES modules.
