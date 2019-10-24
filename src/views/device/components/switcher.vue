<template>
  <div class="ura-switcher list">
    <el-checkbox-group v-model="powers">
      <el-checkbox-button v-for="(item, index) in 3" :label="index+1" :key="index" @change="handleSelected">
        <i class="obicon obicon-power"></i>
      </el-checkbox-button>
    </el-checkbox-group>
    <!-- <div class="footer">
      <el-button type="primary" @click="handleSelected">确 认</el-button>
    </div> -->
  </div>
</template>

<script>
import * as panelHandler from '@/oblink/panelHandler'
import DeviceAPI from '@/api/device'
export default {
  props: {
    serialId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      powers: [],
      powerStatus: [0, 0, 0],
    }
  },
  watch: {
    powers (val) {
      this.changeStatus(val)
    }
  },
  methods: {
    changeStatus (power) {
      this.powerStatus.forEach((element, index) => {
        const isExist = power.find(item => item === index + 1)
        this.powerStatus[index] = +!!isExist
      })
    },
    handleSelected () {
      const status = panelHandler.getSwitchButtonStatus(this.powerStatus)
      console.log('status ', status)
      if (!this.serialId) return
      DeviceAPI.setSwitchStatus(this.serialId, status).then(res => {
        if (res.message.includes('success')) {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
        }
      })
    }
  },
  beforeDestroy () {
    this.powers = []
    this.powerStatus = [0, 0, 0]
  },
  destroyed () {

  },
}
</script>

<style lang="scss" scoped>
.list{
  text-align: center;
  padding: 80px 10px;
  border: 1px solid #eee;
  border-radius: 6px;
  // width: 68%;
  width: 500px;
  margin: 30px auto;
  box-shadow: 1px 1px 1px 1px #eee;
  background-color: #f2f2f2;
}

</style>
<style lang="scss">
.ura-switcher {
  .el-checkbox-button{
    // width: 30%;
    margin: 0 50px;
  }
  .el-checkbox-button__inner{
    border: 1px solid #DCDFE6;
    border-radius: 4px!important;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner{
    border-color: #409EFF;
  }
}
</style>
