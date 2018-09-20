var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var http = require('http'),
    busboy = require("then-busboy"),
    fileUpload = require('express-fileupload');

require('./config/config');

var index = require('./routes/index');
var equipments = require('./routes/equipments');
var login = require('./routes/login');
var users = require('./routes/users');
var workout = require('./routes/workout');
var exercises = require('./routes/exercises');

var passport = require("passport");

var app = express();
app.use(passport.initialize());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon inwh /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Fileupload
app.use(fileUpload());

// Database connection
app.use(function (req, res, next) {
   global.connection = mysql.createConnection({
      host: CONFIG.db_host,
      port: CONFIG.db_port,
      user: CONFIG.db_user,
      password: CONFIG.db_password,
      database: CONFIG.db_name
   });
   connection.connect();
   next();
});

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/', index);
app.use('/api/v1/workouts', workout);
app.use('/api/v1/equipments', equipments);
app.use('/api/v1/exercises', exercises);
app.use('/api/v1/login', login);
app.use('/api/v1/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   var err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'dev' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

module.exports = app;
