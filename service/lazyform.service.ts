import { ActivatedRoute, Router } from '@angular/router'
import { Inject, Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LazyFormService {
  constructor (
    @Inject(ActivatedRoute) _route: ActivatedRoute,
    @Inject(Router) _router: Router
  ) {
    Helpers.route = _route
    Helpers.router = _router

    Logic.parseFromBrowser()
  }

  doMagic (data) {
    const inputKeys = Object.keys(data)
    const urlKeys = Object.keys(Helpers.urlParams)
    const replaceValues = inputKeys.filter(key => urlKeys.includes(key))

    const replicate = data
    const schema = replaceValues.map(key => {
      if (typeof data[key][0] === typeof Helpers.urlParams[key])
        replicate[key][0] = Helpers.urlParams[key]
      return typeof data[key][0] === typeof Helpers.urlParams[key]
    })
    return replicate
  }
}

namespace Helpers {
  export let route: ActivatedRoute
  export let router: Router
  export let urlParams
}

namespace Logic {
  export const parseFromBrowser = () => {
    return Helpers.route.queryParamMap.subscribe(params => {
      const list: any = { ...params }
      Helpers.urlParams = list.params
    })
  }
}
