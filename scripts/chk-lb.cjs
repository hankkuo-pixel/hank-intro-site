const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 const bad=[];p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().split('/').pop())})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 await p.evaluate(()=>window.__hank.goTo(2)); await new Promise(r=>setTimeout(r,2000))
 const base=await p.evaluate(()=>({stops:document.querySelectorAll('.tl-stop').length,
   years:[...document.querySelectorAll('.tl-year')].map(e=>e.textContent),
   shots:document.querySelectorAll('[data-full]').length,
   h:[...new Set([...document.querySelectorAll('.tl-media')].map(e=>Math.round(e.getBoundingClientRect().height)))]}))
 await p.screenshot({path:'verify-shots/v3-life.jpg',quality:86,type:'jpeg'})
 // 開幻燈片
 await p.evaluate(()=>document.querySelectorAll('[data-full]')[3].click())
 await new Promise(r=>setTimeout(r,800))
 const open=await p.evaluate(()=>{const l=document.getElementById('lightbox'),i=document.getElementById('lbImg')
   return {hidden:l.hidden, cls:l.className, src:i.src.split('/').pop(), nat:i.naturalWidth+'×'+i.naturalHeight,
     shown:Math.round(i.getBoundingClientRect().width)+'×'+Math.round(i.getBoundingClientRect().height),
     count:document.getElementById('lbCount').textContent}})
 await p.screenshot({path:'verify-shots/v3-lb.jpg',quality:86,type:'jpeg'})
 await p.keyboard.press('ArrowRight'); await new Promise(r=>setTimeout(r,500))
 const nx=await p.evaluate(()=>({src:lbImg.src.split('/').pop(),count:lbCount.textContent}))
 await p.keyboard.press('Escape'); await new Promise(r=>setTimeout(r,600))
 const cl=await p.evaluate(()=>document.getElementById('lightbox').hidden)
 console.log(JSON.stringify({base,開啟:open,下一張:nx,ESC關閉:cl,errs:errs.slice(0,4),bad:bad.slice(0,4)},null,1))
 await b.close()
})()
