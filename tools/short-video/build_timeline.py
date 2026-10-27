import re, json, wave, subprocess
exec(open("align.py").read().split("results=[]")[0])   # gives P, norm, align, raw, sr, total
V="video/"
trapB=P[7].split("And Zaporizhzhia")[0].strip()
chunks=[(0.0,29.9,P[0]+" "+P[1]),(28.6,54.7,P[2]),(54.7,105.3,P[3]+" "+P[4]),(104.95,124.96,P[5]),
        (124.96,137.4,None),(137.4,143.55,trapB),(143.55,160.6,e1),(160.6,total,f1+" "+P[9])]
tokens=[]  # display tokens with times
regions=[] # speech regions for trimming
for s,e,text in chunks:
    if text is None:
        regions.append((s,e)); tokens.append({"t":None,"s":s,"e":e,"dipl":True}); continue
    words=norm(text)
    r=None
    for ds,de in [(0,0),(-0.6,0.8),(-1.2,1.6),(0,0.6),(-0.2,0.4)]:
        r=align(max(0,s+ds),min(total,e+de),words)
        if r: break
    assert r, ("align failed",s)
    k=0
    for tok in text.split():
        n=len(norm(tok))
        if n==0:
            if tokens and tokens[-1].get("t"): tokens[-1]["t"]+=" "+tok
            continue
        ws=r[k:k+n]; k+=n
        tokens.append({"t":tok,"s":ws[0][1],"e":ws[-1][2]})
    regions.append((r[0][1],r[-1][2]))
# --- pause trimming: gaps between consecutive timed tokens > 0.5s become 0.32s
times=[]
for t in tokens: times.append((t["s"],t["e"]))
times.sort()
keep=[]; cur_s=max(0,times[0][0]-0.15); cur_e=times[0][1]
for s,e in times[1:]:
    if s-cur_e>0.5:
        keep.append((cur_s,cur_e+0.16)); cur_s=s-0.16
    cur_e=max(cur_e,e)
keep.append((cur_s,min(total,cur_e+0.45)))
def mapt(t):
    acc=0
    for a,b in keep:
        if t<a: return acc
        if t<=b: return acc+(t-a)
        acc+=b-a
    return acc
newdur=sum(b-a for a,b in keep)
print("original %.2fs -> trimmed %.2fs, %d segments"%(total,newdur,len(keep)))
for t in tokens: t["ms"]=round(mapt(t["s"]),3); t["me"]=round(mapt(t["e"]),3)
json.dump({"tokens":tokens,"keep":keep,"dur":newdur},open(V+"timeline_raw.json","w"),indent=0)
# audio cut + clean + loudness
filt="".join(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[a{i}];" for i,(a,b) in enumerate(keep))
filt+="".join(f"[a{i}]" for i in range(len(keep)))+f"concat=n={len(keep)}:v=0:a=1,highpass=f=80,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,loudnorm=I=-14:TP=-1.5:LRA=11[out]"
subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",V+"vo3.mp3","-filter_complex",filt,"-map","[out]","-ar","48000","-ac","2",V+"vo_clean.wav"],check=True)
print("audio written")
