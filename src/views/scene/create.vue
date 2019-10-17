<template>
  <div class="smart">
    <el-form ref="sceneForm" :rules="sceneModelRules" :model="sceneModel" label-width="100px">
      <el-form-item label="场景名称" prop="scene_name">
        <el-input class="caption-item w8" placeholder="场景名称" v-model="sceneModel.scene_name"></el-input>
      </el-form-item>
      <el-form-item label="消息推送" prop="msg_alter">
        <el-radio-group v-model="sceneModel.msg_alter">
          <el-radio :label="0">无推送</el-radio>
          <el-radio :label="1">APP推送</el-radio>
          <el-radio :label="2">短信推送</el-radio>
          <el-radio :label="3">APP/短息推送</el-radio>
        </el-radio-group>
      </el-form-item>
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
      <el-form-item label="设备条件">
        <el-card class="box-card w8">
          <div slot="header" class="clearfix">
            <span>条件</span>
            <!-- <i class="close fr el-icon-close"></i> -->
          </div>
          <div class="">
            <el-tabs class="condition" v-model="conditionsTab" type="border-card">
              <el-tab-pane label="条件1" name="c1" class="panel">
                <div class="condition-item clearfix" v-for="(condition, index) in conditionMapList['c1']" :key="index">
                  <i class="obicon obicon-node fl"></i>
                  <i class="el-icon-close fr" @click="removeCondition(index)"></i>
                  <p>{{parseCondition(condition)}}</p>
                </div>
                <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="addCondition"></el-button>
              </el-tab-pane>
              <el-tab-pane label="条件2" name="c2" class="panel">
                <div class="condition-item clearfix" v-for="(condition, index) in conditionMapList['c2']" :key="index">
                  <i class="obicon obicon-node fl"></i>
                  <i class="el-icon-close fr" @click="removeCondition(index)"></i>
                  <p>{{parseCondition(condition)}}</p>
                </div>
                <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="addCondition"></el-button>
              </el-tab-pane>
              <el-tab-pane label="条件3" name="c3" class="panel">
                <div class="condition-item clearfix" v-for="(condition, index) in conditionMapList['c3']" :key="index">
                  <i class="obicon obicon-node fl"></i>
                  <i class="el-icon-close fr" @click="removeCondition(index)"></i>
                  <p>{{parseCondition(condition)}}</p>
                </div>
                <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="addCondition"></el-button>
              </el-tab-pane>
            </el-tabs>
            <!-- <div class="actions">
              <div class="header">动作</div>
              <div class="content">
                <div class="condition-item clearfix" v-for="(device, index) in deviceSelectedList" :key="index">
                  <i class="el-icon-date fl"></i>
                  <i class="el-icon-close fr"></i>
                  <p>{{device.name}}： {{parseAction(device)}}</p>
                </div>
              </div>
            </div> -->
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="设备行为">
        <div class="action-content">
          <div class="condition-item clearfix" v-for="(deviceAction, index) in deviceActionModel" :key="index">
            <i class="el-icon-close fr" @click="handleRemoveAction(index)"></i>
            <div class="action-item">
              <el-tooltip content="行为执行时间(单位秒)" placement="top">
                <el-input-number v-model="deviceAction.second" controls-position="right" :min="0"></el-input-number>
              </el-tooltip>
              <el-select placeholder="请选择栋" v-model="deviceAction.building" filterable>
                <el-option v-for="item in buildingList" :key="item" :label="item + '栋'" :value="item"></el-option>
              </el-select>
              <el-select placeholder="请选择层" v-model="deviceAction.floor" filterable>
                <el-option v-for="item in layerList" :key="item" :label="item + '层'" :value="item"></el-option>
              </el-select>
              <el-select placeholder="请选择设备类型" v-model="deviceAction.serialId" @change="onSelectDevice(deviceAction.serialId, index)">
                <el-option v-for="(item, index) in deviceTypeList" :key="index" :label="item.device_type | deviceTypeFilter(item.device_child_type)" :value="item.serialId"></el-option>
              </el-select>
              <div v-if="deviceAction.serialId" class="action-item__behavior" @click="settingAction(deviceAction.serialId, index)" :title="deviceAction.actionDescriptor">
                <p>{{deviceAction.actionDescriptor || '配置设备动作'}}</p>
              </div>
            </div>
          </div>
          <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="handleAddAction"></el-button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 条件类型弹窗 -->
    <el-dialog v-if="conDialogVisible" width="950px" top="10%" title="条件类型" :visible.sync="conDialogVisible" :close-on-click-modal="false" append-to-body>
      <scene-condition :isLcal="true" :deviceList="deviceList" @condition-change="onConditionChange"></scene-condition>
    </el-dialog>
    <!-- action -->
    <el-dialog v-if="actionDialogVisible" :width="activeDevice.device_type === '51' ? '80%' : '600px'" title="设备行为配置" :visible.sync="actionDialogVisible" :close-on-click-modal="false" append-to-body>
      <scene-action :actionObject="activeDevice" @action-change="onActionChange"></scene-action>
    </el-dialog>
    <div class="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSelectedCondition">确 认</el-button>
    </div>
  </div>
</template>

<script>
import SceneCondition from './condition'
import SceneAction from './action'
import DeviceAPI from '@/api/device'
const {default: Suit} = require('@/common/suit')
import { PAGINATION_PAGENO } from '@/common/constants'
export default {
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
        second: 0,
        building: '',
        floor: '',
        serialId: '',
        actionDescriptor: '',
        action: ''
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
        scene_name: [{ required: true, trigger: 'blur', message: '场景名称不能为空'}],
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
      buildingList: [],
      layerList: []
    }
  },
  filters: {
    deviceTypeFilter (type, subtype) {
      return subtype ? Suit.getDeviceTypeDescriptor(type, subtype) : Suit.getRootDeviceDescriptor(type)
    }
  },
  components: {SceneCondition, SceneAction},
  mounted () {
    this.getDeviceList()
    this.getBuildingList()
    this.getLayerList()
  },
  watch: {
    deviceIdList (serialIds) {
      this.deviceSelectedList = serialIds.map(serialId => {
        return this.deviceList.find(device => serialId === device.serialId)
      })
    }
  },
  methods: {
    getBuildingList () {
      this.buildingList = ['1', '12', '2', '3', '4']
    },
    getLayerList () {
      this.layerList = ['1', '2', '22', '3', '4']
    },
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
          title: '提示',
          message: '一组最多三个条件',
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
    onSelectDevice (serialId, index) {
      this.activeDevice = this.deviceTypeList.find(item => item.serialId === serialId)
      this.currentAction = this.deviceActionModel[index]
    },
    handleRemoveAction (index) {
      this.deviceActionModel.splice(index, 1)
    },
    handleAddAction () {
      this.deviceActionModel.push({
        second: 0,
        building: '',
        floor: '',
        serialId: '',
        actionDescriptor: '',
        action: ''
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
        str = `定时 ${condition.model.date ? condition.model.date : condition.model.week || ''} ${condition.model.time || ''}`
      } else if (condition.model.type === '2') {
        const type = Suit.getDeviceTypeDescriptor(condition.selected.device_type, condition.selected.device_child_type)
        str = `联动 ${type} ${condition.model.action}`
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
  margin: 0 20px;
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
  line-height: 40px;
  font-size: 14px;
  padding-right: 5px;
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
