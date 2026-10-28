# W44 sample: Deep Dive 2, the Election Commission before the Supreme Court

This is the second sample written under the new rules (decisions 28–30). It is Deep Dive 2 of the W44 hub, picked by Mounika on 28 Oct, and it scored EYS 8 in the triage. It sits after the AP–TG Desk; its checkpoint is answered in the Trap Vault's opening row (T.0).

| File | What it is |
|---|---|
| `01-research-brief.md` | Triage row, blueprint, five steps, MCQs, the verification log, the runtime note and pronunciations |
| `02-master-script.md` | Two-column script: hub cut 812 words (about 6:14 with the two holds), `[EXT]` row 2.12 (the two-sided proposition), and Trap Vault row T.0 |
| `02b-voiceover-text.md` | Recording file: `python3 tools/make_voiceover.py weeks/2026-W44/sample-eci v1` |

## The case is pending in court
- The next hearing is on 17 Nov.
- The script reports the proceedings, attributes every claim and predicts nothing.
- No commissioner is named or characterised on screen.
- If the Court acts on 17 Nov, this becomes an Update in W47.

## Review preview
`preview/eci-dd2-hub-review-720p.mp4` was sent in chat; videos are gitignored, so it is not in the repo. It is a silent review render with the sound bed only, about 6:33: Deep Dive 2 plus row T.0. The yellow caption strip is for checking sync and never ships.

To rebuild it, run from `tools/masterclass-video`:

```bash
python3 -I timeline.py ../../weeks/2026-W44/sample-eci/02-master-script.md $A/eci_hub.json --cut hub
python3 -I sound_bed.py $A/eci_hub.json $A/eci_bed.wav
node render.js $A $A/eci_hub.json scenes/eci.js $A/eci.mp4 --review --strict --fps 24   # then mux eci_bed.wav
```

## Before recording
- Read Section 18 on India Code. It is checked here only through a bare-act copy.
- Confirm whether a Constitution Bench has been formed before 1 Nov. If it has, update row 2.11.
