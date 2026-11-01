// W45 Short: UAPA bail, the exam question behind the Front Line Defenders award (Oct 2026). Needs short_kit.js first:
//   node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_uapa.js <out> --size 1080x1920
// Neutral by design: the allegation and the denial are both on screen, there is no photograph of the accused, and
// nothing predicts the pending case (CLAUDE.md §9).

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['THE EXAM QUESTION', '#FFFFFF', 70, 'exam'], ['UAPA BAIL', '#FFD60A', 130, 'bail']]); };

function factChip(ctx, s, t, y, cue, fill, ink) {
  const at = ecue(s, cue, 2), k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.font = F.ui(36, 900); const w = ctx.measureText(t).width + 60; ctx.restore();
  ctx.save(); ctx.translate(60 + w / 2, y + 40); ctx.scale(k, k); ctx.translate(-(60 + w / 2), -(y + 40));
  exBox(ctx, 60, y, w, 80, { fill, r: 40 }); kt(ctx, t, 90, y + 54, { font: F.ui(36, 900), color: ink }); ctx.restore();
}
SCENES.S2 = (ctx, s) => {                   // the news, as our own clipping, then the facts on their words
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY IN NEWS');
  clipV(ctx, 50, CAM_TOP + 115, W - 100, 400, bounce(s.t, 0.2), '8 OCT 2026 · DUBLIN', 'Front Line Defenders names Umar Khalid its 2026 Asia-Pacific laureate', 'Front Line Defenders · The Statesman · Outlook', -0.03);
  factChip(ctx, s, 'In custody since 13 Sep 2020', CAM_TOP + 570, 'custody', '#FFFFFF', '#1B0B45');
  factChip(ctx, s, 'UAPA · Delhi riots conspiracy case', CAM_TOP + 680, 'uapa', '#FFD60A', '#1B0B45');
  factChip(ctx, s, 'Police allege conspiracy · he denies it', CAM_TOP + 790, 'denies', '#E9D5FF', '#1B0B45');
  kt(ctx, 'Trial pending · no view on the merits', 64, 1870, { font: F.ui(28, 700), color: '#E9D5FF', alpha: eia(s, ecue(s, 'charges', 3)) });
};

SCENES.S3 = (ctx, s) => {                   // the law: s.43D(5) and Watali
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE LAW', 'Unlawful Activities (Prevention) Act, 1967');
  const a1 = ecue(s, 'section', 0.4);
  card(ctx, 50, CAM_TOP + 200, W - 100, 400, '#FFD60A', bounce(s.t, a1), [['SECTION 43D(5)', F.ui(78, 900), '#1B0B45'], ['No bail if there are reasonable grounds to believe the accusation is', F.ui(38, 800), '#1B0B45'], ['PRIMA FACIE TRUE', F.ui(54, 900), '#7C3AED']]);
  const a2 = ecue(s, 'watali', 3), k = span(s.t, a2, a2 + 0.5);
  if (k > 0) { ctx.save(); ctx.translate((1 - easeOut(k)) * 1000, 0);
    card(ctx, 50, CAM_TOP + 660, W - 100, 330, '#FFFFFF', 1, [['NIA v. WATALI · 2019', F.ui(46, 900), '#7C3AED'], ['At the bail stage, courts do not weigh the evidence in detail', F.ui(40, 800), '#1B0B45']]); ctx.restore(); }
};

SCENES.S4 = (ctx, s) => {                   // the balance: s.43D(5) against Article 21
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE BALANCE', 'Liberty vs a statutory bar');
  const tN = ecue(s, 'najeeb', 0.6), tJ = ecue(s, 'january', 3);
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
  card(ctx, 50, CAM_TOP + 650, W - 100, 210, '#FFFFFF', bounce(s.t, tN), [['K.A. NAJEEB · 2021', F.ui(42, 900), '#06A77D'], ['Long custody without trial can justify bail (Art 21)', F.ui(36, 800), '#1B0B45']]);
  card(ctx, 50, CAM_TOP + 880, W - 100, 190, '#FDE68A', bounce(s.t, tJ), [['JAN 2026 · SUPREME COURT', F.ui(40, 900), '#7C3AED'], ['Prima facie case found · bail denied', F.ui(36, 800), '#1B0B45']]);
  kt(ctx, 'May 2026: question referred to a larger bench (reported)', 64, 1885, { font: F.ui(26, 700), color: '#E9D5FF', alpha: eia(s, tJ + 2) });
};

SCENES.S5 = (ctx, s) => {                   // two traps, each struck through and answered
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 60, '#FFFFFF', '#E63946', 44, eia(s, 0.1));
  const T = [['Front Line Defenders is a UN body', ['front', 0], 'Irish NGO · Dublin · founded 2001', ['irish', 0]],
    ['The 1998 Declaration is a binding treaty', ['declaration', 0], 'UNGA declaration (res. 53/144) · not binding', ['binding', 0]]];
  T.forEach(([myth, [mc, mk], truth, [tc, tk]], i) => {
    const y = CAM_TOP + 200 + i * 470, ma = (s.w(mc, mk) ?? 1) - 0.3, ta = (s.w(tc, tk) ?? 3) - 0.1;
    const k = bounce(s.t, ma); if (k <= 0) return;
    ctx.save(); ctx.translate(W / 2, y + 70); ctx.scale(k, k); ctx.translate(-W / 2, -(y + 70));
    exBox(ctx, 60, y, W - 120, 140, { fill: '#FFFFFF' }); kt(ctx, myth, 100, y + 88, { font: F.ui(42, 900), color: '#1B0B45', maxW: W - 200 });
    const sp = span(s.t, ta, ta + 0.4); if (sp > 0) { ctx.strokeStyle = '#E63946'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(95, y + 74); ctx.lineTo(95 + (W - 200) * sp, y + 74); ctx.stroke(); }
    ctx.restore();
    const k2 = bounce(s.t, ta + 0.25); if (k2 > 0) { ctx.save(); ctx.translate(W / 2, y + 240); ctx.scale(k2, k2); ctx.translate(-W / 2, -(y + 240));
      exBox(ctx, 60, y + 165, W - 120, 150, { fill: '#06D6A0' }); kt(ctx, '✓ ' + truth, 100, y + 258, { font: F.ui(38, 900), color: '#053B2C', maxW: W - 200 }); ctx.restore(); }
  });
};

SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['1 EXAM TRAP', '#FFD60A', 104, 'trap'], ['EVERY DAY · DECODE UPSC', '#FFFFFF', 60, 'every']]); };
