"""Write viewer captions (.srt) from an aligned timeline: the script's own words, timed to the recording.

The narration is verbatim, so the captions are the script text (numbers shown as digits for readers), cut into
cues of at most 2 lines × 42 characters that break at sentence and clause ends, each timed by its first word's
aligned start and held until the next cue (at most 0.6 s past its last word; never across a countdown hold).
CLAUDE.md §6.2: captions are a separate, switch-on track, never burned in. Check the names once before upload.

Usage: python3 -I make_srt.py <aligned timeline.json> <out.srt>
"""
import json, re, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from vo_numbers import to_digits

tl, out = json.load(open(sys.argv[1])), sys.argv[2]
MAXC, MAXL = 42, 2


def stamp(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def cap(t):
    """Caption form of spoken text: digits for numbers, and spelled-out acronyms joined (U-P-S-C -> UPSC)."""
    return re.sub(r"\b(?:[A-Z]-){1,}[A-Z]\b", lambda m: m.group().replace("-", ""), to_digits(t))


def wrap(words):
    lines, cur = [], ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > MAXC:
            lines.append(cur); cur = w
        else:
            cur = f"{cur} {w}".strip()
    return lines + ([cur] if cur else [])


cues = []
for r in tl["rows"]:
    toks = re.sub(r"\[[^\]]*\]", "", r["text"]).replace("**", "").split()
    times = [r["start"] + t for _, t in r["wt"]]
    holds = [(r["start"] + a, r["start"] + a + d) for a, d in r.get("holds", [])]
    i = 0
    while i < len(toks):
        j = i                                     # grow the cue word by word while it still fits in 2 lines
        while j < len(toks) and len(wrap(cap(" ".join(toks[i:j + 1])).split())) <= MAXL:
            j += 1
            if re.search(r"[.?!]$", toks[j - 1]) and j - i >= 4:
                break                             # end a cue at a sentence end once it has a few words
        if j < len(toks) and j - i > 6:           # otherwise prefer to break after a comma or semicolon
            k = max((k for k in range(i + 3, j) if re.search(r"[,;:]$", toks[k - 1])), default=None)
            if k:
                j = k
        j = max(j, i + 1)
        for a, b in holds:                        # a cue never straddles a countdown hold: cut it at the hold
            after = [k for k in range(i + 1, j) if times[k] >= b - 0.05]
            if after and times[i] < a:
                j = after[0]
        text = cap(" ".join(toks[i:j]))
        cues.append([times[i], times[j - 1] + 0.6, "\n".join(wrap(text.split())), holds])
        i = j

for k, c in enumerate(cues):                      # hold each cue until the next one, but never across a countdown
    nxt = cues[k + 1][0] if k + 1 < len(cues) else c[1] + 2
    end = min(max(c[1], c[0] + 1.0), nxt - 0.04)
    for a, b in c[3]:
        if c[0] < a < end:
            end = a
    c[1] = end

Path(out).write_text("".join(f"{k + 1}\n{stamp(a)} --> {stamp(b)}\n{t}\n\n" for k, (a, b, t, _) in enumerate(cues)))
print(f"{len(cues)} cues → {out}")
