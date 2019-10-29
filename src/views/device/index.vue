<template>
  <div class="device smart">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>{{breadcrumb.prev}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breadcrumb.current}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName" tab-position="left" class="tab-aside">
      <el-tab-pane label="" disabled class="menu-panel">
         <span slot="label" class="menu-panel__label"><i class="el-icon-menu"></i></span>
      </el-tab-pane>
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
      tableHeight: 0,
      breadcrumb: {
        prev: '设备管理',
        current: 'OBOX设备'
      }
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
  watch: {
    '$route' (val) {
      this.breadcrumb.prev = val.meta.title
    },
    activeName (val) {
      if (!val) return
      this.breadcrumb.current = {
        'obox': 'OBOX设备',
        'wifi': 'WIFI设备',
        'gateway': '网关'
      }[val]
    }
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 20 - 40
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  // width: 94%;
  // margin: 12px auto;
  margin: 0 auto;
}

</style>
