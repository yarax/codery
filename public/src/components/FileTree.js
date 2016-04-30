let React = require('react');
let store = require('../redux/store');
let CodeBar = require('./CodeBar');
let $ = require('jquery');
var globalIt = 0;
let GQLReq = require('../libs/gqlreq');
var FileTree = React.createClass({

    dirClick: function (itemName, id, event) {
        let root = this.getRoot();
        let itemId = this.getItemId(itemName);
        let test = store.getState().unfoldFiles[itemId];
        let arrow = test ? '&#9658;' : '&#9660;';
        $('#' + id).find('i').html(arrow);
        store.dispatch({
            type: test ? 'FOLD' : 'UNFOLD',
            item: itemId
        });
    },

    componentDidMount: function () {
        let root = this.getRoot();
        $.get('/files?path=' + root, (items) => {
            store.dispatch({
                type: 'SET_FILE_LIST',
                files: items,
                root: root
            });
        });
    },

    fileClick: function (name) {
        let root = this.getRoot();
        store.dispatch({
            type: 'SELECTED_FILE',
            name: name
        });
        $.get('/file/?path=' + encodeURIComponent(root + '/' + name), (resp) => {
            store.dispatch({
                type: 'BUILD_ROWS',
                text: resp
            });

            var query = `
                query {
                  comments(repo: "${store.getState().repoId}", file: "${store.getState().selectedFile}") {
                    author,
                    text,
                    line,
                    date
                  }
                }`;
            GQLReq(query, (result) => {
                if (!result.comments) return;
                result.comments.forEach((item, i) => {
                    store.dispatch({
                        type: 'SET_COMMENT',
                        file: store.getState().selectedFile,
                        text: item.text,
                        author: item.author,
                        index: item.line,
                        date: item.date
                    });
                });
            });
        });
    },

    getRoot: function () {
        return this.props.root || '/' + store.getState().repoId;
    },

    itemClick: function (item, id, event) {
        if (item.type === 'dir') {
            this.dirClick(item.name, id, event);
        } else {
            this.fileClick(item.name, event);
        }
        if (event) {
            event.stopPropagation();
        }
        return false;
    },

    getItemId: function (itemName) {
        let root = this.getRoot();
        let branch = root + '/' + itemName;
        return branch.replace(/\//g, '_');
    },

    render: function () {
        globalIt++;
        if (globalIt > 200) return;
        let root = this.getRoot();
        let files = store.getState().files[root];
        if (files) {
            files = files.map((item, i) => {
                let pointer = item.type === 'dir' ? <i>&#9658;</i> : '';
                let id = this.getItemId(item.name);
                let branch = root + '/' + item.name;

                let alreadyOpenedOrRootDir = store.getState().unfoldFiles[id]/* || (files.length === 1 && files[0].type === 'dir');*/

                let children = item.type === 'dir' && alreadyOpenedOrRootDir ? <FileTree root={branch}/> : '';
                return <div key={i} id={id} className={item.type} onClick={this.itemClick.bind(this, item, id)}>
                    {pointer}
                    {item.name}
                    {children}
                </div>
            });
        }

        return <div>
            {files}
            </div>
    }
});

module.exports = FileTree;