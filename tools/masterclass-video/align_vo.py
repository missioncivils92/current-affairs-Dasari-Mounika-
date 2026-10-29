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
import importlib.util
_spec = importlib.util.spec_from_file_location("vo_text", Path(__file__).with_name("vo_text.py"))
_vt = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(_vt); norm = _vt.norm

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
    # W44 Prelims Grid and AP–TG Desk
    "ambaji's": "AE M B AA JH IY Z", "andhra": "AA N D R AH", "anticlockwise": "AE N T IY K L AA K W AY Z", "arnab": "AA R N AA B",
    "biofuels": "B AY OW F Y UW AH L Z", "brics": "B R IH K S", "canc": "K AE N K", "ccamlr": "K AE M L AH R",
    "chandigarh": "CH AH N D IY G AA R", "chilika": "CH IH L IH K AH", "condenses": "K AH N D EH N S IH Z", "coriolis": "K AO R IY OW L IH S",
    "crore": "K R AO R", "cyclonic": "S AY K L AA N IH K", "dipam": "D IY P AH M", "diwas": "D IH V AH S", "ekta": "EH K T AH",
    "escap": "EH S K AE P", "godavari": "G OW D AA V ER IY", "gurugram": "G UH R UW G R AE M", "idbi": "AY D IY B IY AY",
    "karaikal": "K AE R AY K AA L", "keoladeo": "K EY OW L AH D EY OW", "kunming": "K UH N M IH NG", "lokpal": "L OW K P AA L",
    "loktak": "L OW K T AE K", "mainpuri": "M EY N P UH R IY", "masterclass": "M AE S T ER K L AE S", "mohanthal": "M OW HH AH N T AA L",
    "nagar": "N AH G ER", "narmada": "N ER M AH D AH", "nepal's": "N AH P AO L Z", "offences": "AH F EH N S IH Z", "patel's": "P AH T EH L Z",
    "puducherry": "P UH D UH CH EH R IY", "ramsar": "R AE M S AA R", "rashtriya": "R AA SH T R IY AH", "sabha": "S AH B AH",
    "sadan": "S AH D AH N", "samvidhan": "S AH M V IH D AA N", "santhanam": "S AH N T AH N AH M", "sardar": "S ER D AA R",
    "sauj": "S AW JH", "siofa": "S IY OW F AH", "sofi": "S OW F IY", "songdo": "S AO NG D OW", "stunting": "S T AH N T IH NG",
    "sukhna": "S UH K N AH", "sundarbans": "S UH N D ER B AH N Z", "undernourishment": "AH N D ER N ER IH SH M AH N T",
    "uttar": "UH T ER", "welthungerhilfe": "V EH L T HH UH NG ER HH IH L F AH", "yanam": "Y AA N AH M",
}
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
