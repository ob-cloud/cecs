/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:34:24
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-26 11:19:39
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
    return request.delete('/oauth/token/' + accessToken)
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
  getSysLogs (log = {}) {
    return request.get('/consumer/common', {
      CMD: 'get_sys_log',
      log: JSON.stringify(log)
    })
  },
  exportsLogs (beginTime, endTime) {
    return request.getRequestUrl('/consumer/facade/getExportLog', {beginTime, endTime})
  },
  getUserPrivilege () {
    return request.get('/consumer/common', {
      CMD: 'get_user_privilege'
    })
  }
}
export default SystemAPI
