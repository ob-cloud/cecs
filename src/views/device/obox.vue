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
            <el-option :label='item.obox_name+`(${item.obox_status === 1 ? "在线" : "离线"})`' :value='item.obox_serial_id' v-for="(item, index) in oboxList" :key="index"></el-option>
          </el-select>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备类型" v-model="search.device_type"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备名称" v-model="search.name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
      </slot>
    </base-table>
    <slide-page :visible.sync="dialogVisible" title="三键开关控制面板">
      <i-switcher :serialId="switchSerialId"></i-switcher>
    </slide-page>
    <slide-page :visible.sync="humidifierMap.dialogVisible" title="温湿度" @onClose="humidifierSerialId = ''">
      <humifier :serialId="humidifierSerialId"></humifier>
    </slide-page>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import DeviceHistory from './history'
import Humifier from './components/humifier'
import iSwitcher from './components/switcher'
import SlidePage from '@/components/SlidePage'
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
      humidifierMap: {
        dialogVisible: false,
      },
      switchSerialId: '',
      humidifierSerialId: ''
    }
  },
  components: { BaseTable, DeviceHistory, Humifier, iSwitcher, SlidePage },
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
      const that = this
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
        // minWidth: '180px',
        tooltip: false,
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolboxs = []
      // const edit = <el-button size="tiny" icon="el-icon-edit" onClick={() => this.editDevice(row)}></el-button>
      // const setting = <el-button size="tiny" icon="el-icon-setting" onClick={() => this.settingDevice(row)}></el-button>
      // const info = <el-button size="tiny" icon="el-icon-info" onClick={() => this.checkDeviceInfo(row)}></el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" title="删除" onClick={() => this.removeDevice(row)}></el-button>
      if (Suit.typeHints.isThreeKeySocketSwitch(row.device_child_type)) {
        toolboxs.push(<el-button size="tiny" icon="obicon obicon-power" title="灯开关" onClick={() => this.handleSwitchPower(row)}></el-button>)
      } else if (Suit.typeHints.isHumidifierSensors(row.device_child_type)) {
        toolboxs.push(<el-button size="tiny" icon="obicon obicon-humidity" title="温湿度" onClick={() => this.handleHumidifier(row)}></el-button>)
      }
      toolboxs.push(remove)
      return toolboxs
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
    editDevice (row) {
      console.log('edit ', row)
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
    handleSwitchPower (row) {
      this.switchSerialId = row.serialId
      this.dialogVisible = true
    },
    handleHumidifier (row) {
      this.humidifierSerialId = row.serialId
      this.humidifierMap.dialogVisible = true
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
