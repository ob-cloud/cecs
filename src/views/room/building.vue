<template>
  <div class="smart building">
    <div class="search-bar">
      <div class="caption is-right">
        <el-button-group>
          <el-button type="primary" icon="btn-icon el-icon-refresh" title="刷新" @click="handleRefresh"></el-button>
          <el-button type="primary" icon="btn-icon el-icon-circle-plus-outline" title="添加" @click="handleCreate"></el-button>
          <el-button type="primary" icon="btn-icon obicon obicon-switch-btn" title="开关总闸" @click="handleMainSwitch"></el-button>
        </el-button-group>
      </div>
      <div class="caption">
        <el-input class="caption-item" @keyup.enter.native="handleSearch" placeholder="请输入楼栋"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </div>
    </div>
    <div class="building-list" v-loading.lock="loading">
      <div class="building-item" v-for="item in buildingList" :key="item">
        <div class="header">
          <i class="icon obicon obicon-power" title="电源" @click="handlePower(item)"></i>
          <i class="icon el-icon-edit" title="编辑" @click="handleEdit(item)"></i>
          <i class="icon el-icon-delete" title="删除" @click="handleRemove(item)"></i>
        </div>
        <div class="content">
          <i class="building-sign obicon obicon-building-o" :class="{'is-active': item === 2}"></i>
          <p class="text">{{item}}栋</p>
        </div>
      </div>
    </div>
    <el-dialog  v-if="createDialogVisible" top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="creation" autoComplete="on" :rules="creationRules" :model="createModel" label-position="left" label-width="80px">
        <el-form-item label="楼栋名称" prop="building">
          <el-input v-model="createModel.building" placeholder="请输入楼栋"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkCreate(dialogStatus)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: true,
      buildingList: [],
      createDialogVisible: false,
      dialogStatus: '',
      dialogTitleMap: {
        edit: '编辑楼栋',
        create: '创建楼栋'
      },
      createModel: {
        building: ''
      },
      creationRules: {
        building: [{ required: true, message: '楼栋不可为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getBuildingList()
  },
  watch: {
    createDialogVisible (val) {
      if (val === false) {
        this.$refs.creation.resetFields()
      }
    }
  },
  methods: {
    getBuildingList () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.buildingList = 25
      }, 3000)
    },
    handleRefresh () {
      this.createModel.building = ''
      this.getBuildingList()
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.createDialogVisible = true
    },
    checkCreate () {
      this.$refs.creation.validate(valid => {
        if (valid) {
          // TODO
          // type === 'create' ? this.createAction() : this.editAction()
          this.createDialogVisible = false
        }
      })
    },
    handleSearch () {
      this.getBuildingList()
    },
    handleMainSwitch () {
      this.$confirm('即将关闭所有楼栋开关', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doHandleSwitch()
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doHandleSwitch (id) {
      const loading = this.$loading({
        lock: true,
        text: '正在关闭开关...'
      })
      setTimeout(() => {
        loading.close()
      }, 1500)
    },
    handlePower (item) {
      this.$confirm('即将关闭该楼栋所有开关', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // TODO
      }).catch(() => {
        console.log('取消删除')
      })
    },
    handleEdit (item) {
      this.dialogStatus = 'edit'
      this.createDialogVisible = true
      this.createModel.building = item
    },
    handleRemove (item) {
      this.$confirm('确认删除楼栋？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // this.doDelete(row)
      }).catch(() => {
        console.log('取消删除')
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.smart{
  // padding: 10px;
}
.search-bar{
  padding: 10px;
  .caption::before,
  .caption::after{
    content: " ";
    visibility: hidden;
    width: 1px;
    height: 1px;
    clear: both;
  }
  .caption.is-right{
    float: right;
  }
  .caption .el-button-group .el-button{
    padding: 3px 8px;
  }

  .caption-item{
    width: 200px;
    margin-right: 20px;
  }
}
.building-item{
  position: relative;
  display: inline-block;
  padding: 20px;
  background: #fff;
  margin: 10px;
  width: 190px;
  height: 142px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 0px 3px 1px #c0c4cc;

  .header{
    position: absolute;
    right: 5px;
    top: 5px;

    .icon{
      font-size: 14px;
      padding: 5px;
      cursor: pointer;
      color: #999;
      transition: all .3s;

      &:hover{
        color: #000;
      }
      & + .icon{
        right: 5px;
      }
    }
  }
  .content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
  .building-sign{
    display: inline-block;
    color: #bdbdbd;
    font-size: 50px;
    padding: 5px;

    &.is-active{
      color: #d8d815;
    }
  }
  .text{
    font-size: 14px;
    display: inline-block;
    margin-left: 5px;
  }
}
.ob-form{
 width: 80%;
 margin: 0 auto;
 .el-select,
 .el-input{
   width: 300px;
 }
}
</style>
<style lang="scss">
// .caption .btn-icon{
//   font-size: 30px;
// }
</style>
