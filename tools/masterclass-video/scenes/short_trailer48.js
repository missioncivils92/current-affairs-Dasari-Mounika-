// W48 trailer reel from the owner's own vertical take (28 Nov 2026). Needs short_kit.js:
// node render.js <assets> <tl> scenes/short_kit.js,scenes/short_trailer48.js <out> --size 1080x1920
const YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', SKY = '#4CC9F0', RED = '#E63946', LIL = '#E9D5FF';
const T = (s, f) => s.d * f;
function pv(ctx, s, at, x, y, w, h, fill, lines) {
  const k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 28 });
  let yy = y + 22; for (const [t, z, c] of lines) { yy += z; yy += kt(ctx, t, x + w / 2, yy, { font: F.ui(z, 900), color: c, align: 'center', maxW: w - 60, lh: z * 1.15 }) - z + z * 0.45; }
  ctx.restore();
}
function qhead(ctx, s, q) { const k = bounce(s.t, 0.05); if (k > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 90); ctx.scale(k, k); kt(ctx, q, 0, 28, { font: F.ui(64, 900), color: YEL, align: 'center' }); ctx.restore(); } exLogo(ctx, W - 80, CAM_TOP + 66, 46); }

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['NOVEMBER 4th WEEK', YEL, 80, -1], ['THE BIG STORIES', '#FFFFFF', 56, 1.4]]); };
SCENES.S2 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'STORY 1 · TRADE');
  pv(ctx, s, T(s, 0.05), 50, CAM_TOP + 190, W - 100, 420, YEL, [['AMERICA', 50, INK], ['up to 25%', 120, RED], ['tariff on Indian goods', 46, INK], ['proposed · Section 301', 36, '#6B21A8']]);
  pv(ctx, s, T(s, 0.6), 50, CAM_TOP + 660, W - 100, 260, SKY, [['CLIMATE SUMMIT', 44, INK], ['COP31 · Antalya, Türkiye', 46, INK]]); };
SCENES.S3 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'STORIES 2 & 3');
  pv(ctx, s, T(s, 0.05), 50, CAM_TOP + 190, W - 100, 330, '#FFD9DC', [['COP31', 64, INK], ['ended with NO DEAL', 52, RED], ['first since Copenhagen 2009', 36, '#6B21A8']]);
  pv(ctx, s, T(s, 0.5), 50, CAM_TOP + 570, W - 100, 330, '#FFFFFF', [["NEPAL'S PRIME MINISTER", 46, INK], ['in Delhi · 8 MoUs', 50, INK], ['22–23 November', 36, '#6B21A8']]); };
SCENES.S4 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, 'STORY 4 · SPACE');
  pv(ctx, s, T(s, 0.05), 50, CAM_TOP + 190, W - 100, 360, YEL, [["PAKISTAN'S FIRST ASTRONAUT", 46, INK], ["→ China's Tiangong", 60, INK], ['Shenzhou-24 · 25 Nov', 36, '#6B21A8']]);
  pv(ctx, s, T(s, 0.55), 50, CAM_TOP + 600, W - 100, 330, GRN, [['WHY INDIA MUST WATCH', 44, INK], ['China + Pakistan in space', 44, INK], ['India: Gaganyaan next', 40, INK]]); };
SCENES.S5 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_TOP); qhead(ctx, s, '12 STORIES THIS WEEK');
  const L = ['US tariff', 'Nepal PM', 'COP31', 'Asia Power Index', "Pak astronaut", 'Hormuz + Vizag', 'Machines scheme', 'Nitish Setu', 'Constitution Day', 'Lachit · Guru', 'Child marriage', 'Persons & places'];
  L.forEach((t, i) => { const c = i % 2, r = Math.floor(i / 2); pv(ctx, s, T(s, 0.04 + i * 0.05), 50 + c * 500, CAM_TOP + 180 + r * 140, 480, 120, [YEL, '#FFFFFF', SKY, LIL][i % 4], [[(i + 1) + '. ' + t, 36, INK]]); }); };
SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['FULL CLASS', YEL, 84, -1], ['SUNDAY · 6 PM · YouTube', '#FFFFFF', 56, 1.0]]); };
