var express = require('express');
var router = express.Router();
var fs = require('fs');
var child = require('child_process');
var config = require('config');
var request = require('request');
var reqPromise = require('request-promise');
var Api = require('./helpers/github');
var User = require('./models/user');

var urls = {
    getRepos: (access_token) => {
        if (process.env === 'PRODUCTION') {
            return 'https://api.github.com/user/repos?access_token=' + access_token;
        } else {
            return `http://${config.get('host')}:${config.get('port')}/test_repos.json`;
        }
    }
};

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
        url: urls.getRepos(access_token)
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

router.post('/clonerepo', function (req, res, next) {
    var base = __dirname + '/../repos/';
    var data = req.body;
    var rev = req.query.rev;
    if (!data.id || !data.clone_url || !data.name) {
        return res.send({error: 'Not valid incoming data'});
    }
    if (!data.id.toString().match(/^\d+$/)) {
        throw new Error('Wrong repo id');
    }
    if (rev.match(/[ \\\'\"\&]+/)) {
        throw new Error('Invalid branch name');
    }
    if (data.clone_url.match(/[ \\\'\"]+/)) {
        throw new Error('Invalid clone url name');
    }
    var cmd = `cd "${base}" && mkdir "${data.id}" && `;
    var cmd = 'cd ' + base + ' && mkdir ' + data.id + ' && cd ' + data.id + ' && git clone ' + data.clone_url + ' && git checkout ' + rev;
    console.log(cmd);
    if (!fs.existsSync(base + data.id)) {
        child.exec(cmd, function (err) {
            if (err) {
                console.log(err);
                return next(`Can't clone repo`);
            }
            return res.send({repoId: data.id});
        });
    } else {
        return res.send({repoId: data.id});
    }
});

router.post('/telegram', (req, res) => {
    res.end();
    global.setChatId(req.body.message.chat.id);
    var txt = req.body.message.text;
    var to = txt.match(/@(\d+)/);
    if (!to) return global.sendMessage('No id');
    var clear = txt.replace(/@\d+/, '');
    global.sendBack(to[1], clear);
    res.end();
});

module.exports = router;
