# Short video builder (voice-only, 9:16)

> **Status (Oct 2026):** the v3 look (icon scenes, full script on screen) breaks `CLAUDE.md` §6.2: no clip art and no karaoke or full-script captions. Before the next Short is rendered, rebuild the scenes as GIS-map, mind-map, data-chart and kinetic-text cards with keyword-only burned-in text (at most 8 words). Ship full captions as a separate corrected `.srt`.

The W43 Russia–Ukraine Short was built with this pipeline:

1. `align.py`: forced-aligns the script to the voiceover with pocketsphinx (PyPI wheel; it bundles its own English model).
2. `build_timeline.py`: trims pauses longer than 0.5 s, cleans the audio (high-pass, light compression, −14 LUFS) and maps word times.
3. `make_timeline.py`: defines the cards (stat, title, timeline, duo, trap, quote, end), the captions and the waveform envelope.
4. `render.html` + `render.js`: Playwright renders each frame in the channel colours and pipes them to ffmpeg (H.264 + AAC). `render_range.js` renders a time range, e.g. an end card.

Paths in the scripts point at the session scratchpad. Adjust them per week. Videos (`*.mp4`) are not committed.
