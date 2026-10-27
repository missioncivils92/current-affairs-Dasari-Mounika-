"""Self-made sound design for a timeline: an ambient pad, a muted bell per "Pause and answer" hold, a page turn
for the Update Desk (CLAUDE.md §6.6). Everything is synthesised here, so there is nothing to license.

The pad sits low under the narration (ducked about 10 dB wherever the voice is active) and rises in the silent holds
and under the end screen, so a pause never sounds like dead air.

Usage: python3 -I sound_bed.py <timeline.json> <out.wav> [--voice final_audio.wav]
  With --voice, the output is the finished mix (voice + bed, loudness-normalised to about -14 LUFS).
  Without it, the output is the bed alone (for silent review previews).
"""
import json, os, subprocess, sys
import numpy as np

tl = json.load(open(sys.argv[1])); out = sys.argv[2]
voice = sys.argv[sys.argv.index("--voice") + 1] if "--voice" in sys.argv else None
SR = 48000; N = int(tl["duration"] * SR) + SR; t = np.arange(N) / SR
rng = np.random.default_rng(7)

def smooth(x, n):            # moving average via cumulative sums (np.convolve is far too slow on 40M samples)
    c = np.cumsum(np.pad(x, (n // 2, n - n // 2)), dtype=np.float64)
    return (c[n:] - c[:-n])[:len(x)] / n

# --- ambient pad: a slow, open A-minor chord with drifting partials
pad = np.zeros(N)
for f, a in [(55, 0.5), (110, 0.6), (164.81, 0.35), (220, 0.3), (261.63, 0.22), (329.63, 0.16)]:
    lfo = 0.6 + 0.4 * np.sin(2 * np.pi * (0.03 + f / 9000) * t + f)
    pad += a * lfo * np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.07 * t))
pad /= np.max(np.abs(pad))

# --- level curve: low by default, up in holds and under the end screen
lvl = np.full(N, 10 ** (-30 / 20))
def ramp_to(a, b, db, fade=0.6):
    i0, i1 = int(a * SR), min(N, int(b * SR)); g = 10 ** (db / 20); k = int(fade * SR)
    seg = np.full(i1 - i0, g); seg[:k] = np.linspace(lvl[i0], g, min(k, len(seg)))
    lvl[i0:i1] = np.maximum(lvl[i0:i1], seg)
sfx = np.zeros(N)
def bell(at):
    i = int(at * SR); n = min(N - i, 3 * SR); x = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * x) * np.exp(-x * d) for f, a, d in [(880, 1, 2.2), (2428.8, 0.35, 4), (1760, 0.2, 3)])
    sfx[i:i + n] += 0.12 * s
def page_turn(at):
    i = int(at * SR); n = min(N - i, int(0.45 * SR)); x = np.arange(n) / SR
    noise = np.convolve(rng.standard_normal(n), np.ones(12) / 12, mode="same")
    sfx[i:i + n] += 0.10 * noise * np.sin(np.pi * x / x[-1]) ** 2
for r in tl["rows"]:
    for at, dur in r.get("holds", []):
        ramp_to(r["start"] + at, r["start"] + at + dur, -20)
        if dur >= 5:
            bell(r["start"] + at)
    if "Decode Archive" in r["visual"]:
        page_turn(r["start"] + 0.2)
    if "End-screen" in r["visual"]:
        ramp_to(r["start"], tl["duration"], -19, fade=2.0)
lvl[-2 * SR:] *= np.linspace(1, 0, 2 * SR)                                 # fade out
bed = pad * smooth(lvl, SR // 4) + sfx

def write(y, path, norm):
    raw = path + ".raw.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", raw], input=y.astype(np.float32).tobytes(), check=True)
    af = "loudnorm=I=-14:TP=-1.5:LRA=11" if norm else "anull"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", af, "-ar", str(SR), "-ac", "2", path], check=True)
    os.remove(raw)

if voice:
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", voice, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    v = np.frombuffer(pcm, np.float32)[:N]; v = np.pad(v, (0, N - len(v)))
    env = np.sqrt(np.maximum(smooth(v.astype(np.float64) ** 2, SR // 5), 0))
    duck = 1 - 0.68 * np.clip(env / (np.percentile(env, 90) + 1e-9), 0, 1)       # about -10 dB under speech
    write(v + bed * duck, out, True)
else:
    write(bed, out, False)
print(out, f"{tl['duration']:.1f}s", "mix" if voice else "bed only")
