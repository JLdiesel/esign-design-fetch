# 流程与 IT 中心前端公共 axios 封装

## 快速开始

```bash
npm install @esign-design-info/fetch
yarn add @esign-design-info/fetch
pnpm install @esign-design-info/fetch
```

## 设计理念

1. 在原先的 axios 配置中新增属性，方便无缝衔接原有的系统
2. 在原先配置基础上新增全局拦截配置、不同 URL 拦截配置、不同方法拦截配置，皆为可选项

```js
import { ServiceInsance } from '@esign-design-info/fetch'
const service = new ServiceInsance({
  timeout: 30000,
  // 默认请求头
  headers: {},
  // 默认的请求url
  baseURL: process.env.VUE_APP_SUPPORT_URL,
  // 公共的请求响应拦截
  interceptors: {
    requestInterceptor: (config) => {
      return config
    },
    requestInterceptorCatch: (error) => {
      return error
    },
    // 请求返回值拦截
    responseInterceptor: (res) => {
      return res
    },
    responseInterceptorCatch: (error) => {
      return error
    },
  },
  // 使用方法1：不同的请求url对应不同的请求响应拦截
  baseUrlMap: {
    support: {
      url: process.env.VUE_APP_SUPPORT_URL,
      interceptors: {
        responseInterceptor(res) {
          return res.data
        },
      },
    },
    inuserUrl: {
      url: `${process.env.VUE_APP_SUPPORT_URL}/inuser`,
      interceptors: {
        responseInterceptor(res) {
          return res.data
        },
      },
    },
  },
})
//  使用方法1：不同的请求url的不同方法也能对应不同的请求响应拦截  需搭配config中baseUrlMap使用
export function supportget(url, params) {
  return service.support.get(url, {
    params,
    interceptors: {
      responseInterceptor(res) {
        return res.data
      },
    },
  })
}
// 使用方法2：不同的请求请求方式对应不同的请求拦截
export function get(url, params) {
  return service.get(url, {
    params,
    interceptors: {
      responseInterceptor(res) {
        return res.data
      },
    },
  })
}
```

> 说明:不同的请求 url 对应不同的请求响应拦截，在使用时只需要 service[key].get()，key 为传入的 baseUrlMap 的 key，后方的 url 就不需要像之前模板字符串一样手动拼接，例如之前需要`${inuserUrl}/account/get`，现在 url 直接传入'/account/get'，可以再次进行二次封装,相当于提供了多个 baseUrl

## 参数介绍

### ServiceInsanceConfig

| 入参         | 类型                | 是否必填 | 说明                                                                                            |
| ------------ | ------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| interceptors | RequertInterceptors | 否       | 传入当前实例公共的请求拦截                                                                      |
| baseUrlMap   | BaseUrlMap          | 否       | key 为 baseUrlArr forWard、assessment、support、h5、inuserUrl、accessUrl value 为不同的 baseUrl |
| ...others    | AxiosRequestConfig  | 否       | axios 自带的配置                                                                                |

### baseUrlArr

| 枚举       | 是否必填 | 说明                                                    |
| ---------- | -------- | ------------------------------------------------------- |
| forWard    | 否       | 产研系统的后端 url                                      |
| assessment | 否       | 绩效系统的后端 url                                      |
| support    | 否       | 运营支持系统的后端 url                                  |
| h5         | 否       | crmh5 的后端 ujrl                                       |
| inuserUrl  | 否       | 内部用户中心的后端 url                                  |
| accessUrl  | 否       | 登录系统的后端 url                                      |
| 其他       | 否       | 其他系统的后端 url,可任意填写 key 名称,但未设置代码提示 |

### BaseUrlMap

| 入参         | 类型                | 是否必填 | 说明                        |
| ------------ | ------------------- | -------- | --------------------------- |
| url          | string              | 是       | 当前请求的后端的 baseUrl    |
| interceptors | RequertInterceptors | 否       | 传入当前 URL 请求的请求拦截 |

### RequertInterceptors

| 入参                     | 类型                                               | 是否必填 | 说明                                                     |
| ------------------------ | -------------------------------------------------- | -------- | -------------------------------------------------------- |
| requestInterceptor       | (config: AxiosRequestConfig) => AxiosRequestConfig | 否       | 请求配置拦截，入参为当前传入的请求配置，需要返回请求配置 |
| requestInterceptorCatch  | (error: any) => any                                | 否       | 请求错误拦截                                             |
| responseInterceptor      | (res: AxiosResponse) => AxiosResponse              | 否       | 响应配置拦截，入参为请求返回值，需要返回值               |
| responseInterceptorCatch | (error: any) => any                                | 否       | 请求错误拦截                                             |
