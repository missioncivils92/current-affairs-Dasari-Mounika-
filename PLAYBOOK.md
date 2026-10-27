# PLAYBOOK.md — Weekly Production Checklist

Each week runs from Monday triage to the Sunday 6:00 PM IST upload. `CLAUDE.md` defines the rules, tone, visual grammar and formats. This file covers **what to do, when, and who does it**, and ends with the model example of how a script must read.

**Owners:**
- **C** = Claude (research, scripts, packaging)
- **M** = Mounika (review, voiceover recording; voice-only, never on camera)
- **E** = editor (visuals, cut, upload)

**Week folder:** `weeks/YYYY-Www/`. Create it on Monday by copying the five weekly templates from `templates/`.

---

## Weekly timeline at a glance

| Day | Main output | Shorts & community |
|---|---|---|
| Mon | Week folder + rolling story log; metrics review | Short #1 (reveals last Sunday's MCQ answer); Posts quiz |
| Tue | Log continues; themes forming | Short #2 (Prelims Trap, with a quiz sticker) |
| Wed | **Pillars locked** with a masterclass blueprint per pillar; research started | Short #3 |
| Thu | Research brief complete; verification log and PYQ check | Short #4: APPSC-tagged until 24 Jan 2027 |
| Fri | **Master script v1** (two-column) + visual handoff | Short #5 (optional) |
| Sat | M read-through → v2, QC, recording; PDF notes + MCQs | Poll: "Which issue should we decode next?" |
| Sun | Edit lock by 2 PM, packaging, **upload 6:00 PM IST**, PDF on Telegram | Pinned MCQ challenge |

---

## Monday: set up and triage

- [ ] **C** Create `weeks/YYYY-Www/` and copy `templates/01`–`05` into it. Fill in the week's Mon–Sat dates.
- [ ] **C** Start the **rolling story log** in `01-research-brief.md` §1. For each candidate story, add a one-line summary, source link, GS mapping, selection-test score (`CLAUDE.md` §3) and exam tags (`CLAUDE.md` §2.1).
- [ ] **C** Scan these sources daily:
  - The Hindu, Indian Express, PIB (all ministries), LiveMint, Down To Earth.
  - PRS, the SC daily judgments list, RBI press releases.
  - AP/Telangana government press releases and GOs.
- [ ] **E/M** Publish Short #1, revealing the answer to last Sunday's pinned MCQ challenge.
- [ ] **E/M** Post a **Posts-tab quiz**: one MCQ from last week's Trap Vault, with the explanation pointing to the video timestamp.

## Tuesday: keep logging, build themes

- [ ] **C** Keep adding to the story log. Merge related stories into **themes**: for example, three separate stories about rare earths, a China export curb and a new KABIL deal become one "Critical Minerals" theme.
- [ ] **C** Flag likely Telugu-state links and APPSC Screening relevance (`#APPSC-Pre-Jan27`).
- [ ] **E/M** Publish Short #2, a Prelims Trap with a Shorts quiz sticker.

## Wednesday: lock the pillars with a blueprint

- [ ] **C** Propose **4–5 pillars**. Together they must cover at least 3 GS papers. For each, write the **masterclass blueprint** (in `01-research-brief.md` §2):
  - **Primary syllabus anchor**, e.g. "GS-2: bilateral, regional and global groupings involving India".
  - **Central question / paradox**, e.g. "Why does a local truce on the Dnipro expose a war of attrition rather than peace?"
  - **Target PYQs**: candidates from the official papers, tagged `[PYQ-VERIFY]` until checked.
  - **Map beats**: what the GIS map must show, in order.
  - **Mind-map plan**: centre node and up to about 7 nodes.
  - **Pre-question / checkpoint idea.**
  - **Exam tags** and **estimated runtime.**
- [ ] **M** Approve or swap pillars. **Decision deadline: Wednesday 8 PM.** If a big story breaks after this, see "Late-breaking news" below.
- [ ] **C** Start the 5-step analysis for each pillar in `01-research-brief.md` §3.
- [ ] **E/M** Publish Short #3.

## Thursday: finish the research brief

- [ ] **C** Complete all 5 steps for every pillar:
  - the key-terms primer;
  - at least 3 Prelims traps that cover the whole look-alike set;
  - 4 Mains dimensions with data;
  - the "Carry into Mains" facts;
  - a Way Forward with cited sources;
  - the model Mains question and answer skeleton;
  - one "Pause and answer" checkpoint.
- [ ] **C** Add the Telugu States Lens where it is genuine, with a primary state document and the Group-1 paper named.
- [ ] **C** Fill in the **verification log**:
  - Every number, date, Article, ministry and index needs a primary-source link.
  - Clear every `[VERIFY]` tag or cut the claim.
  - Check every PYQ against the official PDF. Clear the `[PYQ-VERIFY]` tag and add the question to `docs/pyq-bank.md`, or drop it.
- [ ] **C** Draft 15 MCQ candidates (10 make the PDF) and 3 Mains questions (2 make the PDF), each with exam tags.
- [ ] **E/M** Publish Short #4 (APPSC-tagged until 24 Jan 2027).

## Friday: script and visual handoff

- [ ] **C** Write the **master script v1** in `02-master-script.md` as a **two-column table**: visual cue (left) | verbatim narration (right).
  - Lock the map beats and mind-map nodes first, then write the narration to them, so every visual lands on the words it explains.
  - Show the running word count. Budget: target minutes × 135.
  - Suggested runtime split for 22 min:

    | Segment | Time |
    |---|---|
    | Cold open (with pre-question) | 1:00 |
    | Pillars | 4 × 4:30 |
    | Trap Vault rapid-fire (with spaced recall) | 1:30 |
    | Telugu States Lens | 1:00 inside pillars |
    | Optional Desk Note | 0:45 |
    | Verdict + CTA | 1:15 |
- [ ] **C** Run `python3 tools/make_voiceover.py weeks/YYYY-Www v1` to generate `02b-voiceover-text.md` for Mounika.
- [ ] **C** Fill in the **visual handoff** in `03-visual-handoff.md`:
  - a shot-by-shot table with timing cues;
  - every GIS map spec, mind-map build order, data chart, real-footage source with its credit, and any last-resort AI image with its disclosure flag;
  - the asset/licence log.
- [ ] **C** Draft 3 title + thumbnail concepts and the description with chapters (titled as a question or claim).
- [ ] **C** Fill in the **shorts pack** in `04-shorts-pack.md` for next week's Mon–Fri slots.
- [ ] **E** Start building maps (QGIS + Survey of India boundaries), mind maps and charts (repo HTML renderer) from the handoff.
- [ ] **E/M** Publish Short #5 (optional).

## Saturday: review, QC, record

- [ ] **M** Read `02b-voiceover-text.md` aloud once. Mark any line that sounds unnatural, any sentence you can't say in one breath, and any joke that doesn't land. **C** revises to v2 and regenerates the voiceover file.
- [ ] **C/M** Run the **QC checklist** before recording.

  **Script and teaching**
  - [ ] Every spoken word is written in full, in the right-hand column. No bullet points inside narration.
  - [ ] **No staccato fragments.** Sentences are connected, with logical transitions. Every sentence passes the one-breath test.
  - [ ] Runtime is 18–26 min (word count ÷ 135). Numbers and trap rows are marked *slower*.
  - [ ] No "Welcome back" opener. The cold open is inside the event, pivots to the structural problem and asks the pre-question.
  - [ ] Every pillar has:
    - a stated central question and a key-terms primer;
    - all 5 steps;
    - at least 3 traps covering the look-alike set;
    - 4 Mains dimensions with data and a Carry into Mains block;
    - a cited committee or report;
    - a model question with an answer skeleton;
    - one checkpoint (answered at the start of the next pillar);
    - a recap and a one-line preview.
  - [ ] At least 3 GS papers covered across the pillars.
  - [ ] Humour: at most about one analogy or light moment per pillar, aimed at the concept. Nothing on religion, caste, gender, region, party, casualties or disasters.
  - [ ] Desk Note (if used): no rank, fear, hustle or topper-testimonial lines.
  - [ ] Exactly one CTA. The checkpoints are not CTAs.

  **Accuracy**
  - [ ] Verification log complete. Zero `[VERIFY]` and zero `[PYQ-VERIFY]` tags remain.
  - [ ] Every PYQ cited is in `docs/pyq-bank.md`, with its official-PDF link.
  - [ ] Dated figures carry their date and source on screen.
  - [ ] Political claims are attributed. No partisan adjectives.
  - [ ] Phonetic markers on first use. New terms added to the `CLAUDE.md` §8 bank.

  **Visuals**
  - [ ] Every row has exactly one primary visual tag.
  - [ ] No cartoon icons or clip art, no karaoke or full-script captions, and burned-in text is at most 8 words.
  - [ ] Every image passes the **information test**.
  - [ ] Every map is a GIS map (satellite or terrain), opens with a locator inset, and follows **official Survey of India boundaries**.
  - [ ] Every pillar has a progressive mind map, a skeleton with blanks and a reveal.
  - [ ] No on-camera rows. Direct-address rows use `[VOICE ANCHOR]` with a voice direction. No faces, hands, AI avatars or synthetic voices.
  - [ ] Every external asset has its source, licence and credit logged. No news-agency or Parliament clips. No Google Earth Studio.
  - [ ] Any photorealistic AI image is flagged for YouTube's synthetic-content disclosure.
- [ ] **M** Record the voiceover (VO), one WAV file per segment: `YYYY-Www_VO_open.wav`, `YYYY-Www_VO_P1.wav`, and so on. Use the same mic, room and distance every week so the voice sounds identical.
- [ ] **C** Produce the **PDF notes + MCQs** in `05-weekly-notes-mcq.md`:
  - One page per pillar: anchor, the completed mind map, traps, 4 dimensions, Carry into Mains, Way Forward, Telugu lens, and exam tags.
  - 10 MCQs in the current UPSC formats ("How many of the above", Statement-I/II, "how many pairs"), plus 2 direct factual items in Group-1 style. The answer key and explanations go at the end.
  - 2 Mains questions with skeletons.
  - Export to PDF with the channel branding.
- [ ] **E** Rough cut.
- [ ] **E/M** Post the poll: "Which issue should we decode next?"

## Sunday: lock and publish

- [ ] **E** Final cut and edit lock by **2:00 PM IST**. **M** watches it through once.
- [ ] **E** Upload a human-corrected verbatim `.srt` caption file. Check proper nouns: Polavaram, Sarkaria, place names.
- [ ] **M** Pick the final title and thumbnail from the 3 concepts. **E** designs the thumbnail: at most 3 words, top-left, white and yellow; hero object on the right third; "DECODE UPSC" badge; no face.
- [ ] **E** Upload as scheduled for **6:00 PM IST**. Include:
  - the description, chapters, sources and credits;
  - the PDF and Telegram links;
  - the end screen (last week's video + playlist) and cards;
  - the synthetic-content disclosure, if flagged.
- [ ] **E** Post the PDF to the **Telegram channel**. Telegram is for PDF distribution only; no discussion group.
- [ ] **E** Pinned comment: "This week's MCQ challenge" (1 question; the answer is revealed in Monday's Short #1) + PDF link.
- [ ] **M** Spend 30–60 minutes replying to comments after publishing.
- [ ] **M** **Weekly answer feedback:** by Wednesday, pick one viewer's answer to last week's model Mains question. Reply with 2–3 specific improvements and pin it. Be kind and specific, and don't rank or grade publicly.
- [ ] **C** Write next week's carry-forward list in `weeks/YYYY-Www/README.md`: stories still developing, unanswered viewer questions, unused traps, and traps due for spaced recall next week and in four weeks.

---

## Corrections policy

If anyone finds an error after publishing:
1. Within 24 hours, post a pinned correction comment ("Correction: … The correct position is …, source …") and add a "Correction" line to the description.
2. Fix the PDF and re-post it to Telegram.
3. Log the error, its cause and the fix in the week's `README.md`.
4. If a rule or source caused the error, update `CLAUDE.md`.

## Monthly compilation (last Sunday of the month, or the first weekend of the next month)

- [ ] **C** On the Wednesday before, merge the month's research briefs into `months/YYYY-MM/` using `templates/06-monthly-compilation.md`.
  - Group by GS paper, not by week.
  - Update developing stories: a bill passed, a judgment delivered, a treaty ratified.
  - Rebuild the weekly mind maps into one master map per GS paper.
  - Rebuild the Trap Vault into a 30-question rapid-fire round.
  - Add a "Telugu States Lens" monthly roundup for Group-1 viewers.
- [ ] **C** Write new linking narration (verbatim, two-column). Reuse the weekly VO only where the facts haven't changed.
- [ ] **M** Record the new segments. **E** assembles a 60–90 min video with chapters per GS paper.
- [ ] **C** Produce a combined monthly PDF with 30 MCQs and 5 Mains questions, all carrying exam tags.

## Exam-season adjustments

| Window | Adjustment |
|---|---|
| **Now – 24 Jan 2027 (APPSC Group-1 Screening Test, reported; Notification 07/2026 [VERIFY on psc.ap.gov.in])** | One APPSC-tagged Short a week (Thursday slot). Tag `#APPSC-Pre-Jan27` items in every PDF. Add an "APPSC Screening countdown" segment to the Nov and Dec 2026 monthly compilations. Run a **December special**: "Six months of current affairs for the APPSC Screening Test" (Jul–Dec 2026, with AP state data), as a 45–60 min video + PDF. |
| Jan 2027 (CSE notification ~13 Jan) | One Short + community post on notification facts (vacancies, dates, eligibility changes). Verify on upsc.gov.in. |
| Feb–May 2027 (Prelims run-up) | Give more weight to the Trap Vault in the masterclass. From March, add a monthly 100-MCQ PDF. In the last 6 weeks, run "12-month current affairs revision" monthly compilations. |
| 23 May 2027 (Prelims) | That week's video covers paper-related current affairs, explained calmly. No answer-key speculation before UPSC's official key. |
| Jun–Aug 2027 (Mains run-up) | Expand the Mains Lens and model answers. Add Essay theme hooks in the verdict segment. |
| TGPSC / other notifications | No TGPSC Group-1 notification yet (Oct 2026). When one appears, add a Group-1 focus Short series and extra Telugu States Lens depth for 4–6 weeks. Do the same for AP/TS Group-2/3. |

## Late-breaking news (after the Wednesday lock)

1. If it passes at least 3 of the selection-test criteria (`CLAUDE.md` §3) **and** breaks before Friday noon: swap out the weakest pillar.
2. If it breaks after Friday noon: cover it as a 60–90 s "Breaking Lens" segment before the verdict, or carry it forward to next week.
3. Never ship a breaking item without completing the verification log.

## Metrics review (every Monday, 15 min, **M + C**)

Look at last week's video:
- CTR on the chosen thumbnail.
- Average view duration and the retention dips by chapter. Are the dips at the mind-map builds, the checkpoints or the Trap Vault?
- Shorts → long-form click-through.
- Posts quiz and poll responses.
- PDF downloads and Telegram views.
- Top comments and questions.

Log one change to try this week in `weeks/YYYY-Www/README.md`.

---

## Model example: robotic vs mentor (Russia–Ukraine, W43)

### ❌ How we wrote it before (robotic reel style)

> **Audio:** "One town gets a truce. The war does not. It is local. It is temporary. A full ceasefire is still missing. And it shows how far peace still is. First — why this war? The roots go back to 2014."
>
> **Visual:** flat outline map, cartoon dove icon, hourglass icon, full script bouncing on screen as captions.

The problems:
- Staccato fragments.
- News read in date order.
- No structural question.
- Decorative icons that teach nothing.
- Karaoke captions competing with the narration.

### ✅ How it must read now (mentor standard)

Facts below were checked on 27 Oct 2026. Re-verify any dated figure before reusing it.

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| 1 | `[VOICE ANCHOR]` Decode Desk; the notebook writes "Oleshky". Lower-third: *GS-2 · International Relations*. *Voice: calm, curious, smile on the last line.* | If you glanced at the international headlines this week, you may have seen talk of a breakthrough — a local ceasefire around a small town called Oleshky [Oh-LESH-kee]. But here is the first lesson of geopolitics — a humanitarian pause in one town is not the same thing as peace, and today we will see exactly why. |
| 2 | `[GIS MAP]` Locator inset: Ukraine relative to India. Cinematic zoom to southern Ukraine, terrain shading. Dnipro in steel blue. Pins: Kherson on the right (west) bank, Oleshky on the left (east) bank. Labels on the map, no legend. Official Survey of India boundaries for any India frame. | To understand why this narrow strip of land matters, we have to look at the geography first. Oleshky sits directly across the Dnipro [DNEE-pro] from the city of Kherson [Kher-SON]. The Dnipro is Europe's fourth-longest river, and in this war it has become the natural moat that separates the two armies in the south. |
| 3 | `[REAL FOOTAGE]` Satellite pair, before/after: the Kakhovka [Ka-KHOV-ka] reservoir full, then drained after the June 2023 dam breach (NASA Earth Observatory or Copernicus Sentinel, with credit). Pointer moves upstream to the Zaporizhzhia plant, then south along the North Crimean Canal. | Now notice what lies upstream. When the Kakhovka dam was destroyed in June 2023, the reservoir behind it drained — and that reservoir had fed both the cooling system of the Zaporizhzhia [Za-po-RIZH-zhya] nuclear plant and the canal that carries fresh water to Crimea [Kry-MEE-ya]. So any shift along this river is never just local, and that is why local deals here are so hard to keep. |
| 4 | `[MIND MAP]` Centre node builds: *The strategic dilemma for New Delhi*. Branch 1 appears on its words: *Energy security — discounted Russian crude*. Branch 2 appears on its words: *Principles — UN Charter Art 2(4), territorial integrity*. | Now let us come to the question UPSC actually cares about in General Studies Paper Two. How does New Delhi live with a long war without giving up its strategic autonomy? |
| 5 | `[DATA CHART]` Bar chart: India's crude imports by source, Sept 2026. Russia highlighted at about 1.7–1.8 million barrels a day, about one-third of the total. Source line: "Kpler, as reported, Sept 2026". | On one side sits energy security — in September, Russia supplied roughly one-third of India's crude imports, a little under two million barrels every day. On the other side sits principle — New Delhi keeps repeating that this is not an era of war, and it keeps pointing to the territorial integrity that Article Two of the UN Charter protects. |
| 6 | `[KINETIC TEXT]` Red Prelims Trap card. Line 1: *Kerch Strait = Sea of Azov ↔ Black Sea · 2003 Russia–Ukraine treaty*. Line 2: *Montreux 1936 = Turkish Straits only (Bosphorus, Dardanelles)*. Line 3: *Donbas = Donetsk + Luhansk (political usage); the coal basin spills into Rostov*. *Voice: slower.* | **Prelims Trap.** Keep two straits apart in your head. The Kerch [KERCH] Strait links the Sea of Azov [AY-zov] to the Black Sea, and its passage was governed by a 2003 treaty between Russia and Ukraine. The Montreux [Mon-TRUH] Convention of 1936 is a different animal — it governs only the Turkish Straits, the Bosphorus and the Dardanelles. And when you see "Donbas", read it as Donetsk and Luhansk — though the coal basin itself runs into Russia's Rostov region, which is exactly the kind of fine print an examiner enjoys. |
| 7 | `[GIS MAP]` Ukraine's seven land neighbours light up one by one. `[PYQ ECHO]` overlay card: *UPSC CSE Prelims 2023 · "How many of the above share a land border with Ukraine?" · Answer: only two — Hungary, Romania* (only after the `[PYQ-VERIFY]` tag is cleared). | And this is not a hypothetical. In 2023, UPSC listed six European countries and simply asked how many of them border Ukraine — only two did, Hungary and Romania. So learn the whole neighbourhood, not just the one country in the headline. |
| 8 | `[KINETIC TEXT]` Yellow "Pause and answer" card with a 5-second countdown: *Which body of water does the Kerch Strait connect to the Black Sea?* *Voice: warm, playful.* | **Pause and answer.** Which sea does the Kerch Strait join to the Black Sea? Say it out loud — I will tell you at the start of the next chapter. |

What changed:
- **One structural question** drives the pillar.
- **Geography comes first**, on a real map.
- **Every visual lands on its words** and carries information.
- **Connected spoken sentences** replace fragments.
- **The trap covers the look-alikes** (Kerch vs Montreux, political vs geological Donbas).
- **The PYQ is verified, not invented.**
- **The checkpoint** turns the viewer from a watcher into a learner.

## Production handoff checklist (before VO recording and editing)

- [ ] All foreign names and technical terms carry phonetic brackets.
- [ ] All cartoon icons, clip art and karaoke captions are gone. Every visual is a GIS map, real or satellite footage, a data chart, a mind map, a kinetic text card or the Decode Desk; an AI image appears only as a disclosed last resort.
- [ ] The Prelims Trap, PYQ Echo, Mains Lens and checkpoints are clearly marked and tied to real exam demands.
- [ ] The script flows naturally as an uninterrupted 18–26 minute lecture, with no robotic staccato sentences.
