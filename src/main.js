import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import ECharts from 'vue-echarts'
// Vue.use(ElementUI)
// import "element-ui/packages/theme-chalk/src/index.scss"
// import Icon from '@/assets/package/icon'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/component/tooltip'
import '@/assets/styles/index.scss'
import '@/assets/package/style/index.scss'
Vue.use(ElementUI)
Vue.component('v-chart', ECharts)
// Vue.use(Icon)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
