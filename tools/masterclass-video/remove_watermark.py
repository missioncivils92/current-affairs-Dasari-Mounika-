"""Remove a corner-hopping app watermark (e.g. "Made with Teleprompter.com") from a static-camera take.

1. Find where the badge sits over time: template-match its icon on every frame (cv2.matchTemplate on a crop of the
   icon from one frame) and write segments [[start_s, end_s, [icon_x, icon_y], score], ...] to segs.json.
   The Teleprompter.com badge hops corners every 10 s: bottom-right, top-right, top-left, bottom-left.
2. This script replaces each badge box with a clean plate (the median of frames when the badge sat elsewhere; the
   camera is static, so the wall behind it is the same) blended in with a feathered mask. Edges that touch the frame
   border stay fully replaced, so no line is left at the top. Do not use ffmpeg delogo: on a plain wall it leaves
   visible soft rectangles.
Needs opencv-python-headless. Usage: python3 -I remove_watermark.py <in.mp4> <segs.json> <out.mp4>
"""
import cv2, json, numpy as np, sys, subprocess
src, segs_p, out = sys.argv[1:4]; segs = json.load(open(segs_p))
cap = cv2.VideoCapture(src); fps = cap.get(cv2.CAP_PROP_FPS); W = int(cap.get(3)); H = int(cap.get(4)); N = int(cap.get(7))
box = lambda lx, ly: (max(0, lx - 34), max(0, ly - 36), min(W, lx + 296), min(H, ly + 106))
corners = sorted({tuple(s[2]) for s in segs})
# sample frames for clean plates
samples = {c: [] for c in corners}
for t in np.linspace(1, N / fps - 1, 60):
    cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000); ok, f = cap.read()
    if not ok: continue
    here = [tuple(s[2]) for s in segs if s[0] - 0.2 <= t <= s[1] + 0.2]
    for c in corners:
        if c not in here: x0, y0, x1, y1 = box(*c); samples[c].append(f[y0:y1, x0:x1].astype(np.float32))
plate = {c: np.median(np.stack(v), 0) for c, v in samples.items()}
masks = {}
for c in corners:
    x0, y0, x1, y1 = box(*c); h, w = y1 - y0, x1 - x0; P = 30   # pad, so edges touching the frame border stay fully replaced
    m = np.zeros((h + 2 * P, w + 2 * P), np.float32)
    m[P + (0 if y0 == 0 else 12) - (P if y0 == 0 else 0):P + h - (0 if y1 == H else 12) + (P if y1 == H else 0),
      P + (0 if x0 == 0 else 12) - (P if x0 == 0 else 0):P + w - (0 if x1 == W else 12) + (P if x1 == W else 0)] = 1
    masks[c] = cv2.GaussianBlur(m, (0, 0), 5)[P:P + h, P:P + w, None]
cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(fps), '-i', '-',
                      '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', out], stdin=subprocess.PIPE)
i = 0
while True:
    ok, f = cap.read()
    if not ok: break
    t = i / fps
    for s in segs:
        if s[0] - 0.06 <= t <= s[1] + 0.06:
            c = tuple(s[2]); x0, y0, x1, y1 = box(*c); m = masks[c]
            f[y0:y1, x0:x1] = (f[y0:y1, x0:x1] * (1 - m) + plate[c] * m).astype(np.uint8)
    p.stdin.write(f.tobytes()); i += 1
p.stdin.close(); p.wait(); print('frames', i)
