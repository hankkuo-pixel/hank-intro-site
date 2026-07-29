const puppeteer=require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
 const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
 const p=await b.newPage(); await p.setViewport({width:1440,height:900})
 await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
 await new Promise(r=>setTimeout(r,3500))
 await p.evaluate(()=>window.__hank.goTo(1)); await new Promise(r=>setTimeout(r,1500))
 const m=await p.evaluate(()=>{
  const W=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return Math.round(r.width)}
  const li=document.querySelector('.rs-exp-list li')
  return {section:W('.about'), figFit:W('.fig-fit'), figCols:W('.fig-cols'), left:W('.fig-left'), right:W('.fig-right'),
    block:W('.fig-right .rs-block'), exp:W('.rs-exp'), list:W('.rs-exp-list'), li:li?Math.round(li.getBoundingClientRect().width):null,
    tag:W('.rs-tag'), rightMinW:getComputedStyle(document.querySelector('.fig-right')).minWidth}
 })
 console.log(JSON.stringify(m,null,1))
 await b.close()
})()
