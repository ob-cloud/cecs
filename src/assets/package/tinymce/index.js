/**
 * Created by skz on 2018/3/12 11:23
 */

import TinymceEditor from './src/tinymce-editor'
import TinymceSetting from './src/setting'

TinymceEditor.install = function (Vue) {
  Vue.component(TinymceEditor.name, TinymceEditor)
}
export {TinymceEditor, TinymceSetting}
export default TinymceEditor
