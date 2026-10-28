# Masterclass video renderer (voice-only, 16:9)

Turns a two-column master script into a finished video. Everything on screen is drawn by code: real satellite imagery, terrain maps, India-compliant boundaries, progressive mind maps, data charts, kinetic cards and the Decode Desk. There is no clip art, no AI imagery and no karaoke captions (`CLAUDE.md` §6).

First used for `weeks/2026-W44/sample-oleshky/`; `scenes/nsap.js` builds `weeks/2026-W44/sample-nsap/`.

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

## Glimpse kit (Prelims Grid and AP–TG Desk)

`engine.js` carries a shared kit for the breadth segments. It was rebuilt in W44 after the owner's review of the first Grid preview: "looks like slides", "looks cheap", "too dense". Every Glimpse is three beats:

1. **Hero:** a full-frame visual under a short headline (`headline`). Use, in this order of preference:
   - Copernicus Sentinel-2 imagery (`satHero`);
   - a terrain map with vector rivers (`terrainMap`);
   - a data graphic on a soft category glow (`typeHero`).
2. **Facts:** one or two big facts slide in on their cue words (`facts`).
3. **Trap:** a ✗ wrong / ✓ right split lands on "Prelims Trap" and holds to the end of the item (`trap`).

`finish` adds the progress strip, the category sting and the credit line. A scene file sets `GK = { order, cat }` (`scenes/grid.js`, `scenes/desk.js`). Keep on-screen text to a headline, two facts and one trap line per item.

`prep_geo.py` also bundles the peninsular rivers (Godavari, Krishna, Bhima, Tungabhadra, Wainganga, Indravati, Penner, Mahanadi, Narmada, Tapi) from Natural Earth, so the Telugu States maps can draw them.

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
