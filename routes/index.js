var express = require('express');
var router = express.Router();
var userHelper = require('../helpers/userHelper'); 
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
  res.render('pages/login',{ user:req.session.user,loginErr:req.session.loginErr,usrErr:req.session.usrErr,passErr:req.session.passErr });
  req.session.loginErr=false
  req.session.usrErr=null
  req.session.passErr=null
});
router.post('/login', function(req, res, next) {
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
        req.session.user=response.user
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
router.get('/signup', function(req, res, next) {
  res.render('pages/signup',{ user:req.session.user,emailUsed:req.session.userAlreadyUsed });
  req.session.userAlreadyUsed=false
});
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
});
router.get('/logout',function (req,res){
  req.session.user=null
  res.redirect('/')
})


module.exports = router;
