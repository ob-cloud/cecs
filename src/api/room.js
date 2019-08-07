
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
  }
}
export default RoomAPI
