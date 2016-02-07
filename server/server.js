var express = require('express');
var app = express();
var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes');
var mongoose = require('mongoose');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../public'));
app.use(router);

app.listen(3000, () => {
    mongoose.connect('mongodb://localhost/codery', () => {
        console.log('http://localhost:3000/');
    });
});