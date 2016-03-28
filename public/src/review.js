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

store.dispatch({
    type: 'SET_REPO_ID'
});
store.dispatch({
    type: 'SET_FILE_LIST',
    files: window.filesToDisplay,
    root: '/' + window.rootDir
});

render();
store.subscribe(render);