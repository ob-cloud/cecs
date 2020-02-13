<template>
  <div class="building ui-container" :style="{height: `${height}px`}">
    <div class="search-bar">
      <div class="caption is-right">
        <el-button-group>
          <el-button type="primary" icon="btn-icon el-icon-refresh" :title="$t('message.refresh')" @click="handleRefresh"></el-button>
          <el-button v-isPermited="42" type="primary" icon="btn-icon el-icon-circle-plus-outline" :title="$t('message.create')" @click="handleCreate"></el-button>
          <el-button type="primary" icon="btn-icon obicon obicon-switch-btn" :title="$t('message.switchControl')" @click="handleMainSwitch"></el-button>
        </el-button-group>
      </div>
      <div class="caption">
        <el-input clearable class="caption-item" @keyup.enter.native="handleSearch" v-model="searchModel.buildName" :placeholder="$t('message.placeholder', { PLACEHOLDER: 'build' })"></el-input>
        <el-input clearable class="caption-item" @keyup.enter.native="handleSearch" v-model="searchModel.floorName" :placeholder="$t('message.placeholder', { PLACEHOLDER: 'floor' })"></el-input>
        <el-input clearable class="caption-item" @keyup.enter.native="handleSearch" v-model="searchModel.roomName" :placeholder="$t('message.placeholder', { PLACEHOLDER: 'room' })"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
      </div>
    </div>
    <div class="building-list" v-loading.lock="loading" :style="{height: (height - 80) + 'px'}">
      <div class="building-item" v-for="item in roomList" :key="item.id">
        <div class="header">
          <i class="icon obicon obicon-device" v-isPermited="44" :title="$t('smart.room.device')" @click="handleDevice(item)"></i>
          <!-- <i class="icon obicon obicon-scene" title="教室场景" @click="handleScene(item)"></i> -->
          <i class="icon obicon obicon-power" :title="$t('message.power')" @click="handlePower(item)"></i>
          <i class="icon el-icon-edit" v-isPermited="42" :title="$t('message.edit')" @click="handleEdit(item)"></i>
          <i class="icon el-icon-delete" v-isPermited="43" :title="$t('message.delete')" @click="handleRemove(item)"></i>
        </div>
        <div class="content">
          <i class="building-sign obicon obicon-classroom" :class="{'is-active': isLightActive(item.deviceState)}"></i>
          <p class="text">{{item.buildingName}}{{$t('message.building')}}{{item.floorName}}{{$t('message.floor')}}{{item.roomName}}{{$t('message.room')}}</p>
        </div>
      </div>
      <el-pagination
        class="pagination"
        :prev-text="$t('message.prev')"
        :next-text="$t('message.next')"
        :page-size="searchModel.pageSize"
        :current-page="searchModel.pageNo"
        :total="total"
        layout="prev, next"
        @current-change="onCurrentChange"
        @size-change="onSizeChange">
      </el-pagination>
    </div>
    <el-dialog v-if="createDialogVisible" top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="creation" autoComplete="on" :rules="creationRules" :model="roomModel" label-position="left" label-width="80px">
        <el-form-item :label="$t('smart.room.label', { LABEL: 'build' })" prop="buildingId">
          <el-select :placeholder="$t('message.placeholder', { TYPE: 'choose', PLACEHOLDER: 'build' })" v-model="roomModel.buildingId" @change="onSelectChange">
            <el-option v-for="item in buildingList" :key="item.id" :label="item.buildName + $t('message.building')" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('smart.room.label', { LABEL: 'floor' })" prop="floorId">
          <el-select :placeholder="$t('message.placeholder', { TYPE: 'choose', PLACEHOLDER: 'floor' })" v-model="roomModel.floorId">
            <el-option v-for="item in layerList" :key="item.id" :label="item.floorName + $t('message.floor')" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('smart.room.label', { LABEL: 'room' })" prop="roomName">
          <el-input v-model="roomModel.roomName" :placeholder="$t('message.placeholder', { PLACEHOLDER: 'room' })">
            <template slot="append">{{$t('message.room')}}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="doCreateRoom(dialogStatus)">{{$t('message.confirm')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog v-if="deviceDialogVisible" top="10%" width="960px" :title="dialogTitleMap[dialogStatus]" :visible.sync="deviceDialogVisible" :close-on-click-modal="false">
      <room-device :room='deviceActiveRoom'></room-device>
    </el-dialog>
    <el-dialog v-if="sceneDialogVisible" top="10%" width="760px" :title="dialogTitleMap[dialogStatus]" :visible.sync="sceneDialogVisible" :close-on-click-modal="false">
      <room-scene :room='sceneActiveRoom'></room-scene>
    </el-dialog>
  </div>
</template>

<script>
import RoomAPI from '@/api/room'
import RoomDevice from './components/device'
import RoomScene from './components/scene'
import Helper from '@/common/helper'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
export default {
  props: {
    roomPreload: {
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
      roomList: [],
      total: 0,
      buildingList: [],
      layerList: [],
      searchModel: {
        roomName: '',
        buildName: '',
        floorName: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      roomModel: {
        roomName: '',
        buildingId: '',
        floorId: ''
      },
      creationRules: {
        buildingId: [{ required: true, message: this.$t('message.rules', {RULE: 'build'}), trigger: 'blur' }],
        floorId: [{ required: true, message: this.$t('message.rules', {RULE: 'floor'}), trigger: 'blur' }],
        roomName: [{ required: true, message: this.$t('message.rules', {RULE: 'room'}), trigger: 'blur' }]
      },
      createDialogVisible: false,
      deviceDialogVisible: false,
      sceneDialogVisible: false,
      dialogStatus: '',
      dialogTitleMap: {
        device: this.$t('smart.room.dialogTitle', {TITLE: 'device'}),
        scene: this.$t('smart.room.dialogTitle', {TITLE: 'scene'}),
        edit: this.$t('smart.room.dialogTitle', {TITLE: 'edit'}),
        create: this.$t('smart.room.dialogTitle', {TITLE: 'create'})
      },
      // 当前选中教室号
      deviceActiveRoom: '',
      sceneActiveRoom: '',
    }
  },
  components: { RoomDevice, RoomScene },
  mounted () {
    this.getRoomList()
    this.getBuildingList()
    Helper.windowOnResize(this, this.fixLayout)
  },
  watch: {
    createDialogVisible (val) {
      if (val === false) {
        this.$refs.creation.resetFields()
      }
    },
    'roomModel.buildingId' (val) {
      if (val) {
        // this.roomModel.floorId = ''
        this.getLayerList(val)
      }
    }
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
    getLayerList (buildingId) {
      RoomAPI.getFloorByBuildingId(buildingId).then(res => {
        if (res.status === 0) {
          const {data} = res
          this.layerList = data.records
        }
      })
    },
    getRoomList () {
      this.loading = true
      RoomAPI.getRoomListV2(this.searchModel).then(resp => {
        if (resp.status === 0) {
          this.roomList = resp.data.records
          this.total = resp.total
          if (!this.roomList.length && this.searchModel.pageNo !== 1) {
            this.searchModel.pageNo = PAGINATION_PAGENO
            this.getRoomList()
          }
        } else {
          this.$message({
            message: this.$t('smart.room.message', {MESSAGE: 'fail'})
          })
        }
        this.loading = false
      }).catch(err => {
        this.$message({
          title: this.$t('message.fail'),
          message: this.$t('smart.room.message', {MESSAGE: 'err'}),
          type: 'error'
        })
        this.loading = false
      })
    },
    isLightActive (status) {
      if (!status) return false
      const state = status.slice(0, 2)
      return state !== '00'
    },
    handleRefresh () {
      this.searchModel.buildName = ''
      this.searchModel.floorName = ''
      this.searchModel.roomName = ''
      this.getRoomList()
    },
    resetRoomModel () {
      this.roomModel = {
        roomName: '',
        buildingId: '',
        floorId: ''
      }
    },
    onCurrentChange (pageNo) {
      this.searchModel.pageNo = pageNo
      this.getRoomList()
    },
    onSizeChange (pageSize) {
      this.searchModel.pageSize = pageSize
      this.getRoomList()
    },
    onSelectChange (val) {
      if (val) {
        this.roomModel.floorId = ''
      }
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.createDialogVisible = true
      this.resetRoomModel()
    },
    handleSearch () {
      this.getRoomList()
    },
    async handleMainSwitch () {
      const that = this
      const res = await RoomAPI.getSwitchGlobalType()
      if (res.status !== 0) return
      const action = res.data ? this.$t('message.status', {STATUS: 'close'}) : this.$t('message.status', {STATUS: 'open'})
      this.$confirm(`${action}${this.$t('smart.room.message', {MESSAGE: 'switchConfirm'})}`, this.$t('message.tips'), {
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
        text: `${action}${this.$t('smart.room.message', {MESSAGE: 'loading'})}`
      })
      RoomAPI.triggerGlobalSwitch(status ? 1 : 2).then(res => {
        if (res.status === 0) {
          this.getRoomList()
        } else {
          this.$message({
            type: 'error',
            message: this.$t('smart.room.message', {STATUS: 'switchFail'})
          })
        }
        loading.close()
      }).catch(() => {
        loading.close()
      })
    },
    handleDevice (row) {
      this.deviceActiveRoom = row.id
      this.dialogStatus = 'device'
      this.deviceDialogVisible = true
    },
    handleScene (row) {
      this.sceneActiveRoom = row.id
      this.dialogStatus = 'scene'
      this.sceneDialogVisible = true
    },
    handlePower (item) {
      const isActive = this.isLightActive(item.deviceState)
      const statusText = isActive ? this.$t('message.status', {STATUS: 'close'}) : this.$t('message.status', {STATUS: 'open'})
      const loading = this.$loading({
        lock: true,
        text: `${statusText}${this.$t('smart.room.message', {MESSAGE: 'loading'})}...`
      })
      RoomAPI.triggerSwitch({roomId: item.id, deviceType: isActive ? 2 : 1}).then(res => {
        if (res.status === 0) {
          this.getRoomList()
          loading.close()
          this.$message({
            type: 'success',
            message: `${statusText}${this.$t('message.success')}`
          })
        } else {
          loading.close()
          this.$message({
            type: 'error',
            message: this.$t('smart.room.message', {MESSAGE: 'switchFail'})
          })
        }
      }).catch(() => {
        loading.close()
        this.$message({
          type: 'error',
          message: this.$t('smart.room.message', {MESSAGE: 'switchFail'})
        })
      })
    },
    handleEdit (row) {
      this.dialogStatus = 'edit'
      this.createDialogVisible = true
      this.roomModel = {
        roomName: row.roomName,
        floorId: row.floorId,
        buildingId: row.buildingId,
        id: row.id
      }
    },
    handleRemove (row) {
      this.$confirm(this.$t('smart.room.message', {MESSAGE: 'rmRoomConfirm'}), this.$t('message.tips'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        RoomAPI.removeRoomV2(row.id).then(res => {
          if (res.status === 0) {
            this.getRoomList()
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
    },
    doCreateRoom (type) {
      this.$refs.creation.validate(valid => {
        if (valid) {
          const action = type === 'create' ? 'addRoomV2' : 'updateRoomV2'
          RoomAPI[action](this.roomModel).then(response => {
            if (response.status === 0) {
              this.getRoomList()
            } else {
              const text = (type === 'create' ? this.$t('message.create') : this.$t('message.edit'))
              this.$message({
                type: 'error',
                message: text + this.$t('message.fail')
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: this.$t('message.actionFail')
            })
          })
          this.createDialogVisible = false
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
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
    width: 150px;
    margin-right: 10px;
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
.caption .btn-icon{
  font-size: 30px;
  // color: #444;
}
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
