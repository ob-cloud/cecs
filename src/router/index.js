/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:10:12
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-05 17:03:52
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Storage from '@/common/cache'
import menuRouters from './modules'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: menuRouters
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (Storage.getToken()) {
    store.dispatch('generateNavibarMenu')
    to.path === '/login' ? next({ path: '/' }) : next()
  } else {
    to.path.includes('/login') ? next() : next({ path: '/login' })
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

export default router
