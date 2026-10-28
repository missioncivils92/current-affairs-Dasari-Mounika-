"""Build the compact vector bundle (geo.json) used by the masterclass renderer.

Sources (download into <ne_dir> first; see README):
- Natural Earth 10m, India point-of-view admin-0 (ne_10m_admin_0_countries_ind) — public domain
- Natural Earth 10m rivers (global + Europe supplement), lakes, admin-1 — public domain
- DataMeet india-composite.geojson (CC BY 4.0) — India outline per Survey of India claims

India is always drawn from DataMeet so every India frame shows the official boundary
(full J&K and Ladakh, Arunachal Pradesh). Crimea and Sevastopol are kept inside Ukraine's
internationally recognised boundary (UNGA res. 68/262).

Usage: python3 -I prep_geo.py <ne_dir> <out.json>
"""
import json, sys
from pathlib import Path
from shapely.geometry import shape, mapping, box, MultiLineString
from shapely.ops import unary_union

ne, out = Path(sys.argv[1]), Path(sys.argv[2])
load = lambda f: json.loads((ne / f).read_text())["features"]

def rnd(geom, nd=3):
    def r(c):
        return [round(c[0], nd), round(c[1], nd)] if isinstance(c[0], (int, float)) else [r(x) for x in c]
    g = mapping(geom)
    return {"type": g["type"], "coordinates": r(g["coordinates"])}

WIDE = box(-90, -56, 160, 80)        # India ↔ Black Sea flights, and world maps out to Brazil (clip edges stay off-screen)
DETAIL = box(0, 25, 70, 70)          # Black Sea, Ukraine, Turkish Straits, Valdai Hills (clip edges off-screen)
RIVERS = box(20, 36, 46, 58.5)
bundle = {"countries_wide": [], "countries": [], "rivers": [], "lakes": [], "admin1": [], "india": None}

india = unary_union([shape(f["geometry"]) for f in json.loads((ne / "india-composite.geojson").read_text())["features"]])
bundle["india"] = rnd(india.simplify(0.02), 2)

for f in load("ne_10m_admin_0_countries_ind.geojson"):
    p, g = f["properties"], shape(f["geometry"])
    a3, name = p["ADM0_A3"], p["NAME"]
    if a3 == "IND":
        continue  # drawn from DataMeet
    if g.intersects(WIDE):
        bundle["countries_wide"].append({"a3": a3, "name": name, "geom": rnd(g.intersection(WIDE).simplify(0.05), 2)})
    if g.intersects(DETAIL):
        bundle["countries"].append({"a3": a3, "name": name, "geom": rnd(g.intersection(DETAIL).simplify(0.004), 3)})

keep_rivers = {"Dnepr", "Dnepre", "Dnipro", "Dnieper", "Don", "Danube", "Southern Bug", "Pivdennyi Buh", "Dniester", "Desna", "Pripyat", "Volga"}
seen = []
for fn in ("ne_10m_rivers_europe.geojson", "ne_10m_rivers_lake_centerlines.geojson"):
    for f in load(fn):
        p, g = f["properties"], shape(f["geometry"])
        nm = p.get("name") or p.get("name_en") or ""
        if not g.intersects(RIVERS):
            continue
        rank = p.get("scalerank", 10)
        if nm in keep_rivers or rank <= 6:
            bundle["rivers"].append({"name": nm, "rank": rank, "geom": rnd(g.intersection(RIVERS).simplify(0.002), 3)})

# Peninsular Indian rivers (Telugu States lens, Prelims Grid maps); Natural Earth spells some with diacritics
INDIA_RIVERS = box(68, 6, 98, 37)
india_names = {"Godävari": "Godavari", "Krishna": "Krishna", "Bhima": "Bhima", "Tungabhadra": "Tungabhadra", "Wainganga": "Wainganga",
               "Indravati": "Indravati", "Penner": "Penner", "Mahäna Nadï": "Mahanadi", "Narmada": "Narmada", "Tapi": "Tapi"}
for f in load("ne_10m_rivers_lake_centerlines.geojson"):
    p, g = f["properties"], shape(f["geometry"])
    nm = p.get("name") or ""
    if nm in india_names and g.intersects(INDIA_RIVERS):
        bundle["rivers"].append({"name": india_names[nm], "rank": p.get("scalerank", 10), "geom": rnd(g.intersection(INDIA_RIVERS).simplify(0.01), 3)})

for fn in ("ne_10m_lakes_europe.geojson", "ne_10m_lakes.geojson"):
    for f in load(fn):
        g = shape(f["geometry"])
        if g.intersects(RIVERS) and g.area > 0.002:
            bundle["lakes"].append({"name": f["properties"].get("name") or "", "geom": rnd(g.intersection(RIVERS).simplify(0.002), 3)})

# Indian state boundaries, interior lines only: each state's outline is clipped to the inside of the
# DataMeet (Survey of India) outline, so the country's external boundary always comes from DataMeet.
inner = india.buffer(-0.06)
bundle["india_states"] = []
for f in load("ne_10m_admin_1_states_provinces.geojson"):
    p = f["properties"]
    if p.get("adm0_a3") == "IND" and p.get("name") not in ("Jammu and Kashmir", "Ladakh", "Arunachal Pradesh"):
        g = shape(f["geometry"])
        line = g.boundary.intersection(inner)
        if line.geom_type == "GeometryCollection":          # keep only the line parts
            line = MultiLineString([l for l in getattr(line, "geoms", []) if l.geom_type == "LineString"])
        if line.is_empty:
            continue
        c = g.representative_point()
        bundle["india_states"].append({"name": p["name"], "label": [round(c.x, 2), round(c.y, 2)], "geom": rnd(line.simplify(0.01), 3)})

want = {"Kherson", "Zaporizhzhya", "Donets'k", "Luhans'k", "Crimea", "Sevastopol", "Mykolayiv", "Dnipropetrovs'k", "Odessa"}
for f in load("ne_10m_admin_1_states_provinces.geojson"):
    p = f["properties"]
    if p.get("name") in want and p.get("adm0_a3") in ("UKR", "RUS"):
        bundle["admin1"].append({"name": p.get("name_en") or p["name"], "geom": rnd(shape(f["geometry"]).simplify(0.003), 3)})

out.write_text(json.dumps(bundle, separators=(",", ":")))
print({k: (len(v) if isinstance(v, list) else 1) for k, v in bundle.items()}, round(out.stat().st_size / 1e6, 2), "MB")
