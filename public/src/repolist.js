let React = require('react');
let ReactDOM = require('react-dom');
let RepoList = require('./components/RepoList');
let store = require('./redux/store');

function render () {
    ReactDOM.render(
        <RepoList/>,
        document.getElementById('list')
    );
}

render();
store.subscribe(render);