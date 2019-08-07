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
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">创建</el-button>
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
        align: 'center'
      }, {
        label: '消息推送',
        prop: 'msg_alter',
        align: 'center'
      }, {
        label: '设备状态',
        prop: 'scene_status',
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
        <el-button size="tiny" icon="el-icon-view" title="查看" onClick={() => this.view(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-edit" title="编辑" onClick={() => this.edit(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-delete" title="删除" onClick={() => this.remove(row)}></el-button>
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
    handleCreate () {

    },
    view (row) {
      console.log('visit ', row)
    },
    edit (row) {
      console.log('edit ', row)
    },
    remove (row) {
      console.log('remove ', row)
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
