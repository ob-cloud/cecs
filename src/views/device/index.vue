<template>
  <div class="device smart">
    <el-tabs v-model="activeName" tab-position="left" class="tab-aside">
      <el-tab-pane label="OBOX设备" name="obox">
        <device-obox v-if="activeName === 'obox'" :height="tableHeight"></device-obox>
      </el-tab-pane>
      <el-tab-pane label="WIFI设备" name="wifi">
        <device-wifi v-if="activeName === 'wifi'" :height="tableHeight"></device-wifi>
      </el-tab-pane>
      <el-tab-pane label="网关" name="gateway">
        <gateway v-if="activeName === 'gateway'" :height="tableHeight"></gateway>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DeviceObox from './obox'
import DeviceWifi from './wifi'
import Gateway from './gateway'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      activeName: 'obox',
      tableHeight: 0
    }
  },
  components: { DeviceObox, DeviceWifi, Gateway },
  created () {
  },
  computed: {
    total () {
      return this.tableData.length || 0
    }
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 40
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  // width: 94%;
  margin: 12px auto;
}
</style>
