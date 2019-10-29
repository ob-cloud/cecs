<template>
  <div class="device smart">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>{{breadcrumb.prev}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{breadcrumb.current}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName" tab-position="left" class="room-container tab-aside">
      <el-tab-pane label="" disabled class="menu-panel">
         <span slot="label" class="menu-panel__label"><i class="el-icon-menu"></i></span>
      </el-tab-pane>
      <el-tab-pane label="地图" name="map">
        <i-map :height="tableHeight"></i-map>
      </el-tab-pane>
      <el-tab-pane label="房间" name="room">
        <room v-if="activeName === 'room'" :height="tableHeight" :roomPreload="roomPreload"></room>
      </el-tab-pane>
      <el-tab-pane label="楼栋" name="building">
        <building v-if="activeName === 'building'" :height="tableHeight" :preload="buildingPreload"></building>
      </el-tab-pane>
      <el-tab-pane label="楼层" name="floor">
        <floor v-if="activeName === 'floor'" :height="tableHeight" :preload="floorPreload"></floor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Building from './building'
import Floor from './floor'
import Room from './room'
import iMap from './map'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      activeName: 'map',
      tableHeight: 0,
      roomPreload: false,
      buildingPreload: false,
      floorPreload: false,
      breadcrumb: {
        prev: '房间管理',
        current: '地图'
      }
    }
  },
  components: { Building, Floor, Room, iMap },
  created () {
  },
  // watch: {
  //   activeName (val) {
  //     if (!val) return
  //     // this.mapPreload = val === 'map'
  //     this.roomPreload = val === 'room'
  //     this.buildingPreload = val === 'building'
  //     this.floorPreload = val === 'floor'
  //     console.log(this.roomPreload)
  //   }
  // },
  watch: {
    '$route' (val) {
      this.breadcrumb.prev = val.meta.title
    },
    activeName (val) {
      if (!val) return
      this.breadcrumb.current = {
        'map': '地图',
        'room': '房间',
        'building': '楼栋',
        'floor': '楼层'
      }[val]
    }
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = this.activeName === 'map' ? Helper.calculateTableHeight(false, false) - 50 : Helper.calculateTableHeight() - 20
      this.tableHeight -= 40
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  // padding: 10px;
  // padding-left: 30px;
  // width: 94%;
  // margin: 0 auto;
  // margin: 12px auto;
}
</style>
<style lang="scss">
  // .room-container{
  //   position: relative;
  //   .el-tabs__header.is-left{
  //     position: fixed;
  //     z-index: 1;
  //   }
  //   .el-tabs__content{
  //     padding-left: 64px;
  //   }
  // }
</style>
