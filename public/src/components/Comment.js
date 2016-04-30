let React = require('react');
let store = require('../redux/store');
var Comment = React.createClass({

    render: function () {
        let index = this.props.index;
        let file = store.getState().selectedFile;
        let fileComment = store.getState().comments[file];
        if (fileComment && fileComment[index]) {
            let comment = fileComment[index];
            return <div className="comment">
                <div className="comment-header"><name>{comment.author}</name><date>{comment.date}</date></div>
                {comment.text}
            </div>
        } else {
            return <span></span>
        }
    }
});

module.exports = Comment;