// Scenes for the W44 Prelims Grid (weeks/2026-W44/prelims-grid), v5: the exam format (exam-kit.js).
// Sixteen topics; topic n's slides are S{n}01, S{n}02… in the master script. One colour per slide, purple first.
window.NO_PUSH = true; window.EX_LOGO = true;
EX.series = 'PRELIMS GRID'; EX.total = 16;
const WORLD = [-75, -38, 140, 68];
const mcq = (qs, ok, o = {}) => [{ type: 'mcq', qs, ok, ...o }, { type: 'answer', qs, ok, ...o }];

// ---------- Topic 1: Cyclone Arnab ----------
function formation(ctx, s, b, c) {         // a cross-section that builds on the narration
  const [x, y, w, h] = b, sea = y + h - 170, cx = x + w / 2;
  const sa = eia(s, s.w('warm') - 0.3), sg = ctx.createLinearGradient(0, sea, 0, y + h); sg.addColorStop(0, '#5BB8F0'); sg.addColorStop(1, '#1E6FD9');
  ctx.save(); rr(ctx, x, sea, w, y + h - sea, 22); ctx.clip(); ctx.globalAlpha *= sa; ctx.fillStyle = sg; ctx.fillRect(x, sea, w, y + h - sea);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); for (let i = 0; i <= 60; i++) ctx.lineTo(x + i * w / 60, sea + 22 + k * 34 + 7 * Math.sin(i * 0.6 + s.t * 2 + k)); ctx.stroke(); } ctx.restore();
  exChip(ctx, 'Warm sea ≥ 26.5–27 °C', x + 30, y + h - 74, '#FFFFFF', c.ink, 26, sa);
  const ra = span(s.t, s.w('rises') - 0.4, s.w('rises') + 1.6);
  [-260, -130, 130, 260].forEach(dx => arrow(ctx, [[cx + dx, sea - 10], [cx + dx * 0.75, sea - 180], [cx + dx * 0.5, y + 250]], ra, { color: c.main, lw: 7 }));
  const ca = eia(s, s.w('condenses') - 0.2);
  ctx.save(); ctx.globalAlpha *= ca; ctx.fillStyle = c.t[2];
  [[-300, 200, 120], [-170, 150, 140], [170, 150, 140], [300, 200, 120], [-60, 170, 100], [60, 170, 100]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.ellipse(cx + dx, y + dy, r, r * 0.62, 0, 0, 7); ctx.fill(); });
  ctx.restore();
  exChip(ctx, 'Condensation releases latent heat', cx - 230, y + 40, c.main, '#FFFFFF', 26, ca);
  const la = eia(s, s.w('pressure') - 0.2);
  ctx.save(); ctx.globalAlpha *= la; ctx.beginPath(); ctx.arc(cx, sea - 90, 64, 0, 7); ctx.fillStyle = c.ink; ctx.fill(); ctx.restore();
  text(ctx, 'L', cx, sea - 66, { font: F.head(72), color: '#FFFFFF', align: 'center', alpha: la });
  exChip(ctx, 'Low pressure at the centre', cx + 80, sea - 130, '#FFFFFF', c.ink, 24, la);
  const sp = span(s.t, s.w('spirals') - 0.3, s.w('spirals') + 1.2);
  arrow(ctx, [[x + 40, sea - 40], [cx - 200, sea - 70], [cx - 80, sea - 90]], sp, { color: c.ink, lw: 6 });
  arrow(ctx, [[x + w - 40, sea - 40], [cx + 200, sea - 70], [cx + 80, sea - 90]], sp, { color: c.ink, lw: 6 });
}
const puduMap = col => ({ map: { bounds: [73.5, 8.2, 85.5, 18.6], focus: { Puducherry: col }, pins: [['Puducherry', [79.83, 11.93], [130, -40], 'puducherry', { bg: '#FFD60A' }], ['Karaikal', [79.84, 10.92], [130, 40], 'karaikal', { bg: '#FFD60A' }], ['Mahe', [75.53, 11.70], [-90, -60], 'mahe', { bg: '#FFD60A' }], ['Yanam', [82.214, 16.733], [-60, -80], 'yanam', { bg: '#FFD60A' }]] } });
exTopic({ n: 1, cat: 'NATIONAL', title: 'Cyclone Arnab', short: 'Cyclone Arnab', tags: ['GS-1 · Geography', 'GS-3 · Disaster Management', 'APPSC Group-1'],
  locator: { focus: { 'Andhra Pradesh': '#7C3AED' }, pins: [['Arnab', [82.0, 16.6], [-120, -60]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'orange', headline: 'Cyclone Arnab crossed the Andhra Pradesh–Yanam coast in the Godavari delta',
      facts: [['DATE', '28 October 2026', 'twenty-eighth'], ['STRENGTH', 'Very Severe Cyclonic Storm', 'very'], ['WHERE', 'Between Narsapur and Yanam (IMD, as reported)', 'godavari']],
      side: { map: { bounds: [80.4, 15.4, 84.6, 18.3], focus: { 'Andhra Pradesh': '#FF8A33' }, rivers: ['Godavari', 'Krishna'], arrow: [[84.7, 14.6], [83.2, 15.7], [81.89, 16.5]],
        labels: [['BAY OF BENGAL', [83.6, 16.4], 32, '#FFFFFF'], ['ANDHRA PRADESH', [81.2, 17.35], 30]],
        pins: [['Crossed here (approx.)', [81.89, 16.5], [140, 110], 4.0, { bg: '#F97316', fg: '#FFFFFF' }], ['YANAM', [82.214, 16.733], [-150, -70], 'yanam', { bg: '#FFD60A' }], ['Kakinada', [82.247, 16.989], [130, -60], 2.0], ['Narsapur', [81.70, 16.43], [-150, 60], 2.2]] } } },
    { type: 'panel', step: 'FORMATION', head: 'HOW A CYCLONE FORMS', side: { draw: formation },
      notes: [['WARM SEA', '≥ 26.5–27 °C, over a wide area', 'warm'], ['CORIOLIS FORCE', 'None at the Equator, so no cyclones within ~5°', 'coriolis'], ['WEAK WIND SHEAR', 'The storm column stays upright', 'shear'], ['A LOW TO START FROM', 'A pre-existing low-pressure area', 'low-pressure'], ['ROTATION', 'Anticlockwise in the northern hemisphere', 'anticlockwise']] },
    { type: 'steps', col: 'blue', step: 'NAMING', head: 'HOW CYCLONES ARE NAMED',
      items: [['13 countries', 'WMO/ESCAP Panel on Tropical Cyclones', 'thirteen'], ['169 names', '13 each · list adopted April 2020', 'hundred'], ['RSMC New Delhi (IMD)', 'gives the next name at ≥ 62 km/h (Cyclonic Storm)', 'next'], ['Used once', 'a name is never repeated', 'never']],
      side: { title: 'The 13 member countries', chips: { cols: 2, cue: 'thirteen', items: ['Bangladesh', 'India', 'Iran', 'Maldives', 'Myanmar', 'Oman', 'Pakistan', 'Qatar', 'Saudi Arabia', 'Sri Lanka', 'Thailand', 'UAE', 'Yemen'], hl: ['Bangladesh', 'bangladesh'], callout: ['ARNAB ← Bangladesh', 'bangladesh'] } } },
    { type: 'panel', step: 'FACTS', head: 'STATIC FACTS · the IMD ladder (km/h)',
      side: { ladder: { cue: 'grades', hl: 4, rows: [['Depression', '31–49'], ['Deep Depression', '50–61'], ['Cyclonic Storm', '62–88'], ['Severe CS', '89–117'], ['Very Severe CS', '118–166', ['← ARNAB', 'like']], ['Extremely Severe CS', '167–221'], ['Super Cyclonic Storm', '≥ 222']], line: [2, 'A NAME IS GIVEN FROM HERE UP', 'starts'] } } },
    { type: 'trap', myth: 'Yanam is part of Andhra Pradesh', truth: 'Yanam belongs to the Union Territory of Puducherry', cue: 'belongs',
      extra: [['Puducherry UT = Puducherry · Karaikal · Mahe · Yanam', 'karaikal']], side: puduMap('#E63946') },
    ...mcq(['A tropical cyclone in the north Indian Ocean is named only after it reaches cyclonic-storm strength.', 'Yanam is a part of the State of Andhra Pradesh.', 'A Very Severe Cyclonic Storm has sustained winds of 118–166 km/h.'], [true, false, true],
      { reason: 'Answer (b): 1 and 3 · Yanam belongs to Puducherry UT' }),
    { type: 'notes', lines: ['Arnab: VSCS · crossed the AP–Yanam coast (Godavari delta) · 28 Oct 2026', 'Forms over warm sea (≥ 26.5–27 °C) · needs Coriolis force (none at the Equator) · weak wind shear · a low',
      'Names: 13 countries × 13 = 169 (2020) · RSMC New Delhi names at ≥ 62 km/h · never repeated', 'IMD km/h: CS 62–88 · SCS 89–117 · VSCS 118–166 · ESCS 167–221 · SuCS ≥ 222', 'Puducherry UT = Puducherry · Karaikal · Mahe · Yanam'] },
  ] });

// ---------- Topic 2: IDBI Bank ----------
exTopic({ n: 2, cat: 'NATIONAL', title: 'The IDBI Bank sale', short: 'IDBI Bank sale', tags: ['GS-3 · Economy: banking', 'Disinvestment', 'RBI Grade B'],
  locator: { pins: [['Mumbai HQ', [72.88, 19.08], [90, -60]]] },
  slides: [
    { type: 'title' },
    { type: 'news', headline: 'Cabinet clears the sale of 60.72% of IDBI Bank to a Fairfax company',
      facts: [['DATE', '14 October 2026 · CCEA', 'fourteenth'], ['STAKE SOLD', '60.72% (GoI 30.48 + LIC 30.24)', 'sixty'], ['PRICE', '≈ ₹52,878 crore · RBI approval pending', 'fifty-two']],
      side: { title: 'Who owns IDBI Bank (%)', bars: [['Before', [['GoI 45.48', 45.48, 2], ['LIC 49.24', 49.24, 1], ['', 5.28, 'g']], 1.0], ['Sold', [['GoI 30.48', 30.48, 2], ['LIC 30.24', 30.24, 1]], 'sixty'], ['After', [['Fairfax 60.72', 60.72, 3], ['GoI + LIC ≈ 34', 34, 0], ['', 5.28, 'g']], 'fairfax']], note: 'As reported · grey = public shareholders' } },
    { type: 'steps', step: 'FACTS', head: 'HOW A STRATEGIC SALE WORKS',
      items: [['DIPAM runs the sale', 'Department of Investment and Public Asset Management · Ministry of Finance', 'department'], ['CCEA approves', 'Cabinet Committee on Economic Affairs · chaired by the PM', 'approves'], ['RBI clears the buyer', '"Fit and proper" test for anyone taking control of a bank', 'fit']],
      side: { title: 'IDBI\'s journey', table: { size: 26, cols: [['Year', 0.28], ['Status', 0.72]], rows: [[['1964', 'IDBI Act · an RBI subsidiary']], [['1976', 'Transferred to the Government']], [['2004', 'Becomes IDBI Bank']], [['2019', 'RBI: private sector bank (LIC majority)'], null, { hl: true }]] } } },
    { type: 'trap', myth: 'IDBI Bank is a public sector bank', truth: 'The RBI has classed it as a private sector bank since 2019', cue: 'not',
      extra: [['After LIC took majority control (January 2019)', 'majority']] },
    ...mcq(['IDBI Bank is classified by the RBI as a private sector bank.', 'Strategic disinvestment decisions are approved by the Cabinet Committee on Economic Affairs.', 'DIPAM functions under the Ministry of Commerce and Industry.'], [true, true, false],
      { reason: 'Answer (b): 1 and 2 · DIPAM is in the Ministry of Finance' }),
    { type: 'notes', lines: ['IDBI: CCEA (14 Oct) cleared the sale of 60.72% (GoI 30.48 + LIC 30.24) to a Fairfax unit · ≈ ₹52,878 crore', 'Process: DIPAM (Finance) runs → CCEA approves → RBI "fit and proper"', 'RBI category: private sector bank since Jan 2019 (LIC majority)', 'History: 1964 IDBI Act (RBI subsidiary) → 1976 GoI → 2004 IDBI Bank'] },
  ] });

// ---------- Topic 3: RBI FERR ----------
exTopic({ n: 3, cat: 'NATIONAL', title: 'RBI\'s new forex reserve (FERR)', short: 'RBI forex reserve', tags: ['GS-3 · Economy: external sector', 'RBI Grade B'],
  locator: { pins: [['RBI, Mumbai', [72.88, 19.08], [100, -60]]] },
  slides: [
    { type: 'title' },
    { type: 'news', headline: 'RBI makes banks keep a 20% Foreign Exchange Risk Reserve', hz: 48,
      facts: [['DATE', '10 Oct 2026 · A.P. (DIR Series) Circular 26', 'tenth'], ['RESERVE', '20% · in cash with the RBI · no interest', 'twenty'], ['APPLIES TO', 'Specified rupee FX derivatives above $2 mn', 'two million']],
      side: { title: 'Three numbers to remember', bigs: [['FERR', '20%', 'twenty'], ['ON CONTRACTS ABOVE', '$2 mn', 'two million'], ['NO-PROOF DEALING LIMIT', '$100 mn → $5 mn', 'five']] } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'FERA vs FEMA',
      table: { size: 30, rowH: 150, cols: [['', 0.22], ['FERA', 0.36], ['FEMA', 0.42]], rows: [[['Year', '1973', '1999 · in force 1 June 2000'], '1973'], [['Nature', 'Criminal offences', 'Civil: penalties, compounding'], 'criminal', { hl: true }], [['Aim', 'Conserve scarce forex', 'Facilitate trade · orderly forex market'], 'conserve'], [['Enforced by', 'Enforcement Directorate', 'Enforcement Directorate'], 'enforcement']] } },
    { type: 'trap', myth: 'These rules are issued under FERA', truth: 'They come under FEMA 1999, a civil law', cue: 'not', extra: [['FERA was repealed · forex violations are no longer criminal', 'repealed']] },
    ...mcq(['FEMA, 1999 replaced FERA, 1973, and made forex violations civil offences.', 'FEMA is enforced by the Enforcement Directorate.', 'The new Foreign Exchange Risk Reserve is held in cash with the RBI and earns no interest.'], [true, true, true],
      { reason: 'Answer (c): all three are correct' }),
    { type: 'notes', lines: ['FERR (10 Oct): 20% reserve, in cash with the RBI, no interest · rupee FX derivatives > $2 mn', 'No-proof dealing limit cut: $100 mn → $5 mn (curbs rupee speculation)', 'FERA 1973: criminal · FEMA 1999 (in force 1 Jun 2000): civil · both enforced by the ED'] },
  ] });

// ---------- Topic 4: GRAP ----------
exTopic({ n: 4, cat: 'NATIONAL', title: 'Delhi\'s air: GRAP Stage I', short: 'GRAP Stage I', tags: ['GS-3 · Environment: pollution', 'Statutory bodies'],
  locator: { focus: { Delhi: '#7C3AED', Haryana: '#BB9BFF', 'Uttar Pradesh': '#D6C2FF' }, pins: [['Delhi-NCR', [77.2, 28.6], [-40, -70]]] },
  slides: [
    { type: 'title' },
    { type: 'news', headline: 'Delhi\'s air turns poor and GRAP Stage I is invoked across the NCR',
      facts: [['DATE', '21 October 2026', 'twenty-first'], ['AQI', '244 · poor', 'forty-four'], ['ACTION', 'GRAP Stage I across Delhi-NCR', 'stage']],
      side: { title: 'Delhi, 21 October', bigs: [['DELHI AQI', '244', 'forty-four'], ['BAND', 'Poor (201–300)', 'poor'], ['ACTION', 'GRAP Stage I', 'stage']] } },
    { type: 'panel', step: 'FACTS', head: 'AQI BANDS AND GRAP STAGES',
      side: { title: 'AQI band → GRAP stage', ladder: { cue: 'bands', hl: 3, rows: [['Good', '0–50'], ['Satisfactory', '51–100'], ['Moderate', '101–200'], ['Poor', '201–300', ['STAGE I', 'stage one']], ['Very Poor', '301–400', ['STAGE II', 'stage two']], ['Severe', '401–450', ['STAGE III', 'stage three']], ['Severe+', '> 450', ['STAGE IV', 'stage four']]] } },
      notes: [['AQI', 'Launched 2014 by the CPCB · 8 pollutants', 'index'], ['GRAP', 'First notified 2017 · now run by the CAQM', 'plan'], ['DELHI ON 21 OCT', '244: Poor → Stage I', 'poor']] },
    { type: 'trap', myth: 'The CPCB invokes GRAP', truth: 'The CAQM invokes GRAP; the CPCB publishes the AQI', cue: 'commission',
      extra: [['CAQM: statutory · Commission for Air Quality Management in NCR and Adjoining Areas Act, 2021', 'statutory'], ['AQI pollutants: PM10, PM2.5, NO₂, SO₂, CO, O₃, NH₃, Pb', 'publishes']] },
    ...mcq(['GRAP Stage I is invoked when the AQI is in the "poor" band (201–300).', 'The Central Pollution Control Board invokes GRAP.', 'India\'s AQI measures only PM2.5 and PM10.'], [true, false, false],
      { reason: 'Answer (a): only 1 · CAQM invokes GRAP · AQI tracks 8 pollutants' }),
    { type: 'notes', lines: ['Delhi AQI 244 (poor) on 21 Oct → GRAP Stage I across the NCR', 'AQI: Good 0–50 · Satisfactory 51–100 · Moderate 101–200 · Poor 201–300 · Very Poor 301–400 · Severe 401+', 'GRAP: I poor · II very poor · III severe · IV severe+ (> 450) · invoked by the CAQM (2021 Act)', 'AQI (2014, CPCB): 8 pollutants'] },
  ] });

// ---------- Topic 5: CVC ----------
exTopic({ n: 5, cat: 'NATIONAL', title: 'Vigilance Awareness Week', short: 'Vigilance Week · CVC', tags: ['GS-2 · Polity: statutory bodies', 'GS-4 · Probity'],
  locator: { pins: [['New Delhi', [77.2, 28.6], [-40, -70]]] },
  slides: [
    { type: 'title' },
    { type: 'news', headline: 'The CVC marks Vigilance Awareness Week: "Probity for Prosperity"',
      facts: [['WEEK', '26 October – 1 November', 'twenty-sixth'], ['THEME', 'Probity for Prosperity', 'probity'], ['WHY THIS WEEK', 'Sardar Patel\'s birth anniversary, 31 Oct', 'patel\'s']],
      side: { title: 'Vigilance Awareness Week 2026', bigs: [['THEME', 'Probity for Prosperity', 'probity'], ['ORGANISED BY', 'Central Vigilance Commission', 'commission']] } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'FOUR BODIES UPSC MIXES UP',
      table: { size: 27, rowH: 170, cols: [['Body', 0.14], ['Legal basis', 0.42], ['Selection / term', 0.44]], rows: [
        [['CVC', 'Statutory · CVC Act 2003 (1964 resolution, Santhanam Committee)', 'CVC + up to 2 VCs · PM, Home Minister, LoP · 4 yrs or 65'], 'santhanam', { hl: true }],
        [['Lokpal', 'Lokpal and Lokayuktas Act 2013', 'Chair + up to 8 members (half judicial)'], 'lokpal'],
        [['CBI', 'Executive · DSPE Act 1946', 'Director: PM, LoP, CJI committee'], 'c-b-i'],
        [['CAG', 'Constitutional · Article 148', 'President · 6 yrs or 65'], 'c-a-g']] } },
    { type: 'trap', myth: 'The CVC is a constitutional body', truth: 'Statutory: Central Vigilance Commission Act, 2003', cue: 'not' },
    ...mcq(['The CVC was set up in 1964 on the recommendation of the Santhanam Committee.', 'The CVC was given statutory status in 2003.', 'The Central Vigilance Commissioner is appointed by the President.'], [true, true, true],
      { reason: 'Answer (c): all three are correct' }),
    { type: 'notes', lines: ['Vigilance Awareness Week: 26 Oct–1 Nov · theme "Probity for Prosperity"', 'CVC: 1964 (Santhanam, resolution) → statutory 2003 · CVC + up to 2 VCs · 4 yrs or 65', 'Selection: PM, Home Minister, LoP · appointed by the President', 'Look-alikes: Lokpal 2013 Act · CBI executive (DSPE 1946) · CAG constitutional (Art 148)'] },
  ] });

// ---------- Topic 6: SIOFA ----------
const IO = { bounds: [25, -50, 115, 28], plainIndia: true, indiaFill: '#7C3AED', region: [[[[30, -10], [80, -10], [80, -45], [30, -45]], 'high seas']],
  labels: [['Southern Indian Ocean high seas (schematic)', [55, -38], 26]] };
exTopic({ n: 6, cat: 'INTERNATIONAL', title: 'India joins SIOFA', short: 'India and SIOFA', tags: ['GS-2 · International agreements', 'GS-3 · Fisheries'],
  locator: { bounds: [25, -50, 115, 30], pins: [['SIOFA area', [55, -30], [0, -80]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'blue', headline: 'India to join the Southern Indian Ocean Fisheries Agreement as a full party',
      facts: [['WHEN', 'Approved mid-October 2026', 'mid-october'], ['NOW', 'Full party to SIOFA', 'full'], ['BEFORE', 'Cooperating non-party since 2022', 'cooperating']],
      side: { map: { ...IO, pins: [['Réunion · SIOFA', [55.45, -21.1], [150, -30], 1.5], ['Seychelles · IOTC', [55.45, -4.62], [-150, -30], 2.0]] } } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'THREE OCEAN BODIES',
      table: { size: 28, rowH: 170, cols: [['Body', 0.2], ['Covers', 0.42], ['Seat · status', 0.38]], rows: [
        [['SIOFA', 'Non-tuna fish on the high seas', 'Réunion · signed 2006, in force 2012'], 'siofa', { hl: true }],
        [['IOTC', 'Tuna · an FAO body (1993)', 'Seychelles · India is a member'], 'tuna'],
        [['CCAMLR', 'Antarctic marine living resources', 'Hobart, Australia'], 'ccamlr']] },
      side: { map: { ...IO, pins: [['Réunion', [55.45, -21.1], [120, -30], 'réunion'], ['Seychelles', [55.45, -4.62], [-120, -30], 'seychelles']] } } },
    { type: 'trap', myth: 'SIOFA manages tuna in the Indian Ocean', truth: 'Tuna → Indian Ocean Tuna Commission (IOTC)', cue: 'not', extra: [['India is already a member of the IOTC', 'member']] },
    ...mcq(['SIOFA manages tuna stocks in the Indian Ocean.', 'The Indian Ocean Tuna Commission is based in the Seychelles.', 'SIOFA applies to the high seas, beyond national jurisdiction.'], [false, true, true],
      { reason: 'Answer (b): 2 and 3 · tuna is the IOTC\'s job' }),
    { type: 'notes', lines: ['India to become a full party to SIOFA (cooperating non-party since 2022)', 'SIOFA: non-tuna, high seas · secretariat Réunion · signed 2006, in force 2012', 'IOTC: tuna · FAO body, Seychelles (India a member) · CCAMLR: Antarctic, Hobart'] },
  ] });

// ---------- Topic 7: GHI ----------
exTopic({ n: 7, cat: 'INTERNATIONAL', title: 'Global Hunger Index 2026', short: 'Global Hunger Index', tags: ['GS-2 · Social issues: hunger', 'Reports & indices'],
  locator: { pins: [['India 100 / 122', [79, 22], [0, -90]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'blue', headline: 'GHI 2026 ranks India 100th of 122, in the "serious" category',
      facts: [['RANK', '100 of 122', 'hundredth'], ['SCORE', '24.1 · serious', 'serious'], ['GOVERNMENT', 'Disputes the method', 'disputes']],
      side: { title: 'India in GHI 2026', bigs: [['RANK', '100 / 122', 'hundredth'], ['SCORE', '24.1 · serious', 'twenty-four']] } },
    { type: 'panel', step: 'FACTS', head: 'HOW THE INDEX IS BUILT',
      side: { title: 'Severity scale and the four indicators (India values as reported)', scale: { max: 60, bands: [[0, 10, 'Low'], [10, 20, 'Moderate'], [20, 35, 'Serious'], [35, 50, 'Alarming'], [50, 60, 'Ext. alarming']], mark: [24.1, 'India 24.1', 'serious'],
        rows: [['Undernourishment', '1/3', 'India 9.8%', 'undernourishment'], ['Child mortality (under-5)', '1/3', '', 'mortality'], ['Child stunting', '1/6', 'India 29.3%', 'stunting'], ['Child wasting', '1/6', 'India 19.0%', 'wasting']] } } },
    { type: 'trap', myth: 'The GHI is published by the FAO or the WFP', truth: 'Published by aid organisations led by Welthungerhilfe', cue: 'not', extra: [['SOFI report = FAO · IFAD · UNICEF · WFP · WHO', 'sofi']] },
    ...mcq(['The Global Hunger Index is published by the FAO.', 'Undernourishment carries one-third of the GHI weight.', 'India was placed in the "alarming" category in GHI 2026.'], [false, true, false],
      { reason: 'Answer (a): only 2 · Welthungerhilfe-led · India is "serious"' }),
    { type: 'notes', lines: ['GHI 2026: India 100 of 122 · score 24.1 · "serious" (GoI disputes the method)', 'Weights: undernourishment 1/3 · child mortality 1/3 · stunting 1/6 · wasting 1/6', 'Publisher: aid organisations led by Welthungerhilfe · SOFI = FAO, IFAD, UNICEF, WFP, WHO'] },
  ] });

// ---------- Topic 8: Poland · CDRI ----------
exTopic({ n: 8, cat: 'INTERNATIONAL', title: 'Poland and the CDRI', short: 'Poland and the CDRI', tags: ['GS-2 · Bilateral relations', 'India-led groupings'],
  locator: { bounds: [-10, 5, 100, 60], highlight: { POL: '#7C3AED' }, pins: [['Poland', [19.4, 52.1], [0, -70]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'blue', headline: 'Poland\'s Prime Minister in India; Poland to join the CDRI',
      facts: [['VISIT', '21–23 October 2026', 'twenty-first'], ['GOAL', 'Double bilateral trade by 2030', 'double'], ['ANNOUNCED', 'Poland will join the CDRI', 'announced']],
      side: { title: 'India and Poland', bigs: [['PARTNERSHIP', 'Strategic, since Aug 2024', 1.5], ['WWII LINK', 'Polish children at Jamnagar & Kolhapur', 2.5]] } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'INDIA-LED ALLIANCES',
      table: { size: 27, rowH: 160, cols: [['Body', 0.3], ['Launched', 0.44], ['Seat', 0.26]], rows: [
        [['International Solar Alliance', '2015 · COP21 Paris, with France · treaty-based', 'Gurugram'], 'solar'],
        [['CDRI', '2019 · UN Climate Action Summit, New York', 'New Delhi'], '2019', { hl: true }],
        [['Global Biofuels Alliance', '2023 · G20, New Delhi', 'India-led'], 'biofuels'],
        [['International Big Cat Alliance', '2023 · Project Tiger at 50', 'India'], 'cat']] } },
    { type: 'trap', myth: 'The CDRI is headquartered in Gurugram', truth: 'CDRI: New Delhi · ISA: Gurugram', cue: 'secretariat' },
    ...mcq(['The International Solar Alliance has its secretariat in Gurugram.', 'The CDRI was launched at COP21 in Paris.', 'The Global Biofuels Alliance was launched during India\'s G20 presidency.'], [true, false, true],
      { ask: 'Which of the statements given above are correct?', opts: ['(a) 1 only', '(b) 1 and 3 only', '(c) 2 and 3 only', '(d) 1, 2 and 3'], key: 1, reason: 'Answer (b): CDRI was launched in New York, 2019' }),
    { type: 'notes', lines: ['Poland PM in India, 21–23 Oct · trade to double by 2030 · Poland announced it will join the CDRI', 'ISA: 2015, COP21 Paris (with France), Gurugram · CDRI: 2019, UN Climate Action Summit (NY), New Delhi', 'GBA: 2023, G20 New Delhi · IBCA: 2023 (Project Tiger at 50)', 'India–Poland strategic partnership: Aug 2024'] },
  ] });

// ---------- Topic 9: BRICS ----------
const BR = { BRA: [-52, -10], RUS: [95, 62], IND: [79, 22], CHN: [104, 35], ZAF: [24, -29], EGY: [30, 26], ETH: [40, 8], IRN: [54, 32], ARE: [54.3, 23.6], IDN: [117, -2] };
const BRN = { BRA: 'Brazil', RUS: 'Russia', IND: 'India', CHN: 'China', ZAF: 'South Africa', EGY: 'Egypt', ETH: 'Ethiopia', IRN: 'Iran', ARE: 'UAE', IDN: 'Indonesia' };
const brHL = Object.fromEntries(Object.keys(BR).map(k => [k, '#BB9BFF']));
exTopic({ n: 9, cat: 'INTERNATIONAL', title: 'BRICS Parliamentary Forum', short: 'BRICS Forum', tags: ['GS-2 · Groupings', 'India\'s chairship 2026'],
  locator: { bounds: WORLD, highlight: brHL, indiaFill: '#7C3AED', plainIndia: true },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'blue', headline: '12th BRICS Parliamentary Forum meets in New Delhi',
      facts: [['WHERE', 'Samvidhan Sadan, New Delhi', 'samvidhan'], ['WHEN', '26–27 October 2026', 'twenty-sixth'], ['CHAIR', 'Lok Sabha Speaker · India chairs BRICS 2026', 'chaired']],
      side: { map: { bounds: WORLD, highlight: brHL, plainIndia: true, indiaFill: '#2563EB', pins: [['New Delhi', [77.2, 28.6], [-60, -70], 'samvidhan', { bg: '#FFD60A' }]] } } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'TEN FULL MEMBERS',
      table: { size: 27, rowH: 140, cols: [['Joined', 0.22], ['Members', 0.78]], rows: [[['2009', 'Brazil · Russia · India · China (BRIC)'], 'brazil'], [['2010', 'South Africa'], 'south'], [['2024', 'Egypt · Ethiopia · Iran · UAE'], 'egypt'], [['2025', 'Indonesia'], 'indonesia', { hl: true }], [['Bank', 'New Development Bank · Shanghai'], 'shanghai']] },
      side: { map: { bounds: WORLD, highlight: brHL, plainIndia: true, indiaFill: '#9333EA', dashed: [['SAU', 'shanghai']], draw: (g, proj, s) => Object.entries(BR).forEach(([a3, ll]) => labelPill(g, proj, ll, BRN[a3], { font: F.ui(24, 800), alpha: eia(s, 0.6) })) } } },
    { type: 'trap', myth: 'Saudi Arabia is a full BRICS member', truth: '10 full members; Saudi Arabia is not one', cue: 'not', extra: [['Invited in 2023 · has not confirmed', 'invited']] },
    ...mcq(['Indonesia became a full member of BRICS in 2025.', 'Saudi Arabia is a full member of BRICS.', 'The New Development Bank is headquartered in Shanghai.'], [true, false, true],
      { ask: 'Which of the statements given above are correct?', opts: ['(a) 1 only', '(b) 1 and 3 only', '(c) 2 and 3 only', '(d) 1, 2 and 3'], key: 1, reason: 'Answer (b): Saudi Arabia has not confirmed' }),
    { type: 'notes', lines: ['12th BRICS Parliamentary Forum: Samvidhan Sadan, New Delhi, 26–27 Oct · Lok Sabha Speaker chairs', '10 members: BRIC 2009 · South Africa 2010 · Egypt, Ethiopia, Iran, UAE 2024 · Indonesia 2025', 'Saudi Arabia: invited, not confirmed · NDB HQ: Shanghai'] },
  ] });

// ---------- Topic 10: CBD COP17 ----------
const CAU = { bounds: [33, 33.5, 54, 44.5], plainIndia: true, highlight: { ARM: '#7C3AED' },
  labels: [['GEORGIA', [43.5, 42.2], 26], ['AZERBAIJAN', [47.8, 40.6], 26], ['IRAN', [50.5, 36.0], 26], ['TÜRKIYE', [37.5, 39.2], 26], ['Black Sea', [36.5, 43.2], 26, '#FFFFFF'], ['Caspian Sea', [51.0, 41.8], 26, '#FFFFFF']],
  pins: [['Yerevan, ARMENIA', [44.51, 40.18], [0, 80], 'yerevan', { bg: '#FFD60A' }]] };
exTopic({ n: 10, cat: 'INTERNATIONAL', title: 'CBD COP17 in Yerevan', short: 'CBD COP17, Yerevan', tags: ['GS-3 · Environment: biodiversity', 'Conventions'],
  locator: { bounds: [20, 5, 100, 50], highlight: { ARM: '#7C3AED' }, pins: [['Yerevan', [44.51, 40.18], [0, -70]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'blue', headline: 'Biodiversity COP17 in Yerevan reviews the Kunming–Montreal Framework',
      facts: [['WHERE', 'Yerevan, Armenia', 'yerevan'], ['WHEN', '19–30 October 2026', 'nineteenth'], ['WHY IT MATTERS', 'First global review of the KMGBF', 'review']], side: { map: CAU } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'THE CBD FAMILY',
      table: { size: 28, rowH: 135, cols: [['Instrument', 0.32], ['Key facts', 0.68]], rows: [
        [['CBD', 'Rio Earth Summit 1992 · secretariat Montreal · USA not a party'], 'rio'], [['Cartagena Protocol', '2000 · biosafety (living modified organisms)'], 'cartagena'],
        [['Nagoya Protocol', '2010 · access and benefit-sharing'], 'nagoya'], [['KMGBF', '2022 · 23 targets · 30×30'], 'twenty-three', { hl: true }], [['COP11', 'Hyderabad, India, 2012'], 'hyderabad']] } },
    { type: 'trap', myth: '30×30 means 30% of land and sea combined', truth: '30% of land AND 30% of sea, each, by 2030', cue: 'each' },
    ...mcq(['The 30×30 target protects 30% of land and sea taken together.', 'CBD COP17 is being held in Baku.', 'The United States is a party to the CBD.'], [false, false, false],
      { reason: 'Answer (d): none · separate targets · Yerevan · USA not a party' }),
    { type: 'notes', lines: ['CBD COP17: Yerevan, Armenia, 19–30 Oct · first global review of the KMGBF', 'CBD: Rio 1992 · Montreal · USA not a party · COP11 Hyderabad 2012', 'Cartagena 2000 (biosafety) · Nagoya 2010 (ABS) · KMGBF 2022: 23 targets', '30×30: 30% of land AND 30% of sea by 2030'] },
  ] });

// ---------- Topic 11: Emissions Gap ----------
exTopic({ n: 11, cat: 'INTERNATIONAL', title: 'UNEP Emissions Gap Report', short: 'Emissions Gap Report', tags: ['GS-3 · Climate change', 'Reports & publishers'],
  locator: { bounds: WORLD, pins: [['UNEP, Nairobi', [36.82, -1.29], [0, -80]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'blue', headline: 'UNEP: the world is heading for about 2.8 °C under current policies',
      facts: [['DATE', '21 October 2026', 'twenty-first'], ['CURRENT POLICIES', '≈ 2.8 °C', 'eight'], ['ALL PLEDGES MET', '≈ 2.6 °C', 'six']],
      side: { title: 'Projected warming (as reported)', bigs: [['CURRENT POLICIES', '≈ 2.8 °C', 'eight'], ['ALL PLEDGES MET', '≈ 2.6 °C', 'six'], ['PARIS GOAL', 'Well below 2 °C · aim 1.5 °C', 'pledge']] } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'REPORT → PUBLISHER',
      table: { size: 28, rowH: 135, cols: [['Report', 0.55], ['Published by', 0.45]], rows: [
        [['Emissions Gap · Adaptation Gap', 'UNEP'], 'emissions', { hl: true }], [['Assessment Reports (AR6, 2021–23)', 'IPCC (set up by WMO + UNEP, 1988)'], 'assessment'],
        [['State of the Global Climate', 'WMO'], 'state'], [['NDC Synthesis Report', 'UNFCCC Secretariat'], 'synthesis'], [['Climate Change Performance Index', 'Germanwatch · NewClimate · CAN']]] } },
    { type: 'trap', myth: 'The Emissions Gap Report is the IPCC\'s', truth: 'Published by UNEP', cue: 'not',
      extra: [['India NDC (2022): −45% emissions intensity vs 2005, by 2030', 'forty-five'], ['50% non-fossil power capacity by 2030 · net zero by 2070', 'net']] },
    ...mcq(['The Emissions Gap Report is published by the IPCC.', 'India has announced a net-zero target of 2070.', 'Under current policies, warming is projected at about 1.5 °C.'], [false, true, false],
      { reason: 'Answer (a): only 2 · UNEP publishes it · ≈ 2.8 °C' }),
    { type: 'notes', lines: ['UNEP Emissions Gap 2026 (21 Oct): ≈ 2.8 °C (current policies) · ≈ 2.6 °C (all pledges)', 'UNEP: Emissions/Adaptation Gap · IPCC: ARs · WMO: State of Global Climate · UNFCCC: NDC synthesis', 'India NDC: −45% intensity (vs 2005) · 50% non-fossil capacity by 2030 · net zero 2070'] },
  ] });

// ---------- Topic 12: Loss and Damage ----------
exTopic({ n: 12, cat: 'INTERNATIONAL', title: 'Loss and Damage Fund: first allocation', short: 'Loss and Damage Fund', tags: ['GS-3 · Climate finance', 'GS-2 · Neighbourhood'],
  locator: { highlight: { NPL: '#7C3AED' }, pins: [['Nepal', [84.1, 28.4], [0, -80]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'blue', headline: 'The Loss and Damage Fund makes its first allocation, to Nepal',
      facts: [['DATE', 'Board decision, 22 October', 'twenty-second'], ['AMOUNT', '$20 mn (provisional)', 'twenty million'], ['FOR', 'Recovery from the August floods', 'floods']],
      side: { map: { bounds: [79, 25.5, 89.8, 31.5], highlight: { NPL: '#2563EB' }, plainIndia: true, labels: [['NEPAL', [84.1, 28.6], 34, '#FFFFFF'], ['INDIA', [82, 26.4], 30]], pins: [['Kathmandu', [85.32, 27.71], [90, 70], 'nepal\'s']] } } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'FOUR CLIMATE FUNDS',
      table: { size: 27, rowH: 160, cols: [['Fund', 0.28], ['Origin', 0.36], ['Seat / host', 0.36]], rows: [
        [['Loss & Damage (FRLD)', 'COP27 2022 → operational COP28 2023', 'World Bank-hosted · Board in the Philippines'], 'cop27', { hl: true }],
        [['Green Climate Fund', 'COP16 Cancún, 2010', 'Songdo, South Korea'], 'green'], [['GEF', '1991', 'Washington DC'], 'global'], [['Adaptation Fund', 'Kyoto Protocol', 'World Bank as trustee'], 'adaptation']] } },
    { type: 'trap', myth: 'The GCF pays for loss and damage', truth: 'A separate fund: the FRLD', cue: 'own' },
    ...mcq(['The Loss and Damage Fund was agreed at COP27.', 'The Green Climate Fund is headquartered in Songdo, South Korea.', 'The Loss and Damage Fund\'s first allocation went to Bangladesh.'], [true, true, false],
      { reason: 'Answer (b): 1 and 2 · the first allocation went to Nepal' }),
    { type: 'notes', lines: ['FRLD Board (22 Oct): first allocation, Nepal · $20 mn provisional · August floods', 'FRLD: agreed COP27 (2022) · operational COP28 (2023) · World Bank-hosted · Board in the Philippines', 'GCF: Cancún 2010, Songdo · GEF: 1991, Washington · Adaptation Fund: Kyoto'] },
  ] });

// ---------- Topic 13: Ramsar ----------
exTopic({ n: 13, cat: 'MISC', title: 'Ramsar sites reach 103', short: 'Ramsar sites: 103', tags: ['GS-3 · Environment: wetlands', 'Places in news'],
  locator: { pins: [['Sukhna', [76.82, 30.74], [-90, -40]], ['Sauj Jheel', [79.02, 27.23], [90, 40]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'India\'s Ramsar sites rise to 103 with two new wetlands',
      facts: [['DATE', '15 October 2026', 'fifteenth'], ['TOTAL', '103 Ramsar sites', 'hundred'], ['NEW', 'Sukhna (Chandigarh) · Sauj Jheel (Mainpuri, UP)', 'sukhna']],
      side: { map: { bounds: [72.5, 25.5, 81.5, 32.2], focus: { Chandigarh: '#0F9D8F', 'Uttar Pradesh': '#99EBDA' }, labels: [['UTTAR PRADESH', [80.6, 26.4], 28], ['RAJASTHAN', [74.3, 27.6], 28], ['HARYANA', [76.2, 29.3], 26]],
        pins: [['Sukhna Wetland · Chandigarh', [76.818, 30.742], [120, -30], 'sukhna', { bg: '#FFD60A' }], ['Sauj Jheel · Mainpuri', [79.02, 27.23], [60, -70], 'sauj', { bg: '#FFD60A' }]] } } },
    { type: 'steps', step: 'FACTS', head: 'FOUR RAMSAR FACTS',
      items: [['Ramsar Convention', 'Signed at Ramsar, Iran, 2 Feb 1971 · India joined 1982', 'convention'], ['India\'s first sites', 'Chilika and Keoladeo, 1981', 'chilika'], ['Montreux Record', 'Sites under threat · India: Keoladeo (1990), Loktak (1993)', 'montreux'], ['Largest Indian site', 'Sundarbans, West Bengal', 'sundarbans']] },
    { type: 'trap', myth: 'Chilika is on the Montreux Record', truth: 'Removed in 2002 · only Keoladeo and Loktak remain', cue: 'no' },
    ...mcq(['Chilika Lake is on the Montreux Record.', 'The Ramsar Convention was signed in Iran in 1971.', 'India\'s first Ramsar sites were the Sundarbans and Loktak.'], [false, true, false],
      { reason: 'Answer (a): only 2 · Chilika left in 2002 · first: Chilika, Keoladeo' }),
    { type: 'notes', lines: ['Ramsar sites: 103 (15 Oct) · new: Sukhna (Chandigarh), Sauj Jheel (Mainpuri, UP)', 'Convention: Ramsar, Iran, 1971 · India joined 1982 · first sites Chilika, Keoladeo (1981)', 'Montreux Record: Keoladeo, Loktak (Chilika removed 2002) · largest: Sundarbans'] },
  ] });

// ---------- Topic 14: GI tag ----------
exTopic({ n: 14, cat: 'MISC', title: 'A new GI tag (reported)', short: 'GI tag · Mohanthal', tags: ['GS-1 · Art & Culture', 'GS-3 · IPR'],
  locator: { focus: { Gujarat: '#7C3AED' }, pins: [['Ambaji', [72.85, 24.33], [-60, -70]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'Ambaji\'s Mohanthal reportedly gets a GI tag',
      facts: [['WHAT', 'Ambaji Mohanthal · temple prasad', 'mohanthal'], ['WHERE', 'Ambaji, Gujarat', 'gujarat'], ['STATUS', 'Reported · to be confirmed in the GI Journal', 'reportedly']],
      side: { map: { bounds: [69, 12.2, 85.5, 25.6], focus: { Gujarat: '#0F9D8F', 'Andhra Pradesh': '#5FD9C2', Telangana: '#99EBDA' },
        pins: [['Ambaji Mohanthal', [72.85, 24.33], [190, 10], 'mohanthal', { bg: '#FFD60A' }], ['Tirupati Laddu', [79.42, 13.63], [-60, 50], 2.5], ['Pochampally Ikat', [78.82, 17.35], [-120, 30], 2.7], ['Araku Valley coffee', [82.87, 18.33], [-30, -60], 2.9], ['Banganapalle mango', [78.23, 15.32], [-150, 10], 3.1]] } } },
    { type: 'steps', step: 'FACTS', head: 'THE GI LAW',
      items: [['The law', 'GI of Goods (Registration and Protection) Act 1999 · in force 2003 · WTO TRIPS Arts 22–24', '1999'], ['Who registers', 'GI Registry, Chennai · CGPDTM · DPIIT, Ministry of Commerce', 'chennai'], ['How long', '10 years · renewable again and again', 'ten'], ['India\'s first GI', 'Darjeeling tea', 'darjeeling']] },
    { type: 'trap', myth: 'A GI tag is a permanent, one-time grant', truth: '10 years · renewable again and again', cue: 'not' },
    ...mcq(['A GI registration is valid for ten years and can be renewed.', 'The GI Registry is located in Chennai.', 'The GI Act is administered by the Ministry of Culture.'], [true, true, false],
      { reason: 'Answer (b): 1 and 2 · the GI law sits with Commerce' }),
    { type: 'notes', lines: ['Ambaji Mohanthal (Gujarat): GI tag reported · confirm in the GI Journal', 'GI Act 1999 (in force 2003) · Registry Chennai · DPIIT, Commerce · TRIPS Arts 22–24', '10 years, renewable · first GI: Darjeeling tea', 'Telugu GIs: Tirupati Laddu · Pochampally Ikat · Araku coffee · Banganapalle mango'] },
  ] });

// ---------- Topic 15: GII ----------
exTopic({ n: 15, cat: 'MISC', title: 'Global Innovation Index 2026', short: 'Global Innovation Index', tags: ['GS-3 · Economy: innovation', 'Reports & publishers'],
  locator: { bounds: WORLD, pins: [['WIPO, Geneva', [6.14, 46.2], [0, -80]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'GII 2026: India ranks 38th of 139',
      facts: [['RANK', '38 of 139', 'thirty-eighth'], ['GROUP', '1st among lower-middle-income', 'lower-middle-income'], ['TOP THREE', 'Switzerland · Sweden · USA', 'switzerland']],
      side: { title: 'India\'s GII rank, 2015–2026 (lower is better)', line: { cue: 'thirty-eighth', show: [0, 4, 7, 11], points: [[2015, 81], [2016, 66], [2017, 60], [2018, 57], [2019, 52], [2020, 48], [2021, 46], [2022, 40], [2023, 40], [2024, 39], [2025, 38], [2026, 38]] } } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'INDEX → PUBLISHER',
      table: { size: 30, rowH: 150, cols: [['Report', 0.55], ['Published by', 0.45]], rows: [
        [['Global Innovation Index', 'WIPO (Geneva), with Portulans Institute'], 'w-i-p-o', { hl: true }], [['World Investment Report', 'UNCTAD'], 'u-n-c-t-a-d'],
        [['Global Gender Gap Report', 'World Economic Forum'], 'gender'], [['Human Development Report', 'UNDP'], 'human']] } },
    { type: 'trap', myth: 'The GII is published by the WEF', truth: 'Published by WIPO', cue: 'not' },
    ...mcq(['Global Innovation Index : WIPO', 'World Investment Report : UNCTAD', 'Human Development Report : UNDP'], [true, true, true],
      { stem: 'Consider the following pairs (report : publisher):', ask: 'How many of the above pairs are correctly matched?', reason: 'Answer (c): all three pairs are correct' }),
    { type: 'notes', lines: ['GII 2026: India 38 of 139 · 1st among lower-middle-income · top: Switzerland, Sweden, USA', 'Published by WIPO (Geneva), with Portulans Institute', 'Look-alikes: WIR UNCTAD · Gender Gap WEF · HDR UNDP'] },
  ] });

// ---------- Topic 16: Days ----------
exTopic({ n: 16, cat: 'MISC', title: 'Three days to note', short: 'Days to note', tags: ['GS-1 · Modern History', 'Days & events'],
  locator: { focus: { Gujarat: '#7C3AED' }, pins: [['Statue of Unity', [73.72, 21.84], [-60, -70]], ['Srinagar', [74.8, 34.08], [90, 40]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'Three days fall this week: 27, 30 and 31 October',
      facts: [['27 OCT', 'Infantry Day', 'infantry'], ['30 OCT', 'World Savings Day (India)', 'savings'], ['31 OCT', 'Rashtriya Ekta Diwas', 'ekta']],
      side: { tiles: [['27', 'OCTOBER', 'Infantry Day', 'infantry'], ['30', 'OCTOBER', 'World Savings Day (India)', 'savings'], ['31', 'OCTOBER', 'Rashtriya Ekta Diwas', 'ekta']] } },
    { type: 'steps', step: 'FACTS', head: 'THE STATIC FACTS BEHIND THEM',
      items: [['Infantry Day · 27 Oct', '1947: troops of 1 Sikh air-landed at Srinagar', 'srinagar'], ['World Savings Day · 30 Oct (India)', 'Began in Milan, 1924 (31 Oct elsewhere) · India marks it a day early', 'milan'], ['Rashtriya Ekta Diwas · 31 Oct', 'Since 2014 · Sardar Patel\'s birth anniversary · Statue of Unity, 182 m, Ekta Nagar, on the Narmada', '2014']] },
    { type: 'trap', myth: 'India marks World Savings Day on 31 October', truth: 'India: 30 October · most countries: 31 October', cue: 'not' },
    ...mcq(['India observes World Savings Day on 31 October.', 'Rashtriya Ekta Diwas marks Sardar Patel\'s birth anniversary.', 'The Statue of Unity stands on the banks of the Godavari.'], [false, true, false],
      { reason: 'Answer (a): only 2 · India: 30 Oct · the statue is on the Narmada' }),
    { type: 'notes', lines: ['27 Oct Infantry Day: 1947, 1 Sikh air-landed at Srinagar', '30 Oct World Savings Day (India; elsewhere 31 Oct) · origin Milan 1924', '31 Oct Rashtriya Ekta Diwas (since 2014) · Statue of Unity 182 m, Ekta Nagar, Narmada'] },
  ] });

// ---------- the intro: the channel emblem (exIntro in exam-kit.js) ----------
SCENES.S00 = (ctx, s) => exIntro(ctx, s, 'PRELIMS GRID · WEEK 44 · 26 OCT – 1 NOV 2026', 'One week · 16 topics · the static facts, the traps and a practice question for each');

// ---------- G.0 the board, and the revision sheet ----------
const BOARD = [['Cyclone Arnab', 'N'], ['IDBI sale', 'N'], ['RBI forex reserve', 'N'], ['GRAP Stage I', 'N'], ['Vigilance Week', 'N'], ['SIOFA', 'I'], ['Hunger Index', 'I'], ['Poland · CDRI', 'I'],
  ['BRICS Forum', 'I'], ['CBD COP17', 'I'], ['Emissions Gap', 'I'], ['Loss & Damage', 'I'], ['Ramsar 103', 'M'], ['GI tag', 'M'], ['Innovation Index', 'M'], ['Days to note', 'M']];
const BCOL = { N: '#F97316', I: '#3B82F6', M: '#14B8A6' };
SCENES.S0 = (ctx, s) => {
  const c = EP.purple; exSlide(ctx, c);
  text(ctx, 'PRELIMS GRID · WEEK 44', 960, 130, { font: F.ui(36, 800), align: 'center', color: '#FFFFFF', alpha: eia(s, 0.1) });
  text(ctx, 'Why in news → static facts → trap → practice question', 960, 190, { font: F.ui(30, 700), align: 'center', color: c.t[2], alpha: eia(s, s.w('static') - 0.3) });
  const flip = s.w('sixteen') - 0.3;
  BOARD.forEach(([t, k], i) => {
    const x = 210 + (i % 4) * 380, y = 250 + Math.floor(i / 4) * 180, a = eia(s, flip + i * 0.08);
    exBox(ctx, x, y, 350, 150, { alpha: a, bar: BCOL[k] });
    text(ctx, String(i + 1).padStart(2, '0'), x + 40, y + 62, { font: F.head(40), color: c.main, alpha: a });
    text(ctx, t, x + 40, y + 115, { font: F.ui(30, 800), color: c.ink, alpha: a, maxW: 290 });
  });
  [['NATIONAL', 'N'], ['INTERNATIONAL', 'I'], ['MISC', 'M']].forEach(([l, k], i) => exChip(ctx, l, 640 + i * 230, 990, BCOL[k], '#FFFFFF', 24, eia(s, 1.5)));
};
const SHEET = [['01', 'Cyclone Arnab', 'VSCS 118–166 km/h · named at ≥ 62 km/h (169 names, 2020) · Yanam is in Puducherry UT'], ['02', 'IDBI Bank', '60.72% to Fairfax · DIPAM → CCEA → RBI · private sector bank since 2019'],
  ['03', 'RBI FERR', '20% cash reserve, no interest · FX derivatives > $2 mn · FEMA 1999 (civil)'], ['04', 'GRAP', 'Stage I = poor (201–300) · CAQM (2021 Act) invokes · CPCB publishes AQI'],
  ['05', 'CVC', 'Statutory (2003) · 1964 Santhanam · CAG is the constitutional one (Art 148)'], ['06', 'SIOFA', 'Non-tuna high seas · Réunion · tuna = IOTC (Seychelles)'],
  ['07', 'Hunger Index', 'India 100/122, 24.1 serious · weights 1/3, 1/3, 1/6, 1/6 · Welthungerhilfe-led'], ['08', 'CDRI', '2019 NY, New Delhi · ISA 2015 Paris, Gurugram · Poland to join'],
  ['09', 'BRICS', '10 members · Indonesia 2025 · Saudi not a member · NDB Shanghai'], ['10', 'CBD COP17', 'Yerevan · KMGBF 2022: 23 targets, 30% land AND 30% sea · COP11 Hyderabad'],
  ['11', 'Emissions Gap', 'UNEP · 2.8 °C current policies · India net zero 2070'], ['12', 'Loss & Damage', 'Nepal $20 mn first · COP27 → COP28 · ≠ GCF (Songdo)'],
  ['13', 'Ramsar', '103 sites · Montreux: Keoladeo, Loktak (Chilika out 2002)'], ['14', 'GI tag', 'Act 1999 · Chennai · 10 years, renewable · first: Darjeeling tea'],
  ['15', 'Innovation Index', 'WIPO · India 38/139 · 1st among lower-middle-income'], ['16', 'Days', '27 Infantry · 30 Savings (India) · 31 Ekta Diwas (Statue of Unity, 182 m)']];
function sheet(ctx, s, part) {
  const c = EP.purple; exSlide(ctx, c);
  exChip(ctx, `REVISION SHEET · PRELIMS GRID W44 · ${part + 1}/2`, 72, 40, '#FFFFFF', c.ink, 28);
  text(ctx, 'Pause and copy · this is page 1 of the PDF', 1848, 80, { font: F.ui(28, 700), color: c.t[1], align: 'right' });
  exBox(ctx, 72, 130, 1776, 900);
  SHEET.slice(part * 8, part * 8 + 8).forEach(([n, it, fact], i) => {
    const y = 150 + i * 108, a = eia(s, 0.2 + i * 0.1), k = BOARD[part * 8 + i][1];
    ctx.save(); ctx.globalAlpha *= a; rr(ctx, 96, y, 1728, 96, 12); ctx.fillStyle = c.t[i % 2]; ctx.fill(); ctx.fillStyle = BCOL[k]; ctx.fillRect(96, y, 10, 96); ctx.restore();
    text(ctx, n, 136, y + 60, { font: F.head(34), color: c.main, alpha: a });
    text(ctx, it, 210, y + 60, { font: F.ui(30, 800), color: c.ink, alpha: a });
    text(ctx, fact, 520, y + 60, { font: F.ui(28, 600), color: c.ink, alpha: a, maxW: 1280 });
  });
}
SCENES.S98 = (ctx, s) => sheet(ctx, s, 0);
SCENES.S99 = (ctx, s) => sheet(ctx, s, 1);
