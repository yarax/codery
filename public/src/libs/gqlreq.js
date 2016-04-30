let $ = require('jquery');

module.exports = (query, cb) => {
    console.log('GQL query', query);
    $.post({
        url: '/graphql',
        headers: {
            'Content-type': 'application/graphql'
        },
        data: query
    }).done((result) => {
        console.log('GQL response', result);
        if (result.errors) {
            console.log(result.errors[0].message);
        } else {
            cb(result.data);
        }
    });
};