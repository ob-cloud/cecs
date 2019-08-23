<template>
  <div>
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备序列号" v-model="search.obox_serial_id"></el-input>
          <el-select clearable class="caption-item" placeholder="所有设备" v-model="search.oboxId">
            <el-option label='所有设备' value=''></el-option>
            <el-option :label='item.obox_name' :value='item.obox_serial_id' v-for="(item, index) in oboxList" :key="index"></el-option>
          </el-select>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备类型" v-model="search.device_type"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备名称" v-model="search.name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加设备</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog top="10%" width="760px" title="设备操作历史" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <device-history :serialId="activeRecord.obox_serial_id"></device-history>
    </el-dialog>
    <el-dialog top="10%" width="760px" title="添加设备" :visible.sync="addDeviceDialogVisible" :close-on-click-modal="false">
      <device-create :oboxs="oboxList" @deviceSelected="onDeviceSelected"></device-create>
      <div slot="footer" class="dialog-footer text-center" >
        <el-button @click="addDeviceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createDevice">确 认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import DeviceHistory from './history'
import DeviceCreate from './add'
import DeviceAPI from '@/api/device'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
const {default: Suit} = require('@/common/suit')
export default {
  name: 'device-obox',
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: true,
      search: {
        obox_serial_id: '',
        name: '',
        device_type: '',
        oboxId: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      oboxList: [],
      dialogVisible: false,
      activeRecord: {},
      addDeviceDialogVisible: false,
      addDeviceSelected: {}
    }
  },
  components: { BaseTable, DeviceHistory, DeviceCreate },
  created () {
    this.getOboxList()
    this.columns = this.getColumns()
    this.getDeviceList()
  },
  computed: {
    total () {
      return this.tableData.length || 0
    }
  },
  mounted () {
    // Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 50
    },
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
      }, {
        label: '设备版本',
        prop: 'version',
        align: 'center'
      }, {
        label: '操作',
        align: 'center',
        minWidth: '180px',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      let toolboxs = []
      // const edit = <el-button size="tiny" icon="el-icon-edit" onClick={() => this.editDevice(row)}></el-button>
      // const setting = <el-button size="tiny" icon="el-icon-setting" onClick={() => this.settingDevice(row)}></el-button>
      // const info = <el-button size="tiny" icon="el-icon-info" onClick={() => this.checkDeviceInfo(row)}></el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" onClick={() => this.removeDevice(row)}></el-button>
      if (Suit.typeHints.isSocketSwitch(row.device_type)) {
        toolboxs = toolboxs.concat(this.getSocketActionRender(row))
      }
      if (Suit.typeHints.isDoorLock(row.device_type)) {
        toolboxs = toolboxs.concat(this.getDoorLockActionRender(row))
      }
      if (Suit.typeHints.isLed(row.device_type)) {
        toolboxs = toolboxs.concat(this.getLampLockActionRender(row))
      }
      toolboxs.push(remove)
      return toolboxs
    },
    getDoorLockActionRender (row) {
      return [
        <el-button size="tiny" icon="obicon obicon-record" title="历史记录" onClick={() => this.handleDoorLockRecord(row)}></el-button>,
        <el-button size="tiny" icon="obicon obicon-alarm" title="报警记录" onClick={() => this.handleDoorLockRecord(row)}></el-button>,
        <el-button size="tiny" icon="obicon obicon-user" title="用户列表" onClick={() => this.handleDoorLockRecord(row)}></el-button>,
        <el-button size="tiny" icon="obicon obicon-cog" title="门锁配置" onClick={() => this.handleDoorLockSet(row)}></el-button>
      ]
    },
    getLampLockActionRender (row) {
      return [
        <el-button size="tiny" icon="obicon obicon-power" title="灯开关" onClick={() => this.handleLampPower(row)}></el-button>
      ]
    },
    getSocketActionRender (row) {
      return [
        <el-button size="tiny" icon="obicon obicon-record" title="历史记录" onClick={() => this.handleDoorLockRecord(row)}></el-button>,
        <el-button size="tiny" icon="obicon obicon-cog" title="开关配置" onClick={() => this.handleDoorLockSet(row)}></el-button>
      ]
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
          message: err.message || '服务出错',
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    getOboxList () {
      DeviceAPI.getOboxList().then(res => {
        if (res.status === 200) {
          this.oboxList = res.data.oboxs
        }
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
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getDeviceList()
    },
    handleCreate () {
      this.addDeviceDialogVisible = true
    },
    editDevice (row) {
      console.log('edit ', row)
    },
    settingDevice (row) {
      console.log('set ', row)
    },
    checkDeviceInfo (row) {
      this.dialogVisible = true
      this.activeRecord = row
    },
    removeDevice (row) {
      this.$confirm('确认删除设备？', '确认提示', {
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
        text: '设备删除中...'
      })
      DeviceAPI.removeDevice(row.obox_serial_id, row.name).then(res => {
        loader.close()
        this.responseHandler(res, '设备删除')
        if (res.message.includes('success')) {
          this.getDeviceList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, '设备删除')
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
    },
    handleLampPower (row) {
      let type = Suit.getStatusDescriptor(row.state, row.device_type, row.device_child_type)
      type = type === '开' ? '关' : '开'
      const loader = this.$loading({
        text: `${type}灯中...`
      })
      DeviceAPI.setLampPower(type, row.serialId, row.state).then(res => {
        loader.close()
        this.responseHandler(res, `${type}灯`)
        if (res.message.includes('success')) {
          this.getDeviceList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, `${type}灯`)
      })
    },
    onDeviceSelected (selected) {
      console.log('--- ', selected)
      this.addDeviceSelected = selected
    },
    createDevice () {
      console.log(this.addDeviceSelected)
      if (!this.addDeviceSelected.oboxId || !this.addDeviceSelected.deviceType) {
        return this.$message({
          type: 'warning',
          message: (!this.addDeviceSelected.oboxId ? 'obox' : '设备') + '不能空!'
        })
      }
      const loader = this.$loading({
        text: `设备搜索中...`
      })
      DeviceAPI.searchToAddDevice(...this.addDeviceSelected).then(res => {
        loader.close()
        this.responseHandler(res, `设备添加`)
        if (res.message.includes('success')) {
          this.getDeviceList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, `设备添加`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  width: 94%;
  margin: 12px auto;
}
</style>
