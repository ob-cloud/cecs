/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:24:22
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-10-29 14:58:37
 */

export default [
  {
    name: '/device/index.html',
    path: '/device/index.html',
    desc: '设备管理',
    meta: {title: '设备管理'},
    component: () => import('views/device/index.vue')
  }, {
    name: '/scene/index.html',
    path: '/scene/index.html',
    desc: '场景管理',
    meta: {title: '场景管理'},
    component: () => import('views/scene/index.vue')
  }, {
    name: '/room/index.html',
    path: '/room/index.html',
    desc: '房间管理',
    meta: {title: '房间管理'},
    component: () => import('views/room/index.vue')
  }, {
    name: '/obox/index.html',
    path: '/obox/index.html',
    desc: 'OBOX管理',
    meta: {title: 'OBOX管理'},
    component: () => import('views/obox/index.vue')
  }, {
    name: '/nvr/index.html',
    path: '/nvr/index.html',
    desc: 'NVR管理',
    meta: {title: 'NVR管理'},
    component: () => import('views/nvr/index.vue')
  }, {
    name: '/system/logs.html',
    path: '/system/logs.html',
    desc: '日志管理',
    meta: {title: '日志管理'},
    component: () => import('views/system/logs.vue')
  }, {
    name: '/room/map.html',
    path: '/room/map.html',
    desc: '电子地图',
    meta: {title: '电子地图'},
    component: () => import('views/room/map.vue')
  }, {
    name: '/system/user.html',
    path: '/system/user.html',
    desc: '用户管理',
    meta: {title: '用户管理'},
    component: () => import('views/system/user.vue')
  }
]
