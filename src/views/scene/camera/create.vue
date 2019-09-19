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
      <el-form-item label="行为设备" prop="deviceIdList">
        <el-select v-model="deviceIdList" multiple placeholder="请选择设备" class="w8">
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
              <el-tab-pane label="条件" name="c1" class="panel">
                <div class="condition-item clearfix" v-for="(condition, index) in conditionList" :key="index">
                  <i class="el-icon-date fl"></i>
                  <i class="el-icon-close fr" @click="removeCondition(index)"></i>
                  <p>{{condition.model.type}}: {{parseCondition(condition)}}</p>
                </div>
                <el-button class="add-btn" size="mini" type="plain" icon="el-icon-plus" @click="addCondition"></el-button>
              </el-tab-pane>
            </el-tabs>
            <div class="actions">
              <div class="header">动作</div>
              <div class="content">
                <div class="condition-item clearfix" v-for="(device, index) in deviceSelectedList" :key="index">
                  <i class="el-icon-date fl"></i>
                  <i class="el-icon-close fr"></i>
                  <p>{{device.name}}： {{parseAction(device)}}</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-form-item>
    </el-form>
    <!-- 条件类型弹窗 -->
    <el-dialog v-if="conDialogVisible" width="760px" title="条件类型" :visible.sync="conDialogVisible" :close-on-click-modal="false" append-to-body>
      <scene-condition :isLcal="true" :deviceList="oboxDeviceList" @condition-change="onConditionChange"></scene-condition>
    </el-dialog>
    <div class="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="handleSelectedCondition">确 认</el-button>
    </div>
  </div>
</template>

<script>
import SceneCondition from './condition'
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
    const that = this
    const validateAction = (rule, value, callback) => {
      if (!that.deviceSelectedList.length) {
        callback(new Error('请选择行为设备'))
      } else {
        callback()
      }
    }
    return {
      name: '',
      oboxDeviceList: [],
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
      conditionsTab: 'c1',
      conDialogVisible: false,
      conditionObject: null,
      conditionList: [],
      sceneModelRules: {
        scene_name: [{ required: true, trigger: 'blur', message: '场景名称不能为空'}],
        msg_alter: [{ required: true, trigger: 'blur', message: '消息推送不能为空'}],
        deviceIdList: [{ required: true, trigger: 'blur', validator: validateAction}]
      }
    }
  },
  components: {SceneCondition},
  mounted () {
    this.getDeviceList()
    this.getCameraList().then(this.parseSceneData)
  },
  watch: {
    deviceIdList (serialIds) {
      this.deviceSelectedList = serialIds.map(serialId => {
        return this.deviceList.find(device => serialId === device.serialId)
      })
    }
  },
  methods: {
    getDeviceList () {
      return DeviceAPI.getDeviceList({pageNo: this.pageNo, pageSize: this.pageSize}).then(res => {
        if (res.status === 200) {
          this.oboxDeviceList = res.data.config
        }
      })
    },
    getCameraList () {
      return DeviceAPI.getCameraList().then(res => {
        if (res.status === 200) {
          this.deviceList = res.data.list
        }
      })
    },
    addCondition () {
      this.conDialogVisible = true
    },
    removeCondition (index) {
      this.conditionList.splice(index, 1)
    },
    onConditionChange (condition, dialogVisible) {
      this.conditionList.push(condition)
      this.conDialogVisible = dialogVisible
    },
    handleSelectedCondition () {
      const actions = this.getModelAction()
      const conditions = this.getModelCondition()
      this.sceneModel.actions = actions
      this.sceneModel.conditions.push(conditions)
      this.$refs.sceneForm.validate(valid => {
        if (valid) {
          this.$emit('scene-ready', this.sceneModel, false)
        }
      })
    },
    close () {
      this.$emit('close')
    },
    isGateSensors (device) {
      return Suit.typeHints.isGateSensors(device.device_child_type)
    },
    parseCondition (condition) {
      const type = Suit.getDeviceTypeDescriptor(condition.selected.device_type, condition.selected.device_child_type)
      return `${type}${condition.selected.name} ${condition.model.action}`
    },
    parseAction (device) {
      // const type = Suit.getDeviceTypeDescriptor(device.device_type, device.device_child_type)
      if (device.channel) {
        return `拍照`
      }
    },
    getModelCondition () {
      return this.conditionList.map(condition => {
        const device = condition.selected
        const cons = {
          addr: device.addr,
          condition: '',
          condition_type: '01',
          conditionID: device.name,
          device_child_type: device.device_child_type,
          device_type: device.device_type,
          obox_serial_id: device.obox_serial_id,
          serialId: device.serialId
        }
        if (this.isGateSensors(device)) {
          cons.condition = '4a01000000000000'
        }
        return cons
      })
    },
    getModelAction () {
      return this.deviceSelectedList.map(device => {
        const actions = {
          action: device.channel,
          actionName: device.name,
          addr: device.addr,
          device_child_type: device.device_child_type,
          device_type: device.device_type,
          node_type: '08',
          channel_number: 1,
          obox_serial_id: device.obox_serial_id,
          serialId: device.serialId
        }
        // if (this.isGateSensors(device)) {
        //   actions.action = 'xxxxxxx'
        // }
        return actions
      })
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
</style>
