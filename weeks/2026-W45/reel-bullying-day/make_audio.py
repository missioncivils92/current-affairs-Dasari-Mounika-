"""Usage: python3 make_audio.py out.wav [28|45|50]. Soft ambient pad (Am-F-C-G-Am-F-C) plus phone-notification pings for the hook. Writes bed.wav (44.1 kHz stereo)."""
import numpy as np, wave, sys
CUT = sys.argv[2] if len(sys.argv) > 2 else ""
CUT28 = CUT == "28"; CUT50 = CUT == "50"; CUT45 = CUT in ("45", "50")
SC = 50/45 if CUT50 else 1.0
SR=44100; TOTAL=28.0 if CUT28 else (45.0*SC if CUT45 else 43.0); n=int(SR*TOTAL); t=np.arange(n)/SR
N=lambda m:440*2**((m-69)/12)
chords=[(0,9,[57,60,64,45]),(9,14.5,[53,57,60,41]),(14.5,19.5,[52,55,60,48]),(19.5,26,[50,55,59,43]),
        (26,31.5,[57,60,64,45]),(31.5,37,[53,57,60,41]),(37,43,[52,55,60,64,48])]
if CUT45: chords=[(0,9.5,[57,60,64,45]),(9.5,14.5,[53,57,60,41]),(14.5,21,[52,55,60,48]),(21,27.5,[50,55,59,43]),(27.5,32.5,[57,60,64,45]),(32.5,38,[53,57,60,41]),(38,45,[52,55,60,64,48])]
if CUT28: chords=[(0,9.5,[57,60,64,45]),(9.5,14.5,[53,57,60,41]),(14.5,19.5,[50,55,59,43]),(19.5,24.5,[53,57,60,41]),(24.5,28,[52,55,60,64,48])]
if CUT50: chords=[(a*SC,b*SC,nn) for a,b,nn in chords]
out=np.zeros(n)
for s,e,notes in chords:
    env=np.clip((t-s)/1.2,0,1)*np.clip((e+0.8-t)/1.2,0,1)
    for m in notes:
        f=N(m)
        for det in (-0.6,0.6):
            out+=env*(np.sin(2*np.pi*(f+det)*t)+0.25*np.sin(2*np.pi*2*(f+det)*t))*(0.6 if m<50 else 1)
out*=1+0.08*np.sin(2*np.pi*0.25*t)            # slow swell
# soft plucked melody on the closing chord
MEL=[(37.4,72),(38.2,76),(39.0,79),(39.8,76),(40.6,74),(41.4,72)]
if CUT28: MEL=[(24.8,72),(25.5,76),(26.2,79),(26.9,76)]
if CUT45: MEL=[(38.4,72),(39.2,76),(40.0,79),(40.8,76),(41.6,74),(42.4,72)]
if CUT50: MEL=[(a*SC,b) for a,b in MEL]
for i,(st,m) in enumerate(MEL):
    d=t-st; m_=(d>=0)&(d<2.0); out[m_]+=1.6*np.sin(2*np.pi*N(m)*d[m_])*np.exp(-d[m_]*2.2)
out=out/np.max(np.abs(out))*0.18
# notification pings
for p in ((1.11,1.78,2.44,3.11) if CUT50 else ((1.0,1.6,2.2,2.8) if (CUT28 or CUT45) else (1.2,2.0,2.8,3.5))):
    d=t-p; m_=(d>=0)&(d<0.35)
    out[m_]+=0.22*(np.sin(2*np.pi*1318.5*d[m_])+0.5*np.sin(2*np.pi*1975.5*d[m_]))*np.exp(-d[m_]*14)
out*=np.clip(t/0.4,0,1)*np.clip((TOTAL-t)/1.5,0,1)
st=np.stack([out,out*0.97],1)
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(st,-1,1)*32767).astype('<i2').tobytes()); w.close()
