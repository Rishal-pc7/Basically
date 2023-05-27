let db =require('../config/connection')
let fs = require('fs')
let path = require('path')
module.exports={
     convertToBase64:(images,proCat,proColor)=>{
        return new Promise((resolve,reject)=>{
            let image={
                productImages:[]
            }
            let coverImage=images.coverImage
            let proImages=images.proImage
            let folder='./public/images/'+proCat+"_"+proColor
            fs.mkdirSync(folder,{recursive:true})
            coverImage.mv(folder+"/coverImage.jpg").then(async()=>{
                let coverImagePath=folder+"/coverImage.jpg"
                image.coverImage="data:image/gif;base64,"+fs.readFileSync(coverImagePath,"base64")
                for(i in proImages){
                    await proImages[i].mv(folder+"/proImages"+i+".jpg")

                        let imgPath=folder+"/proImages"+i+".jpg"
                        let proImgs="data:image/gif;base64,"+fs.readFileSync(imgPath,"base64")
                        image.productImages.push(proImgs)
                }
                let response={
                    image,
                    folder
                }
                fs.rmSync(folder ,{recursive:true,force:true})
                console.log(image);
                resolve(response)

            }).catch((err)=>{
                reject(err)
            })
            

        })
     }
}