/*
 * @Author: eamiear
 * @Date: 2019-08-05 17:32:41
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-26 11:27:46
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
  getAllBuildingDeviceList (device = {}) {
    return request.get('/consumer/common', {
      CMD: 'get_building_devices',
      user: JSON.stringify(device)
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
  },
  getOboxDeviceList (oboxdevice = {}) {
    return request.get('/consumer/common', {
      CMD: 'get_obox_device',
      oboxdevice: JSON.stringify(oboxdevice)
    })
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
  },
  getInfratedDeviceList (wifi = {}) {
    return request.get('/consumer/common', {
      CMD: 'get_wifi',
      wifi: JSON.stringify(wifi)
    })
  },
  removeInfratedDevice (deviceId) {
    return request.postForm('/consumer/common', {
      CMD: 'delete_ali_dev',
      deviceId
    })
  }
}

// 开关控制
const KeySwitchAPI = {
  setSwitchStatus (serialId, status) {
    return request.postForm('/consumer/common', {
      CMD: 'setting_node_status',
      serialId,
      status
    })
  }
}

// 空调控制
const AcControlAPI = {
  setAcAction (serialId, index, key) {
    return request.postForm('/consumer/common', {
      CMD: 'control_ir_device',
      serialId,
      index,
      keyType: 0,
      key
    })
  }
}
export default {...DeviceAPI, ...WifiDeviceAPI, ...KeySwitchAPI, ...AcControlAPI}
