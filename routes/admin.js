var express = require('express');
const adminHelper = require('../helpers/adminHelper');
var router = express.Router();
var fs = require('fs')
var path = require('path')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/home',{adminPage:true})
});
router.get('/add-product', function(req, res, next) {
  res.render('admin/add-product',{adminPage:true,sizeNotSelected:req.session.adminNotSelectedSize})
  req.session.adminNotSelectedSize=false
});
router.post('/add-product', async function(req, res, next) {
  
  if(req.body.sizes === ""){
    req.session.adminNotSelectedSize=true
    res.redirect('/admin/add-product')    
  }else{

      let images = await adminHelper.convertToBase64(req.files,req.body.category,req.body.color)
      adminHelper.addProduct(req.body,images).then((response)=>{
        console.log(response);
      })
    }

});

module.exports = router;
