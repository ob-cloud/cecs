/*
 * @Author: eamiear
 * @Date: 2019-02-06 18:36:28
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-02-20 11:37:30
 */

export default {
  token: state => state.user.token,
  uid: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  userInfo: state => state.user.userInfo,
  navbarMenus: state => state.menu.navbarMenus,
  sysMenuList: state => state.menu.sysMenuList,
  sidebarMenuList: state => state.menu.sidebarMenuList,
  documentClientHeight: state => state.documentClientHeight
}
