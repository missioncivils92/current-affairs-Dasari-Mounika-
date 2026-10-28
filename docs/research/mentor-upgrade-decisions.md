# Mentor-upgrade decisions (27 Oct 2026)

Owner decisions taken after reading the mentor-guidance PDF and the research report `reports/Mentor teaching and exam patterns.md`. These drive the next rewrite of `CLAUDE.md` and `PLAYBOOK.md`.

| # | Topic | Decision |
|---|---|---|
| 1 | On camera | Fully faceless (voice-only) for the early videos. Revisit later. |
| 2 | Footage | Free and government-licensed only: PIB/DD/AIR creator-cleared material, NASA, USGS Landsat, Copernicus Sentinel, Wikimedia Commons (licence checked), self-made maps and charts. Credit lines required. No news-agency clips. |
| 3 | Scope of doc changes | Merge the PDF's mentor pedagogy into the existing `CLAUDE.md` and `PLAYBOOK.md`. Keep the accuracy rules, Telugu States Lens, GS-4, packaging, pronunciation bank, map law and schedule. Use the corrected Oleshky example. |
| 4 | Script format | Two-column master script (visual cue / mind-map step \| verbatim narration), plus a generated plain voiceover file for recording. |
| 5 | Humour | Warm, with some light humour and everyday analogies to keep energy across 20+ minutes. Never on religion, caste or political parties. |
| 6 | APPSC push | One APPSC-tagged Short per week from November, plus a December special covering six months of current affairs for the APPSC Screening Test (reported date 24 Jan 2027, to be checked against the official notification). |
| 7 | Cross-exam tags | APPSC/TGPSC Group-1, AP/TS Group-2 and 3, RBI Grade B (ESI), UPSC CAPF/EPFO. |
| 8 | AI images | Last resort only, for generic scenes that carry information. Never real people, and never a real event shown as real. Tick YouTube's altered/synthetic-content disclosure whenever one is used. |
| 9 | Toolchain | Free: QGIS with Copernicus/NASA data and Survey of India boundaries for maps; the repo's HTML/Playwright renderer rebuilt for step-by-step mind maps and data charts. No Google Earth Studio (its terms don't cover commercial use). |
| 10 | Motivation "Desk Note" | 30–60 s, honest and focused on the process of preparation, only in weeks where the themes naturally support it. No rank, fear or topper-testimonial lines. |
| 11 | Correction policy | Errors found after publishing get a pinned correction comment and a description note within 24 h, and are logged in the week's README. |
| 12 | Answer feedback | Pin and reply to one viewer's Mains answer each week. |
| 13 | Telegram | A Telegram channel used only to distribute the PDFs. |

Not adopted: a "voiced by a real educator" line in the About section and descriptions.

Corrections to the PDF's model example (must not be copied into scripts):
- Kerch Strait passage was governed by the 2003 Russia–Ukraine treaty on the Sea of Azov and Kerch Strait (denounced by Ukraine in Feb–Mar 2023 and by Russia in June 2023), **never** by the Montreux Convention (which covers only the Turkish Straits).
- The Dnipro is Europe's **fourth-longest** river (after the Volga, Danube and Ural), not the "third-largest".
- "Donbas" is commonly defined as the Donetsk and Luhansk oblasts. The Donets coal basin itself extends into Russia's Rostov oblast and into Dnipropetrovsk, so avoid "strictly".
- Prelims 2014 asked where Turkey lies (between the Black Sea and the Mediterranean). Prelims 2019 had a sea–bordering-country pairs question (Black Sea–Croatia was the wrong pair). Prelims 2023 asked how many listed countries border Ukraine (answer: only two, Hungary and Romania).
- No GS-2 Mains 2023 "strategic autonomy" question was found. Use the verified 2023 GS-2 NATO-expansion question instead, after checking it against the official paper.

## Follow-up instruction (27 Oct 2026)

| # | Topic | Decision |
|---|---|---|
| 14 | Caps and creativity | No self-imposed caps on research depth, sources, story count or creative ambition. Soft defaults (pillar count, timings, analogies, map nodes, runtime) are guides. Accuracy, maps, licensing, voice-only and compliance never relax (`CLAUDE.md` §0.1). |
| 15 | Weekly trigger | "Start this week's current affairs video" runs a deep, category-by-category web sweep, then filtering, tiering, categories, a continuity check and a proposed rundown (`PLAYBOOK.md` §"Start this week's video"). |
| 16 | Depth tiers | Deep Dive / Focus / Glimpse / Update, so each story gets the depth it deserves (`CLAUDE.md` §3.1). |
| 17 | Categories | Scope: Local (Telugu States), National, International, Miscellaneous. Plus subject categories; new ones may be added as needed (§3.2). |
| 18 | Continuity | Videos form one connected course. `docs/story-tracker.md` ledger; covered stories return as Updates with callbacks, the delta and changed facts; history and earlier-episode links; story arcs; YouTube cards (§3.3). |
| 19 | Runtime | Sized to the week, typically 20–35 min, with no fixed cap. |

## One-off exception (27 Oct 2026)

| # | Topic | Decision |
|---|---|---|
| 20 | ElevenLabs narration | **Only** the W44 Oleshky sample uses an ElevenLabs voiceover. It is internal and never published, so no upload disclosure applies. Every other video uses Mounika's real voice (`CLAUDE.md` §1, which now carries this as its sole logged exception). |

## Video length and release plan (27 Oct 2026)

Based on `reports/Weekly video length and format.md`.

| # | Topic | Decision |
|---|---|---|
| 19 (amended) | Runtime | Sunday hub **28–38 min, default about 32**. 40 min is an overflow trigger (cascade in `CLAUDE.md` §4.1), not a hard cap. Light weeks run 22–26 min, never padded. |
| 21 | Decode Extended | **One per week**, Wednesday 6 PM IST, 10–15 min: the week's biggest story at full depth, built from the hub Deep Dive plus its `[EXT]` rows. |
| 22 | Oleshky sample | Kept as an **internal quality reference only**; not published. |
| 23 | Monthly compilation | Stays on the **last Sunday** of the month (unchanged). |

## After the independent review (27 Oct 2026)

| # | Topic | Decision |
|---|---|---|
| 19 (amended again) | Runtime | Sunday hub **26–30 min, default about 28; 35 min ceiling** (owner override only). Cascade above 30 min. Revisit after the 8-week length test. Replaces 28–38. |
| 21 (amended) | Decode Extended | **0–1 a week**, only when a story has 3+ min of genuine `[EXT]` material; 10–15 min; finished before the Sunday edit lock. |
| 24 | Review fixes | Apply all fixes from the independent review: docs, Oleshky script and brief, and a re-render (hub cut and Extended cut). |

## After the exam-value reviews (28 Oct 2026)

Five independent reviews (`docs/research/reviews/2026-W44-exam-value/`) found the Oleshky sample low-yield for exam study. The root cause was story selection, not production.

| # | Topic | Decision |
|---|---|---|
| 25 | Weekly hub shape | **Breadth-first.** A Prelims Grid of about 21 items, including a fixed AP–TG Desk until 24 Jan 2027, plus 2 Deep Dives. Runtime limits are unchanged (26–30 min, 35 ceiling). The exact wording is in the draft (decision 28) and goes into `CLAUDE.md` §4.1 with it. |
| 26 | Oleshky sample | **Archived.** Kept only as an internal craft reference. For exam use it is a 45-second Update plus a Black Sea map card (`weeks/2026-W44/sample-oleshky/02d-update-45s.md`). |
| 27 | Next sample | Chosen by the owner from a **real W44 triage table** with exam-yield scores, not picked in advance. |
| 28 | Selection rules | **Draft for owner review:** the exam-yield score (EYS 0–10), a mandatory ranked triage table, tier thresholds, arc fatigue, and the teaching and screen rules (`docs/research/drafts/2026-10-selection-and-format-draft.md`). Not in force until approved. |

## Rules approved with changes (28 Oct 2026)

| # | Topic | Decision |
|---|---|---|
| 28 (approved) | Selection rules | Approved and moved into `CLAUDE.md` §3, §3.1, §4.1, §4.2, §6.2, §6.3 and §7, and `PLAYBOOK.md` steps 3–6 and QC. Covers: exam-yield score (EYS); mandatory triage table; Deep Dive threshold **EYS ≥ 7** with I ≥ 1, D ≥ 1, P ≥ 2; arc fatigue; UPSC-format questions with the answer stated; final-value numbers; fact maps. |
| 29 | Changes to the draft | **Up to 3 Deep Dives** in a heavy week (the 3rd needs EYS ≥ 8, otherwise it goes to Decode Extended). **Update Desk is optional** (skip it when nothing important moved). **Consensus check is a flag, not a bar.** **AP–TG Desk: 3 min, weekly, until 24 Jan 2027** (then review). |
| 30 | W44 rundown (owner pick) | Deep Dive 1: **NSAP → Pradhan Mantri Samajik Sahayata Yojana** (EYS 9). Deep Dive 2: **Election Commission before the Supreme Court** (EYS 8, facts still to be verified). Cyclone Arnab moves to the Prelims Grid / AP–TG Desk. The next sample video is built on Deep Dive 1. |


## Breadth-segment look (28 Oct 2026)

| # | Topic | Decision |
|---|---|---|
| 31 | Glimpse frames | After "not up to the mark: only script and satellite images", every Grid and Desk card ends on a **notes-ready frame**: a labelled visual, a "write this down" table with the whole look-alike set, and the trap bar. The Grid ends with a two-page revision sheet and the Desk with a one-page sheet. Previews are delivered at 1080p. |
| 32 | Colour ("give colourful") | **Colourful frames:** category-tinted backgrounds, solid category-coloured table headers, a rotating bright accent per row (yellow, sky blue, teal, orange, violet, green), coloured label pills, a teal panel behind the trap's correct fact, and maps with blue sea, green neighbours and sand-coloured India. **Red stays reserved for the Prelims Trap** (§6.5). The accents are data colours, not new brand colours. |
| 33 | Exam format, every topic ("All those") | Every Prelims Grid and AP–TG Desk topic gets the full exam format: why in news → static facts → trap → practice MCQ (UPSC formats) → answer → notes. This runs about 1.5–2 min a topic, so **the Prelims Grid (≈ 24 min) and the AP–TG Desk become videos of their own**; the Sunday hub keeps the Deep Dives within §2's limits. If a hub cut needs the Grid, use its revision sheet and a link. |
| 34 | One colour per slide, purple first; flat maps | Owner: "in each slide use one colour, but purple is more good" and "not satellite images". Slides use purple (topic, concepts, practice), violet (tables), orange/blue/teal (why in news by category), red (trap) and yellow (notes). Maps are flat vector maps with the Survey of India outline. |
| 35 | Animation and the channel emblem | Owner: "I need animations… colourful which students will be interested to listen to; for introduction keep my channel icon". Each slide has living backgrounds and slide-entry zooms; elements rise in on their cue words; headlines reveal word by word; map cameras push in and pins drop; the trap shakes before its strike; the correct answer bursts in colour. The round emblem (`tools/masterclass-video/brand/decode-upsc-logo.png`) opens each video with an animated sting and sits in the corner of every slide. |
