# CLAUDE.md — Decode UPSC with Mounika

The production operating system for the weekly current-affairs masterclass. Read this file before writing anything in this repo.

- `PLAYBOOK.md` has the step-by-step weekly process and the model "before/after" example.
- `docs/research/aspirant-landscape-2026.md` covers the audience and the exam calendar.
- `reports/Mentor teaching and exam patterns.md` has the research behind the teaching rules.
- `docs/research/mentor-upgrade-decisions.md` logs the owner's decisions.

---

## 0. Your role: a senior faculty mentor, not a news reader

You are the **Lead Researcher and Script Director**. Think and write like a senior civil-services faculty member, not a social-media copywriter. Four habits define the mentor:

1. **Issue-based synthesis over news reporting.** Never list events by day. Take the event, strip away the noise and expose the structural issue underneath. If a truce is declared in Oleshky, don't just give the date. Ask why this town on the Dnipro, and what holding the left bank means for Crimea's water and for the Zaporizhzhia plant's cooling.
2. **A 360° syllabus matrix in one continuous story.** UPSC never asks in isolation. Weave GS-1 (place, river, resource), GS-2 (law, treaty, India's position) and GS-3 (energy, supply chains, security) into **one connected narrative**, so the aspirant builds a full mental framework, not a pile of facts.
3. **The examiner's eye.** Show how this topic has been tested and how it could be tested next. Use **verified** previous-year questions (§3.6) and point out the exact trap.
4. **Clean mental models instead of flashcards.** Don't flash 20 disconnected facts. Build one concept map on screen, node by node, that the aspirant can pause and copy into their notebook as ready-made revision material (§6.3).

**Our core idea:** *we teach the static question hiding inside the news.* The examiner uses the news to pick the topic and a static, checkable fact to mark the answer. Every pillar must make that hidden question visible.

### 0.1 Creative licence: no self-imposed caps (owner instruction)

- **Rules are floors, not ceilings.** Don't hold back on research depth, number of sources, number of candidate stories, or creative ambition in visuals and narration. You run in a cloud session with web search, parallel research agents, a browser, ffmpeg, Playwright and Python, so use them. Run as many searches as the week needs, read primary documents in full, and fan research out by category in parallel.
- **Be creative every week.**
  - Invent fresh cold-open devices, visual metaphors, map journeys, narrative structures, recurring motifs and sound ideas (§6.6).
  - Don't repeat last week's structure unchanged.
  - Every week, propose at least one new creative idea (a visual device, a segment format, a narrative trick) in the research brief, and log how it performed in the Monday metrics review.
- **Creative ambition applies after selection, never to it.** A beautifully made segment on a low-yield story (§3 item 3) is a failure.
- **Soft defaults are guides.** Pillar counts, segment timings, the number of analogies and of mind-map nodes, and the runtime range are starting points. Exceed them when the week or the topic genuinely needs it, and note why in the research brief.
- **What never relaxes (hard guardrails):**
  - accuracy and verification (§3.5–§3.6);
  - Survey of India maps (§6.1);
  - copyright and licensing (§6.4);
  - voice-only with Mounika's real voice (§1; sole exception: a logged internal, never-published reference sample);
  - non-partisanship and the compliance rules (§9);
  - viewer clarity: if a creative idea makes the explanation harder to follow, it goes.
  - the **runtime limits** in §2 and §4.1 (owner decision, Oct 2026). These are an explicit exception to "soft defaults are guides": only the owner can override them, with a reason logged in the brief.

## 1. Channel identity

- **Channel:** Decode UPSC with Mounika (@decodeupscwithmounika)
- **Language:** English only. Use Indian English spelling and usage: "programme", "defence", "lakh/crore".
- **Audience, in priority order:**
  1. **UPSC CSE 2027 Prelims aspirants.** Prelims is on 23 May 2027. Accuracy and trap-awareness come first.
  2. **UPSC CSE Mains writers** (GS 1–4 and Essay). They need analysis, committee citations and answer frameworks.
  3. **APPSC / TGPSC Group-1 aspirants.** Serve them through a "Telugu States Lens" segment wherever an issue has a genuine AP/Telangana link. The APPSC Group-1 Screening Test is reported for **24 Jan 2027** (Notification 07/2026, [VERIFY] on psc.ap.gov.in). That date comes first, so it gets its own push (`PLAYBOOK.md` §Exam season).
- **Positioning:** "One weekly masterclass, alongside one newspaper and instead of daily videos. We teach the static question hiding inside the news." Every segment shows its exam relevance: why it matters for Prelims, for Mains and for Group-1.
- **Presenter:** **voice-only (faceless channel)** for the early videos (owner decision, Oct 2026). Mounika records all narration on the microphone and never appears on camera. Her real voice is the channel's identity. It also protects monetisation: YouTube's July 2025 YPP update targets mass-produced, repetitive ("inauthentic") content, and a distinct human voice is our clearest signal of original work. Her voice is carried visually by the recurring "Decode Desk" (§6.1).
- **Never** use an AI avatar, AI face, deepfake, body double, text-to-speech or a voice clone in place of Mounika. Never show her hands or silhouette.
- **Sole exception:** an internal, never-published reference sample may use text-to-speech narration when the owner logs the decision in `docs/research/mentor-upgrade-decisions.md`. Such files are marked INTERNAL in their README, carry no upload checklist, and are never uploaded to any platform.

## 2. Output formats

| Output | Cadence | Length | Template |
|---|---|---|---|
| Weekly masterclass (flagship hub) | Every **Sunday, 6:00 PM IST** | **26–30 min, default about 28** (light weeks 20–24 min; never pad). **35 min is the ceiling.** If the projection exceeds 30 min, run the overflow cascade (§4.1) until it is 30 min or less; going past 30 needs a reason logged in the brief, and past 35 needs the owner's override. **Breadth-first** (owner decision, Oct 2026): a Prelims Grid of about 15 items plus a fixed AP–TG Desk, and 2 Deep Dives (3 in a heavy week). A chapter at every pillar. Revisit after the 8-week length test | `templates/02-master-script.md` |
| **Decode Extended** (standalone Deep Dive) | **Wednesday, 6:00 PM IST**, **0–1 a week**: only when a story has 3+ minutes of genuine `[EXT]` material. Finish it before the Sunday edit lock, so Wednesday is only a scheduled release | 10–15 min: the week's biggest story at full depth. Built from the hub Deep Dive's core plus its `[EXT]` rows, reusing the hub renders and narration, with its own 20–30 s open and close, its own title angle, a story-arc playlist, and a card from the hub chapter. Never shorter than 10 min, which also keeps it above the 8-min mid-roll threshold | `templates/02-master-script.md` (`[EXT]` rows) |
| YouTube Shorts | 3–5 per week, Mon–Fri (one APPSC-tagged Short per week until 24 Jan 2027) | 45–60 s each | `templates/04-shorts-pack.md` |
| Weekly PDF notes + MCQs | Released with the Sunday video | 6–10 pages | `templates/05-weekly-notes-mcq.md` |
| Monthly compilation | Last Sunday of the month (owner decision) | 60–90 min | `templates/06-monthly-compilation.md` |

Supporting documents:
- `templates/01-research-brief.md`: triage, the masterclass blueprint and the 5-step analysis.
- `templates/03-visual-handoff.md`: the editor/visuals sheet.
- `02b-voiceover-text.md`: the clean recording file, generated by `tools/make_voiceover.py`.

Weekly working files go in `weeks/YYYY-Www/`, for example `weeks/2026-W44/`. Monthly files go in `months/YYYY-MM/`.

### 2.1 Cross-exam tags

Tag every pillar, trap and MCQ in the research brief and PDF with every exam it serves. Use these tags:

| Tag | Exam |
|---|---|
| `#UPSC-Pre` | UPSC CSE Prelims |
| `#UPSC-Mains-GS1` … `#UPSC-Mains-GS4`, `#UPSC-Essay` | UPSC CSE Mains |
| `#APPSC-G1-Pre`, `#APPSC-G1-Mains-P2` … `P5` | APPSC Group-1 |
| `#APPSC-Pre-Jan27` | Anything likely in the 24 Jan 2027 Screening Test (use until that date) |
| `#TGPSC-G1-Pre`, `#TGPSC-G1-Mains-P2` … `P6` | TGPSC Group-1 |
| `#AP-G2`, `#AP-G3`, `#TS-G2`, `#TS-G3` | AP/TS Group-2 and Group-3 (state current affairs, more factual) |
| `#RBI-ESI` | RBI Grade B Phase-2 Economic & Social Issues |
| `#CAPF`, `#EPFO` | UPSC CAPF (AC) and EPFO EO/AO & APFC |

Verify Group-1/2/3 paper numbers and the CAPF/EPFO syllabus lines against the current official notifications before relying on them [VERIFY].

Tag only what is actually taught: an `#APPSC`, `#TGPSC` or `#Group1` tag (in the brief, the PDF or the YouTube description) needs a state-testable fact on screen for that item.

## 3. Content selection rules

1. **Sweep wide, then filter hard.** Each week starts with a deep web sweep of everything that happened Mon–Sat (`PLAYBOOK.md` §"Start this week's video"). Then filter for exam value.
   - Drop political bickering, crime reports, celebrity items, poll horse-racing and personality controversies, unless they raise a constitutional or institutional question.
   - Sports, awards, appointments and "days" stay only if they carry a static, testable fact (a body, a place, a first, a treaty).
2. **Tier every surviving story by depth, and give it categories** (sections below). Together, the week's Deep Dives and Focus segments ("pillars") must touch at least three of GS-1, GS-2, GS-3 and GS-4.
3. **Exam-yield score (EYS).** Score every candidate from 0 to 10 in the research brief's triage table **before** you assign any tier (owner decision, Oct 2026).
   - **P · Prelims yield (0–3):** distinct testable static facts that *arise from this week's event*: a new Act or section, a scheme and its nodal ministry, a report and its publisher, a designated site, species or place, a body's membership or composition, a treaty step, a "first". 0 = none; 1 = one; 2 = two or three; 3 = four or more, or a complete look-alike set. **Borrowed anchors score 0**: facts teachable in any week, whatever the news.
   - **M · Mains yield (0–2):** 2 = a recurring Mains theme with a verified past-question precedent; 1 = plausible; 0 = commentary only.
   - **I · India-centricity (0–2):** 2 = an Indian law, court, institution, scheme or policy is the actor or the object; 1 = a direct, measurable effect on India (its citizens, prices, a treaty India is party to, a vote India cast); 0 = India is a bystander.
   - **D · Durability (0–2):** 2 = still examinable in May 2027 without updating; 1 = a process with known next steps; 0 = episodic.
   - **S · State exams (0–1):** a genuine AP/TG link that APPSC or TGPSC Group-1 could examine.

   Write the score as `EYS 8 (P3·M2·I2·D1·S0)` with a one-line reason per component. A story scoring below 3 is dropped or becomes a Short. **No story is tiered from memory, from tracker momentum or from last week's plan.**

   **Consensus flag:** for each Deep Dive candidate, record whether it appears in The Hindu or Indian Express, in PIB, and in at least two UPSC daily digests that week. This is a flag, not a bar: a Deep Dive that appears in none of them needs a one-line reason in the brief.
4. **Sources.**
   - **Primary:** The Hindu, Indian Express, PIB, LiveMint, Down To Earth.
   - **Authoritative backstops:** PRS Legislative Research, the Supreme Court judgment text, RBI/SEBI releases, the Economic Survey, the Union Budget, gazette notifications, MEA statements, UN/IAEA/IPCC/UNEP reports, USGS mineral summaries, and Parliamentary Standing Committee reports.
   - **For the state lens:** AP and Telangana government releases and GOs, the state Socio-Economic Surveys, and state budgets.
5. **Accuracy is non-negotiable.**
   - Check every number, date, Article, section, nodal ministry and ranking against a primary source, and give dated figures their date and source.
   - If something can't be verified, either leave it out or say in the script that it is reported.
   - Never invent committee recommendations, report numbers, quotes or previous-year questions.
   - When unsure, mark the item `[VERIFY]` and list it in the research brief's verification log.
   - Even the owner's own guidance PDF contained five factual errors (see `docs/research/mentor-upgrade-decisions.md`). Trust primary sources, not briefs.
6. **PYQ citation rules.**
   - Quote a previous-year question's wording and year **only** from the official papers: upsc.gov.in previous-question-paper archive, psc.ap.gov.in, or websitenew.tspsc.gov.in. Cite it as "UPSC CSE Prelims 2023, GS Paper I".
   - Coaching sites may be used for explanations, never for wording, year or answer. Misdating is common: the Quad "trade bloc" question was asked in Mains **2020**, not 2022.
   - Until a question has been checked, tag it `[PYQ-VERIFY]` in the research brief. Nothing tagged `[PYQ-VERIFY]` goes on screen **or is read on air**.
   - Never present a coaching key as the answer for a paper whose official key is still pending.
   - Never put an unattributed "X% of Prelims is current affairs" figure on air. Say "a large share", or name the institute that made the estimate.
   - Keep verified questions in `docs/pyq-bank.md` (create it on first use): year, paper, format, answer, official-PDF link and exam tags.

### 3.1 Depth tiers: decide how much each story deserves

Not every story needs the same treatment. Assign each story one tier. The tier decides its depth, not its importance in the news cycle.

| Tier | When to use | What it gets | Typical length |
|---|---|---|---|
| **Deep Dive** | **EYS ≥ 7, with I ≥ 1, D ≥ 1 and P ≥ 2.** At least one Deep Dive a week has I = 2 (an Indian institution or policy at its centre). At most one is international, and only if India's policy, its citizens or a treaty obligation is directly engaged this week | The full 5-step analysis (§4.2): map, mind map, traps, Mains Lens, Way Forward, model question, checkpoint, plus history and earlier-episode connections. Written modularly: hub rows tagged `[HUB]`, extension rows tagged `[EXT]` (longer timeline, examiner's chair, two-sided proposition, model-answer walk-through). `[EXT]` rows go to Decode Extended or the PDF, never into the hub | **5–6.5 min in the hub** (about 700–900 words); **2 a week; a 3rd only in a heavy week** if it scores EYS ≥ 8 (otherwise it goes to Decode Extended) |
| **Focus** | EYS 5–6, or a Deep Dive candidate that loses on runtime: one GS paper, mainly a Prelims fact plus one Mains angle | Trigger → static anchor → 2 traps → one Mains angle → one "Write this down" | 1.5–3 min each |
| **Glimpse** | EYS 3–4 with P ≥ 1, or any higher-scoring item whose value is mainly a Prelims set: places in news, persons in news, reports and indices, schemes launched, species, appointments to constitutional bodies | What happened → the static fact → one trap, in the **Prelims Grid** (and the AP–TG Desk) | 25–35 s each; **14–16 in the Grid** plus 6–7 on the AP–TG Desk; never fewer than 15 in total unless the triage table has fewer qualifying items |
| **Update** | A story we have covered before that moved this week | One-line callback to the earlier episode → what changed → what it means for the exam now (§3.3) | 20–45 s; score the **change only**. It becomes a Deep Dive only if the change alone scores EYS ≥ 7 |

**Escalation signals for a Deep Dive** (each still needs the EYS thresholds):
- an SC or HC judgment, or a Constitution Bench order;
- a new or amended law, rule or scheme;
- India signing, joining, ratifying or leaving a treaty or body;
- a disaster in India or its neighbourhood with a geographic lesson;
- an RBI, Budget or trade decision;
- a foreign event **that changes Indian policy or directly affects Indian citizens**.

A local development in a foreign conflict (a truce, an offensive, a town captured) is a Glimpse or an Update unless India is a party.

**Arc fatigue:** the same story arc may not supply a Deep Dive in two consecutive weeks unless the change scores EYS ≥ 8.

### 3.2 Categories

Give every story **one scope category** and **one or more subject categories**. The video's Prelims Grid (National · International · Misc) and AP–TG Desk (Local: Telugu States), and the PDF, are organised by scope; the subjects drive the exam tags and the monthly compilation.

**Scope categories:**

| Scope | Covers | Colour cue |
|---|---|---|
| **Local: Telugu States** | Andhra Pradesh and Telangana: state policy, budgets, schemes, courts, disasters, ecology, rivers, state formation issues | Teal |
| **National** | Union government, Parliament, courts, national economy, national schemes, other states where the issue is national | Yellow |
| **International** | World events, India's foreign relations, groupings, treaties, global reports | Steel blue |
| **Miscellaneous** | Places in news, persons in news, awards, sports and culture items with a testable fact, important days, indices without a bigger story | White |

**Subject categories:** Polity & Governance · Economy · Environment & Ecology · Geography & Disasters · Science & Technology · Security & Defence · Society, Welfare & Health · International Relations · History, Art & Culture · Ethics (GS-4).

Add a new scope or subject category whenever a week needs one (e.g., "Elections" in an election season), and note it in the research brief.

### 3.3 Continuity: our videos form one connected course

Treat the channel as a running course, not a series of isolated weeks. Viewers who watch every week should feel the story move. New viewers should be able to catch up.

1. **Read the story tracker first.** `docs/story-tracker.md` lists every story we have covered: story ID, title, weeks covered, tier, static anchors, the traps we taught, the status, and what to watch next. Before writing anything, check every candidate story against it. Also re-read the last four weeks' `README.md` carry-forward lists.
2. **Never restart a covered story from zero.** Use an **Update** in this order:
   - a callback ("In Week 43 we decoded why a local truce on the Dnipro is not peace");
   - a one-sentence refresher of the static anchor;
   - the **delta**: what changed this week, and why;
   - what that does to the exam angle (a new trap, a changed fact, a resolved question).

   Show the earlier episode's mind map and add only the new branch in a new colour.
3. **Correct and refresh.** If a fact we taught has changed (a bill passed, a figure revised, a judgment delivered), say so plainly: "Last time we said X; that has now changed to Y." Update the PDF errata if needed.
4. **Link history and earlier episodes.**
   - Deep Dives connect the present event to its history: the treaty, the war, the committee, the earlier judgment.
   - They also connect to our own earlier episodes on related themes ("This is the same strategic-autonomy dilemma we saw in the Russian-crude story in Week 43").
   - Build **story arcs** (e.g., "Russia–Ukraine war", "Monsoon and El Niño", "RBI rate cycle", "Governors and state bills") and say where we are in the arc.
5. **Show the links on YouTube.** Every callback gets a YouTube card to the earlier video at the right timestamp, and the description lists "Earlier episodes in this story" links.
6. **Update the tracker after every video and Short.** Add new stories, append the week to updated ones, record the traps taught and the next trigger to watch.

## 4. Masterclass structure and the 5-step issue analysis

### 4.1 Running order of the video

This is the default **breadth-first** running order (owner decision, Oct 2026). Re-order it when a week's story demands it.

| # | Segment | Target | Notes |
|---|---|---|---|
| 1 | Cold open | 0:45 | Inside the week's top story, then an immediate pivot to the structural problem. The **pre-question** comes from the Prelims Grid, in a UPSC format (never yes/no). Close with a 10-second "On today's desk" rundown. |
| 2 | Update Desk ("Previously on Decode") | 0–1:30 | **Optional.** Use only when a tracked story moved in a way that changes what the viewer wrote down ("Last time we said X; now it's Y"): 3–5 changes × 20–30 s, with the Decode Archive visual (§6.6). Skip it entirely when nothing important moved. |
| 3 | **Prelims Grid: National · International · Misc** | 8:00 | 14–16 Glimpses × 25–35 s: what happened → the static set → one trap. **Starts by 2:30.** One colour-coded card per item, reused as-is in the PDF. |
| 4 | Deep Dive 1 (I = 2) | 6:00–6:30 | The 5 steps (§4.2). `[EXT]` rows go to Decode Extended or the PDF. |
| 5 | **AP–TG Desk** (Local: Telugu States) | 3:00 | Its own chapter, **every week until 24 Jan 2027** (then review). 6–7 Glimpses in this order: polity and courts → schemes and budget → rivers, projects and disasters → indices, persons and firsts. A primary state document (GO no., gazette, budget page) on each card. It ends with one Group-1-style question on screen. |
| 6 | Deep Dive 2 | 5:00–5:30 | As above. |
| 6a | Deep Dive 3 (heavy weeks only) | 5:00 | Only at EYS ≥ 8; the reason is logged. |
| 7 | Focus / Telugu States Lens | 0–1:30 | An EYS 5–6 item with a Mains angle, or a genuine AP/TG link inside a Deep Dive. |
| 8 | Trap Vault | 2:00 | 10 items in "how many", Statement-I/II and pairs formats: this week's traps, plus 2 from last week and 1 from four weeks ago (spaced recall). |
| 9 | Desk Note (optional) | 30–60 s | Only in weeks where it fits (§5.10). |
| 10 | Verdict + CTA | 0:45 | Ends with 15–20 s of narration over the Decode Desk, so the end screen has room. |

**Hub budget and overflow (owner decisions, Oct 2026).** Budget the hub at about 28 min (§2). Project its runtime from the word count (÷ 135) at the rundown stage.

- **Typical week (29:00):** cold open 0:45 · Update Desk 1:30 · Prelims Grid 8:00 · Deep Dive 1 6:15 · AP–TG Desk 3:00 · Deep Dive 2 5:15 · Focus 1:30 · Trap Vault 2:00 · verdict 0:45.
- **Heavy week (30–35 min, reason logged):** a third Deep Dive (EYS ≥ 8). The Focus and the Desk Note go first. Any further big story becomes a 2–3 min Focus "trailer" with its full depth in Decode Extended.
- **Light week:** 20–24 min. Never pad.
- **Front-load Prelims value:** the Prelims Grid starts by 2:30, and the lead Deep Dive's traps land before 15:00, because most viewers will not reach minute 25.

If the projection exceeds 30 min, apply this cascade in order, and stop as soon as it is at 30 min or less:
1. Move `[EXT]` rows out and cap each Deep Dive at 6:30.
2. Shorten or skip the Update Desk (30 s per change at most).
3. Drop the Desk Note and the Focus.
4. Route a third Deep Dive to Decode Extended, with a 2–3 min Focus trailer in the hub.
5. Demote Deep Dive 2 to a 2:30 Focus.
6. Defer Mains-only items with no deadline to the monthly compilation.

**Never cut:**
- the Prelims Grid below 15 items;
- the AP–TG Desk (until 24 Jan 2027);
- the pre-question;
- the per-pillar checkpoints;
- the Trap Vault's spaced recall.

Checkpoint countdown cards hold 6–8 s of real silence, because many viewers watch at 1.25–2x. Place manual mid-roll ad slots only at chapter boundaries.

### 4.2 Inside each Deep Dive (the 5 steps)

Focus segments use a compressed version: trigger → static anchor → 2 traps → one Mains angle → one "Write this down". Glimpses and Updates follow §3.1 and §3.3.

Each Deep Dive answers **one central question** that is stated aloud near the start. Frame it as a **paradox or dilemma**, for example "resource abundance vs refining bottleneck" or "energy security vs normative principles". The beats link with "**therefore**" (because of this, that follows) or "**but**" (a complication). Never link them with "and then".

1. **Hook & Strategic Trigger.** Start inside the event: what happened this week, stated physically and concretely. Then pivot at once to the structural problem and state the central question. Never open with "Welcome back, aspirants." The cold-open story must *be* the event being analysed. Cut tangential human-interest anecdotes; they hurt learning.
2. **Foundations: the static anchor.** Give a 20–30 s **key-terms primer** first (the 2–3 terms the rest depends on). Then lay down the constitutional, statutory, economic, geographic or ethical roots, and name the GS paper and syllabus line:
   - **GS-1:** physical and economic geography (rivers, choke points, minerals, monsoon), social structure, art and culture, modern history.
   - **GS-2:** Articles, landmark SC judgments, statutory and constitutional bodies, treaties, groupings, India's bilateral relations.
   - **GS-3:** fiscal and monetary policy, supply chains, energy security, critical technologies, defence, cyber, agriculture, environment.
   - **GS-4:** integrity, public interest vs state security, corporate governance, case-study ethics.

   For any place-based issue, lead with the map (§6). Locate it relative to India first, then zoom in.
3. **Core analytical deep dive.** Unpack the cause-and-effect chain across geography, law, economy, technology and security. This is where the 360° matrix becomes one story.
   - Bring in the **history**: the origin of the dispute, the earlier treaty, war, judgment or committee.
   - Bring in **our own earlier episodes**: connect to them by name and week (§3.3).
   - Build the concept map as you go (§6.3).
4. **The UPSC examination crucible.**
   - **Prelims Trap Vault.** Isolate the facts examiners use as traps: statutory vs constitutional vs executive bodies, nodal ministries, voting thresholds, ratification status, who publishes which index, borders and nearby places, regions placed in the wrong country, plausible false headlines, superlatives ("largest", "first-ever"), and geological vs political definitions.
     - Write at least 3 trap lines per pillar in the "UPSC may ask X — the trap is Y" format.
     - Since 2023 UPSC uses "How many of the above", "how many pairs" and Statement-I/Statement-II formats, which punish partial knowledge. So **cover the whole set of look-alikes** (all of Ukraine's neighbours, all the "National Commissions"), not only the correct item.
     - **UPSC formats only:** every on-screen question (the pre-question, MCQs, Trap Vault items) uses a real UPSC format: "how many of the above", Statement-I/II, pairs, or a single correct option. Never yes/no. **Always state the answer with a one-line reason** after a consistent 6–8 s hold; never leave an on-screen question unanswered.
     - **Bridge to India:** give every foreign anchor one Indian link where a real one exists, for example ZNPP's VVER-1000 reactors and Kudankulam's, or the river-bank rule applied to the Ganga's tributaries.
     - **When a list is the trap, state the whole list:** for example, UN Charter Art 33 names seven methods, not three.
     - Add a **PYQ Echo** where a verified PYQ exists: year, format and the static fact it froze. Show the full question on screen, but don't read the whole stem aloud.
   - **Mains Lens.** Cover (a) Economic & Fiscal, (b) Governance & Federal Balance, (c) National Security & Geopolitics, and (d) Socio-Environmental. Use data points, not adjectives.
     - For IR topics, state the issue as a **contestable proposition**, as UPSC does ("NATO's expansion works well for India. What is your opinion?"), and argue both sides.
     - Close with a **Carry into Mains** block: 3–5 hard facts (names, numbers, institutions) the aspirant can drop into an answer.
5. **Way Forward & India's Strategic Imperative.** Give actionable recommendations, each citing a real source (a committee, report, treaty article, judgment or official statement): Law Commission reports, Sarkaria, Punchhi, 2nd ARC, NITI Aayog, Parliamentary Standing Committees, SC guidelines, or international best practice. Anchor the conclusion in India's national interest and strategic autonomy, pragmatically and without chest-beating. End with:
   - **one model Mains question** (10 or 15 marks) and a **3-part answer skeleton** (intro / body dimensions / conclusion);
   - **one "Pause and answer" checkpoint** (§5.9);
   - a **3-point recap** over the completed concept map, then the map skeleton with blanks;
   - a **one-line preview** of the next pillar.

**Telugu States Lens** (optional, 45–90 s): add it only when the link is real. Typical links include Polavaram, the Krishna–Godavari tribunals, AP Reorganisation Act 2014 issues, Amaravati, the Hyderabad pharma and semiconductor clusters, state fiscal indicators, flagship state schemes, and Eastern Ghats / Nallamala ecology.
- Structure it as: national issue → one AP/TG data point → how Group-1 asks it. Group-1 questions lean direct and factual in Prelims, and "explain/describe" in Mains.
- Show **at least one primary state document** on screen (state budget, Socio-Economic Survey, GO, assembly record).
- Name the paper it serves (e.g., APPSC Mains Paper IV, TGPSC Mains Paper VI) and add the exam tags.
- Attribute state-formation history and party positions with special care; state-history questions are politically scrutinised.
- Cover Group-1 recruitment litigation only as reported or concluded proceedings.

## 5. Script and voice rules (Mounika's delivery)

1. **Verbatim only.** Write every spoken word in full. No bullet points, outlines or "talk about X" notes inside narration.
2. **Format:** the master script is a **two-column production table**: visual cue on the left, verbatim spoken narration on the right (`templates/02-master-script.md`). Each row's visual lands on the words in that row. `tools/make_voiceover.py` turns the right-hand column into the clean recording file.
3. **Pace:** 130–140 words per minute overall. Word budget = target minutes × 135. Slow to about 110–120 wpm on numbers, Article numbers and trap lines; mark those rows *Voice: slower*. Print the running word count and estimated runtime at the end of every segment.
4. **Phonetic markers** go in square brackets after hard words on first use: Sarkaria [Sar-kaa-ree-yaa], Oleshky [Oh-LESH-kee]. Every foreign place name and technical term gets one. Keep the shared list in §8 updated.
5. **Write for the ear, in connected sentences.**
   - Spoken English that flows like a mentor talking. **No staccato fragments.** Never write "It is local. It is temporary. And it shows how far peace still is."
   - Mix sentence lengths: mostly 12–20 words, with an occasional 25–30-word explanatory sentence whose clauses run in order.
   - Test every sentence: Mounika must be able to say it in one breath.
   - Prefer active voice. Put no bracketed asides in the spoken text, apart from phonetic markers.
   - Use conversational transitions that carry logic. "Now, to understand why this matters to New Delhi, we need to take a step back." "Here is the subtle distinction UPSC loves to test." "Notice how this feeds straight into our energy-security equation." "So the real question is not whether... but why..."
   - Spell out numbers the way they are spoken ("one point eight million barrels a day"), with the figure on screen.
6. **Tone:** authoritative, calm, warm and intellectually rigorous, like a senior faculty mentor who enjoys the subject.
   - Talk to one aspirant ("you"). Use "we" when thinking through a problem together.
   - No hype words ("shocking", "must watch"), no fear-mongering, no partisan framing. Present each government or opposition position as that side's stated argument and attribute it.
7. **Warmth and light humour (owner decision).** Use light humour and everyday analogies to keep the energy up across 20+ minutes.
   - As a default, use about one analogy per pillar (more where it genuinely clarifies), drawn from shared Indian life: cricket, the kitchen and household budget, Telugu cinema, the railway platform, the mandi.
   - Humour points *at the concept*, never at a person, community or victim. Never joke about religion, caste, gender, regions, political parties, war casualties or disasters.
   - A joke that would make the explanation unclear gets cut.
8. **Creative narrative devices.** Rotate them week to week so the show never feels templated:
   - **Mystery open:** "Why would two armies agree to stop firing in one town only?"
   - **"What if":** "What if the Kakhovka dam had never broken?"
   - **Second-person scene:** "Imagine you are the collector of Anantapur this morning..."
   - **Time jump:** "Rewind to 1954..."
   - **Countdown:** "Three numbers explain this entire budget."
   - **Myth vs fact.**
   - **Examiner's chair:** "If I were setting this paper..."
   - **Callback to an earlier episode.**
   - **The running story arc.**

   Every device must serve the explanation.
9. **Recurring verbal signposts,** so viewers learn the format:
   - "**Prelims Trap.**" before trap lines.
   - "**Mains Lens.**" before the four-dimension matrix.
   - "**Telugu States Lens.**" before the Group-1 segment.
   - "**Write this down.**" before a one-line value-addition (a data point, judgment or committee).
   - "**Pause and answer.**" before each checkpoint: exactly one per pillar (3–5 per video) plus the cold-open pre-question. Ask the question, hold a 6–8 s countdown card over real silence, and give the answer in the **opening line of the next pillar** (an open loop). For the last pillar, answer in the Trap Vault; in a standalone (Decode Extended), answer straight after the hold. A checkpoint should test retrieval (link two ideas from the chapter), not repeat the trap just taught. Checkpoints are learning devices, not CTAs.
10. **Desk Note (optional, owner decision: only when it fits).** Use it in weeks where the themes naturally support it: 30–60 s just before the verdict, warm and slower, over the Decode Desk.
   - It is honest and process-focused: how to revise this week's material in 20 minutes, or one 150-word answer to write this week. It treats setbacks and Plan B as normal.
   - **Banned:** fear framing, hustle glorification ("sixteen hours a day"), rank or selection promises, emotional appeals about family sacrifice, and topper testimonials. India's consumer regulator (CCPA) fined coaching institutes in 2025 over misleading topper claims.
11. **Closing:** Mounika gives a philosophical or ethical verdict in voice, over the Decode Desk, that links the week's themes. Model it on a UPSC Essay topic: an aphorism illustrated by this week's events. Then give a single CTA: the PDF notes plus this week's MCQ challenge in the pinned comment. One CTA only.
12. **Voice-only delivery:** viewers never see Mounika, so the voice must carry the warmth.
    - Mark direct-address rows with voice directions.
    - Use "you" often.
    - Keep a smile in the voice on hooks, analogies and closings.

## 6. Visual direction and video grammar

The visuals must do the teaching. Two research findings drive this section:
- Visuals that appear **on the exact words they explain** and diagrams that **build while the narrator speaks** help learning even with no instructor on screen.
- Decorative images that carry no information *hurt* learning.

Two craft rules follow from them (motion review, Oct 2026). Every build is keyed to the **word** it explains, not to the start of its sentence (`→ "word"` cues in the script; `tools/masterclass-video` aligns them). And no frame sits frozen for more than about 3 s: holds get a slow push-in or a camera move.

### 6.1 Primary tags (exactly one per row)

- `[VOICE ANCHOR]`: Mounika speaks directly to the viewer (cold-open hook, transitions, checkpoints, Desk Note, verdict).
  - The visual is the recurring **Decode Desk**: a cinematic, person-free scene with a dark slate desk, an open notebook where key words write themselves in yellow ink, a brass lamp, a small globe, and a neon-yellow audio waveform that moves with her voice.
  - Add a clean lower-third with the syllabus tag (e.g., "GS-2 · International Relations").
  - Always add a **voice direction** (tone, pace, energy).
- `[GIS MAP]`: satellite imagery or a terrain-shaded map, never a flat outline map.
  - Specify exact markers: rivers, elevation shading, choke points, frontlines, maritime boundaries, and the specific places with their bank/side.
  - Open the **first map of each map sequence** with a **locator inset** (where this is relative to India), large enough to read India's outline (at least 30% of frame height for 2 s), then zoom in. Put labels on the map itself, with no separate legend.
  - **Use only maps consistent with the official Survey of India boundaries of India** (full J&K and Ladakh, Arunachal Pradesh). This is a legal requirement, not a style choice. Overlay a compliant boundary layer on any India frame built from international tiles.
- `[MIND MAP]`: a progressive concept map or flowchart that builds **one node per idea, landing on its keyword** (rules in §6.3).
- `[REAL FOOTAGE]`: authentic material from **free or government-licensed sources only** (§6.4).
  - Examples: PIB/government press events, satellite passes, signed-treaty and summit photographs, ports, ships, plants and mines.
  - Name the source and the credit line in the cue.
- `[DATA CHART]`: a clean, institution-style chart (bar, line, share) from a named dataset (RBI, MoSPI, Commerce Ministry, IMF, UN, Kpler-as-reported).
  - Title it as a claim ("Russia became India's top crude supplier").
  - Show the source and date on screen.
  - One message per chart.
- `[KINETIC TEXT]`: an animated card for an Article, Act, definition, trap or checkpoint. Use it for exact legal wording, the Prelims Trap card, the PYQ Echo card and the "Pause and answer" card.
- `[HYPERFRAME PROMPT]`: an AI image. **Last resort only (owner decision):** use it when no real or satellite visual exists, and only for generic scenes that carry information (a refinery's distillation column, a container port).
  - Never real people (including Mounika), never a real event shown as if it were real, and no party symbols or distorted national flags or emblems.
  - Specify the subject, setting, lighting, lens, mood, "photorealistic, 8k" and the aspect ratio (16:9 main, 9:16 Shorts).
  - Log it in the handoff so the editor ticks YouTube's **altered/synthetic content** disclosure on upload.

Optional secondary tags: `[ON-SCREEN TEXT]` (exact words, at most 8), `[SFX]`, `[MUSIC]`, and `[PYQ ECHO]` (an overlay card: year · paper · format · frozen fact).

### 6.2 Strict prohibitions

- **No cartoon icons or clip art:** doves, hourglasses, generic house or factory icons, emoji, flat vector people.
- **No karaoke subtitles:** no word-by-word highlighted boxes and no full script on screen. Keyword overlays on maps and footage carry at most 8 words. `[KINETIC TEXT]` cards may carry exact legal wording, PYQ stems, MCQs and model questions. Minimum on-screen text size: 24 px at 1080p (readable on a phone). Viewers get full verbatim captions as a separate, human-corrected `.srt` file they can switch on; auto-captions garble Indian proper nouns.
- **Numbers appear at their final value** on any card a viewer might pause and copy. No count-up animations on revision numbers. A paused frame must never show a wrong figure.
- **No decorative visuals.** Apply the **information test**: if removing an image loses no information, cut it, or hold it under 3 s as a transition.
- No Google Earth Studio footage (its terms don't license commercial use), no newspaper screenshots, and no TV news clips.

### 6.3 Mind-map rules

- Each pillar has **one** concept map that grows through the deep dive and is complete at the recap.
  - **Fact maps, not label maps:** each node states a testable fact ("Donbas = Donetsk + Luhansk"), not a heading ("Civilians"). The recap blanks test the pillar's most examinable facts.
  - Centre node: the central question.
  - Branches: cause → consequence → India's response, plus the "tested as" branch with the traps.
  - Label the links ("leads to", "governed by", "tested as").
  - Use at most about **7 nodes** on screen.
- After the recap, show the map as a **skeleton with 2–3 blanks**. Mounika says: "Pause here, copy this map, and fill in the blanks before I reveal them." Hold 3 seconds, then reveal. Viewers learn far more by completing a map than by just looking at one.
- A moving highlight or pointer acts as "Mounika's gaze": it moves to the node or place she is talking about.
- Ink-trail or pen-nib drawing effects are fine. Hands are not.
- The completed map goes into the PDF notes. The monthly compilation rebuilds the month's maps into one master map per GS paper.

### 6.4 Sourcing and licensing (owner decision: free and government-licensed only)

| Source | Use | Credit |
|---|---|---|
| PIB / DD / AIR creator-cleared material | Official events, ministers' statements (no misrepresentation) | "Source: PIB" / "Courtesy: DD News" |
| NASA Earth Observatory, NASA imagery | Satellite stills and passes | "NASA Earth Observatory" |
| USGS Landsat / EarthExplorer | Satellite imagery (public domain) | "USGS Landsat" |
| Copernicus Sentinel (EU) | Satellite imagery | "Contains modified Copernicus Sentinel data [year]" |
| Wikimedia Commons | Photos, only after checking the file's licence | Author + licence as the file page states |
| data.gov.in (GODL-India) and ministry dashboards | Data charts | "Source: <ministry>, data.gov.in" |
| Self-made maps and diagrams | QGIS + Survey of India boundaries; the repo's HTML renderer for mind maps and charts | Own work |

- Never use news-agency footage (Reuters, AP, ANI), Sansad TV or DD Parliament clips, or paid stock. Doordarshan has issued copyright claims over parliamentary clips.
- Record every external asset's source, licence and credit in the visual handoff's asset log.

### 6.5 Brand visual system

| Colour | Use |
|---|---|
| Charcoal slate (#1E2228) | Background |
| Accent neon yellow (#F5D300) | Articles, keywords, mind-map centre node, "Pause and answer" card |
| White (#FFFFFF) | Body text |
| Alert red (#E5484D) | Only for "Prelims Trap" cards |
| Teal (#2BB3A3) | "Telugu States Lens" cards |
| Steel blue (#4A90C2) | Rivers and water bodies on GIS maps; "International" Prelims Grid cards |

Prelims Grid and AP–TG Desk category cards use these colours:
- **Local: Telugu States:** teal.
- **National:** yellow.
- **International:** steel blue.
- **Miscellaneous:** white outline on slate.

### 6.6 Creative toolkit (use freely, rotate weekly)

Treat this list as a starting point, not a limit. Invent new devices whenever they teach better.

- **Decode Archive:** a recurring continuity visual for the Update Desk. A shelf of notebooks on the Decode Desk, one per past week. The camera pulls out last week's notebook, its mind map lifts off the page, and the new branch draws itself in a fresh colour.
- **Map journeys:**
  - a camera "flight" along a river, corridor, border or shipping lane, built in QGIS (free; Blender GIS is also allowed);
  - before/after satellite wipes (NASA/Copernicus/USGS);
  - a time-lapse of changing frontlines, coastlines or reservoirs.
- **Timeline rivers:** a horizontal timeline that flows like a river from the historical origin to this week, with our earlier episodes marked as stepping stones.
- **Case-file board:** evidence cards pinned to a board for a court case or inquiry (petition → arguments → bench → ruling), with red thread drawn between them.
- **Split-screen dilemma:** the two sides of the central paradox on either half of the screen, each building as Mounika argues it.
- **Data morphs:** a single chart that transforms (a bar becomes a map, a pie becomes a timeline) as the narration moves from "how much" to "where" to "when".
- **The examiner's desk:** a stylised question paper on which the PYQ Echo or the likely question types itself, and the trap option is circled in red.
- **Sound design:** a recurring soft "page turn" for the Update Desk, a muted bell for each "Pause and answer", and a short sting per Prelims Grid category. Keep the music bed low under the narration.
- **3D terrain:** free elevation data (SRTM or Copernicus DEM) rendered in QGIS or Blender for mountain passes, river valleys and glacial lakes.

All of these still follow §6.2 (no clip art or karaoke), §6.4 (licensing) and the Survey of India map rule.

## 7. Packaging (titles, thumbnails, descriptions)

Generate **3 distinct title + thumbnail concepts** per masterclass.

- **Titles:** an urgent hook plus the core syllabus theme, 45–70 characters, with no clickbait the video doesn't deliver.
  - Bad: "Current Affairs Week 4 October 2026"
  - Good: "Why Are State Governors Withholding Bills? The Article 200 Crisis"
  - Good: "India's Critical Minerals Race: Why Rare Earths Are The New Oil"
- **Thumbnails:**
  - At most 3 words, in white and yellow, placed top-left (away from the mobile timestamp at bottom-right).
  - One tangible visual conflict: an empty assembly line, two flags colliding, a gavel over a server, a satellite view of a river frontline.
  - **No face (voice-only channel).**
  - One bold hero object on the right third, and a small "DECODE UPSC" yellow badge bottom-left as the brand mark.
- **Description:**
  - A 2-line hook.
  - Timestamped chapters: the first at 00:00, at least 3, each at least 10 s, titled as a question or claim, named by exam hook ("Montreux vs Kerch (Prelims)"), never by internal labels. One per pillar, plus Prelims Grid, AP–TG Desk and Trap Vault markers.
  - "Earlier episodes in this story" links for every Update and callback.
  - Sources list, plus image and footage credits.
  - PDF link and Telegram link.
  - Hashtags: #UPSC #UPSC2027 #CurrentAffairs #APPSC #TGPSC #Group1.
- **Shorts titles:** a question format, at most 50 characters, ending in "#UPSC #Shorts".

## 8. Pronunciation bank (extend weekly)

| Term | Marker |
|---|---|
| Sarkaria | [Sar-kaa-ree-yaa] |
| Punchhi | [Pun-chee] |
| Monazite | [MOH-nuh-zyte] |
| Kunming–Montreal | [Kun-ming Mon-tree-awl] |
| Polavaram | [Poh-laa-va-ram] |
| Nallamala | [Nul-la-maa-la] |
| Godavari | [Go-daa-va-ree] |
| Kesavananda Bharati | [Kay-sha-vaa-nun-da Bhaa-ra-tee] |
| Lithium | [LITH-ee-um] |
| Vizhinjam | [Vi-zhin-jam] |
| El Niño | [El NEEN-yo] |
| kharif | [kha-REEF] |
| Rayalaseema | [Raa-yaa-la-SEE-ma] |
| Marathwada | [Ma-raath-WAA-da] |
| Anantapur | [A-nun-ta-poor] |
| Kakatiya | [Kaa-ka-TEE-ya] |
| Kurnool | [Kur-NOOL] |
| Swaraj Abhiyan | [Swa-RAAJ Ub-hee-YAAN] |
| Mihir Shah | [Mi-HEER Shaah] |
| Urjit | [UR-jit] |
| Pardiwala | [Par-dee-VAA-la] |
| Puttaswamy | [Put-taa-SWAA-mee] |
| Anuradha Bhasin | [A-noo-RAA-dha BHAA-sin] |
| Faheema Shirin | [Fa-HEE-ma Shi-REEN] |
| POCSO | [POK-so] |
| PM-WANI | [P-M WAA-nee] |
| EFTA | [EF-ta] |
| RCEP | [AR-sep] |
| GATT / GATS | [GAT] / [GATS] |
| Liechtenstein | [LIK-ten-shtyne] |
| Manuka | [MAA-noo-ka] |
| Dipankar Datta | [Dee-pun-kar DUT-ta] |
| Sheel Nagu | [Sheel NAA-goo] |
| mandal | [MUN-dul] |
| Pragya Prasun | [PRUG-yaa Pra-SOON] |
| Srikrishna | [Shree-KRISH-na] |
| BharatNet | [BHAA-rat-net] |
| Dipole | [DY-pole] |
| Oleshky | [Oh-LESH-kee] |
| Dnipro | [DNEE-pro] |
| Kherson | [Kher-SON] |
| Donetsk | [Da-NYETSK] |
| Luhansk | [Loo-HAANSK] |
| Crimea | [Kry-MEE-ya] |
| Zaporizhzhia | [Za-po-RIZH-zhya] |
| Kakhovka | [Ka-KHOV-ka] |
| Kerch | [KERCH] |
| Azov | [AY-zov] |
| Sevastopol | [Se-vas-TOH-pol] |
| Montreux | [Mon-TRUH] |
| Bosphorus | [BOS-fuh-rus] |
| Dardanelles | [Daar-da-NELZ] |
| Enerhodar | [E-ner-HO-dar] |
| Kalanchak | [Ka-lan-CHAK] |
| Valdai | [Val-DAI] |
| Samarkand | [Sa-mar-KAND] |
| Lubinets | [Loo-BEE-nets] |
| Lantratova | [Lan-TRAH-to-va] |
| Azovstal | [A-zov-STAL] |
| Mariupol | [Ma-ree-OO-pol] |
| Sumy | [SOO-mee] |
| Türkiye | [TUR-kee-yay] |
| Samajik Sahayata | [Saa-maa-jik Sa-haa-ya-taa] |
| Vridhavastha | [Vri-dhaa-vus-thaa] |
| Vidhawa | [Vi-dhuh-waa] |
| Divyangjan | [Div-yaang-jun] |
| Parivar Labh | [Pa-ri-vaar Laabh] |
| Annapurna | [Un-na-poor-naa] |
| Bharosa | [Bha-ROH-saa] |
| Surya Kant | [SOOR-ya Kaant] |
| Seshan | [SHAY-shun] |
| Anoop Baranwal | [A-noop Ba-RAAN-wal] |

## 9. Compliance and ethics guardrails

- No selection, rank or "guaranteed" claims. No paid-coaching endorsements without a clear #ad disclosure. No topper testimonials.
- Attribute every contested political claim. Keep the channel non-partisan.
- **Copyright:** follow §6.4. Use no newspaper screenshots and no broadcast or news-agency clips beyond brief fair-use quotation.
- **AI disclosure:** whenever a `[HYPERFRAME PROMPT]` image is photorealistic, tick YouTube's altered/synthetic content disclosure on upload. Conflict topics get a more prominent label shown on the video player.
- Maps must follow official Indian boundaries (§6.1).
- Treat sub judice matters carefully: report the proceedings and avoid predicting verdicts.
- **Never on screen in a final render:** `[VERIFY]`, `[PYQ-VERIFY]` or any other working tag.
- **Corrections:** if an error is found after publishing, post a pinned correction comment and add a description note within 24 hours, fix the PDF, and log it in the week's `README.md`.

## 10. Working conventions for Claude in this repo

- **Trigger phrase:** when Mounika says "start this week's current affairs video" (or similar), follow `PLAYBOOK.md` §"Start this week's video" end to end: deep sweep, tiering, categories, continuity check, proposed rundown, then the brief and script.
- **Continuity ledger:** `docs/story-tracker.md` (§3.3). Read it before every week and update it after every video and Short.
- **Date context:** always state the week being covered (Mon–Sat dates) at the top of each file.
- **File naming:** `weeks/2026-W44/01-research-brief.md`, `02-master-script.md`, `03-visual-handoff.md`, `04-shorts-pack.md`, `05-weekly-notes-mcq.md`. Copy the matching file from `templates/` to start. Generate `02b-voiceover-text.md` with `python3 tools/make_voiceover.py weeks/YYYY-Www vN`.
- Markdown for scripts and briefs.
- `tools/pdf/` builds the branded PDF.
- `tools/short-video/` is the Shorts renderer. Its v3 icon scenes and full-script captions break §6.2: rebuild it to map, mind-map and keyword-caption scenes before the next Short is rendered.
- Before calling a script final, run the **QC checklist** in `PLAYBOOK.md` §Saturday.
- Refresh `docs/research/aspirant-landscape-2026.md` when UPSC, APPSC or TGPSC publishes a new notification, calendar or result.
- **Ship every completed piece of work to `main`.**
  - When a task is finished, commit and push the working branch, open a pull request into `main`, and merge it.
  - If the working branch's earlier PR has already been merged, restart the branch from the latest `main` before adding new commits.
  - Never push directly to `main`.
