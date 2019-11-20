/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:36:47
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-20 16:18:07
 */
import {cacher} from '@/common/cache'
import {UPDATE_DOCUMENT_CLIENT_HEIGHT, SET_LANG} from './mutation-types'

export default {
  [UPDATE_DOCUMENT_CLIENT_HEIGHT] (state, height) {
    state.documentClientHeight = height
  },
  [SET_LANG] (state, lang) {
    state.lang = lang
    cacher.setStrategy('localStorage').set('language', lang)
  }
}
