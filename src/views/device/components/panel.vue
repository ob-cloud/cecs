<template>
  <div>
    <el-container style="height: 500px; border: 1px solid #282A39">
      <el-aside width="200px" style="background-color: #282A39">
        <iot-panel></iot-panel>
      </el-aside>
      <el-main class="main-content">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>灯组</span>
          </div>
          <div class="card-content">
            <div class="card-item" v-for="(item, index) in 10" :key="index">
              <p><i class="el-icon-s-opportunity"></i></p>
              <p>item</p>
            </div>
          </div>
          <div class="card-footer">
            <el-row :gutter="40">
              <el-col :span="10">
                <span class="demonstration">亮度</span>
                <el-slider v-model="bright" :marks="{0: '0', 100: '100'}"></el-slider>
              </el-col>
              <el-col :span="10">
                <span class="demonstration">色度</span>
                <el-slider v-model="color" :min="0" :max="254" :marks="{0: '0', 254: '254'}"></el-slider>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>场景</span>
          </div>
          <div class="card-content">
            <div class="card-item" v-for="(item, index) in scenes" :key="index">
              <span class="label">{{item}}</span>
            </div>
          </div>
        </el-card>
        <div class="toolbox">
          <el-button>取消</el-button>
          <el-button type="primary">确认</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import IotPanel from '@/components/IotPanel'
export default {
  components: {
    IotPanel
  },
  data () {
    return {
      bright: 0,
      color: 0,
      scenes: ['全关', '投影', '自习', '上课', '课间', '考试']
    }
  },
}
</script>

<style lang="scss" scoped>
.main-content{
  margin-bottom: 106px;
}
.box-card + .box-card{
  margin-top: 20px;
}
.box-card .card-content .card-item{
  display: inline-block;
  width: 120px;
  height: 80px;
  margin: 10px;
  border: 1px solid #A2AAB5;
  border-radius: 6px;
  text-align: center;
  transition: all .3s;
  cursor: pointer;
  & p{
    padding: 10px 5px 5px;
  }
  & i{
    font-size: 20px;
  }
  &.active,
  &:hover{
    border-color: #0185ED;
  }
  .label{
    line-height: 80px;
  }
}
.card-footer{
  border-top: 1px solid #3A4257;;
  padding: 16px;
  margin: 10px;
}
.toolbox{
  position: absolute;
  left: 212px;
  right: 0;
  bottom: 0;
  text-align: right;
  padding: 6px;
  padding-right: 30px;
  background: #2C3449;
}
</style>
