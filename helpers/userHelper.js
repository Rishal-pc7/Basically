var db=require('../config/connection')
var collection=require('../config/collection')
var bcrypt=require('bcryptjs')
var objectId=require('mongodb').ObjectId
let Razorpay = require('razorpay')
var crypto = require('crypto')
let nodemailer = require('nodemailer')
var instance = new Razorpay({
    key_id: 'rzp_live_yKLVzQkqA90zGx',
    key_secret: "6pSKTVXnTS8D6pI16aBX82BK",
  });
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
    getProductsNames:()=>{
       return new Promise(async(resolve, reject) => {
        let names=[]
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({},{_id:1,category:1,color:1}).toArray()
        
        resolve(products)
       })
    },
    getProductColors:(category)=>{
       return new Promise(async(resolve, reject) => {
        let colors=[]
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:category},{color:1}).toArray()
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
                     
                            let response={
                                newProduct:false,
                            }
                            resolve(response)
                        })

                    }else{
                        db.get().collection(collection.CART_COLLECTION).updateOne({_id:new objectId(userCart._id),"products.proId":new objectId(proId)},{
                            $inc:{'products.$.quantity':1},
                            $set:{total:total}
                        }).then(async(data)=>{
                            let response={
                                newProduct:false,
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
                    let response={
                        newProduct:true,
                    }
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
                let response={
                    newProduct:true,
                }
                resolve(response)
            })
        }
        })
    },
    getCart:(user,guestUser,cartId)=>{
        return new Promise(async(resolve, reject) => {
            if(cartId){
                let cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {$match:{_id:new objectId(cartId),user:user}},
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
                
            }
            else{

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
                
                let cart=await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {$match:{user:new objectId(user)}},
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
                
                
            }
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
    applyCoupon:(data)=>{
        return new Promise(async(resolve, reject) => {
            data.total=parseInt(data.total)
            db.get().collection(collection.COUPON_COLLECTION).findOne({couponCode:data.coupon}).then((details)=>{
                if(details === null){
                    resolve({applied:false})
                }else{
                    let discount=details.discountedPercentage/100*data.total

                    discount=parseInt(discount)
                    let total=data.total-discount
                    

                        let result={
                            applied:true,
                            total,
                            discount:details.discountedPercentage
    
                        }
                        resolve(result)
                }
            }).catch((err)=>{
                reject(err)
            })
        })
    },
    getCartProducts:(cartId)=>{
        return new Promise(async(resolve, reject) => {
            let products=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {$match:{_id:new objectId(cartId)}},
                {
                    $project:{products:1,size:1}
                }
            ]).toArray()
            if(products[0]){
                resolve(products[0])

            }
        })
    },
    placeOrder:(details,products,user)=>{
        return new Promise(async(resolve, reject) => {
            details.total=parseInt(details.total)
            let status=details.paymentMethod === 'COD'?'Placed':'Pending'
            // details.total=details.paymentMethod === 'COD' ? details.total+30:details.total
            let deliveryDetails={
                name:details.fname+" "+details.lname,
                address:details.address,
                city:details.city,
                pincode:details.pincode,
                phone:details.phone,
                email:details.email,
                whatsapp:details['wtsp-num']
            }
            function formatDate(date) {
                var d = date
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            
                if (month.length < 2) 
                    month = '0' + month;
                if (day.length < 2) 
                    day = '0' + day;
            
                return [day, month, year].join('-');
            }
            let orderObj={
                date:formatDate(new Date()),
                deliveryDetails,
                total:details.total,
                products:products.products,
                paymentMethod:details.paymentMethod,
                user:user,
                status,
                
            }
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((result)=>{
                let response={
                    status:status,
                    orderId:result.insertedId,
                    total:details.total
                }
                if(status === 'Placed'){

                    db.get().collection(collection.CART_COLLECTION).deleteOne({_id:new objectId(details.cartId)}).then((res)=>{
                        resolve(response)
                    })
                }else{
                    resolve(response)
                }
            }).catch((err)=>{
                reject(err)
            })
        })
    },
    generateRazorPay:(orderId,total)=>{
        return new Promise(async(resolve, reject) => {
            
            var options = {
              amount: total*100,  // amount in the smallest currency unit
              currency: "INR",
              receipt: ""+orderId
            };
            instance.orders.create(options, function(err, order) {
                if(err) throw err
                resolve(order)
            }); 
            
        })
    },
    verifyPayment:(details)=>{
        return new Promise(async(resolve, reject) => {
            let hmac=crypto.createHmac('sha256',"6pSKTVXnTS8D6pI16aBX82BK")
            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
            hmac=hmac.digest('hex')
            console.log(hmac,details['payment[razorpay_signature]']);
            if(hmac == details['payment[razorpay_signature]']){
                resolve()
            }else{
                console.log('Err')
                reject()
            }
        })
    },
    changeOrderStatus:(orderId,cartId)=>{

        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:new objectId(orderId)},
            {
                $set:{status:'Placed'}
            }).then(()=>{
                db.get().collection(collection.CART_COLLECTION).deleteOne({_id:new objectId(cartId)}).then((res)=>{

                    resolve({status:true,id:orderId})
                })
            })
        })
    },
    sendMail:(orderId)=>{
       return new Promise(async(resolve, reject) => {
        let orderProducts=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
            {$match:{_id:new objectId(orderId)}},
            {$unwind:"$products"},
            {$project:{
                proId:"$products.proId",
                deliveryDetails:"$deliveryDetails",
                date:"$date",
                total:"$total",
                size:"$products.size",
                quantity:"$products.quantity",
                paymentMethod:"$paymentMethod"
                
            }},
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'proId',
                    foreignField:'_id',
                    as:'products'
                }
            },
            {
                $project:{proId:1,deliveryDetails:1,date:1,total:1,size:1,paymentMethod:1,quantity:1,products:{$arrayElemAt:['$products',0]}}
            }
        ]).toArray()
        let proHtml
        if(orderProducts.length === 1){
            proHtml=`<h4>Products</h4>
            <ul><li>Item:${orderProducts[0].products.category} Size:${orderProducts[0].size} Quantity:${orderProducts[0].quantity} Color:${orderProducts[0].products.color} Price:${orderProducts[0].products.price}</li></ul>
            `
        }else{
            for(i in orderProducts){
                proHtml+=`<ul><li>Item:${orderProducts[i].products.category} Size:${orderProducts[i].size} Quantity:${orderProducts[i].quantity} Color:${orderProducts[i].products.color} Price:${orderProducts[i].products.price}</li></ul>`
            }
        }
        let html=`<h4>Order Id:${orderProducts[0]._id}</h4>
        <h4>On:${orderProducts[0].date}</h4>
        <h4>Payment Method:${orderProducts[0].paymentMethod}</h4>
        <ul>
           <li style='list-style:none'>Name:${orderProducts[0].deliveryDetails.name}</li>
           <li style='list-style:none'>Address:${orderProducts[0].deliveryDetails.address} ${orderProducts[0].deliveryDetails.pincode} ${orderProducts[0].deliveryDetails.city}</li>
           <li style='list-style:none'>Mobile No:${orderProducts[0].deliveryDetails.phone}</li>
           <li style='list-style:none'>Whatsapp No:${orderProducts[0].deliveryDetails.whatsapp}</li>
           <li style='list-style:none'>Email:${orderProducts[0].deliveryDetails.email}</li>
        </ul>
        
        ${proHtml}
        
        <h3>Order Total:${orderProducts[0].total}</h3>
        `
        const transporter= nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            auth:{
                user:'messagebot69@gmail.com',
                pass:'qlsrdpftmtcbxart'
            },
            tls: {
                ciphers:'SSLv3'
            }
        })
        const info=await transporter.sendMail({
            from:'Basically_Bot <messagebot69@gmail.com> ',
            to:"fasalrahmanpv7@gmail.com",
            subject:'Order Placed',
            html:html
        })
        resolve(info)
       })
    },
    submitReturn:(details)=>{
        return new Promise(async(resolve, reject) => {
            let html=`<h4>A ${details.option} Issued</h4>
            <h4>ORDER ID:${details.orderId}</h4>
            <ul>
               <li style='list-style:none'>Item : ${details.item}</li>
               <li style='list-style:none'>Color : ${details.color}</li>
               <li style='list-style:none'>Size : ${details.size}</li>
            </ul>
            <h3>Contact Information : ${details.contact}</h3>
            `
            const transporter= nodemailer.createTransport({
                host:"smtp.gmail.com",
                port:587,
                secure:false,
                auth:{
                    user:'messagebot69@gmail.com',
                    pass:'qlsrdpftmtcbxart'
                },
                tls: {
                    ciphers:'SSLv3'
                }
            })
            const info=await transporter.sendMail({
                from:'Basically_Bot <messagebot69@gmail.com> ',
                to:"fasalrahmanpv7@gmail.com",
                subject:details.option+' Issued',
                html:html
            })

            resolve(info)
                
        })
    },
    getOrderProducts:(orderId)=>{
        return new Promise(async(resolve, reject) => {
            let orderProducts=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {$match:{_id:new objectId(orderId)}},
                {$unwind:"$products"},
                {$project:{
                    proId:"$products.proId",
                    deliveryDetails:"$deliveryDetails",
                    date:"$date",
                    total:"$total",
                    size:"$products.size",
                    quantity:"$products.quantity",
                    paymentMethod:"$paymentMethod"
                    
                }},
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'proId',
                        foreignField:'_id',
                        as:'products'
                    }
                },
                {
                    $project:{proId:1,deliveryDetails:1,date:1,total:1,size:1,paymentMethod:1,quantity:1,products:{$arrayElemAt:['$products',0]}}
                }
            ]).toArray()
            resolve(orderProducts)           
        })
    }   
}