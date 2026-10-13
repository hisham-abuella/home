# Content review: gateway, tracks, home/cv/articles (2026-10-13)

Reviewers: creative-director + arabic-lead (with ux-writer rules). Scope: the uncommitted working tree
compared with HEAD. Read-only: no site file was edited.

## Summary

| Severity | Count |
|---|---|
| Must-fix | 3 |
| Should-fix | 16 |
| Nit | 24 |

**Old content preserved: yes.**
- `git diff HEAD -M -- index.html home.html` shows only two hunks: the pre-paint snippet (lines 30-40)
  and the appearance switch (Auto/Dark/Light/Contrast, lines 339-342). All body text, links and
  images match the old `index.html`.
- `cv.html` changed only in the pre-paint snippet and the back link (`index.html` → `home.html`).
  Copy CV text was already at HEAD.
- All 8 `Articles/*.html` have the **same** diff: identical md5 of the +/- lines in every file. It
  adds 5 skin stylesheets, the pre-paint and skin snippet, back link `../index.html` → `../home.html`,
  the Auto/Dark/Light appearance buttons and `reader-bar.js`. No article body text, image or link
  changed.
- No page anywhere still links to `index.html` expecting the old homepage. The only remaining
  `index.html` links are the tracks' "change" chips (`../index.html?choose`), which is intended.

**Links:** every relative `href` in `index.html` and `tracks/*.html` resolves to a file that exists.
Every article link carries the right `?via=` for its track, including the generated links in the
vibe shell (`V = '?via=vibe'`). The IEEE document IDs match `cv.html`. The one mislabelled link is
the engineer patent row (see engineer, :217).

**Arabic parity:** every `data-i18n` key has an Arabic value and there are no orphan keys on any
page. Hyphenated Latin terms in the Arabic strings use U+2011 throughout.

---

## Must-fix

### M1. Narration is promised, but no narration audio exists yet
`audio/articles/` contains only `build.sh` and `source/`. No `<slug>.mp3` exists, so `js/listen.js`
keeps every player hidden. The tracks currently promise something a reader can't get:
- `tracks/engineer.html:232`: "Each one narrated in my own voice." (AR :282 "كل واحدة متسجلة بصوتي")
- `tracks/vibe.html:184`: "Build logs, newest first, each narrated in my own voice." (AR :263)
- `tracks/learner.html:147`: "You can read every entry, or listen to it in my own voice." (AR :222 "أو تسمعها بصوتي")
- `tracks/learner.html:158`: "Read or listen". `:178`: "Each one has a narrated version." (AR :223, :225)

**Correction:** either generate the mp3s before pushing, or remove these claims for now:
- engineer :232 → "Articles are in English." / "المقالات بالإنجليزي حالياً."
- vibe :184 → "Build logs, newest first. Articles are in English." / "سجلات البناء من الأحدث للأقدم. المقالات بالإنجليزي حالياً."
- learner :147 → drop the last sentence. :158 → "Read". :178 → "Entries are written in English." / "اليوميات مكتوبة بالإنجليزي حالياً."

### M2. The Arabic says the bedtime books are in Hisham's voice in both languages; the article says only English is
`tracks/vibe.html:246` "b5d": "ست كتب كرتونية لابني، **بصوتي** بالإنجليزي والعربي."
The English (:170) says only "narrated in English and Arabic". `Articles/bedtime-stories.html:173`
says: "The English is read in my own cloned voice … and the Arabic uses the voice that narrates the
Arabic lessons there." So the Arabic adds a false claim. ("كرتونية" also reads as "cartoon".)
**Correction:** "ست كتب مقوّى لابني، متسجلة صوت بالإنجليزي والعربي."

### M3. Recruiter, Arabic: the 6,000+ visitors lose "inside Apple"
`tracks/recruiter.html:260` "sum3": "…عملت Claude skill اتحملت أكتر من 2,200 مرة جوه الشركة، وكورس سريع زاره أكتر من 6,000 شخص."
"جوه الشركة" covers only the skill, so the 6,000+ reads as a public figure. That breaks the owner
rule that both numbers appear only as "inside Apple" career facts.
**Correction:** "GenAI champion في Apple، وبحب أعمل UIs مع Claude. جوه Apple: Claude skill للعروض اتحملت أكتر من 2,200 مرة، وكورس سريع في الـ GenAI زاره أكتر من 6,000 شخص."
(The matching English fix is under recruiter, sum3.)

---

## Findings by file

### `index.html` (gateway)

- **Should-fix, :259:** "e": "شغلي هندسة" ("my work is engineering") is stiff as a station label.
  **Correction:** "بشتغل في الهندسة". It stays reader-neutral like the other labels (بدوّر، بعمل، بتعلّم).
- **Should-fix, :234-237 vs tracks:** the identity stats say "10+ peer-reviewed publications"
  (AR "ورقة بحثية محكّمة"). The recruiter, engineer and learner identity/figure blocks say "technical
  publications" (AR "ورقة تقنية منشورة"). The identity block is meant to be the same everywhere.
  `cv.html` says "10+ technical publications (including 1 U.S. patent)"; `home.html` says
  "Peer-reviewed publications". **Correction:** pick one wording everywhere. "technical publications"
  matches the CV and is safer, since the CV count includes the patent application.
- **Nit, :358 and :367 (timer JS):** "هفتح الموقع كامل بعد … ثانية". For 3-10 Egyptian Arabic uses
  the plural (بعد 10 ثواني), so the live announcement at 10 s reads wrong.
  **Correction:** use "ثانية" for 11 and up and "ثواني" for 3-10, or show the number alone ("هفتح الموقع كامل بعد 10ث").
- **Nit, :174:** "vibe coding with local AI models". The articles show vibe coding *with Claude*,
  and local models are what he builds and runs (AI engine, local voice). **Correction:** "I love
  creating UIs with Claude, building with local AI models, and writing about what I learn along the
  way." / "بحب أعمل UIs مع Claude، وأبني حاجات بموديلات AI محلية، وأكتب عن اللي بتعلمه في السكة."
- **Nit, :221:** learner bullet "Written on green engineering paper" (AR :264) describes the look, not
  what the reader gets. **Correction:** "The latest entry first" / "آخر يومية الأول".
- **Nit, :193:** "Experience, proof and my CV in one screen." The recruiter page scrolls through seven
  cards on a phone. **Correction:** "Experience, proof and my CV, fast." / "الخبرة والإنجازات والـ CV على السريع."
- **Nit, :264:** "l2": "مصادر تتعلم منها **ببلاش**" adds "free", which the English (:221) doesn't say.
  It's true (the learner page says free), so add "Free resources to learn from" to the English instead.

### `tracks/recruiter.html`

- **Should-fix, :172-174:** the voice shifts. sum1 is a noun phrase, sum2 is third person ("Works
  across…"), sum3 is "…who loves creating UIs with Claude: a Claude skill with 2,200+…". The Arabic
  sum2 (:259) is first person ("بشتغل"). In sum3 the colon also makes the skill and the course read as
  examples of "creating UIs". **Correction:**
  - sum2 → "I work across 5G baseband, RF digital front-end, digital pre-distortion, channel estimation and fixed-point implementation, through to lab bring-up."
  - sum3 → "GenAI champion at Apple. Inside Apple, my Claude presentation skill passed 2,200+ downloads and my GenAI crash course 6,000+ visitors. I love creating UIs with Claude." (Arabic in M3.)
- **Should-fix, :195:** "t6s": "Cairo, Egypt." (AR :268 "القاهرة، مصر."). `cv.html` gives only
  "Wasiela (Varkon Semiconductors), Egypt", and no article places Wasiela in Cairo.
  **Correction:** "Egypt." / "مصر.", or the owner confirms Cairo.
- **Nit, :191:** "MMSE memory optimisation" uses British spelling; the CV and the site use American
  ("Optimized"). **Correction:** "optimization".
- **Nit, :162 / :233 / :246:** "Open CV", "View CV" and "CV" all appear on one page. **Correction:** use "View CV" for both buttons.
- **Nit, :269:** "p1": "براءة اختراع" drops "US". **Correction:** "براءة اختراع أمريكية" (as in f4).
- **Nit, :269/:272:** "proofH": "الإثبات" and "wrH": "كتابات" are formal.
  **Correction:** "أرقام تثبت الكلام" (or "الدليل") and "مقالات".
- **Track fit:** good. It is the only page with the internal Apple numbers, there is no link next to
  them (:203-204), and the experience dates match the CV exactly.

### `tracks/engineer.html`

- **Should-fix, :170:** this self-description is the only one without "I love creating UIs with
  Claude" (owner rule). **Correction:** add "Outside work, I love creating UIs with Claude." /
  "وبرّه الشغل بحب أعمل UIs مع Claude."
- **Should-fix, :217:** the patent row's link text is the patent title, but it opens the Google
  Scholar *profile*. A reader expects the patent. **Correction:** make the title plain text, or label
  the link "Google Scholar".
- **Should-fix, :271:** "resH": "الرموز بعد **فك التشفير**". فك التشفير means decryption, not
  decoding or demodulation. **Correction:** "الرموز بعد الـ decoding" (or "الرموز بعد فكّها").
- **Should-fix, :274 and JS :302:** "التحكم الأوتوماتيك في الكسب" is a literal translation that
  engineers don't say. **Correction:** "الـ AGC (automatic gain control)" in both places.
- **Should-fix, :276 and JS :304:** "تصنيف التعديل" / "تصنيف نوع التعديل أوتوماتيك" use an obscure
  MSA term. **Correction:** "تصنيف نوع الـ modulation" and "تصنيف الـ modulation أوتوماتيك بالـ kernel density estimation."
- **Should-fix, :234-236 vs recruiter :215:** the recruiter "Writing" list and the engineer
  "Engineering notes" list are the same three articles (journey, AI engine, WirelessHub), so the
  tracks duplicate each other. **Suggestion:** engineer → journey, local-voice-generation (a measured
  benchmark) and building-ai-server. Recruiter → journey only, or journey plus two-nails.
- **Nit, :268:** "j2": "الأوراق" reads as "documents". **Correction:** "الـ papers" (j1 stays "الأبحاث").
- **Nit, :280-281:** "dpd": "Digital pre‑distortion" and "l2": "Software‑defined radio" are left in
  English and capitalised mid-list. **Correction:** "الـ DPD (digital pre‑distortion)" and "الـ SDR".
- **Nit, :279/:281:** "تعلّم الآلة" (sp3, l3) is MSA. **Correction:** "المعمل والـ ML" and "الـ ML للأنظمة اللاسلكية".
- **Nit, :272:** "قللت" appears twice in r1d. **Correction:** "…ووفّرت ذاكرة الـ MMSE taps بالـ online downsampling، وقللت تسريب الإشارة…".
- **Nit, :236:** the AI engine date shows "Feb 2026", while `home.html` has "Feb 2026 · updated Oct 2026". The same applies to local-voice-generation on learner :184.
- **Track fit:** strong. The papers, venues, volumes and years match `cv.html` exactly, and "3 IEEE papers" (JS :303) is correct (Sensors, TVT, Access).

### `tracks/vibe.html`

- **Should-fix, :163:** "Made outside the day job, most of it started in a Claude Code session."
  The first two rows, the presentation skill and GenAI and Claude 101, are Apple work per `cv.html`
  ("Created a presentation-building skill published on Apple's internal Claude marketplace"; "Wrote
  and delivered a GenAI and Claude 101 crash course"). b2d itself says "written for Apple's internal
  audience". **Correction:** "Things I've built with Claude, most of them started in a Claude Code
  session. The deck skill and the crash course began inside Apple; the links here are public
  versions." / "حاجات عملتها مع Claude، وأغلبها بدأ في جلسة Claude Code. الـ skill بتاعة العروض والكورس بدأوا جوه Apple، واللينكات هنا نسخ عامة." (Owner decision below.)
- **Should-fix, :156:** "…I build tools, sites and books, and write a build log for each one." The
  skill, the GenAI deck and the books' public site have no build log of their own.
  **Correction:** "…and write build logs along the way." / "…وبكتب عنها في السكة." Also fix the whoami text at :298-299.
- **Should-fix, :249:** "b6d": "…بصوت بالإنجليزي والعربي." is cut off ("with a voice in…").
  **Correction:** "قصص مصوّرة وكويزات ونجوم مكافأة، متسجلة صوت بالإنجليزي والعربي."
- **Should-fix, :235 and JS :301:** "مهارة Claude للعروض" uses a different term from the recruiter page
  ("Claude skill … للعروض", :260). Engineers say "skill". **Correction:** "الـ Claude skill للعروض" in both places.
- **Nit, :230:** "builtH": "عملت إيه" reads as a question ("what did I do?"). **Correction:** "اللي عملته".
- **Nit, :265 vs learner :228:** the same book is "حكايات قبل النوم" here and "حواديت قبل النوم" on
  learner. **Correction:** use "حواديت" everywhere (more Egyptian), including b5 at :245 and the JS at :301 and :308.
- **Nit, :189:** "Generating voice with local models". Learner :184 has "Generating voice from text
  with local models", and the real title (`home.html`) is "Generating voice from text using local
  models". **Correction:** use the real title on every track.
- **Nit, :302:** the shell folder is called "claude-deck-skill/" while the page says "Claude
  presentation skill". **Correction:** "claude-presentation-skill/".
- **Nit, :304:** the Arabic `stack` output drops "for jobs I repeat", "no build step" and "local
  engines compared" from the English. **Correction:** add "…ومعاه skills للشغل اللي بكرره", "…من غير build step…" and "…وبقارنه بمحركات محلية".
- **Nit, :244:** "مقارنةً بـ" is MSA. **Correction:** "TTS محلي قصاد ElevenLabs Eleven v4."
- **Rules check:** passes. Neither internal number appears, both public links are labelled "public
  version" / "نسخة عامة", and Wireless 101 appears only as a changelog entry. The stack facts match
  the articles: FastAPI, Ollama, Draw Things, Voicebox, M4 Max, Eleven v4 and the cloned voice
  (`building-ai-server`, `local-voice-generation`, `build.sh`). WirelessHub as "a friend's" blog with
  search and dark mode matches the article.

### `tracks/learner.html`

- **Should-fix, :230:** "a4s": "الأصوات المحلية دلوقتي **تكتب** مسودة كتاب كامل ببلاش". Voices don't
  write; the English means draft *narration*. **Correction:** "الأصوات المحلية دلوقتي بتسجّل مسودة صوتية لكتاب كامل ببلاش."
- **Should-fix, :232:** "a6s": "…واللغتين صعبين بس يستاهلوا" says "the two languages are hard", not
  "making it bilingual is hard". **Correction:** "الدروس: محتوى الأطفال محتاج جودة أعلى، وإن الموقع يبقى بلغتين صعب بس يستاهل."
- **Nit, :227:** "a1s2": "اللي طلع مالوش علاقة بالـ AI" loses "the real takeaway".
  **Correction:** "الدرس الحقيقي مالوش علاقة بالـ AI. لما لمبة الكاوتش تنوّر، روح بص على الكاوتشات."
- **Nit, :235:** "m2s": "عروض تقديمية" is formal. **Correction:** "قالب عام تعمل بيه presentations بـ Claude Code."
- **Track fit:** good. Every lesson line matches its article's own lesson heading (checked:
  "Failures here announce themselves as successes", "Write for the ear", "detailed CLAUDE.md",
  "Kids' content demands higher quality / Bilingual is hard but worth it", the engineering review in
  Wireless 101, and the tire advice in two-nails). Wireless 101 stays low-key: a quiet line with no
  lesson count. Overlap with the vibe changelog: 7 of the 8 entries are the same articles. The
  framing differs (lessons vs builds), so that's acceptable, but see Owner decisions.

### `cv.html`, `home.html`, `Articles/*.html`
No content findings. The changes are exactly the intended ones (see Summary).

### Shared strings
- **Nit, `js/reader-bar.js:22-25`:** labels "Recruiter track", "Engineer track" and "Vibe coder
  track", but "Learner journal". **Correction:** "Learner track", or rename all four consistently.
- **Nit, all tracks:** several `aria-label`s stay English in Arabic mode, e.g. `index.html:188`
  "Choose a page", `engineer.html:180` (the canvas), `vibe.html:139`, and "Social links" / "Contact"
  on every page. Screen-reader users in Arabic hear English. Hand to frontend-lead to add
  `data-i18n` attributes.

---

## Owner decisions

1. **Patent wording (known open question, not counted as a defect).** Every page says "1 US patent".
   `cv.html` lists "U.S. Provisional Patent Application No. 62/541,913" (speed estimation with vehicle
   headlamps), and `engineer.html:217` shows that same line under a "US patent" card, so the page
   contradicts itself. A second mismatch: `home.html` says the *vital-signs* work "produced a United
   States patent", while the engineer track and the CV tie the patent to *speed estimation (ViLDAR)*.
   Which project is the patent, and is it granted?
2. **Publication count.** The CV's "10+ technical publications (including 1 U.S. patent)" counts the
   patent among the 10+, and every page then also shows "1 US patent" next to it. Keep "10+", or say "9 papers + 1 patent application"?
3. **Narration (M1).** Generate the mp3s before pushing, or strip the "narrated" claims now?
4. **Recruiter personal details.** `recruiter.html:156-157` publish "San Diego, California" and "US
   permanent resident". Both are in the public CV, but the identity block on the same page
   (:230) says "California, USA", and team rules avoid more location detail than needed. Keep both, or use "California, USA" and drop the residency line?
5. **Built list framing (vibe :163).** How to describe the deck skill and the GenAI crash course,
   which started inside Apple, on a list of things built "outside the day job".
6. **Track overlap.** Recruiter and engineer list the same three articles. Vibe and learner share 7
   of 8. Proposed split: recruiter → journey only; engineer → journey, local-voice benchmark, AI
   engine; vibe and learner keep everything but with different framing.
7. **Gendered Arabic toward the reader.** "عايز كل حاجة…؟" (`index.html:265`), "عايز لاسلكي و DSP؟"
   (`learner.html:236`, which should also read "عايز تتعلم اتصالات لاسلكية و DSP؟"), "أهلاً بيك تاني"
   (`index.html:256`), "إنت كمان" (`learner.html:221`). All use the masculine. Keep the Egyptian
   default, or go reader-neutral ("لو حابب…"، "أهلاً تاني")?
8. **Gateway positioning.** The gateway lede (`index.html:174`) and the meta description (:10) each
   carry only one side. The lede covers only Claude and vibe coding, and the meta covers only 5G and
   RF. A recruiter's first screen shows no engineering sentence except the ID line. Consider the
   ux-writer positioning line: "I design 5G baseband and RF front-end systems. In my own time I love creating UIs with Claude."
