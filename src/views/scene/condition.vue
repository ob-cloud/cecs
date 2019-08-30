<template>
  <div>
    <el-tabs v-model="conditionType" class="condition-type" type="border-card" @tab-click="onConditionTabClick">
      <el-tab-pane label="定时条件" name="1">
          <el-tabs tab-position="left" class="timing h200" v-model="conditionTimeType">
            <el-tab-pane label="日期" name="1">
              <el-date-picker
                class="picker"
                v-model="conditionModel.timingDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
              <el-time-picker
                class="picker"
                v-model="conditionModel.timingTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择时间">
              </el-time-picker>
            </el-tab-pane>
            <el-tab-pane label="星期" name="2">
              <div class="weeks">
                <el-radio-group v-model="conditionModel.week">
                  <el-radio-button type="plain" v-for="(week, index) in weeks" :key="index" :label="week.label"></el-radio-button>
                </el-radio-group>
                <el-time-picker
                  class="picker"
                  v-model="conditionModel.timingTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="选择时间">
                </el-time-picker>
              </div>
            </el-tab-pane>
          </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="联动条件" name="2" class="left h200">
        <div class="chain-device" :class="{active: item.serialId === chainActiveDevice.serialId}" v-for="(item, index) in chainDeviceList" :key="index" @click="onChainDeviceClick(item)">
          <p>{{item.name}}</p>
          <p>{{item.serialId}}</p>
          <p>{{item.online ? '在线' : '离线'}}</p>
        </div>
        <div class="chain-device-actions">
          <div class="chain-action__item" v-if="isSocket()">
            <p class="title">面板哪个按钮被按下</p>
            <div class="content">
              <el-radio v-model="conditionModel.socket" label="1" border>情景按钮1</el-radio>
              <el-radio v-model="conditionModel.socket" label="2" border>情景按钮2</el-radio>
              <el-radio v-model="conditionModel.socket" label="3" border>情景按钮3</el-radio>
              <el-radio v-model="conditionModel.socket" label="4" border>挥手感应</el-radio>
            </div>
          </div>
          <div class="chain-action__item" v-if="isLock()">
            <p class="title">门锁操作</p>
            <div class="content">
              <el-button type="plain" class="w140px">用户</el-button>
              <el-button type="plain" class="w140px">远程授权开锁</el-button>
              <el-button type="plain" class="w140px">卡开锁</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="遥控器" name="3" class="h200">

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DeviceAPI from '@/api/device'
const {default: Suit} = require('@/common/suit')
export default {
  name: 'scene-condition',
  props: {
    isLocal: {
      type: Boolean,
      default: true
    },
    deviceList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      conditionType: '1',
      conditionTimeType: '1',
      conditionModel: {
        timingDate: '',
        timingTime: '',
        week: '',
        socket: '',
        mainterm: '',
        subterm: ''
      },
      weeks: [{label: '星期一', value: '40'}, {label: '星期二', value: '20'}, {label: '星期三', value: '10'}, {label: '星期四', value: '08'}, {label: '星期五', value: '04'}, {label: '星期六', value: '02'}, {label: '星期日', value: '7f'}, {label: '每日', value: '80'}],
      chainDeviceList: [],
      chainActiveDevice: ''
    }
  },
  watch: {
    conditionModel: {
      deep: true,
      handler (val) {
        if (this.conditionType === '1') { // 时间
          let isValid = false
          const condition = new Array(8).fill('00', 0, 8)
          condition[1] = '08'
          if (this.conditionTimeType === '1') { // 日期
            if (val.timingDate) {
              const dateList = val.timingDate.split('-')
              condition[2] = Suit.converter.toHex(dateList[0].slice(2))
              condition[3] = Suit.converter.toHex(dateList[1])
              condition[4] = Suit.converter.toHex(dateList[2])
            }
          } else if (this.conditionTimeType === '2') { // 星期
            val.week && (condition[0] = this.weeks.find(item => item.label === val.week).value)
          }
          val.timingTime && (condition[5] = Suit.converter.toHex(val.timingTime.split(':')[0]))
          val.timingTime && (condition[6] = Suit.converter.toHex(val.timingTime.split(':')[1]))
          isValid = (val.timingDate || val.week) && val.timingTime
          this.$emit('condition-change', isValid ? {condition: condition.join(''), 'condition-type': '00'} : null)
        } else if (this.conditionType === '2') { // 联动

        }
      }
    }
  },
  methods: {
    getChainDeviceList () {
      if (this.chainDeviceList.length) return
      const chainList = this.deviceList.filter(item => {
        return this.isChainType(item.device_type, item.device_child_type, this.isLocal)
      })
      this.chainDeviceList = chainList
    },
    isChainType (deviceType, deviceSubType, isLocal) {
      return Suit.typeHints.isSensors(deviceType)
        || (Suit.typeHints.isFinger(deviceType) && !isLocal)
        || Suit.typeHints.isDoorLock(deviceType)
        || (Suit.typeHints.isSocketSwitch(deviceType) && (Suit.typeHints.isSceneSocketSwitch(deviceSubType) || Suit.typeHints.isMixSocketSwitch(deviceSubType)))
    },
    onCondAction (e) {
      const actionType = +e.target.dataset.type
      // this.conDialogVisible = false
      console.log(actionType)
    },
    onConditionTabClick (tab) {
      if (tab.name === '2') {
        this.getChainDeviceList()
      } else if (tab.name === '3') {
        DeviceAPI.getRemoter().then(res => {
          if (res.message.includes('success')) {
            console.log(res)
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '服务异常'
          })
        })
      }
    },
    onChainDeviceClick (device) {
      this.chainActiveDevice = device
      if (Suit.typeHints.isSocketSwitch(device.device_type)) {
        console.log()
      }
    },
    isSocket () {
      return Suit.typeHints.isSocketSwitch(this.chainActiveDevice.device_type)
    },
    isLock () {
      return Suit.typeHints.isDoorLock(this.chainActiveDevice.device_type)
    }
  },
}
</script>

<style lang="scss" scoped>
.close{
  font-size: 20px;
  color: #999;
  line-height: 41px;
  cursor: pointer;
}
.w8{
  width: 80%;
}
.w140px{
  width: 140px;
}
.w440px{
  width: 440px;
}
.h200{
  min-height: 200px;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.center{
  text-align: center;
}
.left{
  text-align: left;
}

.condition-type{
  list-style: none;
  text-align: center;
}
.timing{
  height: 200px;
}
.timing .picker{
  margin-left: 10px;
  margin-top: 20px;
}
.timing .weeks{
  width: 440px;
  margin: 10px auto 20px;
  text-align: center;
}
.timing .weeks .el-radio-button{
  margin-top: 10px;
  margin-right: 10px;
}
.chain-device{
  display: inline-block;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px;
  box-shadow: 1px 1px 2px #f2f2f2;
  margin-right: 10px;
  margin-top: 10px;
  transition: all .3s;
  cursor: pointer;
}
.chain-device.active,
.chain-device:hover{
  border-color: #409EFF;
}
.chain-device p{
  padding: 5px;
  font-size: 14px;
  color: #333;
}
.chain-device p:not(:first-child) {
  font-size: 12px;
  color: #666;
}
.chain-device-actions {
  margin-top: 20px;
}
.chain-action__item .title{
  color: #555;
  padding: 5px;
  border-bottom: 1px solid #eee;
}
.chain-action__item .content{
  padding: 10px;
}
.chain-action__item .content .el-radio{
  margin-right: 15px;
}
</style>
<style lang="css">
.condition-type.el-tabs--border-card,
.box-card .el-tabs--border-card,
.box-card.el-card.is-always-shadow{
  box-shadow: none;
}
.box-card .el-card__header{
  padding: 0 20px;
}
.box-card .el-card__body{
  padding: 10px 0 20px;
}
.condition-type > .el-tabs__header{
  background: #f2f2f2;
}
.timing .el-radio-button .el-radio-button__inner{
  border-left: 1px solid #DCDFE6;
  width: 80px;
  border-radius: 4px;
}

.timing .el-radio-button__orig-radio:checked + .el-radio-button__inner{
  border-left-color: #409EFF;
}
</style>
