<template>
  <div class="action-container">
    <div v-if="is3KeyPanel()" class="list">
      <el-checkbox-group v-model="powers">
        <el-checkbox-button v-for="(item, index) in 1" :label="index+1" :key="index">
          <i class="obicon obicon-power"></i>
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div v-if="isTransponder()" class="list transponder" v-loading="transponderLoading">
      <div v-if="actionObject.serialId && !transponderList.length" style="text-align:center;">{{$t('smart.obox.ac', {FIELD: ''})}}</div>
      <div class="item" :class="{active: item.index === currentTransponderDevice.index}" v-for="(item, index) in transponderList" :key="index" @click="currentTransponderDevice = item">
        <p class="item-icon">
          <i class="obicon obicon-ac" :class="transponderIconFilter(item.deviceType)"></i>
        </p>
        <p>{{item.name}}</p>
        <p>{{item.rmodel}}</p>
      </div>
      <div class="controller">
        <!-- transponderList.length === 0 -->
        <div class="tabPicker" v-if="tabPickerVisible">
          <el-radio-group v-model="tabActiveName" size="small">
            <el-radio-button label="cloud" style="display: block; margin: 0; border-radius: 0;">云端码库</el-radio-button>
            <el-radio-button label="custom"  style="display: block; margin: 10px 0; border-radius: 0;">学习按键</el-radio-button>
          </el-radio-group>
        </div>
        <div class="panel" v-if="tabActiveName ? tabActiveName === 'cloud' : isAirCondition()">
          <div class="templure">
            <p>{{airCondition.isPowerOn ? airAction.templure : '--'}}<span>℃</span></p>
            <p>{{$t('smart.obox.ac', {FIELD: 'temperature'})}}</p>
          </div>
          <div class="control-style">
            <div class="mode">{{airCondition.isPowerOn ? speedFilter(airAction.speed): '--'}} {{$t('smart.obox.ac', {FIELD: 'speed'})}}</div>
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
          <div class="btn-controller templure " :class="{inactive: !isTemplureEnable()}">
            <i class="obicon obicon-minus" @click="keyHandler(3, -1)"></i>
            <p>{{$t('smart.obox.ac', {FIELD: 'temperature'})}}</p>
            <i class="obicon obicon-plus" @click="keyHandler(3, 1)"></i>
          </div>
        </div>
        <!-- 学习按键区域 -->
        <div class="panel" v-if="tabActiveName ? tabActiveName === 'custom' : isCustomKeyBoard()" style="height: 424px; overflow-y: auto; " v-loading="customKeyLoading">
          <div class="custom_key">
            <el-radio-group v-model="customKeyPicker" size="small">
              <el-radio-button :label="item" border v-for="(item, index) in customKeyList" :key="index">{{item.name}} - {{item.key}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="handleSelected">{{$t('message.confirm')}}</el-button>
    </div>
  </div>
</template>

<script>
import * as panelHandler from '@/oblink/panelHandler'
import DeviceAPI from '@/api/device'
const {default: Suit} = require('@/common/suit')
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
      powerStatus: [0, 0, 0], // switcher panel controller panel status
      transponderList: [],
      currentTransponderDevice: {},
      transponderLoading: false,
      airCondition: {
        isPowerOn: false,
        isHanlePanel: false, // is handle controller panel keys
      },
      airAction: {
        templure: 26,
        speed: 0,
        mode: 0,
        power: 0
      },
      tabPickerVisible: false,
      tabActiveName: '', // 云端码库或学习按键 tab
      customKeyLoading: false,
      customKeyList: [],
      customKeyPicker: ''
      // deviceType: '',
      // deviceSubType: ''
    }
  },
  watch: {
    powers (val) {
      // this.changeStatus(val)
      this.changeStatus(val.length ? 1 : 0)
    },
    tabActiveName (val) {
      if (!val) return
      if (val === 'custom') {
        this.getCustomKeys()
      }
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
      return Suit.typeHints.isThreeKeySocketSwitch(this.deviceSubType)
      // return this.deviceType === '04' && this.deviceSubType === '21'
    },
    isTransponder () {
      return this.deviceType === '51'
    },
    isAirCondition () {
      return this.currentTransponderDevice.deviceType === 7
    },
    isCustomKeyBoard () {
      return this.currentTransponderDevice.deviceType === 0
    },
    isJustTouchPower () {
      // has touch the power key and other key's value is default
      return this.airCondition.isHanlePanel && (this.airAction.power === 0 || this.airAction.power === 1) && this.airAction.templure === 26 && this.airAction.speed === 0 && this.airAction.mode === 0
    },
    changeStatus (power) {
      // this.powerStatus.forEach((element, index) => {
      //   const isExist = power.find(item => item === index + 1)
      //   this.powerStatus[index] = +!!isExist
      // })
      this.powerStatus.fill(power)
    },
    getTransponderDeviceList () {
      this.transponderLoading = true
      if (!this.actionObject.serialId) { // 没有序列号
        this.transponderLoading = false
        this.currentTransponderDevice.deviceType = 7
        this.tabActiveName = 'cloud'
        this.tabPickerVisible = true
        return
      }
      DeviceAPI.getTransponderDevice(this.actionObject.serialId).then(res => {
        if (res.status === 200) {
          this.transponderList = res.data.rs
          this.tabPickerVisible = !this.transponderList.length
        }
        this.transponderLoading = false
      })
    },
    getCustomKeys () {
      this.customKeyLoading = true
      DeviceAPI.getIrCustomKeys().then(res => {
        if (res.status === 0) {
          this.customKeyList = res.data.records || []
        }
        this.customKeyLoading = false
      }).catch(() => {
        this.customKeyLoading = false
      })
      // setTimeout(() => {
      //   this.customKeyList = [{
      //     name: '大同1',
      //     index: 8327813,
      //     key: '风量小',
      //     tId: 0
      //   }, {
      //     name: '大同2',
      //     index: 83278133,
      //     key: '风量小1',
      //     tId: 0
      //   }, {
      //     name: '大同3',
      //     index: 83278123,
      //     key: '风量小2',
      //     tId: 0
      //   }, {
      //     name: '大同4',
      //     index: 83278153,
      //     key: '风量小3',
      //     tId: 0
      //   }]
      //   this.customKeyLoading = false
      // }, 2000)
    },
    handleSelected () {
      const room = {
        action_time: this.actionObject.action_time
      }
      if (this.is3KeyPanel()) {
        // this.$emit('action-change', {action: panelHandler.changeSwitchButtonToAction(this.powerStatus, this.actionObject), extra: this.powerStatus}, false)
        this.$emit('action-change', {action: panelHandler.changeSwitchButtonToAction(this.powerStatus, this.actionObject, room), extra: this.powerStatus[0] ? this.$t('message.switchStatus', {SWITCH: 'switchOn'}) : this.$t('message.switchStatus', {SWITCH: 'switchOff'})}, false)
      } else if (this.isTransponder()) {
        let keys = ''
        if (this.tabActiveName === 'custom') {
          if (!this.customKeyPicker) {
            return this.$message({
              title: false,
              type: 'warning',
              message: this.$t('smart.obox.ac', {FIELD: 'noKeyHandle'})
            })
          }
          keys = this.customKeyPicker.key
          this.currentTransponderDevice.index = this.customKeyPicker.index
          this.currentTransponderDevice.name = this.customKeyPicker.name
        } else {
          if (!this.airCondition.isHanlePanel) {
            return this.$message({
              title: false,
              type: 'warning',
              message: this.$t('smart.obox.ac', {FIELD: 'noKeyHandle'})
            })
          }

          if (this.isJustTouchPower()) { // get power keys
            keys = panelHandler.getAireConditionPowerKey(this.airAction.power)
          } else { // get other condition keys
            let hasVW = ''
            let hasHW = ''
            const isV3 = panelHandler.isV3Ac(this.currentTransponderDevice.rmodel)
            if (!isV3 && this.currentTransponderDevice.keys) {
              hasVW = +panelHandler.hasVerticalWind(this.currentTransponderDevice.keys)
              hasHW = +panelHandler.hasHorizontalWind(this.currentTransponderDevice.keys)
            }
            keys = this.currentTransponderDevice ? panelHandler.getAirConditionKeys(this.airAction.templure, this.airAction.mode, this.airAction.speed, hasVW, hasHW) : ''
          }
        }

        const action = {
          index: this.currentTransponderDevice.index,
          key: keys,
          keyType: 0,
          name: this.currentTransponderDevice.name || ''
        }
        this.airCondition.isHanlePanel = false
        this.$emit('action-change', {action: panelHandler.changeAirConditionToAction(JSON.stringify(action), {...this.currentTransponderDevice, deviceType: '51'}, room), extra: action.key}, false)
      }
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
    keyHandler (type, subtype) {
      if (type === 0) {
        this.airCondition.isPowerOn = !this.airCondition.isPowerOn
        this.airCondition.isHanlePanel = true
        this.airAction.power = +this.airCondition.isPowerOn
        // this.airAction = {
        //   templure: 26,
        //   speed: 0,
        //   mode: 1,
        //   power: 0
        // }
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
  position: relative;
  border-top: 6px double #eee;
  padding-top: 20px;

  .tabPicker{
    position: absolute;
    left: 20px;
    top: 20px;
  }
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
.tabPicker,
.custom_key{
  .el-radio-button:first-child .el-radio-button__inner,
  .el-radio-button:last-child .el-radio-button__inner{
    border-radius: 0;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    border-color: none;
  }
}
.custom_key{
  margin-top: 10px;
  .el-radio-button{
    margin: 10px;
  }
  .el-radio-button .el-radio-button__inner{
    border: 1px solid #DCDFE6;
  }
}
</style>
