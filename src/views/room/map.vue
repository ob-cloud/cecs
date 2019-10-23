<template>
  <div class="map-wrapper">
    <div class="map-toolbar">
      <el-upload
        class="upload-btn"
        action="https://jsonplaceholder.typicode.com/posts/">
        <el-button size="small" type="primary" icon="el-icon-upload">上传底图</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，图片规格 1080x700 </div> -->
      </el-upload>
      <el-button size="small" type="primary" icon="el-icon-edit" @click="isAdd = true; isAddFinished = false">编辑</el-button>
      <!-- <el-button size="small" type="primary" icon="el-icon-plus" @click="isAdd = true; isAddFinished = false">添加</el-button> -->
      <!-- <el-button size="small" type="primary" icon="el-icon-edit" @click="isEdit = true">编辑</el-button> -->
    </div>
    <div class="map-content">
      <div class="image-wrapper" @mouseenter="onMouseEnter" @mousedown="onMouseDown" @mouseleave="onMouseLeave" @mouseup="onMouseUp">
        <img src="http://placehold.it/1080x720" alt="">
        <el-tooltip placement="top" effect="light" v-for="(item, index) in points" :key="index">
          <div slot="content">
            <p style="padding: 5px; font-size: 16px; text-align: center;">{{`${item.buildingName || '-'}栋${item.floorName || '-'}层${item.roomName || '-'}`}}</p>
            <p style="padding: 5px; color: #333; text-align: center;">{{`开关-${item.status ? '开' : '关'}`}}</p>
          </div>
          <div class="point" :style="{left: item.x + 'px', top: item.y + 'px', background: item.status ? '#1fe650' : 'rgb(223, 45, 45)'}" @click="handlePoint(item, index)"></div>
        </el-tooltip>
        <div v-if="isAdd" class="point edit" :style="{left: editPoint.x + 'px', top: editPoint.y + 'px'}"></div>
        <div v-if="isAddFinished && !isSetLocation" class="cascader" :style="{left: (editPoint.x + this.radius) + 'px', top: (editPoint.y + this.radius) + 'px'}">
          <i class="el-icon el-icon-close" @click="handleCancelAdd"></i>
          <el-cascader
            :options="buildingOptions"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </div>
      </div>
    </div>
    <!-- <el-dialog top="10%" width="760px" :title="currentDialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div class="panel">
        <div class="left">
          1
        </div>
        <div class="right">
          <div class="item">
            <p><i class="obicon obicon-temperature-o"></i><span>温度</span></p>
            <span>23℃</span>
          </div>
          <div class="item">
            <p><i class="obicon obicon-humidity"></i><span>湿度</span></p>
            <span>33%</span>
          </div>
        </div>
      </div>
    </el-dialog> -->
    <transition name="slide-fade">
      <div class="sidebar" v-if="dialogVisible">
        <div class="header">
          <i class="el-icon el-icon-close" @click="dialogVisible = false" title="关闭"></i>
          <div class="title">{{currentDialogTitle}}</div>
        </div>
        <div class="content">
          <div class="item">
            <div class="title">开关</div>
            <div class="detail">
              <div class="power">
                <el-button size="small" type="success" icon="obicon obicon-power"></el-button>
                <el-button size="small" type="danger" icon="obicon obicon-power"></el-button>
                <el-button size="small" type="success" icon="obicon obicon-power"></el-button>
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
export default {
  data () {
    return {
      radius: 30,
      points: [{
        id: 1,
        x: 130,
        y: 200,
        status: 0,
        buildingId: '',
        floorId: '',
        roomId: '',
        buildingName: '1',
        floorName: '2',
        roomName: '3'
      }, {
        id: 2,
        x: 230,
        y: 300,
        status: 1,
        buildingId: '',
        floorId: '',
        roomId: '',
        buildingName: '1',
        floorName: '2',
        roomName: '3'
      }, {
        id: 3,
        x: 630,
        y: 400,
        status: 1,
        buildingId: '',
        floorId: '',
        roomId: '',
        buildingName: '1',
        floorName: '2',
        roomName: '3'
      }],
      editPoint: {
        x: -1000,
        y: -1000
      },
      buildingOptions: [{
        value: '1',
        label: '1栋',
        children: [{
          value: '2',
          label: '2层',
          children: [{
            value: '101',
            label: '101房'
          }, {
            value: '102',
            label: '102房'
          }, {
            value: '103',
            label: '103房'
          }, {
            value: '104',
            label: '104房'
          }]
        }, {
          value: '2',
          label: '2栋',
          children: [{
            value: '2',
            label: '2层'
          }, {
            value: '3',
            label: '3层'
          }]
        }]
      }],
      selectedOptions: [],
      isAdd: false,
      isAddFinished: false,
      isSetLocation: false,
      isEdit: false,
      dialogVisible: false,
      currentDialogTitle: '',
      activePoint: {},
      activePointIndex: ''
    }
  },
  methods: {
    handleChange(value) {
      if (!value || !value.length) return
      const loader = this.$loading({
        text: '位置设置中...'
      })
      setTimeout(() => {
        loader.close()
        this.isSetLocation = true
        const point = this.points.pop()
        point.buildingName = value[0]
        point.floorName = value[1]
        point.roomName = value[2]
        this.points.push(point)
        this.$message({
          type: 'success',
          message: '设置成功'
        })
      }, 2000)
      this.selectedOptions = []
    },
    handlePoint (point, index) {
      if (!this.isAdd) {
        console.log(point)
        this.activePoint = point
        this.activePointIndex = index
        this.dialogVisible = true
        this.currentDialogTitle = `${point.buildingName || '-'}栋${point.floorName || '-'}层${point.roomName || '-'}`
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
        setTimeout(() => {
          this.points.splice(this.activePointIndex, 1)
          loader.close()
          this.dialogVisible = false
        }, 2000)
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
    },
    onMouseEnter (e) {
      if (!this.isAdd) return
      const that = this
      document.querySelector('.image-wrapper').onmousemove = function (event) {
        if (!that.isAdd) return
        const offsetLeft = this.offsetLeft
        const offsetTop = this.offsetTop
        const x = event.clientX - offsetLeft - 30
        const y = event.clientY - offsetTop - 62
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
    }
  },
}
</script>

<style lang="scss" scoped>
.map-wrapper{
  padding-left: 64px;
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
      min-width: 1080px;
      min-height: 720px;
    }
    .point{
      display: inline-block;
      position: absolute;
      background-color: rgb(223, 45, 45);
      border: 1px solid #333;
      border-radius: 100%;
      width: 30px;
      height: 30px;
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
  width: 300px;
  box-shadow: 0 0 2px 1px #ddd;

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
  transform: translateX(300px);
  opacity: 0;
}
</style>
