import {cacher} from '@/common/cache'


export function isAuth (key, permissions = []) {
  return !!permissions.find(item => item.id === key) || false
}

export function $isPermited (key) {
  return isAuth(key, JSON.parse(cacher.get('permission')))
}

export default {
  inserted (el, binding, vnode) {
    const { value } = binding
    if (value && !isAuth(value, JSON.parse(cacher.get('permission')))) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
