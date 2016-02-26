var express = require('express');
var app = express();
var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes');
var mongoose = require('mongoose');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));
app.use(router);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('olol');
  socket.on('new message', function (data) {
    //console.log(data);
    //socket.emit('hey');
    router.emit('message', {socket: socket, data: data});
  });
});

server.listen(3000, () => {

    mongoose.connect('mongodb://localhost/codery', () => {
        console.log('http://localhost:3000/');
    });
});
