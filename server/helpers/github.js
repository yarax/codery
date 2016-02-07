'use strict';

/**
 * Fuck node-github
 * @type {request|exports|module.exports}
 */

var reqPromise = require('request-promise');
var qs = require('querystring');

class Api {

    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    getUser() {
        var getUserOption = {
            url: 'https://api.github.com/user',
            method: 'GET',
            access_token: this.accessToken
        };
        return reqPromise(getUserOption);
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
    reqPromise(options).then((http, body) => {
        return qs.parse(body).access_token;
    });
};

module.exports = Api;