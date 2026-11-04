# Nyaya Patashala: Environmental Laws, Decoded

**Course:** LL.B (3YDC), Semester I, Paper V: Environmental Laws (Kakatiya University syllabus, all 5 units)
**Format:** 61-slide animated PowerPoint (16:9), plain white design, for a voice-over YouTube lesson

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
- 4–11 Unit I · 12–23 Unit II · 24–35 Unit III · 36–45 Unit IV · 46–58 Unit V (forests, wildlife, biodiversity, NGT appraisal)
- 59–61 Revision years, more practice questions, closing

Each unit opens with a **topics slide** listing every syllabus topic for that unit.
**11 semester-exam questions** (essay and short-note) are spread through the deck. Each shows the question, a pause to plan, then a numbered "how to write the answer" outline. These are model questions written for this syllabus, not verified university previous-year papers.

## Rebuild
```bash
NODE_PATH=<node_modules with pptxgenjs react react-dom react-icons sharp> PPTX_SKILL_DIR=<pptx skill dir> node build_deck.js base.pptx
python3 animate.py base.pptx Environmental-Laws-Decoded_AUTO-animations.pptx auto
python3 animate.py base.pptx Environmental-Laws-Decoded_CLICK-animations.pptx click
```

## Before publishing: verify
- IPC→BNS and CrPC→BNSS section numbers (slide 29): check against the current bare Acts.
- Penalty changes: Jan Vishwas Act 2023 (Air Act, EPA) and Water Amendment Act 2024. Check the current text if you quote amounts.
