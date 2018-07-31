import * as castTo from 'change-case'
import * as geobox from 'geojson-bbox'
import * as geojson2svg from 'geojson2svg'

import Bluebird from 'bluebird'
import { DomSanitizer } from '@angular/platform-browser'
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class StructService {
  public display

  constructor (private _sanitizer: DomSanitizer) {
    [ Helpers.sanitizer, this.display ] = [ _sanitizer, Map.display ]
  }
}
namespace Helpers {
  export let sanitizer: DomSanitizer
}

namespace Map {
  export const display = {
    field: record => {
      return {
        name:       castTo.titleCase(record.doc.attributes.name),
        id:         record.doc.data.id,
        timestamp:  record.doc.data.timestamp,
        type:       castTo.titleCase(record.doc.data.type),
        attributes: Object.assign(
          { svg: Processors.generateFieldIcon(record.doc.attributes.field) },
          record.doc.attributes
        ),
        synchronized: false,
      }
    },
  }
}

namespace Processors {
  export const generateFieldIcon = geojson => {
    const boundsValues = geobox(geojson)
    const boundsMap = {
      left:   0,
      bottom: 1,
      right:  2,
      top:    3,
    }
    const bounds = Object.assign(
      {},
      ...Object.keys(boundsMap).map(c => {
        return { [c]: boundsValues[boundsMap[c]] }
      })
    )
    const options = {
      viewportSize: {
        width:  40,
        height: 40,
      },
      fitTo:     'height',
      static:    { attributes: { class: 'o-svg-path' } },
      mapExtent: bounds,
    }
    return Helpers.sanitizer.bypassSecurityTrustHtml(geojson2svg(options).convert(geojson, options))
  }
}
