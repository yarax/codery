var express = require('express');
var router = express.Router();
var fs = require('fs');
var child = require('child_process');
var request = require('request');
var reqPromise = require('request-promise');
var Api = require('./helpers/github');
var User = require('./models/user');

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

router.get('/file', function (req, res) {
    var base = getRoot() + req.query.path;
    var str = fs.readFileSync(base).toString();
    res.send(str);
});

router.get('/files', function (req, res) {
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

router.get('/repolist', function (req, res) {
    var access_token = req.cookies.usk;
    var options = {
        headers: {
            'User-Agent': 'request'
        },
        'method': 'GET',
        url: 'https://api.github.com/user/repos?access_token=' + access_token
    };

    request.get(options, function (err, http, body) {
        body = JSON.parse(body);
        var items = mapRepos(body);
        res.send(items);
    });
});

router.get('/repolist2', function (req, res) {
    var mocks = require('./mock.json');
    res.send(mapRepos(mocks));
});

router.get('/callback', function (req, res) {
    var code = req.query.code;
    var userData;
    var token;
    Api.login(code).then((accessToken) => {
        token = accessToken;
        console.log('access token', accessToken);
        return accessToken;
    }).then((accessToken) => {
        var api = new Api(accessToken);
        return api.getUser();
    }).then((data) => {
        console.log('user data', data);
        userData = data;
        return User.findOne({email: data.email});
    }).then((existingUser) => {
        if (!existingUser) {
            return User.createFromData(userData);
        } else {
            return existingUser;
        }
    }).then(() => {
        res.cookie('usk', token);
        res.redirect('/reposelect.html');
    }).catch((err) => {
        console.log(err);
        res.redirect('/');
    });

});

router.post('/clonerepo', function (req, res) {
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

module.exports = router;