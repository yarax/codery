let React = require('react');
let CodeRow = require('./CodeRow');
let $ = require('jquery');
let store = require('../redux/store');
console.log("RAX", store);

var CodeBar = React.createClass({

    getInitialState: function () {
        return {
            rows: '',
            bubbles: []
        };
    },

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

    },

    componentDidMount: function () {
        $.get('/file/?path=index.js', (resp) => {

            store.dispatch({
                type: 'BUILD_ROWS',
                text: resp
            });

        });
    }
});

module.exports = CodeBar;