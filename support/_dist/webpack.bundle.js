"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack = require("webpack");
var Bundle;
(function (Bundle) {
    const HashedModuleIdsPlugin = webpack.HashedModuleIdsPlugin;
    const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
    Bundle.container = [
        new HashedModuleIdsPlugin(),
        new CommonsChunkPlugin({
            name: 'polyfills',
            chunks: ['angular', 'common'],
        }),
    ];
})(Bundle || (Bundle = {}));
