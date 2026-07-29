const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 await p.evaluate(()=>window.__hank.goTo(2))
 await new Promise(r=>setTimeout(r,1500))
 for(let i=0;i<2;i++){await p.keyboard.press('PageDown');await new Promise(r=>setTimeout(r,1000))}
 const on=await p.evaluate(()=>{
   const items=window.__hank.gl ? null : null
   return {grade:window.__hank.glConfig.gradeContrast}
 })
 await p.screenshot({path:'verify-shots/grade-on.jpg',quality:88,type:'jpeg'})
 // 關掉色彩統一再截一張對照
 await p.evaluate(()=>{window.__hank.glConfig.gradeContrast=1;window.__hank.glConfig.gradeLift=0;window.__hank.glConfig.gradeSaturation=1;window.__hank.glConfig.gradeWarm=0})
 await new Promise(r=>setTimeout(r,900))
 await p.screenshot({path:'verify-shots/grade-off.jpg',quality:88,type:'jpeg'})
 console.log(JSON.stringify({on,errs:errs.slice(0,4)}))
 await b.close()
})()
