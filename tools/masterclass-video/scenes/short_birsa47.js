// W47 Short: Birsa Munda, Dharti Aaba (Janjatiya Gaurav Divas, 15 Nov 2026). On camera, vertical.
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_birsa47.js <out> --size 1080x1920
// Rows come from the owner's pauses (the recogniser anchors few words on this take), so every build is timed as a
// fraction of its row (T(s, f)). Numbers appear at their final value; no short forms on screen.

const YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0', SKY = '#4CC9F0', RED = '#E63946', LIL = '#E9D5FF';
const T = (s, f) => s.d * f;
function pv(ctx, s, at, x, y, w, h, fill, lines) {         // a card that bounces in; lines: [[text, size, colour]]
  const k = bounce(s.t, at); if (k <= 0) return;
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 28 });
  let yy = y + 22; for (const [t, z, c] of lines) { yy += z; yy += kt(ctx, t, x + w / 2, yy, { font: F.ui(z, 900), color: c, align: 'center', maxW: w - 60, lh: z * 1.15 }) - z + z * 0.45; }
  ctx.restore();
}
function down(ctx, s, at, x, y) {                          // a short arrow that draws downwards
  const g = span(s.t, at, at + 0.4); if (g <= 0) return;
  ctx.save(); ctx.strokeStyle = YEL; ctx.fillStyle = YEL; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 44 * g); ctx.stroke();
  if (g >= 1) { ctx.beginPath(); ctx.moveTo(x - 18, y + 40); ctx.lineTo(x + 18, y + 40); ctx.lineTo(x, y + 62); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['15 NOVEMBER', YEL, 84, -1], ['JANJATIYA GAURAV DIVAS', '#FFFFFF', 60, 2.0]]); };

SCENES.S2 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHO WAS BIRSA MUNDA?', '"Dharti Aaba", Father of the Earth');
  pv(ctx, s, T(s, 0.04), 50, CAM_TOP + 200, W - 100, 400, YEL, [['Birsa Munda', 70, INK], ['Born 15 November 1875', 50, INK], ['Ulihatu, now in Jharkhand', 44, '#6B21A8'], ['Munda tribe', 44, '#6B21A8']]);
  pv(ctx, s, T(s, 0.45), 50, CAM_TOP + 650, W - 100, 330, '#FFFFFF', [['Janjatiya Gaurav Divas', 54, '#7C3AED'], ['= Tribal Pride Day, since 2021', 42, INK], ['2026: 151st birth anniversary', 44, INK]]);
};

SCENES.S3 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY DID HE RISE?');
  pv(ctx, s, T(s, 0.06), 50, CAM_TOP + 170, W - 100, 270, '#FFFFFF', [['Land taken by outsiders', 50, INK], ['moneylenders, landlords ("dikus")', 38, '#6B21A8'], ['+ forced unpaid labour', 42, RED]]);
  down(ctx, s, T(s, 0.42), W / 2, CAM_TOP + 455);
  pv(ctx, s, T(s, 0.45), 50, CAM_TOP + 530, W - 100, 210, YEL, [['ULGULAN, the Great Tumult', 52, INK], ['1899–1900', 50, INK]]);
  down(ctx, s, T(s, 0.68), W / 2, CAM_TOP + 755);
  pv(ctx, s, T(s, 0.71), 50, CAM_TOP + 830, W - 100, 200, GRN, [['Goal: land and forest', 50, INK], ['for the Munda people', 44, INK]]);
};

SCENES.S4 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'HIS STRUGGLE WON');
  const rows = [
    [0.03, '9 June 1900', 'Dies in Ranchi jail, about 24', LIL],
    [0.25, '1908', 'Chotanagpur Tenancy Act: limits transfer of tribal land', YEL],
    [0.62, '15 November 2000', 'Jharkhand formed on his birthday', GRN],
  ];
  const x0 = 120, y0 = CAM_TOP + 210, gap = 290;
  const g = span(s.t, T(s, 0.03), T(s, 0.7));
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y0 + 2 * gap * g); ctx.stroke(); ctx.restore();
  rows.forEach(([f, d, t, c], i) => {
    const at = T(s, f), k = bounce(s.t, at); if (k <= 0) return;
    const y = y0 + i * gap;
    ctx.save(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x0, y, 26 * Math.min(1, k), 0, 7); ctx.fill(); ctx.restore();
    pv(ctx, s, at, x0 + 60, y - 105, W - x0 - 110, 230, c, [[d, 52, INK], [t, 38, INK]]);
  });
};

SCENES.S5 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP · DO NOT MIX', 70, CAM_TOP + 60, '#FFFFFF', RED, 42, eia(s, 0.1));
  pv(ctx, s, T(s, 0.12), 70, CAM_TOP + 180, W - 140, 250, YEL, [['Ulgulan · 1899–1900', 52, INK], ['Mundas · led by Birsa Munda', 42, INK]]);
  pv(ctx, s, T(s, 0.38), 70, CAM_TOP + 460, W - 140, 250, '#FFFFFF', [['Santhal Hul · 1855–56', 52, INK], ['Santhals · led by Sidhu and Kanhu', 40, '#6B21A8']]);
  pv(ctx, s, T(s, 0.66), 70, CAM_TOP + 740, W - 140, 250, '#FFFFFF', [['Kol uprising · 1831–32', 52, INK], ['Chotanagpur · earlier than both', 40, '#6B21A8']]);
};

SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS QUESTION', YEL, 80, -1], ['DO TRIBAL LAWS GIVE REAL LAND CONTROL?', '#FFFFFF', 42, T(s, 0.45)]]); };
