var express = require('express');
var app = express();
var fs = require('fs');
var request = require('request');
var qs = require('querystring');

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

app.get('/callback', function (req, res) {
    var code = req.query.code;
    var options = {
        headers: {
            'User-Agent': 'request'
        },
        'method': 'POST',
        url: 'https://github.com/login/oauth/access_token',
        body: {
            client_id: '6eb674e7c00e113821c2',
            client_secret: '745b3b951c0e59a502d7d6aa862d1b9957844891',
            code: code
        },
        json: true
    };
    request(options, function (err, http, body) {
        var obj = qs.parse(body);
        console.log('GET CODE', obj, body);
        var options = {
            headers: {
                'User-Agent': 'request'
            },
            'method': 'GET',
            url: 'https://api.github.com/user/repos?access_token=' + obj.access_token
        };

        request.get(options, function (err, http, body) {
            console.log(body);
            res.send(body);
        });

    });
});

app.listen(3000, function () {
    console.log('http://localhost:3000/');
});