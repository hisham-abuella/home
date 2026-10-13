# hishamabuella.com — Design Team

A standing team of specialist agents for this repo, modelled on the Wireless 101 team. Each one is a
real, dispatchable Claude Code subagent defined in `.claude/agents/`. Ask for one by name ("have the
`arabic-lead` review this") or let Claude pick.

Created 2026-10-13. The plan every member works to is `CLAUDE.md` "Site strategy (current)": the
reader gateway (`index.html`), the full site (`home.html`), four tracks in `tracks/` (recruiter =
catalogue, engineer = constellation, vibe = terminal, learner = journal) and article skins in
`css/skins/`. The five mockups in `different_designs/mockups/` are explorations. The brief
it serves: **a distinctive personal site for a wireless engineer who is also a vibe coder, learner and
creator, built for recruiters, fellow engineers and learners, in English and Egyptian Arabic, and
easy to use on a phone or a laptop.**

## Roster

### Vision
| Agent | Owns | Edits files? |
|-------|------|--------------|
| `creative-director` | Vision, the three-reader test, choosing between directions, arbitration | No |

### Craft
| Agent | Owns | Edits files? |
|-------|------|--------------|
| `visual-designer` | Palette, typography, layout, mockups in `different_designs/` | Yes |
| `frontend-lead` | Production HTML/CSS/JS, theme tokens, responsive, RTL plumbing, a11y, performance | Yes |
| `interaction-designer` | Motion, canvas, hero interactions, the decision not to animate | Yes |
| `brand-designer` | Logo, favicon, og:image, generated locally with Draw Things | Yes |

### Words
| Agent | Owns | Edits files? |
|-------|------|--------------|
| `ux-writer` | English copy: positioning, project blurbs, buttons | Yes |
| `arabic-lead` | Egyptian Arabic copy, RTL correctness, Arabic type, EN/AR parity | Yes |

### Verification
| Agent | Checks | Edits files? |
|-------|--------|--------------|
| `audience-advocate` | The recruiter, engineer and learner personas on phone and laptop | No |
| `qa-lead` | Viewports × languages, overflow, console, links, contrast, motion, metadata, privacy | No |

## Working pattern: one lead, with helpers

Work items go **one at a time**. Each has one **lead** who owns it and the final report, and pulls in
the others:

| Stage | Who |
|-------|-----|
| Direction, or a choice between options | `creative-director` |
| Look: tokens, type, layout | `visual-designer` |
| Words | `ux-writer`, then `arabic-lead` |
| Production code | `frontend-lead` |
| Anything that moves | `interaction-designer` |
| Logo, favicon, share image | `brand-designer` |
| Reader check before shipping | `audience-advocate` |
| Independent verification at the end | `qa-lead` |

**Typical flow for a redesign:** `creative-director` confirms the direction fits the strategy → `visual-designer` refines
the mockup → `ux-writer` + `arabic-lead` finalise copy in parallel → `frontend-lead` builds it into
`tracks/`, `css/` or `home.html` (with `interaction-designer` on the hero) → `audience-advocate` and `qa-lead` run
in parallel → `creative-director` signs off.

Rules for the lead:
1. **Run in parallel what can run in parallel.** EN copy and AR copy; QA and audience review.
2. **Don't self-certify.** `qa-lead` verifies at the end.
3. **Ask the owner** about identity and scope: employer naming, faith, family content, Arabic
   gendered forms, whether articles get Arabic versions.
4. **Measure before and after**, and quote both.

## Working rules
1. **English and Egyptian Arabic change together.** A change lands in both, or it does not land.
2. **Phone and laptop are both first-class.** Check 390×844 and 1440×900 every time.
3. **One bold idea per page.** Quiet, disciplined everything else.
4. **Themes hold tokens only; `base.css` holds layout.** This is what keeps the three appearances working.
5. **Evidence or it didn't happen.** A finding needs a file:line or a screenshot. A fix needs a check.
6. **This is a public site.** No personal details beyond what's already published; no EXIF/GPS in images.

## Logs and reviews
History was reset on 2026-10-13 when the strategy changed. Agents append to `claudeteam/log_chat/<agent-name>.log` with a date and a tag: `[FINDING]`,
`[DECISION]`, `[ISSUE]`, `[BLOCKER]`, `[DONE]`. Longer reports go in `claudeteam/reviews/`.

## Reference
- `README.md` — the live site's structure, design system, articles and narration
- `CLAUDE.md` — project instructions
- `tracks/` — the four reader tracks; `index.html` is the gateway, `home.html` the full site
- `different_designs/mockups/index.html` — the five explored directions, bilingual, with a chooser
- `different_designs/logo/` — logo concepts (`concepts/`), Arabic SVG overlays (`overlay.html`) and corrected logos (`fixed/`)
- `~/Work/AI_server/services/image_gen.py` — how local image generation is called
