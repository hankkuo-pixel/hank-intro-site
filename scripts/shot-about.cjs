const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 await p.evaluate(()=>window.scrollTo(0,document.querySelector('#about').offsetTop))
 await new Promise(r=>setTimeout(r,1500))
 await p.screenshot({path:'verify-shots/about-1.jpg',quality:84,type:'jpeg'})
 await b.close()
})()
