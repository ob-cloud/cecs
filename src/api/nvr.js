import {request} from '@/common/request'

const NVRAPI = {
  // getNvrHisotryList () {
  //   return request.axios.get('http://192.168.200.254:8401/test/getNvrRecode')
  // }
  getNvrHisotryList () {
    return request.get('/consumer/common', {
      CMD: 'query_local_nvr'
    })
  },
  getNvrVideoUrl (beginTime, endTime) {
    request.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    return request.axios.post('http://localhost:8080/api/video/v1/cameras/playbackURLs', {
      beginTime,
      endTime
    })
  }
}
export default NVRAPI
