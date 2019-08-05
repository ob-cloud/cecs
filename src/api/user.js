import {request} from '@/common/request'

const UserAPI = {
  getUserInfo (uid) {
    return request.post({
      url: 'user/info',
      params: {uid}
    })
  },
  fetchUserList (params = {}) {
    return request.post({
      url: 'user/list',
      params
    })
  },
  createUser (params) {
    return request.post({
      url: 'user/create',
      params
    })
  },
  enableUser (uid) {
    return request.post({
      url: 'user/enable',
      params: {uid}
    })
  },
  disableUser (uid) {
    return request.post({
      url: 'user/disable',
      params: {uid}
    })
  }
}
export default UserAPI
