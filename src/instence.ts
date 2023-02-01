import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios/dist/axios'
import { configType, downLoadParams, params, RequertInterceptors } from './types'
export class ServiceInsance {
  instance: AxiosInstance
  private interceptors?: RequertInterceptors
  constructor(config?: configType) {
    this.instance = axios.create(config)
    this.interceptors = config?.interceptors
    this.instance.interceptors.request.use(this.interceptors?.requestInterceptor, this.interceptors?.requestInterceptorCatch)
    this.instance.interceptors.response.use(this.interceptors?.responseInterceptor, this.interceptors?.responseInterceptorCatch)
  }
  requrest<T = any>(config?: configType): Promise<AxiosResponse<T, any>> {
    return new Promise((resolve, rej) => {
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
          rej(err)
        })
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
