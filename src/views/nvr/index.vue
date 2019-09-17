<template>
  <div class="smart-container">
    <el-tabs v-model="activeName" tab-position="left">
      <el-tab-pane label="NVR配置" name="nvr">
        <nvr-list :height="tableHeight"></nvr-list>
      </el-tab-pane>
      <el-tab-pane label="实时推送" name="push">
        <nvr-intime :height="tableHeight"></nvr-intime>
      </el-tab-pane>
      <el-tab-pane label="历史推送" name="history">
        <nvr-history :height="tableHeight"></nvr-history>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import NvrList from './list'
import NvrIntime from './intime'
import NvrHistory from './history'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      activeName: 'push',
      tableHeight: 0,
      videoDialogVisible: false,
      videoOptions: {
        autoplay: true,
        controls: true,
        liveui: true,
        sources: [{
          src: '',
          type: ''
        }]
      },
      stopVideo: false
    }
  },
  components: { NvrIntime, NvrHistory, NvrList },
  created () {
  },
  computed: {
    total () {
      return this.tableData.length || 0
    }
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 50
    }
  }
}
</script>

<style lang="scss" scoped>
.smart-container{
  margin: 12px auto;
  padding-right: 10px;
}
</style>
