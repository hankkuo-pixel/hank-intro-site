const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900})
 const errs=[];p.on('pageerror',e=>errs.push(e.message))
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 await p.evaluate(()=>window.__hank.goTo(2))
 await new Promise(r=>setTimeout(r,2500))
 const a=await p.evaluate(()=>{const v=document.querySelector('.life-video');return {rate:v.playbackRate,dur:+v.duration.toFixed(1),paused:v.paused,t:+v.currentTime.toFixed(2)}})
 await new Promise(r=>setTimeout(r,3000))
 const c=await p.evaluate(()=>{const v=document.querySelector('.life-video');return {t:+v.currentTime.toFixed(2),paused:v.paused}})
 // 離開該頁應暫停
 await p.evaluate(()=>window.__hank.goTo(1)); await new Promise(r=>setTimeout(r,1500))
 const d=await p.evaluate(()=>({paused:document.querySelector('.life-video').paused}))
 console.log(JSON.stringify({進頁:a,三秒後:c,離頁:d,有效時長:+(a.dur/a.rate).toFixed(1)+'秒',errs},null,1))
 await b.close()
})()
