import {request} from '@/common/request'

const UserAPI = {
  getUserInfo (uid) {
    return request.post({
      url: 'user/info',
      params: {uid}
    })
  },
  getUserList (user = {}) {
    return request.get('/consumer/common', {
      CMD: 'get_smart_user',
      user: JSON.stringify(user)
    })
  },
  createUser (user = {}) {
    return request.postForm('/consumer/common', {
      CMD: 'add_smart_user',
      user: JSON.stringify(user)
    })
  },
  updateUser (user = {}) {
    return request.postForm('/consumer/common', {
      CMD: 'update_smart_user',
      user: JSON.stringify(user)
    })
  },
  deleteUser (userId) {
    return request.postForm('/consumer/common', {
      CMD: 'delete_smart_user',
      user: JSON.stringify({userId})
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
  getRoleList (role = {}) {
    return request.get('/consumer/common', {
      CMD: 'get_smart_role',
      role: JSON.stringify(role)
    })
  },
  createRole (role = {}) {
    return request.postForm('/consumer/common', {
      CMD: 'add_smart_role',
      role: JSON.stringify(role)
    })
  },
  updateRole (role = {}) {
    return request.postForm('/consumer/common', {
      CMD: 'update_smart_role',
      role: JSON.stringify(role)
    })
  },
  updateRoleStatus (roleId, status) {
    return request.postForm('/consumer/common', {
      CMD: 'update_smart_role_status',
      role: JSON.stringify({roleId, status})
    })
  },
  deleteRole (roleId) {
    return request.postForm('/consumer/common', {
      CMD: 'delete_smart_role',
      role: JSON.stringify({roleId})
    })
  },
  getPrivilege () {
    return request.get('/consumer/common', {
      CMD: 'get_smart_privilege'
    })
  }
}

// const AccountAPI = {

// }
export default {...UserAPI, ...RoleAPI}
