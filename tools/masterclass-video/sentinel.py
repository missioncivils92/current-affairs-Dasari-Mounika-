"""Build cloud-free Copernicus Sentinel-2 true-colour mosaics (Web Mercator PNG + bounds JSON).

Data: Sentinel-2 L2A COGs on AWS Open Data (s3://sentinel-cogs). Licence: Copernicus open data;
credit on screen: "Contains modified Copernicus Sentinel data <year>".

Usage: python3 -I sentinel.py <out_dir> <name> <west> <south> <east> <north> <date_from> <date_to> [width_px]
Example: python3 -I sentinel.py out kakhovka_before 32.9 46.55 35.2 47.9 2023-04-15 2023-06-05 2400
Set CURL_CA_BUNDLE and GDAL_HTTP_PROXY when running behind the session proxy.
"""
import datetime as dt, json, math, os, re, sys, urllib.request
from pathlib import Path

import mgrs, numpy as np, rasterio
from PIL import Image
from rasterio.warp import reproject, Resampling, transform_bounds
from rasterio.transform import from_bounds

BUCKET = "https://sentinel-cogs.s3.us-west-2.amazonaws.com"
out_dir, name = Path(sys.argv[1]), sys.argv[2]
west, south, east, north = map(float, sys.argv[3:7])
d0, d1 = (dt.date.fromisoformat(x) for x in sys.argv[7:9])
width = int(sys.argv[9]) if len(sys.argv) > 9 else 2400
out_dir.mkdir(parents=True, exist_ok=True)

def get(url):
    with urllib.request.urlopen(url, timeout=60) as r:
        return r.read()

# MGRS tiles covering the bbox
m = mgrs.MGRS()
tiles = sorted({m.toMGRS(la, lo, MGRSPrecision=0)
                for la in np.linspace(south, north, 9) for lo in np.linspace(west, east, 9)})

def scenes(tile):
    z, band, sq = tile[:2], tile[2], tile[3:]
    months = sorted({(d.year, d.month) for d in (d0 + dt.timedelta(n) for n in range((d1 - d0).days + 1))})
    for y, mo in months:
        xml = get(f"{BUCKET}/?list-type=2&prefix=sentinel-s2-l2a-cogs/{int(z)}/{band}/{sq}/{y}/{mo}/&delimiter=/").decode()
        for pfx in re.findall(r"<Prefix>(sentinel-s2-l2a-cogs/[^<]+_L2A/)</Prefix>", xml):
            sid = pfx.rstrip("/").split("/")[-1]
            day = dt.datetime.strptime(sid.split("_")[2], "%Y%m%d").date()
            if d0 <= day <= d1:
                yield sid, pfx

# Web Mercator output grid
xmin, ymin, xmax, ymax = transform_bounds("EPSG:4326", "EPSG:3857", west, south, east, north)
height = int(round(width * (ymax - ymin) / (xmax - xmin)))
dst_t = from_bounds(xmin, ymin, xmax, ymax, width, height)
mosaic = np.zeros((3, height, width), np.uint8)
filled = np.zeros((height, width), bool)
used = []

for tile in tiles:
    cands = []
    for sid, pfx in scenes(tile):
        try:
            p = json.loads(get(f"{BUCKET}/{pfx}{sid}.json"))["properties"]
        except Exception:
            continue
        cands.append((p.get("eo:cloud_cover", 100) + 0.3 * p.get("s2:nodata_pixel_percentage", 100), sid, pfx,
                      p.get("eo:cloud_cover")))
    # try the best few scenes for this tile until it fills its share of the grid
    for score, sid, pfx, cc in sorted(cands)[:4]:
        if cc is None or cc > float(os.environ.get("MAXCLOUD", 20)):
            break
        # read the overview closest to the output ground resolution (10 m × 2^(level+1))
        ground = (xmax - xmin) / width * math.cos(math.radians((south + north) / 2))
        level = max(-1, min(3, int(math.log2(max(ground / 10, 1))) - 1))
        kw = {"overview_level": level} if level >= 0 else {}
        with rasterio.open(f"{BUCKET}/{pfx}TCI.tif", **kw) as src:
            buf = np.zeros((3, height, width), np.uint8)
            for b in range(3):
                reproject(rasterio.band(src, b + 1), buf[b], dst_transform=dst_t, dst_crs="EPSG:3857",
                          resampling=Resampling.average, src_nodata=0, dst_nodata=0)
        new = (buf.sum(0) > 0) & ~filled
        if new.sum() == 0:
            continue
        mosaic[:, new] = buf[:, new]
        filled |= new
        used.append({"id": sid, "cloud": cc})
        print(f"{tile}: {sid} cloud {cc:.1f}% added {new.sum()} px", flush=True)
        # keep adding the next-best scenes only to fill orbit-edge gaps

# gentle tone mapping: TCI is already 8-bit; lift shadows a touch for video
img = mosaic.astype(np.float32) / 255.0
img = np.clip((img ** 0.85) * 1.08, 0, 1)
rgba = np.dstack([(img.transpose(1, 2, 0) * 255).astype(np.uint8), (filled * 255).astype(np.uint8)])
import importlib.util                       # sharpen and de-haze for video (sat_enhance.py)
_spec = importlib.util.spec_from_file_location("sat_enhance", Path(__file__).with_name("sat_enhance.py"))
_se = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(_se)
_se.enhance(Image.fromarray(rgba, "RGBA")).save(out_dir / f"{name}.png", optimize=True)
years = sorted({s["id"].split("_")[2][:4] for s in used})
(out_dir / f"{name}.json").write_text(json.dumps({
    "bounds": [west, south, east, north], "width": width, "height": height, "scenes": used,
    "credit": f"Contains modified Copernicus Sentinel data {', '.join(years)}"}, indent=1))
print("coverage", round(filled.mean() * 100, 1), "%", out_dir / f"{name}.png")
