"""Build the voice-only recording file (02b-voiceover-text.md) from a week's 02-master-script.md.

Usage: python3 tools/make_voiceover.py weeks/2026-W43 "v4"
"""
import re, sys, pathlib

week_dir = pathlib.Path(sys.argv[1]); version = sys.argv[2] if len(sys.argv) > 2 else ""
week = week_dir.name
src = (week_dir / "02-master-script.md").read_text()
title = src.splitlines()[0].replace("# Master Script — ", "")
meta = {k: re.search(rf"\*\*{k}:\*\* (.*)", src).group(1) for k in ("Release", "Coverage")}
body = "## COLD OPEN" + src.split("## COLD OPEN", 1)[1].split("## RUNTIME SUMMARY")[0]
codes = {"COLD OPEN": "open", "PILLAR 1": "P1", "PILLAR 2": "P2", "PILLAR 3": "P3", "PILLAR 4": "P4",
         "PILLAR 5": "P5", "TRANSITION": "transition", "TRAP VAULT": "traps", "VERDICT": "verdict"}

out, segs = [], []
shown = pending = seg = None
segw = total = 0

def flush():
    global segw
    if seg:
        out.append(f"*Words: {segw} · about {segw/135:.1f} min*\n"); segs.append((seg, segw))
    segw = 0

for line in body.splitlines():
    if line.startswith("## "):
        flush(); seg = re.sub(r"\s*\(target.*\)", "", line[3:]).strip()
        code = next((v for k, v in codes.items() if seg.startswith(k)), re.sub(r"\W+", "_", seg.lower())[:12])
        out.append(f"---\n\n## {seg}\n\nSave as: `{week}_VO_{code}.wav`\n"); shown = pending = None; continue
    if line.startswith("### "):
        out.append(f"**— {line[4:].strip()} —**\n"); continue
    m = re.match(r"\[(VOICE ANCHOR|HYPERFRAME PROMPT|KINETIC MOTION GRAPHIC|GEOSPATIAL MAP)\]", line)
    if m:
        if m.group(1) == "VOICE ANCHOR":
            d = re.search(r"\*Voice: (.*?)\*", line)
            pending = "💬 TALK TO THE VIEWER" + (f" — *{d.group(1)}*" if d else "")
        else:
            pending = "🎙️ NARRATION"
        continue
    if line.startswith("> "):
        if pending and pending != shown:
            out.append(f"**{pending}**\n"); shown = pending
        t = line[2:]; w = len(re.sub(r"\[[^\]]*\]|\*\*", "", t).split()); segw += w; total += w
        out.append(t + "\n")
flush()

head = f"""# Voiceover Text — {title} · {version}

**Release:** {meta['Release']}
**Coverage:** {meta['Coverage']}
**Format:** voice-only. Everything below is recorded on the microphone; there is no on-camera recording.
**Total:** {total} words · about {total/135:.1f} min at 135 wpm ({total/140:.1f}–{total/130:.1f} min at 140–130 wpm)

Visual directions for the editor are in `02-master-script.md`.

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
