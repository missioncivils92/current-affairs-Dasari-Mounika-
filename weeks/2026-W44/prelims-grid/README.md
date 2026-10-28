# W44 Prelims Grid

The Prelims Grid for W44 (Mon 26 Oct – Sat 31 Oct 2026). It covers 16 topics, 5 National, 7 International and 4 Misc, each in full exam format.

**v5 (28 Oct): its own video, animated exam format.** The owner's feedback was "keep them exam oriented and useful", "one colour per slide, purple is more good", "I need animations" and "keep my channel icon". The owner then answered "All those" to the runtime question. So every topic gets the full treatment, and the Grid runs about 24 min as its own video (decisions 33–35 in `docs/research/mentor-upgrade-decisions.md`).

**Each topic runs through these steps**, with a step tracker at the top of the slide:

| Step | What is on screen |
|---|---|
| Title | A title card with a flat locator map |
| NEWS | Why in news: the headline, fact chips and a map or chart |
| FORMATION / NAMING | Cyclone Arnab only: how a cyclone forms and how cyclones are named |
| FACTS | The look-alike set: a table, steps or a panel |
| TRAP | The Prelims Trap: the myth struck through, then the fact (red is used only here) |
| PRACTICE | A UPSC-format MCQ: a 7 s countdown, then the answer with a one-line reason. The keys vary across the 16 topics |
| NOTES | "Write this down" (the PDF card) |

The video opens on the channel emblem and a board of the 16 topics. It ends with a two-page revision sheet (S98, S99), which is also page 1 of the PDF.

| File | What it is |
|---|---|
| `01-research-brief.md` | Selection with reasons, items dropped, the verification log and exam tags |
| `02-master-script.md` | Two-column script v7 (opening question, connected narration, the examiner's three tricks; decision 36): 120 rows, 3,657 words, about 30 min with the holds |
| `02b-voiceover-text.md` | Recording file: `python3 tools/make_voiceover.py weeks/2026-W44/prelims-grid v7` |

## Review render
`w44-prelims-grid-exam-1080p.mp4` was sent in chat; videos are gitignored. It is a silent review render at 1080p, timed at 135 wpm, with the music bed only.

To rebuild it, run from `tools/masterclass-video` with `$A` as the asset folder:

```bash
python3 -I prep_geo.py $A/ne $A/geo.json
python3 -I timeline.py ../../weeks/2026-W44/prelims-grid/02-master-script.md $A/grid5.json
python3 -I sound_bed.py $A/grid5.json $A/grid5_bed.wav --pulse
node render.js $A $A/grid5.json scenes/grid.js $A/grid.mp4 --review --strict --fps 24   # then mux grid5_bed.wav
```

## Before the Saturday edit lock
- **GI topic:** confirm the grant in the GI Journal, or drop the topic.
- **COP17:** the conference closes on 30 Oct; add one outcome line if a decision is adopted.
- **Cyclone Arnab:** take the landfall time from the IMD bulletin.
