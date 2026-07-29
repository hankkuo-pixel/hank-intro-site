/* 生活照：統一高度 900px，寬度依原圖比例（橫的就是橫的），不裁切 */
const sharp=require('sharp'); const fs=require('fs'); const path=require('path')
const DL=process.env.HOME+'/Downloads'
const HEIC=process.argv[2]
const OUT='public/uploads'
const H=900
const list=[
 ['dive-01','IMG_5169.jpg',DL],['dive-02','IMG_5816.jpg',DL],
 ['dive-03','IMG_5826.JPG',DL],['dive-04','IMG_5827.JPG',DL],
 ['plant-01','IMG_6250.jpg',HEIC],['plant-02','IMG_6249.jpg',HEIC],
 ['plant-03','IMG_6248.jpg',HEIC],['plant-04','IMG_6247.jpg',HEIC],
 ['hike-01','IMG_1571.jpg',HEIC],['hike-02','IMG_5958.jpg',HEIC],
 ['hike-03','IMG_9383.jpg',HEIC],
 ['fish-01','IMG_5270.JPG',DL],['fish-02','IMG_5117.jpg',HEIC],
 ['sup-01','IMG_9860.jpg',HEIC],
 ['trip-01','IMG_3734.JPG',DL],
]
;(async()=>{
 const out=[]
 for(const [name,file,dir] of list){
   const src=path.join(dir,file)
   if(!fs.existsSync(src)){console.log('缺檔',src);continue}
   const dst=path.join(OUT,`life-${name}.jpg`)
   await sharp(src).rotate().resize({height:H}).jpeg({quality:82,mozjpeg:true}).toFile(dst)
   const m=await sharp(dst).metadata()
   out.push({name,w:m.width,h:m.height,ratio:(m.width/m.height).toFixed(2),kb:Math.round(fs.statSync(dst).size/1024)})
 }
 console.table(out)
}) ()
