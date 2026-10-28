# W44 sample: the exam-format topic (Cyclone Arnab)

This is a proposed new format for each topic, built after the owner's feedback of 28 Oct ("slides really bad, need good colourful ones; keep them exam oriented and useful; use one colour per slide, purple is better; explain cyclone formation and naming").

**Running order:**
1. Topic slide
2. Why in news
3. How a cyclone forms
4. How cyclones are named
5. The IMD ladder
6. Prelims trap
7. Practice MCQ (UPSC "how many" format)
8. Answer
9. Write this down

**Design:**
- Each slide has one colour: purple for most, with orange for the news slide, blue for naming, red for the trap and yellow for the notes slide.
- Text sits on white cards.
- Maps are flat vector maps (Survey of India outline from DataMeet); there is no satellite imagery.
- A step tracker at the top of every slide shows where the viewer is in the topic.

**Runtime:** 254 words, about 2:03 with the holds. The existing Grid card runs about 30 s, so this format is about four times as long. Deciding which topics get the full format is an owner decision.

**Review preview:** `w44-arnab-purple-sample-1080p.mp4` was sent in chat (videos are gitignored).

To rebuild it, run from `tools/masterclass-video`:

```bash
python3 -I timeline.py ../../weeks/2026-W44/sample-exam-format/02-master-script.md $A/tl.json
python3 -I sound_bed.py $A/tl.json $A/bed.wav --pulse
node render.js $A $A/tl.json scenes/exam-sample.js $A/out.mp4 --review --strict --fps 24   # then mux bed.wav
```

**Facts added for the new slides:**
- **Formation conditions:** sea ≥ 26.5–27 °C; Coriolis force (none at the Equator); low vertical wind shear; a pre-existing low. Air spirals in anticlockwise in the northern hemisphere. (NCERT standard reference.)
- **Naming:** the WMO/ESCAP Panel on Tropical Cyclones has 13 member countries, each of which gave 13 names, making a list of 169 adopted in April 2020. RSMC New Delhi (IMD) assigns the next name at Cyclonic Storm strength, and names are not repeated. Sources: [WMO](https://wmo.int/node/12752); [Down To Earth](https://www.downtoearth.org.in/natural-disasters/imd-presents-new-neutral-names-for-future-cyclones-in-north-indian-ocean-70782).
