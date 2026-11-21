# 2026-W47 Weekly — November 3rd Week Current Affairs (Mon 16 – Sat 21 Nov 2026)

- **Release:** Sun 22 Nov 2026, 6 PM. **Recorded on camera** (owner, 20 Nov).
- **Files:**
  - `01-research-brief.md`: triage, dropped items, verification log.
  - `02-master-script.md`: 79 rows, about 2,414 words, with `[FACE]`/`[SPLIT]`/`[CORNER]` layout tags.
  - `reel-recording-script.md` and `Weekly-Nov-3rd-Week-Script-Decode-UPSC.pdf`: the reading script, with Telugu script and digits. 🎥 marks where to look into the lens.
  - `05-practice-mcq-mains.md` and `Practice-Set-Nov-3rd-Week-Decode-UPSC.pdf`: 13 MCQs and the Mains outline.
  - `upload-pack.md`: titles, description, pinned quiz. Chapter times are added after the edit.
  - `Thumbnail-Weekly-Nov-3rd-Week.png`: photo on the left, "DECODE UPSC with Mounika" badge.
- **To do before recording:** update story 10 with COP31's final outcome.
- **To do after recording:**
  1. Remove any app watermark (`remove_watermark.py`).
  2. Lighting grade (decision 46).
  3. Voice B chain.
  4. Whisper transcript and row timing.
  5. Scenes `weekly47.js`.
  6. `compose_face.py` (16:9).
  7. Captions, with the Telugu lines in English.
  8. Real chapter times.

## Carry-forward

- COP31 outcome: what was adopted, and India's reaction.
- India–Japan 2+2 outcomes.
- ICJ: how Myanmar complies with the 2-year report.
- The US–China–Russia nuclear-risk dialogue: first meeting.
- Quad Business Leaders' Forum, Mumbai (2027).
- Krishna water at Nagarjuna Sagar: KRMB decisions.

## Build log (21 Nov 2026)

- **Recording:**
  - **18 camera clips** (landscape 1280×534, India map behind). Two takes of the opening (v01, v04): v04 was used, as it includes the Telugu line. v03 and v05 are the same take of story 1's title; v05 was used.
  - **2 voice-over MP3s:** 001 covers Parts 1–3; 002 covers Parts 4–13.
- **Transcription:** `transcribe.py` (Whisper small).
  - Each voice-over row starts where its opening words are fuzzy-matched in the transcript, snapped to a pause (`w47_align.py`, in the scratchpad).
  - Three boundaries were set by hand: the Quad trap, the Earthshot trap and Q9.
  - She skipped the Q1 question line, so that row is a 0.35 s sliver plus the 6 s hold.
- **Assembly:**
  - The camera clips and voice-over spans are concatenated in programme order, with a 0.25 s gap after each.
  - Every part gets the voice B EQ and its own fixed gain to −14 LUFS, then a limiter.
  - The camera gets the lighting grade (decision 46).
  - Video frame counts are rounded cumulatively, so the drift is under one frame.
- **Layouts:** the camera rows are FACE or SPLIT. The voice-over rows have no camera and play over full-screen slides, so the master's CORNER tags were dropped.
- **Output:**
  - Scenes: `scenes/weekly47.js`.
  - `compose_face.py --polish` (16:9).
  - Runtime 22:12, with 13 MCQ holds of 6 s.
- **Captions:** `Weekly-Nov-3rd-Week-captions-EN.srt`. The camera lines use her own words, cleaned up; the voice-over uses the script; the Telugu is in English.
- **Slip to fix:** in story 10 she said "Developing countries … at least $300 million". It should be "developed" and "billion". The slide shows the correct figure. A one-sentence re-record has been requested.

## Voice fix, v2 (21 Nov 2026)

The owner said: "my voice is very broad and there is some disturbance also". The video is unchanged; only the audio was rebuilt, with **voice D** (decision 49):
- less low boom and fan rumble;
- pauses about 7 dB quieter (a gentle expander, not noise reduction);
- the camera mic matched to the voice-over mic.

Same timing, 21:08, −14 LUFS. Delivered as `Weekly-Nov-3rd-Week-FINAL-v2.mp4`, with a 40 s before/after sample.
