<template>
  <div>
    <el-container style="border: 1px solid #282A39">
      <el-aside width="200px" style="background-color: #282A39">
        <iot-panel @on-panel-key-selected="onPanelKeySelected"></iot-panel>
      </el-aside>
      <el-main class="main-content">
        <el-row>
          <el-col :span="10">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>灯组</span>
              </div>
              <div class="card-content" style="height: 290px; overflow-y:auto;" v-loading="lampGroupLoading">
                <el-checkbox-group v-model="checkboxGroup">
                    <el-checkbox-button class="card-item" v-for="(item, index) in lampGroupList" :label="item.groupNum" :key="index" @click.native="onClickLampItem(item)">
                      <p><i class="el-icon-s-opportunity"></i></p>
                      <p>{{item.name}}</p>
                    </el-checkbox-button>
                  </el-checkbox-group>
              </div>
            </el-card>
          </el-col>
          <el-col :span="14">
            <el-card shadow="never" class="slider-wrapper">
              <div slot="header" class="clearfix">
                <span>设置</span>
              </div>
              <div class="card-footer"  style="height: 290px; overflow-y:auto;"  v-loading="lampGroupLoading">
                <div class="wrapper" v-for="(item, index) in checkboxGroupList" :key="index">
                  <el-row :gutter="40">
                    <el-col :span="12">
                      <span class="text">亮度</span>
                      <el-slider class="slider" v-model="item.light" :marks="{0: '0', 100: '100'}"></el-slider>
                    </el-col>
                    <el-col :span="12">
                      <span class="text">色度</span>
                      <el-slider class="slider" v-model="item.temp" :min="0" :max="100" :marks="{0: '0', 100: '100'}"></el-slider>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <div class="toolbox">
          <!-- <el-button>取消</el-button> -->
          <el-button type="primary" @click="setPanel">确认</el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import IotPanel from '@/components/IotPanel'
import DeviceAPI from '@/api/device'
export default {
  props: {
    serialId: {
      type: String,
      default: ''
    }
  },
  components: {
    IotPanel
  },
  data () {
    return {
      bright: 0,
      color: 0,
      lampGroupLoading: false,
      lampGroupList: [],
      checkboxGroup: [],
      selectedLampGroupItem: '',

      selectedPanelKeyIndex: '',
      keyList: [],
      checkboxGroupList: []
    }
  },
  watch: {
    checkboxGroup (group) {
      if (!group.length) {
        this.checkboxGroupList = []
        return
      }
      if (group.length && !this.checkboxGroupList.length) {
        this.checkboxGroupList = group.map(item => {
          const target = this.lampGroupList.find(it => it.groupNum === item)
          return {
            groupNum: item,
            ...target
          }
        })
        return
      }
      let groupList = []
      if (group.length <= this.checkboxGroupList.length) {
        groupList = group.map(item => this.checkboxGroupList.find(it => it.groupNum === item))
      } else {
        groupList = group.map(item => {
          const t = this.checkboxGroupList.find(it => it.groupNum === item)
          return t || {groupNum: item}
        })
      }

      this.checkboxGroupList = groupList.map(item => {
        const target = this.lampGroupList.find(it => it.groupNum === item.groupNum)
        return {
          ...item,
          ...target
        }
      })
    }
  },
  mounted () {

  },
  methods: {
    onClickLampItem (item) {
      this.selectedLampGroupItem = item
    },
    onPanelKeySelected (item) {
      this.selectedPanelKeyIndex = item
      this.checkboxGroupList = []
      this.checkboxGroup = []
      this.getPanelGroupList().then(() => {
        this.getGrouplListPanelKey(item)
      })
    },
    getPanelGroupList () {
      this.lampGroupLoading = true
      return DeviceAPI.getGroupListByPanelId(this.serialId).then(res => {
        if (res.message.includes('success')) {
          this.lampGroupList = res.data.list
        }
        this.lampGroupLoading = false
      })
    },
    getGrouplListPanelKey (index) {
      DeviceAPI.getGrouplListPanelKey(this.serialId, index).then(res => {
        if (res.message.includes('success')) {
          const result = res.data.list
          this.keyList = result
          this.lampGroupList = this.extendsGroupList(result, this.lampGroupList)
          this.checkboxGroup = result.map(item => item.groupNum)
          // this.checkboxGroup = result
          // this.checkboxGroup = this.extendsGroupList(this.lampGroupList, this.checkboxGroup)
        }
      })
    },
    extendsGroupList (sourceList, targetList) {
      const a = targetList.map(element => {
        const it = sourceList.find(item => item.groupNum === element.groupNum)
        return {...element, ...it}
      })
      return a
    },
    setPanel () {
      const params = {
        serialId: this.serialId,
        index: this.selectedPanelKeyIndex
      }
      const groupStatus = this.checkboxGroupList.map(item => {
        return {
          groupNum: item.groupNum,
          light: item.light,
          temp: item.temp
        }
      })
      params.groupStatus = {list: groupStatus}
      DeviceAPI.setPanelKey(params).then(res => {
        if (res.message.includes('success')) {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
        }
        this.$emit('on-setting-finished')
      })
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
  // border: 1px solid #A2AAB5;
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
    // border-color: #0185ED;
  }
  .label{
    line-height: 80px;
  }
  > span{
    width: 100%;
    height: 100%;
    background: transparent;
    border: none;
  }
}
.card-footer{
  // border-top: 1px solid #3A4257;;
  // padding: 16px;
  // margin: 10px;
  padding-bottom: 15px;

  .wrapper {
    padding: 12px 30px 20px;
    border: 1px solid #000;
    margin-top: 10px;
    border-radius: 4px;
  }

  .text{
    float: left;
    line-height: 38px;
  }
  .slider{
    padding-left: 50px;
  }
}
.group-wrapper{
  padding: 12px;

  .form-item{
    margin-bottom: 0;
  }
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
  border-top: 1px solid rgb(40, 42, 57);
}
</style>
<style lang="scss">
 .card-content .card-item span{
    width: 100%;
    height: 100%;
    background: transparent;
    // border-color: transparent;
    border: 1px solid #000;
  }
  .card-content .card-item span,
  .el-checkbox-button:last-child .el-checkbox-button__inner,
  .el-checkbox-button:first-child .el-checkbox-button__inner{
     border-radius: 6px;
  }
  .el-checkbox-button.is-checked .el-checkbox-button__inner,
  .card-item.el-checkbox-button.is-checked:first-child .el-checkbox-button__inner{
    box-shadow: none;
  }
  .el-checkbox-button:first-child .el-checkbox-button__inner{
    border-left-color: #000;
  }

  .slider-wrapper .el-card__body{
    // padding: 0;
  }
</style>
