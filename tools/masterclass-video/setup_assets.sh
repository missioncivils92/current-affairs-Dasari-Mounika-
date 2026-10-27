#!/usr/bin/env bash
# Download the shared renderer assets into <assets_dir> (fonts, d3, Natural Earth India-POV, DataMeet India) and build geo.json.
set -euo pipefail
A=${1:?usage: setup_assets.sh <assets_dir>}
HERE=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$A"/{fonts,ne,terrain,sat}

# d3 (ISC)
( cd "$A" && npm pack d3@7.9.0 --silent >/dev/null && tar xzf d3-7.9.0.tgz && cp package/dist/d3.min.js d3.min.js && rm -rf package d3-7.9.0.tgz )

# fonts (SIL OFL) — Google Fonts CSS API returns TTF links for a plain user agent
( cd "$A/fonts" && for fam in "Inter:wght@400;600;800" "Caveat:wght@500;700" "JetBrains+Mono:wght@500;700" "Fraunces:opsz,wght@9..144,600;9..144,800"; do
    curl -s "https://fonts.googleapis.com/css2?family=$fam" -A "Mozilla/4.0"; done > fonts.css
  python3 -I - <<'EOF'
import re, urllib.request, pathlib
css = pathlib.Path("fonts.css").read_text(); out = []
for block in re.findall(r"@font-face \{.*?\}", css, re.S):
    fam = re.search(r"font-family: '([^']+)'", block).group(1); w = re.search(r"font-weight: (\d+)", block).group(1)
    url = re.search(r"url\((https://[^)]+)\)", block).group(1); fn = f"{fam.replace(' ', '')}-{w}.ttf"
    pathlib.Path(fn).write_bytes(urllib.request.urlopen(url, timeout=60).read())
    out.append(f"@font-face{{font-family:'{fam}';font-weight:{w};src:url('{fn}');}}")
pathlib.Path("local.css").write_text("\n".join(out))
EOF
)

# Natural Earth (public domain, India point of view) + DataMeet India composite (CC BY 4.0)
B=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
for f in ne_10m_admin_0_countries_ind ne_10m_rivers_lake_centerlines ne_10m_rivers_europe ne_10m_lakes ne_10m_lakes_europe ne_10m_admin_1_states_provinces; do
  [ -s "$A/ne/$f.geojson" ] || curl -sf -m 300 -o "$A/ne/$f.geojson" "$B/$f.geojson"
done
[ -s "$A/ne/india-composite.geojson" ] || curl -sf -m 300 -o "$A/ne/india-composite.geojson" https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson

python3 -I "$HERE/prep_geo.py" "$A/ne" "$A/geo.json"
echo "assets ready in $A"
