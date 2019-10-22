<template>
  <div class="ura-switcher list">
    <el-checkbox-group v-model="powers">
      <el-checkbox-button v-for="(item, index) in 3" :label="index+1" :key="index">
        <i class="obicon obicon-power"></i>
      </el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
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
  width: 68%;
  margin: 30px auto;
  box-shadow: 1px 1px 1px 1px #eee;
  background-color: #f2f2f2;
}

</style>
<style lang="scss">
.ura-switcher {
  .el-checkbox-button{
    width: 30%;
  }
  .el-checkbox-button__inner{
    border: 1px solid #DCDFE6;
    border-radius: 4px;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner{
    border-color: #409EFF;
  }
}
</style>
