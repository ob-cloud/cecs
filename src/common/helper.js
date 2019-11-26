/*
 * @Author: eamiear
 * @Date: 2019-02-19 10:38:33
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-26 11:32:58
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
  },
  nextTick (fn) {
    fn && this.$nextTick(fn)
  },
  calculateTableHeight (hasPagination = true, hasGap = true) {
    const winH = document.body.clientHeight
    const navH = 50
    const tableHeader = document.querySelector('.el-table-plus__header')
    const searchBarH = (tableHeader && tableHeader.clientHeight) || 0
    const paginationH = hasPagination ? 60 : 0
    return winH - navH - searchBarH - paginationH - (hasGap ? 50 : 0)
  },
  calculateContainerHeight () {
    const winH = document.body.clientHeight
    const navH = 50
    const breadcrumb = 45
    return winH - navH - breadcrumb
  },
  windowOnResize (context, fn) {
    setTimeout(() => {
      this.nextTick.call(context, fn)
      window.onresize = () => {
        return (() => {
          this.nextTick.call(context, fn)
        })()
      }
    }, 0)
  },
  parseTime (time, fmt) {
    if (arguments.length === 0) {
      return null
    }
    const format = fmt || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return timeStr
  },
  formatBuildingTree (areaList) {
    if (!areaList || !areaList.length) return
    return areaList.map(area => {
      const building = {
        id: area.buildingId,
        name: area.buildingName,
        children: []
      }
      building.children = Array.from(area.floors).map(flo => {
        const floor = {
          id: flo.floorId,
          name: flo.floorName,
          children: []
        }
        floor.children = Array.from(flo.rooms).map(r => {
          return {
            id: r.roomId,
            name: r.roomName
          }
        })
        return floor
      })
      return building
    })
  },
  isMobile (s) {
    // return /^1[0-9]{10}$/.test(s)
    return /[0-9]{6,}/.test(s)
  },
  isValidUser (s) { // 字母数字_
    return /^\D.?[a-zA-Z\d_]{5,}/.test(s)
  },
  isValidAccount (s) {
    return /^[a-zA-Z0-9_]+$/.test(s)
  },
  seti18nSystemTitle (title) {
    document.title = title
  //   const getLanguage = () => {
  //     const language = (navigator.language || navigator.browserLanguage)
  //     const languages = {
  //       'en-US': 'Campus Energy Conservation Central Control Platform',
  //       'zh-CN': '校园节能中控平台',
  //       'zh-TW': '校園節能中控平台'
  //     }
  //     const locales = Object.keys(languages)
  //     for (const locale of locales) {
  //       if (language.indexOf(locale) > -1) {
  //         return languages[locale]
  //       }
  //     }
  //     return languages['zh-TW']
  //   }
  //   window.onload = () => {
  //     document.title = getLanguage()
  //   }
  }
}

export default Helper
