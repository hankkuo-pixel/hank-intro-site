/* 兩種尺寸：
   縮圖 life-*.jpg（高 1200，時間軸用，retina 下 360px 顯示仍清晰）
   原圖 full/life-*.jpg（不縮，幻燈片點開用） */
const sharp=require('sharp'); const fs=require('fs'); const path=require('path')
const DL=process.env.HOME+'/Downloads', DK=process.env.HOME+'/Desktop'
const HEIC=process.argv[2]
const MAXFULL=2600
const list=[
 ['dive-03','IMG_5826.JPG',DL],['dive-04','IMG_5827.JPG',DL],
 ['dive-05','LINE_ALBUM_底片_260729_1.jpg',DL],
 ['plant-01','IMG_6250.jpg',HEIC],['plant-02','IMG_6249.jpg',HEIC],
 ['plant-03','IMG_6248.jpg',HEIC],['plant-04','IMG_6247.jpg',HEIC],
 ['hike-01','IMG_1571.jpg',HEIC],['hike-02','IMG_5958.jpg',HEIC],
 ['hike-03','IMG_9383.jpg',HEIC],['hike-04','LINE_ALBUM_2026125_260729_3.jpg',DK],
 ['hike-05','LINE_ALBUM_2026125_260729_2.jpg',DK],['hike-06','LINE_ALBUM_2026125_260729_1.jpg',DK],
 ['hike-07','IMG_9273.jpg',DL],
 ['fish-01','IMG_5270.JPG',DL],['fish-02','IMG_5117.jpg',HEIC],
]
;(async()=>{
 const out=[]
 for(const [name,file,dir] of list){
   const src=path.join(dir,file)
   if(!fs.existsSync(src)){console.log('缺檔',src);continue}
   const meta=await sharp(src).metadata()
   await sharp(src).rotate().resize({height:1200,withoutEnlargement:true}).jpeg({quality:88,mozjpeg:true}).toFile('public/uploads/life-'+name+'.jpg')
   await sharp(src).rotate().resize({width:MAXFULL,height:MAXFULL,fit:"inside",withoutEnlargement:true}).jpeg({quality:90,mozjpeg:true}).toFile('public/uploads/full/life-'+name+'.jpg')
   const t=await sharp('public/uploads/life-'+name+'.jpg').metadata()
   const f=await sharp('public/uploads/full/life-'+name+'.jpg').metadata()
   out.push({name, 縮圖:`${t.width}×${t.height}`, 原圖:`${f.width}×${f.height}`,
     原圖KB:Math.round(fs.statSync('public/uploads/full/life-'+name+'.jpg').size/1024)})
 }
 console.table(out)
})()
