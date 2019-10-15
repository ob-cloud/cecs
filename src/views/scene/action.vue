<template>
  <div class="action-container">
    <div v-if="is3KeyPanel()" class="list">
      <el-checkbox-group v-model="powers">
        <el-checkbox-button v-for="(item, index) in 3" :label="index+1" :key="index">
          <i class="obicon obicon-power"></i>
        </el-checkbox-button>
      </el-checkbox-group>
    </div>
    <div v-if="isTransponder()" class="list transponder">
      <div class="item" :class="{active: item.index === currentTransponderDevice.index}" v-for="(item, index) in transponderList" :key="index" @click="currentTransponderDevice = item">
        <p class="item-icon">
          <i class="obicon obicon-ac" :class="transponderIconFilter(item.deviceType)"></i>
        </p>
        <p>{{item.name}}</p>
        <p>{{item.rmodel}}</p>
      </div>
    </div>
    <div class="footer">
      <el-button type="primary" @click="handleSelected">确 认</el-button>
    </div>
  </div>
</template>

<script>
import * as panelHandler from '@/oblink/panelHandler'
import DeviceAPI from '@/api/device'
export default {
  props: {
    actionObject: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      powers: [],
      powerStatus: [0, 0, 0],
      transponderList: [],
      currentTransponderDevice: {}
      // deviceType: '',
      // deviceSubType: ''
    }
  },
  watch: {
    powers (val) {
      this.changeStatus(val)
    }
  },
  computed: {
    deviceType () {
      return this.actionObject && this.actionObject.device_type
    },
    deviceSubType () {
      return this.actionObject && this.actionObject.device_child_type
    }
  },
  mounted () {
    console.log(this.deviceType, this.deviceSubType)
    console.log(this.actionObject)
    this.isTransponder() && this.getTransponderDeviceList()
  },
  methods: {
    transponderIconFilter (type) {
      const iconMap = {
        7: 'obicon-ac',
        2: 'obicon-tv'
      }
      return {[iconMap[type]]: true}
    },
    is3KeyPanel () {
      return this.deviceType === '04' && this.deviceSubType === '21'
    },
    isTransponder () {
      return this.deviceType === '51'
    },
    changeStatus (power) {
      this.powerStatus.forEach((element, index) => {
        const isExist = power.find(item => item === index + 1)
        this.powerStatus[index] = +!!isExist
      })
    },
    getTransponderDeviceList () {
      DeviceAPI.getTransponderDevice(this.actionObject.serialId).then(res => {
        if (res.status === 200) {
          this.transponderList = res.data.rs
        }
      })
    },
    handleSelected () {
      console.log('--- ', panelHandler.changeSwitchButtonToAction(this.powerStatus, this.actionObject))
      this.$emit('action-change', {action: panelHandler.changeSwitchButtonToAction(this.powerStatus, this.actionObject), extra: this.powerStatus}, false)
    }
  },
}
</script>

<style lang="scss" scoped>
.footer{
  padding: 18px 8px 0;
  text-align: right;
}
</style>
<style lang="scss">
.action-container {
  .list {
    text-align: center;
    padding: 80px 10px;
    &.transponder{
      padding: 10px;
      text-align: left;
    }
    &.transponder .item{
      display: inline-block;
      width: 140px;
      // height: 80px;
      overflow: hidden;
      border: 1px solid #999;
      border-radius: 4px;
      padding: 10px;
      margin: 5px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      transition: all .3s;

      &.active{
        border-color: #409EFF;
      }
    }
    &.transponder .item-icon{
      text-align: center;
      > i{
        font-size: 40px;
      }
    }
    &.transponder p:last-of-type{
      color: #999;
      margin-top: 4px;
      font-size: 12px;
    }
    .el-checkbox-button{
      width: 30%;
    }
    .el-checkbox-button__inner{
      border: 1px solid #DCDFE6;
      border-radius: 4px;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner{
      border-color: #409EFF;
    }
    .obicon{
      font-size: 16px;
    }
  }
}
</style>
