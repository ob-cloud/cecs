<template>
  <div class="building ui-container" :style="{height: `${height}px`}">
    <div class="search-bar">
      <div class="caption is-right">
        <el-button-group>
          <el-button type="primary" icon="btn-icon el-icon-refresh" title="刷新" @click="handleRefresh"></el-button>
          <el-button type="primary" icon="btn-icon el-icon-circle-plus-outline" title="添加" @click="handleCreate"></el-button>
          <el-button type="primary" icon="btn-icon obicon obicon-switch-btn" title="开关总闸" @click="handleMainSwitch"></el-button>
        </el-button-group>
      </div>
      <div class="caption">
        <el-input class="caption-item" @keyup.enter.native="handleSearch" v-model="searchModel.buildName" placeholder="请输入楼栋"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </div>
    </div>
    <div class="building-list" v-loading.lock="loading"  :style="{height: (height - 80) + 'px'}">
      <div class="building-item" v-for="item in buildingList" :key="item.id">
        <div class="header">
          <i class="icon obicon obicon-power" title="电源" @click="handlePower(item)"></i>
          <i class="icon el-icon-edit" title="编辑" @click="handleEdit(item)"></i>
          <i class="icon el-icon-delete" title="删除" @click="handleRemove(item)"></i>
        </div>
        <div class="content">
          <i class="building-sign obicon obicon-building-o" :class="{'is-active': item.allType}"></i>
          <p class="text">{{item.buildName}} 栋</p>
        </div>
      </div>
      <el-pagination
        class="pagination"
        prev-text="上一屏"
        next-text="下一屏"
        :page-size="searchModel.pageSize"
        :total="buildingTotal"
        layout="prev, next"
        @current-change="onCurrentChange"
        @size-change="onSizeChange">
      </el-pagination>
    </div>
    <el-dialog  v-if="createDialogVisible" top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="creation" autoComplete="on" :rules="creationRules" :model="createModel" label-position="left" label-width="80px">
        <el-form-item label="楼栋名称" prop="buildName">
          <el-input v-model="createModel.buildName" placeholder="请输入楼栋">
            <template slot="append">栋</template>
          </el-input>
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
import RoomAPI from '@/api/room'
// import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  props: {
    preload: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      loading: false,
      containerHeight: 500,
      buildingList: [],
      createDialogVisible: false,
      dialogStatus: '',
      dialogTitleMap: {
        edit: '编辑楼栋',
        create: '创建楼栋'
      },
      searchModel: {
        buildName: '',
        pageNo: 1,
        pageSize: 10
      },
      buildingTotal: 0,
      createModel: {
        buildName: ''
      },
      creationRules: {
        buildName: [{ required: true, message: '楼栋不可为空', trigger: 'blur' }]
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
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.containerHeight = Helper.calculateTableHeight() - 20
    },
    getBuildingList () {
      this.loading = true
      RoomAPI.getBuildingList(this.searchModel).then(res => {
        if (res.status === 0) {
          const {data} = res
          this.buildingList = data.records
          this.buildingTotal = res.total
        }
        this.loading = false
      })
    },
    handleRefresh () {
      this.createModel.buildName = ''
      this.getBuildingList()
    },
    onCurrentChange (pageNo) {
      this.searchModel.pageNo = pageNo
      this.getBuildingList()
    },
    onSizeChange (pageSize) {
      this.searchModel.pageSize = pageSize
      this.getBuildingList()
    },
    resetModel () {
      this.createModel.buildName = ''
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.createDialogVisible = true
      this.resetModel()
    },
    checkCreate (type) {
      this.$refs.creation.validate(valid => {
        if (valid) {
          type === 'create' ? this.doCreateAction() : this.doEditAction()
          this.createDialogVisible = false
        }
      })
    },
    doCreateAction () {
      RoomAPI.addBuilding(this.createModel).then(response => {
        if (response.status === 0) {
          this.getBuildingList()
        } else {
          this.$message({
            type: 'error',
            message: '添加失败!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '新增失败'
        })
      })
    },
    doEditAction () {
      RoomAPI.updateBuilding(this.createModel).then(response => {
        if (response.status === 0) {
          this.getBuildingList()
        } else {
          this.$message({
            type: 'error',
            message: '编辑失败!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '编辑异常'
        })
      })
    },
    handleSearch () {
      this.getBuildingList()
    },
    async handleMainSwitch () {
      const that = this
      const res = await RoomAPI.getSwitchGlobalType()
      if (res.status !== 0) return
      const action = res.data ? '关闭' : '打开'
      this.$confirm(`即将${action}所有楼栋开关`, '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        callback (actionText, instance) {
          actionText === 'confirm' && that.doHandleSwitch(+!res.data)
        }
      })
    },
    doHandleSwitch (status) {
      const action = status ? '打开' : '关闭'
      const loading = this.$loading({
        lock: true,
        text: `正在${action}开关...`
      })
      RoomAPI.triggerGlobalSwitch(status ? 1 : 2).then(res => {
        if (res.status === 0) {
          this.getBuildingList()
          loading.close()
        } else {
          this.$message({
            type: 'error',
            message: '开关操作失败!'
          })
        }
      })
    },
    handlePower (item) {
      const action = item.allType ? '关闭' : '打开'
      this.$confirm(`即将${action}该楼栋所有开关`, '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        RoomAPI.triggerSwitch({buildingId: item.id, deviceType: item.allType ? 0 : 1}).then(res => {
          if (res.status === 0) {
            this.getBuildingList()
          } else {
            this.$message({
              type: 'error',
              message: '开关操作失败!'
            })
          }
        })
      }).catch(() => {
        console.log('取消删除')
      })
    },
    handleEdit (item) {
      this.dialogStatus = 'edit'
      this.createDialogVisible = true
      this.createModel = item
    },
    handleRemove (item) {
      this.$confirm('确认删除楼栋？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove(item)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doRemove (row) {
      RoomAPI.removeBuilding(row.id).then(response => {
        if (response.status === 0) {
          this.getBuildingList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败~~'
        })
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
.building-list{
  position: relative;
  // padding-right: 70px;
  overflow: auto;
  .pagination{
    display: inline-block;
    position: fixed;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 6px;
    box-shadow: 0 0 1px 1px #f2f2f2;
    background: #fff;
    padding: 0;
    width: 60px;
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
.building-list{
  .pagination > button{
    display: block;
    padding: 5px 10px;
    height: 40px;
    background-color: transparent;
    &:last-of-type{
      border-top: 1px solid #eee;
    }
  }
}
</style>
