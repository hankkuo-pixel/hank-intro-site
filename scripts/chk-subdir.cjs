const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1920,height:1000,deviceScaleFactor:1})
 const errs=[],bad=[]
 p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().replace('http://localhost:8099',''))})
 await p.goto('http://localhost:8099/intro/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,6000))
 const rows=[]
 for(let i=0;i<4;i++){
  await p.evaluate(n=>window.__hank.goTo(n),i); await new Promise(r=>setTimeout(r,1600))
  rows.push(await p.evaluate(()=>{const s=document.querySelectorAll('.section')[window.__hank.index]
   return s.id+' h='+Math.round(s.scrollHeight)}))
  await p.screenshot({path:`verify-shots/dist-${i}.jpg`,quality:80,type:'jpeg'})
 }
 const imgs=await p.evaluate(()=>{
  const gl=[...document.querySelectorAll('[data-gl-src]')].map(e=>e.dataset.glSrc)
  return {glCount:gl.length, sample:gl.slice(0,3), video:document.querySelector('.life-video')?.getAttribute('src')}
 })
 console.log(JSON.stringify({pages:rows,imgs,errs:errs.slice(0,5),bad:bad.slice(0,8)},null,1))
 await b.close()
})()
