/*
 * @Author: eamiear
 * @Date: 2019-02-19 10:38:07
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-06 17:58:05
 */

import { USER_TOKEN_KEY } from '@/common/constants'
class Cacher {
  constructor (strategy) {
    this.strategy = strategy || 'localStorage'
  }
  setStrategy (strategy) {
    this.strategy = strategy
    return this
  }
  set (key, value) {
    window[this.strategy].setItem(key, value)
    return this
  }
  get (key) {
    return window[this.strategy].getItem(key)
  }
  remove (key) {
    window[this.strategy].removeItem(key)
    return this
  }
  clear () {
    window[this.strategy].clear()
    return this
  }
}
export const cacher = new Cacher()
// export const Cacher = {
//   set (key, value) {
//     localStorage.setItem(key, value)
//   },
//   get (key) {
//     return localStorage.getItem(key)
//   },
//   remove (key) {
//     return localStorage.removeItem(key)
//   },
//   clear () {
//     return localStorage.clear()
//   }
// }

const Storage = {
  setToken (value) {
    cacher.set(USER_TOKEN_KEY, value)
  },
  getToken () {
    return cacher.get(USER_TOKEN_KEY)
  },
  removeToken () {
    cacher.remove(USER_TOKEN_KEY)
  }
}

export default Storage
