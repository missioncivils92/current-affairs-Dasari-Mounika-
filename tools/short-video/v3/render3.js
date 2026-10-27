const { chromium } = require('playwright'); const fs=require('fs'); const {spawn}=require('child_process');
const D=process.argv[2], mode=process.argv[3];
(async()=>{
  const TL=JSON.parse(fs.readFileSync(D+'/timeline3.json')), AS=JSON.parse(fs.readFileSync(D+'/assets.json'));
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
  p.on('pageerror',e=>console.log('PAGEERROR',e.message));
  await p.goto('file://'+D+'/render3.html'); await p.evaluate(([a,c])=>window.loadTL(a,c),[TL,AS]); await p.waitForTimeout(800);
  if(mode==='preview'){
    const ts=TL.scenes.map(s=>Math.min(s.end-0.1, s.start+Math.max(1.2,(s.end-s.start)*0.75)));
    for(const [i,t] of ts.entries()){ await p.evaluate(t=>window.renderAt(t),t); await p.screenshot({path:`${D}/pv_${String(i).padStart(2,'0')}.png`}); }
  } else {
    const N=Math.floor(TL.total*TL.fps);
    const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',String(TL.fps),'-c:v','mjpeg','-i','-',
      '-i',D+'/../video/vo_clean.wav','-af','apad','-t',String(TL.total),'-c:v','libx264','-preset','medium','-crf','20','-maxrate','4000k','-bufsize','8000k','-pix_fmt','yuv420p','-r',String(TL.fps),
      '-c:a','aac','-b:a','192k','-movflags','+faststart',D+'/out3.mp4'],{stdio:['pipe','inherit','inherit']});
    for(let f=0;f<N;f++){
      await p.evaluate(t=>window.renderAt(t),f/TL.fps);
      const buf=await p.screenshot({type:'jpeg',quality:90});
      if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
      if(f%600===0) console.log('frame',f,'/',N,new Date().toISOString());
    }
    ff.stdin.end(); await new Promise(r=>ff.on('close',r));
  }
  await b.close();
})();
