"""Align a narration recording to the master script by recognition + sequence matching (robust to accent and ad-libs).

align_vo.py force-aligns fixed 30-word windows; when the speaker's accent or small departures from the script make a
window fail, it falls back to proportional timing and can drift. This tool instead:
  1. cuts the recording at its pauses (ffmpeg silencedetect);
  2. recognises each speech segment with pocketsphinx, using a bigram language model built from the script itself,
     so the recogniser expects the script's own words and names;
  3. matches the recognised words to the script words (difflib), keeping only confident runs as anchors;
  4. times every script word by interpolating between anchors, snapping row starts to the nearest pause.

The output has the same format as align_vo.py, so timeline.py --align and build_audio.py use it unchanged.

Usage: python3 -I align_lm.py <02-master-script.md> <audio_16k_mono.wav> <out.json>
"""
import ast, difflib, json, math, re, subprocess, sys, tempfile, wave, collections, bisect
from pathlib import Path
from pocketsphinx import Decoder
import importlib.util

HERE = Path(__file__).resolve().parent
_spec = importlib.util.spec_from_file_location("vo_text", HERE / "vo_text.py")
_vt = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(_vt); norm = _vt.norm
# the pronunciations kept in align_vo.py (read as data, not imported, because that file runs on import)
OOV = ast.literal_eval(re.search(r"^OOV = (\{.*?^\})", (HERE / "align_vo.py").read_text(), re.S | re.M).group(1))

script, audio, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])

# ---- rows and words, parsed exactly as align_vo.py does
body = re.split(r"^## (?:PACKAGING|RUNTIME SUMMARY)", script.read_text(), flags=re.M)[0]
rows = []
for line in body.splitlines():
    if not line.startswith("|"):
        continue
    c = [x.strip() for x in line.strip().strip("|").split("|")]
    if len(c) < 3 or not re.search(r"\*\*S\d+\*\*", c[1]):
        continue
    text = re.sub(r"<br\s*/?>", " ", re.sub(r"\[[^\]]*\]", "", c[2]).replace("**", ""))
    sents = [s for s in re.split(r"(?<=[.?!])\s+(?=[A-Z\"'“])", text.strip()) if s.strip()]
    rows.append({"scene": re.search(r"\*\*(S\d+)\*\*", c[1]).group(1), "sents": [norm(s) for s in sents]})
words, owner = [], []
for ri, r in enumerate(rows):
    for si, s in enumerate(r["sents"]):
        for w in s:
            words.append(w); owner.append((ri, si))

with wave.open(str(audio)) as w:
    sr = w.getframerate(); raw = w.readframes(w.getnframes())
total = len(raw) / 2 / sr

# ---- a bigram language model from the script's own sentences
tmp = Path(tempfile.mkdtemp())
uni, bi = collections.Counter(), collections.Counter()
for r in rows:
    for s in r["sents"]:
        t = ["<s>"] + s + ["</s>"]; uni.update(t); bi.update(zip(t, t[1:]))
N = sum(uni.values())
arpa = ["\\data\\", f"ngram 1={len(uni)}", f"ngram 2={len(bi)}", "", "\\1-grams:"]
arpa += [f"{math.log10(c / N):.4f} {w} -0.3" for w, c in uni.items()]
arpa += ["", "\\2-grams:"] + [f"{math.log10(0.7 * c / uni[a]):.4f} {a} {b}" for (a, b), c in bi.items()] + ["", "\\end\\", ""]
(tmp / "script.arpa").write_text("\n".join(arpa))
dic = Decoder(samprate=sr, loglevel="FATAL")             # a plain decoder only to look up the default dictionary
lines = []
for w in sorted(set(words)):
    p = dic.lookup_word(w) or OOV.get(w)
    if p is None:
        sys.exit(f"No pronunciation for {w!r}: add it to OOV in align_vo.py")
    lines.append(f"{w} {p}")
(tmp / "script.dict").write_text("\n".join(lines) + "\n")
D = Decoder(samprate=sr, lm=str(tmp / "script.arpa"), dict=str(tmp / "script.dict"), loglevel="FATAL")

# ---- speech segments between pauses
sil = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(audio), "-af", "silencedetect=noise=-35dB:d=0.35", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", sil)]
ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", sil)]
pauses = list(zip(starts, ends + [total] * (len(starts) - len(ends))))
segs, cur = [], 0.0
for a, b in pauses:
    if a - cur > 0.15:
        segs.append((cur, a))
    cur = b
if total - cur > 0.15:
    segs.append((cur, total))
merged = []                                                   # merge into pieces of up to ~25 s for context
for a, b in segs:
    if merged and b - merged[-1][0] < 25 and a - merged[-1][1] < 1.2:
        merged[-1] = (merged[-1][0], b)
    else:
        merged.append((a, b))

pieces = []                    # a noisy room can hide every pause: cut long pieces into 20 s windows overlapping by 2 s
for a, b in merged:
    if b - a <= 30:
        pieces.append((a, b, a, b))
    else:
        t = a
        while t < b:
            pieces.append((max(a, t - 1.0), min(b, t + 21.0), t, min(b, t + 20.0)))   # (decode from, to, keep from, to)
            t += 20.0
merged = pieces
hyp = []                                                      # (word, start, end)
for k, (a, b, ka, kb) in enumerate(merged):
    a0, b0 = max(0, a - 0.1), min(total, b + 0.1)
    D.start_utt(); D.process_raw(raw[int(a0 * sr) * 2:int(b0 * sr) * 2], full_utt=True); D.end_utt()
    for sg in D.seg():
        w = sg.word.split("(")[0]
        if w.startswith(("<", "[", "+")):
            continue
        ws, we = a0 + sg.start_frame / 100, a0 + sg.end_frame / 100
        if ka <= (ws + we) / 2 < kb or (ka == a and kb == b):
            hyp.append((w, ws, we))
    if (k + 1) % 40 == 0:
        print(f"  recognised {k + 1}/{len(merged)} pieces · t={b:.0f}s", flush=True)

# ---- match recognised words to the script, keep runs of 2+ words as anchors
# A banded global alignment (Needleman-Wunsch) keeps the match in script order, so a phrase the script repeats
# ("how many of these three statements are correct") can only pair with the occurrence near where we expect it.
A, B = words, [h[0] for h in hyp]
n, m = len(A), len(B)
W = max(300, abs(m - n) + 300)                                # band half-width around the proportional diagonal
NEG = -10 ** 9
band = [(max(0, int(i * m / n) - W), min(m, int(i * m / n) + W)) for i in range(n + 1)]
H = [None] * (n + 1); T = [None] * (n + 1)                    # score rows and traceback rows (0 diag, 1 up, 2 left)
lo0, hi0 = band[0]; H[0] = [-(j) for j in range(lo0, hi0 + 1)]; T[0] = [2] * (hi0 - lo0 + 1)
for i in range(1, n + 1):
    lo, hi = band[i]; plo, phi = band[i - 1]; prev = H[i - 1]; row = [NEG] * (hi - lo + 1); tr = [1] * (hi - lo + 1)
    ai = A[i - 1]
    for j in range(lo, hi + 1):
        best, how = NEG, 1
        if plo <= j <= phi and prev[j - plo] > NEG:                       # gap in the recording (word not heard)
            best, how = prev[j - plo] - 1, 1
        if j > lo and row[j - 1 - lo] - 1 > best:                         # extra recognised word
            best, how = row[j - 1 - lo] - 1, 2
        if j >= 1 and plo <= j - 1 <= phi and prev[j - 1 - plo] > NEG:    # pair the two words
            v = prev[j - 1 - plo] + (2 if ai == B[j - 1] else -1)
            if v > best:
                best, how = v, 0
        row[j - lo] = best; tr[j - lo] = how
    H[i], T[i] = row, tr
i, j = n, min(m, band[n][1]); pairs = []
while i > 0 and j > 0:
    lo = band[i][0]; how = T[i][j - lo]
    if how == 0:
        if A[i - 1] == B[j - 1]:
            pairs.append((i - 1, j - 1))
        i, j = i - 1, j - 1
    elif how == 1:
        i -= 1
    else:
        j -= 1
pairs.reverse()
ps = set(pairs)
anchors = [(a, hyp[b][1], hyp[b][2]) for a, b in pairs if (a - 1, b - 1) in ps or (a + 1, b + 1) in ps]
print(f"anchors: {len(anchors)} of {len(words)} script words ({100 * len(anchors) / len(words):.0f}%)")

idx = [a[0] for a in anchors]
times = [None] * len(words)
for i in range(len(words)):
    k = bisect.bisect_left(idx, i)
    if k < len(idx) and idx[k] == i:
        times[i] = (anchors[k][1], anchors[k][2]); continue
    lo = anchors[k - 1] if k > 0 else (-1, 0.0, 0.0)
    hi = anchors[k] if k < len(anchors) else (len(words), total, total)
    span = hi[0] - lo[0]; t0, t1 = lo[2], hi[1]
    f0, f1 = (i - lo[0]) / span, (i - lo[0] + 1) / span      # spread the unmatched words evenly between anchors
    times[i] = (t0 + (t1 - t0) * (f0 - 1 / span), t0 + (t1 - t0) * (f1 - 1 / span)) if False else (t0 + (t1 - t0) * (i - lo[0] - 0.5) / span, t0 + (t1 - t0) * (i - lo[0] + 0.5) / span)

# ---- refine: force-align each row inside a window set by the anchor skeleton (exact word times where it succeeds)
F = Decoder(samprate=sr, dict=str(tmp / "script.dict"), loglevel="FATAL")
def force(s, e, ws):
    if e - s < 0.5:
        return None
    F.set_align_text(" ".join(ws)); F.start_utt()
    F.process_raw(raw[int(s * sr) * 2:int(e * sr) * 2], full_utt=True); F.end_utt()
    if F.hyp() is None:
        return None
    got = [(sg.word.split("(")[0], s + sg.start_frame / 100, s + sg.end_frame / 100) for sg in F.seg()
           if not sg.word.startswith(("<", "[", "+")) and sg.word != "<sil>"]
    return got if len(got) == len(ws) else None
refined = 0
for ri in range(len(rows)):
    ix = [k for k, o in enumerate(owner) if o[0] == ri]
    for pad in (0.6, 1.5, 3.0):
        s = max(0.0, times[ix[0]][0] - pad); e = min(total, times[ix[-1]][1] + pad)
        res = force(s, e, [words[k] for k in ix])
        if res:
            for k, (_, a, b) in zip(ix, res):
                times[k] = (a, b)
            refined += 1; break
print(f"rows force-aligned inside their windows: {refined}/{len(rows)}")

gaps = [(a, b) for a, b in pauses if b - a >= 0.3]
def snap(t, back=True):
    """Move a row boundary into the nearest real pause (within 0.8 s), so no word is clipped."""
    best = None
    for a, b in gaps:
        if a - 0.8 <= t <= b + 0.8:
            cand = b - 0.05 if back else a + 0.05
            if best is None or abs(cand - t) < abs(best - t):
                best = cand
    return best if best is not None else t

for ri, r in enumerate(rows):
    ix = [k for k, o in enumerate(owner) if o[0] == ri]
    r["start"], r["end"] = round(snap(times[ix[0]][0], True), 3), round(snap(times[ix[-1]][1], False), 3)
    r["sent_starts"] = [round(times[[k for k in ix if owner[k][1] == si][0]][0], 3) for si in range(len(r["sents"]))]
    r["words"] = [[words[k], round(times[k][0], 3), round(times[k][1], 3)] for k in ix]
    r["anchored"] = round(sum(1 for k in ix if k in set(idx)) / len(ix), 2)
    del r["sents"]
for a, b in zip(rows, rows[1:]):                              # keep rows in order and non-overlapping
    if b["start"] < a["end"]:
        mid = round((a["end"] + b["start"]) / 2, 3); a["end"] = b["start"] = mid
out.write_text(json.dumps({"audio": str(audio), "duration": round(total, 3), "method": "lm+match", "anchor_share": round(len(anchors) / len(words), 3),
                           "fallback_chunks": 0, "chunks": len(merged), "rows": rows}, indent=1))
weak = [r["scene"] for r in rows if r["anchored"] < 0.25]
print(f"aligned {len(words)} words · {total:.1f}s · rows with <25% anchors: {len(weak)} {weak[:20]}")
