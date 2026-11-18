// W47 Short, Reel 1 of 2, AS RECORDED (18 Nov 2026): the owner spoke in her own words and order
// (What → When → Where → How → Who from India → trap → Mains). Rows come from a Whisper transcript of the take plus
// its pauses (02b-as-recorded-script.md); builds are fractions of each row, keyed to where she says each item.
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_earth47b.js <out> --size 1080x1920

const YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', SKY = '#4CC9F0', RED = '#E63946', LIL = '#E9D5FF';
const T = (s, f) => s.d * f;
function pv(ctx, s, at, x, y, w, h, fill, lines) {
  const k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 28 });
  let yy = y + 22; for (const [t, z, c] of lines) { yy += z; yy += kt(ctx, t, x + w / 2, yy, { font: F.ui(z, 900), color: c, align: 'center', maxW: w - 60, lh: z * 1.15 }) - z + z * 0.45; }
  ctx.restore();
}
function qhead(ctx, s, q) {
  const k = bounce(s.t, 0.05); if (k <= 0) return;
  ctx.save(); ctx.translate(W / 2, CAM_TOP + 95); ctx.scale(k, k);
  kt(ctx, q, 0, 30, { font: F.ui(78, 900), color: YEL, align: 'center' }); ctx.restore();
  exLogo(ctx, W - 80, CAM_TOP + 66, 46);
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['OUR INDIAN COMPANY WINS', '#FFFFFF', 56, -1], ['THE EARTHSHOT PRIZE!', YEL, 80, 1.6]]); };

SCENES.S2 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'WHAT?');
  pv(ctx, s, T(s, 0.08), 50, CAM_TOP + 230, W - 100, 330, YEL, [['Earthshot Prize', 64, INK], ['a global award for solutions', 46, INK], ['that repair the planet', 46, INK]]);
  pv(ctx, s, T(s, 0.5), 110, CAM_TOP + 620, W - 220, 160, '#FFFFFF', [['£1 million for each winner', 42, '#6B21A8']]);
};

SCENES.S3 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'WHEN?');
  pv(ctx, s, T(s, 0.05), 50, CAM_TOP + 230, W - 100, 300, '#FFFFFF', [['Launched 2020', 66, INK], ['Prince William + The Royal Foundation', 40, '#6B21A8']]);
  pv(ctx, s, T(s, 0.55), 90, CAM_TOP + 590, W - 180, 230, SKY, [['Inspired by', 40, INK], ['President Kennedy\'s "Moonshot"', 46, INK]]);
};

SCENES.S4 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'WHERE?');
  pv(ctx, s, T(s, 0.12), 50, CAM_TOP + 190, W - 100, 260, YEL, [['MUMBAI · 17 November 2026', 54, INK], ['6th edition · FIRST time in India', 44, RED]]);
  const cities = [['2021', 'London'], ['2022', 'Boston'], ['2023', 'Singapore'], ['2024', 'Cape Town'], ['2025', 'Rio de Janeiro'], ['2026', 'Mumbai']];
  cities.forEach(([y, c], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    pv(ctx, s, T(s, 0.46 + i * 0.07), 60 + col * 490, CAM_TOP + 500 + row * 190, 470, 160, i === 5 ? GRN : '#FFFFFF', [[y, 40, '#6B21A8'], [c, 48, INK]]);
  });
};

SCENES.S5 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'HOW?');
  pv(ctx, s, T(s, 0.12), 50, CAM_TOP + 190, W - 100, 210, YEL, [['5 categories · 5 winners a year', 50, INK], ['£1 million each', 46, INK]]);
  const five = [['Clean our air', SKY], ['Revive our oceans', '#7DD3FC'], ['Build a waste-free world', LIL], ['Fix our climate', '#FCA5A5'], ['Protect and restore nature', GRN]];
  five.forEach(([t, c], i) => pv(ctx, s, T(s, 0.36 + i * 0.12), 90, CAM_TOP + 440 + i * 116, W - 180, 100, c, [[t, 44, INK]]));
};

SCENES.S6 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'WHO FROM INDIA?');
  pv(ctx, s, T(s, 0.05), 50, CAM_TOP + 190, W - 100, 230, '#FFFFFF', [['2021 · Takachar', 52, INK], ['farm residue into fuel, not smoke', 40, '#6B21A8']]);
  pv(ctx, s, T(s, 0.37), 50, CAM_TOP + 450, W - 100, 230, '#FFFFFF', [['2022 · Kheyti, Hyderabad', 52, INK], ['affordable greenhouses for farmers', 40, '#6B21A8']]);
  pv(ctx, s, T(s, 0.56), 50, CAM_TOP + 710, W - 100, 230, YEL, [['2026 · Mahindra Last Mile Mobility', 46, INK], ['Clean Our Air · affordable electric autos', 38, INK]]);
  pv(ctx, s, T(s, 0.9), 150, CAM_TOP + 970, W - 300, 130, GRN, [['4 lakh+ users', 48, INK]]);
};

SCENES.S7 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 60, '#FFFFFF', RED, 44, eia(s, 0.1));
  pv(ctx, s, T(s, 0.08), 70, CAM_TOP + 190, W - 140, 330, '#FFFFFF', [['Earthshot Prize', 60, INK], ['NOT given by the United Nations', 44, RED], ['Prince William\'s prize', 42, '#6B21A8']]);
  pv(ctx, s, T(s, 0.48), 70, CAM_TOP + 560, W - 140, 330, YEL, [['United Nations\' own prize', 44, INK], ['Champions of the Earth', 58, INK], ['United Nations Environment Programme', 36, '#6B21A8']]);
};

SCENES.S8 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS QUESTION', YEL, 80, -1], ['DO THESE INNOVATIONS REALLY WORK?', '#FFFFFF', 48, 1.2]]); };
