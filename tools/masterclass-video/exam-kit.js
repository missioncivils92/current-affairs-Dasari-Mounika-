// Exam kit: the per-topic exam format (owner decision, 28 Oct 2026). Every topic plays as a run of slides:
//   title → why in news → concept slides (steps / tables / ladders) → Prelims trap → practice MCQ → answer → notes.
// Each slide has ONE colour (purple first, owner: "in each slide use one colour, but purple is more good"); text sits on
// white cards; maps are flat vector maps (Survey of India outline), never satellite imagery.
// A scene file calls exTopic(n, T) for each topic: slide i of topic n becomes SCENES['S' + n + two-digit i], matching
// the **S101**… IDs in the master script. Every build lands on a cue word from the narration (s.w(cue)).

const EP = {   // slide palettes: background gradient, main, deep ink, light tints (light → mid)
  purple: { bg: ['#3B0F86', '#7C3AED'], main: '#7C3AED', ink: '#2E1065', t: ['#F5F0FF', '#E9DDFF', '#D6C2FF', '#BB9BFF', '#9D6BFF'] },
  violet: { bg: ['#4A1580', '#9333EA'], main: '#9333EA', ink: '#3B0764', t: ['#FAF5FF', '#F0E1FF', '#E0C3FF', '#C99BFF', '#AE6DFF'] },
  orange: { bg: ['#B93A06', '#F97316'], main: '#F97316', ink: '#5A1C02', t: ['#FFF4EB', '#FFE2CC', '#FFC79E', '#FFA766', '#FF8A33'] },
  blue:   { bg: ['#123C9C', '#3B82F6'], main: '#2563EB', ink: '#0B2559', t: ['#EEF5FF', '#D7E7FF', '#B5D2FF', '#86B4FF', '#5592FF'] },
  teal:   { bg: ['#0B5D57', '#14B8A6'], main: '#0F9D8F', ink: '#053B36', t: ['#ECFDF9', '#CCF5EC', '#99EBDA', '#5FD9C2', '#2BC4A8'] },
  red:    { bg: ['#8E1520', '#E63946'], main: '#E63946', ink: '#4A0710', t: ['#FFF1F2', '#FFD9DC', '#FFB3B9', '#FF8A93', '#FF5E6A'] },
  yellow: { bg: ['#F5A300', '#FFD60A'], main: '#F59E0B', ink: '#3A2600', t: ['#FFFBEA', '#FFF3C4', '#FFE58A', '#FFD54F', '#FFC107'] },
};
const EX = { series: 'PRELIMS GRID', total: 16 };
const eia = (s, at, d = 0.45) => clamp(pop(s.t, at, d));
// animation: anything fading in also rises into place, so every build reads as motion, not a flicker
const kt = (ctx, str, x, y, o = {}) => text(ctx, str, x, y + (1 - (o.alpha ?? 1)) * 30, o);
const ecue = (s, cw, dflt) => (cw == null ? dflt : typeof cw === 'number' ? cw : s.w(cw) - 0.25);

function exChip(ctx, s, x, y, bg, fg = '#FFFFFF', size = 26, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.font = F.ui(size, 800); const w = ctx.measureText(s).width + size * 1.3, h = size * 1.75;
  if (a < 1) { const k = 0.85 + 0.15 * a; ctx.translate(x + w / 2, y + h / 2 + (1 - a) * 24); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2)); }
  rr(ctx, x, y, w, h, h / 2); ctx.fillStyle = bg; ctx.fill(); ctx.fillStyle = fg; ctx.textBaseline = 'middle'; ctx.fillText(s, x + size * 0.65, y + h / 2 + 1); ctx.restore(); return w;
}
function exBox(ctx, x, y, w, h, o = {}) {
  const ea = o.alpha ?? 1; ctx.save(); ctx.globalAlpha *= ea;
  if (ea < 1) { const k = 0.94 + 0.06 * ea; ctx.translate(x + w / 2, y + h / 2 + (1 - ea) * 40); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + h / 2)); }
  ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  rr(ctx, x, y, w, h, o.r ?? 22); ctx.fillStyle = o.fill || '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
  if (o.stroke) { ctx.lineWidth = o.lw || 3; ctx.strokeStyle = o.stroke; ctx.stroke(); }
  if (o.bar) { ctx.save(); rr(ctx, x, y, w, h, o.r ?? 22); ctx.clip(); ctx.fillStyle = o.bar; ctx.fillRect(x, y, 12, h); ctx.restore(); }
  ctx.restore();
}
// the coloured slide, a soft ring pattern, and the top strip with the topic and its step tracker
function exSlide(ctx, c, T, step) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, c.bg[0]); g.addColorStop(1, c.bg[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const T0 = GT;
  const gl = ctx.createRadialGradient(960 + 520 * Math.sin(T0 * 0.13), 540 + 260 * Math.cos(T0 * 0.11), 40, 960, 540, 1100);
  gl.addColorStop(0, 'rgba(255,255,255,0.10)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = 0.10; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3; ctx.setLineDash([40, 26]);
  for (let r = 160, i = 0; r < 1400; r += 120, i++) { ctx.beginPath(); ctx.arc(W + 100, -80, r, T0 * (i % 2 ? 0.05 : -0.04), T0 * (i % 2 ? 0.05 : -0.04) + 6.2); ctx.stroke(); } ctx.restore();
  ctx.save(); for (let i = 0; i < 16; i++) {                     // drifting bubbles (seeded, so frames are stable)
    const sx = (i * 487.3) % W, sp = 14 + (i * 7) % 11, rr2 = 18 + (i * 13) % 46, yy = H + 80 - ((T0 * sp + i * 173) % (H + 200));
    ctx.globalAlpha = 0.05 + 0.05 * ((i * 3) % 4) / 3; ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(sx + 30 * Math.sin(T0 * 0.4 + i), yy, rr2, 0, 7); ctx.fill(); }
  ctx.restore();
  exLogo(ctx, 1838, 64, 46);
  if (step == null) return;
  const cw = exChip(ctx, `TOPIC ${String(T.n).padStart(2, '0')}`, 72, 40, '#FFFFFF', c.ink, 24);
  const z = fitFont(ctx, T.short, 1560 - 100 - cw - T.steps.reduce((a, st) => a + 26 + 8 + st.length * 15, 0), 46, 30);
  kt(ctx, T.short, 72 + cw + 22, 79, { font: F.head(z), color: '#FFFFFF' });
  let x = 1630; for (let i = T.steps.length - 1; i >= 0; i--) {
    ctx.save(); ctx.font = F.ui(24, 800); const w = ctx.measureText(T.steps[i]).width + 26; ctx.restore(); x -= w + 8;
    const on = T.steps[i] === step; ctx.save(); rr(ctx, x, 46, w, 40, 20); ctx.fillStyle = on ? '#FFFFFF' : 'rgba(255,255,255,0.16)'; ctx.fill(); ctx.restore();
    kt(ctx, T.steps[i], x + 13, 75, { font: F.ui(24, 800), color: on ? c.ink : 'rgba(255,255,255,0.85)' });
  }
}
function exLogo(ctx, x, y, r, a = 1) {      // the channel emblem (brand/decode-upsc-logo.png), centred at x, y
  const L = A['decode-upsc-logo']; if (!L || a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 16; const w = 2 * r * L.width / L.height * 0.98;
  ctx.drawImage(L, x - w / 2, y - r, w, 2 * r); ctx.restore();
}
function exHead(ctx, c, label) { exChip(ctx, label, 72, 140, '#FFFFFF', c.ink, 28); }

// ---------- flat maps ----------
function exFlat(g, proj, c, m) {
  const sg = g.createLinearGradient(0, 0, 0, H); sg.addColorStop(0, '#A8DCF7'); sg.addColorStop(1, '#66B8EC'); g.fillStyle = sg; g.fillRect(0, 0, W, H);
  for (const k of A.geo.countries_wide) if (k.a3 !== 'IND') geo(g, proj, k.geom, { fill: (m.highlight || {})[k.a3] || '#F1EEE8', stroke: '#FFFFFF', lw: 1.5 });
  geo(g, proj, A.geo.india, { fill: m.indiaFill || c.t[1] });
  if (!m.plainIndia) (A.geo.india_state_polys || []).forEach((st, i) => geo(g, proj, st.geom, { fill: (m.focus || {})[st.name] || c.t[1 + (i % 3)] }));
  for (const st of A.geo.india_states) geo(g, proj, st.geom, { stroke: '#FFFFFF', lw: 2.2 });
  geo(g, proj, A.geo.india, { stroke: c.ink, lw: 2.6 });
  for (const l of A.geo.lakes) geo(g, proj, l.geom, { fill: '#66B8EC' });
  if (m.rivers) rivers(g, proj, m.rivers, { color: '#1E88E5', lw: 4 });
}
function exTag(g, proj, ll, s, off, a, c, o = {}) {
  if (a <= 0) return; const [px, py0] = proj(ll), py = py0 - (1 - a) * 60, lx = px + off[0], ly = py + off[1];
  g.save(); g.globalAlpha *= a; g.strokeStyle = c.ink; g.lineWidth = 2.5; g.beginPath(); g.moveTo(px, py); g.lineTo(lx, ly); g.stroke();
  g.beginPath(); g.arc(px, py, 10, 0, 7); g.fillStyle = o.dot || c.ink; g.fill(); g.lineWidth = 3; g.strokeStyle = '#FFFFFF'; g.stroke();
  g.font = F.ui(o.size || 26, 800); const w = g.measureText(s).width + 28; rr(g, lx - w / 2, ly - 22, w, 44, 12); g.fillStyle = o.bg || '#FFFFFF'; g.fill();
  g.strokeStyle = c.ink; g.lineWidth = 2.5; g.stroke(); g.fillStyle = o.fg || c.ink; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(s, lx, ly + 1); g.restore();
}
// m: { bounds, pins: [[label, [lon, lat], [dx, dy], cue, {bg}]], labels: [[text, [lon, lat], size, colour]], arrow: [[lon, lat]...],
//      focus: {State: colour}, highlight: {A3: colour}, rivers: [...], world, dashed: [A3...], credit }
function exMap(ctx, s, b, c, m) {
  exBox(ctx, ...b, { r: 24 }); ctx.save(); rr(ctx, ...b, 24); ctx.clip();
  const zb = m.bounds, zk = 1 + 0.14 * (1 - easeOut(span(s.t, 0, 3.5))), zx = (zb[0] + zb[2]) / 2, zy = (zb[1] + zb[3]) / 2;
  const proj = windowCamera(b, zx - (zx - zb[0]) * zk, zy - (zy - zb[1]) * zk, zx + (zb[2] - zx) * zk, zy + (zb[3] - zy) * zk); exFlat(ctx, proj, c, m);
  if (m.region) for (const [pts, lab] of m.region) {          // a schematic area (dashed box)
    ctx.save(); ctx.fillStyle = c.main + '30'; ctx.strokeStyle = c.ink; ctx.lineWidth = 3; ctx.setLineDash([12, 8]);
    ctx.beginPath(); pts.map(p => proj(p)).forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  for (const a3 of m.dashed || []) { const k = A.geo.countries_wide.find(q => q.a3 === a3[0]); const a = eia(s, ecue(s, a3[1], 1)); if (k && a > 0) geo(ctx, proj, k.geom, { stroke: c.ink, lw: 4, dash: [8, 6], alpha: a }); }
  if (m.arrow) arrow(ctx, m.arrow.map(p => proj(p)), span(s.t, 0.8, 3.6), { color: c.ink, lw: 8, dash: [20, 12] });
  for (const [t, ll, size, col] of m.labels || []) { const [px, py] = proj(ll); kt(ctx, t, px, py, { font: F.ui(size || 28, 800), color: col || c.ink, align: 'center', shadow: col === '#FFFFFF' ? 6 : 0 }); }
  for (const [lab, ll, off, cw, o] of m.pins || []) exTag(ctx, proj, ll, lab, off, eia(s, ecue(s, cw, 1.0)), c, o || {});
  if (m.draw) m.draw(ctx, proj, s);
  ctx.restore();
  ctx.save(); rr(ctx, ...b, 24); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
  kt(ctx, m.credit || 'Boundaries: Survey of India outline (DataMeet) · Natural Earth', b[0] + b[2] - 16, b[1] + b[3] - 16, { font: F.ui(24, 600), color: c.ink, align: 'right', alpha: 0.8 });
}

// ---------- side panels (inside a white card) ----------
function exPanel(ctx, s, b, c, p) {
  if (!p) return;
  if (p.map) return exMap(ctx, s, b, c, p.map);
  exBox(ctx, ...b, { r: 24 });
  const [x, y, w, h] = b;
  if (p.title) kt(ctx, p.title, x + 36, y + 62, { font: F.ui(30, 800), color: c.ink, maxW: w - 72 });
  const top = y + (p.title ? 100 : 30);
  if (p.ladder) {             // bands from low (bottom) to high (top), in shades of the slide colour
    const L = p.ladder.rows, n = L.length, rh = Math.min(96, (y + h - 30 - top) / n), sh = [c.t[1], c.t[2], c.t[3], c.t[4], c.main, c.ink];
    L.forEach(([name, range, tag], i) => {
      const yy = top + (n - 1 - i) * rh, a = eia(s, ecue(s, p.ladder.cue, 0.6) + i * 0.1), bw = (w - 260) * (0.45 + 0.55 * i / Math.max(1, n - 1)), col = sh[Math.min(sh.length - 1, Math.round(i * (sh.length - 1) / Math.max(1, n - 1)))], dark = i >= n / 2;
      ctx.save(); ctx.globalAlpha *= a; rr(ctx, x + 36, yy + 6, bw, rh - 12, 12); ctx.fillStyle = col; ctx.fill(); if (p.ladder.hl === i) { ctx.lineWidth = 6; ctx.strokeStyle = '#FFD60A'; ctx.stroke(); } ctx.restore();
      kt(ctx, name, x + 56, yy + rh / 2 + 10, { font: F.ui(26, 800), color: dark ? '#FFFFFF' : c.ink, alpha: a });
      kt(ctx, range, x + 36 + bw - 18, yy + rh / 2 + 10, { font: F.ui(26, 800), color: dark ? '#FFFFFF' : c.ink, align: 'right', alpha: a });
      if (tag) exChip(ctx, tag[0], x + 48 + bw, yy + rh / 2 - 22, '#FFD60A', c.ink, 24, eia(s, ecue(s, tag[1], 2)));
    });
    if (p.ladder.line) { const [i, lab, cw] = p.ladder.line, yy = top + (n - i) * rh, a = eia(s, ecue(s, cw, 2));
      ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([14, 10]); ctx.strokeStyle = c.main; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 24, yy); ctx.lineTo(x + w - 24, yy); ctx.stroke(); ctx.restore();
      exChip(ctx, lab, x + w - 30 - lab.length * 15 - 30, yy + 8, c.main, '#FFFFFF', 22, a); }
  }
  if (p.bars) {               // stacked shares: rows [[label, [[segLabel, value, colourIndex]], cue]]
    const R = p.bars, rh = (y + h - 70 - top) / R.length, bx = x + 200, bw = w - 240;
    R.forEach(([lab, segs, cw], i) => {
      const yy = top + i * rh + 10, a = eia(s, ecue(s, cw, 0.6 + i * 0.5)); let cx = bx;
      kt(ctx, lab, x + 36, yy + rh * 0.42, { font: F.ui(28, 800), color: c.ink, alpha: a });
      segs.forEach(([l, v, ci]) => { const ww = bw * v / 100; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = ci === 'g' ? '#CFCFD6' : [c.t[2], c.t[4], c.main, c.ink][ci]; ctx.fillRect(cx, yy, ww - 3, rh * 0.62); ctx.restore();
        if (l) { ctx.font = F.ui(24, 800); const out = ctx.measureText(l).width + 24 > ww;   // a thin segment gets its label beside it
          kt(ctx, l, out ? cx + ww + 10 : cx + 12, yy + rh * 0.4, { font: F.ui(24, 800), color: ci >= 2 && !out ? '#FFFFFF' : c.ink, alpha: a }); } cx += ww; });
    });
    if (p.note) kt(ctx, p.note, x + 36, y + h - 26, { font: F.ui(24, 600), color: c.ink, alpha: 0.75 });
  }
  if (p.line) {               // a rank line (lower is better): points [[year, rank]], labels at given indices
    const D = p.line.points, n = D.length, X = i => x + 90 + (w - 150) * i / (n - 1), lo = Math.min(...D.map(d => d[1])), hi = Math.max(...D.map(d => d[1])), Y = r => top + 30 + (y + h - 90 - top - 30) * (r - lo) / (hi - lo);
    const pp = span(s.t, ecue(s, p.line.cue, 0.6), ecue(s, p.line.cue, 0.6) + 2.5);
    ctx.save(); ctx.strokeStyle = c.main; ctx.lineWidth = 6; ctx.beginPath(); D.forEach(([, r], i) => { if (i / (n - 1) <= pp) i ? ctx.lineTo(X(i), Y(r)) : ctx.moveTo(X(i), Y(r)); }); ctx.stroke(); ctx.restore();
    D.forEach(([yr, r], i) => { if (i / (n - 1) > pp) return; ctx.beginPath(); ctx.arc(X(i), Y(r), 8, 0, 7); ctx.fillStyle = c.ink; ctx.fill();
      if (p.line.show.includes(i)) kt(ctx, String(r), X(i), Y(r) - 18, { font: F.ui(28, 800), color: c.ink, align: 'center' });
      kt(ctx, '’' + String(yr).slice(2), X(i), y + h - 40, { font: F.ui(24, 700), color: c.ink, align: 'center', alpha: 0.75 }); });
  }
  if (p.bigs) {               // big numbers: [[label, value, cue]]
    const rh = (y + h - 20 - top) / p.bigs.length;
    p.bigs.forEach(([lab, v, cw], i) => { const yy = top + i * rh, a = eia(s, ecue(s, cw, 0.6 + i * 0.4));
      exBox(ctx, x + 30, yy, w - 60, rh - 20, { fill: c.t[i % 2 ? 1 : 0], alpha: a, r: 16 });
      exChip(ctx, lab, x + 50, yy + 16, c.main, '#FFFFFF', 22, a);
      const vz = fitFont(ctx, v, w - 120, Math.min(64, rh * 0.42), 28); kt(ctx, v, x + 54, yy + rh - 46, { font: F.head(vz), color: c.ink, alpha: a }); });
  }
  if (p.scale) {              // a banded scale with a marker: {bands: [[from, to, label]], max, mark: [value, label, cue]}
    const S = p.scale, X = v => x + 36 + (w - 72) * v / S.max, sh = [c.t[1], c.t[2], c.t[3], c.t[4], c.main, c.ink], by = top + 60;
    S.bands.forEach(([a0, a1, lab], i) => { ctx.fillStyle = sh[i + 1] || c.ink; ctx.fillRect(X(a0), by, X(a1) - X(a0) - 3, 70); kt(ctx, lab, (X(a0) + X(a1)) / 2, by + 112, { font: F.ui(24, 800), color: c.ink, align: 'center' }); });
    const [mv, ml, cw] = S.mark, a = eia(s, ecue(s, cw, 1)); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = c.ink; ctx.beginPath(); ctx.moveTo(X(mv), by - 4); ctx.lineTo(X(mv) - 14, by - 30); ctx.lineTo(X(mv) + 14, by - 30); ctx.fill(); ctx.restore();
    exChip(ctx, ml, X(mv) - 60, by - 80, '#FFD60A', c.ink, 24, a);
    if (S.rows) S.rows.forEach(([l, wt, v, cw2], i) => { const yy = by + 170 + i * 76, aa = eia(s, ecue(s, cw2, 1.2 + i * 0.2));
      exBox(ctx, x + 36, yy, w - 72, 64, { fill: c.t[i % 2], alpha: aa, r: 12 }); kt(ctx, wt, x + 60, yy + 43, { font: F.ui(26, 800), color: c.main, alpha: aa });
      kt(ctx, l, x + 160, yy + 43, { font: F.ui(26, 800), color: c.ink, alpha: aa }); if (v) kt(ctx, v, x + w - 60, yy + 43, { font: F.ui(26, 800), color: c.ink, align: 'right', alpha: aa }); });
  }
  if (p.tiles) {              // calendar tiles: [[day, month, label, cue]]
    const n = p.tiles.length, tw = (w - 72 - (n - 1) * 24) / n;
    p.tiles.forEach(([d, mo, lab, cw], i) => { const xx = x + 36 + i * (tw + 24), a = eia(s, ecue(s, cw, 0.6 + i * 0.4));
      exBox(ctx, xx, top, tw, h - (top - y) - 30, { fill: c.t[0], alpha: a, r: 18 }); ctx.save(); ctx.globalAlpha *= a; rr(ctx, xx, top, tw, 70, 18); ctx.fillStyle = c.main; ctx.fill(); ctx.restore();
      kt(ctx, mo, xx + tw / 2, top + 48, { font: F.ui(26, 800), color: '#FFFFFF', align: 'center', alpha: a });
      kt(ctx, d, xx + tw / 2, top + 250, { font: F.head(150), color: c.ink, align: 'center', alpha: a });
      kt(ctx, lab, xx + tw / 2, top + 340, { font: F.ui(28, 800), color: c.ink, align: 'center', alpha: a, maxW: tw - 30, lh: 34 }); });
  }
  if (p.table) exTableBody(ctx, s, [x + 20, top - 10, w - 40, y + h - top - 10], c, p.table);
  if (p.chips) {              // a set of names: {items: [..], hl: [name, cue], cue}
    p.chips.items.forEach((n2, i) => { const hl = p.chips.hl && n2 === p.chips.hl[0] && s.t > ecue(s, p.chips.hl[1], 1e9);
      exChip(ctx, n2, x + 36 + (i % p.chips.cols) * ((w - 72) / p.chips.cols), top + Math.floor(i / p.chips.cols) * 80, hl ? c.main : c.t[1], hl ? '#FFFFFF' : c.ink, 26, eia(s, ecue(s, p.chips.cue, 0.6) + i * 0.05)); });
    if (p.chips.callout) exChip(ctx, p.chips.callout[0], x + w - 40 - p.chips.callout[0].length * 17, y + h - 80, '#FFD60A', c.ink, 28, eia(s, ecue(s, p.chips.callout[1], 2)));
  }
  if (p.draw) p.draw(ctx, s, b, c);
}
// a table: { cols: [[label, share]], rows: [[cells], cue, {hl, trapCol}], size }
function exTableBody(ctx, s, b, c, t) {
  const [x, y, w, h] = b, hh = 60, rh = Math.min(t.rowH || 110, (h - hh - 10) / t.rows.length), z = t.size || 28;
  ctx.save(); rr(ctx, x, y, w, hh, 14); ctx.fillStyle = c.main; ctx.fill(); ctx.restore();
  let cx = x + 22; const xs = t.cols.map(([, sh]) => { const v = cx; cx += (w - 44) * sh; return v; });
  t.cols.forEach(([lab], i) => kt(ctx, lab.toUpperCase(), xs[i], y + 40, { font: F.ui(24, 800), color: '#FFFFFF' }));
  t.rows.forEach(([cells, cw, op = {}], r) => {
    const yy = y + hh + 8 + r * rh, a = eia(s, ecue(s, cw, 0.5 + r * 0.25));
    ctx.save(); ctx.globalAlpha *= a; rr(ctx, x, yy, w, rh - 8, 12); ctx.fillStyle = op.hl ? c.t[2] : c.t[r % 2]; ctx.fill(); if (op.hl) { ctx.fillStyle = c.main; ctx.fillRect(x, yy, 8, rh - 8); } ctx.restore();
    cells.forEach((cell, i) => {
      const cw2 = (i < t.cols.length - 1 ? xs[i + 1] : x + w - 22) - xs[i] - 14;
      ctx.save(); ctx.font = F.ui(z, i === 0 ? 800 : 600); const lines = wrap(ctx, cell, cw2); ctx.restore();
      const lh = z * 1.2, tp = yy + (rh - 8 - lines.length * lh) / 2 + lh * 0.8;
      lines.forEach((l, j) => kt(ctx, l, xs[i], tp + j * lh, { font: F.ui(z, i === 0 ? 800 : 600), color: c.ink, alpha: a }));
      if (op.trapCol === i) { const at = ecue(s, op.trapCue || 'trap', 1e9); if (s.t > at) { ctx.save(); ctx.strokeStyle = '#E63946'; ctx.lineWidth = 4; ctx.globalAlpha = appear(s.t, at); rr(ctx, xs[i] - 10, yy + 6, cw2 + 16, rh - 20, 10); ctx.stroke(); ctx.restore(); } }
    });
  });
}

// ---------- slide types ----------
const EX_TYPES = {
  title(ctx, s, T, d) {
    const c = EP[d.col || 'purple']; exSlide(ctx, c, T);
    exChip(ctx, `${EX.series} · ${T.cat} · TOPIC ${String(T.n).padStart(2, '0')} OF ${EX.total}`, 120, 150, '#FFFFFF', c.ink, 28, eia(s, 0.1));
    const z = fitFont(ctx, T.title, 1040, 120, 64); revealWords(ctx, T.title, 116, 330, span(s.t, 0.2, 1.4), { font: F.head(z), color: '#FFFFFF', maxW: 1180, lh: z * 1.1 });
    let x = 120; T.tags.forEach((t, i) => { x += exChip(ctx, t, x, 400, c.t[1], c.ink, 28, eia(s, 0.8 + i * 0.25)) + 14; });
    kt(ctx, 'In this topic', 120, 560, { font: F.ui(28, 800), color: c.t[2], alpha: eia(s, 1.2) });
    T.steps.forEach((t, i) => exChip(ctx, `${i + 1}  ${t}`, 120 + (i % 3) * 330, 590 + Math.floor(i / 3) * 76, 'rgba(255,255,255,0.18)', '#FFFFFF', 26, eia(s, 1.4 + i * 0.12)));
    if (T.locator) {
      const L = T.locator, b = [1260, 160, 588, 780];
      exMap(ctx, s, b, c, { bounds: L.bounds || [67, 6, 98, 37], world: L.world, highlight: L.highlight, focus: L.focus, pins: (L.pins || []).map(([l, ll, off]) => [l, ll, off, 1.0, { bg: c.main, fg: '#FFFFFF' }]) });
    }
  },
  news(ctx, s, T, d) {
    const c = EP[d.col || 'orange']; exSlide(ctx, c, T, 'NEWS');
    exBox(ctx, 72, 150, 800, 860);
    exChip(ctx, 'WHY IN NEWS', 112, 186, c.main, '#FFFFFF', 30);
    const hz = d.hz || 50; revealWords(ctx, d.headline, 112, 330, span(s.t, 0.3, 2.2), { font: F.head(hz), color: c.ink, maxW: 720, lh: hz * 1.27 });
    d.facts.forEach(([l, v, cw], i) => {
      const a = eia(s, ecue(s, cw, 1 + i * 0.6)), y = 1010 - 40 - (d.facts.length - i) * 128; exBox(ctx, 112, y, 720, 112, { fill: c.t[1 + i % 2], alpha: a, r: 16 });
      exChip(ctx, l, 132, y + 12, c.main, '#FFFFFF', 22, a); kt(ctx, v, 134, y + 92, { font: F.ui(30, 800), color: c.ink, alpha: a, maxW: 680 });
    });
    exPanel(ctx, s, [912, 150, 936, 860], c, d.side);
  },
  steps(ctx, s, T, d) {
    const c = EP[d.col || 'purple']; exSlide(ctx, c, T, d.step); exHead(ctx, c, d.head);
    const full = !d.side, bw = full ? 1776 : 1000, n = d.items.length, cols = full && n > 3 ? 2 : 1, rows = Math.ceil(n / cols), ih = (790 - (rows - 1) * 22) / rows;
    d.items.forEach(([h2, v, cw], i) => {
      const col = Math.floor(i / rows), row = i % rows, x = 72 + col * ((bw + 24) / cols), y = 220 + row * (ih + 22), w = bw / cols - (cols > 1 ? 12 : 0), a = eia(s, ecue(s, cw, 0.6 + i * 0.6));
      exBox(ctx, x, y, w, ih, { bar: c.t[4 - (i % 2)], alpha: a });
      ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.arc(x + 76, y + 70, 40, 0, 7); ctx.fillStyle = c.main; ctx.fill(); ctx.restore();
      kt(ctx, String(i + 1), x + 76, y + 88, { font: F.head(48), color: '#FFFFFF', align: 'center', alpha: a });
      const th = kt(ctx, h2, x + 140, y + 82, { font: F.ui(34, 800), color: c.ink, alpha: a, maxW: w - 180, lh: 40 });
      kt(ctx, v, x + 140, y + 92 + th, { font: F.ui(28, 600), color: c.ink, alpha: a, maxW: w - 180, lh: 36 });
    });
    if (d.side) exPanel(ctx, s, [1096, 220, 752, 790], c, d.side);
  },
  table(ctx, s, T, d) {
    const c = EP[d.col || 'blue']; exSlide(ctx, c, T, d.step); exHead(ctx, c, d.head);
    if (d.side) { exBox(ctx, 72, 220, 1080, 790); exTableBody(ctx, s, [92, 240, 1040, 750], c, d.table); exPanel(ctx, s, [1192, 220, 656, 790], c, d.side); }
    else { exBox(ctx, 72, 220, 1776, 790); exTableBody(ctx, s, [92, 240, 1736, 750], c, d.table); }
  },
  panel(ctx, s, T, d) {         // one big custom panel (map, chart) with optional notes beside
    const c = EP[d.col || 'purple']; exSlide(ctx, c, T, d.step); exHead(ctx, c, d.head);
    exPanel(ctx, s, d.notes ? [72, 220, 1180, 790] : [72, 220, 1776, 790], c, d.side);
    if (d.notes) { exBox(ctx, 1292, 220, 556, 790, { bar: c.main }); let y = 300;
      d.notes.forEach(([l, v, cw], i) => { const a = eia(s, ecue(s, cw, 0.8 + i * 0.5)); exChip(ctx, l, 1330, y - 40, c.main, '#FFFFFF', 22, a);
        const hh = kt(ctx, v, 1332, y + 30, { font: F.ui(30, 800), color: c.ink, maxW: 480, lh: 38, alpha: a }); y += hh + 90; }); }
  },
  trap(ctx, s, T, d) {
    const c = EP.red; exSlide(ctx, c, T, 'TRAP'); exHead(ctx, c, 'PRELIMS TRAP');
    const wide = !d.side, bw = wide ? 1776 : 860;
    exBox(ctx, 72, 220, bw, 260);
    exChip(ctx, 'UPSC MAY WRITE', 112, 250, c.main, '#FFFFFF', 26);
    const at = ecue(s, d.cue, 1.5), st = span(s.t, at, at + 0.6), sh = s.t > at - 0.7 && s.t < at ? 7 * Math.sin(s.t * 60) * span(s.t, at - 0.7, at - 0.4) : 0;
    const mz = fitFont(ctx, d.myth, bw - 90, 46, 32); kt(ctx, d.myth, 112 + sh, 390, { font: F.head(mz), color: c.ink });
    ctx.save(); ctx.font = F.head(mz); const mw = ctx.measureText(d.myth).width; ctx.restore();
    if (st > 0) { ctx.save(); ctx.strokeStyle = c.main; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(108, 374); ctx.lineTo(108 + (mw + 8) * easeOut(st), 374); ctx.stroke(); ctx.restore(); }
    const ta = eia(s, at + 0.3); exBox(ctx, 72, 520, bw, 490, { fill: '#E3F9EF', alpha: ta });
    exChip(ctx, '✓ CORRECT', 112, 550, '#06D6A0', '#0B3D2E', 26, ta);
    const th = kt(ctx, d.truth, 112, 680, { font: F.head(46), color: '#0B6E4F', maxW: bw - 90, lh: 58, alpha: ta });
    let y = 680 + th + 40; (d.extra || []).forEach(([t, cw], i) => { const h2 = kt(ctx, t, 112, y, { font: F.ui(30, 800), color: '#14213D', maxW: bw - 90, lh: 40, alpha: eia(s, ecue(s, cw, at + 1 + i * 0.6)) }); y += h2 + 18; });
    if (d.side) exPanel(ctx, s, [972, 220, 876, 790], c, d.side);
  },
  mcq(ctx, s, T, d) { exMcq(ctx, s, T, d, false); },
  answer(ctx, s, T, d) { exMcq(ctx, s, T, d, true); },
  notes(ctx, s, T, d) {
    const c = EP.yellow; exSlide(ctx, c, T, 'NOTES');
    ctx.save(); ctx.translate(960, 580); ctx.rotate(-0.008); ctx.translate(-960, -580);
    exBox(ctx, 140, 140, 1640, 880, { fill: '#FFFDF6' });
    ctx.strokeStyle = 'rgba(58,134,255,0.18)'; ctx.lineWidth = 2; for (let y = 310; y < 1000; y += 76) { ctx.beginPath(); ctx.moveTo(180, y); ctx.lineTo(1740, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(230,57,70,0.35)'; ctx.beginPath(); ctx.moveTo(290, 150); ctx.lineTo(290, 1010); ctx.stroke();
    exChip(ctx, 'WRITE THIS DOWN', 180, 170, c.main, c.ink, 28);
    const HL = ['#FFE58A', '#D6C2FF', '#B5D2FF', '#FFC79E', '#B9F3D8', '#FFB3B9'], z = d.lines.length > 4 ? 30 : 32, lh = z * 2;
    let y = 290; d.lines.forEach((t, i) => {
      const a = eia(s, 0.4 + i * 0.45);
      ctx.save(); ctx.globalAlpha *= a * 0.8; ctx.fillStyle = HL[i % HL.length]; ctx.font = F.ui(z, 800); wrap(ctx, t, 1400).forEach((l, j) => ctx.fillRect(316, y - z + j * lh, (ctx.measureText(l).width + 16) * easeOut(span(s.t, 0.4 + i * 0.45, 1.2 + i * 0.45)), z + 12)); ctx.restore();
      const n = kt(ctx, t, 324, y + 2, { font: F.ui(z, 800), color: '#14213D', maxW: 1400, lh, alpha: a }) / lh; y += n * lh + 40;
    });
    kt(ctx, `Topic ${T.n} · this card is in this week's PDF`, 1720, 995, { font: F.hand(40), color: '#5A4A00', align: 'right', alpha: eia(s, 2.4) });
    ctx.restore();
  },
};
function exMcq(ctx, s, T, d, answer) {
  const c = EP[d.col || 'purple']; exSlide(ctx, c, T, T ? 'PRACTICE' : null);   // no topic (T) = the opening pre-question
  exBox(ctx, 72, 140, 1776, 880);
  exChip(ctx, d.label || 'PRACTICE · UPSC FORMAT', 112, 170, c.main, '#FFFFFF', 26);
  kt(ctx, d.stem || 'Consider the following statements:', 112, 290, { font: F.head(44), color: c.ink });
  const typed = answer ? 1 : span(s.t, 0.2, Math.min(s.d - 1, s.w(d.typeCue || 'correct'))), n = d.qs.length;
  let y = 380; d.qs.forEach((q, i) => {
    const a = clamp(typed * (n + 2) - i);
    const hh = kt(ctx, `${i + 1}.  ${q}`, 140, y, { font: F.ui(32, 700), color: c.ink, maxW: 1500, lh: 40, alpha: a });
    if (answer) { const ok = d.ok[i]; exChip(ctx, ok ? '✓' : '✗', 1700, y - 42, ok ? '#06D6A0' : '#E63946', ok ? '#0B3D2E' : '#FFFFFF', 32, eia(s, 0.6 + i * 0.4)); }
    y += Math.max(hh, 40) + 36;
  });
  kt(ctx, d.ask || 'How many of the above statements are correct?', 112, 790, { font: F.head(40), color: c.ink, alpha: clamp(typed * (n + 2) - n) });
  const opts = d.opts || ['(a) Only one', '(b) Only two', '(c) All three', '(d) None'], k = d.key ?? (d.ok.filter(Boolean).length === 0 ? 3 : d.ok.filter(Boolean).length - 1);
  opts.forEach((op, i) => {
    const x = 140 + i * 420, at = answer ? ecue(s, d.keyCue || 'answer', 0.3) : 1e9, sel = answer && i === k && s.t > at, a = clamp(typed * (n + 2) - n - 1);
    if (sel) { const q = span(s.t, at, at + 1.3); if (q < 1) { ctx.save(); for (let j = 0; j < 26; j++) { const ang = j * 2.4, dist = 40 + 260 * easeOut(q) * (0.6 + 0.4 * ((j * 7) % 5) / 4);
      ctx.globalAlpha = 1 - q; ctx.fillStyle = ['#FFD60A', '#06D6A0', '#7C3AED', '#F97316', '#3B82F6'][j % 5]; ctx.beginPath(); ctx.arc(x + 190 + Math.cos(ang) * dist, 875 + Math.sin(ang) * dist * 0.6 + 120 * q * q, 9, 0, 7); ctx.fill(); } ctx.restore(); } }
    exBox(ctx, x, 830, 380, 90, { fill: sel ? '#06D6A0' : c.t[1], alpha: a, r: 16 });
    kt(ctx, op, x + 30, 888, { font: F.ui(32, 800), color: c.ink, alpha: a });
  });
  if (answer) kt(ctx, d.reason, 112, 985, { font: F.hand(44), color: '#0B6E4F', alpha: eia(s, ecue(s, d.reasonCue || 'because', 2)), maxW: 1700 });
  else if (s.hold) {
    const h = s.hold, ra = appear(s.t, h.at - 0.2, 0.4), cd = clamp((s.t - h.at) / h.dur), left = Math.ceil(h.dur - cd * h.dur);
    ctx.save(); ctx.globalAlpha = ra; ctx.beginPath(); ctx.arc(1720, 240, 70, 0, 7); ctx.fillStyle = c.t[0]; ctx.fill();
    ctx.lineWidth = 12; ctx.strokeStyle = c.t[1]; ctx.beginPath(); ctx.arc(1720, 240, 56, 0, 7); ctx.stroke();
    ctx.strokeStyle = c.main; ctx.beginPath(); ctx.arc(1720, 240, 56, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.stroke(); ctx.restore();
    kt(ctx, String(clamp(left, 0, h.dur)), 1720, 262, { font: F.head(60), align: 'center', color: c.main, alpha: ra });
  }
}
function exEnter(ctx, s, fn) {            // slide entrance: a short settle from 104% to 100%
  const k = 1 + 0.04 * (1 - easeOut(span(s.t, 0, 0.7))); ctx.save(); ctx.translate(960, 540); ctx.scale(k, k); ctx.translate(-960, -540); fn(); ctx.restore();
}
// the intro sting: the channel emblem over turning gold rays, a shine sweep, then the series chip and a line
function exIntro(ctx, s, chip, line) {
  const c = EP.purple; exSlide(ctx, c);
  const a = eia(s, 0.2, 0.9), k = 0.6 + 0.4 * clamp(pop(s.t, 0.2, 0.9));
  ctx.save(); ctx.translate(960, 470); ctx.rotate(GT * 0.15); ctx.globalAlpha = 0.18 * a;     // turning light rays behind the emblem
  for (let i = 0; i < 18; i++) { ctx.rotate(Math.PI / 9); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-50, -900); ctx.lineTo(50, -900); ctx.closePath(); ctx.fillStyle = '#FFD60A'; ctx.fill(); }
  ctx.restore();
  const g = ctx.createRadialGradient(960, 470, 50, 960, 470, 420); g.addColorStop(0, 'rgba(255,214,10,0.35)'); g.addColorStop(1, 'rgba(255,214,10,0)'); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.save(); ctx.translate(960, 470); ctx.scale(k, k); ctx.rotate((1 - clamp(pop(s.t, 0.2, 0.9))) * -0.5); ctx.translate(-960, -470); exLogo(ctx, 960, 470, 330, a);
  const sw = span(s.t, 1.2, 2.2); if (sw > 0 && sw < 1) {                                       // a shine sweep across the emblem
    ctx.beginPath(); ctx.arc(960, 470, 320, 0, 7); ctx.clip(); const sx = 560 + 800 * sw, sg = ctx.createLinearGradient(sx - 90, 0, sx + 90, 0);
    sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, 'rgba(255,255,255,0.45)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillRect(sx - 90, 120, 180, 720); }
  ctx.restore();
  const ta = eia(s, s.w('this') - 0.2);
  ctx.save(); ctx.font = F.ui(30, 800); const cwid = ctx.measureText(chip).width + 39; ctx.restore(); exChip(ctx, chip, 960 - cwid / 2, 900, '#FFFFFF', c.ink, 30, ta);
  kt(ctx, line, 960, 1010, { font: F.ui(30, 700), color: c.t[1], align: 'center', alpha: eia(s, s.w('week') - 0.2) });
};
// the examiner's tricks: a closing slide that names the trap patterns of the week; items = [[trick, examples, cue]]
function exTricks(ctx, s, title, items) {
  const c = EP.violet; exSlide(ctx, c);
  exChip(ctx, title, 72, 40, '#FFFFFF', c.ink, 28, eia(s, 0.1));
  items.forEach(([h, ex, cw], i) => {
    // the three cards land at once (dimmed) so the slide is never empty; each lights up, with its examples, on its cue word
    const y = 140 + i * 300, a0 = eia(s, 0.3 + i * 0.25), a = eia(s, ecue(s, cw, 0.5 + i * 1.5)), on = 0.45 + 0.55 * a;
    exBox(ctx, 72, y, 1776, 270, { alpha: a0, bar: '#E63946' });
    ctx.save(); ctx.globalAlpha *= a0 * on; ctx.beginPath(); ctx.arc(170, y + 135, 58, 0, 7); ctx.fillStyle = c.main; ctx.fill(); ctx.restore();
    kt(ctx, String(i + 1), 170, y + 158, { font: F.head(64), color: '#FFFFFF', align: 'center', alpha: a0 * on });
    kt(ctx, h, 270, y + 105, { font: F.head(46), color: c.ink, alpha: a0 * on, maxW: 1520 });
    kt(ctx, ex, 270, y + 175, { font: F.ui(30, 700), color: c.ink, alpha: a * 0.85, maxW: 1520, lh: 40 });
  });
}
// register a topic: T = { n, cat, title, short, tags, locator, slides: [{type, ...}] }
function exTopic(T) {
  const order = []; for (const sl of T.slides) { const st = { news: 'NEWS', trap: 'TRAP', mcq: 'PRACTICE', answer: 'PRACTICE', notes: 'NOTES' }[sl.type] || sl.step; if (st && !order.includes(st)) order.push(st); }
  T.steps = order;
  T.slides.forEach((sl, i) => { SCENES['S' + T.n + String(i + 1).padStart(2, '0')] = (ctx, s) => exEnter(ctx, s, () => (sl.draw || EX_TYPES[sl.type])(ctx, s, T, sl)); });
}
