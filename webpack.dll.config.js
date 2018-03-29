/**
 * 公共库 dll 打包
 */

const webpack = require('webpack');
const path = require('path');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
    entry: {
        vendor: [
            'jquery', 
            'spectrum-colorpicker',
            'sweetalert',
            path.resolve(__dirname, "src/js/lib/layer"),
            path.resolve(__dirname, "src/js/lib/ko"),
        ],
    },
    output: {
        path: path.resolve(__dirname, "dist/js"),
        filename: '[name].min.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            ko: '@lib/ko',
            swal: 'sweetalert',
            layer: path.resolve(__dirname, "src/js/lib/layer"),
        }),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DllPlugin({
            path: path.resolve(__dirname, "manifest.json"),
            name: '[name]_library',
            context: __dirname
        })
    ]
}