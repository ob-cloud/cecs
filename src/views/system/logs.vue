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
      <el-tab-pane :label="$t('smart.logrecords.title')" name="logs">
        <Logs v-if="activeName === 'logs'" :height="tableHeight"></Logs>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.exportrecords.title')" name="exports">
        <Exports v-if="activeName === 'exports'" :height="tableHeight"></Exports>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Logs from './components/logs'
import Exports from './components/exports'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      activeName: 'logs',
      tableHeight: 0,
      breadcrumb: {
        prev: this.$t('smart.logmodule'),
        current: this.$t('smart.logrecords.title')
      }
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
        'logs': this.$t('smart.logrecords.title'),
        'exports': this.$t('smart.exportrecords.title')
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
