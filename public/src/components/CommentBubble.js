let React = require('react');
let store = require('../redux/store');
let GQLReq = require('../libs/gqlreq');

var CommentBubble = React.createClass({

    setComment: function (index) {
        console.log('USER', store.getState().user);
        var query = `mutation {
                      addComment(author: "${store.getState().user}", repo: "${store.getState().repoId}", file: "${store.getState().selectedFile}", text: "${this.refs.textarea.value}", line: ${index}) {
                        author,
                        text,
                        line,
                        date
                      }
                    }`;
        GQLReq(query, (data) => {
            var comment = data.addComment;
            store.dispatch({
                type: 'SET_COMMENT',
                file: store.getState().selectedFile,
                text: comment.text,
                author: comment.author,
                index: comment.line,
                date: comment.date
            });
        });
    },

    componentDidUpdate: function(){
        let textarea = this.refs.textarea;
        if (textarea) {
            textarea.focus();
        }
    },

    render: function () {
        let index = this.props.index;
        let display = store.getState().bubbles[index];
        if (display) {
            return <div className="bubble"><textarea ref="textarea"></textarea><br/><br/><button
                onClick={this.setComment.bind(this, index)} className="btn">Ok</button></div>
        } else {
            return <span></span>
        }
    }
});

module.exports = CommentBubble;