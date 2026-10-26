const { chromium } = require('playwright'); const fs=require('fs'); const {spawn}=require('child_process');
const V=process.argv[2], t0=parseFloat(process.argv[3]), t1=parseFloat(process.argv[4]), out=process.argv[5];
(async()=>{
  const TL=JSON.parse(fs.readFileSync(V+'/timeline.json'));
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
  await p.goto('file://'+V+'/render.html'); await p.evaluate(j=>window.loadTL(j),TL); await p.waitForTimeout(800);
  const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-',
    '-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-r','30',out],{stdio:['pipe','inherit','inherit']});
  for(let f=Math.round(t0*30); f<Math.round(t1*30); f++){ await p.evaluate(t=>window.renderAt(t),f/30); ff.stdin.write(await p.screenshot({type:'jpeg',quality:92})); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close();
})();
