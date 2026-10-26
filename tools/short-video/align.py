import re, json, wave
from pocketsphinx import Decoder
SP="/tmp/claude-0/-home-user-current-affairs-Dasari-Mounika-/b50d1a5d-2e57-5234-b124-d1fb0231acc0/scratchpad/"
script=re.sub(r"\[[^\]]*\]","",open(SP+"ru_final.txt").read()).replace("**","")
P=[p.strip() for p in script.split("\n\n") if p.strip()]
i=P[8].index("crude supplier.")+len("crude supplier."); e1,f1=P[8][:i],P[8][i:].strip()
chunks=[(0.0,29.9,P[0]+" "+P[1]),(29.9,54.7,P[2]),(54.7,105.3,P[3]+" "+P[4]),(104.95,124.96,P[5]),(124.96,143.55,P[6]+" "+P[7]),(143.55,160.6,e1),(160.6,None,f1+" "+P[9])]
OOV={"oleshky":"OW L EH SH K IY","dnipro":"D N IY P R OW","kherson":"K EH R S AO N","zaporizhzhia":"Z AA P AO R IH ZH Y AH",
"donbas":"D AA N B AA S","deepstate":"D IY P S T EY T","iaea":"AY EY IY EY","donetsk":"D AH N Y EH T S K",
"luhansk":"L UW HH AA N S K","kyiv":"K IY IY V","modi's":"M OW D IY Z"}
ALT={"zaporizhzhia(2)":"Z AA P AO R IY ZH AH","zaporizhzhia(3)":"Z AE P ER IH Z IY AH","iaea(2)":"AY AE IY AE","donbas(2)":"D AH N B AE S","kyiv(2)":"K IY V","dnipro(2)":"N IY P R OW"}
def norm(t):
    t=t.replace("2014","twenty fourteen").replace("2022","twenty twenty two")
    t=t.lower().replace("—"," ").replace("-"," ").replace("’","'")
    return re.sub(r"[^a-z' ]"," ",t).split()
w=wave.open(SP+"video/vo3_16.wav"); sr=w.getframerate(); raw=w.readframes(w.getnframes()); total=len(raw)/2/sr
def align(s,e,words):
    d=Decoder(samprate=16000, loglevel="FATAL")
    for k,v in OOV.items():
        if d.lookup_word(k) is None: d.add_word(k,v,True)
    for k,v in ALT.items(): d.add_word(k,v,True)
    d.set_align_text(" ".join(words))
    d.start_utt(); d.process_raw(raw[int(s*sr)*2:int(e*sr)*2],full_utt=True); d.end_utt()
    if d.hyp() is None: return None
    got=[(sg.word.split("(")[0], s+sg.start_frame/100, s+sg.end_frame/100) for sg in d.seg()
         if not sg.word.startswith(("<","[","+"))]
    return got if len(got)==len(words) else None
results=[]
for s0,e0,text in chunks:
    e0=e0 or total; words=norm(text); best=None
    for ds,de in [(0,0),(0,0.6),(-0.2,0.4),(0.2,0),(0,1.2),(-0.4,0.8),(0.3,-0.3)]:
        s=max(0,s0+ds); e=min(total,e0+de)
        best=align(s,e,words)
        if best: print(f"chunk {s0}-{e0:.1f}: OK with pad {ds},{de}"); break
    if not best:
        n=len(words); best=[(words[k], s0+(e0-s0)*k/n, s0+(e0-s0)*(k+1)/n) for k in range(n)]
        print(f"chunk {s0}-{e0:.1f}: FALLBACK proportional")
    results.append({"start":s0,"end":e0,"text":text,"words":best})
json.dump(results,open(SP+"video/align.json","w"),indent=1)
