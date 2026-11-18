// W47 Short, Reel 2 of 2: Earthshot 2026, the five winners and what they did. On camera, vertical.
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_earth47c.js <out> --size 1080x1920
// Rows come from a Whisper transcript of the owner's take plus its pauses; builds are fractions of each row.
// Each winner card is laid out as WHO (name, category) → WHAT THEY DID → HOW IT HELPS. Numbers at their final value.

const YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', SKY = '#4CC9F0', RED = '#E63946', LIL = '#E9D5FF';
const T = (s, f) => s.d * f;
function pv(ctx, s, at, x, y, w, h, fill, lines) {
  const k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 28 });
  let yy = y + 22; for (const [t, z, c] of lines) { yy += z; yy += kt(ctx, t, x + w / 2, yy, { font: F.ui(z, 900), color: c, align: 'center', maxW: w - 60, lh: z * 1.15 }) - z + z * 0.45; }
  ctx.restore();
}
function winner(ctx, s, n, name, cat, catCol, did, helps, f = [0.04, 0.3, 0.68]) {
  vBase(ctx); camSpace(ctx, CAM_TOP);
  const k = bounce(s.t, 0.05);
  if (k > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 95); ctx.scale(k, k);
    kt(ctx, `WINNER ${n} OF 5`, 0, 26, { font: F.ui(56, 900), color: YEL, align: 'center' }); ctx.restore(); }
  exLogo(ctx, W - 80, CAM_TOP + 66, 46);
  pv(ctx, s, T(s, f[0]), 50, CAM_TOP + 170, W - 100, name.length > 24 ? 290 : 240, catCol, [['WHO', 32, '#6B21A8'], [name, 56, INK], [cat, 38, INK]]);
  pv(ctx, s, T(s, f[1]), 50, CAM_TOP + 490, W - 100, 320, '#FFFFFF', [['WHAT THEY DID', 32, '#6B21A8'], ...did.map(t => [t, 40, INK])]);
  pv(ctx, s, T(s, f[2]), 50, CAM_TOP + 840, W - 100, 60 + helps.length * 70, GRN, [['HOW IT HELPS', 32, INK], ...helps.map(t => [t, 40, INK])]);
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['EARTHSHOT 2026 · 5 WINNERS', YEL, 66, -1], ['WHO? WHAT THEY DID? HOW IT HELPS?', '#FFFFFF', 46, T(s, 0.55)]]); };

SCENES.S2 = (ctx, s) => winner(ctx, s, 1, 'Bhutan', 'Protect and Restore Nature', '#BBF7D0',
  ['First COUNTRY ever to win', 'Restore Bhutan: 50,000 hectares', 'of damaged Himalayan land'],
  ['~2 million tonnes of carbon dioxide saved', 'Water for 1.6 billion people downstream,', 'including India'], [0.04, 0.22, 0.6]);

SCENES.S3 = (ctx, s) => winner(ctx, s, 2, 'Mahindra Last Mile Mobility (India)', 'Clean Our Air', SKY,
  ['Electric autos cheap to buy', 'and cheap to run', 'for ordinary drivers'],
  ['4 lakh+ electric vehicles on Indian roads', 'Less smoke in crowded cities'], [0.04, 0.3, 0.62]);

SCENES.S4 = (ctx, s) => winner(ctx, s, 3, 'Niue · Pacific island', 'Revive Our Oceans', '#7DD3FC',
  ['Only about 1,700 people', 'Ocean Wide Trust: a new way', 'of investing in conservation'],
  ['Protects an ocean area', 'larger than the United Kingdom'], [0.04, 0.25, 0.6]);

SCENES.S5 = (ctx, s) => winner(ctx, s, 4, 'PFAS-Free France', 'Build a Waste-Free World', LIL,
  ['PFAS = "forever chemicals"', 'non-stick pans · waterproof clothes', '· food packaging'],
  ['1.4 lakh+ citizens backed it', '2025 French law to phase them out'], [0.04, 0.25, 0.62]);

SCENES.S6 = (ctx, s) => winner(ctx, s, 5, 'Ørsted · Denmark', 'Fix Our Climate', '#FCA5A5',
  ['Once an oil, gas and coal company', 'Quit oil and gas'],
  ['Became an offshore-wind giant', '"Change is possible"'], [0.04, 0.28, 0.6]);

SCENES.S7 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP · 3 CONVENTIONS', 70, CAM_TOP + 60, '#FFFFFF', RED, 40, eia(s, 0.1));
  pv(ctx, s, T(s, 0.04), 70, CAM_TOP + 180, W - 140, 270, YEL, [['STOCKHOLM', 56, INK], ['persistent organic pollutants', 38, INK], ['some forever chemicals · India is a party', 34, '#6B21A8']]);
  pv(ctx, s, T(s, 0.4), 70, CAM_TOP + 480, W - 140, 240, '#FFFFFF', [['ROTTERDAM', 56, INK], ['consent before trading hazardous chemicals', 34, '#6B21A8']]);
  pv(ctx, s, T(s, 0.7), 70, CAM_TOP + 750, W - 140, 240, '#FFFFFF', [['BASEL', 56, INK], ['hazardous waste crossing borders', 36, '#6B21A8']]);
};

SCENES.S8 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS QUESTION', YEL, 80, -1], ['CAN INDIA\'S COAL POWER DO AN ØRSTED?', '#FFFFFF', 46, 1.5]]); };
