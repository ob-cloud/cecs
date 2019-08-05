/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:05:07
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-02-10 17:35:53
 */

const common = [
  {
    name: '/401',
    path: '/401',
    desc: '401',
    component: () => import('@/views/pages/401.vue')
  }, {
    name: '/404',
    path: '/404',
    desc: '404页面',
    component: () => import('@/views/pages/404.vue')
  }
]

export default common
