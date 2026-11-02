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

SCENES.S2 = (ctx, s) => {                   // why in news: the hearing, then the numbers on their words
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY IN NEWS');
  clipV(ctx, 50, CAM_TOP + 115, W - 100, 400, bounce(s.t, 0.1), '29 OCT 2026 · SUPREME COURT', 'SC: banks should compensate digital-arrest victims where their negligence enabled the fraud', 'LiveLaw · MediaNama · LawChakra', -0.03);
  [['21,900+', 'complaints', 'complaints', 50, '#FFD60A'], ['₹647 crore', 'lost', 'crore', 560, '#06D6A0']].forEach(([big, sub, cue, x, fill]) => {
    const k = bounce(s.t, ecue(s, cue)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 235, CAM_TOP + 660); ctx.scale(k, k); ctx.translate(-(x + 235), -(CAM_TOP + 660));
    exBox(ctx, x, CAM_TOP + 570, 470, 190, { fill, r: 26 });
    kt(ctx, big, x + 235, CAM_TOP + 670, { font: F.ui(70, 900), color: '#1B0B45', align: 'center' });
    kt(ctx, sub, x + 235, CAM_TOP + 728, { font: F.ui(36, 800), color: '#1B0B45', align: 'center' }); ctx.restore();
  });
  kt(ctx, 'Jan–Aug 2026 · MHA to the Supreme Court (reported)', 64, CAM_TOP + 820, { font: F.ui(30, 700), color: '#E9D5FF', alpha: eia(s, ecue(s, 'crore') + 0.4) });
  kt(ctx, 'Bank liability: proposed at the hearing; RBI to frame rules', 64, 1870, { font: F.ui(28, 700), color: '#E9D5FF', alpha: eia(s, ecue(s, 'negligence')) });
};

SCENES.S3 = (ctx, s) => {                   // exam fact 1: no such thing in law
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'EXAM FACT 1');
  card(ctx, 50, CAM_TOP + 200, W - 100, 240, '#FFFFFF', bounce(s.t, ecue(s, 'digital')), [['"DIGITAL ARREST"', F.ui(84, 900), '#1B0B45'], ['a scam name, not a legal procedure', F.ui(36, 800), '#6B21A8']]);
  const tl = ecue(s, 'law'), k = span(s.t, tl, tl + 0.35);
  if (k > 0) {                              // the stamp slams down from large to size
    const sc = 1 + 1.4 * (1 - easeOut(k));
    ctx.save(); ctx.globalAlpha = Math.min(1, k * 2); ctx.translate(W / 2, CAM_TOP + 520); ctx.rotate(-0.08); ctx.scale(sc, sc);
    ctx.strokeStyle = '#E63946'; ctx.lineWidth = 10; rr(ctx, -330, -60, 660, 120, 18); ctx.stroke();
    kt(ctx, 'NOT IN ANY LAW', 0, 24, { font: F.ui(70, 900), color: '#E63946', align: 'center' }); ctx.restore();
  }
  const tv = ecue(s, 'video');
  let x = 60;
  ['CBI', 'POLICE', 'ED'].forEach((t, i) => {
    const at = tv + 0.3 + i * 0.25, w = chipV(ctx, s, t, x, CAM_TOP + 690, at, '#E9D5FF', '#1B0B45', 44);
    const sp = span(s.t, at + 0.4, at + 0.7);
    if (sp > 0) { ctx.save(); ctx.strokeStyle = '#E63946'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x + 18, CAM_TOP + 730); ctx.lineTo(x + 18 + (w - 36) * sp, CAM_TOP + 730); ctx.stroke(); ctx.restore(); }
    x += (w || 160) + 30;
  });
  kt(ctx, 'No agency arrests anyone by video call', 64, CAM_TOP + 850, { font: F.ui(44, 900), color: '#FFD60A', alpha: eia(s, tv + 1.2), maxW: W - 120 });
};

SCENES.S4 = (ctx, s) => {                   // the look-alike pair as a split card
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE LOOK-ALIKE PAIR', 'UPSC loves to swap these two');
  const cols = [
    { x: 40, cue: 'i-four-c', fill: '#06D6A0', ink: '#053B2C', name: 'I4C', full: 'Indian Cyber Crime Coordination Centre',
      rows: [['HOME MINISTRY (MHA)', null], ['1930 helpline', 'nineteen'], ['cybercrime.gov.in', 'nineteen'], ['Fights cyber CRIME', 'nineteen']] },
    { x: 560, cue: 'cert-in', fill: '#4CC9F0', ink: '#062A3A', name: 'CERT-In', full: 'Indian Computer Emergency Response Team',
      rows: [['IT MINISTRY (MeitY)', null], ['IT Act, Section 70B', 'seventy'], ['Cyber-security incidents', 'seventy'], ['Fights cyber ATTACKS', 'seventy']] }];
  cols.forEach(c => {
    const at = ecue(s, c.cue), k = bounce(s.t, at); if (k <= 0) return;
    ctx.save(); ctx.translate(c.x + 240, CAM_TOP + 600); ctx.scale(k, k); ctx.translate(-(c.x + 240), -(CAM_TOP + 600));
    exBox(ctx, c.x, CAM_TOP + 200, 480, 840, { fill: 'rgba(255,255,255,0.10)', r: 26 });
    exBox(ctx, c.x, CAM_TOP + 200, 480, 200, { fill: c.fill, r: 26 });
    kt(ctx, c.name, c.x + 240, CAM_TOP + 300, { font: F.ui(80, 900), color: c.ink, align: 'center' });
    kt(ctx, c.full, c.x + 240, CAM_TOP + 350, { font: F.ui(24, 800), color: c.ink, align: 'center', maxW: 440 });
    ctx.restore();
    c.rows.forEach(([t, rc], i) => {
      const ra = rc ? ecue(s, rc) + i * 0.15 : at + 0.3, kk = bounce(s.t, ra); if (kk <= 0) return;
      const y = CAM_TOP + 450 + i * 140;
      ctx.save(); ctx.globalAlpha = Math.min(1, kk);
      exBox(ctx, c.x + 20, y, 440, 110, { fill: i === 0 ? '#FFD60A' : '#FFFFFF', r: 18 });
      kt(ctx, t, c.x + 240, y + 68, { font: F.ui(i === 0 ? 34 : 32, 900), color: '#1B0B45', align: 'center', maxW: 410 });
      ctx.restore();
    });
  });
  const kv = bounce(s.t, ecue(s, 'cert-in') + 0.2);
  if (kv > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 300); ctx.scale(kv, kv); ctx.beginPath(); ctx.arc(0, 0, 46, 0, 7); ctx.fillStyle = '#E63946'; ctx.fill();
    kt(ctx, 'VS', 0, 14, { font: F.ui(38, 900), color: '#FFFFFF', align: 'center' }); ctx.restore(); }
};

SCENES.S5 = (ctx, s) => {                   // why states must consent, then the CBI trap
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'THE CBI TRAP', 'Why the Court needed the states');
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

SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [["NO 'DIGITAL ARREST' IN LAW", '#FFFFFF', 62, 'law'], ['CALL 1930', '#FFD60A', 110, 'call']]); };
