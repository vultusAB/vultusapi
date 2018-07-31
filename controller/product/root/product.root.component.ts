import * as castTo from 'change-case'

import { ActivatedRoute, Router } from '@angular/router'
import { Component, Inject } from '@angular/core'
import { SyncService } from '../../../service/sync.service'

const template = require('./assets/template.html')
const style = require('./assets/styles.scss')

namespace Handler {
  export const container = {
    selector: 'product-root',
    template: template,
    styles:   [ style ],
  }
}

namespace Helpers {
  export let route: ActivatedRoute
  export let router: Router
  export let sync: SyncService
  export let instructions
}

namespace Processors {
  export const parseFromBrowser = () => {
    const prefix = 'product.root.processors.parseFromBrowser()'
    Helpers.route.queryParamMap.subscribe(params => {
      const list: any = { ...params }
      Processors.parseStorageInstructions(list)
    })
  }
  export const parseStorageInstructions = async list => {
    const prefix = 'product.root.processors.parseStorageInstructions()'
    if (!('db' in list.params)) return false
    const workList = list.params.db.split(',').map(ins => ins.split('.'))
    return workList.map(work => {
      if (work.length === 2)
        if (work[0] === 'clear') return Processors.storageClear(work[1])
        else if (work[0] === 'print') return Processors.storagePrint(work[1])
        else return false
      return false
    })
  }
  export const storagePrint = async target => {
    const prefix = 'product.root.processors.storagePrint()'
    const records = await Helpers.sync.local
      .allDocs(Helpers.sync.rule.prefix(
          {
            include_docs: true,
            attachments:  false,
          },
          target
        ))
      .then(result => {
        return result
      })
      .catch(error => {
        console.error(prefix, error)
        return error
      })
    if (records.rows.length === 0)
      console.warn(
        prefix,
        `No records taged ${ target } found. No data to display.`
      )
  }
  export const storageClear = async target => {
    const prefix = 'product.root.processors.storageClear()'
    const records = await Helpers.sync.local
      .allDocs(Helpers.sync.rule.prefix(
          {
            include_docs: true,
            attachments:  false,
          },
          target
        ))
      .then(result => {
        return result
      })
      .catch(error => {
        console.error(prefix, error)
        return error
      })
    if (records.rows.length === 0)
      console.warn(
        prefix,
        `No records taged ${ target } found. No changes has been made.`
      )

    const result = records.rows.map(record => {
      Helpers.sync.local.remove(record.doc._id, record.doc._rev)
      return `Force delete: ${ castTo.sentenceCase(record.doc.attributes.name) }`
    })
  }
}
@Component(Handler.container)
export class ProductRootComponent {
  constructor (
    private _sync: SyncService,
    @Inject(ActivatedRoute) _route: ActivatedRoute,
    @Inject(Router) _router: Router
  ) {
    Helpers.route = _route
    Helpers.router = _router
    Helpers.sync = _sync

    Processors.parseFromBrowser()
  }
}
