"""Build the narration track for an aligned timeline (one cut).

Follows the timeline's "audio_plan" from timeline.py --align: keeps only this cut's source spans, inserts the silent
holds (countdowns, recap hold, end-screen tail) inside their rows, joins spans with 10 ms fades, pads to the video
length and loudness-normalises to about -14 LUFS (YouTube's reference).

Usage: python3 -I build_audio.py <timeline.json> <source_audio (mp3/wav)> <out.wav>
Writes <out>_env.json (voice level at 30 fps) for the Decode Desk waveform.
"""
import json, os, subprocess, sys
import numpy as np

tl, src, out = json.load(open(sys.argv[1])), sys.argv[2], sys.argv[3]
assert "audio_plan" in tl, "timeline has no audio_plan: build it with timeline.py --align"
SR = 48000
pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
a = np.frombuffer(pcm, np.float32)
fade = int(0.01 * SR); ramp = np.linspace(0, 1, fade, dtype=np.float32)
parts = []
for op in tl["audio_plan"]:
    if op[0] == "src":
        seg = a[int(op[1] * SR):int(op[2] * SR)].copy()
        if len(seg) > 2 * fade:
            seg[:fade] *= ramp; seg[-fade:] *= ramp[::-1]
        parts.append(seg)
    else:
        parts.append(np.zeros(int(op[1] * SR), np.float32))
y = np.concatenate(parts)
drift = len(y) / SR - tl["duration"]
assert abs(drift) < 0.5, f"audio plan and timeline disagree by {drift:.2f}s"
y = np.concatenate([y, np.zeros(max(0, int(tl["duration"] * SR) - len(y)), np.float32)])
tmp = out + ".raw.wav"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", tmp], input=y.tobytes(), check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-af", "highpass=f=70,loudnorm=I=-14:TP=-1.5:LRA=11",
                "-ar", str(SR), "-ac", "2", out], check=True)
os.remove(tmp)
holds = sum(1 for op in tl["audio_plan"] if op[0] == "sil")
print(out, f"{len(y) / SR:.1f}s", f"{holds} silences inserted", f"cut {tl.get('cut')}")

# voice level envelope at 30 fps (0..1) for the Decode Desk waveform
pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", out, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
z = np.frombuffer(pcm, np.float32); hop = 48000 // 30
rms = np.sqrt(np.array([np.mean(z[i:i + hop] ** 2) for i in range(0, len(z) - hop, hop)]) + 1e-9)
env = np.clip((20 * np.log10(rms) + 50) / 40, 0, 1)
env = np.convolve(env, np.ones(3) / 3, mode="same")
json.dump([round(float(v), 3) for v in env], open(out.rsplit(".", 1)[0] + "_env.json", "w"))
