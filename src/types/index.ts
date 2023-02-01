import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HttpStatusCode } from 'axios'
export interface RequertInterceptors {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (res: AxiosResponse) => AxiosResponse
  responseInterceptorCatch?: (error: any) => any
}
export type baseUrl = {
  get: (url: any, config: configType) => any
  post: (url: any, config: configType) => any
  put: (url: any, config: configType) => any
  delete: (url: any, config: configType) => any
  head: (url: any, config: configType) => any
  patch: (url: any, config: configType) => any
}

export interface ServiceInsanceType {
  instance: AxiosInstance
}

export type BaseUrlMap = {
  [a: string]: {
    url: string
    interceptors?: RequertInterceptors
  }
}
export type baseUrlArr = 'forWard' | 'assessment' | 'support' | 'h5' | 'accessUrl' | 'inuserUrl'

export interface configType extends AxiosRequestConfig {
  interceptors?: RequertInterceptors
  codesHandler?: Record<HttpStatusCode, () => void>
  baseUrlMap?: {
    [K in baseUrlArr]?: string
  }
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
