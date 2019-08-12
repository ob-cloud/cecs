/*
 * @Author: eamiear
 * @Date: 2019-08-07 16:43:10
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-12 16:32:08
 */

import {request} from '@/common/request'

const RoomAPI = {
  getRoomList (params) {
    const page = params.pageNo
    const pageSize = params.pageSize
    delete params.pageNo
    delete params.pageSize
    return request.get('/consumer/common', {
      CMD: 'query_location',
      start: page,
      count: pageSize,
      ...params
    })
  },
  getRoomDeviceList (params) {
    return request.get('/consumer/common', {
      CMD: 'query_device_location',
      start: params.pageNo,
      count: params.pageSize,
      location: params.room
    })
  }
}
export default RoomAPI
