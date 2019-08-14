<template>
  <div class="device smart">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="栋" v-model="search.building"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="楼层" v-model="search.layer"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="房号" v-model="search.name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">创建</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog top="10%" width="760px" :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <room-device :room='deviceActiveRoom'></room-device>
    </el-dialog>
    <el-dialog top="10%" width="760px" :title="dialogTitleMap[dialogStatus]" :visible.sync="sceneDialogVisible" :close-on-click-modal="false">
      <room-scene :room='sceneActiveRoom'></room-scene>
    </el-dialog>
    <el-dialog top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form ref="creation" autoComplete="on" :rules="creationRules" :model="roomModel" label-position="left" label-width="80px" style="width: 80%; margin: 0 auto;">
        <el-form-item label="楼栋名称" prop="building">
          <el-input v-model="roomModel.building" autoComplete="on" placeholder="请输入楼栋值"></el-input>
        </el-form-item>
        <el-form-item label="楼层名称" prop="layer">
          <el-input v-model="roomModel.layer" placeholder="请输入楼层值"></el-input>
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
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import RoomDevice from './device'
import RoomScene from './scene'
import RoomAPI from '@/api/room'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      tableLoading: true,
      tableHeight: 0,
      search: {
        room: '',
        building: '',
        layer: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      dialogVisible: false,
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
      roomModel: {
        room: '',
        building: '',
        layer: ''
      },
      createDialogVisible: false,
      creationRules: {
        building: [{ required: true, message: '楼栋不可为空', trigger: 'blur' }],
        layer: [{ required: true, message: '楼层名称不可为空', trigger: 'blur' }],
        room: [{ required: true, message: '房间名称不可为空', trigger: 'blur' }]
      }
    }
  },
  components: { BaseTable, RoomDevice, RoomScene },
  created () {
    this.columns = this.getColumns()
    this.getRoomList()
  },
  computed: {
    total () {
      return this.tableData.length || 0
    }
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
      this.tableHeight = Helper.calculateTableHeight()
    },
    getColumns () {
      return [{
        label: '房间号',
        prop: 'room',
        align: 'center'
      }, {
        label: '楼栋',
        prop: 'building',
        align: 'center'
      }, {
        label: '楼层',
        prop: 'layer',
        align: 'center'
      }, {
        label: '操作',
        align: 'center',
        minWidth: '180px',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        <el-button size="tiny" icon="iconfont icon-shebeiguanli" title="房间设备" onClick={() => this.handleDeviceMgr(row)}></el-button>,
        <el-button size="tiny" icon="iconfont icon-changjingguanli" title="房间场景" onClick={() => this.handleSceneMgr(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-edit" title="编辑" onClick={() => this.handleEdit(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-delete" title="删除" onClick={() => this.handleRemove(row)}></el-button>
      ]
    },
    getRoomList () {
      this.tableLoading = true
      RoomAPI.getRoomList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.locations
        } else {
          this.$message({
            message: resp.message || '房间获取失败'
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: err.message || '服务出错',
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getRoomList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getRoomList()
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.search.pageSize = PAGINATION_PAGESIZE
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
    doCreateRoom (type) {
      this.$refs.creation.validate(valid => {
        if (valid) {
          type === 'create' ? this.createAction() : this.editAction()
          this.createDialogVisible = false
        }
      })
    },
    createAction () {
      RoomAPI.createRoom(this.roomModel).then(response => {
        if (response.status === 200) {
          this.getRoomList()
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
    editAction () {
      RoomAPI.editRoom(this.roomModel).then(response => {
        if (response.status === 200) {
          this.getRoomList()
        } else {
          this.$message({
            type: 'error',
            message: '编辑失败!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '编辑失败'
        })
      })
    },
    handleDeviceMgr (row) {
      this.deviceActiveRoom = row.room
      this.dialogStatus = 'device'
      this.dialogVisible = true
    },
    handleSceneMgr (row) {
      this.sceneActiveRoom = row.room
      this.dialogStatus = 'scene'
      this.sceneDialogVisible = true
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
        this.doDelete(row)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doDelete (row) {
      RoomAPI.deleteRoom(row).then(response => {
        if (response.status === 200) {
          this.getRoomList()
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
  }
}
</script>

<style lang="scss" scoped>
.smart{
  width: 94%;
  margin: 12px auto;
}
</style>
