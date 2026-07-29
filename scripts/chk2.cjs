const puppeteer = require('puppeteer-core')
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
;(async()=>{
  const b=await puppeteer.launch({executablePath:CHROME,headless:'new',args:['--no-sandbox','--enable-unsafe-swiftshader']})
  const p=await b.newPage()
  await p.setViewport({width:1440,height:900,deviceScaleFactor:2})
  const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text())})
  p.on('pageerror',e=>errs.push('PAGEERR '+e.message))
  await p.goto('http://localhost:8092/',{waitUntil:'networkidle0'})
  await new Promise(r=>setTimeout(r,3500))
  // 跳到第二頁
  await p.evaluate(()=>{document.querySelector('.hero-cta')?.click()})
  await new Promise(r=>setTimeout(r,2200))
  const info=await p.evaluate(()=>{
    const s=document.querySelector('#about')
    const L=document.querySelector('.fig-left'), R=document.querySelector('.fig-right')
    const av=document.querySelector('.rs-avatar')
    return {
      sectionH:s.scrollHeight, vh:innerHeight,
      steps:Math.ceil((s.scrollHeight-innerHeight)/innerHeight),
      leftPos:getComputedStyle(L).position, leftTop:L.getBoundingClientRect().top,
      leftH:L.scrollHeight, leftBoxH:L.getBoundingClientRect().height,
      rightH:R.scrollHeight,
      avatar:av?av.getBoundingClientRect():null,
      exps:document.querySelectorAll('.rs-exp').length,
      works:document.querySelectorAll('.rs-work').length,
      groups:document.querySelectorAll('.rs-group').length,
      edus:document.querySelectorAll('.rs-edu').length,
      overflowX: document.documentElement.scrollWidth>innerWidth,
    }
  })
  await p.screenshot({path:'verify-shots/about-top.jpg',quality:82,type:'jpeg'})
  // 捲到底看 sticky 是否維持
  await p.evaluate(()=>{const s=document.querySelector('#about');window.scrollTo(0,s.offsetTop+s.scrollHeight-innerHeight)})
  await new Promise(r=>setTimeout(r,1200))
  const bottom=await p.evaluate(()=>{
    const L=document.querySelector('.fig-left')
    return {leftTop:L.getBoundingClientRect().top, leftBottom:L.getBoundingClientRect().bottom}
  })
  await p.screenshot({path:'verify-shots/about-bottom.jpg',quality:82,type:'jpeg'})
  console.log(JSON.stringify({info,bottom,errs:errs.slice(0,5)},null,1))
  await b.close()
})()
