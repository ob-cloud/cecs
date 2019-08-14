/*
 * @Author: eamiear
 * @Date: 2019-08-07 16:43:10
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-14 17:58:34
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
    return request.postForm('/consumer/common', {
      CMD: 'query_device_location',
      start: params.pageNo,
      count: params.pageSize,
      location: params.room
    })
  },
  getRoomSceneList (params) {
    return request.postForm('/consumer/common', {
      CMD: 'query_scene_location',
      start: params.pageNo,
      count: params.pageSize,
      location: params.room
    })
  },
  createRoom (params) {
    return request.postForm('/consumer/common', {
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
      location: params.location,
      building: params.room,
      room: params.room,
      layer: params.layer
    })
  },
  // 添加设备到房间
  setRoomDevice (params) {
    return request.post('/consumer/common', {
      CMD: 'set_device_location',
      action: '01',
      serialId: params.serialId,
      location: params.location
    })
  },
  deleteRoomDevice (params) {
    return request.post('/consumer/common', {
      CMD: 'set_device_location',
      action: '00',
      serialId: params.serialId,
      location: params.location
    })
  },
  // 绑定场景到房间
  setRoomScene (params) {
    return request.postForm('/consumer/common', {
      CMD: 'set_scene_location',
      action: '01',
      scene_number: params.scene_number,
      location: params.location
    })
  },
  // 删除房间场景
  deleteRoomScene (params) {
    return request.post('/consumer/common', {
      CMD: 'set_scene_location',
      action: '00',
      scene_number: params.scene_number,
      location: params.location
    })
  }
}
export default RoomAPI
