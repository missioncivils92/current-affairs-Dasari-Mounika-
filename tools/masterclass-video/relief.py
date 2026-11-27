"""Colour shaded-relief basemap (Web Mercator PNG + bounds JSON) from AWS Terrain Tiles (Terrarium).

Unlike terrain.py (a dark, brand-tinted hillshade for map slides), this one is a natural-colour "atlas" relief for camera
flights: deep-to-shallow blue sea, green plains, ochre and brown uplands, white snow above about 4,500 m, lit from the
north-west. Data: AWS Open Data "Terrain Tiles" (Mapzen; SRTM, GMTED, ETOPO1). Credit on screen:
"Elevation: Terrain Tiles (Mapzen/AWS; SRTM, GMTED, ETOPO1)".

Usage: python3 -I relief.py <out_dir> <name> <west> <south> <east> <north> <zoom>
"""
import io, json, math, sys, urllib.request
from pathlib import Path
import numpy as np
from PIL import Image

out_dir, name = Path(sys.argv[1]), sys.argv[2]
west, south, east, north = map(float, sys.argv[3:7]); z = int(sys.argv[7])
out_dir.mkdir(parents=True, exist_ok=True)
n = 2 ** z
tx = lambda lon: (lon + 180) / 360 * n
ty = lambda lat: (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
x0, x1 = int(math.floor(tx(west))), int(math.floor(tx(east))); y0, y1 = int(math.floor(ty(north))), int(math.floor(ty(south)))
H, W = (y1 - y0 + 1) * 256, (x1 - x0 + 1) * 256
elev = np.zeros((H, W), np.float32)
for X in range(x0, x1 + 1):
    for Y in range(y0, y1 + 1):
        url = f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{X % n}/{Y}.png"
        a = np.asarray(Image.open(io.BytesIO(urllib.request.urlopen(url, timeout=60).read())).convert("RGB"), np.float32)
        elev[(Y - y0) * 256:(Y - y0 + 1) * 256, (X - x0) * 256:(X - x0 + 1) * 256] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768

# hillshade (sun from the north-west, 45° up); pixel size in metres for the slope
lat_c = math.radians((north + south) / 2); px = 40075016.686 * math.cos(lat_c) / (256 * n)
gy, gx = np.gradient(elev, px)
slope = np.arctan(np.hypot(gx, gy) * 1.6); aspect = np.arctan2(-gx, gy)
az, alt = math.radians(315), math.radians(45)
shade = np.clip(np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect), 0, 1)

# hypsometric colours (metres → RGB), interpolated
LAND = [(0, (86, 140, 72)), (200, (122, 160, 86)), (600, (176, 172, 106)), (1200, (170, 132, 84)), (2500, (138, 104, 76)), (4000, (160, 150, 142)), (4800, (240, 240, 244)), (9000, (255, 255, 255))]
SEA = [(-6000, (10, 34, 74)), (-2000, (18, 58, 112)), (-200, (36, 98, 156)), (0, (70, 140, 190))]
def ramp(v, stops):
    xs = np.array([s[0] for s in stops], np.float32); cs = np.array([s[1] for s in stops], np.float32)
    return np.stack([np.interp(v, xs, cs[:, i]) for i in range(3)], -1)
land = elev > 0
rgb = np.where(land[..., None], ramp(elev, LAND) * (0.45 + 0.75 * shade[..., None]), ramp(elev, SEA))
img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))

# crop to the requested bounds (in tile pixel space) and save with its Web Mercator bounds
cx0, cx1 = int((tx(west) - x0) * 256), int((tx(east) - x0) * 256); cy0, cy1 = int((ty(north) - y0) * 256), int((ty(south) - y0) * 256)
img = img.crop((cx0, cy0, cx1, cy1)); img.save(out_dir / f"{name}.png", optimize=True)
json.dump({"bounds": [west, south, east, north], "credit": "Elevation: Terrain Tiles (Mapzen/AWS; SRTM, GMTED, ETOPO1)"}, open(out_dir / f"{name}.json", "w"))
print(name, img.size, [west, south, east, north])
