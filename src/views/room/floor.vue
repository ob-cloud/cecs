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
        <el-input class="caption-item" @keyup.enter.native="handleSearch" v-model="searchModel.buildName" placeholder="请输入楼栋"></el-input>
        <el-input class="caption-item" @keyup.enter.native="handleSearch" v-model="searchModel.floorName" placeholder="请输入楼层"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </div>
    </div>
    <div class="building-list" v-loading.lock="loading" :style="{height: `${containerHeight}px`}">
      <div class="building-item" v-for="item in layerList" :key="item.id">
        <div class="header">
          <i class="icon obicon obicon-power" title="电源" @click="handlePower(item)"></i>
          <i class="icon el-icon-edit" title="编辑" @click="handleEdit(item)"></i>
          <i class="icon el-icon-delete" title="删除" @click="handleRemove(item)"></i>
        </div>
        <div class="content">
          <i class="building-sign obicon obicon-building" :class="{'is-active': item === 2}"></i>
          <p class="text">{{item.buildingName}}栋{{item.floorName}}层</p>
        </div>
      </div>
      <el-pagination
        class="pagination"
        prev-text="上一屏"
        next-text="下一屏"
        :page-size="searchModel.pageSize"
        :total="total"
        layout="prev, next"
        @current-change="onCurrentChange"
        @size-change="onSizeChange">
      </el-pagination>
    </div>
    <el-dialog  v-if="createDialogVisible" top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="creation" autoComplete="on" :rules="creationRules" :model="createModel" label-position="left" label-width="80px">

        <el-form-item label="楼栋名称" prop="buildingId">
          <el-select clearable class="item" placeholder="请选择楼栋" v-model="createModel.buildingId">
            <el-option :label='item.buildName' :value='item.id' v-for="item in buildingList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层名称" prop="floorName">
          <el-input v-model="createModel.floorName" placeholder="请输入楼层">
            <template slot="append">层</template>
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
import Helper from '@/common/helper'
export default {
  props: {
    preload: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      containerHeight: 500,
      buildingList: [],
      layerList: [],
      total: 0,
      createDialogVisible: false,
      dialogStatus: '',
      dialogTitleMap: {
        edit: '编辑楼层',
        create: '创建楼层'
      },
      searchModel: {
        buildName: '',
        floorName: '',
        pageNo: 1,
        pageSize: 10
      },
      createModel: {
        floorName: '',
        buildingId: ''
      },
      creationRules: {
        floorName: [{ required: true, message: '楼层不可为空', trigger: 'blur' }],
        buildingId: [{ required: true, message: '楼栋不可为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getLayerList()
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
      RoomAPI.getBuildingList({buildName: ''}).then(res => {
        if (res.status === 0) {
          const {data} = res
          this.buildingList = data.records
        }
      })
    },
    getLayerList () {
      this.loading = true
      RoomAPI.getFloorList(this.searchModel).then(res => {
        if (res.status === 0) {
          const {data} = res
          this.layerList = data.records
          this.total = res.total
        }
        this.loading = false
      })
    },
    handleRefresh () {
      this.getLayerList()
    },
    onCurrentChange (pageNo) {
      this.searchModel.pageNo = pageNo
      this.getLayerList()
    },
    onSizeChange (pageSize) {
      this.searchModel.pageSize = pageSize
      this.getLayerList()
    },
    resetModel () {
      this.createModel = {
        floorName: '',
        buildingId: ''
      }
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.createDialogVisible = true
      this.resetModel()
    },
    checkCreate (type) {
      this.$refs.creation.validate(valid => {
        if (valid) {
          const action = type === 'create' ? 'addFloor' : 'updateFloor'
          RoomAPI[action](this.createModel).then(response => {
            if (response.status === 0) {
              this.getLayerList()
            } else {
              this.$message({
                type: 'error',
                message: (type === 'create' ? '添加' : '编辑') + '失败!'
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '操作失败'
            })
          })
          this.createDialogVisible = false
        }
      })
    },
    handleSearch () {
      this.getLayerList()
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
      RoomAPI.triggerGlobalSwitch(1).then(res => {
        if (res.status === 0) {
          this.getLayerList()
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
      this.$confirm('即将关闭该楼栋所有开关', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        RoomAPI.triggerSwitch({floorId: item.id, deviceType: 1}).then(res => {
          if (res.status === 0) {
            this.getLayerList()
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
      this.createModel = {buildingId: item.buildingId, id: item.id, floorName: item.floorName}
    },
    handleRemove (item) {
      this.$confirm('确认删除楼栋？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        RoomAPI.removeFloor(item.id).then(response => {
          if (response.status === 0) {
            this.getLayerList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        })
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
.building-list{
  position: relative;
  padding-right: 70px;
  .pagination{
    display: inline-block;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 6px;
    box-shadow: 0 0 1px 1px #f2f2f2;
    background: #fff;
    padding: 0;
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
