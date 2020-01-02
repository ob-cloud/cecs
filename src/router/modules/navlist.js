/*
 * @Author: eamiear
 * @Date: 2019-02-06 21:24:22
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-11-28 15:00:05
 */

export default [
  {
    name: '/device/index.html',
    path: '/device/index.html',
    desc: '设备管理',
    meta: {title: 'devicemgr'},
    component: () => import('views/device/index.vue')
  }, {
    name: '/scene/index.html',
    path: '/scene/index.html',
    desc: '场景管理',
    meta: {title: 'scenemgr'},
    component: () => import('views/scene/index.vue')
  }, {
    name: '/room/index.html',
    path: '/room/index.html',
    desc: '教室管理',
    meta: {title: 'roommgr'},
    component: () => import('views/room/index.vue')
  }, {
    name: '/system/logs.html',
    path: '/system/logs.html',
    desc: '日志管理',
    meta: {title: 'logmgr'},
    component: () => import('views/system/logs.vue')
  }, {
    name: '/system/user.html',
    path: '/system/user.html',
    desc: '用户管理',
    meta: {title: 'usrmgr'},
    component: () => import('views/system/user.vue')
  }
]
