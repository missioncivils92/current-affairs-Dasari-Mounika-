# W44 AP–TG Desk

This is the hub's Telugu States chapter, after Deep Dive 1. It runs: the Deep Dive 1 checkpoint answer, then 7 teal Glimpses (AP BC quota · Telangana HC acting CJ · NTR Bharosa lens · KRMB/GRMB · Tummidihatti · Arnab in AP · Kolleru), then one Group-1 "how many" question. About 3:02.

| File | What it is |
|---|---|
| `01-research-brief.md` | Running order with exam tags, the verification log, runtime and visuals |
| `02-master-script.md` | Two-column script (408 words) |
| `02b-voiceover-text.md` | Recording file: `python3 tools/make_voiceover.py weeks/2026-W44/aptg-desk v1` |

## Review preview
`preview/w44-aptg-desk-review-720p.mp4` was sent in chat; videos are gitignored. It is a silent review render, timed at 135 wpm, and the caption strip never ships.

To rebuild it, run from `tools/masterclass-video`. It needs terrain `telugu` and `apcoast`, and Sentinel-2 `godavari_coast` and `kolleru`:

```bash
python3 -I terrain.py $A/terrain telugu 76 12.5 85.5 20.5 7
python3 -I sentinel.py $A/sat godavari_coast 81.9 16.5 82.5 17.15 2026-01-15 2026-04-30 2200
python3 -I sentinel.py $A/sat kolleru 81.05 16.45 81.45 16.78 2026-01-10 2026-04-30 2000
python3 -I timeline.py ../../weeks/2026-W44/aptg-desk/02-master-script.md $A/desk.json --cut hub
node render.js $A $A/desk.json scenes/desk.js $A/desk.mp4 --review --strict --fps 24
```

## Before the edit lock
- **D.6:** take the APSDMA evacuation figure and confirm the landfall place from the IMD bulletin (Kakinada vs Kalingapatnam).
- **D.7:** confirm the date of AP's Kolleru proposal.
- **Every card:** fill in the document numbers (HC judgment, Law Ministry notification, NTR Bharosa GO).
- **Deep Dive 1 sample:** row A.1 there is now D.3 here; drop it from the Deep Dive 1 file when the hub is assembled.
