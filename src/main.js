import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
// Vue.use(ElementUI)
// import "element-ui/packages/theme-chalk/src/index.scss"
// import Icon from '@/assets/package/icon'
import '@/assets/styles/index.scss'
Vue.use(ElementUI)
// Vue.use(Icon)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
