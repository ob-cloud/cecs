<template>
  <div class="smart">
    <el-form ref="form" :model="sceneModel" label-width="100px">
      <el-form-item label="场景名称">
        <el-input class="caption-item w8" placeholder="场景名称" v-model="name"></el-input>
      </el-form-item>
      <el-form-item label="消息推送">
        <el-radio-group v-model="push">
          <el-radio :label="0">无推送</el-radio>
          <el-radio :label="1">APP推送</el-radio>
          <el-radio :label="2">短信推送</el-radio>
          <el-radio :label="3">APP/短息推送</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="行为设备">
        <el-select v-model="deviceId" multiple placeholder="请选择设备" class="w8">
          <el-option
            v-for="item in deviceList"
            :key="item.id"
            :label="item.name"
            :value="item.serialId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备条件">
        <el-card class="box-card w8">
          <div slot="header" class="clearfix">
            <span>条件</span>
            <i class="close fr el-icon-close"></i>
          </div>
          <div class="">
            <el-tabs class="condition" v-model="conditionsTab" type="border-card">
              <el-tab-pane label="条件1" name="c1" class="panel">
                <div class="condition-item clearfix">
                  <i class="el-icon-date fl"></i>
                  <i class="el-icon-close fr"></i>
                  <p>定时条件： 星期三 14:45</p>
                </div>
                <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="addCondition"></el-button>
              </el-tab-pane>
              <el-tab-pane label="条件2" name="c2">配置管理</el-tab-pane>
              <el-tab-pane label="条件3" name="c3">角色管理</el-tab-pane>
            </el-tabs>
            <div class="actions">
              <div class="header">动作</div>
              <div class="content">
                <div class="condition-item clearfix">
                  <i class="el-icon-date fl"></i>
                  <i class="el-icon-close fr"></i>
                  <p>定时条件： 星期三 14:45</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-form-item>
    </el-form>
    <el-dialog width="760px" title="条件类型" :visible.sync="conDialogVisible" :close-on-click-modal="false" append-to-body>
      <el-tabs v-model="conditionType" class="condition-type" type="border-card" @tab-click="onConditionTabClick">
        <el-tab-pane label="定时条件" name="1">
            <el-tabs tab-position="left" class="timing h200">
              <el-tab-pane label="日期">
                <el-date-picker
                  class="picker"
                  v-model="conditionTypeModel.intervalDate"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <el-time-picker
                  class="picker"
                  v-model="conditionTypeModel.intervalTime"
                  placeholder="选择时间">
                </el-time-picker>
              </el-tab-pane>
              <el-tab-pane label="星期">
                <div class="weeks">
                  <el-radio-group v-model="conditionTypeModel.week">
                    <el-radio-button type="plain" v-for="(week, index) in weeks" :key="index" :label="week"></el-radio-button>
                  </el-radio-group>
                  <el-time-picker
                    class="picker"
                    v-model="conditionTypeModel.intervalTime"
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
                <el-radio v-model="chainDeviceModel.socket" label="1" border>情景按钮1</el-radio>
                <el-radio v-model="chainDeviceModel.socket" label="2" border>情景按钮2</el-radio>
                <el-radio v-model="chainDeviceModel.socket" label="3" border>情景按钮3</el-radio>
                <el-radio v-model="chainDeviceModel.socket" label="4" border>挥手感应</el-radio>
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
      <div slot="footer" class="dialog-footer text-center" >
        <el-button @click="conDialogVisible = false">取 消</el-button>
        <el-button type="primary">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DeviceAPI from '@/api/device'
const {default: Suit} = require('@/common/suit')
import { PAGINATION_PAGENO } from '@/common/constants'
export default {
  props: {
    isLocal: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      name: '',
      deviceList: [],
      deviceId: '',
      pageNo: PAGINATION_PAGENO,
      pageSize: 300,
      push: 0,
      sceneModel: {

      },
      conditionsTab: 'c1',
      conditionType: '1',
      conditionTypeModel: {
        intervalDate: '',
        intervalTime: '',
        week: ''
      },
      conDialogVisible: false,
      weeks: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日', '每日'],
      chainDeviceList: [],
      chainActiveDevice: '',
      chainDeviceModel: {
        socket: ''
      }
    }
  },
  mounted () {
    this.getDeviceList()
  },
  methods: {
    getDeviceList () {
      DeviceAPI.getDeviceList({pageNo: this.pageNo, pageSize: this.pageSize}).then(res => {
        if (res.status === 200) {
          this.deviceList = res.data.config
        }
      })
    },
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
    addCondition () {
      this.conDialogVisible = true
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
.condition{
  margin: 0 20px;
}
.condition .panel{
  position: relative;
}
.condition .panel .add-btn{
  position: absolute;
  top: 0;
  right: 20px;
  padding: 5px;
  font-size: 16px;
}
.condition-item{
  width: 80%;
  border: 1px solid #eee;
  padding: 0 10px;
  font-size: 14px;
  color: #777;
}
.condition-item i{
  line-height: 40px;
}
.condition-item i:last-of-type{
  cursor: pointer;
}
.condition-item p{
  padding: 0 30px 0 20px;
}
.actions .header{
  padding: 0 20px;
  border-bottom: 1px solid #eee;
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
.actions .content{
  padding: 10px 20px;
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
