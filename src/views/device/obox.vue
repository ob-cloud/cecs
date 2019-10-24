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
    <!-- <el-dialog top="10%" width="760px" title="三键开关控制面板" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <i-switcher></i-switcher>
    </el-dialog> -->
    <slide-page :visible.sync="dialogVisible" title="三键开关控制面板">
      <i-switcher :serialId="switchSerialId"></i-switcher>
    </slide-page>
    <slide-page :visible.sync="humidifierMap.dialogVisible" title="温湿度" @onClose="humidifierSerialId = ''">
      <!-- <div class="expand humidifier">
        <div class="humidifier-status">
          <div class="item">
            <p><i class="obicon obicon-temperature-o"></i><span>温度</span></p>
            <span>23℃</span>
          </div>
          <div class="item">
            <p><i class="obicon obicon-humidity"></i><span>湿度</span></p>
            <span>33%</span>
          </div>
        </div>
        <el-tabs tab-position="right" class="humidifier-table">
          <el-tab-pane label="历史数据">
            <base-table
              v-loading="humidifierMap.tableLoading"
              stripe border
              height="360px"
              :tableData="humidifierMap.tableData"
              :columns="[{label: '温度' , prop: 'temperature' , align: 'center' }, {label: '湿度' , prop: 'humidifier' , align: 'center' }, {label: '时间' , prop: 'time' , align: 'center' }]"
              :showPagination="false"
            ></base-table>
          </el-tab-pane>
          <el-tab-pane label="一周数据" style="max-height: 400px;">
            <HumifierChart v-if="humidifierMap.isCharListValid" :data="humidifierMap.series" :xAxis="humidifierMap.labels" style="margin: 0 auto;"></HumifierChart>
          </el-tab-pane>
        </el-tabs>
      </div> -->
      <humifier :serialId="humidifierSerialId"></humifier>
    </slide-page>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import DeviceHistory from './history'
// import HumifierChart from './components/humifier-chart'
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
      activeRecord: {},
      humidifierMap: {
        dialogVisible: false,
        tableLoading: true,
        list: [],
        chartList: [],
        tableData: [],
        isCharListValid: false,
        series: [],
        labels: []
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
        minWidth: '180px',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolboxs = []
      // const edit = <el-button size="tiny" icon="el-icon-edit" onClick={() => this.editDevice(row)}></el-button>
      // const setting = <el-button size="tiny" icon="el-icon-setting" onClick={() => this.settingDevice(row)}></el-button>
      // const info = <el-button size="tiny" icon="el-icon-info" onClick={() => this.checkDeviceInfo(row)}></el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" onClick={() => this.removeDevice(row)}></el-button>
      if (Suit.typeHints.isThreeKeySocketSwitch(row.device_child_type)) {
        toolboxs.push(<el-button size="tiny" icon="obicon obicon-power" title="灯开关" onClick={() => this.handleSwitchPower(row)}></el-button>)
      } else if (Suit.typeHints.isHumidifierSensors(row.device_child_type)) {
        toolboxs.push(<el-button size="tiny" icon="obicon obicon-humidity" title="灯开关" onClick={() => this.handleHumidifier(row)}></el-button>)
      }
      toolboxs.push(remove)
      return toolboxs
    },
    getDeviceList () {
      this.tableLoading = true
      DeviceAPI.getDeviceList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.config
          // Array.from(this.tableData).forEach(item => {
          //   if (!item) return
          //   // this.prefetchHistory(item.device_child_type, item.serialId)
          // })
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
    prefetchHistory (type, serialId) {
      if (Suit.typeHints.isHumidifierSensors(type)) {
        this.getHumidifierStatusHistoryByWeek(serialId)
        this.getHumidifierStatusHistoryByDay(serialId)
      }
    },
    async getHumidifierStatusHistoryByWeek (serialId) {
      const now = new Date().getTime()
      const toDate = parseInt(now / 1000)
      const fromDate = parseInt((now - (6 * 24 * 60 * 60 * 1000)) / 1000)
      const {data} = await DeviceAPI.getDeviceStatusHistory(serialId, fromDate, toDate, '02')
      return this.parseHumidifierHistoryByDay(data.history, '{m}-{d}')
    },
    async getHumidifierStatusHistoryByDay (serialId) {
      const date = new Date()
      const dateObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate()
      }
      const fromDate = parseInt(new Date(`${dateObj.y}-${dateObj.m}-${dateObj.d} 00:00`).getTime() / 1000)
      const toDate = parseInt(new Date(`${dateObj.y}-${dateObj.m}-${dateObj.d} 23:59`).getTime() / 1000)
      this.humidifierMap.tableLoading = true
      const {data} = await DeviceAPI.getDeviceStatusHistory(serialId, fromDate, toDate, '01')
      this.humidifierMap.tableLoading = false
      return this.parseHumidifierHistoryByDay(data.history)
    },
    parseHumidifierHistoryByDay (list, fmt) {
      return Array.from(list.concat(list)).map(item => {
        const temperature = +parseInt(item.status.slice(2, 4), 16).toString(10) - 30
        const humidifier = +parseInt(item.status.slice(6, 8), 16).toString(10)
        const time = Helper.parseTime(new Date(item.time * 1000), fmt || '{h}:{i}')
        return {
          temperature,
          humidifier,
          time
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
      // this.humidifierMap.list = await this.getHumidifierStatusHistoryByWeek(row.serialId)
      // this.humidifierMap.chartList = await this.getHumidifierStatusHistoryByDay(row.serialId)

      // const humidifierList = this.humidifierMap.list
      // const charList = this.humidifierMap.chartList
      // const isCharListValid = charList && charList.length
      // this.humidifierMap.tableData = humidifierList
      // this.humidifierMap.isCharListValid = isCharListValid
      // if (isCharListValid) {
      //   this.humidifierMap.labels = charList.map(item => item.time)
      //   const temperature = charList.map(item => item.temperature)
      //   const humidifier = charList.map(item => item.humidifier)
      //   this.humidifierMap.series.push({
      //     name: '温度',
      //     type: 'line',
      //     data: temperature
      //   })
      //   this.humidifierMap.series.push({
      //     name: '湿度',
      //     type: 'bar',
      //     data: humidifier
      //   })
      // }
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
