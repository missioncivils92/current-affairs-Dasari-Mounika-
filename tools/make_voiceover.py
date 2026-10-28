"""Build the voice-only recording file (02b-voiceover-text.md) from a week's 02-master-script.md.

Reads the two-column script table (| # | Visual cue | Narration |) and the older tag + "> " block format.

Usage: python3 tools/make_voiceover.py weeks/2026-W44 "v1"
"""
import re, sys, pathlib

week_dir = pathlib.Path(sys.argv[1]); version = sys.argv[2] if len(sys.argv) > 2 else ""
week = week_dir.name
src = (week_dir / "02-master-script.md").read_text()
title = src.splitlines()[0].replace("# Master Script — ", "")
meta = {k: re.search(rf"\*\*{k}:\*\* (.*)", src).group(1) for k in ("Release", "Coverage")}
body = "## COLD OPEN" + re.split(r"^## (?:RUNTIME SUMMARY|PACKAGING)", src.split("## COLD OPEN", 1)[1], flags=re.M)[0]
codes = {"COLD OPEN": "open", "PILLAR 1": "P1", "PILLAR 2": "P2", "PILLAR 3": "P3", "PILLAR 4": "P4",
         "PILLAR 5": "P5", "TRANSITION": "transition", "TRAP VAULT": "traps", "DESK NOTE": "desknote",
         "VERDICT": "verdict", "UPDATE DESK": "updates", "NEWS GRID": "grid",
         "PRELIMS GRID": "grid", "AP–TG DESK": "aptg"}
codes.update({f"DEEP DIVE {i}": f"D{i}" for i in range(1, 10)})
codes.update({f"FOCUS {i}": f"F{i}" for i in range(1, 10)})
tags = r"VOICE ANCHOR|HYPERFRAME PROMPT|KINETIC MOTION GRAPHIC|KINETIC TEXT|GEOSPATIAL MAP|GIS MAP|MIND MAP|REAL FOOTAGE|DATA CHART"

out, segs = [], []
shown = pending = seg = None
cutw = {"HUB": 0, "HUB-ONLY": 0, "EXT": 0}     # words per cut tag ([HUB] rows are in both cuts)
segw = total = 0

def flush():
    global segw
    if seg:
        out.append(f"*Words: {segw} · about {segw/135:.1f} min*\n"); segs.append((seg, segw))
    segw = 0

def cue(visual):
    d = re.search(r"\*Voice: (.*?)\*", visual)
    kind = "💬 TALK TO THE VIEWER" if "VOICE ANCHOR" in visual else "🎙️ NARRATION"
    return kind + (f" — *{d.group(1)}*" if d else "")

def say(t):
    global shown, segw, total
    if pending and pending != shown:
        out.append(f"**{pending}**\n"); shown = pending
    w = len(re.sub(r"\[[^\]]*\]|\*\*", "", t).split()); segw += w; total += w
    out.append(t + "\n")

for line in body.splitlines():
    if line.startswith("## "):
        flush(); seg = re.sub(r"\s*\(target.*\)", "", line[3:]).strip()
        code = next((v for k, v in codes.items() if seg.startswith(k)), re.sub(r"\W+", "_", seg.lower())[:12])
        out.append(f"---\n\n## {seg}\n\nSave as: `{week}_VO_{code}.wav`\n"); shown = pending = None; continue
    if line.startswith("### "):
        out.append(f"**— {line[4:].strip()} —**\n"); continue
    if line.startswith("|"):
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 3 or cells[0] == "#" or re.fullmatch(r"[-: ]+", cells[0]) or not cells[2]:
            continue
        tag = re.search(r"\[(HUB-ONLY|HUB|EXT)\]", cells[0])
        pending = cue(cells[1]) + (f" · `{tag.group(1)}`" if tag else "")
        cutw[tag.group(1) if tag else "HUB"] += len(re.sub(r"\[[^\]]*\]|\*\*", "", cells[2]).split())
        for t in re.split(r"<br\s*/?>", cells[2]):
            if t.strip():
                say(t.strip())
        continue
    m = re.match(rf"\[({tags})\]", line)
    if m:
        pending = cue(line)
        continue
    if line.startswith("> "):
        say(line[2:])
flush()

head = f"""# Voiceover Text — {title} · {version}

**Release:** {meta['Release']}
**Coverage:** {meta['Coverage']}
**Format:** voice-only. Everything below is recorded on the microphone; there is no on-camera recording.
**Total:** {total} words · about {total/135:.1f} min at 135 wpm ({total/140:.1f}–{total/130:.1f} min at 140–130 wpm)

Visual directions for the editor are in `02-master-script.md`.

**Cuts:** every row is listed once, so each line is recorded once. `HUB` rows go in both videos, `HUB-ONLY` rows only in the Sunday hub, `EXT` rows only in Decode Extended (`02-master-script.md`, cut tags).
""" + (f"Sunday hub: {cutw['HUB'] + cutw['HUB-ONLY']} words · Decode Extended: {cutw['HUB'] + cutw['EXT']} words\n" if cutw["HUB-ONLY"] or cutw["EXT"] else "") + """
**Two kinds of blocks (both microphone-only)**
- **🎙️ NARRATION** — explaining over maps, images and graphics. Steady, clear teaching voice.
- **💬 TALK TO THE VIEWER** — speaking directly to one aspirant. Viewers can't see you, so put the expression into the voice and follow the voice direction next to each block.

**Reading marks:** — short beat · ... deliberate pause · **bold** = stress · [brackets] = pronunciation guide, not read aloud.

**Recording tips**
- Quiet, soft room, with fans and AC off.
- Mic 10–15 cm from your mouth, slightly to the side. Record WAV.
- Record 10 seconds of silence first.
- One file per segment, using the name under each heading.
- On a mistake: pause, say "retake", then re-read the whole sentence.
- Use the same mic, room and distance every week.

| Segment | Words | Min |
|---|---|---|
""" + "".join(f"| {a} | {b} | {b/135:.1f} |\n" for a, b in segs)
(week_dir / "02b-voiceover-text.md").write_text(re.sub(r"\n{3,}", "\n\n", head + "\n" + "\n".join(out)))
print(total)
