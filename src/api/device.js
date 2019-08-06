/*
 * @Author: eamiear
 * @Date: 2019-08-05 17:32:41
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-06 15:07:33
 */

import {request} from '@/common/request'

const DeviceAPI = {
  getDeviceList (page = 0, pageSize = 10) {
    return request.get('/consumer/common', {
      CMD: 'query_device',
      start_index: 0,
      count: 10
    })
  }
}
export default DeviceAPI
