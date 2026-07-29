const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 const bad=[];p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url().split('/').pop())})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 await p.evaluate(()=>window.__hank.goTo(1)); await new Promise(r=>setTimeout(r,2200))
 await p.screenshot({path:'verify-shots/v2-about.jpg',quality:86,type:'jpeg'})
 const a=await p.evaluate(()=>{
  const sp=document.querySelector('.rs-sign path')
  const L=document.querySelector('.fig-left'), R=document.querySelector('.fig-right')
  return {signOffset:sp?sp.style.strokeDashoffset:null, signLen:sp?sp.dataset.len:null,
   left:Math.round(L.getBoundingClientRect().height), leftMax:Math.round(parseFloat(getComputedStyle(L).maxHeight)),
   rightTitles:[...R.querySelectorAll('.rs-title')].map(t=>t.textContent.trim()),
   facts:[...document.querySelectorAll('.rs-facts dt')].map(d=>d.textContent)}
 })
 await p.evaluate(()=>window.__hank.goTo(2)); await new Promise(r=>setTimeout(r,2000))
 await p.screenshot({path:'verify-shots/v2-life.jpg',quality:86,type:'jpeg'})
 const c=await p.evaluate(()=>({stops:document.querySelectorAll('.tl-stop').length,
   shots:document.querySelectorAll('.tl-shot').length,
   heights:[...new Set([...document.querySelectorAll('.tl-media')].map(e=>Math.round(e.getBoundingClientRect().height)))],
   secH:Math.round(document.querySelector('#family').scrollHeight)}))
 console.log(JSON.stringify({about:a,life:c,errs:errs.slice(0,4),bad:bad.slice(0,4)},null,1))
 await b.close()
})()
