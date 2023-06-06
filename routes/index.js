var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/userHelper'); 
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
  let proCategory='The Perfect Tshirt | SUPIMA'
  let colors=await userHelper.getProductColors(proCategory)
  let products=await userHelper.getProducts()
  let cart=await userHelper.getCart(user,guestUser)
  let cartId
  let total=0 
  if(cart[0]){
    cartId=cart[0]._id
    total=cart[0].total  
  }
  else{
    emptyCart=true

  }
  res.render('index', { clientPage:true,user:req.session.user,products,colors,emptyCart,cart,cartId,total});
});

router.get('/terms&conditions',async function(req, res, next) {
  res.render("pages/terms",{clientPage:true})
})
router.get('/return-policy',async function(req, res, next) {
  res.render("pages/return-policy",{clientPage:true})
})
router.get('/privacy-policy',async function(req, res, next) {
  res.render("pages/privacy-policy",{clientPage:true})
})
router.get('/shipping-policy',async function(req, res, next) {
  res.render("pages/shipping-policy",{clientPage:true})
})
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
  let products=await userHelper.getProductsNames()
  let cart=await userHelper.getCart(user,guestUser)
  let cartId
  let total=0
  if(cart[0]){
    cartId=cart[0]._id
    total=cart[0].total 
  }
  else{
    emptyCart=true
  }
  userHelper.getProductDetails(req.params.id).then(async(product)=>{
    let colors=await userHelper.getProductColors(product.category)
    res.render('pages/product-page',{ clientPage:true,colors,product,products,colors,emptyCart,cart,total,cartId }); 
  })
}); 

router.get('/download-size-chart',async function(req,res,next){
  res.download('./public/images/Size-chart.pdf')
})
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
  userHelper.removeProduct(req.body).then((data)=>{
    res.json({status:true})      
  })
})   
router.get('/checkout/:cartId',async function(req, res, next) { 
  let guestUser=false
  let user
  if(req.session.user){ 
    user=req.session.user 
  }else{
    user=req.sessionID
    guestUser=true
  } 
  let cart=await userHelper.getCart(user,guestUser,req.params.cartId) 
  let total
  let cartId=req.params.cartId
  if(cart[0]){
    total=cart[0].total
  } 
  res.render('pages/checkout',{ cart,total,cartId }); 
})
router.post('/checkout',async(req,res,next)=>{
  let user
  if(req.session.user){ 
    user=req.session.user 
  }else{
    user=req.sessionID
  }
  let products=await userHelper.getCartProducts(req.body.cartId)
  userHelper.placeOrder(req.body,products,user).then(async(data)=>{
    
    if(data.status === 'Placed'){
      res.json({codSuccess:true,id:data.orderId}) 
      let email=await userHelper.sendMail(data.orderId)
      }
      else if(data.status === 'Pending'){
        userHelper.generateRazorPay(data.orderId,data.total).then((response)=>{    
            res.json({response,cartId:req.body.cartId})
        })

      } 
  })
})
router.post('/verifyPayment',(req,res,next)=>{ 
  console.log(req.body);
  userHelper.verifyPayment(req.body).then((data)=>{
     userHelper.changeOrderStatus(req.body['order[receipt]'],req.body.cartId).then(async(status)=>{
      if(status.status){
        res.json({success:true,id:status.id})
        let email=await userHelper.sendMail(req.body['order[receipt]'])
      }   
     })
  }).catch((err)=>{
    console.log('Err');
    res.json({success:false})
  })
})
router.get('/thank-you/:id',(req,res,next)=>{
  userHelper.getOrderProducts(req.params.id).then((orders)=>{

    res.render('pages/thankyou-page',({clientPage:true,orders}))
  })
})    
router.post('/applyCoupon',(req,res,next)=>{
  userHelper.applyCoupon(req.body).then((data)=>{ 
    if(data.applied){ 
      res.json({status:true,total:data.total,discount:data.discount})
    }else{
      res.json({status:false})
    }
  })
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
