"""Build the narration-script HTML (speaker notes only) from a deck. Usage: python3 make_script_pdf.py deck.pptx out.html
Then print to PDF, e.g. with Playwright page.pdf()."""
import re, html, sys
from pptx import Presentation
p = Presentation(sys.argv[1]); blocks = []; total = 0
for i, sl in enumerate(p.slides, 1):
    title = ''
    for sh in sl.shapes:
        if sh.is_placeholder and sh.placeholder_format.type in (1, 3) and sh.has_text_frame:
            title = sh.text_frame.text.replace('\n', ' ').strip(); break
    note = sl.notes_slide.notes_text_frame.text if sl.has_notes_slide else ''
    note = re.sub(r'^\[VOICE ANCHOR[^\]]*\]\s*', '', note.strip())
    w = len(re.sub(r'\[[^\]]*\]', '', note).split()); total += w
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', html.escape(note))
    t = re.sub(r'\[([^\]]+)\]', r'<span class="pr">[\1]</span>', t)
    blocks.append((i, title or 'Opening', t, sl.slide_layout.name == 'Nyaya Unit'))
parts = []
for i, title, t, unit in blocks:
    if unit: parts.append(f'<h2>Unit: {html.escape(title)}</h2>')
    parts.append(f'<div class="sl"><div class="lab">Slide {i} · {html.escape(title)}</div><p>{t}</p></div>')
open(sys.argv[2], 'w').write(f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
<style>body{{font-family:Merriweather,Georgia,serif;color:#14202e;font-size:12pt;line-height:1.75}}
h1{{font-family:Poppins,sans-serif;color:#0A1F3A;font-size:22pt;margin:0}}.sub{{font-family:Poppins,sans-serif;color:#8C6200;font-size:11pt;margin:4px 0}}
.meta{{font-family:Poppins,sans-serif;color:#51617A;font-size:9.5pt;margin-bottom:14px}}h2{{font-family:Poppins,sans-serif;color:#0F7F8C;font-size:15pt;margin:26px 0 6px;break-after:avoid}}
.sl{{margin:0 0 14px;break-inside:avoid}}.lab{{font-family:Poppins,sans-serif;font-size:9pt;font-weight:700;color:#8C6200;letter-spacing:.5px;text-transform:uppercase;break-after:avoid}}
p{{margin:2px 0 0}}.pr{{color:#51617A;font-size:10pt;font-style:italic}}b{{color:#0A1F3A}}</style></head><body>
<h1>Environmental Laws, Decoded: Narration Script</h1><div class="sub">Nyaya Patashala · LL.B (3YDC) Semester I · Paper V · All 5 units</div>
<div class="meta">{len(blocks)} slides · about {total:,} words · roughly {round(total/135)} minutes at 135 words per minute. Grey italic brackets are pronunciation hints; bold words are stressed; “...” is a deliberate pause.</div>
{''.join(parts)}</body></html>''')
print(len(blocks), total, round(total/135))
