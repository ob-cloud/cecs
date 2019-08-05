/**
 * Created by skz on 2018/3/12 10:17
 */

import TableBase from './src/table-base.vue'

TableBase.install = function (Vue) {
  Vue.component(TableBase.name, TableBase)
}
export default TableBase
