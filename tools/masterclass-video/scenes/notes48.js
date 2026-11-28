// W48 Instagram carousel in a spiral-notebook style (owner, 28 Nov: "I need these type of work also").
// Render stills at 1080x1350:  node render.js <assets> <tl> scenes/weekly48.js,scenes/notes48.js <outdir> --size 1080x1350 --stills t1,t2,...
// Our own design: lined paper, spiral rings, handwriting (Caveat), highlighter labels, a pink "Prelims trap" sticky note,
// and a real locator map or Sentinel-2 view in place of photos. Facts as verified in weeks/2026-W48/weekly/01-research-brief.md.
const HL = { y: 'rgba(255,230,0,0.75)', p: 'rgba(255,120,190,0.45)', g: 'rgba(80,220,140,0.45)', b: 'rgba(90,170,255,0.4)' };
const HAND = (z, w = 700) => F.hand(z, w), NAVY = '#16206B', INKN = '#1F2937', PINK = '#D6336C';
function paper(ctx, s, page) {
  ctx.fillStyle = '#FDFCF7'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(70,130,200,0.22)'; ctx.lineWidth = 2; for (let y = 150; y < H; y += 46) { ctx.beginPath(); ctx.moveTo(90, y); ctx.lineTo(W - 20, y); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(220,60,60,0.45)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(110, 0); ctx.lineTo(110, H); ctx.stroke();
  for (let y = 40; y < H; y += 54) { ctx.beginPath(); ctx.arc(34, y, 13, 0, 7); ctx.fillStyle = '#D9D9D9'; ctx.fill(); ctx.strokeStyle = '#7A7A7A'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(22, y, 16, -1.2, 1.2); ctx.stroke(); }
  // handle pill + page number
  ctx.font = F.ui(26, 900); const hw = ctx.measureText('@decodeupscwithmounika').width + 60; rr(ctx, (W - hw) / 2 + 30, 24, hw, 50, 25); ctx.fillStyle = NAVY; ctx.fill();
  kt(ctx, '@decodeupscwithmounika', W / 2 + 30, 58, { font: F.ui(26, 900), color: '#FFFFFF', align: 'center' });
  if (page) kt(ctx, page, W - 40, 62, { font: HAND(34), color: '#888', align: 'right' });
}
function hl(ctx, x, y, w, col, h = 40) { ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 6, y - h * 0.72); ctx.lineTo(x + w + 8, y - h * 0.8); ctx.lineTo(x + w + 4, y + h * 0.22); ctx.lineTo(x - 4, y + h * 0.28); ctx.closePath(); ctx.fill(); ctx.restore(); }
function title(ctx, t, y, col = NAVY, z = 66) { ctx.font = HAND(z); const w = ctx.measureText(t).width; hl(ctx, 140, y, Math.min(w, W - 200), HL.y, z * 0.9); kt(ctx, t, 140, y, { font: HAND(z), color: col, maxW: W - 180 }); }
function badge(ctx, t, x, y) { ctx.font = HAND(32); const w = ctx.measureText(t).width + 34; rr(ctx, x - w, y - 34, w, 48, 10); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.strokeStyle = NAVY; ctx.lineWidth = 2.5; ctx.stroke(); kt(ctx, t, x - w + 17, y, { font: HAND(32), color: '#B91C1C' }); }
// a labelled line: ▶ Label: value   (label highlighted)
function fact(ctx, y, label, value, col = HL.y, maxW = 560) {
  kt(ctx, '▶', 150, y, { font: F.ui(26, 900), color: PINK }); ctx.font = HAND(38); const lw = ctx.measureText(label + ':').width;
  hl(ctx, 188, y, lw, col, 36); kt(ctx, label + ':', 188, y, { font: HAND(38), color: INKN });
  return kt(ctx, value, 188 + lw + 14, y, { font: HAND(36, 500), color: '#1E3A8A', maxW: Math.max(220, maxW - lw), lh: 40 });
}
function trapNote(ctx, x, y, w, h, lines) {
  ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(-0.015); ctx.translate(-(x + w / 2), -(y + h / 2));
  ctx.fillStyle = '#FFE3EE'; ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 12; ctx.fillRect(x, y, w, h); ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(x + w / 2 - 60, y - 14, 120, 30);
  kt(ctx, '⚠ Prelims Trap', x + 24, y + 52, { font: HAND(42), color: '#B91C1C' });
  let yy = y + 100; for (const l of lines) yy += kt(ctx, l, x + 24, yy, { font: HAND(34, 500), color: INKN, maxW: w - 48, lh: 38 }) + 8;
  ctx.restore();
}
function takeaway(ctx, y, lines) {
  rr(ctx, 140, y, W - 180, 60 + lines.length * 46, 20); ctx.fillStyle = 'rgba(220,240,255,0.7)'; ctx.fill(); ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 2.5; ctx.stroke();
  lines.forEach((l, i) => { kt(ctx, '✅', 166, y + 62 + i * 46, { font: F.ui(26, 900) }); kt(ctx, l, 210, y + 62 + i * 46, { font: HAND(34, 600), color: INKN, maxW: W - 280 }); });
}
function photoFrame(ctx, b, draw) { ctx.save(); ctx.translate(b[0] + b[2] / 2, b[1] + b[3] / 2); ctx.rotate(0.02); ctx.translate(-(b[0] + b[2] / 2), -(b[1] + b[3] / 2));
  ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 14; ctx.fillRect(b[0] - 12, b[1] - 12, b[2] + 24, b[3] + 24); ctx.shadowBlur = 0; draw(); ctx.restore(); }
const still = s => ({ ...s, t: s.d, d: s.d });   // stills show the finished page

// ---------- pages ----------
SCENES.S01 = (ctx, s) => { paper(ctx, s, '');
  kt(ctx, 'CURRENT AFFAIRS', W / 2 + 40, 250, { font: HAND(96), color: NAVY, align: 'center' });
  ctx.font = HAND(110); const w = ctx.measureText('NOVEMBER 4th WEEK').width; hl(ctx, W / 2 + 40 - w / 2, 390, w, HL.y, 100);
  kt(ctx, 'NOVEMBER 4th WEEK', W / 2 + 40, 390, { font: HAND(110), color: '#B91C1C', align: 'center' });
  kt(ctx, '23 – 28 Nov 2026 · UPSC · APPSC · TGPSC', W / 2 + 40, 470, { font: HAND(46, 500), color: INKN, align: 'center' });
  const T = ['US tariff threat · Section 301', "Nepal PM's visit · 8 MoUs", 'COP31 ends with no deal', 'Asia Power Index · India 3rd', "Pakistan's 1st astronaut · Tiangong", 'Hormuz + Vizag oil caverns', '₹11,000 cr machines scheme', 'Nitish Setu · bridge records', 'Constitution Day · makers', 'Lachit & Guru Tegh Bahadur', 'Child-marriage-free India'];
  T.forEach((t, i) => { const y = 580 + i * 62; kt(ctx, String(i + 1) + '.', 190, y, { font: HAND(40), color: PINK, align: 'right' }); kt(ctx, t, 210, y, { font: HAND(40, 600), color: '#1E3A8A' }); });
  rr(ctx, 160, 1270 - 20, W - 220, 70, 35); ctx.fillStyle = NAVY; ctx.fill(); kt(ctx, 'Save 📌 · Share with your study partner', W / 2 + 40, 1294, { font: HAND(40), color: '#FFFFFF', align: 'center' }); };

SCENES.S02 = (ctx, s) => { paper(ctx, s, '1/10'); title(ctx, '1  US TARIFF THREAT on India', 170);
  badge(ctx, 'Proposed: 25 Nov', W - 40, 240);
  let y = 300; y += fact(ctx, y, 'Who', 'US Trade Representative (USTR)') + 22; y += fact(ctx, y, 'Law', 'Section 301, Trade Act of 1974') + 22;
  y += fact(ctx, y, 'Rate', 'up to 25% · capped at 17% if a trade deal is signed', HL.g) + 22; y += fact(ctx, y, 'Reason', 'India\'s "structural excess capacity" called unreasonable', HL.p) + 22;
  y += fact(ctx, y, 'Next', 'comments till 5 Jan 2027 · hearing 25 Jan 2027') + 22; y += fact(ctx, y, 'Why 301?', 'US Supreme Court struck down IEEPA tariffs (20 Feb 2026)', HL.b) + 30;
  trapNote(ctx, 150, y + 20, 860, 260, ['Section 301 = unfair trade (USTR)', 'Section 232 = national security (Commerce Dept)', 'IEEPA = emergency powers']);
  takeaway(ctx, y + 330, ['NOT in force yet — only proposed', 'US = India\'s biggest export market']); };

SCENES.S03 = (ctx, s) => { paper(ctx, s, '2/10'); title(ctx, "2  NEPAL PM's STATE VISIT", 170); badge(ctx, '22–23 Nov 2026', W - 40, 240);
  let y = 300; y += fact(ctx, y, 'PM', 'Balendra Shah ("Balen") · first state visit', HL.y, 470) + 22; y += fact(ctx, y, 'MoUs', '8: space, police & forensics, civil service, health, Ayurveda, urban, agriculture', HL.g, 470) + 22;
  y += fact(ctx, y, 'Aid', '≈ ₹15,000 cr (reported) = ₹3,500 cr grant + ₹11,500 cr credit line', HL.p, 470) + 22;
  y += fact(ctx, y, 'Base', '1950 Treaty of Peace & Friendship · open border', HL.y, 470) + 22; y += fact(ctx, y, 'Rivers', 'Kosi 1954 · Gandak 1959 · Mahakali 1996', HL.b, 470) + 30;
  photoFrame(ctx, [700, 290, 320, 380], () => exMap(ctx, still(s), [700, 290, 320, 380], PAL.world, { bounds: [79, 25.3, 89, 31], focus: { Uttarakhand: '#F5D300', 'Uttar Pradesh': '#F5D300', Bihar: '#F5D300', 'West Bengal': '#F5D300', Sikkim: '#F5D300' }, highlight: { NPL: '#FFC2D1' }, credit: 'Survey of India outline' }));
  trapNote(ctx, 150, Math.max(y, 720) + 20, 860, 220, ['Nepal borders 5 Indian states:', 'Uttarakhand, UP, Bihar, West Bengal, SIKKIM']);
  takeaway(ctx, Math.max(y, 720) + 290, ['Sore point: Kalapani–Lipulekh–Limpiyadhura (Nepal map 2020)']); };

SCENES.S04 = (ctx, s) => { paper(ctx, s, '3/10'); title(ctx, '3  COP31 ENDS WITH NO DEAL', 170); badge(ctx, 'Antalya · 22 Nov', W - 40, 240);
  let y = 300; y += fact(ctx, y, 'Host', 'Türkiye presided · Australia led negotiations', HL.y, 470) + 22; y += fact(ctx, y, 'Result', '"Antalya Pact" NOT adopted', HL.p, 470) + 22;
  y += fact(ctx, y, 'First', 'COP without an overall deal since Copenhagen 2009', HL.g, 470) + 22; y += fact(ctx, y, 'Survives', 'Paris Agreement · Dubai 2023 "transition away from fossil fuels"', HL.b, 470) + 30;
  photoFrame(ctx, [700, 290, 320, 360], () => satView(ctx, still(s), [700, 290, 320, 360], 'antalya', [30.72, 36.885], 0.3, {}));
  trapNote(ctx, 150, Math.max(y, 700) + 20, 860, 220, ['Baku goal (COP29): DEVELOPED countries,', 'at least $300 BILLION a year by 2035']);
  takeaway(ctx, Math.max(y, 700) + 290, ["India: common but differentiated responsibilities"]); };

SCENES.S05 = (ctx, s) => { paper(ctx, s, '4/10'); title(ctx, '4  ASIA POWER INDEX 2026', 170);
  let y = 270; y += fact(ctx, y, 'By', 'Lowy Institute, Sydney (Australia)', HL.p) + 18; y += fact(ctx, y, 'Rank', '1 US · 2 China · 3 India (≈ 40.5, reported)', HL.y) + 18; y += fact(ctx, y, 'Covers', '27 countries · 8 measures', HL.g) + 30;
  title(ctx, "5  PAKISTAN's 1st ASTRONAUT", y + 60); y += 140;
  y += fact(ctx, y, 'Mission', 'Shenzhou-24 · 25 Nov 2026 · Long March 2F', HL.y, 470) + 18; y += fact(ctx, y, 'Who', 'Muhammad Zeeshan Ali · payload specialist', HL.b, 470) + 18;
  y += fact(ctx, y, 'First', 'foreign astronaut on China\'s Tiangong', HL.p, 470) + 18;
  photoFrame(ctx, [720, y - 250, 290, 240], () => satView(ctx, still(s), [720, y - 250, 290, 240], 'jiuquan', [100.25, 40.98], 0.4, {}));
  trapNote(ctx, 150, y + 30, 860, 230, ['China is NOT an ISS partner', 'Jiuquan launch centre is in INNER MONGOLIA (named after a city in Gansu)']);
  takeaway(ctx, y + 300, ['India: Rakesh Sharma 1984 · Shubhanshu Shukla on ISS 2025']); };

SCENES.S06 = (ctx, s) => { paper(ctx, s, '5/10'); title(ctx, '6  STRAIT OF HORMUZ', 170);
  let y = 290; y += fact(ctx, y, 'News', 'IRGC says tankers hit mines (not independently verified)', HL.p, 470) + 22; y += fact(ctx, y, 'Where', 'Iran (N) ↔ Oman\'s Musandam (S)', HL.y, 470) + 22;
  y += fact(ctx, y, 'Links', 'Persian Gulf ↔ Gulf of Oman', HL.g, 470) + 22; y += fact(ctx, y, 'Share', '≈ 1/5 of world oil · India imports ≈ 85% of crude', HL.b, 470) + 30;
  photoFrame(ctx, [700, 280, 320, 360], () => satView(ctx, still(s), [700, 280, 320, 360], 'hormuz', [56.35, 26.45], 1.3, {}));
  title(ctx, 'Telugu States Lens · Vizag', Math.max(y, 690) + 40, '#0F766E', 54);
  let y2 = Math.max(y, 690) + 120; y2 += fact(ctx, y2, 'SPR caverns', 'Visakhapatnam 1.33 MMT (the first) · Mangaluru 1.5 · Padur 2.5 = 5.33 MMT', HL.g, 800) + 30;
  trapNote(ctx, 150, y2 + 10, 860, 200, ['Bab-el-Mandeb = Red Sea ↔ Gulf of Aden', 'Malacca = Indian Ocean ↔ South China Sea']); };

SCENES.S07 = (ctx, s) => { paper(ctx, s, '6/10'); title(ctx, '7  ₹11,000 CR MACHINES SCHEME', 170); badge(ctx, 'Cabinet · 25 Nov', W - 40, 240);
  let y = 300; y += fact(ctx, y, 'Ministry', 'Heavy Industries · 8 years from 2026-27', HL.p, 800) + 18; y += fact(ctx, y, 'Makes', 'tunnel boring machines · ship-to-shore cranes · excavators · off-highway trucks', HL.y, 800) + 18;
  y += fact(ctx, y, 'Support', 'incentive on incremental sales · up to ₹375 cr testing facility', HL.g, 800) + 30;
  title(ctx, '8  NITISH SETU · new longest river bridge', y + 50, NAVY, 54); y += 130;
  y += fact(ctx, y, 'Where', 'Ganga · Kachchi Dargah (Patna) ↔ Bidupur (Vaishali)', HL.b, 470) + 18; y += fact(ctx, y, 'Length', '9.76 km · 6 lanes · opened 21 Nov 2026', HL.y, 470) + 18;
  photoFrame(ctx, [720, y - 210, 290, 220], () => satView(ctx, still(s), [720, y - 210, 290, 220], 'nitish', [85.32, 25.62], 0.18, {}));
  trapNote(ctx, 150, y + 30, 860, 250, ['Bhupen Hazarika Setu (Lohit) = old river record', 'Bogibeel = longest rail-cum-road', 'Atal Setu (Mumbai) = longest SEA bridge']); };

SCENES.S08 = (ctx, s) => { paper(ctx, s, '7/10'); title(ctx, '9  CONSTITUTION DAY · 26 Nov', 170);
  let y = 290; y += fact(ctx, y, 'Adopted', '26 Nov 1949 · in force 26 Jan 1950', HL.y, 800) + 18; y += fact(ctx, y, 'Since', 'Samvidhan Divas observed since 2015 · 77th', HL.g, 800) + 18;
  y += fact(ctx, y, 'Took', '2 years, 11 months, 18 days · 284 signed (24 Jan 1950)', HL.b, 800) + 30;
  title(ctx, 'Makers of the Constitution', y + 40, '#0F766E', 50); y += 110;
  for (const [n, r, c] of [['Dr Rajendra Prasad', 'President, Constituent Assembly', HL.y], ['Dr B. R. Ambedkar', 'Chairman, Drafting Committee', HL.y], ['B. N. Rau', 'Constitutional Adviser', HL.g], ['Durgabai Deshmukh', '15 women members · Rajahmundry (AP)', HL.p], ['P. B. N. Raizada', 'hand-wrote the original', HL.b]]) y += fact(ctx, y, n, r, c, 800) + 12;
  trapNote(ctx, 150, y + 20, 860, 200, ['Art 394: citizenship & election provisions', 'came into force on 26 Nov 1949 itself']);
  takeaway(ctx, y + 260, ['Same day: National Milk Day (Verghese Kurien) · 26/11 → NIA Act 2008']); };

SCENES.S09 = (ctx, s) => { paper(ctx, s, '8/10'); title(ctx, '10  TWO HEROES · 24 Nov', 170);
  let y = 280; y += fact(ctx, y, 'Lachit Borphukan', 'Ahom general · born 1622 · Lachit Divas (404th)', HL.y, 470) + 18; y += fact(ctx, y, 'Battle', 'Saraighat, 1671 · on the Brahmaputra near Guwahati', HL.b, 470) + 18;
  y += fact(ctx, y, 'Honour', 'NDA best cadet: Lachit Borphukan Gold Medal', HL.g, 470) + 18;
  photoFrame(ctx, [720, 270, 290, 300], () => satView(ctx, still(s), [720, 270, 290, 300], 'saraighat', [91.7, 26.18], 0.22, {}));
  y = Math.max(y, 640) + 10; y += fact(ctx, y, 'Guru Tegh Bahadur', '9th Sikh Guru · martyred Delhi 1675', HL.p, 800) + 18; y += fact(ctx, y, 'Places', 'Gurdwara Sis Ganj Sahib (Chandni Chowk) · Rakab Ganj', HL.y, 800) + 18;
  trapNote(ctx, 150, y + 30, 860, 190, ['Khalsa (1699) = 10th Guru, Guru Gobind Singh', 'NOT Guru Tegh Bahadur']);
  title(ctx, '11  BAL VIVAH MUKT BHARAT', y + 300, NAVY, 52); fact(ctx, y + 380, 'Law', 'PCMA 2006: girls 18 · boys 21 · campaign since 27 Nov 2024', HL.g, 800); };

SCENES.S10 = (ctx, s) => { paper(ctx, s, '9/10'); title(ctx, 'TEST YOURSELF · 6 MCQs', 170);
  const Q = [['Section 232 tariffs are on national-security grounds.', 'TRUE'], ['Nepal borders Himachal Pradesh.', 'FALSE'], ['The Antalya Pact was adopted at COP31.', 'FALSE'],
    ['Asia Power Index is published by the Lowy Institute.', 'TRUE'], ['The first SPR cavern is at Visakhapatnam.', 'TRUE'], ['Guru Tegh Bahadur founded the Khalsa.', 'FALSE']];
  let y = 290; Q.forEach(([q, a], i) => { kt(ctx, (i + 1) + '.', 150, y, { font: HAND(40), color: PINK }); const n = kt(ctx, q, 200, y, { font: HAND(38, 600), color: INKN, maxW: 640, lh: 42 });
    ctx.font = HAND(38); const w = ctx.measureText(a).width; hl(ctx, 880, y, w, a === 'TRUE' ? HL.g : HL.p, 38); kt(ctx, a, 880, y, { font: HAND(38), color: a === 'TRUE' ? '#047857' : '#B91C1C' }); y += n + 60; });
  takeaway(ctx, y + 20, ['Comment your score out of 6 👇', 'Full class: Sunday, 6 PM on YouTube']); };

SCENES.S11 = (ctx, s) => { paper(ctx, s, '10/10');
  kt(ctx, 'Key Takeaways', W / 2 + 40, 230, { font: HAND(84), color: NAVY, align: 'center' });
  takeaway(ctx, 300, ['US: Section 301 tariff only PROPOSED (17% with a deal)', 'Nepal: 8 MoUs · 5 border states incl. Sikkim', 'COP31: no deal — first since 2009', 'India 3rd in Asia Power Index (Lowy)', 'Tiangong ≠ ISS · Jiuquan in Inner Mongolia', 'Hormuz: Iran ↔ Oman · Vizag first SPR', 'Nitish Setu 9.76 km · Atal Setu = sea', 'Adopted 26 Nov 1949 · Art 394', '9th Guru martyred 1675 · Khalsa 1699 by 10th']);
  rr(ctx, 160, 1150, W - 220, 120, 30); ctx.fillStyle = NAVY; ctx.fill();
  kt(ctx, 'Decode UPSC with Mounika', W / 2 + 40, 1205, { font: HAND(52), color: '#FFD60A', align: 'center' }); kt(ctx, 'Follow for weekly notes · Save 📌 Share 🔁', W / 2 + 40, 1252, { font: HAND(36), color: '#FFFFFF', align: 'center' }); };
