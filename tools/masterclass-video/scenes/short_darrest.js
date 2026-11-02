// W45 Short: "digital arrest", the Supreme Court's 29 Oct 2026 hearing, and the exam's who's who. Needs short_kit.js:
//   node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_darrest.js <out> --size 1080x1920
// Every build lands on the word that names it; numbers appear at their final value (CLAUDE.md §6.2).

function chipV(ctx, s, t, x, y, at, fill, ink, size = 36) {
  const k = bounce(s.t, at); if (k <= 0) return 0;
  ctx.save(); ctx.font = F.ui(size, 900); const w = ctx.measureText(t).width + 60; ctx.restore();
  ctx.save(); ctx.translate(x + w / 2, y + 40); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 40));
  exBox(ctx, x, y, w, 80, { fill, r: 40 }); kt(ctx, t, x + 30, y + 40 + size * 0.36, { font: F.ui(size, 900), color: ink }); ctx.restore();
  return w;
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [["'DIGITAL ARREST'?", '#FFD60A', 104, -1], ['WHAT UPSC WILL ASK', '#FFFFFF', 70, -0.8]]); };   // band from frame 1: the thumbnail

SCENES.S2 = (ctx, s) => {                   // how the scam works: three steps, then "not in any law"
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'HOW THE SCAM WORKS');
  const steps = [['1', "Fake 'officer' on a video call", 'video'], ['2', 'Kept on camera for hours', 'camera'], ['3', "Money to a 'safe account' = MULE ACCOUNT", 'mule']];
  steps.forEach(([n, t, cue], i) => {
    const y = CAM_TOP + 150 + i * 190, k = bounce(s.t, ecue(s, cue)); if (k <= 0) return;
    if (i) { ctx.save(); ctx.strokeStyle = '#E9D5FF'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(130, y - 50); ctx.lineTo(130, y); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.translate(W / 2, y + 70); ctx.scale(k, k); ctx.translate(-W / 2, -(y + 70));
    exBox(ctx, 50, y, W - 100, 140, { fill: i === 2 ? '#FFD60A' : '#FFFFFF', r: 24 });
    ctx.beginPath(); ctx.arc(130, y + 70, 44, 0, 7); ctx.fillStyle = '#7C3AED'; ctx.fill();
    kt(ctx, n, 130, y + 88, { font: F.ui(52, 900), color: '#FFFFFF', align: 'center' });
    kt(ctx, t, 200, y + 84, { font: F.ui(38, 900), color: '#1B0B45', maxW: W - 290 }); ctx.restore();
  });
  const tl = ecue(s, 'law'), k = span(s.t, tl, tl + 0.35);
  if (k > 0) {                              // the stamp slams down from large to size
    const sc = 1 + 1.4 * (1 - easeOut(k));
    ctx.save(); ctx.globalAlpha = Math.min(1, k * 2); ctx.translate(W / 2, CAM_TOP + 860); ctx.rotate(-0.06); ctx.scale(sc, sc);
    ctx.fillStyle = 'rgba(27,11,69,0.85)'; rr(ctx, -360, -75, 720, 150, 18); ctx.fill();
    ctx.strokeStyle = '#E63946'; ctx.lineWidth = 10; rr(ctx, -360, -75, 720, 150, 18); ctx.stroke();
    kt(ctx, '"DIGITAL ARREST"', 0, -12, { font: F.ui(40, 900), color: '#FFFFFF', align: 'center' });
    kt(ctx, 'NOT IN ANY LAW', 0, 52, { font: F.ui(64, 900), color: '#E63946', align: 'center' }); ctx.restore();
  }
};

SCENES.S3 = (ctx, s) => {                   // the case, and its scale
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE CASE');
  clipV(ctx, 50, CAM_TOP + 115, W - 100, 400, bounce(s.t, 0.1), 'OCT 2025 · SUPREME COURT · SUO MOTU', "SC takes up digital-arrest scams on its own after a senior citizen's letter", 'LiveLaw · Tribune · newsonair', -0.03);
  [['21,900+', 'complaints', 'complaints', 50, '#FFD60A'], ['₹647 crore', 'lost', 'crore', 560, '#06D6A0']].forEach(([big, sub, cue, x, fill]) => {
    const k = bounce(s.t, ecue(s, cue)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 235, CAM_TOP + 660); ctx.scale(k, k); ctx.translate(-(x + 235), -(CAM_TOP + 660));
    exBox(ctx, x, CAM_TOP + 570, 470, 190, { fill, r: 26 });
    kt(ctx, big, x + 235, CAM_TOP + 670, { font: F.ui(70, 900), color: '#1B0B45', align: 'center' });
    kt(ctx, sub, x + 235, CAM_TOP + 728, { font: F.ui(36, 800), color: '#1B0B45', align: 'center' }); ctx.restore();
  });
  kt(ctx, 'Jan–Aug 2026 · Home Ministry to the Supreme Court (reported)', 64, CAM_TOP + 820, { font: F.ui(28, 700), color: '#E9D5FF', alpha: eia(s, ecue(s, 'crore') + 0.4), maxW: W - 120 });
};

SCENES.S4 = (ctx, s) => {                   // one case, three jobs: the mind map that links the institutions
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'ONE CASE, THREE JOBS', 'What the Court asked each institution to do');
  const k0 = bounce(s.t, 0.15);
  if (k0 > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 245); ctx.scale(k0, k0); ctx.translate(-W / 2, -(CAM_TOP + 245));
    exBox(ctx, 190, CAM_TOP + 190, 700, 110, { fill: '#FFD60A', r: 55 });
    kt(ctx, 'SC SUO MOTU CASE', W / 2, CAM_TOP + 262, { font: F.ui(52, 900), color: '#1B0B45', align: 'center' }); ctx.restore(); }
  const nodes = [
    ['CBI', 'Pan-India probe', null, 'cbi', '#FFFFFF'],
    ['RBI + BANKS', 'Hunt mule accounts', 'Compensate if negligent (proposed 29 Oct 2026)', 'rbi', '#FFFFFF'],
    ['I4C (HOME MINISTRY)', '1930 helpline · cybercrime.gov.in', 'Collects the complaint data', 'i-four-c', '#FFFFFF']];
  const ys = [CAM_TOP + 350, CAM_TOP + 560, CAM_TOP + 800], spineX = 110;
  nodes.forEach(([t, a1, a2, cue, fill], i) => {
    const at = ecue(s, cue), y = ys[i], h = a2 ? 200 : 160;
    const g = span(s.t, at - 0.3, at);
    if (g > 0) { ctx.save(); ctx.strokeStyle = '#FFD60A'; ctx.lineWidth = 6; ctx.beginPath();
      const y0 = i ? ys[i - 1] + 60 : CAM_TOP + 300; ctx.moveTo(spineX, y0); ctx.lineTo(spineX, y0 + (y + h / 2 - y0) * g); ctx.stroke();
      if (g >= 1) { ctx.beginPath(); ctx.moveTo(spineX, y + h / 2); ctx.lineTo(170, y + h / 2); ctx.stroke(); } ctx.restore(); }
    const k = bounce(s.t, at); if (k <= 0) return;
    ctx.save(); ctx.translate(600, y + h / 2); ctx.scale(k, k); ctx.translate(-600, -(y + h / 2));
    exBox(ctx, 170, y, W - 220, h, { fill, r: 24 });
    kt(ctx, t, 210, y + 62, { font: F.ui(44, 900), color: '#7C3AED' });
    kt(ctx, a1, 210, y + 116, { font: F.ui(36, 800), color: '#1B0B45', maxW: W - 300 });
    if (a2) { const k2 = eia(s, ecue(s, 'compensate')); kt(ctx, a2, 210, y + 166, { font: F.ui(30, 800), color: '#6B21A8', alpha: i === 1 ? k2 : 1, maxW: W - 300 }); }
    ctx.restore();
  });
};

SCENES.S5 = (ctx, s) => {                   // why states must consent, then the CBI trap
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE CBI TRAP', 'Why the Court had to ask the states');
  card(ctx, 50, CAM_TOP + 200, W - 100, 210, '#FFD60A', bounce(s.t, ecue(s, 'police')), [['POLICE = STATE SUBJECT', F.ui(60, 900), '#1B0B45'], ['Seventh Schedule, List II → CBI needs state consent', F.ui(32, 800), '#6B21A8']]);
  const ts = ecue(s, 'statutory'), k = bounce(s.t, ts - 0.6); if (k <= 0) return;
  ctx.save(); ctx.translate(W / 2, CAM_TOP + 720); ctx.scale(Math.min(k, 1.02), Math.min(k, 1.02)); ctx.translate(-W / 2, -(CAM_TOP + 720));
  ctx.fillStyle = 'rgba(230,57,70,0.95)'; rr(ctx, 30, CAM_TOP + 450, W - 60, 620, 30); ctx.fill();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 480, '#FFFFFF', '#E63946', 40, 1);
  exBox(ctx, 60, CAM_TOP + 580, W - 120, 120, { fill: '#FFFFFF' });
  kt(ctx, 'The CBI is a statutory body', 100, CAM_TOP + 658, { font: F.ui(44, 900), color: '#1B0B45' });
  ctx.restore();
  const tr = ecue(s, 'resolution'), sp = span(s.t, tr, tr + 0.4);
  if (sp > 0) { ctx.save(); ctx.strokeStyle = '#E63946'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(95, CAM_TOP + 642); ctx.lineTo(95 + (W - 200) * sp, CAM_TOP + 642); ctx.stroke(); ctx.restore(); }
  const k2 = bounce(s.t, tr + 0.3);
  if (k2 > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 860); ctx.scale(k2, k2); ctx.translate(-W / 2, -(CAM_TOP + 860));
    exBox(ctx, 60, CAM_TOP + 730, W - 120, 300, { fill: '#06D6A0' });
    kt(ctx, '✓ Set up by an MHA resolution, 1963', 100, CAM_TOP + 810, { font: F.ui(40, 900), color: '#053B2C', maxW: W - 200 });
    kt(ctx, 'Powers from the DSPE Act, 1946', 100, CAM_TOP + 890, { font: F.ui(38, 900), color: '#053B2C', maxW: W - 200 });
    kt(ctx, 'Section 6: state consent needed', 100, CAM_TOP + 965, { font: F.ui(34, 800), color: '#053B2C', maxW: W - 200 });
    ctx.restore(); }
};

SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [["NO 'DIGITAL ARREST' IN LAW", '#FFFFFF', 62, 'in law'], ['CALL 1930', '#FFD60A', 110, 'call nineteen']]); };
