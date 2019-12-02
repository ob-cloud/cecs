import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Formatter from './formatter'
import {cacher} from '@/common/cache'
import zhCNLocale from './locale/zh-CN'
import zhTWLocale from './locale/zh-TW'

Vue.use(VueI18n)

const messages = {
  'zh-CN': zhCNLocale,
  'zh-TW': zhTWLocale
}
export function getLanguage () {
  const lang = cacher.setStrategy('localStorage').get('language')
  if (lang) return lang

  // const language = (navigator.language || navigator.browserLanguage)
  // const locales = Object.keys(messages)
  // for (const locale of locales) {
  //   if (language.indexOf(locale) > -1) {
  //     return locale
  //   }
  // }
  return 'zh-TW'
}

const locale = getLanguage() // default locale
const formatter = new Formatter({ locale })

export default new VueI18n({
  locale,
  formatter,
  messages
})
