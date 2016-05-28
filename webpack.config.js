var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        app: ["./src/main.js"]
    },
    output: {
        path: path.resolve("./dist"),
        publicPath: "/dist/",
        filename: "main.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            }
        }, {
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }, {
            test: /\.yml$/,
            loader: 'json-loader!yaml-loader'
        }, {
            test: /\.html$/,
            loader: 'vue-html-loader'
        }, ]
    },
    plugins: [

    ],
    externals: {
        "jquery": "jQuery",
        "ga": "ga"
    },
    resolve: {
      root: [
        path.resolve('./src')
      ]
    },
    devServer: {
        contentBase: "."
    }
};
