var express = require('express');
const adminHelper = require('../helpers/adminHelper');
const userHelper = require('../helpers/userHelper');
var router = express.Router();
var fs = require('fs')
var path = require('path')
const verifyLogin = (req,res,next)=>{
  if(req.session.admin){
    next()
  }else{ 
    res.redirect('/admin/login')
  }
}
/* GET users listing. */
router.get('/',verifyLogin, function(req, res, next) {
  userHelper.getProducts().then((products)=>{

    res.render('admin/home',{adminPage:true,products,admin:req.session.admin})
  })
});
router.get('/login', function(req, res, next) {
  
  res.render('admin/login',{adminPage:true,loginErr:req.session.adminLoginErr,adminErr:req.session.adminErr,passErr:req.session.adminPassErr})
    req.session.adminLoginErr=false
    req.session.adminErr=false
    req.session.adminPassErr=false
});
router.post('/login', function(req, res, next) {
    adminHelper.doLogin(req.body).then((result)=>{
      if(result.adminErr){
        req.session.adminLoginErr=true
        req.session.adminErr=result.adminErr
        res.redirect('/admin/login')
      }
      if(result.passErr){
        req.session.adminLoginErr=true
        req.session.adminPassErr=result.passErr
        res.redirect('/admin/login')
      }
      if(result.status){
        req.session.admin=true
        res.redirect('/admin')
      } 
    })
    
  });
router.get('/logout', function(req, res, next) {
  req.session.admin=false
  res.redirect('/admin')
})
router.get('/add-product', verifyLogin,function(req, res, next) {
  res.render('admin/add-product',{adminPage:true,sizeNotSelected:req.session.adminNotSelectedSize,admin:req.session.admin})
  req.session.adminNotSelectedSize=false 
});
router.post('/add-product',verifyLogin, async function(req, res, next) {
  
  if(req.body.sizes === ""){
    req.session.adminNotSelectedSize=true
    res.redirect('/admin/add-product')    
  }else{

      let images = await adminHelper.convertToBase64(req.files,req.body.category,req.body.color)
      adminHelper.addProduct(req.body,images).then((response)=>{
        res.redirect('/admin')
      })
    }

});
router.get('/update-product-sizes/:id',verifyLogin, function(req, res, next) {
  adminHelper.getSizes(req.params.id).then((sizes)=>{
    console.log(sizes)
    res.render('admin/update-sizes',{adminPage:true,proId:req.params.id,sizes,admin:req.session.admin})
})
   
})
router.post('/update-product-sizes',verifyLogin, function(req, res, next) {
    adminHelper.updateSizes(req.body.proId,req.body).then((response)=>{
      console.log(response);
      res.redirect('/admin')
    })
})
router.get('/edit-product/:id',verifyLogin, function(req, res, next) {
  adminHelper.getProductDetails(req.params.id).then(async(product)=>{
  let sizes=await adminHelper.getSizes(req.params.id)
  
    res.render('admin/edit-product',{adminPage:true,proId:req.params.id,product,sizes,admin:req.session.admin})
})
   
})
router.post('/edit-product',verifyLogin, async function(req, res, next) {
  
  adminHelper.updateProduct(req.body.proId,req.body).then((response)=>{
    res.redirect('/admin')
  })
})

router.get('/remove-product/:id', verifyLogin,function(req, res, next) {
  adminHelper.deleteProduct(req.params.id).then(async(response)=>{
       res.redirect('/admin')  
})
   
})
router.get('/view-coupons', verifyLogin,function(req, res, next) {
   adminHelper.getCoupons().then((coupons)=>{

     res.render('admin/view-coupons',{adminPage:true,coupons,admin:req.session.admin})
   })
   
})
router.get('/add-coupon',verifyLogin, function(req, res, next) {
    res.render('admin/add-coupon',{adminPage:true,admin:req.session.admin})
   
})
router.post('/add-coupon', verifyLogin,function(req, res, next) {
  adminHelper.addCoupon(req.body).then((result)=>{
    res.redirect("/admin/view-coupons",{adminPage:true,admin:req.session.admin})
  }) 
  
})
  router.get('/remove-coupon/:id', verifyLogin,function(req, res, next) {
          adminHelper.removeCoupon(req.params.id).then((data)=>{
            res.redirect('/admin/view-coupons')
          })
  })


module.exports = router;
