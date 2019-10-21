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
    // return request.post({
    //   url: 'user/create',
    //   params
    // })
    return request.postForm('/consumer/common', {
      CMD: 'delete_room',
      room: JSON.stringify({id})
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

const RoleAPI = {
  getRoleList (status, roleName) {
    return request.postForm('/consumer/common', {
      CMD: 'get_smart_role',
      role: JSON.stringify({status, roleName})
    })
  },
  createRole (roleName, privilegeWeight, parentPrivilegeWeight) {
    return request.postForm('/consumer/common', {
      CMD: 'add_smart_role',
      role: JSON.stringify({roleName, privilegeWeight, parentPrivilegeWeight})
    })
  },
  updateRole (roleId, roleName, privilegeWeight, parentPrivilegeWeight) {
    return request.postForm('/consumer/common', {
      CMD: 'update_smart_role',
      role: JSON.stringify({roleId, roleName, privilegeWeight, parentPrivilegeWeight})
    })
  },
  deleteRole (roleId) {
    return request.postForm('/consumer/common', {
      CMD: 'delete_smart_role',
      role: JSON.stringify({roleId})
    })
  }
}
export default {...UserAPI, ...RoleAPI}
