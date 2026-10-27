import json, re, math, wave, array
SP="/tmp/claude-0/-home-user-current-affairs-Dasari-Mounika-/b50d1a5d-2e57-5234-b124-d1fb0231acc0/scratchpad/"
raw=json.load(open(SP+"video/timeline_raw.json")); toks=raw["tokens"]; dur=raw["dur"]
FPS=30; END=3.0; TOTAL=dur+END
spoken=[t for t in toks if t.get("t")]; dipl=[t for t in toks if t.get("dipl")][0]
def clean(s): return re.sub(r"[^a-z0-9 ]","",s.lower().replace("—"," ").replace("-"," "))
seq=[clean(t["t"]) for t in spoken]
def at(ph, after=0.0):
    p=clean(ph).split()
    for i in range(len(spoken)):
        if spoken[i]["ms"]<after: continue
        if " ".join(seq[i:i+len(p)]).split()[:len(p)]==p: return round(spoken[i]["ms"],3)
    raise SystemExit("not found: "+ph)
d0,d1=dipl["ms"],dipl["me"]
S=[]
def sc(start,kind,**kw): kw.update(start=round(start,3),kind=kind); S.append(kw)
sc(0,"hook",b=[at("The war")])
sc(at("From the twenty-seventh"),"truce",b=[at("Oleshky"),at("across the Dnipro"),at("clear mines"),at("bring in aid"),at("let civilians")])
sc(at("It is local."),"temp",b=[at("It is temporary."),at("And it shows")])
sc(at("First — why"),"why2014",b=[at("Russia annexed"),at("fighting began")])
sc(at("Then, on"),"why2022",b=[at("full-scale invasion")])
sc(at("Russia cites"),"claims",b=[at("Ukraine calls")])
sc(at("Now — the numbers"),"days",b=[at("The war has passed")])
sc(at("Russia controls"),"control",b=[at("Crimea included")])
sc(at("The human cost"),"cost328",b=[at("In September alone")])
sc(at("From January"),"cost2570",b=[at("Total civilian")])
sc(at("Nearly five point eight"),"refugees",b=[at("Another three")])
sc(at("And there is a nuclear"),"nuclear",b=[at("Europe's largest"),at("lost all outside"),at("An IAEA-brokered")])
sc(d0,"diplomacy",b=[d0+(d1-d0)*0.42,d0+(d1-d0)*0.7])
sc(at("Prelims Trap."),"trap",b=[at("Donbas means"),at("not Crimea")])
sc(at("Finally — India."),"india",b=[at("India has abstained"),at("calls for dialogue")])
sc(at("Prime Minister Modi's"),"quote",b=[at("this is not")])
sc(at("And Russia remains"),"oil",b=[at("In September — about"),at("That is roughly")])
sc(at("For Mains,"),"mains",b=[at("India's strategic"),at("between energy"),at("rules-based")])
sc(dur+0.05,"end",b=[])
for i,s in enumerate(S): s["end"]=round(S[i+1]["start"] if i+1<len(S) else TOTAL,3)
# sentences (full script on screen)
sents=[]; cur=[]
for t in spoken:
    if cur and t["ms"]-cur[-1]["me"]>1.2: sents.append(cur); cur=[]
    cur.append(t)
    if re.search(r"[.?!]$",t["t"]): sents.append(cur); cur=[]
if cur: sents.append(cur)
sen=[{"s":round(x[0]["ms"]-0.15,3),"e":round(x[-1]["me"]+0.35,3),"w":[[re.sub(r" ([.,;:!?])",r"\1",w["t"]),w["ms"],w["me"]] for w in x]} for x in sents]
for i in range(len(sen)-1): sen[i]["e"]=min(sen[i]["e"],sen[i+1]["s"]) if sen[i+1]["s"]>sen[i]["s"]+0.5 else sen[i]["e"]
# diplomacy region: static fact lines (no word timing there)
sen.append({"s":round(d0,3),"e":round(d1,3),"static":"Talks expected in mid-November, possibly in Abu Dhabi — no date fixed. Moscow reportedly wants the rest of the Donbas; Kyiv calls territory a red line."})
sen.sort(key=lambda x:x["s"])
# envelope
wv=wave.open(SP+"video/vo_clean.wav"); sr=wv.getframerate(); ch=wv.getnchannels(); a=array.array("h",wv.readframes(wv.getnframes()))
spf=sr//FPS; env=[]
for f in range(int(TOTAL*FPS)+1):
    seg=a[f*spf*ch:(f*spf+spf)*ch:ch*8]
    env.append(round(min(1,(math.sqrt(sum(x*x for x in seg)/len(seg))/32768*4.5) if len(seg) else 0),3))
json.dump({"fps":FPS,"total":round(TOTAL,3),"dur":dur,"scenes":S,"sents":sen,"env":env},open(SP+"v3/timeline3.json","w"))
print("scenes",len(S),"sentences",len(sen),"total",round(TOTAL,2))
