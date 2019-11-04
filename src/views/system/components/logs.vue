<template>
  <div class="device smart  ui-container">
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="执行人" v-model="search.operator"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入描述内容" v-model="search.sysDesc"></el-input>
          <el-select clearable class="caption-item" placeholder="类型" v-model="search.sysType">
            <el-option label='全部' value=''></el-option>
            <el-option label='设备管理' value='设备管理'></el-option>
            <el-option label='场景管理' value='场景管理'></el-option>
            <el-option label='用户管理' value='用户管理'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
      </slot>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import SystemAPI from '@/api/system'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: false,
      tableHeight: 0,
      search: {
        sysType: '',
        operator: '',
        sysDesc: '',
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
    this.getLogsList()
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
      this.tableHeight = Helper.calculateTableHeight() - 20
    },
    getColumns () {
      return [{
        label: '序号',
        prop: 'id',
        align: 'center'
      }, {
        label: '类型',
        prop: 'sysType',
        align: 'center'
      }, {
        label: '操作行为',
        prop: 'sysDesc',
        align: 'center'
      }, {
        label: '操作时间',
        prop: 'sysTime',
        align: 'center',
        formatter (val) {
          return val && Helper.parseTime(val)
        }
      }, {
        label: '执行人',
        prop: 'operator',
        align: 'center',
      }]
    },
    getLogsList () {
      this.tableLoading = true
      SystemAPI.getSysLogs(this.search).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
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
      this.getLogsList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getLogsList()
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getLogsList()
    }
  }
}
</script>
