"""Self-made sound design for a timeline: an ambient pad, a muted bell per "Pause and answer" hold, a page turn
for the Update Desk (CLAUDE.md §6.6). Everything is synthesised here, so there is nothing to license.

The pad sits low under the narration (6 dB down overall, ducked about 14 dB more wherever the voice is active) and rises in the silent holds
and under the end screen, so a pause never sounds like dead air.

With --pulse (breadth segments: Prelims Grid, AP–TG Desk) it adds a light rhythmic music bed (92 bpm: soft kick, hat,
a plucked A-minor progression), a whoosh on every card change, a low impact where the card settles into its notes
frame (about 2 s before "Prelims Trap") and a soft two-note chime on the trap itself.

Usage: python3 -I sound_bed.py <timeline.json> <out.wav> [--voice final_audio.wav] [--pulse]
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

if "--pulse" in sys.argv:
    def env_add(buf, at, sig, g):
        i = max(0, int(at * SR)); n = min(len(sig), N - i)
        if n > 0: buf[i:i + n] += g * sig[:n]
    music = np.zeros(N); beat = 60 / 92
    kick = (lambda x: np.sin(2 * np.pi * (50 * x + 35 * (1 - np.exp(-x * 30)) / 30)) * np.exp(-x * 9))(np.arange(int(0.35 * SR)) / SR)
    hat = np.diff(rng.standard_normal(int(0.05 * SR) + 1)) * np.exp(-np.arange(int(0.05 * SR)) / SR * 90)
    def pluck(fs, dur=1.6):
        x = np.arange(int(dur * SR)) / SR
        return sum(np.sign(np.sin(2 * np.pi * f * x)) * 0.25 * np.exp(-x * 3.2) * (1 - np.exp(-x * 400)) for f in fs) / len(fs)
    chords = [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]]   # Am F C G
    bass = [55, 43.65, 65.41, 49]
    k = 0; tb = 0.0
    while tb < tl["duration"]:
        env_add(music, tb, kick, 0.55 if k % 2 == 0 else 0.0)
        env_add(music, tb + beat / 2, hat, 0.10)
        env_add(music, tb, hat, 0.06)
        if k % 4 == 0:
            bar = (k // 4) % 4
            env_add(music, tb, pluck(chords[bar]), 0.16)
            xb = np.arange(int(4 * beat * SR)) / SR
            env_add(music, tb, np.sin(2 * np.pi * bass[bar] * xb) * np.exp(-xb * 0.8), 0.22)
        k += 1; tb += beat
    lo = np.convolve(music, np.ones(6) / 6, mode="same")                    # soften the top end
    fade = np.clip(np.minimum(t / 2.0, (tl["duration"] - t) / 2.0), 0, 1)
    bed += 10 ** (-17 / 20) * lo / (np.max(np.abs(lo)) + 1e-9) * fade

    def whoosh(at, g=0.12):
        n = int(0.7 * SR); x = np.arange(n) / SR
        w = np.convolve(rng.standard_normal(n), np.ones(30) / 30, mode="same") * np.sin(np.pi * x / x[-1]) ** 2
        env_add(sfx2, at - 0.2, w * (0.4 + 0.6 * x / x[-1]), g)
    def impact(at):
        x = np.arange(int(0.9 * SR)) / SR
        env_add(sfx2, at, np.sin(2 * np.pi * 58 * x) * np.exp(-x * 5) + 0.3 * np.sin(2 * np.pi * 116 * x) * np.exp(-x * 9), 0.30)
    def chime(at):
        x = np.arange(int(1.2 * SR)) / SR
        for dt, f in [(0, 659.25), (0.14, 987.77)]:
            env_add(sfx2, at + dt, np.sin(2 * np.pi * f * x) * np.exp(-x * 5) * (1 - np.exp(-x * 300)), 0.07)
    sfx2 = np.zeros(N)
    for r in tl["rows"]:
        whoosh(r["start"])
        words = [w for w, _ in r.get("wt", [])]
        for i in range(len(words) - 1):
            if words[i] == "prelims" and words[i + 1].startswith("trap"):
                pt = r["start"] + r["wt"][i][1]
                impact(max(r["start"] + 3.0, pt - 2.2)); chime(pt)
                break
    bed += sfx2

def write(y, path, norm):
    raw = path + ".raw.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", raw], input=y.astype(np.float32).tobytes(), check=True)
    af = {True: "loudnorm=I=-14:TP=-1.5:LRA=11", "preview": "loudnorm=I=-20:TP=-3:LRA=11"}.get(norm, "anull")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af", af, "-ar", str(SR), "-ac", "2", path], check=True)
    os.remove(raw)

if voice:
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", voice, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    v = np.frombuffer(pcm, np.float32)[:N]; v = np.pad(v, (0, N - len(v)))
    env = np.sqrt(np.maximum(smooth(v.astype(np.float64) ** 2, SR // 5), 0))
    # owner, 29 Oct 2026: "lower background music". The bed sits 6 dB lower overall and ducks about 14 dB under speech,
    # so it is roughly 20 dB below the voice while she talks and only comes up in the countdown holds.
    duck = 1 - 0.80 * np.clip(env / (np.percentile(env, 90) + 1e-9), 0, 1)
    write(v + 0.5 * bed * duck, out, True)
else:
    write(bed, out, "preview" if "--pulse" in sys.argv else False)        # a music bed alone is lifted to a listenable level
print(out, f"{tl['duration']:.1f}s", "mix" if voice else "bed only")
