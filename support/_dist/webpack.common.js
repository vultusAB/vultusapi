"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractCSSPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const webpack_bootstrap_1 = require("./webpack.bootstrap");
const webpack_compile_1 = require("./webpack.compile");
const webpack_constant_1 = require("./webpack.constant");
var Common;
(function (Common) {
    const clean = new CleanWebpackPlugin([webpack_constant_1.default.target.application], {
        root: webpack_constant_1.default.target.dist,
        exclude: ['report.html', 'index.html'],
    });
    const css = new ExtractCSSPlugin();
    const plugins = [clean, css, webpack_bootstrap_1.default.template, webpack_bootstrap_1.default.favicon];
    // Fix for Angular dependency as expression injection
    const ContextReplacementPlugin = webpack.ContextReplacementPlugin;
    const resolver = [
        new ContextReplacementPlugin(/@angular(\\|\/)core(\\|\/)fesm5/, webpack_constant_1.default.target.application, {}),
        new ContextReplacementPlugin(/@angular(\\|\/)core(\\|\/)bundles/, webpack_constant_1.default.target.application, {}),
    ];
    Common.container = {
        context: webpack_constant_1.default.target.dist,
        entry: webpack_constant_1.default.bundle.packages,
        module: {
            rules: webpack_compile_1.default.rules,
        },
        resolve: {
            extensions: webpack_compile_1.default.extensions,
        },
        plugins: [...plugins, ...resolver],
        output: webpack_constant_1.default.output.container,
        node: {
            fs: 'empty',
        },
    };
})(Common || (Common = {}));
exports.default = Common;
