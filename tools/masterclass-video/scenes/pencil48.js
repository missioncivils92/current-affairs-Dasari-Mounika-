// W48 pencil sketches from REAL imagery (owner, 27 Nov: liked "pencil type sketches", but not the hand-coded drawings).
// Each Sentinel-2 view is turned into a pencil drawing (tools/masterclass-video/pencilize.py -> sat/<name>_pencil.png).
// On screen the pencil drawing sketches itself in diagonal strokes, then the real colour washes in over it.
// Load after weekly48.js and upgrade48.js (replaces sketch48.js):  scenes/weekly48.js,scenes/upgrade48.js,scenes/pencil48.js
function pencilReveal(ctx, proj, b, name, pr) {
  if (!A[name + '_pencil'] || pr <= 0) return;
  const [x, y, w, h] = b, N = 26, D = w + h;
  ctx.save(); ctx.beginPath();
  for (let i = 0; i < N; i++) { const f = clamp(pr * N - i); if (f <= 0) break;   // band i: a diagonal stroke drawn left to right
    const d0 = x - h + D * i / N, d1 = x - h + D * (i + 1) / N, len = (w + h) * f;
    ctx.moveTo(d0, y + h); ctx.lineTo(d1, y + h); ctx.lineTo(d1 + Math.min(len, h), y + h - Math.min(len, h)); ctx.lineTo(d0 + Math.min(len, h), y + h - Math.min(len, h)); ctx.closePath(); }
  ctx.clip(); raster(ctx, proj, A[name + '_pencil'], A[name + '_pencil_meta']); ctx.restore();
}
function satView(ctx, s, b, name, ctr, span, o = {}) {      // replaces weekly48's: pencil first, then the real colour
  const k = 1 + 0.08 * clamp(s.t / Math.max(s.d, 1)), proj = satProj(b, ctr, span, k), f = s.t / Math.max(s.d, 1);
  const pr = clamp((f - 0.0) / 0.42), col = clamp((f - 0.48) / 0.22);
  ctx.save(); rr(ctx, ...b, o.r ?? 0); ctx.clip(); ctx.fillStyle = '#FBF6EA'; ctx.fillRect(...b);
  pencilReveal(ctx, proj, b, name, pr);
  if (col > 0) raster(ctx, proj, A[name], A[name + '_meta'], { alpha: col, filter: o.filter || 'brightness(1.05) saturate(1.1)' });
  if (o.dim) { ctx.fillStyle = `rgba(10,8,30,${o.dim * col})`; ctx.fillRect(...b); }
  const ink = col < 0.5;
  for (const [t, ll, z, c2, ff] of o.labels || []) { const [px, py] = proj(ll); kt(ctx, t, px, py, { font: ink ? F.hand((z || 34) * 1.25, 700) : F.ui(z || 34, 900), color: ink ? '#5B3A0E' : (c2 || '#FFFFFF'), align: 'center', shadow: ink ? 0 : 8, alpha: eia(s, T(s, ff || 0.05)) }); }
  for (const [t, ll, off, ff, bg] of o.pins || []) exTag(ctx, proj, ll, t, off, eia(s, T(s, ff)), EP.purple, { bg: bg || '#FFFFFF', size: 28 });
  if (o.draw) o.draw(ctx, proj);
  ctx.restore();
  if (o.r) { ctx.save(); rr(ctx, ...b, o.r); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
  kt(ctx, (col < 0.5 ? 'Pencil sketch · ' : '') + SATC, b[0] + b[2] - 16, b[1] + b[3] - 16, { font: F.ui(22, 700), color: col < 0.5 ? '#5B3A0E' : '#FFFFFF', align: 'right', shadow: col < 0.5 ? 0 : 6, alpha: 0.9 });
}
// a pencil panel that stays a sketch (no colour), with a handwritten caption
function pencilPanel(ctx, s, b, name, ctr, span, caption, labels = []) {
  const k = 1 + 0.06 * clamp(s.t / s.d), proj = satProj(b, ctr, span, k), pr = clamp(s.t / (s.d * 0.6));
  ctx.save(); rr(ctx, ...b, 22); ctx.clip(); ctx.fillStyle = '#FBF6EA'; ctx.fillRect(...b); pencilReveal(ctx, proj, b, name, pr);
  for (const [t, ll, z, at] of labels) { const [px, py] = proj(ll); kt(ctx, t, px, py, { font: F.hand(z || 44, 700), color: '#7A2E0E', align: 'center', alpha: clamp((pr - (at ?? 0.7)) / 0.15) }); }
  ctx.restore(); ctx.save(); rr(ctx, ...b, 22); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(80,60,30,0.5)'; ctx.stroke(); ctx.restore();
  if (caption) { const a = clamp((pr - 0.8) / 0.2); if (a > 0) { ctx.save(); ctx.globalAlpha *= a; ctx.font = F.hand(42, 700); const cw = ctx.measureText(caption).width + 40; rr(ctx, b[0] + 16, b[1] + 16, cw, 64, 14); ctx.fillStyle = 'rgba(251,246,234,0.92)'; ctx.fill(); ctx.restore(); kt(ctx, caption, b[0] + 36, b[1] + 62, { font: F.hand(42, 700), color: '#5B3A0E', alpha: a }); } }
  kt(ctx, 'Pencil sketch · ' + SATC, b[0] + b[2] - 16, b[1] + b[3] - 14, { font: F.ui(20, 700), color: '#5B3A0E', align: 'right', alpha: 0.85 });
}

// topic 1 title: India's biggest container port, sketched (exports to America leave from ports like this)
SCENES.S011 = (ctx, s) => {
  const c = PAL.eco; exSlide(ctx, c, null, null);
  pencilPanel(ctx, s, [72, 120, 860, 840], 'atalsetu', [72.95, 18.955], 0.13, 'JNPA, Navi Mumbai: where India\'s exports sail', [['container port', [72.945, 18.948], 46, 0.6], ['to America?', [72.935, 18.995], 52, 0.75]]);
  zoom(ctx, bounce(s.t, 0.05), 1090, 300, () => { ctx.beginPath(); ctx.arc(1090, 300, 110, 0, 7); ctx.fillStyle = YEL; ctx.fill(); kt(ctx, '1', 1090, 340, { font: F.head(120, 900), color: c.ink, align: 'center' }); });
  exChip(ctx, 'ECONOMY', 990, 460, '#FFFFFF', c.ink, 36, eia(s, 0.2));
  kt(ctx, "America's tariff threat", 990, 620, { font: F.head(76, 900), color: '#FFFFFF', maxW: 860, lh: 86, alpha: eia(s, 0.3) });
  kt(ctx, 'Section 301 · up to 25% · proposed 25 Nov 2026', 990, 900, { font: F.ui(40, 800), color: YEL, maxW: 860, lh: 50, alpha: eia(s, 0.6) });
};
// COP31: India's stand beside a pencil sketch of Antalya
SCENES.S034 = (ctx, s) => {
  exSlide(ctx, PAL.env, null, null); exChip(ctx, "INDIA'S STAND AT COP31", 72, 44, '#FFFFFF', PAL.env.ink, 36, eia(s, 0.05));
  pencilPanel(ctx, s, [72, 140, 860, 860], 'antalya', [30.72, 36.885], 0.3, 'Antalya, host of COP31', [['ANTALYA', [30.7, 36.9], 56, 0.6], ['Mediterranean Sea', [30.68, 36.845], 46, 0.7]]);
  pp(ctx, s, 0.3, 990, 200, 860, 330, YEL, [['Common but differentiated responsibilities', 44, INK], ['rich and poor countries carry different burdens', 30, INK, 800]]);
  pp(ctx, s, 0.6, 990, 580, 860, 330, '#FFFFFF', [['Finance from the developed world first', 44, INK], ['at least $300 billion a year by 2035 (Baku)', 30, VIO, 800]]);
};
// Shenzhou-24: the two stations beside a pencil sketch of the Jiuquan launch site
SCENES.S053 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'TWO SPACE STATIONS');
  pencilPanel(ctx, s, [72, 160, 760, 840], 'jiuquan', [100.22, 40.98], 0.3, 'Jiuquan launch centre, Gobi desert', [['launch site', [100.29, 40.96], 46, 0.6]]);
  pp(ctx, s, 0.2, 880, 190, 968, 380, '#FFFFFF', [['TIANGONG', 52, INK], ["China's own station", 36, INK, 800], ['now hosting partners like Pakistan', 30, VIO, 800]]);
  pp(ctx, s, 0.5, 880, 610, 968, 380, '#FFFFFF', [['INTERNATIONAL SPACE STATION', 42, INK], ['US · Russia · Europe · Japan · Canada', 32, INK, 800], ['China is NOT a partner', 34, RED, 800]]);
};
// Hormuz: the news beside a pencil sketch of the strait
SCENES.S062 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'NOVEMBER 2026 · TANKERS ON FIRE');
  pencilPanel(ctx, s, [72, 160, 860, 840], 'hormuz', [56.35, 26.45], 1.2, 'The Strait of Hormuz', [['IRAN', [56.75, 26.93], 56, 0.6], ['OMAN', [56.2, 26.1], 50, 0.65], ['the strait', [56.45, 26.55], 46, 0.75]]);
  pp(ctx, s, 0.15, 990, 190, 860, 330, '#FFFFFF', [["Iran's Revolutionary Guard: tankers struck sea mines", 38, INK], ['claims NOT independently verified', 30, RED, 800]]);
  pp(ctx, s, 0.45, 990, 560, 860, 200, '#FFD9DC', [['Traffic through the Strait', 32, INK], ['dropped sharply', 44, RED]]);
  pp(ctx, s, 0.65, 990, 790, 860, 200, GRN, [['Indian Navy', 40, INK], ["escorting India's tankers (reported)", 30, INK, 800]]);
};
