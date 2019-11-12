import isPermited from './button'

isPermited.install = Vue => {
  Vue.directive('isPermited', isPermited)
}
export default isPermited
