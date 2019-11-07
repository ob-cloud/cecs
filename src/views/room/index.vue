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
      <el-tab-pane :label="$t('smart.map.title')" name="map">
        <i-map v-if="activeName === 'map'" :height="tableHeight"></i-map>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.room.title')" name="room">
        <room v-if="activeName === 'room'" :height="tableHeight" :roomPreload="roomPreload"></room>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.building.title')" name="building">
        <building v-if="activeName === 'building'" :height="tableHeight" :preload="buildingPreload"></building>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.floor.title')" name="floor">
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
        prev: this.$t('smart.roommodule'),
        current: this.$t('smart.map.title')
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
        'map': this.$t('smart.map.title'),
        'room': this.$t('smart.room.title'),
        'building': this.$t('smart.building.title'),
        'floor': this.$t('smart.floor.title'),
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
