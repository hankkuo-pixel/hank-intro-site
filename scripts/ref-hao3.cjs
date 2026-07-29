const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 await p.goto('https://haoqi.design/',{waitUntil:'networkidle2',timeout:60000})
 await new Promise(r=>setTimeout(r,4500))
 let found=null
 for(let i=0;i<40 && !found;i++){
   found=await p.evaluate(()=>{
     for(const el of document.querySelectorAll('svg, path, img, span, div')){
       const r=el.getBoundingClientRect()
       if(r.top<0||r.top>700||r.width<40||r.width>420) continue
       const cs=getComputedStyle(el)
       const col=(cs.stroke||'')+' '+(cs.fill||'')+' '+cs.color+' '+cs.backgroundColor
       // 螢光黃綠：R高 G高 B低
       const m=col.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/g)||[]
       for(const c of m){
         const [R,G,B]=c.match(/\d+/g).map(Number)
         if(G>200 && B<90 && R>140){
           return {tag:el.tagName, cls:(el.className.baseVal!==undefined?el.className.baseVal:(el.className||'')).toString().slice(0,70),
             box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)],
             stroke:cs.stroke, fill:cs.fill, dash:cs.strokeDasharray, offset:cs.strokeDashoffset,
             anim:cs.animation.slice(0,80), transition:cs.transition.slice(0,60),
             html:el.outerHTML.slice(0,220)}
         }
       }
     }
     return null
   })
   if(!found){await p.mouse.wheel({deltaY:200}); await new Promise(r=>setTimeout(r,320))}
 }
 console.log(found?JSON.stringify(found,null,1):'找不到')
 if(found){
   for(let i=0;i<10;i++){
     await p.screenshot({path:`verify-shots/hao2-${i}.png`,clip:{x:Math.max(0,found.box[0]-30),y:Math.max(0,found.box[1]-30),width:found.box[2]+80,height:found.box[3]+80}})
     await new Promise(r=>setTimeout(r,180))
   }
 }
 await b.close()
})()
