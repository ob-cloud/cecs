import {
  SET_MENU_NAV_LIST,
  SET_SYS_MENU_LIST,
  UPDATE_MENU_NAV_ACTIVE_NAME,
  SET_SIDEBAR_MENU_LIST,
  UPDATE_SIDEBAR_MENU_ACTIVE_NAME
} from '../mutation-types'

import { navMenuList } from '@/router/menu'
import store from '@/store'

const menu = {
  state: {
    menuNavActiveName: '',
    navbarMenus: [],
    sysMenuList: [],
    sidebarMenuActiveName: '',
    sidebarMenuList: []
  },
  mutations: {
    [SET_MENU_NAV_LIST] (state, navbarMenus) {
      state.navbarMenus = navbarMenus
    },
    [SET_SYS_MENU_LIST] (state, sysMenuList) {
      state.sysMenuList = sysMenuList
    },
    [UPDATE_MENU_NAV_ACTIVE_NAME] (state, menuNavActiveName) {
      state.menuNavActiveName = menuNavActiveName
    },
    [SET_SIDEBAR_MENU_LIST] (state, sidebarMenuList) {
      state.sidebarMenuList = sidebarMenuList
    },
    [UPDATE_SIDEBAR_MENU_ACTIVE_NAME] (state, sidebarMenuActiveName) {
      state.sidebarMenuActiveName = sidebarMenuActiveName
    }
  },
  actions: {
    generateNavibarMenu ({ commit }) {
      return new Promise(resolve => {
        commit('SET_MENU_NAV_LIST', navMenuList)
        const path = location.href.slice(location.href.indexOf('#') + 1, location.href.lastIndexOf('?'))
        const defaultMenu = navMenuList.find(item => item.path === path) || navMenuList[0]
        commit('UPDATE_MENU_NAV_ACTIVE_NAME', defaultMenu.path)
        store.dispatch('getUserInfo').then(userInfo => {
          resolve(userInfo)
        })
      })
    },
    // generatesystemMenu ({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_SYS_MENU_LIST', systemtMenus)
    //     resolve(systemtMenus)
    //   })
    // },
    updateMenuNavActiveName ({ commit }, activeName) {
      commit('UPDATE_MENU_NAV_ACTIVE_NAME', activeName)
    }
  }
}

export default menu
