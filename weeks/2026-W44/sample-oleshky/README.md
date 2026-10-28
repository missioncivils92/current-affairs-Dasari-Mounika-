# Sample Deep Dive — The Oleshky Truce (2026-W44)

**Coverage:** Mon 26 – Sat 31 Oct 2026 (event: Tue 27 Oct 2026)
**Status:** ARCHIVED (owner decision 26, 28 Oct 2026). INTERNAL craft reference only (motion, maps, timing): never uploaded, so no upload checklist.

> **Why archived:** five exam-value reviews (`docs/research/reviews/2026-W44-exam-value/`) found the story itself low-yield, at EYS 2/10. India is a bystander, the event is episodic, and the static anchors are borrowed. The craft carries forward; the topic does not. For exam purposes this story is now a **45-second Update plus a Black Sea map card**: `02d-update-45s.md`. The Deep Dive and Extended cuts below are kept only to show how the renderer works.
**Version:** v2, applying both independent reviews (facts and teaching; motion and pacing after watching the cut).

One modular script gives two cuts (`CLAUDE.md` §2, §3.1):

| Cut | What it is | Est. runtime |
|---|---|---|
| **Hub** | Deep Dive 1 of the Sunday masterclass, with the week's cold open, the Update Desk item and the open-loop checkpoint answer | 10:01 (the Deep Dive itself 7:51, under the 8:00 cap) |
| **Decode Extended** | The standalone Wednesday Deep Dive: its own open and close, plus the `[EXT]` rows (GC IV Art 17, precedents board, Donbas/Azov traps, practice MCQ, the For/Against proposition) | 13:31 |

| File | What it is |
|---|---|
| `01-research-brief.md` | 28 sourced facts, traps, Mains matrix, verification log, the list of review fixes |
| `02-master-script.md` | Two-column master script with `[HUB]` / `[HUB-ONLY]` / `[EXT]` cut tags and word cues |
| `02b-voiceover-text.md` | Recording file: every row once, with its cut tag |
| `02c-elevenlabs-blocks.md` | Seven blocks under 4,000 characters for this sample's synthetic reference narration |
| `03-visual-handoff.md` | Motion grammar, shot list with start times for both cuts, asset and licence log |
| `02d-update-45s.md` | **What the story is actually worth:** a 45-second Update, a Statement-format trap and the Black Sea map card |

Renders (not committed; built in the session scratchpad with the commands in `tools/masterclass-video/README.md`):
- `oleshky_v2_hub_review.mp4` and `oleshky_v2_ext_review.mp4`: silent-voice review previews at 135 wpm with review captions and the sound bed.
- Once the v2 narration exists: `align_vo.py` on the combined file, then `timeline.py --cut hub|ext --align`, `build_audio.py`, `sound_bed.py --voice`, `render.js --audio`.

## Narration: one-off exception

This sample's reference narration is ElevenLabs (decision 20 in `docs/research/mentor-upgrade-decisions.md`), allowed only because it is internal and never published. Every published video uses Mounika's real voice.
