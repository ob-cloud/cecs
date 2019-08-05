/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:36:47
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-02-10 17:37:58
 */

import {UPDATE_DOCUMENT_CLIENT_HEIGHT} from './mutation-types'

export default {
  [UPDATE_DOCUMENT_CLIENT_HEIGHT] (state, height) {
    state.documentClientHeight = height
  }
}
