// Sample v2: one topic in the exam format (why in news → formation → naming → static facts → trap → practice → notes).
// One colour per slide, purple first (owner: "in each slide use one colour, but purple is more good"); flat vector
// maps and diagrams, no satellite imagery. White cards carry the text so every slide stays readable.
window.NO_PUSH = true;
const P = {   // slide palettes: background gradient, main, deep ink, light tints (light → mid)
  purple: { bg: ['#3B0F86', '#7C3AED'], main: '#7C3AED', ink: '#2E1065', t: ['#F5F0FF', '#E9DDFF', '#D6C2FF', '#BB9BFF', '#9D6BFF'] },
  orange: { bg: ['#B93A06', '#F97316'], main: '#F97316', ink: '#5A1C02', t: ['#FFF4EB', '#FFE2CC', '#FFC79E', '#FFA766', '#FF8A33'] },
  blue:   { bg: ['#123C9C', '#3B82F6'], main: '#2563EB', ink: '#0B2559', t: ['#EEF5FF', '#D7E7FF', '#B5D2FF', '#86B4FF', '#5592FF'] },
  red:    { bg: ['#8E1520', '#E63946'], main: '#E63946', ink: '#4A0710', t: ['#FFF1F2', '#FFD9DC', '#FFB3B9', '#FF8A93', '#FF5E6A'] },
  yellow: { bg: ['#F5A300', '#FFD60A'], main: '#F59E0B', ink: '#3A2600', t: ['#FFFBEA', '#FFF3C4', '#FFE58A', '#FFD54F', '#FFC107'] },
};
const STEPS = ['NEWS', 'FORMATION', 'NAMING', 'FACTS', 'TRAP', 'PRACTICE', 'NOTES'];
const ia = (s, at, d = 0.45) => clamp(pop(s.t, at, d));

function slide(ctx, c, step) {         // the coloured slide, a soft pattern, the top strip and step tracker
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, c.bg[0]); g.addColorStop(1, c.bg[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.08; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2;
  for (let r = 160; r < 1400; r += 120) { ctx.beginPath(); ctx.arc(W + 100, -80, r, 0, 7); ctx.stroke(); } ctx.restore();
  if (step == null) return;
  chip(ctx, 'TOPIC 01', 72, 40, '#FFFFFF', c.ink, 24);
  text(ctx, 'Cyclone Arnab', 236, 79, { font: F.head(46), color: '#FFFFFF' });
  let x = 1630; for (let i = STEPS.length - 1; i >= 0; i--) {
    ctx.save(); ctx.font = F.ui(24, 800); const w = ctx.measureText(STEPS[i]).width + 26; ctx.restore(); x -= w + 8;
    const on = i === step; ctx.save(); rr(ctx, x, 46, w, 38, 19); ctx.fillStyle = on ? '#FFFFFF' : 'rgba(255,255,255,0.16)'; ctx.fill(); ctx.restore();
    text(ctx, STEPS[i], x + 13, 74, { font: F.ui(24, 800), color: on ? c.ink : 'rgba(255,255,255,0.85)' });
  }
}
function box(ctx, x, y, w, h, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1; ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  rr(ctx, x, y, w, h, o.r ?? 22); ctx.fillStyle = o.fill || '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
  if (o.stroke) { ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.stroke; ctx.stroke(); }
  if (o.bar) { ctx.save(); rr(ctx, x, y, w, h, o.r ?? 22); ctx.clip(); ctx.fillStyle = o.bar; ctx.fillRect(x, y, 12, h); ctx.restore(); }
  ctx.restore();
}
function chip(ctx, s, x, y, bg, fg = '#FFFFFF', size = 26, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.font = F.ui(size, 800); const w = ctx.measureText(s).width + size * 1.3, h = size * 1.75;
  rr(ctx, x, y, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ctx.fillStyle = fg; ctx.textBaseline = 'middle'; ctx.fillText(s, x + size * 0.65, y + h / 2 + 1); ctx.restore(); return w;
}
// flat map in the slide's colour family: sea blue, India in light tints, the focus state in the slide colour
function flat(g, proj, c, o = {}) {
  const sg = g.createLinearGradient(0, 0, 0, H); sg.addColorStop(0, '#A8DCF7'); sg.addColorStop(1, '#66B8EC'); g.fillStyle = sg; g.fillRect(0, 0, W, H);
  for (const k of A.geo.countries_wide) if (k.a3 !== 'IND') geo(g, proj, k.geom, { fill: '#F1EEE8', stroke: '#FFFFFF', lw: 1.5 });
  geo(g, proj, A.geo.india, { fill: c.t[1] });
  (A.geo.india_state_polys || []).forEach((st, i) => geo(g, proj, st.geom, { fill: (o.focus || {})[st.name] || c.t[1 + (i % 3)] }));
  for (const st of A.geo.india_states) geo(g, proj, st.geom, { stroke: '#FFFFFF', lw: 2.4 });
  geo(g, proj, A.geo.india, { stroke: c.ink, lw: 2.6 });
  if (o.rivers) rivers(g, proj, o.rivers, { color: '#1E88E5', lw: 4 });
}
function tag(g, proj, ll, s, off, a, c, o = {}) {
  if (a <= 0) return; const [px, py] = proj(ll), lx = px + off[0], ly = py + off[1];
  g.save(); g.globalAlpha *= a; g.strokeStyle = c.ink; g.lineWidth = 2.5; g.beginPath(); g.moveTo(px, py); g.lineTo(lx, ly); g.stroke();
  g.beginPath(); g.arc(px, py, 10, 0, 7); g.fillStyle = o.dot || c.ink; g.fill(); g.lineWidth = 3; g.strokeStyle = '#FFFFFF'; g.stroke();
  g.font = F.ui(26, 800); const w = g.measureText(s).width + 28; rr(g, lx - w / 2, ly - 22, w, 44, 12); g.fillStyle = o.bg || '#FFFFFF'; g.fill();
  g.strokeStyle = c.ink; g.lineWidth = 2.5; g.stroke(); g.fillStyle = o.fg || c.ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, lx, ly + 1); g.restore();
}
function mapPanel(ctx, b, bounds, c, draw, o = {}) {
  box(ctx, ...b, { r: 24 }); ctx.save(); rr(ctx, ...b, 24); ctx.clip();
  const proj = windowCamera(b, ...bounds); flat(ctx, proj, c, o); draw(ctx, proj); ctx.restore();
  ctx.save(); rr(ctx, ...b, 24); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
  text(ctx, 'Boundaries: Survey of India outline (DataMeet) · Natural Earth', b[0] + b[2] - 16, b[1] + b[3] - 16, { font: F.ui(24, 600), color: c.ink, align: 'right', alpha: 0.8 });
}
function head(ctx, s, c, label) { chip(ctx, label, 72, 140, '#FFFFFF', c.ink, 28); }

// E.1 topic (purple)
SCENES.S01 = (ctx, s) => {
  const c = P.purple; slide(ctx, c);
  chip(ctx, 'PRELIMS GRID · NATIONAL · TOPIC 01 OF 16', 120, 150, '#FFFFFF', c.ink, 28, ia(s, 0.1));
  text(ctx, 'Cyclone Arnab', 116, 330, { font: F.head(132), color: '#FFFFFF', alpha: ia(s, 0.3) });
  let x = 120; [['GS-1 · Geography'], ['GS-3 · Disaster Management'], ['APPSC Group-1']].forEach(([t], i) => { x += chip(ctx, t, x, 400, c.t[1], c.ink, 28, ia(s, s.w('geography') - 0.3 + i * 0.25)) + 14; });
  text(ctx, 'In this topic', 120, 560, { font: F.ui(28, 800), color: c.t[2], alpha: ia(s, 1.2) });
  STEPS.forEach((t, i) => chip(ctx, `${i + 1}  ${t}`, 120 + (i % 3) * 330, 590 + Math.floor(i / 3) * 76, 'rgba(255,255,255,0.18)', '#FFFFFF', 26, ia(s, 1.4 + i * 0.12)));
  mapPanel(ctx, [1260, 160, 588, 780], [67, 6, 98, 37], c, (g, proj) => tag(g, proj, [82.0, 16.6], 'Arnab', [-120, -60], ia(s, 1.0), c, { bg: c.main, fg: '#FFFFFF' }), { focus: { 'Andhra Pradesh': c.main } });
};
// E.2 why in news (orange)
SCENES.S02 = (ctx, s) => {
  const c = P.orange; slide(ctx, c, 0);
  box(ctx, 72, 150, 800, 860);
  chip(ctx, 'WHY IN NEWS', 112, 186, c.main, '#FFFFFF', 30);
  text(ctx, 'Cyclone Arnab crossed the Andhra Pradesh–Yanam coast in the Godavari delta', 112, 340, { font: F.head(52), color: c.ink, maxW: 720, lh: 66, alpha: ia(s, 0.4) });
  [['DATE', '28 October 2026', 'twenty-eighth'], ['STRENGTH', 'Very Severe Cyclonic Storm', 'very'], ['WHERE', 'Between Narsapur and Yanam (IMD, as reported)', 'godavari']].forEach(([l, v, cw], i) => {
    const a = ia(s, s.w(cw) - 0.2), y = 600 + i * 130; box(ctx, 112, y, 720, 110, { fill: c.t[1 + i % 2], alpha: a, r: 16 });
    chip(ctx, l, 132, y + 14, c.main, '#FFFFFF', 22, a); text(ctx, v, 134, y + 90, { font: F.ui(32, 800), color: c.ink, alpha: a, maxW: 680 });
  });
  mapPanel(ctx, [912, 150, 936, 860], [80.4, 15.4, 84.6, 18.3], c, (g, proj) => {
    arrow(g, [proj([84.7, 14.6]), proj([83.2, 15.7]), proj([81.89, 16.5])], span(s.t, 1.0, 4.5), { color: c.ink, lw: 8, dash: [20, 12] });
    tag(g, proj, [81.89, 16.5], 'Crossed here (approx.)', [140, 110], ia(s, 4.4), c, { bg: c.main, fg: '#FFFFFF' });
    tag(g, proj, [82.214, 16.733], 'YANAM', [-150, -70], ia(s, s.w('yanam') - 0.2), c, { bg: '#FFD60A' });
    tag(g, proj, [82.247, 16.989], 'Kakinada', [130, -60], ia(s, 2.0), c);
    tag(g, proj, [81.70, 16.43], 'Narsapur', [-150, 60], ia(s, 2.2), c);
    const [bx, by] = proj([83.6, 16.4]); text(g, 'BAY OF BENGAL', bx, by, { font: F.ui(32, 800), color: '#FFFFFF', align: 'center', shadow: 6 });
    const [ax, ay] = proj([81.2, 17.35]); text(g, 'ANDHRA PRADESH', ax, ay, { font: F.ui(30, 800), color: c.ink, align: 'center' });
  }, { focus: { 'Andhra Pradesh': c.t[4] }, rivers: ['Godavari', 'Krishna'] });
};
// E.3 how a cyclone forms (purple): a cross-section that builds step by step, and the four conditions
SCENES.S03 = (ctx, s) => {
  const c = P.purple; slide(ctx, c, 1); head(ctx, s, c, 'HOW A CYCLONE FORMS');
  const D = [72, 220, 1080, 790]; box(ctx, ...D);
  const [x, y, w, h] = D, sea = y + h - 170, cx = x + w / 2;
  // sea
  const sa = ia(s, s.w('warm') - 0.3), sg = ctx.createLinearGradient(0, sea, 0, y + h); sg.addColorStop(0, '#5BB8F0'); sg.addColorStop(1, '#1E6FD9');
  ctx.save(); rr(ctx, x, sea, w, y + h - sea, 22); ctx.clip(); ctx.globalAlpha *= sa; ctx.fillStyle = sg; ctx.fillRect(x, sea, w, y + h - sea);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let i = 0; i <= 60; i++) { const px = x + i * w / 60; ctx.lineTo(px, sea + 22 + k * 34 + 7 * Math.sin(i * 0.6 + s.t * 2 + k)); } ctx.stroke(); } ctx.restore();
  chip(ctx, 'Warm sea ≥ 26.5–27 °C', x + 30, y + h - 74, '#FFFFFF', c.ink, 26, sa);
  // rising air, condensation, the centre
  const ra = span(s.t, s.w('rises') - 0.4, s.w('rises') + 1.6);
  [-260, -130, 130, 260].forEach((dx, i) => arrow(ctx, [[cx + dx, sea - 10], [cx + dx * 0.75, sea - 180], [cx + dx * 0.5, y + 250]], ra, { color: c.main, lw: 7 }));
  const ca = ia(s, s.w('condenses') - 0.2);
  ctx.save(); ctx.globalAlpha *= ca; ctx.fillStyle = c.t[2];
  [[-300, 200, 120], [-170, 150, 140], [170, 150, 140], [300, 200, 120], [-60, 170, 100], [60, 170, 100]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.ellipse(cx + dx, y + dy, r, r * 0.62, 0, 0, 7); ctx.fill(); });
  ctx.restore();
  chip(ctx, 'Condensation releases latent heat', cx - 230, y + 40, c.main, '#FFFFFF', 26, ca);
  const la = ia(s, s.w('pressure') - 0.2);
  ctx.save(); ctx.globalAlpha *= la; ctx.beginPath(); ctx.arc(cx, sea - 90, 64, 0, 7); ctx.fillStyle = c.ink; ctx.fill(); ctx.restore();
  text(ctx, 'L', cx, sea - 66, { font: F.head(72), color: '#FFFFFF', align: 'center', alpha: la });
  chip(ctx, 'Low pressure at the centre (the eye)', cx + 80, sea - 130, '#FFFFFF', c.ink, 24, la);
  const sp = span(s.t, s.w('spirals') - 0.3, s.w('spirals') + 1.2);
  arrow(ctx, [[x + 40, sea - 40], [cx - 200, sea - 70], [cx - 80, sea - 90]], sp, { color: c.ink, lw: 6 });
  arrow(ctx, [[x + w - 40, sea - 40], [cx + 200, sea - 70], [cx + 80, sea - 90]], sp, { color: c.ink, lw: 6 });
  // conditions checklist
  const R = [1192, 220, 656, 790]; box(ctx, ...R, { bar: c.main });
  text(ctx, 'Four conditions', R[0] + 40, R[1] + 70, { font: F.head(40), color: c.ink });
  [['Warm sea surface', '≥ 26.5–27 °C, over a wide area', 'warm'], ['Coriolis force', 'none at the Equator, so no cyclones within ~5°', 'coriolis'],
   ['Weak vertical wind shear', 'the storm column stays upright', 'shear'], ['A low to start from', 'a pre-existing low-pressure area', 'low-pressure']].forEach(([h2, v, cw], i) => {
    const a = ia(s, s.w(cw) - 0.2), yy = R[1] + 130 + i * 150;
    box(ctx, R[0] + 36, yy, R[2] - 72, 130, { fill: c.t[i % 2], r: 16, alpha: a });
    chip(ctx, '✓', R[0] + 52, yy + 18, c.main, '#FFFFFF', 26, a);
    text(ctx, h2, R[0] + 120, yy + 52, { font: F.ui(30, 800), color: c.ink, alpha: a });
    text(ctx, v, R[0] + 120, yy + 98, { font: F.ui(26, 600), color: c.ink, alpha: a, maxW: R[2] - 170 });
  });
  chip(ctx, 'Northern hemisphere: anticlockwise', R[0] + 36, R[1] + R[3] - 70, c.ink, '#FFFFFF', 26, ia(s, s.w('anticlockwise') - 0.2));
};
// E.4 the naming process (blue): a four-step flow and the thirteen countries
const C13 = ['Bangladesh', 'India', 'Iran', 'Maldives', 'Myanmar', 'Oman', 'Pakistan', 'Qatar', 'Saudi Arabia', 'Sri Lanka', 'Thailand', 'UAE', 'Yemen'];
SCENES.S04 = (ctx, s) => {
  const c = P.blue; slide(ctx, c, 2); head(ctx, s, c, 'HOW CYCLONES ARE NAMED');
  const F4 = [['13 countries', 'WMO/ESCAP Panel on Tropical Cyclones', 'thirteen'], ['169 names', '13 each · list adopted April 2020', 'hundred'],
    ['RSMC New Delhi (IMD)', 'gives the next name at ≥ 62 km/h (Cyclonic Storm)', 'next'], ['Used once', 'a name is never repeated', 'never']];
  F4.forEach(([h2, v, cw], i) => {
    const a = ia(s, s.w(cw) - 0.2), x = 72 + i * 450, y = 230;
    box(ctx, x, y, 410, 320, { alpha: a, bar: c.t[4 - i % 2] });
    ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(x + 70, y + 70, 40, 0, 7); ctx.fillStyle = c.main; ctx.fill(); ctx.restore();
    text(ctx, String(i + 1), x + 70, y + 88, { font: F.head(48), color: '#FFFFFF', align: 'center', alpha: a });
    const th = text(ctx, h2, x + 36, y + 170, { font: F.ui(34, 800), color: c.ink, alpha: a, maxW: 350, lh: 40 });
    text(ctx, v, x + 36, y + 180 + th, { font: F.ui(26, 600), color: c.ink, alpha: a, maxW: 350, lh: 34 });
    if (i < 3) chip(ctx, '→', x + 404, y + 120, '#FFFFFF', c.ink, 30, ia(s, s.w(F4[i + 1][2]) - 0.3));
  });
  box(ctx, 72, 580, 1776, 420);
  text(ctx, 'The 13 member countries (each gave 13 names)', 112, 650, { font: F.ui(32, 800), color: c.ink });
  C13.forEach((n, i) => {
    const a = ia(s, s.w('thirteen') + 0.1 + i * 0.06), hl = n === 'Bangladesh' && s.t > s.w('bangladesh') - 0.3;
    chip(ctx, n, 112 + (i % 5) * 340, 690 + Math.floor(i / 5) * 90, hl ? c.main : c.t[1], hl ? '#FFFFFF' : c.ink, 28, a);
  });
  chip(ctx, 'ARNAB ← Bangladesh\'s name', 1290, 880, '#FFD60A', c.ink, 30, ia(s, s.w('bangladesh') - 0.2));
};
// E.5 the IMD ladder (purple, in shades of one colour)
const LADDER = [['Depression', '31–49'], ['Deep Depression', '50–61'], ['Cyclonic Storm', '62–88'], ['Severe CS', '89–117'], ['Very Severe CS', '118–166'], ['Extremely Severe CS', '167–221'], ['Super Cyclonic Storm', '≥ 222']];
SCENES.S05 = (ctx, s) => {
  const c = P.purple; slide(ctx, c, 3); head(ctx, s, c, 'STATIC FACTS · the IMD ladder (km/h)');
  box(ctx, 72, 220, 1776, 790);
  const shades = ['#EDE4FF', '#DCCBFF', '#C4A8FF', '#A97FFF', '#8B55F5', '#6D28D9', '#4C1D95'];
  LADDER.forEach(([n, r], i) => {
    const y = 940 - i * 100, a = ia(s, s.w('grades') - 0.2 + i * 0.12), w = 360 + i * 150, hl = i === 4, dark = i >= 4;
    ctx.save(); ctx.globalAlpha *= a; rr(ctx, 120, y - 72, w, 86, 14); ctx.fillStyle = shades[i]; ctx.fill(); if (hl) { ctx.lineWidth = 6; ctx.strokeStyle = '#FFD60A'; ctx.stroke(); } ctx.restore();
    text(ctx, n, 146, y - 22, { font: F.ui(32, 800), color: dark ? '#FFFFFF' : c.ink, alpha: a });
    text(ctx, r, 120 + w - 26, y - 22, { font: F.ui(32, 800), color: dark ? '#FFFFFF' : c.ink, alpha: a, align: 'right' });
    if (hl) chip(ctx, '← ARNAB', 140 + w, y - 62, '#FFD60A', c.ink, 28, ia(s, s.w('like') - 0.2));
  });
  const ny = 940 - 2 * 100 + 26, na = ia(s, s.w('starts') - 0.2);
  ctx.save(); ctx.globalAlpha *= na; ctx.setLineDash([14, 10]); ctx.strokeStyle = c.main; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(110, ny); ctx.lineTo(1810, ny); ctx.stroke(); ctx.restore();
  chip(ctx, 'A NAME IS GIVEN FROM HERE UP', 1340, ny + 10, c.main, '#FFFFFF', 26, na);
};
// E.6 the trap (red: the trap colour)
SCENES.S06 = (ctx, s) => {
  const c = P.red; slide(ctx, c, 4); head(ctx, s, c, 'PRELIMS TRAP');
  box(ctx, 72, 220, 860, 260);
  chip(ctx, 'UPSC MAY WRITE', 112, 250, c.main, '#FFFFFF', 26);
  text(ctx, 'Yanam is part of Andhra Pradesh', 112, 390, { font: F.head(46), color: c.ink });
  const st = span(s.t, s.w('belongs') - 0.2, s.w('belongs') + 0.4); if (st > 0) { ctx.save(); ctx.strokeStyle = c.main; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(108, 374); ctx.lineTo(108 + 720 * easeOut(st), 374); ctx.stroke(); ctx.restore(); }
  const ta = ia(s, s.w('belongs')); box(ctx, 72, 520, 860, 490, { fill: '#E3F9EF', alpha: ta });
  chip(ctx, '✓ CORRECT', 112, 550, '#06D6A0', '#0B3D2E', 26, ta);
  text(ctx, 'Yanam belongs to the Union Territory of Puducherry', 112, 680, { font: F.head(46), color: '#0B6E4F', maxW: 780, lh: 58, alpha: ta });
  text(ctx, 'Puducherry UT = Puducherry · Karaikal · Mahe · Yanam', 112, 870, { font: F.ui(32, 800), color: '#14213D', maxW: 780, lh: 42, alpha: ia(s, s.w('karaikal') - 0.3) });
  text(ctx, 'Four enclaves, inside Tamil Nadu, Kerala and Andhra Pradesh', 112, 970, { font: F.ui(28, 700), color: '#46506A', maxW: 780, alpha: ia(s, s.w('mahe')) });
  mapPanel(ctx, [972, 220, 876, 790], [73.5, 8.2, 85.5, 18.6], c, (g, proj) => {
    [['Puducherry', [79.83, 11.93], [130, -40], 'puducherry'], ['Karaikal', [79.84, 10.92], [130, 40], 'karaikal'], ['Mahe', [75.53, 11.70], [-90, -60], 'mahe'], ['Yanam', [82.214, 16.733], [-60, -80], 'yanam']].forEach(([n, ll, off, cw]) =>
      tag(g, proj, ll, n, off, ia(s, s.w(cw) - 0.2), c, { bg: '#FFD60A' }));
  }, { focus: { 'Puducherry': c.main } });
};
// E.7 / E.8 practice MCQ and answer (purple)
const QS = ['A tropical cyclone in the north Indian Ocean is named only after it reaches cyclonic-storm strength.', 'Yanam is a part of the State of Andhra Pradesh.', 'A Very Severe Cyclonic Storm has sustained winds of 118–166 km/h.'];
function mcq(ctx, s, o = {}) {
  const c = P.purple; slide(ctx, c, 5);
  box(ctx, 72, 140, 1776, 880);
  chip(ctx, 'PRACTICE · UPSC FORMAT', 112, 170, c.main, '#FFFFFF', 26);
  text(ctx, 'Consider the following statements:', 112, 290, { font: F.head(44), color: c.ink });
  QS.forEach((q, i) => {
    const y = 380 + i * 120, a = o.typed == null ? 1 : clamp(o.typed * 5 - i);
    text(ctx, `${i + 1}.  ${q}`, 140, y, { font: F.ui(34, 700), color: c.ink, maxW: 1500, alpha: a });
    if (o.marks) { const ok = i !== 1; chip(ctx, ok ? '✓' : '✗', 1700, y - 44, ok ? '#06D6A0' : '#E63946', ok ? '#0B3D2E' : '#FFFFFF', 34, ia(s, 0.6 + i * 0.4)); }
  });
  text(ctx, 'How many of the above statements are correct?', 112, 780, { font: F.head(40), color: c.ink, alpha: o.typed == null ? 1 : clamp(o.typed * 5 - 3) });
  ['(a) Only one', '(b) Only two', '(c) All three', '(d) None'].forEach((op, i) => {
    const x = 140 + i * 420, sel = o.answer && i === 1, a = o.typed == null ? 1 : clamp(o.typed * 5 - 4);
    box(ctx, x, 830, 380, 90, { fill: sel ? '#06D6A0' : c.t[1], alpha: a, r: 16 });
    text(ctx, op, x + 30, 888, { font: F.ui(34, 800), color: c.ink, alpha: a });
  });
}
SCENES.S07 = (ctx, s) => {
  mcq(ctx, s, { typed: span(s.t, 0.2, Math.min(s.d - 1, s.w('correct'))) });
  const h = s.hold; if (!h) return; const c = P.purple;
  const ra = appear(s.t, h.at - 0.2, 0.4), cd = clamp((s.t - h.at) / h.dur), left = Math.ceil(h.dur - cd * h.dur);
  ctx.save(); ctx.globalAlpha = ra; ctx.beginPath(); ctx.arc(1720, 240, 70, 0, 7); ctx.fillStyle = c.t[0]; ctx.fill();
  ctx.lineWidth = 12; ctx.strokeStyle = c.t[1]; ctx.beginPath(); ctx.arc(1720, 240, 56, 0, 7); ctx.stroke();
  ctx.strokeStyle = c.main; ctx.beginPath(); ctx.arc(1720, 240, 56, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.stroke(); ctx.restore();
  text(ctx, String(clamp(left, 0, h.dur)), 1720, 262, { font: F.head(60), align: 'center', color: c.main, alpha: ra });
};
SCENES.S08 = (ctx, s) => {
  mcq(ctx, s, { marks: true, answer: s.t > s.w('only two') - 0.2 });
  text(ctx, 'Answer (b): 1 and 3 are correct · Yanam belongs to Puducherry UT', 112, 985, { font: F.hand(46), color: '#0B6E4F', alpha: ia(s, s.w('because') - 0.2) });
};
// E.9 notes (yellow): the five lines to copy
SCENES.S09 = (ctx, s) => {
  const c = P.yellow; slide(ctx, c, 6);
  ctx.save(); ctx.translate(960, 580); ctx.rotate(-0.008); ctx.translate(-960, -580);
  box(ctx, 140, 140, 1640, 880, { fill: '#FFFDF6' });
  ctx.strokeStyle = 'rgba(58,134,255,0.18)'; ctx.lineWidth = 2; for (let y = 310; y < 1000; y += 76) { ctx.beginPath(); ctx.moveTo(180, y); ctx.lineTo(1740, y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(230,57,70,0.35)'; ctx.beginPath(); ctx.moveTo(290, 150); ctx.lineTo(290, 1010); ctx.stroke();
  chip(ctx, 'WRITE THIS DOWN', 180, 170, c.main, c.ink, 28);
  const L = [['Arnab: VSCS · crossed the AP–Yanam coast (Godavari delta) · 28 Oct 2026', '#FFE58A'],
    ['Forms over warm sea (≥ 26.5–27 °C) · needs Coriolis force (none at the Equator) · weak wind shear · a low', '#D6C2FF'],
    ['Names: 13 countries × 13 = 169 (2020) · RSMC New Delhi names at ≥ 62 km/h · never repeated', '#B5D2FF'],
    ['IMD km/h: CS 62–88 · SCS 89–117 · VSCS 118–166 · ESCS 167–221 · SuCS ≥ 222', '#FFC79E'],
    ['Puducherry UT = Puducherry · Karaikal · Mahe · Yanam', '#FFB3B9']];
  let y = 290; L.forEach(([t, hc], i) => {
    const a = ia(s, 0.4 + i * 0.45);
    ctx.save(); ctx.globalAlpha *= a * 0.8; ctx.fillStyle = hc; ctx.font = F.ui(32, 800); const lines = wrap(ctx, t, 1400); lines.forEach((l, j) => ctx.fillRect(316, y - 30 + j * 64, ctx.measureText(l).width + 16, 44)); ctx.restore();
    const n = text(ctx, t, 324, y + 2, { font: F.ui(32, 800), color: '#14213D', maxW: 1400, lh: 64, alpha: a }) / 64; y += n * 64 + 48;
  });
  text(ctx, 'This card is page 1 of this week\'s PDF', 1720, 995, { font: F.hand(40), color: '#5A4A00', align: 'right', alpha: ia(s, 2.8) });
  ctx.restore();
};
