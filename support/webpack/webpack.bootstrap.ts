import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as _ from 'path'

import Constant from './webpack.constant'

export namespace Bootstrap {
  export const template = new HtmlWebpackPlugin({
    title:    Constant.application.title,
    filename: Constant.application.entry,
  })

  export const favicon = new FaviconsWebpackPlugin({
    logo:   _.resolve(Constant.target.resources, 'images', 'favicon', 'vultus_ab_icon.png'),
    prefix: 'favicon/',
    icons:  {
      android:      false,
      appleIcon:    false,
      appleStartup: false,
      coast:        false,
      favicons:     true,
      firefox:      true,
      opengraph:    false,
      twitter:      false,
      yandex:       false,
      windows:      false,
    },
  })
}

export default Bootstrap
