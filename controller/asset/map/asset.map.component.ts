import * as Leaflet from 'leaflet'
import * as arraysDiff from 'arrays-diff'

import { ActivatedRoute, Router } from '@angular/router'
import {
  Component,
  DoCheck,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import { SyncService } from '../../../service/sync.service'

const template = require('./assets/template.html')
const style = require('./assets/styles.scss')

namespace Injector {
  export const container = {
    selector: 'asset-map',
    template: template,
    styles:   [ style ],
  }
}

namespace Map {
  export const options = leaflet => {
    return Object.assign(
      {
        layers: [
          leaflet.tileLayer(
            'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
              maxZoom:     17,
              attribution: '&copy; <a href="http://www.esri.com/">Esri</a>',
            }
          ),
          leaflet.tileLayer(
            'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png',
            {
              maxZoom:     17,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
              subdomains: 'abcd',
            }
          ),
        ],
      },
      Processors.optionsForLeafletRoot(leaflet)
    )
  }
  export const optionsDraw = {
    draw: {
      polygon: {
        showArea:          true,
        showLength:        true,
        allowIntersection: false,
        drawError:         {
          color:   '#e1e100',
          message: "<strong>Oh snap!<strong> you can't draw that!",
        },
        shapeOptions: {
          color:       '#FCFCFC',
          weight:      3,
          opacity:     1.0,
          lineCap:     'round',
          lineJoin:    'round',
          markerCap:   'round',
          dashArray:   '5, 5',
          dashOffset:  null,
          fillColor:   '#FCFCFC',
          fillOpacity: 0.1,
        },
      },
      polyline:     false,
      circle:       false,
      rectangle:    false,
      marker:       false,
      circlemarker: false,
    },
  }
  export const layers = leaflet => {
    return {
      baseLayers: {},
      overlays:   {},
    }
  }
  export const events = [
    'zoomend', // When zoom step complete
    'moveend', // When map stop moving
    'mouseover', // Mouse enter map
    'mouseout', // Mouse leave map
    'contextmenu', // Right glick on map object
    'draw:drawstart', // Triggered when polygon button is pressed
    'draw:drawstop', // Triggered when polygon shape is closed
    'draw:created', // Triggered when polygon shape is closed
    'draw:editstart', // Triggered when polygon shape is edited
    'draw:editstop', // Triggered when polygon shape stops being edited
    'draw:deletestart', // When delete is triggered
    'draw:deletestop', // When delete is conducted
  ]
}

namespace Settings {
  export const step = {
    location: {
      conditions: {
        zoom: 13,
      },
    },
  }
}

namespace Helpers {
  export let route: ActivatedRoute
  export let router: Router
  export let sync: SyncService
  export const leaflet = {
    map:     undefined,
    polygon: undefined,
  }
}

namespace Controller {
  export const logic = {
    listener: ev => {
      Controller.logic.listeners[ev.type](ev)
    },
    changeDetector: () => {},
    listeners:      {
      zoomend: ev => {
        States.map.zoom = ev.target._animateToZoom

        Controller.logic.changeDetector()
        Processors.syncMapState()
      },
      moveend: ev => {
        Processors.syncMapState()
      },
      mouseover:          ev => {},
      mouseout:           ev => {},
      contextmenu:        ev => {},
      'draw:drawstart':   ev => {},
      'draw:drawstop':    ev => {},
      'draw:created':     ev => {},
      'draw:editstart':   ev => {},
      'draw:editstop':    ev => {},
      'draw:deletestart': ev => {},
      'draw:deletestop':  ev => {},
    },
  }
}

namespace Processors {
  export const optionsForLeafletRoot = L => {
    return {
      zoom:   States.map.zoom,
      center: L.latLng(States.map.latlng[0], States.map.latlng[1]),
    }
  }
  const parseToBrowser = () => {
    const content = {
      latlng: States.map.latlng.join(','),
      z:      States.map.zoom,
    }
    Helpers.router.navigate([], {
      relativeTo:          Helpers.route,
      queryParams:         content,
      queryParamsHandling: 'merge',
    })
  }
  export const parseFromBrowser = () => {
    Helpers.route.queryParamMap.subscribe(params => {
      const list: any = { ...params }
      if (arraysDiff(Object.keys(list.params), [ 'z', 'latlng' ]).length === 0)
        Object.assign(States.map, {
          zoom:   list.params.z,
          latlng: list.params.latlng.split(','),
        })
    })
  }
  export const syncMapState = () => {
    // Sync to state
    Object.assign(States.map, {
      latlng: [
        Helpers.leaflet.map.getCenter().lat,
        Helpers.leaflet.map.getCenter().lng,
      ],
      zoom: Helpers.leaflet.map.getZoom(),
    })
    // Sync to browser url
    parseToBrowser()
  }
  export const injectPolygon = polygon => {
    const geoOptions: any = {
      style: Map.optionsDraw.draw.polygon.shapeOptions,
    }
    Leaflet.geoJSON(polygon, geoOptions).addTo(Helpers.leaflet.map)
    Helpers.leaflet.map.fitBounds(Leaflet.geoJSON(polygon, geoOptions).getBounds())
    Helpers.leaflet.map.dragging.disable()

    Helpers.leaflet.map.touchZoom.disable()
    Helpers.leaflet.map.doubleClickZoom.disable()
    Helpers.leaflet.map.scrollWheelZoom.disable()
    Helpers.leaflet.map.boxZoom.disable()
    Helpers.leaflet.map.keyboard.disable()
  }
}

namespace States {
  export let listeners
  export let map = {
    zoom:   5,
    latlng: [ 55.60587, 13.00073 ],
  }
}

namespace User {
  export const event = {
    location: {
      btnContinue: () => {
        Helpers.leaflet.map.dragging.disable()
        User.behavior.draw()
      },
    },
    draw: {
      btnContinue: () => {},
      btnEdit:     () => {
        User.behavior.edit()
      },
    },
    information: {
      btnCreate: () => {},
    },
  }
  export const behavior = {
    draw: () => {
      Helpers.leaflet.polygon = new Leaflet.Draw.Polygon(Helpers.leaflet.map)
      Helpers.leaflet.polygon.setOptions(Map.optionsDraw.draw.polygon)
      Helpers.leaflet.polygon.enable()
    },
    edit: () => {},
  }
}

@Component(Injector.container)
export class AssetMapComponent implements DoCheck, OnInit {
  @ViewChild('locationNext') locationNextButton: ElementRef
  @Input() resurces
  private prefix = (tag: string = '()') => `asset.map.component${ tag }`
  private map = {
    options:     undefined,
    optionsDraw: undefined,
    layers:      undefined,
  }
  private state
  private setting
  private controller
  private user

  private element: Element

  constructor (
    @Inject(ActivatedRoute) _route: ActivatedRoute,
    @Inject(Router) _router: Router,
    _syncService: SyncService
  ) {
    Helpers.route = _route
    Helpers.router = _router
    Helpers.sync = _syncService
  }

  public ngDoCheck (): void {}

  ngOnInit (): void {
    [ this.state, this.setting, this.controller, this.user ] = [
      States,
      Settings,
      Controller,
      User,
    ]

    this.map = {
      options:     Map.options(Leaflet),
      optionsDraw: Map.optionsDraw,
      layers:      Map.layers(Leaflet),
    }
  }
  ngAfterViewInit () {
    Controller.logic.changeDetector()
  }

  onMapReady (_map: Leaflet.Map) {
    Helpers.leaflet.map = _map
    States.listeners = Map.events.map(listener =>
      _map.on(listener, Controller.logic.listener))

    Processors.injectPolygon(this.resurces.field)
  }
}
