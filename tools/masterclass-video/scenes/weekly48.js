// W48 weekly (weeks/2026-W48/weekly): "November 4th Week Current Affairs", 16:9, ON CAMERA at chosen rows.
// Render: node render.js <assets> <timeline> scenes/weekly48.js <out> --strict
// Building blocks copied from weekly47.js; builds keyed to fractions of each row; numbers at final values. Maps are schematic
// (no India outline drawn), so no Survey of India boundary question arises; real GIS frames can replace them later.
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

// ---------- shared small pieces for W48 ----------
const chip = (ctx, s, t, x, y, bg, fg, z, f) => exChip(ctx, t, x, y, bg, fg, z, eia(s, T(s, f)));
const pp = (ctx, s, f, x, y, w, h, fill, lines, o) => zoom(ctx, bounce(s.t, T(s, f)), x + w / 2, y + h / 2, () => box(ctx, x, y, w, h, fill, lines, o));
function board(ctx, s, c, label, sub, items, cols, h = 230) {   // a grid of cards: [f, fill, lines]
  exSlide(ctx, c, null, null); head(ctx, s, c, label, sub);
  const w = (1776 - (cols - 1) * 36) / cols, y0 = sub ? 220 : 190;
  items.forEach(([f, fill, lines], i) => pp(ctx, s, f, 72 + (i % cols) * (w + 36), y0 + Math.floor(i / cols) * (h + 30), w, h, fill, lines));
}

// ---------- open ----------
SCENES.S000 = band([['NOVEMBER 4th WEEK', YEL, 116], ['12 stories · data · diagrams', '#FFFFFF', 70]], 'Decode UPSC with Mounika · English + Telugu');
SCENES.S001 = (ctx, s) => {
  exSlide(ctx, PAL.world, null, null); kt(ctx, "TODAY'S 12 STORIES", 72, 120, { font: F.head(60, 900), color: '#FFFFFF', alpha: eia(s, 0.05) });
  const G = { w: SKY, i: YEL, d: GRN };
  const L = [['US tariff threat', 'w'], ["Nepal PM in Delhi", 'w'], ['COP31: no deal', 'w'], ['Asia Power Index', 'w'], ["Pakistan's astronaut", 'w'], ['Strait of Hormuz', 'i'],
    ['Made-in-India machines', 'i'], ['Nitish Setu', 'i'], ['Constitution Day', 'd'], ['Two heroes, 24 Nov', 'd'], ['Child-marriage-free India', 'd'], ['Persons & places', 'd']];
  L.forEach(([nm, g], i) => { const col = Math.floor(i / 4), row = i % 4, x = 72 + col * 610, y = 190 + row * 150;
    zoom(ctx, bounce(s.t, 0.3 + i * (s.d * 0.6 / 12)), x + 285, y + 55, () => { exBox(ctx, x, y, 570, 120, { fill: '#FFFFFF', bar: G[g], r: 22 }); kt(ctx, String(i + 1), x + 56, y + 80, { font: F.head(50, 900), color: VIO, align: 'center' }); kt(ctx, nm, x + 108, y + 78, { font: F.ui(38, 900), color: INK, maxW: 440 }); }); });
  [['World stage', SKY], ['Oil · machines · bridges', YEL], ['Days · history · society', GRN]].forEach(([t, c2], i) => exChip(ctx, t, 72 + i * 600, 830, c2, INK, 30, eia(s, 0.4)));
};

// ---------- 1 · US Section 301 ----------
SCENES.S011 = title(1, "America's tariff threat", 'eco', 'Section 301 · proposed 25 Nov 2026');
SCENES.S012 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE PROPOSAL · 25 NOV 2026', 'Office of the US Trade Representative · Section 301, Trade Act of 1974');
  vbars(ctx, s, 160, 820, 20, 300, 120, [['No trade deal', 25, 'up to 25%', '#FFB3B9'], ['With a trade deal', 17, '17%', GRN]], 0.05, 0.18);
  pp(ctx, s, 0.5, 1000, 250, 850, 240, '#FFFFFF', [['WHY', 32, VIO], ['India\'s "structural excess capacity"', 42, INK], ['called unreasonable', 34, INK, 800]]);
  pp(ctx, s, 0.72, 1000, 530, 850, 290, YEL, [['PROPOSED · NOT IN FORCE', 40, RED], ['Comments till 5 Jan 2027', 38, INK], ['Hearing 25 Jan 2027', 38, INK]]);
  source(ctx, s, 'USTR proposal as reported (ThePrint, 25 Nov 2026)');
};
SCENES.S013 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHY SECTION 301 NOW?');
  flow(ctx, s, [
    { f: 0.05, lines: [['IEEPA, 1977', 34, VIO], ['emergency-powers tariffs', 38, INK]] },
    { f: 0.3, lines: [['20 FEB 2026', 34, RED], ['US Supreme Court strikes them down', 36, INK]] },
    { f: 0.55, lines: [['SECTION 301', 34, VIO], ['older, narrower tool', 38, INK], ['US Trade Representative', 28, INK, 700]] },
  ], 230, 360, ['#FFFFFF', '#FFD9DC', YEL]);
  pp(ctx, s, 0.75, 72, 650, 1776, 260, '#FFFFFF', [['LEFT OUT (as reported) · already under SECTION 232', 34, VIO], ['steel · aluminium · vehicles · semiconductors · patented medicines', 40, INK]]);
};
SCENES.S014 = (ctx, s) => dilemma(ctx, s, PAL.eco, 'THE STAKES FOR INDIA',
  [['INDIA', 52, INK], ['America = our biggest export market', 38, INK, 800], ['textiles · gems · engineering goods', 34, VIO, 800], ['India disputes the finding', 34, INK, 800]],
  [['MAINS QUESTION', 44, INK], ['Can one country punish another\'s industrial policy without the WTO?', 38, INK, 800], ['Make in India = "excess capacity"?', 34, VIO, 800]]);
SCENES.S017 = trap('Section 232 deals with unfair trade practices', 'Section 301 = unfair trade practices (US Trade Representative) · Section 232 = national security (US Commerce Department)', 'IEEPA = emergency powers · struck down by the US Supreme Court in February 2026');

// ---------- 2 · Nepal ----------
SCENES.S021 = title(2, "Nepal's Prime Minister in Delhi", 'world', 'State visit · 22–23 Nov 2026');
SCENES.S022 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'BALENDRA SHAH IN DELHI', 'Prime Minister of Nepal since March 2026 · first state visit to India');
  const M = ['Space', 'Police & forensics', 'Civil service', 'Health', 'Traditional medicine', 'Urban development', 'Agriculture', '+ 1 more'];
  M.forEach((m, i) => pp(ctx, s, 0.08 + i * 0.05, 72 + (i % 4) * 450, 230 + Math.floor(i / 4) * 150, 420, 120, i % 2 ? '#FFFFFF' : YEL, [[m, 34, INK]]));
  kt(ctx, '8 MoUs', 72, 560, { font: F.head(56, 900), color: YEL, alpha: eia(s, T(s, 0.1)) });
  pp(ctx, s, 0.6, 72, 600, 1776, 300, GRN, [['about ₹15,000 crore (reported)', 54, INK], ['₹3,500 crore grants  +  ₹11,500 crore line of credit', 40, INK], ['post-flood rebuilding · energy projects', 32, INK, 800]]);
};
SCENES.S023 = (ctx, s) => board(ctx, s, PAL.world, 'THE STATIC BASE', 'Treaties on paper, rivers on the ground', [
  [0.03, YEL, [['1950', 36, VIO], ['Treaty of Peace and Friendship', 40, INK], ['open border · Nepalis can live and work in India', 28, INK, 800]]],
  [0.25, '#FFFFFF', [['1954', 36, VIO], ['Kosi agreement', 44, INK]]],
  [0.33, '#FFFFFF', [['1959', 36, VIO], ['Gandak agreement', 44, INK]]],
  [0.42, '#FFFFFF', [['1996', 36, VIO], ['Mahakali Treaty', 44, INK], ['Pancheshwar project', 30, INK, 800]]],
  [0.65, '#FFD9DC', [['SORE POINT', 34, RED], ['Kalapani · Lipulekh · Limpiyadhura', 40, INK], ['shown on Nepal\'s 2020 map', 30, INK, 800]]],
  [0.85, GRN, [['BORDER STATES', 34, INK], ['5', 70, INK]]],
], 3, 300);
SCENES.S027 = trap('Nepal borders four Indian states', 'Five: Uttarakhand · Uttar Pradesh · Bihar · West Bengal · Sikkim', 'Sikkim is the one students forget');

// ---------- 3 · COP31 ----------
SCENES.S031 = title(3, 'COP31 ends with no deal', 'env', 'Update · Antalya, Türkiye · 22 Nov 2026');
SCENES.S032 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); head(ctx, s, c, 'UPDATE · WHAT CHANGED SINCE LAST WEEK');
  flow(ctx, s, [
    { f: 0.05, lines: [['LAST WEEK', 32, VIO], ['draft dropped fossil-fuel language', 38, INK]] },
    { f: 0.35, lines: [['22 NOV', 32, RED], ['"Antalya Pact" NOT adopted', 42, INK]] },
  ], 230, 300, ['#FFFFFF', '#FFD9DC']);
  pp(ctx, s, 0.55, 72, 590, 860, 270, '#FFFFFF', [['REFUSED a text without fossil fuels', 32, VIO], ['EU · UK · small island states', 38, INK]]);
  pp(ctx, s, 0.65, 990, 590, 860, 270, '#FFFFFF', [['REFUSED to add fossil fuels', 32, VIO], ['oil producers', 40, INK]]);
  kt(ctx, 'First COP without an overall deal since Copenhagen, 2009', 72, 960, { font: F.ui(46, 900), color: YEL, maxW: 1776, alpha: eia(s, T(s, 0.8)) });
};
SCENES.S033 = (ctx, s) => board(ctx, s, PAL.env, 'WHAT SURVIVES', null, [
  [0.05, GRN, [['✓ Paris Agreement, 2015', 44, INK], ['untouched', 32, INK, 800]]],
  [0.2, GRN, [['✓ Dubai, 2023 (COP28)', 44, INK], ['"transition away from fossil fuels"', 32, INK, 800]]],
  [0.35, '#FFFFFF', [['✓ Technical decisions', 44, INK], ['adopted separately', 32, INK, 800]]],
  [0.6, YEL, [['CORRECTION (last week)', 32, RED], ['DEVELOPED countries · at least $300 BILLION a year by 2035', 38, INK], ['the Baku finance goal (COP29)', 30, INK, 800]]],
], 2, 300);
SCENES.S034 = band([["INDIA'S STAND", YEL, 90], ['Common but differentiated responsibilities', '#FFFFFF', 62], ['Finance from the developed world first', '#FFFFFF', 62]]);

// ---------- 4 · Asia Power Index ----------
SCENES.S041 = title(4, "India is Asia's third power", 'world', 'Lowy Institute · Asia Power Index 2026');
SCENES.S042 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'ASIA POWER INDEX 2026', 'Released 22 Nov 2026 · Lowy Institute, Sydney');
  [['1', 'United States', SKY], ['2', 'China', '#FFB3B9'], ['3', 'India · about 40.5 (reported)', YEL]].forEach(([r, n, col], i) => pp(ctx, s, 0.05 + i * 0.12, 72, 240 + i * 170, 1100, 140, col, [[r + '   ' + n, 48, INK]]));
  pp(ctx, s, 0.6, 1230, 240, 620, 480, '#FFFFFF', [['India–China gap', 38, VIO], ['narrowest since the index began in 2018', 40, INK], ['China still far ahead', 32, RED]]);
  source(ctx, s, 'Lowy Institute; score as reported, 22–26 Nov 2026');
};
SCENES.S043 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, '27 COUNTRIES · 8 MEASURES');
  const M = [['Economic capability', 0], ['Military capability', 0], ['Resilience', 1], ['Future resources', 1], ['Economic relationships', -1], ['Defence networks', -1], ['Diplomatic influence', 0], ['Cultural influence', 0]];
  M.forEach(([m, g], i) => pp(ctx, s, 0.05 + i * 0.06, 72 + (i % 4) * 450, 220 + Math.floor(i / 4) * 230, 420, 200, g > 0 ? GRN : g < 0 ? '#FFD9DC' : '#FFFFFF', [[m, 36, INK], [g > 0 ? 'India: strong' : g < 0 ? 'India: weaker' : '', 28, g > 0 ? '#065F46' : RED, 800]]));
};
SCENES.S047 = trap('The Asia Power Index is published by the United Nations', 'It is published by the Lowy Institute, an Australian think tank in Sydney', 'Who publishes which index: a favourite Prelims trap');

// ---------- 5 · Shenzhou-24 ----------
SCENES.S051 = title(5, "Pakistan's first astronaut", 'world', 'Shenzhou-24 · 25 Nov 2026 · Tiangong');
SCENES.S052 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'SHENZHOU-24 · 25 NOV 2026', 'Long March 2F · Jiuquan launch centre');
  pp(ctx, s, 0.05, 72, 240, 860, 420, YEL, [['Muhammad Zeeshan Ali', 50, INK], ["Pakistan's first astronaut", 40, INK], ['payload specialist', 34, VIO, 800]]);
  pp(ctx, s, 0.45, 990, 240, 860, 420, '#FFFFFF', [['FIRST', 40, RED], ['foreign astronaut on', 40, INK], ['Tiangong', 60, INK], ["China's own space station", 32, VIO, 800]]);
};
SCENES.S053 = (ctx, s) => dilemma(ctx, s, PAL.world, 'TWO SPACE STATIONS',
  [['TIANGONG', 52, INK], ["China's own station", 38, INK, 800], ['now hosting partners like Pakistan', 32, VIO, 800]],
  [['INTERNATIONAL SPACE STATION', 44, INK], ['US · Russia · Europe · Japan · Canada', 34, INK, 800], ['China is NOT a partner', 36, RED, 800]]);
SCENES.S054 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, "INDIA'S RECORD IN SPACE");
  flow(ctx, s, [
    { f: 0.05, lines: [['1984', 36, VIO], ['Rakesh Sharma', 42, INK], ['Soviet Soyuz', 28, INK, 700]] },
    { f: 0.3, lines: [['2025', 36, VIO], ['Shubhanshu Shukla', 40, INK], ['Axiom-4 · first Indian on the ISS', 28, INK, 700]] },
    { f: 0.55, lines: [['NEXT', 36, VIO], ['Gaganyaan', 46, INK], ['uncrewed test flight', 28, INK, 700]] },
    { f: 0.75, lines: [['BY 2035', 36, VIO], ['Bharatiya Antariksh Station', 36, INK]] },
  ], 300, 400, ['#FFFFFF', '#FFFFFF', YEL, GRN]);
};
SCENES.S057 = trap('China is a partner of the International Space Station', "China runs its own station, Tiangong · Jiuquan's launch centre sits in Inner Mongolia, though named after a city in Gansu");

// ---------- bridge ----------
SCENES.S900 = band([['HALF-WAY · 5 STORIES DONE', YEL, 100], ['Now: our oil, our machines, our bridges', '#FFFFFF', 60]]);

// ---------- 6 · Hormuz + Telugu States Lens ----------
SCENES.S061 = title(6, 'The Strait of Hormuz', 'world', "India's oil route · and what is in Visakhapatnam");
SCENES.S062 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'NOVEMBER 2026 · TANKERS ON FIRE');
  pp(ctx, s, 0.05, 72, 230, 1776, 260, '#FFFFFF', [["Iran's Revolutionary Guard: tankers struck sea mines in the Strait", 44, INK], ['claims NOT independently verified', 34, RED, 800]]);
  pp(ctx, s, 0.5, 72, 540, 860, 260, '#FFD9DC', [['Traffic through the Strait', 36, INK], ['dropped sharply', 48, RED]]);
  pp(ctx, s, 0.7, 990, 540, 860, 260, GRN, [['Indian Navy', 44, INK], ['escorting India\'s tankers (reported)', 34, INK, 800]]);
};
SCENES.S063 = (ctx, s) => {   // schematic of the strait (no India outline)
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHERE IS THE STRAIT?', 'Schematic, not to scale');
  const g = eia(s, T(s, 0.05)); ctx.save(); ctx.globalAlpha *= g;
  ctx.fillStyle = '#C8B48A'; ctx.beginPath(); ctx.moveTo(150, 230); ctx.lineTo(1800, 230); ctx.lineTo(1800, 470); ctx.bezierCurveTo(1300, 470, 1100, 420, 960, 520); ctx.bezierCurveTo(800, 430, 500, 520, 150, 520); ctx.fill();
  ctx.beginPath(); ctx.moveTo(700, 1000); ctx.bezierCurveTo(800, 700, 900, 640, 960, 600); ctx.bezierCurveTo(1010, 640, 1080, 720, 1200, 1000); ctx.fill(); ctx.restore();
  kt(ctx, 'IRAN', 960, 330, { font: F.head(64, 900), color: INK, align: 'center', alpha: g });
  kt(ctx, 'OMAN · Musandam', 960, 900, { font: F.head(46, 900), color: INK, align: 'center', alpha: eia(s, T(s, 0.15)) });
  kt(ctx, 'PERSIAN GULF', 380, 640, { font: F.ui(44, 900), color: '#DBEAFE', align: 'center', alpha: eia(s, T(s, 0.2)) });
  kt(ctx, 'GULF OF OMAN → ARABIAN SEA → INDIA', 1500, 640, { font: F.ui(40, 900), color: '#DBEAFE', align: 'center', maxW: 600, alpha: eia(s, T(s, 0.3)) });
  arrowR(ctx, 560, 700, 1300, eia(s, T(s, 0.35)), YEL);
  exChip(ctx, '≈ 1/5 of the world\'s oil', 72, 1000, YEL, INK, 36, eia(s, T(s, 0.6)));
  exChip(ctx, 'India imports ≈ 85% of its crude', 900, 1000, '#FFFFFF', INK, 36, eia(s, T(s, 0.75)));
};
SCENES.S064 = (ctx, s) => {
  const c = PAL.env; exSlide(ctx, c, null, null); exChip(ctx, 'TELUGU STATES LENS', 72, 44, '#2BB3A3', '#FFFFFF', 36, eia(s, 0.05));
  kt(ctx, "India's emergency oil: underground rock caverns · ISPRL", 76, 168, { font: F.ui(36, 800), color: '#FFFFFF', alpha: eia(s, 0.2) });
  hbars(ctx, s, 120, 300, 300, 120, 80, [['Visakhapatnam, Andhra Pradesh · the first', 1.33, '1.33 MMT', YEL], ['Mangaluru, Karnataka', 1.5, '1.5 MMT', '#FFFFFF'], ['Padur, Karnataka', 2.5, '2.5 MMT', '#FFFFFF']], 0.05, 0.15);
  pp(ctx, s, 0.65, 1150, 820, 700, 170, GRN, [['TOTAL 5.33 million tonnes', 40, INK]]);
};
SCENES.S067 = (ctx, s) => {
  exSlide(ctx, PAL.trap, null, null); exChip(ctx, 'PRELIMS TRAP · 3 CHOKE POINTS', 72, 50, '#FFFFFF', '#B91C1C', 44, eia(s, 0.05));
  [['HORMUZ', 'Persian Gulf ↔ Gulf of Oman', 'Iran · Oman'], ['BAB-EL-MANDEB', 'Red Sea ↔ Gulf of Aden', 'Yemen · Djibouti'], ['MALACCA', 'Indian Ocean ↔ South China Sea', 'Malaysia · Indonesia']].forEach(([n, w, by], i) =>
    pp(ctx, s, 0.05 + i * 0.25, 72 + i * 600, 230, 570, 560, i ? '#FFFFFF' : YEL, [[n, 46, INK], [w, 34, VIO, 800], [by, 30, INK, 800]]));
};

// ---------- 7 · CIE scheme ----------
SCENES.S071 = title(7, 'Made-in-India machines', 'eco', 'Cabinet · 25 Nov 2026 · ₹11,000 crore');
SCENES.S072 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'CONSTRUCTION & INFRASTRUCTURE EQUIPMENT SCHEME', 'Ministry of Heavy Industries · 8 years from 2026-27');
  ['Tunnel boring machines', 'Ship-to-shore cranes', 'Hydraulic excavators', 'Off-highway trucks'].forEach((m, i) => pp(ctx, s, 0.1 + i * 0.07, 72 + i * 450, 240, 420, 200, i % 2 ? '#FFFFFF' : YEL, [[m, 38, INK]]));
  pp(ctx, s, 0.5, 72, 500, 1776, 180, GRN, [['₹11,000 crore · incentive linked to EXTRA (incremental) sales each year', 42, INK]]);
  pp(ctx, s, 0.7, 72, 710, 1776, 170, '#FFFFFF', [['up to ₹375 crore · a national testing facility', 42, INK]]);
};
SCENES.S073 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null); head(ctx, s, c, 'WHY NOW?');
  vbars(ctx, s, 160, 760, 140, 280, 110, [['China', 3, '1st', '#FFB3B9'], ['United States', 2.2, '2nd', SKY], ['India', 1.6, '3rd', YEL]], 0.05, 0.12);
  kt(ctx, "Construction-equipment industry: world ranking", 160, 880, { font: F.ui(34, 900), color: '#FFFFFF', alpha: eia(s, T(s, 0.3)) });
  pp(ctx, s, 0.55, 1300, 220, 550, 560, '#FFD9DC', [['BUT', 40, RED], ['the biggest machines are imported, mostly from China', 36, INK], ['China now asks export licences for tunnel boring machines', 30, INK, 800]]);
};
SCENES.S077 = trap('The scheme is run by the Ministry of Commerce', 'Ministry of Heavy Industries · incentive tied to incremental sales, like the Production Linked Incentive schemes');

// ---------- 8 · Nitish Setu ----------
SCENES.S081 = title(8, 'Nitish Setu', 'pol', "India's new longest river bridge · opened 21 Nov 2026");
SCENES.S082 = (ctx, s) => {   // schematic river crossing
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'NITISH SETU · OVER THE GANGA', 'Schematic, not to scale');
  const g = eia(s, T(s, 0.05)); ctx.save(); ctx.globalAlpha *= g; ctx.fillStyle = '#4A90C2'; ctx.fillRect(0, 470, W, 200); ctx.restore();
  kt(ctx, 'GANGA', 1700, 590, { font: F.head(48, 900), color: '#FFFFFF', align: 'center', alpha: g });
  pp(ctx, s, 0.15, 520, 820, 880, 150, '#FFFFFF', [['Kachchi Dargah · near Patna (south bank)', 36, INK]]);
  pp(ctx, s, 0.15, 520, 230, 880, 150, '#FFFFFF', [['Bidupur · Vaishali (north bank)', 36, INK]]);
  const p = span(s.t, T(s, 0.3), T(s, 0.55)); if (p > 0) { ctx.save(); ctx.strokeStyle = YEL; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(960, 820); ctx.lineTo(960, 820 - 440 * p); ctx.stroke(); ctx.restore(); }
  exChip(ctx, '9.76 km · 6 lanes', 1010, 560, YEL, INK, 40, eia(s, T(s, 0.55)));
  exChip(ctx, 'corridor with approaches ≈ 19.76 km', 72, 1000, '#FFFFFF', INK, 30, eia(s, T(s, 0.7)));
};
SCENES.S083 = (ctx, s) => board(ctx, s, PAL.pol, 'THE BRIDGE RECORDS', 'Look-alikes the examiner loves', [
  [0.05, YEL, [['Nitish Setu · Ganga', 40, INK], ['9.76 km · longest river bridge (reported)', 32, INK, 800]]],
  [0.2, '#FFFFFF', [['Bhupen Hazarika Setu · Lohit', 40, INK], ['≈ 9.15 km · record until now', 32, INK, 800]]],
  [0.4, '#FFFFFF', [['Bogibeel · Brahmaputra', 40, INK], ['longest rail-cum-road bridge', 32, INK, 800]]],
  [0.6, SKY, [['Atal Setu · Mumbai', 40, INK], ['≈ 21.8 km · longest SEA bridge', 32, INK, 800]]],
  [0.8, '#FFFFFF', [['Mahatma Gandhi Setu · Patna–Hajipur', 38, INK], ['river record 1982–2017', 32, INK, 800]]],
], 2, 220);

// ---------- 9 · Constitution Day ----------
SCENES.S091 = title(9, 'Constitution Day', 'pol', '26 November · Samvidhan Divas');
SCENES.S092 = (ctx, s) => dilemma(ctx, s, PAL.pol, 'TWO DATES · DO NOT SWAP',
  [['ADOPTED', 48, INK], ['26 November 1949', 52, VIO], ['Samvidhan Divas since 2015 · 77th', 32, INK, 800]],
  [['FULLY IN FORCE', 48, INK], ['26 January 1950', 52, VIO], ['Republic Day', 32, INK, 800]],
  [['Article 394: citizenship, elections and a few others began on 26 Nov 1949 itself', 34, INK]]);
SCENES.S093 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'ALSO ON 26 NOVEMBER · NATIONAL MILK DAY');
  pp(ctx, s, 0.05, 72, 240, 1776, 260, YEL, [['Dr Verghese Kurien · born 26 Nov 1921', 52, INK], ['"father of the White Revolution"', 38, INK, 800]]);
  flow(ctx, s, [{ f: 0.3, lines: [['Amul', 46, INK], ['cooperative model', 30, INK, 700]] }, { f: 0.45, lines: [['Anand, Gujarat', 42, INK]] }, { f: 0.6, lines: [['Operation Flood', 42, INK], ['from 1970', 30, INK, 700]] }], 580, 280);
};
SCENES.S094 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, '26/11 · 18 YEARS');
  flow(ctx, s, [
    { f: 0.05, lines: [['26 Nov 2008', 36, RED], ['Mumbai terror attacks', 42, INK]] },
    { f: 0.4, lines: [['2008', 36, VIO], ['NIA Act', 46, INK], ['National Investigation Agency', 28, INK, 700]] },
    { f: 0.7, lines: [['After', 36, VIO], ['stronger coastal security', 40, INK]] },
  ], 300, 360, ['#FFD9DC', YEL, '#FFFFFF']);
};
SCENES.S097 = trap('The Constitution came into force on 26 November 1949', 'Adopted on 26 Nov 1949 · fully in force on 26 Jan 1950', 'A few provisions, like citizenship and elections, did start on 26 Nov 1949');

// ---------- 10 · Lachit + Guru Tegh Bahadur ----------
SCENES.S101 = title(10, 'Two heroes of November 24th', 'pol', 'Lachit Borphukan · Guru Tegh Bahadur');
SCENES.S102 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'LACHIT DIVAS · 24 NOV', '404th birth anniversary · born 1622 · Ahom general');
  const g = eia(s, T(s, 0.1)); ctx.save(); ctx.globalAlpha *= g; ctx.fillStyle = '#4A90C2'; ctx.fillRect(0, 430, W, 170); ctx.restore();
  kt(ctx, 'BRAHMAPUTRA · near Guwahati', 960, 530, { font: F.head(50, 900), color: '#FFFFFF', align: 'center', alpha: g });
  pp(ctx, s, 0.3, 72, 660, 860, 260, YEL, [['Battle of Saraighat · 1671', 44, INK], ['Ahoms defeat a larger Mughal army', 32, INK, 800]]);
  pp(ctx, s, 0.65, 990, 660, 860, 260, '#FFFFFF', [['National Defence Academy', 36, VIO], ['best cadet: Lachit Borphukan Gold Medal', 36, INK]]);
};
SCENES.S103 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'GURU TEGH BAHADUR · MARTYRDOM DAY', '9th Sikh Guru');
  flow(ctx, s, [
    { f: 0.05, lines: [['1675 · Delhi', 38, VIO], ['executed on Aurangzeb\'s orders', 36, INK]] },
    { f: 0.35, lines: [['for', 32, VIO], ['freedom of faith', 44, INK]] },
    { f: 0.6, lines: [['Gurdwara Sis Ganj Sahib', 38, INK], ['Chandni Chowk', 30, INK, 700]] },
  ], 260, 360);
  kt(ctx, '"Hind di Chadar" · the shield of India', 72, 820, { font: F.ui(50, 900), color: YEL, alpha: eia(s, T(s, 0.8)) });
};
SCENES.S107 = trap('Guru Tegh Bahadur founded the Khalsa', 'The Khalsa was founded in 1699 by his son, Guru Gobind Singh, the 10th Guru', 'Guru Tegh Bahadur was the 9th Guru');

// ---------- 11 · Bal Vivah Mukt Bharat ----------
SCENES.S111 = title(11, 'A child-marriage-free India', 'pol', 'Bal Vivah Mukt Bharat · two years');
SCENES.S112 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'BAL VIVAH MUKT BHARAT', 'Ministry of Women and Child Development · launched 27 Nov 2024');
  flow(ctx, s, [{ f: 0.1, lines: [['2024', 38, VIO], ['campaign launched', 42, INK]] }, { f: 0.4, lines: [['2026', 38, VIO], ['cut child marriage by 10%', 40, INK]] }, { f: 0.65, lines: [['2030', 38, VIO], ['child-marriage-free India', 40, INK]] }], 300, 360, ['#FFFFFF', YEL, GRN]);
};
SCENES.S113 = (ctx, s) => {
  const c = PAL.pol; exSlide(ctx, c, null, null); head(ctx, s, c, 'THE LAW · PROHIBITION OF CHILD MARRIAGE ACT, 2006');
  pp(ctx, s, 0.05, 72, 230, 860, 280, YEL, [['GIRLS', 40, VIO], ['18', 110, INK]]);
  pp(ctx, s, 0.15, 990, 230, 860, 280, YEL, [['BOYS', 40, VIO], ['21', 110, INK]]);
  pp(ctx, s, 0.35, 72, 560, 1776, 160, '#FFFFFF', [['Every state appoints Child Marriage Prohibition Officers', 40, INK]]);
  pp(ctx, s, 0.65, 72, 760, 1776, 200, '#FFD9DC', [['2021 bill to raise girls\' age to 21', 38, INK], ['lapsed when the 17th Lok Sabha was dissolved (2024)', 32, RED, 800]]);
};

// ---------- 12 · Persons and places ----------
SCENES.S121 = title(12, 'Persons and places in news', 'world', 'The quick Prelims round');
SCENES.S122 = (ctx, s) => pcards(ctx, s, PAL.world, 'PERSONS IN NEWS', [
  { f: 0.03, tag: 'NEPAL', name: 'Balendra Shah', lines: ['Prime Minister · visited India 22–23 Nov'] },
  { f: 0.28, tag: 'UNITED STATES', name: 'Jamieson Greer', lines: ['US Trade Representative · Section 301'], bar: PNK },
  { f: 0.5, tag: 'PAKISTAN', name: 'Muhammad Zeeshan Ali', lines: ['first astronaut · Shenzhou-24'], bar: GRN },
  { f: 0.72, tag: 'TÜRKIYE', name: 'Murat Kurum', lines: ['President of COP31'], bar: SKY },
], 2);
SCENES.S123 = (ctx, s) => pcards(ctx, s, PAL.world, 'PLACES IN NEWS', [
  { f: 0.03, tag: 'TÜRKIYE', name: 'Antalya', lines: ['Mediterranean coast · COP31'] },
  { f: 0.2, tag: 'CHINA', name: 'Jiuquan', lines: ['launch centre in Inner Mongolia'], bar: PNK },
  { f: 0.4, tag: 'OMAN', name: 'Musandam', lines: ['tip on the Strait of Hormuz'], bar: GRN },
  { f: 0.58, tag: 'ASSAM', name: 'Saraighat', lines: ['Brahmaputra · 1671'], bar: SKY },
  { f: 0.76, tag: 'BIHAR', name: 'Vaishali', lines: ['ancient republic · Nitish Setu'], bar: YEL },
], 3);

// ---------- Mains + close ----------
SCENES.S992 = (ctx, s) => {
  exSlide(ctx, PAL.pol, null, null); exChip(ctx, "THIS WEEK'S MAINS QUESTION", 72, 40, YEL, INK, 40, eia(s, 0.05));
  zoom(ctx, bounce(s.t, T(s, 0.05)), 960, 420, () => { exBox(ctx, 72, 180, 1776, 520, { fill: '#FFFFFF', bar: YEL, r: 26 }); kt(ctx, 'GS-2 / GS-3 · 15 marks · 250 words', 120, 260, { font: F.ui(42, 900), color: VIO });
    kt(ctx, 'America has proposed tariffs on India, calling its industrial policy unfair. Examine whether such one-sided trade actions weaken the multilateral trading system, and suggest how India should respond.', 120, 360, { font: F.ui(48, 900), color: INK, maxW: 1680, lh: 62 }); });
  kt(ctx, 'Write it · post it in the comments', 72, 800, { font: F.ui(48, 900), color: YEL, alpha: eia(s, T(s, 0.5)) });
  kt(ctx, 'All 12 MCQs with answers: practice sheet in the description', 72, 900, { font: F.ui(40, 800), color: '#FFFFFF', maxW: 1776, alpha: eia(s, T(s, 0.75)) });
};
SCENES.S999 = band([['12 STORIES · DATA · DIAGRAMS', YEL, 100], ['Share with one friend · Subscribe', '#FFFFFF', 64]], 'A new class every Sunday, 6 PM');

// ---------- MCQs ----------
const MCQS = [
 { id: 'S01', n: 1, kind: 'howmany', stem: 'Consider the following statements:', items: ['Section 301 of the US Trade Act deals with unfair foreign trade practices.', 'Section 232 tariffs are justified on national-security grounds.', 'The proposed 25% tariff on India is already in force.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 1, 0], why: 'The tariff is only proposed; comments close on 5 Jan 2027 and the hearing is on 25 Jan 2027.' },
 { id: 'S02', n: 2, kind: 'howmany', stem: 'How many of these Indian states share a border with Nepal?', items: ['Uttarakhand', 'Himachal Pradesh', 'Sikkim', 'West Bengal'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(c) Only three', ok: [1, 0, 1, 1], why: 'Himachal Pradesh does not touch Nepal.' },
 { id: 'S03', n: 3, kind: 'single', stem: 'Which of the statements given below are correct?', items: ['1. COP31 adopted the Antalya Pact.', '2. The 2023 Dubai decision to transition away from fossil fuels still stands.', '3. COP31 was presided over by Türkiye, with Australia leading the negotiations.'], opts: '(a) 1 and 2 only   (b) 2 and 3 only   (c) 1 and 3 only   (d) 1, 2 and 3', ans: '(b) 2 and 3 only', ok: [0, 1, 1], why: 'The Antalya Pact was not adopted.' },
 { id: 'S04', n: 4, kind: 'pairs', stem: 'How many of the following pairs (index — publisher) are correctly matched?', items: ['Asia Power Index — Lowy Institute', 'World Happiness Report — UNDP', 'Global Hunger Index — World Food Programme'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(a) Only one', ok: [1, 0, 0], why: 'Happiness: UN SDSN and partners; Hunger: Concern Worldwide and Welthungerhilfe.' },
 { id: 'S05', n: 5, kind: 'howmany', stem: 'Consider the following statements:', items: ['Tiangong is a part of the International Space Station.', 'Rakesh Sharma flew to space in 1984.', 'Shubhanshu Shukla was the first Indian to visit the International Space Station.'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [0, 1, 1], why: "Tiangong is China's own station." },
 { id: 'S06', n: 6, kind: 'pairs', stem: 'How many of the following pairs are correctly matched?', items: ['Strait of Hormuz — Persian Gulf and Gulf of Oman', 'Bab-el-Mandeb — Red Sea and Mediterranean Sea', 'Visakhapatnam — strategic petroleum reserve'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 0, 1], why: 'Bab-el-Mandeb joins the Red Sea to the Gulf of Aden; the Suez Canal links it to the Mediterranean.' },
 { id: 'S07', n: 7, kind: 'single', stem: 'Which ministry implements the new construction-equipment scheme?', items: ['(a) Ministry of Commerce and Industry', '(b) Ministry of Heavy Industries', '(c) Ministry of Road Transport and Highways', '(d) Ministry of Micro, Small and Medium Enterprises'], opts: '', ans: '(b) Ministry of Heavy Industries', ok: [0, 1, 0, 0], why: 'Eight years from 2026-27, with an incentive on incremental sales.' },
 { id: 'S08', n: 8, kind: 'pairs', stem: 'How many of the following pairs (bridge — water body) are correctly matched?', items: ['Bogibeel — Brahmaputra', 'Bhupen Hazarika Setu — Lohit', 'Atal Setu — Hooghly'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 1, 0], why: 'Atal Setu crosses the sea at Mumbai.' },
 { id: 'S09', n: 9, kind: 'single', stem: 'Which of the statements given below are correct?', items: ['1. The Constitution was adopted on 26 November 1949.', '2. No provision of the Constitution came into force before 26 January 1950.', '3. National Milk Day marks the birth anniversary of Verghese Kurien.'], opts: '(a) 1 and 2 only   (b) 1 and 3 only   (c) 2 and 3 only   (d) 1, 2 and 3', ans: '(b) 1 and 3 only', ok: [1, 0, 1], why: 'Citizenship and election provisions came into force on 26 Nov 1949 (Article 394).' },
 { id: 'S10', n: 10, kind: 'pairs', stem: 'How many of the following pairs are correctly matched?', items: ['Battle of Saraighat — Lachit Borphukan', 'Guru Tegh Bahadur — founded the Khalsa', 'Gurdwara Sis Ganj Sahib — Delhi'], opts: '(a) Only one   (b) Only two   (c) All three   (d) None', ans: '(b) Only two', ok: [1, 0, 1], why: 'The Khalsa was founded by Guru Gobind Singh, the 10th Guru, in 1699.' },
 { id: 'S11', n: 11, kind: 'single', stem: 'Under the Prohibition of Child Marriage Act, 2006, the minimum age of marriage is:', items: ['(a) 18 for both', '(b) 21 for both', '(c) 18 for girls and 21 for boys', '(d) 16 for girls and 18 for boys'], opts: '', ans: '(c) 18 for girls and 21 for boys', ok: [0, 0, 1, 0], why: 'The 2021 bill to raise the age for girls to 21 lapsed in 2024.' },
 { id: 'S12', n: 12, kind: 'pairs', stem: 'How many of the following pairs are correctly matched?', items: ['Balendra Shah — Prime Minister of Nepal', 'Jamieson Greer — US Trade Representative', 'Musandam — part of Iran', 'Saraighat — Brahmaputra'], opts: '(a) Only one   (b) Only two   (c) Only three   (d) All four', ans: '(c) Only three', ok: [1, 1, 0, 1], why: 'Musandam belongs to Oman.' },
];
MCQS.forEach(m => { SCENES[m.id + '8'] = mcqScene(m, false); SCENES[m.id + '9'] = mcqScene(m, true); });
