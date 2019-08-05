<template>
  <div>
    <base-table :tableData="tableData" :columns="columns"></base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
export default {
  data () {
    return {
      tableData: [],
      columns: [{
        label: '设备序号',
        prop: ''
      }, {
        label: '设备名称',
        prop: ''
      }, {
        label: '设备地址',
        prop: ''
      }, {
        label: '设备状态',
        prop: ''
      }, {
        label: '设备类型',
        prop: ''
      }, {
        label: '子设备类型',
        prop: ''
      }, {
        label: '设备版本',
        prop: ''
      }]
    }
  },
  components: { BaseTable },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
