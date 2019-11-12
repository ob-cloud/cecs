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
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
      <slot>
        <template slot="caption">
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.wifi.search', {FIELD: 'serial'})" v-model="search.obox_serial_id"></el-input>
          <!-- <el-input @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.wifi.search', {FIELD: 'type'})" v-model="search.device_type"></el-input> -->
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.wifi.search', {FIELD: 'name'})" v-model="search.name"></el-input>
          <el-select clearable class="caption-item" :placeholder="$t('smart.wifi.search', {FIELD: 'status'})" v-model="search.online">
            <el-option :label="$t('smart.wifi.search', {FIELD: 'status'})" value=''></el-option>
            <el-option :label="$t('message.status', {STATUS: 'online'})" :value='true'></el-option>
            <el-option :label="$t('message.status', {STATUS: 'offline'})" :value='false'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
        </template>
      </slot>
    </base-table>
    <!-- <el-dialog top="10%" width="760px" title="设备操作历史" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <device-history :serialId="activeRecord.obox_serial_id"></device-history>
    </el-dialog> -->
    <slide-page :visible.sync="dialogVisible" :title="$t('smart.wifi.slide', {FIELD: 'panel'})" @onClose="acSerialId = ''">
      <ac-control :serialId="acSerialId"></ac-control>
    </slide-page>
    <!-- <el-dialog  v-if="renameDialogVisible" top="10%" width="660px" title="重命名" :visible.sync="renameDialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="rename" autoComplete="on" :rules="renameRules" :model="renameModel" label-position="left" label-width="80px">
        <el-form-item :label="$t('smart.obox.tableField', { FIELD: 'name' })" prop="name">
          <el-input v-model="renameModel.name" :placeholder="$t('message.placeholder', {TYPE: '', PLACEHOLDER: 'deviceName' })"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="renameDialogVisible = false">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="handleRename()">{{$t('message.confirm')}}</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import DeviceAPI from '@/api/device'
import SlidePage from '@/components/SlidePage'
import AcControl from './components/ac'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
const {default: Suit} = require('@/common/suit')
const {default: TypeHint} = require('@/oblink/suit')
export default {
  name: 'device-wifi',
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
      activeRecord: {},
      acSerialId: '',
      // renameDialogVisible: false, // 重命名
      // renameModel: {
      //   name: ''
      // },
      // renameRules: {
      //   name: [{ required: true, message: this.$t('message.rules', {RULE: 'deviceName'}), trigger: 'blur' }]
      // }
    }
  },
  components: { BaseTable, SlidePage, AcControl },
  created () {
    // this.getOboxList()
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
      const that = this
      return [{
        label: this.$t('smart.wifi.tableField', {FIELD: 'serial'}),
        prop: 'deviceId',
        align: 'center'
      }, {
        label: this.$t('smart.wifi.tableField', {FIELD: 'name'}),
        prop: 'name',
        align: 'center'
      }, {
        label: this.$t('smart.wifi.tableField', {FIELD: 'status'}),
        prop: 'online',
        align: 'center',
        formatter (status, row) {
          return status === false ? that.$t('message.status', {STATUS: 'offline'}) : that.$t('message.status', {STATUS: 'online'})
        }
      }, {
        label: this.$t('smart.wifi.tableField', {FIELD: 'type'}),
        prop: 'type',
        align: 'center',
        formatter (val) {
          return Suit.getRootDeviceDescriptor(val)
        }
      }, {
        label: this.$t('smart.wifi.tableField', {FIELD: 'action'}),
        align: 'center',
        renderToolBox: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolbox = []
      // const rename = <el-button size="tiny" icon="el-icon-edit" title={this.$t('message.rename')} onClick={() => this.handleRenameAction(row)}></el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" title={this.$t('message.delete')} onClick={() => this.removeDevice(row)}></el-button>
      if (this.$isPermited(32) && TypeHint.isTransponder(row.type)) {
        toolbox.push(<el-button size="tiny" icon="obicon obicon-infrared" title={this.$t('smart.wifi.placeholder', {FIELD: 'infrated'})} onClick={() => this.handleAcControl(row)}></el-button>)
      }
      // toolbox.push(rename)
      this.$isPermited(34) && toolbox.push(remove)
      return toolbox
    },
    getDeviceList () {
      this.tableLoading = true
      DeviceAPI.getWifiDeviceList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.configs
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
    handleAcControl (row) {
      this.dialogVisible = true
      this.acSerialId = row.deviceId
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
      DeviceAPI.removeDevice(row.obox_serial_id, row.name).then(res => {
        loader.close()
        this.responseHandler(res, this.$t('smart.obox.message', {MESSAGE: 'delDevice'}))
        if (res.message.includes('success')) {
          this.getDeviceList()
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
