// Nyaya Patashala. Unit II, topics 1–2 (no animations): history of international environmental law and its fundamental principles.
// Usage: NODE_PATH=<dir with pptxgenjs, react-icons, react, react-dom, sharp> node build_deck.js <out.pptx>
// Static deck: no animate.py step.
//
// Animation convention: every animated object gets objectName "a<group><effect>_<label>".
// effect: f = fade, w = wipe from left, u = float up, z = zoom. Objects sharing a group animate together.

const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");

const SKILL = process.env.PPTX_SKILL_DIR;
const { applyTheme } = require(path.join(SKILL, "scripts/apply_theme.js"));

const HEX = {
  slate: "0A1F3A", card: "EEF2F7", card2: "E1E8F1", yellow: "E8B04A", white: "FFFFFF",
  muted: "51617A", red: "D8383E", teal: "0F7F8C", gold: "8C6200",
};
const THEME = {
  name: "Nyaya Patashala",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: HEX.slate, lt1: HEX.white, dk2: HEX.muted, lt2: HEX.card,
    accent1: HEX.yellow, accent2: HEX.teal, accent3: HEX.red, accent4: HEX.card,
    accent5: HEX.card2, accent6: HEX.gold, hlink: HEX.yellow, folHlink: HEX.teal,
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Unit II: International Environmental Law — History & Principles";
pres.subject = "LL.B (3YDC) Semester I, Paper V: Environmental Laws";
pres.author = "Nyaya Patashala";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const SLATE = C.text1, WHITE = C.background1, MUTED = C.text2, GOLD = C.accent6;
const YEL = C.accent1, TEAL = C.accent2, RED = C.accent3, CARD = C.accent4, CARD2 = C.accent5;

const W = 13.333, M = 0.6;

// ---------- layouts ----------
const EMBLEM = path.join(__dirname, "assets/nyaya-patashala-emblem.png");
const badge = [
  { image: { x: M, y: 6.86, w: 0.5, h: 0.5, path: EMBLEM, altText: "Nyaya Patashala logo" } },
  { text: { text: "NYAYA PATASHALA", options: { x: M + 0.6, y: 6.98, w: 2.0, h: 0.3, fontSize: 10, bold: true, color: GOLD, valign: "middle", margin: 0, charSpacing: 2 } } },
];
pres.defineSlideMaster({
  title: "Nyaya Content",
  background: { color: WHITE },
  objects: [
    ...badge,
    { text: { text: "LL.B Sem I  ·  Paper V: Environmental Laws", options: { x: 2.75, y: 6.98, w: 6, h: 0.3, fontSize: 10, color: MUTED, valign: "middle", margin: 0 } } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.35, w: W - 2 * M, h: 0.9, fontSize: 34, bold: true, color: SLATE, valign: "middle", margin: 0 }, text: "" } },
  ],
  slideNumber: { x: 12.1, y: 6.98, w: 0.63, h: 0.3, fontSize: 10, color: MUTED, align: "right" },
});
pres.defineSlideMaster({
  title: "Nyaya Unit",
  background: { color: WHITE },
  objects: [
    ...badge,
    { placeholder: { options: { name: "title", type: "title", x: 3.55, y: 0.5, w: 9.18, h: 1.3, fontSize: 36, bold: true, color: SLATE, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 3.55, y: 1.9, w: 9.18, h: 0.6, fontSize: 18, color: MUTED, valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "Nyaya Title",
  background: { color: WHITE },
  objects: [
    ...badge,
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.0, w: 7.6, h: 2.2, fontSize: 48, bold: true, color: SLATE, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 4.35, w: 7.6, h: 1.0, fontSize: 20, color: MUTED, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- icons ----------
const ICON_HEX = { slate: HEX.slate, yellow: HEX.yellow, white: HEX.white, teal: HEX.teal, red: HEX.red };
const iconCache = {};
async function icon(name, colorKey = "slate") {
  const key = name + colorKey;
  if (iconCache[key]) return iconCache[key];
  const Comp = fa[name];
  if (!Comp) throw new Error("missing icon " + name);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + ICON_HEX[colorKey], size: 256 }));
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  return (iconCache[key] = "image/png;base64," + buf.toString("base64"));
}

// ---------- animation naming ----------
let G = 0;
const next = (eff, label) => `a${++G}${eff}_${label}`;
const same = (eff, label) => `a${G}${eff}_${label}`;
const shadow = () => undefined; // plain, flat design

function newSlide(layout, section, title) {
  G = 0;
  const s = pres.addSlide({ masterName: layout, sectionTitle: section });
  if (title) s.addText(title, { placeholder: "title" });
  return s;
}

// icon in a filled circle
async function iconCircle(s, name, x, y, d, fill, iconColor, nm) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName: nm + "_c" });
  s.addImage({ data: await icon(name, iconColor), x: x + d * 0.24, y: y + d * 0.24, w: d * 0.52, h: d * 0.52, objectName: nm + "_i", altText: name });
}

// card with optional icon, heading and body; whole card is one animation group
async function card(s, { x, y, w, h, head, body, ic, eff = "u", fill = CARD, headColor = GOLD, iconFill = YEL, iconColor = "slate", headSize = 18, bodySize = 14, label = "card" }) {
  const nm = next(eff, label);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
  let tx = x + 0.25, tw = w - 0.5;
  if (ic) {
    await iconCircle(s, ic, x + 0.25, y + 0.25, 0.62, iconFill, iconColor, nm);
    tx = x + 1.05; tw = w - 1.3;
  }
  const runs = [];
  if (head) runs.push({ text: head, options: { bold: true, color: headColor, fontSize: headSize, breakLine: !!body } });
  if (body) {
    const lines = Array.isArray(body) ? body : [body];
    lines.forEach((t, i) => runs.push({ text: t, options: { color: SLATE, fontSize: bodySize, breakLine: i < lines.length - 1, bullet: Array.isArray(body) ? { indent: 14 } : false, paraSpaceBefore: i === 0 ? 4 : 2 } }));
  }
  s.addText(runs, { x: tx, y: y + 0.2, w: tw, h: h - 0.4, valign: "top", margin: 0, isTextBox: true, objectName: nm + "_t", fontFace: "Calibri" });
  return nm;
}

function txt(s, text, opts, nm) {
  s.addText(text, { isTextBox: true, margin: 0, color: SLATE, fontSize: 16, valign: "top", ...opts, objectName: nm });
}

// table built from shapes so each row can animate in
function rowTable(s, { x, y, colW, rowH, header, rows, headFill = YEL, firstColColor = GOLD, fontSize = 14 }) {
  let yy = y;
  const nmH = next("f", "thead");
  let xx = x;
  header.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: xx, y: yy, w: colW[i] - 0.04, h: 0.5, fill: { color: headFill }, line: { type: "none" }, objectName: `${nmH}_h${i}` });
    txt(s, h, { x: xx + 0.12, y: yy, w: colW[i] - 0.28, h: 0.5, bold: true, color: SLATE, fontSize: 14, valign: "middle" }, `${nmH}_ht${i}`);
    xx += colW[i];
  });
  yy += 0.54;
  rows.forEach((r, ri) => {
    const nm = next("w", "row" + ri);
    const rh = Array.isArray(rowH) ? rowH[ri] : rowH;
    xx = x;
    r.forEach((c, i) => {
      s.addShape(pres.shapes.RECTANGLE, { x: xx, y: yy, w: colW[i] - 0.04, h: rh, fill: { color: ri % 2 ? CARD2 : CARD }, line: { type: "none" }, objectName: `${nm}_r${i}` });
      txt(s, c, { x: xx + 0.12, y: yy, w: colW[i] - 0.28, h: rh, fontSize, valign: "middle", bold: i === 0, color: i === 0 ? firstColColor : SLATE }, `${nm}_c${i}`);
      xx += colW[i];
    });
    yy += rh + 0.04;
  });
}

async function divider(unit, title, sub, topics, ic, notes) {
  const s = newSlide("Nyaya Unit", unit.section, null);
  s.addText(title, { placeholder: "title" });
  s.addText(sub, { placeholder: "body" });
  const nm = next("z", "unit");
  s.addShape(pres.shapes.OVAL, { x: M, y: 0.4, w: 2.4, h: 2.4, fill: { color: YEL }, line: { type: "none" }, objectName: nm + "_c" });
  txt(s, "UNIT", { x: M, y: 0.75, w: 2.4, h: 0.4, align: "center", bold: true, fontSize: 16, color: SLATE, charSpacing: 4 }, nm + "_l");
  txt(s, unit.num, { x: M, y: 1.05, w: 2.4, h: 1.3, align: "center", bold: true, fontSize: 64, color: SLATE, fontFace: "Cambria", valign: "middle" }, nm + "_n");
  const nh = next("f", "tl");
  txt(s, "OFFICIAL SYLLABUS  ·  KAKATIYA UNIVERSITY  ·  LL.B (3YDC) SEM I, PAPER V", { x: M, y: 2.95, w: 10, h: 0.32, fontSize: 13, bold: true, color: GOLD, charSpacing: 2 }, nh);
  // two columns, filled top to bottom; heights follow the length of each topic
  const top = 3.3, bottom = 6.76, gap = 0.05, colW = (W - 2 * M - 0.15) / 2;
  const half = Math.ceil(topics.length / 2);
  const cols = [topics.slice(0, half), topics.slice(half)];
  let fs = 14, cpl = 66;
  const heightOf = (t, c) => 0.1 + Math.ceil(t.length / c) * 0.22;
  const colH = (arr, c) => arr.reduce((h, t) => h + heightOf(t, c) + gap, 0);
  if (Math.max(...cols.map((c) => colH(c, cpl))) > bottom - top) { fs = 13; cpl = 72; }
  let n = 0;
  for (let c = 0; c < 2; c++) {
    let y = top;
    const ng = next("w", "col" + c);
    for (const t of cols[c]) {
      n++;
      const h = heightOf(t, cpl), x = M + c * (colW + 0.15);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: colW, h, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.06, objectName: `${ng}_b${n}` });
      txt(s, String(n), { x: x + 0.1, y, w: 0.42, h, fontSize: fs, bold: true, color: GOLD, align: "center", valign: "middle" }, `${ng}_n${n}`);
      txt(s, t, { x: x + 0.55, y, w: colW - 0.7, h, fontSize: fs, valign: "middle" }, `${ng}_t${n}`);
      y += h + gap;
    }
  }
  s.addNotes(notes + " Here is your official syllabus for this unit, word for word. Note down every topic — every exam question comes from this list.");
  return s;
}

async function unitQuestions(unit, longQs, shortQs) {
  const s = newSlide("Nyaya Content", unit.section, `Unit ${unit.num}: important questions`);
  const colW = (W - 2 * M - 0.25) / 2;
  const cols = [["LONG ANSWER QUESTIONS", longQs, SLATE, CARD], ["SHORT ANSWER QUESTIONS", shortQs, TEAL, CARD2]];
  cols.forEach(([label, qs, tagFill, bg], c) => {
    const nm = next("u", "col" + c);
    const x = M + c * (colW + 0.25);
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.55, w: colW, h: 5.0, fill: { color: bg }, line: { type: "none" }, rectRadius: 0.1, objectName: nm + "_bg" });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: 1.72, w: 3.3, h: 0.42, fill: { color: tagFill }, line: { type: "none" }, rectRadius: 0.06, objectName: nm + "_tag" });
    txt(s, label, { x: x + 0.25, y: 1.72, w: 3.3, h: 0.42, fontSize: 12, bold: true, color: WHITE, align: "center", valign: "middle", charSpacing: 1 }, nm + "_k");
    txt(s, qs.map((q, i) => ({ text: q, options: { bullet: { type: "number" }, breakLine: i < qs.length - 1, paraSpaceAfter: 10 } })),
      { x: x + 0.3, y: 2.35, w: colW - 0.55, h: 4.05, fontSize: 15 }, nm + "_q");
  });
  s.addNotes(
    "[VOICE ANCHOR: focused, encouraging]\n" +
    `Here are the important questions from Unit ${unit.num}. Five long answer questions: ` +
    longQs.map((q, i) => `${i + 1}. ${q}`).join(" ") +
    ` And five short answer questions: ` + shortQs.map((q, i) => `${i + 1}. ${q}`).join(" ") +
    " Note them down. Everything you need to answer them is in the slides that follow."
  );
}

// ============================================================
// ============================================================
// Simple arrow between two points (diagram connector)
function arrow(s, x1, y1, x2, y2, color = MUTED) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001,
    flipH: x2 < x1, flipV: y2 < y1, line: { color, width: 2.5, endArrowType: "triangle" } });
}
function box(s, x, y, w, h, fill, text, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: opts.line ? { color: opts.line, width: 1.5 } : { type: "none" }, rectRadius: 0.1 });
  txt(s, text, { x: x + 0.15, y, w: w - 0.3, h, fontSize: opts.fs || 15, align: opts.align || "center", valign: "middle", color: opts.color || SLATE, bold: opts.bold });
}

async function build() {
  const U2 = { section: "Unit II: Topics 1–2", num: "II" };

  // 1. Title
  pres.addSection({ title: "Opening" });
  {
    const s = newSlide("Nyaya Title", "Opening", null);
    txt(s, "UNIT II  ·  TOPICS 1 & 2  ·  PAPER V", { x: M, y: 1.45, w: 7.6, h: 0.4, fontSize: 16, bold: true, color: GOLD, charSpacing: 3 });
    s.addText("International Environmental Law: History & Principles", { placeholder: "title" });
    s.addText("LL.B (3YDC) Semester I · Environmental Laws · Kakatiya University", { placeholder: "body" });
    s.addImage({ path: EMBLEM, x: 8.55, y: 1.15, w: 4.2, h: 4.2, altText: "Nyaya Patashala logo" });
  }

  // 2. Syllabus
  pres.addSection({ title: U2.section });
  {
    const s = newSlide("Nyaya Content", U2.section, "Unit II: what this class covers");
    txt(s, "OFFICIAL SYLLABUS · UNIT II (KAKATIYA UNIVERSITY)", { x: M, y: 1.45, w: 10, h: 0.35, fontSize: 13, bold: true, color: GOLD, charSpacing: 2 });
    const all = ["History and Development of Environmental Protection under International Law", "Fundamental Principles of International Environmental Law", "Ramsar Convention, 1971", "UN Conference on Human Environment, 1972 (Stockholm)", "Aims and Objectives of the Conference", "Stockholm Declaration, 1972", "Impact of Stockholm, UNEP", "Brundtland Commission, Brundtland Report 1987", "Rio Declaration, 1992", "Convention on Biological Diversity, 1992", "Earth Summit Plus Five", "Kyoto Protocol, 1997", "Millennium Development Goals", "Johannesburg Conference 2002 (WSSD)", "Johannesburg Declaration & Major Outcomes"];
    const colW = (W - 2 * M - 0.2) / 2;
    all.forEach((t, i) => {
      const c = i < 8 ? 0 : 1, r = i < 8 ? i : i - 8;
      const x = M + c * (colW + 0.2), y = 1.9 + r * 0.56;
      const now = i < 2;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: colW, h: 0.48, fill: { color: now ? YEL : CARD }, line: { type: "none" }, rectRadius: 0.06 });
      txt(s, String(i + 1), { x: x + 0.1, y, w: 0.4, h: 0.48, fontSize: 14, bold: true, color: now ? SLATE : GOLD, align: "center", valign: "middle" });
      txt(s, t, { x: x + 0.55, y, w: colW - 0.7, h: 0.48, fontSize: 14, bold: now, valign: "middle" });
    });
    txt(s, [{ text: "Today: ", options: { bold: true, color: GOLD } }, { text: "topics 1 and 2 (highlighted). The rest follow in later classes." }], { x: M, y: 6.45, w: 10, h: 0.35, fontSize: 14, color: MUTED });
  }

  // ===== TOPIC 1 =====
  // 3. Why international law?
  {
    const s = newSlide("Nyaya Content", U2.section, "Topic 1 · Why environmental law had to go international");
    // diagram: Country A factory → smoke crosses border → Country B farms
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.6, w: 5.6, h: 2.9, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.13, y: 1.6, w: 5.6, h: 2.9, fill: { color: CARD2 }, line: { type: "none" }, rectRadius: 0.12 });
    s.addShape(pres.shapes.LINE, { x: 6.67, y: 1.5, w: 0, h: 3.1, line: { color: RED, width: 3, dashType: "dash" } });
    txt(s, "BORDER", { x: 6.17, y: 4.62, w: 1.0, h: 0.3, fontSize: 12, bold: true, color: RED, align: "center" });
    s.addImage({ data: await icon("FaIndustry", "slate"), x: 1.3, y: 2.3, w: 1.4, h: 1.4, altText: "Factory" });
    txt(s, "Country A\nfactory / smelter", { x: M, y: 3.8, w: 3.0, h: 0.6, fontSize: 15, bold: true, align: "center" });
    s.addImage({ data: await icon("FaCloud", "slate"), x: 3.6, y: 1.8, w: 1.2, h: 1.0, altText: "Smoke" });
    s.addImage({ data: await icon("FaCloud", "slate"), x: 6.0, y: 1.8, w: 1.2, h: 1.0, altText: "Smoke" });
    arrow(s, 4.8, 2.3, 9.3, 2.3, RED);
    txt(s, "fumes, river water, oil spills, wildlife — all cross borders", { x: 3.6, y: 2.85, w: 6.2, h: 0.4, fontSize: 14, italic: true, color: RED, align: "center" });
    s.addImage({ data: await icon("FaSeedling", "teal"), x: 10.3, y: 2.3, w: 1.4, h: 1.4, altText: "Farms" });
    txt(s, "Country B\nfarms & forests harmed", { x: 9.6, y: 3.8, w: 2.9, h: 0.6, fontSize: 15, bold: true, align: "center" });
    await card(s, { x: M, y: 4.75, w: 5.9, h: 1.85, head: "The problem", body: "National law stops at the border. Country B cannot enforce its law inside Country A. So states needed shared rules: treaties and custom.", ic: "FaTriangleExclamation", iconFill: RED, iconColor: "white", headColor: RED, bodySize: 14 });
    await card(s, { x: 6.83, y: 4.75, w: 5.9, h: 1.85, head: "Global commons", body: "High seas, atmosphere, ozone layer, climate and biodiversity belong to no single state, so only collective action protects them.", ic: "FaEarthAsia", iconFill: TEAL, iconColor: "white", headColor: TEAL, bodySize: 14 });
  }

  // 4. Phases timeline
  {
    const s = newSlide("Nyaya Content", U2.section, "Topic 1 · Five phases in the development of IEL");
    const ph = [
      ["Phase 1", "Before 1945", "Bilateral, use-based treaties", ["1902 Birds useful to agriculture", "1909 Boundary Waters Treaty (US–Canada)", "1933 London Convention (fauna & flora)", "1941 Trail Smelter award"]],
      ["Phase 2", "1945–1972", "UN era, sector treaties", ["1946 Whaling Convention", "1949 Corfu Channel (ICJ)", "1954 OILPOL (oil at sea)", "1957 Lac Lanoux award"]],
      ["Phase 3", "1972–1992", "Stockholm to Rio: modern IEL", ["1972 Stockholm, UNEP", "1971 Ramsar · 1973 CITES", "1982 UNCLOS · 1985 Vienna", "1987 Montreal; Brundtland"]],
      ["Phase 4", "1992–2002", "Sustainable development", ["1992 Rio: Declaration, Agenda 21", "UNFCCC & CBD", "1997 Kyoto; Earth Summit+5", "2002 Johannesburg (WSSD)"]],
      ["Phase 5", "2002 onwards", "Implementation & rights", ["2012 Rio+20 · 2015 SDGs", "2015 Paris Agreement", "2022 UNGA: right to a healthy environment", "2025 ICJ climate opinion"]],
    ];
    const cw = (W - 2 * M - 0.4) / 5;
    s.addShape(pres.shapes.LINE, { x: M, y: 2.05, w: W - 2 * M, h: 0, line: { color: YEL, width: 4, endArrowType: "triangle" } });
    ph.forEach(([p, yrs, theme, items], i) => {
      const x = M + i * (cw + 0.1);
      s.addShape(pres.shapes.OVAL, { x: x + cw / 2 - 0.2, y: 1.85, w: 0.4, h: 0.4, fill: { color: i === 2 ? RED : SLATE }, line: { color: WHITE, width: 2 } });
      txt(s, p.toUpperCase(), { x, y: 1.4, w: cw, h: 0.35, fontSize: 13, bold: true, color: GOLD, align: "center", charSpacing: 1 });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.45, w: cw, h: 4.2, fill: { color: i === 2 ? YEL : CARD }, line: { type: "none" }, rectRadius: 0.1 });
      txt(s, [{ text: yrs, options: { bold: true, fontSize: 20, fontFace: "Cambria", breakLine: true } }, { text: theme, options: { bold: true, fontSize: 14, color: i === 2 ? SLATE : TEAL } }], { x: x + 0.15, y: 2.6, w: cw - 0.3, h: 1.1 });
      txt(s, items.map((t, j) => ({ text: t, options: { bullet: { indent: 12 }, breakLine: j < items.length - 1, paraSpaceAfter: 6 } })), { x: x + 0.15, y: 3.75, w: cw - 0.3, h: 2.8, fontSize: 13 });
    });
  }

  // 5. Landmark international cases
  {
    const s = newSlide("Nyaya Content", U2.section, "Topic 1 · Cases that built international environmental law");
    rowTable(s, {
      x: M, y: 1.55, colW: [3.6, 1.6, 6.93], rowH: 0.78, fontSize: 14,
      header: ["Case", "Year", "Principle it established"],
      rows: [
        ["Trail Smelter (USA v Canada), arbitration", "1938/41", "No state may use its territory to cause serious harm to another state: the no-harm rule"],
        ["Corfu Channel (UK v Albania), ICJ", "1949", "Duty not to knowingly allow one’s territory to be used against other states"],
        ["Lac Lanoux (Spain v France), arbitration", "1957", "Shared resources: duty to inform, consult and negotiate in good faith"],
        ["Gabčíkovo–Nagymaros (Hungary/Slovakia), ICJ", "1997", "ICJ recognises the concept of sustainable development"],
        ["Pulp Mills (Argentina v Uruguay), ICJ", "2010", "Environmental Impact Assessment is a duty under general international law"],
      ],
    });
    txt(s, [{ text: "Tip: ", options: { bold: true, color: GOLD } }, { text: "quote at least two of these cases in any long answer on the history or principles of IEL." }], { x: M, y: 6.3, w: W - 2 * M, h: 0.4, fontSize: 14, color: MUTED });
  }

  // 6. Sources: hard law vs soft law
  {
    const s = newSlide("Nyaya Content", U2.section, "Topic 1 · Sources of IEL: hard law and soft law");
    box(s, 4.67, 1.5, 4.0, 0.8, SLATE, "Art 38(1), Statute of the ICJ", { color: WHITE, bold: true, fs: 17 });
    arrow(s, 5.6, 2.3, 3.2, 2.9); arrow(s, 7.73, 2.3, 10.1, 2.9);
    await card(s, { x: M, y: 2.95, w: 5.9, h: 2.6, head: "Hard law (binding)", body: ["Treaties: UNFCCC, CBD, Ramsar, Montreal Protocol", "Customary law: e.g., the no-harm rule", "General principles of law", "Judicial decisions & writings (subsidiary)"], ic: "FaGavel" });
    await card(s, { x: 6.83, y: 2.95, w: 5.9, h: 2.6, head: "Soft law (not binding, but influential)", body: ["Declarations: Stockholm 1972, Rio 1992", "Agenda 21, Brundtland Report", "UNGA resolutions, COP decisions", "Often becomes hard law later"], ic: "FaFeather", iconFill: TEAL, iconColor: "white", headColor: TEAL });
    box(s, M, 5.8, W - 2 * M, 0.75, CARD2, "Path: soft-law declaration → treaty → custom → applied by courts (e.g., precaution: Rio P15 → treaties → Vellore 1996)", { fs: 15 });
  }

  // ===== TOPIC 2 =====
  // 7. Principles wheel
  {
    const s = newSlide("Nyaya Content", U2.section, "Topic 2 · Ten fundamental principles of IEL");
    const cx = 6.67, cy = 4.05, R = 2.35;
    s.addShape(pres.shapes.OVAL, { x: cx - 1.15, y: cy - 1.15, w: 2.3, h: 2.3, fill: { color: SLATE }, line: { type: "none" } });
    txt(s, "Principles of IEL", { x: cx - 1.0, y: cy - 0.6, w: 2.0, h: 1.2, fontSize: 18, bold: true, color: WHITE, align: "center", valign: "middle", fontFace: "Cambria" });
    const P = ["1 Sovereignty & no-harm", "2 Prevention", "3 Precaution", "4 Polluter pays", "5 Sustainable development", "6 Intergenerational equity", "7 CBDR", "8 Cooperation & notification", "9 EIA", "10 Public participation"];
    P.forEach((t, i) => {
      const a = -Math.PI / 2 + i * (2 * Math.PI / P.length);
      const bx = cx + Math.cos(a) * 4.55, by = cy + Math.sin(a) * (R - 0.05);
      const w = 2.75, h = 0.62;
      s.addShape(pres.shapes.LINE, { x: Math.min(cx + Math.cos(a) * 1.15, bx), y: Math.min(cy + Math.sin(a) * 1.15, by), w: Math.abs(bx - (cx + Math.cos(a) * 1.15)) || 0.001, h: Math.abs(by - (cy + Math.sin(a) * 1.15)) || 0.001, flipH: bx < cx + Math.cos(a) * 1.15, flipV: by < cy + Math.sin(a) * 1.15, line: { color: CARD2, width: 2 } });
      box(s, bx - w / 2, by - h / 2, w, h, i % 2 ? CARD : YEL, t, { fs: 14, bold: true });
    });
  }

  // 8. Sovereignty & no-harm + Prevention
  {
    const s = newSlide("Nyaya Content", U2.section, "Principles 1–2 · Sovereignty, no-harm and prevention");
    const q = s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.55, w: W - 2 * M, h: 1.55, fill: { color: CARD2 }, line: { type: "none" }, rectRadius: 0.1 });
    txt(s, [{ text: "Stockholm Principle 21 / Rio Principle 2: ", options: { bold: true, color: GOLD } }, { text: "States have the sovereign right to exploit their own resources … and the responsibility to ensure that activities within their jurisdiction or control do not cause damage to the environment of other States or of areas beyond national jurisdiction.", options: { italic: true } }],
      { x: M + 0.3, y: 1.55, w: W - 2 * M - 0.6, h: 1.55, fontSize: 15, valign: "middle" });
    // balance diagram
    box(s, M, 3.4, 3.6, 1.0, YEL, "Sovereign RIGHT\nto use resources", { bold: true });
    box(s, M, 4.6, 3.6, 1.0, SLATE, "RESPONSIBILITY\nnot to harm others", { bold: true, color: WHITE });
    txt(s, "⚖", { x: 4.3, y: 3.9, w: 0.8, h: 1.0, fontSize: 40, align: "center", valign: "middle", color: GOLD });
    await card(s, { x: 5.3, y: 3.4, w: 3.6, h: 3.2, head: "No-harm rule", body: ["Root: Trail Smelter (1941)", "Corfu Channel (1949)", "Now customary international law"], ic: "FaShieldHalved", bodySize: 14 });
    await card(s, { x: 9.13, y: 3.4, w: 3.6, h: 3.2, head: "Prevention", body: ["Stop harm before it happens; repair is costly or impossible", "Duty of due diligence", "Pulp Mills (2010)"], ic: "FaHandshake", iconFill: TEAL, iconColor: "white", headColor: TEAL, bodySize: 14 });
    txt(s, "Both are two sides of one idea: freedom to develop, but not at a neighbour’s cost.", { x: M, y: 5.8, w: 4.4, h: 0.8, fontSize: 14, italic: true, color: MUTED });
  }

  // 9. Prevention vs Precaution + Precaution
  {
    const s = newSlide("Nyaya Content", U2.section, "Principle 3 · The precautionary principle");
    box(s, M, 1.5, W - 2 * M, 1.3, YEL, "Rio Principle 15: “Where there are threats of serious or irreversible damage, lack of full scientific certainty shall not be used as a reason for postponing cost-effective measures to prevent environmental degradation.”", { fs: 16, align: "left" });
    rowTable(s, {
      x: M, y: 3.05, colW: [2.6, 4.77, 4.76], rowH: 0.62, fontSize: 14,
      header: ["Point", "Prevention", "Precaution"],
      rows: [
        ["Risk is…", "Known and certain", "Uncertain but serious"],
        ["Science", "Harm is proven", "Full proof not yet available"],
        ["Burden of proof", "On the one alleging harm", "Shifts to the one who wants to act"],
        ["Example", "Pulp Mills (2010): EIA duty", "Montreal Protocol, Cartagena Protocol; India: Vellore (1996), AP PCB v Nayudu (1999)"],
      ],
    });
  }

  // 10. Polluter pays + Sustainable development
  {
    const s = newSlide("Nyaya Content", U2.section, "Polluter pays and sustainable development");
    // flow diagram for PPP
    txt(s, "POLLUTER PAYS (Rio Principle 16)", { x: M, y: 1.5, w: 6, h: 0.4, fontSize: 15, bold: true, color: GOLD, charSpacing: 1 });
    box(s, M, 2.0, 1.7, 1.0, SLATE, "Polluter", { color: WHITE, bold: true });
    arrow(s, M + 1.73, 2.5, M + 2.12, 2.5);
    box(s, M + 2.15, 2.0, 1.7, 1.0, CARD, "Pays cost of pollution");
    arrow(s, M + 3.88, 2.5, M + 4.27, 2.5);
    box(s, M + 4.3, 2.0, 1.7, 1.0, YEL, "Victims + restoration", { bold: true });
    txt(s, ["Origin: OECD recommendation, 1972 (economic tool)", "Internalise environmental costs; not a ‘licence to pollute’", "India: Indian Council for Enviro-Legal Action (1996)"].map((t, j, a) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < a.length - 1, paraSpaceAfter: 6 } })), { x: M, y: 3.2, w: 6.3, h: 2.4, fontSize: 14 });
    // SD three pillars
    txt(s, "SUSTAINABLE DEVELOPMENT", { x: 7.13, y: 1.5, w: 5.6, h: 0.4, fontSize: 15, bold: true, color: TEAL, charSpacing: 1 });
    const pil = [["Economic", "FaCoins"], ["Social", "FaPeopleGroup"], ["Environmental", "FaLeaf"]];
    s.addShape(pres.shapes.RECTANGLE, { x: 7.13, y: 2.0, w: 5.6, h: 0.35, fill: { color: SLATE }, line: { type: "none" } });
    txt(s, "SUSTAINABLE DEVELOPMENT", { x: 7.13, y: 2.0, w: 5.6, h: 0.35, fontSize: 13, bold: true, color: WHITE, align: "center", valign: "middle", charSpacing: 2 });
    for (let i = 0; i < 3; i++) {
      const x = 7.33 + i * 1.8;
      s.addShape(pres.shapes.RECTANGLE, { x, y: 2.35, w: 1.4, h: 2.0, fill: { color: i === 2 ? TEAL : CARD }, line: { type: "none" } });
      s.addImage({ data: await icon(pil[i][1], i === 2 ? "white" : "slate"), x: x + 0.45, y: 2.55, w: 0.5, h: 0.5, altText: pil[i][0] });
      txt(s, pil[i][0], { x, y: 3.2, w: 1.4, h: 0.9, fontSize: 13, bold: true, align: "center", valign: "middle", color: i === 2 ? WHITE : SLATE });
    }
    s.addShape(pres.shapes.RECTANGLE, { x: 7.13, y: 4.35, w: 5.6, h: 0.25, fill: { color: SLATE }, line: { type: "none" } });
    txt(s, ["Brundtland (1987): meets present needs without compromising future generations", "Rio Principles 3 & 4; Johannesburg 2002: three pillars", "Gabčíkovo–Nagymaros (ICJ, 1997)"].map((t, j, a) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < a.length - 1, paraSpaceAfter: 6 } })), { x: 7.13, y: 4.75, w: 5.6, h: 1.9, fontSize: 14 });
  }

  // 11. Intergenerational equity + CBDR
  {
    const s = newSlide("Nyaya Content", U2.section, "Principles 6–7 · Intergenerational equity and CBDR");
    txt(s, "INTERGENERATIONAL EQUITY", { x: M, y: 1.5, w: 6, h: 0.4, fontSize: 15, bold: true, color: GOLD, charSpacing: 1 });
    const gens = [["Past", "received the Earth"], ["Present", "holds it in trust"], ["Future", "has an equal claim"]];
    gens.forEach(([h, b], i) => {
      const x = M + i * 2.05;
      box(s, x, 2.0, 1.75, 1.2, i === 1 ? YEL : CARD, `${h}\n${b}`, { fs: 14, bold: i === 1 });
      if (i < 2) arrow(s, x + 1.78, 2.6, x + 2.02, 2.6);
    });
    txt(s, ["Rio Principle 3; Stockholm Principle 1", "Edith Brown Weiss, In Fairness to Future Generations (1989)", "India: State of HP v Ganesh Wood Products (1995)"].map((t, j, a) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < a.length - 1, paraSpaceAfter: 6 } })), { x: M, y: 3.5, w: 6.0, h: 2.2, fontSize: 14 });
    txt(s, "CBDR (Rio Principle 7)", { x: 7.13, y: 1.5, w: 5.6, h: 0.4, fontSize: 15, bold: true, color: TEAL, charSpacing: 1 });
    box(s, 7.13, 2.0, 5.6, 0.8, SLATE, "COMMON responsibility: all states must protect the environment", { color: WHITE, bold: true, fs: 14 });
    arrow(s, 8.5, 2.8, 8.5, 3.15); arrow(s, 11.4, 2.8, 11.4, 3.15);
    box(s, 7.13, 3.2, 2.7, 1.3, YEL, "Developed states\ncaused more, can pay more → lead", { fs: 14 });
    box(s, 10.03, 3.2, 2.7, 1.3, CARD, "Developing states\nneed time, finance, technology", { fs: 14 });
    txt(s, ["UNFCCC Art 3(1); Kyoto: binding targets only for Annex I", "Paris 2015: “CBDR and respective capabilities, in the light of different national circumstances”"].map((t, j, a) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < a.length - 1, paraSpaceAfter: 6 } })), { x: 7.13, y: 4.75, w: 5.6, h: 1.9, fontSize: 14 });
  }

  // 12. Cooperation, EIA, Participation
  {
    const s = newSlide("Nyaya Content", U2.section, "Cooperation, EIA and public participation");
    await card(s, { x: M, y: 1.6, w: 3.9, h: 4.95, head: "8 · Cooperation & notification", body: ["Duty to cooperate in good faith", "Notify neighbours of emergencies and of projects with transboundary effects", "Rio Principles 18 & 19", "Case: Lac Lanoux (1957)"], ic: "FaHandshake" });
    await card(s, { x: 4.72, y: 1.6, w: 3.9, h: 4.95, head: "9 · Environmental Impact Assessment", body: ["Assess harm before approving a project", "Rio Principle 17", "Pulp Mills (ICJ 2010): EIA is required under general international law", "India: EIA Notification 2006 (under EPA)"], ic: "FaMagnifyingGlass", iconFill: TEAL, iconColor: "white", headColor: TEAL });
    await card(s, { x: 8.83, y: 1.6, w: 3.9, h: 4.95, head: "10 · Public participation", body: ["Access to information, participation in decisions, access to justice", "Rio Principle 10", "Aarhus Convention 1998 (Europe)", "India: PIL, public hearings in EIA, NGT"], ic: "FaUsers" });
  }

  // 13. Indian adoption table
  {
    const s = newSlide("Nyaya Content", U2.section, "Topic 2 · How Indian courts adopted these principles");
    rowTable(s, {
      x: M, y: 1.55, colW: [3.3, 5.0, 3.83], rowH: 0.6, fontSize: 14,
      header: ["International principle", "Indian case", "Year"],
      rows: [
        ["Sustainable development", "Vellore Citizens’ Welfare Forum v UoI", "1996"],
        ["Precautionary principle", "Vellore (1996); AP Pollution Control Board v M.V. Nayudu", "1996 / 1999"],
        ["Polluter pays", "Indian Council for Enviro-Legal Action v UoI", "1996"],
        ["Intergenerational equity", "State of HP v Ganesh Wood Products", "1995"],
        ["Public trust", "M.C. Mehta v Kamal Nath", "1997"],
        ["Absolute liability", "M.C. Mehta v UoI (Oleum gas leak)", "1987"],
      ],
    });
    txt(s, [{ text: "Link: ", options: { bold: true, color: GOLD } }, { text: "Vellore held that these principles are part of the law of the land under Arts 21, 47, 48A and 51A(g)." }], { x: M, y: 6.2, w: W - 2 * M, h: 0.45, fontSize: 14, color: MUTED });
  }

  // 14. Exam questions
  pres.addSection({ title: "Exam questions" });
  {
    const s = newSlide("Nyaya Content", "Exam questions", "Semester exam questions · Unit II, topics 1–2");
    const longQs = [
      "Trace the history and development of environmental protection under international law.",
      "Explain the fundamental principles of international environmental law.",
      "Discuss the precautionary and polluter pays principles and their adoption by Indian courts.",
      "“Sustainable development is the core of international environmental law.” Discuss.",
      "Examine the role of international judicial decisions in the growth of international environmental law.",
    ];
    const shortQs = ["Trail Smelter Arbitration", "No-harm principle (Stockholm Principle 21)", "Common but differentiated responsibilities", "Intergenerational equity", "Soft law in IEL"];
    const colW = (W - 2 * M - 0.25) / 2;
    [["LONG ANSWER QUESTIONS", longQs, SLATE, CARD], ["SHORT ANSWER QUESTIONS", shortQs, TEAL, CARD2]].forEach(([label, qs, tagFill, bg], c) => {
      const x = M + c * (colW + 0.25);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.55, w: colW, h: 5.0, fill: { color: bg }, line: { type: "none" }, rectRadius: 0.1 });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.25, y: 1.72, w: 3.3, h: 0.42, fill: { color: tagFill }, line: { type: "none" }, rectRadius: 0.06 });
      txt(s, label, { x: x + 0.25, y: 1.72, w: 3.3, h: 0.42, fontSize: 12, bold: true, color: WHITE, align: "center", valign: "middle", charSpacing: 1 });
      txt(s, qs.map((q, i) => ({ text: q, options: { bullet: { type: "number" }, breakLine: i < qs.length - 1, paraSpaceAfter: 10 } })), { x: x + 0.3, y: 2.35, w: colW - 0.55, h: 4.05, fontSize: 15 });
    });
  }

  const out = process.argv[2] || "unit2.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("wrote", out);
}
function y0(v) { return v; }
build().catch((e) => { console.error(e); process.exit(1); });
