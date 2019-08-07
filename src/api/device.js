/*
 * @Author: eamiear
 * @Date: 2019-08-05 17:32:41
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-07 15:14:51
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
  }
}
export default DeviceAPI
