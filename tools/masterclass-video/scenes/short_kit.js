// Shared kit for vertical Shorts (1080×1920, render with --size 1080x1920 and "scenes/short_kit.js,scenes/<short>.js").
// Layout (decision 41): [FACE] rows leave the top 1080×1500 for the camera with a keyword band below; [TOP] rows leave
// the top 1080×760 for the camera and teach below it. compose_face.py --vertical lays the camera in.
window.NO_PUSH = true; window.EX_LOGO = true;

const PUR = EP.purple, CAM_TOP = 760, CAM_FACE = 1500;
// a pop with a little overshoot: 0 before `a`, rising to about 1.1, settling at 1
const bounce = (t, a, d = 0.6) => { const x = clamp((t - a) / d); return x <= 0 ? 0 : easeOut(x) + 0.12 * Math.sin(x * Math.PI); };
const slideX = (t, a, from) => (1 - easeOut(span(t, a, a + 0.5))) * from;
function vBase(ctx, shake = 0) {
  if (shake) ctx.translate(Math.sin(GT * 90) * shake, Math.cos(GT * 70) * shake);
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1B0B45'); g.addColorStop(1, '#4C1D95'); ctx.fillStyle = g; ctx.fillRect(-20, -20, W + 40, H + 40);
  ctx.save(); ctx.globalAlpha = 0.08; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc((i * 337) % W, (H + 120 - ((GT * (12 + i % 5) + i * 211) % (H + 240))), 30 + (i * 13) % 50, 0, 7); ctx.fillStyle = '#FFFFFF'; ctx.fill(); } ctx.restore();
}
function camSpace(ctx, h) {                 // placeholder for the camera (replaced by compose_face.py)
  ctx.save(); const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2E1065'); g.addColorStop(1, '#3B0764'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, h);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.setLineDash([18, 12]); ctx.lineWidth = 4; ctx.strokeRect(30, 30, W - 60, h - 60); ctx.restore();
  kt(ctx, 'MOUNIKA ON CAMERA', W / 2, h / 2, { font: F.ui(48, 900), color: 'rgba(255,255,255,0.75)', align: 'center' });
  kt(ctx, '(your recording goes here)', W / 2, h / 2 + 56, { font: F.ui(32, 600), color: 'rgba(255,255,255,0.6)', align: 'center' });
}
function header(ctx, s, t, sub) {
  const a = eia(s, 0.1);
  exChip(ctx, t, 40 + slideX(s.t, 0.05, -300), CAM_TOP + 28, '#FFD60A', '#1B0B45', 40, a);
  if (sub) kt(ctx, sub, 44, CAM_TOP + 148, { font: F.ui(34, 700), color: '#E9D5FF', alpha: a });
  exLogo(ctx, W - 80, CAM_TOP + 66, 46);
}
function band(ctx, s, lines) {              // keyword band under the full camera (at most 8 words); each line pops in
  ctx.fillStyle = 'rgba(11,8,32,0.92)'; ctx.fillRect(0, CAM_FACE, W, H - CAM_FACE); ctx.fillStyle = '#FFD60A'; ctx.fillRect(0, CAM_FACE, W, 8);
  lines.forEach(([t, col, size, cue], i) => {
    const at = cue == null ? 0.2 + i * 0.4 : ecue(s, cue, 0.5), k = bounce(s.t, at - 0.1);
    if (k <= 0) return; ctx.save(); ctx.translate(W / 2, CAM_FACE + 130 + i * (size + 30)); ctx.scale(k, k);
    kt(ctx, t, 0, size * 0.35, { font: F.ui(size, 900), color: col, align: 'center' }); ctx.restore();
  });
}
function card(ctx, x, y, w, h, fill, k, lines) {   // a card that pops in; lines: [[text, font, colour]]
  if (k <= 0) return; ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  exBox(ctx, x, y, w, h, { fill, r: 26 }); let yy = y + 70;
  for (const [t, f, c] of lines) { const px = parseInt(f.match(/(\d+)px/)[1]); yy += kt(ctx, t, x + 40, yy, { font: f, color: c, maxW: w - 80, lh: px * 1.15 }) + px * 0.25; }
  ctx.restore();
}
const ARC = [[74.3, 34.6], [76.5, 33.0], [77.6, 31.8], [79.0, 30.6], [80.6, 29.6], [83.0, 28.6], [85.5, 27.9], [88.3, 27.4], [90.5, 27.2], [92.5, 27.6], [94.5, 28.3], [96.5, 28.2]];
function arcGlow(g, proj, a, pulse) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.lineCap = g.lineJoin = 'round';
  for (const [lw, col] of [[56 + 10 * pulse, 'rgba(255,214,10,0.35)'], [26, 'rgba(255,214,10,0.9)']]) { g.lineWidth = lw; g.strokeStyle = col; g.beginPath(); ARC.map(proj).forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke(); }
  g.restore();
}
const IND = [67.5, 6.5, 97.8, 37.2];

function clipV(ctx, x, y, w, h, k, date, head, src, rot) {
  if (k <= 0) return; ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rot * (2 - Math.min(1, k))); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2));
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10; ctx.fillStyle = '#FBF6EA'; ctx.fillRect(x, y, w, h); ctx.shadowColor = 'transparent';
  exLogo(ctx, x + 50, y + 52, 30); kt(ctx, 'THE DECODE DESK', x + 96, y + 66, { font: F.head(38, 900), color: '#1B1B1B' });
  ctx.fillStyle = '#1B1B1B'; ctx.fillRect(x + 30, y + 96, w - 60, 3);
  kt(ctx, date, x + 30, y + 136, { font: F.ui(28, 800), color: '#5A4A32' });
  kt(ctx, head, x + 30, y + 190, { font: F.head(40, 800), color: '#1B1B1B', maxW: w - 60, lh: 48 });
  kt(ctx, 'Reported by: ' + src, x + 30, y + h - 30, { font: F.ui(26, 700), color: '#5A4A32', maxW: w - 60 });
  ctx.restore();
}
