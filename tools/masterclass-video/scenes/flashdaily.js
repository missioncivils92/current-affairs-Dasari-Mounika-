// Daily flash cards (owner, 28 Nov 2026: "everyday will keep posting such flash cards", new topics each day).
// Load a day's data file BEFORE this file; it sets DAILY = { date, cards: [...] } in the same shape as flash48.js's FC.
// node render.js <assets> <tl> scenes/weekly48.js,scenes/pencil48.js,scenes/daily/<date>.js,scenes/flashdaily.js <out> --size 1080x1350 --stills ...
// Rows S101.. : odd = front (questions), even = back (answers + Prelims Trap).
(function () {
  const FC = DAILY.cards, N = FC.length, NV = '#16206B';
  function cardBg(ctx, col) {
    const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1B0B45'); g.addColorStop(1, '#4C1D95'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 30; rr(ctx, 60, 150, W - 120, H - 260, 34); ctx.fillStyle = '#FFFEF8'; ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, 60, 150, W - 120, H - 260, 34); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(60, 150, W - 120, 120);
    ctx.strokeStyle = 'rgba(70,130,200,0.18)'; ctx.lineWidth = 2; for (let y = 330; y < H - 110; y += 54) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(W - 60, y); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(220,60,60,0.35)'; ctx.beginPath(); ctx.moveTo(140, 270); ctx.lineTo(140, H - 110); ctx.stroke(); ctx.restore();
    kt(ctx, '@decodeupscwithmounika', W / 2, 90, { font: F.ui(34, 900), color: '#FFD60A', align: 'center' });
    kt(ctx, 'Decode UPSC with Mounika · Daily flash cards · ' + DAILY.date, W / 2, H - 50, { font: F.ui(26, 800), color: 'rgba(255,255,255,0.8)', align: 'center' });
  }
  function header(ctx, c, side) {
    kt(ctx, 'FLASH CARD ' + c.n + '/' + N, 100, 228, { font: F.ui(34, 900), color: '#FFFFFF' });
    kt(ctx, c.t, W - 100, 228, { font: F.ui(40, 900), color: '#FFFFFF', align: 'right', maxW: 620 });
    exChip(ctx, side, W / 2 - (side.length * 13), 290, side === 'QUESTIONS' ? '#FFD60A' : '#06D6A0', '#1B0B45', 34, 1);
  }
  function front(c) {
    return (ctx, s) => {
      cardBg(ctx, c.col); header(ctx, c, 'QUESTIONS');
      let y = 420;
      c.q.forEach((q, i) => { kt(ctx, 'Q' + (i + 1), 120, y, { font: F.ui(42, 800), color: c.col }); y += kt(ctx, q, 200, y, { font: F.ui(34, 800), color: '#1F2937', maxW: 800, lh: 46 }) + 60; });
      if (c.pic) { const b = [320, Math.min(H - 290 - 270, Math.max(760, y - 30)), 440, 235]; ctx.save(); ctx.translate(b[0] + b[2] / 2, b[1] + b[3] / 2); ctx.rotate(-0.02); ctx.translate(-(b[0] + b[2] / 2), -(b[1] + b[3] / 2));
        ctx.fillStyle = '#FFF'; ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 16; ctx.fillRect(b[0] - 12, b[1] - 12, b[2] + 24, b[3] + 24); ctx.shadowBlur = 0;
        ctx.save(); ctx.beginPath(); ctx.rect(b[0], b[1], b[2], b[3]); ctx.clip(); const st = { ...s, t: s.d };
        if (c.pic[0] === 'sat') satView(ctx, st, b, c.pic[1], c.pic[2], c.pic[3], {});
        else exMap(ctx, st, b, PAL.world, { bounds: c.pic[1], focus: c.pic[2], highlight: c.pic[3], credit: 'Survey of India outline' });
        ctx.restore(); ctx.restore(); }
      rr(ctx, 120, H - 290, W - 240, 110, 24); ctx.fillStyle = '#FFF3C4'; ctx.fill();
      kt(ctx, 'Answer in the comments, then swipe ➡', W / 2, H - 222, { font: F.ui(35, 800), color: '#7A2E0E', align: 'center' });
    };
  }
  function back(c) {
    return (ctx, s) => {
      cardBg(ctx, c.col); header(ctx, c, 'ANSWERS');
      let y = 420;
      c.a.forEach((a, i) => { kt(ctx, '✓', 120, y, { font: F.ui(48, 900), color: '#059669' }); kt(ctx, 'Q' + (i + 1), 170, y, { font: F.ui(31, 800), color: c.col });
        y += kt(ctx, a, 240, y, { font: F.ui(35, 800), color: NV, maxW: 760, lh: 46 }) + 56; });
      const h = 210; rr(ctx, 110, H - 130 - h - 40, W - 220, h, 22); ctx.fillStyle = '#FFE3EE'; ctx.fill();
      kt(ctx, '⚠ Prelims Trap', 140, H - 130 - h + 20, { font: F.ui(37, 800), color: '#B91C1C' });
      kt(ctx, c.trap, 140, H - 130 - h + 80, { font: F.ui(31, 800), color: '#1F2937', maxW: W - 300, lh: 46 });
    };
  }
  FC.forEach((c, i) => { SCENES['S' + (101 + 2 * i)] = front(c); SCENES['S' + (102 + 2 * i)] = back(c); });
})();
