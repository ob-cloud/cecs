<template>
  <div class="building ui-container" :style="{height: `${height}px`}">
    <div class="search-bar">
      <div class="caption is-right">
        <el-button-group>
          <el-button type="primary" icon="btn-icon el-icon-refresh" :title="$t('message.refresh')" @click="handleRefresh"></el-button>
          <el-button type="primary" icon="btn-icon el-icon-circle-plus-outline" :title="$t('message.create')" @click="handleCreate"></el-button>
          <el-button type="primary" icon="btn-icon obicon obicon-switch-btn" :title="$t('message.switchControl')" @click="handleMainSwitch"></el-button>
        </el-button-group>
      </div>
      <div class="caption">
        <el-input class="caption-item" @keyup.enter.native="handleSearch" v-model="searchModel.buildName" :placeholder="$t('message.placeholder', { PLACEHOLDER: 'build' })"></el-input>
        <el-input class="caption-item" @keyup.enter.native="handleSearch" v-model="searchModel.floorName" :placeholder="$t('message.placeholder', { PLACEHOLDER: 'floor' })"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
      </div>
    </div>
    <div class="building-list" v-loading.lock="loading" :style="{height: (height - 80) + 'px'}">
      <div class="building-item" v-for="item in layerList" :key="item.id">
        <div class="header">
          <i class="icon obicon obicon-power" :title="$t('message.power')" @click="handlePower(item)"></i>
          <i class="icon el-icon-edit" :title="$t('message.edit')" @click="handleEdit(item)"></i>
          <i class="icon el-icon-delete" :title="$t('message.delete')" @click="handleRemove(item)"></i>
        </div>
        <div class="content">
          <i class="building-sign obicon obicon-building" :class="{'is-active': item.allType}"></i>
          <p class="text">{{item.buildingName}}{{$t('message.building')}}{{item.floorName}}{{$t('message.floor')}}</p>
        </div>
      </div>
      <el-pagination
        class="pagination"
        :prev-text="$t('message.prev')"
        :next-text="$t('message.next')"
        :page-size="searchModel.pageSize"
        :total="total"
        layout="prev, next"
        @current-change="onCurrentChange"
        @size-change="onSizeChange">
      </el-pagination>
    </div>
    <el-dialog  v-if="createDialogVisible" top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="creation" autoComplete="on" :rules="creationRules" :model="createModel" label-position="left" label-width="80px">

        <el-form-item :label="$t('smart.room.label', { LABEL: 'build' })" prop="buildingId">
          <el-select clearable class="item" :placeholder="$t('message.placeholder', { TYPE: 'choose', PLACEHOLDER: 'build' })" v-model="createModel.buildingId">
            <el-option :label='item.buildName' :value='item.id' v-for="item in buildingList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('smart.room.label', { LABEL: 'floor' })" prop="floorName">
          <el-input v-model="createModel.floorName" :placeholder="$t('message.placeholder', { TYPE: 'choose', PLACEHOLDER: 'floor' })">
            <template slot="append">{{$t('message.floor')}}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">>{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="checkCreate(dialogStatus)">{{$t('message.confirm')}}</el-button>
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
      layerList: [],
      total: 0,
      createDialogVisible: false,
      dialogStatus: '',
      dialogTitleMap: {
        edit: this.$t('smart.floor.dialogTitle', {TITLE: 'edit'}),
        create: this.$t('smart.floor.dialogTitle', {TITLE: 'create'})
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
        floorName: [{ required: true, message: this.$t('message.rules', {RULE: 'floor'}), trigger: 'blur' }],
        buildingId: [{ required: true, message: this.$t('message.rules', {RULE: 'build'}), trigger: 'blur' }]
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
      RoomAPI.getSelectBuildingList().then(res => {
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
              const msg = (type === 'create' ? this.$t('message.create') : this.$t('message.edit')) + this.$t('message.fail')
              this.$message({
                type: 'error',
                message: msg
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: this.$t('message.exception')
            })
          })
          this.createDialogVisible = false
        }
      })
    },
    handleSearch () {
      this.getLayerList()
    },
    async handleMainSwitch () {
      const that = this
      const res = await RoomAPI.getSwitchGlobalType()
      if (res.status !== 0) return
      const action = res.data ? this.$t('message.status', {STATUS: 'close'}) : this.$t('message.status', {STATUS: 'open'})
      this.$confirm(`${action}${this.$t('smart.floor.message', {MESSAGE: 'switchConfirm'})}`, this.$t('message.tips'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false,
        callback (actionText, instance) {
          actionText === 'confirm' && that.doHandleSwitch(+!res.data)
        }
      })
    },
    doHandleSwitch (status) {
      const action = status ? this.$t('message.status', {STATUS: 'open'}) : this.$t('message.status', {STATUS: 'close'})
      const loading = this.$loading({
        lock: true,
        text: `${action}${this.$t('smart.floor.message', {MESSAGE: 'loading'})}`
      })
      RoomAPI.triggerGlobalSwitch(status ? 1 : 2).then(res => {
        if (res.status === 0) {
          this.getLayerList()
          loading.close()
        } else {
          this.$message({
            type: 'error',
            message: this.$t('smart.floor.message', {STATUS: 'switchFail'})
          })
        }
      })
    },
    handlePower (item) {
      const action = item.allType ? this.$t('message.status', {STATUS: 'close'}) : this.$t('message.status', {STATUS: 'open'})
      this.$confirm(`${action}${this.$t('smart.floor.message', {MESSAGE: 'switchConfirm'})}`, this.$t('message.tips'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        RoomAPI.triggerSwitch({floorId: item.id, deviceType: item.allType ? 2 : 1}).then(res => {
          if (res.status === 0) {
            this.getLayerList()
          } else {
            this.$message({
              type: 'error',
              message: this.$t('smart.floor.message', {STATUS: 'switchFail'})
            })
          }
        })
      }).catch(() => {
        console.log('cancel')
      })
    },
    handleEdit (item) {
      this.dialogStatus = 'edit'
      this.createDialogVisible = true
      this.createModel = {buildingId: item.buildingId, id: item.id, floorName: item.floorName}
    },
    handleRemove (item) {
      this.$confirm(this.$t('smart.floor.message', {MESSAGE: 'rmRoomConfirm'}), this.$t('message.tips'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        RoomAPI.removeFloor(item.id).then(response => {
          if (response.status === 0) {
            this.getLayerList()
          } else {
            this.$message({
              type: 'error',
              message: this.$t('message.delete') + this.$t('message.fail')
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('message.exception')
          })
        })
      }).catch(() => {
        console.log('cancel')
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
