// Scenes for the sample Deep Dive "Who decides at the Election Commission?" (weeks/2026-W44/sample-eci), v1.
// Each scene: SCENES.Sxx = (ctx, s) with s = {t, d, p, w(word), beat(i), hold, text}; set s.credit for on-screen credits.
// Sub judice: cards report the proceedings and attribute each claim; no individual is named or characterised on screen.
const COURT = 'Sources: Supreme Court proceedings (5, 26–27 Oct 2026) as reported · ECI affidavit, 26 Oct 2026';
function heading(ctx, s, a = 1, y = 170, col = C.yellow) { text(ctx, s, 140, y, { font: F.ui(32, 800), color: col, alpha: a }); }
function deskWrite(ctx, s, lines, cues, o = {}) {
  const w = cues.reduce((acc, c) => acc + span(s.t, c, c + 1.3), 0) / lines.length;
  desk(ctx, s.t, { ...o, lines, write: w });
}
function strike(ctx, x0, x1, y, p, col = C.red) {
  if (p <= 0) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, easeOut(p)), y); ctx.stroke(); ctx.restore();
}
function countdown(ctx, s, x, y, r = 95) {
  const h = s.hold; if (!h) return;
  const ra = appear(s.t, h.at - 0.2, 0.4) * (1 - span(s.t, h.at + h.dur + 0.6, h.at + h.dur + 1.2)), cd = clamp((s.t - h.at) / h.dur), left = Math.ceil(h.dur - cd * h.dur);
  ctx.save(); ctx.globalAlpha = ra; ctx.fillStyle = 'rgba(20,23,28,0.92)'; ctx.beginPath(); ctx.arc(x, y, r + 25, 0, 7); ctx.fill();
  ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
  ctx.strokeStyle = C.yellow; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.stroke(); ctx.restore();
  text(ctx, String(clamp(left, 0, h.dur)), x, y + 35, { font: F.head(96), align: 'center', alpha: ra, color: C.yellow });
}
// three seats at the Commission's table: the recurring device of this Deep Dive
function seats(ctx, s, o = {}) {
  const P = [[960, 430, 'CEC'], [620, 640, 'EC'], [1300, 640, 'EC']];
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1;
  ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.ellipse(960, 580, 470, 170, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2; ctx.stroke();
  P.forEach(([x, y, l], i) => {
    ctx.beginPath(); ctx.arc(x, y, 78, 0, 7); ctx.fillStyle = '#2B3139'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = i === 0 ? C.yellow : 'rgba(255,255,255,0.4)'; ctx.stroke();
    text(ctx, l, x, y + 14, { font: F.ui(40, 800), align: 'center', color: i === 0 ? C.yellow : C.white });
    if (o.votes > 0) { const k = pop(s.t, o.voteAt + i * 0.25); if (k > 0) { ctx.save(); ctx.translate(x + 70, y - 60); ctx.scale(k, k); ctx.beginPath(); ctx.arc(0, 0, 26, 0, 7); ctx.fillStyle = C.teal; ctx.fill(); text(ctx, '1', 0, 11, { font: F.ui(30, 800), align: 'center', color: C.slate }); ctx.restore(); } }
  });
  ctx.restore();
  return P;
}

// ---------------- 2.1 case-file board ----------------
SCENES.S01 = (ctx, s) => {
  bg(ctx, { inner: '#2A2620', outer: '#14120F' }); heading(ctx, 'SUPREME COURT · PLEAS ON THE ELECTION COMMISSION\'S FUNCTIONING', appear(s.t, 0), 130);
  const B = [['5 Oct', 'Notice issued · interim suspension refused', 'fifth', 140, -0.02], ['26 Oct', 'ECI affidavit: SIR orders unanimous · Form 6 not amended', 'twenty-sixth', 720, 0.015], ['27 Oct', 'Adjourned · next hearing 17 Nov', 'seventeenth', 1300, -0.01]];
  const pins = [];
  B.forEach(([d, l, cw, x, rot], i) => {
    const a = appear(s.t, s.w(cw) - 0.4), y = 230; pins.push([x + 240, y + 20]);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x + 240, y + 170); ctx.rotate(rot); ctx.translate(-(x + 240), -(y + 170));
    card(ctx, x, y + (1 - a) * -40, 480, 380, { fill: '#EDE6D6', r: 4 });
    text(ctx, d, x + 30, y + 100, { font: F.head(64), color: '#1E2228' });
    text(ctx, l, x + 30, y + 190, { font: F.hand(44), color: '#8A3A2A', maxW: 420, lh: 50 });
    ctx.beginPath(); ctx.arc(x + 240, y + 20, 12, 0, 7); ctx.fillStyle = C.red; ctx.fill(); ctx.restore();
  });
  const t1 = s.w('twenty-sixth'), t2 = s.w('seventeenth');
  arrow(ctx, [pins[0], [(pins[0][0] + pins[1][0]) / 2, 320], pins[1]], span(s.t, t1, t1 + 1.2), { color: 'rgba(229,72,77,0.85)', lw: 3, noHead: true });
  arrow(ctx, [pins[1], [(pins[1][0] + pins[2][0]) / 2, 320], pins[2]], span(s.t, t2 - 0.6, t2 + 0.6), { color: 'rgba(229,72,77,0.85)', lw: 3, noHead: true });
  const b = appear(s.t, s.w('surya') - 0.3);
  card(ctx, 360, 760, 1200, 110, { fill: 'rgba(20,23,28,0.9)', stroke: 'rgba(255,255,255,0.15)', alpha: b });
  text(ctx, 'Bench: CJI Surya Kant · Justice Joymalya Bagchi · Justice V. Mohana', 960, 830, { font: F.ui(34, 700), align: 'center', alpha: b });
  s.credit = COURT; vignette(ctx, 0.4);
};
// ---------------- 2.2 split-screen dilemma ----------------
SCENES.S02 = (ctx, s) => {
  bg(ctx);
  const l = appear(s.t, s.w('together') - 0.3), r = appear(s.t, s.w('protected') - 0.3), q = appear(s.t, s.w('structural') - 0.3);
  card(ctx, 120, 150, 820, 470, { accent: C.teal, alpha: Math.max(l, 0.15) });
  card(ctx, 980, 150, 820, 470, { accent: C.red, alpha: Math.max(r, 0.15) });
  text(ctx, 'EQUAL VOTES', 180, 250, { font: F.ui(44, 800), color: C.teal, alpha: l });
  text(ctx, 'Three members decide together', 180, 340, { font: F.head(50), maxW: 700, lh: 62, alpha: l });
  text(ctx, 'UNEQUAL SHIELD', 1040, 250, { font: F.ui(44, 800), color: C.red, alpha: r });
  text(ctx, 'One member protected like a Supreme Court judge', 1040, 340, { font: F.head(50), maxW: 700, lh: 62, alpha: r });
  card(ctx, 220, 680, 1480, 220, { stroke: C.yellow, lw: 3, alpha: q });
  revealWords(ctx, 'A three-member Commission, or a one-member office?', 960, 815, span(s.t, s.w('structural'), s.w('protected') + 0.4), { font: F.head(58), align: 'center', maxW: 1400, highlight: ['three-member', 'one-member'] });
  vignette(ctx, 0.35);
};
// ---------------- 2.3 key terms ----------------
SCENES.S03 = (ctx, s) => {
  bg(ctx); heading(ctx, 'KEY TERMS', appear(s.t, 0), 170);
  const T = [['Multi-member Commission', 'CEC + 2 Election Commissioners decide together', 'the CEC is the first among equals, not the boss', 'together'],
             ['Special Intensive Revision (SIR)', 'the electoral roll prepared afresh, house to house', 'not the routine summary revision', 'afresh']];
  T.forEach(([h, d, sub, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = 230 + i * 330, dx = (1 - a) * 60;
    card(ctx, 140 + dx, y, 1640, 290, { accent: C.yellow, alpha: a });
    text(ctx, h, 200 + dx, y + 90, { font: F.head(58), color: C.yellow, alpha: a });
    text(ctx, d, 200 + dx, y + 170, { font: F.ui(40, 700), alpha: a, maxW: 1500 });
    text(ctx, sub, 200 + dx, y + 235, { font: F.ui(30, 600), color: C.dim, alpha: a });
  });
  vignette(ctx, 0.35);
};
// ---------------- 2.4 Article 324 + the one-to-three timeline ----------------
SCENES.S04 = (ctx, s) => {
  bg(ctx);
  const a = appear(s.t, s.w('superintendence') - 0.3), b = appear(s.t, s.w('president') - 0.3);
  card(ctx, 140, 130, 1640, 400, { accent: C.yellow, alpha: Math.max(a, 0.1) });
  text(ctx, 'ARTICLE 324', 200, 210, { font: F.ui(40, 800), color: C.yellow, alpha: a });
  text(ctx, '(1) superintendence, direction and control of elections → the Election Commission', 200, 300, { font: F.head(44), maxW: 1520, lh: 58, alpha: a });
  text(ctx, '(2) the President fixes the number of Election Commissioners', 200, 450, { font: F.head(44), maxW: 1520, color: C.yellow, alpha: b });
  const xs = [260, 960, 1660], y = 760;
  arrow(ctx, [[160, y], [1760, y]], span(s.t, s.w('forty') - 0.3, s.w('1993') + 0.5), { color: C.blue, lw: 10, noHead: true });
  [['1950–1989', 'one member', 'forty'], ['Oct 1989 → Jan 1990', 'briefly three, then one', '1989'], ['Oct 1993', 'three members ever since', '1993']].forEach(([yr, l, cw], i) => {
    const k = appear(s.t, s.w(cw) - 0.3);
    ctx.save(); ctx.globalAlpha = k; ctx.beginPath(); ctx.arc(xs[i], y, 18, 0, 7); ctx.fillStyle = i === 2 ? C.yellow : C.white; ctx.fill(); ctx.restore();
    text(ctx, yr, xs[i], y - 50, { font: F.head(44), align: 'center', color: C.yellow, alpha: k });
    text(ctx, l, xs[i], y + 75, { font: F.ui(32, 700), align: 'center', alpha: k });
  });
  vignette(ctx, 0.35);
};
// ---------------- 2.5 Seshan 1995 + Section 18 ----------------
SCENES.S05 = (ctx, s) => {
  bg(ctx);
  const a = appear(s.t, s.w('1995') - 0.3), b = appear(s.t, s.w('section') - 0.3);
  card(ctx, 140, 110, 800, 230, { accent: C.blue, alpha: a });
  text(ctx, '1995 · T.N. Seshan v Union of India', 190, 190, { font: F.ui(34, 800), color: C.blue, alpha: a });
  text(ctx, 'Five judges: the CEC is the first among equals', 190, 260, { font: F.head(40), maxW: 720, lh: 50, alpha: a });
  card(ctx, 980, 110, 800, 230, { accent: C.yellow, alpha: b });
  text(ctx, 'CEC & ECs Act 2023 · Section 18', 1030, 190, { font: F.ui(34, 800), color: C.yellow, alpha: b });
  text(ctx, 'Unanimous as far as possible; if they differ, the majority prevails', 1030, 260, { font: F.head(38), maxW: 720, lh: 48, alpha: b });
  seats(ctx, s, { alpha: appear(s.t, s.w('rule') - 0.3), votes: 1, voteAt: s.w('majority') - 0.3 });
  const m = appear(s.t, s.w('prevails') - 0.2);
  text(ctx, '2 votes out of 3 decide', 960, 920, { font: F.hand(60), align: 'center', color: C.teal, alpha: m });
  vignette(ctx, 0.35);
};
// ---------------- 2.6 the asymmetry ----------------
SCENES.S06 = (ctx, s) => {
  bg(ctx);
  const P = seats(ctx, s, { votes: 1, voteAt: -5 });
  const a = appear(s.t, s.w('supreme court') - 0.3), b = appear(s.t, s.w('recommendation') - 0.3);
  // yellow bracket around the CEC seat
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = C.yellow; ctx.lineWidth = 6; ctx.shadowColor = C.yellow; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(P[0][0], P[0][1], 108, -Math.PI * 0.95, -Math.PI * 0.05 + 2 * Math.PI * 0); ctx.stroke(); ctx.beginPath(); ctx.arc(P[0][0], P[0][1], 108, Math.PI * 0.05, Math.PI * 0.95); ctx.stroke(); ctx.restore();
  text(ctx, 'Art 324(5): removed only like an SC judge', 960, 280, { font: F.ui(36, 800), align: 'center', color: C.yellow, alpha: a });
  [P[1], P[2]].forEach(([x, y]) => text(ctx, 'removable on the CEC\'s recommendation', x, y + 140, { font: F.ui(28, 700), align: 'center', color: C.dim, alpha: b, maxW: 380 }));
  const u = appear(s.t, s.w('unequal') - 0.3);
  ctx.save(); ctx.globalAlpha = u; ctx.fillStyle = 'rgba(14,16,20,0.9)'; ctx.fillRect(0, 920, W, 110); ctx.restore();
  text(ctx, 'EQUAL VOTES · UNEQUAL SECURITY', 960, 995, { font: F.ui(46, 800), align: 'center', color: C.red, alpha: u });
  vignette(ctx, 0.35);
};
// ---------------- 2.7 who makes Form 6 ----------------
SCENES.S07 = (ctx, s) => {
  bg(ctx); heading(ctx, 'WHO CAN CHANGE FORM 6?', appear(s.t, 0), 150);
  // read left to right in the order she says it: the form → who makes it → under which law
  const B = [['Registration of Electors Rules 1960', 'Form 6: new voter enrolment', 'rules'], ['Central Government', 'makes the rules, after consulting the ECI', 'central government'], ['Parliament', 'Representation of the People Act 1950 · s.28', 'section 28']];
  B.forEach(([h, sub, cw], i) => {
    const at = s.w(cw) - 0.3, a = appear(s.t, at), x = 140 + i * 580, y = 260;
    card(ctx, x, y, 520, 260, { accent: i === 0 ? C.yellow : C.blue, alpha: Math.max(a, 0.1) });
    text(ctx, h, x + 40, y + 90, { font: F.head(42), color: i === 0 ? C.yellow : C.white, alpha: a, maxW: 450, lh: 50 });
    text(ctx, sub, x + 40, y + 190, { font: F.ui(30, 600), color: '#C9CFD6', alpha: a, maxW: 450, lh: 38 });
    if (i) { arrow(ctx, [[x - 6, y + 130], [x - 54, y + 130]], span(s.t, at, at + 0.5), { color: C.yellow, lw: 5 });
             text(ctx, i === 1 ? 'made by' : 'under', x - 30, y - 16, { font: F.ui(26, 700), align: 'center', color: C.dim, alpha: a }); }
  });
  const e = appear(s.t, s.w('cannot') - 0.3);
  card(ctx, 140, 600, 1640, 140, { stroke: C.red, lw: 3, alpha: e });
  text(ctx, 'The ECI cannot amend Form 6 on its own', 960, 690, { font: F.head(48), align: 'center', color: C.red, alpha: e });
  const f = appear(s.t, s.w('separate') - 0.3);
  card(ctx, 140, 790, 1640, 140, { stroke: 'rgba(255,255,255,0.2)', alpha: f });
  text(ctx, 'ECI affidavit: the SIR declaration is a separate document, not a change to Form 6', 960, 878, { font: F.ui(34, 700), align: 'center', alpha: f });
  s.credit = 'Sources: RP Act 1950 s.28 · Registration of Electors Rules 1960 · ECI affidavit, 26 Oct 2026 (as reported)'; vignette(ctx, 0.35);
};
// ---------------- 2.8 Prelims Trap ----------------
SCENES.S08 = (ctx, s) => {
  bg(ctx); pill(ctx, 'PRELIMS TRAP', 140, 130, { fill: C.red, color: C.white, font: F.ui(34, 800), h: 62 });
  const T = [['EC removal: on the CEC\'s recommendation', 'only the CEC has the Supreme Court judge procedure (Art 324(5))', 'removed'],
             ['Number of ECs: fixed by the President', 'the Constitution sets no number (Art 324(2))', 'number'],
             ['Rules: Central Government · roll: the ERO', 'not the Election Commission itself', 'rule-maker']];
  T.forEach(([h, sub, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = 250 + i * 240;
    card(ctx, 140, y, 1640, 200, { accent: C.red, alpha: Math.max(a, 0.12) });
    text(ctx, (i + 1) + ' · ' + h, 200, y + 85, { font: F.head(52), alpha: a });
    text(ctx, sub, 200, y + 150, { font: F.ui(32, 600), color: '#C9CFD6', alpha: a });
  });
  vignette(ctx, 0.35);
};
// ---------------- 2.9–2.10 Statement-I/II on the examiner's desk ----------------
const ST = ['Statement-I: The Chief Election Commissioner cannot be removed from office except in the manner of a judge of the Supreme Court.',
            'Statement-II: Under the CEC and ECs Act, 2023, when the members differ, the opinion of the Chief Election Commissioner prevails.'];
const OPTS = ['(a) Both are correct and Statement-II explains Statement-I', '(b) Both are correct but Statement-II does not explain Statement-I', '(c) Statement-I is correct but Statement-II is incorrect', '(d) Statement-I is incorrect but Statement-II is correct'];
function stPaper(ctx, s, o = {}) {
  bg(ctx, { inner: '#22262D' });
  ctx.save(); ctx.translate(960, 540); ctx.rotate(-0.01); ctx.translate(-960, -540);
  card(ctx, 180, 60, 1560, 960, { fill: '#EDE6D6', r: 6 });
  const typed = o.typed ?? 1;
  ST.forEach((m, i) => {
    const y = 150 + i * 190, a = clamp(typed * 2.2 - i);
    text(ctx, m, 240, y, { font: F.ui(36, 600), color: '#1E2228', alpha: a, maxW: 1440, lh: 46 });
    if (i === 1 && o.strike > 0) { strike(ctx, 235, 1680, y - 12, o.strike); strike(ctx, 235, 1300, y + 34, o.strike); }
  });
  text(ctx, 'Which one of the following is correct in respect of the above statements?', 240, 560, { font: F.head(38), color: '#1E2228', alpha: clamp(typed * 2.2 - 1.6) });
  OPTS.forEach((op, i) => {
    const y = 640 + i * 78; text(ctx, op, 270, y, { font: F.ui(32, 600), color: '#1E2228', alpha: clamp(typed * 2.2 - 1.8) });
    if (i === 2 && o.circle > 0) { ctx.save(); ctx.strokeStyle = '#C08A00'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(760, y - 11, 540, 40, 0, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * easeOut(o.circle)); ctx.stroke(); ctx.restore(); }
  });
  if (o.reason) text(ctx, o.reason, 240, 975, { font: F.hand(46), color: '#8A5A00', alpha: o.reasonA ?? 1, maxW: 1440 });
  ctx.restore();
  pill(ctx, 'UPSC FORMAT · STATEMENT-I / II', 80, 10, { font: F.ui(24, 800), h: 42 });
}
SCENES.S09 = (ctx, s) => { stPaper(ctx, s, { typed: span(s.t, 0.2, Math.min(s.d - 1, s.w('right'))) }); countdown(ctx, s, 1730, 900); };
SCENES.S10 = (ctx, s) => {
  const mj = s.w('majority') - 0.2;
  stPaper(ctx, s, { circle: span(s.t, s.w('option c') - 0.2, s.w('option c') + 0.8), strike: span(s.t, mj, mj + 0.8),
    reason: '(c): Art 324(5) protects the CEC; under s.18 the majority decides.', reasonA: appear(s.t, mj + 0.6) });
};
// ---------------- 2.11 Mains Lens ----------------
SCENES.S11 = (ctx, s) => {
  bg(ctx); pill(ctx, 'MAINS LENS', 80, 130, { font: F.ui(32, 800), h: 58 });
  const Q = [['INDEPENDENCE', '2023 panel: PM + Union Cabinet Minister + LoP (CJI out). Split SC order, Sep 2026 → larger bench', C.yellow, 'independence'],
             ['FEDERAL BALANCE', 'Rolls prepared by State government officers (EROs) under ECI control', C.blue, 'federal'],
             ['RIGHTS', 'Art 326 adult suffrage · revision complaints to be examined State by State', C.teal, 'rights']];
  Q.forEach(([h, sub, col, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = 230 + i * 260, dx = (1 - a) * 60;
    card(ctx, 140 + dx, y, 1640, 220, { accent: col, alpha: Math.max(a, 0.12) });
    text(ctx, h, 200 + dx, y + 80, { font: F.ui(36, 800), color: col, alpha: a });
    text(ctx, sub, 200 + dx, y + 150, { font: F.head(42), maxW: 1520, alpha: a });
  });
  s.credit = 'Sources: CEC & ECs Act 2023 · Anoop Baranwal v UoI (2023) · SC order of 23 Sep 2026 (as reported)'; vignette(ctx, 0.35);
};
// ---------------- 2.12 [EXT] contestable proposition ----------------
SCENES.S12 = (ctx, s) => {
  bg(ctx);
  revealWords(ctx, '“A multi-member Election Commission is a stronger guardian of free elections.”', 960, 190, span(s.t, 0, s.w('for it') - 0.3), { font: F.head(56), align: 'center', maxW: 1700 });
  const fa = appear(s.t, s.w('for it') - 0.3), ag = appear(s.t, s.w('against') - 0.3);
  card(ctx, 140, 380, 790, 560, { accent: C.teal, alpha: fa }); card(ctx, 990, 380, 790, 560, { accent: C.red, alpha: ag });
  text(ctx, 'FOR', 200, 460, { font: F.ui(38, 800), color: C.teal, alpha: fa }); text(ctx, 'AGAINST', 1050, 460, { font: F.ui(38, 800), color: C.red, alpha: ag });
  [['three minds check one (Seshan 1995)', 'three'], ['the majority decides (s.18)', 'majority']].forEach(([l, cw], i) => text(ctx, '✓ ' + l, 200, 570 + i * 130, { font: F.head(42), maxW: 700, alpha: appear(s.t, s.w(cw) - 0.2) }));
  [['equal votes, unequal tenure security', 'security'], ['an unrecorded dissent counts for little', 'dissent']].forEach(([l, cw], i) => text(ctx, '✗ ' + l, 1050, 570 + i * 130, { font: F.head(42), maxW: 700, alpha: appear(s.t, s.w(cw) - 0.2) }));
  vignette(ctx, 0.35);
};
// ---------------- 2.13 Way forward ----------------
SCENES.S13 = (ctx, s) => {
  bg(ctx); heading(ctx, 'WAY FORWARD', appear(s.t, 0), 160);
  const B = [['Law Commission, 255th Report (2015)', 'amend Art 324(5): give ECs the CEC\'s removal protection', 'two hundred'], ['Section 18 in practice', 'record dissents and decisions, so courts and citizens can see how the Commission decided', 'recording']];
  B.forEach(([h, sub, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = 230 + i * 250, drop = (1 - a) * -50;
    card(ctx, 160, y + drop, 1600, 210, { accent: C.blue, alpha: a });
    text(ctx, h, 220, y + drop + 85, { font: F.head(48), alpha: a }); text(ctx, sub, 220, y + drop + 155, { font: F.ui(32, 600), color: '#C9CFD6', alpha: a, maxW: 1480 });
  });
  const r = appear(s.t, s.w('referee') - 0.3);
  card(ctx, 160, 760, 1600, 150, { stroke: C.yellow, lw: 3, alpha: r });
  text(ctx, 'India\'s imperative: trust in the referee, built on structure', 960, 850, { font: F.ui(40, 800), align: 'center', color: C.yellow, alpha: r });
  s.credit = 'Source: Law Commission of India, Report No. 255, Electoral Reforms (March 2015)'; vignette(ctx, 0.35);
};
// ---------------- 2.14 Write this down ----------------
SCENES.S14 = (ctx, s) => {
  deskWrite(ctx, s, [{ s: 'Art 324(5) → removal' }, { s: 's.18, 2023 Act → majority' }, { s: 'Seshan 1995 → first among equals' }, { s: 'RP Act 1950 s.28 → forms' }],
    [s.w('removal') - 0.2, s.w('majority') - 0.2, s.w('seshan') - 0.2, s.w('forms') - 0.6], { handSize: 54 });
  lowerThird(ctx, 'GS-2 · Constitutional bodies', appear(s.t, 0.6));
};
// ---------------- 2.15 model question ----------------
SCENES.S15 = (ctx, s) => {
  bg(ctx); pill(ctx, 'GS-2 · 15 MARKS · 250 WORDS', 80, 130, { font: F.ui(30, 800), h: 56 });
  card(ctx, 140, 220, 1640, 260, { accent: C.yellow });
  revealWords(ctx, 'Is the Election Commission of India a collegial body in law but a single-member body in practice? Examine.', 200, 320, span(s.t, 0.2, s.w('examine') + 0.4), { font: F.head(50), maxW: 1520, lh: 64, highlight: ['collegial', 'single-member'] });
  [['INTRO', 'Article 324 + the 1993 change', 'introduce'], ['BODY', 'decision rule · security of tenure · rule-making · appointment', 'body'], ['CONCLUSION', 'Law Commission 2015 + recorded decisions', 'conclude']].forEach(([h, sub, cw], i) => {
    const a = appear(s.t, s.w(cw) - 0.3), y = 530 + i * 150, dx = (1 - a) * 80;
    card(ctx, 140 + dx, y, 1640, 128, { alpha: a, stroke: 'rgba(255,255,255,0.15)' });
    text(ctx, h, 190 + dx, y + 76, { font: F.ui(30, 800), color: C.yellow, alpha: a }); text(ctx, sub, 450 + dx, y + 76, { font: F.ui(34, 600), maxW: 1300, alpha: a });
  });
  vignette(ctx, 0.35);
};
// ---------------- 2.16 checkpoint ----------------
SCENES.S16 = (ctx, s) => {
  desk(ctx, s.t, { book: false, lamp: 0.85 }); ctx.fillStyle = 'rgba(10,12,15,0.45)'; ctx.fillRect(0, 0, W, H);
  const k = appear(s.t, 0);
  card(ctx, 220, 200, 1480, 600, { fill: 'rgba(38,43,51,0.97)', stroke: C.yellow, lw: 3, alpha: k });
  pill(ctx, 'PAUSE AND ANSWER', 290, 255, { alpha: k, font: F.ui(30, 800), h: 54 });
  text(ctx, 'Which instrument sets how the Commission votes, and which sets how its members are removed? Which one can Parliament change by an ordinary law?', 290, 400, { font: F.head(48), maxW: 1020, lh: 64, alpha: k });
  countdown(ctx, s, 1480, 500, 110);
  text(ctx, 'answer: in the Trap Vault', 960, 900, { font: F.hand(46), align: 'center', color: C.dim, alpha: appear(s.t, s.w('settle') - 0.2) });
};
// ---------------- 2.17–2.18 the fact map ----------------
const CTR = [960, 530];
const NODES = [
  { s: 'Art 324(2): President fixes the number of ECs', at: [420, 210], l: 'rooted in' },
  { s: '3 members since Oct 1993 · Seshan 1995: first among equals', at: [1500, 210], l: 'history' },
  { s: '2023 Act s.18: unanimous, else majority', at: [330, 530], l: 'decides by', blank: 'Members differ → ________', ans: 'the majority' },
  { s: 'Art 324(5): CEC removed like an SC judge · ECs on CEC\'s recommendation', at: [1590, 530], l: 'protected by', blank: 'EC removed on the recommendation of ____', ans: 'the CEC' },
  { s: 'Form 6: Registration of Electors Rules 1960 (Centre, RP Act s.28)', at: [420, 850], l: 'rules by', blank: 'Form 6 rules made by ____', ans: 'the Central Govt' },
  { s: 'SC: next hearing 17 Nov · complaints State by State', at: [1500, 850], l: 'next' },
  { s: 'Tested as: removal, number, rule-maker', at: [960, 905], l: 'tested as', red: true },
];
function factMap(ctx, s, vis, o = {}) {
  bg(ctx);
  NODES.forEach((n, i) => link(ctx, CTR, n.at, clamp(vis[i] * 1.4), { label: n.l, color: n.red ? 'rgba(229,72,77,0.8)' : undefined }));
  node(ctx, CTR[0], CTR[1], 'Three members, one shield?', { fill: C.yellow, color: C.slate, stroke: C.yellow, font: F.ui(36, 800), maxW: 360 });
  NODES.forEach((n, i) => {
    if (vis[i] <= 0) return;
    const hi = o.focus && o.focus.includes(i), blank = o.blanks && n.blank;
    const label = blank ? (o.revealed ? n.blank.replace(/_+/, n.ans) : n.blank) : n.s;
    node(ctx, n.at[0], n.at[1], label, { alpha: clamp(vis[i]), font: F.ui(28, 800), maxW: 420, lh: 36,
      stroke: n.red ? C.red : hi ? C.yellow : 'rgba(255,255,255,0.18)', lw: hi ? 4 : 2, color: blank && o.revealed ? C.yellow : C.white });
  });
  if (o.pointer) { const [x, y] = o.pointer; ctx.save(); ctx.strokeStyle = C.yellow; ctx.lineWidth = 4; ctx.shadowColor = C.yellow; ctx.shadowBlur = 24; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.ellipse(x, y, 260, 82, 0, 0, 7); ctx.stroke(); ctx.restore(); }
  vignette(ctx, 0.35);
}
SCENES.S17 = (ctx, s) => {
  const vis = NODES.map((_, i) => appear(s.t, 0.3 + i * 0.35));
  const marks = [['collegial', [330, 530]], ['not equally', [1590, 530]], ['forms', [420, 850]]];
  let ptr = null;
  marks.forEach(([cw, at], i) => { if (s.t >= s.w(cw) - 0.3) { const prev = i ? marks[i - 1][1] : at, k = ease(span(s.t, s.w(cw) - 0.3, s.w(cw) + 0.5)); ptr = [lerp(prev[0], at[0], k), lerp(prev[1], at[1], k)]; } });
  const focus = s.t >= s.w('forms') - 0.3 ? [4] : s.t >= s.w('not equally') - 0.3 ? [3] : s.t >= s.w('collegial') - 0.3 ? [1, 2] : [];
  factMap(ctx, s, vis, { pointer: ptr, focus });
};
SCENES.S18 = (ctx, s) => {
  const rev = s.hold ? s.t >= s.hold.at + s.hold.dur : s.p > 0.7;
  factMap(ctx, s, NODES.map(() => 1), { blanks: true, revealed: rev });
  if (!rev) text(ctx, 'pause · copy · fill the blanks', 960, 1040, { font: F.hand(46), align: 'center', color: C.yellow, alpha: appear(s.t, s.w('copy') - 0.2) });
  const nx = appear(s.t, s.w('next') - 0.3);
  if (nx > 0) { ctx.save(); ctx.globalAlpha = nx; ctx.fillStyle = 'rgba(14,16,20,0.92)'; ctx.fillRect(0, 980, W, 100); ctx.restore(); text(ctx, 'NEXT · TRAP VAULT', 960, 1045, { font: F.ui(40, 800), align: 'center', color: C.red, alpha: nx }); }
};
// ---------------- Trap Vault: T.0 checkpoint answer ----------------
SCENES.S19 = (ctx, s) => {
  desk(ctx, s.t, { book: false, lamp: 0.95 });
  const a = appear(s.t, 0.2);
  card(ctx, 220, 150, 1480, 560, { stroke: C.yellow, lw: 3, alpha: a });
  pill(ctx, 'CHECKPOINT ANSWER', 280, 200, { alpha: a, font: F.ui(28, 800), h: 50 });
  const v = appear(s.t, s.w('statute') - 0.3), r = appear(s.t, s.w('removal') - 0.3);
  text(ctx, 'How it votes: a statute (s.18, 2023 Act)', 280, 340, { font: F.head(48), color: C.yellow, alpha: v });
  text(ctx, '→ Parliament can change it by an ordinary law', 320, 410, { font: F.ui(36, 700), alpha: v });
  text(ctx, 'How members are removed: the Constitution (Art 324(5))', 280, 530, { font: F.head(48), color: C.yellow, alpha: r, maxW: 1360 });
  text(ctx, '→ needs a constitutional amendment under Art 368', 320, 600, { font: F.ui(36, 700), alpha: appear(s.t, s.w('368') - 0.4) });
  lowerThird(ctx, 'Trap Vault', appear(s.t, 0.6));
};
