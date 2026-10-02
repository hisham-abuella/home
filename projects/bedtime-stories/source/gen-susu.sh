#!/bin/zsh
DEST=/Users/hishamabuella/Work/personal_website/home/projects/bedtime-stories/images-susu
REF=/private/tmp/claude-501/-Users-hishamabuella-Work/00b1ad39-acac-4ee0-8191-40b45b61f32e/scratchpad/susu/susu-ref1-sm.png
CLI=/opt/homebrew/bin/draw-things-cli
SUSU="a brown and grey mackerel tabby cat with a white chest, four white paws, a pink nose and green eyes"
STYLE="warm children's picture book illustration, soft gouache, gentle rounded shapes, cosy, generous negative space, muted warm palette"
NEG="text, letters, words, watermark, signature, people, human faces, human hands, photorealistic, cluttered, deformed, extra limbs, extra tails, blurry"

gen () {
  [[ -f "$DEST/$1.png" ]] && { echo "skip $1"; return; }
  $CLI generate --model z_image_turbo_1.0_q8p.ckpt \
    --prompt "$2" --negative-prompt "$NEG" \
    --width 1024 --height 1024 --seed "$3" \
    --output "$DEST/$1.png" >/dev/null 2>&1 && echo "done $1" || echo "FAIL $1"
}

# the cover is drawn from her actual photograph
$CLI generate --model z_image_turbo_1.0_q8p.ckpt \
  --prompt "portrait of $SUSU resting by a sunny window, $STYLE" \
  --negative-prompt "$NEG" --image "$REF" --strength 0.62 \
  --width 1024 --height 1024 --seed 301 \
  --output "$DEST/cover.png" >/dev/null 2>&1 && echo "done cover (img2img)" || echo "FAIL cover"

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
