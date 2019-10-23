<template>
  <transition name="slide-fade">
    <div class="sidebar" v-if="dialogVisible">
      <div class="header">
        <i class="el-icon el-icon-close" @click="dialogVisible = false"></i>
        <div class="title">dsf</div>
      </div>
      <div class="content">
        <div class="item">
          <div class="title">开关</div>
          <div class="detail">
            <div class="power">
              <el-button size="small" type="default" icon="obicon obicon-power"></el-button>
              <el-button size="small" type="default" icon="obicon obicon-power"></el-button>
              <el-button size="small" type="default" icon="obicon obicon-power"></el-button>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title">温湿度</div>
          <div class="detail">
            <div class="sensors">
              <p><i class="obicon obicon-temperature-o"></i><span>温度</span></p>
              <span>23℃</span>
            </div>
            <div class="sensors">
              <p><i class="obicon obicon-humidity"></i><span>湿度</span></p>
              <span>33%</span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="title">操作</div>
          <div class="detail">
            <div class="action">
              <el-tooltip content="删除房间" placement="bottom" effect="light">
                <el-button size="small" type="danger" icon="obicon obicon-trash"></el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>
