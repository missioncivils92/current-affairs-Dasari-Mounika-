"""Join several phone clips of one take into a single camera file, keeping lip sync (owner, 3 Nov 2026).

Phone clips usually carry a little more audio than video (40-200 ms each). Joined with the concat demuxer, those gaps
add up and the picture drifts behind the voice (about 0.5 s by the fifth clip of the W45 green-crackers take). This
tool makes each clip's picture exactly as long as its sound (cloning the last frame), joins them with the concat
filter, and hides each join with a short white flash and alternating zoom punch-ins (1.0x / 1.08x), plus 20-30 ms
audio fades so there is no click.

Usage: python3 -I join_clips.py <out.mp4> <clip1> <clip2> ... [--hold-end SECONDS] [--no-punch]
  --hold-end S  freeze the frame S seconds before the end (hides the reach for the phone); audio continues.
"""
import json, subprocess, sys, tempfile
from pathlib import Path

args = sys.argv[1:]
hold = float(args[args.index("--hold-end") + 1]) if "--hold-end" in args else None
punch = "--no-punch" not in args
args = [a for i, a in enumerate(args) if a not in ("--hold-end", "--no-punch") and (i == 0 or args[i - 1] != "--hold-end")]
out, clips = args[0], args[1:]
tmp = Path(tempfile.mkdtemp())


def dur(f, kind):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", kind, "-show_entries", "stream=duration",
                                          "-of", "csv=p=0", f]).decode().split()[0])


def size(f):
    s = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height",
                                            "-of", "json", f]))["streams"][0]
    return s["width"] // 2 * 2, s["height"] // 2 * 2


W, H = size(clips[0])
parts = []
for i, c in enumerate(clips):
    a, v = dur(c, "a"), dur(c, "v")
    z = "crop=iw/1.08:ih/1.08," if punch and i % 2 else ""
    fl = ",fade=t=in:st=0:d=0.18:color=white" if i else ""
    p = tmp / f"k{i}.mov"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", c, "-filter_complex",
                    f"[0:v]scale={W}:{H},{z}scale={W}:{H}:flags=lanczos,setsar=1,fps=30,"
                    f"tpad=stop_mode=clone:stop_duration={max(0, a - v) + 0.04:.3f},trim=0:{a:.3f},setpts=PTS-STARTPTS{fl}[v];"
                    f"[0:a]aresample=48000,afade=t=in:st=0:d=0.02,afade=t=out:st={max(0, a - 0.03):.3f}:d=0.03,"
                    f"atrim=0:{a:.3f},asetpts=PTS-STARTPTS[a]",
                    "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-c:a", "pcm_s16le", "-ac", "1", str(p)],
                   check=True)
    parts.append(p)
    print(f"{Path(c).name}: video {v:.3f}s, audio {a:.3f}s -> matched")
ins = sum((["-i", str(p)] for p in parts), [])
joined = tmp / "joined.mp4"
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *ins, "-filter_complex",
                "".join(f"[{i}:v][{i}:a]" for i in range(len(parts))) + f"concat=n={len(parts)}:v=1:a=1[v][a]",
                "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-c:a", "aac", "-b:a", "192k",
                str(joined if hold else out)], check=True)
if hold:
    t = dur(str(joined), "a") - hold
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(joined), "-filter_complex",
                    f"[0:v]trim=0:{t:.3f},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={hold + 0.2:.3f}[v]",
                    "-map", "[v]", "-map", "0:a", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-c:a", "aac", "-b:a", "192k", out],
                   check=True)
print(f"{out}: {len(clips)} clips joined, video {dur(out, 'v'):.2f}s, audio {dur(out, 'a'):.2f}s")
