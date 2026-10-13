# Logo concepts

Generated locally with Draw Things (`qwen_image_2512_q8p.ckpt`, 1024×1024) through
`/opt/homebrew/bin/draw-things-cli`, the same engine `~/Work/AI_server` uses. Every concept has a
fixed seed, so a winner can be re-rendered larger or varied with the edit model.

Shared negative prompt: `photo, 3d render, mockup, gradient mess, clutter, watermark, extra text,
misspelled text, blurry, low quality`.

| File | Seed | Idea |
|------|------|------|
| `concepts/1-wave-monogram.png` | 1101 | "HA" monogram whose crossbar is a sine wave; navy + amber; EN and AR wordmarks |
| `concepts/2-constellation-h.png` | 2202 | 4×4 golden 16-QAM dot grid with the dots forming "H"; on navy |
| `concepts/3-square-kufic.png` | 3303 | هشام in square Kufic calligraphy, black on white, amber accent; EN wordmark below |
| `concepts/4-antenna-seal.png` | 4404 | Circular badge: an "H" whose uprights are antennas emitting radio arcs. **Dropped** (2026-10-13): the Arabic could not be set convincingly along the ring |
| `concepts/5-signal-wordmark.png` | 5505 | Bold wordmark with an amber oscilloscope trace underneath, AR name below |
| `concepts/6-bilingual-ligature.png` | 6606 | One stroke merging Latin "H" and Arabic "ه"; teal + amber; EN and AR wordmarks |

### Favicon-first marks (Z-Image Turbo, ~40 s each, no lettering in the image)

| File | Seed | Idea | At 16 px |
|------|------|------|----------|
| `concepts/9b-qpsk-dot.png` | 9202 | Four navy dots and crosshair axes (a QPSK constellation) on an amber disc | Strongest: dots stay crisp |
| `concepts/8a-pulse-screen.png` | 8101 | One amber pulse on a navy scope screen | Good at 32 px, thin at 16 |
| `concepts/7a-wave-h.png` | 7101 | Navy H whose crossbar is an amber sine wave | Uprights fade, navy on navy |
| `concepts/9a`, `7b`, `8b` | 9101, 7202, 8202 | Variants; 8b came out off-centre | Not shown |

`python3 make_icons.py concepts/<name>.png` crops a mark to its artwork, makes the background
transparent, and writes `icons/<name>/` with `icon-512.png`, `apple-touch-icon.png` (180) and
`favicon-48/32/16.png`. The names go beside the mark as SVG type (see the lockups in
`overlay.html`), never inside the generated image.

## Arabic lettering: always an SVG overlay

The image model garbles Arabic every time (all six concepts here came back with invented
letters), so **never ship generated Arabic**. Every logo keeps its generated image untouched and
gets an SVG layer on top, defined in `overlay.html`:

1. **Patch.** A `<rect>` (or, on a ring, a `band(...)` path) filled with the background colour
   sampled from the image, sized to cover the garbled lettering plus any stray marks around it.
2. **Letter.** A `<text>` with the real name, هشام أبو العلا, in a real Arabic font loaded from
   Google Fonts: IBM Plex Sans Arabic for modern wordmarks, Reem Kufi for Kufic marks. On a ring,
   use `bottomArc(...)` with `<textPath>`, and leave out `direction="rtl"` there, since Chrome lays
   connected Arabic out badly along a path when that is set.
3. **Check.** Open `overlay.html` (Corrected / Original toggle) and read the name letter by letter:
   ه ش ا م · أ ب و · ا ل ع ل ا.
4. **Export.** Open `overlay.html?logo=<name>` at 1024×1024 and screenshot the `.logo` element to
   `fixed/<name>.png` (the Playwright snippet in `claudeteam/log_chat/brand-designer.log`).

To sample a colour: `python3 -c "from PIL import Image; print('#%02X%02X%02X' % Image.open('concepts/<name>.png').convert('RGB').getpixel((x, y)))"`.

`concepts/` holds what the model drew; `fixed/` holds the corrected versions to use. Don't edit
`concepts/`.
