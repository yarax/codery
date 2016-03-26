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
var userFields = {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    pass: {
        type: graphql.GraphQLString,
        resolve: (model, query) => {
            return '******';
        }
    }
};
var userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: userFields
});

var users = {
    13: {
        name: "Loser",
        id: 13,
        pass: '123',
        money: 100
    },
    7: {
        name: "Lucky",
        id: 7,
        pass: '321',
        money: 1000
    }
};

var schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: userType,
                args: {
                    id: { type: graphql.GraphQLString }
                },
                resolve: function (schema, args) {
                    return users[args.id];
                }
            }
        }
    }),
    mutation: new graphql.GraphQLObjectType({
        name: 'UserMutation',
        fields: {
            addUser: {
                type: userType,
                args: userFields,
                description: 'Add a new user',
                resolve: (schema, item) => {
                    item.id = item.id || Object.keys(users).length + 1;
                    users[item.id] = item;
                    return item;
                }
            }
        }
    })
});

app.use('/graphql', graphqlHTTP({ schema: schema, pretty: true, graphiql: true }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../public'));
app.use(router);

app.use((err, req, res, next) => {
    console.log(err);
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
