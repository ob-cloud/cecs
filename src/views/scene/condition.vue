<template>
  <div>
    <el-tabs v-model="conditionType" class="condition-type" type="border-card" @tab-click="onConditionTabClick">
      <el-tab-pane label="定时条件" name="1">
          <el-tabs tab-position="left" class="timing h200" v-model="conditionTimeType">
            <el-tab-pane label="日期" name="1">
              <el-date-picker
                class="picker"
                v-model="conditionModel.date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
              <el-time-picker
                class="picker"
                v-model="conditionModel.time"
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
                  v-model="conditionModel.time"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="选择时间">
                </el-time-picker>
              </div>
            </el-tab-pane>
          </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="联动条件" name="2" class="left h200 chain-list">
        <div class="chain-device" :class="{active: item.serialId === chainActiveDevice.serialId}" v-for="(item, index) in chainDeviceList" :key="index" @click="onChainDeviceClick(item)">
          <p>{{item.name}}</p>
          <p>{{item.serialId}}</p>
          <p>{{item.device_type | deviceTypeDescriptFilter(item.device_child_type)}}</p>
          <p style="text-align: right;">{{item.online ? '在线' : '离线'}}</p>
        </div>
        <div class="chain-device-actions">
          <div class="chain-action__item" v-if="isSocket()">
            <p class="title">面板哪个按钮被按下</p>
            <div class="content" v-if="isSixScenePanelSocket()">
              <el-radio v-model="conditionModel.pick" label="1" border>情景按钮1</el-radio>
              <el-radio v-model="conditionModel.pick" label="2" border>情景按钮2</el-radio>
              <el-radio v-model="conditionModel.pick" label="3" border>情景按钮3</el-radio>
              <el-radio v-model="conditionModel.pick" label="4" border>情景按钮4</el-radio>
              <el-radio v-model="conditionModel.pick" label="5" border>情景按钮5</el-radio>
              <el-radio v-model="conditionModel.pick" label="6" border>情景按钮6</el-radio>
            </div>
            <div class="content" v-else>
              <el-radio v-model="conditionModel.pick" label="1" border>情景按钮1</el-radio>
              <el-radio v-model="conditionModel.pick" label="2" border>情景按钮2</el-radio>
              <el-radio v-model="conditionModel.pick" label="3" border>情景按钮3</el-radio>
              <el-radio v-model="conditionModel.pick" label="4" border>挥手感应</el-radio>
            </div>
          </div>
          <div class="chain-action__item" v-else-if="isLock()">
            <p class="title">门锁操作</p>
            <div class="content">
              <el-radio v-model="conditionModel.pick" label="1" border>用户</el-radio>
              <el-radio v-model="conditionModel.pick" label="2" border>远程授权开锁</el-radio>
              <el-radio v-model="conditionModel.pick" label="3" border>卡开锁</el-radio>
            </div>
          </div>
          <div class="chain-action__item" v-else-if="isGate()">
            <p class="title">门窗磁操作</p>
            <div class="content">
              <el-radio v-model="conditionModel.pick" label="0" border>关</el-radio>
              <el-radio v-model="conditionModel.pick" label="1" border>开</el-radio>
            </div>
          </div>
          <div class="chain-action__item" v-else-if="isHumidifier()">
            <div class="title">
              <el-radio-group v-model="templureAction">
                <el-radio-button type="plain" label="0">温度</el-radio-button>
                <el-radio-button type="plain" label="1">湿度</el-radio-button>
              </el-radio-group>
              <div class="humidifier-text">
                <div>
                  <span>温度</span>
                  {{conditionModel.symbolT && conditionModel.symbolT !== '无' ? `${conditionModel.symbolT} ${conditionModel.templure}℃` : '无'}}
                </div>
                <div>
                  <span>湿度</span>
                  {{conditionModel.symbolH && conditionModel.symbolH !== '无' ? `${conditionModel.symbolH} ${conditionModel.humidifier}%` : '无'}}
                </div>
              </div>
            </div>
            <div class="content">
              <template v-if="templureAction === '0'">
                <el-radio v-model="conditionModel.symbolT" :label="key" border v-for="(item, key) in templureCondition" :key="item">{{key}}</el-radio>
              </template>
              <template v-if="templureAction === '1'">
                <el-radio v-model="conditionModel.symbolH" :label="key" border v-for="(item, key) in templureCondition" :key="item">{{key}}</el-radio>
              </template>
            </div>
            <div class="content" v-if="templureAction === '0' && conditionModel.symbolT && conditionModel.symbolT !== '无'">
              <el-radio class="templure-value" v-model="conditionModel.templure" :label="item" border v-for="(item, index) in templureValue" :key="index">{{item}}</el-radio>
            </div>
            <div class="content" v-if="templureAction === '1' && conditionModel.symbolH && conditionModel.symbolH !== '无'">
              <el-radio class="templure-value" v-model="conditionModel.humidifier" :label="item" border v-for="(item, index) in humidifierValue" :key="index">{{item}}</el-radio>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="footer">
      <el-button type="primary" @click="handleSelectedCondition">确 认</el-button>
    </div>
  </div>
</template>

<script>
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
        date: '',
        time: '',
        week: '',
        pick: '',
        name: '',
        type: '联动条件',
        action: '',
        symbolT: '',
        symbolH: '',
        templure: '',
        humidifier: '',
        conditionType: '',
        condition: ''
      },
      weeks: [{label: '星期一', value: '40'}, {label: '星期二', value: '20'}, {label: '星期三', value: '10'}, {label: '星期四', value: '08'}, {label: '星期五', value: '04'}, {label: '星期六', value: '02'}, {label: '星期日', value: '7f'}, {label: '每日', value: '80'}],
      templureCondition: {'>': '49', '=': '4a', '>=': '4b', '<': '4c', '<=': '4e', '无': ''},
      templureValue: [],
      humidifierValue: [],
      templureAction: '0',
      tempHumCondition: [],
      chainDeviceList: [],
      chainActiveDevice: ''
    }
  },
  filters: {
    deviceTypeDescriptFilter (val, deviceSubType) {
      return Suit.getDeviceTypeDescriptor(val, deviceSubType)
    }
  },
  watch: {
    conditionModel: {
      deep: true,
      handler (val) {
        if (this.conditionType === '1') { // 时间

        } else if (this.conditionType === '2') { // 联动

        }
      }
    },
    'conditionModel.symbolT' (val) {
      if (this.templureCondition[val]) {
        this.tempHumCondition[0] = this.templureCondition[val]
      } else {
        this.tempHumCondition[0] = '4C'
        this.tempHumCondition[1] = 'FF'
        this.templureAction = '1'
      }
      this.tempHumCondition[4] = '000000000000'
    },
    'conditionModel.symbolH' (val) {
      if (this.templureCondition[val]) {
        this.tempHumCondition[2] = this.templureCondition[val]
      } else {
        this.tempHumCondition[2] = '00'
        this.tempHumCondition[3] = '00'
      }
      this.tempHumCondition[4] = '000000000000'
    },
    'conditionModel.templure' (val) {
      if (val) {
        this.tempHumCondition[1] = Suit.converter.toHex(+val + 30, 10)
        this.templureAction = '1'
      }
    },
    'conditionModel.humidifier' (val) {
      if (val) {
        this.tempHumCondition[3] = Suit.converter.toHex(val, 10)
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
    getTemplureValue () {
      for (let i = 0; i < 52; i++) {
        this.templureValue[i] = '' + (-11 + i)
      }
    },
    getHumidifierValue () {
      for (let i = 0; i < 20; i++) {
        this.humidifierValue[i] = '' + (i * 5)
      }
    },
    onConditionTabClick (tab) {
      if (tab.name === '2') {
        this.getChainDeviceList()
      }
    },
    onChainDeviceClick (device) {
      this.chainActiveDevice = device
      if (this.isHumidifier()) {
        this.getTemplureValue()
        this.getHumidifierValue()
      }
    },
    isSocket () {
      return Suit.typeHints.isSocketSwitch(this.chainActiveDevice.device_type)
    },
    isLock () {
      return Suit.typeHints.isDoorLock(this.chainActiveDevice.device_type)
    },
    isGate () {
      return Suit.typeHints.isGateSensors(this.chainActiveDevice.device_child_type)
    },
    isHumidifier () {
      return Suit.typeHints.isHumidifierSensors(this.chainActiveDevice.device_child_type)
    },
    isSixScenePanelSocket () {
      const type = `${Suit.converter.toDecimal(this.chainActiveDevice.device_type, 16)}${Suit.converter.toDecimal(this.chainActiveDevice.device_child_type, 16)}`
      return type === '0436'
    },
    getDateTimeCondition () {
      let isValid = false
      const condition = new Array(8).fill('00', 0, 8)
      condition[1] = '08'
      const val = this.conditionModel
      if (this.conditionTimeType === '1') { // 日期
        if (val.date) {
          const dateList = val.date.split('-')
          condition[2] = Suit.converter.toHex(dateList[0].slice(2), 10)
          condition[3] = Suit.converter.toHex(dateList[1], 10)
          condition[4] = Suit.converter.toHex(dateList[2], 10)
        }
      } else if (this.conditionTimeType === '2') { // 星期
        val.week && (condition[0] = this.weeks.find(item => item.label === val.week).value)
      }
      val.time && (condition[5] = Suit.converter.toHex(val.time.split(':')[0], 10))
      val.time && (condition[6] = Suit.converter.toHex(val.time.split(':')[1], 10))
      isValid = (val.date || val.week) && val.time
      return isValid && condition.join('')
    },
    getDeviceCondition () {
      let condition = ''
      if (this.isSocket()) {
        const conditionPrefix = {
          0: '4a01',
          1: '4a02',
          2: '4a04',
          3: '4a08',
          4: '4a10',
          5: '4a20',
          6: '4a40',
          7: '4a80'
        }[this.conditionModel.pick]
        condition += conditionPrefix + '00000000'
        return condition
      }
    },
    handleSelectedCondition () {
      if (this.conditionType === '1') {
        if (!((this.conditionModel.date || this.conditionModel.week) && this.conditionModel.time)) {
          return this.$message({
            type: 'warning',
            message: '请正确选择条件'
          })
        }
        this.conditionModel.type = '1'
        this.conditionModel.conditionType = '00'
        this.conditionModel.condition = this.getDateTimeCondition()
        this.$emit('condition-change', {model: this.conditionModel, selected: null}, false)
      } else if (this.conditionType === '2') {
        // if (!(this.chainActiveDevice && this.conditionModel.pick)) {
        //   return this.$message({
        //     type: 'warning',
        //     message: '请正确选择条件'
        //   })
        // }
        if (this.isHumidifier()) {
          this.conditionModel.condition = this.tempHumCondition.join('')
          this.conditionModel.action = `(温度${this.conditionModel.symbolT}${this.conditionModel.templure} / 湿度${this.conditionModel.symbolH}${this.conditionModel.humidifier})`
        }
        if (this.isSocket()) {
          this.conditionModel.condition = this.getDeviceCondition()
        }
        if (this.isGate()) {
          this.conditionModel.action = this.conditionModel.pick === '0' ? '当门窗关闭' : '当门窗打开'
        }
        this.conditionModel.type = '2'
        this.conditionModel.conditionType = '01'
        console.log('model ', this.conditionModel)
        this.$emit('condition-change', {model: this.conditionModel, selected: this.chainActiveDevice}, false)
      } else {
        console.log(2)
      }
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
.chain-list{
  // max-height: 570px;
  // overflow-y: auto;
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
  min-height: 120px;
  vertical-align: top;
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
  & .humidifier-text{
    float: right;
    background: #fff;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 1px 1px 1px 0px #f2f2f2;
    div{
      display: inline-block;
      padding: 0 10px;
      color: #999;
    }
    span{
      color: #666;
    }
  }
}
.chain-action__item .content{
  padding: 10px;
}
.chain-action__item .content .el-radio{
  margin-right: 10px;
  margin-top: 10px;
}
.el-radio.is-bordered + .el-radio.is-bordered{
  margin-left: 0;
}
.chain-action__item .content .templure-value{
  height: 25px;
  width: 60px;
  // margin-right: 0;
  // margin-left: 5px;
  padding: 5px;
  // margin-top: 5px;
}
.footer{
  padding: 18px 8px 0;
  text-align: right;
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
