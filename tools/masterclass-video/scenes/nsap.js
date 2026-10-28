// Scenes for the sample Deep Dive "NSAP becomes the PM Samajik Sahayata Yojana" (weeks/2026-W44/sample-nsap), v1.
// Each scene: SCENES.Sxx = (ctx, s) with s = {t, d, p, w(word), beat(i), hold, text}; set s.credit for on-screen credits.
// Numbers are drawn at their final value (no count-up): a paused frame must never show a wrong figure (CLAUDE.md §6.2).
const CABINET = 'Source: Union Cabinet decision, 14 Oct 2026 (PIB / PMIndia)';
function heading(ctx, s, a = 1, y = 170, col = C.yellow) { text(ctx, s, 140, y, { font: F.ui(32, 800), color: col, alpha: a }); }
// several notebook lines, each written from its own cue word
function deskWrite(ctx, s, lines, cues, o = {}) {
  const w = cues.reduce((acc, c) => acc + span(s.t, c, c + 1.3), 0) / lines.length;
  desk(ctx, s.t, { ...o, lines, write: w });
}
function strike(ctx, x0, x1, y, p, col = C.red) {
  if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, easeOut(p)), y); ctx.stroke(); ctx.restore();
}

// ---------------- the fact map (shared by S18 and S19) ----------------
const CTR = [960, 530];
const NODES = [
  { s: 'NSAP 1995 → Art 41 (DPSP)', at: [420, 210], l: 'rooted in' },
  { s: 'Nodal: Ministry of Rural Development', at: [1500, 210], l: 'run by', blank: 'Nodal: ________', ans: 'MoRD' },
  { s: '5 parts · 4 renamed · Annapurna kept', at: [330, 530], l: 'has', blank: 'Name unchanged: ________', ans: 'Annapurna' },
  { s: 'Disability: 80% → 40% · age 18 → birth', at: [1590, 530], l: 'reform', blank: 'Disability: 80% → ____', ans: '40%' },
  { s: '₹375 / ₹625 = +25% (RPwD s.24)', at: [1500, 850], l: 'governed by' },
  { s: 'Old age ₹200 / ₹500 · unchanged', at: [420, 850], l: 'frozen' },
  { s: 'Tested as: how-many on names, ministry, rates', at: [960, 905], l: 'tested as', red: true },
];
function factMap(ctx, s, vis, o = {}) {
  bg(ctx);
  NODES.forEach((n, i) => link(ctx, CTR, n.at, clamp(vis[i] * 1.4), { label: n.l, color: n.red ? 'rgba(229,72,77,0.8)' : undefined }));
  node(ctx, CTR[0], CTR[1], 'Wider net, same ₹200?', { fill: C.yellow, color: C.slate, stroke: C.yellow, font: F.ui(38, 800), maxW: 360 });
  NODES.forEach((n, i) => {
    if (vis[i] <= 0) return;
    const hi = o.focus && o.focus.includes(i), blank = o.blanks && n.blank;
    const label = blank ? (o.revealed ? n.blank.replace(/_+/, n.ans) : n.blank) : n.s;
    node(ctx, n.at[0], n.at[1], label, {
      alpha: clamp(vis[i]), font: F.ui(30, 800), maxW: 400, lh: 38,
      stroke: n.red ? C.red : hi ? C.yellow : 'rgba(255,255,255,0.18)', lw: hi ? 4 : 2,
      color: blank && o.revealed ? C.yellow : C.white,
    });
  });
  if (o.pointer) {           // "Mounika's gaze": a soft yellow ring that travels to the node being discussed
    const [x, y] = o.pointer; ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 4; ctx.shadowColor = C.yellow; ctx.shadowBlur = 24;
    ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.ellipse(x, y, 250, 78, 0, 0, 7); ctx.stroke(); ctx.restore();
  }
  vignette(ctx, 0.35);
}

// ---------------- 1.1 hook ----------------
SCENES.S01 = (ctx, s) => {
  deskWrite(ctx, s, [{ s: '14 Oct 2026 · Union Cabinet' }, { s: 'NSAP → PM Samajik Sahayata Yojana' }, { s: '₹53,428 cr · 2026-27 to 2030-31' }, { s: 'disability pension opened up', gap: 90 }],
    [s.w('fourteenth') - 0.2, s.w('pradhan') - 0.3, s.w('fifty-three') - 0.3, s.w('opened') - 0.3], { handSize: 50 });
  lowerThird(ctx, 'GS-2 · Welfare schemes for vulnerable sections', appear(s.t, 0.8));
  s.credit = CABINET;
};
// ---------------- 1.2 split-screen dilemma ----------------
SCENES.S02 = (ctx, s) => {
  bg(ctx);
  const r = appear(s.t, s.w('two hundred') - 0.3), l = appear(s.t, s.w('widens') - 0.3), q = appear(s.t, s.w('central') - 0.3);
  card(ctx, 120, 150, 820, 520, { accent: C.teal, alpha: Math.max(l, 0.15) });
  card(ctx, 980, 150, 820, 520, { accent: C.red, alpha: Math.max(r, 0.15) });
  text(ctx, 'WHO is eligible', 180, 240, { font: F.ui(40, 800), color: C.teal, alpha: l });
  arrow(ctx, [[260, 590], [260, 330]], span(s.t, s.w('widens'), s.w('widens') + 0.8), { color: C.teal, lw: 10, alpha: l });
  text(ctx, 'Disability: 80% → 40%', 340, 420, { font: F.head(50), alpha: l }); text(ctx, 'Age 18+ → from birth', 340, 510, { font: F.head(50), alpha: l });
  text(ctx, 'HOW MUCH they get', 1040, 240, { font: F.ui(40, 800), color: C.red, alpha: r });
  text(ctx, '₹200', 1040, 450, { font: F.head(150), color: C.yellow, alpha: r });
  text(ctx, 'a month · Centre\'s old-age pension, 60–79', 1040, 520, { font: F.ui(32, 600), alpha: r });
  text(ctx, 'unchanged since 2007', 1040, 590, { font: F.hand(52), color: C.red, alpha: appear(s.t, s.w('2007') - 0.2) });
  card(ctx, 220, 720, 1480, 200, { stroke: C.yellow, lw: 3, alpha: q });
  revealWords(ctx, 'A wider net with the same ₹200: is the safety net stronger?', 960, 840, span(s.t, s.w('central'), s.w('stronger')), { font: F.head(54), align: 'center', maxW: 1400, highlight: ['wider', 'same', 'stronger?'] });
  vignette(ctx, 0.35);
};
// ---------------- 1.3 key terms ----------------
SCENES.S03 = (ctx, s) => {
  bg(ctx); heading(ctx, 'KEY TERMS', appear(s.t, 0), 170);
  const T = [['Social assistance', 'non-contributory · paid from taxes, not your premiums', 'unlike the Atal Pension Yojana (contributory)', 'non-contributory'],
             ['Benchmark disability', 'a certified disability of at least 40%', 'Rights of Persons with Disabilities Act, 2016', 'benchmark']];
  T.forEach(([h, d, sub, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = 230 + i * 330, dx = (1 - a) * 60;
    card(ctx, 140 + dx, y, 1640, 290, { accent: C.yellow, alpha: a });
    text(ctx, h, 200 + dx, y + 90, { font: F.head(58), color: C.yellow, alpha: a });
    text(ctx, d, 200 + dx, y + 170, { font: F.ui(40, 700), alpha: a, maxW: 1500 });
    text(ctx, sub, 200 + dx, y + 235, { font: F.ui(30, 600), color: C.dim, alpha: a });
  });
  vignette(ctx, 0.35);
};
// ---------------- 1.4 static anchor: Article 41 ----------------
SCENES.S04 = (ctx, s) => {
  bg(ctx);
  const d = appear(s.t, s.w('fifteenth') - 0.3), a = appear(s.t, s.w('article') - 0.3);
  pill(ctx, '15 AUG 1995 · NSAP LAUNCHED', 140, 130, { alpha: d, font: F.ui(32, 800), h: 58 });
  card(ctx, 140, 230, 1640, 380, { accent: C.yellow, alpha: a });
  text(ctx, 'ARTICLE 41 · Directive Principle', 200, 320, { font: F.ui(40, 800), color: C.yellow, alpha: a });
  text(ctx, '“…public assistance in cases of unemployment, old age, sickness and disablement…”', 200, 410, { font: F.head(48), maxW: 1500, lh: 64, alpha: a });
  const st = pop(s.t, s.w('directive') - 0.1);
  if (st > 0) { ctx.save(); ctx.translate(1420, 600); ctx.rotate(-0.06); ctx.scale(st, st); pill(ctx, 'NOT ENFORCEABLE IN COURT · Art 37', -330, -30, { fill: C.red, color: C.white, font: F.ui(32, 800), h: 62 }); ctx.restore(); }
  const n = appear(s.t, s.w('nodal') - 0.3);
  card(ctx, 140, 720, 1640, 170, { stroke: C.yellow, lw: 3, alpha: n });
  text(ctx, 'Nodal ministry:', 200, 822, { font: F.ui(36, 700), color: C.dim, alpha: n });
  text(ctx, 'Ministry of Rural Development', 520, 822, { font: F.head(54), color: C.yellow, alpha: n });
  text(ctx, 'covers towns too', 1500, 822, { font: F.hand(48), alpha: appear(s.t, s.w('towns') - 0.2) });
  vignette(ctx, 0.35);
};
// ---------------- 1.5 the five components ----------------
SCENES.S05 = (ctx, s) => {
  bg(ctx); heading(ctx, '5 COMPONENTS · 4 RENAMED', appear(s.t, 0), 150);
  const R = [['IGNOAPS · old-age pension', 'PM Vridhavastha Pension Yojana', 'old-age'], ['IGNWPS · widow pension', 'PM Vidhawa Pension Yojana', 'widow'],
             ['IGNDPS · disability pension', 'PM Divyangjan Pension Yojana', 'disability'], ['NFBS · family benefit', 'PM Parivar Labh Yojana', 'family'],
             ['Annapurna · 10 kg free grain', 'Annapurna (name unchanged)', 'annapurna']];
  R.forEach(([o, n, cw], i) => {
    const at = s.w(cw) - 0.3, a = appear(s.t, at), y = 200 + i * 160, last = i === 4;
    card(ctx, 140, y, 1640, 132, { accent: last ? C.teal : C.yellow, alpha: Math.max(a, 0.12) });
    text(ctx, o, 190, y + 80, { font: F.ui(34, 700), color: last ? C.white : C.dim, alpha: Math.max(a, 0.3) });
    if (!last) strike(ctx, 190, 190 + 520, y + 68, span(s.t, at + 0.5, at + 1.0), 'rgba(229,72,77,0.7)');
    arrow(ctx, [[820, y + 66], [930, y + 66]], span(s.t, at + 0.3, at + 0.8), { color: last ? C.teal : C.yellow, lw: 5 });
    text(ctx, n, 970, y + 82, { font: F.head(44), color: last ? C.teal : C.yellow, alpha: appear(s.t, at + 0.5) });
  });
  vignette(ctx, 0.35);
};
// ---------------- 1.6 eligibility chart ----------------
SCENES.S06 = (ctx, s) => {
  bg(ctx); text(ctx, 'The disability pension now starts at 40% and at birth', 140, 160, { font: F.head(54), alpha: appear(s.t, 0) });
  // threshold axis 0–100 %
  const x0 = 260, x1 = 1660, X = (v) => lerp(x0, x1, v / 100), y = 400;
  const e = s.w('eighty') - 0.3, f = s.w('forty') - 0.3, b = s.w('birth') - 0.3;
  text(ctx, 'Benchmark disability needed', 140, 300, { font: F.ui(34, 800), color: C.dim, alpha: appear(s.t, e) });
  ctx.save(); ctx.globalAlpha = appear(s.t, e); ctx.fillStyle = 'rgba(255,255,255,0.08)'; rr(ctx, x0, y - 30, x1 - x0, 60, 30); ctx.fill(); ctx.restore();
  const cut = lerp(80, 40, ease(span(s.t, f, f + 1.0)));
  ctx.save(); ctx.globalAlpha = appear(s.t, e); ctx.fillStyle = C.teal; rr(ctx, X(cut), y - 30, x1 - X(cut), 60, 30); ctx.fill(); ctx.restore();
  [0, 40, 80, 100].forEach(v => text(ctx, v + '%', X(v), y + 80, { font: F.ui(30, 700), align: 'center', color: C.dim, alpha: appear(s.t, e) }));
  text(ctx, 'was 80%', X(80), y - 50, { font: F.ui(30, 800), align: 'center', color: C.red, alpha: appear(s.t, e) * (s.t > f ? 0.6 : 1) });
  text(ctx, 'now 40%', X(40), y - 50, { font: F.ui(34, 800), align: 'center', color: C.yellow, alpha: appear(s.t, f + 0.8) });
  // age
  const ya = 680;
  text(ctx, 'Minimum age', 140, ya - 90, { font: F.ui(34, 800), color: C.dim, alpha: appear(s.t, s.w('eighteen') - 0.3) });
  text(ctx, '18 years', 260, ya, { font: F.head(64), color: C.red, alpha: appear(s.t, s.w('eighteen') - 0.3) });
  strike(ctx, 250, 520, ya - 22, span(s.t, b, b + 0.6));
  arrow(ctx, [[600, ya - 22], [760, ya - 22]], span(s.t, b, b + 0.6), { color: C.yellow, lw: 6 });
  text(ctx, 'from birth', 800, ya, { font: F.head(64), color: C.yellow, alpha: appear(s.t, b + 0.4) });
  const r = appear(s.t, s.w('reports') - 0.3);
  card(ctx, 140, 800, 1640, 120, { stroke: 'rgba(255,255,255,0.2)', alpha: r });
  text(ctx, 'Beneficiaries: about 8 lakh → about 27 lakh (as reported)', 200, 875, { font: F.ui(38, 700), alpha: r });
  s.credit = CABINET; vignette(ctx, 0.35);
};
// ---------------- 1.7 rates ----------------
SCENES.S07 = (ctx, s) => {
  bg(ctx); text(ctx, 'Only the disability rates moved', 140, 150, { font: F.head(54), alpha: appear(s.t, 0) });
  const a1 = s.w('seventy-five') - 0.4, a2 = s.w('six hundred') - 0.3, sec = s.w('section') - 0.3;
  const rows = [['Disability · age 0–79', '₹300', '₹375', a1], ['Disability · 80+', '₹500', '₹625', a2]];
  rows.forEach(([l, o, n, at], i) => {
    const a = appear(s.t, at), y = 220 + i * 150;
    card(ctx, 140, y, 1200, 124, { accent: C.yellow, alpha: Math.max(a, 0.15) });
    text(ctx, l, 190, y + 78, { font: F.ui(36, 700), alpha: Math.max(a, 0.35) });
    text(ctx, o, 760, y + 80, { font: F.head(52), color: C.dim, alpha: a }); strike(ctx, 750, 880, y + 64, span(s.t, at + 0.3, at + 0.8));
    text(ctx, '→ ' + n + ' a month', 910, y + 80, { font: F.head(52), color: C.yellow, alpha: appear(s.t, at + 0.4) });
  });
  const b = appear(s.t, sec);
  arrow(ctx, [[1370, 250], [1420, 250], [1420, 470], [1370, 470]], span(s.t, sec, sec + 0.7), { color: C.yellow, lw: 5, noHead: true });
  text(ctx, '+25%', 1460, 350, { font: F.head(64), color: C.yellow, alpha: b });
  text(ctx, 'RPwD Act 2016, s.24(1)', 1460, 400, { font: F.ui(30, 700), alpha: b });
  const g = appear(s.t, s.w('only for') - 0.3);
  heading(ctx, 'UNCHANGED', g, 600, C.dim);
  [['Old age 60–79', '₹200'], ['Old age 80+', '₹500'], ['Widow', '₹300'], ['Family benefit', '₹20,000 one-time']].forEach(([l, v], i) => {
    const x = 140 + i * 420; card(ctx, x, 640, 390, 180, { stroke: 'rgba(255,255,255,0.12)', alpha: g });
    text(ctx, l, x + 30, 705, { font: F.ui(30, 700), color: C.dim, alpha: g }); text(ctx, v, x + 30, 785, { font: F.head(i === 3 ? 40 : 54), alpha: g });
  });
  s.credit = CABINET + ' · Lok Sabha replies (NSAP rates)'; vignette(ctx, 0.35);
};
// ---------------- 1.8 [EXT] timeline river ----------------
SCENES.S08 = (ctx, s) => {
  bg(ctx); heading(ctx, 'NSAP · 1995 → 2026', appear(s.t, 0), 160);
  const E = [['1995', 'NSAP: old-age, family, maternity', '1995'], ['2000', 'Annapurna added', '2000'], ['2001', 'Maternity → Health Ministry', '2001'],
             ['2007', 'IGNOAPS · BPL test', '2007'], ['2009', 'Widow + disability pensions', '2009'], ['2012', 'Rates raised', 'last general'], ['2026', 'PM Samajik Sahayata Yojana', 'rewind']];
  const xs = E.map((_, i) => 180 + i * 260), y = 560;
  arrow(ctx, xs.map(x => [x, y]), span(s.t, 0.2, s.d * 0.95), { color: C.blue, lw: 12, noHead: true });
  E.forEach(([yr, l, cw], i) => {
    const a = i === 6 ? appear(s.t, 0.4) : appear(s.t, s.w(cw) - 0.3), up = i % 2 === 0;
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(xs[i], y, 18, 0, 7); ctx.fillStyle = i === 6 ? C.yellow : C.white; ctx.fill(); ctx.restore();
    text(ctx, yr, xs[i], up ? y - 60 : y + 90, { font: F.head(48), align: 'center', color: C.yellow, alpha: a });
    text(ctx, l, xs[i], up ? y - 130 : y + 150, { font: F.ui(28, 700), align: 'center', maxW: 240, lh: 34, alpha: a });
  });
  vignette(ctx, 0.35);
};
// ---------------- 1.9 Prelims Trap ----------------
SCENES.S09 = (ctx, s) => {
  bg(ctx); pill(ctx, 'PRELIMS TRAP', 140, 130, { fill: C.red, color: C.white, font: F.ui(34, 800), h: 62 });
  const T = [['Only the disability rates changed', 'old age ₹200 / ₹500 · widow ₹300 · family benefit ₹20,000: unchanged', 'only disability'],
             ['Nodal: Rural Development', 'not the disability department, not Social Justice', 'ministry'],
             ['5 components · 4 renamed', 'Annapurna keeps its name', 'count']];
  T.forEach(([h, sub, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = 250 + i * 240;
    card(ctx, 140, y, 1640, 200, { accent: C.red, alpha: Math.max(a, 0.12) });
    text(ctx, (i + 1) + ' · ' + h, 200, y + 85, { font: F.head(54), alpha: a });
    text(ctx, sub, 200, y + 150, { font: F.ui(32, 600), color: '#C9CFD6', alpha: a });
  });
  vignette(ctx, 0.35);
};
// ---------------- 1.10–1.11 MCQ on the examiner's desk ----------------
const MCQ = ['1. It is implemented by the Ministry of Social Justice and Empowerment.', '2. Its disability pension now requires a benchmark disability of 40 per cent.', '3. The old-age pension was raised along with the renaming.'];
function examPaper(ctx, s, o = {}) {
  bg(ctx, { inner: '#22262D' });
  ctx.save(); ctx.translate(960, 540); ctx.rotate(-0.012); ctx.translate(-960, -540);
  card(ctx, 200, 90, 1520, 900, { fill: '#EDE6D6', r: 6 });
  text(ctx, 'Consider the following statements about the PM Samajik Sahayata Yojana:', 260, 190, { font: F.head(42), color: '#1E2228', maxW: 1400 });
  const typed = o.typed ?? 1;
  MCQ.forEach((m, i) => {
    const y = 300 + i * 110, a = clamp(typed * 3 - i);
    text(ctx, m, 290, y, { font: F.ui(36, 600), color: '#1E2228', alpha: a, maxW: 1360 });
    if (o.strikes && o.strikes[i] > 0) { ctx.save(); ctx.font = F.ui(36, 600); const w = ctx.measureText(m).width; ctx.restore(); strike(ctx, 285, 290 + Math.min(w, 1360), y - 12, o.strikes[i]); }
  });
  text(ctx, 'How many of the above statements are correct?', 260, 680, { font: F.head(42), color: '#1E2228', alpha: clamp(typed * 3 - 2.5) });
  ['(a) Only one', '(b) Only two', '(c) All three', '(d) None'].forEach((op, i) => {
    const x = 290 + i * 340; text(ctx, op, x, 780, { font: F.ui(36, 700), color: '#1E2228', alpha: clamp(typed * 3 - 2.6) });
    if (i === 0 && o.circle > 0) { ctx.save(); ctx.strokeStyle = '#C08A00'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x + 100, 768, 140, 44, -0.04, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * easeOut(o.circle)); ctx.stroke(); ctx.restore(); }
  });
  if (o.reason) text(ctx, o.reason, 260, 900, { font: F.hand(48), color: '#8A5A00', alpha: o.reasonA ?? 1, maxW: 1400 });
  ctx.restore();
  pill(ctx, 'UPSC FORMAT · HOW MANY', 80, 40, { font: F.ui(26, 800), h: 46 });
}
SCENES.S10 = (ctx, s) => {
  examPaper(ctx, s, { typed: span(s.t, 0.2, Math.min(s.d - 1, s.w('correct'))) });
  const h = s.hold;
  if (h) {
    const ra = appear(s.t, h.at - 0.2, 0.4), cd = clamp((s.t - h.at) / h.dur), left = Math.ceil(h.dur - cd * h.dur);
    ctx.save(); ctx.globalAlpha = ra; ctx.fillStyle = 'rgba(20,23,28,0.92)'; ctx.beginPath(); ctx.arc(1730, 900, 120, 0, 7); ctx.fill();
    ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(1730, 900, 95, 0, 7); ctx.stroke();
    ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(1730, 900, 95, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.stroke(); ctx.restore();
    text(ctx, String(clamp(left, 0, h.dur)), 1730, 935, { font: F.head(96), align: 'center', alpha: ra, color: C.yellow });
  }
};
SCENES.S11 = (ctx, s) => {
  const rd = s.w('rural') - 0.2, mv = s.w('did not') - 0.2;
  examPaper(ctx, s, { circle: span(s.t, s.w('only one') - 0.2, s.w('only one') + 0.8), strikes: [span(s.t, rd, rd + 0.7), 0, span(s.t, mv, mv + 0.7)],
    reason: 'Only 2 is correct: MoRD runs it; only disability rates rose.', reasonA: appear(s.t, mv + 0.6) });
};
// ---------------- 1.12 Mains Lens (hub) / 1.12a (EXT) ----------------
function mainsLens(ctx, s, cueWords) {
  const cues = cueWords.map(cw => s.w(cw) - 0.3);
  const Q = [['ECONOMIC & FISCAL', '₹53,428 cr ÷ 5 ≈ ₹10,700 cr a year → continuity, not a bigger pension', C.yellow],
             ['GOVERNANCE & FEDERAL', 'AP pays ₹4,000 a month; the Centre\'s share is ₹200', C.blue],
             ['SOCIAL', 'Meets the RPwD Act 2016 and the UN disability convention (India ratified 2007)', C.teal],
             ['DEMOGRAPHIC', 'About 1 in 5 Indians will be 60+ by 2050 (UNFPA, 2023)', C.red]];
  const ctr = (i) => [140 + (i % 2) * 840 + 400, 210 + Math.floor(i / 2) * 420 + 190];
  let cx = 960, cy = 540, sc = 1;
  const cur = cues.filter(c => s.t >= c).length - 1, back = span(s.t, cues[3] + 3.4, cues[3] + 4.6);
  if (cur >= 0) {
    const prev = cur > 0 ? ctr(cur - 1) : [960, 540], nx = ctr(cur), k = ease(span(s.t, cues[cur], cues[cur] + 0.9));
    cx = lerp(prev[0], nx[0], k); cy = lerp(prev[1], nx[1], k); sc = cur === 0 ? lerp(1, 1.25, k) : 1.25;
    cx = lerp(cx, 960, ease(back)); cy = lerp(cy, 540, ease(back)); sc = lerp(sc, 1, ease(back));
  }
  bg(ctx); ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.translate(-cx, -cy);
  Q.forEach(([h, sub, col], i) => {
    const a = appear(s.t, cues[i]), x = 140 + (i % 2) * 840, y = 210 + Math.floor(i / 2) * 420;
    card(ctx, x, y, 800, 380, { accent: col, alpha: Math.max(a, 0.12), stroke: 'rgba(255,255,255,0.08)' });
    text(ctx, h, x + 50, y + 95, { font: F.ui(36, 800), color: col, alpha: a }); text(ctx, sub, x + 50, y + 170, { font: F.head(44), maxW: 690, lh: 56, alpha: a });
  });
  ctx.restore(); pill(ctx, 'MAINS LENS', 80, 130, { font: F.ui(32, 800), h: 58 });
  s.credit = CABINET + ' · UNFPA India Ageing Report 2023'; vignette(ctx, 0.35);
}
SCENES.S12 = (ctx, s) => mainsLens(ctx, s, ['fiscally', 'federally', 'socially', 'demographically']);
SCENES.S13 = (ctx, s) => mainsLens(ctx, s, ['economic', 'governance', 'social', 'demographic']);
// ---------------- 1.13 Way forward: case-file board ----------------
SCENES.S14 = (ctx, s) => {
  bg(ctx, { inner: '#2A2620', outer: '#14120F' }); heading(ctx, 'WAY FORWARD · ON WHOSE AUTHORITY?', appear(s.t, 0), 140);
  const B = [['Standing Committee on Rural Development (2025)', 'seek a substantial increase in pension amounts', 'standing', [130, 220], -0.02],
             ['CAG Report No. 10 of 2023', 'no periodic surveys of eligible people · no social audits in 25 States/UTs', 'c-a-g', [700, 300], 0.015],
             ['New guidelines · due within 3 months', 'fix identification as well as eligibility', 'three months', [1270, 220], -0.01]];
  const pins = [];
  B.forEach(([h, sub, cw, [x, y], rot], i) => {
    const a = appear(s.t, s.w(cw) - 0.3); pins.push([x + 260, y + 20]);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x + 260, y + 170); ctx.rotate(rot); ctx.translate(-(x + 260), -(y + 170));
    card(ctx, x, y + (1 - a) * -40, 520, 340, { fill: '#EDE6D6', r: 4 });
    text(ctx, h, x + 30, y + 80, { font: F.ui(32, 800), color: '#1E2228', maxW: 460, lh: 40 });
    text(ctx, sub, x + 30, y + 200, { font: F.hand(42), color: '#8A3A2A', maxW: 460, lh: 46 });
    ctx.beginPath(); ctx.arc(x + 260, y + 20, 12, 0, 7); ctx.fillStyle = C.red; ctx.fill(); ctx.restore();
  });
  const th = span(s.t, s.w('c-a-g'), s.w('c-a-g') + 1.2), th2 = span(s.t, s.w('three months'), s.w('three months') + 1.2);
  arrow(ctx, [pins[0], [(pins[0][0] + pins[1][0]) / 2, pins[1][1] + 60], pins[1]], th, { color: 'rgba(229,72,77,0.85)', lw: 3, noHead: true });
  arrow(ctx, [pins[1], [(pins[1][0] + pins[2][0]) / 2, pins[1][1] + 60], pins[2]], th2, { color: 'rgba(229,72,77,0.85)', lw: 3, noHead: true });
  const ix = appear(s.t, s.w('indexation') - 0.6);
  card(ctx, 300, 780, 1320, 150, { stroke: C.yellow, lw: 3, alpha: ix });
  text(ctx, 'India\'s imperative: a pension floor that keeps its value (indexation)', 960, 870, { font: F.ui(38, 800), align: 'center', color: C.yellow, alpha: ix });
  s.credit = 'Sources: CAG Report No. 10 of 2023 · Standing Committee on Rural Development'; vignette(ctx, 0.4);
};
// ---------------- 1.14 Write this down ----------------
SCENES.S15 = (ctx, s) => deskWrite(ctx, s,
  [{ s: '15 Aug 1995 · Art 41 (DPSP)' }, { s: 'Ministry of Rural Development' }, { s: 'Disability: 40%, from birth' }, { s: 'RPwD s.24(1): +25%' }],
  [s.w('fifteenth') - 0.2, s.w('ministry') - 0.2, s.w('forty') - 0.2, s.w('twenty-five') - 0.2], { handSize: 54 });
// ---------------- 1.15 model question ----------------
SCENES.S16 = (ctx, s) => {
  bg(ctx); pill(ctx, 'GS-2 · 15 MARKS · 250 WORDS', 80, 130, { font: F.ui(30, 800), h: 56 });
  card(ctx, 140, 220, 1640, 260, { accent: C.yellow });
  revealWords(ctx, '“The Pradhan Mantri Samajik Sahayata Yojana widens eligibility but not adequacy.” Critically examine.', 200, 320, span(s.t, 0.2, s.w('examine') + 0.4), { font: F.head(50), maxW: 1520, lh: 64, highlight: ['eligibility', 'adequacy.”'] });
  [['INTRO', 'Article 41 + the Cabinet decision of 14 Oct 2026', 'introduce'], ['BODY', 'eligibility · adequacy · identification · federal cost-sharing', 'body'], ['CONCLUSION', 'indexation + cleaner beneficiary lists', 'conclude']].forEach(([h, sub, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = 530 + i * 150, dx = (1 - a) * 80;
    card(ctx, 140 + dx, y, 1640, 128, { alpha: a, stroke: 'rgba(255,255,255,0.15)' });
    text(ctx, h, 190 + dx, y + 76, { font: F.ui(30, 800), color: C.yellow, alpha: a }); text(ctx, sub, 450 + dx, y + 76, { font: F.ui(34, 600), maxW: 1300, alpha: a });
  });
  vignette(ctx, 0.35);
};
// ---------------- 1.17 checkpoint ----------------
SCENES.S17 = (ctx, s) => {
  bg(ctx);
  const k = appear(s.t, 0);
  card(ctx, 220, 230, 1480, 560, { fill: 'rgba(38,43,51,0.96)', stroke: C.yellow, lw: 3, alpha: k });
  pill(ctx, 'PAUSE AND ANSWER', 290, 285, { alpha: k, font: F.ui(30, 800), h: 54 });
  text(ctx, 'Article 41 and the RPwD Act both protect persons with disabilities. Why could only the Act force the +25% rate?', 290, 430, { font: F.head(52), maxW: 1020, lh: 68, alpha: k });
  const h = s.hold;
  if (h) {
    const ra = appear(s.t, h.at - 0.2, 0.4) * (1 - span(s.t, h.at + h.dur + 0.6, h.at + h.dur + 1.2));
    const cd = clamp((s.t - h.at) / h.dur), left = Math.ceil(h.dur - cd * h.dur);
    ctx.save(); ctx.globalAlpha = ra; ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(1480, 520, 120, 0, 7); ctx.stroke();
    ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(1480, 520, 120, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.stroke(); ctx.restore();
    text(ctx, String(clamp(left, 0, h.dur)), 1480, 560, { font: F.head(120), align: 'center', alpha: ra, color: C.yellow });
  }
  text(ctx, 'answer: start of the next chapter', 960, 880, { font: F.hand(46), align: 'center', color: C.dim, alpha: appear(s.t, s.w('hold that') - 0.2) });
  vignette(ctx);
};
// ---------------- 1.18 recap over the completed map ----------------
SCENES.S18 = (ctx, s) => {
  const vis = NODES.map((_, i) => appear(s.t, 0.3 + i * 0.35));
  const marks = [['name is new', [420, 210]], ['real reform', [1590, 530]], ['open question', [420, 850]]];
  let ptr = null;
  marks.forEach(([cw, at], i) => { if (s.t >= s.w(cw) - 0.3) { const prev = i ? marks[i - 1][1] : at, k = ease(span(s.t, s.w(cw) - 0.3, s.w(cw) + 0.5)); ptr = [lerp(prev[0], at[0], k), lerp(prev[1], at[1], k)]; } });
  const focus = s.t >= s.w('open question') - 0.3 ? [5] : s.t >= s.w('real reform') - 0.3 ? [3, 4] : s.t >= s.w('name is new') - 0.3 ? [0, 1] : [];
  factMap(ctx, s, vis, { pointer: ptr, focus });
};
// ---------------- 1.19 skeleton with blanks ----------------
SCENES.S19 = (ctx, s) => {
  const rev = s.hold ? s.t >= s.hold.at + s.hold.dur : s.p > 0.7;
  factMap(ctx, s, NODES.map(() => 1), { blanks: true, revealed: rev });
  if (!rev) text(ctx, 'pause · copy · fill the blanks', 960, 1040, { font: F.hand(46), align: 'center', color: C.yellow, alpha: appear(s.t, s.w('copy') - 0.2) });
  const nx = appear(s.t, s.w('next') - 0.3);
  if (nx > 0) { ctx.save(); ctx.globalAlpha = nx; ctx.fillStyle = 'rgba(14,16,20,0.92)'; ctx.fillRect(0, 980, W, 100); ctx.restore(); text(ctx, 'NEXT · AP–TG DESK', 960, 1045, { font: F.ui(40, 800), align: 'center', color: C.teal, alpha: nx }); }
};
// ---------------- AP–TG Desk: A.0 checkpoint answer, A.1 Telugu States Lens ----------------
SCENES.S20 = (ctx, s) => {
  desk(ctx, s.t, { book: false, lamp: 0.95 });
  const a = appear(s.t, 0.2), b = appear(s.t, s.w('directive') - 0.3);
  card(ctx, 260, 160, 1400, 480, { stroke: C.yellow, lw: 3, alpha: a });
  pill(ctx, 'CHECKPOINT ANSWER', 320, 210, { alpha: a, font: F.ui(28, 800), h: 50 });
  text(ctx, 'The RPwD Act, 2016: a statute that courts enforce', 320, 360, { font: F.head(52), color: C.yellow, alpha: appear(s.t, s.w('statute') - 0.3), maxW: 1280 });
  text(ctx, 'Article 41 is a Directive Principle: not enforceable by any court (Art 37)', 320, 490, { font: F.ui(38, 700), alpha: b, maxW: 1280, lh: 50 });
  lowerThird(ctx, 'AP–TG Desk · Local: Telugu States', appear(s.t, 0.6));
};
SCENES.S21 = (ctx, s) => {
  bg(ctx); pill(ctx, 'TELUGU STATES LENS', 140, 120, { fill: C.teal, color: C.slate, font: F.ui(32, 800), h: 58 });
  const d = appear(s.t, s.w('ntr') - 0.3);
  card(ctx, 140, 220, 620, 560, { fill: '#EDE6D6', r: 6, alpha: d });
  text(ctx, 'GOVERNMENT OF ANDHRA PRADESH', 450, 300, { font: F.ui(26, 800), align: 'center', color: '#1E2228', alpha: d });
  text(ctx, 'NTR Bharosa pensions', 450, 370, { font: F.head(44), align: 'center', color: '#1E2228', alpha: d });
  text(ctx, 'Old-age pension: ₹4,000 a month', 450, 460, { font: F.ui(32, 700), align: 'center', color: '#1E2228', alpha: d });
  text(ctx, 'G.O. number and date: from the verification log', 450, 700, { font: F.ui(24, 600), align: 'center', color: '#8A3A2A', alpha: d });
  // split bar: ₹4,000 = ₹200 Centre + ₹3,800 State
  const b = appear(s.t, s.w('four thousand') - 0.3), x0 = 840, x1 = 1780, y = 330, cS = x0 + (x1 - x0) * 200 / 4000;
  text(ctx, '₹4,000 a month to an elderly pensioner in AP', 840, 270, { font: F.ui(34, 800), alpha: b });
  ctx.save(); ctx.globalAlpha = b; ctx.fillStyle = C.teal; ctx.fillRect(cS, y, x1 - cS, 90); ctx.fillStyle = C.yellow; ctx.fillRect(x0, y, cS - x0, 90); ctx.restore();
  const c = appear(s.t, s.w('share') - 0.3);
  text(ctx, 'Centre ₹200', x0, y + 150, { font: F.ui(34, 800), color: C.yellow, alpha: c });
  text(ctx, 'State ₹3,800', x1, y + 150, { font: F.ui(34, 800), color: C.teal, align: 'right', alpha: c });
  text(ctx, '≈ one twentieth', x0, y + 210, { font: F.hand(50), color: C.yellow, alpha: appear(s.t, s.w('twentieth') - 0.3) });
  const q = appear(s.t, s.w('group-1') - 0.3);
  card(ctx, 840, 640, 940, 260, { stroke: C.teal, lw: 3, alpha: q });
  text(ctx, 'GROUP-1 STYLE', 880, 700, { font: F.ui(26, 800), color: C.teal, alpha: q });
  text(ctx, 'Describe the social security pensions of Andhra Pradesh and the role of central assistance in them.', 880, 760, { font: F.head(38), maxW: 860, lh: 48, alpha: q });
  s.credit = 'Sources: Govt of Andhra Pradesh (NTR Bharosa) · Union Cabinet decision, 14 Oct 2026'; vignette(ctx, 0.35);
};
