<template>
  <div>
    <el-tabs v-model="conditionType" class="condition-type" type="border-card">
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
              <el-radio v-model="conditionModel.pick" label="1" border>情景按钮1</el-radio>
              <el-radio v-model="conditionModel.pick" label="2" border>情景按钮2</el-radio>
              <el-radio v-model="conditionModel.pick" label="3" border>情景按钮3</el-radio>
              <el-radio v-model="conditionModel.pick" label="4" border>挥手感应</el-radio>
            </div>
          </div>
          <div class="chain-action__item" v-else-if="isLock()">
            <p class="title">门锁操作</p>
            <div class="content">
              <!-- <el-button type="plain" class="w140px">用户</el-button>
              <el-button type="plain" class="w140px">远程授权开锁</el-button>
              <el-button type="plain" class="w140px">卡开锁</el-button> -->
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
      conditionType: '2',
      conditionTimeType: '1',
      conditionModel: {
        pick: '',
        name: '',
        type: '联动条件',
        action: ''
      },
      chainDeviceList: [],
      chainActiveDevice: ''
    }
  },
  mounted () {
    this.getChainDeviceList()
  },
  watch: {
    conditionModel: {
      deep: true,
      handler (val) {
        // if (this.conditionType === '2' && this.chainActiveDevice && this.conditionModel.pick) { // 联动
        //   this.$emit('condition-change', {model: this.conditionModel, selected: this.chainActiveDevice})
        // }
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
    onChainDeviceClick (device) {
      this.chainActiveDevice = device
      this.conditionModel.pick = ''
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
    handleSelectedCondition () {
      if (this.conditionType === '2' && !(this.chainActiveDevice && this.conditionModel.pick)) {
        return this.$message({
          type: 'warning',
          message: '请正确选择条件'
        })
      }
      if (this.isGate()) {
        this.conditionModel.action = this.conditionModel.pick === '0' ? '当门窗关闭' : '当门窗打开'
      }
      this.$emit('condition-change', {model: this.conditionModel, selected: this.chainActiveDevice}, false)
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
