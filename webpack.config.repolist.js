module.exports = {
    entry: __dirname + "/public/src/repolist",
    cache: true,
    watch: true,
    devtool: "eval",
    output: {
        path: __dirname + "/public/dist",
        filename: "repolist.js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};