/*
 * @Author: eamiear
 * @Date: 2019-08-07 16:43:21
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-07 17:52:58
 */

import {request} from '@/common/request'

const OboxAPI = {
  getOboxList (params) {
    const page = params.pageNo
    const pageSize = params.pageSize
    delete params.pageNo
    delete params.pageSize
    return request.get('/consumer/common', {
      CMD: 'query_obox',
      start: page,
      count: pageSize,
      ...params
    })
  },
  deleteObox (oboxSerialId) {
    return request.postForm('/consumer/common', {
      CMD: 'delete_obox',
      obox_serial_id: oboxSerialId,
      fForce_delete: '00'
    })
  }
}
export default OboxAPI
