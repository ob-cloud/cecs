/*
 * @Author: eamiear
 * @Date: 2019-08-07 15:19:34
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-15 10:57:19
 */

import {request} from '@/common/request'

const SceneAPI = {
  getSceneList (params) {
    const page = params.pageNo
    const pageSize = params.pageSize
    delete params.pageNo
    delete params.pageSize
    return request.get('/consumer/common', {
      CMD: 'query_scenes',
      start: page,
      count: pageSize,
      ...params
    })
  },
  executeScene (sceneStatus, sceneNumber) {
    return request.postForm('/consumer/common', {
      CMD: 'execute_sc',
      scene_status: sceneStatus,
      scene_number: sceneNumber
    })
  }
}
export default SceneAPI
