// W45 Short: International Day against Violence and Bullying at School, including Cyberbullying (5 Nov 2026).
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_bully.js <out> --size 1080x1920
// No short forms on screen (owner, 3 Nov). No clip-art people (CLAUDE.md §6.2): the data uses plain dots.

const SKY = '#4CC9F0', YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', PNK = '#F9A8D4';
function pill(ctx, s, t, x, y, at, fill, ink, size = 36) {
  const k = bounce(s.t, at); if (k <= 0) return 0;
  ctx.save(); ctx.font = F.ui(size, 900); const w = ctx.measureText(t).width + 60; ctx.restore();
  ctx.save(); ctx.translate(x + w / 2, y + 42); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 42));
  exBox(ctx, x, y, w, 84, { fill, r: 42 }); kt(ctx, t, x + 30, y + 42 + size * 0.36, { font: F.ui(size, 900), color: ink }); ctx.restore();
  return w;
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['5 NOVEMBER', YEL, 76, -1], ['STOP BULLYING AT SCHOOL', '#FFFFFF', 58, -0.8]]); };

SCENES.S2 = (ctx, s) => {                   // what the day is
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, "TODAY'S DAY");
  card(ctx, 50, CAM_TOP + 120, W - 100, 240, '#FFFFFF', bounce(s.t, 0.2), [['International Day against Violence and Bullying at School, including Cyberbullying', F.ui(44, 900), INK]]);
  pill(ctx, s, '5 November 2026 · first Thursday of November', 50, CAM_TOP + 440, ecue(s, 'thursday'), YEL, INK, 32);
  pill(ctx, s, 'Approved 2019 · all 193 member states', 50, CAM_TOP + 545, ecue(s, 'ninety-three'), SKY, '#062A3A', 34);
  pill(ctx, s, 'First observed 2020', 50, CAM_TOP + 650, ecue(s, 'first observed'), GRN, '#053B2C', 34);
  kt(ctx, 'of the United Nations Educational, Scientific and Cultural Organization', 64, CAM_TOP + 790,
     { font: F.ui(28, 800), color: '#E9D5FF', maxW: W - 128, lh: 34, alpha: eia(s, ecue(s, 'ninety-three') + 0.6) });
  kt(ctx, '2026: start of its second five-year cycle · safety, mental health, digital safety', 64, 1860,
     { font: F.ui(24, 700), color: '#E9D5FF', maxW: W - 128, lh: 30, alpha: eia(s, ecue(s, 'first observed') + 0.8) });
};

function dots(ctx, n, lit, x, y, r, gap, k, col) {
  for (let i = 0; i < n; i++) { const kk = clamp(k * n - i); if (kk <= 0) continue;
    ctx.save(); ctx.globalAlpha = kk; ctx.beginPath(); ctx.arc(x + i * gap, y, r, 0, 7); ctx.fillStyle = i < lit ? col : 'rgba(255,255,255,0.25)'; ctx.fill(); ctx.restore(); }
}
SCENES.S3 = (ctx, s) => {                   // the scale, as plain dots (no clip-art people)
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'HOW BIG IS IT?');
  const t3 = ecue(s, 'three'), k3 = span(s.t, t3, t3 + 0.8);
  if (k3 > 0) { kt(ctx, '1 in 3', 60, CAM_TOP + 260, { font: F.ui(120, 900), color: YEL, alpha: Math.min(1, k3 * 2) });
    dots(ctx, 3, 1, 640, CAM_TOP + 220, 50, 130, k3, YEL);
    kt(ctx, 'students bullied at least once in the past month', 64, CAM_TOP + 330, { font: F.ui(36, 800), color: '#FFFFFF', maxW: W - 128, alpha: Math.min(1, k3 * 2) }); }
  const t10 = ecue(s, 'ten'), k10 = span(s.t, t10, t10 + 0.8);
  if (k10 > 0) { kt(ctx, '1 in 10', 60, CAM_TOP + 560, { font: F.ui(120, 900), color: PNK, alpha: Math.min(1, k10 * 2) });
    dots(ctx, 10, 1, 90, CAM_TOP + 640, 30, 96, k10, PNK);
    kt(ctx, 'students have faced cyberbullying', 64, CAM_TOP + 740, { font: F.ui(36, 800), color: '#FFFFFF', maxW: W - 128, alpha: Math.min(1, k10 * 2) }); }
  pill(ctx, s, '= 1 in every 3 in your class', 60, CAM_TOP + 800, ecue(s, 'mugguru'), '#FFFFFF', INK, 36);
  kt(ctx, '"Behind the Numbers" report, 2019 · 144 countries', 64, 1870, { font: F.ui(26, 700), color: '#E9D5FF', alpha: eia(s, t3 + 1) });
};

SCENES.S4 = (ctx, s) => {                   // India's safety net, linked
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHO PROTECTS CHILDREN IN INDIA?');
  const items = [['National Commission for Protection of Child Rights', 'Statutory · Commissions for Protection of Child Rights Act, 2005 · Ministry of Women and Child Development', YEL, INK, 'commission'],
    ['Protection of Children from Sexual Offences Act, 2012', 'Punishes harassment of a child, including through digital means', '#FFFFFF', INK, 'sexual'],
    ['Report cybercrime: 1930', 'or cybercrime.gov.in (National Cyber Crime Reporting Portal)', GRN, '#053B2C', 'nineteen']];
  items.forEach(([t, sub, fill, ink, cue], i) => {
    const y = CAM_TOP + 130 + i * 300, at = ecue(s, cue), k = bounce(s.t, at); if (k <= 0) return;
    if (i) { ctx.save(); ctx.strokeStyle = YEL; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(W / 2, y - 40); ctx.lineTo(W / 2, y); ctx.stroke(); ctx.restore(); }
    card(ctx, 50, y, W - 100, 250, fill, k, [[t, F.ui(40, 900), ink], [sub, F.ui(28, 800), '#6B21A8']]);
  });
};

SCENES.S5 = (ctx, s) => {                   // two traps
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 60, '#FFFFFF', '#E63946', 44, eia(s, 0.1));
  const T = [['Declared by the United Nations General Assembly', 'created', 'Declared by the member states of the United Nations Educational, Scientific and Cultural Organization · headquarters: Paris', 'paris'],
    ['The Child Rights Commission is a constitutional body', 'commission', 'Statutory: created by an Act of Parliament, 2005', 'statutory']];
  T.forEach(([myth, mc, truth, tc], i) => {
    const y = CAM_TOP + 190 + i * 470, ma = ecue(s, mc) - 0.1, ta = ecue(s, tc);
    const k = bounce(s.t, ma); if (k <= 0) return;
    ctx.save(); ctx.translate(W / 2, y + 70); ctx.scale(k, k); ctx.translate(-W / 2, -(y + 70));
    exBox(ctx, 60, y, W - 120, 140, { fill: '#FFFFFF' }); kt(ctx, myth, 100, y + 84, { font: F.ui(30, 900), color: INK });
    const sp = span(s.t, ta, ta + 0.4); if (sp > 0) { ctx.strokeStyle = '#E63946'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(95, y + 72); ctx.lineTo(95 + (W - 200) * sp, y + 72); ctx.stroke(); }
    ctx.restore();
    const k2 = bounce(s.t, ta + 0.25); if (k2 > 0) { ctx.save(); ctx.translate(W / 2, y + 250); ctx.scale(k2, k2); ctx.translate(-W / 2, -(y + 250));
      exBox(ctx, 60, y + 165, W - 120, 190, { fill: GRN }); kt(ctx, '✓ ' + truth, 100, y + 235, { font: F.ui(32, 900), color: '#053B2C', maxW: W - 200, lh: 40 }); ctx.restore(); }
  });
};

SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS & ETHICS', YEL, 80, 'mains'], ['SCHOOL, PARENTS OR PLATFORM?', '#FFFFFF', 52, 'platform']]); };
