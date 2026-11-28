// W48 flash cards (owner, 28 Nov: "give flash cards for posting every topic"). One topic = 2 cards: FRONT (questions), BACK (answers + trap).
// node render.js <assets> <tl> scenes/weekly48.js,scenes/pencil48.js,scenes/flash48.js <outdir> --size 1080x1350 --stills ...
// Rows S101..S124: odd = front, even = back. A real map or Sentinel-2 view sits on the front where the topic is a place.
const FC = [
  { n: 1, t: "US TARIFF THREAT", col: '#E63946', pic: ['sat', 'atalsetu', [72.95, 18.955], 0.13],
    q: ['Which US law is used for the new tariff threat on India?', 'What is the rate with and without a trade deal?', 'Section 301 vs Section 232: which is about national security?'],
    a: ['Section 301, Trade Act of 1974 (US Trade Representative)', 'Up to 25% · capped at 17% with a deal · only PROPOSED', 'Section 232 (US Commerce Department)'], trap: 'Not in force yet: comments till 5 Jan, hearing 25 Jan 2027' },
  { n: 2, t: "NEPAL PM IN DELHI", col: '#2563EB', pic: ['map', [79, 25.3, 89, 31], { Uttarakhand: '#F5D300', 'Uttar Pradesh': '#F5D300', Bihar: '#F5D300', 'West Bengal': '#F5D300', Sikkim: '#F5D300' }, { NPL: '#FFC2D1' }],
    q: ["Who is Nepal's Prime Minister who visited India (22–23 Nov)?", 'How many MoUs were signed?', 'How many Indian states border Nepal?'],
    a: ['Balendra Shah ("Balen")', '8 MoUs · ≈ ₹15,000 crore help (reported)', '5: Uttarakhand, UP, Bihar, West Bengal, Sikkim'], trap: 'Students forget SIKKIM · 1950 Treaty of Peace and Friendship' },
  { n: 3, t: 'COP31 · NO DEAL', col: '#0F9D8F', pic: ['sat', 'antalya', [30.72, 36.885], 0.3],
    q: ['Where was COP31 held, and who presided?', 'Was the "Antalya Pact" adopted?', 'When did a COP last end without an overall deal?'],
    a: ['Antalya · Türkiye presided, Australia led talks', 'NO — not adopted (22 Nov 2026)', 'Copenhagen, 2009'], trap: 'Baku goal: DEVELOPED countries, $300 BILLION a year by 2035' },
  { n: 4, t: 'ASIA POWER INDEX', col: '#7C3AED', pic: null,
    q: ['Who publishes the Asia Power Index?', "What is India's rank in 2026?", 'How many countries and measures?'],
    a: ['Lowy Institute, Sydney (Australia)', '3rd (after US, China) · ≈ 40.5 (reported)', '27 countries · 8 measures'], trap: 'NOT the UN or World Bank · Global Hunger Index = Concern Worldwide + Welthungerhilfe' },
  { n: 5, t: "PAK'S 1st ASTRONAUT", col: '#2563EB', pic: ['sat', 'jiuquan', [100.25, 40.98], 0.4],
    q: ["Which mission took Pakistan's first astronaut to space?", 'Which space station did he visit?', 'In which region is the Jiuquan launch centre?'],
    a: ['Shenzhou-24 · 25 Nov 2026 · Muhammad Zeeshan Ali', "Tiangong (China's own) · first foreigner", 'Inner Mongolia (named after a city in Gansu)'], trap: 'China is NOT an ISS partner' },
  { n: 6, t: 'STRAIT OF HORMUZ', col: '#B45309', pic: ['sat', 'hormuz', [56.35, 26.45], 1.3],
    q: ['Which two countries face each other across Hormuz?', 'Which two seas does it join?', "Where is India's first strategic oil cavern?"],
    a: ["Iran (north) and Oman's Musandam (south)", 'Persian Gulf ↔ Gulf of Oman', 'Visakhapatnam (1.33 MMT) · total 5.33 MMT'], trap: 'Bab-el-Mandeb = Red Sea ↔ Gulf of Aden' },
  { n: 7, t: '₹11,000 CR MACHINES', col: '#D97706', pic: null,
    q: ['Which ministry runs the new construction-equipment scheme?', 'For how long?', "Where does India's construction-equipment industry rank?"],
    a: ['Ministry of Heavy Industries', '8 years from 2026-27 · incentive on incremental sales', '3rd in the world (after China, US)'], trap: 'NOT the Commerce Ministry · up to ₹375 cr for a testing facility' },
  { n: 8, t: 'NITISH SETU', col: '#0284C7', pic: ['sat', 'nitish', [85.32, 25.62], 0.18],
    q: ['Over which river is Nitish Setu, and how long is it?', 'Which bridge held the river record before it?', "Which is India's longest SEA bridge?"],
    a: ['Ganga · 9.76 km · Patna ↔ Vaishali', 'Bhupen Hazarika Setu (Lohit, Assam)', 'Atal Setu, Mumbai (≈ 21.8 km)'], trap: 'Bogibeel = longest rail-cum-road bridge' },
  { n: 9, t: 'CONSTITUTION DAY', col: '#7C3AED', pic: null,
    q: ['When was the Constitution adopted, and when did it come into force?', 'Since when is Samvidhan Divas observed?', 'Who chaired the Drafting Committee?'],
    a: ['Adopted 26 Nov 1949 · in force 26 Jan 1950', 'Since 2015 (2026 = 77th)', 'Dr B. R. Ambedkar · President: Dr Rajendra Prasad'], trap: 'Art 394: citizenship & election provisions began 26 Nov 1949' },
  { n: 10, t: 'TWO HEROES · 24 NOV', col: '#B91C1C', pic: ['sat', 'saraighat', [91.7, 26.18], 0.22],
    q: ['Which battle did Lachit Borphukan win, and when?', 'Which Sikh Guru was martyred in Delhi in 1675?', 'Who founded the Khalsa?'],
    a: ['Saraighat, 1671 · Brahmaputra near Guwahati', 'Guru Tegh Bahadur, the 9th Guru', 'Guru Gobind Singh, the 10th Guru (1699)'], trap: 'NOT Guru Tegh Bahadur · NDA best cadet gets the Lachit Borphukan Gold Medal' },
  { n: 11, t: 'CHILD MARRIAGE', col: '#DB2777', pic: null,
    q: ['Which law prohibits child marriage?', 'What are the minimum ages?', 'When was Bal Vivah Mukt Bharat launched?'],
    a: ['Prohibition of Child Marriage Act, 2006', 'Girls 18 · boys 21', '27 Nov 2024 · Ministry of Women and Child Development'], trap: 'The 2021 bill (girls to 21) lapsed in 2024' },
  { n: 12, t: 'PERSONS & PLACES', col: '#0F766E', pic: null,
    q: ['Who is the US Trade Representative?', 'Who presided over COP31?', 'Musandam belongs to which country?'],
    a: ['Jamieson Greer', 'Murat Kurum (Türkiye)', 'Oman (not Iran)'], trap: 'Jiuquan launch centre is in Inner Mongolia, not Gansu' },
];
const NV = '#16206B';
function cardBg(ctx, col) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#1B0B45'); g.addColorStop(1, '#4C1D95'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 30; rr(ctx, 60, 150, W - 120, H - 260, 34); ctx.fillStyle = '#FFFEF8'; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, 60, 150, W - 120, H - 260, 34); ctx.clip(); ctx.fillStyle = col; ctx.fillRect(60, 150, W - 120, 120);
  ctx.strokeStyle = 'rgba(70,130,200,0.18)'; ctx.lineWidth = 2; for (let y = 330; y < H - 110; y += 54) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(W - 60, y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(220,60,60,0.35)'; ctx.beginPath(); ctx.moveTo(140, 270); ctx.lineTo(140, H - 110); ctx.stroke(); ctx.restore();
  kt(ctx, '@decodeupscwithmounika', W / 2, 90, { font: F.ui(34, 900), color: '#FFD60A', align: 'center' });
  kt(ctx, 'Decode UPSC with Mounika · November 4th week', W / 2, H - 50, { font: F.ui(26, 800), color: 'rgba(255,255,255,0.8)', align: 'center' });
}
function header(ctx, c, side) {
  kt(ctx, 'FLASH CARD ' + c.n + '/12', 100, 228, { font: F.ui(34, 900), color: '#FFFFFF' });
  kt(ctx, c.t, W - 100, 228, { font: F.ui(40, 900), color: '#FFFFFF', align: 'right', maxW: 620 });
  exChip(ctx, side, W / 2 - (side.length * 13), 290, side === 'QUESTIONS' ? '#FFD60A' : '#06D6A0', '#1B0B45', 34, 1);
}
function front(c) {
  return (ctx, s) => {
    cardBg(ctx, c.col); header(ctx, c, 'QUESTIONS');
    let y = 420; const maxW = 800;
    c.q.forEach((q, i) => { kt(ctx, 'Q' + (i + 1), 120, y, { font: F.hand(54, 700), color: c.col }); y += kt(ctx, q, 200, y, { font: F.hand(44, 700), color: '#1F2937', maxW, lh: 54 }) + 60; });
    if (c.pic) { const b = [320, 800, 440, 235]; ctx.save(); ctx.translate(b[0] + b[2] / 2, b[1] + b[3] / 2); ctx.rotate(-0.02); ctx.translate(-(b[0] + b[2] / 2), -(b[1] + b[3] / 2));
      ctx.fillStyle = '#FFF'; ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 16; ctx.fillRect(b[0] - 12, b[1] - 12, b[2] + 24, b[3] + 24); ctx.shadowBlur = 0;
      const st = { ...s, t: s.d };
      if (c.pic[0] === 'sat') satView(ctx, st, b, c.pic[1], c.pic[2], c.pic[3], {});
      else exMap(ctx, st, b, PAL.world, { bounds: c.pic[1], focus: c.pic[2], highlight: c.pic[3], credit: 'Survey of India outline' });
      ctx.restore(); }
    rr(ctx, 120, H - 290, W - 240, 110, 24); ctx.fillStyle = '#FFF3C4'; ctx.fill();
    kt(ctx, 'Answer in the comments, then swipe ➡', W / 2, H - 222, { font: F.hand(46, 700), color: '#7A2E0E', align: 'center' });
  };
}
function back(c) {
  return (ctx, s) => {
    cardBg(ctx, c.col); header(ctx, c, 'ANSWERS');
    let y = 420;
    c.a.forEach((a, i) => { kt(ctx, '✓', 120, y, { font: F.ui(48, 900), color: '#059669' }); kt(ctx, 'Q' + (i + 1), 170, y, { font: F.hand(40, 700), color: c.col });
      y += kt(ctx, a, 240, y, { font: F.hand(46, 700), color: NV, maxW: 760, lh: 56 }) + 56; });
    const h = 210; rr(ctx, 110, H - 130 - h - 40, W - 220, h, 22); ctx.fillStyle = '#FFE3EE'; ctx.fill();
    kt(ctx, '⚠ Prelims Trap', 140, H - 130 - h + 20, { font: F.hand(48, 700), color: '#B91C1C' });
    kt(ctx, c.trap, 140, H - 130 - h + 80, { font: F.hand(40, 700), color: '#1F2937', maxW: W - 300, lh: 46 });
  };
}
FC.forEach((c, i) => { SCENES['S' + (101 + 2 * i)] = front(c); SCENES['S' + (102 + 2 * i)] = back(c); });
