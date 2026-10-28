# W44 AP–TG Desk

This is the hub's Telugu States chapter, after Deep Dive 1. It runs:
- the Deep Dive 1 checkpoint answer;
- 7 teal Glimpses: AP BC quota · Telangana HC acting CJ · NTR Bharosa lens · KRMB/GRMB · Tummidihatti · the DM Act tiers (Arnab) · Kolleru;
- the Telugu States sheet (a 6 s copy-ready page);
- one Group-1 "how many" question.

It runs about 3:34.

**v3 (28 Oct), after the owner's "not up to the mark" review.** Every card now ends on a notes-ready frame: a labelled map, satellite image or chart, a "write this down" table with the whole look-alike set, and the trap bar. It is built from the shared Glimpse kit in `tools/masterclass-video/engine.js`.

| File | What it is |
|---|---|
| `01-research-brief.md` | Running order with exam tags, the verification log, runtime and visuals |
| `02-master-script.md` | Two-column script (435 words) |
| `02b-voiceover-text.md` | Recording file: `python3 tools/make_voiceover.py weeks/2026-W44/aptg-desk v3` |

## Review preview
`w44-desk-v3-review-1080p.mp4` was sent in chat; videos are gitignored. It is a silent review render at 1080p, timed at 135 wpm, with the sound bed only. The caption strip never ships.

To rebuild it, run from `tools/masterclass-video` with `$A` as the asset folder:

```bash
python3 -I prep_geo.py $A/ne $A/geo.json            # Natural Earth + the Survey of India outline + state lines
python3 -I terrain.py $A/terrain telugu 76 12.5 85.5 20.5 7
python3 -I terrain.py $A/terrain apcoast 79.8 14.8 85.2 19.4 8
python3 -I sentinel.py $A/sat arnab_coast 81.5 16.25 82.55 17.12 2026-01-15 2026-04-30 2600
python3 -I sentinel.py $A/sat kolleru_wide 80.85 16.2 81.8 16.95 2026-01-10 2026-04-30 2400
python3 -I timeline.py ../../weeks/2026-W44/aptg-desk/02-master-script.md $A/desk.json
python3 -I sound_bed.py $A/desk.json $A/desk_bed.wav
node render.js $A $A/desk.json scenes/desk.js $A/desk.mp4 --review --strict --fps 24   # then mux desk_bed.wav
```

## Before the edit lock
- **D.6:** the evacuation figure is out of v3. Add it back only from an APSDMA bulletin. Confirm the landfall place from the IMD bulletin (the card names none).
- **D.7:** confirm the date of AP's Kolleru proposal.
- **Every card:** fill in the document numbers (HC judgment, Law Ministry notification, NTR Bharosa GO).
- **Deep Dive 1 sample:** row A.1 there is now D.3 here; drop it from the Deep Dive 1 file when the hub is assembled.
