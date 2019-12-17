var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var monk = require('monk');
var cookieSession = require('cookie-session');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

mongoose.connect('mongodb://localhost:27017/assignment4',
    {useNewUrlParser: true}
);

var albumsRouter = require("./routes/albums");

var app = express();

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 60 * 60 * 1000,
}));
app.use(fileUpload({}));

app.use('/', albumsRouter);

module.exports = app;
