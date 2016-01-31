let React = require('react');
let store = require('../redux/store');
let $ = require('jquery');

let RepoList = React.createClass({

    componentDidMount: function () {
        $.get('/repolist2', function (resp) {
            store.dispatch({
                type: 'SET_REPOLIST',
                items: resp
            });
        })
    },

    repoClick: function (item) {
        $.post('/clonerepo', item, function (resp) {
            if (resp.error) {
                alert(resp.error);
            } else if (resp.repoId) {
                window.location = '/review.html#' + resp.repoId;
            } else {
                alert('No repo id');
            }
        });
    },

    render: function () {
        let items = store.getState().repolist.map((item, i) => {
            return <div onClick={this.repoClick.bind(this, item)} key={i}>{item.name}</div>
        });

        return <div className="container">
            {items}
            </div>
    }
});

module.exports = RepoList;

