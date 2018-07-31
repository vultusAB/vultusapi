"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merge = require("webpack-merge");
const webpack = require("webpack");
const webpack_common_1 = require("./webpack.common");
const webpack_constant_1 = require("./webpack.constant");
const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;
exports.default = merge(webpack_common_1.default.container, {
    mode: 'development',
    plugins: [new HotModuleReplacementPlugin()],
    devServer: {
        contentBase: webpack_constant_1.default.target.dist,
        host: '0.0.0.0',
        port: 3333,
        historyApiFallback: true,
        inline: true,
        open: false,
    },
});
