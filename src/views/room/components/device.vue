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
          <el-button type="primary" icon="obicon obicon-bangding" @click="handleCreate">{{$t('message.bind')}}</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog v-if="deviceDialogVisible" id="holder" top="10%" width="860px" :title="$t('message.binddev')" :visible.sync="deviceDialogVisible" :close-on-click-modal="false" append-to-body>
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
      const that = this
      return [{
        label: this.$t('smart.room.tableField', {FIELD: 'serial'}),
        prop: 'deviceSerialId',
        align: 'center'
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'name'}),
        prop: 'deviceName',
        align: 'center'
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'type'}),
        prop: 'deviceType',
        align: 'center',
        formatter (val) {
          return that.$t('system.devtype', {FIELD: Suit.getRootDeviceDescriptor(val)})
        }
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'subtype'}),
        prop: 'deviceChildType',
        align: 'center',
        formatter (val, row) {
          if (Suit.typeHints.isThreeKeySocketSwitch(row.deviceChildType)) {
            return that.$t('system.devtype', {FIELD: Suit.getDeviceTypeDescriptor(row.deviceType, val)})
          }
          return '-'
        }
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'status'}),
        prop: 'deviceState',
        align: 'center',
        formatter (status, row) {
          // return Suit.getStatusDescriptor(status, row.deviceType, row.deviceChildType)
          if (!status) return '-'
          if (Suit.typeHints.isThreeKeySocketSwitch(row.deviceChildType)) {
            return status.slice(0, 2) === '00' ? that.$t('message.status', {STATUS: 'off'}) : that.$t('message.status', {STATUS: 'on'})
          }
          return '-'
        }
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'action'}),
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        // <el-button size="tiny" icon="el-icon-edit" title="编辑" onClick={() => this.handleEdit(row)}></el-button>,
        <el-button size="tiny" icon="obicon obicon-unbind" title={this.$t('message.unbinddev')} onClick={() => this.handleRemove(row)}></el-button>
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
            message: this.$t('smart.room.message', {MESSAGE: 'fetchRoomDev'})
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: this.$t('message.fail'),
          message: this.$t('message.exception'),
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
        text: this.$t('smart.room.message', {MESSAGE: 'binding'})
      })
      this.deviceDialogVisible = false
      RoomAPI.bindDeviceToRoomV2(this.room, selection.id, selection.serialId, selection.device_type, selection.device_child_type).then(res => {
        loader.close()
        this.responseHandler(res, this.$t('message.binddev'))
        if (res.message.includes('success')) {
          this.getRoomDeviceList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, this.$t('message.binddev'))
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
      // console.log('房间编辑 ', row)
    },
    handleRemove (row) {
      this.$confirm(this.$t('smart.room.message', {MESSAGE: 'unbindConfirm'}), this.$t('message.tips'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove(row)
      }).catch(() => {
        console.log('cancel')
      })
    },
    doRemove (row) {
      const loader = this.$loading({
        text: this.$t('smart.room.message', {MESSAGE: 'unbinding'})
      })
      RoomAPI.unbindRoomDevice(this.room, row.deviceId, row.deviceSerialId, row.deviceType, row.deviceChildType).then(res => {
        loader.close()
        this.responseHandler(res, this.$t('message.unbinddev'))
        if (res.message.includes('success')) {
          this.getRoomDeviceList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, this.$t('message.unbinddev'))
      })
    },
    responseHandler (res, msg) {
      let message = `${msg}${this.$t('message.fail')}`
      let type = 'error'
      if (res.message.includes('success')) {
        type = 'success'
        message = `${msg}${this.$t('message.success')}`
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
