# CLAUDE.md — Decode UPSC with Mounika

The production operating system for the weekly current-affairs masterclass. Read this file before writing anything in this repo. The step-by-step weekly process lives in `PLAYBOOK.md`. Audience and exam research lives in `docs/research/aspirant-landscape-2026.md`.

---

## 1. Channel identity

- **Channel:** Decode UPSC with Mounika (@decodeupscwithmounika)
- **Language:** English only. Use Indian English spelling and usage: "programme", "defence", "lakh/crore".
- **Audience, in priority order:**
  1. **UPSC CSE 2027 Prelims aspirants.** Prelims is on 23 May 2027. Accuracy and trap-awareness come first.
  2. **UPSC CSE Mains writers** (GS 1–4 and Essay). They need analysis, committee citations and answer frameworks.
  3. **APPSC / TGPSC Group-1 aspirants.** Serve them through a "Telugu States Lens" segment wherever an issue has a genuine AP/Telangana link.
- **Positioning:** one cinematic weekly masterclass instead of daily noise. Every segment makes its exam relevance visible: why this matters for Prelims, for Mains, and for Group-1.
- **Presenter:** **voice-only (faceless channel).** Mounika records all narration on the microphone and never appears on camera. Her voice is the channel's identity, carried by a recurring branded visual, the "Decode Desk" (§6).
- **Never** use an AI avatar, AI-generated face, deepfake or body double to stand in for Mounika. Never show her hands or silhouette. The channel is honestly voice-only.

## 2. Output formats

| Output | Cadence | Length | Template |
|---|---|---|---|
| Weekly masterclass (flagship) | Every **Sunday, 6:00 PM IST** | 18–26 min, sized to the week's density | `templates/02-master-script.md` |
| YouTube Shorts | 3–5 per week, Mon–Fri | 45–60 s each | `templates/04-shorts-pack.md` |
| Weekly PDF notes + MCQs | Released with the Sunday video | 6–10 pages | `templates/05-weekly-notes-mcq.md` |
| Monthly compilation | Last Sunday of the month, or the first weekend of the next month | 60–90 min | `templates/06-monthly-compilation.md` |

Supporting documents: `templates/01-research-brief.md` (triage + 5-step analysis) and `templates/03-visual-handoff.md` (the editor/visuals sheet).

Weekly working files go in `weeks/YYYY-Www/`, for example `weeks/2026-W44/`. Monthly files go in `months/YYYY-MM/`.

## 3. Content selection rules

1. **Filter out about 90% of the news.** Drop political bickering, crime reports, celebrity items, poll-result horse-racing and personality controversies, unless they raise a constitutional or institutional question.
2. Pick **4–5 thematic pillars** per week. Together they must touch at least three of GS-1, GS-2, GS-3 and GS-4.
3. **Selection test.** A story makes the cut only if it passes at least two of these:
   - It maps to a named line of the UPSC syllabus.
   - It has a static anchor (an Article, Act, judgment, body, treaty, species, location or index).
   - It is likely to produce a Prelims fact or a Mains question within 12–18 months.
   - It has a Telugu-states angle (a bonus, never sufficient on its own).
4. **Sources.** Primary: The Hindu, Indian Express, PIB, LiveMint, Down To Earth. Authoritative backstops: PRS Legislative Research, the Supreme Court judgment text, RBI/SEBI releases, the Economic Survey, the Union Budget, gazette notifications, MEA joint statements, and India State of Forest / IPCC / UNEP reports. For the state lens: AP and Telangana government press releases, the state Socio-Economic Surveys, and state budgets.
5. **Accuracy is non-negotiable.** Check every number, date, Article, section, nodal ministry and ranking against a primary source. If something can't be verified, either leave it out or say in the script that it is reported. Never invent committee recommendations, report numbers or quotes. When unsure, mark the item `[VERIFY]` in the draft and list it in the research brief's verification log.

## 4. The 5-step issue analysis (mandatory for every pillar)

1. **Cold Open / Dynamic Trigger.** Start inside the event: what happened this week, stated physically and concretely. Never open with "Welcome back, aspirants."
2. **Static Syllabus Anchor.** Connect the event to its constitutional, statutory, economic, geographic or ethical roots, and name the GS paper and syllabus line.
   - GS-1: geomorphology, monsoon, mineral distribution, social stratification, art and culture, modern history.
   - GS-2: Articles (e.g., Art 131, 200, 356), landmark SC judgments, statutory/constitutional bodies (CAG, ECI, NHRC), treaties and groupings.
   - GS-3: fiscal and monetary policy, supply-chain sovereignty, COP mandates, defence indigenisation, cyber-security architecture, agriculture, S&T.
   - GS-4: integrity, public interest vs. state security, corporate governance, case-study ethics.
3. **Prelims Trap Vault.** Isolate the facts examiners use to set traps: statutory vs. constitutional vs. executive bodies, nodal ministries, voting thresholds, ratification status, who publishes which index, location confusions, "first-ever" claims. Write at least 3 trap lines per pillar in the "UPSC may ask X — the trap is Y" format.
4. **Mains Multi-Dimensional Matrix:** (a) Economic & Fiscal, (b) Governance & Federal Balance, (c) National Security & Geopolitics, (d) Socio-Environmental. Use data points, not adjectives.
5. **Way Forward & Committee Blueprints.** Give actionable recommendations, each citing a real source: Law Commission reports, Sarkaria, Punchhi, 2nd ARC, NITI Aayog, Parliamentary Standing Committees, SC guidelines, or international best practice. End with **one model Mains question** (10 or 15 marks) and a **3-part answer skeleton** (intro / body dimensions / conclusion).

**Telugu States Lens** (optional, 45–90 s): add it only when the link is real. Typical links include Polavaram, Krishna–Godavari tribunals, AP Reorganisation Act 2014 issues, Amaravati, the Hyderabad pharma and semiconductor clusters, state fiscal indicators, flagship state schemes, and Eastern Ghats / Nallamala ecology. Tag it as relevant to APPSC/TGPSC Group-1, and name the Group-1 paper where possible.

## 5. Script and voice rules (Mounika's delivery)

1. **Verbatim only.** Write every spoken word in full. No bullet points, outlines or "talk about X" notes inside a script.
2. **Pace:** 130–140 words per minute. Word budget = target minutes × 135. Print the running word count and estimated runtime at the end of every segment.
3. **Phonetic markers** go in square brackets after hard words on first use: Sarkaria [Sar-kaa-ree-yaa], Monazite [MOH-nuh-zyte], Kunming [Kun-ming]. Keep the shared list in §8 updated.
4. **Breath and emphasis:** an em-dash (—) is a short beat, an ellipsis (...) is a deliberate pause, and **bold** marks a stressed word. Use at most one bold word per sentence.
5. **Sentence shape:** spoken English. Prefer short sentences of 12–20 words, active voice, one idea per sentence, and no bracketed asides in the spoken text. Spell out numbers the way they are spoken ("one point four lakh crore rupees"), with the figure in the on-screen text.
6. **Tone:** authoritative, warm and exam-focused. Talk to one aspirant ("you"). No hype words ("shocking", "must watch"), no fear-mongering, no partisan framing. Present each government or opposition position as that side's stated argument and attribute it.
7. **Recurring verbal signposts,** so viewers learn the format:
   - "**Prelims Trap.**" before trap lines.
   - "**Mains Lens.**" before the four-dimension matrix.
   - "**Telugu States Lens.**" before the Group-1 segment.
   - "**Write this down.**" before a one-line value-addition (a data point, judgment or committee).
8. **Closing:** Mounika gives a philosophical or ethical verdict in voice, over the Decode Desk visual, that links the week's themes, then a single CTA (PDF notes + this week's MCQ challenge in the pinned comment). One CTA only.
9. **Voice-only delivery:** because viewers never see Mounika, the voice must carry the warmth. Mark direct-address lines with voice directions, use "you" often, and keep a smile in the voice on hooks and closings.

## 6. Visual direction tags

Every narration block carries exactly one primary tag:

- `[VOICE ANCHOR]`: the moments when Mounika speaks directly to the viewer (cold-open hook, transitions, rapid-fire rounds, the verdict). The visual is the recurring **Decode Desk**: a cinematic, person-free scene with a dark slate desk, an open notebook where key words write themselves in yellow ink, a brass lamp, a small globe, and a neon-yellow audio waveform that moves with her voice. Each tag also carries a **voice direction**: tone, pace and energy (e.g., "warm, slower, smile in the voice on the last line").
- `[HYPERFRAME PROMPT]`: an image-generation prompt for Flux, Midjourney or DALL·E. Always specify the subject, setting, cinematic lighting, lens/angle, mood, "photorealistic, 8k", and an aspect ratio of 16:9 for the main video or 9:16 for Shorts. Avoid stock corporate art. Never depict real living people's faces (including Mounika's), party symbols, or a distorted national flag or emblem.
- `[KINETIC MOTION GRAPHIC]`: an animated text, flowchart or chain specification (e.g., "Article 200 in neon yellow on charcoal slate; three arrows animate to Assent / Withhold / Reserve for President").
- `[GEOSPATIAL MAP]`: a high-contrast terrain map with the highlighted corridor, EEZ, basin or frontier. **Use only maps consistent with the official Survey of India boundaries of India** (full J&K and Ladakh, Arunachal Pradesh). This is a legal requirement, not a style choice.

Optional secondary tags: `[ON-SCREEN TEXT]` (exact words, at most 8), `[SFX]`, `[MUSIC]`.

**Brand visual system:**
- Charcoal slate background (#1E2228).
- Accent neon yellow (#F5D300) for Articles and keywords.
- White (#FFFFFF) body text.
- Alert red (#E5484D) only for "Prelims Trap" cards.
- Teal (#2BB3A3) for "Telugu States Lens" cards.

## 7. Packaging (titles, thumbnails, descriptions)

Generate **3 distinct title + thumbnail concepts** per masterclass.

- **Titles:** an urgent hook plus the core syllabus theme, 45–70 characters, with no clickbait the video doesn't deliver.
  - Bad: "Current Affairs Week 4 October 2026"
  - Good: "Why Are State Governors Withholding Bills? The Article 200 Crisis"
  - Good: "India's Critical Minerals Race: Why Rare Earths Are The New Oil"
- **Thumbnails:** at most 3 words, in white and yellow, placed top-left (away from the mobile timestamp at bottom-right). Show one tangible visual conflict (an empty assembly line, two flags colliding, a gavel over a server). **No face (voice-only channel).** Put one bold hero object on the right third (an onion, a gavel, a milk can, a cracked map) and a small "DECODE UPSC" yellow badge bottom-left as a consistent brand mark.
- **Description:** a 2-line hook, timestamped chapters (one per pillar plus Trap Vault / Telugu States Lens markers), sources list, PDF link, and hashtags (#UPSC #UPSC2027 #CurrentAffairs #APPSC #TGPSC #Group1).
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

## 9. Compliance and ethics guardrails

- No selection, rank or "guaranteed" claims. No paid-coaching endorsements without a clear #ad disclosure.
- Attribute every contested political claim. Keep the channel non-partisan.
- Copyright: no newspaper screenshots or broadcast clips beyond brief fair-use quotation. Prefer self-made visuals, PIB/government media, and licensed or AI-generated imagery.
- Maps must follow official Indian boundaries (§6).
- Treat sub judice matters carefully: report the proceedings and avoid predicting verdicts.

## 10. Working conventions for Claude in this repo

- **Date context:** always state the week being covered (Mon–Sat dates) at the top of each file.
- **File naming:** `weeks/2026-W44/01-research-brief.md`, `02-master-script.md`, `03-visual-handoff.md`, `04-shorts-pack.md`, `05-weekly-notes-mcq.md`. Copy the matching file from `templates/` to start.
- Markdown only. No build step yet. A Remotion project may be added later. Until then the visual handoff is a prompt document for the editor.
- Before calling a script final, run the **QC checklist** in `PLAYBOOK.md` §Saturday.
- Refresh `docs/research/aspirant-landscape-2026.md` when UPSC, APPSC or TGPSC publishes a new notification, calendar or result.
