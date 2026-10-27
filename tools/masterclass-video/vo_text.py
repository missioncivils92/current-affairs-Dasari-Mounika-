"""Word normaliser shared by align_vo.py (what the recogniser hears) and timeline.py (mapping script words to it)."""
import re

YEARS = {"2014": "twenty fourteen", "2022": "twenty twenty two", "2023": "twenty twenty three", "2003": "two thousand three",
         "2026": "twenty twenty six", "1936": "nineteen thirty six", "1977": "nineteen seventy seven", "1949": "nineteen forty nine",
         "1953": "nineteen fifty three", "2025": "twenty twenty five"}

def norm(t):
    for k, v in YEARS.items():
        t = t.replace(k, v)
    t = re.sub(r"\bUN\b", "U N", t).replace("’", "'")
    t = re.sub(r"[—–\-/]", " ", t.lower())
    return [w for w in re.sub(r"[^a-z' ]", " ", t).split() if w.strip("'")]


