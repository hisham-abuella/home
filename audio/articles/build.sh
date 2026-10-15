#!/usr/bin/env bash
# Narrate articles in my cloned voice with ElevenLabs, one article at a time.
#
#   audio/articles/build.sh two-nails-two-assistants   one article
#   audio/articles/build.sh next                       the first article without audio yet
#   audio/articles/build.sh all                        every article, newest first; stops at the first failure
#   audio/articles/build.sh ar/slides-in-html          an Arabic narration (source/ar/<slug>.json -> ar/<slug>.mp3)
#   audio/articles/build.sh deck how-it-works          per-slide clips for a showcase deck (audio/slides/source -> audio/slides/<deck>/<slide-id>.mp3)
#   audio/articles/build.sh deck ar/how-it-works       the same for an Arabic deck (audio/slides/source/ar -> audio/slides/ar/<deck>/)
#
# Transcripts (the source of truth) live in audio/articles/source/<slug>.json.
# Per-section clips go outside the repo, in ../article-audio/<slug>/, so a single
# section can be re-cut without regenerating the whole article.
# The joined file, audio/articles/<slug>.mp3, is what the article's player loads.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
TOOLS="$HOME/Work/Elevenlabs-voice"
CLIPS_ROOT="$(cd "$HERE/../../.." && pwd)/article-audio"
VOICE="pusofH2Ro5Ny4RH6qBEO"   # Hisham (cloned)
ORDER=(slides-in-html ar/slides-in-html two-nails-two-assistants bedtime-stories local-voice-generation building-ai-server
       building-wireless101 building-islamic-kids building-wirelesshub journey)

[ -n "${ELEVENLABS_API_KEY:-}" ] || source "$HOME/.zshrc" >/dev/null 2>&1 || true
[ -n "${ELEVENLABS_API_KEY:-}" ] || { echo "ELEVENLABS_API_KEY is not set"; exit 1; }

remaining() {
  node "$TOOLS/generate.js" --usage 2>/dev/null | awk '/Remaining:/ {gsub(",","",$2); print $2}'
}

build() {
  local slug="$1"
  local src="$HERE/source/$slug.json"
  local clips="$CLIPS_ROOT/$slug"
  local out="$HERE/$slug.mp3"
  [ -f "$src" ] || { echo "no transcript: $src"; return 1; }

  echo "== $slug"
  node "$TOOLS/lint-transcript.js" "$src" >/dev/null || { node "$TOOLS/lint-transcript.js" "$src"; return 1; }

  local before; before="$(remaining)"
  echo "   quota before: ${before:-?}"

  mkdir -p "$clips" "$(dirname "$out")"
  node "$TOOLS/generate.js" "$src" "$clips" \
    --voice "$VOICE" --model eleven_v4 --stability 0.5 --similarity 0.8

  # Every section must have a clip before anything is joined.
  python3 -I - "$src" "$clips" <<'PY'
import json, sys, pathlib
src, clips = sys.argv[1], pathlib.Path(sys.argv[2])
missing = [s["id"] for s in json.load(open(src))["slides"] if not (clips / f"{s['id']}.mp3").exists()]
if missing:
    sys.exit(f"   missing clips: {', '.join(missing)} (out of quota?)")
PY

  python3 -I "$TOOLS/qa-audio.py" "$src" "$clips"

  # Join the sections with a short pause between them.
  local list; list="$(mktemp)"
  ffmpeg -v error -y -f lavfi -i anullsrc=r=44100:cl=mono -t 0.8 "$clips/_gap.mp3"
  python3 -I - "$src" "$clips" > "$list" <<'PY'
import json, sys
src, clips = sys.argv[1], sys.argv[2]
ids = [s["id"] for s in json.load(open(src))["slides"]]
for i, sid in enumerate(ids):
    print(f"file '{clips}/{sid}.mp3'")
    if i < len(ids) - 1:
        print(f"file '{clips}/_gap.mp3'")
PY
  ffmpeg -v error -y -f concat -safe 0 -i "$list" -ac 1 -ar 44100 -b:a 96k "$out"
  rm -f "$list"

  local secs; secs="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")"
  echo "   wrote $out ($(printf '%d:%02d' $((${secs%.*}/60)) $((${secs%.*}%60))))"
  echo "   quota after:  $(remaining) (used $(( ${before:-0} - $(remaining) )))"
}

deck() { # one clip per slide, named by the slide's data-id, for the deck to play later
  local src="$HERE/../slides/source/$1.json" out="$HERE/../slides/$1"
  [ -f "$src" ] || { echo "no transcript: $src"; return 1; }
  node "$TOOLS/lint-transcript.js" "$src" >/dev/null || { node "$TOOLS/lint-transcript.js" "$src"; return 1; }
  mkdir -p "$out"; echo "== deck $1   quota before: $(remaining)"
  node "$TOOLS/generate.js" "$src" "$out" --voice "$VOICE" --model eleven_v4 --stability 0.5 --similarity 0.8
  echo "   quota after:  $(remaining)"
}

case "${1:-}" in
  deck) deck "${2:?usage: $0 deck <name>}" ;;
  all)  for s in "${ORDER[@]}"; do [ -f "$HERE/$s.mp3" ] || build "$s"; done ;;
  next) for s in "${ORDER[@]}"; do [ -f "$HERE/$s.mp3" ] || { build "$s"; exit; }; done
        echo "every article already has audio" ;;
  "")   echo "usage: $0 <slug>|next|all"; exit 1 ;;
  *)    build "$1" ;;
esac
