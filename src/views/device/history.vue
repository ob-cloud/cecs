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
import Helper from '@/common/helper'
export default {
  name: 'device-history',
  props: {
    serialId: {
      type: String
    }
  },
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
    this.getDeviceOperationHistory()
  },
  methods: {
    getColumns () {
      return [{
        label: '操作状态',
        prop: 'status',
        align: 'center'
      }, {
        label: '操作时间',
        prop: 'time',
        align: 'center',
        formatter (val) {
          return Helper.parseTime(val)
        }
      }]
    },
    getDeviceOperationHistory () {
      if (!this.serialId) return
      this.tableLoading = true
      this.search.serialId = this.serialId
      DeviceAPI.getDeviceOperationHistory(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.history
        } else {
          this.$message({
            message: resp.message || '设备操作记录获取失败'
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: err.message || '设备操作记录获取失败',
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getDeviceOperationHistory()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getDeviceOperationHistory()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
