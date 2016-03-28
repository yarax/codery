let React = require('react');
let store = require('../redux/store');
let GQLReq = require('../libs/gqlreq');

var CommentBubble = React.createClass({

    setComment: function (index) {
        var query = `mutation {
                      addComment(author: "${store.getState().user}", repo: "repo1", file: "file1", text: "${this.refs.textarea.value}", line: ${index}) {
                        author,
                        text
                      }
                    }`;
        GQLReq(query, () => {
            store.dispatch({
                type: 'SET_COMMENT',
                text: this.refs.textarea.value,
                user: store.getState().user,
                index: index
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