<template>
  <div class="upload-container">
    <el-button icon='upload' :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">
      上传图片
    </el-button>
    <el-dialog v-model="dialogVisible">
      <el-upload
        class="editor-slide-upload"
        :action="action"
        :multiple="true"
        :data="data"
        :file-list="fileList"
        :show-file-list="true"
        list-type="picture-card"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { getQiNiuToken, getImageUrlByQiniuKey } from '@/api/common/qiniu'
import { QINIU_UPLOAD_URL } from '@/common/constants'

export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#20a0ff'
    }
  },
  data () {
    return {
      dialogVisible: false,
      // TODO get action url from server
      action: QINIU_UPLOAD_URL,
      data: {token: ''},
      listObj: {},
      fileList: []
    }
  },
  methods: {
    checkAllSuccess () {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit () {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传成功 或 出现了网络问题，请刷新页面重新上传！')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess (response, file) {
      const _this = this
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      // TODO get request url from server
      //        const qiniuServer = 'http://ox2m2b48s.bkt.clouddn.com/'
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          (function (i) {
            getImageUrlByQiniuKey(response.key).then(res => {
              _this.listObj[objKeyArr[i]].url = res.data.data.url
            })
            //              this.listObj[objKeyArr[i]].url = qiniuServer + response.key
          })(i)
          //            this.listObj[objKeyArr[i]].url = qiniuServer + response.key
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove (file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload (file) {
      const _this = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      _this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        getQiNiuToken().then(response => {
          _this.data.token = response.data.data.upToken
          const img = new Image()
          img.src = _URL.createObjectURL(file)
          img.onload = function () {
            _this.listObj[fileName] = { uid: file.uid, hasSuccess: false }
          }
          resolve(true)
        }).catch(() => {
          reject(false)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .upload-container {
    .editor-slide-upload {
      margin-bottom: 20px;
      .el-upload--picture-card {
        width: 100%;
      }
    }
  }
</style>
