let React = require('react');
let CodeRow = require('./CodeRow');
let store = require('../redux/store');

var CodeBar = React.createClass({

    componentDidUpdate: function () {

    },

    render: function () {
        let rows = store.getState().rows.map(function (line, i) {
            return <CodeRow key={i} index={i} line={line}/>;
        });
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