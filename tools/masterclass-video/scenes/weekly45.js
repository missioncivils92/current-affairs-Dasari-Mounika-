// W45 weekly (weeks/2026-W45/weekly): "November 1st Week Current Affairs", 16:9, on camera (decision 41).
// Render: node render.js <assets> <timeline> scenes/weekly45.js <out> --strict
// Layouts come from the script's tags: [FACE] rows draw no slide (the camera fills the frame, render.html adds the
// lower-third); [SPLIT] slides are shown at about 60%, so their text is big; [CORNER] slides at 80%.
// Builds land on their words (s.w), numbers appear at their final value, and there are no short forms on screen.
window.NO_PUSH = true; window.EX_LOGO = true;

const W45 = { nat: EP.purple, int: EP.blue, misc: EP.violet, tel: EP.teal, trap: EP.red };
const YEL = '#FFD60A';
// a pop with a little overshoot (as in short_kit.js, which this file does not load)
window.bounce = window.bounce || ((t, a, d = 0.6) => { const x = clamp((t - a) / d); return x <= 0 ? 0 : easeOut(x) + 0.12 * Math.sin(x * Math.PI); });
const at = (s, cw, f) => (cw == null ? s.d * f : typeof cw === 'number' ? cw : s.w(cw, 0, s.d * f) - 0.25);

function wTitle(n, title, scope, sub, palette) {     // topic title card, built for the 60% [SPLIT] panel
  return (ctx, s) => {
    const c = palette || W45[scope]; exSlide(ctx, c, null, null);
    const scopeName = { nat: 'NATIONAL', int: 'INTERNATIONAL', misc: 'IMPORTANT DAY', tel: 'TELUGU STATES' }[scope];
    const k = bounce(s.t, 0.05);
    if (k > 0) { ctx.save(); ctx.translate(300, 470); ctx.scale(k, k);
      ctx.beginPath(); ctx.arc(0, 0, 190, 0, 7); ctx.fillStyle = YEL; ctx.fill();
      kt(ctx, String(n), 0, 70, { font: F.head(200, 900), color: c.ink, align: 'center' }); ctx.restore(); }
    exChip(ctx, scopeName, 560, 250, '#FFFFFF', c.ink, 44, eia(s, 0.2));
    kt(ctx, title, 560, 470, { font: F.head(104, 900), color: '#FFFFFF', maxW: 1280, lh: 118, alpha: eia(s, 0.3) });
    if (sub) kt(ctx, sub, 560, 900, { font: F.ui(56, 800), color: YEL, maxW: 1280, lh: 66, alpha: eia(s, 0.6) });
  };
}

function wHead(ctx, s, c, label, sub) {
  exChip(ctx, label, 72, 50, '#FFFFFF', c.ink, 36, eia(s, 0.05));
  if (sub) kt(ctx, sub, 76, 190, { font: F.ui(38, 700), color: 'rgba(255,255,255,0.88)', alpha: eia(s, 0.2) });
}

// stacked fact cards: items [{t, sub, cue, f, fill, ink}]; each pops in on its cue word (or at a fraction f of the row)
function wFacts(ctx, s, items, y0 = 250, x = 72, w = 1420) {
  let y = y0;
  for (const it of items) {
    ctx.save(); ctx.font = F.ui(it.size || 50, 900); const n = wrap(ctx, it.t, w - 80).length; ctx.restore();
    const h = Math.max(it.h || 0, (it.sub ? 170 : 116) + (n - 1) * 58), k = bounce(s.t, at(s, it.cue, it.f ?? 0.3));
    if (k > 0) {
      ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
      exBox(ctx, x, y, w, h, { fill: it.fill || '#FFFFFF', bar: it.bar || YEL, r: 24 });
      kt(ctx, it.t, x + 44, y + (it.sub ? 68 : 74), { font: F.ui(it.size || 50, 900), color: it.ink || EP.purple.ink, maxW: w - 80, lh: 58 });
      if (it.sub) kt(ctx, it.sub, x + 44, y + 132 + (n - 1) * 58, { font: F.ui(38, 700), color: it.subInk || '#6B21A8', maxW: w - 80, lh: 44 });
      ctx.restore();
    }
    y += h + 26;
  }
}

// the red Prelims trap: the false statement lands, is struck through on its cue, then the truth pops in
function wTrap(myth, truth, cueMyth, cueTruth, note) {
  return (ctx, s) => {
    exSlide(ctx, W45.trap, null, null);
    exChip(ctx, 'PRELIMS TRAP', 72, 50, '#FFFFFF', '#B91C1C', 44, eia(s, 0.05));
    const tm = at(s, cueMyth, 0.12), tt = at(s, cueTruth, 0.45), k = bounce(s.t, tm);
    if (k > 0) { ctx.save(); ctx.translate(960, 330); ctx.scale(k, k); ctx.translate(-960, -330);
      exBox(ctx, 72, 220, 1776, 220, { fill: '#FFFFFF', r: 26 });
      kt(ctx, '✗  ' + myth, 120, 320, { font: F.ui(58, 900), color: '#4A0710', maxW: 1680, lh: 66 });
      const sp = span(s.t, tt - 0.3, tt + 0.1);
      if (sp > 0) { ctx.strokeStyle = '#E63946'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(110, 330); ctx.lineTo(110 + 1690 * sp, 330); ctx.stroke(); }
      ctx.restore(); }
    const k2 = bounce(s.t, tt + 0.15);
    if (k2 > 0) { ctx.save(); ctx.translate(960, 620); ctx.scale(k2, k2); ctx.translate(-960, -620);
      exBox(ctx, 72, 490, 1776, note ? 300 : 260, { fill: '#06D6A0', r: 26 });
      kt(ctx, '✓  ' + truth, 120, 590, { font: F.ui(58, 900), color: '#053B2C', maxW: 1680, lh: 68 });
      ctx.restore(); }
    if (note) kt(ctx, note, 72, 900, { font: F.ui(44, 800), color: '#FFFFFF', maxW: 1776, lh: 54, alpha: eia(s, tt + 1.0) });
  };
}

// ---------- open and board ----------
SCENES.S000 = () => {};   // [FACE]: the camera fills the frame
SCENES.S001 = (ctx, s) => {
  exSlide(ctx, W45.nat, null, null);
  kt(ctx, "TODAY'S 11 STORIES", 72, 120, { font: F.head(84, 900), color: '#FFFFFF', alpha: eia(s, 0.05) });
  const list = [['Agnipath', 'nat'], ['Green crackers', 'nat'], ['Two-child rule', 'nat'], ['Fast-track courts', 'nat'],
    ['Rural jobs law', 'nat'], ['Storing power', 'nat'], ['Pralay missile', 'nat'], ['Malabar', 'nat'],
    ['US midterms', 'int'], ['Bullying day', 'misc'], ['Cancer day', 'misc']];
  const groups = { 0: 'national', 6: 'defence', 8: 'world', 9: 'days' };
  list.forEach(([name, sc], i) => {
    const col = i < 6 ? 0 : i < 9 ? 1 : 2, row = i < 6 ? i : i < 9 ? i - 6 : i - 9;
    const x = 72 + col * 610, y = 200 + row * 135;
    const cueWord = i < 4 ? 'national' : i < 6 ? 'national' : i < 8 ? 'defence' : i < 9 ? 'world' : 'days';
    const k = bounce(s.t, at(s, cueWord, 0.2) + (i % 3) * 0.12);
    if (k <= 0) return;
    ctx.save(); ctx.translate(x + 280, y + 55); ctx.scale(k, k); ctx.translate(-(x + 280), -(y + 55));
    exBox(ctx, x, y, 570, 110, { fill: '#FFFFFF', bar: sc === 'nat' ? YEL : sc === 'int' ? '#4A90C2' : '#A78BFA', r: 22 });
    kt(ctx, `${i + 1}`, x + 50, y + 74, { font: F.head(56, 900), color: '#7C3AED', align: 'center' });
    kt(ctx, name, x + 100, y + 72, { font: F.ui(46, 900), color: EP.purple.ink });
    ctx.restore();
  });
  const k = bounce(s.t, at(s, 'alert', 0.85));
  if (k > 0) { ctx.save(); ctx.globalAlpha *= Math.min(1, k); exBox(ctx, 1292, 605, 570, 110, { fill: '#2BB3A3', r: 22 });
    kt(ctx, '+ Alert for Telugu aspirants', 1322, 675, { font: F.ui(38, 900), color: '#FFFFFF' }); ctx.restore(); }
  void groups;
};

// ---------- 1 · Agnipath ----------
SCENES.S011 = wTitle(1, 'Agnipath scheme changes', 'nat', 'Scrapped? Or modified?');
SCENES.S012 = (ctx, s) => {
  const c = W45.nat; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'WHAT CHANGED', 'Union Cabinet, 4–5 November 2026');
  const cols = [['2022 · THE START', ['4 years of service', 'About 1 in 4 kept'], 'twenty', '#E9DDFF'],
    ['2026 · THE CHANGE', ['About 3 in 4 get 2 more years', 'Pathway to regular enrolment, subject to selection'], 'three in four', YEL]];
  cols.forEach(([h, lines, cw, fill], i) => {
    const x = 72 + i * 900, k = bounce(s.t, at(s, cw, 0.2 + i * 0.4));
    if (k <= 0) return;
    ctx.save(); ctx.translate(x + 410, 600); ctx.scale(k, k); ctx.translate(-(x + 410), -600);
    exBox(ctx, x, 280, 820, 640, { fill, r: 28 });
    kt(ctx, h, x + 50, 370, { font: F.ui(48, 900), color: c.ink });
    let y = 480; for (const l of lines) y += kt(ctx, l, x + 50, y, { font: F.ui(54, 900), color: '#2E1065', maxW: 720, lh: 64 }) + 40;
    ctx.restore();
  });
  const ka = eia(s, at(s, 'three in four', 0.45));
  if (ka > 0) kt(ctx, '→', 945, 640, { font: F.head(110, 900), color: '#FFFFFF', align: 'center', alpha: ka });
};
SCENES.S013 = wTrap('Agnipath has been scrapped', 'Not scrapped: modified. Entry is still the four-year Agniveer route', 'scrapped', 'modified');

// ---------- 2 · Green crackers ----------
SCENES.S021 = wTitle(2, 'Green crackers for Deepavali', 'nat', 'Who designs them? Who licenses the makers?');
SCENES.S022 = (ctx, s) => {
  const c = W45.nat; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'THE SUPREME COURT ORDER', 'Order of 2 November 2026');
  wFacts(ctx, s, [
    { t: 'Delhi and the National Capital Region', sub: 'Only certified green crackers', cue: 'certified' },
    { t: '7 and 8 November · a few hours only', sub: '6–7 in the morning · 8–10 at night', cue: 'hours' },
    { t: 'Designed by the National Environmental Engineering Research Institute, Nagpur', sub: 'No barium nitrate', cue: 'designed', h: 210 },
  ]);
};
SCENES.S023 = (ctx, s) => {
  const c = W45.trap; exSlide(ctx, c, null, null); exChip(ctx, 'PRELIMS TRAP', 72, 50, '#FFFFFF', '#B91C1C', 44, eia(s, 0.05));
  const boxes = [['DESIGNS THE FORMULA', 'National Environmental Engineering Research Institute, Nagpur', 'designs'],
    ['LICENSES THE MAKERS', 'Petroleum and Explosives Safety Organisation · under the Commerce Ministry', 'licenses']];
  boxes.forEach(([h, b, cw], i) => {
    const x = 72 + i * 900, k = bounce(s.t, at(s, cw, 0.2 + i * 0.4)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 410, 560); ctx.scale(k, k); ctx.translate(-(x + 410), -560);
    exBox(ctx, x, 250, 840, 620, { fill: '#FFFFFF', r: 28 });
    kt(ctx, h, x + 50, 350, { font: F.ui(48, 900), color: '#B91C1C' });
    kt(ctx, b, x + 50, 470, { font: F.ui(56, 900), color: '#4A0710', maxW: 740, lh: 68 }); ctx.restore();
  });
};

// ---------- 3 · Two-child rule ----------
SCENES.S031 = wTitle(3, 'The two-child rule', 'nat', 'Struck down? Not yet');
SCENES.S032 = (ctx, s) => {
  const c = W45.nat; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'WHAT THE SUPREME COURT DID');
  wFacts(ctx, s, [
    { t: 'Such laws "have lost relevance"', sub: 'Javed v. State of Haryana (2003) → sent to a larger bench', cue: 'relevance' },
  ], 170, 72, 1776);
  const base = 900, unit = 150, bars = [['2003', 3.0, '≈ 3.0', '#E9DDFF', 'data'], ['2023', 1.9, '1.9', YEL, 'one point nine']];
  bars.forEach(([yr, v, lab, fill, cw], i) => {
    const g = span(s.t, at(s, cw, 0.55), at(s, cw, 0.55) + 0.7); if (g <= 0) return;
    const x = 300 + i * 420, h = v * unit * easeOut(g);
    exBox(ctx, x, base - h, 240, h, { fill, r: 16 });
    if (g >= 1) kt(ctx, lab, x + 120, base - h + 70, { font: F.ui(60, 900), color: c.ink, align: 'center' });
    kt(ctx, yr, x + 120, base + 60, { font: F.ui(44, 900), color: '#FFFFFF', align: 'center', alpha: Math.min(1, g * 2) });
  });
  const tr = at(s, 'replacement', 0.8), gr = span(s.t, tr, tr + 0.6);
  if (gr > 0) { const y = base - 2.1 * unit; ctx.save(); ctx.strokeStyle = '#F9A8D4'; ctx.lineWidth = 6; ctx.setLineDash([18, 12]);
    ctx.beginPath(); ctx.moveTo(240, y); ctx.lineTo(240 + 960 * gr, y); ctx.stroke(); ctx.restore();
    kt(ctx, 'replacement level 2.1', 1230, y + 14, { font: F.ui(40, 900), color: '#F9A8D4', alpha: gr }); }
  kt(ctx, 'Total fertility rate · Source: Sample Registration System, 2023', 1230, 880, { font: F.ui(30, 700), color: '#E9D5FF', maxW: 600, lh: 38, alpha: eia(s, at(s, 'one point nine', 0.6) + 0.8) });
};
SCENES.S033 = (ctx, s) => {
  const c = W45.tel; exSlide(ctx, c, null, null);
  exChip(ctx, 'TELUGU STATES LENS', 72, 50, '#FFFFFF', c.ink, 40, eia(s, 0.05));
  wFacts(ctx, s, [
    { t: 'Andhra Pradesh: rule since 1994 → scrapped in 2024', cue: 'andhra', bar: '#2BB3A3', ink: '#053B36' },
    { t: 'Telangana: urban bodies 2019 · rural bodies 2026', cue: 'telangana', bar: '#2BB3A3', ink: '#053B36' },
  ], 180, 72, 1776);
  const tm = at(s, 'trap', 0.6), k = bounce(s.t, tm);
  if (k > 0) { ctx.save(); ctx.translate(960, 720); ctx.scale(k, k); ctx.translate(-960, -720);
    exBox(ctx, 72, 560, 1776, 330, { fill: '#E63946', r: 26 });
    kt(ctx, 'PRELIMS TRAP', 120, 640, { font: F.ui(40, 900), color: '#FFFFFF' });
    kt(ctx, '✗ Struck down', 120, 740, { font: F.ui(58, 900), color: '#FFD9DC' });
    const sp = span(s.t, at(s, 'referred', 0.85) - 0.3, at(s, 'referred', 0.85)); if (sp > 0) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(110, 722); ctx.lineTo(110 + 400 * sp, 722); ctx.stroke(); }
    kt(ctx, '✓ Only referred to a larger bench', 120, 840, { font: F.ui(58, 900), color: '#FFFFFF', alpha: eia(s, at(s, 'referred', 0.85)) });
    ctx.restore(); }
};

// ---------- 4 · Fast-track special courts ----------
SCENES.S041 = wTitle(4, 'Fast-track special courts till 2031', 'nat', 'Speedy justice for women and children');
SCENES.S042 = (ctx, s) => {
  const c = W45.nat; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'UNION CABINET · 4 NOVEMBER 2026');
  const nums = [['Extended to', '31 March 2031', 'thirty-one'], ['Courts', '779 → 850', 'eight hundred and fifty']];
  nums.forEach(([l, v, cw], i) => {
    const x = 72 + i * 900, k = bounce(s.t, at(s, cw, 0.15 + i * 0.15)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 410, 300); ctx.scale(k, k); ctx.translate(-(x + 410), -300);
    exBox(ctx, x, 170, 840, 260, { fill: YEL, r: 28 });
    kt(ctx, l, x + 50, 250, { font: F.ui(40, 800), color: c.ink }); kt(ctx, v, x + 50, 370, { font: F.head(92, 900), color: c.ink }); ctx.restore();
  });
  wFacts(ctx, s, [
    { t: 'Rape cases and cases under the Protection of Children from Sexual Offences Act', cue: 'rape', h: 170 },
    { t: "Centre's share: from the Nirbhaya Fund · total about ₹3,788 crore", cue: 'nirbhaya' },
    { t: 'Scheme began in 2019', cue: 'nineteen', f: 0.9 },
  ], 470, 72, 1776);
};
SCENES.S900 = () => {};

// ---------- 5 · Rural jobs law ----------
SCENES.S051 = wTitle(5, 'Rural jobs law: the 15-day complaint rule', 'nat', 'Grievance Redressal Rules, 2026');
SCENES.S052 = (ctx, s) => {
  const c = W45.nat; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'HOW A COMPLAINT MOVES', 'Notified by the Rural Development Ministry, 2 November 2026');
  ['Gram Panchayat', 'Block', 'District'].forEach((l, i) => {
    const x = 72 + i * 600, k = bounce(s.t, at(s, ['gram', 'block', 'district'][i], 0.4 + i * 0.05)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 270, 340); ctx.scale(k, k); ctx.translate(-(x + 270), -340);
    exBox(ctx, x, 270, 540, 140, { fill: '#FFFFFF', bar: YEL, r: 24 }); kt(ctx, l, x + 270, 360, { font: F.ui(52, 900), color: c.ink, align: 'center' });
    ctx.restore(); if (i < 2) kt(ctx, '→', x + 570, 362, { font: F.head(70, 900), color: '#FFFFFF', align: 'center', alpha: k });
  });
  const chips = [['Enquiry: within 7 working days', 'seven'], ['Resolved: within 15 days', 'fifteen']];
  chips.forEach(([t, cw], i) => { const k = bounce(s.t, at(s, cw, 0.5 + i * 0.1)); if (k <= 0) return;
    ctx.save(); ctx.translate(72 + i * 900 + 410, 530); ctx.scale(k, k); ctx.translate(-(72 + i * 900 + 410), -530);
    exBox(ctx, 72 + i * 900, 460, 840, 140, { fill: YEL, r: 70 }); kt(ctx, t, 72 + i * 900 + 420, 550, { font: F.ui(50, 900), color: c.ink, align: 'center' }); ctx.restore(); });
  wFacts(ctx, s, [
    { t: 'Replaced the Mahatma Gandhi National Rural Employment Guarantee Act from 1 July 2026', cue: 'replaced', size: 44, h: 150 },
    { t: 'Guarantee: 100 → 125 days of work', cue: 'hundred and twenty-five', f: 0.85 },
  ], 650, 72, 1776);
};
SCENES.S053 = wTrap('The Centre pays all the wages', 'Cost now shared 60 : 40 with the states (90 : 10 for Himalayan and north-eastern states)', 'centre', 'sixty');

// ---------- 6 · Storage ----------
SCENES.S061 = wTitle(6, 'Storing electricity: 92 gigawatt-hours', 'nat', 'What happens to solar power after sunset?');
SCENES.S062 = (ctx, s) => {
  const c = W45.nat; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'UNION CABINET · 4 NOVEMBER 2026');
  const k0 = bounce(s.t, at(s, 'fourteen', 0.1));
  if (k0 > 0) { ctx.save(); ctx.translate(960, 230); ctx.scale(k0, k0); ctx.translate(-960, -230);
    exBox(ctx, 72, 160, 1776, 150, { fill: YEL, r: 28 }); kt(ctx, '₹14,500 crore viability gap funding → 92 gigawatt-hours', 960, 258, { font: F.ui(54, 900), color: c.ink, align: 'center' }); ctx.restore(); }
  const parts = [['Pumped storage', 60, '#06D6A0', 'sixty'], ['Batteries', 30, '#4CC9F0', 'thirty'], ['New', 2, '#F9A8D4', 'two from']];
  let x = 72; const total = 1776;
  parts.forEach(([l, v, fill, cw]) => {
    const w = total * v / 92, g = span(s.t, at(s, cw, 0.4), at(s, cw, 0.4) + 0.5);
    if (g > 0) { exBox(ctx, x, 380, Math.max(8, w * easeOut(g)), 190, { fill, r: 18 });
      if (g >= 1 && v > 5) { kt(ctx, String(v), x + 40, 480, { font: F.head(80, 900), color: '#0B2559' }); kt(ctx, l, x + 40, 540, { font: F.ui(38, 900), color: '#0B2559' }); }
      if (g >= 1 && v <= 5) kt(ctx, '2 · new technologies', x - 380, 630, { font: F.ui(36, 900), color: '#F9A8D4' }); }
    x += w;
  });
  wFacts(ctx, s, [{ t: 'Viability gap funding = the government pays part of the cost, so a useful project becomes viable', cue: 'means', size: 46, h: 170 }], 690, 72, 1776);
};
SCENES.S063 = (ctx, s) => {
  const c = W45.misc; exSlide(ctx, c, null, null); exChip(ctx, 'PUMPED STORAGE = A WATER BATTERY', 72, 50, '#FFFFFF', c.ink, 40, eia(s, 0.05));
  // two reservoirs: water climbs on "uphill", falls on "fall"
  const up = at(s, 'uphill', 0.25), dn = at(s, 'fall', 0.45);
  exBox(ctx, 1150, 210, 600, 160, { fill: '#E0C3FF', r: 20 }); kt(ctx, 'Upper reservoir', 1450, 310, { font: F.ui(44, 900), color: c.ink, align: 'center' });
  exBox(ctx, 170, 600, 600, 160, { fill: '#E0C3FF', r: 20 }); kt(ctx, 'Lower reservoir', 470, 700, { font: F.ui(44, 900), color: c.ink, align: 'center' });
  arrow(ctx, [[700, 590], [1180, 380]], span(s.t, up, up + 0.8), { color: '#4CC9F0', lw: 12 });
  kt(ctx, 'Pump up when power is cheap', 260, 470, { font: F.ui(40, 900), color: '#4CC9F0', alpha: eia(s, up) });
  arrow(ctx, [[1300, 380], [820, 620]], span(s.t, dn, dn + 0.8), { color: YEL, lw: 12 });
  kt(ctx, 'Release through turbines when needed', 1000, 690, { font: F.ui(40, 900), color: YEL, alpha: eia(s, dn) });
  const tt = at(s, 'trap', 0.7), k = bounce(s.t, tt);
  if (k > 0) { ctx.save(); ctx.translate(960, 900); ctx.scale(k, k); ctx.translate(-960, -900);
    exBox(ctx, 72, 820, 1776, 160, { fill: '#E63946', r: 26 });
    kt(ctx, 'PRELIMS TRAP · biggest share: pumped storage (60), not batteries (30)', 960, 918, { font: F.ui(48, 900), color: '#FFFFFF', align: 'center' }); ctx.restore(); }
};

// ---------- 7 · Pralay ----------
SCENES.S071 = wTitle(7, 'Pralay missile test', 'nat', 'Defence Research and Development Organisation · 5 November');
SCENES.S072 = (ctx, s) => {
  const c = W45.nat; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'PRALAY');
  wFacts(ctx, s, [
    { t: '5 November 2026 · Dr APJ Abdul Kalam Island, Odisha', cue: 'island', f: 0.15 },
    { t: 'Quasi-ballistic surface-to-surface missile', sub: 'Can change its path in flight → harder to intercept', cue: 'quasi' },
    { t: 'Made by Bharat Dynamics Limited', cue: 'harder', f: 0.5 },
  ], 170, 72, 1776);
  const tt = at(s, 'trap', 0.7), k = bounce(s.t, tt);
  if (k > 0) { ctx.save(); ctx.translate(960, 870); ctx.scale(k, k); ctx.translate(-960, -870);
    exBox(ctx, 72, 760, 1776, 220, { fill: '#E63946', r: 26 });
    kt(ctx, 'PRELIMS TRAP · look-alikes', 120, 830, { font: F.ui(40, 900), color: '#FFD9DC' });
    kt(ctx, 'Agni, Prithvi = ballistic  ·  BrahMos = cruise (with Russia)', 120, 920, { font: F.ui(52, 900), color: '#FFFFFF' }); ctx.restore(); }
};

// ---------- 8 · Malabar ----------
SCENES.S081 = wTitle(8, 'Malabar 2026', 'int', 'Four navies, one sea');
SCENES.S082 = (ctx, s) => {
  const c = W45.int; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'WHERE AND WHO');
  wFacts(ctx, s, [{ t: 'Off Honshu, Japan · 5–12 November 2026', cue: 'honshu', ink: c.ink, bar: '#4A90C2' }], 170, 72, 1776);
  ['India', 'United States', 'Japan', 'Australia'].forEach((n, i) => {
    const x = 72 + i * 450, k = bounce(s.t, at(s, ['india', 'united', 'japan and', 'australia'][i], 0.4 + i * 0.05)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 210, 450); ctx.scale(k, k); ctx.translate(-(x + 210), -450);
    exBox(ctx, x, 360, 420, 180, { fill: '#FFFFFF', bar: '#4A90C2', r: 24 }); kt(ctx, n, x + 220, 470, { font: F.ui(50, 900), color: c.ink, align: 'center' }); ctx.restore();
  });
  wFacts(ctx, s, [{ t: "India's ship: Indian Naval Ship Sahyadri (a frigate)", cue: 'sahyadri', ink: c.ink, bar: YEL }], 620, 72, 1776);
};
SCENES.S083 = (ctx, s) => {
  const c = W45.trap; exSlide(ctx, c, null, null); exChip(ctx, 'PRELIMS TRAP · HOW MALABAR GREW', 72, 50, '#FFFFFF', '#B91C1C', 40, eia(s, 0.05));
  const steps = [['1992', 'Began: India + United States', 'ninety-two'], ['2015', 'Japan: permanent member', 'fifteen'], ['2020', 'Australia rejoined', 'rejoined']];
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(200, 560); ctx.lineTo(200 + 1520 * span(s.t, 0.3, at(s, 'rejoined', 0.8)), 560); ctx.stroke(); ctx.restore();
  steps.forEach(([y, l, cw], i) => {
    const x = 100 + i * 610, k = bounce(s.t, at(s, cw, 0.3 + i * 0.25)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 280, 560); ctx.scale(k, k); ctx.translate(-(x + 280), -560);
    exBox(ctx, x, 380, 560, 360, { fill: '#FFFFFF', r: 26 });
    kt(ctx, y, x + 280, 520, { font: F.head(110, 900), color: '#B91C1C', align: 'center' });
    kt(ctx, l, x + 280, 620, { font: F.ui(44, 900), color: '#4A0710', align: 'center', maxW: 480, lh: 52 }); ctx.restore();
  });
};
SCENES.S901 = () => {};

// ---------- 9 · US midterms ----------
SCENES.S091 = wTitle(9, "America's midterm elections", 'int', 'House, Senate, and why "midterm"?');
SCENES.S092 = (ctx, s) => {
  const c = W45.int; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'THE UNITED STATES CONGRESS', 'Results, 4–7 November 2026');
  const cols = [['HOUSE OF REPRESENTATIVES', '435', 'members · 2-year term', 'Won by the Democrats (projected)', 'thirty-five'],
    ['SENATE', '100', 'members · 6-year term', 'A third elected every two years · control reported, count pending', 'hundred members']];
  cols.forEach(([h, n, sub, res, cw], i) => {
    const x = 72 + i * 900, k = bounce(s.t, at(s, cw, 0.3 + i * 0.2)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 420, 560); ctx.scale(k, k); ctx.translate(-(x + 420), -560);
    exBox(ctx, x, 260, 840, 560, { fill: '#FFFFFF', bar: '#4A90C2', r: 28 });
    kt(ctx, h, x + 50, 340, { font: F.ui(40, 900), color: c.ink });
    kt(ctx, n, x + 50, 500, { font: F.head(150, 900), color: '#2563EB' });
    kt(ctx, sub, x + 50, 580, { font: F.ui(44, 900), color: c.ink });
    kt(ctx, res, x + 50, 680, { font: F.ui(38, 800), color: '#6B21A8', maxW: 740, lh: 46 }); ctx.restore();
  });
  kt(ctx, 'Midterm = halfway through the President\'s four-year term', 72, 920, { font: F.ui(48, 900), color: YEL, maxW: 1776, alpha: eia(s, at(s, 'halfway', 0.9)) });
};

// ---------- 10 · Bullying day ----------
SCENES.S101 = wTitle(10, 'Day against bullying at school', 'misc', '5 November · first Thursday of November');
SCENES.S102 = (ctx, s) => {
  const c = W45.misc; exSlide(ctx, c, null, null); wHead(ctx, s, c, 'INTERNATIONAL DAY AGAINST VIOLENCE AND BULLYING AT SCHOOL');
  wFacts(ctx, s, [
    { t: 'First Thursday of November · first observed in 2020', cue: 'thursday', f: 0.2 },
    { t: '1 in 3 students bullied in the past month', cue: 'one in three' },
  ], 190, 72, 1776);
  const tt = at(s, 'trap', 0.7), k = bounce(s.t, tt);
  if (k > 0) { ctx.save(); ctx.translate(960, 760); ctx.scale(k, k); ctx.translate(-960, -760);
    exBox(ctx, 72, 600, 1776, 320, { fill: '#E63946', r: 26 });
    kt(ctx, 'PRELIMS TRAP', 120, 680, { font: F.ui(40, 900), color: '#FFD9DC' });
    kt(ctx, 'National Commission for Protection of Child Rights = statutory body (2005 Act), not constitutional', 120, 770, { font: F.ui(52, 900), color: '#FFFFFF', maxW: 1680, lh: 64 }); ctx.restore(); }
};

// ---------- 11 · Cancer day ----------
SCENES.S111 = wTitle(11, 'National Cancer Awareness Day', 'misc', '7 November');
SCENES.S112 = (ctx, s) => {
  const c = W45.misc; exSlide(ctx, c, null, null); wHead(ctx, s, c, '7 NOVEMBER = MARIE CURIE\'S BIRTHDAY (1867)');
  kt(ctx, 'Two Nobel Prizes · two different sciences', 72, 280, { font: F.head(70, 900), color: '#FFFFFF', alpha: eia(s, at(s, 'two nobel', 0.3)) });
  [['PHYSICS', '1903', 'physics'], ['CHEMISTRY', '1911', 'chemistry']].forEach(([h, y, cw], i) => {
    const x = 72 + i * 900, k = bounce(s.t, at(s, cw, 0.5 + i * 0.2)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 420, 600); ctx.scale(k, k); ctx.translate(-(x + 420), -600);
    exBox(ctx, x, 380, 840, 440, { fill: i ? YEL : '#FFFFFF', r: 28 });
    kt(ctx, h, x + 420, 500, { font: F.ui(60, 900), color: c.ink, align: 'center' });
    kt(ctx, y, x + 420, 700, { font: F.head(170, 900), color: '#7C3AED', align: 'center' }); ctx.restore();
  });
};

// ---------- alert, quiz, close ----------
SCENES.S995 = (ctx, s) => {
  const c = W45.tel; exSlide(ctx, c, null, null); exChip(ctx, 'ASPIRANT ALERT · ANDHRA PRADESH', 72, 50, '#FFFFFF', c.ink, 40, eia(s, 0.05));
  wFacts(ctx, s, [
    { t: 'District Selection Committee teacher recruitment 2026', cue: 'district', bar: '#2BB3A3', ink: c.ink },
    { t: 'About 2,721 posts', cue: 'thousand', bar: '#2BB3A3', ink: c.ink },
    { t: 'Applications from 11 November (reported)', cue: 'applications', bar: '#2BB3A3', ink: c.ink },
    { t: 'Check the official website for exact details', cue: 'check', fill: YEL, ink: c.ink },
  ], 190);
};
const QS = ['Agnipath has been scrapped.', 'Pumped storage is the biggest share of the new storage plan.', 'Malabar began as an India–United States exercise.'];
function quizCard(ctx, s, answer) {
  const c = W45.nat; exSlide(ctx, c, null, null); exChip(ctx, answer ? 'ANSWER' : 'QUICK-FIRE QUESTION', 72, 50, YEL, c.ink, 40, eia(s, 0.05));
  kt(ctx, 'How many of these statements are correct?', 72, 220, { font: F.head(62, 900), color: '#FFFFFF' });
  QS.forEach((q, i) => {
    const ok = i > 0, y = 290 + i * 170;
    exBox(ctx, 72, y, 1776, 140, { fill: answer ? (ok ? '#D1FAE5' : '#FFE4E6') : '#FFFFFF', bar: answer ? (ok ? '#06D6A0' : '#E63946') : YEL, alpha: eia(s, 0.2 + i * 0.25) });
    kt(ctx, `${i + 1}. ${q}`, 120, y + 88, { font: F.ui(46, 800), color: c.ink, maxW: 1560, alpha: eia(s, 0.2 + i * 0.25) });
    if (answer) kt(ctx, ok ? '✓' : '✗', 1790, y + 92, { font: F.ui(64, 900), color: ok ? '#059669' : '#E63946', align: 'center' });
  });
  const opts = answer ? 'Answer: (b) Only two · statements 2 and 3 · Agnipath was modified, not scrapped' : '(a) Only one   (b) Only two   (c) All three   (d) None';
  kt(ctx, opts, 72, 880, { font: F.ui(48, 900), color: YEL, maxW: 1776, lh: 58, alpha: eia(s, answer ? 0.3 : 1.0) });
  if (!answer) {   // a 7-second countdown ring after "answer"
    const t0 = s.hold ? s.hold.at : at(s, 'answer', 0.4) + 0.4, p = span(s.t, t0, t0 + 7);
    if (p > 0 && p < 1) { ctx.save(); ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(1760, 940, 70, 0, 7); ctx.stroke();
      ctx.strokeStyle = YEL; ctx.beginPath(); ctx.arc(1760, 940, 70, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (1 - p)); ctx.stroke(); ctx.restore();
      kt(ctx, String(Math.ceil(7 * (1 - p))), 1760, 965, { font: F.head(70, 900), color: '#FFFFFF', align: 'center' }); }
  }
}
SCENES.S990 = (ctx, s) => quizCard(ctx, s, false);
SCENES.S991 = (ctx, s) => quizCard(ctx, s, true);
SCENES.S999 = () => {};
