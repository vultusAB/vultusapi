import * as DArray from 'arrays-diff'
import * as FArray from 'array-difference-x'
import * as Uniqid from 'uniqid'

import { Injectable } from '@angular/core'
import { LocalizationService } from '../service/localization.service'

interface Struct {}

@Injectable({
  providedIn: 'root',
})
export class ListFactory {
  private prefix = 'list.factory.constructor()'
  private module = 'Test'
  constructor (private _localization: LocalizationService) {
    [ Helpers.localization, Helpers.moment ] = [
      _localization.local,
      _localization.moment,
    ]
  }
}

export class List {
  private documents: Array<{
    id: string
    timestamp
    data: Array<string | number | boolean>
    types: Array<'string' | 'number' | 'boolean'>
    length: number
    valid: boolean
    deleted: boolean
  }> = []
  constructor (data: Array<string | number | boolean>) {
    const prefix = `array.factory.list.constructor()`
    Document.add(this.documents, data)
  }

  public debug = () => {
    const prefix = `array.factory.list.debug()`
  }

  public index = (position: 'first' | 'last' | 'all' = 'last') => {
    const index = Document.index(this.documents)
    if (position === 'all') return index

    if (![ 'first', 'last' ].includes(position)) {
      console.error(
        'List index',
        'Not valid position',
        `Expected first, last Received ${ position }`
      )
      return undefined
    }
    return Logic.grabDocument[position](index, false)
  }

  public get = (index: object | 'last' = 'last') => {
    return Document.get(this.documents, index)
  }
  public update = (data: Array<string | number | boolean>) => {
    const valid = Document.update(this.documents, data)
    return {
      data:  Document.get(this.documents),
      valid: valid,
    }
  }
}

namespace Document {
  const prefix = 'list.document.interface'

  const length = data => {
    return data.length
  }
  export const empty = data => {
    return data.length === 0
  }
  const types = data => {
    return data.map(item => typeof item)
  }
  const valid = (documents, data) => {
    const log = []
    if (Conditions.validDocuments(documents)) {
      if (!(length(data) === length(grab(documents, 'first'))))
        log.push([
          `${ prefix }.valid()`,
          'Not valid',
          `Child has ${ length(data) } elements and parent has ${ length(grab(documents, 'first')) } elements`,
        ])
      if (!empty(DArray(types(data), types(grab(documents, 'first')))))
        log.push([
          `${ prefix }.valid()`,
          'Not valid',
          `Elements don't match between child and parent`,
        ])
    }
    const valid = empty(log)
    if (!valid) log.map(item => console.error(...item))

    return valid
  }

  export const add = (documents, data: Array<string | number | boolean>) => {
    const product = {
      data:      data,
      id:        Uniqid(),
      timestamp: Helpers.moment.toString(),
      types:     types(data),
      length:    length(data),
      valid:     valid(documents, data),
      deleted:   false,
    }
    documents.push(product)
  }

  export const update = (documents, data: Array<string | number | boolean>) => {
    const status = valid(documents, data)
    if (!status) console.warn(`${ prefix }.update()`, 'Data block not valid!')

    add(documents, data)
    return status
  }

  export const index = (
    documents,
    includeInvalid: boolean = true,
    includeDeleted: boolean = false
  ) => {
    let result = documents.map(document => {
      return {
        id:        document.id,
        timestamp: document.timestamp,
        valid:     document.valid,
        deleted:   document.deleted,
      }
    })
    if (!includeInvalid) result.filter(document => document.valid)
    if (!includeDeleted) result.filter(document => !document.deleted)

    return result
  }

  export const get = (documents, index: object | 'last' = 'last') => {
    if (index === 'last') return grab(documents)

    const indexTemplate = [ 'id', 'timestamp', 'valid', 'deleted' ]
    const indexKeys = Object.keys(index)
    const indexValid = empty(FArray(indexTemplate, indexKeys))

    if (indexValid) return Logic.grabDocument.index(documents, index['id'])

    console.error(
      `${ prefix }.get()`,
      'Index object invalid',
      `Expected ${ indexTemplate.toString() }`,
      `Received ${ indexKeys.toString() }`
    )
    return undefined
  }

  export const del = (documents, position: 'first' | 'last' = 'last') => {
    Logic.removeDocument[position](documents)
  }

  const grab = (documents, position: 'first' | 'last' = 'last') => {
    return Logic.grabDocument[position](documents)
  }
}

namespace Conditions {
  const size = documents => {
    return documents.length
  }

  export const validDocuments = documents => {
    return size(documents) > 0
  }
}

namespace Logic {
  export const grabDocument = {
    first: (documents, isDocument: boolean = true) => {
      const item = documents.shift()
      documents.unshift(item)
      return isDocument ? item.data : item
    },
    index: (documents, id) => {
      const prefix = 'list.document.logic.grab.document.index()'
      const document = documents.filter(document => document.id === id)
      if (Document.empty(document)) {
        console.error(prefix, `Index ${ id } not found!`)
        return undefined
      }

      return document[0].data
    },
    last: (documents, isDocument: boolean = true) => {
      const item = documents.pop()
      documents.push(item)
      return isDocument ? item.data : item
    },
  }

  export const removeDocument = {
    first: documents => {
      const item = documents.shift()
      item.deleted = true
      documents.unshift(item)
    },
    last: documents => {
      const item = documents.pop()
      item.deleted = true
      documents.push(item)
    },
  }
}

namespace Helpers {
  export let localization: LocalizationService['local']
  export let moment: LocalizationService['moment']
}
