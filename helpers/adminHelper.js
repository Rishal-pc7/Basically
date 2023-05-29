let db =require('../config/connection')
let fs = require('fs')
let path = require('path')
const collection = require('../config/collection')
let sharp = require('sharp') 
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
                await sharp(coverImagePath).jpeg({quality:80})

                    image.coverImage="data:image/gif;base64,"+fs.readFileSync(coverImagePath,"base64")
                for(i in proImages){
                    await proImages[i].mv(folder+"/proImages"+i+".jpg")

                        let imgPath=folder+"/proImages"+i+".jpg"
                        await sharp(imgPath).jpeg({quality:40})

                            let proImgs="data:image/gif;base64,"+fs.readFileSync(imgPath,"base64")
                            image.productImages.push(proImgs)
                }
                
                fs.rmSync(folder ,{recursive:true,force:true})
                resolve(image)

            }).catch((err)=>{
                reject(err)
            })
            

        })
     },
     addProduct:(details,images)=>{
        return new Promise((resolve, reject) => {
            let sizes=details.sizes.split(',')
           let proDetails={
            category:details.category,
            price:details.price,
            color:details.color,
            colorCode:details.colorCode,
            sizes:sizes,
            coverImage:images.coverImage,
            proImages:images.productImages
           }
           db.get().collection(collection.PRODUCT_COLLECTION).insertOne(proDetails).then((response)=>{

               resolve(response.insertedId)            
           })
        })
     }
}