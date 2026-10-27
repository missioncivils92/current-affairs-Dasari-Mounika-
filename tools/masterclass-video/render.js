// Render a masterclass timeline to MP4 (or stills) with Playwright + ffmpeg.
//
//   node render.js <assets_dir> <timeline.json> <scene_file.js> <out.mp4> [--review] [--strict] [--fps 30] [--from s] [--to s]
//   --strict stops the render if any word cue (s.w("...") in a scene) is missing from the narration.
//   node render.js <assets_dir> <timeline.json> <scene_file.js> <out_dir> --stills 12.5,40,95
//
// <assets_dir> must contain: fonts/local.css (+ ttf), d3.min.js, geo.json, terrain/*.png|json, sat/*.png|json.
// Audio: pass --audio <file> to mux a narration track (the final cut); preview renders are silent.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const [assets, tlFile, sceneFile, out] = process.argv.slice(2, 6).map(p => path.resolve(p));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const fps = +arg('--fps', 30), review = process.argv.includes('--review');
const stills = arg('--stills', null), audio = arg('--audio', null);

(async () => {
  const tl = JSON.parse(fs.readFileSync(tlFile, 'utf8'));
  const images = {}, data = { geo: JSON.parse(fs.readFileSync(path.join(assets, 'geo.json'))) };
  const envFile = arg('--env', null); if (envFile) data.env = JSON.parse(fs.readFileSync(envFile));
  for (const sub of ['terrain', 'sat']) for (const f of fs.readdirSync(path.join(assets, sub))) {
    if (f.endsWith('.json')) data[f.replace('.json', '_meta')] = JSON.parse(fs.readFileSync(path.join(assets, sub, f)));
    if (f.endsWith('.png') && !f.startsWith('p_')) images[f.replace('.png', '')] = 'file://' + path.join(assets, sub, f);
  }
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto('file://' + path.join(__dirname, 'render.html'));
  const info = await page.evaluate(cfg => window.boot(cfg), {
    fontCss: 'file://' + path.join(assets, 'fonts', 'local.css'), review, images, data, timeline: tl,
    scripts: ['file://' + path.join(assets, 'd3.min.js'), 'file://' + path.join(__dirname, 'engine.js'), 'file://' + sceneFile],
  });
  console.log('booted', { rows: info.rows, duration: info.duration });
  if (info.cueMisses.length) {
    console.error('Word cues not found in the narration (build falls back to a default time):\n  ' + info.cueMisses.join('\n  '));
    if (process.argv.includes('--strict')) process.exit(2);
  }
  const canvas = await page.$('#c');

  if (stills) {
    fs.mkdirSync(out, { recursive: true });
    for (const t of stills.split(',').map(Number)) {
      await page.evaluate(t => window.renderAt(t), t);
      await canvas.screenshot({ path: path.join(out, `still_${String(t).padStart(7, '0')}.jpg`), type: 'jpeg', quality: 88 });
    }
    await browser.close(); return;
  }
  const t0 = +arg('--from', 0), t1 = +arg('--to', tl.duration);
  const ffArgs = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-'];
  if (audio) ffArgs.push('-ss', String(t0), '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k', '-shortest');
  ffArgs.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  const ff = spawn('ffmpeg', ffArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
  const n0 = Math.round(t0 * fps), n1 = Math.round(t1 * fps), started = Date.now();
  for (let n = n0; n < n1; n++) {
    await page.evaluate(t => window.renderAt(t), n / fps);
    const buf = await canvas.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((n - n0) % (fps * 30) === 0) console.log(`${((n - n0) / fps).toFixed(0)}s / ${(t1 - t0).toFixed(0)}s · ${((Date.now() - started) / 1000).toFixed(0)}s elapsed`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close();
  console.log('wrote', out);
})();
