# Master Script — 2026-W46 Short: Half a billion Indians out of poverty?

**Release:** upload Wed 11 Nov · YouTube Short (vertical 9:16), about 1:15, on camera (decision 41).
**Coverage:** facts as verified in `this folder's `01-research-brief.md`.
**Version:** v1. Lively, exam-first, no "What if" opening (owner, 9 Nov); no short forms; Telugu on the key lines (decision 42).

## SHORT — Half a billion Indians out of poverty? (target 1:15)

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| R.1 | **S1** `[KINETIC TEXT]` `[FACE]` Band from frame 1: "~50 CRORE INDIANS OUT OF POVERTY?". *Voice: amazed, curious.* | Nearly fifty crore Indians, about half a billion people, have crossed a World Bank poverty line in just twelve years. Idi ela saadhyam ayyindi? Let's decode. |
| R.2 | **S2** `[DATA CHART]` `[TOP]` Two bars at final value: "2011: 27.1%" → "2023: 2.6%", titled "Extreme poverty in India ($3 a day)". Source: World Bank Poverty and Equity Brief, October 2026. | The World Bank's October Poverty and Equity Brief says extreme poverty in India, measured at three dollars a day, fell from twenty-seven point one per cent in twenty eleven to just two point six per cent in twenty twenty-three. |
| R.3 | **S3** `[KINETIC TEXT]` `[TOP]` Card: "International poverty line: $2.15 → $3.00 a day (2025) · measured in purchasing power parity". | But what is this three dollars? In twenty twenty-five the World Bank raised its international poverty line from two dollars fifteen to three dollars a day, measured in purchasing power parity, which adjusts for what money can actually buy in each country. |
| R.4 | **S4** `[DATA CHART]` `[TOP]` "$4.20 a day line: 57.7% → 16.1%" and chip "~49.6 crore crossed this line". | And at the higher line for lower-middle-income countries, four dollars twenty a day, India's poverty fell from fifty-seven point seven to sixteen point one per cent. Ante, extreme poverty almost gone, but many are still just above the line. |
| R.5 | **S5** `[KINETIC TEXT]` `[TOP]` Red PRELIMS TRAP: "World Bank = income and spending poverty" vs "Multidimensional Poverty Index = health, education, living standards · global: United Nations Development Programme and Oxford · India: NITI Aayog". *Voice: slower.* | Prelims trap: the World Bank measures poverty by income and spending; the Multidimensional Poverty Index, which counts health, education and living standards, is published globally by the United Nations Development Programme and Oxford, and in India by NITI Aayog. Idi gurthupettukondi! |
| R.6 | **S6** `[KINETIC TEXT]` `[FACE]` Band: "MAINS · DOES CROSSING A LINE END POVERTY?". *Voice: warm, thoughtful.* | Critics say part of this fall comes from new data and methods. Mains question: does crossing a poverty line really mean escaping poverty? Mee abhiprayam comments lo rayandi, and follow for one exam trap every day! |

*Running count: about 223 words · about 1.5 min at 150 wpm.*

## Build log (10 Nov 2026)

- **Recording:** one vertical take, 1:51.9, 532×1280 at about 24 fps (converted to 30 fps).
- **Alignment:** the recogniser anchored few words, so rows were set from the pauses (the S2→S3 pause at 33.2–33.7 s matches the script) plus topic hints from the recogniser ("extreme poverty… October", "measured", "sixteen point", "United Nations"):
  - S1 0–13 s
  - S2 13–33.5 s
  - S3 33.5–56 s
  - S4 56–76.5 s
  - S5 76.5–96.5 s
  - S6 96.5 s to the end
- **Audio (owner: "remove that blurred sound"):** highpass at 85 Hz → two-stage afftdn noise reduction → −3 dB at 250 Hz (mud) → +3.5 dB at 3.2 kHz (clarity) → de-esser → gentle compressor → limiter at 0.89 (the source peaked at 0 dB). The speech-to-background gap went from 24.4 to 26.4 dB.
- **Face:** `--vertical --polish --face-y 90 --top-y 150 --top-h 1000`; fade-out 0.6 s.
- **Scenes:** `tools/masterclass-video/scenes/short_poverty46.js` (fixed-time builds).
- **v2 audio (owner: "make my voice clear and sweet"):**
  - **Noise reduction:** `noisereduce` spectral noise reduction (stationary, 85%, with a noise profile taken from the quietest 20 ms windows).
  - **Tone:** highpass at 90 Hz → +1.5 dB at 190 Hz (warmth) → −3 dB at 450 Hz (boxiness) → +2.5 dB at 2.8 kHz (clarity) → +2 dB high shelf at 9 kHz (air) → stronger de-esser → soft-knee compressor → limiter.
  - **Result:** the speech-to-background gap went from 24.4 to 38.5 dB. Natural voice only; no AI voice processing.
- **v3 audio (owner: "some voice echo and disturbance"):**
  - **Cause found:** v2's compressor, and the dynamic loudnorm in build_audio and sound_bed, lifted the echo tails after each word.
  - **Measurement:** level 100–300 ms after each word end, relative to the word: original −8.3 dB; v2 −6.6 dB (worse); v3 −9.5 dB.
  - **New chain:**
    1. WPE dereverberation (`nara_wpe`; STFT 2048/512, taps 25, delay 2, about 270 ms of echo modelled);
    2. gentler noise reduction (`noisereduce`, 65%), which avoids the watery artefacts;
    3. tone EQ and de-esser;
    4. a soft downward expander between words (`agate` range 0.12, threshold 0.03, release 90 ms; soft syllables cut by more than 6 dB in only 0.7% of speech frames);
    5. no compressor;
    6. loudness set by a single fixed gain to −14 LUFS (no dynamic loudnorm);
    7. no music bed.
  - **Result:** the speech-to-background gap is far wider than the original 24 dB.
- **Default for future reels:** use this v3 chain, not v2.
