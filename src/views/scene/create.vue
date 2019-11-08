<template>
  <div class="scene-create">
    <el-form ref="sceneForm" :rules="sceneModelRules" :model="sceneModel" label-width="100px">
      <el-form-item :label="$t('smart.scene.tableField', {FIELD: 'name'})" prop="scene_name">
        <el-input class="caption-item w8" :placeholder="$t('smart.scene.create', {FIELD: 'inputNameTip'})" v-model="sceneModel.scene_name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="消息推送" prop="msg_alter">
        <el-radio-group v-model="sceneModel.msg_alter">
          <el-radio :label="0">无推送</el-radio>
          <el-radio :label="1">APP推送</el-radio>
          <el-radio :label="2">短信推送</el-radio>
          <el-radio :label="3">APP/短息推送</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="行为设备" prop="deviceIdList">
        <el-select v-model="deviceIdList" multiple placeholder="请选择设备" class="w8">
          <el-option
            v-for="item in deviceActionList"
            :key="item.id"
            :label="item.name"
            :value="item.serialId">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item :label="$t('smart.scene.create', {FIELD: 'deviceCon'})" class="box-card">
        <el-tabs class="condition w8" v-model="conditionsTab" type="border-card">
          <el-tab-pane :label="$t('smart.scene.create', {FIELD: 'cons1'})" name="c1" class="panel">
            <span slot="label">{{$t('smart.scene.create', {FIELD: 'cons1'})}}<span class="or">OR</span></span>
            <div class="condition-item clearfix" v-for="(condition, index) in conditionMapList['c1']" :key="index">
              <i class="obicon obicon-node fl"></i>
              <i class="el-icon-close fr" @click="removeCondition(index)"></i>
              <p>
                {{parseCondition(condition)}}
                <span class="and" v-if="conditionMapList['c1'].length !== 1 && index !== conditionMapList['c1'].length - 1">AND</span>
              </p>
            </div>
            <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="addCondition"></el-button>
          </el-tab-pane>

          <el-tab-pane :label="$t('smart.scene.create', {FIELD: 'cons2'})" name="c2" class="panel">
            <span slot="label">{{$t('smart.scene.create', {FIELD: 'cons2'})}}<span class="or">OR</span></span>
            <div class="condition-item clearfix" v-for="(condition, index) in conditionMapList['c2']" :key="index">
              <i class="obicon obicon-node fl"></i>
              <i class="el-icon-close fr" @click="removeCondition(index)"></i>
              <p>
                {{parseCondition(condition)}}
                <span class="and" v-if="conditionMapList['c2'].length !== 1 && index !== conditionMapList['c2'].length - 1">AND</span>
              </p>
            </div>
            <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="addCondition"></el-button>
          </el-tab-pane>
          <el-tab-pane :label="$t('smart.scene.create', {FIELD: 'cons3'})" name="c3" class="panel">
            <div class="condition-item clearfix" v-for="(condition, index) in conditionMapList['c3']" :key="index">
              <i class="obicon obicon-node fl"></i>
              <i class="el-icon-close fr" @click="removeCondition(index)"></i>
              <p>
                {{parseCondition(condition)}}
                <span class="and" v-if="conditionMapList['c3'].length !== 1 && index !== conditionMapList['c3'].length - 1">AND</span>
              </p>
            </div>
            <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="addCondition"></el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item label="设备行为">
        <div class="action-content">
          <div class="condition-item clearfix" v-for="(deviceAction, index) in deviceActionModel" :key="index">
            <i class="el-icon-close fr" @click="handleRemoveAction(index)"></i>
            <div class="action-item">
              <el-tooltip :content="$t('smart.scene.create', {FIELD: 'actionTips'})" placement="top">
                <el-input-number v-model="deviceAction.action_time" controls-position="right" :min="0"></el-input-number>
              </el-tooltip>
              <el-select :placeholder="$t('message.placeholder', {TYPE: 'choose', PLACEHOLDER: 'build'})" v-model="deviceAction.buildingId" filterable @change="onSelectChange(deviceAction.buildingId, index, 0)">
                <el-option v-for="(item, index) in deviceAction.buildingList" :key="item.buildingName + index + item.buildingId" :label="item.buildingName" :value="item.buildingId"></el-option>
              </el-select>
              <el-select :placeholder="$t('message.placeholder', {TYPE: 'choose', PLACEHOLDER: 'floor'})" v-model="deviceAction.floorId" filterable @change="onSelectChange(deviceAction.floorId, index, 1)">
                <el-option v-for="(item, index) in deviceAction.floorList" :key="item.floorName + index + item.floorId" :label="item.floorName" :value="item.floorId"></el-option>
              </el-select>
              <el-select :placeholder="$t('message.placeholder', {TYPE: 'choose', PLACEHOLDER: 'room'})" v-model="deviceAction.roomId" filterable @change="onSelectChange(deviceAction.roomId, index, 2)">
                <el-option v-for="(item, index) in deviceAction.roomList" :key="item.roomName + index + item.roomId" :label="item.roomName" :value="item.roomId"></el-option>
              </el-select>
              <el-select :placeholder="$t('message.placeholder', {TYPE: 'choose', PLACEHOLDER: 'deviceType'})" v-model="deviceAction.serialId" @change="onSelectDevice(deviceAction.serialId, index)">
                <el-option v-for="item in deviceAction.deviceTypeList" :key="item.deviceSerialId" :label="item.deviceType | deviceTypeFilter(item.deviceChildType)" :value="item.deviceSerialId"></el-option>
              </el-select>
              <div v-if="deviceAction.serialId" class="action-item__behavior" @click="settingAction(deviceAction.serialId, index)" :title="deviceAction.actionDescriptor">
                <p>{{deviceAction.actionDescriptor || $t('smart.scene.create', {FIELD: 'devAction'})}}</p>
              </div>
            </div>
          </div>
          <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="handleAddAction"></el-button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 条件类型弹窗 -->
    <el-dialog v-if="conDialogVisible" width="950px" top="10%" :title="$t('smart.scene.create', {FIELD: 'conType'})" :visible.sync="conDialogVisible" :close-on-click-modal="false" append-to-body>
      <scene-condition :isLcal="true" :deviceList="deviceList" @condition-change="onConditionChange"></scene-condition>
    </el-dialog>
    <!-- action -->
    <el-dialog v-if="actionDialogVisible" :width="activeDevice.device_type === '51' ? '80%' : '600px'" :title="$t('smart.scene.create', {FIELD: 'devAction'})" :visible.sync="actionDialogVisible" :close-on-click-modal="false" append-to-body>
      <scene-action :actionObject="activeDevice" @action-change="onActionChange"></scene-action>
    </el-dialog>
    <div class="footer">
      <el-button @click="close">{{$t('message.cancel')}}</el-button>
      <el-button type="primary" @click="handleSelectedCondition">{{$t('message.confirm')}}</el-button>
    </div>
  </div>
</template>

<script>
import SceneCondition from './condition'
import SceneAction from './action'
import DeviceAPI from '@/api/device'
const {default: Suit} = require('@/common/suit')
import { PAGINATION_PAGENO } from '@/common/constants'
import scene from './scene'
export default {
  mixins: [scene],
  props: {
    isLocal: {
      type: Boolean,
      default: true
    },
    scene: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    // const that = this
    // const validateAction = (rule, value, callback) => {
    //   if (!that.deviceSelectedList.length) {
    //     callback(new Error('请选择行为设备'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      name: '',
      deviceActionList: [],
      deviceList: [],
      deviceIdList: '',
      deviceSelectedList: [],
      pageNo: PAGINATION_PAGENO,
      pageSize: 300,
      push: 0,
      sceneModel: {
        scene_type: '00',
        scene_status: '01',
        scene_number: 0, // 新增 0
        scene_name: '',
        scene_group: '00',
        msg_alter: 0,
        actions: [], // 摄像头设备行为
        conditions: [] // 联动设备行为条件
      },
      deviceActionModel: [{
        action_time: 0,
        buildingId: '',
        floorId: '',
        roomId: '',
        serialId: '',
        actionDescriptor: '',
        action: '',
        buildingList: [],
        floorList: [],
        roomList: [],
        deviceTypeList: []
      }],
      currentAction: null, // 当前操作action项
      activeDevice: null, // 当前选中设备类型对象
      conditionsTab: 'c1',
      conDialogVisible: false,
      conditionObject: null,
      conditionList: [],
      conditionMapList: {
        'c1': [],
        'c2': [],
        'c3': []
      },
      sceneModelRules: {
        scene_name: [{ required: true, trigger: 'blur', message: this.$t('smart.scene.create', {FIELD: 'empty'})}],
        msg_alter: [{ required: true, trigger: 'blur', message: '消息推送不能为空'}],
        // deviceIdList: [{ required: true, trigger: 'blur', validator: validateAction}]
      },
      deviceTypeList: [{
        serialId: 1,
        name: '面板',
        device_type: '04',
        device_child_type: '21'
      }, {
        serialId: '17e25c3a7d',
        name: '红外',
        device_type: '51'
      }],
      actionDialogVisible: false,
      // buildingList: [],
      // layerList: []
    }
  },
  filters: {
    deviceTypeFilter (type, subtype) {
      if (!type && !subtype) return
      return subtype ? Suit.getDeviceTypeDescriptor(type, subtype) : Suit.getRootDeviceDescriptor(type)
    }
  },
  components: {SceneCondition, SceneAction},
  mounted () {
    this.getDeviceList()
    this.getSceneDeviceList().then(buildingList => {
      this.deviceActionModel[0].buildingList = buildingList
    })
    console.log('mounted ', this.deviceTypeList)
  },
  watch: {
    deviceIdList (serialIds) {
      this.deviceSelectedList = serialIds.map(serialId => {
        return this.deviceList.find(device => serialId === device.serialId)
      })
    },
  },
  methods: {
    isActionDevice (deviceType, deviceSubType, isLocal) {
      return !Suit.typeHints.isSensors(deviceType)
        && !Suit.typeHints.isFinger(deviceType)
        && !Suit.typeHints.isDoorLock(deviceType)
        && !Suit.typeHints.isCamera(deviceType)
        && !(Suit.typeHints.isSocketSwitch(deviceType) && Suit.typeHints.isSceneSocketSwitch(deviceSubType))
        && !(Suit.typeHints.isSocketSwitch(deviceType) && Suit.typeHints.isMixSocketSwitch(deviceSubType))
    },
    getActionDeviceList (deviceList) {
      const actionList = deviceList.filter(item => {
        return this.isActionDevice(item.device_type, item.device_child_type)
      })
      this.deviceActionList = actionList
      console.log('action List ', this.deviceActionList)
    },
    getDeviceList () {
      DeviceAPI.getDeviceList({pageNo: this.pageNo, pageSize: this.pageSize}).then(res => {
        if (res.status === 200) {
          this.deviceList = res.data.config
          this.getActionDeviceList(this.deviceList)
        }
      })
    },
    settingAction (serialId, index) {
      this.actionDialogVisible = true
      this.onSelectDevice(serialId, index)
    },
    addCondition () {
      this.conDialogVisible = true
    },
    removeCondition (index) {
      this.conditionList.splice(index, 1)
      this.conditionMapList[this.conditionsTab].splice(index, 1)
    },
    onConditionChange (condition, dialogVisible) {
      console.log(condition)
      if (this.conditionMapList[this.conditionsTab].length >= 3) {
        this.$message({
          message: this.$t('smart.scene.create', {FIELD: 'conTip'}),
          type: 'info'
        })
        return
      }
      this.conditionList.push(condition)
      this.conditionMapList[this.conditionsTab].push(condition)
      this.conDialogVisible = dialogVisible
    },
    onActionChange (actionData, dialogVisible) {
      this.actionDialogVisible = dialogVisible
      this.currentAction.actionDescriptor = actionData.extra // .map(item => (item ? '开' : '关')).join('/')
      this.currentAction.action = actionData.action
    },
    onSelectChange (id, index, type) {
      const activeActionModel = this.deviceActionModel[index]
      if (type === 0) { // building
        activeActionModel.floorId = ''
        activeActionModel.roomId = ''
        activeActionModel.serialId = ''
        activeActionModel.floorList = []
        activeActionModel.roomList = []
        activeActionModel.deviceTypeList = []
        this.getFloorList(id)
        activeActionModel.floorList = this.floorList
      } else if (type === 1) { // floor
        activeActionModel.roomId = ''
        activeActionModel.roomList = []
        activeActionModel.serialId = ''
        activeActionModel.deviceTypeList = []
        this.getRoomList(id)
        activeActionModel.roomList = this.roomList
      } else { // room
        activeActionModel.serialId = ''
        activeActionModel.deviceTypeList = []
        this.getDeviceTypeListByRoomId(id)
        activeActionModel.deviceTypeList = this.deviceTypeList
        activeActionModel.deviceTypeList = this.deviceTypeList.filter(item => {
          return this.isActionDevice(item.deviceType, item.deviceChildType)
        })
        console.log('deviceTypeList ', activeActionModel.deviceTypeList, id)
      }
    },
    onSelectDevice (serialId, index) {
      const activeActionModel = this.deviceActionModel[index]
      const device = activeActionModel.deviceTypeList.find(item => item.deviceSerialId === serialId)
      this.activeDevice = {
        device_child_type: device.deviceChildType,
        device_type: device.deviceType,
        device_name: device.deviceName,
        serialId: device.deviceSerialId,
        obox_serial_id: device.oboxSerialId,
        state: device.deviceState,
        addr: device.rfAddress,
        buildingId: activeActionModel.buildingId,
        floorId: activeActionModel.floorId,
        roomId: activeActionModel.roomId,
        action_time: activeActionModel.action_time
      }
      this.currentAction = activeActionModel
      this.currentAction.actionDescriptor = ''
    },
    handleRemoveAction (index) {
      this.deviceActionModel.splice(index, 1)
    },
    handleAddAction () {
      this.deviceActionModel.push({
        action_time: 0,
        buildingId: '',
        floorId: '',
        roomId: '',
        serialId: '',
        actionDescriptor: '',
        action: '',
        buildingList: this.buildingList,
        floorList: [],
        roomList: [],
        deviceTypeList: []
      })
    },
    handleSelectedCondition () {
      const actions = this.getModelAction()
      const conditions = this.getModelCondition()
      this.sceneModel.actions = actions
      this.sceneModel.conditions.push(...conditions)
      console.log(this.sceneModel)
      // this.$refs.sceneForm.validate(valid => {
      //   if (valid) {
      //     this.$emit('scene-ready', this.sceneModel, false)
      //   }
      // })
    },
    close () {
      this.$emit('close')
    },
    isGateSensors (device) {
      return Suit.typeHints.isGateSensors(device.device_child_type)
    },
    parseCondition (condition) {
      let str = ''
      console.log('---- ', condition)
      if (condition.model.type === '1') {
        str = `${this.$t('smart.scene.condition', {FIELD: 'timing'})} ${condition.model.date ? condition.model.date : condition.model.week || ''} ${condition.model.time || ''}`
      } else if (condition.model.type === '2') {
        const type = Suit.getDeviceTypeDescriptor(condition.selected.device_type, condition.selected.device_child_type)
        str = `${this.$t('smart.scene.condition', {FIELD: 'chain'})} ${type} ${condition.model.action}`
      }
      return str
    },
    parseAction (device) {
      // const type = Suit.getDeviceTypeDescriptor(device.device_type, device.device_child_type)
      if (device.channel) {
        return `拍照`
      }
    },
    getModelCondition () {
      const conditions = Object.keys(this.conditionMapList).map(key => {
        return this.conditionMapList[key].map(condition => {
          const device = condition.selected
          let cons = {
            condition: condition.model.condition,
            condition_type: condition.model.conditionType,
          }
          if (device) {
            cons = {
              ...cons,
              ...{
                addr: device.addr,
                conditionID: device.name,
                device_child_type: device.device_child_type,
                device_type: device.device_type,
                obox_serial_id: device.obox_serial_id,
                serialId: device.serialId
              }
            }
            if (this.isGateSensors(device)) {
              cons.condition = '4a01000000000000'
            }
          }
          return cons
        })
      })
      console.log('conditions ', conditions)
      return conditions
    },
    getModelAction () {
      return this.deviceActionModel.map(item => item.action)
    },
    parseSceneData () {
      if (this.scene) {
        this.sceneModel = {...this.sceneModel, ...this.scene}
        this.deviceSelectedList = this.scene.actions
        this.deviceIdList = this.deviceSelectedList.map(device => device.serialId)
        const conditionArray = this.scene.conditions && this.scene.conditions.length && this.scene.conditions[0]
        this.conditionList = conditionArray.map(condition => {
          return {
            model: {
              type: '',
              action: '',
              pick: '',
              name: this.scene.scene_name
            },
            selected: {
              name: condition.conditionID,
              ...condition
            }
          }
        })
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
.condition{
  // margin: 0 20px;
  .condition-item > p{
    position: relative;
  }
}
.condition .panel{
  position: relative;
  padding: 20px 20px 20px 0;
}
.condition .panel .add-btn{
  position: absolute;
  top: 26px;
  right: 10px;
  padding: 5px;
  font-size: 16px;
}
.action-content{
  position: relative;
}
.action-content .add-btn{
  position: absolute;
  // top: 10px;
  top: 22px;
  right: -10px;
  padding: 5px;
}
.action-content .condition-item{
  width: 96%;
  padding: 14px 5px;
  border-radius: 4px;
  // padding: 5px;
  // margin: 0 auto;
}
.condition-item .action-item > div{
  width: 110px;
  margin-right: 5px;
}
.condition-item .action-item > div:first-of-type{
  width: 70px;
}
.condition-item .action-item > div:last-of-type{
  width: 150px;
  vertical-align: bottom;
  & p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.action-item__behavior{
  display: inline-block;
  border: 1px dashed #ccc;
  border-radius: 4px;
  color: #ccc;
  cursor: pointer;
}
.condition-item{
  width: 90%;
  border: 1px solid #eee;
  padding: 0 10px;
  font-size: 14px;
  color: #777;
}

.condition-item + .condition-item{
  margin-top: 6px;
}
.condition-item i{
  position: relative;
  line-height: 40px;
  font-size: 14px;
  padding-right: 5px;
  z-index: 9;
}
.condition-item i:last-of-type{
  cursor: pointer;
}
.condition-item p{
  // padding: 0 30px 0 20px;
  padding: 0 10px 0 10px;
}
.actions .header{
  padding: 0 20px;
  border-bottom: 1px solid #eee;
}
.actions .content{
  padding: 10px 20px;
}
.footer{
  padding: 18px 8px 0;
  text-align: right;
}
.or{
  position: absolute;
  right: -12px;
  top: 9px;
  font-size: 12px;
  font-family: Consolas;
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 1px solid #000;
  border-radius: 100%;
  vertical-align: middle;
  text-align: center;
  line-height: 21px;
  background-color: #000;
  color: #fff;
  z-index: 9999;
}
.and{
  position: absolute;
  right: -40px;
  top: 30px;
  font-family: Consolas;
  display: inline-block;
  font-size: 11px;
  transform: scale(1);
  font-family: Consolas;
  display: inline-block;
  width: 26px;
  height: 26px;
  border: 1px solid #000;
  border-radius: 100%;
  vertical-align: middle;
  text-align: center;
  line-height: 24px;
  background-color: #000;
  color: #fff;
}
.and::before,
.and::after{
  display: inline-block;
  content: ' ';
  width: 15px;
  height: 8px;
  border: 1px dashed #999;
  position: absolute;
  border-left: none;
}
.and::before{
  top: -10px;
  left: -3px;
  border-bottom: none;
}
.and::after{
  bottom: -10px;
  left: -3px;
  border-top: none;
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
.action-content .el-input-number__increase, .action-content .el-input-number__decrease{
  width: 30px;
}
.action-content .el-input-number.is-controls-right .el-input__inner{
  padding-left: 2px;
  padding-right: 30px;
}
</style>
