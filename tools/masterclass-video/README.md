# Masterclass video renderer (voice-only, 16:9)

Turns a two-column master script into a finished video. Everything on screen is drawn by code: real satellite imagery, terrain maps, India-compliant boundaries, progressive mind maps, data charts, kinetic cards and the Decode Desk. There is no clip art, no AI imagery and no karaoke captions (`CLAUDE.md` §6).

First used for `weeks/2026-W44/sample-oleshky/`.

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
3. **Timeline:** `timeline.py <02-master-script.md> timeline.json` gives every row with a scene ID (`**S01**`…) a start, an end and sentence "beats".
   - Without a voiceover, timing is estimated at 135 wpm, with pauses for "...", countdown cards and recap holds.
   - With a voiceover, add `--vo <dir> --prefix <name>`, using one WAV per segment named as in `02b-voiceover-text.md`. Rows are then laid out inside each real recording.
4. **Scenes:** `scenes/<topic>.js` defines `SCENES.S01`, `SCENES.S02`… using the shared toolkit in `engine.js`:
   - **Maps:** `camera`, `camLerp`, `raster` (with soft-edge feathering), `countries` (India always from DataMeet), `rivers`, `pin`, `mapLabel`, `locatorInset`.
   - **Diagrams and text:** `node` / `link` (mind maps), `card`, `pill`, `arrow`, `revealWords`.
   - **Desk and chrome:** `desk` (the Decode Desk: globe, brass lamp, self-writing notebook, waveform), `lowerThird`, credits.
5. **Render:** `node render.js <assets_dir> timeline.json scenes/<topic>.js out.mp4 [--review] [--audio vo.wav] [--from s --to s]`.
   - `--review` adds a discreet caption strip for checking sync on a silent preview. **Never ship it.**
   - Use `--stills 10,40,95 <out_dir>` for QA frames.
   - For speed, render ranges in parallel and join them with `ffmpeg -f concat`.

## Rules baked in

- **Maps:** India is always drawn from the DataMeet Survey-of-India outline. Every map shot carries its imagery and boundary credits.
- **Visual timing:** the 0.5 s cross-fade and the beat-driven builds keep visuals on the words they explain (temporal contiguity).
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
python3 -I timeline.py ../../weeks/2026-W44/sample-oleshky/02-master-script.md $A/timeline.json
node render.js $A $A/timeline.json scenes/oleshky.js $A/preview.mp4 --review
# after Mounika records (WAVs named sample-oleshky_VO_open.wav, _updates, _D1, _verdict):
python3 -I timeline.py ../../weeks/2026-W44/sample-oleshky/02-master-script.md $A/timeline.json --vo <wav_dir>
ffmpeg -i "concat:..." vo_full.wav        # join the segment WAVs in order
node render.js $A $A/timeline.json scenes/oleshky.js $A/final.mp4 --audio vo_full.wav
```

## Requirements

- Python packages: `rasterio`, `numpy`, `pillow`, `shapely`, `mgrs`.
- Node with Playwright (pre-installed in cloud sessions).
- ffmpeg.
