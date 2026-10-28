# Masterclass video renderer (voice-only, 16:9)

Turns a two-column master script into a finished video. Everything on screen is drawn by code: real satellite imagery, terrain maps, India-compliant boundaries, progressive mind maps, data charts, kinetic cards and the Decode Desk. There is no clip art, no AI imagery and no karaoke captions (`CLAUDE.md` §6).

First used for `weeks/2026-W44/sample-oleshky/`. `scenes/nsap.js` and `scenes/eci.js` build the W44 Deep Dive samples, and `scenes/grid.js` and `scenes/desk.js` build the Prelims Grid and the AP–TG Desk.

## Pipeline

1. **Assets:** `setup_assets.sh <assets_dir>` downloads the shared data into a scratch folder (not committed):
   - fonts (Google Fonts, OFL);
   - `d3.min.js`;
   - Natural Earth India-POV boundaries, rivers, lakes and admin-1 (public domain);
   - the DataMeet India outline (CC BY 4.0).

   It then builds `geo.json` with `prep_geo.py`.
2. **Topic imagery** (per video):
   - `terrain.py`: dark slate hillshade from AWS Terrain Tiles. Credit: "Elevation: Terrain Tiles (Mapzen/AWS)".
   - `sentinel.py`: cloud-free Copernicus Sentinel-2 true-colour mosaics for any bounding box and date window, from AWS Open Data (`sentinel-cogs`). Credit: "Contains modified Copernicus Sentinel data <year>".

   Both write `<name>.png` (Web Mercator) plus `<name>.json` (bounds, credit) into `<assets_dir>/terrain` or `<assets_dir>/sat`.
3. **Timeline:** `timeline.py <02-master-script.md> timeline.json [--cut hub|ext]` gives every row with a scene ID (`**S01**`…) a start, an end, sentence beats, **word times** and **holds**.
   - `--cut hub` keeps `[HUB]` + `[HUB-ONLY]` rows; `--cut ext` keeps `[HUB]` + `[EXT]` rows (the Decode Extended).
   - Without a recording, timing is estimated at 135 wpm overall (word length plus punctuation pauses).
   - Holds:
     - a 7 s silent countdown straight after each "Pause and answer" question;
     - a 3 s recap hold before "there you go", or after the recap row's first sentence;
     - `HOLD 7 s` in a visual cell (e.g. an on-screen MCQ) adds that hold after the row's last word. A hold always sits inside its own row (asserted), so a countdown can never play over the next scene.
4. **Scenes:** `scenes/<topic>.js` defines `SCENES.S01`, `SCENES.S02`… using the shared toolkit in `engine.js`.
   - **Key every build to its word:** `s.w("Kherson")` is the time that word is spoken (`s.w("left bank", 1)` for the second occurrence). The script's visual cells mark these as `→ "word"`. Missing cues are listed at boot; `--strict` stops the render.
   - `s.hold` gives the row's countdown window; `pop()` springs a stamp in; `roll()` counts a number up.
   - The renderer adds a slow push-in to every text, diagram and desk row ("living hold"), so no frame is frozen; maps run their own camera moves (`camPath` keyframes keyed to words).
   - **Maps:** `camera`, `camLerp`, `raster` (with soft-edge feathering), `countries` (India always from DataMeet), `rivers`, `pin`, `mapLabel`, `locatorInset`.
   - **Diagrams and text:** `node` / `link` (mind maps), `card`, `pill`, `arrow`, `revealWords`.
   - **Desk and chrome:** `desk` (the Decode Desk: globe, brass lamp, self-writing notebook, waveform), `lowerThird`, credits.
5. **Render:** `node render.js <assets_dir> timeline.json scenes/<topic>.js out.mp4 [--review] [--audio vo.wav] [--from s --to s]`.
   - `--review` adds a discreet caption strip for checking sync on a silent preview. **Never ship it.**
   - Use `--stills 10,40,95 <out_dir>` for QA frames.
   - For speed, render ranges in parallel and join them with `ffmpeg -f concat`.

## Glimpse kit v3 (Prelims Grid and AP–TG Desk)

`engine.js` carries a shared kit for the breadth segments. v3 (28 Oct 2026) came from the owner's second review ("only script and satellite images… I need clearer images and data as per aspirants' requirement") and three independent reviews. The v2 review measured a mean frame brightness of 42/255, 58% empty frame, grain and zoom over text, and 720p delivery.

**Every Glimpse ends on a NOTES-READY frame** an aspirant can pause and copy. It uses fixed zones at 1920×1080:

| Zone | Box | Helper | What goes there |
|---|---|---|---|
| Header | 96,52 · 1728×160 | `gHeader` | Category chip `NATIONAL 01/16`, a one-line headline (`fitFont` shrinks it to fit), and a sub-line with the date and status |
| Window | 96,232 · 1080×600 | `gWindow` | The visual: a map with labelled pins (`labelPill`), a satellite image, a chart or a table. It is never darkened; any push-in lives only here |
| Notes | 1200,232 · 624×600 | `gNotes`, `gTable` | "WRITE THIS DOWN": 3–6 rows, each landing on its cue word, or a look-alike table with the answer row highlighted |
| Trap | 96,852 · 1728×132 | `gTrap` | PRELIMS TRAP: "UPSC may write" (the myth, struck through) → ✓ the fact. Red appears nowhere else |
| Footer | 96,1004 | `finish` | Progress dots, the category sting and the credit line (it wraps to two lines so it never touches the dots) |

- **Map helpers:**
  - `windowCamera(box, w, s, e, n)` frames a lon/lat box inside the window, and `zoomProj` pushes in on the projection, so labels stay crisp.
  - `terrainMap(ctx, proj, local, {world, highlight, indiaFill, states})` draws a brighter terrain base.
  - `indiaStates` draws interior state lines.
- **Scene files** set `GK = { order, cat }` and `window.NO_PUSH = true`. `render.html` then skips the whole-frame push and the film grain, so text never zooms or crawls.
- **Revision sheets:** the Grid ends with a two-page sheet and the Desk with a one-page sheet (one line per item). Each page is also the matching PDF page.
- **Colour (v3.1, owner: "give colourful"):**
  - `glimpseBase(ctx, k)` lays two soft glows on the slate: the category colour and a cool accent.
  - `ACC` is a rotating bright accent set (never red or pink). It colours each notes row's label pill and tint, each table row's bar and first cell, and each revision-sheet row. `tint(hex, a)` adds the alpha.
  - Table headers are solid category colour, and the trap's correct fact sits on a teal panel.
  - `terrainMap` washes the sea blue, tints other countries green and India warm sand (override with `landFill` / `indiaFill`), and draws lakes and rivers in bright sky blue.
- **Text:** every label is at least 24 px. Holds come from `HOLD n s` in the script's visual cell (2 s per notes frame, 6–8 s per sheet).
- **Geometry fix:** `geo()` fills through `wound()`, which reverses any polygon d3 would read as covering the rest of the globe. Clipping can flip a few countries' winding (Russia did, and turned a BRICS map yellow).

**Imagery and data:**
- `sentinel.py` passes every new mosaic through `sat_enhance.py`: one global percentile stretch (keeps colour true), a touch of saturation and an unsharp mask. Run `sat_enhance.py <png> --sharpen-only` where the haze is the information (smog over Delhi). The original is kept as `<name>.orig.png`.
- `prep_geo.py` bundles:
  - the peninsular rivers (Godavari, Krishna, Bhima, Tungabhadra, Wainganga, Indravati, Penner, Mahanadi, Narmada, Tapi);
  - `india_states`, the interior state lines from Natural Earth, clipped inside the DataMeet outline. None are drawn for J&K, Ladakh or Arunachal Pradesh; the external boundary is always DataMeet.
  - `countries_wide`, which now runs from 90° W to 160° E, so world maps reach Brazil.
- **Encoding:** `render.js` uses x264 `slow`, CRF 16, `tune animation`, BT.709 tags and JPEG-97 frames. Deliver previews at 1080p; a 720p downscale blurs the tables.

## Exam kit v5 (animated exam format)

`exam-kit.js` is loaded by `render.js` after `engine.js`. It replaced the v3 Glimpse kit for the Grid and the Desk (owner, 28 Oct 2026: "exam oriented", "one colour per slide, purple", "I need animations", "keep my channel icon").

**Topics are data.** `exTopic({n, cat, title, short, tags, locator, slides})` registers scenes `S<n><two-digit index>`:
- **Slide types:** `title`, `news`, `steps`, `table`, `panel`, `trap`, `mcq`, `answer`, `notes`.
- **Panel kinds:** map (flat Survey-of-India shapes via `exFlat`), ladder, bars, line, bigs, scale, tiles, table, chips, or a custom `draw`.
- **MCQs:** the key is computed from the statements' truth values unless `key` is given. The answer lands on the cue `answer` (or `keyCue`).
- **Palettes:** `EP` has purple, violet, orange, blue, teal, red and yellow. Red is used only for traps.

**Animation:**
- Text rises in (`kt`).
- Boxes and chips rise and scale.
- Every slide zooms in on entry (`exEnter`).
- `exSlide` draws a living background: a drifting glow, turning dashed rings and slow bubbles.
- Maps push in, and their pins drop in.
- Headlines and topic titles reveal word by word.
- The trap's myth shakes before its strike.
- Notes lines get a highlighter sweep.
- The correct option gets a confetti burst.
- Every build still lands on its cue word.

**Brand:**
- `brand/decode-upsc-logo.png` is the channel emblem.
- `exIntro(ctx, s, chip, line)` is the opening sting: rays, glow, the emblem's spin-in and a shine sweep.
- `exLogo` puts the emblem in the corner of every slide.
- Scene files set `window.EX_LOGO = true`, which makes `brand()` skip the old pill.

**QA:**
- `--stills t1,t2,…` takes a list of times, for example each row's end time minus 0.3 s. A bare `--stills` renders nothing useful.
- Run `--strict` before every full render.

## Sound

`sound_bed.py <timeline.json> <out.wav> [--voice final_audio.wav]` synthesises the bed: a low ambient pad (ducked about 10 dB under the voice, rising in holds and under the end screen), a muted bell per countdown and a page turn for the Decode Archive. It is all own work, so there is nothing to license. Without `--voice` it writes the bed alone for silent previews.

## Syncing to a finished narration (one audio file for the whole source)

Record (or generate, for an internal sample only) every row once, in script order, as one file. Both cuts come from it.

1. `ffmpeg -i narration.mp3 -ac 1 -ar 16000 -sample_fmt s16 narration16.wav`
2. `python3 -I align_vo.py <script.md> narration16.wav align.json` force-aligns every word with pocketsphinx (offline; `pip install pocketsphinx`). Add any missing names to `OOV` in the script.
3. `python3 -I timeline.py <script.md> timeline_hub.json --cut hub --align align.json` lays each kept row on its words, and writes an `audio_plan` (which source spans to keep, where to insert silence). Repeat with `--cut ext`.
4. `python3 -I build_audio.py timeline_hub.json narration.mp3 voice_hub.wav` follows that plan, normalises loudness to about −14 LUFS, and writes `voice_hub_env.json` for the Decode Desk waveform.
5. `python3 -I sound_bed.py timeline_hub.json mix_hub.wav --voice voice_hub.wav` adds the bed.
6. Render the video-only parts with `node render.js ... --env voice_hub_env.json --strict`, join them with `ffmpeg -f concat`, then mux `mix_hub.wav`.

## Rules baked in

- **Maps:** India is always drawn from the DataMeet Survey-of-India outline. Every map shot carries its imagery and boundary credits.
- **Visual timing:** word-keyed builds and the 0.5 s cross-fade keep visuals on the words they explain (temporal contiguity); living holds keep every frame moving.
- **Text size:** body ≥ 32 px, secondary and credit lines ≥ 24 px at 1080p (`CLAUDE.md` §6.2).
- **On-screen text:** burned-in text is keywords and short claims only. The full narration ships as a separate, corrected `.srt`.

## Example (the Oleshky sample)

```bash
A=/path/to/scratch/mv                      # assets dir
export CURL_CA_BUNDLE=/root/.ccr/ca-bundle.crt GDAL_HTTP_PROXY=$HTTPS_PROXY   # behind the session proxy
bash setup_assets.sh $A
python3 -I terrain.py $A/terrain region 20 36 46 58.5 7
python3 -I terrain.py $A/terrain lowerdnipro 31.0 45.2 36.6 48.4 9
python3 -I terrain.py $A/terrain wide 15 -2 100 62 4
python3 -I sentinel.py $A/sat kakhovka_before 32.9 46.55 35.25 47.9 2023-04-20 2023-06-05 2400
python3 -I sentinel.py $A/sat kakhovka_after  32.9 46.55 35.25 47.9 2023-07-01 2023-08-31 2400
python3 -I sentinel.py $A/sat kakhovka_2026   32.9 46.55 35.25 47.9 2026-07-01 2026-10-25 2400
python3 -I sentinel.py $A/sat oleshky_before  32.3 46.4 33.55 46.85 2023-05-01 2023-06-05 2200
MAXCLOUD=60 python3 -I sentinel.py $A/sat oleshky_flood 32.3 46.4 33.55 46.85 2023-06-07 2023-06-20 2200
python3 -I sentinel.py $A/sat oleshky_2026    32.3 46.4 33.55 46.85 2026-06-01 2026-10-25 2200
S=../../weeks/2026-W44/sample-oleshky/02-master-script.md
for c in hub ext; do
  python3 -I timeline.py $S $A/tl_$c.json --cut $c
  python3 -I sound_bed.py $A/tl_$c.json $A/bed_$c.wav
  node render.js $A $A/tl_$c.json scenes/oleshky.js $A/preview_$c.mp4 --review --strict --fps 24   # then mux bed_$c.wav
done
```

## Requirements

- Python packages: `rasterio`, `numpy`, `pillow`, `shapely`, `mgrs`, `pocketsphinx` (alignment only).
- Node with Playwright (pre-installed in cloud sessions).
- ffmpeg.
