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
        <template v-if="item.id===$submenu.account">
          <account v-if="activeName === 'account'" :height="tableHeight" :layoutHeight="containerHeight"></account>
        </template>
        <template v-if="item.id===$submenu.role">
          <role v-if="activeName === 'role'" :height="tableHeight" :layoutHeight="containerHeight"></role>
        </template>
      </el-tab-pane>

      <!-- <el-tab-pane :label="$t('smart.account.title')" name="account" v-isPermited="51">
        <account v-if="activeName === 'account'" :height="tableHeight"></account>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.role.title')" name="role" v-isPermited="57">
        <role v-if="activeName === 'role'" :height="tableHeight"></role>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import Account from './components/account'
import Role from './components/role'
import Helper from '@/common/helper'
import {privUsrSubMenu} from '@/router/menu'
export default {
  data () {
    return {
      activeName: 'account',
      tableHeight: 0,
      containerHeight: 0,
      breadcrumb: {
        prev: this.$t('smart.usermodule'),
        current: this.$t('smart.account.title')
      },
      navMenu: []
    }
  },
  components: { Account, Role },
  created () {
    this.getMenuList()
  },
  watch: {
    '$route' (val) {
      this.breadcrumb.prev = val.meta.title
    },
    activeName (val) {
      if (!val) return
      this.breadcrumb.current = {
        'account': this.$t('smart.account.title'),
        'role': this.$t('smart.role.title')
      }[val]
    }
  },
  mounted () {
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
      const menu = privUsrSubMenu
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
  // padding: 10px;
  // padding-left: 30px;
  // width: 94%;
  // margin: 0 auto;
}
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
