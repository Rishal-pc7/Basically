var db=require('../config/connection')
var collection=require('../config/collection')
var bcrypt=require('bcrypt')
var objectId=require('mongodb').ObjectId
module.exports={
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            let response={}
          if(user){
             bcrypt.compare(userData.password,user.password).then((status)=>{
                if(status){
                    response.status=true
                    response.user=user
                }else{
                    resolve({passErr:true})
                } 


                resolve(response)
             })
          }else{
            resolve({usrErr:true})
          }
        })
    },
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
           userData.password=await bcrypt.hash(userData.password,10)
           let isUserThere=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
           if(isUserThere){
            resolve({emailAlreadyUsed:true})
           }else{

               db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                   resolve(data.insertedId)
                })
            }
        })
    },
    getUser:(id)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:new objectId(id)}).then((user)=>{
                resolve(user)
           })
        })
    },
    changePassword:(details)=>{
        return new Promise(async(resolve,reject)=>{
          let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:details.email})
          if(user){
             details.password=await bcrypt.hash(details.password,10)
             db.get().collection(collection.USER_COLLECTION).updateOne({_id:new objectId(user._id)},{
                $set:{
                    password:details.password
                }
             }).then((res)=>{
                console.log(res)
                resolve(res)
             })
          }else{
            resolve({accErr:true})
          }
        })
    },
    changeUserDetails:(details,userId)=>{
        return new Promise((resolve,reject)=>{
           db.get().collection(collection.USER_COLLECTION).updateOne({_id:new objectId(userId)},{
            $set:{
                fname:details.fname,
                lname:details.lname,
                email:details.email
            }
           }).then((res)=>{
            resolve(res)
           })
           
        })
    },
    getProducts:()=>{
        return new Promise(async(resolve, reject) => {
            let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    getProductColors:(category)=>{
       return new Promise(async(resolve, reject) => {
        let colors=[]
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:category}).toArray()
        for(i in products){
            let proColor={}
            proColor.id=products[i]._id
            proColor.color=products[i].colorCode
           colors.push(proColor)
        }
        resolve(colors)
       })
    },
    getProductDetails:(proId)=>{
        return new Promise(async(resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    addToCart:(proId,size,user,isGuest)=>{
        return new Promise(async(resolve, reject) => {
            let total=0
            let userCart
            let proObj={
                proId:proId,
                quantity:1,
                size:size
            }
            let priceObj=await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
                {$match:{_id:new objectId(proId)}},
                {$project:{_id:1,price:1}},
                {$limit:1}
            ]).toArray()
            let price=parseInt(priceObj[0].price)
            if(isGuest){
                userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:user})
            }else{
                userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:new objectId(user)})
            }
            if(userCart){
                let proExist=userCart.products.findIndex(product => product.proId == proId)
                total=userCart.total+price
                if(proExist > -1){
                    let sizeChanged=userCart.products.findIndex(product => product.size === size)
                    if(sizeChanged === -1){
                        db.get().collection(collection.CART_COLLECTION).updateOne({_id:new objectId(userCart._id),"products.proId":proId},{
                            $set:{"products.$.size":size,total:price}
                        }).then((data)=>{
                            
                            resolve(data)
                        })

                    }else{
                        db.get().collection(collection.CART_COLLECTION).updateOne({_id:new objectId(userCart._id),"products.proId":proId},{
                            $inc:{'products.$.quantity':1},
                            $set:{total:total}
                        }).then((data)=>{
                            
                            resolve(data)
                        })

                    }
                }else{

                    db.get().collection(collection.CART_COLLECTION).updateOne({_id:new objectId(userCart._id)},
                    {
                    $set:{total:total},
                    $push:{
                        products:proObj
                    }
                }
                ).then((data)=>{
                  resolve(data)
                })
            }
            }else{

                total += price 
                let cartObj={
                    user:user,
                products:[proObj],
                total:total
            }
            db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then(async(data)=>{
                let cartData=await db.get().collection(collection.CART_COLLECTION).findOne({_id:new objectId(data.insertedId)})
                resolve(cartData)
            })
        }
        })
    }
}