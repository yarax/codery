let React = require('react');
let store = require('../redux/store');
let FileTree = require('./FileTree');
let CodeBar = require('./CodeBar');

var FileViewer = React.createClass({

    render: function () {
        return <table className="file-view-table">
            <tbody>
            <tr>
                <td className="file-tree-td">
                    <FileTree/>
                </td>
                <td className="codebar-td">
                    <CodeBar/>
                </td>
                </tr>
            </tbody>
            </table>
    }
});
module.exports = FileViewer;