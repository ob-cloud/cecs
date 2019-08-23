<template>
  <div class="smart">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @current-change="onSelectionChange"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
    </base-table>
  </div>
</template>

<script>
// const {default: Suit} = require('@/common/suit')
import BaseTable from '@/assets/package/table-base'
import DeviceAPI from '@/api/device'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
export default {
  name: 'device-record',
  data () {
    return {
      tableLoading: true,
      tableHeight: 500,
      search: {
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: []
    }
  },
  components: { BaseTable },
  computed: {
    total () {
      return this.tableData.length || 0
    }
  },
  mounted () {
    this.columns = this.getColumns()
    this.getDeviceList()
  },
  methods: {
    getColumns () {
      return [{
        label: '昵称',
        prop: 'nickName',
        align: 'center'
      }, {
        label: '开门类型',
        prop: 'operation',
        align: 'center'
      }, {
        label: '日期',
        prop: 'datetime',
        align: 'center'
      }]
    },
    getDeviceList () {
      this.tableLoading = true
      DeviceAPI.getDoorLockOpenRecord(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.records
        } else {
          this.$message({
            message: resp.message || '记录获取失败'
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: err.message || '记录获取失败',
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getDeviceList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getDeviceList()
    },
    onSelectionChange (selections) {
      this.$emit('selection', selections)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
