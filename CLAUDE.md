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
`ident.css`, `ident.js`, `bio.jpg`):
- `recruiter.html`: catalogue UI (aluminium plus one orange). One-screen dossier, experience, CV,
  copy email. n71, 600 MHz.
- `engineer.html`: constellation UI (16-QAM diagram, gold on deep blue). Research, papers, patent,
  stack. n78, 3.5 GHz.
- `vibe.html`: terminal UI (shell plus typeset README). Things built with Claude, workflow and
  stack, build logs. n257, 28 GHz.
- `learner.html`: journal on green engineering paper. What I learned, the build-log journal,
  resources. n260, 39 GHz.

Every track has: English plus Egyptian Arabic (`?lang=ar`); Auto/Light/Dark with both palettes;
its own phone layout (docked bars in thumb reach); the identity block (photo, name, "Muslim |
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
- The 2,200+ downloads and 6,000+ visitors are internal Apple versions: never next to a public
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

**Workflow.** Commit when asked; push only after the owner has reviewed.

## Project Structure

- `index.html` - the reader gateway ("Tune in")
- `home.html` - the full site (the former homepage), with the Auto/Dark/Light/Contrast appearances
- `tracks/` - the four reader tracks (`recruiter`, `engineer`, `vibe`, `learner`) and `tracks/assets/`
- `cv.html` - plain white print-ready CV
- `Articles/` - long-form posts; `Articles/ar/` their Egyptian Arabic pages; `audio/articles/` holds
  their narration
- `css/` - `base.css` (layout, no colour), `themes/*.css` (tokens), `article.css`, `cv.css`,
  `skins/` (catalogue, constellation, terminal, journal, reader-bar)
- `js/` - `appearance.js`, `reader-bar.js`, `listen.js`, `signal-field.js`, `motion.js`
- `brand/`, `favicon.ico` - logo, share image, favicons
- `projects/presentation-skill/` - slide-deck demos
- `different_designs/` - explorations only (mockups, logo concepts, older designs), not linked
  from the live site; the chosen directions now live in `tracks/`
- `claudeteam/`, `.claude/agents/` - the design team

## Architecture

All pages are static HTML with:
- CSS custom properties for theming; themes hold tokens only, `base.css` holds layout
- Vanilla JavaScript, no external dependencies
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

- Theme system with Auto (default), Midnight, Daylight and Contrast, and no flash before paint
- Modular JS classes: ThemeManager, NavigationManager, FormManager, AnimationManager
- Intersection Observer scroll reveals; floating navbar with backdrop blur

### `different_designs/`

Exploration material only: `mockups/` (five homepage directions), `logo/` (concepts and
Arabic overlays), and the older `light_v1`, `light_v2` and `dark_version2` pages. Nothing here
is live.

## Articles and Narration (current conventions)

`README.md` is the up-to-date guide to the live site. In short:

- Articles live in `Articles/`, use `css/article.css` and the shared theme files, and
  are linked from the Writing list in `home.html` and from each other's prev/next nav.
- Every article has a hidden `.listen` player shown by `js/listen.js` once
  `audio/articles/<slug>.mp3` exists.
- Narration is generated with `audio/articles/build.sh` from the spoken transcripts in
  `audio/articles/source/`. When an article's text changes, update its transcript too,
  and regenerate only the sections that changed.
- Keep personal details (account or policy numbers, emails, photo GPS data) out of
  articles and images.

## Design Team

A team of design subagents lives in `.claude/agents/` (creative-director, visual-designer,
frontend-lead, interaction-designer, ux-writer, arabic-lead, brand-designer, audience-advocate,
qa-lead). `claudeteam/README.md` describes the roster and the one-lead working pattern. All of
them work to "Site strategy (current)" above: the gateway, `home.html`, the four tracks, the
article skins and the content rules. Explorations live in `different_designs/` (mockups, logo
concepts); they are reference, not the plan.

## Development Workflow

Since this is a static website with no build process:

1. **Local Development**: Open HTML files directly in browser or use a simple HTTP server
2. **Testing**: Test across different screen sizes and browsers
3. **Deployment**: Push to GitHub Pages (automatic deployment enabled)

## Common Development Tasks

- **Adding new sections**: Follow the existing card-based layout patterns
- **Theme modifications**: Update CSS custom properties in the `:root` selector
- **Responsive adjustments**: Modify existing media queries or add new breakpoints
- **Animation changes**: Update CSS keyframes or Intersection Observer configurations

## Browser Support

The designs use modern CSS and JavaScript features and target modern browsers that support:
- CSS Grid and Flexbox
- CSS Custom Properties
- Intersection Observer API
- ES6+ JavaScript features
- CSS backdrop-filter (for enhanced visual effects)