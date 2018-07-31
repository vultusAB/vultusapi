"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const merge = require("webpack-merge");
const webpack = require("webpack");
const webpack_common_1 = require("./webpack.common");
const DefinePlugin = webpack.DefinePlugin;
exports.default = merge(webpack_common_1.default.container, {
    mode: 'production',
    plugins: [
        new UglifyJSPlugin({
            sourceMap: false,
        }),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.ts$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
    ],
    performance: {
        hints: false,
    },
});
