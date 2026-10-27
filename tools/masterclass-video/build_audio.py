"""Build the final narration track for an aligned timeline.

Inserts the silences listed in timeline.json ("inserts": countdown cards, recap holds), pads the tail to the video
length, and loudness-normalises to about -14 LUFS (YouTube's reference).

Usage: python3 -I build_audio.py <timeline.json> <source_audio (mp3/wav)> <out.wav>
"""
import json, subprocess, sys
import numpy as np

tl, src, out = json.load(open(sys.argv[1])), sys.argv[2], sys.argv[3]
SR = 48000
pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
a = np.frombuffer(pcm, np.float32)
parts, last = [], 0
for at, dur in sorted(tl.get("inserts", [])):
    k = int(at * SR); parts += [a[last:k], np.zeros(int(dur * SR), np.float32)]; last = k
parts.append(a[last:])
y = np.concatenate(parts)
y = np.concatenate([y, np.zeros(max(0, int(tl["duration"] * SR) - len(y)), np.float32)])
tmp = out + ".raw.wav"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", tmp], input=y.tobytes(), check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-af", "highpass=f=70,loudnorm=I=-14:TP=-1.5:LRA=11",
                "-ar", str(SR), "-ac", "2", out], check=True)
print(out, f"{len(y) / SR:.1f}s", f"{len(tl.get('inserts', []))} pauses inserted")

# loudness envelope at 30 fps (0..1) for the Decode Desk waveform
pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", out, "-ac", "1", "-ar", "48000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
z = np.frombuffer(pcm, np.float32); hop = 48000 // 30
rms = np.sqrt(np.array([np.mean(z[i:i + hop] ** 2) for i in range(0, len(z) - hop, hop)]) + 1e-9)
env = np.clip((20 * np.log10(rms) + 50) / 40, 0, 1)
env = np.convolve(env, np.ones(3) / 3, mode="same")
json.dump([round(float(v), 3) for v in env], open(out.rsplit(".", 1)[0] + "_env.json", "w"))
