const sharp=require('sharp'),fs=require('fs')
/* 模仿參考站簽名的比例：H 高、小寫矮、整體右傾、細筆畫、收尾長出鋒 */
const paths={
D:"M96 30 C60 92 28 150 22 172 C16 194 34 190 62 168 C104 136 168 104 216 96 C244 92 236 112 214 130 M60 108 C112 92 158 84 196 80 M300 24 C270 88 250 136 246 164 C243 184 254 186 268 172 C284 156 302 148 312 158 C322 168 310 182 292 180 C278 178 280 162 296 152 C312 142 330 148 338 162 M370 22 C346 88 332 138 330 166 C329 182 340 182 352 168 M400 24 C376 90 362 138 360 166 C359 182 370 182 382 168 C398 150 422 140 438 150 C454 160 452 184 430 190 C410 195 402 176 418 160 C434 144 462 146 476 164 C486 176 498 176 512 164",
E:"M104 26 C64 96 26 158 20 178 C14 198 36 192 66 168 C112 132 176 100 224 92 C252 88 242 110 218 128 M58 110 C114 94 162 86 202 82 M308 20 C274 90 252 140 248 168 C245 188 258 190 272 174 C290 156 310 148 320 158 C330 168 316 184 298 182 C284 180 288 162 304 152 C320 142 340 150 348 164 M382 18 C354 90 338 142 336 170 C335 188 348 188 360 172 M414 20 C386 92 370 142 368 170 C367 188 380 188 392 172 C410 152 436 142 452 152 C468 162 466 188 442 194 C420 199 412 178 430 162 C448 146 478 148 492 168 C500 180 512 182 528 168",
}
const W=560,H=240
;(async()=>{
 const keys=Object.keys(paths), comp=[]
 for(let i=0;i<keys.length;i++){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 560 210">
    <rect width="560" height="210" fill="#0d1020"/>
    <path d="${paths[keys[i]]}" fill="none" stroke="#c0fe04" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="10" y="22" fill="#555" font-size="15" font-family="monospace">${keys[i]}</text>
  </svg>`
  fs.writeFileSync('/tmp/hello-'+keys[i]+'.svg',svg)
  comp.push({input:await sharp(Buffer.from(svg)).png().toBuffer(),left:0,top:i*H})
 }
 await sharp({create:{width:W,height:H*keys.length,channels:3,background:'#0d1020'}}).composite(comp).jpeg({quality:94}).toFile('verify-shots/hello-v2.jpg')
 console.log(keys.length,'版')
})()
