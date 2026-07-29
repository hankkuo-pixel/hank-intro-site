const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 const miss=[];p.on('response',r=>{if(r.status()>=400)miss.push(r.status()+' '+r.url().split('/').pop())})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 // 正規翻頁：hero → about(含子步驟) → family
 for(let i=0;i<4;i++){await p.keyboard.press('PageDown');await new Promise(r=>setTimeout(r,1000))}
 const info=await p.evaluate(()=>({
   pages:[...document.querySelectorAll('.section')].map(s=>s.id),
   slides:document.querySelectorAll('.life-slide').length,
   cards:document.querySelectorAll('.life-card').length,
   dots:document.querySelectorAll('.life-dots button').length,
   count:document.getElementById('lifeCount')?.textContent,
   card1:(()=>{const e=document.querySelector('.life-card .gl-image');const r=e.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}})(),
 }))
 await p.screenshot({path:'verify-shots/life-1.jpg',quality:84,type:'jpeg'})
 // 往右翻兩組
 await p.keyboard.press('PageDown'); await new Promise(r=>setTimeout(r,900))
 await p.keyboard.press('PageDown'); await new Promise(r=>setTimeout(r,1100))
 const after=await p.evaluate(()=>({count:document.getElementById('lifeCount')?.textContent,
   tx:getComputedStyle(document.getElementById('lifeTrack')).transform}))
 await p.screenshot({path:'verify-shots/life-3.jpg',quality:84,type:'jpeg'})
 console.log(JSON.stringify({info,after,errs:errs.slice(0,5),miss:miss.slice(0,5)},null,1))
 await b.close()
})()
