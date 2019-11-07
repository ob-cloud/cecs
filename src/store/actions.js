/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:36:55
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-07 15:10:26
 */

export default {
  updateDocumentClientHeight ({commit}, height) {
    commit('UPDATE_DOCUMENT_CLIENT_HEIGHT', height)
  },
  setLang ({commit}, lang) {
    commit('SET_LANG', lang)
  }
}
