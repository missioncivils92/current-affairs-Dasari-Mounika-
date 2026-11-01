// W45 Short (vertical 1080×1920): India's earthquake map, old vs new, and who decides. Render with --size 1080x1920.
// Layout (decision 41): [FACE] rows leave the top 1080×1500 for the camera, with a keyword band below it; [TOP] rows
// leave the top 1080×760 for the camera and teach below it. compose_face.py --vertical lays the camera in; until
// then the camera space shows a labelled placeholder.
window.NO_PUSH = true; window.EX_LOGO = true;

const PUR = EP.purple, CAM_TOP = 760, CAM_FACE = 1500;
// a pop with a little overshoot: 0 before `a`, rising to about 1.1, settling at 1
const bounce = (t, a, d = 0.6) => { const x = clamp((t - a) / d); return x <= 0 ? 0 : easeOut(x) + 0.12 * Math.sin(x * Math.PI); };
const slideX = (t, a, from) => (1 - easeOut(span(t, a, a + 0.5))) * from;
function vBase(ctx, shake = 0) {
  if (shake) ctx.translate(Math.sin(GT * 90) * shake, Math.cos(GT * 70) * shake);
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1B0B45'); g.addColorStop(1, '#4C1D95'); ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
  ctx.save(); ctx.globalAlpha = 0.08; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc((i * 337) % W, (H + 120 - ((GT * (12 + i % 5) + i * 211) % (H + 240))), 30 + (i * 13) % 50, 0, 7); ctx.fillStyle = '#FFFFFF'; ctx.fill(); } ctx.restore();
}
function camSpace(ctx, h) {                 // placeholder for the camera (replaced by compose_face.py)
  ctx.save(); const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2E1065'); g.addColorStop(1, '#3B0764'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, h);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.setLineDash([18, 12]); ctx.lineWidth = 4; ctx.strokeRect(30, 30, W - 60, h - 60); ctx.restore();
  kt(ctx, 'MOUNIKA ON CAMERA', W / 2, h / 2, { font: F.ui(48, 900), color: 'rgba(255,255,255,0.75)', align: 'center' });
  kt(ctx, '(your recording goes here)', W / 2, h / 2 + 56, { font: F.ui(32, 600), color: 'rgba(255,255,255,0.6)', align: 'center' });
}
function header(ctx, s, t, sub) {
  const a = eia(s, 0.1);
  exChip(ctx, t, 40 + slideX(s.t, 0.05, -300), CAM_TOP + 28, '#FFD60A', '#1B0B45', 40, a);
  if (sub) kt(ctx, sub, 44, CAM_TOP + 148, { font: F.ui(34, 700), color: '#E9D5FF', alpha: a });
  exLogo(ctx, W - 80, CAM_TOP + 66, 46);
}
function band(ctx, s, lines) {              // keyword band under the full camera (at most 8 words); each line pops in
  ctx.fillStyle = 'rgba(11,8,32,0.92)'; ctx.fillRect(0, CAM_FACE, W, H - CAM_FACE); ctx.fillStyle = '#FFD60A'; ctx.fillRect(0, CAM_FACE, W, 8);
  lines.forEach(([t, col, size, cue], i) => {
    const at = cue == null ? 0.2 + i * 0.4 : ecue(s, cue, 0.5), k = bounce(s.t, at - 0.1);
    if (k <= 0) return; ctx.save(); ctx.translate(W / 2, CAM_FACE + 130 + i * (size + 30)); ctx.scale(k, k);
    kt(ctx, t, 0, size * 0.35, { font: F.ui(size, 900), color: col, align: 'center' }); ctx.restore();
  });
}
function card(ctx, x, y, w, h, fill, k, lines) {   // a card that pops in; lines: [[text, font, colour]]
  if (k <= 0) return; ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 26 }); let yy = y + 70;
  for (const [t, f, c] of lines) { const px = parseInt(f.match(/(\d+)px/)[1]); yy += kt(ctx, t, x + 40, yy, { font: f, color: c, maxW: w - 80, lh: px * 1.15 }) + px * 0.25; }
  ctx.restore();
}
const ARC = [[74.3, 34.6], [76.5, 33.0], [77.6, 31.8], [79.0, 30.6], [80.6, 29.6], [83.0, 28.6], [85.5, 27.9], [88.3, 27.4], [90.5, 27.2], [92.5, 27.6], [94.5, 28.3], [96.5, 28.2]];
function arcGlow(g, proj, a, pulse) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.lineCap = g.lineJoin = 'round';
  for (const [lw, col] of [[56 + 10 * pulse, 'rgba(255,214,10,0.35)'], [26, 'rgba(255,214,10,0.9)']]) { g.lineWidth = lw; g.strokeStyle = col; g.beginPath(); ARC.map(proj).forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke(); }
  g.restore();
}
const IND = [67.5, 6.5, 97.8, 37.2];

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['ZONE VI?', '#FFD60A', 120, 'six'], ['OR ZONE V?', '#FFFFFF', 96, 'five']]); };

SCENES.S2 = (ctx, s) => {                   // who makes the map: BIS → its ministry → the code
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHO MAKES THE MAP?');
  const a1 = ecue(s, 'bureau', 0.4), a2 = ecue(s, 'ministry', 1.6), a3 = ecue(s, 'code', 2.8);
  card(ctx, 60, CAM_TOP + 190, W - 120, 230, '#FFD60A', bounce(s.t, a1), [['BUREAU OF INDIAN STANDARDS', F.ui(50, 900), '#1B0B45'], ['BIS · national standards body · BIS Act 2016', F.ui(32, 700), '#3B0764']]);
  const lp = span(s.t, a2 - 0.4, a2); if (lp > 0) { ctx.save(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.moveTo(W / 2, CAM_TOP + 425); ctx.lineTo(W / 2, CAM_TOP + 425 + 90 * lp); ctx.stroke(); ctx.restore(); }
  card(ctx, 60, CAM_TOP + 520, W - 120, 230, '#FFFFFF', bounce(s.t, a2), [['UNDER THE MINISTRY OF', F.ui(32, 800), '#7C3AED'], ['Consumer Affairs, Food & Public Distribution', F.ui(44, 900), '#1B0B45']]);
  const k3 = span(s.t, a3, a3 + 0.5); if (k3 > 0) { ctx.save(); ctx.translate((1 - easeOut(k3)) * 900, 0);
    card(ctx, 60, CAM_TOP + 820, W - 120, 250, '#06D6A0', 1, [['IS 1893 · THE EARTHQUAKE CODE', F.ui(44, 900), '#053B2C'], ['Criteria for earthquake-resistant design · sets the seismic zones', F.ui(32, 700), '#053B2C']]); ctx.restore(); }
};

SCENES.S3 = (ctx, s) => {                   // old vs new
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'OLD vs NEW MAP');
  const y0 = CAM_TOP + 120, cw = 480, xL = 40, xR = 560;
  const tL = ecue(s, 'old', 0.5), tR = ecue(s, 'new', 1.2), aL = eia(s, tL), aR = eia(s, tR);
  exChip(ctx, '2016 · OLD', xL + slideX(s.t, tL, -400), y0 + 10, '#FDE68A', '#1B0B45', 36, aL);
  exChip(ctx, '2025 · NEW', xR + slideX(s.t, tR, 400), y0 + 10, '#F97316', '#FFFFFF', 36, aR);
  const glow = eia(s, ecue(s, 'himalayan', 2)), pulse = 0.5 + 0.5 * Math.sin(GT * 4);
  if (aL > 0) { ctx.save(); ctx.globalAlpha *= aL; exMap(ctx, s, [xL, y0 + 80, cw, 290], PUR, { bounds: IND }); ctx.restore(); }
  if (aR > 0) { ctx.save(); ctx.globalAlpha *= aR; exMap(ctx, s, [xR, y0 + 80, cw, 290], PUR, { bounds: IND, draw: (g, proj) => arcGlow(g, proj, glow, pulse) }); ctx.restore(); }
  const vs = bounce(s.t, tR + 0.2); if (vs > 0) { ctx.save(); ctx.translate(W / 2, y0 + 225); ctx.rotate((1 - Math.min(1, vs)) * 3); ctx.scale(vs, vs);
    ctx.beginPath(); ctx.arc(0, 0, 54, 0, 7); ctx.fillStyle = '#E9D5FF'; ctx.fill(); kt(ctx, 'VS', 0, 18, { font: F.ui(48, 900), color: '#1B0B45', align: 'center' }); ctx.restore(); }
  const R = [['ZONES', 'II – V · four', 'II – VI · five', ['four', 0]], ['TOP ZONE', 'Zone V', 'Zone VI · Himalayan arc', ['sixth', 0]],
    ['METHOD', 'Earlier method', 'Probabilistic (PSHA)', ['probabilistic', 0]], ['BOUNDARY TOWNS', '—', 'Put in the higher zone', ['boundary', 0]],
    ['MODERATE–HIGH HAZARD', '≈ 59%', '≈ 61% (as reported)', ['sixty-one', 0]]];
  R.forEach(([lab, o, n, [cw2, k]], i) => {
    const y = y0 + 400 + i * 116, at = (s.w(cw2, k) ?? 2 + i) - 0.2, a = eia(s, at);
    if (a <= 0) return;
    ctx.save(); ctx.font = F.ui(24, 800); const lw = ctx.measureText(lab).width + 34; ctx.restore();
    exChip(ctx, lab, W / 2 - lw / 2, y, '#E9D5FF', '#1B0B45', 24, a);
    ctx.save(); ctx.translate(slideX(s.t, at, -500), 0); exBox(ctx, 40, y + 42, 480, 70, { fill: 'rgba(253,230,138,0.95)', r: 14 }); kt(ctx, o, 64, y + 90, { font: F.ui(34, 900), color: '#1B0B45', maxW: 440 }); ctx.restore();
    ctx.save(); ctx.translate(slideX(s.t, at + 0.15, 500), 0); exBox(ctx, 560, y + 42, 480, 70, { fill: 'rgba(249,115,22,0.95)', r: 14 }); kt(ctx, n, 584, y + 90, { font: F.ui(34, 900), color: '#FFFFFF', maxW: 440 }); ctx.restore();
  });
};

SCENES.S4 = (ctx, s) => {                   // withdrawn: the Housing Ministry's concerns, the stamp, the 2016 map back
  const st = ecue(s, 'withdrawn', 1e9), shake = s.t > st && s.t < st + 0.35 ? 9 * (1 - (s.t - st) / 0.35) : 0;
  ctx.save(); vBase(ctx, shake); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHICH MAP IS IN FORCE?');
  const steps = [['2002', 'Zone I merged into II · four zones', null], ['2016', 'IS 1893 (Part 1): 2016 · four zones', null], ['NOV 2025', 'New code · Zone VI added', null], ['MAR 2026', 'New code withdrawn', 'march']];
  const x = 110, y0 = CAM_TOP + 230, gap = 190;
  const lp = span(s.t, 0.2, 1.6); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + gap * 3 * lp); ctx.stroke(); ctx.restore();
  steps.forEach(([d, t, cw], i) => {
    const at = cw ? ecue(s, cw, 0.4 + i * 0.4) : 0.2 + i * 0.4, a = eia(s, at), k = bounce(s.t, at);
    const y = y0 + i * gap; if (k > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.fillStyle = i === 2 ? '#F97316' : '#FFD60A'; ctx.fill(); ctx.restore(); }
    kt(ctx, d, x + 60, y - 4, { font: F.ui(46, 900), color: '#FFFFFF', alpha: a });
    kt(ctx, t, x + 60, y + 46, { font: F.ui(32, 700), color: '#E9D5FF', alpha: a, maxW: 560 });
  });
  const hm = ecue(s, 'housing', 1e9), hk = span(s.t, hm, hm + 0.5);
  if (hk > 0) { ctx.save(); ctx.translate((1 - easeOut(hk)) * 600, 0); exBox(ctx, 660, y0 + gap * 3 - 70, 380, 170, { fill: '#FFFFFF', r: 20 });
    kt(ctx, 'HOUSING MINISTRY', 690, y0 + gap * 3 - 20, { font: F.ui(30, 900), color: '#7C3AED' }); kt(ctx, 'raised cost concerns', 690, y0 + gap * 3 + 26, { font: F.ui(30, 800), color: '#1B0B45' });
    kt(ctx, '(as reported)', 690, y0 + gap * 3 + 66, { font: F.ui(26, 600), color: '#6B21A8' }); ctx.restore(); }
  const sa = span(s.t, st, st + 0.3);
  if (sa > 0) { ctx.save(); ctx.translate(800, y0 + gap * 2 - 40); ctx.rotate(-0.14); const k = 2.2 - 1.2 * easeOut(sa); ctx.scale(k, k); ctx.globalAlpha *= sa;
    ctx.strokeStyle = '#E63946'; ctx.lineWidth = 10; rr(ctx, -210, -58, 420, 116, 16); ctx.stroke();
    kt(ctx, 'WITHDRAWN', 0, 25, { font: F.ui(68, 900), color: '#E63946', align: 'center' }); ctx.restore(); }
  const bk = bounce(s.t, ecue(s, 'back', 0.6));
  if (bk > 0) { ctx.save(); ctx.translate(W / 2, 1785); ctx.scale(bk, bk); ctx.translate(-W / 2, -1785); exBox(ctx, 40, 1700, W - 80, 170, { fill: '#06D6A0' });
    kt(ctx, 'IN FORCE TODAY', 80, 1762, { font: F.ui(32, 900), color: '#053B2C' }); kt(ctx, 'IS 1893 (Part 1): 2016 · Zones II–V', 80, 1830, { font: F.ui(46, 900), color: '#053B2C' }); ctx.restore(); }
  ctx.restore();
};

SCENES.S5 = (ctx, s) => {                   // the four zones in force, sliding in from the left
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'FOUR ZONES · IN FORCE', 'IS 1893 (Part 1): 2016');
  const Z = [['V', 'VERY HIGH', '#7C3AED', '#FFFFFF', ['five', 0]], ['IV', 'HIGH', '#F97316', '#FFFFFF', ['four', 1]], ['III', 'MODERATE', '#FBBF24', '#1B0B45', ['three', 0]], ['II', 'LOW', '#FDE68A', '#1B0B45', ['two', 0]]];
  Z.forEach(([z, lab, col, ink, [cw, k]], i) => {
    const at = (s.w(cw, k) ?? 1) - 0.2, a = eia(s, at), w = 560 + (3 - i) * 120, y = CAM_TOP + 230 + i * 220;
    if (a <= 0) return; ctx.save(); ctx.translate(slideX(s.t, at, -w - 60), 0);
    exBox(ctx, 40, y, w, 190, { fill: col, r: 24 });
    kt(ctx, 'ZONE ' + z, 80, y + 112, { font: F.ui(74, 900), color: ink }); kt(ctx, lab, 80 + 340, y + 108, { font: F.ui(44, 800), color: ink }); ctx.restore();
  });
};

SCENES.S6 = (ctx, s) => {                   // Zone V areas (schematic pins)
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'ZONE V · VERY HIGH', 'Areas named in the code (schematic pins)');
  const P = { bg: '#7C3AED', fg: '#FFFFFF' };
  exMap(ctx, s, [40, CAM_TOP + 190, W - 80, 920], PUR, { bounds: IND, pins: [
    ['North-East', [92.9, 25.6], [-40, 150], 'north-east', P], ['Kashmir', [74.8, 34.1], [70, -60], 'kashmir', P],
    ['Rann of Kutch', [70.0, 23.7], [-10, 120], 'kutch', P], ['Andaman & Nicobar', [92.7, 11.6], [-300, -40], 'andaman', P]] });
};

SCENES.S7 = (ctx, s) => {                   // three traps, each struck through and answered
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 60, '#FFFFFF', '#E63946', 44, eia(s, 0.1));
  const T = [['There is a Zone I', ['zone', 0], 'Merged into Zone II in 2002', ['six', 0]],
    ['Zone VI is in force', ['six', 0], 'Withdrawn, Mar 2026 · 2016 code', ['set', 0]],
    ['Earth Sciences Ministry sets zones', ['set', 0], 'BIS sets them · NCS (MoES) records quakes', ['records', 0]]];
  T.forEach(([myth, [mc, mk], truth, [tc, tk]], i) => {
    const y = CAM_TOP + 180 + i * 330, ma = (s.w(mc, mk) ?? 1) - 0.3, ta = (s.w(tc, tk) ?? 3) - 0.1;
    const k = bounce(s.t, ma); if (k <= 0) return;
    ctx.save(); ctx.translate(W / 2, y + 60); ctx.scale(k, k); ctx.translate(-W / 2, -(y + 60));
    exBox(ctx, 60, y, W - 120, 120, { fill: '#FFFFFF' }); kt(ctx, myth, 100, y + 78, { font: F.ui(46, 900), color: '#1B0B45', maxW: W - 200 });
    const sp = span(s.t, ta, ta + 0.4); if (sp > 0) { ctx.strokeStyle = '#E63946'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(95, y + 62); ctx.lineTo(95 + (W - 200) * sp, y + 62); ctx.stroke(); }
    ctx.restore();
    const tk2 = bounce(s.t, ta + 0.25); if (tk2 > 0) { ctx.save(); ctx.translate(W / 2, y + 205); ctx.scale(tk2, tk2); ctx.translate(-W / 2, -(y + 205));
      exBox(ctx, 60, y + 140, W - 120, 130, { fill: '#06D6A0' }); kt(ctx, '✓ ' + truth, 100, y + 220, { font: F.ui(38, 900), color: '#053B2C', maxW: W - 200 }); ctx.restore(); }
  });
};

SCENES.S8 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['1 EXAM TRAP', '#FFD60A', 104, 'trap'], ['EVERY DAY · DECODE UPSC', '#FFFFFF', 60, 'every']]); };

// how it was reported: two clippings in our own design (no real newspaper page; §6.4), and an official-notice slot
// that shows a PIB or BIS screenshot when A['official_notice'] is loaded (brand/ or assets), else a labelled frame
function clipV(ctx, x, y, w, h, k, date, head, src, rot) {
  if (k <= 0) return; ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot * (2 - Math.min(1, k))); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = '#FBF6EA'; ctx.fillRect(x, y, w, h); ctx.shadowColor = 'transparent';
  exLogo(ctx, x + 50, y + 52, 30); kt(ctx, 'THE DECODE DESK', x + 96, y + 66, { font: F.head(38, 900), color: '#1B1B1B' });
  ctx.fillStyle = '#1B1B1B'; ctx.fillRect(x + 30, y + 96, w - 60, 3);
  kt(ctx, date, x + 30, y + 136, { font: F.ui(28, 800), color: '#5A4A32' });
  kt(ctx, head, x + 30, y + 190, { font: F.head(40, 800), color: '#1B1B1B', maxW: w - 60, lh: 48 });
  kt(ctx, 'Reported by: ' + src, x + 30, y + h - 30, { font: F.ui(26, 700), color: '#5A4A32', maxW: w - 60 });
  ctx.restore();
}
SCENES.S9 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'HOW IT WAS REPORTED');
  clipV(ctx, 50, CAM_TOP + 115, 660, 380, bounce(s.t, 0.3), 'NOV 2025', 'BIS releases a revised earthquake code with a new Zone VI', 'ThePrint · Vision IAS', -0.04);
  clipV(ctx, 370, CAM_TOP + 505, 660, 380, bounce(s.t, ecue(s, 'withdrawal', 1.4)), 'MAR 2026', 'BIS withdraws the 2025 seismic code; the 2016 code applies', 'Economic Times · ETV Bharat', 0.05);
  const a = eia(s, ecue(s, 'check', 2.5)), img = A['official_notice'];
  if (img) { ctx.save(); ctx.globalAlpha *= a; const bh = 230, bw = Math.min(W - 120, bh * img.width / img.height); ctx.drawImage(img, 60, 1650, bw, bh); ctx.restore();
    exChip(ctx, 'OFFICIAL: ' + (window.NOTICE_CREDIT || 'Source: PIB'), 60, 1595, '#06D6A0', '#053B2C', 26, a); }
  else { ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = '#06D6A0'; ctx.setLineDash([16, 10]); ctx.lineWidth = 5; ctx.strokeRect(60, 1640, W - 120, 240); ctx.restore();
    kt(ctx, 'OFFICIAL NOTICE: PIB / BIS SCREENSHOT', W / 2, 1750, { font: F.ui(36, 900), color: '#06D6A0', align: 'center', alpha: a });
    kt(ctx, 'Always check the date before you trust a map', W / 2, 1805, { font: F.ui(30, 700), color: '#E9D5FF', align: 'center', alpha: a }); }
};
