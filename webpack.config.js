module.exports = {
    entry: __dirname + "/public/src/main",
    cache: true,
    watch: true,
    devtool: "eval",
    output: {
        path: __dirname + "/public/dist",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};