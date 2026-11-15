# 2026-W46 Weekly: November 2nd Week Current Affairs (Mon 9 – Sat 14 Nov 2026)

Release: Sun 15 Nov 2026, 6 PM. Voice only. 13 topics, each with data or a diagram and a practice MCQ, plus persons, places and awards in news, plus one Mains question. Owner (14 Nov): "use diagrams, give more good data with deep analysis".

| File | What it is |
|---|---|
| `01-research-brief.md` | Triage, verification log, sources |
| `02-master-script.md` | Two-column script (visual cues describe each chart and diagram) |
| `reel-recording-script.md`, `Weekly-Nov-2nd-Week-Script-Decode-UPSC.pdf` | Plain reading script (Telugu in Telugu script, numbers as digits) |
| `05-practice-mcq-mains.md`, `Practice-Set-Nov-2nd-Week-Decode-UPSC.pdf` | 14 MCQs with answers and reasons + the Mains outline |
| `upload-pack.md` | Titles, description with chapters, pinned quiz |
| `Thumbnail-Weekly-Nov-2nd-Week.png` | Thumbnail (owner's photo) |

Slides: `tools/masterclass-video/scenes/weekly46.js`, which has the diagram helpers (flow, ladder, mind map, dilemma, bar charts, donut, balance, timeline, tables).

**Audio:** clean with the v3 chain (see `weeks/2026-W46/short-world-bank-poverty/02-master-script.md`): dereverberation → gentle noise reduction → EQ → soft expander → fixed-gain loudness. No dynamic compression or loudnorm on the voice.

## Final video build (14–15 Nov)

- **Recording:** three MP3s (320 kbps, 23:38 in total), joined in order.
- **Sync:** `align_lm.py`, with each row boundary snapped to the owner's pauses. Final runtime 24:04, including the MCQ holds.
- **Captions:** `Weekly-Nov-2nd-Week-captions-EN.srt`, with the Telugu lines in English.
- **v1 audio (v3 voice chain):** the owner found the voice "not clear, not sharp like I recorded". The cause was the de-esser and the heavy expander in that chain, which cut 6–8 dB at 4–16 kHz.
- **v2 audio (final):** the chain is now light:
  - dereverberation, then light noise reduction;
  - EQ: high-pass at 80 Hz, −2 dB at 450 Hz, +2 dB at 3.2 kHz, +2 dB high shelf at 8 kHz;
  - a soft expander;
  - fixed gain to −14 LUFS;
  - AAC at 320 kbps.

  There is **no de-esser**. The treble ends up about 2–3 dB above the raw recording.
- **Rule for the owner's recordings:** her recordings are already clean (noise floor about −60 dB), so keep the processing light.
- **v3 "sharp and sweet" (owner request, 15 Nov):** these steps run after the dereverberation and light noise reduction:

  1. High-pass at 85 Hz.
  2. Warmth: +1.5 dB at 180 Hz.
  3. Boxiness cut: −3 dB at 380 Hz, −1 dB at 900 Hz.
  4. Presence: +3.5 dB at 3.5 kHz.
  5. Harshness dip: −1.5 dB at 6.8 kHz.
  6. Air: +2 dB shelf at 10 kHz.
  7. Light exciter: `aexciter` amount 0.5, from 5 kHz.
  8. Gentle compressor: 2:1, slow.
  9. Soft expander.
  10. Fixed gain to −14 LUFS.
  11. AAC at 320 kbps.

  Against the raw recording, presence is about +4 dB and air about +6 dB, and the noise floor stays at about −62 dB. This is the default for the owner's voice from now on.
