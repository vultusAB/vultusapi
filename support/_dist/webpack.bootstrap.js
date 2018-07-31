"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const _ = require("path");
const webpack_constant_1 = require("./webpack.constant");
var Bootstrap;
(function (Bootstrap) {
    Bootstrap.template = new HtmlWebpackPlugin({
        title: webpack_constant_1.default.application.title,
        filename: webpack_constant_1.default.application.entry,
    });
    Bootstrap.favicon = new FaviconsWebpackPlugin({
        logo: _.resolve(webpack_constant_1.default.target.resources, 'images', 'favicon', 'vultus_ab_icon.png'),
        prefix: 'favicon/',
        icons: {
            android: false,
            appleIcon: false,
            appleStartup: false,
            coast: false,
            favicons: true,
            firefox: true,
            opengraph: false,
            twitter: false,
            yandex: false,
            windows: false,
        },
    });
})(Bootstrap = exports.Bootstrap || (exports.Bootstrap = {}));
exports.default = Bootstrap;
