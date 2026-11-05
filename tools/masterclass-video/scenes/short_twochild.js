// W45 Short: the Supreme Court and the two-child rule for panchayat elections (reported 4 Nov 2026).
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_twochild.js <out> --size 1080x1920
// No short forms on screen (owner, 3 Nov). Builds land on their words; numbers appear at their final value.

const SKY = '#4CC9F0', YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', PNK = '#F9A8D4', TEAL = '#2BB3A3';
function pill(ctx, s, t, x, y, at, fill, ink, size = 36) {
  const k = bounce(s.t, at); if (k <= 0) return 0;
  ctx.save(); ctx.font = F.ui(size, 900); const w = ctx.measureText(t).width + 60; ctx.restore();
  ctx.save(); ctx.translate(x + w / 2, y + 42); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 42));
  exBox(ctx, x, y, w, 84, { fill, r: 42 }); kt(ctx, t, x + 30, y + 42 + size * 0.36, { font: F.ui(size, 900), color: ink }); ctx.restore();
  return w;
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['TWO-CHILD RULE', YEL, 84, -1], ['STRUCK DOWN? NOT YET', '#FFFFFF', 58, -0.8]]); };

SCENES.S2 = (ctx, s) => {                   // what the Court did
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY IN NEWS');
  clipV(ctx, 50, CAM_TOP + 110, W - 100, 330, bounce(s.t, 0.1), '4 NOVEMBER 2026 · SUPREME COURT', 'Two-child rule laws "have lost relevance": Court sends 2003 ruling to a larger bench', 'The Week · ETV Bharat · LawTrend', -0.03);
  pill(ctx, s, "A Maharashtra sarpanch's case", 50, CAM_TOP + 470, ecue(s, 'sarpanch'), '#FFFFFF', INK, 34);
  card(ctx, 50, CAM_TOP + 580, W - 100, 190, YEL, bounce(s.t, ecue(s, 'javed')), [['Javed v. State of Haryana · 2003', F.ui(40, 900), INK], ['upheld the two-child rule for panchayat polls', F.ui(32, 800), '#6B21A8']]);
  pill(ctx, s, '→ sent to a LARGER BENCH', 50, CAM_TOP + 800, ecue(s, 'larger'), GRN, '#053B2C', 38);
  kt(ctx, 'The sarpanch stays in office for now · no final verdict yet', 64, 1870, { font: F.ui(26, 700), color: '#E9D5FF', alpha: eia(s, ecue(s, 'larger') + 1) });
};

SCENES.S3 = (ctx, s) => {                   // the fertility data, at final values
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY NOW?', 'Total fertility rate = children per woman');
  const base = CAM_TOP + 760, unit = 150, bars = [['2003', 3.0, '≈3.0', '#E9D5FF', 'three'], ['2023', 1.9, '1.9', YEL, 'point nine']];
  bars.forEach(([yr, v, lab, fill, cue], i) => {
    const g = span(s.t, ecue(s, cue), ecue(s, cue) + 0.7); if (g <= 0) return;
    const x = 180 + i * 380, h = v * unit * easeOut(g);
    exBox(ctx, x, base - h, 220, h, { fill, r: 16 });
    if (g >= 1) kt(ctx, lab, x + 110, base - h + 80, { font: F.ui(64, 900), color: INK, align: 'center' });
    kt(ctx, yr, x + 110, base + 50, { font: F.ui(40, 900), color: '#FFFFFF', align: 'center', alpha: Math.min(1, g * 2) });
  });
  const tr = ecue(s, 'replacement'), gr = span(s.t, tr, tr + 0.6);
  if (gr > 0) { const y = base - 2.1 * unit; ctx.save(); ctx.strokeStyle = PNK; ctx.lineWidth = 6; ctx.setLineDash([18, 12]); ctx.beginPath(); ctx.moveTo(110, y); ctx.lineTo(110 + 860 * gr, y); ctx.stroke(); ctx.restore();
    kt(ctx, 'replacement level 2.1', 960, y - 18, { font: F.ui(30, 900), color: PNK, align: 'right', alpha: gr }); }
  // (bar values sit inside the bars, so the dashed line never crosses them)
  pill(ctx, s, 'Rural 2.1', 60, base + 90, ecue(s, 'rural'), SKY, '#062A3A', 38);
  pill(ctx, s, 'Urban 1.5', 330, base + 90, ecue(s, 'cities'), GRN, '#053B2C', 38);
  kt(ctx, 'Source: Sample Registration System, 2023', 64, 1880, { font: F.ui(26, 700), color: '#E9D5FF', alpha: eia(s, ecue(s, 'point nine') + 1) });
};

SCENES.S4 = (ctx, s) => {                   // which Articles
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHICH ARTICLES?');
  card(ctx, 50, CAM_TOP + 140, W - 100, 300, YEL, bounce(s.t, ecue(s, 'two-forty-three')), [['ARTICLE 243F', F.ui(60, 900), INK], ["A State's law decides who is disqualified from panchayats", F.ui(38, 900), '#6B21A8']]);
  card(ctx, 50, CAM_TOP + 480, W - 100, 300, '#FFFFFF', bounce(s.t, ecue(s, 'twenty-one')), [['ARTICLE 21', F.ui(60, 900), INK], ['Does penalising family size hurt reproductive choice?', F.ui(38, 900), '#6B21A8']]);
};

SCENES.S5 = (ctx, s) => {                   // Telugu States lens
  vBase(ctx); camSpace(ctx, CAM_TOP);
  exChip(ctx, 'TELUGU STATES LENS', 40 + slideX(s.t, 0.05, -300), CAM_TOP + 28, TEAL, '#FFFFFF', 40, eia(s, 0.1)); exLogo(ctx, W - 80, CAM_TOP + 66, 46);
  card(ctx, 50, CAM_TOP + 160, W - 100, 300, TEAL, bounce(s.t, ecue(s, 'andhra')), [['ANDHRA PRADESH', F.ui(52, 900), '#FFFFFF'], ['Rule since 1994 → scrapped in 2024', F.ui(42, 900), '#FFFFFF']]);
  card(ctx, 50, CAM_TOP + 500, W - 100, 340, '#FFFFFF', bounce(s.t, ecue(s, 'telangana')), [['TELANGANA', F.ui(52, 900), '#0F6E64'], ['Urban bodies 2019 · rural bodies 2026', F.ui(40, 900), INK], ['Rural fertility: 1.7', F.ui(36, 900), '#6B21A8']]);
};

SCENES.S6 = (ctx, s) => {                   // the trap
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 60, '#FFFFFF', '#E63946', 44, eia(s, 0.1));
  const ts = ecue(s, 'struck'), tr = ecue(s, 'referred'), k = bounce(s.t, ts - 0.4);
  if (k > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 290); ctx.scale(k, k); ctx.translate(-W / 2, -(CAM_TOP + 290));
    exBox(ctx, 60, CAM_TOP + 210, W - 120, 160, { fill: '#FFFFFF' }); kt(ctx, 'The Supreme Court struck down the two-child rule', 100, CAM_TOP + 280, { font: F.ui(38, 900), color: INK, maxW: W - 200, lh: 46 });
    const sp = span(s.t, tr, tr + 0.4); if (sp > 0) { ctx.strokeStyle = '#E63946'; ctx.lineWidth = 8; for (const yy of [CAM_TOP + 268, CAM_TOP + 314]) { ctx.beginPath(); ctx.moveTo(95, yy); ctx.lineTo(95 + (W - 200) * sp, yy); ctx.stroke(); } }
    ctx.restore(); }
  const k2 = bounce(s.t, tr + 0.3);
  if (k2 > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 540); ctx.scale(k2, k2); ctx.translate(-W / 2, -(CAM_TOP + 540));
    exBox(ctx, 60, CAM_TOP + 410, W - 120, 260, { fill: GRN });
    kt(ctx, '✓ Only referred to a larger bench', 100, CAM_TOP + 490, { font: F.ui(42, 900), color: '#053B2C', maxW: W - 200 });
    kt(ctx, 'The 2003 ruling stands until the larger bench decides', 100, CAM_TOP + 570, { font: F.ui(34, 800), color: '#053B2C', maxW: W - 200, lh: 42 }); ctx.restore(); }
};

SCENES.S7 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS DEBATE', YEL, 84, 'mains'], ['INCENTIVES OR PENALTIES?', '#FFFFFF', 56, 'incentives']]); };
