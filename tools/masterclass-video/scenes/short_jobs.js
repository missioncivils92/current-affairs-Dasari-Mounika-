// W45 Short: the new rural jobs law (2025 Act, in force 1 Jul 2026) and its Grievance Redressal Rules (2 Nov 2026).
// Needs short_kit.js:  node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_jobs.js <out> --size 1080x1920
// No short forms on screen (owner, 3 Nov). Every build lands on its word; numbers appear at their final value.

const TEAL = '#2BB3A3', YEL = '#FFD60A', INK = '#1B0B45';
function pill(ctx, s, t, x, y, at, fill, ink, size = 38) {
  const k = bounce(s.t, at); if (k <= 0) return 0;
  ctx.save(); ctx.font = F.ui(size, 900); const w = ctx.measureText(t).width + 60; ctx.restore();
  ctx.save(); ctx.translate(x + w / 2, y + 42); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 42));
  exBox(ctx, x, y, w, 84, { fill, r: 42 }); kt(ctx, t, x + 30, y + 42 + size * 0.36, { font: F.ui(size, 900), color: ink }); ctx.restore();
  return w;
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['NEW RURAL JOBS LAW', YEL, 84, -1], ['WHAT UPSC WILL ASK', '#FFFFFF', 62, -0.8]]); };

SCENES.S2 = (ctx, s) => {                   // the rules: a bottom-up complaint ladder and two stopwatches
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY IN NEWS');
  clipV(ctx, 50, CAM_TOP + 110, W - 100, 330, bounce(s.t, 0.1), '2 NOVEMBER 2026 · MINISTRY OF RURAL DEVELOPMENT', 'Grievance Redressal Rules, 2026 notified under the new rural jobs Act', 'Press Information Bureau · Down To Earth · Business Standard', -0.03);
  const steps = [['GRAM PANCHAYAT', 'gram', '#E9D5FF'], ['BLOCK', 'block', '#C4B5FD'], ['DISTRICT', 'district', YEL]];
  steps.forEach(([t, cue, fill], i) => {               // bottom-up: the first level sits lowest
    const at = ecue(s, cue), k = bounce(s.t, at); if (k <= 0) return;
    const x = 60 + i * 120, y = CAM_TOP + 960 - i * 120, w = 520;
    if (i) { ctx.save(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x + 30, y + 160); ctx.lineTo(x + 30, y + 92); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(x + 14, y + 100); ctx.lineTo(x + 46, y + 100); ctx.lineTo(x + 30, y + 80); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.translate(x + w / 2, y + 45); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 45));
    exBox(ctx, x, y, w, 90, { fill, r: 20 }); kt(ctx, t, x + w / 2, y + 60, { font: F.ui(40, 900), color: INK, align: 'center' }); ctx.restore();
  });
  pill(ctx, s, '7 working days: enquiry', 60, CAM_TOP + 470, ecue(s, 'seven'), '#4CC9F0', '#062A3A');
  pill(ctx, s, '15 days: resolved', 60, CAM_TOP + 575, ecue(s, 'fifteen'), '#06D6A0', '#053B2C');
  kt(ctx, 'Unresolved? It moves up a level', 640, CAM_TOP + 1115, { font: F.ui(28, 800), color: '#E9D5FF', alpha: eia(s, ecue(s, 'district') + 0.5), align: 'center' });
};

SCENES.S3 = (ctx, s) => {                   // old Act → new Act, 100 → 125 days
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHICH LAW?', 'In force from 1 July 2026');
  card(ctx, 50, CAM_TOP + 170, W - 100, 230, '#E9D5FF', bounce(s.t, ecue(s, 'mahatma')), [['OLD · 2005', F.ui(34, 900), '#6B21A8'], ['Mahatma Gandhi National Rural Employment Guarantee Act', F.ui(40, 900), INK]]);
  const tv = ecue(s, 'viksit'), ga = span(s.t, tv - 0.4, tv);
  if (ga > 0) { ctx.save(); ctx.fillStyle = YEL; ctx.beginPath(); ctx.moveTo(W / 2 - 30, CAM_TOP + 415); ctx.lineTo(W / 2 + 30, CAM_TOP + 415); ctx.lineTo(W / 2, CAM_TOP + 415 + 45 * ga); ctx.fill(); ctx.restore(); }
  card(ctx, 50, CAM_TOP + 475, W - 100, 280, YEL, bounce(s.t, tv), [['NEW · 2025', F.ui(34, 900), '#6B21A8'], ['Viksit Bharat – Guarantee for Rozgar and Ajeevika Mission (Gramin) Act', F.ui(40, 900), INK]]);
  const th = ecue(s, 'hundred'), k1 = bounce(s.t, th);
  if (k1 > 0) { ctx.save(); ctx.translate(250, CAM_TOP + 880); ctx.scale(k1, k1);
    kt(ctx, '100', 0, 30, { font: F.ui(110, 900), color: '#E9D5FF', align: 'center' }); kt(ctx, 'days', 0, 80, { font: F.ui(34, 800), color: '#E9D5FF', align: 'center' });
    const sp = span(s.t, th + 0.6, th + 1.0); if (sp > 0) { ctx.strokeStyle = '#E63946'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-110, -20); ctx.lineTo(-110 + 220 * sp, 30); ctx.stroke(); }
    ctx.restore(); }
  const t125 = ecue(s, 'twenty-five'), k2 = bounce(s.t, t125);
  if (k2 > 0) { ctx.save(); ctx.translate(760, CAM_TOP + 880); ctx.scale(k2, k2);
    ctx.shadowColor = YEL; ctx.shadowBlur = 30; kt(ctx, '125', 0, 30, { font: F.ui(130, 900), color: YEL, align: 'center' }); ctx.shadowColor = 'transparent';
    kt(ctx, 'days a year', 0, 85, { font: F.ui(34, 800), color: '#FFFFFF', align: 'center' }); ctx.restore();
    ctx.save(); ctx.globalAlpha = Math.min(1, k2); ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.moveTo(420, CAM_TOP + 860); ctx.lineTo(560, CAM_TOP + 860); ctx.lineTo(560, CAM_TOP + 840); ctx.lineTo(600, CAM_TOP + 870); ctx.lineTo(560, CAM_TOP + 900); ctx.lineTo(560, CAM_TOP + 880); ctx.lineTo(420, CAM_TOP + 880); ctx.fill(); ctx.restore(); }
};

SCENES.S4 = (ctx, s) => {                   // who pays: 100% central wages → 60:40, 90:10, and the pause
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHO PAYS?');
  const bar = (y, label, parts, k) => {
    if (k <= 0) return; kt(ctx, label, 60, y - 18, { font: F.ui(32, 900), color: '#FFFFFF', alpha: Math.min(1, k) });
    let x = 60; const total = W - 120;
    parts.forEach(([v, t, fill, ink]) => { const w = total * v / 100 * Math.min(1, k);
      exBox(ctx, x, y, Math.max(0, w - 6), 100, { fill, r: 18 }); if (k >= 1 && w > 140) kt(ctx, t, x + w / 2, y + 64, { font: F.ui(38, 900), color: ink, align: 'center' }); x += w; });
  };
  bar(CAM_TOP + 180, 'OLD ACT: wages', [[100, 'Centre 100%', '#E9D5FF', INK]], span(s.t, ecue(s, 'old'), ecue(s, 'old') + 0.6));
  bar(CAM_TOP + 380, 'NEW ACT: most states', [[60, 'Centre 60', YEL, INK], [40, 'States 40', '#4CC9F0', '#062A3A']], span(s.t, ecue(s, 'sixty'), ecue(s, 'sixty') + 0.6));
  bar(CAM_TOP + 580, 'Himalayan & north-eastern states: Centre 90 · States 10', [[90, 'Centre 90', YEL, INK], [10, '', '#06D6A0', '#053B2C']], span(s.t, ecue(s, 'ninety'), ecue(s, 'ninety') + 0.6));
  pill(ctx, s, 'Up to 60-day pause at sowing & harvest', 60, CAM_TOP + 740, ecue(s, 'pause'), '#FFFFFF', INK, 34);
  const tt = ecue(s, 'trap'), k = bounce(s.t, tt - 0.2);
  if (k > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, k); ctx.fillStyle = 'rgba(230,57,70,0.95)'; rr(ctx, 50, CAM_TOP + 860, W - 100, 170, 24); ctx.fill();
    kt(ctx, 'PRELIMS TRAP', 90, CAM_TOP + 910, { font: F.ui(28, 900), color: '#FFFFFF' });
    kt(ctx, 'The Centre no longer pays all the wages', 90, CAM_TOP + 975, { font: F.ui(40, 900), color: '#FFFFFF', maxW: W - 180 }); ctx.restore(); }
};

SCENES.S5 = (ctx, s) => {                   // Telugu States lens
  vBase(ctx); camSpace(ctx, CAM_TOP);
  exChip(ctx, 'TELUGU STATES LENS', 40 + slideX(s.t, 0.05, -300), CAM_TOP + 28, TEAL, '#FFFFFF', 40, eia(s, 0.1)); exLogo(ctx, W - 80, CAM_TOP + 66, 46);
  card(ctx, 50, CAM_TOP + 170, W - 100, 300, TEAL, bounce(s.t, ecue(s, 'andhra')), [['United Andhra Pradesh', F.ui(52, 900), '#FFFFFF'], ['Society for Social Audit, Accountability and Transparency', F.ui(38, 900), '#FFFFFF']]);
  pill(ctx, s, 'Set up in 2009', 60, CAM_TOP + 510, ecue(s, 'society'), YEL, INK, 40);
  card(ctx, 50, CAM_TOP + 640, W - 100, 230, '#FFFFFF', bounce(s.t, ecue(s, 'model')), [['Independent social audits', F.ui(46, 900), INK], ['a model for the whole country · Telangana built its own unit after 2014', F.ui(30, 800), '#0F6E64']]);
};

SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS DEBATE', YEL, 84, 'mains'], ['FIXED ALLOCATION vs DEMAND-DRIVEN RIGHT', '#FFFFFF', 40, 'allocation']]); };
