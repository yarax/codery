'use strict';

/**
 * Fuck node-github
 * @type {request|exports|module.exports}
 */

var rp = require('request-promise');
var qs = require('querystring');
var config = require('config');

var urls = {
    getRepos: (access_token) => {
        if (process.env === 'PRODUCTION') {
            return 'https://api.github.com/user/repos?access_token=' + access_token;
        } else {
            return `http://${config.get('host')}:${config.get('port')}/test_repos.json`;
        }
    }
};

class Api {

    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    getUser() {
        var getUserOption = {
            url: 'https://api.github.com/user?access_token=' + this.accessToken,
            method: 'GET',
            headers: {
                'User-Agent': 'request'
            }
        };
        return rp(getUserOption).then((str) => {
            return JSON.parse(str);
        });
    }

    repolist() {
        var mapRepos = function (body) {
            return body.map((item) => {
                return {
                    name: item.full_name,
                    clone_url: item.clone_url,
                    id: item.id
                }
            });
        };

        var options = {
            headers: {
                'User-Agent': 'request'
            },
            'method': 'GET',
            url: urls.getRepos(this.accessToken)
        };

        return rp.get(options).then(function (body) {
            body = JSON.parse(body);
            return mapRepos(body);
        });
    }

}

Api.login = function(code) {
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

    return rp(options).then((body) => {
        var data = qs.parse(body);
        if (data.access_token) {
            return data.access_token;
        } else {
            throw new Error(body);
        }
    });
};

module.exports = Api;