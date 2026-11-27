# 2026-W48 Weekly: November 4th Week (Mon 23 – Sat 28 Nov 2026)

**Release:** Sun 29 Nov 2026, 6:00 PM IST. Same format as W47: camera takes + voice-over, natural voice at normal speed (decision 50).

## Files so far (27 Nov)

- `01-research-brief.md`: triage, EYS, verification log.
- `camera-lines.md` / `Camera-Lines-Nov-4th-Week.pdf`: 17 short camera takes.
- `voice-over-script.md` / `Voice-Over-Script-Nov-4th-Week.pdf`: 12 parts, about 15 min, with an MCQ after each part (numbers as digits).

**Still to come, after the owner records:**
- the as-recorded master script (rows from Whisper);
- scenes (`tools/masterclass-video/scenes/weekly48.js`);
- the practice sheet PDF, upload pack, thumbnail and captions;
- story-tracker entries ST-033 to ST-035, plus the ST-019 update.

## Notes

- The PDF tool now embeds Noto Sans Telugu (`tools/pdf/fonts/`). Without it Chromium fell back to Unifont and broke the Telugu conjuncts. The W47 PDFs were built before this fix.
- Part 3 carries the on-air correction of the W47 COP31 finance line: developed countries, $300 billion a year by 2035.

## Visuals v2: real satellite imagery and maps (27 Nov)

The owner asked for "real photos and maps". The owner declined a network change that would have allowed Wikimedia Commons, PIB and NASA, so there are no photos. Real imagery comes from Copernicus Sentinel-2 (credit on screen: "Contains modified Copernicus Sentinel data 2026"), and India maps use the Survey of India outline (`exMap`).

**Imagery used:**
- **Topic titles:** Antalya (3), Jiuquan (5), Hormuz (6), Nitish Setu (8), Saraighat (10).
- **Full-frame satellite slides:** Hormuz (S063), Nitish Setu (S082), Saraighat (S102).
- **Satellite panels:** Jiuquan (S052), Visakhapatnam (S064), Atal Setu (S083).
- **Map:** the India–Nepal border with the five states (S023).

**Rebuild the imagery with** `python3 -I tools/masterclass-video/sentinel.py <assets>/sat <name> W S E N <from> <to> <px>`, with `CURL_CA_BUNDLE` and `GDAL_HTTP_PROXY` set:

| Name | Bounds (W S E N) | Dates | Width (px) |
|---|---|---|---|
| vizag | 83.15 17.62 83.40 17.80 | 2026-10-01 to 2026-11-25 | 1600 |
| nitish | 85.18 25.53 85.45 25.72 | 2026-10-15 to 2026-11-25 | 2000 |
| saraighat | 91.55 26.10 91.90 26.25 | 2026-10-15 to 2026-11-25 | 2000 |
| atalsetu | 72.82 18.88 73.08 19.06 | 2026-10-15 to 2026-11-25 | 2000 |
| jiuquan | 99.85 40.85 100.45 41.2 | 2026-10-01 to 2026-11-25 | 2000 |
| antalya | 30.55 36.80 30.90 36.97 | 2026-10-01 to 2026-11-25 | 2000 |
| hormuz | 55.5 25.6 57.4 27.2 | 2026-10-15 to 2026-11-25 | 2400 |

**Pin placement:** pins were placed by reading a lat/lon grid over each image. The Nitish Setu pins mark the visible bridge line; the Visakhapatnam SPR cavern is not pinned (its exact site was not verified).
