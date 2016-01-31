let React = require('react');
let CodeRow = require('./CodeRow');
let $ = require('jquery');
let store = require('../redux/store');
console.log("RAX", store);

var CodeBar = React.createClass({

    render: function () {
        let rows = store.getState().rows.map(function (line, i) {
            return <CodeRow key={i} index={i} line={line}/>;
        });
        console.log('Render CodeBar', rows);
        return (
            <div className="cute-table-container">
            <table className="cute-table">
                <tbody>
                {rows}
                </tbody>
            </table>
            </div>
        );

    }
});

module.exports = CodeBar;