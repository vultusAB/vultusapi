import { ActivatedRoute, Router } from '@angular/router'
import { Inject, Injectable } from '@angular/core'
import { resultRequest } from './api/templates/vultus_processor'

namespace Helpers {
  export let route: ActivatedRoute
  export let router: Router
  export let urlParams
}

@Injectable({
  providedIn: 'root',
})
export class PredictionService {
  // Intercept construction of the object feeding the visual components
  public intercept = record => {
    // console.log(record)

    return record
  }

  public request = prediction => {
    return Request.req(prediction)
  }

  public available = (prediction, field) => {
    return Available.ava(prediction, field)
  }

  constructor (
    @Inject(ActivatedRoute) _route: ActivatedRoute,
    @Inject(Router) _router: Router
  ) {
    Helpers.route = _route
    Helpers.router = _router
  }
}

namespace Request {
  const index = []

  const identifierRequest = record => {
    return [ record.childOf.id, ...record.date ].join('_')
  }
  const initOperation = record => {
    const key = index.indexOf(identifierRequest(record))
    const initPipe = record.sync
    if (!initPipe && key !== -1) index.splice(key, 1)
    return initPipe
  }
  const validRequestPipe = record => {
    const validRequest = !index.includes(identifierRequest(record))
    if (validRequest) index.push(identifierRequest(record))
    return validRequest
  }

  export const req = record => {
    const prefix = 'Request.init'

    if (!initOperation(record)) return true
    if (!validRequestPipe(record)) return false

    return 'Somethings'
  }
}

namespace Available {
  export const ava = (record, field) => {
    const prefix = 'Available.init'

    resultRequest('jivevcs9', 2018, 5)
      .then(list => {
        return list
      })
      .catch(error => {
        console.error(error)
      })
  }

  const configAPIRequest = (record: any, field: any) => {
    return {
      uniq:   [ record.childOf.id, record.id ],
      date:   record.date,
      target: field.attributes.field,
    }
  }
}
