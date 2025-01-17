var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var playerRouter = require('./routes/player');
var refereeRouter = require('./routes/referee');
var coachRouter = require('./routes/coach');
var accountRouter = require('./routes/account');
var matchRouter = require('./routes/match');
var regulationRouter = require('./routes/regulation');
var teamRouter = require('./routes/team');
var rankRouter = require('./routes/rank');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/player', playerRouter);
app.use('/referee', refereeRouter);
app.use('/coach', coachRouter);
app.use('/account', accountRouter);
app.use('/match', matchRouter);
app.use('/regulation', regulationRouter);
app.use('/team',teamRouter);
app.use('/rank', rankRouter);

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
