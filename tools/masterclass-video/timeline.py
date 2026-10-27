"""Build the render timeline (timeline.json) from a two-column master script.

Every script row with a scene ID (**S01**, **S02**, ...) in its visual cell becomes one timeline
entry: {scene, row, segment, chapter, start, end, beats[], text}. "beats" are the start times
(seconds from the row start) of each spoken sentence, which scenes use to build one element per sentence.

Two timing modes:
- Estimate (default): 135 wpm, plus pauses for "...", "—", row gaps, countdown cards and holds.
- Voiceover: --vo <dir> with one WAV per segment, named as in 02b-voiceover-text.md
  (e.g. 2026-W44_VO_D1.wav). Rows are placed by forced alignment (pocketsphinx, if installed)
  or, as a fallback, by word share inside each segment's real duration.

Usage: python3 -I timeline.py <02-master-script.md> <out.json> [--vo <dir> --prefix <name>]
"""
import json, re, sys, wave
from pathlib import Path

src, out = Path(sys.argv[1]), Path(sys.argv[2])
args = sys.argv[3:]
vo_dir = Path(args[args.index("--vo") + 1]) if "--vo" in args else None
align_file = Path(args[args.index("--align") + 1]) if "--align" in args else None   # from align_vo.py
prefix = args[args.index("--prefix") + 1] if "--prefix" in args else src.parent.name
WPM = 135
CODES = {"COLD OPEN": "open", "UPDATE DESK": "updates", "TRAP VAULT": "traps", "NEWS GRID": "grid",
         "DESK NOTE": "desknote", "VERDICT": "verdict"}

def spoken(t):
    t = re.sub(r"\[[^\]]*\]", "", t).replace("**", "")
    return re.sub(r"<br\s*/?>", " ", t).strip()

def words(t):
    return len(spoken(t).split())

def sentences(t):
    parts = re.split(r"(?<=[.?!])\s+(?=[A-Z\"'“])", spoken(t))
    return [p for p in parts if p.strip()]

def seg_code(seg):
    for k, v in CODES.items():
        if seg.startswith(k):
            return v
    m = re.match(r"(DEEP DIVE|FOCUS|PILLAR) (\d+)", seg)
    if m:
        return {"DEEP DIVE": "D", "FOCUS": "F", "PILLAR": "P"}[m.group(1)] + m.group(2)
    return re.sub(r"\W+", "_", seg.lower())[:12]

rows, seg, chapter = [], None, None
body = re.split(r"^## (?:PACKAGING|RUNTIME SUMMARY)", src.read_text(), flags=re.M)[0]
for line in body.splitlines():
    if line.startswith("## "):
        seg = re.sub(r"\s*\(target.*\)", "", line[3:]).strip(); part = seg.split(" — ")[-1]; chapter = re.sub(r"\b(cta|upsc|gs)\b", lambda m: m.group(1).upper(), part.capitalize(), flags=re.I) if part.isupper() else part; continue
    if line.startswith("### "):
        chapter = line[4:].strip(); continue
    if not line.startswith("|"):
        continue
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    if len(cells) < 3:
        continue
    m = re.search(r"\*\*(S\d+)\*\*", cells[1])
    if not m:
        continue
    rows.append({"row": cells[0], "scene": m.group(1), "segment": seg, "code": seg_code(seg), "chapter": chapter,
                 "visual": cells[1], "text": spoken(cells[2]), "words": words(cells[2]), "sents": sentences(cells[2])})

def est_duration(r):
    d = r["words"] / WPM * 60 + r["text"].count("...") * 0.7 + r["text"].count("—") * 0.12 + 0.45
    if "PAUSE AND ANSWER" in r["visual"]:
        d += 5.0                      # countdown on screen
    if "skeleton with three blanks" in r["visual"]:
        d += 3.0                      # hold before the reveal
    if "End-screen" in r["visual"]:
        d = max(d, 18.0)
    return d

def beats_for(r, dur):
    n = [len(s.split()) for s in r["sents"]] or [1]
    tot, acc, b = sum(n), 0, []
    speak = min(dur, r["words"] / WPM * 60 + r["text"].count("...") * 0.7) or dur
    for k in n:
        b.append(round(acc / tot * speak, 3)); acc += k
    return b

t = 0.0
if align_file is not None:
    # Exact mode: rows sit on the aligned words. Silence is inserted into the narration for countdown cards
    # and recap holds, so viewers get real thinking time; the inserts are listed for build_audio.
    al = json.loads(align_file.read_text()); arows = al["rows"]
    assert [a["scene"] for a in arows] == [r["scene"] for r in rows], "script changed since alignment"
    inserts = []
    for r, a in zip(rows, arows):
        if "PAUSE AND ANSWER" in r["visual"]:
            at = a["sent_starts"][1] if len(a["sent_starts"]) > 1 and "If you said" in r["text"] else a["end"] + 0.15
            inserts.append([round(at - 0.05, 3), 5.0])
        if "skeleton with three blanks" in r["visual"]:
            w = [x for x in a["words"] if x[0] == "there"]
            if w:
                inserts.append([round(w[-1][1] - 0.05, 3), 3.0])
    inserts.sort()
    def mapt(x):
        return x + sum(d for at, d in inserts if at <= x)
    nxt = [a["start"] for a in arows[1:]] + [al["duration"]]
    for r, a, n in zip(rows, arows, nxt):
        s0, e0 = mapt(0.0 if r is rows[0] else a["start"] - 0.2), mapt(n - 0.2 if n < al["duration"] else n)
        r.update(start=round(s0, 3), end=round(e0, 3), beats=[round(mapt(b) - s0, 3) for b in a["sent_starts"]])
    rows[-1]["end"] = round(max(rows[-1]["end"], rows[-1]["start"] + 18.0), 3)      # room for the end screen
    t = rows[-1]["end"]
    mode = f"aligned ({align_file.name})"
    extra = {"audio": al["audio"], "inserts": inserts}
elif vo_dir is None:
    for r in rows:
        d = est_duration(r)
        r.update(start=round(t, 3), end=round(t + d, 3), beats=beats_for(r, d)); t += d
    mode = "estimate (135 wpm)"
else:
    for code in dict.fromkeys(r["code"] for r in rows):
        segrows = [r for r in rows if r["code"] == code]
        wav = vo_dir / f"{prefix}_VO_{code}.wav"
        parts = [wav] if wav.exists() else sorted(vo_dir.glob(f"{prefix}_VO_{code}[a-z].wav"))  # e.g. D1a, D1b (ElevenLabs blocks)
        seg_len = 0.0
        for pw in parts:
            with wave.open(str(pw)) as w:
                seg_len += w.getnframes() / w.getframerate()
        extra = sum(max(0, est_duration(r) - (r["words"] / WPM * 60 + 0.45)) for r in segrows)
        tot_words = sum(r["words"] for r in segrows) or 1
        s = t
        for r in segrows:
            share = r["words"] / tot_words * seg_len
            d = share + max(0, est_duration(r) - (r["words"] / WPM * 60 + 0.45))
            r.update(start=round(s, 3), end=round(s + d, 3), beats=beats_for(r, share), vo=str(wav), vo_offset=round(t, 3))
            s += d
        t = s
    mode = f"voiceover ({vo_dir})"

chapters = []
for r in rows:
    if not chapters or chapters[-1]["title"] != r["chapter"]:
        chapters.append({"title": r["chapter"], "start": r["start"]})
doc = {"mode": mode, "duration": round(t, 3), "rows": rows, "chapters": chapters}
doc.update(extra if align_file is not None else {})
out.write_text(json.dumps(doc, indent=1))
print(f"{len(rows)} rows · {t/60:.2f} min · {mode}")
for c in chapters:
    print(f"  {int(c['start']//60):02d}:{int(c['start']%60):02d}  {c['title']}")
