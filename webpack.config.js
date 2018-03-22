/**
 * webpack config
 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const gutil = require('gulp-util');

const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

let __DEV__ = gutil.env._[0] == 'dev' ? true : false;

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    let jsPath = path.resolve(__dirname, 'src/js');
    let dirs = fs.readdirSync(jsPath);
    let matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(__dirname, 'src/js', item);
        }
    });
    return files;
}

let config = {
    devtool: __DEV__ ? 'eval' : '',
    entry: getEntry(),
    output: {
        path: path.resolve(__dirname, 'dist/'),
        // publicPath: "/", // 注释后使用相对路径
        filename: 'js/[name].min.js?v=[chunkhash:10]',
        chunkFilename: "js/[name].js"
    },
    resolve: {
        extensions: ['.js', '.css', '.scss'],
        alias: {
            '_module': path.resolve(__dirname, 'src/js/module'),
            '_instance': path.resolve(__dirname, 'src/js/instance'),
            '_lib': path.resolve(__dirname, 'src/js/lib'),
        },
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            ko: 'knockout',
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['js/vendor.min.js'],
            files: '*.html',
            append: false,
            hash: !__DEV__ ? true : false
        }),
        new HtmlWebpackPlugin({ //页面1 项目开发请填写注释
            filename: 'index.html',
            template: 'src/index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({ //页面1 项目开发请填写注释
            filename: 'home.html',
            template: 'src/home.html',
            chunks: ['index']
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(path.resolve(__dirname, "manifest.json")),
        }),
    ]
};

if (!__DEV__) {
    config.plugins = config.plugins.concat([
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])
}

module.exports = config;