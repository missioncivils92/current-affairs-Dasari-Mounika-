// W48 hand-drawn sketches (owner, 27 Nov: "please add sketches of images from you").
// Pencil-style drawings of SCENES and OBJECTS that draw themselves on paper. No faces or likenesses of real people (§6.1).
// Load after weekly48.js and upgrade48.js:  scenes/weekly48.js,scenes/upgrade48.js,scenes/sketch48.js
// Each sketch is built once as a list of jittered strokes (seeded, so every frame is identical) and revealed by progress p.

let SEED = 1; const rnd = () => (SEED = (SEED * 16807) % 2147483647) / 2147483647;
const J = (k = 2.2) => (rnd() - 0.5) * 2 * k;
function strokeLine(out, pts, passes = 2, k = 2.2) {         // a pencil line: 2 slightly different passes
  for (let p = 0; p < passes; p++) { const q = []; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]], n = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 18));
    for (let j = 0; j < n; j++) { const t = j / n; q.push([a[0] + (b[0] - a[0]) * t + J(k), a[1] + (b[1] - a[1]) * t + J(k)]); } } q.push([pts[pts.length - 1][0] + J(k), pts[pts.length - 1][1] + J(k)]); out.push({ pts: q, w: p ? 1.6 : 2.6, a: p ? 0.55 : 0.9 }); }
}
const L = (o, ...pts) => strokeLine(o, pts);
function R(o, x, y, w, h) { L(o, [x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]); }
function E(o, cx, cy, rx, ry, a0 = 0, a1 = Math.PI * 2) { const pts = []; for (let i = 0; i <= 36; i++) { const a = a0 + (a1 - a0) * i / 36; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } strokeLine(o, pts); }
function hatch(o, x, y, w, h, gap = 14) { for (let d = 0; d < w + h; d += gap) { const x0 = x + Math.max(0, d - h), y0 = y + Math.min(h, d), x1 = x + Math.min(w, d), y1 = y + Math.max(0, d - w); strokeLine(o, [[x0, y0], [x1, y1]], 1, 1.2); } }
function waves(o, x, y, w, rows = 3) { for (let r = 0; r < rows; r++) { const pts = []; for (let i = 0; i <= 40; i++) pts.push([x + w * i / 40, y + r * 26 + Math.sin(i * 0.9 + r) * 6]); strokeLine(o, pts, 1); } }

const SK = {};                                               // cache of built sketches
function build(name, fn) { if (!SK[name]) { SEED = 7 + name.length * 131; const o = []; fn(o); SK[name] = o; } return SK[name]; }
function drawSketch(ctx, box, name, fn, p, labels = []) {
  const [x, y, w, h] = box, S = build(name, fn), sc = Math.min(w / 800, h / 700);
  ctx.save();                                                 // paper
  const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#FBF6EA'); g.addColorStop(1, '#F1E8D2');
  rr(ctx, x, y, w, h, 22); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(80,60,30,0.35)'; ctx.stroke();
  ctx.translate(x + (w - 800 * sc) / 2, y + (h - 700 * sc) / 2); ctx.scale(sc, sc); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const N = S.length, upto = p * N;
  for (let i = 0; i < Math.min(N, Math.ceil(upto)); i++) { const st = S[i], frac = Math.min(1, upto - i), m = Math.max(2, Math.floor(st.pts.length * frac));
    ctx.beginPath(); st.pts.slice(0, m).forEach((q, j) => j ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.strokeStyle = `rgba(38,32,28,${st.a})`; ctx.lineWidth = st.w; ctx.stroke(); }
  for (const [t, lx, ly, z, at] of labels) kt(ctx, t, lx, ly, { font: F.hand(z || 40, 700), color: '#5B3A0E', align: 'center', alpha: clamp((p - (at ?? 0.85)) / 0.1) });
  ctx.restore();
  kt(ctx, 'Sketch · illustration', x + w - 18, y + h - 14, { font: F.ui(20, 700), color: 'rgba(80,60,30,0.7)', align: 'right' });
}

// ---------- the sketches (local 800 x 700 space) ----------
const SKETCH = {
  constitution: o => {                                        // Central Hall dome behind, open book + quill + inkpot in front
    E(o, 400, 210, 190, 120, Math.PI, Math.PI * 2); L(o, [190, 210], [610, 210]); R(o, 180, 210, 440, 140);
    for (let i = 0; i < 9; i++) L(o, [200 + i * 50, 215], [200 + i * 50, 345]); L(o, [160, 350], [640, 350]); L(o, [140, 368], [660, 368]);
    L(o, [400, 90], [400, 60]); E(o, 400, 90, 14, 8);
    // book
    L(o, [150, 470], [400, 440], [400, 640], [150, 660], [150, 470]); L(o, [400, 440], [650, 470], [650, 660], [400, 640]);
    for (let i = 0; i < 6; i++) { L(o, [185, 520 + i * 20], [370, 500 + i * 20]); L(o, [430, 500 + i * 20], [615, 520 + i * 20]); }
    // quill + inkpot
    E(o, 700, 620, 40, 16); L(o, [660, 620], [660, 580], [740, 580], [740, 620]); E(o, 700, 580, 40, 14);
    L(o, [700, 590], [740, 470], [780, 380]); for (let i = 0; i < 9; i++) { const t = i / 9; L(o, [700 + 80 * t, 590 - 210 * t], [690 + 80 * t + 26, 560 - 210 * t]); }
  },
  cargo: o => {                                               // container ship + a 25% stamp
    waves(o, 40, 560, 720, 3); L(o, [80, 470], [720, 470], [660, 560], [130, 560], [80, 470]);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { R(o, 150 + c * 62, 410 - r * 52, 58, 48); if ((r + c) % 3 === 0) hatch(o, 150 + c * 62, 410 - r * 52, 58, 48, 12); }
    R(o, 610, 300, 70, 170); R(o, 620, 270, 50, 30); L(o, [645, 270], [645, 220]);
    E(o, 610, 150, 110, 110); E(o, 610, 150, 92, 92);
  },
  tbm: o => {                                                 // tunnel boring machine face + excavator arm
    E(o, 300, 360, 220, 220); E(o, 300, 360, 60, 60); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; L(o, [300 + 60 * Math.cos(a), 360 + 60 * Math.sin(a)], [300 + 215 * Math.cos(a), 360 + 215 * Math.sin(a)]); }
    for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + 0.2; E(o, 300 + 150 * Math.cos(a), 360 + 150 * Math.sin(a), 10, 10); }
    R(o, 560, 520, 200, 80); E(o, 600, 610, 30, 30); E(o, 720, 610, 30, 30); L(o, [600, 520], [600, 470], [700, 470], [700, 520]);
    L(o, [680, 480], [620, 300], [520, 230]); L(o, [700, 470], [640, 300], [530, 250]); L(o, [520, 230], [470, 300], [530, 310], [530, 250]);
  },
  summit: o => {                                              // a climate-summit hall: tiered seats facing a stage with a globe
    for (let r = 0; r < 5; r++) E(o, 400, 640, 120 + r * 70, 40 + r * 24, Math.PI * 1.05, Math.PI * 1.95);
    R(o, 250, 180, 300, 170); E(o, 400, 265, 60, 60); E(o, 400, 265, 60, 22); L(o, [400, 205], [400, 325]); E(o, 400, 265, 24, 60);
    L(o, [330, 400], [470, 400], [460, 470], [340, 470], [330, 400]); L(o, [240, 160], [560, 160]);
  },
  rocket: o => {                                              // a rocket on its pad with the tower and smoke
    L(o, [400, 80], [370, 160], [370, 520], [430, 520], [430, 160], [400, 80]); L(o, [370, 160], [430, 160]);
    L(o, [370, 300], [330, 340], [330, 520], [370, 520]); L(o, [430, 300], [470, 340], [470, 520], [430, 520]);
    R(o, 230, 90, 60, 450); for (let i = 0; i < 9; i++) { L(o, [230, 90 + i * 50], [290, 140 + i * 50]); L(o, [290, 90 + i * 50], [230, 140 + i * 50]); }
    L(o, [290, 200], [370, 200]); L(o, [290, 320], [370, 320]); L(o, [180, 540], [620, 540]);
    for (let i = 0; i < 7; i++) E(o, 300 + i * 40, 590 + (i % 2) * 20, 50, 34);
  },
  tanker: o => {                                              // an oil tanker in a narrow strait, hills on both sides
    L(o, [0, 200], [120, 150], [220, 180], [300, 140], [380, 190]); L(o, [420, 190], [520, 130], [640, 170], [800, 140]);
    waves(o, 30, 520, 740, 4); L(o, [100, 420], [700, 420], [650, 500], [150, 500], [100, 420]);
    R(o, 560, 300, 90, 120); R(o, 575, 270, 60, 30); L(o, [605, 270], [605, 230]);
    for (let i = 0; i < 6; i++) E(o, 180 + i * 62, 410, 24, 10); L(o, [160, 400], [540, 400]);
  },
  books: o => {                                               // a school desk with books, a slate and a pencil
    L(o, [80, 520], [720, 520]); L(o, [120, 520], [120, 660]); L(o, [680, 520], [680, 660]);
    R(o, 140, 420, 260, 40); R(o, 160, 380, 230, 40); R(o, 150, 340, 240, 40); hatch(o, 160, 380, 230, 40, 16);
    R(o, 450, 300, 220, 200); R(o, 465, 315, 190, 170); L(o, [480, 360], [600, 360]); L(o, [480, 400], [640, 400]);
    L(o, [420, 480], [640, 260]); L(o, [432, 492], [652, 272]); L(o, [420, 480], [404, 506], [432, 492]);
  },
};

// ---------- where they appear ----------
function sketchTitle(n, t, grp, sub, name, labels) {
  return (ctx, s) => {
    const c = PAL[grp]; exSlide(ctx, c, null, null);
    drawSketch(ctx, [72, 120, 860, 840], name, SKETCH[name], clamp((s.t - 0.3) / (s.d * 0.75)), labels);
    zoom(ctx, bounce(s.t, 0.05), 1090, 300, () => { ctx.beginPath(); ctx.arc(1090, 300, 110, 0, 7); ctx.fillStyle = YEL; ctx.fill(); kt(ctx, String(n), 1090, 340, { font: F.head(120, 900), color: c.ink, align: 'center' }); });
    exChip(ctx, { eco: 'ECONOMY', pol: 'POLITY & SOCIETY', env: 'ENVIRONMENT & HEALTH', world: 'WORLD & DEFENCE' }[grp], 990, 460, '#FFFFFF', c.ink, 36, eia(s, 0.2));
    kt(ctx, t, 990, 620, { font: F.head(76, 900), color: '#FFFFFF', maxW: 860, lh: 86, alpha: eia(s, 0.3) });
    if (sub) kt(ctx, sub, 990, 900, { font: F.ui(40, 800), color: YEL, maxW: 860, lh: 50, alpha: eia(s, 0.6) });
  };
}
SCENES.S011 = sketchTitle(1, "America's tariff threat", 'eco', 'Section 301 · proposed 25 Nov 2026', 'cargo', [['25%', 610, 170, 90, 0.8], ['to the US', 400, 640, 44]]);
SCENES.S071 = sketchTitle(7, 'Made-in-India machines', 'eco', 'Cabinet · 25 Nov 2026 · ₹11,000 crore', 'tbm', [['tunnel boring machine', 300, 640, 42], ['excavator', 650, 670, 38]]);
SCENES.S091 = sketchTitle(9, 'Constitution Day', 'pol', '26 November · Samvidhan Divas', 'constitution', [['The Constitution of India', 400, 690, 44], ['Central Hall', 400, 400, 40, 0.75]]);
SCENES.S111 = sketchTitle(11, 'A child-marriage-free India', 'pol', 'Bal Vivah Mukt Bharat · two years', 'books', [['school first', 560, 450, 44]]);

// COP31: India's stand beside a sketch of the summit hall
SCENES.S034 = (ctx, s) => {
  exSlide(ctx, PAL.env, null, null); exChip(ctx, "INDIA'S STAND AT COP31", 72, 44, '#FFFFFF', PAL.env.ink, 36, eia(s, 0.05));
  drawSketch(ctx, [72, 140, 860, 860], 'summit', SKETCH.summit, clamp((s.t - 0.2) / (s.d * 0.7)), [['COP31 · Antalya', 400, 120, 46]]);
  pp(ctx, s, 0.3, 990, 200, 860, 330, YEL, [['Common but differentiated responsibilities', 44, INK], ['rich and poor countries carry different burdens', 30, INK, 800]]);
  pp(ctx, s, 0.6, 990, 580, 860, 330, '#FFFFFF', [['Finance from the developed world first', 44, INK], ['at least $300 billion a year by 2035 (Baku)', 30, VIO, 800]]);
};
// Shenzhou-24: the two stations beside a sketch of the launch
SCENES.S053 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'TWO SPACE STATIONS');
  drawSketch(ctx, [72, 160, 760, 840], 'rocket', SKETCH.rocket, clamp((s.t - 0.2) / (s.d * 0.7)), [['Long March 2F · Jiuquan', 400, 680, 42]]);
  pp(ctx, s, 0.2, 880, 190, 968, 380, '#FFFFFF', [['TIANGONG', 52, INK], ["China's own station", 36, INK, 800], ['now hosting partners like Pakistan', 30, VIO, 800]]);
  pp(ctx, s, 0.5, 880, 610, 968, 380, '#FFFFFF', [['INTERNATIONAL SPACE STATION', 42, INK], ['US · Russia · Europe · Japan · Canada', 32, INK, 800], ['China is NOT a partner', 34, RED, 800]]);
};
// Hormuz: the news beside a sketch of a tanker in the strait
SCENES.S062 = (ctx, s) => {
  const c = PAL.world; exSlide(ctx, c, null, null); head(ctx, s, c, 'NOVEMBER 2026 · TANKERS ON FIRE');
  drawSketch(ctx, [72, 160, 860, 840], 'tanker', SKETCH.tanker, clamp((s.t - 0.2) / (s.d * 0.7)), [['a tanker in a narrow strait', 400, 650, 42]]);
  pp(ctx, s, 0.15, 990, 190, 860, 330, '#FFFFFF', [["Iran's Revolutionary Guard: tankers struck sea mines", 38, INK], ['claims NOT independently verified', 30, RED, 800]]);
  pp(ctx, s, 0.45, 990, 560, 860, 200, '#FFD9DC', [['Traffic through the Strait', 32, INK], ['dropped sharply', 44, RED]]);
  pp(ctx, s, 0.65, 990, 790, 860, 200, GRN, [['Indian Navy', 40, INK], ["escorting India's tankers (reported)", 30, INK, 800]]);
};
