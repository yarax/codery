module.exports = function (app) {
    var fs = require('fs');
    global.chatId = fs.readFileSync(__dirname + '/chatid');
    var token = fs.readFileSync(__dirname + '/token').toString().trim();

    var server = require('http').createServer(app);
    var io = require('socket.io')(server);
    global.users = [];
    global.sendMessage = function (mes) {
        request("https://api.telegram.org/" + token + "/sendMessage?chat_id=" + global.chatId +"&text=" + mes, function (err) {
            if (err) console.log(err);
        });
    };
    global.setChatId = function (chatId) {
        fs.writeFile(__dirname + '/chatid', chatId, function (err) {console.log(err)});
    };
    global.sendBack = function (id, mes) {
        users[id].lastMessage = 0;
        users[id].emit('response', mes);
    };
    io.on('connection', function (socket) {
        socket.lastMessage = 0;
        var id = users.length;
        users[id] = socket;

        socket.on('close', function() {
            users.splice(id, 1);
        });

        var hs = socket.handshake;
        socket.on('new message', function (data) {
            var txt = '[@' + id + '] ' + data;
            socket.lastMessage = Date.now();
            setTimeout(function () {
                if (socket.lastMessage !== 0) {
                    sendBack(id, "Sorry, I'm offline");
                }
            }, 10000);
            sendMessage(txt);
        });
    });
    return server;
}