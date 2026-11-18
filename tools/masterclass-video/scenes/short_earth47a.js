// W47 Short, Reel 1 of 2: Earthshot Prize and India (What? When? How? Where? Who from India?). On camera, vertical.
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_earth47a.js <out> --size 1080x1920
// Rows come from the owner's pauses; builds are timed as fractions of each row (T(s, f)). Numbers at their final value.

const YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', SKY = '#4CC9F0', RED = '#E63946', LIL = '#E9D5FF';
const T = (s, f) => s.d * f;
function pv(ctx, s, at, x, y, w, h, fill, lines) {         // a card that bounces in; lines: [[text, size, colour]]
  const k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 28 });
  let yy = y + 22; for (const [t, z, c] of lines) { yy += z; yy += kt(ctx, t, x + w / 2, yy, { font: F.ui(z, 900), color: c, align: 'center', maxW: w - 60, lh: z * 1.15 }) - z + z * 0.45; }
  ctx.restore();
}
function qhead(ctx, s, q) {                                 // the big question word that opens each part
  const k = bounce(s.t, 0.05); if (k <= 0) return;
  ctx.save(); ctx.translate(W / 2, CAM_TOP + 95); ctx.scale(k, k);
  kt(ctx, q, 0, 30, { font: F.ui(78, 900), color: YEL, align: 'center' }); ctx.restore();
  exLogo(ctx, W - 80, CAM_TOP + 66, 46);
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['OUR INDIAN COMPANY WINS', '#FFFFFF', 56, -1], ['THE EARTHSHOT PRIZE!', YEL, 80, 1.6]]); };

SCENES.S2 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'WHAT?  WHEN?');
  pv(ctx, s, T(s, 0.04), 50, CAM_TOP + 200, W - 100, 300, YEL, [['WHAT', 40, '#6B21A8'], ['A global award for', 50, INK], ['solutions that repair the planet', 44, INK]]);
  pv(ctx, s, T(s, 0.36), 50, CAM_TOP + 540, W - 100, 300, '#FFFFFF', [['WHEN', 40, '#6B21A8'], ['Launched 2020', 56, INK], ['Prince William + The Royal Foundation', 38, INK]]);
  pv(ctx, s, T(s, 0.7), 110, CAM_TOP + 880, W - 220, 150, SKY, [['Name from Kennedy\'s "Moonshot"', 40, INK]]);
};

SCENES.S3 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'HOW?');
  pv(ctx, s, T(s, 0.04), 50, CAM_TOP + 190, W - 100, 210, YEL, [['5 winners every year', 56, INK], ['£1 million each', 50, INK]]);
  const five = [['Protect and restore nature', GRN], ['Clean our air', SKY], ['Revive our oceans', '#7DD3FC'], ['Build a waste-free world', LIL], ['Fix our climate', '#FCA5A5']];
  five.forEach(([t, c], i) => pv(ctx, s, T(s, 0.22 + i * 0.09), 90, CAM_TOP + 430 + i * 112, W - 180, 96, c, [[t, 44, INK]]));
  pv(ctx, s, T(s, 0.8), 160, CAM_TOP + 1000, W - 320, 110, '#FFFFFF', [['Goal: 50 solutions by 2030', 40, INK]]);
};

SCENES.S4 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'WHERE?');
  pv(ctx, s, T(s, 0.04), 50, CAM_TOP + 190, W - 100, 260, YEL, [['MUMBAI · 17 November 2026', 54, INK], ['6th edition · FIRST time in India', 44, RED]]);
  const cities = [['2021', 'London'], ['2022', 'Boston'], ['2023', 'Singapore'], ['2024', 'Cape Town'], ['2025', 'Rio de Janeiro'], ['2026', 'Mumbai']];
  cities.forEach(([y, c], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    pv(ctx, s, T(s, 0.42 + i * 0.07), 60 + col * 490, CAM_TOP + 500 + row * 190, 470, 160, i === 5 ? GRN : '#FFFFFF', [[y, 40, '#6B21A8'], [c, 48, INK]]);
  });
};

SCENES.S5 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'WHO FROM INDIA?');
  pv(ctx, s, T(s, 0.08), 50, CAM_TOP + 190, W - 100, 220, '#FFFFFF', [['2021 · Takachar', 52, INK], ['crop waste into fuel, not smoke', 40, '#6B21A8']]);
  pv(ctx, s, T(s, 0.3), 50, CAM_TOP + 440, W - 100, 220, '#FFFFFF', [['2022 · Kheyti, Hyderabad', 52, INK], ['low-cost greenhouses for farmers', 40, '#6B21A8']]);
  pv(ctx, s, T(s, 0.58), 50, CAM_TOP + 690, W - 100, 230, YEL, [['2026 · Mahindra Last Mile Mobility', 46, INK], ['Clean Our Air · 4 lakh+ electric autos', 40, INK]]);
  pv(ctx, s, T(s, 0.85), 90, CAM_TOP + 950, W - 180, 140, GRN, [['Most winners + finalists of any country', 38, INK]]);
};

SCENES.S6 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 60, '#FFFFFF', RED, 44, eia(s, 0.1));
  pv(ctx, s, T(s, 0.06), 70, CAM_TOP + 190, W - 140, 330, '#FFFFFF', [['Earthshot Prize', 60, INK], ['NOT a United Nations award', 46, RED], ['Prince William\'s prize', 42, '#6B21A8']]);
  pv(ctx, s, T(s, 0.45), 70, CAM_TOP + 560, W - 140, 330, YEL, [['United Nations\' top green honour', 44, INK], ['Champions of the Earth', 58, INK], ['United Nations Environment Programme', 36, '#6B21A8']]);
};

SCENES.S7 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['NEXT REEL', YEL, 80, -1], ['THE 5 WINNERS: WHAT THEY DID', '#FFFFFF', 50, T(s, 0.55)]]); };
