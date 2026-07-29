const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 await p.goto('https://haoqi.design/',{waitUntil:'networkidle2',timeout:60000})
 await new Promise(r=>setTimeout(r,4000))
 await p.mouse.wheel({deltaY:900})
 await new Promise(r=>setTimeout(r,2000))
 const info=await p.evaluate(()=>{
   const out=[]
   for(const el of document.querySelectorAll('*')){
     const r=el.getBoundingClientRect()
     if(r.top>-50&&r.top<260 && r.left<260 && r.width>20&&r.width<300 && r.height>15&&r.height<260){
       const cs=getComputedStyle(el)
       out.push({tag:el.tagName, cls:(el.className.baseVal!==undefined?el.className.baseVal:(el.className||'')).toString().slice(0,60),
         txt:(el.textContent||'').trim().slice(0,16), box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)],
         font:cs.fontFamily.split(',')[0].replace(/"/g,''), color:cs.color, anim:cs.animationName, tr:cs.transition.slice(0,40)})
     }
   }
   return out
 })
 console.log(JSON.stringify(info.filter(x=>x.tag!=='DIV'||x.txt).slice(0,16),null,1))
 for(let i=0;i<12;i++){
   await p.screenshot({path:`verify-shots/hao-${String(i).padStart(2,'0')}.png`,clip:{x:0,y:0,width:340,height:260}})
   await new Promise(r=>setTimeout(r,220))
 }
 await b.close()
})()
