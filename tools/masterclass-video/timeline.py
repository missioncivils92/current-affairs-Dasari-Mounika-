"""Build the render timeline (timeline.json) from a two-column master script.

Every script row with a scene ID (**S01**, **S02**, ...) in its visual cell becomes one timeline entry:
  {scene, row, cut, segment, chapter, start, end, beats[], wt[], holds[], text}
- beats: start time of each spoken sentence (seconds from the row start).
- wt:    [token, time] for every spoken word, so scenes can key a build to the exact word (s.w("Kherson")).
- holds: [time, seconds] of real silence inside the row ("Pause and answer" countdowns, the recap hold).

Cuts. Rows carry a tag in the # column: [HUB] (both cuts), [HUB-ONLY] (Sunday hub), [EXT] (Decode Extended).
--cut hub|ext keeps only that cut's rows; without --cut every row is kept (useful for checking the whole source).

Holds. A "PAUSE AND ANSWER" row gets a 7 s hold straight after its question (the first sentence ending in "?").
A recap row with "skeleton with three blanks" gets a 3 s hold before "there" (or, without it, after the row's first
sentence). A visual cell with "HOLD 7 s" gets that hold after the row's last word. Holds always sit inside their own
row, so a countdown can never play over the next scene (asserted below).

Two timing modes:
- Estimate (default): 135 wpm, word length and punctuation pauses.
- Aligned: --align align.json from align_vo.py (run on a recording of the whole source). Rows sit on their
  aligned words; the output's "audio_plan" tells build_audio.py which source spans to keep for this cut and
  where to insert the silences.

Usage: python3 -I timeline.py <02-master-script.md> <out.json> [--cut hub|ext] [--align align.json]
"""
import json, re, sys
from pathlib import Path

src, out = Path(sys.argv[1]), Path(sys.argv[2])
args = sys.argv[3:]
opt = lambda k: args[args.index(k) + 1] if k in args else None
cut, align_file = opt("--cut"), opt("--align")
WPM, HOLD_Q, HOLD_RECAP, END_MIN = 135, 7.0, 3.0, 18.0
assert cut in (None, "hub", "ext"), "--cut must be hub or ext"

def spoken(t):
    t = re.sub(r"\[[^\]]*\]", "", t).replace("**", "")
    return re.sub(r"\s+", " ", re.sub(r"<br\s*/?>", " ", t)).strip()

def sentences(t):
    return [p for p in re.split(r"(?<=[.?!])\s+(?=[A-Z\"'“])", t) if p.strip()]

def key(w):
    return re.sub(r"[^\w'-]", "", w.lower().replace("’", "'"))

def in_cut(tag):
    if cut is None or tag is None or tag == "HUB":
        return True
    return (cut == "hub" and tag == "HUB-ONLY") or (cut == "ext" and tag == "EXT")

# ---------- parse ----------
rows, seg, chapter = [], None, None
body = re.split(r"^## (?:PACKAGING|RUNTIME SUMMARY)", src.read_text(), flags=re.M)[0]
for line in body.splitlines():
    if line.startswith("## "):
        seg = re.sub(r"\s*\(.*\)", "", line[3:]).strip(); part = seg.split(" — ")[-1]
        chapter = re.sub(r"\b(cta|upsc|gs)\b", lambda m: m.group(1).upper(), part.capitalize(), flags=re.I) if part.isupper() else part
        continue
    if line.startswith("### "):
        chapter = line[4:].strip(); continue
    if not line.startswith("|"):
        continue
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    m = len(cells) >= 3 and re.search(r"\*\*(S\d+)\*\*", cells[1])
    if not m:
        continue
    tag = re.search(r"\[(HUB-ONLY|HUB|EXT)\]", cells[0])
    text = spoken(cells[2])
    rows.append({"row": re.sub(r"\s*\[.*\]", "", cells[0]), "cut": tag.group(1) if tag else None, "scene": m.group(1),
                 "segment": seg, "chapter": chapter, "visual": cells[1], "text": text, "tokens": text.split(),
                 "sents": sentences(text)})
all_rows = rows
rows = [r for r in rows if in_cut(r["cut"])]

def hold_points(r):
    """[(token index the hold comes AFTER, seconds)] for this row."""
    toks, h = r["tokens"], []
    if "PAUSE AND ANSWER" in r["visual"]:
        q = next((i for i, t in enumerate(toks) if t.endswith("?")), len(toks) - 1)
        h.append((q, HOLD_Q))
    if "skeleton with three blanks" in r["visual"]:
        th = [i for i, t in enumerate(toks) if key(t) == "there"]
        if not th:      # no "there you go": hold after the first sentence ("…before I reveal them.")
            th = [1 + next((i for i, t in enumerate(toks) if t.endswith(".")), len(toks) - 2)]
        h.append((th[-1] - 1, HOLD_RECAP))
    m = re.search(r"\bHOLD (\d+) s\b", r["visual"])      # explicit hold (e.g. an MCQ) after the row's last word
    if m:
        h.append((len(toks) - 1, float(m.group(1))))
    return h

def sent_starts(r, times):
    starts, k = [], 0
    for s in r["sents"]:
        starts.append(times[k]); k += len(s.split())
    return starts

# ---------- estimate mode ----------
def estimate(r):
    toks = r["tokens"]; avg = sum(len(key(t)) for t in toks) / max(1, len(toks))
    holds = dict(hold_points(r)); t, times, hl = 0.15, [], []
    for i, tok in enumerate(toks):
        times.append(round(t, 3))
        t += 60 / 158 * (0.55 + 0.45 * len(key(tok)) / max(avg, 1))   # 158 wpm of voiced words + the pauses below ≈ 135 wpm overall
        if tok in ("—", "–", "...", "…"):
            t += 0.5 if tok != "—" else 0.12
        elif tok.endswith(("...", "…")):
            t += 0.7
        elif tok.endswith((".", "?", "!")):
            t += 0.35
        elif tok.endswith((",", ";", ":")):
            t += 0.18
        if i in holds:
            hl.append([round(t, 3), holds[i]]); t += holds[i]
    d = t + 0.45
    if "End-screen" in r["visual"]:
        d = max(d, END_MIN)
    return d, times, hl

t = 0.0
extra = {}
if align_file is None:
    for r in rows:
        d, times, hl = estimate(r)
        r.update(start=round(t, 3), end=round(t + d, 3), wt=[[key(w), x] for w, x in zip(r["tokens"], times)],
                 beats=sent_starts(r, times), holds=hl)
        t += d
    mode = "estimate (135 wpm)"
else:
    al = json.loads(Path(align_file).read_text()); arows = al["rows"]
    assert [a["scene"] for a in arows] == [r["scene"] for r in all_rows], "script changed since alignment: re-run align_vo.py"
    A = {id(r): a for r, a in zip(all_rows, arows)}
    import importlib.util
    spec = importlib.util.spec_from_file_location("vo_text", Path(__file__).with_name("vo_text.py"))
    vt = importlib.util.module_from_spec(spec); spec.loader.exec_module(vt); norm = vt.norm
    plan = []
    for r in rows:
        a = A[id(r)]; k = all_rows.index(r)
        prev_end = arows[k - 1]["end"] if k else 0.0
        next_start = arows[k + 1]["start"] if k + 1 < len(arows) else al["duration"]
        prev_e0 = min(a["start"], prev_end + 0.35)        # where the previous row's audio span stopped (no overlap, no stutter)
        s0 = max(0.0, a["start"] - 0.4) if k == 0 else max(prev_e0, a["start"] - 0.25)     # no dead air before the first word
        e0 = al["duration"] if k + 1 == len(arows) else min(next_start, a["end"] + 0.35)
        # token start/end times: each script token maps to the aligned words its normalised form produces
        aw, wi, tok_t = a["words"], 0, []
        for tok in r["tokens"]:
            n = len(norm(tok))
            tok_t.append((aw[wi][1], aw[wi + n - 1][2]) if n and wi + n <= len(aw) else (tok_t[-1][1] if tok_t else a["start"],) * 2)
            wi += n
        ins = []
        for i, dur in hold_points(r):
            at = tok_t[i][1] + 0.1
            if i + 1 < len(tok_t):
                at = min(at, tok_t[i + 1][0] - 0.05)
            at = min(at, e0 - 0.05)
            ins.append((at, dur))
        tail = 0.0
        span = e0 - s0 + sum(d for _, d in ins)
        if "End-screen" in r["visual"] and span < END_MIN:
            tail = END_MIN - span
        if ins and e0 - ins[-1][0] < 0.3:      # a hold at the very end of the row still needs a breath after it
            tail = max(tail, 0.3 - (e0 - ins[-1][0]))
        t0 = t
        mp = lambda x: t0 + (x - s0) + sum(d for at, d in ins if at <= x)
        last = s0
        for at, dur in ins:
            plan += [["src", round(last, 3), round(at, 3)], ["sil", dur]]; last = at
        plan.append(["src", round(last, 3), round(e0, 3)])
        if tail:
            plan.append(["sil", round(tail, 3)])
        start = t; t = mp(e0) + tail
        r.update(start=round(start, 3), end=round(t, 3), wt=[[key(w), round(mp(x[0]) - start, 3)] for w, x in zip(r["tokens"], tok_t)],
                 holds=[[round(mp(at) - dur - start, 3), dur] for at, dur in ins], src=[s0, e0])
        r["beats"] = sent_starts(r, [x for _, x in r["wt"]])
    mode = f"aligned ({Path(align_file).name})"
    extra = {"audio": al["audio"], "audio_plan": plan}

# ---------- checks ----------
for r in rows:
    for at, dur in r["holds"]:
        assert at + dur <= r["end"] - r["start"] - 0.2, f"{r['scene']}: hold runs past its row"
    del r["tokens"], r["sents"]

chapters = []
for r in rows:
    if not chapters or chapters[-1]["title"] != r["chapter"]:
        chapters.append({"title": r["chapter"], "start": r["start"]})
doc = {"mode": mode, "cut": cut or "all", "duration": round(t, 3), "rows": rows, "chapters": chapters, **extra}
out.write_text(json.dumps(doc, indent=1))
words = sum(len(r["wt"]) for r in rows)
print(f"{len(rows)} rows · {words} words · {t/60:.2f} min · cut {cut or 'all'} · {mode}")
for c in chapters:
    print(f"  {int(c['start']//60):02d}:{int(c['start']%60):02d}  {c['title']}")
