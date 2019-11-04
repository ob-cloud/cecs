<template>
  <div class="map-wrapper ui-container" :style="{height: height + 'px'}">
    <div class="map-toolbar">
      <el-button size="small" type="primary" icon="el-icon-refresh" :disabled="isEditing" @click="handleRefresh()">刷新</el-button>
      <el-upload
        class="upload-btn"
        :disabled="isEditing"
        :data="uploadData"
        :show-file-list="false"
        accept=".png, .jpg, .jpeg"
        :before-upload="onBeforeUpload"
        :on-success="onUploadSuccess"
        :on-error="onUploadFail"
        action="/consumer/image/uploadSchoolMap">
        <el-button size="small" type="primary" icon="el-icon-upload">上传配置图<!--<i class="el-icon-question"></i>--></el-button>

        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，图片规格 1080x700 </div> -->
      </el-upload>
      <el-button size="small" type="primary" icon="el-icon-edit" :disabled="isEditing" @click="handleEdit()">编辑</el-button>
    </div>
    <div class="map-content">
      <div class="image-wrapper" @mouseenter="onMouseEnter" @mousedown="onMouseDown" @mouseleave="onMouseLeave" @mouseup="onMouseUp">
        <!-- http://placehold.it/1080x720 -->
        <img :src="graph" alt="">
        <el-tooltip placement="top" effect="light" v-for="(item, index) in points" :key="index">
          <div slot="content">
            <p style="padding: 5px; font-size: 16px; text-align: center;">{{`${item.buildingName || '-'}栋${item.floorName || '-'}层${item.roomName || '-'}`}}</p>
            <p style="padding: 5px; color: #333; text-align: center;">{{`开关-${isBuildingActive(item.deviceState) ? '开' : '关'}`}}</p>
          </div>
          <div class="point" :style="{left: item.x + 'px', top: item.y + 'px', background: isBuildingActive(item.deviceState) ? '#1fe650' : 'rgb(223, 45, 45)'}" @click="handlePoint(item, index)"></div>
        </el-tooltip>
        <div v-if="isAdd" class="point edit" :style="{left: editPoint.x + 'px', top: editPoint.y + 'px'}"></div>
        <div v-if="isAddFinished && !isSetLocation" class="cascader" :style="{left: (editPoint.x + this.radius) + 'px', top: (editPoint.y + this.radius) + 'px'}">
          <i class="el-icon el-icon-close" @click="handleCancelAdd" title="取消"></i>
          <el-cascader
            :options="buildingOptions"
            v-model="selectedOptions"
            :props="buildProps"
            @change="handleChange">
          </el-cascader>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div class="sidebar" v-if="dialogVisible" v-loading="sidebarLoading">
        <div class="header">
          <i class="el-icon el-icon-close" @click="dialogVisible = false" title="关闭"></i>
          <div class="title">{{currentDialogTitle}}</div>
        </div>
        <div class="content">
          <div class="item" v-for="(item, index) in curRoomDeviceList" :key="index">
            <div class="title">{{parseTitle(item)}}</div>
            <div class="detail">
              <template v-if="isKeyPanel(item.deviceChildType)">
                <iSwitcher :state="item.deviceStatus === '0' ? '00' : '15'" :serialId="item.deviceSerialId" :useDefaultStyle="false" styles="map power"></iSwitcher>
              </template>
              <template v-else-if="isHumidifier(item.deviceChildType)">
                <div class="sensors">
                  <p><i class="obicon obicon-temperature-o"></i><span>温度</span></p>
                  <span>23℃</span>
                </div>
                <div class="sensors">
                  <p><i class="obicon obicon-humidity"></i><span>湿度</span></p>
                  <span>33%</span>
                </div>
              </template>
              <template v-else-if="isTransponder(item.deviceType)">
                <AireCondition class="map" :serialId="item.deviceSerialId"></AireCondition>
              </template>
            </div>
          </div>
          <div class="item">
            <div class="title">操作</div>
            <div class="detail">
              <div class="action">
                <el-tooltip content="删除房间" placement="bottom" effect="light">
                  <el-button size="small" type="danger" icon="obicon obicon-trash" @click="handleRemovePoint"></el-button>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import graph from '../../assets/images/1080x720.png'
import iSwitcher from '@/views/device/components/switcher'
import AireCondition from '@/views/device/components/ac'
import RoomAPI from '@/api/room'
import MapAPI from '@/api/map'
import Helper from '@/common/helper'
const {default: TypeHint} = require('@/oblink/suit')
const {default: Suit} = require('@/common/suit')
import {
  mapGetters
} from 'vuex'
export default {
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      graph: graph,
      uploadData: {
        access_token: ''
      },
      radius: 20,
      points: [],
      editPoint: {
        x: -1000,
        y: -1000
      },
      buildingOptions: [],
      buildProps: {
        value: 'id',
        label: 'name'
      },
      selectedOptions: [],
      isAdd: false,
      isAddFinished: false,
      isSetLocation: false,
      isEditing: false,
      dialogVisible: false,
      currentDialogTitle: '',
      activePoint: {},
      activePointIndex: '',
      curRoomDeviceList: [],
      sidebarLoading: false
    }
  },
  components: { iSwitcher, AireCondition },
  computed: {
    ...mapGetters([
      'token'
    ]),
  },
  mounted () {
    this.getRoomCascader()
    this.getMapPoints()
    this.uploadData.access_token = this.token
  },
  methods: {
    getRoomCascader () {
      RoomAPI.getRoomCascader().then(res => {
        this.buildingOptions = Helper.formatBuildingTree(res.data.records)
      })
    },
    getMapPoints () {
      const loader = this.$loading()
      MapAPI.getPointList().then(res => {
        if (res.status === 0) {
          this.points = res.data.records
        }
        loader.close()
      }).catch(() => loader.close())
    },
    isBuildingActive (status) {
      return status && status.slice(0, 2) !== '00'
    },
    getRoomDeviceListByRoomId (id) {
      this.curRoomDeviceList = []
      this.sidebarLoading = true
      RoomAPI.getRoomDeviceListV2({roomId: id}).then(res => {
        if (res.status === 0) {
          this.curRoomDeviceList = Array.from(res.data.records).filter(item => {
            return this.isKeyPanel(item.deviceChildType) || this.isHumidifier(item.deviceChildType) || this.isTransponder(item.deviceType)
          })
        }
        this.sidebarLoading = false
      }).catch(() => { this.sidebarLoading = false })
    },
    handleEdit () {
      this.isAdd = true
      this.isAddFinished = false
      this.isEditing = true
      // if (!this.isAddFinished) {
      //   this.isAdd = true
      //   this.isAddFinished = false
      // } else {
      //   return this.$message({
      //     type: 'info',
      //     message: '正在编辑中...'
      //   })
      // }
    },
    handleRefresh () {
      this.getMapPoints()
    },
    handleChange (value) {
      if (!value || !value.length) return
      const loader = this.$loading({
        text: '位置设置中...'
      })
      const point = this.points.pop()
      MapAPI.createPoint(value[2], point.x, point.y).then(res => {
        if (res.status === 0) {
          loader.close()
          this.isSetLocation = true
          this.$message({
            type: 'success',
            message: '设置成功'
          })
          this.getMapPoints()
        }
        this.isEditing = false
      })
      this.selectedOptions = []
    },
    handlePoint (point, index) {
      if (!this.isAdd) {
        this.activePoint = point
        this.activePointIndex = index
        this.dialogVisible = true
        this.currentDialogTitle = `${point.buildingName || '-'}栋${point.floorName || '-'}层${point.roomName || '-'}`
        this.getRoomDeviceListByRoomId(point.roomId)
      }
    },
    handleRemovePoint () {
      if (!this.activePointIndex) return
      this.$confirm('确认删除？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        const loader = this.$loading({
          text: '位置删除中...'
        })
        let point = this.points.splice(this.activePointIndex, 1)
        point = (point && point.length) && point[0]
        if (!point) return
        MapAPI.removePoint(point.id).then(res => {
          if (res.status === 0) {
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.points.push(point)
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
          loader.close()
        }).catch(() => {
          loader.close()
          this.points.push(point)
          this.$message({
            type: 'error',
            message: '服务异常'
          })
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },
    handleCancelAdd () {
      this.isAdd = false
      this.isSetLocation = false
      this.isAddFinished = false
      this.points.pop()
      this.editPoint = {
        x: -1000,
        y: -1000
      }
      this.isEditing = false
    },
    onMouseEnter (e) {
      if (!this.isAdd) return
      const that = this
      document.querySelector('.image-wrapper').onmousemove = function (event) {
        if (!that.isAdd) return
        const offsetLeft = this.offsetLeft
        const offsetTop = this.offsetTop
        const x = event.clientX - offsetLeft - 20
        const y = event.clientY - offsetTop - 102
        if (event.offsetX < 0 || event.offsetY < 0 || x > (1080 - that.radius) || y > (720 - that.radius)) return false
        that.editPoint.x = x
        that.editPoint.y = y
      }
    },
    onMouseDown (event) {
      if (!this.isAdd) return
      this.points.push({...this.editPoint})
      // this.editPoint = {
      //   x: -1111,
      //   y: -1111
      // }
      // this.isAdd = false
      this.isAddFinished = false
    },
    onMouseLeave () {
      if (this.isAddFinished) return
      document.querySelector('.image-wrapper').onmousemove = null
    },
    onMouseUp (e) {
      if (this.isAddFinished) return
      // 房间交集
      const hasCross = this.points.slice(0, -1).find(point => {
        return this.isCross(point, this.editPoint)
      })
      if (hasCross) {
        this.$message({
          type: 'info',
          message: '房间重复了'
        })
        this.points.pop()
        return
      }
      document.querySelector('.image-wrapper').onmousemove = null
      this.isAdd = false
      this.isAddFinished = true
      this.isSetLocation = false
    },
    isCross (point1, point2) {
      const w = this.radius
      return point1.x + w > point2.x && point1.x < point2.x + w && point1.y + w > point2.y && point1.y < point2.y + w
    },
    isKeyPanel (deviceSubType) {
      return Suit.typeHints.isThreeKeySocketSwitch(deviceSubType)
    },
    isHumidifier (deviceSubType) {
      return Suit.typeHints.isHumidifierSensors(deviceSubType)
    },
    isTransponder (deviceType) {
      return TypeHint.isTransponder(deviceType)
    },
    parseTitle (item) {
      if (this.isKeyPanel(item.deviceChildType)) return '开关'
      if (this.isHumidifier(item.deviceChildType)) return '温湿度'
      if (this.isTransponder(item.deviceType)) return '红外转发'
    },
    onBeforeUpload (file) {
      this.loader = this.$loading({
        text: '图片上传中...'
      })
    },
    onUploadSuccess (response, file, fileList) {
      this.graph = response.data.picurl
      this.loader && this.loader.close()
    },
    onUploadFail (response, file, fileList) {
      this.loader && this.loader.close()
      this.$message({
        type: 'error',
        message: '图片上传失败，请重新上传'
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.map-wrapper{
  // padding-left: 64px;
  overflow-y: auto;
  .map-toolbar{
    text-align: right;
    padding: 10px;

    .upload-btn{
      display: inline-block;
    }
    .el-button{
      margin-left: 10px;
    }
  }
  .map-content{
    text-align: center;
    margin-top: 10px;
    overflow: auto;

    .image-wrapper{
      position: relative;
      display: inline-block;
      user-select: none;
      overflow: hidden;
      width: 1080px;
      height: 720px;
      max-height: 720px;
      max-width: 1080px;
      > img{
        max-width: 100%;
        max-height: 100%;
      }
    }
    .point{
      display: inline-block;
      position: absolute;
      background-color: rgb(223, 45, 45);
      border: 1px solid #333;
      border-radius: 100%;
      // width: 30px;
      // height: 30px;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
    .cascader {
      position: absolute;
      padding: 10px;
      background: #fff;
      border-radius: 0 20px 20px 20px;
      box-shadow: 0 0 2px 0px #999;
      i{
        position: absolute;
        right: -2px;
        top: -2px;
        background-color: #000;
        color: #fff;
        border-radius: 50%;
        padding: 0px;
        cursor: pointer;
      }
    }
  }
}
.panel{
  padding: 10px;
  .left,.right{
    display: inline-block;
    width: 50%;
    text-align: center;
    padding: 50px;
    vertical-align: middle;
    border-left: 1px solid #eee;
  }
  .left{
    border-left: none
  }
  .item{
    display: inline-block;
    width: 50%;
    p{
      padding: 20px;
      color: #666;
      span{
        font-size: 12px;
      }
      i{
        font-size: 32px;
        color: rgba(5, 100, 184, 0.9);
      }
    }
  }
}
.sidebar{
  display: inline-block;
  position: fixed;
  right: 0;
  top: 50px;
  bottom: 4px;
  background: #fff;
  width: 380px;
  box-shadow: 0 0 2px 1px #ddd;
  overflow: auto;

  .header{
    padding: 12px 10px;
    border-bottom: 1px solid #eee;
    .title{
      padding-left: 20px;
      padding-right: 20px;
      float: right;
      color: #999;
    }
    i{
      cursor: pointer;
    }
  }
  .content{
    .item{
      border-bottom: 1px solid #eee;
      box-shadow: 0 1px 1px 0p #f2f2f2;
      padding-bottom: 10px;
    }
    .title{
      margin-top: 10px;
      padding: 10px 12px;
      background-color: #eee;
      color: #666;
      font-size: 14px;
    }
    .detail{
      padding: 10px;
      .sensors{
        display: inline-block;
        width: 50%;
        text-align: center;
      }
    }
    .sensors p{
      padding: 20px;
      color: #666;
      span{
        font-size: 12px;
      }
      i{
        font-size: 30px;
        color: rgba(5, 100, 184, 0.9);
      }
    }
    .power{
      padding: 10px;
      text-align: center;
    }
    .action{
      padding: 10px;
    }
  }
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(380px);
  opacity: 0;
}
</style>
<style lang="scss">
.map.power{
  .el-checkbox-button__inner{
    border-radius: 4px;
    border-color: #DCDFE6;
    padding: 0;
    > i{
      font-size: 45px;
    }
  }
  .el-checkbox-button.is-checked:first-child .el-checkbox-button__inner {
    border-left-color: #DCDFE6;
  }
}
.map.transponder-wrapper{
  .list.transponder{
    display: block;
    width: 100%;
    height: 120px;
    max-height: 120px;
    border-color: transparent;
    overflow: auto;
    .tips{
      line-height: 60px;
    }
    .item{
      float: left;
      width: 100px;
    }
  }
  .controller{
    display: block;
    width: 100%;
    margin-top: 10px;
    .panel{
      padding-bottom: 20px;
    }
  }
}
</style>
