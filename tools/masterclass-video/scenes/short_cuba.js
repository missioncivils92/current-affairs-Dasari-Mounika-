// W45 Short: India's vote at the UN General Assembly on the American embargo on Cuba (28–29 Oct 2026), the
// extraterritorial-law principle, Chabahar, and the binding-force trap. Needs short_kit.js:
//   node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_cuba.js <out> --size 1080x1920
// No short forms on screen (owner, 3 Nov). Builds land on their words; numbers appear at their final value.

const SKY = '#4CC9F0', YEL = '#FFD60A', INK = '#1B0B45', GRN = '#06D6A0';
function pill(ctx, s, t, x, y, at, fill, ink, size = 36) {
  const k = bounce(s.t, at); if (k <= 0) return 0;
  ctx.save(); ctx.font = F.ui(size, 900); const w = ctx.measureText(t).width + 60; ctx.restore();
  ctx.save(); ctx.translate(x + w / 2, y + 42); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 42));
  exBox(ctx, x, y, w, 84, { fill, r: 42 }); kt(ctx, t, x + 30, y + 42 + size * 0.36, { font: F.ui(size, 900), color: ink }); ctx.restore();
  return w;
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [["INDIA'S VOTE ON CUBA", SKY, 76, -1], ['WHAT UPSC WILL ASK', '#FFFFFF', 58, -0.8]]); };

SCENES.S2 = (ctx, s) => {                   // the vote, at its final numbers
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY IN NEWS');
  clipV(ctx, 50, CAM_TOP + 110, W - 100, 330, bounce(s.t, 0.1), '29 OCTOBER 2026 · UNITED NATIONS GENERAL ASSEMBLY', 'Assembly calls for an end to the American embargo on Cuba, for the 34th time', 'ThePrint · Outlook · United News of India', -0.03);
  pill(ctx, s, 'Embargo since 1962', 60, CAM_TOP + 470, ecue(s, 'sixty-two'), YEL, INK);
  const tv = ecue(s, 'hundred'), g = span(s.t, tv, tv + 0.8);
  if (g > 0) {
    const parts = [[130, 'FOR 130', GRN, '#053B2C'], [17, '17', '#F9A8D4', '#4A0D2E'], [25, '25', '#CBD5E1', INK]], tot = 172, x0 = 60, ww = W - 120, y = CAM_TOP + 640;
    kt(ctx, '2026 vote: for · against · abstain', 60, y - 18, { font: F.ui(30, 900), color: '#FFFFFF', alpha: g });
    let x = x0; parts.forEach(([v, t, fill, ink]) => { const w = ww * v / tot * easeOut(g);
      exBox(ctx, x, y, Math.max(0, w - 6), 110, { fill, r: 18 }); if (g >= 1) kt(ctx, t, x + w / 2, y + 70, { font: F.ui(40, 900), color: ink, align: 'center' }); x += w; });
  }
  const tl = ecue(s, "last year's"), k = bounce(s.t, tl);
  if (k > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, k); exBox(ctx, 60, CAM_TOP + 800, W - 120, 120, { fill: 'rgba(255,255,255,0.14)', r: 18 });
    kt(ctx, '2025 vote: 165 · 7 · 12', W / 2, CAM_TOP + 852, { font: F.ui(44, 900), color: '#FFFFFF', align: 'center' });
    kt(ctx, 'support fell sharply this year', W / 2, CAM_TOP + 895, { font: F.ui(28, 800), color: '#E9D5FF', align: 'center' }); ctx.restore(); }
};

SCENES.S3 = (ctx, s) => {                   // India's vote, the principle, the law behind it
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'HOW DID INDIA VOTE?');
  const tf = ecue(s, 'favour'), k = span(s.t, tf, tf + 0.35);
  if (k > 0) { const sc = 1 + 1.2 * (1 - easeOut(k));
    ctx.save(); ctx.translate(W / 2, CAM_TOP + 230); ctx.rotate(-0.05); ctx.scale(sc, sc); ctx.globalAlpha = Math.min(1, k * 2);
    ctx.fillStyle = GRN; rr(ctx, -330, -60, 660, 120, 20); ctx.fill();
    kt(ctx, 'INDIA: IN FAVOUR', 0, 22, { font: F.ui(64, 900), color: '#053B2C', align: 'center' }); ctx.restore(); }
  card(ctx, 50, CAM_TOP + 330, W - 100, 240, YEL, bounce(s.t, ecue(s, 'extraterritorial')), [['WHY? INDIA REJECTS "EXTRATERRITORIAL" LAWS', F.ui(34, 900), '#6B21A8'], ["one country's law reaching into other countries", F.ui(42, 900), INK]]);
  card(ctx, 50, CAM_TOP + 600, W - 100, 250, '#FFFFFF', bounce(s.t, ecue(s, 'helms-burton')), [['HELMS-BURTON ACT · AMERICA · 1996', F.ui(34, 900), '#6B21A8'], ['Foreign companies dealing in Cuba can be sued in American courts', F.ui(40, 900), INK]]);
};

SCENES.S4 = (ctx, s) => {                   // the India link: sanctions → Chabahar → the route north
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY IT MATTERS TO US');
  const tc = ecue(s, 'chabahar');
  const chain = [['American sanctions on Iran', '#F9A8D4', '#4A0D2E', tc - 1.2], ["India's Chabahar port, Iran", YEL, INK, tc], ['India\'s route to Afghanistan and Central Asia', SKY, '#062A3A', tc + 0.8]];
  chain.forEach(([t, fill, ink, at], i) => {
    const y = CAM_TOP + 150 + i * 220, k = bounce(s.t, at); if (k <= 0) return;
    if (i) { ctx.save(); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(W / 2 - 24, y - 60); ctx.lineTo(W / 2 + 24, y - 60); ctx.lineTo(W / 2, y - 20); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.translate(W / 2, y + 70); ctx.scale(k, k); ctx.translate(-W / 2, -(y + 70));
    exBox(ctx, 50, y, W - 100, 140, { fill, r: 24 }); kt(ctx, t, W / 2, y + 84, { font: F.ui(36, 900), color: ink, align: 'center' }); ctx.restore();
  });
  const ta = ecue(s, 'autonomy'), k = bounce(s.t, ta);
  if (k > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 900); ctx.scale(k, k); ctx.shadowColor = YEL; ctx.shadowBlur = 30;
    exBox(ctx, -400, -60, 800, 120, { fill: YEL, r: 60 }); ctx.shadowColor = 'transparent';
    kt(ctx, 'STRATEGIC AUTONOMY', 0, 18, { font: F.ui(52, 900), color: INK, align: 'center' }); ctx.restore(); }
};

SCENES.S5 = (ctx, s) => {                   // the binding-force trap
  vBase(ctx); camSpace(ctx, CAM_TOP);
  ctx.save(); ctx.fillStyle = 'rgba(230,57,70,0.94)'; rr(ctx, 30, CAM_TOP + 30, W - 60, H - CAM_TOP - 60, 30); ctx.fill(); ctx.restore();
  exChip(ctx, 'PRELIMS TRAP', 70, CAM_TOP + 60, '#FFFFFF', '#E63946', 44, eia(s, 0.1));
  const tb = ecue(s, 'binding'), k = bounce(s.t, tb - 1.0);
  if (k > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 270); ctx.scale(k, k); ctx.translate(-W / 2, -(CAM_TOP + 270));
    exBox(ctx, 60, CAM_TOP + 200, W - 120, 140, { fill: '#FFFFFF' }); kt(ctx, 'General Assembly resolutions are binding', 100, CAM_TOP + 288, { font: F.ui(40, 900), color: INK, maxW: W - 200 });
    const sp = span(s.t, tb, tb + 0.4); if (sp > 0) { ctx.strokeStyle = '#E63946'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(95, CAM_TOP + 274); ctx.lineTo(95 + (W - 200) * sp, CAM_TOP + 274); ctx.stroke(); }
    ctx.restore(); }
  const tc = ecue(s, 'council'), k2 = bounce(s.t, tc);
  if (k2 > 0) { ctx.save(); ctx.translate(W / 2, CAM_TOP + 520); ctx.scale(k2, k2); ctx.translate(-W / 2, -(CAM_TOP + 520));
    exBox(ctx, 60, CAM_TOP + 380, W - 120, 280, { fill: GRN });
    kt(ctx, '✓ Assembly: only recommendations', 100, CAM_TOP + 460, { font: F.ui(40, 900), color: '#053B2C', maxW: W - 200 });
    kt(ctx, '✓ Security Council decisions bind all members', 100, CAM_TOP + 540, { font: F.ui(38, 900), color: '#053B2C', maxW: W - 200 });
    kt(ctx, 'Article 25, United Nations Charter', 100, CAM_TOP + 615, { font: F.ui(32, 800), color: '#053B2C', maxW: W - 200 }); ctx.restore(); }
};

SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS DEBATE', YEL, 84, 'mains'], ['FRIEND OF AMERICA, YET AGAINST ITS EMBARGO?', '#FFFFFF', 38, 'friends']]); };
