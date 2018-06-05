var express = require('express');
var path = require('path');
var config = require('./config');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pg = require('pg');
var formidable = require('express-formidable');

var index = require('./routes/index');
var monitoring = require('./routes/monitoring');
var users = require('./routes/users');
var chat = require('./routes/chat');
var notif = require('./routes/notification');
var bidding = require('./routes/bidding');
var email = require('./routes/email');
// var upload = require('./routes/upload');
var job = require('./routes/job');

var Helper = require('./helper');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/** Middleware */
express().use(formidable());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/monitoring', monitoring);
app.use('/users', users);
app.use('/chat', chat);
app.use('/notification', notif);
app.use('/bidding', bidding);
app.use('/email', email);
// app.use('/upload', upload);
app.use('/job', job);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.status(500);
	res.send('the page doesn\'t exist');
});

// error handler
app.use(function(err, req, res, next) {
	res.status(err.status || 500)
	res.send(false);
});


/** end of Middleware */
module.exports = {app: app, helper: Helper};
