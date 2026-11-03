"""Lay Mounika's camera into the rendered video, row by row (owner decision 41: on-camera at chosen moments).

The camera recording is also the narration source: the aligned timeline's "audio_plan" (timeline.py --align) says
which spans of it to keep and where silences (countdown holds) are inserted. This tool cuts the camera video by the
same plan, so the picture stays in sync with the voice, then overlays it wherever a row asks for it:

  FACE    the camera fills the frame above the lower-third the renderer drew (y 0–900)
  SPLIT   the camera fills the left panel (30, 30, 680×1020), beside the scaled slide
  CORNER  a round camera, 330 px, at the bottom-right corner the slide (scaled to 80%) leaves free
  VOICE   no camera (the default)

During an inserted silence the camera shows a freeze of its last frame, so a hold never cuts to black.

Vertical Shorts (--vertical, 1080×1920): FACE fills the top 1080×1500 (the scene keeps a keyword band below it),
TOP fills the top 1080×760 above the visual.

Usage: python3 -I compose_face.py <aligned timeline.json> <camera video> <rendered slides.mp4> <mix.wav> <out.mp4> [--vertical]
       [--face-y N] [--top-y N] [--top-h N] [--clean | --polish]   (vertical: the top edge of the FACE and TOP crops in the camera frame; lower N
                                   when the head sits high in the frame; --top-h > 760 shows more of the
                                   camera in the TOP panel, centred on a blurred fill, when the face is large)
       --clean: natural skin smoothing, colour and light correction on the camera (no reshaping, no AI)
       --polish: the same, stronger (smoother skin, richer colour, crisp eyes, soft vignette)
"""
import json, subprocess, sys, tempfile
from pathlib import Path

tl_path, cam, slides, mix, out = sys.argv[1:6]
VERT = '--vertical' in sys.argv
def opt(name, default):
    return int(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default
FACE_Y, TOP_Y = opt('--face-y', 120), opt('--top-y', 420)   # vertical: where the crops start in the camera frame
TOP_H = opt('--top-h', 760)   # vertical: camera height shown in the 760-px TOP panel; >760 zooms out (blurred side fill)
# --clean: a natural "clean and neat" camera look (owner, 2 Nov 2026): light denoise, edge-preserving skin smoothing,
# a touch of brightness, contrast and warmth, and gentle sharpening so the eyes stay crisp. No face reshaping, no AI.
CLEAN = ("hqdn3d=3:2:4:4,bilateral=sigmaS=10:sigmaR=0.08,eq=brightness=0.02:contrast=1.08:gamma=1.05:saturation=1.12,"
         "colorbalance=rm=0.04:bm=-0.03,unsharp=5:5:0.5,") if '--clean' in sys.argv else ""
# --polish: a stronger "neat and polished" look (owner, 3 Nov 2026): heavier denoise and skin smoothing, highlights
# held back, richer warm colour, crisp edge sharpening so eyes and brows stay sharp, a soft vignette. No reshaping, no AI.
if '--polish' in sys.argv:
    CLEAN = ("hqdn3d=4:3:6:5,bilateral=sigmaS=14:sigmaR=0.10,curves=master='0/0 0.45/0.5 0.88/0.86 1/0.97',"
             "eq=contrast=1.08:saturation=1.16,colorbalance=rs=0.02:rm=0.04:bm=-0.03:bh=-0.02,unsharp=5:5:0.9:3:3:0,vignette=PI/6,")
FW, FH = (1080, 1920) if VERT else (1920, 1080)
tl = json.load(open(tl_path))
assert "audio_plan" in tl, "timeline has no audio_plan: build it with timeline.py --align"
tmp = Path(tempfile.mkdtemp())
FPS = 30

# 1. the camera track, cut and padded exactly like the narration
parts, n = [], 0
for op in tl["audio_plan"]:
    p = tmp / f"p{n:04d}.mp4"; n += 1
    if op[0] == "src":
        s, e = op[1], op[2]
        if e - s < 0.04:
            continue
        cmd = ["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{s:.3f}", "-i", cam, "-t", f"{e - s:.3f}", "-an",
               "-vf", f"{CLEAN}scale={FW}:{FH}:force_original_aspect_ratio=increase,crop={FW}:{FH},fps={FPS},setsar=1",
               "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", str(p)]
    else:                                                       # a hold: freeze the last kept camera frame
        prev = parts[-1] if parts else None
        if prev is None:
            cmd = ["ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s={FW}x{FH}:r={FPS}", "-t", f"{op[1]:.3f}",
                   "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", str(p)]
        else:
            cmd = ["ffmpeg", "-loglevel", "error", "-y", "-sseof", "-0.1", "-i", str(prev), "-frames:v", "1", "-update", "1", str(tmp / "last.png")]
            subprocess.run(cmd, check=True)
            cmd = ["ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-framerate", str(FPS), "-i", str(tmp / "last.png"), "-t", f"{op[1]:.3f}",
                   "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-vf", "setsar=1", str(p)]
    subprocess.run(cmd, check=True); parts.append(p)
(tmp / "list.txt").write_text("".join(f"file '{p}'\n" for p in parts))
camtrack = tmp / "camtrack.mp4"
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(tmp / "list.txt"), "-c", "copy", str(camtrack)], check=True)

# 2. a round mask for the corner camera
size = 330
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "lavfi", "-i", f"color=c=black:s={size}x{size},format=gray",
                "-vf", f"geq=lum='if(lte(hypot(X-{size/2},Y-{size/2}),{size/2 - 2}),255,0)'", "-frames:v", "1", str(tmp / "mask.png")], check=True)

# 3. overlay by layout, each only during its rows
def ranges(kind):
    rs = [(r["start"], r["end"]) for r in tl["rows"] if r.get("layout") == kind]
    return "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in rs) or "0"

fc = (
    f"[1:v]split=2[cf][ct];"
    f"[cf]crop=1080:1500:0:{FACE_Y}[face];"                                          # vertical: face area
    + (f"[ct]crop=1080:760:0:{TOP_Y}[top];" if TOP_H == 760 else                         # top panel, or zoomed out:
       f"[ct]crop=1080:{TOP_H}:0:{TOP_Y},split=2[ta][tb];[ta]scale=-2:760[tf];"
       f"[tb]scale=1080:760,boxblur=24,eq=brightness=-0.12[tg];[tg][tf]overlay=(W-w)/2:0[top];")
    + f"[0:v][face]overlay=0:0:enable='{ranges('FACE')}'[v1];"
    f"[v1][top]overlay=0:0:enable='{ranges('TOP')}'[v]"
) if VERT else (
    f"[1:v]split=3[cf][cs][cc];"
    f"[cf]crop=1920:900:0:90[face];"                                              # FACE: top 900 px of the frame
    f"[cs]crop=607:1080:656:0,scale=680:1020:force_original_aspect_ratio=increase,crop=680:1020[split];"   # SPLIT: centre strip
    f"[cc]crop=1080:1080:420:0,scale={size}:{size}[cr];[2:v]format=gray[m];[cr][m]alphamerge[corner];"      # CORNER: round
    f"[0:v][face]overlay=0:0:enable='{ranges('FACE')}'[v1];"
    f"[v1][split]overlay=30:30:enable='{ranges('SPLIT')}'[v2];"
    f"[v2][corner]overlay={1920 - size - 24}:{1080 - size - 24}:enable='{ranges('CORNER')}'[v]"
)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", slides, "-i", str(camtrack), "-loop", "1", "-i", str(tmp / "mask.png"), "-i", mix,
                "-filter_complex", fc, "-map", "[v]", "-map", "3:a", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", out], check=True)
print(f"{out}: camera laid in on "
      f"{sum(1 for r in tl['rows'] if r.get('layout') in ('FACE', 'SPLIT', 'CORNER', 'TOP'))} of {len(tl['rows'])} rows")
