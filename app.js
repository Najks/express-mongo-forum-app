var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs');
const handlebars = require('handlebars');



var mongoose = require('mongoose');
var mongoDB = "mongodb://127.0.0.1/myDB";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var questionsRouter = require('./routes/questions');
var answersRouter = require('./routes/answers');

var app = express();

var session = require('express-session');
var MongoStore = require('connect-mongo');

app.use(session({
  secret: 'work hard',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoDB,
    collection: 'sessions'
  })
}));
//seja v vseh pogledih
app.use((req, res, next) => {
  res.locals.session = req.session; 
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);

const methodOverride = require('method-override');


app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(methodOverride('_method'));

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

hbs.registerHelper('set', function(variable, value, options) {
  this[variable] = value;
});
const moment = require('moment');

hbs.registerHelper('formatDate', function (date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});

hbs.registerHelper('eq', function (a, b) {
  if (!a || !b) {
    return false; 
  }
  return a.toString() === b.toString();
});

module.exports = app;