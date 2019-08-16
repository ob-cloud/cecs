/*
 * @Author: eamiear
 * @Date: 2019-08-05 17:32:41
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-16 16:15:01
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
export default DeviceAPI
