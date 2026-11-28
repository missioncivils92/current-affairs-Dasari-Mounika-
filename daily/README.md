# Daily flash cards

Owner request (28 Nov 2026): post flash cards every day on new topics, not the weekly ones.

- **Per day:** 2–4 topics from that day's news, each with a FRONT (3 questions) and a BACK (answers + one Prelims Trap). Facts are checked against primary or reported sources, which are listed in the data file.
- **Data:** `tools/masterclass-video/scenes/daily/YYYY-MM-DD.js` sets `DAILY = { date, cards }`.
- **Pictures:** a real Sentinel-2 view (`sentinel.py`) or a Survey of India outline map where the topic is a place. Never a likeness of a real person.
- **Render:** from `tools/masterclass-video`, with a timeline of 2 × topics rows; `scenes/daily/tl-6cards.json` covers 3 topics:

```
node render.js <assets> scenes/daily/tl-6cards.json scenes/weekly48.js,scenes/pencil48.js,scenes/daily/2026-11-28.js,scenes/flashdaily.js <out> --strict --size 1080x1350 --stills 4.96,10.11,15.27,20.43,25.59,30.74
```

| Date | Topics |
|---|---|
| 28 Nov 2026 | Constitution (132nd Amendment) Bill / delimitation · RBI daily CRR back to 90% · Vindhyagiri completes Project 17A |
