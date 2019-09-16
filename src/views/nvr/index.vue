<template>
  <div class="device smart">
    <el-tabs v-model="activeName">
      <el-tab-pane label="推送" name="push">
        <nvr-intime :height="tableHeight"></nvr-intime>
      </el-tab-pane>
      <el-tab-pane label="历史推送" name="history">
        <nvr-history :height="tableHeight"></nvr-history>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
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
  components: { NvrIntime, NvrHistory },
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
      this.tableHeight = 500 // Helper.calculateTableHeight() - 50
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  width: 94%;
  margin: 12px auto;
}
</style>
