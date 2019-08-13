/*
 * @Author: eamiear
 * @Date: 2019-08-07 16:43:10
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-13 16:12:42
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
  },
  getRoomSceneList (params) {
    return request.get('/consumer/common', {
      CMD: 'query_scene_location',
      start: params.pageNo,
      count: params.pageSize,
      location: params.room
    })
  },
  createRoom (params) {
    return request.get('/consumer/common', {
      CMD: 'create_location',
      action: '01',
      building: params.room,
      room: params.room,
      layer: params.layer
    })
  },
  editRoom (params) {

  },
  deleteRoom (params) {
    return request.get('/consumer/common', {
      CMD: 'create_location',
      action: '00',
      building: params.room,
      room: params.room,
      layer: params.layer
    })
  }
}
export default RoomAPI
