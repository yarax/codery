var Redux = require('redux');
var reducer = require('./reducer');
var store = Redux.createStore(reducer);

module.exports = store;