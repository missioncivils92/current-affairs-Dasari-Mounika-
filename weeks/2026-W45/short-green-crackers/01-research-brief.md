# Research Brief — 2026-W45 Short: Green crackers

**Week:** order of Mon 2 Nov 2026 · Short for Tue 3 Nov 2026 (owner's pick, sent as a photo of The Hindu's front page, 3 Nov, Hyderabad edition).

**EYS 8 (P3·M2·I2·D1·S0).**
- **P3:** CSIR-NEERI; the SWAS/STAR/SAFAL types; barium nitrate banned; PESO (DPIIT) under the Explosives Act, 1884; the 300 m no-cracker radius.
- **M2:** a recurring Mains theme on environment versus religious practice under Articles 21 and 25. A PYQ precedent exists (see the PYQ note below) but is not yet verified on upsc.gov.in.
- **I2:** the Supreme Court is the actor.
- **D1:** repeats every Deepavali; the matter is listed again for 16 Dec 2026.
- **S0:** Delhi-NCR only.

## Verification log

| Fact | Source | Status |
|---|---|---|
| SC (Justices M.M. Sundresh and Prasanna B. Varale), order of Mon 2 Nov 2026 (a 23-page order): certified green crackers allowed in Delhi-NCR on 7 and 8 Nov, 6–7 a.m. and 8–10 p.m. | The Hindu, 3 Nov 2026, p.1 (owner's photo); ANI (2 Nov); Hans India; Daily Jagran | Verified |
| No bursting within 300 m of hospitals, nursing homes, primary and district health centres, old-age homes, educational institutions and notified silence zones; no manufacture or sale of joined crackers (series, garlands) | The Hindu, 3 Nov 2026 | Verified |
| The Court called bursting a "religious practice" meant to celebrate Deepavali, but said environmental degradation "defeats the very purpose of the festivities" | The Hindu, 3 Nov 2026 (quoted) | Verified |
| Sales 4–6 Nov at designated sites, no online sales; makers need CSIR-NEERI certification and PESO licences; the full ban returns on 9 Nov; next hearing 16 Dec 2026 | ANI; Hans India | Reported |
| Green crackers designed by CSIR-NEERI (Nagpur) in 2018–19; types SWAS (Safe Water Releaser), STAR (Safe Thermite Cracker), SAFAL (Safe Minimal Aluminium); no barium nitrate; green logo and QR code against fakes | Drishti (Oct 2022); Hindustan Times (Oct 2019) | Verified (standard) |
| Emission cut "about 30%": sources vary (SO2/NOx at least 30% for SWAS and STAR; PM at least 35% for SAFAL; 30–40% PM in the standard) | HT; NEERI as summarised | On air: "about thirty per cent"; caution kept in the PDF |
| PESO: Petroleum and Explosives Safety Organisation, under DPIIT, Ministry of Commerce and Industry; licenses under the Explosives Act, 1884 / Explosives Rules, 2008 | PESO; standard | Verified |
| CSIR is under the Ministry of Science and Technology (DSIR) | Standard | Verified |
| *Arjun Gopal v. Union of India* (2018): only green or reduced-emission crackers, with time windows; Art 25 is subject to health, and Art 21 (health, clean air) is harmonised with it | LiveLaw analysis; secondary | Verified (as summarised); not named on air |

**PYQ note:** "Does the right to a clean environment entail legal regulations on burning crackers during Diwali? Discuss in the light of Article 21 of Indian Constitution and Judgement(s) of the apex court in this regard" is widely reported as UPSC Mains 2015 GS-II. It is tagged **[PYQ-VERIFY]** because upsc.gov.in could not be checked, so it is **not on air** (CLAUDE.md §3.6). It is a candidate for the PDF once verified.

**Newspaper photo:** not used in the video (§6.2, §6.4, decision 40). The facts are recreated as our own clipping, credited "Reported by: The Hindu · ANI · Hans India".

**Creative idea:** a "300-metre ring" that draws itself around a protected centre, so the radius rule becomes a picture. The NEERI → PESO chain is shown as two linked boxes ("designs" versus "licenses"), so the trap is visible as a pipeline.

## Sources
- The Hindu, 3 Nov 2026, Hyderabad edition, p.1: "SC permits green crackers for two days in Delhi-NCR" (Krishnadas Rajagopal), from the owner's photo
- [ANI: SC allows green crackers in Delhi-NCR for two days](https://www.aninews.in/news/national/general-news/sc-allows-green-crackers-in-delhi-ncr-for-two-days-ahead-of-diwali20261102165055/)
- [Hans India: complete ban returns from November 9](https://www.thehansindia.com/news/national/supreme-court-allows-green-crackers-in-delhi-ncr-for-two-days-complete-ban-returns-from-november-9-1138561)
- [Daily Jagran: time limits](https://www.thedailyjagran.com/india/news/supreme-court-allows-green-crackers-in-delhi-ncr-on-november-7-8-for-diwali-sets-time-limits-10334855)
- [Drishti: Green crackers](https://www.drishtiias.com/daily-updates/daily-news-analysis/green-crackers-1/print_manually)
- [LiveLaw: Courts, crackers and clean air](https://livelaw.in/articles/supreme-court-order-firecrackers-ban-environmental-jurisprudence-and-delhi-pollution-analysis-308908)

## v2 (owner: "no short forms; add institute images near the institutions")

- **Short forms:** every short form is expanded in the narration and on screen: National Environmental Engineering Research Institute; Council of Scientific and Industrial Research; Petroleum and Explosives Safety Organisation; Department for Promotion of Industry and Internal Trade; National Capital Region; Quick Response code; Asian News International. The only exceptions are the cracker names SWAS, STAR and SAFAL, which are names (each is followed by its full form) and could be asked as names.
- **Institute photos:** frames beside both institutions (scene S4) fill automatically from `<assets>/photos/inst_neeri.png` and `inst_peso.png`, each with a `.json` `{credit}`, through a new `photos/` folder in `render.js`. No photo was fetched: commons.wikimedia.org, upload.wikimedia.org, neeri.res.in, peso.gov.in, csir.res.in and pib.gov.in are blocked from this session. Only licence-checked photos may be used (§6.4): Wikimedia Commons files with their stated licence, or PIB/government photos. Official logos and emblems are not used.

## Build log (3 Nov 2026)

- **Recording:** 5 vertical clips (534×1280), joined in order, 1:51 in total. The rows matched the clips:
  - clip 1: R.1 and R.2;
  - clips 2 and 3: R.3;
  - clip 4: R.4;
  - clip 5: R.5 and R.6.
- **Alignment:** `align_lm.py` anchored 29% of the words. Row starts land on the clip boundaries; word cues inside rows are interpolated. The new `ALIGN_DUMP` option writes the recognised words, to check which clip holds which line.
- **Ending:** her hand reaches for the phone at about 1:50, just as she finishes. The video holds the last clean frame (109.9 s) under the final half-second of voice, then fades out over 0.4 s.
- **Camera:** her face is large and mid-frame, so the TOP panel shows a 1000-px-tall crop scaled into the 760-px panel and centred on a blurred fill (`compose_face.py --top-y 220 --top-h 1000`). FACE rows use `--face-y 120`. The clean look (`--clean`) is on.
- **Final:** 1:51 with music ducked under the voice. English captions are in `Reel-Green-Crackers-captions-EN.srt`, with the three Telugu lines given in English.
- **Institute photos:** still empty (sources blocked); the frames stay hidden without them.
