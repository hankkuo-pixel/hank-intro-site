const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900})
 const errs=[]
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 p.on('pageerror',e=>errs.push('PAGEERR '+e.message))
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 const base=await p.evaluate(()=>({
   pages:[...document.querySelectorAll('.section')].map(s=>s.id),
   counter:document.querySelector('.page-count,.pager,[id*=Count]')?.textContent||null,
   introDone:document.body.classList.contains('intro-done')
 }))
 await p.evaluate(()=>document.querySelector('.hero-cta').click())
 await new Promise(r=>setTimeout(r,2000))
 const after=await p.evaluate(()=>({y:Math.round(scrollY), atAbout:Math.abs(scrollY-document.querySelector('#about').offsetTop)<8}))
 // 逐頁翻到底
 for(let i=0;i<6;i++){await p.keyboard.press('PageDown');await new Promise(r=>setTimeout(r,900))}
 const end=await p.evaluate(()=>({y:Math.round(scrollY),max:Math.round(document.documentElement.scrollHeight-innerHeight)}))
 console.log(JSON.stringify({base,after,end,errs:errs.slice(0,6)},null,1))
 await b.close()
})()
