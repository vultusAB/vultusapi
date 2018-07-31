"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ExtractCSSPlugin = require("mini-css-extract-plugin");
const webpack_constant_1 = require("./webpack.constant");
var Compile;
(function (Compile) {
    Compile.rules = [
        {
            // Keep source-map
            enforce: 'pre',
            test: /\.js$/,
            loaders: ['source-map-loader'],
            exclude: webpack_constant_1.default.structure.modules.path,
        },
        {
            // Compile ts files
            enforce: 'post',
            test: /\.tsx?$/,
            // exclude: Constant.structure.modules.path,
            use: ['awesome-typescript-loader'],
        },
        {
            // Compile html files and include them
            enforce: 'post',
            test: /\.html$/,
            exclude: webpack_constant_1.default.structure.modules.path,
            loader: 'html-loader',
        },
        {
            // Compile scss files into css and include them
            enforce: 'post',
            test: /\.scss$/,
            exclude: [webpack_constant_1.default.structure.modules.path, webpack_constant_1.default.target.controller],
            use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
            // Grab css files and include them
            test: /\.css$/,
            exclude: [webpack_constant_1.default.structure.modules.path, webpack_constant_1.default.target.resources],
            loaders: ['style-loader', 'css-loader'],
        },
        {
            // Bundle all required scss by node modules and resources
            test: /\.scss$/,
            include: [webpack_constant_1.default.structure.modules.path, webpack_constant_1.default.target.resources],
            use: [ExtractCSSPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
            // Bundle all required css by node modules and resources
            test: /\.css$/,
            include: [webpack_constant_1.default.structure.modules.path, webpack_constant_1.default.target.resources],
            use: [ExtractCSSPlugin.loader, 'css-loader'],
        },
        {
            // Bundle all required fonts by node modules
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            include: [webpack_constant_1.default.structure.modules.path],
            loader: 'file-loader?name=[name].[ext]',
        },
        {
            // Bundle all required images by node modules
            test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.wav$|\.mp3$|\.mp4$/,
            include: [webpack_constant_1.default.structure.modules.path],
            loader: 'file-loader?name=[name].[ext]',
        },
        {
            // Compile Angular Component scss files into css and include them
            test: /\.scss$/,
            exclude: [webpack_constant_1.default.structure.modules.path, webpack_constant_1.default.target.resources],
            use: ['to-string-loader', 'css-loader', 'sass-loader'],
        },
        {
            // Compile images, supports references in html files.
            // Files > 128KB is included in bundle, < 128KB is loaded on reguest
            enforce: 'post',
            test: /\.(jpe?g|png|gif|svg)$/i,
            exclude: webpack_constant_1.default.structure.modules.path,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 1024 * 128,
                        mimetype: 'image/png',
                    },
                },
            ],
        },
    ];
    Compile.extensions = ['.ts', '.js', '.css', '.html', '.json'];
})(Compile || (Compile = {}));
exports.default = Compile;
