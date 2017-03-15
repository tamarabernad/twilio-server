var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var accountSid = 'AC**'; // Your Account SID from www.twilio.com/console
var authToken = '**';   // Your Auth Token from www.twilio.com/console
var api_key_secret = '**';
var api_key = 'SK**';
var app_sid = 'AP**';
var push_credentials_sid = 'CR**';

var twilio = require('twilio');
const AccessToken = require('twilio').jwt.AccessToken;
const TwimlResponse = require('twilio').TwimlResponse;
const VoiceGrant = AccessToken.VoiceGrant;


var client = new twilio.Twilio(accountSid, authToken);

app.get('/token', function(request, response) {
  var userId = request.query.userId;
  console.log("userId"+userId);
  var grant = new VoiceGrant({
    outgoingApplicationSid:app_sid,
    pushCredentialSid:push_credentials_sid
  });
  const token = new AccessToken(accountSid, api_key, api_key_secret,{identity:userId});
  token.addGrant(grant);
  console.log("token.toJwt()"+token.toJwt());
  response.send(token.toJwt());
});

app.get('/voice', function(request, response) {
  console.log("outgoing");

  var resp = new TwimlResponse()
  resp.say("Congratulations! You have made your first oubound call! Good bye.")
  return res.toString()
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
