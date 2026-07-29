const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader','--window-size=2560,1440']})
 for(const W of [2560,1440]){
  const p=await b.newPage(); await p.setViewport({width:W,height:900,deviceScaleFactor:1})
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
  await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
  await new Promise(r=>setTimeout(r,3500))
  await p.mouse.move(W/2,450); await new Promise(r=>setTimeout(r,600))
  const m=await p.evaluate(()=>{
   const R=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {l:Math.round(r.left),w:Math.round(r.width)}}
   return {vw:innerWidth, track:R('.track'), gl:R('.gl-layer'), fall:R('.fall-layer'), cursor:R('.cursor-layer'),
     canvas:(()=>{const c=document.querySelector('.gl-layer canvas');return c?{cssW:Math.round(c.getBoundingClientRect().width),attrW:c.width}:null})(),
     overflowX: document.documentElement.scrollWidth>innerWidth}
  })
  await p.screenshot({path:`verify-shots/stage-${W}.jpg`,quality:80,type:'jpeg'})
  console.log(W, JSON.stringify(m), 'errs:',errs.slice(0,3))
  await p.close()
 }
 await b.close()
})()
