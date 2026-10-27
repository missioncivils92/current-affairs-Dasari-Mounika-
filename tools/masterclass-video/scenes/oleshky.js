// Scenes for the sample Deep Dive "The Oleshky Truce" (weeks/2026-W44/sample-oleshky).
// Each scene: SCENES.Sxx = (ctx, s) with s = {t, d, p, beat(i), text}; set s.credit for on-screen credits.
const P = {
  kherson: [32.617, 46.635], oleshky: [32.717, 46.617], dam: [33.370, 46.777], znpp: [34.586, 47.508], enerhodar: [34.656, 47.497],
  kalanchak: [33.293, 46.255], armyansk: [33.692, 46.106], dzhankoi: [34.393, 45.708], kerch: [36.47, 45.36], kerchStrait: [36.55, 45.22],
  bosphorus: [29.06, 41.12], dardanelles: [26.40, 40.20], marmara: [28.2, 40.75], azov: [36.6, 46.15], kyiv: [30.52, 50.45],
  source: [33.40, 55.87], zap: [35.14, 47.84], blackSea: [34.0, 43.3],
};
const CANAL = [[33.37, 46.77], [33.40, 46.60], [33.33, 46.40], [33.29, 46.25], [33.69, 46.10], [34.05, 45.85], [34.39, 45.71], [35.2, 45.45], [35.9, 45.36]];
const DNIPRO = ['Dnipro', 'Dnepre', 'Dnepr'];
const SAT = (n) => ({ img: A[n], meta: A[n + '_meta'] });
const COPERNICUS = (n) => A[n + '_meta'].credit + ' · processed by Decode UPSC';
const TERRAIN = 'Elevation: Terrain Tiles (Mapzen/AWS) · Boundaries: Natural Earth (India POV), DataMeet';

function baseMap(ctx, proj, o = {}) {
  bg(ctx, { inner: '#1A1F26', outer: '#0F1216' });
  raster(ctx, proj, A.wide, A.wide_meta);
  raster(ctx, proj, A.region, A.region_meta, { feather: 160 });
  if (o.detail !== false) raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta, { alpha: o.detailAlpha ?? 1, feather: 220 });
  countries(ctx, proj, { stroke: 'rgba(255,255,255,0.30)', lw: 1.3, highlight: o.highlight });
  for (const l of A.geo.lakes) geo(ctx, proj, l.geom, { fill: 'rgba(74,144,194,0.55)' });
}

// ---------------- COLD OPEN ----------------
SCENES.S01 = (ctx, s) => {
  const cam = camLerp({ lon: 32.8, lat: 46.66, zoom: 10.7 }, { lon: 32.73, lat: 46.64, zoom: 11.1 }, s.p);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  baseMap(ctx, proj, { detailAlpha: 1 });
  raster(ctx, proj, A.oleshky_before, A.oleshky_before_meta, { alpha: 0.75, filter: 'brightness(0.45) saturate(0.6)', feather: 140 });
  rivers(ctx, proj, DNIPRO, { color: 'rgba(74,144,194,0.8)', lw: 4 });
  ctx.fillStyle = 'rgba(5,8,14,0.45)'; ctx.fillRect(0, 0, W, H);           // night
  const quiet = appear(s.t, s.beat(1) - 0.4, 1.4);
  pin(ctx, proj, P.kherson, 'Kherson', { alpha: 0.6 * appear(s.t, 2), color: C.white, dx: -18, sub: 'right bank' });
  pin(ctx, proj, P.oleshky, 'OLESHKY', { alpha: appear(s.t, 1.2), pulse: s.t * 0.6, sub: 'left bank', font: F.ui(38, 800) });
  // clock
  const sec = Math.floor(clamp(s.t / 3.5) * 59);
  card(ctx, 1460, 70, 380, 120, { fill: 'rgba(15,18,22,0.85)', stroke: 'rgba(255,255,255,0.12)' });
  text(ctx, sec < 59 ? `02:59:${String(sec).padStart(2, '0')}` : '03:00:00', 1650, 140, { font: F.mono(52, 700), align: 'center', color: sec < 59 ? C.white : C.yellow });
  text(ctx, 'KYIV · TUE 27 OCT 2026', 1650, 176, { font: F.ui(18, 800), align: 'center', color: C.dim });
  text(ctx, 'the guns go quiet — only here', 960, 1000, { font: F.hand(54), align: 'center', color: C.yellow, alpha: quiet });
  vignette(ctx, 0.7); s.credit = COPERNICUS('oleshky_before') + ' · ' + TERRAIN;
};
SCENES.S02 = (ctx, s) => {
  desk(ctx, s.t, { lines: [{ s: 'A truce in one town?' }, { s: 'Why here? Why now?', gap: 90 }, { s: '→ ask the better question' }], write: span(s.t, 0.3, s.d * 0.8) });
  lowerThird(ctx, 'GS-2 · International Relations   ·   GS-1 · Geography', appear(s.t, 0.8));
};
SCENES.S03 = (ctx, s) => {
  bg(ctx); text(ctx, 'CENTRAL QUESTION', 960, 300, { font: F.ui(26, 800), align: 'center', color: C.yellow, alpha: appear(s.t, 0) });
  revealWords(ctx, 'Why can a ceasefire hold in one town — and what does that tell India?', 960, 430, span(s.t, 0.2, 3.2), { font: F.head(76), maxW: 1500, align: 'center', lh: 96, highlight: ['one', 'town', 'India?'] });
  const items = ['a river', 'a destroyed dam', 'a canal', 'a nuclear plant', 'New Delhi'];
  ctx.font = F.ui(22, 800); const ws = items.map(it => ctx.measureText(it).width + 36), gap = 24;
  let px = 960 - (ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
  items.forEach((it, i) => { pill(ctx, it, px, 760, { alpha: appear(s.t, 3.2 + i * 0.5), fill: i === 4 ? C.yellow : 'rgba(255,255,255,0.12)', color: i === 4 ? C.slate : C.white }); px += ws[i] + gap; });
  vignette(ctx);
};
function pauseCard(ctx, s, q, startAt = 0) {
  bg(ctx);
  const k = appear(s.t, startAt);
  card(ctx, 260, 250, 1400, 520, { fill: 'rgba(38,43,51,0.96)', stroke: C.yellow, lw: 3, alpha: k });
  pill(ctx, 'PAUSE AND ANSWER', 320, 300, { alpha: k, font: F.ui(26, 800), h: 48 });
  text(ctx, q, 320, 450, { font: F.head(58), maxW: 1000, lh: 74, alpha: k });
  // countdown ring: runs over the last 5 s of the row
  const cd = clamp((s.t - (s.d - 5.4)) / 5), left = Math.ceil(5 - cd * 5);
  ctx.save(); ctx.globalAlpha = k; ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(1460, 520, 110, 0, 7); ctx.stroke();
  ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(1460, 520, 110, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.stroke(); ctx.restore();
  text(ctx, String(clamp(left, 0, 5)), 1460, 556, { font: F.head(110), align: 'center', alpha: k, color: C.yellow });
  vignette(ctx);
}
SCENES.S04 = (ctx, s) => pauseCard(ctx, s, 'Which international convention governs warships passing through the Kerch Strait?');

// ---------------- UPDATE DESK ----------------
SCENES.S05 = (ctx, s) => {
  desk(ctx, s.t, { lamp: 0.9, speaking: 0.6 });
  // archive shelf above the desk: notebooks W40..W43; W43 slides out and opens
  const out = ease(span(s.t, 0.8, 2.6));
  ['W40', 'W41', 'W42', 'W43'].forEach((w, i) => {
    const x = 600 + i * 110, y = 170, isLast = i === 3;
    const dy = isLast ? out * 230 : 0, dx = isLast ? out * 280 : 0;
    card(ctx, x + dx, y + dy, 90, 300, { fill: ['#3B4A5A', '#4A3B3B', '#3B4A40', '#5A4A2A'][i], stroke: 'rgba(255,255,255,0.15)', r: 6, alpha: isLast ? 1 - span(s.t, 2.4, 3.0) : 1 });
    text(ctx, w, x + dx + 45, y + dy + 270, { font: F.mono(22, 700), align: 'center', color: C.paper, alpha: isLast ? 1 - span(s.t, 2.4, 3.0) : 1 });
  });
  ctx.save(); ctx.fillStyle = '#3A3026'; ctx.fillRect(560, 475, 520, 16); ctx.restore();
  // opened W43 page: mini map of the Black Sea + the W43 headline
  const op = appear(s.t, 2.6, 0.8);
  if (op > 0) {
    card(ctx, 1080, 130, 720, 430, { fill: C.paper, alpha: op, r: 8 });
    ctx.save(); ctx.globalAlpha = op; rr(ctx, 1100, 150, 680, 300, 6); ctx.clip();
    const proj = d3.geoMercator().fitExtent([[1100, 150], [1780, 450]], { type: 'MultiPoint', coordinates: [[28, 49.5], [40, 43.8]] });
    for (const c of A.geo.countries) geo(ctx, proj, c.geom, { fill: '#D9CFBA', stroke: '#8C7F66', lw: 1 });
    rivers(ctx, proj, DNIPRO, { color: '#4A7FB0', lw: 2.5 });
    pin(ctx, proj, P.oleshky, 'Oleshky', { color: '#C0392B', labelColor: '#2A2A2A', font: F.ui(22, 800), r: 7 });
    ctx.restore();
    text(ctx, 'W43 · Russia–Ukraine: why no peace yet?', 1110, 500, { font: F.hand(44), color: '#8A6400', alpha: op });
    text(ctx, 'truce announced →', 1110, 545, { font: F.hand(36), color: '#8A6400', alpha: op * appear(s.t, 4) });
  }
  pill(ctx, '▶  Card: W43 Short', 1500, 600, { alpha: appear(s.t, 3.4), fill: 'rgba(255,255,255,0.14)', color: C.white, font: F.ui(20, 800) });
  lowerThird(ctx, 'PREVIOUSLY ON DECODE', appear(s.t, 0.3));
};
SCENES.S06 = (ctx, s) => {
  bg(ctx);
  const a1 = appear(s.t, 0.2), a2 = appear(s.t, s.beat(1) - 0.2);
  card(ctx, 120, 260, 760, 470, { stroke: 'rgba(255,255,255,0.2)', alpha: a1 });
  text(ctx, 'THEN', 170, 340, { font: F.ui(28, 800), color: C.dim, alpha: a1 });
  text(ctx, 'Announced by the White House for 29 October', 170, 430, { font: F.head(46), maxW: 660, lh: 60, alpha: a1 });
  arrow(ctx, [[900, 495], [1020, 495]], span(s.t, 1.2, 2.2), { lw: 6 });
  card(ctx, 1040, 260, 760, 470, { stroke: C.yellow, lw: 3, alpha: a2 });
  text(ctx, 'NOW', 1090, 340, { font: F.ui(28, 800), color: C.yellow, alpha: a2 });
  ['Began 27 Oct · 03:00 Kyiv', 'Humanitarian only', 'No announced end date'].forEach((l, i) =>
    text(ctx, '• ' + l, 1090, 430 + i * 80, { font: F.head(44), alpha: appear(s.t, s.beat(1) + i * 0.9) }));
  vignette(ctx);
};

// ---------------- DEEP DIVE: what was agreed ----------------
SCENES.S07 = (ctx, s) => {
  bg(ctx); text(ctx, 'WHAT WAS AGREED', 140, 170, { font: F.ui(30, 800), color: C.yellow });
  const rows = [['START', '27 Oct · 03:00 Kyiv / 04:00 Moscow'], ['PURPOSE', 'Food, medicine, water + preparing an evacuation'],
    ['PEOPLE', '≈ 1,700–2,000 residents, mostly elderly'], ['MEDIATION', 'US First Lady (per White House) · Vatican role reported']];
  rows.forEach(([k, v], i) => {
    const a = appear(s.t, s.beat(Math.min(i, 3)) - 0.2), y = 260 + i * 170;
    card(ctx, 140, y, 1640, 140, { accent: i === 3 ? C.blue : C.yellow, alpha: a });
    text(ctx, k, 190, y + 82, { font: F.ui(24, 800), color: C.dim, alpha: a });
    text(ctx, v, 470, y + 86, { font: F.head(44), alpha: a });
  });
  credit(ctx, 'Sources: White House (23 Oct); Reuters; Kyiv Independent; CNN', 1); vignette(ctx, 0.4);
};
SCENES.S08 = (ctx, s) => {
  bg(ctx);
  const m = ease(span(s.t, 0.3, 2.0));
  [['UKRAINE', 'Dmytro Lubinets', "Human-rights commissioner", -1], ['RUSSIA', 'Yana Lantratova', 'Human-rights commissioner', 1]].forEach(([c, n, r, side]) => {
    const x = 960 + side * lerp(700, 380, m) - 330;
    card(ctx, x, 300, 660, 300, { stroke: 'rgba(255,255,255,0.2)' });
    text(ctx, c, x + 50, 375, { font: F.ui(24, 800), color: C.dim });
    text(ctx, n, x + 50, 460, { font: F.head(56) });
    text(ctx, r, x + 50, 530, { font: F.ui(28, 600), color: C.dim });
  });
  const a = appear(s.t, s.beat(0) + 4);
  text(ctx, 'non-military teams · transport to Ukraine or to Russia', 960, 760, { font: F.hand(52), align: 'center', color: C.yellow, alpha: a });
  vignette(ctx);
};

// ---------------- key terms ----------------
SCENES.S09 = (ctx, s) => {
  bg(ctx); text(ctx, 'KNOW THE LADDER', 140, 150, { font: F.ui(30, 800), color: C.yellow });
  const rungs = [['Humanitarian pause', 'one place · short · for aid and evacuation', C.yellow], ['Ceasefire', 'wider · political', C.white], ['Armistice / peace agreement', 'ends the hostilities', C.white]];
  rungs.forEach(([h, sub, col], i) => {
    const y = 820 - i * 220, a = appear(s.t, s.beat(i + 1) - 0.3);
    card(ctx, 360 + i * 90, y - 120, 1200 - i * 180, 150, { stroke: i === 0 ? C.yellow : 'rgba(255,255,255,0.2)', lw: i === 0 ? 3 : 2, alpha: a });
    text(ctx, h, 410 + i * 90, y - 48, { font: F.head(50), alpha: a, color: col });
    text(ctx, sub, 410 + i * 90, y + 2, { font: F.ui(26, 600), color: C.dim, alpha: a });
  });
  const o = appear(s.t, s.beat(4) - 0.2);
  pill(ctx, 'OLESHKY IS HERE', 1440, 760, { alpha: o, fill: C.red, color: C.white });
  arrow(ctx, [[1440, 780], [1330, 760]], o, { color: C.red, lw: 5 });
  vignette(ctx);
};
SCENES.S10 = (ctx, s) => {
  desk(ctx, s.t, {
    lines: [{ s: 'Green corridor ≠ traffic solved' }], write: span(s.t, 0.2, 2.5), speaking: 0.7,
    sketch: (g) => {               // ink sketch: four lanes of traffic, one lane cleared, the ambulance moves through
      g.save(); g.strokeStyle = '#7A5A00'; g.lineWidth = 3;
      for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-500, -40 + k * 60); g.lineTo(500, -40 + k * 60); g.stroke(); }
      for (let lane = 0; lane < 3; lane++) for (let k = 0; k < 9; k++) {
        if (lane === 1) continue; g.strokeRect(-470 + k * 105, -30 + lane * 60, 70, 40);
      }
      const ax = -480 + ((s.t * 140) % 1000); g.fillStyle = '#E9E2D2'; g.fillRect(ax, 32, 80, 40); g.strokeRect(ax, 32, 80, 40);
      g.strokeStyle = '#C0392B'; g.lineWidth = 5; g.beginPath(); g.moveTo(ax + 40, 40); g.lineTo(ax + 40, 64); g.moveTo(ax + 28, 52); g.lineTo(ax + 52, 52); g.stroke();
      g.restore();
    },
  });
};

// ---------------- geography ----------------
SCENES.S11 = (ctx, s) => {
  // fly from an India locator view to the Black Sea, then draw the Dnipro from source to sea
  const k1 = { lon: 58, lat: 33, zoom: 5.0 }, k2 = { lon: 32.0, lat: 50.4, zoom: 6.4 };
  const cam = camLerp(k1, k2, span(s.t, 0.5, 5.5)); const proj = camera(cam.lon, cam.lat, cam.zoom);
  bg(ctx, { inner: '#161A20', outer: '#0E1115' });
  raster(ctx, proj, A.wide, A.wide_meta); raster(ctx, proj, A.region, A.region_meta, { alpha: span(s.t, 2.5, 5), feather: 200 });
  countries(ctx, proj, { wide: s.t < 4, stroke: 'rgba(255,255,255,0.28)', indiaFill: 'rgba(245,211,0,0.22)', indiaStroke: C.yellow, indiaLw: 2 });
  if (s.t < 5) { const [ix, iy] = proj([78.9, 22.5]), [bx, by] = proj(P.blackSea); arrow(ctx, [[ix, iy], [(ix + bx) / 2, Math.min(iy, by) - 120], [bx, by]], span(s.t, 0.3, 3.2), { dash: [10, 10], lw: 4, alpha: 1 - span(s.t, 4, 5) }); }
  // Dnipro reveal north → south (clip by screen y)
  const rp = span(s.t, s.beat(1) - 0.3, s.beat(1) + 6);
  if (rp > 0) {
    const [, ys] = proj(P.source), [, ym] = proj([32.3, 46.4]);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, lerp(ys - 10, ym + 20, rp)); ctx.clip();
    rivers(ctx, proj, DNIPRO, { color: C.blue, lw: 6 }); ctx.restore();
    pin(ctx, proj, P.source, 'Valdai Hills', { alpha: appear(s.t, s.beat(1)), color: C.blue, sub: 'source · Russia' });
    pin(ctx, proj, P.kyiv, 'Kyiv', { alpha: appear(s.t, s.beat(1) + 2.5), color: C.white, r: 6, font: F.ui(24, 700) });
    mapLabel(ctx, proj, [31.6, 45.35], 'BLACK SEA', { font: F.ui(32, 800), alpha: appear(s.t, s.beat(1) + 4) });
  }
  const lab = appear(s.t, s.beat(1) + 5.5);
  if (lab > 0) { card(ctx, 1240, 760, 600, 130, { accent: C.blue, alpha: lab }); text(ctx, 'Dnipro', 1290, 820, { font: F.head(46), alpha: lab }); text(ctx, '≈ 2,200 km · 4th-longest river in Europe', 1290, 862, { font: F.ui(24, 600), color: C.dim, alpha: lab }); }
  locatorInset(ctx, 60, 760, 330, 230, P.blackSea, appear(s.t, 5) * (1 - span(s.t, s.d - 1, s.d)));
  s.credit = TERRAIN; vignette(ctx, 0.45);
};
SCENES.S12 = (ctx, s) => {
  const cam = camLerp({ lon: 33.0, lat: 46.75, zoom: 9.6 }, { lon: 32.70, lat: 46.64, zoom: 11.0 }, span(s.t, 0, 4));
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  baseMap(ctx, proj); raster(ctx, proj, A.oleshky_before, A.oleshky_before_meta, { alpha: span(s.t, 1.5, 3.5), feather: 120 });
  const kb = appear(s.t, s.beat(1) - 0.5), ob = appear(s.t, s.beat(1) + 2.5);
  pin(ctx, proj, P.kherson, 'KHERSON', { alpha: kb, color: C.white, dx: -20, sub: 'right (west) bank · Ukraine-controlled' });
  pin(ctx, proj, P.oleshky, 'OLESHKY', { alpha: ob, dx: 20, dy: 40, sub: 'left (east) bank · occupied since 24 Feb 2022' });
  const band = appear(s.t, s.beat(2) - 0.3);
  if (band > 0) {
    ctx.save(); ctx.shadowColor = C.red; ctx.shadowBlur = 25; rivers(ctx, proj, DNIPRO, { color: `rgba(229,72,77,${0.85 * band})`, lw: 8 }); ctx.restore();
    pill(ctx, 'LINE OF CONTACT SINCE NOV 2022', 640, 120, { alpha: band, fill: C.red, color: C.white });
  }
  s.credit = COPERNICUS('oleshky_before') + ' · ' + TERRAIN; vignette(ctx, 0.45);
};

// ---------------- the timeline river (creative idea of the week) ----------------
const EVENTS = [
  { y: '2014', s: 'Crimea annexed · Ukraine dams the North Crimean Canal', c: C.white },
  { y: 'Feb 2022', s: 'Russian forces blow the canal\'s blocking dam at Kalanchak', c: C.white },
  { y: 'Nov 2022', s: 'Right bank retaken · the river becomes the frontline', c: C.white },
  { y: '6 Jun 2023', s: 'Kakhovka dam breached · reservoir drains', c: C.red },
];
function timelineRiver(ctx, t, upto, o = {}) {
  bg(ctx, { inner: '#1B2028', outer: '#101318' });
  // flowing river band
  ctx.save(); const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(74,144,194,0.15)'); g.addColorStop(1, 'rgba(74,144,194,0.55)');
  ctx.strokeStyle = g; ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.beginPath();
  for (let x = 80; x <= 1840; x += 10) ctx.lineTo(x, 560 + Math.sin(x / 210 + t * 0.6) * 38); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; ctx.setLineDash([18, 22]); ctx.lineDashOffset = -t * 60; ctx.stroke(); ctx.restore();
  text(ctx, 'THE DNIPRO, AS A TIMELINE', 80, 120, { font: F.ui(26, 800), color: C.yellow });
  EVENTS.forEach((e, i) => {
    const a = upto[i] ?? 0; if (a <= 0) return;
    const x = 260 + i * 450, y = 560 + Math.sin(x / 210 + t * 0.6) * 38, up = i % 2 === 0;
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, 16, 0, 7); ctx.fillStyle = e.c === C.red ? C.red : C.yellow; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + (up ? -20 : 20)); ctx.lineTo(x, up ? 330 : 790); ctx.stroke(); ctx.restore();
    const cy = up ? 200 : 800;
    card(ctx, x - 200, cy, 400, 160, { alpha: a, accent: e.c === C.red ? C.red : C.yellow });
    text(ctx, e.y, x - 170, cy + 52, { font: F.mono(30, 700), color: e.c === C.red ? C.red : C.yellow, alpha: a });
    text(ctx, e.s, x - 170, cy + 96, { font: F.ui(24, 600), maxW: 350, lh: 30, alpha: a });
  });
  if (o.inset) o.inset(ctx);
  vignette(ctx, 0.45);
}
function canalInset(ctx, a) {
  if (a <= 0) return; card(ctx, 1380, 40, 480, 330, { fill: 'rgba(15,18,22,0.92)', stroke: 'rgba(255,255,255,0.15)', alpha: a });
  ctx.save(); ctx.globalAlpha = a; rr(ctx, 1380, 40, 480, 330, 18); ctx.clip();
  const proj = d3.geoMercator().fitExtent([[1390, 50], [1850, 360]], { type: 'MultiPoint', coordinates: [[32.6, 47.1], [36.6, 44.6]] });
  raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta);
  countries(ctx, proj, { stroke: 'rgba(255,255,255,0.25)' });
  rivers(ctx, proj, DNIPRO, { lw: 3 });
  arrow(ctx, CANAL.map(c => proj(c)), 1, { color: C.yellow, lw: 3, dash: [8, 6], noHead: true });
  pin(ctx, proj, P.kalanchak, 'Kalanchak', { r: 6, font: F.ui(18, 800), color: C.red });
  mapLabel(ctx, proj, [34.4, 45.3], 'CRIMEA', { font: F.ui(20, 800) });
  ctx.restore(); text(ctx, 'North Crimean Canal (approx. route)', 1400, 395, { font: F.ui(16, 600), color: C.dim, alpha: a });
}
SCENES.S13 = (ctx, s) => timelineRiver(ctx, s.t, [appear(s.t, s.beat(1) - 0.3)], { inset: (g) => canalInset(g, appear(s.t, s.beat(1) + 2)) });
SCENES.S14 = (ctx, s) => timelineRiver(ctx, s.t + 20, [1, appear(s.t, 0.2), appear(s.t, s.beat(1) - 0.3)], { inset: (g) => canalInset(g, 1 - span(s.t, s.d - 1.5, s.d)) });

// ---------------- satellite before / after ----------------
function wipe(ctx, proj, a, b, p, labels) {
  raster(ctx, proj, a.img, a.meta);
  const x = lerp(W + 40, -40, ease(p));
  ctx.save(); ctx.beginPath(); ctx.rect(x, 0, W - x, H); ctx.clip(); raster(ctx, proj, b.img, b.meta); ctx.restore();
  ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 4; ctx.shadowColor = 'black'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); ctx.restore();
  pill(ctx, labels[0], 60, 120, { alpha: 1 - span(p, 0.8, 1), fill: 'rgba(20,23,28,0.85)', color: C.white });
  pill(ctx, labels[1], 60, 170, { alpha: span(p, 0.15, 0.4), fill: C.red, color: C.white });
}
SCENES.S15 = (ctx, s) => {
  const cam = camLerp({ lon: 34.07, lat: 47.14, zoom: 10.0 }, { lon: 34.0, lat: 47.12, zoom: 10.15 }, s.p);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  bg(ctx); raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta);
  wipe(ctx, proj, SAT('kakhovka_before'), SAT('kakhovka_after'), span(s.t, s.beat(1) - 0.5, s.beat(1) + 6),
    ['BEFORE · 3–6 JUN 2023 · reservoir full', 'AFTER · JUL–AUG 2023 · reservoir drained']);
  pin(ctx, proj, P.dam, 'Kakhovka dam', { alpha: appear(s.t, 0.8), color: C.red, sub: 'breached 6 Jun 2023', dx: 18, dy: 34 });
  const fig = appear(s.t, s.beat(1) + 2);
  if (fig > 0) { card(ctx, 1380, 820, 470, 150, { accent: C.blue, alpha: fig }); text(ctx, '≈ 18 km³', 1420, 890, { font: F.head(58), alpha: fig }); text(ctx, "Ukraine's largest reservoir by volume", 1420, 935, { font: F.ui(22, 600), color: C.dim, alpha: fig }); }
  const att = appear(s.t, s.beat(2) - 0.2);
  if (att > 0) text(ctx, 'Attribution: Ukraine & most independent assessments → Russian forces controlling the dam · Moscow → Ukraine', 960, 1000, { font: F.ui(20, 600), align: 'center', color: C.dim, alpha: att });
  s.credit = 'Contains modified Copernicus Sentinel data 2023 · processed by Decode UPSC'; vignette(ctx, 0.35);
};
SCENES.S16 = (ctx, s) => {
  const cam = camLerp({ lon: 32.95, lat: 46.64, zoom: 10.8 }, { lon: 32.85, lat: 46.63, zoom: 11.1 }, s.p);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  bg(ctx); raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta);
  wipe(ctx, proj, SAT('oleshky_before'), SAT('oleshky_flood'), span(s.t, 0.6, 5.5), ['3–5 JUN 2023 · before the breach', '18–20 JUN 2023 · floodplain still inundated']);
  // pointer follows the water downstream to Oleshky
  const q = span(s.t, 1, 6); const path = [[33.25, 46.73], [33.05, 46.72], [32.9, 46.66], P.oleshky].map(c => proj(c));
  arrow(ctx, path, q, { color: C.yellow, lw: 6 });
  pin(ctx, proj, P.oleshky, 'OLESHKY', { alpha: appear(s.t, 5), dy: 44 });
  const t2 = appear(s.t, s.beat(1) - 0.5);
  if (t2 > 0) { card(ctx, 1290, 860, 560, 120, { accent: C.red, alpha: t2 }); text(ctx, 'Oleshky ≈ 90% flooded (reported)', 1330, 935, { font: F.ui(32, 800), alpha: t2 }); }
  s.credit = 'Contains modified Copernicus Sentinel data 2023 · processed by Decode UPSC'; vignette(ctx, 0.35);
};
SCENES.S17 = (ctx, s) => {
  const cam = camLerp({ lon: 34.0, lat: 46.9, zoom: 9.2 }, { lon: 34.35, lat: 46.45, zoom: 8.55 }, span(s.t, 0, 3));
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  baseMap(ctx, proj); raster(ctx, proj, A.kakhovka_after, A.kakhovka_after_meta, { alpha: 0.95, feather: 90 });
  countries(ctx, proj, { stroke: 'rgba(255,255,255,0.3)' });
  arrow(ctx, CANAL.map(c => proj(c)), span(s.t, s.beat(1) - 0.3, s.beat(1) + 2.5), { color: C.yellow, lw: 5, dash: [14, 10] });
  const dry = appear(s.t, s.beat(1) + 2.5);
  mapLabel(ctx, proj, [34.6, 45.55], 'CANAL DRY', { font: F.ui(30, 800), color: C.yellow, alpha: dry });
  mapLabel(ctx, proj, [34.2, 45.2], 'CRIMEA', { font: F.ui(26, 800), alpha: dry });
  const zn = appear(s.t, s.beat(2) - 0.3);
  arrow(ctx, [proj([33.6, 46.9]), proj([34.2, 47.3]), proj(P.znpp)], zn, { color: C.red, lw: 5 });
  pin(ctx, proj, P.znpp, 'Zaporizhzhia NPP', { alpha: zn, color: C.red, sub: 'Enerhodar', dx: 20, dy: -20 });
  const box = appear(s.t, s.beat(3) - 0.3);
  if (box > 0) {
    card(ctx, 1290, 120, 560, 330, { accent: C.red, alpha: box });
    ['Europe\'s largest nuclear plant', '6 × VVER-1000 · ≈ 5.7 GW', 'Reactors shut down — still need cooling', 'Repeated loss of all off-site power (2026)'].forEach((l, i) =>
      text(ctx, l, 1330, 190 + i * 64, { font: i ? F.ui(26, 600) : F.ui(30, 800), color: i ? C.dim : C.white, alpha: appear(s.t, s.beat(3) - 0.3 + i * 0.6) }));
  }
  s.credit = 'Contains modified Copernicus Sentinel data 2023 · ' + TERRAIN + ' · IAEA'; vignette(ctx, 0.4);
};

// ---------------- the fragility mind map ----------------
const FRAG = [
  { s: 'River = frontline', sub: 'geography', x: 420, y: 250 }, { s: 'Water', sub: 'the canal · old reservoir', x: 1500, y: 250 },
  { s: 'Nuclear safety', sub: 'ZNPP upstream', x: 1600, y: 560 }, { s: 'Civilians', sub: '1,700–2,000 · mostly elderly', x: 1450, y: 860 },
  { s: 'Trust & verification', sub: 'non-military teams · observers', x: 470, y: 860 }, { s: "India's dilemma", sub: 'coming up', x: 320, y: 560 },
];
function fragMap(ctx, s, reveal, o = {}) {
  bg(ctx); const c = [960, 555];
  FRAG.forEach((n, i) => { const a = reveal[i] ?? 0; link(ctx, c, [n.x, n.y], a, { bend: 40, alpha: i === 5 && !o.india ? 0.5 : 1, label: ['leads to', 'governed by', 'risks', 'affects', 'requires', 'tests'][i] }); });
  node(ctx, c[0], c[1], o.blanks ? 'Why is a one-town truce so fragile?' : 'A truce in one town — why so fragile?', { font: F.head(40), maxW: 420, lh: 48, fill: 'rgba(245,211,0,0.95)', color: C.slate, stroke: C.yellow });
  FRAG.forEach((n, i) => {
    const a = reveal[i] ?? 0; if (a <= 0) return;
    const blank = o.blanks && o.blanks[i];
    const grey = i === 5 && !o.india;
    node(ctx, n.x, n.y, blank ? '________' : n.s, { alpha: a, sub: blank ? '' : n.sub, color: grey ? C.faint : C.white, stroke: o.hi === i ? C.yellow : (grey ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)') });
  });
  vignette(ctx, 0.45);
}
SCENES.S18 = (ctx, s) => {
  const r = [1, 2, 3, 4, 5].map(i => appear(s.t, s.beat(i) - 0.2)); r.push(appear(s.t, s.beat(5) + 2));
  const cur = [0, 1, 2, 3, 4].filter(i => s.t >= s.beat(i + 1) - 0.2).pop();
  fragMap(ctx, s, r, { hi: cur });
  if (s.t > s.beat(6) - 0.5) text(ctx, 'small · precise · humanitarian', 960, 1030, { font: F.hand(52), align: 'center', color: C.yellow, alpha: appear(s.t, s.beat(6) - 0.5) });
};

// ---------------- India's dilemma ----------------
SCENES.S19 = (ctx, s) => {
  bg(ctx);
  const sp = ease(span(s.t, 0.5, 2));
  node(ctx, 960, 200, "India's dilemma", { font: F.head(52), fill: 'rgba(245,211,0,0.95)', color: C.slate, maxW: 700 });
  card(ctx, 140, 330, 780 * sp, 560, { accent: C.blue }); card(ctx, 1000 + 780 * (1 - sp), 330, 780 * sp, 560, { accent: C.yellow });
  text(ctx, 'ENERGY SECURITY', 200, 420, { font: F.ui(34, 800), alpha: sp, color: C.blue });
  text(ctx, 'PRINCIPLES', 1060, 420, { font: F.ui(34, 800), alpha: sp, color: C.yellow });
  const L = ['Russia ≈ one-third of crude imports', 'Fuel prices · inflation', 'Food & fertiliser supply chains'];
  const R = ['UN Charter Art 2(4)', 'Territorial integrity · sovereignty', '"Not an era of war" (2022)'];
  L.forEach((l, i) => text(ctx, '• ' + l, 200, 510 + i * 90, { font: F.head(38), alpha: appear(s.t, 1.6 + i * 0.5) }));
  R.forEach((l, i) => text(ctx, '• ' + l, 1060, 510 + i * 90, { font: F.head(38), alpha: appear(s.t, 2.4 + i * 0.5) }));
  text(ctx, 'strategic autonomy?', 960, 980, { font: F.hand(60), color: C.yellow, align: 'center', alpha: appear(s.t, s.beat(1) - 0.3) });
  vignette(ctx, 0.4);
};
SCENES.S20 = (ctx, s) => {
  bg(ctx);
  text(ctx, 'Russia remains India\'s largest crude supplier', 140, 170, { font: F.head(54) });
  text(ctx, "India's crude imports by source · million barrels per day · 1–27 Sep 2026", 140, 222, { font: F.ui(24, 600), color: C.dim });
  const data = [['Russia', 1.742, C.yellow], ['Iraq', 0.579, '#9AA4AF'], ['Saudi Arabia', 0.570, '#9AA4AF'], ['All others', 2.360, '#5B646E']];
  const x0 = 420, maxw = 1250, max = 2.4;
  data.forEach(([n, v, col], i) => {
    const a = appear(s.t, 0.4 + i * 0.35), y = 320 + i * 150, w = maxw * v / max * ease(span(s.t, 0.5 + i * 0.35, 2 + i * 0.35));
    text(ctx, n, x0 - 30, y + 66, { font: F.ui(32, 800), align: 'right', alpha: a });
    ctx.save(); ctx.globalAlpha = a; rr(ctx, x0, y + 20, Math.max(w, 1), 76, 8); ctx.fillStyle = col; ctx.fill(); ctx.restore();
    text(ctx, v.toFixed(2), x0 + w + 20, y + 70, { font: F.mono(32, 700), alpha: a, color: i === 0 ? C.yellow : C.white });
  });
  const br = appear(s.t, s.beat(1) - 0.2);
  if (br > 0) { pill(ctx, '≈ ONE-THIRD OF IMPORTS', 1470, 358, { alpha: br }); }
  credit(ctx, 'Data: Kpler ship-tracking via KNN India (Sep 2026) — figures vary by tracker · [VERIFY before release]');
  vignette(ctx, 0.35);
};
SCENES.S21 = (ctx, s) => {
  bg(ctx); const a = appear(s.t, 0.3), b = appear(s.t, s.beat(1) - 0.3);
  card(ctx, 140, 200, 1640, 280, { accent: C.yellow, alpha: a });
  text(ctx, '“Today\'s era is not an era of war.”', 200, 320, { font: F.head(64), alpha: a });
  text(ctx, 'PM Modi to President Putin · SCO, Samarkand · 16 Sep 2022', 200, 400, { font: F.ui(26, 600), color: C.dim, alpha: a });
  card(ctx, 140, 540, 1640, 340, { accent: C.blue, alpha: b });
  text(ctx, 'UNGA · 24 Feb 2026 · "Support for Lasting Peace in Ukraine"', 200, 620, { font: F.ui(30, 800), alpha: b });
  [['107', 'for', C.white], ['12', 'against', C.white], ['51', 'abstentions', C.yellow]].forEach(([n, l, col], i) => {
    const k = appear(s.t, s.beat(1) + 0.6 + i * 0.4);
    text(ctx, n, 260 + i * 420, 770, { font: F.head(96), color: col, alpha: k }); text(ctx, l, 260 + i * 420, 830, { font: F.ui(26, 600), color: C.dim, alpha: k });
  });
  pill(ctx, 'INDIA ABSTAINED', 1420, 740, { alpha: appear(s.t, s.beat(1) + 2.5) });
  credit(ctx, 'Sources: Reuters (2022); Business Standard / All India Radio (Feb 2026)'); vignette(ctx, 0.35);
};
SCENES.S22 = (ctx, s) => desk(ctx, s.t, { lines: [{ s: 'Strategic autonomy =' }, { s: 'keeping all doors open' }, { s: '… but one quiet town ≠ peace', gap: 90 }], write: span(s.t, 0.2, s.d * 0.85) });

// ---------------- Prelims traps ----------------
function trapTag(ctx, a) { if (a > 0) pill(ctx, 'PRELIMS TRAP', 80, 60, { alpha: a, fill: C.red, color: C.white, font: F.ui(26, 800), h: 48 }); }
SCENES.S23 = (ctx, s) => {
  const cam = camLerp({ lon: 31.6, lat: 42.6, zoom: 7.05 }, { lon: 31.8, lat: 42.5, zoom: 7.2 }, s.p);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  bg(ctx); raster(ctx, proj, A.wide, A.wide_meta); raster(ctx, proj, A.region, A.region_meta, { feather: 160 }); countries(ctx, proj, { stroke: 'rgba(255,255,255,0.3)' });
  mapLabel(ctx, proj, P.blackSea, 'BLACK SEA', { font: F.ui(34, 800) });
  trapTag(ctx, appear(s.t, 0.2));
  const m = appear(s.t, s.beat(1) - 0.3);
  [P.bosphorus, P.marmara, P.dardanelles].forEach((c, i) => pin(ctx, proj, c, ['Bosphorus', 'Sea of Marmara', 'Dardanelles'][i], { alpha: appear(s.t, s.beat(1) - 0.3 + i * 0.5), color: C.yellow, dx: i === 2 ? -18 : 18, dy: i === 1 ? 30 : -14, font: F.ui(26, 800) }));
  if (m > 0) { card(ctx, 90, 140, 760, 170, { accent: C.yellow, alpha: m }); text(ctx, 'Montreux Convention, 1936', 130, 205, { font: F.head(44), alpha: m }); text(ctx, 'Turkish Straits ONLY', 130, 260, { font: F.ui(30, 800), color: C.yellow, alpha: m }); }
  const k = appear(s.t, s.beat(3) - 0.3);
  pin(ctx, proj, P.kerchStrait, 'Kerch Strait', { alpha: k, color: C.red, font: F.ui(28, 800), dx: 18, dy: 34 });
  if (k > 0) { card(ctx, 1070, 680, 780, 170, { accent: C.red, alpha: k }); text(ctx, 'NOT Montreux', 1110, 745, { font: F.head(44), color: C.red, alpha: k }); text(ctx, 'was a bilateral 2003 Russia–Ukraine treaty · denounced by both in 2023', 1110, 795, { font: F.ui(24, 600), maxW: 700, lh: 30, alpha: k }); }
  const ans = appear(s.t, s.beat(5) - 0.3);
  if (ans > 0) { card(ctx, 560, 880, 800, 110, { fill: 'rgba(229,72,77,0.95)', alpha: ans }); text(ctx, 'Answer: no multilateral convention', 960, 952, { font: F.ui(36, 800), align: 'center', alpha: ans }); }
  s.credit = TERRAIN; vignette(ctx, 0.35);
};
SCENES.S24 = (ctx, s) => {
  const cam = camLerp({ lon: 36.0, lat: 47.4, zoom: 7.75 }, { lon: 36.2, lat: 47.45, zoom: 7.9 }, s.p);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  bg(ctx); raster(ctx, proj, A.wide, A.wide_meta); raster(ctx, proj, A.region, A.region_meta, { feather: 160 }); raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta, { feather: 200 });
  countries(ctx, proj, { stroke: 'rgba(255,255,255,0.3)' }); trapTag(ctx, 1);
  const az = appear(s.t, s.beat(1) - 0.3);
  mapLabel(ctx, proj, P.azov, 'SEA OF AZOV', { font: F.ui(32, 800), color: C.white, alpha: az });
  if (az > 0) { pill(ctx, "WORLD'S SHALLOWEST SEA · avg ≈ 7 m", 640, 980, { alpha: az, fill: C.blue, color: C.white }); }
  const db = appear(s.t, s.beat(2) - 0.3), nd = appear(s.t, s.beat(3) - 0.3);
  for (const r of A.geo.admin1) {
    const isD = /Donets|Luhans/.test(r.name), isN = /Kherson|Zaporizh/.test(r.name);
    if (isD) geo(ctx, proj, r.geom, { fill: `rgba(245,211,0,${0.35 * db})`, stroke: `rgba(245,211,0,${db})`, lw: 2.5 });
    if (isN) geo(ctx, proj, r.geom, { fill: `rgba(229,72,77,${0.28 * nd})`, stroke: `rgba(229,72,77,${nd})`, lw: 2.5 });
  }
  mapLabel(ctx, proj, [38.6, 48.4], 'DONBAS', { font: F.ui(38, 800), color: C.yellow, alpha: db });
  mapLabel(ctx, proj, [38.6, 48.0], 'Donetsk + Luhansk', { font: F.ui(22, 600), color: C.white, alpha: db });
  mapLabel(ctx, proj, [33.5, 46.45], 'Kherson — NOT Donbas', { font: F.ui(26, 800), color: '#FF8A8E', alpha: nd });
  mapLabel(ctx, proj, [36.0, 47.2], 'Zaporizhzhia — NOT Donbas', { font: F.ui(26, 800), color: '#FF8A8E', alpha: nd });
  pin(ctx, proj, P.oleshky, 'Oleshky', { alpha: nd, r: 6, font: F.ui(20, 800), dx: -14 });
  const dn = appear(s.t, s.beat(3) + 2.5);
  if (dn > 0) { rivers(ctx, proj, DNIPRO, { color: C.blue, lw: 5, alpha: dn }); pin(ctx, proj, P.znpp, 'ZNPP — on the Dnipro, not the Don', { alpha: dn, color: C.blue, font: F.ui(22, 800), dx: -16, dy: -22 }); }
  s.credit = TERRAIN; vignette(ctx, 0.35);
};
SCENES.S25 = (ctx, s) => {
  bg(ctx); trapTag(ctx, 1);
  [['Dnipro = 4th-longest river in Europe', 'after the Volga, the Danube and the Ural — not 3rd'],
   ['India: party to the four Geneva Conventions (1949)', 'NOT to Additional Protocols I & II (1977)']].forEach(([h, sub], i) => {
    const a = appear(s.t, s.beat(i === 0 ? 1 : 2) - 0.3), y = 260 + i * 330;
    card(ctx, 140, y, 1640, 260, { accent: C.red, alpha: a });
    text(ctx, h, 200, y + 110, { font: F.head(52), alpha: a }); text(ctx, sub, 200, y + 180, { font: F.ui(32, 600), color: '#FF9A9E', alpha: a });
  });
  vignette(ctx, 0.35);
};

// ---------------- the examiner's chair ----------------
SCENES.S26 = (ctx, s) => {
  bg(ctx, { inner: '#20252C' });
  const paperIn = ease(span(s.t, 0, 1.2)), q = 'How many of the above-mentioned countries share a land border with Ukraine?';
  if (s.t < s.beat(3) + 0.3) {
    ctx.save(); ctx.translate(960, 560 + (1 - paperIn) * 400); ctx.rotate(-0.02);
    card(ctx, -620, -380, 1240, 760, { fill: '#F4F1EA', r: 6 });
    text(ctx, 'UPSC CSE PRELIMS 2023 · GS PAPER I', -560, -300, { font: F.mono(26, 700), color: '#8A1C1C' });
    const typed = Math.floor(span(s.t, 1, 5) * 160);
    const body = 'Consider the following countries:\n1. Bulgaria   2. Czech Republic   3. Hungary\n4. Latvia   5. Lithuania   6. Romania\n' + q;
    text(ctx, body.slice(0, typed), -560, -220, { font: F.ui(34, 600), color: '#1E2228', maxW: 1120, lh: 52 });
    const opts = ['(a) Only two', '(b) Only three', '(c) Only four', '(d) Only five'];
    opts.forEach((o, i) => text(ctx, o, -560 + (i % 2) * 520, 120 + Math.floor(i / 2) * 64, { font: F.ui(32, 600), color: '#1E2228', alpha: appear(s.t, 5 + i * 0.2) }));
    const circ = appear(s.t, s.beat(1) - 0.2);
    if (circ > 0) { ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(-450, 108, 140 * circ, 42, 0, 0, 7); ctx.stroke(); }
    ctx.restore();
    pill(ctx, 'PYQ ECHO · confirm on upsc.gov.in before release', 80, 50, { fill: 'rgba(255,255,255,0.14)', color: C.white, font: F.ui(18, 800) });
  } else {
    const proj = camera(28.5, 48.8, 6.45);
    raster(ctx, proj, A.wide, A.wide_meta); raster(ctx, proj, A.region, A.region_meta, { feather: 200 });
    const ns = ['RUS', 'BLR', 'POL', 'SVK', 'HUN', 'ROU', 'MDA'];
    const lit = {}; ns.forEach((a3, i) => { const k = appear(s.t, s.beat(3) + 0.3 + i * 0.35); if (k > 0) lit[a3] = (a3 === 'HUN' || a3 === 'ROU') ? `rgba(245,211,0,${0.55 * k})` : `rgba(255,255,255,${0.14 * k})`; });
    lit.UKR = 'rgba(74,144,194,0.35)';
    countries(ctx, proj, { highlight: lit, stroke: 'rgba(255,255,255,0.3)' });
    [['UKRAINE', [31.2, 49.0], C.white], ['HUNGARY', [19.3, 47.1], C.yellow], ['ROMANIA', [25.0, 45.8], C.yellow], ['MOLDOVA', [28.6, 47.2], C.dim], ['POLAND', [21.0, 51.8], C.dim], ['SLOVAKIA', [19.6, 48.75], C.dim], ['BELARUS', [28.0, 53.3], C.dim], ['RUSSIA', [38.5, 51.5], C.dim]].forEach(([n, c, col]) => mapLabel(ctx, proj, c, n, { font: F.ui(n === 'UKRAINE' ? 34 : 24, 800), color: col }));
    text(ctx, 'News chooses the region · a static fact decides your marks', 960, 1020, { font: F.hand(50), align: 'center', color: C.yellow, alpha: appear(s.t, s.beat(4) - 0.3) });
    s.credit = TERRAIN;
  }
  vignette(ctx, 0.35);
};

// ---------------- Mains ----------------
SCENES.S27 = (ctx, s) => {
  bg(ctx); pill(ctx, 'MAINS LENS', 80, 60, { font: F.ui(26, 800), h: 48 });
  const Q = [['ECONOMIC', 'Fuel · food · fertiliser bills', C.yellow], ['GOVERNANCE & LAW', 'UN Charter · IHL · verification', C.blue], ['SECURITY', 'River frontline next to Europe\'s largest nuclear plant', C.red], ['SOCIO-ENVIRONMENTAL', '1,700–2,000 trapped · Kakhovka: ≈ 18 km³ lost', C.teal]];
  Q.forEach(([h, sub, col], i) => {
    const a = appear(s.t, s.beat(i + 1) - 0.3), x = 140 + (i % 2) * 840, y = 170 + Math.floor(i / 2) * 420;
    card(ctx, x, y, 800, 380, { accent: col, alpha: a });
    text(ctx, h, x + 50, y + 90, { font: F.ui(34, 800), color: col, alpha: a }); text(ctx, sub, x + 50, y + 160, { font: F.head(42), maxW: 680, lh: 54, alpha: a });
  });
  vignette(ctx, 0.35);
};
SCENES.S28 = (ctx, s) => {
  bg(ctx);
  revealWords(ctx, '“Humanitarian pauses are stepping stones to peace.”', 960, 190, span(s.t, 0.2, 2.6), { font: F.head(58), align: 'center', maxW: 1700 });
  const L = ['build a little trust', 'keep channels open', 'test verification'], R = ['can freeze the lines', 'can give armies time to regroup', 'no political track behind them'];
  card(ctx, 140, 300, 790, 600, { accent: C.teal, alpha: appear(s.t, s.beat(1) - 0.3) }); card(ctx, 990, 300, 790, 600, { accent: C.red, alpha: appear(s.t, s.beat(2) - 0.3) });
  text(ctx, 'FOR', 200, 380, { font: F.ui(32, 800), color: C.teal, alpha: appear(s.t, s.beat(1) - 0.3) }); text(ctx, 'AGAINST', 1050, 380, { font: F.ui(32, 800), color: C.red, alpha: appear(s.t, s.beat(2) - 0.3) });
  L.forEach((l, i) => text(ctx, '✓ ' + l, 200, 480 + i * 110, { font: F.head(44), alpha: appear(s.t, s.beat(1) + i * 1.1) }));
  R.forEach((l, i) => text(ctx, '✗ ' + l, 1050, 480 + i * 110, { font: F.head(44), alpha: appear(s.t, s.beat(2) + 1 + i * 1.1) }));
  vignette(ctx, 0.35);
};
SCENES.S29 = (ctx, s) => {
  bg(ctx); pill(ctx, 'CARRY INTO MAINS', 80, 60, { font: F.ui(26, 800), h: 48 });
  const F6 = [['27 Oct 2026', 'truce begins · 03:00 Kyiv'], ['1,700–2,000', 'residents still in Oleshky'], ['6 Jun 2023', 'Kakhovka dam breached'], ['≈ 18 km³', 'reservoir water lost'], ['≈ 85%', "of Crimea's water came via the canal (pre-2014)"], ['107–12–51', 'UNGA, 24 Feb 2026 · India abstained']];
  F6.forEach(([n, l], i) => {
    const a = appear(s.t, 0.6 + i * (s.d - 3) / 6), x = 140 + (i % 3) * 560, y = 200 + Math.floor(i / 3) * 400;
    card(ctx, x, y, 520, 340, { stroke: 'rgba(245,211,0,0.4)', alpha: a });
    text(ctx, n, x + 40, y + 140, { font: F.head(64), color: C.yellow, alpha: a }); text(ctx, l, x + 40, y + 210, { font: F.ui(28, 600), maxW: 440, lh: 36, alpha: a });
  });
  vignette(ctx, 0.35);
};
SCENES.S30 = (ctx, s) => {
  bg(ctx); text(ctx, 'WAY FORWARD', 140, 150, { font: F.ui(30, 800), color: C.yellow });
  const B = [['UN Charter, Art 33', 'negotiation · mediation · conciliation'], ['IAEA', 'nuclear-safety principles for ZNPP'], ['ICRC', 'neutral intermediary under the Geneva Conventions'], ['India', 'dialogue & diplomacy · voice of the Global South on food, fuel, fertiliser']];
  B.forEach(([h, sub], i) => {
    const a = appear(s.t, s.beat(Math.min(i + 1, 4)) - 0.3), y = 830 - i * 175, drop = (1 - a) * -120;
    card(ctx, 260, y + drop, 1400, 150, { accent: i === 3 ? C.yellow : C.blue, stroke: i === 3 ? C.yellow : null, alpha: a });
    text(ctx, h, 320, y + drop + 70, { font: F.head(46), alpha: a, color: i === 3 ? C.yellow : C.white }); text(ctx, sub, 320, y + drop + 118, { font: F.ui(28, 600), color: C.dim, alpha: a });
  });
  vignette(ctx, 0.35);
};
SCENES.S31 = (ctx, s) => {
  bg(ctx); pill(ctx, 'GS-2 · 15 MARKS · 250 WORDS', 80, 60, { font: F.ui(24, 800), h: 46 });
  card(ctx, 140, 150, 1640, 330, { accent: C.yellow });
  text(ctx, '“A ceasefire in one town is not peace in a country.” Examine the significance and limits of localised humanitarian ceasefires in the Russia–Ukraine conflict, and discuss India\'s stake in a negotiated settlement.', 200, 240, { font: F.head(40), maxW: 1520, lh: 54 });
  [['INTRO', 'Oleshky (27 Oct 2026) + what a humanitarian pause is'], ['BODY', 'significance · limits · India\'s stake (energy, food, Global South, nuclear safety)'], ['CONCLUSION', 'pauses become peace only when tied to a political track (Art 33)']].forEach(([h, sub], i) => {
    const a = appear(s.t, s.beat(i + 1) - 0.3), y = 540 + i * 160;
    card(ctx, 140, y, 1640, 130, { alpha: a, stroke: 'rgba(255,255,255,0.15)' });
    text(ctx, h, 190, y + 78, { font: F.ui(28, 800), color: C.yellow, alpha: a }); text(ctx, sub, 480, y + 78, { font: F.ui(30, 600), alpha: a });
  });
  vignette(ctx, 0.35);
};

// ---------------- recap + checkpoint ----------------
SCENES.S32 = (ctx, s) => {
  const blanksAt = s.beat(3) - 0.3, revealAt = s.d - 2.2;
  fragMap(ctx, s, [1, 1, 1, 1, 1, 1], { india: true });
  // three-blank recap card
  const a = appear(s.t, blanksAt);
  if (a > 0) {
    card(ctx, 560, 380, 800, 360, { fill: 'rgba(20,23,28,0.96)', stroke: C.yellow, lw: 3, alpha: a });
    const rev = s.t >= revealAt; const R = [['River = ', 'frontline'], ['Treaty for the Turkish Straits = ', 'Montreux'], ['Dam breached on ', '6 Jun 2023']];
    R.forEach(([k, v], i) => { const w = text(ctx, k, 610, 470 + i * 90, { font: F.ui(34, 800), alpha: a }); text(ctx, rev ? v : '________', 610 + w, 470 + i * 90, { font: rev ? F.hand(52) : F.ui(34, 800), color: C.yellow, alpha: a }); });
    if (!rev) text(ctx, 'pause · copy · fill', 960, 700, { font: F.hand(40), align: 'center', color: C.dim, alpha: a });
  }
  for (let i = 0; i < 3; i++) { const k = appear(s.t, s.beat(i) - 0.2) * (1 - a); if (k > 0) pill(ctx, ['1 · the river is the frontline', '2 · the dam turned land into water + nuclear', '3 · India: energy vs principle'][i], 80, 70 + i * 54, { alpha: k, fill: 'rgba(255,255,255,0.14)', color: C.white, font: F.ui(22, 800) }); }
};
SCENES.S33 = (ctx, s) => {
  pauseCard(ctx, s, 'Name the two straits governed by the Montreux Convention.');
  const a = appear(s.t, s.beat(1) - 0.2);
  if (a > 0) { card(ctx, 320, 640, 1000, 100, { fill: C.yellow, alpha: a }); text(ctx, 'Bosphorus · Dardanelles (with the Sea of Marmara)', 350, 705, { font: F.ui(34, 800), color: C.slate, alpha: a }); }
};

// ---------------- verdict + end screen ----------------
SCENES.S34 = (ctx, s) => desk(ctx, s.t, { lamp: lerp(1, 0.45, span(s.t, 0, s.d)), lines: [{ s: 'A pause is a door' }, { s: 'left ajar.' }], handSize: 76, write: span(s.t, 0.5, 6), speaking: 0.55 });
SCENES.S35 = (ctx, s) => {
  desk(ctx, s.t, { lamp: 0.45, speaking: 0.5, book: false });
  ctx.fillStyle = 'rgba(10,12,15,0.55)'; ctx.fillRect(0, 0, W, H);
  text(ctx, 'Notes · map · MCQ challenge → pinned comment', 960, 200, { font: F.head(52), align: 'center' });
  [[240, 'W43 · Russia–Ukraine: why no peace yet?'], [1000, 'Playlist · Decode the Week']].forEach(([x, l]) => {
    card(ctx, x, 330, 680, 383, { fill: 'rgba(255,255,255,0.06)', stroke: 'rgba(255,255,255,0.35)', r: 12 });
    text(ctx, 'END-SCREEN ELEMENT', x + 340, 500, { font: F.ui(22, 800), align: 'center', color: C.faint });
    text(ctx, l, x + 340, 545, { font: F.ui(26, 600), align: 'center', color: C.dim });
  });
  pill(ctx, 'SEE YOU SUNDAY · 6 PM IST', 760, 800, { font: F.ui(28, 800), h: 54 });
};
