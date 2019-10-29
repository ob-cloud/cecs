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
      <el-tab-pane label="账户管理" name="account">
        <account v-if="activeName === 'account'" :height="tableHeight"></account>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="role">
        <role v-if="activeName === 'role'" :height="tableHeight"></role>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Account from './components/account'
import Role from './components/role'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      activeName: 'account',
      tableHeight: 0,
      breadcrumb: {
        prev: '用户管理',
        current: '账户管理'
      }
    }
  },
  components: { Account, Role },
  created () {
  },
  watch: {
    '$route' (val) {
      this.breadcrumb.prev = val.meta.title
    },
    activeName (val) {
      if (!val) return
      this.breadcrumb.current = {
        'account': '账户管理',
        'role': '角色管理'
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
