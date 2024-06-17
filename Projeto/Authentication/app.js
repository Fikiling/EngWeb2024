var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var path = require('path')
var cookieParser = require('cookie-parser')

var mongoose = require('mongoose')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var createError = require('http-errors');



var mongoDB = 'mongodb://mongoDB:27017/projetoEW'
mongoose.connect(mongoDB, 
  { serverSelectionTimeoutMS: 5000})

var db = mongoose.connection
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'))
db.once('open', () => {
  console.log("Conexão ao MongoDB realizada com sucesso")
})

// passport config
var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var authRouter = require('./routes/auth');

// Set view engine
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: "EngWeb2024",
  resave: true,
  saveUninitialized: true
})
)

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

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
