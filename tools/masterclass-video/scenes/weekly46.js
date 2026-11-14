// W46 weekly (weeks/2026-W46/weekly): "November 2nd Week Current Affairs", 16:9, voice only.
// Render: node render.js <assets> <timeline> scenes/weekly46.js <out> --strict
// Owner (14 Nov): "use diagrams, give more good data with deep analysis". Every deep topic has a data chart AND a
// diagram that builds while the narration runs. Builds are keyed to fractions of the row (robust to alignment), and
// every number is drawn at its final value (a paused frame never shows a wrong figure). No short forms on screen.
window.NO_PUSH = true; window.EX_LOGO = true;

const YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', RED = '#E63946', SKY = '#4CC9F0', PNK = '#F9A8D4', VIO = '#7C3AED';
const PAL = { eco: EP.purple, pol: EP.violet, env: EP.teal, world: EP.blue, trap: EP.red };
window.bounce = window.bounce || ((t, a, d = 0.6) => { const x = clamp((t - a) / d); return x <= 0 ? 0 : easeOut(x) + 0.12 * Math.sin(x * Math.PI); });
const T = (s, f) => s.d * f;                         // a build time at a fraction f of the row

// ---------- building blocks ----------
function zoom(ctx, k, cx, cy, fn) { if (k <= 0) return; ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
function box(ctx, x, y, w, h, fill, lines, o = {}) {        // a card with centred (or left) wrapped lines: [[text, size, colour, weight]]
  exBox(ctx, x, y, w, h, { fill, r: o.r ?? 22, bar: o.bar });
  const left = o.left, pad = o.pad ?? 26; let total = 0; const L = [];
  for (const [t, z, c, wt] of lines) { ctx.save(); ctx.font = F.ui(z, wt || 900); const n = wrap(ctx, t, w - pad * 2).length; ctx.restore(); L.push([t, z, c, wt, n]); total += n * z * 1.18 + z * 0.25; }
  let yy = y + (o.top ?? Math.max(pad, (h - total) / 2)) ;
  for (const [t, z, c, wt, n] of L) { yy += z * 0.95; kt(ctx, t, left ? x + pad : x + w / 2, yy, { font: F.ui(z, wt || 900), color: c, align: left ? 'left' : 'center', maxW: w - pad * 2, lh: z * 1.18 }); yy += (n - 1) * z * 1.18 + z * 0.4; }
}
function arrowR(ctx, x1, y, x2, a, col = '#FFFFFF') { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2 - 18, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x2, y); ctx.lineTo(x2 - 26, y - 16); ctx.lineTo(x2 - 26, y + 16); ctx.fill(); ctx.restore(); }
function arrowD(ctx, x, y1, y2, a, col = '#FFFFFF') { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2 - 18); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y2); ctx.lineTo(x - 16, y2 - 26); ctx.lineTo(x + 16, y2 - 26); ctx.fill(); ctx.restore(); }
function head(ctx, s, c, label, sub) { exChip(ctx, label, 72, 44, '#FFFFFF', c.ink, 34, eia(s, 0.05)); if (sub) kt(ctx, sub, 76, 168, { font: F.ui(34, 700), color: 'rgba(255,255,255,0.9)', alpha: eia(s, 0.2) }); }
function source(ctx, s, t) { kt(ctx, 'Source: ' + t, 72, 1052, { font: F.ui(24, 700), color: 'rgba(255,255,255,0.75)', alpha: eia(s, 0.6) }); }

// a flowchart: boxes left → right with arrows, each box landing at its fraction of the row
function flow(ctx, s, items, y, h, fills) {
  const n = items.length, gap = 60, w = (1776 - gap * (n - 1)) / n;
  items.forEach((it, i) => {
    const x = 72 + i * (w + gap), at = T(s, it.f), k = bounce(s.t, at);
    zoom(ctx, k, x + w / 2, y + h / 2, () => box(ctx, x, y, w, h, fills ? fills[i] : '#FFFFFF', it.lines));
    if (i < n - 1) arrowR(ctx, x + w + 6, y + h / 2, x + w + gap - 6, eia(s, T(s, items[i + 1].f) - 0.2));
  });
}
// vertical bars with labels inside, at final values; data: [[label, value, text, colour]]
function vbars(ctx, s, x0, base, unit, bw, gap, data, f0, step = 0.08) {
  data.forEach(([lab, v, txt, col], i) => {
    const g = span(s.t, T(s, f0 + i * step), T(s, f0 + i * step) + 0.7); if (g <= 0) return;
    const x = x0 + i * (bw + gap), h = Math.max(64, v * unit) * easeOut(g);
    exBox(ctx, x, base - h, bw, h, { fill: col, r: 16 });
    if (g >= 1) kt(ctx, txt, x + bw / 2, base - h + 56, { font: F.ui(46, 900), color: INK, align: 'center' });
    kt(ctx, lab, x + bw / 2, base + 46, { font: F.ui(32, 900), color: '#FFFFFF', align: 'center', alpha: Math.min(1, g * 2) });
  });
}
// horizontal bars; data: [[label, value, text, colour]]
function hbars(ctx, s, x0, y0, unit, bh, gap, data, f0, step = 0.12) {
  data.forEach(([lab, v, txt, col], i) => {
    const g = span(s.t, T(s, f0 + i * step), T(s, f0 + i * step) + 0.8); if (g <= 0) return;
    const y = y0 + i * (bh + gap), w = Math.max(120, v * unit) * easeOut(g);
    kt(ctx, lab, x0, y - 14, { font: F.ui(32, 900), color: '#FFFFFF', alpha: Math.min(1, g * 2) });
    exBox(ctx, x0, y, w, bh, { fill: col, r: 14 });
    if (g >= 1) { const inside = w > 260; kt(ctx, txt, inside ? x0 + w - 20 : x0 + w + 20, y + bh / 2 + 16, { font: F.ui(44, 900), color: inside ? INK : '#FFFFFF', align: inside ? 'right' : 'left' }); }
  });
}
// a mind map: centre + nodes around it, each node landing at its fraction
function mind(ctx, s, centre, nodes, c) {
  const cx = 960, cy = 590;
  nodes.forEach((nd) => { const a = eia(s, T(s, nd.f) - 0.1); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 5; ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(nd.x + nd.w / 2, nd.y + nd.h / 2); ctx.stroke(); ctx.restore(); } });
  zoom(ctx, bounce(s.t, 0.2), cx, cy, () => box(ctx, cx - 230, cy - 80, 460, 160, YEL, [[centre, 44, INK]]));
  nodes.forEach((nd) => zoom(ctx, bounce(s.t, T(s, nd.f)), nd.x + nd.w / 2, nd.y + nd.h / 2, () => box(ctx, nd.x, nd.y, nd.w, nd.h, nd.fill || '#FFFFFF', nd.lines)));
}
// a two-sided dilemma
function dilemma(ctx, s, c, title, L, R, mid) {
  exSlide(ctx, c, null, null); head(ctx, s, c, title);
  zoom(ctx, bounce(s.t, T(s, 0.12)), 500, 480, () => box(ctx, 72, 210, 856, 560, '#FFFFFF', L, { bar: SKY }));
  zoom(ctx, bounce(s.t, T(s, 0.42)), 1420, 480, () => box(ctx, 992, 210, 856, 560, '#FFFFFF', R, { bar: PNK }));
  if (mid) zoom(ctx, bounce(s.t, T(s, 0.72)), 960, 900, () => box(ctx, 72, 820, 1776, 170, YEL, mid));
}
// the red trap: myth struck through, then the truth
function trap(myth, truth, note) {
  return (ctx, s) => {
    exSlide(ctx, PAL.trap, null, null); exChip(ctx, 'PRELIMS TRAP', 72, 50, '#FFFFFF', '#B91C1C', 44, eia(s, 0.05));
    const tm = T(s, 0.05), tt = T(s, 0.45);
    if (myth) zoom(ctx, bounce(s.t, tm), 960, 330, () => {
      exBox(ctx, 72, 220, 1776, 220, { fill: '#FFFFFF', r: 26 }); kt(ctx, '✗  ' + myth, 120, 320, { font: F.ui(54, 900), color: '#4A0710', maxW: 1680, lh: 62 });
      const sp = span(s.t, tt - 0.3, tt + 0.1); if (sp > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(110, 330); ctx.lineTo(110 + 1690 * sp, 330); ctx.stroke(); } });
    zoom(ctx, bounce(s.t, myth ? tt + 0.15 : tm), 960, 620, () => { exBox(ctx, 72, myth ? 490 : 230, 1776, myth ? 300 : 460, { fill: GRN, r: 26 }); kt(ctx, '✓  ' + truth, 120, myth ? 590 : 340, { font: F.ui(54, 900), color: '#053B2C', maxW: 1680, lh: 66 }); });
    if (note) kt(ctx, note, 72, 900, { font: F.ui(40, 800), color: '#FFFFFF', maxW: 1776, lh: 50, alpha: eia(s, tt + 1.0) });
  };
}
// topic title card
function title(n, t, grp, sub) {
  return (ctx, s) => {
    const c = PAL[grp]; exSlide(ctx, c, null, null);
    zoom(ctx, bounce(s.t, 0.05), 300, 470, () => { ctx.beginPath(); ctx.arc(300, 470, 190, 0, 7); ctx.fillStyle = YEL; ctx.fill(); kt(ctx, String(n), 300, 540, { font: F.head(200, 900), color: c.ink, align: 'center' }); });
    exChip(ctx, { eco: 'ECONOMY', pol: 'POLITY & SOCIETY', env: 'ENVIRONMENT & HEALTH', world: 'WORLD & DEFENCE' }[grp], 560, 250, '#FFFFFF', c.ink, 40, eia(s, 0.2));
    kt(ctx, t, 560, 450, { font: F.head(92, 900), color: '#FFFFFF', maxW: 1290, lh: 104, alpha: eia(s, 0.3) });
    if (sub) kt(ctx, sub, 560, 880, { font: F.ui(48, 800), color: YEL, maxW: 1290, lh: 58, alpha: eia(s, 0.6) });
  };
}
// title cards for the open, the bridges and the close
function band(lines, sub) {
  return (ctx, s) => {
    exSlide(ctx, PAL.eco, null, null);
    lines.forEach(([t, col, z], i) => zoom(ctx, bounce(s.t, 0.2 + i * 0.35), 960, 380 + i * (z + 80), () => kt(ctx, t, 960, 380 + i * (z + 80) + z * 0.35, { font: F.head(z, 900), color: col, align: 'center', maxW: 1780 })));
    if (sub) kt(ctx, sub, 960, 900, { font: F.ui(44, 800), color: '#E9D5FF', align: 'center', alpha: eia(s, 1.2) });
  };
}

// ---------- open ----------
SCENES.S000 = band([['NOVEMBER 2nd WEEK', YEL, 116], ['13 stories · data · diagrams', '#FFFFFF', 70]], 'Decode UPSC with Mounika · English + Telugu');
SCENES.S001 = (ctx, s) => {
  exSlide(ctx, PAL.eco, null, null); kt(ctx, "TODAY'S 13 STORIES", 72, 120, { font: F.head(80, 900), color: '#FFFFFF', alpha: eia(s, 0.05) });
  const G = { eco: YEL, pol: PNK, env: GRN };
  const L = [['Inflation above 6%', 'eco'], ["Women's reservation", 'pol'], ['Delhi on Deepavali', 'env'], ['Global TB Report', 'env'], ['Record exports', 'eco'], ['World Bank poverty', 'eco'], ['Cabinet decisions', 'eco'],
    ['Battery black mass', 'eco'], ['Adaptation Gap', 'env'], ['Siang dam', 'env'], ['Ninth Schedule', 'pol'], ['IMNEX-26', 'pol'], ["Children's Day", 'pol']];
  L.forEach(([nm, g], i) => { const col = Math.floor(i / 5), row = i % 5, x = 72 + col * 610, y = 180 + row * 140;
    zoom(ctx, bounce(s.t, 0.3 + i * (s.d * 0.6 / 13)), x + 285, y + 55, () => { exBox(ctx, x, y, 570, 112, { fill: '#FFFFFF', bar: G[g], r: 22 }); kt(ctx, String(i + 1), x + 56, y + 76, { font: F.head(50, 900), color: VIO, align: 'center' }); kt(ctx, nm, x + 108, y + 74, { font: F.ui(40, 900), color: INK }); }); });
  [['Economy', YEL], ['Polity and society', PNK], ['Environment, health, world', GRN]].forEach(([t, c2], i) => exChip(ctx, t, 1290 + 0, 760 + i * 80, c2, INK, 28, eia(s, 0.4)));
};

// ---------- 1 · Inflation ----------
SCENES.S011 = title(1, 'Inflation crosses the red line', 'eco', 'October CPI: 6.09% · food: 8.94%');
SCENES.S012 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'RETAIL INFLATION · OCTOBER 2026', 'Year-on-year, new CPI series (base 2024)');
  const base = 900, unit = 62;
  vbars(ctx, s, 150, base, unit, 230, 40, [['Headline Sep', 5.54, '5.54%', '#E9D5FF'], ['Headline Oct', 6.09, '6.09%', YEL]], 0.05);
  vbars(ctx, s, 820, base, unit, 230, 40, [['Food Sep', 7.74, '7.74%', '#E9D5FF'], ['Food Oct', 8.94, '8.94%', PNK]], 0.45);
  const a = eia(s, T(s, 0.3)); if (a > 0) { const y = base - 6 * unit; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(100, y); ctx.lineTo(1400, y); ctx.stroke(); ctx.restore(); kt(ctx, '6% upper limit', 1410, y + 12, { font: F.ui(36, 900), color: '#FFB3B9', alpha: a }); }
  zoom(ctx, bounce(s.t, T(s, 0.8)), 1640, 300, () => box(ctx, 1440, 210, 410, 180, '#FFFFFF', [['Onion prices', 34, VIO], ['≈ +116% in a year', 44, INK]]));
  source(ctx, s, 'Ministry of Statistics and Programme Implementation, CPI release, 12 Nov 2026');
};
SCENES.S013 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'HOW INFLATION TARGETING WORKS', 'Reserve Bank of India Act · flexible inflation targeting since 2016');
  flow(ctx, s, [
    { f: 0.05, lines: [['TARGET', 30, VIO], ['4% ± 2%', 60, INK], ['set by the Government with the RBI', 28, INK, 700]] },
    { f: 0.35, lines: [['MONETARY POLICY COMMITTEE', 28, VIO], ['6 members', 50, INK], ['sets the repo rate', 30, INK, 700]] },
    { f: 0.58, lines: [['ALARM', 30, VIO], ['Outside the band', 40, INK], ['3 quarters in a row', 40, INK]] },
    { f: 0.78, lines: [['ACCOUNTABILITY', 30, VIO], ['RBI reports to the Government', 38, INK], ['why · and what next', 30, INK, 700]] },
  ], 300, 420);
  kt(ctx, '6% = the upper limit of the band', 72, 870, { font: F.ui(48, 900), color: YEL, alpha: eia(s, T(s, 0.2)) });
};
SCENES.S014 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHAT IT MEANS');
  mind(ctx, s, 'Food-led inflation', [
    { f: 0.08, x: 72, y: 190, w: 560, h: 170, lines: [['Supply shock', 32, VIO], ['onion · garlic', 40, INK]] },
    { f: 0.2, x: 1288, y: 190, w: 560, h: 170, lines: [['A rate hike', 32, VIO], ['cannot grow onions', 40, INK]] },
    { f: 0.35, x: 72, y: 820, w: 560, h: 190, lines: [['Quicker tools', 32, VIO], ['buffer stocks · imports · storage', 36, INK]] },
    { f: 0.6, x: 1288, y: 820, w: 560, h: 190, fill: '#FFD9DC', lines: [['Risk', 32, RED], ['spreads to wages and other goods → the Committee may act', 32, INK]] },
  ], c);
  kt(ctx, 'New CPI series · base year 2024', 960, 1050, { font: F.ui(32, 900), color: YEL, align: 'center', alpha: eia(s, T(s, 0.85)) });
};
SCENES.S015 = trap('The RBI releases CPI inflation', 'The National Statistics Office (Statistics Ministry) releases it', 'And the target is set by the Government in consultation with the RBI, not by the Monetary Policy Committee alone');

// ---------- 2 · Women's reservation and delimitation ----------
SCENES.S021 = title(2, "Women's reservation & delimitation", 'pol', 'Passed in 2023: why not in force yet?');
SCENES.S022 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE CHAIN · ARTICLE 334A');
  flow(ctx, s, [
    { f: 0.05, lines: [['106th AMENDMENT · 2023', 28, VIO], ['One-third seats for women', 40, INK], ['Lok Sabha + state assemblies', 28, INK, 700]] },
    { f: 0.4, lines: [['STEP 1', 30, VIO], ['Census', 64, INK], ['the first one after the law', 28, INK, 700]] },
    { f: 0.55, lines: [['STEP 2', 30, VIO], ['Delimitation', 54, INK], ['based on that census', 28, INK, 700]] },
    { f: 0.7, lines: [['STEP 3', 30, VIO], ['Reservation starts', 46, INK], ['lasts 15 years', 34, INK, 700]] },
  ], 260, 440, ['#FFFFFF', '#E0C3FF', '#E0C3FF', YEL]);
  kt(ctx, 'Census → Delimitation → Reservation', 960, 860, { font: F.head(64, 900), color: YEL, align: 'center', alpha: eia(s, T(s, 0.85)) });
};
SCENES.S023 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'APRIL 2026 · 131st AMENDMENT BILL · LOK SABHA');
  hbars(ctx, s, 120, 300, 4.6, 120, 120, [['For', 298, '298', GRN], ['Against', 230, '230', PNK]], 0.35, 0.1);
  const a = eia(s, T(s, 0.55)); if (a > 0) { const x = 120 + 352 * 4.6; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = YEL; ctx.lineWidth = 6; ctx.setLineDash([16, 10]); ctx.beginPath(); ctx.moveTo(x, 250); ctx.lineTo(x, 680); ctx.stroke(); ctx.restore(); kt(ctx, 'two-thirds of those voting ≈ 352', x - 20, 720, { font: F.ui(34, 900), color: YEL, align: 'right', alpha: a }); }
  zoom(ctx, bounce(s.t, T(s, 0.12)), 960, 860, () => box(ctx, 72, 790, 860, 150, '#FFFFFF', [['Lok Sabha seats', 32, VIO], ['543 → up to 850', 52, INK]]));
  zoom(ctx, bounce(s.t, T(s, 0.85)), 1400, 860, () => box(ctx, 988, 790, 860, 150, YEL, [['Next', 32, VIO], ['Special session planned (reported)', 40, INK]]));
};
SCENES.S024 = (ctx, s) => dilemma(ctx, s, PAL.pol, 'WHY THE FIGHT? SEATS FOLLOW POPULATION',
  [['States that controlled population', 40, VIO], ['(mostly southern)', 34, INK, 700], ['Fear a smaller share of Lok Sabha seats', 44, INK]],
  [['Faster-growing states', 40, VIO], ['(mostly northern)', 34, INK, 700], ['Would gain seats', 48, INK]],
  [['84th Amendment (2001): seat shares frozen until the first census after 2026', 40, INK]]);
SCENES.S025 = trap(null, 'Special majority = a majority of the total membership AND two-thirds of those present and voting', '298 is more than half the House, but less than two-thirds of those voting: so the bill failed');

// ---------- 3 · Delhi air ----------
SCENES.S031 = title(3, 'What did Delhi breathe on Deepavali?', 'env', '8 November 2026');
SCENES.S032 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'PM2.5 · MICROGRAMS PER CUBIC METRE · 24 HOURS');
  hbars(ctx, s, 120, 260, 5.6, 110, 90, [['World Health Organization guideline', 15, '15', '#CCF5EC'], ["India's national standard", 60, '60', SKY], ['Delhi on Deepavali (8 Nov)', 257, '257', RED]], 0.05, 0.15);
  zoom(ctx, bounce(s.t, T(s, 0.55)), 600, 900, () => box(ctx, 120, 830, 860, 150, '#FFFFFF', [['≈ 17 × the WHO guideline', 46, RED]]));
  zoom(ctx, bounce(s.t, T(s, 0.7)), 1400, 860, () => box(ctx, 1010, 780, 840, 230, '#FFFFFF', [['20 of 59 Delhi stations: severe', 38, INK], ['36 stations: no data at the peak hour', 36, RED]]));
  source(ctx, s, 'Centre for Research on Energy and Clean Air (as reported by The Wire); Down To Earth');
};
SCENES.S033 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'GRADED RESPONSE ACTION PLAN · THE LADDER');
  const steps = [['Stage I · Poor', 'AQI 201–300', '#FFE58A'], ['Stage II · Very poor', 'AQI 301–400', '#FFB86B'], ['Stage III · Severe', 'AQI 401–450', '#FF8A93'], ['Stage IV · Severe+', 'above 450 · stops construction, most trucks', RED]];
  steps.forEach(([a, b, col], i) => { const y = 860 - i * 175, x = 200 + i * 120, w = 1500 - i * 120;
    zoom(ctx, bounce(s.t, T(s, 0.05 + i * 0.2)), x + w / 2, y + 70, () => { exBox(ctx, x, y, w, 145, { fill: col, r: 20 }); kt(ctx, a, x + 40, y + 62, { font: F.ui(44, 900), color: INK }); kt(ctx, b, x + 40, y + 116, { font: F.ui(34, 800), color: INK, maxW: w - 80 }); }); });
  arrowD(ctx, 120, 900, 290, 0);  // (kept for layout reference)
  kt(ctx, '↑ worse air, stricter curbs', 120, 230, { font: F.ui(34, 900), color: '#FFFFFF', alpha: eia(s, T(s, 0.3)) });
};
SCENES.S034 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHY ONE NIGHT TIPS DELHI INTO "SEVERE"');
  mind(ctx, s, 'Winter smog', [
    { f: 0.08, x: 72, y: 190, w: 580, h: 190, lines: [['Calm winds + temperature inversion', 32, VIO], ['a lid on the city', 40, INK]] },
    { f: 0.4, x: 1268, y: 190, w: 580, h: 190, lines: [['Stubble fires', 32, VIO], ['Punjab · Haryana', 40, INK]] },
    { f: 0.55, x: 72, y: 820, w: 580, h: 190, lines: [['Always on', 32, VIO], ['vehicles · dust', 40, INK]] },
    { f: 0.7, x: 1268, y: 820, w: 580, h: 190, fill: '#FFD9DC', lines: [['The spark', 32, RED], ['crackers on one night', 40, INK]] },
  ], c);
};
SCENES.S035 = trap('The Central Pollution Control Board enforces the Graded Response Action Plan', 'The Commission for Air Quality Management enforces it (a statutory body, 2021 Act)');

// ---------- 4 · TB ----------
SCENES.S041 = title(4, 'WHO Global TB Report 2026', 'env', 'India: a quarter of the world’s TB');
SCENES.S042 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, "INDIA'S SHARE OF GLOBAL TB");
  [[0.25, '≈ 25%', 'of global TB cases', 380, 0.05], [0.23, '≈ 23%', 'of global TB deaths', 820, 0.2]].forEach(([v, t, l, cx, f]) => {
    const g = span(s.t, T(s, f), T(s, f) + 0.8); if (g <= 0) return; const cy = 470;
    ctx.save(); ctx.lineWidth = 60; ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(cx, cy, 170, 0, 7); ctx.stroke();
    ctx.strokeStyle = YEL; ctx.beginPath(); ctx.arc(cx, cy, 170, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * v * easeOut(g)); ctx.stroke(); ctx.restore();
    if (g >= 1) kt(ctx, t, cx, cy + 22, { font: F.ui(64, 900), color: '#FFFFFF', align: 'center' });
    kt(ctx, l, cx, cy + 260, { font: F.ui(34, 900), color: '#FFFFFF', align: 'center', alpha: g });
  });
  kt(ctx, 'TB deaths per million', 1180, 250, { font: F.ui(34, 900), color: '#FFFFFF', alpha: eia(s, T(s, 0.45)) });
  vbars(ctx, s, 1180, 820, 1.7, 290, 60, [['India 2015', 280, '≈280', '#CCF5EC'], ['India 2025', 180, '≈180', YEL]], 0.5);
  zoom(ctx, bounce(s.t, T(s, 0.8)), 1515, 980, () => box(ctx, 1180, 920, 670, 120, '#FFFFFF', [['India −38% · World −35%', 40, INK]]));
  source(ctx, s, 'WHO Global Tuberculosis Report 2026');
};
SCENES.S043 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE WORLD IN 2025');
  [['10.6 million', 'fell ill with TB', 0.05], ['1.13 million', 'died of TB', 0.25], ['−14%', 'incidence since 2015', 0.45]].forEach(([b, l, f], i) =>
    zoom(ctx, bounce(s.t, T(s, f)), 72 + i * 600 + 280, 450, () => box(ctx, 72 + i * 600, 280, 560, 340, '#FFFFFF', [[b, 72, VIO], [l, 38, INK]])));
  zoom(ctx, bounce(s.t, T(s, 0.75)), 960, 820, () => box(ctx, 200, 730, 1520, 180, YEL, [["India's new incidence estimates: not published · under review", 40, INK]]));
};
SCENES.S044 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHY IS TB SO STUBBORN?');
  mind(ctx, s, 'Tuberculosis', [
    { f: 0.05, x: 72, y: 190, w: 580, h: 170, lines: [['Spreads through air', 32, VIO], ['crowded homes', 40, INK]] },
    { f: 0.18, x: 1268, y: 190, w: 580, h: 170, lines: [['Feeds on', 32, VIO], ['undernutrition', 40, INK]] },
    { f: 0.32, x: 72, y: 800, w: 680, h: 220, fill: '#FFD9DC', lines: [['Drug-resistant TB', 32, RED], ['long, costly treatment · India among 4 countries with over half of global cases', 30, INK]] },
    { f: 0.7, x: 1168, y: 800, w: 680, h: 220, fill: '#CCF5EC', lines: [['The answer', 32, '#0F6E64'], ['test early · treat fully · nutrition (Nikshay Poshan Yojana)', 32, INK]] },
  ], c);
};
SCENES.S045 = trap(null, 'Global goal to end TB: 2030 (Sustainable Development Goals) · India’s own earlier target: 2025 (missed)', 'And the 38% fall is in TB deaths, not in TB cases');

// ---------- 5 · Exports ----------
SCENES.S051 = title(5, 'Record exports in October', 'eco', 'Best month ever: what does it really mean?');
SCENES.S052 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'MERCHANDISE EXPORTS · OCTOBER');
  vbars(ctx, s, 160, 880, 11, 300, 80, [['Oct 2025', 34.1, '$34.1 bn', '#E9D5FF'], ['Oct 2026', 49.47, '$49.47 bn', YEL]], 0.05, 0.12);
  zoom(ctx, bounce(s.t, T(s, 0.3)), 1050, 300, () => box(ctx, 940, 240, 220, 120, GRN, [['+45%', 50, INK]]));
  [['Engineering goods', '+36%', 0.5], ['Electronics', '+63%', 0.62], ['Petroleum products', '+140%', 0.74]].forEach(([a, b, f], i) =>
    zoom(ctx, bounce(s.t, T(s, f)), 1520, 470 + i * 170, () => box(ctx, 1220, 400 + i * 170, 630, 140, '#FFFFFF', [[a, 32, VIO], [b, 50, INK]])));
  source(ctx, s, 'Commerce Ministry data, 13 Nov 2026 (as reported)');
};
SCENES.S053 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE BALANCE · OCTOBER 2026 · $ BILLION');
  const rows = [['GOODS', 'exports 49.5 − imports 89.4', 'deficit ≈ 39.9', '#FFD9DC', RED, 0.05], ['SERVICES', 'exports 40.5 − imports 20.7', 'surplus ≈ 19.8', '#CCF5EC', '#0F6E64', 0.45]];
  rows.forEach(([h, m, r, fill, col, f], i) => zoom(ctx, bounce(s.t, T(s, f)), 960, 330 + i * 250, () => {
    exBox(ctx, 72, 240 + i * 250, 1776, 200, { fill, r: 24 });
    kt(ctx, h, 120, 330 + i * 250, { font: F.ui(40, 900), color: col }); kt(ctx, m, 120, 398 + i * 250, { font: F.ui(40, 800), color: INK });
    kt(ctx, r, 1800, 370 + i * 250, { font: F.ui(56, 900), color: col, align: 'right' }); }));
  zoom(ctx, bounce(s.t, T(s, 0.8)), 960, 860, () => box(ctx, 400, 780, 1120, 170, YEL, [['Overall trade deficit ≈ $20.1 billion', 52, INK]]));
};
SCENES.S054 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHAT THE NUMBERS SAY');
  flow(ctx, s, [
    { f: 0.05, lines: [['WE BUY MORE GOODS', 30, VIO], ['crude oil · electronics · gold', 40, INK]] },
    { f: 0.3, lines: [['WE EARN ON SERVICES', 30, VIO], ['software · business services', 40, INK]] },
    { f: 0.55, lines: [['OIL WORKS BOTH WAYS', 30, VIO], ['import crude → refine → export products', 38, INK]] },
  ], 300, 460, ['#FFD9DC', '#CCF5EC', '#FFFFFF']);
};
SCENES.S055 = trap(null, 'Trade balance = goods + services only · Current account = trade + remittances + income flows', 'India is the world’s largest receiver of remittances');

// ---------- 6 · World Bank poverty ----------
SCENES.S061 = title(6, 'World Bank: half a billion out of poverty?', 'eco', 'Measured by which line?');
SCENES.S062 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'POVERTY IN INDIA · 2011 → 2023', 'Share of people below each line');
  vbars(ctx, s, 150, 900, 10, 230, 40, [['$3/day 2011', 27.1, '27.1%', '#E9D5FF'], ['$3/day 2023', 2.6, '2.6%', YEL]], 0.05);
  vbars(ctx, s, 820, 900, 10, 230, 40, [['$4.20 2011', 57.7, '57.7%', '#E9D5FF'], ['$4.20 2023', 16.1, '16.1%', GRN]], 0.3);
  zoom(ctx, bounce(s.t, T(s, 0.65)), 1640, 380, () => box(ctx, 1440, 230, 410, 300, '#FFFFFF', [['International poverty line', 30, VIO], ['$2.15 → $3.00', 46, INK], ['2025 · purchasing power parity', 26, INK, 700]]));
  zoom(ctx, bounce(s.t, T(s, 0.85)), 1640, 690, () => box(ctx, 1440, 580, 410, 220, '#FFD9DC', [['Critics', 30, RED], ['part of the fall = new data and methods', 30, INK]]));
  source(ctx, s, 'World Bank Poverty and Equity Brief, October 2026');
};

// ---------- 7 · Cabinet ----------
SCENES.S071 = title(7, 'Cabinet: credit for entrepreneurs, subsidy for farmers', 'eco', 'Union Cabinet, 11 November 2026');
SCENES.S072 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'THREE DECISIONS (+ ONE MUSEUM)');
  const R = [['Stand-Up India', 'since 2016 · ₹10 lakh–₹1 crore · new enterprises of Scheduled Caste, Scheduled Tribe and women entrepreneurs', 'till 31 Mar 2031', 0.03],
    ['Credit Guarantee Fund for Micro Units', 'backs small Mudra loans · corpus ₹5,000 crore', 'till 2031', 0.33],
    ['Nutrient-based subsidy · rabi 2026–27', 'phosphatic and potassic fertilisers', '≈ ₹62,370 crore', 0.55]];
  R.forEach(([a, b, d, f], i) => zoom(ctx, bounce(s.t, T(s, f)), 960, 280 + i * 210, () => {
    exBox(ctx, 72, 200 + i * 210, 1776, 185, { fill: '#FFFFFF', bar: YEL, r: 20 });
    kt(ctx, a, 110, 262 + i * 210, { font: F.ui(40, 900), color: VIO }); kt(ctx, b, 110, 318 + i * 210, { font: F.ui(32, 800), color: INK, maxW: 1300, lh: 38 });
    kt(ctx, d, 1810, 290 + i * 210, { font: F.ui(42, 900), color: INK, align: 'right' }); }));
  kt(ctx, 'Also: ≈ ₹3,230 crore · Yuge Yugeen Bharat Museum in North and South Block', 72, 880, { font: F.ui(38, 900), color: YEL, maxW: 1776, alpha: eia(s, T(s, 0.85)) });
};
SCENES.S073 = trap('Urea is under the nutrient-based subsidy', 'Urea has its own controlled price · the nutrient-based system (since 2010) covers phosphatic and potassic fertilisers like DAP');

// ---------- 8 · Black mass ----------
SCENES.S081 = title(8, 'Why ban the export of battery “black mass”?', 'eco', 'Directorate General of Foreign Trade · 11 November 2026');
SCENES.S082 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE BATTERY LOOP');
  flow(ctx, s, [
    { f: 0.03, lines: [['Used lithium-ion battery', 36, INK]] },
    { f: 0.12, lines: [['Shredded', 44, INK]] },
    { f: 0.22, lines: [['BLACK MASS', 38, '#FFFFFF'], ['lithium · nickel · cobalt · manganese · graphite', 26, '#FFFFFF', 700]] },
    { f: 0.35, lines: [['Refining', 44, INK]] },
    { f: 0.45, lines: [['New battery materials', 36, INK]] },
  ], 300, 300, ['#FFFFFF', '#FFFFFF', '#2B2B2B', '#FFFFFF', GRN]);
  zoom(ctx, bounce(s.t, T(s, 0.6)), 960, 760, () => { exBox(ctx, 400, 680, 1120, 170, { fill: RED, r: 24 }); kt(ctx, 'EXPORT: FREE → PROHIBITED', 960, 762, { font: F.ui(52, 900), color: '#FFFFFF', align: 'center' }); kt(ctx, 'Foreign Trade (Development and Regulation) Act, 1992', 960, 818, { font: F.ui(30, 800), color: '#FFFFFF', align: 'center' }); });
};
SCENES.S083 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHY? CONNECT IT TO LAST WEEK');
  flow(ctx, s, [
    { f: 0.05, lines: [['₹2,814 crore', 52, INK], ['lithium and nickel processing plants', 30, INK, 700]] },
    { f: 0.25, lines: [['₹1,500 crore', 52, INK], ['recycling scheme (2025)', 30, INK, 700]] },
    { f: 0.45, lines: [['Black mass stays home', 44, INK], ['feeds Indian recyclers', 30, INK, 700]] },
  ], 280, 360, ['#FFFFFF', '#FFFFFF', YEL]);
  kt(ctx, 'Recycling = a mine above the ground', 960, 820, { font: F.head(66, 900), color: YEL, align: 'center', alpha: eia(s, T(s, 0.7)) });
};

// ---------- 9 · Adaptation Gap ----------
SCENES.S091 = title(9, 'UNEP Adaptation Gap: “Ready? Not.”', 'env', 'United Nations Environment Programme · 4 November 2026');
SCENES.S092 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'ADAPTATION FINANCE · $ BILLION A YEAR');
  hbars(ctx, s, 120, 300, 4.9, 130, 120, [['Needed by 2035', 305, '≈ 305', PNK], ['Received in 2024', 30, '≈ 28–32', SKY]], 0.05, 0.25);
  zoom(ctx, bounce(s.t, T(s, 0.55)), 960, 800, () => box(ctx, 120, 720, 1680, 160, '#FFFFFF', [['Even tripling by 2035 covers only 20–29% of the need', 44, INK]]));
  kt(ctx, 'Mitigation = cut emissions · Adaptation = prepare for impacts', 960, 975, { font: F.ui(40, 900), color: YEL, align: 'center', alpha: eia(s, T(s, 0.8)) });
  source(ctx, s, 'UNEP Adaptation Gap Report 2026');
};

// ---------- 10 · Siang ----------
SCENES.S101 = title(10, 'The Siang dam and the Adi protests', 'env', 'Arunachal Pradesh');
SCENES.S102 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'ONE RIVER, MANY NAMES');
  const R = [['Tibet', 'Yarlung Tsangpo'], ['Arunachal Pradesh', 'Siang (Dihang)'], ['Assam', 'Brahmaputra'], ['Bangladesh', 'Jamuna']];
  R.forEach(([p, n], i) => { const y = 200 + i * 205, f = 0.05 + i * 0.2;
    zoom(ctx, bounce(s.t, T(s, f)), 960, y + 75, () => { exBox(ctx, 520, y, 880, 150, { fill: i === 1 ? YEL : '#FFFFFF', r: 24 }); kt(ctx, p, 560, y + 60, { font: F.ui(32, 900), color: VIO }); kt(ctx, n, 560, y + 118, { font: F.ui(50, 900), color: INK }); });
    if (i < 3) arrowD(ctx, 960, y + 156, y + 200, eia(s, T(s, f + 0.18))); });
  zoom(ctx, bounce(s.t, T(s, 0.12)), 230, 280, () => box(ctx, 60, 200, 400, 170, '#FFD9DC', [['Upstream: China’s giant hydropower project', 28, INK]]));
};
SCENES.S103 = (ctx, s) => dilemma(ctx, s, PAL.env, 'SIANG UPPER MULTIPURPOSE PROJECT · THE DILEMMA',
  [['Water security', 44, VIO], ['a storage buffer against upstream China', 36, INK], ['≈ 11,000 MW planned', 40, INK]],
  [['The Adi community', 44, VIO], ['villages could be submerged', 38, INK], ['land · culture · consent', 38, INK]]);

// ---------- 11 · Ninth Schedule ----------
SCENES.S111 = title(11, 'Karnataka’s quota and the Ninth Schedule', 'pol', 'Can a law escape the courts?');
SCENES.S112 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'KARNATAKA · 2022 LAW');
  hbars(ctx, s, 120, 300, 30, 110, 110, [['Scheduled Castes: 15% → 17%', 17, '17%', PNK], ['Scheduled Tribes: 3% → 7%', 7, '7%', SKY], ['Total reservation', 56, '56%', YEL]], 0.05, 0.15);
  const a = eia(s, T(s, 0.5)); if (a > 0) { const x = 120 + 50 * 30; ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.setLineDash([16, 10]); ctx.beginPath(); ctx.moveTo(x, 250); ctx.lineTo(x, 760); ctx.stroke(); ctx.restore(); kt(ctx, '50% ceiling', x + 16, 270, { font: F.ui(34, 900), color: '#FFB3B9', align: 'left', alpha: a }); }
  zoom(ctx, bounce(s.t, T(s, 0.7)), 960, 930, () => box(ctx, 120, 860, 1680, 150, '#FFFFFF', [['October 2026: High Court strikes down the hike → state seeks the Ninth Schedule', 38, INK]]));
};
SCENES.S113 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE NINTH SCHEDULE · TIMELINE');
  const E = [['1951', 'First Amendment adds the Ninth Schedule + Article 31B (land reforms)', 0.03], ['1992', 'Indra Sawhney: 50% ceiling', 0.3], ['1994', "76th Amendment: Tamil Nadu's 69% placed in it", 0.45], ['2007', 'I.R. Coelho: laws added after 24 April 1973 open to basic-structure review', 0.65]];
  const a0 = eia(s, 0.2); if (a0 > 0) { ctx.save(); ctx.globalAlpha *= a0; ctx.strokeStyle = YEL; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(120, 420); ctx.lineTo(1800, 420); ctx.stroke(); ctx.restore(); }
  E.forEach(([y, t, f], i) => { const x = 120 + i * 440, k = bounce(s.t, T(s, f));
    zoom(ctx, k, x + 200, 600, () => { ctx.beginPath(); ctx.arc(x + 30, 420, 22, 0, 7); ctx.fillStyle = YEL; ctx.fill(); kt(ctx, y, x, 370, { font: F.head(64, 900), color: '#FFFFFF' }); box(ctx, x, 470, 400, 380, '#FFFFFF', [[t, 34, INK]]); }); });
};
SCENES.S114 = trap('A state legislature can place its own law in the Ninth Schedule', 'Only Parliament can, by a constitutional amendment', 'And after I.R. Coelho (2007), such laws can still be tested against the basic structure');

// ---------- 12 · IMNEX ----------
SCENES.S121 = title(12, 'IMNEX-26 and the exercise trap', 'world', 'Visakhapatnam · 10–14 November 2026');
SCENES.S122 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'MILITARY EXERCISES · WHO, WHICH SERVICE');
  const R = [['IMNEX', 'India – Myanmar', 'Navy · 8th edition, Visakhapatnam (INS Rana, INS Sumedha)', 0.03, YEL], ['SLINEX', 'India – Sri Lanka', 'Navy', 0.5, '#FFFFFF'], ['Mitra Shakti', 'India – Sri Lanka', 'Army', 0.62, '#FFFFFF'], ['Malabar', 'India, United States, Japan, Australia', 'Navy', 0.74, '#FFFFFF']];
  R.forEach(([a, b, d, f, fill], i) => zoom(ctx, bounce(s.t, T(s, f)), 960, 280 + i * 190, () => {
    exBox(ctx, 72, 200 + i * 190, 1776, 165, { fill, r: 20 });
    kt(ctx, a, 110, 300 + i * 190, { font: F.ui(48, 900), color: '#2563EB' }); kt(ctx, b, 560, 270 + i * 190, { font: F.ui(38, 900), color: INK }); kt(ctx, d, 560, 326 + i * 190, { font: F.ui(32, 800), color: '#6B21A8', maxW: 1240 }); }));
};

// ---------- 13 · Days ----------
SCENES.S131 = title(13, "Children's Day and the “which day” trap", 'pol', '14 November');
SCENES.S132 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'FOUR DAYS · DO NOT MIX THEM UP');
  const D = [['14 Nov', "Children's Day (India)", "Jawaharlal Nehru's birthday", YEL, 0.03], ['20 Nov', "Universal Children's Day", 'United Nations', '#FFFFFF', 0.3], ['11 Nov', 'National Education Day', 'Maulana Abul Kalam Azad', YEL, 0.5], ['24 Jan', 'International Day of Education', 'United Nations', '#FFFFFF', 0.75]];
  D.forEach(([d, n, w, fill, f], i) => { const x = 72 + (i % 2) * 900, y = 220 + Math.floor(i / 2) * 400;
    zoom(ctx, bounce(s.t, T(s, f)), x + 420, y + 170, () => box(ctx, x, y, 840, 340, fill, [[d, 64, VIO], [n, 42, INK], [w, 32, INK, 700]])); });
};

// ---------- practice MCQs ----------
const MCQS = [
 { n: 1, kind: 'howmany', stem: 'Consider the following statements:', items: ['Consumer price inflation data is released by the Reserve Bank of India.', 'Under flexible inflation targeting, 6% is the upper tolerance limit.', 'If average inflation stays outside the band for three consecutive quarters, the RBI must report to the Government.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [0, 1, 1], why: 'The Statistics Ministry (National Statistics Office) releases CPI data.' },
 { n: 2, kind: 's12', stem: 'Which one of the following is correct in respect of the statements below?', items: ['Statement-I: The 131st Amendment Bill failed in April 2026 though more members voted for it than against it.', 'Statement-II: A constitutional amendment needs a majority of the total membership and two-thirds of those present and voting.'], opts: '(a) Both correct, II explains I   (b) Both correct, II does not explain I   (c) Only I correct   (d) Only II correct', ans: '(a) Both correct, and II explains I', ok: [1, 1], why: '298 was short of two-thirds of those voting.' },
 { n: 3, kind: 'howmany', stem: 'Consider the following statements:', items: ['An Air Quality Index of 401–450 falls in the "severe" category.', "India's 24-hour standard for PM2.5 is 60 micrograms per cubic metre.", 'The Graded Response Action Plan is enforced by the Commission for Air Quality Management.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(c) All three', ok: [1, 1, 1], why: 'All three are correct.' },
 { n: 4, kind: 'single', stem: 'Which one of the following about TB is correct (WHO Global TB Report 2026)?', items: ["(a) India's TB cases fell 38% since 2015.", "(b) India accounts for about a quarter of the world's TB cases.", '(c) The Sustainable Development Goal to end TB is 2025.', '(d) India is not among the high multidrug-resistant TB countries.'], opts: '', ans: '(b)', ok: [0, 1, 0, 0], why: 'The 38% fall is in deaths, not cases; the SDG year is 2030.' },
 { n: 5, kind: 'howmany', stem: 'Consider the following statements about October 2026:', items: ["India's merchandise exports reached a record monthly high.", 'India ran a surplus in goods trade.', 'A surplus in services narrowed the overall trade deficit.', 'India is the largest receiver of remittances in the world.'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(c) Only three', ok: [1, 0, 1, 1], why: 'India ran a goods trade deficit of about $40 billion.' },
 { n: 6, kind: 'single', stem: 'The global Multidimensional Poverty Index is published by:', items: ['(a) the World Bank', '(b) the United Nations Development Programme with Oxford', '(c) the International Monetary Fund', '(d) NITI Aayog'], opts: '', ans: '(b)', ok: [0, 1, 0, 0], why: 'NITI Aayog publishes the national index; the World Bank measures income and spending.' },
 { n: 7, kind: 'howmany', stem: 'Consider the following statements:', items: ['Stand-Up India supports new enterprises with loans of ₹10 lakh to ₹1 crore.', 'Urea is covered under the nutrient-based subsidy.', 'The Credit Guarantee Fund for Micro Units backs small Mudra loans.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 0, 1], why: 'Urea has its own controlled price.' },
 { n: 8, kind: 'single', stem: 'The Directorate General of Foreign Trade works under the Ministry of:', items: ['(a) Mines', '(b) Commerce and Industry', '(c) Environment, Forest and Climate Change', '(d) Micro, Small and Medium Enterprises'], opts: '', ans: '(b)', ok: [0, 1, 0, 0], why: 'It banned black-mass exports under the 1992 foreign trade law.' },
 { n: 9, kind: 'pairs', stem: 'How many of the following pairs (report — publisher) are correctly matched?', items: ['Emissions Gap Report — United Nations Environment Programme', 'Adaptation Gap Report — United Nations Environment Programme', 'Global Tuberculosis Report — World Health Organization'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(c) All three', ok: [1, 1, 1], why: 'All three are correctly matched.' },
 { n: 10, kind: 'pairs', stem: 'How many of the following pairs (name of the river — region) are correctly matched?', items: ['Yarlung Tsangpo — Tibet', 'Siang — Arunachal Pradesh', 'Jamuna — Assam'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 1, 0], why: 'The Jamuna is the name in Bangladesh; in Assam it is the Brahmaputra.' },
 { n: 11, kind: 'howmany', stem: 'Consider the following statements about the Ninth Schedule:', items: ['It was added by the First Amendment in 1951.', 'Laws placed in it are fully immune from judicial review.', 'A state legislature can place its own law in it.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(a) Only one', ok: [1, 0, 0], why: 'I.R. Coelho (2007) allows basic-structure review; only Parliament can add laws.' },
 { n: 12, kind: 'pairs', stem: 'How many of the following pairs (exercise — partner) are correctly matched?', items: ['IMNEX — Myanmar', 'SLINEX — Sri Lanka', 'Mitra Shakti — Sri Lanka', 'Malabar — India, United States, Japan, Australia'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(d) All four', ok: [1, 1, 1, 1], why: 'All four are correctly matched.' },
 { n: 13, kind: 'howmany', stem: 'Consider the following statements:', items: ["India celebrates Children's Day on Jawaharlal Nehru's birthday, 14 November.", "The United Nations' Universal Children's Day is on 20 November.", 'National Education Day marks the birthday of Dr Sarvepalli Radhakrishnan.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 1, 0], why: 'National Education Day is for Maulana Abul Kalam Azad.' },
];
function mcqItems(ctx, s, m, answer) {
  let y = 320; const fs = m.items.length > 3 ? 38 : 42;
  m.items.forEach((t, i) => {
    const lab = (m.kind === 'single' || m.kind === 's12') ? t : (i + 1) + '. ' + t;
    ctx.save(); ctx.font = F.ui(fs, 800); const n = wrap(ctx, lab, 1600).length; ctx.restore();
    const h = 40 + n * (fs + 12), a = answer ? 1 : eia(s, 0.25 + i * 0.25), ok = m.ok[i];
    exBox(ctx, 72, y, 1776, h, { fill: answer ? (ok ? '#D1FAE5' : '#FFE4E6') : '#FFFFFF', bar: answer ? (ok ? GRN : RED) : YEL, r: 20, alpha: a });
    kt(ctx, lab, 112, y + 20 + fs, { font: F.ui(fs, 800), color: INK, maxW: 1600, lh: fs + 12, alpha: a });
    if (answer) kt(ctx, ok ? '✓' : '✗', 1800, y + h / 2 + 22, { font: F.ui(60, 900), color: ok ? '#059669' : RED, align: 'center' });
    y += h + 18;
  });
  return y;
}
function mcqScene(m, answer) {
  return (ctx, s) => {
    exSlide(ctx, PAL.eco, null, null);
    exChip(ctx, (answer ? 'ANSWER · TOPIC ' : 'PRACTICE MCQ · TOPIC ') + m.n, 72, 40, answer ? GRN : YEL, INK, 38, eia(s, 0.05));
    kt(ctx, m.stem, 72, 200, { font: F.head(48, 900), color: '#FFFFFF', maxW: 1776, lh: 56 });
    const y = mcqItems(ctx, s, m, answer);
    if (!answer) {
      if (m.opts) kt(ctx, m.opts, 72, Math.max(y + 50, 930), { font: F.ui(40, 900), color: YEL, maxW: 1600, alpha: eia(s, 1.2) });
      if (s.hold) { const p = span(s.t, s.hold.at, s.hold.at + s.hold.dur);
        if (p > 0 && p < 1) { ctx.save(); ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(1780, 960, 62, 0, 7); ctx.stroke(); ctx.strokeStyle = YEL; ctx.beginPath(); ctx.arc(1780, 960, 62, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (1 - p)); ctx.stroke(); ctx.restore();
          kt(ctx, String(Math.ceil(s.hold.dur * (1 - p))), 1780, 984, { font: F.head(62, 900), color: '#FFFFFF', align: 'center' }); } }
    } else {
      ctx.save(); ctx.font = F.ui(34, 800); const wl = wrap(ctx, m.why, 1700).length; ctx.restore();
      const bh = 110 + wl * 42, yy = Math.min(Math.max(y + 20, 860), 1050 - bh);
      zoom(ctx, bounce(s.t, 0.2), 960, yy + bh / 2, () => { exBox(ctx, 72, yy, 1776, bh, { fill: YEL, r: 24 }); kt(ctx, 'Answer: ' + m.ans, 112, yy + 70, { font: F.ui(46, 900), color: INK, maxW: 1700 }); kt(ctx, m.why, 112, yy + 125, { font: F.ui(34, 800), color: '#4C1D95', maxW: 1700, lh: 42 }); });
    }
  };
}
MCQS.forEach(m => { const id = 'S' + String(m.n).padStart(2, '0'); SCENES[id + '8'] = mcqScene(m, false); SCENES[id + '9'] = mcqScene(m, true); });

// ---------- bridges, Mains, close ----------
SCENES.S900 = band([['3 DONE · 10 TO GO', YEL, 116], ['From the air we breathe to our health', '#FFFFFF', 60]]);
SCENES.S901 = band([['9 DONE!', YEL, 130], ['Now rivers, rights and the world', '#FFFFFF', 60]]);
SCENES.S992 = (ctx, s) => {
  exSlide(ctx, PAL.pol, null, null); exChip(ctx, "THIS WEEK'S MAINS QUESTION", 72, 40, YEL, INK, 40, eia(s, 0.05));
  zoom(ctx, bounce(s.t, T(s, 0.05)), 960, 420, () => { exBox(ctx, 72, 180, 1776, 500, { fill: '#FFFFFF', bar: YEL, r: 26 }); kt(ctx, 'GS-2 · 15 marks · 250 words', 120, 260, { font: F.ui(42, 900), color: VIO });
    kt(ctx, 'Should Lok Sabha seat shares stay frozen to protect states that controlled population? Discuss with reference to women’s reservation and delimitation.', 120, 360, { font: F.ui(54, 900), color: INK, maxW: 1680, lh: 68 }); });
  kt(ctx, 'Write it · post it in the comments', 72, 800, { font: F.ui(48, 900), color: YEL, alpha: eia(s, T(s, 0.5)) });
  kt(ctx, 'All 13 MCQs with answers: practice sheet in the description', 72, 900, { font: F.ui(40, 800), color: '#FFFFFF', maxW: 1776, alpha: eia(s, T(s, 0.75)) });
};
SCENES.S999 = band([['13 STORIES · DATA · DIAGRAMS', YEL, 100], ['Share with one friend · Subscribe', '#FFFFFF', 64]], 'A new class every Sunday, 6 PM');
