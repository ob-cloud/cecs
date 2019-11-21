<template>
  <div class="device smart ui-container">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageSize="search.pageSize"
      :pageNo="search.pageNo"
      :pageTotal="total"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-select clearable class="caption-item" :placeholder="$t('smart.building.title')" v-model="search.buildingId" filterable>
            <el-option :label="$t('smart.scene.search', {FIELD: 'build'})" value=''></el-option>
            <el-option v-for="(item, index) in buildingList" :key="item.buildingName + index + item.buildingId" :label="item.buildingName" :value="item.buildingId"></el-option>
          </el-select>
          <el-select clearable class="caption-item" :placeholder="$t('smart.floor.title')" v-model="search.floorId" filterable>
            <el-option :label="$t('smart.scene.search', {FIELD: 'floor'})" value=''></el-option>
            <el-option v-for="(item, index) in floorList" :key="item.floorName + index + item.id" :label="item.floorName" :value="item.floorId"></el-option>
          </el-select>
          <el-select clearable class="caption-item" :placeholder="$t('smart.room.title')" v-model="search.roomId" filterable>
            <el-option :label="$t('smart.scene.search', {FIELD: 'room'})" value=''></el-option>
            <el-option v-for="(item, index) in roomList" :key="item.roomName + index + item.id" :label="item.roomName" :value="item.roomId"></el-option>
          </el-select>
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.scene.search', {FIELD: 'name'})" v-model="search.scene_name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
        </template>
        <template slot="actionBar">
          <el-button v-isPermited="40" type="primary" @click="createRemoteScene">{{$t('smart.scene.action', {FIELD: 'create'})}}</el-button>
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
// import RoomAPI from '@/api/room'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
import sceneMixin from './scene'
export default {
  mixins: [sceneMixin],
  data () {
    return {
      tableLoading: true,
      tableHeight: 0,
      total: 0,
      containerHeight: 0,
      // buildingList: [],
      // floorList: [],
      // roomList: [],
      // sceneDeviceList: [],
      search: {
        buildingId: '',
        floorId: '',
        roomId: '',
        scene_name: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      createDialogVisible: false,
      dialogAction: this.$t('smart.scene.action', {FIELD: 'create'}),
      sceneData: null
    }
  },
  components: { BaseTable, SceneCreate },
  created () {
    this.columns = this.getColumns()
    this.getSceneList()
    this.getSceneDeviceList()
  },
  watch: {
    'search.buildingId' (val) {
      this.search.floorId = ''
      this.floorList = []
      this.getFloorList(val)
    },
    'search.floorId' (val) {
      this.search.roomId = ''
      this.roomList = []
      this.getRoomList(val)
    },
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
    Helper.windowOnResize(this, this.fixContainerLayout)
  },
  methods: {
    fixContainerLayout () {
      this.containerHeight = Helper.calculateContainerHeight() - 30
    },
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 20
    },
    getColumns () {
      const _this = this
      return [{
        label: this.$t('smart.scene.tableField', {FIELD: 'name'}),
        prop: 'sceneName',
        align: 'center'
      }, {
        label: this.$t('smart.scene.tableField', {FIELD: 'build'}),
        prop: 'buildingName',
        align: 'center'
      }, {
        label: this.$t('smart.scene.tableField', {FIELD: 'floor'}),
        prop: 'floorName',
        align: 'center'
      }, {
        label: this.$t('smart.scene.tableField', {FIELD: 'room'}),
        prop: 'roomName',
        align: 'center'
      }, {
        label: this.$t('smart.scene.tableField', {FIELD: 'status'}),
        align: 'center',
        renderBody (h, row) {
          return (
            <el-switch onChange={() => { _this.handleChangeStatus(row) }}
              value={[false, true][row.sceneStatus]}
              active-color='#246CDA'
              inactive-color='#282A39'>
            </el-switch>
          )
        }
      }, {
        label: this.$t('smart.scene.tableField', {FIELD: 'action'}),
        align: 'center',
        minWidth: '180px',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolbox = []
      const execute = <el-button size="tiny" icon="el-icon-caret-right" title={this.$t('smart.scene.action', {FIELD: 'excute'})} onClick={() => this.execute(row)}></el-button>
      const edit = <el-button size="tiny" icon="el-icon-edit" title={this.$t('smart.scene.action', {FIELD: 'edit'})} onClick={() => this.edit(row)}></el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" title={this.$t('smart.scene.action', {FIELD: 'delete'})} onClick={() => this.handleRemove(row)}></el-button>

      this.$isPermited(39) && toolbox.push(execute)
      this.$isPermited(38) && toolbox.push(edit)
      this.$isPermited(41) && toolbox.push(remove)
      !toolbox.length && toolbox.push(<span title="">-</span>)
      return toolbox
    },
    getSceneList () {
      this.tableLoading = true
      const param = {...this.search}
      param.buildingId === '' && delete param.buildingId
      param.floorId === '' && delete param.floorId
      param.roomId === '' && delete param.roomId
      SceneAPI.getSmartSceneList(param).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
          this.total = resp.total
          if (!this.tableData.length && this.search.pageNo !== 1) {
            this.search.pageNo = PAGINATION_PAGENO
            this.getSceneList()
          }
        } else {
          this.$message({
            message: this.$t('smart.scene.message', {MESSAGE: 'fetchFail'})
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: this.$t('message.fail'),
          message: this.$t('message.exception'),
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
      row.sceneStatus = 1 - row.sceneStatus
      SceneAPI.chageSceneStatus(`0${row.sceneStatus}`, row.sceneNumber).then(res => {
        this.responseHandler(res, this.$t('smart.scene.message', {MESSAGE: 'update'}))
      }).catch(err => {
        this.responseHandler({message: 'error'}, this.$t('smart.scene.message', {MESSAGE: 'update'}))
      })
    },
    responseHandler (res, msg) {
      let message = `${msg}${this.$t('message.fail')}`
      let type = 'error'
      if (res.message.includes('success')) {
        type = 'success'
        message = `${msg}${this.$t('message.success')}`
      }
      this.$message({
        type,
        message
      })
    },
    execute (row) {
      const loader = this.$loading({
        lock: true,
        text: this.$t('smart.scene.message', {MESSAGE: 'excuting'})
      })
      SceneAPI.executeScene(row.sceneNumber).then(res => {
        loader.close()
        this.responseHandler(res, this.$t('smart.scene.message', {MESSAGE: 'excute'}))
        if (res.message.includes('success')) {
          this.getSceneList()
        }
      }).catch(err => {
        loader.close()
        this.responseHandler({message: 'error'}, this.$t('smart.scene.message', {MESSAGE: 'excute'}))
      })
    },
    edit (row) {
      this.createDialogVisible = true
      this.dialogAction = this.$t('smart.scene.action', {MESSAGE: 'edit'})
      this.sceneData = row
    },
    handleRemove (row) {
      this.$confirm(this.$t('smart.scene.message', {MESSAGE: 'delConfirm'}), this.$t('message.tips'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove(row.sceneNumber)
      }).catch(() => {
        console.log('cancel')
      })
    },
    doRemove (sceneNumber) {
      SceneAPI.removeScene(sceneNumber).then(res => {
        this.responseHandler(res, this.$t('smart.scene.message', {MESSAGE: 'delDevice'}))
        if (res.message.includes('success')) {
          this.getSceneList()
        }
      }).catch(() => {
        this.responseHandler({message: 'error'}, this.$t('smart.scene.message', {MESSAGE: 'delDevice'}))
      })
    },
    createRemoteScene () {
      this.dialogAction = this.$t('smart.scene.action', {MESSAGE: 'create'})
      this.createDialogVisible = true
      this.sceneData = null
    },
    onSceneReady (scene, dialogVisible) {
      SceneAPI.setSmartScene(scene).then(res => {
        console.log('res --- ', res)
        this.responseHandler(res, this.$t('smart.scene.action', {MESSAGE: 'create'}))
        if (res.message.includes('success')) {
          this.createDialogVisible = false
          this.getSceneList()
        }
      }).catch(err => {
        this.responseHandler({message: 'error'}, this.$t('smart.scene.action', {MESSAGE: 'create'}))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  // width: 94%;
  // margin: 12px auto;
  margin: 15px 20px;
}
</style>
