import * as Debug from 'debug'
import * as Leaflet from 'leaflet'
import * as LeafletDraw from 'leaflet-draw'
import * as arraysDiff from 'arrays-diff'
import { ActivatedRoute, Router } from '@angular/router'
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, Inject, NgZone, OnInit, ViewChild } from '@angular/core'
import { MapType } from '@angular/compiler/src/output/output_ast'
import { eventNames } from 'cluster'

const template = require('./assets/template.html')
const style = require('./assets/styles.scss')

namespace Injector {
  export const container = {
    selector:        'product-selector-feild',
    template:        template,
    styles:          [ style ],
    changeDetection: ChangeDetectionStrategy.OnPush,
  }
}

namespace Map {
  export const options = leaflet => {
    return Object.assign(
      {
        layers: [
          leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom:     17,
            attribution: '&copy; <a href="http://www.esri.com/">Esri</a>',
          }),
          leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png', {
            maxZoom:     17,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
          }),
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
  export let zone: NgZone
  export let detector: ChangeDetectorRef
  export let route: ActivatedRoute
  export let router: Router
  export const leaflet = {
    map:     undefined,
    polygon: undefined,
  }
}

namespace Controller {
  export const logic = {
    listener: ev => {
      Controller.logic.listeners[ev.type](ev)
      Helpers.detector.detectChanges()
    },
    changeDetector: () => {
      States.menu.location.conditions.find(rule => rule.name === 'zoom').state = Controller.logic.ruleFor.zoom()
      States.menu.location.valid = Controller.logic.ruleFor.valid(States.menu.location.conditions)
    },
    listeners: {
      zoomend: ev => {
        States.map.zoom = ev.target._animateToZoom

        Controller.logic.changeDetector()
        Processors.syncMapState()
      },
      moveend: ev => {
        Processors.syncMapState()
      },
      mouseover:        ev => {},
      mouseout:         ev => {},
      contextmenu:      ev => {},
      'draw:drawstart': ev => {},
      'draw:drawstop':  ev => {
        console.log('draw:drawstop()')
        States.menu.draw.valid = true
      },
      'draw:editstart':   ev => {},
      'draw:editstop':    ev => {},
      'draw:deletestart': ev => {},
      'draw:deletestop':  ev => {},
    },
    ruleFor: {
      valid: conditions => {
        return (
          conditions.find((rule: { state: Boolean }) => {
            return rule.state === true
          }) !== undefined
        )
      },
      zoom: () => {
        return States.map.zoom > Settings.step.location.conditions.zoom
      },
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
        Object.assign(States.map, { zoom: list.params.z, latlng: list.params.latlng.split(',') })
    })
  }
  export const syncMapState = () => {
    // Sync to state
    Object.assign(States.map, {
      latlng: [ Helpers.leaflet.map.getCenter().lat, Helpers.leaflet.map.getCenter().lng ],
      zoom:   Helpers.leaflet.map.getZoom(),
    })
    // Sync to browser url
    parseToBrowser()
  }
  export const activateMenuState = state => {
    if (!Object.keys(States.menu).includes(state)) console.error(`activateMenuState(state: ${ state }) - Invalid state`)
    Object.keys(States.menu).map(s => {
      States.menu[s]['active'] = false
      return States.menu[s]['active']
    })
    States.menu[state]['active'] = true
  }

  export const saveFieldBounds = () => {

  }
}

namespace States {
  export let listeners
  export let map = {
    zoom:   5,
    latlng: [ 55.60587, 13.00073 ],
  }
  export const menu = {
    location: {
      active:     true,
      valid:      false,
      conditions: [ { name: 'zoom', state: false } ],
      button:     {
        next: {
          rule: () => {},
        },
        reset: {
          rule: () => {},
        },
      },
    },
    draw: {
      active: false,
      valid:  false,
    },
    information: {
      active:    false,
      valid:     false,
      fieldName: '',
    },
  }
}

namespace User {
  export const event = {
    location: {
      btnContinue: () => {
        console.log('location.eventLocationContinue()')
        Helpers.leaflet.map.dragging.disable()
        Processors.activateMenuState('draw')
        User.behavior.draw()
      },
    },
    draw: {
      btnContinue: () => {
        console.log('draw.eventDrawContinue()')
        Processors.activateMenuState('information')
      },
      btnEdit: () => {
        console.log('draw.eventDrawEdit()')
        User.behavior.edit()
      },
    },
    information: {
      btnCreate: () => {
        console.log('information.eventCreateEdit()')
        Processors.saveFieldBounds()
      },
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
export class ProductSelectorFieldComponent implements DoCheck, OnInit {
  @ViewChild('locationNext') locationNextButton: ElementRef

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
  private zone: NgZone
  private detector: ChangeDetectorRef

  constructor (
    @Inject(ActivatedRoute) _route: ActivatedRoute,
    @Inject(Router) _router: Router,
    @Inject(ElementRef) elementRef: ElementRef,
    @Inject(NgZone) _zone: NgZone,
    @Inject(ChangeDetectorRef) _detector: ChangeDetectorRef
  ) {
    Helpers.zone = _zone
    Helpers.detector = _detector
    Helpers.route = _route
    Helpers.router = _router

    this.element = elementRef.nativeElement
    this.zone = _zone
    this.detector = _detector
  }

  public ngDoCheck (): void {
    console.log('ngDoCheck() - Change detection running.')
  }

  ngOnInit (): void {
    [ this.state, this.setting, this.controller, this.user ] = [ States, Settings, Controller, User ]

    Processors.parseFromBrowser()

    this.map = {
      options:     Map.options(Leaflet),
      optionsDraw: Map.optionsDraw,
      layers:      Map.layers(Leaflet),
    }
  }
  ngAfterViewInit () {
    Controller.logic.changeDetector()
    Helpers.detector.detectChanges()
  }

  onMapReady (_map: Leaflet.Map) {
    console.log('onMapReady() - Map render complete.')
    Helpers.leaflet.map = _map
    States.listeners = Map.events.map(listener => _map.on(listener, Controller.logic.listener))

    const L = _map

    Leaflet.Draw.Polygon.extend({
      initialize: (a, b, c) => {
        console.log(' IM HERE!!!!!!!!!!!!! ')
        console.log(a, b, c)
      },
    })
  }
}
