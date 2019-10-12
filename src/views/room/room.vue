<template>
  <div class="smart building">
    <div class="search-bar">
      <div class="caption is-right">
        <el-button-group>
          <el-button type="plain" icon="btn-icon el-icon-refresh" title="刷新" @click="handleRefresh"></el-button>
          <el-button type="plain" icon="btn-icon el-icon-circle-plus-outline" title="添加" @click="handleCreate"></el-button>
          <el-button type="plain" icon="btn-icon obicon obicon-switch-btn" title="开关总闸" @click="handleMainSwitch"></el-button>
        </el-button-group>
      </div>
      <div class="caption">
        <el-input class="caption-item" @keyup.enter.native="handleSearch" placeholder="请输入楼栋"></el-input>
        <el-input class="caption-item" @keyup.enter.native="handleSearch" placeholder="请输入楼层"></el-input>
        <el-input class="caption-item" @keyup.enter.native="handleSearch" placeholder="请输入房号"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
      </div>
    </div>
    <div class="building-list" v-loading.lock="loading">
      <div class="building-item" v-for="(item, index) in roomList" :key="index">
        <div class="header">
          <i class="icon obicon obicon-device" title="房间设备" @click="handleDevice(item)"></i>
          <i class="icon obicon obicon-scene" title="房间场景" @click="handleScene(item)"></i>
          <i class="icon obicon obicon-power" title="电源" @click="handlePower(item)"></i>
          <i class="icon el-icon-edit" title="编辑" @click="handleEdit(item)"></i>
          <i class="icon el-icon-delete" title="删除" @click="handleRemove(item)"></i>
        </div>
        <div class="content">
          <i class="building-sign obicon obicon-classroom" :class="{'is-active': index === 2}"></i>
          <p class="text">{{item.building}}栋{{item.layer}}层{{item.room}}房</p>
        </div>
      </div>
    </div>
    <el-dialog top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="creation" autoComplete="on" :rules="creationRules" :model="roomModel" label-position="left" label-width="80px">
        <el-form-item label="楼栋名称" prop="building">
          <el-select placeholder="请选择楼栋" v-model="roomModel.building">
            <el-option v-for="item in buildingList" :key="item" :label="item + '栋'" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层名称" prop="layer">
          <el-select placeholder="请选择楼层" v-model="roomModel.layer">
            <el-option v-for="item in layerList" :key="item" :label="item + '层'" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间名称" prop="room">
          <el-input v-model="roomModel.room" placeholder="请输入房间号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doCreateRoom(dialogStatus)">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog top="10%" width="760px" :title="dialogTitleMap[dialogStatus]" :visible.sync="deviceDialogVisible" :close-on-click-modal="false">
      <room-device :room='deviceActiveRoom'></room-device>
    </el-dialog>
    <el-dialog top="10%" width="760px" :title="dialogTitleMap[dialogStatus]" :visible.sync="sceneDialogVisible" :close-on-click-modal="false">
      <room-scene :room='sceneActiveRoom'></room-scene>
    </el-dialog>
  </div>
</template>

<script>
import RoomAPI from '@/api/room'
import RoomDevice from './device'
import RoomScene from './scene'
export default {
  data () {
    return {
      loading: true,
      roomList: [],
      buildingList: [],
      layerList: [],
      search: {
        building: '',
        layer: '',
        room: ''
      },
      roomModel: {
        room: '',
        building: '',
        layer: ''
      },
      creationRules: {
        building: [{ required: true, message: '楼栋不可为空', trigger: 'blur' }],
        layer: [{ required: true, message: '楼层名称不可为空', trigger: 'blur' }],
        room: [{ required: true, message: '房间名称不可为空', trigger: 'blur' }]
      },
      createDialogVisible: false,
      deviceDialogVisible: false,
      sceneDialogVisible: false,
      dialogStatus: '',
      dialogTitleMap: {
        device: '房间设备列表',
        scene: '房间场景列表',
        edit: '房间编辑',
        create: '创建房间'
      },
      // 当前选中房间号
      deviceActiveRoom: '',
      sceneActiveRoom: '',
    }
  },
  components: { RoomDevice, RoomScene },
  created () {
    this.getRoomList()
    this.getBuildingList()
    this.getLayerList()
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
      this.buildingList = ['1', '12', '2', '3', '4']
    },
    getLayerList () {
      this.layerList = ['1', '2', '22', '3', '4']
    },
    getRoomList () {
      this.loading = true
      RoomAPI.getRoomList(this.search).then(resp => {
        if (resp.status === 200) {
          this.roomList = resp.data.locations
        } else {
          this.$message({
            message: resp.message || '房间获取失败'
          })
        }
        this.loading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: err.message || '服务出错',
          type: 'error'
        })
        this.loading = false
      })
    },
    handleRefresh () {
      this.search.building = ''
      this.search.layer = ''
      this.search.room = ''
      this.getRoomList()
    },
    resetRoomModel () {
      this.roomModel = {
        room: '',
        building: '',
        layer: ''
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
    handleMainSwitch () {
      this.$confirm('即将关闭所有房间开关', '确认提示', {
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
        text: '正在关闭教室开关...'
      })
      setTimeout(() => {
        loading.close()
      }, 1500)
    },
    handleDevice (row) {
      this.deviceActiveRoom = row.location
      this.dialogStatus = 'device'
      this.deviceDialogVisible = true
    },
    handleScene (row) {
      this.sceneActiveRoom = row.location
      this.dialogStatus = 'scene'
      this.sceneDialogVisible = true
    },
    handlePower (item) {
      this.$message({
        type: 'success',
        message: '关闭成功'
      })
    },
    handleEdit (row) {
      this.dialogStatus = 'edit'
      this.createDialogVisible = true
      this.roomModel = row
    },
    handleRemove (row) {
      this.$confirm('确认删除房间？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // this.doDelete(row)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doCreateRoom (type) {
      this.$refs.creation.validate(valid => {
        if (valid) {
          // type === 'create' ? this.createAction() : this.editAction()
          this.createDialogVisible = false
        }
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
    width: 150px;
    margin-right: 10px;
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
  color: #444;
}
</style>
