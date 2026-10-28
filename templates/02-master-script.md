# Master Script — Week YYYY-Www

**Release:** Sunday DD Mon YYYY, 6:00 PM IST
**Coverage:** Mon DD – Sat DD Mon YYYY
**Working title:**
**Target runtime:** __ min → word budget __ (min × 135)
**Version:** v1 (Fri) / v2 (Sat, after Mounika's read-through)

> **Rules (`CLAUDE.md` §5–§6):**
> - **Columns:** visual cue on the left, verbatim narration on the right.
> - **Cut tags (Deep Dives):** put `[HUB]` (both cuts), `[HUB-ONLY]` (Sunday hub only) or `[EXT]` (Decode Extended / PDF only) in the # column, e.g. `1.4 [EXT]`. Untagged rows count as `[HUB]`. `timeline.py --cut hub|ext` builds either cut from this one file.
> - **Word cues:** in the visual cell, mark where a build lands with `→ "word"` (the spoken word it explains), not "one per sentence".
> - **Visual tags:** exactly one primary tag per row: `[VOICE ANCHOR]` `[GIS MAP]` `[MIND MAP]` `[REAL FOOTAGE]` `[DATA CHART]` `[KINETIC TEXT]` `[HYPERFRAME PROMPT]` (last resort).
> - **Narration:** connected spoken sentences that pass the one-breath test; no staccato fragments. Phonetic markers on first use.
> - **Marks:** — = beat, ... = pause, **bold** = stress (at most one per sentence).
> - **Voice directions:** add *Voice: …* in the visual cell for direct-address rows and for slower trap/number rows.
> - **Table format:** never use a pipe character inside a cell; use `<br>` for a line break.
> - **Voiceover file:** `python3 tools/make_voiceover.py weeks/YYYY-Www vN` builds it from the right-hand column.

---

## COLD OPEN (target 0:45)

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| 0.1 | `[VOICE ANCHOR]` Decode Desk. Lower-third: *GS-_ · …*. *Voice: …* | Start inside the event… |
| 0.2 | `[GIS MAP]` … | Pivot to the structural problem… |
| 0.3 | `[KINETIC TEXT]` Yellow "Pause and answer" card: pre-question from the Prelims Grid, in a UPSC format (never yes/no) | **Pause and answer.** (the week's hardest trap, asked before it is taught) |
| 0.4 | `[VOICE ANCHOR]` "On today's desk" rundown cards | A ten-second map of today's class… |

*Segment words: __ · Running total: __ · Est. time: __*

---

## UPDATE DESK — Previously on Decode (optional, 0–1:30; skip if nothing important moved)

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| U.1 | `[VOICE ANCHOR]` Decode Archive: last week's notebook comes off the shelf. Callback card to the earlier video (Week __, chapter timestamp). *Voice: warm, brisk.* | Callback ("In Week __ we decoded…") + one-sentence refresher of the static anchor… |
| U.2 | `[MIND MAP]` Earlier episode's map; the new branch draws itself in a fresh colour | The delta: what changed this week, and why… |
| U.3 | `[KINETIC TEXT]` "Then → Now" card (if a fact we taught changed) | What it does to the exam angle… ("Last time we said X; that has now changed to Y.") |

*Segment words: __ · Running total: __ · Est. time: __*

---

## PRELIMS GRID — National · International · Misc (target 8:00; starts by 2:30)

14–16 Glimpses × 25–35 s. Each one: what happened → the static set → one trap. The card is reused as-is in the PDF.

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| G.N1 | `[KINETIC TEXT]` Yellow NATIONAL card + … (final values only, no count-up) | What happened → static set → one trap… |
| G.I1 | `[GIS MAP]` Steel-blue INTERNATIONAL card + locator inset … | … |
| G.M1 | `[KINETIC TEXT]` White MISCELLANEOUS card (places / persons / reports / awards / days) … | … |

*Segment words: __ · Running total: __ · Est. time: __*

---

## DEEP DIVE 1 — <Theme> (target __:__)

**Central question:** …  ·  **Scope · subject:** …  ·  **Story arc / earlier episodes:** …  ·  **Exam tags:** #UPSC-Pre #UPSC-Mains-GS_ …

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| 1.1 | `[VOICE ANCHOR]` … *Voice: …* | Answer to the previous checkpoint (from pillar 2 onwards), then the hook and trigger… |
| 1.2 | `[KINETIC TEXT]` Key terms: … | Key-terms primer (20–30 s)… |
| 1.3 | `[GIS MAP]` Locator inset → zoom … (official Survey of India boundaries) | Static anchor: geography / law / economics… |
| 1.4 | `[MIND MAP]` Centre node: central question. Node 1 appears on "…" | Deep dive: cause → consequence ("therefore… but…")… |
| 1.4a | `[GIS MAP]` / timeline river: historical origin; our earlier episode marked as a stepping stone | History + earlier-episode connection… |
| 1.5 | `[DATA CHART]` … Source: …, date | … |
| 1.6 | `[KINETIC TEXT]` Red PRELIMS TRAP card: … *Voice: slower.* | **Prelims Trap.** … (cover the whole look-alike set) |
| 1.7 | `[KINETIC TEXT]` PYQ Echo card: UPSC CSE Prelims YYYY, GS Paper I · format · answer (only once `[PYQ-VERIFY]` is cleared) | … |
| 1.8 | `[MIND MAP]` Four-quadrant Mains matrix | **Mains Lens.** … (contestable proposition, both sides, data) |
| 1.9 | `[KINETIC TEXT]` "Carry into Mains": 3–5 facts | **Write this down.** … |
| 1.10 | `[KINETIC TEXT]` "<Committee / Report>" | Way forward with cited source, India's strategic imperative… |
| 1.11 | `[KINETIC TEXT]` Model question text | Model Mains question + 3-part skeleton… |
| 1.12 | `[GIS MAP]` Teal TELUGU STATES LENS card + state document on screen (optional) | **Telugu States Lens.** National issue → AP/TG data point → how Group-1 asks it… |
| 1.13 | `[MIND MAP]` Completed map → skeleton with 2–3 blanks → 3 s hold → reveal | 3-point recap. "Pause here, copy this map, and fill in the blanks before I reveal them." … |
| 1.14 | `[KINETIC TEXT]` Yellow "Pause and answer" card, 6–8 s countdown. *Voice: warm.* | **Pause and answer.** … One-line preview of the next pillar. |

*Segment words: __ · Running total: __ · Est. time: __*

---

## AP–TG DESK — Local: Telugu States (target 3:00; every week until 24 Jan 2027)

6–7 Glimpses in this order: polity and courts → schemes and budget → rivers, projects and disasters → indices, persons and firsts. Show a primary state document on each card (GO number, gazette or budget page).

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| L.1 | `[KINETIC TEXT]` Teal AP–TG DESK card + GO / gazette strip … | What happened → static anchor → one trap… |
| L.7 | `[KINETIC TEXT]` Teal card: one Group-1-style question on screen, answer stated with a one-line reason | "Group-1 asks it as…" |

*Segment words: __ · Running total: __ · Est. time: __*

---

## DEEP DIVE 2 … (repeat structure; DEEP DIVE 3 only in a heavy week at EYS ≥ 8)

---

## FOCUS 1 — <Story> (target 1:30–3:00)

**Scope · subject:** …  ·  **Exam tags:** …

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| F1.1 | `[GIS MAP]` / `[REAL FOOTAGE]` … | Trigger… |
| F1.2 | `[KINETIC TEXT]` … | Static anchor… |
| F1.3 | `[KINETIC TEXT]` Red PRELIMS TRAP card (2 traps). *Voice: slower.* | **Prelims Trap.** … |
| F1.4 | `[DATA CHART]` / `[MIND MAP]` … | One Mains angle + **Write this down.** … |

*Segment words: __ · Running total: __ · Est. time: __*

---

## TRAP VAULT RAPID-FIRE (target 2:00; 10 items in UPSC formats, answers stated)

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| T.1 | `[KINETIC TEXT]` Countdown cards, one trap per card. *Voice: brisk, slower on numbers.* | Answer to the last segment's checkpoint, then this week's traps… |
| T.2 | `[KINETIC TEXT]` "From last week" cards (2) + "From four weeks ago" (1) | Spaced recall… |

*Segment words: __ · Running total: __ · Est. time: __*

---

## DESK NOTE (optional — only when the week's themes support it; 30–60 s)

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| D.1 | `[VOICE ANCHOR]` Decode Desk, lamp warm. *Voice: slower, warm, honest.* | Process-focused note. No rank, fear, hustle or topper lines… |

---

## VERDICT & CTA (target 1:15)

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| V.1 | `[VOICE ANCHOR]` Decode Desk, lamp dims slowly. *Voice: slow, reflective, warm.* | Essay-style verdict: an aphorism illustrated by this week's events… |
| V.2 | `[VOICE ANCHOR]` End-screen space (15–20 s) | Single CTA: PDF notes + MCQ challenge in the pinned comment. |

*Final word count: __ · Est. runtime: __ min*

---

## PACKAGING

| # | Title (45–70 chars) | Thumbnail words (≤3) | Visual conflict | Hero object (no face) |
|---|---|---|---|---|
| A | | | | |
| B | | | | |
| C | | | | |

**Description draft**
- Hook (2 lines):
- Chapters (first at 00:00, at least 3, each ≥10 s, titled as a question or claim): 00:00 … · __ P1 … · __ Trap Vault · __ Verdict
- Sources and image/footage credits:
- PDF link · Telegram link:
- Synthetic-content disclosure needed? ☐ yes ☐ no
- Hashtags: #UPSC #UPSC2027 #CurrentAffairs #APPSC #TGPSC #Group1
