<template>
  <div class="map-wrapper">
    <div class="map-toolbar">
      <el-upload
        class="upload-btn"
        action="https://jsonplaceholder.typicode.com/posts/">
        <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，图片规格 1080x700 </div> -->
      </el-upload>
      <el-button size="small" type="primary" icon="el-icon-edit" @click="isEdit = true">编辑</el-button>
    </div>
    <div class="map-content">
      <div class="image-wrapper" @mouseenter="onMouseEnter" @mousedown="onMouseDown" @mouseleave="onMouseLeave" @mouseup="onMouseUp">
        <img src="http://placehold.it/1080x700" alt="">
        <el-tooltip :content="`${item.buildingName}栋${item.floorName}层${item.roomName}房`" placement="top" effect="light" v-for="(item, index) in points" :key="index">
          <div class="point" :style="{left: item.x + 'px', top: item.y + 'px'}"></div>
        </el-tooltip>
        <div class="point edit" :style="{left: editPoint.x + 'px', top: editPoint.y + 'px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      points: [{
        id: 1,
        x: 130,
        y: 200,
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
      isEdit: false
    }
  },
  methods: {
    onMouseMove (e) {
      const offsetLeft = document.querySelector('.image-wrapper').offsetLeft
      const offsetTop = document.querySelector('.image-wrapper').offsetTop
      const x = e.clientX - offsetLeft - 30
      const y = e.clientY - offsetTop - 62
      // if (e.offsetX < 0 || e.offsetY < 0 || e.offsetX > 1050 || e.offsetY > 670) return false
      // console.log('mouse move ', e.clientX - offsetLeft, e.clientY - offsetTop, e.offsetX, e.offsetY)
      // this.editPoint.x = e.offsetX + 30 >= 1080 ? 1080 - 30 : e.offsetX
      // this.editPoint.y = e.offsetY + 30 >= 700 ? 700 - 30 : e.offsetY
      if (e.offsetX < 0 || e.offsetY < 0 || x > (1080 - 30) || y > (700 - 30)) return false
      this.editPoint.x = e.clientX - offsetLeft - 30
      this.editPoint.y = e.clientY - offsetTop - 62
    },
    onMouseEnter (e) {
      if (!this.isEdit) return
      const that = this
      document.querySelector('.image-wrapper').onmousemove = function (event) {
        if (!that.isEdit) return
        const offsetLeft = this.offsetLeft
        const offsetTop = this.offsetTop
        const x = event.clientX - offsetLeft - 30
        const y = event.clientY - offsetTop - 62
        if (event.offsetX < 0 || event.offsetY < 0 || x > (1080 - 30) || y > (700 - 30)) return false
        that.editPoint.x = x
        that.editPoint.y = y
      }
    },
    onMouseDown (event) {
      if (!this.isEdit) return
      this.points.push({...this.editPoint})
      this.editPoint = {
        x: -1111,
        y: -1111
      }
      this.isEdit = false
    },
    onMouseLeave () {
      if (!this.isEdit) return
      document.querySelector('.image-wrapper').onmousemove = null
      this.isEdit = false
    },
    onMouseUp (e) {
      if (!this.isEdit) return
      document.querySelector('.image-wrapper').onmousemove = null
      this.isEdit = false
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
    overflow: hidden;

    .image-wrapper{
      position: relative;
      display: inline-block;
      user-select: none;
      overflow: hidden;
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
  }
}
</style>
