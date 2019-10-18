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
import HumifierChart from './components/humifier-chart'
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
      addDeviceSelected: {},
      humidifierMap: {
        tableLoading: true,
        list: [],
        chartList: []
      }
    }
  },
  components: { BaseTable, DeviceHistory, DeviceCreate, HumifierChart },
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
        type: 'expand',
        renderBody (h, row) {
          if (Suit.typeHints.isHumidifierSensors(row.device_child_type)) {
            !that.humidifierMap.list.length && that.getHumidifierStatusHistoryByDay(row.serialId)
            const tableData = that.humidifierMap.list
            !that.humidifierMap.chartList.length && that.getHumidifierStatusHistoryByWeek(row.serialId)
            let labels = []
            const series = []
            if (that.humidifierMap.chartList.length) {
              labels = that.humidifierMap.chartList.map(item => item.time)
              const temperature = that.humidifierMap.chartList.map(item => item.temperature)
              const humidifier = that.humidifierMap.chartList.map(item => item.humidifier)
              series.push({
                name: '温度',
                type: 'line',
                data: temperature
              })
              series.push({
                name: '湿度',
                type: 'bar',
                data: humidifier
              })
            }
            return [
              <div class="expand humidifier">
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
                    <BaseTable
                      v-loading={that.humidifierMap.tableLoading}
                      stripe border
                      height="360px"
                      showPagination={false}
                      tableData={tableData}
                      columns={[{label: '温度', prop: 'temperature', align: 'center'}, {label: '湿度', prop: 'humidifier', align: 'center'}, {label: '时间', prop: 'time', align: 'center'}]}>
                    </BaseTable>
                  </el-tab-pane>
                  <el-tab-pane label="一周数据" style="max-height: 400px;">
                    {that.humidifierMap.chartList.length && <HumifierChart data={series} xAxis={labels} style="margin: 0 auto;"></HumifierChart>}
                  </el-tab-pane>
                </el-tabs>
              </div>
            ]
          }
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
    getHumidifierStatusHistoryByWeek (serialId) {
      const now = new Date().getTime()
      const toDate = parseInt(now / 1000)
      const fromDate = parseInt((now - (6 * 24 * 60 * 60 * 1000)) / 1000)
      DeviceAPI.getDeviceStatusHistory(serialId, fromDate, toDate, '02').then(({data}) => {
        this.humidifierMap.chartList = this.parseHumidifierHistoryByDay(data.history, '{m}-{d}')
      })
    },
    getHumidifierStatusHistoryByDay (serialId) {
      const date = new Date()
      const dateObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate()
      }
      const fromDate = parseInt(new Date(`${dateObj.y}-${dateObj.m}-${dateObj.d} 00:00`).getTime() / 1000)
      const toDate = parseInt(new Date(`${dateObj.y}-${dateObj.m}-${dateObj.d} 23:59`).getTime() / 1000)
      this.humidifierMap.tableLoading = true
      DeviceAPI.getDeviceStatusHistory(serialId, fromDate, toDate, '01').then(({data}) => {
        this.humidifierMap.tableLoading = false
        this.humidifierMap.list = this.parseHumidifierHistoryByDay(data.history)
      })
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
      let {deviceType, deviceSubType} = this.addDeviceSelected
      const {oboxId} = this.addDeviceSelected
      deviceType = Suit.converter.toDecimal(deviceType, 16)
      deviceSubType = Suit.converter.toDecimal(deviceSubType, 16)
      DeviceAPI.searchToAddDevice(oboxId, deviceType, deviceSubType).then(res => {
        loader.close()
        this.responseHandler(res, `设备添加`)
        if (res.message.includes('success')) {
          this.addDeviceDialogVisible = false
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
      display: inline-block;
      width: 50%;
      // padding: 10px;
      padding: 50px;
      text-align: center;
      border-right: 1px solid #eee;
      &:last-of-type{
        border-right: none;
      }
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
