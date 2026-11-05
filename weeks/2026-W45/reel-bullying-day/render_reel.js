// node render_reel.js reel.html out_dir [preview|full] [audio.wav] [out_name.mp4]
const { chromium } = require('playwright'); const {spawn}=require('child_process');
const [html,out,mode,audio]=process.argv.slice(2); const FPS=30;
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
  p.on('pageerror',e=>console.log('PAGEERROR',e.message));
  await p.goto('file://'+html); await p.evaluate(()=>window.ready()); await p.waitForTimeout(800);
  const TOTAL=await p.evaluate(()=>window.TOTAL);
  if(mode==='preview'){
    const PV=await p.evaluate(()=>window.PREVIEW||[3.9,8.5,13.5,18.8,25.0,30.5,36.0,42.0]);
    for(const t of PV){ await p.evaluate(t=>window.renderAt(t),t); await p.screenshot({path:`${out}/pv_${String(t).replace('.','_')}.png`}); }
  } else {
    const N=Math.floor(TOTAL*FPS);
    const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-i',audio,
      '-t',String(TOTAL),'-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-r',String(FPS),'-c:a','aac','-b:a','192k','-movflags','+faststart',out+'/'+(process.argv[6]||'reel.mp4')],{stdio:['pipe','inherit','inherit']});
    for(let f=0;f<N;f++){ await p.evaluate(t=>window.renderAt(t),f/FPS); const buf=await p.screenshot({type:'jpeg',quality:92});
      if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r)); if(f%300===0) console.log('frame',f,'/',N); }
    ff.stdin.end(); await new Promise(r=>ff.on('close',r));
  }
  await b.close();
})();
