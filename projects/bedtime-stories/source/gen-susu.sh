#!/bin/zsh
DEST=${DEST:-/Users/hishamabuella/Work/personal_website/home/projects/bedtime-stories/images-susu}
SIZE=${SIZE:-1024}
mkdir -p "$DEST"
# Her cover is drawn from her real photograph, which lives in the repo so this
# script keeps working after any scratch directory is cleared.
REPO=$(cd "$(dirname "$0")/.." && pwd)
REF=${REF:-$REPO/images/susu-photo.jpg}
CLI=/opt/homebrew/bin/draw-things-cli
SUSU="a brown and grey mackerel tabby cat with a white chest, four white paws, a pink nose and green eyes"
STYLE="warm children's picture book illustration, soft gouache, gentle rounded shapes, cosy, generous negative space, muted warm palette"
NEG="text, letters, words, watermark, signature, people, human faces, human hands, photorealistic, cluttered, deformed, extra limbs, extra tails, blurry"

gen () {
  [[ -f "$DEST/$1.png" ]] && { echo "skip $1"; return; }
  $CLI generate --model z_image_turbo_1.0_q8p.ckpt \
    --prompt "$2" --negative-prompt "$NEG" \
    --width $SIZE --height $SIZE --seed "$3" \
    --output "$DEST/$1.png" >/dev/null 2>&1 && echo "done $1" || echo "FAIL $1"
}

# The cover is still taken from her real photograph ($REF) — the pose and the
# light below are described from it — but drawn rather than traced. Z-Image
# Turbo's img2img reproduces a photograph almost exactly at any strength worth
# using, which left a photographic cover on a book of gouache illustrations.
gen cover "portrait of $SUSU lying on her side in a warm patch of afternoon sunlight on a soft cream carpet, eyes half open, one ear lit from behind, $STYLE" 301

gen oklahoma   "$SUSU as a small kitten sitting beside a stack of books, a snowy window behind, $STYLE" 302
gen desk       "$SUSU curled asleep on a desk full of papers beside a glowing lamp at night, $STYLE" 303
gen drive      "$SUSU looking out of a soft travel carrier, a long highway and mountains behind, $STYLE" 304
gen california "$SUSU curled up on a wide sunny window sill, California light, $STYLE" 305
gen mama       "$SUSU sitting beside a teapot and two cups on a kitchen table, $STYLE" 306
gen baby       "$SUSU sitting calmly beside a baby's wooden crib, keeping watch, $STYLE" 307
gen days       "$SUSU stretching happily in a warm sunbeam, $STYLE" 308
gen kindness   "$SUSU eating from a full food bowl beside a full bowl of water, $STYLE" 309
gen goodnight  "$SUSU asleep curled at the end of a bed, a crescent moon and stars in the window, $STYLE" 310
echo "SUSU IMAGES DONE"
