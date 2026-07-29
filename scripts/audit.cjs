const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const out={}
 for(const W of [1920,1440,1280,1024]){
  const p=await b.newPage(); await p.setViewport({width:W,height:900})
  const errs=[],bad=[]
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
  p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().split('/').pop())})
  await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
  await new Promise(r=>setTimeout(r,3500))
  const rows=[]
  for(let i=0;i<5;i++){
   await p.evaluate(n=>window.__hank.goTo(n),i)
   await new Promise(r=>setTimeout(r,1400))
   const d=await p.evaluate(()=>{
    const s=document.querySelectorAll('.section')[window.__hank.index]
    const L=document.querySelector('.fig-left')
    return {id:s.id, h:Math.round(s.scrollHeight), vh:innerHeight,
      overflowX: document.documentElement.scrollWidth>innerWidth+1,
      leftOver: L && s.id==='about' ? Math.round(L.scrollHeight-parseFloat(getComputedStyle(L).maxHeight)) : null}
   })
   rows.push(d)
  }
  out[W]={pages:rows,errs:errs.slice(0,3),bad:bad.slice(0,3)}
  await p.close()
 }
 console.log(JSON.stringify(out,null,1))
 await b.close()
})()
