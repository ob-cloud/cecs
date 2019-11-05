import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n/index'
import ElementUI from 'element-ui'
import ECharts from 'vue-echarts'
import '@/assets/styles/index.scss'
import '@/assets/package/style/index.scss'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.component('v-chart', ECharts)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
