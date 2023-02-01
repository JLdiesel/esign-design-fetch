import type { AxiosRequestConfig, AxiosResponse, HttpStatusCode } from 'axios'
export interface RequertInterceptors {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (res: AxiosResponse) => AxiosResponse
  responseInterceptorCatch?: (error: any) => any
}
export interface configType extends AxiosRequestConfig {
  interceptors?: RequertInterceptors
  codesHandler?: Record<HttpStatusCode, () => void>
}
export type methods = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head'

export type params = {
  methods: methods
  url: string
  config: AxiosRequestConfig
}
export interface downLoadParams extends params {
  config: downLoadConfig
  methods: 'get' | 'post'
}
export interface downLoadConfig extends AxiosRequestConfig {
  isJSON?: boolean
  blobOption?: BlobPropertyBag
  catchFn: (err: any) => void
}
