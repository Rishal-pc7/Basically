var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/userHelper'); 
const { response } = require('../app');
/* GET home page. */
const verifyLogin =(req,res,next)=>{
  let user = req.session.user
  if(user){
    next()
  }else{
    res.redirect('/login')
  }
} 
router.get('/',async function(req, res, next) {
  let user
  let guestUser=false
  if(req.session.user){
    user=req.session.user 
  }else{
    user=req.sessionID
    guestUser=true
  }
  let emptyCart=false
  let proCategory='The Perfect Tshirt'
  let colors=await userHelper.getProductColors(proCategory)
  let products=await userHelper.getProducts()
  let cart=await userHelper.getCart(user,guestUser)
  let cartId=cart._id
  if(!cart){
    emptyCart=true
  } 
  res.render('index', { clientPage:true,user:req.session.user,products,colors,emptyCart,cart,cartId});
});

router.get('/product-page/:id',async function(req, res, next) {
  let user
  let guestUser=false
  if(req.session.user){
    user=req.session.user
  }else{
    user=req.sessionID
    guestUser=true
  }
  let emptyCart=false
  let products=await userHelper.getProducts()
  let cart=await userHelper.getCart(user,guestUser)
  let cartId=cart._id
  console.log(cart)
  let total=0
  if(cart[0]){

    total=cart[0].total
  }
  if(cart[0] === null){
    emptyCart=true
  }
  userHelper.getProductDetails(req.params.id).then(async(product)=>{
    let colors=await userHelper.getProductColors(product.category)
    res.render('pages/product-page',{ clientPage:true,colors,product,products,colors,emptyCart,cart,total,cartId });
  })
});
router.get('/addToCart/:proId/:size',async function(req,res,next){
  let user 
  let isGuest=false
  if(req.session.user){ 
  
    user=req.session.user._id
  }else{ 
    isGuest=true
    user=req.sessionID
  } 
  userHelper.addToCart(req.params.proId,req.params.size,user,isGuest).then((result)=>{
    res.json({status:true,newProduct:result.newProduct})
  })
})    
router.post('/changeProductQuantity',(req,res,next)=>{
  userHelper.changeProductQuantity(req.body).then((data)=>{
    res.json({status:true,total:data.total,quantity:data.quantity})
  }) 
})   
router.post('/removeProduct',(req,res,next)=>{
  console.log('dataa')
  userHelper.removeProduct(req.body).then((data)=>{
    console.log('Yess')   
    res.json({status:true})     
  })
})   
router.get('/checkout/:cartId', function(req, res, next) {  
  res.render('pages/checkout',{  }); 
})
router.get('/accounts',verifyLogin, async function(req, res, next) {
    let userDetails=await userHelper.getUser(req.session.user._id)
    res.render('pages/accounts',{ clientPage:true,user:req.session.user,userDetails });
   
})
router.post('/change-user-details',function (req,res,next){
  userHelper.changeUserDetails(req.body,req.session.user._id).then((resp)=>{
    res.redirect('/accounts')
  })
})
router.get('/login', function(req, res, next) {
  res.render('pages/login',{ clientPage:true,user:req.session.user,loginErr:req.session.loginErr,usrErr:req.session.usrErr,passErr:req.session.passErr });
  req.session.loginErr=false
  req.session.usrErr=null
  req.session.passErr=null
})
router.post('/login', function(req, res, next) {
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.user=response.user
      console.log(req.body.query);
       res.redirect('/')


        req.session.usrErr=null
        req.session.passErr=null
    }else{
           req.session.loginErr=true
           req.session.usrErr=response.usrErr
           req.session.passErr=response.passErr
           res.redirect('/login')
          }
        })   
      });
router.get('/forgot-password', function(req, res, next) {
  res.render('pages/forgot-password',{clientPage:true,accErr:req.session.forgotAccErr})
  req.session.forgotAccErr=false
}) 
router.post('/forgot-password', function(req, res, next) {
  userHelper.changePassword(req.body).then((response)=>{
    if(response.accErr){
      req.session.forgotAccErr=true
      res.redirect('/forgot-password')
    }
    req.session.forgotAccErr=false
    res.redirect('/login')
  }).catch((err)=>{
    console.error(err);
  }) 
})
router.get('/signup', function(req, res, next) {
  res.render('pages/signup',{ clientPage:true,user:req.session.user,emailUsed:req.session.userAlreadyUsed });
  req.session.userAlreadyUsed=false 
})
router.post('/signup', function(req, res, next) {
  userHelper.doSignup(req.body).then((result)=>{
    if(result.emailAlreadyUsed){
      req.session.userAlreadyUsed=true
      console.log("Already Used");
      res.redirect('/signup')
    }else{ 
           req.session.userAlreadyUsed=false
           userHelper.getUser(result).then((response)=>{
             req.session.user=response
             res.redirect('/')
           })
         }
   })   
})
router.get('/logout',function (req,res){
  req.session.user=null
  res.redirect('/')
})


module.exports = router;
