<template>
  <div class="action-container">
    <div v-if="is3KeyPanel()" class="list">
      <el-checkbox-group v-model="powers">
        <el-checkbox-button v-for="(item, index) in 3" :label="index+1" :key="index">
          <i class="obicon obicon-power"></i>
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div v-if="isTransponder()" class="list transponder" v-loading="transponderLoading">
      <div class="item" :class="{active: item.index === currentTransponderDevice.index}" v-for="(item, index) in transponderList" :key="index" @click="currentTransponderDevice = item">
        <p class="item-icon">
          <i class="obicon obicon-ac" :class="transponderIconFilter(item.deviceType)"></i>
        </p>
        <p>{{item.name}}</p>
        <p>{{item.rmodel}}</p>
      </div>
      <div class="controller" v-if="isAirCondition()">
        <div class="panel">
          <div class="templure">
            <p>{{airCondition.isPowerOn ? airAction.templure : '--'}}<span>℃</span></p>
            <p>温度</p>
          </div>
          <div class="control-style">
            <div class="mode">{{airCondition.isPowerOn ? speedFilter(airAction.speed): '--'}} 风速</div>
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
          <div class="btn-controller templure " :class="{inactive: !isTemplureEnable()}">
            <i class="obicon obicon-minus" @click="keyHandler(3, -1)"></i>
            <p>温度</p>
            <i class="obicon obicon-plus" @click="keyHandler(3, 1)"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="handleSelected">确 认</el-button>
    </div>
  </div>
</template>

<script>
import * as panelHandler from '@/oblink/panelHandler'
import DeviceAPI from '@/api/device'
export default {
  props: {
    actionObject: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      powers: [],
      powerStatus: [0, 0, 0],
      transponderList: [],
      currentTransponderDevice: {},
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
      // deviceType: '',
      // deviceSubType: ''
    }
  },
  watch: {
    powers (val) {
      this.changeStatus(val)
    }
  },
  computed: {
    deviceType () {
      return this.actionObject && this.actionObject.device_type
    },
    deviceSubType () {
      return this.actionObject && this.actionObject.device_child_type
    }
  },
  filters: {

  },
  mounted () {
    console.log(this.deviceType, this.deviceSubType)
    console.log(this.actionObject)
    this.isTransponder() && this.getTransponderDeviceList()
  },
  methods: {
    transponderIconFilter (type) {
      const iconMap = {
        7: 'obicon-ac',
        2: 'obicon-tv'
      }
      return {[iconMap[type]]: true}
    },
    is3KeyPanel () {
      return this.deviceType === '04' && this.deviceSubType === '21'
    },
    isTransponder () {
      return this.deviceType === '51'
    },
    isAirCondition () {
      return this.currentTransponderDevice.deviceType === 7
    },
    changeStatus (power) {
      this.powerStatus.forEach((element, index) => {
        const isExist = power.find(item => item === index + 1)
        this.powerStatus[index] = +!!isExist
      })
    },
    getTransponderDeviceList () {
      this.transponderLoading = true
      DeviceAPI.getTransponderDevice(this.actionObject.serialId).then(res => {
        if (res.status === 200) {
          this.transponderLoading = false
          this.transponderList = res.data.rs
        }
      })
    },
    handleSelected () {
      if (this.is3KeyPanel()) {
        // this.$emit('action-change', {action: panelHandler.changeSwitchButtonToAction(this.powerStatus, this.actionObject), extra: this.powerStatus}, false)
        this.$emit('action-change', {action: panelHandler.changeSwitchButtonToAction(this.powerStatus, this.actionObject), extra: this.powerStatus.map(item => (item ? '开' : '关')).join('/')}, false)
      } else if (this.isTransponder()) {
        const hasVW = panelHandler.hasVerticalWind(this.currentTransponderDevice.keys)
        const hasHW = panelHandler.hasHorizontalWind(this.currentTransponderDevice.keys)
        const action = {
          index: this.currentTransponderDevice.index,
          key: panelHandler.getAirConditionKeys(this.airAction.templure, this.airAction.mode, this.airAction.speed, +hasVW, +hasHW),
          keyType: 0,
          name: this.currentTransponderDevice.name
        }
        this.$emit('action-change', {action: panelHandler.changeAirConditionToAction(JSON.stringify(action), this.currentTransponderDevice), extra: action.name + action.key}, false)
      }
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
    }
  },
}
</script>

<style lang="scss" scoped>
.controller {
  border-top: 6px double #eee;
  padding-top: 20px;
  .panel{
    width: 380px;
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
      // &::after,
      // &::before{
      //   content: ' ';
      //   width: 1px;
      //   height: 1px;
      //   visibility: hidden;
      //   clear: both;
      // }
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
.footer{
  padding: 18px 8px 0;
  text-align: right;
}
</style>
<style lang="scss">
.action-container {
  .list {
    text-align: center;
    padding: 80px 10px;
    &.transponder{
      padding: 10px;
      text-align: left;
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
