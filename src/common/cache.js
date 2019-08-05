/*
 * @Author: eamiear
 * @Date: 2019-02-19 10:38:07
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-05 17:02:49
 */

import { USER_TOKEN_KEY } from '@/common/constants'
export const Cacher = {
  set (key, value) {
    localStorage.setItem(key, value)
  },
  get (key) {
    return localStorage.getItem(key)
  },
  remove (key) {
    return localStorage.removeItem(key)
  },
  clear () {
    return localStorage.clear()
  }
}

const Storage = {
  setToken (value) {
    Cacher.set(USER_TOKEN_KEY, value)
  },
  getToken () {
    return Cacher.get(USER_TOKEN_KEY)
  },
  removeToken () {
    Cacher.remove(USER_TOKEN_KEY)
  }
}

export default Storage
