import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Formatter from './formatter'
import zhCNLocale from './locale/zh-CN'
import zhTWLocale from './locale/zh-TW'

Vue.use(VueI18n)

const locale = 'zh-TW' // default locale
const formatter = new Formatter({ locale })

export default new VueI18n({
  locale,
  formatter,
  messages: {
    'zh-CN': zhCNLocale,
    'zh-TW': zhTWLocale
  }
})
