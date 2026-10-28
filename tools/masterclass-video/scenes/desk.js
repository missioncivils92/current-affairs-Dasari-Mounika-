// Scenes for the W44 AP–TG Desk (weeks/2026-W44/aptg-desk), v3. Same notes-ready Glimpse kit as the Prelims Grid
// (engine.js), in teal: Local · Telugu States. Every card ends on a frame an aspirant can pause and copy: a labelled
// visual on the left, a "write this down" table on the right (with the primary state document), and the trap bar.
window.NO_PUSH = true;
const ORDER = ['L', 'L', 'L', 'L', 'L', 'L', 'L'];
GK = { order: ORDER, cat: { L: { name: 'LOCAL · TELUGU STATES', col: C.teal, ink: C.slate } } };
const WIN = GZ.win, NOTES = GZ.notes, ID = (p) => p;   // ID: identity "projection" for labelPill on charts
const RIVER = 'rgba(120,205,255,0.98)', CR = TERRAIN_CREDIT + ' · Rivers: Natural Earth';

function mapWin(ctx, s, west, south, east, north, draw, o = {}) {
  gWindow(ctx, s, (g, box) => {
    const proj = zoomProj(windowCamera(box, west, south, east, north), box, 1 + 0.04 * s.p);
    terrainMap(g, proj, o.local || 'telugu', o);
    if (o.sat) raster(g, proj, A[o.sat], A[o.sat + '_meta'], { feather: 50 });
    if (o.rivers) rivers(g, proj, o.rivers, { color: RIVER, lw: o.lw || 4 });
    draw(g, proj, box);
  }, { push: false });
}
function chartWin(ctx, s, draw) { gWindow(ctx, s, (g, box) => { g.fillStyle = '#1E2228'; g.fillRect(...box); draw(g, box); }, { push: false }); }
function item(ctx, s, k, title, sub) { glimpseBase(ctx, k); gHeader(ctx, s, k, title, sub); }
function riverLabel(g, proj, ll, s, a = 1) { mapLabel(g, proj, ll, s, { font: 'italic ' + F.ui(26, 800), color: '#BFE0FA', alpha: a }); }
function line(g, proj, pts, o = {}) {    // a schematic river course (lon/lat points), drawn in the river colour
  g.save(); g.globalAlpha *= o.alpha ?? 1; g.strokeStyle = o.color || RIVER; g.lineWidth = o.lw || 5; g.lineCap = g.lineJoin = 'round';
  if (o.dash) g.setLineDash(o.dash); g.beginPath(); pts.map(p => proj(p)).forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke(); g.restore();
}

// ---------------- A.0 checkpoint answer (Deep Dive 1) ----------------
SCENES.S01 = (ctx, s) => {
  desk(ctx, s.t, { book: false, lamp: 0.95 });
  const a = appear(s.t, 0.2), b = appear(s.t, s.w('directive') - 0.3);
  card(ctx, 260, 160, 1400, 480, { stroke: C.yellow, lw: 3, alpha: a });
  pill(ctx, 'CHECKPOINT ANSWER', 320, 210, { alpha: a, font: F.ui(28, 800), h: 50 });
  text(ctx, 'The RPwD Act, 2016: a statute that courts enforce', 320, 340, { font: F.head(52), color: C.yellow, alpha: appear(s.t, s.w('statute') - 0.3), maxW: 1280, lh: 66 });
  text(ctx, 'Article 41 is a Directive Principle: not enforceable by any court (Art 37)', 320, 520, { font: F.ui(38, 700), alpha: b, maxW: 1280, lh: 50 });
  lowerThird(ctx, 'AP–TG Desk · Local: Telugu States', appear(s.t, 0.6));
};

// ---------------- D.1 AP BC quota · judgment chain ----------------
SCENES.S02 = (ctx, s) => {
  item(ctx, s, 0, 'AP\'s BC quota in local bodies struck down', 'AP High Court, 1 Oct → Supreme Court dismisses the State\'s appeal, 9 Oct');
  gTable(ctx, s, 0, WIN, [['Year', 0.17], ['Case / order', 0.37], ['What it held', 0.46]],
    [[['1992', 'Indra Sawhney', '50% ceiling on reservation']],
     [['2010', 'K. Krishna Murthy (5 judges)', 'Local-body BC quota needs a rigorous inquiry']],
     [['2021', 'Vikas Kishanrao Gawali', 'The triple test'], 'triple', { hl: true }],
     [['1 Oct 2026', 'AP High Court', '34% BC quota orders set aside'], 'first'],
     [['9 Oct 2026', 'Supreme Court', 'State\'s appeal dismissed'], 'ninth']], { size: 26, rowH: 106 });
  gNotes(ctx, s, 0, [['Enabling only', 'Art 243D(6) panchayats · Art 243T(6) municipalities', '243d6', { hl: true }],
    ['Triple test', '1 dedicated commission · 2 body-wise proportion · 3 total ≤ 50%', 'triple'],
    ['AP next', 'Cabinet adopted the dedicated commission\'s report, 10 Oct'],
    ['Document', 'AP High Court order, 1 Oct 2026']]);
  gTrap(ctx, s, 'Art 243D makes a BC quota mandatory', 'Enabling only: 243D(6) · total ≤ 50%');
  finish(ctx, s, 0, 'Sources: AP High Court (1 Oct) and Supreme Court (9 Oct) orders; AP Cabinet, 10 Oct (as reported)');
};

// ---------------- D.2 Telangana HC acting CJ · Article set ----------------
SCENES.S03 = (ctx, s) => {
  item(ctx, s, 1, 'Telangana HC: an acting Chief Justice', 'Justice P. Sam Koshy · after the Chief Justice\'s elevation to the Supreme Court');
  gTable(ctx, s, 1, WIN, [['Article', 0.2], ['High Courts: the look-alike set', 0.8]],
    [[['214', 'A High Court for each State']],
     [['217', 'Judges appointed by the President (after consulting the CJI and the Governor)']],
     [['223', 'Acting Chief Justice: appointed by the President'], 'president', { hl: true }],
     [['224', 'Additional and acting judges']],
     [['224A', 'Retired judges may be asked to sit']],
     [['231', 'One High Court for two or more States']]], { size: 26, rowH: 88 });
  gNotes(ctx, s, 1, [['Acting CJ', 'Justice P. Sam Koshy', 'koshy', { big: true }],
    ['Telangana HC', 'Its own High Court since 1 Jan 2019 (until then shared with AP)', null, { hl: true }],
    ['Document', 'Ministry of Law notification, Oct 2026']]);
  gTrap(ctx, s, 'The CJI appoints an acting Chief Justice', 'The President · Article 223');
  finish(ctx, s, 1, 'Source: Union Ministry of Law notification, Oct 2026 (as reported); Constitution of India');
};

// ---------------- D.3 Telugu States Lens: NTR Bharosa ----------------
SCENES.S04 = (ctx, s) => {
  item(ctx, s, 2, 'Telugu States Lens: who pays AP\'s pension?', 'NTR Bharosa · links to Deep Dive 1 (NSAP)');
  chartWin(ctx, s, (g, [x, y, w, h]) => {
    const b = appear(s.t, s.w('four thousand') - 0.3), c = appear(s.t, s.w('two hundred') - 0.3);
    text(g, 'An elderly pensioner in AP gets ₹4,000 a month', x + 40, y + 70, { font: F.ui(32, 800), alpha: b });
    const x0 = x + 40, x1 = x + w - 40, by = y + 110, cS = x0 + (x1 - x0) * 200 / 4000;
    g.save(); g.globalAlpha = b; g.fillStyle = C.teal; g.fillRect(x0, by, x1 - x0, 96); g.globalAlpha = c; g.fillStyle = C.yellow; g.fillRect(x0, by, cS - x0, 96); g.restore();
    text(g, 'State ₹3,800', x1 - 24, by + 62, { font: F.ui(34, 800), color: C.slate, align: 'right', alpha: b });
    labelPill(g, ID, [cS - 10, by + 150], 'Centre ₹200 (NSAP) ≈ one twentieth', { align: 'left', alpha: c, fill: 'rgba(245,211,0,0.95)', color: C.slate });
    g.save(); g.globalAlpha = c; g.strokeStyle = C.yellow; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 + 10, by + 96); g.lineTo(x0 + 10, by + 128); g.stroke(); g.restore();
    const q = appear(s.t, s.w('group-1') - 0.3);
    g.save(); g.globalAlpha = q; rr(g, x + 40, y + 330, w - 80, 220, 14); g.strokeStyle = C.teal; g.lineWidth = 3; g.stroke(); g.restore();
    text(g, 'GROUP-1 MAINS STYLE', x + 70, y + 380, { font: F.ui(24, 800), color: C.teal, alpha: q });
    text(g, 'Describe the State\'s social security pensions and the role of central assistance.', x + 70, y + 440, { font: F.head(36), maxW: w - 140, lh: 46, alpha: q });
  });
  gTable(ctx, s, 2, NOTES, [['NSAP scheme', 0.56], ['Centre pays', 0.44]],
    [[['Old age (IGNOAPS) 60–79', '₹200 a month'], 'two hundred', { hl: true }], [['Old age, 80 and above', '₹500 a month']],
     [['Widow (IGNWPS)', '₹300 a month']], [['Disability (IGNDPS)', '₹300 a month']], [['Family Benefit (NFBS)', '₹20,000 once']], [['Annapurna', '10 kg grain a month']]], { size: 24, rowH: 86 });
  finish(ctx, s, 2, 'Sources: Govt of Andhra Pradesh (NTR Bharosa); NSAP guidelines, Ministry of Rural Development');
};

// ---------------- D.4 KRMB / GRMB · boards vs tribunals ----------------
SCENES.S05 = (ctx, s) => {
  item(ctx, s, 3, 'Two river boards meet', 'Scheduled: KRMB 26 Oct · GRMB 30 Oct · Polavaram backwater on the GRMB agenda');
  mapWin(ctx, s, 76.4, 13.6, 83.6, 19.9, (g, proj) => {
    riverLabel(g, proj, [77.9, 16.55], 'Krishna', appear(s.t, s.w('krishna') - 0.3));
    riverLabel(g, proj, [79.0, 19.15], 'Godavari', appear(s.t, s.w('godavari') - 0.3));
    riverLabel(g, proj, [77.3, 15.3], 'Tungabhadra');
    [['Srisailam', [78.87, 16.08], [-90, 40]], ['Nagarjuna Sagar', [79.31, 16.57], [40, 50]], ['Polavaram', [81.66, 17.27], [30, -50], 'polavaram']].forEach(([n, ll, off, cw]) => {
      const a = cw ? appear(s.t, s.w(cw) - 0.3) : 1; pin(g, proj, ll, null, { r: 9, color: C.teal, alpha: a }); labelPill(g, proj, ll, n, { off, font: F.ui(24, 800), alpha: a });
    });
  }, { rivers: ['Krishna', 'Godavari', 'Tungabhadra', 'Bhima'], states: { labels: { 'Telangana': [78.9, 18.0], 'Andhra Pradesh': [79.3, 14.9] } } });
  gTable(ctx, s, 3, NOTES, [['Body', 0.38], ['Basis', 0.62]],
    [[['KRMB · GRMB', 'AP Reorganisation Act 2014, s.85'], 'reorganisation', { hl: true }],
     [['Apex Council', 's.84 · Jal Shakti Minister + both CMs']],
     [['Polavaram', 'National project · s.90']],
     [['KWDT-I · II', 'Bachawat (1973) · Brijesh Kumar (2010)']],
     [['GWDT', 'Bachawat (1980)']],
     [['Tribunals', 'Inter-State River Water Disputes Act 1956 · Art 262'], 'article']], { size: 24, rowH: 88 });
  gTrap(ctx, s, 'The river boards are Art 262 tribunals', 'Boards: APRA 2014 · tribunals: 1956 Act');
  finish(ctx, s, 3, CR + ' · Jurisdiction: Ministry of Jal Shakti notification, July 2021');
};

// ---------------- D.5 Tummidihatti · the Pranahita ----------------
SCENES.S06 = (ctx, s) => {
  item(ctx, s, 4, 'Tummidihatti: how high should the barrage be?', '26 Oct · Telangana CM\'s talks in Mumbai · a joint committee of officials');
  const wardha = [[78.75, 20.75], [79.0, 20.3], [79.3, 19.9], [79.55, 19.68], [79.82, 19.58]];
  const pranahita = [[79.82, 19.58], [79.86, 19.45], [79.92, 19.15], [79.91, 18.81]];
  mapWin(ctx, s, 78.3, 18.45, 81.2, 20.95, (g, proj) => {
    line(g, proj, wardha, { lw: 5, dash: [14, 8] });
    line(g, proj, pranahita, { lw: 9, color: '#9CD2FF' });
    riverLabel(g, proj, [79.0, 20.62], 'Wardha', appear(s.t, s.w('wardha') - 0.3));
    riverLabel(g, proj, [80.35, 20.45], 'Wainganga', appear(s.t, s.w('wainganga') - 0.3));
    riverLabel(g, proj, [79.2, 18.62], 'Godavari');
    labelPill(g, proj, [79.89, 19.3], 'PRANAHITA', { off: [150, 0], fill: 'rgba(156,210,255,0.95)', color: C.slate, alpha: appear(s.t, s.w('pranahita') - 0.3) });
    pin(g, proj, [79.86, 19.46], null, { r: 10, color: C.teal }); labelPill(g, proj, [79.86, 19.46], 'Tummidihatti (approx.)', { off: [-170, -40], font: F.ui(24, 800), alpha: appear(s.t, s.w('tummidihatti') - 0.3) });
    pin(g, proj, [79.91, 18.81], null, { r: 9, color: C.white }); labelPill(g, proj, [79.91, 18.81], 'Kaleshwaram · joins the Godavari', { off: [190, 20], font: F.ui(24, 800) });
    mapLabel(g, proj, [80.3, 20.1], 'MAHARASHTRA', { font: F.ui(26, 800), color: 'rgba(255,255,255,0.8)' });
    mapLabel(g, proj, [79.15, 19.1], 'TELANGANA', { font: F.ui(26, 800), color: 'rgba(255,255,255,0.8)' });
  }, { rivers: ['Godavari', 'Wainganga'], states: {} });
  gNotes(ctx, s, 4, [['Telangana wants (FRL)', '152 m', 'one hundred and fifty-two', { big: true }],
    ['Agreed in 2016 (Telangana says)', '148 m', 'forty-eight', { big: true }],
    ['Outcome', 'A joint committee of officials', 'joint', { hl: true }],
    ['River', 'Pranahita = Wardha + Wainganga → Godavari at Kaleshwaram', 'pranahita']]);
  gTrap(ctx, s, 'The barrage is on the Godavari main stem', 'On the Pranahita (Wardha + Wainganga)');
  finish(ctx, s, 4, CR + ' · Wardha and Pranahita courses schematic');
};

// ---------------- D.6 Arnab: the State's response · DM Act tiers ----------------
SCENES.S07 = (ctx, s) => {
  item(ctx, s, 5, 'Arnab: who runs the response?', '28 Oct · Very Severe Cyclonic Storm · Godavari delta coast');
  mapWin(ctx, s, 81.1, 16.45, 82.6, 17.2, (g, proj, [x, y]) => {
    pin(g, proj, [82.247, 16.989], null, { r: 8, color: C.white }); labelPill(g, proj, [82.247, 16.989], 'Kakinada', { off: [0, -46], font: F.ui(24, 800) });
    pin(g, proj, [82.214, 16.733], null, { r: 9 }); labelPill(g, proj, [82.214, 16.733], 'Yanam · Puducherry UT', { off: [0, 50], font: F.ui(24, 800), fill: 'rgba(245,211,0,0.92)', color: C.slate });
    const T = [['NDMA', 'Prime Minister', 's.3', 'prime minister'], ['SDMA', 'Chief Minister', 's.14', 'chief minister'], ['DDMA', 'Collector', 's.25', 'collector']];
    T.forEach(([b, ch, sec, cw], i) => {
      const a = appear(s.t, s.w(cw) - 0.3), yy = y + 40 + i * 150, hl = i === 1;
      g.save(); g.globalAlpha = a; rr(g, x + 30, yy, 470, 116, 12); g.fillStyle = hl ? 'rgba(43,179,163,0.95)' : 'rgba(20,23,28,0.92)'; g.fill(); g.restore();
      text(g, b + ' · ' + sec, x + 56, yy + 46, { font: F.ui(26, 800), color: hl ? C.slate : C.teal, alpha: a });
      text(g, 'Chair: ' + ch, x + 56, yy + 92, { font: F.ui(32, 800), color: hl ? C.slate : C.white, alpha: a });
      if (i) arrow(g, [[x + 265, yy - 32], [x + 265, yy - 4]], a, { color: 'rgba(255,255,255,0.7)', lw: 3 });
    });
    text(g, 'Disaster Management Act, 2005', x + 34, y + 520, { font: F.ui(24, 800), color: C.white, shadow: 6 });
  }, { local: 'apcoast', sat: 'arnab_coast' });
  gNotes(ctx, s, 5, [['NDRF', 'Constituted under s.44 of the same Act'], ['Warnings', 'IMD is the RSMC New Delhi for the north Indian Ocean'],
    ['State link', 'National cyclone set: Prelims Grid card 01'], ['Document', 'APSDMA bulletins, 27–28 Oct']]);
  gTrap(ctx, s, 'The SDMA is chaired by the Governor', 'The Chief Minister · s.14, DM Act 2005');
  finish(ctx, s, 5, SENT_CREDIT + ' · ' + TERRAIN_CREDIT);
};

// ---------------- D.7 Kolleru · lakes look-alike set ----------------
SCENES.S08 = (ctx, s) => {
  item(ctx, s, 6, 'Kolleru: a sanctuary\'s limits', 'AP asks the SC\'s Central Empowered Committee to exclude ≈ 20,000 acres (as reported)');
  mapWin(ctx, s, 80.85, 16.2, 81.8, 16.95, (g, proj) => {
    labelPill(g, proj, [81.22, 16.63], 'KOLLERU · freshwater', { fill: 'rgba(43,179,163,0.95)', color: C.slate, alpha: appear(s.t, s.w('kolleru') - 0.3) });
    labelPill(g, proj, [81.0, 16.3], 'Krishna delta side', { font: F.ui(24, 800), alpha: appear(s.t, s.w('deltas') - 0.3) });
    labelPill(g, proj, [81.6, 16.85], 'Godavari delta side', { font: F.ui(24, 800), alpha: appear(s.t, s.w('deltas') - 0.3) });
    pin(g, proj, [81.1, 16.71], null, { r: 8, color: C.white }); labelPill(g, proj, [81.1, 16.71], 'Eluru', { off: [-60, -30], font: F.ui(24, 800) });
  }, { sat: 'kolleru_wide' });
  gTable(ctx, s, 6, NOTES, [['Lake', 0.3], ['Type · State · Ramsar', 0.7]],
    [[['Kolleru', 'Freshwater · AP · 2002'], 'freshwater', { hl: true }],
     [['Chilika', 'Brackish lagoon · Odisha · 1981'], 'chilika', { trapCol: 1 }],
     [['Pulicat', 'Brackish lagoon · AP–Tamil Nadu'], 'pulicat'],
     [['Sambhar', 'Saline · Rajasthan · 1990']],
     [['Loktak', 'Freshwater · phumdis · Manipur · 1990']]], { size: 24, rowH: 104 });
  gTrap(ctx, s, 'Kolleru is a brackish lagoon like Chilika', 'Freshwater · between the two deltas');
  finish(ctx, s, 6, SENT_CREDIT + ' · Ramsar Sites Information Service');
};

// ---------------- D.R Telugu States sheet ----------------
const SHEET = [
  ['01', 'BC quota', 'AP HC 1 Oct, SC 9 Oct · Art 243D(6) enabling · triple test (Gawali 2021) · ≤ 50%'],
  ['02', 'Telangana HC', 'Acting CJ Justice P. Sam Koshy · appointed by the President, Art 223'],
  ['03', 'NTR Bharosa', '₹4,000 a month · Centre ₹200 (IGNOAPS) ≈ one twentieth'],
  ['04', 'KRMB · GRMB', 'APRA 2014 (s.85) boards · not Art 262 tribunals (1956 Act)'],
  ['05', 'Tummidihatti', 'Pranahita = Wardha + Wainganga · FRL 152 m sought vs 148 m (2016)'],
  ['06', 'DM Act 2005', 'NDMA PM (s.3) · SDMA CM (s.14) · DDMA Collector (s.25) · NDRF s.44'],
  ['07', 'Kolleru', 'Freshwater, between the deltas · Ramsar 2002 · Chilika, Pulicat brackish'],
];
SCENES.S11 = (ctx, s) => {
  glimpseBase(ctx, 0);
  text(ctx, 'TELUGU STATES SHEET · AP–TG DESK W44', 96, 110, { font: F.ui(30, 800), color: C.teal });
  text(ctx, 'Pause and copy · the question that follows tests it', 96, 156, { font: F.ui(26, 600), color: C.dim });
  SHEET.forEach(([n, it, fact], i) => {
    const y = 200 + i * 112, a = appear(s.t, 0.2 + i * 0.12, 0.35);
    const rc = ACC[i % ACC.length];
    ctx.save(); ctx.globalAlpha = a; rr(ctx, 96, y, 1728, 98, 10); ctx.fillStyle = tint(rc, 0.13); ctx.fill(); ctx.fillStyle = rc; ctx.fillRect(96, y, 8, 98); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; rr(ctx, 116, y + 23, 60, 52, 10); ctx.fillStyle = rc; ctx.fill(); ctx.restore();
    text(ctx, n, 146, y + 61, { font: F.ui(28, 800), color: C.slate, align: 'center', alpha: a });
    text(ctx, it, 200, y + 61, { font: F.ui(30, 800), color: rc, alpha: a });
    text(ctx, fact, 520, y + 61, { font: F.ui(28, 600), color: '#E3E7EC', alpha: a });
  });
};

// ---------------- D.8–D.9 the Group-1 question ----------------
const Q = ['1. The Pranahita is formed by the Wardha and the Wainganga.', '2. The State Disaster Management Authority is chaired by the Governor.',
  '3. The Krishna and Godavari River Management Boards were set up under the Andhra Pradesh Reorganisation Act, 2014.'];
function g1Paper(ctx, s, o = {}) {
  bg(ctx, { inner: '#22262D' });
  ctx.save(); ctx.translate(960, 540); ctx.rotate(-0.008); ctx.translate(-960, -540);
  card(ctx, 180, 70, 1560, 940, { fill: '#EDE6D6', r: 6 });
  ctx.fillStyle = C.teal; ctx.fillRect(180, 70, 1560, 16);
  text(ctx, 'GROUP-1 STYLE · Consider the following statements:', 240, 170, { font: F.head(40), color: '#1E2228' });
  // five reveal steps (three statements, the stem, the options), each reaching full opacity once typed = 1
  const typed = o.typed ?? 1, step = i => clamp(typed * 5 - i);
  Q.forEach((m, i) => {
    const y = 270 + i * 130;
    text(ctx, m, 270, y, { font: F.ui(36, 600), color: '#1E2228', alpha: step(i), maxW: 1400, lh: 46 });
    if (i === 1 && o.strike > 0) strike(ctx, 265, 1390, y - 12, o.strike);
  });
  text(ctx, 'How many of the above statements are correct?', 240, 700, { font: F.head(40), color: '#1E2228', alpha: step(3) });
  ['(a) Only one', '(b) Only two', '(c) All three', '(d) None'].forEach((op, i) => {
    const x = 270 + i * 360; text(ctx, op, x, 800, { font: F.ui(36, 700), color: '#1E2228', alpha: step(4) });
    if (i === 1 && o.circle > 0) { ctx.save(); ctx.strokeStyle = '#C08A00'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x + 100, 788, 140, 44, -0.04, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * easeOut(o.circle)); ctx.stroke(); ctx.restore(); }
  });
  if (o.reason) text(ctx, o.reason, 240, 930, { font: F.hand(46), color: '#8A5A00', alpha: o.reasonA ?? 1, maxW: 1440 });
  ctx.restore();
}
SCENES.S09 = (ctx, s) => {
  g1Paper(ctx, s, { typed: span(s.t, 0.2, Math.min(s.d - 1, s.w('correct'))) });
  const h = s.hold; if (!h) return;
  const ra = appear(s.t, h.at - 0.2, 0.4), cd = clamp((s.t - h.at) / h.dur), left = Math.ceil(h.dur - cd * h.dur);
  ctx.save(); ctx.globalAlpha = ra; ctx.fillStyle = 'rgba(20,23,28,0.92)'; ctx.beginPath(); ctx.arc(1730, 900, 120, 0, 7); ctx.fill();
  ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(1730, 900, 95, 0, 7); ctx.stroke();
  ctx.strokeStyle = C.teal; ctx.beginPath(); ctx.arc(1730, 900, 95, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.stroke(); ctx.restore();
  text(ctx, String(clamp(left, 0, h.dur)), 1730, 935, { font: F.head(96), align: 'center', alpha: ra, color: C.teal });
};
SCENES.S10 = (ctx, s) => {
  const cm = s.w('chief minister') - 0.2;
  g1Paper(ctx, s, { circle: span(s.t, s.w('only two') - 0.2, s.w('only two') + 0.8), strike: span(s.t, cm, cm + 0.7),
    reason: '(b): 1 and 3 are correct · the SDMA is chaired by the Chief Minister', reasonA: appear(s.t, cm + 0.5) });
};
