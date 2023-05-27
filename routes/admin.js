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
  res.render('admin/add-product',{adminPage:true})
});
router.post('/add-product', async function(req, res, next) {
  adminHelper.convertToBase64(req.files,req.body.category,req.body.color).then((response)=>{

  })

});

module.exports = router;
