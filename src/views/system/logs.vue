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
        <template v-if="item.id===$submenu.logrecords">
          <Logs v-if="activeName === 'logrecords'" :height="tableHeight" :layoutHeight="containerHeight"></Logs>
        </template>
        <template v-if="item.id===$submenu.exportrecords">
          <Exports v-if="activeName === 'exportrecords'" :height="tableHeight" :layoutHeight="containerHeight"></Exports>
        </template>
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('smart.logrecords.title')" name="logs">
        <Logs v-if="activeName === 'logs'" :height="tableHeight"></Logs>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.exportrecords.title')" name="exports">
        <Exports v-if="activeName === 'exports'" :height="tableHeight"></Exports>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import Logs from './components/logs'
import Exports from './components/exports'
import Helper from '@/common/helper'
import {privLogSubMenu} from '@/router/menu'
export default {
  data () {
    return {
      activeName: 'logrecords',
      tableHeight: 0,
      containerHeight: 0,
      breadcrumb: {
        prev: this.$t('smart.logmodule'),
        current: this.$t('smart.logrecords.title')
      },
      navMenu: []
    }
  },
  components: { Logs, Exports },
  created () {
  },
  watch: {
    '$route' (val) {
      this.breadcrumb.prev = val.meta.title
    },
    activeName (val) {
      if (!val) return
      this.breadcrumb.current = {
        'logrecords': this.$t('smart.logrecords.title'),
        'exportrecords': this.$t('smart.exportrecords.title')
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
      const menu = privLogSubMenu
      const validMenu = menu.filter(item => this.$isPermited(item.id))
      this.navMenu = validMenu
      this.activeName = validMenu[0] && validMenu[0].name
      this.breadcrumb.current = this.$t(`smart.${this.activeName}.title`)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
  .tab-container{
    position: relative;
    .el-tabs__header.is-left{
      position: fixed;
      z-index: 1;
    }
    .el-tabs__content{
      padding-left: 95px;
    }
  }
</style>
