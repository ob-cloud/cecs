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
          <el-select clearable class="caption-item" placeholder="楼栋" v-model="search.buildingId" filterable>
            <el-option label='全部' value=''></el-option>
            <el-option v-for="item in buildingList" :key="item.id" :label="item.buildName + '栋'" :value="item.id"></el-option>
          </el-select>
          <el-select clearable class="caption-item" placeholder="楼层" v-model="search.floorId" filterable>
            <el-option label='全部' value=''></el-option>
            <el-option v-for="item in floorList" :key="item.id" :label="item.floorName + '层'" :value="item.floorId"></el-option>
          </el-select>
          <el-select clearable class="caption-item" placeholder="房间" v-model="search.roomId" filterable>
            <el-option label='全部' value=''></el-option>
            <el-option v-for="item in roomList" :key="item.id" :label="item.roomName + '房'" :value="item.roomId"></el-option>
          </el-select>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="场景名称" v-model="search.scene_name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="primary" @click="createRemoteScene">创建场景</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog v-if="createDialogVisible" top="10%" width="960px" :title="dialogAction" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <scene-create @scene-ready="onSceneReady" :scene="sceneData" @close="createDialogVisible = false"></scene-create>
      <!-- <div slot="footer" class="dialog-footer text-center" >
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createDialogVisible = false">确 认</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import SceneAPI from '@/api/scene'
import SceneCreate from './create'
import RoomAPI from '@/api/room'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      tableLoading: true,
      tableHeight: 0,
      buildingList: [],
      floorList: [],
      roomList: [],
      search: {
        buildingId: '',
        floorId:'',
        roomId: '',
        scene_name: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      createDialogVisible: false,
      dialogAction: '添加场景',
      sceneData: null
    }
  },
  components: { BaseTable, SceneCreate },
  created () {
    this.columns = this.getColumns()
    this.getSceneList()
    this.getBuildingList()
    // this.getFloorList()
    this.getRoomList()
  },
  watch: {
    'search.buildingId' (val) {
      val && this.getFloorList(val)
    },
    'search.roomId' (val) {
      val && this.getLayerList(val)
    },
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
      const _this = this
      return [
      // {
      //   label: '场景序号',
      //   prop: 'scene_number',
      //   align: 'center'
      // },
      {
        label: '场景名称',
        prop: 'scene_name',
        align: 'center'
      }, {
        label: '楼栋',
        prop: 'building',
        align: 'center'
      }, {
        label: '楼层',
        prop: 'floor',
        align: 'center'
      }, {
        label: '房间',
        prop: 'room',
        align: 'center'
      },
      // {
      //   label: '场景类型',
      //   prop: 'scene_type',
      //   align: 'center',
      //   formatter (val) {
      //     const type = {
      //       '00': '云端场景',
      //       '01': '本地场景',
      //       '02': '有人场景',
      //       '03': '无人场景',
      //       '04': '安防场景'
      //     }
      //     return type[val] || '云端场景'
      //   }
      // },
      {
        label: '消息推送',
        prop: 'msg_alter',
        align: 'center',
        formatter (val) {
          const push = {
            0: '无推送',
            1: 'APP推送',
            2: '短信推送',
            3: 'APP+短信推送'
          }
          return push[val] || '无推送'
        }
      }, {
        label: '场景状态',
        align: 'center',
        renderBody (h, row) {
          return (
            <el-switch
              onChange={() => {
                _this.handleChangeStatus(row)
              }}
              value={[false, true][row.scene_status]}
              active-color='#409EFF'
              inactive-color='#DCDFE6'>
            </el-switch>
          )
        }
      }, {
        label: '操作',
        align: 'center',
        minWidth: '180px',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        <el-button size="tiny" icon="el-icon-caret-right" title="执行场景" onClick={() => this.execute(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-edit" title="编辑" onClick={() => this.edit(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-delete" title="删除" onClick={() => this.handleRemove(row)}></el-button>
      ]
    },
    getBuildingList () {
      RoomAPI.getBuildingList().then(res => {
        if (res.status === 0) {
          this.buildingList = res.data.records
        }
      })
    },
    getFloorList (buildingId) {
      // RoomAPI.getFloorList().then(res => {
      //   if (res.status === 0) {
      //     this.floorList = res.data.records
      //   }
      // })
      RoomAPI.getFloorByBuildingId(buildingId).then(res => {
        if (res.status === 0) {
          this.floorList = res.data.records
        }
      })
    },
    getRoomList () {
      RoomAPI.getRoomListV2().then(resp => {
        if (resp.status === 0) {
          this.roomList = resp.data.records
        }
      })
    },
    getSceneList () {
      this.tableLoading = true
      SceneAPI.getSceneList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.scenes
        } else {
          this.$message({
            message: resp.message || '场景获取失败'
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
      this.getSceneList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getSceneList()
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.search.pageSize = PAGINATION_PAGESIZE
      this.getSceneList()
    },
    handleChangeStatus (row) {
      row.scene_status = 1 - row.scene_status
      SceneAPI.chageSceneStatus(`0${row.scene_status}`, row.scene_number).then(res => {
        this.responseHandler(res, '场景状态更新')
      }).catch(err => {
        this.responseHandler({message: 'error'}, '场景状态更新')
      })
    },
    responseHandler (res, msg) {
      let message = `${msg}失败`
      let type = 'error'
      if (res.message.includes('success')) {
        type = 'success'
        message = `${msg}成功`
      }
      this.$message({
        type,
        message
      })
    },
    execute (row) {
      const loader = this.$loading({
        lock: true,
        text: '场景执行中...'
      })
      SceneAPI.executeScene(row.scene_number).then(res => {
        loader.close()
        this.responseHandler(res, '场景状态更新')
        if (res.message.includes('success')) {
          this.getSceneList()
        }
      }).catch(err => {
        loader.close()
        this.responseHandler({message: 'error'}, '场景状态更新')
      })
    },
    edit (row) {
      this.createDialogVisible = true
      this.dialogAction = '编辑场景'
      this.sceneData = row
    },
    handleRemove (row) {
      this.$confirm('确认删除场景？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove(row.scene_number)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doRemove (sceneNumber) {
      SceneAPI.removeScene(sceneNumber).then(res => {
        this.responseHandler(res, '场景删除')
        if (res.message.includes('success')) {
          this.getSceneList()
        }
      }).catch(() => {
        this.responseHandler({message: 'error'}, '场景删除')
      })
    },
    createRemoteScene () {
      this.dialogAction = '添加场景'
      this.createDialogVisible = true
      this.sceneData = null
    },
    onSceneReady (scene, dialogVisible) {
      SceneAPI.setScene(scene).then(res => {
        this.responseHandler(res, '添加场景')
        if (res.message.includes('success')) {
          this.createDialogVisible = false
          this.getSceneList()
        }
      }).catch(err => {
        this.responseHandler({message: 'error'}, '添加场景')
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
