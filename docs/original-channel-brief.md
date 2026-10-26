# UPSC CSE Visual Engine — Channel Architecture & Production Operating System

## 1. Channel Identity & Production Philosophy
* **Channel Name:** Decode UPSC with Mounika (@decodeupscwithmounika)
* **Target Audience:** Serious UPSC Civil Services Examination (CSE) aspirants preparing for Prelims and Mains (General Studies Papers 1, 2, 3, and 4).
* **Release Rhythm:** Exactly ONE masterclass video per week, published every **Sunday at 6:00 PM IST**, synthesizing the high-yield issues from Monday to Saturday.
* **Duration:** 18 to 26 minutes (dynamically adjusted based on the week's academic density).
* **Delivery Format (The Hybrid Anchor Model):**
  * **[ON-CAMERA - MOUNIKA]:** Mounika presents directly on camera for the cold open/hook, major thematic transitions, and the final philosophical/ethical verdict.
  * **[VISUAL HYPERFRAME / B-ROLL]:** The screen transitions into cinematic, photorealistic visuals, kinetic supply chain diagrams, geospatial maps, and high-contrast constitutional typography while Mounika's voiceover narrates the underlying mechanisms.
* **Voiceover Standard:** Mounika records the voiceover herself using her microphone. Claude must generate **100% full, verbatim, spoken-word audio scripts**—never bullet points, summaries, or outlines.

---

## 2. Deep UPSC Research Engine: The 5-Step Issue Analysis
Claude must filter out 90% of daily political bickering, crime reports, and superficial controversies. For each of the 4 to 5 chosen thematic pillars of the week, Claude must structure the analysis using this exact 5-step matrix:

### Step 1: The Cold Open / Dynamic Trigger
* Start directly inside the physical or geopolitical crisis (zero throat-clearing, no "Welcome back aspirants").
* State the immediate event that occurred this week.

### Step 2: The Static Syllabus Anchor
* Ground the dynamic event in its constitutional, statutory, or economic roots:
  * **GS-1:** Geomorphology, monsoon shifts, mineral distribution, social stratification.
  * **GS-2:** Constitutional Articles (e.g., Art 131, 200, 356), Supreme Court landmark judgments, statutory bodies (CAG, ECI, NHRC), bilateral/multilateral treaties.
  * **GS-3:** Fiscal/monetary policy, supply chain sovereignty, environmental COP mandates, defense indigenization, cyber security architectures.
  * **GS-4:** Administrative integrity, public interest vs. state security, corporate governance.

### Step 3: The Prelims Trap Vault
* Explicitly isolate facts that UPSC examiner tricksters use in Prelims MCQs:
  * Statutory vs. Constitutional vs. Executive bodies.
  * Nodal Ministries (e.g., Ministry of Commerce vs. Ministry of Finance).
  * Voting thresholds, treaty ratification statuses, and global reporting indices.

### Step 4: Mains Multi-Dimensional Matrix
* Analyze the issue across 4 distinct dimensions:
  1. *Economic & Fiscal Implications*
  2. *Governance & Federal Balance*
  3. *National Security & Geopolitics*
  4. *Socio-Environmental Impact*

### Step 5: The Way Forward & Committee Blueprints
* Conclude each topic with actionable policy recommendations citing official sources:
  * Law Commission Reports, Sarkaria Commission, Punchhi Commission, Second ARC, NITI Aayog Strategy Documents, or Parliamentary Standing Committees.

---

## 3. Scriptwriting & Audio Directives for Mounika's Voice
Claude must write narration scripts tailored for human oral delivery:
1. **Verbatim Text:** Every word to be spoken must be written out in full.
2. **Pacing & Cadence:** Scripted for an authoritative, engaging conversational tempo (130–140 words per minute).
3. **Phonetic Pronunciation Markers:** Insert phonetic spellings in brackets for complex Sanskrit legal terms, foreign treaties, or mineral names (e.g., *Sarkaria [Sar-kaa-ree-yaa]*, *Monazite [MOH-nuh-zyte]*).
4. **Breath & Emphasis Markers:** Use em-dashes (—) and ellipses (...) to indicate deliberate pauses and dramatic weight.

---

## 4. Visual Prompting & Remotion Hyperframe Standards
Every block of narration must have an explicit visual direction tag:
* **`[ON-CAMERA - MOUNIKA]`**: Clear stage directions, eye-contact cues, and emotional tone.
* **`[HYPERFRAME PROMPT]`**: Ultra-detailed image generation prompts (for Flux, Midjourney, or DALL-E) avoiding generic corporate art. Prompts must specify cinematic lighting, 8k resolution, photorealism, and clear focal subjects (e.g., "Cinematic interior of the Supreme Court of India, dramatic side lighting, empty wooden benches, heavy shadows, hyper-realistic, 8k").
* **`[KINETIC MOTION GRAPHIC]`**: Specifications for animated vector chains, flowcharts, or text highlights (e.g., "Highlight Article 200 in neon yellow over a charcoal-slate background; animate arrows flowing to 'Assent', 'Withhold', and 'Reserve for President'").
* **`[GEOSPATIAL MAP]`**: High-contrast terrain maps with highlighted corridors, exclusive economic zones (EEZs), or conflict frontiers.

---

## 5. Packaging Directives (Thumbnails & Titles)
Claude must generate 3 distinct Title & Thumbnail concepts per episode:
* **The 3-Word Thumbnail Rule:** Maximum 3 high-contrast words (White & Yellow typography) placed in the top-left quadrant to avoid mobile timestamp overlays.
* **Visual Conflict:** The thumbnail must visualize a tangible dilemma (e.g., an empty assembly line, two flags colliding, a legal gavel over a digital server).
* **The High-CTR Academic Title Formula:** Combine an urgent hook with the core syllabus theme:
  * *Bad:* "Current Affairs Week 4 October 2026"
  * *Good:* "Why Are State Governors Withholding Bills? The Article 200 Crisis"
  * *Good:* "India’s Critical Minerals Race: Why Rare Earths Are The New Oil"

---

## 6. Execution Workflow for Claude Code
When invoked in this repository:
1. **Initialize Repo Structure:**
   * `CLAUDE.md`: Channel tone, writing guidelines, pronunciation rules, and build configurations.
   * `PLAYBOOK.md`: Step-by-step weekly checklist from Monday triage to Sunday upload.
   * `templates/`: Markdown templates for weekly research briefs, scripts, and visual handoff documents.
2. **Generate Weekly Issues:**
   * Triage input news sources (The Hindu, Indian Express, PIB, LiveMint, DownToEarth).
   * Map selected issues to GS-1, 2, 3, 4.
   * Produce the complete, ready-to-record production script with on-camera and visual cutaway cues.
   