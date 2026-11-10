// W46 Short: World Bank Poverty and Equity Brief (October 2026). On camera, vertical.
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_poverty46.js <out> --size 1080x1920
// The take (10 Nov) aligns poorly with the recogniser, so builds use fixed times inside each row (rows are set from
// the owner's pauses). Numbers appear at their final value; no short forms on screen.

const YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', PNK = '#F9A8D4', SKY = '#4CC9F0';
function pv(ctx, s, at, x, y, w, h, fill, lines) {         // a card that bounces in; lines: [[text, size, colour]]
  const k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 30 });
  let yy = y + 26; for (const [t, z, c] of lines) { yy += z; yy += kt(ctx, t, x + w / 2, yy, { font: F.ui(z, 900), color: c, align: 'center', maxW: w - 60, lh: z * 1.15 }) - z + z * 0.4; }
  ctx.restore();
}
function bars(ctx, s, at, data, base, unit) {               // vertical bars that grow to their final value, labels inside
  data.forEach(([yr, v, lab, fill], i) => {
    const g = span(s.t, at + i * 0.8, at + i * 0.8 + 0.7); if (g <= 0) return;
    const x = 170 + i * 420, h = Math.max(70, v * unit) * easeOut(g);
    exBox(ctx, x, base - h, 300, h, { fill, r: 18 });
    if (g >= 1) kt(ctx, lab, x + 150, base - h + 62, { font: F.ui(56, 900), color: INK, align: 'center' });
    kt(ctx, yr, x + 150, base + 52, { font: F.ui(40, 900), color: '#FFFFFF', align: 'center', alpha: Math.min(1, g * 2) });
  });
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['~50 CRORE INDIANS', YEL, 86, -1], ['OUT OF POVERTY? HOW?', '#FFFFFF', 58, 3.0]]); };

SCENES.S2 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WORLD BANK · OCTOBER 2026', 'Extreme poverty in India ($3 a day)');
  bars(ctx, s, 1.0, [['2011', 27.1, '27.1%', '#E9D5FF'], ['2023', 2.6, '2.6%', YEL]], CAM_TOP + 900, 22);
  kt(ctx, 'Source: World Bank Poverty and Equity Brief, October 2026', 60, 1880, { font: F.ui(26, 700), color: '#E9D5FF', alpha: eia(s, 3) });
};

SCENES.S3 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHAT IS "$3 A DAY"?');
  pv(ctx, s, 3.0, 50, CAM_TOP + 170, W - 100, 300, YEL, [['International poverty line', 46, INK], ['$2.15 → $3.00 a day', 72, INK], ['(raised in 2025)', 36, '#6B21A8']]);
  pv(ctx, s, 9.0, 50, CAM_TOP + 530, W - 100, 300, '#FFFFFF', [['Purchasing power parity', 50, '#7C3AED'], ['= what money actually buys in each country', 40, INK]]);
};

SCENES.S4 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE $4.20 A DAY LINE', 'For lower-middle-income countries');
  bars(ctx, s, 1.5, [['2011', 57.7, '57.7%', '#E9D5FF'], ['2023', 16.1, '16.1%', GRN]], CAM_TOP + 860, 11);
  pv(ctx, s, 6.0, 60, CAM_TOP + 930, W - 120, 120, SKY, [['≈ 49.6 crore people crossed this line', 40, INK]]);
};

SCENES.S5 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 60, '#FFFFFF', '#E63946', 44, eia(s, 0.1));
  pv(ctx, s, 1.5, 70, CAM_TOP + 190, W - 140, 220, '#FFFFFF', [['World Bank', 56, INK], ['= income and spending poverty', 42, '#6B21A8']]);
  pv(ctx, s, 6.0, 70, CAM_TOP + 450, W - 140, 520, YEL, [['Multidimensional Poverty Index', 46, INK], ['health · education · living standards', 38, '#6B21A8'], ['Global: United Nations Development Programme + Oxford', 38, INK], ['India: NITI Aayog', 44, INK]]);
};

SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS QUESTION', YEL, 80, -1], ['DOES CROSSING A LINE END POVERTY?', '#FFFFFF', 46, 2.5]]); };
