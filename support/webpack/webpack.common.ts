import * as CleanWebpackPlugin from 'clean-webpack-plugin'
import * as ExtractCSSPlugin from 'mini-css-extract-plugin'
import * as webpack from 'webpack'

import Bootstrap from './webpack.bootstrap'
import Compile from './webpack.compile'
import Constant from './webpack.constant'

namespace Common {
  const clean = new CleanWebpackPlugin([ Constant.target.application ], {
    root:    Constant.target.dist,
    exclude: [ 'report.html', 'index.html' ],
  })
  const css = new ExtractCSSPlugin()

  const plugins = [ clean, css, Bootstrap.template, Bootstrap.favicon ]

  // Fix for Angular dependency as expression injection
  const ContextReplacementPlugin = webpack.ContextReplacementPlugin

  const resolver = [
    new ContextReplacementPlugin(
      /@angular(\\|\/)core(\\|\/)fesm5/,
      Constant.target.application,
      {}
    ),
    new ContextReplacementPlugin(
      /@angular(\\|\/)core(\\|\/)bundles/,
      Constant.target.application,
      {}
    ),
  ]

  export const container: any = {
    context: Constant.target.dist,
    entry:   Constant.bundle.packages,
    module:  {
      rules: Compile.rules,
    },
    resolve: {
      extensions: Compile.extensions,
    },
    plugins: [ ...plugins, ...resolver ],
    output:  Constant.output.container,
    node:    {
      fs: 'empty',
    },
  }
}

export default Common
