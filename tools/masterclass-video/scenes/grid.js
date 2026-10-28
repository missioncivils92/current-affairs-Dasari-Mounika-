// Scenes for the W44 Prelims Grid (weeks/2026-W44/prelims-grid), v1.
// One colour-coded Glimpse card per item: what happened → the static set → one trap. The same card is reused in the PDF.
// Each scene: SCENES.Sxx = (ctx, s) with s = {t, d, p, w(word), hold}; numbers appear at their final value only.
const CAT = {
  N: { name: 'NATIONAL', fill: C.yellow, ink: C.slate, edge: C.yellow },
  I: { name: 'INTERNATIONAL', fill: C.blue, ink: C.white, edge: C.blue },
  M: { name: 'MISC', fill: 'rgba(0,0,0,0)', ink: C.white, edge: C.white },
};
const ORDER = ['N', 'N', 'N', 'N', 'N', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'M', 'M', 'M', 'M'];
const NI = ORDER.length;
const TERRAIN = 'Elevation: Terrain Tiles (Mapzen/AWS) · Boundaries: Natural Earth; India: Survey of India outline (DataMeet)';

// progress strip: one square per item, the current one lit
function gridStrip(ctx, k, a = 1) {
  const w = 30, g = 8, x0 = 60, y = 1036;
  ORDER.forEach((c, i) => {
    const on = i === k, col = CAT[c].edge;
    ctx.save(); ctx.globalAlpha = a * (on ? 1 : 0.45);
    rr(ctx, x0 + i * (w + g), y - (on ? 6 : 0), w, on ? 20 : 14, 4);
    if (c === 'M') { ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke(); } else { ctx.fillStyle = col; ctx.fill(); }
    ctx.restore();
  });
}
function catPill(ctx, c, k, x, y, a = 1) {
  const st = CAT[c];
  ctx.save(); ctx.globalAlpha *= a; ctx.font = F.ui(28, 800);
  const label = `${st.name} · ${k + 1}/${NI}`, w = ctx.measureText(label).width + 40;
  rr(ctx, x, y, w, 52, 26); if (c === 'M') { ctx.strokeStyle = C.white; ctx.lineWidth = 2.5; ctx.stroke(); } else { ctx.fillStyle = st.fill; ctx.fill(); }
  ctx.fillStyle = st.ink; ctx.textBaseline = 'middle'; ctx.fillText(label, x + 20, y + 27); ctx.restore();
}
// the trap strip lands on "Prelims Trap"
function trapStrip(ctx, s, msg, x = 140, y = 820, w = 1640) {
  const a = appear(s.t, s.w('prelims trap') - 0.3);
  card(ctx, x, y, w, 120, { fill: 'rgba(229,72,77,0.16)', stroke: C.red, lw: 3, alpha: a });
  pill(ctx, 'PRELIMS TRAP', x + 30, y + 35, { fill: C.red, color: C.white, font: F.ui(26, 800), h: 50, alpha: a });
  text(ctx, msg, x + 300, y + 72, { font: F.ui(34, 700), alpha: a, maxW: w - 340 });
}
// a full Glimpse card: title + static lines (each on its cue) + trap
function glimpse(ctx, s, o) {
  bg(ctx);
  const c = ORDER[o.k], st = CAT[o.k === undefined ? 'N' : c];
  card(ctx, 120, 110, 1680, 680, { stroke: c === 'M' ? 'rgba(255,255,255,0.6)' : st.edge, lw: 3, accent: c === 'M' ? null : st.edge, bar: 10 });
  catPill(ctx, c, o.k, 170, 150);
  text(ctx, o.title, 170, 290, { font: F.head(o.titleSize || 58), maxW: 1560, lh: 70, alpha: appear(s.t, 0.1) });
  (o.lines || []).forEach(([l, cw, col], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = (o.linesY || 430) + i * 92;
    text(ctx, l, 170 + (1 - a) * 30, y, { font: F.ui(38, 700), color: col || C.white, alpha: a, maxW: 1560 });
  });
  if (o.extra) o.extra(a => a);
  if (o.trap) trapStrip(ctx, s, o.trap);
  gridStrip(ctx, o.k);
  if (o.credit) s.credit = o.credit;
  vignette(ctx, 0.3);
}
function terrainMap(ctx, proj, local) {
  bg(ctx, { inner: '#1A1F26', outer: '#0F1216' });
  raster(ctx, proj, A.wide, A.wide_meta, { filter: 'brightness(0.9)' });
  if (local && A[local]) raster(ctx, proj, A[local], A[local + '_meta'], { feather: 160 });
  countries(ctx, proj, { wide: true, stroke: 'rgba(255,255,255,0.28)', lw: 1.2, indiaStroke: C.yellow, indiaLw: 2.2 });
  for (const l of A.geo.lakes) geo(ctx, proj, l.geom, { fill: 'rgba(74,144,194,0.55)' });
}
function mapCard(ctx, s, k, title, lines, x = 1180, y = 140, w = 640) {
  // measure first, so wrapped lines stack instead of overlapping
  const c = ORDER[k], st = CAT[c];
  ctx.save(); ctx.font = F.ui(30, 700); const nl = lines.map(([l]) => wrap(ctx, l, w - 60).length); ctx.restore();
  const h = 170 + nl.reduce((a, n) => a + n * 38 + 16, 0);
  card(ctx, x, y, w, h, { fill: 'rgba(20,23,28,0.92)', stroke: c === 'M' ? C.white : st.edge, lw: 3 });
  catPill(ctx, c, k, x + 30, y + 26);
  text(ctx, title, x + 30, y + 130, { font: F.head(42), maxW: w - 60 });
  let ly = y + 185;
  lines.forEach(([l, cw], i) => { text(ctx, l, x + 30, ly, { font: F.ui(30, 700), lh: 38, alpha: appear(s.t, s.w(cw) - 0.3), maxW: w - 60 }); ly += nl[i] * 38 + 16; });
  return y + h;
}

// ---------------- G.0 the grid board ----------------
SCENES.S00 = (ctx, s) => {
  bg(ctx);
  text(ctx, 'PRELIMS GRID · W44', 960, 170, { font: F.ui(40, 800), align: 'center', color: C.yellow });
  const flip = s.w('sixteen') - 0.4;
  ORDER.forEach((c, i) => {
    const col = i % 4, row = Math.floor(i / 4), x = 470 + col * 250, y = 220 + row * 185;
    const k = ease(span(s.t, flip + i * 0.08, flip + i * 0.08 + 0.4)), st = CAT[c];
    ctx.save(); ctx.translate(x + 105, y + 80); ctx.scale(Math.abs(Math.cos(Math.PI * k)) || 0.02, 1); ctx.translate(-(x + 105), -(y + 80));
    if (k < 0.5) card(ctx, x, y, 210, 160, { fill: '#2B3139', stroke: 'rgba(255,255,255,0.15)' });
    else { card(ctx, x, y, 210, 160, { fill: c === 'M' ? '#262B33' : st.fill, stroke: st.edge, lw: 3 }); text(ctx, st.name.slice(0, 5) === 'INTER' ? 'INTL' : st.name, x + 105, y + 90, { font: F.ui(26, 800), align: 'center', color: st.ink }); }
    ctx.restore();
  });
  text(ctx, 'what happened → the static fact → the trap', 960, 990, { font: F.hand(50), align: 'center', color: C.dim, alpha: appear(s.t, s.w('static') - 0.3) });
};
// ---------------- National ----------------
SCENES.S01 = (ctx, s) => {    // Cyclone Arnab
  const loc = 1 - span(s.t, 2.2, 2.8);
  const cam = camLerp({ lon: 81.6, lat: 17.4, zoom: 7.2 }, { lon: 82.25, lat: 16.85, zoom: 8.6 }, span(s.t, 1.6, 5));
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  terrainMap(ctx, proj, 'apcoast');
  arrow(ctx, [proj([85.6, 14.6]), proj([84.2, 15.6]), proj([82.6, 16.6]), proj([82.28, 16.93])], span(s.t, 1.2, 4.2), { color: C.red, lw: 7, dash: [16, 10] });
  mapLabel(ctx, proj, [84.6, 15.6], 'BAY OF BENGAL', { font: F.ui(30, 800), color: '#9CC8EA', italic: true });
  mapLabel(ctx, proj, [80.6, 17.6], 'ANDHRA PRADESH', { font: F.ui(32, 800), color: 'rgba(255,255,255,0.7)' });
  pin(ctx, proj, [82.247, 16.989], 'Kakinada', { alpha: appear(s.t, s.w('kakinada') - 0.3), color: C.white, dx: 18, dy: -16 });
  pin(ctx, proj, [82.214, 16.733], 'YANAM', { alpha: appear(s.t, s.w('yanam') - 0.3), sub: 'Puducherry UT', dx: -20, dy: 40, font: F.ui(34, 800) });
  if (loc > 0) locatorInset(ctx, 60, 120, 520, 420, [82.2, 16.8], loc);
  const cb = mapCard(ctx, s, 0, 'Cyclone Arnab', [['Very severe cyclonic storm · 28 Oct', 'very severe'], ['Name from Bangladesh\'s list', 'bangladesh'], ['Named by RSMC New Delhi (IMD)', 'regional']], 1180, 120);
  const tr = appear(s.t, s.w('prelims trap') - 0.3);
  card(ctx, 1180, cb + 24, 640, 150, { fill: 'rgba(229,72,77,0.2)', stroke: C.red, lw: 3, alpha: tr });
  text(ctx, 'TRAP: Yanam is in Puducherry UT, not Andhra Pradesh', 1210, cb + 84, { font: F.ui(32, 800), maxW: 580, lh: 40, alpha: tr });
  gridStrip(ctx, 0);
  s.credit = TERRAIN; vignette(ctx, 0.35);
};
SCENES.S02 = (ctx, s) => glimpse(ctx, s, { k: 1, title: 'IDBI Bank: 60.72% to a Fairfax company',
  lines: [['CCEA approval · 14 Oct 2026', 'fourteenth'], ['Government + LIC stakes together · ≈ ₹52,878 crore', 'sixty point'], ['Subject to RBI approval', 'subject', C.dim]],
  trap: 'A private sector bank (RBI category) since 2019, not a PSB', credit: 'Source: CCEA decision, 14 Oct 2026 (as reported)' });
SCENES.S03 = (ctx, s) => glimpse(ctx, s, { k: 2, title: 'RBI: Foreign Exchange Risk Reserve (FERR)',
  lines: [['20% reserve on rupee forex derivatives · 10 Oct', 'twenty per cent'], ['Unhedged-exposure threshold: $100 mn → $5 mn', 'five million']],
  trap: 'Issued under FEMA 1999 (civil law), not FERA 1973', credit: 'Source: RBI A.P. (DIR Series) Circular No. 26, 10 Oct 2026 (as reported)' });
SCENES.S04 = (ctx, s) => {    // GRAP ladder
  bg(ctx); catPill(ctx, 'N', 3, 140, 110);
  text(ctx, 'GRAP Stage I across Delhi-NCR · 21 Oct', 140, 250, { font: F.head(56) });
  const S = [['Stage I', 'Poor', '201–300', '#E8B931'], ['Stage II', 'Very Poor', '301–400', '#E0802F'], ['Stage III', 'Severe', '401–450', '#D9534F'], ['Stage IV', 'Severe +', '> 450', '#8E2C48']];
  const a0 = appear(s.t, s.w('four stages') - 0.4);
  S.forEach(([n, b, r, col], i) => {
    const x = 140 + i * 420, a = i === 0 ? appear(s.t, s.w('stage one') - 0.3) : a0;
    card(ctx, x, 320, 390, 300, { fill: 'rgba(38,43,51,0.96)', accent: col, bar: 12, alpha: a, stroke: i === 0 ? C.yellow : null, lw: 3 });
    text(ctx, n, x + 40, 400, { font: F.ui(34, 800), color: col, alpha: a }); text(ctx, b, x + 40, 470, { font: F.head(48), alpha: a }); text(ctx, 'AQI ' + r, x + 40, 560, { font: F.ui(34, 700), alpha: a });
  });
  pill(ctx, 'Delhi AQI 244 · 21 Oct', 180, 650, { fill: C.yellow, font: F.ui(30, 800), h: 54, alpha: appear(s.t, s.w('poor') - 0.3) });
  trapStrip(ctx, s, 'Invoked by CAQM (2021 Act), not CPCB, which only publishes the AQI');
  gridStrip(ctx, 3); s.credit = 'Source: CAQM order invoking GRAP Stage I, 21 Oct 2026'; vignette(ctx, 0.3);
};
SCENES.S05 = (ctx, s) => glimpse(ctx, s, { k: 4, title: 'Vigilance Awareness Week · 26 Oct – 1 Nov',
  lines: [['Theme: "Probity for Prosperity"', 'probity', C.yellow], ['In the week of Sardar Patel\'s birth anniversary (31 Oct)', 'sardar'], ['CVC: 1964 executive resolution, Santhanam Committee → statutory 2003', 'santhanam']],
  trap: 'The CVC is statutory (CVC Act 2003), not constitutional', credit: 'Source: CVC Circular, Sep 2026' });
// ---------------- International ----------------
SCENES.S06 = (ctx, s) => glimpse(ctx, s, { k: 5, title: 'India to join SIOFA as a full party',
  lines: [['Southern Indian Ocean Fisheries Agreement · signed Rome, 2006', 'southern'], ['Cooperating non-contracting party since 2022 → full party', 'four years'], ['High-seas fish such as toothfish and alfonsino', 'toothfish']],
  trap: 'No tuna: tuna is under the Indian Ocean Tuna Commission (IOTC)', credit: 'Source: Union Government approval, mid-Oct 2026 (PIB, as reported)' });
SCENES.S07 = (ctx, s) => {    // GHI
  glimpse(ctx, s, { k: 6, title: 'Global Hunger Index 2026: India 100th of 122', titleSize: 54,
    lines: [['Score 24.1 · "serious" · GoI disputes the method', 'twenty-four']],
    trap: 'Published by NGOs (Welthungerhilfe, Concern Worldwide), not FAO or WFP', credit: 'Source: Global Hunger Index 2026 (as reported)' });
  const chips = [['Undernourishment', false], ['Child stunting', true], ['Child wasting · 19.0%', true], ['Child mortality', true]];
  const a = appear(s.t, s.w('four indicators') - 0.3); let x = 170;
  chips.forEach(([l, kid]) => { x += 20 + pill(ctx, l, x, 560, { fill: kid ? C.blue : 'rgba(255,255,255,0.15)', color: C.white, font: F.ui(30, 800), h: 56, alpha: a }); });
  text(ctx, '3 of 4 indicators measure children', 170, 700, { font: F.hand(52), color: C.yellow, alpha: appear(s.t, s.w('three of them') - 0.3) });
};
SCENES.S08 = (ctx, s) => glimpse(ctx, s, { k: 7, title: 'Poland\'s PM in India · 21–23 Oct',
  lines: [['Target: double bilateral trade by 2030', 'double'], ['Poland to join the CDRI', 'c-d-r-i', C.yellow], ['CDRI: launched by India, 2019 · secretariat New Delhi', 'launched']],
  trap: 'CDRI is not the ISA (2015, HQ Gurugram)', credit: 'Source: India–Poland joint statement, 22 Oct 2026 (as reported)' });
SCENES.S09 = (ctx, s) => {    // BRICS Parliamentary Forum
  glimpse(ctx, s, { k: 8, title: '12th BRICS Parliamentary Forum · New Delhi', lines: [['Samvidhan Sadan · 26–27 Oct · chaired by the Lok Sabha Speaker', 'samvidhan'], ['India holds the BRICS chair in 2026', 'chair']],
    trap: 'Ten full members: Saudi Arabia is not one of them', credit: 'Source: Lok Sabha Secretariat / AIR, Oct 2026' });
  const M = ['Brazil', 'Russia', 'India', 'China', 'S. Africa', 'Egypt', 'Ethiopia', 'Iran', 'UAE', 'Indonesia'];
  const t0 = s.w('ten full') - 0.3; let x = 170;
  M.forEach((m, i) => { x += 12 + pill(ctx, m, x, 640, { fill: i < 5 ? 'rgba(255,255,255,0.18)' : C.blue, color: C.white, font: F.ui(26, 800), h: 48, alpha: appear(s.t, t0 + i * 0.2) }); });
};
SCENES.S10 = (ctx, s) => {    // CBD COP17, Yerevan
  const loc = 1 - span(s.t, 2.2, 2.8);
  const cam = camLerp({ lon: 58, lat: 32, zoom: 3.6 }, { lon: 47, lat: 38.5, zoom: 4.7 }, span(s.t, 1.4, 4.5));
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  terrainMap(ctx, proj);
  pin(ctx, proj, [44.51, 40.18], 'YEREVAN', { sub: 'Armenia', font: F.ui(36, 800), pulse: (s.t / 2) % 1, dx: -20, dy: -20 });
  if (loc > 0) locatorInset(ctx, 60, 120, 520, 420, [44.5, 40.2], loc);
  const cb = mapCard(ctx, s, 9, 'CBD COP17 · 19–30 Oct', [['First global review of the Kunming–Montreal Framework', 'review'], ['KMGBF (2022): 23 targets', 'twenty-three'], ['30x30: 30% of land AND 30% of sea by 2030', 'thirty by']], 1180, 120, 660);
  const tr = appear(s.t, s.w('prelims trap') - 0.3);
  card(ctx, 1180, cb + 24, 660, 140, { fill: 'rgba(229,72,77,0.2)', stroke: C.red, lw: 3, alpha: tr });
  text(ctx, 'TRAP: 30% land and 30% sea, not 30% combined', 1210, cb + 84, { font: F.ui(32, 800), maxW: 600, lh: 40, alpha: tr });
  gridStrip(ctx, 9); s.credit = TERRAIN; vignette(ctx, 0.35);
};
SCENES.S11 = (ctx, s) => {    // UNEP EGR
  bg(ctx); catPill(ctx, 'I', 10, 140, 110);
  text(ctx, 'UNEP Emissions Gap Report 2026 (21 Oct)', 140, 250, { font: F.head(54) });
  const B = [['Current policies', 2.8, 'two point eight'], ['All national pledges (NDCs) met', 2.6, 'two point six']];
  B.forEach(([l, v, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.4), y = 340 + i * 190, w = v / 3.0 * 1100;
    text(ctx, l, 140, y + 20, { font: F.ui(34, 700), alpha: a });
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = i ? '#E0802F' : C.red; rr(ctx, 140, y + 45, w, 70, 10); ctx.fill(); ctx.restore();
    text(ctx, `≈ ${v.toFixed(1)} °C`, 160 + w, y + 98, { font: F.head(56), color: C.white, alpha: a });
  });
  text(ctx, 'warming this century (projected)', 1400, 700, { font: F.hand(44), color: C.dim, alpha: appear(s.t, s.w('century') - 0.3) });
  trapStrip(ctx, s, 'UNEP\'s report: not the IPCC, not the UNFCCC secretariat');
  gridStrip(ctx, 10); s.credit = 'Source: UNEP Emissions Gap Report 2026 (as reported)'; vignette(ctx, 0.3);
};
// ---------------- Misc ----------------
SCENES.S12 = (ctx, s) => {    // Ramsar 103
  const cam = camLerp({ lon: 79.5, lat: 26.5, zoom: 5.4 }, { lon: 78.6, lat: 28.6, zoom: 6.0 }, s.p);
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  terrainMap(ctx, proj, 'northindia');
  pin(ctx, proj, [76.818, 30.742], 'Sukhna Wetland', { sub: 'Chandigarh UT', alpha: appear(s.t, s.w('sukhna') - 0.3), color: C.teal, dx: -20, dy: -20, font: F.ui(32, 800) });
  pin(ctx, proj, [79.02, 27.23], 'Sauj Jheel', { sub: 'Mainpuri, UP', alpha: appear(s.t, s.w('sauj') - 0.3), color: C.teal, font: F.ui(32, 800) });
  const cb = mapCard(ctx, s, 12, 'Ramsar sites: 103', [['Added 15 Oct 2026 · India joined in 1982', 'fifteenth'], ['Montreux Record (India): Keoladeo · Loktak', 'montreux'], ['Chilika: removed from it in 2002', 'chilika']], 1180, 120, 660);
  const tr = appear(s.t, s.w('prelims trap') - 0.3);
  card(ctx, 1180, cb + 24, 660, 140, { fill: 'rgba(229,72,77,0.2)', stroke: C.red, lw: 3, alpha: tr });
  text(ctx, 'TRAP: Chilika is no longer on the Montreux Record', 1210, cb + 84, { font: F.ui(32, 800), maxW: 600, lh: 40, alpha: tr });
  gridStrip(ctx, 12); s.credit = TERRAIN; vignette(ctx, 0.35);
};
SCENES.S13 = (ctx, s) => glimpse(ctx, s, { k: 13, title: 'GI tag (reported): Ambaji Mohanthal Prasad, Gujarat',
  lines: [['Look-alike: Tirupati Laddu (Andhra Pradesh) · GI 2009', 'tirupati'], ['Registry: Chennai · first GI: Darjeeling tea', 'chennai'], ['GI Act 1999 · registration lasts 10 years', 'ten years']],
  trap: 'Renewable every 10 years, again and again: not a one-time grant', credit: 'Source: Geographical Indications Registry (as reported)' });
SCENES.S14 = (ctx, s) => glimpse(ctx, s, { k: 14, title: 'Global Innovation Index 2026: India 38th of 139',
  lines: [['Top three: Switzerland · Sweden · United States', 'switzerland'], ['India: 1st among lower-middle-income economies', 'lower-middle', C.yellow]],
  trap: 'Published by WIPO, not the WEF or UNCTAD', credit: 'Source: WIPO, Global Innovation Index 2026 (as reported)' });
SCENES.S15 = (ctx, s) => glimpse(ctx, s, { k: 15, title: 'Three days to note',
  lines: [['27 Oct · Infantry Day · 1947 airlanding at Srinagar', 'infantry'], ['30 Oct · World Savings Day (India)', 'savings'], ['31 Oct · Rashtriya Ekta Diwas · Sardar Patel', 'ekta']],
  trap: 'India marks Savings Day on 30 Oct; most countries on 31 Oct' });
SCENES.S16 = (ctx, s) => glimpse(ctx, s, { k: 11, title: 'Loss and Damage Fund: first-ever allocation, Nepal', titleSize: 54,
  lines: [['$20 mn (provisional) for flood recovery · Board, 22 Oct', 'twenty million'], ['Agreed COP27 (2022) · operational COP28 (2023)', 'sharm'], ['Hosted by the World Bank · Board based in the Philippines', 'world bank']],
  trap: 'Not the Green Climate Fund (Songdo, South Korea)', credit: 'Source: FRLD Board decision, 22 Oct 2026 (as reported)' });
