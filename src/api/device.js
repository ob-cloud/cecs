/*
 * @Author: eamiear
 * @Date: 2019-08-05 17:32:41
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-05 17:41:20
 */

import {request} from '@/common/request'

const DeviceAPI = {
  login (username, password) {
    return request.post('/consumer/common', {
      CMD: 'query_device',
      start_index: 0,
      count: 10
    })
  }
}
export default DeviceAPI
