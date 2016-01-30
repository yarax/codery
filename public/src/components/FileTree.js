let React = require('react');
let store = require('../redux/store');
let CodeBar = require('./CodeBar');
let $ = require('jquery');
var globalIt = 0;
var FileTree = React.createClass({

    dirClick: function (item, id, event) {
        let root = this.props.root || '/';
        let branch = root + '/' + item;
        let test = store.getState().unfoldFiles[branch];
        let arrow = test ? '&#9658;' : '&#9660;';
        $('#' + id).find('i').html(arrow);
        store.dispatch({
            type: test ? 'FOLD' : 'UNFOLD',
            item: root + '/' + item
        });
    },

    componentDidMount: function () {
        let root = this.props.root || '/';
        $.get('/files?path=' + root, (items) => {
            store.dispatch({
                type: 'SET_FILE_LIST',
                files: items,
                root: root
            });
        });
    },

    fileClick: function (name) {
        let root = this.props.root || '/';
        $.get('/file/?path=' + encodeURIComponent(root + '/' + name), (resp) => {

            store.dispatch({
                type: 'BUILD_ROWS',
                text: resp
            });

        });
    },

    itemClick: function (item, id, event) {
        if (item.type === 'dir') {
            this.dirClick(item.name, id, event);
        } else {
            this.fileClick(item.name, event);
        }
        event.stopPropagation();
        return false;
    },

    render: function () {
        globalIt++;
        if (globalIt > 200) return;
        let root = this.props.root || '/';
        let files = store.getState().files[root];
        if (files) {
            files = files.map((item, i) => {
                let pointer = item.type === 'dir' ? <i>&#9658;</i> : '';
                let branch = root + '/' + item.name;
                let id = branch.replace(/\//g, '_');
                let children = item.type === 'dir' && store.getState().unfoldFiles[branch] ? <FileTree root={branch}/> : '';
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