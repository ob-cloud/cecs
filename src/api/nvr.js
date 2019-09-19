import {request} from '@/common/request'

const NVRAPI = {
  // getNvrHisotryList () {
  //   return request.axios.get('http://192.168.200.254:8401/test/getNvrRecode')
  // }
  createNvrRecord (nvr) {
    return request.postForm('/consumer/nvr', {
      ...nvr
    })
  },
  removeNvrRecord (serialId) {
    return request.delete('/consumer/nvr', {
      serialId
    })
  },
  getNvrList (ip, name, serialId, pageNo, pageSize) {
    return request.get('/consumer/nvr', {
      ip,
      name,
      serialId,
      pageNo,
      pageSize
    })
  },
  getNvrHisotryList () {
    return request.get('/consumer/common', {
      CMD: 'query_local_nvr'
    })
  },
  remove (id) {
    return request.post('/consumer/common', {
      CMD: 'query_local_nvr',
      id
    })
  }
}
export default NVRAPI
