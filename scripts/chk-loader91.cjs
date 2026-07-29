const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900})
 const errs=[],fails=[]
 p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 p.on('pageerror',e=>errs.push('PAGEERR '+e.message))
 p.on('requestfailed',r=>fails.push('FAIL '+r.url().replace('http://localhost:8091','')+' :: '+((r.failure()||{}).errorText)))
 p.on('response',r=>{if(r.status()>=400)fails.push(r.status()+' '+r.url().replace('http://localhost:8091',''))})
 await p.goto('http://localhost:8091/',{waitUntil:'domcontentloaded'})
 const snap=async(t)=>{await new Promise(r=>setTimeout(r,t));return p.evaluate(()=>{
   const l=document.getElementById('loader'),f=document.getElementById('loaderFill')
   return {t:Math.round(performance.now()), loaderDisplay:l?getComputedStyle(l).display:'none',
     loaderOpacity:l?getComputedStyle(l).opacity:null, fillW:f?getComputedStyle(f).width:null,
     introDone:document.body.classList.contains('intro-done'), cls:document.body.className}
 })}
 const a=await snap(1500), c=await snap(2000), d=await snap(4000)
 console.log(JSON.stringify({a,c,d,errs:errs.slice(0,8),fails:fails.slice(0,10)},null,1))
 await b.close()
})()
