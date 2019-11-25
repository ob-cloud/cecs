<template>
  <div>
    <el-tabs v-model="conditionType" class="condition-type" type="border-card" @tab-click="onConditionTabClick">
      <el-tab-pane :label="$t('smart.scene.condition', {FIELD: 'timeCon'})" name="1">
        <Cron v-model="conditionModel.cron"></Cron>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.scene.condition', {FIELD: 'chainCon'})" name="2" class="left h200 chain-list">
        <div class="chain-device" :class="{active: item.serialId === chainActiveDevice.serialId}" v-for="(item, index) in chainDeviceList" :key="index" @click="onChainDeviceClick(item)">
          <p>{{item.name}}</p>
          <p>{{item.serialId}}</p>
          <p>{{$t('system.devtype', {FIELD: deviceTypeDescriptFilter(item.device_type, item.device_child_type)})}}</p>
          <!-- <p style="text-align: right;">{{item.online ? $t('message.status', {STATUS: 'online'}) : $t('message.status', {STATUS: 'offline'})}}</p> -->
        </div>
        <div class="chain-device-actions">
          <!-- <div class="chain-action__item" v-else-if="isHumidifier()"> -->
          <div class="chain-action__item" v-if="isHumidifier()">
            <div class="title">
              <el-radio-group v-model="templureAction">
                <el-radio-button type="plain" label="0">{{$t('smart.obox.tableField', {FIELD: 'temperature'})}}</el-radio-button>
                <el-radio-button type="plain" label="1">{{$t('smart.obox.tableField', {FIELD: 'humidifier'})}}</el-radio-button>
              </el-radio-group>
              <div class="humidifier-text">
                <div>
                  <span>{{$t('smart.obox.tableField', {FIELD: 'temperature'})}}</span>
                  {{conditionModel.symbolT && conditionModel.symbolT !== $t('message.none') ? `${conditionModel.symbolT} ${conditionModel.templure}℃` : $t('message.none')}}
                </div>
                <div>
                  <span>{{$t('smart.obox.tableField', {FIELD: 'humidifier'})}}</span>
                  {{conditionModel.symbolH && conditionModel.symbolH !== $t('message.none') ? `${conditionModel.symbolH} ${conditionModel.humidifier}%` : $t('message.none')}}
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
            <div class="content" v-if="templureAction === '0' && conditionModel.symbolT && conditionModel.symbolT !== $t('message.none')">
              <el-radio class="templure-value" v-model="conditionModel.templure" :label="item" border v-for="(item, index) in templureValue" :key="index">{{item}}</el-radio>
            </div>
            <div class="content" v-if="templureAction === '1' && conditionModel.symbolH && conditionModel.symbolH !== $t('message.none')">
              <el-radio class="templure-value" v-model="conditionModel.humidifier" :label="item" border v-for="(item, index) in humidifierValue" :key="index">{{item}}</el-radio>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="footer">
      <el-button type="primary" @click="handleSelectedCondition">{{$t('message.confirm')}}</el-button>
    </div>
  </div>
</template>

<script>
const {default: Suit} = require('@/common/suit')
import Cron from '@/components/Cron/index'
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
  components: { Cron },
  data () {
    return {
      conditionType: '1',
      conditionTimeType: '1',
      conditionModel: {
        cron: '',
        year: '',
        month: '',
        day: '',
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
        condition: '',
        conditionDesc: ''
      },
      templureCondition: {'>': '49', '=': '4a', '>=': '4b', '<': '4c', '<=': '4e', [this.$t('message.none')]: ''},
      templureValue: [],
      humidifierValue: [],
      templureAction: '0',
      tempHumCondition: [],
      chainDeviceList: [],
      chainActiveDevice: ''
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
    deviceTypeDescriptFilter (val, deviceSubType) {
      return Suit.getDeviceTypeDescriptor(val, deviceSubType)
    },
    getChainDeviceList () {
      // if (this.chainDeviceList.length) return
      // const chainList = this.deviceList.filter(item => {
      //   return this.isChainType(item.device_type, item.device_child_type, this.isLocal)
      // })
      // this.chainDeviceList = chainList
      this.chainDeviceList = [{
        serialId: '',
        name: this.$t('message.device', {DEVICE_TEXT: 'humDev'}),
        device_type: '0b',
        device_child_type: '0b'
      }]
    },
    isChainType (deviceType, deviceSubType, isLocal) {
      return Suit.typeHints.isSensors(deviceType)
        || (Suit.typeHints.isFinger(deviceType) && !isLocal)
        || Suit.typeHints.isDoorLock(deviceType)
        || (Suit.typeHints.isSocketSwitch(deviceType) && (Suit.typeHints.isSceneSocketSwitch(deviceSubType) || Suit.typeHints.isMixSocketSwitch(deviceSubType)))
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
      return this.conditionModel.cron
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
        this.conditionModel.type = '1'
        this.conditionModel.conditionType = '00'
        this.conditionModel.condition = this.getDateTimeCondition()
        const cronArr = this.conditionModel.condition.split(' ')
        const day = cronArr[3]
        const week = cronArr[5]
        if (day === '?' && week === '?') {
          return this.$message.error({title: false, message: this.$t('system.cron', {FIELD: 'dateWeekPointAt'})})
        }
        if (day !== '?' && week !== '?') {
          return this.$message.error({title: false, message: this.$t('system.cron', {FIELD: 'dateWeekNoPointAt'})})
        }
        this.$emit('condition-change', {model: this.conditionModel, selected: null}, false)
      } else if (this.conditionType === '2') {
        if (this.isHumidifier()) {
          this.conditionModel.condition = this.tempHumCondition.join('')
          this.conditionModel.action = `(${this.$t('message.device', {DEVICE_TEXT: 'temperature'})}${this.conditionModel.symbolT}${this.conditionModel.templure} / ${this.$t('message.device', {DEVICE_TEXT: 'humidifier'})}${this.conditionModel.symbolH}${this.conditionModel.humidifier})`
        }
        this.conditionModel.type = '2'
        this.conditionModel.conditionType = '01'
        if (!this.conditionModel.condition) {
          return this.$message.warning({title: false, message: this.$t('smart.scene.condition', {FIELD: 'setChainDevCon'})})
        }
        this.$emit('condition-change', {model: this.conditionModel, selected: this.chainActiveDevice}, false)
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
