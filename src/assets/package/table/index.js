/**
 * Created by skz on 2018/3/12 10:13
 */
import ElTablePlus from './src/table-plus'

ElTablePlus.install = function (Vue) {
  Vue.component(ElTablePlus.name, ElTablePlus)
}

export default ElTablePlus
