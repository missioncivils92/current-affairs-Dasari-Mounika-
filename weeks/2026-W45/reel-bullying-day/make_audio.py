"""Soft ambient pad (Am-F-C-G-Am-F-C) plus phone-notification pings for the hook. Writes bed.wav (44.1 kHz stereo)."""
import numpy as np, wave, sys
SR=44100; TOTAL=43.0; n=int(SR*TOTAL); t=np.arange(n)/SR
N=lambda m:440*2**((m-69)/12)
chords=[(0,9,[57,60,64,45]),(9,14.5,[53,57,60,41]),(14.5,19.5,[52,55,60,48]),(19.5,26,[50,55,59,43]),
        (26,31.5,[57,60,64,45]),(31.5,37,[53,57,60,41]),(37,43,[52,55,60,64,48])]
out=np.zeros(n)
for s,e,notes in chords:
    env=np.clip((t-s)/1.2,0,1)*np.clip((e+0.8-t)/1.2,0,1)
    for m in notes:
        f=N(m)
        for det in (-0.6,0.6):
            out+=env*(np.sin(2*np.pi*(f+det)*t)+0.25*np.sin(2*np.pi*2*(f+det)*t))*(0.6 if m<50 else 1)
out*=1+0.08*np.sin(2*np.pi*0.25*t)            # slow swell
# soft plucked melody on the closing chord
for i,(st,m) in enumerate([(37.4,72),(38.2,76),(39.0,79),(39.8,76),(40.6,74),(41.4,72)]):
    d=t-st; m_=(d>=0)&(d<2.0); out[m_]+=1.6*np.sin(2*np.pi*N(m)*d[m_])*np.exp(-d[m_]*2.2)
out=out/np.max(np.abs(out))*0.18
# notification pings
for p in (1.2,2.0,2.8,3.5):
    d=t-p; m_=(d>=0)&(d<0.35)
    out[m_]+=0.22*(np.sin(2*np.pi*1318.5*d[m_])+0.5*np.sin(2*np.pi*1975.5*d[m_]))*np.exp(-d[m_]*14)
out*=np.clip(t/0.4,0,1)*np.clip((TOTAL-t)/1.5,0,1)
st=np.stack([out,out*0.97],1)
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(st,-1,1)*32767).astype('<i2').tobytes()); w.close()
