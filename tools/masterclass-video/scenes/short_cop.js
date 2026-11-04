// W45 Short: COP31 (Antalya, 9–20 Nov 2026) and India's stand. Needs short_kit.js:
//   node render.js <assets> <timeline> scenes/short_kit.js,scenes/short_cop.js <out> --size 1080x1920
// No short forms on screen without their full form (owner, 3 Nov). Builds land on their words; numbers at final value.

const SKY = '#4CC9F0', YEL = '#FFD60A', INK = '#1B0B45', ICE = '#BDE8FF';
function pill(ctx, s, t, x, y, at, fill, ink, size = 36) {
  const k = bounce(s.t, at); if (k <= 0) return 0;
  ctx.save(); ctx.font = F.ui(size, 900); const w = ctx.measureText(t).width + 60; ctx.restore();
  ctx.save(); ctx.translate(x + w / 2, y + 42); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 42));
  exBox(ctx, x, y, w, 84, { fill, r: 42 }); kt(ctx, t, x + 30, y + 42 + size * 0.36, { font: F.ui(size, 900), color: ink }); ctx.restore();
  return w;
}

SCENES.S1 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['UNITED NATIONS CLIMATE SUMMIT', SKY, 54, -1], ['WHAT WILL INDIA SAY?', YEL, 84, -0.8]]); };

SCENES.S2 = (ctx, s) => {                   // what it is, and the host / negotiations twist
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHAT IS IT?');
  card(ctx, 50, CAM_TOP + 120, W - 100, 170, YEL, bounce(s.t, ecue(s, 'conference')), [['COP31 = 31st Conference of the Parties', F.ui(46, 900), INK], ['the yearly summit of a climate treaty', F.ui(30, 800), '#6B21A8']]);
  card(ctx, 50, CAM_TOP + 310, W - 100, 190, '#FFFFFF', bounce(s.t, ecue(s, 'nineteen')), [['United Nations Framework Convention on Climate Change', F.ui(38, 900), INK], ['adopted 1992 · Rio Earth Summit · India is a party', F.ui(28, 800), '#6B21A8']]);
  const sides = [['HOST', 'Türkiye', 'Antalya · 9–20 November', '#F9A8D4', '#4A0D2E', 'hosts', 50], ['RUNS THE NEGOTIATIONS', 'Australia', '"President of Negotiations"', SKY, '#062A3A', 'australia', 560]];
  sides.forEach(([lab, big, sub, fill, ink, cue, x]) => {
    const k = bounce(s.t, ecue(s, cue)); if (k <= 0) return;
    ctx.save(); ctx.translate(x + 235, CAM_TOP + 650); ctx.scale(k, k); ctx.translate(-(x + 235), -(CAM_TOP + 650));
    exBox(ctx, x, CAM_TOP + 530, 470, 240, { fill, r: 24 });
    kt(ctx, lab, x + 235, CAM_TOP + 585, { font: F.ui(28, 900), color: ink, align: 'center' });
    kt(ctx, big, x + 235, CAM_TOP + 665, { font: F.ui(64, 900), color: ink, align: 'center' });
    kt(ctx, sub, x + 235, CAM_TOP + 725, { font: F.ui(26, 800), color: ink, align: 'center', maxW: 430 }); ctx.restore();
  });
  const ta = ecue(s, 'australia') + 0.8;
  pill(ctx, s, 'PRELIMS TRAP: host ≠ chair of the talks', 50, CAM_TOP + 800, ta, '#E63946', '#FFFFFF', 34);
  kt(ctx, 'Preparatory meeting: Fiji', 64, 1880, { font: F.ui(28, 700), color: '#E9D5FF', alpha: eia(s, ta + 0.4) });
};

SCENES.S3 = (ctx, s) => {                   // the ice block loses its top third on "third"
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHY SHOULD INDIA CARE?');
  const tg = ecue(s, 'glaciers'), k = bounce(s.t, tg); if (k > 0) {
    const x = 120, y = CAM_TOP + 170, w = 380, h = 660, tt = ecue(s, 'third'), m = span(s.t, tt, tt + 0.9);
    ctx.save(); ctx.globalAlpha = Math.min(1, k);
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, ICE);
    ctx.fillStyle = g; rr(ctx, x, y + h / 3 * easeOut(m), w, h - h / 3 * easeOut(m), 22); ctx.fill();
    if (m > 0 && m < 1) { ctx.globalAlpha = 1 - m; ctx.fillStyle = ICE; rr(ctx, x, y + 60 * m, w, h / 3, 22); ctx.fill(); ctx.globalAlpha = 1; }
    if (m > 0) { ctx.setLineDash([14, 10]); ctx.strokeStyle = '#E9D5FF'; ctx.lineWidth = 5; ctx.strokeRect(x, y, w, h / 3); ctx.setLineDash([]); }
    kt(ctx, 'Hindu Kush', x + w / 2, y + h - 120, { font: F.ui(36, 900), color: '#0B3B5C', align: 'center' });
    kt(ctx, 'Himalaya ice', x + w / 2, y + h - 75, { font: F.ui(36, 900), color: '#0B3B5C', align: 'center' });
    ctx.restore();
    if (m > 0) { kt(ctx, '−⅓', 560, y + 150, { font: F.ui(130, 900), color: YEL, alpha: Math.min(1, m * 2) });
      kt(ctx, 'even at 1.5 °C', 565, y + 220, { font: F.ui(40, 900), color: '#FFFFFF', alpha: Math.min(1, m * 2) });
      kt(ctx, '−⅔ at 3 °C', 565, y + 290, { font: F.ui(34, 800), color: '#E9D5FF', alpha: Math.min(1, m * 2) }); }
  }
  pill(ctx, s, 'They feed the Ganga, Indus and Brahmaputra', 50, CAM_TOP + 880, ecue(s, 'nadulu'), SKY, '#062A3A', 32);
  kt(ctx, 'State of the Cryosphere 2026 (International Cryosphere Climate Initiative with the United Nations Environment Programme)', 64, 1860, { font: F.ui(22, 700), color: '#E9D5FF', maxW: W - 128, lh: 28, alpha: eia(s, ecue(s, 'third') + 1) });
};

SCENES.S4 = (ctx, s) => {                   // India's two demands
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHAT WILL INDIA DEMAND?', 'Environment Minister, 3 November 2026');
  card(ctx, 50, CAM_TOP + 190, W - 100, 280, YEL, bounce(s.t, ecue(s, 'finance')), [['1 · CLIMATE FINANCE', F.ui(40, 900), '#6B21A8'], ['Public and affordable money from developed countries, not new debt', F.ui(40, 900), INK]]);
  card(ctx, 50, CAM_TOP + 500, W - 100, 280, '#FFFFFF', bounce(s.t, ecue(s, 'determined')), [['2 · NATIONALLY DETERMINED TARGETS', F.ui(40, 900), '#6B21A8'], ['Each country sets its own targets, not imposed from the top', F.ui(40, 900), INK]]);
  kt(ctx, 'Negotiates with: Group of 77 and China · Like-Minded Developing Countries · Brazil, South Africa, India and China', 64, CAM_TOP + 840,
     { font: F.ui(26, 800), color: '#E9D5FF', maxW: W - 128, lh: 34, alpha: eia(s, ecue(s, 'top') + 0.3) });
};

SCENES.S5 = (ctx, s) => {                   // India's own promise, and the intensity trap
  vBase(ctx); camSpace(ctx, CAM_TOP); header(ctx, s, 'WHAT HAS INDIA PROMISED?', 'Nationally Determined Contribution, 2031–2035');
  const tiles = [['47%', 'cut in emissions intensity by 2035 (vs 2005)', YEL, INK, 'forty-seven', 50, CAM_TOP + 190],
    ['≈60%', 'non-fossil power capacity by 2035', '#06D6A0', '#053B2C', 'sixty', 560, CAM_TOP + 190],
    ['2070', 'net zero', SKY, '#062A3A', 'seventy', 50, CAM_TOP + 470]];
  tiles.forEach(([big, sub, fill, ink, cue, x, y]) => {
    const k = bounce(s.t, ecue(s, cue)); if (k <= 0) return; const w = x === 50 && big === '2070' ? 470 : 470;
    ctx.save(); ctx.translate(x + w / 2, y + 120); ctx.scale(k, k); ctx.translate(-(x + w / 2), -(y + 120));
    exBox(ctx, x, y, w, 250, { fill, r: 26 });
    kt(ctx, big, x + w / 2, y + 120, { font: F.ui(96, 900), color: ink, align: 'center' });
    kt(ctx, sub, x + w / 2, y + 180, { font: F.ui(28, 800), color: ink, align: 'center', maxW: w - 40, lh: 34 }); ctx.restore();
  });
  const tt = ecue(s, 'trap'), k = bounce(s.t, tt - 0.2);
  if (k > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, k); ctx.fillStyle = 'rgba(230,57,70,0.95)'; rr(ctx, 560, CAM_TOP + 470, 470, 250, 24); ctx.fill();
    kt(ctx, 'PRELIMS TRAP', 590, CAM_TOP + 525, { font: F.ui(28, 900), color: '#FFFFFF' });
    kt(ctx, 'An intensity target, not a cap on total emissions', 590, CAM_TOP + 585, { font: F.ui(36, 900), color: '#FFFFFF', maxW: 410, lh: 44 }); ctx.restore(); }
  kt(ctx, 'Emissions intensity = emissions per unit of gross domestic product', 64, CAM_TOP + 800, { font: F.ui(28, 800), color: '#E9D5FF', maxW: W - 128, alpha: eia(s, ecue(s, 'intensity') + 0.5) });
};

SCENES.S6 = (ctx, s) => { vBase(ctx); camSpace(ctx, CAM_FACE); band(ctx, s, [['MAINS DEBATE', YEL, 84, 'mains'], ['SHOULD THOSE WHO POLLUTED FIRST PAY FIRST?', '#FFFFFF', 38, 'polluted']]); };
