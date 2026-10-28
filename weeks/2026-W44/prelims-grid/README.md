# W44 Prelims Grid

This is the hub's Prelims Grid for W44: 16 Glimpses (5 National, 7 International, 4 Misc), each giving what happened, the static fact and one trap. It sits after the cold open and starts by 2:30.

**v3 (28 Oct), after the owner's "not up to the mark" review and three independent reviews.** Every Glimpse now ends on a notes-ready frame that holds still for 2 s:
- a labelled visual on the left: a map with pins and state lines, a satellite image, or a chart;
- a "write this down" table on the right, with the whole look-alike set (IMD cyclone classes, FERA vs FEMA, the AQI and GRAP ladder, CVC/Lokpal/CBI/CAG, RFMOs, BRICS joining years, the CBD family, report publishers, climate funds, Ramsar, GI);
- the PRELIMS TRAP bar.

The Grid ends with a two-page **revision sheet** (8 s each), which is also page 1 of the PDF.

| File | What it is |
|---|---|
| `01-research-brief.md` | Selection with reasons, items dropped (DAC, crude shock, UNSG poll, DPDP), the cold-open pre-question, the verification log and the runtime note |
| `02-master-script.md` | Two-column script: 1,131 words, about 8:46 with the holds |
| `02b-voiceover-text.md` | Recording file: `python3 tools/make_voiceover.py weeks/2026-W44/prelims-grid v3` |

## Review preview
`w44-grid-v3-review-1080p.mp4` was sent in chat. Videos are gitignored, so it is not in the repo. It is a silent review render at 1080p with the sound bed only, about 8:46, timed at 135 wpm. The yellow caption strip never ships.

To rebuild it, run from `tools/masterclass-video` with `$A` as the asset folder:

```bash
python3 -I prep_geo.py $A/ne $A/geo.json
python3 -I terrain.py $A/terrain apcoast 79.8 14.8 85.2 19.4 8
python3 -I terrain.py $A/terrain northindia 72 22 86 33 6
python3 -I terrain.py $A/terrain westindia 67.5 11.2 84 27 6
python3 -I terrain.py $A/terrain indianocean 0 -55 135 40 4
python3 -I terrain.py $A/terrain wide 0 -21 112 66 4
python3 -I terrain.py $A/terrain world -180 -66 180 79 3
python3 -I sentinel.py $A/sat arnab_coast 81.5 16.25 82.55 17.12 2026-01-15 2026-04-30 2600
python3 -I timeline.py ../../weeks/2026-W44/prelims-grid/02-master-script.md $A/grid.json
python3 -I sound_bed.py $A/grid.json $A/grid_bed.wav
node render.js $A $A/grid.json scenes/grid.js $A/grid.mp4 --review --strict --fps 24   # then mux grid_bed.wav
```

## Before the Saturday edit lock
- **M2 (GI):** confirm the grant in the GI Journal, or drop the item (the Grid stays at the 15-item floor).
- **I5 (COP17):** the conference closes on 30 Oct; add one outcome line if a decision is adopted.
- **N1 (Arnab):** take the landfall time from the IMD bulletin.
