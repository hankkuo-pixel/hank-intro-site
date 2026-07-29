const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 const bad=[];p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().split('/').pop())})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 await p.evaluate(()=>window.__hank.goTo(2))
 await new Promise(r=>setTimeout(r,1600))
 const a=await p.evaluate(()=>{
  const t=lifeTrack, v=t.parentElement
  const cards=[...t.children].map(c=>{const m=c.firstElementChild;const r=m.getBoundingClientRect();return {tag:m.tagName,w:Math.round(r.width),h:Math.round(r.height)}})
  return {cards:cards.length, trackW:t.scrollWidth, viewW:v.clientWidth, count:lifeCount.textContent,
   dots:document.querySelectorAll('.life-dots button').length,
   heights:[...new Set(cards.map(c=>c.h))], sample:cards.slice(0,6),
   video:!!document.querySelector('.life-video')}
 })
 await p.screenshot({path:'verify-shots/life-a.jpg',quality:84,type:'jpeg'})
 for(let i=0;i<2;i++){await p.keyboard.press('PageDown');await new Promise(r=>setTimeout(r,1000))}
 const c=await p.evaluate(()=>({count:lifeCount.textContent,tx:getComputedStyle(lifeTrack).transform}))
 await p.screenshot({path:'verify-shots/life-b.jpg',quality:84,type:'jpeg'})
 console.log(JSON.stringify({a,after:c,errs:errs.slice(0,4),bad:bad.slice(0,4)},null,1))
 await b.close()
})()
