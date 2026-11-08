// W45 promo Short: "Agnipath scrapped? Full class tonight, 6 PM" (on camera, 8 Nov 2026).
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_promo45.js <out> --size 1080x1920
// A teaser: it asks the questions and does not give away the answers. No short forms on screen.

const YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', PNK = '#F9A8D4', SKY = '#4CC9F0';
function pcard(ctx, s, at, x, y, w, h, fill, lines) {      // a card that bounces in; lines: [[text, size, colour]]
  const k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 30 });
  let yy = y + 30; for (const [t, z, c] of lines) { yy += z; kt(ctx, t, x + w / 2, yy, { font: F.ui(z, 900), color: c, align: 'center', maxW: w - 60, lh: z * 1.15 }); yy += z * 0.35; }
  ctx.restore();
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['AGNIPATH SCRAPPED?', YEL, 84, -1], ['NO! BUT SOMETHING CHANGED', '#FFFFFF', 54, 2.6]]); };

// Timed to the owner's own words (8 Nov take), found by pauses and keyword spotting:
// arrest clock 7.2–19.5 s, "cancer medicines" at about 22 s, the "fifteen"s at about 29.5, 31.2 and 34.3 s.
SCENES.S2 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'ARREST OR DETENTION?');
  pcard(ctx, s, 0.4, 50, CAM_TOP + 170, W - 100, 330, '#FFFFFF', [['When does your', 52, INK], ['24-hour clock start?', 72, '#7C3AED']]);
  pcard(ctx, s, 5.5, 50, CAM_TOP + 560, W - 100, 200, YEL, [['The Supreme Court answered', 46, INK], ['→ tonight, 6 PM', 46, INK]]);
};
SCENES.S3 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'CANCER MEDICINES');
  pcard(ctx, s, 2.3, 50, CAM_TOP + 170, W - 100, 380, GRN, [['UP TO', 56, '#053B2C'], ['70% CHEAPER?', 110, '#053B2C']]);
  pcard(ctx, s, 4.3, 50, CAM_TOP + 610, W - 100, 170, '#FFFFFF', [['How? Find out tonight', 54, INK]]);
};

SCENES.S4 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THIS ONE WEEK');
  [['15 TOPICS', 4.0, YEL], ['15 PRACTICE MCQs', 5.7, SKY], ['15 EXAM TRAPS', 8.8, PNK]].forEach(([t, at, c], i) =>
    pcard(ctx, s, at, 70, CAM_TOP + 160 + i * 300, W - 140, 250, c, [[t, 80, INK]]));
};

SCENES.S5 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['TONIGHT · 6 PM', YEL, 96, -1], ['FULL CLASS · ENGLISH + TELUGU', '#FFFFFF', 46, 0.8]]); };
