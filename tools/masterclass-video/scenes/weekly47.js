// W47 weekly (weeks/2026-W47/weekly): "November 3rd Week Current Affairs", 16:9, ON CAMERA at chosen rows.
// Render: node render.js <assets> <timeline> scenes/weekly47.js <out> --strict
// Builds are keyed to fractions of each row (robust to the owner's own wording); numbers at final values; no short forms in narration.
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
function pcards(ctx, s, c, label, cards, cols) {
  exSlide(ctx, c, null, null); head(ctx, s, c, label);
  const n = cards.length, rows = Math.ceil(n / cols), gw = 1776, w = (gw - (cols - 1) * 36) / cols, h = (840 - (rows - 1) * 30) / rows;
  cards.forEach((cd, i) => { const x = 72 + (i % cols) * (w + 36), y = 190 + Math.floor(i / cols) * (h + 30);
    zoom(ctx, bounce(s.t, T(s, cd.f)), x + w / 2, y + h / 2, () => {
      exBox(ctx, x, y, w, h, { fill: '#FFFFFF', bar: cd.bar || YEL, r: 24 });
      kt(ctx, cd.tag, x + 40, y + 62, { font: F.ui(28, 900), color: '#2563EB' });
      kt(ctx, cd.name, x + 40, y + 122, { font: F.head(52, 900), color: INK, maxW: w - 80 });
      let yy = y + 190; for (const l of cd.lines) yy += kt(ctx, l, x + 40, yy, { font: F.ui(36, 800), color: '#4C1D95', maxW: w - 80, lh: 44 }) + 12;
      if (cd.trap) { ctx.save(); ctx.font = F.ui(30, 900); const tl = wrap(ctx, 'Trap: ' + cd.trap, w - 100).length; ctx.restore(); const th = 30 + tl * 38; exBox(ctx, x + 30, y + h - th - 24, w - 60, th, { fill: '#FFE4E6', r: 14 }); kt(ctx, 'Trap: ' + cd.trap, x + 50, y + h - th - 24 + 46, { font: F.ui(30, 900), color: RED, maxW: w - 100, lh: 38 }); }
    }); });
}
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

// ---------- open ----------
SCENES.S000 = band([['NOVEMBER 3rd WEEK', YEL, 116], ['12 stories · data · diagrams', '#FFFFFF', 70]], 'Decode UPSC with Mounika · English + Telugu');
SCENES.S001 = (ctx, s) => {
  exSlide(ctx, PAL.world, null, null); kt(ctx, "TODAY'S 12 STORIES + PERSONS & PLACES", 72, 120, { font: F.head(60, 900), color: '#FFFFFF', alpha: eia(s, 0.05) });
  const G = { w: SKY, i: YEL, e: GRN };
  const L = [['World court: genocide', 'w'], ['Shenzhen: big three', 'w'], ['Quad in Manila', 'w'], ['Death-penalty vote', 'w'], ['Labour Codes at one', 'i'], ['Defence week', 'i'],
    ['Cyclone Akvan', 'i'], ['Nagarjuna Sagar row', 'i'], ['Earthshot Prize', 'e'], ['COP31 Antalya', 'e'], ['SCO dialogue, Delhi', 'e'], ['Important days', 'e']];
  L.forEach(([nm, g], i) => { const col = Math.floor(i / 4), row = i % 4, x = 72 + col * 610, y = 190 + row * 150;
    zoom(ctx, bounce(s.t, 0.3 + i * (s.d * 0.6 / 12)), x + 285, y + 55, () => { exBox(ctx, x, y, 570, 120, { fill: '#FFFFFF', bar: G[g], r: 22 }); kt(ctx, String(i + 1), x + 56, y + 80, { font: F.head(50, 900), color: VIO, align: 'center' }); kt(ctx, nm, x + 108, y + 78, { font: F.ui(40, 900), color: INK }); }); });
  [['World stage', SKY], ["India's law, economy, security", YEL], ['Environment, states, days', GRN]].forEach(([t, c2], i) => exChip(ctx, t, 72 + i * 600, 830, c2, INK, 30, eia(s, 0.4)));
};

// ---------- 1 · ICJ ----------
SCENES.S011 = title(1, 'World court: Myanmar guilty of genocide', 'world', 'International Court of Justice · 19 Nov 2026');
SCENES.S012 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE JUDGMENT · 19 NOV 2026', 'International Court of Justice · The Gambia v. Myanmar');
  hbars(ctx, s, 120, 300, 110, 110, 70, [['Genocide proven', 9, '9 judges', GRN], ['Not proven', 6, '6 judges', '#FFB3B9']], 0.05, 0.15);
  zoom(ctx, bounce(s.t, T(s, 0.45)), 1500, 330, () => box(ctx, 1200, 220, 650, 230, '#FFFFFF', [['2017 · Rakhine State', 34, VIO], ['about 10,000 Rohingya killed', 40, INK], ['(as stated in the judgment)', 26, INK, 700]]));
  zoom(ctx, bounce(s.t, T(s, 0.62)), 960, 760, () => box(ctx, 72, 640, 1776, 200, YEL, [['FIRST time the court has found a STATE itself responsible for genocide', 46, INK], ['Order: restitution + compensation · report back in 2 years', 36, INK, 800]]));
  source(ctx, s, 'UN News, 19 Nov 2026');
};
SCENES.S013 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'HOW A SMALL COUNTRY BROUGHT THE CASE');
  flow(ctx, s, [
    { f: 0.05, lines: [['2019', 30, VIO], ['The Gambia files', 46, INK], ['for the Organisation of Islamic Cooperation (57)', 28, INK, 700]] },
    { f: 0.4, lines: [['THE KEY', 30, VIO], ['Genocide Convention, 1948', 42, INK], ['any party can take another to court', 28, INK, 700]] },
    { f: 0.75, lines: [['2026', 30, VIO], ['Judgment', 50, INK], ['9 to 6', 40, INK]] },
  ], 300, 420);
};
SCENES.S014 = (ctx, s) => dilemma(ctx, s, PAL.world, 'TWO COURTS · AND THE INDIA ANGLE',
  [['International Court of Justice', 44, INK], ["UN's principal judicial organ · The Hague", 32, VIO, 800], ['15 judges · 9-year terms', 38, INK], ['cases between STATES', 40, INK]],
  [['International Criminal Court', 44, INK], ['Rome Statute', 32, VIO, 800], ['tries INDIVIDUALS', 40, INK], ['India: NOT a member', 40, RED]],
  [['India ratified the Genocide Convention in 1959 · not party to the 1951 Refugee Convention · ~1,600 km border with Myanmar', 34, INK]]);
SCENES.S015 = trap('The ICJ tries individuals for genocide', 'The ICJ settles disputes between STATES; individuals are tried by the International Criminal Court', 'India is not a member of the International Criminal Court');

// ---------- 2 · Shenzhen ----------
SCENES.S021 = title(2, 'Shenzhen: America, China, Russia at one table', 'world', 'First-ever three-way summit · 19 Nov 2026');
SCENES.S022 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'SHENZHEN · 19 NOV 2026', 'Sidelines of the Asia-Pacific Economic Cooperation leaders\' meeting');
  ['United States', 'China', 'Russia'].forEach((n, i) => zoom(ctx, bounce(s.t, T(s, 0.05 + i * 0.1)), 360 + i * 600, 380, () => box(ctx, 120 + i * 600, 270, 480, 220, i === 1 ? YEL : '#FFFFFF', [[n, 52, INK]])));
  zoom(ctx, bounce(s.t, T(s, 0.5)), 960, 720, () => box(ctx, 72, 600, 1776, 240, GRN, [['Agreed: a DIALOGUE on reducing nuclear risks and stopping proliferation', 44, INK], ['no deadline · no disarmament target', 36, INK, 800]]));
};
SCENES.S023 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHY IT MATTERS · ARMS CONTROL TIMELINE');
  flow(ctx, s, [
    { f: 0.05, lines: [['1968', 34, VIO], ['Non-Proliferation Treaty', 38, INK], ['in force 1970', 28, INK, 700]] },
    { f: 0.3, lines: [['2010', 34, VIO], ['New START', 44, INK], ['United States – Russia', 28, INK, 700]] },
    { f: 0.5, fill: '#FFD9DC', lines: [['FEB 2026', 34, RED], ['New START lapses', 40, INK]] },
    { f: 0.72, lines: [['NOV 2026', 34, VIO], ['3-way dialogue promised', 38, INK]] },
  ], 300, 380, ['#FFFFFF', '#FFFFFF', '#FFD9DC', YEL]);
  kt(ctx, 'Now no treaty caps the two largest nuclear arsenals', 72, 820, { font: F.ui(50, 900), color: YEL, maxW: 1776, alpha: eia(s, T(s, 0.6)) });
};
SCENES.S024 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHERE INDIA STANDS');
  mind(ctx, s, 'India · strategic autonomy', [
    { f: 0.08, x: 72, y: 200, w: 560, h: 170, lines: [['United States', 34, VIO], ['Quad · technology', 40, INK]] },
    { f: 0.3, x: 1288, y: 200, w: 560, h: 170, lines: [['Russia', 34, VIO], ['defence · oil', 40, INK]] },
    { f: 0.5, x: 680, y: 820, w: 560, h: 170, lines: [['China', 34, VIO], ['border · trade', 40, INK]] },
  ], c);
};
SCENES.S025 = trap(null, 'NPT recognises only 5 nuclear-weapon states: United States · Russia · United Kingdom · France · China', 'India: not a party to the NPT or the test-ban treaty (CTBT) · follows No First Use (2003)');

// ---------- 3 · Quad ----------
SCENES.S031 = title(3, 'Quad in Manila: what India got', 'world', 'First leaders\' summit in more than two years · 17 Nov');
SCENES.S032 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'QUAD · MANILA · 17 NOV 2026', 'No joint statement reported');
  [['AI Accelerator', '$85 million+', YEL], ['Quad Business Leaders\' Forum', 'Mumbai · early 2027', '#FFFFFF'], ['Cyber + maritime surveillance', 'stepped up', '#FFFFFF'], ['Critical minerals', 'new deals', GRN]].forEach(([a, b, f], i) => {
    const x = 72 + (i % 2) * 900, y = 220 + Math.floor(i / 2) * 330;
    zoom(ctx, bounce(s.t, T(s, 0.05 + i * 0.18)), x + 420, y + 140, () => box(ctx, x, y, 840, 290, f, [[a, 46, INK], [b, 40, VIO]])); });
};
SCENES.S033 = band([['SAME VISIT', YEL, 90], ['23rd ASEAN–India Summit · 21st East Asia Summit', '#FFFFFF', 56]], 'Act East Policy at the centre of the Indo-Pacific');
SCENES.S034 = (ctx, s) => {
  exSlide(ctx, PAL.trap, null, null); exChip(ctx, 'PRELIMS TRAP · WHERE IS INDIA?', 72, 50, '#FFFFFF', '#B91C1C', 44, eia(s, 0.05));
  [['Quad', '4 members', true], ['East Asia Summit', '18 members', true], ['ASEAN', '11 members · India = partner', false], ['APEC', '21 economies', false]].forEach(([n, m, ok], i) => {
    const x = 72 + (i % 2) * 900, y = 200 + Math.floor(i / 2) * 400;
    zoom(ctx, bounce(s.t, T(s, 0.05 + i * 0.2)), x + 420, y + 170, () => box(ctx, x, y, 840, 340, ok ? GRN : '#FFFFFF', [[n, 60, INK], [m, 36, VIO], [ok ? '✓ India is a member' : '✗ India is not a member', 40, ok ? INK : RED]])); });
};

// ---------- 4 · Death penalty ----------
SCENES.S041 = title(4, 'India votes against a death-penalty pause', 'pol', 'UN General Assembly · 13 Nov 2026');
SCENES.S042 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'UN GENERAL ASSEMBLY · 13 NOV 2026', 'Resolution: global moratorium on the death penalty');
  vbars(ctx, s, 200, 880, 4.2, 280, 120, [['For', 133, '133', GRN], ['Against', 33, '33', '#FFB3B9'], ['Abstain', 16, '16', '#E9D5FF']], 0.05, 0.12);
  zoom(ctx, bounce(s.t, T(s, 0.55)), 1550, 450, () => box(ctx, 1280, 260, 570, 380, YEL, [['INDIA: AGAINST', 44, INK], ['sovereign right · no international consensus', 32, INK, 800], ['same in 2016, 2018, 2024', 28, VIO, 800]]));
  source(ctx, s, 'UN General Assembly, as reported (Business Standard, 15 Nov 2026)');
};
SCENES.S043 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE DEATH PENALTY IN INDIAN LAW');
  flow(ctx, s, [
    { f: 0.05, lines: [['ARTICLE 21', 34, VIO], ['life · only by procedure established by law', 34, INK]] },
    { f: 0.4, lines: [['BACHAN SINGH, 1980', 32, VIO], ['"rarest of rare"', 48, INK]] },
    { f: 0.72, lines: [['PARDON', 34, VIO], ['Article 72 · President', 36, INK], ['Article 161 · Governor', 36, INK]] },
  ], 300, 420);
};
SCENES.S044 = trap('A Governor can pardon a court-martial sentence', 'Only the PRESIDENT (Article 72) can pardon a sentence passed by a court-martial', "The Governor's power under Article 161 does not extend to court-martial sentences");

// ---------- 5 · Labour codes ----------
SCENES.S051 = title(5, 'Labour Codes turn one', 'eco', 'In force since 21 Nov 2025');
SCENES.S052 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, '29 LAWS → 4 CODES', 'In force: 21 November 2025');
  for (let i = 0; i < 29; i++) { const a = eia(s, 0.1 + i * 0.03), col = i % 10, row = Math.floor(i / 10); if (a <= 0) continue;
    const g = span(s.t, T(s, 0.35), T(s, 0.35) + 0.8), x0 = 90 + col * 60, y0 = 260 + row * 70, x1 = 1000, y1 = 520;
    ctx.save(); ctx.globalAlpha *= a * (1 - g); exBox(ctx, x0 + (x1 - x0) * g, y0 + (y1 - y0) * g, 48, 54, { fill: '#E9D5FF', r: 8 }); ctx.restore(); }
  kt(ctx, '29 central labour laws', 90, 520, { font: F.ui(40, 900), color: '#FFFFFF', alpha: eia(s, 0.3) * (1 - span(s.t, T(s, 0.35), T(s, 0.35) + 0.8)) });
  [['Code on Wages', '2019'], ['Industrial Relations Code', '2020'], ['Code on Social Security', '2020'], ['Occupational Safety, Health & Working Conditions Code', '2020']].forEach(([n, y], i) =>
    zoom(ctx, bounce(s.t, T(s, 0.45 + i * 0.1)), 1380, 290 + i * 180, () => box(ctx, 960, 220 + i * 180, 890, 150, YEL, [[n, 36, INK], [y, 30, VIO]])));
};
SCENES.S053 = (ctx, s) => dilemma(ctx, s, PAL.eco, 'WHAT CHANGED',
  [['WORKERS', 44, INK], ['a national floor wage', 36, INK, 800], ['gig & platform workers: in law, with social security (a first)', 34, INK, 800]],
  [['EMPLOYERS', 44, INK], ['simpler compliance', 36, INK, 800], ['fixed-term employment', 36, INK, 800]],
  [['Some provisions phased in · the real test: how states write and enforce their rules', 34, INK]]);
SCENES.S054 = trap('Labour is in the Union List', 'Labour is in the CONCURRENT List: both Parliament and the states can make laws', 'States frame their own rules under the four codes');

// ---------- bridge ----------
SCENES.S900 = band([['5 DONE · 7 TO GO', YEL, 116], ['Now India: security, our coast, our states', '#FFFFFF', 60]]);

// ---------- 6 · Defence ----------
SCENES.S061 = title(6, 'One week, four defence partners', 'world', 'Talks · exercises · a missile upgrade');
SCENES.S062 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'INDIA\'S DEFENCE WEEK');
  [['JAPAN', '4th 2+2 ministerial dialogue', 'Tokyo · 18–19 Nov', YEL], ['MALAYSIA', 'Harimau Shakti', 'jungle + counter-insurgency · 18–30 Nov', '#FFFFFF'], ['SRI LANKA', 'Mitra Shakti (12th)', 'counter-terrorism · 13–26 Nov', '#FFFFFF'], ['ISRAEL', 'Barak missile upgrade · Navy', '≈ ₹1,976 crore contract', GRN]].forEach(([k, a, b, f], i) => {
    const x = 72 + (i % 2) * 900, y = 200 + Math.floor(i / 2) * 400;
    zoom(ctx, bounce(s.t, T(s, 0.03 + i * 0.22)), x + 420, y + 170, () => box(ctx, x, y, 840, 350, f, [[k, 34, VIO], [a, 46, INK], [b, 32, INK, 800]])); });
};
SCENES.S063 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHAT IS A 2+2?');
  zoom(ctx, bounce(s.t, T(s, 0.05)), 960, 360, () => box(ctx, 72, 220, 1776, 260, YEL, [['2+2 = foreign + defence ministers meeting together', 50, INK], ['a format India keeps for its closest partners', 36, INK, 800]]));
  zoom(ctx, bounce(s.t, T(s, 0.45)), 960, 700, () => box(ctx, 72, 560, 1776, 260, '#FFFFFF', [['With Japan → Act East Policy + the Indo-Pacific', 46, INK]]));
};

// ---------- 7 · Cyclone ----------
SCENES.S071 = title(7, 'Cyclone Akvan crosses our coast', 'env', 'Landfall · 20 Nov 2026');
SCENES.S072 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'LANDFALL · 20 NOV', 'North Andhra Pradesh – south Odisha coast');
  flow(ctx, s, [
    { f: 0.05, lines: [['WHERE', 30, VIO], ['near Gopalpur', 48, INK], ['Ganjam, Odisha', 32, INK, 700]] },
    { f: 0.35, lines: [['RED ALERT', 30, RED], ['Srikakulam', 44, INK], ['Vizianagaram', 44, INK]] },
    { f: 0.65, lines: [['SAFETY', 30, VIO], ['3 lakh+', 56, INK], ['people evacuated (as reported)', 28, INK, 700]] },
  ], 300, 420, ['#FFFFFF', '#FFD9DC', GRN]);
  source(ctx, s, 'India Meteorological Department via newsonair, 20 Nov 2026');
};
SCENES.S073 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'NAME + STRENGTH');
  const L = [['Depression', '31–49'], ['Deep depression', '50–61'], ['Cyclonic storm', '62–88'], ['Severe', '89–117'], ['Very severe', '118–165'], ['Extremely severe', '166–220'], ['Super cyclone', '222+']];
  L.forEach(([n, v], i) => { const y = 860 - i * 95, w = 300 + i * 70; zoom(ctx, bounce(s.t, T(s, 0.45 + i * 0.05)), 72 + w / 2, y + 40, () => { exBox(ctx, 72, y, w, 82, { fill: i >= 2 && i <= 4 ? YEL : '#FFFFFF', r: 14 }); kt(ctx, n + '  ' + v, 96, y + 54, { font: F.ui(32, 900), color: INK }); }); });
  kt(ctx, 'km/h · India Meteorological Department', 72, 1000, { font: F.ui(28, 800), color: '#FFFFFF', alpha: eia(s, T(s, 0.5)) });
  zoom(ctx, bounce(s.t, T(s, 0.05)), 1400, 380, () => box(ctx, 1000, 200, 850, 380, '#FFFFFF', [['"AKVAN" · given by IRAN', 44, INK], ['from a demon in the Persian epic Shahnameh', 30, VIO, 800], ['13 countries · 169 names (2020) · used in order', 32, INK, 800], ['Murasu (India) → Akvan (Iran) → Kaani (Maldives)', 28, VIO, 800]]));
};
SCENES.S074 = trap('Yanam is part of Andhra Pradesh', 'Yanam belongs to the Union Territory of PUDUCHERRY', 'It sits on the Andhra coast, near Kakinada');

// ---------- 8 · Nagarjuna Sagar ----------
SCENES.S081 = title(8, 'Telugu States: Nagarjuna Sagar water row', 'env', 'Telugu States Lens');
SCENES.S082 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'KRISHNA RIVER · SHARED RESERVOIRS');
  flow(ctx, s, [
    { f: 0.05, lines: [['UPSTREAM', 30, VIO], ['Srisailam', 50, INK]] },
    { f: 0.3, lines: [['THE ROW', 30, RED], ['Nagarjuna Sagar', 46, INK], ['Nalgonda (TG) · Palnadu (AP)', 30, INK, 700]] },
    { f: 0.6, lines: [['THE STAKES', 30, VIO], ['drinking water', 44, INK], ['in a dry year', 32, INK, 700]] },
  ], 300, 420, ['#FFFFFF', YEL, '#FFFFFF']);
  source(ctx, s, 'Telangana Today, 16 Nov 2026');
};
SCENES.S083 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHO DECIDES?');
  mind(ctx, s, 'Krishna water', [
    { f: 0.05, x: 72, y: 190, w: 600, h: 190, lines: [['Krishna River Management Board', 32, VIO], ['AP Reorganisation Act, 2014', 34, INK]] },
    { f: 0.35, x: 1248, y: 190, w: 600, h: 190, lines: [['Tribunal I', 32, VIO], ['Justice Bachawat · award 1976', 34, INK]] },
    { f: 0.55, x: 1248, y: 800, w: 600, h: 190, lines: [['Tribunal II', 32, VIO], ['Justice Brijesh Kumar', 36, INK]] },
    { f: 0.75, x: 72, y: 800, w: 600, h: 190, fill: YEL, lines: [['Article 262', 36, VIO], ['Parliament can bar courts', 34, INK]] },
  ], c);
};

// ---------- 9 · Earthshot ----------
SCENES.S091 = title(9, 'An Indian company wins the Earthshot Prize', 'env', 'Mumbai · 17 Nov 2026');
SCENES.S092 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHAT IS THE EARTHSHOT PRIZE?');
  flow(ctx, s, [
    { f: 0.05, lines: [['WHO · WHEN', 30, VIO], ['Prince William', 44, INK], ['+ The Royal Foundation · 2020', 30, INK, 700]] },
    { f: 0.35, lines: [['HOW', 30, VIO], ['5 winners a year', 42, INK], ['£1 million each', 40, INK]] },
    { f: 0.65, lines: [['WHERE', 30, VIO], ['Mumbai · 17 Nov', 44, INK], ['6th edition · first in India', 30, INK, 700]] },
  ], 300, 420, ['#FFFFFF', '#FFFFFF', YEL]);
};
SCENES.S093 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE 2026 WINNERS');
  [['Mahindra Last Mile Mobility (India)', 'Clean Our Air · 4 lakh+ electric autos', YEL], ['Bhutan', 'Protect and Restore Nature · first country to win', '#FFFFFF'], ['Niue Ocean Wide Trust', 'Revive Our Oceans', '#FFFFFF'], ['PFAS-Free France', 'Build a Waste-Free World', '#FFFFFF'], ['Ørsted (Denmark)', 'Fix Our Climate · oil & gas → offshore wind', '#FFFFFF']].forEach(([n, d, f], i) =>
    zoom(ctx, bounce(s.t, T(s, 0.03 + (i === 0 ? 0 : 0.35 + i * 0.1))), 960, 240 + i * 150, () => { exBox(ctx, 72, 180 + i * 150, 1776, 130, { fill: f, r: 20, bar: i === 0 ? GRN : SKY }); kt(ctx, n, 110, 236 + i * 150, { font: F.ui(42, 900), color: INK }); kt(ctx, d, 110, 284 + i * 150, { font: F.ui(32, 800), color: VIO }); }));
  kt(ctx, 'Earlier Indian winners: Takachar (2021) · Kheyti, Hyderabad (2022)', 72, 1000, { font: F.ui(34, 900), color: YEL, alpha: eia(s, T(s, 0.85)) });
};
SCENES.S094 = trap('The Earthshot Prize is a United Nations award', "It is Prince William's prize; the UN's top green honour is Champions of the Earth", 'Champions of the Earth is given by the United Nations Environment Programme');

// ---------- 10 · COP31 ----------
SCENES.S101 = title(10, 'COP31: two captains, one deadlock', 'env', 'Antalya, Türkiye · 9–20 Nov 2026');
SCENES.S102 = (ctx, s) => dilemma(ctx, s, PAL.env, 'WHO RAN THE CLIMATE SUMMIT?',
  [['TÜRKIYE', 52, INK], ['host + COP31 President', 38, INK, 800], ['Murat Kurum', 36, VIO, 800]],
  [['AUSTRALIA', 52, INK], ['President of Negotiations', 38, INK, 800], ['Chris Bowen', 36, VIO, 800]],
  [['Every decision needs the consensus of nearly 200 countries', 38, INK]]);
SCENES.S103 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE FINAL-DAY FIGHT', 'Draft "Antalya Declaration", 20 Nov (as reported)');
  zoom(ctx, bounce(s.t, T(s, 0.05)), 500, 420, () => box(ctx, 72, 230, 856, 380, '#FFD9DC', [['DROPPED', 36, RED], ['fossil-fuel transition language', 38, INK], ['$120 bn adaptation target', 38, INK]]));
  zoom(ctx, bounce(s.t, T(s, 0.35)), 1420, 420, () => box(ctx, 992, 230, 856, 380, '#FFFFFF', [['DISAPPOINTED', 36, VIO], ['80+ countries', 52, INK], ['wanted a fossil-fuel roadmap', 32, INK, 800]]));
  zoom(ctx, bounce(s.t, T(s, 0.65)), 960, 800, () => box(ctx, 72, 680, 1776, 230, YEL, [['INDIA: deliver the Baku promise', 44, INK], ['at least $300 billion a year by 2035', 40, INK]]));
};

// ---------- 11 · SCO ----------
SCENES.S111 = title(11, 'India hosts the SCO Civilisational Dialogue', 'world', 'New Delhi · 20–22 Nov 2026');
SCENES.S112 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'A FIRST FOR THE SCO', 'Proposed by India at Tianjin, 2025 · venue: Purana Qila (as reported)');
  ['Philosophy', 'Art and architecture', 'Languages', 'Living traditions'].forEach((t, i) => zoom(ctx, bounce(s.t, T(s, 0.3 + i * 0.12)), 290 + i * 450, 520, () => box(ctx, 72 + i * 450, 400, 420, 240, i % 2 ? '#FFFFFF' : YEL, [[t, 40, INK]])));
};
SCENES.S113 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'SCO · 10 MEMBERS', 'Founded 2001 · chair 2026–27: Pakistan');
  const M = ['China', 'Russia', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan', 'Uzbekistan', 'India (2017)', 'Pakistan (2017)', 'Iran (2023)', 'Belarus (2024)'];
  M.forEach((m, i) => { const x = 72 + (i % 5) * 360, y = 220 + Math.floor(i / 5) * 160; zoom(ctx, bounce(s.t, T(s, 0.03 + i * 0.04)), x + 165, y + 60, () => box(ctx, x, y, 330, 130, i >= 6 ? YEL : '#FFFFFF', [[m, 32, INK]])); });
  zoom(ctx, bounce(s.t, T(s, 0.55)), 960, 750, () => box(ctx, 72, 600, 1776, 300, '#FFD9DC', [['PRELIMS TRAP · NOT members', 36, RED], ['Afghanistan · Mongolia · Turkmenistan', 48, INK]]));
};

// ---------- 12 · Days ----------
SCENES.S121 = title(12, "This week's important days", 'pol', 'Each one hides a static fact');
SCENES.S122 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE CALENDAR STRIP');
  const D = [['16 Nov', 'National Press Day', 'Press Council of India, 1966 · print only', 0.03], ['19 Nov', 'World Toilet Day', '"Safe toilets. Equal futures."', 0.3], ['19 Nov', 'Rani Lakshmibai', 'born 1828 · Jhansi', 0.5], ['20 Nov', "World Children's Day", 'UN child-rights convention, 1989', 0.7]];
  D.forEach(([d, n, w, f], i) => { const x = 72 + (i % 2) * 900, y = 200 + Math.floor(i / 2) * 400;
    zoom(ctx, bounce(s.t, T(s, f)), x + 420, y + 170, () => box(ctx, x, y, 840, 340, i % 3 ? '#FFFFFF' : YEL, [[d, 60, VIO], [n, 44, INK], [w, 30, INK, 800]])); });
};

// ---------- persons, places, awards ----------
SCENES.S141 = title('★', 'Persons, places & awards in news', 'world', 'The quick Prelims round');
SCENES.S142 = (ctx, s) => pcards(ctx, s, PAL.world, 'PERSONS IN NEWS', [
  { f: 0.03, tag: 'INTERNATIONAL COURT OF JUSTICE', name: 'Yuji Iwasawa', lines: ['President of the court (Japan)', 'read the Myanmar judgment'] },
  { f: 0.3, tag: 'INDIA AT THE UN', name: 'Bhavika Mangalanandan', lines: ["explained India's death-penalty vote"], bar: PNK },
  { f: 0.55, tag: 'COP31 · AUSTRALIA', name: 'Chris Bowen', lines: ['President of Negotiations'], bar: GRN },
  { f: 0.75, tag: 'SINGAPORE', name: 'Jack Sim', lines: ['founded the World Toilet Organization'], bar: SKY },
], 2);
SCENES.S143 = (ctx, s) => pcards(ctx, s, PAL.world, 'PLACES IN NEWS', [
  { f: 0.03, tag: 'MYANMAR', name: 'Rakhine', lines: ['homeland of the Rohingya'] },
  { f: 0.22, tag: 'CHINA · NEXT TO HONG KONG', name: 'Shenzhen', lines: ["China's first Special Economic Zone, 1980"], bar: PNK },
  { f: 0.45, tag: 'ODISHA', name: 'Gopalpur', lines: ['Cyclone Akvan landfall'], bar: GRN },
  { f: 0.62, tag: 'TÜRKIYE', name: 'Antalya', lines: ['COP31'], bar: SKY },
  { f: 0.8, tag: 'DELHI', name: 'Purana Qila', lines: ['SCO dialogue (as reported)'], bar: YEL },
], 3);
SCENES.S144 = (ctx, s) => pcards(ctx, s, PAL.world, 'AWARDS & CULTURE', [
  { f: 0.03, tag: 'GOA · 20–28 NOV', name: '57th Film Festival of India', lines: ['Country of Honour: Spain', 'Partner Country: Russia', 'Opening film: "Fatherland"'] },
  { f: 0.55, tag: 'MUMBAI · 17 NOV', name: 'Earthshot Prize', lines: ['Mahindra Last Mile Mobility', 'Clean Our Air'], bar: GRN },
], 2);

// ---------- Mains + close ----------
SCENES.S992 = (ctx, s) => {
  exSlide(ctx, PAL.pol, null, null); exChip(ctx, "THIS WEEK'S MAINS QUESTION", 72, 40, YEL, INK, 40, eia(s, 0.05));
  zoom(ctx, bounce(s.t, T(s, 0.05)), 960, 420, () => { exBox(ctx, 72, 180, 1776, 520, { fill: '#FFFFFF', bar: YEL, r: 26 }); kt(ctx, 'GS-2 · 15 marks · 250 words', 120, 260, { font: F.ui(42, 900), color: VIO });
    kt(ctx, 'For the first time, the International Court of Justice has held a State responsible for genocide. Discuss the significance of the Myanmar judgment for international law and its implications for India.', 120, 360, { font: F.ui(50, 900), color: INK, maxW: 1680, lh: 64 }); });
  kt(ctx, 'Write it · post it in the comments', 72, 800, { font: F.ui(48, 900), color: YEL, alpha: eia(s, T(s, 0.5)) });
  kt(ctx, 'All 13 MCQs with answers: practice sheet in the description', 72, 900, { font: F.ui(40, 800), color: '#FFFFFF', maxW: 1776, alpha: eia(s, T(s, 0.75)) });
};
SCENES.S999 = band([['12 STORIES · DATA · DIAGRAMS', YEL, 100], ['Share with one friend · Subscribe', '#FFFFFF', 64]], 'A new class every Sunday, 6 PM');

// ---------- MCQs ----------
const MCQS = [
 { id: 'S01', n: 1, kind: 'howmany', stem: 'Consider the following statements:', items: ['The International Court of Justice has 15 judges elected for 9-year terms.', 'The International Court of Justice can try individuals for genocide.', 'India is a party to the Genocide Convention.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 0, 1], why: 'Individuals are tried by the International Criminal Court; India ratified the Convention in 1959.' },
 { id: 'S02', n: 2, kind: 'howmany', stem: 'How many of these are recognised nuclear-weapon states under the Non-Proliferation Treaty?', items: ['China', 'India', 'France', 'Israel'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(b) Only two', ok: [1, 0, 1, 0], why: 'Only China and France; India and Israel are outside the treaty.' },
 { id: 'S03', n: 3, kind: 'howmany', stem: 'Of how many of these groupings is India a member?', items: ['Quad', 'East Asia Summit', 'ASEAN', 'Asia-Pacific Economic Cooperation (APEC)'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(b) Only two', ok: [1, 1, 0, 0], why: 'India is a partner of ASEAN, and not in APEC.' },
 { id: 'S04', n: 4, kind: 's12', stem: 'Which one of the following is correct in respect of the statements below?', items: ['Statement-I: The President can pardon a sentence passed by a court-martial.', "Statement-II: Article 72 extends the President's pardoning power to court-martial sentences."], opts: '(a) Both correct, II explains I   (b) Both correct, II does not explain I   (c) Only I correct   (d) Only II correct', ans: '(a) Both correct, and II explains I', ok: [1, 1], why: 'Article 72(1)(a) covers court-martial sentences; the Governor has no such power.' },
 { id: 'S05', n: 5, kind: 'howmany', stem: 'Consider the following statements:', items: ['Four labour codes replaced 29 central labour laws.', 'Labour is in the Union List.', 'The Code on Social Security covers gig and platform workers.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 0, 1], why: 'Labour is in the Concurrent List.' },
 { id: 'S06', n: 6, kind: 'pairs', stem: 'How many of the following pairs (exercise — partner) are correctly matched?', items: ['Harimau Shakti — Malaysia', 'Mitra Shakti — Sri Lanka', 'JAIMEX — Japan (maritime)', 'Garuda Shakti — Malaysia'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(c) Only three', ok: [1, 1, 1, 0], why: 'Garuda Shakti is with Indonesia.' },
 { id: 'S07', n: 7, kind: 'howmany', stem: 'Consider the following statements:', items: ['Cyclone names are chosen according to the country a storm hits.', '"Akvan" was proposed by Iran.', 'Yanam is a part of Puducherry.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [0, 1, 1], why: 'Names are used in a fixed order.' },
 { id: 'S08', n: 8, kind: 'howmany', stem: 'Consider the following statements:', items: ['The Krishna River Management Board was set up under the AP Reorganisation Act, 2014.', 'The first Krishna tribunal was headed by Justice Bachawat.', "Under Article 262, Parliament may exclude the Supreme Court's jurisdiction over inter-state water disputes."], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(c) All three', ok: [1, 1, 1], why: 'All three are correct.' },
 { id: 'S09', n: 9, kind: 'pairs', stem: 'How many of the following pairs (Earthshot 2026 winner — category) are correctly matched?', items: ['Bhutan — Protect and Restore Nature', 'Niue — Fix Our Climate', 'Mahindra Last Mile Mobility — Clean Our Air'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 0, 1], why: 'Niue won Revive Our Oceans; Ørsted won Fix Our Climate.' },
 { id: 'S10', n: 10, kind: 'pairs', stem: 'How many of the following pairs are correctly matched?', items: ['COP21 — Paris', 'COP29 — Baku', 'COP30 — Belém', 'COP31 — Australia'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(c) Only three', ok: [1, 1, 1, 0], why: 'COP31 was held in Antalya, Türkiye; Australia led the negotiations.' },
 { id: 'S11', n: 11, kind: 'howmany', stem: 'How many of these are members of the Shanghai Cooperation Organisation?', items: ['Belarus', 'Turkmenistan', 'Iran', 'Mongolia'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(b) Only two', ok: [1, 0, 1, 0], why: 'Belarus and Iran are members.' },
 { id: 'S12', n: 12, kind: 'pairs', stem: 'How many of the following pairs are correctly matched?', items: ['16 November — National Press Day', '19 November — World Toilet Day', "20 November — World Children's Day", '22 March — Global Handwashing Day'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(c) Only three', ok: [1, 1, 1, 0], why: '22 March is World Water Day; Global Handwashing Day is 15 October.' },
 { id: 'S14', n: 13, kind: 'pairs', stem: 'How many of the following pairs are correctly matched?', items: ['Yuji Iwasawa — President, International Court of Justice', "Shenzhen — China's first Special Economic Zone", 'Gopalpur — Andhra Pradesh', 'Film Festival of India 2026 — Country of Honour: Spain'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(c) Only three', ok: [1, 1, 0, 1], why: 'Gopalpur is in Odisha.' },
];
MCQS.forEach(m => { SCENES[m.id + '8'] = mcqScene(m, false); SCENES[m.id + '9'] = mcqScene(m, true); });
