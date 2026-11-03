// W45 Short: green crackers — the SC order of 2 Nov 2026 (Delhi-NCR), what makes a cracker green, who checks it,
// and Article 25 vs Article 21. Needs short_kit.js:
//   node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_green.js <out> --size 1080x1920
// The owner's newspaper photo is NOT used (CLAUDE.md §6.2/§6.4, decision 40): the news is our own clipping, credited.

const GRN = '#06D6A0', GDK = '#053B2C';
function pill(ctx, s, t, x, y, at, fill, ink, size = 38) {
  const k = bounce(s.t, at); if (k <= 0) return 0;
  ctx.save(); ctx.font = F.ui(size, 900); const w = ctx.measureText(t).width + 60; ctx.restore();
  ctx.save(); ctx.translate(x + w / 2, y + 42); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 42));
  exBox(ctx, x, y, w, 84, { fill, r: 42 }); kt(ctx, t, x + 30, y + 42 + size * 0.36, { font: F.ui(size, 900), color: ink }); ctx.restore();
  return w;
}
function sparks(ctx, x, y, t, a) {          // a short burst of coloured sparks behind the hook band (motion, not decoration-only)
  if (a <= 0) return; const cols = ['#FFD60A', GRN, '#FF6B6B', '#4CC9F0', '#F9A8D4'];
  ctx.save(); ctx.globalAlpha = a;
  for (let i = 0; i < 26; i++) { const ang = i / 26 * Math.PI * 2, r = 10 + ((t * 120 + i * 13) % 100), al = 1 - r / 120;
    ctx.globalAlpha = a * Math.max(0, al); ctx.fillStyle = cols[i % 5]; ctx.beginPath(); ctx.arc(x + Math.cos(ang) * r, y + Math.sin(ang) * r * 0.6, 7, 0, 7); ctx.fill(); }
  ctx.restore();
}

SCENES.S1 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_FACE);
  band(ctx, s, [['GREEN CRACKERS?', GRN, 92, -1], ['WHAT UPSC WILL ASK', '#FFFFFF', 62, -0.8]]);   // from frame 1: the thumbnail
  sparks(ctx, 110, CAM_FACE + 330, s.t, 0.9); sparks(ctx, W - 110, CAM_FACE + 330, s.t + 0.5, 0.9);
};

SCENES.S2 = (ctx, s) => {                   // why in news: the order, its windows, and the 300 m ring
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY IN NEWS');
  clipV(ctx, 50, CAM_TOP + 110, W - 100, 400, bounce(s.t, 0.1), '2 NOVEMBER 2026 · SUPREME COURT', 'Supreme Court permits certified green crackers in Delhi-National Capital Region for two days', 'The Hindu · Asian News International · Hans India', -0.03);
  pill(ctx, s, 'ONLY CERTIFIED GREEN', 60, CAM_TOP + 545, ecue(s, 'certified'), GRN, GDK);
  pill(ctx, s, 'NOVEMBER 7 & 8', 560, CAM_TOP + 545, ecue(s, 'seventh'), '#FFD60A', '#1B0B45');
  pill(ctx, s, '6–7 MORNING', 60, CAM_TOP + 650, ecue(s, 'morning'), '#4CC9F0', '#062A3A');
  pill(ctx, s, '8–10 NIGHT', 400, CAM_TOP + 650, ecue(s, 'night'), '#F9A8D4', '#4A0D2E');
  const th = ecue(s, 'hundred'), g = span(s.t, th, th + 0.8);
  if (g > 0) {                              // the ring draws itself around the protected centre
    const cx = W / 2 - 80, cy = CAM_TOP + 930, R = 140;
    ctx.save(); ctx.strokeStyle = '#E9D5FF'; ctx.setLineDash([16, 12]); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + g * Math.PI * 2); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.globalAlpha = g; exBox(ctx, cx - 125, cy - 45, 250, 90, { fill: '#FFFFFF', r: 20 });
    kt(ctx, 'NO CRACKERS', cx, cy + 11, { font: F.ui(28, 900), color: '#1B0B45', align: 'center' });
    kt(ctx, '300 metres', cx + R + 20, cy - 10, { font: F.ui(48, 900), color: '#FFD60A' });
    kt(ctx, 'hospitals · schools', cx + R + 20, cy + 36, { font: F.ui(26, 800), color: '#E9D5FF' });
    kt(ctx, 'silence zones', cx + R + 20, cy + 68, { font: F.ui(26, 800), color: '#E9D5FF' }); ctx.restore();
  }
};

SCENES.S3 = (ctx, s) => {                   // what makes a cracker green
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHAT MAKES IT GREEN?');
  card(ctx, 50, CAM_TOP + 110, W - 100, 230, GRN, bounce(s.t, ecue(s, 'environmental')), [['National Environmental Engineering Research Institute, Nagpur', F.ui(40, 900), GDK], ['a Council of Scientific and Industrial Research laboratory · designed them in 2018–19', F.ui(28, 800), GDK]]);
  pill(ctx, s, '✗ Barium nitrate', 60, CAM_TOP + 370, ecue(s, 'barium'), '#FFFFFF', '#1B0B45');
  pill(ctx, s, '≈30% less emissions', 470, CAM_TOP + 370, ecue(s, 'thirty'), '#FFD60A', '#1B0B45');
  const T = [['SWAS', 'Safe Water Releaser', '#4CC9F0', '#062A3A'], ['STAR', 'Safe Thermite Cracker', '#FFD60A', '#1B0B45'], ['SAFAL', 'Safe Minimal Aluminium', '#F9A8D4', '#4A0D2E']];
  const ts = ecue(s, 'swas');
  T.forEach(([n, f, fill, ink], i) => {
    const x = 50 + i * 333, y = CAM_TOP + 490, k = bounce(s.t, ts + i * 0.35); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 155, y + 130); ctx.scale(k, k); ctx.translate(-(x + 155), -(y + 130));
    exBox(ctx, x, y, 310, 260, { fill, r: 26 });
    kt(ctx, n, x + 155, y + 110, { font: F.ui(64, 900), color: ink, align: 'center' });
    kt(ctx, f, x + 155, y + 170, { font: F.ui(28, 800), color: ink, align: 'center', maxW: 270, lh: 34 }); ctx.restore();
  });
  pill(ctx, s, 'Green logo + Quick Response code = genuine', 60, CAM_TOP + 790, ecue(s, 'quick'), '#FFFFFF', GDK, 34);
  kt(ctx, 'Emission cut varies by type and test (≈30–35%)', 64, 1880, { font: F.ui(26, 700), color: '#E9D5FF', alpha: eia(s, ecue(s, 'thirty') + 0.6) });
};

function photoFrame(ctx, key, x, y, w, h, k) {   // a licensed photo with its credit, when one is in <assets>/photos
  const img = A[key]; if (!img || k <= 0) return false;
  ctx.save(); ctx.globalAlpha = Math.min(1, k); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(x - 6, y - 6, w + 12, h + 12);
  const sc = Math.max(w / img.width, h / img.height), sw = w / sc, sh = h / sc;
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
  const cr = (A[key + '_meta'] || {}).credit; if (cr) kt(ctx, cr, x, y + h + 26, { font: F.ui(18, 700), color: '#E9D5FF', maxW: w });
  ctx.restore(); return true;
}
function instCard(ctx, y, h, fill, ink, k, lines, imgKey) {
  if (k <= 0) return; const hasImg = !!A[imgKey], tw = hasImg ? W - 100 - 340 : W - 180;
  ctx.save(); ctx.translate(W / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-W / 2, -(y + h / 2));
  exBox(ctx, 50, y, W - 100, h, { fill, r: 26 }); let yy = y + 62;
  for (const [t, px, c] of lines) { yy += kt(ctx, t, 90, yy, { font: F.ui(px, 900), color: c || ink, maxW: tw, lh: px * 1.15 }) + px * 0.3; }
  ctx.restore();
  photoFrame(ctx, imgKey, W - 50 - 310, y + 25, 280, h - 70, k);
}

SCENES.S4 = (ctx, s) => {                   // who checks: the Nagpur institute certifies, the Safety Organisation licenses
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHO CHECKS?', 'The court order names both');
  instCard(ctx, CAM_TOP + 180, 300, GRN, GDK, bounce(s.t, ecue(s, 'certifies')), [['National Environmental Engineering Research Institute', 40], ['Certifies the formula', 38, '#1B0B45'], ['Council of Scientific and Industrial Research · Ministry of Science and Technology', 24]], 'inst_neeri');
  const tp = ecue(s, 'petroleum'), ga = span(s.t, tp - 0.4, tp);
  if (ga > 0) { ctx.save(); ctx.strokeStyle = '#FFD60A'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(W / 2, CAM_TOP + 490); ctx.lineTo(W / 2, CAM_TOP + 490 + 40 * ga); ctx.stroke();
    if (ga >= 1) { ctx.fillStyle = '#FFD60A'; ctx.beginPath(); ctx.moveTo(W / 2 - 22, CAM_TOP + 525); ctx.lineTo(W / 2 + 22, CAM_TOP + 525); ctx.lineTo(W / 2, CAM_TOP + 553); ctx.fill(); } ctx.restore(); }
  instCard(ctx, CAM_TOP + 565, 330, '#FFD60A', '#1B0B45', bounce(s.t, tp), [['Petroleum and Explosives Safety Organisation', 42], ['Licenses the makers', 38], ['Department for Promotion of Industry and Internal Trade, Commerce Ministry · Explosives Act, 1884', 24, '#6B21A8']], 'inst_peso');
  const tt = ecue(s, 'explosives act') + 0.8, k = bounce(s.t, tt);
  if (k > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, k); ctx.fillStyle = 'rgba(230,57,70,0.95)'; rr(ctx, 50, CAM_TOP + 915, W - 100, 160, 24); ctx.fill();
    kt(ctx, 'PRELIMS TRAP', 90, CAM_TOP + 962, { font: F.ui(28, 900), color: '#FFFFFF' });
    kt(ctx, 'The research institute designs · the Safety Organisation licenses', 90, CAM_TOP + 1015, { font: F.ui(34, 900), color: '#FFFFFF', maxW: W - 180, lh: 40 }); ctx.restore(); }
};

SCENES.S5 = (ctx, s) => {                   // Article 25 vs Article 21
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE BALANCE', 'Can a court limit a festival?');
  card(ctx, 50, CAM_TOP + 110, W - 100, 240, '#FFFFFF', bounce(s.t, ecue(s, 'religious')), [['Pollution "defeats the very purpose', F.ui(40, 900), '#1B0B45'], ['of the festivities"', F.ui(40, 900), '#1B0B45'], ['Supreme Court, 2 November 2026', F.ui(28, 800), '#6B21A8']]);
  const t25 = ecue(s, 'twenty-five'), t21 = ecue(s, 'twenty-one');
  const tilt = 0.17 * easeOut(span(s.t, t21, t21 + 0.8));          // + tips toward Article 21
  const cx = W / 2, cy = CAM_TOP + 430, L = 300;
  if (s.t > t25 - 0.5) {
    ctx.save(); ctx.fillStyle = '#E9D5FF'; ctx.fillRect(cx - 8, cy, 16, 300); ctx.fillRect(cx - 120, cy + 290, 240, 16); ctx.restore();
    const ends = [-1, 1].map(d => [cx + d * L * Math.cos(tilt), cy + d * L * Math.sin(tilt)]);
    ctx.save(); ctx.strokeStyle = '#E9D5FF'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...ends[0]); ctx.lineTo(...ends[1]); ctx.stroke(); ctx.restore();
    [['ARTICLE 25', 'religious practice', 'subject to health', '#FFD60A', '#1B0B45', t25], ['ARTICLE 21', 'right to', 'clean air & health', GRN, GDK, t21]].forEach(([t, a, b, fill, ink, at], i) => {
      const k = bounce(s.t, at); if (k <= 0) return; const [ex, ey] = ends[i];
      ctx.save(); ctx.strokeStyle = '#E9D5FF'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex, ey + 60); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(ex, ey + 140); ctx.scale(k, k); ctx.translate(-ex, -(ey + 140));
      exBox(ctx, ex - 175, ey + 60, 350, 170, { fill, r: 22 });
      kt(ctx, t, ex, ey + 115, { font: F.ui(40, 900), color: ink, align: 'center' });
      kt(ctx, a, ex, ey + 160, { font: F.ui(28, 800), color: ink, align: 'center' }); kt(ctx, b, ex, ey + 198, { font: F.ui(28, 800), color: ink, align: 'center' }); ctx.restore();
    });
  }
  pill(ctx, s, 'MAINS: harmonise faith and health', 60, CAM_TOP + 900, ecue(s, 'mains'), '#FFFFFF', '#6B21A8', 38);
};

SCENES.S6 = (ctx, s) => {
  vBase(ctx); camSpace(ctx, CAM_FACE);
  band(ctx, s, [['GREEN DEEPAVALI', GRN, 92, -1], ['1 EXAM TRAP EVERY DAY', '#FFFFFF', 58, 'follow']]);
  sparks(ctx, 110, CAM_FACE + 330, s.t, 0.9); sparks(ctx, W - 110, CAM_FACE + 330, s.t + 0.5, 0.9);
};
