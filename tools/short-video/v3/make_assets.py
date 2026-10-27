import geopandas as gpd, fontawesomefree, os, re, json, math, warnings
from shapely.geometry import box
warnings.filterwarnings("ignore")
OUT="/tmp/claude-0/-home-user-current-affairs-Dasari-Mounika-/b50d1a5d-2e57-5234-b124-d1fb0231acc0/scratchpad/v3/assets.json"
w=gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
LON0,LON1,LAT0,LAT1=20.5,41.5,43.0,53.5; W,H=1000,780
k=math.cos(math.radians(48.5))
sx=W/((LON1-LON0)*k); sy=H/(LAT1-LAT0); s=min(sx,sy)
ox=(W-(LON1-LON0)*k*s)/2; oy=(H-(LAT1-LAT0)*s)/2
def P(lon,lat): return (round(ox+(lon-LON0)*k*s,1), round(oy+(LAT1-lat)*s,1))
def poly_d(g):
    parts=[g] if g.geom_type=="Polygon" else list(g.geoms)
    d=""
    for p in parts:
        pts=[P(x,y) for x,y in p.exterior.coords]
        d+="M"+" L".join(f"{x},{y}" for x,y in pts)+"Z "
    return d
view=box(LON0-3,LAT0-3,LON1+3,LAT1+3)
countries={}
for _,r in w.iterrows():
    g=r.geometry.intersection(view)
    if g.is_empty: continue
    countries[r["name"]]=poly_d(g)
ukr=w[w.name=="Ukraine"].geometry.iloc[0]
crimea=ukr.intersection(box(32.4,44.0,36.8,46.1))
pts={"Kyiv":(30.52,50.45),"Kherson":(32.62,46.64),"Oleshky":(32.72,46.62),"Zaporizhzhia NPP":(34.65,47.50),
     "Donetsk":(37.80,48.00),"Luhansk":(39.30,48.57),"Crimea":(34.1,45.3),"Moscow side":(40.5,51.5)}
dnipro=[(30.62,51.4),(30.52,50.45),(31.6,49.8),(33.4,49.07),(34.6,48.7),(35.05,48.46),(35.14,47.84),(34.65,47.45),(33.6,46.85),(32.62,46.64),(32.05,46.52)]
assets={"W":W,"H":H,"countries":countries,"ukraine":poly_d(ukr),"crimea":poly_d(crimea),
 "points":{n:P(*c) for n,c in pts.items()},
 "dnipro":"M"+" L".join(f"{x},{y}" for x,y in (P(*c) for c in dnipro)),
 "labels":{"RUSSIA":P(38.5,52.6),"BELARUS":P(27.5,53.0),"POLAND":P(21.6,51.6),"BLACK SEA":P(32.2,43.9),"ROMANIA":P(24.2,45.6),"MOLDOVA":P(28.4,47.3)}}
d=os.path.join(os.path.dirname(fontawesomefree.__file__),"static","fontawesomefree","svgs","solid")
icons={}
for n in ["person-walking-luggage","dove","radiation","oil-well","ship","handshake","house-chimney-crack","truck-medical","tent",
          "bolt","users","landmark","scale-balanced","triangle-exclamation","tower-cell","industry","plug-circle-xmark","flag",
          "explosion","calendar-days","comments","earth-asia","building-flag","shield-halved","location-dot","hourglass-half",
          "droplet","bomb","person-military-rifle","circle-xmark","arrow-right","chart-pie","gas-pump","oil-can","file-pen","play","bell"]:
    t=open(os.path.join(d,n+".svg")).read()
    vb=re.search(r'viewBox="([^"]+)"',t).group(1); paths=re.findall(r' d="([^"]+)"',t)
    icons[n]={"vb":vb,"d":paths}
assets["icons"]=icons
json.dump(assets,open(OUT,"w"))
print("countries",len(countries),"icons",len(icons),"points",assets["points"])
