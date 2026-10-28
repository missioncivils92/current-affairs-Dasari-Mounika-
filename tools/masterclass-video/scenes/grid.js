// Scenes for the W44 Prelims Grid (weeks/2026-W44/prelims-grid), v2.
// v2 answers the owner's review of v1 ("looks like slides", "looks cheap", "too dense"):
// every Glimpse is three beats instead of one dense card:
//   1. HERO: a full-frame visual (Copernicus satellite, terrain map or a data graphic) under a short headline;
//   2. FACTS: one or two big facts slide in on their spoken word;
//   3. TRAP: a ✗ / ✓ split lands on "Prelims Trap" and holds to the end of the item.
// A category-coloured sting opens each item. Numbers appear at their final value only (CLAUDE.md §6.2).
const CAT = {
  N: { name: 'NATIONAL', col: C.yellow, ink: C.slate },
  I: { name: 'INTERNATIONAL', col: C.blue, ink: C.white },
  M: { name: 'MISC', col: '#E8ECF1', ink: C.slate },
};
const ORDER = ['N', 'N', 'N', 'N', 'N', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'M', 'M', 'M', 'M'];
const NI = ORDER.length;
GK = { order: ORDER, cat: CAT };
const TERRAIN = TERRAIN_CREDIT, SENT = SENT_CREDIT;

// ---------------- G.0 the board ----------------
SCENES.S00 = (ctx, s) => {
  bg(ctx, { inner: '#20252D', outer: '#0D1014' });
  text(ctx, 'PRELIMS GRID', 960, 150, { font: F.ui(34, 800), align: 'center', color: C.yellow });
  text(ctx, 'Week 44 · 26 Oct – 1 Nov 2026', 960, 200, { font: F.ui(28, 600), align: 'center', color: C.dim });
  const flip = s.w('sixteen') - 0.4, labels = ['Cyclone Arnab', 'IDBI sale', 'RBI · FERR', 'GRAP', 'CVC week', 'SIOFA', 'Hunger Index', 'Poland · CDRI', 'BRICS MPs', 'CBD COP17', 'Emissions Gap', 'Loss & Damage', 'Ramsar 103', 'GI tag', 'Innovation Index', 'Days'];
  ORDER.forEach((c, i) => {
    const col = i % 4, row = Math.floor(i / 4), x = 420 + col * 280, y = 250 + row * 170;
    const k = ease(span(s.t, flip + i * 0.07, flip + i * 0.07 + 0.45)), st = CAT[c];
    ctx.save(); ctx.translate(x + 125, y + 70); ctx.scale(Math.max(0.02, Math.abs(Math.cos(Math.PI * k))), 1); ctx.translate(-(x + 125), -(y + 70));
    if (k < 0.5) card(ctx, x, y, 250, 140, { fill: '#2B3139', stroke: 'rgba(255,255,255,0.12)' });
    else { card(ctx, x, y, 250, 140, { fill: '#262B33', accent: st.col, bar: 10 }); text(ctx, labels[i], x + 30, y + 82, { font: F.ui(28, 800), maxW: 200, lh: 32 }); }
    ctx.restore();
  });
  text(ctx, 'what happened  →  the static fact  →  the trap', 960, 1000, { font: F.hand(52), align: 'center', color: C.yellow, alpha: appear(s.t, s.w('static') - 0.3) });
};

// ---------------- National ----------------
SCENES.S01 = (ctx, s) => {    // Cyclone Arnab: Sentinel-2, Godavari delta coast
  const into = span(s.t, 2.0, 4.0);
  const cam = camLerp({ lon: 82.6, lat: 17.0, zoom: 7.4 }, { lon: 82.3, lat: 16.80, zoom: 11.2 }, ease(into));
  const proj = camera(cam.lon, cam.lat, lerp(cam.zoom, cam.zoom + 0.25, s.p));
  terrainMap(ctx, proj, 'apcoast');
  raster(ctx, proj, A.godavari_coast, A.godavari_coast_meta, { feather: 140, alpha: ease(span(s.t, 1.6, 3.2)) });
  arrow(ctx, [proj([84.8, 15.2]), proj([83.6, 16.0]), proj([82.75, 16.65]), proj([82.30, 16.93])], span(s.t, 0.9, 3.6), { color: C.red, lw: 8, dash: [18, 12] });
  pin(ctx, proj, [82.247, 16.989], 'Kakinada', { alpha: appear(s.t, s.w('kakinada') - 0.3), color: C.white, dx: 20, dy: -18, font: F.ui(34, 800) });
  pin(ctx, proj, [82.214, 16.733], 'YANAM', { alpha: appear(s.t, s.w('yanam') - 0.3), sub: 'Puducherry UT', dx: -22, dy: 44, font: F.ui(38, 800) });
  topShade(ctx); sideShade(ctx, 1050);
  if (s.t < 2.6) locatorInset(ctx, 1240, 300, 560, 470, [82.2, 16.8], 1 - span(s.t, 2.0, 2.6));
  headline(ctx, s, 0, 'Cyclone Arnab makes landfall', '28 Oct · AP–Yanam coast near Kakinada');
  facts(ctx, s, 0, [['IMD CATEGORY', 'Very Severe Cyclonic Storm', 'very severe', 52], ['NAME FROM', 'Bangladesh\'s list', 'bangladesh', 56]], { y: 330, lines: 2 });
  trap(ctx, s, 'Yanam is part of Andhra Pradesh', 'Yanam belongs to Puducherry UT');
  finish(ctx, s, 0, SENT + ' · ' + TERRAIN);
};
SCENES.S02 = (ctx, s) => {    // IDBI: ownership donut
  typeHero(ctx, 1, '%');
  const cx = 520, cy = 500, R = 200, sold = 60.72, at = s.w('sixty point') - 0.4, a = appear(s.t, 0.4);
  ctx.save(); ctx.globalAlpha = a; ctx.lineWidth = 70; ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * sold / 100 * ease(span(s.t, at, at + 1.0))); ctx.stroke(); ctx.restore();
  text(ctx, s.t > at + 1.0 ? '60.72%' : '', cx, cy + 20, { font: F.head(72), align: 'center', color: C.yellow });
  text(ctx, 'Government + LIC stake sold', cx, cy + 70, { font: F.ui(30, 700), align: 'center', alpha: appear(s.t, at + 1.0) });
  topShade(ctx, 360, 0.6);
  headline(ctx, s, 1, 'IDBI Bank: the stake sale', 'CCEA approval · 14 Oct · RBI approval pending');
  facts(ctx, s, 1, [['BUYER', 'A Fairfax company (Canada)', 'fairfax', 50], ['PRICE', '≈ ₹52,878 crore', 'fifty-two', 60]], { y: 340, lines: 2 });
  trap(ctx, s, 'IDBI is a public sector bank', 'RBI: private sector bank since 2019');
  finish(ctx, s, 1, 'Source: CCEA decision, 14 Oct 2026 (as reported)');
};
SCENES.S03 = (ctx, s) => {    // RBI FERR: threshold bars
  typeHero(ctx, 2, '20%');
  const t1 = s.w('one hundred million') - 0.3, t2 = s.w('five million') - 0.3;
  const a1 = appear(s.t, t1), a2 = appear(s.t, t2);
  text(ctx, 'Unhedged-exposure threshold', 140, 470, { font: F.ui(30, 800), color: C.dim, alpha: a1 });
  ctx.save(); ctx.globalAlpha = a1; ctx.fillStyle = 'rgba(255,255,255,0.22)'; rr(ctx, 140, 500, 900, 70, 10); ctx.fill(); ctx.restore();
  text(ctx, 'before: $100 mn', 160, 548, { font: F.ui(32, 800), alpha: a1 });
  ctx.save(); ctx.globalAlpha = a2; ctx.fillStyle = C.yellow; rr(ctx, 140, 600, 900 * 5 / 100 * 4, 70, 10); ctx.fill(); ctx.restore();
  text(ctx, 'now: $5 mn', 340, 648, { font: F.ui(32, 800), color: C.yellow, alpha: a2 });
  text(ctx, '(bar not to scale)', 140, 712, { font: F.ui(24, 600), color: C.dim, alpha: a2 });
  topShade(ctx, 360, 0.6);
  headline(ctx, s, 2, 'RBI tightens rupee derivatives', '10 Oct · Foreign Exchange Risk Reserve (FERR)');
  facts(ctx, s, 2, [['NEW RESERVE ON RUPEE FX DERIVATIVES', '20%', 'twenty per cent', 96]], { y: 340 });
  trap(ctx, s, 'Issued under FERA', 'Under FEMA 1999 (a civil law)');
  finish(ctx, s, 2, 'Source: RBI A.P. (DIR Series) Circular No. 26, 10 Oct 2026 (as reported)');
};
SCENES.S04 = (ctx, s) => {    // GRAP: Delhi from Sentinel-2, 22–25 Oct
  satHero(ctx, s, 'delhi_oct', { lon: 77.22, lat: 28.64, zoom: 11.75 }, { lon: 77.2, lat: 28.63, zoom: 12.05 }, { base: 'northindia', filter: 'saturate(0.9) contrast(1.02)' });
  text(ctx, 'Delhi from orbit · 22–25 Oct 2026', 960, 700, { font: F.ui(28, 700), align: 'center', color: '#E3E7EC', shadow: 10, alpha: appear(s.t, 1.2) });
  topShade(ctx); sideShade(ctx, 1050);
  headline(ctx, s, 3, 'Delhi\'s air turns "poor"', '21 Oct · GRAP Stage I across NCR');
  const L = [['I', 'Poor', '201–300', '#E8B931'], ['II', 'Very Poor', '301–400', '#E0802F'], ['III', 'Severe', '401–450', '#D9534F'], ['IV', 'Severe +', '> 450', '#8E2C48']];
  const t0 = s.w('four stages') - 0.4;
  L.forEach(([n, b, r, col], i) => {
    const a = i === 0 ? appear(s.t, s.w('stage one') - 0.3) : appear(s.t, t0 + i * 0.25), y = 300 + i * 110;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(12,14,18,0.85)'; rr(ctx, 1200, y, 640, 92, 12); ctx.fill(); ctx.fillStyle = col; ctx.fillRect(1200, y, 12, 92); ctx.restore();
    text(ctx, 'Stage ' + n, 1236, y + 58, { font: F.ui(32, 800), color: col, alpha: a }); text(ctx, b, 1420, y + 58, { font: F.head(38), alpha: a }); text(ctx, r, 1820, y + 58, { font: F.ui(30, 700), align: 'right', alpha: a });
  });
  trap(ctx, s, 'CPCB invokes GRAP', 'CAQM invokes it (2021 Act)');
  finish(ctx, s, 3, SENT + ' · Source: CAQM order, 21 Oct 2026');
};
SCENES.S05 = (ctx, s) => {    // CVC: a 1964 → 2003 line
  typeHero(ctx, 4, 'CVC');
  const a = appear(s.t, s.w('santhanam') - 0.3), b = appear(s.t, s.w('2003') - 0.3);
  arrow(ctx, [[180, 620], [980, 620]], span(s.t, s.w('santhanam') - 0.3, s.w('2003')), { color: C.yellow, lw: 6 });
  text(ctx, '1964', 180, 580, { font: F.head(80), color: C.yellow, alpha: a }); text(ctx, 'executive resolution', 180, 680, { font: F.ui(30, 700), alpha: a }); text(ctx, 'Santhanam Committee', 180, 720, { font: F.ui(30, 700), color: C.dim, alpha: a });
  text(ctx, '2003', 980, 580, { font: F.head(80), color: C.yellow, align: 'right', alpha: b }); text(ctx, 'CVC Act → statutory', 980, 680, { font: F.ui(30, 700), align: 'right', alpha: b });
  topShade(ctx, 360, 0.6);
  headline(ctx, s, 4, 'Vigilance Awareness Week', '26 Oct – 1 Nov · Sardar Patel\'s birth anniversary week');
  facts(ctx, s, 4, [['THEME 2026', 'Probity for Prosperity', 'probity', 58]], { y: 340, lines: 2 });
  trap(ctx, s, 'The CVC is a constitutional body', 'Statutory: CVC Act 2003');
  finish(ctx, s, 4, 'Source: CVC circular, Sep 2026');
};

// ---------------- International ----------------
SCENES.S06 = (ctx, s) => {    // SIOFA: Indian Ocean bathymetry
  const cam = camLerp({ lon: 78, lat: 12, zoom: 3.6 }, { lon: 66, lat: -22, zoom: 3.3 }, ease(span(s.t, 1.0, 6.0)));
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  terrainMap(ctx, proj, 'indianocean', { indiaFill: 'rgba(245,211,0,0.25)' });
  mapLabel(ctx, proj, [70, -36], 'SOUTHERN INDIAN OCEAN · HIGH SEAS', { font: F.ui(34, 800), color: '#9CC8EA', alpha: appear(s.t, s.w('southern') - 0.3) });
  mapLabel(ctx, proj, [70, -40.5], 'toothfish · alfonsino', { font: F.hand(46), color: '#E3E7EC', alpha: appear(s.t, s.w('toothfish') - 0.3) });
  topShade(ctx); sideShade(ctx, 1050);
  headline(ctx, s, 5, 'India to join SIOFA', 'Southern Indian Ocean Fisheries Agreement · Rome, 2006');
  facts(ctx, s, 5, [['STATUS', 'Cooperating non-party → full party', 'four years', 48], ['COVERS', 'High-seas fish, not tuna', 'toothfish', 52]], { y: 330, lines: 2 });
  trap(ctx, s, 'SIOFA manages tuna', 'Tuna → Indian Ocean Tuna Commission');
  finish(ctx, s, 5, TERRAIN);
};
SCENES.S07 = (ctx, s) => {    // GHI: rank scale
  typeHero(ctx, 6);
  const at = s.w('hundredth') - 0.3, a = appear(s.t, at), x0 = 140, x1 = 1040, X = r => lerp(x0, x1, (r - 1) / 121);
  ctx.save(); ctx.globalAlpha = appear(s.t, 0.5); ctx.fillStyle = 'rgba(255,255,255,0.12)'; rr(ctx, x0, 480, x1 - x0, 16, 8); ctx.fill(); ctx.restore();
  text(ctx, '1st', x0, 540, { font: F.ui(26, 700), color: C.dim }); text(ctx, '122nd', x1, 540, { font: F.ui(26, 700), color: C.dim, align: 'right' });
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(X(100), 488, 22, 0, 7); ctx.fillStyle = C.blue; ctx.fill(); ctx.restore();
  text(ctx, 'India · 100th', X(100), 440, { font: F.ui(34, 800), align: 'center', alpha: a });
  const chips = [['Undernourishment', 0], ['Child stunting', 1], ['Child wasting 19.0%', 1], ['Child mortality', 1]], ca = appear(s.t, s.w('four indicators') - 0.3);
  let x = 140; chips.forEach(([l, kid]) => { x += 16 + pill(ctx, l, x, 590, { fill: kid ? C.blue : 'rgba(255,255,255,0.15)', color: C.white, font: F.ui(26, 800), h: 50, alpha: ca }); });
  text(ctx, '3 of 4 indicators measure children', 140, 700, { font: F.hand(46), color: C.yellow, alpha: appear(s.t, s.w('three of them') - 0.3) * (1 - appear(s.t, s.w('prelims trap') - 0.3)) });
  topShade(ctx, 360, 0.6);
  headline(ctx, s, 6, 'Global Hunger Index 2026', 'India: score 24.1 · "serious" · GoI disputes the method');
  facts(ctx, s, 6, [['INDIA', '100th of 122', 'hundredth', 72]], { y: 340 });
  trap(ctx, s, 'Published by the FAO or WFP', 'NGOs: Welthungerhilfe, Concern Worldwide');
  finish(ctx, s, 6, 'Source: Global Hunger Index 2026 (as reported)');
};
SCENES.S08 = (ctx, s) => {    // Poland → India arc
  const proj = camera(lerp(52, 50, s.p), 40, 3.35);
  terrainMap(ctx, proj, null, { highlight: { POL: 'rgba(74,144,194,0.45)' } });
  const w = proj([21.01, 52.23]), d = proj([77.21, 28.61]), p = span(s.t, 0.8, 3.0);
  ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(...w);
  for (let i = 1; i <= 40; i++) { const t = i / 40 * p; ctx.lineTo(lerp(w[0], d[0], t), lerp(w[1], d[1], t) - Math.sin(Math.PI * t) * 160); } ctx.stroke(); ctx.restore();
  pin(ctx, proj, [21.01, 52.23], 'Warsaw', { color: C.blue, dx: -20, dy: -16, font: F.ui(32, 800) }); pin(ctx, proj, [77.21, 28.61], 'New Delhi', { alpha: appear(s.t, 2.6), dx: 18, dy: 34, font: F.ui(32, 800) });
  topShade(ctx); sideShade(ctx, 1050);
  headline(ctx, s, 7, 'Poland\'s PM in New Delhi', '21–23 Oct · India–Poland strategic partnership');
  facts(ctx, s, 7, [['TARGET', 'Double trade by 2030', 'double', 54], ['POLAND JOINS', 'CDRI', 'c-d-r-i', 72]], { y: 330 });
  trap(ctx, s, 'CDRI is headquartered in Gurugram', 'CDRI: New Delhi · ISA: Gurugram');
  finish(ctx, s, 7, TERRAIN);
};
SCENES.S09 = (ctx, s) => {    // BRICS members on a world map
  const mem = ['BRA', 'RUS', 'IND', 'CHN', 'ZAF', 'EGY', 'ETH', 'IRN', 'ARE', 'IDN'], t0 = s.w('ten full') - 0.4, hl = {};
  mem.forEach((m, i) => { if (s.t > t0 + i * 0.22 || (i < 5 && s.t > 1.0)) hl[m] = i < 5 ? 'rgba(74,144,194,0.55)' : 'rgba(43,179,163,0.6)'; });
  const proj = camera(lerp(40, 46, s.p), 12, 1.95);
  terrainMap(ctx, proj, null, { world: true, highlight: hl, indiaFill: 'rgba(74,144,194,0.55)' });
  const sau = A.geo.countries_wide.find(c => c.a3 === 'SAU'), sa = appear(s.t, s.w('saudi') - 0.3);
  if (sau && sa > 0) geo(ctx, proj, sau.geom, { stroke: C.red, lw: 3, dash: [8, 6], alpha: sa });
  if (sa > 0) mapLabel(ctx, proj, [45, 21], 'not a member', { font: F.ui(28, 800), color: C.red, alpha: sa });
  topShade(ctx); sideShade(ctx, 1150);
  headline(ctx, s, 8, '12th BRICS Parliamentary Forum', 'Samvidhan Sadan, New Delhi · 26–27 Oct');
  facts(ctx, s, 8, [['CHAIRED BY', 'Lok Sabha Speaker', 'chaired', 52], ['FULL MEMBERS', '10', 'ten full', 96]], { y: 330, x: 1300, w: 520 });
  trap(ctx, s, 'Saudi Arabia is a full member', '10 members: Saudi Arabia is not one');
  finish(ctx, s, 8, TERRAIN);
};
SCENES.S10 = (ctx, s) => {    // CBD COP17, Yerevan
  const cam = camLerp({ lon: 62, lat: 30, zoom: 3.7 }, { lon: 45.6, lat: 40.0, zoom: 5.6 }, ease(span(s.t, 0.8, 4.5)));
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  terrainMap(ctx, proj);
  pin(ctx, proj, [44.51, 40.18], 'YEREVAN', { sub: 'Armenia', font: F.ui(38, 800), pulse: (s.t / 2) % 1, dx: -22, dy: -22 });
  topShade(ctx); sideShade(ctx, 1050);
  headline(ctx, s, 9, 'CBD COP17 in Yerevan', '19–30 Oct · Convention on Biological Diversity');
  facts(ctx, s, 9, [['FIRST', 'Global review of the Kunming–Montreal Framework', 'review', 42], ['THE FRAMEWORK', '23 targets · 30×30', 'twenty-three', 56]], { y: 330, lines: 2 });
  trap(ctx, s, '30×30 = 30% of land and sea combined', '30% of land AND 30% of sea');
  finish(ctx, s, 9, TERRAIN);
};
SCENES.S11 = (ctx, s) => {    // UNEP: a warming scale
  typeHero(ctx, 10, '°C');
  const x0 = 160, x1 = 1060, X = v => lerp(x0, x1, (v - 1.0) / 2.2), y = 620;
  const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#E8B931'); g.addColorStop(0.55, '#E0802F'); g.addColorStop(1, '#C0392B');
  ctx.save(); ctx.globalAlpha = appear(s.t, 0.5); ctx.fillStyle = g; rr(ctx, x0, y, x1 - x0, 26, 13); ctx.fill(); ctx.restore();
  [[1.5, 'Paris 1.5'], [2.0, '2.0']].forEach(([v, l]) => { text(ctx, l, X(v), y + 70, { font: F.ui(26, 700), color: C.dim, align: 'center', alpha: appear(s.t, 0.5) }); });
  [[2.6, 'all pledges', 'two point six'], [2.8, 'current policies', 'two point eight']].forEach(([v, l, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), xx = X(v);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.white; ctx.beginPath(); ctx.moveTo(xx, y - 6); ctx.lineTo(xx - 14, y - 34); ctx.lineTo(xx + 14, y - 34); ctx.fill(); ctx.restore();
    const al = i ? 'left' : 'right', ox = i ? 24 : -24;
    text(ctx, `≈ ${v} °C`, xx + ox, y - 70, { font: F.head(52), align: al, alpha: a }); text(ctx, l, xx + ox, y - 40, { font: F.ui(26, 700), align: al, color: C.dim, alpha: a });
  });
  topShade(ctx, 360, 0.6);
  headline(ctx, s, 10, 'Emissions Gap Report 2026', '21 Oct · warming projected this century');
  facts(ctx, s, 10, [['CURRENT POLICIES', '≈ 2.8 °C', 'two point eight', 72], ['IF EVERY PLEDGE IS MET', '≈ 2.6 °C', 'two point six', 72]], { y: 340 });
  trap(ctx, s, 'It is an IPCC report', 'Published by UNEP');
  finish(ctx, s, 10, 'Source: UNEP Emissions Gap Report 2026 (as reported)');
};
SCENES.S16 = (ctx, s) => {    // Loss and Damage Fund → Nepal
  const cam = camLerp({ lon: 82, lat: 25, zoom: 4.8 }, { lon: 85.0, lat: 28.0, zoom: 7.0 }, ease(span(s.t, 0.8, 4.0)));
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  terrainMap(ctx, proj, 'nepal', { highlight: { NPL: 'rgba(43,179,163,0.28)' } });
  pin(ctx, proj, [85.32, 27.71], 'Kathmandu', { color: C.white, dx: -20, dy: 40, font: F.ui(30, 800), alpha: appear(s.t, 2.5) });
  pin(ctx, proj, [85.6, 28.0], 'Bhotekoshi–Trishuli floods', { color: C.blue, dx: -20, dy: -24, font: F.ui(30, 800), alpha: appear(s.t, s.w('flood') - 0.3) });
  topShade(ctx); sideShade(ctx, 1050);
  headline(ctx, s, 11, 'Loss and Damage Fund: first allocation', 'Board decision · 22 Oct');
  facts(ctx, s, 11, [['NEPAL', '$20 mn (provisional)', 'twenty million', 60], ['ORIGIN', 'COP27 (2022) → COP28 (2023)', 'sharm', 46]], { y: 380, lines: 2 });
  trap(ctx, s, 'Paid by the Green Climate Fund', 'A separate fund · GCF is in Songdo');
  finish(ctx, s, 11, TERRAIN);
};

// ---------------- Misc ----------------
SCENES.S12 = (ctx, s) => {    // Ramsar: Sukhna Lake from Sentinel-2, then the India map
  const sw = s.w('sauj') - 0.4, m = ease(span(s.t, sw, sw + 1.2));
  if (m < 1) {
    satHero(ctx, s, 'sukhna', { lon: 76.83, lat: 30.743, zoom: 14.3 }, { lon: 76.822, lat: 30.743, zoom: 14.6 }, { base: 'northindia' });
    text(ctx, 'Sukhna Wetland · Chandigarh', 640, 640, { font: F.ui(34, 800), shadow: 12, alpha: appear(s.t, s.w('sukhna') - 0.3) * (1 - m) });
  }
  if (m > 0) {
    ctx.save(); ctx.globalAlpha = m;
    const proj = camera(78.6, 28.8, 6.2); terrainMap(ctx, proj, 'northindia');
    pin(ctx, proj, [76.818, 30.742], 'Sukhna Wetland', { sub: 'Chandigarh UT', color: C.teal, dx: -20, dy: -20, font: F.ui(32, 800) });
    pin(ctx, proj, [79.02, 27.23], 'Sauj Jheel', { sub: 'Mainpuri, UP', color: C.teal, font: F.ui(32, 800) });
    ctx.restore();
  }
  topShade(ctx); sideShade(ctx, 1050);
  headline(ctx, s, 12, 'Ramsar sites reach 103', 'Added 15 Oct · India joined the convention in 1982');
  facts(ctx, s, 12, [['INDIA\'S RAMSAR SITES', '103', 'one hundred and three', 110], ['MONTREUX RECORD (INDIA)', 'Keoladeo · Loktak', 'montreux', 54]], { y: 330 });
  trap(ctx, s, 'Chilika is on the Montreux Record', 'Chilika was removed in 2002');
  finish(ctx, s, 12, SENT + ' · ' + TERRAIN);
};
SCENES.S13 = (ctx, s) => {    // GI: Ambaji and Tirupati
  const proj = camera(lerp(76.5, 76.0, s.p), 19.2, 5.4);
  terrainMap(ctx, proj, 'westindia');
  pin(ctx, proj, [72.85, 24.33], 'Ambaji', { sub: 'Gujarat', dx: -20, dy: -18, font: F.ui(34, 800), alpha: appear(s.t, 0.8) });
  pin(ctx, proj, [79.42, 13.63], 'Tirupati', { sub: 'Andhra Pradesh · GI 2009', color: C.teal, dx: 20, dy: -18, font: F.ui(34, 800), alpha: appear(s.t, s.w('tirupati') - 0.3) });
  topShade(ctx); sideShade(ctx, 1050);
  headline(ctx, s, 13, 'GI tag for Ambaji Mohanthal', 'Reported · Gujarat temple prasad');
  facts(ctx, s, 13, [['REGISTRY', 'Chennai', 'chennai', 64], ['INDIA\'S FIRST GI', 'Darjeeling tea', 'darjeeling', 58]], { y: 330 });
  trap(ctx, s, 'A GI is a permanent, one-time grant', '10 years · renewable again and again');
  finish(ctx, s, 13, TERRAIN + ' · GI: Geographical Indications Registry (as reported)');
};
SCENES.S14 = (ctx, s) => {    // GII: a rank ladder
  typeHero(ctx, 14);
  const R = [['1', 'Switzerland'], ['2', 'Sweden'], ['3', 'United States']], a = appear(s.t, s.w('switzerland') - 0.3);
  R.forEach(([n, c], i) => { text(ctx, n, 160, 430 + i * 64, { font: F.head(48), color: C.dim, alpha: a }); text(ctx, c, 240, 430 + i * 64, { font: F.ui(38, 700), alpha: a }); });
  text(ctx, '⋮', 175, 620, { font: F.ui(40, 800), color: C.dim, alpha: a });
  const b = appear(s.t, s.w('thirty-eighth') - 0.3);
  text(ctx, '38', 160, 700, { font: F.head(56), color: C.yellow, alpha: b }); text(ctx, 'India', 240, 700, { font: F.ui(42, 800), color: C.yellow, alpha: b });
  topShade(ctx, 360, 0.6);
  headline(ctx, s, 14, 'Global Innovation Index 2026', 'India: 38th of 139 economies');
  facts(ctx, s, 14, [['INDIA', '1st among lower-middle-income economies', 'lower-middle', 46]], { y: 360, lines: 2 });
  trap(ctx, s, 'Published by the WEF', 'Published by WIPO');
  finish(ctx, s, 14, 'Source: WIPO, Global Innovation Index 2026 (as reported)');
};
SCENES.S15 = (ctx, s) => {    // Days: three calendar tiles
  bg(ctx, { inner: '#20252D', outer: '#0D1014' });
  const D = [['27', 'Infantry Day', '1947 airlanding at Srinagar', 'infantry'], ['30', 'World Savings Day', 'India\'s date', 'savings'], ['31', 'Rashtriya Ekta Diwas', 'Sardar Patel', 'ekta']];
  D.forEach(([d, t, sub, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), x = 140 + i * 560, y = 300 + (1 - a) * 40;
    card(ctx, x, y, 500, 420, { fill: '#262B33', alpha: a, r: 16 });
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = C.red; rr(ctx, x, y, 500, 70, 16); ctx.fill(); ctx.fillRect(x, y + 40, 500, 30); ctx.restore();
    text(ctx, 'OCTOBER', x + 250, y + 48, { font: F.ui(28, 800), align: 'center', alpha: a });
    text(ctx, d, x + 250, y + 220, { font: F.head(140), align: 'center', alpha: a });
    text(ctx, t, x + 250, y + 310, { font: F.ui(34, 800), align: 'center', alpha: a, color: C.yellow });
    text(ctx, sub, x + 250, y + 360, { font: F.ui(28, 600), align: 'center', alpha: a, color: '#C9CFD6' });
  });
  topShade(ctx, 260, 0.5);
  headline(ctx, s, 15, 'Three days to note', '');
  trap(ctx, s, 'India marks Savings Day on 31 Oct', 'India: 30 Oct (most countries: 31)');
  finish(ctx, s, 15);
};
