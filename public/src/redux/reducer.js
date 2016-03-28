let React = require('react');

module.exports = function (originState, action) {
    if (!originState) {
        originState = {
            rows: [],
            bubbles: [],
            comments: [],
            files: {},
            unfoldFiles: {},
            repolist: [],
            user: {},
            selectedFile: null,
            repoId: null
        };
    }

    let state = Object.assign(originState);

    switch (action.type) {
        case 'SHOW_BUBBLE':
            state.bubbles[action.index] = true;
            break;
        case 'BUILD_ROWS':
            state.rows = action.text.split('\n').map((line, i) => {
                return line;
            });
            break;
        case 'SET_COMMENT':
            state.bubbles[action.index] = false;
            state.comments[action.file] = state.comments[action.file] || {};
            state.comments[action.file][action.index] = action;
            break;
        case 'SET_FILE_LIST':
            state.files[action.root] = action.files;
            break;
        case 'UNFOLD':
            state.unfoldFiles[action.item] = true;
            break;
        case 'FOLD':
            state.unfoldFiles[action.item] = false;
            break;
        case 'SET_REPOLIST':
            state.repolist = action.items;
            break;
        case 'SELECTED_FILE':
            state.selectedFile = action.name;
            break;
        case 'SET_REPO_ID':
            state.repoId = window.location.href.match(/\/(\d+)$/)[1];
            break;


    }

    return state;
};