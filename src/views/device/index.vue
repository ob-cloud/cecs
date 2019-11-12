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
      <el-tab-pane :label="$t(`smart.${item.name}.title`)" :name="item.name" v-for="(item, index) in navMenu" :key="index">
        <template v-if="item.id===$submenu.obox">
          <device-obox v-if="activeName === 'obox'" :height="tableHeight" :layoutHeight="containerHeight"></device-obox>
        </template>
        <template v-if="item.id===$submenu.wifi">
          <device-wifi v-if="activeName === 'wifi'" :height="tableHeight" :layoutHeight="containerHeight"></device-wifi>
        </template>
        <template v-if="item.id===$submenu.gateway">
          <gateway v-if="activeName === 'gateway'" :height="tableHeight" :layoutHeight="containerHeight"></gateway>
        </template>
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('smart.obox.title')" name="obox">
        <device-obox v-if="activeName === 'obox'" :height="tableHeight"></device-obox>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.wifi.title')" name="wifi">
        <device-wifi v-if="activeName === 'wifi'" :height="tableHeight"></device-wifi>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.gateway.title')" name="gateway">
        <gateway v-if="activeName === 'gateway'" :height="tableHeight"></gateway>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import DeviceObox from './obox'
import DeviceWifi from './wifi'
import Gateway from './gateway'
import Helper from '@/common/helper'
import {privDevSubMenu} from '@/router/menu'
export default {
  data () {
    return {
      activeName: 'obox',
      tableHeight: 0,
      containerHeight: 0,
      breadcrumb: {
        prev: this.$t('smart.devicemodule'),
        current: this.$t('smart.obox.title')
      },
      navMenu: []
    }
  },
  components: { DeviceObox, DeviceWifi, Gateway },
  created () {
  },
  watch: {
    '$route' (val) {
      this.breadcrumb.prev = val.meta.title
    },
    activeName (val) {
      if (!val) return
      this.breadcrumb.current = {
        'obox': this.$t('smart.obox.title'),
        'wifi': this.$t('smart.wifi.title'),
        'gateway': this.$t('smart.gateway.title')
      }[val]
    }
  },
  mounted () {
    this.getMenuList()
    Helper.windowOnResize(this, this.fixLayout)
    Helper.windowOnResize(this, this.fixContainerLayout)
  },
  methods: {
    fixContainerLayout () {
      this.containerHeight = Helper.calculateContainerHeight() - 30
    },
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 20 - 40
    },
    getMenuList () {
      const menu = privDevSubMenu
      const validMenu = menu.filter(item => this.$isPermited(item.id))
      this.navMenu = validMenu
      this.activeName = validMenu[0] && validMenu[0].name
      this.breadcrumb.current = this.$t(`smart.${this.activeName}.title`)
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
