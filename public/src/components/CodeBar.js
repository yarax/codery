let React = require('react');
let CodeRow = require('./CodeRow');
let store = require('../redux/store');
let GQLReq = require('../libs/gqlreq');

var CodeBar = React.createClass({

    componentDidMount: function () {
        var query = `
        query {
          comments(repo: "repo1", file: "file1") {
            author,
            text,
            line
          }
        }`;
        GQLReq(query, (result) => {
            console.log('GQL resp', result);
            if (result.data.comments) {
                result.data.comments.forEach((item, i) => {
                    store.dispatch({
                        type: 'SET_COMMENT',
                        text: item.text,
                        user: item.author,
                        index: item.line
                    });
                });
                this.render();
            }
        });
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