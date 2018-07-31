import * as _ from 'path'

export namespace Target {
  export const application = _.resolve(__dirname, '../../')
  export const dist = _.resolve(application, '_dist')
  export const [ controller, processor, support, resources ] = [
    _.resolve(application, 'controller'),
    _.resolve(application, 'processor'),
    _.resolve(application, 'support'),
    _.resolve(application, 'resources'),
  ]
}

export namespace Structure {
  export const index = { path: _.resolve(Target.dist), filename: 'index.html' }
  export const modules = {
    name: 'node_modules',
    path: _.join(Target.application, 'node_modules'),
  }
  export const sources = [
    {
      name: 'root',
      get:  _.resolve(index.path, index.filename),
    },
  ]
}

export namespace Output {
  export const container = {
    filename:   '[name].bundle.js',
    path:       Target.dist,
    publicPath: '/',
  }
}

export namespace Application {
  export const title = 'Vultus AB - Platform'
  export const entry = _.resolve(Structure.index.path, Structure.index.filename)
}
export namespace Entry {
  export const root = {
    app: _.resolve(Target.controller, 'index.ts'),
  }
}

export namespace Bundle {
  export const packages = {
    polyfills: [
      _.resolve(Target.support, 'polyfills', 'angular.ts'),
      _.resolve(Structure.modules.path, 'core-js', 'client', 'shim.min.js'),
      _.resolve(Structure.modules.path, 'mutationobserver-shim', 'dist', 'mutationobserver.min.js'),
      _.resolve(Structure.modules.path, 'web-animations-js', 'web-animations.min.js'),
      _.resolve(Structure.modules.path, '@webcomponents', 'custom-elements', 'custom-elements.min.js'),
    ],
    resources: [
      _.resolve(Structure.modules.path, '@clr', 'icons', 'clr-icons.min.css'),
      _.resolve(Structure.modules.path, '@clr', 'icons', 'clr-icons.min.js'),
      _.resolve(Target.resources, 'styles', 'node-modules', '@clr', 'ui', 'clr-ui.scss'),
      _.resolve(Target.resources, 'styles', 'global.scss'),
      _.resolve(Target.resources, 'styles', 'node-modules', 'leaflet', 'dist', 'leaflet.scss'),
      _.resolve(Target.resources, 'styles', 'node-modules', 'leaflet-draw', 'dist', 'leaflet.draw.scss'),
      _.resolve(Structure.modules.path, '@angular', 'core', 'bundles', 'core.umd.min.js'),
    ],
    application: Entry.root.app,
  }
}

export default {
  structure:   Structure,
  application: Application,
  target:      Target,
  output:      Output,
  bundle:      Bundle,
  entry:       Entry,
}
