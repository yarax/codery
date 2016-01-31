var express = require('express');
var app = express();
var fs = require('fs');
var request = require('request');
var qs = require('querystring');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var child = require('child_process');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/../public'));

var mapRepos = function (body) {
    return body.map((item) => {
        return {
            name: item.full_name,
            clone_url: item.clone_url,
            id: item.id
        }
    });
};

var getRoot = function () {
    return __dirname + '/../repos';
};

app.get('/file', function (req, res) {
    var base = getRoot() + req.query.path;
    var str = fs.readFileSync(base).toString();
    res.send(str);
});

app.get('/files', function (req, res) {
    var base = getRoot() + req.query.path + '/';
    var items = fs.readdirSync(base).map((fileName) => {
        var stat = fs.statSync(base + fileName);
        return {
            name: fileName,
            type: stat.isDirectory() ? 'dir' : 'file'
        }
    });
    res.send(items);
});

app.get('/repolist', function (req, res) {
    var access_token = req.cookies.usk;
    var options = {
        headers: {
            'User-Agent': 'request'
        },
        'method': 'GET',
        url: 'https://api.github.com/user/repos?access_token=' + access_token
    };

    request.get(options, function (err, http, body) {
        var items = mapRepos(body);
        res.send(items);
    });
});

app.get('/repolist2', function (req, res) {
    var mocks = require('./mock.json');
    res.send(mapRepos(mocks));
});

app.get('/callback', function (req, res) {
    var code = req.query.code;
    var options = {
        headers: {
            'User-Agent': 'request'
        },
        'method': 'POST',
        url: 'https://github.com/login/oauth/access_token',
        form: {
            client_id: '6eb674e7c00e113821c2',
            client_secret: '745b3b951c0e59a502d7d6aa862d1b9957844891',
            code: code
        }
    };
    request(options, function (err, http, body) {
        var obj = qs.parse(body);
        res.cookie('usk', obj.access_token);
        res.redirect('/reposelect.html');

    });
});

app.post('/clonerepo', function (req, res) {
    var base = __dirname + '/../repos/';
    var data = req.body;
    if (!data.id || !data.clone_url || !data.name) {
        return res.send({error: 'Not valid incoming data'});
    }
    if (!fs.existsSync(base + data.id)) {
        var cmd = 'cd ' + base + ' && mkdir ' + data.id + ' && cd ' + data.id + ' && git clone ' + data.clone_url;
        console.log(cmd);
        child.exec(cmd, function () {
            return res.send({repoId: data.id});
        });
    } else {
        return res.send({repoId: data.id});
    }
});

app.listen(3000, function () {
    console.log('http://localhost:3000/');
});