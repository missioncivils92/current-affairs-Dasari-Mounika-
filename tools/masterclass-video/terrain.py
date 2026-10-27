"""Terrain-shaded basemap (Web Mercator PNG + bounds JSON) from AWS Terrain Tiles (Terrarium).

Data: AWS Open Data "Terrain Tiles" (Mapzen; SRTM, GMTED, ETOPO1 and others). Credit on screen:
"Elevation: Terrain Tiles (Mapzen/AWS; SRTM, GMTED, ETOPO1)".

The output is a dark, brand-tinted hillshade: land in slate tones, water flat, so vector rivers,
borders and satellite inserts sit on top cleanly.

Usage: python3 -I terrain.py <out_dir> <name> <west> <south> <east> <north> <zoom>
"""
import io, json, math, sys, urllib.request
from pathlib import Path
import numpy as np
from PIL import Image

out_dir, name = Path(sys.argv[1]), sys.argv[2]
west, south, east, north = map(float, sys.argv[3:7])
z = int(sys.argv[7])
out_dir.mkdir(parents=True, exist_ok=True)

def tile_xy(lon, lat):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y

def tile_lonlat(x, y):
    n = 2 ** z
    lon = x / n * 360 - 180
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
    return lon, lat

x0, y0 = (int(v) for v in tile_xy(west, north))
x1, y1 = (int(v) for v in tile_xy(east, south))
H, W = (y1 - y0 + 1) * 256, (x1 - x0 + 1) * 256
elev = np.zeros((H, W), np.float32)
for ty in range(y0, y1 + 1):
    for tx in range(x0, x1 + 1):
        url = f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{tx}/{ty}.png"
        with urllib.request.urlopen(url, timeout=60) as r:
            a = np.asarray(Image.open(io.BytesIO(r.read())).convert("RGB"), np.float32)
        elev[(ty - y0) * 256:(ty - y0 + 1) * 256, (tx - x0) * 256:(tx - x0 + 1) * 256] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768

# hillshade (sun from the north-west), with vertical exaggeration scaled to pixel size
lat_mid = math.radians((south + north) / 2)
px_m = 40075016.686 * math.cos(lat_mid) / (2 ** z * 256)
gy, gx = np.gradient(elev, px_m)
exag = 6.0
slope = np.arctan(exag * np.hypot(gx, gy))
aspect = np.arctan2(-gx, gy)
az, alt = math.radians(315), math.radians(40)
shade = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect)
shade = np.clip(shade, 0, 1)

water = elev <= 0.5
land_tint = np.array([58, 66, 76], np.float32)    # slate, a little lighter than the #1E2228 background
high_tint = np.array([96, 104, 110], np.float32)
h = np.clip(elev / 1500, 0, 1)[..., None]
base = land_tint * (1 - h) + high_tint * h
rgb = base * (0.55 + 0.75 * shade[..., None])
rgb[water] = np.array([22, 30, 40], np.float32)   # deep slate-blue sea
img = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")
img.save(out_dir / f"{name}.png", optimize=True)

w_lon, n_lat = tile_lonlat(x0, y0)
e_lon, s_lat = tile_lonlat(x1 + 1, y1 + 1)
(out_dir / f"{name}.json").write_text(json.dumps({
    "bounds": [w_lon, s_lat, e_lon, n_lat], "width": W, "height": H,
    "credit": "Elevation: Terrain Tiles (Mapzen/AWS; SRTM, GMTED, ETOPO1)"}))
print(name, W, H, [round(v, 3) for v in (w_lon, s_lat, e_lon, n_lat)])
