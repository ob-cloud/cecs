<template>
  <div class="smart building">
    <div class="search-bar">
      <div class="caption is-right">
        <el-button-group>
          <el-button type="plain" icon="btn-icon el-icon-refresh" title="刷新" @click="handleRefresh"></el-button>
          <el-button type="plain" icon="btn-icon el-icon-circle-plus-outline" title="添加" @click="handleCreate"></el-button>
          <el-button type="plain" icon="btn-icon obicon obicon-switch-btn" title="开关总闸" @click="handleMainSwitch"></el-button>
        </el-button-group>
      </div>
      <div class="caption">
        <el-input class="caption-item" @keyup.enter.native="handleSearch" placeholder="请输入楼栋"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </div>
    </div>
    <div class="building-list" v-loading.lock="loading">
      <div class="building-item" v-for="item in 50" :key="item">
        <div class="header">
          <i class="icon obicon obicon-power" title="电源" @click="handlePower(item)"></i>
          <i class="icon el-icon-edit" title="编辑" @click="handleEdit(item)"></i>
          <i class="icon el-icon-delete" title="删除" @click="handleRemove(item)"></i>
        </div>
        <div class="content">
          <i class="building-sign obicon obicon-building"></i>
          <p class="text">BA-01 {{item}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true
    }
  },
  created () {
    this.getBuildingList()
  },
  methods: {
    getBuildingList () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 3000)
    },
    handleRefresh () {
      this.getBuildingList()
    },
    handleCreate () {

    },
    handleSearch () {

    },
    handleMainSwitch () {

    },
    handlePower (item) {

    },
    handleEdit (item) {

    },
    handleRemove (item) {

    }
  },
}
</script>

<style lang="scss" scoped>
.smart{
  // padding: 10px;
}
.search-bar{
  padding: 10px;
  .caption::before,
  .caption::after{
    content: " ";
    visibility: hidden;
    width: 1px;
    height: 1px;
    clear: both;
  }
  .caption.is-right{
    float: right;
  }
  .caption .el-button-group .el-button{
    padding: 3px 8px;
  }

  .caption-item{
    width: 200px;
    margin-right: 20px;
  }
}
.building-item{
  position: relative;
  display: inline-block;
  padding: 20px;
  background: #fff;
  margin: 10px;
  width: 190px;
  height: 142px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 0px 3px 1px #c0c4cc;

  .header{
    position: absolute;
    right: 5px;
    top: 5px;

    .icon{
      font-size: 14px;
      padding: 5px;
      cursor: pointer;
      color: #999;
      transition: all .3s;

      &:hover{
        color: #000;
      }
      & + .icon{
        right: 5px;
      }
    }
  }
  .content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
  .building-sign{
    display: inline-block;
    color: #bdbdbd;
    font-size: 50px;
    padding: 5px;

    &.is-active{
      color: #afaf1e;
    }
  }
  .text{
    font-size: 14px;
    display: inline-block;
    margin-left: 5px;
  }
}
</style>
<style lang="scss">
.caption .btn-icon{
  font-size: 30px;
  color: #444;
}
</style>
