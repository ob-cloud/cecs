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
            <el-option label='全部状态' value=''></el-option>
            <el-option label='在线' :value='true'></el-option>
            <el-option label='离线' :value='false'></el-option>
          </el-select>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备类型" v-model="search.device_type"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备名称" v-model="search.name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
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
const {default: TypeHint} = require('@/oblink/suit')
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
      currentTransponderDevice: {},
      tableData: [],
      columns: [],
      oboxList: [],
      dialogVisible: false,
      activeRecord: {},
      transponderList: [],
      transponderLoading: false,
      airCondition: {
        isPowerOn: false
      },
      airAction: {
        templure: 25,
        speed: 0,
        mode: 0,
        power: 0
      }
    }
  },
  components: { BaseTable, DeviceHistory },
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
        type: 'expand',
        renderBody (h, row) {
          const isTransponder = TypeHint.isTransponder(row.type)
          // !that.transponderList.length && that.getTransponderDeviceList(row.deviceId)
          if (isTransponder) {
            const list = that.transponderList[row.deviceId]
            const isValid = list && list.length
            return [
              <div class="transponder-wrapper">
              {
                isValid ? (
                  <div class="transponder list">
                  {
                    list.map((item, index) => {
                      return (<div class={item.index === that.currentTransponderDevice.index ? 'item active' : 'item'} onClick={() => that.currentTransponderDevice = item}>
                        <p class="item-icon">
                          <i class="obicon obicon-ac"></i>
                        </p>
                        <p>{item.name}</p>
                      </div>)
                    })
                  }
                </div>
                ) : ''
              }
              {
                (isValid && TypeHint.isAcDevice(that.currentTransponderDevice.deviceType)) ? (
                  <div class="controller">
                    <div class="panel">
                      <div class="templure">
                        <p>{that.airCondition.isPowerOn ? that.airAction.templure : '--'}<span>℃</span></p>
                        <p>温度</p>
                      </div>
                      <div class="control-style">
                        <div class="mode">{that.airCondition.isPowerOn ? that.speedFilter(that.airAction.speed) : '--'} 风速</div>
                        <div class="fans">{that.airCondition.isPowerOn ? that.modeFilter(that.airAction.mode) : '--'} 模式</div>
                      </div>
                      <div class="btn-controller">
                        <div class={!that.isFanSpeedEnable() ? 'btn inactive' : 'btn'}>
                          <i class="obicon obicon-wing-o" onClick={() => that.keyHandler(1)}></i>
                          <p>风扇</p>
                        </div>
                        <div class={that.airCondition.isPowerOn ? 'btn on' : 'btn off'}>
                          <i class="obicon obicon-power" onClick={() => that.keyHandler(0)}></i>
                          <p>开关</p>
                        </div>
                        <div class={that.airCondition.isPowerOn ? 'btn' : 'btn inactive'}>
                          <i class="obicon obicon-mode-o" onClick={() => that.keyHandler(2)}></i>
                          <p>模式</p>
                        </div>
                      </div>
                      <div class={!that.isTemplureEnable() ? 'btn-controller templure inactive' : 'btn-controller templure'}>
                        <i class="obicon obicon-minus" onClick={() => that.keyHandler(3, -1)}></i>
                        <p>温度</p>
                        <i class="obicon obicon-plus" onClick={() => that.keyHandler(3, 1)}></i>
                      </div>
                    </div>
                  </div>
                ) : ''
              }
              </div>
            ]
          }
        }
      }, {
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
      const remove = <el-button size="tiny" icon="el-icon-delete" onClick={() => this.removeDevice(row)}></el-button>
      return [remove]
    },
    getDeviceList () {
      this.tableLoading = true
      DeviceAPI.getWifiDeviceList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.configs
          Array.from(this.tableData).forEach(item => {
            this.prefetchTransponderData(item)
          })
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
    getTransponderDeviceList (serialId) {
      this.transponderLoading = true
      DeviceAPI.getTransponderDevice(serialId).then(res => {
        if (res.status === 200) {
          this.transponderLoading = false
          this.transponderList[serialId] = res.data.rs
          console.log('---- +++ ', this.transponderList)
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
    // onExpandChagne (row, current) {
    //   console.log(row, current)
    //   const isTransponder = TypeHint.isTransponder(row.type)
    //   this.getTransponderDeviceList(row.deviceId)
    // },
    prefetchTransponderData (row) {
      const isTransponder = TypeHint.isTransponder(row.type)
      isTransponder && this.getTransponderDeviceList(row.deviceId)
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
    speedFilter (val) {
      return {0: '自动', 1: '弱风', 2: '中风', 3: '强风'}[val] || '自动'
    },
    modeFilter (val) {
      return {0: '自动', 1: '制冷', 2: '抽湿', 3: '送风', 4: '制热'}[val] || '制冷'
    },
    isTemplureEnable () {
      return this.airCondition.isPowerOn && (this.airAction.mode === 4 || this.airAction.mode === 1)
    },
    isFanSpeedEnable () {
      return this.airCondition.isPowerOn && ([0, 1, 4].includes(this.airAction.mode))
    },
    keyHandler (type, subtype) {
      if (type === 0) {
        this.airCondition.isPowerOn = !this.airCondition.isPowerOn
        this.airAction = {
          templure: 26,
          speed: 0,
          mode: 1,
          power: 0
        }
        return
      }
      if (!this.airCondition.isPowerOn) return
      if (subtype && [1, 4].includes(this.airAction.mode)) {
        this.airAction.templure += subtype
        this.airAction.templure < 16 && (this.airAction.templure += 1)
        this.airAction.templure > 30 && (this.airAction.templure -= 1)
      } else if (type === 1) {
        this.airAction.speed += 1
        this.airAction.speed > 3 && (this.airAction.speed = 0)
      } else if (type === 2) {
        this.airAction.mode += 1
        this.airAction.mode > 4 && (this.airAction.mode = 0)
        if ([2, 3].includes(this.airAction.mode)) this.airAction.speed = 1
        this.airAction.templure = 26
      }
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
<style lang="scss">
.transponder-wrapper {
  .controller {
    // border-top: 6px double #eee;
    // padding-top: 20px;
    display: inline-block;
    width: 35%;
    vertical-align: top;
    .panel{
      width: 330px;
      text-align: center;
      margin: 0 auto;
      border: 1px solid #eee;
      border-radius: 14px;
      background: #f3f3f3;
      overflow: hidden;
      padding-bottom: 30px;
      box-shadow: 1px 1px 2px 1px #f2f2f2;
      user-select: none;
    }
    .templure{
      padding: 30px 0 20px;
      background: #fff;
      > p{
        font-size: 26px;
        span{
          color: #999;
          font-size: 14px;
          margin-left: 4px;
        }
        &:last-of-type{
          font-size: 14px;
        }
      }
    }
    .control-style{
      background: #fff;
      div{
        display: inline-block;
        width: 50%;
        padding: 30px;
      }
    }
    .btn-controller{
      margin-top: 30px;
      padding: 10px;

      &.templure{
        background: transparent;
        width: 50%;
        margin: 0 auto;
        background: #fff;
        border-radius: 40px;
        margin-top: 30px;
        padding: 16px 0;

        i,p{
          display: inline-block;
          width: 30%;
          font-size: 16px;
        }
        i{
          color: #3e3b3b;
          cursor: pointer;
        }
      }
      &.templure.inactive i,
      & .btn.inactive i{
        color: #eee;
      }
      .btn{
        display: inline-block;
        width: 30%;
        padding: 10px;
      }
    }
    .btn {
      i{
        font-size: 26px;
        padding: 6px;
        background: #fff;
        border-radius: 100%;
        border: 1px solid #eee;
        cursor: pointer;
        transition: all .3s;
        color: #3e3b3b;
      }
      p{
        margin-top: 14px!important;
      }
    }
    .btn.off i {
      color: #999;
    }
    .btn.on i {
      color: rgb(241, 102, 102);
    }
  }

  .list {
    text-align: center;
    padding: 80px 10px;
    &.transponder{
      padding: 10px;
      display: inline-block;
      text-align: left;
      width: 65%;
      vertical-align: top;
      border: 1px solid #f2f2f2;
      border-radius: 14px;
      box-shadow: 0px 0px 2px 0px #f2f2f2;
      max-height: 430px;
      height: 430px;
    }
    &.transponder .item{
      display: inline-block;
      width: 140px;
      // height: 80px;
      overflow: hidden;
      border: 1px solid #999;
      border-radius: 4px;
      padding: 10px;
      margin: 5px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      transition: all .3s;

      &.active{
        border-color: #409EFF;
      }
    }
    &.transponder .item-icon{
      text-align: center;
      > i{
        font-size: 40px;
      }
    }
    &.transponder p:last-of-type{
      color: #999;
      margin-top: 4px;
      font-size: 12px;
    }
    .el-checkbox-button{
      width: 30%;
    }
    .el-checkbox-button__inner{
      border: 1px solid #DCDFE6;
      border-radius: 4px;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner{
      border-color: #409EFF;
    }
    .obicon{
      font-size: 16px;
    }
  }
}

</style>
