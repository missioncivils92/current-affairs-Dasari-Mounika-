# W44 Prelims Grid

This is the hub's Prelims Grid for W44: 16 Glimpses (5 National, 7 International, 4 Misc), each giving what happened, the static fact and one trap. It sits after the cold open and starts by 2:30.

| File | What it is |
|---|---|
| `01-research-brief.md` | Selection with reasons, items dropped (DAC, crude shock, UNSG poll, DPDP), the cold-open pre-question, the verification log and the runtime note |
| `02-master-script.md` | Two-column script: 1,075 words, about 7:33 |
| `02b-voiceover-text.md` | Recording file: `python3 tools/make_voiceover.py weeks/2026-W44/prelims-grid v1` |

## Review preview
`preview/w44-prelims-grid-review-720p.mp4` was sent in chat; videos are gitignored, so it is not in the repo. It is a silent review render with the sound bed only, about 7:33, timed at 135 wpm. The yellow caption strip never ships.

To rebuild it, run from `tools/masterclass-video`, with terrain tiles `apcoast` and `northindia` fetched by `terrain.py`:

```bash
python3 -I terrain.py $A/terrain apcoast 79.8 14.8 85.2 19.4 8
python3 -I terrain.py $A/terrain northindia 72 22 86 33 6
python3 -I timeline.py ../../weeks/2026-W44/prelims-grid/02-master-script.md $A/grid.json --cut hub
python3 -I sound_bed.py $A/grid.json $A/grid_bed.wav
node render.js $A $A/grid.json scenes/grid.js $A/grid.mp4 --review --strict --fps 24   # then mux grid_bed.wav
```

## Before the Saturday edit lock
- **M2 (GI):** confirm the grant in the GI Journal, or drop the item (the Grid stays at the 15-item floor).
- **I5 (COP17):** the conference closes on 30 Oct; add one outcome line if a decision is adopted.
- **N1 (Arnab):** take the landfall time from the IMD bulletin.
