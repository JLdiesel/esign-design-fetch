import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, HttpStatusCode } from 'axios'
import { configType, downLoadParams, params, RequertInterceptors, methods } from '@/types'

export class ServiceInsance {
  private instance: AxiosInstance
  private interceptors?: RequertInterceptors
  get!: <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) => Promise<AxiosResponse<T, any>>
  post!: <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) => Promise<AxiosResponse<T, any>>
  delete!: <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) => Promise<AxiosResponse<T, any>>
  head!: <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) => Promise<AxiosResponse<T, any>>
  put!: <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) => Promise<AxiosResponse<T, any>>
  patch!: <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) => Promise<AxiosResponse<T, any>>
  constructor(config: configType) {
    this.instance = axios.create(config)
    this.interceptors = config.interceptors
    //从config中取出的拦截器是对应的实例的拦截器
    this.instance.interceptors.request.use(this.interceptors?.requestInterceptor, this.interceptors?.requestInterceptorCatch)
    this.instance.interceptors.response.use(
      (value) => {
        const { status } = value.data
        config.codesHandler?.[status as HttpStatusCode]?.()
        return this.interceptors?.responseInterceptor(value)
      },
      (error) => {
        const { status } = error
        config.codesHandler?.[status as HttpStatusCode]?.()
        return this.interceptors?.responseInterceptorCatch(error)
      }
    )
    const methods: methods[] = ['get', 'post', 'delete', 'put', 'patch', 'head']
    methods.forEach((item) => {
      this[item] = this.instance[item]
    })
  }
  downLoad(params: downLoadParams) {
    this[params.methods](params.url, { responseType: 'blob', ...params.config.params })
      .then((res) => {
        const { data, headers } = res
        const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1') || data?.fileName
        // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
        let blob
        if (params.config.isJSON) {
          blob = new Blob([JSON.stringify(data)], params.config.blobOption)
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
        params.config.catchFn(err)
      })
  }
  all(configs: params[]) {
    const promises = configs.map(({ methods, url, config }) => this.instance[methods](url, config))
    return Promise.all(promises)
  }
}
