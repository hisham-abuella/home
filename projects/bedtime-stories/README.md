# Bedtime Stories

Board books made for Yusuf, matched to what he can see and hear at each age.
Each story is one self-contained HTML file plus a folder of narration audio —
no framework, no build step. Open `index.html` for the shelf.

| Story | File | Age it was made for |
| --- | --- | --- |
| The Black and White Zoo | `black-white-zoo.html` | 3 months |
| Susu the Cat | `susu.html` | 3 months |

## The Black and White Zoo

Two chapters, 11 pages each, English and Arabic.

- **Black & White** — zebra, panda, cow, penguin, owl, orca, sheep, puppy, cat,
  goodnight moon. Maximum contrast, because that is what a newborn resolves best.
- **Colours** — red, yellow, blue, green, orange, purple, pink, brown, grey, rainbow.
  Introduced in the order infant colour vision develops; heavy black outlines keep the
  contrast working.

A red bird hides in a different corner of every animal page — red is the first colour
a baby can pick out. Nine hiding places.

## Susu the Cat

The true story of Susu — adopted in Oklahoma during the PhD, the drive to California,
then Mama, then Yusuf. Ten pages, deliberately undated: the shape is *then, and then,
and then*.

One page carries the hadith of the woman punished over a cat she imprisoned without
food or water (Bukhari 3318, Muslim 2242). The child-facing wording is gentle; the full
narration and its sources sit in the grown-up note on that page, beside the hadith of
the thirsty dog.

## Two sets of artwork

The top bar has an **Artwork** switch:

- **drawn** — hand-written SVG, inline in the page. The right one for a newborn.
- **illustrated** — generated images in `images-v1/` and `images-susu/`, made locally
  with `draw-things-cli` (Z-Image Turbo, 1024×1024). Prompts and seeds in
  `source/gen-pages.sh` and `source/gen-susu.sh`.

The zoo opens on *drawn*, Susu on *illustrated*. A page whose image is missing falls
back to the drawing, so the switch is safe while a batch is still rendering.

## Audio

| Folder | Contents | Voice |
| --- | --- | --- |
| `audio/en`, `audio/ar` | Zoo, black & white pages | Hisham (cloned) / Sarah |
| `audio/cen`, `audio/car` | Zoo, colour pages | Hisham (cloned) / Sarah |
| `audio/ens`, `audio/ars`, `audio/cens`, `audio/cars` | Animal sounds | Hisham / Sarah |
| `audio-susu/en`, `audio-susu/ar` | Susu pages | Hisham (cloned) / Sarah |
| `audio-susu/ens`, `audio-susu/ars` | Mew, purr, meow | Hisham / Sarah |

Voice ids: Hisham `pusofH2Ro5Ny4RH6qBEO`, Sarah `EXAVITQu4vr4xnSDxMaL`.
Model: **`eleven_v4`**, delivery written into the transcripts as audio tags.

## Adding a story

1. Copy `susu.html` as a starting point — page data lives in the `BOOK` object near
   the bottom, artwork in the `ART` map above it.
2. Write the transcripts into `source/` — one file per language, same `id` set in both.
3. Lint, generate, check:

   ```sh
   node ~/Work/Elevenlabs-voice/lint-transcript.js --pair source/new-en.json source/new-ar.json
   node ~/Work/Elevenlabs-voice/generate.js source/new-en.json audio-new/en \
     --voice pusofH2Ro5Ny4RH6qBEO --model eleven_v4 --stability 0.5 --similarity 0.8
   python3 ~/Work/Elevenlabs-voice/qa-audio.py source/new-en.json audio-new/en
   ```

4. Add the book to the shelf in `index.html` and the table above.

Full guidance, including the Arabic rules and what breaks: `~/.claude/skills/elevenlabs-audio.md`.
To render locally instead of through ElevenLabs: `~/Work/AI_server/scripts/voiceover.py`.

## Where these are published

This repo publishes itself through GitHub Pages:

**https://hisham-abuella.github.io/bedtime-stories/**

The shelf is `index.html`; the books, their audio and their artwork are served
from the same place, which is what the printed QR codes point at. Pushing to
`main` republishes.

A second set of copies is served at **www.hishamabuella.com/projects/bedtime-stories/**
from the `home` website repo, alongside the article about how they were made.
Copy a finished story across when it is ready.

## Printed editions

Four editions per story, all built from the book itself — the artwork and both
languages are lifted out of its own `ART` and `BOOK` data, so a printed copy
cannot drift from the screen one.

| File | Format | Artwork |
|---|---|---|
| `<book>-print.pdf` | A5 portrait | hand-drawn |
| `<book>-print-illustrated.pdf` | A5 portrait | generated |
| `<book>-board.pdf` | 180mm square + 3mm bleed | hand-drawn |
| `<book>-board-illustrated.pdf` | 180mm square + 3mm bleed | generated |

Rebuild all eight after changing a story:

```sh
tools/build-print.sh
```

### Printing a board book

A three-month-old reads with his hands and his mouth. Paper tears, creases and
goes soft; the board edition is the one to make if the book is going to be
handled rather than held up. **Print the `-board` PDF, never the A5 one** — it
carries the bleed and crop marks the rest of this depends on.

| | |
|---|---|
| Stock | **300–350gsm** card, matte or silk. Below 250gsm it will not feel like a board book; above 400gsm most home printers jam. |
| Sides | **Single-sided.** Each leaf is two sheets glued back to back, which is what makes it stiff. |
| Finish | **Matte laminate or self-adhesive laminating pouches.** This is the part that matters most: it is what survives being chewed, and it keeps ink out of his mouth. |
| Corners | **Round every corner, 10mm radius**, with a corner punch after trimming. Square card corners on a 350gsm board are genuinely sharp at eye height. |
| Ink | Any inkjet or laser. Laminate regardless — unlaminated inkjet ink lifts when wet. |

Assembly:

1. Print single-sided on card. One page per sheet, any paper size that holds
   186mm square — A4 works.
2. Trim to the crop marks: 180mm square. The folio in the bleed is the page
   number, so a stack of loose sheets stays in order; trimming removes it.
3. Laminate each sheet.
4. Glue back to back **in printed order** — 1+2, 3+4, 5+6 — so each leaf is one
   board with the right page on each face. The zoo makes eleven leaves, Susu five.
5. Round the corners.
6. Bind along the left edge: book-binding tape, or two holes and a ring. Rings
   let a chewed page be replaced without rebuilding the book.

A commercial printer will take the same PDF — ask for 180mm square, single-sided
on 350gsm, matte laminate both sides, 10mm rounded corners, trimmed to the crop
marks.

### The QR code

Every chapter cover carries a QR that opens the narrated version on a phone, so
whoever is holding the printed book can play the same voice reading it.

| Cover | Opens |
|---|---|
| The Black and White Zoo | `.../black-white-zoo.html` |
| Nine Bright Colours (chapter two) | `.../black-white-zoo.html#color` |
| Susu the Cat | `.../susu.html` |

They point at this repo's own GitHub Pages site,
`https://hisham-abuella.github.io/bedtime-stories/`, which serves the html, the
audio and the artwork. The chapter codes work because the book now keeps its
chapter in the address: `#bw` and `#color` open that chapter directly, and
switching chapters updates the address.

`tools/make-print.js` picks the code per chapter — `print/qr-zoo-<chapter>.svg`
if it exists, otherwise `print/qr-zoo.svg`. Regenerate with `segno`, at
quartile correction, **and add a `viewBox`**: segno writes `width`/`height` but
no `viewBox`, so without one the symbol renders at natural size and the page
clips it into something that will not scan.

### Generated artwork in print

The books ship 1024px PNGs. At 180mm that is 232dpi, which is fine for these
flat illustrations but below the 300dpi a printer will ask for. `build-print.sh`
writes print-weight JPEGs into `print/img/` first, which takes the illustrated
editions from 14MB to 2.5MB without a visible change at this size.
