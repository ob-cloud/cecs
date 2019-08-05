/*
 * @Author: eamiear
 * @Date: 2019-08-05 11:26:26
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-05 11:38:04
 */

import common from './common'
import navlist from './navlist'
const menuRoutes = {
  name: 'home',
  path: '/',
  desc: '首页',
  component: () => import('views/layout/Layout.vue'),
  redirect: { path: '/device/index.html' },
  children: [
    ...navlist,
    ...common
  ]
}

export default [
  {
    name: 'login',
    path: '/login',
    desc: '登录页',
    component: () => import('views/login/index.vue')
  },
  menuRoutes,
  {
    path: '*',
    redirect: '/404'
  }
]
