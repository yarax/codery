var graphql = require('graphql');

var commentFields = {
    author: { type: graphql.GraphQLString },
    repo: { type: graphql.GraphQLString },
    file: { type: graphql.GraphQLString },
    text: { type: graphql.GraphQLString },
    line: {type: graphql.GraphQLInt},
    date: {type: graphql.GraphQLString}
};
var commentType = new graphql.GraphQLObjectType({
    name: 'Comment',
    fields: commentFields
});

global.comments = {};

var schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            comments: {
                type: new graphql.GraphQLList(commentType),
                args: {
                    repo: { type: graphql.GraphQLString },
                    file: { type: graphql.GraphQLString }
                },
                resolve: function (schema, args) {
                    return comments[args.repo][args.file];
                }
            }
        }
    }),
    mutation: new graphql.GraphQLObjectType({
        name: 'CommentMutation',
        fields: {
            addComment: {
                type: commentType,
                args: commentFields,
                description: 'Add a new comment',
                resolve: (schema, item) => {
                    var dt = new Date();
                    item.date = `${dt.getDate()}.${dt.getMonth()}.${dt.getFullYear()}`;
                    item.author = 'TestUser';
                    comments[item.repo] = comments[item.repo] || {};
                    comments[item.repo][item.file] = comments[item.repo][item.file] || [];
                    comments[item.repo][item.file].push(item);
                    return item;
                }
            }
        }
    })
});

module.exports = schema;