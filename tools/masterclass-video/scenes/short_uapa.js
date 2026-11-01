// W45 Short v2: UAPA bail, the exam question behind the Front Line Defenders award (Oct 2026). Needs short_kit.js first:
//   node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_uapa.js <out> --size 1080x1920
// Neutral by design: the allegation and the denial are both on screen, there is no photograph of the accused, and
// nothing predicts the pending case (CLAUDE.md §9). Every build lands on the word that names it.

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['CAN AN AWARD', '#FFFFFF', 84, 'award'], ['GET YOU BAIL?', '#FFD60A', 124, 'bail']]); };

function factChip(ctx, s, t, y, cue, fill, ink, x = 60) {
  const at = ecue(s, cue), k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.font = F.ui(36, 900); const w = ctx.measureText(t).width + 60; ctx.restore();
  ctx.save(); ctx.translate(x + w / 2, y + 40); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 40));
  exBox(ctx, x, y, w, 80, { fill, r: 40 }); kt(ctx, t, x + 30, y + 54, { font: F.ui(36, 900), color: ink }); ctx.restore();
}

SCENES.S2 = (ctx, s) => {                   // the award: who gives it, since when, and the five regions
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE AWARD', 'For human rights defenders at risk');
  const k = bounce(s.t, ecue(s, 'front'));
  if (k > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 300); ctx.scale(k, k); ctx.translate(-W / 2, -(CAM_TOP + 300));
    const g = ctx.createLinearGradient(50, 0, W - 50, 0); g.addColorStop(0, '#FFD60A'); g.addColorStop(1, '#F59E0B');
    exBox(ctx, 50, CAM_TOP + 200, W - 100, 200, { fill: g, r: 26 });
    kt(ctx, 'FRONT LINE DEFENDERS AWARD', W / 2, CAM_TOP + 285, { font: F.ui(54, 900), color: '#1B0B45', align: 'center' });
    kt(ctx, 'Human Rights Defenders at Risk', W / 2, CAM_TOP + 350, { font: F.ui(38, 800), color: '#4C1D95', align: 'center' });
    ctx.restore(); }
  factChip(ctx, s, 'Irish NGO · Dublin · founded 2001', CAM_TOP + 430, 'irish', '#FFFFFF', '#1B0B45');
  factChip(ctx, s, 'Every year since 2005', CAM_TOP + 530, 'thousand', '#E9D5FF', '#1B0B45');
  const R = [['AFRICA', 0, 0], ['AMERICAS', 1, 0], ['ASIA-PACIFIC', 0, 1], ['EUROPE & C. ASIA', 1, 1], ['MIDDLE EAST & N. AFRICA', 0, 2]];
  const r0 = ecue(s, 'region') - 0.4;
  R.forEach(([t, c, r], i) => {
    const kk = bounce(s.t, r0 + i * 0.15); if (kk <= 0) return;
    const w = r === 2 ? W - 100 : 470, x = 50 + c * 510, y = CAM_TOP + 650 + r * 120, hi = i === 2;
    const glow = hi ? span(s.t, r0 + 1, r0 + 1.6) : 0;
    ctx.save(); ctx.translate(x + w / 2, y + 50); ctx.scale(kk * (1 + 0.06 * glow), kk * (1 + 0.06 * glow)); ctx.translate(-(x + w / 2), -(y + 50));
    if (glow) { ctx.shadowColor = '#FFD60A'; ctx.shadowBlur = 40 * glow; }
    exBox(ctx, x, y, w, 100, { fill: glow ? '#FFD60A' : 'rgba(255,255,255,0.14)', r: 20 }); ctx.shadowColor = 'transparent';
    kt(ctx, t, x + w / 2, y + 64, { font: F.ui(38, 900), color: glow ? '#1B0B45' : '#FFFFFF', align: 'center' }); ctx.restore();
  });
  kt(ctx, 'One laureate per region', 64, CAM_TOP + 1060, { font: F.ui(30, 700), color: '#E9D5FF', alpha: eia(s, r0 + 1) });
};

SCENES.S3 = (ctx, s) => {                   // the news, as our own clipping, then the facts on their words
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY IN NEWS');
  clipV(ctx, 50, CAM_TOP + 115, W - 100, 400, bounce(s.t, 0.1), '8 OCT 2026 · TRINITY COLLEGE, DUBLIN', 'Front Line Defenders names Umar Khalid its 2026 Asia-Pacific laureate', 'Front Line Defenders · The Statesman · Outlook', -0.03);
  factChip(ctx, s, 'In custody since 13 Sep 2020', CAM_TOP + 570, 'held', '#FFFFFF', '#1B0B45');
  factChip(ctx, s, 'UAPA · Delhi riots conspiracy case', CAM_TOP + 680, 'delhi', '#FFD60A', '#1B0B45');
  factChip(ctx, s, 'Police allege conspiracy · he denies it', CAM_TOP + 790, 'police', '#E9D5FF', '#1B0B45');
  kt(ctx, 'Trial pending · no view on the merits', 64, 1870, { font: F.ui(28, 700), color: '#E9D5FF', alpha: eia(s, ecue(s, 'pending')) });
};

SCENES.S4 = (ctx, s) => {                   // expand UAPA letter by letter, then its timeline
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'EXPAND IT', "India's main anti-terror law");
  const L = [['U', 'nlawful', 'unlawful'], ['A', 'ctivities', 'activities'], ['P', 'revention', 'prevention'], ['A', 'ct, 1967', 'act']];
  L.forEach(([c, rest, cue], i) => {
    const y = CAM_TOP + 300 + i * 118, at = ecue(s, cue), k = bounce(s.t, 0.15 + i * 0.12);
    if (k <= 0) return;
    const on = span(s.t, at, at + 0.5);
    ctx.save(); ctx.translate(120, y - 35); ctx.scale(k * (1 + 0.15 * Math.sin(on * Math.PI)), k * (1 + 0.15 * Math.sin(on * Math.PI))); ctx.translate(-120, -(y - 35));
    kt(ctx, c, 120, y, { font: F.ui(112, 900), color: '#FFD60A', align: 'center' }); ctx.restore();
    const n = Math.round(rest.length * clamp((s.t - at) / 0.35));
    if (n > 0) kt(ctx, rest.slice(0, n), 175, y - 4, { font: F.ui(74, 900), color: '#FFFFFF' });
  });
  const y0 = CAM_TOP + 860, nodes = [[170, '1967', 'Enacted', 'act'], [540, '2008', 'After 26/11 · bail tightened (s.43D)', 'mumbai'], [910, '2019', 'Individuals can be declared terrorists', 'individual']];
  const t0 = ecue(s, 'act');
  const grow = span(s.t, t0, ecue(s, 'individual') + 0.3);
  if (grow > 0) { ctx.save(); ctx.strokeStyle = '#E9D5FF'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(90, y0); ctx.lineTo(90 + (990 - 90) * grow, y0); ctx.stroke(); ctx.restore(); }
  nodes.forEach(([x, yr, lab, cue]) => {
    const k = bounce(s.t, ecue(s, cue)); if (k <= 0) return;
    ctx.save(); ctx.translate(x, y0); ctx.scale(k, k); ctx.translate(-x, -y0);
    ctx.beginPath(); ctx.arc(x, y0, 22, 0, 7); ctx.fillStyle = '#FFD60A'; ctx.fill();
    kt(ctx, yr, x, y0 - 50, { font: F.ui(56, 900), color: '#FFD60A', align: 'center' });
    kt(ctx, lab, x, y0 + 80, { font: F.ui(32, 800), color: '#FFFFFF', align: 'center', maxW: 330, lh: 40 });
    ctx.restore();
  });
};

SCENES.S5 = (ctx, s) => {                   // the law: s.43D(5) and Watali
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE BAIL CLAUSE', 'UAPA, Section 43D(5)');
  const a1 = ecue(s, 'section');
  card(ctx, 50, CAM_TOP + 200, W - 100, 400, '#FFD60A', bounce(s.t, a1), [['SECTION 43D(5)', F.ui(78, 900), '#1B0B45'], ['No bail if there are reasonable grounds to believe the accusation is', F.ui(38, 800), '#1B0B45'], ['PRIMA FACIE TRUE', F.ui(54, 900), '#7C3AED']]);
  const a2 = ecue(s, 'watali'), k = span(s.t, a2, a2 + 0.5);
  if (k > 0) { ctx.save(); ctx.translate((1 - easeOut(k)) * 1000, 0);
    card(ctx, 50, CAM_TOP + 660, W - 100, 330, '#FFFFFF', 1, [['NIA v. WATALI · 2019', F.ui(46, 900), '#7C3AED'], ['Kashmir terror-funding case · bail cancelled', F.ui(34, 800), '#6B21A8'], ['First look only · no mini-trial', F.ui(44, 900), '#1B0B45']]); ctx.restore(); }
};

SCENES.S6 = (ctx, s) => {                   // the balance: s.43D(5) against Article 21
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE BALANCE', 'Liberty vs a statutory bar');
  const tN = ecue(s, 'najeeb'), tJ = ecue(s, 'january');
  const tilt = 0.16 * easeOut(span(s.t, tN, tN + 0.8)) - 0.16 * easeOut(span(s.t, tJ, tJ + 0.8));   // + tips toward Art 21
  const cx = W / 2, cy = CAM_TOP + 300, L = 300;
  ctx.save(); ctx.fillStyle = '#E9D5FF'; ctx.fillRect(cx - 8, cy, 16, 260); ctx.fillRect(cx - 120, cy + 250, 240, 16); ctx.restore();
  const ends = [-1, 1].map(d => [cx + d * L * Math.cos(tilt), cy + d * L * Math.sin(tilt)]);
  ctx.save(); ctx.strokeStyle = '#E9D5FF'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...ends[0]); ctx.lineTo(...ends[1]); ctx.stroke(); ctx.restore();
  [['SECTION 43D(5)', 'bail bar', '#FFD60A', '#1B0B45'], ['ARTICLE 21', 'personal liberty', '#06D6A0', '#053B2C']].forEach(([t, sub, fill, ink], i) => {
    const [ex, ey] = ends[i]; ctx.save(); ctx.strokeStyle = '#E9D5FF'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex, ey + 70); ctx.stroke(); ctx.restore();
    exBox(ctx, ex - 170, ey + 70, 340, 150, { fill, r: 22 });
    kt(ctx, t, ex, ey + 140, { font: F.ui(34, 900), color: ink, align: 'center' }); kt(ctx, sub, ex, ey + 190, { font: F.ui(30, 700), color: ink, align: 'center' });
  });
  card(ctx, 50, CAM_TOP + 650, W - 100, 210, '#FFFFFF', bounce(s.t, tN), [['K.A. NAJEEB · 2021', F.ui(42, 900), '#06A77D'], ['5+ years in jail, trial far off: bail upheld (Art 21)', F.ui(34, 800), '#1B0B45']]);
  card(ctx, 50, CAM_TOP + 880, W - 100, 190, '#FDE68A', bounce(s.t, tJ), [['JAN 2026 · SUPREME COURT', F.ui(40, 900), '#7C3AED'], ['Prima facie case found · bail denied', F.ui(36, 800), '#1B0B45']]);
  kt(ctx, 'May 2026: question referred to a larger bench (reported)', 64, 1885, { font: F.ui(26, 700), color: '#E9D5FF', alpha: eia(s, tJ + 2) });
};

SCENES.S7 = (ctx, s) => {                   // two traps, each struck through and answered
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 60, '#FFFFFF', '#E63946', 44, eia(s, 0.1));
  const T = [['Front Line Defenders is a UN body', 'front', 'Irish NGO · Dublin · founded 2001', 'irish'],
    ['The 1998 Declaration is a binding treaty', 'declaration', 'UNGA declaration (res. 53/144) · not binding', 'binding']];
  T.forEach(([myth, mc, truth, tc], i) => {
    const y = CAM_TOP + 200 + i * 470, ma = (s.w(mc) ?? 1) - 0.3, ta = (s.w(tc) ?? 3) - 0.1;
    const k = bounce(s.t, ma); if (k <= 0) return;
    ctx.save(); ctx.translate(W / 2, y + 70); ctx.scale(k, k); ctx.translate(-W / 2, -(y + 70));
    exBox(ctx, 60, y, W - 120, 140, { fill: '#FFFFFF' }); kt(ctx, myth, 100, y + 88, { font: F.ui(42, 900), color: '#1B0B45', maxW: W - 200 });
    const sp = span(s.t, ta, ta + 0.4); if (sp > 0) { ctx.strokeStyle = '#E63946'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(95, y + 74); ctx.lineTo(95 + (W - 200) * sp, y + 74); ctx.stroke(); }
    ctx.restore();
    const k2 = bounce(s.t, ta + 0.25); if (k2 > 0) { ctx.save(); ctx.translate(W / 2, y + 240); ctx.scale(k2, k2); ctx.translate(-W / 2, -(y + 240));
      exBox(ctx, 60, y + 165, W - 120, 150, { fill: '#06D6A0' }); kt(ctx, '✓ ' + truth, 100, y + 258, { font: F.ui(38, 900), color: '#053B2C', maxW: W - 200 }); ctx.restore(); }
  });
};

SCENES.S8 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS: LIBERTY vs SECURITY', '#FFFFFF', 62, 'liberty'], ['BRIDGE = SPEEDY TRIAL', '#FFD60A', 80, 'speedy']]); };
