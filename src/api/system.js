/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:34:24
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-05 15:56:17
 */

import {request} from '@/common/request'
import qs from 'qs'
import md5 from 'md5'

const SystemAPI = {
  login (username, password) {
    return request.post('/oauth/token', qs.stringify({password: md5(btoa(password) + password), username, grant_type: 'password'}), {
      Authorization: 'Basic d2ViQXBwOndlYkFwcA==',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'cache-control': 'no-cache'
    })
  },
  logout (accessToken) {
    return request.post({
      url: 'logout',
      params: {accessToken}
    })
  },
  reNewAcessToken (oldAccessToken) {
    return request.post({
      url: 'renewToken',
      params: {accessToken: oldAccessToken}
    })
  },
  resetPassword (params) {
    return request.post({
      url: 'resetPassword',
      params
    })
  },
  // 获取七牛token
  getQiniuToken () {
    return request.post({
      url: 'getQiniuToken'
    })
  },
  /**
   * 根据key获取七牛图片访问url
   * @param {String} key 七牛key
   */
  getReqUrlByQiniuKey (key) {
    return request.post({
      url: 'qiniu/url',
      params: {key}
    })
  }
}
export default SystemAPI
