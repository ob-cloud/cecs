/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:24:22
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-07 17:53:58
 */

export default [
  {
    name: '/device/index.html',
    path: '/device/index.html',
    desc: '设备管理',
    component: () => import('views/device/index.vue')
  }, {
    name: '/scene/index.html',
    path: '/scene/index.html',
    desc: '场景管理',
    component: () => import('views/scene/index.vue')
  }, {
    name: '/room/index.html',
    path: '/room/index.html',
    desc: '房间管理',
    component: () => import('views/room/index.vue')
  }, {
    name: '/obox/index.html',
    path: '/obox/index.html',
    desc: 'OBOX管理',
    component: () => import('views/obox/index.vue')
  }
]
