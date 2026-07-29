const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 const errs=[];p.on('pageerror',e=>errs.push(e.message))
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,4000))
 const f=await p.evaluate(async()=>{
   await document.fonts.ready
   const loaded=[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight)
   const g=s=>{const e=document.querySelector(s);return e?getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g,''):null}
   return {loaded:[...new Set(loaded)],
     heroTitle:g('.hero-title'), heroIntro:g('.hero-intro'), kicker:g('.kicker'),
     clock:g('#clock'), body:getComputedStyle(document.body).fontFamily.split(',')[0].replace(/"/g,''),
     titleW:Math.round(document.querySelector('.hero-title').getBoundingClientRect().width)}
 })
 await p.screenshot({path:'verify-shots/font-hero.jpg',quality:85,type:'jpeg'})
 await p.evaluate(()=>window.__hank.goTo(1)); await new Promise(r=>setTimeout(r,1800))
 const f2=await p.evaluate(()=>{const g=s=>{const e=document.querySelector(s);return e?getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g,''):null}
   return {hello:g('.rs-hello'),title:g('.rs-title'),nameZh:g('.rs-name h1'),nameEn:g('.rs-name p'),intro:g('.rs-intro p'),role:g('.rs-exp-role')}})
 await p.screenshot({path:'verify-shots/font-about.jpg',quality:85,type:'jpeg'})
 console.log(JSON.stringify({第一頁:f,第二頁:f2,errs},null,1))
 await b.close()
})()
