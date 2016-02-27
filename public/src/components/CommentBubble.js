let React = require('react');
let store = require('../redux/store');
var CommentBubble = React.createClass({

    setComment: function (index, event) {
        console.log('set comment');
        store.dispatch({
            type: 'SET_COMMENT',
            text: this.refs.textarea.value,
            user: store.getState().user,
            index: index
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
            return <div className="bubble"><textarea ref="textarea"></textarea><br/><br/><a
                onClick={this.setComment.bind(this, index)} href="#" className="btn">Ok</a></div>
        } else {
            return <span></span>
        }
    }
});

module.exports = CommentBubble;