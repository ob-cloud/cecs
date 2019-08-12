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

      <slot>
        <template slot="actionBar">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
        </template>
      </slot>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import RoomAPI from '@/api/room'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
export default {
  name: 'room-device',
  props: {
    room: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableLoading: true,
      tableHeight: 500,
      search: {
        room: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: []
    }
  },
  watch: {
    room () {
      this.getRoomDeviceList()
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
    this.getRoomDeviceList()
  },
  methods: {
    getColumns () {
      return [{
        label: '设备序号',
        prop: 'obox_serial_id',
        align: 'center'
      }, {
        label: '设备名称',
        prop: 'name',
        align: 'center'
      }, {
        label: '设备类型',
        prop: 'device_type',
        align: 'center'
      }, {
        label: '子设备类型',
        prop: 'device_child_type',
        align: 'center'
      }, {
        label: '设备状态',
        prop: 'state',
        align: 'center'
      }, {
        label: '操作',
        align: 'center',
        minWidth: '180px',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        <el-button size="tiny" icon="el-icon-edit" title="编辑" onClick={() => this.handleEdit(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-delete" title="删除" onClick={() => this.handleRemove(row)}></el-button>
      ]
    },
    getRoomDeviceList () {
      this.tableLoading = true
      this.search.room = this.room
      RoomAPI.getRoomDeviceList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.devices
        } else {
          this.$message({
            message: resp.message || '房间获取失败'
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: err.message || '服务出错',
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getRoomDeviceList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getRoomDeviceList()
    },
    handleCreate () {
      console.log('添加')
    },
    handleEdit (row) {
      console.log('房间编辑 ', row)
    },
    handleRemove (row) {
      console.log('删除房间 ', row)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
