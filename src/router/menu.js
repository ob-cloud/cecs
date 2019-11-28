export const navMenuList = [
  {
    id: 26,
    name: '房间管理',
    path: '/room/index.html'
  }, {
    id: 24,
    name: '设备管理',
    default: true,
    path: '/device/index.html'
  }, {
    id: 25,
    name: '场景管理',
    path: '/scene/index.html'
  }, {
    id: 29,
    name: '用户管理',
    path: '/system/user.html'
  }, {
    id: 30,
    name: '日志管理',
    path: '/system/logs.html'
  }
]

export const privRoomSubMenu = [{id: 50, name: 'map'}, {id: 45, name: 'room'}, {id: 415, name: 'building'}, {id: 425, name: 'floor'}]
export const privDevSubMenu = [{id: 31, name: 'obox'}, {id: 311, name: 'wifi'}, {id: 47, name: 'gateway'}]
export const privUsrSubMenu = [{id: 51, name: 'account'}, {id: 57, name: 'role'}]
export const privLogSubMenu = [{id: 55, name: 'logrecords'}, {id: 56, name: 'exportrecords'}]
export const submenu = {
  map: 50,
  room: 45,
  building: 415,
  floor: 425,
  obox: 31,
  wifi: 311,
  gateway: 47,
  account: 51,
  role: 57,
  logrecords: 55,
  exportrecords: 56
}
// 默认展示
export const custommenu = [{id: 415, name: 'building'}, {id: 425, name: 'floor'}, {id: 311, name: 'wifi'}]
