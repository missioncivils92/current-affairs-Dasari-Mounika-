// Scenes for the sample Deep Dive "The Oleshky Truce" (weeks/2026-W44/sample-oleshky), v2.
// Each scene: SCENES.Sxx = (ctx, s) with s = {t, d, p, w(word), beat(i), hold, text}; set s.credit for on-screen credits.
// Builds are keyed to the spoken word with s.w("word") (the cue words are marked → "word" in the script's visual cells).
const P = {
  kherson: [32.617, 46.635], oleshky: [32.717, 46.617], dam: [33.370, 46.777], znpp: [34.586, 47.508], enerhodar: [34.656, 47.497],
  kalanchak: [33.293, 46.255], kerch: [36.47, 45.36], kerchStrait: [36.55, 45.22],
  bosphorus: [29.06, 41.12], dardanelles: [26.40, 40.20], marmara: [28.2, 40.75], azov: [36.6, 46.15], kyiv: [30.52, 50.45],
  source: [33.40, 55.87], blackSea: [34.0, 43.3], reservoir: [34.1, 47.3],
};
const CANAL = [[33.37, 46.77], [33.40, 46.60], [33.33, 46.40], [33.29, 46.25], [33.69, 46.10], [34.05, 45.85], [34.39, 45.71], [35.2, 45.45], [35.9, 45.36]];
const DNIPRO = ['Dnipro', 'Dnepre', 'Dnepr'];
const SAT = (n) => ({ img: A[n], meta: A[n + '_meta'] });
const COPERNICUS = (n) => A[n + '_meta'].credit + ' · processed by Decode UPSC';
const TERRAIN = 'Elevation: Terrain Tiles (Mapzen/AWS) · Boundaries: Natural Earth (India POV), DataMeet';
const NOW_SAT = () => (A.oleshky_2026 ? 'oleshky_2026' : 'oleshky_before');   // 2026 imagery when it has been fetched
const fmt = (v) => Math.round(v).toLocaleString('en-IN');

function baseMap(ctx, proj, o = {}) {
  bg(ctx, { inner: '#1A1F26', outer: '#0F1216' });
  raster(ctx, proj, A.wide, A.wide_meta);
  raster(ctx, proj, A.region, A.region_meta, { feather: 160 });
  if (o.detail !== false) raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta, { alpha: o.detailAlpha ?? 1, feather: 220 });
  countries(ctx, proj, { stroke: 'rgba(255,255,255,0.30)', lw: 1.3, highlight: o.highlight });
  for (const l of A.geo.lakes) geo(ctx, proj, l.geom, { fill: 'rgba(74,144,194,0.55)' });
}
// camera keyframes keyed to times: [[t, {lon,lat,zoom}], ...] with eased moves of `dur` seconds starting at each t
function camPath(t, keys, dur = 1.2) {
  let cam = keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t > keys[i][0]) cam = camLerp(cam, keys[i][1], span(t, keys[i][0], keys[i][0] + (keys[i][2] ?? dur)));
  return cam;
}
function heading(ctx, s, a = 1, y = 170) { text(ctx, s, 140, y, { font: F.ui(32, 800), color: C.yellow, alpha: a }); }

// ---------------- COLD OPEN ----------------
SCENES.S01 = (ctx, s) => {
  const cam = camLerp({ lon: 32.80, lat: 46.66, zoom: 10.65 }, { lon: 32.72, lat: 46.625, zoom: 10.82 }, s.p);   // push-in ≈ 1.00 → 1.12
  const proj = camera(cam.lon, cam.lat, cam.zoom), sat = NOW_SAT();
  baseMap(ctx, proj, { detailAlpha: 1 });
  raster(ctx, proj, A[sat], A[sat + '_meta'], { alpha: 0.9, filter: 'brightness(0.78) saturate(0.75)', feather: 140 });
  rivers(ctx, proj, DNIPRO, { color: 'rgba(74,144,194,0.85)', lw: 4 });
  ctx.fillStyle = 'rgba(5,8,14,0.24)'; ctx.fillRect(0, 0, W, H);          // night, but readable on a phone
  pin(ctx, proj, P.kherson, 'Kherson', { alpha: 0.85 * appear(s.t, s.w('Dnipro')), color: C.white, dx: -18, sub: 'right bank' });
  const ol = appear(s.t, s.w('Oleshky') - 0.4);
  pin(ctx, proj, P.oleshky, 'OLESHKY', { alpha: Math.max(ol, 0.9 * appear(s.t, 1.0)), pulse: clamp(s.t / 2.2, 0, 1.999) % 1, sub: ol > 0 ? 'left bank' : '', font: F.ui(40, 800), dx: 20, dy: 44 });
  if (s.t > 4.4) pin(ctx, proj, P.oleshky, null, { pulse: (s.t - 4.4) / 2.2 % 1, alpha: 1 - span(s.t, 8.8, 9.2) });   // second pulse
  const sec = Math.floor(clamp(s.t / 3.5) * 59);
  card(ctx, 1420, 110, 420, 130, { fill: 'rgba(15,18,22,0.85)', stroke: 'rgba(255,255,255,0.12)' });
  text(ctx, sec < 59 ? `02:59:${String(sec).padStart(2, '0')}` : '03:00:00', 1630, 185, { font: F.mono(56, 700), align: 'center', color: sec < 59 ? C.white : C.yellow });
  text(ctx, 'KYIV · TUE 27 OCT 2026', 1630, 222, { font: F.ui(24, 800), align: 'center', color: C.dim });
  text(ctx, 'the guns go quiet — only here', 960, 930, { font: F.hand(60), align: 'center', color: C.yellow, alpha: appear(s.t, s.w('only around')), shadow: 12 });
  vignette(ctx, 0.6); s.credit = COPERNICUS(sat) + ' · ' + TERRAIN;
};
SCENES.S02 = (ctx, s) => {
  desk(ctx, s.t, { lines: [{ s: 'A truce in one town?' }, { s: '→ ask the better question', gap: 90 }], write: span(s.t, s.w('note') - 0.3, s.w('better') + 0.8) });
  lowerThird(ctx, 'GS-2 · International Relations   ·   GS-1 · Geography', appear(s.t, 0.8));
};
SCENES.S03 = (ctx, s) => {
  bg(ctx); text(ctx, 'CENTRAL QUESTION', 960, 280, { font: F.ui(30, 800), align: 'center', color: C.yellow, alpha: appear(s.t, 0) });
  revealWords(ctx, 'Why can a ceasefire hold in one town — and what does that tell India?', 960, 410, span(s.t, 0.2, s.w('That is') - 0.3), { font: F.head(76), maxW: 1500, align: 'center', lh: 96, highlight: ['one', 'town', 'India?'] });
  const items = [['a river', 'river'], ['a destroyed dam', 'dam'], ['a canal', 'canal'], ['a nuclear plant', 'nuclear'], ['New Delhi', 'Delhi']];
  ctx.font = F.ui(32, 800); const ws = items.map(([it]) => ctx.measureText(it).width + 36), gap = 26;
  let px = 960 - (ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2;
  items.forEach(([it, cw], i) => {
    const k = pop(s.t, s.w(cw) - 0.1);
    ctx.save(); ctx.translate(px + ws[i] / 2, 790); ctx.scale(k || 0.001, k || 0.001); ctx.translate(-(px + ws[i] / 2), -790);
    pill(ctx, it, px, 765, { alpha: clamp(k), font: F.ui(32, 800), h: 54, fill: i === 4 ? C.yellow : 'rgba(255,255,255,0.14)', color: i === 4 ? C.slate : C.white });
    ctx.restore(); px += ws[i] + gap;
  });
  vignette(ctx);
};
// "Pause and answer": the ring stays hidden while she speaks, then counts down inside the row's hold (real silence)
function pauseCard(ctx, s, q, o = {}) {
  bg(ctx);
  const k = appear(s.t, 0);
  card(ctx, 220, 230, 1480, 560, { fill: 'rgba(38,43,51,0.96)', stroke: C.yellow, lw: 3, alpha: k });
  pill(ctx, 'PAUSE AND ANSWER', 290, 285, { alpha: k, font: F.ui(30, 800), h: 54 });
  text(ctx, q, 290, 440, { font: F.head(58), maxW: 1020, lh: 74, alpha: k });
  const h = s.hold;
  if (h) {
    const ra = appear(s.t, h.at - 0.2, 0.4) * (1 - span(s.t, h.at + h.dur + 0.6, h.at + h.dur + 1.2));
    const cd = clamp((s.t - h.at) / h.dur), left = Math.ceil(h.dur - cd * h.dur);
    ctx.save(); ctx.globalAlpha = ra; ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(1480, 520, 120, 0, 7); ctx.stroke();
    ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(1480, 520, 120, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.stroke(); ctx.restore();
    text(ctx, String(clamp(left, 0, h.dur)), 1480, 560, { font: F.head(120), align: 'center', alpha: ra, color: C.yellow });
    text(ctx, 'think…', 1480, 690, { font: F.hand(44), align: 'center', alpha: ra * (s.t > h.at ? 1 : 0), color: C.dim });
  }
  if (o.extra) o.extra(k);
  vignette(ctx);
}
SCENES.S04 = (ctx, s) => pauseCard(ctx, s, 'Does the Montreux Convention govern warships passing through the Kerch Strait?', {
  extra: () => pill(ctx, 'trap ahead · answer later in this class', 290, 700, { alpha: appear(s.t, s.w('trap')), fill: C.red, color: C.white, font: F.ui(28, 800), h: 50 }),
});

// ---------------- UPDATE DESK ----------------
SCENES.S05 = (ctx, s) => {
  desk(ctx, s.t, { lamp: 0.9 });
  const t0 = s.w('Last week') - 0.2, out = ease(span(s.t, t0, t0 + 1.4));        // W43 slides out of the archive shelf
  ['W40', 'W41', 'W42', 'W43'].forEach((w, i) => {
    const x = 600 + i * 110, y = 170, isLast = i === 3;
    const dy = isLast ? out * 230 : 0, dx = isLast ? out * 280 : 0, fade = isLast ? 1 - span(s.t, t0 + 1.3, t0 + 1.8) : 1;
    card(ctx, x + dx, y + dy, 90, 300, { fill: ['#3B4A5A', '#4A3B3B', '#3B4A40', '#5A4A2A'][i], stroke: 'rgba(255,255,255,0.15)', r: 6, alpha: fade });
    text(ctx, w, x + dx + 45, y + dy + 270, { font: F.mono(26, 700), align: 'center', color: C.paper, alpha: fade });
  });
  ctx.save(); ctx.fillStyle = '#3A3026'; ctx.fillRect(560, 475, 520, 16); ctx.restore();
  const op = appear(s.t, t0 + 1.4, 0.8);
  if (op > 0) {
    card(ctx, 1060, 110, 760, 470, { fill: C.paper, alpha: op, r: 8 });
    ctx.save(); ctx.globalAlpha = op; rr(ctx, 1080, 130, 720, 300, 6); ctx.clip();
    const proj = d3.geoMercator().fitExtent([[1080, 130], [1800, 430]], { type: 'MultiPoint', coordinates: [[28, 49.5], [40, 43.8]] });
    for (const c of A.geo.countries) geo(ctx, proj, c.geom, { fill: '#D9CFBA', stroke: '#8C7F66', lw: 1 });
    rivers(ctx, proj, DNIPRO, { color: '#4A7FB0', lw: 2.5 });
    pin(ctx, proj, P.oleshky, 'Oleshky', { color: '#C0392B', labelColor: '#2A2A2A', font: F.ui(26, 800), r: 8 });
    ctx.restore();
    text(ctx, 'W43 · Russia–Ukraine: why no peace yet?', 1095, 485, { font: F.hand(46), color: '#8A6400', alpha: op });
    text(ctx, 'truce announced →', 1095, 540, { font: F.hand(42), color: '#8A6400', alpha: op * appear(s.t, s.w('announced')) });
    text(ctx, 'this week: begun ✓', 1440, 540, { font: F.hand(42), color: '#B03A2E', alpha: op * appear(s.t, s.w('begun')) });
  }
  pill(ctx, '▶  Card: W43 Short', 1480, 610, { alpha: appear(s.t, s.w('Short')), fill: 'rgba(255,255,255,0.16)', color: C.white, font: F.ui(26, 800), h: 50 });
};
SCENES.S06 = (ctx, s) => {
  bg(ctx);
  const a1 = appear(s.t, 0.1), a2 = appear(s.t, s.w('General Staff') - 0.2);
  card(ctx, 100, 220, 760, 560, { stroke: 'rgba(255,255,255,0.2)', alpha: a1 });
  text(ctx, 'THEN', 150, 300, { font: F.ui(30, 800), color: C.dim, alpha: a1 });
  text(ctx, 'Announced by the White House for 29 October', 150, 400, { font: F.head(48), maxW: 660, lh: 62, alpha: a1 });
  arrow(ctx, [[880, 500], [1000, 500]], span(s.t, a2 > 0 ? s.w('General Staff') - 0.6 : 99, s.w('General Staff')), { lw: 6 });
  card(ctx, 1020, 220, 820, 560, { stroke: C.yellow, lw: 3, alpha: a2 });
  text(ctx, 'NOW', 1070, 300, { font: F.ui(30, 800), color: C.yellow, alpha: a2 });
  [['Russia\'s General Staff: from 27 Oct, 04:00 Moscow (03:00 Kyiv)', 'General Staff'], ['Ukraine: in effect from 27 Oct', 'took effect'], ['Humanitarian only', 'humanitarian'], ['No end date announced', 'end date']].forEach(([l, cw], i) =>
    text(ctx, '• ' + l, 1070, 380 + i * 92, { font: F.ui(32, 700), maxW: 730, lh: 38, alpha: appear(s.t, s.w(cw) - 0.15) }));
  vignette(ctx);
};

// ---------------- DEEP DIVE: what was agreed ----------------
SCENES.S07 = (ctx, s) => {
  bg(ctx); heading(ctx, 'WHAT WAS AGREED', 1, 175);
  const tp = s.w('seventeen');
  const rows = [['PURPOSE', 'Food · medicine · water', 'food', C.yellow], ['', '+ preparing an evacuation', 'evacuation', C.yellow],
    ['PEOPLE', `≈ ${fmt(roll(1700, s.t, tp))}–${fmt(roll(2000, s.t, tp))} residents, mostly elderly`, 'seventeen', C.yellow],
    ['MEDIATION', 'US First Lady (per the White House)', 'White House', C.blue], ['', 'Vatican role: reported', 'Vatican', C.blue]];
  rows.forEach(([k, v, cw, col], i) => {
    const a = appear(s.t, s.w(cw) - 0.25), y = 220 + i * 150;
    card(ctx, 140, y + (1 - a) * 30, 1640, 124, { accent: col, alpha: a });
    text(ctx, k, 190, y + 76, { font: F.ui(28, 800), color: C.dim, alpha: a });
    text(ctx, v, 500, y + 80, { font: F.head(46), alpha: a, color: i === 2 && s.t > tp ? C.white : C.white });
  });
  s.credit = 'Sources: White House (23 Oct 2026); Reuters; Kyiv Independent; CNN'; vignette(ctx, 0.4);
};
SCENES.S08 = (ctx, s) => {
  bg(ctx);
  const l = ease(span(s.t, s.w('Lubinets') - 0.6, s.w('Lubinets') + 0.4)), r = ease(span(s.t, s.w('Lantratova') - 0.6, s.w('Lantratova') + 0.4));
  const meet = ease(span(s.t, s.w('non-military') - 0.5, s.w('non-military') + 0.6));
  [['UKRAINE', 'Dmytro Lubinets', -1, l], ['RUSSIA', 'Yana Lantratova', 1, r]].forEach(([c, n, side, k]) => {
    const x = 960 + side * lerp(380, 350, meet) - 330 + side * (1 - k) * 900;
    card(ctx, x, 280, 660, 300, { stroke: 'rgba(255,255,255,0.2)', alpha: k });
    text(ctx, c, x + 50, 355, { font: F.ui(28, 800), color: C.dim, alpha: k });
    text(ctx, n, x + 50, 445, { font: F.head(58), alpha: k });
    text(ctx, 'Human-rights commissioner', x + 50, 515, { font: F.ui(30, 600), color: C.dim, alpha: k });
  });
  text(ctx, 'non-military teams · transport to Ukraine or to Russia', 960, 740, { font: F.hand(56), align: 'center', color: C.yellow, alpha: meet });
  vignette(ctx);
};

// ---------------- key terms ----------------
SCENES.S09 = (ctx, s) => {
  bg(ctx); heading(ctx, 'KNOW THE LADDER', 1, 160);
  const R = [['Humanitarian pause', 'one place · short · for aid and evacuation', 'humanitarian pause'], ['Ceasefire', 'wider · political', 'ceasefire'],
    ['Armistice', 'stops the fighting · dispute unsettled · e.g. Korea, 1953', 'armistice'], ['Peace agreement', 'ends the conflict', 'peace agreement']];
  R.forEach(([h, sub, cw], i) => {
    const y = 880 - i * 175, x = 300 + i * 70, w = 1320 - i * 140, a = appear(s.t, s.w(cw) - 0.2);
    card(ctx, x, y - 125, w, 140, { fill: `rgba(38,43,51,${0.35 + 0.6 * a})`, stroke: i === 0 && a > 0 ? C.yellow : 'rgba(255,255,255,0.22)', lw: i === 0 ? 3 : 2 });   // empty rung from frame one
    text(ctx, String(i + 1), x + 30, y - 40, { font: F.mono(34, 700), color: C.faint });
    text(ctx, h, x + 90, y - 58, { font: F.head(50), alpha: a, color: i === 0 ? C.yellow : C.white });
    text(ctx, sub, x + 90, y - 12, { font: F.ui(28, 600), color: '#C9CFD6', alpha: a });
  });
  const o = pop(s.t, s.w('bottom') - 0.2);
  if (o > 0) { pill(ctx, 'OLESHKY IS HERE', 1500, 790, { alpha: clamp(o), fill: C.red, color: C.white, font: F.ui(30, 800), h: 54 }); arrow(ctx, [[1500, 815], [1390, 800]], clamp(o), { color: C.red, lw: 5 }); }
  vignette(ctx);
};
SCENES.S10 = (ctx, s) => {
  desk(ctx, s.t, {
    lines: [{ s: 'Green corridor ≠ traffic solved' }], write: span(s.t, s.w('nobody') - 0.5, s.w('solved') + 0.4),
    sketch: (g) => {               // ink sketch: four lanes of traffic, one lane clears, the ambulance moves through
      const clr = ease(span(s.t, s.w('one road') - 0.3, s.w('one road') + 0.8));
      g.save(); g.strokeStyle = '#7A5A00'; g.lineWidth = 3;
      for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(-500, -40 + k * 60); g.lineTo(500, -40 + k * 60); g.stroke(); }
      for (let lane = 0; lane < 3; lane++) for (let k = 0; k < 9; k++) {
        if (lane === 1) { g.globalAlpha = 1 - clr; g.strokeRect(-470 + k * 105, -30 + lane * 60 - clr * 30 * (k % 2 ? 1 : -1), 70, 40); g.globalAlpha = 1; continue; }
        g.strokeRect(-470 + k * 105, -30 + lane * 60, 70, 40);
      }
      if (clr > 0.5) {
        const ax = -480 + ((s.t - s.w('one road')) * 220 % 1000); g.fillStyle = '#E9E2D2'; g.fillRect(ax, 32, 80, 40); g.strokeRect(ax, 32, 80, 40);
        g.strokeStyle = '#C0392B'; g.lineWidth = 5; g.beginPath(); g.moveTo(ax + 40, 40); g.lineTo(ax + 40, 64); g.moveTo(ax + 28, 52); g.lineTo(ax + 52, 52); g.stroke();
      }
      g.restore();
    },
  });
};
SCENES.S36 = (ctx, s) => {
  bg(ctx);
  pill(ctx, 'FOURTH GENEVA CONVENTION (1949) · ARTICLE 17', 140, 150, { font: F.ui(28, 800), h: 52 });
  const hi = [...(s.t > s.w('local agreements') ? ['local', 'agreements'] : []), ...(s.t > s.w('aged') ? ['aged', 'persons,'] : [])];
  card(ctx, 140, 250, 1640, 560, { accent: C.yellow });
  revealWords(ctx, '“The Parties to the conflict shall endeavour to conclude local agreements for the removal from besieged or encircled areas, of wounded, sick, infirm, and aged persons, children and maternity cases…”',
    200, 360, span(s.t, 0.2, s.w('asks') + 0.5), { font: F.head(50), maxW: 1520, lh: 72, highlight: hi });
  text(ctx, 'in the spirit of Article 17 → Oleshky', 960, 900, { font: F.hand(56), align: 'center', color: C.yellow, alpha: appear(s.t, s.w('spirit')) });
  s.credit = 'Source: ICRC, Treaties and States Parties database'; vignette(ctx, 0.35);
};

// ---------------- geography ----------------
SCENES.S11 = (ctx, s) => {
  // full-frame India (uncropped) → fly to the Black Sea → draw the Dnipro from source to sea → push toward its mouth
  const tk = s.w('kilometres');
  const cam = camPath(s.t, [[0, { lon: 81, lat: 22.5, zoom: 5.15 }], [1.6, { lon: 32.0, lat: 50.4, zoom: 6.4 }, 3.6], [tk + 0.8, { lon: 33.0, lat: 47.6, zoom: 7.1 }, Math.max(1.5, s.d - tk - 1)]]);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  bg(ctx, { inner: '#161A20', outer: '#0E1115' });
  raster(ctx, proj, A.wide, A.wide_meta); raster(ctx, proj, A.region, A.region_meta, { alpha: span(s.t, 3.0, 5), feather: 200 });
  countries(ctx, proj, { wide: s.t < 4.5, stroke: 'rgba(255,255,255,0.28)', indiaFill: 'rgba(245,211,0,0.22)', indiaStroke: C.yellow, indiaLw: 2.5 });
  const ia = 1 - span(s.t, 1.4, 2.0); if (ia > 0) { mapLabel(ctx, proj, [79, 23], 'INDIA', { font: F.ui(54, 800), color: C.yellow, alpha: ia }); }
  if (s.t < 5.6) { const [ix, iy] = proj([78.9, 22.5]), [bx, by] = proj(P.blackSea); arrow(ctx, [[ix, iy], [(ix + bx) / 2, Math.min(iy, by) - 120], [bx, by]], span(s.t, 1.6, 4.0), { dash: [10, 10], lw: 4, alpha: 1 - span(s.t, 4.8, 5.6) }); }
  const t1 = s.w('rises') - 0.3, rp = span(s.t, t1, s.w('Black Sea') + 0.5);
  if (rp > 0) {
    const [, ys] = proj(P.source), [, ym] = proj([32.3, 46.4]);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, lerp(ys - 10, ym + 20, rp)); ctx.clip();
    rivers(ctx, proj, DNIPRO, { color: C.blue, lw: 6 }); ctx.restore();
  }
  pin(ctx, proj, P.source, 'Valdai Hills', { alpha: appear(s.t, s.w('Valdai')), color: C.blue, sub: 'source · Russia' });
  pin(ctx, proj, P.kyiv, 'Kyiv', { alpha: appear(s.t, s.w('Belarus')), color: C.white, r: 7, font: F.ui(28, 700) });
  mapLabel(ctx, proj, [31.6, 45.0], 'BLACK SEA', { font: F.ui(36, 800), alpha: appear(s.t, s.w('Black Sea')) });
  const lab = appear(s.t, tk - 0.2);
  if (lab > 0) { card(ctx, 1240, 790, 600, 130, { accent: C.blue, alpha: lab }); text(ctx, 'Dnipro', 1290, 850, { font: F.head(48), alpha: lab }); text(ctx, '≈ 2,200 km · Russia → Belarus → Ukraine', 1290, 894, { font: F.ui(26, 600), color: '#C9CFD6', alpha: lab }); }
  locatorInset(ctx, 60, 620, 470, 340, P.blackSea, appear(s.t, 2.2) * (1 - span(s.t, s.d - 1, s.d)));      // ≥ 30% of frame height
  s.credit = TERRAIN; vignette(ctx, 0.45);
};
SCENES.S12 = (ctx, s) => {
  const cam = camPath(s.t, [[0, { lon: 33.0, lat: 46.75, zoom: 9.6 }], [0.01, { lon: 32.70, lat: 46.64, zoom: 11.0 }, 3.2], [5, { lon: 32.74, lat: 46.63, zoom: 11.12 }, Math.max(1, s.d - 5)]]);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  baseMap(ctx, proj); raster(ctx, proj, A[NOW_SAT()], A[NOW_SAT() + '_meta'], { alpha: span(s.t, 1.0, 3.0), feather: 120 });
  pin(ctx, proj, P.kherson, 'KHERSON', { alpha: appear(s.t, s.w('Kherson') - 0.15), color: C.white, dx: -20, sub: 'right (west) bank · Ukraine-controlled' });
  pin(ctx, proj, P.oleshky, 'OLESHKY', { alpha: appear(s.t, s.w('sits Oleshky')), dx: 20, dy: 46, sub: 'left (east) bank · occupied since Feb–Mar 2022' });
  const fd = appear(s.t, s.w('face downstream') - 0.3);
  if (fd > 0) {         // facing downstream (the river runs west here): right bank to the north, left bank to the south
    const a = proj([32.99, 46.752]), b = proj([32.80, 46.687]);     // on the Natural Earth river line
    arrow(ctx, [a, b], fd, { color: C.yellow, lw: 7 });
    text(ctx, 'R', (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 34, { font: F.ui(40, 800), color: C.white, align: 'center', alpha: fd, shadow: 8 });
    text(ctx, 'L', (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 66, { font: F.ui(40, 800), color: C.yellow, align: 'center', alpha: fd, shadow: 8 });
    pill(ctx, 'banks are named facing downstream', 640, 900, { alpha: fd, fill: 'rgba(20,23,28,0.9)', color: C.white, font: F.ui(30, 800), h: 54 });
  }
  const tf = s.w('frontline') - 0.2, band = span(s.t, tf, tf + 1.5);
  if (band > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * band, H); ctx.clip(); ctx.shadowColor = C.red; ctx.shadowBlur = 25;
    rivers(ctx, proj, DNIPRO, { color: 'rgba(229,72,77,0.9)', lw: 9 }); ctx.restore();
  }
  pill(ctx, 'LINE OF CONTACT SINCE NOV 2022', 640, 130, { alpha: appear(s.t, s.w('November')), fill: C.red, color: C.white, font: F.ui(30, 800), h: 54 });
  s.credit = COPERNICUS(NOW_SAT()) + ' · ' + TERRAIN; vignette(ctx, 0.45);
};

// ---------------- the timeline river (creative idea of the week) ----------------
function canalMap(ctx, x, y, w, h, a, o = {}) {
  if (a <= 0) return; card(ctx, x, y, w, h, { fill: 'rgba(15,18,22,0.94)', stroke: 'rgba(255,255,255,0.18)', alpha: a });
  ctx.save(); ctx.globalAlpha = a; rr(ctx, x, y, w, h, 18); ctx.clip();
  const proj = d3.geoMercator().fitExtent([[x + 10, y + 10], [x + w - 10, y + h - 10]], { type: 'MultiPoint', coordinates: [[32.4, 47.4], [36.2, 44.6]] });
  raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta);
  countries(ctx, proj, { stroke: 'rgba(255,255,255,0.25)' });
  rivers(ctx, proj, DNIPRO, { lw: 4 });
  geo(ctx, proj, { type: 'Point', coordinates: P.reservoir }, {});
  arrow(ctx, CANAL.map(c => proj(c)), o.flow ?? 1, { color: o.dry ? C.red : C.blue, lw: 6, dash: [12, 8], noHead: true });
  pin(ctx, proj, P.kalanchak, 'Kalanchak', { r: 8, font: F.ui(26, 800), color: o.blown ? C.red : C.yellow, alpha: o.kal ?? 1 });
  mapLabel(ctx, proj, [34.4, 45.3], 'CRIMEA', { font: F.ui(30, 800), color: C.white });
  mapLabel(ctx, proj, [33.7, 47.15], 'Kakhovka reservoir', { font: F.ui(24, 700), color: '#9CC8EA' });
  ctx.restore(); text(ctx, 'North Crimean Canal (approx. route)', x + 10, y + h + 34, { font: F.ui(24, 600), color: C.dim, alpha: a });
}
SCENES.S13 = (ctx, s) => {
  bg(ctx, { inner: '#1B2028', outer: '#101318' });
  // the river as a timeline, flowing along the bottom, with the camera drifting downstream
  const drift = lerp(0, -110, ease(s.p));
  ctx.save(); ctx.translate(drift, 0);
  const g = ctx.createLinearGradient(0, 0, W + 400, 0); g.addColorStop(0, 'rgba(74,144,194,0.15)'); g.addColorStop(1, 'rgba(74,144,194,0.6)');
  ctx.strokeStyle = g; ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.beginPath();
  for (let x = 40; x <= 2200; x += 10) ctx.lineTo(x, 960 + Math.sin(x / 210 + s.t * 0.6) * 22); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2; ctx.setLineDash([18, 22]); ctx.lineDashOffset = -s.t * 60; ctx.stroke(); ctx.setLineDash([]);
  [['2014', 0.2], ['2022', s.w('2022')], ['2023 →', s.d - 1]].forEach(([y, at], i) => {
    const x = 220 + i * 520, a = appear(s.t, at - 0.2);
    ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, 960 + Math.sin(x / 210 + s.t * 0.6) * 22, 16, 0, 7); ctx.fillStyle = C.yellow; ctx.fill();
    text(ctx, y, x, 920, { font: F.mono(32, 700), color: C.yellow, align: 'center' }); ctx.globalAlpha = 1;
  });
  ctx.restore();
  heading(ctx, 'THE DNIPRO, AS A TIMELINE', 1, 160);
  const E = [['2014', 'Crimea annexed · Ukraine blocks the North Crimean Canal', 0.2], ['≈ 85%', "of Crimea's water came through the canal", s.w('eighty-five') - 0.2], ['Feb 2022', 'Russian forces blow up the blocking dam at Kalanchak', s.w('blew') - 0.2]];
  E.forEach(([y, l, at], i) => {
    const a = appear(s.t, at), yy = 220 + i * 190;
    card(ctx, 120, yy + (1 - a) * 30, 780, 160, { accent: i === 2 ? C.red : C.yellow, alpha: a });
    text(ctx, y, 160, yy + 64, { font: F.mono(38, 700), color: i === 2 ? C.red : C.yellow, alpha: a });
    text(ctx, l, 160, yy + 116, { font: F.ui(30, 600), maxW: 700, lh: 36, alpha: a });
  });
  const tb = s.w('blew');
  canalMap(ctx, 980, 200, 840, 600, appear(s.t, 0), { flow: s.t < tb ? 0.15 : span(s.t, tb, tb + 2.5), dry: false, blown: s.t > tb });
  const st = pop(s.t, s.w('over water') - 0.1);
  if (st > 0) { ctx.save(); ctx.translate(500, 860); ctx.rotate(-0.05); ctx.scale(st, st); pill(ctx, 'WAR OVER LAND → WAR OVER WATER', -330, -28, { fill: C.red, color: C.white, font: F.ui(32, 800), h: 58 }); ctx.restore(); }
  s.credit = TERRAIN; vignette(ctx, 0.4);
};

// ---------------- satellite before / after ----------------
function wipe(ctx, proj, a, b, p, labels) {
  raster(ctx, proj, a.img, a.meta);
  const x = lerp(W + 40, -40, ease(p));
  ctx.save(); ctx.beginPath(); ctx.rect(x, 0, W - x, H); ctx.clip(); raster(ctx, proj, b.img, b.meta); ctx.restore();
  ctx.save(); ctx.strokeStyle = C.white; ctx.lineWidth = 4; ctx.shadowColor = 'black'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); ctx.restore();
  pill(ctx, labels[0], 60, 130, { alpha: 1 - span(p, 0.8, 1), fill: 'rgba(20,23,28,0.88)', color: C.white, font: F.ui(28, 800), h: 52 });
  pill(ctx, labels[1], 60, 196, { alpha: span(p, 0.15, 0.4), fill: C.red, color: C.white, font: F.ui(28, 800), h: 52 });
}
SCENES.S15 = (ctx, s) => {
  const cam = camLerp({ lon: 34.07, lat: 47.14, zoom: 10.0 }, { lon: 34.0, lat: 47.12, zoom: 10.2 }, s.p);
  const proj = camera(cam.lon, cam.lat, cam.zoom), tb = s.w('breached') - 0.4;
  bg(ctx); raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta);
  wipe(ctx, proj, SAT('kakhovka_before'), SAT('kakhovka_after'), span(s.t, tb, tb + 5), ['BEFORE · 3–6 JUN 2023 · reservoir full', 'AFTER · JUL–AUG 2023 · reservoir drained']);
  pin(ctx, proj, P.dam, 'Kakhovka dam', { alpha: appear(s.t, 0.6), color: C.red, sub: 'breached 6 Jun 2023', dx: 18, dy: -40 });
  const tf = s.w('eighteen'), fig = appear(s.t, tf - 0.2);
  if (fig > 0) { card(ctx, 1330, 120, 520, 160, { accent: C.blue, alpha: fig }); text(ctx, `≈ ${roll(18, s.t, tf).toFixed(0)} km³`, 1370, 195, { font: F.head(62), alpha: fig }); text(ctx, "Ukraine's largest reservoir by volume", 1370, 245, { font: F.ui(26, 600), color: '#C9CFD6', alpha: fig }); }
  const fl = appear(s.t, s.w('flooded') - 0.2);
  if (fl > 0) pill(ctx, 'Oleshky ≈ 90% flooded (reported)', 60, 262, { alpha: fl, fill: C.yellow, font: F.ui(28, 800), h: 52 });
  const att = appear(s.t, s.w('blamed') - 0.2);
  if (att > 0) {       // its own lower band, clear of the dam label
    ctx.save(); ctx.globalAlpha = att; ctx.fillStyle = 'rgba(14,16,20,0.86)'; ctx.fillRect(0, 900, W, 104); ctx.restore();
    text(ctx, 'Blame: Ukraine and most independent assessments → Russian forces controlling the dam · Moscow → Ukraine', 960, 964, { font: F.ui(28, 700), align: 'center', alpha: att });
  }
  s.credit = 'Contains modified Copernicus Sentinel data 2023 · processed by Decode UPSC'; vignette(ctx, 0.3);
};
SCENES.S16 = (ctx, s) => {
  const cam = camLerp({ lon: 32.95, lat: 46.64, zoom: 10.8 }, { lon: 32.85, lat: 46.63, zoom: 11.1 }, s.p);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  bg(ctx); raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta);
  wipe(ctx, proj, SAT('oleshky_before'), SAT('oleshky_flood'), span(s.t, 0.4, 4.5), ['3–5 JUN 2023 · before the breach', '18–20 JUN 2023 · floodplain still inundated']);
  const q = span(s.t, s.w('rushed') - 0.4, s.w('rushed') + 3); const path = [[33.25, 46.73], [33.05, 46.72], [32.9, 46.66], P.oleshky].map(c => proj(c));
  arrow(ctx, path, q, { color: C.yellow, lw: 7 });
  pin(ctx, proj, P.oleshky, 'OLESHKY', { alpha: appear(s.t, s.w('rushed') + 2.5), dy: 46 });
  const t2 = appear(s.t, s.w('help') - 0.2);
  if (t2 > 0) { card(ctx, 1240, 850, 620, 120, { accent: C.red, alpha: t2 }); text(ctx, 'frontline river · help barely reached', 1280, 925, { font: F.ui(32, 800), alpha: t2 }); }
  s.credit = 'Contains modified Copernicus Sentinel data 2023 · processed by Decode UPSC'; vignette(ctx, 0.35);
};
SCENES.S17 = (ctx, s) => {
  const cam = camLerp({ lon: 34.0, lat: 46.9, zoom: 9.2 }, { lon: 34.15, lat: 46.78, zoom: 8.45 }, span(s.t, 0, 2.6));
  const drift = 0.06 * ease(span(s.t, 3, s.d));
  const proj = camera(cam.lon + drift, cam.lat, cam.zoom + drift);
  baseMap(ctx, proj); raster(ctx, proj, A.kakhovka_after, A.kakhovka_after_meta, { alpha: 0.95, feather: 90 });
  countries(ctx, proj, { stroke: 'rgba(255,255,255,0.3)' });
  const tc = s.w('canal') - 0.3;
  arrow(ctx, CANAL.map(c => proj(c)), span(s.t, tc, tc + 2.2), { color: C.yellow, lw: 6, dash: [14, 10] });
  const dry = appear(s.t, s.w('dry') - 0.1);
  mapLabel(ctx, proj, [34.6, 45.55], 'CANAL DRY', { font: F.ui(36, 800), color: C.yellow, alpha: dry });
  mapLabel(ctx, proj, [34.2, 45.2], 'CRIMEA', { font: F.ui(30, 800), alpha: dry });
  const zn = appear(s.t, s.w('Zaporizhzhia') - 0.3), apath = [proj([33.6, 46.9]), proj([34.2, 47.3]), proj(P.znpp)];
  arrow(ctx, apath, zn, { color: C.red, lw: 6 });
  const pc = span(s.t, s.w('cooling'), s.w('cooling') + 1.2);          // a pulse travels to the plant on "cooling water"
  if (pc > 0 && pc < 1) { const k = pc * 2, p = k < 1 ? [lerp(apath[0][0], apath[1][0], k), lerp(apath[0][1], apath[1][1], k)] : [lerp(apath[1][0], apath[2][0], k - 1), lerp(apath[1][1], apath[2][1], k - 1)]; ctx.save(); ctx.shadowColor = C.blue; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(p[0], p[1], 14, 0, 7); ctx.fillStyle = '#9CC8EA'; ctx.fill(); ctx.restore(); }
  const fl = s.t > s.w('outside power') ? 0.5 + 0.5 * Math.sin((s.t - s.w('outside power')) * 9) * (1 - span(s.t, s.w('outside power') + 1.6, s.w('outside power') + 2)) : 0;
  pin(ctx, proj, P.znpp, 'Zaporizhzhia NPP', { alpha: zn, color: fl > 0.7 ? C.white : C.red, r: 11 + 6 * fl, sub: 'Enerhodar', dx: -22, dy: -22, font: F.ui(32, 800) });
  const L = [["Europe's largest nuclear plant", 'largest'], ['6 × VVER-1000 · shut down', 'six'], ['decay heat → still needs cooling', 'decay'], ['repeated loss of all off-site power', 'outside power']];
  const box = appear(s.t, s.w('largest') - 0.3);
  if (box > 0) {
    card(ctx, 1240, 560, 620, 330, { fill: 'rgba(30,34,40,0.96)', accent: C.red, alpha: box });
    L.forEach(([l, cw], i) => text(ctx, l, 1280, 625 + i * 70, { font: i ? F.ui(30, 700) : F.ui(32, 800), color: C.white, alpha: appear(s.t, s.w(cw) - 0.2) }));
  }
  s.credit = 'Contains modified Copernicus Sentinel data 2023 · ' + TERRAIN + ' · IAEA'; vignette(ctx, 0.4);
};

// ---------------- the fragility mind map ----------------
const FRAG = [
  { s: 'River = frontline', sub: 'geography', x: 430, y: 240 }, { s: 'Water', sub: 'the canal · old reservoir', x: 1490, y: 240 },
  { s: 'Nuclear safety', sub: 'ZNPP upstream', x: 1580, y: 560 }, { s: 'Civilians', sub: '1,700–2,000 · mostly elderly', x: 1450, y: 870 },
  { s: 'Trust & verification', sub: 'non-military teams', x: 470, y: 870 }, { s: "India's dilemma", sub: 'energy vs principle', x: 330, y: 560 },
];
function fragMap(ctx, s, reveal, o = {}) {
  if (!o.noBg) bg(ctx); const c = [960, 555], n = o.india ? 6 : 5;
  FRAG.slice(0, n).forEach((nd, i) => { const a = reveal[i] ?? 0; link(ctx, c, [nd.x, nd.y], span(a, 0, 0.6) * 1.0001, { bend: 40, lw: 4, alpha: o.hi != null && o.hi !== i ? 0.45 : 1, label: ['is', 'governed by', 'risks', 'affects', 'requires', 'tests'][i] }); });
  node(ctx, c[0], c[1], o.centre || 'A truce in one town — why so fragile?', { font: F.head(44), maxW: 460, lh: 52, fill: 'rgba(245,211,0,0.95)', color: C.slate, stroke: C.yellow });
  FRAG.slice(0, n).forEach((nd, i) => {
    const a = reveal[i] ?? 0; if (a <= 0) return;
    const blank = o.blanks && o.blanks[i], dim = o.hi != null && o.hi !== i ? 0.45 : 1;
    const sc = a < 1 ? pop(a * 0.45, 0) : 1;
    ctx.save(); ctx.globalAlpha = dim;
    node(ctx, nd.x, nd.y, blank ? '________' : nd.s, { alpha: clamp(a * 1.6), scale: Math.max(0.01, sc), sub: blank ? '' : nd.sub, stroke: o.hi === i ? C.yellow : 'rgba(255,255,255,0.25)', lw: o.hi === i ? 4 : 2 });
    ctx.restore();
  });
  if (o.hi != null) {      // "Mounika's gaze": a ring that glides to the node being spoken about
    const g = o.gaze || FRAG[o.hi];
    ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 4; ctx.globalAlpha = 0.85; ctx.shadowColor = C.yellow; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.ellipse(g.x, g.y, 230, 95, 0, 0, 7); ctx.stroke(); ctx.restore();
  }
  vignette(ctx, 0.45);
}
SCENES.S18 = (ctx, s) => {
  const cues = ['river', 'water system', 'nuclear plant', 'civilians', 'trust'].map(cw => s.w(cw) - 0.2);
  const r = cues.map(c => span(s.t, c, c + 0.8));
  const cur = cues.filter(c => s.t >= c).length - 1;
  let gaze = null;
  if (cur >= 0) { const prev = FRAG[Math.max(0, cur - 1)], nx = FRAG[cur], k = ease(span(s.t, cues[cur], cues[cur] + 0.5)); gaze = { x: lerp(prev.x, nx.x, k), y: lerp(prev.y, nx.y, k) }; }
  const ans = s.t > s.w('answer') - 0.2;
  fragMap(ctx, s, r, { hi: ans ? null : (cur >= 0 ? cur : null), gaze, centre: ans ? 'Holds because it costs neither side any ground' : null });
  text(ctx, 'small · precise · humanitarian', 960, 1030, { font: F.hand(58), align: 'center', color: C.yellow, alpha: appear(s.t, s.w('small') - 0.2) });
};
SCENES.S37 = (ctx, s) => {
  bg(ctx, { inner: '#2A2420', outer: '#15120F' });                          // case-file board
  heading(ctx, 'PRECEDENTS IN THIS WAR', 1, 150);
  const C4 = [['Apr–May 2022', 'Azovstal, Mariupol', 'UN + ICRC evacuate civilians', 'Azovstal', 150, 230], ['Mar 2022', 'Sumy corridor', 'Indian students out · Operation Ganga', 'Sumy', 1000, 230],
    ['Jul 2022 – Jul 2023', 'Black Sea Grain Initiative', 'UN + Türkiye · Russia withdrew', 'Grain', 150, 560], ['2025–26', 'IAEA local ceasefires at ZNPP', 'repairs to the plant\'s power lines', 'IAEA', 1000, 560]];
  const pts = [];
  C4.forEach(([d, h, sub, cw, x, y], i) => {
    const a = pop(s.t, s.w(cw) - 0.2); if (a <= 0) return; pts.push([x + 385, y + 30]);
    ctx.save(); ctx.translate(x + 385, y + 135); ctx.rotate([-0.02, 0.015, 0.012, -0.018][i]); ctx.scale(a, a); ctx.translate(-(x + 385), -(y + 135));
    card(ctx, x, y, 770, 270, { fill: C.paper, r: 6 });
    text(ctx, d, x + 40, y + 70, { font: F.mono(30, 700), color: '#8A1C1C' }); text(ctx, h, x + 40, y + 140, { font: F.head(46), color: '#1E2228' });
    text(ctx, sub, x + 40, y + 200, { font: F.ui(30, 600), color: '#3A3F46' });
    ctx.beginPath(); ctx.arc(x + 385, y + 30, 12, 0, 7); ctx.fillStyle = C.red; ctx.fill(); ctx.restore();
  });
  if (pts.length > 1) { ctx.save(); ctx.strokeStyle = 'rgba(229,72,77,0.85)'; ctx.lineWidth = 3; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); ctx.restore(); }
  const st = pop(s.t, s.w('Notice the pattern') - 0.1);
  if (st > 0) { ctx.save(); ctx.translate(960, 935); ctx.rotate(-0.03); ctx.scale(st, st); pill(ctx, 'NARROW · NEUTRAL BROKER · ONE CONCRETE PROBLEM', -470, -30, { fill: C.yellow, font: F.ui(32, 800), h: 60 }); ctx.restore(); }
  s.credit = 'Sources: UN, ICRC, MEA, IAEA'; vignette(ctx, 0.5);
};

// ---------------- India's dilemma ----------------
SCENES.S19 = (ctx, s) => {
  bg(ctx);
  const sp = ease(span(s.t, 0.3, 1.6));
  node(ctx, 960, 210, "India's dilemma", { font: F.head(56), fill: 'rgba(245,211,0,0.95)', color: C.slate, maxW: 700 });
  card(ctx, 140, 340, 780 * sp, 520, { accent: C.blue }); card(ctx, 1000 + 780 * (1 - sp), 340, 780 * sp, 520, { accent: C.yellow });
  text(ctx, 'ENERGY SECURITY', 530, 610, { font: F.ui(48, 800), alpha: sp, color: C.blue, align: 'center' });
  text(ctx, 'PRINCIPLES', 1390, 610, { font: F.ui(48, 800), alpha: sp, color: C.yellow, align: 'center' });
  const k = pop(s.t, s.w('strategic autonomy') - 0.1);
  if (k > 0) { ctx.save(); ctx.translate(960, 960); ctx.scale(k, k); text(ctx, 'strategic autonomy?', 0, 0, { font: F.hand(72), color: C.yellow, align: 'center' }); ctx.restore(); }
  vignette(ctx, 0.4);
};
SCENES.S20 = (ctx, s) => {
  bg(ctx);
  text(ctx, 'Russia is still India\'s largest crude supplier', 140, 170, { font: F.head(56), alpha: appear(s.t, 0.1) });
  text(ctx, "India's crude imports by source · million barrels a day · 1–27 Sep 2026", 140, 226, { font: F.ui(28, 600), color: '#C9CFD6', alpha: appear(s.t, 0.3) });
  const tr = s.w('one third') - 0.1, ti = s.w('Iraq') - 0.2;
  const data = [['Russia', 1.742, C.yellow, tr], ['Iraq', 0.579, '#9AA4AF', ti], ['Saudi Arabia', 0.570, '#9AA4AF', ti + 0.3], ['All others', 2.360, '#5B646E', ti + 0.6]];
  const x0 = 440, maxw = 1200, max = 2.4;
  data.forEach(([n, v, col, at], i) => {
    const y = 300 + i * 150, g = easeOut(span(s.t, at, at + 1.0)), w = maxw * v / max * g, a = Math.max(0.35, appear(s.t, at - 0.2));
    text(ctx, n, x0 - 30, y + 66, { font: F.ui(34, 800), align: 'right', alpha: a });
    ctx.save(); rr(ctx, x0, y + 20, maxw * v / max, 76, 8); ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();   // empty track from frame one
    if (w > 1) { ctx.save(); rr(ctx, x0, y + 20, w, 76, 8); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
    if (g > 0) text(ctx, (v * g).toFixed(2), x0 + w + 20, y + 72, { font: F.mono(36, 700), color: i === 0 ? C.yellow : C.white });
  });
  const br = pop(s.t, tr + 0.4);
  if (br > 0) pill(ctx, '≈ ONE-THIRD OF IMPORTS', x0 + 20, 331, { alpha: clamp(br), fill: C.slate, color: C.yellow, font: F.ui(30, 800), h: 54 });
  const ap = pop(s.t, s.w('April') - 0.1);
  if (ap > 0) pill(ctx, 'lowest since April', 1470, 255, { alpha: clamp(ap), fill: 'rgba(255,255,255,0.16)', color: C.white, font: F.ui(28, 800), h: 54 });
  s.credit = 'Data: Kpler ship-tracking, as reported by KNN India and PTI (Sep 2026) · figures vary by tracker';
  vignette(ctx, 0.35);
};
SCENES.S21 = (ctx, s) => {
  bg(ctx); const a = appear(s.t, 0.2), tu = s.w('General Assembly') - 0.2, b = appear(s.t, tu);
  card(ctx, 140, 170, 1640, 300, { accent: C.yellow, alpha: a });
  revealWords(ctx, '“Today\'s era is not an era of war.”', 200, 300, a, { font: F.head(68), maxW: 1500, highlight: s.t > s.w('not an era') ? ['not', 'an', 'era', 'of', 'war.”'] : [] });
  text(ctx, 'PM Modi to President Putin · SCO, Samarkand · 16 Sep 2022', 200, 400, { font: F.ui(30, 600), color: '#C9CFD6', alpha: a });
  card(ctx, 140, 520 + (1 - b) * 40, 1640, 390, { accent: C.blue, alpha: b });
  text(ctx, 'UNGA · 24 Feb 2026 · "Support for Lasting Peace in Ukraine"', 200, 600, { font: F.ui(34, 800), alpha: b });
  [[107, 'for', C.white], [12, 'against', C.white], [51, 'abstentions', C.yellow]].forEach(([n, l, col], i) => {
    const at = tu + 0.4 + i * 0.25;
    text(ctx, String(Math.round(roll(n, s.t, at))), 260 + i * 400, 770, { font: F.head(104), color: col, alpha: appear(s.t, at - 0.1) });
    text(ctx, l, 260 + i * 400, 840, { font: F.ui(30, 600), color: '#C9CFD6', alpha: appear(s.t, at - 0.1) });
  });
  const ab = pop(s.t, s.w('abstained') - 0.15);
  if (ab > 0) { ctx.save(); ctx.translate(1560, 750); ctx.rotate(-0.05); ctx.scale(ab, ab); pill(ctx, 'INDIA ABSTAINED', -170, -30, { font: F.ui(32, 800), h: 60 }); ctx.restore(); }
  s.credit = 'Sources: MEA / Reuters (2022); UN General Assembly record (Feb 2026)'; vignette(ctx, 0.35);
};
SCENES.S22 = (ctx, s) => desk(ctx, s.t, { lines: [{ s: 'Strategic autonomy =' }, { s: 'keeping all doors open' }, { s: '… but one quiet town ≠ peace', gap: 90 }], write: span(s.t, s.w('supports') - 1, s.w('balancing') + 1) });

// ---------------- Prelims traps ----------------
function trapTag(ctx, a) { if (a > 0) pill(ctx, 'PRELIMS TRAP', 80, 130, { alpha: a, fill: C.red, color: C.white, font: F.ui(32, 800), h: 58 }); }
SCENES.S23 = (ctx, s) => {
  const base = { lon: 31.6, lat: 42.6, zoom: 7.05 }, bos = { lon: 28.4, lat: 40.9, zoom: 7.75 }, ker = { lon: 35.4, lat: 44.9, zoom: 7.75 };
  const tb = s.w('Bosphorus') - 0.3, tk = s.w('Kerch Strait') - 0.4, ta = s.w('So the answer') - 0.3;
  const cam = camPath(s.t, [[0, base], [tb, bos, 1.2], [s.w('Türkiye') + 1.2, { lon: 30.0, lat: 41.8, zoom: 7.3 }, 1.2], [tk, ker, 0.8], [ta, base, 1.2]]);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  bg(ctx); raster(ctx, proj, A.wide, A.wide_meta); raster(ctx, proj, A.region, A.region_meta, { feather: 160 }); countries(ctx, proj, { stroke: 'rgba(255,255,255,0.3)' });
  mapLabel(ctx, proj, P.blackSea, 'BLACK SEA', { font: F.ui(38, 800) });
  trapTag(ctx, appear(s.t, 0.1));
  [['Bosphorus', P.bosphorus, 18, -16], ['Marmara', P.marmara, 18, 40], ['Dardanelles', P.dardanelles, -18, -16]].forEach(([n, c, dx, dy]) => {
    const at = s.w(n) - 0.2, k = appear(s.t, at);
    pin(ctx, proj, c, n === 'Marmara' ? 'Sea of Marmara' : n, { alpha: k, color: C.yellow, dx, dy, font: F.ui(32, 800), pulse: s.t > at && s.t < at + 1.6 ? (s.t - at) / 1.6 : null });
  });
  const m = appear(s.t, s.w('Montreux Convention') - 0.2);
  if (m > 0) { card(ctx, 80, 210, 800, 170, { accent: C.yellow, alpha: m }); text(ctx, 'Montreux Convention, 1936', 120, 280, { font: F.head(48), alpha: m }); text(ctx, 'Turkish Straits ONLY', 120, 340, { font: F.ui(34, 800), color: C.yellow, alpha: m }); }
  const tu = appear(s.t, s.w('Türkiye') - 0.2);
  if (tu > 0) { card(ctx, 80, 400, 800, 150, { accent: C.blue, alpha: tu }); text(ctx, 'Feb 2022 · Türkiye invokes Montreux', 120, 460, { font: F.ui(34, 800), alpha: tu }); text(ctx, "straits closed to the warring parties' warships", 120, 515, { font: F.ui(30, 600), color: '#C9CFD6', alpha: tu }); }
  const k = appear(s.t, s.w('nothing to do') - 0.2);
  pin(ctx, proj, P.kerchStrait, 'Kerch Strait', { alpha: appear(s.t, tk + 0.3), color: C.red, font: F.ui(34, 800), dx: 18, dy: 40 });
  if (k > 0) { card(ctx, 1000, 640, 860, 210, { accent: C.red, alpha: k }); text(ctx, 'NOT Montreux', 1040, 710, { font: F.head(50), color: C.red, alpha: k }); text(ctx, '2003 Russia–Ukraine treaty · denounced by both in 2023 · status now disputed', 1040, 765, { font: F.ui(30, 600), maxW: 780, lh: 38, alpha: k }); }
  const ans = pop(s.t, ta + 0.2);
  if (ans > 0) { ctx.save(); ctx.translate(960, 950); ctx.scale(ans, ans); card(ctx, -360, -60, 720, 116, { fill: 'rgba(229,72,77,0.96)' }); text(ctx, 'Answer: NO', 0, 20, { font: F.ui(52, 800), align: 'center' }); ctx.restore(); }
  s.credit = TERRAIN + ' · Turkish MFA (Montreux)'; vignette(ctx, 0.35);
};
SCENES.S24 = (ctx, s) => {
  const cam = camPath(s.t, [[0, { lon: 36.0, lat: 47.0, zoom: 8.1 }], [s.w('Donbas') - 0.4, { lon: 36.0, lat: 47.45, zoom: 7.75 }, 1.4]]);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  bg(ctx); raster(ctx, proj, A.wide, A.wide_meta); raster(ctx, proj, A.region, A.region_meta, { feather: 160 }); raster(ctx, proj, A.lowerdnipro, A.lowerdnipro_meta, { feather: 200 });
  countries(ctx, proj, { stroke: 'rgba(255,255,255,0.3)' }); trapTag(ctx, 1);
  const az = appear(s.t, s.w('Sea of Azov') - 0.2);
  mapLabel(ctx, proj, P.azov, 'SEA OF AZOV', { font: F.ui(36, 800), color: C.white, alpha: az });
  const sh = appear(s.t, s.w('shallowest') - 0.2);
  if (sh > 0) pill(ctx, "WORLD'S SHALLOWEST SEA · avg ≈ 7 m", 600, 900, { alpha: sh, fill: C.blue, color: C.white, font: F.ui(32, 800), h: 58 });
  const db = appear(s.t, s.w('Donbas') - 0.2), nd = appear(s.t, s.w('Kherson') - 0.2);
  for (const r of A.geo.admin1) {
    const isD = /Donets|Luhans/.test(r.name), isN = /Kherson|Zaporizh/.test(r.name);
    if (isD) geo(ctx, proj, r.geom, { fill: `rgba(245,211,0,${0.35 * db})`, stroke: `rgba(245,211,0,${db})`, lw: 2.5 });
    if (isN) geo(ctx, proj, r.geom, { fill: `rgba(229,72,77,${0.28 * nd})`, stroke: `rgba(229,72,77,${nd})`, lw: 2.5 });
  }
  mapLabel(ctx, proj, [38.6, 48.4], 'DONBAS', { font: F.ui(44, 800), color: C.yellow, alpha: db });
  mapLabel(ctx, proj, [38.6, 48.0], 'Donetsk + Luhansk', { font: F.ui(28, 700), color: C.white, alpha: db });
  mapLabel(ctx, proj, [33.5, 46.45], 'Kherson — NOT Donbas', { font: F.ui(30, 800), color: '#FF8A8E', alpha: nd });
  mapLabel(ctx, proj, [36.0, 47.2], 'Zaporizhzhia — NOT Donbas', { font: F.ui(30, 800), color: '#FF8A8E', alpha: appear(s.t, s.w('neither') - 0.2) });
  pin(ctx, proj, P.oleshky, 'Oleshky', { alpha: nd, r: 7, font: F.ui(26, 800), dx: -14 });
  const dn = appear(s.t, s.w('Dnipro not') - 0.2);
  if (dn > 0) { rivers(ctx, proj, DNIPRO, { color: C.blue, lw: 5, alpha: dn }); pin(ctx, proj, P.znpp, 'ZNPP — on the Dnipro, not the Don', { alpha: dn, color: C.blue, font: F.ui(28, 800), dx: -16, dy: -24 }); }
  s.credit = TERRAIN; vignette(ctx, 0.35);
};
SCENES.S25 = (ctx, s) => {
  bg(ctx); trapTag(ctx, 1);
  const a1 = appear(s.t, s.w('four Geneva') - 0.2), a2 = appear(s.t, s.w('has not ratified') - 0.2);
  card(ctx, 140, 240, 1640, 280, { accent: C.teal, alpha: a1 });
  text(ctx, 'India: party to all four Geneva Conventions (1949)', 200, 350, { font: F.head(52), alpha: a1 });
  for (let i = 0; i < 4; i++) { const k = pop(s.t, s.w('four Geneva') + 0.1 + i * 0.18); if (k > 0) text(ctx, '✓ GC ' + ['I', 'II', 'III', 'IV'][i], 200 + i * 230, 450, { font: F.ui(38, 800), color: C.teal, alpha: clamp(k) }); }
  card(ctx, 140, 580, 1640, 280, { accent: C.red, alpha: a2 });
  text(ctx, 'Additional Protocols I & II (1977)', 200, 690, { font: F.head(52), alpha: a2 });
  text(ctx, 'not ratified by India', 200, 780, { font: F.ui(38, 700), color: '#FF9A9E', alpha: a2 });
  const st = pop(s.t, s.w('has not ratified') + 0.3);
  if (st > 0) { ctx.save(); ctx.translate(1550, 720); ctx.rotate(-0.12); ctx.scale(st, st); ctx.strokeStyle = C.red; ctx.lineWidth = 8; rr(ctx, -130, -62, 260, 124, 14); ctx.stroke(); text(ctx, 'NOT', 0, 26, { font: F.ui(76, 800), color: C.red, align: 'center' }); ctx.restore(); }
  s.credit = 'Source: ICRC, Treaties and States Parties database'; vignette(ctx, 0.35);
};

// ---------------- the examiner's chair ----------------
const NEIGH = [['RUS', 'Russia', [38.5, 51.5]], ['BLR', 'Belarus', [28.0, 53.3]], ['POL', 'Poland', [20.5, 52.2]], ['SVK', 'Slovakia', [19.6, 48.75]], ['HUN', 'Hungary', [19.3, 47.1]], ['ROU', 'Romania', [24.8, 45.8]], ['MDA', 'Moldova', [28.6, 47.2]]];
SCENES.S26 = (ctx, s) => {
  bg(ctx, { inner: '#20252C' });
  const tl = s.w('So learn') - 0.3;
  if (s.t < tl + 0.6) {        // the examiner's desk: our own practice question in the UPSC format (not a PYQ)
    const out = span(s.t, tl, tl + 0.6), paperIn = ease(span(s.t, 0, 1.0));
    ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(960, 560 + (1 - paperIn) * 400 - out * 300); ctx.rotate(-0.02);
    card(ctx, -640, -400, 1280, 800, { fill: '#F4F1EA', r: 6 });
    text(ctx, 'DECODE PRACTICE · in the UPSC format (not a PYQ)', -580, -320, { font: F.mono(28, 700), color: '#8A1C1C' });
    const q = 'How many of the following countries share a land border with Ukraine?';
    text(ctx, q.slice(0, Math.floor(span(s.t, s.w('If I were'), s.w('six European')) * q.length)), -580, -230, { font: F.ui(40, 700), color: '#1E2228', maxW: 1160, lh: 54 });
    ['1. Bulgaria', '2. Hungary', '3. Latvia', '4. Moldova', '5. Romania', '6. Slovakia'].forEach((c, i) =>
      text(ctx, c, -580 + (i % 3) * 400, -60 + Math.floor(i / 3) * 80, { font: F.ui(38, 600), color: '#1E2228', alpha: appear(s.t, s.w('six European') + i * 0.15) }));
    ['(a) Only two', '(b) Only three', '(c) Only four', '(d) All six'].forEach((o, i) =>
      text(ctx, o, -580 + (i % 2) * 560, 150 + Math.floor(i / 2) * 70, { font: F.ui(36, 600), color: '#1E2228', alpha: appear(s.t, s.w('share') + 0.3 + i * 0.12) }));
    ctx.restore();
  }
  if (s.t > tl) {
    const k0 = appear(s.t, tl, 0.6), proj = camera(26.5, 49.2, 5.95);
    ctx.save(); ctx.globalAlpha = k0;
    raster(ctx, proj, A.wide, A.wide_meta); raster(ctx, proj, A.region, A.region_meta, { feather: 200 });
    const lit = { UKR: 'rgba(74,144,194,0.4)' };
    NEIGH.forEach(([a3, n]) => { const k = appear(s.t, s.w(n) - 0.15); if (k > 0) lit[a3] = `rgba(245,211,0,${0.42 * k})`; });
    countries(ctx, proj, { highlight: lit, stroke: 'rgba(255,255,255,0.3)' });
    mapLabel(ctx, proj, [31.2, 49.0], 'UKRAINE', { font: F.ui(40, 800), color: C.white });
    NEIGH.forEach(([a3, n, c]) => mapLabel(ctx, proj, c, n.toUpperCase(), { font: F.ui(30, 800), color: C.yellow, alpha: pop(s.t, s.w(n) - 0.15) }));
    const dx = appear(s.t, s.w('Moldova') + 0.6);
    [['BULGARIA', [25.3, 43.7]], ['LATVIA', [25.5, 55.7]]].forEach(([n, c]) => { const [x, y] = proj(c); text(ctx, n, x, y, { font: F.ui(30, 800), color: '#FF8A8E', align: 'center', alpha: dx }); ctx.save(); ctx.globalAlpha = dx; ctx.strokeStyle = C.red; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 80, y - 10); ctx.lineTo(x + 80, y - 10); ctx.stroke(); ctx.restore(); });
    text(ctx, 'News picks the region · a static fact decides your marks', 960, 1000, { font: F.hand(56), align: 'center', color: C.yellow, alpha: appear(s.t, s.w('news chooses') - 0.2), shadow: 10 });
    ctx.restore(); s.credit = TERRAIN;
  }
  vignette(ctx, 0.35);
};
SCENES.S38 = (ctx, s) => {
  bg(ctx); pill(ctx, 'DECODE PRACTICE MCQ · UPSC format (not a PYQ)', 80, 130, { font: F.ui(28, 800), h: 54 });
  const st = [['The Montreux Convention governs passage through the Kerch Strait.', 'Statement one', false], ['The Sea of Azov is joined to the Black Sea by the Kerch Strait.', 'Statement two', true], ['Kherson oblast is part of the Donbas region.', 'Statement three', false]];
  const tr = s.w('Only one') - 0.1;
  st.forEach(([l, cw, ok], i) => {
    const a = appear(s.t, s.w(cw) - 0.2), y = 270 + i * 140;
    card(ctx, 140, y, 1640, 116, { alpha: a, stroke: 'rgba(255,255,255,0.15)' });
    text(ctx, `${i + 1}.  ${l}`, 190, y + 70, { font: F.ui(36, 600), alpha: a });
    const k = pop(s.t, tr + 0.3 + i * 0.25);
    if (k > 0) { if (ok) text(ctx, '✓', 1700, y + 76, { font: F.ui(56, 800), color: C.teal, alpha: clamp(k) }); else { ctx.save(); ctx.globalAlpha = clamp(k); ctx.strokeStyle = C.red; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(180, y + 58); ctx.lineTo(180 + 1480 * clamp(k), y + 58); ctx.stroke(); ctx.restore(); } }
  });
  const qa = appear(s.t, s.w('How many') - 0.2);
  text(ctx, 'How many of the above statements are correct?', 140, 760, { font: F.head(46), alpha: qa });
  ['(a) Only one', '(b) Only two', '(c) All three', '(d) None'].forEach((o, i) => text(ctx, o, 140 + i * 430, 860, { font: F.ui(38, 700), alpha: qa, color: i === 0 && s.t > tr ? C.yellow : C.white }));
  const c = appear(s.t, tr + 1.2);
  if (c > 0) { ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.globalAlpha = c; ctx.beginPath(); ctx.ellipse(250, 846, 140, 46, 0, 0, 7); ctx.stroke(); ctx.restore(); }
  vignette(ctx, 0.35);
};

// ---------------- Mains ----------------
SCENES.S27 = (ctx, s) => {
  const cues = ['Economically', 'governance', 'security', 'socially'].map(cw => s.w(cw) - 0.3);
  const Q = [['ECONOMIC', 'Fuel · food · fertiliser bills', C.yellow], ['GOVERNANCE & LAW', 'UN Charter · IHL · verification', C.blue], ['SECURITY', 'River frontline beside Europe\'s largest nuclear plant', C.red], ['SOCIO-ENVIRONMENTAL', 'Elderly civilians trapped · drained reservoir', C.teal]];
  const ctr = (i) => [140 + (i % 2) * 840 + 400, 210 + Math.floor(i / 2) * 420 + 190];
  // the camera travels into the quadrant being read, then pulls back to show all four
  let cx = 960, cy = 540, sc = 1;
  const cur = cues.filter(c => s.t >= c).length - 1, back = span(s.t, cues[3] + 3.2, cues[3] + 4.4);
  if (cur >= 0) {
    const prev = cur > 0 ? ctr(cur - 1) : [960, 540], nx = ctr(cur), k = ease(span(s.t, cues[cur], cues[cur] + 0.9));
    cx = lerp(prev[0], nx[0], k); cy = lerp(prev[1], nx[1], k); sc = cur === 0 ? lerp(1, 1.28, k) : 1.28;
    cx = lerp(cx, 960, ease(back)); cy = lerp(cy, 540, ease(back)); sc = lerp(sc, 1, ease(back));
  }
  bg(ctx); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.translate(-cx, -cy);
  Q.forEach(([h, sub, col], i) => {
    const a = appear(s.t, cues[i]), x = 140 + (i % 2) * 840, y = 210 + Math.floor(i / 2) * 420;
    card(ctx, x, y, 800, 380, { accent: col, alpha: Math.max(a, 0.12), stroke: 'rgba(255,255,255,0.08)' });
    text(ctx, h, x + 50, y + 95, { font: F.ui(38, 800), color: col, alpha: a }); text(ctx, sub, x + 50, y + 170, { font: F.head(46), maxW: 690, lh: 58, alpha: a });
  });
  ctx.restore(); pill(ctx, 'MAINS LENS', 80, 130, { font: F.ui(32, 800), h: 58 });
  vignette(ctx, 0.35);
};
SCENES.S28 = (ctx, s) => {
  bg(ctx);
  revealWords(ctx, '“Humanitarian pauses are stepping stones to peace.”', 960, 190, span(s.t, s.w('proposition'), s.w('On one hand') - 0.3), { font: F.head(60), align: 'center', maxW: 1700 });
  const fa = appear(s.t, s.w('On one hand') - 0.3), ag = appear(s.t, s.w('On the other') - 0.3);
  const L = [['build a little trust', 'trust'], ['keep channels open', 'channels'], ['test verification', 'verification']], R = [['can freeze the lines', 'freeze'], ['can give armies time to regroup', 'regroup'], ['no political track behind them', 'political']];
  card(ctx, 140, 400, 790, 560, { accent: C.teal, alpha: fa }); card(ctx, 990, 400, 790, 560, { accent: C.red, alpha: ag });
  text(ctx, 'FOR', 200, 480, { font: F.ui(38, 800), color: C.teal, alpha: fa }); text(ctx, 'AGAINST', 1050, 480, { font: F.ui(38, 800), color: C.red, alpha: ag });
  L.forEach(([l, cw], i) => text(ctx, '✓ ' + l, 200, 590 + i * 110, { font: F.head(44), alpha: appear(s.t, s.w(cw) - 0.2) }));
  R.forEach(([l, cw], i) => text(ctx, '✗ ' + l, 1050, 590 + i * 110, { font: F.head(44), alpha: appear(s.t, s.w(cw, cw === 'political' ? 0 : 0) - 0.2) }));
  // balance beam: tips toward each side as it is argued
  const tilt = lerp(0, -0.08, ease(span(s.t, s.w('trust'), s.w('verification')))) + lerp(0, 0.14, ease(span(s.t, s.w('freeze'), s.w('regroup'))));
  ctx.save(); ctx.translate(960, 300); ctx.rotate(tilt); ctx.strokeStyle = C.yellow; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-300, 0); ctx.lineTo(300, 0); ctx.stroke();
  ctx.fillStyle = C.teal; ctx.fillRect(-320, -20, 40, 20); ctx.fillStyle = C.red; ctx.fillRect(280, -20, 40, 20); ctx.restore();
  ctx.fillStyle = C.yellow; ctx.beginPath(); ctx.moveTo(960, 300); ctx.lineTo(940, 345); ctx.lineTo(980, 345); ctx.fill();
  vignette(ctx, 0.35);
};
SCENES.S29 = (ctx, s) => {
  bg(ctx); pill(ctx, 'CARRY INTO MAINS', 80, 130, { font: F.ui(32, 800), h: 58 });
  const t1 = s.w('eighteen'), t2 = s.w('eighty-five'), t3 = s.w('hundred and seven');
  const N = [[`≈ ${roll(18, s.t, t1).toFixed(0)} km³`, 'Kakhovka reservoir · breached 6 Jun 2023', t1], [`≈ ${roll(85, s.t, t2).toFixed(0)}%`, "of Crimea's water via the canal (pre-2014)", t2], [`${Math.round(roll(107, s.t, t3))}–${Math.round(roll(12, s.t, t3))}–${Math.round(roll(51, s.t, t3))}`, 'UNGA, 24 Feb 2026 · India abstained', t3]];
  N.forEach(([n, l, at], i) => {
    const a = appear(s.t, at - 0.25), x = 120 + i * 570, y = 280;
    card(ctx, x, y + (1 - a) * 40, 540, 520, { stroke: 'rgba(245,211,0,0.45)', alpha: a });
    text(ctx, n, x + 40, y + 200, { font: F.head(80), color: C.yellow, alpha: a }); text(ctx, l, x + 40, y + 300, { font: F.ui(32, 600), maxW: 460, lh: 42, alpha: a });
  });
  vignette(ctx, 0.35);
};
SCENES.S30 = (ctx, s) => {
  bg(ctx); heading(ctx, 'WAY FORWARD', 1, 160);
  const B = [['UN Charter, Art 33', 'negotiation · mediation · conciliation', 'Thirty-Three'], ['IAEA', 'nuclear-safety principles for ZNPP', 'Nuclear safety'], ['ICRC', 'neutral intermediary for humanitarian access', 'Red Cross'], ['India', 'dialogue & diplomacy · Global South voice on food, fuel, fertiliser', 'India']];
  B.forEach(([h, sub, cw], i) => {            // stacks top-down, so the first block sits in the top third
    const a = appear(s.t, s.w(cw) - 0.3), y = 220 + i * 190, drop = (1 - a) * -60;
    card(ctx, 200, y + drop, 1520, 160, { accent: i === 3 ? C.yellow : C.blue, stroke: i === 3 ? C.yellow : null, alpha: a });
    text(ctx, h, 260, y + drop + 70, { font: F.head(48), alpha: a, color: i === 3 ? C.yellow : C.white }); text(ctx, sub, 260, y + drop + 124, { font: F.ui(32, 600), color: '#C9CFD6', alpha: a });
  });
  vignette(ctx, 0.35);
};
SCENES.S31 = (ctx, s) => {
  bg(ctx); pill(ctx, 'GS-2 · 15 MARKS · 250 WORDS', 80, 130, { font: F.ui(30, 800), h: 56 });
  card(ctx, 140, 210, 1640, 330, { accent: C.yellow });
  const hi = s.t > s.w('fifteen-marker') + 0.3 ? ['Examine', 'discuss'] : [];
  revealWords(ctx, '“A ceasefire in one town is not peace in a country.” Examine the significance and limits of localised humanitarian ceasefires in the Russia–Ukraine conflict, and discuss India\'s stake in a negotiated settlement.', 200, 290, 1, { font: F.head(42), maxW: 1520, lh: 56, highlight: hi });
  [['INTRO', '"On 27 Oct 2026, a humanitarian pause began around Oleshky…" + define a pause', 'Open'], ['BODY', 'significance · limits · India\'s stake (energy, food, nuclear safety, Global South)', 'body'], ['CONCLUSION', '"Pauses become peace only when tied to a political track (UN Charter, Art 33)."', 'conclude']].forEach(([h, sub, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = 580 + i * 150, dx = (1 - a) * 80;
    card(ctx, 140 + dx, y, 1640, 128, { alpha: a, stroke: 'rgba(255,255,255,0.15)' });
    text(ctx, h, 190 + dx, y + 76, { font: F.ui(30, 800), color: C.yellow, alpha: a }); text(ctx, sub, 450 + dx, y + 76, { font: F.ui(30, 600), maxW: 1300, alpha: a });
  });
  vignette(ctx, 0.35);
};

// ---------------- recap + checkpoint ----------------
SCENES.S32 = (ctx, s) => {
  const tc = s.w('copy') - 0.2, k = ease(span(s.t, tc, tc + 0.8)), rev = s.hold ? s.hold.at + s.hold.dur : s.d - 1;
  // the map shrinks into the left two-thirds so the blanks card never covers it
  bg(ctx); ctx.save(); ctx.translate(lerp(0, 10, k), lerp(0, 175, k)); ctx.scale(lerp(1, 0.68, k), lerp(1, 0.68, k));
  fragMap(ctx, s, [1, 1, 1, 1, 1, 1], { india: true, noBg: k > 0 });
  ctx.restore();
  if (k > 0) {
    card(ctx, 1330, 200, 560, 620, { fill: 'rgba(20,23,28,0.97)', stroke: C.yellow, lw: 3, alpha: k });
    const R = [['River =', 'frontline'], ['Turkish Straits treaty =', 'Montreux'], ['Dam breached on', '6 Jun 2023']];
    R.forEach(([q, v], i) => { const y = 300 + i * 170, on = s.t >= rev; text(ctx, q, 1370, y, { font: F.ui(34, 800), alpha: k, maxW: 490 }); text(ctx, on ? v : '________', 1370, y + 76, { font: on ? F.hand(60) : F.ui(40, 800), color: C.yellow, alpha: on ? pop(s.t, rev + i * 0.2) || 0.01 : k }); });
    if (s.t < rev) text(ctx, 'pause · copy · fill', 1610, 790, { font: F.hand(44), align: 'center', color: C.dim, alpha: k });
  }
  // the three recap lines, large and centred, one per sentence
  const L = [['1 · The river is the frontline → truces must be tiny', 'frontline'], ['2 · The dam turned land into water + nuclear', 'Kakhovka'], ['3 · India: energy vs principle', 'strategic']];
  const cur = L.filter(([, cw]) => s.t >= s.w(cw) - 0.3).length - 1;
  if (cur >= 0 && k < 1) {
    const a = appear(s.t, s.w(L[cur][1]) - 0.3) * (1 - k);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(14,16,20,0.9)'; ctx.fillRect(0, 960, W, 96); ctx.restore();
    text(ctx, L[cur][0], 960, 1022, { font: F.ui(40, 800), align: 'center', alpha: a });
  }
};
SCENES.S33 = (ctx, s) => pauseCard(ctx, s, 'How did one dam\'s breach put both Crimea\'s water and a nuclear plant\'s safety at risk?');
function answerMap(ctx, s) {
  const proj = camera(34.3, 46.75, lerp(8.3, 8.45, s.p));
  baseMap(ctx, proj); raster(ctx, proj, A.kakhovka_after, A.kakhovka_after_meta, { alpha: 0.95, feather: 90 });
  const [rx, ry] = proj(P.reservoir), gl = 0.6 + 0.4 * Math.sin(s.t * 3);
  ctx.save(); ctx.globalAlpha = appear(s.t, 0.2); ctx.shadowColor = C.yellow; ctx.shadowBlur = 40 * gl; ctx.strokeStyle = C.yellow; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(rx, ry, 190, 80, -0.35, 0, 7); ctx.stroke(); ctx.restore();
  text(ctx, 'Kakhovka reservoir (drained)', rx - 60, ry + 130, { font: F.ui(32, 800), align: 'center', color: C.yellow, alpha: appear(s.t, 0.2), shadow: 8 });
  const tc = s.w('Canal') - 0.3, tz = s.w('cooling') - 0.3;
  arrow(ctx, CANAL.map(c => proj(c)), span(s.t, tc, tc + 1.6), { color: C.blue, lw: 7, dash: [14, 10] });
  mapLabel(ctx, proj, [34.4, 45.45], 'CANAL → CRIMEA', { font: F.ui(32, 800), color: '#9CC8EA', alpha: appear(s.t, tc + 1.2) });
  arrow(ctx, [proj([34.1, 47.3]), proj([34.4, 47.45]), proj(P.znpp)], span(s.t, tz, tz + 1.0), { color: C.red, lw: 7 });
  pin(ctx, proj, P.znpp, 'ZNPP cooling water', { alpha: appear(s.t, tz + 0.8), color: C.red, font: F.ui(30, 800), dx: 24, dy: 8 });
  const st = pop(s.t, s.w('both lost') - 0.1);
  if (st > 0) { ctx.save(); ctx.translate(1450, 640); ctx.scale(st, st); pill(ctx, 'ONE RESERVOIR · TWO LIFELINES', -330, -30, { fill: C.yellow, font: F.ui(36, 800), h: 62 }); ctx.restore(); }
  s.credit = 'Contains modified Copernicus Sentinel data 2023 · ' + TERRAIN; vignette(ctx, 0.4);
}
SCENES.S39 = answerMap;
SCENES.S40 = answerMap;

// ---------------- verdict + end screen ----------------
SCENES.S34 = (ctx, s) => desk(ctx, s.t, { lamp: lerp(1, 0.6, span(s.t, 0, 12)), lines: [{ s: 'A pause is a door' }, { s: 'left ajar.' }], handSize: 80, write: span(s.t, s.w('door') - 0.5, s.w('door') + 3.5) });
SCENES.S35 = (ctx, s) => {
  desk(ctx, s.t, { lamp: 0.6, book: false });
  ctx.fillStyle = 'rgba(10,12,15,0.55)'; ctx.fillRect(0, 0, W, H);
  text(ctx, 'Notes · map · MCQ challenge → pinned comment', 960, 200, { font: F.head(54), align: 'center', alpha: appear(s.t, s.w('notes') - 0.2) });
  [[240, "Sunday's masterclass (hub video)"], [1000, 'Story arc · Russia–Ukraine']].forEach(([x, l]) => {
    card(ctx, x, 330, 680, 383, { fill: 'rgba(38,43,51,1)', stroke: 'rgba(255,255,255,0.35)', r: 12, alpha: appear(s.t, s.w('linked') - 0.2) });
    text(ctx, 'END-SCREEN ELEMENT', x + 340, 500, { font: F.ui(26, 800), align: 'center', color: C.faint, alpha: appear(s.t, s.w('linked') - 0.2) });
    text(ctx, l, x + 340, 548, { font: F.ui(30, 600), align: 'center', color: C.dim, alpha: appear(s.t, s.w('linked') - 0.2) });
  });
  pill(ctx, 'SEE YOU AT THE DECODE DESK', 700, 800, { font: F.ui(32, 800), h: 60, alpha: appear(s.t, s.w('Decode Desk') - 0.2) });
};
