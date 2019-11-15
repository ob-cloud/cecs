import axios from 'axios'
import QS from 'qs'
import Storage from '@/common/cache'
import Router from '@/router'
import envConfig from '@/common/config'
import { Notification } from 'element-ui'

const isProduct = process.env.NODE_ENV !== 'development'
const requestBaseUrl = !isProduct ? envConfig.dev.baseApi : envConfig.prod.baseApi

const service = axios.create({
  baseURL: requestBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  timeout: 16000
})
service.interceptors.request.use(config => {
  if (typeof config.params === 'object' && Object.keys(config.params).length && Storage.getToken()) {
    config.params.access_token = Storage.getToken()
  }
  return config
}, error => {
  Promise.reject(error)
})
service.interceptors.response.use(({data}) => {
  if (data.status === 401) { // invalid token
    // Message.error({
    //   message: 'Log out of date',
    //   duration: 2500
    // })
    // setTimeout(() => {
    //   Storage.removeToken()
    //   Router.push({path: '/login'})
    // }, 3000)
    Storage.removeToken()
    Router.push({path: '/login'})
  } else if (data.status === 401) { // 419
    Notification.error({
      message: 'Permission Denied',
      duration: 1500
    })
  } else if (data.status === 511) { // 419
    Notification.error({
      message: 'System Error',
      duration: 1500
    })
  }
  return data
}, error => {
  const err = error.toString() || ''
  if (err.includes('401')) {
    Storage.removeToken()
    Router.push({path: '/login'})
  }
  Promise.reject(error)
})

const _defaults = (method, url, params, headers) => {
  const config = {
    method,
    url,
    params: ['GET', 'DELETE'].includes(method.toUpperCase()) ? params : {},
    data: ['POST', 'PUT'].includes(method.toUpperCase()) ? params : {}
  }
  if (headers) {
    config.headers = headers
  }
  return config
}
export const request = {
  axios,
  getRequestUrl (url, params = {}, needAuth = true) {
    needAuth && (params.access_token = Storage.getToken())
    return requestBaseUrl + url + (QS.stringify(params) && ('?' + QS.stringify(params)))
  },
  get (url, params = {}, headers) {
    return service(_defaults('GET', url, params, headers))
  },
  post (url, params = {}, headers) {
    return service(_defaults('post', url, params, headers))
  },
  postForm (url, params = {}, headers) {
    if (!headers) headers = {}
    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    params.access_token = Storage.getToken()
    return service(_defaults('post', url, QS.stringify(params), headers))
  },
  delete (url, params = {}, headers) {
    return service(_defaults('delete', url, params, headers))
  }
}
export default {
  install (Vue) {
    Vue.prototype.$ajax = request
  }
}
