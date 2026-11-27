// W48 upgrade (owner, 27 Nov: opening "boring"; images next to persons and places; Constitution makers; better Antalya).
// Load after weekly48.js:  node render.js <assets> <tl> scenes/weekly48.js,scenes/upgrade48.js <out> --strict
// No photos (photo sites not allowed in this environment) and no drawn likenesses of real people (CLAUDE.md §6.1):
// persons get a real locator map of their country; places get their real Sentinel-2 view; the Constitution gets a
// designed Preamble scroll and a "makers" board of names, roles and dates.

// ---------- a cinematic opening: one camera across the week's real places ----------
const OPEN_KEYS = [   // [fraction, lon, lat, zoom, headline]; pairs of keys = a short dwell at each place
  [0.00, 80, 23, 5.4, null],
  [0.06, 72, 23, 5.6, 'AMERICA PROPOSES A 25% TARIFF ON INDIA'], [0.16, 72, 23, 5.8, 'AMERICA PROPOSES A 25% TARIFF ON INDIA'],
  [0.26, 84.5, 28.0, 6.8, "NEPAL'S PRIME MINISTER IN DELHI"], [0.33, 85.0, 27.8, 7.3, "NEPAL'S PRIME MINISTER IN DELHI"],
  [0.46, 30.72, 36.885, 11.4, 'COP31 IN ANTALYA: NO DEAL'], [0.53, 30.72, 36.885, 11.7, 'COP31 IN ANTALYA: NO DEAL'],
  [0.66, 100.25, 40.98, 11.6, "PAKISTAN'S FIRST ASTRONAUT"], [0.73, 100.25, 40.98, 11.9, "PAKISTAN'S FIRST ASTRONAUT"],
  [0.84, 85.315, 25.62, 12.0, "INDIA'S NEW LONGEST RIVER BRIDGE"], [0.9, 85.315, 25.62, 12.4, "INDIA'S NEW LONGEST RIVER BRIDGE"],
  [1.00, 80, 23, 5.4, null],
];
function openCam(f) {
  let i = 0; while (i < OPEN_KEYS.length - 2 && f > OPEN_KEYS[i + 1][0]) i++;
  const a = OPEN_KEYS[i], b = OPEN_KEYS[i + 1], u = ease(clamp((f - a[0]) / (b[0] - a[0])));
  const dist = Math.hypot(b[1] - a[1], b[2] - a[2]), lift = Math.min(4.5, dist / 6);       // rise up between far places
  return { lon: lerp(a[1], b[1], u), lat: lerp(a[2], b[2], u), zoom: Math.max(5.2, lerp(a[3], b[3], u) - lift * Math.sin(Math.PI * u)), head: u > 0.55 ? b[4] : a[4], hu: u };
}
SCENES.S000 = (ctx, s) => {
  const f = clamp(s.t / s.d), c = openCam(f), proj = camera(c.lon, c.lat, c.zoom);
  ctx.fillStyle = '#0A224A'; ctx.fillRect(0, 0, W, H);
  raster(ctx, proj, A.asia_t, A.asia_t_meta);
  for (const t of ['antalya_t', 'gobi_t', 'bihar_t']) if (A[t]) raster(ctx, proj, A[t], A[t + '_meta'], { feather: 90 });
  const za = z0 => clamp((c.zoom - z0) / 1.2);
  if (A.patna_m) raster(ctx, proj, A.patna_m, A.patna_m_meta, { feather: 140, alpha: za(8.6) });
  for (const [n, z0] of [['antalya', 8.8], ['jiuquan', 8.8], ['nitish', 10.2]]) raster(ctx, proj, A[n], A[n + '_meta'], { feather: 160, alpha: za(z0) });
  for (const k of A.geo.countries_wide) if (k.a3 !== 'IND') geo(ctx, proj, k.geom, { stroke: 'rgba(255,255,255,0.3)', lw: 1.2 });
  geo(ctx, proj, A.geo.india, { stroke: YEL, lw: 3.5 });
  // headline, typed in
  if (c.head) { const a = c.hu > 0.55 ? clamp((c.hu - 0.55) / 0.25) : clamp((0.45 - c.hu) / 0.25) || (c.hu <= 0.45 ? 1 : 0);
    ctx.save(); ctx.globalAlpha *= a; ctx.font = F.head(64, 900); const w = Math.min(1776, ctx.measureText(c.head).width + 80); rr(ctx, (W - w) / 2, 820, w, 120, 26); ctx.fillStyle = 'rgba(11,8,32,0.82)'; ctx.fill(); ctx.restore();
    kt(ctx, c.head, W / 2, 902, { font: F.head(64, 900), color: YEL, align: 'center', alpha: a, maxW: 1700 }); }
  // the show title at the start and at the end
  const ta = Math.max(clamp(1 - s.t / 2.2), clamp((f - 0.9) / 0.06));
  if (ta > 0) { kt(ctx, 'NOVEMBER 4th WEEK', W / 2, 470, { font: F.head(120, 900), color: YEL, align: 'center', alpha: ta, shadow: 14 });
    kt(ctx, '12 stories · real maps · data · one MCQ after every topic', W / 2, 570, { font: F.ui(46, 900), color: '#FFFFFF', align: 'center', alpha: ta, shadow: 10 }); }
  exLogo(ctx, W - 80, 70, 52);
  kt(ctx, (c.zoom > 8 ? 'Contains modified Copernicus Sentinel data 2026 · ' : '') + 'Elevation: Terrain Tiles (Mapzen/AWS) · Boundaries: Survey of India outline (DataMeet)', W - 24, H - 18, { font: F.ui(22, 700), color: '#FFFFFF', align: 'right', shadow: 6, alpha: 0.85 });
};

// ---------- persons in news: a real locator map beside each name ----------
const PERSONS = [
  { f: 0.03, name: 'Balendra Shah', role: 'Prime Minister of Nepal', note: 'state visit to India, 22–23 Nov', a3: 'NPL', b: [79, 25.5, 89.5, 31] },
  { f: 0.27, name: 'Jamieson Greer', role: 'United States Trade Representative', note: 'Section 301 proposal on India', a3: 'USA', b: [-128, 22, -64, 52] },
  { f: 0.5, name: 'Muhammad Zeeshan Ali', role: "Pakistan's first astronaut", note: 'Shenzhou-24 · Tiangong', a3: 'PAK', b: [60, 23, 78, 37.5] },
  { f: 0.72, name: 'Murat Kurum', role: 'President of COP31', note: 'Türkiye · Antalya', a3: 'TUR', b: [25, 35, 45.5, 42.5] },
];
SCENES.S122 = (ctx, s) => {
  exSlide(ctx, PAL.world, null, null); exChip(ctx, 'PERSONS IN NEWS', 72, 44, '#FFFFFF', PAL.world.ink, 36, eia(s, 0.05));
  PERSONS.forEach((p, i) => { const x = 72 + (i % 2) * 900, y = 150 + Math.floor(i / 2) * 450, k = clamp((s.t - T(s, p.f)) / 0.5); if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= easeOut(k); ctx.translate(0, (1 - easeOut(k)) * 40);
    exBox(ctx, x, y, 876, 420, { fill: '#FFFFFF', r: 26, bar: YEL });
    exMap(ctx, s, [x + 24, y + 24, 360, 372], PAL.world, { bounds: p.b, highlight: { [p.a3]: '#F5D300' }, credit: ' ' });
    kt(ctx, p.name, x + 410, y + 110, { font: F.head(46, 900), color: INK, maxW: 440, lh: 52 });
    kt(ctx, p.role, x + 410, y + 230, { font: F.ui(32, 900), color: '#4C1D95', maxW: 440, lh: 38 });
    kt(ctx, p.note, x + 410, y + 340, { font: F.ui(28, 800), color: '#2563EB', maxW: 440, lh: 34 }); ctx.restore(); });
  kt(ctx, 'Country highlighted on the map · Boundaries: Survey of India outline (DataMeet) · Natural Earth', W - 24, H - 18, { font: F.ui(22, 700), color: '#FFFFFF', align: 'right', alpha: 0.8 });
};

// ---------- places in news: the real satellite view of each place ----------
const PLACES = [
  { f: 0.03, name: 'Antalya', tag: 'TÜRKIYE', note: 'Mediterranean coast · COP31', sat: 'antalya', ctr: [30.72, 36.885], span: 0.3 },
  { f: 0.2, name: 'Jiuquan', tag: 'CHINA', note: 'launch centre in Inner Mongolia', sat: 'jiuquan', ctr: [100.25, 40.98], span: 0.45 },
  { f: 0.38, name: 'Musandam', tag: 'OMAN', note: 'tip on the Strait of Hormuz', sat: 'hormuz', ctr: [56.3, 26.2], span: 0.9 },
  { f: 0.56, name: 'Saraighat', tag: 'ASSAM', note: 'Brahmaputra · battle of 1671', sat: 'saraighat', ctr: [91.7, 26.18], span: 0.25 },
  { f: 0.74, name: 'Vaishali', tag: 'BIHAR', note: 'ancient republic · Nitish Setu', sat: 'nitish', ctr: [85.33, 25.65], span: 0.22 },
];
SCENES.S123 = (ctx, s) => {
  exSlide(ctx, PAL.world, null, null); exChip(ctx, 'PLACES IN NEWS · REAL SATELLITE VIEWS', 72, 44, '#FFFFFF', PAL.world.ink, 36, eia(s, 0.05));
  PLACES.forEach((p, i) => { const col = i % 3, row = Math.floor(i / 3), w = 568, h = 420, x = 72 + col * (w + 36) + (row ? (w + 36) / 2 : 0), y = 150 + row * (h + 30), k = clamp((s.t - T(s, p.f)) / 0.5); if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= easeOut(k);
    satView(ctx, s, [x, y, w, h - 120], p.sat, p.ctr, p.span, { r: 22 });
    exBox(ctx, x, y + h - 130, w, 130, { fill: '#FFFFFF', r: 22 });
    kt(ctx, p.tag, x + 24, y + h - 92, { font: F.ui(24, 900), color: '#2563EB' }); kt(ctx, p.name, x + 24, y + h - 50, { font: F.head(40, 900), color: INK });
    kt(ctx, p.note, x + w - 20, y + h - 52, { font: F.ui(24, 800), color: '#4C1D95', align: 'right', maxW: w - 260 }); ctx.restore(); });
};

// ---------- Constitution Day: the Preamble scroll, then the makers board ----------
function scroll(ctx, s, a) {
  ctx.save(); ctx.globalAlpha *= a;
  const x = 360, y = 120, w = 1200, h = 860; const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#F6EBD2'); g.addColorStop(1, '#EAD9B4');
  rr(ctx, x, y, w, h, 18); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 10; ctx.strokeStyle = '#8B5E1A'; ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = '#B8860B'; rr(ctx, x + 26, y + 26, w - 52, h - 52, 12); ctx.stroke();
  for (let i = 0; i < 24; i++) { const t = i / 24; ctx.fillStyle = i % 2 ? '#B8860B' : '#8B5E1A'; ctx.beginPath(); ctx.arc(x + 60 + t * (w - 120), y + 52, 6, 0, 7); ctx.arc(x + 60 + t * (w - 120), y + h - 52, 6, 0, 7); ctx.fill(); }
  kt(ctx, 'THE CONSTITUTION OF INDIA', x + w / 2, y + 140, { font: F.head(56, 900), color: '#5B3A0E', align: 'center' });
  kt(ctx, 'PREAMBLE', x + w / 2, y + 210, { font: F.head(44, 900), color: '#8B5E1A', align: 'center' });
  const L = ['WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a', 'SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens:',
    'JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship;', 'EQUALITY of status and of opportunity; and to promote among them all',
    'FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation;', 'IN OUR CONSTITUENT ASSEMBLY this twenty-sixth day of November, 1949, do HEREBY ADOPT,', 'ENACT AND GIVE TO OURSELVES THIS CONSTITUTION.'];
  L.forEach((l, i) => { const p = clamp((s.t - 0.6 - i * T(s, 0.05)) / 0.6); if (p > 0) kt(ctx, l, x + w / 2, y + 300 + i * 74, { font: F.ui(29, 800), color: '#3B2608', align: 'center', alpha: p, maxW: w - 140 }); });
  kt(ctx, 'Text of the Preamble as it stands today ("socialist", "secular", "and integrity" added by the 42nd Amendment, 1976)', x + w / 2, y + h - 90, { font: F.ui(20, 700), color: '#5B3A0E', align: 'center', maxW: w - 120 });
  ctx.restore();
}
const MAKERS = [
  ['Dr Rajendra Prasad', 'President, Constituent Assembly'], ['Dr B. R. Ambedkar', 'Chairman, Drafting Committee (from 29 Aug 1947)'],
  ['Jawaharlal Nehru', 'Objectives Resolution, 13 Dec 1946'], ['Sachchidananda Sinha', 'temporary President, first sitting 9 Dec 1946'],
  ['H. C. Mookerjee', 'Vice-President'], ['B. N. Rau', 'Constitutional Adviser'],
  ['Durgabai Deshmukh', 'one of 15 women members · from Rajahmundry (AP)'], ['Prem Behari Narain Raizada', 'hand-wrote the original (calligraphy)'],
];
SCENES.S092 = (ctx, s) => {
  exSlide(ctx, PAL.pol, null, null);
  const split = 0.45, a1 = clamp((T(s, split) - s.t) / 0.6), a2 = clamp((s.t - T(s, split)) / 0.6);
  if (a1 > 0) scroll(ctx, s, Math.min(1, a1, clamp(s.t / 0.6)));
  if (a2 > 0) { ctx.save(); ctx.globalAlpha *= a2;
    exChip(ctx, 'THE MAKERS OF OUR CONSTITUTION', 72, 44, YEL, INK, 38, 1);
    MAKERS.forEach(([n, r], i) => { const x = 72 + (i % 2) * 900, y = 150 + Math.floor(i / 2) * 175, k = clamp((s.t - T(s, split) - 0.3 - i * 0.35) / 0.4); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha *= k; exBox(ctx, x, y, 876, 155, { fill: i === 6 ? '#CCF5EC' : '#FFFFFF', r: 20, bar: i < 2 ? YEL : i === 6 ? '#2BB3A3' : VIO });
      kt(ctx, n, x + 40, y + 66, { font: F.head(40, 900), color: INK }); kt(ctx, r, x + 40, y + 118, { font: F.ui(28, 800), color: '#4C1D95', maxW: 800 }); ctx.restore(); });
    const b = clamp((s.t - T(s, 0.85)) / 0.5);
    if (b > 0) { ctx.save(); ctx.globalAlpha *= b; rr(ctx, 72, 870, 1776, 150, 22); ctx.fillStyle = YEL; ctx.fill(); ctx.restore();
      kt(ctx, '2 years, 11 months, 18 days · 284 members signed on 24 Jan 1950 · adopted 26 Nov 1949', 960, 962, { font: F.ui(38, 900), color: INK, align: 'center', alpha: b, maxW: 1700 }); }
    ctx.restore(); }
};

// ---------- COP31 title: Antalya with the summit facts on the real city ----------
SCENES.S031 = (ctx, s) => {
  satView(ctx, s, [0, 0, W, H], 'antalya', [30.72, 36.885], 0.33, { dim: 0.25,
    labels: [['ANTALYA', [30.69, 36.888], 64, '#FFFFFF', 0.05], ['MEDITERRANEAN SEA', [30.68, 36.845], 44, '#BFE3FF', 0.1]] });
  zoom(ctx, bounce(s.t, 0.05), 230, 250, () => { ctx.beginPath(); ctx.arc(230, 250, 130, 0, 7); ctx.fillStyle = YEL; ctx.fill(); kt(ctx, '3', 230, 300, { font: F.head(150, 900), color: INK, align: 'center' }); });
  kt(ctx, 'COP31 ends with no deal', 400, 240, { font: F.head(86, 900), color: '#FFFFFF', shadow: 12, alpha: eia(s, 0.3) });
  kt(ctx, 'Update · Antalya, Türkiye · 9–22 Nov 2026', 404, 320, { font: F.ui(44, 800), color: YEL, shadow: 8, alpha: eia(s, 0.6) });
  [['Türkiye presided', 0.25], ['Australia led the negotiations', 0.4], ['"Antalya Pact" not adopted', 0.55]].forEach(([t, f], i) => exChip(ctx, t, 404 + i * 0, 380 + i * 70, i === 2 ? '#FFD9DC' : '#FFFFFF', INK, 32, eia(s, T(s, f))));
};
