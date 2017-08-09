const path = require('path');
const Uglify = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "app.js",
        publicPath: "/public/",
        library: 'LanguageParser',
        libraryTarget: 'window'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }]
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "app")
        ],
        extensions: [".js", ".json", ".jsx", ".css"],
        alias: {
            "module": "new-module",
            "only-module$": "new-module",
            "module": path.resolve(__dirname, "app/third/module.js"),
        },
    },
    plugins: [
        new Uglify()
    ],
    context: __dirname,
    target: "web",
}