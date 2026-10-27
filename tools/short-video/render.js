const { chromium } = require('playwright');
const fs=require('fs'); const {spawn}=require('child_process');
const V=process.argv[2], mode=process.argv[3];
(async()=>{
  const TL=JSON.parse(fs.readFileSync(V+'/timeline.json'));
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+V+'/render.html'); await p.evaluate(j=>window.loadTL(j),TL);
  await p.waitForTimeout(800);
  if(mode==='preview'){
    const ts=process.argv[4].split(',').map(Number);
    for(const t of ts){ await p.evaluate(t=>window.renderAt(t),t); await p.screenshot({path:`${V}/pv_${String(t).padStart(6,'0')}.png`}); }
  } else {
    const N=Math.floor(TL.total*TL.fps);
    const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',String(TL.fps),'-c:v','mjpeg','-i','-',
      '-i',V+'/vo_clean.wav','-af','apad','-t',String(TL.total),'-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-r',String(TL.fps),
      '-c:a','aac','-b:a','192k','-movflags','+faststart',V+'/out.mp4'],{stdio:['pipe','inherit','inherit']});
    for(let f=0;f<N;f++){
      await p.evaluate(t=>window.renderAt(t),f/TL.fps);
      const buf=await p.screenshot({type:'jpeg',quality:92});
      if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
      if(f%300===0) console.log('frame',f,'/',N, new Date().toISOString());
    }
    ff.stdin.end(); await new Promise(r=>ff.on('close',r));
  }
  await b.close();
})();
