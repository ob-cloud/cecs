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
      <el-tab-pane :label="$t(`smart.${item.name}.title`)" :name="item.name" v-for="(item, index) in navMenu" :key="index">
        <template v-if="item.id===$submenu.map">
          <i-map v-if="activeName === 'map'" :height="tableHeight"></i-map>
        </template>
        <template v-if="item.id===$submenu.room">
          <room v-if="activeName === 'room'" :height="tableHeight" :roomPreload="roomPreload"></room>
        </template>
        <template v-if="item.id===$submenu.building">
          <building v-if="activeName === 'building'" :height="tableHeight" :preload="buildingPreload"></building>
        </template>
        <template v-if="item.id===$submenu.floor">
          <floor v-if="activeName === 'floor'" :height="tableHeight" :preload="floorPreload"></floor>
        </template>
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
import {privRoomSubMenu} from '@/router/menu'
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
      },
      navMenu: []
    }
  },
  components: { Building, Floor, Room, iMap },
  created () {
  },
  watch: {
    '$route' (val) {
      this.breadcrumb.prev = this.$t('system.route', {FIELD: val.meta.title})
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
    this.getMenuList()
  },
  methods: {
    fixLayout () {
      this.tableHeight = this.activeName === 'map' ? Helper.calculateTableHeight(false, false) - 50 : Helper.calculateTableHeight() - 20
      this.tableHeight -= 40
    },
    getMenuList () {
      const menu = privRoomSubMenu
      const validMenu = menu.filter(item => this.$isPermited(item.id))
      this.navMenu = validMenu
      this.activeName = validMenu[0] && validMenu[0].name
      this.breadcrumb.current = this.activeName && this.$t(`smart.${this.activeName}.title`)
    }
  }
}
</script>
