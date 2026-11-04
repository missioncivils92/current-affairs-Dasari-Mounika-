# Nyaya Patashala: Environmental Laws, Decoded

**Course:** LL.B (3YDC), Semester I, Paper V: Environmental Laws (Kakatiya University syllabus, all 5 units)
**Format:** 65-slide animated PowerPoint (16:9), plain white design, for a voice-over YouTube lesson

## Files
| File | Use |
|---|---|
| `Environmental-Laws-Decoded_AUTO-animations.pptx` | Each slide builds by itself after it opens. Best for screen-recording or *File → Export → Create a Video*. |
| `Environmental-Laws-Decoded_CLICK-animations.pptx` | Each card, row or step appears on the next click. Best for *Record Slide Show* while narrating. |
| `build_deck.js` | Generator (pptxgenjs). Edit the content here, not in the .pptx. |
| `animate.py` | Adds slide transitions and entrance animations (fade, wipe, float-up, zoom). |
| `assets/` | Nyaya Patashala logo and the circular emblem cut from it. |

**Speaker notes** on every slide hold the full voice-over script, with voice directions and pronunciation markers.

## Slide map
- 1–3 Opening (title, paper at a glance, five-unit roadmap)
- Units I–V each open with: **(1) the official syllabus, word for word** (Kakatiya University), then **(2) the unit's important exam questions** (essays and short notes), then the teaching slides
- 11 "Exam question" slides sit between the teaching slides: question, pause to plan, then a numbered answer outline
- 64–65 Revision years and closing

The questions are model questions written for this syllabus, not verified university previous-year papers.

`Environmental-Laws-Narration-Script.pdf` holds the narration only (built with `make_script_pdf.py`).

## Rebuild
```bash
NODE_PATH=<node_modules with pptxgenjs react react-dom react-icons sharp> PPTX_SKILL_DIR=<pptx skill dir> node build_deck.js base.pptx
python3 animate.py base.pptx Environmental-Laws-Decoded_AUTO-animations.pptx auto
python3 animate.py base.pptx Environmental-Laws-Decoded_CLICK-animations.pptx click
```

## Before publishing: verify
- IPC→BNS and CrPC→BNSS section numbers (slide 29): check against the current bare Acts.
- Penalty changes: Jan Vishwas Act 2023 (Air Act, EPA) and Water Amendment Act 2024. Check the current text if you quote amounts.
