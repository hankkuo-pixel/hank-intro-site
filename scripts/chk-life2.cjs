const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 await p.evaluate(()=>window.__hank.goTo(2))   // 直接進 family
 await new Promise(r=>setTimeout(r,1500))
 const a=await p.evaluate(()=>({idx:window.__hank.index,slide:window.__hank.workIndex,count:lifeCount.textContent}))
 await p.screenshot({path:'verify-shots/life-1.jpg',quality:84,type:'jpeg'})
 for(let i=0;i<2;i++){await p.keyboard.press('PageDown');await new Promise(r=>setTimeout(r,1000))}
 const c=await p.evaluate(()=>({idx:window.__hank.index,slide:window.__hank.workIndex,count:lifeCount.textContent,
   tx:getComputedStyle(lifeTrack).transform}))
 await p.screenshot({path:'verify-shots/life-3.jpg',quality:84,type:'jpeg'})
 // 翻到最後一組
 for(let i=0;i<2;i++){await p.keyboard.press('PageDown');await new Promise(r=>setTimeout(r,1000))}
 const d=await p.evaluate(()=>({idx:window.__hank.index,slide:window.__hank.workIndex,count:lifeCount.textContent}))
 await p.screenshot({path:'verify-shots/life-5.jpg',quality:84,type:'jpeg'})
 console.log(JSON.stringify({進family:a,按兩次:c,再兩次:d,errs:errs.slice(0,4)},null,1))
 await b.close()
})()
