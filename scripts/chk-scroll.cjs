const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900})
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 const rec=[]
 const snap=async(tag)=>{const v=await p.evaluate(()=>({y:Math.round(scrollY),idx:window.__hank.index}));rec.push([tag,v.y,v.idx]);return v}
 await snap('起點')
 // 進 about
 await p.evaluate(()=>window.__hank.goTo(1)); await new Promise(r=>setTimeout(r,1700))
 const a=await snap('進 about')
 // 在 about 頁小幅滾動三次
 for(let i=0;i<3;i++){await p.mouse.wheel({deltaY:260});await new Promise(r=>setTimeout(r,600));await snap('滾 260')}
 // 一路滾到底，應該換頁
 for(let i=0;i<8;i++){await p.mouse.wheel({deltaY:400});await new Promise(r=>setTimeout(r,520))}
 const c=await snap('連滾到底')
 // 第一頁（非自由捲）滾一下 → 應整頁跳
 await p.evaluate(()=>window.__hank.goTo(0)); await new Promise(r=>setTimeout(r,1700))
 await snap('回首頁')
 await p.mouse.wheel({deltaY:200}); await new Promise(r=>setTimeout(r,1600))
 await snap('首頁滾一下')
 console.log(rec.map(r=>`${r[0].padEnd(10)} y=${String(r[1]).padStart(5)} page=${r[2]}`).join('\n'))
 console.log('errs:',errs.slice(0,4))
 await b.close()
})()
