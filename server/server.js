var express = require('express');
var app = express();
var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes');
var mongoose = require('mongoose');
var fs = require('fs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));
app.use(router);
global.chatId = fs.readFileSync(__dirname + '/chatid');

var server = require('http').createServer(app);
var io = require('socket.io')(server);
global.users = [];
global.sendMessage = function (mes) {
    var token = 'bot145682125:AAHHCwyJV7w9M96FlaKkvj3zSAZ06h0mXZo';
    request("https://api.telegram.org/" + token + "/sendMessage?chat_id=" + global.chatId +"&text=" + mes);
};
global.setChatId = function (chatId) {
    fs.writeFile(__dirname + '/chatid', chatId);
};
io.on('connection', function (socket) {
    var id = users.length;
    users[id] = socket;

    socket.on('close', function() {
        users.splice(id, 1);
    });

    var hs = socket.handshake;
    socket.on('new message', function (data) {
        var txt = '[@' + id + '] ' + data;
        sendMessage(txt);
    });
});

server.listen(3000, () => {

    mongoose.connect('mongodb://localhost/codery', () => {
        console.log('http://localhost:3000/');
    });
});
