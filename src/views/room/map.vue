<template>
  <div class="map-wrapper">
    <div class="map-toolbar">
      <el-upload
        class="upload-btn"
        action="https://jsonplaceholder.typicode.com/posts/">
        <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，图片规格 1080x700 </div> -->
      </el-upload>
      <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
    </div>
    <div class="map-content">
      <div class="image-wrapper">

      </div>
    </div>
  </div>
</template>

<script>
export default {

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
    overflow: auto;

    .image-wrapper{
      width: 1080px;
      height: 900px;
      max-width: 1080px;
      max-height: 700px;
      border: 1px solid #999;
    }
  }
}
</style>
