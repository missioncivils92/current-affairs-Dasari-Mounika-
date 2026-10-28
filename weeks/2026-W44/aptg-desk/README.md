# W44 AP–TG Desk

The Telugu States Desk for W44 (Mon 26 Oct – Sat 31 Oct 2026). It covers seven topics, each in full exam format:
- AP BC quota
- Telangana HC acting CJ
- NTR Bharosa / NSAP
- KRMB · GRMB
- Tummidihatti
- the DM Act tiers (Cyclone Arnab)
- Kolleru

**v5 (28 Oct): its own video, animated exam format.** The owner asked for every topic in full exam format and answered "All those". That makes the Desk about 10 min, so it is published as its own video beside the Prelims Grid (decision 33 in `docs/research/mentor-upgrade-decisions.md`). It is no longer a 3-min chapter of the hub.

**Each topic runs through five steps**, with a step tracker at the top of the slide:

| Step | What is on screen |
|---|---|
| Title | A title card with a flat Survey-of-India locator |
| NEWS | Why in news: the headline, three fact chips and a map or chart panel |
| FACTS | The whole look-alike set as a table or steps |
| TRAP | The Prelims Trap: the myth struck through, then the fact |
| PRACTICE | A UPSC-format MCQ: a 7 s countdown, then the answer with a one-line reason |
| NOTES | "Write this down" (the PDF card) |

The video opens on the channel emblem (decisions 34–35) and ends with a one-page Telugu States sheet (8 s hold), which is also the PDF page. Each slide uses one colour, purple first; red is used only for the trap.

| File | What it is |
|---|---|
| `01-research-brief.md` | Sources, verification log and exam tags. The running order is unchanged; the v5 format is described here and in the script |
| `02-master-script.md` | Two-column script v5: 52 rows, 1,161 words, about 10 min with the holds |
| `02b-voiceover-text.md` | Recording file: `python3 tools/make_voiceover.py weeks/2026-W44/aptg-desk v5` |

## Review render
`w44-aptg-desk-exam-1080p.mp4` was sent in chat; videos are gitignored. It is a silent review render at 1080p, timed at 135 wpm, with the music bed only. Mounika's recording replaces the timing (see the tool README, "Syncing to a finished narration").

To rebuild it, run from `tools/masterclass-video` with `$A` as the asset folder:

```bash
python3 -I prep_geo.py $A/ne $A/geo.json     # Natural Earth + the Survey of India outline + state shapes
python3 -I timeline.py ../../weeks/2026-W44/aptg-desk/02-master-script.md $A/desk5.json
python3 -I sound_bed.py $A/desk5.json $A/desk5_bed.wav --pulse
node render.js $A $A/desk5.json scenes/desk.js $A/desk.mp4 --review --strict --fps 24   # then mux desk5_bed.wav
```

## Before the edit lock
- **Topic 6:** take the landfall place and time from the IMD bulletin. Add the evacuation figure only from an APSDMA bulletin.
- **Topic 7:** confirm the date of AP's Kolleru proposal.
- **Every topic:** fill in the document numbers (HC judgment, Law Ministry notification, NTR Bharosa GO).
