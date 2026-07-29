const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:1})
 await p.goto('https://haoqi.design/',{waitUntil:'networkidle2',timeout:60000})
 await new Promise(r=>setTimeout(r,5000))
 // 用滾輪捲（該站是虛擬捲動）
 for(let i=0;i<12;i++){
   await p.mouse.wheel({deltaY:900})
   await new Promise(r=>setTimeout(r,1400))
   await p.screenshot({path:`verify-shots/ref-w${String(i).padStart(2,'0')}.jpg`,quality:68,type:'jpeg'})
 }
 // 順便列出頁面上的圖片與其鄰近文字
 const imgs=await p.evaluate(()=>[...document.querySelectorAll('img')].slice(0,20).map(im=>({
   src:(im.currentSrc||im.src||'').split('/').pop().slice(0,40),
   w:Math.round(im.getBoundingClientRect().width), h:Math.round(im.getBoundingClientRect().height)
 })))
 console.log(JSON.stringify(imgs,null,1))
 await b.close()
})()
