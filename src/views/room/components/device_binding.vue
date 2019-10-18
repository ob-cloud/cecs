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
const {default: Suit} = require('@/common/suit')
export default {
  name: 'room-device-binding',
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
        label: '选项',
        align: 'center',
        renderBody (h) {
          return (
            <el-radio value="0"></el-radio>
          )
        }
      }, {
        label: '设备序号',
        prop: 'obox_serial_id',
        align: 'center'
      }, {
        label: '设备名称',
        prop: 'name',
        align: 'center'
      }, {
        label: '设备状态',
        prop: 'state',
        align: 'center',
        formatter (status, row) {
          return Suit.getStatusDescriptor(status, row.device_type, row.device_child_type)
        }
      }, {
        label: '设备类型',
        prop: 'device_type',
        align: 'center',
        formatter (val) {
          return Suit.getRootDeviceDescriptor(val)
        }
      }, {
        label: '子设备类型',
        prop: 'device_child_type',
        align: 'center',
        formatter (val, row) {
          return Suit.getDeviceTypeDescriptor(row.device_type, val)
        }
      }]
    },
    getDeviceList () {
      this.tableLoading = true
      DeviceAPI.getDeviceList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.config
        } else {
          this.$message({
            message: resp.message || '设备获取失败'
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: err.message || '设备获取失败',
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
