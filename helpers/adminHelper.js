let db =require('../config/connection')
let fs = require('fs')
let path = require('path')
var objectId=require('mongodb').ObjectId
let collection=require('../config/collection')
let bcrypt = require('bcryptjs')
module.exports={
    doLogin:(details)=>{
        return new Promise(async(resolve, reject) => {
           
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:details.email})
            if(admin){
               bcrypt.compare(details.password,admin.password).then((status)=>{
                let response={}
                if(status){
                    response.status=true
                    response.admin=admin
                }else{
                    resolve({passErr:true})
                }
                resolve(response)
               })
            }else{
                resolve({adminErr:true})
            }
        })
    },
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
                    if(proImages[0] !== null){

                        for(i in proImages){
                            await proImages[i].mv(folder+"/proImages"+i+".jpg")
                            
                            let imgPath=folder+"/proImages"+i+".jpg"
                            
                            
                            let proImgs="data:image/gif;base64,"+fs.readFileSync(imgPath,"base64")
                            image.productImages.push(proImgs)
                            
                        }
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
     },
     getSizes:(proId)=>{
        return new Promise(async(resolve, reject) => {
            let availableSizes=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new objectId(proId)},{sizes:1})
            availableSizes=availableSizes.sizes
            let sizes=['XS','S','M','L','XL','XXL','3XL']
    
            var diff = function(arr1,arr2) {
                var index=[]
                for(var i in arr1) {  

                    if(arr2.indexOf(arr1[i]) > -1){
                        index.push(i--)
                    }
                }
                index.sort(function(a, b){return b-a});
                for(var j in index){
                    arr1.splice(index[j],1)
                    
                }
                console.log(index);
                return arr1;
            };
            let unavail=diff(sizes,availableSizes)
            let sizesObj={
                unavail,
                availableSizes

            }
            resolve(sizesObj)
        })
     },
     updateSizes:(proId,details)=>{
        return new Promise((resolve, reject) => {
            let sizes=details.sizes.split(',')

            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new objectId(proId)},{
                $set:{
                    sizes:sizes
                }
            }).then((response)=>{
                resolve(response)
            })
        })
     },
     getProductDetails:(proId)=>{
        return new Promise(async(resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new objectId(proId)}).then((pro)=>{
                resolve(pro)
            })
        })
     },
     updateProduct:(proId,details)=>{
        return new Promise(async(resolve, reject) => {
           let sizes=details.sizes.split(',')
           db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new objectId(proId)},{
            $set:{
                category:details.category,
                price:details.price,
                color:details.color,
                colorCode:details.colorCode,
                sizes:sizes    
            }
           }).then((response)=>{
            resolve(response)
           })
           
        })
     },
     deleteProduct:(proId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:new objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
     },
     addCoupon:(details)=>{
        return new Promise((resolve, reject) => {
            details.discountedPercentage=parseInt(details.discountedPercentage)
            db.get().collection(collection.COUPON_COLLECTION).insertOne(details).then((data)=>{
                resolve(data.insertedId)
            })
        })
     },
     getCoupons:()=>{
        return new Promise(async(resolve, reject) => {
            let coupons=await db.get().collection(collection.COUPON_COLLECTION).find().toArray()
            resolve(coupons)
        })
     },
     removeCoupon:(id)=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:new objectId(id)}).then((data)=>{
                resolve(data)
            })
        })
     }
}