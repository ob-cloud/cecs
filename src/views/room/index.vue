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
    <el-dialog top="10%" width="760px" :title="dialogTitleMap[dialogStatus]" drag :visible.sync="dialogVisible" :close-on-click-modal="false">
      <room-device :room='currentActiveRoom'></room-device>
      <room-scene v-if="dialogStatus === 'scene'"></room-scene>
    </el-dialog>
    <el-dialog top="10%" width="760px" :title="dialogTitleMap[dialogStatus]" drag :visible.sync="sceneDialogVisible" :close-on-click-modal="false">
      <room-scene :room='currentActiveRoom'></room-scene>
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
        edit: '房间编辑'
      },
      currentActiveRoom: ''
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
      this.getRoomList()
    },
    handleCreate () {

    },
    handleDeviceMgr (row) {
      this.currentActiveRoom = row.room
      this.dialogStatus = 'device'
      this.dialogVisible = true
      console.log('设备管理 ', row)
    },
    handleSceneMgr (row) {
      this.currentActiveRoom = row.room
      this.dialogStatus = 'scene'
      this.sceneDialogVisible = true
      console.log('场景管理 ', row)
    },
    handleEdit (row) {
      console.log('房间编辑 ', row)
    },
    handleRemove (row) {
      console.log('删除房间 ', row)
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
