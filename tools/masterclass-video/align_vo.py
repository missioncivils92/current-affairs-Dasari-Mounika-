"""Force-align a narration recording to the master script (pocketsphinx; offline, model bundled in the wheel).

Output (JSON): per script row, the start/end time of its first/last spoken word and the start time of each
sentence, so timeline.py --align can land every visual on the exact words it explains.

The audio is aligned block by block: the script is cut into chunks of ~25 words, and each chunk is searched in a
window around where the previous chunk ended. This keeps alignment robust over a 10–20 minute recording.

Usage: python3 -I align_vo.py <02-master-script.md> <audio_16k_mono.wav> <out.json>
"""
import json, re, sys, wave
from pathlib import Path
from pocketsphinx import Decoder

script, audio, out = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])

# pronunciations for names and terms missing from the CMU dictionary (ARPAbet, approximate)
OOV = {
    "oleshky": "OW L EH SH K IY", "dnipro": "D N IY P R OW", "kherson": "K EH R S AO N", "zaporizhzhia": "Z AA P AO R IH ZH Y AH",
    "kakhovka": "K AH K OW F K AH", "kalanchak": "K AE L AH N CH AE K", "enerhodar": "EH N ER HH OW D AA R",
    "lubinets": "L UW B IY N EH T S", "lantratova": "L AE N T R AA T OW V AH", "dmytro": "D M IY T R OW", "valdai": "V AE L D AY",
    "samarkand": "S AE M ER K AE N D", "montreux": "M AA N T R UW", "bosphorus": "B AA S F ER AH S", "dardanelles": "D AA R D AH N EH L Z",
    "marmara": "M AA R M ER AH", "azov": "EY Z AO V", "donbas": "D AA N B AE S", "donetsk": "D AH N EH T S K", "luhansk": "L UW HH AE N S K",
    "kyiv": "K IY IY V", "melania": "M EH L EY N IY AH", "kerch": "K ER CH", "crimea": "K R AY M IY AH", "mcq": "EH M S IY K Y UW",
    "ukraine's": "Y UW K R EY N Z", "zaporizhzhia's": "Z AA P AO R IH ZH Y AH Z", "russia's": "R AH SH AH Z", "india's": "IH N D IY AH Z",
    "crimea's": "K R AY M IY AH Z", "delhi": "D EH L IY", "hyderabad": "HH AY D ER AH B AE D", "geneva": "JH AH N IY V AH",
    "fertiliser": "F ER T AH L AY Z ER", "shallowest": "SH AE L OW AH S T", "upsc": "Y UW P IY EH S S IY", "yana": "Y AA N AH",
    "marks": "M AA R K S", "aspirants": "AE S P ER AH N T S", "fifteen-marker": "F IH F T IY N M AA R K ER",
}
YEARS = {"2014": "twenty fourteen", "2022": "twenty twenty two", "2023": "twenty twenty three", "2003": "two thousand three",
         "2026": "twenty twenty six", "1936": "nineteen thirty six", "1977": "nineteen seventy seven"}

def norm(t):
    for k, v in YEARS.items():
        t = t.replace(k, v)
    t = re.sub(r"\bUN\b", "U N", t).replace("’", "'")
    t = re.sub(r"[—–\-/]", " ", t.lower())
    return [w for w in re.sub(r"[^a-z' ]", " ", t).split() if w.strip("'")]

# --- rows from the script (same parsing as timeline.py)
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

words, owner = [], []          # flat word list, with (row, sentence) owner per word
for ri, r in enumerate(rows):
    for si, s in enumerate(r["sents"]):
        for w in s:
            words.append(w); owner.append((ri, si))

with wave.open(str(audio)) as w:
    sr = w.getframerate(); raw = w.readframes(w.getnframes())
total = len(raw) / 2 / sr

def decoder():
    d = Decoder(samprate=sr, loglevel="FATAL")
    for k, v in OOV.items():
        if d.lookup_word(k) is None:
            d.add_word(k, v, False)
    missing = sorted({w for w in words if d.lookup_word(w) is None})
    return d, missing

D, missing = decoder()
if missing:
    sys.exit("No pronunciation for: " + ", ".join(missing) + " — add them to OOV in align_vo.py")

def align(s, e, ws):
    if e - s < 0.5:
        return None
    D.set_align_text(" ".join(ws)); D.start_utt()
    D.process_raw(raw[int(s * sr) * 2:int(e * sr) * 2], full_utt=True); D.end_utt()
    if D.hyp() is None:
        return None
    got = [(sg.word.split("(")[0], s + sg.start_frame / 100, s + sg.end_frame / 100) for sg in D.seg()
           if not sg.word.startswith(("<", "[", "+")) and sg.word != "<sil>"]
    return got if len(got) == len(ws) else None

rate = len(words) / total     # words per second, to size the search windows
times, i, cursor, fallbacks, nchunks = [None] * len(words), 0, 0.0, 0, 0
CH, KEEP = 30, 20             # align 30 words, keep the first 20 (the window end only distorts the tail)
while i < len(words):
    j = min(len(words), i + CH); last = j == len(words)
    ws = words[i:j]; est = len(ws) / rate; nchunks += 1
    res = None
    for pad in (2.0, 4.0, 7.0):
        res = align(max(0, cursor - 0.3), total if last else min(total, cursor + est + pad), ws)
        if res:
            break
    if res is None:            # proportional fallback for this chunk, keeps the run going
        fallbacks += 1
        res = [(w, cursor + k / rate, cursor + (k + 1) / rate) for k, w in enumerate(ws)]
    keep = len(ws) if last else KEEP
    for k in range(keep):
        times[i + k] = (round(res[k][1], 3), round(res[k][2], 3))
    cursor = res[keep][1] if not last else total
    i += keep
    if nchunks % 15 == 0:
        print(f"  {i}/{len(words)} words · t={cursor:.1f}s · fallbacks {fallbacks}", flush=True)

for ri, r in enumerate(rows):
    idx = [k for k, o in enumerate(owner) if o[0] == ri]
    r["start"], r["end"] = times[idx[0]][0], times[idx[-1]][1]
    r["sent_starts"] = [times[[k for k in idx if owner[k][1] == si][0]][0] for si in range(len(r["sents"]))]
    r["words"] = [[words[k], times[k][0], times[k][1]] for k in idx]
    del r["sents"]
out.write_text(json.dumps({"audio": str(audio), "duration": round(total, 3), "fallback_chunks": fallbacks, "chunks": nchunks, "rows": rows}, indent=1))
print(f"aligned {len(words)} words · {total:.1f}s · fallback chunks {fallbacks}/{nchunks}")
