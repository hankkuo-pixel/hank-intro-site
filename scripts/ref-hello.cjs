const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:1})
 await p.goto('https://haoqi.design/',{waitUntil:'networkidle2',timeout:60000})
 await new Promise(r=>setTimeout(r,5000))
 // 逐段捲，找出有人像照片的區塊
 const H=await p.evaluate(()=>document.body.scrollHeight)
 console.log('頁高',H)
 const shots=[]
 for(let y=0;y<H;y+=900){
   await p.evaluate(v=>window.scrollTo(0,v),y)
   await new Promise(r=>setTimeout(r,1200))
   const f=`verify-shots/ref-${String(y).padStart(5,'0')}.jpg`
   await p.screenshot({path:f,quality:70,type:'jpeg'})
   shots.push(f)
 }
 console.log(shots.length,'張')
 await b.close()
})()
