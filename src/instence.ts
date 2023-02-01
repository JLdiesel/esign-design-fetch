import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios/dist/axios'
import { configType, downLoadParams, params, baseUrl } from './types'

export class ServiceInsance {
  forWard?: baseUrl
  assessment?: baseUrl
  support?: baseUrl
  h5?: baseUrl
  inuserUrl?: baseUrl
  accessUrl?: baseUrl
  instance: AxiosInstance
  constructor(config?: configType) {
    this.instance = axios.create(config)
    if (config.baseUrlMap) {
      for (const key in config.baseUrlMap) {
        this[key] = {
          get: this.createBaseFn('get', config.baseUrlMap[key]),
          post: this.createBaseFn('post', config.baseUrlMap[key]),
          put: this.createBaseFn('put', config.baseUrlMap[key]),
          delete: this.createBaseFn('delete', config.baseUrlMap[key]),
          head: this.createBaseFn('head', config.baseUrlMap[key]),
          patch: this.createBaseFn('patch', config.baseUrlMap[key]),
        }
      }
    }
    this.instance.interceptors.request.use(config?.interceptors?.requestInterceptor, config?.interceptors?.requestInterceptorCatch)
    this.instance.interceptors.response.use(config?.interceptors?.responseInterceptor, config?.interceptors?.responseInterceptorCatch)
  }
  private createBaseFn(type, value) {
    return (url, config: configType) =>
      this[type](`${value.url}${url}`, {
        ...config,
        interceptors: {
          responseInterceptor: config.interceptors?.responseInterceptor
            ? (res: AxiosResponse<any, any>) => {
                if (typeof value.interceptors?.responseInterceptor === 'function') {
                  res = value.interceptors?.responseInterceptor(res)
                }
                return config.interceptors.responseInterceptor(res)
              }
            : value.interceptors?.responseInterceptor,
          requestInterceptor: config.interceptors?.requestInterceptor
            ? (config: configType) => {
                if (typeof value.interceptors?.requestInterceptor === 'function') {
                  config = value.interceptors?.requestInterceptor(config)
                }
                return config.interceptors.requestInterceptor(config)
              }
            : value.interceptors?.requestInterceptor,
          responseInterceptorCatch: config.interceptors?.responseInterceptorCatch
            ? (res: AxiosResponse<any, any>) => {
                if (typeof value.interceptors?.responseInterceptorCatch === 'function') {
                  res = value.interceptors?.responseInterceptorCatch(res)
                }
                return config.interceptors.responseInterceptorCatch(res)
              }
            : value.interceptors?.responseInterceptorCatch,
        },
      })
  }
  private requrest<T = any>(config?: configType): Promise<AxiosResponse<T, any>> {
    return new Promise((resolve, rej) => {
      try {
        if (config.interceptors?.requestInterceptor) {
          config = config.interceptors.requestInterceptor(config)
        }
        this.instance
          .request<T>(config)
          .then((res) => {
            if (config.interceptors?.responseInterceptor) {
              res = config.interceptors.responseInterceptor(res)
            }
            resolve(res)
          })
          .catch((err) => {
            if (config.interceptors?.responseInterceptorCatch) {
              err = config.interceptors.responseInterceptorCatch(err)
            }
            rej(err)
          })
      } catch (error) {
        rej(error)
      }
    })
  }
  get<T = any>(url: string, config?: configType) {
    return this.requrest<T>({ url, ...config, method: 'get' })
  }
  post<T = any>(url: string, config?: configType) {
    return this.requrest<T>({ url, ...config, method: 'post' })
  }
  put<T = any>(url: string, config?: configType) {
    return this.requrest<T>({ url, ...config, method: 'put' })
  }
  delete<T = any>(url: string, config?: configType) {
    return this.requrest<T>({ url, ...config, method: 'delete' })
  }
  head<T = any>(url: string, config?: configType) {
    return this.requrest<T>({ url, ...config, method: 'head' })
  }
  patch<T = any>(url: string, config?: configType) {
    return this.requrest<T>({ url, ...config, method: 'patch' })
  }
  downLoad(url, config?: downLoadParams) {
    this.requrest({ url, responseType: 'blob', ...config.config })
      .then((res) => {
        const { data, headers } = res
        const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1') || data?.fileName
        // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
        let blob
        if (config.config.isJSON) {
          blob = new Blob([JSON.stringify(data)], config.config.blobOption)
        } else {
          blob = new Blob([data], { type: headers['content-type'] })
        }
        const dom = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        dom.href = url
        dom.download = decodeURI(fileName)
        dom.style.display = 'none'
        document.body.appendChild(dom)
        dom.click()
        dom.parentNode.removeChild(dom)
        window.URL.revokeObjectURL(url)
      })
      .catch((err) => {
        config.config.catchFn(err)
      })
  }

  all(configs: params[]) {
    const promises = configs.map(({ methods, url, config }) => this.instance[methods](url, config))
    return Promise.all(promises)
  }
}
