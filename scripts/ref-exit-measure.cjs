/* 錄參考站卡片往畫面上方離開的過程，逐格量內部亮度 */
const puppeteer = require("puppeteer-core")
const sharp = require("sharp")
const fs = require("fs")
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/exit"
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
;(async () => {
  fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--hide-scrollbars"] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })
  for (let i=0;i<40;i++){ const ok=await page.evaluate(()=>!!document.querySelector(".lenis")&&document.querySelector(".lenis").scrollHeight>3000); if(ok)break; await new Promise(r=>setTimeout(r,1000)) }
  await new Promise(r=>setTimeout(r,4000)); await page.mouse.move(720,450)
  const top=()=>page.evaluate(()=>Math.round(document.querySelector(".lenis").scrollTop))
  while ((await top()) < 1700){ await page.mouse.wheel({deltaY:200}); await new Promise(r=>setTimeout(r,320)) }
  await new Promise(r=>setTimeout(r,2500))
  console.log("start top =", await top())
  const client = await page.createCDPSession()
  const frames=[]
  client.on("Page.screencastFrame", async ({data,sessionId})=>{ frames.push(data); try{await client.send("Page.screencastFrameAck",{sessionId})}catch{} })
  await client.send("Page.startScreencast",{format:"png",everyNthFrame:1})
  await new Promise(r=>setTimeout(r,250))
  await page.mouse.wheel({deltaY:500})
  await new Promise(r=>setTimeout(r,2600))
  await client.send("Page.stopScreencast"); await browser.close()
  console.log("frames =", frames.length)
  for (let i=0;i<frames.length;i++){
    const buf=Buffer.from(frames[i],"base64")
    const {data,info}=await sharp(buf).raw().toBuffer({resolveWithObject:true})
    const W=info.width,C=info.channels
    const lum=(x,y)=>{const j=(y*W+x)*C;return 0.299*data[j]+0.587*data[j+1]+0.114*data[j+2]}
    // 大卡片（淺色）在畫面上半部：沿 x=900 找它的上下緣，量中間亮度
    let t=null,b2=null
    for(let y=0;y<880;y++){ if(lum(900,y)>90){ t=y; break } }
    if(t!==null){ for(let y=t;y<880;y++){ if(lum(900,y)<=90){ b2=y; break } } }
    if(t===null||b2===null||b2-t<40){ console.log(`f${i} -`); continue }
    let s=0,c=0
    for(let y=t+10;y<b2-10;y+=4) for(let x=560;x<1340;x+=10){ s+=lum(x,y); c++ }
    console.log(`f${String(i).padStart(2,"0")} 卡片 y=${t}..${b2} 高=${b2-t} 平均亮度=${(s/c).toFixed(1)}`)
  }
})().catch(e=>{console.error("FAILED",e.message);process.exit(1)})
