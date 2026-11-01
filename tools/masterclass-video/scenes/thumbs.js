// W44 thumbnails (CLAUDE.md §7): at most 3 words, white and yellow, top-left; one hero visual on the right third;
// the brand mark bottom-left; no face. Render each scene as a still, then scale to 1280×720.
window.NO_PUSH = true; window.EX_LOGO = true;

function thumbBase(ctx, pal) {
  const c = EP[pal]; const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, c.bg[0]); g.addColorStop(1, c.bg[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const gl = ctx.createRadialGradient(1380, 560, 60, 1380, 560, 900); gl.addColorStop(0, 'rgba(255,214,10,0.28)'); gl.addColorStop(1, 'rgba(255,214,10,0)'); ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
  return c;
}
function thumbWords(ctx, lines) {        // [[text, colour], …] stacked top-left, heavy weight with a dark outline
  lines.forEach(([t, col], i) => {
    const z = fitFont(ctx, t, 900, 190, 90), y = 230 + i * z * 1.02;
    ctx.save(); ctx.font = F.head(z); ctx.lineJoin = 'round'; ctx.lineWidth = 18; ctx.strokeStyle = 'rgba(20,6,40,0.9)'; ctx.strokeText(t, 80, y);
    ctx.fillStyle = col; ctx.fillText(t, 80, y); ctx.restore();
  });
}
function thumbBrand(ctx) {
  exLogo(ctx, 150, 930, 105);
  exChip(ctx, 'DECODE UPSC', 270, 900, '#FFD60A', '#1E2228', 40);
}
function thumbPaper(ctx, opts, pick, stem) {   // a tilted question paper with the trap option circled in red
  ctx.save(); ctx.translate(1450, 560); ctx.rotate(0.06);
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
  rr(ctx, -380, -430, 760, 860, 26); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
  kt(ctx, stem, -320, -320, { font: F.head(54), color: '#2E1065', maxW: 640 });
  for (let i = 0; i < 3; i++) { ctx.fillStyle = '#E5DBFF'; rr(ctx, -320, -230 + i * 70, 620 - i * 90, 26, 13); ctx.fill(); }
  opts.forEach((o, i) => kt(ctx, o, -300, 60 + i * 95, { font: F.ui(56, 800), color: '#2E1065' }));
  ctx.strokeStyle = '#E63946'; ctx.lineWidth = 12; ctx.beginPath(); ctx.ellipse(-130, 40 + pick * 95, 230, 62, -0.05, 0, 7); ctx.stroke();
  ctx.restore();
}
function thumbCyclone(ctx) {            // a flat cyclone diagram: spiral bands around a clear eye (no imagery)
  ctx.save(); ctx.translate(1430, 540);
  const g = ctx.createRadialGradient(0, 0, 20, 0, 0, 430); g.addColorStop(0, '#0EA5E9'); g.addColorStop(1, '#1E3A8A'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 430, 0, 7); ctx.fill();
  for (let arm = 0; arm < 4; arm++) { ctx.beginPath(); for (let k = 0; k <= 120; k++) { const t = k / 120, r = 60 + 360 * t, a = arm * Math.PI / 2 + t * 4.2; const x = Math.cos(a) * r, y = Math.sin(a) * r; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 46 - arm * 4; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, 0, 58, 0, 7); ctx.fillStyle = '#0B1E4D'; ctx.fill();
  ctx.restore();
  exChip(ctx, 'VERY SEVERE · 118–166 km/h', 1150, 1000, '#FFFFFF', '#1E3A8A', 36);
}
function thumbChecks(ctx) {              // two answer cards: the trap struck in red, the fact ticked in green
  [['Saudi Arabia is in BRICS', false], ['CDRI sits in New Delhi', true]].forEach(([t, ok], i) => {
    ctx.save(); ctx.translate(1440, 380 + i * 330); ctx.rotate(i ? 0.03 : -0.04);
    ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 40; rr(ctx, -420, -120, 840, 240, 28); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.fillStyle = ok ? '#06D6A0' : '#E63946'; ctx.beginPath(); ctx.arc(-320, 0, 72, 0, 7); ctx.fill();
    kt(ctx, ok ? '✓' : '✗', -320, 30, { font: F.head(96), color: '#FFFFFF', align: 'center' });
    kt(ctx, t, -220, 18, { font: F.ui(50, 800), color: '#2E1065', maxW: 600 });
    if (!ok) { ctx.strokeStyle = '#E63946'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-225, 2); ctx.lineTo(380, 2); ctx.stroke(); }
    ctx.restore();
  });
}
function thumbMap(ctx, s, pins) {       // AP and Telangana on the Survey of India outline, with labelled pins
  const c = EP.teal; exMap(ctx, s, [1060, 110, 790, 860], c, { bounds: [75.5, 12.3, 85.5, 20.2], focus: { 'Andhra Pradesh': '#14B8A6', Telangana: '#7C3AED' },
    pins: pins.map(([l, ll, off]) => [l, ll, off, 0.1, { bg: '#1E2228', fg: '#FFFFFF' }]) });
}

// Prelims Grid: three concepts for YouTube's title and thumbnail test (Test & Compare)
SCENES.S1 = (ctx, s) => { thumbBase(ctx, 'purple'); thumbWords(ctx, [['16 PRELIMS', '#FFFFFF'], ['TRAPS', '#FFD60A']]); thumbPaper(ctx, ['(a) Only one', '(b) Only two', '(c) All three', '(d) None'], 3, 'How many are correct?'); thumbBrand(ctx); };
SCENES.S2 = (ctx, s) => { thumbBase(ctx, 'blue'); thumbWords(ctx, [['ARNAB', '#FFD60A'], ['+ 15 MORE', '#FFFFFF']]); thumbCyclone(ctx); thumbBrand(ctx); };
SCENES.S3 = (ctx, s) => { thumbBase(ctx, 'violet'); thumbWords(ctx, [['SPOT THE', '#FFFFFF'], ['TRAP', '#FFD60A']]); thumbChecks(ctx); thumbBrand(ctx); };
// AP–TG Desk
SCENES.S4 = (ctx, s) => { thumbBase(ctx, 'purple'); thumbWords(ctx, [['WHO', '#FFFFFF'], ['DECIDES?', '#FFD60A']]); thumbMap(ctx, s, [['Hyderabad', [78.47, 17.38], [-150, -70]], ['Amaravati', [80.52, 16.51], [60, -90]]]); thumbBrand(ctx); };
SCENES.S5 = (ctx, s) => { thumbBase(ctx, 'violet'); thumbWords(ctx, [['7 GROUP-1', '#FFFFFF'], ['TRAPS', '#FFD60A']]); thumbPaper(ctx, ['(a) 1 only', '(b) 1 and 2 only', '(c) 2 and 3 only', '(d) 1, 2 and 3'], 1, 'Which are correct?'); thumbBrand(ctx); };
SCENES.S6 = (ctx, s) => { thumbBase(ctx, 'teal'); thumbWords(ctx, [['FRESH OR', '#FFFFFF'], ['BRACKISH?', '#FFD60A']]); thumbMap(ctx, s, [['Kolleru', [81.22, 16.62], [-210, -40]], ['Pulicat', [80.2, 13.6], [-200, 10]], ['Chilika', [85.3, 19.7], [-230, 40]]]); thumbBrand(ctx); };

// ---------- v2 "pro" set (1 Nov 2026), from the thumbnail research: readable at ~150×83 px on a phone (under ~12
// characters, heavy sans, yellow/white on near-black), one concrete hero object instead of a face, a number,
// a consistent series tag, nothing in the bottom-right (the duration badge). Three different concepts for Test & Compare.
function proBase(ctx, glow) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0B0820'); g.addColorStop(1, '#1B0B45'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = ctx.createRadialGradient(1420, 520, 40, 1420, 520, 760); r.addColorStop(0, glow); r.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = r; ctx.fillRect(0, 0, W, H);
  const v = ctx.createRadialGradient(960, 540, 500, 960, 540, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
function proWord(ctx, t, x, y, size, col) {
  ctx.save(); ctx.font = F.ui(size, 900); ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.11; ctx.strokeStyle = '#05030F'; ctx.strokeText(t, x, y);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 24; ctx.fillStyle = col; ctx.fillText(t, x, y); ctx.restore();
}
function proTag(ctx, t) { exChip(ctx, t, 84, 70, '#FFD60A', '#0B0820', 40); }
function proBrand(ctx) { exLogo(ctx, 150, 945, 95); exChip(ctx, 'DECODE UPSC', 262, 918, '#FFD60A', '#0B0820', 36); }
function proOMR(ctx) {                     // an exam answer sheet: one bubble filled, ringed and struck in red (the trap)
  ctx.save(); ctx.translate(1430, 560); ctx.rotate(0.07);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
  rr(ctx, -360, -440, 720, 880, 28); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#7C3AED'; rr(ctx, -360, -440, 720, 110, 28); ctx.fill(); ctx.fillRect(-360, -360, 720, 30);
  kt(ctx, 'ANSWER SHEET', 0, -368, { font: F.ui(48, 900), color: '#FFFFFF', align: 'center' });
  const fill = [1, 3, 0, 2], ok = [true, false, true, true];
  for (let q = 0; q < 4; q++) {
    const y = -230 + q * 165;
    kt(ctx, `Q${q + 1}`, -300, y + 20, { font: F.ui(52, 900), color: '#2E1065' });
    for (let o = 0; o < 4; o++) {
      const x = -150 + o * 120; ctx.beginPath(); ctx.arc(x, y, 44, 0, 7);
      ctx.fillStyle = o === fill[q] ? (ok[q] ? '#1E1B4B' : '#1E1B4B') : '#FFFFFF'; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = '#2E1065'; ctx.stroke();
      if (o !== fill[q]) kt(ctx, 'ABCD'[o], x, y + 16, { font: F.ui(40, 800), color: '#6D28D9', align: 'center' });
    }
    if (!ok[q]) { const x = -150 + fill[q] * 120; ctx.lineWidth = 14; ctx.strokeStyle = '#E63946'; ctx.beginPath(); ctx.arc(x, y, 70, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x - 95, y - 95); ctx.lineTo(x + 95, y + 95); ctx.moveTo(x + 95, y - 95); ctx.lineTo(x - 95, y + 95); ctx.stroke(); }
  }
  ctx.restore();
}
function proScore(ctx) {                   // a score card: ticks and one red cross, "16/16?"
  ctx.save(); ctx.translate(1440, 560); ctx.rotate(-0.05);
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
  rr(ctx, -340, -420, 680, 840, 28); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.shadowColor = 'transparent';
  kt(ctx, 'YOUR SCORE', 0, -320, { font: F.ui(52, 900), color: '#2E1065', align: 'center' });
  const marks = [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1];
  marks.forEach((m, i) => { const x = -210 + (i % 4) * 140, y = -190 + Math.floor(i / 4) * 150;
    ctx.beginPath(); ctx.arc(x, y, 54, 0, 7); ctx.fillStyle = m ? '#06D6A0' : '#E63946'; ctx.fill();
    kt(ctx, m ? '✓' : '✗', x, y + 26, { font: F.ui(76, 900), color: '#FFFFFF', align: 'center' }); });
  kt(ctx, '? / 16', 0, 330, { font: F.ui(120, 900), color: '#7C3AED', align: 'center' });
  ctx.restore();
}
function proCyclone(ctx) {
  ctx.save(); ctx.translate(1440, 540);
  const halo = ctx.createRadialGradient(0, 0, 60, 0, 0, 520); halo.addColorStop(0, 'rgba(56,189,248,0.55)'); halo.addColorStop(1, 'rgba(56,189,248,0)'); ctx.fillStyle = halo; ctx.fillRect(-560, -560, 1120, 1120);
  for (let arm = 0; arm < 5; arm++) { ctx.beginPath(); for (let k = 0; k <= 140; k++) { const t = k / 140, r = 50 + 400 * t, a = arm * 2 * Math.PI / 5 + t * 4.4; k ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    ctx.strokeStyle = `rgba(255,255,255,${0.95 - arm * 0.08})`; ctx.lineWidth = 58 - arm * 6; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, 0, 62, 0, 7); ctx.fillStyle = '#0B0820'; ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#FFD60A'; ctx.stroke();
  ctx.restore();
  exChip(ctx, 'VERY SEVERE · 118–166 km/h', 1120, 70, '#FFFFFF', '#0B0820', 36);
}
SCENES.S7 = (ctx, s) => { proBase(ctx, 'rgba(124,58,237,0.75)'); proTag(ctx, 'WEEK 44 · UPSC'); proWord(ctx, '16', 80, 480, 330, '#FFD60A'); proWord(ctx, 'TRAPS', 84, 680, 190, '#FFFFFF'); proOMR(ctx); proBrand(ctx); };
SCENES.S8 = (ctx, s) => { proBase(ctx, 'rgba(6,214,160,0.45)'); proTag(ctx, 'WEEK 44 · UPSC'); proWord(ctx, 'SCORE', 84, 360, 170, '#FFFFFF'); proWord(ctx, '16/16?', 80, 610, 250, '#FFD60A'); proScore(ctx); proBrand(ctx); };
SCENES.S9 = (ctx, s) => { proBase(ctx, 'rgba(14,165,233,0.55)'); proTag(ctx, 'WEEK 44 · UPSC'); proWord(ctx, 'ARNAB', 80, 400, 230, '#FFD60A'); proWord(ctx, '+15 MORE', 84, 590, 150, '#FFFFFF'); proCyclone(ctx); proBrand(ctx); };
