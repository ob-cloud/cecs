<template>
  <div class="ui-container" :style="{height: layoutHeight + 'px'}">
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      :pageNo="search.pageNo"
      :toolboxSize="0"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
      <slot>
        <template slot="caption">
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.obox.search', {FIELD: 'serial'})" v-model="search.serialId"></el-input>
          <el-select clearable class="caption-item" :placeholder="$t('smart.obox.search', {FIELD: 'devices'})" v-model="search.obox_serial_id">
            <el-option :label="$t('smart.obox.search', {FIELD: 'devices'})" value=''></el-option>
            <el-option :label="item.obox_name + ' (' + (item.obox_status === 1 ? $t('message.status', {STATUS: 'online'}) : $t('message.status', {STATUS: 'offline'})) + ')'" :value='item.obox_serial_id' v-for="(item, index) in oboxList" :key="index"></el-option>
          </el-select>
          <!-- <el-input @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.obox.search', {FIELD: 'type'})" v-model="search.device_type"></el-input> -->
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.obox.search', {FIELD: 'name'})" v-model="search.name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
        </template>
      </slot>
    </base-table>
    <slide-page :visible.sync="dialogVisible" :title="$t('smart.obox.slide', {FIELD: 'panel'})"  :extraLabel="switchSerialId">
      <i-switcher :serialId="switchSerialId" :state="switchState" @switcher-change="onSwitcherChange"></i-switcher>
    </slide-page>
    <slide-page :visible.sync="humidifierMap.dialogVisible" :title="$t('smart.obox.slide', {FIELD: 'humidifier'})" :extraLabel="humidifierSerialId" @onClose="humidifierSerialId = ''">
      <humifier :serialId="humidifierSerialId" :state="humidifierState"></humifier>
    </slide-page>
    <slide-page :visible.sync="panelDialogVisible" title="面板控制" @onClose="panelSerialId = ''">
      <key-panel :serialId="panelSerialId" @on-setting-finished="panelDialogVisible = false"></key-panel>
    </slide-page>
    <slide-page :visible.sync="lampDialogVisible" title="灯控" @onClose="lampSerialId = '';getDeviceList()" :extraLabel="lampSerialId">
      <lamp :status="lampStatus" :serialId="lampSerialId" :type="lampDeviceChildType"></lamp>
    </slide-page>

    <el-dialog  v-if="renameDialogVisible" top="10%" width="660px" title="重命名" :visible.sync="renameDialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="rename" autoComplete="on" :rules="renameRules" :model="renameModel" label-position="left" label-width="80px">
        <el-form-item :label="$t('smart.obox.tableField', { FIELD: 'name' })" prop="name">
          <el-input v-model="renameModel.name" :placeholder="$t('message.placeholder', {TYPE: '', PLACEHOLDER: 'deviceName' })"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="renameDialogVisible = false">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="handleRename()">{{$t('message.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import Humifier from './components/humifier'
import iSwitcher from './components/switcher'
import KeyPanel from './components/panel'
import Lamp from './components/lamp'
import SlidePage from '@/components/SlidePage'
import DeviceAPI from '@/api/device'
import OboxAPI from '@/api/obox'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
const {default: Suit} = require('@/common/suit')
export default {
  name: 'device-obox',
  props: {
    height: {
      type: Number,
      default: 0
    },
    layoutHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: true,
      total: 0,
      search: {
        obox_serial_id: '',
        name: '',
        device_type: '',
        serialId: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      oboxList: [],
      dialogVisible: false,
      humidifierMap: {
        dialogVisible: false,
      },
      switchSerialId: '',
      switchState: '',
      humidifierSerialId: '',
      humidifierState: '',
      renameDialogVisible: false, // 重命名
      renameModel: {
        name: ''
      },
      renameRules: {
        name: [{ required: true, message: this.$t('message.rules', {RULE: 'deviceName'}), trigger: 'blur' }]
      },
      panelSerialId: '',
      panelDialogVisible: false,
      lampSerialId: '',
      lampStatus: '',
      lampDeviceChildType: '',
      lampDialogVisible: false
    }
  },
  components: { BaseTable, Humifier, iSwitcher, SlidePage, KeyPanel, Lamp },
  created () {
    this.getOboxList()
    this.columns = this.getColumns()
    this.getDeviceList()
  },
  mounted () {
    // Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 50
    },
    getColumns () {
      const that = this
      return [{
        label: this.$t('smart.obox.tableField', {FIELD: 'serial'}),
        prop: 'serialId',
        align: 'center'
      }, {
        label: this.$t('smart.obox.tableField', {FIELD: 'name'}),
        prop: 'name',
        align: 'center'
      }, {
        label: this.$t('smart.obox.tableField', {FIELD: 'status'}),
        prop: 'state',
        align: 'center',
        formatter (status, row) {
          if (Suit.typeHints.isThreeKeySocketSwitch(row.device_child_type)) {
            return status && status.slice(0, 2) === '00' ? that.$t('message.status', {STATUS: 'off'}) : that.$t('message.status', {STATUS: 'on'})
          }
          return Suit.getStatusDescriptor(status, row.device_type, row.device_child_type)
        }
      }, {
        label: this.$t('smart.obox.tableField', {FIELD: 'type'}),
        prop: 'device_type',
        align: 'center',
        formatter (val) {
          // return that.$t('system.devtype', {FIELD: Suit.getRootDeviceDescriptor(val)})
          return Suit.getRootDeviceDescriptor(val)
        }
      }, {
        label: this.$t('smart.obox.tableField', {FIELD: 'subtype'}),
        prop: 'device_child_type',
        align: 'center',
        formatter (val, row) {
          // return that.$t('system.devtype', {FIELD: Suit.getDeviceTypeDescriptor(row.device_type, val)})
          return Suit.getDeviceTypeDescriptor(row.device_type, val)
        }
      },
      {
        label: '异常状态',
        prop: 'state',
        align: 'center',
        formatter (status, row) {
          if (Suit.typeHints.isSimpleLed(row.device_child_type)) {
            const exception = status.slice(14) || '00'
            const bits = exception.split('')
            if (!bits || !bits.length) return '无异常'
            return bits[0] === '1' ? '开路' : bits[1] === '1' ? '短路' : '无异常'
          }
          return '-'
        }
      },
      {
        label: this.$t('smart.obox.tableField', {FIELD: 'action'}),
        align: 'center',
        // minWidth: '180px',
        tooltip: false,
        renderToolBox: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolboxs = []
      // const edit = <el-button size="tiny" icon="el-icon-edit" onClick={() => this.editDevice(row)}></el-button>
      // const setting = <el-button size="tiny" icon="el-icon-setting" onClick={() => this.settingDevice(row)}></el-button>
      // const info = <el-button size="tiny" icon="el-icon-info" onClick={() => this.checkDeviceInfo(row)}></el-button>
      const rename = <el-button size="tiny" icon="el-icon-edit" title={this.$t('message.rename')} onClick={() => this.handleRenameAction(row)}>{this.$t('message.rename')}</el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" title={this.$t('message.delete')} onClick={() => this.removeDevice(row)}>{this.$t('message.delete')}</el-button>
      if (this.$isPermited(32) && Suit.typeHints.isThreeKeySocketSwitch(row.device_child_type)) {
        toolboxs.push(<el-button size="tiny" icon="obicon obicon-power" title={this.$t('smart.obox.placeholder', {FIELD: 'lamp'})} onClick={() => this.handleSwitchPower(row)}>{this.$t('smart.obox.placeholder', {FIELD: 'lamp'})}</el-button>)
      } else if (this.$isPermited(32) && Suit.typeHints.isHumidifierSensors(row.device_child_type)) {
        toolboxs.push(<el-button size="tiny" icon="obicon obicon-humidity" title={this.$t('smart.obox.placeholder', {FIELD: 'humidifier'})} onClick={() => this.handleHumidifier(row)}>{this.$t('smart.obox.placeholder', {FIELD: 'humidifier'})}</el-button>)
      } else if (this.$isPermited(32) && row.device_child_type === '7a') {
        toolboxs.push(<el-button size="tiny" icon="el-icon-setting" title="设置" onClick={() => this.handlePanelAction(row)}>设置</el-button>)
      } else if (this.$isPermited(32) && Suit.typeHints.isSimpleLed(row.device_child_type)) {
        toolboxs.push(<el-button size="tiny" icon="el-icon-switch-button" title="灯控" onClick={() => this.handleLampAction(row)}>灯控</el-button>)
      }
      this.$isPermited(35) && toolboxs.push(rename)
      this.$isPermited(34) && toolboxs.push(remove)
      !toolboxs.length && toolboxs.push(<span title="">{this.$t('message.noAction')}</span>)
      return toolboxs
    },
    getDeviceList () {
      this.tableLoading = true
      DeviceAPI.getOboxDeviceList(this.search).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
          this.total = resp.total
          if (!this.tableData.length && this.search.pageNo !== 1) {
            this.search.pageNo = PAGINATION_PAGENO
            this.getDeviceList()
          }
        } else {
          this.$message({
            message: this.$t('smart.obox.message', {MESSAGE: 'fetchFail'})
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
    getOboxList () {
      OboxAPI.getAllObox().then(res => {
        if (res.status === 0) {
          this.oboxList = res.data
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
    removeDevice (row) {
      this.$confirm(this.$t('smart.obox.message', {MESSAGE: 'delConfirm'}), this.$t('message.tips'), {
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
        text: this.$t('smart.obox.message', {MESSAGE: 'loading'})
      })
      DeviceAPI.removeDevice(row.serialId, row.name).then(res => {
        loader.close()
        this.responseHandler(res, this.$t('smart.obox.message', {MESSAGE: 'delDevice'}))
        if (res.message.includes('success')) {
          this.getDeviceList()
        } else if (res.message.includes('obox is offline or not exist')) {
          this.$message({
            title: this.$t('message.fail'),
            type: 'error',
            message: this.$t('smart.obox.message', {MESSAGE: 'oboxoffline'})
          })
        } else if (res.message.includes('device does not belong to the user')) {
          this.$message({
            title: this.$t('message.fail'),
            type: 'error',
            message: this.$t('smart.obox.message', {MESSAGE: 'nobelong'})
          })
        } else {
          this.$message({
            title: this.$t('message.fail'),
            type: 'error',
            message: this.$t('message.actionFail')
          })
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, this.$t('smart.obox.message', {MESSAGE: 'delDevice'}))
      })
    },
    handleRenameAction (row) {
      this.renameDialogVisible = true
      this.renameModel = {...row}
    },
    handleRename () {
      this.$refs.rename.validate(valid => {
        if (valid) {
          DeviceAPI.modifyDeviceName(this.renameModel.serialId, this.renameModel.name).then(res => {
            this.responseHandler(res, this.$t('message.rename'))
            if (res.message.includes('success')) {
              this.getDeviceList()
            }
          }).catch(() => {
            this.responseHandler({message: 'error'}, this.$t('message.rename'))
          })
          this.renameDialogVisible = false
        }
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
    },
    handleSwitchPower (row) {
      this.switchSerialId = row.serialId
      this.switchState = row.state
      this.dialogVisible = true
    },
    handleHumidifier (row) {
      this.humidifierSerialId = row.serialId
      this.humidifierState = row.state
      this.humidifierMap.dialogVisible = true
    },
    handlePanelAction (row) {
      this.panelSerialId = row.serialId
      this.panelDialogVisible = true
    },
    handleLampAction (row) {
      this.lampSerialId = row.serialId
      this.lampStatus = row.state
      this.lampDeviceChildType = row.device_child_type
      this.lampDialogVisible = true
    },
    onSwitcherChange () {
      this.getDeviceList()
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  // width: 94%;
  // margin: 12px auto;
}
</style>
<style lang="scss">
.expand.humidifier {
  padding: 20px 10px;
  // background: rgba(7, 16, 33, 0.24);
  border-radius: 20px;
  box-shadow: 0 0 2px 1px #ababab;
  position: relative;

  .humidifier-status{
    width: 30%;
    display: inline-block;
    // border: 1px solid #eee;
    vertical-align: top;
    // box-shadow: 0 0 2px 1px #f2f2f2;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    .item {
      // display: inline-block;
      // width: 50%;
      padding: 50px;
      text-align: center;
      // border-right: 1px solid #eee;
      // &:last-of-type{
      //   border-right: none;
      // }
    }
    .item p{
      padding: 5px;
      color: #666;
      span{
        font-size: 12px;
      }
    }
    .item i {
      font-size: 32px;
      color: rgba(5, 100, 184, 0.9);
    }
    .item > span{
      display: inline-block;
      padding: 5px;
      font-size: 20px;
    }

  }
  .humidifier-table{
    display: inline-block;
    // width: 70%;
    // padding-left: 5px;
    width: 100%;
    padding-left: 30%;
  }
}
</style>
