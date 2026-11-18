# Master Script — 2026-W47 Short: Earthshot 2026: The Five Winners and What They Did

**Week covered:** Mon 16 – Sat 21 Nov 2026.
**Release:** Reel 2 of 2 · the day after Reel 1 · YouTube Short (vertical 9:16), on camera (decision 41).
**Coverage:** facts as verified in this folder's `01-research-brief.md`.
**Version:** v1. Lively, exam-first, no "What if" opening (owner, 9 Nov); no short forms in narration; Telugu on the key lines (decision 42).

## SHORT — Earthshot 2026: The Five Winners and What They Did

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| R.1 | **S1** `[KINETIC TEXT]` `[FACE]` Band from frame 1: "EARTHSHOT 2026 · 5 WINNERS · WHAT THEY DID". *Voice: bright, curious.* | One country, one tiny island, one citizens' campaign, one energy giant and one Indian company: these are the five winners of the Earthshot Prize twenty twenty-six. Vaallu em chesaru? For each one: who, what they did, and how it helps. Let's decode. |
| R.2 | **S2** `[GIS MAP]` `[TOP]` Survey of India–compliant map: Bhutan with its rivers flowing south into India. Card "1 · BHUTAN · Protect and Restore Nature · first country ever to win · Restore Bhutan: 50,000 hectares · ~2 million tonnes of carbon dioxide · water for 1.6 billion people". | First, Bhutan won Protect and Restore Nature, and it is the first country ever to win this prize. Its Restore Bhutan plan will revive fifty thousand hectares of damaged Himalayan land, saving nearly two million tonnes of carbon dioxide and protecting water for about one point six billion people downstream, including us in India. |
| R.3 | **S3** `[KINETIC TEXT]` `[TOP]` Card "2 · MAHINDRA LAST MILE MOBILITY · India · Clean Our Air · affordable electric autos · 4 lakh+ electric vehicles". | Second, our own Mahindra Last Mile Mobility won Clean Our Air. It made electric autos cheap to buy and to run for ordinary drivers, and it has put more than four lakh electric vehicles on Indian roads, cutting smoke in our crowded cities. |
| R.4 | **S4** `[KINETIC TEXT]` `[TOP]` Card "3 · NIUE · Revive Our Oceans · about 1,700 people · protects an ocean area larger than the United Kingdom". | Third, Niue won Revive Our Oceans. This Pacific island has only about seventeen hundred people, yet its Ocean Wide Trust, with a new way of investing in conservation, protects an ocean area larger than the United Kingdom. |
| R.5 | **S5** `[KINETIC TEXT]` `[TOP]` Card "4 · PFAS-FREE FRANCE · Build a Waste-Free World"; explainer chip "PFAS = forever chemicals · non-stick pans · waterproof clothes · food packaging"; chip "1.4 lakh+ citizens · 2025 French law". | Fourth, PFAS-Free France won Build a Waste-Free World. PFAS are the forever chemicals found in non-stick pans, waterproof clothes and food packaging, and they barely break down in nature or in our bodies. Backed by more than one lakh forty thousand citizens, this campaign helped France pass a twenty twenty-five law to phase out many of them. |
| R.6 | **S6** `[KINETIC TEXT]` `[TOP]` Card "5 · ØRSTED · Denmark · Fix Our Climate"; arrow "oil, gas and coal → offshore wind"; chip "Change is possible". | Fifth, Denmark's Ørsted won Fix Our Climate. It was once an oil, gas and coal company; it quit oil and gas and became an offshore-wind giant, proving that even an energy company can change. |
| R.7 | **S7** `[KINETIC TEXT]` `[TOP]` Red PRELIMS TRAP: "Some forever chemicals → Stockholm Convention (persistent organic pollutants) · India is a party" · "Rotterdam = consent before trading hazardous chemicals" · "Basel = hazardous waste across borders". *Voice: slower.* | Prelims trap, from those forever chemicals: some of them are already restricted under the Stockholm Convention on persistent organic pollutants, which India has joined. Do not confuse it with the Rotterdam Convention, on consent before trading hazardous chemicals, or the Basel Convention, on hazardous waste crossing borders. Idi gurthupettukondi! |
| R.8 | **S8** `[KINETIC TEXT]` `[FACE]` Band: "MAINS · CAN INDIA'S POWER COMPANIES DO AN ØRSTED?". *Voice: warm, thoughtful.* | Mains question: can India's coal-heavy power companies make a shift like Ørsted? Mee abhiprayam comments lo rayandi, and follow for one exam trap every day! |

*Running count: about 341 words · about 2.4 min at 140 wpm.*

## Build log (18 Nov 2026)

- **Recording:** one vertical take, 720×1280, 2:31, recorded in the Teleprompter app. The app's "Made with Teleprompter.com" badge hops corners every 10 s.
  - **Removal:** `tools/masterclass-video/remove_watermark.py`. Each badge position is template-matched (16 segments, match ≥ 0.94) and replaced with a clean plate of the wall, blended with a feathered mask.
  - **Cut:** at 149.5 s, after "Thank you".
- **Rows:** from a Whisper transcript (`transcribe.py`) and the pauses. She followed this script closely.
  - S1: 0
  - S2 (Bhutan): 16.6
  - S3 (Mahindra): 42.5
  - S4 (Niue): 59.6
  - S5 (PFAS-Free France): 76.6
  - S6 (Ørsted): 100.3
  - S7 (trap): 114.3
  - S8 (Mains): 137.0 to 149.5
- **Scenes:** `scenes/short_earth47c.js`. Each winner gets a WHO → WHAT THEY DID → HOW IT HELPS card.
- **Audio:** the app recorded softly (−30.2 LUFS).
  - Chain: voice B EQ, then a gentle 2:1 compressor, +17.9 dB fixed gain, a soft gate and a limiter.
  - Result: −14.4 LUFS. Pauses sit about 35 dB below speech.
  - No dereverberation or spectral noise reduction.
- **Face:** `--vertical --polish --face-y 90 --top-y 150 --top-h 1000`.
- **Cover:** `Cover-Earthshot-Reel-2.png`.
- **Captions:** `Reel-2-Earthshot-captions-EN.srt`, with the Telugu lines in English.
