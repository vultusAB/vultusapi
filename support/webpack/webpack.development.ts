import * as _ from 'path'
import * as merge from 'webpack-merge'
import * as webpack from 'webpack'

import Common from './webpack.common'
import Constant from './webpack.constant'

const HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin

export default merge(Common.container, {
  mode:      'development',
  plugins:   [ new HotModuleReplacementPlugin() ],
  devServer: {
    contentBase:        Constant.target.dist,
    port:               8000,
    historyApiFallback: true,
    inline:             true,
    open:               false,
  },
})
