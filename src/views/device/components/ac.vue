<template>
  <div class="transponder-wrapper">
    <div class="transponder list" v-loading="loading">
      <div class="item" :class="{active: item.index === currentDevice.index}" v-for="(item, index) in transponderList" :key="index" @click="currentDevice = item">
        <p class="item-icon">
          <i class="obicon obicon-ac"></i>
        </p>
        <p>{{item.name}}</p>
      </div>
      <p class="tips" v-if="!transponderList.length">{{$t('smart.obox.ac', {FIELD: ''})}}</p>
    </div>
    <div class="controller" v-if="isValidAc()" v-loading="controlPanelLoading">
      <div class="panel">
        <div class="templure">
          <p>{{airCondition.isPowerOn ? airAction.templure : '--'}}<span>℃</span></p>
          <p>{{$t('smart.obox.ac', {FIELD: 'temperature'})}}</p>
        </div>
        <div class="control-style">
          <div class="mode">{{airCondition.isPowerOn ? speedFilter(airAction.speed) : '--'}} {{$t('smart.obox.ac', {FIELD: 'speed'})}}</div>
          <div class="fans">{{airCondition.isPowerOn ? modeFilter(airAction.mode) : '--'}} {{$t('smart.obox.ac', {FIELD: 'mode'})}}</div>
        </div>
        <div class="btn-controller">
          <div class="btn" :class="{inactive: !isFanSpeedEnable()}">
            <i class="obicon obicon-wing-o" @click="keyHandler(1)"></i>
            <p>{{$t('smart.obox.ac', {FIELD: 'fans'})}}</p>
          </div>
          <div class="btn" :class="{on: airCondition.isPowerOn, off: !airCondition.isPowerOn}">
            <i class="obicon obicon-power" @click="keyHandler(0)"></i>
            <p>{{$t('smart.obox.ac', {FIELD: 'switch'})}}</p>
          </div>
          <div class="btn" :class="{inactive: !airCondition.isPowerOn}">
            <i class="obicon obicon-mode-o" @click="keyHandler(2)"></i>
            <p>{{$t('smart.obox.ac', {FIELD: 'mode'})}}</p>
          </div>
        </div>
        <div class="btn-controller templure" :class="{inactive: !isTemplureEnable()}">
          <i class="obicon obicon-minus" @click="keyHandler(3, -1, isTemplureEnable())"></i>
          <p>{{$t('smart.obox.ac', {FIELD: 'temperature'})}}</p>
          <i class="obicon obicon-plus" @click="keyHandler(3, 1, isTemplureEnable())"></i>
        </div>
      </div>
    </div>
    <div class="controller" v-else-if="isCustomKey" v-loading="controlPanelLoading">
      <div class="panel" style="height: 424px; overflow-y: auto; ">
        <div class="custom_key">
          <!-- <el-radio-group v-model="customKeyPicker" size="small" >
            <el-radio-button :label="item" border v-for="(item, index) in customKeyList" :key="index" @click.native="customKeyAction"></el-radio-button>
          </el-radio-group> -->
          <el-button style="margin-top: 10px;" size="small" v-for="(item, index) in customKeyList" :key="index" @click="customKeyAction(item)">{{item.key}}</el-button>
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
      },
      customKeyPicker: '',
      customKeyList: []
    }
  },
  watch: {
    serialId (val) {
      this.getTransponderDeviceList(val)
    },
    currentDevice (device) {
      if (!device) return
      if (device.deviceType === 0) {
        this.customKeyList = device.extendsKeys || []
      }
    }
  },
  mounted () {
    this.getTransponderDeviceList(this.serialId)
  },
  computed: {
    isCustomKey () { // 是否学习按键
      return this.transponderList.length && this.currentDevice.deviceType === 0
    }
  },
  methods: {
    isValidAc () { // 是否空调
      return this.transponderList.length && TypeHint.isAcDevice(this.currentDevice.deviceType)
    },
    speedFilter (val) {
      return {0: this.$t('smart.obox.ac', {FIELD: 'auto'}), 1: this.$t('smart.obox.ac', {FIELD: 'weak'}), 2: this.$t('smart.obox.ac', {FIELD: 'medium'}), 3: this.$t('smart.obox.ac', {FIELD: 'strong'})}[val] || this.$t('smart.obox.ac', {FIELD: 'auto'})
    },
    modeFilter (val) {
      return {0: this.$t('smart.obox.ac', {FIELD: 'auto'}), 1: this.$t('smart.obox.ac', {FIELD: 'cold'}), 2: this.$t('smart.obox.ac', {FIELD: 'dehum'}), 3: this.$t('smart.obox.ac', {FIELD: 'supply'}), 4: this.$t('smart.obox.ac', {FIELD: 'hot'})}[val] || this.$t('smart.obox.ac', {FIELD: 'cold'})
    },
    isTemplureEnable () {
      return this.airCondition.isPowerOn && (this.airAction.mode === 4 || this.airAction.mode === 1)
    },
    isFanSpeedEnable () {
      return this.airCondition.isPowerOn && ([0, 1, 4].includes(this.airAction.mode))
    },
    keyHandler (type, subtype, temperatureEnable) {
      if (temperatureEnable === false) return
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
              message: this.$t('smart.obox.message', {MESSAGE: 'airCondition'}) + (this.airCondition.isPowerOn ? this.$t('message.status', {STATUS: 'on'}) : this.$t('message.status', {STATUS: 'off'}))
            })
          } else {
            this.$message({
              title: false,
              type: 'error',
              message: this.$t('smart.obox.message', {MESSAGE: 'setFail'})
            })
            this.airCondition.isPowerOn = !this.airCondition.isPowerOn
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
        if (!this.isFanSpeedEnable()) return
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
            message: this.$t('smart.obox.message', {MESSAGE: 'direct'})
          })
        } else {
          this.$message({
            title: false,
            type: 'error',
            message: this.$t('smart.obox.message', {MESSAGE: 'setFail'})
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
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getActionKey () {
      let hasVW = ''
      let hasHW = ''
      if (panelHandler.hasVerticalWind(this.currentDevice.keys)) {
        hasVW = 0
      }
      if (panelHandler.hasHorizontalWind(this.currentDevice.keys)) {
        hasHW = 0
      }
      return panelHandler.getAirConditionKeys(this.airAction.templure, this.airAction.mode, this.airAction.speed, hasVW, hasHW)
    },
    customKeyAction (item) {
      this.controlPanelLoading = true
      DeviceAPI.setAcAction(this.serialId, this.currentDevice.index, item.key).then(res => {
        if (res.message.includes('success')) {
          this.$message({
            type: 'success',
            message: this.$t('smart.obox.message', {MESSAGE: 'direct'})
          })
        } else {
          this.$message({
            title: false,
            type: 'error',
            message: this.$t('smart.obox.message', {MESSAGE: 'setFail'})
          })
        }
        this.controlPanelLoading = false
      }).catch(() => {
        this.controlPanelLoading = false
      })
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
  .custom_key{
    margin-top: 10px;
    .el-radio-button{
      margin: 10px;
    }
    .el-button--primary {
      color: #FFFFFF;
      background-color: #409EFF;
      border-color: #409EFF;
      background-image: none;
    }
    .el-button--primary:hover, .el-button--primary:focus {
      background: #66b1ff;
      border-color: #66b1ff;
      color: #FFFFFF;
    }
    .el-button--info {
      color: #FFFFFF;
      background-color: #909399;
      border-color: #909399;
    }
    .el-button--info:hover, .el-button--info:focus {
      background: #a6a9ad;
      border-color: #a6a9ad;
      color: #FFFFFF;
    }
    .el-button{
      margin-top: 10px;
      border: 1px solid #dcdfe6;
    }
    .el-button:hover, .el-button:focus {
      background-color: #049dec;
      color: #fff;
    }
    .el-radio-button .el-radio-button__inner{
      border: 1px solid #DCDFE6;
    }
    .el-radio-button:first-child .el-radio-button__inner,
    .el-radio-button:last-child .el-radio-button__inner{
      border-radius: 0;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      border-color: none;
    }
  }
}
</style>
