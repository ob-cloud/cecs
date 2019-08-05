/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:37:25
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-05 17:04:36
 */

import {
  SET_TOKEN,
  SET_UID,
  SET_INTRODUCTION,
  SET_NAME,
  SET_AVATAR,
  SET_USER_INFO
} from '../mutation-types'
// import UserAPI from '@/api/user'
import SystemAPI from '@/api/system'
import Storage from '@/common/cache'

const user = {
  state: {
    user: '',
    token: Storage.getToken(),
    name: '',
    avatar: '',
    introduction: '',
    userInfo: null
  },
  mutations: {
    [SET_TOKEN] (state, token) {
      state.token = token
    },
    [SET_UID] (state, uid) {
      state.uid = uid
    },
    [SET_INTRODUCTION] (state, introduction) {
      state.introduction = introduction
    },
    [SET_NAME] (state, name) {
      state.name = name
    },
    [SET_AVATAR] (state, avatar) {
      state.avatar = avatar
    },
    [SET_USER_INFO] (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    loginByAccount ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        SystemAPI.login(userInfo.account.trim(), userInfo.password).then(data => {
          if (data) {
            const token = data.access_token
            Storage.setToken(token)
            commit('SET_TOKEN', token)
            commit('SET_NAME', userInfo.account.trim())
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    getUserInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // UserAPI.getUserInfo(state.uid).then(data => {
        //   const userData = data.data
        //   if (data.code === 0) {
        //     commit('SET_USER_INFO', userData)
        //     commit('SET_NAME', userData.userName || userData.nickname)
        //     commit('SET_AVATAR', userData.portrait)
        //     commit('SET_INTRODUCTION', userData.introduction)
        //   } else {
        //     console.log(data)
        //   }
        //   resolve(userData)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 登出
    logOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        SystemAPI.logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_UID', '')
          commit('SET_USER_INFO', null)
          Storage.remove('token')
          Storage.remove('uid')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    renewToken ({ commit }, accessToken) {
      return new Promise(resolve => {
        SystemAPI.reNewAcessToken(accessToken).then(({ data }) => {
          const result = data
          const renewRes = result.data
          if (result.code === 0) {
            const token = renewRes.accessToken
            Storage.setToken(token)
            commit('SET_TOKEN', token)
          }
          resolve()
        })
      })
    }
  }
}

export default user
