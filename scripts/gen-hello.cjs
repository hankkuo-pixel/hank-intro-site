const sharp=require('sharp'),fs=require('fs')
// 三版手寫連筆 Hello（單線 path，之後用 stroke-dashoffset 描出來）
const paths={
A:"M38 176 C58 96 72 44 90 40 C102 38 98 76 88 118 C82 148 78 166 76 178 M68 110 C110 98 142 92 170 88 M186 36 C168 90 156 132 154 170 C153 182 158 180 166 172 C178 158 196 150 206 160 C216 170 206 184 188 182 C174 180 172 162 186 152 C200 142 218 148 226 160 M244 30 C232 92 226 140 226 172 C226 184 232 186 240 178 M266 32 C254 94 248 142 248 174 C248 186 254 188 262 180 C276 166 296 156 310 164 C324 172 322 194 304 196 C286 198 278 178 292 164 C304 152 322 152 332 164",
B:"M34 180 C46 110 60 52 78 44 C92 38 90 82 80 122 C74 152 70 170 68 182 M62 114 C104 100 138 94 168 90 M182 40 C166 96 154 138 152 172 C151 186 158 184 168 174 C182 160 202 152 212 162 C222 172 210 188 192 184 C176 180 176 160 192 150 C208 140 228 148 236 162 M252 34 C238 100 232 148 232 178 C232 190 240 190 248 180 M274 36 C260 102 254 148 254 178 C254 190 262 190 270 180 C286 164 308 154 322 164 C336 174 332 196 312 198 C294 200 288 178 302 164 C314 152 334 154 344 168",
C:"M30 184 C40 118 58 46 80 38 C98 32 92 84 80 128 C72 160 66 176 64 186 M58 118 C102 102 138 96 170 90 M188 34 C170 100 156 144 154 178 C153 192 162 190 172 178 C188 162 210 152 220 164 C230 176 216 192 198 186 C182 181 184 158 202 148 C220 138 240 150 246 166 M262 28 C246 100 240 152 240 182 C240 196 250 194 258 182 M286 30 C270 102 264 152 264 182 C264 196 274 194 282 182 C300 164 324 154 338 166 C352 178 346 200 324 200 C304 200 300 176 316 162 C330 150 350 154 358 170"
}
const W=420,H=230
;(async()=>{
 const comp=[]
 const keys=Object.keys(paths)
 for(let i=0;i<keys.length;i++){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 400 230">
    <rect width="400" height="230" fill="#0d0f14"/>
    <path d="${paths[keys[i]]}" fill="none" stroke="#c0fe04" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="12" y="24" fill="#666" font-size="16" font-family="monospace">${keys[i]}</text>
  </svg>`
  fs.writeFileSync('/tmp/hello/'+keys[i]+'.svg',svg)
  comp.push({input:await sharp(Buffer.from(svg)).png().toBuffer(),left:0,top:i*H})
 }
 await sharp({create:{width:W,height:H*keys.length,channels:3,background:'#0d0f14'}}).composite(comp).jpeg({quality:92}).toFile('verify-shots/hello-draft.jpg')
 console.log('三版已產生')
})()
