<template>
  <div class="smart">
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
        <template slot="actionBar">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog id="holder" top="10%" width="760px" title="绑定场景" :visible.sync="sceneDialogVisible" :close-on-click-modal="false" append-to-body>
      <scene-binding @selection="onSelection"></scene-binding>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import SceneBinding from './scene_binding'
import RoomAPI from '@/api/room'
import SceneAPI from '@/api/scene'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
export default {
  name: 'room-scene',
  props: {
    room: {
      type: Number
    }
  },
  data () {
    return {
      tableLoading: true,
      tableHeight: 500,
      search: {
        room: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      sceneDialogVisible: false
    }
  },
  watch: {
    room () {
      this.getRoomSceneList()
    }
  },
  components: { BaseTable, SceneBinding },
  computed: {
    total () {
      return this.tableData.length || 0
    }
  },
  mounted () {
    this.columns = this.getColumns()
    this.getRoomSceneList()
  },
  methods: {
    getColumns () {
      return [{
        label: '场景序号',
        prop: 'scene_number',
        align: 'center'
      }, {
        label: '场景名称',
        prop: 'scene_name',
        align: 'center'
      }, {
        label: '场景类型',
        prop: 'scene_type',
        align: 'center',
        formatter (val) {
          const type = {
            '00': '服务器场景',
            '01': '本地场景',
            '02': '有人场景',
            '03': '无人场景',
            '04': '安防场景'
          }
          return type[val] || '服务器场景'
        }
      }, {
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
        prop: 'scene_status',
        formatter (val) {
          return val === 1 ? '启用' : '关闭'
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
        <el-button size="tiny" icon="el-icon-caret-right" title="执行场景" onClick={() => this.handleExecute(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-delete" title="删除" onClick={() => this.handleRemove(row)}></el-button>
      ]
    },
    getRoomSceneList () {
      this.tableLoading = true
      this.search.room = this.room
      RoomAPI.getRoomSceneList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.scenes
        } else {
          this.$message({
            message: resp.message || '房间场景获取失败'
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
      this.getRoomSceneList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getRoomSceneList()
    },
    onSelection (selection) {
      const loader = this.$loading({
        text: '场景绑定中...'
      })
      this.sceneDialogVisible = false
      const params = {
        scene_number: selection.scene_number,
        location: this.room
      }
      RoomAPI.setRoomScene(params).then(res => {
        loader.close()
        this.responseHandler(res, '场景绑定')
        if (res.message.includes('success')) {
          this.getRoomSceneList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, '场景绑定')
      })
    },
    handleCreate () {
      this.sceneDialogVisible = true
    },
    handleExecute (row) {
      const loader = this.$loading({
        text: '场景绑定中...'
      })
      SceneAPI.executeScene(`0${row.scene_status}`, row.scene_number).then(res => {
        loader.close()
        this.responseHandler(res, '场景执行成功')
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, '场景执行失败')
      })
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
      const loader = this.$loading({
        text: '场景删除中...'
      })
      RoomAPI.removeRoomScene(this.room, sceneNumber).then(res => {
        loader.close()
        this.responseHandler(res, '场景删除')
        if (res.message.includes('success')) {
          this.getRoomSceneList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, '场景删除')
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
