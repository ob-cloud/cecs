<template>
  <div class="device smart">
    <el-tabs v-model="activeName" tab-position="left" class="room-container">
      <el-tab-pane label="地图" name="map">
        <i-map :height="tableHeight"></i-map>
      </el-tab-pane>
      <el-tab-pane label="房间" name="room">
        <room :height="tableHeight" :roomPreload="roomPreload"></room>
      </el-tab-pane>
      <el-tab-pane label="楼栋" name="building">
        <building :height="tableHeight" :preload="buildingPreload"></building>
      </el-tab-pane>
      <el-tab-pane label="楼层" name="floor">
        <floor :height="tableHeight" :preload="floorPreload"></floor>
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
      floorPreload: false
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
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight()
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  padding: 10px;
  padding-left: 30px;
  // width: 94%;
  // margin: 0 auto;
}
</style>
<style lang="scss">
  .room-container{
    position: relative;
    .el-tabs__header.is-left{
      position: fixed;
      z-index: 1;
    }
    .el-tabs__content{
      padding-left: 64px;
    }
  }
</style>
