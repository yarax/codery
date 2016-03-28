let React = require('react');
let store = require('../redux/store');
let $ = require('jquery');

let RepoList = React.createClass({

    componentDidMount: function () {
        $.get('/repolist', function (resp) {
            store.dispatch({
                type: 'SET_REPOLIST',
                items: resp
            });
        })
    },

    repoClick: function (i, event) {
        $(event.target).next('div').toggle(() => {
            var inpt = $(event.target).parent().find("input");
            inpt.focus();
            inpt.val(inpt.val());
        });
    },

    goToReview: function (i, item, event) {
        var val = $(event.target).parent().find("input").val();
        $.post('/clonerepo?rev=' + val, item, function (resp) {
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
            var inputRef = `rev${i}`;
            return <div className="item" key={i}>
                    <div onClick={this.repoClick.bind(this, i)}>{item.name}</div>
                    <div className="revision">
                        <input defaultValue="master"/>
                        <button onClick={this.goToReview.bind(this, i, item)}>OK</button>
                    </div>
                </div>
        });

        return <div className="container">
            {items}
            </div>
    }
});

module.exports = RepoList;

