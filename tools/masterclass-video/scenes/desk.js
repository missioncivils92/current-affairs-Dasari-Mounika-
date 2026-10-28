// Scenes for the W44 AP–TG Desk (weeks/2026-W44/aptg-desk), v1. Same three-beat Glimpse grammar as the
// Prelims Grid (the Glimpse kit in engine.js), in teal: Local · Telugu States.
const ORDER = ['L', 'L', 'L', 'L', 'L', 'L', 'L'];
GK = { order: ORDER, cat: { L: { name: 'LOCAL · TELUGU STATES', col: C.teal, ink: C.slate } } };
function docStrip(ctx, s, label) {
  const a = appear(s.t, 1.2);
  ctx.save(); ctx.globalAlpha = a; ctx.font = F.ui(24, 700); const w = ctx.measureText(label).width + 90;
  const x = W - 90 - w; rr(ctx, x, 180, w, 46, 8); ctx.fillStyle = 'rgba(237,230,214,0.94)'; ctx.fill();
  ctx.fillStyle = '#1E2228'; ctx.textBaseline = 'middle'; ctx.fillText('▤  ' + label, x + 18, 204); ctx.restore();
}
function tgMap(ctx, s, cam, o = {}) {
  const proj = camera(cam.lon, cam.lat, cam.zoom);
  terrainMap(ctx, proj, 'telugu');
  if (o.rivers) rivers(ctx, proj, o.rivers, { color: 'rgba(74,144,194,0.95)', lw: o.lw || 5 });
  return proj;
}

// ---------------- A.0 checkpoint answer (Deep Dive 1) ----------------
SCENES.S01 = (ctx, s) => {
  desk(ctx, s.t, { book: false, lamp: 0.95 });
  const a = appear(s.t, 0.2), b = appear(s.t, s.w('directive') - 0.3);
  card(ctx, 260, 160, 1400, 480, { stroke: C.yellow, lw: 3, alpha: a });
  pill(ctx, 'CHECKPOINT ANSWER', 320, 210, { alpha: a, font: F.ui(28, 800), h: 50 });
  text(ctx, 'The RPwD Act, 2016: a statute that courts enforce', 320, 360, { font: F.head(52), color: C.yellow, alpha: appear(s.t, s.w('statute') - 0.3), maxW: 1280 });
  text(ctx, 'Article 41 is a Directive Principle: not enforceable by any court', 320, 490, { font: F.ui(38, 700), alpha: b, maxW: 1280, lh: 50 });
  lowerThird(ctx, 'AP–TG Desk · Local: Telugu States', appear(s.t, 0.6));
};
// ---------------- D.1 AP BC quota ----------------
SCENES.S02 = (ctx, s) => {
  typeHero(ctx, 0, '50%');
  const a = appear(s.t, 0.6), x = 520, y = 600;
  text(ctx, '34%', x, y, { font: F.head(200), align: 'center', color: C.white, alpha: a });
  strike(ctx, x - 190, x + 190, y - 70, span(s.t, s.w('set aside') - 0.2, s.w('set aside') + 0.6));
  text(ctx, 'total reservation above the 50% ceiling', x, y + 70, { font: F.ui(30, 700), align: 'center', color: C.dim, alpha: appear(s.t, s.w('set aside')) });
  topShade(ctx, 380, 0.6);
  headline(ctx, s, 0, 'AP\'s BC quota in local bodies', 'High Court, 1 Oct → Supreme Court, 9 Oct');
  docStrip(ctx, s, 'AP High Court order, 1 Oct 2026');
  facts(ctx, s, 0, [['AP HIGH COURT · 1 OCT', 'BC quota orders set aside', 'first', 46], ['SUPREME COURT · 9 OCT', 'State\'s appeal dismissed', 'ninth', 46]], { y: 380, lines: 2 });
  trap(ctx, s, 'Any quota works if the State wants it', 'Triple test: commission · body-wise share · 50%');
  finish(ctx, s, 0, 'Sources: AP High Court (1 Oct) and Supreme Court (9 Oct) orders, as reported');
};
// ---------------- D.2 Telangana HC acting CJ ----------------
SCENES.S03 = (ctx, s) => {
  typeHero(ctx, 1, 'HC');
  const a = appear(s.t, s.w('koshy') - 0.3);
  card(ctx, 140, 420, 900, 300, { fill: 'rgba(38,43,51,0.96)', accent: C.teal, alpha: a });
  text(ctx, 'TELANGANA HIGH COURT', 190, 500, { font: F.ui(28, 800), color: C.teal, alpha: a });
  text(ctx, 'Acting Chief Justice', 190, 580, { font: F.ui(34, 700), color: C.dim, alpha: a });
  text(ctx, 'Justice P. Sam Koshy', 190, 660, { font: F.head(58), alpha: a });
  topShade(ctx, 380, 0.6);
  headline(ctx, s, 1, 'Telangana HC: acting Chief Justice', 'after the Chief Justice\'s elevation to the Supreme Court');
  docStrip(ctx, s, 'Ministry of Law notification, Oct 2026');
  trap(ctx, s, 'Appointed by the CJI', 'By the President · Article 223');
  finish(ctx, s, 1, 'Source: Union Ministry of Law notification, Oct 2026 (as reported)');
};
// ---------------- D.3 Telugu States Lens: NTR Bharosa ----------------
SCENES.S04 = (ctx, s) => {
  typeHero(ctx, 2, '₹');
  const b = appear(s.t, s.w('four thousand') - 0.3), x0 = 140, x1 = 1060, y = 520, cS = x0 + (x1 - x0) * 200 / 4000;
  text(ctx, '₹4,000 a month to an elderly pensioner in AP', x0, y - 30, { font: F.ui(32, 800), alpha: b });
  ctx.save(); ctx.globalAlpha = b; ctx.fillStyle = C.teal; ctx.fillRect(cS, y, x1 - cS, 90); ctx.fillStyle = C.yellow; ctx.fillRect(x0, y, cS - x0, 90); ctx.restore();
  const c = appear(s.t, s.w('share') - 0.3);
  text(ctx, 'Centre ₹200', x0, y + 140, { font: F.ui(34, 800), color: C.yellow, alpha: c }); text(ctx, 'State ₹3,800', x1, y + 140, { font: F.ui(34, 800), color: C.teal, align: 'right', alpha: c });
  text(ctx, '≈ one twentieth', x0, y + 200, { font: F.hand(50), color: C.yellow, alpha: appear(s.t, s.w('twentieth') - 0.3) });
  topShade(ctx, 380, 0.6);
  headline(ctx, s, 2, 'Who pays AP\'s pension?', 'NTR Bharosa · links to Deep Dive 1');
  docStrip(ctx, s, 'AP GO on NTR Bharosa pensions (no. per verification log)');
  const q = appear(s.t, s.w('group-1') - 0.3);
  card(ctx, 1200, 520, 640, 250, { stroke: C.teal, lw: 3, alpha: q, fill: 'rgba(12,14,18,0.85)' });
  text(ctx, 'GROUP-1 MAINS STYLE', 1230, 575, { font: F.ui(24, 800), color: C.teal, alpha: q });
  text(ctx, 'Describe AP\'s social security pensions and the role of central assistance.', 1230, 635, { font: F.head(34), maxW: 580, lh: 44, alpha: q });
  finish(ctx, s, 2, 'Sources: Govt of Andhra Pradesh (NTR Bharosa) · Union Cabinet decision, 14 Oct 2026');
};
// ---------------- D.4 KRMB / GRMB ----------------
SCENES.S05 = (ctx, s) => {
  const proj = tgMap(ctx, s, { lon: lerp(79.6, 80.0, s.p), lat: 16.9, zoom: 6.55 }, { rivers: ['Krishna', 'Godavari', 'Bhima', 'Tungabhadra', 'Wainganga', 'Indravati'] });
  mapLabel(ctx, proj, [77.6, 16.75], 'Krishna', { font: F.ui(34, 800), color: '#9CC8EA', italic: true, alpha: appear(s.t, s.w('krishna') - 0.3) });
  mapLabel(ctx, proj, [79.6, 18.9], 'Godavari', { font: F.ui(34, 800), color: '#9CC8EA', italic: true, alpha: appear(s.t, s.w('godavari') - 0.3) });
  pin(ctx, proj, [81.66, 17.27], 'Polavaram', { color: C.teal, dx: 18, dy: -16, font: F.ui(32, 800), alpha: appear(s.t, s.w('polavaram') - 0.3) });
  mapLabel(ctx, proj, [79.0, 18.0], 'TELANGANA', { font: F.ui(30, 800), color: 'rgba(255,255,255,0.6)' });
  mapLabel(ctx, proj, [79.6, 15.3], 'ANDHRA PRADESH', { font: F.ui(30, 800), color: 'rgba(255,255,255,0.6)' });
  topShade(ctx); sideShade(ctx, 1150);
  headline(ctx, s, 3, 'Two river boards meet', 'Scheduled: KRMB 26 Oct · GRMB 30 Oct');
  docStrip(ctx, s, 'Ministry of Jal Shakti notification, July 2021');
  facts(ctx, s, 3, [['ON THE GRMB\'S AGENDA', 'Polavaram backwater', 'backwater', 50]], { y: 420, x: 1300, w: 520 });
  trap(ctx, s, 'River tribunals under Article 262', 'Boards under the AP Reorganisation Act 2014');
  finish(ctx, s, 3, TERRAIN_CREDIT + ' · Rivers: Natural Earth');
};
// ---------------- D.5 Tummidihatti ----------------
SCENES.S06 = (ctx, s) => {
  const proj = tgMap(ctx, s, { lon: lerp(81.35, 81.25, s.p), lat: 19.35, zoom: 8.0 }, { rivers: ['Godavari', 'Wainganga'], lw: 6 });
  mapLabel(ctx, proj, [80.15, 20.4], 'Wainganga', { font: F.ui(30, 800), color: '#9CC8EA', italic: true, alpha: appear(s.t, s.w('wainganga') - 0.3) });
  pin(ctx, proj, [79.87, 19.45], 'Tummidihatti', { sub: 'barrage site (approx.)', color: C.teal, dx: 20, dy: -18, font: F.ui(34, 800), alpha: appear(s.t, s.w('tummidihatti') - 0.3) });
  pin(ctx, proj, [79.91, 18.81], 'Kaleshwaram', { sub: 'Pranahita joins the Godavari', color: C.white, dx: 20, dy: 30, font: F.ui(30, 800), alpha: appear(s.t, s.w('pranahita') - 0.3) });
  // the Pranahita is the border here: Telangana on its west bank, Maharashtra (Gadchiroli) on its east bank
  mapLabel(ctx, proj, [80.95, 20.25], 'MAHARASHTRA', { font: F.ui(28, 800), color: 'rgba(255,255,255,0.6)' }); mapLabel(ctx, proj, [79.0, 18.6], 'TELANGANA', { font: F.ui(28, 800), color: 'rgba(255,255,255,0.6)' });
  topShade(ctx); sideShade(ctx, 1150);
  headline(ctx, s, 4, 'Tummidihatti: how high?', '26 Oct · Telangana CM\'s talks in Mumbai');
  facts(ctx, s, 4, [['TELANGANA WANTS (FRL)', '152 m', 'one hundred and fifty-two', 80], ['IT SAYS MAHARASHTRA AGREED', '148 m', 'forty-eight', 64]], { y: 400, x: 1300, w: 520 });
  trap(ctx, s, 'On the Godavari\'s main stem', 'On the Pranahita (Wardha + Wainganga)');
  finish(ctx, s, 4, TERRAIN_CREDIT + ' · Rivers: Natural Earth');
};
// ---------------- D.6 Arnab: the State's response ----------------
SCENES.S07 = (ctx, s) => {
  const proj = satHero(ctx, s, 'godavari_coast', { lon: 82.3, lat: 16.84, zoom: 11.0 }, { lon: 82.27, lat: 16.86, zoom: 11.3 }, { base: 'apcoast' });
  pin(ctx, proj, [82.247, 16.989], 'Kakinada', { color: C.white, dx: 20, dy: -18, font: F.ui(34, 800), alpha: appear(s.t, s.w('kakinada') - 0.3) });
  pin(ctx, proj, [82.214, 16.733], 'Yanam', { sub: 'Puducherry UT', dx: -22, dy: 44, font: F.ui(34, 800), alpha: appear(s.t, s.w('kakinada')) });
  topShade(ctx); sideShade(ctx, 1150);
  headline(ctx, s, 5, 'Arnab: the State\'s response', '27–28 Oct · Kakinada and the Godavari delta');
  docStrip(ctx, s, 'APSDMA bulletins, 27–28 Oct');
  facts(ctx, s, 5, [['MOVED TO RELIEF CAMPS (AS REPORTED)', '≈ 89,000', 'eighty-nine', 80]], { y: 420, x: 1300, w: 520 });
  trap(ctx, s, 'SDMA chaired by the Governor', 'Chaired by the Chief Minister (DM Act 2005)');
  finish(ctx, s, 5, SENT_CREDIT);
};
// ---------------- D.7 Kolleru ----------------
SCENES.S08 = (ctx, s) => {
  const proj = satHero(ctx, s, 'kolleru', { lon: 81.24, lat: 16.62, zoom: 11.1 }, { lon: 81.22, lat: 16.62, zoom: 11.4 }, { base: 'telugu' });
  mapLabel(ctx, proj, [81.22, 16.64], 'KOLLERU', { font: F.ui(44, 800), color: C.white, alpha: appear(s.t, s.w('kolleru') - 0.3) });
  mapLabel(ctx, proj, [81.22, 16.60], 'freshwater', { font: F.hand(50), color: '#9CC8EA', alpha: appear(s.t, s.w('freshwater') - 0.3) });
  topShade(ctx); sideShade(ctx, 1150);
  headline(ctx, s, 6, 'Kolleru: a sanctuary\'s limits', 'Before the SC\'s Central Empowered Committee');
  docStrip(ctx, s, 'AP proposal to the CEC (as reported)');
  facts(ctx, s, 6, [['AP SEEKS TO EXCLUDE', '≈ 20,000 acres', 'twenty thousand', 64]], { y: 420, x: 1300, w: 520 });
  trap(ctx, s, 'A brackish lagoon like Chilika', 'Freshwater · Ramsar site since 2002');
  finish(ctx, s, 6, SENT_CREDIT);
};
// ---------------- D.8–D.9 the Group-1 question ----------------
const Q = ['1. The Krishna and Godavari River Management Boards were set up under the Andhra Pradesh Reorganisation Act, 2014.', '2. Kolleru is a brackish-water lagoon.', '3. The Tummidihatti barrage is proposed on the Pranahita.'];
function g1Paper(ctx, s, o = {}) {
  bg(ctx, { inner: '#22262D' });
  ctx.save(); ctx.translate(960, 540); ctx.rotate(-0.01); ctx.translate(-960, -540);
  card(ctx, 180, 70, 1560, 940, { fill: '#EDE6D6', r: 6 });
  ctx.fillStyle = C.teal; ctx.fillRect(180, 70, 1560, 16);
  text(ctx, 'GROUP-1 STYLE · Consider the following statements:', 240, 170, { font: F.head(40), color: '#1E2228' });
  const typed = o.typed ?? 1;
  Q.forEach((m, i) => {
    const y = 270 + i * 130, a = clamp(typed * 3 - i);
    const h = text(ctx, m, 270, y, { font: F.ui(36, 600), color: '#1E2228', alpha: a, maxW: 1400, lh: 46 });
    if (i === 1 && o.strike > 0) strike(ctx, 265, 940, y - 12, o.strike);
  });
  text(ctx, 'How many of the above statements are correct?', 240, 700, { font: F.head(40), color: '#1E2228', alpha: clamp(typed * 3 - 2.4) });
  ['(a) Only one', '(b) Only two', '(c) All three', '(d) None'].forEach((op, i) => {
    const x = 270 + i * 360; text(ctx, op, x, 800, { font: F.ui(36, 700), color: '#1E2228', alpha: clamp(typed * 3 - 2.6) });
    if (i === 1 && o.circle > 0) { ctx.save(); ctx.strokeStyle = '#C08A00'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x + 100, 788, 140, 44, -0.04, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * easeOut(o.circle)); ctx.stroke(); ctx.restore(); }
  });
  if (o.reason) text(ctx, o.reason, 240, 930, { font: F.hand(46), color: '#8A5A00', alpha: o.reasonA ?? 1, maxW: 1440 });
  ctx.restore();
}
SCENES.S09 = (ctx, s) => {
  g1Paper(ctx, s, { typed: span(s.t, 0.2, Math.min(s.d - 1, s.w('correct'))) });
  const h = s.hold; if (!h) return;
  const ra = appear(s.t, h.at - 0.2, 0.4), cd = clamp((s.t - h.at) / h.dur), left = Math.ceil(h.dur - cd * h.dur);
  ctx.save(); ctx.globalAlpha = ra; ctx.fillStyle = 'rgba(20,23,28,0.92)'; ctx.beginPath(); ctx.arc(1730, 900, 120, 0, 7); ctx.fill();
  ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(1730, 900, 95, 0, 7); ctx.stroke();
  ctx.strokeStyle = C.teal; ctx.beginPath(); ctx.arc(1730, 900, 95, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.stroke(); ctx.restore();
  text(ctx, String(clamp(left, 0, h.dur)), 1730, 935, { font: F.head(96), align: 'center', alpha: ra, color: C.teal });
};
SCENES.S10 = (ctx, s) => {
  const fw = s.w('freshwater') - 0.2;
  g1Paper(ctx, s, { circle: span(s.t, s.w('only two') - 0.2, s.w('only two') + 0.8), strike: span(s.t, fw, fw + 0.7), reason: '(b): Kolleru is a freshwater lake, not a brackish lagoon.', reasonA: appear(s.t, fw + 0.5) });
};
