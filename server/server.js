var express = require('express');
var app = express();
var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = require('./routes');
var config = require('config');
var mongoose = require('mongoose');

var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var schema = require('./schema');
app.use('/graphql', graphqlHTTP({ schema: schema, pretty: true, graphiql: true }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));
app.use(router);
app.set('view engine', 'ejs');

app.use((err, req, res, next) => {
    console.log(err.message, err.stack);
    res.status(500);
    res.send(err);
});
var server;

if (process.env === 'PRODUCTION') {
    server = require('./socket.js');
} else {
    server = app;
}

server.listen(config.get('port'), config.get('host'), () => {

    mongoose.connect('mongodb://localhost/codery', () => {
        console.log(`http://${config.get('host')}:${config.get('port')}/`);
    });
});
