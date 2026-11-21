// W47 preface reel ("This Sunday's class"), cut from the owner's weekly camera takes. Vertical, camera in the top 760 px.
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_preface47.js <out> --size 1080x1920
// Builds are timed in seconds from the start of each row (where she names each item).
const YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', SKY = '#4CC9F0', RED = '#E63946', LIL = '#E9D5FF';
function pv(ctx, s, at, x, y, w, h, fill, lines) {
  const k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 28 });
  let yy = y + 22; for (const [t, z, c] of lines) { yy += z; yy += kt(ctx, t, x + w / 2, yy, { font: F.ui(z, 900), color: c, align: 'center', maxW: w - 60, lh: z * 1.15 }) - z + z * 0.45; }
  ctx.restore();
}
function head(ctx, s, t) {
  const k = bounce(s.t, 0.05); if (k > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 92); ctx.scale(k, k);
    kt(ctx, t, 0, 26, { font: F.ui(66, 900), color: YEL, align: 'center' }); ctx.restore(); }
  exLogo(ctx, W - 80, CAM_TOP + 66, 46);
}

SCENES.S1 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); head(ctx, s, 'THIS WEEK IN THE NEWS');
  pv(ctx, s, 0.3, 50, CAM_TOP + 175, W - 100, 200, YEL, [['WORLD COURT: GENOCIDE', 50, INK], ['Myanmar guilty · a first', 40, '#6B21A8']]);
  pv(ctx, s, 7.3, 50, CAM_TOP + 400, W - 100, 200, '#FFFFFF', [['AMERICA · RUSSIA · CHINA', 50, INK], ['at one table', 40, '#6B21A8']]);
  pv(ctx, s, 14.4, 50, CAM_TOP + 625, W - 100, 200, SKY, [['CYCLONE AKVAN', 50, INK], ['crossed our coast', 40, INK]]);
  pv(ctx, s, 18.0, 50, CAM_TOP + 850, W - 100, 200, GRN, [['EARTHSHOT PRIZE', 50, INK], ['an Indian company wins', 40, INK]]);
};

SCENES.S2 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); head(ctx, s, '12 STORIES THIS WEEK');
  const rows = [[1.6, '5', 'on the world stage', SKY], [3.4, '4', 'Indian law, economy & security', YEL], [5.4, '3', 'from environment', GRN]];
  rows.forEach(([at, n, t, c], i) => {
    const k = bounce(s.t, at); if (k <= 0) return; const y = CAM_TOP + 180 + i * 215;
    ctx.save(); ctx.translate(W / 2, y + 95); ctx.scale(k, k); ctx.translate(-W / 2, -(y + 95));
    exBox(ctx, 50, y, W - 100, 190, { fill: c, r: 28 });
    kt(ctx, n, 150, y + 132, { font: F.ui(120, 900), color: INK, align: 'center' });
    kt(ctx, t, 600, y + 112, { font: F.ui(46, 900), color: INK, align: 'center', maxW: 700 });
    ctx.restore();
  });
  pv(ctx, s, 7.6, 50, CAM_TOP + 840, W - 100, 210, '#FFFFFF', [['+ important days', 44, INK], ['persons & places in news', 44, '#6B21A8']]);
};

SCENES.S3 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); head(ctx, s, 'WITH EVERY STORY');
  pv(ctx, s, 0.3, 110, CAM_TOP + 175, W - 220, 150, LIL, [['DECODE UPSC with Mounika', 46, INK]]);
  pv(ctx, s, 5.6, 50, CAM_TOP + 360, W - 100, 190, YEL, [['DATA POINTS', 60, INK]]);
  pv(ctx, s, 6.6, 50, CAM_TOP + 580, W - 100, 190, SKY, [['DIAGRAMS', 60, INK]]);
  pv(ctx, s, 7.6, 50, CAM_TOP + 800, W - 100, 250, GRN, [['PRACTICE QUESTIONS', 58, INK], ['for every current affair', 40, INK]]);
};

SCENES.S4 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); exLogo(ctx, W - 80, CAM_TOP + 66, 46);
  pv(ctx, s, 0.1, 50, CAM_TOP + 140, W - 100, 560, YEL, [['FULL CLASS', 72, INK], ['SUNDAY · 22 NOVEMBER', 62, INK], ['6 PM', 120, RED], ['on YouTube', 46, '#6B21A8']]);
  pv(ctx, s, 0.9, 110, CAM_TOP + 760, W - 220, 230, '#FFFFFF', [['DECODE UPSC', 58, INK], ['with Mounika', 44, '#6B21A8']]);
};
