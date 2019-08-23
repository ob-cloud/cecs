<template>
  <div class="smart">
    <div class="header">
      <el-select clearable class="item" placeholder="obox" v-model="oboxId">
        <el-option label='所有设备' value=''></el-option>
        <el-option :label='item.obox_name' :value='item.obox_serial_id' v-for="(item, index) in oboxs" :key="index"></el-option>
      </el-select>
      <el-select clearable class="item" filterable placeholder="设备类型" v-model="deviceType">
        <el-option label='设备类型' value=''></el-option>
        <el-option :label='item' :value='key' v-for="(item, key) in deviceTypeList" :key="key"></el-option>
      </el-select>
    </div>
    <div class="body">
      <div class="image obicon obicon-curtain">

      </div>
      <div class="text">长按设备复位键，直到指示灯闪烁</div>
    </div>
  </div>
</template>

<script>
import deviceTypeList from '@/common/deviceType'
export default {
  name: 'device-create',
  props: {
    oboxs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      oboxId: '',
      deviceType: '',
      deviceTypeList
    }
  },
  watch: {
    oboxId (val) {
      console.log('oboxId ', val)
      this.$emit('deviceSelected', {oboxId: val, deviceType: this.deviceType.slice(0, 2), deviceSubType: this.deviceType.slice(2)})
    },
    deviceType (val) {
      console.log('deviceType ', val)
      this.$emit('deviceSelected', {oboxId: this.oboxId, deviceType: val.slice(0, 2), deviceSubType: val.slice(2)})
    }
  },
  mounted () {
    console.log('oboxs --++ ', this.oboxs)
    console.log('deviceTypeList --++ ', this.deviceTypeList)
  },
}
</script>

<style lang="scss" scoped>
.header{
  text-align: center;
  .item{
    width: 40%;
  }
  .item:last-of-type {
    margin-left: 100px;
  }
}
.body{
  padding: 10px;
  text-align: center;
}
.obicon {
  font-size: 150px;
  color: #999;
}
.text{
  font-size: 12px;
  color: #999;
}
</style>
