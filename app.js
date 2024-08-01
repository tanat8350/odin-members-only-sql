const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');
const passport = require('passport');

const compression = require('compression');
const helmet = require('helmet');

require('dotenv').config();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

mongoose.set('strictQuery', false);

const mongoDB = process.env.DB_URI;

// NOTE: - try odin later
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authenticateRouter = require('./routes/authenticate');

const app = express();

const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 60000, // 1 min
  max: 20,
});
app.use(limiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URI,
      collection: 'sessions',
    }),
    cookie: { maxAge: 86400000 },
  })
);
app.use(passport.session());

require('./config/authentication');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(compression());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', authenticateRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
