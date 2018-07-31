import * as castTo from 'change-case'

import Bluebird from 'bluebird'
import { Injectable } from '@angular/core'
import PouchDB from 'pouchdb'
import PouchDBAuthentication from 'pouchdb-authentication'
import PouchDBFind from 'pouchdb-find'

@Injectable({
  providedIn: 'root',
})
/* eslint-disable
comma-dangle
*/
export class SyncService {
  public remote
  public local
  public rule
  public request
  public remove
  public pull
  public put
  public bind = Logic.database.account.bind
  constructor () {
    [
      this.remote,
      this.local,
      this.rule,
      this.request,
      this.put,
      this.pull,
      this.remove
    ] = [
      Helpers.remote,
      Helpers.local,
      Logic.rules,
      Logic.request,
      Logic.put,
      Logic.pull,
      Logic.remove,
    ]
  }
}
/* eslint-enable
comma-dangle
*/
namespace Logic {
  const domain = 'https://loc.vultus.io/'
  const options = { skip_setup: true }
  export const database = {
    remote: {
      initialization: () => {
        const InstanceDB = PouchDB
        InstanceDB.plugin(PouchDBAuthentication)
        return new InstanceDB(domain, options)
      },
    },
    local: {
      initialization: (name, remote) => {
        const InstanceDB = new PouchDB(name)
        InstanceDB.sync(remote, { live: true, retry: true }).on(
          'error',
          console.log.bind(console)
        )
        return InstanceDB
      },
    },
    account: {
      bind: (account: string = '') => {
        const InstanceDB = PouchDB
        InstanceDB.plugin(PouchDBAuthentication)
        const name = domain + account
        Helpers.local = database.local.initialization(
          new InstanceDB(name, options),
          name
        )
        return Helpers.local
      },
    },
    info: () => {
      Helpers.local.info().catch(error => console.error(error))
    },
  }
  export const rules = {
    prefix: (raw, prefix) => {
      const rule = {
        startkey: `${ prefix }`,
        endkey:   `${ prefix }\ufff0`,
      }
      return Object.assign(raw, rule)
    },
  }
  export const remove = data => {
    return Helpers.local.remove(data)
  }
  export const pull = data => {
    return Helpers.local.get(data)
  }
  export const put = data => {
    return Helpers.local.put(data)
  }
  export const request = (
    target,
    id: false | string = false,
    attachments = false,
    docs = true
  ) => {
    const prefix = `sync.service.reguest(target: ${ target }, id: ${ id }, attachments: ${ attachments }, docs: ${ docs })`
    if (id === false)
      // True on request: all of 'target' for account
      return Helpers.local
        .allDocs(Logic.rules.prefix(
            {
              include_docs: docs,
              attachments:  attachments,
            },
            'field'
          ))
        .then(result => {
          return result
        })
        .catch(error => {
          console.error(prefix, error)
          return error
        })

    return Helpers.local
      .get(castTo.paramCase(`${ target }-${ id }`))
      .then(result => {
        const casted = Processors.castSingleSyntax(result)
        return casted
      })
      .catch(error => {
        console.error(prefix, error)
        return error
      })
  }
}

namespace Processors {
  export const castSingleSyntax = record => {
    return {
      offset:     false,
      total_rows: false,
      rows:       [
        {
          doc:   record,
          id:    record._id,
          key:   record._id,
          value: {
            rev: record._rev,
          },
        },
      ],
    }
  }
}

namespace Helpers {
  export let remote = Logic.database.remote.initialization()
  export let local // Logic.database.local.initialization('sync', remote)
}
