// Decode UPSC masterclass renderer — drawing engine (brand system, text, cards, maps, mind maps, Decode Desk).
// Loaded by render.html; scenes live in scenes/<name>.js and register themselves in SCENES.
const W = 1920, H = 1080;
const C = {
  slate: '#1E2228', slate2: '#262B33', slate3: '#30363F', line: '#3A414B',
  yellow: '#F5D300', white: '#FFFFFF', red: '#E5484D', teal: '#2BB3A3', blue: '#4A90C2',
  dim: 'rgba(255,255,255,0.62)', faint: 'rgba(255,255,255,0.35)', ink: '#F5D300', paper: '#EDE6D6',
};
const F = {
  ui: (s, w = 600) => `${w} ${s}px Inter`, head: (s, w = 800) => `${w} ${s}px Fraunces`,
  mono: (s, w = 500) => `${w} ${s}px "JetBrains Mono"`, hand: (s, w = 700) => `${w} ${s}px Caveat`,
};
const SCENES = {};
const A = {};           // assets: images + geo + timeline
let REVIEW = false;      // preview build: show a discreet review caption strip
let GT = 0;              // global timeline time (s), for audio-driven visuals

// ---------- math & easing ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => (t = clamp(t), t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = t => 1 - Math.pow(1 - clamp(t), 3);
const span = (t, a, b) => clamp((t - a) / (b - a));
const appear = (t, at, dur = 0.6) => easeOut(span(t, at, at + dur));
// spring-in (overshoots a little, then settles), for nodes and stamps
const pop = (t, at, dur = 0.45) => { const x = span(t, at, at + dur); return x <= 0 ? 0 : 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2); };
// number roll-up: the value counts from 0 over 0.8 s from `at`
const roll = (v, t, at, dur = 0.8) => v * easeOut(span(t, at, at + dur));

// ---------- text ----------
function wrap(ctx, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; } else line = test;
    }
    out.push(line);
  }
  return out;
}
function text(ctx, s, x, y, o = {}) {
  ctx.save();
  ctx.font = o.font || F.ui(36); ctx.fillStyle = o.color || C.white;
  ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic';
  ctx.globalAlpha *= (o.alpha ?? 1);
  if (o.shadow) { ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = o.shadow; }
  if (o.maxW) {
    const lines = wrap(ctx, s, o.maxW), lh = o.lh || parseInt(ctx.font.match(/(\d+)px/)[1]) * 1.25;
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
    ctx.restore(); return lines.length * lh;
  }
  ctx.fillText(s, x, y); const w = ctx.measureText(s).width; ctx.restore(); return w;
}
// word-by-word reveal (used for kinetic headlines)
function revealWords(ctx, s, x, y, p, o = {}) {
  ctx.save(); ctx.font = o.font || F.head(64); ctx.textBaseline = 'alphabetic';
  const lines = wrap(ctx, s, o.maxW || 1500), lh = o.lh || 84;
  const total = s.split(' ').length; let k = 0;
  lines.forEach((l, li) => {
    const lw = ctx.measureText(l).width; let cx = o.align === 'center' ? x - lw / 2 : x;
    for (const w of l.split(' ')) {
      const a = easeOut(clamp(p * total * 1.15 - k)); k++;
      ctx.globalAlpha = a; ctx.fillStyle = (o.highlight && o.highlight.includes(w.replace(/[^\w’'-]/g, ''))) ? C.yellow : (o.color || C.white);
      ctx.fillText(w, cx, y + li * lh + (1 - a) * 18); cx += ctx.measureText(w + ' ').width;
    }
  });
  ctx.restore(); return lines.length * lh;
}

// ---------- shapes & cards ----------
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function card(ctx, x, y, w, h, o = {}) {
  ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1);
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  rr(ctx, x, y, w, h, o.r ?? 18); ctx.fillStyle = o.fill || 'rgba(38,43,51,0.94)'; ctx.fill();
  ctx.shadowColor = 'transparent';
  if (o.accent) { ctx.save(); rr(ctx, x, y, w, h, o.r ?? 18); ctx.clip(); ctx.fillStyle = o.accent; ctx.fillRect(x, y, o.bar ?? 8, h); ctx.restore(); }
  if (o.stroke) { ctx.lineWidth = o.lw || 2; ctx.strokeStyle = o.stroke; rr(ctx, x, y, w, h, o.r ?? 18); ctx.stroke(); }
  ctx.restore();
}
function pill(ctx, s, x, y, o = {}) {
  ctx.save(); ctx.font = o.font || F.ui(26, 800); const w = ctx.measureText(s).width + 36, h = o.h || 46;
  ctx.globalAlpha *= (o.alpha ?? 1); rr(ctx, x, y, w, h, h / 2); ctx.fillStyle = o.fill || C.yellow; ctx.fill();
  ctx.fillStyle = o.color || C.slate; ctx.textBaseline = 'middle'; ctx.fillText(s, x + 18, y + h / 2 + 1); ctx.restore(); return w;
}
function arrow(ctx, pts, p, o = {}) {           // animated polyline arrow; pts in screen space
  if (p <= 0 || pts.length < 2) return;
  const segs = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); L += d; }
  let rem = L * clamp(p); ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1);
  ctx.strokeStyle = o.color || C.yellow; ctx.lineWidth = o.lw || 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath(); ctx.moveTo(...pts[0]); let end = pts[0], ang = 0;
  for (let i = 1; i < pts.length && rem > 0; i++) {
    const f = Math.min(1, rem / segs[i - 1]); const x = lerp(pts[i - 1][0], pts[i][0], f), y = lerp(pts[i - 1][1], pts[i][1], f);
    ctx.lineTo(x, y); ang = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]); end = [x, y]; rem -= segs[i - 1];
  }
  ctx.stroke(); ctx.setLineDash([]);
  if (!o.noHead) { ctx.translate(...end); ctx.rotate(ang); ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(-16, -11); ctx.lineTo(-16, 11); ctx.closePath(); ctx.fillStyle = o.color || C.yellow; ctx.fill(); }
  ctx.restore();
}

// ---------- background ----------
let GRAIN;
function makeGrain() {
  GRAIN = document.createElement('canvas'); GRAIN.width = 512; GRAIN.height = 512;
  const g = GRAIN.getContext('2d'), id = g.createImageData(512, 512);
  for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 10; }
  g.putImageData(id, 0, 0);
}
function bg(ctx, o = {}) {
  const g = ctx.createRadialGradient(W * 0.5, H * 0.45, 100, W * 0.5, H * 0.5, W * 0.75);
  g.addColorStop(0, o.inner || '#262B33'); g.addColorStop(1, o.outer || '#14171C');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function vignette(ctx, k = 0.55) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, W * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${k})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function grain(ctx, t) {
  ctx.save(); ctx.globalAlpha = 0.5; const ox = Math.floor((t * 97) % 512), oy = Math.floor((t * 61) % 512);
  for (let x = -ox; x < W; x += 512) for (let y = -oy; y < H; y += 512) ctx.drawImage(GRAIN, x, y); ctx.restore();
}

// ---------- maps ----------
function camera(lon, lat, zoom) {
  return d3.geoMercator().scale(256 * Math.pow(2, zoom) / (2 * Math.PI)).center([lon, lat]).translate([W / 2, H / 2]).precision(0.2);
}
function camLerp(a, b, t) {   // fly between camera keyframes {lon,lat,zoom}; zoom interpolates linearly (log-scale)
  const e = ease(t); return { lon: lerp(a.lon, b.lon, e), lat: lerp(a.lat, b.lat, e), zoom: lerp(a.zoom, b.zoom, e) };
}
let RTMP;
function raster(ctx, proj, img, meta, o = {}) {
  const [w, s, e, n] = meta.bounds, [x0, y0] = proj([w, n]), [x1, y1] = proj([e, s]);
  if (x1 < 0 || y1 < 0 || x0 > W || y0 > H) return;
  if (!o.feather) {
    ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1); if (o.filter) ctx.filter = o.filter;
    ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, x0, y0, x1 - x0, y1 - y0); ctx.restore(); return;
  }
  // soft edges: draw into a scratch canvas, then fade the four borders with destination-in masks
  if (!RTMP) { RTMP = document.createElement('canvas'); RTMP.width = W; RTMP.height = H; }
  const g = RTMP.getContext('2d'), f = o.feather; g.save(); g.clearRect(0, 0, W, H);
  if (o.filter) g.filter = o.filter; g.imageSmoothingQuality = 'high'; g.drawImage(img, x0, y0, x1 - x0, y1 - y0); g.filter = 'none';
  g.globalCompositeOperation = 'destination-in';
  const fx = Math.min(f / Math.max(x1 - x0, 1), 0.49), fy = Math.min(f / Math.max(y1 - y0, 1), 0.49);
  const gh = g.createLinearGradient(x0, 0, x1, 0); gh.addColorStop(0, 'rgba(0,0,0,0)'); gh.addColorStop(fx, '#000'); gh.addColorStop(1 - fx, '#000'); gh.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gh; g.fillRect(0, 0, W, H);
  const gv = g.createLinearGradient(0, y0, 0, y1); gv.addColorStop(0, 'rgba(0,0,0,0)'); gv.addColorStop(fy, '#000'); gv.addColorStop(1 - fy, '#000'); gv.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gv; g.fillRect(0, 0, W, H); g.restore();
  ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1); ctx.drawImage(RTMP, 0, 0); ctx.restore();
}
// d3 reads ring winding spherically: a polygon wound the "wrong" way covers the rest of the globe (clipping can flip
// a few, e.g. Russia). Fills use a copy with any such polygon's rings reversed.
const WIND = new WeakMap();
function wound(geom) {
  if (!geom || !/Polygon/.test(geom.type)) return geom;
  if (WIND.has(geom)) return WIND.get(geom);
  const fix = rings => d3.geoArea({ type: 'Polygon', coordinates: rings }) > 2 * Math.PI ? rings.map(r => r.slice().reverse()) : rings;
  const out = geom.type === 'Polygon' ? { type: 'Polygon', coordinates: fix(geom.coordinates) } : { type: 'MultiPolygon', coordinates: geom.coordinates.map(fix) };
  WIND.set(geom, out); return out;
}
function geo(ctx, proj, geom, o = {}) {
  if (o.fill) geom = wound(geom);
  const path = d3.geoPath(proj, ctx); ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1);
  ctx.beginPath(); path(geom);
  if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); }
  if (o.stroke) { ctx.strokeStyle = o.stroke; ctx.lineWidth = o.lw || 1.5; if (o.dash) ctx.setLineDash(o.dash); ctx.lineJoin = 'round'; ctx.stroke(); }
  ctx.restore();
}
function countries(ctx, proj, o = {}) {
  const set = o.wide ? A.geo.countries_wide : A.geo.countries;
  for (const c of set) {
    const hi = o.highlight && o.highlight[c.a3];
    geo(ctx, proj, c.geom, { fill: hi ? hi : (o.fill || null), stroke: o.stroke ?? 'rgba(255,255,255,0.28)', lw: o.lw || 1.2, alpha: o.alpha });
  }
  // India always from the Survey-of-India-compliant outline
  geo(ctx, proj, A.geo.india, { fill: o.indiaFill || null, stroke: o.indiaStroke || 'rgba(255,255,255,0.55)', lw: o.indiaLw || 1.6, alpha: o.alpha });
}
function rivers(ctx, proj, names, o = {}) {
  for (const r of A.geo.rivers) if (!names || names.includes(r.name))
    geo(ctx, proj, r.geom, { stroke: o.color || C.blue, lw: o.lw || 3, alpha: o.alpha });
}
function pin(ctx, proj, lonlat, label, o = {}) {
  const [x, y] = proj(lonlat); const a = o.alpha ?? 1; if (a <= 0) return [x, y];
  ctx.save(); ctx.globalAlpha *= a;
  if (o.pulse != null) { const r = 14 + 40 * (o.pulse % 1); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.strokeStyle = o.color || C.yellow; ctx.globalAlpha *= (1 - o.pulse % 1); ctx.lineWidth = 3; ctx.stroke(); ctx.globalAlpha = a; }
  ctx.beginPath(); ctx.arc(x, y, o.r || 9, 0, 7); ctx.fillStyle = o.color || C.yellow; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = C.slate; ctx.stroke();
  if (label) {
    const dx = o.dx ?? 18, dy = o.dy ?? -14; ctx.font = o.font || F.ui(30, 800); ctx.textAlign = dx < 0 ? 'right' : 'left';
    ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(20,23,28,0.85)'; ctx.strokeText(label, x + dx, y + dy);
    ctx.fillStyle = o.labelColor || C.white; ctx.fillText(label, x + dx, y + dy);
    if (o.sub) { ctx.font = F.ui(24, 600); ctx.strokeText(o.sub, x + dx, y + dy + 32); ctx.fillStyle = o.subColor || '#D5DAE0'; ctx.fillText(o.sub, x + dx, y + dy + 32); }
  }
  ctx.restore(); return [x, y];
}
function mapLabel(ctx, proj, lonlat, s, o = {}) {
  const [x, y] = proj(lonlat); ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1);
  ctx.font = o.font || F.ui(26, 600); ctx.textAlign = 'center'; ctx.letterSpacing = o.ls || '0px';
  ctx.fillStyle = o.color || 'rgba(255,255,255,0.55)'; if (o.italic) ctx.font = 'italic ' + ctx.font;
  ctx.fillText(s, x, y); ctx.restore();
}
function locatorInset(ctx, x, y, w, h, target, a = 1) {   // India + target point on a mini wide map
  ctx.save(); ctx.globalAlpha *= a; card(ctx, x, y, w, h, { fill: 'rgba(20,23,28,0.92)', stroke: 'rgba(255,255,255,0.15)' });
  rr(ctx, x, y, w, h, 18); ctx.clip();
  const proj = d3.geoMercator().fitExtent([[x + 12, y + 12], [x + w - 12, y + h - 12]], { type: 'MultiPoint', coordinates: [[25, 50], [92, 6]] });
  for (const c of A.geo.countries_wide) geo(ctx, proj, c.geom, { fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.12)', lw: 0.7 });
  geo(ctx, proj, A.geo.india, { fill: 'rgba(245,211,0,0.30)', stroke: C.yellow, lw: 1.2 });
  const [tx, ty] = proj(target), [ix, iy] = proj([78.9, 22.5]);
  ctx.setLineDash([5, 5]); ctx.strokeStyle = C.yellow; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ix, iy); ctx.quadraticCurveTo((ix + tx) / 2, Math.min(iy, ty) - 40, tx, ty); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(tx, ty, 6, 0, 7); ctx.fillStyle = C.red; ctx.fill();
  ctx.font = F.ui(24, 800); ctx.fillStyle = C.yellow; ctx.fillText('INDIA', ix - 34, iy + 8);
  ctx.restore();
  text(ctx, 'Boundaries: Survey of India outline (DataMeet)', x + 6, y + h + 30, { font: F.ui(24, 600), color: C.dim, alpha: a });
}

// ---------- mind maps ----------
function node(ctx, x, y, s, o = {}) {
  ctx.save(); ctx.font = o.font || F.ui(34, 800); const lines = wrap(ctx, s, o.maxW || 380);
  const lh = o.lh || 42, w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 48, h = lines.length * lh + 30;
  const a = o.alpha ?? 1, sc = o.scale ?? (0.85 + 0.15 * a);
  ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha *= a;
  card(ctx, -w / 2, -h / 2, w, h, { fill: o.fill || 'rgba(38,43,51,0.96)', stroke: o.stroke || 'rgba(255,255,255,0.18)', lw: o.lw || 2, r: o.r ?? 16 });
  ctx.fillStyle = o.color || C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  lines.forEach((l, i) => ctx.fillText(l, 0, -((lines.length - 1) * lh) / 2 + i * lh + 2));
  if (o.sub) { ctx.font = F.ui(24, 600); ctx.fillStyle = o.subColor || '#C9CFD6'; ctx.fillText(o.sub, 0, h / 2 + 28); }
  ctx.restore(); return { w, h };
}
function link(ctx, a, b, p, o = {}) {
  if (p <= 0) return; ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1);
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - (o.bend || 0);
  ctx.strokeStyle = o.color || 'rgba(245,211,0,0.75)'; ctx.lineWidth = o.lw || 3; ctx.setLineDash(o.dash || []);
  ctx.beginPath(); ctx.moveTo(...a);
  const e = clamp(p); const qx = (t) => (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * mx + t * t * b[0], qy = (t) => (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * my + t * t * b[1];
  for (let k = 1; k <= 24; k++) ctx.lineTo(qx(k / 24 * e), qy(k / 24 * e)); ctx.stroke();
  if (o.label && p > 0.6) { ctx.font = F.ui(24, 600); ctx.fillStyle = '#C9CFD6'; ctx.textAlign = 'center'; ctx.globalAlpha *= span(p, 0.6, 1); ctx.fillText(o.label, qx(0.5), qy(0.5) - 10); }
  ctx.restore();
}

// ---------- the Decode Desk (person-free; voice-only identity) ----------
function waveform(ctx, x, y, w, h, t, amp) {
  ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 3; ctx.shadowColor = C.yellow; ctx.shadowBlur = 18;
  ctx.beginPath();
  for (let i = 0; i <= 160; i++) {
    const u = i / 160, env = Math.sin(Math.PI * u);
    const v = Math.sin(u * 37 + t * 9) * 0.5 + Math.sin(u * 91 - t * 13) * 0.3 + Math.sin(u * 13 + t * 4.7) * 0.2;
    const k = amp * (0.55 + 0.45 * Math.sin(t * 3.1 + u * 5));
    ctx.lineTo(x + u * w, y + v * env * h * k);
  }
  ctx.stroke(); ctx.restore();
}
function desk(ctx, t, o = {}) {
  const lamp = (o.lamp ?? 1) * (1 + 0.025 * Math.sin(t * 2.3) * Math.sin(t * 0.7));     // a faint, living flicker
  // room + desk surface
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#101318'); g.addColorStop(0.55, '#171B21'); g.addColorStop(1, '#0D1014');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#20252C'; ctx.beginPath(); ctx.moveTo(0, 640); ctx.lineTo(W, 600); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  const dg = ctx.createLinearGradient(0, 600, 0, H); dg.addColorStop(0, '#2A3038'); dg.addColorStop(1, '#161A1F'); ctx.fillStyle = dg;
  ctx.beginPath(); ctx.moveTo(0, 650); ctx.lineTo(W, 612); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  // lamp glow
  const lg = ctx.createRadialGradient(1500, 560, 20, 1500, 600, 900); lg.addColorStop(0, `rgba(255,214,140,${0.42 * lamp})`); lg.addColorStop(1, 'rgba(255,214,140,0)');
  ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
  // brass lamp (simple architectural lines)
  ctx.save(); ctx.strokeStyle = '#B8924A'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(1640, 640); ctx.lineTo(1600, 400); ctx.lineTo(1470, 330); ctx.stroke();
  ctx.fillStyle = '#B8924A'; ctx.beginPath(); ctx.ellipse(1645, 645, 90, 18, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(1400, 360); ctx.lineTo(1540, 300); ctx.lineTo(1560, 350); ctx.lineTo(1430, 420); ctx.closePath(); ctx.fill();
  ctx.fillStyle = `rgba(255,226,160,${0.85 * lamp})`; ctx.beginPath(); ctx.ellipse(1430, 395, 42, 12, -0.4, 0, 7); ctx.fill(); ctx.restore();
  // globe (orthographic, slowly turning)
  ctx.save(); const gx = 300, gy = 520, gr = 120;
  const pr = d3.geoOrthographic().scale(gr).translate([gx, gy]).rotate([-(40 + t * 4), -25]).clipAngle(90);
  const path = d3.geoPath(pr, ctx);
  ctx.beginPath(); path({ type: 'Sphere' }); ctx.fillStyle = '#1C3247'; ctx.fill();
  for (const c of A.geo.countries_wide) { ctx.beginPath(); path(c.geom); ctx.fillStyle = '#7C8B6A'; ctx.fill(); }
  ctx.beginPath(); path(A.geo.india); ctx.fillStyle = '#C9A34A'; ctx.fill();
  ctx.beginPath(); path(d3.geoGraticule10()); ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.stroke();
  const sh = ctx.createRadialGradient(gx - 40, gy - 50, 10, gx, gy, gr); sh.addColorStop(0, 'rgba(255,255,255,0.18)'); sh.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.beginPath(); ctx.arc(gx, gy, gr, 0, 7); ctx.fillStyle = sh; ctx.fill();
  ctx.strokeStyle = '#B8924A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(gx, gy, gr + 14, -2.2, 1.0); ctx.stroke();
  ctx.fillStyle = '#B8924A'; ctx.fillRect(gx - 8, gy + gr + 10, 16, 90); ctx.beginPath(); ctx.ellipse(gx, gy + gr + 105, 70, 14, 0, 0, 7); ctx.fill(); ctx.restore();
  // open notebook (perspective-free, slightly rotated)
  ctx.save(); ctx.translate(960, 790); if (o.book === false) ctx.globalAlpha = 0; ctx.rotate(-0.025);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
  ctx.fillStyle = '#E9E2D2'; rr(ctx, -560, -250, 1120, 470, 10); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-6, -250, 12, 470);
  ctx.strokeStyle = 'rgba(70,110,160,0.22)'; ctx.lineWidth = 1.5;
  for (let y = -190; y < 200; y += 44) { ctx.beginPath(); ctx.moveTo(-520, y); ctx.lineTo(-30, y); ctx.moveTo(30, y); ctx.lineTo(520, y); ctx.stroke(); }
  // handwriting in "yellow ink" (a warm amber so it reads on paper)
  if (o.lines) {
    ctx.font = F.hand(o.handSize || 58); ctx.fillStyle = '#C08A00';
    let y = -150;
    o.lines.forEach((ln, i) => {
      const p = clamp((o.write ?? 1) * o.lines.length - i); if (p <= 0) return;
      const x0 = ln.right ? 50 : -510, w = ctx.measureText(ln.s).width;
      ctx.save(); ctx.beginPath(); ctx.rect(x0 - 5, y - 60, (w + 10) * p, 90); ctx.clip(); ctx.fillText(ln.s, x0, y); ctx.restore();
      if (p < 1) { ctx.fillStyle = '#C08A00'; ctx.beginPath(); ctx.arc(x0 + w * p, y - 8, 4, 0, 7); ctx.fill(); }
      y += ln.gap || 88;
    });
  }
  if (o.sketch) o.sketch(ctx);
  ctx.restore();
  // waveform (moves with the voice)
  const env = A.env ? (A.env[Math.min(A.env.length - 1, Math.floor(GT * 30))] || 0) : null;   // real voice level when a narration track exists
  waveform(ctx, 560, 1000, 800, 34, t, env != null ? 0.08 + 1.1 * env : (o.speaking ?? 0.8));
  vignette(ctx, 0.6);
}


// ---------- Glimpse kit v3 (Prelims Grid and AP–TG Desk) ----------
// Rebuilt after three W44 reviews (content, visual, benchmark): every item settles into a NOTES-READY frame an
// aspirant can pause and copy. Fixed zones (1920x1080, title-safe 96 px):
//   header 96,56 · 1728x160    chip + one-line headline (measured) + sub-line
//   window 96,232 · 1080x600   the visual: map, satellite, chart or table; never darkened, push-in lives only here
//   notes  1200,232 · 624x600  "WRITE THIS DOWN": 3–6 rows, each landing on its cue word
//   trap   96,852 · 1728x132   PRELIMS TRAP: "UPSC may write" (myth) | the fact; red appears nowhere else
//   footer 96,1004             progress dots + one-line credit; never scaled
// A scene file sets GK = { order: [...], cat: { X: { name, col, ink } } }. Text never zooms (render.html: NO_PUSH).
let GK = { order: [], cat: {} };
const SENT_CREDIT = 'Contains modified Copernicus Sentinel data 2026';
const TERRAIN_CREDIT = 'Terrain: Mapzen/AWS · Boundaries: Natural Earth; India: Survey of India outline (DataMeet)';
const GZ = { win: [96, 232, 1080, 600], notes: [1200, 232, 624, 600], trap: [96, 852, 1728, 132] };
// v3.1 colour pass (owner: "give colourful"): a rotating accent set for row labels, table rows and sheet rows.
// Red stays reserved for the trap (§6.5); the accents are bright but never red or pink.
const ACC = ['#F5D300', '#5BB8F0', '#2BC4B0', '#F59E3B', '#A78BFA', '#7BCB5A'];
const tint = (hex, a) => hex + Math.round(clamp(a) * 255).toString(16).padStart(2, '0');
function fitFont(ctx, s, maxW, size, min, fam = F.head) {   // largest size ≤ size (down to min) that fits on one line
  for (let z = size; z >= min; z -= 2) { ctx.font = fam(z); if (ctx.measureText(s).width <= maxW) return z; }
  return min;
}
function gHeader(ctx, s, k, title, sub) {
  const c = GK.cat[GK.order[k]], a = appear(s.t, 0.3, 0.6);
  ctx.save(); ctx.globalAlpha = a; ctx.font = F.ui(24, 800);
  const chip = `${c.name}  ${String(k + 1).padStart(2, '0')}/${GK.order.length}`, cw = ctx.measureText(chip).width + 36;
  rr(ctx, 96, 52, cw, 44, 22); ctx.fillStyle = c.col; ctx.fill(); ctx.fillStyle = c.ink; ctx.textBaseline = 'middle'; ctx.fillText(chip, 114, 75);
  const z = fitFont(ctx, title, 1500, 60, 44);
  ctx.font = F.head(z); ctx.fillStyle = C.white; ctx.textBaseline = 'alphabetic'; ctx.fillText(title, 96, 160);
  const tw = Math.min(ctx.measureText(title).width, 1500), ug = ctx.createLinearGradient(96, 0, 96 + tw, 0);
  ug.addColorStop(0, c.col); ug.addColorStop(1, tint(c.col, 0)); ctx.fillStyle = ug; ctx.fillRect(96, 172, tw * easeOut(span(s.t, 0.4, 1.2)), 5);
  if (sub) { ctx.font = F.ui(28, 600); ctx.fillStyle = '#DCE2E8'; ctx.fillText(sub, 98, 210); }
  ctx.restore();
}
// the visual window: clipped, undarkened; fn(ctx, box) draws inside. A slow push-in lives only here.
function gWindow(ctx, s, fn, o = {}) {
  const [x, y, w, h] = o.box || GZ.win;
  ctx.save(); rr(ctx, x, y, w, h, 14); ctx.clip();
  ctx.fillStyle = '#12283A'; ctx.fillRect(x, y, w, h);
  if (o.push !== false) { const k = 1 + 0.035 * s.p, cx = x + w / 2, cy = y + h / 2; ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); }
  fn(ctx, [x, y, w, h]);
  ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 14); ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}
// the notes panel: rows = [[label, value, cueWord, {big, hl}] ...]; values wrap and shrink to fit the panel
function gNotes(ctx, s, k, rows, o = {}) {
  const c = GK.cat[GK.order[k]], [x, y, w, h] = o.box || GZ.notes, pad = 26, iw = w - 2 * pad;
  ctx.save(); rr(ctx, x, y, w, h, 14); const pg = ctx.createLinearGradient(x, y, x, y + h); pg.addColorStop(0, tint(c.col, 0.22)); pg.addColorStop(0.35, '#1F242C'); pg.addColorStop(1, '#1A1E25');
  ctx.fillStyle = pg; ctx.fill(); ctx.strokeStyle = tint(c.col, 0.55); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  text(ctx, '✎ ' + (o.title || 'WRITE THIS DOWN'), x + pad, y + 44, { font: F.ui(24, 800), color: c.col });
  // measure at a starting size, shrink until it fits
  let vz = o.size || 34, lay;
  for (; vz >= 24; vz -= 2) {
    lay = []; let yy = y + 70;
    ctx.save();
    for (const [lab, val, cw, op = {}] of rows) {
      const big = op.big, f = big ? F.head(vz + 18) : F.ui(vz, 700), lh = (big ? vz + 18 : vz) * 1.18;
      ctx.font = f; const lines = wrap(ctx, val, iw - 8);
      const rh = (lab ? 40 : 6) + lines.length * lh + 18;
      lay.push({ lab, lines, f, lh, yy, rh, cw, op }); yy += rh;
    }
    ctx.restore();
    if (yy <= y + h - 12) break;
  }
  lay.forEach((r, i) => {
    const a = r.cw === null ? 1 : appear(s.t, (r.cw ? s.w(r.cw) : s.d * (0.15 + 0.6 * i / lay.length)) - 0.3, 0.45);
    if (a <= 0) return;
    const dx = (1 - a) * 24, rc = r.op.acc || ACC[(i + (o.shift || 0)) % ACC.length];
    ctx.save(); ctx.globalAlpha = a; rr(ctx, x + 12, r.yy - 4, w - 24, r.rh - 6, 8); ctx.fillStyle = tint(rc, r.op.hl ? 0.26 : 0.10); ctx.fill();
    ctx.fillStyle = rc; ctx.fillRect(x + 12, r.yy - 4, 5, r.rh - 6); ctx.restore();
    if (r.lab) {
      pill(ctx, r.lab.toUpperCase(), x + pad + dx - 4, r.yy + 2, { fill: rc, color: C.slate, font: F.ui(24, 800), h: 30, alpha: a }); }
    r.lines.forEach((l, j) => text(ctx, l, x + pad + dx, r.yy + (r.lab ? 40 : 6) + (j + 0.82) * r.lh, { font: r.f, color: r.op.col || C.white, alpha: a }));
  });
}
// a comparison table inside a box: cols = [label, width share], rows = [[cells...], cueWord, {hl, trapCol}]
function gTable(ctx, s, k, box, cols, rows, o = {}) {
  const c = GK.cat[GK.order[k]], [x, y, w, h] = box, hh = 56, rh = Math.min(o.rowH || 104, (h - hh - 10) / rows.length);
  ctx.save(); rr(ctx, x, y, w, h, 14); ctx.fillStyle = '#1C2027'; ctx.fill(); ctx.strokeStyle = tint(c.col, 0.55); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, hh, 14); ctx.clip(); ctx.fillStyle = c.col; ctx.fillRect(x, y, w, hh); ctx.restore();
  let cx = x + 22; const xs = cols.map(([, sh]) => { const v = cx; cx += (w - 44) * sh; return v; });
  cols.forEach(([lab], i) => text(ctx, lab.toUpperCase(), xs[i], y + 37, { font: F.ui(24, 800), color: c.ink }));
  const trapAt = rows.some(r => r[2] && r[2].trapCol != null) ? s.w('prelims trap') - 0.3 : Infinity;
  rows.forEach(([cells, cw, op = {}], r) => {
    const a = appear(s.t, (cw ? s.w(cw) : s.d * (0.12 + 0.55 * r / rows.length)) - 0.3, 0.4), yy = y + hh + r * rh;
    if (a <= 0) return;
    const rc = op.acc || ACC[(r + (o.shift || 0)) % ACC.length];
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = tint(op.hl ? c.col : rc, op.hl ? 0.30 : 0.09); ctx.fillRect(x + 4, yy + 3, w - 8, rh - 6);
    ctx.fillStyle = op.hl ? c.col : rc; ctx.fillRect(x + 4, yy + 3, 6, rh - 6); ctx.restore();
    cells.forEach((cell, i) => {
      const cw2 = (i < cols.length - 1 ? xs[i + 1] : x + w - 22) - xs[i] - 14;
      ctx.save(); ctx.font = F.ui(o.size || 28, i === 0 ? 800 : 600); const lines = wrap(ctx, cell, cw2); ctx.restore();
      const lh = (o.size || 28) * 1.18, top = yy + (rh - lines.length * lh) / 2 + lh * 0.8;
      lines.forEach((l, j) => text(ctx, l, xs[i], top + j * lh, { font: F.ui(o.size || 28, i === 0 ? 800 : 600), color: i === 0 ? (op.hl ? C.white : rc) : '#EEF1F4', alpha: a }));
      if (op.trapCol === i && s.t > trapAt) { ctx.save(); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.globalAlpha = appear(s.t, trapAt); rr(ctx, xs[i] - 8, yy + 8, cw2 + 12, rh - 16, 8); ctx.stroke(); ctx.restore(); }
    });
  });
}
// PRELIMS TRAP bar: the myth sits in a box headed "UPSC MAY WRITE"; the fact in white on the right
function gTrap(ctx, s, myth, truth) {
  const at = s.w('prelims trap') - 0.3, a = appear(s.t, at, 0.4); if (a <= 0) return;
  const [x, y0, w, h] = GZ.trap, y = y0 + (1 - a) * 40;
  ctx.save(); ctx.globalAlpha = a; rr(ctx, x, y, w, h, 14); ctx.fillStyle = 'rgba(20,23,28,0.97)'; ctx.fill(); ctx.restore();
  pill(ctx, 'PRELIMS TRAP', x, y - 20, { fill: C.red, color: C.white, font: F.ui(24, 800), h: 40, alpha: a });
  ctx.save(); ctx.globalAlpha = a; rr(ctx, x + 18, y + 22, 800, h - 40, 10); ctx.strokeStyle = 'rgba(229,72,77,0.8)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  text(ctx, 'UPSC MAY WRITE', x + 38, y + 50, { font: F.ui(24, 800), color: '#F08A8D', alpha: a });
  ctx.save(); ctx.font = F.ui(32, 700); const mw = Math.min(ctx.measureText(myth).width, 760); ctx.restore();
  text(ctx, myth, x + 38, y + 94, { font: F.ui(32, 700), color: 'rgba(255,255,255,0.85)', alpha: a, maxW: 760 });
  const sp = span(s.t, at + 0.8, at + 1.2);
  if (sp > 0) { ctx.save(); ctx.globalAlpha = 0.6 * a; ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 36, y + 84); ctx.lineTo(x + 36 + (mw + 6) * easeOut(sp), y + 84); ctx.stroke(); ctx.restore(); }
  const ra = appear(s.t, at + 1.1, 0.4);
  ctx.save(); ctx.globalAlpha = ra; rr(ctx, x + 834, y + 18, w - 852, h - 36, 10); ctx.fillStyle = tint(C.teal, 0.22); ctx.fill(); ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  text(ctx, '✓', x + 850, y + 86, { font: F.ui(44, 800), color: C.teal, alpha: ra });
  ctx.save(); ctx.font = F.ui(36, 800); const tz = fitFont(ctx, truth, 820, 36, 26, (z) => F.ui(z, 800)); ctx.restore();
  text(ctx, truth, x + 900, y + 84, { font: F.ui(tz, 800), alpha: ra });
}
function strike(ctx, x0, x1, y, p, col = C.red) {
  if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.globalAlpha *= 0.7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, easeOut(p)), y); ctx.stroke(); ctx.restore();
}
// category sting: a coloured panel with the item number sweeps across in the first 0.8 s
function sting(ctx, s, k) {
  const p = span(s.t, 0, 0.8); if (p >= 1) return;
  const c = GK.cat[GK.order[k]], x = lerp(0, -W - 300, ease(p));
  ctx.save(); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + W + 200, 0); ctx.lineTo(x + W, H); ctx.lineTo(x - 200, H); ctx.closePath();
  ctx.fillStyle = c.col; ctx.fill();
  ctx.font = F.head(220, 800); ctx.fillStyle = c.ink; ctx.globalAlpha = 0.9; ctx.textAlign = 'center';
  ctx.fillText(String(k + 1).padStart(2, '0'), x + W / 2, 620); ctx.restore();
}
function progress(ctx, k) {
  const w = 24, g = 6, x0 = 96, y = 1030;
  GK.order.forEach((c, i) => { ctx.save(); ctx.globalAlpha = i === k ? 1 : 0.35; rr(ctx, x0 + i * (w + g), y - (i === k ? 4 : 0), w, i === k ? 14 : 8, 3); ctx.fillStyle = GK.cat[c].col; ctx.fill(); ctx.restore(); });
}
function finish(ctx, s, k, credit) { progress(ctx, k); sting(ctx, s, k); s.credit = credit || null; }
function glimpseBase(ctx, k) {        // slate with two soft colour glows: the category's (top left) and a cool accent (bottom right)
  const col = k != null && GK.cat[GK.order[k]] ? GK.cat[GK.order[k]].col : C.yellow;
  ctx.fillStyle = '#151920'; ctx.fillRect(0, 0, W, H);
  let g = ctx.createRadialGradient(260, 120, 20, 260, 120, 1100); g.addColorStop(0, tint(col, 0.26)); g.addColorStop(1, tint(col, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  g = ctx.createRadialGradient(1750, 1000, 20, 1750, 1000, 1000); g.addColorStop(0, tint(col === C.blue ? C.teal : C.blue, 0.22)); g.addColorStop(1, tint(C.blue, 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ---------- map helpers ----------
function terrainMap(ctx, proj, local, o = {}) {
  ctx.fillStyle = '#12283A'; ctx.fillRect(0, 0, W, H);
  for (const t of ['world', 'wide'].filter(n => A[n] && (o.world || n === 'wide'))) raster(ctx, proj, A[t], A[t + '_meta'], { filter: 'brightness(1.25) contrast(1.15)', feather: 200 });
  if (local && A[local]) raster(ctx, proj, A[local], A[local + '_meta'], { feather: 160, filter: 'brightness(1.25) contrast(1.15)' });
  // colour: a blue wash for the sea, then land tints over it (other countries green, India warm sand) so relief still shows
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#6FAEE0'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.fillStyle = 'rgba(40,120,195,0.22)'; ctx.fillRect(0, 0, W, H);
  countries(ctx, proj, { wide: true, fill: o.landFill ?? 'rgba(112,196,118,0.40)', stroke: 'rgba(255,255,255,0.55)', lw: 1.5, highlight: o.highlight, indiaStroke: C.yellow, indiaLw: 2.4, indiaFill: o.indiaFill ?? 'rgba(255,200,110,0.40)' });
  for (const l of A.geo.lakes) geo(ctx, proj, l.geom, { fill: 'rgba(91,184,240,0.8)' });
  if (o.states) indiaStates(ctx, proj, o.states);
}
// interior state lines (external boundary always from DataMeet); labels: { 'Andhra Pradesh': [lon, lat] or true }
function indiaStates(ctx, proj, o = {}) {
  for (const st of A.geo.india_states || []) geo(ctx, proj, st.geom, { stroke: 'rgba(255,255,255,0.5)', lw: 1.6, dash: [6, 5] });
  for (const [name, at] of Object.entries(o.labels || {})) {
    const st = (A.geo.india_states || []).find(x => x.name === name); const ll = Array.isArray(at) ? at : st && st.label; if (!ll) continue;
    mapLabel(ctx, proj, ll, name.toUpperCase(), { font: F.ui(26, 800), color: 'rgba(255,255,255,0.8)' });
  }
}
function labelPill(ctx, proj, lonlat, s, o = {}) {      // a readable map label: halo + slate pill, optional leader line
  const [px, py] = proj(lonlat), [dx, dy] = o.off || [0, 0], x = px + dx, y = py + dy;
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1; ctx.font = o.font || F.ui(28, 800);
  const w = ctx.measureText(s).width + 24;
  if (dx || dy) { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke(); }
  rr(ctx, x - (o.align === 'left' ? 0 : w / 2), y - 22, w, 40, 8); ctx.fillStyle = o.fill || 'rgba(20,23,28,0.82)'; ctx.fill();
  ctx.fillStyle = o.color || C.white; ctx.textBaseline = 'middle'; ctx.textAlign = o.align === 'left' ? 'left' : 'center'; ctx.fillText(s, o.align === 'left' ? x + 12 : x, y - 1);
  ctx.restore();
}
// a camera that frames a lon/lat box inside the visual window
function windowCamera(box, west, south, east, north) {
  const [x, y, w, h] = box;
  return d3.geoMercator().fitExtent([[x, y], [x + w, y + h]], { type: 'MultiPoint', coordinates: [[west, south], [east, north]] });
}
function zoomProj(proj, box, k) {          // a slow push toward the window centre, on the projection (labels stay crisp)
  const [x, y, w, h] = box, cx = x + w / 2, cy = y + h / 2, t = proj.translate(), sc = proj.scale();
  return proj.scale(sc * k).translate([cx + (t[0] - cx) * k, cy + (t[1] - cy) * k]);
}

// ---------- chrome: lower third, brand, chapter, credits, review caption ----------
function lowerThird(ctx, s, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.font = F.ui(26, 800); const w = ctx.measureText(s).width + 60;
  card(ctx, 80, 900, w, 64, { fill: 'rgba(20,23,28,0.9)', accent: C.yellow, r: 10 });
  ctx.fillStyle = C.white; ctx.textBaseline = 'middle'; ctx.fillText(s, 110, 933); ctx.restore();
}
function brand(ctx) {
  ctx.save(); ctx.globalAlpha = 0.85; pill(ctx, 'DECODE UPSC', 1650, 40, { font: F.ui(24, 800), h: 42 }); ctx.restore();
}
function chapterBanner(ctx, title, k) {    // top-centre, inside the title-safe area, 40 px title, held about 4 s
  if (k <= 0) return; ctx.save(); ctx.globalAlpha = k;
  ctx.font = F.ui(40, 800); const tw = ctx.measureText(title).width; ctx.font = F.ui(24, 800); const cw = ctx.measureText('CHAPTER').width;
  const w = tw + cw + 90, x = (W - w) / 2, y = 34 - (1 - k) * 20;
  card(ctx, x, y, w, 70, { fill: 'rgba(20,23,28,0.92)', stroke: 'rgba(245,211,0,0.6)', r: 35 });
  ctx.textBaseline = 'middle'; ctx.fillStyle = C.yellow; ctx.fillText('CHAPTER', x + 34, y + 37);
  ctx.font = F.ui(40, 800); ctx.fillStyle = C.white; ctx.fillText(title, x + 56 + cw, y + 37); ctx.restore();
}
function credit(ctx, s, a = 1) {      // bottom-right; long lines break at " · " onto a second line, clear of the progress dots
  if (!s) return; ctx.save(); ctx.font = F.ui(24, 500); let lines = [s];
  if (ctx.measureText(s).width > 1240) { const p = s.split(' · '), h = Math.ceil(p.length / 2); lines = [p.slice(0, h).join(' · '), p.slice(h).join(' · ')]; }
  ctx.restore(); lines.forEach((l, i) => text(ctx, l, W - 40, H - 24 - (lines.length - 1 - i) * 30, { font: F.ui(24, 500), color: 'rgba(255,255,255,0.75)', align: 'right', alpha: a, shadow: 6 }));
}
function reviewCaption(ctx, s) {
  if (!REVIEW || !s) return; ctx.save(); ctx.font = F.ui(24, 400);
  const lines = wrap(ctx, s, 1500).slice(-2), h = lines.length * 32 + 22;
  ctx.globalAlpha = 0.9; rr(ctx, 210, H - 40 - h, 1500, h, 10); ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.textAlign = 'center'; lines.forEach((l, i) => ctx.fillText(l, W / 2, H - 40 - h + 36 + i * 32));
  ctx.font = F.ui(16, 800); ctx.fillStyle = C.yellow; ctx.fillText('REVIEW CAPTION · NOT IN FINAL', W / 2, H - 40 - h - 8); ctx.restore();
}
