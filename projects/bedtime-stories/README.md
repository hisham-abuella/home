# Bedtime stories

Stories built for Yusuf, matched to what he can see and hear at each age.
Each story is one self-contained HTML file plus a folder of narration audio.

| Story | File | Age it was made for |
| --- | --- | --- |
| The Black and White Zoo | `black-white-zoo.html` | 3 months |

Article: `../../Articles/bedtime-stories.html`

## The Black and White Zoo

Two chapters, 11 pages each, English and Arabic.

- **Black & White** — zebra, panda, cow, penguin, owl, orca, sheep, puppy, cat, goodnight moon.
  Maximum contrast, because that is what a newborn resolves best.
- **Colours** — red, yellow, blue, green, orange, purple, pink, brown, grey, rainbow.
  Introduced in the order infant colour vision develops; heavy black outlines keep the contrast working.

A red bird hides in a different corner of every animal page — red is the first colour
a baby can pick out.

### Two sets of artwork

The top bar has an **Artwork** switch:

- **drawn** (default) — hand-written SVG, inline in the page. The right one for a newborn.
- **illustrated** — generated images in `images-v1/`, one per page, made locally with
  `draw-things-cli` (Z-Image Turbo, 1024×1024, seeds 101–111 and 201–211; the prompts are
  in `source/gen-pages.sh`). A page whose image is missing falls back to the drawing, so
  the switch is safe to use while a batch is still rendering.

The choice is remembered per browser.

### Audio layout

| Folder | Contents | Voice |
| --- | --- | --- |
| `audio/en/p0–p10.mp3` | Black & White page narration | Hisham (cloned) |
| `audio/ar/p0–p10.mp3` | Black & White page narration | Sarah |
| `audio/cen/c0–c10.mp3` | Colours page narration | Hisham (cloned) |
| `audio/car/c0–c10.mp3` | Colours page narration | Sarah |
| `audio/ens`, `audio/cens` | Animal sounds, English | Hisham (cloned) |
| `audio/ars`, `audio/cars` | Animal sounds, Arabic | Sarah |

Voice ids: Hisham `pusofH2Ro5Ny4RH6qBEO`, Sarah `EXAVITQu4vr4xnSDxMaL`.
Model: `eleven_multilingual_v2`.

### Regenerating the audio

Transcripts live in `source/`. The generator is the shared tool at
`~/Work/Elevenlabs-voice/generate.js` (needs `ELEVENLABS_API_KEY`).

```sh
# page narration — warm, lightly expressive
node ~/Work/Elevenlabs-voice/generate.js source/story-en.json audio/en \
  --voice pusofH2Ro5Ny4RH6qBEO --model eleven_multilingual_v2 \
  --stability 0.38 --style 0.62 --force

# animal sounds — conservative settings on purpose, see below
node ~/Work/Elevenlabs-voice/generate.js source/sounds-en.json audio/ens \
  --voice pusofH2Ro5Ny4RH6qBEO --model eleven_multilingual_v2 \
  --stability 0.5 --similarity 0.8 --style 0.3 --force
```

**Do not raise `--style` on the animal sounds.** High style with low stability on bare
onomatopoeia (`Grrrrrr`, `Mooooooo`) makes the model warble and garble — it has no
linguistic context to anchor on. Every sound line is written as a short carrier
sentence ("the cow says moo") for the same reason.

### Adding the next story

1. Copy `black-white-zoo.html` as a starting point — the page data lives in the `BOOK`
   object near the bottom, the artwork in the `ART` map above it.
2. Put the new transcripts in `source/`, generate into a new `audio/` subfolder.
3. Add a row to the table at the top of this file, a card in `../../index.html`,
   and a section in `../../Articles/bedtime-stories.html`.
