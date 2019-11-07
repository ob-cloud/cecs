/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:38:53
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-07 15:36:37
 */

import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import menu from './modules/menu'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import {getLanguage} from '@/i18n'

Vue.use(Vuex)

const state = {
  documentClientHeight: 0,
  lang: getLanguage()
}

const store = new Vuex.Store({
  modules: {
    user,
    menu
  },
  state,
  getters,
  mutations,
  actions
})

export default store
