var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var hbs=require('express-handlebars')
var handlebars = hbs.create({})
var app = express();
const db=require('./config/connection')
var fileUpload = require('express-fileupload')
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('trust proxy', 1) // trust first proxy
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout',partialsDir:__dirname+'/views/partials'}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')));
//mongo connection

db.connect()

// session
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge:31*24*3600000},
}))
//handlebars helpers
handlebars.handlebars.registerHelper('if_eq', function(arg1,arg2,options) {
  return(arg1 == arg2)?options.fn(this) : options.inverse(this)
})
handlebars.handlebars.registerHelper('if_lt', function(arg1,arg2,options) {
  return(arg1 <= arg2)?options.fn(this) : options.inverse(this)
})
handlebars.handlebars.registerHelper('if_gt0_ltVal', function(arg1,arg2,options) {
  return(arg1 <= arg2 && arg1 > 0)?options.fn(this) : options.inverse(this)
}) 


app.use('/', indexRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
