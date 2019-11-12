import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n/index'
import ElementUI from 'element-ui'
import ECharts from 'vue-echarts'
import '@/assets/styles/index.scss'
import '@/assets/package/style/index.scss'
import isPermited from '@/directives/permission'
import {$isPermited} from '@/directives/permission/button'
import {submenu} from '@/router/menu'
Vue.prototype.$isPermited = $isPermited
Vue.prototype.$submenu = submenu
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.component('v-chart', ECharts)
Vue.use(isPermited)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
