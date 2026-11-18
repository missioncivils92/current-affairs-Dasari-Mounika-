"""Transcribe the owner's own (unscripted) take with Whisper, so cards can be lined up with what she actually said.

Uses sherpa-onnx (pip install sherpa-onnx) and the Whisper "small" ONNX model from the sherpa-onnx GitHub release
(huggingface.co is blocked in the cloud sessions; github.com is not):
  curl -L -o w.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2
  tar xjf w.tar.bz2   # -> sherpa-onnx-whisper-small/
The audio is cut at pauses into chunks of 8-20 s (Whisper's window is 30 s) and each chunk is decoded in English;
the output lists [start, end, text] per chunk. Telugu lines come out garbled: read them from the take.

Usage: python3 -I transcribe.py <audio> <out.json> <model_dir>
Then write an as-recorded script (rows in her order, cleaned transcript as narration) and set row starts from the
chunk times and the pauses (see weeks/2026-W47/short-earthshot-prize/02b-as-recorded-script.md).
"""
import sys, subprocess, numpy as np, sherpa_onnx, json
wav, out = sys.argv[1], sys.argv[2]; M = sys.argv[3]
pcm = subprocess.run(['ffmpeg','-v','error','-i',wav,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True,check=True).stdout
x = np.frombuffer(pcm, np.float32); sr = 16000
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f'{M}/small-encoder.int8.onnx', decoder=f'{M}/small-decoder.int8.onnx', tokens=f'{M}/small-tokens.txt', language='en', task='transcribe', num_threads=4)
w = int(0.05*sr); e = np.array([np.sqrt(np.mean(x[i:i+w]**2)) for i in range(0, len(x)-w, w)]); thr = np.percentile(e, 20)*1.8
cuts=[0]; last=0
for k in range(len(e)):
    t=k*0.05
    if t-last>=8 and e[k]<thr and (k+3<len(e) and max(e[k:k+3])<thr):
        cuts.append(t+0.075); last=t+0.075
    elif t-last>=20: cuts.append(t); last=t
cuts.append(len(x)/sr)
res=[]
for a,b in zip(cuts[:-1],cuts[1:]):
    s=rec.create_stream(); s.accept_waveform(sr, x[int(a*sr):int(b*sr)]); rec.decode_stream(s)
    txt=s.result.text.strip(); res.append([round(a,2),round(b,2),txt]); print(f'{a:6.1f}-{b:6.1f} {txt}', flush=True)
json.dump(res, open(out,'w'), indent=1)
