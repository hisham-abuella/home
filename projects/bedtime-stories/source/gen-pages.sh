#!/bin/zsh
DEST=/Users/hishamabuella/Work/personal_website/home/projects/bedtime-stories/images-v1
CLI=/opt/homebrew/bin/draw-things-cli
BW="flat vector children's book illustration, bold simple geometric shapes, pure black and white only, thick solid shapes, centered, plain off-white paper background, very high contrast, minimal, generous negative space"
CO="flat vector children's book illustration, bold simple shapes with thick black outlines, centered, plain off-white paper background, cheerful, minimal, generous negative space"
NEG="text, letters, words, numbers, watermark, signature, people, human hands, human faces, photorealistic, cluttered, busy, noisy, deformed, extra limbs, blurry"

gen () {  # name, prompt, seed
  [[ -f "$DEST/$1.png" ]] && { echo "skip $1"; return; }
  $CLI generate --model z_image_turbo_1.0_q8p.ckpt \
    --prompt "$2" --negative-prompt "$NEG" \
    --width 1024 --height 1024 --seed "$3" \
    --output "$DEST/$1.png" >/dev/null 2>&1 && echo "done $1" || echo "FAIL $1"
}

gen cover    "a zebra, a panda and a penguin standing together, $BW, with one small red bird" 101
gen zebra    "a zebra head facing forward with bold black and white stripes, $BW" 102
gen panda    "a panda face with round black ears and black eye patches, $BW" 103
gen cow      "a white cow head with big black spots and small horns, $BW" 104
gen penguin  "a penguin standing, black back and white belly, small red beak and red feet, $BW" 105
gen owl      "an owl with two enormous round eyes, $BW, small red beak" 106
gen orca     "an orca whale leaping over waves, black back and white belly, $BW" 107
gen sheep    "a fluffy white sheep with a black face, like a little cloud with legs, $BW" 108
gen puppy    "a dalmatian puppy sitting, white with black spots, wearing a red collar, $BW" 109
gen cat      "a black cat sitting, white paws and long white whiskers, $BW" 110
gen moon     "a crescent moon with closed sleeping eyes and a few stars, $BW, one small red bird" 111

gen palette  "eight large coloured circles arranged together, red yellow blue green orange purple pink brown, $CO" 201
gen ladybug  "a bright red ladybug with black spots, $CO, dominant red" 202
gen duckling "a soft yellow duckling with an orange beak, $CO, dominant yellow" 203
gen whale    "a big blue whale swimming, $CO, dominant blue" 204
gen frog     "a little green frog sitting on a leaf, $CO, dominant green" 205
gen tiger    "an orange tiger face with black stripes, $CO, dominant orange" 206
gen butterfly "a purple butterfly with open wings, $CO, dominant purple" 207
gen pig      "a round pink pig face with a snout, $CO, dominant pink" 208
gen bear     "a big friendly brown bear face, $CO, dominant brown" 209
gen greycat  "a soft grey cat curled up asleep, $CO, dominant grey" 210
gen rainbow  "a bright rainbow arc with soft clouds, red orange yellow green blue purple, $CO" 211
echo "ALL DONE"
