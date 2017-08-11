const path = require('path');
const DefinePlugin = require('webpack').DefinePlugin;
const Uglify = require('uglifyjs-webpack-plugin');

let dotenv = require('dotenv').config();

module.exports = {
    entry: "./index.js",
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
        new Uglify(),
        new DefinePlugin({
            // Only loads parsed environment variables from .env file and not entire node environment
            'process.env': Object.keys(dotenv.parsed).reduce(function(o, k) {
                o[k] = JSON.stringify(dotenv.parsed[k]);
                return o;
            }, {})
        })
    ],
    context: __dirname,
    target: 'web'
}