import axios from 'axios'
// import QS from 'qs'
import Storage from '@/common/cache'
import Router from '@/router'
import envConfig from '@/common/config'

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
  if (typeof config.data === 'object' && Storage.getToken()) {
    config.data.access_token = Storage.getToken()
  }

  return config
}, error => {
  Promise.reject(error)
})
service.interceptors.response.use(({data}) => {
  if (data.code === 1002) { // invalid token
    Storage.remove('token')
    Router.push({path: '/login'})
  }
  return data
}, error => {
  Promise.reject(error)
})

const _defaults = (method, url, params, headers) => {
  const config = {
    params: (['GET', 'DELETE'].includes(method.toUpperCase()) && params),
    data: (['POST', 'PUT'].includes(method.toUpperCase()) && params)
  }
  return {
    method,
    url,
    ...config,
    headers
  }
}
export const request = {
  getRequestUrl (url) {
    return requestBaseUrl + url
  },
  get (url, params = {}, headers) {
    return service(_defaults('GET', url, params, headers))
  },
  post (url, params = {}, headers) {
    return service(_defaults('post', url, params, headers))
  }
}
export default {
  install (Vue) {
    Vue.prototype.$ajax = request
  }
}
