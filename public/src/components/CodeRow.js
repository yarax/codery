let React = require('react');
let CommentBubble = require('./CommentBubble');
let Comment = require('./Comment');
var store = require('../redux/store');

let CodeRow = React.createClass({

    commentBubble: function (index, event) {
        store.dispatch({
            type: 'SHOW_BUBBLE',
            index: index
        });
        return false;
    },

    render: function () {
        let i = this.props.index + 1;
        let line = this.props.line;
        return <tr key={i}>
            <td onClick={this.commentBubble.bind(this, i)} className='line-num'><span>{i}</span></td>
            <td>
                {line}
                <CommentBubble index={i}/>
                <Comment index={i}/>
            </td>
        </tr>
    }
});

module.exports = CodeRow;

