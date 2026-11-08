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

// The take does not follow the script word for word, so S2 and S3 show both questions together (order-free)
function bigQs(ctx, s) {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, "THIS WEEK'S BIG QUESTIONS");
  pcard(ctx, s, 0.2, 50, CAM_TOP + 160, W - 100, 330, '#FFFFFF', [['Arrest or detention?', 50, INK], ['When does your 24-hour clock start?', 56, '#7C3AED']]);
  pcard(ctx, s, 0.9, 50, CAM_TOP + 530, W - 100, 330, GRN, [['Cancer medicines', 50, '#053B2C'], ['up to 70% cheaper?', 76, '#053B2C']]);
  kt(ctx, 'Answers tonight · 6 PM', W / 2, 1860, { font: F.ui(44, 900), color: YEL, align: 'center', alpha: eia(s, 1.6) });
}
SCENES.S2 = bigQs; SCENES.S3 = (ctx, s) => bigQs(ctx, Object.assign({}, s, { t: s.t + 5 }));   // continues S2 without a second pop

SCENES.S4 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THIS ONE WEEK');
  [['15 STORIES', 'stories', YEL], ['15 EXAM TRAPS', 'traps', PNK], ['15 PRACTICE MCQs', 'practice', SKY]].forEach(([t, cw, c], i) =>
    pcard(ctx, s, 0.3 + i * 1.2, 70, CAM_TOP + 160 + i * 300, W - 140, 250, c, [[t, 80, INK]]));
};

SCENES.S5 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['TONIGHT · 6 PM', YEL, 96, -1], ['FULL CLASS · ENGLISH + TELUGU', '#FFFFFF', 46, 0.8]]); };
