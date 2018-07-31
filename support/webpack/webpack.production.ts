import * as BundleAnalyzer from 'webpack-bundle-analyzer'
import * as CompressionPlugin from 'compression-webpack-plugin'
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import * as merge from 'webpack-merge'
import * as webpack from 'webpack'

import Common from './webpack.common'

const DefinePlugin = webpack.DefinePlugin

export default merge(Common.container, {
  mode:    'production',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: false,
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new CompressionPlugin({
      asset:     '[path].gz[query]',
      algorithm: 'gzip',
      test:      /\.js$|\.ts$|\.css$|\.html$/,
      threshold: 10240,
      minRatio:  0.8,
    }),
    // new BundleAnalyzer.BundleAnalyzerPlugin({
    //  analyzerMode: 'static',
    // }),
  ],
  performance: {
    hints: false,
  },
})
