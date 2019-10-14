<template>
  <div class="device smart">
    <el-tabs v-model="activeName" tab-position="left" class="tab-container">
      <el-tab-pane label="账户管理" name="account">
        <account :height="tableHeight"></account>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="role">
        <role :height="tableHeight"></role>
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
      tableHeight: 0
    }
  },
  components: { Account, Role },
  created () {
  },
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
