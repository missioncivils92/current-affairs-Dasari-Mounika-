// Scenes for the W44 AP–TG Desk (weeks/2026-W44/aptg-desk), v5: the animated exam format (exam-kit.js), seven
// Telugu States topics; topic n's slides are S{n}01, S{n}02… in the master script. One colour per slide, purple first;
// why-in-news slides are teal (Local: Telugu States).
window.NO_PUSH = true; window.EX_LOGO = true;
EX.series = 'AP–TG DESK'; EX.total = 7;
const mcq = (qs, ok, o = {}) => [{ type: 'mcq', qs, ok, ...o }, { type: 'answer', qs, ok, ...o }];
const CODES = { ask: 'Which of the statements given above are correct?' };
const TG = { 'Andhra Pradesh': '#5FD9C2', Telangana: '#99EBDA' };
const line = (g, proj, pts, o = {}) => { g.save(); g.globalAlpha *= o.alpha ?? 1; g.strokeStyle = o.color || '#1E88E5'; g.lineWidth = o.lw || 6; g.lineCap = g.lineJoin = 'round'; if (o.dash) g.setLineDash(o.dash);
  g.beginPath(); pts.map(p => proj(p)).forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.stroke(); g.restore(); };

// ---------- 1 · AP BC quota ----------
const CHAIN = { title: 'The judgment chain', table: { size: 24, rowH: 120, cols: [['Year', 0.22], ['Case / order', 0.78]], rows: [
  [['1992', 'Indra Sawhney · 50% ceiling'], 'sawhney'], [['2010', 'K. Krishna Murthy · local-body quota needs inquiry'], 'krishna'],
  [['2021', 'Vikas Kishanrao Gawali · the triple test'], 'gawali', { hl: true }], [['Oct 2026', 'AP HC sets aside 34% · SC dismisses appeal']]] } };
exTopic({ n: 1, cat: 'LOCAL', title: 'AP\'s BC quota in local bodies', short: 'AP BC quota', tags: ['GS-2 · Local government', 'APPSC Group-1', 'TGPSC Group-1'],
  locator: { focus: { 'Andhra Pradesh': '#7C3AED' }, bounds: [72, 8, 90, 24], pins: [['Andhra Pradesh', [79.7, 15.6], [-60, -90]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'AP HC sets aside the 34% BC quota in rural local bodies; SC dismisses the appeal', hz: 44,
      facts: [['AP HIGH COURT', '1 Oct 2026 · 34% BC quota orders set aside', 'first'], ['SUPREME COURT', '9 Oct · State\'s appeal dismissed', 'ninth'], ['NEXT', 'AP Cabinet adopted the dedicated commission\'s report', 'cabinet']],
      side: { title: 'Primary document: AP High Court order, 1 Oct 2026', bigs: [['BC QUOTA STRUCK', '34% (rural local bodies)', 'thirty-four'], ['CEILING', 'Total ≤ 50%', 'ninth']] } },
    { type: 'steps', step: 'FACTS', head: 'THE TRIPLE TEST (GAWALI, 2021)',
      items: [['A dedicated commission', 'Studies backwardness in local bodies', 'commission'], ['Body-wise proportion', 'The quota is fixed body by body, on that data', 'body'], ['A 50% ceiling', 'Total SC + ST + OBC reservation ≤ 50%', 'fifty']], side: CHAIN },
    { type: 'trap', myth: 'Article 243D makes a BC quota in panchayats mandatory', truth: 'Enabling only: Art 243D(6) · Art 243T(6) for municipalities', cue: 'enables',
      extra: [['The quota must still pass the triple test · total ≤ 50%', 'triple']] },
    ...mcq(['Article 243D(6) obliges States to reserve seats for Backward Classes in panchayats.', 'The triple test requires a dedicated commission to study backwardness.', 'Under the triple test, total reservation in local bodies may not exceed 50%.'], [false, true, true],
      { reason: 'Answer (b): 2 and 3 · Art 243D(6) only enables a quota' }),
    { type: 'notes', lines: ['AP HC (1 Oct) set aside the 34% BC quota in rural local bodies · SC dismissed the appeal (9 Oct)', 'Triple test (Gawali 2021): dedicated commission · body-wise share · total ≤ 50%', 'Art 243D(6) panchayats · 243T(6) municipalities: enabling, not mandatory', 'Chain: Indra Sawhney 1992 (50%) → K. Krishna Murthy 2010 → Gawali 2021'] },
  ] });

// ---------- 2 · Telangana HC ----------
exTopic({ n: 2, cat: 'LOCAL', title: 'Telangana HC: acting Chief Justice', short: 'Telangana HC', tags: ['GS-2 · Judiciary', 'TGPSC Group-1', 'TS Group-2'],
  locator: { focus: { Telangana: '#7C3AED' }, bounds: [72, 8, 90, 24], pins: [['Hyderabad', [78.47, 17.38], [-80, -80]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'Justice P. Sam Koshy is the acting Chief Justice of the Telangana High Court',
      facts: [['WHO', 'Justice P. Sam Koshy', 'koshy'], ['ROLE', 'Acting Chief Justice, Telangana HC', 'acting'], ['WHY', 'The Chief Justice was elevated to the Supreme Court', 'elevated']],
      side: { title: 'Primary document: Ministry of Law notification, Oct 2026', bigs: [['APPOINTED BY', 'The President · Art 223', 'acting'], ['TELANGANA HC', 'Its own High Court since 1 Jan 2019', 'elevated']] } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'HIGH COURT ARTICLES: THE SET',
      table: { size: 28, rowH: 120, cols: [['Article', 0.18], ['What it covers', 0.82]], rows: [
        [['214', 'A High Court for each State'], 'two-fourteen'], [['217', 'Appointment of High Court judges (President, after consulting the CJI and the Governor)'], 'two-seventeen'],
        [['223', 'Acting Chief Justice: appointed by the President'], 'two-twenty-three', { hl: true }], [['224', 'Additional and acting judges'], 'two-twenty-four'],
        [['224A', 'Retired judges may be asked to sit'], 'retired'], [['231', 'One High Court for two or more States'], 'two-thirty-one']] } },
    { type: 'trap', myth: 'The CJI appoints the acting Chief Justice of a High Court', truth: 'The President · Article 223', cue: 'not',
      extra: [['Telangana got its own High Court on 1 January 2019 (shared with AP until then)', 'president']] },
    ...mcq(['The acting Chief Justice of a High Court is appointed by the President.', 'Article 231 allows one High Court for two or more States.', 'Article 224A deals with the appointment of the Chief Justice of India.'], [true, true, false],
      { ...CODES, opts: ['(a) 1 only', '(b) 1 and 2 only', '(c) 2 and 3 only', '(d) 1, 2 and 3'], key: 1, reason: 'Answer (b): Art 224A is about retired judges' }),
    { type: 'notes', lines: ['Telangana HC: acting CJ Justice P. Sam Koshy (CJ elevated to the SC)', 'Acting CJ: appointed by the President · Art 223', 'Set: 214 HC per State · 217 appointment · 224 additional/acting · 224A retired · 231 common HC', 'Telangana HC: separate since 1 Jan 2019'] },
  ] });

// ---------- 3 · NTR Bharosa (Telugu States Lens) ----------
exTopic({ n: 3, cat: 'LOCAL', title: 'Who pays AP\'s pension?', short: 'NTR Bharosa · NSAP', tags: ['GS-2 · Welfare schemes', 'Telugu States Lens', 'APPSC Group-1'],
  locator: { focus: { 'Andhra Pradesh': '#7C3AED' }, bounds: [72, 8, 90, 24], pins: [['Andhra Pradesh', [79.7, 15.6], [-60, -90]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'NTR Bharosa: ₹4,000 a month, of which the Centre pays ₹200',
      facts: [['SCHEME', 'NTR Bharosa pensions, Andhra Pradesh', 'bharosa'], ['AMOUNT', '₹4,000 a month (elderly)', 'four thousand'], ['CENTRE\'S SHARE', '₹200 · about one-twentieth', 'two hundred']],
      side: { title: 'Who pays the ₹4,000 (%)', bars: [['Centre', [['₹200 (5%)', 5, 3]], 'two hundred'], ['State', [['₹3,800 (95%)', 95, 1]], 'four thousand']], note: 'Sources: Govt of AP (NTR Bharosa) · NSAP guidelines (MoRD)' } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'NSAP: WHAT THE CENTRE PAYS',
      table: { size: 28, rowH: 112, cols: [['Scheme', 0.55], ['Centre pays', 0.45]], rows: [
        [['Old age (IGNOAPS), 60–79', '₹200 a month'], 'sixty', { hl: true }], [['Old age, 80 and above', '₹500 a month'], 'eighty'], [['Widow (IGNWPS)', '₹300 a month'], 'widows'],
        [['Disability (IGNDPS)', '₹300 a month'], 'disabilities'], [['Family Benefit (NFBS)', '₹20,000 once'], 'family'], [['Annapurna', '10 kg free grain a month'], 'annapurna']] } },
    { type: 'trap', myth: 'NSAP is run by the Ministry of Social Justice', truth: 'NSAP: Ministry of Rural Development', cue: 'not' },
    ...mcq(['Under IGNOAPS, the Centre pays ₹200 a month to beneficiaries aged 60–79.', 'NSAP is administered by the Ministry of Rural Development.', 'Annapurna gives 10 kg of free food grain a month.'], [true, true, true],
      { reason: 'Answer (c): all three are correct' }),
    { type: 'notes', lines: ['NTR Bharosa (AP): ₹4,000/month to the elderly · Centre\'s share ₹200 (IGNOAPS)', 'NSAP (MoRD): IGNOAPS ₹200 (60–79), ₹500 (80+) · IGNWPS ₹300 · IGNDPS ₹300', 'NFBS ₹20,000 once · Annapurna 10 kg grain a month', 'Group-1 Mains: Describe the State\'s social security pensions and the role of central assistance.'] },
  ] });

// ---------- 4 · KRMB / GRMB ----------
const RIVERS = { bounds: [76.4, 13.6, 83.6, 19.9], focus: TG, rivers: ['Krishna', 'Godavari', 'Tungabhadra', 'Bhima'],
  labels: [['TELANGANA', [78.9, 18.0], 28], ['ANDHRA PRADESH', [79.3, 14.9], 28], ['BAY OF BENGAL', [82.6, 15.0], 28, '#FFFFFF']],
  pins: [['Srisailam', [78.87, 16.08], [-110, 40], 1.6], ['Nagarjuna Sagar', [79.31, 16.57], [60, 60], 1.9], ['Polavaram', [81.66, 17.27], [40, -60], 'polavaram', { bg: '#FFD60A' }]] };
exTopic({ n: 4, cat: 'LOCAL', title: 'Two river boards meet', short: 'KRMB · GRMB', tags: ['GS-1 · Rivers', 'GS-2 · Federalism', 'APPSC · TGPSC Group-1'],
  locator: { focus: { 'Andhra Pradesh': '#7C3AED', Telangana: '#9D6BFF' }, bounds: [72, 8, 90, 24], rivers: ['Krishna', 'Godavari'] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'The Krishna and Godavari river boards meet, with Polavaram on the agenda',
      facts: [['KRMB', '26 October (scheduled)', 'twenty-sixth'], ['GRMB', '30 October (scheduled)', 'thirtieth'], ['AGENDA', 'Polavaram backwater', 'polavaram']], side: { map: RIVERS } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'BOARDS vs TRIBUNALS',
      table: { size: 27, rowH: 120, cols: [['Body', 0.3], ['Basis', 0.7]], rows: [
        [['KRMB · GRMB', 'AP Reorganisation Act 2014 (s.85)'], 'reorganisation', { hl: true }], [['Apex Council', 's.84 · Jal Shakti Minister + both CMs'], 'apex'],
        [['Polavaram', 'A national project · s.90'], 'national'], [['KWDT-I · II', 'Bachawat (1973) · Brijesh Kumar (2010)'], 'krishna'],
        [['GWDT', 'Bachawat (1980)'], 'godavari'], [['Tribunals', 'Inter-State River Water Disputes Act 1956 · Art 262'], 'disputes']] } },
    { type: 'trap', myth: 'The river boards are Art 262 tribunals', truth: 'Boards: APRA 2014 · tribunals: the 1956 Act', cue: 'not' },
    ...mcq(['KRMB and GRMB were created under the AP Reorganisation Act, 2014.', 'River water tribunals are set up under the Inter-State River Water Disputes Act, 1956.', 'Polavaram is a national project under the AP Reorganisation Act, 2014.'], [true, true, true],
      { reason: 'Answer (c): all three are correct' }),
    { type: 'notes', lines: ['KRMB (26 Oct) and GRMB (30 Oct) meetings scheduled · Polavaram backwater on the GRMB agenda', 'Boards: APRA 2014 s.85 · Apex Council s.84 · Polavaram national project s.90', 'Tribunals: ISRWD Act 1956, under Art 262 · KWDT-I 1973, KWDT-II 2010 · GWDT 1980', 'Jurisdiction: Ministry of Jal Shakti notification, July 2021'] },
  ] });

// ---------- 5 · Tummidihatti ----------
const WARDHA = [[78.75, 20.75], [79.0, 20.3], [79.3, 19.9], [79.55, 19.68], [79.82, 19.58]], PRAN = [[79.82, 19.58], [79.86, 19.45], [79.92, 19.15], [79.91, 18.81]];
const pranMap = steps => ({ map: { bounds: [78.3, 18.45, 81.2, 20.95], focus: { Telangana: '#99EBDA', Maharashtra: '#E9DDFF' }, rivers: ['Godavari', 'Wainganga'],
  labels: [['MAHARASHTRA', [80.3, 20.1], 28], ['TELANGANA', [79.15, 19.1], 28]],
  draw: (g, proj, s) => {
    line(g, proj, WARDHA, { dash: [14, 8], alpha: steps ? eia(s, ecue(s, 'wardha', 1)) : 1 });
    line(g, proj, PRAN, { lw: 10, color: '#7C3AED', alpha: steps ? eia(s, ecue(s, 'pranahita', 1)) : 1 });
    exTag(g, proj, [79.0, 20.4], 'Wardha', [-60, -40], steps ? eia(s, ecue(s, 'wardha', 1)) : 1, EP.purple);
    exTag(g, proj, [80.2, 20.4], 'Wainganga', [60, -40], steps ? eia(s, ecue(s, 'wainganga', 1)) : 1, EP.purple);
    exTag(g, proj, [79.88, 19.3], 'PRANAHITA', [150, 0], steps ? eia(s, ecue(s, 'pranahita', 1)) : 1, EP.purple, { bg: '#7C3AED', fg: '#FFFFFF' });
    exTag(g, proj, [79.86, 19.46], 'Tummidihatti (approx.)', [-190, -30], steps ? 1 : eia(s, ecue(s, 'tummidihatti', 1)), EP.purple, { bg: '#FFD60A' });
    exTag(g, proj, [79.91, 18.81], 'Kaleshwaram · joins the Godavari', [190, 30], steps ? eia(s, ecue(s, 'kaleshwaram', 2)) : 1.5, EP.purple);
  }, credit: 'Boundaries: Survey of India outline (DataMeet) · Natural Earth · Wardha and Pranahita courses schematic' } });
exTopic({ n: 5, cat: 'LOCAL', title: 'Tummidihatti: how high?', short: 'Tummidihatti barrage', tags: ['GS-1 · Rivers', 'Inter-State relations', 'TGPSC Group-1'],
  locator: { focus: { Telangana: '#7C3AED', Maharashtra: '#BB9BFF' }, bounds: [72, 8, 90, 24], pins: [['Tummidihatti', [79.86, 19.46], [-90, -70]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'Telangana and Maharashtra agree to a joint committee on the Tummidihatti barrage', hz: 44,
      facts: [['TELANGANA WANTS', 'Full reservoir level 152 m', 'fifty-two'], ['AGREED IN 2016', '148 m (as Telangana says)', 'forty-eight'], ['OUTCOME', 'A joint committee of officials', 'joint']], side: pranMap(false) },
    { type: 'panel', step: 'FACTS', head: 'THE PRANAHITA', side: pranMap(true),
      notes: [['FORMED BY', 'The Wardha + the Wainganga', 'wardha'], ['RUNS ALONG', 'The Telangana–Maharashtra border', 'border'], ['JOINS', 'The Godavari at Kaleshwaram', 'kaleshwaram']] },
    { type: 'trap', myth: 'The barrage is on the Godavari main stem', truth: 'On the Pranahita (Wardha + Wainganga)', cue: 'not' },
    ...mcq(['The Pranahita is formed by the confluence of the Wardha and the Wainganga.', 'The Pranahita is a tributary of the Krishna.', 'The Tummidihatti barrage is proposed on the main stem of the Godavari.'], [true, false, false],
      { reason: 'Answer (a): only 1 · the Pranahita joins the Godavari' }),
    { type: 'notes', lines: ['Tummidihatti: Telangana seeks FRL 152 m vs 148 m (2016) · joint committee of officials (26 Oct)', 'Pranahita = Wardha + Wainganga · Telangana–Maharashtra border', 'Joins the Godavari at Kaleshwaram'] },
  ] });

// ---------- 6 · DM Act tiers ----------
exTopic({ n: 6, cat: 'LOCAL', title: 'Who runs a disaster response?', short: 'DM Act tiers · Arnab', tags: ['GS-3 · Disaster Management', 'APPSC Group-1'],
  locator: { focus: { 'Andhra Pradesh': '#7C3AED' }, bounds: [72, 8, 90, 24], pins: [['Godavari delta', [82.0, 16.6], [-60, -90]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'Cyclone Arnab: AP\'s response runs through its State Disaster Management Authority', hz: 44,
      facts: [['WHEN', '28 Oct · Cyclone Arnab', 'arnab'], ['WHERE', 'Godavari delta coast', 'godavari'], ['WHO', 'AP State Disaster Management Authority', 'authority']],
      side: { map: { bounds: [80.4, 15.4, 84.6, 18.3], focus: { 'Andhra Pradesh': '#5FD9C2' }, rivers: ['Godavari', 'Krishna'], arrow: [[84.7, 14.6], [83.2, 15.7], [81.89, 16.5]],
        labels: [['BAY OF BENGAL', [83.6, 16.4], 32, '#FFFFFF']], pins: [['Kakinada', [82.247, 16.989], [130, -60], 2.0], ['Yanam', [82.214, 16.733], [-150, -60], 2.3, { bg: '#FFD60A' }]] } } },
    { type: 'steps', step: 'FACTS', head: 'DISASTER MANAGEMENT ACT, 2005',
      items: [['NDMA · section 3', 'Chair: the Prime Minister', 'prime'], ['SDMA · section 14', 'Chair: the Chief Minister', 'chief'], ['DDMA · section 25', 'Chair: the District Collector', 'collector'], ['NDRF · section 44', 'The specialist response force', 'forty-four']] },
    { type: 'trap', myth: 'The SDMA is chaired by the Governor', truth: 'The Chief Minister · section 14', cue: 'not' },
    ...mcq(['The NDMA is chaired by the Prime Minister.', 'The SDMA is chaired by the Governor.', 'The NDRF is constituted under the Disaster Management Act, 2005.'], [true, false, true],
      { ...CODES, opts: ['(a) 1 only', '(b) 1 and 3 only', '(c) 2 and 3 only', '(d) 1, 2 and 3'], key: 1, reason: 'Answer (b): the SDMA is chaired by the CM' }),
    { type: 'notes', lines: ['DM Act 2005: NDMA (s.3) PM · SDMA (s.14) CM · DDMA (s.25) Collector', 'NDRF: s.44 of the same Act', 'Warnings: IMD is the RSMC New Delhi for the north Indian Ocean', 'Document: APSDMA bulletins, 27–28 Oct'] },
  ] });

// ---------- 7 · Kolleru ----------
exTopic({ n: 7, cat: 'LOCAL', title: 'Kolleru: a sanctuary\'s limits', short: 'Kolleru Lake', tags: ['GS-3 · Wetlands', 'Places in news', 'APPSC Group-1'],
  locator: { focus: { 'Andhra Pradesh': '#7C3AED' }, bounds: [72, 8, 90, 24], pins: [['Kolleru', [81.22, 16.62], [-80, -80]]] },
  slides: [
    { type: 'title' },
    { type: 'news', col: 'teal', headline: 'AP asks to exclude about 20,000 acres from the Kolleru Wildlife Sanctuary (as reported)', hz: 44,
      facts: [['WHAT', 'Exclude ≈ 20,000 acres (as reported)', 'twenty'], ['FROM', 'Kolleru Wildlife Sanctuary', 'kolleru'], ['BEFORE', 'The SC\'s Central Empowered Committee', 'central']],
      side: { map: { bounds: [80.0, 15.6, 82.6, 17.4], focus: { 'Andhra Pradesh': '#99EBDA' }, rivers: ['Godavari', 'Krishna'],
        labels: [['Krishna delta', [80.85, 15.95], 28], ['Godavari delta', [81.95, 16.6], 28], ['BAY OF BENGAL', [81.9, 15.75], 28, '#FFFFFF']],
        pins: [['KOLLERU · freshwater', [81.22, 16.62], [0, -80], 'kolleru', { bg: '#0F9D8F', fg: '#FFFFFF' }], ['Eluru', [81.1, 16.71], [-120, 40], 2.5]] } } },
    { type: 'table', col: 'violet', step: 'FACTS', head: 'LAKES: THE LOOK-ALIKE SET',
      table: { size: 28, rowH: 135, cols: [['Lake', 0.25], ['Type · State · Ramsar', 0.75]], rows: [
        [['Kolleru', 'Freshwater · AP · Ramsar 2002'], 'kolleru', { hl: true }], [['Chilika', 'Brackish lagoon · Odisha · Ramsar 1981'], 'chilika'],
        [['Pulicat', 'Brackish lagoon · AP–Tamil Nadu'], 'pulicat'], [['Sambhar', 'Saline · Rajasthan · Ramsar 1990'], 'sambhar'], [['Loktak', 'Freshwater · phumdis · Manipur · Ramsar 1990'], 'loktak']] } },
    { type: 'trap', myth: 'Kolleru is a brackish lagoon like Chilika', truth: 'Freshwater · between the Krishna and Godavari deltas', cue: 'not' },
    ...mcq(['Kolleru is a brackish-water lagoon.', 'Kolleru lies between the Krishna and Godavari deltas.', 'Pulicat is a brackish lagoon on the AP–Tamil Nadu border.'], [false, true, true],
      { reason: 'Answer (b): 2 and 3 · Kolleru is freshwater' }),
    { type: 'notes', lines: ['Kolleru: AP seeks to exclude ≈ 20,000 acres (as reported) · before the SC\'s CEC', 'Freshwater lake between the Krishna and Godavari deltas · Ramsar 2002', 'Look-alikes: Chilika, Pulicat brackish · Sambhar saline · Loktak freshwater (phumdis)'] },
  ] });

// ---------- intro, board, sheet ----------
SCENES.S00 = (ctx, s) => exIntro(ctx, s, 'AP–TG DESK · WEEK 44 · 26 OCT – 1 NOV 2026', 'Seven Telugu States topics · static facts, traps and a Group-1 style question for each');
const BOARD = ['AP BC quota', 'Telangana HC', 'NTR Bharosa · NSAP', 'KRMB · GRMB', 'Tummidihatti', 'DM Act tiers', 'Kolleru Lake'];
SCENES.S0 = (ctx, s) => {
  const c = EP.purple; exSlide(ctx, c);
  kt(ctx, 'AP–TG DESK · WEEK 44', 960, 150, { font: F.ui(38, 800), align: 'center', color: '#FFFFFF', alpha: eia(s, 0.1) });
  kt(ctx, 'Why in news → static facts → trap → Group-1 style question', 960, 210, { font: F.ui(30, 700), align: 'center', color: c.t[2], alpha: eia(s, s.w('static') - 0.3) });
  BOARD.forEach((t, i) => {
    const x = i < 4 ? 210 + i * 380 : 400 + (i - 4) * 380, y = i < 4 ? 320 : 540, a = eia(s, s.w('seven') - 0.2 + i * 0.12);
    exBox(ctx, x, y, 350, 170, { alpha: a, bar: '#14B8A6' });
    kt(ctx, String(i + 1).padStart(2, '0'), x + 40, y + 70, { font: F.head(44), color: c.main, alpha: a });
    kt(ctx, t, x + 40, y + 128, { font: F.ui(30, 800), color: c.ink, alpha: a, maxW: 290 });
  });
};
const SHEET = [['01', 'BC quota', 'AP HC 1 Oct, SC 9 Oct · Art 243D(6) enabling · triple test (Gawali 2021) · ≤ 50%'], ['02', 'Telangana HC', 'Acting CJ Justice P. Sam Koshy · appointed by the President, Art 223'],
  ['03', 'NTR Bharosa', '₹4,000/month · Centre ₹200 (IGNOAPS) · NSAP is MoRD'], ['04', 'KRMB · GRMB', 'APRA 2014 boards (s.85) · tribunals: 1956 Act, Art 262'],
  ['05', 'Tummidihatti', 'Pranahita = Wardha + Wainganga · FRL 152 m sought vs 148 m (2016)'], ['06', 'DM Act 2005', 'NDMA PM (s.3) · SDMA CM (s.14) · DDMA Collector (s.25) · NDRF s.44'],
  ['07', 'Kolleru', 'Freshwater, between the deltas · Ramsar 2002 · Chilika, Pulicat brackish']];
SCENES.S99 = (ctx, s) => {
  const c = EP.purple; exSlide(ctx, c);
  exChip(ctx, 'TELUGU STATES SHEET · AP–TG DESK W44', 72, 40, '#FFFFFF', c.ink, 28);
  exBox(ctx, 72, 140, 1776, 880);
  SHEET.forEach(([n, it, fact], i) => {
    const y = 165 + i * 120, a = eia(s, 0.2 + i * 0.1);
    ctx.save(); ctx.globalAlpha *= a; rr(ctx, 96, y, 1728, 106, 12); ctx.fillStyle = c.t[i % 2]; ctx.fill(); ctx.fillStyle = '#14B8A6'; ctx.fillRect(96, y, 10, 106); ctx.restore();
    kt(ctx, n, 136, y + 66, { font: F.head(36), color: c.main, alpha: a });
    kt(ctx, it, 210, y + 66, { font: F.ui(30, 800), color: c.ink, alpha: a });
    kt(ctx, fact, 520, y + 66, { font: F.ui(28, 600), color: c.ink, alpha: a, maxW: 1280 });
  });
};
