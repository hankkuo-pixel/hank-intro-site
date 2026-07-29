const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 await p.goto('https://haoqi.design/',{waitUntil:'networkidle2',timeout:60000})
 await new Promise(r=>setTimeout(r,1200))
 // 找出左上角那個元素是什麼
 const info=await p.evaluate(()=>{
   const out=[]
   for(const el of document.querySelectorAll('*')){
     const r=el.getBoundingClientRect()
     if(r.top<220 && r.left<220 && r.width>20 && r.width<320 && r.height>20 && r.height<220){
       out.push({tag:el.tagName, cls:(el.className.baseVal!==undefined?el.className.baseVal:el.className||'').toString().slice(0,50),
         txt:(el.textContent||'').trim().slice(0,20), w:Math.round(r.width),h:Math.round(r.height),
         x:Math.round(r.left),y:Math.round(r.top),
         font:getComputedStyle(el).fontFamily.split(',')[0], color:getComputedStyle(el).color})
     }
   }
   return out.slice(0,14)
 })
 console.log(JSON.stringify(info,null,1))
 // 連拍左上角
 for(let i=0;i<10;i++){
   await p.screenshot({path:`verify-shots/hao-${String(i).padStart(2,'0')}.png`,clip:{x:0,y:0,width:300,height:220}})
   await new Promise(r=>setTimeout(r,250))
 }
 await b.close()
})()
