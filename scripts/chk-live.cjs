const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1920,height:1000,deviceScaleFactor:1})
 const errs=[],bad=[]
 p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().split('/').slice(-2).join('/'))})
 await p.goto('https://www.hank-kuo.com/intro/',{waitUntil:'networkidle0',timeout:60000})
 await new Promise(r=>setTimeout(r,7000))
 const rows=[]
 for(let i=0;i<4;i++){
  await p.evaluate(n=>window.__hank.goTo(n),i); await new Promise(r=>setTimeout(r,1700))
  rows.push(await p.evaluate(()=>{const s=document.querySelectorAll('.section')[window.__hank.index];return s.id}))
  await p.screenshot({path:`verify-shots/live-${i}.jpg`,quality:78,type:'jpeg'})
 }
 console.log(JSON.stringify({pages:rows,errs:errs.slice(0,4),bad:bad.slice(0,5)},null,1))
 await b.close()
})()
