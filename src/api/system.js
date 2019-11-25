/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:34:24
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-20 10:42:39
 */

import {request} from '@/common/request'
import qs from 'qs'

const SystemAPI = {
  login (username, password) {
    return request.post('/oauth/token', qs.stringify({password, username, grant_type: 'password'}), {
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
  resetPassword (pwd = {}) {
    return request.get('/consumer/common', {
      CMD: 'reset_smarthome_pwd',
      pwd: JSON.stringify(pwd)
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
  },
  getSysLogs (log = {}) {
    // return request.postForm('/consumer/common', {
    //   CMD: 'get_sys_log',
    //   log: JSON.stringify(log)
    // })
    return request.get('/consumer/common', {
      CMD: 'get_sys_log',
      log: JSON.stringify(log)
    })
  },
  exportsLogs (beginTime, endTime) {
    return request.getRequestUrl('/consumer/facade/getExportLog', {beginTime, endTime})
    // return request.postForm('consumer/facade/getExportLog', {
    //   beginTime, endTime
    // })
  },
  getUserPrivilege () {
    return request.get('/consumer/common', {
      CMD: 'get_user_privilege'
    })
  }
}
export default SystemAPI
