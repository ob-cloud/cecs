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
          <el-select clearable class="caption-item" placeholder="全部状态" v-model="search.online">
            <el-option label='全部' value=''></el-option>
            <el-option label='在线' :value='true'></el-option>
            <el-option label='离线' :value='false'></el-option>
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
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import DeviceHistory from './history'
import DeviceAPI from '@/api/device'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
const {default: Suit} = require('@/common/suit')
export default {
  name: 'device-wifi',
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
        deviceId: '',
        name: '',
        type: '',
        online: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      oboxList: [],
      dialogVisible: false,
      activeRecord: {}
    }
  },
  components: { BaseTable, DeviceHistory },
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
        prop: 'deviceId',
        align: 'center'
      }, {
        label: '设备名称',
        prop: 'name',
        align: 'center'
      }, {
        label: '设备状态',
        prop: 'online',
        align: 'center',
        formatter (status, row) {
          return status === false ? '离线' : '在线'
        }
      }, {
        label: '设备类型',
        prop: 'type',
        align: 'center',
        formatter (val) {
          return Suit.getRootDeviceDescriptor(val)
        }
      }, {
        label: '操作',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      let toolboxs = []
      const edit = <el-button size="tiny" icon="el-icon-edit" onClick={() => this.editDevice(row)}></el-button>
      const setting = <el-button size="tiny" icon="el-icon-setting" onClick={() => this.settingDevice(row)}></el-button>
      const info = <el-button size="tiny" icon="el-icon-info" onClick={() => this.checkDeviceInfo(row)}></el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" onClick={() => this.removeDevice(row)}></el-button>
      console.log(edit, setting)
      if (Suit.typeHints.isSocketSwitch(row.device_type)) {
        toolboxs.push(info)
      }
      if (Suit.typeHints.isDoorLock(row.device_type)) {
        toolboxs = toolboxs.concat(this.getDoorLockActionRender(row))
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
    getDeviceList () {
      this.tableLoading = true
      DeviceAPI.getWifiDeviceList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.configs
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
