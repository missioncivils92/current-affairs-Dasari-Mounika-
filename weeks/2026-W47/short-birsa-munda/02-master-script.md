# Master Script — 2026-W46 Short: Birsa Munda, Dharti Aaba

**Release:** upload Sun 15 Nov, morning · YouTube Short (vertical 9:16), about 1:15, on camera (decision 41).
**Coverage:** facts as verified in `this folder's `01-research-brief.md`.
**Version:** v1. Lively, exam-first, no "What if" opening (owner, 9 Nov); no short forms; Telugu on the key lines (decision 42).

## SHORT — Birsa Munda, Dharti Aaba (target 1:15)

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| R.1 | **S1** `[KINETIC TEXT]` `[FACE]` Band from frame 1: "15 NOVEMBER · JANJATIYA GAURAV DIVAS". *Voice: proud, bright.* | A young man of just twenty-four shook the British Empire, and the people called him Dharti Aaba, the Father of the Earth. Today is his birthday! Evaru aayana? Let's decode. |
| R.2 | **S2** `[KINETIC TEXT]` `[TOP]` Card: "Birsa Munda · born 15 November 1875 · Ulihatu (now Jharkhand) · Munda tribe"; chip "Janjatiya Gaurav Divas since 2021 · 151st birth anniversary". | Birsa Munda was born on November fifteenth, eighteen seventy-five, at Ulihatu, in today's Jharkhand. Since twenty twenty-one, India marks his birthday as Janjatiya Gaurav Divas, Tribal Pride Day, and this year is his hundred and fifty-first birth anniversary. |
| R.3 | **S3** `[MIND MAP]` `[TOP]` Cause chain: "Land taken by outsiders (dikus), forced labour (beth begari)" → "Ulgulan, the Great Tumult · 1899–1900" → "Goal: Munda self-rule and land". | Why did he rise? Outsiders, moneylenders and landlords were taking Munda land, and people were forced into unpaid labour. So in eighteen ninety-nine Birsa led the Ulgulan, the Great Tumult, demanding that the land and the forest belong to the Munda people. |
| R.4 | **S4** `[KINETIC TEXT]` `[TOP]` Timeline: "9 June 1900: dies in Ranchi jail, about 24" → "1908: Chotanagpur Tenancy Act · limits transfer of tribal land" → "15 Nov 2000: Jharkhand formed on his birthday". | He died in Ranchi jail in June nineteen hundred, at about twenty-four. But his struggle won: in nineteen oh eight the British passed the Chotanagpur Tenancy Act, which restricts the transfer of tribal land to outsiders. And Jharkhand itself was formed on his birthday, November fifteenth, two thousand. Chaala proud moment! |
| R.5 | **S5** `[KINETIC TEXT]` `[TOP]` Red PRELIMS TRAP, three cards: "Ulgulan · 1899–1900 · Mundas · Birsa Munda" · "Santhal Hul · 1855–56 · Santhals · Sidhu and Kanhu" · "Kol uprising · 1831–32 · Chotanagpur". *Voice: slower.* | Prelims trap: do not mix the tribal revolts. The Ulgulan of eighteen ninety-nine was led by Birsa Munda; the Santhal Hul of eighteen fifty-five was led by Sidhu and Kanhu; and the Kol uprising came earlier, in eighteen thirty-one. Idi gurthupettukondi! |
| R.6 | **S6** `[KINETIC TEXT]` `[FACE]` Band: "MAINS · LAND, FOREST AND SELF-RULE TODAY". *Voice: warm, thoughtful.* | His fight for land and forest lives on in today's laws, like the panchayat extension law for Scheduled Areas and the Forest Rights Act. Mains question: do these laws give tribal communities real control over their land? Mee abhiprayam comments lo rayandi, and follow for one exam trap every day! |

*Running count: about 252 words · about 1.7 min at 150 wpm.*

## Build log (15 Nov 2026)

- **Recording:** one vertical take, 534×1280. The first 0.95 s is trimmed (speech starts at 1.08 s). Runtime 1:59.6.
- **Rows:** set from the owner's pauses plus the recogniser's hints:
  - S1: 0–13.0 s
  - S2: 13.0–36.85 s
  - S3: 36.85–59.75 s
  - S4: 59.75–86.6 s
  - S5: 86.6–101.6 s
  - S6: 101.6 s to the end

  Builds are timed as fractions of each row: `scenes/short_birsa47.js`.
- **Audio:** the take came in soft (−22.5 LUFS). The chain is light, with no dereverberation and no spectral noise reduction (W46 lesson):
  1. High-pass at 80 Hz.
  2. −1.5 dB at 350 Hz.
  3. +2.5 dB at 3 kHz.
  4. +1.5 dB shelf at 9 kHz.
  5. Gentle 2.5:1 compressor.
  6. +13 dB gain.
  7. Soft expander.
  8. Limiter.

  Result: −13.1 LUFS.
- **Face:** `--vertical --polish --face-y 90 --top-y 150 --top-h 1000`. Fade-out 0.6 s.
