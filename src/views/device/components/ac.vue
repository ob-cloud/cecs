<template>
  <div class="transponder-wrapper">
    <div class="transponder list" v-loading="loading">
      <div class="item" :class="{active: item.index === currentDevice.index}" v-for="(item, index) in transponderList" :key="index" @click="currentDevice = item">
        <p class="item-icon">
          <i class="obicon obicon-ac"></i>
        </p>
        <p>{{item.name}}</p>
      </div>
      <p class="tips" v-if="!transponderList.length">无数据</p>
    </div>
    <div class="controller" v-if="isValidAc()" v-loading="controlPanelLoading">
      <div class="panel">
        <div class="templure">
          <p>{{airCondition.isPowerOn ? airAction.templure : '--'}}<span>℃</span></p>
          <p>温度</p>
        </div>
        <div class="control-style">
          <div class="mode">{{airCondition.isPowerOn ? speedFilter(airAction.speed) : '--'}} 风速</div>
          <div class="fans">{{airCondition.isPowerOn ? modeFilter(airAction.mode) : '--'}} 模式</div>
        </div>
        <div class="btn-controller">
          <div class="btn" :class="{inactive: !isFanSpeedEnable()}">
            <i class="obicon obicon-wing-o" @click="keyHandler(1)"></i>
            <p>风扇</p>
          </div>
          <div class="btn" :class="{on: airCondition.isPowerOn, off: !airCondition.isPowerOn}">
            <i class="obicon obicon-power" @click="keyHandler(0)"></i>
            <p>开关</p>
          </div>
          <div class="btn" :class="{inactive: !airCondition.isPowerOn}">
            <i class="obicon obicon-mode-o" @click="keyHandler(2)"></i>
            <p>模式</p>
          </div>
        </div>
        <div class="btn-controller templure" :class="{inactive: !isTemplureEnable()}">
          <i class="obicon obicon-minus" @click="keyHandler(3, -1)"></i>
          <p>温度</p>
          <i class="obicon obicon-plus" @click="keyHandler(3, 1)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceAPI from '@/api/device'
const {default: TypeHint} = require('@/oblink/suit')
import * as panelHandler from '@/oblink/panelHandler'
export default {
  props: {
    serialId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      controlPanelLoading: false,
      currentDevice: {},
      transponderList: [],
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
  watch: {
    serialId (val) {
      this.getTransponderDeviceList(val)
    }
  },
  mounted () {
    this.getTransponderDeviceList(this.serialId)
  },
  methods: {
    isValidAc () {
      return this.transponderList.length && TypeHint.isAcDevice(this.currentDevice.deviceType)
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
      if (type === 0) { // 电源
        this.airCondition.isPowerOn = !this.airCondition.isPowerOn
        this.airAction = {
          templure: 26,
          speed: 0,
          mode: 1,
          power: 0
        }
        this.controlPanelLoading = true
        DeviceAPI.setAcAction(this.serialId, this.currentDevice.index, this.airCondition.isPowerOn ? 'on' : 'off').then(res => {
          if (res.message.includes('success')) {
            this.$message({
              type: 'success',
              message: '电源开关' + (this.airCondition.isPowerOn ? '已开' : '已关')
            })
          }
          this.controlPanelLoading = false
        }).catch(() => {
          this.controlPanelLoading = false
        })
        return
      }
      if (!this.airCondition.isPowerOn) return
      if (subtype && [1, 4].includes(this.airAction.mode)) { // 温度
        this.airAction.templure += subtype
        this.airAction.templure < 16 && (this.airAction.templure += 1)
        this.airAction.templure > 30 && (this.airAction.templure -= 1)
      } else if (type === 1) { // 风扇
        this.airAction.speed += 1
        this.airAction.speed > 3 && (this.airAction.speed = 0)
      } else if (type === 2) { // 模式
        this.airAction.mode += 1
        this.airAction.mode > 4 && (this.airAction.mode = 0)
        if ([2, 3].includes(this.airAction.mode)) this.airAction.speed = 1
        this.airAction.templure = 26
      }
      this.controlPanelLoading = true
      DeviceAPI.setAcAction(this.serialId, this.currentDevice.index, this.getActionKey()).then(res => {
        if (res.message.includes('success')) {
          this.$message({
            type: 'success',
            message: '操作指令已发送成功'
          })
        }
        this.controlPanelLoading = false
      }).catch(() => {
        this.controlPanelLoading = false
      })
    },
    getTransponderDeviceList (serialId) {
      if (!serialId) return
      this.loading = true
      DeviceAPI.getTransponderDevice(serialId).then(res => {
        if (res.status === 200) {
          this.transponderList = res.data.rs
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getActionKey () {
      const hasVW = panelHandler.hasVerticalWind(this.currentDevice.keys)
      const hasHW = panelHandler.hasHorizontalWind(this.currentDevice.keys)
      return panelHandler.getAirConditionKeys(this.airAction.templure, this.airAction.mode, this.airAction.speed, +hasVW, +hasHW)
    }
  },
}
</script>

<style lang="scss" scoped>

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
      // box-shadow: 1px 1px 2px 1px #f2f2f2;
      box-shadow: 0px 0px 2px 0px #848080;
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
      // color: #999;
      color: rgb(241, 102, 102);
    }
    .btn.on i {
      // color: rgb(6, 202, 68);
      color: rgb(18, 234, 247);
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
      // box-shadow: 0px 0px 2px 0px #f2f2f2;
      box-shadow: 0px 0px 2px 0px #848080;
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
    .tips{
      text-align: center;
      vertical-align: middle;
      line-height: 100px;
      font-size: 14px;
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
