var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname + '/../public'));

app.get('/file', function (req, res) {
    var base = __dirname + '/..' + req.query.path;
    var str = fs.readFileSync(base).toString();
    res.send(str);
});

app.get('/files', function (req, res) {
    var base = __dirname + '/..' + req.query.path + '/';
    var items = fs.readdirSync(base).map((fileName) => {
        var stat = fs.statSync(base + fileName);
        return {
            name: fileName,
            type: stat.isDirectory() ? 'dir' : 'file'
        }
    });
    res.send(items);
});

app.listen(3000, function () {
    console.log('http://localhost:3000/');
});