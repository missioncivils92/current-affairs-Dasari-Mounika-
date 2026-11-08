# Master Script — 2026-W45 Short: promo for the November 1st week class

**Release:** Sun 8 Nov 2026, before the 6:00 PM weekly class · YouTube Short (vertical 9:16), about 0:30, on camera (owner, 8 Nov: "for reel I'll make with video but just keep it short like promotion").
**Coverage:** a teaser for the W45 weekly: three hook questions (Agnipath, the Article 22 ruling, cancer-medicine prices), then the 6 PM call. All facts as verified in `weeks/2026-W45/weekly/01-research-brief.md`.
**Version:** v3 (livelier promo, owner 8 Nov). No short forms; Telugu on the key lines (decision 42).

## SHORT — November 1st week promo (target 0:30)

| # | Visual cue | Narration (verbatim) |
|---|---|---|
| R.1 | **S1** `[KINETIC TEXT]` `[FACE]` Band from frame 1: "AGNIPATH SCRAPPED?". *Voice: surprised, fast.* | Wait, was Agnipath scrapped? Kaadu! But something big did change. |
| R.2 | **S2** `[KINETIC TEXT]` `[TOP]` Chip: "Arrest or detention? The 24-hour clock". *Voice: curious.* | And what if the police hold you for hours, when does your twenty-four-hour clock really start? The Supreme Court just answered. |
| R.3 | **S3** `[KINETIC TEXT]` `[TOP]` Chip: "Cancer medicines: up to 70% cheaper?". | Cancer medicines could get up to seventy per cent cheaper. How? |
| R.4 | **S4** `[KINETIC TEXT]` `[TOP]` Three chips pop: "15 stories", "15 traps", "15 practice MCQs". *Voice: energetic.* | Ee okka vaaram lo fifteen stories, fifteen traps, fifteen practice questions! |
| R.5 | **S5** `[KINETIC TEXT]` `[FACE]` Band: "TONIGHT · 6 PM · FULL CLASS". *Voice: warm, big smile.* | Tonight at six, I will decode all of them, in English with Telugu on the key points. Mee seat book cheskondi, see you at six! |

*Running count: about 75 words · about 0:30 at a lively 150 wpm.*

## Build log (8 Nov 2026)

- **Recording:** one vertical take, 41.3 s, 532×1280 at about 24 fps (converted to 30 fps). No teleprompter watermark.
- **Alignment:** the take departs from the script wording, and pocketsphinx anchored only 18% of the words. So the rows were set by hand from the pauses (silencedetect, −35 dB):
  - S1, 0–7.2 s: the Agnipath hook;
  - S2–S3, 7.2–25.5 s: the two questions (arrest clock and cancer medicines), shown together on one order-free card;
  - S4, 25.5–36.2 s: 15 / 15 / 15 (the recogniser hears "fifteen" here);
  - S5, 36.2 s to the end: "Tonight · 6 PM".
- **Compose:** `--vertical --polish --face-y 40 --top-y 120 --top-h 1000`; fade-out 0.6 s.
- **Captions:** none, because no reliable transcript of the take was possible here.
- **Next take:** record at 1080p (this one is 532 px wide).
