var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user:true });
});

router.get('/product-page', function(req, res, next) {
  res.render('pages/product-page',{ user:true });
});
router.get('/checkout', function(req, res, next) {
  res.render('pages/checkout',{  });
});
router.get('/accounts', function(req, res, next) {
  res.render('pages/accounts',{ user:true });
});
router.get('/login', function(req, res, next) {
  res.render('pages/login',{ user:true });
});


module.exports = router;
