let React = require('react');
let ReactDOM = require('react-dom');
let FileViewer = require('./components/FileViewer');
let store = require('./redux/store');

function render () {
    ReactDOM.render(
        <FileViewer/>,
        document.getElementById('code')
    );
}

render();
store.subscribe(render);