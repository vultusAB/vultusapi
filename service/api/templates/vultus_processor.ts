/* eslint no-unused-vars: 0 */
import { API, configSetup } from '../unity'
import { AxiosInstance, AxiosPromise } from 'axios'
import {
  clone,
  compact,
  fromPairs,
  keys,
  last,
  merge,
  toPairs,
  unescape,
  zip,
} from 'lodash'
import { Moment } from '../../localization.service'
import { requestConfig } from './schema/axios-default'

/* eslint-disable space-in-parens, max-len */
const axiosExecution: AxiosInstance = new API(configSetup(requestConfig).set({
    baseURL:
      'https://j10i070kvl.execute-api.eu-west-2.amazonaws.com/beta2enhanced/execution',
  }))
const axiosResultPull: AxiosInstance = new API(configSetup(requestConfig).set({
    baseURL: 'https://i17na1zib4.execute-api.eu-west-2.amazonaws.com/beta2',
  }))
/* eslint-enable space-in-parens */

const formatParams = (id, year: number, month: number) => {
  return {
    params: {
      polygonid: id,
      yearmonth: `y${ year }m${ month }`,
    },
  }
}

const normalizedResponse = (records: any) => {
  const content = {
    done: true,
    list: [],
  }
  const raw = keys(records)
  let fields
  try {
    // [[date: [year, month, day], binery: Raw image]]
    fields = raw.map((record: any) => [
      record.split('-'),
      toPairs(records[record])
        .filter((entry: any) => entry.shift().includes('.png'))
        .pop()
        .pop(),
    ])
  } catch (error) {
    content.done = false
    console.error('Invalid schema provided by API', records)
  }
  // Encode to png
  fields = fields.map((field: any) => [
    field.shift(),
    `data:image/png;base64,data:image/png;base64,${ field.pop() }`,
  ])
  content.list = fields
  return content
}

/* eslint-disable security/detect-object-injection */
const transformAPISyntax = {
  transformRequest: [
    (data: any) => {
      const transformed = {
        polygonID:     data.uniq.join('_'),
        satellitetype: 'sentinel-s2-l1c',
        geojson:       merge(
          fromPairs(zip([ 'year', 'month' ], data.date)),
          data.target
        ),
      }

      return transformed
    },
  ],
  transformResponse: [
    (content: any) => {
      console.log(content)
      if (!('data' in content)) return { done: false }
      return normalizedResponse(content.data)
    },
  ],
}

/* eslint-enable security/detect-unsafe-regex */
interface Routes {
  result: (params: object) => [object, object]
  execution: (record: object) => [object, object]
}
/*
export const Router = (function Router (this: Routes) {
  this.result = (params: object) => {
    return [ params, transformAPISyntax ]
  }
  this.execution = (record: object) => {
    return [ record, transformAPISyntax ]
  }
} as Function) as { new (): Routes }

export const route = new Router()
export const fetch = (args: [object] | [object, object]): AxiosPromise =>
  axiosExecution.get.apply(axiosExecution, args)
*/
export const serviceRequest = (record: any) => {
  return axiosExecution.get.apply(axiosExecution, [ record, transformAPISyntax ])
}

export const resultRequest = (
  id,
  year: number,
  month: number
): AxiosPromise => {
  console.log(merge(transformAPISyntax, formatParams(id, year, month)))
  return axiosResultPull.get(
    '/results',
    merge(
      { transformResponse: transformAPISyntax.transformResponse },
      formatParams(id, year, month)
    )
  )
}
/* eslint-enable max-len */
