import * as ExtractCSSPlugin from 'mini-css-extract-plugin'
import * as _ from 'path'
import Constant from './webpack.constant'

namespace Compile {
  export const rules: any = [
    {
      // Keep source-map
      enforce: 'pre',
      test:    /\.js$/,
      loaders: [ 'source-map-loader' ],
      exclude: Constant.structure.modules.path,
    },
    {
      // Compile ts files
      enforce: 'post',
      test:    /\.tsx?$/,
      // exclude: Constant.structure.modules.path,
      use:     [ 'awesome-typescript-loader' ],
    },
    {
      // Compile html files and include them
      enforce: 'post',
      test:    /\.html$/,
      exclude: Constant.structure.modules.path,
      loader:  'html-loader',
    },
    {
      // Compile scss files into css and include them
      enforce: 'post',
      test:    /\.scss$/,
      exclude: [ Constant.structure.modules.path, Constant.target.controller ],
      use:     [ 'style-loader', 'css-loader', 'sass-loader' ],
    },
    {
      // Grab css files and include them
      test:    /\.css$/,
      exclude: [ Constant.structure.modules.path, Constant.target.resources ],
      loaders: [ 'style-loader', 'css-loader' ],
    },
    {
      // Bundle all required scss by node modules and resources
      test:    /\.scss$/,
      include: [ Constant.structure.modules.path, Constant.target.resources ],
      use:     [ ExtractCSSPlugin.loader, 'css-loader', 'sass-loader' ],
    },
    {
      // Bundle all required css by node modules and resources
      test:    /\.css$/,
      include: [ Constant.structure.modules.path, Constant.target.resources ],
      use:     [ ExtractCSSPlugin.loader, 'css-loader' ],
    },
    {
      // Bundle all required fonts by node modules
      test:    /\.(eot|svg|ttf|woff|woff2)$/,
      include: [ Constant.structure.modules.path ],
      loader:  'file-loader?name=[name].[ext]',
    },
    {
      // Bundle all required images by node modules
      test:    /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$|\.wav$|\.mp3$|\.mp4$/,
      include: [ Constant.structure.modules.path ],
      loader:  'file-loader?name=[name].[ext]', // Retain original file name
    },
    {
      // Compile Angular Component scss files into css and include them
      test:    /\.scss$/,
      exclude: [ Constant.structure.modules.path, Constant.target.resources ],
      use:     [ 'to-string-loader', 'css-loader', 'sass-loader' ],
    },
    {
      // Compile images, supports references in html files.
      // Files > 128KB is included in bundle, < 128KB is loaded on reguest
      enforce: 'post',
      test:    /\.(jpe?g|png|gif|svg)$/i,
      exclude: Constant.structure.modules.path,
      use:     [
        {
          loader:  'url-loader',
          options: {
            limit:    1024 * 128,
            mimetype: 'image/png',
          },
        },
      ],
    },
  ]
  export const extensions = [ '.ts', '.js', '.css', '.html', '.json' ]
}

export default Compile
