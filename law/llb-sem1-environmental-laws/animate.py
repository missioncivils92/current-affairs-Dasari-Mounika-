"""Add slide transitions and entrance animations to the deck built by build_deck.js.

Shapes named "a<group><effect>_..." animate; same group = together.
effect: f fade, w wipe from left, u float up, z zoom, r reveal (zoom after a thinking pause; quiz answers).

Usage: python3 animate.py in.pptx out.pptx [auto|click]
  auto  - each slide builds itself, group after group (good for a screen-recorded video)
  click - each group appears on the next click (good for recording narration live)
"""
import re, sys, zipfile, shutil

src, dst = sys.argv[1], sys.argv[2]
mode = sys.argv[3] if len(sys.argv) > 3 else "auto"
DUR, STEP, THINK = 500, 650, 6000  # ms per effect, ms between groups, quiz pause (auto mode)

class Ids:
    def __init__(self): self.n = 2
    def __call__(self): self.n += 1; return self.n

def set_vis(nid, spid):
    return (f'<p:set><p:cBhvr><p:cTn id="{nid()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:to><p:strVal val="visible"/></p:to></p:set>')

def anim(nid, spid, attr, frm, to):
    return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="{nid()}" dur="{DUR}" fill="hold"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl><p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr>'
            f'<p:tavLst><p:tav tm="0"><p:val><p:strVal val="{frm}"/></p:val></p:tav>'
            f'<p:tav tm="100000"><p:val><p:strVal val="{to}"/></p:val></p:tav></p:tavLst></p:anim>')

def filt(nid, spid, f):
    return (f'<p:animEffect transition="in" filter="{f}"><p:cBhvr><p:cTn id="{nid()}" dur="{DUR}"/>'
            f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl></p:cBhvr></p:animEffect>')

PRESET = {"f": (10, 0), "w": (22, 8), "u": (42, 0), "z": (53, 16), "r": (53, 16)}

def effect(nid, spid, eff, node_type, has_text):
    pid, sub = PRESET[eff]
    grp = ' grpId="0"' if has_text else ''
    body = set_vis(nid, spid)
    if eff == "f":
        body += filt(nid, spid, "fade")
    elif eff == "w":
        body += filt(nid, spid, "wipe(left)")
    elif eff == "u":
        body += filt(nid, spid, "fade") + anim(nid, spid, "ppt_x", "#ppt_x", "#ppt_x") + anim(nid, spid, "ppt_y", "#ppt_y+.1", "#ppt_y")
    elif eff in ("z", "r"):
        body += filt(nid, spid, "fade") + anim(nid, spid, "ppt_w", "0", "#ppt_w") + anim(nid, spid, "ppt_h", "0", "#ppt_h")
    return (f'<p:par><p:cTn id="{nid()}" presetID="{pid}" presetClass="entr" presetSubtype="{sub}" fill="hold"{grp} nodeType="{node_type}">'
            f'<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{body}</p:childTnLst></p:cTn></p:par>')

def timing(groups, text_ids):
    nid = Ids()
    clicks = []
    if mode == "auto":
        inner = []
        start = 0
        for gi, eff_shapes in enumerate(groups):
            if gi:
                start += STEP + (THINK if any(e == "r" for _, e in eff_shapes) else 0)
            effs = "".join(effect(nid, sp, eff, "afterEffect" if k == 0 else "withEffect", sp in text_ids)
                           for k, (sp, eff) in enumerate(eff_shapes))
            inner.append(f'<p:par><p:cTn id="{nid()}" fill="hold"><p:stCondLst><p:cond delay="{start}"/></p:stCondLst><p:childTnLst>{effs}</p:childTnLst></p:cTn></p:par>')
        clicks.append(f'<p:par><p:cTn id="{nid()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>{"".join(inner)}</p:childTnLst></p:cTn></p:par>')
    else:
        for eff_shapes in groups:
            effs = "".join(effect(nid, sp, eff, "clickEffect" if k == 0 else "withEffect", sp in text_ids)
                           for k, (sp, eff) in enumerate(eff_shapes))
            clicks.append(f'<p:par><p:cTn id="{nid()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst>'
                          f'<p:par><p:cTn id="{nid()}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{effs}</p:childTnLst></p:cTn></p:par>'
                          f'</p:childTnLst></p:cTn></p:par>')
    bld = "".join(f'<p:bldP spid="{sp}" grpId="0" animBg="1"/>' for g in groups for sp, _ in g if sp in text_ids)
    return ('<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
            '<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
            + "".join(clicks) +
            '</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
            '</p:childTnLst></p:cTn></p:par></p:tnLst>' + (f'<p:bldLst>{bld}</p:bldLst>' if bld else '') + '</p:timing>')

NAME = re.compile(r'<p:(nvSpPr|nvPicPr|nvCxnSpPr)><p:cNvPr id="(\d+)" name="a(\d+)([fwuzr])_[^"]*"')

def process(xml, idx):
    groups = {}
    text_ids = set()
    for m in NAME.finditer(xml):
        kind, spid, g, eff = m.groups()
        groups.setdefault(int(g), []).append((spid, eff))
        if kind == "nvSpPr":
            text_ids.add(spid)
    trans = '<p:transition spd="slow"><p:push dir="u"/></p:transition>' if 'name="a1z_unit' in xml else '<p:transition spd="med"><p:fade/></p:transition>'
    tim = timing([groups[k] for k in sorted(groups)], text_ids) if groups else ""
    assert "</p:clrMapOvr>" in xml and "<p:timing" not in xml
    return xml.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + trans + tim, 1)

zin = zipfile.ZipFile(src)
tmp = dst + ".tmp"
with zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        m = re.match(r"ppt/slides/slide(\d+)\.xml$", item.filename)
        if m:
            data = process(data.decode("utf-8"), int(m.group(1))).encode("utf-8")
        zout.writestr(item, data)
shutil.move(tmp, dst)
print("animated", dst, mode)
