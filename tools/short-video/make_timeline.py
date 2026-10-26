import json, re, wave, struct, math
V="/tmp/claude-0/-home-user-current-affairs-Dasari-Mounika-/b50d1a5d-2e57-5234-b124-d1fb0231acc0/scratchpad/video/"
raw=json.load(open(V+"timeline_raw.json")); toks=raw["tokens"]; dur=raw["dur"]
FPS=30; END_CARD=2.6; TOTAL=dur+END_CARD
spoken=[t for t in toks if t.get("t")]
dipl=[t for t in toks if t.get("dipl")][0]
def clean(s): return re.sub(r"[^a-z0-9 ]","",s.lower().replace("—"," ").replace("-"," "))
seq=[clean(t["t"]) for t in spoken]
def at(phrase, after=0.0):
    p=clean(phrase).split()
    for i in range(len(spoken)):
        if spoken[i]["ms"]<after: continue
        got=" ".join(seq[i:i+len(p)]).split()[:len(p)]
        if got==p: return spoken[i]["ms"]
    raise SystemExit("phrase not found: "+phrase)
d0=dipl["ms"]; d1=dipl["me"]
cards=[]
def card(start, **kw): kw["start"]=round(start,3); cards.append(kw); return kw
c=card(0,kind="title",section=None,lines=["One town gets a truce.","The war does not."],reveal=[0,at("The war")])
c=card(at("From the twenty-seventh"),kind="stat",section="THE LATEST",value="27 OCT",label="Local truce around Oleshky",sub="Across the Dnipro from Kherson",
       chips=["Clear mines","Bring in aid","Let civilians leave"],chipAt=at("clear mines"))
c=card(at("It is local."),kind="title",section="THE LATEST",lines=["Local.","Temporary."],reveal=[at("It is local."),at("It is temporary.")],sub="A full ceasefire is still missing",subAt=at("And it shows"))
c=card(at("First — why"),kind="timeline",section="WHY THIS WAR",steps=[["2014","Crimea annexed · fighting in the Donbas",at("The roots")],["24 FEB 2022","Full-scale invasion",at("Then, on")]])
c=card(at("Russia cites"),kind="duo",section="WHY THIS WAR",left=["RUSSIA SAYS","NATO's eastward expansion"],right=["UKRAINE SAYS","An attack on a sovereign state"],rightAt=at("Ukraine calls"))
c=card(at("Now — the numbers"),kind="stat",section="THE NUMBERS",value="1,706",count=1706,label="days of full-scale war",sub="24 Feb 2022 → 27 Oct 2026")
c=card(at("Russia controls"),kind="stat",section="THE NUMBERS",value="~19%",count=19,prefix="~",suffix="%",label="of Ukraine under Russian control",sub="Crimea included · DeepState map, 19 Oct 2026")
c=card(at("The human cost"),kind="stat",section="HUMAN COST",value="328",count=328,label="civilians killed in September 2026",sub="Verified by UN human rights monitors",valueAt=at("In September alone"))
c=card(at("From January"),kind="stat",section="HUMAN COST",value="2,570",count=2570,label="civilians killed · Jan–Sep 2026",sub="Casualties up 59% on the same months of 2025",subAt=at("Total civilian"))
c=card(at("Nearly five point eight"),kind="stat",section="HUMAN COST",value="5.8 mn",label="Ukrainians living as refugees",line2="3.8 mn displaced inside Ukraine",line2At=at("Another three"),sub="UNHCR · July 2026")
c=card(at("And there is a nuclear"),kind="stat",section="NUCLEAR RISK",value="Zaporizhzhia",small=True,label="Europe's largest nuclear plant",line2="Aug 2026: all outside power lost",line2At=at("lost all outside"),sub="Sept: IAEA-brokered local truce → repairs",subAt=at("An IAEA-brokered"))
c=card(d0,kind="stat",section="DIPLOMACY",value="Mid-Nov",small=True,label="Talks expected",sub="Possibly Abu Dhabi · no date fixed")
c=card(d0+(d1-d0)*0.5,kind="duo",section="DIPLOMACY",left=["MOSCOW (REPORTEDLY)","Wants the rest of the Donbas"],right=["KYIV","Territory is a red line"],rightAt=d0+(d1-d0)*0.72)
c=card(at("Prelims Trap."),kind="trap",section="PRELIMS TRAP",big="Donbas = Donetsk + Luhansk",notText="NOT Crimea",notAt=at("not Crimea"))
c=card(at("Finally — India."),kind="stat",section="INDIA ANGLE",value="UN votes",small=True,label="India has abstained",sub="Calls for dialogue and diplomacy",subAt=at("calls for dialogue"))
c=card(at("Prime Minister Modi's"),kind="quote",section="INDIA ANGLE",quote="“This is not an era of war.”",by="PM Narendra Modi")
c=card(at("And Russia remains"),kind="stat",section="INDIA ANGLE",value="No. 1",small=True,label="Russia: India's largest crude supplier")
c=card(at("In September — about"),kind="stat",section="INDIA ANGLE",value="1.8 mn",label="barrels a day from Russia · Sept 2026",sub="≈ one-third of India's oil imports · Kpler",subAt=at("That is roughly"))
c=card(at("For Mains,"),kind="title",section="MAINS LINE",lines=["Strategic autonomy"],reveal=[at("For Mains,")],sub="Energy security vs a rules-based order",subAt=at("between energy"))
card(dur+0.05,kind="end",section=None)
for i,c in enumerate(cards): c["end"]=round(cards[i+1]["start"] if i+1<len(cards) else TOTAL,3)
# captions: phrases, skip the opening hook card and the diplomacy region (no reliable words there)
hook_end=cards[1]["start"]
phrases=[]; cur=[]
for t in spoken:
    if t["ms"]<hook_end-0.05: continue
    if cur and (t["ms"]-cur[-1]["me"]>0.9): phrases.append(cur); cur=[]
    cur.append(t)
    if re.search(r"[.?!,—:]$",t["t"]) or t["t"]=="—" or len(cur)>=6: phrases.append(cur); cur=[]
if cur: phrases.append(cur)
caps=[]
for i,p in enumerate(phrases):
    s=p[0]["ms"]; e=p[-1]["me"]+0.25
    if i+1<len(phrases): e=min(max(e,s+0.6),phrases[i+1][0]["ms"])
    caps.append({"s":round(s,3),"e":round(e,3),"w":[[w["t"],w["ms"],w["me"]] for w in p]})
# audio envelope per frame
w=wave.open(V+"vo_clean.wav"); sr=w.getframerate(); ch=w.getnchannels(); n=w.getnframes()
data=w.readframes(n); import array; a=array.array("h",data)
spf=sr//FPS; env=[]
for f in range(int(TOTAL*FPS)+1):
    i0=f*spf*ch; seg=a[i0:i0+spf*ch:ch*8]
    rms=math.sqrt(sum(x*x for x in seg)/len(seg))/32768 if len(seg) else 0
    env.append(round(min(1,rms*4.5),3))
json.dump({"fps":FPS,"total":round(TOTAL,3),"dur":round(dur,3),"cards":cards,"caps":caps,"env":env},open(V+"timeline.json","w"))
print("cards",len(cards),"captions",len(caps),"total %.2fs frames %d"%(TOTAL,int(TOTAL*FPS)))
