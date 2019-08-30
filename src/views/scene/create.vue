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
    <!-- 条件类型弹窗 -->
    <el-dialog width="760px" title="条件类型" :visible.sync="conDialogVisible" :close-on-click-modal="false" append-to-body>
      <scene-condition :isLcal="true" :deviceList="deviceList" @condition-change="onConditionChange"></scene-condition>
      <div slot="footer" class="dialog-footer text-center" >
        <el-button @click="conDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSelectedCondition">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SceneCondition from './condition'
import DeviceAPI from '@/api/device'
// const {default: Suit} = require('@/common/suit')
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
      conDialogVisible: false,
      conditionObject: null
    }
  },
  components: {SceneCondition},
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
    addCondition () {
      this.conDialogVisible = true
    },
    onConditionChange (condition) {
      console.log(condition)
      this.conditionObject = condition
    },
    handleSelectedCondition () {
      if (!this.conditionObject) {
        return this.$message({
          type: 'warning',
          message: '请正确选择条件'
        })
      }
      this.conDialogVisible = false
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
