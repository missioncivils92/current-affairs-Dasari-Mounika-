"""Make Sentinel-2 true-colour mosaics read clearly on a phone: one percentile stretch across all bands (lifts haze, keeps colour),
a touch of saturation, and an unsharp mask. Pixels outside the mosaic (alpha 0) are left untouched.

Used by sentinel.py on every new mosaic; can also be run on an existing one (it keeps a copy of the original):
    python3 -I sat_enhance.py <assets>/sat/<name>.png [--sharpen-only]
Use --sharpen-only when the haze is the information (smog over Delhi): no stretch, sharpening only.
"""
import shutil, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance


def enhance(rgba: Image.Image, lo=0.7, hi=99.6, sat=1.08, radius=1.4, percent=80, stretch=True) -> Image.Image:
    # one stretch for all three bands (keeps the colour balance true; per-band stretching tints the scene)
    a = np.asarray(rgba.convert("RGBA")).astype(np.float32)
    rgb, alpha = a[..., :3], a[..., 3]
    valid = alpha > 0
    if stretch and valid.sum() > 1000:
        v = rgb[valid]
        p0, p1 = np.percentile(v, lo), np.percentile(v, hi)
        rgb = np.clip((rgb - p0) / max(p1 - p0, 1) * 255, 0, 255)
    out = Image.fromarray(rgb.astype(np.uint8), "RGB")
    out = ImageEnhance.Color(out).enhance(sat)
    out = out.filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=2))
    out.putalpha(Image.fromarray(alpha.astype(np.uint8)))
    return out


if __name__ == "__main__":
    p = Path(sys.argv[1])
    orig = p.with_name(p.stem + ".orig.png")
    if not orig.exists():
        shutil.copy(p, orig)
    enhance(Image.open(orig), stretch="--sharpen-only" not in sys.argv).save(p, optimize=True)
    print("enhanced", p)
