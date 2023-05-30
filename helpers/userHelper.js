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
    }
}