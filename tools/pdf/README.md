# Weekly notes PDF builder

Converts `weeks/YYYY-Www/05-weekly-notes-mcq.md` into the branded A4 PDF.

```bash
W=2026-W43
pandoc weeks/$W/05-weekly-notes-mcq.md -f markdown-fancy_lists -t html5 -s \
  --css style.css --metadata pagetitle="Decode UPSC $W Notes" -o tools/pdf/notes.html
cd tools/pdf && node render.js "$PWD/notes.html" "../../weeks/$W/$W-Decode-UPSC-Notes.pdf"
```

Needs pandoc and Playwright (Chromium). Write MCQ options inside a `::: opts` block, as in W43. Update the footer week label in `render.js` each week.
