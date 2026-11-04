// Nyaya Patashala. Builds "Environmental Laws — Decoded" (LL.B 3YDC Sem I, Paper V, Kakatiya University).
// Usage: NODE_PATH=<dir with pptxgenjs, react-icons, react, react-dom, sharp> node build_deck.js <out.pptx>
// Then: python3 animate.py <out.pptx> (adds transitions + entrance animations).
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
pres.title = "Environmental Laws — Decoded";
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
async function build() {
  // ---------------- 1. Title ----------------
  pres.addSection({ title: "Opening" });
  {
    const s = newSlide("Nyaya Title", "Opening", null);
    const k = next("f", "kicker");
    txt(s, "PAPER V  ·  LL.B (3YDC)  ·  SEMESTER I", { x: M, y: 1.45, w: 7.6, h: 0.4, fontSize: 16, bold: true, color: GOLD, charSpacing: 3 }, k);
    s.addText("Environmental Laws — Decoded", { placeholder: "title" });
    s.addText("All five units of the Kakatiya University syllabus: concepts, treaties, the Constitution, the courts, the statutes, and forests and wildlife", { placeholder: "body" });
    const nm = next("z", "hero");
    s.addImage({ path: EMBLEM, x: 8.55, y: 1.15, w: 4.2, h: 4.2, objectName: nm + "_logo", altText: "Nyaya Patashala logo" });
    s.addNotes(
      "[VOICE ANCHOR: warm, unhurried, smile in the voice]\n" +
      "Welcome to Nyaya Patashala [NYAA-ya Paa-TA-shaa-la]. Every river you drink from, every breath you take in a city — somewhere behind it, there is a law. " +
      "This is Paper Five of your first semester: Environmental Laws. In one sitting, we will decode all five units — " +
      "what the environment means, how the world built a rulebook to protect it, how our Constitution and our courts turned that rulebook into rights, " +
      "the three pollution Acts every law student must know, and finally the laws on forests, wildlife and biodiversity. Keep a notebook open. Let us begin."
    );
  }

  // ---------------- 2. Paper at a glance ----------------
  {
    const s = newSlide("Nyaya Content", "Opening", "The paper at a glance");
    const stats = [
      ["100", "Total marks", "Theory paper"],
      ["80 | 20", "External | Internal", "University exam + internal assessment"],
      ["6 hrs", "Per week", "Theory teaching load"],
      ["5", "Units", "Concepts → treaties → Constitution → statutes → forests & wildlife"],
    ];
    const cw = 2.85, gap = 0.233;
    stats.forEach(([big, lab, small], i) => {
      const x = M + i * (cw + gap);
      const nm = next("z", "stat" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.75, w: cw, h: 3.0, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
      txt(s, big, { x: x + 0.2, y: 2.0, w: cw - 0.4, h: 1.2, fontSize: 54, bold: true, color: GOLD, align: "center", valign: "middle", fontFace: "Cambria" }, nm + "_n");
      txt(s, lab, { x: x + 0.2, y: 3.25, w: cw - 0.4, h: 0.45, fontSize: 18, bold: true, align: "center" }, nm + "_l");
      txt(s, small, { x: x + 0.2, y: 3.75, w: cw - 0.4, h: 0.8, fontSize: 14, color: MUTED, align: "center" }, nm + "_s");
    });
    const nm = next("f", "tip");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.15, w: W - 2 * M, h: 1.3, fill: { color: CARD2 }, line: { type: "none" }, rectRadius: 0.12, objectName: nm + "_bg" });
    s.addImage({ data: await icon("FaLightbulb", "yellow"), x: M + 0.3, y: 5.5, w: 0.6, h: 0.6, objectName: nm + "_i", altText: "Tip" });
    txt(s, [
      { text: "How to score: ", options: { bold: true, color: GOLD } },
      { text: "every answer in this paper rests on three things: the provision (Article or Section), the leading case, and the principle the court laid down. This video gives you all three for every topic." },
    ], { x: M + 1.15, y: 5.3, w: W - 2 * M - 1.4, h: 1.0, fontSize: 16, valign: "middle" }, nm + "_t");
    s.addNotes(
      "[VOICE ANCHOR: clear, practical]\n" +
      "First, the paper itself. It is a theory paper of one hundred marks, eighty external and twenty internal, taught six hours a week. " +
      "Five units. Write this down — every good answer in environmental law stands on three legs: the provision, the leading case, and the principle the court laid down. " +
      "For every topic today, I will give you all three."
    );
  }

  // ---------------- 3. Roadmap ----------------
  {
    const s = newSlide("Nyaya Content", "Opening", "Your five-unit roadmap");
    const units = [
      ["I", "The concepts", "Meaning of environment, Indian tradition, ecology, pollution, ozone, climate change", "FaEarthAsia"],
      ["II", "The global rulebook", "Ramsar 1971 → Stockholm 1972 → Brundtland → Rio 1992 → Kyoto → MDGs → Johannesburg 2002", "FaGlobe"],
      ["III", "Constitution, courts & torts", "42nd Amendment, Art 21/14/19, PIL, SD, precaution, polluter pays, liability, public trust, BNS/BNSS", "FaLandmark"],
      ["IV", "The statute book", "Water Act 1974, Air Act 1981, Environment (Protection) Act 1986, environment tribunals", "FaBookOpen"],
      ["V", "Forests, wildlife & biodiversity", "Forest Acts 1927 & 1980, Wild Life Act 1972, Biological Diversity Act 2002, NGT appraisal", "FaTree"],
    ];
    const cw = 2.27, gap = 0.195;
    for (let i = 0; i < 5; i++) {
      const [n, h, b, ic] = units[i];
      const x = M + i * (cw + gap);
      const nm = next("u", "unit" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: cw, h: 4.95, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
      await iconCircle(s, ic, x + 0.2, 1.9, 0.7, YEL, "slate", nm);
      txt(s, "UNIT " + n, { x: x + 1.0, y: 1.9, w: cw - 1.1, h: 0.7, fontSize: 20, bold: true, color: GOLD, valign: "middle", fontFace: "Cambria" }, nm + "_u");
      txt(s, h, { x: x + 0.2, y: 2.85, w: cw - 0.4, h: 0.9, fontSize: 17, bold: true }, nm + "_h");
      txt(s, b, { x: x + 0.2, y: 3.85, w: cw - 0.4, h: 2.5, fontSize: 14, color: MUTED }, nm + "_b");
    }
    s.addNotes(
      "[VOICE ANCHOR: confident, steady pace]\n" +
      "Here is the map. Unit One gives you the vocabulary — environment, ecology, pollution, ozone and climate. " +
      "Unit Two is the global rulebook, from Ramsar [Raam-SAAR] in nineteen seventy-one to Johannesburg in two thousand two. " +
      "Unit Three is the heart of the paper: the Constitution, the courts, and the law of torts. " +
      "Unit Four is the statute book: the Water Act, the Air Act and the Environment Protection Act. And Unit Five protects living nature: forests, wildlife and biodiversity, with an appraisal of the NGT. Let us open Unit One."
    );
  }

  // ================= UNIT I =================
  const U1 = { section: "Unit I: Concepts", num: "I" };
  pres.addSection({ title: U1.section });
  await divider(U1, "Environment: meaning, tradition and threats", "What the environment is, how India protected it, and what endangers it",
    ["Meaning, Definition and Concept of Environment", "Environmental Protection in Ancient Indian Tradition and Culture", "Protection of Environment in Ancient India and During Medieval Period", "Components of Environment", "Biosphere and Ecosystem", "Ecology", "Types of Environment", "Concept of Pollution", "Sources of Pollution, Types of Pollution, and Effects of Pollution", "Ozone Depletion", "Global Warming", "Climate Change"], "FaEarthAsia",
    "[VOICE ANCHOR: lower, deliberate]\nUnit One. Before we study any law, we must know what that law protects. So — what exactly is the environment?");

  await unitQuestions(U1, ["Define environment. Explain its meaning, concept and components.", "Discuss environmental protection in ancient Indian tradition and culture and during the medieval period.", "Explain biosphere, ecosystem and ecology, and the types of environment.", "What is pollution? Discuss its sources, types and effects.", "Discuss ozone depletion, global warming and climate change."], ["Define “environment” under the EPA, 1986.", "What is an ecosystem?", "Distinguish between biotic and abiotic components.", "What is ozone depletion?", "What is global warming?"]);

  // 5. Meaning & definition
  {
    const s = newSlide("Nyaya Content", U1.section, "What is “environment”?");
    const nm = next("f", "quote");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.6, w: 6.6, h: 3.75, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
    s.addImage({ data: await icon("FaQuoteLeft", "yellow"), x: M + 0.3, y: 1.85, w: 0.55, h: 0.55, objectName: nm + "_q", altText: "Quote" });
    txt(s, "“Environment” includes water, air and land and the inter-relationship which exists among and between water, air and land, and human beings, other living creatures, plants, micro-organism and property.",
      { x: M + 0.3, y: 2.55, w: 6.0, h: 2.1, fontSize: 18, italic: true }, nm + "_t");
    txt(s, "Section 2(a), Environment (Protection) Act, 1986", { x: M + 0.3, y: 4.7, w: 6.0, h: 0.4, fontSize: 14, bold: true, color: GOLD }, nm + "_src");
    const n2 = next("f", "etym");
    txt(s, [
      { text: "Origin of the word: ", options: { bold: true, color: GOLD } },
      { text: "French “environner”, to surround. The definition is inclusive (“includes”), so courts can read it widely." },
    ], { x: M, y: 5.6, w: 6.6, h: 0.9, fontSize: 15, color: MUTED }, n2);
    // spheres
    const cx = 10.05, cy = 3.95;
    const nc = next("z", "core");
    s.addShape(pres.shapes.OVAL, { x: cx - 0.95, y: cy - 0.95, w: 1.9, h: 1.9, fill: { color: YEL }, line: { type: "none" }, objectName: nc + "_c" });
    txt(s, "Environ-\nment", { x: cx - 0.95, y: cy - 0.95, w: 1.9, h: 1.9, fontSize: 17, bold: true, color: SLATE, align: "center", valign: "middle" }, nc + "_t");
    const sph = [["Lithosphere", "land", "FaMountain", 0, -1.85], ["Hydrosphere", "water", "FaDroplet", 1.95, 0], ["Atmosphere", "air", "FaWind", 0, 1.85], ["Biosphere", "life", "FaSeedling", -1.95, 0]];
    for (const [h, b, ic, dx, dy] of sph) {
      const ns = next("z", h);
      const x = cx + dx - 0.8, y = cy + dy - 0.62;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.6, h: 1.24, fill: { color: CARD2 }, line: { color: TEAL, width: 1.5 }, rectRadius: 0.1, objectName: ns + "_bg" });
      s.addImage({ data: await icon(ic, "teal"), x: x + 0.57, y: y + 0.1, w: 0.46, h: 0.46, objectName: ns + "_i", altText: h });
      txt(s, [{ text: h, options: { bold: true, breakLine: true, fontSize: 14 } }, { text: b, options: { color: MUTED, fontSize: 14 } }], { x, y: y + 0.58, w: 1.6, h: 0.62, align: "center" }, ns + "_t");
    }
    s.addNotes(
      "[VOICE ANCHOR: precise, slower on the definition]\n" +
      "The statutory definition comes from Section two-A of the Environment Protection Act, nineteen eighty-six. Read it slowly. " +
      "Environment includes water, air and land — and the inter-relationship among them, and with human beings, other living creatures, plants, micro-organisms and property. " +
      "Notice two things. The word is **includes**, so the definition is open-ended. And it protects relationships, not just objects. " +
      "On the right, the four spheres: lithosphere, hydrosphere, atmosphere and biosphere. When any one is disturbed, the others feel it."
    );
  }

  // 6. Tradition timeline
  {
    const s = newSlide("Nyaya Content", U1.section, "Protection in Indian tradition: ancient to medieval");
    const items = [
      ["Vedic age", "Atharva Veda, Prithvi Sukta: “Earth is my mother, I am her son”. Nature treated as sacred.", "FaScroll"],
      ["Kautilya", "Arthashastra: a superintendent of forests; fines for cutting trees and harming protected animals.", "FaBook"],
      ["Emperor Ashoka", "Pillar Edict V lists protected creatures and forbids burning forests needlessly.", "FaBuildingColumns"],
      ["Medieval period", "Gardens, canals and royal hunting reserves; village commons managed by custom.", "FaTree"],
      ["Khejarli, 1730", "Amrita Devi and 363 Bishnois gave their lives to save khejri trees.", "FaHandFist"],
    ];
    const lineY = 3.55;
    const nl = next("w", "axis");
    s.addShape(pres.shapes.LINE, { x: M + 0.3, y: lineY, w: W - 2 * M - 0.6, h: 0, line: { color: MUTED, width: 2 }, objectName: nl });
    const step = (W - 2 * M) / items.length;
    for (let i = 0; i < items.length; i++) {
      const [h, b, ic] = items[i];
      const cx = M + step * (i + 0.5);
      const nm = next("u", "t" + i);
      await iconCircle(s, ic, cx - 0.45, lineY - 0.45, 0.9, YEL, "slate", nm);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx - step / 2 + 0.08, y: 4.25, w: step - 0.16, h: 2.4, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow(), objectName: nm + "_bg" });
      txt(s, [{ text: h, options: { bold: true, color: GOLD, fontSize: 17, breakLine: true } }, { text: b, options: { fontSize: 14 } }],
        { x: cx - step / 2 + 0.25, y: 4.4, w: step - 0.5, h: 2.15 }, nm + "_t");
    }
    const nn = next("f", "lesson");
    txt(s, [{ text: "Exam angle: ", options: { bold: true, color: GOLD } }, { text: "courts cite this ethic. Article 51A(g) asks every citizen for “compassion for living creatures”, an idea far older than the Constitution." }],
      { x: M, y: 1.55, w: W - 2 * M, h: 1.0, fontSize: 16, color: MUTED }, nn);
    s.addNotes(
      "[VOICE ANCHOR: storytelling, warm]\n" +
      "Environmental protection in India did not begin in nineteen seventy-two. The Atharva Veda's Prithvi Sukta [Pri-THVEE SOOK-ta] says — Earth is my mother, and I am her son. " +
      "Kautilya's Arthashastra [Ar-tha-SHAAS-tra] provided for a superintendent of forests, and prescribed fines for cutting trees. " +
      "Ashoka's Pillar Edict Five lists protected creatures and forbids burning forests needlessly. " +
      "In the medieval period, gardens, canals and hunting reserves were managed, and village commons were governed by custom. " +
      "And in seventeen thirty, at Khejarli [Khay-JAR-lee], Amrita Devi and three hundred and sixty-three Bishnois [BISH-noy] gave their lives to save khejri trees. " +
      "In an answer, use this to show that Article fifty-one-A-g codified an old Indian ethic."
    );
  }

  // 7. Components, ecosystem, types
  {
    const s = newSlide("Nyaya Content", U1.section, "Components, biosphere, ecosystem and ecology");
    await card(s, { x: M, y: 1.6, w: 3.9, h: 2.35, head: "Abiotic (non-living)", body: ["Air, water, soil, minerals", "Sunlight, temperature, rainfall"], ic: "FaSun" });
    await card(s, { x: M, y: 4.15, w: 3.9, h: 2.4, head: "Biotic (living)", body: ["Producers: green plants", "Consumers: animals, humans", "Decomposers: bacteria, fungi"], ic: "FaSeedling", iconFill: TEAL, iconColor: "white" });
    const defs = [
      ["Biosphere", "The thin zone of the Earth (land, water and air) where life exists."],
      ["Ecosystem", "A community of organisms interacting with its non-living surroundings. Term: A.G. Tansley, 1935."],
      ["Ecology", "The science of those interactions. Term coined by Ernst Haeckel, 1866."],
    ];
    for (let i = 0; i < 3; i++) {
      await card(s, { x: 4.75, y: 1.6 + i * 1.02, w: 4.3, h: 0.92, head: null, body: null, eff: "w", label: "def" + i });
      // overwrite text inside that card
      txt(s, [{ text: defs[i][0] + ": ", options: { bold: true, color: GOLD } }, { text: defs[i][1] }], { x: 4.95, y: 1.6 + i * 1.02, w: 3.95, h: 0.92, fontSize: 14, valign: "middle" }, same("w", "def" + i) + "_x");
    }
    await card(s, { x: 9.25, y: 1.6, w: 3.48, h: 4.95, head: "Types of environment", body: ["Natural: physical (land, water, air) and biological (plants, animals)", "Man-made: buildings, cities, dams, industry", "Social: cultural, economic and political setting of human life"], ic: "FaCity", eff: "u" });
    const nb = next("f", "chain");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.75, y: 4.75, w: 4.3, h: 1.8, fill: { color: CARD2 }, line: { type: "none" }, rectRadius: 0.1, objectName: nb + "_bg" });
    txt(s, [{ text: "Energy flow", options: { bold: true, color: GOLD, breakLine: true } }, { text: "Sun → producers → herbivores → carnivores → decomposers return nutrients to the soil." }],
      { x: 4.95, y: 4.9, w: 3.9, h: 1.5, fontSize: 14 }, nb + "_t");
    s.addNotes(
      "[VOICE ANCHOR: teacherly, measured]\n" +
      "The environment has two components. Abiotic — the non-living: air, water, soil, sunlight. And biotic — the living: producers, consumers and decomposers. " +
      "Three definitions you must not mix up. The biosphere is the zone of the Earth where life exists. " +
      "An ecosystem is a community of organisms interacting with its non-living surroundings — the term comes from A. G. Tansley [TANZ-lee], nineteen thirty-five. " +
      "Ecology is the science of these interactions — a word coined by Ernst Haeckel [HECK-el] in eighteen sixty-six. " +
      "And types of environment: natural, man-made, and social."
    );
  }

  // 8. Pollution
  {
    const s = newSlide("Nyaya Content", U1.section, "Pollution: concept, sources, types, effects");
    await card(s, { x: M, y: 1.6, w: 4.4, h: 2.55, head: "The legal concept", body: ["Pollutant: any solid, liquid or gaseous substance present in a concentration that is, or tends to be, injurious to the environment. Sec 2(b), EPA", "Pollution: the presence of such a pollutant. Sec 2(c), EPA"], ic: "FaScaleBalanced", bodySize: 14 });
    await card(s, { x: M, y: 4.35, w: 4.4, h: 2.2, head: "Sources", body: ["Natural: volcanoes, forest fires, dust storms", "Man-made: industry, vehicles, farms, cities", "Point (one outlet) vs non-point (diffuse runoff)"], ic: "FaIndustry", iconFill: TEAL, iconColor: "white" });
    const types = [["Air", "FaWind"], ["Water", "FaDroplet"], ["Soil / land", "FaMountain"], ["Noise", "FaVolumeHigh"], ["Thermal", "FaTemperatureHigh"], ["Radioactive", "FaRadiation"]];
    const x0 = 5.25, colw = 2.5;
    for (let i = 0; i < 6; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = x0 + col * colw, y = 1.6 + row * 1.45;
      const nm = next("z", "type" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: colw - 0.15, h: 1.3, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow(), objectName: nm + "_bg" });
      await iconCircle(s, types[i][1], x + 0.2, y + 0.3, 0.7, YEL, "slate", nm);
      txt(s, types[i][0], { x: x + 1.05, y, w: colw - 1.25, h: 1.3, fontSize: 17, bold: true, valign: "middle" }, nm + "_t");
    }
    await card(s, { x: x0, y: 4.55, w: 3 * colw - 0.15, h: 2.0, head: "Effects", body: ["Health: respiratory disease, water-borne illness, cancer risk", "Ecology: biodiversity loss, eutrophication, acid rain", "Economy: crop loss, health costs, lost tourism"], ic: "FaHeartPulse", iconFill: RED, iconColor: "white", headColor: RED });
    s.addNotes(
      "[VOICE ANCHOR: crisp]\n" +
      "Now, pollution. In law, start with the Environment Protection Act. Section two-B defines an environmental pollutant — any solid, liquid or gaseous substance in a concentration that is, or tends to be, injurious. " +
      "Section two-C says pollution is simply the presence of such a pollutant. " +
      "Sources can be natural or man-made, and point or non-point. Types: air, water, soil, noise, thermal and radioactive. " +
      "And effects run across three dimensions — health, ecology and the economy. In a long answer, use all three."
    );
  }

  // 9. Ozone & climate
  {
    const s = newSlide("Nyaya Content", U1.section, "Ozone depletion, global warming and climate change");
    // Ozone panel chain
    const nh = next("f", "ozhead");
    txt(s, "OZONE DEPLETION", { x: M, y: 1.55, w: 5.9, h: 0.4, fontSize: 16, bold: true, color: GOLD, charSpacing: 3 }, nh);
    const oz = [["CFCs & halons released", "from refrigerants, aerosols, foams"], ["Chlorine / bromine reach the stratosphere", "ozone layer: about 15–35 km up"], ["Ozone breaks down", "more UV-B reaches the surface"], ["Response", "Vienna 1985 → Montreal 1987 → Kigali 2016 (HFCs)"]];
    for (let i = 0; i < oz.length; i++) {
      const nm = next("w", "oz" + i);
      const y = 2.05 + i * 1.05;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: 5.9, h: 0.9, fill: { color: i === 3 ? CARD2 : CARD }, line: { type: "none" }, rectRadius: 0.1, objectName: nm + "_bg" });
      txt(s, String(i + 1), { x: M + 0.15, y, w: 0.5, h: 0.95, fontSize: 26, bold: true, color: GOLD, valign: "middle", align: "center", fontFace: "Cambria" }, nm + "_n");
      txt(s, [{ text: oz[i][0], options: { bold: true, breakLine: true } }, { text: oz[i][1], options: { color: MUTED } }], { x: M + 0.8, y: y + 0.05, w: 4.95, h: 0.85, fontSize: 15, valign: "middle" }, nm + "_t");
    }
    const nh2 = next("f", "clhead");
    txt(s, "GLOBAL WARMING → CLIMATE CHANGE", { x: 6.85, y: 1.55, w: 5.9, h: 0.4, fontSize: 16, bold: true, color: GOLD, charSpacing: 3 }, nh2);
    const cl = [["Greenhouse gases rise", "CO₂, methane, nitrous oxide, HFCs"], ["Heat is trapped", "average global temperature rises"], ["Climate changes", "sea-level rise, heatwaves, erratic monsoon"], ["Response", "IPCC 1988 → UNFCCC 1992 → Kyoto 1997 → Paris 2015"]];
    for (let i = 0; i < cl.length; i++) {
      const nm = next("w", "cl" + i);
      const y = 2.05 + i * 1.05;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.85, y, w: 5.88, h: 0.9, fill: { color: i === 3 ? CARD2 : CARD }, line: { type: "none" }, rectRadius: 0.1, objectName: nm + "_bg" });
      txt(s, String(i + 1), { x: 7.0, y, w: 0.5, h: 0.95, fontSize: 26, bold: true, color: TEAL, valign: "middle", align: "center", fontFace: "Cambria" }, nm + "_n");
      txt(s, [{ text: cl[i][0], options: { bold: true, breakLine: true } }, { text: cl[i][1], options: { color: MUTED } }], { x: 7.65, y: y + 0.05, w: 4.95, h: 0.85, fontSize: 15, valign: "middle" }, nm + "_t");
    }
    const nt = next("u", "trap");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 6.25, w: W - 2 * M, h: 0.45, fill: { color: RED }, line: { type: "none" }, rectRadius: 0.08, objectName: nt + "_bg" });
    txt(s, "Exam trap: the ozone hole and global warming are different problems. They are linked because CFCs and HFCs are also greenhouse gases.", { color: WHITE, x: M + 0.2, y: 6.25, w: W - 2 * M - 0.4, h: 0.45, fontSize: 14, bold: true, valign: "middle" }, nt + "_t");
    s.addNotes(
      "[VOICE ANCHOR: steady, then emphatic on the trap]\n" +
      "Two global threats close Unit One. On the left, ozone depletion: chlorofluorocarbons rise to the stratosphere, release chlorine, and break down ozone, so more ultraviolet-B reaches us. " +
      "The legal response: the Vienna Convention of nineteen eighty-five, the Montreal Protocol of nineteen eighty-seven, and the Kigali Amendment of twenty sixteen, which targets HFCs. " +
      "On the right, greenhouse gases trap heat, temperatures rise, and the climate changes. The response: the IPCC, the UNFCCC, Kyoto and Paris. " +
      "Now — a common mistake. The ozone hole does not cause global warming. They are different problems, linked only because some of the same gases do both."
    );
  }

  // ================= UNIT II =================
  const U2 = { section: "Unit II: International law", num: "II" };
  pres.addSection({ title: U2.section });
  await divider(U2, "The global rulebook", "How international environmental law was built, conference by conference",
    ["History and Development of Environmental Protection under International Law", "Fundamental Principles of International Environmental Law", "Ramsar Convention, 1971", "United Nations Conference on Human Environment, 1972 (Stockholm Conference)", "Aims and Objectives of the Conference", "Stockholm Declaration, 1972", "Impact of Stockholm, UNEP", "The Brundtland Commission, Brundtland Report 1987", "Rio Declaration, 1992", "Convention on Biological Diversity, 1992", "Earth Summit Plus Five", "Kyoto Protocol, 1997", "Millennium Development Goals", "Johannesburg Conference 2002 (WSSD)", "Johannesburg Declaration & Major Outcomes"], "FaGlobe",
    "[VOICE ANCHOR: lift in energy]\nUnit Two. Pollution does not stop at borders, so the law could not stop there either.");

  await unitQuestions(U2, ["Trace the history and development of environmental protection under international law.", "Explain the fundamental principles of international environmental law.", "Discuss the aims, objectives and impact of the Stockholm Conference, 1972.", "Explain the Rio Declaration, 1992 and the Convention on Biological Diversity, 1992.", "Discuss the Kyoto Protocol, 1997 and the outcomes of the Johannesburg Conference, 2002."], ["Ramsar Convention, 1971", "UNEP", "Brundtland Report, 1987", "Earth Summit Plus Five", "Millennium Development Goals"]);

  // 11. Timeline
  {
    const s = newSlide("Nyaya Content", U2.section, "Thirty years that built international environmental law");
    const nodes = [
      ["1971", "Ramsar", "Wetlands convention"],
      ["1972", "Stockholm", "First UN environment conference; UNEP"],
      ["1987", "Brundtland", "“Our Common Future”; sustainable development"],
      ["1992", "Rio Earth Summit", "Rio Declaration, Agenda 21, CBD, UNFCCC"],
      ["1997", "Kyoto + Rio+5", "Binding emission targets; Agenda 21 review"],
      ["2000", "MDGs", "8 goals; Goal 7 environmental sustainability"],
      ["2002", "Johannesburg", "WSSD (Rio+10); Plan of Implementation"],
    ];
    const lineY = 4.05;
    const na = next("w", "axis");
    s.addShape(pres.shapes.LINE, { x: M, y: lineY, w: W - 2 * M, h: 0, line: { color: YEL, width: 3 }, objectName: na });
    const step = (W - 2 * M) / nodes.length, cw = 2.9;
    nodes.forEach(([yr, h, b], i) => {
      const cx = M + step * (i + 0.5);
      const up = i % 2 === 0;
      const nm = next("u", "n" + yr);
      s.addShape(pres.shapes.OVAL, { x: cx - 0.17, y: lineY - 0.17, w: 0.34, h: 0.34, fill: { color: YEL }, line: { color: SLATE, width: 3 }, objectName: nm + "_dot" });
      let x = Math.min(Math.max(cx - cw / 2, M), W - M - cw);
      const y = up ? 1.55 : 4.5;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: 2.05, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow(), objectName: nm + "_bg" });
      s.addShape(pres.shapes.LINE, { x: cx, y: up ? 3.6 : lineY + 0.17, w: 0, h: up ? lineY - 0.17 - 3.6 : 4.5 - lineY - 0.17, line: { color: YEL, width: 1.5, dashType: "dash" }, objectName: nm + "_stem" });
      txt(s, [{ text: yr, options: { bold: true, color: GOLD, fontSize: 26, fontFace: "Cambria", breakLine: true } }, { text: h, options: { bold: true, fontSize: 17, breakLine: true } }, { text: b, options: { color: MUTED, fontSize: 14 } }],
        { x: x + 0.2, y: y + 0.12, w: cw - 0.4, h: 1.85 }, nm + "_t");
    });
    s.addNotes(
      "[VOICE ANCHOR: rhythmic, one beat per year]\n" +
      "Here is the whole unit on one line. Nineteen seventy-one — Ramsar, for wetlands. Nineteen seventy-two — Stockholm, the first UN environment conference, which created UNEP. " +
      "Nineteen eighty-seven — the Brundtland Report gave us sustainable development. Nineteen ninety-two — the Rio Earth Summit. " +
      "Nineteen ninety-seven — Kyoto, and the Earth Summit plus five review. Two thousand — the Millennium Development Goals. " +
      "Two thousand two — Johannesburg. **Write this down**: seventy-one, seventy-two, eighty-seven, ninety-two, ninety-seven, two thousand, two thousand two."
    );
  }

  // 12. Principles
  {
    const s = newSlide("Nyaya Content", U2.section, "Fundamental principles of international environmental law");
    const p = [
      ["No-harm rule", "States must not cause environmental damage beyond their borders. Stockholm P21, Rio P2; Trail Smelter arbitration", "FaShieldHalved"],
      ["Prevention", "Stop harm before it happens rather than repair it afterwards", "FaHandshake"],
      ["Precaution", "Lack of full scientific certainty is no excuse to delay. Rio P15", "FaTriangleExclamation"],
      ["Polluter pays", "The polluter bears the cost of pollution. Rio P16", "FaMoneyBillWave"],
      ["Sustainable development", "Meet present needs without compromising future generations", "FaRecycle"],
      ["CBDR", "Common but differentiated responsibilities. Rio P7", "FaScaleUnbalanced"],
      ["Intergenerational equity", "Hold the Earth in trust for future generations", "FaChildren"],
      ["Participation & EIA", "Public access to information (Rio P10); impact assessment (Rio P17)", "FaUsers"],
    ];
    const cw = 2.95, ch = 2.45, gx = 0.1, gy = 0.2;
    for (let i = 0; i < 8; i++) {
      const col = i % 4, row = Math.floor(i / 4);
      const x = M + col * (cw + gx), y = 1.6 + row * (ch + gy);
      const nm = next("z", "p" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: cw, h: ch, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow(), objectName: nm + "_bg" });
      await iconCircle(s, p[i][2], x + 0.2, y + 0.2, 0.62, YEL, "slate", nm);
      txt(s, p[i][0], { x: x + 0.95, y: y + 0.2, w: cw - 1.1, h: 0.62, fontSize: 16, bold: true, color: GOLD, valign: "middle" }, nm + "_h");
      txt(s, p[i][1], { x: x + 0.2, y: y + 0.95, w: cw - 0.4, h: ch - 1.1, fontSize: 14 }, nm + "_b");
    }
    s.addNotes(
      "[VOICE ANCHOR: firm, numbered]\n" +
      "Eight principles run through every treaty in this unit. One — the no-harm rule: a state must not damage the environment beyond its borders. It goes back to the Trail Smelter arbitration and Stockholm Principle twenty-one. " +
      "Two — prevention. Three — precaution, Rio Principle fifteen. Four — polluter pays, Rio Principle sixteen. " +
      "Five — sustainable development. Six — common but differentiated responsibilities, Rio Principle seven. " +
      "Seven — intergenerational equity. Eight — public participation and environmental impact assessment. " +
      "Learn these eight, because Unit Three will show you Indian courts adopting the same principles."
    );
  }

  // 13. Ramsar
  {
    const s = newSlide("Nyaya Content", U2.section, "Ramsar Convention, 1971");
    const nm = next("z", "hero");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.6, w: 4.4, h: 4.95, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
    await iconCircle(s, "FaFeather", M + 1.6, 1.9, 1.2, TEAL, "white", nm);
    txt(s, [{ text: "Convention on Wetlands of International Importance, especially as Waterfowl Habitat", options: { bold: true, fontSize: 17, breakLine: true } },
      { text: "Signed 2 February 1971 at Ramsar, Iran. In force 1975.", options: { color: MUTED, fontSize: 15 } }],
      { x: M + 0.3, y: 3.3, w: 3.8, h: 2.0, align: "center" }, nm + "_t");
    txt(s, "2 Feb = World Wetlands Day", { x: M + 0.3, y: 5.65, w: 3.8, h: 0.5, fontSize: 16, bold: true, color: GOLD, align: "center" }, nm + "_d");
    await card(s, { x: 5.25, y: 1.6, w: 3.65, h: 2.9, head: "Three pillars", body: ["Wise use of all wetlands", "Designate sites for the List of Wetlands of International Importance", "International cooperation on shared wetlands"], ic: "FaLayerGroup" });
    await card(s, { x: 9.08, y: 1.6, w: 3.65, h: 2.9, head: "India and Ramsar", body: ["India became a party in 1982", "First sites: Chilika (Odisha) and Keoladeo (Rajasthan)", "Montreux Record: sites facing adverse ecological change"], ic: "FaFlag" });
    await card(s, { x: 5.25, y: 4.7, w: 7.48, h: 1.85, head: "Telugu States Lens", body: "Kolleru Lake in Andhra Pradesh, between the Godavari and Krishna deltas, was designated a Ramsar site in 2002. Useful for APPSC/TGPSC answers on wetlands.", ic: "FaWater", fill: CARD2, headColor: TEAL, iconFill: TEAL, iconColor: "white" });
    s.addNotes(
      "[VOICE ANCHOR: calm, descriptive]\n" +
      "The Ramsar Convention is the oldest treaty in this unit. Its full name: the Convention on Wetlands of International Importance, especially as Waterfowl Habitat. " +
      "It was signed on the second of February, nineteen seventy-one, at Ramsar in Iran — which is why the second of February is World Wetlands Day. " +
      "Its three pillars: wise use, designation of sites, and international cooperation. India joined in nineteen eighty-two. Chilika and Keoladeo were India's first sites. " +
      "The Montreux [Mon-TRUH] Record lists sites under threat. " +
      "**Telugu States Lens.** Kolleru [Ko-LAY-roo] Lake in Andhra Pradesh, between the Godavari [Go-daa-va-ree] and Krishna deltas, became a Ramsar site in two thousand two."
    );
  }

  // 14. Stockholm
  {
    const s = newSlide("Nyaya Content", U2.section, "Stockholm Conference, 1972");
    const nm = next("f", "banner");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.6, w: W - 2 * M, h: 1.15, fill: { color: CARD2 }, line: { type: "none" }, rectRadius: 0.12, objectName: nm + "_bg" });
    txt(s, [{ text: "UN Conference on the Human Environment  ·  Stockholm, Sweden  ·  5–16 June 1972", options: { bold: true, fontSize: 19, breakLine: true } },
      { text: "The first global conference to treat the environment as a major international issue", options: { color: MUTED, fontSize: 15 } }],
      { x: M + 0.3, y: 1.6, w: W - 2 * M - 0.6, h: 1.15, valign: "middle" }, nm + "_t");
    await card(s, { x: M, y: 2.95, w: 3.9, h: 3.6, head: "Aims & objectives", body: ["Common outlook to preserve and enhance the human environment", "Link environment with development", "Guide action by states and the UN"], ic: "FaBullseye" });
    await card(s, { x: 4.72, y: 2.95, w: 3.9, h: 3.6, head: "Outcomes", body: ["Declaration of 26 principles", "Action Plan of 109 recommendations", "UNEP created", "5 June: World Environment Day"], ic: "FaFileContract" });
    await card(s, { x: 8.83, y: 2.95, w: 3.9, h: 3.6, head: "Impact on India", body: ["42nd Amendment, 1976: Art 48A and 51A(g)", "Air Act 1981 and EPA 1986 cite Stockholm in their preambles (Art 253)"], ic: "FaLandmark", iconFill: TEAL, iconColor: "white", headColor: TEAL });
    s.addNotes(
      "[VOICE ANCHOR: authoritative]\n" +
      "Stockholm, June nineteen seventy-two: the UN Conference on the Human Environment, the first time the world treated the environment as a major international issue. " +
      "Its aim was a common outlook to preserve and improve the human environment. Its outcomes: a Declaration of twenty-six principles, an Action Plan of one hundred and nine recommendations, " +
      "the birth of UNEP, and the fifth of June as World Environment Day. " +
      "Its impact on India is direct. The forty-second Amendment followed in nineteen seventy-six. And the preambles of the Air Act and the Environment Protection Act expressly refer to the Stockholm decisions — which is why Parliament could use Article two hundred and fifty-three."
    );
  }

  // 15. UNEP & Brundtland
  {
    const s = newSlide("Nyaya Content", U2.section, "UNEP and the Brundtland Report, 1987");
    await card(s, { x: M, y: 1.6, w: 5.2, h: 4.95, head: "UNEP", body: ["United Nations Environment Programme, created in 1972 after Stockholm", "Headquarters: Nairobi, Kenya", "Role: assess the global environment, catalyse treaties, support countries", "Flagship reports include Global Environment Outlook and the Emissions Gap Report"], ic: "FaEarthAfrica" });
    const nm = next("f", "brund");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.0, y: 1.6, w: 6.73, h: 4.95, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
    txt(s, [{ text: "World Commission on Environment and Development (1983)", options: { bold: true, color: GOLD, fontSize: 17, breakLine: true } },
      { text: "Chaired by Gro Harlem Brundtland of Norway. Report: “Our Common Future” (1987).", options: { fontSize: 15 } }],
      { x: 6.3, y: 1.8, w: 6.13, h: 1.1 }, nm + "_t");
    const nq = next("z", "quote");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.3, y: 3.05, w: 6.13, h: 2.05, fill: { color: YEL }, line: { type: "none" }, rectRadius: 0.1, objectName: nq + "_bg" });
    txt(s, "“Development that meets the needs of the present without compromising the ability of future generations to meet their own needs.”",
      { x: 6.55, y: 3.05, w: 5.63, h: 2.05, fontSize: 19, italic: true, bold: true, color: SLATE, valign: "middle" }, nq + "_t");
    const nk = next("f", "keys");
    txt(s, [{ text: "Two key concepts: ", options: { bold: true, color: GOLD } }, { text: "“needs”, especially of the world’s poor, and “limitations” that technology and society place on the environment’s ability to meet them." }],
      { x: 6.3, y: 5.25, w: 6.13, h: 1.15, fontSize: 15 }, nk);
    s.addNotes(
      "[VOICE ANCHOR: slower on the definition, smile on 'write this down']\n" +
      "Stockholm created UNEP — the United Nations Environment Programme — headquartered in Nairobi, Kenya. It assesses the global environment and catalyses new treaties. " +
      "Then, in nineteen eighty-three, the UN set up the World Commission on Environment and Development, chaired by Gro Harlem Brundtland [Groh HAR-lem BROONT-land] of Norway. " +
      "Its nineteen eighty-seven report, Our Common Future, gave the definition every examiner expects. **Write this down.** " +
      "Sustainable development is development that meets the needs of the present... without compromising the ability of future generations to meet their own needs."
    );
  }

  // 16. Rio 1992
  {
    const s = newSlide("Nyaya Content", U2.section, "Rio Earth Summit and Rio Declaration, 1992");
    const nm = next("f", "banner");
    txt(s, [{ text: "UN Conference on Environment and Development (UNCED)  ·  Rio de Janeiro  ·  June 1992", options: { bold: true, color: GOLD } }],
      { x: M, y: 1.5, w: W - 2 * M, h: 0.45, fontSize: 18 }, nm);
    const outs = [["Rio Declaration", "27 principles", "FaScroll"], ["Agenda 21", "action plan for the 21st century", "FaListCheck"], ["UNFCCC", "climate convention", "FaCloudSun"], ["CBD", "biodiversity convention", "FaFrog"], ["Forest Principles", "non-binding statement", "FaTree"]];
    const cw = 2.3, gap = (W - 2 * M - 5 * cw) / 4;
    for (let i = 0; i < 5; i++) {
      const x = M + i * (cw + gap);
      const n = next("z", "o" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.1, w: cw, h: 1.95, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow(), objectName: n + "_bg" });
      await iconCircle(s, outs[i][2], x + (cw - 0.7) / 2, 2.25, 0.7, YEL, "slate", n);
      txt(s, [{ text: outs[i][0], options: { bold: true, breakLine: true, fontSize: 16 } }, { text: outs[i][1], options: { color: MUTED, fontSize: 14 } }], { x: x + 0.1, y: 3.05, w: cw - 0.2, h: 0.9, align: "center" }, n + "_t");
    }
    rowTable(s, {
      x: M, y: 4.3, colW: [2.4, 9.73], rowH: 0.42, fontSize: 14,
      header: ["Principle", "What it says (examiners’ favourites)"],
      rows: [["Principle 7", "Common but differentiated responsibilities"], ["Principle 10", "Public participation, access to information and to justice"], ["Principle 15", "Precautionary approach"], ["Principle 16", "Polluter pays (internalising environmental costs)"]],
    });
    s.addNotes(
      "[VOICE ANCHOR: energetic]\n" +
      "Twenty years after Stockholm came Rio de Janeiro, June nineteen ninety-two — the Earth Summit. It produced five outcomes: the Rio Declaration with twenty-seven principles, Agenda twenty-one, " +
      "the climate convention UNFCCC, the Convention on Biological Diversity, and the non-binding Forest Principles. " +
      "From the Declaration, memorise four principles. Seven — common but differentiated responsibilities. Ten — public participation and access to justice. " +
      "Fifteen — the precautionary approach. Sixteen — polluter pays. Our Supreme Court has borrowed from fifteen and sixteen again and again."
    );
  }

  // 17. CBD
  {
    const s = newSlide("Nyaya Content", U2.section, "Convention on Biological Diversity, 1992");
    const objs = [["Conservation", "of biological diversity", "FaSeedling"], ["Sustainable use", "of its components", "FaRecycle"], ["Fair & equitable sharing", "of benefits from genetic resources", "FaHandshake"]];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.1;
      const nm = next("z", "obj" + i);
      s.addShape(pres.shapes.OVAL, { x: x + 0.95, y: 1.6, w: 2.0, h: 2.0, fill: { color: i === 2 ? TEAL : YEL }, line: { type: "none" }, objectName: nm + "_c" });
      s.addImage({ data: await icon(objs[i][2], i === 2 ? "white" : "slate"), x: x + 1.45, y: 2.1, w: 1.0, h: 1.0, objectName: nm + "_i", altText: objs[i][0] });
      txt(s, [{ text: (i + 1) + ". " + objs[i][0], options: { bold: true, breakLine: true, fontSize: 18 } }, { text: objs[i][1], options: { color: MUTED, fontSize: 15 } }], { x, y: 3.75, w: 3.9, h: 0.9, align: "center" }, nm + "_t");
    }
    rowTable(s, {
      x: M, y: 4.85, colW: [3.2, 8.93], rowH: 0.4, fontSize: 14,
      header: ["Milestone", "Detail"],
      rows: [["1992 → 1993", "Opened for signature at Rio; entered into force 29 December 1993"], ["Protocols", "Cartagena (biosafety, 2000) and Nagoya (access & benefit-sharing, 2010)"], ["India’s law", "Biological Diversity Act, 2002: NBA, State Biodiversity Boards, BMCs"]],
    });
    s.addNotes(
      "[VOICE ANCHOR: clear, counting on fingers]\n" +
      "The Convention on Biological Diversity has exactly three objectives. One — conservation of biological diversity. Two — sustainable use of its components. " +
      "Three — fair and equitable sharing of the benefits arising from genetic resources. " +
      "It opened for signature at Rio, and entered into force on the twenty-ninth of December, nineteen ninety-three. Its two protocols: Cartagena on biosafety, and Nagoya on access and benefit-sharing. " +
      "India implemented it through the Biological Diversity Act, two thousand two, which set up the National Biodiversity Authority, State Biodiversity Boards and local Biodiversity Management Committees."
    );
  }

  // 18. Rio+5 and Kyoto
  {
    const s = newSlide("Nyaya Content", U2.section, "Earth Summit+5 and the Kyoto Protocol, 1997");
    await card(s, { x: M, y: 1.6, w: 4.6, h: 4.95, head: "Earth Summit+5 (Rio+5)", body: ["19th Special Session of the UN General Assembly, New York, June 1997", "Five-year review of Agenda 21", "Found progress insufficient; adopted a Programme for the Further Implementation of Agenda 21"], ic: "FaMagnifyingGlass" });
    const nm = next("f", "kyoto");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.4, y: 1.6, w: 7.33, h: 4.95, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
    txt(s, [{ text: "Kyoto Protocol to the UNFCCC", options: { bold: true, color: GOLD, fontSize: 18, breakLine: true } }, { text: "Adopted December 1997  ·  In force 16 February 2005", options: { color: MUTED, fontSize: 15 } }],
      { x: 5.7, y: 1.8, w: 6.73, h: 0.9 }, nm + "_t");
    const facts = [["5.2%", "average cut below 1990 levels for developed (Annex I) countries, 2008–12"], ["6", "greenhouse gases covered"], ["3", "market mechanisms: Emissions Trading, Clean Development Mechanism, Joint Implementation"]];
    facts.forEach(([big, lab], i) => {
      const n = next("w", "k" + i);
      const y = 2.85 + i * 1.18;
      txt(s, big, { x: 5.7, y, w: 1.7, h: 1.0, fontSize: 36, bold: true, color: GOLD, valign: "middle", fontFace: "Cambria" }, n + "_n");
      txt(s, lab, { x: 7.45, y, w: 5.0, h: 1.0, fontSize: 15, valign: "middle" }, n + "_l");
    });
    s.addNotes(
      "[VOICE ANCHOR: brisk]\n" +
      "Nineteen ninety-seven had two events. In June, the UN General Assembly met in a special session in New York — the Earth Summit plus five — to review Agenda twenty-one. Its verdict: progress was insufficient. " +
      "In December came the Kyoto [Kee-YO-to] Protocol. It set binding targets for developed, Annex One countries — an average cut of five point two per cent below nineteen ninety levels in the first commitment period, two thousand eight to two thousand twelve. " +
      "It covered six greenhouse gases and created three market mechanisms: emissions trading, the Clean Development Mechanism and Joint Implementation. " +
      "It entered into force only in February two thousand five. India, as a developing country, had no binding target but hosted many CDM projects."
    );
  }

  // 19. MDGs & Johannesburg
  {
    const s = newSlide("Nyaya Content", U2.section, "Millennium Development Goals and Johannesburg, 2002");
    await card(s, { x: M, y: 1.6, w: 5.9, h: 4.95, head: "Millennium Development Goals (2000)", body: ["UN Millennium Summit, September 2000", "8 goals with a 2015 deadline", "Goal 7: ensure environmental sustainability (integrate SD into policy, reverse resource loss, safe drinking water, improve slum lives)", "Succeeded by the 17 Sustainable Development Goals in 2015"], ic: "FaBullseye", bodySize: 16 });
    await card(s, { x: 6.83, y: 1.6, w: 5.9, h: 4.95, head: "World Summit on Sustainable Development (2002)", body: ["Johannesburg, South Africa, Aug–Sep 2002; called Rio+10", "Johannesburg Declaration: three “mutually reinforcing pillars”: economic, social and environmental", "Johannesburg Plan of Implementation", "“Type II” partnerships among governments, business and civil society"], ic: "FaPeopleGroup", iconFill: TEAL, iconColor: "white", headColor: TEAL, bodySize: 16 });
    s.addNotes(
      "[VOICE ANCHOR: winding up the unit, steady]\n" +
      "In September two thousand, the UN Millennium Summit adopted eight Millennium Development Goals, with a deadline of two thousand fifteen. Goal seven was to ensure environmental sustainability. " +
      "In two thousand fifteen they were replaced by the seventeen Sustainable Development Goals. " +
      "Then Johannesburg, two thousand two — the World Summit on Sustainable Development, or Rio plus ten. Its Declaration described three mutually reinforcing pillars of sustainable development: economic, social and environmental. " +
      "It adopted a Plan of Implementation, and launched Type Two partnerships between governments, business and civil society. That completes Unit Two."
    );
  }

  // ================= UNIT III =================
  const U3 = { section: "Unit III: Constitution & courts", num: "III" };
  pres.addSection({ title: U3.section });
  await divider(U3, "The Constitution, the courts and the law of torts", "How Indian judges turned a duty into a right",
    ["Protection of Environment under the Indian Constitution", "42nd Constitution Amendment Act, 1976", "Directive Principles of State Policy", "Fundamental Duties", "Judicial Role, Expansion of Locus Standi, PIL", "Dynamic Interpretation of Article 21, 14 & 19 of the Constitution", "Right to Clean and Pollution-free Environment", "Sustainable Development", "Precautionary and Polluter Pays Principles", "Absolute and Strict Liability", "Doctrine of Public Trust", "Environmental Protection and Law of Torts", "Tort of Nuisance: Public and Private", "Tort of Negligence", "Tort of Trespass", "Environmental Torts", "Provisions under the Bharatiya Nyaya Sanhita, 2023 (BNS) & under the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)"], "FaLandmark",
    "[VOICE ANCHOR: serious, slower]\nUnit Three is where most of your marks are. Our Constitution of nineteen fifty did not even mention the environment. So how did a clean environment become a fundamental right?");

  await unitQuestions(U3, ["Explain the protection of environment under the Indian Constitution with reference to the 42nd Amendment, 1976.", "Discuss the judicial role, expansion of locus standi and PIL in environmental protection.", "Explain the dynamic interpretation of Articles 21, 14 and 19 for a clean and pollution-free environment.", "Distinguish between absolute and strict liability with decided cases.", "Discuss environmental protection under the law of torts and under the BNS and BNSS, 2023."], ["Sustainable development", "Precautionary principle", "Polluter pays principle", "Doctrine of public trust", "Public and private nuisance"]);

  // 21. 42nd Amendment
  {
    const s = newSlide("Nyaya Content", U3.section, "42nd Constitution Amendment Act, 1976");
    await card(s, { x: M, y: 1.6, w: 6.0, h: 2.35, head: "Article 48A  (DPSP, Part IV)", body: "The State shall endeavour to protect and improve the environment and to safeguard the forests and wild life of the country.", ic: "FaLandmark", bodySize: 15 });
    await card(s, { x: M, y: 4.15, w: 6.0, h: 2.4, head: "Article 51A(g)  (Fundamental Duty, Part IVA)", body: "Every citizen shall protect and improve the natural environment including forests, lakes, rivers and wild life, and have compassion for living creatures.", ic: "FaUser", iconFill: TEAL, iconColor: "white", headColor: TEAL, bodySize: 15 });
    const nh = next("f", "sched");
    txt(s, "SEVENTH SCHEDULE: STATE LIST → CONCURRENT LIST", { x: 6.85, y: 1.6, w: 5.88, h: 0.4, fontSize: 15, bold: true, color: GOLD, charSpacing: 2 }, nh);
    rowTable(s, {
      x: 6.85, y: 2.05, colW: [2.2, 3.68], rowH: 0.62, fontSize: 14,
      header: ["New entry", "Subject"],
      rows: [["List III, 17A", "Forests"], ["List III, 17B", "Protection of wild animals and birds"]],
    });
    await card(s, { x: 6.85, y: 4.15, w: 5.88, h: 2.4, head: "Other environment-linked provisions", body: ["Art 47: public health", "Art 253: Parliament may legislate to implement treaties", "Art 243G & 243W: 11th and 12th Schedules (panchayats & municipalities)"], ic: "FaBook", bodySize: 14 });
    s.addNotes(
      "[VOICE ANCHOR: precise; stress the Article numbers]\n" +
      "The forty-second Amendment of nineteen seventy-six did three things for the environment. First, it inserted Article forty-eight-A, a Directive Principle: the State shall endeavour to protect and improve the environment and safeguard forests and wild life. " +
      "Second, Article fifty-one-A-g, a Fundamental Duty: every citizen shall protect and improve the natural environment and have compassion for living creatures. " +
      "Third, it moved forests and the protection of wild animals and birds from the State List to the Concurrent List, as entries seventeen-A and seventeen-B. " +
      "Add Articles forty-seven, two hundred and fifty-three, and the Eleventh and Twelfth Schedules to complete the constitutional picture. " +
      "Remember — a Directive Principle is not enforceable in court on its own. The courts solved that problem through Article twenty-one."
    );
  }

  // 22. Locus standi & PIL
  {
    const s = newSlide("Nyaya Content", U3.section, "Judicial role: expansion of locus standi and PIL");
    const nmA = next("f", "old");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.6, w: 4.0, h: 2.0, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, objectName: nmA + "_bg" });
    txt(s, [{ text: "Traditional rule", options: { bold: true, color: MUTED, fontSize: 17, breakLine: true } }, { text: "Only the person whose own right was injured could approach the court.", options: { fontSize: 15 } }], { x: M + 0.25, y: 1.75, w: 3.5, h: 1.7 }, nmA + "_t");
    const nAr = next("w", "arrow");
    s.addShape(pres.shapes.RIGHT_ARROW, { x: 4.75, y: 2.25, w: 1.0, h: 0.7, fill: { color: YEL }, line: { type: "none" }, objectName: nAr });
    const nmB = next("z", "new");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.9, y: 1.6, w: 6.83, h: 2.0, fill: { color: YEL }, line: { type: "none" }, rectRadius: 0.12, objectName: nmB + "_bg" });
    txt(s, [{ text: "Public Interest Litigation", options: { bold: true, fontSize: 18, breakLine: true } }, { text: "Any public-spirited person can move the court for those who cannot. S.P. Gupta v Union of India (1981) liberalised standing; even letters were treated as petitions (epistolary jurisdiction).", options: { fontSize: 15 } }],
      { x: 6.15, y: 1.75, w: 6.33, h: 1.7, color: SLATE }, nmB + "_t");
    const cases = [
      ["RLEK v State of UP (1985)", "Doon Valley limestone quarrying: early environmental PIL; mines closed despite economic cost"],
      ["M.C. Mehta v UoI (1987)", "Ganga pollution: Kanpur tanneries ordered to treat effluent or close"],
      ["T.N. Godavarman v UoI (1996 on)", "“Forest” read in its dictionary meaning; continuing mandamus over forests nationwide"],
    ];
    for (let i = 0; i < 3; i++) {
      await card(s, { x: M + i * 4.1, y: 3.85, w: 3.9, h: 2.7, head: cases[i][0], body: cases[i][1], ic: "FaGavel", headSize: 16, bodySize: 14 });
    }
    s.addNotes(
      "[VOICE ANCHOR: building momentum]\n" +
      "Traditionally, only the injured person could go to court. But rivers and forests cannot file petitions. So in S. P. Gupta versus Union of India, nineteen eighty-one, the Supreme Court liberalised locus standi [LOH-kus STAN-dee]. " +
      "Any public-spirited person could now approach the court, and even letters were treated as petitions. This is Public Interest Litigation. " +
      "Three environmental PILs to remember. RLEK versus State of U.P., nineteen eighty-five — limestone quarrying in the Doon Valley. " +
      "M. C. Mehta versus Union of India, nineteen eighty-seven — the Kanpur tanneries polluting the Ganga. " +
      "And T. N. Godavarman [Go-DAA-var-man] Thirumulpad, from nineteen ninety-six, where the court gave 'forest' its dictionary meaning and kept the case open as a continuing mandamus."
    );
  }

  // 23. Art 21, 14, 19
  {
    const s = newSlide("Nyaya Content", U3.section, "Dynamic interpretation of Articles 21, 14 and 19");
    const cols = [
      ["Article 21", "Life & personal liberty", ["Subhash Kumar v State of Bihar (1991): right to pollution-free water and air is part of the right to life", "Virender Gaur v State of Haryana (1995): a clean environment is part of Art 21"], YEL, "slate"],
      ["Article 14", "Equality & non-arbitrariness", ["Bangalore Medical Trust v B.S. Muddappa (1991): converting a public park site to a private nursing home struck down as arbitrary", "Environmental permissions must follow reasoned, non-arbitrary decisions"], TEAL, "white"],
      ["Article 19", "Freedoms & reasonable limits", ["Art 19(1)(g): no right to carry on a trade that pollutes; restrictions in public interest are reasonable", "M.C. Mehta (Kanpur tanneries, 1987): closure of polluting units upheld"], RED, "white"],
    ];
    for (let i = 0; i < 3; i++) {
      const [art, sub, pts, fill, ic] = cols[i];
      const x = M + i * 4.1;
      const nm = next("u", "col" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 3.9, h: 4.95, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.2, y: 1.8, w: 3.5, h: 1.1, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.08, objectName: nm + "_hd" });
      txt(s, [{ text: art, options: { bold: true, fontSize: 22, fontFace: "Cambria", breakLine: true } }, { text: sub, options: { fontSize: 14 } }], { x: x + 0.4, y: 1.8, w: 3.1, h: 1.1, valign: "middle", color: ic === "slate" ? SLATE : WHITE }, nm + "_h");
      txt(s, pts.map((p, j) => ({ text: p, options: { bullet: { indent: 14 }, breakLine: j < pts.length - 1, paraSpaceAfter: 8 } })), { x: x + 0.25, y: 3.1, w: 3.4, h: 3.3, fontSize: 14 }, nm + "_b");
    }
    s.addNotes(
      "[VOICE ANCHOR: explanatory, emphasis on each Article]\n" +
      "Here is how the courts made the environment justiciable. **Article twenty-one.** In Subhash Kumar versus State of Bihar, nineteen ninety-one, the court held that the right to life includes the right to pollution-free water and air. " +
      "**Article fourteen.** Arbitrary action against the environment violates equality — in Bangalore Medical Trust versus Muddappa [Mud-DAP-pa], converting a public park site into a private nursing home was struck down. " +
      "**Article nineteen.** The freedom of trade does not include a freedom to pollute — so closing polluting tanneries was a reasonable restriction. " +
      "Directive Principles plus Fundamental Duties, read into Fundamental Rights: that is the dynamic interpretation your syllabus asks about."
    );
  }

  // 24. Right to clean environment & SD
  {
    const s = newSlide("Nyaya Content", U3.section, "Right to a clean environment and sustainable development");
    const nm = next("z", "vellore");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.6, w: 6.2, h: 4.95, fill: { color: YEL }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
    s.addImage({ data: await icon("FaGavel", "slate"), x: M + 0.35, y: 1.9, w: 0.8, h: 0.8, objectName: nm + "_i", altText: "Gavel" });
    txt(s, [{ text: "Vellore Citizens’ Welfare Forum v Union of India (1996)", options: { bold: true, fontSize: 20, breakLine: true } },
      { text: "Tanneries in Tamil Nadu were polluting the Palar river.", options: { fontSize: 15, breakLine: true } },
      { text: "Held: sustainable development is a balancing concept between ecology and development. The precautionary principle and polluter pays principle are part of the environmental law of the country.", options: { fontSize: 15 } }],
      { x: M + 0.35, y: 2.85, w: 5.5, h: 3.5, color: SLATE }, nm + "_t");
    await card(s, { x: 7.0, y: 1.6, w: 5.73, h: 2.35, head: "What “sustainable development” demands", body: ["Development is allowed, but within the carrying capacity of ecosystems", "Inter-generational equity: hold resources in trust"], ic: "FaRecycle", bodySize: 14 });
    await card(s, { x: 7.0, y: 4.15, w: 5.73, h: 2.4, head: "Later reinforcement", body: ["N.D. Jayal v UoI (2003), Tehri Dam: the right to sustainable development is part of Art 21", "NGT Act 2010, Sec 20: the Tribunal must apply SD, precaution and polluter pays"], ic: "FaLink", iconFill: TEAL, iconColor: "white", headColor: TEAL, bodySize: 14 });
    s.addNotes(
      "[VOICE ANCHOR: slower, this is a must-cite case]\n" +
      "If you remember only one case from this unit, make it Vellore Citizens' Welfare Forum versus Union of India, nineteen ninety-six. " +
      "Tanneries in Tamil Nadu were polluting the Palar [PAA-lar] river. The court called sustainable development a balancing concept between ecology and development, " +
      "and declared that the precautionary principle and the polluter pays principle are part of the environmental law of India. " +
      "In N. D. Jayal versus Union of India, the Tehri Dam case of two thousand three, the court said the right to sustainable development is itself part of Article twenty-one. " +
      "And Section twenty of the NGT Act now makes these principles binding on the Tribunal."
    );
  }

  // 25. Precaution & polluter pays
  {
    const s = newSlide("Nyaya Content", U3.section, "Precautionary and polluter pays principles");
    await card(s, { x: M, y: 1.6, w: 6.0, h: 2.75, head: "Precautionary principle", body: ["Anticipate, prevent and attack the causes of degradation", "Lack of scientific certainty is no reason to postpone measures", "Onus of proof is on the developer or industry to show its action is benign"], ic: "FaTriangleExclamation", bodySize: 14 });
    await card(s, { x: 6.73, y: 1.6, w: 6.0, h: 2.75, head: "Polluter pays principle", body: ["The polluter bears the cost of compensating victims", "…and the cost of restoring the damaged environment", "Indian Council for Enviro-Legal Action v UoI (1996), Bichhri village, Rajasthan: H-acid sludge poisoned wells"], ic: "FaMoneyBillWave", bodySize: 14 });
    await card(s, { x: M, y: 4.55, w: W - 2 * M, h: 2.0, head: "Telugu States Lens  ·  A.P. Pollution Control Board v Prof. M.V. Nayudu (1999)", body: "A hazardous industry was proposed in the catchment of the Osman Sagar and Himayat Sagar lakes that supply Hyderabad. The Supreme Court explained the precautionary principle and placed the burden of proof on the industry, and suggested referring scientific questions to expert bodies.", ic: "FaWater", fill: CARD2, headColor: TEAL, iconFill: TEAL, iconColor: "white", bodySize: 14, headSize: 16 });
    s.addNotes(
      "[VOICE ANCHOR: clear contrast between the two]\n" +
      "The precautionary principle says: anticipate and prevent. If there is a threat of serious damage, lack of scientific certainty is no excuse for delay. And the burden of proof shifts to the industry. " +
      "The polluter pays principle says: whoever pollutes pays — both to compensate victims and to restore the environment. " +
      "Its leading case is Indian Council for Enviro-Legal Action versus Union of India, nineteen ninety-six, from Bichhri [BICH-ree] village in Rajasthan, where H-acid sludge poisoned the wells. " +
      "**Telugu States Lens.** A. P. Pollution Control Board versus Professor M. V. Nayudu [NAA-yu-du], nineteen ninety-nine. An industry was proposed in the catchment of Osman Sagar and Himayat Sagar, the lakes that supply Hyderabad. " +
      "The Supreme Court placed the burden of proof on the industry. A perfect Group-1 example."
    );
  }

  // 26. Strict vs absolute liability
  {
    const s = newSlide("Nyaya Content", U3.section, "Strict liability vs absolute liability");
    rowTable(s, {
      x: M, y: 1.6, colW: [2.6, 4.77, 4.76], rowH: [0.7, 0.7, 0.85, 0.55, 0.7], fontSize: 14,
      header: ["Point", "Strict liability", "Absolute liability"],
      rows: [
        ["Source", "Rylands v Fletcher (1868), House of Lords", "M.C. Mehta v Union of India (1987), Oleum gas leak, Delhi"],
        ["Applies to", "Non-natural use of land; dangerous thing escapes and causes harm", "Enterprise engaged in a hazardous or inherently dangerous activity"],
        ["Exceptions", "Act of God, plaintiff’s own fault, consent, act of a stranger, statutory authority", "None. The enterprise is liable even if it took all due care"],
        ["Escape needed?", "Yes", "No; harm from the activity is enough"],
        ["Compensation", "Compensatory", "Linked to the magnitude and capacity of the enterprise, so it deters"],
      ],
    });
    const nm = next("u", "after");
    txt(s, [{ text: "After Bhopal (1984): ", options: { bold: true, color: GOLD } }, { text: "Public Liability Insurance Act 1991 (no-fault relief); NGT Act 2010, Sec 17 (no-fault liability for accidents)." }],
      { x: M, y: 6.25, w: W - 2 * M, h: 0.55, fontSize: 15, color: MUTED }, nm);
    s.addNotes(
      "[VOICE ANCHOR: comparative, measured]\n" +
      "This comparison is a guaranteed long-answer topic. Strict liability comes from Rylands versus Fletcher, eighteen sixty-eight: a person who brings a dangerous thing onto land is liable if it escapes. " +
      "But it allows five exceptions — Act of God, the plaintiff's own fault, consent, the act of a stranger, and statutory authority. " +
      "In December nineteen eighty-five, oleum [OH-lee-um] gas leaked from Shriram's plant in Delhi. In M. C. Mehta versus Union of India, nineteen eighty-seven, the Supreme Court said strict liability was not enough for India. " +
      "It created absolute liability: an enterprise in a hazardous activity is liable with no exceptions, and compensation must match its size and capacity so that it deters. " +
      "After Bhopal, Parliament added the Public Liability Insurance Act, and later Section seventeen of the NGT Act."
    );
  }

  // 27. Public trust
  {
    const s = newSlide("Nyaya Content", U3.section, "Doctrine of public trust");
    const parts = [["The public", "beneficiary", 0.9, TEAL, "FaUsers", "white"], ["The State", "trustee, not owner", 4.95, YEL, "FaBuildingColumns", "slate"], ["Natural resources", "trust property: seashore, running water, air, forests, fragile lands", 9.0, CARD2, "FaWater", "yellow"]];
    for (let i = 0; i < 3; i++) {
      const [h, b, x, fill, ic, icCol] = parts[i];
      const nm = next("z", "p" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.65, w: 3.45, h: 2.3, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
      s.addImage({ data: await icon(ic, icCol), x: x + 1.37, y: 1.8, w: 0.7, h: 0.7, objectName: nm + "_i", altText: h });
      txt(s, [{ text: h, options: { bold: true, fontSize: 18, breakLine: true } }, { text: b, options: { fontSize: 14 } }], { x: x + 0.2, y: 2.6, w: 3.05, h: 1.25, align: "center", color: fill === TEAL ? WHITE : SLATE }, nm + "_t");
      if (i < 2) {
        const na = next("w", "ar" + i);
        s.addShape(pres.shapes.LEFT_RIGHT_ARROW, { x: x + 3.47, y: 2.62, w: 0.56, h: 0.36, fill: { color: MUTED }, line: { type: "none" }, objectName: na });
      }
    }
    await card(s, { x: M, y: 4.2, w: 7.6, h: 2.35, head: "M.C. Mehta v Kamal Nath (1997)", body: "A motel company (Span Motel) was allowed to divert the Beas river near Manali. The Court quashed the lease: the State is a trustee of natural resources for the public and cannot hand them over for private, commercial use.", ic: "FaGavel", bodySize: 14 });
    await card(s, { x: 8.4, y: 4.2, w: 4.33, h: 2.35, head: "Roots", body: ["Roman law: air, running water and the sea are common to all", "Revived by Prof. Joseph Sax (1970)"], ic: "FaScroll", iconFill: TEAL, iconColor: "white", headColor: TEAL, bodySize: 14 });
    s.addNotes(
      "[VOICE ANCHOR: storytelling]\n" +
      "The public trust doctrine has three parties. The public is the beneficiary. The State is the trustee — not the owner. And natural resources — seashores, running water, air, forests — are the trust property. " +
      "It comes from Roman law, and was revived by Professor Joseph Sax in nineteen seventy. " +
      "In India, the case is M. C. Mehta versus Kamal Nath, nineteen ninety-seven. A motel near Manali was allowed to divert the Beas [Bee-AAS] river. " +
      "The Supreme Court quashed the lease: a trustee cannot hand public resources to a private company for commercial use."
    );
  }

  // 28. Torts
  {
    const s = newSlide("Nyaya Content", U3.section, "Environmental protection and the law of torts");
    const t = [
      ["Public nuisance", "An act that injures the public at large (e.g., smoke over a town). A private suit needs special damage; also a crime.", "FaPeopleGroup"],
      ["Private nuisance", "Unreasonable interference with a person’s use or enjoyment of land: noise, smell, dust, vibration.", "FaHouse"],
      ["Negligence", "Duty of care + breach + resulting damage. E.g., careless storage of chemicals that leak into a neighbour’s well.", "FaTriangleExclamation"],
      ["Trespass", "Direct, physical intrusion on another’s land, such as dumping waste or discharging effluent onto it.", "FaDoorOpen"],
    ];
    for (let i = 0; i < 4; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      await card(s, { x: M + col * 3.65, y: 1.6 + row * 2.5, w: 3.5, h: 2.3, head: t[i][0], body: t[i][1], ic: t[i][2], bodySize: 14, headSize: 17 });
    }
    await card(s, { x: 7.95, y: 1.6, w: 4.78, h: 2.3, head: "Remedies", body: ["Damages (compensation)", "Injunction (stop the activity)", "Abatement of the nuisance"], ic: "FaScaleBalanced", iconFill: TEAL, iconColor: "white", headColor: TEAL });
    await card(s, { x: 7.95, y: 4.1, w: 4.78, h: 2.45, head: "Municipal Council, Ratlam v Vardhichand (1980)", body: "Open drains and filth in Ratlam: the Supreme Court held the municipality must remove the public nuisance; lack of funds is no defence.", ic: "FaGavel", bodySize: 14, headSize: 16 });
    s.addNotes(
      "[VOICE ANCHOR: practical, example-led]\n" +
      "Long before environmental statutes, the law of torts protected the environment. Four torts matter. Public nuisance injures the public at large. " +
      "Private nuisance is an unreasonable interference with your enjoyment of your land — noise, smell, dust. " +
      "Negligence needs a duty, a breach and damage. Trespass is a direct physical intrusion, like dumping waste on someone's land. " +
      "The remedies: damages, injunction and abatement. " +
      "And the classic case — Municipal Council, Ratlam [RUT-lum] versus Vardhichand [Var-dhee-CHUND], nineteen eighty. The court ordered the municipality to clean up open drains, and said lack of funds is no defence."
    );
  }

  // 29. BNS & BNSS
  {
    const s = newSlide("Nyaya Content", U3.section, "Criminal law: BNS and BNSS, 2023 (in force 1 July 2024)");
    rowTable(s, {
      x: M, y: 1.6, colW: [6.13, 2.5, 3.5], rowH: 0.44, fontSize: 14,
      header: ["Offence / power", "Old (IPC/CrPC)", "New (BNS/BNSS)"],
      rows: [
        ["Public nuisance (definition)", "IPC 268", "BNS 270"],
        ["Negligent act likely to spread infection", "IPC 269", "BNS 271"],
        ["Fouling water of a public spring or reservoir", "IPC 277", "BNS 279"],
        ["Making the atmosphere noxious to health", "IPC 278", "BNS 280"],
        ["Negligent conduct with poisonous substance", "IPC 284", "BNS 286"],
        ["Punishment for public nuisance (residuary)", "IPC 290", "BNS 292"],
        ["Magistrate’s conditional order to remove nuisance", "CrPC 133", "BNSS 152"],
        ["Urgent order in nuisance or apprehended danger", "CrPC 144", "BNSS 163"],
      ],
    });
    const nm = next("u", "tip");
    txt(s, [{ text: "Tip: ", options: { bold: true, color: GOLD } }, { text: "write both numbers in the exam (e.g., “Sec 152 BNSS, formerly Sec 133 CrPC”) and cite Ratlam (1980) for the nuisance power. Check section numbers against the current bare Act." }],
      { x: M, y: 6.2, w: W - 2 * M, h: 0.65, fontSize: 14, color: MUTED }, nm);
    s.addNotes(
      "[VOICE ANCHOR: crisp, number by number]\n" +
      "Your syllabus now uses the new criminal laws, in force from the first of July, twenty twenty-four. Here is the conversion table. " +
      "Public nuisance — old Section two sixty-eight, now Section two seventy of the Bharatiya Nyaya Sanhita [BHAA-ra-tee-ya NYAA-ya SUN-hi-taa]. " +
      "Fouling water of a public spring — two seventy-seven becomes two seventy-nine. Making the atmosphere noxious — two seventy-eight becomes two eighty. " +
      "And the most-used power: the magistrate's order to remove a public nuisance, old Section one thirty-three CrPC, is now Section one fifty-two of the Bharatiya Nagarik Suraksha Sanhita [Naa-ga-rik Su-RUK-sha SUN-hi-taa]. " +
      "In the exam, write both numbers."
    );
  }

  // ================= UNIT IV =================
  const U4 = { section: "Unit IV: Statutes", num: "IV" };
  pres.addSection({ title: U4.section });
  await divider(U4, "The statute book: Water, Air and Environment", "Framework, regulators, powers, penalties and the judiciary",
    ["Protection of Water, Air and Environment in India", "The Water (Prevention and Control of Pollution) Act of 1974", "The Framework of the Act", "Regulatory Mechanism: Its Powers and Functions", "Offences and Penalties under Water Act", "Role of Judiciary in Prevention of Water Pollution", "The Air (Prevention and Control of Pollution) Act of 1981", "The Framework of the Act", "Regulatory Mechanism: Its Powers and Functions", "Offences and Penalties under Air Act", "Role of Judiciary in Prevention of Air Pollution", "The Environment Protection Act (EPA) of 1986", "Main Aims and Objectives of the Act", "Importance of Section 3 and 5 of EPA", "Penalties under the Act", "National Environment Tribunal"], "FaBookOpen",
    "[VOICE ANCHOR: focused]\nUnit Four. Three Acts, one pattern: a regulator, a consent system, directions, penalties, and courts that keep watch. Learn the pattern once and all three become easy.");

  await unitQuestions(U4, ["Explain the framework and regulatory mechanism of the Water Act, 1974.", "Discuss offences and penalties under the Water Act and the role of the judiciary in preventing water pollution.", "Explain the framework and regulatory mechanism of the Air Act, 1981.", "Discuss offences and penalties under the Air Act and the role of the judiciary in preventing air pollution.", "Discuss the main aims and objectives of the Environment (Protection) Act, 1986 and the penalties under it."], ["Importance of Section 3 of EPA", "Importance of Section 5 of EPA", "Central and State Pollution Control Boards", "Consent to establish and operate", "National Environment Tribunal"]);

  // 31. Three Acts overview
  {
    const s = newSlide("Nyaya Content", U4.section, "Three Acts, three constitutional routes");
    const acts = [
      ["1974", "Water (Prevention and Control of Pollution) Act", "Art 252: Parliament legislated after state legislatures passed resolutions", "First major pollution law; created the Boards", "FaDroplet"],
      ["1981", "Air (Prevention and Control of Pollution) Act", "Art 253: implements Stockholm 1972 decisions", "Same Boards; noise added as air pollutant in 1987", "FaWind"],
      ["1986", "Environment (Protection) Act", "Art 253: implements Stockholm 1972 decisions", "Umbrella law passed after the Bhopal gas tragedy (Dec 1984)", "FaShieldHalved"],
    ];
    for (let i = 0; i < 3; i++) {
      const [yr, name, basis, note, ic] = acts[i];
      const x = M + i * 4.1;
      const nm = next("u", "act" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 3.9, h: 4.35, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
      await iconCircle(s, ic, x + 0.25, 1.85, 0.8, YEL, "slate", nm);
      txt(s, yr, { x: x + 1.2, y: 1.85, w: 2.4, h: 0.8, fontSize: 36, bold: true, color: GOLD, valign: "middle", fontFace: "Cambria" }, nm + "_y");
      txt(s, name, { x: x + 0.25, y: 2.85, w: 3.4, h: 0.95, fontSize: 17, bold: true }, nm + "_n");
      txt(s, [{ text: "Basis: ", options: { bold: true, color: GOLD } }, { text: basis, options: { breakLine: true } }, { text: note, options: { color: MUTED } }], { x: x + 0.25, y: 3.85, w: 3.4, h: 2.0, fontSize: 14, paraSpaceAfter: 6 }, nm + "_b");
    }
    const nt = next("u", "trap");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 6.15, w: W - 2 * M, h: 0.65, fill: { color: RED }, line: { type: "none" }, rectRadius: 0.08, objectName: nt + "_bg" });
    txt(s, "Exam trap: the Water Act rests on Article 252 (state consent), not Article 253. Only the Air Act and the EPA implement Stockholm under Art 253.", { color: WHITE, x: M + 0.2, y: 6.15, w: W - 2 * M - 0.4, h: 0.65, fontSize: 14, bold: true, valign: "middle" }, nt + "_t");
    s.addNotes(
      "[VOICE ANCHOR: firm on the trap]\n" +
      "Three Acts, three dates: nineteen seventy-four, nineteen eighty-one, nineteen eighty-six. But notice the constitutional route. " +
      "Water was a State subject, so the Water Act was passed under Article two fifty-two, after state legislatures passed resolutions asking Parliament to legislate. " +
      "The Air Act and the Environment Protection Act were passed under Article two fifty-three, to implement the Stockholm decisions. " +
      "This is a favourite trap. Water — two fifty-two. Air and EPA — two fifty-three."
    );
  }

  // 32. Water Act
  {
    const s = newSlide("Nyaya Content", U4.section, "Water Act, 1974: framework, powers, penalties");
    // flow: CPCB -> SPCB -> industry
    const flow = [["CPCB", "Sec 3: Central Board. Advises Centre, coordinates SPCBs, sets standards"], ["SPCBs", "Sec 4: State Boards. Plan, inspect, grant consent, monitor"], ["Industry / local body", "Needs consent; must not discharge polluting matter"]];
    for (let i = 0; i < 3; i++) {
      const y = 1.6 + i * 1.6;
      const nm = next("w", "f" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: 4.3, h: 1.25, fill: { color: i === 0 ? YEL : CARD }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow(), objectName: nm + "_bg" });
      txt(s, [{ text: flow[i][0], options: { bold: true, fontSize: 17, breakLine: true } }, { text: flow[i][1], options: { fontSize: 14 } }], { x: M + 0.2, y, w: 3.9, h: 1.25, valign: "middle", color: SLATE }, nm + "_t");
      if (i < 2) s.addShape(pres.shapes.DOWN_ARROW, { x: M + 1.95, y: y + 1.28, w: 0.4, h: 0.3, fill: { color: MUTED }, line: { type: "none" }, objectName: nm + "_ar" });
    }
    rowTable(s, {
      x: 5.15, y: 1.6, colW: [1.6, 5.98], rowH: 0.5, fontSize: 14,
      header: ["Section", "Power or rule"],
      rows: [
        ["Sec 21, 23", "Take samples; enter and inspect premises"],
        ["Sec 24", "No knowing discharge of polluting matter into streams or wells"],
        ["Sec 25, 26", "Prior consent to establish/operate an outlet or discharge"],
        ["Sec 33A", "Directions: closure, prohibition, stop power or water (1988)"],
        ["Sec 41–50", "Offences and penalties (Chapter VII)"],
        ["Sec 49", "Cognizance: Board, or a citizen after 60 days’ notice"],
      ],
    });
    await card(s, { x: 5.15, y: 5.5, w: 7.58, h: 1.1, head: null, body: "Judiciary: M.C. Mehta (Ganga tanneries, 1987) and Vellore (1996) enforced the Act strictly. 2024 amendment: many minor offences now attract monetary penalties instead of jail.", eff: "f", bodySize: 14, fill: CARD2, label: "jud" });
    s.addNotes(
      "[VOICE ANCHOR: structured, teacherly]\n" +
      "The Water Act's framework is a chain. At the top, the Central Pollution Control Board under Section three. Below it, State Boards under Section four. And at the bottom, the industry that needs consent. " +
      "Key powers: Sections twenty-one and twenty-three to take samples and inspect. Section twenty-four bars discharging polluting matter into streams or wells. Sections twenty-five and twenty-six require prior consent. " +
      "Section thirty-three-A, added in nineteen eighty-eight, lets the Board order closure or cut off power and water. " +
      "Offences sit in Chapter Seven. Under Section forty-nine, even a citizen can complain, after giving sixty days' notice. " +
      "And note the twenty twenty-four amendment, which replaced jail with monetary penalties for many minor offences."
    );
  }

  // 33. Air Act
  {
    const s = newSlide("Nyaya Content", U4.section, "Air Act, 1981: framework, powers, penalties");
    const facts = [
      ["Sec 2(a)", "“Air pollutant” includes noise (added in 1987)", "FaVolumeHigh"],
      ["Sec 19", "State Government may declare air pollution control areas", "FaMapLocationDot"],
      ["Sec 21", "Consent of the State Board needed to run an industrial plant in a control area", "FaFileSignature"],
      ["Sec 22", "No emissions above the standards laid down by the Board", "FaIndustry"],
      ["Sec 31A", "Board can direct closure, prohibition, or stop power and water (1987)", "FaBan"],
      ["Sec 37, 43", "Penalties; cognizance on a complaint by the Board or a citizen after 60 days’ notice", "FaGavel"],
    ];
    for (let i = 0; i < 6; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + col * 3.95, y = 1.6 + row * 1.68;
      const nm = next("z", "a" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.8, h: 1.5, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow(), objectName: nm + "_bg" });
      await iconCircle(s, facts[i][2], x + 0.18, y + 0.2, 0.6, YEL, "slate", nm);
      txt(s, facts[i][0], { x: x + 0.9, y: y + 0.2, w: 2.7, h: 0.6, fontSize: 17, bold: true, color: GOLD, valign: "middle" }, nm + "_h");
      txt(s, facts[i][1], { x: x + 0.18, y: y + 0.85, w: 3.45, h: 0.6, fontSize: 14 }, nm + "_b");
    }
    await card(s, { x: 8.55, y: 1.6, w: 4.18, h: 4.88, head: "Role of judiciary", body: ["M.C. Mehta v UoI (Taj Trapezium, 1997): polluting industries near the Taj Mahal moved or shifted to cleaner fuel", "M.C. Mehta v UoI (Delhi vehicles, 1998 onward): CNG for public transport", "Jan Vishwas Act 2023 replaced many jail terms under the Act with monetary penalties"], ic: "FaScaleBalanced", iconFill: TEAL, iconColor: "white", headColor: TEAL, bodySize: 14 });
    s.addNotes(
      "[VOICE ANCHOR: steady]\n" +
      "The Air Act follows the same pattern, with the same Boards. Under Section two-A, air pollutant includes noise — added in nineteen eighty-seven. " +
      "Section nineteen lets the State declare air pollution control areas. Section twenty-one requires consent to run an industrial plant there. Section twenty-two bars emissions above the standards. " +
      "Section thirty-one-A gives the Board power to order closure or cut off power and water. Penalties follow from Section thirty-seven, and Section forty-three allows citizen complaints after sixty days' notice. " +
      "The judiciary made this Act matter — in the Taj Trapezium [tra-PEE-zee-um] case, and in the Delhi vehicular pollution case that brought CNG buses to Delhi."
    );
  }

  // 34. Water vs Air comparison
  {
    const s = newSlide("Nyaya Content", U4.section, "Water Act vs Air Act: a quick comparison");
    rowTable(s, {
      x: M, y: 1.6, colW: [3.0, 4.57, 4.56], rowH: 0.62, fontSize: 15,
      header: ["Feature", "Water Act, 1974", "Air Act, 1981"],
      rows: [
        ["Constitutional basis", "Article 252", "Article 253"],
        ["Regulator", "CPCB (Sec 3), SPCBs (Sec 4)", "Same Boards act under the Air Act"],
        ["Area approach", "Whole state", "Notified air pollution control areas (Sec 19)"],
        ["Consent", "Sec 25, 26", "Sec 21"],
        ["Directions power", "Sec 33A", "Sec 31A"],
        ["Citizen complaint", "Sec 49 (60 days’ notice)", "Sec 43 (60 days’ notice)"],
        ["Recent change", "2024 amendment: penalties", "Jan Vishwas Act 2023: penalties"],
      ],
    });
    s.addNotes(
      "[VOICE ANCHOR: rapid-fire, rhythmic]\n" +
      "Let me put both Acts side by side, so you can write a comparison answer in five minutes. Basis: two fifty-two versus two fifty-three. Regulator: the same Boards. " +
      "Area: the whole state for water, notified control areas for air. Consent: twenty-five and twenty-six, versus twenty-one. Directions: thirty-three-A versus thirty-one-A. " +
      "Citizen complaint: forty-nine versus forty-three, both after sixty days' notice. Pause the video and copy this table."
    );
  }

  // 35. EPA overview
  {
    const s = newSlide("Nyaya Content", U4.section, "Environment (Protection) Act, 1986: aims and objectives");
    const nm = next("z", "trigger");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.6, w: 4.2, h: 4.95, fill: { color: RED }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
    s.addImage({ data: await icon("FaSkullCrossbones", "white"), x: M + 1.6, y: 1.9, w: 1.0, h: 1.0, objectName: nm + "_i", altText: "Hazard" });
    txt(s, [{ text: "The trigger", options: { bold: true, fontSize: 20, breakLine: true } }, { text: "Bhopal gas tragedy, night of 2–3 December 1984: methyl isocyanate leaked from the Union Carbide plant. Existing laws were piecemeal; India needed one umbrella law.", options: { fontSize: 15 } }],
      { x: M + 0.3, y: 3.1, w: 3.6, h: 3.3, align: "left", color: WHITE }, nm + "_t");
    await card(s, { x: 5.0, y: 1.6, w: 7.73, h: 2.35, head: "Aims & objectives", body: ["Protect and improve the environment", "Implement the Stockholm decisions (Art 253)", "Fill gaps in earlier laws; coordinate authorities; deal with hazardous substances"], ic: "FaBullseye", bodySize: 14 });
    await card(s, { x: 5.0, y: 4.15, w: 3.78, h: 2.4, head: "Rules made under EPA", body: ["EIA Notification 2006", "CRZ Notifications", "Hazardous & solid waste rules", "Noise Rules 2000"], ic: "FaFileLines", bodySize: 14, iconFill: TEAL, iconColor: "white", headColor: TEAL });
    await card(s, { x: 8.95, y: 4.15, w: 3.78, h: 2.4, head: "Penalties & cognizance", body: ["Sec 15: penalties (Jan Vishwas Act 2023 replaced jail with monetary penalties for most contraventions)", "Sec 19: citizen complaint after 60 days’ notice"], ic: "FaGavel", bodySize: 14 });
    s.addNotes(
      "[VOICE ANCHOR: grave on Bhopal, then brisk]\n" +
      "On the night of the second and third of December, nineteen eighty-four, methyl isocyanate [MEE-thile eye-so-SY-a-nate] gas leaked from the Union Carbide plant in Bhopal. " +
      "The Water and Air Acts were not built for a disaster like that. So in nineteen eighty-six Parliament passed an umbrella law — the Environment Protection Act. " +
      "Its aims: protect and improve the environment, implement the Stockholm decisions, and fill the gaps in earlier laws. " +
      "Many rules you hear about — the EIA Notification, the CRZ Notifications, the waste rules and the Noise Rules — are all made under this Act. " +
      "Penalties are in Section fifteen, amended by the Jan Vishwas Act of twenty twenty-three, and Section nineteen allows citizen complaints."
    );
  }

  // 36. Sec 3 & 5
  {
    const s = newSlide("Nyaya Content", U4.section, "Why Sections 3 and 5 are the heart of EPA");
    const nm = next("u", "s3");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.6, w: 5.95, h: 4.95, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: nm + "_bg" });
    txt(s, "Sec 3", { x: M + 0.3, y: 1.75, w: 2.5, h: 0.9, fontSize: 44, bold: true, color: GOLD, fontFace: "Cambria", valign: "middle" }, nm + "_n");
    txt(s, "Power of the Central Government to take measures", { x: M + 0.3, y: 2.6, w: 5.35, h: 0.5, fontSize: 16, bold: true }, nm + "_h");
    txt(s, ["Lay down standards for emission and discharge of pollutants", "Restrict areas where industries may operate", "Procedures and safeguards for accidents and hazardous substances", "Sec 3(3): create authorities, e.g., Central Ground Water Authority"].map((t, j, a) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < a.length - 1, paraSpaceAfter: 6 } })),
      { x: M + 0.3, y: 3.2, w: 5.35, h: 3.2, fontSize: 14 }, nm + "_b");
    const n5 = next("u", "s5");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.78, y: 1.6, w: 5.95, h: 4.95, fill: { color: YEL }, line: { type: "none" }, rectRadius: 0.12, shadow: shadow(), objectName: n5 + "_bg" });
    txt(s, "Sec 5", { x: 7.08, y: 1.75, w: 2.5, h: 0.9, fontSize: 44, bold: true, color: SLATE, fontFace: "Cambria", valign: "middle" }, n5 + "_n");
    txt(s, "Power to give directions (overrides other laws in its field)", { x: 7.08, y: 2.6, w: 5.35, h: 0.5, fontSize: 16, bold: true, color: SLATE }, n5 + "_h");
    txt(s, ["To any person, officer or authority, who must comply", "Closure, prohibition or regulation of any industry, operation or process", "Stop or regulate electricity, water or any other service", "The legal basis for many closure orders by the Centre and Boards"].map((t, j, a) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < a.length - 1, paraSpaceAfter: 6 } })),
      { x: 7.08, y: 3.2, w: 5.35, h: 3.2, fontSize: 14, color: SLATE }, n5 + "_b");
    s.addNotes(
      "[VOICE ANCHOR: emphatic, slow on the two section numbers]\n" +
      "Your syllabus singles out two sections, so your examiner will too. **Section three** gives the Central Government power to take all measures it thinks necessary — set emission standards, restrict where industries may operate, and lay down safeguards for accidents. " +
      "Under Section three-three it can even create new authorities, like the Central Ground Water Authority. " +
      "**Section five** is the enforcement weapon. The Centre can direct any person, officer or authority — including closure of an industry, or stopping its electricity and water. " +
      "Section three is the power to plan. Section five is the power to act. Together they make the EPA an umbrella law."
    );
  }

  // 37. National Environment Tribunal -> NGT
  {
    const s = newSlide("Nyaya Content", U4.section, "From the National Environment Tribunal to the NGT");
    const steps = [
      ["1986–87", "Supreme Court in M.C. Mehta (Oleum) suggests specialised environment courts"],
      ["1995", "National Environment Tribunal Act: no-fault liability for accidents in handling hazardous substances; tribunal never effectively set up"],
      ["1997", "National Environment Appellate Authority Act: appeals on site clearances"],
      ["2010", "National Green Tribunal Act: Sec 38 repeals both 1995 and 1997 Acts; NGT set up 18 Oct 2010"],
    ];
    for (let i = 0; i < 4; i++) {
      const y = 1.6 + i * 1.05;
      const nm = next("w", "st" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y, w: 6.2, h: 0.92, fill: { color: i === 3 ? YEL : CARD }, line: { type: "none" }, rectRadius: 0.1, objectName: nm + "_bg" });
      txt(s, steps[i][0], { x: M + 0.2, y, w: 1.3, h: 0.92, fontSize: 18, bold: true, color: i === 3 ? SLATE : YEL, valign: "middle", fontFace: "Cambria" }, nm + "_y");
      txt(s, steps[i][1], { x: M + 1.55, y, w: 4.5, h: 0.92, fontSize: 14, valign: "middle", color: SLATE }, nm + "_t");
    }
    await card(s, { x: 7.0, y: 1.6, w: 5.73, h: 4.95, head: "NGT Act 2010: must-know sections", body: ["Sec 14: civil cases with a substantial question on environment", "Sec 15: relief, compensation and restitution", "Sec 16: appeals against orders under scheduled Acts", "Sec 17: no-fault liability for accidents", "Sec 19: not bound by CPC; natural justice", "Sec 20: apply SD, precaution, polluter pays", "Sec 22: appeal to Supreme Court within 90 days"], ic: "FaScaleBalanced", bodySize: 14 });
    const nt = next("u", "trap");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.9, w: 6.2, h: 0.65, fill: { color: RED }, line: { type: "none" }, rectRadius: 0.08, objectName: nt + "_bg" });
    txt(s, "Trap: Schedule I lists 7 Acts. The Wild Life (Protection) Act, 1972 is not one of them.", { color: WHITE, x: M + 0.2, y: 5.9, w: 5.8, h: 0.65, fontSize: 14, bold: true, valign: "middle" }, nt + "_t");
    s.addNotes(
      "[VOICE ANCHOR: narrative, then firm on the trap]\n" +
      "Your syllabus says National Environment Tribunal — so here is the story. After the oleum gas case, the Supreme Court suggested specialised environment courts. " +
      "Parliament passed the National Environment Tribunal Act in nineteen ninety-five, for no-fault liability in hazardous-substance accidents. But the tribunal was never effectively set up. " +
      "In nineteen ninety-seven came the National Environment Appellate Authority. " +
      "Then the National Green Tribunal Act, twenty ten, repealed both under Section thirty-eight. The NGT was set up on the eighteenth of October, twenty ten. " +
      "Remember Sections fourteen to seventeen, nineteen, twenty and twenty-two. **Prelims Trap** — and a law-exam trap too: the NGT's First Schedule lists seven Acts, and the Wild Life Protection Act is not one of them."
    );
  }

  // ================= UNIT V =================
  const U5 = { section: "Unit V: Forests, wildlife & biodiversity", num: "V" };
  pres.addSection({ title: U5.section });
  await divider(U5, "Forests, wildlife and biodiversity", "The living environment and the laws that guard it",
    ["Protection of Forest, Wild Life and Biodiversity", "Importance of Forest and need for its Conservation", "Indian Forest Act, 1927 and its Salient Features", "Forest Conservation Act, 1980 and its Salient Features", "Judicial Approach for Forest Conservation", "The Wildlife Protection Act 1972", "Sanctuaries and National Parks", "Licensing of Zoos and Parks", "Offences against Wild Life", "Biodiversity Conservation", "Biological Diversity Act, 2002 and its Salient Features", "National Green Tribunal Act, 2010 – An Appraisal"], "FaTree",
    "[VOICE ANCHOR: warm, a little slower]\nUnit Five. So far we protected air and water. Now we protect life itself — forests, wild animals and biodiversity.");

  await unitQuestions(U5, ["Explain the importance of forests and the salient features of the Indian Forest Act, 1927.", "Discuss the salient features of the Forest Conservation Act, 1980 and the judicial approach to forest conservation.", "Explain the salient features of the Wild Life (Protection) Act, 1972 and offences against wild life.", "Explain the salient features of the Biological Diversity Act, 2002.", "Critically appraise the National Green Tribunal Act, 2010."], ["Sanctuary vs national park", "Licensing of zoos", "Reserved forest", "Biodiversity conservation", "T.N. Godavarman case"]);

  // V1. Importance of forests
  {
    const s = newSlide("Nyaya Content", U5.section, "Importance of forests and the need for conservation");
    const imp = [["Ecological", "Protect soil, recharge groundwater, and shelter most land species", "FaTree"], ["Climate", "Store carbon and influence local rainfall and temperature", "FaCloudSun"], ["Economic", "Timber, fuelwood, bamboo and non-timber forest produce", "FaCoins"], ["Social", "Homes and livelihoods of tribal and forest-dwelling communities", "FaPeopleGroup"]];
    const cw = (W - 2 * M - 0.45) / 4;
    for (let i = 0; i < 4; i++) {
      await card(s, { x: M + i * (cw + 0.15), y: 1.6, w: cw, h: 2.3, head: imp[i][0], body: imp[i][1], ic: imp[i][2], headSize: 17 });
    }
    await card(s, { x: M, y: 4.1, w: 7.4, h: 2.45, head: "Why conservation is needed", body: ["Forest loss from mining, dams, roads, encroachment and fires", "National Forest Policy, 1988: aim for one-third of land under forest or tree cover", "Constitution: Art 48A, Art 51A(g); forests in the Concurrent List (Entry 17A)"], ic: "FaTriangleExclamation", iconFill: RED, iconColor: "white", headColor: RED });
    await card(s, { x: 8.2, y: 4.1, w: 4.53, h: 2.45, head: "The legal story in one line", body: "Indian Forest Act 1927 manages forests → Forest Conservation Act 1980 stops their diversion → the courts widen protection.", ic: "FaRoute", iconFill: TEAL, iconColor: "white", headColor: TEAL });
    s.addNotes(
      "[VOICE ANCHOR: warm, descriptive]\n" +
      "Why do forests matter? Four reasons. Ecological — they protect soil and water and shelter most land species. Climate — they store carbon. Economic — timber, bamboo and forest produce. " +
      "And social — they are home to tribal and forest-dwelling communities. " +
      "But forests are lost to mining, dams, roads and encroachment. The National Forest Policy of nineteen eighty-eight set a goal of one-third of our land under forest or tree cover. " +
      "Remember the story in one line: the Indian Forest Act manages forests, the Forest Conservation Act stops their diversion, and the courts widen protection."
    );
  }

  // V2. Indian Forest Act 1927
  {
    const s = newSlide("Nyaya Content", U5.section, "Indian Forest Act, 1927: salient features");
    rowTable(s, {
      x: M, y: 1.6, colW: [2.3, 3.6, 2.95, 3.28], rowH: [0.55, 0.95, 0.75], fontSize: 14,
      header: ["Feature", "Reserved forest", "Village forest", "Protected forest"],
      rows: [
        ["Chapter", "Ch II (Sec 3–27)", "Ch III (Sec 28)", "Ch IV (Sec 29–34)"],
        ["How created", "Notified by the State after a Forest Settlement Officer settles rights", "Reserved forest land assigned to a village community", "Notified over forest land that is not reserved"],
        ["Protection", "Highest: activities barred unless permitted", "Managed by the village for its own use", "Lower: activities allowed unless prohibited"],
      ],
    });
    const f = [["Ch V (Sec 35)", "Control over forests not owned by the Government"], ["Ch VII (Sec 41)", "Rules on transit of timber and forest produce"], ["Sec 52", "Seizure of property used in forest offences"], ["Sec 68", "Power to compound forest offences"]];
    const cw = (W - 2 * M - 0.45) / 4;
    f.forEach(([h, b], i) => {
      const nm = next("z", "f" + i);
      const x = M + i * (cw + 0.15);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 4.85, w: cw, h: 1.7, fill: { color: CARD2 }, line: { type: "none" }, rectRadius: 0.1, objectName: nm + "_bg" });
      txt(s, [{ text: h, options: { bold: true, color: GOLD, fontSize: 17, breakLine: true } }, { text: b, options: { fontSize: 14 } }], { x: x + 0.2, y: 4.95, w: cw - 0.4, h: 1.5 }, nm + "_t");
    });
    s.addNotes(
      "[VOICE ANCHOR: structured]\n" +
      "The Indian Forest Act of nineteen twenty-seven is a colonial law, built on the Acts of eighteen sixty-five and eighteen seventy-eight. Its aim was to manage forests and their produce. " +
      "It creates three classes. Reserved forests, under Chapter Two, get the highest protection — everything is barred unless permitted. Village forests, under Section twenty-eight, are managed by a village community. " +
      "Protected forests, under Chapter Four, get lower protection — everything is allowed unless prohibited. " +
      "Also note Section thirty-five on private forests, Section forty-one on transit of forest produce, Section fifty-two on seizure, and Section sixty-eight on compounding offences."
    );
  }

  // V3. Forest Conservation Act 1980
  {
    const s = newSlide("Nyaya Content", U5.section, "Forest Conservation Act, 1980: salient features");
    const nh = next("f", "h");
    txt(s, "SECTION 2: PRIOR APPROVAL OF THE CENTRAL GOVERNMENT IS NEEDED TO…", { x: M, y: 1.55, w: 7.6, h: 0.35, fontSize: 14, bold: true, color: GOLD, charSpacing: 1 }, nh);
    const r = [["De-reserve", "a reserved forest", "FaUnlock"], ["Use forest land", "for any non-forest purpose", "FaIndustry"], ["Lease forest land", "to a private person or body", "FaFileSignature"], ["Clear natural trees", "to raise a plantation", "FaTree"]];
    for (let i = 0; i < 4; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      await card(s, { x: M + col * 3.85, y: 2.0 + row * 1.6, w: 3.7, h: 1.45, head: r[i][0], body: r[i][1], ic: r[i][2], headSize: 17, bodySize: 15 });
    }
    await card(s, { x: M, y: 5.25, w: 7.55, h: 1.3, head: null, body: "Also: Sec 3 Advisory Committee; Sec 3A and 3B penalties, including for officials; compensatory afforestation under the CAF Act, 2016 (CAMPA).", eff: "f", fill: CARD2, label: "also" });
    await card(s, { x: 8.4, y: 1.55, w: 4.33, h: 5.0, head: "2023 amendment", body: ["Renamed the Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980", "Covers notified forests and land recorded as forest", "Exempts some strategic and security projects near borders", "Under challenge in the Supreme Court; in 2024 it directed that the wide Godavarman meaning of “forest” continue meanwhile"], ic: "FaPenToSquare", iconFill: TEAL, iconColor: "white", headColor: TEAL });
    s.addNotes(
      "[VOICE ANCHOR: firm on Section two]\n" +
      "The Indian Forest Act managed forests. But forests kept disappearing. So in nineteen eighty came the Forest Conservation Act — a short Act with one powerful section. " +
      "**Section two.** No State can, without prior approval of the Central Government, de-reserve a reserved forest, use forest land for a non-forest purpose, lease it to a private party, or clear natural trees to raise a plantation. " +
      "Section three creates an Advisory Committee, and compensatory afforestation is now governed by the CAF Act of twenty sixteen. " +
      "In twenty twenty-three the Act was amended and renamed the Van Sanrakshan Evam Samvardhan [VUN Sun-RUK-shun AY-vum Sum-VAR-dhun] Adhiniyam. The amendment is under challenge, and the Supreme Court has told authorities to keep using the wide Godavarman meaning of forest meanwhile."
    );
  }

  // V4. Judicial approach
  {
    const s = newSlide("Nyaya Content", U5.section, "Judicial approach to forest conservation");
    const cases = [
      ["T.N. Godavarman Thirumulpad v UoI (1996 on)", "“Forest” takes its dictionary meaning, whatever the ownership; FCA applies to all forests; Central Empowered Committee set up; continuing mandamus.", "FaGavel", CARD, GOLD, YEL, "slate"],
      ["Banwasi Seva Ashram v State of UP (1986)", "Balanced industrial need (a power project) with the rights of forest-dwelling tribals; ordered rehabilitation safeguards.", "FaPeopleGroup", CARD, GOLD, YEL, "slate"],
      ["Telugu States Lens · Samatha v State of AP (1997)", "Government, forest and tribal land in Scheduled Areas cannot be leased to non-tribals or private companies for mining (Fifth Schedule).", "FaMountain", CARD2, TEAL, TEAL, "white"],
      ["Orissa Mining Corp v MoEF (2013), Niyamgiri", "Gram sabhas must decide whether mining affects the religious and cultural rights of forest dwellers under the Forest Rights Act, 2006.", "FaLandmark", CARD, GOLD, YEL, "slate"],
    ];
    for (let i = 0; i < 4; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      const [h, b, ic, fill, hc, icf, icc] = cases[i];
      await card(s, { x: M + col * 6.14, y: 1.6 + row * 2.55, w: 5.99, h: 2.4, head: h, body: b, ic, fill, headColor: hc, iconFill: icf, iconColor: icc, headSize: 16, bodySize: 15 });
    }
    s.addNotes(
      "[VOICE ANCHOR: storytelling]\n" +
      "Courts have been the strongest guardians of our forests. In T. N. Godavarman Thirumulpad, from nineteen ninety-six, the Supreme Court said forest means forest in its dictionary sense, whoever owns it. " +
      "In Banwasi Seva Ashram, nineteen eighty-six, the court balanced a power project against the rights of forest-dwelling tribals. " +
      "**Telugu States Lens.** Samatha versus State of Andhra Pradesh, nineteen ninety-seven. Land in the Scheduled Areas could not be leased to private companies for mining. A must for Group-1. " +
      "And in the Niyamgiri [Ni-yam-GI-ree] case of twenty thirteen, the gram sabhas were given the final say on how mining affected their rights."
    );
  }

  // V5. Wild Life (Protection) Act 1972
  {
    const s = newSlide("Nyaya Content", U5.section, "Wild Life (Protection) Act, 1972: salient features");
    const facts = [
      ["Art 252", "Passed on state resolutions; wildlife moved to the Concurrent List (17B) in 1976", "FaLandmark"],
      ["Sec 5A", "National Board for Wild Life, chaired by the Prime Minister", "FaUsers"],
      ["Sec 9", "Hunting of scheduled animals prohibited, except as allowed by Sec 11 and 12", "FaBan"],
      ["Schedules", "Graded protection; the 2022 amendment reduced six schedules to four", "FaLayerGroup"],
      ["Sec 39", "Wild animals hunted or found dead become government property", "FaBuildingColumns"],
      ["Ch VA", "Ban on trade in scheduled animal articles; CITES provisions added in 2022", "FaShieldHalved"],
    ];
    for (let i = 0; i < 6; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      const x = M + col * 3.95, y = 1.6 + row * 1.68;
      const nm = next("z", "w" + i);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.8, h: 1.5, fill: { color: CARD }, line: { type: "none" }, rectRadius: 0.1, objectName: nm + "_bg" });
      await iconCircle(s, facts[i][2], x + 0.18, y + 0.2, 0.6, YEL, "slate", nm);
      txt(s, facts[i][0], { x: x + 0.9, y: y + 0.2, w: 2.7, h: 0.6, fontSize: 17, bold: true, color: GOLD, valign: "middle" }, nm + "_h");
      txt(s, facts[i][1], { x: x + 0.18, y: y + 0.85, w: 3.45, h: 0.6, fontSize: 14 }, nm + "_b");
    }
    await card(s, { x: 8.55, y: 1.6, w: 4.18, h: 4.88, head: "Authorities", body: ["Chief Wild Life Warden (Sec 4)", "State Board for Wild Life (Sec 6)", "Central Zoo Authority (Sec 38A)", "National Tiger Conservation Authority (Sec 38L)", "Wildlife Crime Control Bureau (Sec 38Y)"], ic: "FaSitemap", iconFill: TEAL, iconColor: "white", headColor: TEAL });
    s.addNotes(
      "[VOICE ANCHOR: steady, section by section]\n" +
      "The Wild Life Protection Act of nineteen seventy-two was passed under Article two fifty-two, because wildlife was then a State subject. In nineteen seventy-six it moved to the Concurrent List. " +
      "Section five-A creates the National Board for Wild Life, chaired by the Prime Minister. Section nine prohibits hunting of scheduled animals. " +
      "The schedules give graded protection — the twenty twenty-two amendment reduced them from six to four. " +
      "Section thirty-nine makes wild animals that are hunted or found dead government property, and Chapter Five-A bans trade in scheduled animal articles. " +
      "On the right, the authorities: the Chief Wild Life Warden, the Central Zoo Authority, the NTCA and the Wildlife Crime Control Bureau."
    );
  }

  // V6. Sanctuary vs National Park
  {
    const s = newSlide("Nyaya Content", U5.section, "Sanctuaries vs national parks");
    rowTable(s, {
      x: M, y: 1.6, colW: [2.9, 4.62, 4.61], rowH: 0.58, fontSize: 15,
      header: ["Point", "Sanctuary", "National park"],
      rows: [
        ["Declared under", "Sec 18 (State); Centre under Sec 38", "Sec 35 (State); Centre under Sec 38"],
        ["People’s rights", "May continue if the Collector allows them", "All rights must be extinguished"],
        ["Grazing", "May be regulated or permitted", "Prohibited (Sec 35(7))"],
        ["Changing boundaries", "Only on NBWL recommendation (Sec 26A(3))", "Only on NBWL recommendation (Sec 35(5))"],
        ["Level of protection", "High", "Highest"],
      ],
    });
    const pa = [["Conservation reserve", "Sec 36A: on government land next to protected areas"], ["Community reserve", "Sec 36C: on community or private land, with people’s consent"], ["Tiger reserve", "Sec 38V: notified on NTCA advice (2006 amendment)"]];
    const cw = (W - 2 * M - 0.3) / 3;
    pa.forEach(([h, b], i) => {
      const nm = next("u", "pa" + i);
      const x = M + i * (cw + 0.15);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 5.3, w: cw, h: 1.25, fill: { color: i === 2 ? TEAL : CARD2 }, line: { type: "none" }, rectRadius: 0.1, objectName: nm + "_bg" });
      txt(s, [{ text: h, options: { bold: true, fontSize: 16, breakLine: true, color: i === 2 ? WHITE : GOLD } }, { text: b, options: { fontSize: 14, color: i === 2 ? WHITE : SLATE } }], { x: x + 0.2, y: 5.38, w: cw - 0.4, h: 1.1 }, nm + "_t");
    });
    s.addNotes(
      "[VOICE ANCHOR: comparative, clear]\n" +
      "A favourite exam question: sanctuary versus national park. Both are declared by the State Government — sanctuaries under Section eighteen, national parks under Section thirty-five — and the Centre can declare either under Section thirty-eight. " +
      "In a sanctuary, some rights of people may continue, and grazing may be allowed. In a national park, all rights must be extinguished, and grazing is prohibited. " +
      "Boundaries of either can change only on the recommendation of the National Board for Wild Life. " +
      "Add three newer categories: conservation reserves, community reserves, and tiger reserves."
    );
  }

  // V7. Zoos & offences
  {
    const s = newSlide("Nyaya Content", U5.section, "Licensing of zoos and offences against wild life");
    await card(s, { x: M, y: 1.6, w: 5.99, h: 3.2, head: "Zoos (Chapter IVA)", body: ["Central Zoo Authority set up under Sec 38A (1991 amendment)", "Sec 38H: no zoo may operate without recognition from the CZA", "CZA sets standards for housing, upkeep and veterinary care", "Recognition can be refused or withdrawn"], ic: "FaPaw" });
    await card(s, { x: 6.74, y: 1.6, w: 5.99, h: 3.2, head: "Offences and enforcement", body: ["Sec 51: penalties; harsher for Schedule I animals and offences in sanctuaries or national parks", "Sec 50: powers of entry, search, seizure and arrest", "Sec 55: courts act on complaint by officers, or by a citizen after 60 days’ notice"], ic: "FaGavel", iconFill: RED, iconColor: "white", headColor: RED });
    await card(s, { x: M, y: 5.0, w: W - 2 * M, h: 1.55, head: "Centre for Environmental Law, WWF-I v Union of India (2013)", body: "The Supreme Court ordered relocation of some Asiatic lions from Gir to Kuno, taking a species-first approach: protecting an endangered species comes before local or state pride.", ic: "FaScaleBalanced", fill: CARD2, headSize: 16, bodySize: 14 });
    s.addNotes(
      "[VOICE ANCHOR: steady]\n" +
      "Your syllabus mentions licensing of zoos. Since nineteen ninety-one, the Central Zoo Authority under Section thirty-eight-A regulates zoos. Under Section thirty-eight-H, no zoo may operate without its recognition. " +
      "Offences: Section fifty-one lays down penalties, which are harsher for Schedule One animals and for offences inside sanctuaries and national parks. Section fifty gives powers of search and arrest, and under Section fifty-five even a citizen can complain after sixty days' notice. " +
      "And a case to quote: Centre for Environmental Law, WWF-India versus Union of India, twenty thirteen — the Asiatic lions case, where the court put the species first."
    );
  }

  // V8. Biological Diversity Act 2002
  {
    const s = newSlide("Nyaya Content", U5.section, "Biodiversity conservation: Biological Diversity Act, 2002");
    const tiers = [["National Biodiversity Authority", "Sec 8 · Chennai"], ["State Biodiversity Boards", "Sec 22"], ["Biodiversity Management Committees", "Sec 41 · local bodies; People’s Biodiversity Registers"]];
    for (let i = 0; i < 3; i++) {
      const nm = next("w", "tier" + i);
      const x = M + i * 4.1;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.6, w: 3.75, h: 1.35, fill: { color: i === 0 ? YEL : CARD }, line: { type: "none" }, rectRadius: 0.1, objectName: nm + "_bg" });
      txt(s, [{ text: tiers[i][0], options: { bold: true, fontSize: 16, breakLine: true } }, { text: tiers[i][1], options: { fontSize: 14 } }], { x: x + 0.2, y: 1.6, w: 3.35, h: 1.35, valign: "middle" }, nm + "_t");
      if (i < 2) s.addShape(pres.shapes.RIGHT_ARROW, { x: x + 3.8, y: 2.1, w: 0.26, h: 0.35, fill: { color: MUTED }, line: { type: "none" }, objectName: nm + "_ar" });
    }
    rowTable(s, {
      x: M, y: 3.2, colW: [1.7, 6.0], rowH: 0.48, fontSize: 14,
      header: ["Section", "Rule"],
      rows: [
        ["Sec 3", "Foreigners need NBA approval to access biological resources"],
        ["Sec 6", "Patents based on Indian biological resources need NBA approval"],
        ["Sec 7", "Indian entities give prior intimation to the SBB"],
        ["Sec 21", "Fair and equitable benefit sharing"],
        ["Sec 37", "State may notify biodiversity heritage sites"],
      ],
    });
    await card(s, { x: 8.6, y: 3.2, w: 4.13, h: 3.35, head: "Why it matters", body: ["Implements the CBD, 1992 and the Nagoya Protocol", "Fights biopiracy: US turmeric patent revoked (1997); European neem patent revoked", "2023 amendment: decriminalised offences; eased rules for AYUSH and codified traditional knowledge"], ic: "FaSeedling", iconFill: TEAL, iconColor: "white", headColor: TEAL, bodySize: 14 });
    s.addNotes(
      "[VOICE ANCHOR: clear]\n" +
      "India implemented the Convention on Biological Diversity through the Biological Diversity Act, two thousand two. It has a three-tier structure: the National Biodiversity Authority in Chennai, State Biodiversity Boards, and Biodiversity Management Committees at the local level, which keep People's Biodiversity Registers. " +
      "Key sections: Section three — foreigners need NBA approval. Section six — patents based on Indian biological resources need NBA approval. Section seven — Indian entities inform the State Board. Section twenty-one — benefit sharing. Section thirty-seven — biodiversity heritage sites. " +
      "Why does it matter? Biopiracy. India fought and won the revocation of the turmeric and neem patents abroad."
    );
  }

  // V9. NGT appraisal
  {
    const s = newSlide("Nyaya Content", U5.section, "National Green Tribunal Act, 2010: an appraisal");
    await card(s, { x: M, y: 1.6, w: 5.99, h: 3.55, head: "Strengths", body: ["Specialised forum of judicial and expert members (Sec 4)", "Applies SD, precaution and polluter pays (Sec 20)", "Not bound by CPC; aims to decide within six months (Sec 18(3))", "Suo motu power upheld: MCGM v Ankita Sinha (2021)", "Benches at Delhi, Bhopal, Pune, Kolkata and Chennai"], ic: "FaThumbsUp", iconFill: TEAL, iconColor: "white", headColor: TEAL });
    await card(s, { x: 6.74, y: 1.6, w: 5.99, h: 3.55, head: "Concerns", body: ["Vacancies and few benches limit access for distant litigants", "Wild Life (Protection) Act and Forest Rights Act are outside Schedule I", "Orders are not always complied with", "Overlap and friction with High Court jurisdiction", "Appeals to the Supreme Court can add delay"], ic: "FaTriangleExclamation", iconFill: RED, iconColor: "white", headColor: RED });
    await card(s, { x: M, y: 5.35, w: W - 2 * M, h: 1.2, head: "Way forward", body: "Fill vacancies, add circuit benches, widen Schedule I to cover wildlife and forest-rights laws, and monitor compliance of orders.", ic: "FaRoute", fill: CARD2, headSize: 16, bodySize: 15 });
    s.addNotes(
      "[VOICE ANCHOR: balanced, evaluative]\n" +
      "Your syllabus says: the NGT Act, an appraisal. Appraisal means strengths and weaknesses. " +
      "Strengths: a specialised forum with judicial and expert members; Section twenty makes it apply sustainable development, precaution and polluter pays; it is not bound by the Civil Procedure Code and tries to decide within six months; and in Ankita Sinha, twenty twenty-one, the Supreme Court upheld its suo motu power. " +
      "Concerns: vacancies and few benches; the Wild Life Act and the Forest Rights Act are outside its Schedule; compliance with its orders is uneven; and there is friction with High Courts. " +
      "End your answer with a way forward: fill vacancies, add circuit benches, widen Schedule One, and monitor compliance."
    );
  }

  // ================= CLOSING =================
  pres.addSection({ title: "Revision" });
  // 38. Year recap
  {
    const s = newSlide("Nyaya Content", "Revision", "Rapid revision: fourteen years to remember");
    const yrs = [["1927", "Indian Forest Act"], ["1971", "Ramsar"], ["1972", "Stockholm; Wild Life Act"], ["1974", "Water Act"], ["1976", "42nd Amendment"], ["1980", "Forest Conservation Act"], ["1981", "Air Act"], ["1986", "EPA"], ["1987", "Brundtland; Oleum case"], ["1992", "Rio, CBD"], ["1997", "Kyoto; Kamal Nath"], ["2002", "Johannesburg; Biological Diversity Act"], ["2010", "NGT Act"], ["2023", "BNS, BNSS"]];
    const cw = 1.6, ch = 2.35, gx = (W - 2 * M - 7 * cw) / 6;
    yrs.forEach(([y, l], i) => {
      const col = i % 7, row = Math.floor(i / 7);
      const x = M + col * (cw + gx), yy = 1.65 + row * (ch + 0.25);
      const nm = next("z", "y" + y);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: yy, w: cw, h: ch, fill: { color: row === 0 ? CARD : CARD2 }, line: { type: "none" }, rectRadius: 0.1, shadow: shadow(), objectName: nm + "_bg" });
      txt(s, y, { x, y: yy + 0.3, w: cw, h: 0.8, fontSize: 28, bold: true, color: GOLD, align: "center", valign: "middle", fontFace: "Cambria" }, nm + "_y");
      txt(s, l, { x: x + 0.1, y: yy + 1.1, w: cw - 0.2, h: 1.15, fontSize: 14, align: "center" }, nm + "_l");
    });
    s.addNotes(
      "[VOICE ANCHOR: rapid-fire round, energetic, smile in the voice]\n" +
      "Rapid revision. Say them with me. Nineteen twenty-seven — the Indian Forest Act. Seventy-one — Ramsar. Seventy-two — Stockholm, and the Wild Life Act. Seventy-four — Water Act. Seventy-six — forty-second Amendment. Eighty — Forest Conservation Act. " +
      "Eighty-one — Air Act. Eighty-six — EPA. Eighty-seven — Brundtland, and the Oleum gas case. Ninety-two — Rio. Ninety-seven — Kyoto, and Kamal Nath. " +
      "Two thousand two — Johannesburg, and the Biological Diversity Act. Twenty ten — the NGT. And twenty twenty-three — the BNS and BNSS. If you know these fourteen, you have the skeleton of the whole paper."
    );
  }

  // 40. Closing verdict
  {
    const s = newSlide("Nyaya Title", "Revision", null);
    s.addText("The Constitution calls it a duty. The courts made it a right.", { placeholder: "title" });
    s.addText("Environmental law works only when citizens remember Article 51A(g).", { placeholder: "body" });
    const nm = next("z", "hero");
    s.addImage({ path: EMBLEM, x: 8.55, y: 1.15, w: 4.2, h: 4.2, objectName: nm + "_logo", altText: "Nyaya Patashala logo" });
    const nc = next("u", "cta");
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.6, w: 7.6, h: 0.8, fill: { color: YEL }, line: { type: "none" }, rectRadius: 0.1, objectName: nc + "_bg" });
    txt(s, "Subscribe to Nyaya Patashala and post your doubts in the comments", { x: M + 0.25, y: 5.6, w: 7.1, h: 0.8, fontSize: 16, bold: true, color: SLATE, valign: "middle" }, nc + "_t");
    s.addNotes(
      "[VOICE ANCHOR: warm, slower, smile in the voice on the last line]\n" +
      "Look at the journey we took today. Our Constitution first called protecting the environment a duty — a Directive Principle and a Fundamental Duty. " +
      "Then our judges read it into Article twenty-one and made it a right. But a right that no one defends... is only words on paper. " +
      "Every law in this paper finally depends on citizens who remember Article fifty-one-A-g. As a future lawyer, you will be one of them. " +
      "Subscribe to Nyaya Patashala, and post your doubts in the comments. I will see you in the next class."
    );
  }

  const out = process.argv[2] || "deck.pptx";
  await pres.writeFile({ fileName: out });
  await applyTheme(out, THEME);
  console.log("wrote", out);
}
function y0(v) { return v; }

build().catch((e) => { console.error(e); process.exit(1); });
