// W48 topic 10, advanced cut (owner, 27 Nov: "Lachit and Guru video, make it more advanced").
// Needs flights48.js loaded first (flight helper):  node render.js <assets> <tl> scenes/flights48.js,scenes/lachit48.js <out> --strict
// Real Sentinel-2 Brahmaputra at Guwahati + relief flight; India maps from the Survey of India outline (exMap).
const VIO = '#7C3AED', GRN = '#06D6A0', RED = '#E63946', SKY = '#4CC9F0';
const Tf = (s, f) => s.d * f;
function card(ctx, s, f, x, y, w, h, fill, lines) {
  const k = clamp((s.t - Tf(s, f)) / 0.5); if (k <= 0) return; const e = easeOut(k);
  ctx.save(); ctx.globalAlpha *= e; ctx.translate(0, (1 - e) * 40); exBox(ctx, x, y, w, h, { fill, r: 22 });
  let yy = y + 20; for (const [t, z, c, wt] of lines) { yy += z; yy += kt(ctx, t, x + w / 2, yy, { font: F.ui(z, wt || 900), color: c || INK, align: 'center', maxW: w - 50, lh: z * 1.15 }) - z + z * 0.4; }
  ctx.restore();
}
function boat(ctx, x, y, ang, col, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc); ctx.fillStyle = col; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-22, -6); ctx.lineTo(18, -6); ctx.lineTo(26, 0); ctx.lineTo(18, 6); ctx.lineTo(-22, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
}

// 1 · the flight onto Saraighat, then the battle drawn on the real river
const fly = flight({ title: 'LACHIT DIVAS · 24 NOVEMBER', sub: '404th birth anniversary of Lachit Borphukan, Ahom general', mid: 'guwahati_m', terr: 'assam_t', sat: 'saraighat', ctr: [91.72, 26.175], span: 0.33, rivers: ['Brahmaputra'],
  labels: [['BRAHMAPUTRA', [91.6, 26.2], 46, '#BFE3FF'], ['GUWAHATI', [91.8, 26.155], 48]], pins: [['Saraighat', [91.68, 26.185], [60, -150], 0.2, YEL]] });
SCENES.S11 = (ctx, s) => fly(ctx, s);
SCENES.S12 = (ctx, s) => {
  const proj = satProj48([0, 0, W, H], [91.7, 26.18], 0.3, 1 + 0.05 * clamp(s.t / s.d));
  ctx.fillStyle = '#0A224A'; ctx.fillRect(0, 0, W, H); raster(ctx, proj, A.saraighat, A.saraighat_meta, { filter: 'brightness(0.9) saturate(1.1)' });
  // Mughal fleet comes upstream from the west (Bengal side); Ahom boats hold the narrow channel; banks fortified
  const m = clamp((s.t - 1) / (s.d * 0.45)), path = [[91.56, 26.16], [91.6, 26.185], [91.64, 26.19], [91.665, 26.19]];
  const pts = path.map(p => proj(p));
  arrow(ctx, pts, m, { color: RED, lw: 10, dash: [26, 14] });
  for (let i = 0; i < 6; i++) { const f = clamp(m - i * 0.06); if (f <= 0) continue; const seg = f * (pts.length - 1), j = Math.min(pts.length - 2, Math.floor(seg)), u = seg - j;
    boat(ctx, lerp(pts[j][0], pts[j + 1][0], u) - i * 26, lerp(pts[j][1], pts[j + 1][1], u) + (i % 2 ? 18 : -18), 0, RED, 1.1); }
  const a = clamp((s.t - s.d * 0.4) / 1.2);
  if (a > 0) { const [x0, y0] = proj([91.678, 26.188]); for (let i = 0; i < 7; i++) boat(ctx, x0 + 40 + (i % 2) * 34, y0 - 50 + i * 16, Math.PI, YEL, 1.1 * a);
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = YEL; ctx.lineWidth = 8; ctx.setLineDash([4, 10]); const [nx, ny] = proj([91.68, 26.2]), [sx, sy] = proj([91.68, 26.172]);
    ctx.beginPath(); ctx.arc(nx, ny, 40, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(sx, sy, 40, 0, 7); ctx.stroke(); ctx.restore(); }
  exChip(ctx, 'BATTLE OF SARAIGHAT · 1671', 72, 44, YEL, INK, 40, eia(s, 0.2));
  kt(ctx, 'Schematic of the battle on today\'s river · positions are illustrative', 76, 150, { font: F.ui(30, 800), color: '#FFFFFF', shadow: 8, alpha: eia(s, 0.5) });
  card(ctx, s, 0.15, 72, 760, 560, 230, '#FFD9DC', [['MUGHAL ARMY', 32, RED], ['led by Raja Ram Singh of Amber', 32], ['sails up the Brahmaputra', 28, INK, 800]]);
  card(ctx, s, 0.45, 680, 760, 560, 230, YEL, [['AHOM FORCES', 32, VIO], ['Lachit Borphukan', 40], ['hold the narrow river + both banks', 28, INK, 800]]);
  card(ctx, s, 0.7, 1288, 760, 560, 230, GRN, [['RESULT', 32, INK], ['Ahom victory', 44], ['a naval battle on a river', 28, INK, 800]]);
  kt(ctx, 'Contains modified Copernicus Sentinel data 2026', W - 24, H - 18, { font: F.ui(22, 700), color: '#FFFFFF', align: 'right', shadow: 6 });
};
function satProj48(b, ctr, span, k) { const [x, y, w, h] = b; return d3.geoMercator().scale(k * w / (span * Math.PI / 180)).center(ctr).translate([x + w / 2, y + h / 2]); }

// 2 · a timeline river
function timeline(ctx, s, title, sub, items, col) {
  exSlide(ctx, EP.violet, null, null); exChip(ctx, title, 72, 44, '#FFFFFF', INK, 38, eia(s, 0.05));
  if (sub) kt(ctx, sub, 76, 160, { font: F.ui(34, 800), color: '#E9D5FF', alpha: eia(s, 0.3) });
  const y = 560, x0 = 120, x1 = 1800, p = clamp((s.t - 0.5) / (s.d * 0.7));
  ctx.save(); ctx.strokeStyle = '#4A90C2'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath();
  for (let i = 0; i <= 60 * p; i++) { const t = i / 60, x = x0 + (x1 - x0) * t, yy = y + Math.sin(t * 9) * 26; i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); ctx.restore();
  items.forEach(([yr, txt, f, hi], i) => { const t = (i + 0.5) / items.length, x = x0 + (x1 - x0) * t, yy = y + Math.sin(t * 9) * 26, a = clamp((s.t - Tf(s, f)) / 0.5); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(x, yy, 26, 0, 7); ctx.fillStyle = hi ? YEL : '#FFFFFF'; ctx.fill(); ctx.restore();
    const up = i % 2 === 0, by = up ? yy - 330 : yy + 70, w = Math.min(300, (x1 - x0) / items.length + 20);
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x, up ? by + 260 : by); ctx.stroke(); ctx.restore();
    card(ctx, s, f, x - w / 2, by, w, 260, hi ? YEL : '#FFFFFF', [[yr, 44, VIO], [txt, 28, INK, 800]]); });
}
SCENES.S13 = (ctx, s) => timeline(ctx, s, 'LACHIT BORPHUKAN · A LIFE ON THE BRAHMAPUTRA', 'Ahom kingdom (Assam) · "Borphukan" is a title: commander of the western Ahom territories', [
  ['1622', 'born 24 November', 0.05], ['1662', 'Mughal general Mir Jumla invades Assam', 0.18], ['1667', 'Ahoms win back Guwahati', 0.3], ['1671', 'Battle of Saraighat', 0.42, 1], ['1672', 'Lachit dies', 0.55], ['1999', 'NDA best cadet: Lachit Borphukan Gold Medal', 0.68]]);

// 3 · Guru Tegh Bahadur: the journey on India's map
SCENES.S14 = (ctx, s) => {
  const c = EP.violet; exSlide(ctx, c, null, null); exChip(ctx, 'GURU TEGH BAHADUR · THE LAST JOURNEY, 1675', 72, 44, '#FFFFFF', INK, 36, eia(s, 0.05));
  const route = [[74.8, 34.08], [76.5, 31.24], [77.23, 28.656]];
  exMap(ctx, s, [72, 150, 1100, 880], c, { bounds: [72.5, 26.5, 80.5, 35.2], plainIndia: false,
    pins: [['Kashmir · plea of the Kashmiri Pandits', [74.8, 34.08], [-20, -70], 1.0], ['Anandpur Sahib (Punjab) · his base', [76.5, 31.24], [210, -30], Tf(s, 0.3)], ['Delhi · Chandni Chowk', [77.23, 28.656], [160, 60], Tf(s, 0.55)]],
    draw: (g, proj) => arrow(g, route.map(p => proj(p)), clamp((s.t - 1.5) / (s.d * 0.5)), { color: RED, lw: 8, dash: [20, 12] }) });
  card(ctx, s, 0.1, 1210, 150, 640, 250, YEL, [['9th Sikh Guru', 44], ['1621–1675', 34, VIO]]);
  card(ctx, s, 0.4, 1210, 430, 640, 280, '#FFFFFF', [['Executed in Delhi, 1675', 36], ["on Aurangzeb's orders", 30, INK, 800], ['for defending freedom of faith', 30, VIO, 800]]);
  card(ctx, s, 0.65, 1210, 740, 640, 280, GRN, [['"Hind di Chadar"', 42], ['the shield of India', 32, INK, 800]]);
};
// 4 · the places + companions
SCENES.S15 = (ctx, s) => {
  exSlide(ctx, EP.violet, null, null); exChip(ctx, 'DELHI · WHERE HISTORY STANDS TODAY', 72, 44, '#FFFFFF', INK, 38, eia(s, 0.05));
  card(ctx, s, 0.05, 72, 190, 860, 330, YEL, [['Gurdwara Sis Ganj Sahib', 46], ['Chandni Chowk', 34, VIO], ['the place of martyrdom', 30, INK, 800]]);
  card(ctx, s, 0.3, 990, 190, 860, 330, '#FFFFFF', [['Gurdwara Rakab Ganj Sahib', 44], ['near Parliament House', 34, VIO], ['where his body was cremated', 30, INK, 800]]);
  card(ctx, s, 0.55, 72, 580, 1776, 220, '#FFFFFF', [['Martyred with him: Bhai Mati Das · Bhai Sati Das · Bhai Dayala', 38], ['his companions', 28, VIO, 800]]);
  card(ctx, s, 0.75, 72, 840, 1776, 180, GRN, [['His hymns are in the Guru Granth Sahib', 40]]);
};
// 5 · the ten Gurus strip (the trap)
SCENES.S16 = (ctx, s) => {
  exSlide(ctx, EP.red, null, null); exChip(ctx, 'PRELIMS TRAP · THE TEN SIKH GURUS', 72, 44, '#FFFFFF', '#B91C1C', 40, eia(s, 0.05));
  const G = ['Nanak', 'Angad', 'Amar Das', 'Ram Das', 'Arjan', 'Hargobind', 'Har Rai', 'Har Krishan', 'Tegh Bahadur', 'Gobind Singh'];
  G.forEach((g, i) => { const x = 72 + i * 180, a = clamp((s.t - 0.3 - i * 0.25) / 0.4); if (a <= 0) return; const hi = i >= 8;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(0, (1 - a) * 30); exBox(ctx, x, 230, 160, 300, { fill: hi ? YEL : '#FFFFFF', r: 18 });
    kt(ctx, String(i + 1), x + 80, 320, { font: F.head(70, 900), color: hi ? INK : VIO, align: 'center' }); kt(ctx, g, x + 80, 420, { font: F.ui(26, 900), color: INK, align: 'center', maxW: 150, lh: 30 }); ctx.restore(); });
  card(ctx, s, 0.6, 72, 600, 860, 330, '#FFFFFF', [['9th · Guru Tegh Bahadur', 40], ['martyred, Delhi, 1675', 32, VIO, 800]]);
  card(ctx, s, 0.72, 990, 600, 860, 330, YEL, [['10th · Guru Gobind Singh', 40], ['founded the KHALSA, 1699', 34, RED], ['his son', 28, INK, 800]]);
};
// 6 · one date, two heroes
SCENES.S17 = (ctx, s) => {
  exSlide(ctx, EP.violet, null, null); kt(ctx, '24 NOVEMBER · TWO HEROES, ONE DATE', 960, 130, { font: F.head(64, 900), color: YEL, align: 'center', alpha: eia(s, 0.05) });
  card(ctx, s, 0.08, 72, 210, 860, 640, '#FFFFFF', [['LACHIT BORPHUKAN', 46], ['Ahom general · born 1622', 32, VIO, 800], ['Saraighat, 1671', 40], ['defended Assam on the Brahmaputra', 30, INK, 800], ['Lachit Divas · Assam', 30, INK, 800]]);
  card(ctx, s, 0.3, 990, 210, 860, 640, YEL, [['GURU TEGH BAHADUR', 46], ['9th Sikh Guru', 32, VIO, 800], ['Delhi, 1675', 40], ['gave his life for freedom of faith', 30, INK, 800], ['Hind di Chadar', 30, INK, 800]]);
  kt(ctx, 'Both stood against Mughal power · both are asked in Prelims', 960, 960, { font: F.ui(42, 900), color: '#FFFFFF', align: 'center', alpha: eia(s, Tf(s, 0.6)) });
};
