const express = require("express");
const path = require("path");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs")
const cors = require("cors");
const app = express();
//const cors = require("cors");

app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.get("/",(req,res)=>{
  res.status(200).sendFile(path.join(__dirname,"public/index.html"));
})
function validateUrl(link){
  return ytdl.validateURL(link)
}
async function yt_info(link){
  try{
  const info  = await ytdl.getInfo(link);
  const thumbnail = info.videoDetails.thumbnails[4].url;
  
   global.title = info.videoDetails.title;
  return {thumbnail:thumbnail,title:global.title};
  }catch(e){
    console.error(e)
  }
}

app.post("/validate",async(req,res)=>{
  try{
  const {urls} = req.body;
  res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  //console.log(req.body)
  //console.log(urls)
  
  //console.log(thumbnail,title)
  console.log(ytdl.validateURL(urls))
  if(validateUrl(urls)==true){
    try{
     yt_info(urls).then((val)=>{
       try{
       const {thumbnail,title} = val;
       console.log(thumbnail,title)
       res.send(val)
       }catch(e){
         res.status(422).json({erro:"wrong url or age restricted"})
       }
     })
     }catch(e){
       res.status(422).json({
         error:"wrong url or age restricted"
       })
     }
     
   /*res.status(200).json({
      thumbnail:"https://assets.codemzy.com/blog/javascript/object-not-valid-json-error.png",
      title:"test",
      size:128235,
      name:"sample video"
    })*/

  }else{
    res.status(422).json({
      error:"wrong url or private "
    })
  }
  }catch(e){
    res.status(422).json({
      error:"wrong url or private"
    })
  }
})

/*app.post("/info",(req,res)=>{
  
})*/
 function save(link,res){
  //const info = await ytdl.getInfo(link);const title = info.videoDetails.title;
  try{
  const title = global.title
  const file_save = fs.createWriteStream(path.join(__dirname,"temp",`${title}.mp4`));
  console.log("title : "+global.title)
  ytdl(link,{filter:"audioandvideo"}).pipe(file_save);
  file_save.on("finish",()=>{
    console.log("file downloaded successfully");
  res.set("Content-Disposition","attachment;",filename=`${global.title}.mp4`)
  res.set("Content-type","video/mp4")
  res.sendFile(path.join(__dirname,"temp",`${global.title}.mp4`))
   /*res.sendFile(path.join(__dirname,"test.mp4"))*/
  res.on("finish",()=>{
    console.log("file sended")
    global.size = fs.statSync(path.join(__dirname,"temp",`${global.title}.mp4`))
    fs.unlinkSync(path.join(__dirname,"temp",`${global.title}.mp4`))
    console.log("file deleted")
  })
  })
 /* fs.unlinkSync(path.join(__dirname,"temp",`${global.title}.mp4`))*/
  }catch(e){
    res.status(422).json({
      error:"wrong url or private "
    })
  }
 }
app.get("/size",(req,res)=>{
  res.header('Access-Control-Allow-Origin', '*');
   /* res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');*/
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
   size = global.size;
   res.json({size:size.size})
  })
app.post("/video",(req,res)=>{
  try{
  console.log(req.body)
  const {link} = req.body
  console.log(link)
  data = {
    thumbnail:"http://youtube.com",
    isValideUrl:true,
    size:128383,
    name:"sample video",
  }
  res.header('Access-Control-Allow-Origin', '*');
   /* res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');*/
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    
  //res.json(data)
 // res.download(path.join(__dirname,"test.mp4"))
 /*
  const file = fs.readFileSync("test.mp4");
//blob = new Blob([file],{type:"video/mp4"})
  //blob = file.toString("base64")
  //console.log(blob);
  */
  save(link,res)
//  console.log("s3nded")
  /*res.set("Content-Disposition","attachment;",filename=`${global.title}.mp4`)
  res.set("Content-type","text/html")
  res.sendFile(path.join(__dirname,"test.mp4"))
 */
  }catch(e){
    res.status(422).json({
      error:"wrong url or private"
    })
  }
  })
  //next()

app.listen(3000,()=>{
  console.log("listening port 3000")
})
