# hishamabuella.com

Personal website and engineering blog of Hisham Abuella — cellular systems engineer
(5G baseband, RF digital front-end, signal processing, machine learning).

Live at **https://www.hishamabuella.com** (GitHub Pages, deployed from `main`).

## Pages

- `index.html` — home: background, expertise, selected work, writing, contact
- `cv.html` — CV, deliberately a plain white document and print-ready
- `Articles/` — six long-form posts
- `projects/presentation-skill/` — slide-deck demos (`template.html`, `claude101.html`)
- `different_designs/` — earlier explorations, not linked from the live site
- `Pictures/`, `audio/` — media

## Design system

Structure and colour are separated, so a page picks a look by swapping one file.

```
css/base.css          layout and components; holds no colour values
css/themes/*.css      midnight (default), daylight, contrast — tokens only
css/article.css       article pages, built on those tokens
css/cv.css            CV; overrides the tokens to stay white in any appearance
js/appearance.js      appearance switcher + scroll reveals, shared by all pages
js/signal-field.js    the animated noise-and-signal backdrop
```

To theme a new page: link `base.css`, the three theme files and any page stylesheet,
copy the inline pre-paint snippet from `index.html` (it applies the stored appearance
before first paint so nothing flashes), then add `appearance.js` and `signal-field.js`.
Themes must only define tokens — putting layout in a theme is what makes these systems
fight each other.

The decks under `projects/presentation-skill/` are self-contained and keep their own
copy of the palette, since they are exported and shared as single files.

## Development

Static HTML, CSS and JS with no build step:

```sh
python3 -m http.server
```

Browsers cache `css/` and `js/` aggressively — hard-reload after editing them, or the
page will keep rendering the previous stylesheet.
