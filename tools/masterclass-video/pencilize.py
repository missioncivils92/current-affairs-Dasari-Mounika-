"""Turn a Sentinel-2 view (sat/<name>.png) into a pencil drawing on cream paper: colour-dodge sketch plus edges, water
replaced by clean paper with light horizontal strokes. Usage: python3 -I pencilize.py <in.png> <out.png> (copy the .json bounds too)."""
import sys, json, numpy as np
from PIL import Image, ImageFilter
src, out = sys.argv[1], sys.argv[2]
rgb = Image.open(src).convert('RGB'); g = rgb.convert('L').filter(ImageFilter.MedianFilter(3))
a = np.asarray(g, np.float32); c = np.asarray(rgb, np.float32)
bl = np.asarray(Image.fromarray((255 - a).astype(np.uint8)).filter(ImageFilter.GaussianBlur(8)), np.float32)
s = np.clip(a * 255 / (255 - bl + 1), 0, 255)
ed = np.asarray(g.filter(ImageFilter.FIND_EDGES), np.float32)
s = np.clip(s - ed * 1.1, 0, 255); s = 255 * np.power(s / 255, 1.55)
# water (dark, bluish, smooth) → clean paper with light horizontal pencil strokes
water = (a < 70) & (c[..., 2] >= c[..., 0])
water = np.asarray(Image.fromarray((water * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(9)), np.float32) > 127
yy = np.arange(s.shape[0])[:, None] * np.ones(s.shape[1])[None, :]
hatch = 238 - 26 * ((yy.astype(int) % 16) < 2) * (np.random.default_rng(3).random(s.shape) > 0.35)
s = np.where(water, hatch, s)
s = np.clip(s + np.random.default_rng(2).normal(0, 5, s.shape), 0, 255)
t = (s / 255)[..., None]; paper = np.array([251, 246, 234], np.float32); ink = np.array([44, 38, 34], np.float32)
Image.fromarray((paper * t + ink * (1 - t)).astype(np.uint8)).save(out)
