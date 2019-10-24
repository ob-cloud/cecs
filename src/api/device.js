/*
 * @Author: eamiear
 * @Date: 2019-08-05 17:32:41
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-10-17 16:22:52
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
  getCameraList () {
    return request.get('/consumer/nvr/device', {
      start_index: 1
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
  },
  searchToAddDevice (oboxId, deviceType, deviceSubType) {
    return request.postForm('/consumer/common', {
      CMD: 'search_new_device',
      obox_serial_id: oboxId,
      serialId: '',
      device_type: deviceType,
      device_child_type: deviceSubType,
      state: '02',
      timeout: 60
    })
  },
  getDeviceStatusHistory (serialId, fromDate, toDate, type = '02') {
    return request.postForm('/consumer/common', {
      CMD: 'query_device_status_history',
      serialId,
      from_data: fromDate,
      to_data: toDate,
      type
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
  setLampPower (type, serialId, status) {
    const maps = {
      '开': `ff${status.slice(2, (status.length - 1))}2`,
      '关': `00${status.slice(2, status.length - 1)}2`
    }
    return request.postForm('/consumer/common', {
      CMD: 'setting_node_status',
      serialId,
      status: maps[type]
    })
  },
  openLamp (serialId, status) {
    status = `ff${status.slice(2)}`
    return request.postForm('/consumer/common', {
      CMD: 'setting_node_status',
      serialId,
      status
    })
  },
  closeLamp (serialId, status) {
    status = `00${status.slice(2)}`
    return request.postForm('/consumer/common', {
      CMD: 'setting_node_status',
      serialId,
      status
    })
  },
  adjustBrightness (serialId, status) {

  }
}

const WifiDeviceAPI = {
  getWifiDeviceList () {
    return request.postForm('/consumer/common', {
      CMD: 'query_ali_dev'
    })
  },
  // 红外转发器下的设备
  getTransponderDevice (serialId) {
    return request.get('/consumer/common', {
      CMD: 'query_ir_device',
      serialId
    })
  }
}

const RemotDeviceAPI = {
  getRemoter () {
    return request.postForm('/consumer/common', {
      CMD: 'query_remoter'
    })
  }
}

const KeySwitchAPI = {
  setSwitchStatus (serialId, status) {
    return request.postForm('/consumer/common', {
      CMD: 'setting_node_status',
      serialId,
      status
    })
  }
}
export default {...DeviceAPI, ...doorLock, ...LampAPI, ...WifiDeviceAPI, ...RemotDeviceAPI, ...KeySwitchAPI}
