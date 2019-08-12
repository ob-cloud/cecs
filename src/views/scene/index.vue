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
          <el-select clearable class="caption-item" placeholder="所有场景" v-model="search.scene_number">
            <el-option label='所有场景' value=''></el-option>
          </el-select>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="场景名称" v-model="search.scene_name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-dropdown trigger="click" @command="handleSceneCommand">
            <el-button type="primary">
              创建<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="local">本地场景</el-dropdown-item>
              <el-dropdown-item command="remote">云端场景</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </slot>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import SceneAPI from '@/api/scene'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      tableLoading: true,
      tableHeight: 0,
      search: {
        scene_number: '',
        scene_name: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: []
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getSceneList()
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
        <el-button size="tiny" icon="el-icon-view" title="执行场景" onClick={() => this.view(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-edit" title="编辑" onClick={() => this.edit(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-delete" title="删除" onClick={() => this.handleRemove(row)}></el-button>
      ]
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
      this.getSceneList()
    },
    handleChangeStatus (row) {
      row.scene_status = 1 - row.scene_status
    },
    view (row) {
      const loading = this.$loading({
        lock: true,
        text: '正在执行场景...'
      })
      setTimeout(() => {
        loading.close()
      }, 1500)
    },
    edit (row) {
      console.log('edit ', row)
    },
    handleRemove (row) {
      this.$confirm('确认删除场景？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        // this.doRmemove(row.scene_status, row.scene_number)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doRmemove (sceneStatus, sceneNumber) {
      SceneAPI.removeScene(sceneStatus, sceneNumber).then(res => {
        console.log(res)
      })
    },
    handleSceneCommand (command) {
      command === 'local' && this.createLocalScene()
      command === 'remote' && this.createRemoteScene()
    },
    createLocalScene () {
      console.log('本地场景 ')
    },
    createRemoteScene () {
      console.log('云端场景 ')
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
