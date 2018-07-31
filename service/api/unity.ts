import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { chunk, clone, isEqual, merge } from 'lodash'

/* eslint no-unused-vars: 0 */

namespace Unity {
  export const when = {
    equal: (value: any, reference: any, success: any) => {
      return isEqual(value, reference) ? success : value
    },
  }

  export const sequence = {
    transform: {
      into: {
        chunks: chunk,
      },
    },
  }

  // declare type Config = (base: AxiosRequestConfig) =>
  // { set: (update: AxiosRequestConfig) => AxiosRequestConfig }

  export const setup = (base: AxiosRequestConfig) => {
    const instance: AxiosRequestConfig = clone(base)

    const children = {
      set: (update: AxiosRequestConfig): AxiosRequestConfig => {
        return merge(instance, update)
      },
    }

    return children
  }

  export const api = (function API (this: AxiosInstance, settings: AxiosRequestConfig) {
    merge(this, Axios.create(settings))
  } as Function) as { new (settings: AxiosRequestConfig): AxiosInstance }
}
/* eslint no-redeclare: 0 */
export const configSetup = Unity.setup
export const API = Unity.api
