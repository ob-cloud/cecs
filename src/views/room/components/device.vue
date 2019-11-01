<template>
  <div class="smart">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="actionBar">
          <el-button type="primary" icon="obicon obicon-bangding" @click="handleCreate">绑定</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog v-if="deviceDialogVisible" id="holder" top="10%" width="860px" title="绑定设备" :visible.sync="deviceDialogVisible" :close-on-click-modal="false" append-to-body>
      <device-binding @selection="onSelection"></device-binding>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import DeviceBinding from './device_binding'
import RoomAPI from '@/api/room'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
const {default: Suit} = require('@/common/suit')
export default {
  name: 'room-device',
  props: {
    room: {
      type: Number
    }
  },
  data () {
    return {
      tableLoading: true,
      tableHeight: 500,
      search: {
        roomId: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      deviceDialogVisible: false
    }
  },
  watch: {
    room () {
      this.getRoomDeviceList()
    }
  },
  components: { BaseTable, DeviceBinding },
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
        label: '设备序列号',
        prop: 'deviceSerialId',
        align: 'center'
      }, {
        label: '设备名称',
        prop: 'deviceName',
        align: 'center'
      }, {
        label: '设备类型',
        prop: 'deviceType',
        align: 'center',
        formatter (val) {
          return Suit.getRootDeviceDescriptor(val)
        }
      }, {
        label: '子设备类型',
        prop: 'deviceChildType',
        align: 'center',
        formatter (val, row) {
          if(Suit.typeHints.isThreeKeySocketSwitch(row.deviceChildType)) {
            return Suit.getDeviceTypeDescriptor(row.deviceType, val)
          }
          return '-'
        }
      }, {
        label: '设备状态',
        prop: 'deviceStatus',
        align: 'center',
        formatter (status, row) {
          // return Suit.getStatusDescriptor(status, row.deviceType, row.deviceChildType)
          if(Suit.typeHints.isThreeKeySocketSwitch(row.deviceChildType)) {
            return status === '0' ? '关' : '开'
          }
          return '-'
        }
      }, {
        label: '操作',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        // <el-button size="tiny" icon="el-icon-edit" title="编辑" onClick={() => this.handleEdit(row)}></el-button>,
        <el-button size="tiny" icon="obicon obicon-unbind" title="设备解绑" onClick={() => this.handleRemove(row)}></el-button>
      ]
    },
    getRoomDeviceList () {
      this.tableLoading = true
      this.search.roomId = this.room
      RoomAPI.getRoomDeviceListV2(this.search).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
        } else {
          this.$message({
            message: resp.message || '房间设备获取失败'
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
    onSelection (selection) {
      const loader = this.$loading({
        text: '设备绑定中...'
      })
      this.deviceDialogVisible = false
      RoomAPI.bindDeviceToRoomV2(this.room, selection.id, selection.serialId).then(res => {
        loader.close()
        this.responseHandler(res, '设备绑定')
        if (res.message.includes('success')) {
          this.getRoomDeviceList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, '设备绑定')
      })
      // const params = {
      //   serialId: selection.obox_serial_id,
      //   location: this.room,
      //   device_type: selection.device_type
      // }
      // RoomAPI.setRoomDevice(params).then(res => {
      //   loader.close()
      //   this.responseHandler(res, '设备绑定')
      //   if (res.message.includes('success')) {
      //     this.getRoomDeviceList()
      //   }
      // }).catch(() => {
      //   loader.close()
      //   this.responseHandler({message: 'error'}, '设备绑定')
      // })
    },
    handleCreate () {
      this.deviceDialogVisible = true
    },
    handleEdit (row) {
      console.log('房间编辑 ', row)
    },
    handleRemove (row) {
      this.$confirm('确认解绑设备？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove(row)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doRemove (row) {
      const loader = this.$loading({
        text: '设备解绑中...'
      })
      RoomAPI.unbindRoomDevice(this.room, row.deviceId, row.deviceSerialId).then(res => {
        loader.close()
        this.responseHandler(res, '设备解绑')
        if (res.message.includes('success')) {
          this.getRoomDeviceList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, '设备解绑')
      })
    },
    responseHandler (res, msg) {
      let message = `${msg}失败`
      let type = 'error'
      if (res.message.includes('success')) {
        type = 'success'
        message = `${msg}成功`
      }
      this.$message({
        type,
        message
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
