/*
 * @Author: eamiear
 * @Date: 2019-02-19 10:38:33
 * @Last Modified by:   eamiear
 * @Last Modified time: 2019-02-19 10:38:33
 */

const _toString = Object.prototype.toString

export const Helper = {
  isObject (obj) {
    return obj !== null && typeof obj === 'object'
  },
  isArray (arr) {
    return _toString.call(arr) === '[object Array]'
  },
  sort (val) {
    const keys = Object.keys(val).sort()
    const sortParam = {}
    keys.forEach(key => {
      sortParam[key] = val[key]
    })
    return sortParam
  },
  deepSort (params) {
    for (const k in params) {
      if (this.isArray(params[k])) { // 数组
        for (let i = 0; i < params[k].length; i++) {
          if (this.isObject(params[k][i])) {
            params[k][i] = this.deepSort(params[k][i])
          }
        }
      } else if (this.isObject(params[k])) { // JSON
        params[k] = this.deepSort(params[k])
      }
    }
    return this.sort(params)
  },
  deepClone (source) {
    if (!source && typeof source !== 'object') {
      throw new Error('error arguments', 'shallowClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    for (const keys in source) {
      if (source.hasOwnProperty(keys)) {
        if (source[keys] && typeof source[keys] === 'object') {
          targetObj[keys] = source[keys].constructor === Array ? [] : {}
          targetObj[keys] = this.deepClone(source[keys])
        } else {
          targetObj[keys] = source[keys]
        }
      }
    }
    return targetObj
  },
  param2Obj (url) {
    const search = url.split('?')[1]
    if (!search) {
      return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
  },
  getRouteNameByUrl (url) {
    const val = /.*\/(.*)\.html/.exec(url)
    return val && val.length >= 1 ? val[1] : ''
  },
  getRequest (name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    const path = window.location.href
    const r = path.slice(path.indexOf('?') + 1).match(reg)
    return (r && r.length) && r[2]
  }
}
