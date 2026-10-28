// Scenes for the W44 Prelims Grid (weeks/2026-W44/prelims-grid), v3.
// v3 answers three reviews of v2 (content, visual clarity, benchmark): every item ends on a NOTES-READY frame:
// a labelled, undarkened visual on the left, a "write this down" table on the right with the whole look-alike set,
// and a PRELIMS TRAP bar. The frame holds still for 2 s (HOLD 2 s in the script). Text never zooms.
window.NO_PUSH = true;
const CAT = {
  N: { name: 'NATIONAL', col: C.yellow, ink: C.slate },
  I: { name: 'INTERNATIONAL', col: C.blue, ink: C.white },
  M: { name: 'MISC', col: '#E8ECF1', ink: C.slate },
};
const ORDER = ['N', 'N', 'N', 'N', 'N', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'M', 'M', 'M', 'M'];
GK = { order: ORDER, cat: CAT };
const WIN = GZ.win, NOTES = GZ.notes;
const CR = { sat: SENT_CREDIT + ' · ' + TERRAIN_CREDIT, map: TERRAIN_CREDIT };

// a map inside the visual window: frame a lon/lat box, push in slowly on the projection (labels stay crisp)
function mapWin(ctx, s, west, south, east, north, draw, o = {}) {
  gWindow(ctx, s, (g, box) => {
    const proj = zoomProj(windowCamera(box, west, south, east, north), box, 1 + 0.04 * s.p);
    terrainMap(g, proj, o.local, o);
    if (o.sat) raster(g, proj, A[o.sat], A[o.sat + '_meta'], { feather: 60 });
    if (o.rivers) rivers(g, proj, o.rivers, { color: 'rgba(120,205,255,0.98)', lw: 4 });
    draw(g, proj, box);
  }, { push: false });
}
// a chart drawn in the visual window on slate
function chartWin(ctx, s, draw) { gWindow(ctx, s, (g, box) => { g.fillStyle = '#1E2228'; g.fillRect(...box); draw(g, box); }, { push: false }); }
function item(ctx, s, k, title, sub) { glimpseBase(ctx, k); gHeader(ctx, s, k, title, sub); }
const ID = (p) => p;   // identity "projection" for labelPill on charts

// ---------------- G.0 the board ----------------
SCENES.S00 = (ctx, s) => {
  glimpseBase(ctx);
  text(ctx, 'PRELIMS GRID', 960, 150, { font: F.ui(34, 800), align: 'center', color: C.yellow });
  text(ctx, 'Week 44 · 26 Oct – 1 Nov 2026', 960, 200, { font: F.ui(28, 600), align: 'center', color: C.dim });
  const flip = s.w('sixteen') - 0.4, labels = ['Cyclone Arnab', 'IDBI sale', 'RBI · FERR', 'GRAP', 'CVC week', 'SIOFA', 'Hunger Index', 'Poland · CDRI', 'BRICS MPs', 'CBD COP17', 'Emissions Gap', 'Loss & Damage', 'Ramsar 103', 'GI tag', 'Innovation Index', 'Days'];
  ORDER.forEach((c, i) => {
    const col = i % 4, row = Math.floor(i / 4), x = 420 + col * 280, y = 250 + row * 170;
    const k = ease(span(s.t, flip + i * 0.07, flip + i * 0.07 + 0.45)), st = CAT[c];
    ctx.save(); ctx.translate(x + 125, y + 70); ctx.scale(Math.max(0.02, Math.abs(Math.cos(Math.PI * k))), 1); ctx.translate(-(x + 125), -(y + 70));
    if (k < 0.5) card(ctx, x, y, 250, 140, { fill: '#2B3139', stroke: 'rgba(255,255,255,0.12)' });
    else { card(ctx, x, y, 250, 140, { fill: '#262B33', accent: st.col, bar: 10 }); text(ctx, labels[i], x + 30, y + 82, { font: F.ui(28, 800), maxW: 200, lh: 32 }); }
    ctx.restore();
  });
  text(ctx, 'what happened  →  the static set to copy  →  the trap', 960, 970, { font: F.hand(50), align: 'center', color: C.yellow, alpha: appear(s.t, s.w('static') - 0.3) });
  text(ctx, 'Pause on any card to copy it · the full sheet is at the end and in the PDF', 960, 1030, { font: F.ui(26, 700), align: 'center', color: C.dim, alpha: appear(s.t, 2) });
};

// ---------------- National ----------------
SCENES.S01 = (ctx, s) => {    // Cyclone Arnab · map-led
  item(ctx, s, 0, 'Cyclone Arnab crosses the coast', '28 Oct · Godavari delta, AP–Yanam coast · Very Severe Cyclonic Storm');
  mapWin(ctx, s, 81.58, 16.3, 82.52, 17.1, (g, proj) => {
    // IMD (as reported): crossed about 20 km ENE of Narsapur, i.e. between Narsapur and Yanam, not at Kakinada
    arrow(g, [proj([82.6, 16.3]), proj([82.2, 16.38]), proj([81.89, 16.5])], span(s.t, 0.8, 3.0), { color: C.white, lw: 6, dash: [16, 10] });
    labelPill(g, proj, [82.18, 16.38], 'Crossed between Narsapur and Yanam', { font: F.ui(24, 800), alpha: appear(s.t, 2.4) });
    pin(g, proj, [82.247, 16.989], null, { color: C.white, r: 8 }); labelPill(g, proj, [82.247, 16.989], 'Kakinada', { off: [70, -40] });
    pin(g, proj, [82.214, 16.733], null, { r: 9 }); labelPill(g, proj, [82.214, 16.733], 'YANAM · Puducherry UT', { off: [-30, -70], fill: 'rgba(245,211,0,0.92)', color: C.slate });
    pin(g, proj, [81.70, 16.43], null, { color: C.white, r: 8 }); labelPill(g, proj, [81.70, 16.43], 'Narsapur', { off: [-40, -40] });
    labelPill(g, proj, [82.48, 16.55], 'BAY OF BENGAL', { fill: 'rgba(18,40,58,0.8)', color: '#9CC8EA', font: F.ui(24, 800) });
  }, { local: 'apcoast', sat: 'arnab_coast' });
  if (s.t < 2.8) locatorInset(ctx, 116, 252, 400, 340, [82.2, 16.8], 1 - span(s.t, 2.2, 2.8));
  gTable(ctx, s, 0, [NOTES[0], NOTES[1], NOTES[2], 420], [['IMD class', 0.66], ['km/h', 0.34]],
    [[['Cyclonic Storm', '62–88']], [['Severe Cyclonic Storm', '89–117']], [['Very Severe CS · Arnab', '118–166'], null, { hl: true }], [['Extremely Severe CS', '167–221']], [['Super Cyclonic Storm', '≥ 222']]], { size: 26, rowH: 72 });
  gNotes(ctx, s, 0, [['Naming', 'Only at ≥ 62 km/h · WMO/ESCAP Panel (13 countries)', 'name']], { box: [NOTES[0], 668, NOTES[2], 164], title: 'ALSO NOTE', size: 26 });
  gTrap(ctx, s, 'Yanam is part of Andhra Pradesh', 'Puducherry UT = Puducherry · Karaikal · Mahe · Yanam');
  finish(ctx, s, 0, CR.sat);
};
SCENES.S02 = (ctx, s) => {    // IDBI · data-led
  item(ctx, s, 1, 'IDBI Bank: 60.72% to Fairfax', '14 Oct · CCEA approves strategic sale · ≈ ₹52,878 crore · RBI approval pending');
  chartWin(ctx, s, (g, [x, y, w, h]) => {
    text(g, 'Who owns IDBI Bank: before and after the sale', x + 40, y + 60, { font: F.ui(30, 800) });
    const bars = [['Before', [['GoI', 45.48, '#E8B931'], ['LIC', 49.24, '#4A90C2'], ['', 5.28, '#5A616B']]],
                  ['Sold now', [['GoI 30.48', 30.48, '#E8B931'], ['LIC 30.24', 30.24, '#4A90C2']]],
                  ['After', [['Fairfax 60.72', 60.72, '#2BB3A3'], ['GoI + LIC ≈ 34', 34.0, '#8A939E'], ['', 5.28, '#5A616B']]]];
    const bx = x + 200, bw = w - 260;
    bars.forEach(([lab, segs], i) => {
      const yy = y + 130 + i * 140, a = appear(s.t, 0.6 + i * 0.6);
      text(g, lab, x + 40, yy + 50, { font: F.ui(28, 800), alpha: a });
      let cx = bx; segs.forEach(([l, v, col]) => {
        const ww = bw * v / 100; g.save(); g.globalAlpha = a; g.fillStyle = col; g.fillRect(cx, yy + 10, ww - 3, 64); g.restore();
        if (l) text(g, l, cx + 12, yy + 52, { font: F.ui(24, 800), color: col === '#E8B931' || col === '#2BB3A3' ? C.slate : C.white, alpha: a }); cx += ww;
      });
    });
    text(g, 'Shares in %, as reported · grey = public shareholders', x + 40, y + h - 30, { font: F.ui(24, 600), color: C.dim });
  });
  gNotes(ctx, s, 1, [['Origin', '1964, IDBI Act (RBI subsidiary) → 1976 to GoI → 2004 IDBI Bank'], ['RBI category', 'Private sector bank since Jan 2019 (LIC majority)', null, { hl: true }],
    ['Process', 'Strategic disinvestment · DIPAM (Finance) · CCEA approval'], ['Next', 'RBI "fit and proper" approval of the buyer']]);
  gTrap(ctx, s, 'IDBI is a public sector bank', 'RBI: a private sector bank since 2019');
  finish(ctx, s, 1, 'Sources: CCEA decision, 14 Oct 2026; DIPAM (as reported)');
};
SCENES.S03 = (ctx, s) => {    // RBI FERR · comparison-led
  item(ctx, s, 2, 'RBI: a 20% Foreign Exchange Risk Reserve', '10 Oct · A.P. (DIR Series) Circular 26 · follow-ups 12 Oct (No. 27) and FAQs 15 Oct');
  gTable(ctx, s, 2, WIN, [['', 0.26], ['FERA', 0.37], ['FEMA', 0.37]],
    [[['Year', '1973', '1999 · in force 1 Jun 2000']], [['Nature', 'Criminal offences', 'Civil: penalties, compounding'], null, { hl: true }],
     [['Enforced by', 'Enforcement Directorate', 'Enforcement Directorate']], [['Aim', 'Conserve scarce forex', 'Facilitate trade · orderly forex market']]], { size: 30, rowH: 128 });
  gNotes(ctx, s, 2, [['FERR', '20% reserve, in cash with the RBI, no interest', 'twenty per cent', { hl: true }], ['Applies to', 'Specified rupee FX derivative contracts above $2 mn', 'two million'],
    ['Also', 'Limit to deal without proving an underlying exposure: $100 mn → $5 mn', 'five million'], ['Why', 'Curb speculation on the rupee']]);
  gTrap(ctx, s, 'These rules are issued under FERA', 'FEMA 1999: a civil law');
  finish(ctx, s, 2, 'Source: RBI circulars of 10 and 12 Oct 2026, FAQs 15 Oct (as reported)');
};
SCENES.S04 = (ctx, s) => {    // GRAP · data-led AQI ladder
  item(ctx, s, 3, 'Delhi: GRAP Stage I invoked', '21 Oct · AQI 244 ("poor") · Delhi-NCR');
  chartWin(ctx, s, (g, [x, y, w, h]) => {
    text(g, 'The AQI scale, and where GRAP begins', x + 40, y + 60, { font: F.ui(30, 800) });
    const B = [['Good', '0–50', '#3BAA5C', ''], ['Satisfactory', '51–100', '#9BC53D', ''], ['Moderate', '101–200', '#E8D23A', ''], ['Poor', '201–300', '#E8A13A', 'Stage I'], ['Very Poor', '301–400', '#E0612F', 'Stage II'], ['Severe', '401–450', '#C0392B', 'Stage III'], ['Severe +', '> 450', '#7A1F3D', 'Stage IV']];
    const bw = (w - 80) / B.length;
    B.forEach(([n, r, col, st], i) => {
      const xx = x + 40 + i * bw, a = appear(s.t, 0.5 + i * 0.12), hh = 120 + i * 40;
      g.save(); g.globalAlpha = a; g.fillStyle = col; g.fillRect(xx + 4, y + h - 90 - hh, bw - 8, hh); g.restore();
      text(g, n, xx + bw / 2, y + h - 50, { font: F.ui(24, 800), align: 'center', alpha: a });
      text(g, r, xx + bw / 2, y + h - 20, { font: F.ui(24, 600), align: 'center', color: C.dim, alpha: a });
      if (st) text(g, st, xx + bw / 2, y + h - 100 - hh, { font: F.ui(24, 800), align: 'center', color: C.yellow, alpha: appear(s.t, s.w('four stages') - 0.3 + i * 0.1) });
    });
    const mx = x + 40 + 3 * bw + bw * 0.43, ma = appear(s.t, s.w('poor') - 0.3);
    g.save(); g.globalAlpha = ma; g.strokeStyle = C.white; g.lineWidth = 3; g.beginPath(); g.moveTo(mx, y + 120); g.lineTo(mx, y + h - 100); g.stroke(); g.restore();
    labelPill(g, ID, [mx, y + 110], 'Delhi · 244 · 21 Oct', { alpha: ma, fill: 'rgba(245,211,0,0.95)', color: C.slate });
  });
  gNotes(ctx, s, 3, [['AQI', 'Launched 2014 · CPCB · 8 pollutants: PM10, PM2.5, NO₂, SO₂, CO, O₃, NH₃, Pb'], ['GRAP', 'First notified 2017 (EPCA) → now run by CAQM', null, { hl: true }],
    ['CAQM', 'Statutory: CAQM in NCR and Adjoining Areas Act, 2021'], ['This week', 'Stage I across NCR from 21 Oct']]);
  gTrap(ctx, s, 'CPCB invokes GRAP', 'CAQM invokes it; CPCB publishes the AQI');
  finish(ctx, s, 3, 'Sources: CAQM order, 21 Oct 2026; CPCB AQI bands');
};
SCENES.S05 = (ctx, s) => {    // CVC · comparison-led
  item(ctx, s, 4, 'Vigilance Awareness Week: "Probity for Prosperity"', '26 Oct – 1 Nov · the week of Sardar Patel\'s birth anniversary');
  gTable(ctx, s, 4, WIN, [['Body', 0.2], ['Legal basis', 0.33], ['Selection / term', 0.47]],
    [[['CVC', 'CVC Act 2003 · statutory (1964 by resolution)', 'CVC + up to 2 VCs · PM, Home Minister, LoP · 4 yrs / 65'], 'santhanam', { hl: true }],
     [['Lokpal', 'Lokpal & Lokayuktas Act 2013', 'Chair + up to 8 (half judicial) · PM, Speaker, LoP, CJI, jurist']],
     [['CBI', 'DSPE Act 1946 · executive', 'Director: PM, LoP, CJI committee']],
     [['CAG', 'Constitution · Art 148', 'President · 6 yrs / 65']]], { size: 26, rowH: 132 });
  gNotes(ctx, s, 4, [['Theme 2026', 'Probity for Prosperity', 'probity', { big: true }], ['Origin', '1964 · Santhanam Committee · executive resolution', 'santhanam'], ['Statutory', 'CVC Act, 2003', '2003', { hl: true }]]);
  gTrap(ctx, s, 'The CVC is a constitutional body', 'Statutory: CVC Act 2003');
  finish(ctx, s, 4, 'Source: CVC circular, Sep 2026');
};

// ---------------- International ----------------
SCENES.S06 = (ctx, s) => {    // SIOFA · map + table
  item(ctx, s, 5, 'India to join SIOFA as a full party', 'Southern Indian Ocean Fisheries Agreement · approved mid-Oct');
  mapWin(ctx, s, 25, -50, 115, 28, (g, proj) => {
    g.save(); g.fillStyle = 'rgba(74,144,194,0.18)'; g.strokeStyle = 'rgba(156,200,234,0.9)'; g.lineWidth = 2; g.setLineDash([10, 8]);
    const pts = [[30, -10], [80, -10], [80, -45], [30, -45]].map(p => proj(p)); g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.closePath(); g.fill(); g.stroke(); g.restore();
    labelPill(g, proj, [55, -32], 'Southern Indian Ocean high seas (schematic)', { font: F.ui(24, 800) });
    pin(g, proj, [55.45, -21.1], null, { r: 8, color: C.white }); labelPill(g, proj, [55.45, -21.1], 'Réunion · SIOFA secretariat', { off: [140, -40], font: F.ui(24, 800) });
    pin(g, proj, [55.45, -4.62], null, { r: 8, color: C.white }); labelPill(g, proj, [55.45, -4.62], 'Seychelles · IOTC', { off: [-140, -30], font: F.ui(24, 800) });
  }, { local: 'indianocean', indiaFill: 'rgba(245,211,0,0.3)' });
  gTable(ctx, s, 5, NOTES, [['Body', 0.3], ['Covers', 0.38], ['Seat', 0.32]],
    [[['SIOFA', 'Non-tuna high-seas fish', 'Réunion · 2006 / 2012'], 'four years', { hl: true }], [['IOTC', 'Tuna (FAO body, 1993)', 'Seychelles']], [['CCAMLR', 'Antarctic marine life', 'Hobart']]], { size: 24, rowH: 120 });
  text(ctx, 'India: cooperating non-party since 2022 → full party', NOTES[0] + 24, NOTES[1] + 520, { font: F.ui(24, 800), color: C.blue, maxW: 580 });
  gTrap(ctx, s, 'SIOFA manages tuna', 'Tuna → Indian Ocean Tuna Commission');
  finish(ctx, s, 5, CR.map + ' · SIOFA area schematic');
};
SCENES.S07 = (ctx, s) => {    // GHI · data-led
  item(ctx, s, 6, 'Global Hunger Index 2026: India 100th of 122', 'Score 24.1 · "serious" · released 14 Oct · GoI disputes the method');
  chartWin(ctx, s, (g, [x, y, w, h]) => {
    text(g, 'Severity scale', x + 40, y + 56, { font: F.ui(26, 800) });
    const S = [[0, 10, 'Low', '#3BAA5C'], [10, 20, 'Moderate', '#E8D23A'], [20, 35, 'Serious', '#E8A13A'], [35, 50, 'Alarming', '#E0612F'], [50, 60, 'Extremely alarming', '#7A1F3D']];
    const X = v => x + 40 + (w - 80) * v / 60;
    S.forEach(([a0, a1, l, col]) => { g.fillStyle = col; g.fillRect(X(a0), y + 90, X(a1) - X(a0) - 2, 44); text(g, l, (X(a0) + X(a1)) / 2, y + 160, { font: F.ui(24, 800), align: 'center' }); });
    const ix = X(24.1); g.fillStyle = C.white; g.beginPath(); g.moveTo(ix, y + 86); g.lineTo(ix - 12, y + 66); g.lineTo(ix + 12, y + 66); g.fill();
    text(g, 'India 24.1', ix + 20, y + 74, { font: F.ui(24, 800), color: C.yellow });
    text(g, 'Four indicators and their weights', x + 40, y + 226, { font: F.ui(26, 800) });
    const I = [['Undernourishment', '1/3', '9.8%'], ['Child mortality (under-5)', '1/3', 'n/a'], ['Child stunting', '1/6', '29.3%'], ['Child wasting', '1/6', '19.0%']];
    I.forEach(([l, wt, v], i) => {
      const yy = y + 256 + i * 72, a = appear(s.t, s.w('four indicators') - 0.3 + i * 0.15), bw = wt === '1/3' ? 340 : 170;
      g.save(); g.globalAlpha = a; g.fillStyle = i ? C.blue : '#8A939E'; g.fillRect(x + 40, yy, bw, 50); g.restore();
      text(g, wt, x + 54, yy + 35, { font: F.ui(24, 800), alpha: a }); text(g, l, x + 400, yy + 35, { font: F.ui(26, 700), alpha: a });
      if (v !== 'n/a') text(g, 'India ' + v, x + w - 40, yy + 35, { font: F.ui(24, 800), align: 'right', color: C.yellow, alpha: a });
    });
    text(g, 'India values as reported for GHI 2026', x + 40, y + h - 22, { font: F.ui(24, 600), color: C.dim });
  });
  gNotes(ctx, s, 6, [['Publisher', 'Welthungerhilfe-led group of aid organisations', 'published', { hl: true }], ['Not to confuse', 'SOFI report = FAO · IFAD · UNICEF · WFP · WHO'], ['Global', 'World score 18.1 · Somalia worst'], ['India', 'Child wasting 19.0%: among the highest']]);
  gTrap(ctx, s, 'The GHI is published by the FAO or WFP', 'Welthungerhilfe-led NGOs · FAO publishes SOFI');
  finish(ctx, s, 6, 'Source: Global Hunger Index 2026 (as reported)');
};
SCENES.S08 = (ctx, s) => {    // Poland · CDRI · comparison-led
  item(ctx, s, 7, 'Poland\'s PM in India; Poland joins the CDRI', '21–23 Oct · India–Poland strategic partnership (Aug 2024)');
  gTable(ctx, s, 7, WIN, [['India-led body', 0.36], ['Launched', 0.36], ['Seat', 0.28]],
    [[['International Solar Alliance', '2015 · COP21 Paris (with France) · treaty-based', 'Gurugram']], [['CDRI', '2019 · UN Climate Action Summit, New York', 'New Delhi'], 'c-d-r-i', { hl: true, trapCol: 2 }],
     [['Global Biofuels Alliance', '2023 · G20, New Delhi', 'India-led']], [['International Big Cat Alliance', '2023 · Project Tiger at 50', 'India']]], { size: 26, rowH: 124 });
  gNotes(ctx, s, 7, [['Target', 'Double bilateral trade by 2030', 'double'], ['Announced', 'Poland will join the CDRI', 'c-d-r-i', { hl: true }], ['History', 'WWII: Polish children sheltered at Jamnagar (Nawanagar) and Valivade (Kolhapur)'], ['Partnership', 'Strategic, since Aug 2024']]);
  gTrap(ctx, s, 'The CDRI is headquartered in Gurugram', 'CDRI: New Delhi · ISA: Gurugram');
  finish(ctx, s, 7, 'Source: India–Poland joint statement, 22 Oct 2026 (as reported)');
};
SCENES.S09 = (ctx, s) => {    // BRICS · map-led
  item(ctx, s, 8, '12th BRICS Parliamentary Forum, New Delhi', '26–27 Oct · Samvidhan Sadan · Lok Sabha Speaker chairs · India chairs BRICS in 2026');
  const M = { BRA: [-52, -10], RUS: [95, 62], IND: [79, 22], CHN: [104, 35], ZAF: [24, -29], EGY: [30, 26], ETH: [40, 8], IRN: [54, 32], ARE: [54.3, 23.6], IDN: [117, -2] };
  const names = { BRA: 'Brazil', RUS: 'Russia', IND: 'India', CHN: 'China', ZAF: 'South Africa', EGY: 'Egypt', ETH: 'Ethiopia', IRN: 'Iran', ARE: 'UAE', IDN: 'Indonesia' };
  const hl = {}; Object.keys(M).forEach(m => { hl[m] = 'rgba(245,211,0,0.5)'; });
  mapWin(ctx, s, -75, -38, 140, 68, (g, proj) => {
    const sau = A.geo.countries_wide.find(c => c.a3 === 'SAU'); if (sau) geo(g, proj, sau.geom, { stroke: C.white, lw: 2.5, dash: [6, 5] });
    Object.entries(M).forEach(([a3, ll], i) => labelPill(g, proj, ll, names[a3], { font: F.ui(24, 800), alpha: appear(s.t, s.w('ten full') - 0.4 + i * 0.15) }));
    labelPill(g, proj, [45, 22], 'Saudi Arabia: not a member', { off: [-60, 110], font: F.ui(24, 800), fill: 'rgba(255,255,255,0.92)', color: C.slate, alpha: appear(s.t, s.w('saudi') - 0.3) });
  }, { world: true, highlight: hl, indiaFill: 'rgba(245,211,0,0.5)' });
  gTable(ctx, s, 8, NOTES, [['Joined', 0.3], ['Members', 0.7]],
    [[['2009', 'Brazil · Russia · India · China (BRIC)']], [['2010', 'South Africa']], [['2024', 'Egypt · Ethiopia · Iran · UAE']], [['2025', 'Indonesia'], null, { hl: true }], [['Not', 'Saudi Arabia (invited, not confirmed)'], 'saudi']], { size: 24, rowH: 92 });
  text(ctx, 'NDB HQ: Shanghai · partner countries since 2025', NOTES[0] + 24, NOTES[1] + 570, { font: F.ui(24, 800), color: C.blue });
  gTrap(ctx, s, 'Saudi Arabia is a full BRICS member', '10 members; Saudi Arabia is not one');
  finish(ctx, s, 8, CR.map);
};
SCENES.S10 = (ctx, s) => {    // CBD COP17 · map + table
  item(ctx, s, 9, 'CBD COP17 in Yerevan', '19–30 Oct · first global review of the Kunming–Montreal Framework');
  mapWin(ctx, s, 33, 33.5, 54, 44.5, (g, proj) => {
    [['ARMENIA', [45.4, 39.75]], ['GEORGIA', [43.5, 42.2]], ['AZERBAIJAN', [47.8, 40.4]], ['IRAN', [50.5, 36.0]], ['TÜRKIYE', [37.5, 39.2]], ['Black Sea', [36.5, 43.2]], ['Caspian Sea', [51.0, 41.8]]].forEach(([n, ll], i) =>
      labelPill(g, proj, ll, n, { font: F.ui(i < 5 ? 22 : 20, 800), fill: i < 5 ? 'rgba(20,23,28,0.82)' : 'rgba(18,40,58,0.8)', color: i < 5 ? C.white : '#9CC8EA' }));
    pin(g, proj, [44.51, 40.18], null, { r: 10, pulse: (s.t / 2) % 1 }); labelPill(g, proj, [44.51, 40.18], 'Yerevan', { off: [-10, 52], fill: 'rgba(245,211,0,0.92)', color: C.slate });
  }, {});
  gTable(ctx, s, 9, NOTES, [['Instrument', 0.4], ['Fact', 0.6]],
    [[['CBD', 'Rio 1992 · Montreal · USA not a party']], [['Cartagena', '2000 · biosafety (LMOs)']], [['Nagoya', '2010 · access & benefit-sharing']], [['KMGBF', '2022 · 23 targets · 30×30'], 'twenty-three', { hl: true }], [['COP11', 'Hyderabad, 2012']]], { size: 24, rowH: 100 });
  gTrap(ctx, s, '30×30 = 30% of land and sea combined', '30% of land AND 30% of sea');
  finish(ctx, s, 9, CR.map);
};
SCENES.S11 = (ctx, s) => {    // UNEP · comparison-led
  item(ctx, s, 10, 'UNEP Emissions Gap Report 2026', '21 Oct · ≈ 2.8 °C under current policies · ≈ 2.6 °C if every pledge is met');
  gTable(ctx, s, 10, WIN, [['Report', 0.52], ['Published by', 0.48]],
    [[['Emissions Gap · Adaptation Gap', 'UNEP'], 'environment programme', { hl: true }], [['Assessment Reports (AR6, 2021–23)', 'IPCC (WMO + UNEP, 1988)']], [['State of the Global Climate', 'WMO']], [['NDC Synthesis Report', 'UNFCCC Secretariat']], [['Climate Change Performance Index', 'Germanwatch · NewClimate · CAN']]], { size: 26, rowH: 104 });
  gNotes(ctx, s, 10, [['Current policies', '≈ 2.8 °C', 'two point eight', { big: true }], ['All pledges met', '≈ 2.6 °C', 'two point six', { big: true }], ['India\'s NDC (2022)', '−45% emissions intensity vs 2005 by 2030 · 50% non-fossil power capacity · net zero 2070']]);
  gTrap(ctx, s, 'The Emissions Gap Report is the IPCC\'s', 'Published by UNEP');
  finish(ctx, s, 10, 'Source: UNEP Emissions Gap Report 2026 (as reported)');
};
SCENES.S16 = (ctx, s) => {    // Loss and Damage · comparison-led
  item(ctx, s, 11, 'Loss and Damage Fund: first allocation, to Nepal', 'Board decision 22 Oct · $20 mn provisional for flood recovery');
  gTable(ctx, s, 11, WIN, [['Fund', 0.3], ['Origin', 0.38], ['Seat / host', 0.32]],
    [[['Loss & Damage (FRLD)', 'COP27 2022 → operational COP28 2023', 'World Bank-hosted · Board in the Philippines'], 'sharm', { hl: true }],
     [['Green Climate Fund', 'COP16 Cancún, 2010', 'Songdo, South Korea'], 'green climate', { trapCol: 0 }], [['GEF', '1991', 'Washington DC']], [['Adaptation Fund', 'Kyoto Protocol', 'World Bank as trustee']]], { size: 26, rowH: 124 });
  gNotes(ctx, s, 11, [['Nepal', '$20 mn (provisional) · floods of 26 Aug, Bhotekoshi–Trishuli', 'twenty million', { hl: true }], ['Scale', 'Recovery need estimated ≈ $4.7 bn (as reported)'], ['Next', 'Funds flow after Nepal\'s proposal is approved']]);
  gTrap(ctx, s, 'The GCF pays for loss and damage', 'A separate fund: FRLD');
  finish(ctx, s, 11, 'Source: FRLD Board decision, 22 Oct 2026 (as reported)');
};

// ---------------- Misc ----------------
SCENES.S12 = (ctx, s) => {    // Ramsar · map-led
  item(ctx, s, 12, 'Ramsar sites reach 103', '15 Oct · Sukhna Wetland (Chandigarh) and Sauj Jheel (Mainpuri, UP)');
  mapWin(ctx, s, 72.5, 25.5, 81.5, 32.2, (g, proj) => {
    [['Sukhna Wetland · Chandigarh', [76.818, 30.742], [120, -20], 'sukhna'], ['Sauj Jheel · Mainpuri', [79.02, 27.23], [40, -50], 'sauj'], ['Keoladeo · Montreux Record', [77.52, 27.17], [-60, 60], 'montreux']].forEach(([n, ll, off, cw], i) => {
      const a = appear(s.t, s.w(cw) - 0.3); pin(g, proj, ll, null, { r: 9, color: i < 2 ? C.teal : C.yellow, alpha: a }); labelPill(g, proj, ll, n, { off, font: F.ui(24, 800), alpha: a });
    });
  }, { local: 'northindia', states: { labels: { 'Uttar Pradesh': [80.4, 26.4], 'Haryana': [76.2, 29.3], 'Rajasthan': [74.3, 27.6], 'Punjab': [75.0, 30.4] } } });
  gNotes(ctx, s, 12, [['Convention', 'Ramsar, Iran · 2 Feb 1971 · India joined 1 Feb 1982'], ['India\'s first', 'Chilika and Keoladeo, 1981'], ['Montreux Record', 'Keoladeo (1990) · Loktak (1993) · Chilika removed 2002', 'montreux', { hl: true }], ['Largest', 'Sundarbans, West Bengal']]);
  gTrap(ctx, s, 'Chilika is on the Montreux Record', 'Removed in 2002 · Keoladeo, Loktak remain');
  finish(ctx, s, 12, CR.map);
};
SCENES.S13 = (ctx, s) => {    // GI · map-led
  item(ctx, s, 13, 'GI tag for Ambaji Mohanthal (reported)', 'Gujarat temple prasad · and the Telugu States\' own GI set');
  mapWin(ctx, s, 69, 12.2, 85.5, 25.6, (g, proj) => {
    [['Ambaji Mohanthal (reported)', [72.85, 24.33], [190, 10]], ['Tirupati Laddu · 2009', [79.42, 13.63], [-60, 40]], ['Pochampally Ikat', [78.82, 17.35], [-120, 30]], ['Araku Valley coffee', [82.87, 18.33], [-30, -50]], ['Banganapalle mango', [78.23, 15.32], [-110, 10]]].forEach(([n, ll, off], i) => {
      const a = appear(s.t, 0.6 + i * 0.4); pin(g, proj, ll, null, { r: 9, color: i ? C.teal : C.yellow, alpha: a }); labelPill(g, proj, ll, n, { off, font: F.ui(24, 800), alpha: a });
    });
  }, { local: 'westindia', states: { labels: { 'Andhra Pradesh': [79.6, 15.6], 'Telangana': [79.0, 18.2], 'Gujarat': [71.5, 22.6] } } });
  gNotes(ctx, s, 13, [['Law', 'GI of Goods Act 1999 · in force 2003'], ['Administered by', 'CGPDTM · DPIIT · Ministry of Commerce · Registry: Chennai', 'chennai'], ['International', 'WTO TRIPS, Arts 22–24'], ['Term', '10 years · renewable again and again', null, { hl: true }], ['India\'s first GI', 'Darjeeling tea', 'darjeeling']]);
  gTrap(ctx, s, 'A GI tag is a permanent, one-time grant', '10 years · renewable indefinitely');
  finish(ctx, s, 13, CR.map + ' · GI: Geographical Indications Registry');
};
SCENES.S14 = (ctx, s) => {    // GII · data-led
  item(ctx, s, 14, 'Global Innovation Index 2026: India 38th of 139', 'Top three: Switzerland · Sweden · United States');
  chartWin(ctx, s, (g, [x, y, w, h]) => {
    text(g, 'India\'s GII rank, 2015–2026 (lower is better)', x + 40, y + 56, { font: F.ui(28, 800) });
    const D = [[2015, 81], [2016, 66], [2017, 60], [2018, 57], [2019, 52], [2020, 48], [2021, 46], [2022, 40], [2023, 40], [2024, 39], [2025, 38], [2026, 38]];
    const X = yr => x + 80 + (w - 160) * (yr - 2015) / 11, Y = r => y + 110 + (h - 200) * (r - 30) / 55;
    g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 1; [40, 60, 80].forEach(r => { g.beginPath(); g.moveTo(x + 60, Y(r)); g.lineTo(x + w - 40, Y(r)); g.stroke(); text(g, String(r), x + 50, Y(r) + 8, { font: F.ui(24, 600), align: 'right', color: C.dim }); });
    const p = span(s.t, 0.6, 3.5); g.strokeStyle = C.yellow; g.lineWidth = 5; g.beginPath();
    D.forEach(([yr, r], i) => { if (i / (D.length - 1) <= p) { i ? g.lineTo(X(yr), Y(r)) : g.moveTo(X(yr), Y(r)); } }); g.stroke();
    D.forEach(([yr, r], i) => { if (i / (D.length - 1) > p) return; g.fillStyle = C.yellow; g.beginPath(); g.arc(X(yr), Y(r), 7, 0, 7); g.fill(); if ([0, 4, 7, 11].includes(i)) text(g, String(r), X(yr), Y(r) - 16, { font: F.ui(24, 800), align: 'center' }); text(g, '’' + String(yr).slice(2), X(yr), y + h - 40, { font: F.ui(24, 600), align: 'center', color: C.dim }); });
  });
  gNotes(ctx, s, 14, [['Publisher', 'WIPO (Geneva), with Portulans Institute', 'intellectual', { hl: true }], ['India', '38th · 1st among lower-middle-income economies', 'lower-middle'], ['Look-alikes', 'World Investment Report: UNCTAD · Gender Gap: WEF · HDI: UNDP · B-READY: World Bank']]);
  gTrap(ctx, s, 'The GII is published by the WEF', 'Published by WIPO');
  finish(ctx, s, 14, 'Source: WIPO, Global Innovation Index (editions 2015–2026)');
};
SCENES.S15 = (ctx, s) => {    // Days · calendar
  item(ctx, s, 15, 'Three days to note', '27 · 30 · 31 October');
  chartWin(ctx, s, (g, [x, y, w, h]) => {
    [['27', 'Infantry Day', 'infantry'], ['30', 'World Savings Day (India)', 'savings'], ['31', 'Rashtriya Ekta Diwas', 'ekta']].forEach(([d, t, cw], i) => {
      const a = appear(s.t, s.w(cw) - 0.3), xx = x + 40 + i * 340, yy = y + 90;
      g.save(); g.globalAlpha = a; rr(g, xx, yy, 300, 380, 16); g.fillStyle = '#262B33'; g.fill(); rr(g, xx, yy, 300, 64, 16); g.fillStyle = '#3A414B'; g.fill(); g.restore();
      text(g, 'OCTOBER', xx + 150, yy + 44, { font: F.ui(24, 800), align: 'center', color: C.yellow, alpha: a });
      text(g, d, xx + 150, yy + 230, { font: F.head(140), align: 'center', alpha: a });
      text(g, t, xx + 150, yy + 320, { font: F.ui(26, 800), align: 'center', alpha: a, maxW: 270, lh: 32 });
    });
  });
  gNotes(ctx, s, 15, [['27 Oct', '1947: 1 Sikh air-landed at Srinagar', 'infantry'], ['30 Oct', 'Savings Day: origin Milan 1924 (31 Oct) · India uses 30 Oct since 1984', 'savings', { hl: true }], ['31 Oct', 'Patel\'s birth anniversary (since 2014) · Statue of Unity, 182 m, Ekta Nagar, on the Narmada', 'ekta']]);
  gTrap(ctx, s, 'India marks Savings Day on 31 Oct', 'India: 30 Oct (most countries: 31)');
  finish(ctx, s, 15);
};

// ---------------- Revision Sheet ----------------
const SHEET = [
  ['01', 'Cyclone Arnab', 'VSCS 118–166 km/h · named at ≥ 62 km/h · Yanam is in Puducherry UT'],
  ['02', 'IDBI Bank', '60.72% (GoI 30.48 + LIC 30.24) to Fairfax · private sector bank since 2019'],
  ['03', 'RBI FERR', '20% cash reserve with RBI on rupee FX derivatives > $2 mn · FEMA 1999 (civil)'],
  ['04', 'GRAP', 'Stage I = AQI 201–300 · CAQM (2021 Act) invokes · CPCB publishes AQI'],
  ['05', 'CVC', 'Statutory (CVC Act 2003) · 1964 Santhanam · CVC + 2 VCs · 4 yrs / 65'],
  ['06', 'SIOFA', 'Non-tuna high-seas fish · secretariat Réunion · tuna = IOTC (Seychelles)'],
  ['07', 'Hunger Index', 'India 100/122, 24.1 serious · Welthungerhilfe-led · SOFI = FAO & UN partners'],
  ['08', 'CDRI', 'India-led 2019, New Delhi · ISA 2015, Gurugram · Poland announced it will join'],
  ['09', 'BRICS', '10 members · Indonesia 2025 · Saudi Arabia not a member · NDB Shanghai'],
  ['10', 'CBD COP17', 'Yerevan · KMGBF 2022: 23 targets, 30% land AND 30% sea · COP11 Hyderabad 2012'],
  ['11', 'Emissions Gap', 'UNEP · 2.8 °C current policies, 2.6 °C all pledges · IPCC = assessment reports'],
  ['12', 'Loss & Damage', 'First allocation Nepal $20 mn · COP27 → COP28 · ≠ GCF (Songdo)'],
  ['13', 'Ramsar', '103 sites · India joined 1982 · Montreux: Keoladeo, Loktak (Chilika out 2002)'],
  ['14', 'GI tag', 'Act 1999 · Registry Chennai · 10 years, renewable · first: Darjeeling tea'],
  ['15', 'Innovation Index', 'WIPO · India 38th of 139 · 1st among lower-middle-income'],
  ['16', 'Days', '27 Infantry · 30 Savings (India) · 31 Ekta Diwas (Statue of Unity, 182 m)'],
];
function sheet(ctx, s, part) {
  glimpseBase(ctx, part * 8);
  text(ctx, `REVISION SHEET · PRELIMS GRID W44 · ${part + 1}/2`, 96, 110, { font: F.ui(30, 800), color: C.yellow });
  text(ctx, 'Pause and copy · this is page 1 of the PDF', 96, 156, { font: F.ui(26, 600), color: C.dim });
  SHEET.slice(part * 8, part * 8 + 8).forEach(([n, it, fact], i) => {
    const y = 200 + i * 100, c = CAT[ORDER[part * 8 + i]], a = appear(s.t, 0.2 + i * 0.12, 0.35);
    ctx.save(); ctx.globalAlpha = a; rr(ctx, 96, y, 1728, 88, 10); ctx.fillStyle = tint(c.col, i % 2 ? 0.10 : 0.16); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = a; rr(ctx, 110, y + 18, 60, 52, 10); ctx.fillStyle = c.col; ctx.fill(); ctx.restore();
    text(ctx, n, 140, y + 56, { font: F.ui(28, 800), color: c.ink, align: 'center', alpha: a });
    text(ctx, it, 200, y + 56, { font: F.ui(30, 800), color: c.col === '#E8ECF1' ? C.white : c.col, alpha: a });
    text(ctx, fact, 560, y + 56, { font: F.ui(28, 600), color: '#E3E7EC', alpha: a });
  });
}
SCENES.S17 = (ctx, s) => sheet(ctx, s, 0);
SCENES.S18 = (ctx, s) => sheet(ctx, s, 1);
