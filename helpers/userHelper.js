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
            if(products[0]){

                resolve(products)
            }else{
                resolve(null)

            }
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
            console.log(proId);
            let total=0
            let userCart
            let proObj={
                proId:new objectId(''+proId),
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
                total=userCart.total+price

                let proExist=userCart.products.findIndex(product => product.proId == proId)
                if(proExist > -1){ 
                    let sizeChanged=userCart.products.findIndex(product => product.size === size)
                    if(sizeChanged === -1){
                        db.get().collection(collection.CART_COLLECTION).updateOne({_id:new objectId(userCart._id),"products.proId":new objectId(proId)},{
                            $set:{"products.$.size":size,total:price}
                        }).then(async(data)=>{
                            let cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
                                {$match:{_id:new objectId(userCart._id)}},
                                {$unwind:'$products'},
                                {$project:{
                                    proId:"$products.proId",
                                    quantity:"$products.quantity",
                                    size:"$products.size",
                                }},
                                {
                                    $lookup:{
                                        from:"product",
                                        localField:'proId',
                                        foreignField:'_id',
                                        as:'product'
                                    }
                                },
                                  
                                
                            ]).toArray()
                            let response={
                                newProduct:false,
                                items:cart[0]
                            }
                            resolve(response)
                        })

                    }else{
                        db.get().collection(collection.CART_COLLECTION).updateOne({_id:new objectId(userCart._id),"products.proId":new objectId(proId)},{
                            $inc:{'products.$.quantity':1},
                            $set:{total:total}
                        }).then(async(data)=>{
                            console.log(data);
                            let cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
                                {$match:{_id:new objectId(userCart._id)}},
                                {$unwind:'$products'},
                                {$project:{
                                    proId:"$products.proId",
                                    quantity:"$products.quantity",
                                    size:"$products.size",
                                }},
                                {
                                    $lookup:{
                                        from:"product",
                                        localField:'proId',
                                        foreignField:'_id',
                                        as:'product'
                                    }
                                },
                                  
                                
                            ]).toArray()
                            let response={
                                newProduct:false,
                                items:cart[0]
                            }
                            resolve(response)
                        })

                    }
                }else{
                    console.log(total)
                    db.get().collection(collection.CART_COLLECTION).updateOne({_id:new objectId(userCart._id)},
                    {
                    $set:{total:total},
                    $push:{
                        products:proObj
                    }
                }
                ).then(async(data)=>{
                    let cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
                        {$match:{_id:new objectId(userCart._id)}},
                        {$unwind:'$products'},
                        {$project:{
                            proId:"$products.proId",
                            quantity:"$products.quantity",
                            size:"$products.size",
                        }},
                        {
                            $lookup:{
                                from:"product",
                                localField:'proId',
                                foreignField:'_id',
                                as:'product'
                            }
                        },
                        
                        {
                            $project:{_id:1,total:1,quantity:1,proId:1,size:1,
                                product: { 
                                    $map: { 
                                        input: "$product", 
                                        as: "product", 
                                        in: { 
                                            product:{$arrayElemAt:['$product',0]}
                                        } 
                                    } 
                               } 
                            }
                        }  
                        
                    ]).toArray()
                    let response={
                        newProduct:true,
                        items:cart
                    }
                    console.log(response);
                    resolve(response)
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
                let cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {$match:{user:cartData.user}},
                    {$unwind:'$products'},
                    {$project:{
                        proId:"$products.proId",
                        quantity:"$products.quantity",
                        size:"$products.size",
                    }},
                    {
                        $lookup:{
                            from:"product",
                            localField:'proId',
                            foreignField:'_id',
                            as:'product'
                        }
                    }, 
                    {
                        $project:{_id:1,total:1,quantity:1,proId:1,size:1,
                            product: { 
                                $map: { 
                                    input: "$product", 
                                    as: "product", 
                                    in: { 
                                        product:{$arrayElemAt:['$product',0]}
                                    } 
                                } 
                           } 
                        }
                    }  
                 
                    
                ]).toArray()
                let response={
                    newProduct:true,
                    items:cart
                }
                resolve(response)
            })
        }
        })
    },
    getCart:(user,guestUser)=>{
        return new Promise(async(resolve, reject) => {
            if(guestUser){

                let cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {$match:{user:user}},
                    {$unwind:'$products'},
                    {$project:{
                        proId:"$products.proId",
                        quantity:"$products.quantity",
                        size:"$products.size",
                        total:"$total"
                    }},
                    {
                        $lookup:{
                            from:"product",
                            localField:'proId',
                            foreignField:'_id',
                            as:'product'
                        }
                    },
                    {
                        $project:{proId:1,total:1,size:1,quantity:1,product:{$arrayElemAt:["$product",0]}}
                    }
                    
                ]).toArray()
                    resolve(cart) 
                
            }else{
                db.get().collection(collection.CART_COLLECTION).findOne({user:new objectId(user._id)}).then((data)=>{
                    resolve(data)
                })
                
            }
        })
    },
    changeProductQuantity:(details)=>{
        return new Promise(async(resolve, reject) => {
            details.quantity=parseInt(details.quantity)
            details.value=parseInt(details.value)
            details.price=parseInt(details.price)
            details.total=parseInt(details.total)
            let quantity= details.quantity+details.value
            let total
            if(details.value>-1){

                total= details.total-details.price+quantity*details.price
            }else{
                total= details.total-details.price

            }
            console.log(details.total,quantity,details.price)
            db.get().collection(collection.CART_COLLECTION).updateOne({_id:new objectId(details.cartId),"products.proId":new objectId(details.proId)},{
                $set:{'products.$.quantity':quantity,total:total} 
            }).then((data)=>{
                let response={
                    total,
                    quantity
                } 
                resolve(response) 
            })
        })  
        
    },
    removeProduct:(details)=>{
        return new Promise(async(resolve, reject) => {
            details.quantity=parseInt(details.quantity)
            details.price=parseInt(details.price)
            details.total=parseInt(details.total)
            let total=details.total-details.quantity*details.price
            
            db.get().collection(collection.CART_COLLECTION).updateOne({_id:new objectId(details.cartId),"products.proId":new objectId(details.proId)},{
                $set:{total:total} ,
                $pull:{products:{proId:new objectId(details.proId)}}
            }).then((data)=>{
                let response={
                    total,
                } 
                resolve(response) 
            })
        })  
        
    },
}