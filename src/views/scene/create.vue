<template>
  <div class="scene-create" v-loading="loadingEditData">
    <el-form ref="sceneForm" :rules="sceneModelRules" :model="sceneModel" label-width="100px">
      <el-form-item :label="$t('smart.scene.tableField', {FIELD: 'name'})" prop="scene_name">
        <el-input class="caption-item w8" :placeholder="$t('smart.scene.create', {FIELD: 'inputNameTip'})" v-model="sceneModel.scene_name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('smart.scene.create', {FIELD: 'location'})" prop="location.buildingId" class="location">
        <el-select :placeholder="$t('message.placeholder', {TYPE: 'choose', PLACEHOLDER: 'build'})" v-model="sceneModel.location.buildingId" filterable clearable :disabled="!!this.sceneNumber">
          <el-option v-for="(item, index) in buildingList" :key="item.buildingName + index + item.buildingId" :label="item.buildingName" :value="item.buildingId"></el-option>
        </el-select>
        <el-select :placeholder="$t('message.placeholder', {TYPE: 'choose', PLACEHOLDER: 'floor'})" v-model="sceneModel.location.floorId" filterable clearable :disabled="!!this.sceneNumber">
          <el-option v-for="(item, index) in floorList" :key="item.floorName + index + item.floorId" :label="item.floorName" :value="item.floorId"></el-option>
        </el-select>
        <el-select :placeholder="$t('message.placeholder', {TYPE: 'choose', PLACEHOLDER: 'room'})" v-model="sceneModel.location.roomId" filterable clearable :disabled="!!this.sceneNumber">
          <el-option v-for="(item, index) in roomList" :key="item.roomName + index + item.roomId" :label="item.roomName" :value="item.roomId"></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item :label="$t('smart.scene.create', {FIELD: 'behavior'})">
        <div class="action-content">
          <div class="condition-item clearfix" v-for="(deviceAction, index) in deviceActionModel" :key="index">
            <i v-if="index !== 0" class="el-icon-close fr" @click="handleRemoveAction(index)"></i>
            <div class="action-item">
              <el-tooltip :content="$t('smart.scene.create', {FIELD: 'actionTips'})" placement="top">
                <el-input-number v-model="deviceAction.action_time" controls-position="right" :min="0" @change="onSelectDevice('', index)"></el-input-number>
              </el-tooltip>
              <el-select v-if="deviceAction.serialId" :placeholder="$t('message.placeholder', {TYPE: 'choose', PLACEHOLDER: 'deviceType'})" v-model="deviceAction.serialId" @change="onSelectDevice(deviceAction.serialId, index)">
                <el-option v-for="item in deviceAction.deviceTypeList" :key="item.deviceSerialId" :label="deviceTypeFilter(item.deviceType, item.deviceChildType)" :value="item.deviceSerialId"></el-option>
              </el-select>
              <el-select v-else :placeholder="$t('message.placeholder', {TYPE: 'choose', PLACEHOLDER: 'deviceType'})" v-model="deviceAction.deviceType" @change="onSelectDevice(deviceAction.serialId, index, deviceAction.deviceType)">
                <el-option v-for="item in deviceAction.deviceTypeList" :key="item.deviceType" :label="deviceTypeFilter(item.deviceType, item.deviceChildType)" :value="item.deviceType"></el-option>
              </el-select>
              <div v-if="deviceAction.serialId || deviceAction.deviceType" class="action-item__behavior" @click="settingAction(deviceAction.serialId, index, deviceAction.deviceType)" :title="deviceAction.actionDescriptor">
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
      <scene-condition :isLcal="true" @condition-change="onConditionChange"></scene-condition>
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
const {default: Suit} = require('@/common/suit')
import scene from './scene'
import SceneAPI from '@/api/scene'
export default {
  mixins: [scene],
  props: {
    isLocal: {
      type: Boolean,
      default: true
    },
    sceneNumber: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      name: '',
      sceneModel: { // the scene created or edited model object
        scene_type: '00',
        scene_status: '01',
        scene_number: 0, // create 0
        scene_name: '',
        scene_group: '00',
        msg_alter: 0,
        actions: [], // device behaviors
        conditions: [], // device conditions
        location: {
          buildingId: '',
          floorId: '',
          roomId: ''
        }
      },
      deviceActionModel: this.initActionModel(),
      currentAction: null, // current handling action
      activeDevice: null, // current active device
      conDialogVisible: false, // condition dialog visible controller flag
      conditionList: [], // list to store conditions
      conditionsTab: 'c1', // condition 'c1' for the default or active tab
      conditionMapList: { // condition tab map list
        'c1': [],
        'c2': [],
        'c3': []
      },
      sceneModelRules: {
        scene_name: [{ required: true, trigger: 'blur', message: this.$t('smart.scene.create', {FIELD: 'empty'})}],
        'location.buildingId': [{ required: true, trigger: 'change', message: this.$t('smart.scene.create', {FIELD: 'locationEmpty'})}],
      },
      deviceTypeList: this.initDeviceType(), // list of device's type
      actionDialogVisible: false,
      isEditScene: false,
      loadingEditData: false
    }
  },
  components: {SceneCondition, SceneAction},
  mounted () {
    this.getSceneDeviceList().then(buildingList => {
      if (this.sceneNumber) { // when there is a sceneNumber, It's in an editable mode
        this.isEditScene = true
        this.loadingEditData = true
        this.getSceneDataBySceneNumber()
      } else {
        this.isEditScene = false
      }
    })
  },
  watch: {
    'sceneModel.location.buildingId' (id) { // get floor's list by building id
      if (!this.isEditScene) {
        this.sceneModel.location.floorId = ''
        this.sceneModel.location.roomId = ''
      }
      this.floorList = []
      this.roomList = []
      this.getFloorList(id)
      this.deviceActionModel = this.initActionModel()
      this.deviceActionModel[0].deviceTypeList = this.initDeviceType()
    },
    'sceneModel.location.floorId' (id) { // get room's list by floor id
      !this.isEditScene && (this.sceneModel.location.roomId = '')
      this.roomList = []
      this.getRoomList(id)
      this.deviceActionModel = this.initActionModel()
      this.deviceActionModel[0].deviceTypeList = this.initDeviceType()
    },
    'sceneModel.location.roomId' (id) { // get device's list by room id
      if (!id) { // init by default data
        this.deviceTypeList = this.initDeviceType()
        this.deviceActionModel = this.initActionModel()
        this.deviceActionModel[0].deviceTypeList = this.initDeviceType()
        return
      }
      this.getDeviceTypeListByRoomId(id)
      this.deviceTypeList = this.deviceTypeList.filter(item => {
        return this.isActionDevice(item.deviceType, item.deviceChildType)
      })
      this.deviceActionModel = this.initActionModel()
      this.deviceActionModel[0].deviceTypeList = this.deviceTypeList
      this.isEditScene = false // after finishing rendering location, reset isEditScene variable
    }
  },
  methods: {
    initDeviceType () { // for building or floor location
      return [{
        name: '3 way switch',
        deviceType: '04',
        deviceChildType: '17'
      }, {
        name: 'Ifrate',
        deviceType: '51'
      }]
    },
    initActionModel () { // model for device to save action messages
      return [{
        action_time: 0,
        serialId: '',
        deviceType: '',
        actionDescriptor: '',
        action: '',
        deviceTypeList: []
      }]
    },
    deviceTypeFilter (type, subtype) { // get description text of device's type
      if (!type && !subtype) return
      return subtype ? this.$t('system.devtype', {FIELD: Suit.getDeviceTypeDescriptor(type, subtype)}) : this.$t('system.devtype', {FIELD: Suit.getRootDeviceDescriptor(type)})
    },
    isActionDevice (deviceType, deviceSubType, isLocal) { // only some device can be set action
      return !Suit.typeHints.isSensors(deviceType)
        && !Suit.typeHints.isFinger(deviceType)
        && !Suit.typeHints.isDoorLock(deviceType)
        && !Suit.typeHints.isCamera(deviceType)
        && !(Suit.typeHints.isSocketSwitch(deviceType) && Suit.typeHints.isSceneSocketSwitch(deviceSubType))
        && !(Suit.typeHints.isSocketSwitch(deviceType) && Suit.typeHints.isMixSocketSwitch(deviceSubType))
    },
    settingAction (serialId, index, deviceType) { // click area of the action behavior and set
      this.actionDialogVisible = true
      this.onSelectDevice(serialId, index, deviceType)
    },
    addCondition () { // for condition modal/dialog controller
      this.conDialogVisible = true
    },
    removeCondition (index) {
      this.conditionList.splice(index, 1)
      this.conditionMapList[this.conditionsTab].splice(index, 1)
    },
    onConditionChange (condition, dialogVisible) { // when finishing choosing conditions, enter this callback function
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
    onActionChange (actionData, dialogVisible) { // when finishing handling actions, enter this callback function
      this.actionDialogVisible = dialogVisible
      this.currentAction.actionDescriptor = actionData.extra
      this.currentAction.action = actionData.action
    },
    onSelectDevice (serialId, index, deviceType) {
      const activeActionModel = this.deviceActionModel[index]
      const device = activeActionModel.deviceTypeList.find(item => item.deviceSerialId === serialId)
      this.activeDevice = {}
      if (device) { // by device's serial number
        // select a device type depends on a serial number and pass to action component
        this.activeDevice = {
          device_child_type: device.deviceChildType,
          device_type: device.deviceType,
          device_name: device.deviceName,
          serialId: device.deviceSerialId,
          obox_serial_id: device.oboxSerialId,
          state: device.deviceState,
          addr: device.rfAddress,
          action_time: activeActionModel.action_time
        }
      } else if (deviceType) { // by device's type
        const item = activeActionModel.deviceTypeList.find(type => type.deviceType === deviceType)
        this.activeDevice.device_type = item.deviceType
        this.activeDevice.device_child_type = item.deviceChildType
        this.activeDevice.action_time = activeActionModel.action_time
      }
      this.currentAction = activeActionModel
      if (!serialId && !deviceType) { // change action time
        this.activeDevice.action_time = activeActionModel.action_time
      } else { // reset only by select a device
        this.currentAction.actionDescriptor = ''
      }
    },
    handleRemoveAction (index) { // remove device's action
      this.deviceActionModel.splice(index, 1)
    },
    handleAddAction () { // add device's action
      this.deviceActionModel.push({
        action_time: 0,
        serialId: this.getSerialIdFromTypeListBySceneNumber() || '',
        deviceType: '',
        actionDescriptor: '',
        action: '',
        deviceTypeList: this.deviceTypeList
      })
    },
    getSerialIdFromTypeListBySceneNumber () { // edit mode, get serialId for deviceActionModel
      if (this.sceneNumber) {
        const typeObj = this.deviceTypeList.find(type => type.deviceSerialId)
        return typeObj && typeObj.deviceSerialId
      }
    },
    hasEmptyAction (actions) {
      return !actions || !actions.length || actions.findIndex(item => !item || !Object.keys(item).length || !item.action) > -1
    },
    handleSelectedCondition () { // combine the arguments and save
      const actions = this.getModelAction()
      const conditions = this.getModelCondition()
      this.sceneModel.actions = actions
      this.sceneModel.conditions = [...conditions]
      const model = {...this.sceneModel}
      model.location = this.getLocation()
      if (this.hasEmptyAction(actions)) {
        return this.$message.warning({title: false, message: this.$t('smart.scene.condition', {FIELD: 'setActionBehavior'})})
      }
      this.$refs.sceneForm.validate(valid => {
        if (valid) {
          this.$emit('scene-ready', model, false)
        }
      })
    },
    close () {
      this.$emit('close')
    },
    parseCondition (condition) { // parse condition to readable text
      let str = ''
      if (condition.model.type === '1') {
        str = `${this.$t('smart.scene.condition', {FIELD: 'timing'})} ${condition.model.condition}`
      } else if (condition.model.type === '2') {
        const type = this.$t('system.devtype', {FIELD: Suit.getDeviceTypeDescriptor(condition.selected.device_type, condition.selected.device_child_type)})
        str = `${this.$t('smart.scene.condition', {FIELD: 'chain'})} ${type} ${condition.model.action}`
      }
      return str
    },
    getModelCondition () { // get condition arguments
      const conditions = Object.keys(this.conditionMapList).map(key => {
        return this.conditionMapList[key].map(condition => {
          const device = condition.selected
          let cons = { // for timing condition
            condition: condition.model.condition,
            condition_type: condition.model.conditionType,
          }
          if (device) { // for chain's device condition
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
          }
          return cons
        })
      })
      return conditions
    },
    getModelAction () { // get action model and set serialId
      return this.deviceActionModel.map(item => {
        return item.serialId ? {...item.action, serialId: item.serialId, action_time: item.action_time} : {...item.action, action_time: item.action_time}
      })
    },
    getLocation () { // get validable location
      const location = {...this.sceneModel.location}
      location.buildingId === '' && delete location.buildingId
      location.floorId === '' && delete location.floorId
      location.roomId === '' && delete location.roomId
      return location
    },
    getSceneDataBySceneNumber () { // init sceneModel data
      if (!this.sceneNumber) return
      SceneAPI.getSmartSceneById(this.sceneNumber).then(res => {
        if (res.status === 0) {
          this.sceneModel.location = res.data.location
          this.sceneModel.scene_type = res.data.scene_type || '00'
          this.sceneModel.scene_status = res.data.scene_status || '01'
          this.sceneModel.scene_number = res.data.scene_number || this.sceneNumber
          this.sceneModel.scene_name = res.data.scene_name || ''
          this.sceneModel.scene_group = res.data.scene_group || '00'
          this.sceneModel.msg_alter = res.data.msg_alter || 0

          const conditions = res.data.conditions
          this.conditionMapList.c1 = this.inverseCondition(conditions[0] || [])
          this.conditionMapList.c2 = this.inverseCondition(conditions[1] || [])
          this.conditionMapList.c3 = this.inverseCondition(conditions[2] || [])
          setTimeout(() => {
            this.deviceActionModel = this.inverseActions(res.data.actions)
          }, 0)
        }
        this.loadingEditData = false
      })
    },
    inverseActions (actions) { // convert action data to created structure
      const parseKey = act => {
        let actObj = {}
        try {
          actObj = JSON.parse(act)
        } catch (err) {
          console.log(err)
        }
        return actObj.key
      }
      const parseSwitch = act => {
        return act.slice(0, 2) === '00' ? this.$t('message.switchStatus', {SWITCH: 'switchOff'}) : this.$t('message.switchStatus', {SWITCH: 'switchOn'})
      }
      const isTransponder = act => {
        return act.indexOf('{') !== -1
      }
      // filter actions by device's type of the room, it's useable only the device of room existing
      // const usableActionArr = Array.from(actions || []).filter(act => {
      //   return this.deviceTypeList.find(type => (type.deviceType === '51' && isTransponder(act.action)) || (act.device_type === type.deviceType))
      //   // return this.deviceTypeList.find(type => type.deviceSerialId === act.serialId)
      // })

      return actions.map(action => {
        let actionDesc = ''
        if (action.action) {
          actionDesc = isTransponder(action.action) ? parseKey(action.action) : parseSwitch(action.action)
        }
        return {
          deviceTypeList: this.deviceTypeList,
          serialId: action.serialId,
          deviceType: action.device_type,
          action_time: action.action_time,
          actionDescriptor: actionDesc,
          action: action
        }
      })
    },
    inverseCondition (conditions) { // convert condition to created mode
      const parseChainAction = condition => {
        const temSymbol = condition.slice(0, 2)
        const temperature = condition.slice(2, 4) === '4C' ? '' : Suit.converter.toDecimal(condition.slice(2, 4), 16) - 30
        const humSymbol = condition.slice(4, 6)
        const humidifier = condition.slice(6, 8) === '00' ? '' : Suit.converter.toDecimal(condition.slice(6, 8), 16)
        const symbol = {'49': '>', '4a': '=', '4b': '>=', '4c': '<', '4e': '<=', '4C': this.$t('message.none'), '00': this.$t('message.none')}
        return `${this.$t('message.device', {DEVICE_TEXT: 'temperature'})}${symbol[temSymbol]}${temperature} / ${this.$t('message.device', {DEVICE_TEXT: 'humidifier'})}${symbol[humSymbol]}${humidifier}`
      }
      return conditions.map(condition => {
        const conMap = {
          model: {
            type: '',
            action: condition.condition,
            condition: condition.condition,
            conditionType: '00'
          },
          selected: null
        }
        if (condition.serialId) { // chain's device condition
          conMap.model.type = '2'
          conMap.model.conditionType = '01'
          conMap.model.action = parseChainAction(condition.condition)
          conMap.selected = {...condition}
        } else { // timing condition
          conMap.model.type = '1'
          conMap.model.conditionType = '00'
        }
        return conMap
      })
    },
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
  // top: 26px;
  // right: 10px;
  top: 0;
  right: 0;
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
  right: 15%;
  padding: 5px;
}
.action-content .condition-item{
  width: 80%;
  padding: 14px 5px;
  border-radius: 4px;
  // padding: 5px;
  // margin: 0 auto;
}
.condition-item .action-item > div{
  width: 130px;
  margin-right: 5px;
}
.condition-item .action-item > div:first-of-type{
  width: 70px;
}
.condition-item .action-item > .action-item__behavior{
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
  text-align: center;
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
.location .el-select{
  margin-right: 28px;
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
