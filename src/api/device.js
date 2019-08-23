/*
 * @Author: eamiear
 * @Date: 2019-08-05 17:32:41
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-23 11:14:36
 */

import {request} from '@/common/request'

const DeviceAPI = {
  getDeviceList (params) {
    const page = params.pageNo
    const pageSize = params.pageSize
    delete params.pageNo
    delete params.pageSize
    return request.get('/consumer/common', {
      CMD: 'query_device',
      start_index: page,
      count: pageSize,
      ...params
    })
  },
  getOboxList (page = 0, pageSize = 300) {
    return request.get('/consumer/common', {
      CMD: 'query_obox',
      start_index: page,
      count: pageSize
    })
  },
  getDeviceOperationHistory (params) {
    return request.get('/consumer/common', {
      CMD: 'query_device_status_history',
      serialId: params.serialId,
      type: '00',
      start: params.pageNo,
      count: params.pageSize
    })
  },
  modifyDeviceName (serialId, name) {
    return request.postForm('/consumer/common', {
      CMD: 'modify_device',
      serialId,
      operate_type: '01',
      name
    })
  },
  removeDevice (serialId, name) {
    return request.postForm('/consumer/common', {
      CMD: 'modify_device',
      serialId,
      operate_type: '00',
      name
    })
  }
}
const doorLock = {
  getDoorLockList (serialId) {
    return request.postForm('/consumer/common', {
      CMD: 'query_intelligent_fingerHome',
      serialId
    })
  },
  getDoorLockOpenRecord (serialId) {
    return request.postForm('/consumer/common', {
      CMD: 'query_intelligent_openRecord',
      serialId
    })
  },
  getDoorLockAlarmRecord (serialId) {
    return request.postForm('/consumer/common', {
      CMD: 'query_intelligent_warningRecord',
      serialId
    })
  },
  getDoorLockUserList (serialId) {
    return request.postForm('/consumer/common', {
      CMD: 'query_intelligent_useringRecord',
      serialId
    })
  },
  /**
  * @param {*} params
  * params.serialId
  * params.pin
  * params.nickName
  * params.mobile
  * params.validateCode
  */
  updateDoorLockUserInfo (params) {
    return request.postForm('/consumer/common', {
      CMD: 'edit_intelligent_user',
      ...params
    })
  },
  /**
   *
   * @param {*} params
   * params.pin
   * params.mobile
   */
  getDoorLockCaptcha (params) {
    return request.postForm('/consumer/common', {
      CMD: 'end_intelligent_validateCode',
      ...params
    })
  }
}

const LampAPI = {
  openLamp () {

  }
}

const WifiDeviceAPI = {
  getWifiDeviceList () {
    return request.postForm('/consumer/common', {
      CMD: 'query_ali_dev'
    })
  }
}
export default {...DeviceAPI, ...doorLock, ...LampAPI, ...WifiDeviceAPI}
