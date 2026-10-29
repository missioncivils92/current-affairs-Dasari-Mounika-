"""Show spoken numbers as digits in the recording file (owner request, 29 Oct 2026: number words are hard to read aloud).

The master script keeps numbers spelled out as they are spoken (CLAUDE.md §5.5), because the renderer's word cues
and the narration alignment match on those words. Only 02b-voiceover-text.md, the file Mounika reads from, shows digits.

  sixty point seven two per cent      -> 60.72%
  fifty-two thousand eight hundred    -> 52,800
  the twenty-eighth of October        -> the 28th of October
  Article two-four-three D, clause six -> Article 243D, clause 6
  two-twenty-four A                   -> 224A
  week forty-four, Stage One          -> week 44, Stage 1

Small numbers (one to nine) stay as words in ordinary prose ("only two", "one honest week"), and become digits
before a unit or after a label (4 metres, Stage 1, section 6).
"""
import re

UNITS = {w: i for i, w in enumerate("zero one two three four five six seven eight nine".split())}
TEENS = {w: i + 10 for i, w in enumerate("ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split())}
TENS = {w: (i + 2) * 10 for i, w in enumerate("twenty thirty forty fifty sixty seventy eighty ninety".split())}
ORD = {"first": 1, "second": 2, "third": 3, "fourth": 4, "fifth": 5, "sixth": 6, "seventh": 7, "eighth": 8, "ninth": 9,
       "tenth": 10, "eleventh": 11, "twelfth": 12, "thirteenth": 13, "fourteenth": 14, "fifteenth": 15, "sixteenth": 16,
       "seventeenth": 17, "eighteenth": 18, "nineteenth": 19, "twentieth": 20, "thirtieth": 30, "fortieth": 40,
       "fiftieth": 50, "sixtieth": 60, "seventieth": 70, "eightieth": 80, "ninetieth": 90, "hundredth": 100}
SIMPLE = {**UNITS, **TEENS, **TENS}
NUMWORD = set(SIMPLE) | {"hundred", "thousand"} | set(ORD)     # "million" stays a word: 100 million
UNIT_AFTER = r"(?:per cent|percent|degrees?|metres?|kilometres?|kilograms?|million|crore|lakh|rupees|dollars|acres)"     # measurements only; "three days" stays in words
LABEL_BEFORE = r"(?:Article|Articles|article|section|sections|clause|Clause|Stage|stage|Topic|topic|week|Week|COP|Schedule|Part|statement|statements|Paper|paper)"
MONTHS = r"(?:January|February|March|April|May|June|July|August|September|October|November|December)"


def suffix(n):
    return "th" if 10 <= n % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")


def parts(tok):
    return tok.lower().split("-")


def is_num(tok):
    p = parts(tok)
    return all(x in NUMWORD for x in p) and p != [""]


def value(words):
    """Value of a run of number words: (int, is_ordinal) or None. Handles 'one hundred and sixty-nine',
    'fifty-two thousand eight hundred', and article-style chains such as 'two-fourteen' or 'two-four-three'."""
    flat = [x for w in words for x in parts(w)]
    if len(words) == 1 and "-" in words[0]:                          # article chain: 2-14 -> 214, 2-4-3 -> 243
        p = parts(words[0])
        if p[0] in UNITS and len(p) > 1 and p[1] != "hundred":
            rest = p[1:]
            if rest[0] in TENS and len(rest) == 2 and rest[1] in UNITS:
                tail = str(TENS[rest[0]] + UNITS[rest[1]])
            elif all(r in UNITS for r in rest):
                tail = "".join(str(UNITS[r]) for r in rest)
            elif len(rest) == 1 and rest[0] in SIMPLE:
                tail = str(SIMPLE[rest[0]])
            else:
                return None
            return int(str(UNITS[p[0]]) + tail), False
    total = cur = 0
    ordinal = False
    for i, w in enumerate(flat):
        if w in ORD:
            if i != len(flat) - 1:
                return None
            ordinal = True
            v = ORD[w]
            if v == 100:
                cur = (cur or 1) * 100
            else:
                cur += v
        elif w in SIMPLE:
            cur += SIMPLE[w]
        elif w == "hundred":
            cur = (cur or 1) * 100
        elif w == "thousand":
            total += (cur or 1) * 1000; cur = 0
        elif w == "million":
            total += (cur or 1) * 1_000_000; cur = 0
        else:
            return None
    return total + cur, ordinal


def fmt(n):
    return f"{n:,}" if n >= 1000 else str(n)


TOKEN = re.compile(r"[A-Za-z]+(?:-[A-Za-z]+)*")


def to_digits(text):
    toks = list(TOKEN.finditer(text))
    out, last, i = [], 0, 0
    while i < len(toks):
        m = toks[i]
        if not is_num(m.group()):
            i += 1; continue
        # grow a run: number words joined by spaces, "and" after hundred/thousand, or "point" decimals
        j, words, decimal = i, [m.group()], None
        while j + 1 < len(toks):
            gap = text[toks[j].end():toks[j + 1].start()]
            nxt = toks[j + 1].group()
            if gap != " ":
                break
            if is_num(nxt) and not parts(words[-1])[-1] in ORD:
                if "-" in nxt and parts(nxt)[0] in UNITS and len(words) >= 1 and parts(nxt)[1:2] != ["hundred"]:
                    break                                            # an article chain starts a new run
                words.append(nxt); j += 1; continue
            if nxt.lower() == "and" and parts(words[-1])[-1] in ("hundred", "thousand") and j + 2 < len(toks) \
                    and text[toks[j + 1].end():toks[j + 2].start()] == " " and is_num(toks[j + 2].group()):
                words.append("and"); j += 1; continue
            if nxt.lower() == "point" and decimal is None and j + 2 < len(toks) and toks[j + 2].group().lower() in UNITS:
                k, digs = j + 2, []
                while k < len(toks) and toks[k].group().lower() in UNITS and (k == j + 2 or text[toks[k - 1].end():toks[k].start()] == " "):
                    digs.append(str(UNITS[toks[k].group().lower()])); k += 1
                decimal = "".join(digs); j = k - 1
                break
            break
        core = [w for w in words if w.lower() != "and"]
        v = value(core)
        if v is None:
            i += 1; continue
        n, ordinal = v
        start, end = m.start(), toks[j].end()
        before = text[max(0, start - 40):start]
        after = text[end:end + 26]
        small = n < 10 and decimal is None and len(core) == 1 and "-" not in core[0]
        if small:
            date = ordinal and re.match(r" of " + MONTHS, after)
            unit = not ordinal and re.match(r" " + UNIT_AFTER, after)
            label = re.search(LABEL_BEFORE + r"(?: [a-z]+,)*(?: [a-z]+ (?:and|or))? $", before)   # "statements one and three"
            if not (date or unit or label):
                i = j + 1; continue
        s = fmt(n) + (suffix(n) if ordinal else "") + (f".{decimal}" if decimal else "")
        out.append(text[last:start]); out.append(s); last = end; i = j + 1
    out.append(text[last:])
    res = "".join(out)
    res = re.sub(r"(\d) (per cent|percent)\b", r"\1%", res)
    res = re.sub(r"\b(\d{2,3}) ([A-D])\b(?=[,.;: ]|$)", r"\1\2", res)    # Article 243 D -> 243D, 224 A -> 224A
    return res


if __name__ == "__main__":
    tests = {
        "sixty point seven two per cent": "60.72%",
        "about fifty-two thousand eight hundred crore rupees": "about 52,800 crore rupees",
        "on the twenty-eighth of October": "on the 28th of October",
        "Article two-four-three D, clause six, only": "Article 243D, clause 6, only",
        "two-twenty-four A, retired judges": "224A, retired judges",
        "Article two-fourteen gives": "Article 214 gives",
        "one hundred and sixty-nine adopted": "169 adopted",
        "from one hundred and eighteen to one hundred and sixty-six": "from 118 to 166",
        "week forty-four, Stage One at poor": "week 44, Stage 1 at poor",
        "only two: statements one and three": "only two: statements 1 and 3",
        "Four metres sounds small": "4 metres sounds small",
        "one hundredth of one hundred and twenty-two countries": "100th of 122 countries",
        "twenty-four point one, in the serious": "24.1, in the serious",
        "one honest week at a time": "one honest week at a time",
        "the twelfth BRICS Parliamentary Forum": "the 12th BRICS Parliamentary Forum",
        "a one-time twenty thousand rupees": "a one-time 20,000 rupees",
        "the first of November": "the 1st of November",
        "First, swap the body": "First, swap the body",
        "two point eight degrees": "2.8 degrees",
        "Thirteen countries gave thirteen names each": "13 countries gave 13 names each",
        "from one hundred million to five million dollars": "from 100 million to 5 million dollars",
        "section forty-four of the same Act": "section 44 of the same Act",
        "thirty by thirty means": "30 by 30 means",
        "four thousand rupees a month": "4,000 rupees a month",
        "Four alliances, four years, two cities": "Four alliances, four years, two cities",
        "three days to note": "three days to note",
    }
    bad = 0
    for k, v in tests.items():
        got = to_digits(k)
        if got != v:
            bad += 1; print(f"FAIL: {k!r} -> {got!r} (want {v!r})")
    print("ok" if not bad else f"{bad} failed")
