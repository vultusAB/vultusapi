"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("path");
var Target;
(function (Target) {
    var _a;
    Target.application = _.resolve(__dirname, '../../');
    Target.dist = _.resolve(Target.application, '_dist');
    _a = [
        _.resolve(Target.application, 'controller'),
        _.resolve(Target.application, 'processor'),
        _.resolve(Target.application, 'support'),
        _.resolve(Target.application, 'resources'),
    ], Target.controller = _a[0], Target.processor = _a[1], Target.support = _a[2], Target.resources = _a[3];
})(Target = exports.Target || (exports.Target = {}));
var Structure;
(function (Structure) {
    Structure.index = { path: _.resolve(Target.dist), filename: 'index.html' };
    Structure.modules = {
        name: 'node_modules',
        path: _.join(Target.application, 'node_modules'),
    };
    Structure.sources = [
        {
            name: 'root',
            get: _.resolve(Structure.index.path, Structure.index.filename),
        },
    ];
})(Structure = exports.Structure || (exports.Structure = {}));
var Output;
(function (Output) {
    Output.container = {
        filename: '[name].bundle.js',
        path: Target.dist,
        publicPath: '/',
    };
})(Output = exports.Output || (exports.Output = {}));
var Application;
(function (Application) {
    Application.title = 'Vultus AB - Platform';
    Application.entry = _.resolve(Structure.index.path, Structure.index.filename);
})(Application = exports.Application || (exports.Application = {}));
var Entry;
(function (Entry) {
    Entry.root = {
        app: _.resolve(Target.controller, 'index.ts'),
    };
})(Entry = exports.Entry || (exports.Entry = {}));
var Bundle;
(function (Bundle) {
    Bundle.packages = {
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
    };
})(Bundle = exports.Bundle || (exports.Bundle = {}));
exports.default = {
    structure: Structure,
    application: Application,
    target: Target,
    output: Output,
    bundle: Bundle,
    entry: Entry,
};
