const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 await p.evaluate(()=>{const s=document.querySelector('#about');window.scrollTo(0,s.offsetTop+s.scrollHeight-innerHeight)})
 await new Promise(r=>setTimeout(r,1800))
 const m=await p.evaluate(()=>{
   const sh=[...document.querySelectorAll('.rs-shot')].map(e=>{const r=e.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height)}})
   return {shots:sh.length, size:sh[0]||null}
 })
 await p.screenshot({path:'verify-shots/about-2.jpg',quality:84,type:'jpeg'})
 console.log(JSON.stringify(m))
 await b.close()
})()
