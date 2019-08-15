/*
 * @Author: eamiear
 * @Date: 2019-08-05 17:32:41
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-15 18:00:19
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
  }
}
export default DeviceAPI
