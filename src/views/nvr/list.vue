<template>
  <div class="page-container">
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备名称" v-model="searchModel.name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
        </template>
      </slot>
    </base-table>

    <el-dialog top="10%" width="760px" title="添加NVR" :visible.sync="createNVRVisible" :close-on-click-modal="false">

      <div slot="footer" class="dialog-footer text-center" >
        <el-button @click="createNVRVisible = false">取 消</el-button>
        <el-button type="primary" @click="doCreateAction">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import NVRAPI from '@/api/nvr'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  name: 'nvr-list',
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: true,
      tableData: [],
      columns: [],
      pageNo: PAGINATION_PAGENO,
      pageSize: PAGINATION_PAGESIZE,
      createNVRVisible: false,
      nvrModel: {

      },
      searchModel: {
        name: ''
      }
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getNvrList()
  },
  computed: {
    total () {
      return this.tableData.length || 0
    }
  },
  mounted () {
    // Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 50
    },
    getColumns () {
      return [{
        label: '通道',
        prop: 'channel',
        align: 'center'
      }, {
        label: '设备名称',
        prop: 'deviceName',
        align: 'center'
      }, {
        label: 'IP',
        prop: 'ip',
        align: 'center'
      }, {
        label: '端口',
        prop: 'port',
        align: 'center'
      }, {
        label: '开始时间',
        prop: 'startTime',
        align: 'center',
        formatter (val) {
          return val ? Helper.parseTime(val) : ''
        }
      }, {
        label: '结束时间',
        prop: 'endTime',
        align: 'center',
        formatter (val) {
          return val ? Helper.parseTime(val) : ''
        }
      }, {
        label: '操作',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolboxs = []
      const edit = <el-button size="tiny" icon="el-icon-edit" onClick={() => this.handleEdit(row)}></el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" onClick={() => this.handleDelete(row)}></el-button>
      toolboxs.push(edit)
      toolboxs.push(remove)
      return toolboxs
    },
    getNvrList () {
      this.tableLoading = true
      NVRAPI.getNvrList().then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.list
        } else {
          this.$message({
            message: resp.message || 'NVR 列表获取失败'
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
      this.pageNo = pageNo
      this.getNvrList()
    },
    onSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getNvrList()
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
    handleSearch () {

    },
    handleCreate () {
      this.createNVRVisible = true
    },
    doCreateAction () {

    },
    handleEdit (nvr) {

    },
    handleDelete (nvr) {
      this.$confirm('确认删除NVR记录？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemoveAction(nvr)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doRemoveAction (nvr) {
      NVRAPI.remove(nvr.id).then(res => {
        this.responseHandler(res, 'NVR删除')
        if (res.message.includes('success')) {
          this.getDeviceList()
        }
      }).catch(() => {
        this.responseHandler({message: 'error'}, 'NVR删除')
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
