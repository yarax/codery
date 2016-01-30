let React = require('react');
let store = require('../redux/store');
var Comment = React.createClass({

    render: function () {
        let index = this.props.index;
        let comment = store.getState().comments[index];
        if (comment) {
            return <div className="comment">
                <div className="comment-header"><name>Roman</name><date>29.01.2016</date></div>
                {comment}
            </div>
        } else {
            return <span></span>
        }
    }
});

module.exports = Comment;